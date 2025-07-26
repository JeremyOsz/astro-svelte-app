// Interpretations page data
// This file contains the data specifically for the interpretations page

export interface PlanetData {
  name: string;
  symbol: string;
  element: string;
  description: string;
  keywords: string[];
}

export interface SignData {
  name: string;
  symbol: string;
  element: string;
  quality: string;
  ruler: string;
  description: string;
  keywords: string[];
}

export interface HouseData {
  number: number;
  name: string;
  keyword: string;
  description: string;
  keywords: string[];
}

export interface AspectData {
  name: string;
  degrees: string;
  orb: string;
  nature: 'Harmonious' | 'Challenging';
  description: string;
  keywords: string[];
}

export const PLANETS_DATA: PlanetData[] = [
  {
    name: 'Sun',
    symbol: '☉',
    element: 'Fire',
    description: 'Core identity, ego, father, leadership, vitality, and life purpose. The Sun represents your essential self and how you express your fundamental nature.',
    keywords: ['Identity', 'Ego', 'Leadership', 'Vitality', 'Father', 'Life Purpose']
  },
  {
    name: 'Moon',
    symbol: '☽',
    element: 'Water',
    description: 'Emotions, mother, intuition, subconscious mind, nurturing instincts, and emotional responses. The Moon governs your inner world and emotional security.',
    keywords: ['Emotions', 'Intuition', 'Mother', 'Subconscious', 'Nurturing', 'Security']
  },
  {
    name: 'Mercury',
    symbol: '☿',
    element: 'Air',
    description: 'Communication, thinking, learning, siblings, short trips, and mental processes. Mercury governs how you think, speak, and process information.',
    keywords: ['Communication', 'Thinking', 'Learning', 'Siblings', 'Intellect', 'Travel']
  },
  {
    name: 'Venus',
    symbol: '♀',
    element: 'Earth',
    description: 'Love, beauty, values, relationships, art, and harmony. Venus governs what you find attractive and how you relate to others romantically and socially.',
    keywords: ['Love', 'Beauty', 'Relationships', 'Values', 'Art', 'Harmony']
  },
  {
    name: 'Mars',
    symbol: '♂',
    element: 'Fire',
    description: 'Action, energy, aggression, sexuality, courage, and drive. Mars represents your assertiveness and how you pursue your desires.',
    keywords: ['Action', 'Energy', 'Courage', 'Sexuality', 'Drive', 'Assertiveness']
  },
  {
    name: 'Jupiter',
    symbol: '♃',
    element: 'Fire',
    description: 'Expansion, wisdom, philosophy, luck, higher learning, and optimism. Jupiter governs your beliefs, growth, and opportunities for abundance.',
    keywords: ['Expansion', 'Wisdom', 'Philosophy', 'Luck', 'Optimism', 'Growth']
  },
  {
    name: 'Saturn',
    symbol: '♄',
    element: 'Earth',
    description: 'Structure, discipline, limitations, karma, responsibility, and life lessons. Saturn teaches through challenges and helps you build lasting foundations.',
    keywords: ['Structure', 'Discipline', 'Limitations', 'Karma', 'Responsibility', 'Lessons']
  },
  {
    name: 'Uranus',
    symbol: '♅',
    element: 'Air',
    description: 'Innovation, rebellion, sudden change, originality, and awakening. Uranus brings unexpected breakthroughs and revolutionary ideas.',
    keywords: ['Innovation', 'Rebellion', 'Change', 'Originality', 'Awakening', 'Breakthroughs']
  },
  {
    name: 'Neptune',
    symbol: '♆',
    element: 'Water',
    description: 'Spirituality, dreams, illusion, compassion, inspiration, and transcendence. Neptune dissolves boundaries and connects you to the divine.',
    keywords: ['Spirituality', 'Dreams', 'Illusion', 'Compassion', 'Inspiration', 'Transcendence']
  },
  {
    name: 'Pluto',
    symbol: '♇',
    element: 'Water',
    description: 'Transformation, power, death, rebirth, deep psychology, and regeneration. Pluto brings profound change through crisis and renewal.',
    keywords: ['Transformation', 'Power', 'Death', 'Rebirth', 'Psychology', 'Regeneration']
  }
];

export const SIGNS_DATA: SignData[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'Fire',
    quality: 'Cardinal',
    ruler: 'Mars',
    description: 'Pioneering, energetic, impulsive, courageous, and independent. Aries leads with enthusiasm and natural confidence.',
    keywords: ['Pioneering', 'Energetic', 'Impulsive', 'Courageous', 'Independent', 'Enthusiastic']
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    quality: 'Fixed',
    ruler: 'Venus',
    description: 'Stable, practical, sensual, determined, and reliable. Taurus builds lasting foundations with patience and persistence.',
    keywords: ['Stable', 'Practical', 'Sensual', 'Determined', 'Reliable', 'Patient']
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'Air',
    quality: 'Mutable',
    ruler: 'Mercury',
    description: 'Versatile, curious, communicative, adaptable, and intellectual. Gemini thrives on variety and mental stimulation.',
    keywords: ['Versatile', 'Curious', 'Communicative', 'Adaptable', 'Intellectual', 'Variety']
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'Water',
    quality: 'Cardinal',
    ruler: 'Moon',
    description: 'Nurturing, emotional, protective, intuitive, and family-oriented. Cancer creates emotional security and deep connections.',
    keywords: ['Nurturing', 'Emotional', 'Protective', 'Intuitive', 'Family', 'Security']
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'Fire',
    quality: 'Fixed',
    ruler: 'Sun',
    description: 'Creative, dramatic, generous, proud, and charismatic. Leo expresses individuality with warmth and natural leadership.',
    keywords: ['Creative', 'Dramatic', 'Generous', 'Proud', 'Charismatic', 'Leadership']
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    quality: 'Mutable',
    ruler: 'Mercury',
    description: 'Analytical, practical, perfectionist, helpful, and detail-oriented. Virgo serves others through precision and improvement.',
    keywords: ['Analytical', 'Practical', 'Perfectionist', 'Helpful', 'Detail-oriented', 'Service']
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'Air',
    quality: 'Cardinal',
    ruler: 'Venus',
    description: 'Diplomatic, fair, social, indecisive, and relationship-focused. Libra seeks harmony and balance in all interactions.',
    keywords: ['Diplomatic', 'Fair', 'Social', 'Indecisive', 'Harmony', 'Balance']
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    quality: 'Fixed',
    ruler: 'Pluto',
    description: 'Intense, mysterious, passionate, secretive, and transformative. Scorpio delves deep into life\'s mysteries and hidden truths.',
    keywords: ['Intense', 'Mysterious', 'Passionate', 'Secretive', 'Transformative', 'Deep']
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    quality: 'Mutable',
    ruler: 'Jupiter',
    description: 'Optimistic, adventurous, philosophical, blunt, and freedom-loving. Sagittarius seeks truth and expansion through experience.',
    keywords: ['Optimistic', 'Adventurous', 'Philosophical', 'Blunt', 'Freedom', 'Truth']
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    quality: 'Cardinal',
    ruler: 'Saturn',
    description: 'Ambitious, disciplined, responsible, cautious, and achievement-oriented. Capricorn builds success through hard work and perseverance.',
    keywords: ['Ambitious', 'Disciplined', 'Responsible', 'Cautious', 'Achievement', 'Perseverance']
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    quality: 'Fixed',
    ruler: 'Uranus',
    description: 'Innovative, humanitarian, independent, eccentric, and future-oriented. Aquarius revolutionizes society through unique vision.',
    keywords: ['Innovative', 'Humanitarian', 'Independent', 'Eccentric', 'Future', 'Revolutionary']
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'Water',
    quality: 'Mutable',
    ruler: 'Neptune',
    description: 'Compassionate, artistic, spiritual, escapist, and intuitive. Pisces dissolves boundaries and connects to universal consciousness.',
    keywords: ['Compassionate', 'Artistic', 'Spiritual', 'Escapist', 'Intuitive', 'Universal']
  }
];

export const HOUSES_DATA: HouseData[] = [
  {
    number: 1,
    name: 'First House',
    keyword: 'Identity',
    description: 'Self, appearance, first impressions, physical body, and how you present yourself to the world. The house of new beginnings.',
    keywords: ['Self', 'Appearance', 'First Impressions', 'Physical Body', 'New Beginnings', 'Personality']
  },
  {
    number: 2,
    name: 'Second House',
    keyword: 'Values',
    description: 'Money, possessions, self-worth, material security, and what you value most in life. The house of personal resources.',
    keywords: ['Money', 'Possessions', 'Self-worth', 'Material Security', 'Values', 'Resources']
  },
  {
    number: 3,
    name: 'Third House',
    keyword: 'Communication',
    description: 'Siblings, short trips, learning, local environment, early education, and immediate communication. The house of mind and movement.',
    keywords: ['Siblings', 'Short Trips', 'Learning', 'Local Environment', 'Communication', 'Mind']
  },
  {
    number: 4,
    name: 'Fourth House',
    keyword: 'Home',
    description: 'Family, home, roots, mother, emotional foundation, and private life. The house of emotional security and ancestry.',
    keywords: ['Family', 'Home', 'Roots', 'Mother', 'Emotional Foundation', 'Private Life']
  },
  {
    number: 5,
    name: 'Fifth House',
    keyword: 'Creativity',
    description: 'Children, romance, creativity, self-expression, hobbies, and entertainment. The house of joy and pleasure.',
    keywords: ['Children', 'Romance', 'Creativity', 'Self-expression', 'Hobbies', 'Joy']
  },
  {
    number: 6,
    name: 'Sixth House',
    keyword: 'Service',
    description: 'Work, health, daily routines, service to others, pets, and employees. The house of daily work and wellness.',
    keywords: ['Work', 'Health', 'Daily Routines', 'Service', 'Pets', 'Wellness']
  },
  {
    number: 7,
    name: 'Seventh House',
    keyword: 'Partnerships',
    description: 'Marriage, partnerships, close relationships, open enemies, and contracts. The house of one-to-one relationships.',
    keywords: ['Marriage', 'Partnerships', 'Relationships', 'Enemies', 'Contracts', 'Balance']
  },
  {
    number: 8,
    name: 'Eighth House',
    keyword: 'Transformation',
    description: 'Shared resources, death, rebirth, sexuality, other people\'s money, and deep psychological processes. The house of transformation.',
    keywords: ['Shared Resources', 'Death', 'Rebirth', 'Sexuality', 'Psychology', 'Transformation']
  },
  {
    number: 9,
    name: 'Ninth House',
    keyword: 'Philosophy',
    description: 'Higher education, travel, philosophy, spirituality, publishing, and legal matters. The house of higher mind and expansion.',
    keywords: ['Higher Education', 'Travel', 'Philosophy', 'Spirituality', 'Publishing', 'Expansion']
  },
  {
    number: 10,
    name: 'Tenth House',
    keyword: 'Career',
    description: 'Career, reputation, public image, authority figures, father, and life goals. The house of public achievement.',
    keywords: ['Career', 'Reputation', 'Public Image', 'Authority', 'Father', 'Achievement']
  },
  {
    number: 11,
    name: 'Eleventh House',
    keyword: 'Community',
    description: 'Friends, groups, social causes, hopes, dreams, and humanitarian interests. The house of collective consciousness.',
    keywords: ['Friends', 'Groups', 'Social Causes', 'Hopes', 'Dreams', 'Community']
  },
  {
    number: 12,
    name: 'Twelfth House',
    keyword: 'Spirituality',
    description: 'Subconscious, spirituality, hidden enemies, karma, isolation, and service to others. The house of the unconscious mind.',
    keywords: ['Subconscious', 'Spirituality', 'Hidden Enemies', 'Karma', 'Isolation', 'Unconscious']
  }
];

export const ASPECTS_DATA: AspectData[] = [
  {
    name: 'Conjunction',
    degrees: '0°',
    orb: '±8°',
    nature: 'Harmonious',
    description: 'Planets work together, intensifying their combined energy. Creates focus and unity of purpose.',
    keywords: ['Unity', 'Focus', 'Intensity', 'Combined Energy', 'New Beginnings', 'Direct Expression']
  },
  {
    name: 'Sextile',
    degrees: '60°',
    orb: '±4°',
    nature: 'Harmonious',
    description: 'Easy flow of energy, opportunities for growth and cooperation. Gentle support and natural talents.',
    keywords: ['Opportunity', 'Growth', 'Cooperation', 'Gentle Support', 'Natural Talents', 'Flow']
  },
  {
    name: 'Square',
    degrees: '90°',
    orb: '±8°',
    nature: 'Challenging',
    description: 'Tension and conflict, but also motivation for growth and change. Creates dynamic energy through friction.',
    keywords: ['Tension', 'Conflict', 'Growth', 'Change', 'Dynamic Energy', 'Friction']
  },
  {
    name: 'Trine',
    degrees: '120°',
    orb: '±8°',
    nature: 'Harmonious',
    description: 'Natural harmony and ease, talents and abilities flow easily. Comfortable and supportive energy.',
    keywords: ['Harmony', 'Ease', 'Talents', 'Flow', 'Comfort', 'Support']
  },
  {
    name: 'Opposition',
    degrees: '180°',
    orb: '±8°',
    nature: 'Challenging',
    description: 'Polarity and awareness, relationships and external challenges. Creates balance through tension.',
    keywords: ['Polarity', 'Awareness', 'Relationships', 'Challenges', 'Balance', 'Tension']
  }
]; 