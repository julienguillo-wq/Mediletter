# Pipelines de données MedApp

Deux pipelines alimentent l'app via des fichiers de données uniques consommés
par des moteurs de rendu uniques, avec le même garde-fou `valide:false`.

- **Scores** : `scrape_medicalcul.py` + `reformulate_geriatrie.py` → `data/scores.json`
- **Guidelines** : `fetch_wikem.py` + `adapt_wikem.py` → `data/guidelines.json`

---

# Pipeline scores — medicalcul.free.fr → scores.json

Extraction des scores/échelles médicales depuis `medicalcul.free.fr` vers un
fichier de données unique consommé par un moteur de rendu unique côté app.

## Étapes

1. **Extraction** — `python scrape_medicalcul.py --all`
   - Parse l'index alphabétique puis chaque page de score.
   - Extrait : nom, spécialité → catégorie app, items/variables + options,
     formule brute (JS `f_Calculer`), interprétation, référence biblio.
   - Cache local (`_cache/`, gitignoré) + retries → reprise possible.
   - Écrit `../data/scores.json`.
   - Encodage mixte du site (latin-1 + UTF-8) réparé automatiquement.

2. **Reformulation** — `python reformulate_geriatrie.py`
   - Reformule (paraphrase, **jamais de copier-coller**) et structure
     `interpretation[]` `{min,max,texte,severite}` en respectant les seuils
     **explicites** de la source. Actuellement : les 12 scores gériatriques.

3. **Séparation livrable / brut**
   - `../data/scores.json` (commité) : **sans** texte verbatim du site.
   - `_raw/scores_raw.json` (gitignoré) : champs bruts
     (`_interpretation_source`, `_formule_source`) conservés pour la validation.

## Schéma d'un score

```json
{
  "id": "gds15", "nom": "...", "categorie": "geriatrie",
  "description": "...", "items": [{ "type": "choix|nombre", "variable": "...", "label": "...", "options": [...] }],
  "formule": "", "interpretation": [{ "min": 0, "max": 4, "texte": "...", "severite": "normal|warning|danger|null" }],
  "reference": "...", "valide": false, "reformule": true, "source_url": "..."
}
```

## Garde-fou : `valide: false`

Tout score importé est **`valide: false`** et ne doit **pas** s'afficher en
production tant qu'il n'a pas été validé cliniquement (formule, seuils, libellés)
par le Dr Scattu → passage manuel à `valide: true`. Une formule médicale erronée
est inacceptable : la validation humaine est obligatoire.

## Reste à faire

- Dériver/valider `formule` depuis `_formule_source` (JS `f_Calculer`) par score.
- Reformuler les catégories restantes (cardio, néphro, neuro, réa, pneumo, gastro…).
- Brancher le moteur de rendu unique sur `scores.json` (n'afficher que `valide:true`).

---

# Pipeline guidelines — wikem.org → guidelines.json

Extraction depuis WikEM (médecine d'urgence, **CC BY-SA**) via l'**API MediaWiki**
(préférée au scraping HTML), traduction française et adaptation au contexte
gériatrique / recos françaises, puis structuration au schéma app.

## Étapes

1. **Extraction** — `python fetch_wikem.py`
   - API MediaWiki (`action=parse` wikitext+sections, `action=query` date de révision).
   - Parse le wikitext en sections `{titre, niveau, type, contenu}` (détection
     texte / etapes / tableau_poso).
   - Sortie brute anglaise → `_raw/raw_wikem.json` (gitignoré).

2. **Adaptation (IA)** — `python adapt_wikem.py`
   - Traduction FR + adaptation gériatrique, restructuration au schéma, dérivation
     des `red_flags[]`. Écrit `../data/guidelines.json`.

## Schéma d'une guideline

```json
{
  "id": "delirium", "titre": "...", "categorie": "geria",
  "sources": [{ "nom": "WikEM", "licence": "CC BY-SA", "url": "..." }],
  "date_maj": "2026-03-22", "temps_lecture": 6, "relu_par": "", "valide": false,
  "red_flags": ["..."],
  "sections": [{ "titre": "...", "type": "texte|etapes|tableau_poso", "contenu": [ ... ] }]
}
```

## Garde-fous

- **`valide: false` / `relu_par: ""`** : publication seulement après relecture
  clinique du Dr Scattu (le badge « Relu par » reflète ce statut).
- **Attribution WikEM (CC BY-SA) obligatoire** à l'affichage : badge source sur
  chaque guideline + mention en pied de page de lecture.

## Reste à faire

- Adapter d'autres pages WikEM (syncope, hyponatrémie… déjà extraites en brut).
- Brancher la vue lecture data-driven sur `guidelines.json` (étapes cochables,
  tableaux de posologies), n'afficher que `valide:true`.
