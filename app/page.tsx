import { LandingPage } from '@/components/landing/landing-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Fetch — What you're about to forget.",
  description:
    'Adaptive flashcards, FSRS spaced repetition, focused study sessions, and momentum that lasts. Never let a card go unretrieved.',
}

export default function Page() {
  return <LandingPage />
}
