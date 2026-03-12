import { beforeEach, describe, expect, it, vi } from 'vitest';

const buildSnapshotMock = vi.fn();

vi.mock('$lib/server/market-cosmos', () => ({
  buildMarketCosmosSnapshot: buildSnapshotMock
}));

describe('/api/market-cosmos', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns a market-cosmos snapshot with valid lookbackDays', async () => {
    buildSnapshotMock.mockResolvedValue({
      generatedAt: '2026-03-12T09:00:00.000Z',
      lookbackDays: 14,
      assets: [],
      astrology: null,
      categorySummaries: [],
      warnings: []
    });

    const { GET } = await import('../../../../src/routes/api/market-cosmos/+server');

    const response = await GET({
      url: new URL('http://localhost:5173/api/market-cosmos?lookbackDays=14')
    } as any);

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.lookbackDays).toBe(14);
    expect(buildSnapshotMock).toHaveBeenCalledWith({ lookbackDays: 14 });
  });

  it('rejects invalid lookbackDays', async () => {
    const { GET } = await import('../../../../src/routes/api/market-cosmos/+server');

    const response = await GET({
      url: new URL('http://localhost:5173/api/market-cosmos?lookbackDays=500')
    } as any);

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('lookbackDays');
    expect(buildSnapshotMock).not.toHaveBeenCalled();
  });

  it('returns 500 when snapshot builder throws', async () => {
    buildSnapshotMock.mockRejectedValue(new Error('network down'));
    const { GET } = await import('../../../../src/routes/api/market-cosmos/+server');

    const response = await GET({
      url: new URL('http://localhost:5173/api/market-cosmos')
    } as any);

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain('market and astrological tracker');
  });
});
