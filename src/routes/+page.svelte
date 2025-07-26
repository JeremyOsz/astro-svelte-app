<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Search, Sparkles, Star, Home, Users, Zap, BookOpen, Calendar, Moon, Sun } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  
  let currentTime = new Date();
  
  onMount(() => {
    const timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);
    
    return () => clearInterval(timer);
  });

  const features = [
    {
      icon: Sun,
      title: "Birth Charts",
      description: "Discover your cosmic blueprint with precise planetary positions and celestial influences that shape your unique journey.",
      href: "/chart",
      color: "from-orange-500 to-red-500",
      badge: "Core Wisdom"
    },
    {
      icon: Moon,
      title: "Transits",
      description: "Navigate life's currents by understanding how current planetary movements influence your natal chart and daily experiences.",
      href: "/transits",
      color: "from-blue-500 to-purple-500",
      badge: "Live Guidance"
    },
    {
      icon: BookOpen,
      title: "Interpretations",
      description: "Dive deep into the sacred meanings of planets, signs, houses, and aspects to unlock your spiritual understanding.",
      href: "/interpretations",
      color: "from-green-500 to-teal-500",
      badge: "Sacred Knowledge"
    },
    {
      icon: Calendar,
      title: "Daily Horoscope",
      description: "Receive daily cosmic guidance and insights aligned with your birth chart for spiritual growth and awareness.",
      href: "/daily-horoscope",
      color: "from-pink-500 to-rose-500",
      badge: "Daily Wisdom"
    }
  ];

  const cosmicWisdom = [
    { name: "Swiss Ephemeris", description: "Sacred astronomical calculations" },
    { name: "Ancient Wisdom", description: "Time-tested astrological traditions" },
    { name: "Cosmic Visualization", description: "Beautiful celestial charts" },
    { name: "Spiritual Guidance", description: "Intuitive interpretation system" },
    { name: "Sacred Geometry", description: "Harmonious design principles" },
    { name: "Mystical Components", description: "Enchanted user experience" }
  ];
</script>

<svelte:head>
  <title>Astro Chart - Birth Charts, Transits & Interpretations</title>
  <meta name="description" content="Calculate birth charts, view transits, and get astrological interpretations using Swiss Ephemeris" />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
  <div class="absolute inset-0 bg-black/20"></div>
  <div class="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <div class="flex items-center justify-center gap-2 mb-6">
        <Sparkles class="h-8 w-8 text-yellow-300" />
        <Badge variant="secondary" class="bg-white/20 text-white border-white/30">
          Sacred Cosmic Wisdom
        </Badge>
      </div>
      
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
        Start Your
        <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
          Cosmic Blueprint
        </span>
      </h1>
      
      <p class="text-xl sm:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
        Unlock the mysteries of your soul through precise birth charts, celestial transits, 
        and sacred interpretations that reveal your unique spiritual path.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg" class="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg">
          <Star class="mr-2 h-5 w-5" />
          Reveal Your Chart
        </Button>
        
      </div>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-16 sm:py-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
        Sacred Tools for Your Spiritual Journey
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        From birth chart revelations to daily cosmic guidance, 
        discover the tools that illuminate your path to spiritual awakening.
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each features as feature}
        <Card class="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between mb-4">
              <div class={cn("p-3 rounded-lg bg-gradient-to-br", feature.color)}>
                <svelte:component this={feature.icon} class="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" class="text-xs">
                {feature.badge}
              </Badge>
            </div>
            <CardTitle class="text-xl">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <CardDescription class="text-gray-600 leading-relaxed">
              {feature.description}
            </CardDescription>
            <Button variant="ghost" class="p-0 h-auto text-indigo-600 hover:text-indigo-700 group-hover:translate-x-1 transition-transform">
              Begin Journey →
            </Button>
          </CardContent>
        </Card>
      {/each}
    </div>
  </div>
</section>

<!-- About Section -->
<section class="py-16 sm:py-24 bg-gray-50">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
          Ancient Wisdom, 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Modern Revelation
          </span>
        </h2>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">
          This sacred application bridges the ancient wisdom of astrology with modern understanding, 
          offering you a gateway to cosmic knowledge. Through precise celestial calculations and 
          intuitive interpretations, discover the divine patterns that guide your soul's journey.
        </p>
        
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span class="text-gray-700">Sacred astronomical precision</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span class="text-gray-700">Intuitive cosmic guidance</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span class="text-gray-700">Deep spiritual insights</span>
          </div>
        </div>
      </div>
      
      <Card class="border-0 shadow-lg">
        <CardHeader>
          <CardTitle class="text-xl">Sacred Foundations</CardTitle>
          <CardDescription>
            Built upon ancient wisdom and cosmic understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each cosmicWisdom as wisdom}
              <div class="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-1">{wisdom.name}</h4>
                <p class="text-sm text-gray-600">{wisdom.description}</p>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
  <div class="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
      Ready to Begin Your Cosmic Journey?
    </h2>
    <p class="text-xl text-indigo-100 mb-8">
      Start with your birth chart and discover the celestial influences that shape your soul's purpose.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" class="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg">
        <Star class="mr-2 h-5 w-5" />
        Reveal Your Chart
      </Button>
      <Button size="lg" variant="outline" class="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
        <BookOpen class="mr-2 h-5 w-5" />
        Learn More
      </Button>
    </div>
  </div>
</section>

<!-- Current Time Display -->
<div class="py-8 text-center bg-gray-50 border-t">
  <div class="flex items-center justify-center gap-2 text-gray-600">
    <Calendar class="h-4 w-4" />
    <span class="font-medium">Current Time:</span>
    <span class="font-mono">{currentTime.toLocaleString()}</span>
  </div>
</div>

<style>
  /* Custom styles for better visual effects */
  .group:hover .group-hover\:translate-x-1 {
    transform: translateX(0.25rem);
  }
  
  /* Ensure proper cursor on interactive elements */
  button {
    cursor: pointer;
  }
  
  /* Smooth transitions */
  * {
    transition: all 0.2s ease-in-out;
  }
</style>
