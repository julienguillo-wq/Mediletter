-- ============================================
-- Migration 001 : Création de la table profiles
-- MedHub - Système d'authentification
-- ============================================
-- À exécuter dans l'éditeur SQL de Supabase :
-- https://app.supabase.com → SQL Editor → New Query
-- ============================================

-- 1. Création de la table profiles
-- Liée à auth.users via l'id
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    specialty TEXT NOT NULL DEFAULT '',       -- Spécialité médicale (ex: Gériatrie, Cardiologie)
    hospital TEXT DEFAULT '',                 -- Hôpital ou clinique
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Activer Row Level Security (RLS)
-- Chaque utilisateur ne peut accéder qu'à son propre profil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Politique de lecture : un utilisateur ne lit que son propre profil
CREATE POLICY "Les utilisateurs peuvent lire leur propre profil"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 4. Politique de mise à jour : un utilisateur ne modifie que son propre profil
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 5. Politique d'insertion : un utilisateur ne peut créer que son propre profil
CREATE POLICY "Les utilisateurs peuvent créer leur propre profil"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 6. Fonction trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email, specialty)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'specialty', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger qui se déclenche après chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 8. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger pour updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 10. Index pour les recherches par email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
