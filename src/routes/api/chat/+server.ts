import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import OpenAI from 'openai';
import { checkRateLimit } from '$lib/server/rate-limit';
import { getClientIp } from '$lib/server/request-utils';

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_CONTEXT_CHARS = 8_000;
const CHAT_RATE_LIMIT_PER_MINUTE = 30;
const CHAT_RATE_WINDOW_MS = 60_000;
const PASSCODE_PATTERN = /^\d{8}$/;

const CHAT_FEATURE_ENABLED = publicEnv.PUBLIC_ENABLE_AI_CHAT === 'true';

const SYSTEM_PROMPT = `You are a wise, thoughtful guide for Velvet Arcana—an app that helps people explore birth charts, celestial influences, and astrology-informed page insights. Your tone is sophisticated and reflective. Use clear language rooted in patterns, symbolism, and interpretation. Avoid technical jargon, overly casual language, and forced humor.

**Restrictions and tone:**
- Do not be sycophantic: avoid excessive agreement, flattery, or telling the user what they want to hear. Offer genuine reflection and insight, including nuance or alternative angles when appropriate.
- Stay on topic: keep the conversation focused on the page context provided by the app, especially astrology, chart interpretation, and astrology-informed page analysis. If the user drifts to unrelated subjects (e.g., medical, legal, or general financial advice), gently redirect back to reflective interpretation rather than engaging at length off-topic.
- Prefer Kairos over Kronos: emphasize understanding, the "right moment," and reflective insight (Kairos—opportune time, quality of time) rather than prediction, fate, or chronological fortune-telling (Kronos). Frame insights as invitations to reflect and understand, not as forecasts or guarantees about the future.
- If the page context includes markets or performance data, treat it as descriptive context for pattern analysis, not a basis for financial recommendations.

When the user provides page context (such as chart details, planetary positions, timeline summaries, or market-cosmos insights), use it to ground your answers. If context is missing, answer generally and invite the user to ask from a page with loaded data for a more grounded interpretation.`;

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
  if (!CHAT_FEATURE_ENABLED) {
    return json({ error: 'Chat is currently disabled.' }, { status: 404 });
  }

  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(
      { error: 'Chat is not configured. Set OPENAI_API_KEY in your environment.' },
      { status: 503 }
    );
  }

  try {
    const expectedPasscode = env.CHAT_ACCESS_PASSCODE?.trim();
    if (expectedPasscode) {
      if (!PASSCODE_PATTERN.test(expectedPasscode)) {
        console.error('[api/chat] Invalid CHAT_ACCESS_PASSCODE configuration');
        return json({ error: 'Chat is unavailable due to server configuration.' }, { status: 503 });
      }

      const providedPasscode = request.headers.get('x-chat-passcode')?.trim();
      if (!providedPasscode || !PASSCODE_PATTERN.test(providedPasscode)) {
        return json({ error: 'Chat passcode required.' }, { status: 401 });
      }

      if (providedPasscode !== expectedPasscode) {
        return json({ error: 'Invalid chat passcode.' }, { status: 403 });
      }
    }

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

    const rawContext =
      (body as Record<string, unknown>)?.pageContext ?? (body as Record<string, unknown>)?.chartContext;
    const pageContext =
      typeof rawContext === 'string' ? rawContext.trim().slice(0, MAX_CONTEXT_CHARS) : '';

    const systemContent =
      pageContext
        ? `${SYSTEM_PROMPT}\n\nCurrent page context (use this to ground your answer):\n${pageContext}`
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
