import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer l'utilisateur depuis Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('❌ Erreur Supabase user:', userError);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Formater les données utilisateur pour l'interface
    const refreshedUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      createdAt: userData.created_at,
      lastLoginAt: userData.last_login_at,
      emailVerified: userData.email_verified,
      emailVerificationToken: userData.email_verification_token,
      emailVerificationSentAt: userData.email_verification_sent_at,
      betaAccess: {
        granted: userData.beta_access_granted,
        grantedAt: userData.beta_access_granted_at,
        hasQuit: userData.beta_access_has_quit
      },
      subscription: {
        plan: userData.subscription_plan || 'free',
        status: userData.subscription_status || 'trial',
        startDate: userData.subscription_start_date,
        trialEndsAt: userData.subscription_trial_ends_at
      },
      usage: {
        auditsToday: userData.audits_today || 0,
        auditsThisMonth: userData.audits_this_month || 0,
        auditsTotal: userData.audits_total || 0,
        lastAuditDate: userData.last_audit_date,
        teamMembers: userData.team_members || 1,
        storageUsed: userData.storage_used || 0
      },
      settings: {
        defaultLanguage: userData.default_language || 'fr',
        emailNotifications: userData.email_notifications ?? true,
        weeklyReports: userData.weekly_reports ?? false,
        theme: userData.theme || 'system',
        timezone: userData.timezone || 'Europe/Paris'
      }
    };

    console.log(`✅ Données utilisateur rafraîchies pour ${email}:`, {
      plan: refreshedUser.subscription.plan,
      status: refreshedUser.subscription.status
    });

    return NextResponse.json(refreshedUser);

  } catch (error) {
    console.error('❌ Erreur refresh user:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 