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

export interface OtherObjectData {
  name: string;
  symbol: string;
  category: 'Extended Planet' | 'Angle' | 'Asteroid' | 'Point';
  description: string;
  keywords: string[];
  themes: string[];
  significance: string;
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

export const OTHER_OBJECTS_DATA: OtherObjectData[] = [
  // Angles
  {
    name: 'Ascendant (ASC)',
    symbol: 'ASC',
    category: 'Angle',
    description: 'The rising sign, representing how you present yourself to the world and your first impressions. The Ascendant shows your outer personality and approach to life.',
    keywords: ['First Impressions', 'Outer Personality', 'Appearance', 'Approach', 'Identity', 'Self-Presentation'],
    themes: ['First impressions', 'Outer personality', 'Appearance', 'Approach to life', 'Identity', 'Self-presentation'],
    significance: 'Shows how you present yourself to the world and your approach to life'
  },
  {
    name: 'Descendant (DSC)',
    symbol: 'DSC',
    category: 'Angle',
    description: 'The setting sign, representing partnerships, relationships, and what you seek in others. The Descendant shows your relationship needs and the qualities you attract.',
    keywords: ['Partnerships', 'Relationships', 'Others', 'Balance', 'Attraction', 'Complement'],
    themes: ['Partnerships', 'Relationships', 'Others', 'Balance', 'Attraction', 'Complement'],
    significance: 'Shows relationship needs and the qualities you attract in others'
  },
  {
    name: 'Midheaven (MC)',
    symbol: 'MC',
    category: 'Angle',
    description: 'The highest point, representing career, public image, and life goals. The Midheaven shows your public persona and career direction.',
    keywords: ['Career', 'Public Image', 'Life Goals', 'Achievement', 'Reputation', 'Authority'],
    themes: ['Career', 'Public image', 'Life goals', 'Achievement', 'Reputation', 'Authority'],
    significance: 'Shows career direction and public persona'
  },
  {
    name: 'Imum Coeli (IC)',
    symbol: 'IC',
    category: 'Angle',
    description: 'The lowest point, representing home, family, and private life. The Imum Coeli shows your private self and emotional foundation.',
    keywords: ['Home', 'Family', 'Private Life', 'Foundation', 'Roots', 'Emotional Base'],
    themes: ['Home', 'Family', 'Private life', 'Foundation', 'Roots', 'Emotional base'],
    significance: 'Shows your private self and emotional foundation'
  },
  // Asteroids
  {
    name: 'Lilith (Black Moon)',
    symbol: '⚸',
    category: 'Asteroid',
    description: 'The dark feminine, representing repressed desires, wild nature, and the shadow self. Lilith shows areas where we suppress our true nature.',
    keywords: ['Dark Feminine', 'Repressed Desires', 'Wild Nature', 'Shadow Self', 'Rebellion', 'Freedom'],
    themes: ['Dark feminine', 'Repressed desires', 'Wild nature', 'Shadow self', 'Rebellion', 'Freedom'],
    significance: 'Shows repressed desires and the shadow aspects of personality'
  },
  {
    name: 'Lunar Nodes',
    symbol: '☊☋',
    category: 'Point',
    description: 'The North and South Nodes represent your soul\'s journey and karmic lessons. The North Node shows your destiny, while the South Node shows past life patterns.',
    keywords: ['Destiny', 'Karma', 'Soul Journey', 'Past Life', 'Future Path', 'Lessons'],
    themes: ['Destiny', 'Karma', 'Soul journey', 'Past life patterns', 'Future path', 'Life lessons'],
    significance: 'Shows your soul\'s journey and karmic lessons'
  },
  {
    name: 'Part of Fortune',
    symbol: '☊',
    category: 'Point',
    description: 'A calculated point representing luck, fortune, and where you find joy and success. The Part of Fortune shows areas of natural talent and good fortune.',
    keywords: ['Luck', 'Fortune', 'Joy', 'Success', 'Natural Talent', 'Abundance'],
    themes: ['Luck', 'Fortune', 'Joy', 'Success', 'Natural talent', 'Abundance'],
    significance: 'Shows areas of natural talent and good fortune'
  },
  {
    name: 'Vertex',
    symbol: '⚸',
    category: 'Point',
    description: 'A sensitive point representing fated encounters and significant relationships. The Vertex shows areas of destiny and important meetings.',
    keywords: ['Fated Encounters', 'Destiny', 'Relationships', 'Significant Meetings', 'Karma', 'Fate'],
    themes: ['Fated encounters', 'Destiny', 'Relationships', 'Significant meetings', 'Karma', 'Fate'],
    significance: 'Shows fated encounters and significant relationships'
  },
  // Extended Planets
  {
    name: 'Chiron',
    symbol: '⚷',
    category: 'Extended Planet',
    description: 'The wounded healer, representing deep wounds, healing, and wisdom gained through pain. Chiron shows where we have experienced deep wounds and how we can transform them into healing wisdom.',
    keywords: ['Wounds', 'Healing', 'Wisdom', 'Pain', 'Transformation', 'Mentorship'],
    themes: ['Healing', 'Wounds', 'Wisdom through pain', 'Mentorship', 'Vulnerability', 'Transformation'],
    significance: 'Shows areas of deep wounding and the path to healing and wisdom'
  },
  {
    name: 'Ceres',
    symbol: '⚳',
    category: 'Extended Planet',
    description: 'The nurturing mother, representing care, nourishment, and the cycles of growth and harvest. Ceres governs how we nurture others and ourselves.',
    keywords: ['Nurturing', 'Care', 'Nourishment', 'Growth', 'Harvest', 'Motherhood'],
    themes: ['Nurturing', 'Care', 'Growth cycles', 'Nourishment', 'Motherhood', 'Abundance'],
    significance: 'Represents nurturing abilities and how we care for ourselves and others'
  },
  {
    name: 'Pallas',
    symbol: '⚴',
    category: 'Extended Planet',
    description: 'The warrior goddess of wisdom, representing strategy, creative intelligence, and pattern recognition. Pallas shows how we approach problems and create solutions.',
    keywords: ['Strategy', 'Wisdom', 'Creative Intelligence', 'Patterns', 'Problem-solving', 'Craftsmanship'],
    themes: ['Strategic thinking', 'Creative intelligence', 'Pattern recognition', 'Problem-solving', 'Craftsmanship', 'Wisdom'],
    significance: 'Shows strategic thinking and creative problem-solving abilities'
  },
  {
    name: 'Juno',
    symbol: '⚵',
    category: 'Extended Planet',
    description: 'The goddess of marriage and commitment, representing partnership, loyalty, and relationship dynamics. Juno shows our approach to committed relationships.',
    keywords: ['Partnership', 'Commitment', 'Loyalty', 'Marriage', 'Relationships', 'Equality'],
    themes: ['Partnership', 'Commitment', 'Loyalty', 'Relationship dynamics', 'Equality', 'Marriage'],
    significance: 'Represents committed partnerships and relationship dynamics'
  },
  {
    name: 'Vesta',
    symbol: '⚶',
    category: 'Extended Planet',
    description: 'The goddess of the hearth, representing devotion, service, and spiritual focus. Vesta shows where we find our spiritual center and what we devote ourselves to.',
    keywords: ['Devotion', 'Service', 'Spiritual Focus', 'Sacred Fire', 'Dedication', 'Purity'],
    themes: ['Devotion', 'Service', 'Spiritual focus', 'Sacred work', 'Dedication', 'Inner fire'],
    significance: 'Shows areas of devotion and spiritual focus'
  },
  {
    name: 'Eris',
    symbol: '⚸',
    category: 'Extended Planet',
    description: 'The goddess of discord, representing chaos, disruption, and the catalyst for change. Eris shows where we create or encounter necessary chaos for growth.',
    keywords: ['Chaos', 'Disruption', 'Discord', 'Change', 'Catalyst', 'Awakening'],
    themes: ['Chaos', 'Disruption', 'Catalytic change', 'Awakening', 'Discord', 'Transformation'],
    significance: 'Represents necessary chaos and disruption that leads to growth'
  },
  {
    name: 'Haumea',
    symbol: '⚹',
    category: 'Extended Planet',
    description: 'The goddess of fertility and creation, representing abundance, creativity, and the power of manifestation. Haumea shows our creative and manifesting abilities.',
    keywords: ['Fertility', 'Creation', 'Abundance', 'Manifestation', 'Birth', 'Growth'],
    themes: ['Fertility', 'Creation', 'Abundance', 'Manifestation', 'Birth', 'Growth'],
    significance: 'Shows creative and manifesting abilities'
  },
  {
    name: 'Makemake',
    symbol: '⚺',
    category: 'Extended Planet',
    description: 'The creator god, representing self-sufficiency, independence, and the power of individual creation. Makemake shows our ability to create independently.',
    keywords: ['Self-sufficiency', 'Independence', 'Creation', 'Individuality', 'Power', 'Autonomy'],
    themes: ['Self-sufficiency', 'Independence', 'Individual creation', 'Power', 'Autonomy', 'Self-reliance'],
    significance: 'Represents independent creation and self-sufficiency'
  },
  {
    name: 'Gonggong',
    symbol: '⚻',
    category: 'Extended Planet',
    description: 'The water god, representing chaos, destruction, and the power of natural forces. Gonggong shows areas where we encounter powerful, uncontrollable forces.',
    keywords: ['Chaos', 'Destruction', 'Natural Forces', 'Power', 'Uncontrollable', 'Transformation'],
    themes: ['Chaos', 'Destruction', 'Natural forces', 'Power', 'Uncontrollable energy', 'Transformation'],
    significance: 'Represents powerful, uncontrollable forces and their transformative effects'
  },
  {
    name: 'Quaoar',
    symbol: '⚼',
    category: 'Extended Planet',
    description: 'The creator force, representing order, structure, and the power to organize chaos. Quaoar shows our ability to create order and structure.',
    keywords: ['Order', 'Structure', 'Creation', 'Organization', 'Power', 'Control'],
    themes: ['Order', 'Structure', 'Creation', 'Organization', 'Power', 'Control'],
    significance: 'Shows ability to create order and structure from chaos'
  },
  {
    name: 'Orcus',
    symbol: '⚽',
    category: 'Extended Planet',
    description: 'The underworld god, representing justice, karma, and the consequences of actions. Orcus shows areas where we face karmic lessons and justice.',
    keywords: ['Justice', 'Karma', 'Consequences', 'Underworld', 'Punishment', 'Retribution'],
    themes: ['Justice', 'Karma', 'Consequences', 'Underworld', 'Punishment', 'Retribution'],
    significance: 'Represents karmic justice and the consequences of our actions'
  },
  {
    name: 'Salacia',
    symbol: '⚾',
    category: 'Extended Planet',
    description: 'The goddess of the sea, representing depth, intuition, and the unconscious mind. Salacia shows our connection to the deep unconscious and intuition.',
    keywords: ['Depth', 'Intuition', 'Unconscious', 'Sea', 'Mystery', 'Emotions'],
    themes: ['Depth', 'Intuition', 'Unconscious mind', 'Sea', 'Mystery', 'Emotions'],
    significance: 'Shows connection to the deep unconscious and intuitive abilities'
  },
  {
    name: 'Varuna',
    symbol: '⚿',
    category: 'Extended Planet',
    description: 'The cosmic lawgiver, representing cosmic order, truth, and the universal laws. Varuna shows our relationship with cosmic truth and universal laws.',
    keywords: ['Cosmic Order', 'Truth', 'Universal Laws', 'Justice', 'Cosmos', 'Law'],
    themes: ['Cosmic order', 'Truth', 'Universal laws', 'Justice', 'Cosmos', 'Law'],
    significance: 'Represents cosmic truth and universal laws'
  },
  {
    name: 'Ixion',
    symbol: '⚸',
    category: 'Extended Planet',
    description: 'The bound one, representing betrayal, consequences, and the price of hubris. Ixion shows areas where we face the consequences of our actions.',
    keywords: ['Betrayal', 'Consequences', 'Hubris', 'Bound', 'Punishment', 'Karma'],
    themes: ['Betrayal', 'Consequences', 'Hubris', 'Bound', 'Punishment', 'Karma'],
    significance: 'Shows areas of betrayal and the consequences of hubris'
  },
  {
    name: 'Huya',
    symbol: '⚹',
    category: 'Extended Planet',
    description: 'The rain god, representing transformation, renewal, and the power of change. Huya shows areas where we experience transformation and renewal.',
    keywords: ['Transformation', 'Renewal', 'Change', 'Rain', 'Growth', 'Rebirth'],
    themes: ['Transformation', 'Renewal', 'Change', 'Rain', 'Growth', 'Rebirth'],
    significance: 'Represents transformation and renewal through change'
  },
  {
    name: 'Eris',
    symbol: '⚸',
    category: 'Extended Planet',
    description: 'The goddess of strife, representing conflict, competition, and the drive for excellence. Eris shows areas where we encounter conflict and competition.',
    keywords: ['Conflict', 'Competition', 'Strife', 'Excellence', 'Drive', 'Challenge'],
    themes: ['Conflict', 'Competition', 'Strife', 'Excellence', 'Drive', 'Challenge'],
    significance: 'Shows areas of conflict and the drive for excellence'
  },
  
]; 