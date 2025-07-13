declare global {
  interface Window {
    interpretationsData?: any;
    initChart?: (containerElement: HTMLElement, chartDataString: string, interpretationsData?: any) => Promise<void>;
  }
}

export {};

declare module 'astronomia' {
  export const julian: {
    DateToJD(date: Date): number;
  };
}

declare module 'astronomia/planetposition' {
  export class Planet {
    constructor(jd: number, planetName: string);
    lon: number;
    lat: number;
    range: number;
  }
}

declare module 'astronomia/moon' {
  export class Moon {
    constructor(jd: number);
    lon: number;
    lat: number;
    range: number;
  }
}

declare module 'astronomia/moonposition' {
  export function position(jd: number): {
    _ra: number;
    _dec: number;
    range: number;
    elongation?: number;
  };
}

declare module 'astronomia/solar' {
  export function apparentLongitude(jd: number): number;
  export function trueLongitude(jd: number): number;
  export function meanAnomaly(jd: number): number;
  export function eccentricity(jd: number): number;
  export function radius(jd: number): number;
}

declare module 'astronomia/coord' {
  export const coord: any;
}

declare module 'astronomia/nutation' {
  export const nutation: any;
}

declare module 'astronomia/precess' {
  export const precess: any;
} 