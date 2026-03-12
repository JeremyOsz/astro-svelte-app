import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { buildMarketCosmosSnapshot } from '$lib/server/market-cosmos';

const DEFAULT_LOOKBACK_DAYS = 14;
const MIN_LOOKBACK_DAYS = 5;
const MAX_LOOKBACK_DAYS = 60;

export const GET: RequestHandler = async ({ url }) => {
  const rawLookback = url.searchParams.get('lookbackDays');
  const lookbackDays = rawLookback ? Number.parseInt(rawLookback, 10) : DEFAULT_LOOKBACK_DAYS;

  if (!Number.isInteger(lookbackDays) || lookbackDays < MIN_LOOKBACK_DAYS || lookbackDays > MAX_LOOKBACK_DAYS) {
    return json(
      { error: `Invalid lookbackDays. Use an integer between ${MIN_LOOKBACK_DAYS} and ${MAX_LOOKBACK_DAYS}.` },
      { status: 400 }
    );
  }

  try {
    const snapshot = await buildMarketCosmosSnapshot({ lookbackDays });
    return json(snapshot);
  } catch (error) {
    console.error('Error building market-cosmos snapshot:', error);
    return json({ error: 'Failed to build market and astrological tracker snapshot' }, { status: 500 });
  }
};
