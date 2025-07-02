-- Script pour créer la table d'historique des audits
-- À exécuter dans Supabase SQL Editor

-- Table pour stocker l'historique des audits
CREATE TABLE IF NOT EXISTS audit_history (
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

-- Indexer par email utilisateur et timestamp pour les requêtes
CREATE INDEX IF NOT EXISTS idx_audit_history_user_email ON audit_history(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_history_timestamp ON audit_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_history_user_timestamp ON audit_history(user_email, timestamp DESC);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_audit_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_audit_history_updated_at
  BEFORE UPDATE ON audit_history
  FOR EACH ROW
  EXECUTE FUNCTION update_audit_history_updated_at();

-- Politique RLS pour la sécurité
ALTER TABLE audit_history ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que leurs propres audits
CREATE POLICY "Users can view their own audit history"
  ON audit_history FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Les utilisateurs ne peuvent insérer que leurs propres audits
CREATE POLICY "Users can insert their own audits"
  ON audit_history FOR INSERT
  WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Les utilisateurs ne peuvent supprimer que leurs propres audits
CREATE POLICY "Users can delete their own audits"
  ON audit_history FOR DELETE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Commentaires pour la documentation
COMMENT ON TABLE audit_history IS 'Historique des audits d''accessibilité par utilisateur';
COMMENT ON COLUMN audit_history.user_email IS 'Email de l''utilisateur qui a effectué l''audit';
COMMENT ON COLUMN audit_history.url IS 'URL du site audité';
COMMENT ON COLUMN audit_history.timestamp IS 'Date et heure de l''audit';
COMMENT ON COLUMN audit_history.score IS 'Score d''accessibilité (0-100)';
COMMENT ON COLUMN audit_history.total_violations IS 'Nombre total de violations trouvées';
COMMENT ON COLUMN audit_history.engine IS 'Moteur d''analyse utilisé (wave, axe, rgaa, all)';
COMMENT ON COLUMN audit_history.result IS 'Résultat complet de l''audit au format JSON'; 