import { config } from 'dotenv';
config();

import '@/ai/flows/generate-icebreaker-messages.ts';
import '@/ai/flows/summarize-chat-history.ts';
import '@/ai/flows/text-to-speech.ts';
