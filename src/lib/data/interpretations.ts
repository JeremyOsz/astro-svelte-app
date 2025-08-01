// Consolidated astrological interpretations
// This file contains all interpretation data for aspects, transits, and planetary combinations

export interface AspectInterpretation {
    general: string;
    orb: string;
    nature: string;
    planets: Record<string, string>;
}

export interface TransitInterpretation {
    aspect: string;
    transitPlanet: string;
    natalPlanet: string;
    interpretation: string;
}

export interface PlanetInterpretation {
    description: string;
    keywords: string[];
}

export interface SignInterpretation {
    general: string;
    orb: string;
    nature: string;
    planets: Record<string, string>;
}

// Types for planet in sign and sign in house interpretations
export type PlanetName = 
  | "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" 
  | "Uranus" | "Neptune" | "Pluto" | "Node" | "Lilith" | "Chiron" | "Fortune" | "Vertex";

export type ZodiacSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo" 
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type HouseNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export type PlanetInSignInterpretations = {
    [planet in PlanetName]: {
        [sign in ZodiacSign]: string;
    };
}

export type SignInHouseInterpretations = {
    [sign in ZodiacSign]: {
        [house in HouseNumber]: string;
    };
}


// Major aspects and their general meanings
export const MAJOR_ASPECTS: Record<string, string> = {
    'Conjunction': 'A time of new beginnings and direct manifestation of the planets\' energies.',
    'Opposition': 'A period of tension and awareness of polarities, requiring balance and integration.',
    'Trine': 'A harmonious flow of energy, bringing ease and natural development.',
    'Square': 'A challenging aspect that creates tension and requires action or change.',
    'Sextile': 'An opportunity for growth and positive development through conscious effort.',
    'Quincunx': 'An aspect requiring adjustment and integration of seemingly incompatible energies.'
};

export const ELEMENTS: Record<string, string> = {
    "Fire": "Fire is the element of passion, energy, and creativity. It is associated with the Sun, Mars, and the first three signs of the zodiac: Aries, Leo, and Sagittarius. Fire energy is dynamic, intense, and often associated with leadership and action.",
    "Earth": "Earth is the element of stability, practicality, and grounding. It is associated with the Sun, Venus, and the last three signs of the zodiac: Capricorn, Taurus, and Virgo. Earth energy is practical, reliable, and often associated with responsibility and structure.",
    "Air": "Air is the element of communication, intellect, and flexibility. It is associated with the Sun, Mercury, and the middle three signs of the zodiac: Gemini, Libra, and Aquarius. Air energy is intellectual, adaptable, and often associated with communication and ideas.",
    "Water": "Water is the element of emotion, intuition, and creativity. It is associated with the Sun, Moon, and the last three signs of the zodiac: Cancer, Scorpio, and Pisces. Water energy is emotional, intuitive, and often associated with creativity and sensitivity."
}

export const HOUSES: Record<string, string> = {
    "1st": "Self, personality, appearance, first impressions, how you present yourself to the world",
    "2nd": "Money, possessions, values, self-worth, material security, what you value",
    "3rd": "Communication, siblings, short trips, learning, local environment, early education",
    "4th": "Home, family, roots, mother, emotional foundation, private life",
    "5th": "Creativity, romance, children, fun, self-expression, hobbies, entertainment",
    "6th": "Work, health, daily routines, service to others, pets, employees",
    "7th": "Partnerships, marriage, close relationships, open enemies, contracts",
    "8th": "Shared resources, transformation, death, rebirth, other people's money, sexuality",
    "9th": "Higher education, philosophy, religion, long-distance travel, publishing, legal matters",
    "10th": "Career, public image, reputation, authority figures, father, life goals",
    "11th": "Friends, groups, social causes, hopes and dreams, humanitarian interests",
    "12th": "Spirituality, subconscious, hidden things, karma, isolation, service to others"
}


// Detailed aspect interpretations
export const ASPECT_INTERPRETATIONS: Record<string, AspectInterpretation> = {
    "Conjunction": {
        "general": "Planets in conjunction blend their energies together, creating a powerful fusion of their qualities. This aspect represents unity, focus, and intensity. The planets work as one, amplifying each other's characteristics.",
        "orb": "0-8°",
        "nature": "Harmonious when planets are compatible, challenging when planets have conflicting energies",
        "planets": {
            "Sun_Moon": "A powerful aspect indicating strong will and emotional drive. The ego and emotions work together harmoniously, creating a person with clear self-expression and emotional authenticity.",
            "Sun_Mercury": "Sharp intellect and clear communication. The mind and ego are aligned, leading to confident self-expression and strong mental focus.",
            "Sun_Venus": "Charm, creativity, and artistic talent. The ego is expressed through beauty, love, and artistic pursuits. Natural charisma and social grace.",
            "Sun_Mars": "Dynamic energy, courage, and leadership. Strong willpower and drive to achieve goals. Can be impulsive or aggressive if not channeled properly.",
            "Sun_Jupiter": "Optimism, generosity, and philosophical thinking. Natural leadership with a broad perspective and desire to inspire others.",
            "Sun_Saturn": "Discipline, responsibility, and ambition. Serious approach to life with strong work ethic. Can indicate self-doubt or authority issues.",
            "Sun_Uranus": "Innovation, independence, and originality. Unique personality with revolutionary ideas. Can be rebellious or unpredictable.",
            "Sun_Neptune": "Intuition, spirituality, and artistic inspiration. Idealistic and compassionate, but may struggle with boundaries.",
            "Sun_Pluto": "Transformative power and intense focus. Deep psychological insight and ability to influence others. Can be obsessive or controlling.",
            "Moon_Mercury": "Emotional intelligence and intuitive communication. Thoughts are influenced by feelings, leading to empathetic understanding.",
            "Moon_Venus": "Emotional harmony and artistic sensitivity. Strong need for beauty and emotional connection in relationships.",
            "Moon_Mars": "Emotional intensity and passionate responses. Quick emotional reactions and strong protective instincts.",
            "Moon_Jupiter": "Emotional optimism and generosity. Natural nurturing qualities and desire to help others grow.",
            "Moon_Saturn": "Emotional discipline and responsibility. May suppress emotions or have difficulty expressing feelings.",
            "Moon_Uranus": "Emotional independence and unpredictability. Unconventional emotional responses and need for freedom.",
            "Moon_Neptune": "Emotional sensitivity and spiritual intuition. Deep empathy but may be prone to emotional confusion.",
            "Moon_Pluto": "Emotional intensity and psychological depth. Powerful emotional transformation and deep understanding of others.",
            "Mercury_Venus": "Artistic communication and social charm. Natural ability to express beauty and harmony through words.",
            "Mercury_Mars": "Quick thinking and assertive communication. Sharp intellect with direct, sometimes aggressive expression.",
            "Mercury_Jupiter": "Philosophical thinking and optimistic communication. Broad perspective and desire to share knowledge.",
            "Mercury_Saturn": "Practical thinking and careful communication. Methodical approach to learning and expressing ideas.",
            "Mercury_Uranus": "Innovative thinking and original ideas. Sudden insights and unconventional communication style.",
            "Mercury_Neptune": "Intuitive thinking and artistic communication. Creative imagination but may struggle with practical details.",
            "Mercury_Pluto": "Penetrating intellect and psychological insight. Deep analysis and ability to uncover hidden truths.",
            "Venus_Mars": "Passionate love and artistic drive. Strong romantic and creative energy, but may indicate relationship conflicts.",
            "Venus_Jupiter": "Generous love and artistic abundance. Natural charm and desire to create beauty and harmony.",
            "Venus_Saturn": "Serious approach to love and beauty. May have difficulty expressing affection or finding satisfaction in relationships.",
            "Venus_Uranus": "Unconventional love and artistic innovation. Attracted to unique beauty and freedom in relationships.",
            "Venus_Neptune": "Romantic idealism and artistic inspiration. Spiritual approach to love and beauty, but may be unrealistic.",
            "Venus_Pluto": "Intense love and artistic transformation. Deep emotional connections and powerful creative expression.",
            "Mars_Jupiter": "Optimistic action and generous energy. Natural leadership with broad vision and enthusiasm.",
            "Mars_Saturn": "Disciplined action and patient energy. Methodical approach to achieving goals with persistence.",
            "Mars_Uranus": "Revolutionary action and innovative energy. Sudden bursts of energy and unconventional approaches.",
            "Mars_Neptune": "Inspired action and spiritual energy. Creative drive but may lack practical direction.",
            "Mars_Pluto": "Intense action and transformative energy. Powerful drive for change and deep psychological motivation.",
            "Jupiter_Saturn": "Balanced optimism and discipline. Practical wisdom and ability to achieve long-term goals.",
            "Jupiter_Uranus": "Revolutionary wisdom and innovative philosophy. Progressive thinking and desire for social change.",
            "Jupiter_Neptune": "Spiritual wisdom and idealistic vision. Compassionate leadership and desire to help humanity.",
            "Jupiter_Pluto": "Transformative wisdom and psychological insight. Deep understanding of human nature and power dynamics.",
            "Saturn_Uranus": "Disciplined innovation and structured change. Practical approach to revolutionary ideas.",
            "Saturn_Neptune": "Disciplined spirituality and practical idealism. Ability to manifest spiritual ideals in the material world.",
            "Saturn_Pluto": "Disciplined transformation and structured power. Patient approach to deep psychological change.",
            "Uranus_Neptune": "Revolutionary spirituality and innovative ideals. Visionary thinking and desire for spiritual progress.",
            "Uranus_Pluto": "Revolutionary transformation and innovative power. Sudden and powerful social or personal change.",
            "Neptune_Pluto": "Spiritual transformation and idealistic power. Deep spiritual evolution and collective consciousness."
        }
    },
    "Opposition": {
        "general": "Planets in opposition create tension and awareness through contrast. This aspect represents relationships, balance, and the need to integrate opposing forces. It often manifests in relationships with others or internal conflicts.",
        "orb": "180° ±8°",
        "nature": "Challenging but can be harmonized through awareness and integration",
        "planets": {
            "Sun_Moon": "Tension between ego and emotions. May struggle with self-expression vs. emotional needs. Important to balance personal identity with emotional security.",
            "Sun_Mercury": "Conflict between ego and intellect. May have difficulty expressing thoughts clearly or feel misunderstood.",
            "Sun_Venus": "Tension between ego and love nature. May struggle with self-worth in relationships or artistic expression.",
            "Sun_Mars": "Conflict between ego and action. May be aggressive or have difficulty asserting oneself appropriately.",
            "Sun_Jupiter": "Tension between ego and beliefs. May overestimate abilities or struggle with philosophical conflicts.",
            "Sun_Saturn": "Conflict between ego and responsibility. May feel limited by authority or struggle with self-discipline.",
            "Sun_Uranus": "Tension between ego and independence. May rebel against authority or struggle with personal freedom.",
            "Sun_Neptune": "Conflict between ego and spirituality. May lose sense of self in idealism or spiritual pursuits.",
            "Sun_Pluto": "Tension between ego and transformation. May resist change or struggle with power dynamics.",
            "Moon_Mercury": "Conflict between emotions and intellect. May have difficulty thinking clearly when emotional.",
            "Moon_Venus": "Tension between emotional and romantic needs. May have difficulty finding emotional satisfaction in relationships.",
            "Moon_Mars": "Conflict between emotions and action. May have volatile emotional responses or difficulty controlling anger.",
            "Moon_Jupiter": "Tension between emotional and philosophical needs. May be overly optimistic or have unrealistic expectations.",
            "Moon_Saturn": "Conflict between emotions and responsibility. May suppress emotions or feel emotionally restricted.",
            "Moon_Uranus": "Tension between emotions and independence. May have unpredictable emotional responses or need emotional freedom.",
            "Moon_Neptune": "Conflict between emotions and spirituality. May be emotionally confused or overly idealistic.",
            "Moon_Pluto": "Tension between emotions and transformation. May have intense emotional experiences or psychological conflicts.",
            "Mercury_Venus": "Conflict between intellect and love. May have difficulty expressing feelings or be overly analytical in relationships.",
            "Mercury_Mars": "Tension between intellect and action. May have difficulty making decisions or be overly aggressive in communication.",
            "Mercury_Jupiter": "Conflict between intellect and beliefs. May be overly optimistic or have difficulty with practical thinking.",
            "Mercury_Saturn": "Tension between intellect and responsibility. May be overly cautious or have difficulty expressing ideas.",
            "Mercury_Uranus": "Conflict between intellect and innovation. May have difficulty with conventional thinking or be overly rebellious.",
            "Mercury_Neptune": "Tension between intellect and intuition. May have difficulty with practical details or be overly idealistic.",
            "Mercury_Pluto": "Conflict between intellect and transformation. May have difficulty with psychological insights or be overly suspicious.",
            "Venus_Mars": "Tension between love and action. May have difficulty balancing relationships with personal goals.",
            "Venus_Jupiter": "Conflict between love and expansion. May be overly generous or have unrealistic expectations in relationships.",
            "Venus_Saturn": "Tension between love and responsibility. May have difficulty expressing affection or feel restricted in relationships.",
            "Venus_Uranus": "Conflict between love and independence. May have unconventional relationships or difficulty with commitment.",
            "Venus_Neptune": "Tension between love and idealism. May have unrealistic expectations or difficulty with boundaries in relationships.",
            "Venus_Pluto": "Conflict between love and transformation. May have intense relationships or difficulty with trust.",
            "Mars_Jupiter": "Tension between action and expansion. May be overly optimistic or have difficulty with practical action.",
            "Mars_Saturn": "Conflict between action and responsibility. May have difficulty taking action or feel restricted by limitations.",
            "Mars_Uranus": "Tension between action and innovation. May have difficulty with conventional approaches or be overly rebellious.",
            "Mars_Neptune": "Conflict between action and idealism. May have difficulty with practical action or be overly idealistic.",
            "Mars_Pluto": "Tension between action and transformation. May have difficulty with power dynamics or be overly aggressive.",
            "Jupiter_Saturn": "Conflict between expansion and limitation. May have difficulty balancing optimism with practicality.",
            "Jupiter_Uranus": "Tension between expansion and innovation. May have difficulty with conventional beliefs or be overly rebellious.",
            "Jupiter_Neptune": "Conflict between expansion and idealism. May have unrealistic expectations or difficulty with practical matters.",
            "Jupiter_Pluto": "Tension between expansion and transformation. May have difficulty with power dynamics or be overly optimistic.",
            "Saturn_Uranus": "Conflict between structure and innovation. May have difficulty with change or be overly rigid.",
            "Saturn_Neptune": "Tension between structure and idealism. May have difficulty with practical matters or be overly idealistic.",
            "Saturn_Pluto": "Conflict between structure and transformation. May have difficulty with change or be overly controlling.",
            "Uranus_Neptune": "Conflict between innovation and idealism. May have difficulty with practical matters or be overly visionary.",
            "Uranus_Pluto": "Conflict between innovation and transformation. May have difficulty with power dynamics or be overly rebellious.",
            "Neptune_Pluto": "Conflict between idealism and transformation. May have difficulty with practical matters or be overly spiritual."
        }
    },
    "Square": {
        "general": "Planets in square create tension and conflict that requires action to resolve. This aspect represents challenges, obstacles, and the need for growth through struggle. It often manifests as internal conflicts or external challenges.",
        "orb": "90° ±8°",
        "nature": "Challenging, requires effort and growth to harmonize",
        "planets": {
            "Sun_Moon": "Internal conflict between ego and emotions. May struggle with self-expression and emotional needs. Important to develop emotional intelligence.",
            "Sun_Mercury": "Conflict between ego and communication. May have difficulty expressing thoughts clearly or feel misunderstood.",
            "Sun_Venus": "Tension between ego and relationships. May struggle with self-worth or have difficulty in romantic relationships.",
            "Sun_Mars": "Conflict between ego and action. May be aggressive or have difficulty asserting oneself appropriately.",
            "Sun_Jupiter": "Tension between ego and expansion. May overestimate abilities or have unrealistic expectations.",
            "Sun_Saturn": "Conflict between ego and limitations. May feel restricted or have difficulty with authority figures.",
            "Sun_Uranus": "Tension between ego and independence. May rebel against authority or struggle with personal freedom.",
            "Sun_Neptune": "Conflict between ego and spirituality. May lose sense of self in idealism or have difficulty with boundaries.",
            "Sun_Pluto": "Tension between ego and transformation. May resist change or struggle with power dynamics.",
            "Moon_Mercury": "Conflict between emotions and intellect. May have difficulty thinking clearly when emotional or suppress emotions.",
            "Moon_Venus": "Tension between emotions and love. May have difficulty finding emotional satisfaction in relationships.",
            "Moon_Mars": "Conflict between emotions and action. May have volatile emotional responses or difficulty controlling anger.",
            "Moon_Jupiter": "Tension between emotions and expansion. May be overly optimistic or have unrealistic emotional expectations.",
            "Moon_Saturn": "Conflict between emotions and responsibility. May suppress emotions or feel emotionally restricted.",
            "Moon_Uranus": "Tension between emotions and independence. May have unpredictable emotional responses or need emotional freedom.",
            "Moon_Neptune": "Conflict between emotions and spirituality. May be emotionally confused or overly idealistic.",
            "Moon_Pluto": "Conflict between emotions and transformation. May have intense emotional experiences or psychological conflicts.",
            "Mercury_Venus": "Conflict between intellect and love. May have difficulty expressing feelings or be overly analytical in relationships.",
            "Mercury_Mars": "Tension between intellect and action. May have difficulty making decisions or be overly aggressive in communication.",
            "Mercury_Jupiter": "Conflict between intellect and expansion. May be overly optimistic or have difficulty with practical thinking.",
            "Mercury_Saturn": "Tension between intellect and limitations. May be overly cautious or have difficulty expressing ideas.",
            "Mercury_Uranus": "Conflict between intellect and innovation. May have difficulty with conventional thinking or be overly rebellious.",
            "Mercury_Neptune": "Tension between intellect and spirituality. May have difficulty with practical details or be overly idealistic.",
            "Mercury_Pluto": "Conflict between intellect and transformation. May have difficulty with psychological insights or be overly suspicious.",
            "Venus_Mars": "Tension between love and action. May have difficulty balancing relationships with personal goals.",
            "Venus_Jupiter": "Conflict between love and expansion. May be overly generous or have unrealistic expectations in relationships.",
            "Venus_Saturn": "Tension between love and limitations. May have difficulty expressing affection or feel restricted in relationships.",
            "Venus_Uranus": "Conflict between love and independence. May have unconventional relationships or difficulty with commitment.",
            "Venus_Neptune": "Tension between love and idealism. May have unrealistic expectations or difficulty with boundaries in relationships.",
            "Venus_Pluto": "Conflict between love and transformation. May have intense relationships or difficulty with trust.",
            "Mars_Jupiter": "Tension between action and expansion. May be overly optimistic or have difficulty with practical action.",
            "Mars_Saturn": "Conflict between action and limitations. May have difficulty taking action or feel restricted by limitations.",
            "Mars_Uranus": "Tension between action and innovation. May have difficulty with conventional approaches or be overly rebellious.",
            "Mars_Neptune": "Conflict between action and idealism. May have difficulty with practical action or be overly idealistic.",
            "Mars_Pluto": "Tension between action and transformation. May have difficulty with power dynamics or be overly aggressive.",
            "Jupiter_Saturn": "Conflict between expansion and limitations. May have difficulty balancing optimism with practicality.",
            "Jupiter_Uranus": "Tension between expansion and innovation. May have difficulty with conventional beliefs or be overly rebellious.",
            "Jupiter_Neptune": "Conflict between expansion and idealism. May have unrealistic expectations or difficulty with practical matters.",
            "Jupiter_Pluto": "Tension between expansion and transformation. May have difficulty with power dynamics or be overly optimistic.",
            "Saturn_Uranus": "Conflict between structure and innovation. May have difficulty with change or be overly rigid.",
            "Saturn_Neptune": "Tension between structure and idealism. May have difficulty with practical matters or be overly idealistic.",
            "Saturn_Pluto": "Conflict between structure and transformation. May have difficulty with change or be overly controlling.",
            "Uranus_Neptune": "Conflict between innovation and idealism. May have difficulty with practical matters or be overly visionary.",
            "Uranus_Pluto": "Conflict between innovation and transformation. May have difficulty with power dynamics or be overly rebellious.",
            "Neptune_Pluto": "Conflict between idealism and transformation. May have difficulty with practical matters or be overly spiritual."
        }
    },
    "Trine": {
        "general": "Planets in trine create harmonious flow and natural talent. This aspect represents ease, talent, and natural abilities. The planets work together effortlessly, creating positive opportunities and natural gifts.",
        "orb": "120° ±8°",
        "nature": "Harmonious, represents natural talents and ease",
        "planets": {
            "Sun_Moon": "Natural harmony between ego and emotions. Strong sense of self with emotional intelligence and authentic expression.",
            "Sun_Mercury": "Natural communication skills and clear thinking. Confident self-expression with sharp intellect.",
            "Sun_Venus": "Natural charm and artistic talent. Easy expression of love and beauty with strong self-worth.",
            "Sun_Mars": "Natural leadership and dynamic energy. Confident action with strong willpower and courage.",
            "Sun_Jupiter": "Natural optimism and generosity. Inspiring leadership with broad vision and philosophical thinking.",
            "Sun_Saturn": "Natural discipline and responsibility. Strong work ethic with practical wisdom and ambition.",
            "Sun_Uranus": "Natural innovation and independence. Original thinking with revolutionary ideas and personal freedom.",
            "Sun_Neptune": "Natural intuition and artistic inspiration. Spiritual awareness with creative imagination and compassion.",
            "Sun_Pluto": "Natural power and psychological insight. Transformative leadership with deep understanding and influence.",
            "Moon_Mercury": "Natural emotional intelligence and intuitive communication. Empathetic understanding with clear emotional expression.",
            "Moon_Venus": "Natural emotional harmony and artistic sensitivity. Beautiful emotional expression with strong nurturing qualities.",
            "Moon_Mars": "Natural emotional courage and protective instincts. Strong emotional responses with passionate action.",
            "Moon_Jupiter": "Natural emotional optimism and generosity. Nurturing wisdom with emotional abundance and growth.",
            "Moon_Saturn": "Natural emotional discipline and responsibility. Stable emotions with practical nurturing and wisdom.",
            "Moon_Uranus": "Natural emotional independence and intuition. Innovative emotional responses with freedom and insight.",
            "Moon_Neptune": "Natural emotional sensitivity and spiritual intuition. Compassionate emotions with artistic and spiritual awareness.",
            "Moon_Pluto": "Natural emotional depth and psychological insight. Powerful emotional transformation with deep understanding.",
            "Mercury_Venus": "Natural artistic communication and social charm. Beautiful expression with harmonious thinking and relationships.",
            "Mercury_Mars": "Natural quick thinking and assertive communication. Sharp intellect with confident and direct expression.",
            "Mercury_Jupiter": "Natural philosophical thinking and optimistic communication. Broad perspective with inspiring and generous expression.",
            "Mercury_Saturn": "Natural practical thinking and careful communication. Methodical approach with reliable and responsible expression.",
            "Mercury_Uranus": "Natural innovative thinking and original communication. Creative ideas with unique and inspiring expression.",
            "Mercury_Neptune": "Natural intuitive thinking and artistic communication. Creative imagination with spiritual and compassionate expression.",
            "Mercury_Pluto": "Natural penetrating intellect and psychological insight. Deep analysis with powerful and transformative expression.",
            "Venus_Mars": "Natural passionate love and artistic drive. Harmonious relationships with creative and dynamic energy.",
            "Venus_Jupiter": "Natural generous love and artistic abundance. Beautiful relationships with optimistic and expansive energy.",
            "Venus_Saturn": "Natural serious approach to love and beauty. Stable relationships with practical and responsible energy.",
            "Venus_Uranus": "Natural unconventional love and artistic innovation. Unique relationships with creative and independent energy.",
            "Venus_Neptune": "Natural romantic idealism and artistic inspiration. Spiritual relationships with compassionate and idealistic energy.",
            "Venus_Pluto": "Natural intense love and artistic transformation. Powerful relationships with deep and transformative energy.",
            "Mars_Jupiter": "Natural optimistic action and generous energy. Dynamic leadership with enthusiastic and expansive energy.",
            "Mars_Saturn": "Natural disciplined action and patient energy. Practical action with persistent and responsible energy.",
            "Mars_Uranus": "Natural revolutionary action and innovative energy. Dynamic innovation with independent and creative energy.",
            "Mars_Neptune": "Natural inspired action and spiritual energy. Creative action with compassionate and idealistic energy.",
            "Mars_Pluto": "Natural intense action and transformative energy. Powerful action with deep and influential energy.",
            "Jupiter_Saturn": "Natural balanced optimism and discipline. Practical wisdom with responsible and expansive energy.",
            "Jupiter_Uranus": "Natural revolutionary wisdom and innovative philosophy. Progressive thinking with independent and inspiring energy.",
            "Jupiter_Neptune": "Natural spiritual wisdom and idealistic vision. Compassionate leadership with spiritual and generous energy.",
            "Jupiter_Pluto": "Natural transformative wisdom and psychological insight. Deep understanding with powerful and influential energy.",
            "Saturn_Uranus": "Natural disciplined innovation and structured change. Practical innovation with responsible and independent energy.",
            "Saturn_Neptune": "Natural disciplined spirituality and practical idealism. Spiritual wisdom with practical and compassionate energy.",
            "Saturn_Pluto": "Natural disciplined transformation and structured power. Practical transformation with responsible and influential energy.",
            "Uranus_Neptune": "Natural revolutionary spirituality and innovative ideals. Visionary thinking with independent and spiritual energy.",
            "Uranus_Pluto": "Natural revolutionary transformation and innovative power. Dynamic transformation with independent and influential energy.",
            "Neptune_Pluto": "Natural spiritual transformation and idealistic power. Deep spiritual evolution with compassionate and influential energy."
        }
    },
    "Sextile": {
        "general": "Planets in sextile create opportunities and harmonious connections. This aspect represents potential, cooperation, and positive relationships. The planets work well together, creating favorable circumstances and natural talents.",
        "orb": "60° ±6°",
        "nature": "Harmonious, represents opportunities and cooperation",
        "planets": {
            "Sun_Moon": "Opportunities for emotional self-expression. Natural ability to balance ego and emotions with authentic communication.",
            "Sun_Mercury": "Opportunities for clear communication and self-expression. Natural talent for expressing thoughts and ideas confidently.",
            "Sun_Venus": "Opportunities for artistic expression and relationships. Natural charm and ability to create beauty and harmony.",
            "Sun_Mars": "Opportunities for confident action and leadership. Natural energy and ability to take initiative and lead others.",
            "Sun_Jupiter": "Opportunities for growth and expansion. Natural optimism and ability to inspire and motivate others.",
            "Sun_Saturn": "Opportunities for achievement and responsibility. Natural discipline and ability to work hard and succeed.",
            "Sun_Uranus": "Opportunities for innovation and independence. Natural originality and ability to think outside the box.",
            "Sun_Neptune": "Opportunities for spiritual growth and creativity. Natural intuition and ability to connect with higher consciousness.",
            "Sun_Pluto": "Opportunities for transformation and power. Natural ability to influence others and create meaningful change.",
            "Moon_Mercury": "Opportunities for emotional communication and understanding. Natural empathy and ability to connect with others emotionally.",
            "Moon_Venus": "Opportunities for emotional harmony and artistic expression. Natural nurturing abilities and appreciation for beauty.",
            "Moon_Mars": "Opportunities for emotional courage and protection. Natural instincts and ability to defend and care for others.",
            "Moon_Jupiter": "Opportunities for emotional growth and wisdom. Natural nurturing wisdom and ability to help others grow.",
            "Moon_Saturn": "Opportunities for emotional stability and responsibility. Natural emotional maturity and ability to provide security.",
            "Moon_Uranus": "Opportunities for emotional independence and intuition. Natural emotional insight and ability to break free from limitations.",
            "Moon_Neptune": "Opportunities for spiritual connection and compassion. Natural emotional sensitivity and ability to heal others.",
            "Moon_Pluto": "Opportunities for emotional transformation and depth. Natural psychological insight and ability to understand others deeply.",
            "Mercury_Venus": "Opportunities for artistic communication and social skills. Natural charm and ability to express beauty through words.",
            "Mercury_Mars": "Opportunities for assertive communication and quick thinking. Natural wit and ability to think and speak quickly.",
            "Mercury_Jupiter": "Opportunities for philosophical communication and teaching. Natural wisdom and ability to share knowledge effectively.",
            "Mercury_Saturn": "Opportunities for practical communication and learning. Natural discipline and ability to master skills through study.",
            "Mercury_Uranus": "Opportunities for innovative communication and original ideas. Natural creativity and ability to think unconventionally.",
            "Mercury_Neptune": "Opportunities for intuitive communication and artistic expression. Natural imagination and ability to express spiritual ideas.",
            "Mercury_Pluto": "Opportunities for deep communication and psychological insight. Natural ability to uncover hidden truths and influence others.",
            "Venus_Mars": "Opportunities for passionate relationships and creative expression. Natural charm and ability to attract and inspire others.",
            "Venus_Jupiter": "Opportunities for generous relationships and artistic success. Natural abundance and ability to create beauty and harmony.",
            "Venus_Saturn": "Opportunities for stable relationships and artistic discipline. Natural patience and ability to build lasting relationships.",
            "Venus_Uranus": "Opportunities for unique relationships and artistic innovation. Natural originality and ability to create unconventional beauty.",
            "Venus_Neptune": "Opportunities for spiritual relationships and artistic inspiration. Natural idealism and ability to create transcendent beauty.",
            "Venus_Pluto": "Opportunities for intense relationships and artistic transformation. Natural power and ability to create deeply meaningful art.",
            "Mars_Jupiter": "Opportunities for enthusiastic action and leadership. Natural energy and ability to inspire others to take action.",
            "Mars_Saturn": "Opportunities for disciplined action and achievement. Natural persistence and ability to work hard and succeed.",
            "Mars_Uranus": "Opportunities for innovative action and independence. Natural drive and ability to break new ground and lead change.",
            "Mars_Neptune": "Opportunities for inspired action and spiritual service. Natural compassion and ability to help others through action.",
            "Mars_Pluto": "Opportunities for powerful action and transformation. Natural intensity and ability to create meaningful change.",
            "Jupiter_Saturn": "Opportunities for balanced growth and achievement. Natural wisdom and ability to combine optimism with practicality.",
            "Jupiter_Uranus": "Opportunities for progressive growth and innovation. Natural vision and ability to create positive social change.",
            "Jupiter_Neptune": "Opportunities for spiritual growth and compassion. Natural idealism and ability to help humanity through wisdom.",
            "Jupiter_Pluto": "Opportunities for transformative growth and influence. Natural power and ability to create meaningful social change.",
            "Saturn_Uranus": "Opportunities for structured innovation and change. Natural ability to create practical solutions to complex problems.",
            "Saturn_Neptune": "Opportunities for practical spirituality and service. Natural ability to manifest spiritual ideals in the material world.",
            "Saturn_Pluto": "Opportunities for structured transformation and power. Natural ability to create lasting change through discipline.",
            "Uranus_Neptune": "Opportunities for visionary innovation and spiritual progress. Natural ability to create revolutionary spiritual change.",
            "Uranus_Pluto": "Opportunities for revolutionary transformation and power. Natural ability to create powerful social and personal change.",
            "Neptune_Pluto": "Opportunities for spiritual transformation and collective evolution. Natural ability to create deep spiritual and social change."
        }
    },
    "Quincunx": {
        "general": "Planets in quincunx create tension that requires adjustment and adaptation. This aspect represents health issues, work challenges, and the need to integrate seemingly incompatible energies. It often manifests as health concerns or work-life balance issues.",
        "orb": "150° ±3°",
        "nature": "Challenging, requires adjustment and adaptation",
        "planets": {
            "Sun_Moon": "Tension between ego and emotional needs affecting health. May struggle with work-life balance or emotional well-being.",
            "Sun_Mercury": "Communication challenges affecting self-expression. May have difficulty expressing thoughts clearly or feel misunderstood.",
            "Sun_Venus": "Relationship challenges affecting self-worth. May struggle with love and beauty or have difficulty in romantic relationships.",
            "Sun_Mars": "Action challenges affecting confidence. May have difficulty asserting oneself or taking appropriate action.",
            "Sun_Jupiter": "Growth challenges affecting optimism. May struggle with expansion or have unrealistic expectations.",
            "Sun_Saturn": "Responsibility challenges affecting ego. May feel restricted or have difficulty with authority figures.",
            "Sun_Uranus": "Independence challenges affecting self-expression. May rebel against authority or struggle with personal freedom.",
            "Sun_Neptune": "Spiritual challenges affecting ego. May lose sense of self in idealism or have difficulty with boundaries.",
            "Sun_Pluto": "Transformation challenges affecting ego. May resist change or struggle with power dynamics.",
            "Moon_Mercury": "Emotional communication challenges. May have difficulty thinking clearly when emotional or suppress emotions.",
            "Moon_Venus": "Emotional relationship challenges. May have difficulty finding emotional satisfaction in relationships.",
            "Moon_Mars": "Emotional action challenges. May have volatile emotional responses or difficulty controlling anger.",
            "Moon_Jupiter": "Emotional growth challenges. May be overly optimistic or have unrealistic emotional expectations.",
            "Moon_Saturn": "Emotional responsibility challenges. May suppress emotions or feel emotionally restricted.",
            "Moon_Uranus": "Emotional independence challenges. May have unpredictable emotional responses or need emotional freedom.",
            "Moon_Neptune": "Emotional spiritual challenges. May be emotionally confused or overly idealistic.",
            "Moon_Pluto": "Emotional transformation challenges. May have intense emotional experiences or psychological conflicts.",
            "Mercury_Venus": "Intellectual relationship challenges. May have difficulty expressing feelings or be overly analytical in relationships.",
            "Mercury_Mars": "Intellectual action challenges. May have difficulty making decisions or be overly aggressive in communication.",
            "Mercury_Jupiter": "Intellectual growth challenges. May be overly optimistic or have difficulty with practical thinking.",
            "Mercury_Saturn": "Intellectual responsibility challenges. May be overly cautious or have difficulty expressing ideas.",
            "Mercury_Uranus": "Intellectual independence challenges. May have difficulty with conventional thinking or be overly rebellious.",
            "Mercury_Neptune": "Intellectual spiritual challenges. May have difficulty with practical details or be overly idealistic.",
            "Mercury_Pluto": "Intellectual transformation challenges. May have difficulty with psychological insights or be overly suspicious.",
            "Venus_Mars": "Relationship action challenges. May have difficulty balancing relationships with personal goals.",
            "Venus_Jupiter": "Relationship growth challenges. May be overly generous or have unrealistic expectations in relationships.",
            "Venus_Saturn": "Relationship responsibility challenges. May have difficulty expressing affection or feel restricted in relationships.",
            "Venus_Uranus": "Relationship independence challenges. May have unconventional relationships or difficulty with commitment.",
            "Venus_Neptune": "Relationship spiritual challenges. May have unrealistic expectations or difficulty with boundaries in relationships.",
            "Venus_Pluto": "Relationship transformation challenges. May have intense relationships or difficulty with trust.",
            "Mars_Jupiter": "Action growth challenges. May be overly optimistic or have difficulty with practical action.",
            "Mars_Saturn": "Action responsibility challenges. May have difficulty taking action or feel restricted by limitations.",
            "Mars_Uranus": "Action independence challenges. May have difficulty with conventional approaches or be overly rebellious.",
            "Mars_Neptune": "Action spiritual challenges. May have difficulty with practical action or be overly idealistic.",
            "Mars_Pluto": "Action transformation challenges. May have difficulty with power dynamics or be overly aggressive.",
            "Jupiter_Saturn": "Growth responsibility challenges. May have difficulty balancing optimism with practicality.",
            "Jupiter_Uranus": "Growth independence challenges. May have difficulty with conventional beliefs or be overly rebellious.",
            "Jupiter_Neptune": "Growth spiritual challenges. May have unrealistic expectations or difficulty with practical matters.",
            "Jupiter_Pluto": "Growth transformation challenges. May have difficulty with power dynamics or be overly optimistic.",
            "Saturn_Uranus": "Responsibility independence challenges. May have difficulty with change or be overly rigid.",
            "Saturn_Neptune": "Responsibility spiritual challenges. May have difficulty with practical matters or be overly idealistic.",
            "Saturn_Pluto": "Responsibility transformation challenges. May have difficulty with change or be overly controlling.",
            "Uranus_Neptune": "Independence spiritual challenges. May have difficulty with practical matters or be overly visionary.",
            "Uranus_Pluto": "Independence transformation challenges. May have difficulty with power dynamics or be overly rebellious.",
            "Neptune_Pluto": "Spiritual transformation challenges. May have difficulty with practical matters or be overly spiritual."
        }
    }

};

export const PLANET_INTERPRETATIONS: Record<string, PlanetInterpretation> = {
    "Sun": {
        "description": "Core identity, ego, life purpose, father, authority figures, creative expression. The Sun represents your core identity, ego, and life purpose. It shows how you express your fundamental self and what drives you at the deepest level. The Sun is associated with the father figure and represents your conscious mind and willpower.",
        "keywords": ["Identity", "Ego", "Purpose", "Father", "Authority", "Creativity", "Leadership", "Vitality", "Self-expression", "Life direction", "Personal power"]
    },
    "Moon": {
        "description": "Emotions, intuition, mother, home, family, subconscious, nurturing, emotional needs. The Moon represents your emotional nature, intuition, and subconscious mind. It shows how you process feelings, your need for security, and your relationship with the mother figure. The Moon governs your inner world and emotional responses.",
        "keywords": ["Emotions", "Intuition", "Mother", "Home", "Family", "Subconscious", "Nurturing", "Security", "Emotional security", "Maternal instincts", "Emotional patterns"]
    },
    "Mercury": {
        "description": "Communication, thinking, learning, siblings, short trips, technology, nervous system. Mercury represents your communication style, thinking patterns, and how you process information. It governs learning, short trips, and your relationship with siblings. Mercury shows how you express ideas and connect with others mentally.",
        "keywords": ["Communication", "Thinking", "Learning", "Siblings", "Travel", "Technology", "Intellect", "Curiosity", "Intellectual pursuits", "Adaptability", "Mental agility"]
    },
    "Venus": {
        "description": "Love, beauty, relationships, art, values, harmony, pleasure, social grace. Venus represents your approach to love, beauty, and what you value. It governs relationships, artistic expression, and your sense of aesthetics. Venus shows how you attract and relate to others, and what brings you pleasure and satisfaction.",
        "keywords": ["Love", "Beauty", "Relationships", "Art", "Values", "Harmony", "Pleasure", "Grace", "Romance", "Artistic expression", "Aesthetics"]
    },
    "Mars": {
        "description": "Action, energy, aggression, courage, sexuality, competition, drive, physical energy. Mars represents your energy, drive, and how you take action. It governs your courage, sexuality, and competitive nature. Mars shows how you assert yourself, pursue goals, and handle conflict or challenges.",
        "keywords": ["Action", "Energy", "Aggression", "Courage", "Sexuality", "Competition", "Drive", "Strength", "Physical energy", "Protection", "Leadership"]
    },
    "Jupiter": {
        "description": "Expansion, wisdom, philosophy, religion, higher education, travel, optimism, generosity. Jupiter represents expansion, wisdom, and your quest for meaning. It governs higher learning, philosophy, travel, and your sense of optimism. Jupiter shows how you grow, learn, and find abundance in life.",
        "keywords": ["Expansion", "Wisdom", "Philosophy", "Religion", "Education", "Travel", "Optimism", "Generosity", "Personal growth", "Abundance", "Higher learning"]
    },
    "Saturn": {
        "description": "Discipline, responsibility, limitations, structure, authority, time, karma, lessons. Saturn represents structure, responsibility, and the lessons you must learn. It governs discipline, authority figures, and the areas where you face challenges. Saturn shows where you need to work hard and build lasting foundations.",
        "keywords": ["Discipline", "Responsibility", "Limitations", "Structure", "Authority", "Time", "Karma", "Lessons", "Structure", "Authority", "Time"]
    },
    "Uranus": {
        "description": "Innovation, rebellion, independence, sudden change, technology, originality, freedom. Uranus represents innovation, freedom, and sudden change. It governs your unique individuality, revolutionary ideas, and connection to collective consciousness. Uranus brings unexpected breakthroughs and liberates you from limitations.",
        "keywords": ["Innovation", "Rebellion", "Independence", "Change", "Technology", "Originality", "Freedom", "Revolution", "Individuality", "Awakening", "Visionary abilities"]
    },
    "Neptune": {
        "description": "Spirituality, dreams, illusions, compassion, idealism, confusion, inspiration, mysticism. Neptune represents spirituality, inspiration, and the dissolution of boundaries. It governs your connection to the divine, artistic inspiration, and your capacity for compassion. Neptune can bring both transcendence and confusion.",
        "keywords": ["Spirituality", "Dreams", "Illusions", "Compassion", "Idealism", "Confusion", "Inspiration", "Mysticism", "Artistic expression", "Healing abilities", "Intuition"]
    },
    "Pluto": {
        "description": "Transformation, power, death, rebirth, psychology, control, intensity, regeneration. Pluto represents deep transformation, power dynamics, and psychological evolution. It governs death and rebirth, shared resources, and your capacity for profound change. Pluto brings intense experiences that force you to confront your deepest fears and desires.",
        "keywords": ["Transformation", "Power", "Death", "Rebirth", "Psychology", "Control", "Intensity", "Regeneration", "Psychological insight", "Resilience", "Deep understanding"]
    },
    "Node": {
        "description": "Karmic path, soul purpose, destiny, life lessons, spiritual growth, past and future connections. The North Node represents your soul's evolutionary path and the qualities you're developing in this lifetime. It shows your destiny and the direction of your spiritual growth.",
        "keywords": ["Karma", "Destiny", "Soul Purpose", "Life Lessons", "Spiritual Growth", "Past Life", "Future Path", "Evolution", "Soul development", "Life direction"]
    },
    "Lilith": {
        "description": "Dark feminine energy, independence, rebellion, sexuality, hidden desires, primal instincts. Lilith represents your dark feminine energy, primal instincts, and the parts of yourself that society may have suppressed. It shows your authentic power and what you refuse to compromise.",
        "keywords": ["Dark Feminine", "Independence", "Rebellion", "Sexuality", "Hidden Desires", "Primal Energy", "Taboo", "Authentic power", "Uncompromising", "Primal instincts"]
    },
    "Chiron": {
        "description": "Wounded healer, deep wounds, healing abilities, mentorship, wisdom through pain, spiritual teaching. Chiron represents your deepest wound and your greatest gift. It shows where you've experienced pain and how you can help others heal through your own healing journey.",
        "keywords": ["Wounded Healer", "Deep Wounds", "Healing", "Mentorship", "Wisdom", "Pain", "Teaching", "Healing abilities", "Compassion", "Spiritual teaching"]
    },
    "Fortune": {
        "description": "Luck, prosperity, abundance, life purpose, material success, fortunate circumstances. The Part of Fortune represents where you find luck, abundance, and fulfillment in life. It shows the areas where you naturally thrive and find success.",
        "keywords": ["Luck", "Prosperity", "Abundance", "Life Purpose", "Material Success", "Fortunate", "Opportunity", "Fulfillment", "Natural talents", "Success areas"]
    },
    "Vertex": {
        "description": "Fated encounters, destiny points, significant relationships, karmic connections, life-changing meetings. The Vertex represents fated encounters and significant relationships that are destined to occur. It shows karmic connections and life-changing meetings.",
        "keywords": ["Fated Encounters", "Destiny Points", "Relationships", "Karmic Connections", "Life Changes", "Significant Others", "Fate", "Destined meetings", "Karmic relationships"]
    },
    "ASC": {
        "description": "Ascendant, rising sign, first impressions, physical appearance, approach to life, outer personality. The Ascendant represents your outer personality, how you present yourself to the world, and your physical appearance. It's often called your 'rising sign' and represents your first impression on others.",
        "keywords": ["Ascendant", "Rising Sign", "First Impressions", "Appearance", "Approach", "Outer Self", "Physical presentation", "Personality mask", "Life approach"]
    },
    "MC": {
        "description": "Midheaven, career, public image, life goals, reputation, authority, highest aspirations. The Midheaven represents your career path, public reputation, and life goals. It shows your ambitions, achievements, and how you want to be seen by the world.",
        "keywords": ["Midheaven", "Career", "Public Image", "Life Goals", "Reputation", "Authority", "Aspirations", "Professional calling", "Public achievement", "Life direction"]
    },
    "DSC": {
        "description": "Descendant, partnerships, relationships, open enemies, what we seek in others, balance. The Descendant represents your relationships, partnerships, and what you seek in others. It shows the qualities you're attracted to in partners and the type of people you form close relationships with.",
        "keywords": ["Descendant", "Partnerships", "Relationships", "Enemies", "Balance", "Others", "Complement", "Relationship needs", "Partner qualities", "Relationship dynamics"]
    },
    "IC": {
        "description": "Imum Coeli, home, family, roots, private life, emotional foundation, innermost self. The Imum Coeli represents your home, family, roots, and private life. It shows your deepest emotional needs, your relationship with family, and your sense of security.",
        "keywords": ["Imum Coeli", "Home", "Family", "Roots", "Private Life", "Foundation", "Innermost Self", "Emotional foundation", "Family connections", "Private world"]
    }
}

// Specific planet combinations and their meanings for transits
export const PLANET_COMBINATIONS: Record<string, string> = {
    'Sun-Moon': 'Aspects between Sun and Moon highlight the relationship between conscious and unconscious, ego and emotions.',
    'Sun-Mercury': 'Mental clarity and communication are emphasized, especially regarding self-expression.',
    'Sun-Venus': 'Relationships, values, and self-worth come into focus.',
    'Sun-Mars': 'Energy, initiative, and personal drive are highlighted.',
    'Sun-Jupiter': 'Expansion, growth, and optimism are emphasized.',
    'Sun-Saturn': 'Structure, responsibility, and limitations are highlighted.',
    'Sun-Uranus': 'Sudden changes, innovation, and individuality are emphasized.',
    'Sun-Neptune': 'Intuition, creativity, and spiritual awareness are highlighted.',
    'Sun-Pluto': 'Transformation, power, and deep psychological processes are emphasized.',

    'Moon-Mercury': 'Emotional communication and intuitive thinking are highlighted.',
    'Moon-Venus': 'Emotional relationships and values are emphasized.',
    'Moon-Mars': 'Emotional drive and assertiveness come into focus.',
    'Moon-Jupiter': 'Emotional growth and optimism are highlighted.',
    'Moon-Saturn': 'Emotional maturity and responsibility are emphasized.',
    'Moon-Uranus': 'Emotional changes and breakthroughs are highlighted.',
    'Moon-Neptune': 'Emotional sensitivity and spiritual awareness are emphasized.',
    'Moon-Pluto': 'Emotional transformation and deep psychological processes are highlighted.',

    'Mercury-Venus': 'Communication in relationships and artistic expression are emphasized.',
    'Mercury-Mars': 'Mental energy and assertive communication are highlighted.',
    'Mercury-Jupiter': 'Expansive thinking and learning opportunities are emphasized.',
    'Mercury-Saturn': 'Practical thinking and structured communication are highlighted.',
    'Mercury-Uranus': 'Innovative thinking and sudden insights are emphasized.',
    'Mercury-Neptune': 'Intuitive thinking and creative communication are highlighted.',
    'Mercury-Pluto': 'Deep psychological insights and transformative communication are emphasized.',

    'Venus-Mars': 'Passion, relationships, and creative energy are highlighted.',
    'Venus-Jupiter': 'Expansion in relationships and abundance are emphasized.',
    'Venus-Saturn': 'Commitment and responsibility in relationships are highlighted.',
    'Venus-Uranus': 'Sudden changes in relationships and freedom are emphasized.',
    'Venus-Neptune': 'Romantic idealism and spiritual love are highlighted.',
    'Venus-Pluto': 'Intense relationships and transformation through love are emphasized.',

    'Mars-Jupiter': 'Expansive action and growth through initiative are highlighted.',
    'Mars-Saturn': 'Disciplined action and responsibility are emphasized.',
    'Mars-Uranus': 'Sudden action and unexpected changes are highlighted.',
    'Mars-Neptune': 'Intuitive action and spiritual energy are emphasized.',
    'Mars-Pluto': 'Transformative action and power dynamics are highlighted.',

    'Jupiter-Saturn': 'Balance between expansion and limitation is emphasized.',
    'Jupiter-Uranus': 'Sudden growth and unexpected opportunities are highlighted.',
    'Jupiter-Neptune': 'Spiritual growth and idealistic expansion are emphasized.',
    'Jupiter-Pluto': 'Transformative growth and power expansion are highlighted.',

    'Saturn-Uranus': 'Balance between tradition and innovation is emphasized.',
    'Saturn-Neptune': 'Structure in spiritual matters and practical idealism are highlighted.',
    'Saturn-Pluto': 'Transformative structure and power through responsibility are emphasized.',

    'Uranus-Neptune': 'Innovation in spiritual matters and collective change are highlighted.',
    'Uranus-Pluto': 'Revolutionary transformation and collective power are emphasized.',

    'Neptune-Pluto': 'Spiritual transformation and collective evolution are emphasized.'
};

export const PLANET_IN_SIGN_INTERPRETATIONS = {
    "Sun": {
        "Aries": "With the Sun in Aries, your core identity is assertive, pioneering, and courageous. You are driven by a need to initiate and lead, and you approach life with enthusiasm and directness. You are independent and competitive, but can sometimes be impulsive or impatient.",
        "Taurus": "With the Sun in Taurus, your core identity is grounded, stable, and sensual. You seek security and comfort, and you are known for your patience, determination, and loyalty. You have a deep appreciation for beauty and the material world, but can be stubborn and resistant to change.",
        "Gemini": "With the Sun in Gemini, your core identity is curious, communicative, and adaptable. You are a natural-born learner and social connector, driven by a desire for variety and mental stimulation. You are witty and versatile, but can sometimes be scattered or inconsistent.",
        "Cancer": "With the Sun in Cancer, your core identity is nurturing, sensitive, and protective. You are deeply connected to your emotions, family, and home. You are compassionate and intuitive, but can be moody or defensive when you feel insecure.",
        "Leo": "With the Sun in Leo, your core identity is confident, creative, and generous. You are a natural leader with a flair for the dramatic, and you thrive in the spotlight. You are warm-hearted and loyal, but can be proud or attention-seeking.",
        "Virgo": "With the Sun in Virgo, your core identity is practical, analytical, and service-oriented. You have a keen eye for detail and a desire to be helpful and efficient. You are diligent and methodical, but can be overly critical of yourself and others.",
        "Libra": "With the Sun in Libra, your core identity is focused on harmony, justice, and relationships. You are a natural diplomat, driven by a need for balance and fairness. You are charming and sociable, but can be indecisive or people-pleasing.",
        "Scorpio": "With the Sun in Scorpio, your core identity is intense, passionate, and perceptive. You are drawn to the deeper mysteries of life and have a powerful, transformative presence. You are loyal and resourceful, but can be secretive or controlling.",
        "Sagittarius": "With the Sun in Sagittarius, your core identity is optimistic, adventurous, and philosophical. You are a truth-seeker, driven by a desire for freedom and expansion. You are open-minded and enthusiastic, but can be blunt or restless.",
        "Capricorn": "With the Sun in Capricorn, your core identity is disciplined, ambitious, and responsible. You are a natural strategist, driven by a need for achievement and long-term security. You are patient and determined, but can be pessimistic or overly conventional.",
        "Aquarius": "With the Sun in Aquarius, your core identity is innovative, independent, and humanitarian. You are a forward-thinker, driven by a desire for social progress and intellectual freedom. You are original and idealistic, but can be emotionally detached or rebellious.",
        "Pisces": "With the Sun in Pisces, your core identity is compassionate, intuitive, and artistic. You are deeply connected to the spiritual and emotional realms, and you are a natural dreamer. You are empathetic and imaginative, but can be escapist or easily overwhelmed."
    },
    "Moon": {
        "Aries": "With the Moon in Aries, your emotional responses are quick, direct, and passionate. You need excitement and independence to feel secure, and you are not afraid to take emotional risks. You can be impulsive and have a quick temper.",
        "Taurus": "With the Moon in Taurus, your emotional nature is calm, stable, and seeks security. You find comfort in the familiar, and you need physical and material stability to feel emotionally content. You are loyal but can be possessive.",
        "Gemini": "With the Moon in Gemini, your emotions are processed intellectually and expressed verbally. You need variety and mental stimulation to feel emotionally satisfied, and you enjoy talking about your feelings. You can seem emotionally detached at times.",
        "Cancer": "With the Moon in Cancer, its natural home, your emotions are deep, powerful, and intuitive. You are highly sensitive and need a strong sense of emotional security, often found through home and family. You are nurturing and protective.",
        "Leo": "With the Moon in Leo, your emotional expression is dramatic, warm, and generous. You need to feel appreciated and admired to be emotionally happy, and you are loyal and affectionate with loved ones. You can be proud and have a need for attention.",
        "Virgo": "With the Moon in Virgo, your emotional nature is practical, analytical, and reserved. You show care through acts of service and by being helpful. You need order and routine to feel emotionally secure, and can be self-critical.",
        "Libra": "With the Moon in Libra, you have a strong need for harmony and balance in your emotional life and relationships. You are a natural peacemaker and feel most secure when in a partnership. You may avoid conflict to maintain peace.",
        "Scorpio": "With the Moon in Scorpio, your emotions are intense, passionate, and secretive. You form deep emotional bonds and have a powerful need for emotional honesty. You can be prone to jealousy and have a fear of betrayal.",
        "Sagittarius": "With the Moon in Sagittarius, your emotional nature is optimistic, freedom-loving, and adventurous. You need space and new experiences to feel emotionally fulfilled. You are good-humored but can be uncomfortable with deep emotional displays.",
        "Capricorn": "With the Moon in Capricorn, your emotional responses are disciplined, controlled, and serious. You seek security through achievement and responsibility. You may have difficulty expressing your feelings openly and can appear emotionally reserved.",
        "Aquarius": "With the Moon in Aquarius, your emotional nature is detached, independent, and humanitarian. You are more comfortable with group feelings than with personal ones. You need intellectual freedom and may seem aloof or emotionally unavailable.",
        "Pisces": "With the Moon in Pisces, you are highly sensitive, compassionate, and intuitive. Your emotional boundaries can be blurry, making you empathetic but also easily influenced by the moods of others. You have a rich inner world."
    },
    "Mercury": {
        "Aries": "With Mercury in Aries, your communication style is direct, quick, and sometimes impulsive. You are a fast thinker and a decisive speaker, often eager to share new ideas. You can be assertive in your opinions, but may also be prone to interrupting or being blunt.",
        "Taurus": "With Mercury in Taurus, your communication is thoughtful, steady, and practical. You take your time to process information and form opinions, and once you do, you are quite fixed in your views. You express yourself clearly and prefer concrete facts.",
        "Gemini": "With Mercury in Gemini, your communication is highly versatile, curious, and quick-witted. You love to learn, gather information, and engage in diverse conversations. You are adaptable in your thinking but can sometimes be scattered or superficial.",
        "Cancer": "With Mercury in Cancer, your communication is emotionally driven, intuitive, and sensitive. You process information through your feelings and tend to communicate with warmth and empathy. You may be hesitant to express yourself directly if you feel insecure.",
        "Leo": "With Mercury in Leo, your communication is expressive, confident, and dramatic. You enjoy being heard and can be quite persuasive and entertaining in your speech. You are proud of your ideas and love to inspire others.",
        "Virgo": "With Mercury in Virgo, your communication is analytical, precise, and practical. You have a sharp eye for detail and a logical approach to problem-solving. You are an effective communicator who values clarity and accuracy, but can be overly critical.",
        "Libra": "With Mercury in Libra, your communication is diplomatic, fair, and charming. You strive for balance and harmony in your interactions, often weighing all sides of an issue. You are a good listener and seek consensus, but can be indecisive.",
        "Scorpio": "With Mercury in Scorpio, your communication is intense, penetrating, and perceptive. You are drawn to hidden meanings and can uncover truths others miss. You are a powerful speaker and can be secretive or strategic in your words.",
        "Sagittarius": "With Mercury in Sagittarius, your communication is broad-minded, optimistic, and philosophical. You love to explore big ideas and share your beliefs with enthusiasm. You can be blunt or tactless in your honesty, but your intentions are usually good.",
        "Capricorn": "With Mercury in Capricorn, your communication is disciplined, logical, and practical. You have a serious and methodical approach to thinking and speaking, valuing structure and efficiency. You are a clear and authoritative communicator.",
        "Aquarius": "With Mercury in Aquarius, your communication is innovative, intellectual, and independent. You enjoy discussing abstract concepts and challenging conventional thinking. You are original in your ideas but can sometimes be detached or dogmatic.",
        "Pisces": "With Mercury in Pisces, your communication is intuitive, imaginative, and empathetic. You process information through your feelings and impressions, often expressing yourself through creative means. You can be vague or elusive, but deeply compassionate."
    },
    "Venus": {
        "Aries": "With Venus in Aries, you express love and affection in a direct, passionate, and spontaneous way. You are attracted to excitement and often initiate romantic pursuits. You can be impulsive in relationships and value independence.",
        "Taurus": "With Venus in Taurus, you express love and affection in a sensual, loyal, and stable manner. You seek comfort, security, and beauty in your relationships. You are deeply affectionate and value material pleasures and fidelity.",
        "Gemini": "With Venus in Gemini, you express love and affection through communication, intellect, and variety. You are attracted to witty and mentally stimulating partners. You enjoy playful banter and need mental connection in relationships.",
        "Cancer": "With Venus in Cancer, you express love and affection in a nurturing, sensitive, and protective way. You seek emotional security and deep connection in your relationships, often forming strong bonds with family and home. You are highly empathetic.",
        "Leo": "With Venus in Leo, you express love and affection in a dramatic, generous, and warm-hearted manner. You love to be admired and show your affection grandly. You seek passion and loyalty, and enjoy being the center of attention in relationships.",
        "Virgo": "With Venus in Virgo, you express love and affection through acts of service, practicality, and attention to detail. You show care by being helpful and reliable. You are attracted to intelligence and efficiency, but can be critical of yourself and others in love.",
        "Libra": "With Venus in Libra, its natural home, you express love and affection in a harmonious, diplomatic, and aesthetically pleasing way. You thrive in partnerships and seek balance and fairness in all relationships. You are charming and seek equality.",
        "Scorpio": "With Venus in Scorpio, you express love and affection with intensity, passion, and depth. You seek profound emotional and physical intimacy, and are drawn to transformative relationships. You can be possessive and secretive in love.",
        "Sagittarius": "With Venus in Sagittarius, you express love and affection in an adventurous, optimistic, and freedom-loving way. You are attracted to partners who share your desire for exploration and growth. You value honesty and open-mindedness in relationships.",
        "Capricorn": "With Venus in Capricorn, you express love and affection in a reserved, responsible, and practical manner. You approach relationships seriously and seek long-term commitment and security. You value loyalty and respect, and can be slow to open up.",
        "Aquarius": "With Venus in Aquarius, you express love and affection in an independent, unconventional, and intellectual way. You are attracted to unique and stimulating individuals. You value friendship and mental connection in relationships, often preferring platonic bonds.",
        "Pisces": "With Venus in Pisces, you express love and affection in a compassionate, idealistic, and deeply empathetic way. You are a romantic dreamer, seeking a soul connection. You are highly sensitive and selfless in love, but can be prone to idealizing others."
    },
    "Mars": {
        "Aries": "With Mars in Aries, its natural home, your drive and assertiveness are direct, pioneering, and courageous. You are a natural initiator, eager to take action and lead. You can be impulsive and competitive, but also incredibly dynamic and energetic.",
        "Taurus": "With Mars in Taurus, your drive and assertiveness are slow, steady, and persistent. You take your time to act, but once committed, you are unyielding and determined. You are motivated by comfort and security, and can be stubborn in your pursuits.",
        "Gemini": "With Mars in Gemini, your drive and assertiveness are expressed through communication, quick thinking, and adaptability. You are motivated by mental stimulation and can pursue multiple interests at once. You may be prone to scattering your energy or being argumentative.",
        "Cancer": "With Mars in Cancer, your drive and assertiveness are emotionally motivated and protective. You take action to defend your home, family, and those you care about. You can be indirect in your approach and prone to mood-driven actions.",
        "Leo": "With Mars in Leo, your drive and assertiveness are expressed with confidence, creativity, and a need for recognition. You are motivated by a desire to shine and lead, often pursuing goals with flair and drama. You can be proud and attention-seeking.",
        "Virgo": "With Mars in Virgo, your drive and assertiveness are practical, analytical, and precise. You are motivated by a desire to be efficient and helpful, often taking a methodical approach to your work. You can be critical and prone to overthinking before acting.",
        "Libra": "With Mars in Libra, your drive and assertiveness are focused on harmony, fairness, and partnership. You are motivated by a need for balance and often seek collaboration. You may avoid direct confrontation, preferring diplomacy, but can be passive-aggressive.",
        "Scorpio": "With Mars in Scorpio, its natural home, your drive and assertiveness are intense, strategic, and transformative. You are motivated by deep desires and can pursue your goals with powerful determination. You are resourceful and fearless, but can be controlling or vengeful.",
        "Sagittarius": "With Mars in Sagittarius, your drive and assertiveness are adventurous, optimistic, and philosophical. You are motivated by freedom, exploration, and a quest for truth. You take action based on your beliefs and can be blunt or restless.",
        "Capricorn": "With Mars in Capricorn, your drive and assertiveness are disciplined, ambitious, and strategic. You are motivated by achievement and long-term goals, taking a patient and methodical approach to success. You are persistent and effective.",
        "Aquarius": "With Mars in Aquarius, your drive and assertiveness are innovative, independent, and humanitarian. You are motivated by social change and unconventional ideas, often acting for the good of a group. You can be rebellious or detached in your approach.",
        "Pisces": "With Mars in Pisces, your drive and assertiveness are intuitive, compassionate, and sometimes elusive. You are motivated by empathy and idealism, often acting on behalf of others. You can be prone to indecision or passive resistance, but are deeply imaginative in your actions."
    },
    "Jupiter": {
        "Aries": "With Jupiter in Aries, your growth and luck come through pioneering, taking initiative, and being courageous. You are optimistic and enthusiastic about new beginnings, and you expand through assertive action. You may be prone to overconfidence.",
        "Taurus": "With Jupiter in Taurus, your growth and luck come through stability, practical endeavors, and appreciating the material world. You find abundance in consistency and sensual pleasures. You may be prone to indulgence or resistance to change.",
        "Gemini": "With Jupiter in Gemini, your growth and luck come through communication, learning, and sharing ideas. You expand your horizons through intellectual pursuits and diverse social connections. You may be prone to scattering your energy or superficiality.",
        "Cancer": "With Jupiter in Cancer, your growth and luck come through nurturing, emotional security, and family connections. You find abundance in your home life and by caring for others. You are compassionate and intuitive, and may be prone to over-nurturing.",
        "Leo": "With Jupiter in Leo, your growth and luck come through creative expression, generosity, and confident leadership. You find abundance when you share your talents and inspire others. You may be prone to grandiosity or seeking excessive attention.",
        "Virgo": "With Jupiter in Virgo, your growth and luck come through practical service, attention to detail, and methodical improvement. You find abundance in efficiency and helping others. You may be prone to over-analysis or perfectionism.",
        "Libra": "With Jupiter in Libra, your growth and luck come through harmonious relationships, diplomacy, and seeking justice. You find abundance through partnership and collaboration. You may be prone to indecision or people-pleasing.",
        "Scorpio": "With Jupiter in Scorpio, your growth and luck come through deep transformation, intense research, and understanding hidden truths. You find abundance in shared resources and profound experiences. You may be prone to obsession or secretive dealings.",
        "Sagittarius": "With Jupiter in Sagittarius, its natural home, your growth and luck come through philosophy, travel, and expanding your worldview. You are naturally optimistic and find abundance in seeking truth and freedom. You may be prone to bluntness or restlessness.",
        "Capricorn": "With Jupiter in Capricorn, your growth and luck come through discipline, hard work, and achieving practical goals. You find abundance through structured effort and responsibility. You may be prone to pessimism or being overly conventional.",
        "Aquarius": "With Jupiter in Aquarius, your growth and luck come through innovation, humanitarian causes, and intellectual freedom. You find abundance in group efforts and progressive ideas. You may be prone to emotional detachment or rebelliousness.",
        "Pisces": "With Jupiter in Pisces, your growth and luck come through compassion, spirituality, and artistic expression. You find abundance in empathy and connecting to the universal flow. You may be prone to escapism or being overly trusting."
    },
    "Saturn": {
        "Aries": "With Saturn in Aries, you learn discipline and responsibility in areas of self-assertion and initiative. You may face challenges in expressing your independence or overcoming impulsiveness. Lessons revolve around patience and developing self-control.",
        "Taurus": "With Saturn in Taurus, you learn discipline and responsibility in areas of material security and values. You may face challenges related to financial stability or adapting to change. Lessons revolve around building solid foundations and managing resources wisely.",
        "Gemini": "With Saturn in Gemini, you learn discipline and responsibility in areas of communication and intellect. You may face challenges with consistency in learning or expressing ideas. Lessons revolve around focused thinking and clear, structured communication.",
        "Cancer": "With Saturn in Cancer, you learn discipline and responsibility in areas of emotional security and home. You may face challenges related to family dynamics or feeling emotionally vulnerable. Lessons revolve around establishing emotional boundaries and self-nurturing.",
        "Leo": "With Saturn in Leo, you learn discipline and responsibility in areas of self-expression and creativity. You may face challenges in gaining recognition or expressing your unique talents. Lessons revolve around building authentic confidence and disciplined creative effort.",
        "Virgo": "With Saturn in Virgo, you learn discipline and responsibility in areas of work, service, and daily routines. You may face challenges with perfectionism or anxiety about details. Lessons revolve around developing practical skills and effective organization.",
        "Libra": "With Saturn in Libra, its exaltation, you learn discipline and responsibility in areas of relationships and justice. You may face challenges in partnerships or seeking fairness. Lessons revolve around commitment, compromise, and establishing equitable bonds.",
        "Scorpio": "With Saturn in Scorpio, you learn discipline and responsibility in areas of intensity, shared resources, and transformation. You may face challenges with control, trust, or confronting deep issues. Lessons revolve around emotional resilience and managing power dynamics.",
        "Sagittarius": "With Saturn in Sagittarius, you learn discipline and responsibility in areas of philosophy, higher learning, and personal beliefs. You may face challenges with dogmatism or a sense of restlessness. Lessons revolve around structuring your worldview and committing to a path.",
        "Capricorn": "With Saturn in Capricorn, its natural home, you learn discipline and responsibility in areas of ambition, career, and public status. You are driven to achieve long-term goals and build a solid reputation. Lessons revolve around perseverance, integrity, and leadership.",
        "Aquarius": "With Saturn in Aquarius, you learn discipline and responsibility in areas of innovation, groups, and humanitarian causes. You may face challenges in fitting in or expressing your individuality. Lessons revolve around structured social reform and contributing to the collective.",
        "Pisces": "With Saturn in Pisces, you learn discipline and responsibility in areas of spirituality, compassion, and intuition. You may face challenges with boundaries, escapism, or self-pity. Lessons revolve around grounding your spiritual insights and compassionate service."
    },
    "Uranus": {
        "Aries": "With Uranus in Aries, your need for freedom and innovation is expressed through pioneering and assertive action. You are a revolutionary who initiates change and challenges the status quo. This generation seeks breakthroughs in self-identity and leadership.",
        "Taurus": "With Uranus in Taurus, your need for freedom and innovation is expressed through material values, resources, and stability. This generation seeks breakthroughs in economics, environmentalism, and alternative wealth. There may be disruptions to established financial systems.",
        "Gemini": "With Uranus in Gemini, your need for freedom and innovation is expressed through communication, information, and intellectual pursuits. This generation seeks breakthroughs in technology, education, and how ideas are exchanged. There may be rapid shifts in thought.",
        "Cancer": "With Uranus in Cancer, your need for freedom and innovation is expressed through home, family, and emotional security. This generation seeks breakthroughs in domestic life, living arrangements, and the definition of family. There may be disruptions to traditional foundations.",
        "Leo": "With Uranus in Leo, your need for freedom and innovation is expressed through creativity, self-expression, and leadership. This generation seeks breakthroughs in art, entertainment, and how individuality is celebrated. There may be unconventional expressions of self.",
        "Virgo": "With Uranus in Virgo, your need for freedom and innovation is expressed through work, health, and practical systems. This generation seeks breakthroughs in technology, medicine, and daily routines. There may be disruptions to traditional work structures or health practices.",
        "Libra": "With Uranus in Libra, your need for freedom and innovation is expressed through relationships, justice, and social harmony. This generation seeks breakthroughs in partnerships, equality, and diplomatic approaches. There may be unconventional relationship models.",
        "Scorpio": "With Uranus in Scorpio, your need for freedom and innovation is expressed through transformation, shared resources, and hidden power dynamics. This generation seeks breakthroughs in psychology, finance, and confronting taboos. There may be intense disruptions to established power structures.",
        "Sagittarius": "With Uranus in Sagittarius, your need for freedom and innovation is expressed through philosophy, higher education, and global exploration. This generation seeks breakthroughs in belief systems, travel, and expanding consciousness. There may be challenges to traditional truths.",
        "Capricorn": "With Uranus in Capricorn, your need for freedom and innovation is expressed through ambition, social structures, and traditional institutions. This generation seeks breakthroughs in government, corporations, and established hierarchies. There may be sudden shifts in societal order.",
        "Aquarius": "With Uranus in Aquarius, its natural home, your need for freedom and innovation is expressed through humanitarian ideals, group dynamics, and technological advancement. This generation seeks breakthroughs in social progress and collective consciousness. They are true visionaries.",
        "Pisces": "With Uranus in Pisces, your need for freedom and innovation is expressed through spirituality, compassion, and the collective unconscious. This generation seeks breakthroughs in healing, art, and understanding the mystical. There may be disruptions to religious or spiritual dogmas."
    },
    "Neptune": {
        "Aries": "With Neptune in Aries, your idealism and spiritual inspiration are expressed through pioneering action and self-discovery. This generation explores new spiritual paths and may be drawn to charismatic leaders. There can be confusion around identity and aggression.",
        "Taurus": "With Neptune in Taurus, your idealism and spiritual inspiration are expressed through material values, art, and nature. This generation seeks spiritual connection through beauty and the physical world. There can be confusion or idealism around money and resources.",
        "Gemini": "With Neptune in Gemini, your idealism and spiritual inspiration are expressed through communication, education, and diverse ideas. This generation seeks spiritual meaning through mental exploration and new forms of media. There can be confusion or deception in information.",
        "Cancer": "With Neptune in Cancer, your idealism and spiritual inspiration are expressed through home, family, and emotional nurturing. This generation seeks spiritual connection through empathy and collective memory. There can be confusion or idealization of family bonds.",
        "Leo": "With Neptune in Leo, your idealism and spiritual inspiration are expressed through creativity, self-expression, and leadership. This generation seeks spiritual meaning through dramatic arts and inspiring others. There can be confusion or glamorization of power.",
        "Virgo": "With Neptune in Virgo, your idealism and spiritual inspiration are expressed through service, health, and practical systems. This generation seeks spiritual meaning through helping others and perfecting daily life. There can be confusion around details or health matters.",
        "Libra": "With Neptune in Libra, your idealism and spiritual inspiration are expressed through relationships, justice, and aesthetics. This generation seeks spiritual connection through harmonious partnerships and ideal beauty. There can be confusion or disillusionment in relationships.",
        "Scorpio": "With Neptune in Scorpio, your idealism and spiritual inspiration are expressed through transformation, shared resources, and the mysteries of life. This generation seeks spiritual meaning through profound emotional experiences and the occult. There can be confusion or blurring of boundaries in power dynamics.",
        "Sagittarius": "With Neptune in Sagittarius, your idealism and spiritual inspiration are expressed through philosophy, religion, and global understanding. This generation seeks spiritual truth through expanded consciousness and diverse belief systems. There can be confusion or disillusionment in spiritual dogma.",
        "Capricorn": "With Neptune in Capricorn, your idealism and spiritual inspiration are expressed through social structures, ambition, and tradition. This generation seeks spiritual meaning through established institutions and practical goals. There can be confusion or idealization of authority.",
        "Aquarius": "With Neptune in Aquarius, your idealism and spiritual inspiration are expressed through humanitarian ideals, technology, and group consciousness. This generation seeks spiritual meaning through collective progress and innovative thinking. There can be confusion or idealization of social movements.",
        "Pisces": "With Neptune in Pisces, its natural home, your idealism and spiritual inspiration are expressed through compassion, intuition, and artistic endeavors. This generation seeks spiritual union and transcendence through empathy and imagination. There can be confusion of boundaries or escapism."
    },
    "Pluto": {
        "Aries": "With Pluto in Aries, your generation experiences profound transformation and power struggles related to self-identity, leadership, and initiation. There's a collective urge to assert individuality and break from the past, leading to radical shifts in societal power.",
        "Taurus": "With Pluto in Taurus, your generation experiences profound transformation and power struggles related to values, resources, and material security. There's a collective urge to redefine wealth and examine humanity's relationship with the earth.",
        "Gemini": "With Pluto in Gemini, your generation experiences profound transformation and power struggles related to communication, information, and intellectual thought. There's a collective urge to uncover hidden truths and expose deception in media and education.",
        "Cancer": "With Pluto in Cancer, your generation experiences profound transformation and power struggles related to home, family, and emotional security. There's a collective urge to redefine domestic structures and confront deep emotional patterns within families and nations.",
        "Leo": "With Pluto in Leo, your generation experiences profound transformation and power struggles related to self-expression, creativity, and leadership. There's a collective urge to redefine authority and express individuality in powerful ways, often through dramatic means.",
        "Virgo": "With Pluto in Virgo, your generation experiences profound transformation and power struggles related to work, health, and practical systems. There's a collective urge to reform daily routines, address health crises, and empower individuals through meticulous organization.",
        "Libra": "With Pluto in Libra, your generation experiences profound transformation and power struggles related to relationships, justice, and diplomacy. There's a collective urge to redefine partnerships, confront imbalances, and seek profound equality in social interactions.",
        "Scorpio": "With Pluto in Scorpio, its natural home, your generation experiences profound transformation and power struggles related to death, rebirth, intimacy, and shared power. There's a collective urge to confront taboos, uncover deep psychological truths, and engage in intense change.",
        "Sagittarius": "With Pluto in Sagittarius, your generation experiences profound transformation and power struggles related to philosophy, religion, and global understanding. There's a collective urge to redefine belief systems, explore new horizons, and confront dogmatism.",
        "Capricorn": "With Pluto in Capricorn, your generation experiences profound transformation and power struggles related to ambition, social structures, and authority. There's a collective urge to dismantle old systems, redefine success, and rebuild societal foundations.",
        "Aquarius": "With Pluto in Aquarius, your generation experiences profound transformation and power struggles related to innovation, collective ideals, and humanitarian causes. There's a collective urge to revolutionize society, empower groups, and challenge traditional power dynamics.",
        "Pisces": "With Pluto in Pisces, your generation experiences profound transformation and power struggles related to spirituality, compassion, and the collective unconscious. There's a collective urge to dissolve boundaries, confront hidden fears, and seek spiritual regeneration."
    },
    "Node": {
        "Aries": "With the North Node in Aries, your soul's purpose involves developing independence, courage, and leadership. You are learning to assert yourself and take initiative. Your karmic path leads toward self-discovery and pioneering new territory.",
        "Taurus": "With the North Node in Taurus, your soul's purpose involves developing stability, patience, and material security. You are learning to build solid foundations and appreciate the physical world. Your karmic path leads toward creating lasting value.",
        "Gemini": "With the North Node in Gemini, your soul's purpose involves developing communication, curiosity, and intellectual growth. You are learning to gather and share information. Your karmic path leads toward connecting with others through ideas and learning.",
        "Cancer": "With the North Node in Cancer, your soul's purpose involves developing emotional security, nurturing, and family connections. You are learning to care for others and create a sense of home. Your karmic path leads toward emotional fulfillment.",
        "Leo": "With the North Node in Leo, your soul's purpose involves developing creativity, self-expression, and leadership. You are learning to shine and inspire others. Your karmic path leads toward authentic self-expression and generous leadership.",
        "Virgo": "With the North Node in Virgo, your soul's purpose involves developing practical skills, service, and attention to detail. You are learning to be helpful and efficient. Your karmic path leads toward mastery through dedicated work.",
        "Libra": "With the North Node in Libra, your soul's purpose involves developing harmony, relationships, and diplomacy. You are learning to create balance and work with others. Your karmic path leads toward partnership and justice.",
        "Scorpio": "With the North Node in Scorpio, your soul's purpose involves developing depth, transformation, and psychological insight. You are learning to confront hidden truths and embrace change. Your karmic path leads toward profound personal evolution.",
        "Sagittarius": "With the North Node in Sagittarius, your soul's purpose involves developing wisdom, philosophy, and expansion. You are learning to seek truth and explore new horizons. Your karmic path leads toward spiritual growth and higher learning.",
        "Capricorn": "With the North Node in Capricorn, your soul's purpose involves developing discipline, ambition, and responsibility. You are learning to build lasting structures and achieve long-term goals. Your karmic path leads toward mastery and authority.",
        "Aquarius": "With the North Node in Aquarius, your soul's purpose involves developing innovation, humanitarian ideals, and group consciousness. You are learning to contribute to collective progress. Your karmic path leads toward social reform and unique contributions.",
        "Pisces": "With the North Node in Pisces, your soul's purpose involves developing compassion, spirituality, and universal love. You are learning to connect with the divine and serve others selflessly. Your karmic path leads toward spiritual transcendence."
    },
    "Lilith": {
        "Aries": "With Lilith in Aries, your dark feminine energy expresses through fierce independence and raw passion. You refuse to be controlled and may challenge traditional gender roles. Your primal instincts drive you toward authentic self-expression.",
        "Taurus": "With Lilith in Taurus, your dark feminine energy expresses through sensual rebellion and material independence. You may reject conventional beauty standards and find power in your natural sensuality. Your primal instincts connect you to earth energy.",
        "Gemini": "With Lilith in Gemini, your dark feminine energy expresses through intellectual rebellion and unconventional communication. You may challenge traditional knowledge and express taboo ideas. Your primal instincts drive you toward mental freedom.",
        "Cancer": "With Lilith in Cancer, your dark feminine energy expresses through emotional rebellion and protective instincts. You may reject traditional family roles and find power in your emotional depth. Your primal instincts drive you toward emotional authenticity.",
        "Leo": "With Lilith in Leo, your dark feminine energy expresses through creative rebellion and dramatic self-expression. You may challenge traditional performance roles and find power in your unique creativity. Your primal instincts drive you toward authentic leadership.",
        "Virgo": "With Lilith in Virgo, your dark feminine energy expresses through practical rebellion and perfectionist standards. You may reject traditional service roles and find power in your analytical abilities. Your primal instincts drive you toward mastery.",
        "Libra": "With Lilith in Libra, your dark feminine energy expresses through relational rebellion and unconventional partnerships. You may challenge traditional relationship norms and find power in your diplomatic skills. Your primal instincts drive you toward authentic harmony.",
        "Scorpio": "With Lilith in Scorpio, your dark feminine energy expresses through intense rebellion and sexual power. You may reject traditional taboos and find power in your psychological depth. Your primal instincts drive you toward transformation.",
        "Sagittarius": "With Lilith in Sagittarius, your dark feminine energy expresses through philosophical rebellion and spiritual freedom. You may challenge traditional beliefs and find power in your quest for truth. Your primal instincts drive you toward expansion.",
        "Capricorn": "With Lilith in Capricorn, your dark feminine energy expresses through structural rebellion and ambitious independence. You may reject traditional authority and find power in your strategic abilities. Your primal instincts drive you toward achievement.",
        "Aquarius": "With Lilith in Aquarius, your dark feminine energy expresses through revolutionary rebellion and humanitarian ideals. You may challenge traditional social structures and find power in your unique vision. Your primal instincts drive you toward innovation.",
        "Pisces": "With Lilith in Pisces, your dark feminine energy expresses through spiritual rebellion and mystical power. You may reject traditional spiritual dogma and find power in your intuitive abilities. Your primal instincts drive you toward transcendence."
    },
    "Chiron": {
        "Aries": "With Chiron in Aries, your deepest wound relates to identity, courage, and self-assertion. You may have experienced early trauma around being yourself or taking initiative. Your healing comes through helping others find their courage and authentic voice.",
        "Taurus": "With Chiron in Taurus, your deepest wound relates to security, values, and self-worth. You may have experienced early trauma around material stability or feeling valued. Your healing comes through helping others build security and appreciate their worth.",
        "Gemini": "With Chiron in Gemini, your deepest wound relates to communication, learning, and mental confidence. You may have experienced early trauma around expressing ideas or intellectual development. Your healing comes through helping others communicate and learn.",
        "Cancer": "With Chiron in Cancer, your deepest wound relates to emotional security, family, and nurturing. You may have experienced early trauma around home life or emotional support. Your healing comes through helping others create emotional security and family bonds.",
        "Leo": "With Chiron in Leo, your deepest wound relates to creativity, self-expression, and recognition. You may have experienced early trauma around being seen or expressing your talents. Your healing comes through helping others find their creative voice and confidence.",
        "Virgo": "With Chiron in Virgo, your deepest wound relates to perfection, service, and practical skills. You may have experienced early trauma around being helpful or meeting standards. Your healing comes through helping others develop practical skills and self-acceptance.",
        "Libra": "With Chiron in Libra, your deepest wound relates to relationships, harmony, and fairness. You may have experienced early trauma around partnerships or justice. Your healing comes through helping others create balanced relationships and find harmony.",
        "Scorpio": "With Chiron in Scorpio, your deepest wound relates to power, intimacy, and transformation. You may have experienced early trauma around control or deep emotional connections. Your healing comes through helping others navigate power dynamics and transformation.",
        "Sagittarius": "With Chiron in Sagittarius, your deepest wound relates to beliefs, philosophy, and freedom. You may have experienced early trauma around truth-seeking or expansion. Your healing comes through helping others find their beliefs and expand their horizons.",
        "Capricorn": "With Chiron in Capricorn, your deepest wound relates to achievement, authority, and structure. You may have experienced early trauma around success or responsibility. Your healing comes through helping others build lasting achievements and find their authority.",
        "Aquarius": "With Chiron in Aquarius, your deepest wound relates to individuality, groups, and innovation. You may have experienced early trauma around fitting in or expressing uniqueness. Your healing comes through helping others find their unique contribution to society.",
        "Pisces": "With Chiron in Pisces, your deepest wound relates to spirituality, compassion, and boundaries. You may have experienced early trauma around spiritual connection or emotional boundaries. Your healing comes through helping others develop spiritual awareness and healthy compassion."
    },
    "Fortune": {
        "Aries": "With the Part of Fortune in Aries, your luck and abundance come through taking initiative and being courageous. You find prosperity when you lead and pioneer new territory. Your fortunate circumstances arise from your independent spirit and bold actions.",
        "Taurus": "With the Part of Fortune in Taurus, your luck and abundance come through building stability and appreciating beauty. You find prosperity when you create lasting value and enjoy sensual pleasures. Your fortunate circumstances arise from your patience and practical approach.",
        "Gemini": "With the Part of Fortune in Gemini, your luck and abundance come through communication and learning. You find prosperity when you share ideas and gather information. Your fortunate circumstances arise from your curiosity and social connections.",
        "Cancer": "With the Part of Fortune in Cancer, your luck and abundance come through nurturing and creating emotional security. You find prosperity when you care for others and build a sense of home. Your fortunate circumstances arise from your emotional intelligence and protective instincts.",
        "Leo": "With the Part of Fortune in Leo, your luck and abundance come through creativity and leadership. You find prosperity when you express your talents and inspire others. Your fortunate circumstances arise from your confidence and generous spirit.",
        "Virgo": "With the Part of Fortune in Virgo, your luck and abundance come through service and attention to detail. You find prosperity when you help others and perfect your skills. Your fortunate circumstances arise from your practical abilities and helpful nature.",
        "Libra": "With the Part of Fortune in Libra, your luck and abundance come through relationships and harmony. You find prosperity when you create balance and work with others. Your fortunate circumstances arise from your diplomatic skills and sense of justice.",
        "Scorpio": "With the Part of Fortune in Scorpio, your luck and abundance come through transformation and shared resources. You find prosperity when you embrace change and work with others' resources. Your fortunate circumstances arise from your psychological insight and intensity.",
        "Sagittarius": "With the Part of Fortune in Sagittarius, your luck and abundance come through expansion and philosophy. You find prosperity when you explore new horizons and share your wisdom. Your fortunate circumstances arise from your optimism and quest for truth.",
        "Capricorn": "With the Part of Fortune in Capricorn, your luck and abundance come through discipline and achievement. You find prosperity when you work hard and build lasting structures. Your fortunate circumstances arise from your ambition and practical wisdom.",
        "Aquarius": "With the Part of Fortune in Aquarius, your luck and abundance come through innovation and humanitarian causes. You find prosperity when you contribute to social progress and express your unique ideas. Your fortunate circumstances arise from your originality and group connections.",
        "Pisces": "With the Part of Fortune in Pisces, your luck and abundance come through compassion and spirituality. You find prosperity when you serve others and connect with the divine. Your fortunate circumstances arise from your empathy and spiritual awareness."
    },
    "Vertex": {
        "Aries": "With the Vertex in Aries, your fated encounters involve people who challenge you to be more independent and courageous. These relationships push you toward self-discovery and leadership. Significant meetings may involve pioneers or those who initiate change.",
        "Taurus": "With the Vertex in Taurus, your fated encounters involve people who help you build stability and appreciate beauty. These relationships encourage you to create lasting value and enjoy sensual pleasures. Significant meetings may involve builders or those who value tradition.",
        "Gemini": "With the Vertex in Gemini, your fated encounters involve people who stimulate your mind and expand your knowledge. These relationships encourage you to communicate and learn. Significant meetings may involve teachers or those who share information.",
        "Cancer": "With the Vertex in Cancer, your fated encounters involve people who nurture your emotional needs and help you create security. These relationships encourage you to care for others and build a home. Significant meetings may involve caregivers or those who provide emotional support.",
        "Leo": "With the Vertex in Leo, your fated encounters involve people who inspire your creativity and help you shine. These relationships encourage you to express your talents and lead others. Significant meetings may involve performers or those who bring out your confidence.",
        "Virgo": "With the Vertex in Virgo, your fated encounters involve people who help you develop practical skills and serve others. These relationships encourage you to be helpful and perfect your abilities. Significant meetings may involve healers or those who teach you efficiency.",
        "Libra": "With the Vertex in Libra, your fated encounters involve people who bring balance and harmony to your life. These relationships encourage you to work with others and seek justice. Significant meetings may involve diplomats or those who help you find equilibrium.",
        "Scorpio": "With the Vertex in Scorpio, your fated encounters involve people who transform your life and help you confront deep truths. These relationships encourage you to embrace change and develop psychological insight. Significant meetings may involve therapists or those who challenge your boundaries.",
        "Sagittarius": "With the Vertex in Sagittarius, your fated encounters involve people who expand your horizons and share their wisdom. These relationships encourage you to explore new possibilities and seek truth. Significant meetings may involve philosophers or those who broaden your perspective.",
        "Capricorn": "With the Vertex in Capricorn, your fated encounters involve people who help you achieve your goals and build lasting structures. These relationships encourage you to work hard and develop authority. Significant meetings may involve mentors or those who teach you discipline.",
        "Aquarius": "With the Vertex in Aquarius, your fated encounters involve people who inspire innovation and humanitarian ideals. These relationships encourage you to contribute to social progress and express your uniqueness. Significant meetings may involve visionaries or those who challenge conventional thinking.",
        "Pisces": "With the Vertex in Pisces, your fated encounters involve people who connect you to spirituality and compassion. These relationships encourage you to serve others and develop mystical awareness. Significant meetings may involve healers or those who help you transcend boundaries."
    }
}

export const SIGN_IN_HOUSE_INTERPRETATIONS = {
    "Aries": {
        "1": "You present yourself as bold, direct, and energetic. You approach life with initiative and courage.",
        "2": "You pursue material security with drive and assertiveness. You value independence in finances.",
        "3": "You communicate quickly and directly. You are eager to learn and share ideas.",
        "4": "You are protective of your home and family, and may take the lead in domestic matters.",
        "5": "You express creativity and romance with passion and spontaneity.",
        "6": "You approach work and health routines with energy and initiative.",
        "7": "You seek dynamic, independent partners and value excitement in relationships.",
        "8": "You face transformation and shared resources with courage and directness.",
        "9": "You are adventurous in travel, philosophy, and higher learning.",
        "10": "You pursue career goals assertively and seek leadership roles.",
        "11": "You are a pioneering force in groups and friendships.",
        "12": "You confront your subconscious and hidden matters with bravery and initiative."
    },
    "Taurus": {
        "1": "You present yourself as steady, reliable, and sensual. You value comfort and stability.",
        "2": "You seek material security and value possessions. You are patient in financial matters.",
        "3": "You communicate in a calm, deliberate manner and value practical knowledge.",
        "4": "You create a comfortable, secure home and value family traditions.",
        "5": "You express creativity and romance in a loyal, sensual way.",
        "6": "You approach work and health with consistency and practicality.",
        "7": "You seek stable, long-term partnerships and value loyalty in relationships.",
        "8": "You approach transformation and shared resources with patience and caution.",
        "9": "You value practical philosophy and seek comfort in travel and learning.",
        "10": "You pursue career goals steadily and value security in your public image.",
        "11": "You are a dependable friend and value stability in groups.",
        "12": "You find comfort in solitude and value inner peace and security."
    },
    "Gemini": {
        "1": "You present yourself as curious, adaptable, and communicative. You approach life with versatility and wit.",
        "2": "You seek material security through multiple sources and value intellectual assets.",
        "3": "You are an engaging communicator and enjoy learning and sharing ideas.",
        "4": "Your home life is lively and filled with conversation and movement.",
        "5": "You express creativity and romance playfully and enjoy variety in leisure.",
        "6": "You approach work and health routines with flexibility and mental engagement.",
        "7": "You seek stimulating, communicative partners and value intellectual connection.",
        "8": "You approach transformation and shared resources with curiosity and adaptability.",
        "9": "You are interested in diverse philosophies and enjoy travel and learning.",
        "10": "You pursue career goals with adaptability and value communication in your public image.",
        "11": "You are a sociable friend and enjoy networking in groups.",
        "12": "You process your subconscious through thought and communication, and may need mental solitude."
    },
    "Cancer": {
        "1": "You present yourself as nurturing, sensitive, and protective. You approach life with intuition and care.",
        "2": "You seek material security for emotional comfort and value sentimental possessions.",
        "3": "You communicate with empathy and intuition, and value emotional connections.",
        "4": "You create a nurturing, protective home and value family bonds.",
        "5": "You express creativity and romance with sensitivity and care.",
        "6": "You approach work and health routines with nurturing and intuition.",
        "7": "You seek caring, emotionally supportive partners and value security in relationships.",
        "8": "You approach transformation and shared resources with sensitivity and caution.",
        "9": "You are emotionally invested in beliefs and seek comfort in travel and learning.",
        "10": "You pursue career goals with care and value a nurturing public image.",
        "11": "You are a supportive friend and value emotional bonds in groups.",
        "12": "You find comfort in solitude and process emotions privately."
    },
    "Leo": {
        "1": "You present yourself as confident, expressive, and charismatic. You approach life with enthusiasm and creativity.",
        "2": "You seek material security with pride and generosity, and value luxury.",
        "3": "You communicate dramatically and enjoy being the center of attention.",
        "4": "You create a warm, vibrant home and value family pride.",
        "5": "You express creativity and romance with flair and passion.",
        "6": "You approach work and health routines with enthusiasm and leadership.",
        "7": "You seek loyal, expressive partners and value romance in relationships.",
        "8": "You approach transformation and shared resources with courage and pride.",
        "9": "You are passionate about beliefs and seek adventure in travel and learning.",
        "10": "You pursue career goals with ambition and seek recognition in your public image.",
        "11": "You are a generous friend and enjoy leadership in groups.",
        "12": "You find strength in solitude and process your inner world with creativity."
    },
    "Virgo": {
        "1": "You present yourself as analytical, practical, and detail-oriented. You approach life with discernment and service.",
        "2": "You seek material security through careful planning and value practicality.",
        "3": "You communicate precisely and value useful information.",
        "4": "You create an organized, efficient home and value routines.",
        "5": "You express creativity and romance with thoughtfulness and attention to detail.",
        "6": "You approach work and health routines with diligence and care.",
        "7": "You seek reliable, helpful partners and value service in relationships.",
        "8": "You approach transformation and shared resources with caution and analysis.",
        "9": "You are practical in beliefs and seek knowledge in travel and learning.",
        "10": "You pursue career goals with precision and value service in your public image.",
        "11": "You are a helpful friend and value order in groups.",
        "12": "You find peace in solitude and process your inner world analytically."
    },
    "Libra": {
        "1": "You present yourself as diplomatic, charming, and fair-minded. You approach life seeking balance and harmony.",
        "2": "You seek material security through partnerships and value beauty and balance.",
        "3": "You communicate gracefully and value harmonious relationships.",
        "4": "You create a beautiful, peaceful home and value cooperation in family.",
        "5": "You express creativity and romance with charm and a sense of fairness.",
        "6": "You approach work and health routines with balance and diplomacy.",
        "7": "You seek harmonious, equal partnerships and value cooperation in relationships.",
        "8": "You approach transformation and shared resources with fairness and negotiation.",
        "9": "You are interested in balanced philosophies and seek harmony in travel and learning.",
        "10": "You pursue career goals with diplomacy and value a refined public image.",
        "11": "You are a diplomatic friend and value harmony in groups.",
        "12": "You find balance in solitude and process your inner world through relationships."
    },
    "Scorpio": {
        "1": "You present yourself as intense, passionate, and magnetic. You approach life with depth and determination.",
        "2": "You seek material security with resourcefulness and value transformation.",
        "3": "You communicate with intensity and value deep, meaningful conversations.",
        "4": "You create a private, powerful home and value emotional depth in family.",
        "5": "You express creativity and romance with passion and intensity.",
        "6": "You approach work and health routines with focus and determination.",
        "7": "You seek deep, transformative partners and value loyalty in relationships.",
        "8": "You approach transformation and shared resources with intensity and control.",
        "9": "You are passionate about beliefs and seek profound experiences in travel and learning.",
        "10": "You pursue career goals with determination and value power in your public image.",
        "11": "You are a loyal friend and value depth in groups.",
        "12": "You find strength in solitude and process your inner world intensely."
    },
    "Sagittarius": {
        "1": "You present yourself as optimistic, adventurous, and enthusiastic. You approach life with a sense of exploration.",
        "2": "You seek material security through growth and value freedom.",
        "3": "You communicate openly and enjoy sharing ideas and stories.",
        "4": "Your home life is expansive and you value freedom in family.",
        "5": "You express creativity and romance with adventure and humor.",
        "6": "You approach work and health routines with optimism and a love of learning.",
        "7": "You seek adventurous, open-minded partners and value freedom in relationships.",
        "8": "You approach transformation and shared resources with optimism and faith.",
        "9": "You are passionate about philosophy and seek adventure in travel and learning.",
        "10": "You pursue career goals with enthusiasm and value growth in your public image.",
        "11": "You are an inspiring friend and value adventure in groups.",
        "12": "You find meaning in solitude and process your inner world philosophically."
    },
    "Capricorn": {
        "1": "You present yourself as disciplined, responsible, and ambitious. You approach life with practicality and determination.",
        "2": "You seek material security through hard work and value long-term stability.",
        "3": "You communicate seriously and value practical knowledge.",
        "4": "You create a structured, secure home and value tradition in family.",
        "5": "You express creativity and romance with caution and responsibility.",
        "6": "You approach work and health routines with discipline and efficiency.",
        "7": "You seek reliable, responsible partners and value commitment in relationships.",
        "8": "You approach transformation and shared resources with caution and control.",
        "9": "You are practical in beliefs and seek achievement in travel and learning.",
        "10": "You pursue career goals with ambition and value status in your public image.",
        "11": "You are a dependable friend and value structure in groups.",
        "12": "You find strength in solitude and process your inner world with discipline."
    },
    "Aquarius": {
        "1": "You present yourself as unique, innovative, and independent. You approach life with originality and vision.",
        "2": "You seek material security through unconventional means and value freedom.",
        "3": "You communicate inventively and value progressive ideas.",
        "4": "You create an unconventional home and value individuality in family.",
        "5": "You express creativity and romance with originality and openness.",
        "6": "You approach work and health routines with innovation and independence.",
        "7": "You seek unique, open-minded partners and value freedom in relationships.",
        "8": "You approach transformation and shared resources with detachment and innovation.",
        "9": "You are interested in progressive philosophies and seek new experiences in travel and learning.",
        "10": "You pursue career goals with originality and value innovation in your public image.",
        "11": "You are a visionary friend and value individuality in groups.",
        "12": "You find insight in solitude and process your inner world unconventionally."
    },
    "Pisces": {
        "1": "You present yourself as compassionate, intuitive, and imaginative. You approach life with sensitivity and empathy.",
        "2": "You seek material security through intuition and value spiritual over material wealth.",
        "3": "You communicate empathetically and value imagination in thought.",
        "4": "You create a peaceful, spiritual home and value emotional connection in family.",
        "5": "You express creativity and romance with imagination and sensitivity.",
        "6": "You approach work and health routines with compassion and intuition.",
        "7": "You seek compassionate, spiritual partners and value empathy in relationships.",
        "8": "You approach transformation and shared resources with intuition and surrender.",
        "9": "You are drawn to spiritual philosophies and seek inspiration in travel and learning.",
        "10": "You pursue career goals with imagination and value compassion in your public image.",
        "11": "You are a compassionate friend and value empathy in groups.",
        "12": "You find peace in solitude and process your inner world through dreams and intuition."
    }
}

// Function to get detailed aspect interpretation
export function getDetailedAspectInterpretation(aspect: string, planet1: string, planet2: string): string {
    const aspectData = ASPECT_INTERPRETATIONS[aspect];
    if (!aspectData) return '';

    // Try both possible planet key combinations
    const planetKey1 = `${planet1}_${planet2}`;
    const planetKey2 = `${planet2}_${planet1}`;
    
    const interpretation = aspectData.planets[planetKey1] || aspectData.planets[planetKey2];

    if (interpretation) {
        return `${aspectData.general}\n\n${interpretation}`;
    }

    return aspectData.general;
}

// Function to get transit interpretation
export function getTransitInterpretation(aspect: string, transitPlanet: string, natalPlanet: string): string {
    // Get detailed interpretation for specific planet combination
    const aspectData = ASPECT_INTERPRETATIONS[aspect];
    if (!aspectData) return '';

    // Try both possible planet key combinations
    const planetKey1 = `${transitPlanet}_${natalPlanet}`;
    const planetKey2 = `${natalPlanet}_${transitPlanet}`;
    
    const interpretation = aspectData.planets[planetKey1] || aspectData.planets[planetKey2];

    if (interpretation) {
        return interpretation;
    }

    // If no specific interpretation, provide a general one based on aspect and planets
    const planetMeanings = {
        'Sun': 'identity and life purpose',
        'Moon': 'emotions and intuition',
        'Mercury': 'communication and thinking',
        'Venus': 'love and values',
        'Mars': 'action and courage',
        'Jupiter': 'expansion and wisdom',
        'Saturn': 'structure and responsibility',
        'Uranus': 'innovation and freedom',
        'Neptune': 'inspiration and spirituality',
        'Pluto': 'transformation and power'
    };

    const aspectMeanings = {
        'Conjunction': 'integration and new beginnings',
        'Opposition': 'balance and awareness',
        'Square': 'challenge and growth',
        'Trine': 'harmony and ease',
        'Sextile': 'opportunity and cooperation'
    };

    const transitPlanetMeaning = planetMeanings[transitPlanet as keyof typeof planetMeanings] || 'personal growth';
    const natalPlanetMeaning = planetMeanings[natalPlanet as keyof typeof planetMeanings] || 'personal development';
    const aspectMeaning = aspectMeanings[aspect as keyof typeof aspectMeanings] || 'transformation';

    return `${aspectMeaning} between ${transitPlanetMeaning} and ${natalPlanetMeaning}. This transit brings opportunities for growth and development.`;
}

// Enhanced transit interpretation functions
function getOrdinalSuffix(num: number): string {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}



export function getTransitPlanetInHouseMeaning(transitPlanet: string, houseNumber: number, transitSign?: string): string {
    const planetMeanings = {
        'Sun': 'your core identity and life purpose',
        'Moon': 'your emotional needs and intuitive responses',
        'Mercury': 'your communication style and mental focus',
        'Venus': 'your approach to love and what you value',
        'Mars': 'your drive and how you take action',
        'Jupiter': 'your growth and expansion areas',
        'Saturn': 'your challenges and areas requiring discipline',
        'Uranus': 'your need for freedom and innovation',
        'Neptune': 'your spiritual inspiration and idealism',
        'Pluto': 'your areas of deep transformation'
    };

    const houseMeanings = {
        1: 'how you present yourself and your personal identity',
        2: 'your material security and self-worth',
        3: 'your communication and immediate environment',
        4: 'your home life and emotional foundation',
        5: 'your creativity and self-expression',
        6: 'your daily work and health routines',
        7: 'your partnerships and close relationships',
        8: 'shared resources and deep transformation',
        9: 'your beliefs and higher learning',
        10: 'your career and public reputation',
        11: 'your friendships and group connections',
        12: 'your spiritual life and hidden aspects'
    };

    const planetMeaning = planetMeanings[transitPlanet as keyof typeof planetMeanings] || 'your personal growth';
    const houseMeaning = houseMeanings[houseNumber as keyof typeof houseMeanings] || 'your life areas';

    if (transitSign) {
        return `${transitPlanet} is currently transiting through ${transitSign} in the ${houseNumber}${getOrdinalSuffix(houseNumber)} house - this is activating ${planetMeaning} in the area of ${houseMeaning}. This brings temporary focus and energy to this life area.`;
    }

    return `${transitPlanet} is currently transiting through the ${houseNumber}${getOrdinalSuffix(houseNumber)} house - this is activating ${planetMeaning} in the area of ${houseMeaning}. This brings temporary focus and energy to this life area.`;
}

export function getTransitPlanetInSignMeaning(transitPlanet: string, sign: string): string {
    const planetMeanings = {
        'Sun': 'your current identity and life direction',
        'Moon': 'your emotional state and intuitive responses',
        'Mercury': 'your current thinking and communication style',
        'Venus': 'your current approach to love and values',
        'Mars': 'your current drive and action style',
        'Jupiter': 'your current areas of growth and optimism',
        'Saturn': 'your current challenges and responsibilities',
        'Uranus': 'your current need for freedom and change',
        'Neptune': 'your current spiritual inspiration and dreams',
        'Pluto': 'your current areas of deep transformation'
    };

    const signMeanings = {
        'Aries': 'with bold, direct energy and a pioneering spirit',
        'Taurus': 'with steady, practical energy and a focus on stability',
        'Gemini': 'with curious, adaptable energy and a focus on communication',
        'Cancer': 'with nurturing, protective energy and emotional sensitivity',
        'Leo': 'with creative, expressive energy and a desire for recognition',
        'Virgo': 'with analytical, service-oriented energy and attention to detail',
        'Libra': 'with harmonious, diplomatic energy and a focus on relationships',
        'Scorpio': 'with intense, transformative energy and emotional depth',
        'Sagittarius': 'with expansive, philosophical energy and a quest for meaning',
        'Capricorn': 'with disciplined, ambitious energy and a focus on achievement',
        'Aquarius': 'with innovative, independent energy and a desire for change',
        'Pisces': 'with intuitive, compassionate energy and spiritual sensitivity'
    };

    const planetMeaning = planetMeanings[transitPlanet as keyof typeof planetMeanings] || 'your current energy';
    const signMeaning = signMeanings[sign as keyof typeof signMeanings] || 'with unique characteristics';

    return `${transitPlanet} is currently transiting through ${sign} - this is expressing ${planetMeaning} ${signMeaning}. This colors how you experience this energy during this transit period.`;
}

export function getEnhancedTransitInterpretation(aspect: string, transitPlanet: string, natalPlanet: string, transitHouse?: number, transitSign?: string): string {
    // 1. What the transit planet represents
    const transitPlanetMeanings = {
        'Sun': `your current identity and life purpose - how you're expressing yourself right now`,
        'Moon': `your current emotional needs and intuitive responses - what's touching your heart`,
        'Mercury': `your current communication and thinking - how you're processing information`,
        'Venus': `your current approach to love and values - what you're drawn to`,
        'Mars': `your current drive and action style - how you're taking initiative`,
        'Jupiter': `your current areas of growth and optimism - where you're expanding`,
        'Saturn': 'your current challenges and responsibilities - what requires discipline',
        'Uranus': 'your current need for freedom and innovation - what needs to change',
        'Neptune': `your current spiritual inspiration and dreams - what you're idealizing`,
        'Pluto': `your current areas of deep transformation - what's being reborn`
    };

    // 2. What the natal planet represents
    const natalPlanetMeanings = {
        'Sun': 'your core identity and life purpose - who you fundamentally are',
        'Moon': 'your emotional foundation and intuitive nature - your emotional core',
        'Mercury': 'your natural communication style and thinking patterns - your mental approach',
        'Venus': `your natural approach to love and what you value - your heart's desires`,
        'Mars': 'your natural drive and action style - how you naturally take action',
        'Jupiter': 'your natural areas of growth and optimism - your expansive nature',
        'Saturn': 'your natural challenges and responsibilities - your areas of discipline',
        'Uranus': 'your natural need for freedom and innovation - your unique nature',
        'Neptune': 'your natural spiritual inspiration and dreams - your idealistic side',
        'Pluto': 'your natural areas of transformation - your power to change'
    };

    // 3. What the aspect represents
    const aspectMeanings = {
        'Conjunction': 'integration and new beginnings - these energies are working together as one',
        'Opposition': 'awareness and balance - these energies are in tension, requiring integration',
        'Square': 'challenge and growth - these energies are in conflict, requiring action',
        'Trine': 'harmony and ease - these energies flow together naturally',
        'Sextile': 'opportunity and cooperation - these energies can work together with effort',
        'Quincunx': 'adjustment and integration - these energies seem incompatible but can work together'
    };

    // 4. What the interaction represents
    const interactionMeanings = {
        'Conjunction': 'This transit brings a powerful fusion of energies, creating a time of new beginnings and direct manifestation.',
        'Opposition': 'This transit creates awareness of polarities, requiring you to find balance between these energies.',
        'Square': 'This transit brings challenges that require action and growth, pushing you to develop new skills.',
        'Trine': 'This transit brings harmonious energy flow, making it easier to work with these energies together.',
        'Sextile': 'This transit brings opportunities for growth through conscious effort and cooperation.',
        'Quincunx': 'This transit requires adjustment and integration of seemingly incompatible energies.'
    };

    const transitPlanetMeaning = transitPlanetMeanings[transitPlanet as keyof typeof transitPlanetMeanings] || 'your current energy';
    const natalPlanetMeaning = natalPlanetMeanings[natalPlanet as keyof typeof natalPlanetMeanings] || 'your core nature';
    const aspectMeaning = aspectMeanings[aspect as keyof typeof aspectMeanings] || 'transformation';
    const interactionMeaning = interactionMeanings[aspect as keyof typeof interactionMeanings] || 'This transit brings change and growth.';

    let interpretation = `**Transit ${transitPlanet}** represents ${transitPlanetMeaning}. `;
    interpretation += `**Your natal ${natalPlanet}** represents ${natalPlanetMeaning}. `;
    interpretation += `**The ${aspect} aspect** represents ${aspectMeaning}. `;
    interpretation += `${interactionMeaning}`;

    // Add house and sign information if available
    if (transitHouse) {
        interpretation += `\n\n${getTransitPlanetInHouseMeaning(transitPlanet, transitHouse, transitSign)}`;
    }

    if (transitSign) {
        interpretation += `\n\n${getTransitPlanetInSignMeaning(transitPlanet, transitSign)}`;
    }

    return interpretation;
} 