<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Search, Sparkles, Star, Home, Users, Zap, BookOpen, Calendar, Moon, Sun, ArrowRight, Clock, TrendingUp, Eye, Scroll, Crown } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import CurrentPlanetPositions from '$lib/components/CurrentPlanetPositions.svelte';
  import CacheDebugPanel from '$lib/components/CacheDebugPanel.svelte';
  
  let currentTime = new Date();
  
  onMount(() => {
    const timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);
    
    return () => clearInterval(timer);
  });

  const arcaneTools = [
    {
      icon: Star,
      title: "Birth Chart",
      description: "Reveal your celestial blueprint with Swiss Ephemeris precision",
      href: "/chart",
      color: "from-orange-500 to-red-500",
      badge: "Core"
    },
    {
      icon: Moon,
      title: "Current Transits",
      description: "Unveil today's cosmic influences and planetary alignments",
      href: "/transits",
      color: "from-blue-500 to-purple-500",
      badge: "Live"
    },
    {
      icon: Calendar,
      title: "Daily Horoscope",
      description: "Your personalized celestial guidance for today",
      href: "/daily-horoscope",
      color: "from-pink-500 to-rose-500",
      badge: "Daily"
    },
    {
      icon: BookOpen,
      title: "Interpretations",
      description: "Master the wisdom of planetary meanings and aspects",
      href: "/interpretations",
      color: "from-green-500 to-teal-500",
      badge: "Guide"
    },
    {
      icon: Sparkles,
      title: "Tarot Cards",
      description: "Explore all 78 mystical cards and their sacred meanings",
      href: "/tarot",
      color: "from-purple-500 to-indigo-500",
      badge: "Divination"
    }
  ];

  const velvetExperience = [
    {
      title: "Swiss Ephemeris Precision",
      description: "Professional-grade celestial calculations for unparalleled accuracy",
      icon: Crown,
      color: "text-purple-600"
    },
    {
      title: "Real-time Cosmic Currents",
      description: "Live planetary positions and immediate celestial influences",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Elegant Responsive Design",
      description: "Sophisticated charts that adapt beautifully to all devices",
      icon: Eye,
      color: "text-green-600"
    }
  ];
</script>

<svelte:head>
  <title>Velvet Arcana - Your Personal Grimoire of Celestial Wisdom</title>
  <meta name="description" content="Unlock the secrets of the cosmos with Velvet Arcana. Birth charts, transits, and tarot wisdom in an elegant, mysterious interface." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
  <!-- Hero Section -->
  <div class="px-4 py-8 lg:py-12">
    <div class="max-w-4xl mx-auto text-center">
      <div class="mb-6">
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-purple-200/50">
          <Sparkles class="w-4 h-4" />
          Velvet Arcana
        </div>
        <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
          Welcome to
          <span class="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
            Velvet Arcana
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Unlock the secrets of the cosmos with Swiss Ephemeris precision. Your personal grimoire of celestial wisdom awaits.
        </p>
      </div>

      <!-- Current Time and Planet Positions -->
      <div class="grid grid-cols-1 gap-6 mb-8">
        
        <!-- Planet Positions -->
        <CurrentPlanetPositions />
        
        <!-- Cache Debug Panel (Development Only) -->
        <div class="max-w-md mx-auto">
          <CacheDebugPanel />
        </div>
      </div>
    </div>
  </div>

  <!-- Arcane Tools Grid -->
  <div class="px-4 pb-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
        Arcane Tools
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each arcaneTools as tool}
          <Card class="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/90 backdrop-blur-sm hover:bg-white/95">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="p-2 rounded-lg bg-gradient-to-r {tool.color} text-white shadow-lg">
                  <svelte:component this={tool.icon} class="w-5 h-5" />
                </div>
                <Badge variant="secondary" class="text-xs bg-purple-100 text-purple-700">
                  {tool.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="pt-0">
              <CardTitle class="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                {tool.title}
              </CardTitle>
              <CardDescription class="text-sm text-gray-600 mb-4">
                {tool.description}
              </CardDescription>
              <a 
                href={tool.href}
                class="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm group-hover:gap-1 transition-all"
              >
                Begin
                <ArrowRight class="w-4 h-4 ml-1" />
              </a>
            </CardContent>
          </Card>
        {/each}
      </div>
    </div>
  </div>

  <!-- The Velvet Arcana Experience Section -->
  <div class="px-4 py-8 bg-gradient-to-r from-slate-50 to-purple-50">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
        The Velvet Arcana Experience
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each velvetExperience as experience}
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 mb-4 shadow-lg">
              <svelte:component this={experience.icon} class="w-6 h-6 {experience.color}" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {experience.title}
            </h3>
            <p class="text-gray-600 text-sm">
              {experience.description}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Tarot Section -->
  <div class="px-4 py-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-slate-100">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          The Arcana Unveiled
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the mystical meanings and interpretations of all 78 tarot cards. Each card reveals insights into love, career, health, and the sacred journey of life.
        </p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Tarot Info -->
        <div class="space-y-6">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/20">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Complete Tarot Library</h3>
            <div class="space-y-4 text-sm text-gray-700">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="font-medium">Major Arcana (22 cards):</span> The Fool's sacred journey through life's spiritual lessons
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="font-medium">Minor Arcana (56 cards):</span> Daily life experiences through the four mystical suits
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="font-medium">Detailed Interpretations:</span> Love, career, health, and spiritual guidance for each card
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="font-medium">Astrological Connections:</span> Planetary rulers, zodiac signs, and elemental associations
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/20">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">How to Use the Library</h3>
            <div class="space-y-3 text-sm text-gray-700">
              <p>• <span class="font-medium">Search & Discover:</span> Find specific cards by name, keywords, or suit</p>
              <p>• <span class="font-medium">Sacred Meanings:</span> Explore upright and reversed interpretations</p>
              <p>• <span class="font-medium">Symbolic Wisdom:</span> Understand the deeper symbolism and astrological connections</p>
              <p>• <span class="font-medium">Life Guidance:</span> Apply tarot wisdom to your personal journey</p>
            </div>
          </div>
        </div>
        
        <!-- Tarot Preview -->
        <div class="relative">
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200/20">
            <!-- Decorative tarot card grid -->
            <div class="grid grid-cols-4 gap-3 mb-6">
              <div class="aspect-[3/5] overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/00-TheFool.png" 
                  alt="The Fool" 
                  class="w-full h-full"
                />
              </div>
              <div class="aspect-[3/5]  overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/01-TheMagician.png" 
                  alt="The Magician" 
                  class="w-full h-full "
                />
              </div>
              <div class="aspect-[3/5] overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/18-TheMoon.png" 
                  alt="The Moon" 
                  class="w-full h-full "
                />
              </div>
              <div class="aspect-[3/5]  overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/Cups01.png" 
                  alt="Ace of Cups" 
                  class="w-full h-full "
                />
              </div>
              <div class="aspect-[3/5]  overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/Swords01.png" 
                  alt="Ace of Swords" 
                  class="w-full h-full "
                />
              </div>
              <div class="aspect-[3/5]  overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/Pentacles01.png" 
                  alt="Ace of Pentacles" 
                  class="w-full h-full "
                />
              </div>
              <div class="aspect-[3/5]  overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/Wands01.png" 
                  alt="Ace of Wands" 
                  class="w-full h-full "
                />
              </div>
              <div class="aspect-[3/5]  overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src="/src/lib/images/tarot/Cards-png/21-TheWorld.png" 
                  alt="The World" 
                  class="w-full h-full "
                />
              </div>
            </div>
            
            <div class="text-center">
              <a 
                href="/tarot"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Sparkles class="w-4 h-4" />
                Explore All 78 Cards
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="px-4 py-12">
    <div class="max-w-2xl mx-auto text-center">
      <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <h3 class="text-2xl font-bold mb-4">
          Ready to Unlock Your Arcana?
        </h3>
        <p class="text-purple-100 mb-6">
          Calculate your birth chart with Swiss Ephemeris precision and discover your unique celestial blueprint. The stars might surprise you—or at least give you something fascinating to contemplate.
        </p>
        <Button size="lg" class="bg-white text-purple-600 hover:bg-gray-100 shadow-lg">
          <Star class="w-5 h-5 mr-2" />
          Begin Your Journey
        </Button>
      </div>
    </div>
  </div>
</div>
