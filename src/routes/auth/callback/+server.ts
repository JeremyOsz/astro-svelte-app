import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.supabase) {
    throw redirect(303, '/login?error=auth_not_configured');
  }

  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/chart';

  if (code) {
    const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw redirect(303, '/login?error=oauth_exchange_failed');
    }
  }

  throw redirect(303, next);
};
