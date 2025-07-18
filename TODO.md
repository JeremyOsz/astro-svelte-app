# TODO
- ~Make Svelte work with tooltips~
- ~Make Birth Chart Data Calculator work~
- ~Make Mobile styles work~
- ~Convert Styles to tailwind/shadcn~
- ~Fix footer data~
- Flesh out Interpretations browser
- Make transits chart
- fix house alignment
- Fix fonts on safari
- ~Store Birth Data~
- ~Loading state for chart~


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