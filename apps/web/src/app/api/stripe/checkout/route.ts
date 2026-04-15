import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, users } from '@lingora/db';
import { PRICING_PLANS, type PricingPlan } from '@lingora/shared/pricing';
import { getOrCreateDbUser } from '@/lib/auth';
import { assertStripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

const bodySchema = z.object({
  tier: z.enum(['starter', 'growth', 'pro']),
});

export async function POST(req: Request) {
  const stripe = assertStripe();

  let tier: 'starter' | 'growth' | 'pro';
  try {
    const parsed = bodySchema.parse(await req.json());
    tier = parsed.tier;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const plan = PRICING_PLANS.find((p) => p.tier === tier) as PricingPlan | undefined;
  if (!plan || !plan.stripePriceEnv) {
    return NextResponse.json({ error: 'Unknown plan tier' }, { status: 400 });
  }

  const priceId = process.env[plan.stripePriceEnv];
  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe price not configured for ${tier}. Run pnpm stripe:setup.` },
      { status: 500 },
    );
  }

  const dbUser = await getOrCreateDbUser();

  let customerId = dbUser.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      name: dbUser.name ?? undefined,
      metadata: { lingoraUserId: dbUser.id, clerkId: dbUser.clerkId },
    });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, dbUser.id));
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId }],
    allow_promotion_codes: true,
    success_url: absoluteUrl('/dashboard/billing?checkout=success'),
    cancel_url: absoluteUrl('/pricing?checkout=canceled'),
    metadata: {
      lingoraUserId: dbUser.id,
      tier,
    },
    subscription_data: {
      metadata: {
        lingoraUserId: dbUser.id,
        tier,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
