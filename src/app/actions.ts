"use server";

import { generateIcebreakerMessages, type GenerateIcebreakerMessagesInput } from '@/ai/flows/generate-icebreaker-messages';
import {ai} from '@/ai/genkit';


export async function getIcebreakers(input: GenerateIcebreakerMessagesInput) {
  const result = await generateIcebreakerMessages(input);
  return result;
}

export async function continueConversation({ message, chatHistory }: { message: string, chatHistory: string }): Promise<string> {
  const webhookUrl = 'https://sasa2.app.n8n.cloud/webhook/yukiai';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Sending a structured payload that the webhook can easily parse.
      body: JSON.stringify({ message, chatHistory }),
    });

    if (!response.ok) {
      console.error("Webhook error:", response.status, await response.text());
      return "Sorry, I had a problem communicating. Could you try again?";
    }
    
    const data = await response.json();

    // n8n webhooks often return an array of objects.
    // We'll try to find the reply in a few common formats.
    let reply = '';

    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const firstItem = data[0];
      reply = firstItem.reply || firstItem.text || firstItem.message;
    } else if (typeof data === 'object' && data !== null) {
      reply = data.reply || data.text || data.message;
    } else if (typeof data === 'string') {
      reply = data;
    }
    
    if (reply && typeof reply === 'string') {
      return reply;
    }

    console.error("Unexpected webhook response format:", data);
    return "I received a response I didn't understand. Let's talk about something else?";

  } catch (error) {
    console.error("Failed to call webhook:", error);
    return "My circuits are a bit fuzzy right now, could you say that again?";
  }
}