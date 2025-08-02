// DEPRECATED: This file is maintained for backward compatibility
// Please use the new modular structure in the 'interpretations/' directory

// Re-export everything from the new modular structure
export * from './interpretations/index';

// Legacy exports for backward compatibility
export { MAJOR_ASPECTS, ELEMENTS, HOUSES, PLANET_COMBINATIONS } from './interpretations/constants';
export { ASPECT_INTERPRETATIONS } from './interpretations/aspects';
export { SYNASTRY_ASPECT_INTERPRETATIONS } from './interpretations/synastry/synastry';
export { PLANET_INTERPRETATIONS, PLANET_IN_SIGN_INTERPRETATIONS } from './interpretations/planets';
export { SIGN_IN_HOUSE_INTERPRETATIONS } from './interpretations/houses';
export { 
    TRANSIT_INTERPRETATIONS,
    getTransitInterpretation,
    getTransitPlanetInHouseMeaning,
    getTransitPlanetInSignMeaning,
    getEnhancedTransitInterpretation
} from './interpretations/transits';

// Legacy type exports
export type {
    AspectInterpretation,
    TransitInterpretation,
    PlanetInterpretation,
    SignInterpretation,
    SynastryAspectInterpretation,
    SynastryHouseOverlay,
    SynastryPlanetInSign,
    PlanetName,
    ZodiacSign,
    HouseNumber,
    PlanetInSignInterpretations,
    SignInHouseInterpretations
} from './interpretations/types';

// Legacy function exports
export {
    getDetailedAspectInterpretation,
    getSynastryAspectInterpretation,
    getSynastryHouseOverlay,
    getSynastryPlanetInSign,
    getComprehensiveSynastryInterpretation,
    getSynastryCompatibilitySummary
} from './interpretations/index';

console.warn(
    'DEPRECATED: Importing from "@/lib/data/interpretations" is deprecated. ' +
    'Please use "@/lib/data/interpretations/index" for better tree-shaking and performance.'
);