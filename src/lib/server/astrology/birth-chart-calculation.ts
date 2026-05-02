import { getEphemerisConfig } from '$lib/server/ephemeris';
import { fetchWithRetry } from '$lib/server/http';
import { transformChartData } from '$lib/server/astrology/chart-data';
import type { BirthData } from '$lib/stores/chart-store';

export interface BirthChartCalculationResult {
  chartData: string;
  birthData: BirthData;
  error: null;
}

export class BirthChartValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BirthChartValidationError';
  }
}

const DEFAULT_FIELD_PREFIXES = ['', 'mobile_', 'desktop_'];

function getFormValue(formData: FormData, fieldName: string, prefixes: string[]): string {
  for (const prefix of prefixes) {
    const value = formData.get(`${prefix}${fieldName}`);
    if (typeof value === 'string' && value.trim()) return value;
  }

  return '';
}

export async function calculateBirthChartFromFormData(
  formData: FormData,
  fieldPrefixes: string[] = DEFAULT_FIELD_PREFIXES
): Promise<BirthChartCalculationResult> {
  const prefixes = Array.from(new Set([...fieldPrefixes, ...DEFAULT_FIELD_PREFIXES]));
  const birthDate = getFormValue(formData, 'birthDate', prefixes);
  const birthTime = getFormValue(formData, 'birthTime', prefixes);
  const cityDataStr = getFormValue(formData, 'cityData', prefixes);

  if (!birthDate || !birthTime || !cityDataStr) {
    throw new BirthChartValidationError('Please fill in all required fields');
  }

  const cityData = JSON.parse(cityDataStr);
  const latitude = Number.parseFloat(String(cityData.lat));
  const longitude = Number.parseFloat(String(cityData.lng));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new BirthChartValidationError('Invalid location coordinates');
  }

  const apiData = {
    date: birthDate,
    time: birthTime,
    place: cityData.fullLocation,
    latitude,
    longitude,
    house_system: 'whole_sign'
  };

  const { baseUrl, apiKey } = getEphemerisConfig();
  const response = await fetchWithRetry(
    `${baseUrl}/birth-chart`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(apiData)
    },
    { timeoutMs: 12_000, retries: 1 }
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const chartResult = await response.json();
  const chartData = transformChartData(chartResult);
  const birthData = {
    date: birthDate,
    time: birthTime,
    place: cityData.fullLocation,
    latitude,
    longitude
  };

  return {
    chartData,
    birthData,
    error: null
  };
}
