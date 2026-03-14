<script lang="ts">
  import { cn } from '$lib/utils';
  import {
    TAROT_QUESTION_THEMES,
    getRandomQuestion,
    type TarotQuestionTheme,
    type TarotQuestionThemeId
  } from '$lib/data/tarot-questions';

  interface Props {
    /** Compact layout for embedding in modals */
    compact?: boolean;
    /** Optional class for the root element */
    class?: string;
  }

  let { compact = false, class: className = '' }: Props = $props();

  let selectedThemeId = $state<TarotQuestionThemeId | 'all'>('all');
  let currentQuestion = $state<string | null>(null);
  let currentTheme = $state<TarotQuestionTheme | null>(null);
  let showAllForTheme = $state(false);

  const themeOptions = [
    { value: 'all' as const, label: 'All themes' },
    ...TAROT_QUESTION_THEMES.map((t) => ({ value: t.id as TarotQuestionThemeId, label: t.name }))
  ];

  function pickRandom() {
    const result = getRandomQuestion(selectedThemeId === 'all' ? undefined : selectedThemeId);
    if (result) {
      currentQuestion = result.question;
      currentTheme = result.theme;
      showAllForTheme = false;
    }
  }

  function getQuestionsForSelectedTheme(): string[] {
    if (selectedThemeId === 'all') return [];
    const theme = TAROT_QUESTION_THEMES.find((t) => t.id === selectedThemeId);
    return theme ? [...theme.questions] : [];
  }

  const questionsList = $derived(getQuestionsForSelectedTheme());
</script>

<div class={cn('rounded-lg border border-border bg-card p-4 shadow-sm', compact && 'p-3', className)}>
  <div class="mb-3 flex flex-wrap items-center gap-2">
    <label for="tarot-theme-select" class="text-sm font-medium text-muted-foreground">Theme</label>
    <select
      id="tarot-theme-select"
      bind:value={selectedThemeId}
      class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
      aria-label="Select question theme"
    >
      {#each themeOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
    <button
      type="button"
      onclick={pickRandom}
      class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
    >
      Pick random question
    </button>
    {#if selectedThemeId !== 'all'}
      <button
        type="button"
        onclick={() => (showAllForTheme = !showAllForTheme)}
        class="rounded-md border border-input bg-secondary px-3 py-2 text-sm text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        {showAllForTheme ? 'Hide list' : 'Show all in theme'}
      </button>
    {/if}
  </div>

  {#if currentQuestion}
    <div class="rounded-md bg-muted/80 dark:bg-primary/15 p-3 text-card-foreground">
      {#if currentTheme && !compact}
        <p class="mb-1 text-xs font-medium uppercase tracking-wide text-primary">{currentTheme.name}</p>
      {/if}
      <p class="text-sm font-medium leading-relaxed">{currentQuestion}</p>
    </div>
  {/if}

  {#if showAllForTheme && questionsList.length > 0}
    <ul class="mt-3 max-h-48 list-inside list-disc space-y-1 overflow-y-auto text-sm text-muted-foreground">
      {#each questionsList as q}
        <li>{q}</li>
      {/each}
    </ul>
  {/if}

  {#if !currentQuestion && !showAllForTheme}
    <p class="text-sm text-muted-foreground">Choose a theme and click “Pick random question” to get a question for your single-card pull.</p>
  {/if}
</div>
