#!/usr/bin/env node

/**
 * Script de diagnostic Supabase
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function diagnoseSupabase() {
  console.log('🔍 Diagnostic Supabase\n');

  const userEmail = 'lauregagnonn@gmail.com';

  try {
    // 1. Test de l'API user/refresh (lecture Supabase)
    console.log('1. 📖 Test lecture Supabase via /api/user/refresh...');
    
    const refreshResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    if (refreshResponse.ok) {
      const userData = await refreshResponse.json();
      console.log('✅ Lecture Supabase fonctionne');
      console.log(`   - audits_today: ${userData.usage?.auditsToday || 0}`);
      console.log(`   - audits_total: ${userData.usage?.auditsTotal || 0}`);
      console.log(`   - audits_this_month: ${userData.usage?.auditsThisMonth || 0}`);
    } else {
      console.log('❌ Lecture Supabase échoue');
      const error = await refreshResponse.text();
      console.log(`   Erreur: ${error}`);
      return;
    }

    // 2. Test de l'API user/update (écriture Supabase)
    console.log('\n2. ✏️ Test écriture Supabase via /api/user/update...');
    
    const updateData = {
      email: userEmail,
      updates: {
        usage: {
          auditsToday: 99,
          auditsTotal: 99,
          auditsThisMonth: 99,
          lastAuditDate: new Date().toISOString()
        }
      }
    };

    const updateResponse = await fetch(`${PRODUCTION_URL}/api/user/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (updateResponse.ok) {
      console.log('✅ API update répond correctement');
      const updateResult = await updateResponse.json();
      console.log(`   Message: ${updateResult.message}`);
    } else {
      console.log('❌ API update échoue');
      const updateError = await updateResponse.text();
      console.log(`   Erreur: ${updateError}`);
    }

    // 3. Vérifier si la mise à jour a fonctionné
    console.log('\n3. 🔄 Vérification après mise à jour...');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes

    const verifyResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('📊 Valeurs après tentative de mise à jour:');
      console.log(`   - audits_today: ${verifyData.usage?.auditsToday || 0}`);
      console.log(`   - audits_total: ${verifyData.usage?.auditsTotal || 0}`);
      console.log(`   - audits_this_month: ${verifyData.usage?.auditsThisMonth || 0}`);
      
      if (verifyData.usage?.auditsToday === 99) {
        console.log('\n✅ SUCCESS: La sauvegarde Supabase fonctionne !');
        console.log('   → Le problème est spécifique à l\'API /analyze');
      } else {
        console.log('\n❌ PROBLÈME: La sauvegarde Supabase ne fonctionne pas');
        console.log('   → Problème de configuration ou de permissions');
      }
    }

    // 4. Test direct de modification simple
    console.log('\n4. 🔧 Test modification simple (nom)...');
    
    const simpleUpdateData = {
      email: userEmail,
      updates: {
        name: 'Test Modification ' + Date.now()
      }
    };

    const simpleUpdateResponse = await fetch(`${PRODUCTION_URL}/api/user/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simpleUpdateData)
    });

    if (simpleUpdateResponse.ok) {
      console.log('✅ Modification simple acceptée');
      
      // Vérifier
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const verifySimpleResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      if (verifySimpleResponse.ok) {
        const verifySimpleData = await verifySimpleResponse.json();
        console.log(`   Nom en base: ${verifySimpleData.name}`);
        
        if (verifySimpleData.name.includes('Test Modification')) {
          console.log('✅ Supabase write fonctionne pour les champs simples');
        } else {
          console.log('❌ Même les modifications simples ne fonctionnent pas');
        }
      }
    } else {
      console.log('❌ Modification simple échoue');
    }

    // 5. Diagnostic final
    console.log('\n📋 DIAGNOSTIC SUPABASE:');
    console.log('   → Si lecture OK mais écriture KO = problème de permissions');
    console.log('   → Si écriture simple OK mais usage KO = problème de structure/colonnes');
    console.log('   → Si tout KO = problème de connexion/configuration');

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

diagnoseSupabase(); 