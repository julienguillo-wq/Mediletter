-- Migration: Create mediletter_user_config table
-- Maps user emails to their service type (geriatrie or readaptation)
-- Used by the backend to load service-specific prompts

CREATE TABLE mediletter_user_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT UNIQUE,
  service_type TEXT CHECK (service_type IN ('geriatrie', 'readaptation')) DEFAULT 'geriatrie',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE mediletter_user_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own config"
  ON mediletter_user_config
  FOR SELECT
  USING (auth.uid() = user_id);

-- Seed initial users
INSERT INTO mediletter_user_config (user_email, service_type) VALUES
  ('giulia.scattu@gmail.com', 'geriatrie'),
  ('scattumartina99@gmail.com', 'readaptation');
