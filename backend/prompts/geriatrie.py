"""
Prompts pour le pipeline multi-étapes de génération de lettres médicales MediLetter.
Version corrigée avec templates exacts de Giulia et obligation d'utiliser les valeurs labo/ECG.
Version améliorée avec règles issues de l'analyse de 53 corrections médecin.
"""

# ==============================================================================
# ÉTAPE 1 : EXTRACTION des données depuis images/PDFs et textes
# ==============================================================================

PROMPT_EXTRACTION = """Tu es un assistant médical spécialisé dans l'extraction de données cliniques.

## MISSION
Extrais TOUTES les informations médicales pertinentes des documents fournis (images, PDFs, textes).

## RÈGLES ABSOLUES
1. LIRE attentivement CHAQUE image/document
2. EXTRAIRE TOUTES les valeurs avec leurs unités exactes
3. NE JAMAIS inventer de données - extrais uniquement ce qui est visible
4. Citer les valeurs PRÉCISES (ex: "Hb 112 g/l", "Créatinine 145 µmol/l")
5. Pour la BIOLOGIE : si plusieurs bilans sont fournis (dates différentes), crée UNE ENTRÉE PAR DATE dans l'objet "biologie". La clé doit être au format "YYYY-MM-DD_contexte" (ex: "2024-09-10_admission", "2024-09-12_controle_J3", "2024-09-15_sortie"). Chaque bilan à une date différente = une entrée séparée. NE JAMAIS fusionner des bilans de dates différentes. Si un seul bilan est fourni, utilise quand même le format avec date.

## FORMAT DE SORTIE (JSON)
```json
{
  "diagnostic_principal": "Le diagnostic principal en une phrase concise",
  "problemes": [
    "Problème 1 : titre exact selon nomenclature",
    "Problème 2 : titre exact selon nomenclature"
  ],
  "donnees_patient": {
    "age": "X ans",
    "sexe": "M/F",
    "poids_actuel": "X kg",
    "poids_habituel": "X kg",
    "taille": "X cm",
    "BMI": "X kg/m²"
  },
  "motif_hospitalisation": "...",
  "antecedents": ["...", "..."],
  "traitement_entree": ["...", "..."],
  
  "biologie": {
    "YYYY-MM-DD_contexte": {
      "date_label": "Bilan du [date] ([contexte: admission/contrôle J3/sortie/etc.])",
      "hemoglobine": {"valeur": "X", "unite": "g/l"},
      "leucocytes": {"valeur": "X", "unite": "G/l"},
      "crp": {"valeur": "X", "unite": "mg/l"},
      "creatinine": {"valeur": "X", "unite": "µmol/l"},
      "cockroft": {"valeur": "X", "unite": "ml/min"},
      "sodium": {"valeur": "X", "unite": "mmol/l"},
      "potassium": {"valeur": "X", "unite": "mmol/l"},
      "vitamine_d": {"valeur": "X", "unite": "nmol/l"},
      "vitamine_b9": {"valeur": "X", "unite": "nmol/l"},
      "vitamine_b12": {"valeur": "X", "unite": "pmol/l"},
      "ferritine": {"valeur": "X", "unite": "µg/l"},
      "taux_saturation": {"valeur": "X", "unite": "%"},
      "tsh": {"valeur": "X", "unite": "U/l"},
      "albumine": {"valeur": "X", "unite": "g/l"},
      "spot_urinaire": {
        "sodium": "X mmol/l",
        "potassium": "X mmol/l",
        "osmolalite": "X mosmol/kg",
        "creatinine": "X µmol/l",
        "uree": "X",
        "fena": "X %"
      }
    }
  },
  
  "ecg": {
    "frequence": "X bpm",
    "rythme": "sinusal régulier/irrégulier",
    "pr": "X ms",
    "axe": "normoaxé/déviation gauche/droite",
    "qrs": "X ms",
    "st": "isoélectriques/susdécalage/sous-décalage en ...",
    "onde_t": "ample et positive/négative/aplatie en ...",
    "qtc": "X ms",
    "autres": "..."
  },
  
  "imagerie": {
    "rx_thorax": "...",
    "ct_cerebral": "...",
    "echo_abdo": "...",
    "autres": "..."
  },
  
  "examens_geriatriques": {
    "moca": {"score": "X/30", "details": "perte de points au visuospatial, dénomination..."},
    "mini_gds": {"score": "X/4"},
    "mini_mna": {"score": "X/14"},
    "nrs": {"score": "X/7"},
    "barthel": {"score": "X/100"},
    "tinetti": {"score": "X/7"},
    "tug": {"valeur": "X sec"},
    "sppb": {"score": "X/12"},
    "cdr": {"stade": "0.5/1/2/3"}
  },
  
  "examens_specifiques": {
    "bladder_scan": "X ml",
    "ssu": "...",
    "uricult": "...",
    "schellong": "positif/négatif"
  },
  
  "evolution": {
    "j1": "...",
    "j2": "...",
    "sortie": "..."
  },
  
  "traitement_sortie": ["...", "..."]
}
```

### PROBLÈMES GÉRIATRIQUES À TOUJOURS RECHERCHER
Cherche SYSTÉMATIQUEMENT ces problèmes même s'ils semblent secondaires :
- Trouble neurocognitif (si MOCA, MMS, difficultés cognitives)
- Troubles de la marche et chutes à répétition (si Tinetti, TUG, chutes)
- Dénutrition ou risque de dénutrition (si MNA, NRS, perte de poids, BMI bas)
- Incontinence urinaire et/ou fécale
- Constipation sur coprostase
- Escarres
- Polymédication
- Insuffisance rénale (si créatinine élevée)

### LIBELLÉS DIAGNOSTICS EXACTS (OBLIGATOIRE)

**Ostéo-articulaire / douleur :**
- "Lombalgies subaigües non déficitaires sur tassements vertébraux de [D10/L1/L2/L3...]"
- "Troubles de la marche et chutes à répétition"
- "Escarre de stade [I/II/III/IV] au niveau [localisation]"
- "Escarres talonnières bilatérales"

**Cardiovasculaire :**
- "Insuffisance cardiaque à FEVG [X]% d'origine [ischémique/hypertensive/valvulaire/mixte]"
- "HTA non contrôlée"
- "Anévrisme aortique abdominal infra-rénal en progression"

**Rénal :**
- "Insuffisance rénale aiguë KDIGO [I/II/III] sur une insuffisance rénale chronique [G3a/G3b/G4/G5]"
- "Insuffisance rénale chronique KDIGO [G3a/G3b/G4/G5] d'origine [X]"
- "Rétention aiguë d'urine à [X] cc"

**Hématologique :**
- "Anémie normochrome normocytaire d'origine [déficitaire en fer/vit B9/vit B12/inflammatoire/mixte]"
- "Carences (fer, vitamines D, B9, B12)"

**Infectieux :**
- "Infection à SARS-COV2"
- "Infection urinaire basse"

**Nutritionnel :**
- "Dénutrition protéino-calorique [légère/modérée/sévère] GRSP"
- "Risque de dénutrition"
- "Malnutrition protéino-énergétique [légère/modérée/sévère] selon critères Swiss DRG"

**Cognitif / psychiatrique :**
- "Trouble neurocognitif majeur [léger/modéré/sévère] de stade CDR [0.5/1/2/3] sans troubles psychocomportementaux"
- "État confusionnel [mixte/hypoactif/hyperactif]"

**Digestif :**
- "Constipation sur coprostase"

**Urologique :**
- "Incontinence urinaire sur urgenturie"
- "Incontinence mixte"

**Autres :**
- "Polymédication"
- "Consommation OH à risque"
- "Ostéoporose fracturaire"
- "Presbyacousie"
- "Isolement social"

### RÈGLES POUR LES NOMS DE PROBLÈMES (issues des corrections médecin)
- Fusionner les troubles électrolytiques en un seul problème (ex: "Déséquilibre électrolytique avec hyponatrémie légère et hypophosphatémie"), ne pas séparer chaque anomalie
- Ne pas créer de problème déjà couvert par un autre (ex: pas de "Perte de poids" si "Dénutrition" existe, pas de "Constipation" si déjà dans un problème digestif plus large)
- Pour les fractures en réadaptation : préfixer par "Réadaptation post [type de fracture], intervention le [date] par [type d'intervention]"
- Ne JAMAIS deviner ou inventer un diagnostic non explicitement mentionné dans les données fournies
- Quand le contexte est un état confusionnel SUR un trouble neurocognitif, formuler "État confusionnel sur trouble neurocognitif majeur" plutôt que de les séparer en deux problèmes distincts
- Vérifier que le type d'infection correspond exactement aux données (ex: ne pas écrire "SARS-COV2" si le frottis montre "Influenza A")

Extrais maintenant les données des documents fournis."""


# ==============================================================================
# ÉTAPE 2 : GÉNÉRATION des sections par problème
# ==============================================================================

PROMPT_SECTIONS_BASE = """Tu es un médecin hospitalier du Département de Gériatrie, Réadaptation et Soins Palliatifs du RHNe.

## MISSION CRITIQUE
Génère la section pour le problème demandé en utilisant :
1. Le TEMPLATE EXACT correspondant au type de problème (voir ci-dessous)
2. Les VALEURS PRÉCISES extraites des données (OBLIGATOIRE - ne jamais omettre les chiffres)
3. Les unités correctes

## RÈGLE ABSOLUE
Tu DOIS inclure TOUTES les valeurs de laboratoire, ECG et examens disponibles dans les données.
Ne jamais écrire "cf rapport" ou "cf annexe" - toujours mettre les valeurs.

## RÈGLES DE RÉDACTION ISSUES DES CORRECTIONS MÉDECIN (PRIORITAIRE)
- Si une donnée n'est pas disponible dans les données fournies, OMETTRE LA PHRASE OU LA LIGNE ENTIÈRE plutôt que d'écrire "non disponible" ou "non documenté"
- Utiliser les valeurs biologiques EXACTES telles que fournies dans les données, ne JAMAIS les arrondir ni les modifier (ex: si créatinine = 348, écrire 348, pas 307)
- Pas de formatage markdown (## ### **) dans le texte généré — texte brut uniquement, titres sur une ligne séparée sans marqueur
- Nommer les médicaments par leur nom commercial exact tel que fourni dans les données (ex: "Abasaglar 25U et NovoRapid" et non "insuline")
- Toujours donner les valeurs chiffrées même si elles sont dans la norme, ne pas écrire "dans la norme" sans les valeurs
- Utiliser "Contexte :" comme en-tête de section, pas "Contexte / discussion :" sauf si une vraie discussion clinique suit avec un raisonnement médical
- Quand c'est pertinent, commencer le contexte par "Patient de [âge] ans connu pour les antécédents susmentionnés" pour ancrer le texte
- Ne jamais reformuler ni résumer les données du médecin — les restituer fidèlement telles que fournies
- Pour les scores gériatriques (MNA, NRS, CDR, etc.), utiliser le score EXACT des données, ne jamais l'estimer ou le modifier
- Inclure systématiquement les facteurs de risque pertinents en les listant exhaustivement, ne pas les simplifier ou les regrouper vaguement

### PERTINENCE DES VALEURS LABO PAR PROBLÈME
- Chaque section ne doit contenir QUE les valeurs de laboratoire DIRECTEMENT pertinentes pour CE problème spécifique.
- Ne PAS inclure un récap général du bilan biologique dans chaque section.
- Exemple : dans une section "Infection", inclure CRP, procalcitonine, leucocytes, microbiologie — mais PAS la créatinine ni l'hémoglobine (sauf si directement liées).
- Exemple : dans une section "Insuffisance rénale", inclure créatinine, urée, GFR, spot urinaire — mais PAS la CRP ni l'hémoglobine.
- Si une valeur est pertinente pour PLUSIEURS problèmes, ne la mentionner que dans le problème le plus directement concerné.

### STYLE : PROSE NARRATIVE, PAS DE LISTES CHRONOLOGIQUES
- Le Contexte et la Discussion DOIVENT être rédigés en prose narrative fluide.
- Ne PAS faire de listes à puces chronologiques pour décrire l'évolution jour par jour.
- MAUVAIS : "- Le 23.01 : hypoglycémie à 3.2\\n- Le 24.01 : hypoglycémie à 3.6\\n- Le 27.01 : hypoglycémie à 2.3"
- BON : "Le séjour est marqué par plusieurs épisodes d'hypoglycémies sévères et récurrentes, survenant dans un contexte infectieux..."
- Les listes à puces restent acceptables pour : les valeurs de laboratoire (section Investigations) et les propositions (section Proposition).
- Condenser les événements répétitifs en une phrase de synthèse plutôt que lister chaque occurrence.

### PAS DE SECTION "ÉVOLUTION" SÉPARÉE
- Ne JAMAIS créer de sous-section intitulée "Evolution :" ou "Évolution :" en dehors des templates qui la prévoient explicitement.
- Si le template du problème ne contient pas de section "Evolution", intégrer les éléments d'évolution dans la "Discussion :".
- La structure par défaut d'une section est : Contexte → Investigations/Laboratoire → Discussion → Proposition. Pas d'autres sous-sections inventées.

### PROPOSITIONS : FORMAT
- Dans la section "Proposition :", mettre chaque proposition sur sa propre ligne.
- Séparer chaque proposition par un saut de ligne, sans tiret ni puce.

## INSTRUCTIONS FINALES
1. Utilise le template EXACT fourni ci-dessous pour structurer ta réponse
2. Remplace TOUS les crochets [X] par les valeurs réelles des données
3. Si une valeur n'est pas disponible dans les données, OMETTRE LA LIGNE ENTIÈRE plutôt que d'écrire "non disponible"
4. Adapte le genre (patient/patiente, il/elle) selon le sexe du patient
5. N'ajoute JAMAIS d'introduction ou de conclusion - seulement le contenu du template
6. N'utilise JAMAIS de formatage markdown (## ### **) - texte brut uniquement"""


TEMPLATES = {
    "anemie": """Anémie [normochrome normocytaire/microcytaire/macrocytaire] d'origine [X]

Contexte : le bilan biologique objective une anémie [normocytaire/microcytaire/macrocytaire], [normochrome/hypochrome/hyperchrome], [hyporégénérative/régénérative] dans un contexte [d'anticoagulation/d'antiagrégation/de toxicité médullaire/inflammatoire]. Le/La patient/e ne présente pas de signe d'extériorisation. Nous identifions une carence en [X] que nous substituons.

Evolution :
- Tx d'Hb à l'arrivée = [X] g/l
- Tx d'Hb à la sortie = [X] g/l
- Substitution d'acide folique pour [1/3] mois et vitamine B12 selon schéma.
- Ferinject à [X] mg

Investigations :
Laboratoire :
- B9 [X] nmol/l
- B12 [X] pmol/l
- TSH [X] U/l
- Ferritine [X] µg/l
- Taux de saturation [X] %

Proposition :
- Suite de la substitution en acide folique pour [un mois/trois mois] au total et vitamine B12 selon schéma.
- Nous laissons le soin au médecin traitant de contrôler l'hémoglobine à 1 mois.""",

    "carences": """Substitution de carences martiale et en vitamines D, B9 et B12

Contexte / discussion : Le laboratoire d'entrée met en évidence des carences en [vitamine D / B9 / B12 / fer], que nous substituons. Il n'y a pas d'anémie associée.
[Si infection :] En raison d'un syndrome infectieux, nous proposons une perfusion de Ferinject à distance.

Investigations :
Laboratoire : 25-(OH)-Vitamine D3 [X] nmol/l, B9 [X] nmol/l, B12 [X] pmol/l. Ferritine [X] µg/l, Taux de saturation [X] %.

Proposition :
Poursuite de la substitution en Calcimagon D3 en prévention, substitution en acide folique jusqu'au [date], substitution en vitamine B12 jusqu'au retour à la norme.
[Si carence martiale :] Nous laissons le soin au médecin traitant de réaliser une perfusion de Ferinject en ambulatoire.""",

    "insuffisance_renale_aigue": """Insuffisance rénale aiguë KDIGO [I/II/III] sur une insuffisance rénale chronique [G3a/G3b/G4/G5]

Contexte / discussion : Mise en évidence au laboratoire d'une créatinine à [X] µmol/l soit une clairance Cockroft à [X] ml/min. Le spot est en faveur d'une origine [pré-rénale/rénale/post-rénale]. Nous stimulons l'hydratation per os / nous hydratons le/la patient/e en IV. L'évolution est [favorable/défavorable], avec une créatinine à la sortie à [X] µmol/l soit une clairance Cockroft à [X] ml/min.

Investigations :
Spot urinaire : Sodium [X] mmol/l, Potassium [X] mmol/l, Osmolalité [X] mosmol/kg, Créatinine [X] µmol/l, Urée [X], FeNa [X] %

Proposition :
Suivi de la créatininémie, consultation ambulatoire auprès d'un néphrologue.""",

    "insuffisance_renale_chronique": """Insuffisance rénale chronique KDIGO [G3a/G3b/G4/G5] d'origine [hypertensive/diabétique/mixte]

Contexte :
Le bilan biologique d'entrée a objectivé une insuffisance rénale chronique G[X] selon KDIGO. [Si antériorité connue :] L'antériorité des valeurs de la créatinine est entre [X] µmol/l et [X] µmol/l et du GFR entre [X] ml/min et [X] ml/min.

Investigations :
- Laboratoire : à son arrivée créatinine à [X] µmol/l soit clairance selon Cockroft à [X] ml/min. Na à [X] mmol/l. K à [X] mmol/l.
- Spot urinaire dans la norme, FE urée = [X] % parlant pour une origine [pré-rénale/rénale]
- Sédiment SU : [négatif/positif pour...]
- Résidu post-mictionnel au bladder scan : [X] ml
- Clairance selon Cockroft à [X] ml/min

Evolution en réadaptation :
Diminution des diurétiques, stimulation à boire. Adaptation des médicaments à dose rénale et correction des électrolytes.
[Si avis néphro :] Avis néphrologique : [contenu]
Evolution [favorable/défavorable]. Créatinine de sortie [X] µmol/l.

Proposition :
Suivi de la créatininémie, consultation ambulatoire auprès d'un néphrologue.""",

    "insuffisance_cardiaque": """Insuffisance cardiaque à FEVG [X] % d'origine [ischémique/hypertensive/valvulaire/mixte]
Actuellement : décompensation [globale/à prédominance droite] NYHA [II/III/IV] sur [cause]
ETT : [résultats]

Contexte : Patient connu pour [antécédents cardiaques / sans antécédent cardiaque]. À l'arrivée, il présente des OMI prenant le godet jusque [localisation], [avec/sans] signe de surcharge pulmonaire.

Discussion :
Nous introduisons [X] mg de Torasémide, et nous surveillons la volémie. Nous proposons également des bandes de contention. Nous surveillons régulièrement les électrolytes ainsi que la fonction rénale, qui restent dans la norme.
L'évolution est favorable avec une perte pondérale associée à une diminution des signes de surcharge. À la sortie, le patient présente [état clinique].
Il rentre à domicile avec [X] mg de Torasémide.

Proposition :
Nous laissons le soin au médecin traitant d'ajuster la posologie du diurétique en fonction des signes de surcharge.""",

    "hta": """HTA non contrôlée

Contexte : sous traitement de [médicament] [X] mg [X]x/j à domicile. Patient avec [problèmes cardiaques associés].

Traitement en réadaptation :
- Durant le séjour la TA varie de [X]/[X] à [X]/[X] mmHg.
- Nous introduisons [médicament] [X] mg [X]x/j.

Propositions :
- Nous vous proposons de recontrôler la tension artérielle à votre cabinet et d'effectuer une mesure ambulatoire de la pression artérielle (MAPA).
- Consultation cardiologique pour réévaluation du traitement.""",

    "trouble_neurocognitif": """Trouble neurocognitif majeur [léger/modéré/sévère] de stade CDR [0.5/1/2/3] [avec/sans] troubles psychocomportementaux

Contexte : plaintes cognitives du patient confirmées par l'hétéroanamnèse depuis [X mois/années] d'apparition [brutale/insidieuse] évoluant [par palier/de manière progressive]. Présence de difficultés mnésiques, orientation dans le temps et l'espace, manque du mot. Observation de l'équipe montrant des difficultés d'intégration des consignes. Ces troubles cognitifs ont des répercussions sur les AVQ ([besoin d'aide pour la toilette et l'habillage, incontinence urinaire, besoin d'accompagnement pour les transferts et pour se rendre aux toilettes, besoin d'assistance pour les repas]) et AIVQ ([incapacité de gérer les finances, les médicaments, d'utiliser le téléphone et les transports publics, besoin d'aide pour les courses, la lessive et le ménage, et les repas]).

Investigations :
MOCA à [X]/30 avec perte des points - au visuospatial, - à la dénomination, - à l'attention, - au langage, - à l'abstraction, - au rappel des mots avec indiçage [positif/négatif], - à l'orientation.
Mini-GDS à [X]/4.
[CT/IRM cérébrale le [date] :] [résultats]
[Bilan neuropsychologique le [date] :] [résultats]

Discussion :
En l'absence d'un ECA et d'un trouble de l'humeur franc, nous retenons un syndrome démentiel. Les répercussions sur les activités de la vie quotidienne nous permettent de poser le diagnostic d'un trouble neurocognitif [mineur/majeur] de stade CDR [X]. L'origine est probablement [mixte/dégénérative/vasculaire].
[Si patient jeune :] Au vu d'un patient jeune encore autonome à domicile, nous adressons [M/Mme] au Centre Mémoire afin de réévaluer l'indication à un traitement pro-cognitif.
[Si patient âgé :] Au vu de l'âge du patient, nous renonçons à poursuivre les investigations.

Propositions :
Activités physiques et intellectuelles régulières, contrôler les facteurs de risque cardiovasculaire.
Éviter les benzodiazépines et les anticholinergiques.
[Si indication :] Consultation au Centre Mémoire afin de réévaluer l'indication à un traitement procognitif.""",

    "confusion": """État confusionnel [mixte/hypoactif/hyperactif] sur [cause]

Contexte : Le patient présente un trouble de l'attention brutal et fluctuant, avec discours incohérent et trouble de la vigilance. L'examen clinique ne retrouve pas de point d'appel infectieux. Les scores RADAR sont positifs.

Investigations :
Laboratoire : électrolytes dans la norme, tests hépatiques dans la norme, CRP à [X] mg/l, leucocytes à [X] G/l.
Bladder : [X] ml
SSU : [résultat]
Uricult : [résultat]
Rx thoracique : [résultat]
Facteurs prédisposants : âge, hypoacousie, malvoyance, s/p AVC, prise de psychotropes, trouble neurocognitif
Facteurs précipitants : infection, déshydratation, globe, fécalome, troubles électrolytiques, douleur.

Discussion :
Les investigations retrouvent [un globe/un fécalome/une infection].
Nous procédons à une réafférentation, avec un suivi du transit et des mictions [et traitement de l'infection / et correction des troubles électrolytiques / et adaptation du traitement antalgique].
Nous procédons à une réafférentation régulière et introduisons des mesures non pharmacologiques permettant la régression des symptômes. [Si besoin :] Nous rajoutons un traitement par Haldol/Quétiapine en réserve.
Nous retenons comme facteur prédisposant une maladie neurocognitive CDR [X].
L'évolution est favorable avec un rétablissement du rythme nycthéméral, de l'attention et de la vigilance.

Recommandation :
Éviter benzodiazépines et anticholinergiques. Bilan neuropsychologique à 3 mois.""",

    "chutes": """Troubles de la marche et de l'équilibre avec chutes à répétition

Contexte : [Description de la chute / le/la patient/e rapporte plusieurs chutes cette dernière année, a priori mécaniques. Il/Elle se déplace [avec/sans] moyen auxiliaire à domicile.]

Investigations :
Laboratoire : bilan phospho-calcique dans la norme, 25-OH-Vitamine D3 à [X] nmol/l
ECG : Fréquence cardiaque à [X] bpm, rythme [sinusal régulier/irrégulier], intervalle PR [X] ms, [normoaxé/déviation axiale], complexe QRS à [X] ms, segments ST [isoélectriques/anomalies], onde T [description]. QTc selon Framingham à [X] ms.
Test de Schellong : [positif/négatif]

Facteurs de risque retenus pour les chutes :
- Facteurs intrinsèques : [malvoyance, hypoacousie, séquelle d'AVC, maladie de Parkinson, PNP, trouble cognitif, troubles de l'humeur, trouble du rythme cardiaque, urgences mictionnelles, hypovitaminose D, hypotension orthostatique, s/p PTH/PTG, douleurs chroniques, dénutrition avec sarcopénie, hallux valgus, orteils en marteau, pieds plats ou creux]
- Facteurs extrinsèques : [Médicaments à effet sédatifs ou hypotenseurs (citer les médicaments), moyen auxiliaire inadapté, barrières architecturales]

Discussion :
Le Schellong [ne permet pas de retenir une hypotension orthostatique comme facteur de risque de chute / retient une hypotension orthostatique comme facteur de risque de chute et nous préconisons le port de bas de contention (sauf si AOMI)].
Nous [substituons une carence en vitamine D / poursuivons la substitution en vitamine D].
[Si douleur :] Nous proposons une antalgie par [médicament].

Durant le séjour, le patient bénéficie d'une prise en charge pluridisciplinaire par l'équipe de physiothérapie, d'ergothérapie et de nutrition avec une bonne collaboration ce qui lui permet d'améliorer son statut fonctionnel avec un périmètre de marche atteignant [X] m avec [moyen auxiliaire] en fin de séjour.

[Si transfert CTR :] Au vu du potentiel de progression, nous organisons avec son accord son transfert en réadaptation le [date] afin qu'il/elle poursuive son processus de réadaptation, reconditionnement global et réentraînement à l'effort en vue d'un retour à domicile par la suite.

Propositions :
Séances de physiothérapie en ambulatoire.
Calcium 500 mg et vitamine D 800 unités par jour en prévention.""",

    "denutrition": """[Dénutrition protéino-calorique / Malnutrition protéino-énergétique] [légère/modérée/sévère] [GRSP / selon critères Swiss DRG]

Contexte :
À domicile poids stable entre [X] et [X] kg.
[A priori pas de perte pondérale sur poids sec / Perte pondérale de X kg sur X mois soit X% de son poids]
[Nausées importantes dans un contexte de...] / [Appétit conservé et pas de perte pondérale décrite / Appétit diminué depuis X semaines]
Mini-MNA à [X]/14.
NRS à [X]/7.
BMI [X] kg/m².

Investigations :
Laboratoire : albumine à [X] g/l
Score Mini MNA : [X]/14
Score NRS : [X]/7
Facteurs de risque retenus pour la dénutrition : [troubles cognitifs, dépression, mycose buccale, dysphagie, épigastralgie, reflux, constipation, processus oncologique, processus infectieux ou inflammatoire, polymédication, isolement, manque de ressources financières, dentier mal adapté]

Évaluation par notre diététicienne :
Diagnostic nutritionnel : E44.1 Malnutrition protéino-énergétique [légère/modérée/sévère] selon critères Swiss DRG
Suivi nutritionnel : hebdomadaire
Objectif : [maintien/renutrition] par ingestion de [X] kcal/j avec la prise de [X] supplément(s) nutritif(s) oral/oraux

Évolution en réadaptation :
[X]x Fresubin 2kcal compact prescrit dès le [date], consommés et appréciés.
Évolution [favorable/défavorable] avec [maintien du poids/reprise du poids].
Poids cible à [X] kg (poids à la sortie [X] kg).
[Si suivi domicile :] Suivi par AxelCare à domicile.

Proposition :
Poursuite du suivi nutritionnel [à domicile avec Axelcare / au CTR].""",

    "constipation": """Constipation sur coprostase

Contexte / discussion : Le/La patient/e présente une constipation devant laquelle nous prescrivons des laxatifs en fixe et en réserve et surveillons le transit quotidiennement.""",

    "incontinence": """Incontinence urinaire sur urgenturie

Contexte / discussion : incontinence d'urgence occasionnelle, connue, [avec/sans] port de protection à domicile. À l'UGA, le/la patient/e porte [type de protection].""",

    "retention_urinaire": """Rétention aiguë d'urine à [X] cc
Mise en place d'une sonde urinaire le [date]

Contexte / discussion : M/Mme est sondé/e le [date] sur un globe urinaire à [X] cc. Nous mettons en place un traitement par Pradif avec une tentative de sevrage le [date].

Investigations :
SSU : [résultat]
Uricult : [résultat]

Proposition :
Poursuite du traitement par Pradif au long cours [si homme avec suspicion d'HBP].""",

    "escarre": """Escarre de stade [I/II/III/IV] au niveau [localisation]

Contexte :
Apparition d'une escarre au niveau [localisation], le [date]. Nous surveillons l'évolution qui en fin de séjour est plutôt en amélioration, devenue une rougeur qui à la pression se revascularise vite, TRC < [X] sec.""",

    "infection": """[Type d'infection exact]

Contexte :
[Description du contexte clinique menant au diagnostic d'infection, avec les symptômes et la chronologie]

Investigations :
[Résultats d'imagerie pertinents]

Laboratoire :
[UNIQUEMENT les marqueurs infectieux pertinents : CRP, procalcitonine, leucocytes, avec évolution chronologique]

Microbiologie :
[Tous les résultats microbiologiques : frottis, antigènes urinaires, hémocultures, etc.]

Discussion :
[Raisonnement clinique menant au diagnostic, traitement instauré, évolution]

Proposition :
[Suivi recommandé]""",

    "consommation_oh": """Consommation OH à risque

Contexte :
Le/La patient/e décrit une consommation d'alcool régulière à domicile estimée à [description : X unités par jour, types d'alcool]. Habituellement, il/elle [ne consomme pas d'autres types d'alcool / consomme également...].
Pour rappel, M/Mme [conduit toujours / ne conduit plus].
[Le/La patient/e a été informé/e des risques liés à sa consommation d'alcool.]
Les scores CIWA étaient toujours négatifs, indiquant l'absence de symptômes de sevrage à l'hôpital.""",

    "isolement_social": """Isolement social

Contexte :
Le/La patient/e à l'anamnèse faite à l'entrée a rapporté vivre seul/e et passer la plupart de ses journées à la maison. Il/Elle a un contact téléphonique régulier avec [proche], [fréquence], et se dit [gêné/e / non gêné/e] par cette situation.

Propositions :
- Mise en place de livraisons de repas du lundi au vendredi afin de favoriser le maintien à domicile dans de bonnes conditions.""",

    "generique": """[Titre du problème]

Contexte :
[Description du contexte clinique]

Investigations :
[Résultats pertinents]

Discussion :
[Raisonnement clinique et prise en charge]

Proposition :
[Suivi recommandé]"""
}


# ==============================================================================
# ÉTAPE 3 : ASSEMBLAGE final de la lettre
# ==============================================================================

PROMPT_ASSEMBLAGE = """Tu es un médecin hospitalier finalisant une lettre de sortie/transfert.

## MISSION
Assemble les sections générées en une lettre médicale cohérente.

## RÈGLES STRICTES
1. NE PAS ajouter d'introduction générale avant les problèmes
2. NE PAS ajouter de conclusion après les problèmes (pas de "En résumé", "Pour conclure", etc.)
3. Garder UNIQUEMENT la formule d'appel et la signature
4. Les sections des problèmes sont déjà complètes - ne pas les modifier
5. NE PAS utiliser de formatage markdown (## ### **) - texte brut uniquement

## FORMAT EXACT

```
Cher Confrère, Chère Consœur,

Nous vous adressons ce compte-rendu concernant votre patient(e) [Nom], [âge] ans, hospitalisé(e) du [date] au [date] dans notre service pour [motif principal].

[INSÉRER ICI LES SECTIONS DES PROBLÈMES - SANS MODIFICATION]

---

Habitus/Social :
[Alcool, tabac, habitat, escaliers, ascenseur, avec qui vit le patient, aide à domicile, repas, ménage, déplacements, moyen auxiliaire]

PROJET GLOBAL : [RAD / CTR / EMS / Transfert]

Bilan gériatrique standardisé :

| Examen | Date | Score | Interprétation |
|--------|------|-------|----------------|
| Barthel | [date] | [X]/100 | [Interprétation] |
| Tinetti | [date] | [X]/7 | [Interprétation] |
| TUG | [date] | [X] sec | [Interprétation] |
| SPPB | [date] | [X]/12 | [Interprétation] |
| MOCA | [date] | [X]/30 | [Interprétation] |
| Mini-GDS | [date] | [X]/4 | [Interprétation] |
| MNA | [date] | [X]/14 | [Interprétation] |
| NRS | [date] | [X]/7 | [Interprétation] |
| BMI | [date] | [X] kg/m² | [Interprétation] |

---

Éléments à surveiller après l'hospitalisation :
[Liste à puces consolidant TOUTES les propositions de chaque section]

Traitement de sortie :
[Liste des médicaments avec posologie exacte]

---

Le traitement de sortie figure en annexe.

Nous restons à votre disposition pour tout renseignement complémentaire.

Avec nos meilleures salutations.

Dr [Nom]
Département de Gériatrie, Réadaptation et Soins Palliatifs
RHNe - Réseau Hospitalier Neuchâtelois
```

## CE QU'IL NE FAUT PAS FAIRE
- ❌ "Ce compte-rendu détaille les différents problèmes pris en charge..."
- ❌ "En résumé, le séjour a permis de..."
- ❌ "Nous espérons que ces informations vous seront utiles..."
- ❌ Toute phrase de liaison ou de transition entre les problèmes
- ❌ Formatage markdown (## ### **) dans le texte

Assemble maintenant la lettre finale."""
