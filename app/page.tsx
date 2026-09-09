import { LandingPage } from '@/components/landing/landing-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Haribon — Study sharp. Soar higher.',
  description:
    'Adaptive flashcards, FSRS spaced repetition, focused study sessions, and momentum that lasts. Free forever for every student.',
}

export default function Page() {
  return <LandingPage />
}
