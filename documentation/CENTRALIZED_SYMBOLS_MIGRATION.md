# Centralized Symbols and Colors Migration Guide

## Overview
We've centralized all astrological symbols and colors in `src/lib/data/symbols.ts` to eliminate duplication across the codebase.

## What's Been Centralized

### Symbols
- **Planet Symbols**: `PLANET_SYMBOLS` - All planet and point symbols (☉, ☽, ☿, etc.)
- **Zodiac Symbols**: `ZODIAC_SYMBOLS` - All zodiac sign symbols (♈, ♉, ♊, etc.)
- **Aspect Symbols**: `ASPECT_SYMBOLS` - All aspect symbols (☌, ☍, □, etc.)

### Colors
- **Zodiac Colors**: `ZODIAC_COLORS` - Element-based colors for each sign
- **Transit Colors**: `TRANSIT_COLORS` - Orange colors for transit planets
- **Aspect Colors**: Available via `ASPECT_DEFINITIONS[aspect].color`

### Other Data
- **Zodiac Signs**: `ZODIAC_SIGNS` - Array of sign names
- **Extended Planet Names**: `EXTENDED_PLANET_NAMES` - Array of extended planets
- **Core Aspect Bodies**: `CORE_ASPECT_BODIES` - Array of core planets for aspects
- **Aspect Definitions**: `ASPECT_DEFINITIONS` - Complete aspect data with angles, orbs, colors, etc.

## How to Update Files

### 1. Import the centralized data
```typescript
import { 
  PLANET_SYMBOLS,
  ZODIAC_SYMBOLS,
  ASPECT_SYMBOLS,
  ZODIAC_COLORS,
  TRANSIT_COLORS,
  ASPECT_DEFINITIONS
} from '../data/symbols';
```

### 2. Replace duplicated constants
**Before:**
```typescript
const planetSymbols: Record<string, string> = {
  "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃",
  "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇", "Node": "☊",
  "Lilith": "⚸", "Chiron": "⚷", "Fortune": "⊗", "Vertex": "Vx"
};
```

**After:**
```typescript
const planetSymbols = PLANET_SYMBOLS;
```

### 3. Use utility functions for common operations
```typescript
import { 
  getPlanetSymbol, 
  getZodiacSymbol, 
  getAspectSymbol,
  getAspectColor,
  getTransitColor 
} from '../data/symbols';

// Instead of: planetSymbols[planet] || planet
const symbol = getPlanetSymbol(planet);

// Instead of: zodiacSymbols[sign] || sign  
const zodiacSymbol = getZodiacSymbol(sign);

// Instead of: aspectSymbols[aspect] || aspect
const aspectSymbol = getAspectSymbol(aspect);
```

## Files That Need Updating

The following files still have duplicated symbols and should be updated:

### Chart Components
- ~~`src/lib/chart/D3BiWheelChart.svelte`~~ - ✅ Updated (has TypeScript type issues to resolve)
- ~~`src/routes/daily-horoscope/DailyHoroscopeDisplay.svelte`~~ - ✅ Updated
- ~~`src/routes/transits/TransitDisplay.svelte`~~ - ✅ Updated

### Static Files
- `static/js/chart-reference.js` - Has planet and zodiac symbols (JavaScript file, needs special handling)

## Example Migration

### Before (D3Chart.svelte):
```typescript
const zodiacSymbols: Record<string, string> = {
  "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
  "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
};
const planetSymbols: Record<string, string> = {
  "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃",
  "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇", "Node": "☊",
  "Lilith": "⚸", "Chiron": "⚷", "Fortune": "⊗", "Vertex": "Vx"
};
```

### After (D3Chart.svelte):
```typescript
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '../data/symbols';

const zodiacSymbols = ZODIAC_SYMBOLS;
const planetSymbols = PLANET_SYMBOLS;
```

## Benefits

1. **Consistency**: All symbols and colors are defined in one place
2. **Maintainability**: Changes only need to be made in one location
3. **Type Safety**: Centralized definitions with proper TypeScript types
4. **Reduced Bundle Size**: Eliminates duplicate data
5. **Easier Testing**: Single source of truth for symbols and colors

## Files Already Updated

- ✅ `src/lib/chart/ChartElementDialog.svelte` - Updated to use centralized symbols
- ✅ `src/lib/chart/D3Chart.svelte` - Updated to use centralized symbols  
- ✅ `src/lib/chart/brief-tooltip.ts` - Updated to use centralized symbols
- ✅ `src/routes/daily-horoscope/DailyHoroscopeDisplay.svelte` - Updated to use centralized symbols
- ✅ `src/routes/transits/TransitDisplay.svelte` - Updated to use centralized symbols
- ✅ `src/lib/data/astrological-data.ts` - Added missing aspect symbols and transit colors
- ✅ `src/lib/data/symbols.ts` - Created centralized symbols utility

## Known Issues

- ⚠️ `src/lib/chart/D3BiWheelChart.svelte` - Updated but has TypeScript type issues due to strict typing of ZODIAC_SIGNS
- ⚠️ `static/js/chart-reference.js` - JavaScript file that would need manual symbol replacement (not critical since it's static) 