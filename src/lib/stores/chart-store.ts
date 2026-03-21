import { derived, get, writable } from 'svelte/store';
import { chartStorageService, type SavedChart } from '../services/chart-storage';
import { URLSharingService } from '../services/url-sharing';
import type { User } from '@supabase/supabase-js';
import { logFeatureUsage } from '$lib/services/usage-logger';

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
  authUser: User | null;
  hasPendingLegacyImport: boolean;
}

function createChartStore() {
  const { subscribe, set, update } = writable<ChartState>({
    chartData: null,
    birthData: null,
    error: null,
    isLoading: false,
    version: 0,
    currentChartId: null,
    savedCharts: [],
    isSaving: false,
    authUser: null,
    hasPendingLegacyImport: false
  });

  async function refreshPeople() {
    try {
      const people = await chartStorageService.getAllCharts();
      update((state) => ({
        ...state,
        savedCharts: people,
        currentChartId:
          state.currentChartId && people.some((item) => item.id === state.currentChartId)
            ? state.currentChartId
            : (people[0]?.id ?? null),
        version: state.version + 1
      }));
    } catch (error) {
      update((state) => ({
        ...state,
        error: error instanceof Error ? error.message : 'Failed to load people',
        savedCharts: [],
        currentChartId: null,
        version: state.version + 1
      }));
    }
  }

  async function syncLegacyImportState(user: User | null) {
    if (!user) {
      update((state) => ({ ...state, hasPendingLegacyImport: false }));
      return;
    }

    const legacyCharts = chartStorageService.getLegacyLocalCharts();
    const hasImported = chartStorageService.getLegacyImportFlag(user.id);

    update((state) => ({
      ...state,
      hasPendingLegacyImport: legacyCharts.length > 0 && !hasImported
    }));
  }

  return {
    subscribe,

    setAuthUser: async (user: User | null) => {
      update((state) => ({ ...state, authUser: user, error: null }));

      await refreshPeople();
      await syncLegacyImportState(user);
    },

    importLegacyCharts: async () => {
      const activeUser = get(chartStore).authUser;

      if (!activeUser) {
        throw new Error('Please sign in to import local people');
      }

      const legacyCharts = chartStorageService.getLegacyLocalCharts().map((chart) => ({
        name: chart.name,
        birthData: chart.birthData,
        chartData: chart.chartData
      }));

      if (legacyCharts.length === 0) {
        chartStorageService.setLegacyImportFlag(activeUser.id);
        update((state) => ({ ...state, hasPendingLegacyImport: false }));
        return { importedCount: 0, skippedCount: 0 };
      }

      const result = await chartStorageService.importLegacyCharts(legacyCharts);
      chartStorageService.setLegacyImportFlag(activeUser.id);

      await refreshPeople();

      update((state) => ({
        ...state,
        hasPendingLegacyImport: false,
        version: state.version + 1
      }));

      void logFeatureUsage({
        feature: 'chart',
        action: 'import_local',
        route: '/chart',
        metadata: {
          importedCount: result.importedCount,
          skippedCount: result.skippedCount
        }
      });

      return result;
    },

    dismissLegacyImportPrompt: () => {
      const activeUser = get(chartStore).authUser;

      if (activeUser) {
        chartStorageService.setLegacyImportFlag(activeUser.id);
      }

      update((state) => ({ ...state, hasPendingLegacyImport: false, version: state.version + 1 }));
    },

    saveCurrentChart: async (name: string) => {
      update((state) => ({ ...state, isSaving: true, error: null }));

      try {
        const snapshot = get(chartStore);

        if (!snapshot.chartData || !snapshot.birthData) {
          throw new Error('No chart data available to save');
        }

        const savedChart = await chartStorageService.saveChart({
          name,
          birthData: snapshot.birthData,
          chartData: snapshot.chartData
        });

        await refreshPeople();

        update((state) => ({
          ...state,
          currentChartId: savedChart?.id ?? state.currentChartId,
          isSaving: false,
          version: state.version + 1
        }));

        void logFeatureUsage({
          feature: 'chart',
          action: 'save',
          route: '/chart',
          metadata: { chartId: savedChart?.id ?? null }
        });
      } catch (error) {
        update((state) => ({
          ...state,
          isSaving: false,
          error: error instanceof Error ? error.message : 'Failed to save person'
        }));
        throw error;
      }
    },

    loadChart: (chartId: string) => {
      update((state) => {
        const chart = state.savedCharts.find((item) => item.id === chartId);
        if (!chart) return state;

        return {
          ...state,
          chartData: chart.chartData,
          birthData: chart.birthData,
          currentChartId: chart.id,
          error: null,
          isLoading: false,
          version: state.version + 1
        };
      });
    },

    deleteChart: async (chartId: string) => {
      await chartStorageService.deleteChart(chartId);
      await refreshPeople();

      update((state) => ({
        ...state,
        currentChartId: state.currentChartId === chartId ? null : state.currentChartId,
        version: state.version + 1
      }));

      void logFeatureUsage({
        feature: 'chart',
        action: 'delete',
        route: '/chart',
        metadata: { chartId }
      });
    },

    updateChartName: async (chartId: string, name: string) => {
      await chartStorageService.updateChart(chartId, { name });
      await refreshPeople();

      void logFeatureUsage({
        feature: 'chart',
        action: 'rename',
        route: '/chart',
        metadata: { chartId }
      });
    },

    loadFromURL: async () => {
      const urlData = URLSharingService.parseURLParams();
      if (!urlData) return false;

      update((state) => ({ ...state, isLoading: true }));

      try {
        update((state) => ({
          ...state,
          birthData: urlData.birthData,
          isLoading: false,
          version: state.version + 1
        }));

        return true;
      } catch {
        update((state) => ({
          ...state,
          error: 'Failed to load chart from URL',
          isLoading: false
        }));
        return false;
      }
    },

    generateShareURL: (): string | null => {
      let currentState: ChartState | undefined;
      const unsubscribe = chartStore.subscribe((state) => {
        currentState = state;
      });
      unsubscribe();

      if (!currentState?.birthData) return null;

      return URLSharingService.generateShareURL({
        birthData: currentState.birthData,
        name: currentState.currentChartId
          ? currentState.savedCharts.find((item) => item.id === currentState?.currentChartId)?.name
          : undefined
      });
    },

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

    generateChartFromBirthData: async (birthData: BirthData) => {
      update((state) => ({ ...state, isLoading: true, error: null }));
      void logFeatureUsage({
        feature: 'chart',
        action: 'generate_submit',
        route: '/chart'
      });
      try {
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
        const response = await fetch('/chart?/calculate', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        let chartData: string | undefined;
        let birthDataResult: BirthData | undefined;

        if (result.data) {
          if (typeof result.data === 'string') {
            try {
              const arr = JSON.parse(result.data);
              for (const item of arr) {
                if (typeof item === 'string' && item.includes('\n')) chartData = item;
                if (typeof item === 'object' && item && item.date && item.time) birthDataResult = item;
              }
            } catch (parseError) {
              console.error('[generateChartFromBirthData] Failed to parse dehydrated array:', parseError);
            }
          } else if (typeof result.data === 'object') {
            chartData = result.data.chartData;
            birthDataResult = result.data.birthData;
          }
        }

        if (chartData) {
          update((state) => ({
            ...state,
            chartData,
            birthData: birthDataResult || birthData,
            isLoading: false,
            error: null,
            version: state.version + 1
          }));

          void logFeatureUsage({
            feature: 'chart',
            action: 'generate_success',
            route: '/chart'
          });
        } else {
          update((state) => ({
            ...state,
            isLoading: false,
            error: result.error || 'Failed to generate chart',
            version: state.version + 1
          }));

          void logFeatureUsage({
            feature: 'chart',
            action: 'generate_failure',
            route: '/chart',
            metadata: { reason: result.error || 'missing_chart_data' }
          });
        }
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to generate chart',
          version: state.version + 1
        }));

        void logFeatureUsage({
          feature: 'chart',
          action: 'generate_failure',
          route: '/chart',
          metadata: {
            reason: error instanceof Error ? error.message : 'unknown_error'
          }
        });
      }
    },

    setChartData: (chartData: string, birthData?: BirthData) => {
      update((state) => ({
        ...state,
        chartData,
        birthData: birthData || state.birthData,
        error: null,
        isLoading: false,
        version: state.version + 1
      }));
    },

    setError: (error: string) => {
      update((state) => ({
        ...state,
        error,
        chartData: null,
        isLoading: false,
        version: state.version + 1
      }));
    },

    setLoading: (isLoading: boolean) => {
      update((state) => ({
        ...state,
        isLoading,
        version: state.version + 1
      }));
    },

    clear: () => {
      const state = get(chartStore);
      set({
        chartData: null,
        birthData: null,
        error: null,
        isLoading: false,
        version: 0,
        currentChartId: null,
        savedCharts: state.savedCharts,
        isSaving: false,
        authUser: state.authUser,
        hasPendingLegacyImport: state.hasPendingLegacyImport
      });
    }
  };
}

export const chartStore = createChartStore();

export const currentChart = derived(chartStore, ($chartStore) => {
  if (!$chartStore.currentChartId) return null;
  return $chartStore.savedCharts.find((item) => item.id === $chartStore.currentChartId) || null;
});
