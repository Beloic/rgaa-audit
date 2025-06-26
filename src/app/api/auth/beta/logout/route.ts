import { NextRequest, NextResponse } from 'next/server';

const BETA_COOKIE_NAME = 'rgaa-beta-access';

export async function POST(request: NextRequest) {
  try {
    // Créer la réponse de déconnexion
    const response = NextResponse.json({ 
      success: true, 
      message: 'Déconnexion réussie' 
    });
    
    // Supprimer le cookie d'authentification
    response.cookies.set(BETA_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immédiatement
      path: '/'
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de la déconnexion' 
    }, { status: 500 });
  }
} 