console.log('🔍 Diagnostic de l\'historique des audits...\n');

// Fonction pour afficher toutes les clés liées à l'historique
function checkHistoryKeys() {
  console.log('📂 Clés localStorage liées à l\'historique:');
  
  const historyKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('rgaa-audit-history')) {
      historyKeys.push(key);
    }
  }
  
  if (historyKeys.length === 0) {
    console.log('❌ Aucune clé d\'historique trouvée');
  } else {
    historyKeys.forEach(key => {
      console.log(`✅ ${key}`);
    });
  }
  
  return historyKeys;
}

// Fonction pour afficher le contenu de l'historique
function checkHistoryContent(keys) {
  console.log('\n📄 Contenu des historiques:');
  
  keys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`\n🔑 ${key}:`);
        console.log(`   - Nombre d'audits: ${parsed.length}`);
        
        if (parsed.length > 0) {
          console.log('   - Premier audit:');
          const first = parsed[0];
          console.log(`     • URL: ${first.url}`);
          console.log(`     • Engine: ${first.engine}`);
          console.log(`     • Score: ${first.score}`);
          console.log(`     • Date: ${first.timestamp}`);
          console.log(`     • Violations: ${first.totalViolations}`);
        }
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la lecture de ${key}:`, error.message);
    }
  });
}

// Fonction pour nettoyer l'historique corrompu
function cleanCorruptedHistory() {
  console.log('\n🧹 Nettoyage des historiques corrompus...');
  
  const historyKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('rgaa-audit-history')) {
      historyKeys.push(key);
    }
  }
  
  historyKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        
        // Vérifier si la structure est correcte
        if (!Array.isArray(parsed)) {
          console.log(`🗑️ Suppression de ${key} (pas un tableau)`);
          localStorage.removeItem(key);
          return;
        }
        
        // Filtrer les objets invalides
        const cleaned = parsed.filter(audit => {
          return audit && 
                 typeof audit.id === 'string' &&
                 typeof audit.url === 'string' &&
                 typeof audit.timestamp === 'string' &&
                 typeof audit.score === 'number' &&
                 typeof audit.totalViolations === 'number' &&
                 audit.result &&
                 typeof audit.engine === 'string';
        });
        
        if (cleaned.length !== parsed.length) {
          console.log(`🔧 Réparation de ${key}: ${parsed.length} → ${cleaned.length} audits`);
          localStorage.setItem(key, JSON.stringify(cleaned));
        }
      }
    } catch (error) {
      console.error(`🗑️ Suppression de ${key} (corrompu):`, error.message);
      localStorage.removeItem(key);
    }
  });
}

// Exécution du diagnostic
const keys = checkHistoryKeys();
checkHistoryContent(keys);

// Proposer le nettoyage si nécessaire
if (keys.length > 0) {
  console.log('\n🔧 Pour nettoyer les historiques corrompus, exécutez:');
  console.log('cleanCorruptedHistory()');
  
  // Ajouter la fonction au scope global pour utilisation
  window.cleanCorruptedHistory = cleanCorruptedHistory;
}

console.log('\n✅ Diagnostic terminé'); 