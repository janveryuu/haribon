'use client'

import { AppShell } from '@/components/app/app-shell'
import { DeckCreatorView } from '@/components/app/deck-creator-view'

export default function CreatePage() {
  return (
    <AppShell>
      <DeckCreatorView />
    </AppShell>
  )
}
