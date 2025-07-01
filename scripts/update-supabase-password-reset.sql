-- Script SQL pour ajouter les colonnes de réinitialisation de mot de passe
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes pour la réinitialisation de mot de passe
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_sent_at TIMESTAMP WITH TIME ZONE;

-- Créer un index pour optimiser les recherches par token de réinitialisation
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN users.password_reset_token IS 'Token de réinitialisation de mot de passe (64 caractères hex)';
COMMENT ON COLUMN users.password_reset_expires_at IS 'Date d''expiration du token de réinitialisation (1 heure)';
COMMENT ON COLUMN users.password_reset_sent_at IS 'Date d''envoi de l''email de réinitialisation';

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('password_reset_token', 'password_reset_expires_at', 'password_reset_sent_at')
ORDER BY column_name; 