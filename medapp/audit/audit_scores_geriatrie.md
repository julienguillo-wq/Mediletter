# Audit médical des formules — Gériatrie (cœur de l'application)

**Périmètre** : les 24 scores gériatriques qui *calculent* (5 medicalcul vérifiés + 19 fiches historiques codées). Formule implémentée vs publication / société savante. **Je signale, je ne corrige pas.**
**Légende** : ✅ CONFORME · ⚠️ ECART_MINEUR · ⛔ DISCORDANCE · 🔎 caveat.

| Score | Nature | Référence | Verdict |
|---|---|---|---|
| **ADL de Katz** (`adlkatz` + hist. `adl`) | 6 items, autonomie | Katz S, *JAMA* 1963 / 1976 | ✅ ⚠️ |
| **IADL de Lawton** (`iadllawton` + hist. `iadl`) | 8 items, 0-8 | Lawton MP, *Gerontologist* 1969 | ✅ 🔎 |
| **Algoplus** | douleur aiguë, 5 items ×1, ≥2 = douleur | Rat P, *Eur J Pain* 2011 | ✅ |
| **CIRS-G** | 14 systèmes ×0-4 | Miller MD, *Psychiatry Res* 1992 | ✅ 🔎 |
| **MMS / MMSE** (`mms` + hist. `mmse`) | 0-30 | Folstein MF, *J Psychiatr Res* 1975 | ✅ |
| **MNA** | statut nutritionnel, 0-30 | Guigoz Y, *Facts Res Gerontol* 1994 | ✅ 🔎 |
| **MNA-SF** | dépistage court, 0-14 | Rubenstein LZ, *J Gerontol* 2001 | ✅ |
| **Test de l'horloge** | dessin de l'horloge | Sunderland T, 1989 | ✅ 🔎 |
| **GDS-15** | dépression, 0-15 | Sheikh JI / Yesavage 1986 | ✅ |
| **Mini-GDS** | 4 items | Clément JP, *Encéphale* 1997 | ✅ |
| **Charlson** | comorbidités pondérées | Charlson ME, *J Chronic Dis* 1987 | ✅ 🔎 |
| **Tinetti** | équilibre + marche, 0-28 | Tinetti ME, *J Am Geriatr Soc* 1986 | ✅ 🔎 |
| **Get Up and Go / TUG** | mobilité chronométrée | Podsiadlo D, *J Am Geriatr Soc* 1991 | ✅ |
| **Braden** | risque d'escarre, 6-23 | Bergstrom N, *Nurs Res* 1987 | ✅ ⚠️ |
| **Norton** | risque d'escarre, 5-20 | Norton D, 1962 | ✅ 🔎 |
| **G8** | dépistage oncogériatrique, 0-17 | Bellera CA, *Ann Oncol* 2012 | ✅ |
| **CAM** | confusion / délirium | Inouye SK, *Ann Intern Med* 1990 | ✅ |
| **Fried** | phénotype de fragilité, 5 critères | Fried LP, *J Gerontol* 2001 | ✅ 🔎 |
| **SPPB** | performance physique, 0-12 | Guralnik JM, *J Gerontol* 1994 | ✅ 🔎 |
| **Zarit** | fardeau de l'aidant, 22 items | Zarit SH, *Gerontologist* 1980 | ✅ 🔎 |
| **AGGIR (GIR)** | groupe iso-ressources 1-6 | grille nationale AGGIR | ✅ 🔎 |

## Points à signaler

⚠️ **ADL de Katz — ECART_MINEUR / ambiguïté de version** : la fiche medicalcul (`adlkatz`) cote chaque item **0 / 0,5 / 1** (version française, total 0-6) ; la fiche historique (`adl`) peut utiliser une **autre cotation** (Katz original = dépendant/indépendant binaire). **Deux entrées ADL coexistent dans le catalogue** avec des barèmes potentiellement différents → risque de confusion. La source medicalcul elle-même note « plusieurs versions ». À arbitrer : garder une seule version de référence.

⚠️ **Braden — seuils d'interprétation** : la fiche regroupe **≥ 15 = « risque modéré »**, alors que la littérature distingue souvent **15-18 = risque léger/à risque** et **13-14 = modéré**. Le score (somme des 6 sous-échelles) est correct ; c'est le **libellé des tranches** qui diffère légèrement. À harmoniser avec le protocole du service.

🔎 **Charlson** : structure = somme pondérée correcte et seuils de survie à 10 ans conformes ; vérifier les **poids par comorbidité** (1/2/3/6) et l'éventuelle **pondération d'âge** (Charlson âge-ajusté).

🔎 **Barèmes/seuils à contrôler par le Dr Scattu** (structure conforme, valeurs à revérifier) : CIRS-G (cotation 0-4 par appareil), MNA (seuils 17/23,5), Tinetti (sous-scores équilibre/14 + marche/12), Fried (définitions des 5 critères + seuils de force/vitesse), SPPB (barème des 3 épreuves), Zarit (seuils de fardeau), AGGIR (algorithme de calcul du GIR), Norton (tranches de risque), IADL (cotation homme 5 items vs femme 8 items), Test de l'horloge (méthode de cotation).

## Synthèse gériatrie
- **CONFORME** : 24 (structure) — dont ~12 caveats 🔎 (barèmes/seuils à contrôler) et 2 nuances ⚠️ (versions ADL, tranches Braden).
- **ECART_MINEUR** : 1 formel — **coexistence de deux versions d'ADL** avec cotations potentiellement divergentes.
- **DISCORDANCE** : 0.

Vérifiés et conformes : Charlson (somme + survie), Braden (6 sous-échelles), G8 (seuil ≤ 14 → EGS), Algoplus (≥ 2). Aucune correction appliquée. **Priorité d'arbitrage** : unifier la version d'ADL, harmoniser les tranches de Braden, contrôler les barèmes MNA/Tinetti/Fried/SPPB (échelles à fort usage en UGA).
