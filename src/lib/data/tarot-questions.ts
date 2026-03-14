/**
 * Tarot questions for single-card pulls, grouped by theme.
 * All content centralized in src/lib/data/ per project rules.
 */

export interface TarotQuestionTheme {
  id: string;
  name: string;
  description: string;
  questions: readonly string[];
}

export const TAROT_QUESTION_THEMES: readonly TarotQuestionTheme[] = [
  {
    id: 'alignment-purpose',
    name: 'Alignment & Purpose',
    description: 'Questions about living in alignment with your desires and path',
    questions: [
      'Am I acting in alignment with what I want?',
      'What do I need to focus on to move toward my goals?',
      'Is my current path serving my highest good?',
      'What would my most authentic self do in this situation?',
      'Where am I out of alignment with my values?',
      'What purpose is trying to emerge through me right now?',
      'What am I pretending not to want?',
      'What would I do if I trusted myself completely?'
    ]
  },
  {
    id: 'energy-boundaries',
    name: 'Energy & Boundaries',
    description: 'Questions about your energetic field, giving, and boundaries',
    questions: [
      'Is there something missing from my energetic field?',
      'Where in my life am I over-giving?',
      'What boundary do I need to set or strengthen?',
      'Where am I leaking energy?',
      'What or who is draining me that I need to release?',
      'Where do I need to say no to make space for yes?',
      'What would it look like to protect my energy without guilt?',
      'Am I giving from overflow or from depletion?'
    ]
  },
  {
    id: 'truth-shadow',
    name: 'Truth & Shadow',
    description: 'Questions that invite honest or uncomfortable awareness',
    questions: [
      'Is there something I need to know even if it is going to hurt my feelings?',
      'What am I avoiding that wants my attention?',
      'What shadow aspect is asking to be acknowledged?',
      'What truth am I afraid to admit to myself?',
      'What story am I telling that no longer serves me?',
      'What would I see if I stopped defending and started listening?',
      'What part of me am I still hiding from the world?',
      'What uncomfortable truth would set me free?'
    ]
  },
  {
    id: 'focus-priorities',
    name: 'Focus & Priorities',
    description: 'Questions about where to direct attention and what needs care',
    questions: [
      'What area of my life needs more attention right now?',
      'What should I release to make space for what matters?',
      "What's the one thing I'm not seeing clearly?",
      'What deserves my energy today?',
      'What have I been neglecting that is asking for care?',
      'Where am I spreading myself too thin?',
      'What would simplify my life if I embraced it?',
      'What is ready to receive my focus?'
    ]
  },
  {
    id: 'love-relationships',
    name: 'Love & Relationships',
    description: 'Questions about connection, partnership, and heart',
    questions: [
      'What do I need to give or receive in my relationships right now?',
      'What pattern in love am I ready to release?',
      'How can I show up more fully for the people I care about?',
      'What is my heart asking me to acknowledge?',
      'Where am I holding back in connection?',
      'What lesson is my current relationship (or lack of one) teaching me?',
      'How can I love myself more honestly today?',
      'What would deeper intimacy require of me?'
    ]
  },
  {
    id: 'career-creativity',
    name: 'Career & Creativity',
    description: 'Questions about work, calling, and creative expression',
    questions: [
      'What step would move my work or creativity forward?',
      'What am I meant to create or contribute right now?',
      'Where am I playing small in my career or craft?',
      'What opportunity is waiting for my yes?',
      'What would success look like if I defined it for myself?',
      'What block is ready to be released in my creative life?',
      'How can I bring more of myself into my work?',
      'What is the next right move, even if it scares me?'
    ]
  },
  {
    id: 'spiritual-growth',
    name: 'Spiritual Growth',
    description: 'Questions about inner growth and connection to something larger',
    questions: [
      'What is the universe or my higher self trying to show me?',
      'What practice or ritual would support my growth right now?',
      'Where am I being invited to trust more?',
      'What old belief is ready to be updated?',
      'How can I deepen my connection to what matters most?',
      'What message is my intuition sending that I have been ignoring?',
      'What would it mean to surrender control in this situation?',
      'What part of my path is asking for faith over fear?'
    ]
  },
  {
    id: 'self-care-inner-life',
    name: 'Self-Care & Inner Life',
    description: 'Questions about rest, nourishment, and inner world',
    questions: [
      'What do I need to restore or replenish?',
      'How can I be gentler with myself today?',
      'What does my body or mind need that I have been ignoring?',
      'What would true rest look like for me?',
      'Where am I criticizing myself instead of comforting?',
      'What small act of self-care would make a big difference?',
      'What inner voice deserves to be heard?',
      'What would it mean to put my own oxygen mask on first?'
    ]
  },
  {
    id: 'decisions-change',
    name: 'Decisions & Change',
    description: 'Questions for when you are at a crossroads or facing change',
    questions: [
      'What do I need to know to make this decision?',
      'What am I really choosing between?',
      'What would I do if I were not afraid?',
      'What is the cost of staying where I am?',
      'What is trying to change in my life?',
      'What would my future self thank me for deciding today?',
      'What am I waiting for before I take action?',
      'What small step could I take that would change everything?'
    ]
  },
  {
    id: 'healing-release',
    name: 'Healing & Release',
    description: 'Questions about letting go and moving forward',
    questions: [
      'What am I ready to release?',
      'What wound is asking for healing attention?',
      'What forgiveness would set me free—of myself or another?',
      'What story from the past am I still carrying?',
      'What would it look like to lay down this burden?',
      'What needs to be grieved so I can move on?',
      'What old version of myself am I ready to leave behind?',
      'What would healing this require of me?'
    ]
  },
  {
    id: 'daily-guidance',
    name: 'Daily Guidance',
    description: 'Light, general questions for everyday single-card pulls',
    questions: [
      'What energy should I carry with me today?',
      'What do I need to remember today?',
      'What is the theme of my day?',
      'Where should I direct my attention today?',
      'What message do I need to hear right now?',
      'What would serve me most in this moment?',
      'What is possible for me today?',
      'What quality should I embody today?'
    ]
  }
] as const;

export type TarotQuestionThemeId = (typeof TAROT_QUESTION_THEMES)[number]['id'];

export function getThemeById(id: string): TarotQuestionTheme | undefined {
  return TAROT_QUESTION_THEMES.find((t) => t.id === id);
}

export function getRandomQuestion(themeId?: string): { question: string; theme: TarotQuestionTheme } | null {
  const themes = themeId ? TAROT_QUESTION_THEMES.filter((t) => t.id === themeId) : [...TAROT_QUESTION_THEMES];
  if (themes.length === 0) return null;
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const questions = theme.questions;
  if (questions.length === 0) return null;
  const question = questions[Math.floor(Math.random() * questions.length)];
  return { question, theme };
}

export function getAllThemeIds(): TarotQuestionThemeId[] {
  return TAROT_QUESTION_THEMES.map((t) => t.id);
}
