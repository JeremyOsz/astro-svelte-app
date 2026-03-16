import { browser } from '$app/environment';
import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!browser) {
    throw new Error('Supabase browser client can only be used in the browser');
  }

  if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase public env vars are not configured');
  }

  if (!client) {
    client = createBrowserClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);
  }

  return client;
}
