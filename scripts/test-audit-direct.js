#!/usr/bin/env node

/**
 * Script de test direct de limitation avec utilisateur existant
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function testDirectAuditLimitation() {
  console.log('🧪 Test direct de limitation d\'audits\n');

  try {
    // Utiliser un compte existant que vous pouvez vérifier manuellement
    console.log('1. 🔑 Test avec compte existant...');
    
    // D'abord créer un compte puis le vérifier manuellement
    const testEmail = `limit-test-${Date.now()}@example.com`;
    const testName = 'Limitation Test';
    const testPassword = 'TestPassword123!';
    
    console.log(`   Création du compte: ${testEmail}`);
    
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

    const registerData = await registerResponse.json();
    console.log('✅ Compte créé');

    // Simuler un utilisateur avec email vérifié
    console.log('\n2. 🎭 Simulation utilisateur avec email vérifié...');
    
    // Créer un objet utilisateur "fake" avec email vérifié
    const mockVerifiedUser = {
      id: 'test-user-' + Date.now(),
      email: testEmail,
      name: testName,
      emailVerified: true, // FORCER l'email comme vérifié
      subscription: {
        plan: 'free',
        status: 'trial'
      },
      usage: {
        auditsToday: 0,
        auditsThisMonth: 0,
        auditsTotal: 0,
        lastAuditDate: null
      }
    };
    
    console.log('✅ Utilisateur simulé avec email vérifié');

    // Tester directement l'API /analyze
    console.log('\n3. 🎯 Test direct de l\'API /analyze...');
    
    let currentUserData = mockVerifiedUser;
    
    for (let i = 1; i <= 5; i++) {
      console.log(`\n   === Audit ${i}/5 ===`);
      
      try {
        console.log(`   📤 Envoi des données utilisateur:`);
        console.log(`      - Email vérifié: ${currentUserData.emailVerified}`);
        console.log(`      - Plan: ${currentUserData.subscription?.plan}`);
        console.log(`      - Audits aujourd'hui: ${currentUserData.usage?.auditsToday || 0}`);
        
        const auditResponse = await fetch(`${PRODUCTION_URL}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: 'https://example.com',
            engine: 'wave',
            userData: currentUserData
          })
        });

        console.log(`   📥 Statut réponse: ${auditResponse.status}`);

        if (!auditResponse.ok) {
          const errorData = await auditResponse.json();
          console.log(`   ❌ Erreur API: ${errorData.error}`);
          
          if (errorData.error && errorData.error.includes('Limite d\'audits')) {
            console.log(`   🎯 LIMITATION DÉTECTÉE au ${i}e audit !`);
            console.log(`   ✅ Le système de limitation fonctionne !`);
            break;
          } else if (errorData.error && errorData.error.includes('email')) {
            console.log(`   📧 Problème de vérification email détecté`);
            console.log(`   🔧 Tentative de contournement...`);
            
            // Forcer emailVerified = true plus explicitement
            currentUserData.emailVerified = true;
            continue;
          } else {
            console.log(`   🛑 Autre erreur, arrêt du test`);
            break;
          }
        }

        const result = await auditResponse.json();
        
        console.log(`   📊 Résultat de l'audit:`);
        console.log(`      - Score: ${result.score || 'N/A'}`);
        console.log(`      - Violations: ${result.totalViolations || 'N/A'}`);
        
        if (result.updatedUserData) {
          console.log(`   📈 Mise à jour utilisateur:`);
          console.log(`      - Audits aujourd'hui: ${result.updatedUserData.usage?.auditsToday || 0}`);
          console.log(`      - Audits total: ${result.updatedUserData.usage?.auditsTotal || 0}`);
          
          // Utiliser les données mises à jour pour le prochain audit
          currentUserData = result.updatedUserData;
          
          console.log(`   ✅ Audit ${i} réussi et données mises à jour`);
        } else {
          console.log(`   ⚠️ Pas de mise à jour des données utilisateur`);
          console.log(`   → Cela peut indiquer un problème de synchronisation`);
        }

      } catch (auditError) {
        console.log(`   💥 Erreur technique: ${auditError.message}`);
        break;
      }
      
      // Pause entre les audits
      console.log(`   ⏳ Pause de 3 secondes...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Diagnostic final
    console.log('\n4. 📋 DIAGNOSTIC FINAL:');
    
    const finalAuditsToday = currentUserData.usage?.auditsToday || 0;
    console.log(`   Audits effectués aujourd'hui: ${finalAuditsToday}`);
    
    if (finalAuditsToday === 0) {
      console.log('   ❌ PROBLÈME CRITIQUE: Aucun audit comptabilisé');
      console.log('   → La synchronisation ne fonctionne pas du tout');
    } else if (finalAuditsToday < 2) {
      console.log('   ⚠️ PROBLÈME PARTIEL: Comptage fonctionne mais pas testé jusqu\'à la limite');
      console.log('   → Relancer le script pour aller jusqu\'au bout');
    } else if (finalAuditsToday === 2) {
      console.log('   ✅ PARFAIT: 2 audits comptabilisés, limitation devrait s\'activer');
    } else {
      console.log('   ❌ PROBLÈME: Plus de 2 audits autorisés');
      console.log('   → La limitation ne s\'applique pas');
    }

  } catch (error) {
    console.error('💥 Erreur globale du test:', error.message);
  }
}

// Exécuter le test
testDirectAuditLimitation(); 