'use client'

import { useRouter } from 'next/navigation'
import { StudySheet } from '@/components/shared/study-sheet'

export function StudyRouteClient({ deckId }: { deckId: string }) {
  const router = useRouter()

  return (
    <StudySheet
      open
      deckId={deckId}
      onClose={() => router.push('/decks')}
    />
  )
}
