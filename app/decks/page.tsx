'use client'

import { AppShell } from '@/components/app/app-shell'
import { DeckListView } from '@/components/app/deck-list-view'

export default function DecksPage() {
  return (
    <AppShell>
      <DeckListView onStartStudy={() => {}} />
    </AppShell>
  )
}
