<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Search, Sparkles, Star, Home, Users, Zap, BookOpen, Calendar, Moon, Sun, ArrowRight, Clock, TrendingUp } from 'lucide-svelte';
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

  const quickActions = [
    {
      icon: Star,
      title: "Birth Chart",
      description: "Calculate your natal chart",
      href: "/chart",
      color: "from-orange-500 to-red-500",
      badge: "Core"
    },
    {
      icon: Moon,
      title: "Current Transits",
      description: "See today's planetary influences",
      href: "/transits",
      color: "from-blue-500 to-purple-500",
      badge: "Live"
    },
    {
      icon: Calendar,
      title: "Daily Horoscope",
      description: "Your daily astrological guidance",
      href: "/daily-horoscope",
      color: "from-pink-500 to-rose-500",
      badge: "Daily"
    },
    {
      icon: BookOpen,
      title: "Interpretations",
      description: "Learn planetary meanings",
      href: "/interpretations",
      color: "from-green-500 to-teal-500",
      badge: "Guide"
    },
    {
      icon: Sparkles,
      title: "Tarot Cards",
      description: "Explore all 78 tarot cards",
      href: "/tarot",
      color: "from-purple-500 to-indigo-500",
      badge: "Divination"
    }
  ];

  const recentFeatures = [
    {
      title: "Enhanced Chart Accuracy",
      description: "Swiss Ephemeris calculations for professional-grade precision",
      icon: Sparkles,
      color: "text-purple-600"
    },
    {
      title: "Real-time Transits",
      description: "Live planetary positions and current influences",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Mobile Optimized",
      description: "Beautiful charts that work perfectly on all devices",
      icon: Zap,
      color: "text-green-600"
    }
  ];
</script>

<svelte:head>
  <title>Velvet Arcana - Your Personal Grimoire of Celestial Wisdom</title>
  <meta name="description" content="Unlock the secrets of the cosmos with Velvet Arcana. Birth charts, transits, and tarot wisdom in an elegant, mysterious interface." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
  <!-- Hero Section -->
  <div class="px-4 py-8 lg:py-12">
    <div class="max-w-4xl mx-auto text-center">
      <div class="mb-6">
        <div class="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles class="w-4 h-4" />
          Velvet Arcana
        </div>
        <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
          Welcome to
          <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Velvet Arcana
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Unlock the secrets of the cosmos with Swiss Ephemeris precision. Your personal grimoire of celestial wisdom awaits.
        </p>
      </div>

      <!-- Current Time and Planet Positions -->
      <div class="grid grid-cols-1 gap-6 mb-8">
        <!-- Current Time Display -->
        <!-- <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div class="flex items-center justify-center gap-4">
            <Clock class="w-6 h-6 text-indigo-600" />
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">
                {currentTime.toLocaleTimeString()}
              </div>
              <div class="text-sm text-gray-600">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div> -->
        
        <!-- Planet Positions -->
        <CurrentPlanetPositions />
        
        <!-- Cache Debug Panel (Development Only) -->
        <div class="max-w-md mx-auto">
          <CacheDebugPanel />
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="px-4 pb-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
        Arcane Tools
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each quickActions as action}
          <Card class="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="p-2 rounded-lg bg-gradient-to-r {action.color} text-white">
                  <svelte:component this={action.icon} class="w-5 h-5" />
                </div>
                <Badge variant="secondary" class="text-xs">
                  {action.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="pt-0">
              <CardTitle class="text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                {action.title}
              </CardTitle>
              <CardDescription class="text-sm text-gray-600 mb-4">
                {action.description}
              </CardDescription>
              <a 
                href={action.href}
                class="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm group-hover:gap-1 transition-all"
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

  <!-- Features Section -->
  <div class="px-4 py-8 bg-white/50">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
        The Velvet Arcana Experience
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each recentFeatures as feature}
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <svelte:component this={feature.icon} class="w-6 h-6 {feature.color}" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p class="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Tarot Section -->
  <div class="px-4 py-12 bg-gradient-to-br from-purple-50 to-indigo-100">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          The Arcana Unveiled
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the meanings and interpretations of all 78 tarot cards. Each card offers insight into love, career, health, and the journey of life.
        </p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Tarot Info -->
        <div class="space-y-6">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Complete Tarot Library</h3>
            <div class="space-y-4 text-sm text-gray-700">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="font-medium">Major Arcana (22 cards):</span> The Fool's Journey through life's spiritual lessons
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="font-medium">Minor Arcana (56 cards):</span> Daily life experiences through the four suits
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="font-medium">Detailed Interpretations:</span> Love, career, health, and general guidance for each card
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
          
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">How to Use</h3>
            <div class="space-y-3 text-sm text-gray-700">
              <p>• <span class="font-medium">Search & Filter:</span> Find specific cards by name, keywords, or suit</p>
              <p>• <span class="font-medium">Detailed Meanings:</span> Explore upright and reversed interpretations</p>
              <p>• <span class="font-medium">Symbolic Wisdom:</span> Understand the deeper symbolism and astrological connections</p>
              <p>• <span class="font-medium">Life Guidance:</span> Apply tarot wisdom to your personal journey</p>
            </div>
          </div>
        </div>
        
        <!-- Tarot Preview -->
        <div class="relative">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div class="text-center mb-6">
              <div class="text-4xl mb-2">🔮</div>
              <h3 class="text-lg font-semibold text-gray-900">Sample Cards</h3>
              <p class="text-sm text-gray-600">Click to explore the full collection</p>
            </div>
            
            <!-- Sample card grid -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              <div class="aspect-[3/5] bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg border-2 border-purple-200 flex items-center justify-center">
                <span class="text-xs font-medium text-purple-700 text-center">The Fool</span>
              </div>
              <div class="aspect-[3/5] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg border-2 border-blue-200 flex items-center justify-center">
                <span class="text-xs font-medium text-blue-700 text-center">The Moon</span>
              </div>
              <div class="aspect-[3/5] bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border-2 border-green-200 flex items-center justify-center">
                <span class="text-xs font-medium text-green-700 text-center">Ace of Cups</span>
              </div>
            </div>
            
            <div class="text-center">
              <a 
                href="/tarot"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
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
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-4">
          Ready to Unlock Your Arcana?
        </h3>
        <p class="text-indigo-100 mb-6">
          Calculate your birth chart with Swiss Ephemeris precision and discover your unique astrological blueprint. The stars might surprise you—or at least give you something fun to ponder.
        </p>
        <Button size="lg" class="bg-white text-indigo-600 hover:bg-gray-100">
          <Star class="w-5 h-5 mr-2" />
          Begin Your Journey
        </Button>
      </div>
    </div>
  </div>
</div>
