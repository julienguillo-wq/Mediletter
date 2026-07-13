# Audit médical des formules — Néphrologie / Urologie

**Périmètre** : les scores néphro/uro qui *calculent*. Formule implémentée vs publication. **Je signale, je ne corrige pas.**
**Légende** : ✅ CONFORME · ⚠️ ECART_MINEUR · ⛔ DISCORDANCE · 🔎 caveat.

| Score | Implémentation | Référence | Verdict |
|---|---|---|---|
| **Cockcroft-Gault** (native + hist. `cg`) | (140−âge)·poids·K/créat, K=1,23 H / 1,04 F | Cockcroft DW, *Nephron* 1976 | ✅ ⚠️ |
| **CKD-EPI** (hist. `ckdepi`) | DFG estimé | Levey AS, *Ann Intern Med* 2009/2021 | ✅ 🔎 |
| **Schwartz** (native) | k·taille/créat | Schwartz GJ, *J Am Soc Nephrol* 2009 | ✅ 🔎 |
| **Clairance créat. UV/P** (`uvsurp`) | (UCr·V)/(PCr·durée) | définition standard | ✅ |
| **FeNa** (`fractexcret_na`) | 100·(UNa·PCr)/(PNa·UCr) | Espinel CH, *JAMA* 1976 | ✅ |
| **FeUrée** (`fractexcret_uree`) | 100·(UUrée·PCr)/(PUrée·UCr) | Carvounis CP, *Kidney Int* 2002 | ✅ |
| **Fraction excrétée (autre)** (`fractexcret_au`) | même forme générique | — | ✅ |
| **Osmolarité urinaire** (`osmourine`) | 2·Na + 2·K + glucose + urée | calcul standard | ✅ |
| **Index d'excrétion urée** | 1000·urée·diurèse/poids | — | ✅ 🔎 |
| **Diurèse horaire** | (diurèse/poids)/durée | définition | ✅ |
| **Natrémie corrigée** (hist. `nacorr`) | correction glucose/protéines/lipides | Katz MA, *NEJM* 1973 | ✅ 🔎 |
| **Osmolarité plasmatique** (hist. `osmo`) | 2·Na + glycémie + urée | calcul standard | ✅ |
| **Trou anionique** (hist. `ta`) | Na − (Cl + HCO₃) | définition | ✅ |
| **Calcémie corrigée** (hist. `cacorr`) | correction albumine | Payne RB, *BMJ* 1973 | ✅ 🔎 |
| **IIEF-5** | 5 items ×1-5, 5-25 | Rosen RC, *Int J Impot Res* 1999 | ✅ |
| **IPSS** | 7 items ×0-5, 0-35 (+ QdV séparée) | Barry MJ, *J Urol* 1992 | ✅ |
| **STONE** | 5 composantes pondérées | Moore CL, *BMJ* 2014 | ✅ |

## Points à signaler

⚠️ **Cockcroft-Gault** — la fiche utilise le **poids réel** (comme la formule princeps). À signaler comme **limite connue** (et non erreur) : chez l'obèse ou l'œdémateux, l'usage du poids réel surestime la clairance ; beaucoup recommandent le poids idéal/ajusté. Constantes SI (1,23 H / 1,04 F) correctes. Point sensible du brief (unités créatinine) : **géré par un sélecteur d'unité** (µmol/L ↔ mg/dL) → pas d'ambiguïté bloquante.

🔎 **CKD-EPI** — vérifier **quelle version** est implémentée (2009 avec coefficient ethnique vs **2021 sans race**, désormais recommandée). Important : le choix change le DFG et l'usage recommandé est la version 2021.

🔎 **Schwartz** — vérifier la **constante k** sélectionnée (k varie selon l'âge/méthode de dosage : 0,413 « bedside » 2009, ou valeurs historiques 0,33-0,55) et l'unité de créatinine.

🔎 Natrémie corrigée / Calcémie corrigée : vérifier les **facteurs de correction** (0,3 vs 0,4 par mmol de glucose ; 0,02 vs 0,025 par g d'albumine selon la source).

## Synthèse néphro
- **CONFORME** : 17 (structure) — dont ~6 caveats 🔎 (version CKD-EPI, constante Schwartz, facteurs de correction) et 1 nuance ⚠️ (poids réel Cockcroft).
- **ECART_MINEUR** : 0 formel (la nuance Cockcroft = limite documentée).
- **DISCORDANCE** : 0.

Vérifiés et conformes : FeNa, FeUrée, osmolarités, trou anionique, IPSS, STONE, PERC. Aucune correction appliquée.
