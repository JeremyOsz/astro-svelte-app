import type {
  MarketCosmosSnapshot,
  MarketCosmosTimelineResponse,
  PlanetCorrelationSummary,
  TimelinePlanet,
  TimelineRange
} from '$lib/types/market-cosmos';

interface MarketCosmosChatContextInput {
  activeTab: 'overview' | 'timeline';
  selectedIndexLabel: string;
  selectedRange: TimelineRange;
  primaryPlanet: TimelinePlanet;
  secondaryPlanet: TimelinePlanet;
  overviewData: MarketCosmosSnapshot | null;
  timelineData: MarketCosmosTimelineResponse | null;
}

function formatPct(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

function formatSignedPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

function summarizePlanetCorrelation(summary: PlanetCorrelationSummary): string {
  const strongestSign = summary.bySign[0];
  const strongestSignSummary = strongestSign
    ? `${strongestSign.sign} avg return ${formatSignedPercent(strongestSign.averageReturnPct)} on ${strongestSign.sampleSize} days`
    : 'no sign-level sample summary';

  return [
    `${summary.planet}: corr ${summary.signIndexReturnCorrelation.toFixed(3)}`,
    `strongest rise ${summary.strongestRiseSign ?? 'n/a'}`,
    `strongest fall ${summary.strongestFallSign ?? 'n/a'}`,
    strongestSignSummary
  ].join(', ');
}

export function buildMarketCosmosChatContext({
  activeTab,
  selectedIndexLabel,
  selectedRange,
  primaryPlanet,
  secondaryPlanet,
  overviewData,
  timelineData
}: MarketCosmosChatContextInput): string {
  const sections: string[] = [
    'Page: Market Cosmos',
    `Active tab: ${activeTab}`,
    `Selected index: ${selectedIndexLabel}`,
    `Selected range: ${selectedRange}`,
    `Primary planet: ${primaryPlanet}`,
    `Secondary planet: ${secondaryPlanet}`
  ];

  if (overviewData) {
    const topMovers = [...overviewData.assets]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 4)
      .map((asset) => `${asset.symbol} ${asset.changePercent.toFixed(2)}%`)
      .join('; ');

    const categorySummary = overviewData.categorySummaries
      .map(
        (summary) =>
          `${summary.category}: avg ${summary.averageChangePercent.toFixed(2)}%, rising ${summary.risingAssets}, falling ${summary.fallingAssets}, strongest ${summary.strongestMoveSymbol ?? 'n/a'}`
      )
      .join(' | ');

    const astrologySummary = overviewData.astrology
      ? [
          `major aspects: ${overviewData.astrology.majorAspects
            .slice(0, 3)
            .map(
              (aspect) =>
                `${aspect.planetA}-${aspect.planetB} ${aspect.aspect} orb ${aspect.orb.toFixed(2)}`
            )
            .join('; ') || 'none'}`,
          `recent ingresses: ${overviewData.astrology.signIngresses
            .slice(0, 3)
            .map((event) => `${event.planet} ${event.fromSign}->${event.toSign} on ${event.date}`)
            .join('; ') || 'none'}`,
          `retrograde switches: ${overviewData.astrology.retrogradeSwitches
            .slice(0, 2)
            .map((event) => `${event.planet} ${event.retrograde ? 'retrograde' : 'direct'} on ${event.date}`)
            .join('; ') || 'none'}`
        ].join(' | ')
      : 'astrology snapshot unavailable';

    sections.push(`Overview window: ${overviewData.lookbackDays} days`);
    sections.push(`Overview categories: ${categorySummary}`);
    sections.push(`Top movers: ${topMovers || 'none'}`);
    sections.push(`Astrology snapshot: ${astrologySummary}`);

    if (overviewData.warnings.length > 0) {
      sections.push(`Overview warnings: ${overviewData.warnings.join('; ')}`);
    }
  }

  if (timelineData) {
    const firstPoint = timelineData.priceSeries[0];
    const lastPoint = timelineData.priceSeries[timelineData.priceSeries.length - 1];
    const trackedPlanets = [primaryPlanet, secondaryPlanet]
      .map((planet) => timelineData.correlation.perPlanet.find((entry) => entry.planet === planet))
      .filter((entry): entry is PlanetCorrelationSummary => Boolean(entry));

    sections.push(
      `Timeline sample: ${timelineData.priceSeries.length} points from ${firstPoint?.date ?? 'n/a'} to ${lastPoint?.date ?? 'n/a'}`
    );
    sections.push(
      `Timeline baseline: up-rate ${formatPct(
        timelineData.correlation.baselineUpRate
      )}, avg return ${formatSignedPercent(timelineData.correlation.baselineAverageReturnPct)}, observations ${timelineData.correlation.observations}`
    );
    sections.push(
      `Tracked planet correlations: ${trackedPlanets.map(summarizePlanetCorrelation).join(' | ') || 'none'}`
    );
    sections.push(
      `Recent ingress events: ${timelineData.ingressEvents
        .slice(0, 5)
        .map((event) => `${event.planet} ${event.fromSign}->${event.toSign} on ${event.date}`)
        .join('; ') || 'none'}`
    );

    if (timelineData.meta.warnings.length > 0) {
      sections.push(`Timeline warnings: ${timelineData.meta.warnings.join('; ')}`);
    }
  }

  sections.push(
    'Instruction: answer using only the page insights above, explain patterns clearly, and avoid financial advice or certainty claims.'
  );

  return sections.join('\n');
}
