const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://ntzppsdyidqonusibocc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50enBwc2R5aWRxb251c2lib2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc3NjEsImV4cCI6MjA2NjY4Mzc2MX0.XybM_Rjat5A3EZGHHP_oUNtePrB_krvysqCtuOJtcws';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailSending() {
  console.log('📧 Test d\'envoi d\'email de vérification...\n');

  try {
    // 1. Récupérer le dernier utilisateur créé
    console.log('1️⃣ Récupération du dernier utilisateur...');
    const { data: latestUser, error: userError } = await supabase
      .from('users')
      .select('email, name, email_verification_token')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (userError || !latestUser) {
      console.log('❌ Erreur lors de la récupération de l\'utilisateur:', userError?.message);
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log(`   - Email: ${latestUser.email}`);
    console.log(`   - Nom: ${latestUser.name}`);
    console.log(`   - Token: ${latestUser.email_verification_token ? '✅ Présent' : '❌ Manquant'}`);

    if (!latestUser.email_verification_token) {
      console.log('\n💡 Aucun token de vérification trouvé. Génération d\'un nouveau token...');
      
      // Générer un nouveau token
      const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          email_verification_token: newToken,
          email_verification_sent_at: new Date().toISOString()
        })
        .eq('email', latestUser.email);

      if (updateError) {
        console.log('❌ Erreur lors de la mise à jour du token:', updateError.message);
        return;
      }

      console.log('✅ Nouveau token généré et sauvegardé');
      latestUser.email_verification_token = newToken;
    }

    // 2. Tester l'envoi d'email
    console.log('\n2️⃣ Test d\'envoi d\'email...');
    
    const testEmailData = {
      email: latestUser.email,
      token: latestUser.email_verification_token
    };

    console.log('📤 Envoi de la requête à /api/auth/send-verification...');
    
    // Simuler l'envoi d'email (puisque nous sommes dans un script Node.js)
    const verificationUrl = `https://rgaa-audit.vercel.app/auth/verify-email?token=${latestUser.email_verification_token}`;
    
    console.log('\n📧 === EMAIL DE VÉRIFICATION ===');
    console.log(`À: ${latestUser.email}`);
    console.log(`Sujet: Confirmez votre adresse email - RGAA Audit`);
    console.log('');
    console.log(`Bonjour ${latestUser.name},`);
    console.log('');
    console.log('Merci de vous être inscrit sur RGAA Audit !');
    console.log('');
    console.log('Pour activer votre compte, veuillez cliquer sur le lien suivant :');
    console.log(verificationUrl);
    console.log('');
    console.log('Ce lien expirera dans 24 heures.');
    console.log('');
    console.log('Si vous n\'avez pas créé ce compte, ignorez cet email.');
    console.log('');
    console.log('Cordialement,');
    console.log('L\'équipe RGAA Audit');
    console.log('===============================');

    // 3. Vérifier la configuration MailJet
    console.log('\n3️⃣ Vérification de la configuration MailJet...');
    
    const mailjetApiKey = process.env.MAILJET_API_KEY;
    const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
    
    if (mailjetApiKey && mailjetApiKey !== 'your_mailjet_api_key' && 
        mailjetSecretKey && mailjetSecretKey !== 'your_mailjet_secret_key') {
      console.log('✅ Clés MailJet configurées');
      console.log('💡 En production, l\'email sera envoyé via MailJet');
    } else {
      console.log('⚠️ Clés MailJet non configurées ou invalides');
      console.log('💡 En développement, l\'email est affiché en mode simulation');
      console.log('');
      console.log('📋 Pour configurer MailJet en production :');
      console.log('   1. Créez un compte sur https://www.mailjet.com/');
      console.log('   2. Récupérez vos clés API');
      console.log('   3. Configurez les variables d\'environnement :');
      console.log('      MAILJET_API_KEY=votre_clé_api');
      console.log('      MAILJET_SECRET_KEY=votre_clé_secrète');
      console.log('      MAILJET_FROM_EMAIL=votre_email@domaine.com');
    }

    console.log('\n✅ Test terminé !');
    console.log(`🔗 Lien de vérification: ${verificationUrl}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testEmailSending(); 