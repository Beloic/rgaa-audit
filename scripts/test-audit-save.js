const { saveAuditToDatabase } = require('../src/lib/audit-history.ts');

async function testAuditSave() {
  console.log('🧪 Test de sauvegarde d\'audit...');
  
  // Résultat d'audit test
  const testResult = {
    url: 'https://example.com',
    timestamp: new Date(),
    totalViolations: 2,
    score: 92,
    violations: [
      {
        rule: 'test-rule',
        description: 'Test violation',
        element: 'body',
        context: 'Test context',
        impact: 'medium',
        level: 'AA'
      }
    ],
    summary: 'Test audit summary',
    violationsByImpact: { low: 0, medium: 1, high: 1, critical: 0 },
    violationsByLevel: { A: 0, AA: 2, AAA: 0 },
    engine: 'wave'
  };

  try {
    console.log('📧 Test pour lauregagnonn@gmail.com...');
    
    const result = await saveAuditToDatabase(testResult, 'wave', 'lauregagnonn@gmail.com');
    
    if (result) {
      console.log('✅ Sauvegarde réussie !', result.id);
    } else {
      console.log('❌ Sauvegarde échouée - résultat null');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testAuditSave().then(() => {
  console.log('🔚 Test terminé');
  process.exit(0);
}); 