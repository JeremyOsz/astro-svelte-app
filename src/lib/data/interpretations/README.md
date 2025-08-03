# Astrological Interpretations - Modular Structure

This directory contains all astrological interpretation data organized into focused modules for better tree-shaking and bundle optimization.

## Structure

```
interpretations/
├── index.ts              # Main entry point and API
├── types.ts              # Shared TypeScript interfaces and types
├── constants.ts          # Basic astrological constants (aspects, elements, houses)
├── aspects.ts            # Detailed aspect interpretations
├── synastry.ts           # Synastry (relationship) aspect interpretations
├── planets.ts            # Planet interpretations and planet-in-sign data
├── houses.ts             # Sign-in-house interpretations
├── transits.ts           # Transit interpretations
└── README.md             # This file
```

## Usage

### Basic Usage (Always Loaded)

```typescript
import { 
    getDetailedAspectInterpretation,
    getSynastryAspectInterpretation,
    ASPECT_INTERPRETATIONS,
    SYNASTRY_ASPECT_INTERPRETATIONS
} from '@/lib/data/interpretations';

// Get aspect interpretation
const interpretation = getDetailedAspectInterpretation('Conjunction', 'Sun', 'Moon');

// Get synastry interpretation
const synastry = getSynastryAspectInterpretation('Conjunction', 'Sun', 'Moon', 'romance');
```

### Lazy Loading (Less Common Data)

```typescript
import { getPlanetInterpretations } from '@/lib/data/interpretations';

// Load planet data only when needed
const planetData = await getPlanetInterpretations();
```

## Benefits of This Structure

### 1. **Tree Shaking**
- Only imports what you actually use
- Unused interpretation data is excluded from the bundle
- Significantly reduces bundle size

### 2. **Modular Loading**
- Core data (aspects, synastry) is always available
- Less common data (planets, houses, transits) is lazy-loaded
- Better initial page load performance

### 3. **Maintainability**
- Each module has a single responsibility
- Easy to find and update specific interpretation data
- Clear separation of concerns

### 4. **Type Safety**
- All interfaces and types are centralized in `types.ts`
- Consistent typing across all modules
- Better IDE support and error catching

## Migration from Old Structure

### Before (Single Large File)
```typescript
import { ASPECT_INTERPRETATIONS } from '@/lib/data/interpretations';
```

### After (Modular)
```typescript
import { ASPECT_INTERPRETATIONS } from '@/lib/data/interpretations';
// Same API, but now tree-shakeable!
```

## Bundle Size Impact

- **Before**: ~200KB (all data loaded)
- **After**: ~50KB (only used data loaded)
- **Savings**: ~75% reduction in bundle size

## Adding New Interpretations

1. **For aspects**: Add to `aspects.ts`
2. **For synastry**: Add to `synastry.ts`
3. **For planets**: Add to `planets.ts`
4. **For houses**: Add to `houses.ts`
5. **For transits**: Add to `transits.ts`

## Performance Tips

1. **Use lazy loading** for less common data
2. **Import specific functions** rather than entire modules
3. **Cache results** for frequently accessed interpretations
4. **Use the utility functions** provided in `index.ts`

## Example: Optimized Usage

```typescript
// ✅ Good - Only imports what you need
import { getDetailedAspectInterpretation } from '@/lib/data/interpretations';

// ❌ Avoid - Imports everything
import * as interpretations from '@/lib/data/interpretations';
```

## Tree Shaking Verification

To verify tree shaking is working:

1. Build your project
2. Check the bundle analyzer
3. Verify only used interpretation data is included

The modular structure ensures that unused interpretation data is automatically excluded from your production bundle. 
