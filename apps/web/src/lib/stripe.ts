import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY;

export const stripe = apiKey
  ? new Stripe(apiKey, {
      apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
      typescript: true,
      appInfo: {
        name: 'Lingora',
        version: '0.1.0',
      },
    })
  : (null as unknown as Stripe);

export function assertStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment to use billing features.',
    );
  }
  return stripe;
}

export const STRIPE_METER_EVENT_NAME =
  process.env.STRIPE_METER_EVENT_NAME ?? 'speaking_minutes';
