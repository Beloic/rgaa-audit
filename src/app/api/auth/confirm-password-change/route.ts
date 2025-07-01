import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser, hashPassword } from '@/lib/supabase-auth';
import { isPasswordResetTokenValid, isValidPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  console.log('🔄 Confirmation de changement de mot de passe reçue');
  
  try {
    const { token, newPassword } = await request.json();
    console.log('🔑 Token reçu:', token ? token.substring(0, 8) + '...' : 'AUCUN');

    // Validation des données
    if (!token || !newPassword) {
      console.log('❌ Données manquantes - Token:', !!token, 'Password:', !!newPassword);
      return NextResponse.json(
        { error: 'Token et nouveau mot de passe requis' },
        { status: 400 }
      );
    }

    if (!isValidPassword(newPassword)) {
      console.log('❌ Mot de passe invalide (moins de 6 caractères)');
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    console.log('🔍 Recherche de l\'utilisateur par token...');

    // Récupérer l'utilisateur avec ce token de réinitialisation
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ntzppsdyidqonusibocc.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50enBwc2R5aWRxb251c2lib2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc3NjEsImV4cCI6MjA2NjY4Mzc2MX0.XybM_Rjat5A3EZGHHP_oUNtePrB_krvysqCtuOJtcws';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('password_reset_token', token)
      .single();

    if (fetchError) {
      console.log('❌ Erreur Supabase lors de la recherche du token:', fetchError);
      return NextResponse.json(
        { error: 'Token de réinitialisation invalide ou expiré' },
        { status: 400 }
      );
    }

    if (!userData) {
      console.log('⚠️ Aucun utilisateur trouvé avec ce token');
      return NextResponse.json(
        { error: 'Token de réinitialisation invalide ou expiré' },
        { status: 400 }
      );
    }

    console.log('👤 Utilisateur trouvé:', userData.email);
    console.log('📅 Token expire le:', userData.password_reset_expires_at);
    console.log('🕐 Date actuelle:', new Date().toISOString());

    // Vérifier si le token n'a pas expiré
    if (!isPasswordResetTokenValid(userData.password_reset_expires_at)) {
      console.log('❌ Token expiré');
      return NextResponse.json(
        { error: 'Le token de réinitialisation a expiré. Veuillez faire une nouvelle demande.' },
        { status: 400 }
      );
    }

    console.log('✅ Token valide, procédure de mise à jour...');

    // Récupérer l'utilisateur complet
    const user = await getUserByEmail(userData.email);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await hashPassword(newPassword);

    // Mettre à jour le mot de passe et supprimer le token de réinitialisation
    user.password = hashedNewPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetSentAt = undefined;

    // Sauvegarder les modifications
    await saveUser(user);

    console.log('✅ Mot de passe réinitialisé avec succès pour:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la confirmation du changement de mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
} 