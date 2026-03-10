import { env } from '$env/dynamic/private';

const DEFAULT_EPHEMERIS_URL = 'https://immanuel-astro.onrender.com';

export function getEphemerisConfig() {
  const baseUrl = (env.EPHEMERIS_URL || DEFAULT_EPHEMERIS_URL).replace(/\/$/, '');
  const apiKey = env.EPHEMERIS_API_KEY || '';

  if (!apiKey) {
    throw new Error('EPHEMERIS_API_KEY is not configured');
  }

  return { baseUrl, apiKey };
}
