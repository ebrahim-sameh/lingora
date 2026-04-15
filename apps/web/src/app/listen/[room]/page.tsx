import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, sessions, sessionLanguages } from '@lingora/db';
import { getLanguageByCode } from '@lingora/shared/languages';
import { ListenerClient } from '@/components/listener/listener-client';

export const dynamic = 'force-dynamic';

export default async function ListenRoomPage({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room } = await params;
  const roomCode = room.toUpperCase();

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.roomCode, roomCode))
    .limit(1);

  if (!session) {
    if (roomCode === 'DEMO-ROOM' || roomCode === 'DEMO' || roomCode === 'PREVIEW') {
      return (
        <ListenerClient
          roomCode={roomCode}
          sessionName="Lingora live demo"
          speakerName="Demo speaker"
          languageCodes={['es', 'fr', 'de', 'zh', 'ja', 'pt', 'ar', 'hi']}
        />
      );
    }
    notFound();
  }

  const langs = await db
    .select()
    .from(sessionLanguages)
    .where(eq(sessionLanguages.sessionId, session.id));

  const codes = langs
    .map((l) => getLanguageByCode(l.languageCode))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))
    .map((l) => l.code);

  return (
    <ListenerClient
      roomCode={session.roomCode}
      sessionName={session.name}
      speakerName={session.speakerName ?? null}
      languageCodes={codes}
    />
  );
}
