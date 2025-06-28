import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { User as UserType } from '@/types/user';

declare global {
  var prisma: PrismaClient | undefined;
}

// Singleton pattern pour Prisma Client
export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Types pour la conversion entre Prisma et notre type User
interface PrismaUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationSentAt: Date | null;
  lastLoginAt: Date | null;
  betaAccessGranted: boolean;
  betaAccessGrantedAt: Date | null;
  betaAccessHasQuit: boolean;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionStartDate: Date;
  subscriptionTrialEndsAt: Date | null;
  subscriptionEndsAt: Date | null;
  auditsThisMonth: number;
  auditsTotal: number;
  teamMembers: number;
  storageUsed: number;
  defaultLanguage: string;
  emailNotifications: boolean;
  weeklyReports: boolean;
  theme: string;
  timezone: string;
}

// Conversion de PrismaUser vers notre type User
const prismaUserToUser = (prismaUser: PrismaUser): UserType => ({
  id: prismaUser.id,
  email: prismaUser.email,
  name: prismaUser.name,
  password: prismaUser.password,
  createdAt: prismaUser.createdAt.toISOString(),
  lastLoginAt: prismaUser.lastLoginAt?.toISOString() || prismaUser.createdAt.toISOString(),
  emailVerified: prismaUser.emailVerified,
  emailVerificationToken: prismaUser.emailVerificationToken || undefined,
  emailVerificationSentAt: prismaUser.emailVerificationSentAt?.toISOString(),
  betaAccess: {
    granted: prismaUser.betaAccessGranted,
    grantedAt: prismaUser.betaAccessGrantedAt?.toISOString(),
    hasQuit: prismaUser.betaAccessHasQuit
  },
  subscription: {
    plan: prismaUser.subscriptionPlan as 'free' | 'pro' | 'enterprise',
    status: prismaUser.subscriptionStatus as 'trial' | 'active' | 'cancelled' | 'expired',
    startDate: prismaUser.subscriptionStartDate.toISOString(),
    endDate: prismaUser.subscriptionEndsAt?.toISOString(),
    trialEndsAt: prismaUser.subscriptionTrialEndsAt?.toISOString()
  },
  usage: {
    auditsThisMonth: prismaUser.auditsThisMonth,
    auditsTotal: prismaUser.auditsTotal,
    teamMembers: prismaUser.teamMembers,
    storageUsed: prismaUser.storageUsed
  },
  settings: {
    defaultLanguage: prismaUser.defaultLanguage as 'fr' | 'en',
    emailNotifications: prismaUser.emailNotifications,
    weeklyReports: prismaUser.weeklyReports,
    theme: prismaUser.theme as 'light' | 'dark' | 'system',
    timezone: prismaUser.timezone
  }
});

// Fonctions utilitaires pour les mots de passe
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Fonctions de base de données pour les utilisateurs
export const getUserByEmail = async (email: string): Promise<UserType | null> => {
  try {
    const prismaUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!prismaUser) return null;
    return prismaUserToUser(prismaUser);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

export const getUserById = async (id: string): Promise<UserType | null> => {
  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!prismaUser) return null;
    return prismaUserToUser(prismaUser);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur par ID:', error);
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
    trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14 jours d'essai

    const prismaUser = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        emailVerificationToken: userData.emailVerificationToken,
        emailVerificationSentAt: userData.emailVerificationToken ? new Date() : null,
        subscriptionTrialEndsAt: trialEndsAt
      }
    });

    return prismaUserToUser(prismaUser);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw new Error('Impossible de créer l\'utilisateur');
  }
};

export const updateUser = async (id: string, updates: Partial<PrismaUser>): Promise<UserType | null> => {
  try {
    const prismaUser = await prisma.user.update({
      where: { id },
      data: updates
    });

    return prismaUserToUser(prismaUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return null;
  }
};

export const saveUser = async (user: UserType): Promise<void> => {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
        emailVerified: user.emailVerified,
        emailVerificationToken: user.emailVerificationToken,
        emailVerificationSentAt: user.emailVerificationSentAt ? new Date(user.emailVerificationSentAt) : null,
        betaAccessGranted: user.betaAccess?.granted || false,
        betaAccessGrantedAt: user.betaAccess?.grantedAt ? new Date(user.betaAccess.grantedAt) : null,
        betaAccessHasQuit: user.betaAccess?.hasQuit || false,
        subscriptionPlan: user.subscription?.plan || 'free',
        subscriptionStatus: user.subscription?.status || 'trial',
        subscriptionStartDate: user.subscription?.startDate ? new Date(user.subscription.startDate) : new Date(),
        subscriptionTrialEndsAt: user.subscription?.trialEndsAt ? new Date(user.subscription.trialEndsAt) : null,
        subscriptionEndsAt: user.subscription?.endDate ? new Date(user.subscription.endDate) : null,
        auditsThisMonth: user.usage?.auditsThisMonth || 0,
        auditsTotal: user.usage?.auditsTotal || 0,
        teamMembers: user.usage?.teamMembers || 1,
        storageUsed: user.usage?.storageUsed || 0,
        defaultLanguage: user.settings?.defaultLanguage || 'fr',
        emailNotifications: user.settings?.emailNotifications ?? true,
        weeklyReports: user.settings?.weeklyReports ?? false,
        theme: user.settings?.theme || 'system',
        timezone: user.settings?.timezone || 'Europe/Paris'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    throw new Error('Impossible de sauvegarder l\'utilisateur');
  }
};

export const deleteUser = async (email: string): Promise<boolean> => {
  try {
    await prisma.user.delete({
      where: { email }
    });
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return false;
  }
};

export const getAllUsers = async (): Promise<UserType[]> => {
  try {
    const prismaUsers = await prisma.user.findMany();
    return prismaUsers.map(prismaUserToUser);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les utilisateurs:', error);
    return [];
  }
};

// Fonctions pour les audits
export const saveAudit = async (auditData: {
  userId: string;
  url: string;
  title?: string;
  engine: string;
  violations?: any;
  summary?: any;
  reportData?: any;
  pageInfo?: any;
  analysisTime?: number;
}): Promise<void> => {
  try {
    await prisma.audit.create({
      data: {
        userId: auditData.userId,
        url: auditData.url,
        title: auditData.title,
        engine: auditData.engine,
        violations: auditData.violations,
        summary: auditData.summary,
        reportData: auditData.reportData,
        pageInfo: auditData.pageInfo,
        analysisTime: auditData.analysisTime,
        completedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'audit:', error);
    throw new Error('Impossible de sauvegarder l\'audit');
  }
};

export const getUserAudits = async (userId: string): Promise<any[]> => {
  try {
    const audits = await prisma.audit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return audits;
  } catch (error) {
    console.error('Erreur lors de la récupération des audits:', error);
    return [];
  }
};

// Fonction pour nettoyer les connexions en fin de requête
export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
}; 