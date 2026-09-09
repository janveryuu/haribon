'use client'

import { AppShell } from '@/components/app/app-shell'
import { DashboardView } from '@/components/app/dashboard-view'

export default function HomePage() {
  return (
    <AppShell>
      <DashboardView onStartStudy={() => {}} />
    </AppShell>
  )
}
