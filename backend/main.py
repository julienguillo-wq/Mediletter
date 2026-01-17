"""
Backend FastAPI pour MediLetter
Pipeline multi-étapes pour la génération de lettres médicales
Version améliorée : 1 requête par problème pour une meilleure qualité
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import anthropic
import os
import json
import asyncio
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

from prompts import PROMPT_EXTRACTION, PROMPT_SECTIONS, PROMPT_ASSEMBLAGE

# ==============================================================================
# Configuration
# ==============================================================================

app = FastAPI(
    title="MediLetter API",
    description="API pour la génération de lettres médicales via pipeline multi-étapes",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Client Anthropic (clé API via variable d'environnement)
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Stockage temporaire des sessions (en mémoire)
sessions: dict = {}

# Modèles disponibles
MODELS = {
    "standard": "claude-sonnet-4-20250514",
    "haute_qualite": "claude-sonnet-4-20250514",
    "ultra_haute_qualite": "claude-opus-4-20250514"
}


# ==============================================================================
# Modèles Pydantic
# ==============================================================================

class AnalyserRequest(BaseModel):
    session_id: str
    context: Optional[str] = None
    extra_info: Optional[str] = None
    notes: Optional[str] = None
    cr: Optional[str] = None
    images_base64: Optional[list[str]] = None
    pdfs_base64: Optional[list[str]] = None


class AnalyserResponse(BaseModel):
    session_id: str
    diagnostic_principal: str
    problemes: list[str]
    donnees_extraites: dict
    status: str


class GenererRequest(BaseModel):
    session_id: str
    letter_type: str = "sortie"  # "sortie" ou "transfert"
    diagnostic_principal: str  # Possiblement modifié par l'utilisateur
    problemes_valides: list[str]  # Liste validée/modifiée par l'utilisateur
    qualite: str = "haute_qualite"  # "standard", "haute_qualite", "ultra_haute_qualite"


class GenererResponse(BaseModel):
    session_id: str
    letter: str
    sections: Optional[str] = None
    status: str


# ==============================================================================
# Helpers
# ==============================================================================

def build_content_blocks(request: AnalyserRequest) -> list:
    """Construit les blocs de contenu pour l'API Claude (texte + images)."""
    content = []

    # Ajouter les images en base64
    if request.images_base64:
        for img_b64 in request.images_base64:
            # Détecter le type MIME
            if img_b64.startswith("data:"):
                header, data = img_b64.split(",", 1)
                media_type = header.split(":")[1].split(";")[0]
            else:
                media_type = "image/jpeg"
                data = img_b64

            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media_type,
                    "data": data
                }
            })

    # Ajouter les PDFs en base64
    if request.pdfs_base64:
        for pdf_b64 in request.pdfs_base64:
            if pdf_b64.startswith("data:"):
                _, data = pdf_b64.split(",", 1)
            else:
                data = pdf_b64

            content.append({
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": data
                }
            })

    # Ajouter les textes
    text_parts = []
    if request.context:
        text_parts.append(f"## Contexte / Lettre d'entrée\n{request.context}")
    if request.extra_info:
        text_parts.append(f"## Informations complémentaires\n{request.extra_info}")
    if request.notes:
        text_parts.append(f"## Notes de suite\n{request.notes}")
    if request.cr:
        text_parts.append(f"## Comptes rendus\n{request.cr}")

    if text_parts:
        content.append({
            "type": "text",
            "text": "\n\n".join(text_parts)
        })

    return content


def identifier_type_probleme(probleme: str) -> str:
    """Identifie le type de problème pour sélectionner le bon template."""
    probleme_lower = probleme.lower()
    
    # Mapping des mots-clés vers les types de templates
    mappings = [
        (["anémie", "anemie"], "ANEMIE"),
        (["carence", "vitamine d", "b9", "b12", "fer"], "CARENCES"),
        (["insuffisance rénale aiguë", "insuffisance renale aigue", "ira ", "kdigo i", "kdigo ii", "kdigo iii"], "IRA"),
        (["insuffisance rénale chronique", "insuffisance renale chronique", "irc", "g3a", "g3b", "g4", "g5"], "IRC"),
        (["insuffisance cardiaque", "fevg", "décompensation cardiaque"], "INSUFFISANCE_CARDIAQUE"),
        (["hta", "hypertension"], "HTA"),
        (["trouble neurocognitif", "démence", "demence", "cdr", "moca"], "TROUBLE_NEUROCOGNITIF"),
        (["état confusionnel", "etat confusionnel", "confusion", "delirium"], "ETAT_CONFUSIONNEL"),
        (["chute", "marche", "équilibre", "equilibre", "tinetti"], "CHUTES"),
        (["dénutrition", "denutrition", "malnutrition", "mna", "nrs"], "DENUTRITION"),
        (["constipation", "coprostase"], "CONSTIPATION"),
        (["incontinence urinaire", "urgenturie"], "INCONTINENCE"),
        (["rétention", "retention", "globe", "sonde urinaire"], "RETENTION"),
        (["escarre"], "ESCARRE"),
        (["sars", "covid", "cov2"], "COVID"),
        (["alcool", "oh à risque", "oh a risque", "consommation oh"], "ALCOOL"),
        (["isolement", "social"], "ISOLEMENT"),
        (["ostéoporose", "osteoporose", "tassement"], "OSTEOPOROSE"),
        (["polymédication", "polymedication"], "POLYMEDICATION"),
        (["presbyacousie"], "PRESBYACOUSIE"),
    ]
    
    for keywords, type_template in mappings:
        if any(kw in probleme_lower for kw in keywords):
            return type_template
    
    return "GENERIQUE"


def generer_section_probleme(
    probleme: str,
    numero: int,
    donnees_extraites: dict,
    textes_originaux: str,
    model: str,
    est_diagnostic_principal: bool = False
) -> str:
    """Génère la section pour UN problème spécifique."""
    
    type_probleme = identifier_type_probleme(probleme)
    
    # Construire le prompt spécifique pour ce problème
    prompt_user = f"""## PROBLÈME À RÉDIGER
Numéro : {numero}
Titre : {probleme}
Est le diagnostic principal : {"OUI" if est_diagnostic_principal else "NON"}
Type de template à utiliser : {type_probleme}

## DONNÉES DU PATIENT (utilise ces valeurs EXACTES)

### Biologie
{json.dumps(donnees_extraites.get('biologie', {}), ensure_ascii=False, indent=2)}

### ECG
{json.dumps(donnees_extraites.get('ecg', {}), ensure_ascii=False, indent=2)}

### Examens gériatriques
{json.dumps(donnees_extraites.get('examens_geriatriques', {}), ensure_ascii=False, indent=2)}

### Examens spécifiques
{json.dumps(donnees_extraites.get('examens_specifiques', {}), ensure_ascii=False, indent=2)}

### Imagerie
{json.dumps(donnees_extraites.get('imagerie', {}), ensure_ascii=False, indent=2)}

### Données patient
{json.dumps(donnees_extraites.get('donnees_patient', donnees_extraites.get('patient', {})), ensure_ascii=False, indent=2)}

### Évolution
{json.dumps(donnees_extraites.get('evolution', {}), ensure_ascii=False, indent=2)}

### Antécédents
{json.dumps(donnees_extraites.get('antecedents', []), ensure_ascii=False, indent=2)}

### Traitement d'entrée
{json.dumps(donnees_extraites.get('traitement_entree', donnees_extraites.get('traitements_entree', [])), ensure_ascii=False, indent=2)}

### Traitement de sortie
{json.dumps(donnees_extraites.get('traitement_sortie', []), ensure_ascii=False, indent=2)}

## TEXTES ORIGINAUX DU DOSSIER (pour contexte supplémentaire)
{textes_originaux}

---

## INSTRUCTIONS CRITIQUES
1. Utilise le template "{type_probleme}" du prompt système
2. REMPLACE tous les [X] par les valeurs RÉELLES ci-dessus
3. Si une valeur n'est pas disponible, écris "non disponible" - NE SUPPRIME PAS la ligne
4. Inclus TOUTES les valeurs de laboratoire pertinentes pour ce problème
5. Inclus l'ECG si c'est pertinent (chutes, HTA, insuffisance cardiaque, confusion)
6. N'ajoute AUCUNE introduction ni conclusion

Génère maintenant la section pour ce problème uniquement."""

    response = client.messages.create(
        model=model,
        max_tokens=4000,
        system=PROMPT_SECTIONS,
        messages=[{"role": "user", "content": prompt_user}]
    )
    
    return response.content[0].text


# ==============================================================================
# Routes
# ==============================================================================

@app.get("/")
async def root():
    """Health check."""
    return {"message": "MediLetter API v2.0.0", "status": "ok"}


@app.post("/analyser", response_model=AnalyserResponse)
async def analyser(request: AnalyserRequest):
    """
    Étape 1 : Analyse et extraction des données.
    - Reçoit les textes et fichiers du frontend
    - Appelle Claude pour extraire les informations structurées
    - Stocke les données pour l'étape suivante
    """
    try:
        # Construire le contenu pour Claude
        content = build_content_blocks(request)

        if not content:
            raise HTTPException(status_code=400, detail="Aucun contenu à analyser")

        # Appel à Claude pour extraction
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            system=PROMPT_EXTRACTION,
            messages=[{"role": "user", "content": content}]
        )

        extraction_text = response.content[0].text

        # Parser le JSON de la réponse
        try:
            if "```json" in extraction_text:
                json_str = extraction_text.split("```json")[1].split("```")[0]
            elif "```" in extraction_text:
                json_str = extraction_text.split("```")[1].split("```")[0]
            else:
                json_str = extraction_text

            extraction = json.loads(json_str.strip())
        except json.JSONDecodeError:
            extraction = {
                "diagnostic_principal": "À déterminer",
                "problemes": ["Problème principal à définir"],
                "donnees_extraites": {"raw_extraction": extraction_text}
            }

        # Extraire les champs structurés
        diagnostic_principal = extraction.get("diagnostic_principal", "À déterminer")
        problemes = extraction.get("problemes", ["Problème principal à définir"])
        
        # Les données extraites peuvent être à la racine ou dans "donnees_extraites"
        donnees_extraites = extraction.get("donnees_extraites", {})
        
        # Fusionner les données de la racine si présentes
        for key in ["biologie", "ecg", "imagerie", "examens_geriatriques", "examens_specifiques", 
                    "donnees_patient", "evolution", "antecedents", "traitement_entree", "traitement_sortie"]:
            if key in extraction and key not in donnees_extraites:
                donnees_extraites[key] = extraction[key]

        # Stocker en session
        sessions[request.session_id] = {
            "context": request.context,
            "extra_info": request.extra_info,
            "notes": request.notes,
            "cr": request.cr,
            "diagnostic_principal": diagnostic_principal,
            "problemes": problemes,
            "donnees_extraites": donnees_extraites,
            "images_count": len(request.images_base64) if request.images_base64 else 0,
            "pdfs_count": len(request.pdfs_base64) if request.pdfs_base64 else 0
        }

        return AnalyserResponse(
            session_id=request.session_id,
            diagnostic_principal=diagnostic_principal,
            problemes=problemes,
            donnees_extraites=donnees_extraites,
            status="extracted"
        )

    except anthropic.APIError as e:
        raise HTTPException(status_code=500, detail=f"Erreur API Claude: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.post("/generer", response_model=GenererResponse)
async def generer(request: GenererRequest):
    """
    Étape 2 : Génération de la lettre.
    - Récupère les données extraites de la session
    - Appelle Claude pour CHAQUE problème (1 requête par problème)
    - Appelle Claude pour assembler la lettre finale
    """
    # Vérifier que la session existe
    if request.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session non trouvée. Appelez /analyser d'abord."
        )

    session_data = sessions[request.session_id]
    
    # Sélectionner le modèle selon la qualité demandée
    model = MODELS.get(request.qualite, MODELS["haute_qualite"])

    try:
        # Construire les textes originaux
        textes_originaux = []
        if session_data.get('context'):
            textes_originaux.append(f"### Contexte / Lettre d'entrée\n{session_data['context']}")
        if session_data.get('extra_info'):
            textes_originaux.append(f"### Informations complémentaires du médecin\n{session_data['extra_info']}")
        if session_data.get('notes'):
            textes_originaux.append(f"### Notes de suite\n{session_data['notes']}")
        if session_data.get('cr'):
            textes_originaux.append(f"### Comptes rendus\n{session_data['cr']}")

        textes_section = "\n\n".join(textes_originaux) if textes_originaux else "Aucun texte fourni"

        # =====================================================================
        # ÉTAPE 2a : Génération des sections - 1 REQUÊTE PAR PROBLÈME
        # =====================================================================
        
        sections_generees = []
        donnees_extraites = session_data['donnees_extraites']
        
        for i, probleme in enumerate(request.problemes_valides):
            est_diagnostic_principal = (i == 0)  # Le premier problème est le diagnostic principal
            
            section = generer_section_probleme(
                probleme=probleme,
                numero=i + 1,
                donnees_extraites=donnees_extraites,
                textes_originaux=textes_section,
                model=model,
                est_diagnostic_principal=est_diagnostic_principal
            )
            
            sections_generees.append(f"## Problème {i + 1} : {probleme}\n\n{section}")
        
        # Assembler toutes les sections
        sections_text = "\n\n---\n\n".join(sections_generees)

        # =====================================================================
        # ÉTAPE 2b : Assemblage final
        # =====================================================================
        
        assemblage_context = f"""## TYPE DE LETTRE
{request.letter_type}

## DIAGNOSTIC PRINCIPAL
{request.diagnostic_principal}

## DONNÉES DU PATIENT
{json.dumps(donnees_extraites.get('donnees_patient', donnees_extraites.get('patient', {})), ensure_ascii=False, indent=2)}

## EXAMENS GÉRIATRIQUES (pour le tableau)
{json.dumps(donnees_extraites.get('examens_geriatriques', {}), ensure_ascii=False, indent=2)}

## TRAITEMENT DE SORTIE
{json.dumps(donnees_extraites.get('traitement_sortie', []), ensure_ascii=False, indent=2)}

## SECTIONS DES PROBLÈMES (à insérer SANS MODIFICATION)

{sections_text}

---

## INSTRUCTIONS
1. Assemble ces sections dans la lettre finale
2. NE MODIFIE PAS le contenu des sections
3. Ajoute le tableau gériatrique avec les scores ci-dessus
4. Consolide les propositions en "Éléments à surveiller"
5. Liste le traitement de sortie
6. PAS d'introduction ni conclusion superflue"""

        assemblage_response = client.messages.create(
            model=model,
            max_tokens=8000,
            system=PROMPT_ASSEMBLAGE,
            messages=[{"role": "user", "content": assemblage_context}]
        )
        
        letter = assemblage_response.content[0].text

        return GenererResponse(
            session_id=request.session_id,
            letter=letter,
            sections=sections_text,
            status="generated"
        )

    except anthropic.APIError as e:
        raise HTTPException(status_code=500, detail=f"Erreur API Claude: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Nettoyer une session après utilisation."""
    if session_id in sessions:
        del sessions[session_id]
        return {"status": "deleted", "session_id": session_id}
    raise HTTPException(status_code=404, detail="Session non trouvée")


@app.get("/sessions")
async def list_sessions():
    """Liste les sessions actives (debug)."""
    return {
        "count": len(sessions),
        "session_ids": list(sessions.keys())
    }


# ==============================================================================
# Lancement
# ==============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
