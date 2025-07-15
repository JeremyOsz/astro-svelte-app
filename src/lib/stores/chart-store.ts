import { writable } from 'svelte/store';

export interface BirthData {
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
}

export interface ChartState {
  chartData: string | null;
  birthData: BirthData | null;
  error: string | null;
  isLoading: boolean;
  version: number; // Add version number for reactivity
}

function createChartStore() {
  const { subscribe, set, update } = writable<ChartState>({
    chartData: null,
    birthData: null,
    error: null,
    isLoading: false,
    version: 0
  });

  return {
    subscribe,
    setChartData: (chartData: string, birthData?: BirthData) => {
      update(state => ({
        ...state,
        chartData,
        birthData: birthData || state.birthData,
        error: null,
        isLoading: false,
        version: state.version + 1 // Increment version to force reactivity
      }));
    },
    setError: (error: string) => {
      update(state => ({
        ...state,
        error,
        chartData: null,
        isLoading: false,
        version: state.version + 1
      }));
    },
    setLoading: (isLoading: boolean) => {
      update(state => ({
        ...state,
        isLoading,
        version: state.version + 1
      }));
    },
    clear: () => {
      set({
        chartData: null,
        birthData: null,
        error: null,
        isLoading: false,
        version: 0
      });
    }
  };
}

export const chartStore = createChartStore(); 