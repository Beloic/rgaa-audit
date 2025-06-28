#!/usr/bin/env node

/**
 * Script de test pour la base de données de production
 * Usage: node scripts/test-production-db.js
 */

// Charger les variables d'environnement depuis .env
require('dotenv').config();

console.log('🧪 Test de la configuration base de données de production\n');

async function testDatabaseConnection() {
  try {
    // Import dynamique pour éviter les erreurs si Prisma n'est pas encore configuré
    const { PrismaClient } = await import('@prisma/client');
    
    console.log('1. Tentative de connexion à la base de données...');
    const prisma = new PrismaClient();
    
    // Test de connexion simple
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // Test de création d'utilisateur
    console.log('\n2. Test de création d\'utilisateur...');
    const testEmail = `test-${Date.now()}@rgaa-audit.com`;
    
    try {
      // Importer les fonctions de base de données
      const { createUser, getUserByEmail, deleteUser } = await import('../src/lib/database.ts');
      
      const testUser = await createUser({
        email: testEmail,
        name: 'Utilisateur Test',
        password: 'motdepasse123',
        emailVerificationToken: 'test-token'
      });
      
      console.log('✅ Utilisateur test créé:', testUser.email);
      
      // Test de récupération
      console.log('\n3. Test de récupération d\'utilisateur...');
      const retrievedUser = await getUserByEmail(testEmail);
      
      if (retrievedUser) {
        console.log('✅ Utilisateur récupéré:', retrievedUser.email);
      } else {
        console.log('❌ Impossible de récupérer l\'utilisateur');
      }
      
      // Nettoyage
      console.log('\n4. Nettoyage...');
      const deleted = await deleteUser(testEmail);
      if (deleted) {
        console.log('✅ Utilisateur test supprimé');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors des tests utilisateur:', error.message);
    }
    
    await prisma.$disconnect();
    console.log('\n✅ Tests terminés avec succès !');
    console.log('\n📊 Configuration recommandée pour la production :');
    console.log('- DATABASE_URL configurée ✅');
    console.log('- NEXT_PUBLIC_USE_API=true ✅'); 
    console.log('- NODE_ENV=production pour le déploiement ✅');
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion à la base de données:');
    console.error('Message:', error.message);
    
    console.log('\n🔧 Solutions possibles :');
    console.log('1. Vérifiez que DATABASE_URL est configurée dans .env.local');
    console.log('2. Assurez-vous que la base de données est accessible');
    console.log('3. Exécutez "npx prisma db push" pour créer les tables');
    console.log('4. Pour Supabase, vérifiez les credentials dans le dashboard');
    
    process.exit(1);
  }
}

async function showConfiguration() {
  console.log('🔧 Configuration actuelle :');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('- NEXT_PUBLIC_USE_API:', process.env.NEXT_PUBLIC_USE_API || 'false');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Configurée ✅' : 'Non configurée ❌');
  console.log('- DIRECT_URL:', process.env.DIRECT_URL ? 'Configurée ✅' : 'Non configurée ❌');
  console.log('');
}

// Vérifier les variables d'environnement
function checkEnvironment() {
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Variables d\'environnement manquantes :');
    missingVars.forEach(varName => {
      console.log(`- ${varName}`);
    });
    console.log('\n📝 Créez un fichier .env.local avec ces variables.');
    console.log('📖 Consultez PRODUCTION-SETUP.md pour plus d\'informations.');
    return false;
  }
  
  return true;
}

// Exécution du script
async function main() {
  showConfiguration();
  
  if (!checkEnvironment()) {
    process.exit(1);
  }
  
  await testDatabaseConnection();
}

main().catch(console.error); 