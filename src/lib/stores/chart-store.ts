import { writable } from 'svelte/store';

export interface ChartState {
  chartData: string | null;
  error: string | null;
  isLoading: boolean;
}

function createChartStore() {
  const { subscribe, set, update } = writable<ChartState>({
    chartData: null,
    error: null,
    isLoading: false
  });

  return {
    subscribe,
    setChartData: (chartData: string) => {
      update(state => ({
        ...state,
        chartData,
        error: null,
        isLoading: false
      }));
    },
    setError: (error: string) => {
      update(state => ({
        ...state,
        error,
        chartData: null,
        isLoading: false
      }));
    },
    setLoading: (isLoading: boolean) => {
      update(state => ({
        ...state,
        isLoading
      }));
    },
    clear: () => {
      set({
        chartData: null,
        error: null,
        isLoading: false
      });
    }
  };
}

export const chartStore = createChartStore(); 