import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserByEmail, saveUser } from '@/lib/supabase-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook Stripe appelé !');
  
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('✅ Signature Stripe validée');
    console.log('📦 Événement reçu :', event.type);
  } catch (err: any) {
    console.error('❌ Erreur signature webhook :', err.message);
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
        console.log('🔎 Recherche utilisateur...');
        const user = await getUserByEmail(customerEmail);
        
        if (user) {
          console.log('👤 Utilisateur trouvé :', user.email);
          // Mettre à jour le plan d'abonnement
          user.subscription.plan = 'pro';
          user.subscription.status = 'active';
          user.subscription.startDate = new Date().toISOString();
          // Tu peux aussi stocker l'ID Stripe si besoin :
          // user.subscription.customerId = session.customer as string;

          await saveUser(user);
          console.log('🎉 Plan Pro activé pour :', customerEmail);
        } else {
          console.warn('⚠️ Utilisateur non trouvé pour l\'email :', customerEmail);
        }
      } catch (error) {
        console.error('💥 Erreur lors de la mise à jour :', error);
      }
    } else {
      console.warn('⚠️ Pas d\'email dans la session Stripe');
    }
  } else {
    console.log('ℹ️ Événement ignoré :', event.type);
  }

  return new NextResponse('Webhook reçu', { status: 200 });
} 