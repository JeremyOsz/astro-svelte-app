# Ephemeris API Setup Guide

## Overview
The application has been updated to require a real ephemeris API instead of using mock data. This guide will help you set up the external ephemeris service.

## Environment Variables Required

Add these to your `.env` file:

```env
EPHEMERIS_URL=http://localhost:8001
EPHEMERIS_API_KEY=your_api_key_here
```

## Option 1: Swiss Ephemeris API (Recommended)

### Setup Instructions
1. **Install Swiss Ephemeris API**:
   ```bash
   # Clone the Swiss Ephemeris API repository
   git clone https://github.com/your-swiss-ephemeris-api-repo
   cd swiss-ephemeris-api
   
   # Install dependencies
   npm install
   
   # Start the API server
   npm start
   ```

2. **Configure Environment**:
   ```env
   EPHEMERIS_API_URL=http://localhost:8001
   EPHEMERIS_API_KEY=your_api_key_here
   ```

### API Endpoints Expected
- `POST /birth-chart` - Calculate natal chart
- `POST /transits` - Calculate transit data

### Request Format
```json
{
  "date": "1991-12-10",
  "time": "04:59:00",
  "place": "Melbourne, Australia",
  "latitude": -37.814,
  "longitude": 144.96332,
  "house_system": "whole_sign"
}
```

## Option 2: Alternative Ephemeris Services

### Astro.com API
```env
EPHEMERIS_API_URL=https://api.astro.com/v1
EPHEMERIS_API_KEY=your_astro_api_key
```

### Astrology API
```env
EPHEMERIS_API_URL=https://astrology-api.com
EPHEMERIS_API_KEY=your_astrology_api_key
```

## Testing the Setup

1. **Check API Connection**:
   ```bash
   curl -X POST http://localhost:8001/birth-chart \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your_api_key" \
     -d '{
       "date": "1991-12-10",
       "time": "04:59:00",
       "place": "Melbourne, Australia",
       "latitude": -37.814,
       "longitude": 144.96332,
       "house_system": "whole_sign"
     }'
   ```

2. **Test Transit Calculation**:
   ```bash
   curl -X POST http://localhost:8001/transits \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your_api_key" \
     -d '{
       "natal_date": "1991-12-10",
       "natal_time": "04:59:00",
       "natal_latitude": -37.814,
       "natal_longitude": 144.96332,
       "transit_date": "2025-01-15",
       "transit_time": "12:00:00",
       "house_system": "whole_sign"
     }'
   ```

## Error Handling

If you see errors like:
- `EPHEMERIS_API_KEY environment variable is not set`
- `connect ECONNREFUSED 127.0.0.1:8001`

This means the API is not properly configured or running.

## Development Mode (Optional)

If you need to temporarily use mock data during development, you can:

1. Comment out the API key check in `src/lib/astrology/swiss-ephemeris-service.ts`
2. Uncomment the mock data generation functions
3. Remember to re-enable real API for production

## Production Deployment

For production deployment:
1. Ensure the ephemeris API is running and accessible
2. Set proper environment variables
3. Configure CORS if needed
4. Set up proper authentication

## Troubleshooting

### Common Issues:
1. **API not running**: Start the ephemeris API service
2. **Wrong port**: Check if API is running on port 8001
3. **Authentication**: Verify API key is correct
4. **CORS**: Configure CORS headers on the API server
5. **Network**: Ensure the API URL is accessible from your app

### Debug Steps:
1. Check if API is running: `curl http://localhost:8001/health`
2. Verify environment variables are loaded
3. Check browser network tab for API calls
4. Review server logs for connection errors 