import { NextResponse } from 'next/server';
import { getOrCreateDbUser } from '@/lib/auth';
import { assertStripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

export async function POST() {
  const stripe = assertStripe();
  const dbUser = await getOrCreateDbUser();

  if (!dbUser.stripeCustomerId) {
    return NextResponse.json(
      { error: 'No Stripe customer on file. Upgrade to a paid plan first.' },
      { status: 400 },
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: absoluteUrl('/dashboard/billing'),
  });

  return NextResponse.json({ url: session.url });
}
