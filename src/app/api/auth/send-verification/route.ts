import { NextRequest, NextResponse } from 'next/server';

const mailjet = require('node-mailjet');

// Initialiser MailJet si les clés sont configurées
const mailjetClient = process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY 
  ? mailjet.apiConnect(
      process.env.MAILJET_API_KEY,
      process.env.MAILJET_SECRET_KEY
    )
  : null;

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email et token requis' },
        { status: 400 }
      );
    }
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/auth/verify-email?token=${token}`;
    
    // Template HTML optimisé anti-spam
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de votre compte RGAA Audit</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
        
        <!-- Container principal -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              
              <!-- Email Content -->
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <!-- Header avec logo -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
                    <!-- Logo avec Shield SVG -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                                                     <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                             <!-- Shield SVG optimisé pour email -->
                             <svg width="32" height="32" viewBox="0 0 24 24" style="margin-right: 8px;">
                               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
                                     stroke="white" 
                                     stroke-width="2" 
                                     stroke-linecap="round" 
                                     stroke-linejoin="round" 
                                     fill="none"/>
                             </svg>
                             <span style="color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">RGAA Audit</span>
                           </div>
                          <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 12px 0 0 0; font-weight: 500;">
                            Plateforme d'audit d'accessibilité web
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    
                    <h2 style="margin: 0 0 24px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                      Confirmez votre adresse email
                    </h2>
                    
                    <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                      Bonjour,
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                      Merci de vous être inscrit sur RGAA Audit. Nous sommes ravis de vous accueillir dans notre communauté dédiée à l'amélioration de l'accessibilité web.
                    </p>
                    
                    <p style="margin: 0 0 32px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                      Pour activer votre compte et commencer à utiliser nos outils d'audit, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
                    </p>
                    
                    <!-- CTA Button amélioré -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 32px 0;">
                          <a href="${verificationUrl}" 
                             style="display: inline-block; padding: 18px 36px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); transition: all 0.2s ease; letter-spacing: 0.3px;">
                            ✅ Confirmer mon adresse email
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 12px 0 0 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 13px; font-style: italic;">
                            Cliquez sur le bouton pour activer votre compte
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Informations importantes avec design moderne -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 40px 0;">
                      <tr>
                        <td style="padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border-radius: 12px; border: 1px solid #bfdbfe;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td>
                                <p style="margin: 0 0 16px 0; color: #1e40af; font-size: 15px; font-weight: 700; display: flex; align-items: center;">
                                  <span style="font-size: 16px; margin-right: 8px;">📋</span> Informations importantes
                                </p>
                                <div style="color: #1e40af; font-size: 14px; line-height: 1.6;">
                                  <p style="margin: 0 0 8px 0;">
                                    <strong>⏰ Expiration :</strong> Ce lien est valide pendant <strong>24 heures</strong>
                                  </p>
                                  <p style="margin: 0 0 8px 0;">
                                    <strong>🔒 Sécurité :</strong> Si vous n'avez pas créé ce compte, ignorez cet email
                                  </p>
                                  <p style="margin: 0;">
                                    <strong>✨ Simplicité :</strong> Aucune action supplémentaire ne sera requise après confirmation
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Lien alternatif moderne -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                      <tr>
                        <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #e5e7eb;">
                          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; font-weight: 600;">
                            🔗 Lien de sauvegarde
                          </p>
                          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; line-height: 1.4;">
                            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                          </p>
                          <p style="margin: 0; background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                            <a href="${verificationUrl}" style="color: #2563eb; font-size: 12px; word-break: break-all; text-decoration: none; font-family: monospace;">
                              ${verificationUrl}
                            </a>
                          </p>
                        </td>
                      </tr>
                    </table>
                    

                    
                  </td>
                </tr>
                
                <!-- Footer moderne -->
                <tr>
                  <td style="padding: 36px 40px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                    
                    <!-- Signature équipe -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 6px 0; color: #64748b; font-size: 16px; line-height: 1.4;">
                            Cordialement,
                          </p>
                          <p style="margin: 0; color: #374151; font-size: 17px; font-weight: 700;">
                            L'équipe RGAA Audit
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Informations entreprise -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <tr>
                        <td align="center" style="border-top: 1px solid #d1d5db; padding-top: 24px;">
                          <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" style="margin-right: 6px;">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
                                    stroke="#64748b" 
                                    stroke-width="2" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    fill="none"/>
                            </svg>
                            <span style="color: #64748b; font-size: 13px; font-weight: 600;">RGAA Audit</span>
                          </div>
                          <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                            Plateforme d'audit d'accessibilité web<br>
                            Conformité RGAA • Outils automatisés • Expertise française
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Liens légaux stylés -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                      <tr>
                        <td align="center">
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/privacy" 
                             style="color: #2563eb; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 500;">
                            Politique de confidentialité
                          </a>
                          <span style="color: #d1d5db; font-size: 11px;">•</span>
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/terms" 
                             style="color: #2563eb; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 500;">
                            Conditions d'utilisation
                          </a>
                          <span style="color: #d1d5db; font-size: 11px;">•</span>
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/contact" 
                             style="color: #2563eb; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 500;">
                            Contact
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Copyright et notice anti-spam -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px;">
                            © ${new Date().getFullYear()} RGAA Audit - Tous droits réservés
                          </p>
                          <p style="margin: 0; color: #9ca3af; font-size: 10px; line-height: 1.4; font-style: italic;">
                            Email envoyé automatiquement suite à votre inscription.<br>
                            Si vous recevez ce message par erreur, ignorez-le simplement.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `;

    // Version texte optimisée anti-spam  
    const emailText = `
Bonjour,

Merci de vous être inscrit sur RGAA Audit. Nous sommes ravis de vous accueillir dans notre communauté dédiée à l'amélioration de l'accessibilité web.

Pour activer votre compte et commencer à utiliser nos outils d'audit, veuillez confirmer votre adresse email en cliquant sur le lien suivant :

${verificationUrl}

INFORMATIONS IMPORTANTES :
- Ce lien de confirmation expire dans 24 heures
- Si vous n'avez pas créé ce compte, ignorez cet email
- Aucune action supplémentaire ne sera requise

Cordialement,
L'équipe RGAA Audit

---
RGAA Audit
Plateforme d'audit d'accessibilité web
France

Cet email a été envoyé automatiquement suite à votre inscription sur RGAA Audit.
Si vous recevez cet email par erreur, veuillez l'ignorer.
    `.trim();

    // Essayer d'envoyer avec MailJet si configuré
    if (mailjetClient) {
      try {
        const result = await mailjetClient
          .post('send', { version: 'v3.1' })
          .request({
            Messages: [
              {
                From: {
                  Email: process.env.MAILJET_FROM_EMAIL || 'hello@loicbernard.com',
                  Name: 'RGAA Audit'
                },
                To: [
                  {
                    Email: email,
                    Name: ''
                  }
                ],
                Subject: 'Confirmez votre adresse email - RGAA Audit',
                HTMLPart: emailHTML,
                TextPart: emailText,
                // Headers anti-spam
                Headers: {
                  'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/unsubscribe>`,
                  'X-Entity-Ref-ID': 'rgaa-audit-verification'
                }
              }
            ]
          });

        console.log('✅ Email envoyé avec succès via MailJet:', {
          messageId: result.body.Messages[0].To[0].MessageID,
          email: email
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Email de confirmation envoyé avec succès',
          provider: 'mailjet'
        });

      } catch (mailjetError) {
        console.error('❌ Erreur MailJet:', mailjetError);
        
        // En cas d'erreur MailJet, on fallback vers la simulation
        console.log('⚠️ Utilisation du mode simulation suite à l\'erreur MailJet');
      }
    }

    // Mode simulation (développement ou fallback)
    console.log(`
    ===== EMAIL DE CONFIRMATION (SIMULATION) =====
    À: ${email}
    Sujet: Confirmez votre adresse email - RGAA Audit
    
    Bonjour,
    
    Merci de vous être inscrit sur RGAA Audit !
    
    Pour activer votre compte, veuillez cliquer sur le lien suivant :
    ${verificationUrl}
    
    Ce lien expirera dans 24 heures.
    
    Si vous n'avez pas créé ce compte, ignorez cet email.
    
    Cordialement,
    L'équipe RGAA Audit
    ===============================================
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Email de confirmation envoyé (mode simulation)',
      provider: 'simulation'
    });

  } catch (error) {
    console.error('❌ Erreur générale envoi email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
} 