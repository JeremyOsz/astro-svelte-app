<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import {
    PLANET_IN_SIGN_INTERPRETATIONS,
    SIGN_IN_HOUSE_INTERPRETATIONS,
    getDetailedAspectInterpretation,
    PLANET_INTERPRETATIONS,
    ASPECT_INTERPRETATIONS,
    HOUSES
  } from '../data/interpretations';

  export let open = false;
  export let elementData: any = null;

  type PlanetInterpretation = {
    title: string;
    type: string;
    typeColor: string;
    position: string;
    planetMeaning: string;
    planetInSign: string;
    signInHouse: string;
  };

  type AspectInterpretation = {
    title: string;
    type: string;
    orb: string;
    nature: string;
    general: string;
    specific: string;
  };

  type SignInterpretation = {
    title: string;
    houseGeneral: string;
    signInHouse: string;
  };

  type Interpretation = PlanetInterpretation | AspectInterpretation | SignInterpretation;

  function closeDialog() {
    open = false;
  }

  function getPlanetInterpretation(planetData: any): PlanetInterpretation {
    const { planet, sign, house, degree, minute, isRetrograde, isTransit } = planetData;
    const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

    return {
      title: `${planet} in ${sign} (House ${house})`,
      type: isTransit ? 'Transit Planet' : 'Natal Planet',
      typeColor: isTransit ? 'text-orange-600' : 'text-gray-800',
      position: `${degree}°${minute.toString().padStart(2, '0')}' ${sign}${isRetrograde ? ' (Retrograde)' : ''}`,
      planetMeaning,
      planetInSign,
      signInHouse
    };
  }

  function getAspectInterpretation(aspectData: any): AspectInterpretation {
    const { aspect, planet1, planet2, orb, isTransitAspect } = aspectData;
    const interpretation = getDetailedAspectInterpretation(aspect, planet1, planet2);
    const aspectDataInfo = (ASPECT_INTERPRETATIONS as any)[aspect];
    
    const interpretationParts = interpretation.split('\n\n');
    const generalInterpretation = interpretationParts[0] || '';
    const specificInterpretation = interpretationParts[1] || '';

    return {
      title: `${planet1} ${aspect} ${planet2}`,
      type: isTransitAspect ? 'Transit Aspect' : 'Natal Aspect',
      orb: orb !== undefined ? `${orb.toFixed(2)}°` : aspectDataInfo?.orb || 'Unknown',
      nature: aspectDataInfo?.nature || 'Unknown',
      general: generalInterpretation,
      specific: specificInterpretation
    };
  }

  function getSignInterpretation(signData: any): SignInterpretation {
    const { sign, house } = signData;
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const houseKey = `${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'}`;
    const houseGeneral = HOUSES[houseKey] || "House information not available.";
    
    return {
      title: `${sign} in House ${house}`,
      houseGeneral,
      signInHouse
    };
  }

  function isPlanetInterpretation(interpretation: Interpretation): interpretation is PlanetInterpretation {
    return 'planetMeaning' in interpretation;
  }

  function isAspectInterpretation(interpretation: Interpretation): interpretation is AspectInterpretation {
    return 'orb' in interpretation;
  }

  function isSignInterpretation(interpretation: Interpretation): interpretation is SignInterpretation {
    return 'houseGeneral' in interpretation;
  }

  $: interpretation = elementData ? 
    (elementData.aspect ? getAspectInterpretation(elementData) :
     elementData.planet ? getPlanetInterpretation(elementData) :
     elementData.sign ? getSignInterpretation(elementData) : null) : null;
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-3xl max-h-[90vh] overflow-y-auto">
    {#if elementData && interpretation}
      <Dialog.Header>
        <Dialog.Title>{interpretation.title}</Dialog.Title>
        <Dialog.Description>
          {#if isPlanetInterpretation(interpretation) || isAspectInterpretation(interpretation)}
            <span class="text-lg {isPlanetInterpretation(interpretation) ? interpretation.typeColor : 'text-gray-800'} font-medium">
              {interpretation.type}
            </span>
          {/if}
        </Dialog.Description>
      </Dialog.Header>

      <div class="space-y-6 my-6">
        {#if elementData.planet && isPlanetInterpretation(interpretation)}
          <!-- Planet Details -->
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Position</h3>
              <p class="text-gray-700">{interpretation.position}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">{elementData.planet} - Core Meaning</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.planetMeaning}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">{elementData.planet} in {elementData.sign}</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.planetInSign}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">{elementData.sign} in House {elementData.house}</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.signInHouse}</p>
            </div>
          </div>
        {:else if elementData.aspect && isAspectInterpretation(interpretation)}
          <!-- Aspect Details -->
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Orb</h4>
                  <p class="text-gray-700">{interpretation.orb}</p>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Nature</h4>
                  <p class="text-gray-700">{interpretation.nature}</p>
                </div>
              </div>
            </div>

            {#if interpretation.general}
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">General Interpretation</h3>
                <p class="text-gray-700 leading-relaxed">{interpretation.general}</p>
              </div>
            {/if}

            {#if interpretation.specific}
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Specific Meaning</h3>
                <p class="text-gray-700 leading-relaxed">{interpretation.specific}</p>
              </div>
            {/if}
          </div>
        {:else if elementData.sign && isSignInterpretation(interpretation)}
          <!-- Sign Details -->
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">House {elementData.house} represents</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.houseGeneral}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">{elementData.sign} in House {elementData.house}</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.signInHouse}</p>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root> 