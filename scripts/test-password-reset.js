#!/usr/bin/env node

/**
 * Script de test pour la fonctionnalité de réinitialisation de mot de passe
 * Usage: node scripts/test-password-reset.js
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ntzppsdyidqonusibocc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50enBwc2R5aWRxb251c2lib2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc3NjEsImV4cCI6MjA2NjY4Mzc2MX0.XybM_Rjat5A3EZGHHP_oUNtePrB_krvysqCtuOJtcws';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTokens() {
  console.log('🔍 Vérification des tokens de réinitialisation...\n');

  try {
    // Récupérer tous les tokens actifs
    const { data: users, error } = await supabase
      .from('users')
      .select('email, password_reset_token, password_reset_expires_at, password_reset_sent_at')
      .not('password_reset_token', 'is', null);

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }

    if (!users || users.length === 0) {
      console.log('ℹ️  Aucun token de réinitialisation actif trouvé.');
      return;
    }

    console.log(`📊 ${users.length} token(s) de réinitialisation trouvé(s):\n`);

    const now = new Date();

    for (const user of users) {
      const expiresAt = new Date(user.password_reset_expires_at);
      const sentAt = new Date(user.password_reset_sent_at);
      const isExpired = expiresAt < now;
      const timeLeft = isExpired ? 0 : Math.round((expiresAt - now) / (1000 * 60)); // minutes

      console.log(`👤 ${user.email}`);
      console.log(`   🔑 Token: ${user.password_reset_token.substring(0, 8)}...`);
      console.log(`   📅 Envoyé: ${sentAt.toLocaleString('fr-FR')}`);
      console.log(`   ⏰ Expire: ${expiresAt.toLocaleString('fr-FR')}`);
      console.log(`   📊 Statut: ${isExpired ? '❌ EXPIRÉ' : `✅ VALIDE (${timeLeft} min restantes)`}`);
      console.log('');
    }

    // Compter les tokens expirés
    const expiredCount = users.filter(user => new Date(user.password_reset_expires_at) < now).length;
    
    if (expiredCount > 0) {
      console.log(`⚠️  ${expiredCount} token(s) expiré(s) détecté(s).`);
      console.log('💡 Vous pouvez les nettoyer avec: node scripts/cleanup-tokens.js\n');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

async function testTokenGeneration() {
  console.log('🧪 Test de génération de token...\n');

  // Générer un token comme dans l'API
  const token = crypto.randomBytes(32).toString('hex');
  console.log(`🔑 Token généré: ${token}`);
  console.log(`📏 Longueur: ${token.length} caractères`);
  console.log(`🔤 Format: hexadécimal`);
  console.log('');

  // Test de validation d'expiration
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 heure

  const isValid = expiresAt > new Date();
  console.log(`⏰ Test d'expiration:`);
  console.log(`   Expire le: ${expiresAt.toLocaleString('fr-FR')}`);
  console.log(`   Statut: ${isValid ? '✅ VALIDE' : '❌ EXPIRÉ'}`);
  console.log('');
}

async function main() {
  console.log('🔐 RGAA Audit - Test de réinitialisation de mot de passe\n');
  console.log('=' .repeat(60));
  console.log('');

  await testTokenGeneration();
  await checkTokens();

  console.log('✅ Tests terminés.');
}

// Exécuter le script
main().catch(console.error); 