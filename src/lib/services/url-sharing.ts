import type { BirthData } from '$lib/stores/chart-store';

export interface ShareableChartData {
  birthData: BirthData;
  name?: string;
}

export class URLSharingService {
  static encodeChartData(data: ShareableChartData): string {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(encodeURIComponent(jsonString));
    } catch (error) {
      console.error('Failed to encode chart data:', error);
      throw new Error('Failed to encode chart data');
    }
  }
  
  static decodeChartData(encodedData: string): ShareableChartData {
    try {
      const jsonString = decodeURIComponent(atob(encodedData));
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to decode chart data:', error);
      throw new Error('Invalid chart data');
    }
  }
  
  static generateShareURL(data: ShareableChartData): string {
    const encodedData = this.encodeChartData(data);
    const baseUrl = window.location.origin + '/chart';
    const params = new URLSearchParams();
    params.set('data', encodedData);
    
    if (data.name) {
      params.set('name', encodeURIComponent(data.name));
    }
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  static parseURLParams(): ShareableChartData | null {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (!encodedData) return null;
    
    try {
      return this.decodeChartData(encodedData);
    } catch (error) {
      console.error('Failed to parse URL parameters:', error);
      return null;
    }
  }
  
  static copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve();
    }
  }
} 