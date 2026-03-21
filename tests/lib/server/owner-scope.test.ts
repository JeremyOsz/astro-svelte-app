import { describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { ANON_ID_COOKIE_NAME, ensureAnonymousId, resolveOwnerScope } from '$lib/server/auth/owner-scope';

function createEvent(overrides: Partial<RequestEvent> = {}): RequestEvent {
  const cookies: Record<string, string> = {};
  const event = {
    url: new URL('http://localhost:5173/chart'),
    cookies: {
      get: vi.fn((name: string) => cookies[name]),
      set: vi.fn((name: string, value: string) => {
        cookies[name] = value;
      })
    },
    locals: {
      supabase: null,
      safeGetSession: async () => ({ session: null, user: null }),
      session: null,
      user: null,
      anonymousId: null
    },
    ...overrides
  } as unknown as RequestEvent;

  return event;
}

describe('owner scope', () => {
  it('returns user scope when authenticated', () => {
    const event = createEvent({
      locals: {
        supabase: null,
        safeGetSession: async () => ({ session: null, user: null }),
        session: null,
        user: { id: 'user-123' } as RequestEvent['locals']['user'],
        anonymousId: null
      }
    });

    const owner = resolveOwnerScope(event);
    expect(owner).toEqual({ type: 'user', userId: 'user-123' });
  });

  it('creates and stores anon cookie when signed out', () => {
    const event = createEvent();
    const anonId = ensureAnonymousId(event);

    expect(anonId).toBeTruthy();
    expect(event.cookies.set).toHaveBeenCalledWith(
      ANON_ID_COOKIE_NAME,
      anonId,
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
      })
    );
  });

  it('returns anonymous scope for signed-out user', () => {
    const event = createEvent();
    const owner = resolveOwnerScope(event);

    expect(owner.type).toBe('anonymous');
    if (owner.type !== 'anonymous') return;
    expect(owner.anonymousId).toBeTruthy();
  });
});
