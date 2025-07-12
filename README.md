# Astro Chart - SvelteKit Astrological Application

A comprehensive astrological application built with SvelteKit that combines birth chart calculations, transit analysis, and astrological interpretations. This project merges the functionality from `node-ephemeris` and `astro-chart` into a modern web application.

## Features

### 🌟 Birth Chart Calculator
- Calculate accurate birth charts using Swiss Ephemeris
- Interactive D3.js chart visualization
- Planetary positions, houses, and aspects
- Support for retrograde planets
- Whole Sign house system

### 🔄 Transit Analysis
- Current planetary transits
- Transit-to-natal aspect calculations
- Transit interpretations and meanings
- Comparison of current vs natal positions

### 📚 Astrological Interpretations
- Comprehensive planet meanings
- Zodiac sign characteristics
- House significations
- Aspect interpretations
- Searchable content

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful gradient styling
- Interactive components
- Real-time updates
- Loading states and error handling

## Technology Stack

- **Frontend Framework**: SvelteKit 2.0
- **Astronomical Calculations**: Swiss Ephemeris
- **Data Visualization**: D3.js
- **Styling**: CSS with modern design patterns
- **Type Safety**: TypeScript
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd astro-svelte-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
pnpm preview
```

## Project Structure

```
src/
├── lib/
│   ├── astrology/          # Astrological constants and utilities
│   ├── chart/              # Chart calculation logic
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── routes/
│   ├── chart/              # Birth chart calculator
│   ├── transits/           # Transit analysis
│   └── interpretations/    # Astrological meanings
├── app.css                 # Global styles
└── app.html               # HTML template
static/
└── assets/
    └── ephe/              # Swiss Ephemeris files
```

## Usage

### Calculating a Birth Chart

1. Navigate to the "Birth Chart" page
2. Enter your birth details:
   - Date of birth
   - Time of birth (use 12:00 PM if unknown)
   - Birth location coordinates
   - Timezone at birth
3. Click "Calculate Chart" to generate your natal chart
4. View the interactive chart visualization and detailed data

### Viewing Transits

1. Navigate to the "Transits" page
2. Enter your birth details (same as above)
3. View current planetary transits and their aspects to your natal chart
4. Explore transit interpretations and meanings

### Exploring Interpretations

1. Navigate to the "Interpretations" page
2. Browse through planets, signs, houses, and aspects
3. Use the search function to find specific meanings
4. Learn about astrological symbolism and significance

## Key Components

### Birth Chart Form
- Input validation for birth data
- Geolocation support
- Timezone selection
- Helpful guidance for users

### Chart Visualization
- Interactive D3.js wheel chart
- Zoom and pan controls
- Planet symbols and positions
- Aspect lines and interpretations

### Transit Analysis
- Real-time transit calculations
- Aspect detection with configurable orbs
- Transit-to-natal comparisons
- Retrograde movement tracking

## Astrological Features

### Supported Planets
- Sun, Moon, Mercury, Venus, Mars
- Jupiter, Saturn, Uranus, Neptune, Pluto
- North Node, Lilith, Chiron, Part of Fortune, Vertex

### House System
- Whole Sign houses (default)
- Ascendant and Midheaven calculations
- House cusps and significations

### Aspects
- Conjunction (0°)
- Sextile (60°)
- Square (90°)
- Trine (120°)
- Opposition (180°)

## Development

### Adding New Features

1. **New Astrological Calculations**: Add to `src/lib/chart/`
2. **New Visualizations**: Create components in `src/routes/`
3. **New Interpretations**: Update the interpretations data
4. **Styling**: Use the existing CSS patterns in `src/app.css`

### Code Style

- Use TypeScript for type safety
- Follow SvelteKit conventions
- Use reactive statements (`$:`) for derived state
- Implement proper error handling
- Add loading states for async operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **Swiss Ephemeris**: High-precision astronomical calculations
- **D3.js**: Data visualization library
- **SvelteKit**: Modern web framework
- **Original Projects**: `node-ephemeris` and `astro-chart` for inspiration and functionality

## Support

For questions or issues, please open an issue on the GitHub repository.

---

**Note**: This application is for educational and entertainment purposes. Astrological interpretations should not be used as a substitute for professional advice.
