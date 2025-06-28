import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/supabase-auth';
import { generateVerificationToken, isValidEmail, isValidPassword } from '@/lib/auth';
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
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email' },
        { status: 409 }
      );
    }

    // Générer un token de vérification
    const verificationToken = generateVerificationToken();
    
    // Créer le nouvel utilisateur
    const newUser = await createUser({
      email,
      name,
      password,
      emailVerificationToken: verificationToken
    });

    // Envoyer automatiquement l'email de vérification
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: verificationToken
        })
      });

      if (emailResponse.ok) {
        console.log('✅ Email de vérification envoyé automatiquement à:', email);
      } else {
        console.log('⚠️ Échec de l\'envoi automatique de l\'email de vérification');
      }
    } catch (emailError) {
      console.log('⚠️ Erreur lors de l\'envoi automatique de l\'email:', emailError);
    }

    // Retourner l'utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Compte créé avec succès. Un email de vérification a été envoyé.'
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 