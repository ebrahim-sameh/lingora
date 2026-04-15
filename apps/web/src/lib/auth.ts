import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db, users, type User } from '@lingora/db';

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export async function getOrCreateDbUser(): Promise<User> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const existing = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (existing[0]) return existing[0];

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error('Clerk user not found');
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${clerkId}@unknown.local`;

  const [created] = await db
    .insert(users)
    .values({
      clerkId,
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null,
      planTier: 'free',
    })
    .returning();

  if (!created) {
    throw new Error('Failed to create user');
  }
  return created;
}
