import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

declare global {
  // eslint-disable-next-line no-var
  var __lingoraDbPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __lingoraDb: NeonDatabase<typeof schema> | undefined;
}

function createDb(): NeonDatabase<typeof schema> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set — provision a Neon database and set it in your env.',
    );
  }
  const pool = globalThis.__lingoraDbPool ?? new Pool({ connectionString });
  if (process.env.NODE_ENV !== 'production') {
    globalThis.__lingoraDbPool = pool;
  }
  return drizzle(pool, { schema });
}

/**
 * Lazy proxy — the real Drizzle client is only created on first use, so that
 * Next.js build-time page collection (which evaluates module top-level code
 * without env vars) doesn't crash.
 */
export const db = new Proxy({} as NeonDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const instance = globalThis.__lingoraDb ?? createDb();
    if (process.env.NODE_ENV !== 'production') {
      globalThis.__lingoraDb = instance;
    }
    return Reflect.get(instance as object, prop, receiver);
  },
});

export type DbClient = NeonDatabase<typeof schema>;
export { schema };
