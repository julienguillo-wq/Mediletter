// Banque de questions SARC / ACLS — 60 questions
// Chaque question : { category, question, options, answer, explanation }
const SARC_QUESTIONS = [

  // ══════════════════════════════════════════
  //  CATÉGORIE 1 : Reconnaissance des rythmes ECG (20)
  // ══════════════════════════════════════════

  {
    category: "rythmes",
    question: "Un ECG montre un rythme régulier avec une fréquence de 150 bpm, des complexes QRS étroits (<0.12s), et une ligne de base en dents de scie bien visible. Quel est ce rythme ?",
    options: ["A. Tachycardie sinusale", "B. Flutter auriculaire", "C. Fibrillation auriculaire", "D. Tachycardie supraventriculaire (TSV)"],
    answer: "B",
    explanation: "Le flutter auriculaire se caractérise par des ondes F en dents de scie (typiquement à ~300/min) avec une conduction 2:1 donnant une FC de ~150 bpm."
  },
  {
    category: "rythmes",
    question: "Un tracé montre un rythme irrégulièrement irrégulier, sans ondes P identifiables, avec des complexes QRS étroits et une fréquence ventriculaire de 110 bpm. Quel est ce rythme ?",
    options: ["A. Flutter auriculaire à conduction variable", "B. Tachycardie auriculaire multifocale (TAM)", "C. Fibrillation auriculaire (FA)", "D. Tachycardie sinusale avec extrasystoles"],
    answer: "C",
    explanation: "La FA se caractérise par un rythme irrégulièrement irrégulier, l'absence d'ondes P et une ligne de base désorganisée."
  },
  {
    category: "rythmes",
    question: "Un patient en arrêt cardiaque présente un tracé montrant une activité électrique chaotique, sans complexes QRS, ondes P ou ondes T identifiables, avec des déflexions de grande amplitude. Ce rythme est :",
    options: ["A. Asystolie", "B. Tachycardie ventriculaire polymorphe", "C. Fibrillation ventriculaire (FV)", "D. Activité électrique sans pouls (AESP)"],
    answer: "C",
    explanation: "La FV montre une activité électrique désorganisée et chaotique sans complexes identifiables. C'est un rythme choquable."
  },
  {
    category: "rythmes",
    question: "Un ECG montre un rythme régulier à 40 bpm, des complexes QRS larges (0.16s), plus d'ondes P que de QRS, et aucune relation entre les ondes P et les QRS. Ce rythme est :",
    options: ["A. BAV du 1er degré", "B. BAV du 2e degré type I (Wenckebach)", "C. BAV du 2e degré type II", "D. BAV du 3e degré (complet)"],
    answer: "D",
    explanation: "Le BAV complet montre une dissociation AV complète : les ondes P et QRS battent indépendamment. Les QRS larges suggèrent un échappement ventriculaire."
  },
  {
    category: "rythmes",
    question: "Un tracé montre un allongement progressif de l'intervalle PR jusqu'à une onde P bloquée (sans QRS), puis le cycle recommence. Ce rythme est :",
    options: ["A. BAV du 1er degré", "B. BAV du 2e degré type I (Wenckebach)", "C. BAV du 2e degré type II", "D. BAV du 3e degré"],
    answer: "B",
    explanation: "Le Wenckebach (BAV 2e degré type I) montre un allongement progressif du PR jusqu'au blocage d'une onde P. Le cycle se répète ensuite."
  },
  {
    category: "rythmes",
    question: "Un patient présente un rythme régulier à QRS larges (>0.12s) avec une fréquence de 180 bpm. Il n'y a pas d'ondes P visibles et les QRS sont monomorphes. Quel est ce rythme ?",
    options: ["A. Tachycardie sinusale avec bloc de branche", "B. Tachycardie ventriculaire monomorphe (TV)", "C. Fibrillation ventriculaire fine", "D. Flutter auriculaire avec aberration"],
    answer: "B",
    explanation: "Une tachycardie régulière à complexes larges monomorphes sans ondes P est une TV jusqu'à preuve du contraire."
  },
  {
    category: "rythmes",
    question: "Un tracé ECG montre une ligne isoélectrique plate sans aucune activité électrique visible. Quel est ce rythme ?",
    options: ["A. FV fine", "B. Asystolie", "C. AESP", "D. Rythme idioventriculaire"],
    answer: "B",
    explanation: "L'asystolie est une ligne plate. Important : toujours vérifier les connexions, augmenter le gain et vérifier dans 2 dérivations avant de confirmer."
  },
  {
    category: "rythmes",
    question: "La tachycardie supraventriculaire (TSV) par réentrée nodale la plus fréquente se présente typiquement avec :",
    options: ["A. Un rythme irrégulier avec des ondes P de morphologies différentes", "B. Un rythme régulier, étroit, à début et fin brusques, FC 150-250 bpm", "C. Des ondes en dents de scie", "D. Un rythme irrégulièrement irrégulier sans ondes P"],
    answer: "B",
    explanation: "La TSV par réentrée nodale (TRIN) est typiquement régulière, à QRS étroits, avec début et fin paroxystiques."
  },
  {
    category: "rythmes",
    question: "Un ECG montre un rythme sinusal normal avec un intervalle PR fixe de 0.28 secondes. Quel est ce rythme ?",
    options: ["A. Rythme sinusal normal", "B. BAV du 1er degré", "C. BAV du 2e degré type I", "D. BAV du 2e degré type II"],
    answer: "B",
    explanation: "Un PR > 0.20s constant avec toutes les ondes P conduites définit le BAV du 1er degré. Il est généralement bénin."
  },
  {
    category: "rythmes",
    question: "Une tachycardie à QRS larges et irrégulière avec des complexes QRS polymorphes qui semblent tourner autour de la ligne isoélectrique évoque :",
    options: ["A. Fibrillation ventriculaire", "B. Torsade de pointes", "C. TV monomorphe", "D. FA avec bloc de branche"],
    answer: "B",
    explanation: "La torsade de pointes est une TV polymorphe avec rotation des QRS autour de la ligne de base, souvent associée à un QT long."
  },
  {
    category: "rythmes",
    question: "Un tracé montre un rythme régulier à 35 bpm, des complexes QRS étroits, avec des ondes P inversées juste avant ou après les QRS. Ce rythme est :",
    options: ["A. Bradycardie sinusale", "B. Rythme d'échappement jonctionnel", "C. BAV du 3e degré", "D. Rythme idioventriculaire"],
    answer: "B",
    explanation: "Un rythme lent avec QRS étroits et ondes P rétrogrades (inversées) est typique d'un échappement jonctionnel."
  },
  {
    category: "rythmes",
    question: "Les changements ECG caractéristiques de l'ischémie myocardique incluent des modifications temporaires :",
    options: ["A. De l'onde P et du segment ST", "B. Du segment ST et de l'onde T", "C. De l'onde P et du complexe QRS", "D. Du complexe QRS et de l'onde T"],
    answer: "B",
    explanation: "L'ischémie provoque des modifications du segment ST (sous-décalage) et de l'onde T (inversion). Un sus-décalage du ST indique une lésion/infarctus."
  },
  {
    category: "rythmes",
    question: "Un ECG montre un rythme régulier avec un rapport P:QRS de 2:1. L'intervalle PR des ondes P conduites est constant. La fréquence auriculaire est de 80 bpm et la fréquence ventriculaire de 40 bpm. Ce rythme est :",
    options: ["A. Bradycardie sinusale", "B. BAV du 2e degré type I", "C. BAV du 2e degré 2:1", "D. BAV du 3e degré"],
    answer: "C",
    explanation: "Un BAV 2:1 montre exactement 2 ondes P pour chaque QRS avec un PR constant pour les ondes conduites. On ne peut pas le classer type I ou II avec certitude."
  },
  {
    category: "rythmes",
    question: "Un patient présente une bradycardie sinusale à 45 bpm. Le tracé montre des ondes P normales suivies de QRS étroits avec un PR normal. Quand cette bradycardie nécessite-t-elle un traitement ?",
    options: ["A. Toujours, car la FC est < 60 bpm", "B. Uniquement si le patient est symptomatique (hypotension, altération de conscience, signes de choc)", "C. Uniquement si la FC est < 40 bpm", "D. Jamais, c'est toujours bénin"],
    answer: "B",
    explanation: "La bradycardie ne nécessite un traitement que si elle est symptomatique (hypotension, altération de conscience, douleur thoracique, signes de choc, insuffisance cardiaque)."
  },
  {
    category: "rythmes",
    question: "Quel rythme se caractérise par au moins 3 morphologies d'ondes P différentes, un rythme irrégulier et une fréquence > 100 bpm ?",
    options: ["A. Fibrillation auriculaire", "B. Flutter auriculaire à conduction variable", "C. Tachycardie auriculaire multifocale (TAM)", "D. Tachycardie sinusale avec ESA"],
    answer: "C",
    explanation: "La TAM se définit par au moins 3 morphologies d'ondes P différentes, des intervalles PP, PR et RR variables. Souvent associée à une pathologie pulmonaire."
  },
  {
    category: "rythmes",
    question: "Un tracé montre un BAV du 2e degré avec des intervalles PR constants pour les ondes P conduites, des QRS larges, et des ondes P occasionnellement bloquées sans allongement progressif du PR. Ce rythme est :",
    options: ["A. BAV du 2e degré type I", "B. BAV du 2e degré type II", "C. BAV du 1er degré", "D. BAV du 3e degré"],
    answer: "B",
    explanation: "Le BAV 2e degré type II montre un PR constant avec des ondes P bloquées de façon soudaine (sans allongement progressif). Les QRS sont souvent larges. Risque élevé de progression vers BAV complet."
  },
  {
    category: "rythmes",
    question: "Un patient asymptomatique présente un ECG avec des complexes QRS larges isolés, prématurés, sans onde P précédente, suivis d'une pause compensatrice. Ce sont :",
    options: ["A. Extrasystoles auriculaires (ESA)", "B. Extrasystoles ventriculaires (ESV)", "C. Complexes d'échappement jonctionnels", "D. Phénomène d'Ashman"],
    answer: "B",
    explanation: "Les ESV sont des complexes prématurés larges, sans onde P, suivis d'une pause compensatrice complète. Isolées chez un patient asymptomatique, elles ne nécessitent généralement pas de traitement."
  },
  {
    category: "rythmes",
    question: "Les dérivations II, III et aVF d'un ECG montrent un sus-décalage du segment ST significatif. Quelle paroi du cœur est touchée ?",
    options: ["A. Antérieure", "B. Latérale", "C. Inférieure", "D. Septale"],
    answer: "C",
    explanation: "II, III, aVF regardent la paroi inférieure (artère coronaire droite). Antérieure = V1-V4 (IVA). Latérale = I, aVL, V5-V6 (Cx). Septale = V1-V2."
  },
  {
    category: "rythmes",
    question: "Un rythme régulier à QRS étroits à 75 bpm avec des ondes P normales positives en DII précédant chaque QRS et un PR de 0.16s est :",
    options: ["A. Rythme sinusal normal", "B. Rythme jonctionnel accéléré", "C. BAV du 1er degré", "D. Flutter auriculaire 4:1"],
    answer: "A",
    explanation: "Rythme régulier, FC 60-100 bpm, ondes P positives en DII avant chaque QRS, PR 0.12-0.20s = rythme sinusal normal."
  },
  {
    category: "rythmes",
    question: "V1 et V2 montrent un sus-décalage du ST avec ondes Q pathologiques. V3 et V4 montrent un sus-décalage du ST sans ondes Q. Quelle est l'interprétation ?",
    options: ["A. STEMI antéro-septal avec possible nécrose septale", "B. Péricardite aiguë", "C. STEMI inférieur", "D. Syndrome de Brugada"],
    answer: "A",
    explanation: "Le sus-décalage du ST en V1-V4 indique un STEMI antéro-septal. Les ondes Q en V1-V2 suggèrent une nécrose déjà installée dans le territoire septal."
  },

  // ══════════════════════════════════════════
  //  CATÉGORIE 2 : Pharmacologie (20)
  // ══════════════════════════════════════════

  {
    category: "pharmacologie",
    question: "Un patient est en arrêt cardiaque avec asystolie. La RCR de haute qualité est en cours, le patient est intubé et une voie IV est en place. Quel est le premier médicament à administrer ?",
    options: ["A. Atropine 1 mg IV/IO", "B. Épinéphrine 1 mg IV/IO", "C. Amiodarone 300 mg IV/IO", "D. Dopamine 2-20 mcg/kg/min IV"],
    answer: "B",
    explanation: "En arrêt cardiaque (asystolie ou AESP), l'épinéphrine 1 mg IV/IO est le premier médicament. L'atropine n'est plus recommandée dans l'arrêt cardiaque."
  },
  {
    category: "pharmacologie",
    question: "Quelle est la dose initiale d'atropine pour une bradycardie symptomatique ?",
    options: ["A. 0.25 mg IV", "B. 0.5 mg IV", "C. 1 mg IV", "D. 3 mg IV"],
    answer: "C",
    explanation: "La dose initiale d'atropine est 1 mg IV, répétable toutes les 3-5 minutes, dose maximale totale de 3 mg."
  },
  {
    category: "pharmacologie",
    question: "En cas de FV/TV sans pouls réfractaire aux chocs, quel antiarythmique est administré en premier ?",
    options: ["A. Lidocaïne 1-1.5 mg/kg IV", "B. Amiodarone 300 mg IV en bolus", "C. Procaïnamide 20-50 mg/min IV", "D. Magnésium 1-2 g IV"],
    answer: "B",
    explanation: "L'amiodarone 300 mg IV en bolus est le premier antiarythmique en FV/TV sans pouls réfractaire. Une 2e dose de 150 mg peut être donnée."
  },
  {
    category: "pharmacologie",
    question: "À quelle fréquence peut-on répéter l'épinéphrine pendant un arrêt cardiaque ?",
    options: ["A. Toutes les 1-2 minutes", "B. Toutes les 3-5 minutes", "C. Toutes les 5-10 minutes", "D. Une seule dose"],
    answer: "B",
    explanation: "L'épinéphrine 1 mg IV/IO est répétée toutes les 3-5 minutes pendant l'arrêt cardiaque."
  },
  {
    category: "pharmacologie",
    question: "Quel médicament est le premier choix pour une TSV stable qui ne répond pas aux manœuvres vagales ?",
    options: ["A. Amiodarone 150 mg IV", "B. Vérapamil 5 mg IV", "C. Adénosine 6 mg IV en bolus rapide", "D. Métoprolol 5 mg IV"],
    answer: "C",
    explanation: "L'adénosine 6 mg IV en bolus rapide suivie d'un flush de NaCl est le traitement de 1ère ligne. Si inefficace, 12 mg peuvent être administrés."
  },
  {
    category: "pharmacologie",
    question: "Pour un patient en bradycardie symptomatique ne répondant pas à l'atropine et dont le pacing transcutané échoue, quel traitement est indiqué ?",
    options: ["A. Adénosine 6 mg IV", "B. Épinéphrine 2-10 mcg/min en perfusion", "C. Amiodarone 150 mg IV", "D. Bolus de NaCl 0.9% 500 mL"],
    answer: "B",
    explanation: "En cas d'échec de l'atropine et du pacing, une perfusion d'épinéphrine (2-10 mcg/min) ou de dopamine (5-20 mcg/kg/min) est indiquée."
  },
  {
    category: "pharmacologie",
    question: "Quelle est l'indication spécifique du magnésium (1-2 g IV) dans le contexte de l'arrêt cardiaque ?",
    options: ["A. FV réfractaire classique", "B. Torsade de pointes", "C. Asystolie", "D. AESP"],
    answer: "B",
    explanation: "Le magnésium est spécifiquement indiqué pour la torsade de pointes (TV polymorphe associée à un QT long)."
  },
  {
    category: "pharmacologie",
    question: "Un patient présente un STEMI. Il reçoit déjà de l'héparine IV. Il n'a pas pris d'aspirine car il a des antécédents de gastrite traitée il y a 5 ans. Quelle est la prochaine action ?",
    options: ["A. Donner du clopidogrel 300 mg PO", "B. Donner de l'aspirine 160-325 mg à croquer", "C. Donner de l'aspirine entérique 75 mg PO", "D. Ne pas donner d'aspirine vu les antécédents"],
    answer: "B",
    explanation: "L'aspirine 160-325 mg à croquer (non entérique) est essentielle dans le STEMI. Une gastrite traitée il y a 5 ans n'est pas une contre-indication."
  },
  {
    category: "pharmacologie",
    question: "Quelle est la voie d'administration préférée si aucun accès IV n'est disponible pendant un arrêt cardiaque ?",
    options: ["A. Voie endotrachéale", "B. Voie intra-osseuse (IO)", "C. Voie sous-cutanée", "D. Voie intramusculaire"],
    answer: "B",
    explanation: "La voie IO est préférée à la voie endotrachéale. C'est la 1ère alternative à la voie IV."
  },
  {
    category: "pharmacologie",
    question: "Pendant un arrêt cardiaque en FV réfractaire, après le 3e choc et l'administration d'amiodarone, quelle dose d'épinéphrine doit être préparée ?",
    options: ["A. Épinéphrine 3 mg (dose croissante)", "B. Épinéphrine 1 mg (2e dose)", "C. Bicarbonate de sodium 50 mEq", "D. Vasopressine 40 U"],
    answer: "B",
    explanation: "L'épinéphrine est toujours administrée à 1 mg IV/IO, répétée toutes les 3-5 min. Les doses croissantes ne sont pas recommandées."
  },
  {
    category: "pharmacologie",
    question: "Pour une tachycardie à complexes larges régulière et stable identifiée comme TV monomorphe, quel médicament peut être envisagé ?",
    options: ["A. Adénosine 6 mg IV", "B. Amiodarone 150 mg IV sur 10 min", "C. Atropine 1 mg IV", "D. Diltiazem 20 mg IV"],
    answer: "B",
    explanation: "L'amiodarone 150 mg IV sur 10 min est appropriée pour une TV monomorphe stable. Les inhibiteurs calciques sont contre-indiqués dans la TV."
  },
  {
    category: "pharmacologie",
    question: "Concernant la vasopressine en arrêt cardiaque, quelle affirmation est correcte ?",
    options: ["A. Elle est recommandée en remplacement de l'épinéphrine", "B. La dose correcte est 40 U IV/IO", "C. Elle est recommandée avant l'épinéphrine pour l'asystolie", "D. Elle n'est plus recommandée dans les lignes directrices actuelles"],
    answer: "D",
    explanation: "Les lignes directrices actuelles ne recommandent plus la vasopressine comme alternative à l'épinéphrine dans l'arrêt cardiaque."
  },
  {
    category: "pharmacologie",
    question: "Quel est le traitement pharmacologique de première intention pour l'AESP/asystolie ?",
    options: ["A. Amiodarone 300 mg IV", "B. Atropine 1 mg IV", "C. Épinéphrine 1 mg IV/IO toutes les 3-5 min", "D. Défibrillation suivie d'épinéphrine"],
    answer: "C",
    explanation: "Pour l'AESP et l'asystolie (rythmes non choquables), l'épinéphrine 1 mg IV/IO est le traitement principal. La défibrillation n'est pas indiquée."
  },
  {
    category: "pharmacologie",
    question: "L'adénosine 6 mg IV a été donnée sans effet pour une TSV stable. Quelle est la prochaine étape ?",
    options: ["A. Cardioversion synchronisée", "B. Adénosine 12 mg IV en bolus rapide", "C. Amiodarone 300 mg IV", "D. Défibrillation asynchrone"],
    answer: "B",
    explanation: "Après échec de l'adénosine 6 mg, on donne 12 mg en bolus rapide. Si toujours inefficace, une 2e dose de 12 mg peut être tentée."
  },
  {
    category: "pharmacologie",
    question: "Quelle est la dose de lidocaïne en alternative à l'amiodarone pour la FV/TV sans pouls réfractaire ?",
    options: ["A. 0.5 mg/kg IV", "B. 1-1.5 mg/kg IV", "C. 3 mg/kg IV", "D. 5 mg/kg IV"],
    answer: "B",
    explanation: "La lidocaïne peut être utilisée en alternative à l'amiodarone : dose initiale 1-1.5 mg/kg IV, puis 0.5-0.75 mg/kg toutes les 5-10 min (max 3 mg/kg)."
  },
  {
    category: "pharmacologie",
    question: "Un patient en post-arrêt cardiaque présente une hypotension persistante (TA 70/40 mmHg) malgré le remplissage. Quel vasopresseur est recommandé ?",
    options: ["A. Dopamine 5-10 mcg/kg/min", "B. Norépinéphrine 0.1-0.5 mcg/kg/min", "C. Phényléphrine 100-180 mcg/min", "D. Épinéphrine 1 mg IV bolus"],
    answer: "B",
    explanation: "La norépinéphrine (noradrénaline) en perfusion est le vasopresseur de 1er choix en post-arrêt cardiaque avec hypotension réfractaire au remplissage."
  },
  {
    category: "pharmacologie",
    question: "Quel est le principal effet secondaire à surveiller lors de l'administration rapide d'adénosine ?",
    options: ["A. Hypertension sévère", "B. Brève période d'asystolie ou bradycardie", "C. Tachycardie ventriculaire", "D. Bronchospasme prolongé"],
    answer: "B",
    explanation: "L'adénosine provoque une brève pause sinusale/asystolie (quelques secondes) qui est attendue et transitoire. Prévenir le patient. Contre-indiquée dans l'asthme sévère."
  },
  {
    category: "pharmacologie",
    question: "Un patient sous monitorage développe une tachycardie à complexes larges à 200 bpm. Il est stable hémodynamiquement. Un expert identifie une TV monomorphe. Après échec de l'amiodarone IV, quelle est l'étape suivante ?",
    options: ["A. Augmenter la dose d'amiodarone", "B. Cardioversion synchronisée", "C. Défibrillation asynchrone", "D. Adénosine 12 mg IV"],
    answer: "B",
    explanation: "Si le traitement pharmacologique échoue pour une TV stable, la cardioversion synchronisée élective (avec sédation) est l'étape suivante."
  },
  {
    category: "pharmacologie",
    question: "Quelle association médicamenteuse est recommandée dans la prise en charge initiale d'un SCA sans sus-décalage du ST (NSTEMI) ?",
    options: ["A. Aspirine + Fibrinolytique", "B. Aspirine + Héparine + Nitroglycérine au besoin", "C. Aspirine + Amiodarone", "D. Héparine + Atropine"],
    answer: "B",
    explanation: "Le NSTEMI est traité par aspirine, anticoagulation (héparine), anti-angineux (nitroglycérine) au besoin, et évaluation pour cathétérisme. PAS de fibrinolyse dans le NSTEMI."
  },
  {
    category: "pharmacologie",
    question: "À quelle dose la dopamine a-t-elle principalement un effet chronotrope et inotrope positif ?",
    options: ["A. 1-3 mcg/kg/min (dose rénale)", "B. 5-10 mcg/kg/min (dose cardiaque)", "C. 10-20 mcg/kg/min (dose vasopressive)", "D. 0.5 mcg/kg/min"],
    answer: "B",
    explanation: "À 5-10 mcg/kg/min, la dopamine stimule les récepteurs β1 (effet inotrope/chronotrope). À >10 mcg/kg/min, effet α vasoconstricteur prédominant."
  },

  // ══════════════════════════════════════════
  //  CATÉGORIE 3 : Application pratique & Algorithmes (20)
  // ══════════════════════════════════════════

  {
    category: "pratique",
    question: "Pendant la RCR, quelle est la profondeur de compression thoracique recommandée chez l'adulte ?",
    options: ["A. Au moins 4 cm", "B. Au moins 5 cm (max 6 cm)", "C. Au moins 6 cm (max 8 cm)", "D. Au moins 3 cm"],
    answer: "B",
    explanation: "Les compressions doivent être d'au moins 5 cm (2 pouces) sans dépasser 6 cm, avec un relâchement complet entre chaque compression."
  },
  {
    category: "pratique",
    question: "Quelle est la fréquence de compressions recommandée pendant la RCR ?",
    options: ["A. 80-100/min", "B. 100-120/min", "C. 120-140/min", "D. Au moins 60/min"],
    answer: "B",
    explanation: "Le taux recommandé est de 100-120 compressions par minute avec un relâchement complet du thorax."
  },
  {
    category: "pratique",
    question: "Une femme de 57 ans présente une tachycardie à complexes étroits à 180 bpm. Elle devient diaphorétique avec une TA à 80/60 mmHg. Quelle est la meilleure action ?",
    options: ["A. Adénosine 6 mg IV", "B. Manœuvres vagales", "C. Cardioversion synchronisée", "D. Amiodarone 150 mg IV"],
    answer: "C",
    explanation: "Patient instable (hypotension, diaphorèse) = cardioversion synchronisée immédiate, quelle que soit la largeur du QRS."
  },
  {
    category: "pratique",
    question: "Quelles sont les 4 causes réversibles commençant par H à rechercher en arrêt cardiaque ?",
    options: ["A. Hypovolémie, Hypoxie, Hydrogène (acidose), Hypo/hyperkaliémie", "B. Hypovolémie, Hypertension, Hypothermie, Hyperventilation", "C. Hypoxie, Hypoglycémie, Hypertension, Hyperthermie", "D. Hypovolémie, Hypoxie, Hyperthermie, Hyperventilation"],
    answer: "A",
    explanation: "Les 4H : Hypovolémie, Hypoxie, ions Hydrogène (acidose), Hypo/Hyperkaliémie. Les 4T : Thrombose coronaire, Thrombose pulmonaire, pneumoThorax sous Tension, Tamponnade/Toxiques."
  },
  {
    category: "pratique",
    question: "Après le retour à la circulation spontanée (RACS), quelle est la température cible pour la gestion ciblée de la température ?",
    options: ["A. 30-32°C pendant 12h", "B. 32-36°C pendant au moins 24h", "C. 36-37°C pendant 48h", "D. 34-35°C pendant 6h"],
    answer: "B",
    explanation: "La gestion ciblée de la température recommande 32-36°C pendant au moins 24h après un RACS chez les patients comateux."
  },
  {
    category: "pratique",
    question: "Lors d'un arrêt cardiaque avec rythme choquable (FV/TV sans pouls), quel est l'ordre correct des interventions ?",
    options: ["A. Choc → RCR 2 min → Épi → Choc → RCR 2 min → Amiodarone", "B. Épi → Choc → RCR 2 min → Amiodarone", "C. Choc → Épi → RCR 2 min → Amiodarone → Choc", "D. RCR 2 min → Choc → RCR + Épi → Choc → RCR + Amiodarone"],
    answer: "D",
    explanation: "Algorithme : RCR → Choc 1 → RCR 2 min → Vérif rythme → Choc 2 → RCR + Épinéphrine → Vérif rythme → Choc 3 → RCR + Amiodarone."
  },
  {
    category: "pratique",
    question: "Les interruptions des compressions thoraciques doivent être :",
    options: ["A. De 10 secondes minimum pour une évaluation adéquate", "B. Réduites au minimum absolu", "C. De 3-5 minutes pour les changements de position", "D. D'environ 30 secondes pour chaque vérification"],
    answer: "B",
    explanation: "Les interruptions doivent être minimisées. L'objectif est une fraction de compression d'au moins 60%, idéalement >80%."
  },
  {
    category: "pratique",
    question: "Un patient présente un AVC ischémique aigu. En combien de temps la fibrinolyse doit-elle être administrée après l'arrivée aux urgences ?",
    options: ["A. Dans les 30 minutes", "B. Dans les 60 minutes", "C. Dans les 90 minutes", "D. Dans les 120 minutes"],
    answer: "B",
    explanation: "L'objectif est d'administrer le fibrinolytique dans les 60 minutes suivant l'arrivée (door-to-needle time)."
  },
  {
    category: "pratique",
    question: "Avec une voie aérienne avancée en place (intubation), quel est le ratio compressions/ventilations ?",
    options: ["A. 30:2 avec pauses", "B. 15:2 avec pauses", "C. Compressions continues + 1 insufflation toutes les 6 secondes (10/min)", "D. Compressions continues + 1 insufflation toutes les 3 secondes (20/min)"],
    answer: "C",
    explanation: "Avec voie aérienne avancée : compressions continues sans pause + 1 insufflation toutes les 6 secondes (soit 10 ventilations/min)."
  },
  {
    category: "pratique",
    question: "Un patient monitoré développe une tachycardie à complexes larges à 220 bpm. Sa TA chute à 50/32 mmHg et son niveau de conscience diminue rapidement. Quelle est la meilleure action ?",
    options: ["A. Amiodarone 150 mg IV sur 10 min", "B. Adénosine 6 mg IV rapide", "C. Cardioversion synchronisée immédiate", "D. Obtenir un ECG 12 dérivations"],
    answer: "C",
    explanation: "Patient instable (hypotension sévère, altération de conscience) = cardioversion synchronisée immédiate après sédation si possible."
  },
  {
    category: "pratique",
    question: "Dans la prise en charge post-arrêt cardiaque, quel est l'objectif de saturation en oxygène ?",
    options: ["A. SpO2 à 100% en tout temps", "B. SpO2 entre 94-99%", "C. SpO2 au-dessus de 85%", "D. O2 à 15 L/min systématiquement"],
    answer: "B",
    explanation: "Après le RACS, titrer l'O2 pour SpO2 94-99%. L'hyperoxie doit être évitée car elle peut aggraver les lésions neurologiques."
  },
  {
    category: "pratique",
    question: "Quelle est l'énergie initiale recommandée pour la défibrillation biphasique en FV/TV sans pouls ?",
    options: ["A. 120-200 J selon le fabricant", "B. 360 J", "C. 50 J", "D. 100 J fixe"],
    answer: "A",
    explanation: "Avec un défibrillateur biphasique, l'énergie initiale dépend du fabricant (120-200 J). Si inconnue, utiliser le maximum disponible."
  },
  {
    category: "pratique",
    question: "Un patient présente un SCA avec sus-décalage du ST en V1-V4. Quelle paroi est concernée ?",
    options: ["A. Paroi inférieure", "B. Paroi latérale", "C. Paroi antérieure", "D. Paroi postérieure"],
    answer: "C",
    explanation: "V1-V4 = paroi antérieure (artère IVA). Inférieure = II, III, aVF. Latérale = I, aVL, V5-V6."
  },
  {
    category: "pratique",
    question: "Quel est l'élément LE PLUS important pour améliorer la survie en arrêt cardiaque ?",
    options: ["A. Administration rapide d'épinéphrine", "B. Intubation précoce", "C. Compressions thoraciques de haute qualité avec minimum d'interruptions", "D. Administration d'amiodarone après le 1er choc"],
    answer: "C",
    explanation: "La RCR de haute qualité (profondeur 5-6 cm, fréquence 100-120/min, relâchement complet, interruptions minimales) est le facteur le plus déterminant."
  },
  {
    category: "pratique",
    question: "Un patient en arrêt cardiaque présente une AESP. Après 2 minutes de RCR et d'épinéphrine, le moniteur montre un rythme organisé. Quelle est la prochaine étape ?",
    options: ["A. Défibriller immédiatement", "B. Vérifier le pouls pendant max 10 secondes", "C. Administrer de l'amiodarone", "D. Continuer la RCR pendant encore 2 minutes"],
    answer: "B",
    explanation: "Si le moniteur montre un rythme organisé, vérifier le pouls (max 10 sec). Si pouls présent = RACS. Si absent = continuer RCR (c'est de l'AESP)."
  },
  {
    category: "pratique",
    question: "Quelle est l'énergie recommandée pour une cardioversion synchronisée d'une FA stable ?",
    options: ["A. 50-100 J biphasique", "B. 120-200 J biphasique", "C. 200 J monophasique", "D. 360 J monophasique"],
    answer: "B",
    explanation: "Pour la FA : 120-200 J biphasique. Pour le flutter et la TSV : 50-100 J. Pour la TV monomorphe : 100 J initial."
  },
  {
    category: "pratique",
    question: "Concernant la chaîne de survie en milieu hospitalier, quel est le premier maillon ?",
    options: ["A. Défibrillation précoce", "B. Surveillance et prévention (reconnaissance précoce et activation de l'équipe de réanimation)", "C. RCR de haute qualité", "D. Soins post-arrêt"],
    answer: "B",
    explanation: "En milieu hospitalier : 1) Surveillance/prévention → 2) Reconnaissance et activation → 3) RCR haute qualité → 4) Défibrillation → 5) Soins post-arrêt → 6) Récupération."
  },
  {
    category: "pratique",
    question: "Un leader d'équipe de réanimation constate que la capnographie (EtCO2) chute brutalement de 35 à 10 mmHg pendant la RCR. Que suspecter ?",
    options: ["A. Amélioration de la perfusion", "B. RACS imminent", "C. Compressions thoraciques de mauvaise qualité ou déplacement du tube", "D. Surdosage d'épinéphrine"],
    answer: "C",
    explanation: "Une chute brutale de l'EtCO2 pendant la RCR suggère des compressions inadéquates, un déplacement du tube endotrachéal ou une obstruction des voies aériennes."
  },
  {
    category: "pratique",
    question: "Si l'EtCO2 augmente soudainement à >40 mmHg pendant la RCR, que cela suggère-t-il ?",
    options: ["A. Détérioration du patient", "B. Retour à la circulation spontanée (RACS)", "C. Pneumothorax sous tension", "D. Obstruction des voies aériennes"],
    answer: "B",
    explanation: "Une augmentation brutale de l'EtCO2 >40 mmHg pendant la RCR est un indicateur fiable de RACS. Vérifier le pouls."
  },
  {
    category: "pratique",
    question: "Dans l'algorithme de la tachycardie, quel est le critère principal pour décider entre traitement pharmacologique et cardioversion ?",
    options: ["A. La largeur du QRS", "B. La fréquence cardiaque", "C. La stabilité hémodynamique du patient", "D. L'âge du patient"],
    answer: "C",
    explanation: "Le critère déterminant est la stabilité hémodynamique. Patient instable (hypotension, altération de conscience, douleur thoracique, insuffisance cardiaque) = cardioversion. Patient stable = traitement pharmacologique."
  }
];
