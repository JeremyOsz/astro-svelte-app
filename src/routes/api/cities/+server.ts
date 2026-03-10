import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import citiesData from 'cities.json';
import { checkRateLimit } from '$lib/server/rate-limit';
import { getClientIp } from '$lib/server/request-utils';

interface City {
  name: string;
  lat: string;
  lng: string;
  country: string;
  admin1: string;
  admin2?: string;
}

interface CitySearchResult extends City {
  displayName: string;
  fullLocation: string;
}

const cities = citiesData as City[];

function getCountryName(countryCode: string): string {
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return displayNames.of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
}

export const GET: RequestHandler = async ({ url, request }) => {
  const query = (url.searchParams.get('q') || '').trim();
  const rawLimit = Number.parseInt(url.searchParams.get('limit') || '10', 10);
  const limit = Math.min(50, Math.max(1, Number.isNaN(rawLimit) ? 10 : rawLimit));

  if (query.length < 2) {
    return json({ results: [] });
  }

  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`cities:${clientIp}`, 120, 60_000);
  if (!rate.allowed) {
    return json(
      { error: 'Too many city searches. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
    );
  }

  const normalizedQuery = query.toLowerCase();

  const results: CitySearchResult[] = cities
    .filter((city) => city.name.toLowerCase().includes(normalizedQuery))
    .map((city) => {
      const name = city.name.toLowerCase();
      let score = 3;
      if (name === normalizedQuery) score = 0;
      else if (name.startsWith(normalizedQuery)) score = 1;
      else if (name.includes(normalizedQuery)) score = 2;
      return { city, score };
    })
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.city.name.localeCompare(b.city.name);
    })
    .slice(0, limit)
    .map(({ city }) => {
      const countryName = getCountryName(city.country);
      const fullLocation = `${city.name}, ${countryName}`;
      return {
        ...city,
        displayName: fullLocation,
        fullLocation
      };
    });

  return json({ results });
};
