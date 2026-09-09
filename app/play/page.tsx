'use client'

import { AppShell } from '@/components/app/app-shell'
import { LivePlayView } from '@/components/app/live-play-view'

export default function PlayPage() {
  return (
    <AppShell>
      <LivePlayView />
    </AppShell>
  )
}
