'use client'

import { AppShell } from '@/components/app/app-shell'
import { PlayRouteClient } from '@/components/app/play-route-client'
import { Suspense } from 'react'

export default function PlayPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="mx-auto w-full max-w-[1240px] px-4 py-12 text-sm text-muted-foreground">Loading the study circle...</div>}>
        <PlayRouteClient />
      </Suspense>
    </AppShell>
  )
}
