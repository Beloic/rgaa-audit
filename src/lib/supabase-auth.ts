import { createClient } from '@supabase/supabase-js';
import type { User as UserType } from '@/types/user';
import bcrypt from 'bcryptjs';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ntzppsdyidqonusibocc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50enBwc2R5aWRxb251c2lib2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc3NjEsImV4cCI6MjA2NjY4Mzc2MX0.XybM_Rjat5A3EZGHHP_oUNtePrB_krvysqCtuOJtcws';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonctions utilitaires pour les mots de passe
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Types pour Supabase
interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  password: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  email_verified: boolean;
  email_verification_token?: string;
  email_verification_sent_at?: string;
  beta_access_granted: boolean;
  beta_access_granted_at?: string;
  beta_access_has_quit: boolean;
  subscription_plan: string;
  subscription_status: string;
  subscription_start_date: string;
  subscription_trial_ends_at?: string;
  subscription_ends_at?: string;
  audits_this_month: number;
  audits_today: number;
  audits_total: number;
  last_audit_date?: string;
  team_members: number;
  storage_used: number;
  default_language: string;
  email_notifications: boolean;
  weekly_reports: boolean;
  theme: string;
  timezone: string;
}

// Conversion de SupabaseUser vers notre type User
const supabaseUserToUser = (supabaseUser: SupabaseUser): UserType => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  name: supabaseUser.name,
  password: supabaseUser.password,
  createdAt: supabaseUser.created_at,
  lastLoginAt: supabaseUser.last_login_at || supabaseUser.created_at,
  emailVerified: supabaseUser.email_verified,
  emailVerificationToken: supabaseUser.email_verification_token,
  emailVerificationSentAt: supabaseUser.email_verification_sent_at,
  betaAccess: {
    granted: supabaseUser.beta_access_granted,
    grantedAt: supabaseUser.beta_access_granted_at,
    hasQuit: supabaseUser.beta_access_has_quit
  },
  subscription: {
    plan: supabaseUser.subscription_plan as 'free' | 'pro' | 'enterprise',
    status: supabaseUser.subscription_status as 'trial' | 'active' | 'cancelled' | 'expired',
    startDate: supabaseUser.subscription_start_date,
    endDate: supabaseUser.subscription_ends_at,
    trialEndsAt: supabaseUser.subscription_trial_ends_at
  },
  usage: {
    auditsThisMonth: supabaseUser.audits_this_month,
    auditsToday: supabaseUser.audits_today,
    auditsTotal: supabaseUser.audits_total,
    lastAuditDate: supabaseUser.last_audit_date,
    teamMembers: supabaseUser.team_members,
    storageUsed: supabaseUser.storage_used
  },
  settings: {
    defaultLanguage: supabaseUser.default_language as 'fr' | 'en',
    emailNotifications: supabaseUser.email_notifications,
    weeklyReports: supabaseUser.weekly_reports,
    theme: supabaseUser.theme as 'light' | 'dark' | 'system',
    timezone: supabaseUser.timezone
  }
});

// Fonctions d'authentification avec Supabase
export const getUserByEmail = async (email: string): Promise<UserType | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return supabaseUserToUser(data);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

export const createUser = async (userData: {
  email: string;
  name: string;
  password: string;
  emailVerificationToken?: string;
}): Promise<UserType> => {
  try {
    const hashedPassword = await hashPassword(userData.password);
    
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const newUser = {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      email_verification_token: userData.emailVerificationToken,
      email_verification_sent_at: userData.emailVerificationToken ? new Date().toISOString() : null,
      subscription_trial_ends_at: trialEndsAt.toISOString(),
      email_verified: false,
      beta_access_granted: false,
      beta_access_has_quit: false,
      subscription_plan: 'free',
      subscription_status: 'trial',
      subscription_start_date: new Date().toISOString(),
      audits_this_month: 0,
      audits_today: 0,
      audits_total: 0,
      last_audit_date: null,
      team_members: 1,
      storage_used: 0,
      default_language: 'fr',
      email_notifications: true,
      weekly_reports: false,
      theme: 'system',
      timezone: 'Europe/Paris'
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    return supabaseUserToUser(data);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw new Error('Impossible de créer l\'utilisateur');
  }
};

export const saveUser = async (user: UserType): Promise<void> => {
  try {
    const updateData = {
      name: user.name,
      last_login_at: user.lastLoginAt,
      email_verified: user.emailVerified,
      email_verification_token: user.emailVerificationToken,
      email_verification_sent_at: user.emailVerificationSentAt,
      beta_access_granted: user.betaAccess?.granted || false,
      beta_access_granted_at: user.betaAccess?.grantedAt,
      beta_access_has_quit: user.betaAccess?.hasQuit || false,
      subscription_plan: user.subscription?.plan || 'free',
      subscription_status: user.subscription?.status || 'trial',
      subscription_start_date: user.subscription?.startDate || new Date().toISOString(),
      subscription_trial_ends_at: user.subscription?.trialEndsAt,
      subscription_ends_at: user.subscription?.endDate,
      audits_this_month: user.usage?.auditsThisMonth || 0,
      audits_today: user.usage?.auditsToday || 0,
      audits_total: user.usage?.auditsTotal || 0,
      last_audit_date: user.usage?.lastAuditDate,
      team_members: user.usage?.teamMembers || 1,
      storage_used: user.usage?.storageUsed || 0,
      default_language: user.settings?.defaultLanguage || 'fr',
      email_notifications: user.settings?.emailNotifications ?? true,
      weekly_reports: user.settings?.weeklyReports ?? false,
      theme: user.settings?.theme || 'system',
      timezone: user.settings?.timezone || 'Europe/Paris'
    };

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', user.email);

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    throw new Error('Impossible de sauvegarder l\'utilisateur');
  }
}; 