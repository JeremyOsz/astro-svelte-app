// Basic astrological constants

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
};

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
};

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