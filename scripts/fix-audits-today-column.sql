-- Script de migration pour ajouter les colonnes manquantes
-- pour le système de limitation d'audits par jour

-- Ajouter la colonne audits_today si elle n'existe pas
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS audits_today INTEGER DEFAULT 0;

-- Ajouter la colonne last_audit_date si elle n'existe pas  
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_audit_date TIMESTAMP WITH TIME ZONE;

-- Mettre à jour les commentaires
COMMENT ON COLUMN users.audits_today IS 'Nombre d''audits effectués aujourd''hui';
COMMENT ON COLUMN users.last_audit_date IS 'Date et heure du dernier audit effectué';

-- Vérifier que les colonnes ont été ajoutées
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('audits_today', 'last_audit_date')
ORDER BY column_name; 