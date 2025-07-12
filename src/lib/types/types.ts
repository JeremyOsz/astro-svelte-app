export interface BirthData {
  date: string;       // ISO format date string (YYYY-MM-DD)
  time: string;       // 24-hour format (HH:MM)
  latitude: number;   // Decimal degrees (positive for North)
  longitude: number;  // Decimal degrees (positive for East)
  timezone: number;   // UTC offset in hours
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  sign: string;
  degree: number;
  house?: number;
  retrograde?: boolean;
}

export interface BirthChart {
  ascendant: number;
  mc: number;
  houses: number[];
  planets: PlanetPosition[];
  date: Date;
  latitude: number;
  longitude: number;
}