import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { User as UserType } from '@/types/user';

// Configuration spécialement pour Vercel
declare global {
  var prisma: PrismaClient | undefined;
}

// Configuration Prisma adaptée pour Vercel/Serverless
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  
  return client;
};

export const prisma = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Fonctions utilitaires pour les mots de passe
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Conversion de PrismaUser vers notre type User
const prismaUserToUser = (prismaUser: any): UserType => ({
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

// Fonction de connexion sécurisée avec retry
const safeConnect = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      return true;
    } catch (error) {
      console.error(`Tentative de connexion ${i + 1} échouée:`, error);
      if (i === retries - 1) return false;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
};

// Fonctions de base de données avec gestion d'erreur robuste
export const getUserByEmail = async (email: string): Promise<UserType | null> => {
  try {
    const connected = await safeConnect();
    if (!connected) {
      console.error('Impossible de se connecter à la base de données');
      return null;
    }

    const prismaUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!prismaUser) return null;
    return prismaUserToUser(prismaUser);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Erreur déconnexion:', e);
    }
  }
};

export const createUser = async (userData: {
  email: string;
  name: string;
  password: string;
  emailVerificationToken?: string;
}): Promise<UserType> => {
  try {
    const connected = await safeConnect();
    if (!connected) {
      throw new Error('Impossible de se connecter à la base de données');
    }

    const hashedPassword = await hashPassword(userData.password);
    
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

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
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Erreur déconnexion:', e);
    }
  }
};

export const saveUser = async (user: UserType): Promise<void> => {
  try {
    const connected = await safeConnect();
    if (!connected) {
      throw new Error('Impossible de se connecter à la base de données');
    }

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
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Erreur déconnexion:', e);
    }
  }
}; 