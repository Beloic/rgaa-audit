-- Script de diagnostic et correction pour la table audit_accessibility_history
-- À exécuter dans Supabase SQL Editor si il y a des erreurs avec la table

-- 1. DIAGNOSTIC - Vérifier l'existence de la table et ses colonnes
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'audit_accessibility_history' 
ORDER BY ordinal_position;

-- 2. NETTOYAGE - Supprimer la table si elle existe avec des erreurs
-- ATTENTION: Ceci supprimera toutes les données existantes !
-- DROP TABLE IF EXISTS audit_accessibility_history CASCADE;

-- 3. RECRÉATION COMPLÈTE DE LA TABLE
-- Supprimez le commentaire ci-dessous pour forcer la recréation

/*
-- Supprimer la table existante (ATTENTION: perte de données!)
DROP TABLE IF EXISTS audit_accessibility_history CASCADE;

-- Recréer la table avec la structure correcte
CREATE TABLE audit_accessibility_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  url TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER NOT NULL DEFAULT 0,
  total_violations INTEGER NOT NULL DEFAULT 0,
  engine TEXT NOT NULL CHECK (engine IN ('wave', 'axe', 'rgaa', 'all')),
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recréer les index
CREATE INDEX idx_audit_accessibility_history_user_email ON audit_accessibility_history(user_email);
CREATE INDEX idx_audit_accessibility_history_timestamp ON audit_accessibility_history(timestamp);
CREATE INDEX idx_audit_accessibility_history_user_timestamp ON audit_accessibility_history(user_email, timestamp DESC);

-- Recréer le trigger
CREATE OR REPLACE FUNCTION update_audit_accessibility_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_audit_accessibility_history_updated_at
  BEFORE UPDATE ON audit_accessibility_history
  FOR EACH ROW
  EXECUTE FUNCTION update_audit_accessibility_history_updated_at();

-- Recréer les politiques RLS
ALTER TABLE audit_accessibility_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit accessibility history"
  ON audit_accessibility_history FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert their own accessibility audits"
  ON audit_accessibility_history FOR INSERT
  WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own accessibility audits"
  ON audit_accessibility_history FOR DELETE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
*/

-- 4. VÉRIFICATION FINALE
SELECT 'Table audit_accessibility_history créée avec succès' as status,
       COUNT(*) as nombre_colonnes
FROM information_schema.columns 
WHERE table_name = 'audit_accessibility_history'; 