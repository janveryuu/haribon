export interface Flashcard {
  id: string
  deckId: string
  subject: string
  question: string
  answer: string
  hint?: string
  lastInterval?: string
  confidence?: 'again' | 'hard' | 'good' | 'easy'
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
}

export const initialUser: UserProfile = {
  name: 'Alex Mendoza',
  initials: 'AM',
  grade: 'Grade 12 · STEM',
  level: 18,
  streak: 12,
  totalXp: 1840,
  todayXp: 640,
  levelTitle: 'Trailblazer',
  xpToNextLevel: 380,
  aiUsesRemaining: 18,
}

export const initialDecks: Deck[] = [
  {
    id: 'bio-respiration',
    title: 'Cellular respiration',
    subject: 'Biology',
    cards: 42,
    due: 12,
    retention: 78,
    color: 'bg-primary',
    description: 'Glycolysis, Krebs cycle, electron transport chain, and ATP synthesis mechanisms.',
    author: 'Alex Mendoza',
    cardsList: [
      {
        id: 'c1',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'What is the primary purpose of the electron transport chain?',
        answer: 'To create a proton gradient across the inner mitochondrial membrane that drives ATP synthase, producing the majority of ATP in aerobic respiration.',
        hint: 'Think about chemiosmosis and proton gradients.'
      },
      {
        id: 'c2',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'Where does glycolysis take place within the cell?',
        answer: 'Glycolysis occurs in the cytoplasm (cytosol) and does not require oxygen (anaerobic).',
        hint: 'It does not require mitochondrial entry.'
      },
      {
        id: 'c3',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'What is the net yield of ATP per glucose molecule from glycolysis alone?',
        answer: 'Net yield of 2 ATP (4 ATP produced minus 2 ATP consumed in the investment phase).',
        hint: 'Gross is 4, but 2 were invested upfront.'
      },
      {
        id: 'c4',
        deckId: 'bio-respiration',
        subject: 'Biology',
        question: 'What is the final electron acceptor in the mitochondrial electron transport chain?',
        answer: 'Molecular oxygen (O₂), which combines with protons to form water (H₂O).',
        hint: 'It forms a familiar vital liquid molecule.'
      }
    ]
  },
  {
    id: 'ph-history',
    title: 'Philippine history & Katipunan',
    subject: 'History',
    cards: 68,
    due: 7,
    retention: 91,
    color: 'bg-ember',
    description: 'Key events, figures, and turning points from the Philippine Revolution to the First Republic.',
    author: 'Alex Mendoza',
    cardsList: [
      {
        id: 'h1',
        deckId: 'ph-history',
        subject: 'History',
        question: 'What was the revolutionary secret society founded by Andres Bonifacio in 1892?',
        answer: 'Kataas-taasang, Kagalang-galangang Katipunan ng mga Anak ng Bayan (KKK).',
        hint: 'Founded on July 7, 1892 in Tondo, Manila.'
      },
      {
        id: 'h2',
        deckId: 'ph-history',
        subject: 'History',
        question: 'What document is considered the philosophical guide and moral code of the Katipunan written by Emilio Jacinto?',
        answer: 'Kartilya ng Katipunan.',
        hint: 'Written by the "Brain of the Katipunan".'
      },
      {
        id: 'h3',
        deckId: 'ph-history',
        subject: 'History',
        question: 'Where and when was Philippine Independence proclaimed by Emilio Aguinaldo?',
        answer: 'June 12, 1898 in Kawit, Cavite.',
        hint: 'Proclaimed from the window of his ancestral house.'
      }
    ]
  },
  {
    id: 'calc-integrals',
    title: 'Integral calculus & Series',
    subject: 'Mathematics',
    cards: 35,
    due: 4,
    retention: 64,
    color: 'bg-success',
    description: 'Integration by parts, trigonometric substitutions, Taylor expansions, and convergence tests.',
    author: 'Alex Mendoza',
    cardsList: [
      {
        id: 'm1',
        deckId: 'calc-integrals',
        subject: 'Mathematics',
        question: 'What is the formula for integration by parts?',
        answer: '∫ u dv = uv - ∫ v du, derived from the product rule of differentiation.',
        hint: 'Recall the LIATE mnemonic for picking u.'
      },
      {
        id: 'm2',
        deckId: 'calc-integrals',
        subject: 'Mathematics',
        question: 'What is the integral of sec(x) dx?',
        answer: 'ln|sec(x) + tan(x)| + C.',
        hint: 'Multiply numerator and denominator by sec(x) + tan(x).'
      },
      {
        id: 'm3',
        deckId: 'calc-integrals',
        subject: 'Mathematics',
        question: 'State the Fundamental Theorem of Calculus (Part 1).',
        answer: 'If f is continuous on [a, b] and F(x) = ∫[a to x] f(t)dt, then F\'(x) = f(x).',
        hint: 'Relates derivatives to definite integrals.'
      }
    ]
  },
  {
    id: 'chem-orgo',
    title: 'Organic synthesis & Mechanisms',
    subject: 'Chemistry',
    cards: 54,
    due: 9,
    retention: 82,
    color: 'bg-primary',
    description: 'SN1, SN2, E1, E2 reactions, stereochemistry, and carbonyl addition reactions.',
    author: 'Community · UP Diliman',
    cardsList: [
      {
        id: 'ch1',
        deckId: 'chem-orgo',
        subject: 'Chemistry',
        question: 'What conditions favor an SN2 mechanism over an SN1 mechanism?',
        answer: 'Primary/secondary substrates, strong nucleophile, polar aprotic solvent, and low steric hindrance.',
        hint: 'Bimolecular, concerted mechanism with inversion of stereochemistry.'
      }
    ]
  }
]

export const initialQuests: Quest[] = [
  { id: 'q1', title: 'Review 20 cards today', xp: 80, completed: true, iconType: 'check' },
  { id: 'q2', title: 'Keep a 90% accuracy streak', xp: 120, completed: true, iconType: 'check' },
  { id: 'q3', title: 'Try an AI deck scan or tutor prompt', xp: 100, completed: false, iconType: 'timer' },
]

export const weeklyMomentumData = [
  { day: 'Mon', short: 'M', xp: 320, pct: 45 },
  { day: 'Tue', short: 'T', xp: 480, pct: 65 },
  { day: 'Wed', short: 'W', xp: 410, pct: 58 },
  { day: 'Thu', short: 'T', xp: 620, pct: 85 },
  { day: 'Fri', short: 'F', xp: 510, pct: 70 },
  { day: 'Sat', short: 'S', xp: 750, pct: 100 },
  { day: 'Sun', short: 'S', xp: 640, pct: 88, active: true },
]

export const exploreDecks = [
  {
    title: 'Human Anatomy & Physiology',
    subject: 'Medicine',
    author: 'Dr. Santos · UST Med',
    cards: 140,
    likes: 890,
    retention: 88,
    tags: ['Organ Systems', 'Circulation', 'Neurology'],
    color: 'bg-destructive'
  },
  {
    title: 'Constitutional Law & Civil Liberties',
    subject: 'Law',
    author: 'Atty. Reyes · Ateneo Law',
    cards: 95,
    likes: 640,
    retention: 94,
    tags: ['Bill of Rights', 'Jurisprudence'],
    color: 'bg-primary'
  },
  {
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    author: 'Engr. Chen · DLSU CS',
    cards: 84,
    likes: 1240,
    retention: 79,
    tags: ['Trees', 'Graphs', 'Dynamic Programming'],
    color: 'bg-ember'
  },
  {
    title: 'Microeconomics: Supply, Demand & Markets',
    subject: 'Economics',
    author: 'Prof. Garcia · UP Econ',
    cards: 62,
    likes: 430,
    retention: 86,
    tags: ['Elasticity', 'Market Structures'],
    color: 'bg-success'
  }
]
