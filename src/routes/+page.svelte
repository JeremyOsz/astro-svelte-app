<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Search, Sparkles, Star, Home, Users, Zap, BookOpen, Calendar, Moon, Sun, ArrowRight, Clock, TrendingUp } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  
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
  <title>Astro Chart - Your Personal Astrological Companion</title>
  <meta name="description" content="Calculate birth charts, view transits, and explore astrological interpretations with professional accuracy" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
  <!-- Hero Section -->
  <div class="px-4 py-8 lg:py-12">
    <div class="max-w-4xl mx-auto text-center">
      <div class="mb-6">
        <div class="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles class="w-4 h-4" />
          Professional Astrology
        </div>
        <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
          Your Cosmic
          <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Journey
          </span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover your astrological blueprint with Swiss Ephemeris precision. 
          Calculate birth charts, track transits, and explore the wisdom of the stars.
        </p>
      </div>

      <!-- Current Time Display -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
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
      </div>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div class="px-4 pb-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
        Quick Actions
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
                Get Started
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
        Why Choose Astro Chart?
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

  <!-- CTA Section -->
  <div class="px-4 py-12">
    <div class="max-w-2xl mx-auto text-center">
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-4">
          Ready to Explore Your Chart?
        </h3>
        <p class="text-indigo-100 mb-6">
          Calculate your birth chart with Swiss Ephemeris precision and discover your unique astrological blueprint.
        </p>
        <Button size="lg" class="bg-white text-indigo-600 hover:bg-gray-100">
          <Star class="w-5 h-5 mr-2" />
          Calculate Birth Chart
        </Button>
      </div>
    </div>
  </div>
</div>
