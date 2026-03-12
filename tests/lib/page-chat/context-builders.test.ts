import { describe, expect, it } from 'vitest';

import {
  buildChartPageContext,
  buildSynastryPageContext,
  buildTarotPageContext,
  buildTransitsPageContext
} from '../../../src/lib/page-chat/context-builders';
import type { TarotCard } from '../../../src/lib/data/tarot-data';

const tarotCard = {
  name: 'The Fool',
  keywords: ['Beginnings', 'Freedom', 'Trust'],
  upright: {
    general: 'A leap into new territory.',
    love: 'Fresh openness in love.',
    career: 'A new path appears.',
    health: 'Trust your energy.'
  },
  reversed: {
    general: 'Impulsive or unfocused movement.',
    love: 'Caution around mixed signals.',
    career: 'Avoid rash choices.',
    health: 'Ground yourself.'
  }
} as TarotCard;

describe('context builders', () => {
  it('builds chart page context from chart data', () => {
    const context = buildChartPageContext({
      birthData: {
        date: '1990-01-01',
        time: '12:00',
        place: 'London',
        latitude: 51.5,
        longitude: -0.12
      },
      chartData: `Sun,Aries,10°20',1\nMoon,Cancer,03°10',4\nASC,Leo,22°00'`,
      interpretationFilter: 'moon',
      showChart: true,
      showDegreeMarkers: true,
      showExtendedPlanets: true,
      showAspectLines: true,
      showPlanetLabels: false,
      zoomLevel: 1.2,
      savedChartsCount: 3
    });

    expect(context).toContain('Page: Birth Chart');
    expect(context).toContain('Birth data: 1990-01-01 12:00 at London');
    expect(context).toContain('Sun 10°20\' Aries house 1');
  });

  it('builds synastry context from calculated results', () => {
    const context = buildSynastryPageContext({
      relationshipType: 'romance',
      isChartReady: true,
      loading: false,
      storedPerson1Data: { name: 'Ava', date: '1990-01-01', city: 'London' },
      storedPerson2Data: { name: 'Noah', date: '1991-02-02', city: 'New York' },
      synastryAspects: [{ person1Planet: 'Sun', aspect: 'Trine', person2Planet: 'Moon', orb: 1.5 }],
      mainAspects: [{}],
      angularAspects: [],
      minorAspects: [],
      synastryHouseOverlays: [{ house: 7 }],
      synastryPlanetInSigns: [{ point: 'Vertex' }]
    });

    expect(context).toContain('Page: Synastry');
    expect(context).toContain('People: Ava and Noah');
    expect(context).toContain('Sun Trine Moon orb 1.50');
  });

  it('builds transits context from selected chart and transit data', () => {
    const context = buildTransitsPageContext({
      selectedBirthChart: {
        name: 'Test Chart',
        birthData: { date: '1990-01-01', time: '12:00', place: 'London' }
      },
      transitDate: '2026-03-12',
      transitTime: '14:30',
      selectedTransitCityData: { fullLocation: 'London, United Kingdom' },
      currentTransits: {
        planets: [{ name: 'Jupiter', sign: { name: 'Cancer' } }]
      },
      natalChart: {
        planets: [{ name: 'Sun', sign: { name: 'Aries' } }]
      },
      chartReady: true,
      preparingChart: false,
      loading: false
    });

    expect(context).toContain('Page: Transits');
    expect(context).toContain('Selected chart: Test Chart');
    expect(context).toContain('Jupiter in Cancer');
  });

  it('builds tarot context from selected card state', () => {
    const context = buildTarotPageContext({
      searchTerm: 'fool',
      selectedSuit: 'major',
      filteredCount: 1,
      totalCount: 78,
      showReversed: false,
      selectedCard: tarotCard
    });

    expect(context).toContain('Page: Tarot');
    expect(context).toContain('Selected card: The Fool');
    expect(context).toContain('Current interpretation focus: A leap into new territory.');
  });
});
