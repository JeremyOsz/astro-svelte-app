<script lang="ts">
  import { goto } from '$app/navigation';
  import { getSupabaseBrowserClient } from '$lib/supabase/client';

  let email = '';
  let password = '';
  let error = '';
  let message = '';
  let loading = false;

  async function signUp() {
    loading = true;
    error = '';
    message = '';

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/chart`;

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (signupError) throw signupError;

      if (data.user && !data.session) {
        message = 'Check your email to confirm your account, then sign in.';
      } else {
        await goto('/chart');
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to create account';
    } finally {
      loading = false;
    }
  }

  async function signUpWithGoogle() {
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
      error = err instanceof Error ? err.message : 'Unable to start Google sign-up';
      loading = false;
    }
  }
</script>

<div class="mx-auto max-w-md px-4 py-12">
  <h1 class="text-3xl font-semibold text-foreground mb-2">Create Account</h1>
  <p class="text-muted-foreground mb-8">Create an account to persist your people in Supabase.</p>

  <form class="space-y-4" on:submit|preventDefault={signUp}>
    <div>
      <label for="email" class="block text-sm font-medium mb-1">Email</label>
      <input id="email" type="email" bind:value={email} required class="w-full rounded-md border border-input bg-background px-3 py-2" />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium mb-1">Password</label>
      <input id="password" type="password" bind:value={password} minlength="8" required class="w-full rounded-md border border-input bg-background px-3 py-2" />
    </div>

    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}

    {#if message}
      <p class="text-sm text-emerald-600">{message}</p>
    {/if}

    <button type="submit" disabled={loading} class="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">
      {loading ? 'Creating account...' : 'Create account'}
    </button>

    <button type="button" on:click={signUpWithGoogle} disabled={loading} class="w-full rounded-md border border-input px-4 py-2 text-foreground disabled:opacity-50">
      Continue with Google
    </button>
  </form>

  <p class="mt-6 text-sm text-muted-foreground">
    Already have an account?
    <a class="text-foreground underline" href="/login">Sign in</a>
  </p>
</div>
