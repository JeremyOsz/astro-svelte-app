# Project Structure

This document outlines the organization of the Astro Chart application, a modern astrology web app built with SvelteKit, shadcn/ui, and Swiss Ephemeris.

## 📁 Directory Structure

```
astro-svelte-app/
├── src/
│   ├── lib/
│   │   ├── astrology/               # Core astrology calculations
│   │   │   ├── astrology.ts         # Astrological constants and utilities
│   │   │   └── swiss-ephemeris-service.ts  # Swiss Ephemeris integration
│   │   ├── chart/                   # Chart visualization components
│   │   │   ├── D3Chart.svelte       # Main birth chart component
│   │   │   ├── D3TransitChart.svelte # Transit chart component
│   │   │   ├── InterpretationList.svelte # Chart interpretations
│   │   │   ├── ChartLoadingState.svelte # Loading states
│   │   │   ├── SaveChartButton.svelte # Chart persistence
│   │   │   ├── ShareChartButton.svelte # Chart sharing
│   │   │   ├── SavedChartsList.svelte # Chart management
│   │   │   ├── chart-styles.css     # Chart-specific styles
│   │   │   ├── styles.css           # Additional chart styles
│   │   │   └── tooltip.ts           # Chart tooltip utilities
│   │   ├── components/              # Reusable UI components
│   │   │   └── ui/                  # shadcn/ui components
│   │   │       ├── accordion/       # Collapsible content
│   │   │       ├── alert/           # Alert messages
│   │   │       ├── badge/           # Status indicators
│   │   │       ├── button/          # Interactive buttons
│   │   │       ├── card/            # Content containers
│   │   │       ├── dialog/          # Modal dialogs
│   │   │       ├── input/           # Form inputs
│   │   │       ├── label/           # Form labels
│   │   │       ├── navigation-menu/ # Navigation components
│   │   │       ├── separator/       # Visual dividers
│   │   │       ├── sheet/           # Slide-out panels
│   │   │       ├── sidebar/         # Side navigation
│   │   │       ├── skeleton/        # Loading placeholders
│   │   │       └── tooltip/         # Hover information
│   │   ├── data/                    # Data and configuration
│   │   │   ├── astrological-data.ts # Zodiac signs, planets, aspects
│   │   │   ├── chart-styles.ts      # Chart styling configuration
│   │   │   ├── interpretations.ts   # Astrological interpretations
│   │   │   ├── interpretations-page-data.ts # Page-specific data
│   │   │   ├── tarot-data.ts        # Tarot card data and meanings
│   │   │   ├── interpretations.json # Raw interpretation data
│   │   │   ├── index.ts             # Data exports
│   │   │   └── README.md            # Data documentation
│   │   ├── services/                # Application services
│   │   │   ├── chart-storage.ts     # Chart persistence (localStorage)
│   │   │   ├── city-service.ts      # Location and city data
│   │   │   ├── daily-horoscope.ts   # Horoscope generation
│   │   │   └── url-sharing.ts       # URL parameter handling
│   │   ├── stores/                  # Svelte stores for state management
│   │   │   └── chart-store.ts       # Chart state and persistence
│   │   ├── types/                   # TypeScript type definitions
│   │   │   └── types.ts             # Core type definitions
│   │   ├── utils/                   # Utility functions
│   │   │   ├── chart-utils.ts       # Chart-specific utilities
│   │   │   ├── date-utils.ts        # Date manipulation helpers
│   │   │   ├── validation-utils.ts  # Form validation logic
│   │   │   ├── index.ts             # Utility exports
│   │   │   └── utils.ts             # General utilities
│   │   ├── hooks/                   # Svelte hooks and composables
│   │   │   └── is-mobile.svelte.ts  # Mobile detection hook
│   │   ├── images/                  # Image assets
│   │   │   └── tarot/               # Tarot card images
│   │   │       └── Cards-png/       # Individual card images
│   │   ├── birth-chart-transits.ts  # Transit calculations
│   │   ├── transit-interpretations.ts # Transit meanings
│   │   └── weekly-transits.ts       # Weekly transit summaries
│   ├── routes/                      # SvelteKit routes
│   │   ├── api/                     # API endpoints
│   │   │   ├── birth-chart/         # Birth chart calculation API
│   │   │   │   └── +server.ts       # Birth chart endpoint
│   │   │   ├── daily-horoscope/     # Horoscope API
│   │   │   │   └── +server.ts       # Daily horoscope endpoint
│   │   │   └── transits/            # Transits API
│   │   │       └── +server.ts       # Transit calculations endpoint
│   │   ├── chart/                   # Birth chart page
│   │   │   ├── +page.svelte         # Chart display page
│   │   │   ├── +page.server.ts      # Server-side chart logic
│   │   │   └── BirthChartForm.svelte # Chart input form
│   │   ├── daily-horoscope/         # Daily horoscope page
│   │   │   ├── +page.svelte         # Horoscope display
│   │   │   └── DailyHoroscopeDisplay.svelte # Horoscope component
│   │   ├── interpretations/         # Interpretations page
│   │   │   └── +page.svelte         # Astrological meanings
│   │   ├── tarot/                   # Tarot cards page
│   │   │   └── +page.svelte         # Tarot card explorer
│   │   ├── transits/                # Transits page
│   │   │   ├── +page.svelte         # Transit display
│   │   │   └── TransitDisplay.svelte # Transit component
│   │   ├── +layout.svelte           # Main application layout
│   │   └── +page.svelte             # Homepage
│   ├── app.css                      # Global styles
│   ├── app.d.ts                     # SvelteKit app types
│   └── app.html                     # HTML template
├── static/                          # Static assets
│   ├── assets/                      # Binary assets
│   │   └── ephe/                    # Swiss Ephemeris files
│   │       ├── seas_18.se1          # Swiss Ephemeris data
│   │       ├── semo_18.se1          # Moon ephemeris
│   │       └── sepl_18.se1          # Planet ephemeris
│   ├── data/                        # Static data files
│   │   ├── admin1.json              # Administrative regions
│   │   └── countries.json           # Country data
│   ├── js/                          # JavaScript files
│   │   └── chart-reference.js       # Chart reference data
│   ├── favicon.svg                  # Site favicon
│   └── assets/                      # Additional static assets
│       └── interpretations/         # Interpretation assets
│           └── interpretations.js   # Legacy interpretation data
├── tests/                           # Test files
│   ├── routes/                      # Route tests
│   │   └── api/                     # API endpoint tests
│   │       ├── birth-chart/         # Birth chart API tests
│   │       └── transits/            # Transit API tests
│   ├── utils/                       # Utility function tests
│   │   └── test-helpers.ts          # Test utilities
│   ├── README.md                    # Testing documentation
│   └── setup.ts                     # Test configuration
├── package.json                     # Dependencies and scripts
├── pnpm-lock.yaml                   # Lock file
├── tsconfig.json                    # TypeScript configuration
├── svelte.config.js                 # SvelteKit configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.ts                   # Vite build configuration
├── vitest.config.ts                 # Test configuration
├── vercel.json                      # Vercel deployment config
├── components.json                  # shadcn/ui configuration
├── TODO.md                          # Development tasks
├── PROJECT_STRUCTURE.md             # This file
└── README.md                        # Project documentation
```

## 🎯 Key Architectural Decisions

### 1. **Modern Component Architecture**
- **shadcn/ui**: Consistent, accessible UI components
- **SvelteKit**: Full-stack framework with SSR support
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first styling approach

### 2. **Data Organization**
- **Centralized Data**: All astrological data in `src/lib/data/`
- **Type Safety**: Comprehensive TypeScript interfaces
- **Modular Structure**: Separate files for different data types
- **Clean Exports**: Index files for easy imports

### 3. **Service Layer**
- **Chart Storage**: Local persistence with localStorage
- **URL Sharing**: Chart sharing via URL parameters
- **City Service**: Location data management
- **Horoscope Service**: Daily horoscope generation

### 4. **State Management**
- **Svelte Stores**: Reactive state management
- **Chart Store**: Centralized chart state
- **Persistence**: Automatic chart saving and loading

## 🔧 Development Workflow

### Adding New Features

1. **UI Components**: Use shadcn/ui components in `src/lib/components/ui/`
2. **Data**: Add new data files in `src/lib/data/`
3. **Services**: Create service files in `src/lib/services/`
4. **Types**: Define TypeScript interfaces in `src/lib/types/`
5. **Routes**: Add new pages in `src/routes/`

### Code Organization Principles

- **Separation of Concerns**: Each file has a single responsibility
- **Consistent Naming**: Clear, descriptive file and folder names
- **Modular Design**: Reusable components and utilities
- **Type Safety**: Full TypeScript coverage
- **Accessibility**: WCAG compliant components

## 📦 Key Dependencies

### Core Framework
- **SvelteKit 2.0**: Full-stack web framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool

### UI & Styling
- **shadcn/ui**: Component library
- **Tailwind CSS**: Utility-first CSS
- **Lucide Svelte**: Icon library

### Astrology & Data
- **Swiss Ephemeris**: Astronomical calculations
- **D3.js**: Data visualization

### Development Tools
- **Vitest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🚀 Deployment Structure

The application is designed for modern deployment platforms:

- **Vercel**: Zero-config deployment
- **Netlify**: Git-based deployment
- **Railway**: Container deployment
- **Traditional**: Node.js hosting

## 📝 Documentation

- **README.md**: Project overview and setup
- **PROJECT_STRUCTURE.md**: This file - detailed structure
- **TODO.md**: Development tasks and roadmap
- **Inline Comments**: Code documentation

---

**This structure supports scalable development and maintainable code organization.** 