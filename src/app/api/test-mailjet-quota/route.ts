import { NextRequest, NextResponse } from 'next/server';

// Import MailJet pour test
const mailjet = require('node-mailjet');

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test quota MailJet...');
    
    // Vérifier les variables d'environnement
    const apiKey = process.env.MAILJET_API_KEY;
    const secretKey = process.env.MAILJET_SECRET_KEY;
    const fromEmail = process.env.MAILJET_FROM_EMAIL;
    
    if (!apiKey || !secretKey || !fromEmail) {
      return NextResponse.json({
        success: false,
        message: 'Variables MailJet manquantes',
        config: {
          apiKey: apiKey ? '✅ Définie' : '❌ Manquante',
          secretKey: secretKey ? '✅ Définie' : '❌ Manquante',
          fromEmail: fromEmail || '❌ Manquante'
        }
      });
    }
    
    // Initialiser MailJet
    const mailjetClient = mailjet.apiConnect(apiKey, secretKey);
    
    // Test 1: Vérifier les statistiques du compte
    try {
      const statsResult = await mailjetClient
        .get('statcounters')
        .request();
      
      console.log('📊 Statistiques MailJet:', statsResult.body);
    } catch (statsError) {
      console.log('⚠️ Erreur stats:', statsError.message);
    }
    
    // Test 2: Envoyer un email de test simple
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
            Subject: 'Test MailJet Quota - RGAA Audit',
            TextPart: 'Test simple pour vérifier le quota MailJet.',
            HTMLPart: '<p>Test simple pour vérifier le quota MailJet.</p>'
          }
        ]
      });
    
    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      result: result.body,
      config: {
        apiKey: '✅ Définie',
        secretKey: '✅ Définie',
        fromEmail: fromEmail
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erreur MailJet:', error);
    
    // Analyser le type d'erreur
    let errorType = 'Unknown';
    if (error.message.includes('401')) {
      errorType = 'Authentication failed';
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      errorType = 'Quota exceeded';
    } else if (error.message.includes('domain')) {
      errorType = 'Domain verification issue';
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de l\'envoi d\'email',
      error: error.message,
      errorType: errorType,
      config: {
        apiKey: process.env.MAILJET_API_KEY ? '✅ Définie' : '❌ Manquante',
        secretKey: process.env.MAILJET_SECRET_KEY ? '✅ Définie' : '❌ Manquante',
        fromEmail: process.env.MAILJET_FROM_EMAIL || '❌ Manquante'
      }
    });
  }
}
