<script lang="ts">
  import { format } from 'date-fns';
  import { Moon, Sun, Star, Zap, Target, Lightbulb, Calendar, Clock, TrendingUp, TrendingDown, Minus, ExternalLink, Info } from 'lucide-svelte';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Button } from '$lib/components/ui/button';
  import type { DailyHoroscope } from '$lib/services/daily-horoscope';
  import type { BirthChart } from '$lib/types/types';

  export let currentHoroscope: DailyHoroscope;
  export let natalChart: BirthChart | null = null;

  // Format date
  $: formattedDate = format(new Date(currentHoroscope.date), 'EEEE, MMMM d, yyyy');
  
  // Intensity colors
  $: intensityColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400', 
    high: 'text-red-400'
  };

  $: intensityIcons = {
    low: TrendingDown,
    medium: Minus,
    high: TrendingUp
  };

  // Import centralized symbols
  import { PLANET_SYMBOLS, ASPECT_SYMBOLS } from '$lib/data/symbols';

  // Use centralized symbols
  const planetSymbols = PLANET_SYMBOLS;
  const aspectSymbols = ASPECT_SYMBOLS;

  // Daypart colors
  const daypartColors: Record<string, string> = {
    morning: 'text-orange-400',
    afternoon: 'text-yellow-400',
    evening: 'text-purple-400',
    night: 'text-blue-400'
  };

  // Helper function for ordinal suffixes
  function getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  }

  // Generate transit URL with current date
  $: transitUrl = natalChart ? `/transits?date=${currentHoroscope.date}&chart=${encodeURIComponent(JSON.stringify(natalChart))}` : '/transits';
</script>

<div class="space-y-6">
  <!-- Header with Theme -->
  <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-white flex items-center gap-2">
        <Calendar class="w-6 h-6" />
        {formattedDate}
      </h2>
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-300">Intensity:</span>
        <div class="flex items-center gap-1 {intensityColors[currentHoroscope.intensity]}">
          <svelte:component this={intensityIcons[currentHoroscope.intensity]} class="w-4 h-4" />
          <span class="capitalize font-medium">{currentHoroscope.intensity}</span>
        </div>
      </div>
    </div>
    
    <div class="bg-white/10 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <Lightbulb class="w-5 h-5 text-yellow-400" />
        Today's Theme
      </h3>
      <p class="text-slate-200 text-lg leading-relaxed mb-3">{currentHoroscope.theme}</p>
      <div class="text-sm text-slate-300 bg-white/5 rounded p-3">
        <p class="italic">💡 <strong>What this means:</strong> This theme represents the overall energy and focus for your day, based on the most significant planetary influences currently affecting your natal chart.</p>
      </div>
    </div>
  </div>

  <!-- Moon Information -->
  <div class="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
    <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <Moon class="w-5 h-5 text-blue-400" />
      Moon in {currentHoroscope.moonInfo.sign} ({currentHoroscope.moonInfo.house || '?'}{getOrdinalSuffix(currentHoroscope.moonInfo.house || 1)} House)
    </h3>
    
    <p class="text-slate-200 mb-4 leading-relaxed">{currentHoroscope.moonInfo.description}</p>
    
    {#if currentHoroscope.moonInfo.voidOfCourse}
      <div class="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
        <p class="text-yellow-200 text-sm">
          <strong>Void of Course Moon:</strong> Avoid starting new projects or making important decisions during this period.
        </p>
      </div>
    {/if}
  </div>

  <!-- Key Transits -->
  <div class="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-white flex items-center gap-2">
        <Zap class="w-5 h-5 text-green-400" />
        Key Transits
      </h3>
      <Button 
        href={transitUrl} 
        variant="outline" 
        size="sm"
        class="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
      >
        <ExternalLink class="w-4 h-4 mr-1" />
        View Details
      </Button>
    </div>
    
    <div class="text-sm text-slate-300 bg-white/5 rounded p-3 mb-4">
      <p class="italic">⚡ <strong>Understanding Transits:</strong> These are current planetary positions forming aspects to your natal planets. The closer the orb (degree), the stronger the influence.</p>
    </div>
    
    {#if currentHoroscope.keyTransits.length === 0}
      <p class="text-slate-300 italic">No major transits today. A gentle day for reflection and small steps forward.</p>
    {:else}
      <div class="space-y-3">
        {#each currentHoroscope.keyTransits as transit}
          <div class="bg-white/10 rounded-lg p-4 border-l-4 border-green-400/30">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">{planetSymbols[transit.transitPlanet] || '★'}</span>
                <span class="text-white font-medium">{transit.transitPlanet}</span>
                <span class="text-lg">{aspectSymbols[transit.aspect] || '∠'}</span>
                <span class="text-white font-medium">{transit.natalPlanet}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-slate-300">Orb: {transit.orb.toFixed(1)}°</span>
                {#if transit.daypart}
                  <span class="{daypartColors[transit.daypart]} capitalize">{transit.daypart}</span>
                {/if}
              </div>
            </div>
            <p class="text-slate-200 text-sm leading-relaxed">{transit.interpretation}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Guidance -->
  <div class="bg-gradient-to-r from-purple-600/20 to-violet-600/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-white flex items-center gap-2">
        <Target class="w-5 h-5 text-purple-400" />
        Guidance
      </h3>
      <Button 
        href="/interpretations" 
        variant="outline" 
        size="sm"
        class="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
      >
        <Info class="w-4 h-4 mr-1" />
        View Interpretations
      </Button>
    </div>
    <p class="text-slate-200 leading-relaxed text-lg mb-3">{currentHoroscope.guidance}</p>
    <div class="text-sm text-slate-300 bg-white/5 rounded p-3">
      <p class="italic">🎯 <strong>How to use this:</strong> This guidance synthesizes all the day's planetary influences into practical advice. Consider how these energies might manifest in your daily activities and relationships.</p>
    </div>
  </div>

  <!-- Lunar Phase -->
  <div class="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-6 border border-indigo-500/30">
    <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <Star class="w-5 h-5 text-indigo-400" />
      Lunar Phase: {currentHoroscope.lunarPhase.phase}
    </h3>
    <p class="text-slate-200 leading-relaxed">{currentHoroscope.lunarPhase.description}</p>
    
    <!-- Moon phase visualization -->
    <div class="mt-4 flex items-center gap-4">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 rounded-full border-2 border-slate-400"></div>
        <div 
          class="absolute inset-1 rounded-full bg-slate-300"
          style="clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, {currentHoroscope.lunarPhase.percentage > 50 ? '0% 100%, 0% 0%' : `${currentHoroscope.lunarPhase.percentage}% 0%, ${currentHoroscope.lunarPhase.percentage}% 100%`})"
        ></div>
      </div>
      <div class="text-sm text-slate-300">
        <p>Illumination: {currentHoroscope.lunarPhase.percentage}%</p>
      </div>
    </div>
  </div>

  <!-- Action Advice -->
  <div class="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-lg p-6 border border-orange-500/30">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-white flex items-center gap-2">
        <Sun class="w-5 h-5 text-orange-400" />
        Action Advice
      </h3>
      <Button 
        href={transitUrl.replace('/transits', '/biwheel')} 
        variant="outline" 
        size="sm"
        class="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
      >
        <ExternalLink class="w-4 h-4 mr-1" />
        View Chart
      </Button>
    </div>
    <p class="text-slate-200 leading-relaxed text-lg mb-3">{currentHoroscope.actionAdvice}</p>
    <div class="text-sm text-slate-300 bg-white/5 rounded p-3">
      <p class="italic">🌅 <strong>Take Action:</strong> These are specific, actionable steps you can take today to align with the cosmic energies and make the most of the day's opportunities.</p>
    </div>
  </div>

  <!-- Additional Details (Collapsible) -->
  <Accordion.Root type="single" class="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
    <Accordion.Item value="details">
      <Accordion.Trigger class="text-white hover:text-slate-200 px-6 py-4">
        <span class="text-lg font-medium flex items-center gap-2">
          <Info class="w-5 h-5" />
          Additional Details
        </span>
      </Accordion.Trigger>
      <Accordion.Content class="px-6 pb-4">
        <div class="space-y-6">
          <!-- Transit Information -->
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-white mb-3 flex items-center gap-2">
                <Zap class="w-4 h-4 text-green-400" />
                Transit Details
              </h4>
              {#if currentHoroscope.keyTransits.length === 0}
                <p class="text-slate-300 italic text-sm">No major transits today</p>
              {:else}
                <div class="space-y-2">
                  {#each currentHoroscope.keyTransits as transit}
                    <div class="bg-white/5 rounded p-3">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm">{planetSymbols[transit.transitPlanet] || '★'}</span>
                        <span class="text-white text-sm font-medium">{transit.transitPlanet}</span>
                        <span class="text-sm">{aspectSymbols[transit.aspect] || '∠'}</span>
                        <span class="text-white text-sm font-medium">{transit.natalPlanet}</span>
                      </div>
                      <div class="text-xs text-slate-400">
                        <span>Orb: {transit.orb.toFixed(1)}°</span>
                        {#if transit.daypart}
                          <span class="ml-2 {daypartColors[transit.daypart]}">{transit.daypart}</span>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
            
            <div>
              <h4 class="font-medium text-white mb-3 flex items-center gap-2">
                <Moon class="w-4 h-4 text-blue-400" />
                Moon Information
              </h4>
              <div class="space-y-2 text-sm">
                <div class="bg-white/5 rounded p-3">
                  <p><span class="text-slate-400">Sign:</span> <span class="text-white">{currentHoroscope.moonInfo.sign}</span></p>
                  <p><span class="text-slate-400">House:</span> <span class="text-white">{currentHoroscope.moonInfo.house}{getOrdinalSuffix(currentHoroscope.moonInfo.house)}</span></p>
                  <p><span class="text-slate-400">Void of Course:</span> <span class="text-white">{currentHoroscope.moonInfo.voidOfCourse ? 'Yes' : 'No'}</span></p>
                </div>
                
                {#if currentHoroscope.moonInfo.aspects.length > 0}
                  <div class="bg-white/5 rounded p-3">
                    <p class="text-slate-400 mb-1">Moon Aspects:</p>
                    <ul class="space-y-1">
                      {#each currentHoroscope.moonInfo.aspects as aspect}
                        <li class="text-xs">
                          {aspect.transitPlanet} {aspect.type} {aspect.natalPlanet} (orb: {aspect.orb.toFixed(1)}°)
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-white mb-3 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-purple-400" />
                Technical Details
              </h4>
              <div class="bg-white/5 rounded p-3 space-y-1 text-sm">
                <p><span class="text-slate-400">Date:</span> <span class="text-white">{currentHoroscope.date}</span></p>
                <p><span class="text-slate-400">Intensity Level:</span> <span class="text-white capitalize">{currentHoroscope.intensity}</span></p>
                <p><span class="text-slate-400">Key Transits:</span> <span class="text-white">{currentHoroscope.keyTransits.length}</span></p>
                <p><span class="text-slate-400">Lunar Phase:</span> <span class="text-white">{currentHoroscope.lunarPhase.phase} ({currentHoroscope.lunarPhase.percentage}%)</span></p>
                <p><span class="text-slate-400">Moon House:</span> <span class="text-white">{currentHoroscope.moonInfo.house}{getOrdinalSuffix(currentHoroscope.moonInfo.house)}</span></p>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-white mb-3 flex items-center gap-2">
                <Star class="w-4 h-4 text-yellow-400" />
                More Information
              </h4>
              <div class="space-y-3">
                <div class="bg-white/5 rounded p-3">
                  <p class="text-slate-300 text-sm mb-2">Get detailed transit information and charts for this date:</p>
                  <Button 
                    href={transitUrl} 
                    class="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    <ExternalLink class="w-4 h-4 mr-2" />
                    View Detailed Transits
                  </Button>
                </div>
                
                <div class="bg-white/5 rounded p-3">
                  <p class="text-slate-300 text-sm mb-2">Explore your birth chart and interpretations:</p>
                  <Button 
                    href="/interpretations" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Info class="w-4 h-4 mr-2" />
                    View Interpretations
                  </Button>
                </div>
                
              </div>
            </div>
          </div>

          <!-- Daily Summary -->
          <div>
            <h4 class="font-medium text-white mb-3 flex items-center gap-2">
              <Lightbulb class="w-4 h-4 text-yellow-400" />
              Daily Summary
            </h4>
            <div class="bg-white/5 rounded p-3">
              <p class="text-slate-300 text-sm leading-relaxed">
                Today's energy is characterized by <span class="text-white font-medium">{currentHoroscope.intensity}</span> intensity with the Moon in <span class="text-white font-medium">{currentHoroscope.moonInfo.sign}</span> 
                ({currentHoroscope.moonInfo.house}{getOrdinalSuffix(currentHoroscope.moonInfo.house)} house). The lunar phase is <span class="text-white font-medium">{currentHoroscope.lunarPhase.phase}</span> 
                with {currentHoroscope.lunarPhase.percentage}% illumination. {currentHoroscope.keyTransits.length > 0 ? 
                  `There are ${currentHoroscope.keyTransits.length} significant transit(s) today.` : 
                  'There are no major transits today, making this a gentle day for reflection and small steps forward.'
                }
              </p>
            </div>
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</div>

<style>
  /* Custom styles for better visual appeal */
  :global(.accordion-trigger[data-state="open"]) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
</style> 