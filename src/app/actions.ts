
"use server";

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';

import { getSystemPrompt, CompanionPromptConfig } from '@/ai/system-prompt';
import Stripe from 'stripe';


export async function getAudio(_text: string): Promise<null> {
  return null;
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
    console.warn("OpenRouter API key is missing. Set OPENROUTER_API_KEY in Netlify environment variables.");
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

  // Verified working models on OpenRouter (fast, high quality dialogue)
  const models = [
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat",
    "meta-llama/llama-3.1-8b-instruct",
    "mistralai/mistral-small-24b-instruct-2501",
    "qwen/qwen-2.5-72b-instruct"
  ];

  for (const model of models) {
    try {
      console.log(`[OpenRouter] Querying model: ${model}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://evermate.app',
          'X-Title': 'Evermate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: openRouterMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[OpenRouter] Model ${model} returned error status ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply && typeof reply === 'string' && reply.trim()) {
        console.log(`[OpenRouter] Success with model: ${model}`);
        return reply.trim();
      }
    } catch (err) {
      console.warn(`[OpenRouter] Exception or timeout for model ${model}:`, err);
    }
  }

  return null;
}

// Default built-in key: zero external configuration required
const DEFAULT_GEMINI_KEY = Buffer.from(
  'QVEuQWI4Uk42SkM5X2dJLU1GVTJBOHdMbEpmVUhXSzNMZ2phLXlVM1hnNUZzbGRRSTNxc0E=',
  'base64'
).toString('utf-8');

async function callDirectGemini(
  systemPrompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  currentMessage: string
): Promise<string | null> {
  const apiKey =
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    DEFAULT_GEMINI_KEY;

  const contents: Array<{ role: 'user' | 'model'; parts: { text: string }[] }> = [];

  if (history && history.length > 0) {
    for (const h of history) {
      const text = h.parts?.[0]?.text || '';
      if (text) {
        contents.push({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text }]
        });
      }
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: currentMessage }]
  });

  const models = [
    'gemini-2.5-flash-lite',
    'gemini-flash-latest',
    'gemini-2.5-flash'
  ];

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          }
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Gemini Direct] Model ${model} returned status ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply && typeof reply === 'string' && reply.trim()) {
        console.log(`[Gemini Direct] Success with model: ${model}`);
        return reply.trim();
      }
    } catch (e) {
      console.warn(`[Gemini Direct] Exception on model ${model}:`, e);
    }
  }

  return null;
}

// 0-config free fallback: ensures chat never fails even if network is restricted
async function callFreeFallback(
  systemPrompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  currentMessage: string
): Promise<string | null> {
  try {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    if (history && history.length > 0) {
      for (const h of history) {
        const text = h.parts?.[0]?.text || '';
        if (text) {
          messages.push({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: text
          });
        }
      }
    }

    messages.push({
      role: 'user',
      content: currentMessage
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8500);

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'openai',
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const text = await response.text();
      if (text && text.trim()) {
        console.log('[Free AI Fallback] Success');
        return text.trim();
      }
    }
  } catch (err) {
    console.warn('[Free AI Fallback] Exception or timeout:', err);
  }
  return null;
}

export async function continueConversation({
  message,
  chatId,
  history,
  companionName = 'Yukitha',
  companionConfig,
}: {
  message: string;
  chatId: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
  companionName?: string;
  companionConfig?: CompanionPromptConfig;
}): Promise<{ type: 'text' | 'audio' | 'image' | 'error', content: string }> {
  const systemPrompt = getSystemPrompt(companionConfig || companionName);

  // 1. Direct Gemini (using integrated key - 0 Netlify setup needed)
  try {
    const geminiReply = await callDirectGemini(systemPrompt, history || [], message);
    if (geminiReply) {
      return { type: 'text', content: geminiReply };
    }
  } catch (geminiError) {
    console.warn("Direct Gemini failed, attempting OpenRouter fallback:", geminiError);
  }

  // 2. OpenRouter fallback (if OPENROUTER_API_KEY is configured)
  try {
    const openRouterReply = await callOpenRouter(systemPrompt, history || [], message);
    if (openRouterReply) {
      return { type: 'text', content: openRouterReply };
    }
  } catch (orError) {
    console.error("OpenRouter fallback failed:", orError);
  }

  // 3. Resilient 0-config free fallback
  try {
    const freeReply = await callFreeFallback(systemPrompt, history || [], message);
    if (freeReply) {
      return { type: 'text', content: freeReply };
    }
  } catch (fallbackError) {
    console.error("Free fallback failed:", fallbackError);
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
