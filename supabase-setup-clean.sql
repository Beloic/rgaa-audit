-- Script de nettoyage complet et création de la table users
-- Pour RGAA Audit avec Supabase

-- 1. NETTOYAGE COMPLET
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATION DE LA TABLE USERS
CREATE TABLE users (
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
  audits_total INTEGER DEFAULT 0,
  team_members INTEGER DEFAULT 1,
  storage_used INTEGER DEFAULT 0,
  
  -- Settings
  default_language VARCHAR(10) DEFAULT 'fr',
  email_notifications BOOLEAN DEFAULT TRUE,
  weekly_reports BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'system',
  timezone VARCHAR(50) DEFAULT 'Europe/Paris'
);

-- 3. INDEX
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 4. TRIGGER POUR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES RLS
CREATE POLICY "users_select_policy" ON users
    FOR SELECT USING (true);

CREATE POLICY "users_insert_policy" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "users_update_policy" ON users
    FOR UPDATE USING (true);

CREATE POLICY "users_delete_policy" ON users
    FOR DELETE USING (true);

-- 7. PERMISSIONS
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- 8. COMMENTAIRES
COMMENT ON TABLE users IS 'Table des utilisateurs de l''application RGAA Audit';
COMMENT ON COLUMN users.subscription_plan IS 'Plan: free, pro, enterprise';
COMMENT ON COLUMN users.subscription_status IS 'Statut: trial, active, cancelled, expired';

-- 9. TEST D'INSERTION
INSERT INTO users (email, name, password) 
VALUES ('test@rgaa-audit.com', 'Test User', '$2b$12$test.hash.example') 
ON CONFLICT (email) DO NOTHING;

-- 10. VERIFICATION
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position; 