export interface BirthData {
  date: string;       // ISO format date string (YYYY-MM-DD) or datetime (YYYY-MM-DDTHH:MM)
  time: string;       // 24-hour format (HH:MM)
  latitude: number;   // Decimal degrees (positive for North)
  longitude: number;  // Decimal degrees (positive for East)
  // Removed timezone
  place?: string;     // Location name
  house_system?: 'whole_sign' | 'placidus'; // House system to use
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

export interface TransitData {
  planet: string;
  currentLongitude: number;
  currentSign: string;
  currentDegree: number;
  natalLongitude: number;
  natalSign: string;
  natalDegree: number;
  aspect?: {
    type: string;
    orb: number;
    exact: boolean;
  };
}

export interface Planet {
    name: string;
    longitude: number | { raw: number; formatted: string; degrees: number; minutes: number; seconds: number };
    latitude: number | { raw: number; formatted: string; degrees: number; minutes: number; seconds: number };
    distance: number;
    sign: string | { number: number; name: string; element: string; modality: string };
    degree: number;
    house?: number | { number: number; name: string };
    retrograde?: boolean;
    movement?: { direct: boolean; retrograde: boolean; formatted: string };
}

export interface HouseCusp {
    house: number;
    longitude: number;
}

export interface NatalChart {
    planets: Planet[];
    houses: HouseCusp[];
    ascendant: number;
    mc: number;
    date: Date;
    latitude: number;
    longitude: number;
}

export interface TransitChart {
    planets?: Planet[];
    objects?: Record<string, Planet>;
    houses?: Record<string, any>;
    aspects?: Record<string, any>;
    ascendant?: number;
    mc?: number;
    type?: string;
    house_system?: string;
    shape?: string;
    diurnal?: boolean;
    moon_phase?: any;
    native?: any;
    weightings?: any;
}

export interface TransitAspect {
    transitPlanet: Planet;
    natalPlanet: Planet;
    type: string;
    orb: number;
    color: string;
    style: string;
}