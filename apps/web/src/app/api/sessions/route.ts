import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, sessions, sessionLanguages } from '@lingora/db';
import { LANGUAGES } from '@lingora/shared/languages';
import { getOrCreateDbUser } from '@/lib/auth';
import { generateRoomCode } from '@/lib/utils';

const createBody = z.object({
  name: z.string().min(1).max(120),
  speakerLanguage: z.string().min(1),
  speakerName: z.string().max(120).optional(),
  targetLanguages: z
    .array(z.string().min(1))
    .min(1, 'Pick at least one target language')
    .max(50),
});

export async function GET() {
  const user = await getOrCreateDbUser();
  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, user.id))
    .orderBy(desc(sessions.createdAt))
    .limit(50);
  return NextResponse.json({ sessions: rows });
}

export async function POST(req: Request) {
  const user = await getOrCreateDbUser();

  let body: z.infer<typeof createBody>;
  try {
    body = createBody.parse(await req.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const known = new Set(LANGUAGES.map((l) => l.code));
  const cleaned = Array.from(new Set(body.targetLanguages.filter((c) => known.has(c))));
  if (cleaned.length === 0) {
    return NextResponse.json({ error: 'No valid target languages provided' }, { status: 400 });
  }

  const roomCode = generateRoomCode();

  const [created] = await db
    .insert(sessions)
    .values({
      userId: user.id,
      name: body.name,
      speakerLanguage: body.speakerLanguage,
      speakerName: body.speakerName,
      roomCode,
    })
    .returning();

  if (!created) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }

  await db.insert(sessionLanguages).values(
    cleaned.map((code) => ({
      sessionId: created.id,
      languageCode: code,
    })),
  );

  return NextResponse.json({
    session: created,
    targetLanguages: cleaned,
    listenerUrl: `/listen/${roomCode}`,
  });
}

const updateBody = z.object({
  id: z.string().uuid(),
  endedAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const user = await getOrCreateDbUser();
  let body: z.infer<typeof updateBody>;
  try {
    body = updateBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const [updated] = await db
    .update(sessions)
    .set({
      endedAt: body.endedAt ?? undefined,
      isActive: body.isActive ?? undefined,
    })
    .where(and(eq(sessions.id, body.id), eq(sessions.userId, user.id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  return NextResponse.json({ session: updated });
}
