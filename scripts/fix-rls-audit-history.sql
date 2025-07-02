-- Script pour désactiver le RLS sur la table d'historique des audits
-- À exécuter dans Supabase SQL Editor

-- Désactiver Row Level Security sur la table audit_accessibility_history
-- Cela permet l'insertion depuis l'API côté serveur
ALTER TABLE audit_accessibility_history DISABLE ROW LEVEL SECURITY;

-- Vérifier que le RLS est bien désactivé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'audit_accessibility_history'; 