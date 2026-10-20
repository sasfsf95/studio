
'use server';

/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that takes text and returns an audio data URI.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { z } from 'genkit';

const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

function cleanTextForSpeech(text: string): string {
  return text
    // Remove emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
    // Remove roleplay asterisks like *whispers*, *smiles*
    .replace(/\*[^*]+\*/g, '')
    // Remove markdown characters
    .replace(/[_~`#>]/g, '')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

function splitIntoSpeechChunks(text: string, maxLen = 160): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length + 1 <= maxLen) {
      currentChunk += (currentChunk ? ' ' : '') + trimmed;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (trimmed.length > maxLen) {
        const words = trimmed.split(' ');
        let subChunk = '';
        for (const word of words) {
          if (subChunk.length + word.length + 1 <= maxLen) {
            subChunk += (subChunk ? ' ' : '') + word;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = word;
          }
        }
        currentChunk = subChunk;
      } else {
        currentChunk = trimmed;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks.slice(0, 4);
}

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput | null> {
  if (!input || input.trim().length < 2) {
    return null;
  }

  const cleaned = cleanTextForSpeech(input);
  if (!cleaned) {
    return null;
  }

  try {
    const chunks = splitIntoSpeechChunks(cleaned);
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(chunk)}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://translate.google.com/',
        },
      });

      if (!response.ok) {
        console.warn(`[TTS] Chunk fetch failed with status ${response.status}`);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(Buffer.from(arrayBuffer));
    }

    if (audioBuffers.length === 0) {
      return null;
    }

    const mergedBuffer = Buffer.concat(audioBuffers);
    const base64Audio = mergedBuffer.toString('base64');

    return {
      audioDataUri: `data:audio/mp3;base64,${base64Audio}`,
    };
  } catch (error) {
    console.error('[TTS] Failed to generate text to speech audio:', error);
    return null;
  }
}
