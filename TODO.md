# Bugs
- Saving a new chart over old chart doesn't work
- Selecting another chart on transits a bit janky
- 

# TODO
- ~Make Svelte work with tooltips~
- ~Make Birth Chart Data Calculator work~
- ~Make Mobile styles work~
- ~Convert Styles to tailwind/shadcn~
- ~Fix footer data~
- ~Flesh out Interpretations browser~
- ~Make transits chart~
- ~fix house alignment~
- Fix fonts on safari
- ~Store Birth Data~
- ~Loading state for chart~
- ~make scroll not impact with the chart~
- allow lat/lon input instead of birthplace optionaly 
- set default in database
- Make aspect toltips better


# Making transits better
- Transit planets in house meaning
- Transit planets in sign meaning
- Descriptions for transit planets should be what they mean in time - not in natal chart
- Clearly say what:
    1. Transit planet is and represents
    2. Natal planet is and represents
    3. What the aspect represents
    4. What the interraction represents
- **Update transits functionality to use new comprehensive transit interpretations**
  - Integrate the new detailed transit interpretations from `src/lib/data/interpretations/transits/`
  - Update transit display to show detailed interpretations for each aspect type
  - Add transit interpretation tooltips or expandable sections
  - Include angular aspects and minor aspects in transit analysis
  - Enhance transit descriptions to clearly explain what each transit represents

# Layout & UI Improvements
- ~Add proper container padding to pages after layout changes~
- Fix navigation menu dropdown positioning on mobile (currently breaks viewport)
- Improve mobile navigation menu styling and spacing
- Add proper focus states and keyboard navigation
- Fix chart container responsiveness on very small screens
- Add loading skeletons for better perceived performance
- Improve button hover states and transitions
- Add proper error boundaries for failed chart renders
- Fix chart zoom/pan on touch devices
- Improve accessibility with proper ARIA labels
- ~Add dark mode support~
- Fix chart legend positioning on mobile
- Improve form validation styling and feedback
- Convert tooltips to dialogues


# Major features
- ~Biwheel chart~
- Synastry
- Kabbalah
- Rituals and meditations
- ~tarot layouts~

# Perfect Partner Predictions (Synastry Enhancement)

## Overview
Extend the existing synastry system to generate predictions for ideal partner compatibility and what to look for in relationships.

## Implementation Plan

### Phase 1: Core Prediction Engine
1. **Create Partner Prediction Service**
   - File: `src/lib/services/partner-prediction.ts`
   - Analyze single birth chart to identify ideal partner characteristics
   - Calculate optimal planetary placements for compatibility
   - Generate compatibility scoring algorithms

2. **Add Prediction Types**
   ```typescript
   interface PartnerPrediction {
     idealSunSigns: string[];
     idealMoonSigns: string[];
     idealVenusPlacements: string[];
     idealMarsPlacements: string[];
     compatibilityScore: number;
     relationshipThemes: string[];
     timingRecommendations: string[];
     challengingAspects: string[];
     harmoniousAspects: string[];
   }
   ```

3. **Create Prediction Components**
   - `src/lib/components/PartnerPrediction.svelte` - Main prediction display
   - `src/lib/components/IdealPartnerProfile.svelte` - Visual partner profile
   - `src/lib/components/CompatibilityScore.svelte` - Scoring display

### Phase 2: Advanced Features
4. **Compatibility Scoring System**
   - Weighted scoring based on key aspects (Sun-Moon, Venus-Mars, etc.)
   - Separate scores for emotional, intellectual, physical, spiritual compatibility
   - Growth potential scoring using Saturn aspects and house overlays

5. **Partner Search Recommendations**
   - Generate "wishlist" of ideal partner characteristics
   - Suggest what to look for in potential partners
   - Provide timing recommendations for meeting compatible partners

6. **Relationship Prediction Engine**
   - Long-term compatibility using Saturn aspects and house overlays
   - Communication patterns based on Mercury aspects
   - Romantic chemistry using Venus-Mars aspects
   - Shared life goals using Jupiter aspects and 9th/10th house overlays

### Phase 3: User Interface
7. **Add Prediction Route**
   - `src/routes/partner-prediction/+page.svelte`
   - Single chart input for generating ideal partner profile
   - "What to Look For" recommendations
   - Compatibility scoring interface

8. **Enhance Synastry Page**
   - Add "Generate Partner Prediction" button
   - Show compatibility scores in existing synastry analysis
   - Add relationship potential indicators

### Phase 4: Data & Interpretations
9. **Extend Interpretation Data**
   - Add partner prediction interpretations to `src/lib/data/interpretations/`
   - Create ideal aspect calculations based on astrological principles
   - Add timing and compatibility recommendations

10. **Create Prediction Algorithms**
    - Ideal Sun-Moon combinations for emotional compatibility
    - Optimal Venus-Mars placements for romantic chemistry
    - Best house overlays for relationship stability
    - Saturn aspects for long-term potential

## Technical Implementation

### Core Files to Create:
- `src/lib/services/partner-prediction.ts` - Main prediction logic
- `src/lib/components/PartnerPrediction.svelte` - UI component
- `src/routes/partner-prediction/+page.svelte` - Prediction page
- `src/lib/data/interpretations/partner-predictions.ts` - Prediction data

### Key Algorithms:
1. **Ideal Partner Calculation**: Analyze natal chart to find optimal partner placements
2. **Compatibility Scoring**: Weight different aspects and house overlays
3. **Timing Predictions**: Use transits and progressions for timing recommendations
4. **Relationship Themes**: Identify key relationship dynamics and growth areas

### Integration Points:
- Extend existing synastry API (`src/routes/api/synastry/+server.ts`)
- Add prediction endpoints to ephemeris API
- Integrate with existing chart storage system
- Use current aspect interpretation framework

## User Experience Flow:
1. User enters their birth chart
2. System generates ideal partner profile
3. Shows compatibility scores and recommendations
4. Provides "what to look for" guidance
5. Offers timing suggestions for meeting compatible partners

## Success Metrics:
- Accurate compatibility predictions based on astrological principles
- User-friendly interface for understanding predictions
- Integration with existing synastry functionality
- Actionable recommendations for relationship building

# Optimisations

## Cleanup
- Remove unused dependencies (@internationalized/date, tw-animate-css, @tailwindcss/forms, @tailwindcss/typography)
- Delete legacy test files (src/routes/chart/test/, static/js/chart-reference.js)
- Remove unused Swiss Ephemeris files (static/assets/ephe/ - 1.9MB)
- Clean up console.log statements throughout codebase
- Remove unused astronomia.d.ts type definitions

## Performance
- Optimize font loading in app.html (add font-display: swap, preload critical fonts)
- Split large D3Chart.svelte component (1183 lines) into smaller modules
- Add debouncing for chart updates to prevent excessive re-renders
- Implement proper error boundaries for chart rendering
- Add retry logic for API calls

### Critical Performance Bottlenecks
- [x] **Remove excessive console.log statements** - Hundreds of console.log statements throughout D3Chart.svelte and other components create significant performance overhead
- **Fix D3 chart re-rendering issues** - Chart is completely redrawn on every data change instead of updating existing elements
- **Implement proper D3 update patterns** - Use D3's enter/update/exit pattern instead of full SVG recreation
- [x] **Add debouncing to ResizeObserver** - Container resizes trigger immediate chart recreation without debouncing ✅
- **Optimize store subscriptions** - Multiple reactive statements trigger unnecessary chart recreations
- **Fix memory leaks in D3 components** - ResizeObserver and D3 event listeners not properly cleaned up
- **Use Web Workers for heavy calculations** - Large string parsing and aspect calculations block the main thread
- **Implement lazy loading for interpretation data** - Large interpretation files loaded synchronously on every chart load
- **Optimize interpretation data structure** - Current structure with massive text content causes bundle size issues
- **Add proper cache invalidation** - Server-side cache has no size limits, client-side cache lacks proper invalidation strategy

## Code Quality
- Enable stricter TypeScript options (noUnusedLocals, noUnusedParameters, exactOptionalPropertyTypes)
- Extract chart utilities into separate files
- Create reusable chart configuration objects
- Add proper loading states for better UX

## Build Optimizations
- Configure manual chunks for D3 and Luxon (already added to vite.config.ts)
- Ensure all imports are tree-shakeable
- Use named imports instead of default imports where possible

## New Features
- ~Chart storage with localStorage~
- ~URL sharing functionality~
- ~Save/load chart management~
- ~Share charts via URL parameters~