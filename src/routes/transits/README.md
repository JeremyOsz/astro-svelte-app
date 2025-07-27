# Transits Page Structure

This directory contains the refactored transits page with a clean, modular structure.

## Components

### `/components/`
- **`TransitSettings.svelte`** - Handles transit date, time, and location selection
- **`BirthChartSelector.svelte`** - Manages birth chart selection from saved charts
- **`TransitChartDisplay.svelte`** - Displays the bi-wheel transit chart
- **`TransitDetails.svelte`** - Wrapper for the detailed transit analysis
- **`index.ts`** - Exports all components for clean imports

### `/utils/`
- **`transit-utils.ts`** - Contains transit calculation logic and data conversion functions

## Main Page (`+page.svelte`)

The main page is now much cleaner and focuses on:
- State management
- Coordinating between components
- Error handling
- Page layout

## Benefits of Refactoring

1. **Separation of Concerns** - Each component has a single responsibility
2. **Reusability** - Components can be easily reused in other parts of the app
3. **Maintainability** - Easier to debug and modify individual features
4. **Testability** - Components can be tested in isolation
5. **Readability** - Main page is much easier to understand

## Data Flow

1. User selects birth chart via `BirthChartSelector`
2. User configures transit settings via `TransitSettings`
3. Main page calls `calculateTransits` utility function
4. Results are displayed via `TransitChartDisplay` and `TransitDetails`

## Usage

```svelte
<script>
  import { 
    TransitSettings, 
    BirthChartSelector, 
    TransitChartDisplay, 
    TransitDetails 
  } from './components';
  import { calculateTransits } from './utils/transit-utils';
</script>
``` 