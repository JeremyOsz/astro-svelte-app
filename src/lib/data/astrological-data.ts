// Consolidated astrological data
// This file contains all the astrological constants, symbols, and reference data

// Core zodiac data
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const ZODIAC_SYMBOLS: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

export const ZODIAC_COLORS: Record<string, string> = {
  'Aries': '#e53935',      // Fire - Red
  'Taurus': '#43a047',     // Earth - Green
  'Gemini': '#fbc02d',     // Air - Yellow
  'Cancer': '#039be5',     // Water - Blue
  'Leo': '#e53935',        // Fire - Red
  'Virgo': '#43a047',      // Earth - Green
  'Libra': '#fbc02d',      // Air - Yellow
  'Scorpio': '#039be5',    // Water - Blue
  'Sagittarius': '#e53935',// Fire - Red
  'Capricorn': '#43a047',  // Earth - Green
  'Aquarius': '#fbc02d',   // Air - Yellow
  'Pisces': '#039be5'      // Water - Blue
};

// Enhanced zodiac data with elements, qualities, and rulers
export const ZODIAC_DETAILED = [
  { name: 'Aries', element: 'Fire', quality: 'Cardinal', ruler: 'Mars', symbol: '♈', startDegree: 0, endDegree: 30 },
  { name: 'Taurus', element: 'Earth', quality: 'Fixed', ruler: 'Venus', symbol: '♉', startDegree: 30, endDegree: 60 },
  { name: 'Gemini', element: 'Air', quality: 'Mutable', ruler: 'Mercury', symbol: '♊', startDegree: 60, endDegree: 90 },
  { name: 'Cancer', element: 'Water', quality: 'Cardinal', ruler: 'Moon', symbol: '♋', startDegree: 90, endDegree: 120 },
  { name: 'Leo', element: 'Fire', quality: 'Fixed', ruler: 'Sun', symbol: '♌', startDegree: 120, endDegree: 150 },
  { name: 'Virgo', element: 'Earth', quality: 'Mutable', ruler: 'Mercury', symbol: '♍', startDegree: 150, endDegree: 180 },
  { name: 'Libra', element: 'Air', quality: 'Cardinal', ruler: 'Venus', symbol: '♎', startDegree: 180, endDegree: 210 },
  { name: 'Scorpio', element: 'Water', quality: 'Fixed', ruler: 'Pluto', symbol: '♏', startDegree: 210, endDegree: 240 },
  { name: 'Sagittarius', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', symbol: '♐', startDegree: 240, endDegree: 270 },
  { name: 'Capricorn', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', symbol: '♑', startDegree: 270, endDegree: 300 },
  { name: 'Aquarius', element: 'Air', quality: 'Fixed', ruler: 'Uranus', symbol: '♒', startDegree: 300, endDegree: 330 },
  { name: 'Pisces', element: 'Water', quality: 'Mutable', ruler: 'Neptune', symbol: '♓', startDegree: 330, endDegree: 360 }
] as const;

// Planet data
export const PLANET_SYMBOLS: Record<string, string> = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂', 
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇', 
  'Node': '☊', 'S.Node': '☋', 'Lilith': '⚸', 'Chiron': '⚷', 'Fortune': '⨁', 'Vertex': 'Vx', 
  'ASC': 'Asc', 'MC': 'MC', 'DSC': 'Dsc', 'IC': 'IC'
};

export const EXTENDED_PLANET_NAMES = ['Chiron', 'Lilith', 'Node', 'Fortune', 'Vertex'];

export const CORE_ASPECT_BODIES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 
  'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC'
];

// Transit planet colors
export const TRANSIT_COLORS: Record<string, string> = {
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

// Aspect symbols
export const ASPECT_SYMBOLS: Record<string, string> = {
  'Conjunction': '☌',
  'Opposition': '☍',
  'Square': '□',
  'Trine': '△',
  'Sextile': '⚹',
  'Quincunx': '⚻'
};

// Aspect definitions
export const ASPECT_DEFINITIONS = {
  'Conjunction': { angle: 0, orb: 8, color: '#228B22', weight: 2.5, style: 'solid' },
  'Opposition': { angle: 180, orb: 8, color: '#FF0000', weight: 2.5, style: 'solid' },
  'Square': { angle: 90, orb: 8, color: '#FF0000', weight: 2.5, style: 'solid' },
  'Trine': { angle: 120, orb: 8, color: '#0000FF', weight: 2, style: 'solid' },
  'Sextile': { angle: 60, orb: 6, color: '#0000FF', weight: 2, style: 'dotted' },
  'Quincunx': { angle: 150, orb: 3, color: '#B8860B', weight: 1.5, style: 'dashed' }
} as const;

export const PLANETS = {
  SUN: 0,
  MOON: 1,
  MERCURY: 2,
  VENUS: 3,
  MARS: 4,
  JUPITER: 5,
  SATURN: 6,
  URANUS: 7,
  NEPTUNE: 8,
  PLUTO: 9
} as const;

export const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8 },
  { name: 'Opposition', angle: 180, orb: 8 },
  { name: 'Trine', angle: 120, orb: 6 },
  { name: 'Square', angle: 90, orb: 6 },
  { name: 'Sextile', angle: 60, orb: 4 }
] as const;

// Utility functions
export function getSignByDegree(degree: number): string {
  const normalizedDegree = degree % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS[signIndex];
}

export function getSignDetails(signName: string) {
  return ZODIAC_DETAILED.find(sign => sign.name === signName);
}

export const DEGREES_PER_SIGN = 30;
export const WHOLE_SIGN_HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);

// Planet characteristics for detailed interpretations
export const PLANET_CHARACTERISTICS: Record<string, {
  keywords: string[];
  description: string;
  themes: string[];
  challenges: string[];
  strengths: string[];
}> = {
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

// Sign characteristics for detailed interpretations
export const SIGN_CHARACTERISTICS: Record<string, {
  element: string;
  quality: string;
  ruler: string;
  polarity: string;
  description: string;
  keywords: string[];
  themes: string[];
  challenges: string[];
  strengths: string[];
}> = {
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