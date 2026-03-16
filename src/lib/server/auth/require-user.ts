import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function requireUser(event: RequestEvent) {
  if (!event.locals.user) {
    return {
      ok: false as const,
      response: json({ error: 'Authentication required' }, { status: 401 })
    };
  }

  return {
    ok: true as const,
    user: event.locals.user
  };
}
