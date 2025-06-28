import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/supabase-auth';
import { generateVerificationToken, isValidEmail, isValidPassword } from '@/lib/auth';
import type { User } from '@/types/user';

// Import MailJet pour envoi direct
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
    const { email, password, name } = await request.json();

    // Validation des données
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom requis' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email' },
        { status: 409 }
      );
    }

    // Générer un token de vérification
    const verificationToken = generateVerificationToken();
    
    // Créer le nouvel utilisateur
    const newUser = await createUser({
      email,
      name,
      password,
      emailVerificationToken: verificationToken
    });

    // Envoyer automatiquement l'email de vérification directement
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rgaa-audit.vercel.app';
      const verificationUrl = `${appUrl}/auth/verify-email?token=${verificationToken}`;
      
      if (mailjetClient) {
        // Envoi via MailJet
        const emailHTML = `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation de votre compte RGAA Audit</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <tr>
                      <td style="padding: 40px 40px 30px 40px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
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
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 24px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                          Confirmez votre adresse email
                        </h2>
                        <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                          Bonjour ${name},
                        </p>
                        <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                          Merci de vous être inscrit sur RGAA Audit. Nous sommes ravis de vous accueillir dans notre communauté dédiée à l'amélioration de l'accessibilité web.
                        </p>
                        <p style="margin: 0 0 32px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                          Pour activer votre compte et commencer à utiliser nos outils d'audit, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
                        </p>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" style="padding: 32px 0;">
                              <a href="${verificationUrl}" style="display: inline-block; padding: 18px 36px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); transition: all 0.2s ease; letter-spacing: 0.3px;">
                                ✅ Confirmer mon adresse email
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 0; color: #6b7280; font-size: 13px; font-style: italic; text-align: center;">
                          Ce lien expirera dans 24 heures.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        const emailText = `
Bonjour ${name},

Merci de vous être inscrit sur RGAA Audit. Nous sommes ravis de vous accueillir dans notre communauté dédiée à l'amélioration de l'accessibilité web.

Pour activer votre compte et commencer à utiliser nos outils d'audit, veuillez confirmer votre adresse email en cliquant sur le lien suivant :

${verificationUrl}

Ce lien expirera dans 24 heures.

Si vous n'avez pas créé ce compte, ignorez cet email.

Cordialement,
L'équipe RGAA Audit
        `.trim();

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
                    Name: name
                  }
                ],
                Subject: 'Confirmez votre adresse email - RGAA Audit',
                HTMLPart: emailHTML,
                TextPart: emailText,
                Headers: {
                  'X-Entity-Ref-ID': 'rgaa-audit-registration'
                }
              }
            ]
          });

        console.log('✅ Email de vérification envoyé via MailJet à:', email);
        console.log('   - Message ID:', result.body.Messages[0].To[0].MessageID);
      } else {
        // Mode simulation
        console.log(`
        ===== EMAIL DE CONFIRMATION (SIMULATION) =====
        À: ${email}
        Sujet: Confirmez votre adresse email - RGAA Audit
        
        Bonjour ${name},
        
        Merci de vous être inscrit sur RGAA Audit !
        
        Pour activer votre compte, veuillez cliquer sur le lien suivant :
        ${verificationUrl}
        
        Ce lien expirera dans 24 heures.
        
        Si vous n'avez pas créé ce compte, ignorez cet email.
        
        Cordialement,
        L'équipe RGAA Audit
        ===============================================
        `);
      }
    } catch (emailError) {
      console.log('⚠️ Erreur lors de l\'envoi de l\'email de vérification:', emailError);
    }

    // Retourner l'utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Compte créé avec succès. Un email de vérification a été envoyé.'
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 