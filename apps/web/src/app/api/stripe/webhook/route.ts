import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';
import { db, users } from '@lingora/db';
import type { PlanTier } from '@lingora/shared';
import { assertStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

function tierFromPriceId(priceId: string | null | undefined): PlanTier {
  if (!priceId) return 'free';
  if (priceId === process.env.STRIPE_PRICE_STARTER) return 'starter';
  if (priceId === process.env.STRIPE_PRICE_GROWTH) return 'growth';
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  return 'free';
}

export async function POST(req: Request) {
  const stripe = assertStripe();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.lingoraUserId;
        if (userId && session.subscription && typeof session.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const priceId = subscription.items.data[0]?.price.id ?? null;
          const tier = tierFromPriceId(priceId);
          await db
            .update(users)
            .set({
              stripeSubscriptionId: subscription.id,
              stripeSubscriptionStatus: subscription.status,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              planTier: tier,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.lingoraUserId;
        if (userId) {
          const priceId = subscription.items.data[0]?.price.id ?? null;
          const tier: PlanTier =
            event.type === 'customer.subscription.deleted' ? 'free' : tierFromPriceId(priceId);
          await db
            .update(users)
            .set({
              stripeSubscriptionId: subscription.id,
              stripeSubscriptionStatus: subscription.status,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              planTier: tier,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (typeof invoice.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const userId = subscription.metadata?.lingoraUserId;
          if (userId) {
            await db
              .update(users)
              .set({
                stripeSubscriptionStatus: subscription.status,
                updatedAt: new Date(),
              })
              .where(eq(users.id, userId));
          }
        }
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook handler failed';
    console.error('[stripe:webhook]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
