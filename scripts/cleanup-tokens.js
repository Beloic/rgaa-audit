#!/usr/bin/env node

/**
 * Script de nettoyage des tokens de réinitialisation expirés
 * Usage: node scripts/cleanup-tokens.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ntzppsdyidqonusibocc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50enBwc2R5aWRxb251c2lib2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc3NjEsImV4cCI6MjA2NjY4Mzc2MX0.XybM_Rjat5A3EZGHHP_oUNtePrB_krvysqCtuOJtcws';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupExpiredTokens() {
  console.log('🧹 Nettoyage des tokens de réinitialisation expirés...\n');

  try {
    // Lister d'abord les tokens expirés
    const { data: expiredUsers, error: listError } = await supabase
      .from('users')
      .select('email, password_reset_expires_at')
      .not('password_reset_token', 'is', null)
      .lt('password_reset_expires_at', new Date().toISOString());

    if (listError) {
      console.error('❌ Erreur lors de la récupération des tokens expirés:', listError);
      return;
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      console.log('✅ Aucun token expiré à nettoyer.');
      return;
    }

    console.log(`📊 ${expiredUsers.length} token(s) expiré(s) trouvé(s):`);
    expiredUsers.forEach(user => {
      const expiredAt = new Date(user.password_reset_expires_at);
      const hoursAgo = Math.round((new Date() - expiredAt) / (1000 * 60 * 60));
      console.log(`   • ${user.email} (expiré il y a ${hoursAgo}h)`);
    });
    console.log('');

    // Confirmer avant nettoyage
    console.log('🔄 Nettoyage en cours...');

    // Nettoyer les tokens expirés
    const { data, error } = await supabase
      .from('users')
      .update({
        password_reset_token: null,
        password_reset_expires_at: null,
        password_reset_sent_at: null
      })
      .lt('password_reset_expires_at', new Date().toISOString())
      .not('password_reset_token', 'is', null);

    if (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
      return;
    }

    console.log(`✅ ${expiredUsers.length} token(s) expiré(s) nettoyé(s) avec succès.`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

async function showActiveTokens() {
  console.log('📋 Tokens actifs restants...\n');

  try {
    const { data: activeUsers, error } = await supabase
      .from('users')
      .select('email, password_reset_expires_at')
      .not('password_reset_token', 'is', null)
      .gte('password_reset_expires_at', new Date().toISOString());

    if (error) {
      console.error('❌ Erreur lors de la récupération des tokens actifs:', error);
      return;
    }

    if (!activeUsers || activeUsers.length === 0) {
      console.log('ℹ️  Aucun token actif restant.');
      return;
    }

    console.log(`📊 ${activeUsers.length} token(s) actif(s):`);
    activeUsers.forEach(user => {
      const expiresAt = new Date(user.password_reset_expires_at);
      const minutesLeft = Math.round((expiresAt - new Date()) / (1000 * 60));
      console.log(`   • ${user.email} (expire dans ${minutesLeft} min)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

async function main() {
  console.log('🔐 RGAA Audit - Nettoyage des tokens expirés\n');
  console.log('=' .repeat(50));
  console.log('');

  await cleanupExpiredTokens();
  console.log('');
  await showActiveTokens();

  console.log('\n✅ Nettoyage terminé.');
}

// Exécuter le script
main().catch(console.error); 