<script lang="ts">
    import { Button } from '../ui/button';


  import ChartElementDialog from './ChartElementDialog.svelte';

  let dialogOpen = false;
  let currentElementData: any = null;

  // Example data for different chart types
  const exampleData = {
    natal: {
      planet: "Sun",
      sign: "Leo",
      house: 5,
      degree: 15,
      minute: 30,
      isRetrograde: false
    },
    transit: {
      planet: "Mars",
      sign: "Aries",
      house: 1,
      degree: 5,
      minute: 15,
      isTransit: true
    },
    synastry: {
      aspect: "conjunction",
      planet1: "Sun",
      planet2: "Venus",
      orb: 2.5,
      isSynastry: true
    },
    composite: {
      planet: "Moon",
      sign: "Cancer",
      house: 4,
      degree: 22,
      minute: 45,
      isComposite: true
    },
    solarReturn: {
      planet: "Jupiter",
      sign: "Sagittarius",
      house: 9,
      degree: 8,
      minute: 12,
      isSolarReturn: true
    },
    lunarReturn: {
      planet: "Mercury",
      sign: "Gemini",
      house: 3,
      degree: 18,
      minute: 33,
      isLunarReturn: true
    },
    progressed: {
      planet: "Saturn",
      sign: "Capricorn",
      house: 10,
      degree: 12,
      minute: 7,
      isProgressed: true
    },
    aspect: {
      aspect: "opposition",
      planet1: "Mars",
      planet2: "Saturn",
      orb: 1.8,
      isTransitAspect: true
    },
    sign: {
      sign: "Taurus",
      house: 2
    },
    angularHouse: {
      planet: "ASC",
      sign: "Libra",
      degree: 15,
      minute: 30
    }
  };

  function openDialog(data: any, chartType: string) {
    currentElementData = { ...data, chartType };
    dialogOpen = true;
  }
</script>

<div class="p-6 space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">ChartElementDialog Examples</h2>
    <p class="text-gray-600">Click any button to see the dialog with different chart types and data</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Natal Chart -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Natal Chart</h3>
      <p class="text-sm text-gray-600 mb-3">Sun in Leo, House 5</p>
      <button 
        class="w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
        on:click={() => openDialog(exampleData.natal, 'natal')}
      >
        View Natal Planet
      </button>
    </div>

    <!-- Transit Chart -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Transit Chart</h3>
      <p class="text-sm text-gray-600 mb-3">Mars in Aries, House 1</p>
      <button 
        class="w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
        on:click={() => openDialog(exampleData.transit, 'transit')}
      >
        View Transit Planet
      </button>
    </div>

    <!-- Synastry Chart -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Synastry Chart</h3>
      <p class="text-sm text-gray-600 mb-3">Sun conjunct Venus</p>
      <button 
        class="w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
        on:click={() => openDialog(exampleData.synastry, 'synastry')}
      >
        View Synastry Aspect
      </button>
    </div>

    <!-- Composite Chart -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Composite Chart</h3>
      <p class="text-sm text-gray-600 mb-3">Moon in Cancer, House 4</p>
      <button 
        class="w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
        on:click={() => openDialog(exampleData.composite, 'composite')}
      >
        View Composite Planet
      </button>
    </div>

    <!-- Solar Return Chart -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Solar Return Chart</h3>
      <p class="text-sm text-gray-600 mb-3">Jupiter in Sagittarius, House 9</p>
      <button 
        class="w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
        on:click={() => openDialog(exampleData.solarReturn, 'solar-return')}
      >
        View Solar Return Planet
      </button>
    </div>

    <!-- Lunar Return Chart -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Lunar Return Chart</h3>
      <p class="text-sm text-gray-600 mb-3">Mercury in Gemini, House 3</p>
      <button 
        class="w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
        on:click={() => openDialog(exampleData.lunarReturn, 'lunar-return')}
      >
        View Lunar Return Planet
      </button>
    </div>

    <!-- Progressed Chart -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Progressed Chart</h3>
      <p class="text-sm text-gray-600 mb-3">Saturn in Capricorn, House 10</p>
      <Button 
        variant="outline" 
        size="sm" 
        onclick={() => openDialog(exampleData.progressed, 'progressed')}
        class="w-full"
      >
        View Progressed Planet
      </Button>
    </div>

    <!-- Transit Aspect -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Transit Aspect</h3>
      <p class="text-sm text-gray-600 mb-3">Mars opposite Saturn</p>
      <Button 
        variant="outline" 
        size="sm" 
        onclick={() => openDialog(exampleData.aspect, 'transit')}
        class="w-full"
      >
        View Transit Aspect
      </Button>
    </div>

    <!-- Sign in House -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Sign in House</h3>
      <p class="text-sm text-gray-600 mb-3">Taurus in House 2</p>
      <Button 
        variant="outline" 
        size="sm" 
        onclick={() => openDialog(exampleData.sign, 'natal')}
        class="w-full"
      >
        View Sign in House
      </Button>
    </div>

    <!-- Angular House -->
    <div class="border rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">Angular House</h3>
      <p class="text-sm text-gray-600 mb-3">Ascendant in Libra</p>
      <Button 
        variant="outline" 
        size="sm" 
        onclick={() => openDialog(exampleData.angularHouse, 'natal')}
        class="w-full"
      >
        View Angular House
      </Button>
    </div>
  </div>

  <!-- Chart Element Dialog -->
  <ChartElementDialog 
    bind:open={dialogOpen} 
    elementData={currentElementData} 
    chartType={currentElementData?.chartType || 'natal'} 
  />
</div> 