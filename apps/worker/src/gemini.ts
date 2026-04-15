import { GoogleGenAI } from '@google/genai';
import { getLanguageByCode } from '@lingora/shared/languages';
import { env } from './env.js';
import type { Logger } from './logger.js';

/**
 * Gemini 2.5 Flash streaming translation.
 *
 * Docs: https://github.com/googleapis/js-genai
 *
 * Each final Gladia transcript is translated through generateContentStream
 * into the target language. We stream the tokens as they arrive so the
 * downstream TTS can start speaking before the full translation is done.
 */

export interface TranslationOptions {
  sourceText: string;
  targetLanguageCode: string;
  context?: string;
  onToken: (token: string) => void;
  onDone: (fullText: string) => void;
  onError: (err: unknown) => void;
  logger: Logger;
}

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

const SYSTEM_TEMPLATE = (targetLanguage: string) => `You are a live interpreter for a real-time event.
Translate the speaker's text into ${targetLanguage}.

Rules:
- Output ONLY the translation. No commentary, no explanations, no transliteration.
- Preserve speaker's register (solemn for a sermon, technical for a lecture, energetic for a keynote).
- If the text is an incomplete fragment, translate what you have; more context is coming.
- If you see hesitations, filler words, or ums, drop them.
- Keep the translation close to the original length so speech pacing matches the live audio.
- NEVER output brackets, stage directions, or metadata — just the spoken words.`;

export async function translateStream(options: TranslationOptions) {
  const target = getLanguageByCode(options.targetLanguageCode);
  const targetName = target?.englishName ?? options.targetLanguageCode;

  try {
    const stream = await ai.models.generateContentStream({
      model: env.geminiModel,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Source text: """${options.sourceText}"""${options.context ? `\n\nRolling context (do not translate, just use for disambiguation): ${options.context}` : ''}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_TEMPLATE(targetName),
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 512,
      },
    });

    let full = '';
    for await (const chunk of stream) {
      const token = chunk.text ?? '';
      if (!token) continue;
      full += token;
      options.onToken(token);
    }
    options.onDone(full);
  } catch (err) {
    options.logger.error('gemini stream failed', err);
    options.onError(err);
  }
}
