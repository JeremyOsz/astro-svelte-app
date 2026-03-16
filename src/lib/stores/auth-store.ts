import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '$lib/supabase/client';

type AuthState = {
  session: Session | null;
  user: User | null;
  initialized: boolean;
};

const initialState: AuthState = {
  session: null,
  user: null,
  initialized: false
};

const { subscribe, set, update } = writable<AuthState>(initialState);

let started = false;

async function syncFromClientSession() {
  if (!browser) return;

  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    update((state) => ({
      ...state,
      session,
      user: session?.user ?? null,
      initialized: true
    }));
  } catch {
    update((state) => ({ ...state, initialized: true }));
  }
}

function initialize(session: Session | null, user: User | null) {
  set({ session, user, initialized: true });

  if (!browser || started) return;

  started = true;

  try {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
      set({
        session: nextSession,
        user: nextSession?.user ?? null,
        initialized: true
      });
    });

    void syncFromClientSession();
  } catch {
    // Supabase not configured; keep server-provided state.
  }
}

async function signOut() {
  if (!browser) return;
  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();
}

export const authStore = {
  subscribe,
  initialize,
  signOut
};
