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
      continue: false,
    });

    stream.on('message', (message: unknown) => {
      if (
        typeof message === 'object' &&
        message !== null &&
        'type' in (message as Record<string, unknown>) &&
        (message as { type: string }).type === 'chunk'
      ) {
        const data = (message as { data?: string }).data;
        if (data) {
          options.onAudio(Buffer.from(data, 'base64'));
        }
      }
    });

    stream.on('error', (err: unknown) => {
      options.logger.error('cartesia stream error', err);
      options.onError(err);
    });

    await new Promise<void>((resolve) => {
      stream.on('close', () => resolve());
    });

    ws.disconnect();
  } catch (err) {
    options.logger.error('cartesia synth failed', err);
    options.onError(err);
  }
}
