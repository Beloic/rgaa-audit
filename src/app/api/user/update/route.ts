import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/supabase-auth';
import { isValidEmail } from '@/lib/auth';
import type { User } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const { email, updates } = await request.json();

    // Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email valide requis' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Données de mise à jour requises' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur existant
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher la modification de certains champs sensibles
    const { id, email: newEmail, password, createdAt, ...allowedUpdates } = updates;

    // Mettre à jour l'utilisateur
    const updatedUser: User = {
      ...existingUser,
      ...allowedUpdates,
      // Garder l'email et le mot de passe existants
      email: existingUser.email,
      password: existingUser.password
    };

    // Sauvegarder
    await saveUser(updatedUser);

    // Retourner l'utilisateur mis à jour (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Utilisateur mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour' },
      { status: 500 }
    );
  }
} 