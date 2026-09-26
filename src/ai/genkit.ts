import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Populate standard Gemini API key environment variables if they are not set
if (process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY) {
  process.env.GEMINI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
}
if (process.env.GOOGLE_GENAI_API_KEY && !process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY })],
  model: 'googleai/gemini-2.0-flash',
});
