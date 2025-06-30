import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser, verifyPassword } from '@/lib/supabase-auth';
import { isValidEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Aucun compte trouvé avec cette adresse email' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Mettre à jour la dernière connexion
    const updatedUser = {
      ...user,
      lastLoginAt: new Date().toISOString()
    };
    await saveUser(updatedUser);

    // Retourner l'utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
} 