'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from './LoginScreen';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, login, error } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} error={error || undefined} />;
  }

  return <>{children}</>;
} 