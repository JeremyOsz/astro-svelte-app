import { getSignByDegree, ZODIAC_SIGNS } from '$lib/data/astrological-data';
import { BoundedTTLCache } from '$lib/server/bounded-cache';
import { getEphemerisConfig } from '$lib/server/ephemeris';
import { fetchWithRetry } from '$lib/server/http';
import type {
  AstroAspect,
  CategorySummary,
  CorrelationStrength,
  IndexSymbol,
  IngressEvent,
  MarketAssetSnapshot,
  MarketCategory,
  MarketCosmosSnapshot,
  MarketCosmosTimelineResponse,
  MarketHistoryPoint,
  PlanetMovement,
  PlanetCorrelationSummary,
  RetrogradeSwitch,
  SignSegment,
  SignCorrelationStat,
  TimelinePlanet,
  TimelineCorrelationAnalysis,
  TimelineRange,
  ZodiacSign
} from '$lib/types/market-cosmos';

interface TrackedAssetConfig {
  symbol: string;
  name: string;
  category: MarketCategory;
}

interface PlanetSample {
  sign: ZodiacSign;
  longitude: number;
  retrograde: boolean;
}

interface DailyReturnObservation {
  date: string;
  returnPct: number;
  isUp: boolean;
  isDown: boolean;
}

type PlanetSnapshot = Partial<Record<TimelinePlanet, PlanetSample>>;
type PlanetTimeline = { segments: SignSegment[]; ingressEvents: IngressEvent[] };
type TimelineBatch = Partial<Record<TimelinePlanet, PlanetTimeline>>;

const TRACKED_ASSETS: readonly TrackedAssetConfig[] = [
  { symbol: '^GSPC', name: 'S&P 500', category: 'indexes' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', category: 'indexes' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', category: 'indexes' },
  { symbol: '^FTSE', name: 'FTSE 100', category: 'indexes' },
  { symbol: '^AXJO', name: 'ASX 200', category: 'indexes' },
  { symbol: 'GC=F', name: 'Gold Futures', category: 'gold' },
  { symbol: 'BTC-USD', name: 'Bitcoin', category: 'crypto' },
  { symbol: 'ETH-USD', name: 'Ethereum', category: 'crypto' }
];

export const INDEX_SYMBOLS: readonly IndexSymbol[] = ['^GSPC', '^DJI', '^IXIC', '^FTSE', '^AXJO'];
export const TIMELINE_RANGES: readonly TimelineRange[] = ['6mo', '1y', '5y'];
export const TIMELINE_PLANETS: readonly TimelinePlanet[] = [
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

const PLANET_SET = new Set<string>(TIMELINE_PLANETS);

const marketSeriesCache = new BoundedTTLCache<{ currency: string; series: MarketHistoryPoint[] }>(500, 10 * 60 * 1000);
const planetSnapshotCache = new BoundedTTLCache<PlanetSnapshot>(20_000, 24 * 60 * 60 * 1000);
const timelineCache = new BoundedTTLCache<TimelineBatch>(600, 60 * 60 * 1000);
const snapshotCache = new BoundedTTLCache<MarketCosmosSnapshot>(50, 5 * 60 * 1000);

const EPHEMERIS_TIMEOUT_MS = 20_000;
const EPHEMERIS_RETRIES = 2;

function normalizeLongitude(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function toISODateUTC(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function dateFromISO(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function dayDiff(left: string, right: string): number {
  const ms = dateFromISO(right).getTime() - dateFromISO(left).getTime();
  return Math.round(ms / 86_400_000);
}

function coerceSign(value: string): ZodiacSign {
  return value as ZodiacSign;
}

function parseRangeToDays(range: TimelineRange): number {
  if (range === '6mo') return 183;
  if (range === '1y') return 366;
  return 1826;
}

function parseYahooSeries(payload: any): { currency: string; series: MarketHistoryPoint[] } {
  const result = payload?.chart?.result?.[0];
  if (!result) {
    throw new Error('Missing market chart result');
  }

  const timestamps = Array.isArray(result.timestamp) ? result.timestamp : [];
  const closes = result?.indicators?.quote?.[0]?.close;
  if (!Array.isArray(closes)) {
    throw new Error('Missing market close series');
  }

  const series: MarketHistoryPoint[] = [];
  const length = Math.min(timestamps.length, closes.length);
  for (let i = 0; i < length; i += 1) {
    const timestamp = timestamps[i];
    const close = closes[i];
    if (typeof timestamp !== 'number' || !Number.isFinite(close)) continue;

    series.push({
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      close: Number(close)
    });
  }

  if (series.length < 2) {
    throw new Error('Insufficient market history');
  }

  return {
    currency: result?.meta?.currency || 'USD',
    series
  };
}

function normalizePlanetName(value: string): TimelinePlanet | null {
  const name = value.toLowerCase().trim();
  const aliases: Record<string, TimelinePlanet> = {
    sun: 'Sun',
    moon: 'Moon',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto'
  };

  return aliases[name] || null;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

function toWarningMessage(error: unknown): string {
  const message = toErrorMessage(error);

  if (message.includes('ENOTFOUND')) {
    return 'ephemeris host is not reachable (DNS/network)';
  }
  if (message.toLowerCase().includes('aborted') || message.toLowerCase().includes('timeout')) {
    return 'ephemeris request timed out';
  }
  if (message.includes('EPHEMERIS_API_KEY is not configured')) {
    return 'EPHEMERIS_API_KEY is not configured';
  }
  if (message.includes('401') || message.includes('403')) {
    return 'ephemeris API key is invalid or unauthorized';
  }
  if (message.includes('Missing or invalid ephemeris planet data')) {
    return 'ephemeris response did not include expected planet fields';
  }

  return message;
}

async function fetchMarketSeries(symbol: string, range: string): Promise<{ currency: string; series: MarketHistoryPoint[] }> {
  const cacheKey = `${symbol}:${range}`;
  const cached = marketSeriesCache.get(cacheKey);
  if (cached) return cached;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d&includePrePost=false&events=div%2Csplit`;

  const response = await fetchWithRetry(url, {}, { timeoutMs: 12_000, retries: 1 });
  if (!response.ok) {
    throw new Error(`Market request failed for ${symbol}: ${response.status}`);
  }

  const payload = await response.json();
  const parsed = parseYahooSeries(payload);
  marketSeriesCache.set(cacheKey, parsed);
  return parsed;
}

function trimSeriesToLookback(series: MarketHistoryPoint[], lookbackDays: number): MarketHistoryPoint[] {
  if (series.length <= 2) return [...series];

  const end = dateFromISO(series[series.length - 1].date);
  const start = addDays(end, -(lookbackDays - 1));
  const minDate = toISODateUTC(start);

  const trimmed = series.filter((point) => point.date >= minDate);
  if (trimmed.length >= 2) return trimmed;
  return series.slice(-2);
}

async function fetchAssetSnapshot(asset: TrackedAssetConfig, lookbackDays: number): Promise<MarketAssetSnapshot> {
  const rangeForQuery = `${Math.max(lookbackDays + 5, 10)}d`;
  const { currency, series } = await fetchMarketSeries(asset.symbol, rangeForQuery);
  const history = trimSeriesToLookback(series, lookbackDays);

  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  const change = latest.close - previous.close;
  const changePercent = previous.close === 0 ? 0 : (change / previous.close) * 100;

  return {
    symbol: asset.symbol,
    name: asset.name,
    category: asset.category,
    price: latest.close,
    previousClose: previous.close,
    change,
    changePercent,
    currency,
    asOf: latest.date,
    history
  };
}

function parsePlanetSnapshot(payload: any): PlanetSnapshot {
  const objects = payload?.objects || {};
  const snapshot: Partial<PlanetSnapshot> = {};

  for (const value of Object.values<any>(objects)) {
    const normalizedName = typeof value?.name === 'string' ? normalizePlanetName(value.name) : null;
    if (!normalizedName || !PLANET_SET.has(normalizedName)) continue;

    const rawLongitude =
      typeof value?.longitude?.raw === 'number'
        ? value.longitude.raw
        : typeof value?.longitude === 'number'
          ? value.longitude
          : null;

    if (typeof rawLongitude !== 'number' || !Number.isFinite(rawLongitude)) continue;

    const longitude = normalizeLongitude(rawLongitude);
    const sign = coerceSign(getSignByDegree(longitude));
    const retrograde =
      typeof value?.movement?.retrograde === 'boolean'
        ? value.movement.retrograde
        : typeof value?.speed?.raw === 'number'
          ? value.speed.raw < 0
          : false;

    snapshot[normalizedName] = {
      sign,
      longitude,
      retrograde
    };
  }

  const planets = Array.isArray(payload?.planets) ? payload.planets : [];
  for (const value of planets) {
    const normalizedName = typeof value?.name === 'string' ? normalizePlanetName(value.name) : null;
    if (!normalizedName || snapshot[normalizedName]) continue;

    const rawLongitude =
      typeof value?.longitude?.raw === 'number'
        ? value.longitude.raw
        : typeof value?.longitude === 'number'
          ? value.longitude
          : null;

    if (typeof rawLongitude !== 'number' || !Number.isFinite(rawLongitude)) continue;

    const longitude = normalizeLongitude(rawLongitude);
    snapshot[normalizedName] = {
      sign: coerceSign(getSignByDegree(longitude)),
      longitude,
      retrograde: Boolean(value?.retrograde)
    };
  }

  if (Object.keys(snapshot).length === 0) {
    throw new Error('Missing or invalid ephemeris planet data');
  }

  return snapshot;
}

async function fetchPlanetSnapshot(date: string): Promise<PlanetSnapshot> {
  const cached = planetSnapshotCache.get(date);
  if (cached) return cached;

  const { baseUrl, apiKey } = getEphemerisConfig();
  let response: Response;
  try {
    response = await fetchWithRetry(
      `${baseUrl}/birth-chart`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({
          date,
          time: '12:00:00',
          place: 'London, UK',
          latitude: 51.5074,
          longitude: -0.1278,
          house_system: 'whole_sign'
        })
      },
      { timeoutMs: EPHEMERIS_TIMEOUT_MS, retries: EPHEMERIS_RETRIES }
    );
  } catch (error) {
    throw new Error(`Ephemeris network error: ${toErrorMessage(error)}`);
  }

  if (!response.ok) {
    const body = (await response.text()).slice(0, 200);
    throw new Error(`Ephemeris request failed (${response.status})${body ? `: ${body}` : ''}`);
  }

  const payload = await response.json();
  const parsed = parsePlanetSnapshot(payload);
  planetSnapshotCache.set(date, parsed);
  return parsed;
}

function parsePlanetTimelineBatch(payload: any, requestedPlanets: TimelinePlanet[]): TimelineBatch {
  const rawSegments = payload?.segments;
  const rawIngresses = Array.isArray(payload?.ingresses) ? payload.ingresses : [];

  if (!rawSegments || typeof rawSegments !== 'object') {
    throw new Error('Missing timeline segments in ephemeris response');
  }

  const batch: TimelineBatch = {};

  for (const planet of requestedPlanets) {
    const candidateSegments = Array.isArray(rawSegments[planet]) ? rawSegments[planet] : [];

    const segments: SignSegment[] = candidateSegments
      .map((segment: any) => {
        const startDate = typeof segment?.start_date === 'string' ? segment.start_date : segment?.startDate;
        const endDate = typeof segment?.end_date === 'string' ? segment.end_date : segment?.endDate;
        const sign = typeof segment?.sign === 'string' ? segment.sign : null;

        if (typeof startDate !== 'string' || typeof endDate !== 'string' || typeof sign !== 'string') {
          return null;
        }

        return {
          startDate,
          endDate,
          sign: coerceSign(sign)
        };
      })
      .filter((segment: SignSegment | null): segment is SignSegment => segment !== null)
      .sort((left: SignSegment, right: SignSegment) => left.startDate.localeCompare(right.startDate));

    const ingressEvents: IngressEvent[] = rawIngresses
      .map((event: any) => {
        const eventPlanet = typeof event?.planet === 'string' ? normalizePlanetName(event.planet) : null;
        if (eventPlanet !== planet) return null;

        const date = typeof event?.date === 'string' ? event.date : null;
        const fromSign = typeof event?.from_sign === 'string' ? event.from_sign : event?.fromSign;
        const toSign = typeof event?.to_sign === 'string' ? event.to_sign : event?.toSign;

        if (!date || typeof fromSign !== 'string' || typeof toSign !== 'string') {
          return null;
        }

        return {
          date,
          planet,
          fromSign: coerceSign(fromSign),
          toSign: coerceSign(toSign)
        };
      })
      .filter((event: IngressEvent | null): event is IngressEvent => event !== null)
      .sort((left: IngressEvent, right: IngressEvent) => left.date.localeCompare(right.date));

    batch[planet] = { segments, ingressEvents };
  }

  return batch;
}

async function fetchPlanetTimelines(
  planets: TimelinePlanet[],
  startDate: string,
  endDate: string
): Promise<TimelineBatch> {
  const uniquePlanets = Array.from(new Set(planets));
  const cacheKey = `${startDate}:${endDate}:${[...uniquePlanets].sort().join(',')}`;
  const cached = timelineCache.get(cacheKey);
  if (cached) return cached;

  const { baseUrl, apiKey } = getEphemerisConfig();
  let response: Response;

  try {
    response = await fetchWithRetry(
      `${baseUrl}/planet-sign-timeline`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          planets: uniquePlanets,
          latitude: 51.5074,
          longitude: -0.1278,
          time: '12:00:00',
          house_system: 'whole_sign',
          step_days: 1
        })
      },
      { timeoutMs: EPHEMERIS_TIMEOUT_MS, retries: EPHEMERIS_RETRIES }
    );
  } catch (error) {
    throw new Error(`Ephemeris network error: ${toErrorMessage(error)}`);
  }

  if (!response.ok) {
    const body = (await response.text()).slice(0, 200);
    throw new Error(`Ephemeris timeline request failed (${response.status})${body ? `: ${body}` : ''}`);
  }

  const payload = await response.json();
  const parsed = parsePlanetTimelineBatch(payload, uniquePlanets);
  timelineCache.set(cacheKey, parsed);
  return parsed;
}

async function buildAstrologySnapshot(asOfDate: string): Promise<{
  movements: PlanetMovement[];
  aspects: AstroAspect[];
  ingresses: IngressEvent[];
  retrogradeSwitches: RetrogradeSwitch[];
}> {
  const previousDate = toISODateUTC(addDays(dateFromISO(asOfDate), -1));

  const [currentSnapshot, previousSnapshot] = await Promise.all([
    fetchPlanetSnapshot(asOfDate),
    fetchPlanetSnapshot(previousDate)
  ]);

  const availablePlanets = TIMELINE_PLANETS.filter((planet) => currentSnapshot[planet] && previousSnapshot[planet]);
  if (availablePlanets.length < 2) {
    throw new Error('Not enough shared planet data for astrology snapshot');
  }

  const movements: PlanetMovement[] = availablePlanets.map((planet) => {
    const current = currentSnapshot[planet]!;
    const previous = previousSnapshot[planet]!;

    return {
      name: planet,
      longitude: current.longitude,
      previousLongitude: previous.longitude,
      delta: calculateAngularDelta(current.longitude, previous.longitude),
      sign: current.sign,
      previousSign: previous.sign,
      signChanged: current.sign !== previous.sign,
      retrograde: current.retrograde,
      retrogradeChanged: current.retrograde !== previous.retrograde
    };
  });

  const aspects = detectMajorAspects(
    movements.map((movement) => ({ name: movement.name, longitude: movement.longitude }))
  );

  const ingresses: IngressEvent[] = movements
    .filter((movement) => movement.signChanged)
    .map((movement) => ({
      date: asOfDate,
      planet: movement.name,
      fromSign: movement.previousSign,
      toSign: movement.sign
    }));

  const retrogradeSwitches: RetrogradeSwitch[] = movements
    .filter((movement) => movement.retrogradeChanged)
    .map((movement) => ({
      date: asOfDate,
      planet: movement.name,
      retrograde: movement.retrograde
    }));

  return { movements, aspects, ingresses, retrogradeSwitches };
}

export function calculateAngularDelta(current: number, previous: number): number {
  let delta = (current - previous + 540) % 360;
  delta -= 180;
  return delta;
}

function angularSeparation(a: number, b: number): number {
  const difference = Math.abs(a - b) % 360;
  return difference > 180 ? 360 - difference : difference;
}

export function detectMajorAspects(planets: Array<{ name: TimelinePlanet; longitude: number }>): AstroAspect[] {
  const definitions: Array<{ aspect: AstroAspect['aspect']; angle: number; orb: number }> = [
    { aspect: 'Conjunction', angle: 0, orb: 6 },
    { aspect: 'Sextile', angle: 60, orb: 4 },
    { aspect: 'Square', angle: 90, orb: 5 },
    { aspect: 'Trine', angle: 120, orb: 5 },
    { aspect: 'Opposition', angle: 180, orb: 6 }
  ];

  const aspects: AstroAspect[] = [];

  for (let i = 0; i < planets.length; i += 1) {
    for (let j = i + 1; j < planets.length; j += 1) {
      const left = planets[i];
      const right = planets[j];
      const separation = angularSeparation(left.longitude, right.longitude);

      let best: { aspect: AstroAspect['aspect']; orb: number } | null = null;

      for (const definition of definitions) {
        const orb = Math.abs(separation - definition.angle);
        if (orb > definition.orb) continue;
        if (!best || orb < best.orb) {
          best = { aspect: definition.aspect, orb };
        }
      }

      if (best) {
        aspects.push({
          planetA: left.name,
          planetB: right.name,
          aspect: best.aspect,
          separation,
          orb: best.orb
        });
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb);
}

export function buildCategorySummaries(
  assets: MarketAssetSnapshot[],
  movements: PlanetMovement[],
  aspects: AstroAspect[]
): CategorySummary[] {
  const categories: MarketCategory[] = ['indexes', 'gold', 'crypto'];
  const ingressCount = movements.filter((movement) => movement.signChanged).length;
  const retrogradeCount = movements.filter((movement) => movement.retrogradeChanged).length;
  const dominantAspect = aspects[0];

  return categories.map((category) => {
    const categoryAssets = assets.filter((asset) => asset.category === category);
    const assetsTracked = categoryAssets.length;
    const averageChangePercent =
      assetsTracked === 0
        ? 0
        : categoryAssets.reduce((sum, asset) => sum + asset.changePercent, 0) / assetsTracked;

    const risingAssets = categoryAssets.filter((asset) => asset.changePercent > 0).length;
    const fallingAssets = categoryAssets.filter((asset) => asset.changePercent < 0).length;

    const strongestMove =
      categoryAssets.length === 0
        ? null
        : [...categoryAssets].sort((left, right) => Math.abs(right.changePercent) - Math.abs(left.changePercent))[0];

    const keyAstroSignals: string[] = [];
    if (ingressCount > 0) keyAstroSignals.push(`${ingressCount} sign ingresses in last 24h`);
    if (retrogradeCount > 0) keyAstroSignals.push(`${retrogradeCount} retrograde status shifts`);
    if (dominantAspect) {
      keyAstroSignals.push(
        `${dominantAspect.planetA}-${dominantAspect.planetB} ${dominantAspect.aspect} (${dominantAspect.orb.toFixed(1)} deg orb)`
      );
    }

    return {
      category,
      assetsTracked,
      averageChangePercent,
      risingAssets,
      fallingAssets,
      strongestMoveSymbol: strongestMove?.symbol || null,
      keyAstroSignals
    };
  });
}

export async function buildMarketCosmosSnapshot(options: { lookbackDays: number }): Promise<MarketCosmosSnapshot> {
  const lookbackDays = options.lookbackDays;
  const cacheKey = `overview:${lookbackDays}`;
  const cached = snapshotCache.get(cacheKey);
  if (cached) return cached;

  const warnings: string[] = [];

  const settledAssets = await Promise.all(
    TRACKED_ASSETS.map(async (asset) => {
      try {
        return await fetchAssetSnapshot(asset, lookbackDays);
      } catch (error) {
        warnings.push(`Market data unavailable for ${asset.symbol}`);
        return null;
      }
    })
  );

  const assets = settledAssets.filter((asset): asset is MarketAssetSnapshot => asset !== null);
  const anchorDate = assets.length > 0 ? assets[0].asOf : toISODateUTC(new Date());

  let astrology: MarketCosmosSnapshot['astrology'] = null;
  try {
    const astroSnapshot = await buildAstrologySnapshot(anchorDate);
    astrology = {
      planetMovements: astroSnapshot.movements,
      majorAspects: astroSnapshot.aspects,
      signIngresses: astroSnapshot.ingresses,
      retrogradeSwitches: astroSnapshot.retrogradeSwitches
    };
  } catch (error) {
    warnings.push(`Astrological movement snapshot is temporarily unavailable (${toWarningMessage(error)})`);
  }

  if (assets.length === 0 && !astrology) {
    throw new Error('Unable to build market and astrological tracker snapshot');
  }

  const categorySummaries = buildCategorySummaries(
    assets,
    astrology?.planetMovements || [],
    astrology?.majorAspects || []
  );

  const snapshot: MarketCosmosSnapshot = {
    generatedAt: new Date().toISOString(),
    lookbackDays,
    assets,
    astrology,
    categorySummaries,
    warnings
  };

  snapshotCache.set(cacheKey, snapshot);
  return snapshot;
}

export async function refineIngressDateByDayBinarySearch(
  leftDate: string,
  rightDate: string,
  leftSign: ZodiacSign,
  getSignForDate: (date: string) => Promise<ZodiacSign>
): Promise<string> {
  let left = leftDate;
  let right = rightDate;

  while (dayDiff(left, right) > 1) {
    const offset = Math.floor(dayDiff(left, right) / 2);
    const mid = toISODateUTC(addDays(dateFromISO(left), offset));
    const midSign = await getSignForDate(mid);

    if (midSign === leftSign) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return right;
}

export function buildSignSegments(
  startDate: string,
  endDate: string,
  startSign: ZodiacSign,
  ingressEvents: IngressEvent[]
): SignSegment[] {
  const segments: SignSegment[] = [];

  const sorted = [...ingressEvents]
    .filter((event) => event.date >= startDate && event.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));

  let currentStart = startDate;
  let currentSign = startSign;

  for (const event of sorted) {
    if (event.date <= currentStart) {
      currentSign = event.toSign;
      continue;
    }

    const previousDay = toISODateUTC(addDays(dateFromISO(event.date), -1));
    if (previousDay >= currentStart) {
      segments.push({
        startDate: currentStart,
        endDate: previousDay,
        sign: currentSign
      });
    }

    currentStart = event.date;
    currentSign = event.toSign;
  }

  if (currentStart <= endDate) {
    segments.push({
      startDate: currentStart,
      endDate,
      sign: currentSign
    });
  }

  return segments;
}

function getSignForDateFromSegments(segments: SignSegment[], date: string): ZodiacSign | null {
  for (const segment of segments) {
    if (date >= segment.startDate && date <= segment.endDate) {
      return segment.sign;
    }
  }
  return null;
}

function buildDailyReturnObservations(priceSeries: MarketHistoryPoint[]): DailyReturnObservation[] {
  const observations: DailyReturnObservation[] = [];

  for (let i = 1; i < priceSeries.length; i += 1) {
    const previous = priceSeries[i - 1].close;
    const current = priceSeries[i].close;
    if (!Number.isFinite(previous) || !Number.isFinite(current) || previous === 0) continue;

    const returnPct = ((current - previous) / previous) * 100;
    observations.push({
      date: priceSeries[i].date,
      returnPct,
      isUp: returnPct > 0,
      isDown: returnPct < 0
    });
  }

  return observations;
}

function pearsonCorrelation(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;

  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumYY = 0;
  let sumXY = 0;

  for (let i = 0; i < n; i += 1) {
    const x = xs[i];
    const y = ys[i];
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumYY += y * y;
    sumXY += x * y;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  if (!Number.isFinite(denominator) || denominator === 0) return 0;
  return numerator / denominator;
}

function computePhiWithRise(sampleSize: number, upInSign: number, total: number, upTotal: number): number {
  const a = upInSign;
  const b = sampleSize - upInSign;
  const c = upTotal - upInSign;
  const d = total - sampleSize - c;

  const denominator = Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
  if (!Number.isFinite(denominator) || denominator === 0) return 0;

  return (a * d - b * c) / denominator;
}

function classifyCorrelationStrength(phi: number): CorrelationStrength {
  const absPhi = Math.abs(phi);
  if (absPhi < 0.1) return 'Neutral';
  if (absPhi < 0.2) return phi > 0 ? 'Weak Bullish' : 'Weak Bearish';
  if (absPhi < 0.35) return phi > 0 ? 'Moderate Bullish' : 'Moderate Bearish';
  return phi > 0 ? 'Strong Bullish' : 'Strong Bearish';
}

function buildPlanetCorrelationSummary(
  planet: TimelinePlanet,
  segments: SignSegment[],
  observations: DailyReturnObservation[],
  baselineUpRate: number
): PlanetCorrelationSummary {
  const annotated = observations
    .map((observation) => ({
      ...observation,
      sign: getSignForDateFromSegments(segments, observation.date)
    }))
    .filter((observation): observation is DailyReturnObservation & { sign: ZodiacSign } => observation.sign !== null);

  const sampleSize = annotated.length;
  if (sampleSize === 0) {
    return {
      planet,
      sampleSize: 0,
      signIndexReturnCorrelation: 0,
      strongestRiseSign: null,
      strongestFallSign: null,
      bySign: []
    };
  }

  const upTotal = annotated.filter((item) => item.isUp).length;
  const signIndex: Record<ZodiacSign, number> = Object.fromEntries(
    ZODIAC_SIGNS.map((sign, index) => [sign, index])
  ) as Record<ZodiacSign, number>;

  const returnsBySign = new Map<ZodiacSign, Array<DailyReturnObservation & { sign: ZodiacSign }>>();
  for (const observation of annotated) {
    const bucket = returnsBySign.get(observation.sign) || [];
    bucket.push(observation);
    returnsBySign.set(observation.sign, bucket);
  }

  const bySign: SignCorrelationStat[] = [];
  for (const sign of ZODIAC_SIGNS) {
    const bucket = returnsBySign.get(sign as ZodiacSign) || [];
    if (bucket.length === 0) continue;

    const upDays = bucket.filter((item) => item.isUp).length;
    const downDays = bucket.filter((item) => item.isDown).length;
    const flatDays = bucket.length - upDays - downDays;
    const upRate = upDays / bucket.length;
    const averageReturnPct = bucket.reduce((sum, item) => sum + item.returnPct, 0) / bucket.length;
    const liftVsBaselinePct = upRate - baselineUpRate;
    const phiWithRise = computePhiWithRise(bucket.length, upDays, sampleSize, upTotal);

    bySign.push({
      sign: sign as ZodiacSign,
      sampleSize: bucket.length,
      upDays,
      downDays,
      flatDays,
      upRate,
      averageReturnPct,
      liftVsBaselinePct,
      phiWithRise,
      strength: classifyCorrelationStrength(phiWithRise)
    });
  }

  bySign.sort((left, right) => Math.abs(right.phiWithRise) - Math.abs(left.phiWithRise));

  const strongestRise = [...bySign].sort((left, right) => right.averageReturnPct - left.averageReturnPct)[0];
  const strongestFall = [...bySign].sort((left, right) => left.averageReturnPct - right.averageReturnPct)[0];

  const x = annotated.map((observation) => signIndex[observation.sign]);
  const y = annotated.map((observation) => observation.returnPct);

  return {
    planet,
    sampleSize,
    signIndexReturnCorrelation: pearsonCorrelation(x, y),
    strongestRiseSign: strongestRise?.sign || null,
    strongestFallSign: strongestFall?.sign || null,
    bySign
  };
}

export function computeTimelineCorrelation(
  priceSeries: MarketHistoryPoint[],
  planetSegments: Array<{ planet: TimelinePlanet; segments: SignSegment[] }>
): TimelineCorrelationAnalysis {
  const observations = buildDailyReturnObservations(priceSeries);
  const baselineUpRate = observations.length === 0 ? 0 : observations.filter((item) => item.isUp).length / observations.length;
  const baselineAverageReturnPct =
    observations.length === 0 ? 0 : observations.reduce((sum, item) => sum + item.returnPct, 0) / observations.length;

  const perPlanet = planetSegments.map(({ planet, segments }) =>
    buildPlanetCorrelationSummary(planet, segments, observations, baselineUpRate)
  );

  return {
    baselineUpRate,
    baselineAverageReturnPct,
    observations: observations.length,
    perPlanet
  };
}

export async function buildMarketCosmosTimeline(options: {
  symbol: IndexSymbol;
  range: TimelineRange;
  primaryPlanet: TimelinePlanet;
  secondaryPlanet: TimelinePlanet;
}): Promise<MarketCosmosTimelineResponse> {
  const { symbol, range, primaryPlanet, secondaryPlanet } = options;

  if (primaryPlanet === secondaryPlanet) {
    throw new Error('Primary and secondary planets must be different');
  }

  const warnings: string[] = [];
  const { currency, series } = await fetchMarketSeries(symbol, range);

  const priceSeries = series;
  const startDate = priceSeries[0].date;
  const endDate = priceSeries[priceSeries.length - 1].date;

  let primarySignBands: SignSegment[] = [];
  let secondarySignRibbon: SignSegment[] = [];
  let primaryIngresses: IngressEvent[] = [];
  let secondaryIngresses: IngressEvent[] = [];

  try {
    const timelineBatch = await fetchPlanetTimelines([primaryPlanet, secondaryPlanet], startDate, endDate);

    const primaryTimeline = timelineBatch[primaryPlanet];
    if (primaryTimeline && primaryTimeline.segments.length > 0) {
      primarySignBands = primaryTimeline.segments;
      primaryIngresses = primaryTimeline.ingressEvents;
    } else {
      warnings.push(`Primary planet timeline unavailable for ${primaryPlanet} (missing timeline data)`);
    }

    const secondaryTimeline = timelineBatch[secondaryPlanet];
    if (secondaryTimeline && secondaryTimeline.segments.length > 0) {
      secondarySignRibbon = secondaryTimeline.segments;
      secondaryIngresses = secondaryTimeline.ingressEvents;
    } else {
      warnings.push(`Secondary planet timeline unavailable for ${secondaryPlanet} (missing timeline data)`);
    }
  } catch (error) {
    const warning = toWarningMessage(error);
    warnings.push(`Primary planet timeline unavailable for ${primaryPlanet} (${warning})`);
    warnings.push(`Secondary planet timeline unavailable for ${secondaryPlanet} (${warning})`);
  }

  const ingressEvents = [...primaryIngresses, ...secondaryIngresses].sort((a, b) => {
    const dateOrder = a.date.localeCompare(b.date);
    if (dateOrder !== 0) return dateOrder;
    return a.planet.localeCompare(b.planet);
  });

  const correlation = computeTimelineCorrelation(priceSeries, [
    { planet: primaryPlanet, segments: primarySignBands },
    { planet: secondaryPlanet, segments: secondarySignRibbon }
  ]);

  return {
    meta: {
      symbol,
      range,
      generatedAt: new Date().toISOString(),
      currency,
      warnings
    },
    priceSeries,
    primarySignBands,
    secondarySignRibbon,
    ingressEvents,
    correlation
  };
}

export function isIndexSymbol(value: string): value is IndexSymbol {
  return (INDEX_SYMBOLS as readonly string[]).includes(value);
}

export function isTimelineRange(value: string): value is TimelineRange {
  return (TIMELINE_RANGES as readonly string[]).includes(value);
}

export function isTimelinePlanet(value: string): value is TimelinePlanet {
  return (TIMELINE_PLANETS as readonly string[]).includes(value);
}

export function rangeToDefaultLookbackDays(range: TimelineRange): number {
  return parseRangeToDays(range);
}
