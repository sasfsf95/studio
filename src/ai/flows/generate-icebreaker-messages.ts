// use server'

/**
 * @fileOverview This file defines a Genkit flow for generating personalized icebreaker messages for users to start conversations with their AI companion.
 *
 * - generateIcebreakerMessages - A function that generates a list of icebreaker messages based on the AI companion's profile.
 * - GenerateIcebreakerMessagesInput - The input type for the generateIcebreakerMessages function.
 * - GenerateIcebreakerMessagesOutput - The return type for the generateIcebreakerMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIcebreakerMessagesInputSchema = z.object({
  aiCompanionProfile: z.string().describe('A detailed profile of the AI companion, including personality, interests, and background.'),
  userInterests: z.string().describe('A description of the user interest'),
});
export type GenerateIcebreakerMessagesInput = z.infer<typeof GenerateIcebreakerMessagesInputSchema>;

const GenerateIcebreakerMessagesOutputSchema = z.object({
  icebreakerMessages: z.array(z.string()).describe('An array of personalized icebreaker messages for the user.'),
});
export type GenerateIcebreakerMessagesOutput = z.infer<typeof GenerateIcebreakerMessagesOutputSchema>;

export async function generateIcebreakerMessages(input: GenerateIcebreakerMessagesInput): Promise<GenerateIcebreakerMessagesOutput> {
  return generateIcebreakerMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIcebreakerMessagesPrompt',
  input: {schema: GenerateIcebreakerMessagesInputSchema},
  output: {schema: GenerateIcebreakerMessagesOutputSchema},
  prompt: `You are an expert at creating engaging icebreaker messages.

  Based on the AI companion's profile and the user's interests, generate a list of 5 distinct icebreaker messages that the user can use to start a conversation.

  AI Companion Profile: {{{aiCompanionProfile}}}
  User Interest: {{{userInterests}}}

  Consider the AI companion's personality and interests to create messages that feel natural and relevant.
  The icebreaker messages should not be boring and should encourage an engaging, interesting conversation.

  Output the icebreaker messages in array of strings.
  Ensure that the response is a valid JSON.
  `,
});

const generateIcebreakerMessagesFlow = ai.defineFlow(
  {
    name: 'generateIcebreakerMessagesFlow',
    inputSchema: GenerateIcebreakerMessagesInputSchema,
    outputSchema: GenerateIcebreakerMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

