#!/usr/bin/env node

/**
 * Script de test avec détection d'erreurs de sauvegarde
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function testErrorDetection() {
  console.log('🔍 Test avec détection d\'erreurs de sauvegarde\n');

  const userEmail = 'lauregagnonn@gmail.com';
  console.log(`📧 Test avec: ${userEmail}\n`);

  try {
    // 1. Récupérer l'état initial
    console.log('1. 📊 État initial...');
    const initialResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    if (!initialResponse.ok) {
      console.log('❌ Impossible de récupérer l\'état initial');
      return;
    }

    const initialData = await initialResponse.json();
    console.log(`   Audits avant: ${initialData.usage?.auditsToday || 0}`);

    // 2. Tenter un audit
    console.log('\n2. 🎯 Tentative d\'audit...');
    
    const auditStartTime = Date.now();
    const auditResponse = await fetch(`${PRODUCTION_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com',
        engine: 'wave',
        userData: initialData
      })
    });

    const auditEndTime = Date.now();
    const auditDuration = auditEndTime - auditStartTime;

    console.log(`   Durée de l'audit: ${auditDuration}ms`);
    console.log(`   Statut HTTP: ${auditResponse.status}`);
    console.log(`   Content-Type: ${auditResponse.headers.get('content-type')}`);

    // 3. Analyser la réponse
    if (auditResponse.status === 500) {
      console.log('\n🎯 ERREUR 500 DÉTECTÉE !');
      const errorData = await auditResponse.json();
      console.log(`   Message: ${errorData.error}`);
      
      if (errorData.error.includes('sauvegarde')) {
        console.log('   ✅ C\'est bien une erreur de sauvegarde');
        console.log('   → Le problème est confirmé dans la base de données');
      } else {
        console.log('   ⚠️ Erreur différente');
      }
    } else if (auditResponse.status === 200) {
      console.log('\n✅ Audit réussi (200)');
      const result = await auditResponse.json();
      
      console.log(`   Score: ${result.score}`);
      console.log(`   Violations: ${result.totalViolations}`);
      
      if (result.updatedUserData) {
        console.log(`   🔄 Données retournées:`);
        console.log(`      - Audits aujourd'hui: ${result.updatedUserData.usage?.auditsToday}`);
        console.log(`      - Audits total: ${result.updatedUserData.usage?.auditsTotal}`);
      }
    } else {
      console.log(`\n❌ Statut inattendu: ${auditResponse.status}`);
      const responseText = await auditResponse.text();
      console.log(`   Réponse: ${responseText.substring(0, 300)}...`);
    }

    // 4. Vérifier l'état final avec un délai
    console.log('\n3. ⏱️ Attente 3 secondes puis vérification finale...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const finalResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    if (finalResponse.ok) {
      const finalData = await finalResponse.json();
      console.log(`   Audits après: ${finalData.usage?.auditsToday || 0}`);
      
      const initialAudits = initialData.usage?.auditsToday || 0;
      const finalAudits = finalData.usage?.auditsToday || 0;
      
      console.log('\n📊 RÉSULTAT:');
      if (finalAudits > initialAudits) {
        console.log('   ✅ SUCCESS: La sauvegarde fonctionne !');
      } else {
        console.log('   ❌ ÉCHEC: Pas de sauvegarde en base');
        
        if (auditResponse.status === 200) {
          console.log('   → L\'audit dit avoir réussi mais la base n\'est pas mise à jour');
          console.log('   → Problème de synchronisation Supabase ou erreur silencieuse');
        }
      }
    }

    // 5. Test de logs Vercel
    console.log('\n4. 📋 Pour vérifier les logs Vercel :');
    console.log('   → Allez sur https://vercel.com/dashboard');
    console.log('   → Sélectionnez le projet rgaa-audit');
    console.log('   → Onglet "Functions" puis "View Function Logs"');
    console.log('   → Cherchez les logs de /api/analyze');
    console.log(`   → Timestamp de ce test: ${new Date().toISOString()}`);

  } catch (error) {
    console.error('💥 Erreur globale:', error.message);
  }
}

// Exécuter le test
testErrorDetection(); 