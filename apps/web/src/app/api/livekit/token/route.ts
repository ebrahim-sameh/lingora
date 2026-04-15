import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { AccessToken } from 'livekit-server-sdk';
import { db, sessions } from '@lingora/db';
import { getOrCreateDbUser } from '@/lib/auth';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const bodySchema = z.object({
  roomCode: z.string().min(1),
  role: z.enum(['speaker', 'listener']),
  identity: z.string().min(1).max(120),
  language: z.string().optional(),
});

export async function POST(req: Request) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_URL ?? process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: 'LiveKit is not configured. Set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL.' },
      { status: 500 },
    );
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Speaker role requires auth and ownership. Listener role is public.
  if (body.role === 'speaker') {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await getOrCreateDbUser();
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.roomCode, body.roomCode), eq(sessions.userId, user.id)))
      .limit(1);
    if (!session) {
      return NextResponse.json({ error: 'Session not found or not yours' }, { status: 404 });
    }
  }

  const roomName = `lingora-${body.roomCode}`;
  const at = new AccessToken(apiKey, apiSecret, {
    identity: body.identity,
    ttl: '2h',
    metadata: JSON.stringify({
      role: body.role,
      language: body.language ?? null,
    }),
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: body.role === 'speaker',
    canPublishData: body.role === 'speaker',
    canSubscribe: true,
  });

  const token = await at.toJwt();
  return NextResponse.json({ token, url: wsUrl, roomName });
}
