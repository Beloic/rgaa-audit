#!/usr/bin/env node

// Script de test pour diagnostiquer les problèmes MailJet en production
const mailjet = require('node-mailjet');

async function testMailJet() {
  console.log('🔍 Test de configuration MailJet...\n');
  
  // Vérifier les variables d'environnement
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const fromEmail = process.env.MAILJET_FROM_EMAIL;
  
  console.log('📋 Variables d\'environnement :');
  console.log(`- MAILJET_API_KEY: ${apiKey ? '✅ Définie' : '❌ Manquante'}`);
  console.log(`- MAILJET_SECRET_KEY: ${secretKey ? '✅ Définie' : '❌ Manquante'}`);
  console.log(`- MAILJET_FROM_EMAIL: ${fromEmail ? '✅ Définie' : '❌ Manquante'}`);
  
  if (!apiKey || !secretKey || !fromEmail) {
    console.log('\n❌ Configuration MailJet incomplète !');
    return;
  }
  
  try {
    // Initialiser MailJet
    const mailjetClient = mailjet.apiConnect(apiKey, secretKey);
    
    console.log('\n📧 Test d\'envoi d\'email...');
    
    const result = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: 'RGAA Audit Test'
            },
            To: [
              {
                Email: 'hello@loicbernard.com',
                Name: 'Test RGAA Audit'
              }
            ],
            Subject: 'Test MailJet - RGAA Audit',
            TextPart: 'Ceci est un test d\'envoi d\'email depuis RGAA Audit.',
            HTMLPart: '<h3>Test MailJet</h3><p>Ceci est un test d\'envoi d\'email depuis RGAA Audit.</p>'
          }
        ]
      });
    
    console.log('✅ Email envoyé avec succès !');
    console.log('📊 Résultat :', JSON.stringify(result.body, null, 2));
    
  } catch (error) {
    console.log('❌ Erreur lors de l\'envoi :', error.message);
    console.log('🔍 Détails :', error);
  }
}

testMailJet();
