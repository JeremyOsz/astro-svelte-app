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
      description: "Generate accurate natal charts with precise planetary positions, aspects, and house placements using Swiss Ephemeris calculations.",
      href: "/chart",
      color: "from-orange-500 to-red-500",
      badge: "Core Feature"
    },
    {
      icon: Moon,
      title: "Transits",
      description: "Calculate current planetary transits and their aspects to your natal chart for timing analysis and predictive work.",
      href: "/transits",
      color: "from-blue-500 to-purple-500",
      badge: "Live Data"
    },
    {
      icon: BookOpen,
      title: "Interpretations",
      description: "Reference guide for planetary meanings, sign characteristics, house significations, and aspect interpretations.",
      href: "/interpretations",
      color: "from-green-500 to-teal-500",
      badge: "Reference"
    },
    {
      icon: Calendar,
      title: "Daily Horoscope",
      description: "Daily transit analysis showing how current planetary movements affect your natal chart placements.",
      href: "/daily-horoscope",
      color: "from-pink-500 to-rose-500",
      badge: "Daily"
    },
    {
      icon: Search,
      title: "Chart Comparison",
      description: "Compare multiple birth charts to explore compatibility, synastry, and relationship dynamics between people.",
      href: "/interpretations",
      color: "from-purple-500 to-indigo-500",
      badge: "Relationships"
    },
    {
      icon: Zap,
      title: "Aspect Calculator",
      description: "Interactive tool to calculate and understand planetary aspects, their meanings, and how they influence chart interpretation.",
      href: "/interpretations",
      color: "from-yellow-500 to-orange-500",
      badge: "Learning"
    },
    {
      icon: Users,
      title: "Chart Library",
      description: "Save and organize multiple charts for family, friends, and clients with notes and personal observations.",
      href: "/chart",
      color: "from-emerald-500 to-green-500",
      badge: "Organization"
    },
    {
      icon: Star,
      title: "Learning Hub",
      description: "Educational content, tutorials, and guides to help you understand astrological concepts and chart reading techniques.",
      href: "/interpretations",
      color: "from-cyan-500 to-blue-500",
      badge: "Education"
    }
  ];

  const technicalFeatures = [
    { name: "Swiss Ephemeris", description: "High-precision astronomical calculations" },
    { name: "Multiple House Systems", description: "Whole sign and Placidus house calculations" },
    { name: "Chart Visualization", description: "Clean, readable natal and transit charts" },
    { name: "Aspect Analysis", description: "Major and minor aspect calculations" },
    { name: "Data Export", description: "Save and share chart configurations" },
    { name: "Responsive Design", description: "Works on desktop and mobile devices" },
    { name: "Chart Comparison", description: "Synastry and compatibility analysis" },
    { name: "Educational Content", description: "Learning resources and tutorials" },
    { name: "Personal Notes", description: "Add observations to saved charts" },
    { name: "Multiple Charts", description: "Organize charts for family and friends" }
  ];

  const learningFeatures = [
    {
      title: "Interactive Tutorials",
      description: "Step-by-step guides to reading birth charts, understanding aspects, and interpreting planetary placements."
    },
    {
      title: "Glossary & Definitions",
      description: "Comprehensive reference for astrological terms, symbols, and concepts with clear explanations."
    },
    {
      title: "Chart Reading Practice",
      description: "Practice interpreting sample charts with guided analysis and feedback on your observations."
    },
    {
      title: "Aspect Visualization",
      description: "Visual tools to understand how planetary aspects work and their effects on personality and life events."
    }
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
          Swiss Ephemeris Powered
        </Badge>
      </div>
      
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
        Explore Your
        <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
          Astrological Journey
        </span>
      </h1>
      
      <p class="text-xl sm:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
        Generate accurate birth charts, explore relationships, learn astrological concepts, and discover 
        tools to deepen your understanding of this ancient practice.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button href="/chart" size="lg" class="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg">
          <Star class="mr-2 h-5 w-5" />
          Calculate Birth Chart
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
        Tools for Your Astrological Exploration
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Accurate astrological calculations, relationship insights, and learning resources 
        to support your journey of discovery and understanding.
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each features as feature}
        <div 
          class="cursor-pointer"
          role="button"
          tabindex="0"
          on:click={() => window.location.href = feature.href}
          on:keydown={(e) => e.key === 'Enter' && (window.location.href = feature.href)}
        >
          <Card class="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
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
              <Button href={feature.href} variant="ghost" class="p-0 h-auto text-indigo-600 hover:text-indigo-700 group-hover:translate-x-1 transition-transform">
                Get Started →
              </Button>
            </CardContent>
          </Card>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Learning Section -->
<section class="py-16 sm:py-24 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
              <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
          Learn & Explore Together
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Educational tools and resources to help you understand astrological concepts 
          and grow your knowledge alongside others on this journey.
        </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {#each learningFeatures as feature}
        <Card class="border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle class="text-lg">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-gray-600 leading-relaxed">
              {feature.description}
            </CardDescription>
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
          Built for
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Curious Minds
          </span>
        </h2>
        <p class="text-lg text-gray-600 mb-8 leading-relaxed">
          This application provides accurate astrological tools using Swiss Ephemeris 
          for precise planetary positions and calculations. Whether you're just beginning 
          your astrological journey or have been exploring for years, these tools support 
          your learning and discovery.
        </p>
        
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span class="text-gray-700">Swiss Ephemeris precision</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span class="text-gray-700">Multiple house systems</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span class="text-gray-700">Comprehensive aspect calculations</span>
          </div>
        </div>
      </div>
      
              <Card class="border-0 shadow-lg">
          <CardHeader>
            <CardTitle class="text-xl">What's Included</CardTitle>
            <CardDescription>
              Tools and features to support your astrological exploration
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each technicalFeatures as feature}
              <div class="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-1">{feature.name}</h4>
                <p class="text-sm text-gray-600">{feature.description}</p>
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
      Ready to Begin Your Journey?
    </h2>
    <p class="text-xl text-indigo-100 mb-8">
      Start with your birth chart and discover the tools available for your astrological exploration.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Button href="/chart" size="lg" class="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg">
        <Star class="mr-2 h-5 w-5" />
        Calculate Birth Chart
      </Button>
      <Button href="/interpretations" size="lg" variant="outline" class="border-white/30 hover:bg-white/10 px-8 py-3 text-lg">
        <BookOpen class="mr-2 h-5 w-5" />
        View Interpretations
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
  
  /* Smooth transitions */
  * {
    transition: all 0.2s ease-in-out;
  }
</style>
