# ChartElementDialog Component

The `ChartElementDialog` component is a highly abstracted dialog that can display astrological interpretations for different chart types. It automatically detects the type of element being displayed and provides appropriate interpretations and styling.

## Features

- **Multi-Chart Type Support**: Works with natal, transit, synastry, composite, solar return, lunar return, and progressed charts
- **Automatic Type Detection**: Detects planets, aspects, signs, and angular houses
- **Dynamic Styling**: Applies chart-type-specific colors and styling
- **Enhanced Interpretations**: Provides detailed interpretations based on chart type
- **Type Safety**: Full TypeScript support with proper type definitions

## Usage

### Basic Usage

```svelte
<script>
  import ChartElementDialog from '$lib/components/dialogs/ChartElementDialog.svelte';
  
  let dialogOpen = false;
  let elementData = null;
</script>

<ChartElementDialog 
  bind:open={dialogOpen} 
  elementData={elementData} 
  chartType="natal" 
/>
```

### Supported Chart Types

```svelte
<!-- Natal Chart -->
<ChartElementDialog chartType="natal" />

<!-- Transit Chart -->
<ChartElementDialog chartType="transit" />

<!-- Biwheel Chart (Natal + Transit) -->
<ChartElementDialog chartType="biwheel" />

<!-- Synastry Chart -->
<ChartElementDialog chartType="synastry" />

<!-- Composite Chart -->
<ChartElementDialog chartType="composite" />

<!-- Solar Return Chart -->
<ChartElementDialog chartType="solar-return" />

<!-- Lunar Return Chart -->
<ChartElementDialog chartType="lunar-return" />

<!-- Progressed Chart -->
<ChartElementDialog chartType="progressed" />
```

## Data Structure

The component accepts `elementData` with the following structures:

### Planet Data
```typescript
{
  planet: string;           // Planet name (e.g., "Sun", "Moon")
  sign: string;            // Zodiac sign (e.g., "Aries", "Taurus")
  house: number;           // House number (1-12)
  degree: number;          // Degree (0-29)
  minute: number;          // Minute (0-59)
  isRetrograde?: boolean;  // Whether planet is retrograde
  isTransit?: boolean;     // Whether this is a transit planet
  chartType?: string;      // Chart type (auto-detected if not provided)
}
```

### Aspect Data
```typescript
{
  aspect: string;          // Aspect type (e.g., "conjunction", "opposition")
  planet1: string;         // First planet
  planet2: string;         // Second planet
  orb: number;             // Orb in degrees
  isTransitAspect?: boolean; // Whether this is a transit aspect
  chartType?: string;      // Chart type
}
```

### Sign Data
```typescript
{
  sign: string;            // Zodiac sign
  house: number;           // House number
  chartType?: string;      // Chart type
}
```

### Angular House Data
```typescript
{
  planet: 'ASC' | 'MC' | 'DSC' | 'IC'; // Angular house
  sign: string;            // Zodiac sign
  degree: number;          // Degree
  minute: number;          // Minute
  chartType?: string;      // Chart type
}
```

## Chart Type Detection

The component automatically detects the chart type based on:

1. **Explicit `chartType` prop** (highest priority)
2. **Data properties**:
   - `isTransit` or `isTransitAspect` → `'transit'`
   - `isSynastry` → `'synastry'`
   - `isComposite` → `'composite'`
   - `isSolarReturn` → `'solar-return'`
   - `isLunarReturn` → `'lunar-return'`
   - `isProgressed` → `'progressed'`
3. **Default fallback** → `'natal'`

## Styling

Each chart type gets its own color scheme:

- **Natal**: Gray (`text-gray-800`)
- **Transit**: Orange (`text-orange-600`)
- **Synastry**: Purple (`text-purple-600`)
- **Composite**: Blue (`text-blue-600`)
- **Solar Return**: Yellow (`text-yellow-600`)
- **Lunar Return**: Indigo (`text-indigo-600`)
- **Progressed**: Green (`text-green-600`)

## Examples

### Natal Chart Example
```svelte
<script>
  let elementData = {
    planet: "Sun",
    sign: "Leo",
    house: 5,
    degree: 15,
    minute: 30,
    isRetrograde: false
  };
</script>

<ChartElementDialog 
  bind:open={dialogOpen} 
  elementData={elementData} 
  chartType="natal" 
/>
```

### Transit Chart Example
```svelte
<script>
  let elementData = {
    planet: "Mars",
    sign: "Aries",
    house: 1,
    degree: 5,
    minute: 15,
    isTransit: true
  };
</script>

<ChartElementDialog 
  bind:open={dialogOpen} 
  elementData={elementData} 
  chartType="transit" 
/>
```

### Synastry Aspect Example
```svelte
<script>
  let elementData = {
    aspect: "conjunction",
    planet1: "Sun",
    planet2: "Venus",
    orb: 2.5,
    isSynastry: true
  };
</script>

<ChartElementDialog 
  bind:open={dialogOpen} 
  elementData={elementData} 
  chartType="synastry" 
/>
```

## Integration with Chart Components

The dialog is designed to work seamlessly with your existing chart components:

```svelte
<!-- In D3Chart.svelte -->
<ChartElementDialog 
  bind:open={dialogOpen} 
  elementData={selectedElementData} 
  chartType="natal" 
/>

<!-- In D3BiWheelChart.svelte -->
<ChartElementDialog 
  bind:open={dialogOpen} 
  elementData={selectedElementData} 
  chartType="biwheel" 
/>
```

## Future Extensions

The component is designed to be easily extensible for new chart types:

1. Add new chart type to the `chartType` prop union type
2. Add detection logic in `detectChartType()`
3. Add styling in `getChartTypeStyles()`
4. Add type-specific labels in the interpretation functions

This abstraction makes it easy to add support for new chart types like:
- Secondary progressions
- Solar arc directions
- Harmonic charts
- Draconic charts
- And more! 