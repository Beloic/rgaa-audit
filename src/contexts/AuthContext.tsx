'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mot de passe de la bêta depuis les variables d'environnement
const BETA_PASSWORD = process.env.NEXT_PUBLIC_BETA_PASSWORD || 'RGAA_Audit_2025!Beta#Secure';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedAuth = localStorage.getItem('rgaa-beta-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let success = false;
      let failureReason = '';
      
      if (password === BETA_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem('rgaa-beta-auth', 'true');
        success = true;
      } else {
        success = false;
        failureReason = 'Mot de passe incorrect';
        setError('Mot de passe incorrect. Veuillez réessayer.');
      }
      
      // Enregistrer la tentative de connexion dans les statistiques
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success,
            failureReason: success ? undefined : failureReason
          }),
        });
      } catch (statsError) {
        console.error('Erreur lors de l\'enregistrement des stats:', statsError);
        // Ne pas faire échouer l'authentification si les stats ne fonctionnent pas
      }
      
      setIsLoading(false);
      return success;
      
    } catch (error) {
      // Enregistrer l'erreur système dans les stats
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            failureReason: 'Erreur système'
          }),
        });
      } catch (statsError) {
        console.error('Erreur lors de l\'enregistrement des stats:', statsError);
      }
      
      setError('Une erreur s\'est produite. Veuillez réessayer.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('rgaa-beta-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error, isLoading }}>
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