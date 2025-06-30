import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserByEmail, saveUser } from '@/lib/supabase-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Gère les deux événements de paiement réussi
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      // Récupérer l'utilisateur
      const user = await getUserByEmail(customerEmail);
      if (user) {
        // Mettre à jour le plan d'abonnement
        user.subscription.plan = 'pro';
        user.subscription.status = 'active';
        user.subscription.startDate = new Date().toISOString();
        // Tu peux aussi stocker l'ID Stripe si besoin :
        // user.subscription.customerId = session.customer as string;

        await saveUser(user);
        console.log(`Plan Pro activé pour : ${customerEmail}`);
      } else {
        console.warn(`Utilisateur non trouvé pour l'email : ${customerEmail}`);
      }
    }
  }

  return new NextResponse('Webhook reçu', { status: 200 });
} 