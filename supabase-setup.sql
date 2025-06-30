-- Script SQL pour créer la table users dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Suppression de la table si elle existe (pour reset complet)
-- DROP TABLE IF EXISTS users;

-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Authentification
  last_login_at TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Beta access
  beta_access_granted BOOLEAN DEFAULT FALSE,
  beta_access_granted_at TIMESTAMP WITH TIME ZONE,
  beta_access_has_quit BOOLEAN DEFAULT FALSE,
  
  -- Subscription
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'trial',
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Usage tracking
  audits_this_month INTEGER DEFAULT 0,
  audits_today INTEGER DEFAULT 0,
  audits_total INTEGER DEFAULT 0,
  last_audit_date TIMESTAMP WITH TIME ZONE,
  team_members INTEGER DEFAULT 1,
  storage_used INTEGER DEFAULT 0,
  
  -- Settings
  default_language VARCHAR(10) DEFAULT 'fr',
  email_notifications BOOLEAN DEFAULT TRUE,
  weekly_reports BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'system',
  timezone VARCHAR(50) DEFAULT 'Europe/Paris'
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Activation de Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Supprimer les policies existantes si elles existent
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;

-- Politique RLS : les utilisateurs peuvent voir et modifier leurs propres données
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (true);

-- Politique pour l'inscription : permettre l'insertion
CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (true);

-- Grant des permissions
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;

-- Commentaires pour documentation
COMMENT ON TABLE users IS 'Table des utilisateurs de l''application RGAA Audit';
COMMENT ON COLUMN users.subscription_plan IS 'Plan d''abonnement: free, pro, enterprise';
COMMENT ON COLUMN users.subscription_status IS 'Statut: trial, active, cancelled, expired';
COMMENT ON COLUMN users.storage_used IS 'Stockage utilisé en MB'; 