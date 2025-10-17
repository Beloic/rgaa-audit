import { NextRequest, NextResponse } from 'next/server';

// Import MailJet pour test
const mailjet = require('node-mailjet');

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test de configuration MailJet...');
    
    // Vérifier les variables d'environnement
    const apiKey = process.env.MAILJET_API_KEY;
    const secretKey = process.env.MAILJET_SECRET_KEY;
    const fromEmail = process.env.MAILJET_FROM_EMAIL;
    
    const config = {
      apiKey: apiKey ? '✅ Définie' : '❌ Manquante',
      secretKey: secretKey ? '✅ Définie' : '❌ Manquante',
      fromEmail: fromEmail ? '✅ Définie' : '❌ Manquante'
    };
    
    if (!apiKey || !secretKey || !fromEmail) {
      return NextResponse.json({
        success: false,
        message: 'Configuration MailJet incomplète',
        config
      });
    }
    
    // Initialiser MailJet
    const mailjetClient = mailjet.apiConnect(apiKey, secretKey);
    
    // Test d'envoi d'email
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
    
    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      config,
      result: result.body
    });
    
  } catch (error: any) {
    console.error('❌ Erreur MailJet:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de l\'envoi d\'email',
      error: error.message,
      config: {
        apiKey: process.env.MAILJET_API_KEY ? '✅ Définie' : '❌ Manquante',
        secretKey: process.env.MAILJET_SECRET_KEY ? '✅ Définie' : '❌ Manquante',
        fromEmail: process.env.MAILJET_FROM_EMAIL ? '✅ Définie' : '❌ Manquante'
      }
    });
  }
}
