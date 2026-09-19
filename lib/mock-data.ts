export interface Flashcard {
  id: string
  deckId: string
  subject: string
  question: string
  answer: string
  hint?: string
  lastInterval?: string
  confidence?: 'again' | 'hard' | 'good' | 'easy'
  stability?: number // FSRS Stability S (days memory lasts)
  difficulty?: number // FSRS Difficulty D (1 to 10 scale)
  reps?: number
  lapses?: number
}

export interface Deck {
  id: string
  title: string
  subject: string
  cards: number
  due: number
  retention: number
  color: string
  badgeBg?: string
  description?: string
  author?: string
  cardsList: Flashcard[]
}

export interface Quest {
  id: string
  title: string
  xp: number
  completed: boolean
  iconType: 'check' | 'timer' | 'flame' | 'sparkles'
}

export interface PackRankTier {
  levelMin: number
  levelMax: number
  title: string
  subtitle: string
  badgeColor: string
  icon: 'paw' | 'ball' | 'bolt' | 'compass' | 'search' | 'bone' | 'crown'
  perks: string[]
}

export type FlightRankTier = PackRankTier

export const packRankTiers: PackRankTier[] = [
  {
    levelMin: 1,
    levelMax: 3,
    title: 'New Pup',
    subtitle: 'Kennel Rookie',
    badgeColor: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    icon: 'paw',
    perks: ['Basic FSRS scheduling', '3 daily AI tutor dialogues', 'Personal deck creator'],
  },
  {
    levelMin: 4,
    levelMax: 7,
    title: 'Fetch Rookie',
    subtitle: 'Scent Seeker',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    icon: 'ball',
    perks: ['Multiplayer live arenas', '5 daily AI tutor dialogues', 'Custom study timer'],
  },
  {
    levelMin: 8,
    levelMax: 12,
    title: 'Quick Paws',
    subtitle: 'Agility Hound',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    icon: 'bolt',
    perks: ['10 daily AI tutor dialogues', '1x Streak Freeze Shield', 'Deck cloning & export'],
  },
  {
    levelMin: 13,
    levelMax: 18,
    title: 'Trail Sniffer',
    subtitle: 'Master Tracker',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: 'compass',
    perks: ['2x XP thermal boost multipliers', '18 daily AI tutor dialogues', '2x Streak Freeze Shields', 'Community deck publishing'],
  },
  {
    levelMin: 19,
    levelMax: 25,
    title: 'Scent Tracker',
    subtitle: 'Precision Retriever',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: 'search',
    perks: ['Unlimited AI tutor dialogues', 'Ebbinghaus curve analytics', '3x Streak Freeze Shields'],
  },
  {
    levelMin: 26,
    levelMax: 35,
    title: 'Top Dog',
    subtitle: 'Pack Champion',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    icon: 'bone',
    perks: ['Exclusive live arena host capabilities', 'Real-time FSRS algorithm optimizer', 'Gold retriever badge'],
  },
  {
    levelMin: 36,
    levelMax: 50,
    title: 'Pack Leader',
    subtitle: 'Top Dog Sovereign',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    icon: 'crown',
    perks: ['Mastery golden border badge', 'Sovereign pack aura', 'Early access to AI voice recall'],
  },
]

export const flightRankTiers = packRankTiers

export interface UserProfile {
  name: string
  initials: string
  grade: string
  level: number
  streak: number
  totalXp: number
  todayXp: number
  levelTitle: string
  xpToNextLevel: number
  aiUsesRemaining: number
  streakShields: number
}

export const initialUser: UserProfile = {
  name: 'Alex Mendoza',
  initials: 'AM',
  grade: 'Grade 12 · STEM',
  level: 18,
  streak: 12,
  totalXp: 1840,
  todayXp: 640,
  levelTitle: 'Trail Sniffer',
  xpToNextLevel: 380,
  aiUsesRemaining: 18,
  streakShields: 2,
}

export const initialDecks: Deck[] = [
  {
    id: 'bio-respiration',
    title: 'Cellular respiration',
    subject: 'Biology',
    cards: 42,
    due: 12,
    retention: 78,
    color: 'bg-emerald-600 dark:bg-emerald-400',
    description: 'Glycolysis, Krebs cycle, electron transport chain, and ATP synthesis mechanisms.',
    author: 'Alex Mendoza',
    cardsList: [
      {
        id: 'c1',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'What is the primary purpose of the electron transport chain?',
        answer: 'To create a proton gradient across the inner mitochondrial membrane that drives ATP synthase, producing the majority of ATP in aerobic respiration.',
        hint: 'Think about chemiosmosis and proton gradients.',
        stability: 4.2,
        difficulty: 6.8,
        reps: 5,
        lapses: 1,
      },
      {
        id: 'c2',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'Where does glycolysis take place within the cell?',
        answer: 'Glycolysis occurs in the cytoplasm (cytosol) and does not require oxygen (anaerobic).',
        hint: 'It does not require mitochondrial entry.',
        stability: 9.1,
        difficulty: 3.4,
        reps: 8,
        lapses: 0,
      },
      {
        id: 'c3',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'What is the net yield of ATP per glucose molecule from glycolysis alone?',
        answer: 'Net yield of 2 ATP (4 ATP produced minus 2 ATP consumed in the investment phase).',
        hint: 'Gross is 4, but 2 were invested upfront.',
        stability: 6.5,
        difficulty: 4.1,
        reps: 6,
        lapses: 0,
      },
      {
        id: 'c4',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'What is the final electron acceptor in the mitochondrial electron transport chain?',
        answer: 'Molecular oxygen (O₂), which combines with protons to form water (H₂O).',
        hint: 'It forms a familiar vital liquid molecule.',
        stability: 3.8,
        difficulty: 5.9,
        reps: 4,
        lapses: 1,
      },
    ],
  },
  {
    id: 'ph-history',
    title: 'Philippine history & Katipunan',
    subject: 'History',
    cards: 68,
    due: 7,
    retention: 91,
    color: 'bg-amber-600 dark:bg-amber-400',
    description: 'Key events, figures, and turning points from the Philippine Revolution to the First Republic.',
    author: 'Alex Mendoza',
    cardsList: [
      {
        id: 'h1',
        deckId: 'ph-history',
        subject: 'History',
        question: 'What was the revolutionary secret society founded by Andres Bonifacio in 1892?',
        answer: 'Kataas-taasang, Kagalang-galangang Katipunan ng mga Anak ng Bayan (KKK).',
        hint: 'Founded on July 7, 1892 in Tondo, Manila.',
        stability: 14.2,
        difficulty: 2.8,
        reps: 11,
        lapses: 0,
      },
      {
        id: 'h2',
        deckId: 'ph-history',
        subject: 'History',
        question: 'What document is considered the philosophical guide and moral code of the Katipunan written by Emilio Jacinto?',
        answer: 'Kartilya ng Katipunan.',
        hint: 'Written by the "Brain of the Katipunan".',
        stability: 11.5,
        difficulty: 4.2,
        reps: 9,
        lapses: 0,
      },
      {
        id: 'h3',
        deckId: 'ph-history',
        subject: 'History',
        question: 'Where and when was Philippine Independence proclaimed by Emilio Aguinaldo?',
        answer: 'June 12, 1898 in Kawit, Cavite.',
        hint: 'Proclaimed from the window of his ancestral house.',
        stability: 18.0,
        difficulty: 2.1,
        reps: 12,
        lapses: 0,
      },
    ],
  },
  {
    id: 'calc-integrals',
    title: 'Integral calculus & Series',
    subject: 'Mathematics',
    cards: 35,
    due: 4,
    retention: 64,
    color: 'bg-indigo-600 dark:bg-indigo-400',
    description: 'Integration by parts, trigonometric substitutions, Taylor expansions, and convergence tests.',
    author: 'Alex Mendoza',
    cardsList: [
      {
        id: 'm1',
        deckId: 'calc-integrals',
        subject: 'Mathematics',
        question: 'What is the formula for integration by parts?',
        answer: '∫ u dv = uv - ∫ v du, derived from the product rule of differentiation.',
        hint: 'Recall the LIATE mnemonic for picking u.',
        stability: 2.1,
        difficulty: 7.8,
        reps: 3,
        lapses: 2,
      },
      {
        id: 'm2',
        deckId: 'calc-integrals',
        subject: 'Mathematics',
        question: 'What is the integral of sec(x) dx?',
        answer: 'ln|sec(x) + tan(x)| + C.',
        hint: 'Multiply numerator and denominator by sec(x) + tan(x).',
        stability: 1.8,
        difficulty: 8.5,
        reps: 2,
        lapses: 2,
      },
      {
        id: 'm3',
        deckId: 'calc-integrals',
        subject: 'Mathematics',
        question: 'State the Fundamental Theorem of Calculus (Part 1).',
        answer: 'If f is continuous on [a, b] and F(x) = ∫[a to x] f(t)dt, then F\'(x) = f(x).',
        hint: 'Relates derivatives to definite integrals.',
        stability: 5.6,
        difficulty: 5.2,
        reps: 5,
        lapses: 1,
      },
    ],
  },
  {
    id: 'chem-orgo',
    title: 'Organic synthesis & Mechanisms',
    subject: 'Chemistry',
    cards: 54,
    due: 9,
    retention: 82,
    color: 'bg-purple-600 dark:bg-purple-400',
    description: 'SN1, SN2, E1, E2 reactions, stereochemistry, and carbonyl addition reactions.',
    author: 'Community · UP Diliman',
    cardsList: [
      {
        id: 'ch1',
        deckId: 'chem-orgo',
        subject: 'Chemistry',
        question: 'What conditions favor an SN2 mechanism over an SN1 mechanism?',
        answer: 'Primary/secondary substrates, strong nucleophile, polar aprotic solvent, and low steric hindrance.',
        hint: 'Bimolecular, concerted mechanism with inversion of stereochemistry.',
        stability: 6.8,
        difficulty: 6.2,
        reps: 6,
        lapses: 1,
      },
    ],
  },
]

export const initialQuests: Quest[] = [
  { id: 'q1', title: 'Review 20 cards today', xp: 80, completed: false, iconType: 'check' },
  { id: 'q2', title: 'Keep a 90% accuracy streak', xp: 120, completed: false, iconType: 'flame' },
  { id: 'q3', title: 'Ask Fetch to explain one tough card', xp: 100, completed: false, iconType: 'check' },
]

export interface MomentumDay {
  day: string
  short: string
  xp: number
  pct: number
  cards: number
  accuracy: number
  active?: boolean
}

export const weeklyMomentumData: MomentumDay[] = [
  { day: 'Mon', short: 'M', xp: 320, pct: 45, cards: 14, accuracy: 88 },
  { day: 'Tue', short: 'T', xp: 480, pct: 65, cards: 20, accuracy: 92 },
  { day: 'Wed', short: 'W', xp: 410, pct: 58, cards: 18, accuracy: 90 },
  { day: 'Thu', short: 'T', xp: 620, pct: 85, cards: 26, accuracy: 95 },
  { day: 'Fri', short: 'F', xp: 510, pct: 70, cards: 22, accuracy: 91 },
  { day: 'Sat', short: 'S', xp: 750, pct: 100, cards: 32, accuracy: 96 },
  { day: 'Sun', short: 'S', xp: 640, pct: 88, cards: 28, accuracy: 94, active: true },
]

export interface ForgettingCurvePoint {
  day: string
  decayWithoutReview: number
  retentionWithReview: number
}

export const forgettingCurveData: ForgettingCurvePoint[] = [
  { day: 'Day 0', decayWithoutReview: 100, retentionWithReview: 100 },
  { day: 'Day 1', decayWithoutReview: 68, retentionWithReview: 96 },
  { day: 'Day 2', decayWithoutReview: 52, retentionWithReview: 94 },
  { day: 'Day 3', decayWithoutReview: 41, retentionWithReview: 92 },
  { day: 'Day 4', decayWithoutReview: 33, retentionWithReview: 90 },
  { day: 'Day 5', decayWithoutReview: 28, retentionWithReview: 89 },
  { day: 'Day 6', decayWithoutReview: 24, retentionWithReview: 88 },
  { day: 'Day 7', decayWithoutReview: 21, retentionWithReview: 87 },
]

export const exploreDecks = [
  {
    title: 'Human Anatomy & Physiology',
    subject: 'Medicine',
    author: 'Fetch community study set',
    cards: 140,
    likes: 890,
    retention: 88,
    tags: ['Organ Systems', 'Circulation', 'Neurology'],
    color: 'bg-rose-600 dark:bg-rose-400',
  },
  {
    title: 'Constitutional Law & Civil Liberties',
    subject: 'Law',
    author: 'Fetch community study set',
    cards: 95,
    likes: 640,
    retention: 94,
    tags: ['Bill of Rights', 'Jurisprudence'],
    color: 'bg-sky-600 dark:bg-sky-400',
  },
  {
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    author: 'Fetch community study set',
    cards: 84,
    likes: 1240,
    retention: 79,
    tags: ['Trees', 'Graphs', 'Dynamic Programming'],
    color: 'bg-teal-600 dark:bg-teal-400',
  },
  {
    title: 'Microeconomics: Supply, Demand & Markets',
    subject: 'Economics',
    author: 'Fetch community study set',
    cards: 62,
    likes: 430,
    retention: 86,
    tags: ['Elasticity', 'Market Structures'],
    color: 'bg-orange-600 dark:bg-orange-400',
  },
]
