# Astro Chart

A comprehensive astrology application built with SvelteKit, featuring birth chart calculations, planetary transits, interactive D3.js visualizations, and modern UI components.

## ✨ Features

- **🌞 Birth Chart Calculator**: Calculate natal charts with precise planetary positions using Swiss Ephemeris
- **🌙 Planetary Transits**: View current transits and their aspects to your natal chart
- **📖 Interpretations**: Comprehensive astrological interpretations for planets, signs, houses, and aspects
- **🎴 Tarot Cards**: Explore all 78 tarot cards with detailed meanings
- **📊 Interactive Visualizations**: Beautiful D3.js charts with modern styling
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 Chart Storage**: Save and share your birth charts with URL sharing
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🛠 Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript
- **Astronomical Calculations**: Swiss Ephemeris API for high-precision calculations
- **Visualizations**: D3.js for interactive charts
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide Svelte icons
- **State Management**: Svelte stores for reactive data

## 🚀 Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd astro-svelte-app
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Start the development server:**
```bash
pnpm dev
```

4. **Open your browser and navigate to `http://localhost:5173`**

## 📡 API Endpoints

### Birth Chart Calculation
- **POST** `/api/birth-chart`
- **Body**: `{ date, time, latitude, longitude, timezone }`
- **Returns**: Complete birth chart with planetary positions and house cusps

### Transit Calculation
- **POST** `/api/transits`
- **Body**: `{ natalChart, transitDate }`
- **Returns**: Current planetary transits with aspects to natal chart

### Daily Horoscope
- **GET** `/api/daily-horoscope`
- **Query**: `{ sign }`
- **Returns**: Daily horoscope for the specified zodiac sign

## 🌟 Astronomical Accuracy

This application uses Swiss Ephemeris for planetary calculations, providing:

- **High Precision**: Professional-grade astronomical accuracy
- **Comprehensive Coverage**: All major planets, asteroids, and points
- **Multiple House Systems**: Support for Placidus, Whole Sign, and more
- **Real-time Data**: Live calculations for current transits

### Features Supported

- ✅ Sun, Moon, and all major planets
- ✅ Ascendant, Midheaven, and house cusps
- ✅ Major and minor aspects
- ✅ House systems (Placidus, Whole Sign)
- ✅ Current planetary transits
- ✅ Chart storage and sharing

## 📁 Project Structure

```
src/
├── lib/
│   ├── astrology/               # Core astrology calculations
│   │   ├── astrology.ts         # Astrological constants and utilities
│   │   └── swiss-ephemeris-service.ts  # Swiss Ephemeris integration
│   ├── chart/                   # Chart visualization components
│   │   ├── D3Chart.svelte       # Main chart component
│   │   ├── D3TransitChart.svelte # Transit chart component
│   │   ├── chart-styles.css     # Chart-specific styles
│   │   └── tooltip.ts           # Chart tooltip utilities
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # shadcn/ui components
│   ├── data/                    # Data and configuration
│   │   ├── astrological-data.ts # Zodiac and planet data
│   │   ├── interpretations.ts   # Astrological interpretations
│   │   ├── interpretations-page-data.ts # Page-specific data
│   │   └── tarot-data.ts        # Tarot card data
│   ├── services/                # Application services
│   │   ├── chart-storage.ts     # Chart persistence
│   │   ├── city-service.ts      # Location services
│   │   └── url-sharing.ts       # URL parameter handling
│   ├── stores/                  # Svelte stores
│   │   └── chart-store.ts       # Chart state management
│   ├── types/                   # TypeScript type definitions
│   │   └── types.ts             # Core type definitions
│   └── utils/                   # Utility functions
│       ├── chart-utils.ts       # Chart-specific utilities
│       ├── date-utils.ts        # Date manipulation
│       └── validation-utils.ts  # Form validation
├── routes/                      # SvelteKit routes
│   ├── api/                     # API endpoints
│   │   ├── birth-chart/         # Birth chart API
│   │   ├── daily-horoscope/     # Horoscope API
│   │   └── transits/            # Transits API
│   ├── chart/                   # Birth chart page
│   ├── daily-horoscope/         # Daily horoscope page
│   ├── interpretations/         # Interpretations page
│   ├── tarot/                   # Tarot cards page
│   ├── transits/                # Transits page
│   ├── +layout.svelte           # Main layout
│   └── +page.svelte             # Homepage
└── static/                      # Static assets
    ├── assets/                  # Binary assets
    ├── data/                    # Static data files
    └── images/                  # Image assets
```

## 🎨 Design System

The application uses a modern design system built with:

- **shadcn/ui**: Beautiful, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Consistent iconography
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Prepared for future dark mode implementation

## 🔧 Development

### Adding New Features

1. **New Planetary Bodies**: Extend the planet data in `astrological-data.ts`
2. **House Systems**: Implement new house calculation functions
3. **Aspects**: Add new aspect types in the chart calculation logic
4. **UI Components**: Use shadcn/ui components for consistency

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Component Architecture**: Modular, reusable components

### Testing

```bash
# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🚀 Deployment

This application is designed to work on any platform that supports Node.js:

- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Automatic builds from Git with form handling
- **Railway**: Easy container deployment
- **Traditional hosting**: Standard Node.js deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add TypeScript types for new features
- Use shadcn/ui components for UI elements
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Swiss Ephemeris](https://www.astro.com/swisseph/) for astronomical calculations
- [D3.js](https://d3js.org/) for data visualization
- [SvelteKit](https://kit.svelte.dev/) for the web framework
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons

## 📞 Support

For questions, issues, or contributions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ using modern web technologies**
