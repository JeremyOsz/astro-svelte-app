import { describe, expect, it } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth/require-user';

function mockEvent(user: RequestEvent['locals']['user']): RequestEvent {
  return {
    locals: {
      supabase: null,
      safeGetSession: async () => ({ session: null, user: null }),
      session: null,
      user,
      anonymousId: null
    }
  } as RequestEvent;
}

describe('requireUser', () => {
  it('returns unauthorized response when no user', async () => {
    const result = requireUser(mockEvent(null));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(401);
  });

  it('returns user when authenticated', () => {
    const user = { id: 'user-123' } as RequestEvent['locals']['user'];
    const result = requireUser(mockEvent(user));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.user.id).toBe('user-123');
  });
});
