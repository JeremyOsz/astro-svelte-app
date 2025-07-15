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