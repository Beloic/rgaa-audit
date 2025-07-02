#!/usr/bin/env node

/**
 * Script de test pour reproduire le problème de limitation d'audits en production
 * Simule exactement ce qui se passe lors d'un audit
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function testAuditLimitation() {
  console.log('🧪 Test de limitation d\'audits en production\n');

  try {
    // 1. Créer un compte de test
    console.log('1. 📝 Création d\'un compte de test...');
    
    const testEmail = `test-${Date.now()}@example.com`;
    const testName = 'Test User Limitation';
    const testPassword = 'TestPassword123!';
    
    console.log(`   Email: ${testEmail}`);
    
    const registerResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        name: testName,
        password: testPassword
      })
    });

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(`Inscription échouée: ${errorData.error}`);
    }

    const userData = await registerResponse.json();
    console.log('✅ Compte créé avec succès');
    console.log(`   Plan: ${userData.subscription?.plan}`);
    console.log(`   Audits aujourd'hui: ${userData.usage?.auditsToday || 0}`);

    // 2. Simuler des audits successifs
    console.log('\n2. 🎯 Test de limitation avec audits successifs...');
    
    for (let i = 1; i <= 5; i++) {
      console.log(`\n   Audit ${i}/5...`);
      
      try {
        const auditResponse = await fetch(`${PRODUCTION_URL}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: 'https://example.com',
            engine: 'wave',
            userData: userData
          })
        });

        if (!auditResponse.ok) {
          const errorData = await auditResponse.json();
          if (errorData.error && errorData.error.includes('Limite d\'audits')) {
            console.log(`   🚫 LIMITE ATTEINTE au ${i}e audit: ${errorData.error}`);
            break;
          } else {
            console.log(`   ❌ Erreur audit ${i}: ${errorData.error}`);
            break;
          }
        }

        const result = await auditResponse.json();
        
        if (result.updatedUserData) {
          console.log(`   ✅ Audit ${i} réussi`);
          console.log(`      - Audits aujourd'hui: ${result.updatedUserData.usage?.auditsToday || 0}`);
          console.log(`      - Audits total: ${result.updatedUserData.usage?.auditsTotal || 0}`);
          
          // Mettre à jour userData pour le prochain audit
          userData.usage = result.updatedUserData.usage;
        } else {
          console.log(`   ⚠️ Audit ${i} sans mise à jour de données utilisateur`);
        }

      } catch (auditError) {
        console.log(`   ❌ Erreur technique audit ${i}:`, auditError.message);
      }
      
      // Pause entre les audits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Vérifier les données en base
    console.log('\n3. 🔍 Vérification finale des données...');
    
    const refreshResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    if (refreshResponse.ok) {
      const refreshedData = await refreshResponse.json();
      console.log('✅ Données finales en base:');
      console.log(`   - Email: ${refreshedData.email}`);
      console.log(`   - Plan: ${refreshedData.subscription?.plan}`);
      console.log(`   - Audits aujourd'hui: ${refreshedData.usage?.auditsToday || 0}`);
      console.log(`   - Audits total: ${refreshedData.usage?.auditsTotal || 0}`);
      console.log(`   - Dernier audit: ${refreshedData.usage?.lastAuditDate || 'Jamais'}`);

      // Analyser le résultat
      const auditsToday = refreshedData.usage?.auditsToday || 0;
      if (auditsToday === 0) {
        console.log('\n❌ PROBLÈME: audits_today = 0 en base !');
        console.log('   → La synchronisation avec la base de données ne fonctionne pas');
      } else if (auditsToday >= 3) {
        console.log('\n⚠️ PROBLÈME PARTIEL: audits_today s\'incrémente mais limitation pas appliquée');
        console.log('   → La limitation devrait s\'activer au 4e audit');
      } else {
        console.log('\n✅ FONCTIONNEL: audits_today s\'incrémente correctement');
      }
    } else {
      console.log('❌ Impossible de récupérer les données finales');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testAuditLimitation(); 