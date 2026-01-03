"""
Backend FastAPI pour MediLetter
Pipeline multi-étapes pour la génération de lettres médicales
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import anthropic
import os
import json
import base64
from io import BytesIO
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
    version="1.0.0"
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
                # Format data URL
                header, data = img_b64.split(",", 1)
                media_type = header.split(":")[1].split(";")[0]
            else:
                # Assume JPEG par défaut
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

    # Ajouter les PDFs en base64 (Claude supporte les PDFs)
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


# ==============================================================================
# Routes
# ==============================================================================

@app.get("/")
async def root():
    """Health check."""
    return {"message": "MediLetter API v1.0.0", "status": "ok"}


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
            # Chercher le JSON dans la réponse
            if "```json" in extraction_text:
                json_str = extraction_text.split("```json")[1].split("```")[0]
            elif "```" in extraction_text:
                json_str = extraction_text.split("```")[1].split("```")[0]
            else:
                json_str = extraction_text

            extraction = json.loads(json_str.strip())
        except json.JSONDecodeError:
            # Si pas de JSON valide, créer une structure par défaut
            extraction = {
                "diagnostic_principal": "À déterminer",
                "problemes": ["Problème principal à définir"],
                "donnees_extraites": {"raw_extraction": extraction_text}
            }

        # Extraire les champs structurés
        diagnostic_principal = extraction.get("diagnostic_principal", "À déterminer")
        problemes = extraction.get("problemes", ["Problème principal à définir"])
        donnees_extraites = extraction.get("donnees_extraites", extraction)

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
    - Appelle Claude pour générer les sections
    - Appelle Claude pour assembler la lettre finale
    """
    # Vérifier que la session existe
    if request.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session non trouvée. Appelez /analyser d'abord."
        )

    session_data = sessions[request.session_id]

    try:
        # Construire le contexte avec les problèmes VALIDÉS par l'utilisateur
        problemes_formated = "\n".join([f"{i+1}. {p}" for i, p in enumerate(request.problemes_valides)])

        # Construire les sections de texte original
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

        generation_context = f"""## DIAGNOSTIC PRINCIPAL (validé par le médecin)
{request.diagnostic_principal}

## LISTE DES PROBLÈMES À TRAITER (validée et ordonnée par le médecin)
{problemes_formated}

## TEXTES ORIGINAUX DU DOSSIER
{textes_section}

## DONNÉES EXTRAITES (structurées)
{json.dumps(session_data['donnees_extraites'], ensure_ascii=False, indent=2)}"""

        # --- Étape 2a : Génération des sections ---
        sections_response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            system=PROMPT_SECTIONS,
            messages=[{
                "role": "user",
                "content": generation_context
            }]
        )
        sections_text = sections_response.content[0].text

        # --- Étape 2b : Assemblage final ---
        assemblage_response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            system=PROMPT_ASSEMBLAGE,
            messages=[{
                "role": "user",
                "content": f"Type de lettre : {request.letter_type}\n\nDiagnostic principal : {request.diagnostic_principal}\n\nSections à assembler :\n{sections_text}"
            }]
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
