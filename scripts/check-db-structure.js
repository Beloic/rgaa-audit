#!/usr/bin/env node

/**
 * Script pour vérifier la structure de la base de données
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function checkDatabaseStructure() {
  console.log('🔍 Vérification structure base de données\n');

  try {
    // Test avec un update qui contient TOUS les champs pour voir lesquels sont rejetés
    console.log('1. 🧪 Test avec tous les champs possibles...');
    
    const testEmail = 'lauregagnonn@gmail.com';
    
    const fullUpdateData = {
      email: testEmail,
      updates: {
        name: 'Structure Test',
        // Champs usage - ceux qui nous intéressent
        usage: {
          auditsToday: 88,
          auditsTotal: 88,
          auditsThisMonth: 88,
          lastAuditDate: new Date().toISOString(),
          teamMembers: 2,
          storageUsed: 100
        },
        // Champs settings
        settings: {
          defaultLanguage: 'en',
          emailNotifications: false,
          theme: 'dark'
        }
      }
    };

    const response = await fetch(`${PRODUCTION_URL}/api/user/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullUpdateData)
    });

    console.log(`   Statut: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Update accepté');
      
      // Vérifier ce qui a été vraiment sauvé
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const checkResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      if (checkResponse.ok) {
        const userData = await checkResponse.json();
        console.log('\n📊 Valeurs en base après update:');
        console.log(`   Nom: ${userData.name}`);
        console.log(`   audits_today: ${userData.usage?.auditsToday || 'undefined'}`);
        console.log(`   audits_total: ${userData.usage?.auditsTotal || 'undefined'}`);
        console.log(`   audits_this_month: ${userData.usage?.auditsThisMonth || 'undefined'}`);
        console.log(`   theme: ${userData.settings?.theme || 'undefined'}`);
        
        // Analyser quels champs ont été sauvés
        console.log('\n🔍 ANALYSE:');
        
        if (userData.name === 'Structure Test') {
          console.log('✅ Champ name sauvé correctement');
        } else {
          console.log('❌ Champ name pas sauvé');
        }
        
        if (userData.usage?.auditsToday === 88) {
          console.log('✅ audits_today fonctionne !');
        } else {
          console.log('❌ audits_today ne fonctionne pas');
        }
        
        if (userData.usage?.auditsTotal === 88) {
          console.log('✅ audits_total fonctionne !');
        } else {
          console.log('❌ audits_total ne fonctionne pas');
        }
        
        if (userData.usage?.auditsThisMonth === 88) {
          console.log('✅ audits_this_month fonctionne !');
        } else {
          console.log('❌ audits_this_month ne fonctionne pas');
        }
        
        if (userData.settings?.theme === 'dark') {
          console.log('✅ Champ theme sauvé');
        } else {
          console.log('❌ Champ theme pas sauvé');
        }
      }
      
    } else {
      console.log('❌ Update rejeté');
      const errorText = await response.text();
      console.log(`   Erreur: ${errorText}`);
    }

    // Test 2: Update direct des colonnes avec les noms Supabase
    console.log('\n2. 🔧 Test direct avec noms de colonnes Supabase...');
    
    const directUpdateData = {
      email: testEmail,
      updates: {
        audits_today: 77,      // Nom direct de la colonne
        audits_total: 77,      // Nom direct de la colonne
        audits_this_month: 77  // Nom direct de la colonne
      }
    };

    const directResponse = await fetch(`${PRODUCTION_URL}/api/user/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(directUpdateData)
    });

    console.log(`   Statut direct: ${directResponse.status}`);
    
    if (directResponse.ok) {
      console.log('✅ Update direct accepté');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const checkDirectResponse = await fetch(`${PRODUCTION_URL}/api/user/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      if (checkDirectResponse.ok) {
        const directUserData = await checkDirectResponse.json();
        console.log('\n📊 Valeurs après update direct:');
        console.log(`   audits_today: ${directUserData.usage?.auditsToday || 'undefined'}`);
        console.log(`   audits_total: ${directUserData.usage?.auditsTotal || 'undefined'}`);
        console.log(`   audits_this_month: ${directUserData.usage?.auditsThisMonth || 'undefined'}`);
        
        if (directUserData.usage?.auditsToday === 77) {
          console.log('✅ Update direct fonctionne !');
        } else {
          console.log('❌ Même l\'update direct ne fonctionne pas');
        }
      }
    } else {
      const directErrorText = await directResponse.text();
      console.log(`❌ Update direct rejeté: ${directErrorText}`);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

checkDatabaseStructure(); 