#!/usr/bin/env node

/**
 * Script de test pour diagnostiquer le problème de limitation d'audits
 * Usage: node scripts/test-audit-limit.js
 */

const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Vérifiez que .env.local contient :');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuditLimit() {
  console.log('🧪 Test du système de limitation d\'audits\n');

  try {
    // 1. Lister tous les utilisateurs
    console.log('1. 👥 Récupération des utilisateurs...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, audits_today, audits_total, last_audit_date, subscription_plan')
      .order('created_at', { ascending: false });

    if (usersError) {
      throw new Error(`Erreur récupération utilisateurs: ${usersError.message}`);
    }

    console.log(`✅ ${users.length} utilisateur(s) trouvé(s):`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      - Plan: ${user.subscription_plan}`);
      console.log(`      - Audits aujourd'hui: ${user.audits_today || 0}`);
      console.log(`      - Audits total: ${user.audits_total || 0}`);
      console.log(`      - Dernier audit: ${user.last_audit_date || 'Jamais'}`);
      console.log('');
    });

    // 2. Test de mise à jour pour le premier utilisateur
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`2. 🔧 Test de mise à jour pour ${testUser.email}...`);
      
      const today = new Date().toISOString().split('T')[0];
      const lastAuditDate = testUser.last_audit_date ? new Date(testUser.last_audit_date).toISOString().split('T')[0] : null;
      const isNewDay = lastAuditDate !== today;
      
      console.log(`   - Date aujourd'hui: ${today}`);
      console.log(`   - Dernier audit: ${lastAuditDate || 'Jamais'}`);
      console.log(`   - Nouveau jour: ${isNewDay ? 'Oui' : 'Non'}`);
      
      const newAuditsToday = isNewDay ? 1 : (testUser.audits_today || 0) + 1;
      
      console.log(`   - Nouveaux audits aujourd'hui: ${newAuditsToday}`);
      
      // Tenter la mise à jour
      const { data: updateResult, error: updateError } = await supabase
        .from('users')
        .update({
          audits_today: newAuditsToday,
          audits_total: (testUser.audits_total || 0) + 1,
          last_audit_date: new Date().toISOString()
        })
        .eq('email', testUser.email)
        .select();

      if (updateError) {
        console.error(`❌ Erreur mise à jour: ${updateError.message}`);
      } else {
        console.log('✅ Mise à jour réussie !');
        console.log('   Nouvelles valeurs:', updateResult[0]);
      }
    }

    // 3. Vérifier la structure de la table
    console.log('\n3. 🔍 Vérification de la structure de la table...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'users' })
      .catch(() => {
        // Fallback si la fonction n'existe pas
        return { data: null, error: null };
      });

    if (!columns) {
      console.log('   ℹ️  Impossible de récupérer la structure automatiquement');
      console.log('   📝 Vérifiez manuellement que les colonnes existent :');
      console.log('      - audits_today (INTEGER)');
      console.log('      - last_audit_date (TIMESTAMP WITH TIME ZONE)');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testAuditLimit(); 