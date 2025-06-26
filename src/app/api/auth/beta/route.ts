import { NextRequest, NextResponse } from 'next/server';

const BETA_PASSWORD = process.env.BETA_PASSWORD || 'rgaa2025beta';
const BETA_COOKIE_NAME = 'rgaa-beta-access';
const BETA_COOKIE_VALUE = 'authenticated';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis', success: false },
        { status: 400 }
      );
    }

    if (password === BETA_PASSWORD) {
      // Créer la réponse avec le cookie d'authentification
      const response = NextResponse.json({ 
        success: true, 
        message: 'Accès autorisé à la bêta' 
      });
      
      // Définir le cookie d'authentification (valide 30 jours)
      response.cookies.set(BETA_COOKIE_NAME, BETA_COOKIE_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        path: '/'
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Mot de passe incorrect', success: false },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur', success: false },
      { status: 500 }
    );
  }
}

// Déconnexion - supprimer le cookie
export async function DELETE() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Déconnecté de la bêta' 
  });
  
  response.cookies.delete(BETA_COOKIE_NAME);
  
  return response;
} 