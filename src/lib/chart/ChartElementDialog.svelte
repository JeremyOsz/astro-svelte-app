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
    planetSymbol: string;
    planetColor: string;
    isRetrograde: boolean;
    zodiacSymbol: string;
  };

  type AspectInterpretation = {
    title: string;
    type: string;
    orb: string;
    nature: string;
    general: string;
    specific: string;
    planet1Symbol: string;
    planet2Symbol: string;
    planet1Color: string;
    planet2Color: string;
    isTransitAspect: boolean;
    aspectSymbol: string;
    aspectColor: string;
  };

  type SignInterpretation = {
    title: string;
    houseGeneral: string;
    signInHouse: string;
    zodiacSymbol: string;
  };

  type AngularHouseInterpretation = {
    title: string;
    meaning: string;
    description: string;
    symbol: string;
    sign: string;
    zodiacSymbol: string;
    degree: number;
    minute: number;
  };

  type Interpretation = PlanetInterpretation | AspectInterpretation | SignInterpretation | AngularHouseInterpretation;

  function closeDialog() {
    open = false;
  }

  function getPlanetInterpretation(planetData: any): PlanetInterpretation {
    const { planet, sign, house, degree, minute, isRetrograde, isTransit } = planetData;
    const planetInSign = (PLANET_IN_SIGN_INTERPRETATIONS as any)[planet]?.[sign] || "No interpretation available.";
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const planetMeaning = (PLANET_INTERPRETATIONS as any)[planet]?.description || "";

    // Planet symbols for display
    const planetSymbols: Record<string, string> = {
      "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃",
      "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇", "Node": "☊",
      "Lilith": "⚸", "Chiron": "⚷", "Fortune": "⊗", "Vertex": "Vx"
    };

    // Zodiac symbols
    const zodiacSymbols: Record<string, string> = {
      "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
      "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
    };

    // Transit planet colors
    const transitColors: Record<string, string> = {
      'Sun': '#ff6b35',
      'Moon': '#4a90e2', 
      'Mercury': '#8bc34a',
      'Venus': '#ffc107',
      'Mars': '#f44336',
      'Jupiter': '#9c27b0',
      'Saturn': '#607d8b',
      'Uranus': '#00bcd4',
      'Neptune': '#3f51b5',
      'Pluto': '#795548',
      'Node': '#ff9800',
      'Chiron': '#e91e63',
      'Lilith': '#9e9e9e',
      'Fortune': '#4caf50',
      'Vertex': '#673ab7'
    };

    const planetSymbol = planetSymbols[planet] || planet;
    const zodiacSymbol = zodiacSymbols[sign] || sign;
    const planetColor = isTransit ? (transitColors[planet] || '#ff9500') : '#333';
    const retrogradeText = isRetrograde ? ' (Retrograde)' : '';

    return {
      title: `${planetSymbol} ${planet} in ${zodiacSymbol} ${sign} (House ${house})`,
      type: isTransit ? 'Transit Planet' : 'Natal Planet',
      typeColor: isTransit ? 'text-orange-600' : 'text-gray-800',
      position: `${degree}°${minute.toString().padStart(2, '0')}' ${zodiacSymbol} ${sign}${retrogradeText}`,
      planetMeaning,
      planetInSign,
      signInHouse,
      planetSymbol,
      planetColor,
      isRetrograde,
      zodiacSymbol
    };
  }

  function getAspectInterpretation(aspectData: any): AspectInterpretation {
    const { aspect, planet1, planet2, orb, isTransitAspect } = aspectData;
    const interpretation = getDetailedAspectInterpretation(aspect, planet1, planet2);
    const aspectDataInfo = (ASPECT_INTERPRETATIONS as any)[aspect];
    
    const interpretationParts = interpretation.split('\n\n');
    const generalInterpretation = interpretationParts[0] || '';
    const specificInterpretation = interpretationParts[1] || '';

    // Planet symbols for display
    const planetSymbols: Record<string, string> = {
      "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃",
      "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇", "Node": "☊",
      "Lilith": "⚸", "Chiron": "⚷", "Fortune": "⊗", "Vertex": "Vx"
    };

    // Aspect symbols
    const aspectSymbols: Record<string, string> = {
      'Conjunction': '☌',
      'Opposition': '☍',
      'Square': '□',
      'Trine': '△',
      'Sextile': '⚹',
      'Quincunx': '⚻'
    };

    // Aspect colors
    const aspectColors: Record<string, string> = {
      'Conjunction': '#228B22',
      'Opposition': '#FF0000',
      'Square': '#FF0000',
      'Trine': '#0000FF',
      'Sextile': '#0000FF',
      'Quincunx': '#B8860B'
    };

    // Transit planet colors
    const transitColors: Record<string, string> = {
      'Sun': '#ff6b35',
      'Moon': '#4a90e2', 
      'Mercury': '#8bc34a',
      'Venus': '#ffc107',
      'Mars': '#f44336',
      'Jupiter': '#9c27b0',
      'Saturn': '#607d8b',
      'Uranus': '#00bcd4',
      'Neptune': '#3f51b5',
      'Pluto': '#795548',
      'Node': '#ff9800',
      'Chiron': '#e91e63',
      'Lilith': '#9e9e9e',
      'Fortune': '#4caf50',
      'Vertex': '#673ab7'
    };

    const planet1Symbol = planetSymbols[planet1] || planet1;
    const planet2Symbol = planetSymbols[planet2] || planet2;
    const aspectSymbol = aspectSymbols[aspect] || aspect;
    const aspectColor = aspectColors[aspect] || '#666';
    // For transit aspects: planet1 is transit (orange), planet2 is natal (gray)
    const planet1Color = isTransitAspect ? '#ff9500' : '#333';
    const planet2Color = '#333'; // Natal planet is always gray

    return {
      title: `${planet1} ${aspect.toLowerCase()} ${planet2}`,
      type: isTransitAspect ? 'Transit Aspect' : 'Natal Aspect',
      orb: orb !== undefined ? `${orb.toFixed(2)}°` : aspectDataInfo?.orb || 'Unknown',
      nature: aspectDataInfo?.nature || 'Unknown',
      general: generalInterpretation,
      specific: specificInterpretation,
      planet1Symbol,
      planet2Symbol,
      planet1Color,
      planet2Color,
      isTransitAspect,
      aspectSymbol,
      aspectColor
    };
  }

  function getSignInterpretation(signData: any): SignInterpretation {
    const { sign, house } = signData;
    const signInHouse = (SIGN_IN_HOUSE_INTERPRETATIONS as any)[sign]?.[house] || "No interpretation available.";
    const houseKey = `${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'}`;
    const houseGeneral = HOUSES[houseKey] || "House information not available.";
    
    // Zodiac symbols
    const zodiacSymbols: Record<string, string> = {
      "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
      "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
    };
    
    return {
      title: `${sign} in House ${house}`,
      houseGeneral,
      signInHouse,
      zodiacSymbol: zodiacSymbols[sign] || sign
    };
  }

  // Helper functions for sign characteristics
  function getSignElement(sign: string): string {
    const elements: Record<string, string> = {
      "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
      "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
      "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
      "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
    };
    return elements[sign] || "Unknown";
  }

  function getSignQuality(sign: string): string {
    const qualities: Record<string, string> = {
      "Aries": "Cardinal", "Cancer": "Cardinal", "Libra": "Cardinal", "Capricorn": "Cardinal",
      "Taurus": "Fixed", "Leo": "Fixed", "Scorpio": "Fixed", "Aquarius": "Fixed",
      "Gemini": "Mutable", "Virgo": "Mutable", "Sagittarius": "Mutable", "Pisces": "Mutable"
    };
    return qualities[sign] || "Unknown";
  }

  function getSignRuler(sign: string): string {
    const rulers: Record<string, string> = {
      "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
      "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Pluto",
      "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Uranus", "Pisces": "Neptune"
    };
    return rulers[sign] || "Unknown";
  }

  function getSignPolarity(sign: string): string {
    const polarities: Record<string, string> = {
      "Aries": "Positive", "Gemini": "Positive", "Leo": "Positive", "Libra": "Positive", "Sagittarius": "Positive", "Aquarius": "Positive",
      "Taurus": "Negative", "Cancer": "Negative", "Virgo": "Negative", "Scorpio": "Negative", "Capricorn": "Negative", "Pisces": "Negative"
    };
    return polarities[sign] || "Unknown";
  }

  function getSignDescription(sign: string): string {
    const descriptions: Record<string, string> = {
      "Aries": "The first sign of the zodiac, Aries represents new beginnings, courage, and pioneering spirit. Natural leaders with boundless energy and enthusiasm.",
      "Taurus": "The bull represents stability, determination, and sensuality. Taureans are known for their patience, loyalty, and appreciation for beauty and comfort.",
      "Gemini": "The twins symbolize duality, communication, and adaptability. Geminis are curious, versatile, and excellent communicators with a quick wit.",
      "Cancer": "The crab represents emotional depth, intuition, and nurturing qualities. Cancerians are deeply caring, protective, and have strong family bonds.",
      "Leo": "The lion embodies creativity, leadership, and dramatic flair. Leos are natural performers, generous, and have a strong sense of pride and dignity.",
      "Virgo": "The virgin represents precision, service, and analytical thinking. Virgos are detail-oriented, practical, and have a strong sense of duty.",
      "Libra": "The scales symbolize balance, harmony, and justice. Librans are diplomatic, fair-minded, and have a natural sense of beauty and partnership.",
      "Scorpio": "The scorpion represents intensity, transformation, and deep emotional power. Scorpios are passionate, mysterious, and have incredible insight.",
      "Sagittarius": "The archer embodies adventure, optimism, and philosophical thinking. Sagittarians are freedom-loving, honest, and always seeking truth.",
      "Capricorn": "The sea-goat represents ambition, discipline, and practical wisdom. Capricorns are responsible, hardworking, and have strong traditional values.",
      "Aquarius": "The water bearer symbolizes innovation, humanitarianism, and intellectual independence. Aquarians are progressive, original thinkers with a strong sense of community.",
      "Pisces": "The fish represents spirituality, compassion, and artistic sensitivity. Pisceans are intuitive, empathetic, and have a deep connection to the mystical."
    };
    return descriptions[sign] || "No description available.";
  }

  function getAngularHouseInterpretation(angularHouseData: any): AngularHouseInterpretation {
    const { planet, sign, degree, minute } = angularHouseData;
    
    // Angular house symbols
    const angularHouseSymbols: Record<string, string> = {
      "ASC": "Asc", "MC": "MC", "DSC": "Dsc", "IC": "IC"
    };

    // Zodiac symbols
    const zodiacSymbols: Record<string, string> = {
      "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
      "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
    };

    // Angular house meanings and descriptions
    const angularHouseInfo: Record<string, { meaning: string; description: string }> = {
      "ASC": {
        meaning: "Ascendant - Your Rising Sign",
        description: "The Ascendant represents your outer personality, how you present yourself to the world, and your physical appearance. It's the sign that was rising on the eastern horizon at the moment of your birth. This is often called your 'rising sign' and represents your first impression on others, your approach to new situations, and your immediate reactions to life."
      },
      "MC": {
        meaning: "Midheaven - Your Career & Public Image",
        description: "The Midheaven (MC) represents your career path, public reputation, and life goals. It shows your ambitions, achievements, and how you want to be seen by the world. This point indicates your professional calling, your relationship with authority figures, and your highest aspirations in life."
      },
      "DSC": {
        meaning: "Descendant - Your Relationships",
        description: "The Descendant represents your relationships, partnerships, and what you seek in others. It shows the qualities you're attracted to in partners and the type of people you form close relationships with. This point also represents your shadow side - qualities you may project onto others."
      },
      "IC": {
        meaning: "Imum Coeli - Your Roots & Private Life",
        description: "The Imum Coeli (IC) represents your home, family, roots, and private life. It shows your deepest emotional needs, your relationship with family, and your sense of security. This point indicates your foundation, your connection to your past, and what makes you feel safe and nurtured."
      }
    };

    const houseInfo = angularHouseInfo[planet];
    const symbol = angularHouseSymbols[planet] || planet;
    const zodiacSymbol = zodiacSymbols[sign] || sign;

    return {
      title: `${planet} (${symbol}) in ${sign}`,
      meaning: houseInfo.meaning,
      description: houseInfo.description,
      symbol,
      sign,
      zodiacSymbol,
      degree,
      minute
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

  function isAngularHouseInterpretation(interpretation: Interpretation): interpretation is AngularHouseInterpretation {
    return 'meaning' in interpretation && 'symbol' in interpretation;
  }

  $: interpretation = elementData ? 
    (elementData.aspect ? getAspectInterpretation(elementData) :
     elementData.planet ? (['ASC', 'MC', 'DSC', 'IC'].includes(elementData.planet) ? getAngularHouseInterpretation(elementData) : getPlanetInterpretation(elementData)) :
     elementData.sign ? getSignInterpretation(elementData) : null) : null;

  // Enhanced planet characteristics
  function getPlanetCharacteristics(planet: string): { keywords: string[], description: string, themes: string[], challenges: string[], strengths: string[] } {
    const characteristics: Record<string, { keywords: string[], description: string, themes: string[], challenges: string[], strengths: string[] }> = {
      "Sun": {
        keywords: ["Identity", "Ego", "Life Purpose", "Vitality", "Leadership", "Father", "Authority"],
        description: "The Sun represents your core identity, ego, and life purpose. It shows how you express your fundamental self and what drives you at the deepest level. The Sun is associated with the father figure and represents your conscious mind and willpower.",
        themes: ["Self-expression", "Leadership", "Creativity", "Authority", "Life direction", "Personal power"],
        challenges: ["Ego conflicts", "Over-identification with achievements", "Need for constant recognition", "Difficulty with criticism"],
        strengths: ["Natural leadership", "Strong willpower", "Creative expression", "Ability to inspire others", "Clear sense of purpose"]
      },
      "Moon": {
        keywords: ["Emotions", "Intuition", "Mother", "Home", "Security", "Nurturing", "Subconscious"],
        description: "The Moon represents your emotional nature, intuition, and subconscious mind. It shows how you process feelings, your need for security, and your relationship with the mother figure. The Moon governs your inner world and emotional responses.",
        themes: ["Emotional security", "Nurturing", "Intuition", "Home life", "Maternal instincts", "Emotional patterns"],
        challenges: ["Emotional instability", "Mood swings", "Over-sensitivity", "Difficulty with change", "Attachment issues"],
        strengths: ["Strong intuition", "Emotional intelligence", "Nurturing abilities", "Empathy", "Psychic sensitivity"]
      },
      "Mercury": {
        keywords: ["Communication", "Thinking", "Learning", "Siblings", "Travel", "Intellect", "Adaptability"],
        description: "Mercury represents your communication style, thinking patterns, and how you process information. It governs learning, short trips, and your relationship with siblings. Mercury shows how you express ideas and connect with others mentally.",
        themes: ["Communication", "Learning", "Intellectual pursuits", "Adaptability", "Curiosity", "Mental agility"],
        challenges: ["Scattered thinking", "Over-analysis", "Communication difficulties", "Restlessness", "Indecisiveness"],
        strengths: ["Quick thinking", "Versatile communication", "Learning ability", "Adaptability", "Intellectual curiosity"]
      },
      "Venus": {
        keywords: ["Love", "Beauty", "Values", "Relationships", "Art", "Harmony", "Pleasure"],
        description: "Venus represents your approach to love, beauty, and what you value. It governs relationships, artistic expression, and your sense of aesthetics. Venus shows how you attract and relate to others, and what brings you pleasure and satisfaction.",
        themes: ["Romance", "Beauty", "Artistic expression", "Values", "Partnerships", "Aesthetics"],
        challenges: ["Dependency in relationships", "Vanity", "Indecision in love", "Over-idealization", "People-pleasing"],
        strengths: ["Natural charm", "Artistic talent", "Diplomatic skills", "Appreciation for beauty", "Loving nature"]
      },
      "Mars": {
        keywords: ["Action", "Courage", "Energy", "Sexuality", "Competition", "Drive", "Assertiveness"],
        description: "Mars represents your energy, drive, and how you take action. It governs your courage, sexuality, and competitive nature. Mars shows how you assert yourself, pursue goals, and handle conflict or challenges.",
        themes: ["Physical energy", "Courage", "Sexuality", "Competition", "Leadership", "Protection"],
        challenges: ["Aggression", "Impatience", "Impulsiveness", "Conflict", "Burnout", "Anger issues"],
        strengths: ["Courage", "Physical energy", "Protective instincts", "Leadership", "Determination", "Passion"]
      },
      "Jupiter": {
        keywords: ["Expansion", "Wisdom", "Luck", "Philosophy", "Travel", "Optimism", "Growth"],
        description: "Jupiter represents expansion, wisdom, and your quest for meaning. It governs higher learning, philosophy, travel, and your sense of optimism. Jupiter shows how you grow, learn, and find abundance in life.",
        themes: ["Personal growth", "Wisdom", "Optimism", "Abundance", "Philosophy", "Higher learning"],
        challenges: ["Over-optimism", "Excess", "Dogmatism", "Overconfidence", "Scattered focus"],
        strengths: ["Natural wisdom", "Optimistic outlook", "Generosity", "Teaching ability", "Abundance mindset"]
      },
      "Saturn": {
        keywords: ["Structure", "Responsibility", "Limitations", "Discipline", "Authority", "Time", "Wisdom"],
        description: "Saturn represents structure, responsibility, and the lessons you must learn. It governs discipline, authority figures, and the areas where you face challenges. Saturn shows where you need to work hard and build lasting foundations.",
        themes: ["Responsibility", "Discipline", "Structure", "Authority", "Time", "Wisdom through experience"],
        challenges: ["Self-doubt", "Fear of failure", "Rigidity", "Pessimism", "Over-criticism"],
        strengths: ["Discipline", "Reliability", "Practical wisdom", "Endurance", "Ability to build lasting structures"]
      },
      "Uranus": {
        keywords: ["Innovation", "Freedom", "Revolution", "Individuality", "Technology", "Awakening", "Change"],
        description: "Uranus represents innovation, freedom, and sudden change. It governs your unique individuality, revolutionary ideas, and connection to collective consciousness. Uranus brings unexpected breakthroughs and liberates you from limitations.",
        themes: ["Individuality", "Innovation", "Freedom", "Revolution", "Technology", "Awakening"],
        challenges: ["Rebellion without cause", "Detachment", "Unpredictability", "Difficulty with authority", "Alienation"],
        strengths: ["Original thinking", "Innovation", "Independence", "Visionary abilities", "Awakening others"]
      },
      "Neptune": {
        keywords: ["Spirituality", "Inspiration", "Illusion", "Compassion", "Dreams", "Mysticism", "Dissolution"],
        description: "Neptune represents spirituality, inspiration, and the dissolution of boundaries. It governs your connection to the divine, artistic inspiration, and your capacity for compassion. Neptune can bring both transcendence and confusion.",
        themes: ["Spirituality", "Inspiration", "Compassion", "Artistic expression", "Dreams", "Mysticism"],
        challenges: ["Confusion", "Escapism", "Boundary issues", "Idealization", "Self-sacrifice"],
        strengths: ["Spiritual awareness", "Artistic inspiration", "Compassion", "Intuition", "Healing abilities"]
      },
      "Pluto": {
        keywords: ["Transformation", "Power", "Death", "Rebirth", "Psychology", "Control", "Intensity"],
        description: "Pluto represents deep transformation, power dynamics, and psychological evolution. It governs death and rebirth, shared resources, and your capacity for profound change. Pluto brings intense experiences that force you to confront your deepest fears and desires.",
        themes: ["Transformation", "Power", "Psychology", "Death and rebirth", "Intensity", "Control"],
        challenges: ["Power struggles", "Control issues", "Intensity", "Psychological crises", "Obsession"],
        strengths: ["Transformative power", "Psychological insight", "Resilience", "Ability to regenerate", "Deep understanding"]
      }
    };

    return characteristics[planet] || {
      keywords: [],
      description: "This planet represents important aspects of your personality and life experience.",
      themes: [],
      challenges: [],
      strengths: []
    };
  }

  // Enhanced sign characteristics
  function getSignCharacteristics(sign: string): { element: string, quality: string, ruler: string, polarity: string, description: string, keywords: string[], themes: string[], challenges: string[], strengths: string[] } {
    const characteristics: Record<string, { element: string, quality: string, ruler: string, polarity: string, description: string, keywords: string[], themes: string[], challenges: string[], strengths: string[] }> = {
      "Aries": {
        element: "Fire",
        quality: "Cardinal",
        ruler: "Mars",
        polarity: "Positive",
        description: "Aries is the first sign of the zodiac, representing new beginnings, courage, and pioneering spirit. As a fire sign, Aries is passionate, energetic, and driven by action. Cardinal quality makes Aries natural leaders who initiate change.",
        keywords: ["Pioneering", "Courageous", "Energetic", "Independent", "Competitive", "Impulsive", "Enthusiastic"],
        themes: ["New beginnings", "Leadership", "Courage", "Independence", "Action", "Competition"],
        challenges: ["Impatience", "Impulsiveness", "Selfishness", "Aggression", "Lack of follow-through"],
        strengths: ["Natural leadership", "Courage", "Energy", "Pioneering spirit", "Directness", "Enthusiasm"]
      },
      "Taurus": {
        element: "Earth",
        quality: "Fixed",
        ruler: "Venus",
        polarity: "Negative",
        description: "Taurus is the second sign, representing stability, sensuality, and material security. As an earth sign, Taurus is practical, grounded, and connected to the physical world. Fixed quality makes Taurus determined and resistant to change.",
        keywords: ["Stable", "Sensual", "Patient", "Loyal", "Practical", "Stubborn", "Reliable"],
        themes: ["Security", "Sensuality", "Material world", "Patience", "Loyalty", "Beauty"],
        challenges: ["Stubbornness", "Possessiveness", "Resistance to change", "Materialism", "Slow to act"],
        strengths: ["Reliability", "Patience", "Practical wisdom", "Sensuality", "Loyalty", "Determination"]
      },
      "Gemini": {
        element: "Air",
        quality: "Mutable",
        ruler: "Mercury",
        polarity: "Positive",
        description: "Gemini is the third sign, representing communication, curiosity, and adaptability. As an air sign, Gemini is intellectual, social, and thrives on mental stimulation. Mutable quality makes Gemini flexible and versatile.",
        keywords: ["Communicative", "Curious", "Adaptable", "Versatile", "Intellectual", "Social", "Restless"],
        themes: ["Communication", "Learning", "Variety", "Social connections", "Intellectual pursuits", "Adaptability"],
        challenges: ["Scattered energy", "Superficiality", "Indecisiveness", "Restlessness", "Gossip"],
        strengths: ["Versatility", "Communication skills", "Intellectual curiosity", "Adaptability", "Social skills"]
      },
      "Cancer": {
        element: "Water",
        quality: "Cardinal",
        ruler: "Moon",
        polarity: "Negative",
        description: "Cancer is the fourth sign, representing emotional depth, nurturing, and home. As a water sign, Cancer is intuitive, sensitive, and deeply emotional. Cardinal quality makes Cancer natural nurturers who initiate emotional connections.",
        keywords: ["Nurturing", "Sensitive", "Protective", "Intuitive", "Emotional", "Home-loving", "Caring"],
        themes: ["Emotional security", "Family", "Home", "Nurturing", "Intuition", "Protection"],
        challenges: ["Moodiness", "Over-sensitivity", "Clinginess", "Defensiveness", "Emotional dependency"],
        strengths: ["Nurturing abilities", "Intuition", "Protective instincts", "Emotional depth", "Loyalty"]
      },
      "Leo": {
        element: "Fire",
        quality: "Fixed",
        ruler: "Sun",
        polarity: "Positive",
        description: "Leo is the fifth sign, representing creativity, leadership, and self-expression. As a fire sign, Leo is passionate, confident, and naturally dramatic. Fixed quality makes Leo determined and loyal, with a strong sense of pride.",
        keywords: ["Creative", "Confident", "Generous", "Loyal", "Dramatic", "Proud", "Leadership"],
        themes: ["Self-expression", "Creativity", "Leadership", "Recognition", "Generosity", "Drama"],
        challenges: ["Pride", "Attention-seeking", "Stubbornness", "Drama", "Over-confidence"],
        strengths: ["Natural leadership", "Creativity", "Generosity", "Loyalty", "Charisma", "Confidence"]
      },
      "Virgo": {
        element: "Earth",
        quality: "Mutable",
        ruler: "Mercury",
        polarity: "Negative",
        description: "Virgo is the sixth sign, representing precision, service, and analytical thinking. As an earth sign, Virgo is practical, detail-oriented, and focused on improvement. Mutable quality makes Virgo adaptable and helpful.",
        keywords: ["Analytical", "Practical", "Service-oriented", "Perfectionist", "Reliable", "Modest", "Helpful"],
        themes: ["Service", "Perfection", "Analysis", "Health", "Organization", "Improvement"],
        challenges: ["Perfectionism", "Over-criticism", "Worry", "Self-doubt", "Rigidity"],
        strengths: ["Attention to detail", "Practical skills", "Service orientation", "Reliability", "Analytical thinking"]
      },
      "Libra": {
        element: "Air",
        quality: "Cardinal",
        ruler: "Venus",
        polarity: "Positive",
        description: "Libra is the seventh sign, representing balance, harmony, and relationships. As an air sign, Libra is intellectual, diplomatic, and values fairness. Cardinal quality makes Libra natural mediators who initiate partnerships.",
        keywords: ["Diplomatic", "Fair", "Charming", "Social", "Indecisive", "Peace-loving", "Aesthetic"],
        themes: ["Balance", "Relationships", "Justice", "Harmony", "Beauty", "Partnerships"],
        challenges: ["Indecisiveness", "People-pleasing", "Conflict avoidance", "Dependency", "Superficiality"],
        strengths: ["Diplomatic skills", "Sense of fairness", "Charm", "Social skills", "Appreciation for beauty"]
      },
      "Scorpio": {
        element: "Water",
        quality: "Fixed",
        ruler: "Pluto",
        polarity: "Negative",
        description: "Scorpio is the eighth sign, representing intensity, transformation, and deep emotional power. As a water sign, Scorpio is intuitive, passionate, and drawn to the mysteries of life. Fixed quality makes Scorpio determined and loyal.",
        keywords: ["Intense", "Passionate", "Mysterious", "Loyal", "Transformative", "Secretive", "Powerful"],
        themes: ["Transformation", "Intensity", "Power", "Mystery", "Psychology", "Loyalty"],
        challenges: ["Jealousy", "Secretiveness", "Control issues", "Intensity", "Vengefulness"],
        strengths: ["Intensity", "Loyalty", "Psychological insight", "Transformative power", "Passion"]
      },
      "Sagittarius": {
        element: "Fire",
        quality: "Mutable",
        ruler: "Jupiter",
        polarity: "Positive",
        description: "Sagittarius is the ninth sign, representing adventure, optimism, and philosophical thinking. As a fire sign, Sagittarius is enthusiastic, freedom-loving, and seeks truth. Mutable quality makes Sagittarius adaptable and open-minded.",
        keywords: ["Optimistic", "Adventurous", "Philosophical", "Honest", "Freedom-loving", "Enthusiastic", "Blunt"],
        themes: ["Adventure", "Philosophy", "Freedom", "Truth-seeking", "Optimism", "Expansion"],
        challenges: ["Bluntness", "Restlessness", "Over-optimism", "Impatience", "Dogmatism"],
        strengths: ["Optimism", "Adventure", "Philosophical thinking", "Honesty", "Enthusiasm", "Open-mindedness"]
      },
      "Capricorn": {
        element: "Earth",
        quality: "Cardinal",
        ruler: "Saturn",
        polarity: "Negative",
        description: "Capricorn is the tenth sign, representing ambition, discipline, and practical wisdom. As an earth sign, Capricorn is grounded, responsible, and focused on achievement. Cardinal quality makes Capricorn natural leaders who build lasting structures.",
        keywords: ["Ambitious", "Disciplined", "Responsible", "Practical", "Patient", "Traditional", "Determined"],
        themes: ["Achievement", "Structure", "Responsibility", "Tradition", "Authority", "Long-term goals"],
        challenges: ["Pessimism", "Rigidity", "Workaholism", "Emotional coldness", "Over-criticism"],
        strengths: ["Discipline", "Responsibility", "Practical wisdom", "Determination", "Reliability", "Leadership"]
      },
      "Aquarius": {
        element: "Air",
        quality: "Fixed",
        ruler: "Uranus",
        polarity: "Positive",
        description: "Aquarius is the eleventh sign, representing innovation, humanitarianism, and intellectual independence. As an air sign, Aquarius is intellectual, original, and values freedom. Fixed quality makes Aquarius determined and loyal to their ideals.",
        keywords: ["Innovative", "Independent", "Humanitarian", "Intellectual", "Unconventional", "Detached", "Visionary"],
        themes: ["Innovation", "Humanitarianism", "Freedom", "Intellectual pursuits", "Groups", "Progress"],
        challenges: ["Detachment", "Rebellion", "Alienation", "Unpredictability", "Emotional distance"],
        strengths: ["Innovation", "Independence", "Humanitarian vision", "Intellectual abilities", "Original thinking"]
      },
      "Pisces": {
        element: "Water",
        quality: "Mutable",
        ruler: "Neptune",
        polarity: "Negative",
        description: "Pisces is the twelfth sign, representing spirituality, compassion, and artistic sensitivity. As a water sign, Pisces is intuitive, empathetic, and deeply connected to the spiritual realm. Mutable quality makes Pisces adaptable and compassionate.",
        keywords: ["Compassionate", "Intuitive", "Artistic", "Spiritual", "Dreamy", "Selfless", "Mystical"],
        themes: ["Spirituality", "Compassion", "Artistic expression", "Intuition", "Dreams", "Service"],
        challenges: ["Escapism", "Boundary issues", "Over-sensitivity", "Confusion", "Self-sacrifice"],
        strengths: ["Compassion", "Intuition", "Artistic abilities", "Spiritual awareness", "Empathy", "Healing"]
      }
    };

    return characteristics[sign] || {
      element: "Unknown",
      quality: "Unknown",
      ruler: "Unknown",
      polarity: "Unknown",
      description: "This sign represents important aspects of your personality and life experience.",
      keywords: [],
      themes: [],
      challenges: [],
      strengths: []
    };
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-90vw md:max-w-3xl lg:max-w-3xl lg:p-10 max-h-[90vh] overflow-y-auto">
    {#if elementData && interpretation}
      <Dialog.Header>
        {#if isAspectInterpretation(interpretation)}
          <Dialog.Title>
            <span style="color: {interpretation.planet1Color};">{elementData.planet1}</span>
            <span class="text-gray-700"> {elementData.aspect.toLowerCase()} </span>
            <span style="color: {interpretation.planet2Color};">{elementData.planet2}</span>
            <span class="text-gray-500 ml-2">(</span>
            <span class="font-symbols" style="color: {interpretation.planet1Color};">{interpretation.planet1Symbol}</span>
            <span class="font-aspect ml-1" style="color: {interpretation.aspectColor};">{interpretation.aspectSymbol}</span>
            <span class="font-symbols ml-1" style="color: {interpretation.planet2Color};">{interpretation.planet2Symbol}</span>
            <span class="text-gray-500">)</span>
          </Dialog.Title>
        {:else if isPlanetInterpretation(interpretation)}
          <Dialog.Title>
            <span style="color: {interpretation.planetColor};">{elementData.planet}</span>
            <span class="text-gray-700 ml-1">in</span>
            <span class="text-gray-700 ml-1">{elementData.sign}</span>
            <span class="text-gray-500 ml-2">(</span>
            <span class="font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
            <span class="font-zodiac ml-1 text-gray-600">{interpretation.zodiacSymbol}</span>
            <span class="text-gray-500">)</span>
            {#if elementData.house}
              <span class="text-gray-500 ml-2">(House {elementData.house})</span>
            {/if}
          </Dialog.Title>
        {:else}
          <Dialog.Title>{interpretation.title}</Dialog.Title>
        {/if}
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
          {@const planetChars = getPlanetCharacteristics(elementData.planet)}
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Position</h3>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
                <p class="text-gray-700 font-zodiac">{interpretation.position}</p>
                {#if interpretation.isRetrograde}
                  <span class="text-sm text-red-500 font-medium">Rx</span>
                {/if}
              </div>
            </div>

            <!-- Enhanced Planet Characteristics -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xl font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
                <h3 class="font-semibold text-gray-900">{elementData.planet} - Core Meaning</h3>
              </div>
              <p class="text-gray-700 leading-relaxed mb-4">{planetChars.description}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Keywords</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each planetChars.keywords as keyword}
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{keyword}</span>
                    {/each}
                  </div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each planetChars.themes as theme}
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-symbols" style="color: {interpretation.planetColor};">{interpretation.planetSymbol}</span>
                <span class="ml-1" style="color: {interpretation.planetColor};">{elementData.planet}</span>
                <span class="ml-1 text-gray-700">in</span>
                <span class="font-zodiac ml-1 text-gray-600">{interpretation.zodiacSymbol}</span>
                <span class="ml-1 text-gray-700">{elementData.sign}</span>
              </h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.planetInSign}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <span class="ml-1 text-gray-700">{elementData.sign}</span>
                <span class="ml-1 text-gray-700">in House {elementData.house}</span>
              </h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.signInHouse}</p>
            </div>

            <!-- Planet Strengths and Challenges -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border rounded-lg p-4 bg-green-50">
                <h4 class="font-semibold text-green-800 mb-2">Strengths</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  {#each planetChars.strengths as strength}
                    <li class="flex items-start gap-2">
                      <span class="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  {/each}
                </ul>
              </div>
              <div class="border rounded-lg p-4 bg-orange-50">
                <h4 class="font-semibold text-orange-800 mb-2">Challenges</h4>
                <ul class="text-sm text-orange-700 space-y-1">
                  {#each planetChars.challenges as challenge}
                    <li class="flex items-start gap-2">
                      <span class="text-orange-600 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  {/each}
                </ul>
              </div>
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
                <h3 class="font-semibold text-gray-900 mb-3">General Interpretation</h3>
                <p class="text-gray-700 leading-relaxed">{interpretation.general}</p>
              </div>
            {/if}

            {#if interpretation.specific}
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Specific Meaning</h3>
                <p class="text-gray-700 leading-relaxed">{interpretation.specific}</p>
              </div>
            {/if}
          </div>
        {:else if elementData.sign && isSignInterpretation(interpretation)}
          <!-- Sign Details -->
          {@const signChars = getSignCharacteristics(elementData.sign)}
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <h3 class="font-semibold text-gray-900">{elementData.sign} - Sign Overview</h3>
              </div>
              <p class="text-gray-700 leading-relaxed mb-4">{signChars.description}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Element:</span>
                  <span class="ml-2 text-gray-600">{signChars.element}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Quality:</span>
                  <span class="ml-2 text-gray-600">{signChars.quality}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Ruler:</span>
                  <span class="ml-2 text-gray-600">{signChars.ruler}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Polarity:</span>
                  <span class="ml-2 text-gray-600">{signChars.polarity}</span>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">House {elementData.house} represents</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.houseGeneral}</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">{elementData.sign} in House {elementData.house}</h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.signInHouse}</p>
            </div>

            <!-- Sign Keywords and Themes -->
            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-zodiac text-gray-600">{interpretation.zodiacSymbol}</span>
                <span class="ml-1 text-gray-700">{elementData.sign} - Key Characteristics</span>
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Keywords</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each signChars.keywords as keyword}
                      <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{keyword}</span>
                    {/each}
                  </div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Themes</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each signChars.themes as theme}
                      <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{theme}</span>
                    {/each}
                  </div>
                </div>
              </div>
            </div>

            <!-- Sign Strengths and Challenges -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border rounded-lg p-4 bg-green-50">
                <h4 class="font-semibold text-green-800 mb-2">Strengths</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  {#each signChars.strengths as strength}
                    <li class="flex items-start gap-2">
                      <span class="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  {/each}
                </ul>
              </div>
              <div class="border rounded-lg p-4 bg-orange-50">
                <h4 class="font-semibold text-orange-800 mb-2">Challenges</h4>
                <ul class="text-sm text-orange-700 space-y-1">
                  {#each signChars.challenges as challenge}
                    <li class="flex items-start gap-2">
                      <span class="text-orange-600 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        {:else if elementData.planet && ['ASC', 'MC', 'DSC', 'IC'].includes(elementData.planet) && isAngularHouseInterpretation(interpretation)}
          <!-- Angular House Details -->
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl font-symbols text-gray-600">{interpretation.symbol}</span>
                <h3 class="font-semibold text-gray-900">{interpretation.meaning}</h3>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Position:</span>
                  <span class="ml-2 text-gray-600">{interpretation.degree}°{interpretation.minute.toString().padStart(2, '0')}' {interpretation.sign}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Sign:</span>
                  <span class="ml-2 text-gray-600 font-zodiac">{interpretation.zodiacSymbol} {interpretation.sign}</span>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">
                <span class="font-symbols text-gray-600">{interpretation.symbol}</span>
                <span class="ml-1 text-gray-700">{elementData.planet} - Meaning & Significance</span>
              </h3>
              <p class="text-gray-700 leading-relaxed">{interpretation.description}</p>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<style>
  .font-symbols {
    font-family: 'Noto Sans Symbols', 'Arial', sans-serif;
  }
  
  .font-zodiac {
    font-family: 'Noto Sans Symbols', 'Arial Unicode MS', 'Arial', sans-serif;
    font-weight: 500;
  }
  
  .font-aspect {
    font-family: 'Noto Sans Symbols', 'Arial Unicode MS', 'Arial', sans-serif;
    font-weight: 600;
  }
</style> 