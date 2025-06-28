'use client';

import { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface BetaProtectionProps {
  children: React.ReactNode;
}

interface BetaAuthContextType {
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const BetaAuthContext = createContext<BetaAuthContextType | null>(null);

export const useBetaAuth = () => {
  const context = useContext(BetaAuthContext);
  if (!context) {
    throw new Error('useBetaAuth must be used within BetaProtection');
  }
  return context;
};

export default function BetaProtection({ children }: BetaProtectionProps) {
  const { logout: authLogout, isAuthenticated } = useAuth();

  // ACCÈS LIBRE - Laisser passer tout le monde (connecté ou non)
    const mockLogout = async () => {
    if (isAuthenticated) {
    await authLogout();
    }
  };

    return (
    <BetaAuthContext.Provider value={{ logout: mockLogout, isAuthenticated }}>
        {children}
      </BetaAuthContext.Provider>
    );

} 