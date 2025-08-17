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
    
    // Generate chart from birth data (for auto-generation from shared URL)
    generateChartFromBirthData: async (birthData: BirthData) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      try {
        // Prepare city data in the format expected by the server
        const cityData = {
          name: birthData.place.split(',')[0],
          fullLocation: birthData.place,
          lat: birthData.latitude,
          lng: birthData.longitude,
          country: '',
          adminName: ''
        };
        const formData = new FormData();
        formData.set('birthDate', birthData.date);
        formData.set('birthTime', birthData.time);
        formData.set('cityData', JSON.stringify(cityData));
        // POST to the server endpoint
        const response = await fetch('/chart?/calculate', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        console.log('[generateChartFromBirthData] API result:', result);
        let chartData: string | undefined, birthDataResult: BirthData | undefined;
        // Handle SvelteKit action response (dehydrated array) or plain object
        if (result.data) {
          if (typeof result.data === 'string') {
            // Try to parse as JSON
            try {
              const arr = JSON.parse(result.data);
              // SvelteKit dehydrated array: [fieldMap, chartData, birthData, ...]
              // Find chartData (string with newlines) and birthData (object with date/time/place/lat/lng)
              // Heuristic: chartData is a string with newlines, birthData is an object with date/time
              for (const item of arr) {
                if (typeof item === 'string' && item.includes('\n')) chartData = item;
                if (typeof item === 'object' && item && item.date && item.time) birthDataResult = item;
              }
            } catch (e) {
              console.error('[generateChartFromBirthData] Failed to parse dehydrated array:', e);
            }
          } else if (typeof result.data === 'object') {
            // Plain object
            chartData = result.data.chartData;
            birthDataResult = result.data.birthData;
          }
        }
        if (chartData) {
          console.log('[generateChartFromBirthData] Setting chartData:', chartData);
          update(state => ({
            ...state,
            chartData,
            birthData: birthDataResult || birthData,
            isLoading: false,
            error: null,
            version: state.version + 1
          }));
        } else {
          console.error('[generateChartFromBirthData] No chartData in result:', result);
          update(state => ({
            ...state,
            isLoading: false,
            error: result.error || 'Failed to generate chart',
            version: state.version + 1
          }));
        }
      } catch (error) {
        console.error('[generateChartFromBirthData] Exception:', error);
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to generate chart',
          version: state.version + 1
        }));
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

 