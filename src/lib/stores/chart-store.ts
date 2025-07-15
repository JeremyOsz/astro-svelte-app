import { writable } from 'svelte/store';

export interface ChartState {
  chartData: string | null;
  error: string | null;
  isLoading: boolean;
  version: number; // Add version number for reactivity
}

function createChartStore() {
  const { subscribe, set, update } = writable<ChartState>({
    chartData: null,
    error: null,
    isLoading: false,
    version: 0
  });

  return {
    subscribe,
    setChartData: (chartData: string) => {
      update(state => ({
        ...state,
        chartData,
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
        error: null,
        isLoading: false,
        version: 0
      });
    }
  };
}

export const chartStore = createChartStore(); 