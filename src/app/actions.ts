
"use server";

import { generateIcebreakerMessages, type GenerateIcebreakerMessagesInput } from '@/ai/flows/generate-icebreaker-messages';
import {ai} from '@/ai/genkit';
import { textToSpeech, TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import Stripe from 'stripe';


export async function getIcebreakers(input: GenerateIcebreakerMessagesInput) {
  const result = await generateIcebreakerMessages(input);
  return result;
}

export async function getAudio(text: string): Promise<TextToSpeechOutput | null> {
    try {
        return await textToSpeech(text);
    } catch (error) {
        console.error("Failed to generate audio:", error);
        return null;
    }
}

export async function continueConversation({ message, chatId }: { message: string, chatId: string }): Promise<{ type: 'text' | 'audio' | 'image' | 'error', content: string }> {
  const webhookUrl = 'https://sasa14.app.n8n.cloud/webhook/sheet-chat';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, chatId }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Webhook returned an error:", { status: response.status, body: errorBody });
      return { type: 'error', content: `Sorry, I'm having trouble connecting. The server said: ${response.statusText}` };
    }

    const contentType = response.headers.get('Content-Type');

    // Handle binary responses (e.g., audio, image)
    if (contentType && (contentType.startsWith('audio/') || contentType.startsWith('image/'))) {
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const dataUri = `data:${contentType};base64,${base64}`;

      if (contentType.startsWith('audio/')) {
        return { type: 'audio', content: dataUri };
      } else if (contentType.startsWith('image/')) {
        return { type: 'image', content: dataUri };
      }
    }

    // Default to handling text/json responses
    const responseText = await response.text();
    
    if (!responseText.trim()) {
        console.error("Webhook returned an empty response.");
        return { type: 'error', content: "I'm at a loss for words... the connection seems to have dropped." };
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

      if (typeof reply === 'object' && reply !== null) {
        const messageText = reply.output || reply.reply || reply.message || reply.text;
        if (typeof messageText === 'string') {
          return { type: 'text', content: messageText };
        }
        return { type: 'text', content: JSON.stringify(reply) };
      }

      if (reply !== null && reply !== undefined) {
          return { type: 'text', content: String(reply) };
      }
      
      console.error("Webhook returned an empty or unhandled response:", responseText);
      return { type: 'error', content: "I'm at a loss for words... the connection seems to have dropped." };

    } catch (error) {
      // Response was not valid JSON, so return it as plain text.
      return { type: 'text', content: responseText };
    }

  } catch (error) {
    console.error("Failed to call webhook:", error);
    return { type: 'error', content: "My circuits are a bit fuzzy right now, could you say that again?" };
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
