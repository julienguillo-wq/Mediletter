// ============================================================
// ECG Quiz – Banque de questions (FR)
// 50+ questions couvrant 6 catégories
// ============================================================

const ECG_QUESTIONS = [

  // =====================================================
  // CATÉGORIE : rythmes_normaux (5 questions)
  // =====================================================

  {
    id: "ecg-001",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "normal-sinus-rhythm-1.jpg",
    image_alt: "rythme-sinusal-normal",
    clinical_context: "Patient de 35 ans, bilan de routine, asymptomatique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme sinusal normal",
      "B) Bradycardie sinusale",
      "C) Tachycardie sinusale",
      "D) Fibrillation auriculaire"
    ],
    correct: 0,
    explanation: "L'ECG montre un rythme régulier avec des ondes P sinusales positives en DII, suivies de complexes QRS fins. La fréquence cardiaque est entre 60 et 100 bpm. L'intervalle PR est constant entre 120 et 200 ms. Il s'agit d'un rythme sinusal normal.",
    key_features: [
      "Rythme régulier",
      "Ondes P sinusales positives en DII, négatives en aVR",
      "Chaque onde P suivie d'un QRS",
      "FC entre 60 et 100 bpm",
      "PR entre 120 et 200 ms"
    ],
    tags: ["sinusal", "normal", "base"]
  },

  {
    id: "ecg-002",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-bradycardia-1.jpg",
    image_alt: "bradycardie-sinusale",
    clinical_context: "Homme de 28 ans, marathonien, consulte pour un certificat de sport. FC mesurée à 48 bpm, asymptomatique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) BAV du 3e degré",
      "B) Bradycardie sinusale",
      "C) Rythme d'échappement jonctionnel",
      "D) Dysfonction sinusale"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme régulier avec des ondes P sinusales avant chaque QRS, mais la fréquence est inférieure à 60 bpm (ici ~48 bpm). Chez un sportif entraîné, c'est un phénomène physiologique lié au tonus vagal élevé. Il n'y a pas de dissociation auriculo-ventriculaire, ce qui exclut un BAV 3.",
    key_features: [
      "Rythme régulier",
      "Ondes P sinusales présentes avant chaque QRS",
      "FC < 60 bpm",
      "PR constant et normal",
      "QRS fins"
    ],
    tags: ["sinusal", "bradycardie", "sportif"]
  },

  {
    id: "ecg-003",
    category: "rythmes_normaux",
    difficulty: 1,
    image: "sinus-tachycardia-1.jpg",
    image_alt: "tachycardie-sinusale",
    clinical_context: "Femme de 42 ans aux urgences pour fièvre à 39.5°C et frissons depuis 24h. FC à 115 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie par réentrée nodale",
      "B) Flutter auriculaire 2:1",
      "C) Tachycardie sinusale",
      "D) Tachycardie atriale focale"
    ],
    correct: 2,
    explanation: "L'ECG montre un rythme régulier avec des ondes P sinusales positives en DII précédant chaque QRS. La fréquence est à 115 bpm (> 100 bpm). Dans le contexte d'un sepsis, la tachycardie sinusale est une réponse physiologique appropriée. Contrairement à une TSV, les ondes P sont bien visibles et la fréquence monte progressivement.",
    key_features: [
      "Rythme régulier",
      "FC > 100 bpm",
      "Ondes P sinusales visibles avant chaque QRS",
      "PR normal et constant",
      "Contexte expliquant la tachycardie (fièvre, douleur, hypovolémie…)"
    ],
    tags: ["sinusal", "tachycardie", "fièvre"]
  },

  {
    id: "ecg-004",
    category: "rythmes_normaux",
    difficulty: 2,
    image: "sinus-arrhythmia-1.jpg",
    image_alt: "arythmie-sinusale-respiratoire",
    clinical_context: "Adolescente de 16 ans, bilan pré-opératoire. L'infirmière note un rythme irrégulier à l'auscultation.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Fibrillation auriculaire",
      "B) Arythmie sinusale respiratoire",
      "C) Extrasystoles auriculaires fréquentes",
      "D) Wandering atrial pacemaker"
    ],
    correct: 1,
    explanation: "L'ECG montre des ondes P sinusales de morphologie constante, mais l'intervalle P-P varie avec la respiration (raccourcit en inspiration, s'allonge en expiration). La variation est > 10% entre le plus court et le plus long cycle. C'est un phénomène physiologique fréquent chez le sujet jeune, lié au tonus vagal.",
    key_features: [
      "Ondes P sinusales de morphologie constante",
      "Variation cyclique de l'intervalle P-P > 10%",
      "Variation liée au cycle respiratoire",
      "PR constant",
      "QRS fins"
    ],
    tags: ["sinusal", "arythmie", "respiratoire", "physiologique"]
  },

  {
    id: "ecg-005",
    category: "rythmes_normaux",
    difficulty: 2,
    image: "early-repolarization-1.jpg",
    image_alt: "repolarisation-precoce",
    clinical_context: "Homme de 25 ans, sportif, consulte pour douleur thoracique atypique brève. Troponine négative.",
    question: "Quel est le diagnostic ECG le plus probable ?",
    options: [
      "A) STEMI antérieur aigu",
      "B) Péricardite aiguë",
      "C) Repolarisation précoce (variante normale)",
      "D) Syndrome de Brugada type 1"
    ],
    correct: 2,
    explanation: "L'ECG montre un sus-décalage du segment ST concave vers le haut, prédominant en V2-V5 avec un crochetage (notch) de la portion terminale du QRS (point J). Il n'y a pas d'image en miroir significative. La repolarisation précoce est une variante normale fréquente chez les hommes jeunes et sportifs. L'absence de douleur typique et la troponine négative confirment la bénignité.",
    key_features: [
      "Sus-décalage ST concave vers le haut",
      "Crochetage du point J (J-point notching)",
      "Prédominance en dérivations précordiales",
      "Absence d'image en miroir",
      "Sujet jeune et sportif"
    ],
    tags: ["repolarisation", "précoce", "variante", "normal", "ST"]
  },

  // =====================================================
  // CATÉGORIE : arythmies_sv (10 questions)
  // =====================================================

  {
    id: "ecg-006",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-fibrillation-rapid-1.jpg",
    image_alt: "fibrillation-auriculaire-rapide",
    clinical_context: "Homme de 72 ans, HTA, se présente aux urgences pour palpitations et dyspnée depuis 6h. FC à 142 bpm, irrégulière.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Flutter auriculaire à conduction variable",
      "C) Fibrillation auriculaire à réponse ventriculaire rapide",
      "D) Tachycardie atriale multifocale"
    ],
    correct: 2,
    explanation: "L'ECG montre un rythme irrégulièrement irrégulier avec des intervalles R-R variables, une absence totale d'ondes P organisées remplacées par une trémulation de la ligne de base (ondes f), et des complexes QRS fins. La fréquence ventriculaire est rapide (> 100 bpm). Il s'agit d'une fibrillation auriculaire à réponse rapide.",
    key_features: [
      "Rythme irrégulièrement irrégulier",
      "Absence d'ondes P identifiables",
      "Trémulation de la ligne de base (ondes f)",
      "Intervalles R-R variables",
      "FC > 100 bpm (réponse rapide)"
    ],
    tags: ["FA", "fibrillation", "auriculaire", "rapide"]
  },

  {
    id: "ecg-007",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-fibrillation-slow-1.jpg",
    image_alt: "fibrillation-auriculaire-lente",
    clinical_context: "Femme de 80 ans sous digoxine pour FA connue. FC à 52 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bradycardie sinusale",
      "B) BAV complet avec échappement jonctionnel",
      "C) Fibrillation auriculaire à réponse ventriculaire lente",
      "D) Rythme d'échappement ventriculaire"
    ],
    correct: 2,
    explanation: "L'ECG montre un rythme irrégulièrement irrégulier avec absence d'ondes P et trémulation de la ligne de base, caractéristique de la fibrillation auriculaire. La fréquence ventriculaire est lente (< 60 bpm), probablement en rapport avec le traitement par digoxine qui ralentit la conduction nodale AV. Les QRS sont fins.",
    key_features: [
      "Rythme irrégulier",
      "Absence d'ondes P",
      "Trémulation de la ligne de base",
      "FC < 60 bpm (réponse lente)",
      "Contexte de traitement digitalique"
    ],
    tags: ["FA", "fibrillation", "auriculaire", "lente", "digoxine"]
  },

  {
    id: "ecg-008",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-flutter-2to1-1.jpg",
    image_alt: "flutter-auriculaire-2-1",
    clinical_context: "Homme de 65 ans, BPCO, présente des palpitations à 150 bpm régulières. Il a déjà eu un épisode de flutter il y a 2 ans.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Flutter auriculaire avec conduction 2:1",
      "C) Tachycardie par réentrée nodale",
      "D) Tachycardie atriale focale"
    ],
    correct: 1,
    explanation: "L'ECG montre une tachycardie régulière à ~150 bpm. En regardant attentivement, on identifie des ondes F de flutter en dents de scie à ~300/min, particulièrement visibles en DII, DIII, aVF et V1. Avec une conduction 2:1, la fréquence ventriculaire est à 150 bpm. Toute tachycardie régulière à QRS fins à 150 bpm doit faire évoquer un flutter 2:1.",
    key_features: [
      "Tachycardie régulière à ~150 bpm",
      "Ondes F en dents de scie (300/min)",
      "Bien visibles en DII, DIII, aVF et V1",
      "Conduction AV 2:1",
      "Absence de retour à la ligne isoélectrique entre les ondes F"
    ],
    tags: ["flutter", "auriculaire", "2:1", "dents de scie"]
  },

  {
    id: "ecg-009",
    category: "arythmies_sv",
    difficulty: 2,
    image: "atrial-flutter-4to1-1.jpg",
    image_alt: "flutter-auriculaire-4-1",
    clinical_context: "Femme de 70 ans sous flécaïnide, consulte pour asthénie. FC à 75 bpm régulière.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme sinusal normal",
      "B) Flutter auriculaire avec conduction 4:1",
      "C) Tachycardie atriale avec bloc 4:1",
      "D) Bradycardie sinusale avec ondes U proéminentes"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme régulier à 75 bpm. On identifie entre chaque QRS des ondes F de flutter en dents de scie à ~300/min avec un ratio de conduction 4:1 (300/4 = 75 bpm). Les ondes F sont bien visibles en dérivations inférieures. Le traitement par flécaïnide peut organiser la FA en flutter et modifier le rapport de conduction.",
    key_features: [
      "Ondes F en dents de scie à ~300/min",
      "Conduction 4:1 (FC ~75 bpm)",
      "Rythme régulier",
      "QRS fins",
      "Ondes F entre les QRS bien visibles"
    ],
    tags: ["flutter", "auriculaire", "4:1"]
  },

  {
    id: "ecg-010",
    category: "arythmies_sv",
    difficulty: 2,
    image: "avnrt-svt-1.jpg",
    image_alt: "tachycardie-jonctionnelle-reentree-nodale",
    clinical_context: "Femme de 30 ans sans antécédents, épisode brutal de palpitations régulières à 180 bpm avec sensation de malaise. Résolution après manœuvres vagales.",
    question: "Quel est le diagnostic ECG le plus probable ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Tachycardie par réentrée nodale (TRIN)",
      "C) Flutter auriculaire 2:1",
      "D) Tachycardie ventriculaire"
    ],
    correct: 1,
    explanation: "L'ECG montre une tachycardie régulière à QRS fins à 180 bpm. Les ondes P ne sont pas visibles (elles sont noyées dans le QRS ou apparaissent comme une pseudo-onde S en DII ou pseudo-onde R' en V1). Le début et la fin brusques, la réponse aux manœuvres vagales et le profil de la patiente (femme jeune) orientent vers une tachycardie par réentrée intranodale (TRIN).",
    key_features: [
      "Tachycardie régulière à QRS fins",
      "FC 150-250 bpm",
      "Ondes P non visibles ou pseudo-R' en V1",
      "Début et fin brusques",
      "Sensible aux manœuvres vagales"
    ],
    tags: ["TSV", "TRIN", "réentrée", "nodale", "jonctionnelle"]
  },

  {
    id: "ecg-011",
    category: "arythmies_sv",
    difficulty: 3,
    image: "multifocal-atrial-tachycardia-1.jpg",
    image_alt: "tachycardie-atriale-multifocale",
    clinical_context: "Homme de 78 ans, BPCO sévère sous O2, hospitalisé pour exacerbation. FC irrégulière entre 110 et 130 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Fibrillation auriculaire",
      "B) Tachycardie atriale multifocale (TAM)",
      "C) Extrasystoles auriculaires fréquentes",
      "D) Flutter auriculaire à conduction variable"
    ],
    correct: 1,
    explanation: "L'ECG montre une tachycardie irrégulière avec au moins 3 morphologies différentes d'ondes P, des intervalles P-P, P-R et R-R variables, et une ligne de base isoélectrique entre les ondes P (ce qui la distingue de la FA). La TAM est fréquemment associée aux pathologies pulmonaires sévères, à l'hypoxie et aux troubles métaboliques.",
    key_features: [
      "≥ 3 morphologies différentes d'ondes P",
      "Intervalles P-P variables",
      "Intervalles P-R variables",
      "FC > 100 bpm",
      "Ligne isoélectrique entre les ondes P (≠ FA)"
    ],
    tags: ["TAM", "multifocale", "BPCO", "irrégulier"]
  },

  {
    id: "ecg-012",
    category: "arythmies_sv",
    difficulty: 1,
    image: "premature-atrial-complex-1.jpg",
    image_alt: "extrasystoles-auriculaires",
    clinical_context: "Femme de 55 ans, consulte pour sensation de « cœur qui saute des battements ». Bilan thyroïdien normal.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Extrasystoles ventriculaires",
      "B) BAV du 2e degré Mobitz I",
      "C) Extrasystoles auriculaires (ESA)",
      "D) Arythmie sinusale respiratoire"
    ],
    correct: 2,
    explanation: "L'ECG montre un rythme sinusal de base avec des battements prématurés précédés d'une onde P' de morphologie différente de l'onde P sinusale. Les QRS des ESA sont fins et suivis d'une pause compensatrice incomplète. Les ESA sont des battements supra-ventriculaires prématurés nés dans les oreillettes en dehors du nœud sinusal.",
    key_features: [
      "Battements prématurés",
      "Onde P' de morphologie différente avant le QRS prématuré",
      "QRS fins (sauf si conduction aberrante)",
      "Pause compensatrice incomplète",
      "Rythme sinusal de base"
    ],
    tags: ["ESA", "extrasystole", "auriculaire", "prématuré"]
  },

  {
    id: "ecg-013",
    category: "arythmies_sv",
    difficulty: 3,
    image: "wpw-orthodromic-svt-1.jpg",
    image_alt: "wpw-tachycardie-orthodromique",
    clinical_context: "Homme de 22 ans, épisode de tachycardie régulière à 200 bpm avec QRS fins. ECG de base : PR court avec onde delta connu.",
    question: "Quel est le mécanisme le plus probable de cette tachycardie ?",
    options: [
      "A) Tachycardie par réentrée nodale (TRIN)",
      "B) Tachycardie orthodromique sur WPW",
      "C) Tachycardie antidromique sur WPW",
      "D) Flutter auriculaire 2:1"
    ],
    correct: 1,
    explanation: "Chez un patient avec syndrome de WPW connu (PR court + onde delta au repos), une tachycardie régulière à QRS fins correspond à une tachycardie orthodromique. Le circuit descend par la voie normale (nœud AV → His → ventricules → QRS fins) et remonte par la voie accessoire. L'onde delta disparaît pendant la tachycardie car la conduction antérograde passe uniquement par le nœud AV.",
    key_features: [
      "Tachycardie régulière à QRS fins",
      "Antécédent de WPW (PR court, onde delta)",
      "Onde P rétrograde visible après le QRS",
      "FC 150-250 bpm",
      "Onde delta absente pendant la tachycardie"
    ],
    tags: ["WPW", "orthodromique", "voie accessoire", "réentrée"]
  },

  {
    id: "ecg-014",
    category: "arythmies_sv",
    difficulty: 3,
    image: "wpw-atrial-fibrillation-1.jpg",
    image_alt: "fibrillation-auriculaire-sur-wpw",
    clinical_context: "Homme de 28 ans, WPW connu, amené par le SAMU pour tachycardie irrégulière à QRS larges. FC entre 180 et 280 bpm. PA 90/60.",
    question: "Quel est le diagnostic ECG et quel traitement est CONTRE-INDIQUÉ ?",
    options: [
      "A) TV polymorphe – contre-indication : amiodarone",
      "B) FA sur WPW – contre-indication : inhibiteurs calciques et digoxine",
      "C) FA à QRS larges sur BBG – contre-indication : adénosine",
      "D) Torsade de pointes – contre-indication : magnésium"
    ],
    correct: 1,
    explanation: "L'ECG montre une tachycardie irrégulière à QRS larges avec des variations de morphologie du QRS (pré-excitation variable). Chez un patient WPW, c'est une FA conduite par la voie accessoire, situation DANGEREUSE. Les inhibiteurs du nœud AV (digoxine, vérapamil, adénosine) sont CONTRE-INDIQUÉS car ils favorisent la conduction par la voie accessoire et peuvent déclencher une FV. Traitement : cardioversion si instable, procaïnamide ou ibutilide si stable.",
    key_features: [
      "Tachycardie irrégulière à QRS larges",
      "Fréquence très rapide (> 200 bpm possible)",
      "Morphologie QRS variable (pré-excitation variable)",
      "Antécédent de WPW",
      "CONTRE-INDICATION absolue aux freinateurs nodaux"
    ],
    tags: ["WPW", "FA", "pré-excitation", "urgence", "voie accessoire"]
  },

  {
    id: "ecg-015",
    category: "arythmies_sv",
    difficulty: 2,
    image: "focal-atrial-tachycardia-1.jpg",
    image_alt: "tachycardie-atriale-focale",
    clinical_context: "Femme de 60 ans, sans antécédents cardiaques, présente des épisodes récurrents de tachycardie à 160 bpm avec des ondes P visibles de morphologie différente du sinusal.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie sinusale",
      "B) Tachycardie atriale focale",
      "C) Flutter auriculaire atypique",
      "D) Tachycardie par réentrée nodale"
    ],
    correct: 1,
    explanation: "L'ECG montre une tachycardie régulière à QRS fins avec des ondes P' visibles mais de morphologie différente de l'onde P sinusale. La ligne de base isoélectrique est présente entre les ondes P'. Le rapport P:QRS est habituellement 1:1. La tachycardie atriale focale naît d'un foyer ectopique auriculaire unique et se distingue de la TRIN par la visibilité des ondes P' et de la TAM par la morphologie unique des P'.",
    key_features: [
      "Tachycardie régulière à QRS fins",
      "Ondes P' de morphologie unique non sinusale",
      "Ligne isoélectrique entre les ondes P'",
      "FC 100-250 bpm",
      "Warm-up et cool-down progressifs"
    ],
    tags: ["tachycardie", "atriale", "focale", "ectopique"]
  },

  // =====================================================
  // CATÉGORIE : arythmies_v (8 questions)
  // =====================================================

  {
    id: "ecg-016",
    category: "arythmies_v",
    difficulty: 2,
    image: "ventricular-tachycardia-monomorphic-1.jpg",
    image_alt: "tachycardie-ventriculaire-monomorphe",
    clinical_context: "Homme de 62 ans, antécédent d'infarctus du myocarde il y a 5 ans, amené par le SAMU pour malaise avec tachycardie régulière à QRS larges à 180 bpm. PA 85/55.",
    question: "Quel est le diagnostic ECG le plus probable ?",
    options: [
      "A) TSV avec bloc de branche fonctionnel",
      "B) Tachycardie ventriculaire monomorphe",
      "C) FA sur WPW",
      "D) Tachycardie antidromique"
    ],
    correct: 1,
    explanation: "L'ECG montre une tachycardie régulière à QRS larges (> 120 ms) et monomorphes à 180 bpm. Chez un patient avec cardiopathie ischémique connue, toute tachycardie à QRS larges doit être considérée comme une TV jusqu'à preuve du contraire. Les critères de Brugada aident au diagnostic différentiel : concordance en précordiales, dissociation AV, captures ou fusions.",
    key_features: [
      "Tachycardie régulière à QRS larges (> 120 ms)",
      "Morphologie QRS constante (monomorphe)",
      "FC 120-250 bpm",
      "Dissociation auriculo-ventriculaire",
      "Cardiopathie sous-jacente connue"
    ],
    tags: ["TV", "ventriculaire", "monomorphe", "QRS larges"]
  },

  {
    id: "ecg-017",
    category: "arythmies_v",
    difficulty: 3,
    image: "polymorphic-ventricular-tachycardia-1.jpg",
    image_alt: "tachycardie-ventriculaire-polymorphe",
    clinical_context: "Femme de 55 ans, IDM en cours avec sus-décalage ST en antérieur, présente brutalement une tachycardie à QRS larges avec changement d'axe et de morphologie.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Torsade de pointes",
      "B) TV monomorphe",
      "C) TV polymorphe",
      "D) Fibrillation ventriculaire"
    ],
    correct: 2,
    explanation: "L'ECG montre une tachycardie à QRS larges avec des changements continuels de morphologie et d'axe du QRS. Contrairement aux torsades de pointes, le QT de base est normal et il n'y a pas d'aspect en fuseau typique. La TV polymorphe survient souvent dans le contexte d'ischémie aiguë. C'est une urgence avec risque de dégénération en FV.",
    key_features: [
      "QRS larges avec morphologie changeante",
      "Axe QRS variable",
      "QT de base normal (≠ torsade de pointes)",
      "Contexte d'ischémie aiguë",
      "Risque de dégénération en FV"
    ],
    tags: ["TV", "polymorphe", "ischémie", "urgence"]
  },

  {
    id: "ecg-018",
    category: "arythmies_v",
    difficulty: 3,
    image: "torsades-de-pointes-1.jpg",
    image_alt: "torsades-de-pointes",
    clinical_context: "Femme de 70 ans sous sotalol et amiodarone, trouvée inconsciente. QTc de base mesuré à 580 ms. Le tracé montre une tachycardie à QRS larges avec aspect en fuseau.",
    question: "Quel est le diagnostic ECG et le traitement de première intention ?",
    options: [
      "A) TV polymorphe – amiodarone IV",
      "B) Torsade de pointes – magnésium IV",
      "C) FV – choc électrique immédiat",
      "D) TV monomorphe – lidocaïne IV"
    ],
    correct: 1,
    explanation: "L'ECG montre une tachycardie à QRS larges avec un aspect en fuseau caractéristique : l'amplitude des QRS augmente puis diminue de façon cyclique autour de la ligne de base (twisting of the points). Le QT allongé de base (580 ms) et les médicaments allongeant le QT confirment le diagnostic de torsade de pointes. Le traitement de première intention est le magnésium IV (2g en 10 min). L'amiodarone est CONTRE-INDIQUÉE car elle allonge encore le QT.",
    key_features: [
      "Aspect en fuseau (torsion autour de la ligne de base)",
      "QT allongé de base (QTc > 500 ms)",
      "Variation cyclique de l'amplitude des QRS",
      "Médicaments allongeant le QT",
      "Traitement : magnésium IV, accélération de la FC"
    ],
    tags: ["torsade", "QT long", "magnésium", "urgence"]
  },

  {
    id: "ecg-019",
    category: "arythmies_v",
    difficulty: 2,
    image: "ventricular-fibrillation-coarse-1.jpg",
    image_alt: "fibrillation-ventriculaire-grossiere",
    clinical_context: "Homme de 58 ans, arrêt cardiaque sur la voie publique. Le défibrillateur semi-automatique détecte un rythme choquable.",
    question: "Quel est le rythme identifié sur le scope ?",
    options: [
      "A) Tachycardie ventriculaire sans pouls",
      "B) Fibrillation ventriculaire à grosses mailles",
      "C) Artéfacts de mouvement",
      "D) Torsade de pointes"
    ],
    correct: 1,
    explanation: "Le tracé montre une activité électrique chaotique, désorganisée, sans QRS identifiables, sans rythme organisé. Les déflexions sont de grande amplitude (grosses mailles), ce qui la distingue de la FV à fines mailles. C'est un rythme choquable : la défibrillation immédiate est le traitement. La FV à grosses mailles répond généralement mieux au choc que la FV à fines mailles.",
    key_features: [
      "Activité électrique chaotique et désorganisée",
      "Aucun QRS identifiable",
      "Déflexions de grande amplitude (grosses mailles)",
      "Rythme choquable",
      "Traitement : défibrillation immédiate"
    ],
    tags: ["FV", "fibrillation", "ventriculaire", "arrêt", "choquable"]
  },

  {
    id: "ecg-020",
    category: "arythmies_v",
    difficulty: 2,
    image: "ventricular-fibrillation-fine-1.jpg",
    image_alt: "fibrillation-ventriculaire-fine",
    clinical_context: "Femme de 75 ans, arrêt cardiaque intra-hospitalier depuis 8 minutes. Le tracé montre une ligne oscillante de faible amplitude.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Asystolie",
      "B) Fibrillation ventriculaire à fines mailles",
      "C) Artéfact de mouvement",
      "D) Rythme agonique"
    ],
    correct: 1,
    explanation: "Le tracé montre une activité électrique désorganisée mais de faible amplitude (fines mailles). Il faut la distinguer de l'asystolie (ligne plate) en vérifiant dans 2 dérivations et en augmentant le gain. La FV fine a un pronostic moins bon que la FV grossière et peut évoluer vers l'asystolie. Elle reste un rythme choquable nécessitant une défibrillation, mais un traitement par adrénaline peut augmenter l'amplitude avant le choc.",
    key_features: [
      "Activité désorganisée de faible amplitude",
      "Pas de QRS identifiables",
      "Distinction avec asystolie : vérifier en 2 dérivations",
      "Rythme choquable",
      "Pronostic moins bon que FV grossière"
    ],
    tags: ["FV", "fibrillation", "ventriculaire", "fine", "arrêt"]
  },

  {
    id: "ecg-021",
    category: "arythmies_v",
    difficulty: 2,
    image: "accelerated-idioventricular-rhythm-1.jpg",
    image_alt: "riva-rythme-idioventriculaire-accelere",
    clinical_context: "Homme de 55 ans, STEMI inférieur traité par angioplastie primaire il y a 30 minutes. Apparition d'un rythme régulier à QRS larges à 75 bpm. Patient asymptomatique, hémodynamiquement stable.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) TV monomorphe lente",
      "B) Rythme d'échappement ventriculaire",
      "C) RIVA (rythme idioventriculaire accéléré)",
      "D) BBG complet"
    ],
    correct: 2,
    explanation: "L'ECG montre un rythme régulier à QRS larges à 75 bpm. Le RIVA est défini par une fréquence entre 40 et 120 bpm, issue d'un foyer ventriculaire. Dans le contexte post-reperfusion (après angioplastie pour STEMI), c'est un signe de reperfusion, généralement bénin et autolimitatif. Il ne nécessite habituellement pas de traitement.",
    key_features: [
      "QRS larges et réguliers",
      "FC entre 40 et 120 bpm",
      "Contexte de reperfusion coronaire",
      "Tolérance hémodynamique",
      "Transitoire et autolimitatif"
    ],
    tags: ["RIVA", "idioventriculaire", "reperfusion", "bénin"]
  },

  {
    id: "ecg-022",
    category: "arythmies_v",
    difficulty: 1,
    image: "premature-ventricular-complex-1.jpg",
    image_alt: "extrasystoles-ventriculaires-isolees",
    clinical_context: "Homme de 45 ans, stress professionnel, consulte pour palpitations. L'ECG montre des complexes larges intermittents.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Extrasystoles auriculaires conduites en aberrance",
      "B) Extrasystoles ventriculaires (ESV) isolées",
      "C) Pré-excitation intermittente (WPW)",
      "D) Artefact de mouvement"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme sinusal de base avec des battements prématurés à QRS larges (> 120 ms), non précédés d'onde P, avec une morphologie de bloc de branche et une pause compensatrice complète. Ce sont des extrasystoles ventriculaires isolées. Chez un patient sans cardiopathie structurelle et avec un faible nombre d'ESV, le pronostic est bon.",
    key_features: [
      "Battement prématuré à QRS large (> 120 ms)",
      "Pas d'onde P avant le QRS prématuré",
      "Pause compensatrice complète",
      "Morphologie de type bloc de branche",
      "Onde T de polarité opposée au QRS"
    ],
    tags: ["ESV", "extrasystole", "ventriculaire", "isolée"]
  },

  {
    id: "ecg-023",
    category: "arythmies_v",
    difficulty: 2,
    image: "ventricular-bigeminy-1.jpg",
    image_alt: "bigeminisme-ventriculaire",
    clinical_context: "Femme de 68 ans, insuffisance cardiaque, sous digoxine. L'ECG montre une alternance régulière de complexes normaux et larges.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) BAV du 2e degré Mobitz II avec BBG",
      "B) Bigéminisme ventriculaire",
      "C) Rythme sinusal alternant avec ESA",
      "D) Parasystolie ventriculaire"
    ],
    correct: 1,
    explanation: "L'ECG montre une alternance régulière : chaque battement sinusal est suivi d'une ESV (1 sinusal + 1 ESV = bigéminisme). Les ESV sont prématurées, à QRS larges, sans onde P précédente, avec une pause compensatrice. Le bigéminisme peut être favorisé par la digoxine, l'hypokaliémie ou une cardiopathie sous-jacente. Si le pouls est pris au poignet, on ne perçoit que les battements sinusaux (pouls à la moitié de la FC sur l'ECG).",
    key_features: [
      "Alternance régulière : sinusal – ESV – sinusal – ESV",
      "ESV à QRS larges sans onde P",
      "Couplage fixe des ESV",
      "Pause compensatrice après chaque ESV",
      "Contexte : digoxine, hypokaliémie"
    ],
    tags: ["bigéminisme", "ESV", "ventriculaire", "digoxine"]
  },

  // =====================================================
  // CATÉGORIE : blocs (10 questions)
  // =====================================================

  {
    id: "ecg-024",
    category: "blocs",
    difficulty: 1,
    image: "first-degree-heart-block-1.jpg",
    image_alt: "bav-premier-degre",
    clinical_context: "Homme de 55 ans, sous bêtabloquant pour HTA. ECG de contrôle : PR mesuré à 240 ms.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Rythme sinusal normal",
      "B) BAV du 1er degré",
      "C) BAV du 2e degré Mobitz I",
      "D) Pré-excitation ventriculaire (WPW)"
    ],
    correct: 1,
    explanation: "L'ECG montre un rythme sinusal avec un allongement constant de l'intervalle PR au-delà de 200 ms (ici 240 ms). Toutes les ondes P sont suivies d'un QRS (pas de blocage). C'est un BAV du 1er degré. Il est souvent bénin, fréquemment iatrogène (bêtabloquants, inhibiteurs calciques, digoxine). Aucun traitement spécifique n'est nécessaire si le patient est asymptomatique.",
    key_features: [
      "PR > 200 ms (allongé)",
      "PR constant d'un battement à l'autre",
      "Chaque onde P est suivie d'un QRS",
      "Rythme sinusal régulier",
      "Souvent iatrogène"
    ],
    tags: ["BAV", "1er degré", "PR long"]
  },

  {
    id: "ecg-025",
    category: "blocs",
    difficulty: 2,
    image: "second-degree-heart-block-type1-wenckebach-1.jpg",
    image_alt: "bav-2-mobitz-1-wenckebach",
    clinical_context: "Jeune homme de 20 ans, sportif, ECG réalisé lors d'un bilan après un malaise vagal. On note un allongement progressif du PR puis une onde P bloquée.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) BAV du 1er degré",
      "B) BAV du 2e degré Mobitz I (Wenckebach)",
      "C) BAV du 2e degré Mobitz II",
      "D) BAV du 3e degré"
    ],
    correct: 1,
    explanation: "L'ECG montre un allongement progressif de l'intervalle PR à chaque battement, jusqu'au blocage d'une onde P (onde P non suivie de QRS), puis le cycle recommence. C'est le phénomène de Wenckebach, caractéristique du BAV 2e degré Mobitz I. Ce type de bloc est supra-hissien (au niveau du nœud AV), souvent bénin, surtout chez le sportif, et réversible.",
    key_features: [
      "Allongement progressif du PR",
      "Blocage d'une onde P (P sans QRS)",
      "Raccourcissement du PR après la pause",
      "Raccourcissement progressif des intervalles R-R avant le blocage",
      "Bloc supra-hissien, souvent bénin"
    ],
    tags: ["BAV", "2e degré", "Mobitz I", "Wenckebach"]
  },

  {
    id: "ecg-026",
    category: "blocs",
    difficulty: 2,
    image: "second-degree-heart-block-type2-1.jpg",
    image_alt: "bav-2-mobitz-2",
    clinical_context: "Femme de 78 ans, syncope à l'emporte-pièce. ECG : onde P bloquée intermittente avec PR constant pour les battements conduits.",
    question: "Quel est le diagnostic ECG et quel est le risque principal ?",
    options: [
      "A) BAV 2e degré Mobitz I – risque faible",
      "B) BAV 2e degré Mobitz II – risque de progression en BAV complet",
      "C) BAV 2:1 – bénin",
      "D) Dysfonction sinusale – risque d'asystolie"
    ],
    correct: 1,
    explanation: "L'ECG montre des ondes P bloquées de façon intermittente mais avec un intervalle PR CONSTANT pour les battements conduits (pas d'allongement progressif). C'est un BAV du 2e degré Mobitz II. Ce type de bloc est infra-hissien (au niveau du faisceau de His ou des branches), plus grave que le Mobitz I, avec un risque significatif de progression vers le BAV complet. Il représente une indication de stimulateur cardiaque.",
    key_features: [
      "PR constant pour les battements conduits",
      "Blocage soudain d'ondes P sans allongement préalable du PR",
      "QRS souvent larges (bloc infra-hissien)",
      "Risque de BAV complet",
      "Indication de pacemaker"
    ],
    tags: ["BAV", "2e degré", "Mobitz II", "pacemaker"]
  },

  {
    id: "ecg-027",
    category: "blocs",
    difficulty: 2,
    image: "third-degree-heart-block-1.jpg",
    image_alt: "bav-3-complet",
    clinical_context: "Homme de 82 ans, trouvé au sol après une syncope. FC à 35 bpm. PA 80/50. ECG : dissociation entre ondes P à 80/min et QRS larges à 35/min.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) BAV du 2e degré Mobitz II avancé",
      "B) BAV du 3e degré (complet)",
      "C) Bradycardie sinusale sévère",
      "D) Dysfonction sinusale avec échappement ventriculaire"
    ],
    correct: 1,
    explanation: "L'ECG montre une dissociation auriculo-ventriculaire complète : les ondes P marchent à leur rythme (~80/min) et les QRS marchent au leur (~35/min), sans aucune relation entre les deux. Les QRS sont larges, indiquant un rythme d'échappement ventriculaire bas situé. C'est un BAV complet, urgence nécessitant une sonde d'entraînement électrosystolique temporaire puis un pacemaker définitif.",
    key_features: [
      "Dissociation AV complète",
      "Fréquence auriculaire > fréquence ventriculaire",
      "Intervalles P-P réguliers, R-R réguliers, mais indépendants",
      "QRS larges (échappement ventriculaire)",
      "Urgence : pacemaker temporaire puis définitif"
    ],
    tags: ["BAV", "3e degré", "complet", "dissociation", "pacemaker"]
  },

  {
    id: "ecg-028",
    category: "blocs",
    difficulty: 2,
    image: "right-bundle-branch-block-1.jpg",
    image_alt: "bloc-de-branche-droit-complet",
    clinical_context: "Homme de 60 ans, découverte fortuite d'un QRS large à 140 ms lors d'un bilan préopératoire.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche gauche complet",
      "B) Bloc de branche droit complet",
      "C) Hémibloc antérieur gauche",
      "D) Pré-excitation ventriculaire"
    ],
    correct: 1,
    explanation: "L'ECG montre un QRS > 120 ms avec un aspect rsR' (oreilles de lapin) en V1-V2 et une onde S large et traînante en V5-V6 et DI. L'axe est généralement normal ou dévié à droite. Le BBD complet isolé est souvent bénin et peut être trouvé chez des sujets sans cardiopathie. Il ne modifie pas l'interprétation du segment ST en V1-V3.",
    key_features: [
      "QRS ≥ 120 ms",
      "rsR' en V1-V2 (oreilles de lapin)",
      "Onde S large et traînante en DI, V5-V6",
      "Repolarisation secondaire (T inversée en V1-V3)",
      "Axe normal ou déviation axiale droite"
    ],
    tags: ["BBD", "bloc", "branche", "droit"]
  },

  {
    id: "ecg-029",
    category: "blocs",
    difficulty: 2,
    image: "left-bundle-branch-block-1.jpg",
    image_alt: "bloc-de-branche-gauche-complet",
    clinical_context: "Femme de 72 ans, insuffisance cardiaque connue, FEVG à 30%. QRS mesuré à 160 ms.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Bloc de branche droit complet",
      "B) Bloc de branche gauche complet",
      "C) WPW",
      "D) Rythme ventriculaire"
    ],
    correct: 1,
    explanation: "L'ECG montre un QRS > 120 ms avec un aspect QS ou rS en V1, une onde R large et crochetée (aspect en M) en V5-V6 et DI, et une absence d'onde Q septale en DI et V5-V6. Le BBG complet est souvent associé à une cardiopathie sous-jacente (ischémique, dilatée). Il rend l'interprétation du segment ST impossible (critères de Sgarbossa si suspicion d'IDM).",
    key_features: [
      "QRS ≥ 120 ms",
      "Aspect QS ou rS en V1",
      "R large, crochetée en DI, aVL, V5-V6",
      "Absence d'onde Q septale en V5-V6",
      "Interprétation ST difficile (critères de Sgarbossa)"
    ],
    tags: ["BBG", "bloc", "branche", "gauche"]
  },

  {
    id: "ecg-030",
    category: "blocs",
    difficulty: 2,
    image: "left-anterior-fascicular-block-1.jpg",
    image_alt: "hemibloc-anterieur-gauche",
    clinical_context: "Homme de 70 ans, HTA. ECG : déviation axiale gauche marquée avec QRS fins.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) BBG complet",
      "B) Hémibloc antérieur gauche (HBAG)",
      "C) HVG",
      "D) Infarctus latéral ancien"
    ],
    correct: 1,
    explanation: "L'ECG montre une déviation axiale gauche au-delà de -45° avec des QRS fins (< 120 ms). On observe un aspect qR en DI et aVL et un aspect rS en DII, DIII et aVF. Le QRS est < 120 ms car seul le fascicule antérieur gauche est bloqué. L'HBAG est le trouble de conduction intraventriculaire le plus fréquent.",
    key_features: [
      "Déviation axiale gauche (au-delà de -45°)",
      "QRS < 120 ms",
      "qR en DI et aVL",
      "rS en DII, DIII, aVF",
      "Trouble de conduction le plus fréquent"
    ],
    tags: ["HBAG", "hémibloc", "antérieur", "axe gauche"]
  },

  {
    id: "ecg-031",
    category: "blocs",
    difficulty: 3,
    image: "bifascicular-block-rbbb-lahb-1.jpg",
    image_alt: "bloc-bifasciculaire-bbd-hbag",
    clinical_context: "Homme de 75 ans, syncopes récidivantes. ECG : QRS larges avec morphologie de BBD et axe hypergauche.",
    question: "Quel est le diagnostic ECG et quelle est la conduite à tenir ?",
    options: [
      "A) BBD isolé – surveillance simple",
      "B) BBG complet – resynchronisation cardiaque",
      "C) Bloc bifasciculaire (BBD + HBAG) – risque de BAV complet, discuter pacemaker",
      "D) BBD + infarctus inférieur ancien – coronarographie"
    ],
    correct: 2,
    explanation: "L'ECG montre un BBD complet (rsR' en V1, S large en V5-V6, QRS > 120 ms) associé à un HBAG (déviation axiale gauche au-delà de -45°, qR en DI/aVL, rS en DII/DIII/aVF). C'est un bloc bifasciculaire. Chez un patient avec syncopes, cela suggère un BAV paroxystique (le troisième fascicule lâche par intermittence). Une exploration électrophysiologique et souvent un pacemaker sont indiqués.",
    key_features: [
      "BBD : rsR' en V1, QRS > 120 ms",
      "HBAG : axe au-delà de -45°",
      "Combinaison = bloc bifasciculaire",
      "Syncopes : risque de BAV paroxystique",
      "Indication d'exploration électrophysiologique"
    ],
    tags: ["bifasciculaire", "BBD", "HBAG", "syncope", "pacemaker"]
  },

  {
    id: "ecg-032",
    category: "blocs",
    difficulty: 3,
    image: "second-degree-heart-block-2to1-1.jpg",
    image_alt: "bav-2-1",
    clinical_context: "Femme de 80 ans, malaises à répétition. ECG : une onde P conduite sur deux, PR constant pour les battements conduits, QRS fins.",
    question: "Quel est le diagnostic ECG et comment le classer ?",
    options: [
      "A) BAV 2e degré Mobitz I",
      "B) BAV 2e degré Mobitz II",
      "C) BAV 2:1 – impossible de déterminer Mobitz I ou II sur ce seul tracé",
      "D) BAV complet"
    ],
    correct: 2,
    explanation: "L'ECG montre un BAV 2:1 : une onde P sur deux est conduite. Le problème est qu'on ne peut pas classer ce bloc en Mobitz I ou Mobitz II car on n'a jamais deux battements conduits consécutifs pour évaluer si le PR s'allonge progressivement. Des indices orientent : QRS fins → plutôt Mobitz I (nodal) ; QRS larges → plutôt Mobitz II (infra-nodal). Un enregistrement plus long ou une épreuve à l'atropine peuvent aider.",
    key_features: [
      "Conduction 2:1 (une P sur deux bloquée)",
      "PR constant pour les battements conduits",
      "Impossible de classer en Mobitz I ou II",
      "QRS fins → probable Mobitz I (nodal)",
      "QRS larges → probable Mobitz II (infra-nodal)"
    ],
    tags: ["BAV", "2:1", "indéterminé"]
  },

  {
    id: "ecg-033",
    category: "blocs",
    difficulty: 2,
    image: "sinus-node-dysfunction-pause-1.jpg",
    image_alt: "dysfonction-sinusale-pause",
    clinical_context: "Homme de 85 ans, malaises lipothymiques. Le Holter montre des pauses sinusales de 4 secondes.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) BAV du 2e degré avec pauses",
      "B) Dysfonction sinusale avec pause sinusale",
      "C) ESA bloquées",
      "D) Fibrillation auriculaire à réponse lente"
    ],
    correct: 1,
    explanation: "Le tracé montre un rythme sinusal interrompu par des pauses prolongées (> 3 secondes) sans activité atriale ni ventriculaire. Il n'y a pas d'ondes P bloquées (ce qui exclurait un BAV). Le nœud sinusal cesse transitoirement de fonctionner. C'est une dysfonction sinusale (maladie du sinus) qui, lorsqu'elle est symptomatique avec des pauses > 3 sec, constitue une indication de stimulateur cardiaque.",
    key_features: [
      "Pause sinusale > 3 secondes",
      "Absence d'activité atriale pendant la pause",
      "Pas d'ondes P bloquées (≠ BAV)",
      "Rythme sinusal normal entre les pauses",
      "Indication de pacemaker si symptomatique"
    ],
    tags: ["dysfonction", "sinusale", "pause", "maladie du sinus"]
  },

  // =====================================================
  // CATÉGORIE : ischemie (10 questions)
  // =====================================================

  {
    id: "ecg-034",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-anterior-1.jpg",
    image_alt: "stemi-anterieur",
    clinical_context: "Homme de 58 ans, fumeur, douleur thoracique rétrosternale constrictive depuis 2h irradiant au bras gauche. Troponine en cours.",
    question: "Quel est le diagnostic ECG et le territoire atteint ?",
    options: [
      "A) STEMI inférieur – coronaire droite",
      "B) STEMI antérieur – artère interventriculaire antérieure (IVA)",
      "C) Péricardite aiguë",
      "D) Repolarisation précoce"
    ],
    correct: 1,
    explanation: "L'ECG montre un sus-décalage du segment ST convexe vers le haut en V1-V4 avec des images en miroir (sous-décalage ST) en dérivations inférieures (DII, DIII, aVF). Le territoire antérieur correspond à l'artère IVA. C'est un STEMI antérieur, urgence absolue nécessitant une reperfusion immédiate (angioplastie primaire < 90 min ou fibrinolyse < 30 min).",
    key_features: [
      "Sus-décalage ST convexe en V1-V4",
      "Images en miroir en inférieur",
      "Territoire IVA (artère interventriculaire antérieure)",
      "Douleur thoracique typique",
      "Urgence : reperfusion immédiate"
    ],
    tags: ["STEMI", "antérieur", "IVA", "urgence"]
  },

  {
    id: "ecg-035",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-inferior-1.jpg",
    image_alt: "stemi-inferieur",
    clinical_context: "Homme de 65 ans, douleur épigastrique intense avec sueurs et nausées depuis 1h. PA 90/60, bradycardie à 50 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur étendu",
      "B) STEMI inférieur",
      "C) Embolie pulmonaire massive",
      "D) Péricardite avec tamponnade"
    ],
    correct: 1,
    explanation: "L'ECG montre un sus-décalage du segment ST en DII, DIII et aVF (territoire inférieur) avec des images en miroir (sous-décalage ST) en DI et aVL. Le territoire inférieur est vascularisé par la coronaire droite (80%) ou la circonflexe (20%). L'association bradycardie + hypotension est classique dans l'infarctus inférieur (réflexe de Bezold-Jarisch). Il faut systématiquement rechercher l'extension au VD (V3R, V4R).",
    key_features: [
      "Sus-décalage ST en DII, DIII, aVF",
      "Miroir en DI et aVL",
      "Coronaire droite (80%) ou circonflexe (20%)",
      "Bradycardie + hypotension fréquentes",
      "Rechercher extension au ventricule droit (V4R)"
    ],
    tags: ["STEMI", "inférieur", "coronaire droite"]
  },

  {
    id: "ecg-036",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-lateral-1.jpg",
    image_alt: "stemi-lateral",
    clinical_context: "Femme de 70 ans, diabétique, douleur thoracique latérale gauche depuis 3h avec dyspnée.",
    question: "Quel est le diagnostic ECG et quel territoire est concerné ?",
    options: [
      "A) STEMI antérieur",
      "B) STEMI latéral – artère circonflexe",
      "C) STEMI inférieur",
      "D) HVG avec surcharge"
    ],
    correct: 1,
    explanation: "L'ECG montre un sus-décalage du segment ST en DI, aVL, V5 et V6 (territoire latéral) avec des images en miroir en dérivations inférieures (DIII, aVF). Le territoire latéral est vascularisé par l'artère circonflexe ou les diagonales. Le STEMI latéral isolé est moins fréquent que l'antérieur ou l'inférieur. Attention : chez les diabétiques, la douleur peut être atypique.",
    key_features: [
      "Sus-décalage ST en DI, aVL, V5, V6",
      "Miroir en dérivations inférieures (DIII, aVF)",
      "Artère circonflexe ou diagonales",
      "Territoire latéral",
      "Urgence de reperfusion"
    ],
    tags: ["STEMI", "latéral", "circonflexe"]
  },

  {
    id: "ecg-037",
    category: "ischemie",
    difficulty: 3,
    image: "posterior-stemi-1.jpg",
    image_alt: "stemi-posterieur",
    clinical_context: "Homme de 60 ans, douleur thoracique intense. ECG standard : sous-décalage ST en V1-V3 avec ondes R amples en V1-V2. Miroir d'un sus-décalage postérieur.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Ischémie sous-endocardique antérieure",
      "B) STEMI postérieur (image en miroir en V1-V3)",
      "C) HVD",
      "D) BBD incomplet"
    ],
    correct: 1,
    explanation: "L'ECG montre un sous-décalage ST en V1-V3 avec des ondes R amples et des ondes T positives dans ces mêmes dérivations. Ce pattern est l'image en miroir d'un STEMI postérieur. Pour le confirmer, il faut réaliser les dérivations postérieures (V7-V9) qui montreront un sus-décalage ST. Le STEMI postérieur est souvent associé au STEMI inférieur et correspond au territoire de la coronaire droite ou de la circonflexe.",
    key_features: [
      "Sous-décalage ST en V1-V3 (image miroir)",
      "Ondes R amples en V1-V2",
      "Ondes T positives en V1-V3",
      "Confirmation par V7-V9 (sus-décalage ST)",
      "Coronaire droite ou circonflexe"
    ],
    tags: ["STEMI", "postérieur", "miroir", "V7-V9"]
  },

  {
    id: "ecg-038",
    category: "ischemie",
    difficulty: 2,
    image: "subendocardial-ischemia-st-depression-1.jpg",
    image_alt: "ischemie-sous-endocardique",
    clinical_context: "Femme de 75 ans, douleur thoracique au repos depuis 30 minutes. Troponine élevée. ECG : sous-décalage ST diffus.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI en évolution",
      "B) Ischémie sous-endocardique (NSTEMI/SCA ST-)",
      "C) Effet digitalique",
      "D) Hypokaliémie"
    ],
    correct: 1,
    explanation: "L'ECG montre un sous-décalage horizontal ou descendant du segment ST ≥ 1 mm dans plusieurs dérivations. En contexte de douleur thoracique avec troponine élevée, c'est un SCA sans sus-décalage ST (NSTEMI). Le sous-décalage ST reflète une ischémie sous-endocardique. Si le sous-décalage est diffus avec sus-décalage en aVR, suspecter une atteinte du tronc commun ou tritronculaire.",
    key_features: [
      "Sous-décalage ST ≥ 1 mm horizontal ou descendant",
      "Diffus, dans plusieurs territoires",
      "Troponine élevée = NSTEMI",
      "Sous-décalage + sus-décalage en aVR = tronc commun ?",
      "Pas de sus-décalage ST (sauf aVR)"
    ],
    tags: ["NSTEMI", "ischémie", "sous-endocardique", "ST-"]
  },

  {
    id: "ecg-039",
    category: "ischemie",
    difficulty: 2,
    image: "pathological-q-waves-1.jpg",
    image_alt: "ondes-q-de-necrose",
    clinical_context: "Homme de 68 ans, antécédent d'IDM antérieur il y a 3 mois. ECG de contrôle montrant des ondes Q profondes en V1-V4.",
    question: "Que signifient ces anomalies ECG ?",
    options: [
      "A) STEMI antérieur aigu en cours",
      "B) Ondes Q de nécrose : séquelle d'infarctus antérieur",
      "C) Cardiomyopathie hypertrophique",
      "D) WPW avec pseudo-ondes Q"
    ],
    correct: 1,
    explanation: "L'ECG montre des ondes Q pathologiques en V1-V4 : profondes (> 2 mm), larges (> 40 ms), avec un rapport Q/R > 1/3. Ces ondes Q traduisent une nécrose transmurale de la paroi antérieure, séquelle de l'infarctus. Elles s'installent en quelques heures à jours après le STEMI et persistent indéfiniment. Le segment ST est revenu à la ligne de base (phase cicatricielle).",
    key_features: [
      "Ondes Q pathologiques : > 40 ms et/ou > 2 mm",
      "Localisation concordante avec le territoire de l'IDM",
      "Rapport Q/R > 1/3",
      "Segment ST normalisé (phase cicatricielle)",
      "Séquelle permanente d'infarctus transmural"
    ],
    tags: ["onde Q", "nécrose", "séquelle", "infarctus"]
  },

  {
    id: "ecg-040",
    category: "ischemie",
    difficulty: 3,
    image: "wellens-syndrome-1.jpg",
    image_alt: "syndrome-de-wellens",
    clinical_context: "Homme de 50 ans, douleur thoracique il y a 12h, actuellement asymptomatique. Troponine légèrement élevée. ECG : ondes T négatives profondes et symétriques en V2-V5.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Péricardite en phase tardive",
      "B) Syndrome de Wellens (type B – T inversées profondes)",
      "C) HVG avec surcharge systolique",
      "D) Embolie pulmonaire"
    ],
    correct: 1,
    explanation: "L'ECG montre des ondes T négatives profondes et symétriques en V2-V5 sans sus-décalage ST significatif, sans ondes Q, chez un patient avec douleur thoracique récente. C'est le syndrome de Wellens type B (le type A montre des ondes T biphasiques +/- en V2-V3). Ce pattern indique une sténose critique de l'IVA proximale avec un risque majeur d'infarctus antérieur étendu. L'épreuve d'effort est CONTRE-INDIQUÉE. Une coronarographie urgente est nécessaire.",
    key_features: [
      "Ondes T négatives profondes et symétriques en V2-V5",
      "Pas de sus-décalage ST significatif",
      "Pas d'ondes Q",
      "Patient en phase libre entre les douleurs",
      "Sténose critique de l'IVA proximale"
    ],
    tags: ["Wellens", "IVA", "ondes T", "critique"]
  },

  {
    id: "ecg-041",
    category: "ischemie",
    difficulty: 3,
    image: "de-winter-t-waves-1.jpg",
    image_alt: "pattern-de-winter",
    clinical_context: "Homme de 52 ans, douleur thoracique aiguë depuis 1h. ECG : sous-décalage ST ascendant en V1-V6 avec des ondes T amples, positives et symétriques. Pas de sus-décalage ST sauf en aVR.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Hyperkaliémie",
      "B) Pattern de de Winter (équivalent STEMI de l'IVA)",
      "C) Repolarisation précoce",
      "D) Ischémie sous-endocardique banale"
    ],
    correct: 1,
    explanation: "L'ECG montre le pattern de de Winter : sous-décalage du point J de 1-3 mm en V1-V6 avec un segment ST ascendant se terminant par des ondes T amples, positives et symétriques. Un sus-décalage de 1-2 mm en aVR est souvent associé. Ce pattern est un ÉQUIVALENT STEMI correspondant à une occlusion aiguë de l'IVA. Il ne doit PAS être classé comme NSTEMI. L'activation de la salle de cathétérisme est urgente.",
    key_features: [
      "Sous-décalage du point J 1-3 mm en V1-V6",
      "ST ascendant avec ondes T amples, symétriques",
      "Sus-décalage ST 1-2 mm en aVR",
      "Pas de sus-décalage ST classique",
      "Équivalent STEMI → angioplastie urgente"
    ],
    tags: ["de Winter", "équivalent STEMI", "IVA", "urgence"]
  },

  {
    id: "ecg-042",
    category: "ischemie",
    difficulty: 2,
    image: "stemi-anterior-extensive-1.jpg",
    image_alt: "stemi-anterieur-etendu",
    clinical_context: "Homme de 55 ans, douleur thoracique brutale avec détresse respiratoire. PA 80/60. ECG : sus-décalage ST de V1 à V6 et en DI, aVL.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur limité",
      "B) STEMI antérieur étendu (antéro-septo-apico-latéral)",
      "C) Péricardite aiguë",
      "D) Takotsubo"
    ],
    correct: 1,
    explanation: "L'ECG montre un sus-décalage ST étendu de V1 à V6 et en DI, aVL, couvrant les territoires septal, antérieur et latéral. Cela correspond à une occlusion proximale de l'IVA (avant la première diagonale et la première septale). L'état de choc cardiogénique (PA basse, détresse respiratoire) est en rapport avec l'étendue de la nécrose. C'est une urgence absolue nécessitant une reperfusion immédiate et une prise en charge en soins intensifs.",
    key_features: [
      "Sus-décalage ST de V1 à V6 + DI, aVL",
      "Territoire étendu : septo-antéro-latéral",
      "Occlusion IVA proximale",
      "Risque de choc cardiogénique",
      "Urgence absolue de reperfusion"
    ],
    tags: ["STEMI", "antérieur", "étendu", "IVA proximale", "choc"]
  },

  {
    id: "ecg-043",
    category: "ischemie",
    difficulty: 3,
    image: "prinzmetal-angina-1.jpg",
    image_alt: "angor-de-prinzmetal",
    clinical_context: "Homme de 40 ans, fumeur, réveillé à 4h du matin par une douleur thoracique intense. ECG pendant la douleur : sus-décalage ST transitoire en inférieur. ECG de contrôle après trinitrine : normalisation complète.",
    question: "Quel est le diagnostic le plus probable ?",
    options: [
      "A) STEMI inférieur – occlusion coronaire aiguë",
      "B) Angor de Prinzmetal (angor spastique)",
      "C) Péricardite aiguë",
      "D) Repolarisation précoce intermittente"
    ],
    correct: 1,
    explanation: "Le sus-décalage ST transitoire, survenant au repos (classiquement nocturne ou au petit matin), se résolvant complètement après vasodilatateur (trinitrine), chez un sujet jeune fumeur, est caractéristique de l'angor de Prinzmetal (angor vasospastique). Le spasme coronaire provoque une ischémie transmurale transitoire mimant un STEMI. La coronarographie peut être normale entre les épisodes. Le traitement repose sur les inhibiteurs calciques et les dérivés nitrés. Les bêtabloquants sont contre-indiqués.",
    key_features: [
      "Sus-décalage ST transitoire",
      "Survenue au repos (nocturne, petit matin)",
      "Résolution rapide sous trinitrine",
      "Coronaires normales ou peu pathologiques",
      "Traitement : inhibiteurs calciques, dérivés nitrés"
    ],
    tags: ["Prinzmetal", "spasme", "vasospastique", "transitoire"]
  },

  // =====================================================
  // CATÉGORIE : autres (8 questions)
  // =====================================================

  {
    id: "ecg-044",
    category: "autres",
    difficulty: 2,
    image: "hyperkalaemia-ecg-1.jpg",
    image_alt: "hyperkaliemie",
    clinical_context: "Homme de 70 ans, insuffisance rénale chronique terminale (dialyse manquée), K+ à 7.2 mmol/L. ECG réalisé en urgence.",
    question: "Quels sont les signes ECG d'hyperkaliémie sévère ?",
    options: [
      "A) Ondes U proéminentes et sous-décalage ST",
      "B) Ondes T pointues, QRS élargis, diminution des ondes P",
      "C) Sus-décalage ST diffus concave",
      "D) Ondes delta et PR court"
    ],
    correct: 1,
    explanation: "L'hyperkaliémie sévère (> 7 mmol/L) provoque une séquence de modifications ECG potentiellement létales : d'abord des ondes T pointues et symétriques (tentes), puis un allongement du PR, un aplatissement des ondes P, un élargissement des QRS, et enfin une onde sinusoïdale pré-arrêt. C'est une urgence vitale nécessitant du gluconate de calcium IV immédiat pour stabiliser la membrane myocardique.",
    key_features: [
      "Ondes T pointues, symétriques (en tente)",
      "Allongement du PR",
      "Diminution/disparition des ondes P",
      "Élargissement des QRS",
      "Onde sinusoïdale (pré-arrêt) si très sévère"
    ],
    tags: ["hyperkaliémie", "potassium", "urgence", "ondes T"]
  },

  {
    id: "ecg-045",
    category: "autres",
    difficulty: 2,
    image: "hypokalaemia-ecg-1.jpg",
    image_alt: "hypokaliemie",
    clinical_context: "Femme de 45 ans, vomissements profus depuis 3 jours, K+ à 2.5 mmol/L. Faiblesse musculaire diffuse.",
    question: "Quels sont les signes ECG d'hypokaliémie ?",
    options: [
      "A) Ondes T pointues et QRS larges",
      "B) Aplatissement des ondes T, apparition d'ondes U, allongement du QT",
      "C) Sus-décalage ST diffus",
      "D) Ondes delta et PR court"
    ],
    correct: 1,
    explanation: "L'hypokaliémie provoque un aplatissement progressif des ondes T, l'apparition d'ondes U (petite onde positive après l'onde T, surtout en V2-V3), un allongement du QT/QU, un sous-décalage du segment ST. Dans les formes sévères, l'onde U peut devenir plus grande que l'onde T. L'hypokaliémie prédispose aux arythmies ventriculaires (ESV, TV, torsade de pointes) surtout si traitement par digoxine associé.",
    key_features: [
      "Aplatissement des ondes T",
      "Ondes U proéminentes (V2-V3)",
      "Allongement apparent du QT (en fait QU)",
      "Sous-décalage ST",
      "Risque d'arythmie ventriculaire"
    ],
    tags: ["hypokaliémie", "potassium", "ondes U", "QT long"]
  },

  {
    id: "ecg-046",
    category: "autres",
    difficulty: 2,
    image: "hypothermia-osborn-wave-1.jpg",
    image_alt: "hypothermie-onde-osborn",
    clinical_context: "Homme de 60 ans trouvé inconscient en extérieur en hiver. Température centrale à 28°C. Bradycardie à 40 bpm.",
    question: "Quel signe ECG est pathognomonique de l'hypothermie ?",
    options: [
      "A) Onde delta",
      "B) Onde d'Osborn (onde J)",
      "C) Onde epsilon",
      "D) Onde de Pardee"
    ],
    correct: 1,
    explanation: "L'ECG montre une onde d'Osborn (ou onde J) : déflexion positive à la jonction J (entre le QRS et le segment ST), prédominant en dérivations inférieures et latérales. Son amplitude est proportionnelle au degré d'hypothermie. Les autres signes ECG d'hypothermie incluent : bradycardie sinusale, allongement des intervalles (PR, QRS, QT), trémulation de la ligne de base (frissons) et risque de FA et de FV en dessous de 30°C.",
    key_features: [
      "Onde d'Osborn (onde J) à la jonction QRS-ST",
      "Amplitude proportionnelle au degré d'hypothermie",
      "Bradycardie sinusale",
      "Allongement PR, QRS, QT",
      "Risque de FV si T° < 30°C"
    ],
    tags: ["hypothermie", "Osborn", "onde J", "froid"]
  },

  {
    id: "ecg-047",
    category: "autres",
    difficulty: 2,
    image: "wpw-delta-wave-1.jpg",
    image_alt: "wpw-onde-delta-pr-court",
    clinical_context: "Homme de 18 ans, découverte fortuite lors d'un ECG de routine pour certificat de sport. Asymptomatique.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) BBG incomplet",
      "B) HVG",
      "C) Syndrome de WPW (pré-excitation ventriculaire)",
      "D) BAV du 1er degré avec BBD"
    ],
    correct: 2,
    explanation: "L'ECG montre la triade du WPW : 1) PR court (< 120 ms) car l'influx passe par la voie accessoire qui court-circuite le nœud AV, 2) onde delta (empâtement initial du QRS) correspondant à la pré-excitation ventriculaire, 3) QRS élargi (> 100 ms) avec anomalies secondaires de la repolarisation. Le WPW expose au risque de tachycardie par réentrée (orthodromique/antidromique) et de FA pré-excitée potentiellement mortelle.",
    key_features: [
      "PR court (< 120 ms)",
      "Onde delta (empâtement initial du QRS)",
      "QRS élargi > 100 ms",
      "Anomalies de repolarisation secondaires",
      "Risque de tachycardies et FA pré-excitée"
    ],
    tags: ["WPW", "pré-excitation", "onde delta", "voie accessoire"]
  },

  {
    id: "ecg-048",
    category: "autres",
    difficulty: 3,
    image: "brugada-syndrome-type1-1.jpg",
    image_alt: "brugada-type-1",
    clinical_context: "Homme de 35 ans, originaire d'Asie du Sud-Est, frère décédé de mort subite à 30 ans. ECG montrant un aspect en dôme en V1-V2.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI antérieur",
      "B) Syndrome de Brugada type 1",
      "C) Repolarisation précoce",
      "D) BBD complet"
    ],
    correct: 1,
    explanation: "L'ECG montre un pattern de Brugada type 1 (aspect coved) : sus-décalage du point J ≥ 2 mm en V1-V2, suivi d'un segment ST descendant convexe (en dôme) se terminant par une onde T négative. Ce pattern est diagnostique du syndrome de Brugada, canalopathie à risque de mort subite par FV. Plus fréquent chez les hommes et les populations d'Asie du Sud-Est. La fièvre peut démasquer ou aggraver le pattern. Le traitement préventif est le défibrillateur implantable.",
    key_features: [
      "Sus-décalage du point J ≥ 2 mm en V1-V2",
      "Aspect en dôme (coved) du ST",
      "Onde T négative terminale",
      "Antécédents familiaux de mort subite",
      "Traitement : défibrillateur implantable si symptomatique"
    ],
    tags: ["Brugada", "type 1", "mort subite", "canalopathie"]
  },

  {
    id: "ecg-049",
    category: "autres",
    difficulty: 2,
    image: "pericarditis-ecg-1.jpg",
    image_alt: "pericardite-aigue",
    clinical_context: "Homme de 30 ans, douleur thoracique augmentée à l'inspiration et soulagée en position penchée en avant, survenue 1 semaine après un syndrome grippal.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI inférieur",
      "B) Péricardite aiguë",
      "C) Repolarisation précoce",
      "D) Syndrome de Brugada"
    ],
    correct: 1,
    explanation: "L'ECG montre un sus-décalage ST diffus concave vers le haut (dans plusieurs territoires ne correspondant pas à un seul territoire coronaire), un sous-décalage du segment PR (spécifique de la péricardite, surtout en DII), et une absence d'image en miroir (sauf en aVR où on peut voir un sous-décalage ST et un sus-décalage PR). Le contexte post-viral, la douleur positionnelle et les anomalies ECG diffuses sont typiques de la péricardite aiguë.",
    key_features: [
      "Sus-décalage ST diffus concave vers le haut",
      "Sous-décalage du PR (surtout en DII)",
      "Pas d'image en miroir (sauf aVR)",
      "Anomalies dans plusieurs territoires",
      "Contexte : post-viral, douleur positionnelle"
    ],
    tags: ["péricardite", "diffus", "concave", "PR"]
  },

  {
    id: "ecg-050",
    category: "autres",
    difficulty: 2,
    image: "s1q3t3-pulmonary-embolism-1.jpg",
    image_alt: "s1q3t3-embolie-pulmonaire",
    clinical_context: "Femme de 45 ans, retour d'un vol long-courrier, dyspnée aiguë avec douleur thoracique et tachycardie à 120 bpm. SpO2 88%.",
    question: "Quel signe ECG évoque une embolie pulmonaire ?",
    options: [
      "A) Sus-décalage ST en V1-V4",
      "B) Pattern S1Q3T3 avec tachycardie sinusale",
      "C) Ondes T pointues diffuses",
      "D) PR court avec onde delta"
    ],
    correct: 1,
    explanation: "L'ECG montre le classique pattern S1Q3T3 : onde S profonde en DI, onde Q en DIII et onde T inversée en DIII. Ce pattern, bien que peu sensible (~20%), est assez spécifique de la surcharge droite aiguë dans le contexte d'embolie pulmonaire. D'autres signes possibles : tachycardie sinusale (signe le plus fréquent), déviation axiale droite, BBD incomplet/complet, ondes T négatives en V1-V4 (surcharge VD), et FA de novo.",
    key_features: [
      "S1Q3T3 (onde S en DI, Q en DIII, T inversée en DIII)",
      "Tachycardie sinusale (signe le plus fréquent)",
      "Déviation axiale droite",
      "T inversées en V1-V4 (surcharge VD)",
      "BBD complet ou incomplet possible"
    ],
    tags: ["embolie", "pulmonaire", "S1Q3T3", "surcharge droite"]
  },

  {
    id: "ecg-051",
    category: "autres",
    difficulty: 2,
    image: "left-ventricular-hypertrophy-1.jpg",
    image_alt: "hypertrophie-ventriculaire-gauche",
    clinical_context: "Homme de 60 ans, HTA sévère non traitée depuis 15 ans. ECG montrant des voltages augmentés et des anomalies de la repolarisation en latéral.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) STEMI latéral",
      "B) Hypertrophie ventriculaire gauche (HVG)",
      "C) BBG incomplet",
      "D) WPW latéral"
    ],
    correct: 1,
    explanation: "L'ECG montre une HVG avec les critères de Sokolow-Lyon positifs : S en V1 + R en V5 ou V6 ≥ 35 mm. On observe également des ondes R amples en dérivations latérales (DI, aVL, V5-V6), des ondes S profondes en V1-V2, et des anomalies secondaires de la repolarisation en latéral (sous-décalage ST et ondes T inversées asymétriques = surcharge systolique). L'HVG est la conséquence d'une HTA chronique non contrôlée.",
    key_features: [
      "Critère de Sokolow-Lyon : S(V1) + R(V5 ou V6) ≥ 35 mm",
      "Critère de Cornell : R(aVL) + S(V3) > 28 mm (H) ou > 20 mm (F)",
      "Surcharge systolique : ST descendant + T inversée asymétrique en latéral",
      "Déviation axiale gauche possible",
      "Contexte d'HTA chronique"
    ],
    tags: ["HVG", "hypertrophie", "Sokolow", "HTA"]
  },

  // =====================================================
  // Questions bonus (pour dépasser 50)
  // =====================================================

  {
    id: "ecg-052",
    category: "arythmies_sv",
    difficulty: 3,
    image: "wandering-atrial-pacemaker-1.jpg",
    image_alt: "wandering-atrial-pacemaker",
    clinical_context: "Homme de 70 ans, BPCO modérée. ECG montrant un rythme irrégulier avec des ondes P de morphologie variable mais une FC < 100 bpm.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Tachycardie atriale multifocale",
      "B) Wandering atrial pacemaker (stimulateur auriculaire baladeur)",
      "C) Fibrillation auriculaire",
      "D) Rythme sinusal avec ESA fréquentes"
    ],
    correct: 1,
    explanation: "L'ECG montre au moins 3 morphologies différentes d'ondes P avec des intervalles P-P et P-R variables, mais la fréquence cardiaque est < 100 bpm. Si la FC était > 100 bpm, on parlerait de tachycardie atriale multifocale (TAM). Le wandering atrial pacemaker est souvent associé aux pathologies pulmonaires chroniques et reflète un déplacement du foyer dominant de dépolarisation auriculaire entre le nœud sinusal et d'autres foyers atriaux.",
    key_features: [
      "≥ 3 morphologies d'ondes P différentes",
      "Intervalles P-P et P-R variables",
      "FC < 100 bpm (≠ TAM si > 100)",
      "Rythme irrégulier",
      "Association avec pathologies pulmonaires"
    ],
    tags: ["wandering", "pacemaker", "auriculaire", "BPCO"]
  },

  {
    id: "ecg-053",
    category: "ischemie",
    difficulty: 3,
    image: "wellens-type-a-biphasic-1.jpg",
    image_alt: "wellens-type-a-biphasique",
    clinical_context: "Femme de 62 ans, douleur thoracique hier soir, résolue spontanément. Troponine légèrement positive. ECG montrant des ondes T biphasiques (+/-) en V2-V3.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) Ischémie sous-endocardique banale",
      "B) Syndrome de Wellens type A (T biphasiques)",
      "C) Hypokaliémie",
      "D) Effet digitalique"
    ],
    correct: 1,
    explanation: "L'ECG montre des ondes T biphasiques (d'abord positives puis négatives) en V2-V3, sans sus-décalage ST significatif et sans ondes Q. C'est le pattern de Wellens type A (25% des cas ; le type B avec T profondes inversées représente 75%). Ce pattern indique une sténose critique (> 90%) de l'IVA proximale. L'épreuve d'effort est formellement CONTRE-INDIQUÉE (risque d'infarctus massif). Une coronarographie est urgente.",
    key_features: [
      "Ondes T biphasiques (+/-) en V2-V3",
      "Pas de sus-décalage ST significatif",
      "Pas d'ondes Q pathologiques",
      "Patient entre les épisodes douloureux",
      "Épreuve d'effort CONTRE-INDIQUÉE"
    ],
    tags: ["Wellens", "type A", "biphasique", "IVA"]
  },

  {
    id: "ecg-054",
    category: "blocs",
    difficulty: 3,
    image: "left-posterior-fascicular-block-1.jpg",
    image_alt: "hemibloc-posterieur-gauche",
    clinical_context: "Homme de 72 ans, cardiopathie ischémique. ECG montrant une déviation axiale droite avec QRS fins, sans HVD ni pathologie pulmonaire.",
    question: "Quel est le diagnostic ECG ?",
    options: [
      "A) HVD",
      "B) Hémibloc postérieur gauche (HBPG)",
      "C) Infarctus latéral ancien",
      "D) Cœur pulmonaire chronique"
    ],
    correct: 1,
    explanation: "L'ECG montre une déviation axiale droite (axe > +90°) avec des QRS fins (< 120 ms) et un aspect qR en DIII/aVF et rS en DI/aVL. C'est un hémibloc postérieur gauche (HBPG), diagnostic d'élimination après avoir exclu l'HVD, le cœur pulmonaire et l'infarctus latéral. L'HBPG isolé est rare car le fascicule postérieur est court, épais et doublement vascularisé. Sa présence signe souvent une atteinte cardiaque significative.",
    key_features: [
      "Déviation axiale droite (> +90°)",
      "QRS < 120 ms",
      "qR en DIII et aVF",
      "rS en DI et aVL",
      "Diagnostic d'exclusion (exclure HVD, EP, IDM latéral)"
    ],
    tags: ["HBPG", "hémibloc", "postérieur", "axe droit"]
  },

  {
    id: "ecg-055",
    category: "autres",
    difficulty: 3,
    image: "digoxin-effect-ecg-1.jpg",
    image_alt: "effet-digitalique",
    clinical_context: "Femme de 78 ans sous digoxine pour FA. ECG de contrôle montrant un aspect caractéristique de la cupule digitalique.",
    question: "Quel signe ECG est caractéristique de l'imprégnation digitalique ?",
    options: [
      "A) Allongement du QT",
      "B) Sous-décalage ST en cupule (cupule digitalique)",
      "C) Ondes T pointues",
      "D) Sus-décalage ST diffus"
    ],
    correct: 1,
    explanation: "L'ECG sous digoxine montre la cupule digitalique : sous-décalage du segment ST en cuillère (concave vers le bas) avec un aspect en moustache de Salvador Dalí, prédominant dans les dérivations avec les ondes R les plus amples (V4-V6, DI, DII). C'est un signe d'imprégnation (présence du médicament) et non de surdosage. Le raccourcissement du QT est aussi caractéristique. En cas de surdosage, on observe des troubles du rythme (bigéminisme, TV) et de la conduction (BAV).",
    key_features: [
      "Sous-décalage ST en cupule (concave vers le bas)",
      "Aspect en cuillère ou moustache de Dalí",
      "Raccourcissement du QT",
      "Prédominance en V4-V6, DI, DII",
      "Imprégnation ≠ surdosage"
    ],
    tags: ["digoxine", "digitalique", "cupule", "imprégnation"]
  },

  {
    id: "ecg-056",
    category: "autres",
    difficulty: 3,
    image: "long-qt-syndrome-1.jpg",
    image_alt: "syndrome-du-qt-long",
    clinical_context: "Adolescente de 15 ans, syncope à l'effort. Antécédent familial de mort subite chez un cousin. QTc mesuré à 520 ms.",
    question: "Quel est le diagnostic ECG et quel est le principal risque ?",
    options: [
      "A) QT normal pour l'âge",
      "B) Syndrome du QT long congénital – risque de torsade de pointes et mort subite",
      "C) Hypocalcémie – risque de tétanie",
      "D) BAV du 1er degré – risque faible"
    ],
    correct: 1,
    explanation: "L'ECG montre un allongement du QTc > 500 ms, ce qui est significativement pathologique (normal < 440 ms chez l'homme, < 460 ms chez la femme). Chez une adolescente avec syncope à l'effort et antécédents familiaux de mort subite, il faut évoquer un syndrome du QT long congénital (Romano-Ward ou Jervell-Lange-Nielsen). Le risque principal est la torsade de pointes dégénérant en FV. Le traitement comprend les bêtabloquants et parfois un défibrillateur implantable.",
    key_features: [
      "QTc > 500 ms",
      "Syncope à l'effort",
      "Antécédents familiaux de mort subite",
      "Risque de torsade de pointes → FV",
      "Traitement : bêtabloquants ± DAI"
    ],
    tags: ["QT long", "congénital", "mort subite", "torsade"]
  }

];

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ECG_QUESTIONS };
}
