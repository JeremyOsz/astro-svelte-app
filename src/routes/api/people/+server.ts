import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/auth/require-user';
import { createPersonSchema } from '$lib/server/people-validation';
import { createPerson, listPeople } from '$lib/server/people-repository';

export const GET: RequestHandler = async (event) => {
  const auth = requireUser(event);
  if (!auth.ok) return auth.response;

  try {
    const people = await listPeople(auth.user.id);
    return json({ people });
  } catch (error) {
    console.error('Failed to list people:', error);
    return json({ error: 'Failed to load people' }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const auth = requireUser(event);
  if (!auth.ok) return auth.response;

  let payload: unknown;
  try {
    payload = await event.request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createPersonSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const person = await createPerson(auth.user.id, parsed.data);
    return json({ person }, { status: 201 });
  } catch (error) {
    console.error('Failed to create person:', error);
    return json({ error: 'Failed to create person' }, { status: 500 });
  }
};
