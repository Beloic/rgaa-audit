#!/usr/bin/env node

/**
 * Script de vérification et ajout de colonnes manquantes
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function verifyAndAddColumns() {
  console.log('🔍 Vérification des colonnes en production\n');

  const testEmail = 'lauregagnonn@gmail.com';

  try {
    // 1. Tester d'abord si l'API /analyze fonctionne
    console.log('1. 📊 État initial...');
    
    const initialResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    if (!initialResponse.ok) {
      console.log('❌ Impossible de récupérer l\'utilisateur');
      return;
    }

    const initialData = await initialResponse.json();
    console.log(`   Audits avant: ${initialData.usage?.auditsToday || 0}`);

    // 2. Lancer un audit et surveiller de près
    console.log('\n2. 🎯 Audit avec surveillance...');
    
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
    console.log(`   Durée: ${auditEndTime - auditStartTime}ms`);
    console.log(`   Statut: ${auditResponse.status}`);

    if (auditResponse.ok) {
      const auditResult = await auditResponse.json();
      console.log('✅ Audit terminé');
      console.log(`   Score: ${auditResult.score}`);
      
      if (auditResult.updatedUserData) {
        console.log(`   API retourne auditsToday: ${auditResult.updatedUserData.usage?.auditsToday}`);
        console.log(`   API retourne auditsTotal: ${auditResult.updatedUserData.usage?.auditsTotal}`);
      } else {
        console.log('❌ Pas de updatedUserData dans la réponse !');
      }
    } else {
      console.log('❌ Erreur audit');
      const errorText = await auditResponse.text();
      console.log(`   Erreur: ${errorText.substring(0, 300)}`);
      return;
    }

    // 3. Vérifier immédiatement après l'audit
    console.log('\n3. 🔄 Vérification immédiate...');
    
    const immediateResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    if (immediateResponse.ok) {
      const immediateData = await immediateResponse.json();
      console.log(`   Audits après: ${immediateData.usage?.auditsToday || 0}`);
      
      if (immediateData.usage?.auditsToday > initialData.usage?.auditsToday) {
        console.log('✅ SUCCESS: Les données sont sauvées !');
      } else {
        console.log('❌ ÉCHEC: Pas de mise à jour en base');
        
        // Diagnostic approfondi
        console.log('\n🔍 DIAGNOSTIC APPROFONDI:');
        console.log('   → Vérifier les logs Vercel pour voir les erreurs');
        console.log('   → Les colonnes audits_today, audits_total existent-elles ?');
        console.log('   → Y a-t-il des erreurs de permissions Supabase ?');
        
        // Timestamp pour chercher dans les logs
        console.log(`\n📋 TIMESTAMP AUDIT: ${new Date(auditStartTime).toISOString()}`);
        console.log(`   Rechercher ce timestamp dans les logs Vercel`);
      }
    }

    // 4. Test de forçage avec l'API update pour confirmer
    console.log('\n4. 🧪 Test de forçage via API update...');
    
    const forceUpdateData = {
      email: testEmail,
      updates: {
        audits_today: 42, // Valeur facile à repérer
        audits_total: 42,
        audits_this_month: 42
      }
    };

    const forceResponse = await fetch(`${PRODUCTION_URL}/api/user/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forceUpdateData)
    });

    if (forceResponse.ok) {
      console.log('✅ Update direct accepté');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const verifyForceResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      if (verifyForceResponse.ok) {
        const verifyForceData = await verifyForceResponse.json();
        console.log(`   audits_today en base: ${verifyForceData.usage?.auditsToday || 'undefined'}`);
        
        if (verifyForceData.usage?.auditsToday === 42) {
          console.log('✅ Les colonnes existent et l\'update fonctionne !');
          console.log('   → Le problème est spécifique à l\'API /analyze');
        } else {
          console.log('❌ Les colonnes n\'existent pas en production');
          console.log('   → Il faut exécuter le script SQL pour les ajouter');
        }
      }
    } else {
      const forceError = await forceResponse.text();
      console.log(`❌ Update direct échoue: ${forceError}`);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

verifyAndAddColumns(); 