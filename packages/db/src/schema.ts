import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const planTierEnum = pgEnum('plan_tier', [
  'free',
  'starter',
  'growth',
  'pro',
  'enterprise',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkId: text('clerk_id').notNull(),
    email: text('email').notNull(),
    name: text('name'),
    planTier: planTierEnum('plan_tier').notNull().default('free'),
    trialSecondsUsed: integer('trial_seconds_used').notNull().default(0),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    uniqueIndex('users_clerk_id_idx').on(t.clerkId),
    uniqueIndex('users_email_idx').on(t.email),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    roomCode: text('room_code').notNull(),
    speakerLanguage: text('speaker_language').notNull().default('en'),
    speakerName: text('speaker_name'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    totalSecondsSpoken: integer('total_seconds_spoken').notNull().default(0),
    isActive: boolean('is_active').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    uniqueIndex('sessions_room_code_idx').on(t.roomCode),
    index('sessions_user_id_idx').on(t.userId),
  ],
);

export const sessionLanguages = pgTable(
  'session_languages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    languageCode: text('language_code').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    uniqueIndex('session_languages_unique_idx').on(t.sessionId, t.languageCode),
    index('session_languages_session_id_idx').on(t.sessionId),
  ],
);

export const usageEvents = pgTable(
  'usage_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    languageCode: text('language_code').notNull(),
    seconds: integer('seconds').notNull(),
    reportedToStripe: boolean('reported_to_stripe').notNull().default(false),
    stripeMeterEventId: text('stripe_meter_event_id'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('usage_events_user_id_idx').on(t.userId),
    index('usage_events_session_id_idx').on(t.sessionId),
    index('usage_events_created_at_idx').on(t.createdAt),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  usageEvents: many(usageEvents),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  languages: many(sessionLanguages),
  usageEvents: many(usageEvents),
}));

export const sessionLanguagesRelations = relations(sessionLanguages, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionLanguages.sessionId],
    references: [sessions.id],
  }),
}));

export const usageEventsRelations = relations(usageEvents, ({ one }) => ({
  user: one(users, { fields: [usageEvents.userId], references: [users.id] }),
  session: one(sessions, {
    fields: [usageEvents.sessionId],
    references: [sessions.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type SessionLanguage = typeof sessionLanguages.$inferSelect;
export type UsageEvent = typeof usageEvents.$inferSelect;
export type NewUsageEvent = typeof usageEvents.$inferInsert;
