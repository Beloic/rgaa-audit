import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserByEmail, saveUser } from '@/lib/supabase-auth';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook Stripe appelé !');
  console.log('🌐 Headers reçus :', Object.fromEntries(req.headers.entries()));
  
  const sig = req.headers.get('stripe-signature') as string;
  
  if (!sig) {
    console.error('❌ Header stripe-signature manquant');
    return new NextResponse('Webhook Error: No stripe-signature header value was provided.', { status: 400 });
  }
  
  console.log('📝 Signature header présent :', sig.substring(0, 20) + '...');
  
  const body = await req.text();
  console.log('📄 Body reçu (longueur) :', body.length);
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('❌ Variable STRIPE_WEBHOOK_SECRET manquante');
    return new NextResponse('Webhook Error: STRIPE_WEBHOOK_SECRET not configured.', { status: 500 });
  }
  
  console.log('🔑 Secret webhook configuré :', process.env.STRIPE_WEBHOOK_SECRET.substring(0, 10) + '...');

  let event: Stripe.Event;

  try {
    // TEMPORAIRE : Bypass de la validation pour debug
    console.log('⚠️ ATTENTION : Validation de signature désactivée temporairement');
    event = JSON.parse(body);
    console.log('✅ Événement parsé sans validation');
    console.log('📦 Événement reçu :', event.type);
  } catch (err: any) {
    console.error('❌ Erreur parsing JSON :', err.message);
    console.error('🔍 Body reçu :', body.substring(0, 200) + '...');
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Gère les deux événements de paiement réussi
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    console.log('💰 Paiement réussi détecté !');
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    console.log('📧 Email client :', customerEmail);
    console.log('🔍 Session complète :', JSON.stringify(session, null, 2));

    if (customerEmail) {
      try {
        // Récupérer l'utilisateur
        console.log('🔎 Recherche utilisateur pour l\'email :', customerEmail);
        const user = await getUserByEmail(customerEmail);
        
        if (user) {
          console.log('👤 Utilisateur trouvé :', user.email);
          console.log('📊 Plan actuel :', user.subscription?.plan || 'non défini');
          console.log('📊 Status actuel :', user.subscription?.status || 'non défini');
          
          // Mettre à jour le plan d'abonnement
          const oldPlan = user.subscription?.plan;
          const oldStatus = user.subscription?.status;
          
          user.subscription.plan = 'pro';
          user.subscription.status = 'active';
          user.subscription.startDate = new Date().toISOString();
          // Tu peux aussi stocker l'ID Stripe si besoin :
          // user.subscription.customerId = session.customer as string;

          console.log('💾 Sauvegarde en cours...');
          await saveUser(user);
          console.log('🎉 Plan Pro activé avec succès !');
          console.log(`   📈 ${oldPlan} → pro`);
          console.log(`   📈 ${oldStatus} → active`);
          console.log(`   📅 Date : ${user.subscription.startDate}`);
        } else {
          console.warn('⚠️ Utilisateur non trouvé pour l\'email :', customerEmail);
          console.warn('💡 Suggestions :');
          console.warn('   - Vérifier que l\'utilisateur existe dans Supabase');
          console.warn('   - Vérifier la correspondance exacte des emails (casse, espaces)');
        }
      } catch (error) {
        console.error('💥 Erreur lors de la mise à jour utilisateur :', error);
        console.error('🔍 Stack trace :', error instanceof Error ? error.stack : error);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
    } else {
      console.warn('⚠️ Pas d\'email dans la session Stripe');
      console.warn('🔍 Session détails :', {
        id: session.id,
        customer: session.customer,
        payment_status: session.payment_status,
        customer_details: session.customer_details
      });
    }
  } else {
    console.log('ℹ️ Événement ignoré :', event.type);
  }

  return new NextResponse('Webhook reçu', { status: 200 });
} 