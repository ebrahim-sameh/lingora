import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, usageEvents, users, sessions } from '@lingora/db';
import { TRIAL_SECONDS_LIMIT } from '@lingora/shared/pricing';
import { stripe, STRIPE_METER_EVENT_NAME } from '@/lib/stripe';

export const runtime = 'nodejs';

const bodySchema = z.object({
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  languageCode: z.string().min(1),
  seconds: z.number().int().positive().max(3600),
});

export async function POST(req: Request) {
  const secret = req.headers.get('x-lingora-worker-secret');
  if (!process.env.WORKER_USAGE_SECRET || secret !== process.env.WORKER_USAGE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, body.userId)).limit(1);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Trial quota enforcement
  if (user.planTier === 'free') {
    const remaining = TRIAL_SECONDS_LIMIT - user.trialSecondsUsed;
    if (remaining <= 0) {
      return NextResponse.json(
        { error: 'Trial limit exceeded', quotaExceeded: true },
        { status: 402 },
      );
    }
    const cappedSeconds = Math.min(body.seconds, remaining);
    await db
      .update(users)
      .set({ trialSecondsUsed: user.trialSecondsUsed + cappedSeconds })
      .where(eq(users.id, user.id));
    await db.insert(usageEvents).values({
      userId: user.id,
      sessionId: body.sessionId,
      languageCode: body.languageCode,
      seconds: cappedSeconds,
    });
    await db
      .update(sessions)
      .set({ totalSecondsSpoken: sessions.totalSecondsSpoken })
      .where(and(eq(sessions.id, body.sessionId), eq(sessions.userId, user.id)));
    return NextResponse.json({ ok: true, cappedSeconds });
  }

  // Paid plans — persist and report to Stripe meter
  const [event] = await db
    .insert(usageEvents)
    .values({
      userId: user.id,
      sessionId: body.sessionId,
      languageCode: body.languageCode,
      seconds: body.seconds,
    })
    .returning();

  if (stripe && user.stripeCustomerId) {
    try {
      const minutes = body.seconds / 60;
      await stripe.billing.meterEvents.create({
        event_name: STRIPE_METER_EVENT_NAME,
        payload: {
          stripe_customer_id: user.stripeCustomerId,
          value: minutes.toFixed(4),
          session_id: body.sessionId,
          language: body.languageCode,
        },
      });
      if (event) {
        await db
          .update(usageEvents)
          .set({ reportedToStripe: true })
          .where(eq(usageEvents.id, event.id));
      }
    } catch (err) {
      console.error('[usage] stripe meter event failed:', err);
    }
  }

  return NextResponse.json({ ok: true });
}
