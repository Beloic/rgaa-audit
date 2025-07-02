#!/usr/bin/env node

/**
 * Test du nouveau flux d'incrémentation des audits
 * L'incrémentation se fait APRÈS l'affichage des résultats
 */

const PRODUCTION_URL = 'http://localhost:3008'; // URL locale pour le test

async function testNewAuditFlow() {
  console.log('🧪 Test du nouveau flux d\'incrémentation des audits\n');

  const testEmail = `test-${Date.now()}@example.com`; // Email unique

  try {
    // 1. Récupérer l'état initial de l'utilisateur
    console.log('1. 📊 État initial de l\'utilisateur...');
    
    const initialResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    let userData;
    if (initialResponse.ok) {
      userData = await initialResponse.json();
      console.log(`   Email: ${userData.email}`);
      console.log(`   Email vérifié: ${userData.emailVerified ? 'Oui' : 'Non'}`);
      console.log(`   Audits aujourd'hui: ${userData.usage?.auditsToday || 0}`);
      console.log(`   Audits total: ${userData.usage?.auditsTotal || 0}`);
      
      // S'assurer que l'email est vérifié pour les tests
      if (!userData.emailVerified) {
        console.log('🔧 Marquage de l\'email comme vérifié pour les tests...');
        const verifyResponse = await fetch(`${PRODUCTION_URL}/api/user/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            updates: {
              emailVerified: true
            }
          })
        });
        
        if (verifyResponse.ok) {
          console.log('✅ Email marqué comme vérifié');
          // Récupérer les données mises à jour
          const refreshResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail })
          });
          
          if (refreshResponse.ok) {
            userData = await refreshResponse.json();
            console.log(`   Email vérifié après mise à jour: ${userData.emailVerified ? 'Oui' : 'Non'}`);
          }
        } else {
          const verifyError = await verifyResponse.text();
          console.log(`❌ Erreur vérification email: ${verifyError}`);
        }
      }
    } else {
      console.log('❌ Utilisateur introuvable, création d\'un utilisateur de test...');
      
      const createResponse = await fetch(`${PRODUCTION_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          name: 'Test User',
          password: 'test123456'
        })
      });
      
      if (createResponse.ok) {
        const createData = await createResponse.json();
        userData = createData.user;
        console.log('✅ Utilisateur de test créé');
        
        // Marquer l'email comme vérifié pour les tests
        const verifyResponse = await fetch(`${PRODUCTION_URL}/api/user/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            updates: {
              emailVerified: true
            }
          })
        });
        
        if (verifyResponse.ok) {
          console.log('✅ Email marqué comme vérifié pour les tests');
          // Récupérer les données mises à jour
          const refreshResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail })
          });
          
          if (refreshResponse.ok) {
            userData = await refreshResponse.json();
            console.log(`   Email vérifié après mise à jour: ${userData.emailVerified ? 'Oui' : 'Non'}`);
          }
        } else {
          const verifyError = await verifyResponse.text();
          console.log(`❌ Erreur vérification email: ${verifyError}`);
        }
        
        console.log(`   Email vérifié: ${userData.emailVerified ? 'Oui' : 'Non'}`);
        console.log(`   Audits aujourd'hui: ${userData.usage?.auditsToday || 0}`);
        console.log(`   Audits total: ${userData.usage?.auditsTotal || 0}`);
      } else {
        console.log('❌ Impossible de créer l\'utilisateur de test');
        const createError = await createResponse.text();
        console.log(`   Erreur: ${createError}`);
        return;
      }
    }

    const initialAuditsToday = userData.usage?.auditsToday || 0;
    const initialAuditsTotal = userData.usage?.auditsTotal || 0;

    // 2. Lancer une analyse (ne devrait PAS incrémenter)
    console.log('\n2. 🎯 Lancement de l\'analyse...');
    
    const auditResponse = await fetch(`${PRODUCTION_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com',
        engine: 'wave',
        userData: userData
      })
    });

    console.log(`   Statut: ${auditResponse.status}`);

    if (auditResponse.ok) {
      const auditResult = await auditResponse.json();
      console.log('✅ Analyse terminée');
      console.log(`   Score: ${auditResult.score}`);
      console.log(`   Violations: ${auditResult.totalViolations}`);
      
      // Vérifier que les données n'ont PAS été incrémentées par l'API analyze
      if (auditResult.updatedUserData) {
        console.log(`   auditsToday dans la réponse: ${auditResult.updatedUserData.usage?.auditsToday}`);
        
        if (auditResult.updatedUserData.usage?.auditsToday === initialAuditsToday) {
          console.log('✅ CORRECT: L\'API analyze n\'a pas incrémenté les audits');
        } else {
          console.log('❌ PROBLÈME: L\'API analyze a incrémenté les audits (pas censé faire ça)');
        }
      }
    } else {
      console.log('❌ Erreur analyse');
      const errorText = await auditResponse.text();
      console.log(`   Erreur: ${errorText.substring(0, 200)}`);
      return;
    }

    // 3. Simuler l'affichage des résultats (appel API increment-audit)
    console.log('\n3. 📈 Simulation de l\'affichage des résultats...');
    
    const incrementResponse = await fetch(`${PRODUCTION_URL}/api/user/increment-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData })
    });

    console.log(`   Statut incrémentation: ${incrementResponse.status}`);

    if (incrementResponse.ok) {
      const incrementData = await incrementResponse.json();
      console.log('✅ Incrémentation réussie');
      console.log(`   Nouveaux auditsToday: ${incrementData.updatedUserData?.usage?.auditsToday}`);
      console.log(`   Nouveaux auditsTotal: ${incrementData.updatedUserData?.usage?.auditsTotal}`);
      
      // Vérifier que l'incrémentation a bien eu lieu
      const newAuditsToday = incrementData.updatedUserData?.usage?.auditsToday || 0;
      const newAuditsTotal = incrementData.updatedUserData?.usage?.auditsTotal || 0;
      
      if (newAuditsToday === initialAuditsToday + 1) {
        console.log('✅ SUCCÈS: auditsToday a été incrémenté correctement');
      } else {
        console.log(`❌ ÉCHEC: auditsToday attendu ${initialAuditsToday + 1}, reçu ${newAuditsToday}`);
      }
      
      if (newAuditsTotal === initialAuditsTotal + 1) {
        console.log('✅ SUCCÈS: auditsTotal a été incrémenté correctement');
      } else {
        console.log(`❌ ÉCHEC: auditsTotal attendu ${initialAuditsTotal + 1}, reçu ${newAuditsTotal}`);
      }
    } else {
      const incrementError = await incrementResponse.text();
      console.log(`❌ Incrémentation échouée: ${incrementError}`);
    }

    // 4. Vérification finale en base de données
    console.log('\n4. 🔄 Vérification finale en base...');
    
    const finalResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    if (finalResponse.ok) {
      const finalData = await finalResponse.json();
      console.log('📊 État final en base:');
      console.log(`   Audits aujourd'hui: ${finalData.usage?.auditsToday || 0}`);
      console.log(`   Audits total: ${finalData.usage?.auditsTotal || 0}`);
      console.log(`   Dernier audit: ${finalData.usage?.lastAuditDate || 'Jamais'}`);
      
      // Diagnostic final
      const finalAuditsToday = finalData.usage?.auditsToday || 0;
      const finalAuditsTotal = finalData.usage?.auditsTotal || 0;
      
      console.log('\n🎯 RÉSULTAT FINAL:');
      if (finalAuditsToday === initialAuditsToday + 1 && finalAuditsTotal === initialAuditsTotal + 1) {
        console.log('✅ SUCCESS COMPLET: Les audits ont été incrémentés après affichage des résultats !');
        console.log('   → Le nouveau flux fonctionne parfaitement');
        console.log('   → L\'incrémentation se fait bien APRÈS l\'affichage des résultats');
      } else {
        console.log('❌ PROBLÈME: Les compteurs ne sont pas corrects');
        console.log(`   → auditsToday: attendu ${initialAuditsToday + 1}, obtenu ${finalAuditsToday}`);
        console.log(`   → auditsTotal: attendu ${initialAuditsTotal + 1}, obtenu ${finalAuditsTotal}`);
      }
    }

  } catch (error) {
    console.error('💥 Erreur globale:', error.message);
  }
}

testNewAuditFlow(); 