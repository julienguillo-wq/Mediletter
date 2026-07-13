#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Étape d'adaptation IA : raw_wikem.json (anglais) -> guidelines.json (schéma app)

- Traduction française + adaptation au contexte gériatrique / recos françaises.
- Restructuration au schéma : {id, titre, categorie, sources[], date_maj,
  temps_lecture, red_flags[], sections[{titre,type,contenu}], relu_par, valide}.
- valide:false et relu_par:"" par défaut : publication seulement après relecture
  du Dr Scattu (le badge « Relu par » reflète ce statut).
- Attribution WikEM (CC BY-SA) obligatoire : portée par sources[] + pied de page.

Les entrées adaptées ci-dessous sont rédigées par IA à partir du contenu WikEM
(cf. _raw/raw_wikem.json) ; elles restent à valider cliniquement.
"""
import json, os

def date_maj(raw, pid, default=""):
    for p in raw["pages"]:
        if p["id"] == pid:
            return (p.get("date_revision") or default)[:10]
    return default

# --- Guidelines adaptées (FR, gériatrie) ---
ADAPTED = {
    "delirium": lambda dm: {
        "id": "delirium",
        "titre": "Confusion aiguë / délirium du sujet âgé",
        "categorie": "geria",
        "sources": [
            {"nom": "WikEM", "licence": "CC BY-SA", "url": "https://wikem.org/wiki/Delirium"},
        ],
        "adapte": "Traduit et adapté au contexte gériatrique français (recos HAS/SFGG à confirmer).",
        "date_maj": dm or "2026-03-22",
        "temps_lecture": 6,
        "relu_par": "",
        "valide": False,
        "red_flags": [
            "Trouble de la vigilance (somnolence, coma) → glycémie capillaire immédiate.",
            "Déficit neurologique focal → AVC jusqu'à preuve du contraire (imagerie).",
            "Fièvre + syndrome méningé → ponction lombaire (après imagerie si signe focal).",
            "Rechercher un globe urinaire et un fécalome : causes réversibles fréquentes chez la personne âgée.",
        ],
        "sections": [
            {"titre": "Définition", "type": "texte", "contenu": [
                "Trouble aigu et fluctuant de la vigilance, de l'attention et de la cognition, secondaire à une cause organique — pas un trouble psychiatrique primaire.",
                "L'inattention en est le signe cardinal ; installation en quelques heures à quelques jours.",
                "Très fréquent chez le sujet âgé hospitalisé (10–30 %) ; associé à une surmortalité, un allongement du séjour et un déclin cognitif à distance.",
                "À distinguer de la démence : le délirium est aigu et fluctuant (inattention au premier plan) ; la démence est chronique (trouble mnésique au premier plan).",
            ]},
            {"titre": "Sous-types", "type": "texte", "contenu": [
                "Hyperactif : agitation, hallucinations, combativité (le plus facile à repérer).",
                "Hypoactif : léthargie, ralentissement, repli — souvent méconnu, pourtant plus fréquent et plus grave.",
                "Mixte : alternance des deux formes.",
            ]},
            {"titre": "Étiologies — moyen mnémotechnique DELIRIUM", "type": "texte", "contenu": [
                "D — Drogues/médicaments (anticholinergiques, opioïdes, benzodiazépines, corticoïdes, polymédication).",
                "E — Électrolytes et endocrinien (natrémie, calcémie, glycémie, thyroïde).",
                "L — sevrage (« Lack of drugs » : alcool, benzodiazépines, opioïdes).",
                "I — Infection (urinaire, pulmonaire, méningée, sepsis).",
                "R — Réduction des afférences sensorielles (déficit visuel/auditif, environnement).",
                "I — Intracrânien (AVC, hémorragie, processus expansif, crise comitiale).",
                "U — rétention Urinaire, fécalome (particulièrement chez le sujet âgé).",
                "M — Myocardique/pulmonaire (IDM, EP, hypoxie, insuffisance cardiaque).",
            ]},
            {"titre": "Diagnostic — Confusion Assessment Method (CAM)", "type": "etapes", "contenu": [
                "Réunir OBLIGATOIREMENT les critères 1 ET 2, PLUS le critère 3 OU 4 :",
                "1. Début aigu et/ou évolution fluctuante",
                "2. Inattention",
                "3. Désorganisation de la pensée",
                "4. Altération de la vigilance",
            ]},
            {"titre": "Bilan", "type": "texte", "contenu": [
                "Objectif : identifier et traiter la cause sous-jacente.",
                "Minimum : glycémie, ionogramme, NFS, bandelette ± ECBU, ECG, radiographie thoracique.",
                "À discuter : bilan hépatique, ammoniémie, TSH, hémocultures, lactates, recherche de toxiques.",
                "TDM cérébrale si : signe neurologique focal, chute/traumatisme crânien, anticoagulation, ou absence de cause évidente.",
                "Ponction lombaire si méningo-encéphalite suspectée.",
            ]},
            {"titre": "Prise en charge", "type": "etapes", "contenu": [
                "Traiter la cause : c'est le traitement de fond.",
                "Mesures non médicamenteuses EN PREMIÈRE INTENTION : réorientation, environnement calme, respect du rythme veille-sommeil, mobilisation, hydratation, correction des déficits sensoriels, présence des proches.",
                "Revoir et arrêter dès que possible les médicaments délirogènes (revue type STOPP/START).",
                "Éviter la contention physique (aggrave l'agitation).",
            ]},
            {"titre": "Posologies — agitation sévère menaçante uniquement", "type": "tableau_poso", "contenu": [
                {"molecule": "Halopéridol", "posologie": "0,5–1 mg PO/IM, débuter bas chez le sujet âgé", "vigilance": "QT long, maladie de Parkinson / démence à corps de Lewy : contre-indiqué"},
                {"molecule": "Rispéridone", "posologie": "0,25–0,5 mg PO", "vigilance": "Risque d'AVC en cas de démence"},
                {"molecule": "Oxazépam", "posologie": "réservé au sevrage alcoolique/benzodiazépines", "vigilance": "Aggrave la confusion en dehors de cette indication"},
            ]},
            {"titre": "Références", "type": "texte", "contenu": [
                "Source : WikEM — « Delirium » (wikem.org), licence CC BY-SA.",
                "À compléter/valider par les recommandations françaises (HAS, SFGG).",
            ]},
        ],
    },
}

def main():
    base = os.path.dirname(os.path.abspath(__file__))
    raw = json.load(open(os.path.join(base, "_raw", "raw_wikem.json"), encoding="utf-8"))
    guidelines = []
    for pid, build in ADAPTED.items():
        guidelines.append(build(date_maj(raw, pid)))
    out = {
        "meta": {
            "source": "wikem.org (CC BY-SA), adapté FR/gériatrie",
            "genere_par": "pipeline/fetch_wikem.py + adapt_wikem.py",
            "total": len(guidelines),
            "attribution": "Contenu adapté de WikEM (wikem.org) sous licence CC BY-SA. "
                           "Attribution requise à l'affichage (badge source + pied de page).",
            "avertissement": "Guidelines valide:false / relu_par:'' : publication après relecture "
                             "clinique du Dr Scattu uniquement.",
        },
        "guidelines": guidelines,
    }
    path = os.path.join(base, "..", "data", "guidelines.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"[out] {path} — {len(guidelines)} guideline(s) adaptée(s), valide:false")

if __name__ == "__main__":
    main()
