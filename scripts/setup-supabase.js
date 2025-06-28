#!/usr/bin/env node

/**
 * Script d'assistance pour configurer Supabase
 * Usage: node scripts/setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Configuration automatique de Supabase pour RGAA Audit\n');

console.log('📋 Votre projet Supabase : ntzppsdyidqonusibocc');
console.log('🌐 Dashboard : https://supabase.com/dashboard/project/ntzppsdyidqonusibocc\n');

console.log('Pour récupérer votre mot de passe :');
console.log('1. Allez sur le dashboard Supabase');
console.log('2. Settings → Database');
console.log('3. Notez le mot de passe de votre base de données\n');

function askPassword() {
  return new Promise((resolve) => {
    rl.question('🔑 Entrez le mot de passe de votre base Supabase : ', (password) => {
      if (!password.trim()) {
        console.log('❌ Mot de passe requis');
        resolve(askPassword());
      } else {
        resolve(password.trim());
      }
    });
  });
}

function updateEnvFile(password) {
  const envPath = path.join(process.cwd(), '.env.local');
  
  const envContent = `# Configuration de la base de données Supabase
DATABASE_URL="postgresql://postgres:${password}@db.ntzppsdyidqonusibocc.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:${password}@db.ntzppsdyidqonusibocc.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Configuration de l'authentification (OBLIGATOIRE pour la production)
NEXT_PUBLIC_USE_API=true

# Configuration Mailjet (optionnel)
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env.local mis à jour');
}

async function testConnection() {
  console.log('\n🧪 Test de la connexion...');
  
  try {
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
      exec('npx prisma db push', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Erreur de connexion :');
          console.log(stderr || error.message);
          reject(error);
        } else {
          console.log('✅ Connexion réussie et tables créées !');
          console.log(stdout);
          resolve();
        }
      });
    });
    
  } catch (error) {
    console.log('❌ Erreur lors du test :', error.message);
    throw error;
  }
}

async function main() {
  try {
    // Demander le mot de passe
    const password = await askPassword();
    
    // Mettre à jour le fichier .env.local
    updateEnvFile(password);
    
    // Tester la connexion
    await testConnection();
    
    console.log('\n🎉 Configuration Supabase terminée avec succès !');
    console.log('\n📊 Prochaines étapes :');
    console.log('1. npm run dev - pour démarrer en développement');
    console.log('2. node scripts/test-production-db.js - pour tester');
    console.log('3. Déployez sur Vercel avec les mêmes variables d\'environnement');
    
  } catch (error) {
    console.log('\n❌ Erreur lors de la configuration :', error.message);
    console.log('\n🔧 Solutions :');
    console.log('- Vérifiez le mot de passe');
    console.log('- Vérifiez votre connexion internet');
    console.log('- Consultez le dashboard Supabase pour l\'état du projet');
  } finally {
    rl.close();
  }
}

main().catch(console.error); 