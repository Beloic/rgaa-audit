// Script pour tester la fonctionnalité d'historique des audits côté serveur
// À exécuter après avoir créé la table audit_accessibility_history dans Supabase

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://zokclhjrvhzovuzaclzj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2NsaGpydmh6b3Z1emFjbHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMzI5NzIsImV4cCI6MjA0ODkwODk3Mn0.Q-qEBG_xGCGnKRhFMOXPZQxDIznvDG0m67r7eUYNYNM';

async function testAuditHistory() {
  try {
    console.log('🧪 Test de l\'historique des audits côté serveur (audit_accessibility_history)...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Email de test
    const testEmail = 'lauregagnonn@gmail.com';
    
    // 1. Vérifier la table audit_accessibility_history
    console.log('\n📋 1. Vérification de la table audit_accessibility_history...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('audit_accessibility_history')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('❌ Table audit_accessibility_history non trouvée:', tableError.message);
      console.log('📋 Créez d\'abord la table avec le script setup-audit-history.sql dans Supabase SQL Editor');
      return;
    }
    
    console.log(`✅ Table audit_accessibility_history trouvée`);
    
    // 2. Insérer un audit de test
    console.log('\n💾 2. Insertion d\'un audit de test...');
    const testAudit = {
      user_email: testEmail,
      url: 'https://example.com',
      score: 85,
      total_violations: 3,
      engine: 'wave',
      result: {
        url: 'https://example.com',
        timestamp: new Date().toISOString(),
        totalViolations: 3,
        score: 85,
        violations: [
          {
            criterion: '1.1',
            level: 'AA',
            description: 'Image sans texte alternatif',
            impact: 'medium'
          }
        ],
        engine: 'wave'
      }
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('audit_accessibility_history')
      .insert(testAudit)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion:', insertError.message);
      return;
    }
    
    console.log('✅ Audit de test inséré:', insertData.id);
    
    // 3. Récupérer l'historique
    console.log('\n📚 3. Récupération de l\'historique...');
    const { data: historyData, error: historyError } = await supabase
      .from('audit_accessibility_history')
      .select('*')
      .eq('user_email', testEmail)
      .order('timestamp', { ascending: false });
    
    if (historyError) {
      console.error('❌ Erreur lors de la récupération:', historyError.message);
      return;
    }
    
    console.log(`✅ ${historyData.length} audit(s) trouvé(s) pour ${testEmail}:`);
    historyData.forEach((audit, index) => {
      console.log(`   ${index + 1}. ${audit.url} - Score: ${audit.score} - ${new Date(audit.timestamp).toLocaleString()}`);
    });
    
    // 4. Test de l'API
    console.log('\n🌐 4. Test de l\'API audit-history...');
    
    try {
      const apiUrl = `http://localhost:3000/api/audit-history?userEmail=${encodeURIComponent(testEmail)}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.log('⚠️ API non accessible (serveur probablement arrêté)');
        console.log('   Démarrez le serveur avec "npm run dev" pour tester l\'API');
      } else {
        const apiData = await response.json();
        console.log('✅ API accessible, audits retournés:', apiData.total);
      }
    } catch (apiError) {
      console.log('⚠️ API non accessible:', apiError.message);
      console.log('   Démarrez le serveur avec "npm run dev" pour tester l\'API');
    }
    
    // 5. Nettoyage optionnel
    console.log('\n🧹 5. Nettoyage des données de test...');
    console.log('   (Appuyez sur Ctrl+C pour conserver les données de test)');
    
    // Attendre 5 secondes avant nettoyage
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { error: deleteError } = await supabase
      .from('audit_accessibility_history')
      .delete()
      .eq('user_email', testEmail);
    
    if (deleteError) {
      console.error('❌ Erreur lors du nettoyage:', deleteError.message);
    } else {
      console.log('✅ Données de test supprimées');
    }
    
    console.log('\n🎉 Test terminé avec succès !');
    console.log('📋 L\'historique des audits côté serveur est prêt à être utilisé.');
    
  } catch (error) {
    console.error('❌ Erreur durant le test:', error);
  }
}

// Exécuter le test
testAuditHistory(); 