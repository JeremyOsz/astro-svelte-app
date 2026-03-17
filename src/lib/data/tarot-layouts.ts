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
  },
  {
    id: "funeral-for-a-future-self",
    name: "Funeral for a Future Self",
    description: "A ritual spread for honoring a version of you that is ending and welcoming what rises in its place.",
    cardCount: 6,
    difficulty: "Intermediate",
    category: "Spiritual",
    svg: `<rect x="40" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="150" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="260" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="40" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>
          <rect x="150" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">5</text>
          <rect x="260" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">6</text>`,
    positions: [
      {
        number: 1,
        name: "The Body",
        description: "The self or chapter that is ending; what no longer fits.",
        x: 40,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "Cause of Death",
        description: "The pattern, belief, or event that brought this version of you to an end.",
        x: 150,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "The Mourners",
        description: "Who or what still clings to this self and resists its passing.",
        x: 260,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "Grave Goods",
        description: "What is worth keeping from this version of you and carrying forward.",
        x: 40,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 5,
        name: "The Epitaph",
        description: "How this chapter will be remembered in the story of your life.",
        x: 150,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 6,
        name: "The Rebirth",
        description: "The self that is quietly rising to take this one’s place.",
        x: 260,
        y: 210,
        width: 90,
        height: 150
      }
    ],
    instructions: "Name the version of yourself that feels over. Shuffle while holding that self in mind. Lay the cards in two rows of three, reading the top row as the death and the bottom row as the ritual of remembrance and rebirth.",
    tips: [
      "Be specific about which self or chapter you are burying",
      "Let yourself grieve what is ending before looking to the rebirth",
      "Pay attention to any repeating suits or archetypes between the rows",
      "Consider creating a physical small ritual after the reading to mark closure"
    ],
    bestFor: ["Endings and transitions", "Shedding outdated identities", "Ritual closure", "Conscious rebirth"]
  },
  {
    id: "what-wont-stay-buried",
    name: "What Won’t Stay Buried",
    description: "A spread for recurring patterns, hauntings, and issues that keep resurfacing.",
    cardCount: 6,
    difficulty: "Intermediate",
    category: "Problem-Solving",
    svg: `<rect x="40" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="150" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="260" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="40" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>
          <rect x="150" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">5</text>
          <rect x="260" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">6</text>`,
    positions: [
      {
        number: 1,
        name: "The Hand Out of the Ground",
        description: "The issue or pattern that keeps resurfacing and demanding attention.",
        x: 40,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "The Original Wound",
        description: "Where this haunting first began or what it echoes back to.",
        x: 150,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "The Shovel",
        description: "How you currently try to bury, avoid, or contain it.",
        x: 260,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "The Bone in the Garden",
        description: "How this energy shows up in everyday life despite your efforts.",
        x: 40,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 5,
        name: "The Exorcism",
        description: "What would actually help you transform or release this haunting.",
        x: 150,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 6,
        name: "The Lesson in the Dirt",
        description: "What this recurring issue is ultimately trying to teach you.",
        x: 260,
        y: 210,
        width: 90,
        height: 150
      }
    ],
    instructions: "Name the situation, person, or feeling that never really seems to be over. Shuffle while acknowledging how tired you are of its return. Lay the cards in two rows of three and read them as the story of why it comes back and how to finally change your response.",
    tips: [
      "Be honest about how you participate in the pattern, not just how it happens to you",
      "Notice differences between how the pattern began and how it manifests now",
      "Treat the Exorcism card as guidance, not punishment",
      "Return to the Lesson card when the issue resurfaces as a reminder"
    ],
    bestFor: ["Recurring patterns", "Shadow work", "Breaking cycles", "Emotional cleanup"]
  },
  {
    id: "autopsy-of-a-relationship",
    name: "Autopsy of a Relationship",
    description: "A forensic-style spread for understanding why a relationship shifted or ended and how to release it.",
    cardCount: 6,
    difficulty: "Intermediate",
    category: "Love",
    svg: `<rect x="40" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="150" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="260" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="40" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>
          <rect x="150" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">5</text>
          <rect x="260" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">6</text>`,
    positions: [
      {
        number: 1,
        name: "Cause of Death",
        description: "The central reason this relationship shifted or ended.",
        x: 40,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "The Last Breath",
        description: "The moment where it might have gone differently, if at all.",
        x: 150,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "Shared Ghost",
        description: "The energy that still exists between you, even now.",
        x: 260,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "Your Haunting",
        description: "How you still carry them or this story.",
        x: 40,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 5,
        name: "Their Haunting",
        description: "How they may still carry you or the impact of the connection.",
        x: 150,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 6,
        name: "Release Rite",
        description: "How to honor what was and gently release your grip on it.",
        x: 260,
        y: 210,
        width: 90,
        height: 150
      }
    ],
    instructions: "Name the relationship you are reading on and its current status. Shuffle while acknowledging both your grief and your curiosity. Lay the cards in two rows of three, reading the top as the story of what happened and the bottom as the story of what remains and how to let it rest.",
    tips: [
      "Use this for romantic, platonic, or creative partnerships",
      "Stay with your own experience rather than guessing theirs too literally",
      "Let the Release Rite card inspire a small real-world action or ritual",
      "Revisit the spread later to see how your feelings shift over time"
    ],
    bestFor: ["Processing breakups", "Closure after endings", "Understanding relational patterns", "Releasing old attachments"]
  },
  {
    id: "talking-to-the-thing-under-the-bed",
    name: "Talking to the Thing Under the Bed",
    description: "A spread for personifying your fear and understanding what it is trying to protect.",
    cardCount: 6,
    difficulty: "Intermediate",
    category: "Problem-Solving",
    svg: `<rect x="40" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="150" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="260" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="40" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>
          <rect x="150" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">5</text>
          <rect x="260" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">6</text>`,
    positions: [
      {
        number: 1,
        name: "Its Shape",
        description: "How this fear appears or feels when it visits you.",
        x: 40,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "Its True Name",
        description: "What the fear is really about beneath the surface story.",
        x: 150,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "Its Demands",
        description: "What this fear thinks it is protecting or insisting on.",
        x: 260,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "Its Lies",
        description: "What the fear tells you that is not actually true.",
        x: 40,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 5,
        name: "Its Gift",
        description: "The skill, awareness, or sensitivity this fear has given you.",
        x: 150,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 6,
        name: "How to Tuck It In",
        description: "How to soothe, integrate, or outgrow this fear without silencing yourself.",
        x: 260,
        y: 210,
        width: 90,
        height: 150
      }
    ],
    instructions: "Choose one specific fear—big or small—and imagine it as a creature under the bed. Shuffle while inviting it to speak plainly. Lay the cards in two rows of three, reading the top as the fear’s own voice and the bottom as your clearer understanding of it.",
    tips: [
      "Name the fear in a single sentence before you pull cards",
      "Let yourself write down what the fear would say in first person",
      "Treat the Lies card as a gentle correction, not a scolding",
      "Use the Tuck It In card to design a small grounding practice"
    ],
    bestFor: ["Anxiety and worry", "Inner child work", "Fear of change", "Self-soothing strategies"]
  },
  {
    id: "contract-with-the-underworld",
    name: "Contract with the Underworld",
    description: "A pact-style spread for understanding the real cost, risks, and gifts of a desire.",
    cardCount: 6,
    difficulty: "Advanced",
    category: "Spiritual",
    svg: `<rect x="40" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="150" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="260" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="40" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="85" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>
          <rect x="150" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="195" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">5</text>
          <rect x="260" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">6</text>`,
    positions: [
      {
        number: 1,
        name: "Your Desire",
        description: "What you are secretly or openly asking the dark for.",
        x: 40,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "The Gatekeeper",
        description: "The threshold, test, or inner guardian you must pass.",
        x: 150,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "The Price",
        description: "What must be surrendered, changed, or risked to move toward this desire.",
        x: 260,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "The Fine Print",
        description: "Hidden consequences, side effects, or unexpected shifts this path may bring.",
        x: 40,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 5,
        name: "The Boon",
        description: "The power, gift, or transformation you gain by saying yes.",
        x: 150,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 6,
        name: "The Exit Clause",
        description: "How to step back, renegotiate, or slow down if the cost is too high.",
        x: 260,
        y: 210,
        width: 90,
        height: 150
      }
    ],
    instructions: "Name one desire clearly—as if it were the first line of a contract. Shuffle while imagining you are sitting across from the underworld itself, negotiating. Lay the cards in two rows of three, reading the top as the terms of the pact and the bottom as the risks, rewards, and escape route.",
    tips: [
      "Use this spread when you are seriously considering a big move, not for casual whims",
      "Let the Price card highlight habits, identities, or comforts that may need to shift",
      "Treat the Fine Print as a caution, not a curse",
      "Revisit the Exit Clause if you later feel overcommitted or overwhelmed"
    ],
    bestFor: ["Big life decisions", "Ambitious goals", "Shadowed desires", "Risk assessment with soul"]
  },
  {
    id: "month-ahead",
    name: "Month Ahead",
    description: "A simple four-card spread to read the energy and focus points for the next month.",
    cardCount: 4,
    difficulty: "Beginner",
    category: "General",
    svg: `<rect x="35" y="115" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="80" y="195" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="145" y="115" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="190" y="195" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="255" y="115" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="300" y="195" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="365" y="115" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="410" y="195" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>`,
    positions: [
      {
        number: 1,
        name: "Theme",
        description: "The central energy shaping this month.",
        x: 35,
        y: 115,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "Support",
        description: "What resources, allies, or strengths will support you.",
        x: 145,
        y: 115,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "Challenge",
        description: "The main obstacle or friction point to navigate.",
        x: 255,
        y: 115,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "Best Focus",
        description: "The most helpful practical focus for the month ahead.",
        x: 365,
        y: 115,
        width: 90,
        height: 150
      }
    ],
    instructions: "Set your intention for the next four weeks and shuffle. Lay four cards left to right, then read the spread as a concise monthly roadmap.",
    tips: [
      "Pull this spread near the start of the month",
      "Write one actionable goal from the Best Focus card",
      "Revisit the Challenge card midway through the month",
      "Compare next month's spread to track recurring themes"
    ],
    bestFor: ["Monthly planning", "Lightweight guidance", "Building consistency", "Short-term focus"]
  },
  {
    id: "crossroads-choice",
    name: "Crossroads Choice",
    description: "A decision spread for comparing two paths and choosing your next move with clarity.",
    cardCount: 5,
    difficulty: "Intermediate",
    category: "Problem-Solving",
    svg: `<rect x="35" y="125" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="80" y="205" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="145" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="190" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="145" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="190" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="255" y="40" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="300" y="120" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>
          <rect x="255" y="210" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="300" y="290" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">5</text>`,
    positions: [
      {
        number: 1,
        name: "Core Question",
        description: "The truth at the center of this decision.",
        x: 35,
        y: 125,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "Path A Gift",
        description: "What choosing Path A offers you.",
        x: 145,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "Path A Cost",
        description: "What choosing Path A may require or sacrifice.",
        x: 145,
        y: 210,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "Path B Gift",
        description: "What choosing Path B offers you.",
        x: 255,
        y: 40,
        width: 90,
        height: 150
      },
      {
        number: 5,
        name: "Path B Cost",
        description: "What choosing Path B may require or sacrifice.",
        x: 255,
        y: 210,
        width: 90,
        height: 150
      }
    ],
    instructions: "Name the two options clearly before you shuffle. Lay card 1 first for the core truth, then place cards 2-3 for Path A and cards 4-5 for Path B.",
    tips: [
      "Use specific language for each option",
      "Treat cost cards as clarity, not warnings",
      "Notice which path aligns more with your values",
      "If still unclear, sleep on it and reread tomorrow"
    ],
    bestFor: ["Big decisions", "Choosing between options", "Strategic clarity", "Reducing indecision"]
  },
  {
    id: "five-element-balance",
    name: "Five Element Balance",
    description: "A balancing spread to check your current mix of drive, emotion, thought, grounding, and spirit.",
    cardCount: 5,
    difficulty: "Intermediate",
    category: "Spiritual",
    svg: `<rect x="190" y="20" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="235" y="100" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">1</text>
          <rect x="70" y="120" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="115" y="200" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">2</text>
          <rect x="310" y="120" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="355" y="200" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">3</text>
          <rect x="120" y="235" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="165" y="315" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">4</text>
          <rect x="260" y="235" width="90" height="150" rx="8" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
          <text x="305" y="315" text-anchor="middle" fill="#374151" font-size="14" font-weight="bold">5</text>`,
    positions: [
      {
        number: 1,
        name: "Spirit",
        description: "Your sense of meaning, trust, and higher perspective.",
        x: 190,
        y: 20,
        width: 90,
        height: 150
      },
      {
        number: 2,
        name: "Fire",
        description: "Your energy, motivation, and courage to act.",
        x: 70,
        y: 120,
        width: 90,
        height: 150
      },
      {
        number: 3,
        name: "Water",
        description: "Your emotional flow, sensitivity, and relationships.",
        x: 310,
        y: 120,
        width: 90,
        height: 150
      },
      {
        number: 4,
        name: "Air",
        description: "Your mental clarity, communication, and perspective.",
        x: 120,
        y: 235,
        width: 90,
        height: 150
      },
      {
        number: 5,
        name: "Earth",
        description: "Your practical stability, body, and everyday foundation.",
        x: 260,
        y: 235,
        width: 90,
        height: 150
      }
    ],
    instructions: "Ground yourself with three slow breaths, then shuffle while asking where your life is out of balance. Place cards in the five-point pattern and read where energy is abundant versus depleted.",
    tips: [
      "Look for one element that needs immediate care",
      "Turn each card into one balancing action this week",
      "Notice if Spirit supports or disconnects from the other four",
      "Use this spread regularly during stressful periods"
    ],
    bestFor: ["Energy check-ins", "Holistic self-care", "Spiritual grounding", "Restoring balance"]
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
