#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reformulation + structuration des 12 scores gériatriques de scores.json.

- Textes d'interprétation REFORMULÉS (paraphrase, aucun copier-coller du site).
- interpretation[] structurée {min,max,texte,severite} en respectant STRICTEMENT
  les seuils explicites de la source (aucun seuil inventé). Les scores purement
  descriptifs reçoivent une entrée unique sans seuil (severite: null).
- reformule -> true. valide RESTE false : la validation clinique (formule +
  seuils + bon libellé) par le Dr Scattu est requise avant affichage en production.
"""
import json, os

REFORM = {
    "adlkatz": {
        "description": "Autonomie pour 6 activités de base de la vie quotidienne (hygiène, habillage, toilettes, locomotion, continence, repas). Score 0 à 6.",
        "interpretation": [
            {"min": 0, "max": 6, "texte": "Plus le score est bas, plus la dépendance est marquée ; 6 correspond à une autonomie complète. Réévaluer à distance ; plusieurs versions de l'échelle coexistent.", "severite": None},
        ],
    },
    "aggir_calc": {
        "description": "Grille nationale AGGIR : évalue la perte d'autonomie de la personne âgée et détermine le groupe iso-ressources (GIR 1 à 6).",
        "interpretation": [
            {"min": 1, "max": 6, "texte": "Le GIR s'étend de 1 (dépendance la plus lourde) à 6 (autonomie conservée). Seules les variables discriminantes entrent dans le calcul du GIR.", "severite": None},
        ],
    },
    "aggir_gir": {
        "description": "Détermination du groupe iso-ressources (GIR 1 à 6) à partir de la grille AGGIR.",
        "interpretation": [
            {"min": 1, "max": 6, "texte": "GIR 1 = dépendance maximale, GIR 6 = autonomie préservée. Le GIR conditionne l'éligibilité et le niveau de l'APA.", "severite": None},
        ],
    },
    "algoplus": {
        "description": "Évaluation comportementale de la douleur aiguë chez le sujet âgé (>65 ans) avec troubles de la communication verbale. Score 0 à 5.",
        "interpretation": [
            {"min": 0, "max": 1, "texte": "Douleur peu probable.", "severite": "normal"},
            {"min": 2, "max": 5, "texte": "Seuil de douleur atteint (≥ 2) : une prise en charge antalgique est indiquée.", "severite": "danger"},
        ],
    },
    "chumlea": {
        "description": "Estimation de la taille à partir de la hauteur talon-genou, chez le sujet ≥ 60 ans (utile en cas de troubles de la statique rachidienne).",
        "interpretation": [
            {"min": None, "max": None, "texte": "Formule valable à partir de 60 ans. Mesurer la hauteur talon-genou, genou fléchi à 90°, en décubitus. Pas de consensus avant 60 ans.", "severite": None},
        ],
    },
    "cirs": {
        "description": "Cumulative Illness Rating Scale : quantifie la charge globale de comorbidités par appareil chez le patient gériatrique.",
        "interpretation": [
            {"min": None, "max": None, "texte": "Chaque appareil est coté selon sa sévérité ; le score reflète la charge médicale cumulée et facilite la comparaison des profils. Pas de seuil unique.", "severite": None},
        ],
    },
    "cornell": {
        "description": "Échelle de Cornell : dépistage de la dépression chez la personne âgée avec syndrome démentiel installé (MMS < 15).",
        "interpretation": [
            {"min": None, "max": None, "texte": "Recueil par entretien avec le patient et hétéro-évaluation auprès de l'entourage. Outil de dépistage à interpréter dans son contexte clinique.", "severite": None},
        ],
    },
    "doloplus": {
        "description": "Hétéro-évaluation de la douleur chronique chez le sujet âgé non communicant. Score 0 à 30.",
        "interpretation": [
            {"min": 0, "max": 4, "texte": "En deçà de 5/30, doute : laisser le bénéfice du doute et retester, notamment après essai antalgique.", "severite": "warning"},
            {"min": 5, "max": 30, "texte": "Score ≥ 5/30 : douleur retenue. La répétition et le suivi des cotations sont les plus informatifs.", "severite": "danger"},
        ],
    },
    "gds15": {
        "description": "Geriatric Depression Scale (15 items) : dépistage de la dépression du sujet âgé. Score 0 à 15.",
        "interpretation": [
            {"min": 0, "max": 4, "texte": "Pas d'argument pour une dépression.", "severite": "normal"},
            {"min": 5, "max": 9, "texte": "Dépression probable, à explorer.", "severite": "warning"},
            {"min": 10, "max": 15, "texte": "Dépression quasi constante à ce niveau de score.", "severite": "danger"},
        ],
    },
    "iadllawton": {
        "description": "Échelle IADL de Lawton : autonomie instrumentale (téléphone, courses, repas, ménage, transports, médicaments, finances). Score 0 à 8.",
        "interpretation": [
            {"min": 0, "max": 8, "texte": "8 = autonomie complète, 0 = dépendance totale. Historiquement, 3 items (repas, ménage, lessive) n'étaient pas cotés chez l'homme (max 5).", "severite": None},
        ],
    },
    "mms": {
        "description": "Mini Mental State Examination (MMSE) : évaluation cognitive globale. Score 0 à 30.",
        "interpretation": [
            {"min": 25, "max": 30, "texte": "Au-dessus du seuil ANAES : pas d'altération cognitive évoquée par le score.", "severite": "normal"},
            {"min": 0, "max": 24, "texte": "Score ≤ 24 (seuil ANAES) : altération cognitive à explorer, oriente vers une démarche diagnostique de démence.", "severite": "warning"},
        ],
    },
    "nri": {
        "description": "Nutritional Risk Index (Buzby) gériatrique : risque de dénutrition d'après l'albuminémie et le rapport poids actuel/poids idéal (Lorentz).",
        "interpretation": [
            {"min": 0, "max": 82, "texte": "NRI < 82 : risque nutritionnel élevé.", "severite": "danger"},
            {"min": 82, "max": 92, "texte": "NRI 82–92 : risque modéré.", "severite": "warning"},
            {"min": 92, "max": 98, "texte": "NRI 92–98 : risque faible.", "severite": "warning"},
            {"min": 98, "max": 999, "texte": "NRI > 98 : pas de risque nutritionnel.", "severite": "normal"},
        ],
    },
}

def main():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "scores.json")
    d = json.load(open(path, encoding="utf-8"))
    patched = 0
    for s in d["scores"]:
        r = REFORM.get(s["id"])
        if not r:
            continue
        s["description"] = r["description"]
        s["interpretation"] = r["interpretation"]
        s["reformule"] = True
        # valide reste False : sign-off clinique requis
        patched += 1
    d["meta"]["reformules"] = patched
    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"{patched} scores gériatriques reformulés (reformule:true, valide:false)")

if __name__ == "__main__":
    main()
