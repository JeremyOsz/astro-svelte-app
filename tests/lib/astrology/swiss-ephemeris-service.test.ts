// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/ephemeris', () => ({
  getEphemerisConfig: () => ({
    baseUrl: 'https://example.test',
    apiKey: 'test-key'
  })
}));

const fetchWithRetry = vi.fn();

vi.mock('$lib/server/http', () => ({
  fetchWithRetry: (...args: unknown[]) => fetchWithRetry(...args)
}));

import { SwissEphemerisService } from '../../../src/lib/astrology/swiss-ephemeris-service';

describe('SwissEphemerisService.calculateTransits', () => {
  beforeEach(() => {
    fetchWithRetry.mockReset();
    fetchWithRetry.mockResolvedValue({
      ok: true,
      json: async () => ({ planets: [], aspects: [] })
    });
  });

  it('uses the raw local civil date and time strings when provided', async () => {
    await SwissEphemerisService.calculateTransits(
      {
        planets: [],
        houses: [],
        ascendant: 0,
        mc: 0,
        date: new Date('1992-08-13T21:22:00Z'),
        latitude: 51.5072,
        longitude: -0.1276
      },
      new Date('2026-04-15T10:13:00Z'),
      'whole_sign',
      {
        latitude: 51.5072,
        longitude: -0.1276,
        name: 'London, GB'
      },
      {
        natalDateTime: {
          date: '1992-08-13',
          time: '22:22'
        },
        transitDateTime: {
          date: '2026-04-15',
          time: '11:13'
        }
      }
    );

    expect(fetchWithRetry).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchWithRetry.mock.calls[0];
    const body = JSON.parse(requestInit.body as string);

    expect(body).toMatchObject({
      natal_date: '1992-08-13',
      natal_time: '22:22:00',
      transit_date: '2026-04-15',
      transit_time: '11:13:00',
      transit_place: 'London, GB'
    });
  });
});
