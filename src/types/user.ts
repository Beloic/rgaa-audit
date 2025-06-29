export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // Hash du mot de passe
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationSentAt?: string;
  betaAccess: {
    granted: boolean;
    grantedAt?: string;
    revokedAt?: string;
    hasQuit: boolean;
  };
  subscription: UserSubscription;
  usage: UserUsage;
  settings: UserSettings;
  organization?: Organization;
}

export interface UserSubscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
  customerId?: string; // Stripe customer ID
  subscriptionId?: string; // Stripe subscription ID
}

export interface UserUsage {
  auditsThisMonth: number;
  auditsToday?: number;
  auditsTotal: number;
  lastAuditDate?: string;
  teamMembers: number;
  storageUsed: number; // en MB
}

export interface UserSettings {
  defaultLanguage: 'fr' | 'en';
  emailNotifications: boolean;
  weeklyReports: boolean;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  limits: {
    auditsPerDay: number | 'unlimited';
    auditsPerMonth: number | 'unlimited';
    teamMembers: number | 'unlimited';
    storage: number | 'unlimited'; // en GB
    apiAccess: boolean;
    prioritySupport: boolean;
    customReports: boolean;
    whiteLabel: boolean;
  };
  popular?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invitedAt: string;
  joinedAt?: string;
  status: 'pending' | 'active' | 'disabled';
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  owner: string; // User ID
  members: TeamMember[];
  subscription: UserSubscription;
  usage: UserUsage;
  settings: {
    auditRetention: number; // jours
    defaultVisibility: 'private' | 'team' | 'public';
    branding: {
      enabled: boolean;
      logo?: string;
      colors?: {
        primary: string;
        secondary: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
} 