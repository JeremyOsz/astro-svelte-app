# LLM Standards for Astro Chart Project

## 🎯 Project Overview

This is a **SvelteKit 2.0** astrology application with TypeScript, featuring birth chart calculations, planetary transits, interactive D3.js visualizations, and modern UI components. The project uses Swiss Ephemeris API for astronomical calculations and follows a specific architecture pattern.

## 🏗 Architecture Patterns

### Technology Stack
- **Framework**: SvelteKit 2.0 with TypeScript and Svelte 5
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Svelte stores (writable, derived)
- **Visualizations**: D3.js for interactive charts
- **Astronomical Calculations**: External Swiss Ephemeris API service
- **Package Manager**: pnpm
- **Testing**: Vitest with jsdom

### Directory Structure
```
src/
├── lib/
│   ├── astrology/               # Core astrology calculations
│   ├── chart/                   # D3.js chart components
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # shadcn/ui components
│   ├── data/                    # Static data and configurations
│   ├── services/                # Application services
│   ├── stores/                  # Svelte stores
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── routes/                      # SvelteKit routes
│   ├── api/                     # API endpoints
│   └── [feature]/               # Feature pages
└── static/                      # Static assets
```

## 📝 Code Standards

### TypeScript Patterns

#### Type Definitions (`src/lib/types/types.ts`)
```typescript
// Use interfaces for object shapes
export interface BirthData {
  date: string;       // ISO format date string
  time: string;       // 24-hour format (HH:MM)
  latitude: number;   // Decimal degrees
  longitude: number;  // Decimal degrees
  place?: string;     // Optional location name
  house_system?: 'whole_sign' | 'placidus';
}

// Use const assertions for readonly data
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;
```

#### Data Organization (`src/lib/data/`)
- **ALL interpretations and astrological data MUST be centralized in `@data/` folder**
- Never hardcode astrological meanings, interpretations, or data in components
- Use descriptive exports with clear naming
- Group related data together (zodiac, planets, aspects, interpretations)
- Export utility functions alongside data
- Import from `@data/` for all astrological content

### Component Patterns

#### SvelteKit Components
```svelte
<script lang="ts">
  // Use TypeScript for all components
  import { onMount } from 'svelte';
  import type { BirthData } from '$lib/types/types';
  
  // Props with proper typing
  let { birthData, isLoading = false }: { birthData: BirthData; isLoading?: boolean } = $props();
  
  // Reactive statements
  $: chartData = processBirthData(birthData);
</script>

<!-- Template with proper accessibility -->
<div class="chart-container" role="region" aria-label="Birth Chart">
  {#if isLoading}
    <div class="loading-spinner" aria-live="polite">Loading...</div>
  {:else}
    <!-- Chart content -->
  {/if}
</div>
```

#### shadcn/ui Component Usage
```svelte
<script lang="ts">
  import * as Button from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  
  // Use the cn utility for conditional classes
  let className = "custom-class";
</script>

<Button.Root class={cn("base-class", className)}>
  <Button.Content>Click me</Button.Content>
</Button.Root>
```

### Store Patterns (`src/lib/stores/`)

#### Store Structure
```typescript
import { writable, derived } from 'svelte/store';

// Define state interface
interface ChartState {
  chartData: string | null;
  birthData: BirthData | null;
  error: string | null;
  isLoading: boolean;
  version: number; // For reactivity tracking
}

// Create store with methods
function createChartStore() {
  const { subscribe, set, update } = writable<ChartState>({
    // Initial state
  });

  return {
    subscribe,
    // Action methods
    setChartData: (chartData: string, birthData?: BirthData) => {
      update(state => ({
        ...state,
        chartData,
        birthData: birthData || state.birthData,
        version: state.version + 1
      }));
    },
    // Other methods...
  };
}

export const chartStore = createChartStore();

// Derived stores for computed values
export const currentChart = derived(chartStore, ($chartStore) => {
  // Computed logic
});
```

### Service Patterns (`src/lib/services/`)

#### API Service Structure
```typescript
// Server-side only services
export class SwissEphemerisService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    // API request logic with error handling
  }

  static async calculateBirthChart(
    date: Date,
    latitude: number,
    longitude: number,
    place: string = 'Unknown Location',
    houseSystem: 'whole_sign' | 'placidus' = 'whole_sign'
  ): Promise<BirthChart> {
    // Implementation
  }
}
```

### API Route Patterns (`src/routes/api/`)

#### Server Endpoints
```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validation
    if (!data.requiredField) {
      return json({ error: 'Missing required field' }, { status: 400 });
    }
    
    // Processing
    const result = await processData(data);
    
    return json(result);
  } catch (error) {
    console.error('Error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
```

## 🎨 UI/UX Standards

### Design System
- **Component Library**: shadcn/ui components
- **Styling**: Tailwind CSS utility classes
- **Icons**: Lucide Svelte icons
- **Color Scheme**: Astrological color coding (fire/earth/air/water elements)
- **Responsive**: Mobile-first approach

### Accessibility
- Use semantic HTML elements
- Include ARIA labels and roles
- Provide loading states and error handling
- Ensure keyboard navigation support

### Chart Visualization
- Use D3.js for interactive charts
- Implement tooltips with consistent styling
- Support both desktop and mobile interactions
- Use astrological color coding for planets and signs

## 🔧 Development Standards

### Environment Variables
```bash
# Required for Swiss Ephemeris API
EPHEMERIS_API_URL=http://127.0.0.1:8001
EPHEMERIS_API_KEY=your_api_key_here
```

### Testing Patterns
```typescript
// Use Vitest with jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Component from './Component.svelte';

describe('Component', () => {
  it('should render correctly', () => {
    const { container } = render(Component);
    expect(container).toBeTruthy();
  });
});
```

### Error Handling
- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors for debugging
- Graceful degradation for API failures

### Performance Considerations
- Use Svelte's reactive statements efficiently
- Implement proper loading states
- Optimize chart rendering with D3.js
- Cache API responses when appropriate

## 🌟 Astrological Domain Standards

### Data Organization
- **Zodiac Signs**: 12 signs with elements, qualities, rulers
- **Planets**: Core planets + extended bodies (Chiron, Lilith, etc.)
- **Aspects**: Major aspects with orbs and colors
- **House Systems**: Whole Sign (default) and Placidus support

### Calculation Standards
- Use Swiss Ephemeris API for all astronomical calculations
- Support multiple house systems
- Handle retrograde planets
- Calculate aspects with proper orbs

### Content Guidelines
- Use mystical/spiritual tone rather than technical language
- Focus on curiosity and shared journey
- Avoid grandiose or overly professional language
- Tailor content for astrology and mysticism audience
- **All astrological interpretations and meanings MUST come from `@data/` folder**
- Never hardcode planet meanings, aspect interpretations, or house descriptions in components
- Use centralized interpretation functions and data structures

### Branding & Tone Standards (Velvet Arcana)

#### Brand Personality
- **Sophisticated & Mysterious**: Premium, curated experience without being pretentious
- **Elegant & Accessible**: Luxurious feel that remains approachable
- **Dark Academia**: Scholarly, mystical aesthetic with modern sensibilities
- **Mysterious**: Creates intrigue without being obvious about functionality

#### Tone Guidelines
- **Sophisticated Language**: Use "unlock," "reveal," "discover," "explore" rather than "calculate," "compute," "generate"
- **Mystical References**: "Arcana," "grimoire," "celestial wisdom," "cosmic secrets"
- **Premium Feel**: "Experience," "journey," "unveiled," "arcane tools"
- **Avoid**: Technical jargon, overly casual language, forced humor

#### Copy Examples
- ✅ "Unlock the secrets of the cosmos"
- ✅ "Your personal grimoire of celestial wisdom"
- ✅ "The Arcana Unveiled"
- ✅ "Ready to Unlock Your Arcana?"
- ❌ "Calculate your birth chart" (too technical)
- ❌ "Just have fun trying" (too casual)

#### Section Naming Conventions
- **Tools**: "Arcane Tools" instead of "Quick Actions"
- **Features**: "The Velvet Arcana Experience" instead of "Why Choose..."
- **Navigation**: "Begin" instead of "Get Started"
- **CTAs**: "Begin Your Journey" instead of "Start Now"

#### Visual Language
- **Colors**: Deep purples, blacks, golds, rich gradients
- **Typography**: Sophisticated, elegant fonts
- **Imagery**: Mystical symbols, celestial elements, velvet textures
- **Layout**: Clean, premium spacing with subtle mystical elements

#### Content Structure
- **Hero**: Welcoming and mysterious introduction
- **Features**: Highlight sophistication and precision
- **Sections**: Use mystical language ("Arcana," "Grimoire," "Celestial")
- **CTAs**: Invite to "journey" or "unlock" rather than "start" or "begin"

This branding creates a high-end, mysterious experience that feels like a premium occult bookstore meets modern app, maintaining accessibility while offering sophistication.

## 🚀 Deployment Standards

### Build Process
```bash
pnpm install
pnpm build
pnpm preview
```

### Environment Setup
- Configure API endpoints for production
- Set up proper CORS headers
- Ensure environment variables are set
- Test API connectivity

### Platform Support
- Vercel (recommended)
- Netlify
- Railway
- Traditional Node.js hosting

## 📋 Code Quality Standards

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Use proper type annotations
- Avoid `any` type when possible

### SvelteKit Best Practices
- Use proper route structure
- Implement server-side rendering where appropriate
- Handle loading and error states
- Use SvelteKit's built-in features (forms, actions, etc.)

### Component Architecture
- Keep components focused and single-purpose
- Use composition over inheritance
- Implement proper prop validation
- Use Svelte's reactive features effectively

## 🔍 Common Patterns to Follow

### Data Centralization
- **All astrological data MUST be in `src/lib/data/` folder**
- **All interpretation functions MUST be in `src/lib/data/interpretations.ts`**
- **All planet meanings, aspect descriptions, house meanings MUST be centralized**
- **Components should ONLY import from `@data/` for astrological content**
- **Never hardcode astrological meanings in components**

### File Naming
- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for functions and variables
- Use UPPER_SNAKE_CASE for constants

### Import Organization
```typescript
// 1. External libraries
import { writable } from 'svelte/store';

// 2. Internal types
import type { BirthData } from '$lib/types/types';

// 3. Internal utilities
import { cn } from '$lib/utils';

// 4. Internal components
import Button from '$lib/components/ui/button/button.svelte';
```

### Error Boundaries
- Implement proper error handling in API calls
- Use loading states for async operations
- Provide fallback UI for failed operations
- Log errors for debugging

This document should be used as a reference for maintaining consistency across the codebase and ensuring all new features follow the established patterns. 