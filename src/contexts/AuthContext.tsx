'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mot de passe de la bêta depuis les variables d'environnement
const BETA_PASSWORD = process.env.NEXT_PUBLIC_BETA_PASSWORD || 'rgaa2025beta';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedAuth = localStorage.getItem('rgaa-beta-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === BETA_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
      localStorage.setItem('rgaa-beta-auth', 'true');
      return true;
    } else {
      setError('Mot de passe incorrect. Veuillez réessayer.');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('rgaa-beta-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 