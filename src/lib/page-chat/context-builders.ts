import type { TarotCard } from '$lib/data/tarot-data';
import type { BirthData } from '$lib/stores/chart-store';

interface ParsedChartPlacement {
  planet: string;
  sign: string;
  degreeText: string;
  house: string | null;
  retrograde: boolean;
}

function parseChartPlacements(chartData: string | null | undefined): ParsedChartPlacement[] {
  if (!chartData) return [];

  return chartData
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [planet, sign, degreeText, extra] = line.split(',').map((part) => part?.trim() ?? '');
      if (!planet || !sign || !degreeText) return null;

      const retrograde = extra === 'R' || extra?.endsWith(',R');
      const house = extra && extra !== 'R' ? extra : null;

      return {
        planet,
        sign,
        degreeText,
        house,
        retrograde
      };
    })
    .filter((placement): placement is ParsedChartPlacement => Boolean(placement));
}

function previewList(items: string[], count = 5): string {
  return items.slice(0, count).join('; ') || 'none';
}

export function buildChartPageContext(input: {
  birthData: BirthData | null;
  chartData: string | null;
  interpretationFilter: string;
  showChart: boolean;
  showDegreeMarkers: boolean;
  showExtendedPlanets: boolean;
  showAspectLines: boolean;
  showPlanetLabels: boolean;
  zoomLevel: number;
  savedChartsCount: number;
}): string {
  const placements = parseChartPlacements(input.chartData);
  const corePlacements = placements
    .filter((placement) =>
      ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'ASC', 'MC'].includes(
        placement.planet
      )
    )
    .map(
      (placement) =>
        `${placement.planet} ${placement.degreeText} ${placement.sign}${placement.house ? ` house ${placement.house}` : ''}${placement.retrograde ? ' retrograde' : ''}`
    );

  return [
    'Page: Birth Chart',
    `Chart visible: ${input.showChart ? 'yes' : 'no'}`,
    input.birthData
      ? `Birth data: ${input.birthData.date} ${input.birthData.time} at ${input.birthData.place}`
      : 'Birth data: unavailable',
    `Saved charts: ${input.savedChartsCount}`,
    `Display settings: degree markers ${input.showDegreeMarkers}, extended planets ${input.showExtendedPlanets}, aspect lines ${input.showAspectLines}, planet labels ${input.showPlanetLabels}, zoom ${input.zoomLevel.toFixed(2)}`,
    `Interpretation filter: ${input.interpretationFilter || 'none'}`,
    `Key placements: ${previewList(corePlacements, 8)}`,
    `Total parsed placements: ${placements.length}`,
    'Instruction: answer with chart interpretation grounded in the placements above; if chart data is missing, tell the user to generate a chart first.'
  ].join('\n');
}

export function buildSynastryPageContext(input: {
  relationshipType: 'romance' | 'friendship' | 'family' | 'business';
  isChartReady: boolean;
  loading: boolean;
  storedPerson1Data: Record<string, any> | null;
  storedPerson2Data: Record<string, any> | null;
  synastryAspects: Array<Record<string, any>>;
  mainAspects: Array<Record<string, any>>;
  angularAspects: Array<Record<string, any>>;
  minorAspects: Array<Record<string, any>>;
  synastryHouseOverlays: Array<Record<string, any>>;
  synastryPlanetInSigns: Array<Record<string, any>>;
}): string {
  const topAspects = input.synastryAspects
    .slice(0, 6)
    .map((aspect) => {
      const left = aspect.person1Planet ?? aspect.planet1 ?? 'P1';
      const type = aspect.aspect ?? aspect.type ?? 'aspect';
      const right = aspect.person2Planet ?? aspect.planet2 ?? 'P2';
      const orb = typeof aspect.orb === 'number' ? ` orb ${aspect.orb.toFixed(2)}` : '';
      return `${left} ${type} ${right}${orb}`;
    });

  const person1Name =
    input.storedPerson1Data?.name || input.storedPerson1Data?.chart?.name || 'Person 1';
  const person2Name =
    input.storedPerson2Data?.name || input.storedPerson2Data?.chart?.name || 'Person 2';

  return [
    'Page: Synastry',
    `Relationship type: ${input.relationshipType}`,
    `Results ready: ${input.isChartReady ? 'yes' : 'no'}`,
    `Loading: ${input.loading ? 'yes' : 'no'}`,
    `People: ${person1Name} and ${person2Name}`,
    `Person 1 context: ${input.storedPerson1Data?.date || 'n/a'} ${input.storedPerson1Data?.time || ''} ${input.storedPerson1Data?.city || input.storedPerson1Data?.chart?.birthData?.place || ''}`.trim(),
    `Person 2 context: ${input.storedPerson2Data?.date || 'n/a'} ${input.storedPerson2Data?.time || ''} ${input.storedPerson2Data?.city || input.storedPerson2Data?.chart?.birthData?.place || ''}`.trim(),
    `Aspect counts: total ${input.synastryAspects.length}, main ${input.mainAspects.length}, angular ${input.angularAspects.length}, minor ${input.minorAspects.length}`,
    `Top aspects: ${previewList(topAspects, 6)}`,
    `House overlays: ${input.synastryHouseOverlays.length}`,
    `Composite points: ${input.synastryPlanetInSigns.length}`,
    'Instruction: answer with relationship-dynamics interpretation based on the actual synastry results above; avoid deterministic predictions.'
  ].join('\n');
}

function extractTransitPlanets(currentTransits: any): Array<Record<string, any>> {
  if (Array.isArray(currentTransits?.planets)) return currentTransits.planets;
  if (currentTransits?.objects && typeof currentTransits.objects === 'object') {
    return Object.values(currentTransits.objects).filter(
      (value): value is Record<string, any> => Boolean(value && typeof value === 'object')
    );
  }
  return [];
}

export function buildTransitsPageContext(input: {
  selectedBirthChart: Record<string, any> | null;
  transitDate: string;
  transitTime: string;
  selectedTransitCityData: Record<string, any> | null;
  currentTransits: any;
  natalChart: any;
  chartReady: boolean;
  preparingChart: boolean;
  loading: boolean;
}): string {
  const transitPlanets = extractTransitPlanets(input.currentTransits)
    .filter((planet) => typeof planet.name === 'string')
    .slice(0, 10)
    .map((planet) => {
      const sign =
        typeof planet.sign === 'string'
          ? planet.sign
          : planet.sign?.name || 'unknown sign';
      return `${planet.name} in ${sign}`;
    });

  const natalPlanets = Array.isArray(input.natalChart?.planets)
    ? input.natalChart.planets
        .slice(0, 8)
        .map((planet: any) => `${planet.name} in ${planet.sign?.name || planet.sign || 'unknown sign'}`)
    : [];

  return [
    'Page: Transits',
    `Selected chart: ${input.selectedBirthChart?.name || 'none'}`,
    input.selectedBirthChart?.birthData
      ? `Natal birth data: ${input.selectedBirthChart.birthData.date} ${input.selectedBirthChart.birthData.time} at ${input.selectedBirthChart.birthData.place}`
      : 'Natal birth data: unavailable',
    `Transit moment: ${input.transitDate} ${input.transitTime}`,
    `Transit location: ${input.selectedTransitCityData?.fullLocation || 'none selected'}`,
    `Status: loading ${input.loading}, preparing ${input.preparingChart}, chart ready ${input.chartReady}`,
    `Transit planets: ${previewList(transitPlanets, 8)}`,
    `Natal planets: ${previewList(natalPlanets, 8)}`,
    `Transit planet count: ${extractTransitPlanets(input.currentTransits).length}`,
    'Instruction: explain the likely meaning of the current transit setup relative to the natal chart above, grounded in the loaded results only.'
  ].join('\n');
}

export function buildTarotPageContext(input: {
  searchTerm: string;
  selectedSuit: string;
  filteredCount: number;
  totalCount: number;
  showReversed: boolean;
  selectedCard: TarotCard | null;
}): string {
  const card = input.selectedCard;

  return [
    'Page: Tarot',
    `Search term: ${input.searchTerm || 'none'}`,
    `Selected suit filter: ${input.selectedSuit}`,
    `Visible cards: ${input.filteredCount} of ${input.totalCount}`,
    card ? `Selected card: ${card.name}` : 'Selected card: none',
    card?.suit ? `Suit: ${card.suit}` : 'Suit: major arcana or none',
    `Reversed mode: ${input.showReversed}`,
    card ? `Keywords: ${card.keywords.slice(0, 8).join(', ')}` : 'Keywords: none',
    card?.element ? `Element: ${card.element}` : 'Element: none',
    card?.planet ? `Planetary association: ${card.planet}` : 'Planetary association: none',
    card?.zodiac ? `Zodiac association: ${card.zodiac}` : 'Zodiac association: none',
    card
      ? `Current interpretation focus: ${
          input.showReversed ? card.reversed.general : card.upright.general
        }`
      : 'Current interpretation focus: no card selected',
    'Instruction: answer as a tarot guide using the selected card and current filter context; if no card is selected, help the user choose a card or explain the visible deck group.'
  ].join('\n');
}
