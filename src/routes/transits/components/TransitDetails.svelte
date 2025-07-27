<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import TransitDisplay from '../TransitDisplay.svelte';

  export let natalChart: any;
  export let currentTransits: any;
</script>

<Card.Root class="mt-6">
  <Card.Header>
    <Card.Title>Transit Details</Card.Title>
    <Card.Description>
      Detailed analysis of transit aspects and house positions
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <TransitDisplay {natalChart} {currentTransits} />
  </Card.Content>
</Card.Root> 