# Audit médical des formules — Pneumologie

**Périmètre** : les 13 scores pneumo qui *calculent*. Formule implémentée vs publication. **Je signale, je ne corrige pas.**
**Légende** : ✅ CONFORME · ⚠️ ECART_MINEUR · ⛔ DISCORDANCE · 🔎 caveat.

| Score | Implémentation | Référence | Verdict |
|---|---|---|---|
| **PaO₂/FiO₂** (native) | PaO₂·100/FiO₂(%) | définition (Berlin ARDS 2012) | ✅ |
| **Winter** (native) | PCO₂ attendue = 1,5·HCO₃ + 8 | Albert MS, *Ann Intern Med* 1967 | ✅ |
| **PESI** (native) | âge + points | Aujesky D, *Am J Respir Crit Care Med* 2005 | ✅ |
| **CRB-65** (native) | Confusion+FR+PA+âge≥65, 0-4 | Lim WS, *Thorax* 2003 | ✅ |
| **CURB-65** (hist.) | +urée, 0-5 | Lim WS, *Thorax* 2003 | ✅ |
| **Fine / PSI** (hist.) | somme pondérée (classes I-V) | Fine MJ, *NEJM* 1997 | ✅ 🔎 |
| **Score de Genève modifié** | 9 items pondérés (EP) | Le Gal G, *Ann Intern Med* 2006 | ✅ |
| **SMART-COP** | 8 items pondérés (0/1/2) | Charles PGP, *Clin Infect Dis* 2008 | ✅ |
| **PERC** | 8 critères ×1 | Kline JA, *J Thromb Haemost* 2004 | ✅ |
| **Hestia** | critères binaires (EP ambulatoire) | Zondag W, *J Thromb Haemost* 2011 | ✅ 🔎 |
| **ACT (Asthma Control Test)** | 5 items ×1-5, 5-25 | Nathan RA, *J Allergy Clin Immunol* 2004 | ✅ |
| **Nijmegen (hyperventilation)** | 16 items ×0-4 | van Dixhoorn J, *J Psychosom Res* 1985 | ✅ 🔎 |
| **Dépistage BPCO** | auto-questionnaire | — | 🔎 |

## Points à signaler

**Genève modifié** ✅ — poids vérifiés item par item et **exactement conformes** à Le Gal 2006 : âge>65 (1), ATCD TVP/EP (3), chirurgie/immobilisation (2), cancer (2), douleur mollet (3), douleur+œdème unilatéral (4), hémoptysie (2), FC 75-94 (3), FC≥95 (5).

**SMART-COP** ✅ — pondérations vérifiées : PAS<90 (2), multilobaire (1), albumine<35 (1), FR élevée (1), tachycardie≥125 (1), confusion (1), hypoxémie (2), pH<7,35 (2). Les seuils de FR/oxygène **dépendants de l'âge** (≤50 vs >50 ans) sont correctement modélisés en items distincts.

**PERC** ✅ — 8 critères ×1 conformes. ⚠️ **À rappeler à l'usage** (pas une erreur de formule) : la règle est **négative** — elle écarte l'EP — quand **les 8 critères sont réunis** (score 8/8) ; l'interprétation du total va en sens inverse d'un score de risque classique.

🔎 **Fine / PSI** : vérifier le **barème de points** (âge, comorbidités, examen, biologie/imagerie) et la correspondance aux **classes I-V**.
🔎 **Hestia / Nijmegen** : vérifier les seuils (Hestia = tout critère présent contre-indique l'ambulatoire ; Nijmegen seuil ≥ 23/64).

## Synthèse pneumo
- **CONFORME** : 13 (structure) — dont ~4 caveats 🔎 (Fine/PSI, Hestia, Nijmegen, dépistage BPCO).
- **ECART_MINEUR** : 0.
- **DISCORDANCE** : 0.

Vérifiés item par item et conformes : Genève modifié, SMART-COP, PERC, CRB-65. Aucune correction appliquée.
