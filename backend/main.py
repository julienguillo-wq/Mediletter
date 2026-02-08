"""
Backend FastAPI pour MediLetter
Pipeline multi-étapes pour la génération de lettres médicales
Version 2.1 : Requêtes parallélisées pour performance optimale
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import anthropic
import os
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from datetime import datetime, timedelta
from pathlib import Path

# Charger les variables d'environnement depuis .env
load_dotenv()

from prompts import PROMPT_EXTRACTION, PROMPT_SECTIONS, PROMPT_ASSEMBLAGE

# ==============================================================================
# Configuration
# ==============================================================================

app = FastAPI(
    title="MediLetter API",
    description="API pour la génération de lettres médicales via pipeline multi-étapes",
    version="2.1.0"
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

# Thread pool pour parallélisation des appels API
executor = ThreadPoolExecutor(max_workers=10)

# ==============================================================================
# Logging Usage
# ==============================================================================

LOGS_DIR = Path(__file__).parent / "logs"
USAGE_FILE = LOGS_DIR / "usage.json"
CORRECTIONS_FILE = LOGS_DIR / "corrections.json"

def ensure_logs_dir():
    """Crée le répertoire logs s'il n'existe pas."""
    LOGS_DIR.mkdir(exist_ok=True)
    if not USAGE_FILE.exists():
        USAGE_FILE.write_text("[]", encoding="utf-8")
    if not CORRECTIONS_FILE.exists():
        CORRECTIONS_FILE.write_text("[]", encoding="utf-8")

# Tarifs par million de tokens (USD)
PRICING = {
    "opus": {"input": 15, "output": 75},
    "sonnet": {"input": 3, "output": 15}
}
EUR_RATE = 0.92

def get_model_type(model_id: str) -> str:
    """Retourne le type de modèle (opus/sonnet) depuis l'ID."""
    if "opus" in model_id.lower():
        return "opus"
    return "sonnet"

def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Calcule le coût en euros."""
    model_type = get_model_type(model)
    pricing = PRICING.get(model_type, PRICING["sonnet"])

    cost_usd = (input_tokens * pricing["input"] / 1_000_000) + (output_tokens * pricing["output"] / 1_000_000)
    cost_eur = cost_usd * EUR_RATE
    return round(cost_eur, 4)

def log_usage(endpoint: str, model: str = None, tokens_input: int = 0, tokens_output: int = 0,
              cost_eur: float = 0, images_count: int = 0, pdfs_count: int = 0, success: bool = True,
              session_id: str = None, user_email: str = None):
    """Enregistre une requête dans le fichier de logs."""
    ensure_logs_dir()

    entry = {
        "timestamp": datetime.now().isoformat(),
        "session_id": session_id,
        "user_email": user_email,
        "endpoint": endpoint,
        "model": get_model_type(model) if model else None,
        "tokens_input": tokens_input,
        "tokens_output": tokens_output,
        "tokens": tokens_input + tokens_output,
        "cost_eur": cost_eur,
        "images_count": images_count,
        "pdfs_count": pdfs_count,
        "success": success
    }

    try:
        # Lire les logs existants
        logs = json.loads(USAGE_FILE.read_text(encoding="utf-8"))
        logs.append(entry)

        # Garder seulement les 1000 dernières entrées
        if len(logs) > 1000:
            logs = logs[-1000:]

        USAGE_FILE.write_text(json.dumps(logs, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception as e:
        print(f"Erreur logging: {e}")

def get_usage_stats() -> dict:
    """Retourne les statistiques d'utilisation."""
    ensure_logs_dir()

    try:
        logs = json.loads(USAGE_FILE.read_text(encoding="utf-8"))
    except:
        logs = []

    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = now - timedelta(days=7)

    today_logs = []
    week_logs = []

    for log in logs:
        try:
            ts = datetime.fromisoformat(log["timestamp"])
            if ts >= today_start:
                today_logs.append(log)
            if ts >= week_ago:
                week_logs.append(log)
        except:
            continue

    def get_tokens(log):
        return log.get("tokens") or log.get("tokens_real") or 0

    def get_cost(log):
        return log.get("cost_eur", 0) or 0

    return {
        "today": {
            "requests": len(today_logs),
            "tokens": sum(get_tokens(l) for l in today_logs),
            "cost_eur": round(sum(get_cost(l) for l in today_logs), 2),
            "success_rate": round(sum(1 for l in today_logs if l.get("success")) / len(today_logs) * 100, 1) if today_logs else 100
        },
        "last_7_days": {
            "requests": len(week_logs),
            "tokens": sum(get_tokens(l) for l in week_logs),
            "cost_eur": round(sum(get_cost(l) for l in week_logs), 2),
            "success_rate": round(sum(1 for l in week_logs if l.get("success")) / len(week_logs) * 100, 1) if week_logs else 100
        },
        "last_20_requests": logs[-20:][::-1] if logs else [],
        "last_request": logs[-1] if logs else None
    }


# ==============================================================================
# Modèles Pydantic
# ==============================================================================

class AnalyserRequest(BaseModel):
    session_id: str
    user_email: Optional[str] = None
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


# === Nouveaux modèles pour génération parallèle par section ===

class GenererSectionRequest(BaseModel):
    session_id: str
    user_email: Optional[str] = None
    probleme: str  # Un seul problème
    probleme_index: int  # Index du problème (1-based)
    is_diagnostic_principal: bool = False  # Si c'est le diagnostic principal


class GenererSectionResponse(BaseModel):
    session_id: str
    probleme_index: int
    section: str
    status: str


class RegenerationSectionRequest(BaseModel):
    session_id: str
    user_email: Optional[str] = None
    probleme: str
    probleme_index: int
    section_actuelle: str
    instruction: str  # Instruction de modification
    is_diagnostic_principal: bool = False


class AssemblerRequest(BaseModel):
    session_id: str
    user_email: Optional[str] = None
    letter_type: str = "sortie"
    diagnostic_principal: str
    sections: list[str]  # Liste des sections déjà générées dans l'ordre


class AssemblerResponse(BaseModel):
    session_id: str
    letter: str
    status: str


class AnalyserEntreeRequest(BaseModel):
    transcription: str
    langue: str = "italien"  # "italien" ou "francais"
    images_base64: Optional[list[str]] = None
    pdfs_base64: Optional[list[str]] = None


class GenererEntreeRequest(BaseModel):
    donnees_json: dict
    type_lettre: str  # "NEURO", "MI", "MSQ", "ANAM_MSQ"
    sexe: str = "M"  # "M" ou "F"


class LogCorrectionRequest(BaseModel):
    type: str  # "problems" ou "section"
    generated: str | list  # Texte ou liste générée par Claude
    validated: str | list  # Texte ou liste après modifications utilisateur
    section_index: Optional[int] = None  # Numéro de section (pour type="section")


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


def generer_section_probleme_sync(
    probleme: str,
    numero: int,
    donnees_extraites: dict,
    textes_originaux: str,
    model: str,
    est_diagnostic_principal: bool = False
) -> dict:
    """
    Génère la section pour UN problème spécifique (version synchrone).
    Retourne un dict avec le numéro et le contenu pour réordonner après.
    """
    
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
    
    return {
        "numero": numero,
        "probleme": probleme,
        "contenu": response.content[0].text
    }


async def generer_section_probleme_async(
    probleme: str,
    numero: int,
    donnees_extraites: dict,
    textes_originaux: str,
    model: str,
    est_diagnostic_principal: bool = False
) -> dict:
    """
    Version async qui exécute la fonction sync dans un thread pool.
    Permet la parallélisation des appels API.
    """
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        executor,
        generer_section_probleme_sync,
        probleme,
        numero,
        donnees_extraites,
        textes_originaux,
        model,
        est_diagnostic_principal
    )


# ==============================================================================
# Routes
# ==============================================================================

@app.get("/")
async def root():
    """Health check."""
    return {"message": "MediLetter API v2.1.0 - Parallélisé", "status": "ok"}


@app.get("/admin/stats")
async def admin_stats():
    """Retourne les statistiques d'utilisation de l'API."""
    return get_usage_stats()


@app.post("/log-corrections")
async def log_corrections(request: LogCorrectionRequest):
    """
    Enregistre les corrections apportées par l'utilisateur.
    Permet de suivre les différences entre le texte généré et le texte validé.
    """
    ensure_logs_dir()

    # Déterminer si des changements ont été apportés
    if request.type == "problems":
        # Comparer les listes de problèmes
        gen_list = request.generated if isinstance(request.generated, list) else []
        val_list = request.validated if isinstance(request.validated, list) else []
        has_changes = gen_list != val_list
    else:
        # Comparer les textes de section
        has_changes = str(request.generated).strip() != str(request.validated).strip()

    entry = {
        "timestamp": datetime.now().isoformat(),
        "type": request.type,
        "generated": request.generated,
        "validated": request.validated,
        "section_index": request.section_index,
        "has_changes": has_changes
    }

    try:
        # Lire les corrections existantes
        corrections = json.loads(CORRECTIONS_FILE.read_text(encoding="utf-8"))
        corrections.append(entry)

        # Garder seulement les 500 dernières entrées
        if len(corrections) > 500:
            corrections = corrections[-500:]

        CORRECTIONS_FILE.write_text(json.dumps(corrections, indent=2, ensure_ascii=False), encoding="utf-8")

        return {"status": "logged", "has_changes": has_changes}
    except Exception as e:
        print(f"Erreur logging correction: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur logging: {str(e)}")


@app.get("/admin/corrections")
async def admin_corrections():
    """
    Retourne les corrections qui ont des changements (has_changes: true).
    """
    ensure_logs_dir()

    try:
        corrections = json.loads(CORRECTIONS_FILE.read_text(encoding="utf-8"))
    except:
        corrections = []

    # Filtrer pour ne garder que les corrections avec changements
    corrections_with_changes = [c for c in corrections if c.get("has_changes", False)]

    # Retourner les 50 dernières corrections avec changements (les plus récentes en premier)
    return {
        "total": len(corrections),
        "with_changes": len(corrections_with_changes),
        "corrections": corrections_with_changes[-50:][::-1]
    }


@app.get("/admin/sessions")
async def admin_sessions():
    """
    Retourne les logs regroupés par session (lettre).
    Chaque session représente une lettre générée.
    """
    ensure_logs_dir()

    try:
        logs = json.loads(USAGE_FILE.read_text(encoding="utf-8"))
    except:
        logs = []

    # Regrouper par session_id
    sessions_dict = {}
    for log in logs:
        sid = log.get("session_id")
        if not sid:
            continue

        if sid not in sessions_dict:
            sessions_dict[sid] = {
                "session_id": sid,
                "user_email": log.get("user_email"),
                "start_time": log.get("timestamp"),
                "end_time": log.get("timestamp"),
                "requests": [],
                "requests_count": 0,
                "total_tokens": 0,
                "total_cost": 0,
                "images_count": 0,
                "pdfs_count": 0,
                "success": True
            }

        session = sessions_dict[sid]
        session["requests"].append(log)
        session["requests_count"] += 1
        session["total_tokens"] += log.get("tokens", 0)
        session["total_cost"] += log.get("cost_eur", 0) or 0
        session["images_count"] = max(session["images_count"], log.get("images_count", 0))
        session["pdfs_count"] = max(session["pdfs_count"], log.get("pdfs_count", 0))

        # Mettre à jour end_time
        if log.get("timestamp", "") > session["end_time"]:
            session["end_time"] = log.get("timestamp")

        # Si une requête échoue, la session est marquée comme échouée
        if not log.get("success", True):
            session["success"] = False

    # Convertir en liste et trier par date de début (plus récent en premier)
    sessions_list = list(sessions_dict.values())
    sessions_list.sort(key=lambda x: x["start_time"], reverse=True)

    # Arrondir les coûts et retirer les détails des requêtes pour la liste
    for session in sessions_list:
        session["total_cost"] = round(session["total_cost"], 4)
        del session["requests"]  # On garde juste le résumé pour la liste

    return {
        "sessions_count": len(sessions_list),
        "sessions": sessions_list[:50]  # Les 50 dernières sessions
    }


@app.get("/admin/session/{session_id}")
async def admin_session_detail(session_id: str):
    """
    Retourne les détails d'une session spécifique.
    """
    ensure_logs_dir()

    try:
        logs = json.loads(USAGE_FILE.read_text(encoding="utf-8"))
    except:
        logs = []

    # Filtrer les logs pour cette session
    session_logs = [log for log in logs if log.get("session_id") == session_id]

    if not session_logs:
        raise HTTPException(status_code=404, detail="Session non trouvée")

    # Calculer les totaux
    total_tokens = sum(log.get("tokens", 0) for log in session_logs)
    total_cost = sum(log.get("cost_eur", 0) or 0 for log in session_logs)
    images_count = max((log.get("images_count", 0) for log in session_logs), default=0)
    pdfs_count = max((log.get("pdfs_count", 0) for log in session_logs), default=0)
    success = all(log.get("success", True) for log in session_logs)

    # Récupérer l'email du premier log qui en contient un
    user_email = None
    for log in session_logs:
        if log.get("user_email"):
            user_email = log["user_email"]
            break

    return {
        "session_id": session_id,
        "user_email": user_email,
        "start_time": session_logs[0].get("timestamp") if session_logs else None,
        "end_time": session_logs[-1].get("timestamp") if session_logs else None,
        "requests_count": len(session_logs),
        "total_tokens": total_tokens,
        "total_cost": round(total_cost, 4),
        "images_count": images_count,
        "pdfs_count": pdfs_count,
        "success": success,
        "requests": session_logs
    }


VDR_ENDPOINTS = {"/analyser-entree", "/generer-entree"}


@app.get("/admin/vdr/stats")
async def admin_vdr_stats():
    """Retourne les statistiques d'utilisation VDR uniquement."""
    ensure_logs_dir()

    try:
        logs = json.loads(USAGE_FILE.read_text(encoding="utf-8"))
    except:
        logs = []

    vdr_logs = [l for l in logs if l.get("endpoint") in VDR_ENDPOINTS]

    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = now - timedelta(days=7)

    today_logs = []
    week_logs = []

    for log in vdr_logs:
        try:
            ts = datetime.fromisoformat(log["timestamp"])
            if ts >= today_start:
                today_logs.append(log)
            if ts >= week_ago:
                week_logs.append(log)
        except:
            continue

    def get_tokens(log):
        return log.get("tokens") or 0

    def get_cost(log):
        return log.get("cost_eur", 0) or 0

    return {
        "today": {
            "requests": len(today_logs),
            "tokens": sum(get_tokens(l) for l in today_logs),
            "cost_eur": round(sum(get_cost(l) for l in today_logs), 2),
            "success_rate": round(sum(1 for l in today_logs if l.get("success")) / len(today_logs) * 100, 1) if today_logs else 100
        },
        "last_7_days": {
            "requests": len(week_logs),
            "tokens": sum(get_tokens(l) for l in week_logs),
            "cost_eur": round(sum(get_cost(l) for l in week_logs), 2),
            "success_rate": round(sum(1 for l in week_logs if l.get("success")) / len(week_logs) * 100, 1) if week_logs else 100
        }
    }


@app.get("/admin/vdr/logs")
async def admin_vdr_logs():
    """Retourne les derniers appels VDR."""
    ensure_logs_dir()

    try:
        logs = json.loads(USAGE_FILE.read_text(encoding="utf-8"))
    except:
        logs = []

    vdr_logs = [l for l in logs if l.get("endpoint") in VDR_ENDPOINTS]

    # Retourner les 100 derniers, plus récents en premier
    return {
        "total": len(vdr_logs),
        "logs": vdr_logs[-100:][::-1]
    }


@app.post("/analyser", response_model=AnalyserResponse)
async def analyser(request: AnalyserRequest):
    """
    Étape 1 : Analyse et extraction des données.
    - Reçoit les textes et fichiers du frontend
    - Appelle Claude pour extraire les informations structurées
    - Stocke les données pour l'étape suivante
    """
    # Compter les fichiers
    images_count = len(request.images_base64) if request.images_base64 else 0
    pdfs_count = len(request.pdfs_base64) if request.pdfs_base64 else 0

    try:
        # Construire le contenu pour Claude
        content = build_content_blocks(request)

        if not content:
            raise HTTPException(status_code=400, detail="Aucun contenu à analyser")

        # Appel à Claude pour extraction (UHQ forcé pour l'analyse)
        response = client.messages.create(
            model=MODELS["ultra_haute_qualite"],  # UHQ pour la recherche des problèmes
            max_tokens=8000,
            system=PROMPT_EXTRACTION,
            messages=[{"role": "user", "content": content}]
        )

        # Récupérer les tokens et calculer le coût
        tokens_input = response.usage.input_tokens
        tokens_output = response.usage.output_tokens
        model_used = MODELS["ultra_haute_qualite"]
        cost_eur = calculate_cost(model_used, tokens_input, tokens_output)

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
            "images_count": images_count,
            "pdfs_count": pdfs_count
        }

        # Logger la requête
        log_usage("/analyser", model_used, tokens_input, tokens_output, cost_eur, images_count, pdfs_count, success=True, session_id=request.session_id, user_email=request.user_email)

        return AnalyserResponse(
            session_id=request.session_id,
            diagnostic_principal=diagnostic_principal,
            problemes=problemes,
            donnees_extraites=donnees_extraites,
            status="extracted"
        )

    except anthropic.APIError as e:
        # Logger l'échec
        log_usage("/analyser", MODELS["ultra_haute_qualite"], 0, 0, 0, images_count, pdfs_count, success=False, session_id=request.session_id, user_email=request.user_email)
        raise HTTPException(status_code=500, detail=f"Erreur API Claude: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.post("/generer", response_model=GenererResponse)
async def generer(request: GenererRequest):
    """
    Étape 2 : Génération de la lettre.
    - Récupère les données extraites de la session
    - Appelle Claude pour CHAQUE problème EN PARALLÈLE
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
        # ÉTAPE 2a : Génération des sections - EN PARALLÈLE
        # =====================================================================
        
        donnees_extraites = session_data['donnees_extraites']
        
        # Créer toutes les tâches async pour les problèmes
        tasks = []
        for i, probleme in enumerate(request.problemes_valides):
            est_diagnostic_principal = (i == 0)
            
            task = generer_section_probleme_async(
                probleme=probleme,
                numero=i + 1,
                donnees_extraites=donnees_extraites,
                textes_originaux=textes_section,
                model=model,
                est_diagnostic_principal=est_diagnostic_principal
            )
            tasks.append(task)
        
        # Exécuter toutes les tâches en parallèle
        resultats = await asyncio.gather(*tasks)
        
        # Trier les résultats par numéro (au cas où ils reviennent dans le désordre)
        resultats_tries = sorted(resultats, key=lambda x: x["numero"])
        
        # Assembler les sections dans l'ordre
        sections_generees = []
        for resultat in resultats_tries:
            sections_generees.append(
                f"## Problème {resultat['numero']} : {resultat['probleme']}\n\n{resultat['contenu']}"
            )
        
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


# ==============================================================================
# NOUVEAUX ENDPOINTS pour génération parallèle et review des sections
# ==============================================================================

@app.post("/generer-section", response_model=GenererSectionResponse)
async def generer_section(request: GenererSectionRequest):
    """
    Génère UNE SEULE section pour un problème donné.
    Permet la parallélisation côté frontend.
    """
    if request.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session non trouvée. Appelez /analyser d'abord."
        )

    session_data = sessions[request.session_id]

    try:
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

        # Contexte de génération pour UN SEUL problème
        generation_context = f"""## DIAGNOSTIC PRINCIPAL
{session_data.get('diagnostic_principal', 'Non spécifié')}

## PROBLÈME À TRAITER (numéro {request.probleme_index})
{request.probleme_index}. {request.probleme}

{"IMPORTANT: Ce problème EST le diagnostic principal. Inclure l'anamnèse par système et le status d'entrée." if request.is_diagnostic_principal else ""}

## TEXTES ORIGINAUX DU DOSSIER
{textes_section}

## DONNÉES EXTRAITES (structurées)
{json.dumps(session_data['donnees_extraites'], ensure_ascii=False, indent=2)}"""

        model_used = MODELS["haute_qualite"]

        # Appel à Claude pour générer cette section avec prompt caching
        response = client.messages.create(
            model=model_used,
            max_tokens=4000,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": PROMPT_SECTIONS,
                        "cache_control": {"type": "ephemeral"}
                    },
                    {
                        "type": "text",
                        "text": generation_context
                    }
                ]
            }]
        )
        section_text = response.content[0].text

        # Logger la requête
        tokens_input = response.usage.input_tokens
        tokens_output = response.usage.output_tokens
        cost_eur = calculate_cost(model_used, tokens_input, tokens_output)
        log_usage("/generer-section", model_used, tokens_input, tokens_output, cost_eur, 0, 0, success=True, session_id=request.session_id, user_email=request.user_email)

        return GenererSectionResponse(
            session_id=request.session_id,
            probleme_index=request.probleme_index,
            section=section_text,
            status="generated"
        )

    except anthropic.APIError as e:
        log_usage("/generer-section", MODELS["haute_qualite"], 0, 0, 0, 0, 0, success=False, session_id=request.session_id, user_email=request.user_email)
        raise HTTPException(status_code=500, detail=f"Erreur API Claude: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.post("/regenerer-section", response_model=GenererSectionResponse)
async def regenerer_section(request: RegenerationSectionRequest):
    """
    Régénère une section avec une instruction de modification.
    """
    if request.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session non trouvée."
        )

    session_data = sessions[request.session_id]

    try:
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

        # Contexte de régénération avec l'instruction
        regeneration_context = f"""## DIAGNOSTIC PRINCIPAL
{session_data.get('diagnostic_principal', 'Non spécifié')}

## PROBLÈME À TRAITER (numéro {request.probleme_index})
{request.probleme_index}. {request.probleme}

{"IMPORTANT: Ce problème EST le diagnostic principal. Inclure l'anamnèse par système et le status d'entrée." if request.is_diagnostic_principal else ""}

## TEXTES ORIGINAUX DU DOSSIER
{textes_section}

## DONNÉES EXTRAITES (structurées)
{json.dumps(session_data['donnees_extraites'], ensure_ascii=False, indent=2)}

## SECTION ACTUELLE (à modifier)
{request.section_actuelle}

## INSTRUCTION DE MODIFICATION DU MÉDECIN
{request.instruction}

IMPORTANT: Régénère cette section en intégrant l'instruction du médecin. Conserve la même structure (Contexte, Investigations, Discussion, Propositions) mais modifie le contenu selon l'instruction."""

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            system=PROMPT_SECTIONS,
            messages=[{
                "role": "user",
                "content": regeneration_context
            }]
        )
        section_text = response.content[0].text

        return GenererSectionResponse(
            session_id=request.session_id,
            probleme_index=request.probleme_index,
            section=section_text,
            status="regenerated"
        )

    except anthropic.APIError as e:
        raise HTTPException(status_code=500, detail=f"Erreur API Claude: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.post("/assembler", response_model=AssemblerResponse)
async def assembler(request: AssemblerRequest):
    """
    Assemble les sections validées en une lettre finale.
    """
    if request.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session non trouvée."
        )

    model_used = MODELS["haute_qualite"]

    try:
        # Joindre toutes les sections
        sections_text = "\n\n".join(request.sections)

        # Appel à Claude pour assemblage final
        response = client.messages.create(
            model=model_used,
            max_tokens=8000,
            system=PROMPT_ASSEMBLAGE,
            messages=[{
                "role": "user",
                "content": f"Type de lettre : {request.letter_type}\n\nDiagnostic principal : {request.diagnostic_principal}\n\nSections à assembler :\n{sections_text}"
            }]
        )
        letter = response.content[0].text

        # Logger la requête
        tokens_input = response.usage.input_tokens
        tokens_output = response.usage.output_tokens
        cost_eur = calculate_cost(model_used, tokens_input, tokens_output)
        log_usage("/assembler", model_used, tokens_input, tokens_output, cost_eur, 0, 0, success=True, session_id=request.session_id, user_email=request.user_email)

        return AssemblerResponse(
            session_id=request.session_id,
            letter=letter,
            status="assembled"
        )

    except anthropic.APIError as e:
        log_usage("/assembler", model_used, 0, 0, 0, 0, 0, success=False, session_id=request.session_id, user_email=request.user_email)
        raise HTTPException(status_code=500, detail=f"Erreur API Claude: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


# ==============================================================================
# VDR - Dictée Vocale Réadaptation (Pipeline 2 étapes)
# ==============================================================================

# --- ÉTAPE 1 : PROMPT D'EXTRACTION ---

PROMPT_VDR_EXTRACTION = """Tu es un assistant médical spécialisé en réadaptation.
Tu reçois une transcription vocale (en italien ou en français) d'une dictée médicale.

MISSION : Extraire et structurer les données en JSON.

1. Identifie le TYPE de lettre parmi : NEURO, MI, MSQ, ANAM_MSQ
   - NEURO : AVC, Parkinson, SEP, Guillain-Barré, déficit neurologique
   - MI : réadaptation générale, déconditionnement, chutes sans contexte neuro
   - MSQ : PTH, PTG, fracture, prothèse, post-opératoire orthopédique
   - ANAM_MSQ : anamnèse/admission d'un patient MSQ

IMPORTANT pour la classification :
- ANAM_MSQ = UNIQUEMENT si la dictée concerne l'admission/entrée du patient, sans données d'évolution ni de sortie
- MSQ = si la dictée contient des données d'évolution en réadaptation, des scores de sortie, une date de sortie, des résultats de physiothérapie/ergothérapie
- En cas de doute entre ANAM_MSQ et MSQ, choisis MSQ

2. Identifie le SEXE du patient : M ou F

3. Extrais TOUTES les données médicales mentionnées, organisées par catégorie :
   - identite (âge, sexe)
   - antecedents (liste)
   - antecedents_chirurgicaux (liste)
   - contexte_admission (date, motif, provenance, chirurgien, hôpital)
   - status_neurologique_entree (si NEURO)
   - status_neurologique_sortie (si NEURO)
   - scores (MIF, SPPB, Tinetti, TUG, CIRS, NIHSS, UPDRS, EDSS - ce qui est mentionné)
   - biologie (toutes les valeurs avec unités)
   - imagerie (résultats)
   - mobilite (transferts, marche, distance, moyen auxiliaire, escaliers, charge)
   - evolution_medicale (pansement, cicatrice, antalgie, thromboprophylaxie, complications)
   - physiotherapie (exercices, résultats, périmètre marche)
   - ergotherapie (évaluations, résultats AIVQ)
   - autres_disciplines (nutrition, neuropsy, logo, social)
   - social (lieu de vie, aides, autonomie antérieure, escaliers, ascenseur)
   - consignes_postop (si MSQ/ANAM_MSQ)
   - propositions (suivi, RDV, prescriptions)
   - traitement_sortie (médicaments)

RÈGLES :
- Traduis tout en français même si la source est en italien
- N'invente RIEN : n'extrais que ce qui est explicitement dit
- Pour chaque donnée, utilise la valeur exacte mentionnée
- Réponds UNIQUEMENT en JSON valide, sans markdown, sans commentaire"""

# --- ÉTAPE 2 : PROMPTS DE RÉDACTION PAR CHABLON ---

_VDR_REDACTION_HEADER = """Tu es un médecin spécialiste en réadaptation.
Tu reçois des données structurées extraites d'une dictée médicale.

MISSION : Rédige la lettre selon le chablon ci-dessous.

RÈGLES ABSOLUES :
1. Reproduis la structure EXACTE du chablon ci-dessous
2. Remplace les crochets [...] par les données fournies quand elles existent
3. GARDE les crochets [...] pour les données NON fournies - ne les supprime pas
4. NE REFORMULE PAS les phrases-types du chablon - copie-les mot pour mot
5. Adapte uniquement le genre (il/elle, patient/patiente) selon le sexe indiqué
6. N'ajoute AUCUNE introduction ni conclusion hors du chablon
7. N'invente AUCUNE donnée"""

PROMPT_VDR_NEURO = _VDR_REDACTION_HEADER + """

CHABLON À SUIVRE EXACTEMENT :

**Contexte :**
Patient(e) âgé(e) de …, connu(e) pour (comorbidités/antécédents pertinents), transféré(e) le … à notre unité pour réadaptation neurologique dans les suites de/post (AVC ischémique/hémorragique, Syndrome de Guillain-Barré, SEP, etc…). Il/Elle aurait présenté le … un déficit moteur/sensitif, trouble de la parole, de l'équilibre en lien avec un AVC/maladie de Parkinson, etc… d'origine cardio-embolique, athéromateuse, …en péjoration sur infection. Détails de l'hospitalisation cf. Lit A.
Actuellement patient(e) a gardé : Anamnèse neurologique … et se plaint de … sur le plan systémique … traité(e) par, mis(e) sous …
Sur le plan social : vit seul(e)/avec partenaire, etc… dans un appart/maison … avec/sans marche, avec/sans ascenseur. Auparavant autonome pour ses AVQs, AIVQs ? se déplaçait avec ou sans moyen auxiliaire. Habitudes de vie : tabac, alcool (à risque), drogues…/ troubles cognitifs pré-morbides ? avec ou sans retentissement sur l'autonomie. Conduite ? moyens de transports ?

**Status neurologique d'entrée :**
- Général/Fonctions supérieures : éveillé, calme, collaborant, orienté aux 4 modes, pas d'aphasie de compréhension ni de production, pas d'apraxie, pas d'agnosie, mémoire préservée, pas de dysarthrie, pas de dysphonie.
- Nerfs crâniens : pupilles iso-iso, fente palpébrale symétrique bilatérale sans ptose, sillon naso-génien conservé, motricité faciale conservée, champs visuel conservé, acuité visuelle conservée, pas de nystagmus, pas de saccade, sensibilité conservée aux 3 territoires, audition conservée, trophicité de la langue et du voile du palais normo-symétrique, force M5 SCM, M5 trapèze.
- Voies longues : sensibilité thermo/tactile/algique/proprioceptive conservée aux 4 membres, forces M5 releveur de la hanche, M5 extenseur de la jambe, M5 fléchisseur de la jambe, M5 dorsiflexion et flexion plantaire, M5 extension et flexion des orteils. M5 Membres supérieurs. Pallesthésie 8/8 MI, 8/8 MS. ROTs vifs et symétriques. RCP : flexion/extension/indifférent
- Coordination : Marche [avec moyen auxiliaire]. Barré tenu. Pas de trouble cérébelleux ni de coordination. Pas de trouble à la dextérité fine.
- Réflexes archaïques : Pas de signe de la moue, pas de réflexe palmo-mentonnier, pas de grasping
- Algie : non algique
- Psychiatrique : Euthymique, pas d'ATCD psychiatrique, pas de trouble du comportement.

**Status neurologique de sortie :**
(Même structure que le status d'entrée, adapté avec les données de sortie)

N.B : Si AVC : score NIHSS entrée / sortie
Si Maladie de Parkinson : score UPDRS III moteur entrée / sortie
Si sclérose en plaques : score EDSS entrée et sortie

**Investigations :**
- Aiguë : [à compléter]
- Neuroréadaptation : [à compléter]

**Discussion :**
À son arrivée le [date], le/la patient(e) a bénéficié d'une prise en charge multidisciplinaire (neurologique, ergothérapie, physiothérapie, nutrition, neuropsychologie, logopédie, thérapie de la déglutition, assistance sociale et soins complexes). En accord avec le/la patient(e), nous avons développé un projet thérapeutique visant son RAD sans/avec des aides. À la fin de son séjour l'objectif a été atteint ou redirigé.
L'évolution du point de vue fonctionnel est favorable avec une MIF sortie de []/126 versus []/126 à l'entrée. Le/La patient(e) est autonome pour les AVQ, mais il/elle a besoin d'une assistance minimale (rappel des séquences des activités) pour la plupart des activités instrumentales (cuisine, ménages, courses). Il/Elle est autonome pour les transferts avec parfois besoin de guidance verbale pour les demi-tours et la marche arrière. Au terme de son séjour le/la patient(e) est capable de marcher plus de []m avec [moyen auxiliaire]. Les escaliers sont réalisés avec besoin de guidance verbale/sans aide.
Sur le plan médical, neurologique : [complications, facteurs de risque vasculaire, changements de traitement].
Sur le plan des soins, le/la patient(e) a nécessité une surveillance fréquente de ses constantes (1x/jour), pour [troubles de la vigilance, transferts avec plusieurs soignants, aide pour manger, prises de constantes, pansements des plaies]. Nécessité de moyens de sécurité (fauteuil coquille, support pour le tronc, bassin, etc.)
Sur le plan neuropsy : [conclusion de la PEC]
Sur le plan logopédie : [conclusion de la PEC]
En physiothérapie : [périmètre de marche, moyen auxiliaire, escaliers, PEC ambulatoire]
En ergothérapie : [contrôle du tronc, force, dextérité, moyens auxiliaires, aménagement domicile]
Sur le plan nutritionnel : [état nutritionnel et prise en charge]
Sur le plan socio-administratif : [organisation du retour à domicile, aides, ordonnances, contacts NOMAD]

**Éléments à surveiller après l'hospitalisation / Suite de traitements et contrôles :**
- RDV en Neurologie PRT/CDF le … à …
- Poursuite physio, ergo, logo, neuropsy en ambulatoire
- Autres RDVs prévus
- Arrêt de travail à 100% jusqu'à … puis reprise progressive à …% ou à réévaluer par le médecin traitant"""

PROMPT_VDR_MI = _VDR_REDACTION_HEADER + """

CHABLON À SUIVRE EXACTEMENT :

**Discussion :**
À son admission, nous sommes en présence d'un(e) patient(e) à l'état général conservé. Sur l'évaluation CIRS, le/la patient(e) présente un score à [] points. À son arrivée, il/elle réalise ses transferts de manière indépendante/sous surveillance et se déplace en chambre en charge [] avec [moyen auxiliaire].

Le/La patient(e) bénéficie d'une prise en charge interdisciplinaire par les physiothérapeutes, ergothérapeutes, diététiciens et assistants sociaux conjointement avec la prise en soins médico-soignants dans le but d'une autonomisation optimale et d'un projet de vie personnalisé. Au niveau de la physiothérapie, le/la patient(e) bénéficie d'exercices de renforcement musculaire pour les membres inférieurs, travail de la marche et de l'équilibre, de l'endurance. En ergothérapie, le/la patient(e) bénéficie d'une évaluation des activités instrumentales (AIVQ).
Les séances de physiothérapie et ergothérapie permettent [résultats]. En ergothérapie, il/elle réalise les AIVQ avec et sans moyen auxiliaire de manière indépendante, efficace et sécuritaire.

Sur le plan médical []

Sur le plan social, le retour à domicile s'organise avec/sans aide.

Sur le plan fonctionnel, le/la patient(e) présente une mesure d'indépendance fonctionnelle (MIF) globale de []/126 à l'admission. En fin de séjour, on note une amélioration dans l'acquisition d'indépendance de la vie quotidienne. Il/Elle nécessite de l'aide/est indépendant(e) pour [les transferts, la toilette, l'habillage] et marche avec/sans moyen auxiliaire. La MIF globale à la sortie est mesurée à []/126.

L'évolution est favorable permettant un retour à domicile le []"""

PROMPT_VDR_MSQ = _VDR_REDACTION_HEADER + """

CHABLON À SUIVRE EXACTEMENT :

**Problème : réadaptation musculo-squelettique après (pose de PTH/PTG, fracture, etc.)**

**Discussion :**
À son admission, nous sommes en présence d'un(e) patient(e) à l'état général conservé. Sur l'évaluation CIRS, le/la patient(e) présente un score à [] points. À son arrivée, il/elle réalise ses transferts avec une mesure de l'indépendance fonctionnelle (MIF) à [] points (assis-assis, debout-assis, couché-assis). Il/Elle se déplace en chambre en charge [] avec [moyen auxiliaire] sur une distance totale de [] mètres. Il/Elle monte et descend [] marches d'escalier.

Le/La patient(e) bénéficie d'une prise en charge interdisciplinaire par les physiothérapeutes, ergothérapeutes, diététiciens et assistants sociaux conjointement avec la prise en soins médico-soignants dans le but d'une autonomisation optimale et d'un projet de vie personnalisé.

Au niveau de la physiothérapie, le/la patient(e) bénéficie d'exercices de renforcement musculaire pour les membres inférieurs, travail de la marche et de l'équilibre, de l'endurance. En ergothérapie, le/la patient(e) bénéficie d'une évaluation des activités instrumentales (AIVQ).
Les séances de physiothérapie et ergothérapie permettent la reprise de la marche avec un périmètre de [] m sans pause et une distance totale de []m avec une pause avec l'aide de [moyen auxiliaire].
Il/Elle monte et descend [] marches d'escaliers. En ergothérapie, il/elle réalise les AIVQ avec et sans moyen auxiliaire de manière indépendante, efficace et sécuritaire.

Sur le plan médical [] nous retirons le pansement à [Jxx], la cicatrice est calme. L'antalgie est contrôlée par []. Nous anticipons les effets secondaires en prescrivant des laxatifs et antiémétiques. L'évolution favorable nous permet de poursuivre une antalgie de palier I en réserve à la sortie d'hospitalisation. Nous poursuivons la thromboprophylaxie par [] durant l'hospitalisation relayée par [] à la sortie pour une durée totale de [].

Le/La patient(e) présente également [] à l'entrée (c.f. problèmes dédiés)

Sur le plan social, le retour à domicile s'organise avec/sans aide.
Sur le plan fonctionnel, le/la patient(e) présente une mesure d'indépendance fonctionnelle (MIF) globale de []/126 à l'admission. En fin de séjour, on note une amélioration dans l'acquisition d'indépendance de la vie quotidienne. Il/Elle nécessite cependant toujours de l'aide pour [les transferts, aide pour l'hygiène et l'habillage]. La MIF globale à la sortie est mesurée à []/126.

L'évolution est favorable permettant un retour à domicile le []

**Propositions :**
- Poursuite de physiothérapie en ambulatoire
- Consultation de contrôle chez le Dr … à 6 semaines
- [Autres propositions]"""

PROMPT_VDR_ANAM_MSQ = _VDR_REDACTION_HEADER + """

CHABLON À SUIVRE EXACTEMENT :

**Anamnèse admission :**
Patient(e) de [] ans, réa_, connu(e) pour [antécédents/comorbidités], qui est adressé(e) en réadaptation le [] dans les suites [de ___] dans le contexte [de __]. L'intervention s'est déroulée le [], sans complications, par le Dr [] à l'hôpital de [].
Pour rappel, [éventuelle anamnèse ayant mené à l'hospitalisation aiguë/opération]
Les suites post-opératoires immédiates ont été marquées par [___]
À son arrivée en réadaptation, le/la patient(e) rapporte [___]
Sur le plan social, le/la patient(e) vit seul(e)/avec [___] dans un appartement/maison avec/sans ascenseur et _ marches d'escalier. Avant l'intervention, le/la patient(e) était autonome pour les AVQ et AIVQ / il/elle bénéficiait de soins à domicile [_ par jour pour ___]. Il/Elle se déplaçait avec/sans moyen auxiliaire.

**Consignes post-opératoires :**
- [consignes dictées]"""

# Mapping type -> prompt
VDR_PROMPTS = {
    "NEURO": PROMPT_VDR_NEURO,
    "MI": PROMPT_VDR_MI,
    "MSQ": PROMPT_VDR_MSQ,
    "ANAM_MSQ": PROMPT_VDR_ANAM_MSQ,
}


@app.post("/analyser-entree")
async def analyser_entree(request: AnalyserEntreeRequest):
    """
    Étape 1 VDR : Classification + extraction JSON depuis transcription vocale.
    """
    images_count = len(request.images_base64) if request.images_base64 else 0
    pdfs_count = len(request.pdfs_base64) if request.pdfs_base64 else 0

    try:
        content = []

        # Images
        if request.images_base64:
            for img_b64 in request.images_base64:
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

        # PDFs
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

        # Transcription
        langue_label = "italien" if request.langue == "italien" else "français"
        content.append({
            "type": "text",
            "text": f"## Transcription vocale (langue source : {langue_label})\n\n{request.transcription}"
        })

        model_used = "claude-sonnet-4-20250514"

        response = client.messages.create(
            model=model_used,
            max_tokens=4096,
            system=PROMPT_VDR_EXTRACTION,
            messages=[{"role": "user", "content": content}]
        )

        raw_json = response.content[0].text
        print(f"[/analyser-entree] Réponse brute Claude ({len(raw_json)} chars):\n{raw_json[:3000]}")

        # Log usage
        tokens_input = response.usage.input_tokens
        tokens_output = response.usage.output_tokens
        cost_eur = calculate_cost(model_used, tokens_input, tokens_output)
        log_usage("/analyser-entree", model_used, tokens_input, tokens_output, cost_eur, images_count, pdfs_count, success=True)

        # Nettoyer les éventuelles fences markdown (```json ... ```)
        cleaned = raw_json.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned.rsplit("\n", 1)[0] if "\n" in cleaned else cleaned[:-3]
        cleaned = cleaned.strip()

        # Parser le JSON
        try:
            donnees = json.loads(cleaned)
        except json.JSONDecodeError as e:
            print(f"[/analyser-entree] Erreur parsing JSON. Réponse brute:\n{raw_json[:2000]}")
            raise HTTPException(status_code=500, detail=f"Erreur parsing JSON de l'extraction: {str(e)}")

        type_lettre = donnees.get("type_lettre", donnees.get("type", "MI")).upper()
        if type_lettre not in VDR_PROMPTS:
            type_lettre = "MI"

        sexe = donnees.get("sexe", donnees.get("identite", {}).get("sexe", "M")).upper()
        if sexe not in ("M", "F"):
            sexe = "M"

        print(f"[/analyser-entree] Type détecté: {type_lettre} | Sexe: {sexe} | Clés JSON: {list(donnees.keys())}")

        return {
            "donnees_json": donnees,
            "type_lettre": type_lettre,
            "sexe": sexe
        }

    except anthropic.APIError as e:
        log_usage("/analyser-entree", "claude-sonnet-4-20250514", 0, 0, 0, images_count, pdfs_count, success=False)
        raise HTTPException(status_code=500, detail=f"Erreur API Claude: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.post("/generer-entree")
async def generer_entree(request: GenererEntreeRequest):
    """
    Étape 2 VDR : Rédaction de la lettre à partir du JSON structuré + type de chablon.
    """
    try:
        type_lettre = request.type_lettre.upper()
        if type_lettre not in VDR_PROMPTS:
            raise HTTPException(status_code=400, detail=f"Type de lettre inconnu: {type_lettre}. Valeurs acceptées: NEURO, MI, MSQ, ANAM_MSQ")

        system_prompt = VDR_PROMPTS[type_lettre]

        json_str = json.dumps(request.donnees_json, ensure_ascii=False, indent=2)

        user_message = f"SEXE DU PATIENT : {request.sexe}\n\nDONNÉES EXTRAITES :\n{json_str}"

        model_used = "claude-sonnet-4-20250514"

        response = client.messages.create(
            model=model_used,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )

        lettre = response.content[0].text

        # Log usage
        tokens_input = response.usage.input_tokens
        tokens_output = response.usage.output_tokens
        cost_eur = calculate_cost(model_used, tokens_input, tokens_output)
        log_usage("/generer-entree", model_used, tokens_input, tokens_output, cost_eur, 0, 0, success=True)

        return {"lettre": lettre}

    except anthropic.APIError as e:
        log_usage("/generer-entree", "claude-sonnet-4-20250514", 0, 0, 0, 0, 0, success=False)
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
