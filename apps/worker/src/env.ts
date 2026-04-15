function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  livekitUrl: required('LIVEKIT_URL'),
  livekitApiKey: required('LIVEKIT_API_KEY'),
  livekitApiSecret: required('LIVEKIT_API_SECRET'),
  gladiaApiKey: required('GLADIA_API_KEY'),
  geminiApiKey: required('GEMINI_API_KEY'),
  cartesiaApiKey: required('CARTESIA_API_KEY'),
  workerUsageWebhookUrl: required('WORKER_USAGE_WEBHOOK_URL'),
  workerUsageSecret: required('WORKER_USAGE_SECRET'),
  roomPattern: optional('LINGORA_ROOM_PATTERN', 'lingora-'),
  usageReportIntervalMs: Number(optional('USAGE_REPORT_INTERVAL_MS', '30000')),
  gladiaSampleRate: Number(optional('GLADIA_SAMPLE_RATE', '16000')),
  cartesiaSampleRate: Number(optional('CARTESIA_SAMPLE_RATE', '24000')),
  geminiModel: optional('GEMINI_MODEL', 'gemini-2.5-flash'),
};

export type LingoraEnv = typeof env;
