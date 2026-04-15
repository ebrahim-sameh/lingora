import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db, sessions, sessionLanguages } from '@lingora/db';
import { getLanguageByCode } from '@lingora/shared/languages';
import { getOrCreateDbUser } from '@/lib/auth';
import { ActiveSessionView } from '@/components/dashboard/active-session-view';

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getOrCreateDbUser();

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, id), eq(sessions.userId, user.id)))
    .limit(1);

  if (!session) notFound();

  const langs = await db
    .select()
    .from(sessionLanguages)
    .where(eq(sessionLanguages.sessionId, session.id));

  const expanded = langs
    .map((l) => getLanguageByCode(l.languageCode))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return <ActiveSessionView session={session} languages={expanded} />;
}
