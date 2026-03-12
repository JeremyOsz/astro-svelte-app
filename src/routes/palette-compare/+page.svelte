<script lang="ts">
  type Palette = {
    name: string;
    mood: string;
    bg: string;
    surface: string;
    text: string;
    primary: string;
    accent: string;
  };

  const palettes: Palette[] = [
    {
      name: 'Warm Editorial',
      mood: 'Earthy, premium, calm',
      bg: '#F6F1E8',
      surface: '#EADFCF',
      text: '#2A2118',
      primary: '#B85C38',
      accent: '#D9A441'
    },
    {
      name: 'Coastal Clean',
      mood: 'Fresh, modern, light',
      bg: '#EAF4F4',
      surface: '#DCEFEF',
      text: '#163A3A',
      primary: '#2C7A7B',
      accent: '#7CC6C4'
    },
    {
      name: 'Forest Modern',
      mood: 'Natural, grounded, minimal',
      bg: '#EEF3ED',
      surface: '#DDE7DB',
      text: '#1F2A1F',
      primary: '#3F6B43',
      accent: '#A3BE6E'
    },
    {
      name: 'Bold Retro',
      mood: 'Expressive, vibrant, energetic',
      bg: '#FFF4E6',
      surface: '#FFE3C2',
      text: '#2B1D0E',
      primary: '#E76F51',
      accent: '#264653'
    },
    {
      name: 'Tech Neutral',
      mood: 'Professional, clear, scalable',
      bg: '#F5F7FA',
      surface: '#E8EDF3',
      text: '#1B2430',
      primary: '#3E6D9C',
      accent: '#7D8597'
    },
    {
      name: 'Night Luxe',
      mood: 'Sophisticated, cinematic, high contrast',
      bg: '#121417',
      surface: '#1D2228',
      text: '#F3F4F6',
      primary: '#C0843D',
      accent: '#4C8DAE'
    },
    {
      name: 'Moonlit Tide',
      mood: 'Mystical, cool, reflective',
      bg: '#E9EEF5',
      surface: '#D7E0EC',
      text: '#1B2838',
      primary: '#5A6FA8',
      accent: '#9AAFD6'
    },
    {
      name: 'Solar Oracle',
      mood: 'Radiant, ceremonial, warm',
      bg: '#FBF4E1',
      surface: '#F3E5BE',
      text: '#3A2B12',
      primary: '#D48A28',
      accent: '#8E4A2F'
    },
    {
      name: 'Eclipse Ritual',
      mood: 'Dark, dramatic, luxe',
      bg: '#0F1014',
      surface: '#1A1D24',
      text: '#ECEEF3',
      primary: '#BBA2FF',
      accent: '#6FA8C9'
    },
    {
      name: 'Celestial Dust',
      mood: 'Airy, ethereal, soft',
      bg: '#F2EFF7',
      surface: '#E5DFF0',
      text: '#2E2438',
      primary: '#8D6FB3',
      accent: '#C29AB6'
    },
    {
      name: 'Mars Meridian',
      mood: 'Bold, driven, intense',
      bg: '#F8ECEA',
      surface: '#F0D5D1',
      text: '#351A1D',
      primary: '#B54743',
      accent: '#6E2B2D'
    },
    {
      name: 'Venus Bloom',
      mood: 'Romantic, elegant, luminous',
      bg: '#FBF0F3',
      surface: '#F4DCE4',
      text: '#3D2230',
      primary: '#B35B7D',
      accent: '#D8A4B7'
    },
    {
      name: 'Saturn Stone',
      mood: 'Structured, mature, grounded',
      bg: '#ECEAE4',
      surface: '#DDD9CF',
      text: '#2A2925',
      primary: '#6D6758',
      accent: '#A79263'
    },
    {
      name: 'Neptune Dream',
      mood: 'Fluid, surreal, contemplative',
      bg: '#EAF3F7',
      surface: '#D6E8F0',
      text: '#163142',
      primary: '#2E6C91',
      accent: '#67A7B8'
    }
  ];

  const tokenKeys: Array<keyof Omit<Palette, 'name' | 'mood'>> = [
    'bg',
    'surface',
    'text',
    'primary',
    'accent'
  ];
</script>

<svelte:head>
  <title>Palette Comparison</title>
  <meta
    name="description"
    content="Compare color palette options with swatches and sample UI previews."
  />
</svelte:head>

<div class="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
  <main class="mx-auto max-w-7xl">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Palette Comparison</h1>
      <p class="mt-2 max-w-2xl text-slate-600">
        Side-by-side previews of all {palettes.length} options. Each card includes token values and a mini interface
        mockup.
      </p>
    </header>

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {#each palettes as palette}
        <article
          class="overflow-hidden rounded-2xl border border-slate-300 shadow-sm"
          style={`background:${palette.bg}; color:${palette.text};`}
        >
          <div class="p-5">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-xl font-semibold">{palette.name}</h2>
                <p class="mt-1 text-sm opacity-80">{palette.mood}</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-medium"
                style={`background:${palette.surface}; color:${palette.text};`}
              >
                Theme
              </span>
            </div>

            <div class="mb-5 grid grid-cols-5 gap-2">
              {#each tokenKeys as key}
                <div class="space-y-1">
                  <div
                    class="h-10 rounded-md border border-black/10"
                    style={`background:${palette[key]};`}
                    aria-label={`${palette.name} ${key} swatch`}
                  ></div>
                  <p class="text-[11px] uppercase tracking-wide opacity-80">{key}</p>
                </div>
              {/each}
            </div>

            <div
              class="rounded-xl border border-black/10 p-4"
              style={`background:${palette.surface};`}
            >
              <p class="text-sm font-medium">Sample Card Title</p>
              <p class="mt-1 text-xs leading-relaxed opacity-80">
                This block helps you compare readability, contrast, and button emphasis.
              </p>

              <div class="mt-4 flex gap-2">
                <button
                  class="rounded-lg px-3 py-2 text-xs font-semibold"
                  style={`background:${palette.primary}; color:${palette.bg};`}
                >
                  Primary Action
                </button>
                <button
                  class="rounded-lg border px-3 py-2 text-xs font-semibold"
                  style={`border-color:${palette.accent}; color:${palette.accent};`}
                >
                  Secondary
                </button>
              </div>
            </div>

            <dl class="mt-4 grid grid-cols-1 gap-y-1 text-xs">
              <div class="flex justify-between gap-4">
                <dt class="opacity-70">BG</dt>
                <dd class="font-mono">{palette.bg}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="opacity-70">Surface</dt>
                <dd class="font-mono">{palette.surface}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="opacity-70">Text</dt>
                <dd class="font-mono">{palette.text}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="opacity-70">Primary</dt>
                <dd class="font-mono">{palette.primary}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="opacity-70">Accent</dt>
                <dd class="font-mono">{palette.accent}</dd>
              </div>
            </dl>
          </div>
        </article>
      {/each}
    </section>
  </main>
</div>
