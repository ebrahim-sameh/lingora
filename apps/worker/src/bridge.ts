import {
  AudioFrame,
  AudioSource,
  AudioStream,
  LocalAudioTrack,
  Room,
  RoomEvent,
  TrackKind,
  TrackPublishOptions,
  TrackSource,
  type RemoteAudioTrack,
  type RemoteParticipant,
  type TrackPublication,
} from '@livekit/rtc-node';
import { getLanguageByCode } from '@lingora/shared/languages';
import { GladiaClient, type GladiaTranscript } from './gladia.js';
import { translateStream } from './gemini.js';
import { speakText } from './cartesia.js';
import { env } from './env.js';
import { createLogger, type Logger } from './logger.js';
import { UsageReporter } from './usage-reporter.js';

export interface RoomMetadata {
  sessionId: string;
  userId: string;
  speakerLanguage: string;
  targetLanguages: string[];
}

function parseMetadata(raw: string): RoomMetadata | null {
  try {
    const parsed = JSON.parse(raw) as Partial<RoomMetadata>;
    if (
      !parsed.sessionId ||
      !parsed.userId ||
      !parsed.speakerLanguage ||
      !Array.isArray(parsed.targetLanguages)
    ) {
      return null;
    }
    return parsed as RoomMetadata;
  } catch {
    return null;
  }
}

export class RoomBridge {
  private readonly logger: Logger;
  private readonly languageBridges = new Map<string, LanguageBridge>();
  private readonly usage: UsageReporter;
  private metadata: RoomMetadata | null = null;
  private stopped = false;

  constructor(private readonly room: Room) {
    this.logger = createLogger(`bridge:${room.name ?? 'unknown'}`);
    this.usage = new UsageReporter(this.logger.child('usage'));
  }

  async start(): Promise<void> {
    this.logger.info('starting bridge');
    this.usage.start();

    const meta = parseMetadata(this.room.metadata ?? '');
    if (!meta) {
      this.logger.warn('room metadata missing or malformed — bridge idle');
      return;
    }
    this.metadata = meta;

    this.room.on(RoomEvent.TrackSubscribed, this.onTrackSubscribed.bind(this));
    this.room.on(RoomEvent.Disconnected, () => void this.stop('room disconnected'));

    for (const participant of this.room.remoteParticipants.values()) {
      for (const pub of participant.trackPublications.values()) {
        if (pub.track && pub.kind === TrackKind.KIND_AUDIO) {
          void this.onTrackSubscribed(pub.track as RemoteAudioTrack, pub, participant);
        }
      }
    }

    for (const code of meta.targetLanguages) {
      this.ensureLanguage(code);
    }
  }

  private ensureLanguage(code: string): LanguageBridge | null {
    if (!this.metadata) return null;
    const existing = this.languageBridges.get(code);
    if (existing) return existing;

    const lang = getLanguageByCode(code);
    if (!lang) {
      this.logger.warn('unknown target language, skipping', { code });
      return null;
    }

    const bridge = new LanguageBridge({
      languageCode: code,
      sessionId: this.metadata.sessionId,
      userId: this.metadata.userId,
      speakerLanguage: this.metadata.speakerLanguage,
      room: this.room,
      usage: this.usage,
      logger: this.logger.child(code),
    });
    this.languageBridges.set(code, bridge);
    void bridge.start();
    return bridge;
  }

  private async onTrackSubscribed(
    track: RemoteAudioTrack,
    _publication: TrackPublication,
    participant: RemoteParticipant,
  ) {
    if (track.kind !== TrackKind.KIND_AUDIO) return;
    // Only subscribe to the speaker (identified by metadata role=speaker)
    try {
      const meta = participant.metadata ? JSON.parse(participant.metadata) : null;
      if (meta?.role !== 'speaker') return;
    } catch {
      return;
    }

    this.logger.info('speaker track subscribed', { participant: participant.identity });

    const audioStream = new AudioStream(track);
    const reader = audioStream.getReader();

    (async () => {
      try {
        while (!this.stopped) {
          const { done, value } = await reader.read();
          if (done || !value) break;
          const pcm = Buffer.from(value.data.buffer, value.data.byteOffset, value.data.byteLength);
          for (const bridge of this.languageBridges.values()) {
            bridge.feedAudio(pcm);
          }
        }
      } catch (err) {
        this.logger.warn('audio stream read ended', err);
      }
    })();
  }

  async stop(reason: string) {
    if (this.stopped) return;
    this.stopped = true;
    this.logger.info('stopping bridge', { reason });
    for (const bridge of this.languageBridges.values()) {
      await bridge.stop();
    }
    this.languageBridges.clear();
    await this.usage.stop();
    try {
      await this.room.disconnect();
    } catch {
      // ignore
    }
  }
}

interface LanguageBridgeOptions {
  languageCode: string;
  sessionId: string;
  userId: string;
  speakerLanguage: string;
  room: Room;
  usage: UsageReporter;
  logger: Logger;
}

class LanguageBridge {
  private gladia: GladiaClient | null = null;
  private audioSource: AudioSource | null = null;
  private track: LocalAudioTrack | null = null;
  private recentContext: string[] = [];
  private stopped = false;
  private lastSpeechStart = 0;

  constructor(private readonly options: LanguageBridgeOptions) {}

  async start() {
    this.options.logger.info('language bridge starting');

    this.audioSource = new AudioSource(env.cartesiaSampleRate, 1);
    this.track = LocalAudioTrack.createAudioTrack(
      `translation-${this.options.languageCode}`,
      this.audioSource,
    );

    try {
      await this.options.room.localParticipant?.publishTrack(
        this.track,
        new TrackPublishOptions({ source: TrackSource.SOURCE_MICROPHONE }),
      );
    } catch (err) {
      this.options.logger.error('failed to publish translation track', err);
    }

    this.gladia = new GladiaClient({
      language: this.options.speakerLanguage,
      logger: this.options.logger.child('gladia'),
      onTranscript: (t) => this.onTranscript(t),
      onError: (err) => this.options.logger.warn('gladia error', err),
      onClose: () => this.options.logger.info('gladia closed'),
    });

    try {
      await this.gladia.connect();
    } catch (err) {
      this.options.logger.error('gladia connect failed', err);
    }
  }

  feedAudio(pcm: Buffer) {
    if (this.stopped) return;
    this.gladia?.pushAudio(pcm);
  }

  private onTranscript(transcript: GladiaTranscript) {
    if (!transcript.isFinal) return;
    if (!transcript.text.trim()) return;

    const duration = Math.max(0, transcript.endSeconds - transcript.startSeconds);
    this.options.usage.add(
      {
        userId: this.options.userId,
        sessionId: this.options.sessionId,
        languageCode: this.options.languageCode,
      },
      duration,
    );

    this.lastSpeechStart = Date.now();
    const context = this.recentContext.slice(-3).join(' ');

    void translateStream({
      sourceText: transcript.text,
      targetLanguageCode: this.options.languageCode,
      context,
      logger: this.options.logger.child('gemini'),
      onToken: () => {
        // No-op: we only speak on full completion for stable prosody.
        // In v2 we'll stream tokens into Cartesia mid-sentence for lower latency.
      },
      onError: () => undefined,
      onDone: (full) => {
        if (!full.trim()) return;
        this.recentContext.push(full);
        if (this.recentContext.length > 10) this.recentContext.shift();

        void speakText(full, {
          contextId: `lingora-${this.options.sessionId}-${this.options.languageCode}`,
          targetLanguage: this.options.languageCode,
          logger: this.options.logger.child('cartesia'),
          onAudio: (pcm) => this.publishAudio(pcm),
          onError: () => undefined,
        });
      },
    });
  }

  private publishAudio(pcm: Buffer) {
    if (!this.audioSource) return;
    const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.byteLength / 2));
    const frame = new AudioFrame(samples, env.cartesiaSampleRate, 1, samples.length);
    void this.audioSource.captureFrame(frame);
  }

  async stop() {
    this.stopped = true;
    this.options.logger.info('language bridge stopping');
    await this.gladia?.close();
    this.gladia = null;
    if (this.track) {
      try {
        await this.options.room.localParticipant?.unpublishTrack(this.track.sid ?? '');
      } catch {
        // ignore
      }
      this.track = null;
    }
  }
}
