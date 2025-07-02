/**
 * Utilitaires pour la gestion robuste du storage côté client
 * Compatible SSR et gestion des erreurs pour la production
 */

export type StorageType = 'local' | 'session';

/**
 * Vérifier si le storage est disponible
 */
export const isStorageAvailable = (type: StorageType = 'local'): boolean => {
  if (typeof window === 'undefined') {
    return false; // SSR
  }
  
  try {
    const storage = type === 'local' ? localStorage : sessionStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn(`${type}Storage non disponible:`, error);
    return false;
  }
};

/**
 * Obtenir une valeur du storage de manière sécurisée
 */
export const getStorageItem = (key: string, type: StorageType = 'local'): string | null => {
  if (!isStorageAvailable(type)) {
    return null;
  }
  
  try {
    const storage = type === 'local' ? localStorage : sessionStorage;
    return storage.getItem(key);
  } catch (error) {
    console.error(`Erreur lecture ${type}Storage pour ${key}:`, error);
    return null;
  }
};

/**
 * Définir une valeur dans le storage de manière sécurisée
 */
export const setStorageItem = (key: string, value: string, type: StorageType = 'local'): boolean => {
  if (!isStorageAvailable(type)) {
    return false;
  }
  
  try {
    const storage = type === 'local' ? localStorage : sessionStorage;
    storage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Erreur écriture ${type}Storage pour ${key}:`, error);
    return false;
  }
};

/**
 * Supprimer une valeur du storage de manière sécurisée
 */
export const removeStorageItem = (key: string, type: StorageType = 'local'): boolean => {
  if (!isStorageAvailable(type)) {
    return false;
  }
  
  try {
    const storage = type === 'local' ? localStorage : sessionStorage;
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erreur suppression ${type}Storage pour ${key}:`, error);
    return false;
  }
};

/**
 * Obtenir et parser un objet JSON du storage
 */
export const getStorageObject = <T>(key: string, type: StorageType = 'local'): T | null => {
  const value = getStorageItem(key, type);
  if (!value) return null;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Erreur parsing JSON ${type}Storage pour ${key}:`, error);
    return null;
  }
};

/**
 * Sauvegarder un objet JSON dans le storage
 */
export const setStorageObject = <T>(key: string, value: T, type: StorageType = 'local'): boolean => {
  try {
    const jsonString = JSON.stringify(value);
    return setStorageItem(key, jsonString, type);
  } catch (error) {
    console.error(`Erreur stringify JSON ${type}Storage pour ${key}:`, error);
    return false;
  }
};

/**
 * Gestion spécifique de l'audit gratuit
 */
export const hasUsedFreeAudit = (): boolean => {
  const used = getStorageItem('rgaa-free-audit-used');
  return !!used;
};

export const markFreeAuditAsUsed = (): boolean => {
  const success = setStorageItem('rgaa-free-audit-used', 'true');
  if (success) {
    console.log('✅ Audit gratuit marqué comme utilisé');
  }
  return success;
};

/**
 * Alternative cookie-based pour les cas extrêmes
 * Utilise les cookies comme fallback si localStorage échoue
 */
export const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === 'undefined') return;
  
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (error) {
    console.error('Erreur définition cookie:', error);
  }
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (error) {
    console.error('Erreur lecture cookie:', error);
    return null;
  }
};

/**
 * Fallback robuste : localStorage → cookies → mémoire de session
 */
export const setFreeAuditUsedRobust = (): void => {
  // Essai localStorage
  if (setStorageItem('rgaa-free-audit-used', 'true')) {
    return;
  }
  
  // Fallback cookies (30 jours)
  setCookie('rgaa-free-audit-used', 'true', 30);
  console.log('📝 Utilisation des cookies comme fallback pour audit gratuit');
};

export const hasFreeAuditUsedRobust = (): boolean => {
  // Essai localStorage
  const localValue = getStorageItem('rgaa-free-audit-used');
  if (localValue) return true;
  
  // Fallback cookies
  const cookieValue = getCookie('rgaa-free-audit-used');
  return !!cookieValue;
}; 