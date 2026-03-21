import { randomUUID } from 'node:crypto';
import type { RequestEvent } from '@sveltejs/kit';

export const ANON_ID_COOKIE_NAME = 'anon_id';
const ANON_ID_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type OwnerScope =
  | { type: 'user'; userId: string }
  | { type: 'anonymous'; anonymousId: string };

export function ensureAnonymousId(event: RequestEvent): string {
  const existing = event.cookies.get(ANON_ID_COOKIE_NAME);
  if (existing) return existing;

  const anonymousId = randomUUID();
  event.cookies.set(ANON_ID_COOKIE_NAME, anonymousId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: event.url.protocol === 'https:',
    maxAge: ANON_ID_COOKIE_MAX_AGE_SECONDS
  });
  return anonymousId;
}

export function resolveOwnerScope(event: RequestEvent): OwnerScope {
  if (event.locals.user?.id) {
    return { type: 'user', userId: event.locals.user.id };
  }

  const anonymousId = event.locals.anonymousId ?? ensureAnonymousId(event);
  event.locals.anonymousId = anonymousId;
  return { type: 'anonymous', anonymousId };
}
