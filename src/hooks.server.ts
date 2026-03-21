import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';
import { ensureAnonymousId } from '$lib/server/auth/owner-scope';

const hasSupabaseConfig = Boolean(env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_ANON_KEY);

export const handle: Handle = async ({ event, resolve }) => {
  if (!hasSupabaseConfig) {
    event.locals.supabase = null;
    event.locals.session = null;
    event.locals.user = null;
    event.locals.anonymousId = ensureAnonymousId(event);
    event.locals.safeGetSession = async () => ({ session: null, user: null });
    return resolve(event);
  }

  event.locals.supabase = createServerClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return event.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, {
            ...options,
            path: '/'
          });
        });
      }
    }
  });

  event.locals.safeGetSession = async () => {
    if (!event.locals.supabase) {
      return { session: null, user: null };
    }

    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();

    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser();

    if (error || !user) {
      return { session: null, user: null };
    }

    return { session, user };
  };

  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;
  event.locals.anonymousId = user ? null : ensureAnonymousId(event);

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};
