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
