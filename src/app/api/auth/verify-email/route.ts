import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    // En production, vérifiez le token dans votre base de données
    // Pour le moment, on simule la vérification
    
    // Récupérer les utilisateurs du localStorage (simulation)
    // En production, cela serait fait dans votre base de données
    
    // Pour l'instant, on considère que tous les tokens sont valides
    // et on met à jour le statut de vérification
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email vérifié avec succès',
      token 
    });

  } catch (error) {
    console.error('Erreur vérification email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token requis' },
        { status: 400 }
      );
    }

    // Simulation de la vérification du token
    // En production, vous vérifieriez dans votre base de données
    
    console.log(`Vérification du token: ${token}`);
    
    // Simulation d'une vérification réussie
    return NextResponse.json({ 
      success: true, 
      message: 'Email vérifié avec succès' 
    });

  } catch (error) {
    console.error('Erreur vérification email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
} 