import { 
  generateCelticCrossSVG, 
  generateHorseshoeSVG, 
  generateLoveTriangleSVG, 
  generateCareerPathSVG, 
  generateSpiritualJourneySVG 
} from '$lib/utils/tarot-svg-generator';

export interface TarotLayout {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'General' | 'Love' | 'Career' | 'Spiritual' | 'Problem-Solving';
  svg: string;
  positions: LayoutPosition[];
  instructions: string;
  tips: string[];
  bestFor: string[];
}

export interface LayoutPosition {
  number: number;
  name: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TAROT_LAYOUTS: TarotLayout[] = [
  {
    id: "single-card",
    name: "Single Card",
    description: "A simple one-card reading for daily guidance or quick insights",
    cardCount: 1,
    difficulty: "Beginner",
    category: "General",
    svg: `<rect x="50" y="50" width="120" height="200" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="110" y="160" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>`,
    positions: [
      {
        number: 1,
        name: "The Answer",
        description: "The core message or answer to your question",
        x: 50,
        y: 50,
        width: 120,
        height: 200
      }
    ],
    instructions: "Shuffle your deck while focusing on your question. Draw one card and interpret its meaning in relation to your situation.",
    tips: [
      "Perfect for daily guidance",
      "Great for beginners",
      "Use for yes/no questions",
      "Focus on the card's core meaning"
    ],
    bestFor: ["Daily guidance", "Quick decisions", "General insights", "Yes/no questions"]
  },
  {
    id: "three-card-past-present-future",
    name: "Past, Present, Future",
    description: "A classic three-card spread showing the timeline of your situation",
    cardCount: 3,
    difficulty: "Beginner",
    category: "General",
    svg: `<rect x="20" y="50" width="120" height="200" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="80" y="160" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="150" y="50" width="120" height="200" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="210" y="160" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="280" y="50" width="120" height="200" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="340" y="160" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>`,
    positions: [
      {
        number: 1,
        name: "Past",
        description: "Events or influences from the past affecting your current situation",
        x: 20,
        y: 50,
        width: 120,
        height: 200
      },
      {
        number: 2,
        name: "Present",
        description: "Your current situation and immediate circumstances",
        x: 150,
        y: 50,
        width: 120,
        height: 200
      },
      {
        number: 3,
        name: "Future",
        description: "Potential outcomes and future developments",
        x: 280,
        y: 50,
        width: 120,
        height: 200
      }
    ],
    instructions: "Shuffle while thinking of your question. Draw three cards from left to right. The first represents the past, second the present, and third the future.",
    tips: [
      "Look for connections between the cards",
      "Consider how past events led to present",
      "Future card shows potential, not certainty",
      "Read cards in sequence for story flow"
    ],
    bestFor: ["Understanding situations", "Timeline analysis", "General guidance", "Relationship insights"]
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    description: "The most comprehensive tarot spread for detailed analysis",
    cardCount: 10,
    difficulty: "Advanced",
    category: "General",
    svg: generateCelticCrossSVG(500, 300),
    positions: [
      {
        number: 1,
        name: "Present Situation",
        description: "The core issue or current circumstances",
        x: 150,
        y: 100,
        width: 120,
        height: 200
      },
      {
        number: 2,
        name: "Challenge",
        description: "The immediate obstacle or conflict",
        x: 280,
        y: 100,
        width: 120,
        height: 200
      },
      {
        number: 3,
        name: "Foundation",
        description: "Past events or beliefs that support the situation",
        x: 150,
        y: 320,
        width: 120,
        height: 200
      },
      {
        number: 4,
        name: "Recent Past",
        description: "Events that led to the current situation",
        x: 20,
        y: 100,
        width: 120,
        height: 200
      },
      {
        number: 5,
        name: "Possible Outcome",
        description: "What could happen if current path continues",
        x: 150,
        y: 210,
        width: 120,
        height: 200
      },
      {
        number: 6,
        name: "Near Future",
        description: "Immediate future developments",
        x: 410,
        y: 100,
        width: 120,
        height: 200
      },
      {
        number: 7,
        name: "Self-Perception",
        description: "How you see yourself in this situation",
        x: 410,
        y: 320,
        width: 120,
        height: 200
      },
      {
        number: 8,
        name: "External Influences",
        description: "People or circumstances affecting the situation",
        x: 410,
        y: 540,
        width: 120,
        height: 200
      },
      {
        number: 9,
        name: "Hopes & Fears",
        description: "Your deepest desires and concerns",
        x: 20,
        y: 320,
        width: 120,
        height: 200
      },
      {
        number: 10,
        name: "Final Outcome",
        description: "The ultimate resolution or conclusion",
        x: 20,
        y: 540,
        width: 120,
        height: 200
      }
    ],
    instructions: "This complex spread requires careful attention. Lay out cards in the specific order shown, taking time to interpret each position before moving to the next.",
    tips: [
      "Take your time with each card",
      "Look for patterns and connections",
      "Consider the relationship between positions",
      "Focus on the central cross first",
      "Use the staff positions for deeper insights"
    ],
    bestFor: ["Complex situations", "Deep analysis", "Life-changing decisions", "Comprehensive guidance"]
  },
  {
    id: "horseshoe",
    name: "Horseshoe",
    description: "A seven-card spread shaped like a horseshoe for comprehensive guidance",
    cardCount: 7,
    difficulty: "Intermediate",
    category: "General",
    svg: generateHorseshoeSVG(600, 400),
    positions: [
      {
        number: 1,
        name: "The Past",
        description: "Past events that are impacting the current situation or question at hand",
        x: 50,
        y: 250,
        width: 80,
        height: 120
      },
      {
        number: 2,
        name: "The Present",
        description: "Current events circling the querent and influencing the issue they're concerned about",
        x: 140,
        y: 180,
        width: 80,
        height: 120
      },
      {
        number: 3,
        name: "Hidden Influences",
        description: "The unseen, problems and conflicts you don't yet know about, or immediate future",
        x: 230,
        y: 120,
        width: 80,
        height: 120
      },
      {
        number: 4,
        name: "The Querent",
        description: "The person themselves and their attitudes about the situation at hand",
        x: 320,
        y: 150,
        width: 80,
        height: 120
      },
      {
        number: 5,
        name: "Influence of Others",
        description: "External influences holding sway over the situation and how other people feel about it",
        x: 380,
        y: 200,
        width: 80,
        height: 120
      },
      {
        number: 6,
        name: "What Should the Querent Do",
        description: "The course of action the querent should take to resolve the situation",
        x: 380,
        y: 280,
        width: 80,
        height: 120
      },
      {
        number: 7,
        name: "The Final Outcome",
        description: "The eventual resolution to the problem, factoring in all previous cards",
        x: 320,
        y: 320,
        width: 80,
        height: 120
      }
    ],
    instructions: "Lay out the cards in a horseshoe pattern starting from the left. Each position reveals different aspects of your situation and guidance. Read in numerical order to understand the flow from past to future.",
    tips: [
      "Read the spread in numerical order",
      "Pay attention to the flow from past to future",
      "Consider how the querent's position relates to advice",
      "Look for connections between adjacent cards",
      "The final outcome factors in all previous cards"
    ],
    bestFor: ["General guidance", "Problem-solving", "Decision-making", "Timeline analysis", "Understanding personal influence"]
  },
  {
    id: "love-triangle",
    name: "Love Triangle",
    description: "A specialized spread for relationship insights and romantic guidance",
    cardCount: 6,
    difficulty: "Intermediate",
    category: "Love",
    svg: generateLoveTriangleSVG(600, 400),
    positions: [
      {
        number: 1,
        name: "Your Feelings",
        description: "Your current emotional state and desires",
        x: 150,
        y: 50,
        width: 120,
        height: 200
      },
      {
        number: 2,
        name: "Partner's Feelings",
        description: "Your partner's emotions and perspective",
        x: 50,
        y: 200,
        width: 120,
        height: 200
      },
      {
        number: 3,
        name: "Relationship Dynamic",
        description: "The energy and nature of your connection",
        x: 250,
        y: 200,
        width: 120,
        height: 200
      },
      {
        number: 4,
        name: "Past Influences",
        description: "Previous experiences affecting the relationship",
        x: 50,
        y: 350,
        width: 120,
        height: 200
      },
      {
        number: 5,
        name: "Future Potential",
        description: "Where the relationship could lead",
        x: 250,
        y: 350,
        width: 120,
        height: 200
      },
      {
        number: 6,
        name: "Advice",
        description: "Guidance for nurturing the relationship",
        x: 150,
        y: 500,
        width: 120,
        height: 200
      }
    ],
    instructions: "Focus on your relationship question while shuffling. Lay out the cards in the triangle pattern, starting from the top and working down.",
    tips: [
      "Focus on emotional connections",
      "Compare your feelings with partner's",
      "Consider the relationship dynamic",
      "Look for patterns in the triangle"
    ],
    bestFor: ["Relationship guidance", "Romantic insights", "Partnership analysis", "Love decisions"]
  },
  {
    id: "career-path",
    name: "Career Path",
    description: "A focused spread for career decisions and professional development",
    cardCount: 5,
    difficulty: "Intermediate",
    category: "Career",
    svg: generateCareerPathSVG(600, 400),
    positions: [
      {
        number: 1,
        name: "Current Position",
        description: "Your present career situation and satisfaction",
        x: 150,
        y: 50,
        width: 120,
        height: 200
      },
      {
        number: 2,
        name: "Strengths",
        description: "Your professional skills and advantages",
        x: 50,
        y: 150,
        width: 120,
        height: 200
      },
      {
        number: 3,
        name: "Challenges",
        description: "Obstacles or areas needing development",
        x: 250,
        y: 150,
        width: 120,
        height: 200
      },
      {
        number: 4,
        name: "Opportunities",
        description: "Potential paths for advancement or change",
        x: 50,
        y: 300,
        width: 120,
        height: 200
      },
      {
        number: 5,
        name: "Recommended Action",
        description: "Specific steps to take for career growth",
        x: 250,
        y: 300,
        width: 120,
        height: 200
      }
    ],
    instructions: "Focus on your career question while shuffling. Lay out the cards in the pattern shown, starting from the top center.",
    tips: [
      "Be honest about your current satisfaction",
      "Identify actionable steps from the advice",
      "Consider how strengths can overcome challenges",
      "Look for practical opportunities"
    ],
    bestFor: ["Career decisions", "Job changes", "Professional development", "Work-life balance"]
  },
  {
    id: "spiritual-journey",
    name: "Spiritual Journey",
    description: "A mystical spread for spiritual growth and soul development",
    cardCount: 8,
    difficulty: "Advanced",
    category: "Spiritual",
    svg: generateSpiritualJourneySVG(600, 400),
    positions: [
      {
        number: 1,
        name: "Soul Purpose",
        description: "Your higher calling and spiritual mission",
        x: 150,
        y: 20,
        width: 120,
        height: 200
      },
      {
        number: 2,
        name: "Past Life Influences",
        description: "Karmic patterns and previous experiences",
        x: 50,
        y: 120,
        width: 120,
        height: 200
      },
      {
        number: 3,
        name: "Spiritual Gifts",
        description: "Your innate spiritual abilities and talents",
        x: 250,
        y: 120,
        width: 120,
        height: 200
      },
      {
        number: 4,
        name: "Current Lessons",
        description: "What you're learning in this lifetime",
        x: 20,
        y: 220,
        width: 120,
        height: 200
      },
      {
        number: 5,
        name: "Spiritual Challenges",
        description: "Obstacles to your spiritual growth",
        x: 280,
        y: 220,
        width: 120,
        height: 200
      },
      {
        number: 6,
        name: "Higher Guidance",
        description: "Messages from your spiritual guides",
        x: 150,
        y: 320,
        width: 120,
        height: 200
      },
      {
        number: 7,
        name: "Spiritual Practices",
        description: "Recommended practices for growth",
        x: 50,
        y: 420,
        width: 120,
        height: 200
      },
      {
        number: 8,
        name: "Soul Evolution",
        description: "Your spiritual development path",
        x: 250,
        y: 420,
        width: 120,
        height: 200
      }
    ],
    instructions: "Create a sacred space and set your intention for spiritual guidance. Lay out the cards in the mystical pattern shown.",
    tips: [
      "Meditate before the reading",
      "Trust your intuition",
      "Look for spiritual symbols",
      "Consider the journey as a whole"
    ],
    bestFor: ["Spiritual growth", "Soul purpose", "Past life insights", "Divine guidance"]
  }
];

export const getLayoutById = (id: string): TarotLayout | undefined => {
  return TAROT_LAYOUTS.find(layout => layout.id === id);
};

export const getLayoutsByCategory = (category: string): TarotLayout[] => {
  return TAROT_LAYOUTS.filter(layout => layout.category === category);
};

export const getLayoutsByDifficulty = (difficulty: string): TarotLayout[] => {
  return TAROT_LAYOUTS.filter(layout => layout.difficulty === difficulty);
};

export const getAllCategories = (): string[] => {
  return [...new Set(TAROT_LAYOUTS.map(layout => layout.category))];
};

export const getAllDifficulties = (): string[] => {
  return [...new Set(TAROT_LAYOUTS.map(layout => layout.difficulty))];
}; 