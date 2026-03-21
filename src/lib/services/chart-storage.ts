import type { BirthData } from '$lib/stores/chart-store';

export interface PersonRecord {
  id: string;
  userId?: string;
  anonymousId?: string;
  name: string;
  birthData: BirthData;
  chartData: string;
  createdAt: string;
  updatedAt: string;
}

export type SavedChart = PersonRecord;

export interface LegacyChartStorage {
  savedCharts: Array<{
    id: string;
    name: string;
    birthData: BirthData;
    chartData: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }>;
}

class ChartStorageService {
  private readonly LEGACY_STORAGE_KEY = 'astro-charts-data';

  async saveChart(chart: Omit<PersonRecord, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'anonymousId'>): Promise<PersonRecord> {
    const response = await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chart)
    });

    if (!response.ok) {
      throw new Error('Failed to save person');
    }

    const payload = await response.json();
    return payload.person;
  }

  async updateChart(id: string, updates: Partial<PersonRecord>): Promise<PersonRecord | null> {
    const response = await fetch(`/api/people/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to update person');
    }

    const payload = await response.json();
    return payload.person;
  }

  async deleteChart(id: string): Promise<boolean> {
    const response = await fetch(`/api/people/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error('Failed to delete person');
    }

    return true;
  }

  async getAllCharts(): Promise<PersonRecord[]> {
    const response = await fetch('/api/people');

    if (!response.ok) {
      throw new Error('Failed to load people');
    }

    const payload = await response.json();
    return payload.people ?? [];
  }

  getLegacyLocalCharts(): PersonRecord[] {
    if (typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(this.LEGACY_STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw) as LegacyChartStorage;
      if (!parsed?.savedCharts || !Array.isArray(parsed.savedCharts)) {
        return [];
      }

      return parsed.savedCharts
        .filter((chart) => chart?.name && chart?.birthData && chart?.chartData)
        .map((chart) => ({
          id: chart.id,
          name: chart.name,
          birthData: chart.birthData,
          chartData: chart.chartData,
          createdAt: this.safeToISOString(chart.createdAt),
          updatedAt: this.safeToISOString(chart.updatedAt)
        }));
    } catch {
      return [];
    }
  }

  getLegacyImportFlag(userId: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.getLegacyImportFlagKey(userId)) === '1';
  }

  setLegacyImportFlag(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.getLegacyImportFlagKey(userId), '1');
  }

  async importLegacyCharts(people: Omit<PersonRecord, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'anonymousId'>[]) {
    const response = await fetch('/api/people/import-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ people })
    });

    if (!response.ok) {
      throw new Error('Failed to import local people');
    }

    return response.json() as Promise<{ importedCount: number; skippedCount: number }>;
  }

  private getLegacyImportFlagKey(userId: string): string {
    return `astro-charts-imported:${userId}`;
  }

  private safeToISOString(value?: string | Date): string {
    if (!value) return new Date().toISOString();
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }
    return parsed.toISOString();
  }
}

export const chartStorageService = new ChartStorageService();
