# CHANGELOG — readaptation.py (prompts)

## 2026-05-20 — R2 : Contrainte de longueur des sections

- **Fichier** : `backend/prompts/readaptation.py`, PROMPT_SECTIONS, bloc INSTRUCTIONS FINALES
- **Nature** : Ajout du point 7 (LONGUEUR) avec seuils cibles :
  - Probleme secondaire : 150-400 mots
  - Diagnostic principal : 400-700 mots
- **Motivation** : Audit du 19.05.2026 — 84% des sections corrigees par Martina sont raccourcies (delta moyen -21%, n=19, 0% allongees). Defaut systeme probable.
- **Mesure d'effet attendue** : Prochain audit apres ~15-20 nouvelles sessions. Comparer fiabilite sections et delta de longueur AVANT vs APRES le 2026-05-20.

## 2026-04-16 — R1 : Criteres de selection des problemes

- **Fichier** : `backend/prompts/readaptation.py`, PROMPT_EXTRACTION
- **Nature** : Ajout des blocs "CRITERES STRICTS DE SELECTION DES PROBLEMES", "CATEGORIES A NE PAS INCLURE", "REGLE FINALE DE SELECTION". Restructuration des templates de section (titre "Contexte :" obligatoire).
- **Motivation** : Analyse de 85 corrections Martina — sur-generation massive de problemes (moy 9.1 generes vs 6.6 valides).
- **Effet mesure (audit 19.05.2026)** : Problemes generes passes de 9.1 a 5.9 (-35%). Items supprimes par Martina passes de 50 a 13 (-74%). Les categories ciblees (HTA, surpoids, douleurs post-op, constipation, symptomes moteurs) ont disparu des suppressions. Patch valide.
