# Audit médical des formules — Réanimation / Anesthésie

**Périmètre** : les 15 scores de réa qui *calculent* (statut CALCULE_VERIFIE ou historique codé).
**Méthode** : la formule implémentée (native prouvée identique au JS medicalcul sur ≥300 vecteurs, ou somme d'items, ou fiche historique codée) est comparée à la publication d'origine / MDCalc / société savante. **Je signale, je ne corrige pas** — corrections en commits séparés après arbitrage.

**Légende** : ✅ CONFORME · ⚠️ ECART_MINEUR · ⛔ DISCORDANCE · 🔎 caveat = vérification recommandée par le Dr Scattu.

| Score | Implémentation (résumée) | Référence | Verdict |
|---|---|---|---|
| **ROX** | (SpO₂/FiO₂)/FR, FiO₂ en % | Roca O, *Am J Respir Crit Care Med* 2019;199:1368 | ✅ |
| **ΔPP** | 100·(PPmax−PPmin)/moyenne | Michard F, *Am J Respir Crit Care Med* 2000 | ✅ |
| **qSOFA** | FR≥22 + confusion + PAS≤100, 0-3 | Singer M, *JAMA* 2016 (Sepsis-3) | ✅ |
| **SOFA** | 6 organes 0-4 (voir notes) | Vincent JL, *Intensive Care Med* 1996 | ✅ ⚠️ |
| **Glasgow (GCS)** | Œil(1-4)+Verbal(1-5)+Moteur(1-6), 3-15 | Teasdale G, *Lancet* 1974 | ✅ |
| **NEWS 2** | 7 paramètres physiologiques | RCP, NEWS2 2017 | ✅ 🔎 |
| **Aldrete** | Σ 5 items ×0-2 = 0-10 (base) | Aldrete JA, *J Clin Anesth* 1970/1995 | ✅ |
| **Apfel (NVPO)** | 4 facteurs binaires, 0-4 | Apfel CC, *Anesthesiology* 1999 | ✅ |
| **MACOCHA** | Mallampati III/IV=5, SAOS=2, autres=1, 0-12 | De Jong A, *Am J Respir Crit Care Med* 2013 | ✅ |
| **Lee (RCRI)** | 6 facteurs ×1, 0-6 | Lee TH, *Circulation* 1999 | ⚠️ |
| **HOPE** | logistique survie (âge, sexe, méca, durée RCP, T°, K⁺) | Pasquier M, *Resuscitation* 2018 | ✅ |
| **APACHE II** | APS + points âge + (15−GCS) + rénal ×2 si IRA | Knaus WA, *Crit Care Med* 1985 | ✅ 🔎 |
| **IGS II (SAPS II)** | somme pondérée 15 items | Le Gall JR, *JAMA* 1993 | ✅ 🔎 |
| **ARISCAT** | somme pondérée 7 items | Canet J, *Anesthesiology* 2010 | ✅ 🔎 |
| **Caprini (2005)** | somme pondérée 33 items (1/2/3/5 pts) | Caprini JA, *Dis Mon* 2005 | ✅ 🔎 |

## Détails, unités et cas limites

**SOFA** ✅ — seuils vérifiés item par item et conformes : PaO₂/FiO₂ (>400/300/200/100/≤100), plaquettes (>150/100/50/20/≤20 ×10³), bilirubine (<20/≥20/≥33/≥102/>204 µmol/L), cardiovasculaire (PAM / dopamine-adrénaline-noradrénaline par paliers), GCS, créatinine/diurèse.
⚠️ **Nuance à signaler** : dans le SOFA original, les niveaux respiratoires 3 et 4 supposent une **ventilation mécanique** ; la fiche ne conditionne pas ce critère (simplification, peut surestimer le sous-score respiratoire chez un patient non ventilé).

**Lee / RCRI** ⚠️ **ECART_MINEUR à signaler** — le 6ᵉ critère est libellé « Insuffisance rénale chronique », alors que le RCRI original définit ce critère par une **créatininémie > 2 mg/dL (177 µmol/L)**. Intention clinique proche mais le libellé n'impose pas le seuil biologique exact → risque d'interprétation. Les 5 autres critères (chirurgie à haut risque, cardiopathie ischémique, insuffisance cardiaque, AVC/AIT, diabète insulino-requérant) sont conformes.

**APACHE II** ✅ structure conforme (12 variables physiologiques + points d'âge + antécédents ; neuro = 15−GCS ; **points rénaux doublés si insuffisance rénale aiguë** — règle authentique de Knaus 1985). 🔎 **Caveat** : les bornes de points des 12 variables physiologiques (APS) n'ont pas été recomparées ligne à ligne au barème original — spot-check recommandé.

**IGS II / ARISCAT / Caprini** ✅ structure et nature additive pondérée conformes aux publications ; 🔎 **caveat** : les **barèmes de points par item** (poids exacts) n'ont pas été revérifiés exhaustivement contre la source — spot-check recommandé, d'autant que ce sont des scores pronostiques (IGS II) ou de stratification (ARISCAT/Caprini) où une erreur de pondération change le risque estimé.

**NEWS 2** ✅ 7 paramètres conformes ; 🔎 caveat : vérifier l'échelle SpO₂ (Scale 1 vs Scale 2 BPCO) et l'attribution des points d'air/O₂.

**Aldrete** ✅ — le score de base (0-10) somme 5 items ; la fiche propose aussi le score **modifié** (SpO₂ au lieu de la coloration) via un 6ᵉ item, correctement exclu du total de base.

**Unités** : ROX (FiO₂ %, SpO₂ %), HOPE (T° °C, conversion °F gérée), SOFA/Lee/APACHE (créatinine, bilirubine — unités portées par la saisie). Aucune ambiguïté d'unité bloquante détectée sur ce lot, hors le libellé rénal du RCRI.

## Synthèse réa
- **CONFORME** : 13 (ROX, ΔPP, qSOFA, SOFA*, GCS, NEWS2*, Aldrete, Apfel, MACOCHA, HOPE, APACHE II*, IGS II*, ARISCAT*, Caprini*) — dont 6 avec caveat 🔎 (spot-check barèmes) et SOFA avec 1 nuance ⚠️.
- **ECART_MINEUR** : 1 — **Lee/RCRI** (libellé rénal « IRC » vs seuil créatinine > 2 mg/dL).
- **DISCORDANCE** : 0.

Aucune correction appliquée. Point d'arbitrage prioritaire : le critère rénal du RCRI, et la revue des barèmes des scores pronostiques (IGS II, APACHE II, ARISCAT, Caprini).
