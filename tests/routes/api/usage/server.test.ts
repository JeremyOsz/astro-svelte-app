import { beforeEach, describe, expect, it, vi } from 'vitest';

const logFeatureUsageMock = vi.fn();

vi.mock('$lib/server/feature-usage-repository', () => ({
  logFeatureUsage: logFeatureUsageMock
}));

describe('/api/usage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('logs valid usage event', async () => {
    const { POST } = await import('../../../../src/routes/api/usage/+server');

    const request = new Request('http://localhost:5173/api/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature: 'chart',
        action: 'save',
        route: '/chart',
        metadata: { chartId: '123' }
      })
    });

    const response = await POST({
      request,
      url: new URL(request.url),
      locals: {
        supabase: null,
        safeGetSession: async () => ({ session: null, user: null }),
        session: null,
        user: null,
        anonymousId: 'anon-123'
      },
      cookies: { get: vi.fn(), set: vi.fn() }
    } as any);

    expect(response.status).toBe(201);
    expect(logFeatureUsageMock).toHaveBeenCalledWith(
      { type: 'anonymous', anonymousId: 'anon-123' },
      expect.objectContaining({
        feature: 'chart',
        action: 'save'
      })
    );
  });

  it('returns 400 for invalid payload', async () => {
    const { POST } = await import('../../../../src/routes/api/usage/+server');

    const request = new Request('http://localhost:5173/api/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature: 'invalid',
        action: 'save'
      })
    });

    const response = await POST({
      request,
      url: new URL(request.url),
      locals: {
        supabase: null,
        safeGetSession: async () => ({ session: null, user: null }),
        session: null,
        user: null,
        anonymousId: 'anon-123'
      },
      cookies: { get: vi.fn(), set: vi.fn() }
    } as any);

    expect(response.status).toBe(400);
    expect(logFeatureUsageMock).not.toHaveBeenCalled();
  });
});
