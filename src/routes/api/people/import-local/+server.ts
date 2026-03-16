import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/auth/require-user';
import { importPeopleSchema } from '$lib/server/people-validation';
import { importPeople } from '$lib/server/people-repository';

export const POST: RequestHandler = async (event) => {
  const auth = requireUser(event);
  if (!auth.ok) return auth.response;

  let payload: unknown;
  try {
    payload = await event.request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = importPeopleSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await importPeople(auth.user.id, parsed.data.people);
    return json(result);
  } catch (error) {
    console.error('Failed to import local people:', error);
    return json({ error: 'Failed to import local people' }, { status: 500 });
  }
};
