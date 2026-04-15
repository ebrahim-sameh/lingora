import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { eq } from 'drizzle-orm';
import { db, users } from '@lingora/db';

export const runtime = 'nodejs';

interface ClerkEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string; id: string }>;
    primary_email_address_id?: string;
    first_name?: string | null;
    last_name?: string | null;
  };
}

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Clerk webhook secret not configured' }, { status: 500 });
  }

  const headerList = await headers();
  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  const rawBody = await req.text();
  const webhook = new Webhook(webhookSecret);
  let event: ClerkEvent;
  try {
    event = webhook.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkEvent;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === 'user.created' || event.type === 'user.updated') {
      const primaryEmail =
        event.data.email_addresses?.find((e) => e.id === event.data.primary_email_address_id)
          ?.email_address ??
        event.data.email_addresses?.[0]?.email_address ??
        `${event.data.id}@unknown.local`;

      const name =
        [event.data.first_name, event.data.last_name].filter(Boolean).join(' ') || null;

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, event.data.id))
        .limit(1);

      if (existing[0]) {
        await db
          .update(users)
          .set({ email: primaryEmail, name, updatedAt: new Date() })
          .where(eq(users.id, existing[0].id));
      } else {
        await db.insert(users).values({
          clerkId: event.data.id,
          email: primaryEmail,
          name,
          planTier: 'free',
        });
      }
    } else if (event.type === 'user.deleted') {
      await db.delete(users).where(eq(users.clerkId, event.data.id));
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook handler failed';
    console.error('[clerk:webhook]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
