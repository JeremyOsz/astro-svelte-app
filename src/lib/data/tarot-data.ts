export interface TarotCard {
  id: string;
  name: string;
  image: string;
  suit?: string;
  number?: number;
  keywords: string[];
  upright: {
    general: string;
    love: string;
    career: string;
    health: string;
  };
  reversed: {
    general: string;
    love: string;
    career: string;
    health: string;
  };
  element?: string;
  planet?: string;
  zodiac?: string;
  symbology?: {
    symbols: string[];
    colors: string[];
    numbers: string[];
    animals?: string[];
    objects?: string[];
    elements?: string[];
  };
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: "00-the-fool",
    name: "The Fool",
    image: "/src/lib/images/tarot/Cards-png/00-TheFool.png",
    number: 0,
    keywords: ["New beginnings", "Innocence", "Spontaneity", "Adventure", "Risk-taking"],
    upright: {
      general: "The Fool represents new beginnings, innocence, and spontaneity. It suggests taking a leap of faith and embracing the unknown with optimism and trust.",
      love: "New love or relationship, taking emotional risks, being open to new experiences in love",
      career: "Starting a new job or project, taking career risks, fresh perspective",
      health: "New health journey, optimism about recovery, taking chances on alternative treatments"
    },
    reversed: {
      general: "Recklessness, poor judgment, missed opportunities, being naive or gullible",
      love: "Being too naive in relationships, missing red flags, emotional recklessness",
      career: "Poor planning, taking unnecessary risks, lack of preparation",
      health: "Ignoring health warnings, being careless with wellness"
    },
    element: "Air",
    planet: "Uranus",
    zodiac: "Aquarius",
    symbology: {
      symbols: ["White Rose", "White Dog", "Cliff Edge", "Sun", "Mountains"],
      colors: ["White", "Yellow", "Blue", "Green"],
      numbers: ["0", "∞"],
      animals: ["White Dog"],
      objects: ["Bundle", "Staff", "White Rose"],
      elements: ["Air", "Light"]
    }
  },
  {
    id: "01-the-magician",
    name: "The Magician",
    image: "/src/lib/images/tarot/Cards-png/01-TheMagician.png",
    number: 1,
    keywords: ["Manifestation", "Power", "Skill", "Confidence", "Willpower"],
    upright: {
      general: "The Magician represents your ability to manifest your desires through willpower and skill. You have all the tools you need to succeed.",
      love: "Taking control of your love life, using your charm and skills to attract love",
      career: "Using your talents effectively, taking action on opportunities, leadership",
      health: "Taking control of your health, using willpower for wellness goals"
    },
    reversed: {
      general: "Manipulation, poor planning, untapped talents, lack of confidence",
      love: "Manipulation in relationships, not using your full potential",
      career: "Wasted potential, poor use of skills, lack of direction",
      health: "Lack of willpower, not following through on health plans"
    },
    element: "Air",
    planet: "Mercury",
    zodiac: "Gemini",
    symbology: {
      symbols: ["Infinity Symbol", "Wand", "Cup", "Sword", "Pentacle", "Red Roses", "White Lilies"],
      colors: ["Red", "White", "Yellow", "Blue"],
      numbers: ["1", "∞"],
      animals: [],
      objects: ["Wand", "Cup", "Sword", "Pentacle", "Table", "Red Roses", "White Lilies"],
      elements: ["Fire", "Water", "Air", "Earth"]
    }
  },
  {
    id: "02-the-high-priestess",
    name: "The High Priestess",
    image: "/src/lib/images/tarot/Cards-png/02-TheHighPriestess.png",
    number: 2,
    keywords: ["Intuition", "Mystery", "Inner knowledge", "Wisdom", "Secrets"],
    upright: {
      general: "The High Priestess represents intuition, inner wisdom, and spiritual knowledge. Trust your instincts and listen to your inner voice.",
      love: "Intuitive understanding of relationships, spiritual connection, inner knowing",
      career: "Following your intuition in decisions, spiritual approach to work",
      health: "Listening to your body's wisdom, intuitive healing approaches"
    },
    reversed: {
      general: "Ignoring intuition, secrets revealed, lack of inner guidance",
      love: "Ignoring red flags, not trusting your gut feelings",
      career: "Ignoring inner wisdom, making decisions without reflection",
      health: "Ignoring body signals, not listening to inner guidance"
    },
    element: "Water",
    planet: "Moon",
    zodiac: "Cancer",
    symbology: {
      symbols: ["Crescent Moon", "Crown", "Scroll", "Pomegranates", "Pillars", "Veil"],
      colors: ["Blue", "White", "Silver", "Black"],
      numbers: ["2", "B", "J"],
      animals: [],
      objects: ["Crown", "Scroll", "Pomegranates", "Pillars", "Veil", "Crescent Moon"],
      elements: ["Water", "Moon"]
    }
  },
  {
    id: "03-the-empress",
    name: "The Empress",
    image: "/src/lib/images/tarot/Cards-png/03-TheEmpress.png",
    number: 3,
    keywords: ["Fertility", "Abundance", "Nurturing", "Creativity", "Motherhood"],
    upright: {
      general: "The Empress represents abundance, creativity, and nurturing energy. It's a time of growth, fertility, and material prosperity.",
      love: "Fertile period for love, nurturing relationships, abundance in love",
      career: "Creative success, abundance in work, nurturing your talents",
      health: "Fertility, abundance of energy, nurturing your body"
    },
    reversed: {
      general: "Creative blocks, lack of abundance, over-nurturing, smothering",
      love: "Over-dependency, smothering love, lack of boundaries",
      career: "Creative blocks, lack of abundance, over-giving",
      health: "Over-indulgence, fertility issues, lack of self-care"
    },
    element: "Earth",
    planet: "Venus",
    zodiac: "Taurus",
    symbology: {
      symbols: ["Crown", "Scepter", "Shield", "Wheat", "Pomegranates", "Heart"],
      colors: ["Green", "Gold", "Red", "White"],
      numbers: ["3", "Venus Symbol"],
      animals: [],
      objects: ["Crown", "Scepter", "Shield", "Wheat", "Pomegranates", "Heart"],
      elements: ["Earth", "Venus"]
    }
  },
  {
    id: "04-the-emperor",
    name: "The Emperor",
    image: "/src/lib/images/tarot/Cards-png/04-TheEmperor.png",
    number: 4,
    keywords: ["Authority", "Structure", "Leadership", "Control", "Stability"],
    upright: {
      general: "The Emperor represents authority, structure, and leadership. It's time to take control and establish order in your life.",
      love: "Taking charge in relationships, providing stability, leadership in love",
      career: "Leadership opportunities, establishing authority, structured approach",
      health: "Taking control of health, establishing routines, discipline"
    },
    reversed: {
      general: "Lack of control, abuse of power, rigidity, poor leadership",
      love: "Control issues, domineering behavior, lack of flexibility",
      career: "Poor leadership, lack of structure, abuse of authority",
      health: "Rigid health routines, control issues with body"
    },
    element: "Fire",
    planet: "Mars",
    zodiac: "Aries",
    symbology: {
      symbols: ["Crown", "Scepter", "Shield", "Ram Heads", "Throne", "Mountain"],
      colors: ["Red", "Gold", "Orange", "Brown"],
      numbers: ["4", "Mars Symbol"],
      animals: ["Rams"],
      objects: ["Crown", "Scepter", "Shield", "Throne", "Mountain"],
      elements: ["Fire", "Mars"]
    }
  },
  {
    id: "05-the-hierophant",
    name: "The Hierophant",
    image: "/src/lib/images/tarot/Cards-png/05-TheHierophant.png",
    number: 5,
    keywords: ["Tradition", "Education", "Spirituality", "Conformity", "Guidance"],
    upright: {
      general: "The Hierophant represents tradition, education, and spiritual guidance. It suggests following established wisdom and seeking mentorship.",
      love: "Traditional relationships, spiritual connection, seeking guidance",
      career: "Following traditional paths, education, mentorship",
      health: "Traditional healing methods, spiritual wellness, guidance"
    },
    reversed: {
      general: "Breaking from tradition, questioning authority, unconventional beliefs",
      love: "Non-traditional relationships, breaking from social norms",
      career: "Breaking from traditional paths, unconventional approaches",
      health: "Alternative healing methods, breaking from conventional wisdom"
    },
    element: "Earth",
    planet: "Jupiter",
    zodiac: "Sagittarius",
    symbology: {
      symbols: ["Triple Crown", "Staff", "Keys", "Pillars", "Disciples"],
      colors: ["Red", "White", "Gold", "Blue"],
      numbers: ["5", "Jupiter Symbol"],
      animals: [],
      objects: ["Triple Crown", "Staff", "Keys", "Pillars", "Disciples"],
      elements: ["Earth", "Jupiter"]
    }
  },
  {
    id: "06-the-lovers",
    name: "The Lovers",
    image: "/src/lib/images/tarot/Cards-png/06-TheLovers.png",
    number: 6,
    keywords: ["Love", "Harmony", "Relationships", "Choices", "Unity"],
    upright: {
      general: "The Lovers represent love, harmony, and important choices. It's about alignment between heart and mind, and making decisions from love.",
      love: "Deep love connection, harmony in relationships, soulmate energy",
      career: "Following your heart in career choices, harmonious work environment",
      health: "Balance between mind and body, loving self-care"
    },
    reversed: {
      general: "Disharmony, poor choices, misalignment, conflict",
      love: "Relationship conflicts, poor choices in love, disharmony",
      career: "Conflicts at work, poor career choices, misalignment",
      health: "Mind-body disconnect, poor health choices"
    },
    element: "Air",
    planet: "Venus",
    zodiac: "Libra",
    symbology: {
      symbols: ["Angel", "Tree of Knowledge", "Serpent", "Apple", "Sun", "Moon"],
      colors: ["Blue", "Red", "Green", "Gold"],
      numbers: ["6", "Venus Symbol"],
      animals: ["Serpent"],
      objects: ["Angel", "Tree", "Apple", "Sun", "Moon"],
      elements: ["Air", "Venus"]
    }
  },
  {
    id: "07-the-chariot",
    name: "The Chariot",
    image: "/src/lib/images/tarot/Cards-png/07-TheChariot.png",
    number: 7,
    keywords: ["Victory", "Willpower", "Determination", "Success", "Control"],
    upright: {
      general: "The Chariot represents victory through determination and willpower. Success comes through focused effort and self-discipline.",
      love: "Victory in love, determination to make relationships work",
      career: "Career success, determination to achieve goals",
      health: "Victory over health challenges, determination in wellness"
    },
    reversed: {
      general: "Lack of direction, defeat, lack of control, giving up",
      love: "Lack of direction in love, giving up on relationships",
      career: "Lack of direction, defeat, giving up on goals",
      health: "Lack of direction in health, giving up on wellness"
    },
    element: "Water",
    planet: "Moon",
    zodiac: "Cancer",
    symbology: {
      symbols: ["Chariot", "Horses", "Crown", "Scepter", "Stars", "Moon"],
      colors: ["Blue", "Silver", "White", "Gold"],
      numbers: ["7", "Moon Symbol"],
      animals: ["Horses"],
      objects: ["Chariot", "Crown", "Scepter", "Stars", "Moon"],
      elements: ["Water", "Moon"]
    }
  },
  {
    id: "08-strength",
    name: "Strength",
    image: "/src/lib/images/tarot/Cards-png/08-Strength.png",
    number: 8,
    keywords: ["Inner strength", "Courage", "Patience", "Compassion", "Control"],
    upright: {
      general: "Strength represents inner power, courage, and gentle control. True strength comes from compassion and patience, not force.",
      love: "Inner strength in relationships, patience and compassion in love",
      career: "Inner strength at work, patience in achieving goals",
      health: "Inner strength for health challenges, patience in healing"
    },
    reversed: {
      general: "Self-doubt, weakness, lack of confidence, inner struggles",
      love: "Self-doubt in relationships, lack of confidence in love",
      career: "Self-doubt at work, lack of confidence in abilities",
      health: "Self-doubt about health, lack of confidence in healing"
    },
    element: "Fire",
    planet: "Sun",
    zodiac: "Leo",
    symbology: {
      symbols: ["Lion", "Infinity Symbol", "Flowers", "Mountains", "Sun"],
      colors: ["Yellow", "Orange", "White", "Blue"],
      numbers: ["8", "∞"],
      animals: ["Lion"],
      objects: ["Infinity Symbol", "Flowers", "Mountains", "Sun"],
      elements: ["Fire", "Sun"]
    }
  },
  {
    id: "09-the-hermit",
    name: "The Hermit",
    image: "/src/lib/images/tarot/Cards-png/09-TheHermit.png",
    number: 9,
    keywords: ["Solitude", "Wisdom", "Guidance", "Introspection", "Searching"],
    upright: {
      general: "The Hermit represents solitude, inner wisdom, and spiritual guidance. It's time for introspection and finding answers within.",
      love: "Time for self-reflection in love, seeking inner wisdom about relationships",
      career: "Seeking guidance, introspection about career path",
      health: "Inner guidance for health, spiritual approach to wellness"
    },
    reversed: {
      general: "Isolation, loneliness, withdrawal, lack of guidance",
      love: "Isolation in love, withdrawal from relationships",
      career: "Isolation at work, withdrawal from career goals",
      health: "Isolation in health journey, withdrawal from wellness"
    },
    element: "Earth",
    planet: "Mercury",
    zodiac: "Virgo",
    symbology: {
      symbols: ["Lantern", "Staff", "Mountain", "Star", "Grey Robe"],
      colors: ["Grey", "Blue", "White", "Yellow"],
      numbers: ["9", "Mercury Symbol"],
      animals: [],
      objects: ["Lantern", "Staff", "Mountain", "Star", "Grey Robe"],
      elements: ["Earth", "Mercury"]
    }
  },
  {
    id: "10-wheel-of-fortune",
    name: "Wheel of Fortune",
    image: "/src/lib/images/tarot/Cards-png/10-WheelOfFortune.png",
    number: 10,
    keywords: ["Change", "Cycles", "Fate", "Opportunity", "Destiny"],
    upright: {
      general: "The Wheel of Fortune represents change, cycles, and destiny. Life is constantly changing, and new opportunities are coming.",
      love: "Changes in love life, new romantic opportunities, destiny in relationships",
      career: "Career changes, new opportunities, destiny in work",
      health: "Changes in health, new wellness opportunities, destiny in healing"
    },
    reversed: {
      general: "Bad luck, resistance to change, missed opportunities",
      love: "Bad luck in love, resistance to relationship changes",
      career: "Bad luck at work, resistance to career changes",
      health: "Bad luck with health, resistance to health changes"
    },
    element: "Fire",
    planet: "Jupiter",
    zodiac: "Sagittarius",
    symbology: {
      symbols: ["Wheel", "Sphinx", "Anubis", "Hermanubis", "Four Evangelists", "Hebrew Letters"],
      colors: ["Blue", "Red", "Gold", "White"],
      numbers: ["10", "Jupiter Symbol"],
      animals: ["Sphinx", "Anubis", "Hermanubis"],
      objects: ["Wheel", "Four Evangelists", "Hebrew Letters"],
      elements: ["Fire", "Jupiter"]
    }
  },
  {
    id: "11-justice",
    name: "Justice",
    image: "/src/lib/images/tarot/Cards-png/11-Justice.png",
    number: 11,
    keywords: ["Justice", "Fairness", "Truth", "Law", "Balance"],
    upright: {
      general: "Justice represents fairness, truth, and balance. It's about making fair decisions and finding equilibrium in your life.",
      love: "Fairness in relationships, truth in love, balance in partnerships",
      career: "Fair treatment at work, truth in career decisions, balance",
      health: "Fair approach to health, truth about wellness, balance"
    },
    reversed: {
      general: "Unfairness, dishonesty, lack of balance, injustice",
      love: "Unfairness in relationships, dishonesty in love",
      career: "Unfair treatment at work, dishonesty in career",
      health: "Unfair approach to health, dishonesty about wellness"
    },
    element: "Air",
    planet: "Venus",
    zodiac: "Libra",
    symbology: {
      symbols: ["Scales", "Sword", "Crown", "Pillars", "Purple Curtain"],
      colors: ["Purple", "Red", "Gold", "White"],
      numbers: ["11", "Venus Symbol"],
      animals: [],
      objects: ["Scales", "Sword", "Crown", "Pillars", "Purple Curtain"],
      elements: ["Air", "Venus"]
    }
  },
  {
    id: "12-the-hanged-man",
    name: "The Hanged Man",
    image: "/src/lib/images/tarot/Cards-png/12-TheHangedMan.png",
    number: 12,
    keywords: ["Sacrifice", "Surrender", "New perspective", "Suspension", "Enlightenment"],
    upright: {
      general: "The Hanged Man represents sacrifice, surrender, and new perspectives. Sometimes we need to let go to gain new insights.",
      love: "Sacrifice for love, surrendering to relationships, new perspective on love",
      career: "Sacrifice for career, surrendering to work, new perspective",
      health: "Sacrifice for health, surrendering to healing, new perspective"
    },
    reversed: {
      general: "Resistance to change, stalling, indecision, lack of sacrifice",
      love: "Resistance to love changes, stalling in relationships",
      career: "Resistance to career changes, stalling in work",
      health: "Resistance to health changes, stalling in healing"
    },
    element: "Water",
    planet: "Neptune",
    zodiac: "Pisces",
    symbology: {
      symbols: ["Hanged Man", "Tree", "Rope", "Halo", "Crossed Legs"],
      colors: ["Blue", "Yellow", "Red", "Green"],
      numbers: ["12", "Neptune Symbol"],
      animals: [],
      objects: ["Tree", "Rope", "Halo"],
      elements: ["Water", "Neptune"]
    }
  },
  {
    id: "13-death",
    name: "Death",
    image: "/src/lib/images/tarot/Cards-png/13-Death.png",
    number: 13,
    keywords: ["Transformation", "Endings", "Change", "Rebirth", "Transition"],
    upright: {
      general: "Death represents transformation, endings, and rebirth. It's about letting go of the old to make way for the new.",
      love: "Transformation in relationships, ending old love patterns, rebirth in love",
      career: "Transformation in career, ending old work patterns, rebirth",
      health: "Transformation in health, ending old patterns, rebirth"
    },
    reversed: {
      general: "Resistance to change, inability to let go, stagnation",
      love: "Resistance to relationship changes, inability to let go",
      career: "Resistance to career changes, inability to let go",
      health: "Resistance to health changes, inability to let go"
    },
    element: "Water",
    planet: "Pluto",
    zodiac: "Scorpio",
    symbology: {
      symbols: ["Skeleton", "Black Flag", "White Rose", "Horse", "Bishop"],
      colors: ["Black", "White", "Red", "Grey"],
      numbers: ["13", "Pluto Symbol"],
      animals: ["Skeleton Horse"],
      objects: ["Black Flag", "White Rose", "Bishop"],
      elements: ["Water", "Pluto"]
    }
  },
  {
    id: "14-temperance",
    name: "Temperance",
    image: "/src/lib/images/tarot/Cards-png/14-Temperance.png",
    number: 14,
    keywords: ["Balance", "Moderation", "Patience", "Harmony", "Integration"],
    upright: {
      general: "Temperance represents balance, moderation, and patience. It's about finding harmony and integrating different aspects of life.",
      love: "Balance in relationships, moderation in love, harmony in partnerships",
      career: "Balance in work, moderation in career, harmony",
      health: "Balance in health, moderation in wellness, harmony"
    },
    reversed: {
      general: "Imbalance, excess, lack of patience, disharmony",
      love: "Imbalance in relationships, excess in love, disharmony",
      career: "Imbalance at work, excess in career, disharmony",
      health: "Imbalance in health, excess in wellness, disharmony"
    },
    element: "Fire",
    planet: "Jupiter",
    zodiac: "Sagittarius",
    symbology: {
      symbols: ["Angel", "Cups", "Path", "Sun", "Mountain", "Crown"],
      colors: ["Blue", "Orange", "Yellow", "White"],
      numbers: ["14", "Jupiter Symbol"],
      animals: ["Angel"],
      objects: ["Cups", "Path", "Sun", "Mountain", "Crown"],
      elements: ["Fire", "Jupiter"]
    }
  },
  {
    id: "15-the-devil",
    name: "The Devil",
    image: "/src/lib/images/tarot/Cards-png/15-TheDevil.png",
    number: 15,
    keywords: ["Temptation", "Bondage", "Materialism", "Shadow self", "Addiction"],
    upright: {
      general: "The Devil represents temptation, bondage, and materialism. It's about recognizing unhealthy attachments and breaking free.",
      love: "Unhealthy attachments in love, toxic relationships, temptation",
      career: "Unhealthy attachments to work, toxic work environment, temptation",
      health: "Unhealthy attachments to habits, toxic health patterns, temptation"
    },
    reversed: {
      general: "Breaking free, release from bondage, overcoming temptation",
      love: "Breaking free from toxic love, release from unhealthy attachments",
      career: "Breaking free from toxic work, release from unhealthy attachments",
      health: "Breaking free from toxic habits, release from unhealthy patterns"
    },
    element: "Earth",
    planet: "Saturn",
    zodiac: "Capricorn",
    symbology: {
      symbols: ["Devil", "Chains", "Pentagram", "Torch", "Naked Figures"],
      colors: ["Black", "Red", "Grey", "Orange"],
      numbers: ["15", "Saturn Symbol"],
      animals: ["Devil"],
      objects: ["Chains", "Pentagram", "Torch"],
      elements: ["Earth", "Saturn"]
    }
  },
  {
    id: "16-the-tower",
    name: "The Tower",
    image: "/src/lib/images/tarot/Cards-png/16-TheTower.png",
    number: 16,
    keywords: ["Sudden change", "Disaster", "Revelation", "Chaos", "Awakening"],
    upright: {
      general: "The Tower represents sudden change, disaster, and revelation. It's about the destruction of false beliefs and awakening to truth.",
      love: "Sudden changes in love, destruction of false beliefs about relationships",
      career: "Sudden changes at work, destruction of false beliefs about career",
      health: "Sudden changes in health, destruction of false beliefs about wellness"
    },
    reversed: {
      general: "Avoiding disaster, gradual change, fear of change",
      love: "Avoiding relationship disaster, gradual changes in love",
      career: "Avoiding career disaster, gradual changes at work",
      health: "Avoiding health disaster, gradual changes in wellness"
    },
    element: "Fire",
    planet: "Mars",
    zodiac: "Aries"
  },
  {
    id: "17-the-star",
    name: "The Star",
    image: "/src/lib/images/tarot/Cards-png/17-TheStar.png",
    number: 17,
    keywords: ["Hope", "Inspiration", "Optimism", "Faith", "Healing"],
    upright: {
      general: "The Star represents hope, inspiration, and optimism. It's about having faith in the future and finding healing through hope.",
      love: "Hope in love, inspiration in relationships, optimism about love",
      career: "Hope in career, inspiration at work, optimism about future",
      health: "Hope in healing, inspiration for wellness, optimism about health"
    },
    reversed: {
      general: "Lack of hope, pessimism, loss of faith, despair",
      love: "Lack of hope in love, pessimism about relationships",
      career: "Lack of hope in career, pessimism about work",
      health: "Lack of hope in healing, pessimism about health"
    },
    element: "Air",
    planet: "Uranus",
    zodiac: "Aquarius"
  },
  {
    id: "18-the-moon",
    name: "The Moon",
    image: "/src/lib/images/tarot/Cards-png/18-TheMoon.png",
    number: 18,
    keywords: ["Illusion", "Intuition", "Fear", "Subconscious", "Mystery"],
    upright: {
      general: "The Moon represents illusion, intuition, and the subconscious. It's about trusting your intuition and facing your fears.",
      love: "Intuition in love, facing fears in relationships, subconscious patterns",
      career: "Intuition at work, facing fears in career, subconscious patterns",
      health: "Intuition about health, facing fears about wellness, subconscious patterns"
    },
    reversed: {
      general: "Releasing illusions, clarity, overcoming fears, truth revealed",
      love: "Releasing love illusions, clarity in relationships, overcoming fears",
      career: "Releasing career illusions, clarity at work, overcoming fears",
      health: "Releasing health illusions, clarity about wellness, overcoming fears"
    },
    element: "Water",
    planet: "Neptune",
    zodiac: "Pisces"
  },
  {
    id: "19-the-sun",
    name: "The Sun",
    image: "/src/lib/images/tarot/Cards-png/19-TheSun.png",
    number: 19,
    keywords: ["Joy", "Success", "Vitality", "Optimism", "Happiness"],
    upright: {
      general: "The Sun represents joy, success, and vitality. It's about experiencing happiness and positive energy in your life.",
      love: "Joy in love, success in relationships, happiness in partnerships",
      career: "Joy at work, success in career, happiness in achievements",
      health: "Joy in health, success in wellness, vitality and energy"
    },
    reversed: {
      general: "Temporary depression, lack of success, inner child issues",
      love: "Temporary sadness in love, lack of success in relationships",
      career: "Temporary setbacks at work, lack of success in career",
      health: "Temporary health issues, lack of vitality, inner child healing"
    },
    element: "Fire",
    planet: "Sun",
    zodiac: "Leo"
  },
  {
    id: "20-judgement",
    name: "Judgement",
    image: "/src/lib/images/tarot/Cards-png/20-Judgement.png",
    number: 20,
    keywords: ["Rebirth", "Awakening", "Redemption", "Calling", "Transformation"],
    upright: {
      general: "Judgement represents rebirth, awakening, and redemption. It's about answering your calling and experiencing spiritual transformation.",
      love: "Rebirth in love, awakening to true love, redemption in relationships",
      career: "Rebirth in career, awakening to true calling, redemption at work",
      health: "Rebirth in health, awakening to true wellness, redemption in healing"
    },
    reversed: {
      general: "Self-doubt, inner critic, fear of judgement, missed calling",
      love: "Self-doubt in love, fear of judgement in relationships",
      career: "Self-doubt in career, fear of judgement at work",
      health: "Self-doubt about health, fear of judgement about wellness"
    },
    element: "Fire",
    planet: "Pluto",
    zodiac: "Scorpio"
  },
  {
    id: "21-the-world",
    name: "The World",
    image: "/src/lib/images/tarot/Cards-png/21-TheWorld.png",
    number: 21,
    keywords: ["Completion", "Integration", "Wholeness", "Achievement", "Travel"],
    upright: {
      general: "The World represents completion, integration, and wholeness. It's about achieving your goals and feeling complete.",
      love: "Completion in love, integration of relationships, wholeness in partnerships",
      career: "Completion in career, integration of work, achievement of goals",
      health: "Completion in health journey, integration of wellness, wholeness"
    },
    reversed: {
      general: "Lack of completion, feeling incomplete, unfinished business",
      love: "Lack of completion in love, feeling incomplete in relationships",
      career: "Lack of completion in career, feeling incomplete at work",
      health: "Lack of completion in health, feeling incomplete in wellness"
    },
    element: "Earth",
    planet: "Saturn",
    zodiac: "Capricorn"
  }
];

export const MINOR_ARCANA: TarotCard[] = [
  // Wands Suit
  {
    id: "wands-01",
    name: "Ace of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands01.png",
    suit: "Wands",
    number: 1,
    keywords: ["New opportunities", "Inspiration", "Creative spark", "Potential", "Growth"],
    upright: {
      general: "The Ace of Wands represents new opportunities, inspiration, and creative potential. A spark of energy is igniting new possibilities.",
      love: "New romantic opportunities, creative spark in relationships, potential for love",
      career: "New career opportunities, creative inspiration, potential for growth",
      health: "New health opportunities, creative approaches to wellness, potential for vitality"
    },
    reversed: {
      general: "Missed opportunities, lack of inspiration, creative blocks",
      love: "Missed romantic opportunities, lack of inspiration in love",
      career: "Missed career opportunities, lack of inspiration at work",
      health: "Missed health opportunities, lack of inspiration for wellness"
    },
    element: "Fire",
    zodiac: "Aries",
    symbology: {
      symbols: ["Wand", "Leaves", "Castle", "Hand", "Sun"],
      colors: ["Yellow", "Green", "Blue", "White"],
      numbers: ["1", "Aries Symbol"],
      animals: [],
      objects: ["Wand", "Leaves", "Castle", "Hand", "Sun"],
      elements: ["Fire", "Aries"]
    }
  },
  {
    id: "wands-02",
    name: "Two of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands02.png",
    suit: "Wands",
    number: 2,
    keywords: ["Planning", "Future vision", "Decisions", "Discovery", "Progress"],
    upright: {
      general: "The Two of Wands represents planning, future vision, and making decisions about your path forward.",
      love: "Planning for future in relationships, vision for love, decisions about love",
      career: "Planning for career future, vision for work, decisions about career",
      health: "Planning for health future, vision for wellness, decisions about health"
    },
    reversed: {
      general: "Lack of planning, fear of future, poor decisions, lack of vision",
      love: "Lack of planning in love, fear of future in relationships",
      career: "Lack of career planning, fear of future at work",
      health: "Lack of health planning, fear of future wellness"
    },
    element: "Fire",
    symbology: {
      symbols: ["Two Wands", "Globe", "Compass", "Castle", "Ocean"],
      colors: ["Red", "Blue", "Yellow", "White"],
      numbers: ["2"],
      animals: [],
      objects: ["Two Wands", "Globe", "Compass", "Castle", "Ocean"],
      elements: ["Fire"]
    }
  },
  {
    id: "wands-03",
    name: "Three of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands03.png",
    suit: "Wands",
    number: 3,
    keywords: ["Expansion", "Adventure", "Growth", "Opportunities", "Exploration"],
    upright: {
      general: "The Three of Wands represents expansion, adventure, and growth. New opportunities are opening up for exploration.",
      love: "Expansion in love, adventure in relationships, growth in partnerships",
      career: "Expansion in career, adventure at work, growth opportunities",
      health: "Expansion in health, adventure in wellness, growth in healing"
    },
    reversed: {
      general: "Lack of expansion, missed opportunities, fear of adventure",
      love: "Lack of expansion in love, missed opportunities in relationships",
      career: "Lack of expansion in career, missed opportunities at work",
      health: "Lack of expansion in health, missed opportunities in wellness"
    },
    element: "Fire"
  },
  {
    id: "wands-04",
    name: "Four of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands04.png",
    suit: "Wands",
    number: 4,
    keywords: ["Celebration", "Harmony", "Home", "Community", "Stability"],
    upright: {
      general: "The Four of Wands represents celebration, harmony, and stability. It's a time of joy and peaceful contentment.",
      love: "Celebration in love, harmony in relationships, stability in partnerships",
      career: "Celebration at work, harmony in career, stability in job",
      health: "Celebration of health, harmony in wellness, stability in healing"
    },
    reversed: {
      general: "Lack of celebration, disharmony, instability, conflict",
      love: "Lack of celebration in love, disharmony in relationships",
      career: "Lack of celebration at work, disharmony in career",
      health: "Lack of celebration in health, disharmony in wellness"
    },
    element: "Fire"
  },
  {
    id: "wands-05",
    name: "Five of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands05.png",
    suit: "Wands",
    number: 5,
    keywords: ["Conflict", "Competition", "Challenges", "Rivalry", "Struggle"],
    upright: {
      general: "The Five of Wands represents conflict, competition, and challenges. It's about facing obstacles and learning from them.",
      love: "Conflict in relationships, competition in love, challenges in partnerships",
      career: "Conflict at work, competition in career, challenges in job",
      health: "Conflict in health, competition in wellness, challenges in healing"
    },
    reversed: {
      general: "Avoiding conflict, inner peace, resolution, harmony",
      love: "Avoiding conflict in love, inner peace in relationships",
      career: "Avoiding conflict at work, inner peace in career",
      health: "Avoiding conflict in health, inner peace in wellness"
    },
    element: "Fire"
  },
  {
    id: "wands-06",
    name: "Six of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands06.png",
    suit: "Wands",
    number: 6,
    keywords: ["Victory", "Success", "Recognition", "Progress", "Confidence"],
    upright: {
      general: "The Six of Wands represents victory, success, and recognition. Your efforts are being acknowledged and celebrated.",
      love: "Victory in love, success in relationships, recognition in partnerships",
      career: "Victory at work, success in career, recognition in job",
      health: "Victory in health, success in wellness, recognition in healing"
    },
    reversed: {
      general: "Lack of recognition, private success, arrogance, false confidence",
      love: "Lack of recognition in love, private success in relationships",
      career: "Lack of recognition at work, private success in career",
      health: "Lack of recognition in health, private success in wellness"
    },
    element: "Fire"
  },
  {
    id: "wands-07",
    name: "Seven of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands07.png",
    suit: "Wands",
    number: 7,
    keywords: ["Defense", "Protection", "Standing ground", "Challenges", "Perseverance"],
    upright: {
      general: "The Seven of Wands represents defense, protection, and standing your ground. You're defending what's important to you.",
      love: "Defending relationships, protecting love, standing ground in partnerships",
      career: "Defending career, protecting work, standing ground in job",
      health: "Defending health, protecting wellness, standing ground in healing"
    },
    reversed: {
      general: "Giving up, overwhelmed, defensive, paranoia",
      love: "Giving up in love, overwhelmed in relationships, defensive",
      career: "Giving up at work, overwhelmed in career, defensive",
      health: "Giving up on health, overwhelmed in wellness, defensive"
    },
    element: "Fire"
  },
  {
    id: "wands-08",
    name: "Eight of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands08.png",
    suit: "Wands",
    number: 8,
    keywords: ["Movement", "Action", "Progress", "Speed", "Energy"],
    upright: {
      general: "The Eight of Wands represents movement, action, and rapid progress. Things are moving quickly in your favor.",
      love: "Movement in love, action in relationships, progress in partnerships",
      career: "Movement in career, action at work, progress in job",
      health: "Movement in health, action in wellness, progress in healing"
    },
    reversed: {
      general: "Delays, lack of movement, slow progress, frustration",
      love: "Delays in love, lack of movement in relationships",
      career: "Delays in career, lack of movement at work",
      health: "Delays in health, lack of movement in wellness"
    },
    element: "Fire"
  },
  {
    id: "wands-09",
    name: "Nine of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands09.png",
    suit: "Wands",
    number: 9,
    keywords: ["Resilience", "Persistence", "Last stand", "Defense", "Courage"],
    upright: {
      general: "The Nine of Wands represents resilience, persistence, and courage. You're making your final stand with determination.",
      love: "Resilience in love, persistence in relationships, courage in partnerships",
      career: "Resilience at work, persistence in career, courage in job",
      health: "Resilience in health, persistence in wellness, courage in healing"
    },
    reversed: {
      general: "Exhaustion, giving up, lack of resilience, defeat",
      love: "Exhaustion in love, giving up on relationships, lack of resilience",
      career: "Exhaustion at work, giving up on career, lack of resilience",
      health: "Exhaustion in health, giving up on wellness, lack of resilience"
    },
    element: "Fire"
  },
  {
    id: "wands-10",
    name: "Ten of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands10.png",
    suit: "Wands",
    number: 10,
    keywords: ["Burden", "Responsibility", "Hard work", "Stress", "Overwhelm"],
    upright: {
      general: "The Ten of Wands represents burden, responsibility, and hard work. You're carrying a heavy load but nearing completion.",
      love: "Burden in relationships, responsibility in love, hard work in partnerships",
      career: "Burden at work, responsibility in career, hard work in job",
      health: "Burden in health, responsibility in wellness, hard work in healing"
    },
    reversed: {
      general: "Releasing burdens, delegation, completion, relief",
      love: "Releasing burdens in love, delegation in relationships",
      career: "Releasing burdens at work, delegation in career",
      health: "Releasing burdens in health, delegation in wellness"
    },
    element: "Fire"
  },
  {
    id: "wands-11",
    name: "Page of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands11.png",
    suit: "Wands",
    keywords: ["Exploration", "Excitement", "Freedom", "Adventure", "New ideas"],
    upright: {
      general: "The Page of Wands represents exploration, excitement, and new ideas. A message of adventure and creative potential is coming.",
      love: "Exploration in love, excitement in relationships, new ideas about love",
      career: "Exploration in career, excitement at work, new ideas about job",
      health: "Exploration in health, excitement in wellness, new ideas about healing"
    },
    reversed: {
      general: "Lack of direction, procrastination, creating conflict, all talk and no action",
      love: "Lack of direction in love, procrastination in relationships",
      career: "Lack of direction in career, procrastination at work",
      health: "Lack of direction in health, procrastination in wellness"
    },
    element: "Fire"
  },
  {
    id: "wands-12",
    name: "Knight of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands12.png",
    suit: "Wands",
    keywords: ["Energy", "Passion", "Adventure", "Impulsiveness", "Enthusiasm"],
    upright: {
      general: "The Knight of Wands represents energy, passion, and adventure. A passionate and energetic person or situation is coming.",
      love: "Energy in love, passion in relationships, adventure in partnerships",
      career: "Energy at work, passion in career, adventure in job",
      health: "Energy in health, passion in wellness, adventure in healing"
    },
    reversed: {
      general: "Anger, impulsiveness, recklessness, lack of direction",
      love: "Anger in love, impulsiveness in relationships, recklessness",
      career: "Anger at work, impulsiveness in career, recklessness",
      health: "Anger in health, impulsiveness in wellness, recklessness"
    },
    element: "Fire"
  },
  {
    id: "wands-13",
    name: "Queen of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands13.png",
    suit: "Wands",
    keywords: ["Courageous", "Determined", "Independent", "Vivacious", "Warm"],
    upright: {
      general: "The Queen of Wands represents courage, determination, and independence. She's a warm and vivacious leader.",
      love: "Courageous love, determined relationships, independent partnerships",
      career: "Courageous career, determined work, independent job",
      health: "Courageous health, determined wellness, independent healing"
    },
    reversed: {
      general: "Selfishness, jealousy, insecurities, dependence on others",
      love: "Selfishness in love, jealousy in relationships, insecurities",
      career: "Selfishness at work, jealousy in career, insecurities",
      health: "Selfishness in health, jealousy in wellness, insecurities"
    },
    element: "Fire"
  },
  {
    id: "wands-14",
    name: "King of Wands",
    image: "/src/lib/images/tarot/Cards-png/Wands14.png",
    suit: "Wands",
    keywords: ["Natural leader", "Visionary", "Entrepreneur", "Honest", "Inspiring"],
    upright: {
      general: "The King of Wands represents natural leadership, vision, and inspiration. He's an honest and visionary leader.",
      love: "Natural leadership in love, visionary relationships, inspiring partnerships",
      career: "Natural leadership at work, visionary career, inspiring job",
      health: "Natural leadership in health, visionary wellness, inspiring healing"
    },
    reversed: {
      general: "Impulsiveness, overbearing, unachievable expectations, self-righteousness",
      love: "Impulsiveness in love, overbearing in relationships, self-righteousness",
      career: "Impulsiveness at work, overbearing in career, self-righteousness",
      health: "Impulsiveness in health, overbearing in wellness, self-righteousness"
    },
    element: "Fire"
  }
];

// Add Cups, Swords, and Pentacles suits (abbreviated for space)
export const CUPS_SUIT: TarotCard[] = [
  {
    id: "cups-01",
    name: "Ace of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups01.png",
    suit: "Cups",
    number: 1,
    keywords: ["New love", "Emotional opportunity", "Intuition", "Creativity", "Spirituality"],
    upright: {
      general: "The Ace of Cups represents new love, emotional opportunities, and spiritual awakening. A new emotional beginning is here.",
      love: "New love, emotional opportunity, spiritual connection in relationships",
      career: "New emotional opportunity at work, creative inspiration, spiritual approach",
      health: "New emotional opportunity in health, spiritual healing, creative wellness"
    },
    reversed: {
      general: "Emotional loss, blocked creativity, emptiness, lack of inspiration",
      love: "Emotional loss in love, blocked creativity in relationships",
      career: "Emotional loss at work, blocked creativity in career",
      health: "Emotional loss in health, blocked creativity in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-02",
    name: "Two of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups02.png",
    suit: "Cups",
    number: 2,
    keywords: ["Partnership", "Connection", "Harmony", "Mutual attraction", "Balance"],
    upright: {
      general: "The Two of Cups represents partnership, connection, and mutual attraction. It's about finding harmony and balance in relationships.",
      love: "Deep connection, mutual attraction, harmonious partnership, soulmate energy",
      career: "Partnership at work, harmonious collaboration, mutual respect",
      health: "Partnership in health journey, harmonious wellness, balance"
    },
    reversed: {
      general: "Disconnection, imbalance, broken partnerships, disharmony",
      love: "Disconnection in love, broken partnerships, disharmony",
      career: "Disconnection at work, broken partnerships, disharmony",
      health: "Disconnection in health, broken partnerships, disharmony"
    },
    element: "Water"
  },
  {
    id: "cups-03",
    name: "Three of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups03.png",
    suit: "Cups",
    number: 3,
    keywords: ["Celebration", "Friendship", "Joy", "Community", "Abundance"],
    upright: {
      general: "The Three of Cups represents celebration, friendship, and joy. It's about community, abundance, and shared happiness.",
      love: "Celebration in love, friendship in relationships, joy in partnerships",
      career: "Celebration at work, friendship with colleagues, joy in career",
      health: "Celebration of health, friendship in wellness, joy in healing"
    },
    reversed: {
      general: "Lack of celebration, isolation, overindulgence, gossip",
      love: "Lack of celebration in love, isolation in relationships",
      career: "Lack of celebration at work, isolation in career",
      health: "Lack of celebration in health, isolation in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-04",
    name: "Four of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups04.png",
    suit: "Cups",
    number: 4,
    keywords: ["Apathy", "Boredom", "Discontent", "Missed opportunities", "Meditation"],
    upright: {
      general: "The Four of Cups represents apathy, boredom, and discontent. It suggests looking inward and finding new meaning.",
      love: "Apathy in love, boredom in relationships, discontent in partnerships",
      career: "Apathy at work, boredom in career, discontent in job",
      health: "Apathy about health, boredom in wellness, discontent in healing"
    },
    reversed: {
      general: "New opportunities, awakening, fresh perspective, renewed interest",
      love: "New opportunities in love, awakening in relationships",
      career: "New opportunities at work, awakening in career",
      health: "New opportunities in health, awakening in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-05",
    name: "Five of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups05.png",
    suit: "Cups",
    number: 5,
    keywords: ["Loss", "Grief", "Disappointment", "Regret", "Focus on negative"],
    upright: {
      general: "The Five of Cups represents loss, grief, and disappointment. It's about focusing on what's been lost rather than what remains.",
      love: "Loss in love, grief in relationships, disappointment in partnerships",
      career: "Loss at work, grief in career, disappointment in job",
      health: "Loss in health, grief in wellness, disappointment in healing"
    },
    reversed: {
      general: "Acceptance, moving on, finding hope, new perspective",
      love: "Acceptance in love, moving on in relationships, finding hope",
      career: "Acceptance at work, moving on in career, finding hope",
      health: "Acceptance in health, moving on in wellness, finding hope"
    },
    element: "Water"
  },
  {
    id: "cups-06",
    name: "Six of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups06.png",
    suit: "Cups",
    number: 6,
    keywords: ["Nostalgia", "Childhood memories", "Innocence", "Reunion", "Sweet memories"],
    upright: {
      general: "The Six of Cups represents nostalgia, childhood memories, and innocence. It's about reconnecting with the past and finding joy in memories.",
      love: "Nostalgia in love, childhood memories in relationships, innocence",
      career: "Nostalgia at work, childhood memories in career, innocence",
      health: "Nostalgia in health, childhood memories in wellness, innocence"
    },
    reversed: {
      general: "Living in the past, unrealistic memories, moving forward",
      love: "Living in the past in love, unrealistic memories in relationships",
      career: "Living in the past at work, unrealistic memories in career",
      health: "Living in the past in health, unrealistic memories in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-07",
    name: "Seven of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups07.png",
    suit: "Cups",
    number: 7,
    keywords: ["Choices", "Illusion", "Fantasy", "Overwhelm", "Daydreaming"],
    upright: {
      general: "The Seven of Cups represents choices, illusion, and fantasy. It's about having many options but needing to distinguish reality from dreams.",
      love: "Many choices in love, illusion in relationships, fantasy in partnerships",
      career: "Many choices at work, illusion in career, fantasy in job",
      health: "Many choices in health, illusion in wellness, fantasy in healing"
    },
    reversed: {
      general: "Clarity, making choices, reality check, focus",
      love: "Clarity in love, making choices in relationships, reality check",
      career: "Clarity at work, making choices in career, reality check",
      health: "Clarity in health, making choices in wellness, reality check"
    },
    element: "Water"
  },
  {
    id: "cups-08",
    name: "Eight of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups08.png",
    suit: "Cups",
    number: 8,
    keywords: ["Walking away", "Disillusionment", "Abandonment", "Search for meaning", "Spiritual journey"],
    upright: {
      general: "The Eight of Cups represents walking away, disillusionment, and the search for deeper meaning. It's about leaving behind what no longer serves you.",
      love: "Walking away from love, disillusionment in relationships, search for meaning",
      career: "Walking away from work, disillusionment in career, search for meaning",
      health: "Walking away from old health habits, disillusionment in wellness"
    },
    reversed: {
      general: "Fear of change, staying in comfort zone, avoiding necessary endings",
      love: "Fear of change in love, staying in comfort zone in relationships",
      career: "Fear of change at work, staying in comfort zone in career",
      health: "Fear of change in health, staying in comfort zone in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-09",
    name: "Nine of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups09.png",
    suit: "Cups",
    number: 9,
    keywords: ["Wishes fulfilled", "Contentment", "Satisfaction", "Emotional stability", "Luxury"],
    upright: {
      general: "The Nine of Cups represents wishes fulfilled, contentment, and satisfaction. It's about emotional fulfillment and having your desires met.",
      love: "Wishes fulfilled in love, contentment in relationships, satisfaction",
      career: "Wishes fulfilled at work, contentment in career, satisfaction",
      health: "Wishes fulfilled in health, contentment in wellness, satisfaction"
    },
    reversed: {
      general: "Inner happiness, self-satisfaction, materialism, overindulgence",
      love: "Inner happiness in love, self-satisfaction in relationships",
      career: "Inner happiness at work, self-satisfaction in career",
      health: "Inner happiness in health, self-satisfaction in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-10",
    name: "Ten of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups10.png",
    suit: "Cups",
    number: 10,
    keywords: ["Divine love", "Harmony", "Family", "Joy", "Emotional fulfillment"],
    upright: {
      general: "The Ten of Cups represents divine love, harmony, and emotional fulfillment. It's about achieving complete happiness and family harmony.",
      love: "Divine love, harmony in relationships, emotional fulfillment",
      career: "Divine love at work, harmony in career, emotional fulfillment",
      health: "Divine love in health, harmony in wellness, emotional fulfillment"
    },
    reversed: {
      general: "Disconnection, lack of harmony, family problems, emotional emptiness",
      love: "Disconnection in love, lack of harmony in relationships",
      career: "Disconnection at work, lack of harmony in career",
      health: "Disconnection in health, lack of harmony in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-11",
    name: "Page of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups11.png",
    suit: "Cups",
    keywords: ["Creative opportunities", "Intuitive messages", "Curiosity", "Possibility", "New ideas"],
    upright: {
      general: "The Page of Cups represents creative opportunities, intuitive messages, and new ideas. A message of emotional or creative inspiration is coming.",
      love: "Creative opportunities in love, intuitive messages about relationships",
      career: "Creative opportunities at work, intuitive messages about career",
      health: "Creative opportunities in health, intuitive messages about wellness"
    },
    reversed: {
      general: "New ideas, doubting intuition, creative blocks, emotional manipulation",
      love: "New ideas in love, doubting intuition in relationships",
      career: "New ideas at work, doubting intuition in career",
      health: "New ideas in health, doubting intuition in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-12",
    name: "Knight of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups12.png",
    suit: "Cups",
    keywords: ["Creativity", "Romance", "Charm", "Imagination", "Following the heart"],
    upright: {
      general: "The Knight of Cups represents creativity, romance, and following your heart. A romantic and creative person or situation is coming.",
      love: "Creativity in love, romance in relationships, following the heart",
      career: "Creativity at work, romance in career, following the heart",
      health: "Creativity in health, romance in wellness, following the heart"
    },
    reversed: {
      general: "Overactive imagination, unrealistic expectations, jealousy, moodiness",
      love: "Overactive imagination in love, unrealistic expectations in relationships",
      career: "Overactive imagination at work, unrealistic expectations in career",
      health: "Overactive imagination in health, unrealistic expectations in wellness"
    },
    element: "Water"
  },
  {
    id: "cups-13",
    name: "Queen of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups13.png",
    suit: "Cups",
    keywords: ["Compassionate", "Caring", "Emotionally stable", "Intuitive", "Nurturing"],
    upright: {
      general: "The Queen of Cups represents compassion, emotional stability, and intuition. She's a nurturing and caring presence.",
      love: "Compassionate love, caring relationships, emotionally stable partnerships",
      career: "Compassionate work, caring career, emotionally stable job",
      health: "Compassionate health, caring wellness, emotionally stable healing"
    },
    reversed: {
      general: "Inner feelings, self-care, self-compassion, withdrawal",
      love: "Inner feelings in love, self-care in relationships, self-compassion",
      career: "Inner feelings at work, self-care in career, self-compassion",
      health: "Inner feelings in health, self-care in wellness, self-compassion"
    },
    element: "Water"
  },
  {
    id: "cups-14",
    name: "King of Cups",
    image: "/src/lib/images/tarot/Cards-png/Cups14.png",
    suit: "Cups",
    keywords: ["Emotional balance", "Generosity", "Diplomacy", "Wisdom", "Compassion"],
    upright: {
      general: "The King of Cups represents emotional balance, generosity, and wisdom. He's a compassionate and diplomatic leader.",
      love: "Emotional balance in love, generous relationships, wise partnerships",
      career: "Emotional balance at work, generous career, wise job",
      health: "Emotional balance in health, generous wellness, wise healing"
    },
    reversed: {
      general: "Coldness, moodiness, bad advice, manipulation",
      love: "Coldness in love, moodiness in relationships, bad advice",
      career: "Coldness at work, moodiness in career, bad advice",
      health: "Coldness in health, moodiness in wellness, bad advice"
    },
    element: "Water"
  }
];

export const SWORDS_SUIT: TarotCard[] = [
  {
    id: "swords-01",
    name: "Ace of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords01.png",
    suit: "Swords",
    number: 1,
    keywords: ["Mental clarity", "Breakthrough", "New ideas", "Truth", "Justice"],
    upright: {
      general: "The Ace of Swords represents mental clarity, breakthrough, and new ideas. A moment of clear thinking and truth is here.",
      love: "Mental clarity in love, breakthrough in relationships, new ideas about love",
      career: "Mental clarity at work, breakthrough in career, new ideas about job",
      health: "Mental clarity about health, breakthrough in wellness, new ideas about healing"
    },
    reversed: {
      general: "Confusion, lack of clarity, chaos, violence",
      love: "Confusion in love, lack of clarity in relationships",
      career: "Confusion at work, lack of clarity in career",
      health: "Confusion about health, lack of clarity in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-02",
    name: "Two of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords02.png",
    suit: "Swords",
    number: 2,
    keywords: ["Difficult choices", "Indecision", "Stalemate", "Blocked emotions", "Truce"],
    upright: {
      general: "The Two of Swords represents difficult choices, indecision, and stalemate. It's about being stuck between two options.",
      love: "Difficult choices in love, indecision in relationships, stalemate in partnerships",
      career: "Difficult choices at work, indecision in career, stalemate in job",
      health: "Difficult choices in health, indecision in wellness, stalemate in healing"
    },
    reversed: {
      general: "Release of tension, making a choice, clarity, breakthrough",
      love: "Release of tension in love, making a choice in relationships",
      career: "Release of tension at work, making a choice in career",
      health: "Release of tension in health, making a choice in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-03",
    name: "Three of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords03.png",
    suit: "Swords",
    number: 3,
    keywords: ["Heartbreak", "Suffering", "Grief", "Pain", "Betrayal"],
    upright: {
      general: "The Three of Swords represents heartbreak, suffering, and grief. It's about experiencing emotional pain and betrayal.",
      love: "Heartbreak in love, suffering in relationships, grief in partnerships",
      career: "Heartbreak at work, suffering in career, grief in job",
      health: "Heartbreak in health, suffering in wellness, grief in healing"
    },
    reversed: {
      general: "Recovery, forgiveness, reconciliation, moving on",
      love: "Recovery in love, forgiveness in relationships, reconciliation",
      career: "Recovery at work, forgiveness in career, reconciliation",
      health: "Recovery in health, forgiveness in wellness, reconciliation"
    },
    element: "Air"
  },
  {
    id: "swords-04",
    name: "Four of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords04.png",
    suit: "Swords",
    number: 4,
    keywords: ["Rest", "Recovery", "Meditation", "Peace", "Contemplation"],
    upright: {
      general: "The Four of Swords represents rest, recovery, and peace. It's about taking time to heal and find inner peace.",
      love: "Rest in love, recovery in relationships, peace in partnerships",
      career: "Rest at work, recovery in career, peace in job",
      health: "Rest in health, recovery in wellness, peace in healing"
    },
    reversed: {
      general: "Restlessness, burnout, stress, lack of peace",
      love: "Restlessness in love, burnout in relationships, stress",
      career: "Restlessness at work, burnout in career, stress",
      health: "Restlessness in health, burnout in wellness, stress"
    },
    element: "Air"
  },
  {
    id: "swords-05",
    name: "Five of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords05.png",
    suit: "Swords",
    number: 5,
    keywords: ["Conflict", "Defeat", "Loss", "Betrayal", "Hollow victory"],
    upright: {
      general: "The Five of Swords represents conflict, defeat, and hollow victory. It's about winning battles but losing the war.",
      love: "Conflict in love, defeat in relationships, hollow victory in partnerships",
      career: "Conflict at work, defeat in career, hollow victory in job",
      health: "Conflict in health, defeat in wellness, hollow victory in healing"
    },
    reversed: {
      general: "Reconciliation, making up, past resentment, forgiveness",
      love: "Reconciliation in love, making up in relationships, forgiveness",
      career: "Reconciliation at work, making up in career, forgiveness",
      health: "Reconciliation in health, making up in wellness, forgiveness"
    },
    element: "Air"
  },
  {
    id: "swords-06",
    name: "Six of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords06.png",
    suit: "Swords",
    number: 6,
    keywords: ["Transition", "Change", "Moving on", "Leaving behind", "Journey"],
    upright: {
      general: "The Six of Swords represents transition, change, and moving on. It's about leaving behind difficulties and moving toward better times.",
      love: "Transition in love, change in relationships, moving on in partnerships",
      career: "Transition at work, change in career, moving on in job",
      health: "Transition in health, change in wellness, moving on in healing"
    },
    reversed: {
      general: "Emotional baggage, unresolved issues, resisting transition",
      love: "Emotional baggage in love, unresolved issues in relationships",
      career: "Emotional baggage at work, unresolved issues in career",
      health: "Emotional baggage in health, unresolved issues in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-07",
    name: "Seven of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords07.png",
    suit: "Swords",
    number: 7,
    keywords: ["Deception", "Trickery", "Secrets", "Escape", "Strategy"],
    upright: {
      general: "The Seven of Swords represents deception, trickery, and secrets. It's about being strategic and sometimes sneaky.",
      love: "Deception in love, trickery in relationships, secrets in partnerships",
      career: "Deception at work, trickery in career, secrets in job",
      health: "Deception in health, trickery in wellness, secrets in healing"
    },
    reversed: {
      general: "Imposter syndrome, self-deceit, keeping secrets, deception revealed",
      love: "Imposter syndrome in love, self-deceit in relationships",
      career: "Imposter syndrome at work, self-deceit in career",
      health: "Imposter syndrome in health, self-deceit in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-08",
    name: "Eight of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords08.png",
    suit: "Swords",
    number: 8,
    keywords: ["Imprisonment", "Entrapment", "Isolation", "Fear", "Powerlessness"],
    upright: {
      general: "The Eight of Swords represents imprisonment, entrapment, and powerlessness. It's about feeling trapped by circumstances.",
      love: "Imprisonment in love, entrapment in relationships, powerlessness in partnerships",
      career: "Imprisonment at work, entrapment in career, powerlessness in job",
      health: "Imprisonment in health, entrapment in wellness, powerlessness in healing"
    },
    reversed: {
      general: "Open to change, facing fears, breaking free, awakening",
      love: "Open to change in love, facing fears in relationships",
      career: "Open to change at work, facing fears in career",
      health: "Open to change in health, facing fears in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-09",
    name: "Nine of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords09.png",
    suit: "Swords",
    number: 9,
    keywords: ["Anxiety", "Worry", "Fear", "Depression", "Nightmares"],
    upright: {
      general: "The Nine of Swords represents anxiety, worry, and fear. It's about mental anguish and overwhelming concerns.",
      love: "Anxiety in love, worry in relationships, fear in partnerships",
      career: "Anxiety at work, worry in career, fear in job",
      health: "Anxiety in health, worry in wellness, fear in healing"
    },
    reversed: {
      general: "Inner turmoil, deep-seated fears, secrets, releasing worry",
      love: "Inner turmoil in love, deep-seated fears in relationships",
      career: "Inner turmoil at work, deep-seated fears in career",
      health: "Inner turmoil in health, deep-seated fears in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-10",
    name: "Ten of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords10.png",
    suit: "Swords",
    number: 10,
    keywords: ["Painful endings", "Deep wounds", "Betrayal", "Loss", "Crisis"],
    upright: {
      general: "The Ten of Swords represents painful endings, deep wounds, and betrayal. It's about hitting rock bottom.",
      love: "Painful endings in love, deep wounds in relationships, betrayal in partnerships",
      career: "Painful endings at work, deep wounds in career, betrayal in job",
      health: "Painful endings in health, deep wounds in wellness, betrayal in healing"
    },
    reversed: {
      general: "Recovery, regeneration, resisting an inevitable end",
      love: "Recovery in love, regeneration in relationships",
      career: "Recovery at work, regeneration in career",
      health: "Recovery in health, regeneration in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-11",
    name: "Page of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords11.png",
    suit: "Swords",
    keywords: ["New ideas", "Curiosity", "Thirst for knowledge", "New ways of communicating", "Observing"],
    upright: {
      general: "The Page of Swords represents new ideas, curiosity, and thirst for knowledge. A message of intellectual inspiration is coming.",
      love: "New ideas in love, curiosity in relationships, thirst for knowledge",
      career: "New ideas at work, curiosity in career, thirst for knowledge",
      health: "New ideas in health, curiosity in wellness, thirst for knowledge"
    },
    reversed: {
      general: "Self-expression, all talk and no action, haphazard action, delays",
      love: "Self-expression in love, all talk and no action in relationships",
      career: "Self-expression at work, all talk and no action in career",
      health: "Self-expression in health, all talk and no action in wellness"
    },
    element: "Air"
  },
  {
    id: "swords-12",
    name: "Knight of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords12.png",
    suit: "Swords",
    keywords: ["Ambitious", "Action-oriented", "Driven", "Impulsive", "Intellectual"],
    upright: {
      general: "The Knight of Swords represents ambition, action, and intellectual drive. A passionate and driven person or situation is coming.",
      love: "Ambition in love, action in relationships, intellectual drive in partnerships",
      career: "Ambition at work, action in career, intellectual drive in job",
      health: "Ambition in health, action in wellness, intellectual drive in healing"
    },
    reversed: {
      general: "Restless energy, unfocused, impulsive, scattered thoughts",
      love: "Restless energy in love, unfocused in relationships, impulsive",
      career: "Restless energy at work, unfocused in career, impulsive",
      health: "Restless energy in health, unfocused in wellness, impulsive"
    },
    element: "Air"
  },
  {
    id: "swords-13",
    name: "Queen of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords13.png",
    suit: "Swords",
    keywords: ["Independent", "Unbiased judgment", "Clear boundaries", "Direct communication", "Experience"],
    upright: {
      general: "The Queen of Swords represents independence, unbiased judgment, and clear boundaries. She's a wise and experienced communicator.",
      love: "Independence in love, unbiased judgment in relationships, clear boundaries",
      career: "Independence at work, unbiased judgment in career, clear boundaries",
      health: "Independence in health, unbiased judgment in wellness, clear boundaries"
    },
    reversed: {
      general: "Coldness, bitterness, harsh judgment, isolation",
      love: "Coldness in love, bitterness in relationships, harsh judgment",
      career: "Coldness at work, bitterness in career, harsh judgment",
      health: "Coldness in health, bitterness in wellness, harsh judgment"
    },
    element: "Air"
  },
  {
    id: "swords-14",
    name: "King of Swords",
    image: "/src/lib/images/tarot/Cards-png/Swords14.png",
    suit: "Swords",
    keywords: ["Mental clarity", "Intellectual power", "Authority", "Truth", "Justice"],
    upright: {
      general: "The King of Swords represents mental clarity, intellectual power, and authority. He's a wise and just leader.",
      love: "Mental clarity in love, intellectual power in relationships, authority in partnerships",
      career: "Mental clarity at work, intellectual power in career, authority in job",
      health: "Mental clarity in health, intellectual power in wellness, authority in healing"
    },
    reversed: {
      general: "Quiet power, inner truth, misuse of power, manipulation",
      love: "Quiet power in love, inner truth in relationships, misuse of power",
      career: "Quiet power at work, inner truth in career, misuse of power",
      health: "Quiet power in health, inner truth in wellness, misuse of power"
    },
    element: "Air"
  }
];

export const PENTACLES_SUIT: TarotCard[] = [
  {
    id: "pentacles-01",
    name: "Ace of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles01.png",
    suit: "Pentacles",
    number: 1,
    keywords: ["New financial opportunity", "Abundance", "Manifestation", "Grounding", "Material success"],
    upright: {
      general: "The Ace of Pentacles represents new financial opportunities, abundance, and material success. A new beginning in the material world.",
      love: "New financial opportunity in love, abundance in relationships, material success",
      career: "New financial opportunity at work, abundance in career, material success",
      health: "New financial opportunity in health, abundance in wellness, material success"
    },
    reversed: {
      general: "Missed opportunity, lack of planning, scarcity mindset",
      love: "Missed opportunity in love, lack of planning in relationships",
      career: "Missed opportunity at work, lack of planning in career",
      health: "Missed opportunity in health, lack of planning in wellness"
    },
    element: "Earth"
  },
  {
    id: "pentacles-02",
    name: "Two of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles02.png",
    suit: "Pentacles",
    number: 2,
    keywords: ["Balance", "Adaptability", "Time management", "Priorities", "Flexibility"],
    upright: {
      general: "The Two of Pentacles represents balance, adaptability, and time management. It's about juggling multiple responsibilities with grace.",
      love: "Balance in love, adaptability in relationships, time management in partnerships",
      career: "Balance at work, adaptability in career, time management in job",
      health: "Balance in health, adaptability in wellness, time management in healing"
    },
    reversed: {
      general: "Imbalance, over-commitment, disorganization, reprioritization",
      love: "Imbalance in love, over-commitment in relationships",
      career: "Imbalance at work, over-commitment in career",
      health: "Imbalance in health, over-commitment in wellness"
    },
    element: "Earth"
  },
  {
    id: "pentacles-03",
    name: "Three of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles03.png",
    suit: "Pentacles",
    number: 3,
    keywords: ["Teamwork", "Collaboration", "Building", "Learning", "Apprenticeship"],
    upright: {
      general: "The Three of Pentacles represents teamwork, collaboration, and building. It's about working together to create something meaningful.",
      love: "Teamwork in love, collaboration in relationships, building partnerships",
      career: "Teamwork at work, collaboration in career, building success",
      health: "Teamwork in health, collaboration in wellness, building healing"
    },
    reversed: {
      general: "Disharmony, lack of teamwork, disorganized, group conflict",
      love: "Disharmony in love, lack of teamwork in relationships, disorganized",
      career: "Disharmony at work, lack of teamwork in career, disorganized",
      health: "Disharmony in health, lack of teamwork in wellness, disorganized"
    },
    element: "Earth"
  },
  {
    id: "pentacles-04",
    name: "Four of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles04.png",
    suit: "Pentacles",
    number: 4,
    keywords: ["Conservation", "Security", "Frugality", "Protection", "Stability"],
    upright: {
      general: "The Four of Pentacles represents conservation, security, and stability. It's about protecting what you have and being frugal.",
      love: "Conservation in love, security in relationships, stability in partnerships",
      career: "Conservation at work, security in career, stability in job",
      health: "Conservation in health, security in wellness, stability in healing"
    },
    reversed: {
      general: "Greed, self-protection, isolation, stinginess",
      love: "Greed in love, self-protection in relationships, isolation",
      career: "Greed at work, self-protection in career, isolation",
      health: "Greed in health, self-protection in wellness, isolation"
    },
    element: "Earth"
  },
  {
    id: "pentacles-05",
    name: "Five of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles05.png",
    suit: "Pentacles",
    number: 5,
    keywords: ["Financial loss", "Poverty", "Lack", "Isolation", "Worry"],
    upright: {
      general: "The Five of Pentacles represents financial loss, poverty, and lack. It's about experiencing hardship and feeling isolated.",
      love: "Financial loss in love, poverty in relationships, lack in partnerships",
      career: "Financial loss at work, poverty in career, lack in job",
      health: "Financial loss in health, poverty in wellness, lack in healing"
    },
    reversed: {
      general: "Recovery, charity, improvement, spirituality",
      love: "Recovery in love, charity in relationships, improvement",
      career: "Recovery at work, charity in career, improvement",
      health: "Recovery in health, charity in wellness, improvement"
    },
    element: "Earth"
  },
  {
    id: "pentacles-06",
    name: "Six of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles06.png",
    suit: "Pentacles",
    number: 6,
    keywords: ["Charity", "Generosity", "Sharing", "Giving", "Receiving"],
    upright: {
      general: "The Six of Pentacles represents charity, generosity, and sharing. It's about giving and receiving with an open heart.",
      love: "Charity in love, generosity in relationships, sharing in partnerships",
      career: "Charity at work, generosity in career, sharing in job",
      health: "Charity in health, generosity in wellness, sharing in healing"
    },
    reversed: {
      general: "Strings attached, stinginess, power and domination, debt",
      love: "Strings attached in love, stinginess in relationships, power and domination",
      career: "Strings attached at work, stinginess in career, power and domination",
      health: "Strings attached in health, stinginess in wellness, power and domination"
    },
    element: "Earth"
  },
  {
    id: "pentacles-07",
    name: "Seven of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles07.png",
    suit: "Pentacles",
    number: 7,
    keywords: ["Patience", "Long-term view", "Investment", "Growth", "Assessment"],
    upright: {
      general: "The Seven of Pentacles represents patience, long-term view, and investment. It's about waiting for your efforts to bear fruit.",
      love: "Patience in love, long-term view in relationships, investment in partnerships",
      career: "Patience at work, long-term view in career, investment in job",
      health: "Patience in health, long-term view in wellness, investment in healing"
    },
    reversed: {
      general: "Lack of long-term vision, impatience, lack of rewards",
      love: "Lack of long-term vision in love, impatience in relationships",
      career: "Lack of long-term vision at work, impatience in career",
      health: "Lack of long-term vision in health, impatience in wellness"
    },
    element: "Earth"
  },
  {
    id: "pentacles-08",
    name: "Eight of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles08.png",
    suit: "Pentacles",
    number: 8,
    keywords: ["Apprenticeship", "Repetitive tasks", "Skill development", "Diligence", "Hard work"],
    upright: {
      general: "The Eight of Pentacles represents apprenticeship, skill development, and hard work. It's about mastering your craft through dedication.",
      love: "Apprenticeship in love, skill development in relationships, hard work in partnerships",
      career: "Apprenticeship at work, skill development in career, hard work in job",
      health: "Apprenticeship in health, skill development in wellness, hard work in healing"
    },
    reversed: {
      general: "Self-development, perfectionism, ambition, workaholic",
      love: "Self-development in love, perfectionism in relationships, ambition",
      career: "Self-development at work, perfectionism in career, ambition",
      health: "Self-development in health, perfectionism in wellness, ambition"
    },
    element: "Earth"
  },
  {
    id: "pentacles-09",
    name: "Nine of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles09.png",
    suit: "Pentacles",
    number: 9,
    keywords: ["Luxury", "Self-sufficiency", "Financial independence", "Abundance", "Discipline"],
    upright: {
      general: "The Nine of Pentacles represents luxury, self-sufficiency, and financial independence. It's about enjoying the fruits of your labor.",
      love: "Luxury in love, self-sufficiency in relationships, financial independence",
      career: "Luxury at work, self-sufficiency in career, financial independence",
      health: "Luxury in health, self-sufficiency in wellness, financial independence"
    },
    reversed: {
      general: "Self-worth, over-investment in work, hustling",
      love: "Self-worth in love, over-investment in relationships, hustling",
      career: "Self-worth at work, over-investment in career, hustling",
      health: "Self-worth in health, over-investment in wellness, hustling"
    },
    element: "Earth"
  },
  {
    id: "pentacles-10",
    name: "Ten of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles10.png",
    suit: "Pentacles",
    number: 10,
    keywords: ["Wealth", "Financial security", "Family", "Long-term success", "Legacy"],
    upright: {
      general: "The Ten of Pentacles represents wealth, financial security, and family. It's about achieving long-term success and building a legacy.",
      love: "Wealth in love, financial security in relationships, family in partnerships",
      career: "Wealth at work, financial security in career, family in job",
      health: "Wealth in health, financial security in wellness, family in healing"
    },
    reversed: {
      general: "The dark side of wealth, financial failure, loneliness, family disputes",
      love: "The dark side of wealth in love, financial failure in relationships",
      career: "The dark side of wealth at work, financial failure in career",
      health: "The dark side of wealth in health, financial failure in wellness"
    },
    element: "Earth"
  },
  {
    id: "pentacles-11",
    name: "Page of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles11.png",
    suit: "Pentacles",
    keywords: ["Manifestation", "Financial opportunity", "Skill development", "Adventure", "Excitement"],
    upright: {
      general: "The Page of Pentacles represents manifestation, financial opportunity, and skill development. A message of material opportunity is coming.",
      love: "Manifestation in love, financial opportunity in relationships, skill development",
      career: "Manifestation at work, financial opportunity in career, skill development",
      health: "Manifestation in health, financial opportunity in wellness, skill development"
    },
    reversed: {
      general: "Self-development, perfectionism, re-evaluation of priorities",
      love: "Self-development in love, perfectionism in relationships, re-evaluation",
      career: "Self-development at work, perfectionism in career, re-evaluation",
      health: "Self-development in health, perfectionism in wellness, re-evaluation"
    },
    element: "Earth"
  },
  {
    id: "pentacles-12",
    name: "Knight of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles12.png",
    suit: "Pentacles",
    keywords: ["Hard work", "Productivity", "Routine", "Conservatism", "Diligence"],
    upright: {
      general: "The Knight of Pentacles represents hard work, productivity, and routine. A diligent and methodical person or situation is coming.",
      love: "Hard work in love, productivity in relationships, routine in partnerships",
      career: "Hard work at work, productivity in career, routine in job",
      health: "Hard work in health, productivity in wellness, routine in healing"
    },
    reversed: {
      general: "Self-discipline, boredom, feeling 'stuck', perfectionism",
      love: "Self-discipline in love, boredom in relationships, feeling 'stuck'",
      career: "Self-discipline at work, boredom in career, feeling 'stuck'",
      health: "Self-discipline in health, boredom in wellness, feeling 'stuck'"
    },
    element: "Earth"
  },
  {
    id: "pentacles-13",
    name: "Queen of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles13.png",
    suit: "Pentacles",
    keywords: ["Nurturing", "Practical", "Providing financially", "A working parent", "Homebody"],
    upright: {
      general: "The Queen of Pentacles represents nurturing, practicality, and providing financially. She's a caring and resourceful provider.",
      love: "Nurturing love, practical relationships, providing financially in partnerships",
      career: "Nurturing work, practical career, providing financially in job",
      health: "Nurturing health, practical wellness, providing financially in healing"
    },
    reversed: {
      general: "Self-care, self-compassion, work-home conflict",
      love: "Self-care in love, self-compassion in relationships, work-home conflict",
      career: "Self-care at work, self-compassion in career, work-home conflict",
      health: "Self-care in health, self-compassion in wellness, work-home conflict"
    },
    element: "Earth"
  },
  {
    id: "pentacles-14",
    name: "King of Pentacles",
    image: "/src/lib/images/tarot/Cards-png/Pentacles14.png",
    suit: "Pentacles",
    keywords: ["Abundance", "Prosperity", "Security", "Discipline", "Confidence"],
    upright: {
      general: "The King of Pentacles represents abundance, prosperity, and security. He's a confident and disciplined provider.",
      love: "Abundance in love, prosperity in relationships, security in partnerships",
      career: "Abundance at work, prosperity in career, security in job",
      health: "Abundance in health, prosperity in wellness, security in healing"
    },
    reversed: {
      general: "Self-protection, self-discipline, hoarding, workaholic",
      love: "Self-protection in love, self-discipline in relationships, hoarding",
      career: "Self-protection at work, self-discipline in career, hoarding",
      health: "Self-protection in health, self-discipline in wellness, hoarding"
    },
    element: "Earth"
  }
];

export const ALL_TAROT_CARDS = [
  ...MAJOR_ARCANA,
  ...MINOR_ARCANA,
  ...CUPS_SUIT,
  ...SWORDS_SUIT,
  ...PENTACLES_SUIT
];

export const getCardById = (id: string): TarotCard | undefined => {
  return ALL_TAROT_CARDS.find(card => card.id === id);
};

export const getCardsBySuit = (suit: string): TarotCard[] => {
  return ALL_TAROT_CARDS.filter(card => card.suit === suit);
};

export const getMajorArcana = (): TarotCard[] => {
  return MAJOR_ARCANA;
};

export const getMinorArcana = (): TarotCard[] => {
  return [...MINOR_ARCANA, ...CUPS_SUIT, ...SWORDS_SUIT, ...PENTACLES_SUIT];
}; 