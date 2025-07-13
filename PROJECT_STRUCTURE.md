# Project Structure

This document outlines the organization of the Astro-Svelte application.

## Directory Structure

```
astro-svelte-app/
├── src/
│   ├── lib/
│   │   ├── astrology/           # Core astrology calculations
│   │   │   ├── astrology.ts
│   │   │   └── astronomia-service.ts
│   │   ├── chart/               # Chart visualization components
│   │   │   ├── browser-chart.ts
│   │   │   ├── mock-chart.ts
│   │   │   └── styles.css
│   │   ├── data/                # Data and configuration
│   │   │   ├── astrological-data.ts
│   │   │   ├── chart-styles.ts
│   │   │   ├── interpretations.json
│   │   │   ├── interpretations.ts
│   │   │   └── index.ts
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── types.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── date-utils.ts
│   │   │   ├── validation-utils.ts
│   │   │   └── index.ts
│   │   ├── birth-chart-transits.ts
│   │   ├── transit-interpretations.ts
│   │   └── weekly-transits.ts
│   ├── routes/                  # SvelteKit routes
│   │   ├── api/                 # API endpoints
│   │   │   ├── birth-chart/
│   │   │   ├── chart/
│   │   │   └── transits/
│   │   ├── chart/               # Chart-related pages
│   │   ├── interpretations/     # Interpretation pages
│   │   ├── transits/            # Transit pages
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── app.css
│   ├── app.d.ts
│   ├── app.html
│   └── types/
│       └── astronomia.d.ts
├── static/                      # Static assets
│   ├── assets/                  # Binary assets (ephemeris files)
│   │   └── ephe/
│   ├── js/                      # JavaScript files
│   │   └── chart-reference.js
│   ├── css/                     # CSS files (if any)
│   └── favicon.svg
├── tests/                       # All test files
│   ├── lib/                     # Library tests
│   ├── routes/                  # Route tests
│   ├── utils/                   # Test utilities
│   ├── README.md
│   └── setup.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

## Key Improvements Made

### 1. **Removed Duplicate Files**
- Eliminated duplicate `interpretations.js` file
- Removed empty `src/lib/utils/` directory

### 2. **Organized Static Assets**
- Created `static/js/` for JavaScript files
- Created `static/css/` for CSS files
- Moved `chart-reference.js` to `static/js/`
- Moved `chart-styles.css` to `src/lib/chart/`

### 3. **Consolidated Test Structure**
- Moved all test files to the root `tests/` directory
- Removed duplicate test setup files

### 4. **Added Utility Functions**
- Created `src/lib/utils/` with common utility functions
- Added date utilities and validation utilities
- Created proper index files for exports

### 5. **Improved Documentation**
- Added this structure documentation
- Updated import paths where necessary

## File Organization Principles

1. **Separation of Concerns**: Each directory has a specific purpose
2. **Logical Grouping**: Related files are grouped together
3. **Clear Naming**: Directory and file names clearly indicate their purpose
4. **Consistent Structure**: Similar types of files are organized consistently

## Import Paths

- Use `$lib/` to import from `src/lib/`
- Use `$lib/utils/` to import utility functions
- Use `$lib/data/` to import data and configurations
- Use `$lib/chart/` to import chart-related components 