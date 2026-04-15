import { Room, RoomOptions } from '@livekit/rtc-node';
import { AccessToken, RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk';
import { env } from './env.js';
import { createLogger } from './logger.js';
import { RoomBridge } from './bridge.js';

/**
 * Lingora worker — polls LiveKit RoomService for active rooms matching the
 * `lingora-*` pattern and joins each one as an invisible "bridge" participant.
 *
 * For each room, we spin up a RoomBridge that:
 *   - Subscribes to the speaker's audio track
 *   - For every target language declared in room metadata, runs a Gladia →
 *     Gemini → Cartesia pipeline and publishes a new `translation-<lang>`
 *     audio track that listeners can subscribe to.
 *
 * The worker reports usage every 30 seconds to the web app's /api/usage
 * endpoint, which persists the event and forwards it to Stripe's billing
 * meter.
 *
 * Run with `pnpm --filter @lingora/worker dev` once all env vars are set.
 * Deploy via the provided Dockerfile to Railway, Fly.io, or any long-lived
 * Node host. Vercel serverless functions cannot host this worker.
 */

const logger = createLogger('worker');
const roomService = new RoomServiceClient(
  env.livekitUrl,
  env.livekitApiKey,
  env.livekitApiSecret,
);

const active = new Map<string, { bridge: RoomBridge; room: Room }>();

async function joinRoom(roomName: string): Promise<void> {
  if (active.has(roomName)) return;
  logger.info('joining room', { roomName });

  const token = new AccessToken(env.livekitApiKey, env.livekitApiSecret, {
    identity: `lingora-bridge-${roomName}`,
    ttl: '6h',
    metadata: JSON.stringify({ role: 'bridge' }),
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
    hidden: false,
  });
  const jwt = await token.toJwt();

  const room = new Room();
  try {
    await room.connect(env.livekitUrl, jwt, new RoomOptions());
  } catch (err) {
    logger.error('room connect failed', { roomName, err: String(err) });
    return;
  }

  const bridge = new RoomBridge(room);
  active.set(roomName, { bridge, room });

  try {
    await bridge.start();
  } catch (err) {
    logger.error('bridge start failed', { roomName, err: String(err) });
    await leaveRoom(roomName, 'start failed');
  }
}

async function leaveRoom(roomName: string, reason: string) {
  const entry = active.get(roomName);
  if (!entry) return;
  active.delete(roomName);
  await entry.bridge.stop(reason);
}

async function reconcile() {
  try {
    const rooms = await roomService.listRooms();
    const lingoraRooms = rooms.filter((r) => r.name.startsWith(env.roomPattern));
    const currentNames = new Set(lingoraRooms.map((r) => r.name));

    for (const r of lingoraRooms) {
      if (!active.has(r.name)) {
        await joinRoom(r.name);
      }
    }

    for (const name of active.keys()) {
      if (!currentNames.has(name)) {
        await leaveRoom(name, 'room no longer exists');
      }
    }
  } catch (err) {
    logger.error('reconcile failed', err);
  }
}

async function main() {
  logger.info('Lingora worker starting', {
    livekitUrl: env.livekitUrl,
    roomPattern: env.roomPattern,
    geminiModel: env.geminiModel,
  });

  await reconcile();
  const interval = setInterval(() => void reconcile(), 5000);

  const shutdown = async () => {
    logger.info('shutting down');
    clearInterval(interval);
    for (const name of active.keys()) {
      await leaveRoom(name, 'shutdown');
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  logger.error('fatal worker error', err);
  process.exit(1);
});

export { WebhookReceiver };
