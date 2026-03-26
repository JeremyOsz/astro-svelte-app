import { beforeEach, describe, expect, it, vi } from 'vitest';

const createMock = vi.fn();

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: createMock
        }
      };
    }
  };
});

const loadRoute = async (apiKey: string) => {
  vi.doMock('$env/dynamic/private', () => ({
    env: {
      OPENAI_API_KEY: apiKey
    }
  }));
  vi.doMock('$env/dynamic/public', () => ({
    env: {
      PUBLIC_ENABLE_AI_CHAT: 'true'
    }
  }));
  const mod = await import('../../../../src/routes/api/chat/+server');
  return mod.POST;
};

const loadRouteWithEnv = async (envOverrides: Record<string, string>) => {
  vi.doMock('$env/dynamic/private', () => ({
    env: {
      OPENAI_API_KEY: 'test-key',
      ...envOverrides
    }
  }));
  vi.doMock('$env/dynamic/public', () => ({
    env: {
      PUBLIC_ENABLE_AI_CHAT: 'true'
    }
  }));
  const mod = await import('../../../../src/routes/api/chat/+server');
  return mod.POST;
};

describe('/api/chat', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns 503 when OPENAI_API_KEY is missing', async () => {
    const POST = await loadRoute('');
    const request = new Request('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toContain('OPENAI_API_KEY');
  });

  it('returns 400 for invalid messages payload', async () => {
    const POST = await loadRoute('test-key');
    const request = new Request('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'system', content: 'bad role' }] })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('messages must be a non-empty array');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('calls OpenAI and returns assistant message', async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: 'Cosmic response' } }]
    });

    const POST = await loadRoute('test-key');
    const request = new Request('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chartContext: 'Sun in Aries',
        messages: [{ role: 'user', content: 'What does this mean?' }]
      })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toEqual({
      role: 'assistant',
      content: 'Cosmic response'
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini',
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user', content: 'What does this mean?' })
        ])
      })
    );
  });

  it('accepts pageContext as a generic context alias', async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: 'Grounded response' } }]
    });

    const POST = await loadRoute('test-key');
    const request = new Request('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageContext: 'Page: Market Cosmos\nTop movers: ^GSPC +1.20%',
        messages: [{ role: 'user', content: 'What stands out?' }]
      })
    });

    const response = await POST({ request } as any);

    expect(response.status).toBe(200);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('Current page context')
          })
        ])
      })
    );
  });

  it('requires a matching 8-digit passcode when configured', async () => {
    const POST = await loadRouteWithEnv({ CHAT_ACCESS_PASSCODE: '12345678' });
    const request = new Request('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }]
      })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('passcode');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('rejects an incorrect passcode', async () => {
    const POST = await loadRouteWithEnv({ CHAT_ACCESS_PASSCODE: '12345678' });
    const request = new Request('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-chat-passcode': '87654321'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }]
      })
    });

    const response = await POST({ request } as any);

    expect(response.status).toBe(403);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('allows chat with the correct passcode', async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: 'Protected response' } }]
    });

    const POST = await loadRouteWithEnv({ CHAT_ACCESS_PASSCODE: '12345678' });
    const request = new Request('http://localhost:5173/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-chat-passcode': '12345678'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }]
      })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message.content).toBe('Protected response');
  });
});
