-- Script pour ajouter les colonnes manquantes à la table users
-- Sans perdre les données existantes

-- 1. Ajouter les colonnes d'audit si elles n'existent pas
DO $$ 
BEGIN
    -- audits_today
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='audits_today') THEN
        ALTER TABLE users ADD COLUMN audits_today INTEGER DEFAULT 0;
    END IF;
    
    -- audits_total  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='audits_total') THEN
        ALTER TABLE users ADD COLUMN audits_total INTEGER DEFAULT 0;
    END IF;
    
    -- audits_this_month
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='audits_this_month') THEN
        ALTER TABLE users ADD COLUMN audits_this_month INTEGER DEFAULT 0;
    END IF;
    
    -- last_audit_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='last_audit_date') THEN
        ALTER TABLE users ADD COLUMN last_audit_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- team_members
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='team_members') THEN
        ALTER TABLE users ADD COLUMN team_members INTEGER DEFAULT 1;
    END IF;
    
    -- storage_used
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='storage_used') THEN
        ALTER TABLE users ADD COLUMN storage_used INTEGER DEFAULT 0;
    END IF;
    
    -- default_language
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='default_language') THEN
        ALTER TABLE users ADD COLUMN default_language VARCHAR(10) DEFAULT 'fr';
    END IF;
    
    -- email_notifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='email_notifications') THEN
        ALTER TABLE users ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE;
    END IF;
    
    -- weekly_reports
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='weekly_reports') THEN
        ALTER TABLE users ADD COLUMN weekly_reports BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- theme
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='theme') THEN
        ALTER TABLE users ADD COLUMN theme VARCHAR(20) DEFAULT 'system';
    END IF;
    
    -- timezone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='timezone') THEN
        ALTER TABLE users ADD COLUMN timezone VARCHAR(50) DEFAULT 'Europe/Paris';
    END IF;
    
END $$;

-- 2. Mettre à jour les valeurs par défaut pour les utilisateurs existants
UPDATE users 
SET 
    audits_today = 0,
    audits_total = 0,
    audits_this_month = 0,
    team_members = 1,
    storage_used = 0,
    default_language = 'fr',
    email_notifications = TRUE,
    weekly_reports = FALSE,
    theme = 'system',
    timezone = 'Europe/Paris'
WHERE 
    audits_today IS NULL 
    OR audits_total IS NULL 
    OR audits_this_month IS NULL;

-- 3. Vérification - afficher la structure finale
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND column_name IN (
        'audits_today', 'audits_total', 'audits_this_month', 
        'last_audit_date', 'team_members', 'storage_used',
        'default_language', 'email_notifications', 'weekly_reports',
        'theme', 'timezone'
    )
ORDER BY column_name; 