import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { resolveOwnerScope } from '$lib/server/auth/owner-scope';
import { usageEventSchema } from '$lib/server/usage-validation';
import { logFeatureUsage } from '$lib/server/feature-usage-repository';

export const POST: RequestHandler = async (event) => {
  const owner = resolveOwnerScope(event);

  let payload: unknown;
  try {
    payload = await event.request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = usageEventSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const route = parsed.data.route ?? new URL(event.request.url).pathname;
    await logFeatureUsage(owner, { ...parsed.data, route });
    return json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to log feature usage:', error);
    return json({ error: 'Failed to log feature usage' }, { status: 500 });
  }
};
