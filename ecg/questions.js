// ============================================================
// ECG Quiz – Banque de questions (FR)
// 65 questions couvrant 5 catégories
// MedHub – Généré le 2026-03-09
// ============================================================

const ECG_QUESTIONS = [

  // ============================================================
  // CATÉGORIE : rythmes_normaux (11 questions)
  // ============================================================

  // --- Rythme sinusal normal (5 questions) ---
  {
    id: "ecg-001",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "normal-sinus-rhythm-01.png",
    image_alt: "rythme-sinusal-normal",
    clinical_context: "Patient de 35 ans, bilan de routine avant embauche. Asymptomatique, pas d'antécédents.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bradycardie sinusale",
      "B) Rythme sinusal normal",
      "C) Tachycardie sinusale",
      "D) Fibrillation auriculaire"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme sinusal normal avec une fréquence cardiaque entre 60 et 100 bpm. Chaque complexe QRS est précédé d'une onde P positive en DII, DIII et aVF, avec un intervalle PR constant entre 120 et 200 ms. Les complexes QRS sont fins (< 120 ms) et l'axe cardiaque est normal. L'intervalle QT est dans les limites de la normale.",
    key_features: [
      "Fréquence cardiaque entre 60 et 100 bpm",
      "Onde P positive en DII, DIII, aVF",
      "Intervalle PR constant entre 120 et 200 ms",
      "Complexes QRS fins (< 120 ms)",
      "Rythme régulier"
    ],
    tags: ["normal", "sinusal", "rythme"]
  },
  {
    id: "ecg-002",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "normal-sinus-rhythm-02.png",
    image_alt: "rythme-sinusal-normal",
    clinical_context: "Femme de 28 ans, consultation de médecine générale pour un certificat de sport. Aucune plainte.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Flutter auriculaire",
      "B) Tachycardie supraventriculaire",
      "C) Rythme sinusal normal",
      "D) Bloc auriculo-ventriculaire du 1er degré"
    ],
    correct: 2,
    explanation: "Ce tracé montre un rythme sinusal normal. Les ondes P sont bien visibles et positives dans les dérivations inférieures (DII, DIII, aVF), confirmant l'origine sinusale. L'intervalle PR est normal, mesuré à environ 160 ms. La fréquence cardiaque est régulière aux alentours de 75 bpm. Il n'y a pas d'anomalie de la repolarisation.",
    key_features: [
      "Ondes P sinusales bien identifiables",
      "Intervalle PR normal (~160 ms)",
      "Fréquence cardiaque ~75 bpm",
      "Rythme parfaitement régulier",
      "Absence d'anomalie de repolarisation"
    ],
    tags: ["normal", "sinusal", "sport"]
  },
  {
    id: "ecg-003",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "normal-sinus-rhythm-03.png",
    image_alt: "rythme-sinusal-normal",
    clinical_context: "Homme de 52 ans, bilan pré-opératoire avant une cholécystectomie. Pas de cardiopathie connue.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme sinusal normal",
      "B) Arythmie sinusale respiratoire",
      "C) Extrasystoles auriculaires fréquentes",
      "D) Fibrillation auriculaire"
    ],
    correct: 0,
    explanation: "L'ECG montre un rythme sinusal normal parfaitement régulier. Chaque onde P est suivie d'un complexe QRS avec un intervalle PR constant. La fréquence cardiaque est d'environ 68 bpm. L'axe du QRS est normal (environ +60°). On ne note pas d'arythmie sinusale significative ni d'extrasystoles sur ce tracé.",
    key_features: [
      "Rythme régulier à ~68 bpm",
      "Onde P avant chaque QRS",
      "PR constant et normal",
      "Axe QRS normal",
      "Pas d'extrasystoles"
    ],
    tags: ["normal", "sinusal", "pré-opératoire"]
  },
  {
    id: "ecg-004",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "normal-sinus-rhythm-04.png",
    image_alt: "rythme-sinusal-normal",
    clinical_context: "Femme de 45 ans aux urgences pour une douleur abdominale. ECG systématique à l'admission.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Fibrillation auriculaire à réponse ventriculaire rapide",
      "C) Bloc de branche droit",
      "D) Rythme sinusal normal"
    ],
    correct: 3,
    explanation: "Ce tracé est parfaitement normal. Le rythme est sinusal, régulier, avec une fréquence aux alentours de 80 bpm. Les ondes P sont présentes et positives en DII. L'intervalle PR est à 150 ms. Les complexes QRS sont fins sans morphologie de bloc de branche. La repolarisation est normale sans décalage du segment ST.",
    key_features: [
      "Fréquence cardiaque ~80 bpm",
      "Ondes P positives en DII",
      "PR à 150 ms",
      "QRS fins, pas de bloc de branche",
      "Segment ST sans décalage"
    ],
    tags: ["normal", "sinusal", "urgences"]
  },
  {
    id: "ecg-005",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "normal-sinus-rhythm-05.png",
    image_alt: "rythme-sinusal-normal",
    clinical_context: "Homme de 62 ans, suivi cardiologique annuel. Hypertendu bien contrôlé sous traitement.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Hypertrophie ventriculaire gauche",
      "B) Rythme sinusal normal",
      "C) Bloc auriculo-ventriculaire du 1er degré",
      "D) Ischémie sous-épicardique latérale"
    ],
    correct: 1,
    explanation: "Malgré le contexte d'hypertension, cet ECG est strictement normal. Le rythme est sinusal à 72 bpm. Les critères de voltage d'hypertrophie ventriculaire gauche (indice de Sokolow-Lyon < 35 mm, Cornell < 28 mm) ne sont pas remplis. L'intervalle PR est normal. Il n'y a pas de trouble de la repolarisation évoquant une ischémie.",
    key_features: [
      "Rythme sinusal régulier à 72 bpm",
      "Critères de voltage HVG non remplis",
      "Intervalle PR normal",
      "Repolarisation normale",
      "Absence de déviation axiale"
    ],
    tags: ["normal", "sinusal", "HTA"]
  },

  // --- Tachycardie sinusale (3 questions) ---
  {
    id: "ecg-006",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-tachycardia-01.png",
    image_alt: "tachycardie-sinusale",
    clinical_context: "Femme de 27 ans aux urgences pour fièvre à 39,5°C et frissons depuis 24 heures.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Fibrillation auriculaire rapide",
      "B) Flutter auriculaire 2:1",
      "C) Tachycardie sinusale",
      "D) Tachycardie supraventriculaire paroxystique"
    ],
    correct: 2,
    explanation: "L'ECG montre une tachycardie sinusale avec une fréquence cardiaque d'environ 115 bpm. Les ondes P sont clairement identifiables, positives en DII et négatives en aVR, confirmant leur origine sinusale. L'intervalle PR est normal mais raccourci physiologiquement par la tachycardie. Le contexte fébrile explique cette accélération sinusale réactionnelle.",
    key_features: [
      "Fréquence cardiaque > 100 bpm (~115 bpm)",
      "Ondes P sinusales bien visibles",
      "PR normal, raccourci physiologiquement",
      "Rythme régulier",
      "QRS fins"
    ],
    tags: ["tachycardie", "sinusale", "fièvre"]
  },
  {
    id: "ecg-007",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-tachycardia-02.png",
    image_alt: "tachycardie-sinusale",
    clinical_context: "Homme de 40 ans, anxieux, consulte pour palpitations. PA 135/85 mmHg. Pas de douleur thoracique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Tachycardie atriale focale",
      "C) Tachycardie jonctionnelle",
      "D) Flutter auriculaire"
    ],
    correct: 0,
    explanation: "Ce tracé montre une tachycardie sinusale à environ 108 bpm. Les ondes P sont positives en DII, DIII et aVF, avec une morphologie normale, ce qui confirme l'origine sinusale et exclut une tachycardie atriale ectopique. L'intervalle PP est régulier. Le contexte d'anxiété est compatible avec une tachycardie sinusale réactionnelle au stress.",
    key_features: [
      "Fréquence cardiaque ~108 bpm",
      "Ondes P de morphologie sinusale",
      "Intervalles PP réguliers",
      "Conduction AV 1:1",
      "Complexes QRS fins"
    ],
    tags: ["tachycardie", "sinusale", "anxiété"]
  },
  {
    id: "ecg-008",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-tachycardia-03.png",
    image_alt: "tachycardie-sinusale",
    clinical_context: "Femme de 55 ans, post-opératoire J1 d'une chirurgie abdominale. Douleur modérée, EVA 5/10.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Embolie pulmonaire avec S1Q3T3",
      "B) Tachycardie supraventriculaire",
      "C) Fibrillation auriculaire",
      "D) Tachycardie sinusale"
    ],
    correct: 3,
    explanation: "L'ECG montre une tachycardie sinusale à environ 112 bpm, fréquente en contexte post-opératoire (douleur, stress, hypovolémie relative). Les ondes P sont bien identifiables avec un axe normal. Il n'y a pas de pattern S1Q3T3 évocateur d'embolie pulmonaire. Les QRS sont fins et réguliers, excluant une arythmie supraventriculaire.",
    key_features: [
      "Fréquence cardiaque ~112 bpm",
      "Ondes P sinusales identifiables",
      "Pas de pattern S1Q3T3",
      "Rythme régulier",
      "Contexte post-opératoire explicatif"
    ],
    tags: ["tachycardie", "sinusale", "post-opératoire"]
  },

  // --- Bradycardie sinusale (3 questions) ---
  {
    id: "ecg-009",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-bradycardia-01.png",
    image_alt: "bradycardie-sinusale",
    clinical_context: "Homme de 25 ans, sportif de haut niveau (cycliste). Bilan d'aptitude au sport. Asymptomatique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc auriculo-ventriculaire du 3e degré",
      "B) Bradycardie sinusale",
      "C) Dysfonction sinusale",
      "D) Rythme d'échappement jonctionnel"
    ],
    correct: 1,
    explanation: "L'ECG montre une bradycardie sinusale à environ 48 bpm, tout à fait physiologique chez un sportif endurant. Chaque onde P est suivie d'un QRS avec un PR constant, excluant un BAV. L'origine sinusale est confirmée par les ondes P positives en DII. Il ne s'agit pas d'une dysfonction sinusale car le rythme est régulier et l'adaptation à l'effort est normale.",
    key_features: [
      "Fréquence cardiaque < 60 bpm (~48 bpm)",
      "Ondes P sinusales suivies de QRS",
      "PR constant et normal",
      "Rythme régulier",
      "Contexte sportif physiologique"
    ],
    tags: ["bradycardie", "sinusale", "sportif"]
  },
  {
    id: "ecg-010",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-bradycardia-02.png",
    image_alt: "bradycardie-sinusale",
    clinical_context: "Femme de 70 ans sous bêta-bloquant (bisoprolol 5 mg) pour HTA. Légère asthénie.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme sinusal normal",
      "B) Bloc sino-auriculaire",
      "C) Fibrillation auriculaire lente",
      "D) Bradycardie sinusale"
    ],
    correct: 3,
    explanation: "L'ECG montre une bradycardie sinusale à environ 52 bpm, probablement iatrogène liée au traitement par bêta-bloquant. Le rythme est régulier avec des ondes P sinusales bien visibles avant chaque QRS. Il n'y a pas de pause sinusale ni de bloc sino-auriculaire. La ligne de base est stable, excluant une fibrillation auriculaire.",
    key_features: [
      "Fréquence cardiaque ~52 bpm",
      "Ondes P présentes et régulières",
      "Pas de pause sinusale",
      "Ligne de base stable (pas de FA)",
      "Effet chronotrope négatif des bêta-bloquants"
    ],
    tags: ["bradycardie", "sinusale", "iatrogène"]
  },
  {
    id: "ecg-011",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-bradycardia-03.png",
    image_alt: "bradycardie-sinusale",
    clinical_context: "Homme de 82 ans, bilan de malaise au lever. Pas de perte de connaissance. PA couché-debout normale.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bradycardie sinusale",
      "B) Bloc auriculo-ventriculaire du 2e degré",
      "C) Rythme jonctionnel",
      "D) Bloc auriculo-ventriculaire du 1er degré"
    ],
    correct: 0,
    explanation: "Ce tracé montre une bradycardie sinusale à environ 50 bpm. Les ondes P sont clairement visibles et chacune est conduite avec un PR constant et normal, ce qui exclut un BAV du 1er ou 2e degré. Les ondes P sont positives en DII confirmant l'origine sinusale et non jonctionnelle. Le malaise pourrait être en rapport avec cette bradycardie.",
    key_features: [
      "Fréquence cardiaque ~50 bpm",
      "Conduction AV 1:1 préservée",
      "PR constant et normal",
      "Ondes P positives en DII",
      "Pas de pause ni de bloc"
    ],
    tags: ["bradycardie", "sinusale", "malaise"]
  },

  // ============================================================
  // CATÉGORIE : arythmies_sv (11 questions)
  // ============================================================

  // --- Fibrillation auriculaire (5 questions) ---
  {
    id: "ecg-012",
    category: "arythmies_sv",
    difficulty: 1,
    image: "atrial-fibrillation-01.png",
    image_alt: "fibrillation-auriculaire",
    clinical_context: "Homme de 72 ans, palpitations irrégulières depuis 3 jours. Antécédent d'HTA et de diabète.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Flutter auriculaire",
      "B) Tachycardie sinusale",
      "C) Fibrillation auriculaire",
      "D) Tachycardie atriale multifocale"
    ],
    correct: 2,
    explanation: "L'ECG montre une fibrillation auriculaire caractérisée par l'absence d'ondes P organisées, remplacées par une trémulation irrégulière de la ligne de base (ondes f). Les intervalles RR sont irrégulièrement irréguliers, critère fondamental de la FA. La réponse ventriculaire est autour de 95 bpm. Les complexes QRS sont fins, indiquant une conduction intraventriculaire normale.",
    key_features: [
      "Absence d'ondes P organisées",
      "Trémulation de la ligne de base (ondes f)",
      "Intervalles RR irrégulièrement irréguliers",
      "Complexes QRS fins",
      "Fréquence ventriculaire ~95 bpm"
    ],
    tags: ["FA", "fibrillation", "arythmie"]
  },
  {
    id: "ecg-013",
    category: "arythmies_sv",
    difficulty: 1,
    image: "atrial-fibrillation-02.png",
    image_alt: "fibrillation-auriculaire",
    clinical_context: "Femme de 68 ans, dyspnée d'effort progressive. Découverte fortuite lors d'un ECG de routine.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Extrasystoles auriculaires fréquentes",
      "B) Fibrillation auriculaire",
      "C) Rythme sinusal avec arythmie respiratoire",
      "D) Tachycardie supraventriculaire"
    ],
    correct: 1,
    explanation: "Ce tracé révèle une fibrillation auriculaire permanente à réponse ventriculaire contrôlée (~80 bpm). La ligne de base est irrégulière sans onde P identifiable. Les intervalles RR sont variables, ce qui distingue la FA d'une arythmie sinusale respiratoire où les ondes P seraient visibles. L'absence de régularité des RR exclut également une TSV.",
    key_features: [
      "Ligne de base irrégulière sans onde P",
      "Intervalles RR variables",
      "Réponse ventriculaire contrôlée",
      "QRS fins",
      "Découverte parfois fortuite"
    ],
    tags: ["FA", "fibrillation", "chronique"]
  },
  {
    id: "ecg-014",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-fibrillation-03.png",
    image_alt: "fibrillation-auriculaire",
    clinical_context: "Homme de 58 ans aux urgences pour dyspnée aiguë. FC à 145 bpm au scope. Crépitants bilatéraux.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale sur insuffisance cardiaque",
      "B) Flutter auriculaire 2:1",
      "C) Tachycardie ventriculaire",
      "D) Fibrillation auriculaire à réponse ventriculaire rapide"
    ],
    correct: 3,
    explanation: "L'ECG montre une fibrillation auriculaire à réponse ventriculaire rapide (~145 bpm). L'irrégularité des RR est le signe clé qui différencie la FA rapide d'un flutter 2:1 (qui serait régulier à ~150 bpm). L'absence d'ondes P et la trémulation de la ligne de base confirment le diagnostic. Les QRS fins excluent une TV. Cette FA rapide peut décompenser une cardiopathie sous-jacente.",
    key_features: [
      "Fréquence ventriculaire rapide ~145 bpm",
      "Intervalles RR irréguliers malgré la fréquence élevée",
      "Absence d'ondes P",
      "Trémulation de la ligne de base",
      "QRS fins excluant une TV"
    ],
    tags: ["FA", "rapide", "urgence", "décompensation"]
  },
  {
    id: "ecg-015",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-fibrillation-04.png",
    image_alt: "fibrillation-auriculaire",
    clinical_context: "Femme de 78 ans sous digoxine et bisoprolol. Contrôle ECG en consultation de cardiologie.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme sinusal normal",
      "B) Bloc auriculo-ventriculaire complet",
      "C) Fibrillation auriculaire à réponse ventriculaire lente",
      "D) Bradycardie sinusale"
    ],
    correct: 2,
    explanation: "L'ECG montre une fibrillation auriculaire à réponse ventriculaire lente (~55 bpm), résultat du traitement freinateur par digoxine et bêta-bloquant. L'absence d'ondes P et la ligne de base irrégulière sont caractéristiques. Les intervalles RR restent irréguliers, ce qui exclut un BAV complet (qui aurait des RR réguliers). La cupule digitalique peut être visible sur le segment ST.",
    key_features: [
      "FA avec fréquence ventriculaire lente (~55 bpm)",
      "Intervalles RR irréguliers persistants",
      "Pas d'ondes P identifiables",
      "Possible cupule digitalique",
      "Effet des traitements freinateurs"
    ],
    tags: ["FA", "lente", "digoxine", "freinée"]
  },
  {
    id: "ecg-016",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-fibrillation-05.png",
    image_alt: "fibrillation-auriculaire",
    clinical_context: "Homme de 65 ans, bilan post-chirurgie cardiaque (pontage) J3. Monitoring en USIC.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie atriale post-opératoire",
      "B) Tachycardie sinusale réactionnelle",
      "C) Fibrillation auriculaire",
      "D) Flutter auriculaire"
    ],
    correct: 2,
    explanation: "Ce tracé montre une fibrillation auriculaire de novo en contexte post-chirurgie cardiaque, complication fréquente survenant typiquement entre J2 et J5. On observe l'absence d'ondes P, une ligne de base tremblante et des intervalles RR irréguliers. La FA post-opératoire est souvent paroxystique et peut nécessiter un contrôle de la fréquence et une anticoagulation temporaire.",
    key_features: [
      "Absence d'ondes P organisées",
      "Irrégularité des RR",
      "Contexte post-chirurgie cardiaque (J2-J5)",
      "Complication fréquente des pontages",
      "Souvent paroxystique"
    ],
    tags: ["FA", "post-opératoire", "chirurgie cardiaque"]
  },

  // --- Flutter auriculaire (3 questions) ---
  {
    id: "ecg-017",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-flutter-01.png",
    image_alt: "flutter-auriculaire",
    clinical_context: "Homme de 60 ans, palpitations régulières depuis 48 heures. FC régulière à 150 bpm au pouls.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Fibrillation auriculaire",
      "C) Tachycardie supraventriculaire paroxystique",
      "D) Flutter auriculaire"
    ],
    correct: 3,
    explanation: "L'ECG montre un flutter auriculaire typique avec des ondes F en « dents de scie » bien visibles dans les dérivations inférieures (DII, DIII, aVF) et en V1. La fréquence auriculaire est d'environ 300/min avec une conduction 2:1, donnant une fréquence ventriculaire à 150 bpm. La régularité des RR distingue le flutter de la FA. Les manœuvres vagales peuvent démasquer les ondes F en ralentissant transitoirement la conduction AV.",
    key_features: [
      "Ondes F en dents de scie (DII, DIII, aVF, V1)",
      "Fréquence auriculaire ~300/min",
      "Conduction AV 2:1 → FC ~150 bpm",
      "Intervalles RR réguliers",
      "Absence de ligne isoélectrique entre les ondes F"
    ],
    tags: ["flutter", "dents de scie", "arythmie"]
  },
  {
    id: "ecg-018",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-flutter-02.png",
    image_alt: "flutter-auriculaire",
    clinical_context: "Femme de 74 ans, vertige et lipothymie. FC à 75 bpm. Antécédent de valvulopathie mitrale.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Flutter auriculaire avec conduction 4:1",
      "B) Bradycardie sinusale",
      "C) Bloc auriculo-ventriculaire du 2e degré",
      "D) Fibrillation auriculaire lente"
    ],
    correct: 0,
    explanation: "L'ECG montre un flutter auriculaire avec une conduction AV 4:1. La fréquence auriculaire est d'environ 300/min, mais seule une onde F sur quatre est conduite, donnant une fréquence ventriculaire de ~75 bpm. Les ondes F en dents de scie sont visibles entre les QRS, surtout en DII et V1. Ce ratio de conduction élevé peut être spontané ou favorisé par un traitement freinateur.",
    key_features: [
      "Ondes F en dents de scie entre les QRS",
      "Ratio de conduction 4:1",
      "Fréquence auriculaire ~300/min, ventriculaire ~75/min",
      "Rythme ventriculaire régulier",
      "Visible surtout en DII et V1"
    ],
    tags: ["flutter", "conduction variable", "valvulopathie"]
  },
  {
    id: "ecg-019",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-flutter-03.png",
    image_alt: "flutter-auriculaire",
    clinical_context: "Homme de 55 ans, essoufflement à l'effort. Découverte lors d'un test d'effort sous-maximal.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Fibrillation auriculaire",
      "B) Tachycardie atriale",
      "C) Flutter auriculaire",
      "D) Tachycardie sinusale inappropriée"
    ],
    correct: 2,
    explanation: "Ce tracé montre un flutter auriculaire avec activité atriale organisée à environ 300/min. Les ondes F sont régulières et bien visibles, formant le classique aspect en dents de scie sans retour à la ligne isoélectrique. À la différence de la FA, l'activité auriculaire est organisée et régulière. La tachycardie atriale se distingue par une fréquence auriculaire plus lente et une ligne isoélectrique entre les ondes P'.",
    key_features: [
      "Activité auriculaire organisée et régulière à ~300/min",
      "Aspect en dents de scie continu",
      "Pas de retour à la ligne isoélectrique",
      "Distinction avec la FA (organisé vs désorganisé)",
      "Distinction avec la tachycardie atriale (pas de ligne isoélectrique)"
    ],
    tags: ["flutter", "effort", "organisé"]
  },

  // --- Tachycardie supraventriculaire (3 questions) ---
  {
    id: "ecg-020",
    category: "arythmies_sv",
    difficulty: 2,
    image: "svt-01.png",
    image_alt: "tachycardie-supraventriculaire",
    clinical_context: "Femme de 30 ans, palpitations à début brutal depuis 20 minutes. Pas de douleur thoracique ni dyspnée.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Fibrillation auriculaire",
      "C) Tachycardie supraventriculaire paroxystique",
      "D) Flutter auriculaire 2:1"
    ],
    correct: 2,
    explanation: "L'ECG montre une tachycardie supraventriculaire paroxystique (TSV) à QRS fins avec une fréquence régulière d'environ 180 bpm. Les ondes P ne sont pas visibles, probablement masquées dans les QRS ou les ondes T (réentrée intra-nodale). Le début brutal est caractéristique de la TSV paroxystique. La régularité parfaite des RR exclut la FA, et l'absence d'ondes F visibles rend le flutter peu probable.",
    key_features: [
      "Fréquence régulière ~180 bpm",
      "QRS fins",
      "Ondes P non visibles",
      "Début et fin brusques (paroxystique)",
      "Intervalles RR parfaitement réguliers"
    ],
    tags: ["TSV", "paroxystique", "réentrée"]
  },
  {
    id: "ecg-021",
    category: "arythmies_sv",
    difficulty: 2,
    image: "svt-02.png",
    image_alt: "tachycardie-supraventriculaire",
    clinical_context: "Homme de 22 ans, crise de palpitations en contexte de stress professionnel. Sensation de cœur rapide et régulier.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie supraventriculaire paroxystique",
      "B) Tachycardie ventriculaire",
      "C) Syndrome de Wolff-Parkinson-White avec FA",
      "D) Tachycardie sinusale"
    ],
    correct: 0,
    explanation: "Ce tracé montre une TSV paroxystique avec une fréquence cardiaque régulière à environ 190 bpm et des QRS fins. L'absence de QRS larges élimine une tachycardie ventriculaire et un syndrome de WPW avec FA pré-excitée. La fréquence élevée et l'absence d'ondes P sinusales rendent la tachycardie sinusale très improbable. Les manœuvres vagales (Valsalva, massage sino-carotidien) peuvent réduire cette tachycardie.",
    key_features: [
      "FC régulière ~190 bpm",
      "QRS fins excluant la TV",
      "Pas d'onde delta excluant le WPW",
      "Pas d'ondes P sinusales visibles",
      "Réponse aux manœuvres vagales attendue"
    ],
    tags: ["TSV", "jeune", "paroxystique"]
  },
  {
    id: "ecg-022",
    category: "arythmies_sv",
    difficulty: 2,
    image: "svt-03.png",
    image_alt: "tachycardie-supraventriculaire",
    clinical_context: "Femme de 45 ans, épisodes récurrents de palpitations paroxystiques depuis l'adolescence. Dernier épisode il y a 1 heure.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Flutter auriculaire",
      "B) Tachycardie atriale focale",
      "C) Fibrillation auriculaire paroxystique",
      "D) Tachycardie supraventriculaire paroxystique"
    ],
    correct: 3,
    explanation: "L'ECG enregistré durant l'épisode montre une TSV paroxystique typique avec des QRS fins et réguliers à environ 175 bpm. L'histoire clinique d'épisodes récurrents depuis l'adolescence est très évocatrice d'une réentrée intra-nodale (TRIN), le type le plus fréquent de TSV. L'absence d'ondes F exclut le flutter. La parfaite régularité des RR rend la FA très improbable. Une étude électrophysiologique avec ablation peut être proposée.",
    key_features: [
      "QRS fins réguliers à ~175 bpm",
      "Épisodes récurrents depuis l'adolescence",
      "Pas d'ondes F (flutter exclu)",
      "Régularité parfaite (FA exclue)",
      "Probable réentrée intra-nodale (TRIN)"
    ],
    tags: ["TSV", "TRIN", "récurrent", "ablation"]
  },

  // ============================================================
  // CATÉGORIE : blocs (17 questions)
  // ============================================================

  // --- BAV 1er degré (3 questions) ---
  {
    id: "ecg-023",
    category: "blocs",
    difficulty: 1,
    image: "first-degree-av-block-01.png",
    image_alt: "bav-premier-degre",
    clinical_context: "Homme de 67 ans, suivi cardiologique annuel. Asymptomatique, traité par vérapamil pour HTA.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme sinusal normal",
      "B) Bloc auriculo-ventriculaire du 1er degré",
      "C) Bloc auriculo-ventriculaire du 2e degré type Mobitz I",
      "D) Bloc de branche gauche"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme sinusal avec un allongement fixe de l'intervalle PR au-delà de 200 ms (mesuré ici à environ 240 ms), définissant un BAV du 1er degré. Toutes les ondes P sont conduites (contrairement au BAV 2e degré). Les QRS sont fins, excluant un BBG. Le vérapamil, inhibiteur calcique bradycardisant, peut favoriser cet allongement du PR par son effet sur le nœud AV.",
    key_features: [
      "Intervalle PR > 200 ms (~240 ms)",
      "PR allongé mais constant",
      "Toutes les ondes P sont conduites",
      "QRS fins",
      "Effet possible du vérapamil"
    ],
    tags: ["BAV", "1er degré", "PR allongé"]
  },
  {
    id: "ecg-024",
    category: "blocs",
    difficulty: 1,
    image: "first-degree-av-block-02.png",
    image_alt: "bav-premier-degre",
    clinical_context: "Femme de 75 ans, bilan pré-opératoire pour pose de prothèse de hanche. Pas de symptômes cardiaques.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc auriculo-ventriculaire du 1er degré",
      "B) Dysfonction sinusale",
      "C) Rythme jonctionnel accéléré",
      "D) Bloc de branche droit"
    ],
    correct: 0,
    explanation: "Ce tracé révèle un BAV du 1er degré avec un PR mesuré à environ 260 ms. Le rythme est sinusal et régulier, avec une onde P avant chaque QRS, excluant une dysfonction sinusale. Les ondes P sont positives en DII, excluant un rythme jonctionnel. Les QRS sont fins sans morphologie de BBD. Ce BAV isolé du 1er degré ne contre-indique pas la chirurgie.",
    key_features: [
      "PR allongé à ~260 ms",
      "Conduction AV préservée (1:1)",
      "Ondes P sinusales visibles",
      "QRS fins sans bloc de branche",
      "Bénin, pas de contre-indication chirurgicale"
    ],
    tags: ["BAV", "1er degré", "pré-opératoire"]
  },
  {
    id: "ecg-025",
    category: "blocs",
    difficulty: 1,
    image: "first-degree-av-block-03.png",
    image_alt: "bav-premier-degre",
    clinical_context: "Homme de 50 ans, sportif amateur, ECG de suivi annuel. Entraînement 4 fois par semaine.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Syndrome de Wolff-Parkinson-White",
      "B) Bloc auriculo-ventriculaire du 2e degré",
      "C) Bloc auriculo-ventriculaire du 1er degré",
      "D) Bloc sino-auriculaire"
    ],
    correct: 2,
    explanation: "L'ECG montre un BAV du 1er degré avec un PR à environ 220 ms, fréquemment observé chez les sportifs en raison de l'hypertonie vagale. Toutes les ondes P sont conduites avec un PR constant, ce qui exclut un BAV du 2e degré. L'absence d'onde delta et de PR court exclut un WPW. Il n'y a pas de pause sinusale évoquant un bloc sino-auriculaire. C'est une trouvaille bénigne chez le sportif.",
    key_features: [
      "PR allongé à ~220 ms",
      "PR constant, toutes les P conduites",
      "Hypertonie vagale du sportif",
      "Pas d'onde delta (WPW exclu)",
      "Trouvaille bénigne"
    ],
    tags: ["BAV", "1er degré", "sportif", "vagal"]
  },

  // --- BAV 2e degré (3 questions) ---
  {
    id: "ecg-026",
    category: "blocs",
    difficulty: 2,
    image: "second-degree-av-block-01.png",
    image_alt: "bav-deuxieme-degre",
    clinical_context: "Femme de 63 ans, lipothymies à répétition. FC irrégulière au pouls à environ 50 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc auriculo-ventriculaire du 1er degré",
      "B) Fibrillation auriculaire lente",
      "C) Bloc auriculo-ventriculaire du 2e degré",
      "D) Bradycardie sinusale avec extrasystoles bloquées"
    ],
    correct: 2,
    explanation: "L'ECG montre un BAV du 2e degré avec des ondes P visibles dont certaines ne sont pas suivies de complexes QRS (ondes P bloquées). La présence d'ondes P non conduites distingue ce tracé d'un BAV du 1er degré (où toutes les P sont conduites). La ligne de base stable avec ondes P identifiables exclut la FA. Les lipothymies sont probablement liées aux pauses ventriculaires lors des ondes P bloquées.",
    key_features: [
      "Ondes P visibles dont certaines non conduites",
      "Pauses ventriculaires lors des P bloquées",
      "Ondes P régulières (rythme sinusal préservé)",
      "Fréquence ventriculaire réduite",
      "Corrélation avec les symptômes (lipothymies)"
    ],
    tags: ["BAV", "2e degré", "Mobitz", "lipothymie"]
  },
  {
    id: "ecg-027",
    category: "blocs",
    difficulty: 2,
    image: "second-degree-av-block-02.png",
    image_alt: "bav-deuxieme-degre",
    clinical_context: "Homme de 70 ans, monitoring en cardiologie après un malaise. Pas de cardiopathie connue.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc auriculo-ventriculaire du 2e degré",
      "B) Bloc auriculo-ventriculaire du 3e degré",
      "C) Dysfonction sinusale avec pauses",
      "D) Bloc de branche droit intermittent"
    ],
    correct: 0,
    explanation: "Ce tracé montre un BAV du 2e degré avec un allongement progressif du PR avant une onde P bloquée (type Mobitz I ou Wenckebach) ou un blocage brutal (Mobitz II). Dans les deux cas, certaines ondes P ne sont pas conduites. La dissociation n'est pas complète (certaines P sont conduites), ce qui exclut un BAV du 3e degré. Les ondes P sont régulières, excluant une dysfonction sinusale.",
    key_features: [
      "Ondes P bloquées intermittentes",
      "Dissociation AV partielle (pas complète)",
      "Rythme auriculaire régulier",
      "Pauses ventriculaires prévisibles",
      "QRS conduits de morphologie constante"
    ],
    tags: ["BAV", "2e degré", "Wenckebach"]
  },
  {
    id: "ecg-028",
    category: "blocs",
    difficulty: 2,
    image: "second-degree-av-block-03.png",
    image_alt: "bav-deuxieme-degre",
    clinical_context: "Femme de 80 ans, asthénie et vertiges positionnels. FC à 45 bpm. Traitée par amiodarone.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc sino-auriculaire du 2e degré",
      "B) Bradycardie sinusale sévère",
      "C) Bloc auriculo-ventriculaire du 2e degré",
      "D) Rythme d'échappement jonctionnel"
    ],
    correct: 2,
    explanation: "L'ECG montre un BAV du 2e degré avec des ondes P régulières dont certaines ne sont pas suivies de QRS. La fréquence ventriculaire est basse (~45 bpm) du fait du nombre élevé d'ondes P bloquées. L'amiodarone peut aggraver la conduction AV et contribuer à ce trouble. Contrairement au bloc sino-auriculaire, les ondes P sont toutes présentes et régulières ; c'est la conduction AV qui est défaillante.",
    key_features: [
      "Ondes P régulières avec certaines non conduites",
      "Fréquence ventriculaire basse (~45 bpm)",
      "Ratio de conduction réduit",
      "Effet pro-arythmique possible de l'amiodarone",
      "Ondes P toutes visibles (≠ BSA)"
    ],
    tags: ["BAV", "2e degré", "amiodarone", "iatrogène"]
  },

  // --- BAV 3e degré (3 questions) ---
  {
    id: "ecg-029",
    category: "blocs",
    difficulty: 2,
    image: "third-degree-av-block-01.png",
    image_alt: "bav-troisieme-degre",
    clinical_context: "Homme de 78 ans, syncope brutale au repos. FC à 35 bpm. PA 90/60 mmHg.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc auriculo-ventriculaire du 2e degré avancé",
      "B) Bloc auriculo-ventriculaire du 3e degré",
      "C) Bradycardie sinusale extrême",
      "D) Fibrillation auriculaire lente"
    ],
    correct: 1,
    explanation: "L'ECG montre un BAV du 3e degré (complet) avec une dissociation complète entre les ondes P et les complexes QRS. Les ondes P sont régulières à leur propre fréquence (~75/min) et les QRS sont réguliers à une fréquence d'échappement beaucoup plus lente (~35/min). Aucune onde P n'est conduite : l'intervalle PR varie constamment. Le rythme d'échappement ventriculaire explique l'hémodynamique instable. Un pace-maker temporaire puis définitif est indiqué.",
    key_features: [
      "Dissociation AV complète",
      "Ondes P régulières à ~75/min",
      "QRS d'échappement réguliers à ~35/min",
      "Intervalle PR variable (pas de conduction)",
      "Indication de stimulation cardiaque"
    ],
    tags: ["BAV", "3e degré", "complet", "syncope", "pacemaker"]
  },
  {
    id: "ecg-030",
    category: "blocs",
    difficulty: 3,
    image: "third-degree-av-block-02.png",
    image_alt: "bav-troisieme-degre",
    clinical_context: "Femme de 85 ans, malaises récurrents avec perte de connaissance brève. ECG en salle de monitoring.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc auriculo-ventriculaire du 3e degré",
      "B) Bloc auriculo-ventriculaire du 2e degré type Mobitz II",
      "C) Dysfonction sinusale sévère",
      "D) Bloc de branche gauche avec bradycardie"
    ],
    correct: 0,
    explanation: "Ce tracé montre un BAV complet avec dissociation AV totale. Les ondes P « marchent à travers » les QRS sans aucun lien temporel fixe avec eux. Le rythme d'échappement peut être jonctionnel (QRS fins) ou ventriculaire (QRS larges). Dans le BAV 2e degré Mobitz II, certaines P seraient encore conduites avec un PR fixe. La dysfonction sinusale n'explique pas la dissociation AV. L'indication de pacemaker définitif est formelle.",
    key_features: [
      "Ondes P traversant les QRS sans relation fixe",
      "Dissociation AV totale",
      "Rythme d'échappement régulier",
      "Fréquence auriculaire ≠ fréquence ventriculaire",
      "Indication formelle de pacemaker"
    ],
    tags: ["BAV", "3e degré", "complet", "pacemaker"]
  },
  {
    id: "ecg-031",
    category: "blocs",
    difficulty: 3,
    image: "third-degree-av-block-03.png",
    image_alt: "bav-troisieme-degre",
    clinical_context: "Homme de 72 ans, transfert du SAMU pour bradycardie extrême à 28 bpm. Confusion et marbrures.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Fibrillation auriculaire avec bloc de branche",
      "B) Bloc auriculo-ventriculaire du 3e degré",
      "C) Bradycardie sinusale sévère",
      "D) Intoxication digitalique avec BAV du 2e degré"
    ],
    correct: 1,
    explanation: "L'ECG montre un BAV du 3e degré avec un rythme d'échappement ventriculaire très lent à 28 bpm, expliquant les signes de bas débit (confusion, marbrures). La dissociation AV est complète : les ondes P sont visibles mais indépendantes des QRS. Les QRS d'échappement sont larges, suggérant un foyer d'échappement infra-hissien. En bradycardie sinusale, les ondes P seraient toujours suivies de QRS. C'est une urgence vitale nécessitant isoprénaline et pacemaker temporaire.",
    key_features: [
      "Rythme d'échappement très lent (~28 bpm)",
      "QRS larges (échappement ventriculaire)",
      "Dissociation AV complète",
      "Signes de bas débit cardiaque",
      "Urgence vitale : isoprénaline + SEES"
    ],
    tags: ["BAV", "3e degré", "urgence", "bas débit"]
  },

  // --- Bloc de branche gauche (3 questions) ---
  {
    id: "ecg-032",
    category: "blocs",
    difficulty: 2,
    image: "lbbb-01.png",
    image_alt: "bloc-branche-gauche",
    clinical_context: "Homme de 68 ans, insuffisance cardiaque connue. FEVG à 30%. Bilan pour resynchronisation cardiaque.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche droit",
      "B) Hémibloc antérieur gauche",
      "C) Bloc de branche gauche",
      "D) Hypertrophie ventriculaire gauche"
    ],
    correct: 2,
    explanation: "L'ECG montre un bloc de branche gauche (BBG) complet avec un QRS élargi > 120 ms. Les critères diagnostiques sont : onde R large, crochetée en V5-V6 et DI-aVL (aspect RR'), absence d'onde Q septale en V5-V6, et aspect QS ou rS en V1-V2. Le BBG avec QRS > 150 ms est une indication de resynchronisation cardiaque chez ce patient avec FEVG altérée. Les anomalies de repolarisation (ST-T discordant) sont secondaires au BBG.",
    key_features: [
      "QRS élargi > 120 ms",
      "Onde R large crochetée en V5-V6 (aspect RR')",
      "Aspect QS ou rS en V1-V2",
      "Absence d'onde Q septale en V5-V6",
      "Troubles de repolarisation secondaires"
    ],
    tags: ["BBG", "bloc de branche", "resynchronisation"]
  },
  {
    id: "ecg-033",
    category: "blocs",
    difficulty: 2,
    image: "lbbb-02.png",
    image_alt: "bloc-branche-gauche",
    clinical_context: "Femme de 73 ans, douleur thoracique depuis 2 heures. ECG aux urgences. Antécédent de BBG connu.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur",
      "B) Bloc de branche gauche",
      "C) Bloc de branche droit avec hémibloc",
      "D) Syndrome de Brugada"
    ],
    correct: 1,
    explanation: "L'ECG montre un bloc de branche gauche complet avec des QRS larges, un aspect QS en V1-V2 et une onde R large monophasique en V5-V6. En présence d'un BBG connu, l'interprétation du segment ST est difficile car les anomalies de repolarisation sont attendues. Les critères de Sgarbossa peuvent aider à diagnostiquer un IDM associé : sus-décalage ST concordant > 1 mm ou sous-décalage ST > 1 mm en V1-V3. L'aspect est ici celui d'un BBG isolé sans critères de Sgarbossa positifs.",
    key_features: [
      "QRS larges avec morphologie de BBG",
      "Aspect QS en V1-V2",
      "R monophasique en V5-V6",
      "Repolarisation secondaire au BBG",
      "Critères de Sgarbossa à rechercher si suspicion d'IDM"
    ],
    tags: ["BBG", "douleur thoracique", "Sgarbossa"]
  },
  {
    id: "ecg-034",
    category: "blocs",
    difficulty: 2,
    image: "lbbb-03.png",
    image_alt: "bloc-branche-gauche",
    clinical_context: "Homme de 60 ans, découverte fortuite d'un BBG lors d'un bilan de santé. Aucun symptôme cardiaque.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Pré-excitation ventriculaire (WPW)",
      "B) Hypertrophie ventriculaire gauche",
      "C) Bloc de branche gauche",
      "D) Bloc auriculo-ventriculaire du 1er degré"
    ],
    correct: 2,
    explanation: "Ce tracé montre un BBG complet caractérisé par un QRS > 120 ms avec l'aspect typique : complexe QRS exclusivement négatif en V1 (QS) et positif avec crochetage en V5-V6. L'absence d'onde delta exclut un WPW. Les voltages ne remplissent pas les critères d'HVG au-delà de ce qui est attendu dans un BBG. L'intervalle PR est normal, excluant un BAV du 1er degré. Un BBG isolé chez un patient asymptomatique nécessite un bilan étiologique (échocardiographie).",
    key_features: [
      "QRS > 120 ms",
      "QS en V1, R crochetée en V5-V6",
      "Pas d'onde delta (WPW exclu)",
      "PR normal (BAV exclu)",
      "Bilan étiologique recommandé"
    ],
    tags: ["BBG", "découverte fortuite", "bilan"]
  },

  // --- Bloc de branche droit (3 questions) ---
  {
    id: "ecg-035",
    category: "blocs",
    difficulty: 2,
    image: "rbbb-01.png",
    image_alt: "bloc-branche-droit",
    clinical_context: "Femme de 55 ans, bilan de dyspnée. Antécédent d'embolie pulmonaire il y a 2 ans.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche gauche",
      "B) Bloc de branche droit",
      "C) Hémibloc postérieur gauche",
      "D) Hypertrophie ventriculaire droite"
    ],
    correct: 1,
    explanation: "L'ECG montre un bloc de branche droit (BBD) complet caractérisé par un QRS > 120 ms avec un aspect rsR' (ou RsR') en V1-V2 et une onde S large et traînante en V5-V6 et DI. L'onde T est inversée en V1-V3 de façon secondaire au BBD. Contrairement au BBG, la morphologie est dominée par une positivité tardive en V1. Le BBD peut être associé à une surcharge droite dans le contexte d'embolie pulmonaire.",
    key_features: [
      "QRS > 120 ms",
      "Aspect rsR' en V1-V2",
      "Onde S large et traînante en DI, V5-V6",
      "Ondes T négatives en V1-V3 (secondaires)",
      "Possible lien avec pathologie droite (EP)"
    ],
    tags: ["BBD", "bloc de branche", "embolie pulmonaire"]
  },
  {
    id: "ecg-036",
    category: "blocs",
    difficulty: 2,
    image: "rbbb-02.png",
    image_alt: "bloc-branche-droit",
    clinical_context: "Homme de 42 ans, ECG systématique lors d'un don du sang. Complètement asymptomatique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche droit",
      "B) Syndrome de Brugada type 1",
      "C) STEMI antérieur",
      "D) Bloc de branche gauche incomplet"
    ],
    correct: 0,
    explanation: "Ce tracé montre un BBD complet avec le classique aspect RsR' en V1 et onde S large en V5-V6. Le QRS est élargi au-delà de 120 ms. L'aspect en V1-V2 ne montre pas le sus-décalage ST en dôme caractéristique du syndrome de Brugada type 1. Il n'y a pas de sus-décalage ST convexe évoquant un STEMI. Un BBD isolé chez un sujet jeune asymptomatique est souvent bénin et considéré comme une variante de la normale.",
    key_features: [
      "Aspect RsR' en V1",
      "Onde S large en V5-V6",
      "QRS > 120 ms",
      "Pas de pattern de Brugada",
      "Bénin chez le sujet jeune asymptomatique"
    ],
    tags: ["BBD", "bénin", "asymptomatique"]
  },
  {
    id: "ecg-037",
    category: "blocs",
    difficulty: 2,
    image: "rbbb-03.png",
    image_alt: "bloc-branche-droit",
    clinical_context: "Femme de 88 ans, chute mécanique. ECG de routine aux urgences. Antécédents : BPCO, HTA.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Hémibloc antérieur gauche isolé",
      "B) Hypertrophie ventriculaire droite",
      "C) Bloc de branche droit",
      "D) Bloc auriculo-ventriculaire du 2e degré"
    ],
    correct: 2,
    explanation: "L'ECG montre un BBD complet avec un QRS élargi et la morphologie caractéristique en V1 (rsR' ou R élargi avec crochetage). L'onde S est étalée en V5-V6 et en DI. La BPCO peut contribuer à la surcharge droite, mais les critères d'HVD isolée ne sont pas remplis ici. Les ondes P sont toutes conduites avec un PR stable, excluant un BAV du 2e degré. L'hémibloc antérieur gauche donnerait une déviation axiale gauche sans élargissement majeur du QRS.",
    key_features: [
      "Morphologie rsR' en V1",
      "QRS élargi > 120 ms",
      "Onde S large en DI et V5-V6",
      "Pas de critères d'HVD isolée",
      "Conduction AV préservée"
    ],
    tags: ["BBD", "BPCO", "âgé"]
  },

  // --- Hémibloc antérieur gauche (2 questions) ---
  {
    id: "ecg-038",
    category: "blocs",
    difficulty: 3,
    image: "lafb-01.png",
    image_alt: "hemibloc-anterieur-gauche",
    clinical_context: "Homme de 74 ans, bilan cardiologique pour essoufflement. ECG de référence avant coronarographie.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche gauche",
      "B) Infarctus latéral ancien",
      "C) Hémibloc antérieur gauche",
      "D) Hypertrophie ventriculaire gauche"
    ],
    correct: 2,
    explanation: "L'ECG montre un hémibloc antérieur gauche (HBAG) caractérisé par une déviation axiale gauche marquée (axe au-delà de -45°). On observe un aspect qR en DI et aVL avec un aspect rS en DII, DIII et aVF. Le QRS n'est que légèrement élargi (< 120 ms), ce qui le distingue d'un BBG complet. L'aspect qR en aVL ne doit pas être confondu avec un infarctus latéral. L'HBAG traduit un bloc de la division antérieure du faisceau de His gauche.",
    key_features: [
      "Déviation axiale gauche > -45°",
      "Aspect qR en DI et aVL",
      "Aspect rS en DII, DIII, aVF",
      "QRS < 120 ms (≠ BBG complet)",
      "Bloc de la division antérieure gauche"
    ],
    tags: ["HBAG", "hémibloc", "déviation axiale"]
  },
  {
    id: "ecg-039",
    category: "blocs",
    difficulty: 3,
    image: "lafb-02.png",
    image_alt: "hemibloc-anterieur-gauche",
    clinical_context: "Femme de 66 ans, suivi post-IDM inférieur ancien. Contrôle ECG en consultation.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche droit",
      "B) Hémibloc antérieur gauche",
      "C) Séquelle d'infarctus inférieur isolée",
      "D) Bloc auriculo-ventriculaire du 1er degré"
    ],
    correct: 1,
    explanation: "Ce tracé montre un HBAG avec une déviation axiale gauche marquée. L'axe du QRS est au-delà de -45° avec un aspect qR en DI-aVL et rS en dérivations inférieures. Bien que la patiente ait un antécédent d'IDM inférieur, la déviation axiale gauche ici est principalement liée à l'HBAG et non uniquement aux séquelles d'infarctus. Le QRS est fin (< 120 ms), excluant un BBD. Le PR est normal, excluant un BAV du 1er degré.",
    key_features: [
      "Déviation axiale gauche importante",
      "Aspect qR en DI-aVL",
      "Aspect rS en DII-DIII-aVF",
      "QRS fin (< 120 ms)",
      "PR normal"
    ],
    tags: ["HBAG", "hémibloc", "post-IDM"]
  },

  // ============================================================
  // CATÉGORIE : ischemie (12 questions)
  // ============================================================

  // --- STEMI antérieur (5 questions) ---
  {
    id: "ecg-040",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-anterior-01.png",
    image_alt: "stemi-anterieur",
    clinical_context: "Homme de 56 ans, douleur thoracique constrictive intense depuis 45 minutes. Sudation, nausées.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Péricardite aiguë",
      "B) STEMI antérieur",
      "C) Repolarisation précoce bénigne",
      "D) Bloc de branche gauche"
    ],
    correct: 1,
    explanation: "L'ECG montre un STEMI antérieur avec un sus-décalage du segment ST convexe vers le haut (en dôme) dans les dérivations précordiales V1-V4. Ce sus-décalage est localisé au territoire de l'IVA (interventriculaire antérieure). Le miroir est visible sous forme de sous-décalage ST en dérivations inférieures (DII, DIII, aVF). Contrairement à la péricardite, le sus-décalage est localisé et convexe. Les QRS sont fins, excluant un BBG.",
    key_features: [
      "Sus-décalage ST convexe en V1-V4",
      "Territoire de l'IVA",
      "Miroir inférieur (sous-décalage en DII-DIII-aVF)",
      "Sus-décalage localisé (≠ péricardite diffuse)",
      "Urgence : revascularisation dans les 90 minutes"
    ],
    tags: ["STEMI", "antérieur", "IVA", "urgence"]
  },
  {
    id: "ecg-041",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-anterior-02.png",
    image_alt: "stemi-anterieur",
    clinical_context: "Femme de 63 ans, oppression thoracique irradiant au bras gauche depuis 1 heure. FC 90 bpm, PA 100/70.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur",
      "B) STEMI inférieur",
      "C) Embolie pulmonaire massive",
      "D) Cardiomyopathie de Tako-Tsubo"
    ],
    correct: 0,
    explanation: "L'ECG montre un STEMI antérieur étendu avec un sus-décalage ST significatif dans les dérivations V1 à V5, témoignant d'une occlusion proximale de l'IVA. L'étendue du sus-décalage (V1-V5) indique un territoire à risque important. La cardiomyopathie de Tako-Tsubo peut mimer un STEMI antérieur, mais le contexte clinique typique d'un SCA oriente vers une occlusion coronaire. L'angioplastie primaire est indiquée en urgence.",
    key_features: [
      "Sus-décalage ST en V1-V5",
      "Occlusion proximale de l'IVA probable",
      "Territoire à risque étendu",
      "Contexte clinique de SCA typique",
      "Angioplastie primaire en urgence"
    ],
    tags: ["STEMI", "antérieur", "étendu", "IVA proximale"]
  },
  {
    id: "ecg-042",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-anterior-03.png",
    image_alt: "stemi-anterieur",
    clinical_context: "Homme de 48 ans, douleur thoracique brutale au repos à 3h du matin. Tabagique, pas de suivi médical.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Repolarisation précoce bénigne",
      "B) Syndrome de Brugada",
      "C) STEMI antérieur",
      "D) Péricardite aiguë"
    ],
    correct: 2,
    explanation: "L'ECG montre un STEMI antérieur avec sus-décalage ST dans les dérivations précordiales. Le sus-décalage est convexe (en dôme), ce qui le distingue de la repolarisation précoce bénigne (concave, en « hamac »). L'atteinte localisée aux précordiales exclut la péricardite qui donne un sus-décalage diffus dans quasiment toutes les dérivations. Le syndrome de Brugada donnerait un aspect spécifique en V1-V3 sans douleur thoracique prolongée.",
    key_features: [
      "Sus-décalage ST convexe en précordiales",
      "Convexité vers le haut (≠ repolarisation précoce concave)",
      "Atteinte localisée (≠ péricardite diffuse)",
      "Pas de morphologie de Brugada",
      "Contexte clinique typique d'IDM"
    ],
    tags: ["STEMI", "antérieur", "diagnostic différentiel"]
  },
  {
    id: "ecg-043",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-anterior-04.png",
    image_alt: "stemi-anterieur",
    clinical_context: "Femme de 70 ans, douleur thoracique depuis 2 heures avec dyspnée. Antécédent de diabète et HTA.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Hypertrophie ventriculaire gauche avec surcharge",
      "B) Bloc de branche gauche de novo",
      "C) STEMI antérieur",
      "D) STEMI latéral"
    ],
    correct: 2,
    explanation: "L'ECG montre un STEMI antérieur avec un sus-décalage du segment ST dans les dérivations V2-V4. L'aspect convexe du sus-décalage est en faveur d'une lésion transmurale. L'HVG avec surcharge peut donner des anomalies du ST mais de façon discordante en précordiales latérales ; ici l'aspect est concordant avec un SCA. Le BBG de novo serait une indication de coronarographie urgente mais les QRS sont fins. Le territoire est antérieur et non latéral (absence de sus-décalage en DI-aVL-V5-V6).",
    key_features: [
      "Sus-décalage ST en V2-V4",
      "Convexité du segment ST",
      "QRS fins (pas de BBG)",
      "Territoire antérieur (IVA)",
      "Diabète : facteur de risque majeur"
    ],
    tags: ["STEMI", "antérieur", "diabète"]
  },
  {
    id: "ecg-044",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-anterior-05.png",
    image_alt: "stemi-anterieur",
    clinical_context: "Homme de 52 ans, douleur thoracique intense avec sensation de mort imminente. Troponine en cours.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI inférieur",
      "B) Péricardite aiguë",
      "C) Spasme coronarien (Prinzmetal)",
      "D) STEMI antérieur"
    ],
    correct: 3,
    explanation: "L'ECG montre un STEMI antérieur caractérisé par un sus-décalage ST marqué dans les précordiales antérieures. La présentation clinique avec douleur intense et sensation de mort imminente est typique d'un SCA avec sus-décalage ST. Le spasme coronarien de Prinzmetal peut donner un aspect identique mais est transitoire et souvent nocturne. La péricardite est exclue par le caractère localisé du sus-décalage et l'absence de sous-décalage PR. L'activation de la salle de cathétérisme ne doit pas attendre la troponine.",
    key_features: [
      "Sus-décalage ST marqué dans les précordiales",
      "Présentation clinique typique de SCA",
      "Sus-décalage localisé (≠ péricardite)",
      "Pas de sous-décalage PR (≠ péricardite)",
      "Ne pas attendre la troponine pour décider"
    ],
    tags: ["STEMI", "antérieur", "urgence", "cathétérisme"]
  },

  // --- STEMI inférieur (5 questions) ---
  {
    id: "ecg-045",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-inferior-01.png",
    image_alt: "stemi-inferieur",
    clinical_context: "Homme de 61 ans, douleur épigastrique intense depuis 30 minutes avec vomissements. FC 55 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur",
      "B) Péricardite aiguë",
      "C) STEMI inférieur",
      "D) Repolarisation précoce"
    ],
    correct: 2,
    explanation: "L'ECG montre un STEMI inférieur avec sus-décalage du segment ST en DII, DIII et aVF. Le miroir est visible sous forme de sous-décalage ST en DI et aVL. La bradycardie à 55 bpm est fréquente dans l'IDM inférieur par stimulation vagale (réflexe de Bezold-Jarisch). La douleur épigastrique est un mode de présentation classique de l'IDM inférieur, souvent confondu avec une pathologie digestive. Le territoire correspond à la coronaire droite ou la circonflexe.",
    key_features: [
      "Sus-décalage ST en DII, DIII, aVF",
      "Miroir : sous-décalage en DI, aVL",
      "Bradycardie vagale fréquente",
      "Douleur épigastrique possible",
      "Territoire de la coronaire droite ou Cx"
    ],
    tags: ["STEMI", "inférieur", "coronaire droite", "vagal"]
  },
  {
    id: "ecg-046",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-inferior-02.png",
    image_alt: "stemi-inferieur",
    clinical_context: "Femme de 58 ans, douleur thoracique basi-thoracique depuis 1 heure. PA 85/55 mmHg, jugulaires turgescentes.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI latéral",
      "B) STEMI inférieur",
      "C) Bloc de branche droit aigu",
      "D) Embolie pulmonaire"
    ],
    correct: 1,
    explanation: "L'ECG montre un STEMI inférieur avec sus-décalage ST en DII, DIII et aVF. L'hypotension avec turgescence jugulaire doit faire suspecter une extension au ventricule droit (sus-décalage en V3R-V4R à rechercher). L'IDM inférieur avec atteinte du VD est une forme grave nécessitant un remplissage vasculaire et non des dérivés nitrés (risque de collapsus). L'embolie pulmonaire est un diagnostic différentiel mais ne donne pas ce pattern typique de sus-décalage inférieur.",
    key_features: [
      "Sus-décalage ST en DII-DIII-aVF",
      "Hypotension avec turgescence jugulaire",
      "Suspecter extension au ventricule droit",
      "Demander les dérivations droites (V3R-V4R)",
      "Contre-indication aux dérivés nitrés si VD atteint"
    ],
    tags: ["STEMI", "inférieur", "ventricule droit"]
  },
  {
    id: "ecg-047",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-inferior-03.png",
    image_alt: "stemi-inferieur",
    clinical_context: "Homme de 73 ans, douleur thoracique constrictive au repos depuis 40 minutes. Antécédent de coronaropathie.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI inférieur",
      "B) Péricardite aiguë",
      "C) STEMI antérieur",
      "D) Repolarisation précoce bénigne"
    ],
    correct: 0,
    explanation: "L'ECG montre un STEMI inférieur avec sus-décalage ST dans les dérivations inférieures (DII, DIII, aVF). Le sus-décalage est convexe vers le haut, ce qui le distingue de la repolarisation précoce bénigne (concave). La péricardite donnerait un sus-décalage diffus avec sous-décalage du PR. Le territoire antérieur (V1-V4) est épargné, excluant un STEMI antérieur. Chez ce patient coronarien connu, la récidive d'un SCA est probable et l'angioplastie primaire est indiquée.",
    key_features: [
      "Sus-décalage ST en DII, DIII, aVF",
      "Convexité vers le haut du ST",
      "Pas de sus-décalage diffus (≠ péricardite)",
      "Précordiales non atteintes (≠ STEMI ant)",
      "Récidive chez un coronarien connu"
    ],
    tags: ["STEMI", "inférieur", "récidive"]
  },
  {
    id: "ecg-048",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-inferior-04.png",
    image_alt: "stemi-inferieur",
    clinical_context: "Femme de 67 ans, malaise avec pâleur et sueurs froides. Douleur inter-scapulaire. FC 48 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Dissection aortique",
      "B) STEMI latéral haut",
      "C) Bloc auriculo-ventriculaire du 2e degré",
      "D) STEMI inférieur"
    ],
    correct: 3,
    explanation: "L'ECG montre un STEMI inférieur avec sus-décalage ST en DII, DIII et aVF accompagné d'une bradycardie à 48 bpm. La douleur inter-scapulaire doit faire évoquer une dissection aortique (à exclure par scanner avant toute anticoagulation), mais le pattern ECG est celui d'un STEMI inférieur. La bradycardie est liée au réflexe vagal fréquent dans l'IDM inférieur. Le BAV du 2e degré nécessiterait des ondes P non conduites ; ici la bradycardie est sinusale.",
    key_features: [
      "Sus-décalage ST en DII-DIII-aVF",
      "Bradycardie vagale à 48 bpm",
      "Douleur inter-scapulaire : penser à la dissection",
      "Scanner avant anticoagulation si doute",
      "Bradycardie sinusale (pas de BAV)"
    ],
    tags: ["STEMI", "inférieur", "bradycardie", "dissection"]
  },
  {
    id: "ecg-049",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-inferior-05.png",
    image_alt: "stemi-inferieur",
    clinical_context: "Homme de 44 ans, fumeur, douleur thoracique brutale au football. Troponine ultra-sensible en hausse.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Spasme coronarien de Prinzmetal",
      "B) STEMI inférieur",
      "C) Myocardite aiguë",
      "D) Syndrome de Tako-Tsubo"
    ],
    correct: 1,
    explanation: "L'ECG montre un STEMI inférieur chez un sujet jeune fumeur avec un sus-décalage ST en DII, DIII et aVF. La troponine en hausse confirme la nécrose myocardique. Bien que le spasme coronarien puisse mimer un STEMI, le contexte d'effort et le tabagisme orientent vers une occlusion athérothrombotique. La myocardite peut donner des sus-décalages diffus mais est moins probable ici. Le Tako-Tsubo touche préférentiellement les femmes post-ménopausées après un stress émotionnel.",
    key_features: [
      "Sus-décalage ST en DII-DIII-aVF",
      "Sujet jeune fumeur",
      "Effort physique déclenchant",
      "Troponine confirmant la nécrose",
      "Coronarographie urgente indiquée"
    ],
    tags: ["STEMI", "inférieur", "jeune", "tabac"]
  },

  // --- Infarctus postérieur (2 questions) ---
  {
    id: "ecg-050",
    category: "ischemie",
    difficulty: 3,
    image: "posterior-mi-01.png",
    image_alt: "infarctus-posterieur",
    clinical_context: "Homme de 65 ans, douleur thoracique depuis 2 heures. ECG montrant des anomalies en V1-V3 atypiques.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche droit",
      "B) Hypertrophie ventriculaire droite",
      "C) Infarctus postérieur (STEMI postérieur)",
      "D) Repolarisation précoce en V1-V3"
    ],
    correct: 2,
    explanation: "L'ECG montre un infarctus postérieur caractérisé par des anomalies « en miroir » dans les dérivations antérieures V1-V3 : sous-décalage ST horizontal, grandes ondes R (image miroir des ondes Q postérieures) et ondes T positives amples (miroir des T négatives postérieures). Ce pattern est l'image en miroir d'un STEMI qui serait visible sur les dérivations postérieures V7-V9 (sus-décalage ST). Le territoire correspond à l'artère circonflexe ou la coronaire droite distale.",
    key_features: [
      "Sous-décalage ST horizontal en V1-V3",
      "Grandes ondes R en V1-V3 (miroir des ondes Q)",
      "Ondes T positives amples en V1-V3",
      "Dérivations postérieures V7-V9 à réaliser",
      "Territoire de la circonflexe ou CD distale"
    ],
    tags: ["STEMI", "postérieur", "miroir", "circonflexe"]
  },
  {
    id: "ecg-051",
    category: "ischemie",
    difficulty: 3,
    image: "posterior-mi-02.png",
    image_alt: "infarctus-posterieur",
    clinical_context: "Femme de 72 ans, douleur thoracique persistante. STEMI inférieur avec anomalies associées en V1-V3.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur avec BBD",
      "B) Infarctus postérieur associé à un STEMI inférieur",
      "C) Péricardite diffuse",
      "D) Bloc de branche droit avec ischémie"
    ],
    correct: 1,
    explanation: "L'ECG montre un STEMI inféro-postérieur. Les dérivations inférieures (DII, DIII, aVF) montrent un sus-décalage ST, tandis que les dérivations V1-V3 montrent le miroir postérieur : sous-décalage ST, ondes R amples et ondes T positives. L'association STEMI inférieur + atteinte postérieure suggère une occlusion de la coronaire droite dominante ou de la circonflexe. Les dérivations V7-V9 confirmeraient le sus-décalage ST postérieur. Ce pattern n'est pas un BBD (pas d'aspect rsR' en V1).",
    key_features: [
      "Sus-décalage ST en DII-DIII-aVF (STEMI inférieur)",
      "Miroir postérieur en V1-V3",
      "Grandes ondes R en V1 (miroir des Q postérieures)",
      "Association inféro-postérieur fréquente",
      "V7-V9 pour confirmer l'atteinte postérieure"
    ],
    tags: ["STEMI", "postérieur", "inférieur", "inféro-postérieur"]
  },

  // ============================================================
  // CATÉGORIE : autres (14 questions)
  // ============================================================

  // --- Hypertrophie ventriculaire gauche (3 questions) ---
  {
    id: "ecg-052",
    category: "autres",
    difficulty: 2,
    image: "lvh-01.png",
    image_alt: "hypertrophie-ventriculaire-gauche",
    clinical_context: "Homme de 58 ans, HTA mal contrôlée depuis 15 ans. PA 170/100 mmHg. Dyspnée d'effort stade II NYHA.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche gauche",
      "B) STEMI antérieur",
      "C) Hypertrophie ventriculaire gauche",
      "D) Cardiomyopathie hypertrophique"
    ],
    correct: 2,
    explanation: "L'ECG montre une hypertrophie ventriculaire gauche (HVG) avec des critères de voltage positifs : indice de Sokolow-Lyon (S en V1 + R en V5 ou V6) > 35 mm. On observe également des ondes R amples en V5-V6 et des ondes S profondes en V1-V2. Les troubles de repolarisation secondaires (sous-décalage ST et ondes T négatives en V5-V6, DI, aVL) sont dits « de surcharge systolique ». Les QRS ne sont pas suffisamment élargis pour un BBG complet.",
    key_features: [
      "Indice de Sokolow-Lyon > 35 mm",
      "Grandes ondes R en V5-V6",
      "Ondes S profondes en V1-V2",
      "Troubles de repolarisation de surcharge",
      "QRS non élargis (≠ BBG)"
    ],
    tags: ["HVG", "hypertrophie", "HTA", "Sokolow"]
  },
  {
    id: "ecg-053",
    category: "autres",
    difficulty: 2,
    image: "lvh-02.png",
    image_alt: "hypertrophie-ventriculaire-gauche",
    clinical_context: "Femme de 75 ans, rétrécissement aortique serré. Dyspnée d'effort et angor. Échocardiographie prévue.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Hypertrophie ventriculaire droite",
      "B) Hypertrophie ventriculaire gauche",
      "C) Ischémie sous-endocardique diffuse",
      "D) Bloc de branche gauche incomplet"
    ],
    correct: 1,
    explanation: "L'ECG montre une HVG dans un contexte de rétrécissement aortique serré. Les critères de voltage sont remplis avec de grandes ondes R en dérivations gauches. L'HVG sur valvulopathie aortique s'accompagne typiquement d'une surcharge systolique : sous-décalage ST descendant avec ondes T négatives asymétriques en V5-V6 et en latéral. L'HVD donnerait une déviation axiale droite et des ondes R dominantes en V1, ce qui n'est pas le cas ici.",
    key_features: [
      "Critères de voltage d'HVG remplis",
      "Surcharge systolique en V5-V6",
      "Ondes T négatives asymétriques en latéral",
      "Contexte de RAC serré",
      "Déviation axiale gauche possible"
    ],
    tags: ["HVG", "RAC", "surcharge systolique"]
  },
  {
    id: "ecg-054",
    category: "autres",
    difficulty: 2,
    image: "lvh-03.png",
    image_alt: "hypertrophie-ventriculaire-gauche",
    clinical_context: "Homme de 45 ans, sportif de haut niveau (rameur). Bilan cardiologique d'aptitude. Aucun symptôme.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Cardiomyopathie dilatée",
      "B) Bloc de branche gauche",
      "C) Hypertrophie ventriculaire gauche",
      "D) STEMI antérieur en évolution"
    ],
    correct: 2,
    explanation: "L'ECG montre des critères de voltage d'HVG chez un sportif de haut niveau. Le « cœur d'athlète » s'accompagne fréquemment de voltages élevés reflétant l'hypertrophie physiologique. Les ondes R sont amples en V5-V6 avec indice de Sokolow > 35 mm. Cependant, contrairement à l'HVG pathologique, la repolarisation est souvent normale ou avec des ondes T positives amples. L'absence de symptômes et le contexte sportif sont rassurants, mais une échocardiographie peut être nécessaire pour exclure une cardiomyopathie.",
    key_features: [
      "Voltages élevés (Sokolow > 35 mm)",
      "Cœur d'athlète physiologique",
      "Repolarisation souvent normale chez le sportif",
      "Distinction HVG physiologique vs pathologique",
      "Échocardiographie recommandée"
    ],
    tags: ["HVG", "sportif", "cœur d'athlète"]
  },

  // --- Wolff-Parkinson-White (2 questions) ---
  {
    id: "ecg-055",
    category: "autres",
    difficulty: 2,
    image: "wpw-01.png",
    image_alt: "wolff-parkinson-white",
    clinical_context: "Homme de 28 ans, palpitations paroxystiques récurrentes. ECG intercritique. Pas de cardiopathie structurelle.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche droit",
      "B) Syndrome de Wolff-Parkinson-White",
      "C) Extrasystoles ventriculaires",
      "D) Bloc de branche gauche incomplet"
    ],
    correct: 1,
    explanation: "L'ECG montre un syndrome de Wolff-Parkinson-White (WPW) caractérisé par la triade classique : PR court (< 120 ms), onde delta (empâtement initial du QRS) et QRS élargi. L'onde delta correspond à la pré-excitation ventriculaire par le faisceau accessoire (faisceau de Kent) qui court-circuite le nœud AV. L'aspect ne correspond pas à un BBD (pas de rsR' en V1) ni à un BBG. Le WPW prédispose aux tachycardies par réentrée et, rarement, à la mort subite en cas de FA pré-excitée.",
    key_features: [
      "PR court < 120 ms",
      "Onde delta (empâtement initial du QRS)",
      "QRS élargi par la pré-excitation",
      "Triade : PR court + onde delta + QRS large",
      "Risque de tachycardie par réentrée"
    ],
    tags: ["WPW", "pré-excitation", "onde delta", "Kent"]
  },
  {
    id: "ecg-056",
    category: "autres",
    difficulty: 3,
    image: "wpw-02.png",
    image_alt: "wolff-parkinson-white",
    clinical_context: "Femme de 22 ans, découverte fortuite de pré-excitation lors d'un ECG pour certificat sportif.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie ventriculaire",
      "B) Bloc de branche gauche",
      "C) Extrasystoles ventriculaires fréquentes",
      "D) Syndrome de Wolff-Parkinson-White"
    ],
    correct: 3,
    explanation: "L'ECG montre une pré-excitation ventriculaire de type WPW avec un intervalle PR court, une onde delta bien visible et un élargissement des QRS. L'onde delta positive ou négative dans les différentes dérivations permet de localiser approximativement la voie accessoire. L'aspect n'est pas celui d'une TV (pas de dissociation AV, pas de concordance en V) ni d'un BBG (présence de l'onde delta). Chez cette jeune femme asymptomatique, une étude électrophysiologique est recommandée pour stratifier le risque.",
    key_features: [
      "PR court avec onde delta",
      "QRS élargi par pré-excitation",
      "Polarité de l'onde delta variable selon les dérivations",
      "Localisation approximative de la voie accessoire possible",
      "Stratification du risque par EEP recommandée"
    ],
    tags: ["WPW", "pré-excitation", "asymptomatique", "EEP"]
  },

  // --- Pacemaker (2 questions) ---
  {
    id: "ecg-057",
    category: "autres",
    difficulty: 2,
    image: "pacemaker-01.png",
    image_alt: "pacemaker",
    clinical_context: "Homme de 80 ans, porteur d'un pacemaker double chambre depuis 3 ans. Contrôle ECG en consultation.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche gauche",
      "B) Rythme électro-entraîné (pacemaker)",
      "C) Tachycardie ventriculaire",
      "D) Bloc de branche droit avec hémibloc"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme électro-entraîné par pacemaker, identifiable par les spikes (artéfacts de stimulation) précédant les complexes QRS. Les QRS stimulés sont larges avec une morphologie de type BBG car la stimulation ventriculaire se fait habituellement depuis l'apex du ventricule droit. Les spikes peuvent être auriculaires (avant l'onde P) et/ou ventriculaires (avant le QRS) selon le mode de stimulation. Le rythme est régulier à la fréquence programmée du stimulateur.",
    key_features: [
      "Spikes de stimulation visibles",
      "QRS larges de morphologie type BBG",
      "Rythme régulier à la fréquence du pacemaker",
      "Stimulation ventriculaire depuis l'apex du VD",
      "Possibles spikes auriculaires (double chambre)"
    ],
    tags: ["pacemaker", "stimulation", "électro-entraîné"]
  },
  {
    id: "ecg-058",
    category: "autres",
    difficulty: 2,
    image: "pacemaker-02.png",
    image_alt: "pacemaker",
    clinical_context: "Femme de 76 ans, pacemaker simple chambre pour BAV complet. Palpitations intermittentes. Contrôle ECG.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie ventriculaire monomorphe",
      "B) Bloc de branche gauche avec BAV du 3e degré",
      "C) Rythme électro-entraîné (pacemaker)",
      "D) Extrasystoles ventriculaires en bigéminisme"
    ],
    correct: 2,
    explanation: "L'ECG montre un rythme ventriculaire électro-entraîné par pacemaker simple chambre (VVI). Les spikes ventriculaires sont suivis de QRS larges. On peut voir des ondes P « marchant » à travers le tracé indépendamment des QRS stimulés, reflétant la dissociation AV persistante (le pacemaker ne stimule que le ventricule). La TV est exclue par la présence des spikes et la régularité du rythme à la fréquence programmée. Le bigéminisme montrerait une alternance battement normal/ESV.",
    key_features: [
      "Spikes ventriculaires suivis de QRS larges",
      "Mode VVI (stimulation ventriculaire seule)",
      "Ondes P dissociées (BAV complet sous-jacent)",
      "Fréquence régulière programmée",
      "Pas d'alternance (≠ bigéminisme)"
    ],
    tags: ["pacemaker", "VVI", "BAV complet"]
  },

  // --- Questions supplémentaires pour atteindre 65 ---
  // Ajout de 5 questions supplémentaires dans "autres"

  {
    id: "ecg-059",
    category: "autres",
    difficulty: 2,
    image: "lvh-01.png",
    image_alt: "hypertrophie-ventriculaire-gauche",
    clinical_context: "Femme de 82 ans, insuffisance cardiaque à FEVG préservée. HTA ancienne. Bilan d'une décompensation.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur subaiguë",
      "B) Bloc de branche gauche",
      "C) Hypertrophie ventriculaire gauche",
      "D) Péricardite constrictive"
    ],
    correct: 2,
    explanation: "L'ECG montre une HVG avec des voltages élevés en précordiales, typique d'une cardiopathie hypertensive de longue date. L'indice de Sokolow-Lyon est positif. Les troubles de repolarisation en latéral (sous-décalage ST, ondes T négatives) correspondent à la surcharge systolique et ne doivent pas être confondus avec un STEMI. Le QRS n'est pas suffisamment élargi pour un BBG complet. La péricardite constrictive donnerait plutôt des micro-voltages.",
    key_features: [
      "Voltages élevés en précordiales",
      "Indice de Sokolow-Lyon positif",
      "Surcharge systolique en latéral",
      "Ne pas confondre avec un STEMI",
      "Micro-voltages en cas de péricardite constrictive (absent ici)"
    ],
    tags: ["HVG", "insuffisance cardiaque", "HTA"]
  },
  {
    id: "ecg-060",
    category: "autres",
    difficulty: 2,
    image: "lvh-02.png",
    image_alt: "hypertrophie-ventriculaire-gauche",
    clinical_context: "Homme de 50 ans, souffle systolique éjectionnel au foyer aortique. Bilan de valvulopathie aortique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Hypertrophie ventriculaire gauche",
      "B) Bloc auriculo-ventriculaire du 1er degré",
      "C) Ischémie sous-épicardique antérieure",
      "D) Bloc de branche droit"
    ],
    correct: 0,
    explanation: "L'ECG montre une HVG en rapport avec la valvulopathie aortique. Les critères de Cornell (R en aVL + S en V3 > 28 mm chez l'homme) et/ou de Sokolow sont remplis. La surcharge systolique se manifeste par un sous-décalage du ST convexe vers le haut avec inversion des ondes T en latéral, traduisant la contrainte hémodynamique sur le ventricule gauche. Ce n'est pas une ischémie vraie mais un remodelage électrique lié à l'hypertrophie.",
    key_features: [
      "Critères de Cornell et/ou Sokolow positifs",
      "Surcharge systolique en latéral",
      "Sous-décalage ST convexe vers le haut",
      "Remodelage électrique (≠ ischémie vraie)",
      "Contexte de valvulopathie aortique"
    ],
    tags: ["HVG", "Cornell", "valvulopathie"]
  },
  {
    id: "ecg-061",
    category: "autres",
    difficulty: 3,
    image: "wpw-01.png",
    image_alt: "wolff-parkinson-white",
    clinical_context: "Homme de 35 ans, épisode de tachycardie à QRS larges réduit aux urgences. ECG post-réduction.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie ventriculaire résiduelle",
      "B) Bloc de branche gauche résiduel",
      "C) Syndrome de Wolff-Parkinson-White",
      "D) Extrasystoles ventriculaires post-tachycardie"
    ],
    correct: 2,
    explanation: "L'ECG post-réduction montre le pattern de WPW avec la triade PR court, onde delta et QRS élargi. La tachycardie à QRS larges chez ce patient était probablement une tachycardie par réentrée sur voie accessoire (tachycardie antidromique) ou une FA pré-excitée. La reconnaissance du WPW après réduction est cruciale car elle change la prise en charge : les inhibiteurs du nœud AV (vérapamil, digoxine) sont contre-indiqués en cas de FA pré-excitée. L'ablation de la voie accessoire est recommandée.",
    key_features: [
      "PR court + onde delta + QRS élargi post-réduction",
      "Probable tachycardie antidromique ou FA pré-excitée",
      "Contre-indication aux inhibiteurs du nœud AV si FA",
      "Ablation de la voie accessoire recommandée",
      "Tachycardie à QRS larges ≠ toujours TV"
    ],
    tags: ["WPW", "post-tachycardie", "ablation"]
  },
  {
    id: "ecg-062",
    category: "autres",
    difficulty: 2,
    image: "pacemaker-01.png",
    image_alt: "pacemaker",
    clinical_context: "Homme de 85 ans, porteur de pacemaker DDD, consulte pour essoufflement progressif. Contrôle ECG.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche gauche avec insuffisance cardiaque",
      "B) Rythme électro-entraîné (pacemaker)",
      "C) Tachycardie ventriculaire lente",
      "D) Rythme idioventriculaire accéléré"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme électro-entraîné par pacemaker DDD (double chambre, détection et stimulation auriculaire et ventriculaire). Les spikes de stimulation sont visibles avant les ondes P et avant les QRS. La morphologie de BBG des QRS stimulés est liée à la sonde ventriculaire en position apicale droite. Le RIVA aurait un rythme à 50-100 bpm sans spikes. Une TV lente n'aurait pas de spikes de stimulation. L'essoufflement peut nécessiter une optimisation des paramètres du pacemaker.",
    key_features: [
      "Spikes auriculaires et ventriculaires visibles",
      "Mode DDD (double chambre)",
      "QRS stimulés de morphologie BBG",
      "Rythme régulier à la fréquence programmée",
      "Optimisation des paramètres possible"
    ],
    tags: ["pacemaker", "DDD", "double chambre"]
  },
  {
    id: "ecg-063",
    category: "autres",
    difficulty: 2,
    image: "pacemaker-02.png",
    image_alt: "pacemaker",
    clinical_context: "Femme de 90 ans, pacemaker VVI depuis 10 ans. Syncope au lever. Vérification du fonctionnement.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme électro-entraîné (pacemaker)",
      "B) Bloc de branche gauche complet",
      "C) Rythme d'échappement ventriculaire",
      "D) Tachycardie ventriculaire monomorphe lente"
    ],
    correct: 0,
    explanation: "L'ECG montre un rythme électro-entraîné par pacemaker VVI fonctionnel. Chaque spike est suivi d'un QRS élargi capturé, confirmant le bon fonctionnement de la stimulation ventriculaire. La syncope pourrait être liée à un « syndrome du pacemaker » (perte de la synchronisation AV) ou à une autre cause (hypotension orthostatique). Un rythme d'échappement ventriculaire serait plus lent et sans spikes. La TV montrerait des QRS larges sans artéfact de stimulation.",
    key_features: [
      "Chaque spike suivi d'un QRS capturé",
      "Fonctionnement normal de la stimulation",
      "Mode VVI confirmé",
      "Syncope : évoquer syndrome du pacemaker",
      "Pas de dysfonction de sonde apparente"
    ],
    tags: ["pacemaker", "VVI", "syncope"]
  },
  {
    id: "ecg-064",
    category: "autres",
    difficulty: 2,
    image: "lvh-03.png",
    image_alt: "hypertrophie-ventriculaire-gauche",
    clinical_context: "Femme de 60 ans, cardiomyopathie hypertrophique non obstructive connue. Suivi annuel.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Infarctus antérieur ancien avec séquelles",
      "B) Hypertrophie ventriculaire gauche",
      "C) Bloc de branche gauche",
      "D) Syndrome de Brugada type 2"
    ],
    correct: 1,
    explanation: "L'ECG montre une HVG marquée dans le contexte d'une cardiomyopathie hypertrophique (CMH). Les voltages sont très élevés avec des ondes R amples en V5-V6 et des ondes S profondes en V1-V2. La CMH peut donner des anomalies variées : pseudo-ondes Q (dues à l'hypertrophie septale), anomalies de repolarisation majeures et parfois des ondes T géantes inversées. Ces anomalies ne doivent pas être confondues avec des séquelles d'infarctus ou un syndrome de Brugada.",
    key_features: [
      "Voltages très élevés",
      "Possibles pseudo-ondes Q septales",
      "Anomalies de repolarisation majeures",
      "CMH : cause d'HVG à évoquer chez le jeune",
      "Distinction avec séquelles d'infarctus importante"
    ],
    tags: ["HVG", "CMH", "cardiomyopathie"]
  },
  {
    id: "ecg-065",
    category: "autres",
    difficulty: 3,
    image: "wpw-02.png",
    image_alt: "wolff-parkinson-white",
    clinical_context: "Homme de 18 ans, frère décédé de mort subite à 20 ans. Bilan familial systématique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche droit incomplet bénin",
      "B) Cardiomyopathie hypertrophique",
      "C) Syndrome de Wolff-Parkinson-White",
      "D) Syndrome du QT long"
    ],
    correct: 2,
    explanation: "L'ECG montre un syndrome de WPW avec PR court, onde delta et QRS élargi. Dans le contexte d'un bilan familial pour mort subite, la découverte d'un WPW est significative car le WPW est un facteur de risque de mort subite, notamment en cas de FA pré-excitée avec conduction rapide par le faisceau accessoire pouvant dégénérer en fibrillation ventriculaire. La période réfractaire de la voie accessoire doit être évaluée par étude électrophysiologique, et une ablation prophylactique est souvent proposée.",
    key_features: [
      "PR court + onde delta + QRS élargi",
      "Contexte familial de mort subite",
      "WPW : risque de mort subite par FA pré-excitée",
      "EEP indispensable pour évaluer le risque",
      "Ablation prophylactique souvent indiquée"
    ],
    tags: ["WPW", "mort subite", "familial", "ablation"]
  }
];

// Export pour utilisation dans index.html
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ECG_QUESTIONS;
}
