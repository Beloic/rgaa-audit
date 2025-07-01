import crypto from 'crypto';

// Fonctions utilitaires pour les mots de passe
export const hashPassword = async (password: string): Promise<string> => {
  const salt = 'salt-rgaa-2024'; // En production, utiliser un salt unique par utilisateur
  return crypto.createHash('sha256').update(password + salt).digest('hex');
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Générer un token de vérification
export const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Générer un token de réinitialisation de mot de passe sécurisé
export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Vérifier si un token de réinitialisation est encore valide
export const isPasswordResetTokenValid = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) > new Date();
};

// Générer un token de session simple (en production, utiliser JWT)
export const generateSessionToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Valider un email
export const isValidEmail = (email: string): boolean => {
  // Regex plus robuste pour la validation d'email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Vérifications supplémentaires
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false; // RFC 5321 limite
  if (email.includes('..')) return false; // Pas de points consécutifs
  
  return emailRegex.test(email.trim());
};

// Valider un mot de passe
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6; // Minimum 6 caractères
};

// Nettoyer les tokens expirés (utilitaire pour maintenance)
export const cleanupExpiredTokens = async () => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️ Configuration Supabase manquante pour le nettoyage');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('users')
      .update({
        password_reset_token: null,
        password_reset_expires_at: null,
        password_reset_sent_at: null
      })
      .lt('password_reset_expires_at', new Date().toISOString())
      .not('password_reset_token', 'is', null);
    
    if (error) {
      console.error('❌ Erreur lors du nettoyage des tokens:', error);
    } else {
      console.log('🧹 Tokens expirés nettoyés:', data?.length || 0);
    }
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}; 