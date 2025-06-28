
"use server";

import { generateIcebreakerMessages, type GenerateIcebreakerMessagesInput } from '@/ai/flows/generate-icebreaker-messages';
import {ai} from '@/ai/genkit';
import Stripe from 'stripe';


export async function getIcebreakers(input: GenerateIcebreakerMessagesInput) {
  const result = await generateIcebreakerMessages(input);
  return result;
}

export async function continueConversation({ message, chatHistory, imageUrl }: { message: string, chatHistory: string, imageUrl?: string }): Promise<string> {
  const webhookUrl = 'https://sasa2.app.n8n.cloud/webhook/yukiai';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, chatHistory, imageUrl }),
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

      // Handle n8n's common array wrapper format
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        reply = firstItem.json || firstItem;
      } else {
        reply = data;
      }

      // Case 1: Reply is an object. Try to find a known key.
      if (typeof reply === 'object' && reply !== null) {
        // Check for 'output' first, then fall back to other common keys.
        const messageText = reply.output || reply.reply || reply.message || reply.text;
        if (typeof messageText === 'string') {
          return messageText;
        }
        // Fallback for objects: stringify the whole thing so the user can see the structure.
        return JSON.stringify(reply);
      }

      // Case 2: Reply is a primitive (string, number, boolean). Convert to string and return.
      if (reply !== null && reply !== undefined) {
          return String(reply);
      }
      
      // Fallback for empty or unhandled responses like `[]` or `{}`
      console.error("Webhook returned an empty or unhandled response:", responseText);
      return "I'm at a loss for words... the connection seems to have dropped.";

    } catch (error) {
      // Case 3: Response was not valid JSON, so return it as plain text.
      return responseText;
    }

  } catch (error) {
    console.error("Failed to call webhook:", error);
    return "My circuits are a bit fuzzy right now, could you say that again?";
  }
}

export async function createCheckoutSession(): Promise<string | null> {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID || !process.env.NEXT_PUBLIC_APP_URL) {
    console.error("Stripe environment variables are not set. Please check your .env file.");
    return null;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat`,
    });
    return session.url;
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", error);
    return null;
  }
}
