import { ZODIAC_COLORS } from '$lib/data/astrological-data';
import type {
  MarketCosmosTimelineResponse,
  TimelinePlanet,
  TimelineRange,
  ZodiacSign,
  IndexSymbol
} from '$lib/types/market-cosmos';

export interface TimelineChartModel {
  width: number;
  height: number;
  pricePath: string;
  yMin: number;
  yMax: number;
  startDate: string;
  endDate: string;
  currency: string;
  primaryBands: Array<{ x: number; width: number; sign: ZodiacSign; color: string; labelX: number }>;
  secondaryBands: Array<{ x: number; width: number; sign: ZodiacSign; color: string; labelX: number }>;
  ingressMarkers: Array<{ x: number; tooltip: string }>;
}

// Dark-safe sign palette: preserves astrological element identity but differentiates each sign.
export const TIMELINE_SIGN_COLORS: Record<ZodiacSign, string> = {
  Aries: '#ff6b5e',
  Taurus: '#6bc27f',
  Gemini: '#f6d365',
  Cancer: '#61b9ff',
  Leo: '#ff9151',
  Virgo: '#86c95f',
  Libra: '#ffd17a',
  Scorpio: '#4d9dff',
  Sagittarius: '#ff6f87',
  Capricorn: '#4aa56d',
  Aquarius: '#f2c86b',
  Pisces: '#79b4ff'
};

export function getTimelineSignColor(sign: ZodiacSign): string {
  return TIMELINE_SIGN_COLORS[sign] || ZODIAC_COLORS[sign] || '#94a3b8';
}

export function buildTimelineQuery(params: {
  symbol: IndexSymbol;
  range: TimelineRange;
  primaryPlanet: TimelinePlanet;
  secondaryPlanet: TimelinePlanet;
}): string {
  const search = new URLSearchParams({
    symbol: params.symbol,
    range: params.range,
    primaryPlanet: params.primaryPlanet,
    secondaryPlanet: params.secondaryPlanet
  });

  return `/api/market-cosmos/timeline?${search.toString()}`;
}

export function buildTimelineChartModel(
  data: MarketCosmosTimelineResponse,
  primaryPlanet: TimelinePlanet,
  secondaryPlanet: TimelinePlanet
): TimelineChartModel {
  const width = 1000;
  const height = 420;
  const leftPad = 72;
  const rightPad = 30;
  const topPad = 24;
  const priceBottom = 285;

  const series = data.priceSeries;
  const firstDate = series[0].date;
  const lastDate = series[series.length - 1].date;

  const dayStart = new Date(`${firstDate}T00:00:00.000Z`).getTime();
  const dayEnd = new Date(`${lastDate}T00:00:00.000Z`).getTime();
  const span = Math.max(86_400_000, dayEnd - dayStart);

  const minPrice = Math.min(...series.map((point) => point.close));
  const maxPrice = Math.max(...series.map((point) => point.close));
  const spread = Math.max(1, maxPrice - minPrice);
  const paddedMin = minPrice - spread * 0.08;
  const paddedMax = maxPrice + spread * 0.08;

  const xForDate = (date: string): number => {
    const ts = new Date(`${date}T00:00:00.000Z`).getTime();
    const ratio = (ts - dayStart) / span;
    return leftPad + ratio * (width - leftPad - rightPad);
  };

  const yForPrice = (price: number): number => {
    const ratio = (price - paddedMin) / (paddedMax - paddedMin || 1);
    return priceBottom - ratio * (priceBottom - topPad);
  };

  const pricePath = series
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${xForDate(point.date).toFixed(2)},${yForPrice(point.close).toFixed(2)}`)
    .join(' ');

  const dayWidth = (width - leftPad - rightPad) / Math.max(1, dayDiff(firstDate, lastDate) + 1);

  const primaryBands = data.primarySignBands.map((segment) => {
    const startX = xForDate(segment.startDate);
    const endX = xForDate(segment.endDate) + dayWidth;
    return {
      x: startX,
      width: Math.max(1, endX - startX),
      sign: segment.sign,
      color: getTimelineSignColor(segment.sign),
      labelX: startX + Math.max(1, endX - startX) / 2
    };
  });

  const secondaryBands = data.secondarySignRibbon.map((segment) => {
    const startX = xForDate(segment.startDate);
    const endX = xForDate(segment.endDate) + dayWidth;
    return {
      x: startX,
      width: Math.max(1, endX - startX),
      sign: segment.sign,
      color: getTimelineSignColor(segment.sign),
      labelX: startX + Math.max(1, endX - startX) / 2
    };
  });

  const ingressMarkers = data.ingressEvents.map((event) => {
    const x = xForDate(event.date);
    const close = getCloseAtOrBefore(series, event.date);
    const primarySign = getSignAtDate(data.primarySignBands, event.date);
    const secondarySign = getSignAtDate(data.secondarySignRibbon, event.date);

    return {
      x,
      tooltip: `${event.planet} ingress ${event.fromSign} -> ${event.toSign} on ${event.date} | Close: ${
        close === null ? 'n/a' : close.toFixed(2)
      } ${data.meta.currency} | Primary (${primaryPlanet}): ${primarySign || 'n/a'} | Secondary (${secondaryPlanet}): ${
        secondarySign || 'n/a'
      }`
    };
  });

  return {
    width,
    height,
    pricePath,
    yMin: paddedMin,
    yMax: paddedMax,
    startDate: firstDate,
    endDate: lastDate,
    currency: data.meta.currency,
    primaryBands,
    secondaryBands,
    ingressMarkers
  };
}

function dayDiff(start: string, end: string): number {
  const startMs = new Date(`${start}T00:00:00.000Z`).getTime();
  const endMs = new Date(`${end}T00:00:00.000Z`).getTime();
  return Math.round((endMs - startMs) / 86_400_000);
}

function getSignAtDate(
  segments: MarketCosmosTimelineResponse['primarySignBands'] | MarketCosmosTimelineResponse['secondarySignRibbon'],
  date: string
): ZodiacSign | null {
  for (const segment of segments) {
    if (date >= segment.startDate && date <= segment.endDate) {
      return segment.sign;
    }
  }
  return null;
}

function getCloseAtOrBefore(series: MarketCosmosTimelineResponse['priceSeries'], date: string): number | null {
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].date <= date) return series[i].close;
  }
  return null;
}
