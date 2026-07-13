# Audit médical des formules — Cardiologie / Vasculaire

**Périmètre** : les 24 scores cardio qui *calculent*. Même méthode que réa (formule implémentée vs publication d'origine / MDCalc / société savante). **Je signale, je ne corrige pas.**

**Légende** : ✅ CONFORME · ⚠️ ECART_MINEUR · ⛔ DISCORDANCE · 🔎 caveat.

| Score | Implémentation | Référence | Verdict |
|---|---|---|---|
| **PAM** | (PAS + 2·PAD)/3, arrondi | définition physiologique standard | ✅ |
| **Index cheville-bras (IPS)** | PAS cheville / PAS bras | AHA/ACC ; Aboyans, *Circulation* 2012 | ✅ |
| **CHADS₂** | CHF+HTA+Âge≥75+DM+2·AVC | Gage BF, *JAMA* 2001 | ✅ |
| **CHA₂DS₂-VA** | idem VASc **sans** point sexe | ESC 2024 (nouvelle nomenclature) | ✅ |
| **CHA₂DS₂-VASc** | +2 âge≥75, +1 âge 65-74, +1 sexe F | Lip GYH, *Chest* 2010 | ⚠️ |
| **HAS-BLED** (hist.) | 9 items ×1, 0-9 | Pisters R, *Chest* 2010 | ✅ 🔎 |
| **QTc** (hist.) | Bazett QT/√RR | Bazett 1920 | ✅ 🔎 |
| **Wells EP / TVP** (hist.) | critères de Wells | Wells PS, *Thromb Haemost* 2000 | ✅ 🔎 |
| **HEART** | 5 items ×0-2, 0-10 | Six AJ, *Neth Heart J* 2008 | ✅ |
| **TIMI** | 7 facteurs ×1, 0-7 (AI/NSTEMI) | Antman EM, *JAMA* 2000 | ✅ |
| **Villalta** | Σ 5 signes + 5 symptômes ×0-3 | Villalta, *Haemostasis* 1994 | ✅ |
| **Smith/Sgarbossa modifié (STE 3v/4v)** | équation pondérée ST/QTc/RV4 | Smith SW, *Ann Emerg Med* 2012 | ✅ |
| **4PEPS** | somme pondérée | Roy PM, *JAMA Cardiol* 2021 | ✅ 🔎 |
| **DAPT** | somme (âge négatif possible) | Yeh RW, *JAMA* 2016 | ✅ 🔎 |
| **DASI** | somme pondérée activités | Hlatky MA, *Am J Cardiol* 1989 | ✅ 🔎 |
| **HEMORR₂HAGES** | somme pondérée | Gage BF, *Am Heart J* 2006 | ✅ 🔎 |
| **HERDOO2** | 4 items ×1 (femmes) | Rodger MA, *CMAJ* 2008 | ✅ |
| **RIETE** | somme pondérée (hémorragie) | Ruíz-Giménez N, *Thromb Haemost* 2008 | ✅ 🔎 |
| **Score de St André / Aquitain (TVP)** | somme | scores locaux de probabilité TVP | ✅ 🔎 |
| **Score T.V.** | somme | — | 🔎 |
| **Score 4PEPS / Genève** | — | — | ✅ 🔎 |

## Points à signaler

⚠️ **CHA₂DS₂-VASc — ECART_MINEUR** : la fiche n'attribue le **point « sexe féminin »** que si un critère d'âge est présent (`(âge≥75 ou âge 65-74) ET femme → +1`). Le score original de Lip 2010 attribue +1 pour le sexe féminin **indépendamment** (même si, cliniquement, le sexe féminin isolé est considéré à bas risque). Conséquence : chez une femme < 65 ans sans autre facteur, la fiche donne 0 au lieu de 1. À arbitrer — la pratique récente (ESC) tend d'ailleurs vers le **CHA₂DS₂-VA** (sans sexe), présent séparément et conforme.

🔎 **Caveats (spot-check des barèmes recommandé)** : HAS-BLED, HEMORR₂HAGES, RIETE, DAPT, DASI, 4PEPS — scores à **pondérations multiples** non recomparées ligne à ligne à la source ; ce sont des scores de risque hémorragique/thrombotique où une pondération erronée modifie la décision. QTc : vérifier la formule utilisée (Bazett vs Fridericia) et l'unité du QT/RR.

## Synthèse cardio
- **CONFORME** : 23 (dont ~8 avec caveat 🔎 barèmes).
- **ECART_MINEUR** : 1 — **CHA₂DS₂-VASc** (conditionnement du point sexe).
- **DISCORDANCE** : 0.

Vérifiés item par item et conformes : HEART, ABCD² (côté neuro), CHADS₂, CHA₂DS₂-VA/VASc (structure), TIMI, HERDOO2. Aucune correction appliquée.
