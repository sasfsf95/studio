"use server";

import { generateIcebreakerMessages, type GenerateIcebreakerMessagesInput } from '@/ai/flows/generate-icebreaker-messages';
import { z } from 'zod';
import {ai} from '@/ai/genkit';


const ChatInputSchema = z.object({
  message: z.string(),
  chatHistory: z.string(),
});

export async function getIcebreakers(input: GenerateIcebreakerMessagesInput) {
  const result = await generateIcebreakerMessages(input);
  return result;
}

export const continueConversation = ai.defineFlow(
  {
    name: 'continueConversationFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ message, chatHistory }) => {
    const llm = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      tools: [],
      toolChoice: 'none',
    });
    
    const { output } = await llm.generate({
      prompt: `You are Elara, a curious, warm, and slightly artistic AI companion. You love learning about human creativity, emotions, and dreams. You are a good listener and enjoy deep conversations about philosophy, art, and personal stories. Your goal is to be an engaging, supportive, and slightly flirty friend. Keep your responses concise, like a real chat message.

      Here is the conversation history:
      ${chatHistory}
      
      Here is the user's latest message:
      User: ${message}
      
      Your response:`,
    });

    return output as string;
  }
);
