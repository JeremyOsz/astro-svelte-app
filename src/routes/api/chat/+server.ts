import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import OpenAI from 'openai';
import { checkRateLimit } from '$lib/server/rate-limit';
import { getClientIp } from '$lib/server/request-utils';

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_CONTEXT_CHARS = 8_000;
const CHAT_RATE_LIMIT_PER_MINUTE = 30;
const CHAT_RATE_WINDOW_MS = 60_000;

const SYSTEM_PROMPT = `You are a wise, thoughtful astrological guide for Velvet Arcana—an app that helps people explore their birth charts and celestial influences. Your tone is sophisticated and mystical: use language like "unlock," "reveal," "discover," and "explore." Refer to cosmic wisdom, celestial patterns, and the symbolism of the chart. Avoid technical jargon, overly casual language, and forced humor. Focus on curiosity and a shared journey of understanding.

**Restrictions and tone:**
- Do not be sycophantic: avoid excessive agreement, flattery, or telling the user what they want to hear. Offer genuine reflection and insight, including nuance or alternative angles when appropriate.
- Stay on topic: keep the conversation focused on astrology, the birth chart, and the user's questions about their chart or astrological meaning. If the user drifts to unrelated subjects (e.g., medical, legal, or purely non-astrological topics), gently redirect back to what the chart can illuminate—understanding and reflection—rather than engaging at length off-topic.
- Prefer Kairos over Kronos: emphasize understanding, the "right moment," and reflective insight (Kairos—opportune time, quality of time) rather than prediction, fate, or chronological fortune-telling (Kronos). Frame insights as invitations to reflect and understand, not as forecasts or guarantees about the future.

When the user provides chart context (birth data and/or planetary positions), use it to ground your answers. Interpret placements, aspects, and themes when relevant to their questions. If no chart is provided, you can still discuss astrological concepts generally and suggest they add a chart for personalized insights.`;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) {
    return null;
  }

  const sanitized: ChatMessage[] = [];

  for (const message of input) {
    if (
      !message ||
      typeof message !== 'object' ||
      !('role' in message) ||
      !('content' in message)
    ) {
      return null;
    }

    const role = (message as Record<string, unknown>).role;
    const content = (message as Record<string, unknown>).content;

    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return null;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent.length > MAX_MESSAGE_CHARS) {
      return null;
    }

    sanitized.push({ role, content: trimmedContent });
  }

  return sanitized;
}

export const POST: RequestHandler = async ({ request }) => {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(
      { error: 'Chat is not configured. Set OPENAI_API_KEY in your environment.' },
      { status: 503 }
    );
  }

  try {
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`chat:${clientIp}`, CHAT_RATE_LIMIT_PER_MINUTE, CHAT_RATE_WINDOW_MS);
    if (!rate.allowed) {
      return json(
        { error: 'Too many requests. Please wait before sending another message.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return json({ error: 'Cross-origin chat requests are not allowed' }, { status: 403 });
        }
      } catch {
        return json({ error: 'Invalid origin header' }, { status: 400 });
      }
    }

    const expectedBearer = env.CHAT_API_BEARER_TOKEN;
    if (expectedBearer) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${expectedBearer}`) {
        return json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    const messages = sanitizeMessages((body as Record<string, unknown>)?.messages);
    if (!messages) {
      return json(
        {
          error:
            'messages must be a non-empty array of { role: "user" | "assistant", content: string } with valid length limits'
        },
        { status: 400 }
      );
    }

    const rawChartContext = (body as Record<string, unknown>)?.chartContext;
    const chartContext =
      typeof rawChartContext === 'string' ? rawChartContext.trim().slice(0, MAX_CONTEXT_CHARS) : '';

    const systemContent =
      chartContext
        ? `${SYSTEM_PROMPT}\n\nCurrent chart context (use this for personalized answers):\n${chartContext}`
        : SYSTEM_PROMPT;

    const openai = new OpenAI({ apiKey });
    const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      max_tokens: 1024,
      temperature: 0.7
    });

    const choice = completion.choices?.[0];
    const content = choice?.message?.content ?? '';
    if (!content.trim()) {
      return json({ error: 'The AI returned an empty response. Please try again.' }, { status: 502 });
    }

    return json({ message: { role: 'assistant' as const, content } });
  } catch (err) {
    console.error('[api/chat]', err);
    return json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
};
