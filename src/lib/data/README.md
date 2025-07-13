# Astrological Data

This directory contains all consolidated astrological data for the application. Previously, this data was scattered across multiple files in `@/lib` and `@/static` folders.

## Structure

### `astrological-data.ts`
Contains all astrological constants and reference data:
- Zodiac signs, symbols, and colors
- Planet symbols and names
- Aspect definitions and properties
- Chart layout constants
- Planet IDs for Swiss Ephemeris

### `interpretations.ts`
Contains all interpretation data:
- Major aspect meanings
- Detailed aspect interpretations for specific planet combinations
- Transit interpretation functions
- Planet combination meanings

### `chart-styles.ts`
Contains all CSS styles for astrological charts:
- Chart container styles
- Planet and zodiac symbol styles
- Aspect line styles
- Responsive design
- Dark mode support
- Accessibility features

### `index.ts`
Provides a single entry point for importing all data:
```typescript
import { 
  ZODIAC_SIGNS, 
  PLANET_SYMBOLS, 
  ASPECT_DEFINITIONS,
  getTransitInterpretation,
  injectChartStyles 
} from '@/lib/data';
```

## Migration Guide

### Before (Scattered Data)
```typescript
// Data was scattered across multiple files
import { getTransitInterpretation } from './transit-interpretations';
import { ZODIAC_SIGNS } from './some-other-file';
import './chart/styles.css';
```

### After (Consolidated Data)
```typescript
// All data in one place
import { 
  getTransitInterpretation,
  ZODIAC_SIGNS,
  injectChartStyles 
} from '@/lib/data';
```

## Usage Examples

### Using Astrological Data
```typescript
import { ZODIAC_SIGNS, PLANET_SYMBOLS, ASPECT_DEFINITIONS } from '@/lib/data';

// Get zodiac sign symbol
const ariesSymbol = PLANET_SYMBOLS['Aries']; // '♈'

// Get aspect properties
const conjunctionProps = ASPECT_DEFINITIONS['Conjunction'];
// { angle: 0, orb: 8, color: '#228B22', weight: 2.5, style: 'solid' }
```

### Using Interpretations
```typescript
import { getTransitInterpretation, getDetailedAspectInterpretation } from '@/lib/data';

// Get transit interpretation
const interpretation = getTransitInterpretation('Conjunction', 'Sun', 'Moon');

// Get detailed aspect interpretation
const detailed = getDetailedAspectInterpretation('Conjunction', 'Sun', 'Moon');
```

### Using Chart Styles
```typescript
import { injectChartStyles, removeChartStyles } from '@/lib/data';

// Inject styles into document
injectChartStyles();

// Remove styles when component unmounts
removeChartStyles();
```

## Benefits

1. **Single Source of Truth**: All astrological data is in one place
2. **Type Safety**: TypeScript provides better type checking
3. **Easier Maintenance**: Changes only need to be made in one location
4. **Better Organization**: Clear separation of concerns
5. **Reduced Duplication**: No more duplicate data across files
6. **Improved Performance**: Styles can be conditionally loaded

## Legacy Files

The following files are kept for backward compatibility but should be phased out:
- `src/lib/transit-interpretations.ts` (now re-exports from data)
- `src/lib/chart/styles.css` (use TypeScript version instead)
- `static/interpretations.js` (migrated to TypeScript)
- `static/chart-reference.js` (data extracted to TypeScript)

## Future Improvements

1. **Database Integration**: Consider moving large datasets to a database
2. **API Endpoints**: Create API endpoints for dynamic data
3. **Caching**: Implement caching for frequently accessed data
4. **Internationalization**: Add support for multiple languages
5. **Validation**: Add data validation schemas 