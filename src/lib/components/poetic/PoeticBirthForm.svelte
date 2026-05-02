<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { enhance } from '$app/forms';
  import { searchCities, type CitySearchResult } from '$lib/services/city-service';
  import { chartStore } from '$lib/stores/chart-store';
  import { logFeatureUsage } from '$lib/services/usage-logger';

  const dispatch = createEventDispatcher<{
    status: { loading: boolean };
    success: void;
    error: { message: string };
  }>();

  const formPrefix = 'poetic_';

  let citySearch = '';
  let cityResults: CitySearchResult[] = [];
  let showCityDropdown = false;
  let selectedIndex = -1;
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  let selectedCityData: any = null;
  let birthDate = '';
  let birthTime = '';
  let formError = '';
  let cityInputBlurred = false;
  let isSubmitting = false;

  function updateLoading(loading: boolean) {
    isSubmitting = loading;
    dispatch('status', { loading });
  }

  function onCityInput(event: Event) {
    citySearch = (event.target as HTMLInputElement).value;
    selectedIndex = -1;
    selectedCityData = null;

    if (searchTimeout) clearTimeout(searchTimeout);

    if (citySearch.length > 1) {
      searchTimeout = setTimeout(async () => {
        cityResults = await searchCities(citySearch, 20);
        showCityDropdown = cityResults.length > 0;
      }, 300);
    } else {
      cityResults = [];
      showCityDropdown = false;
    }
  }

  function onCityKeydown(event: KeyboardEvent) {
    if (!showCityDropdown) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, cityResults.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < cityResults.length) {
          selectCity(cityResults[selectedIndex]);
        }
        break;
      case 'Escape':
        showCityDropdown = false;
        selectedIndex = -1;
        break;
    }
  }

  function selectCity(city: CitySearchResult) {
    citySearch = city.fullLocation;
    showCityDropdown = false;
    selectedIndex = -1;
    selectedCityData = {
      name: city.name,
      fullLocation: city.fullLocation,
      lat: city.lat,
      lng: city.lng,
      country: city.country,
      adminName: city.adminName
    };

    const cityInput = document.getElementById(`${formPrefix}city-data`) as HTMLInputElement;
    if (cityInput) cityInput.value = JSON.stringify(selectedCityData);
  }

  function validateForm() {
    if (!birthDate) {
      formError = 'Enter the date first.';
      return false;
    }

    if (!birthTime) {
      formError = 'Enter the time, even an approximate one.';
      return false;
    }

    if (!selectedCityData) {
      formError = 'Choose the birth city from the list.';
      return false;
    }

    formError = '';
    return true;
  }

  function handleSubmit(event: SubmitEvent) {
    if (!validateForm()) {
      event.preventDefault();
      dispatch('error', { message: formError });
      return false;
    }

    void logFeatureUsage({
      feature: 'chart',
      action: 'generate_submit',
      route: '/poetic/chart',
      metadata: { variant: 'poetic' }
    });

    chartStore.setLoading(true);
    updateLoading(true);
    return true;
  }
</script>

<form
  method="POST"
  action="?/calculate"
  enctype="application/x-www-form-urlencoded"
  class="poetic-form"
  on:submit={handleSubmit}
  use:enhance={() => {
    return async ({ result, update }) => {
      try {
        if (result.type === 'success') {
          if (result.data?.chartData) {
            chartStore.setChartData(String(result.data.chartData), result.data.birthData as any);
            void logFeatureUsage({
              feature: 'chart',
              action: 'generate_success',
              route: '/poetic/chart',
              metadata: { variant: 'poetic' }
            });
            dispatch('success');
          }

          await update();
        } else if (result.type === 'failure') {
          const message = String(result.data?.error || 'The chart would not form.');
          chartStore.setError(message);
          formError = message;
          dispatch('error', { message });
          void logFeatureUsage({
            feature: 'chart',
            action: 'generate_failure',
            route: '/poetic/chart',
            metadata: { reason: message, variant: 'poetic' }
          });
          await update();
        }
      } finally {
        updateLoading(false);
      }
    };
  }}
>
  <div class="field-row">
    <label for={`${formPrefix}birth-date`}>
      <span>date</span>
      <input
        id={`${formPrefix}birth-date`}
        name={`${formPrefix}birthDate`}
        type="date"
        bind:value={birthDate}
        required
      />
    </label>

    <label for={`${formPrefix}birth-time`}>
      <span>time</span>
      <input
        id={`${formPrefix}birth-time`}
        name={`${formPrefix}birthTime`}
        type="time"
        bind:value={birthTime}
        required
      />
    </label>
  </div>

  <label for={`${formPrefix}city`} class="city-field">
    <span>place</span>
    <input
      id={`${formPrefix}city`}
      name={`${formPrefix}city`}
      type="text"
      bind:value={citySearch}
      on:input={onCityInput}
      on:keydown={onCityKeydown}
      on:blur={() => {
        cityInputBlurred = true;
        setTimeout(() => {
          if (cityInputBlurred) showCityDropdown = false;
        }, 200);
      }}
      on:focus={() => {
        cityInputBlurred = false;
        if (cityResults.length > 0) showCityDropdown = true;
      }}
      placeholder="begin with a city"
      autocomplete="off"
      required
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={showCityDropdown}
      aria-controls={`${formPrefix}city-results`}
    />

    {#if showCityDropdown && cityResults.length > 0}
      <div class="city-list" id={`${formPrefix}city-results`} role="listbox">
        {#each cityResults as city, index}
          <button
            type="button"
            class:selected={selectedIndex === index}
            role="option"
            aria-selected={selectedIndex === index}
            on:mousedown|preventDefault={() => selectCity(city)}
            on:mouseenter={() => (selectedIndex = index)}
          >
            <span>{city.name}</span>
            <small>{city.fullLocation}</small>
          </button>
        {/each}
      </div>
    {/if}
  </label>

  <input type="hidden" id={`${formPrefix}city-data`} name={`${formPrefix}cityData`} />

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'listening for the sky' : 'cast the chart'}
  </button>

  {#if formError}
    <p class="form-error" aria-live="polite">{formError}</p>
  {/if}

  <p class="form-note" title="Approximate times change the ascendant and houses.">
    unknown time may be entered as noon; the page will still answer, softly.
  </p>
</form>

<style>
  .poetic-form {
    display: grid;
    gap: 1.35rem;
    max-width: 42rem;
  }

  .field-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  label {
    position: relative;
    display: grid;
    gap: 0.45rem;
    color: color-mix(in oklch, var(--foreground) 80%, transparent);
    font-size: 0.8rem;
    text-transform: lowercase;
  }

  label span {
    font-style: italic;
  }

  input {
    width: 100%;
    border: 0;
    border-bottom: 1px solid color-mix(in oklch, var(--foreground) 40%, transparent);
    border-radius: 0;
    background: transparent;
    padding: 0.8rem 0.1rem;
    color: var(--foreground);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 1rem;
    outline-offset: 0.35rem;
  }

  input::placeholder {
    color: color-mix(in oklch, var(--foreground) 38%, transparent);
  }

  input:focus-visible {
    outline: 1px dotted var(--foreground);
    border-bottom-color: var(--foreground);
  }

  .city-field {
    z-index: 2;
  }

  .city-list {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    right: 0;
    max-height: 17rem;
    overflow: auto;
    border: 1px solid color-mix(in oklch, var(--foreground) 28%, transparent);
    background: var(--background);
    box-shadow: 0 1rem 2rem color-mix(in oklch, var(--foreground) 12%, transparent);
  }

  .city-list button {
    display: grid;
    width: 100%;
    gap: 0.2rem;
    border: 0;
    border-bottom: 1px dotted color-mix(in oklch, var(--foreground) 18%, transparent);
    background: transparent;
    padding: 0.8rem;
    color: var(--foreground);
    text-align: left;
  }

  .city-list button:hover,
  .city-list button.selected {
    background: color-mix(in oklch, var(--foreground) 8%, transparent);
  }

  .city-list small {
    color: color-mix(in oklch, var(--foreground) 58%, transparent);
    font-size: 0.75rem;
  }

  button[type='submit'] {
    justify-self: start;
    border: 1px solid var(--foreground);
    border-radius: 999px;
    background: transparent;
    padding: 0.85rem 1.35rem;
    color: var(--foreground);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    text-transform: lowercase;
    transition:
      background 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  button[type='submit']:hover:not(:disabled),
  button[type='submit']:focus-visible {
    background: var(--foreground);
    color: var(--background);
  }

  button[type='submit']:active:not(:disabled) {
    transform: translateY(1px);
  }

  button[type='submit']:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  .form-error {
    max-width: 30rem;
    color: var(--destructive);
    font-size: 0.9rem;
  }

  .form-note {
    max-width: 28rem;
    color: color-mix(in oklch, var(--foreground) 55%, transparent);
    font-size: 0.82rem;
    line-height: 1.7;
  }

  @media (max-width: 640px) {
    .field-row {
      grid-template-columns: 1fr;
    }
  }
</style>
