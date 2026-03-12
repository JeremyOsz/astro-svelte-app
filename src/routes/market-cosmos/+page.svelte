<script lang="ts">
  import { onMount } from 'svelte';
  import ZodiacIcon from '$lib/components/icons/ZodiacIcon.svelte';
  import { buildTimelineChartModel, buildTimelineQuery, type TimelineChartModel } from '$lib/market-cosmos/timeline-view';
  import type {
    IndexSymbol,
    MarketCategory,
    MarketCosmosSnapshot,
    MarketCosmosTimelineResponse,
    TimelinePlanet,
    TimelineRange
  } from '$lib/types/market-cosmos';

  type Tab = 'overview' | 'timeline';

  interface IndexOption {
    symbol: IndexSymbol;
    label: string;
  }

  const indexOptions: IndexOption[] = [
    { symbol: '^GSPC', label: 'S&P 500' },
    { symbol: '^DJI', label: 'Dow Jones' },
    { symbol: '^IXIC', label: 'NASDAQ Composite' },
    { symbol: '^FTSE', label: 'FTSE 100' },
    { symbol: '^AXJO', label: 'ASX 200' }
  ];

  const planetOptions: TimelinePlanet[] = [
    'Sun',
    'Moon',
    'Mercury',
    'Venus',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
    'Pluto'
  ];

  const rangeOptions: TimelineRange[] = ['6mo', '1y', '5y'];

  let activeTab: Tab = 'overview';

  let overviewData: MarketCosmosSnapshot | null = null;
  let overviewLoading = false;
  let overviewError: string | null = null;

  let selectedIndex: IndexSymbol = '^GSPC';
  let selectedRange: TimelineRange = '1y';
  let primaryPlanet: TimelinePlanet = 'Jupiter';
  let secondaryPlanet: TimelinePlanet = 'Saturn';

  let timelineData: MarketCosmosTimelineResponse | null = null;
  let timelineLoading = false;
  let timelineError: string | null = null;
  let timelineRequestId = 0;
  let chartModel: TimelineChartModel | null = null;

  $: chartModel = timelineData ? buildTimelineChartModel(timelineData, primaryPlanet, secondaryPlanet) : null;

  onMount(async () => {
    await Promise.all([loadOverview(), loadTimeline()]);
  });

  async function loadOverview(): Promise<void> {
    overviewLoading = true;
    overviewError = null;

    try {
      const response = await fetch('/api/market-cosmos?lookbackDays=14');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load market overview');
      }

      overviewData = payload;
    } catch (error) {
      overviewError = error instanceof Error ? error.message : 'Failed to load market overview';
    } finally {
      overviewLoading = false;
    }
  }

  async function loadTimeline(): Promise<void> {
    if (primaryPlanet === secondaryPlanet) {
      timelineError = 'Primary and secondary planets must be different.';
      timelineData = null;
      return;
    }

    const requestId = ++timelineRequestId;
    timelineLoading = true;
    timelineError = null;

    const timelineUrl = buildTimelineQuery({
      symbol: selectedIndex,
      range: selectedRange,
      primaryPlanet,
      secondaryPlanet
    });

    try {
      const response = await fetch(timelineUrl);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load timeline');
      }

      if (requestId !== timelineRequestId) return;
      timelineData = payload;
    } catch (error) {
      if (requestId !== timelineRequestId) return;
      timelineError = error instanceof Error ? error.message : 'Failed to load timeline';
      timelineData = null;
    } finally {
      if (requestId === timelineRequestId) {
        timelineLoading = false;
      }
    }
  }

  function percentClass(value: number): string {
    if (value > 0) return 'text-emerald-600';
    if (value < 0) return 'text-rose-600';
    return 'text-slate-600';
  }

  function categoryLabel(category: MarketCategory): string {
    if (category === 'indexes') return 'Indexes';
    if (category === 'gold') return 'Gold';
    return 'Crypto';
  }

  function formatRange(range: TimelineRange): string {
    if (range === '6mo') return '6 Months';
    if (range === '1y') return '1 Year';
    return '5 Years';
  }

  function formatPrice(value: number, currency: string): string {
    const decimals = currency === 'USD' && value >= 1000 ? 2 : 2;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function formatPct(value: number, digits = 2): string {
    return `${(value * 100).toFixed(digits)}%`;
  }

  function formatSignedPct(value: number, digits = 2): string {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(digits)}%`;
  }

  function correlationClass(value: number): string {
    if (value > 0.1) return 'text-emerald-700';
    if (value < -0.1) return 'text-rose-700';
    return 'text-slate-700';
  }

  function strengthClass(strength: string): string {
    if (strength.includes('Bullish')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (strength.includes('Bearish')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  }
</script>

<svelte:head>
  <title>Market Cosmos Timeline | Astro Chart</title>
  <meta
    name="description"
    content="Compare major index trends with planetary sign movement timelines in one focused view."
  />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
    <p class="text-xs font-semibold uppercase tracking-wider text-indigo-600">Market x Cosmos</p>
    <h1 class="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Index Timeline vs Planetary Signs</h1>
    <p class="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
      Track one index at a time against planetary sign movement. Use the timeline tab to compare a primary and secondary
      planet over the same market period.
    </p>

    <div class="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
        on:click={() => (activeTab = 'overview')}
      >
        Overview
      </button>
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
        on:click={() => (activeTab = 'timeline')}
      >
        Timeline
      </button>
    </div>
  </section>

  {#if activeTab === 'overview'}
    <section class="mt-6 space-y-5">
      {#if overviewLoading}
        <div class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading market-cosmos overview...</div>
      {:else if overviewError}
        <div class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{overviewError}</div>
      {:else if overviewData}
        {#if overviewData.warnings.length > 0}
          <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p class="font-semibold">Partial data warning</p>
            <ul class="mt-2 list-disc pl-5">
              {#each overviewData.warnings as warning}
                <li>{warning}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <div class="grid gap-4 md:grid-cols-3">
          {#each overviewData.categorySummaries as summary}
            <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{categoryLabel(summary.category)}</p>
              <p class="mt-2 text-2xl font-semibold {percentClass(summary.averageChangePercent)}">
                {summary.averageChangePercent.toFixed(2)}%
              </p>
              <p class="mt-1 text-xs text-slate-500">Average change across {summary.assetsTracked} assets</p>
              {#if summary.strongestMoveSymbol}
                <p class="mt-3 text-xs text-slate-600">Strongest move: {summary.strongestMoveSymbol}</p>
              {/if}
            </article>
          {/each}
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-3 text-left">Asset</th>
                <th class="px-4 py-3 text-left">Category</th>
                <th class="px-4 py-3 text-right">Price</th>
                <th class="px-4 py-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {#each overviewData.assets as asset}
                <tr class="border-t border-slate-100">
                  <td class="px-4 py-3">
                    <div class="font-medium text-slate-900">{asset.name}</div>
                    <div class="text-xs text-slate-500">{asset.symbol}</div>
                  </td>
                  <td class="px-4 py-3 text-slate-600">{categoryLabel(asset.category)}</td>
                  <td class="px-4 py-3 text-right text-slate-900">{formatPrice(asset.price, asset.currency)}</td>
                  <td class="px-4 py-3 text-right font-medium {percentClass(asset.changePercent)}">
                    {asset.changePercent.toFixed(2)}%
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
  {:else}
    <section class="mt-6 space-y-5">
      <div class="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <label class="text-sm">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Index</span>
          <select
            class="w-full rounded-md border border-slate-300 px-3 py-2"
            bind:value={selectedIndex}
            on:change={loadTimeline}
            data-testid="index-select"
          >
            {#each indexOptions as option}
              <option value={option.symbol}>{option.label}</option>
            {/each}
          </select>
        </label>

        <label class="text-sm">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Range</span>
          <select class="w-full rounded-md border border-slate-300 px-3 py-2" bind:value={selectedRange} on:change={loadTimeline}>
            {#each rangeOptions as range}
              <option value={range}>{formatRange(range)}</option>
            {/each}
          </select>
        </label>

        <label class="text-sm">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Planet</span>
          <select class="w-full rounded-md border border-slate-300 px-3 py-2" bind:value={primaryPlanet} on:change={loadTimeline}>
            {#each planetOptions as planet}
              <option value={planet}>{planet}</option>
            {/each}
          </select>
        </label>

        <label class="text-sm">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Secondary Planet</span>
          <select class="w-full rounded-md border border-slate-300 px-3 py-2" bind:value={secondaryPlanet} on:change={loadTimeline}>
            {#each planetOptions as planet}
              <option value={planet}>{planet}</option>
            {/each}
          </select>
        </label>
      </div>

      {#if timelineData?.meta.warnings && timelineData.meta.warnings.length > 0}
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p class="font-semibold">Timeline warnings</p>
          <ul class="mt-2 list-disc pl-5">
            {#each timelineData.meta.warnings as warning}
              <li>{warning}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if timelineLoading}
        <div class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading timeline...</div>
      {:else if timelineError}
        <div class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{timelineError}</div>
      {:else if timelineData && chartModel}
        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6" data-testid="timeline-chart-container">
          <h2 class="text-lg font-semibold text-slate-900">
            {indexOptions.find((option) => option.symbol === selectedIndex)?.label} vs {primaryPlanet} and {secondaryPlanet}
          </h2>
          <p class="mt-1 text-sm text-slate-600">
            Primary sign shown as background bands. Secondary sign shown as ribbon lane.
          </p>

          <div class="mt-4 overflow-x-auto">
            <svg viewBox={`0 0 ${chartModel.width} ${chartModel.height}`} class="min-w-[720px]">
              <rect x="0" y="0" width={chartModel.width} height={chartModel.height} fill="#ffffff" />

              {#each chartModel.primaryBands as band}
                <rect
                  x={band.x}
                  y="24"
                  width={band.width}
                  height="261"
                  fill={band.color}
                  fill-opacity="0.12"
                >
                  <title>{primaryPlanet}: {band.sign}</title>
                </rect>
              {/each}

              {#each chartModel.primaryBands as band}
                {#if band.width >= 24}
                  <ZodiacIcon sign={band.sign} x={band.labelX - 8} y={30} size={16} color="#334155" ariaLabel={`${band.sign} sign`} />
                {/if}
              {/each}

              <line x1="72" y1="24" x2="72" y2="285" stroke="#cbd5e1" stroke-width="1" />
              <line x1="72" y1="285" x2="970" y2="285" stroke="#cbd5e1" stroke-width="1" />

              {#each chartModel.ingressMarkers as marker}
                <line x1={marker.x} y1="24" x2={marker.x} y2="354" stroke="#64748b" stroke-dasharray="4 4" stroke-width="1">
                  <title>{marker.tooltip}</title>
                </line>
              {/each}

              <path d={chartModel.pricePath} fill="none" stroke="#1d4ed8" stroke-width="2.5" />

              {#each chartModel.secondaryBands as band}
                <rect
                  x={band.x}
                  y="320"
                  width={band.width}
                  height="34"
                  fill={band.color}
                  fill-opacity="0.35"
                >
                  <title>{secondaryPlanet}: {band.sign}</title>
                </rect>
              {/each}

              {#each chartModel.secondaryBands as band}
                {#if band.width >= 20}
                  <ZodiacIcon sign={band.sign} x={band.labelX - 7} y={329} size={14} color="#1e293b" ariaLabel={`${band.sign} sign`} />
                {/if}
              {/each}

              <line x1="72" y1="320" x2="970" y2="320" stroke="#cbd5e1" stroke-width="1" />
              <line x1="72" y1="354" x2="970" y2="354" stroke="#cbd5e1" stroke-width="1" />

              <text x="14" y="30" class="fill-slate-500 text-[11px]">{chartModel.yMax.toFixed(2)}</text>
              <text x="14" y="288" class="fill-slate-500 text-[11px]">{chartModel.yMin.toFixed(2)}</text>

              <text x="72" y="390" class="fill-slate-500 text-[11px]">{chartModel.startDate}</text>
              <text x="486" y="390" class="fill-slate-500 text-[11px]" text-anchor="middle">{selectedRange}</text>
              <text x="970" y="390" class="fill-slate-500 text-[11px]" text-anchor="end">{chartModel.endDate}</text>

              <text x="76" y="315" class="fill-slate-500 text-[10px]">{secondaryPlanet} sign ribbon</text>
            </svg>
          </div>

          <div class="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
            <p>
              Latest range: <strong>{chartModel.startDate}</strong> to <strong>{chartModel.endDate}</strong>.
              Currency: <strong>{chartModel.currency}</strong>.
              Hover ingress markers for date, close, and both sign contexts.
            </p>
          </div>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Correlation with Rise/Fall</h3>
          <p class="mt-2 text-sm text-slate-600">
            Baseline up-day rate: <strong>{formatPct(timelineData.correlation.baselineUpRate)}</strong> ·
            Baseline average daily return: <strong>{formatSignedPct(timelineData.correlation.baselineAverageReturnPct)}</strong> ·
            Observations: <strong>{timelineData.correlation.observations}</strong>
          </p>

          <div class="mt-4 space-y-4">
            {#each timelineData.correlation.perPlanet as planetCorrelation}
              <div class="rounded-lg border border-slate-100 p-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="text-sm font-semibold text-slate-900">{planetCorrelation.planet}</p>
                  <p class="text-xs text-slate-600">
                    Position/return corr:
                    <span class={correlationClass(planetCorrelation.signIndexReturnCorrelation)}>
                      {planetCorrelation.signIndexReturnCorrelation.toFixed(3)}
                    </span>
                  </p>
                </div>

                <p class="mt-2 text-xs text-slate-600">
                  Strongest rise sign:
                  <strong>
                    {#if planetCorrelation.strongestRiseSign}
                      <span class="inline-flex items-center gap-1">
                        <ZodiacIcon sign={planetCorrelation.strongestRiseSign} size={14} className="text-slate-700" />
                        {planetCorrelation.strongestRiseSign}
                      </span>
                    {:else}
                      n/a
                    {/if}
                  </strong>
                  · Strongest fall sign:
                  <strong>
                    {#if planetCorrelation.strongestFallSign}
                      <span class="inline-flex items-center gap-1">
                        <ZodiacIcon sign={planetCorrelation.strongestFallSign} size={14} className="text-slate-700" />
                        {planetCorrelation.strongestFallSign}
                      </span>
                    {:else}
                      n/a
                    {/if}
                  </strong>
                </p>

                {#if planetCorrelation.bySign.length === 0}
                  <p class="mt-2 text-xs text-slate-500">No sign correlation samples for this planet in the selected range.</p>
                {:else}
                  <div class="mt-3 overflow-x-auto">
                    <table class="min-w-full text-xs">
                      <thead class="text-slate-500">
                        <tr>
                          <th class="py-1 text-left">Sign</th>
                          <th class="py-1 text-right">Days</th>
                          <th class="py-1 text-right">Up Rate</th>
                          <th class="py-1 text-right">Avg Return</th>
                          <th class="py-1 text-right">Phi</th>
                          <th class="py-1 text-right">Strength</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each planetCorrelation.bySign.slice(0, 8) as stat}
                          <tr class="border-t border-slate-100">
                            <td class="py-1 text-slate-800">
                              <span class="inline-flex items-center gap-1">
                                <ZodiacIcon sign={stat.sign} size={13} className="text-slate-700" />
                                {stat.sign}
                              </span>
                            </td>
                            <td class="py-1 text-right text-slate-700">{stat.sampleSize}</td>
                            <td class="py-1 text-right text-slate-700">{formatPct(stat.upRate)}</td>
                            <td class="py-1 text-right {correlationClass(stat.averageReturnPct)}">{formatSignedPct(stat.averageReturnPct)}</td>
                            <td class="py-1 text-right {correlationClass(stat.phiWithRise)}">{stat.phiWithRise.toFixed(3)}</td>
                            <td class="py-1 text-right">
                              <span class="inline-flex rounded border px-2 py-0.5 {strengthClass(stat.strength)}">
                                {stat.strength}
                              </span>
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Ingress Events</h3>
          {#if timelineData.ingressEvents.length === 0}
            <p class="mt-2 text-sm text-slate-600">No ingress events for the selected period.</p>
          {:else}
            <ul class="mt-3 space-y-2 text-sm text-slate-700">
              {#each timelineData.ingressEvents.slice(-8).reverse() as event}
                <li class="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
                  <span>
                    <strong>{event.planet}</strong> moved from {event.fromSign} to {event.toSign}
                  </span>
                  <span class="text-xs text-slate-500">{event.date}</span>
                </li>
              {/each}
            </ul>
          {/if}
        </article>
      {/if}

      <p class="text-xs text-slate-500">
        Educational view only. This is not investment advice.
      </p>
    </section>
  {/if}
</div>
