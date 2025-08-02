<script lang="ts">
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import { chartStore } from '$lib/stores/chart-store';
  import D3BiWheelChart from '$lib/chart/D3BiWheelChart.svelte';
  import ChartInstructions from '$lib/components/ChartInstructions.svelte';
  import SynastryInterpretation from '$lib/components/SynastryInterpretation.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import * as Alert from '$lib/components/ui/alert';
  import { AlertCircle, User, Users, Calendar, MapPin, BookOpen } from 'lucide-svelte';
  import { searchCities, type CitySearchResult } from '$lib/services/city-service';
  import SavedChartsList from '$lib/components/SavedChartsList.svelte';

  // Core data
  let person1Data = '';
  let person2Data = '';
  let relationshipType: 'romance' | 'friendship' | 'family' | 'business' = 'romance';
  let relationshipTypes = [
    { value: 'romance', label: 'Romantic', icon: '💕' },
    { value: 'friendship', label: 'Friendship', icon: '🤝' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'business', label: 'Business', icon: '💼' }
  ];
  let isChartReady = false;
  let loading = false;
  let error: string | null = null;
  let formError = '';

  // Person 1 form data
  let person1Date = '';
  let person1Time = '';
  let person1CitySearch = '';
  let selectedPerson1CityData: any = null;
  let person1CityResults: CitySearchResult[] = [];
  let showPerson1CityDropdown = false;
  let person1SearchTimeout: ReturnType<typeof setTimeout> | null = null;
  let selectedPerson1Chart: any = null;
  let showPerson1SavedCharts = false;

  // Person 2 form data
  let person2Date = '';
  let person2Time = '';
  let person2CitySearch = '';
  let selectedPerson2CityData: any = null;
  let person2CityResults: CitySearchResult[] = [];
  let showPerson2CityDropdown = false;
  let person2SearchTimeout: ReturnType<typeof setTimeout> | null = null;
  let selectedPerson2Chart: any = null;
  let showPerson2SavedCharts = false;

  // Chart instructions
  let showInstructions = false;

  // Sample data for demonstration
  const samplePerson1 = `#HOUSES: 120,150,180,210,240,270,300,330,0,30,60,90
Sun,Leo,10°30',1
Moon,Cancer,5°12',12
Mercury,Virgo,23°45',2
Venus,Libra,15°20',3
Mars,Scorpio,2°05',4
Jupiter,Sagittarius,18°40',5
Saturn,Capricorn,8°11',6
Uranus,Aquarius,12°33',7
Neptune,Pisces,25°50',8
Pluto,Scorpio,28°10',4
ASC,Virgo,15°00'
MC,Gemini,12°00'`;

  const samplePerson2 = `#HOUSES: 90,120,150,180,210,240,270,300,330,0,30,60
Sun,Virgo,12°15',1
Moon,Pisces,18°30',12
Mercury,Libra,5°11',2
Venus,Leo,20°25',3
Mars,Leo,28°40',4
Jupiter,Taurus,15°41',5
Saturn,Pisces,3°05',6
Uranus,Taurus,23°09',7
Neptune,Pisces,26°50',8
Pluto,Capricorn,27°58',9
ASC,Virgo,15°00'
MC,Gemini,12°00'`;



  // Reactive synastry data
  let synastryAspects: any[] = [];
  let synastryHouseOverlays: any[] = [];
  let synastryPlanetInSigns: any[] = [];
  let debugInfo: any = null;
  let person1Chart: any = null;
  let person2Chart: any = null;
  let isSubmitting = false;

  // Categorize aspects into main, angular, and minor
  $: mainAspects = synastryAspects.filter(aspect => {
    const mainPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    return mainPlanets.includes(aspect.person1Planet) && mainPlanets.includes(aspect.person2Planet);
  });

  $: angularAspects = synastryAspects.filter(aspect => {
    const angularPoints = ['Asc', 'MC', 'Part of Fortune'];
    return angularPoints.includes(aspect.person1Planet) || angularPoints.includes(aspect.person2Planet);
  });

  $: minorAspects = synastryAspects.filter(aspect => {
    const minorPoints = ['Chiron', 'Lilith', 'Node', 'Vertex', 'Fortune'];
    return minorPoints.includes(aspect.person1Planet) || minorPoints.includes(aspect.person2Planet);
  });

  function convertChartToCSV(chart: any): string {
    if (!chart || !chart.planets) return '';
    
    const lines: string[] = [];
    
    // Add houses line if available
    if (chart.houses && chart.houses.length > 0) {
      const houseAngles = chart.houses.map((house: any, index: number) => {
        return house.longitude || (index * 30);
      }).join(',');
      lines.push(`#HOUSES: ${houseAngles}`);
    }
    
    // Add planets
    chart.planets.forEach((planet: any) => {
      const sign = planet.sign || 'Unknown';
      const degree = Math.floor(planet.degree || 0);
      const minute = Math.floor(((planet.degree || 0) % 1) * 60);
      const house = planet.house || 1;
      lines.push(`${planet.name},${sign},${degree}°${minute}',${house}`);
    });
    
    // Add angles if available
    if (chart.ascendant !== undefined) {
      const ascDegree = Math.floor(chart.ascendant);
      const ascMinute = Math.floor(((chart.ascendant % 1) * 60));
      const ascSign = getSignFromLongitude(chart.ascendant);
      lines.push(`ASC,${ascSign},${ascDegree}°${ascMinute}'`);
    }
    
    if (chart.mc !== undefined) {
      const mcDegree = Math.floor(chart.mc);
      const mcMinute = Math.floor(((chart.mc % 1) * 60));
      const mcSign = getSignFromLongitude(chart.mc);
      lines.push(`MC,${mcSign},${mcDegree}°${mcMinute}'`);
    }
    
    return lines.join('\n');
  }

  function getSignFromLongitude(longitude: number): string {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex % 12];
  }

  function runTest() {
    console.log('Test function removed - now using ephemeris API for synastry calculations');
  }

  onMount(async () => {
    // Set default locations
    person1CitySearch = 'London, United Kingdom';
    selectedPerson1CityData = {
      name: 'London',
      fullLocation: 'London, United Kingdom',
      lat: 51.5074,
      lng: -0.1278,
      country: 'United Kingdom',
      adminName: 'England'
    };

    person2CitySearch = 'New York, United States';
    selectedPerson2CityData = {
      name: 'New York',
      fullLocation: 'New York, United States',
      lat: 40.7128,
      lng: -74.0060,
      country: 'United States',
      adminName: 'New York'
    };
  });

  function onPerson1CityInput(e: Event) {
    person1CitySearch = (e.target as HTMLInputElement).value;
    
    if (person1SearchTimeout) {
      clearTimeout(person1SearchTimeout);
    }
    
    if (person1CitySearch.length > 1) {
      person1SearchTimeout = setTimeout(() => {
        person1CityResults = searchCities(person1CitySearch, 8);
        showPerson1CityDropdown = person1CityResults.length > 0;
      }, 300);
    } else {
      person1CityResults = [];
      showPerson1CityDropdown = false;
    }
  }

  function onPerson2CityInput(e: Event) {
    person2CitySearch = (e.target as HTMLInputElement).value;
    
    if (person2SearchTimeout) {
      clearTimeout(person2SearchTimeout);
    }
    
    if (person2CitySearch.length > 1) {
      person2SearchTimeout = setTimeout(() => {
        person2CityResults = searchCities(person2CitySearch, 8);
        showPerson2CityDropdown = person2CityResults.length > 0;
      }, 300);
    } else {
      person2CityResults = [];
      showPerson2CityDropdown = false;
    }
  }

  function selectPerson1City(city: CitySearchResult) {
    person1CitySearch = city.fullLocation;
    showPerson1CityDropdown = false;
    selectedPerson1CityData = {
      name: city.name,
      fullLocation: city.fullLocation,
      lat: city.lat,
      lng: city.lng,
      country: city.country,
      adminName: city.adminName
    };
  }

  function selectPerson2City(city: CitySearchResult) {
    person2CitySearch = city.fullLocation;
    showPerson2CityDropdown = false;
    selectedPerson2CityData = {
      name: city.name,
      fullLocation: city.fullLocation,
      lat: city.lat,
      lng: city.lng,
      country: city.country,
      adminName: city.adminName
    };
  }

  function handlePerson1ChartSelect(chart: any) {
    console.log('Person 1 chart selected:', chart);
    console.log('Chart data:', chart.chartData);
    console.log('Birth data:', chart.birthData);
    selectedPerson1Chart = chart;
    person1Data = chart.chartData;
    
    // Fill in the form fields with the saved chart's birth data
    person1Date = chart.birthData.date;
    person1Time = chart.birthData.time;
    person1CitySearch = chart.birthData.place;
    selectedPerson1CityData = {
      name: chart.birthData.place.split(',')[0].trim(),
      fullLocation: chart.birthData.place,
      lat: chart.birthData.latitude,
      lng: chart.birthData.longitude,
      country: chart.birthData.place.split(',').pop()?.trim() || '',
      adminName: ''
    };
    
    showPerson1SavedCharts = false;
  }

  function handlePerson2ChartSelect(chart: any) {
    console.log('Person 2 chart selected:', chart);
    console.log('Chart data:', chart.chartData);
    console.log('Birth data:', chart.birthData);
    selectedPerson2Chart = chart;
    person2Data = chart.chartData;
    
    // Fill in the form fields with the saved chart's birth data
    person2Date = chart.birthData.date;
    person2Time = chart.birthData.time;
    person2CitySearch = chart.birthData.place;
    selectedPerson2CityData = {
      name: chart.birthData.place.split(',')[0].trim(),
      fullLocation: chart.birthData.place,
      lat: chart.birthData.latitude,
      lng: chart.birthData.longitude,
      country: chart.birthData.place.split(',').pop()?.trim() || '',
      adminName: ''
    };
    
    showPerson2SavedCharts = false;
  }

  function clearPerson1Selection() {
    selectedPerson1Chart = null;
    person1Data = '';
  }

  function clearPerson2Selection() {
    selectedPerson2Chart = null;
    person2Data = '';
  }

  function loadSampleData() {
    // Set sample birth data instead of chart data
    person1Date = '1990-01-01';
    person1Time = '10:00';
    person1CitySearch = 'London, United Kingdom';
    selectedPerson1CityData = {
      name: 'London',
      fullLocation: 'London, United Kingdom',
      lat: 51.5074,
      lng: -0.1278,
      country: 'United Kingdom',
      adminName: 'England'
    };

    person2Date = '1992-06-15';
    person2Time = '14:30';
    person2CitySearch = 'New York, United States';
    selectedPerson2CityData = {
      name: 'New York',
      fullLocation: 'New York, United States',
      lat: 40.7128,
      lng: -74.0060,
      country: 'United States',
      adminName: 'New York'
    };
  }

  function validateForm() {
    // Check if Person 1 has either manual data or a saved chart
    const person1Valid = (person1Date && person1Time && selectedPerson1CityData) || selectedPerson1Chart;
    if (!person1Valid) {
      formError = 'Please complete Person 1\'s birth information or select a saved chart';
      return false;
    }
    
    // Check if Person 2 has either manual data or a saved chart
    const person2Valid = (person2Date && person2Time && selectedPerson2CityData) || selectedPerson2Chart;
    if (!person2Valid) {
      formError = 'Please complete Person 2\'s birth information or select a saved chart';
      return false;
    }
    
    formError = '';
    return true;
  }

  function clearCharts() {
    person1Data = '';
    person2Data = '';
    isChartReady = false;
    chartStore.setChartData('');
    error = null;
    formError = '';
  }
</script>

<svelte:head>
  <title>Synastry Chart - Astro Chart</title>
  <meta name="description" content="Compare two birth charts to explore relationship compatibility and synastry aspects" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <!-- Page Header -->
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Synastry Chart</h1>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
      Explore the cosmic dance between two souls. Compare birth charts to discover relationship dynamics, 
      compatibility, and the unique aspects that bind you together.
    </p>
  </div>

  <!-- Chart Instructions -->
  <ChartInstructions bind:showInstructions />

  <!-- Error Messages -->
  {#if error}
    <Alert.Root class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <Alert.Title>Error</Alert.Title>
      <Alert.Description>{error}</Alert.Description>
    </Alert.Root>
  {/if}

  {#if formError}
    <Alert.Root class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <Alert.Title>Please fix the following:</Alert.Title>
      <Alert.Description>{formError}</Alert.Description>
    </Alert.Root>
  {/if}

  <!-- Synastry Form -->
  <div class="mb-8">
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex items-center gap-2">
          <Users class="h-5 w-5" />
          Birth Information
        </Card.Title>
        <Card.Description>
          Enter birth details for both people to generate a synastry chart
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <form 
          method="POST" 
          action="?/calculate"
          enctype="application/x-www-form-urlencoded"
          on:submit={(e) => {
            if (!validateForm()) {
              e.preventDefault();
              return false;
            }
          }}
          use:enhance={() => {
            return async ({ result, update }) => {
              isSubmitting = true;
              
              try {
                if (result.type === 'success') {
                  // Form submitted successfully
                                     if (result.data?.synastryData) {
                     const synastryData = result.data.synastryData as any;
                     
                     person1Chart = synastryData.person1_chart;
                     person2Chart = synastryData.person2_chart;
                     synastryAspects = synastryData.aspects || [];
                     synastryHouseOverlays = synastryData.house_overlays || [];
                     synastryPlanetInSigns = synastryData.composite_points || [];
                     
                     // Convert chart data to CSV format for the D3 chart
                     person1Data = synastryData.person1_chart_data;
                     person2Data = synastryData.person2_chart_data;
                    
                    // Load person 1 data into the chart store (inner wheel)
                    chartStore.setChartData(person1Data);
                    
                    isChartReady = true;
                    error = null;
                    formError = '';
                    
                    debugInfo = {
                      p1Planets: person1Chart.planets?.length || 0,
                      p2Planets: person2Chart.planets?.length || 0,
                      aspectsFound: synastryAspects.length,
                      houseOverlaysFound: synastryHouseOverlays.length,
                      planetInSignsFound: synastryPlanetInSigns.length
                    };
                  }
                  
                  // Update the page
                  await update();
                } else if (result.type === 'failure') {
                  // Form submission failed
                  if (result.data?.error) {
                    error = String(result.data.error);
                  }
                  
                  // Update the page
                  await update();
                }
              } finally {
                isSubmitting = false;
              }
            };
          }}
          class="space-y-6"
        >
         <!-- Relationship Type Selection -->
         <div class="space-y-3">
           <Label for="relationship-type">Relationship Type</Label>
           <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
             {#each relationshipTypes as type}
               <button
                 type="button"
                 class="flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors {relationshipType === type.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}"
                 on:click={() => relationshipType = type.value as 'romance' | 'friendship' | 'family' | 'business'}
               >
                 <span class="text-2xl">{type.icon}</span>
                 <span class="text-sm font-medium">{type.label}</span>
               </button>
             {/each}
           </div>
         </div>
                 <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <!-- Person 1 -->
           <div class="space-y-4">
             <h3 class="text-lg font-semibold flex items-center gap-2">
               <User class="h-4 w-4" />
               Person 1 (Inner Wheel)
             </h3>
             
             <!-- Saved Chart Selection -->
             <div class="space-y-3">
               <div class="flex items-center gap-2">
                 <button
                   type="button"
                   class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                   on:click={() => showPerson1SavedCharts = !showPerson1SavedCharts}
                 >
                   <BookOpen class="h-4 w-4" />
                   {selectedPerson1Chart ? selectedPerson1Chart.name : 'Select from saved charts'}
                 </button>
                 {#if selectedPerson1Chart}
                   <button
                     type="button"
                     class="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                     on:click={clearPerson1Selection}
                   >
                     Clear
                   </button>
                 {/if}
               </div>
               
               {#if showPerson1SavedCharts}
                 <div class="border border-gray-200 rounded-md p-3 bg-gray-50">
                   <SavedChartsList onChartSelect={(chart) => {
                     console.log('Person 1 chart selected from component:', chart);
                     handlePerson1ChartSelect(chart);
                   }} />
                 </div>
               {/if}
             </div>
             
             <!-- Manual Entry -->
             <div class="space-y-3">
               <h4 class="text-sm font-medium text-gray-700">Or enter manually:</h4>
               

               
               <div>
                 <Label for="person1-date">Birth Date</Label>
                 <Input
                   id="person1-date"
                   name="person1Date"
                   type="date"
                   bind:value={person1Date}
                   required
                   class="w-full"
                 />
               </div>
               
               <div>
                 <Label for="person1-time">Birth Time</Label>
                 <Input
                   id="person1-time"
                   name="person1Time"
                   type="time"
                   bind:value={person1Time}
                   required
                   class="w-full"
                 />
               </div>
               
               <div class="relative">
                 <Label for="person1-city">Birth Location</Label>
                 <input
                   id="person1-city"
                   type="text"
                   bind:value={person1CitySearch}
                   on:input={onPerson1CityInput}
                   placeholder="Search for a city..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
                 {#if showPerson1CityDropdown}
                   <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                     {#each person1CityResults as city, index}
                       <button
                         type="button"
                         class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                         on:click={() => selectPerson1City(city)}
                       >
                         {city.fullLocation}
                       </button>
                     {/each}
                   </div>
                 {/if}
               </div>
               
               <!-- Hidden inputs for form data -->
               <input type="hidden" name="person1CityData" value={selectedPerson1CityData ? JSON.stringify(selectedPerson1CityData) : ''} />
               <input type="hidden" name="person1ChartData" value={selectedPerson1Chart ? JSON.stringify(selectedPerson1Chart) : ''} />
             </div>
           </div>

                     <!-- Person 2 -->
           <div class="space-y-4">
             <h3 class="text-lg font-semibold flex items-center gap-2">
               <User class="h-4 w-4" />
               Person 2 (Outer Wheel)
             </h3>
             
             <!-- Saved Chart Selection -->
             <div class="space-y-3">
               <div class="flex items-center gap-2">
                 <button
                   type="button"
                   class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                   on:click={() => showPerson2SavedCharts = !showPerson2SavedCharts}
                 >
                   <BookOpen class="h-4 w-4" />
                   {selectedPerson2Chart ? selectedPerson2Chart.name : 'Select from saved charts'}
                 </button>
                 {#if selectedPerson2Chart}
                   <button
                     type="button"
                     class="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                     on:click={clearPerson2Selection}
                   >
                     Clear
                   </button>
                 {/if}
               </div>
               
               {#if showPerson2SavedCharts}
                 <div class="border border-gray-200 rounded-md p-3 bg-gray-50">
                   <SavedChartsList onChartSelect={(chart) => {
                     console.log('Person 2 chart selected from component:', chart);
                     handlePerson2ChartSelect(chart);
                   }} />
                 </div>
               {/if}
             </div>
             
             <!-- Manual Entry -->
             <div class="space-y-3">
               <h4 class="text-sm font-medium text-gray-700">Or enter manually:</h4>
               

               
               <div>
                 <Label for="person2-date">Birth Date</Label>
                 <Input
                   id="person2-date"
                   name="person2Date"
                   type="date"
                   bind:value={person2Date}
                   required
                   class="w-full"
                 />
               </div>
               
               <div>
                 <Label for="person2-time">Birth Time</Label>
                 <Input
                   id="person2-time"
                   name="person2Time"
                   type="time"
                   bind:value={person2Time}
                   required
                   class="w-full"
                 />
               </div>
               
               <div class="relative">
                 <Label for="person2-city">Birth Location</Label>
                 <input
                   id="person2-city"
                   type="text"
                   bind:value={person2CitySearch}
                   on:input={onPerson2CityInput}
                   placeholder="Search for a city..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
                 {#if showPerson2CityDropdown}
                   <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                     {#each person2CityResults as city, index}
                       <button
                         type="button"
                         class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                         on:click={() => selectPerson2City(city)}
                       >
                         {city.fullLocation}
                       </button>
                     {/each}
                   </div>
                 {/if}
               </div>
               
               <!-- Hidden inputs for form data -->
               <input type="hidden" name="person2CityData" value={selectedPerson2CityData ? JSON.stringify(selectedPerson2CityData) : ''} />
               <input type="hidden" name="person2ChartData" value={selectedPerson2Chart ? JSON.stringify(selectedPerson2Chart) : ''} />
             </div>
           </div>
        </div>

        <!-- Hidden inputs for form settings -->
        <input type="hidden" name="relationshipType" value={relationshipType} />
        <input type="hidden" name="houseSystem" value="whole_sign" />

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 pt-4 border-t">
                     <button
             type="submit"
             class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
             disabled={isSubmitting}
           >
             {isSubmitting ? 'Calculating...' : 'Generate Synastry Chart'}
           </button>
          
          <button
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            on:click={loadSampleData}
          >
            Load Sample Data
          </button>
          
          <button
            class="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            on:click={clearCharts}
          >
            Clear Charts
          </button>
          
          <button
            type="button"
            class="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            on:click={runTest}
          >
            Run Test
          </button>
        </div>
        </form>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Chart Display -->
  {#if isChartReady}
    <Card.Root class="mb-8">
      <Card.Header>
        <Card.Title>Synastry Chart</Card.Title>
        <Card.Description>
          The inner wheel shows Person 1's chart, while the outer wheel shows Person 2's chart. 
          Hover over elements to see details and click for more information.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="flex justify-center">
          <D3BiWheelChart transitData={person2Data} isSynastryMode={true} />
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Educational Synastry Examples -->
    <Card.Root class="mb-8">
      <Card.Header>
        <Card.Title>Synastry Analysis</Card.Title>
        <Card.Description>
          Detailed interpretation of your relationship compatibility and dynamics
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <SynastryInterpretation 
          aspects={synastryAspects}
          mainAspects={mainAspects}
          angularAspects={angularAspects}
          minorAspects={minorAspects}
          houseOverlays={synastryHouseOverlays}
          planetInSigns={synastryPlanetInSigns}
          relationshipType={relationshipType}
        />
      </Card.Content>
    </Card.Root>

    <!-- Synastry Information -->
    <Card.Root>
      <Card.Header>
        <Card.Title>Understanding Synastry</Card.Title>
        <Card.Description>
          Learn how to interpret the relationship dynamics shown in your synastry chart
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <!-- Debug Information -->
        {#if debugInfo && import.meta.env.DEV}
          <div class="mb-6 p-4 bg-gray-100 rounded-lg">
            <h4 class="font-semibold mb-2">Debug Info:</h4>
            <pre class="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        {/if}
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold mb-3">Inner Wheel (Person 1)</h3>
            <ul class="space-y-2 text-sm">
              <li>• Shows the foundation and core personality</li>
              <li>• Represents the "base" chart for comparison</li>
              <li>• Houses indicate areas of life affected by the relationship</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-3">Outer Wheel (Person 2)</h3>
            <ul class="space-y-2 text-sm">
              <li>• Shows how Person 2's energy interacts with Person 1</li>
              <li>• Planets in Person 1's houses reveal relationship themes</li>
              <li>• Aspects between wheels show compatibility and challenges</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t">
          <h3 class="font-semibold mb-3">Understanding Your Synastry Chart</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-medium mb-2">Sun-Moon Aspects</h4>
              <p>Core emotional compatibility and how you nurture each other. Look for these in your chart above.</p>
            </div>
            <div>
              <h4 class="font-medium mb-2">Venus-Mars Aspects</h4>
              <p>Romantic attraction and sexual chemistry. These aspects show your romantic dynamics.</p>
            </div>
            <div>
              <h4 class="font-medium mb-2">Saturn Aspects</h4>
              <p>Commitment, responsibility, and long-term potential. These indicate relationship stability.</p>
            </div>
          </div>
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Note:</strong> The aspects shown in your chart above are the actual calculated aspects between your two birth charts. 
              The examples below are for educational purposes to help you understand what to look for.
            </p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {:else}
    <Card.Root>
      <Card.Content>
        <div class="flex items-center justify-center h-96 text-muted-foreground">
          <div class="text-center">
            <p class="text-lg mb-4">Enter birth information for both people to generate the synastry chart</p>
            <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" on:click={loadSampleData}>
              Load Sample Data
            </button>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {/if}
</div>

<style>
  .container {
    min-height: calc(100vh - 200px);
  }

  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style> 