import fs from 'fs';
import path from 'path';
import type { User } from '@/types/user';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');

// Assurer que le dossier data existe
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Interface pour les données utilisateur
interface UserData {
  users: Record<string, User>;
}

interface AuditData {
  audits: any[];
}

// Lire les données utilisateur
export const readUsers = (): UserData => {
  ensureDataDir();
  
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return { users: {} };
    }
    
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture fichier utilisateurs:', error);
    return { users: {} };
  }
};

// Écrire les données utilisateur
export const writeUsers = (userData: UserData): void => {
  ensureDataDir();
  
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Erreur écriture fichier utilisateurs:', error);
    throw new Error('Impossible de sauvegarder les données utilisateur');
  }
};

// Obtenir un utilisateur par email
export const getUserByEmail = (email: string): User | null => {
  const userData = readUsers();
  return userData.users[email] || null;
};

// Sauvegarder un utilisateur
export const saveUser = (user: User): void => {
  const userData = readUsers();
  userData.users[user.email] = user;
  writeUsers(userData);
};

// Supprimer un utilisateur
export const deleteUser = (email: string): boolean => {
  const userData = readUsers();
  
  if (userData.users[email]) {
    delete userData.users[email];
    writeUsers(userData);
    return true;
  }
  
  return false;
};

// Obtenir tous les utilisateurs
export const getAllUsers = (): User[] => {
  const userData = readUsers();
  return Object.values(userData.users);
};

// Lire les audits
export const readAudits = (): AuditData => {
  ensureDataDir();
  
  try {
    if (!fs.existsSync(AUDITS_FILE)) {
      return { audits: [] };
    }
    
    const data = fs.readFileSync(AUDITS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture fichier audits:', error);
    return { audits: [] };
  }
};

// Écrire les audits
export const writeAudits = (auditData: AuditData): void => {
  ensureDataDir();
  
  try {
    fs.writeFileSync(AUDITS_FILE, JSON.stringify(auditData, null, 2));
  } catch (error) {
    console.error('Erreur écriture fichier audits:', error);
    throw new Error('Impossible de sauvegarder les données d\'audit');
  }
};

// Sauvegarder un audit
export const saveAudit = (audit: any): void => {
  const auditData = readAudits();
  auditData.audits.push({
    ...audit,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  });
  writeAudits(auditData);
};

// Obtenir les audits d'un utilisateur
export const getUserAudits = (userEmail: string): any[] => {
  const auditData = readAudits();
  return auditData.audits.filter(audit => audit.userEmail === userEmail);
}; 