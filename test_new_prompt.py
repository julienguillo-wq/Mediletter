"""
Test du nouveau prompt readaptation.py avec un dossier patient fictif.
Reproduit le pipeline /analyser → /generer-section tel que main.py l'exécute.
Cas test : PTH gauche + infection urinaire concomitante.
"""

import json
import sys
import os
import time

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ── Setup ────────────────────────────────────────────────────────────────

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

import anthropic
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "backend", ".env"))

from prompts.readaptation import PROMPT_EXTRACTION, PROMPT_SECTIONS, PROMPT_ASSEMBLAGE

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-20250514"  # Sonnet pour le test (moins cher), Opus en prod

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "analysis_output")

# ── Dossier patient fictif ───────────────────────────────────────────────

DOSSIER_PATIENT = """
Lettre de transfert du CHUV — Service d'orthopédie

Patiente : Mme Rosa Bernasconi, née le 12.05.1943 (82 ans)
Transférée le 18.03.2026 au Centre de réadaptation de Landeyeux

Diagnostic : Coxarthrose gauche invalidante
Intervention : Pose de prothèse totale de hanche gauche le 12.03.2026
Chirurgien : Dr Keller, CHUV Lausanne
Voie d'abord : antéro-latérale mini-invasive
Suites post-opératoires simples, mobilisation J1.

Antécédents :
- HTA traitée par Amlodipine 5 mg 1x/j
- Diabète type 2 sous Metformine 850 mg 2x/j, HbA1c 7.2% (janvier 2026)
- Gonarthrose droite (PTG droite en 2019)
- Hypothyroïdie substituée par Euthyrox 75 µg
- Appendicectomie dans l'enfance
- Pas de tabagisme, pas de consommation OH

Contexte social :
Veuve, vit seule dans un appartement au 2e étage avec ascenseur. 4 marches à l'entrée de l'immeuble.
Fille à Lausanne, fils à Genève, contacts réguliers.
Autonome pour AVQ et AIVQ avant hospitalisation. Pas de moyen auxiliaire. Aide ménagère 1x/semaine.

Traitement d'entrée en réadaptation :
- Amlodipine 5 mg 1x/j
- Metformine 850 mg 2x/j
- Euthyrox 75 µg 1x/j
- Dafalgan 1g 4x/j
- Irfen 400 mg 3x/j (max 5 jours post-op)
- Fragmine 5000 UI 1x/j (prophylaxie TVP, 35 jours post-op)
- Pantoprazole 40 mg 1x/j

Notes infirmières (résumé du séjour en réadaptation, 18.03 au 08.04.2026) :
- 18.03 : admission, état général conservé, douleurs hanche gauche 5/10 EVA, mobilisation avec déambulateur
- 20.03 : plainte de brûlures mictionnelles et pollakiurie depuis 48h
- 21.03 : SSU positive, uricult envoyé. T° 37.8°C en soirée.
- 22.03 : Uricult : E. coli > 10^5 CFU/ml, sensible Ciprofloxacine, résistant Amoxicilline.
  Traitement : Ciprofloxacine 500 mg 2x/j pour 5 jours.
- 25.03 : T° normalisée, symptômes urinaires en régression.
- 27.03 : fin antibiothérapie, SSU de contrôle négative.
- 28.03 : ablation agrafes J16, cicatrice propre.
- 01.04 : marche avec 1 canne anglaise, périmètre 120 m. Escaliers avec rampe : 12 marches.
- 05.04 : douleurs hanche 2/10 EVA, bonne mobilité. Périmètre 200 m avec canne.
- 07.04 : visite de sortie, patiente autonome AVQ. Transit régulier. Pas d'OMI.

Biologie d'entrée (18.03.2026) :
Hb 118 g/l, Ht 0.36, leucocytes 7.2 G/l, thrombocytes 245 G/l, CRP 28 mg/l,
créatinine 62 µmol/l, GFR CKD-EPI 78 ml/min, Na 140 mmol/l, K 4.0 mmol/l,
glycémie 7.8 mmol/l, albumine 34 g/l, TSH 2.1 mU/l.

Biologie de sortie (05.04.2026) :
Hb 126 g/l, CRP 3 mg/l, créatinine 58 µmol/l, Na 141 mmol/l, K 4.2 mmol/l.

Scores fonctionnels :
MIF entrée : 82/126 (transferts 4, locomotion 3, soins personnels 5)
MIF sortie : 112/126 (transferts 6, locomotion 6, soins personnels 7)
CIRS : 12 points
NRS : 1/7 (pas de risque nutritionnel)

Physiothérapie :
- 5x/semaine, renforcement MI, rééducation marche, escaliers, équilibre
- TUG entrée 28s → sortie 14s (avec canne anglaise)
- SPPB entrée 4/12 → sortie 8/12
- Périmètre marche : 30 m (déambulateur) → 200 m (1 canne anglaise)

Ergothérapie :
- 3x/semaine, AVQ, transferts, aménagement domicile
- Indépendance retrouvée pour toilette, habillage, cuisine
- Recommandation : rehausseur WC, barre d'appui douche, tabouret douche
- Pas de suivi ergo ambulatoire nécessaire

Diététique :
- NRS 1/7, état nutritionnel conservé
- Alimentation normale, apports énergétiques 90-100%
- Poids stable 68 kg durant séjour

Service social :
- CMS Lausanne contacté pour aide transitoire au retour (toilette 1x/j pendant 2 semaines)
- Livraison repas midi 5x/semaine pendant 3 semaines
- Aide ménagère maintenue 1x/semaine

Traitement de sortie :
- Amlodipine 5 mg 1x/j
- Metformine 850 mg 2x/j
- Euthyrox 75 µg 1x/j
- Dafalgan 1g en réserve (max 3x/j)
- Fragmine 5000 UI 1x/j (encore 7 jours, arrêt le 15.04.2026)
- Pantoprazole 40 mg 1x/j (arrêt quand Irfen arrêté)
- Calcimagon D3 1x/j

Consignes post-opératoires :
- Appui complet autorisé
- Pas de rotation interne forcée ni d'adduction au-delà de la ligne médiane pendant 6 semaines
- Bas de contention pendant 6 semaines
"""


def build_section_prompt(probleme: str, prompt_sections: str) -> str:
    """Pour readaptation, PROMPT_SECTIONS contient tout (pas de templates séparés)."""
    return prompt_sections


def run_test():
    print("=" * 70)
    print("TEST DU NOUVEAU PROMPT READAPTATION")
    print("Cas : PTH gauche + IU concomitante")
    print("=" * 70)
    print()

    # ══════════════════════════════════════════════════════════════════════
    # ÉTAPE 1 : EXTRACTION (simule /analyser)
    # ══════════════════════════════════════════════════════════════════════

    print("ÉTAPE 1 — Extraction des données (PROMPT_EXTRACTION)...")
    print(f"  Prompt système : {len(PROMPT_EXTRACTION)} chars")
    print(f"  Dossier patient : {len(DOSSIER_PATIENT)} chars")
    print()

    t0 = time.time()
    response_extraction = client.messages.create(
        model=MODEL,
        max_tokens=8000,
        system=[{
            "type": "text",
            "text": PROMPT_EXTRACTION,
            "cache_control": {"type": "ephemeral"}
        }],
        messages=[{
            "role": "user",
            "content": DOSSIER_PATIENT
        }]
    )
    t1 = time.time()

    extraction_text = response_extraction.content[0].text
    tokens_in = response_extraction.usage.input_tokens
    tokens_out = response_extraction.usage.output_tokens

    print(f"  Tokens : {tokens_in} in / {tokens_out} out")
    print(f"  Durée : {t1-t0:.1f}s")
    print()

    # Parser le JSON
    try:
        if "```json" in extraction_text:
            json_str = extraction_text.split("```json")[1].split("```")[0]
        elif "```" in extraction_text:
            json_str = extraction_text.split("```")[1].split("```")[0]
        else:
            json_str = extraction_text
        extraction = json.loads(json_str.strip())
    except json.JSONDecodeError as e:
        print(f"  ERREUR JSON: {e}")
        print(f"  Réponse brute:\n{extraction_text[:2000]}")
        return

    diagnostic_principal = extraction.get("diagnostic_principal", "?")
    problemes = extraction.get("problemes", [])

    # Fusionner données à la racine
    donnees_extraites = {}
    for key in ["biologie", "ecg", "imagerie", "donnees_patient", "evolution",
                "antecedents", "traitement_entree", "traitement_sortie",
                "status_neurologique_entree", "status_neurologique_sortie",
                "scores_fonctionnels", "status_fonctionnel_entree", "status_fonctionnel_sortie",
                "pec_multidisciplinaire", "chirurgie", "contexte_social",
                "scores_specifiques", "propositions_suite", "filiere",
                "probleme_readaptation", "motif_readaptation"]:
        if key in extraction:
            donnees_extraites[key] = extraction[key]

    print("  ┌─────────────────────────────────────────────────")
    print(f"  │ DIAGNOSTIC PRINCIPAL : {diagnostic_principal}")
    print(f"  │ FILIÈRE : {extraction.get('filiere', '?')}")
    print(f"  │ PROBLÈMES ({len(problemes)}) :")
    for i, p in enumerate(problemes, 1):
        print(f"  │   {i}. {p}")
    print("  └─────────────────────────────────────────────────")
    print()

    # ══════════════════════════════════════════════════════════════════════
    # ÉTAPE 2 : GÉNÉRATION DES SECTIONS (simule /generer-section)
    # ══════════════════════════════════════════════════════════════════════

    print("ÉTAPE 2 — Génération des sections (PROMPT_SECTIONS)...")
    print()

    sections = {}

    for i, probleme in enumerate(problemes, 1):
        is_diag_principal = (i == 1)

        generation_context = f"""## DIAGNOSTIC PRINCIPAL
{diagnostic_principal}

## PROBLÈME À TRAITER (numéro {i})
{i}. {probleme}

{"IMPORTANT: Ce problème EST le diagnostic principal. Inclure l'anamnèse par système et le status d'entrée." if is_diag_principal else ""}

## TEXTES ORIGINAUX DU DOSSIER
### Contexte / Lettre d'entrée
{DOSSIER_PATIENT}

## DONNÉES EXTRAITES (structurées)
{json.dumps(donnees_extraites, ensure_ascii=False, indent=2)}"""

        print(f"  Section {i}/{len(problemes)} : {probleme[:80]}...")
        t2 = time.time()

        response_section = client.messages.create(
            model=MODEL,
            max_tokens=4000,
            system=[{
                "type": "text",
                "text": build_section_prompt(probleme, PROMPT_SECTIONS),
                "cache_control": {"type": "ephemeral"}
            }],
            messages=[{
                "role": "user",
                "content": generation_context
            }]
        )
        t3 = time.time()

        section_text = response_section.content[0].text
        s_in = response_section.usage.input_tokens
        s_out = response_section.usage.output_tokens

        print(f"    → {s_in} in / {s_out} out, {t3-t2:.1f}s, {len(section_text)} chars")

        sections[i] = {
            "probleme": probleme,
            "is_principal": is_diag_principal,
            "text": section_text,
            "tokens_in": s_in,
            "tokens_out": s_out,
        }

    # ══════════════════════════════════════════════════════════════════════
    # SORTIE
    # ══════════════════════════════════════════════════════════════════════

    print()
    print("=" * 70)
    print("RÉSULTATS")
    print("=" * 70)

    full_output = []

    for i in sorted(sections.keys()):
        s = sections[i]
        header = f"{'[DIAG PRINCIPAL] ' if s['is_principal'] else ''}Problème {i} : {s['probleme']}"
        separator = "─" * min(len(header), 70)
        full_output.append(separator)
        full_output.append(header)
        full_output.append(separator)
        full_output.append(s["text"])
        full_output.append("")

        print()
        print(separator)
        print(header)
        print(separator)
        print(s["text"])
        print()

    # Sauvegarder
    output_path = os.path.join(OUTPUT_DIR, "test_new_prompt_output.txt")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"TEST PROMPT READAPTATION — {time.strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"Modèle : {MODEL}\n")
        f.write(f"Diagnostic principal : {diagnostic_principal}\n")
        f.write(f"Problèmes ({len(problemes)}) : {json.dumps(problemes, ensure_ascii=False)}\n")
        f.write(f"Extraction JSON complète :\n{json.dumps(extraction, ensure_ascii=False, indent=2)}\n")
        f.write("\n" + "=" * 70 + "\nSECTIONS GÉNÉRÉES\n" + "=" * 70 + "\n\n")
        f.write("\n".join(full_output))

    print()
    print(f"Sortie sauvegardée : {output_path}")

    # Vérifications rapides
    print()
    print("=" * 70)
    print("VÉRIFICATIONS AUTOMATIQUES")
    print("=" * 70)

    checks = []

    # Check 1 : nombre de problèmes entre 3 et 8
    n = len(problemes)
    ok = 3 <= n <= 8
    checks.append(("Nombre de problèmes 3-8", ok, f"{n} problèmes"))

    # Check 2 : pas de "Anamnèse d'admission" dans les sections générées
    all_text = " ".join(s["text"] for s in sections.values())
    has_anamn = "Anamnèse d'admission" in all_text
    checks.append(("Pas de 'Anamnèse d'admission'", not has_anamn,
                   "TROUVÉ dans la sortie" if has_anamn else "absent (OK)"))

    # Check 3 : "antécédents susmentionnés" présent dans au moins une section
    has_susmen = "susmentionnés" in all_text
    checks.append(("Formule 'antécédents susmentionnés'", has_susmen,
                   "présent" if has_susmen else "ABSENT"))

    # Check 4 : diagnostic principal contient "Réadaptation"
    has_readapt = "éadaptation" in diagnostic_principal or "éadaptation" in problemes[0]
    checks.append(("Diag principal = Réadaptation", has_readapt,
                   diagnostic_principal[:60]))

    # Check 5 : pas de HTA, surpoids, anémie légère comme problème autonome
    excluded_patterns = ["hta", "surpoids", "obésité", "anémie légère"]
    found_excluded = [p for p in problemes
                      if any(ex in p.lower() for ex in excluded_patterns)]
    checks.append(("Pas de problèmes exclus (HTA, surpoids...)",
                   len(found_excluded) == 0,
                   f"trouvés: {found_excluded}" if found_excluded else "aucun (OK)"))

    # Check 6 : MIF mentionnée dans section principale
    principal_text = sections.get(1, {}).get("text", "")
    has_mif = "MIF" in principal_text
    checks.append(("MIF dans section principale", has_mif,
                   "présent" if has_mif else "ABSENT"))

    # Check 7 : 4 dimensions PEC dans section principale MSQ
    dimensions = ["physiothérapie", "ergothérapie", "nutritionnel", "social"]
    found_dims = [d for d in dimensions if d.lower() in principal_text.lower()]
    checks.append(("4 dimensions PEC dans diag principal",
                   len(found_dims) >= 4,
                   f"{len(found_dims)}/4 : {found_dims}"))

    for label, ok, detail in checks:
        status = "PASS" if ok else "FAIL"
        print(f"  [{status}] {label} — {detail}")

    n_pass = sum(1 for _, ok, _ in checks if ok)
    print(f"\n  Résultat : {n_pass}/{len(checks)} checks passed")


if __name__ == "__main__":
    run_test()
