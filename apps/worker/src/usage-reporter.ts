import { env } from './env.js';
import type { Logger } from './logger.js';

/**
 * Batches usage seconds per (userId, sessionId, language) and flushes to the
 * web app's /api/usage endpoint on a fixed cadence. The web app persists the
 * event and forwards it to Stripe's billing meter.
 */

interface UsageKey {
  userId: string;
  sessionId: string;
  languageCode: string;
}

interface PendingUsage extends UsageKey {
  seconds: number;
}

function keyFor(k: UsageKey): string {
  return `${k.userId}:${k.sessionId}:${k.languageCode}`;
}

export class UsageReporter {
  private pending = new Map<string, PendingUsage>();
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly logger: Logger) {}

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.flush();
    }, env.usageReportIntervalMs);
    this.logger.info('usage reporter started', {
      intervalMs: env.usageReportIntervalMs,
    });
  }

  add(key: UsageKey, seconds: number) {
    const existing = this.pending.get(keyFor(key));
    if (existing) {
      existing.seconds += seconds;
    } else {
      this.pending.set(keyFor(key), { ...key, seconds });
    }
  }

  async flush() {
    if (this.pending.size === 0) return;
    const snapshot = Array.from(this.pending.values());
    this.pending.clear();

    for (const entry of snapshot) {
      if (entry.seconds < 1) continue;
      try {
        const res = await fetch(env.workerUsageWebhookUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-lingora-worker-secret': env.workerUsageSecret,
          },
          body: JSON.stringify({
            userId: entry.userId,
            sessionId: entry.sessionId,
            languageCode: entry.languageCode,
            seconds: Math.round(entry.seconds),
          }),
        });
        if (!res.ok) {
          this.logger.warn('usage flush failed', {
            status: res.status,
            key: keyFor(entry),
          });
          if (res.status !== 402) {
            // Re-queue for next flush unless quota exceeded
            const existing = this.pending.get(keyFor(entry));
            if (existing) existing.seconds += entry.seconds;
            else this.pending.set(keyFor(entry), entry);
          }
        }
      } catch (err) {
        this.logger.warn('usage flush error', err);
        const existing = this.pending.get(keyFor(entry));
        if (existing) existing.seconds += entry.seconds;
        else this.pending.set(keyFor(entry), entry);
      }
    }
  }

  async stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    await this.flush();
  }
}
