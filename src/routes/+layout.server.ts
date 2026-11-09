import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session, user } = locals;

  return {
    session,
    user
  };
};
