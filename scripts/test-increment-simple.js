#!/usr/bin/env node

/**
 * Test simple de l'API d'incrémentation des audits
 */

const PRODUCTION_URL = 'http://localhost:3008';

async function testIncrementAPI() {
  console.log('🧪 Test simple de l\'API d\'incrémentation\n');

  // Données d'utilisateur de test fictives
  const testUserData = {
    id: 'test-123',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true, // Important : email vérifié
    betaAccess: {
      granted: false,
      hasQuit: false
    },
    subscription: {
      plan: 'free',
      status: 'trial'
    },
    usage: {
      auditsToday: 1,       // Déjà 1 audit aujourd'hui
      auditsThisMonth: 5,   // 5 ce mois-ci
      auditsTotal: 20,      // 20 au total
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

  try {
    console.log('📊 État initial simulé:');
    console.log(`   Email: ${testUserData.email}`);
    console.log(`   Email vérifié: ${testUserData.emailVerified ? 'Oui' : 'Non'}`);
    console.log(`   Plan: ${testUserData.subscription.plan}`);
    console.log(`   Audits aujourd'hui: ${testUserData.usage.auditsToday}`);
    console.log(`   Audits total: ${testUserData.usage.auditsTotal}`);

    // Test de l'API d'incrémentation
    console.log('\n📈 Test de l\'API d\'incrémentation...');
    
    const incrementResponse = await fetch(`${PRODUCTION_URL}/api/user/increment-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData: testUserData })
    });

    console.log(`   Statut: ${incrementResponse.status}`);

    if (incrementResponse.ok) {
      const result = await incrementResponse.json();
      console.log('✅ API d\'incrémentation répond correctement');
      
      if (result.success && result.updatedUserData) {
        const updated = result.updatedUserData;
        console.log('\n📊 Données après incrémentation:');
        console.log(`   Audits aujourd'hui: ${updated.usage?.auditsToday} (était ${testUserData.usage.auditsToday})`);
        console.log(`   Audits total: ${updated.usage?.auditsTotal} (était ${testUserData.usage.auditsTotal})`);
        console.log(`   Audits ce mois: ${updated.usage?.auditsThisMonth} (était ${testUserData.usage.auditsThisMonth})`);
        console.log(`   Dernier audit: ${updated.usage?.lastAuditDate}`);
        
        // Vérifications
        const expectedAuditsToday = testUserData.usage.auditsToday + 1;
        const expectedAuditsTotal = testUserData.usage.auditsTotal + 1;
        const expectedAuditsThisMonth = testUserData.usage.auditsThisMonth + 1;
        
        console.log('\n🎯 VÉRIFICATIONS:');
        
        if (updated.usage?.auditsToday === expectedAuditsToday) {
          console.log('✅ auditsToday incrémenté correctement');
        } else {
          console.log(`❌ auditsToday: attendu ${expectedAuditsToday}, obtenu ${updated.usage?.auditsToday}`);
        }
        
        if (updated.usage?.auditsTotal === expectedAuditsTotal) {
          console.log('✅ auditsTotal incrémenté correctement');
        } else {
          console.log(`❌ auditsTotal: attendu ${expectedAuditsTotal}, obtenu ${updated.usage?.auditsTotal}`);
        }
        
        if (updated.usage?.auditsThisMonth === expectedAuditsThisMonth) {
          console.log('✅ auditsThisMonth incrémenté correctement');
        } else {
          console.log(`❌ auditsThisMonth: attendu ${expectedAuditsThisMonth}, obtenu ${updated.usage?.auditsThisMonth}`);
        }

        // Test de la limite quotidienne
        console.log('\n🚦 Test de la limite quotidienne (2 audits max)...');
        
        // Simuler 2 audits supplémentaires pour atteindre la limite
        for (let i = 1; i <= 2; i++) {
          console.log(`\n   Test ${i + 1}/3...`);
          
          const testData = {
            ...testUserData,
            usage: {
              ...testUserData.usage,
              auditsToday: testUserData.usage.auditsToday + i,
              auditsTotal: testUserData.usage.auditsTotal + i,
              auditsThisMonth: testUserData.usage.auditsThisMonth + i
            }
          };
          
          const limitTestResponse = await fetch(`${PRODUCTION_URL}/api/user/increment-audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userData: testData })
          });
          
          if (limitTestResponse.ok) {
            const limitResult = await limitTestResponse.json();
            console.log(`   ✅ Audit ${testData.usage.auditsToday + 1} autorisé`);
          } else {
            console.log(`   ❌ Audit ${testData.usage.auditsToday + 1} refusé`);
          }
        }

        // Test au-delà de la limite
        console.log('\n   Test dépassement de limite (4e audit)...');
        const limitExceededData = {
          ...testUserData,
          usage: {
            ...testUserData.usage,
            auditsToday: 2, // Déjà 2 audits aujourd'hui
            auditsTotal: testUserData.usage.auditsTotal + 3,
            auditsThisMonth: testUserData.usage.auditsThisMonth + 3
          }
        };
        
        const limitExceededResponse = await fetch(`${PRODUCTION_URL}/api/user/increment-audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userData: limitExceededData })
        });
        
        if (limitExceededResponse.ok) {
          console.log('   ❌ PROBLÈME: 3e audit autorisé (ne devrait pas)');
        } else {
          console.log('   ✅ 3e audit refusé correctement');
          const errorText = await limitExceededResponse.text();
          console.log(`   Raison: ${errorText}`);
        }

        console.log('\n🎉 RÉSULTAT: L\'API d\'incrémentation fonctionne !');
        
      } else {
        console.log('❌ Réponse API incomplète:', result);
      }
      
    } else {
      const errorText = await incrementResponse.text();
      console.log(`❌ Erreur API: ${errorText}`);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

testIncrementAPI(); 