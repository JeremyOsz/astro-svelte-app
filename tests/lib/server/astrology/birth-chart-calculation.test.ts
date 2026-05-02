import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../../../../src/lib/server/ephemeris', () => ({
  getEphemerisConfig: () => ({
    baseUrl: 'https://ephemeris.test',
    apiKey: 'test-key'
  })
}));

vi.mock('../../../../src/lib/server/http', () => ({
  fetchWithRetry: vi.fn()
}));

import { fetchWithRetry } from '../../../../src/lib/server/http';
import { calculateBirthChartFromFormData } from '../../../../src/lib/server/astrology/birth-chart-calculation';

const mockedFetchWithRetry = vi.mocked(fetchWithRetry);

function validFormData() {
  const formData = new FormData();
  formData.set('birthDate', '1990-01-01');
  formData.set('birthTime', '12:00');
  formData.set(
    'cityData',
    JSON.stringify({
      fullLocation: 'London, England, United Kingdom',
      lat: 51.5072,
      lng: -0.1276
    })
  );
  return formData;
}

describe('calculateBirthChartFromFormData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates a chart from unprefixed birth chart form fields', async () => {
    mockedFetchWithRetry.mockResolvedValue({
      ok: true,
      json: async () => ({
        planets: [{ name: 'Sun', longitude: 280, sign: 'Capricorn', degree: 10 }],
        ascendant: 1.5,
        mc: 120,
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
      })
    } as Response);

    const result = await calculateBirthChartFromFormData(validFormData());

    expect(result.birthData).toEqual({
      date: '1990-01-01',
      time: '12:00',
      place: 'London, England, United Kingdom',
      latitude: 51.5072,
      longitude: -0.1276
    });
    expect(result.chartData).toContain("Sun,Capricorn,10°00'");
    expect(result.chartData).toContain("ASC,Aries,1°30'");
    expect(mockedFetchWithRetry).toHaveBeenCalledWith(
      'https://ephemeris.test/birth-chart',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-API-Key': 'test-key'
        }),
        body: JSON.stringify({
          date: '1990-01-01',
          time: '12:00',
          place: 'London, England, United Kingdom',
          latitude: 51.5072,
          longitude: -0.1276,
          house_system: 'whole_sign'
        })
      }),
      { timeoutMs: 12_000, retries: 1 }
    );
  });

  it('accepts prefixed form field names used by existing chart forms', async () => {
    mockedFetchWithRetry.mockResolvedValue({
      ok: true,
      json: async () => ({ planets: [], ascendant: 0, mc: 90 })
    } as Response);

    const formData = new FormData();
    formData.set('poetic_birthDate', '1991-02-03');
    formData.set('poetic_birthTime', '04:05');
    formData.set(
      'poetic_cityData',
      JSON.stringify({
        fullLocation: 'Paris, France',
        lat: 48.8566,
        lng: 2.3522
      })
    );

    const result = await calculateBirthChartFromFormData(formData, ['poetic_']);

    expect(result.birthData.place).toBe('Paris, France');
    expect(result.birthData.latitude).toBe(48.8566);
  });

  it('throws a validation error when coordinates are invalid', async () => {
    const formData = validFormData();
    formData.set(
      'cityData',
      JSON.stringify({
        fullLocation: 'Nowhere',
        lat: 'not-a-number',
        lng: -0.1276
      })
    );

    await expect(calculateBirthChartFromFormData(formData)).rejects.toThrow(
      'Invalid location coordinates'
    );
    expect(mockedFetchWithRetry).not.toHaveBeenCalled();
  });
});
