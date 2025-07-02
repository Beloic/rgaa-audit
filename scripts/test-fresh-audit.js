#!/usr/bin/env node

/**
 * Test simple d'audit sans données utilisateur
 */

const PRODUCTION_URL = 'https://rgaa-audit.vercel.app';

async function testFreshAudit() {
  console.log('🧪 Test d\'audit simple\n');

  try {
    console.log('🎯 Audit sans données utilisateur...');
    
    const auditResponse = await fetch(`${PRODUCTION_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com',
        engine: 'wave',
        // Pas de userData - audit anonyme
      })
    });

    console.log(`Statut: ${auditResponse.status}`);
    console.log(`Content-Type: ${auditResponse.headers.get('content-type')}`);

    if (auditResponse.ok) {
      const result = await auditResponse.json();
      console.log('✅ Audit anonyme réussi');
      console.log(`Score: ${result.score}`);
      console.log(`Violations: ${result.totalViolations}`);
    } else {
      console.log('❌ Erreur audit anonyme');
      const errorText = await auditResponse.text();
      console.log(`Erreur: ${errorText.substring(0, 500)}`);
    }

    // Test avec données utilisateur minimales
    console.log('\n🎯 Audit avec données utilisateur minimales...');
    
    const minimalUser = {
      email: 'test@example.com',
      emailVerified: true,
      subscription: { plan: 'free' },
      usage: { auditsToday: 0, auditsTotal: 0 }
    };

    const auditResponse2 = await fetch(`${PRODUCTION_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com',
        engine: 'wave',
        userData: minimalUser
      })
    });

    console.log(`Statut: ${auditResponse2.status}`);

    if (auditResponse2.ok) {
      const result2 = await auditResponse2.json();
      console.log('✅ Audit avec utilisateur minimal réussi');
      console.log(`Score: ${result2.score}`);
      console.log(`Violations: ${result2.totalViolations}`);
    } else {
      console.log('❌ Erreur audit avec utilisateur');
      const errorText2 = await auditResponse2.text();
      console.log(`Erreur: ${errorText2.substring(0, 500)}`);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

testFreshAudit(); 