// Script pour diagnostiquer les problèmes avec la table audit_history
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://zokclhjrvhzovuzaclzj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2NsaGpydmh6b3Z1emFjbHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMzI5NzIsImV4cCI6MjA0ODkwODk3Mn0.Q-qEBG_xGCGnKRhFMOXPZQxDIznvDG0m67r7eUYNYNM';

async function diagnoseAuditHistory() {
  try {
    console.log('🔍 Diagnostic de la table audit_accessibility_history...\n');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. Test de connexion Supabase
    console.log('1️⃣ Test de connexion Supabase...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('email')
      .limit(1);
    
    if (connectionError) {
      console.log('❌ Erreur de connexion Supabase:', connectionError.message);
      return;
    }
    console.log('✅ Connexion Supabase OK\n');
    
    // 2. Vérifier l'existence de la table audit_accessibility_history
    console.log('2️⃣ Vérification table audit_accessibility_history...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('audit_accessibility_history')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.log('❌ Erreur table audit_history:', tableError.message);
      console.log('📝 Code erreur:', tableError.code);
      console.log('📝 Détails:', tableError.details);
      
      if (tableError.message.includes('relation "audit_accessibility_history" does not exist')) {
        console.log('\n🔧 SOLUTION: La table audit_accessibility_history n\'existe pas.');
        console.log('   Exécutez le script scripts/setup-audit-history.sql dans Supabase');
      } else if (tableError.message.includes('column "user_email" does not exist')) {
        console.log('\n🔧 SOLUTION: La table existe mais la colonne user_email est manquante.');
        console.log('   Exécutez le script scripts/fix-audit-history-table.sql dans Supabase');
      }
      return;
    }
    console.log('✅ Table audit_accessibility_history existe\n');
    
    // 3. Test d'insertion simple
    console.log('3️⃣ Test d\'insertion dans audit_accessibility_history...');
    const testData = {
      user_email: 'test@diagnostic.com',
      url: 'https://example.com',
      score: 85,
      total_violations: 3,
      engine: 'wave',
      result: { test: true, violations: [] }
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('audit_accessibility_history')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.log('❌ Erreur d\'insertion:', insertError.message);
      console.log('📝 Code erreur:', insertError.code);
      console.log('📝 Détails:', insertError.details);
      
      if (insertError.message.includes('user_email')) {
        console.log('\n🔧 SOLUTION: Problème avec la colonne user_email.');
        console.log('   Vérifiez la structure de la table avec fix-audit-history-table.sql');
      }
      return;
    }
    console.log('✅ Insertion test réussie:', insertData[0]?.id);
    
    // 4. Nettoyage du test
    console.log('\n4️⃣ Nettoyage test...');
    const { error: deleteError } = await supabase
      .from('audit_accessibility_history')
      .delete()
      .eq('user_email', 'test@diagnostic.com');
    
    if (deleteError) {
      console.log('⚠️ Erreur nettoyage (pas grave):', deleteError.message);
    } else {
      console.log('✅ Nettoyage réussi');
    }
    
    // 5. Résumé
    console.log('\n🎉 DIAGNOSTIC TERMINÉ');
    console.log('✅ La table audit_accessibility_history fonctionne correctement !');
    console.log('💡 Vous pouvez maintenant activer la sauvegarde d\'historique');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

diagnoseAuditHistory(); 