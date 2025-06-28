import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/fileDatabase';
import { hashPassword, generateVerificationToken, isValidEmail, isValidPassword } from '@/lib/auth';
import type { User } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validation des données
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom requis' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);
    
    // Générer un token de vérification
    const verificationToken = generateVerificationToken();
    
    // Créer le nouvel utilisateur
    const newUser: User = {
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
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 jours
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

    // Sauvegarder l'utilisateur
    saveUser(newUser);

    // Retourner l'utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Compte créé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 