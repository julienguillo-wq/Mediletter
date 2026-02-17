"""Prompts pour MedEntry UGA (bilan d'entrée gériatrique)."""

PROMPT_SYSTEM_UGA = "Tu es un médecin gériatre expérimenté. Tu rédiges des bilans d'entrée structurés et professionnels."

PROMPT_MEDENTRY_UGA = """Rédige une lettre d'entrée gériatrique structurée pour ce patient.

## INFORMATIONS PATIENT
- Identité: {sexe_label} {prenom} {nom}, {age} ans
- Date d'entrée: {date_entree}
- Provenance: {provenance_label}
- Motif d'hospitalisation: {motif_hospitalisation}
- Médecin traitant: {medecin_traitant}
- Antécédents: {antecedents}
- Traitement habituel: {traitement_habituel}

## ANAMNÈSE
Symptômes présents: {anamnese_symptomes}
{anamnese_remarques}

## STATUS CLINIQUE À L'ENTRÉE
Constantes: TA {ta_systolique}/{ta_diastolique} mmHg, FC {fc} bpm, SpO2 {spo2}%, T° {temperature}°C, GCS {gcs}/15
Poids: {poids} kg, Taille: {taille} cm
Anomalies à l'examen: {status_anomalies}
{status_details}
{status_remarques}

## ÉVALUATION GÉRIATRIQUE
- Mini-MNA (nutrition): {score_mna}
- MoCA (cognition): {score_moca}
- Mini-GDS (dépression): {score_gds}
- ADL (autonomie de base): {score_adl}
- IADL (autonomie instrumentale): {score_iadl}

## INFORMATIONS COMPLÉMENTAIRES
{situation_sociale}
{mode_vie}
{labo_entree}
{examens_complementaires}
{objectifs_sejour}
{autres_remarques}

## CONSIGNES DE RÉDACTION
1. Structure la lettre avec: En-tête, Motif d'admission, Anamnèse, Examen clinique, Évaluation gériatrique, Bilan paraclinique, Synthèse et objectifs
2. Utilise un style médical professionnel adapté à la gériatrie
3. Interprète les scores gériatriques et mentionne leur signification clinique
4. Propose des objectifs de prise en charge adaptés
5. Ne pas inventer d'informations non fournies"""
