#!/usr/bin/env node

/**
 * Script de test avec vérification email automatique
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function testWithVerifiedEmail() {
  console.log('🧪 Test avec vérification email automatique\n');

  try {
    // 1. Créer un compte de test
    console.log('1. 📝 Création d\'un compte de test...');
    
    const testEmail = `test-${Date.now()}@example.com`;
    const testName = 'Test User Verified';
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
    console.log(`   Token de vérification: ${userData.emailVerificationToken?.substring(0, 10)}...`);

    // 2. Vérifier l'email automatiquement
    console.log('\n2. ✉️ Vérification automatique de l\'email...');
    
    if (userData.emailVerificationToken) {
      const verifyResponse = await fetch(`${PRODUCTION_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: userData.emailVerificationToken
        })
      });

      if (verifyResponse.ok) {
        console.log('✅ Email vérifié avec succès');
        userData.emailVerified = true;
      } else {
        const verifyError = await verifyResponse.json();
        console.log(`❌ Erreur vérification email: ${verifyError.error}`);
        return;
      }
    } else {
      console.log('❌ Pas de token de vérification reçu');
      return;
    }

    // 3. Tester les audits avec email vérifié
    console.log('\n3. 🎯 Test de limitation avec audits successifs...');
    
    let currentUserData = userData;
    
    for (let i = 1; i <= 5; i++) {
      console.log(`\n   Audit ${i}/5...`);
      
      try {
        const auditResponse = await fetch(`${PRODUCTION_URL}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: 'https://example.com',
            engine: 'wave',
            userData: currentUserData
          })
        });

        if (!auditResponse.ok) {
          const errorData = await auditResponse.json();
          if (errorData.error && errorData.error.includes('Limite d\'audits')) {
            console.log(`   🚫 LIMITE ATTEINTE au ${i}e audit: ${errorData.error}`);
            console.log(`   ✅ La limitation fonctionne correctement !`);
            break;
          } else {
            console.log(`   ❌ Erreur audit ${i}: ${errorData.error}`);
            console.log(`   Statut: ${auditResponse.status}`);
            
            // Afficher plus de détails sur l'erreur
            try {
              const fullResponse = await auditResponse.text();
              console.log(`   Réponse complète: ${fullResponse.substring(0, 200)}...`);
            } catch (e) {
              console.log(`   Impossible de lire la réponse complète`);
            }
            break;
          }
        }

        const result = await auditResponse.json();
        
        if (result.updatedUserData) {
          console.log(`   ✅ Audit ${i} réussi`);
          console.log(`      - Audits aujourd'hui: ${result.updatedUserData.usage?.auditsToday || 0}`);
          console.log(`      - Audits total: ${result.updatedUserData.usage?.auditsTotal || 0}`);
          console.log(`      - Dernier audit: ${result.updatedUserData.usage?.lastAuditDate || 'N/A'}`);
          
          // Mettre à jour pour le prochain audit
          currentUserData = result.updatedUserData;
        } else {
          console.log(`   ⚠️ Audit ${i} sans mise à jour de données utilisateur`);
          console.log(`   Score: ${result.score || 'N/A'}`);
          console.log(`   Violations: ${result.totalViolations || 'N/A'}`);
        }

      } catch (auditError) {
        console.log(`   ❌ Erreur technique audit ${i}:`, auditError.message);
      }
      
      // Pause entre les audits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 4. Vérification finale
    console.log('\n4. 🔍 Vérification finale des données en base...');
    
    const refreshResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    if (refreshResponse.ok) {
      const refreshedData = await refreshResponse.json();
      console.log('✅ Données finales en base:');
      console.log(`   - Email vérifié: ${refreshedData.emailVerified ? 'Oui' : 'Non'}`);
      console.log(`   - Plan: ${refreshedData.subscription?.plan}`);
      console.log(`   - Audits aujourd'hui: ${refreshedData.usage?.auditsToday || 0}`);
      console.log(`   - Audits total: ${refreshedData.usage?.auditsTotal || 0}`);
      console.log(`   - Dernier audit: ${refreshedData.usage?.lastAuditDate || 'Jamais'}`);

      // Diagnostic final
      const auditsToday = refreshedData.usage?.auditsToday || 0;
      console.log('\n📊 DIAGNOSTIC FINAL:');
      if (auditsToday === 0) {
        console.log('❌ ÉCHEC: audits_today = 0 en base');
        console.log('   → Problème de synchronisation avec Supabase');
      } else if (auditsToday >= 1 && auditsToday < 3) {
        console.log('✅ PARTIEL: audits_today s\'incrémente');
        console.log('   → Besoin de tester jusqu\'à la limite');
      } else if (auditsToday >= 3) {
        console.log('⚠️ PROBLÈME: Plus de 2 audits autorisés');
        console.log('   → La limitation ne s\'applique pas correctement');
      }
    }

  } catch (error) {
    console.error('❌ Erreur globale:', error.message);
  }
}

// Exécuter le test
testWithVerifiedEmail(); 