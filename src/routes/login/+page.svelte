<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { GOOGLE_OAUTH_AVAILABLE, LOGIN_TEMPORARILY_UNAVAILABLE } from '$lib/auth/oauth-config';
  import { getSupabaseBrowserClient } from '$lib/supabase/client';
  import { authStore } from '$lib/stores/auth-store';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function loginWithPassword() {
    if (LOGIN_TEMPORARILY_UNAVAILABLE) return;

    loading = true;
    error = '';

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      await goto('/chart');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to sign in';
    } finally {
      loading = false;
    }
  }

  async function loginWithGoogle() {
    if (!GOOGLE_OAUTH_AVAILABLE || LOGIN_TEMPORARILY_UNAVAILABLE) return;

    loading = true;
    error = '';

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/chart`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo }
      });

      if (oauthError) throw oauthError;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to start Google sign-in';
      loading = false;
    }
  }

  $: queryError = $page.url.searchParams.get('error');
  $: if (queryError && !error) {
    error = 'Authentication failed. Please try again.';
  }

  onMount(() => {
    if (!browser) return;
    const unsubscribe = authStore.subscribe((auth) => {
      if (auth.user) {
        void goto('/chart');
      }
    });
    return unsubscribe;
  });
</script>

<div class="mx-auto max-w-md px-4 py-12">
  <h1 class="text-3xl font-semibold text-foreground mb-2">Sign In</h1>
  <p class="text-muted-foreground mb-8">Sign in to save and manage your people across devices.</p>

  {#if LOGIN_TEMPORARILY_UNAVAILABLE}
    <div role="status" class="mb-6 rounded-md border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm">
      <p class="font-medium text-foreground">Sign-in is temporarily unavailable</p>
      <p class="mt-1 text-muted-foreground">
        Session storage saving is enabled—you can keep using the chart; your work is saved in this browser session.
      </p>
    </div>
  {/if}

  <form
    class="space-y-4"
    on:submit|preventDefault={loginWithPassword}
  >
    <div>
      <label for="email" class="block text-sm font-medium mb-1">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        disabled={LOGIN_TEMPORARILY_UNAVAILABLE}
        class="w-full rounded-md border border-input bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium mb-1">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        disabled={LOGIN_TEMPORARILY_UNAVAILABLE}
        class="w-full rounded-md border border-input bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>

    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}

    <button
      type="submit"
      disabled={loading || LOGIN_TEMPORARILY_UNAVAILABLE}
      class="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
    >
      {loading ? 'Signing in...' : 'Sign in'}
    </button>

    <div class="space-y-2">
      <button
        type="button"
        on:click={loginWithGoogle}
        disabled={loading || !GOOGLE_OAUTH_AVAILABLE || LOGIN_TEMPORARILY_UNAVAILABLE}
        class="w-full rounded-md border border-input px-4 py-2 text-foreground disabled:opacity-50"
        aria-disabled={!GOOGLE_OAUTH_AVAILABLE || LOGIN_TEMPORARILY_UNAVAILABLE}
      >
        Continue with Google
      </button>
      {#if !GOOGLE_OAUTH_AVAILABLE && !LOGIN_TEMPORARILY_UNAVAILABLE}
        <p class="text-center text-xs text-muted-foreground">Google sign-in is not available at the moment. Use email and password instead.</p>
      {/if}
    </div>
  </form>

  <p class="mt-6 text-sm text-muted-foreground">
    Don&apos;t have an account?
    <a class="text-foreground underline" href="/signup">Create one</a>
  </p>
</div>
