import { CartesiaClient } from '@cartesia/cartesia-js';
import { getVoiceForLanguage } from '@lingora/shared/voices';
import { env } from './env.js';
import type { Logger } from './logger.js';

/**
 * Cartesia Sonic-3 streaming TTS client.
 *
 * Docs: https://docs.cartesia.ai
 *
 * We open a long-lived TTS WebSocket per (room × language) and reuse a context
 * ID so Sonic-3 keeps consistent prosody between consecutive utterances.
 * Incoming audio chunks are yielded as PCM 16-bit at `cartesiaSampleRate`.
 */

const client = new CartesiaClient({ apiKey: env.cartesiaApiKey });

export interface CartesiaStreamOptions {
  contextId: string;
  targetLanguage: string;
  logger: Logger;
  onAudio: (pcm: Buffer) => void;
  onError: (err: unknown) => void;
}

export async function speakText(
  text: string,
  options: CartesiaStreamOptions,
): Promise<void> {
  const voiceId = getVoiceForLanguage(options.targetLanguage);
  options.logger.debug('cartesia synth', { text: text.slice(0, 60), voiceId });

  try {
    const ws = await client.tts.websocket({
      container: 'raw',
      encoding: 'pcm_s16le',
      sampleRate: env.cartesiaSampleRate,
    });

    const stream = await ws.send({
      modelId: 'sonic-3',
      voice: { mode: 'id', id: voiceId },
      transcript: text,
      contextId: options.contextId,
      language: options.targetLanguage.split('-')[0] ?? options.targetLanguage,
    });

    const done = new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 15000);
      stream.on('message', (raw: unknown) => {
        let parsed: Record<string, unknown> | null = null;
        if (typeof raw === 'string') {
          try {
            parsed = JSON.parse(raw) as Record<string, unknown>;
          } catch {
            return;
          }
        } else if (typeof raw === 'object' && raw !== null) {
          parsed = raw as Record<string, unknown>;
        }
        if (!parsed) return;

        const type = parsed.type;
        if (type === 'chunk' && typeof parsed.data === 'string') {
          options.onAudio(Buffer.from(parsed.data, 'base64'));
        } else if (type === 'done') {
          clearTimeout(timeout);
          resolve();
        } else if (type === 'error') {
          const errMessage =
            typeof parsed.message === 'string' ? parsed.message : 'cartesia error';
          options.logger.error('cartesia stream error', errMessage);
          options.onError(new Error(errMessage));
          clearTimeout(timeout);
          resolve();
        }
      });
    });

    await done;
    ws.disconnect();
  } catch (err) {
    options.logger.error('cartesia synth failed', err);
    options.onError(err);
  }
}
