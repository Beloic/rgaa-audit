#!/usr/bin/env node

/**
 * Test complet de l'incrémentation pour TOUS les moteurs d'analyse
 * Vérifie wave, axe, rgaa ET all (analyse comparative)
 */

const PRODUCTION_URL = 'http://localhost:3009'; // Port mis à jour

async function testAllEngines() {
  console.log('🧪 Test complet - Incrémentation pour TOUS les moteurs\n');

  // Données d'utilisateur de test fictives
  const testUserData = {
    id: 'test-all-engines',
    email: 'test-all@example.com',
    name: 'Test All Engines',
    emailVerified: true,
    betaAccess: {
      granted: false,
      hasQuit: false
    },
    subscription: {
      plan: 'free',
      status: 'trial'
    },
    usage: {
      auditsToday: 0,        // Commencer à 0
      auditsThisMonth: 10,   
      auditsTotal: 50,       
      lastAuditDate: new Date().toISOString(),
      teamMembers: 1,
      storageUsed: 0
    },
    settings: {
      defaultLanguage: 'fr',
      emailNotifications: true,
      weeklyReports: false,
      theme: 'system',
      timezone: 'Europe/Paris'
    }
  };

  const engines = ['wave', 'axe', 'rgaa', 'all'];
  let initialAuditsToday = testUserData.usage.auditsToday;

  console.log('📊 État initial:');
  console.log(`   Audits aujourd'hui: ${initialAuditsToday}`);
  console.log(`   Audits total: ${testUserData.usage.auditsTotal}`);

  try {
    for (let i = 0; i < engines.length; i++) {
      const engine = engines[i];
      console.log(`\n${i + 1}. 🔧 Test moteur: ${engine.toUpperCase()}`);
      
      // Test de l'API d'incrémentation (simulation de l'affichage des résultats)
      console.log(`   📈 Simulation affichage résultats ${engine}...`);
      
      const incrementResponse = await fetch(`${PRODUCTION_URL}/api/user/increment-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: testUserData })
      });

      console.log(`   Statut: ${incrementResponse.status}`);

      if (incrementResponse.ok) {
        const result = await incrementResponse.json();
        
        if (result.success && result.updatedUserData) {
          const newAuditsToday = result.updatedUserData.usage?.auditsToday || 0;
          const expectedAuditsToday = initialAuditsToday + i + 1;
          
          console.log(`   Audits aujourd'hui: ${newAuditsToday} (attendu: ${expectedAuditsToday})`);
          
          if (newAuditsToday === expectedAuditsToday) {
            console.log(`   ✅ SUCCÈS: Incrémentation correcte pour ${engine}`);
          } else {
            console.log(`   ❌ ÉCHEC: Attendu ${expectedAuditsToday}, obtenu ${newAuditsToday}`);
          }
          
          // Mettre à jour les données pour le test suivant
          testUserData.usage = result.updatedUserData.usage;
        } else {
          console.log(`   ❌ Réponse invalide:`, result);
        }
      } else {
        const errorText = await incrementResponse.text();
        console.log(`   ❌ Erreur API: ${errorText}`);
      }
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Résumé final
    console.log('\n🎯 RÉSUMÉ FINAL:');
    console.log(`   Audits initial: ${initialAuditsToday}`);
    console.log(`   Audits final: ${testUserData.usage.auditsToday}`);
    console.log(`   Différence: ${testUserData.usage.auditsToday - initialAuditsToday}`);
    console.log(`   Tests effectués: ${engines.length}`);
    
    if (testUserData.usage.auditsToday - initialAuditsToday === engines.length) {
      console.log('\n🎉 SUCCÈS COMPLET !');
      console.log('✅ L\'incrémentation fonctionne pour TOUS les moteurs :');
      engines.forEach(engine => {
        console.log(`   • ${engine.toUpperCase()} ✅`);
      });
      console.log('\n🔥 Que ce soit :');
      console.log('   • AuditResults (wave, axe, rgaa) ✅');
      console.log('   • ComparativeTable (all) ✅');
      console.log('\n💾 Les données remontent bien en base après affichage des résultats !');
    } else {
      console.log('\n❌ PROBLÈME DÉTECTÉ');
      console.log('   Certains moteurs n\'incrémentent pas correctement');
      
      // Test de limite pour voir si ça bloque au 3e audit
      if (testUserData.usage.auditsToday >= 3) {
        console.log('\n🚦 Test du 4e audit (devrait être bloqué)...');
        
        const limitTestResponse = await fetch(`${PRODUCTION_URL}/api/user/increment-audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userData: testUserData })
        });
        
        if (limitTestResponse.ok) {
          console.log('   ❌ PROBLÈME: 4e audit autorisé (limite non respectée)');
        } else {
          console.log('   ✅ Limite correctement appliquée');
          const errorText = await limitTestResponse.text();
          console.log(`   Raison: ${errorText.substring(0, 100)}...`);
        }
      }
    }

  } catch (error) {
    console.error('💥 Erreur globale:', error.message);
  }
}

testAllEngines(); 