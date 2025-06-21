
"use server";

import { generateIcebreakerMessages, type GenerateIcebreakerMessagesInput } from '@/ai/flows/generate-icebreaker-messages';
import {ai} from '@/ai/genkit';


export async function getIcebreakers(input: GenerateIcebreakerMessagesInput) {
  const result = await generateIcebreakerMessages(input);
  return result;
}

export async function continueConversation({ message, chatHistory }: { message: string, chatHistory: string }): Promise<string> {
  const webhookUrl = 'https://sasa2.app.n8n.cloud/webhook-test/yukiai';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, chatHistory }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Webhook returned an error:", { status: response.status, body: errorBody });
      return `Sorry, I'm having trouble connecting. The server said: ${response.statusText}`;
    }

    const responseText = await response.text();
    
    if (!responseText.trim()) {
        console.error("Webhook returned an empty response.");
        return "I'm at a loss for words... the connection seems to have dropped.";
    }

    try {
      const data = JSON.parse(responseText);
      let reply: any;

      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        reply = firstItem.json || firstItem;
      } else {
        reply = data;
      }

      if (typeof reply === 'object' && reply !== null) {
        const messageText = reply.reply || reply.message || reply.text;
        if (typeof messageText === 'string') {
          return messageText;
        }
      } else if (typeof reply === 'string') {
        return reply;
      }
      
      console.error("Could not find a valid reply in webhook JSON response:", responseText);
      return "I received a response I didn't understand. Can we try something else?";

    } catch (error) {
      // If JSON.parse fails, assume it's a plain text response.
      return responseText;
    }

  } catch (error) {
    console.error("Failed to call webhook:", error);
    return "My circuits are a bit fuzzy right now, could you say that again?";
  }
}
