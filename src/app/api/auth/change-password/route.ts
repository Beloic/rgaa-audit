import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/supabase-auth';
import { generatePasswordResetToken, isValidEmail } from '@/lib/auth';

// Import MailJet pour envoi d'email
const mailjet = require('node-mailjet');

// Initialiser MailJet si les clés sont configurées
const mailjetClient = process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY 
  ? mailjet.apiConnect(
      process.env.MAILJET_API_KEY,
      process.env.MAILJET_SECRET_KEY
    )
  : null;

export async function POST(request: NextRequest) {
  console.log('🔄 Demande de réinitialisation de mot de passe reçue');
  
  try {
    const { email } = await request.json();
    console.log('📧 Email reçu:', email);

    // Validation
    if (!email) {
      console.log('❌ Email manquant');
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      console.log('❌ Format email invalide:', email);
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    console.log('🔍 Recherche de l\'utilisateur...');
    
    // Récupérer l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      console.log('⚠️ Utilisateur non trouvé pour:', email);
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return NextResponse.json({
        success: true,
        message: 'Si votre adresse email existe dans notre base, vous recevrez un lien de réinitialisation.'
      });
    }

    console.log('👤 Utilisateur trouvé:', user.email);

    // Générer le token de réinitialisation
    const resetToken = generatePasswordResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Le token expire dans 1 heure

    console.log('🔑 Token généré:', resetToken.substring(0, 8) + '...');

    // Mettre à jour l'utilisateur avec le token
    user.passwordResetToken = resetToken;
    user.passwordResetExpiresAt = expiresAt.toISOString();
    user.passwordResetSentAt = new Date().toISOString();

    console.log('💾 Sauvegarde du token en base...');
    await saveUser(user);
    console.log('✅ Token sauvegardé avec succès');

    // Construire l'URL de réinitialisation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/confirm-password-change?token=${resetToken}`;

    // Template HTML harmonisé avec la confirmation d'inscription
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de votre mot de passe - RGAA Audit</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <!-- Header avec logo -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
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
                      Réinitialisation de votre mot de passe
                    </h2>
                    <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                      Bonjour ${user.name},
                    </p>
                    <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                      Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte RGAA Audit.
                    </p>
                    <p style="margin: 0 0 32px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                      Pour créer un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :
                    </p>
                    <!-- CTA Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 32px 0;">
                          <a href="${resetUrl}"
                             style="display: inline-block; padding: 18px 36px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); transition: all 0.2s ease; letter-spacing: 0.3px;">
                            🔑 Réinitialiser mon mot de passe
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 12px 0 0 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 13px; font-style: italic;">
                            Ce lien expirera dans 1 heure
                          </p>
                        </td>
                      </tr>
                    </table>
                    <!-- Informations importantes -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 40px 0;">
                      <tr>
                        <td style="padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border-radius: 12px; border: 1px solid #bfdbfe;">
                          <p style="margin: 0 0 16px 0; color: #1e40af; font-size: 15px; font-weight: 700;">
                            ⚠️ Informations importantes
                          </p>
                          <div style="color: #1e40af; font-size: 14px; line-height: 1.6;">
                            <p style="margin: 0 0 8px 0;">
                              <strong>⏰ Expiration :</strong> Ce lien est valide pendant <strong>1 heure</strong>
                            </p>
                            <p style="margin: 0 0 8px 0;">
                              <strong>🔒 Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
                            </p>
                            <p style="margin: 0;">
                              <strong>✨ Usage unique :</strong> Ce lien ne peut être utilisé qu'une seule fois
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <!-- Lien alternatif -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                      <tr>
                        <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #e5e7eb;">
                          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; font-weight: 600;">
                            🔗 Lien de sauvegarde
                          </p>
                          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; line-height: 1.4;">
                            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                          </p>
                          <p style="margin: 0; background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; word-break: break-all; font-size: 12px; color: #4b5563;">
                            ${resetUrl}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer moderne -->
                <tr>
                  <td style="padding: 36px 40px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
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
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                      <tr>
                        <td align="center">
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/privacy" 
                             style="color: #2563eb; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 500;">
                            Politique de confidentialité
                          </a>
                          <span style="color: #d1d5db; font-size: 11px;">•</span>
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/terms" 
                             style="color: #2563eb; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 500;">
                            Conditions d'utilisation
                          </a>
                          <span style="color: #d1d5db; font-size: 11px;">•</span>
                          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/contact" 
                             style="color: #2563eb; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 500;">
                            Contact
                          </a>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px;">
                            © ${new Date().getFullYear()} 
                          </p>
                          <p style="margin: 0; color: #9ca3af; font-size: 10px; line-height: 1.4; font-style: italic;">
                            Email envoyé automatiquement suite à votre demande de réinitialisation.<br>
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

    // Envoyer l'email (ou simuler)
    if (mailjetClient) {
      try {
        console.log('📤 Tentative d\'envoi via MailJet...');
        
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
                    Name: user.name
                  }
                ],
                Subject: 'Réinitialisation de votre mot de passe - RGAA Audit',
                HtmlPart: emailHTML,
                Headers: {
                  'X-Entity-Ref-ID': 'rgaa-audit-password-reset'
                }
              }
            ]
          });

        console.log('✅ Email envoyé via MailJet:', {
          messageId: result.body.Messages[0].To[0].MessageID,
          email: email
        });

        return NextResponse.json({
          success: true,
          message: 'Si votre adresse email existe dans notre base, vous recevrez un lien de réinitialisation.',
          provider: 'mailjet'
        });

      } catch (mailjetError) {
        console.error('❌ Erreur MailJet:', mailjetError);
        console.log('⚠️ Utilisation du mode simulation suite à l\'erreur MailJet');
      }
    }

    // Mode simulation (développement ou fallback)
    console.log(`
    ===== EMAIL DE RÉINITIALISATION (SIMULATION) =====
    À: ${email}
    Sujet: Réinitialisation de votre mot de passe - RGAA Audit
    
    Bonjour ${user.name},
    
    Nous avons reçu une demande de réinitialisation de votre mot de passe.
    
    Pour créer un nouveau mot de passe, cliquez sur le lien suivant :
    ${resetUrl}
    
    Ce lien expirera dans 1 heure.
    
    Cordialement,
    L'équipe RGAA Audit
    ================================================
    `);

    return NextResponse.json({
      success: true,
      message: 'Si votre adresse email existe dans notre base, vous recevrez un lien de réinitialisation.',
      provider: 'simulation',
      resetUrl: resetUrl // Pour le debug en développement
    });

  } catch (error) {
    console.error('❌ Erreur lors de la demande de réinitialisation:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace disponible');
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la demande de réinitialisation' },
      { status: 500 }
    );
  }
} 