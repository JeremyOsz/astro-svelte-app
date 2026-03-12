import { beforeEach, describe, expect, it, vi } from 'vitest';

const buildTimelineMock = vi.fn();

vi.mock('$lib/server/market-cosmos', () => ({
  buildMarketCosmosTimeline: buildTimelineMock,
  isIndexSymbol: (value: string) => ['^GSPC', '^DJI', '^IXIC', '^FTSE', '^AXJO'].includes(value),
  isTimelineRange: (value: string) => ['6mo', '1y', '5y'].includes(value),
  isTimelinePlanet: (value: string) =>
    ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(value)
}));

describe('/api/market-cosmos/timeline', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns timeline payload for valid request', async () => {
    buildTimelineMock.mockResolvedValue({
      meta: {
        symbol: '^GSPC',
        range: '1y',
        generatedAt: '2026-03-12T09:00:00.000Z',
        currency: 'USD',
        warnings: []
      },
      priceSeries: [{ date: '2026-03-10', close: 5100 }],
      primarySignBands: [{ startDate: '2026-03-10', endDate: '2026-03-12', sign: 'Pisces' }],
      secondarySignRibbon: [{ startDate: '2026-03-10', endDate: '2026-03-12', sign: 'Aquarius' }],
      ingressEvents: [],
      correlation: {
        baselineUpRate: 0.55,
        baselineAverageReturnPct: 0.12,
        observations: 10,
        perPlanet: []
      }
    });

    const { GET } = await import('../../../../../src/routes/api/market-cosmos/timeline/+server');
    const response = await GET({
      url: new URL('http://localhost:5173/api/market-cosmos/timeline?symbol=^GSPC&range=1y&primaryPlanet=Jupiter&secondaryPlanet=Saturn')
    } as any);

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.meta.symbol).toBe('^GSPC');
    expect(buildTimelineMock).toHaveBeenCalledWith({
      symbol: '^GSPC',
      range: '1y',
      primaryPlanet: 'Jupiter',
      secondaryPlanet: 'Saturn'
    });
  });

  it('returns 400 for invalid symbol', async () => {
    const { GET } = await import('../../../../../src/routes/api/market-cosmos/timeline/+server');
    const response = await GET({
      url: new URL('http://localhost:5173/api/market-cosmos/timeline?symbol=BAD&range=1y')
    } as any);

    expect(response.status).toBe(400);
    expect(buildTimelineMock).not.toHaveBeenCalled();
  });

  it('returns 400 when primary and secondary planets are identical', async () => {
    const { GET } = await import('../../../../../src/routes/api/market-cosmos/timeline/+server');
    const response = await GET({
      url: new URL('http://localhost:5173/api/market-cosmos/timeline?symbol=^GSPC&primaryPlanet=Jupiter&secondaryPlanet=Jupiter')
    } as any);

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('must be different');
    expect(buildTimelineMock).not.toHaveBeenCalled();
  });

  it('returns 500 when timeline builder throws', async () => {
    buildTimelineMock.mockRejectedValue(new Error('upstream down'));
    const { GET } = await import('../../../../../src/routes/api/market-cosmos/timeline/+server');
    const response = await GET({
      url: new URL('http://localhost:5173/api/market-cosmos/timeline?symbol=^GSPC')
    } as any);

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain('timeline');
  });
});
