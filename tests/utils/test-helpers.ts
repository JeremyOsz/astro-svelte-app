import { vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import type { BirthData } from '$lib/types/types';

export function createMockRequestEvent(
  method: string,
  body?: any,
  url?: string
): RequestEvent {
  const request = new Request(url || 'http://localhost:5173/api/test', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return {
    request,
    url: new URL(request.url),
    params: {},
    route: { id: 'test' },
    setHeaders: vi.fn(),
    cookies: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      getAll: vi.fn(),
      serialize: vi.fn(),
    },
    fetch: vi.fn(),
    getClientAddress: vi.fn(),
    isDataRequest: false,
    isSubRequest: false,
    platform: undefined,
    locals: {},
    depends: vi.fn(),
  } as RequestEvent;
}

export const mockBirthData: BirthData = {
  date: '1990-01-01',
  time: '12:00',
  latitude: 40.7128,
  longitude: -74.0060,
  timezone: -5,
};

export const mockBirthDataMinimal = {
  date: '1990-01-01',
  latitude: 40.7128,
  longitude: -74.0060,
};

export const mockTransitData = {
  natalChart: {
    ascendant: 180,
    mc: 270,
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    planets: [
      {
        name: 'Sun',
        longitude: 280,
        latitude: 0,
        distance: 1,
        sign: 'Capricorn',
        degree: 10,
      },
    ],
    date: new Date('1990-01-01T12:00:00Z'),
    latitude: 40.7128,
    longitude: -74.0060,
  },
  transitDate: '2024-01-01T12:00:00Z',
};

// Melbourne, Australia birth chart test data
export const melbourneBirthData = {
  date: '1990-01-01',
  time: '04:59',
  latitude: -37.8136,
  longitude: 144.9631,
  timezone: 11, // AEDT
};

// Expected planetary positions for Melbourne birth chart
export const expectedMelbournePlanets = [
  { name: 'Sun', sign: 'Sagittarius', degree: 17.15 }, // 17°09' = 17.15°
  { name: 'Moon', sign: 'Capricorn', degree: 26.33 }, // 26°20' = 26.33°
  { name: 'Mercury', sign: 'Sagittarius', degree: 14.47 }, // 14°28' = 14.47°
  { name: 'Venus', sign: 'Scorpio', degree: 4.0 },
  { name: 'Mars', sign: 'Sagittarius', degree: 7.6 }, // 7°36' = 7.6°
  { name: 'Jupiter', sign: 'Virgo', degree: 13.92 }, // 13°55' = 13.92°
  { name: 'Saturn', sign: 'Aquarius', degree: 3.53 }, // 3°32' = 3.53°
  { name: 'Uranus', sign: 'Capricorn', degree: 12.38 }, // 12°23' = 12.38°
  { name: 'Neptune', sign: 'Capricorn', degree: 15.4 }, // 15°24' = 15.4°
  { name: 'Pluto', sign: 'Scorpio', degree: 21.33 }, // 21°20' = 21.33°
];

// Expected angles for Melbourne birth chart
export const expectedMelbourneAngles = {
  ascendant: 267.67, // Sagittarius 1°40' = 267° + 1.67° = 268.67°
  mc: 130.23, // Leo 10°14' = 120° + 10.23° = 130.23°
};

// Helper function to convert zodiac sign to longitude
export function signToLongitude(sign: string, degree: number): number {
  const signLongitudes: Record<string, number> = {
    'Aries': 0,
    'Taurus': 30,
    'Gemini': 60,
    'Cancer': 90,
    'Leo': 120,
    'Virgo': 150,
    'Libra': 180,
    'Scorpio': 210,
    'Sagittarius': 240,
    'Capricorn': 270,
    'Aquarius': 300,
    'Pisces': 330,
  };
  return signLongitudes[sign] + degree;
} 