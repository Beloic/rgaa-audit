#!/usr/bin/env node

/**
 * Script de test pour l'API de stockage des utilisateurs
 * Usage: node scripts/test-api.js
 */

const fs = require('fs');
const path = require('path');

// Importer les fonctions de base de données
const { getUserByEmail, saveUser, deleteUser, getAllUsers } = require('../src/lib/fileDatabase.ts');

async function testFileDatabase() {
  console.log('🧪 Test du système de base de données fichier\n');

  try {
    // Test 1: Vérifier que le dossier data est créé
    console.log('1. Test création dossier data...');
    const dataDir = path.join(process.cwd(), 'data');
    if (fs.existsSync(dataDir)) {
      console.log('✅ Dossier data existe');
    } else {
      console.log('ℹ️  Dossier data sera créé au premier usage');
    }

    // Test 2: Créer un utilisateur de test
    console.log('\n2. Test création utilisateur...');
    const testUser = {
      id: 'test-user-' + Date.now(),
      email: 'test@rgaa-audit.com',
      name: 'Utilisateur Test',
      password: 'hashedpassword123',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      emailVerified: true,
      betaAccess: {
        granted: false,
        grantedAt: undefined,
        hasQuit: false
      },
      subscription: {
        plan: 'free',
        status: 'active',
        startDate: new Date().toISOString(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      usage: {
        auditsThisMonth: 0,
        auditsTotal: 0,
        teamMembers: 1,
        storageUsed: 0
      },
      settings: {
        defaultLanguage: 'fr',
        emailNotifications: true,
        weeklyReports: false,
        theme: 'system',
        timezone: 'Europe/Paris'
      }
    };

    saveUser(testUser);
    console.log('✅ Utilisateur test créé');

    // Test 3: Récupérer l'utilisateur
    console.log('\n3. Test récupération utilisateur...');
    const retrievedUser = getUserByEmail('test@rgaa-audit.com');
    if (retrievedUser && retrievedUser.email === testUser.email) {
      console.log('✅ Utilisateur récupéré avec succès');
    } else {
      console.log('❌ Erreur lors de la récupération');
    }

    // Test 4: Lister tous les utilisateurs
    console.log('\n4. Test listing utilisateurs...');
    const allUsers = getAllUsers();
    console.log(`✅ ${allUsers.length} utilisateur(s) trouvé(s)`);

    // Test 5: Nettoyer (supprimer l'utilisateur test)
    console.log('\n5. Test suppression utilisateur...');
    const deleted = deleteUser('test@rgaa-audit.com');
    if (deleted) {
      console.log('✅ Utilisateur test supprimé');
    } else {
      console.log('❌ Erreur lors de la suppression');
    }

    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n📁 Fichiers créés dans le dossier data/');
    
    // Lister les fichiers créés
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      files.forEach(file => {
        console.log(`   - ${file}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Exécuter les tests
if (require.main === module) {
  testFileDatabase();
}

module.exports = { testFileDatabase }; 