import { describe, it, expect } from 'vitest';
import {
  calculateAngularDelta,
  detectMajorAspects,
  buildCategorySummaries,
  type AstroAspect,
  type MarketAssetSnapshot,
  type PlanetMovement
} from '../../../src/lib/server/market-cosmos';

describe('market-cosmos helpers', () => {
  it('calculates wrapped angular delta correctly', () => {
    expect(calculateAngularDelta(2, 359)).toBeCloseTo(3);
    expect(calculateAngularDelta(359, 2)).toBeCloseTo(-3);
    expect(calculateAngularDelta(10, 20)).toBeCloseTo(-10);
  });

  it('detects major aspects with orbs', () => {
    const aspects = detectMajorAspects([
      { name: 'Sun', longitude: 10 },
      { name: 'Mars', longitude: 100 },
      { name: 'Jupiter', longitude: 130 }
    ]);

    const found = aspects.find((aspect) => aspect.planetA === 'Sun' && aspect.planetB === 'Mars');
    expect(found).toBeDefined();
    expect(found?.aspect).toBe('Square');
    expect(found?.orb).toBeCloseTo(0);

    const trine = aspects.find((aspect) => aspect.planetA === 'Sun' && aspect.planetB === 'Jupiter');
    expect(trine?.aspect).toBe('Trine');
  });

  it('builds category summaries from market and astrology slices', () => {
    const assets: MarketAssetSnapshot[] = [
      {
        symbol: '^GSPC',
        name: 'S&P 500',
        category: 'indexes',
        price: 5200,
        previousClose: 5100,
        change: 100,
        changePercent: 1.96,
        currency: 'USD',
        asOf: '2026-03-12',
        history: [{ date: '2026-03-11', close: 5100 }, { date: '2026-03-12', close: 5200 }]
      },
      {
        symbol: 'GC=F',
        name: 'Gold Futures',
        category: 'gold',
        price: 2200,
        previousClose: 2210,
        change: -10,
        changePercent: -0.45,
        currency: 'USD',
        asOf: '2026-03-12',
        history: [{ date: '2026-03-11', close: 2210 }, { date: '2026-03-12', close: 2200 }]
      }
    ];

    const movements: PlanetMovement[] = [
      {
        name: 'Sun',
        longitude: 340,
        previousLongitude: 339,
        delta: 1,
        sign: 'Pisces',
        previousSign: 'Pisces',
        signChanged: false,
        retrograde: false,
        retrogradeChanged: false
      },
      {
        name: 'Uranus',
        longitude: 62,
        previousLongitude: 61.5,
        delta: 0.5,
        sign: 'Gemini',
        previousSign: 'Taurus',
        signChanged: true,
        retrograde: false,
        retrogradeChanged: false
      }
    ];

    const aspects: AstroAspect[] = [
      {
        planetA: 'Sun',
        planetB: 'Jupiter',
        aspect: 'Trine',
        separation: 120,
        orb: 0
      }
    ];

    const summaries = buildCategorySummaries(assets, movements, aspects);

    expect(summaries).toHaveLength(3);
    expect(summaries.find((item) => item.category === 'indexes')?.averageChangePercent).toBeCloseTo(1.96);
    expect(summaries.find((item) => item.category === 'gold')?.averageChangePercent).toBeCloseTo(-0.45);
    expect(summaries.find((item) => item.category === 'crypto')?.assetsTracked).toBe(0);
  });
});
