<script lang="ts">
  import { onMount } from 'svelte';
  import PageInsightChat from '$lib/components/PageInsightChat.svelte';
  import { buildMarketCosmosChatContext } from '$lib/market-cosmos/chat-context';
  import ZodiacIcon from '$lib/components/icons/ZodiacIcon.svelte';
  import {
    buildTimelineChartModel,
    buildTimelineQuery,
    getTimelineSignColor,
    type TimelineChartModel
  } from '$lib/market-cosmos/timeline-view';
  import type {
    IndexSymbol,
    MarketCategory,
    MarketCosmosSnapshot,
    MarketCosmosTimelineResponse,
    TimelinePlanet,
    TimelineRange
  } from '$lib/types/market-cosmos';
  import { env as publicEnv } from '$env/dynamic/public';

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
  let svgElement: SVGSVGElement | null = null;
  let hoverPoint:
    | {
        x: number;
        y: number;
        date: string;
        close: number;
      }
    | null = null;
  let chatContext = '';
  let chatSuggestions: string[] = [];

  const AI_CHAT_ENABLED = publicEnv.PUBLIC_ENABLE_AI_CHAT === 'true';

  $: chartModel = timelineData ? buildTimelineChartModel(timelineData, primaryPlanet, secondaryPlanet) : null;
  $: chatContext = buildMarketCosmosChatContext({
    activeTab,
    selectedIndexLabel: indexOptions.find((option) => option.symbol === selectedIndex)?.label ?? selectedIndex,
    selectedRange,
    primaryPlanet,
    secondaryPlanet,
    overviewData,
    timelineData
  });

  $: chatSuggestions =
    activeTab === 'overview'
      ? [
          'What are the strongest signals in this overview?',
          'How do the market moves and astrology snapshot connect?',
          'Which category looks most notable right now?'
        ]
      : [
          `Explain the ${primaryPlanet} and ${secondaryPlanet} pattern for ${selectedIndex}.`,
          'What does the correlation section suggest?',
          'Which recent ingress events matter most here?'
        ];

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
    return 'text-muted-foreground';
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
    return 'text-muted-foreground';
  }

  function strengthClass(strength: string): string {
    if (strength.includes('Bullish')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/40';
    if (strength.includes('Bearish')) return 'bg-rose-500/10 text-rose-500 border-rose-500/40';
    return 'bg-muted/50 text-muted-foreground border-border';
  }

  function handleSvgMouseMove(event: MouseEvent): void {
    if (!chartModel || !svgElement) return;

    const rect = svgElement.getBoundingClientRect();
    if (rect.width === 0) return;

    const relativeX = ((event.clientX - rect.left) / rect.width) * chartModel.width;

    let nearest = null as (typeof chartModel.pricePoints)[number] | null;
    let bestDistance = Infinity;

    for (const point of chartModel.pricePoints) {
      const distance = Math.abs(point.x - relativeX);
      if (distance < bestDistance) {
        bestDistance = distance;
        nearest = point;
      }
    }

    hoverPoint = nearest
      ? {
          x: nearest.x,
          y: nearest.y,
          date: nearest.date,
          close: nearest.close
        }
      : null;
  }

  function handleSvgMouseLeave(): void {
    hoverPoint = null;
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
  <section class="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
    <p class="text-xs font-semibold uppercase tracking-wider text-primary">Market x Cosmos</p>
    <h1 class="mt-2 text-2xl font-bold text-foreground md:text-3xl">Index Timeline vs Planetary Signs</h1>
    <p class="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
      Track one index at a time against planetary sign movement. Use the timeline tab to compare a primary and secondary
      planet over the same market period.
    </p>

    <div class="mt-5 inline-flex rounded-lg border border-border bg-muted/50 p-1">
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'overview' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
        on:click={() => (activeTab = 'overview')}
      >
        Overview
      </button>
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'timeline' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
        on:click={() => (activeTab = 'timeline')}
      >
        Timeline
      </button>
    </div>
  </section>

  {#if activeTab === 'overview'}
    <section class="mt-6 space-y-5">
      {#if overviewLoading}
        <div class="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading market-cosmos overview...</div>
      {:else if overviewError}
        <div class="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">{overviewError}</div>
      {:else if overviewData}
        {#if overviewData.warnings.length > 0}
          <div class="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-500">
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
            <article class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{categoryLabel(summary.category)}</p>
              <p class="mt-2 text-2xl font-semibold {percentClass(summary.averageChangePercent)}">
                {summary.averageChangePercent.toFixed(2)}%
              </p>
              <p class="mt-1 text-xs text-muted-foreground">Average change across {summary.assetsTracked} assets</p>
              {#if summary.strongestMoveSymbol}
                <p class="mt-3 text-xs text-muted-foreground">Strongest move: {summary.strongestMoveSymbol}</p>
              {/if}
            </article>
          {/each}
        </div>

        <div class="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table class="min-w-full text-sm">
            <thead class="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th class="px-4 py-3 text-left">Asset</th>
                <th class="px-4 py-3 text-left">Category</th>
                <th class="px-4 py-3 text-right">Price</th>
                <th class="px-4 py-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {#each overviewData.assets as asset}
                <tr class="border-t border-border/70">
                  <td class="px-4 py-3">
                    <div class="font-medium text-foreground">{asset.name}</div>
                    <div class="text-xs text-muted-foreground">{asset.symbol}</div>
                  </td>
                  <td class="px-4 py-3 text-muted-foreground">{categoryLabel(asset.category)}</td>
                  <td class="px-4 py-3 text-right text-foreground">{formatPrice(asset.price, asset.currency)}</td>
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
      <div class="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-4">
        <label class="text-sm">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Index</span>
          <select
            class="w-full rounded-md border border-input bg-card text-foreground px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Range</span>
          <select class="w-full rounded-md border border-input bg-card text-foreground px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" bind:value={selectedRange} on:change={loadTimeline}>
            {#each rangeOptions as range}
              <option value={range}>{formatRange(range)}</option>
            {/each}
          </select>
        </label>

        <label class="text-sm">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primary Planet</span>
          <select class="w-full rounded-md border border-input bg-card text-foreground px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" bind:value={primaryPlanet} on:change={loadTimeline}>
            {#each planetOptions as planet}
              <option value={planet}>{planet}</option>
            {/each}
          </select>
        </label>

        <label class="text-sm">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Secondary Planet</span>
          <select class="w-full rounded-md border border-input bg-card text-foreground px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" bind:value={secondaryPlanet} on:change={loadTimeline}>
            {#each planetOptions as planet}
              <option value={planet}>{planet}</option>
            {/each}
          </select>
        </label>
      </div>

      {#if timelineData?.meta.warnings && timelineData.meta.warnings.length > 0}
        <div class="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-500">
          <p class="font-semibold">Timeline warnings</p>
          <ul class="mt-2 list-disc pl-5">
            {#each timelineData.meta.warnings as warning}
              <li>{warning}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if timelineLoading}
        <div class="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading timeline...</div>
      {:else if timelineError}
        <div class="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">{timelineError}</div>
      {:else if timelineData && chartModel}
        <article class="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6" data-testid="timeline-chart-container">
          <h2 class="text-lg font-semibold text-foreground">
            {indexOptions.find((option) => option.symbol === selectedIndex)?.label} vs {primaryPlanet} and {secondaryPlanet}
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            Primary sign shown as background bands. Secondary sign shown as ribbon lane.
          </p>

          <div class="mt-4 overflow-x-auto">
            <svg
              bind:this={svgElement}
              viewBox={`0 0 ${chartModel.width} ${chartModel.height}`}
              class="min-w-[720px]"
              role="img"
              aria-label="Index price timeline with planetary sign bands. Hover to reveal the exact value for each day."
              on:mousemove={handleSvgMouseMove}
              on:mouseleave={handleSvgMouseLeave}
            >
              <rect x="0" y="0" width={chartModel.width} height={chartModel.height} fill="var(--color-card)" />

              {#each chartModel.primaryBands as band}
                <rect
                  x={band.x}
                  y="24"
                  width={band.width}
                  height="261"
                  fill={band.color}
                  fill-opacity="0.2"
                  stroke={band.color}
                  stroke-opacity="0.3"
                  stroke-width="0.5"
                >
                  <title>{primaryPlanet}: {band.sign}</title>
                </rect>
              {/each}

              {#each chartModel.primaryBands as band}
                {#if band.width >= 24}
                  <ZodiacIcon sign={band.sign} x={band.labelX - 8} y={30} size={16} color={band.color} ariaLabel={`${band.sign} sign`} />
                {/if}
              {/each}

              <line x1="72" y1="24" x2="72" y2="285" stroke="var(--color-border)" stroke-width="1" />
              <line x1="72" y1="285" x2="970" y2="285" stroke="var(--color-border)" stroke-width="1" />

              {#each chartModel.ingressMarkers as marker}
                <line x1={marker.x} y1="24" x2={marker.x} y2="354" stroke="var(--color-muted-foreground)" stroke-dasharray="4 4" stroke-width="1">
                  <title>{marker.tooltip}</title>
                </line>
              {/each}

              <path d={chartModel.pricePath} fill="none" stroke="#1d4ed8" stroke-width="2.5" />

              {#if hoverPoint}
                <line
                  x1={hoverPoint.x}
                  y1="24"
                  x2={hoverPoint.x}
                  y2="285"
                  stroke="var(--color-border)"
                  stroke-width="1"
                  stroke-dasharray="4 4"
                />
                <circle cx={hoverPoint.x} cy={hoverPoint.y} r="4" fill="#1d4ed8" stroke="var(--color-background)" stroke-width="2" />
                <g transform={`translate(${Math.min(Math.max(hoverPoint.x + 8, 80), chartModel.width - 210)}, ${Math.max(hoverPoint.y - 30, 40)})`}>
                  <rect width="190" height="40" rx="6" ry="6" fill="var(--color-popover)" stroke="var(--color-border)" stroke-width="1" />
                  <text x="10" y="17" class="fill-foreground text-[11px]">
                    {hoverPoint.date}
                  </text>
                  <text x="10" y="31" class="fill-muted-foreground text-[11px]">
                    {formatPrice(hoverPoint.close, chartModel.currency)}
                  </text>
                </g>
              {/if}

              {#each chartModel.secondaryBands as band}
                <rect
                  x={band.x}
                  y="320"
                  width={band.width}
                  height="34"
                  fill={band.color}
                  fill-opacity="0.45"
                  stroke={band.color}
                  stroke-opacity="0.45"
                  stroke-width="0.5"
                >
                  <title>{secondaryPlanet}: {band.sign}</title>
                </rect>
              {/each}

              {#each chartModel.secondaryBands as band}
                {#if band.width >= 20}
                  <ZodiacIcon sign={band.sign} x={band.labelX - 7} y={329} size={14} color={band.color} ariaLabel={`${band.sign} sign`} />
                {/if}
              {/each}

              <line x1="72" y1="320" x2="970" y2="320" stroke="var(--color-border)" stroke-width="1" />
              <line x1="72" y1="354" x2="970" y2="354" stroke="var(--color-border)" stroke-width="1" />

              <text x="14" y="30" class="fill-muted-foreground text-[11px]">{chartModel.yMax.toFixed(2)}</text>
              <text x="14" y="288" class="fill-muted-foreground text-[11px]">{chartModel.yMin.toFixed(2)}</text>

              <text x="72" y="390" class="fill-muted-foreground text-[11px]">{chartModel.startDate}</text>
              <text x="486" y="390" class="fill-muted-foreground text-[11px]" text-anchor="middle">{selectedRange}</text>
              <text x="970" y="390" class="fill-muted-foreground text-[11px]" text-anchor="end">{chartModel.endDate}</text>

              <text x="76" y="315" class="fill-muted-foreground text-[10px]">{secondaryPlanet} sign ribbon</text>
            </svg>
          </div>

          <div class="mt-4 rounded-lg border border-border/70 bg-muted/50 p-3 text-xs text-muted-foreground">
            <p>
              Latest range: <strong>{chartModel.startDate}</strong> to <strong>{chartModel.endDate}</strong>.
              Currency: <strong>{chartModel.currency}</strong>.
              Hover ingress markers for date, close, and both sign contexts.
            </p>
          </div>
        </article>

        <article class="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Correlation with Rise/Fall</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            Baseline up-day rate: <strong>{formatPct(timelineData.correlation.baselineUpRate)}</strong> ·
            Baseline average daily return: <strong>{formatSignedPct(timelineData.correlation.baselineAverageReturnPct)}</strong> ·
            Observations: <strong>{timelineData.correlation.observations}</strong>
          </p>

          <div class="mt-4 space-y-4">
            {#each timelineData.correlation.perPlanet as planetCorrelation}
              <div class="rounded-lg border border-border/70 p-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="text-sm font-semibold text-foreground">{planetCorrelation.planet}</p>
                  <p class="text-xs text-muted-foreground">
                    Position/return corr:
                    <span class={correlationClass(planetCorrelation.signIndexReturnCorrelation)}>
                      {planetCorrelation.signIndexReturnCorrelation.toFixed(3)}
                    </span>
                  </p>
                </div>

                <p class="mt-2 text-xs text-muted-foreground">
                  Strongest rise sign:
                  <strong>
                    {#if planetCorrelation.strongestRiseSign}
                      <span class="inline-flex items-center gap-1">
                        <ZodiacIcon sign={planetCorrelation.strongestRiseSign} size={14} color={getTimelineSignColor(planetCorrelation.strongestRiseSign)} />
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
                        <ZodiacIcon sign={planetCorrelation.strongestFallSign} size={14} color={getTimelineSignColor(planetCorrelation.strongestFallSign)} />
                        {planetCorrelation.strongestFallSign}
                      </span>
                    {:else}
                      n/a
                    {/if}
                  </strong>
                </p>

                {#if planetCorrelation.bySign.length === 0}
                  <p class="mt-2 text-xs text-muted-foreground">No sign correlation samples for this planet in the selected range.</p>
                {:else}
                  <div class="mt-3 overflow-x-auto">
                    <table class="min-w-full text-xs">
                      <thead class="text-muted-foreground">
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
                          <tr class="border-t border-border/70">
                            <td class="py-1 text-foreground">
                              <span class="inline-flex items-center gap-1">
                                <ZodiacIcon sign={stat.sign} size={13} color={getTimelineSignColor(stat.sign)} />
                                {stat.sign}
                              </span>
                            </td>
                            <td class="py-1 text-right text-muted-foreground">{stat.sampleSize}</td>
                            <td class="py-1 text-right text-muted-foreground">{formatPct(stat.upRate)}</td>
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

        <article class="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Ingress Events</h3>
          {#if timelineData.ingressEvents.length === 0}
            <p class="mt-2 text-sm text-muted-foreground">No ingress events for the selected period.</p>
          {:else}
            <ul class="mt-3 space-y-2 text-sm text-muted-foreground">
              {#each timelineData.ingressEvents.slice(-8).reverse() as event}
                <li class="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
                  <span>
                    <strong>{event.planet}</strong> moved from {event.fromSign} to {event.toSign}
                  </span>
                  <span class="text-xs text-muted-foreground">{event.date}</span>
                </li>
              {/each}
            </ul>
          {/if}
        </article>
      {/if}

      <p class="text-xs text-muted-foreground">
        Educational view only. This is not investment advice.
      </p>
    </section>
  {/if}
</div>

{#if AI_CHAT_ENABLED}
  <section class="mx-auto mt-6 max-w-6xl px-4 pb-10 md:px-6">
    <PageInsightChat
      title="Ask the Market Cosmos guide"
      description="Chat about the current overview or timeline with the live page state supplied as context."
      contextSummary={chatContext}
      suggestions={chatSuggestions}
    />
  </section>
{/if}
