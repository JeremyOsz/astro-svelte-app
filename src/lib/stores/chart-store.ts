import { writable, derived } from 'svelte/store';
import { chartStorageService, type SavedChart } from '../services/chart-storage';
import { URLSharingService } from '../services/url-sharing';

// Re-export SavedChart type for components
export type { SavedChart } from '../services/chart-storage';

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
  version: number;
  currentChartId: string | null;
  savedCharts: SavedChart[];
  isSaving: boolean;
}

function createChartStore() {
  const { subscribe, set, update } = writable<ChartState>({
    chartData: null,
    birthData: null,
    error: null,
    isLoading: false,
    version: 0,
    currentChartId: null,
    savedCharts: chartStorageService.getAllCharts(),
    isSaving: false
  });

  return {
    subscribe,
    
    // Save current chart
    saveCurrentChart: async (name: string) => {
      update(state => ({ ...state, isSaving: true }));
      
      try {
        update(state => {
          if (!state.chartData || !state.birthData) return state;
          
          const savedChart = chartStorageService.saveChart({
            name,
            birthData: state.birthData,
            chartData: state.chartData
          });
          
          return {
            ...state,
            currentChartId: savedChart.id,
            savedCharts: chartStorageService.getAllCharts(),
            version: state.version + 1,
            isSaving: false
          };
        });
      } catch (error) {
        update(state => ({ ...state, isSaving: false }));
        throw error;
      }
    },
    
    // Load saved chart
    loadChart: (chartId: string) => {
      const chart = chartStorageService.getChart(chartId);
      if (!chart) return;
      
      update(state => ({
        ...state,
        chartData: chart.chartData,
        birthData: chart.birthData,
        currentChartId: chart.id,
        error: null,
        isLoading: false,
        version: state.version + 1
      }));
    },
    
    // Delete saved chart
    deleteChart: (chartId: string) => {
      chartStorageService.deleteChart(chartId);
      update(state => ({
        ...state,
        savedCharts: chartStorageService.getAllCharts(),
        currentChartId: state.currentChartId === chartId ? null : state.currentChartId,
        version: state.version + 1
      }));
    },
    
    // Update chart name
    updateChartName: (chartId: string, name: string) => {
      chartStorageService.updateChart(chartId, { name });
      update(state => ({
        ...state,
        savedCharts: chartStorageService.getAllCharts(),
        version: state.version + 1
      }));
    },
    
    // Load from URL parameters
    loadFromURL: async () => {
      const urlData = URLSharingService.parseURLParams();
      if (!urlData) return false;
      
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Here you would call your API to generate chart data
        // For now, we'll just set the birth data
        update(state => ({
          ...state,
          birthData: urlData.birthData,
          isLoading: false,
          version: state.version + 1
        }));
        
        return true;
      } catch (error) {
        update(state => ({ 
          ...state, 
          error: 'Failed to load chart from URL',
          isLoading: false 
        }));
        return false;
      }
    },
    
    // Generate share URL
    generateShareURL: (): string | null => {
      let currentState: ChartState;
      chartStore.subscribe(state => {
        currentState = state;
      })();
      
      if (!currentState!.birthData) return null;
      
      return URLSharingService.generateShareURL({
        birthData: currentState!.birthData,
        name: currentState!.currentChartId ? 
          currentState!.savedCharts.find(c => c.id === currentState!.currentChartId)?.name : 
          undefined
      });
    },
    
    // Copy share URL to clipboard
    copyShareURL: async (): Promise<boolean> => {
      const shareURL = chartStore.generateShareURL();
      if (!shareURL) return false;
      
      try {
        await URLSharingService.copyToClipboard(shareURL);
        return true;
      } catch (error) {
        console.error('Failed to copy URL:', error);
        return false;
      }
    },
    
    // Existing methods...
    setChartData: (chartData: string, birthData?: BirthData) => {
      update(state => ({
        ...state,
        chartData,
        birthData: birthData || state.birthData,
        error: null,
        isLoading: false,
        version: state.version + 1
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
        version: 0,
        currentChartId: null,
        savedCharts: chartStorageService.getAllCharts(),
        isSaving: false
      });
    }
  };
}

export const chartStore = createChartStore();

// Derived store for current chart info
export const currentChart = derived(chartStore, ($chartStore) => {
  if (!$chartStore.currentChartId) return null;
  return $chartStore.savedCharts.find(c => c.id === $chartStore.currentChartId) || null;
});

 