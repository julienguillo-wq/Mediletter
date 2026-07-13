# Audit des calculs — Phase A : Inventaire et triage

Règle absolue : **aucun score n'affiche un résultat qui n'est pas sa vraie formule.**
Seuls les `CALCULE_VERIFIE` calculent ; les autres sont en mode documentation (items + lien source).

## Compteurs par statut (375 scores medicalcul)

| Statut | Nombre | Action |
|---|---:|---|
| `CALCULE_VERIFIE` | 196 | calcul actif (harnais passé) |
| `CALCULE_NON_VERIFIE` | 1 | calcul DÉSACTIVÉ → doc + source, requalif. phase C |
| `SANS_FORMULE_IMPLEMENTEE` | 95 | calcul DÉSACTIVÉ → doc + source, à implémenter phase C |
| `DOCUMENTATION` | 83 | sans formule (classification/abaque), hors périmètre |
| **Total** | **375** | |

Plus **47 calculateurs historiques** (app-native, formules codées : Cockcroft, CHA₂DS₂-VASc, Glasgow, MMSE…) réintégrés en `CALCULE_VERIFIE`. Note : validés par usage, à repasser au harnais/audit médical (phase B).

## Croisement statut × catégorie

| Catégorie | Verifie | Non Verifie | Sans Formule Implementee | Documentation | Histor. | Total |
|---|---|---|---|---|---|---|
| Gériatrie | 6 | 0 | 5 | 1 | 19 | 12 |
| Cardio | 21 | 0 | 10 | 8 | 5 | 39 |
| Neuro | 23 | 0 | 3 | 7 | 1 | 33 |
| Réa | 13 | 0 | 3 | 6 | 4 | 22 |
| Pneumo | 12 | 0 | 6 | 4 | 2 | 22 |
| Néphro | 12 | 0 | 6 | 3 | 6 | 21 |
| Gastro | 0 | 0 | 0 | 0 | 4 | 0 |
| Pédiatrie | 7 | 0 | 5 | 0 | 2 | 12 |
| Général | 102 | 1 | 57 | 54 | 4 | 214 |
| **Total** | 196 | 1 | 95 | 83 | 47 | 375 |

## Détail par catégorie

### Gériatrie

- **CALCULE_VERIFIE** (6) : adlkatz, algoplus, cirs, gds15, iadllawton, mms
- **SANS_FORMULE_IMPLEMENTEE** (5) : aggir_calc, chumlea, cornell, doloplus, nri
- **DOCUMENTATION** (1) : aggir_gir
- **Historiques CALCULE_VERIFIE** (19) : adl, aggir, braden, cam, charlson, fried, g8, gds15, gds4, getupgo, horloge, iadl, mmse, mna, mnasf, norton, sppb, tinetti, zarit

### Cardio

- **CALCULE_VERIFIE** (21) : aquitaintvp, cha2ds2va, cha2ds2vasc, chads2, chevillebrasidx, dapt, dasi, hasbled, heart, hemorr2hages, herdoo2, pam, riete, score4peps, standretvp, stesmith3v, stesmith4v, timinst, tvscore, villalta, wellstvp
- **SANS_FORMULE_IMPLEMENTEE** (10) : crusade, euroscore1log, framingham, grace, indcornell, precisedapt, qtcorrige, riskcvsc, riskcvsc2, surfvalvediam
- **DOCUMENTATION** (8) : cardiac_souffle, ccsangina, dissec_aorte, ehra_fa, killip, nyha, timicoro, timihemor
- **Historiques CALCULE_VERIFIE** (5) : chads, hasbled, qtc, wellsep, wellstvp

### Neuro

- **CALCULE_VERIFIE** (23) : abcd2, anxietehamilton, barthel, bdi13beck, bits, bref, depressionhamilton, epds, epworth, four, glasgow, glasgowped, glasgowped2, ich_neuro, irls, liege, macnairsimpl, neurodn4, nihss, scoff, sisbeck, stess, updrs
- **SANS_FORMULE_IMPLEMENTEE** (3) : hadanxdep, pdq39, pss
- **DOCUMENTATION** (7) : edssech, fssfatigue, hoehn_yahr, mrcmuscforce, rankin, schwab_england, tcmasters
- **Historiques CALCULE_VERIFIE** (1) : canadian

### Réa

- **CALCULE_VERIFIE** (13) : aldrete, apache2, apfel, ariscat, caprini05, deltapp, hope, igs2, lee, macocha, qsofa, roxindex, sofa
- **SANS_FORMULE_IMPLEMENTEE** (3) : cavo2, gastvol_perlas, volventiladulte
- **DOCUMENTATION** (6) : asa, cormack, mallampati, ramsay, rass, rudkin
- **Historiques CALCULE_VERIFIE** (4) : glasgow, news, qsofa, sofa

### Pneumo

- **CALCULE_VERIFIE** (12) : act12, crbu65, depistbpco, genevemodifie, hestia, nijmegen_hyperventil, pafio2, percep, pesi, smartcop, wellsep, winter
- **SANS_FORMULE_IMPLEMENTEE** (6) : fine, gdsinter, gradaao2, idsaats07, peakflow, peakflowped
- **DOCUMENTATION** (4) : gold2017, goldbpco, mmrc, sadoul
- **Historiques CALCULE_VERIFIE** (2) : curb65, fine

### Néphro

- **CALCULE_VERIFIE** (12) : cockcroft, diurese_horaire, fractexcret_au, fractexcret_na, fractexcret_uree, idx_excretion_uree, iief5, ipss, osmourine, schwartz, stone, uvsurp
- **SANS_FORMULE_IMPLEMENTEE** (6) : ckdepi2009, ckdepi2021, ira_indices, kfre, mdrdsimp, ratioprotucreatu
- **DOCUMENTATION** (3) : fract_rein, irastades, irstades
- **Historiques CALCULE_VERIFIE** (6) : cacorr, cg, ckdepi, nacorr, osmo, ta

### Gastro

- **Historiques CALCULE_VERIFIE** (4) : alvarado, child, gbs, meld

### Pédiatrie

- **CALCULE_VERIFIE** (7) : apgar, blantyre, guarino, pram, silverman, wang, wood
- **SANS_FORMULE_IMPLEMENTEE** (5) : abaq_ped, agecorrige, percpoids, rbilialb, taille_cible
- **Historiques CALCULE_VERIFIE** (2) : apgar, silverman

### Général

- **CALCULE_VERIFIE** (102) : abc_transfu, absi, adiva, afsr_endometriose, agegest_hu, albcrp, albi, alvarado, apgarchir, apri, asdas, balthazarmodif, basdai, basfi, baumgarten, bisap, bishop, blamey, blatchford, bmi, braden, brest, call, cash, charlson, childpugh, ciwaar, convergencespp, corr_gb_pl, corticoides, csrs, dakar, das28, def_eaulibre, diva, dlqi, ebs, eisinger, elift, epices, fagerstrom, fernandez, fhscore, fib4, findrisc, firstquest, fructo_hba1c, fumincen_diag, g8quest, girerdobsth, harveybradshaw, higham, hoen, homa_ir, isis, isth_civd, kcorrigee, khorana, lequesne_genou, lequesne_hanche, lichtiger, lille, macisaac, malinas, mannheim, manning, mascc, meds, mgap, myasthenic_garche, n4tscore, nafld, news, news2, nijmegen_goutte, norton, nrs2002, opioides_equiv, packyear, padoue, pasapp, pasi, pomi, pr_acreular, prematspia, presev, ptikhellaf, puqe, ranson, sdai, skene, spia, spondylo_amor, surfacecorpo, surfacecorpoped, tripcast, trouanioniqueu, uti_d, vhtvauthey, wallace, wast, westley
- **CALCULE_NON_VERIFIE** (1) : conversions
- **SANS_FORMULE_IMPLEMENTEE** (57) : adroguemadias, afc_colo, anatnomen, autono2, berlinsas, bvaswg, cacorrigee, calcium_grio, calgrossesse, cushman, datationlcc, debdrog, debdrogpt, debperf, debpse, debtransfu, def_sodium, deficitfer, depenergie, figotropho, friedewald, globe, haq, hba1c2gpm, hscore, hypotherm_vitals, imrie, issrtstriss, lundbrowder, maddrey, masse_maigre, meld, mercuriali, mgpliscut_durnin, mnanut, mwd6, nacorrigee, ohwidmark, osmoplasma, p_xbw, parc, pertsgaccept, poidstheoric, rempbruleadulte, rempbruleenfant, rendplq, rissc, rockall, ruffierdickson, shockidx, stopbang, toronto, trouanioniquep, vo2maxth, voltransfucgr, wifi, wpi_sss
- **DOCUMENTATION** (54) : altemeier, annarbor, antidotes, balthazar, bangui, binet, cage_deta, cauchoix, ccmu, ch_maldeclobl, duree, ecog, eva_adulte, eva_enfant, figomyome, forrest, french, garden, gemsa, gradetraum, gustilo, haps, hlh2004, house, hypotherclass, jonesraa, karnofsky, lagrange_rigault, landry, lefort, maccabe, moore_rate, nicerenut, omssida, ottawacephalee, ottawacheville, ottawagenou, palugrav, qc_maldeclobl, ringmessmer, safe_marche_ryan, salter, schemdent, sepsis3, spondperiph_asas, spondylo_asas, spondylo_essg, sris, stadenvip, tn_maldeclobl, tnm, truelovewitts, valeursbio, vittel
- **Historiques CALCULE_VERIFIE** (4) : dose, imc, poids, sc
