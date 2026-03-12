import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  buildMarketCosmosTimeline,
  isIndexSymbol,
  isTimelinePlanet,
  isTimelineRange
} from '$lib/server/market-cosmos';
import type { IndexSymbol, TimelinePlanet, TimelineRange } from '$lib/types/market-cosmos';

const DEFAULT_RANGE: TimelineRange = '1y';
const DEFAULT_PRIMARY_PLANET: TimelinePlanet = 'Jupiter';
const DEFAULT_SECONDARY_PLANET: TimelinePlanet = 'Saturn';

export const GET: RequestHandler = async ({ url }) => {
  const rawSymbol = url.searchParams.get('symbol');
  const rawRange = url.searchParams.get('range') || DEFAULT_RANGE;
  const rawPrimaryPlanet = url.searchParams.get('primaryPlanet') || DEFAULT_PRIMARY_PLANET;
  const rawSecondaryPlanet = url.searchParams.get('secondaryPlanet') || DEFAULT_SECONDARY_PLANET;

  if (!rawSymbol || !isIndexSymbol(rawSymbol)) {
    return json({ error: 'Invalid symbol. Use one of ^GSPC, ^DJI, ^IXIC, ^FTSE, ^AXJO.' }, { status: 400 });
  }

  if (!isTimelineRange(rawRange)) {
    return json({ error: 'Invalid range. Use one of 6mo, 1y, 5y.' }, { status: 400 });
  }

  if (!isTimelinePlanet(rawPrimaryPlanet) || !isTimelinePlanet(rawSecondaryPlanet)) {
    return json({ error: 'Invalid planet. Use Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, or Pluto.' }, { status: 400 });
  }

  if (rawPrimaryPlanet === rawSecondaryPlanet) {
    return json({ error: 'primaryPlanet and secondaryPlanet must be different.' }, { status: 400 });
  }

  try {
    const timeline = await buildMarketCosmosTimeline({
      symbol: rawSymbol as IndexSymbol,
      range: rawRange as TimelineRange,
      primaryPlanet: rawPrimaryPlanet as TimelinePlanet,
      secondaryPlanet: rawSecondaryPlanet as TimelinePlanet
    });

    return json(timeline);
  } catch (error) {
    console.error('Error building market-cosmos timeline:', error);
    return json({ error: 'Failed to build market and astrological tracker timeline' }, { status: 500 });
  }
};
