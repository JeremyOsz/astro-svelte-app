<script lang="ts">
  import { onMount } from 'svelte';
  import PoeticBirthForm from '$lib/components/poetic/PoeticBirthForm.svelte';
  import PoeticChartReading from '$lib/components/poetic/PoeticChartReading.svelte';
  import { chartStore, type BirthData } from '$lib/stores/chart-store';
  import { logFeatureUsage } from '$lib/services/usage-logger';

  let localLoading = false;
  let localError: string | null = null;

  $: chartData = $chartStore.chartData;
  $: birthData = $chartStore.birthData;
  $: loading = localLoading || $chartStore.isLoading;
  $: displayError = localError || $chartStore.error;

  onMount(async () => {
    void logFeatureUsage({
      feature: 'chart',
      action: 'page_open',
      route: '/poetic/chart',
      metadata: { variant: 'poetic' }
    });

    const loadedFromURL = await chartStore.loadFromURL();
    if (loadedFromURL && $chartStore.birthData && !$chartStore.chartData) {
      await generateChartFromBirthData($chartStore.birthData);
    }
  });

  function readActionData(result: any) {
    if (!result?.data) return {};

    if (typeof result.data === 'string') {
      try {
        const parsed = JSON.parse(result.data);
        if (Array.isArray(parsed)) {
          let parsedChartData: string | undefined;
          let parsedBirthData: BirthData | undefined;

          for (const item of parsed) {
            if (typeof item === 'string' && item.includes('\n')) parsedChartData = item;
            if (typeof item === 'object' && item?.date && item?.time) parsedBirthData = item;
          }

          return {
            chartData: parsedChartData,
            birthData: parsedBirthData
          };
        }
      } catch (error) {
        console.error('Failed to parse poetic chart action data:', error);
      }
    }

    return result.data;
  }

  async function generateChartFromBirthData(data: BirthData) {
    localLoading = true;
    localError = null;
    chartStore.setLoading(true);

    try {
      const cityData = {
        name: data.place.split(',')[0],
        fullLocation: data.place,
        lat: data.latitude,
        lng: data.longitude,
        country: '',
        adminName: ''
      };
      const formData = new FormData();
      formData.set('poetic_birthDate', data.date);
      formData.set('poetic_birthTime', data.time);
      formData.set('poetic_cityData', JSON.stringify(cityData));

      const response = await fetch('/poetic/chart?/calculate', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      const actionData = readActionData(result);

      if (actionData.chartData) {
        chartStore.setChartData(String(actionData.chartData), (actionData.birthData as BirthData) || data);
      } else {
        localError = String(actionData.error || result.error || 'The shared chart could not be opened.');
        chartStore.setError(localError);
      }
    } catch (error) {
      localError = error instanceof Error ? error.message : 'The shared chart could not be opened.';
      chartStore.setError(localError);
    } finally {
      localLoading = false;
      chartStore.setLoading(false);
    }
  }
</script>

<svelte:head>
  <title>Poetic Birth Chart - OsztrOlogy</title>
  <meta
    name="description"
    content="A slower, poetic birth chart experience using the same astrological calculation."
  />
</svelte:head>

<div class="poetic-page">
  <aside class="form-column" aria-label="Birth chart entry">
    <p class="margin-note">a small form, left in the open</p>
    <PoeticBirthForm
      on:status={(event) => {
        localLoading = event.detail.loading;
        if (event.detail.loading) localError = null;
      }}
      on:success={() => {
        localLoading = false;
        localError = null;
      }}
      on:error={(event) => {
        localLoading = false;
        localError = event.detail.message;
      }}
    />
  </aside>

  <main class="reading-column">
    <PoeticChartReading {chartData} {birthData} loading={loading} error={displayError} />
  </main>
</div>

<style>
  :global(body) {
    background:
      linear-gradient(
        90deg,
        color-mix(in oklch, var(--foreground) 4%, transparent) 1px,
        transparent 1px
      ),
      var(--background);
    background-size: 23rem 100%;
  }

  .poetic-page {
    display: grid;
    grid-template-columns: minmax(17rem, 0.72fr) minmax(0, 1.7fr);
    gap: clamp(2rem, 5vw, 5rem);
    width: min(100%, 78rem);
    margin: 0 auto;
  }

  .form-column {
    position: sticky;
    top: 2rem;
    align-self: start;
    padding-top: clamp(1rem, 7vw, 8rem);
  }

  .margin-note {
    margin: 0 0 1.2rem;
    color: color-mix(in oklch, var(--foreground) 48%, transparent);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.75rem;
  }

  .reading-column {
    min-width: 0;
  }

  @media (max-width: 920px) {
    .poetic-page {
      grid-template-columns: 1fr;
    }

    .form-column {
      position: relative;
      top: auto;
      padding-top: 1rem;
    }
  }
</style>
