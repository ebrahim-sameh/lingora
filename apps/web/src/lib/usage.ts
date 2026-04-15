import { and, eq, gte, sql } from 'drizzle-orm';
import { db, users, usageEvents, sessions } from '@lingora/db';
import { getIncludedSecondsForTier, TRIAL_SECONDS_LIMIT } from '@lingora/shared/pricing';
import type { PlanTier } from '@lingora/shared';

export interface UsageSummary {
  secondsUsed: number;
  secondsIncluded: number;
  minutesUsed: number;
  minutesIncluded: number;
  percentUsed: number;
  overageSeconds: number;
  planTier: PlanTier;
  isTrialExhausted: boolean;
}

function monthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new Error('User not found');
  }

  const tier = user.planTier as PlanTier;

  if (tier === 'free') {
    const secondsUsed = user.trialSecondsUsed;
    const included = TRIAL_SECONDS_LIMIT;
    return {
      secondsUsed,
      secondsIncluded: included,
      minutesUsed: Math.floor(secondsUsed / 60),
      minutesIncluded: included / 60,
      percentUsed: included === 0 ? 100 : Math.min(100, Math.round((secondsUsed / included) * 100)),
      overageSeconds: Math.max(0, secondsUsed - included),
      planTier: tier,
      isTrialExhausted: secondsUsed >= included,
    };
  }

  const monthlyRow = await db
    .select({ total: sql<number>`COALESCE(SUM(${usageEvents.seconds}), 0)::int` })
    .from(usageEvents)
    .where(and(eq(usageEvents.userId, userId), gte(usageEvents.createdAt, monthStart())));

  const secondsUsed = Number(monthlyRow[0]?.total ?? 0);
  const included = getIncludedSecondsForTier(tier);

  return {
    secondsUsed,
    secondsIncluded: included,
    minutesUsed: Math.floor(secondsUsed / 60),
    minutesIncluded: included / 60,
    percentUsed: included === 0 ? 0 : Math.min(100, Math.round((secondsUsed / included) * 100)),
    overageSeconds: Math.max(0, secondsUsed - included),
    planTier: tier,
    isTrialExhausted: false,
  };
}

export async function getRecentSessions(userId: string, limit = 10) {
  return db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(sql`${sessions.createdAt} desc`)
    .limit(limit);
}
