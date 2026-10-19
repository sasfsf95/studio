import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const geminiApiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || '';

if (geminiApiKey && !process.env.GEMINI_API_KEY) {
  process.env.GEMINI_API_KEY = geminiApiKey;
}
if (geminiApiKey && !process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = geminiApiKey;
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: geminiApiKey })],
  model: 'googleai/gemini-2.5-flash',
});
