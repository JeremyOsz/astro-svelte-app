<script lang="ts">
  import { onMount } from 'svelte';
  import D3BiWheelChart from '$lib/chart/D3BiWheelChart.svelte';
  import { chartStore } from '$lib/stores/chart-store';

  // Sample natal (inner wheel) data – minimal demo set
  const natalData = `#HOUSES: 120,150,180,210,240,270,300,330,0,30,60,90
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

  // Sample transit (outer wheel) data
  const transitData = `Sun,Virgo,12°15'
Moon,Pisces,18°30'
Mercury,Libra,5°11'
Venus,Leo,20°25'
Mars,Leo,28°40'
Jupiter,Taurus,15°41'
Saturn,Pisces,3°05'
Uranus,Taurus,23°09'
Neptune,Pisces,26°50'
Pluto,Capricorn,27°58'
ASC,Virgo,15°00'
MC,Gemini,12°00'`;

  onMount(() => {
    // Load natal data into the shared chart store
    chartStore.setChartData(natalData);
  });
</script>

<section class="biwheel-demo">
  <h1 class="title">Bi-Wheel Chart Demo</h1>
  <D3BiWheelChart {transitData} />
</section>

<style>
  .biwheel-demo {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
</style> 