'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, PricingPlan } from '@/types/user';

// Configuration pour choisir entre API et localStorage
const USE_API = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_API === 'true';

// Fonctions utilitaires pour la gestion des mots de passe (localStorage uniquement)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt-rgaa-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Fonctions localStorage (fallback)
const getUserByEmail = (email: string): User | null => {
  if (USE_API) return null; // Utiliser l'API en production
  
  try {
    const usersData = localStorage.getItem('rgaa-users-data');
    if (!usersData) return null;
    
    const users: Record<string, User> = JSON.parse(usersData);
    return users[email] || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

const saveUserByEmail = (user: User): void => {
  if (USE_API) return; // Utiliser l'API en production
  
  try {
    const usersData = localStorage.getItem('rgaa-users-data');
    const users: Record<string, User> = usersData ? JSON.parse(usersData) : {};
    
    users[user.email] = user;
    localStorage.setItem('rgaa-users-data', JSON.stringify(users));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
  }
};

const deleteUserByEmail = (email: string): boolean => {
  if (USE_API) return false; // Utiliser l'API en production
  
  try {
    const usersData = localStorage.getItem('rgaa-users-data');
    if (!usersData) return false;
    
    const users: Record<string, User> = JSON.parse(usersData);
    if (users[email]) {
      delete users[email];
      localStorage.setItem('rgaa-users-data', JSON.stringify(users));
      console.log(`✅ Compte supprimé: ${email}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return false;
  }
};

// Fonctions API
const apiLogin = async (email: string, password: string): Promise<User> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erreur de connexion');
  }

  return data.user;
};

const apiRegister = async (email: string, password: string, name: string): Promise<User> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erreur d\'inscription');
  }

  return data.user;
};

const apiUpdateUser = async (email: string, updates: Partial<User>): Promise<User> => {
  const response = await fetch('/api/user/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, updates })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erreur de mise à jour');
  }

  return data.user;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  quitBeta: () => Promise<void>;
  hasBetaAccess: () => boolean;
  canPerformAudit: () => boolean;
  getRemainingAudits: () => number;
  getCurrentPlan: () => PricingPlan;
  isFeatureAvailable: (feature: string) => boolean;
  deleteUserByEmail: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Plans de tarification
const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    description: 'Parfait pour découvrir l\'audit d\'accessibilité',
    features: [
      '5 audits par mois',
      'Analyse RGAA, WAVE et Axe',
      'Rapports de base',
      'Support communautaire',
      'Historique 30 jours'
    ],
    limits: {
      auditsPerMonth: 2,
      teamMembers: 1,
      storage: 1,
      apiAccess: false,
      prioritySupport: false,
      customReports: false,
      whiteLabel: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    description: 'Idéal pour les professionnels et petites équipes',
    features: [
      '50 audits par mois',
      'Gestion d\'équipe (5 membres)',
      'Rapports PDF personnalisés',
      'Support prioritaire',
      'Historique illimité',
      'API REST',
      'Intégrations CI/CD'
    ],
    limits: {
      auditsPerMonth: 50,
      teamMembers: 5,
      storage: 10,
      apiAccess: true,
      prioritySupport: true,
      customReports: true,
      whiteLabel: false
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    currency: 'EUR',
    interval: 'month',
    description: 'Pour les grandes organisations',
    features: [
      'Audits illimités',
      'Équipe illimitée',
      'White-label complet',
      'Support dédié 24/7',
      'Formation personnalisée',
      'SLA garanti',
      'Déploiement on-premise',
      'Conformité SOC2/GDPR'
    ],
    limits: {
      auditsPerMonth: 'unlimited',
      teamMembers: 'unlimited',
      storage: 'unlimited',
      apiAccess: true,
      prioritySupport: true,
      customReports: true,
      whiteLabel: true
    }
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage (session)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('rgaa-user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          if (!USE_API) {
            // Mode localStorage - synchroniser avec les données persistantes
            const persistentUser = getUserByEmail(userData.email);
            if (persistentUser) {
              const syncedUser = {
                ...persistentUser,
                lastLoginAt: userData.lastLoginAt || persistentUser.lastLoginAt
              };
              setUser(syncedUser);
              localStorage.setItem('rgaa-user', JSON.stringify(syncedUser));
            } else {
              setUser(userData);
              saveUserByEmail(userData);
            }
          } else {
            // Mode API - utiliser directement les données de session
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
      
      let authenticatedUser: User;

      if (USE_API) {
        // Utiliser l'API
        authenticatedUser = await apiLogin(email, password);
      } else {
        // Utiliser localStorage
        const existingUser = getUserByEmail(email);
        
        if (!existingUser) {
          throw new Error('Aucun compte trouvé avec cette adresse email');
        }

        const isPasswordValid = await verifyPassword(password, existingUser.password);
        if (!isPasswordValid) {
          throw new Error('Mot de passe incorrect');
        }

        authenticatedUser = {
          ...existingUser,
          lastLoginAt: new Date().toISOString()
        };
        saveUserByEmail(authenticatedUser);
      }

      setUser(authenticatedUser);
      localStorage.setItem('rgaa-user', JSON.stringify(authenticatedUser));
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      let newUser: User;

      if (USE_API) {
        // Utiliser l'API
        newUser = await apiRegister(email, password, name);
      } else {
        // Utiliser localStorage
        const existingUser = getUserByEmail(email);
        if (existingUser) {
          throw new Error('Un compte existe déjà avec cette adresse email');
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
        
        const hashedPassword = await hashPassword(password);
        const verificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        
        newUser = {
          id: 'user-' + Date.now(),
          email,
          name,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: false,
          emailVerificationToken: verificationToken,
          emailVerificationSentAt: new Date().toISOString(),
          betaAccess: {
            granted: false,
            grantedAt: undefined,
            hasQuit: false
          },
          subscription: {
            plan: 'free',
            status: 'trial',
            startDate: new Date().toISOString(),
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          usage: {
            auditsThisMonth: 0,
            auditsTotal: 0,
            teamMembers: 1,
            storageUsed: 0
          },
          settings: {
            defaultLanguage: 'fr',
            emailNotifications: true,
            weeklyReports: false,
            theme: 'system',
            timezone: 'Europe/Paris'
          }
        };

        saveUserByEmail(newUser);
      }

      setUser(newUser);
      localStorage.setItem('rgaa-user', JSON.stringify(newUser));

      // Envoyer l'email de vérification
      if (!USE_API) {
        try {
          const response = await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email, 
              token: newUser.emailVerificationToken 
            }),
          });

          if (!response.ok) {
            console.warn('Échec de l\'envoi de l\'email de vérification');
          }
        } catch (emailError) {
          console.warn('Erreur lors de l\'envoi de l\'email:', emailError);
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('rgaa-user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      let updatedUser: User;

      if (USE_API) {
        // Utiliser l'API
        updatedUser = await apiUpdateUser(user.email, updates);
      } else {
        // Utiliser localStorage
        updatedUser = { ...user, ...updates };
        saveUserByEmail(updatedUser);
      }

      setUser(updatedUser);
      localStorage.setItem('rgaa-user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const quitBeta = async () => {
    if (user) {
      const updates = {
        betaAccess: {
          ...user.betaAccess,
          granted: false,
          hasQuit: true,
          revokedAt: new Date().toISOString()
        }
      };
      await updateUser(updates);
    }
  };

  const hasBetaAccess = (): boolean => {
    return false; // BÊTA DÉSACTIVÉE
  };

  const getCurrentPlan = (): PricingPlan => {
    const planId = user?.subscription?.plan || 'free';
    return PRICING_PLANS.find(plan => plan.id === planId) || PRICING_PLANS[0];
  };

  const canPerformAudit = (): boolean => {
    if (!user) return true; // Accès libre sans connexion

    const plan = getCurrentPlan();
    const currentUsage = user.usage.auditsThisMonth;

    if (plan.limits.auditsPerMonth === 'unlimited') {
      return true;
    }

    return currentUsage < (plan.limits.auditsPerMonth as number);
  };

  const getRemainingAudits = (): number => {
    if (!user) return 999999; // Illimité si pas connecté

    const plan = getCurrentPlan();
    const currentUsage = user.usage.auditsThisMonth;

    if (plan.limits.auditsPerMonth === 'unlimited') {
      return 999999;
    }

    return Math.max(0, (plan.limits.auditsPerMonth as number) - currentUsage);
  };

  const isFeatureAvailable = (feature: string): boolean => {
    if (!user) return false;

    const plan = getCurrentPlan();
    const limits = plan.limits;

    switch (feature) {
      case 'api':
        return limits.apiAccess;
      case 'priority-support':
        return limits.prioritySupport;
      case 'custom-reports':
        return limits.customReports;
      case 'white-label':
        return limits.whiteLabel;
      case 'team-management':
        return limits.teamMembers !== 1;
      default:
        return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    quitBeta,
    hasBetaAccess,
    canPerformAudit,
    getRemainingAudits,
    getCurrentPlan,
    isFeatureAvailable,
    deleteUserByEmail
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

// Export des plans pour utilisation dans d'autres composants
export { PRICING_PLANS }; 