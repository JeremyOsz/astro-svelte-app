<script lang="ts">
  import {
    ASPECT_DEFINITIONS,
    CORE_ASPECT_BODIES,
    PLANET_CHARACTERISTICS,
    PLANET_SYMBOLS,
    SIGN_CHARACTERISTICS,
    ZODIAC_SIGNS,
    ZODIAC_SYMBOLS
  } from '$lib/data/astrological-data';
  import {
    PLANET_IN_SIGN_INTERPRETATIONS,
    SIGN_IN_HOUSE_INTERPRETATIONS
  } from '$lib/data/interpretations/index';

  export let chartData: string;

  interface Placement {
    planet: string;
    sign: string;
    degree: number;
    minute: number;
    longitude: number;
    house: number;
    retrograde: boolean;
  }

  interface Aspect {
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }

  const signNames = ZODIAC_SIGNS as readonly string[];

  $: placements = parsePlacements(chartData);
  $: primaryPlacements = placements.filter((placement) => !['DSC', 'IC'].includes(placement.planet));
  $: aspects = calculateAspects(placements).slice(0, 10);
  $: sun = placements.find((placement) => placement.planet === 'Sun');
  $: moon = placements.find((placement) => placement.planet === 'Moon');
  $: asc = placements.find((placement) => placement.planet === 'ASC');

  function parsePlacements(data: string): Placement[] {
    const parsed: Placement[] = [];

    data.split('\n').forEach((line) => {
      if (!line.trim() || line.startsWith('#')) return;

      const [rawPlanet, rawSign, rawDegree, ...extras] = line.split(',').map((part) => part.trim());
      const degreeMatch = rawDegree?.match(/^(\d+)°(\d+)'$/);
      if (!rawPlanet || !rawSign || !degreeMatch || !signNames.includes(rawSign)) return;

      const degree = Number.parseInt(degreeMatch[1], 10);
      const minute = Number.parseInt(degreeMatch[2], 10);
      const signIndex = signNames.indexOf(rawSign);
      const houseValue = extras.find((part) => /^\d+$/.test(part));

      parsed.push({
        planet: rawPlanet,
        sign: rawSign,
        degree,
        minute,
        longitude: signIndex * 30 + degree + minute / 60,
        house: houseValue ? Number.parseInt(houseValue, 10) : 0,
        retrograde: extras.includes('R')
      });
    });

    const ascendant = parsed.find((placement) => placement.planet === 'ASC');
    if (ascendant) {
      const ascSignIndex = signNames.indexOf(ascendant.sign);
      return parsed.map((placement) => {
        if (placement.house) return placement;
        const signIndex = signNames.indexOf(placement.sign);
        return {
          ...placement,
          house: ((signIndex - ascSignIndex + 12) % 12) + 1
        };
      });
    }

    return parsed;
  }

  function calculateAspects(data: Placement[]): Aspect[] {
    const aspects: Aspect[] = [];
    const corePlacements = data.filter((placement) => CORE_ASPECT_BODIES.includes(placement.planet));

    for (let i = 0; i < corePlacements.length; i += 1) {
      for (let j = i + 1; j < corePlacements.length; j += 1) {
        const p1 = corePlacements[i];
        const p2 = corePlacements[j];
        const angleDiff = Math.abs(p1.longitude - p2.longitude);
        const minAngle = Math.min(angleDiff, 360 - angleDiff);

        for (const [aspect, definition] of Object.entries(ASPECT_DEFINITIONS)) {
          const orb = Math.abs(minAngle - definition.angle);
          if (orb <= definition.orb) {
            aspects.push({
              planet1: p1.planet,
              planet2: p2.planet,
              aspect,
              orb: Number.parseFloat(orb.toFixed(2))
            });
          }
        }
      }
    }

    return aspects.sort((a, b) => a.orb - b.orb);
  }

  function positionText(placement: Placement) {
    return `${placement.degree}°${placement.minute.toString().padStart(2, '0')}' ${placement.sign}`;
  }

  function planetMeaning(placement: Placement) {
    const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[placement.planet]?.[placement.sign];
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[placement.sign]?.[placement.house];
    return planetInSign || signInHouse || PLANET_CHARACTERISTICS[placement.planet]?.description || '';
  }

  function keyPhrase(placement: Placement) {
    const planetThemes = PLANET_CHARACTERISTICS[placement.planet]?.themes ?? [];
    const signThemes = SIGN_CHARACTERISTICS[placement.sign]?.themes ?? [];
    return [...planetThemes, ...signThemes].slice(0, 3).join(' / ');
  }

  function markFragment(id: string) {
    if (typeof window === 'undefined') return;
    history.replaceState(null, '', `#${id}`);
  }
</script>

<section class="fragments" aria-label="Poetic chart fragments">
  <div class="triad" aria-label="Sun Moon Ascendant">
    <a
      href="#fragment-sun"
      on:mouseenter={() => sun && markFragment('fragment-sun')}
      on:focus={() => sun && markFragment('fragment-sun')}
      title="The visible self."
    >
      <span>sun</span>
      <strong>{sun ? `${ZODIAC_SYMBOLS[sun.sign]} ${sun.sign}` : 'not yet'}</strong>
    </a>
    <a
      href="#fragment-moon"
      on:mouseenter={() => moon && markFragment('fragment-moon')}
      on:focus={() => moon && markFragment('fragment-moon')}
      title="The weather inside."
    >
      <span>moon</span>
      <strong>{moon ? `${ZODIAC_SYMBOLS[moon.sign]} ${moon.sign}` : 'not yet'}</strong>
    </a>
    <a
      href="#fragment-asc"
      on:mouseenter={() => asc && markFragment('fragment-asc')}
      on:focus={() => asc && markFragment('fragment-asc')}
      title="The doorway."
    >
      <span>asc</span>
      <strong>{asc ? `${ZODIAC_SYMBOLS[asc.sign]} ${asc.sign}` : 'not yet'}</strong>
    </a>
  </div>

  <div class="fragment-grid">
    {#each primaryPlacements as placement, index}
      <article
        id={`fragment-${placement.planet.toLowerCase().replaceAll('.', '').replaceAll(' ', '-')}`}
        class="fragment"
        style={`--delay: ${Math.min(index * 70, 700)}ms`}
        title={`${placement.planet} at ${positionText(placement)}`}
        on:mouseenter={() =>
          markFragment(`fragment-${placement.planet.toLowerCase().replaceAll('.', '').replaceAll(' ', '-')}`)}
      >
        <div class="fragment-heading">
          <span class="glyph">{PLANET_SYMBOLS[placement.planet] || placement.planet}</span>
          <h2>{placement.planet}</h2>
          <small>{positionText(placement)} {placement.retrograde ? 'rx' : ''}</small>
        </div>

        <p class="line">
          {placement.planet.toLowerCase()} in {placement.sign.toLowerCase()}
          {#if placement.house}
            , house {placement.house}
          {/if}
        </p>

        {#if keyPhrase(placement)}
          <p class="keywords">{keyPhrase(placement)}</p>
        {/if}

        <details>
          <summary>read the fold</summary>
          <p>{planetMeaning(placement)}</p>
        </details>
      </article>
    {/each}
  </div>

  {#if aspects.length > 0}
    <section class="aspects" aria-label="Chart aspects">
      <p class="aspects-title">lines that keep repeating</p>
      {#each aspects as aspect}
        <details
          id={`aspect-${aspect.planet1}-${aspect.aspect}-${aspect.planet2}`.toLowerCase()}
          on:toggle={() => markFragment(`aspect-${aspect.planet1}-${aspect.aspect}-${aspect.planet2}`.toLowerCase())}
        >
          <summary>
            {aspect.planet1} {aspect.aspect.toLowerCase()} {aspect.planet2}
            <span>{aspect.orb.toFixed(2)}°</span>
          </summary>
          <p>
            A {aspect.aspect.toLowerCase()} is a held angle. Here, {aspect.planet1} and
            {aspect.planet2} keep time with each other.
          </p>
        </details>
      {/each}
    </section>
  {/if}
</section>

<style>
  .fragments {
    display: grid;
    gap: clamp(2rem, 6vw, 5rem);
  }

  .triad {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    border: 1px solid color-mix(in oklch, var(--foreground) 22%, transparent);
  }

  .triad a {
    display: grid;
    gap: 0.5rem;
    min-height: 8rem;
    background: color-mix(in oklch, var(--background) 92%, var(--foreground));
    padding: 1rem;
    color: var(--foreground);
    text-decoration: none;
  }

  .triad a:hover,
  .triad a:focus-visible {
    background: var(--foreground);
    color: var(--background);
    outline: 0;
  }

  .triad span {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
  }

  .triad strong {
    align-self: end;
    font-size: clamp(1.4rem, 4vw, 2.7rem);
    font-weight: 400;
  }

  .fragment-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: clamp(0.75rem, 2vw, 1.2rem);
  }

  .fragment {
    grid-column: span 4;
    min-height: 19rem;
    border-top: 1px solid color-mix(in oklch, var(--foreground) 35%, transparent);
    padding: 1rem 0.2rem;
    opacity: 0;
    transform: translateY(0.8rem);
    animation: arrive 800ms ease forwards;
    animation-delay: var(--delay);
  }

  .fragment:nth-child(3n + 2) {
    margin-top: 3rem;
  }

  .fragment:nth-child(4n) {
    grid-column: span 5;
  }

  .fragment:focus-visible {
    outline: 1px dotted var(--foreground);
    outline-offset: 0.4rem;
  }

  .fragment-heading {
    display: grid;
    gap: 0.35rem;
  }

  .glyph {
    font-family: 'Noto Sans Symbols', 'Apple Symbols', sans-serif;
    font-size: clamp(1.8rem, 5vw, 3.4rem);
    line-height: 1;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    font-weight: 400;
  }

  small,
  .keywords,
  summary {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  small,
  .keywords {
    color: color-mix(in oklch, var(--foreground) 58%, transparent);
  }

  .line {
    margin: 2rem 0 1rem;
    font-size: clamp(1.1rem, 2vw, 1.35rem);
    line-height: 1.45;
  }

  .keywords {
    font-size: 0.75rem;
    line-height: 1.7;
  }

  details {
    margin-top: 1.5rem;
  }

  summary {
    cursor: pointer;
    color: color-mix(in oklch, var(--foreground) 65%, transparent);
    font-size: 0.78rem;
  }

  details p {
    max-width: 34rem;
    color: color-mix(in oklch, var(--foreground) 78%, transparent);
    line-height: 1.8;
  }

  .aspects {
    display: grid;
    gap: 0.7rem;
    max-width: 52rem;
    margin-left: auto;
  }

  .aspects-title {
    margin: 0 0 0.7rem;
    color: color-mix(in oklch, var(--foreground) 55%, transparent);
    font-style: italic;
  }

  .aspects details {
    border-bottom: 1px dotted color-mix(in oklch, var(--foreground) 25%, transparent);
    padding: 0.7rem 0;
  }

  .aspects summary {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    color: var(--foreground);
  }

  .aspects span {
    color: color-mix(in oklch, var(--foreground) 54%, transparent);
  }

  @keyframes arrive {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 860px) {
    .fragment {
      grid-column: span 6;
    }

    .fragment:nth-child(4n) {
      grid-column: span 6;
    }
  }

  @media (max-width: 640px) {
    .triad {
      grid-template-columns: 1fr;
    }

    .triad a {
      min-height: 5.5rem;
    }

    .fragment,
    .fragment:nth-child(4n) {
      grid-column: 1 / -1;
      min-height: auto;
      margin-top: 0;
    }
  }
</style>
