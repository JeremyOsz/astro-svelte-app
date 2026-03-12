import { describe, expect, it } from 'vitest';
import { buildTimelineChartModel, buildTimelineQuery } from '../../../src/lib/market-cosmos/timeline-view';

describe('timeline-view helpers', () => {
  it('builds timeline query with selector params', () => {
    const query = buildTimelineQuery({
      symbol: '^FTSE',
      range: '1y',
      primaryPlanet: 'Jupiter',
      secondaryPlanet: 'Saturn'
    });

    expect(query).toContain('/api/market-cosmos/timeline?');
    expect(query).toContain('symbol=%5EFTSE');
    expect(query).toContain('range=1y');
    expect(query).toContain('primaryPlanet=Jupiter');
    expect(query).toContain('secondaryPlanet=Saturn');
  });

  it('creates primary bands and secondary ribbon from timeline payload', () => {
    const model = buildTimelineChartModel(
      {
        meta: {
          symbol: '^GSPC',
          range: '1y',
          generatedAt: '2026-03-12T09:00:00.000Z',
          currency: 'USD',
          warnings: []
        },
        priceSeries: [
          { date: '2026-03-10', close: 5000 },
          { date: '2026-03-11', close: 5050 },
          { date: '2026-03-12', close: 5025 }
        ],
        primarySignBands: [
          { startDate: '2026-03-10', endDate: '2026-03-11', sign: 'Pisces' },
          { startDate: '2026-03-12', endDate: '2026-03-12', sign: 'Aries' }
        ],
        secondarySignRibbon: [{ startDate: '2026-03-10', endDate: '2026-03-12', sign: 'Aquarius' }],
        ingressEvents: [
          {
            date: '2026-03-12',
            planet: 'Jupiter',
            fromSign: 'Pisces',
            toSign: 'Aries'
          }
        ],
        correlation: {
          baselineUpRate: 0.55,
          baselineAverageReturnPct: 0.12,
          observations: 2,
          perPlanet: []
        }
      },
      'Jupiter',
      'Saturn'
    );

    expect(model.pricePath.startsWith('M')).toBe(true);
    expect(model.primaryBands).toHaveLength(2);
    expect(model.secondaryBands).toHaveLength(1);
    expect(model.ingressMarkers).toHaveLength(1);
    expect(model.ingressMarkers[0].tooltip).toContain('Primary (Jupiter): Aries');
    expect(model.ingressMarkers[0].tooltip).toContain('Secondary (Saturn): Aquarius');
  });
});
