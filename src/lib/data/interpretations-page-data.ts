// Interpretations page data
// This file contains the data specifically for the interpretations page

export interface PlanetData {
  name: string;
  symbol: string;
  element: string;
  description: string;
  keywords: string[];
  themes: string[];
  challenges: string[];
  strengths: string[];
}

export interface SignData {
  name: string;
  symbol: string;
  element: string;
  quality: string;
  ruler: string;
  description: string;
  keywords: string[];
  themes: string[];
  challenges: string[];
  strengths: string[];
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
    description: 'Core identity, ego, life purpose, father, authority figures, creative expression. The Sun represents your core identity, ego, and life purpose. It shows how you express your fundamental self and what drives you at the deepest level.',
    keywords: ['Identity', 'Ego', 'Leadership', 'Vitality', 'Father', 'Life Purpose'],
    themes: ['Self-expression', 'Leadership', 'Creativity', 'Authority', 'Life direction', 'Personal power'],
    challenges: ['Ego conflicts', 'Over-identification with achievements', 'Need for constant recognition', 'Difficulty with criticism'],
    strengths: ['Natural leadership', 'Strong willpower', 'Creative expression', 'Ability to inspire others', 'Clear sense of purpose']
  },
  {
    name: 'Moon',
    symbol: '☽',
    element: 'Water',
    description: 'Emotions, mother, intuition, subconscious mind, nurturing instincts, and emotional responses. The Moon represents your emotional nature, intuition, and subconscious mind. It shows how you process feelings and your need for security.',
    keywords: ['Emotions', 'Intuition', 'Mother', 'Subconscious', 'Nurturing', 'Security'],
    themes: ['Emotional security', 'Nurturing', 'Intuition', 'Home life', 'Maternal instincts', 'Emotional patterns'],
    challenges: ['Emotional instability', 'Mood swings', 'Over-sensitivity', 'Difficulty with change', 'Attachment issues'],
    strengths: ['Strong intuition', 'Emotional intelligence', 'Nurturing abilities', 'Empathy', 'Psychic sensitivity']
  },
  {
    name: 'Mercury',
    symbol: '☿',
    element: 'Air',
    description: 'Communication, thinking, learning, siblings, short trips, and mental processes. Mercury represents your communication style, thinking patterns, and how you process information. It governs learning and your relationship with siblings.',
    keywords: ['Communication', 'Thinking', 'Learning', 'Siblings', 'Intellect', 'Travel'],
    themes: ['Communication', 'Learning', 'Intellectual pursuits', 'Adaptability', 'Curiosity', 'Mental agility'],
    challenges: ['Scattered thinking', 'Over-analysis', 'Communication difficulties', 'Restlessness', 'Indecisiveness'],
    strengths: ['Quick thinking', 'Versatile communication', 'Learning ability', 'Adaptability', 'Intellectual curiosity']
  },
  {
    name: 'Venus',
    symbol: '♀',
    element: 'Earth',
    description: 'Love, beauty, values, relationships, art, and harmony. Venus represents your approach to love, beauty, and what you value. It governs relationships, artistic expression, and your sense of aesthetics.',
    keywords: ['Love', 'Beauty', 'Relationships', 'Values', 'Art', 'Harmony'],
    themes: ['Romance', 'Beauty', 'Artistic expression', 'Values', 'Partnerships', 'Aesthetics'],
    challenges: ['Dependency in relationships', 'Vanity', 'Indecision in love', 'Over-idealization', 'People-pleasing'],
    strengths: ['Natural charm', 'Artistic talent', 'Diplomatic skills', 'Appreciation for beauty', 'Loving nature']
  },
  {
    name: 'Mars',
    symbol: '♂',
    element: 'Fire',
    description: 'Action, energy, aggression, sexuality, courage, and drive. Mars represents your energy, drive, and how you take action. It governs your courage, sexuality, and competitive nature.',
    keywords: ['Action', 'Energy', 'Courage', 'Sexuality', 'Drive', 'Assertiveness'],
    themes: ['Physical energy', 'Courage', 'Sexuality', 'Competition', 'Leadership', 'Protection'],
    challenges: ['Aggression', 'Impatience', 'Impulsiveness', 'Conflict', 'Burnout', 'Anger issues'],
    strengths: ['Courage', 'Physical energy', 'Protective instincts', 'Leadership', 'Determination', 'Passion']
  },
  {
    name: 'Jupiter',
    symbol: '♃',
    element: 'Fire',
    description: 'Expansion, wisdom, philosophy, luck, higher learning, and optimism. Jupiter represents expansion, wisdom, and your quest for meaning. It governs higher learning, philosophy, and your sense of optimism.',
    keywords: ['Expansion', 'Wisdom', 'Philosophy', 'Luck', 'Optimism', 'Growth'],
    themes: ['Personal growth', 'Wisdom', 'Optimism', 'Abundance', 'Philosophy', 'Higher learning'],
    challenges: ['Over-optimism', 'Excess', 'Dogmatism', 'Overconfidence', 'Scattered focus'],
    strengths: ['Natural wisdom', 'Optimistic outlook', 'Generosity', 'Teaching ability', 'Abundance mindset']
  },
  {
    name: 'Saturn',
    symbol: '♄',
    element: 'Earth',
    description: 'Structure, discipline, limitations, karma, responsibility, and life lessons. Saturn represents structure, responsibility, and the lessons you must learn. It governs discipline and the areas where you face challenges.',
    keywords: ['Structure', 'Discipline', 'Limitations', 'Karma', 'Responsibility', 'Lessons'],
    themes: ['Responsibility', 'Discipline', 'Structure', 'Authority', 'Time', 'Wisdom through experience'],
    challenges: ['Self-doubt', 'Fear of failure', 'Rigidity', 'Pessimism', 'Over-criticism'],
    strengths: ['Discipline', 'Reliability', 'Practical wisdom', 'Endurance', 'Ability to build lasting structures']
  },
  {
    name: 'Uranus',
    symbol: '♅',
    element: 'Air',
    description: 'Innovation, rebellion, sudden change, originality, and awakening. Uranus represents innovation, freedom, and sudden change. It governs your unique individuality and revolutionary ideas.',
    keywords: ['Innovation', 'Rebellion', 'Change', 'Originality', 'Awakening', 'Breakthroughs'],
    themes: ['Individuality', 'Innovation', 'Freedom', 'Revolution', 'Technology', 'Awakening'],
    challenges: ['Rebellion without cause', 'Detachment', 'Unpredictability', 'Difficulty with authority', 'Alienation'],
    strengths: ['Original thinking', 'Innovation', 'Independence', 'Visionary abilities', 'Awakening others']
  },
  {
    name: 'Neptune',
    symbol: '♆',
    element: 'Water',
    description: 'Spirituality, dreams, illusion, compassion, inspiration, and transcendence. Neptune represents spirituality, inspiration, and the dissolution of boundaries. It governs your connection to the divine.',
    keywords: ['Spirituality', 'Dreams', 'Illusion', 'Compassion', 'Inspiration', 'Transcendence'],
    themes: ['Spirituality', 'Inspiration', 'Compassion', 'Artistic expression', 'Dreams', 'Mysticism'],
    challenges: ['Confusion', 'Escapism', 'Boundary issues', 'Idealization', 'Self-sacrifice'],
    strengths: ['Spiritual awareness', 'Artistic inspiration', 'Compassion', 'Intuition', 'Healing abilities']
  },
  {
    name: 'Pluto',
    symbol: '♇',
    element: 'Water',
    description: 'Transformation, power, death, rebirth, deep psychology, and regeneration. Pluto represents deep transformation, power dynamics, and psychological evolution. It governs death and rebirth.',
    keywords: ['Transformation', 'Power', 'Death', 'Rebirth', 'Psychology', 'Regeneration'],
    themes: ['Transformation', 'Power', 'Psychology', 'Death and rebirth', 'Intensity', 'Control'],
    challenges: ['Power struggles', 'Control issues', 'Intensity', 'Psychological crises', 'Obsession'],
    strengths: ['Transformative power', 'Psychological insight', 'Resilience', 'Ability to regenerate', 'Deep understanding']
  }
];

export const SIGNS_DATA: SignData[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'Fire',
    quality: 'Cardinal',
    ruler: 'Mars',
    description: 'Pioneering, energetic, impulsive, courageous, and independent. Aries leads with enthusiasm and natural confidence. As a fire sign, Aries is passionate, energetic, and driven by action.',
    keywords: ['Pioneering', 'Energetic', 'Impulsive', 'Courageous', 'Independent', 'Enthusiastic'],
    themes: ['New beginnings', 'Leadership', 'Courage', 'Independence', 'Action', 'Competition'],
    challenges: ['Impatience', 'Impulsiveness', 'Selfishness', 'Aggression', 'Lack of follow-through'],
    strengths: ['Natural leadership', 'Courage', 'Energy', 'Pioneering spirit', 'Directness', 'Enthusiasm']
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    quality: 'Fixed',
    ruler: 'Venus',
    description: 'Stable, practical, sensual, determined, and reliable. Taurus builds lasting foundations with patience and persistence. As an earth sign, Taurus is practical, grounded, and connected to the physical world.',
    keywords: ['Stable', 'Practical', 'Sensual', 'Determined', 'Reliable', 'Patient'],
    themes: ['Security', 'Sensuality', 'Material world', 'Patience', 'Loyalty', 'Beauty'],
    challenges: ['Stubbornness', 'Possessiveness', 'Resistance to change', 'Materialism', 'Slow to act'],
    strengths: ['Reliability', 'Patience', 'Practical wisdom', 'Sensuality', 'Loyalty', 'Determination']
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'Air',
    quality: 'Mutable',
    ruler: 'Mercury',
    description: 'Versatile, curious, communicative, adaptable, and intellectual. Gemini thrives on variety and mental stimulation. As an air sign, Gemini is intellectual, social, and thrives on mental stimulation.',
    keywords: ['Versatile', 'Curious', 'Communicative', 'Adaptable', 'Intellectual', 'Variety'],
    themes: ['Communication', 'Learning', 'Variety', 'Social connections', 'Intellectual pursuits', 'Adaptability'],
    challenges: ['Scattered energy', 'Superficiality', 'Indecisiveness', 'Restlessness', 'Gossip'],
    strengths: ['Versatility', 'Communication skills', 'Intellectual curiosity', 'Adaptability', 'Social skills']
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'Water',
    quality: 'Cardinal',
    ruler: 'Moon',
    description: 'Nurturing, emotional, protective, intuitive, and family-oriented. Cancer creates emotional security and deep connections. As a water sign, Cancer is intuitive, sensitive, and deeply emotional.',
    keywords: ['Nurturing', 'Emotional', 'Protective', 'Intuitive', 'Family', 'Security'],
    themes: ['Emotional security', 'Family', 'Home', 'Nurturing', 'Intuition', 'Protection'],
    challenges: ['Moodiness', 'Over-sensitivity', 'Clinginess', 'Defensiveness', 'Emotional dependency'],
    strengths: ['Nurturing abilities', 'Intuition', 'Protective instincts', 'Emotional depth', 'Loyalty']
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'Fire',
    quality: 'Fixed',
    ruler: 'Sun',
    description: 'Creative, dramatic, generous, proud, and charismatic. Leo expresses individuality with warmth and natural leadership. As a fire sign, Leo is passionate, confident, and naturally dramatic.',
    keywords: ['Creative', 'Dramatic', 'Generous', 'Proud', 'Charismatic', 'Leadership'],
    themes: ['Self-expression', 'Creativity', 'Leadership', 'Recognition', 'Generosity', 'Drama'],
    challenges: ['Pride', 'Attention-seeking', 'Stubbornness', 'Drama', 'Over-confidence'],
    strengths: ['Natural leadership', 'Creativity', 'Generosity', 'Loyalty', 'Charisma', 'Confidence']
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    quality: 'Mutable',
    ruler: 'Mercury',
    description: 'Analytical, practical, perfectionist, helpful, and detail-oriented. Virgo serves others through precision and improvement. As an earth sign, Virgo is practical, detail-oriented, and focused on improvement.',
    keywords: ['Analytical', 'Practical', 'Perfectionist', 'Helpful', 'Detail-oriented', 'Service'],
    themes: ['Service', 'Perfection', 'Analysis', 'Health', 'Organization', 'Improvement'],
    challenges: ['Perfectionism', 'Over-criticism', 'Worry', 'Self-doubt', 'Rigidity'],
    strengths: ['Attention to detail', 'Practical skills', 'Service orientation', 'Reliability', 'Analytical thinking']
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'Air',
    quality: 'Cardinal',
    ruler: 'Venus',
    description: 'Diplomatic, fair, social, indecisive, and relationship-focused. Libra seeks harmony and balance in all interactions. As an air sign, Libra is intellectual, diplomatic, and values fairness.',
    keywords: ['Diplomatic', 'Fair', 'Social', 'Indecisive', 'Harmony', 'Balance'],
    themes: ['Balance', 'Relationships', 'Justice', 'Harmony', 'Beauty', 'Partnerships'],
    challenges: ['Indecisiveness', 'People-pleasing', 'Conflict avoidance', 'Dependency', 'Superficiality'],
    strengths: ['Diplomatic skills', 'Sense of fairness', 'Charm', 'Social skills', 'Appreciation for beauty']
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    quality: 'Fixed',
    ruler: 'Pluto',
    description: 'Intense, mysterious, passionate, secretive, and transformative. Scorpio delves deep into life\'s mysteries and hidden truths. As a water sign, Scorpio is intuitive, passionate, and drawn to the mysteries of life.',
    keywords: ['Intense', 'Mysterious', 'Passionate', 'Secretive', 'Transformative', 'Deep'],
    themes: ['Transformation', 'Intensity', 'Power', 'Mystery', 'Psychology', 'Loyalty'],
    challenges: ['Jealousy', 'Secretiveness', 'Control issues', 'Intensity', 'Vengefulness'],
    strengths: ['Intensity', 'Loyalty', 'Psychological insight', 'Transformative power', 'Passion']
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    quality: 'Mutable',
    ruler: 'Jupiter',
    description: 'Optimistic, adventurous, philosophical, blunt, and freedom-loving. Sagittarius seeks truth and expansion through experience. As a fire sign, Sagittarius is enthusiastic, freedom-loving, and seeks truth.',
    keywords: ['Optimistic', 'Adventurous', 'Philosophical', 'Blunt', 'Freedom', 'Truth'],
    themes: ['Adventure', 'Philosophy', 'Freedom', 'Truth-seeking', 'Optimism', 'Expansion'],
    challenges: ['Bluntness', 'Restlessness', 'Over-optimism', 'Impatience', 'Dogmatism'],
    strengths: ['Optimism', 'Adventure', 'Philosophical thinking', 'Honesty', 'Enthusiasm', 'Open-mindedness']
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    quality: 'Cardinal',
    ruler: 'Saturn',
    description: 'Ambitious, disciplined, responsible, cautious, and achievement-oriented. Capricorn builds success through hard work and perseverance. As an earth sign, Capricorn is grounded, responsible, and focused on achievement.',
    keywords: ['Ambitious', 'Disciplined', 'Responsible', 'Cautious', 'Achievement', 'Perseverance'],
    themes: ['Achievement', 'Structure', 'Responsibility', 'Tradition', 'Authority', 'Long-term goals'],
    challenges: ['Pessimism', 'Rigidity', 'Workaholism', 'Emotional coldness', 'Over-criticism'],
    strengths: ['Discipline', 'Responsibility', 'Practical wisdom', 'Determination', 'Reliability', 'Leadership']
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    quality: 'Fixed',
    ruler: 'Uranus',
    description: 'Innovative, humanitarian, independent, eccentric, and future-oriented. Aquarius revolutionizes society through unique vision. As an air sign, Aquarius is intellectual, original, and values freedom.',
    keywords: ['Innovative', 'Humanitarian', 'Independent', 'Eccentric', 'Future', 'Revolutionary'],
    themes: ['Innovation', 'Humanitarianism', 'Freedom', 'Intellectual pursuits', 'Groups', 'Progress'],
    challenges: ['Detachment', 'Rebellion', 'Alienation', 'Unpredictability', 'Emotional distance'],
    strengths: ['Innovation', 'Independence', 'Humanitarian vision', 'Intellectual abilities', 'Original thinking']
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'Water',
    quality: 'Mutable',
    ruler: 'Neptune',
    description: 'Compassionate, artistic, spiritual, escapist, and intuitive. Pisces dissolves boundaries and connects to universal consciousness. As a water sign, Pisces is intuitive, empathetic, and deeply connected to the spiritual realm.',
    keywords: ['Compassionate', 'Artistic', 'Spiritual', 'Escapist', 'Intuitive', 'Universal'],
    themes: ['Spirituality', 'Compassion', 'Artistic expression', 'Intuition', 'Dreams', 'Service'],
    challenges: ['Escapism', 'Boundary issues', 'Over-sensitivity', 'Confusion', 'Self-sacrifice'],
    strengths: ['Compassion', 'Intuition', 'Artistic abilities', 'Spiritual awareness', 'Empathy', 'Healing']
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