import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { z } from 'zod';
import { getEphemerisConfig } from '$lib/server/ephemeris';
import { fetchWithRetry } from '$lib/server/http';
import {
  ASTROLOGY_APP_RESOURCE_URI,
  renderAstrologyAppHtml
} from './astrology-app-html';
import {
  buildNatalChartFromChartData,
  compactChartSummary,
  convertTransitDataToChartData,
  parseChartData,
  transformChartData,
  type AstrologyBirthData,
  type HouseSystem
} from '$lib/server/astrology/chart-data';

const houseSystemSchema = z.enum(['whole_sign', 'placidus']).optional();

export const birthDataSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1).default('12:00'),
  place: z.string().min(1).optional(),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
  house_system: houseSystemSchema
});

export const calculateBirthChartInputSchema = {
  date: z.string().min(1).describe('Birth date in YYYY-MM-DD format.'),
  time: z.string().min(1).default('12:00').describe('Local birth time in HH:MM format. Use 12:00 if unknown.'),
  place: z.string().min(1).describe('Birth place label.'),
  latitude: z.number().finite().describe('Birth latitude in decimal degrees.'),
  longitude: z.number().finite().describe('Birth longitude in decimal degrees.'),
  house_system: houseSystemSchema.describe('Astrological house system.')
};

export const calculateTransitsInputSchema = {
  natal: birthDataSchema.describe('Natal birth data.'),
  transit_date: z.string().min(1).describe('Transit date in YYYY-MM-DD format.'),
  transit_time: z.string().min(1).default('12:00').describe('Transit local time in HH:MM format.'),
  transit_location: z
    .object({
      name: z.string().min(1),
      latitude: z.number().finite(),
      longitude: z.number().finite()
    })
    .optional(),
  house_system: houseSystemSchema
};

export const calculateSynastryInputSchema = {
  person1: birthDataSchema,
  person2: birthDataSchema,
  house_system: houseSystemSchema,
  relationship_type: z.enum(['romance', 'friendship', 'family', 'business']).default('romance').optional()
};

export const calculateDailyHoroscopeInputSchema = {
  natal: birthDataSchema,
  date: z.string().min(1).optional().describe('Horoscope date in YYYY-MM-DD format. Defaults to today.'),
  location: z
    .object({
      name: z.string().min(1),
      latitude: z.number().finite(),
      longitude: z.number().finite()
    })
    .optional()
};

function assertValidDate(value: string, label: string) {
  if (Number.isNaN(new Date(value).getTime())) {
    throw new Error(`Invalid ${label}`);
  }
}

function normalizeBirthData(input: z.infer<typeof birthDataSchema>, fallbackHouseSystem?: HouseSystem): AstrologyBirthData {
  assertValidDate(input.date, 'birth date');
  return {
    date: input.date,
    time: input.time || '12:00',
    place: input.place || 'Unknown Location',
    latitude: input.latitude,
    longitude: input.longitude,
    house_system: input.house_system || fallbackHouseSystem || 'whole_sign'
  };
}

async function fetchBirthChart(birthData: AstrologyBirthData): Promise<any> {
  const { baseUrl, apiKey } = getEphemerisConfig();
  const response = await fetchWithRetry(
    `${baseUrl}/birth-chart`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        date: birthData.date,
        time: birthData.time,
        place: birthData.place || 'Unknown Location',
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        house_system: birthData.house_system || 'whole_sign'
      })
    },
    { timeoutMs: 12_000, retries: 1 }
  );

  if (!response.ok) {
    throw new Error(`Birth chart API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function textResult(summary: string) {
  return [{ type: 'text' as const, text: summary }];
}

function titleForBirthData(prefix: string, birthData: AstrologyBirthData): string {
  return `${prefix}${birthData.place ? ` for ${birthData.place}` : ''}`;
}

function placementHighlights(chartData: string): string[] {
  return parseChartData(chartData)
    .placements.filter((placement) => ['Sun', 'Moon', 'ASC', 'MC'].includes(placement.planet))
    .map(
      (placement) =>
        `${placement.planet} in ${placement.sign}${placement.house ? `, house ${placement.house}` : ''}`
    );
}

export async function calculateBirthChartTool(rawInput: z.infer<z.ZodObject<typeof calculateBirthChartInputSchema>>) {
  const birthData = normalizeBirthData(birthDataSchema.parse(rawInput));
  const rawChart = await fetchBirthChart(birthData);
  const chartData = transformChartData(rawChart);
  const summary = compactChartSummary(chartData);

  const structuredContent = {
    kind: 'natal',
    title: titleForBirthData('Birth chart', birthData),
    subtitle: `${birthData.date} ${birthData.time} at ${birthData.place || 'Unknown Location'}`,
    date: birthData.date,
    house_system: birthData.house_system || 'whole_sign',
    birthData,
    chartData,
    summary: [summary],
    highlights: placementHighlights(chartData)
  };

  return {
    content: textResult(summary),
    structuredContent,
    _meta: { ui: { resourceUri: ASTROLOGY_APP_RESOURCE_URI } }
  };
}

export async function calculateTransitsTool(rawInput: z.infer<z.ZodObject<typeof calculateTransitsInputSchema>>) {
  const parsed = z.object(calculateTransitsInputSchema).parse(rawInput);
  const houseSystem = parsed.house_system || parsed.natal.house_system || 'whole_sign';
  const birthData = normalizeBirthData(parsed.natal, houseSystem);
  const rawChart = await fetchBirthChart(birthData);
  const natalChartData = transformChartData(rawChart);
  const natalChart = buildNatalChartFromChartData(birthData, natalChartData);
  assertValidDate(parsed.transit_date, 'transit date');
  const transitDateTime = new Date(`${parsed.transit_date}T${parsed.transit_time || '12:00'}:00`);
  const { SwissEphemerisService } = await import('$lib/astrology/swiss-ephemeris-service');

  const currentTransits = await SwissEphemerisService.calculateTransits(
    natalChart,
    transitDateTime,
    houseSystem,
    parsed.transit_location
      ? {
          latitude: parsed.transit_location.latitude,
          longitude: parsed.transit_location.longitude,
          name: parsed.transit_location.name
        }
      : undefined,
    {
      natalDateTime: { date: birthData.date, time: birthData.time },
      transitDateTime: { date: parsed.transit_date, time: parsed.transit_time || '12:00' }
    }
  );
  const transitChartData = convertTransitDataToChartData(currentTransits, natalChart);
  const summary = [
    `Natal chart: ${compactChartSummary(natalChartData)}`,
    `Transit placements: ${compactChartSummary(transitChartData)}`
  ];

  const structuredContent = {
    kind: 'transits',
    title: titleForBirthData('Transits', birthData),
    subtitle: `${parsed.transit_date} ${parsed.transit_time || '12:00'}${parsed.transit_location ? ` at ${parsed.transit_location.name}` : ''}`,
    date: parsed.transit_date,
    house_system: houseSystem,
    birthData,
    natalChartData,
    chartData: transitChartData,
    summary,
    highlights: placementHighlights(transitChartData)
  };

  return {
    content: textResult(summary.join('\n')),
    structuredContent,
    _meta: { ui: { resourceUri: ASTROLOGY_APP_RESOURCE_URI } }
  };
}

export async function calculateSynastryTool(rawInput: z.infer<z.ZodObject<typeof calculateSynastryInputSchema>>) {
  const parsed = z.object(calculateSynastryInputSchema).parse(rawInput);
  const houseSystem = parsed.house_system || 'whole_sign';
  const person1 = normalizeBirthData(parsed.person1, houseSystem);
  const person2 = normalizeBirthData(parsed.person2, houseSystem);
  const { baseUrl, apiKey } = getEphemerisConfig();
  const response = await fetchWithRetry(
    `${baseUrl}/synastry`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        person1,
        person2,
        house_system: houseSystem
      })
    },
    { timeoutMs: 12_000, retries: 1 }
  );

  if (!response.ok) {
    throw new Error(`Synastry API request failed: ${response.status} ${response.statusText}`);
  }

  const synastry = await response.json();
  const person1ChartData = transformChartData(synastry.person1_chart);
  const person2ChartData = transformChartData(synastry.person2_chart);
  const aspects = Array.isArray(synastry.aspects) ? synastry.aspects.slice(0, 20) : [];
  const summary = [
    `${person1.place || 'Person 1'}: ${compactChartSummary(person1ChartData)}`,
    `${person2.place || 'Person 2'}: ${compactChartSummary(person2ChartData)}`,
    `Top synastry aspects: ${aspects
      .slice(0, 8)
      .map((aspect: any) => `${aspect.person1Planet || aspect.planet1} ${aspect.aspect} ${aspect.person2Planet || aspect.planet2} orb ${aspect.orb}`)
      .join('; ') || 'none'}`
  ];

  const structuredContent = {
    kind: 'synastry',
    title: 'Synastry comparison',
    subtitle: `${person1.place || 'Person 1'} and ${person2.place || 'Person 2'}`,
    house_system: houseSystem,
    relationship_type: parsed.relationship_type || 'romance',
    person1,
    person2,
    person1ChartData,
    person2ChartData,
    aspects,
    house_overlays: synastry.house_overlays || [],
    composite_points: synastry.composite_points || [],
    summary
  };

  return {
    content: textResult(summary.join('\n')),
    structuredContent,
    _meta: { ui: { resourceUri: ASTROLOGY_APP_RESOURCE_URI } }
  };
}

export async function calculateDailyHoroscopeTool(
  rawInput: z.infer<z.ZodObject<typeof calculateDailyHoroscopeInputSchema>>
) {
  const parsed = z.object(calculateDailyHoroscopeInputSchema).parse(rawInput);
  const birthData = normalizeBirthData(parsed.natal);
  const rawChart = await fetchBirthChart(birthData);
  const chartData = transformChartData(rawChart);
  const natalChart = buildNatalChartFromChartData(birthData, chartData);
  if (parsed.date) assertValidDate(parsed.date, 'horoscope date');
  const date = parsed.date ? new Date(parsed.date) : new Date();
  const { DailyHoroscopeService } = await import('$lib/services/daily-horoscope');
  const dailyHoroscope = await DailyHoroscopeService.generateDailyHoroscope(
    natalChart,
    date,
    parsed.location
      ? {
          latitude: parsed.location.latitude,
          longitude: parsed.location.longitude,
          name: parsed.location.name
        }
      : undefined
  );
  const highlights = [
    dailyHoroscope?.theme,
    dailyHoroscope?.guidance,
    dailyHoroscope?.lunarPhase?.phase
  ].filter((item): item is string => typeof item === 'string' && item.length > 0);
  const summary = [
    compactChartSummary(chartData),
    `Daily theme: ${dailyHoroscope?.theme || 'not available'}`,
    `Guidance: ${dailyHoroscope?.guidance || 'not available'}`
  ];

  const structuredContent = {
    kind: 'daily_horoscope',
    title: titleForBirthData('Daily horoscope', birthData),
    subtitle: date.toISOString().split('T')[0],
    date: date.toISOString().split('T')[0],
    birthData,
    chartData,
    dailyHoroscope,
    highlights,
    summary
  };

  return {
    content: textResult(summary.join('\n')),
    structuredContent,
    _meta: { ui: { resourceUri: ASTROLOGY_APP_RESOURCE_URI } }
  };
}

export function createAstrologyMcpServer() {
  const server = new McpServer({
    name: 'osztrology-astrology-suite',
    version: '1.0.0'
  });

  registerAppResource(
    server,
    'OsztrOlogy Astrology App',
    ASTROLOGY_APP_RESOURCE_URI,
    {
      description: 'Interactive astrology visualisation for natal charts, transits, synastry, and daily horoscope results.'
    },
    async () => ({
      contents: [
        {
          uri: ASTROLOGY_APP_RESOURCE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: renderAstrologyAppHtml(),
          _meta: {
            ui: {
              csp: {
                connectDomains: [],
                resourceDomains: []
              }
            }
          }
        }
      ]
    })
  );

  const toolMeta = { ui: { resourceUri: ASTROLOGY_APP_RESOURCE_URI } };
  const annotations = { readOnlyHint: true };

  registerAppTool(
    server,
    'calculate_birth_chart',
    {
      title: 'Calculate Birth Chart',
      description:
        'Calculate a natal astrology chart from birth date, local time, and coordinates, then render an interactive chart wheel.',
      inputSchema: calculateBirthChartInputSchema,
      annotations,
      _meta: toolMeta
    },
    calculateBirthChartTool
  );

  registerAppTool(
    server,
    'calculate_transits',
    {
      title: 'Calculate Transits',
      description:
        'Calculate current or dated planetary transits against a natal chart and render the transit chart information.',
      inputSchema: calculateTransitsInputSchema,
      annotations,
      _meta: toolMeta
    },
    calculateTransitsTool
  );

  registerAppTool(
    server,
    'calculate_synastry',
    {
      title: 'Calculate Synastry',
      description:
        'Compare two birth charts for relationship astrology, including aspects, overlays, and an interactive chart view.',
      inputSchema: calculateSynastryInputSchema,
      annotations,
      _meta: toolMeta
    },
    calculateSynastryTool
  );

  registerAppTool(
    server,
    'calculate_daily_horoscope',
    {
      title: 'Calculate Daily Horoscope',
      description:
        'Generate a daily horoscope from natal birth data and render the natal context with horoscope highlights.',
      inputSchema: calculateDailyHoroscopeInputSchema,
      annotations,
      _meta: toolMeta
    },
    calculateDailyHoroscopeTool
  );

  return server;
}
