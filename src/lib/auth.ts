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

// Générer un token de session simple (en production, utiliser JWT)
export const generateSessionToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Valider un email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valider un mot de passe
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6; // Minimum 6 caractères
}; 