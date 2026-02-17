-- Migration 003: Table pour les corrections enrichies MediLetter (fine-tuning)
-- Stocke les paires (texte IA → texte médecin) avec contexte complet

CREATE TABLE IF NOT EXISTS mediletter_corrections (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type TEXT NOT NULL,                        -- 'problems' ou 'section'
    generated JSONB,                           -- texte ou liste généré par Claude
    validated JSONB,                           -- texte ou liste validé par le médecin
    section_index INTEGER,
    has_changes BOOLEAN DEFAULT FALSE,
    session_id TEXT,
    user_email TEXT,
    probleme_name TEXT,
    diagnostic_principal TEXT,
    model_used TEXT,
    donnees_extraites JSONB,                   -- données patient structurées
    textes_originaux TEXT,                     -- textes bruts du dossier
    problemes_list JSONB                       -- liste des problèmes
);

-- Index pour les requêtes courantes
CREATE INDEX idx_corrections_timestamp ON mediletter_corrections(timestamp DESC);
CREATE INDEX idx_corrections_user ON mediletter_corrections(user_email);
CREATE INDEX idx_corrections_has_changes ON mediletter_corrections(has_changes);
CREATE INDEX idx_corrections_type ON mediletter_corrections(type);
