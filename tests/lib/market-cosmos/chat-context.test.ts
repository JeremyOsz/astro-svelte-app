import { describe, expect, it } from 'vitest';

import { buildMarketCosmosChatContext } from '../../../src/lib/market-cosmos/chat-context';
import type {
  MarketCosmosSnapshot,
  MarketCosmosTimelineResponse
} from '../../../src/lib/types/market-cosmos';

const overviewData: MarketCosmosSnapshot = {
  generatedAt: '2026-03-12T10:00:00.000Z',
  lookbackDays: 14,
  assets: [
    {
      symbol: '^GSPC',
      name: 'S&P 500',
      category: 'indexes',
      price: 5000,
      previousClose: 4950,
      change: 50,
      changePercent: 1.01,
      currency: 'USD',
      asOf: '2026-03-12',
      history: []
    },
    {
      symbol: 'BTC-USD',
      name: 'Bitcoin',
      category: 'crypto',
      price: 70000,
      previousClose: 68000,
      change: 2000,
      changePercent: 2.94,
      currency: 'USD',
      asOf: '2026-03-12',
      history: []
    }
  ],
  astrology: {
    planetMovements: [],
    majorAspects: [
      { planetA: 'Jupiter', planetB: 'Saturn', aspect: 'Trine', separation: 120, orb: 1.2 }
    ],
    signIngresses: [{ date: '2026-03-10', planet: 'Mars', fromSign: 'Cancer', toSign: 'Leo' }],
    retrogradeSwitches: [{ date: '2026-03-08', planet: 'Venus', retrograde: true }]
  },
  categorySummaries: [
    {
      category: 'indexes',
      assetsTracked: 1,
      averageChangePercent: 1.01,
      risingAssets: 1,
      fallingAssets: 0,
      strongestMoveSymbol: '^GSPC',
      keyAstroSignals: []
    }
  ],
  warnings: []
};

const timelineData: MarketCosmosTimelineResponse = {
  meta: {
    symbol: '^GSPC',
    range: '1y',
    generatedAt: '2026-03-12T10:00:00.000Z',
    currency: 'USD',
    warnings: []
  },
  priceSeries: [
    { date: '2025-03-12', close: 4800 },
    { date: '2026-03-12', close: 5000 }
  ],
  primarySignBands: [],
  secondarySignRibbon: [],
  ingressEvents: [{ date: '2026-02-01', planet: 'Jupiter', fromSign: 'Gemini', toSign: 'Cancer' }],
  correlation: {
    baselineUpRate: 0.54,
    baselineAverageReturnPct: 0.18,
    observations: 252,
    perPlanet: [
      {
        planet: 'Jupiter',
        sampleSize: 252,
        signIndexReturnCorrelation: 0.22,
        strongestRiseSign: 'Cancer',
        strongestFallSign: 'Capricorn',
        bySign: [
          {
            sign: 'Cancer',
            sampleSize: 30,
            upDays: 18,
            downDays: 10,
            flatDays: 2,
            upRate: 0.6,
            averageReturnPct: 0.43,
            liftVsBaselinePct: 0.1,
            phiWithRise: 0.14,
            strength: 'Moderate Bullish'
          }
        ]
      },
      {
        planet: 'Saturn',
        sampleSize: 252,
        signIndexReturnCorrelation: -0.12,
        strongestRiseSign: 'Pisces',
        strongestFallSign: 'Aries',
        bySign: []
      }
    ]
  }
};

describe('buildMarketCosmosChatContext', () => {
  it('includes selected state and summaries from overview and timeline data', () => {
    const context = buildMarketCosmosChatContext({
      activeTab: 'timeline',
      selectedIndexLabel: 'S&P 500',
      selectedRange: '1y',
      primaryPlanet: 'Jupiter',
      secondaryPlanet: 'Saturn',
      overviewData,
      timelineData
    });

    expect(context).toContain('Page: Market Cosmos');
    expect(context).toContain('Selected index: S&P 500');
    expect(context).toContain('Top movers: BTC-USD 2.94%');
    expect(context).toContain('Timeline baseline: up-rate 54.00%');
    expect(context).toContain('Jupiter: corr 0.220');
    expect(context).toContain('Instruction: answer using only the page insights above');
  });
});
