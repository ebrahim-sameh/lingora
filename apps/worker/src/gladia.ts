import WebSocket from 'ws';
import { env } from './env.js';
import type { Logger } from './logger.js';

/**
 * Gladia Solaria-1 live transcription client.
 *
 * Docs: https://docs.gladia.io/chapters/live-stt/quickstart
 *
 * Flow:
 *   1. POST /v2/live → returns { id, url } with an authenticated WebSocket URL.
 *   2. Open WebSocket to that URL.
 *   3. Push raw PCM audio as binary frames.
 *   4. Receive { type: "transcript", data: { is_final, utterance } } messages.
 */

export interface GladiaTranscript {
  text: string;
  isFinal: boolean;
  startSeconds: number;
  endSeconds: number;
  language: string | null;
}

export interface GladiaClientOptions {
  language: string;
  onTranscript: (transcript: GladiaTranscript) => void;
  onError: (err: unknown) => void;
  onClose: () => void;
  logger: Logger;
}

export class GladiaClient {
  private ws: WebSocket | null = null;
  private connected = false;
  private pendingAudio: Buffer[] = [];

  constructor(private readonly options: GladiaClientOptions) {}

  async connect(): Promise<void> {
    const initResponse = await fetch('https://api.gladia.io/v2/live', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-gladia-key': env.gladiaApiKey,
      },
      body: JSON.stringify({
        encoding: 'wav/pcm',
        sample_rate: env.gladiaSampleRate,
        bit_depth: 16,
        channels: 1,
        language_config: {
          languages: [this.options.language],
          code_switching: false,
        },
        messages_config: {
          receive_partial_transcripts: true,
          receive_final_transcripts: true,
          receive_speech_events: false,
          receive_pre_processing_events: false,
          receive_realtime_processing_events: false,
          receive_post_processing_events: false,
          receive_acknowledgments: false,
          receive_lifecycle_events: false,
        },
        endpointing: 0.3,
        model: 'solaria-1',
      }),
    });

    if (!initResponse.ok) {
      const error = await initResponse.text();
      throw new Error(`Gladia init failed (${initResponse.status}): ${error}`);
    }

    const init = (await initResponse.json()) as { id: string; url: string };
    this.options.logger.info('gladia session initialized', { id: init.id });

    const ws = new WebSocket(init.url);
    this.ws = ws;

    ws.on('open', () => {
      this.connected = true;
      this.options.logger.info('gladia websocket open');
      for (const chunk of this.pendingAudio) ws.send(chunk);
      this.pendingAudio = [];
    });

    ws.on('message', (raw) => {
      try {
        const message = JSON.parse(raw.toString()) as {
          type: string;
          data?: {
            is_final?: boolean;
            utterance?: {
              text: string;
              start: number;
              end: number;
              language: string;
            };
          };
        };
        if (message.type === 'transcript' && message.data?.utterance) {
          this.options.onTranscript({
            text: message.data.utterance.text,
            isFinal: Boolean(message.data.is_final),
            startSeconds: message.data.utterance.start,
            endSeconds: message.data.utterance.end,
            language: message.data.utterance.language ?? null,
          });
        }
      } catch (err) {
        this.options.logger.warn('gladia parse failed', err);
      }
    });

    ws.on('error', (err) => {
      this.options.logger.error('gladia websocket error', err);
      this.options.onError(err);
    });

    ws.on('close', () => {
      this.connected = false;
      this.options.logger.info('gladia websocket closed');
      this.options.onClose();
    });
  }

  pushAudio(pcm: Buffer) {
    if (!this.ws || !this.connected) {
      this.pendingAudio.push(pcm);
      return;
    }
    this.ws.send(pcm);
  }

  async close() {
    if (this.ws) {
      try {
        this.ws.send(JSON.stringify({ type: 'stop_recording' }));
      } catch {
        // ignore
      }
      this.ws.close();
      this.ws = null;
    }
  }
}
