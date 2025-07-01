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
  try {
    const { email } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return NextResponse.json({
        success: true,
        message: 'Si votre adresse email existe dans notre base, vous recevrez un lien de réinitialisation.'
      });
    }

    // Générer le token de réinitialisation
    const resetToken = generatePasswordResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Le token expire dans 1 heure

    // Mettre à jour l'utilisateur avec le token
    user.passwordResetToken = resetToken;
    user.passwordResetExpiresAt = expiresAt.toISOString();
    user.passwordResetSentAt = new Date().toISOString();

    await saveUser(user);

    // Construire l'URL de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/confirm-password-change?token=${resetToken}`;

    // Template HTML pour l'email de réinitialisation
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
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
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
                
                <!-- Content -->
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
                      Pour créer un nouveau mot de passe, cliquez sur le bouton ci-dessous :
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 32px 0;">
                          <a href="${resetUrl}" 
                             style="display: inline-block; padding: 18px 36px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4); letter-spacing: 0.3px;">
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
                    
                    <!-- Important notice -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 40px 0;">
                      <tr>
                        <td style="padding: 24px; background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%); border-radius: 12px; border: 1px solid #fecaca;">
                          <p style="margin: 0 0 16px 0; color: #b91c1c; font-size: 15px; font-weight: 700;">
                            ⚠️ Informations importantes
                          </p>
                          <div style="color: #991b1b; font-size: 14px; line-height: 1.6;">
                            <p style="margin: 0 0 8px 0;">
                              <strong>🕐 Validité :</strong> Ce lien expire dans <strong>1 heure</strong>
                            </p>
                            <p style="margin: 0 0 8px 0;">
                              <strong>🛡️ Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
                            </p>
                            <p style="margin: 0;">
                              <strong>🔒 Accès :</strong> Ce lien ne peut être utilisé qu'une seule fois
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Alternative link -->
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
                    
                    <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Cordialement,<br>
                      L'équipe RGAA Audit
                    </p>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 32px 40px; background-color: #f8fafc; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 11px;">
                            © ${new Date().getFullYear()} RGAA Audit - Plateforme d'audit d'accessibilité web
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

    // Version texte
    const emailText = `
Bonjour ${user.name},

Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte RGAA Audit.

Pour créer un nouveau mot de passe, cliquez sur le lien suivant :
${resetUrl}

INFORMATIONS IMPORTANTES :
- Ce lien expire dans 1 heure
- Si vous n'avez pas demandé cette réinitialisation, ignorez cet email
- Ce lien ne peut être utilisé qu'une seule fois

Cordialement,
L'équipe RGAA Audit

---
RGAA Audit
Plateforme d'audit d'accessibilité web
France

Cet email a été envoyé automatiquement suite à votre demande de réinitialisation.
Si vous recevez cet email par erreur, veuillez l'ignorer.
    `.trim();

    // Envoyer l'email
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
                    Name: user.name
                  }
                ],
                Subject: 'Réinitialisation de votre mot de passe - RGAA Audit',
                HTMLPart: emailHTML,
                TextPart: emailText,
                Headers: {
                  'X-Entity-Ref-ID': 'rgaa-audit-password-reset'
                }
              }
            ]
          });

        console.log('✅ Email de réinitialisation envoyé via MailJet:', {
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
        // En cas d'erreur MailJet, on fallback vers la simulation
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
      provider: 'simulation'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la demande de réinitialisation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la demande de réinitialisation' },
      { status: 500 }
    );
  }
} 