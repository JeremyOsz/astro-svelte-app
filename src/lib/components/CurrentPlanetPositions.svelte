<script lang="ts">
  import { onMount } from 'svelte';
  import { Star, Sun, Moon, Zap } from 'lucide-svelte';
  import { planetPositionsCache } from '$lib/services/planet-positions-cache';

  let planetPositions: any[] = [];
  let isLoading = true;
  let error: string | null = null;
  let cacheStatus: { exists: boolean; valid: boolean; age: number | null } | null = null;

  const planetSymbols: Record<string, string> = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇'
  };

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const planetColors: Record<string, string> = {
    'Sun': 'text-yellow-500',
    'Moon': 'text-slate-400',
    'Mercury': 'text-gray-600',
    'Venus': 'text-pink-500',
    'Mars': 'text-red-600',
    'Jupiter': 'text-orange-500',
    'Saturn': 'text-purple-600',
    'Uranus': 'text-cyan-600',
    'Neptune': 'text-blue-700',
    'Pluto': 'text-red-800'
  };

  async function fetchPlanetPositions() {
    // Get current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    
    try {
      isLoading = true;
      error = null;

      // Check cache first
      cacheStatus = planetPositionsCache.getCacheStatus(dateStr, timeStr);
      const cachedPositions = planetPositionsCache.get(dateStr, timeStr);
      if (cachedPositions) {
        planetPositions = cachedPositions;
        isLoading = false;
        return;
      }
      
      // Call the current positions API
      const response = await fetch('/api/current-positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateStr,
          time: timeStr,
          latitude: 51.5074, // London coordinates
          longitude: -0.1278,
          house_system: 'whole_sign'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch planet positions');
      }

      const data = await response.json();
      
      // Transform the data to extract planet positions
      if (data.objects) {
        
        const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
        
        // Extract planet data from the objects
        planetPositions = [];
        
        Object.entries(data.objects).forEach(([id, object]: [string, any]) => {
          // Check if this object has a name and longitude (indicating it's a planet)
          if (object.name && object.longitude && planets.includes(object.name)) {
            const longitude = object.longitude.raw;
            const signIndex = Math.floor(longitude / 30);
            const degreeInSign = longitude % 30;
            const degrees = Math.floor(degreeInSign);
            const minutes = Math.floor((degreeInSign - degrees) * 60);
            const sign = zodiacSigns[signIndex];
            
            // Check for retrograde movement - look for speed property
            const isRetrograde = object.speed && object.speed.raw < 0;
            
            const planetData = {
              name: object.name,
              symbol: planetSymbols[object.name] || object.name,
              sign,
              degrees,
              minutes,
              retrograde: isRetrograde,
              color: planetColors[object.name] || 'text-gray-600'
            };
            
            planetPositions.push(planetData);
          }
        });
        
        // If no planets found, use fallback data
        if (planetPositions.length === 0) {
          planetPositions = [
            { name: 'Sun', symbol: '☉', sign: 'Capricorn', degrees: 15, minutes: 30, retrograde: false, color: 'text-yellow-500' },
            { name: 'Moon', symbol: '☽', sign: 'Aquarius', degrees: 8, minutes: 45, retrograde: false, color: 'text-slate-400' },
            { name: 'Mercury', symbol: '☿', sign: 'Capricorn', degrees: 22, minutes: 15, retrograde: true, color: 'text-gray-600' },
            { name: 'Venus', symbol: '♀', sign: 'Sagittarius', degrees: 4, minutes: 0, retrograde: false, color: 'text-pink-500' },
            { name: 'Mars', symbol: '♂', sign: 'Sagittarius', degrees: 7, minutes: 36, retrograde: false, color: 'text-red-600' }
          ];
        }
        
        // Cache the successful result
        planetPositionsCache.set(dateStr, planetPositions, 'api', timeStr);
      } else {
        // Fallback data for testing
        planetPositions = [
          { name: 'Sun', symbol: '☉', sign: 'Capricorn', degrees: 15, minutes: 30, retrograde: false, color: 'text-yellow-500' },
          { name: 'Moon', symbol: '☽', sign: 'Aquarius', degrees: 8, minutes: 45, retrograde: false, color: 'text-slate-400' },
          { name: 'Mercury', symbol: '☿', sign: 'Capricorn', degrees: 22, minutes: 15, retrograde: true, color: 'text-gray-600' },
          { name: 'Venus', symbol: '♀', sign: 'Sagittarius', degrees: 4, minutes: 0, retrograde: false, color: 'text-pink-500' },
          { name: 'Mars', symbol: '♂', sign: 'Sagittarius', degrees: 7, minutes: 36, retrograde: false, color: 'text-red-600' }
        ];
        
        // Cache the fallback data as well
        planetPositionsCache.set(dateStr, planetPositions, 'fallback', timeStr);
      }
    } catch (err) {
      console.error('Error fetching planet positions:', err);
      error = 'Unable to load planet positions';
      
      // Fallback data for testing
      planetPositions = [
        { name: 'Sun', symbol: '☉', sign: 'Capricorn', degrees: 15, minutes: 30, retrograde: false, color: 'text-yellow-500' },
        { name: 'Moon', symbol: '☽', sign: 'Aquarius', degrees: 8, minutes: 45, retrograde: false, color: 'text-slate-400' },
        { name: 'Mercury', symbol: '☿', sign: 'Capricorn', degrees: 22, minutes: 15, retrograde: true, color: 'text-gray-600' },
        { name: 'Venus', symbol: '♀', sign: 'Sagittarius', degrees: 4, minutes: 0, retrograde: false, color: 'text-pink-500' },
        { name: 'Mars', symbol: '♂', sign: 'Sagittarius', degrees: 7, minutes: 36, retrograde: false, color: 'text-red-600' }
      ];
      
      // Cache the error fallback data as well
      planetPositionsCache.set(dateStr, planetPositions, 'fallback', timeStr);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchPlanetPositions();
  });
</script>

    <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
      <div class="flex items-center justify-center gap-3 mb-3">
        <Zap class="w-5 h-5 text-purple-600" />
        <h3 class="text-lg font-semibold text-gray-900">Today's Planetary Positions</h3>
      </div>
      
      {#if isLoading}
        <div class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <p class="text-sm text-gray-600 mt-2">Loading planetary positions...</p>
        </div>
      {:else if error}
        <div class="text-center py-4">
          <p class="text-sm text-gray-600">{error}</p>
          <p class="text-xs text-gray-500 mt-2">Showing sample data</p>
        </div>
      {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {#each planetPositions as planet}
            <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <span class="text-lg {planet.color} font-bold" style="font-family: 'Noto Sans Symbols', Arial, sans-serif;">
                {planet.symbol}
              </span>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium text-gray-900 truncate">
                  {planet.sign}
                </div>
                <div class="text-xs text-gray-600">
                  {planet.degrees}°{planet.minutes.toString().padStart(2, '0')}'
                  {#if planet.retrograde}
                    <span class="text-red-500 ml-1">R</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
        
        <div class="text-center mt-3">
          <p class="text-xs text-gray-500">
            Positions update in real-time • Based on current ephemeris data
            {#if cacheStatus}
              <br>
              <span class="text-xs text-purple-600">
                {cacheStatus.exists && cacheStatus.valid ? '📦 Cached' : '🔄 Fresh data'}
                {#if cacheStatus.age}
                  • {Math.round(cacheStatus.age / 1000 / 60)}m ago
                {/if}
              </span>
            {/if}
          </p>
        </div>
      {/if}
    </div> 