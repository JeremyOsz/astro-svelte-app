# Astro Svelte App

A comprehensive astrology application built with SvelteKit, featuring birth chart calculations, planetary transits, and interactive D3.js visualizations.

## Features

- **Birth Chart Calculator**: Calculate natal charts with precise planetary positions
- **Planetary Transits**: View current transits and their aspects to your natal chart
- **Interactive Visualizations**: Beautiful D3.js charts and interpretations
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript
- **Astronomical Calculations**: [astronomia](https://github.com/commenthol/astronomia) - Pure JavaScript ephemeris library
- **Visualizations**: D3.js for interactive charts
- **Styling**: CSS with modern design principles

## Installation

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

## API Endpoints

### Birth Chart Calculation
- **POST** `/api/birth-chart`
- **Body**: `{ date, time, latitude, longitude, timezone }`
- **Returns**: Complete birth chart with planetary positions and house cusps

### Transit Calculation
- **POST** `/api/transits`
- **Body**: `{ natalChart, transitDate }`
- **Returns**: Current planetary transits with aspects to natal chart

## Astronomical Accuracy

This application uses the `astronomia` library for planetary calculations, which provides:

- **High Accuracy**: Based on VSOP87 theory for planetary positions
- **Pure JavaScript**: No native dependencies, works in all environments
- **Comprehensive Coverage**: Sun, Moon, and all major planets
- **Serverless Compatible**: Perfect for cloud deployment

### Current Limitations

- Moon position is approximated (for production use, consider integrating a dedicated Moon ephemeris)
- House calculations use simplified Placidus method
- No support for asteroids or minor planets

## Project Structure

```
src/
├── lib/
│   ├── astrology/
│   │   ├── astronomia-service.ts    # Main astronomical calculations
│   │   └── astrology.ts             # Astrological constants and utilities
│   ├── chart/
│   │   └── browser-chart.ts         # Chart formatting and API calls
│   └── types/
│       └── types.ts                 # TypeScript interfaces
├── routes/
│   ├── api/
│   │   ├── birth-chart/             # Birth chart API endpoint
│   │   └── transits/                # Transits API endpoint
│   ├── chart/                       # Birth chart page
│   ├── transits/                    # Transits page
│   └── interpretations/             # Interpretations page
└── static/                          # Static assets
```

## Development

### Adding New Features

1. **New Planetary Bodies**: Extend the `PLANET_NAMES` array in `astronomia-service.ts`
2. **House Systems**: Implement new house calculation functions
3. **Aspects**: Add new aspect types in the `calculateAspect` function

### Testing

```bash
# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment

This application is designed to work on any platform that supports Node.js:

- **Vercel**: Zero-config deployment
- **Netlify**: Automatic builds from Git
- **Railway**: Easy container deployment
- **Traditional hosting**: Standard Node.js deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [astronomia](https://github.com/commenthol/astronomia) for astronomical calculations
- [D3.js](https://d3js.org/) for data visualization
- [SvelteKit](https://kit.svelte.dev/) for the web framework
