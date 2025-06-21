
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
      const errorBody = await response.text();
      console.error("Webhook error:", response.status, errorBody);
      return `Sorry, I had a problem communicating. The server said: ${response.statusText}`;
    }
    
    const data = await response.json();

    // n8n can wrap responses in various ways. Let's try to find the actual reply.
    let reply: string | undefined = '';
    
    // Helper function to extract reply from a potential data object
    const extractReply = (d: any): string | undefined => {
        if (typeof d !== 'object' || d === null) return undefined;
        return d.reply || d.text || d.message;
    };

    // Case 1: Response is a string directly
    if (typeof data === 'string') {
        reply = data;
    } 
    // Case 2: Response is an object, possibly nested (e.g., { "json": { "reply": "..." } })
    else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        reply = extractReply(data) || extractReply(data.json) || extractReply(data.body);
    }
    // Case 3: Response is an array of objects
    else if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        reply = extractReply(firstItem) || extractReply(firstItem.json) || extractReply(firstItem.body);
    }
    
    if (reply && typeof reply === 'string') {
      return reply;
    }

    console.error("Unexpected webhook response format:", JSON.stringify(data, null, 2));
    return "I received a response I didn't understand. Let's talk about something else?";

  } catch (error) {
    console.error("Failed to call or parse webhook response:", error);
    return "My circuits are a bit fuzzy right now, could you say that again?";
  }
}
