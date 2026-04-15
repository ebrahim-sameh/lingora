export type PlanTier = 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';

export interface SessionMetadata {
  speakerLanguage: string;
  targetLanguages: string[];
  speakerName?: string;
  eventName?: string;
}

export interface UsageEvent {
  userId: string;
  sessionId: string;
  languageCode: string;
  seconds: number;
  reportedAt: string;
}

export interface LivePlayerState {
  status: 'idle' | 'connecting' | 'live' | 'paused' | 'ended' | 'error';
  selectedLanguage: string | null;
  latestCaption: string;
  listenerCount: number;
}
