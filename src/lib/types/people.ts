import type { BirthData } from '$lib/stores/chart-store';

export interface PersonRecord {
  id: string;
  userId?: string;
  name: string;
  birthData: BirthData;
  chartData: string;
  createdAt: string;
  updatedAt: string;
}
