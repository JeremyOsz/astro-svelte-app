# Caching System for Planet Positions

## Overview

The application now includes a comprehensive caching system for planet positions to reduce API calls and improve performance. This system caches daily planet positions for 24 hours, significantly reducing the load on the external ephemeris API.

## Architecture

### Client-Side Caching (`planet-positions-cache.ts`)
- **Location**: `src/lib/services/planet-positions-cache.ts`
- **Duration**: 24 hours for daily positions, 1 hour for hourly positions
- **Storage**: In-memory Map with automatic cleanup
- **Features**:
  - Automatic cache expiration
  - Source tracking (API vs fallback data)
  - Cache status monitoring
  - Manual cache invalidation

### Server-Side Caching (`current-positions/+server.ts`)
- **Location**: `src/routes/api/current-positions/+server.ts`
- **Duration**: 1 hour
- **Storage**: In-memory Map
- **Purpose**: Reduces external API calls at the server level

### Cache Management (`cache-management.ts`)
- **Location**: `src/lib/services/cache-management.ts`
- **Features**:
  - Cache statistics
  - Manual cache clearing
  - Cache invalidation
  - Age formatting utilities

## Usage

### Automatic Caching
The `CurrentPlanetPositions` component automatically uses caching:

1. **Cache Check**: Before making an API call, checks if cached data exists and is valid
2. **Cache Storage**: Stores successful API responses and fallback data
3. **Cache Display**: Shows cache status in the UI (cached vs fresh data)

### Manual Cache Management
```typescript
import { CacheManager } from '$lib/services/cache-management';

// Get cache statistics
const stats = CacheManager.getStats();

// Clear all cache
CacheManager.clearCache();

// Invalidate specific date
CacheManager.invalidateCache('2024-01-15');

// Get cache status for a specific date/time
const status = CacheManager.getCacheStatus('2024-01-15', '12:00:00');
```

## Benefits

1. **Reduced API Calls**: Daily positions are cached for 24 hours
2. **Improved Performance**: Instant loading for cached data
3. **Cost Savings**: Fewer external API requests
4. **Better UX**: Faster response times and offline fallback
5. **Development Tools**: Debug panel for cache monitoring

## Cache Behavior

### Daily Positions
- **Cache Duration**: 24 hours
- **Key Format**: `planet_positions_YYYY-MM-DD`
- **Use Case**: Current planet positions for the day

### Hourly Positions (Future)
- **Cache Duration**: 1 hour
- **Key Format**: `planet_positions_YYYY-MM-DD_HH`
- **Use Case**: More frequent updates when needed

### Fallback Data
- Cached when API fails
- Provides consistent experience during outages
- Same cache duration as successful API responses

## Debug Tools

### Cache Debug Panel
- **Location**: `src/lib/components/CacheDebugPanel.svelte`
- **Visibility**: Only in development mode
- **Features**:
  - Real-time cache statistics
  - Manual cache refresh
  - Cache clearing
  - Detailed cache information

### Console Logging
- Cache hits and misses are logged
- Cache expiration notifications
- Cleanup statistics

## Configuration

### Cache Durations
```typescript
// In planet-positions-cache.ts
private readonly DAILY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
private readonly HOURLY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
```

### Server Cache Duration
```typescript
// In current-positions/+server.ts
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
```

## Monitoring

### Cache Statistics
- Number of cached entries
- Average cache age
- Cache hit/miss ratios
- Source distribution (API vs fallback)

### Performance Metrics
- Reduced API calls
- Faster response times
- Improved user experience

## Future Enhancements

1. **Persistent Storage**: Save cache to localStorage for browser persistence
2. **Background Refresh**: Update cache in background before expiration
3. **Smart Invalidation**: Invalidate cache based on data changes
4. **Cache Warming**: Pre-populate cache for common dates
5. **Analytics**: Track cache performance and user patterns 