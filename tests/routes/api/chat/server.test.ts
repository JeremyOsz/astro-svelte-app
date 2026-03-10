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
});
