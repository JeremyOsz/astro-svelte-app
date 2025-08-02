// Synastry interpretations refactored to follow aspects.ts structure
import { CONJUNCTION_INTERPRETATIONS } from './conjunction';
import { OPPOSITION_INTERPRETATIONS } from './opposition';
import { TRINE_INTERPRETATIONS } from './trine';
import { SQUARE_INTERPRETATIONS } from './square';
import { SEXTILE_INTERPRETATIONS } from './sextile';
import { QUINCUNX_INTERPRETATIONS } from './quincunx';
import { ANGULAR_ASPECT_INTERPRETATIONS } from './angular-aspects';
import { MINOR_ASPECT_INTERPRETATIONS } from './minor-aspects';

// Synastry aspect interpretations organized by aspect type
export const SYNASTRY_ASPECT_INTERPRETATIONS = {
    "Conjunction": CONJUNCTION_INTERPRETATIONS,
    "Opposition": OPPOSITION_INTERPRETATIONS,
    "Trine": TRINE_INTERPRETATIONS,
    "Square": SQUARE_INTERPRETATIONS,
    "Sextile": SEXTILE_INTERPRETATIONS,
    "Quincunx": QUINCUNX_INTERPRETATIONS,
    "Angular": ANGULAR_ASPECT_INTERPRETATIONS,
    "Minor": MINOR_ASPECT_INTERPRETATIONS
} as const; 