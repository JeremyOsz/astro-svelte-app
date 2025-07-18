import type { BirthData } from '$lib/stores/chart-store';

export interface SavedChart {
  id: string;
  name: string;
  birthData: BirthData;
  chartData: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartStorage {
  savedCharts: SavedChart[];
  lastViewedChartId?: string;
  settings: {
    autoSave: boolean;
    defaultHouseSystem: 'whole_sign' | 'placidus';
  };
}

class ChartStorageService {
  private readonly STORAGE_KEY = 'astro-charts-data';
  
  saveChart(chart: Omit<SavedChart, 'id' | 'createdAt' | 'updatedAt'>): SavedChart {
    const storage = this.getStorage();
    const newChart: SavedChart = {
      ...chart,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.savedCharts.push(newChart);
    storage.lastViewedChartId = newChart.id;
    this.setStorage(storage);
    
    return newChart;
  }
  
  updateChart(id: string, updates: Partial<SavedChart>): SavedChart | null {
    const storage = this.getStorage();
    const chartIndex = storage.savedCharts.findIndex(c => c.id === id);
    
    if (chartIndex === -1) return null;
    
    storage.savedCharts[chartIndex] = {
      ...storage.savedCharts[chartIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.setStorage(storage);
    return storage.savedCharts[chartIndex];
  }
  
  deleteChart(id: string): boolean {
    const storage = this.getStorage();
    const initialLength = storage.savedCharts.length;
    storage.savedCharts = storage.savedCharts.filter(c => c.id !== id);
    
    if (storage.lastViewedChartId === id) {
      storage.lastViewedChartId = storage.savedCharts[0]?.id;
    }
    
    this.setStorage(storage);
    return storage.savedCharts.length < initialLength;
  }
  
  getChart(id: string): SavedChart | null {
    const storage = this.getStorage();
    return storage.savedCharts.find(c => c.id === id) || null;
  }
  
  getAllCharts(): SavedChart[] {
    return this.getStorage().savedCharts;
  }
  
  getLastViewedChart(): SavedChart | null {
    const storage = this.getStorage();
    if (!storage.lastViewedChartId) return null;
    return this.getChart(storage.lastViewedChartId);
  }
  
  private getStorage(): ChartStorage {
    if (typeof window === 'undefined') {
      return { 
        savedCharts: [],
        settings: {
          autoSave: true,
          defaultHouseSystem: 'whole_sign'
        }
      };
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : { savedCharts: [] };
      
      // Ensure settings exist
      if (!parsed.settings) {
        parsed.settings = {
          autoSave: true,
          defaultHouseSystem: 'whole_sign'
        };
      }
      
      return parsed;
    } catch {
      return { 
        savedCharts: [],
        settings: {
          autoSave: true,
          defaultHouseSystem: 'whole_sign'
        }
      };
    }
  }
  
  private setStorage(storage: ChartStorage): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Failed to save chart data:', error);
    }
  }
}

export const chartStorageService = new ChartStorageService(); 