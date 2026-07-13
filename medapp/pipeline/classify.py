#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase A — Inventaire et triage des scores.

Classe chacun des 375 scores medicalcul dans EXACTEMENT un statut, à partir du
rapport du harnais (_raw/verif_report.json) et de la composition des inputs :

- CALCULE_VERIFIE       : harnais passé (sum == JS medicalcul sur 100 vecteurs)
- CALCULE_NON_VERIFIE   : formulaire présent mais pas de formule exécutable /
                          harnais non concluant → calcul désactivé
- SANS_FORMULE_IMPLEMENTEE : formule medicalcul existante mais non convertie
                          (numérique/pondérée) → calcul désactivé
- DOCUMENTATION         : aucun formulaire (classifications, abaques)

Écrit le champ `statut` dans data/scores.json et génère audit/inventaire.md.
Les 44 calculateurs historiques (app-native, formules codées) sont réintégrés
en CALCULE_VERIFIE (section dédiée).
"""
import json, os
from collections import Counter, defaultdict

BASE = os.path.dirname(os.path.abspath(__file__))
SCORES = os.path.join(BASE, "..", "data", "scores.json")
REPORT = os.path.join(BASE, "_raw", "verif_report.json")
HIST = os.path.join(BASE, "_raw", "historiques.json")
AUDIT = os.path.join(BASE, "..", "audit")

CATS = ["geriatrie", "cardio", "neuro", "rea", "pneumo", "nephro", "gastro", "pediatrie", "general"]
CAT_LABEL = {"geriatrie": "Gériatrie", "cardio": "Cardio", "neuro": "Neuro", "rea": "Réa",
             "pneumo": "Pneumo", "nephro": "Néphro", "gastro": "Gastro", "pediatrie": "Pédiatrie",
             "general": "Général"}

def statut_for(rep):
    c = rep.get("counts") or {}
    ninputs = (c.get("radios", 0) + c.get("checks", 0) + c.get("numbers", 0) + c.get("selects", 0))
    if rep["verifiee"]:
        return "CALCULE_VERIFIE"
    if ninputs == 0:
        return "DOCUMENTATION"
    raison = rep.get("raison", "")
    if raison.startswith("référence en erreur"):
        return "CALCULE_NON_VERIFIE"
    if not c.get("hasFCalc"):
        return "CALCULE_NON_VERIFIE"
    # formulaire + formule présente mais non reproduite (mismatch, ou numérique/select) :
    return "SANS_FORMULE_IMPLEMENTEE"

def main():
    data = json.load(open(SCORES, encoding="utf-8"))
    report = {r["id"]: r for r in json.load(open(REPORT, encoding="utf-8"))}
    hist = json.load(open(HIST, encoding="utf-8")) if os.path.exists(HIST) else []

    # Attribution du statut
    by_status = Counter()
    grid = defaultdict(lambda: Counter())  # grid[cat][statut]
    for s in data["scores"]:
        if s.get("formule_verifiee"):
            st = "CALCULE_VERIFIE"   # additif vérifié OU formule native validée au harnais
        else:
            st = statut_for(report.get(s["id"], {"verifiee": False, "counts": None, "raison": ""}))
        s["statut"] = st
        by_status[st] += 1
        grid[s["categorie"]][st] += 1
    data["meta"]["statuts"] = dict(by_status)

    # Chiffres pour le hub d'accueil (dynamiques, dédoublonnés)
    hist_all = json.load(open(HIST, encoding="utf-8")) if os.path.exists(HIST) else []
    histo_ids = set(h["id"] for h in hist_all)
    med_ids = set(s["id"] for s in data["scores"])
    cv_shadowed = sum(1 for s in data["scores"] if s["statut"] == "CALCULE_VERIFIE" and s["id"] in histo_ids)
    verifies = len(histo_ids) + (by_status.get("CALCULE_VERIFIE", 0) - cv_shadowed)
    catalogue = len(med_ids - histo_ids) + len(histo_ids)
    data["meta"]["hub"] = {
        "verifies": verifies,
        "total": catalogue,
        "guidelines": 8,
        "pct": round(verifies / catalogue * 100, 1) if catalogue else 0,
    }
    json.dump(data, open(SCORES, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    # Historiques (réintégrés CALCULE_VERIFIE)
    hist_by_cat = Counter(h["categorie"] for h in hist)

    os.makedirs(AUDIT, exist_ok=True)
    STATUSES = ["CALCULE_VERIFIE", "CALCULE_NON_VERIFIE", "SANS_FORMULE_IMPLEMENTEE", "DOCUMENTATION"]
    lines = []
    lines.append("# Audit des calculs — Phase A : Inventaire et triage\n")
    lines.append("Règle absolue : **aucun score n'affiche un résultat qui n'est pas sa vraie formule.**")
    lines.append("Seuls les `CALCULE_VERIFIE` calculent ; les autres sont en mode documentation (items + lien source).\n")
    lines.append("## Compteurs par statut (375 scores medicalcul)\n")
    lines.append("| Statut | Nombre | Action |")
    lines.append("|---|---:|---|")
    actions = {
        "CALCULE_VERIFIE": "calcul actif (harnais passé)",
        "CALCULE_NON_VERIFIE": "calcul DÉSACTIVÉ → doc + source, requalif. phase C",
        "SANS_FORMULE_IMPLEMENTEE": "calcul DÉSACTIVÉ → doc + source, à implémenter phase C",
        "DOCUMENTATION": "sans formule (classification/abaque), hors périmètre",
    }
    for st in STATUSES:
        lines.append(f"| `{st}` | {by_status[st]} | {actions[st]} |")
    lines.append(f"| **Total** | **{sum(by_status.values())}** | |")
    lines.append("")
    lines.append("Plus **" + str(len(hist)) + " calculateurs historiques** (app-native, formules codées : Cockcroft, "
                 "CHA₂DS₂-VASc, Glasgow, MMSE…) réintégrés en `CALCULE_VERIFIE`. "
                 "Note : validés par usage, à repasser au harnais/audit médical (phase B).\n")

    lines.append("## Croisement statut × catégorie\n")
    header = "| Catégorie | " + " | ".join(s.replace("CALCULE_", "").replace("_", " ").title() for s in STATUSES) + " | Histor. | Total |"
    lines.append(header)
    lines.append("|" + "---|" * (len(STATUSES) + 3))
    for cat in CATS:
        row = grid[cat]
        tot = sum(row.values())
        lines.append(f"| {CAT_LABEL[cat]} | " + " | ".join(str(row[s]) for s in STATUSES) +
                     f" | {hist_by_cat.get(cat,0)} | {tot} |")
    lines.append(f"| **Total** | " + " | ".join(str(by_status[s]) for s in STATUSES) +
                 f" | {len(hist)} | {sum(by_status.values())} |")
    lines.append("")

    # Détail des CALCULE_VERIFIE et des à-requalifier par catégorie
    lines.append("## Détail par catégorie\n")
    for cat in CATS:
        scs = [s for s in data["scores"] if s["categorie"] == cat]
        if not scs and not hist_by_cat.get(cat):
            continue
        lines.append(f"### {CAT_LABEL[cat]}\n")
        for st in STATUSES:
            ids = sorted(s["id"] for s in scs if s["statut"] == st)
            if ids:
                lines.append(f"- **{st}** ({len(ids)}) : {', '.join(ids)}")
        h = [x["id"] for x in hist if x["categorie"] == cat]
        if h:
            lines.append(f"- **Historiques CALCULE_VERIFIE** ({len(h)}) : {', '.join(sorted(h))}")
        lines.append("")

    open(os.path.join(AUDIT, "inventaire.md"), "w", encoding="utf-8").write("\n".join(lines))
    print("Statuts:", dict(by_status), "| historiques:", len(hist))
    print("audit/inventaire.md généré")

if __name__ == "__main__":
    main()
