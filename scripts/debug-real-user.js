#!/usr/bin/env node

/**
 * Script de diagnostic pour un utilisateur réel
 * Utilisez ce script avec l'email d'un compte que vous venez de créer et vérifier
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function debugRealUser() {
  console.log('🔍 Diagnostic utilisateur réel\n');

  // Demander l'email à l'utilisateur
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('❌ Usage: node scripts/debug-real-user.js <email-utilisateur>');
    console.log('   Exemple: node scripts/debug-real-user.js test@example.com');
    return;
  }

  const userEmail = args[0];
  console.log(`📧 Email à diagnostiquer: ${userEmail}\n`);

  try {
    // 1. Récupérer les données utilisateur depuis la base
    console.log('1. 📊 Récupération des données utilisateur...');
    
    const refreshResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    if (!refreshResponse.ok) {
      console.log('❌ Impossible de récupérer les données utilisateur');
      console.log(`   Statut: ${refreshResponse.status}`);
      
      if (refreshResponse.status === 404) {
        console.log('   → L\'utilisateur n\'existe pas en base');
      } else {
        const errorData = await refreshResponse.json();
        console.log(`   → Erreur: ${errorData.error}`);
      }
      return;
    }

    const userData = await refreshResponse.json();
    console.log('✅ Données utilisateur récupérées:');
    console.log(`   - Email: ${userData.email}`);
    console.log(`   - Nom: ${userData.name}`);
    console.log(`   - Email vérifié: ${userData.emailVerified ? '✅ OUI' : '❌ NON'}`);
    console.log(`   - Plan: ${userData.subscription?.plan || 'Non défini'}`);
    console.log(`   - Statut: ${userData.subscription?.status || 'Non défini'}`);
    console.log(`   - Audits aujourd'hui: ${userData.usage?.auditsToday || 0}`);
    console.log(`   - Audits total: ${userData.usage?.auditsTotal || 0}`);
    console.log(`   - Dernier audit: ${userData.usage?.lastAuditDate || 'Jamais'}`);

    // 2. Vérifier si l'email est vraiment vérifié
    if (!userData.emailVerified) {
      console.log('\n❌ PROBLÈME IDENTIFIÉ: Email non vérifié !');
      console.log('   → Cela explique pourquoi les audits sont bloqués');
      console.log('   → Vérifiez votre boîte mail et cliquez sur le lien de confirmation');
      return;
    }

    console.log('\n✅ Email vérifié, on peut tester les audits');

    // 3. Test d'audit avec les vraies données
    console.log('\n2. 🎯 Test d\'audit avec les vraies données...');
    
    console.log('\n   === Test Audit ===');
    console.log(`   📤 Données envoyées:`);
    console.log(`      - Email vérifié: ${userData.emailVerified}`);
    console.log(`      - Plan: ${userData.subscription?.plan}`);
    console.log(`      - Audits aujourd'hui: ${userData.usage?.auditsToday || 0}`);
    
    const auditResponse = await fetch(`${PRODUCTION_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com',
        engine: 'wave',
        userData: userData
      })
    });

    console.log(`   📥 Statut réponse: ${auditResponse.status}`);

    if (!auditResponse.ok) {
      const errorData = await auditResponse.json();
      console.log(`   ❌ Erreur: ${errorData.error}`);
      
      if (errorData.error && errorData.error.includes('Limite d\'audits')) {
        console.log(`   🎯 LIMITATION DÉTECTÉE !`);
        console.log(`   ✅ Le système fonctionne (limite atteinte)`);
      } else if (errorData.error && errorData.error.includes('email')) {
        console.log(`   📧 Problème de vérification email`);
        console.log(`   🔍 Vérification plus approfondie nécessaire`);
      } else {
        console.log(`   🛑 Autre type d'erreur`);
      }
    } else {
      const result = await auditResponse.json();
      
      console.log(`   ✅ Audit réussi !`);
      console.log(`   📊 Résultats:`);
      console.log(`      - Score: ${result.score}`);
      console.log(`      - Violations: ${result.totalViolations}`);
      
      if (result.updatedUserData) {
        console.log(`   📈 Données mises à jour:`);
        console.log(`      - Audits aujourd'hui: ${result.updatedUserData.usage?.auditsToday}`);
        console.log(`      - Audits total: ${result.updatedUserData.usage?.auditsTotal}`);
      } else {
        console.log(`   ⚠️ Pas de mise à jour des données utilisateur`);
      }
    }

    // 4. Vérification finale des données en base
    console.log('\n3. 🔄 Vérification finale des données...');
    
    const finalCheckResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    if (finalCheckResponse.ok) {
      const finalData = await finalCheckResponse.json();
      console.log('✅ Données finales en base:');
      console.log(`   - Audits aujourd'hui: ${finalData.usage?.auditsToday || 0}`);
      console.log(`   - Audits total: ${finalData.usage?.auditsTotal || 0}`);
      console.log(`   - Dernier audit: ${finalData.usage?.lastAuditDate || 'Jamais'}`);
      
      // Comparaison
      const initialAudits = userData.usage?.auditsToday || 0;
      const finalAudits = finalData.usage?.auditsToday || 0;
      
      console.log('\n📊 COMPARAISON:');
      console.log(`   Avant: ${initialAudits} audits`);
      console.log(`   Après: ${finalAudits} audits`);
      
      if (finalAudits > initialAudits) {
        console.log('   ✅ Le compteur s\'est bien incrémenté');
      } else {
        console.log('   ❌ Le compteur ne s\'est pas incrémenté');
        console.log('   → Problème de synchronisation avec la base');
      }
    }

  } catch (error) {
    console.error('💥 Erreur globale:', error.message);
  }
}

// Exécuter le diagnostic
debugRealUser(); 