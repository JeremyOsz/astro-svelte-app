export type IndexSymbol = '^GSPC' | '^DJI' | '^IXIC' | '^FTSE' | '^AXJO';
export type TimelineRange = '6mo' | '1y' | '5y';
export type TimelinePlanet =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

export type MarketCategory = 'indexes' | 'gold' | 'crypto';

export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export interface MarketHistoryPoint {
  date: string;
  close: number;
}

export interface MarketAssetSnapshot {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  asOf: string;
  history: MarketHistoryPoint[];
}

export interface PlanetMovement {
  name: TimelinePlanet;
  longitude: number;
  previousLongitude: number;
  delta: number;
  sign: ZodiacSign;
  previousSign: ZodiacSign;
  signChanged: boolean;
  retrograde: boolean;
  retrogradeChanged: boolean;
}

export interface AstroAspect {
  planetA: TimelinePlanet;
  planetB: TimelinePlanet;
  aspect: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  separation: number;
  orb: number;
}

export interface IngressEvent {
  date: string;
  planet: TimelinePlanet;
  fromSign: ZodiacSign;
  toSign: ZodiacSign;
}

export interface RetrogradeSwitch {
  planet: TimelinePlanet;
  date: string;
  retrograde: boolean;
}

export interface SignSegment {
  startDate: string;
  endDate: string;
  sign: ZodiacSign;
}

export interface CategorySummary {
  category: MarketCategory;
  assetsTracked: number;
  averageChangePercent: number;
  risingAssets: number;
  fallingAssets: number;
  strongestMoveSymbol: string | null;
  keyAstroSignals: string[];
}

export interface AstrologySnapshot {
  planetMovements: PlanetMovement[];
  majorAspects: AstroAspect[];
  signIngresses: IngressEvent[];
  retrogradeSwitches: RetrogradeSwitch[];
}

export interface MarketCosmosSnapshot {
  generatedAt: string;
  lookbackDays: number;
  assets: MarketAssetSnapshot[];
  astrology: AstrologySnapshot | null;
  categorySummaries: CategorySummary[];
  warnings: string[];
}

export interface MarketTimelineMeta {
  symbol: IndexSymbol;
  range: TimelineRange;
  generatedAt: string;
  currency: string;
  warnings: string[];
}

export type CorrelationStrength =
  | 'Strong Bullish'
  | 'Moderate Bullish'
  | 'Weak Bullish'
  | 'Neutral'
  | 'Weak Bearish'
  | 'Moderate Bearish'
  | 'Strong Bearish';

export interface SignCorrelationStat {
  sign: ZodiacSign;
  sampleSize: number;
  upDays: number;
  downDays: number;
  flatDays: number;
  upRate: number;
  averageReturnPct: number;
  liftVsBaselinePct: number;
  phiWithRise: number;
  strength: CorrelationStrength;
}

export interface PlanetCorrelationSummary {
  planet: TimelinePlanet;
  sampleSize: number;
  signIndexReturnCorrelation: number;
  strongestRiseSign: ZodiacSign | null;
  strongestFallSign: ZodiacSign | null;
  bySign: SignCorrelationStat[];
}

export interface TimelineCorrelationAnalysis {
  baselineUpRate: number;
  baselineAverageReturnPct: number;
  observations: number;
  perPlanet: PlanetCorrelationSummary[];
}

export interface MarketCosmosTimelineResponse {
  meta: MarketTimelineMeta;
  priceSeries: MarketHistoryPoint[];
  primarySignBands: SignSegment[];
  secondarySignRibbon: SignSegment[];
  ingressEvents: IngressEvent[];
  correlation: TimelineCorrelationAnalysis;
}
