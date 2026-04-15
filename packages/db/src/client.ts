import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

declare global {
  // eslint-disable-next-line no-var
  var __lingoraDbPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  return new Pool({ connectionString });
}

const pool = globalThis.__lingoraDbPool ?? createPool();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__lingoraDbPool = pool;
}

export const db = drizzle(pool, { schema });
export type DbClient = typeof db;
export { schema };
