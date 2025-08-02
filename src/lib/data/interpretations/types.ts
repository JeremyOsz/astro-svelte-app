// Shared types for astrological interpretations

export interface AspectInterpretation {
    general: string;
    orb: string;
    nature: string;
    planets: Record<string, string>;
}

export interface TransitInterpretation {
    aspect: string;
    transitPlanet: string;
    natalPlanet: string;
    interpretation: string;
}

export interface PlanetInterpretation {
    description: string;
    keywords: string[];
}

export interface SignInterpretation {
    general: string;
    orb: string;
    nature: string;
    planets: Record<string, string>;
}

export interface SynastryAspectInterpretation {
    aspect: string;
    person1Planet: string;
    person2Planet: string;
    interpretation: string;
    compatibility: 'harmonious' | 'challenging' | 'neutral';
    intensity: 'strong' | 'moderate' | 'weak';
    romance?: string;
    friendship?: string;
    family?: string;
    business?: string;
}

export interface SynastryHouseOverlay {
    person2Planet: string;
    person1House: number;
    interpretation: string;
    themes: string[];
}

export interface SynastryPlanetInSign {
    person2Planet: string;
    person1Sign: string;
    interpretation: string;
    compatibility: 'harmonious' | 'challenging' | 'neutral';
}

// Types for planet in sign and sign in house interpretations
export type PlanetName = 
  | "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" 
  | "Uranus" | "Neptune" | "Pluto" | "Node" | "Lilith" | "Chiron" | "Fortune" | "Vertex";

export type ZodiacSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo" 
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type HouseNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export type PlanetInSignInterpretations = {
    [planet in PlanetName]: {
        [sign in ZodiacSign]: string;
    };
}

export type SignInHouseInterpretations = {
    [sign in ZodiacSign]: {
        [house in HouseNumber]: string;
    };
} 