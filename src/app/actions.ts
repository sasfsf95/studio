
"use server";

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { textToSpeech, TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import { getSystemPrompt } from '@/ai/system-prompt';
import Stripe from 'stripe';


export async function getAudio(text: string): Promise<TextToSpeechOutput | null> {
    try {
        return await textToSpeech(text);
    } catch (error) {
        console.error("Failed to generate audio:", error);
        return null;
    }
}

function buildMessages(systemPrompt: string, history: any[], currentMessage: string) {
  const messages: any[] = [];
  
  if (!history || history.length === 0) {
    messages.push({
      role: 'user',
      content: [{ text: `${systemPrompt}\n\n[Start of Conversation]\nUser: ${currentMessage}` }]
    });
    return messages;
  }
  
  const formattedHistory = history.map((h) => ({
    role: h.role,
    content: h.parts,
  }));
  
  if (formattedHistory[0].role === 'model') {
    messages.push({
      role: 'user',
      content: [{ text: `System Instruction:\n${systemPrompt}` }]
    });
    messages.push(...formattedHistory);
  } else {
    const firstMsgText = formattedHistory[0].content?.[0]?.text || '';
    const updatedFirstMsg = {
      role: 'user',
      content: [{ text: `System Instruction:\n${systemPrompt}\n\nOriginal Message:\n${firstMsgText}` }]
    };
    messages.push(updatedFirstMsg);
    messages.push(...formattedHistory.slice(1));
  }
  
  messages.push({
    role: 'user',
    content: [{ text: currentMessage }]
  });
  
  return messages;
}

async function callOpenRouter(
  systemPrompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  currentMessage: string
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("OpenRouter API key is missing.");
    return null;
  }

  const openRouterMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt }
  ];

  if (history && history.length > 0) {
    for (const h of history) {
      const text = h.parts?.[0]?.text || '';
      if (text) {
        openRouterMessages.push({
          role: h.role === 'model' ? 'assistant' : 'user',
          content: text
        });
      }
    }
  }

  openRouterMessages.push({
    role: 'user',
    content: currentMessage
  });

  const models = [
    "google/gemini-2.0-flash-001",
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat",
    "openrouter/auto"
  ];

  for (const model of models) {
    try {
      console.log(`[OpenRouter Fallback] Trying model: ${model}`);
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000',
          'X-Title': 'Yuki AI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: openRouterMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[OpenRouter Fallback] Model ${model} returned error status ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply && reply.trim()) {
        console.log(`[OpenRouter Fallback] Success with model: ${model}`);
        return reply.trim();
      }
    } catch (err) {
      console.warn(`[OpenRouter Fallback] Exception for model ${model}:`, err);
    }
  }

  return null;
}

export async function continueConversation({
  message,
  chatId,
  history,
  companionName = 'Yukitha',
}: {
  message: string;
  chatId: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
  companionName?: string;
}): Promise<{ type: 'text' | 'audio' | 'image' | 'error', content: string }> {
  const systemPrompt = getSystemPrompt(companionName);

  // 1. Try Gemini first
  try {
    const messages = buildMessages(systemPrompt, history || [], message);

    const response = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      messages: messages,
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
    });

    const replyText = response.text;

    if (replyText && replyText.trim()) {
      return { type: 'text', content: replyText };
    }

    console.warn("Gemini returned empty response, attempting OpenRouter fallback...");
  } catch (error) {
    console.warn("Gemini failed, attempting OpenRouter fallback:", error);
  }

  // 2. Fallback to OpenRouter
  try {
    const openRouterReply = await callOpenRouter(systemPrompt, history || [], message);
    if (openRouterReply) {
      return { type: 'text', content: openRouterReply };
    }
  } catch (orError) {
    console.error("OpenRouter fallback also failed:", orError);
  }

  return { type: 'error', content: "My circuits are a bit fuzzy right now, could you say that again?" };
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
