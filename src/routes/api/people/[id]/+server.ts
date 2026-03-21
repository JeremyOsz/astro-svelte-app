import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { resolveOwnerScope } from '$lib/server/auth/owner-scope';
import { deletePerson, updatePerson } from '$lib/server/people-repository';
import { updatePersonSchema } from '$lib/server/people-validation';

export const PATCH: RequestHandler = async (event) => {
  const owner = resolveOwnerScope(event);

  let payload: unknown;
  try {
    payload = await event.request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updatePersonSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const person = await updatePerson(owner, event.params.id, parsed.data);
    if (!person) {
      return json({ error: 'Person not found' }, { status: 404 });
    }

    return json({ person });
  } catch (error) {
    console.error('Failed to update person:', error);
    return json({ error: 'Failed to update person' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const owner = resolveOwnerScope(event);

  try {
    const removed = await deletePerson(owner, event.params.id);
    if (!removed) {
      return json({ error: 'Person not found' }, { status: 404 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Failed to delete person:', error);
    return json({ error: 'Failed to delete person' }, { status: 500 });
  }
};
