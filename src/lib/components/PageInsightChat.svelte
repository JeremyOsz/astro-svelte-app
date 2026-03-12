<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';

  type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
  };

  interface Props {
    title?: string;
    description?: string;
    contextSummary: string;
    suggestions?: string[];
    featuredPromptLabel?: string;
    featuredPrompt?: string;
  }

  let {
    title = 'Ask about this page',
    description = 'Chat with the current page insights as context.',
    contextSummary,
    suggestions = [],
    featuredPromptLabel,
    featuredPrompt
  }: Props = $props();

  let messages = $state<ChatMessage[]>([]);
  let draft = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);
  let passcode = $state('');
  let passcodeError = $state<string | null>(null);
  let unlocked = $state(false);

  const SESSION_STORAGE_KEY = 'chat-access-passcode';
  const PASSCODE_PATTERN = /^\d{8}$/;

  onMount(() => {
    const storedPasscode = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (storedPasscode && PASSCODE_PATTERN.test(storedPasscode)) {
      passcode = storedPasscode;
      unlocked = true;
    }
  });

  function unlockChat() {
    const nextPasscode = passcode.trim();
    if (!PASSCODE_PATTERN.test(nextPasscode)) {
      passcodeError = 'Enter the 8-digit chat passcode.';
      unlocked = false;
      return;
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, nextPasscode);
    passcode = nextPasscode;
    passcodeError = null;
    unlocked = true;
  }

  function lockChat() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    unlocked = false;
    passcode = '';
    passcodeError = null;
  }

  async function sendMessage(messageText?: string) {
    const content = (messageText ?? draft).trim();
    if (!content || loading) return;

    if (!PASSCODE_PATTERN.test(passcode)) {
      passcodeError = 'Enter the 8-digit chat passcode.';
      unlocked = false;
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    messages = nextMessages;
    draft = '';
    error = null;
    loading = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-chat-passcode': passcode
        },
        body: JSON.stringify({
          pageContext: contextSummary,
          messages: nextMessages
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          unlocked = false;
          passcodeError = payload?.error || 'Invalid chat passcode.';
        }
        throw new Error(payload?.error || 'Failed to send message');
      }

      messages = [...nextMessages, payload.message];
    } catch (err) {
      messages = nextMessages;
      error = err instanceof Error ? err.message : 'Failed to send message';
    } finally {
      loading = false;
    }
  }

  function useSuggestion(suggestion: string) {
    draft = suggestion;
  }

  async function runFeaturedPrompt() {
    if (!featuredPrompt) return;

    if (!unlocked) {
      draft = featuredPrompt;
      passcodeError = 'Unlock chat to run the AI interpretation.';
      return;
    }

    passcodeError = null;
    await sendMessage(featuredPrompt);
  }
</script>

<Card.Root class="border-border/70 bg-card/95 shadow-sm">
  <Card.Header>
    <Card.Title>{title}</Card.Title>
    <Card.Description>{description}</Card.Description>
  </Card.Header>

  <Card.Content class="space-y-4">
    {#if featuredPrompt && featuredPromptLabel}
      <div class="rounded-xl border border-primary/20 bg-primary/5 p-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-foreground">{featuredPromptLabel}</p>
            <p class="text-xs text-muted-foreground">
              Sends a ready-made interpretation request using the current page context.
            </p>
          </div>
          <Button type="button" onclick={runFeaturedPrompt} disabled={loading}>
            Run Interpretation
          </Button>
        </div>
      </div>
    {/if}

    <div class="rounded-xl border border-border/70 bg-muted/20 p-3">
      <div class="flex flex-wrap items-end gap-3">
        <div class="min-w-[220px] flex-1">
          <label for="chat-passcode" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Chat Passcode
          </label>
          <Input
            id="chat-passcode"
            bind:value={passcode}
            inputmode="numeric"
            pattern="\d{8}"
            maxlength={8}
            placeholder="8 digits"
            disabled={loading}
          />
        </div>
        <Button type="button" onclick={unlockChat} disabled={loading}>
          {unlocked ? 'Update Passcode' : 'Unlock Chat'}
        </Button>
        {#if unlocked}
          <Button type="button" variant="outline" onclick={lockChat} disabled={loading}>
            Lock
          </Button>
        {/if}
      </div>

      <p class="mt-2 text-xs text-muted-foreground">
        Required before any message is sent. Stored in this browser session only.
      </p>

      {#if passcodeError}
        <p class="mt-2 text-sm text-destructive">{passcodeError}</p>
      {/if}
    </div>

    {#if suggestions.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each suggestions as suggestion}
          <button
            type="button"
            class="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onclick={() => useSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        {/each}
      </div>
    {/if}

    <div class="max-h-96 space-y-3 overflow-y-auto rounded-xl border border-border/70 bg-muted/20 p-3">
      {#if messages.length === 0}
        <p class="text-sm text-muted-foreground">
          {#if unlocked}
            Ask about the visible page patterns. The assistant receives a compact summary of this page state.
          {:else}
            Unlock chat with the 8-digit passcode to start sending messages.
          {/if}
        </p>
      {:else}
        {#each messages as message}
          <div class={`rounded-xl px-3 py-2 text-sm ${message.role === 'user' ? 'ml-6 bg-primary text-primary-foreground' : 'mr-6 bg-card text-foreground border border-border/60'}`}>
            <p class="whitespace-pre-wrap">{message.content}</p>
          </div>
        {/each}
      {/if}

      {#if loading}
        <div class="mr-6 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-muted-foreground">
          Thinking...
        </div>
      {/if}
    </div>

    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}

    <form
      class="space-y-3"
      onsubmit={(event) => {
        event.preventDefault();
        sendMessage();
      }}
    >
      <textarea
        bind:value={draft}
        rows="4"
        class="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Ask about what stands out on this page..."
      ></textarea>

      <div class="flex items-center justify-between gap-3">
        <p class="text-xs text-muted-foreground">Model: gpt-4o-mini. Context: current page insights.</p>
        <Button type="submit" disabled={loading || !draft.trim() || !unlocked}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  </Card.Content>
</Card.Root>
