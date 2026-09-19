'use client'

import React, { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/app/sidebar'
import { Topbar } from '@/components/app/topbar'
import { BottomNav } from '@/components/app/bottom-nav'
import { SearchPalette } from '@/components/shared/search-palette'
import { PackRankModal } from '@/components/shared/pack-rank-modal'
import { FocusToolsWidget } from '@/components/focus/focus-tools-widget'
import { ActionPlusSheet } from '@/components/focus/action-plus-sheet'
import { useFocusTools } from '@/lib/focus-context'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [rankModalOpen, setRankModalOpen] = useState(false)
  const { isActionMenuOpen, closeActionMenu } = useFocusTools()
  const router = useRouter()

  const handleStartStudy = (deckId?: string) => {
    router.push(`/decks/${deckId || 'bio-respiration'}/study`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Desktop Fixed Sidebar */}
      <Sidebar onOpenRankModal={() => setRankModalOpen(true)} />

      {/* Main Content Area */}
      <div className="lg:pl-[248px] flex flex-col min-h-screen">
        <Topbar onOpenSearch={() => setSearchOpen(true)} />
        <div className="flex-1">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // Pass onStartStudy down if the child accepts it
              return React.cloneElement(child as React.ReactElement<{ onStartStudy?: (d?: string) => void }>, {
                onStartStudy: handleStartStudy,
              })
            }
            return child
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>

      {/* Global Command/Search Palette */}
      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDeck={(deckId) => {
          setSearchOpen(false)
          router.push(`/decks/${deckId}/study`)
        }}
      />

      {/* Global Pack Rank Telemetry Modal */}
      <PackRankModal
        open={rankModalOpen}
        onClose={() => setRankModalOpen(false)}
      />

      {/* Global Focus Tools Floating Widget (Timer & Music) */}
      <FocusToolsWidget />

      {/* Global Action Plus Menu (Mobile Bottom Sheet & Desktop Quick Action) */}
      <ActionPlusSheet
        open={isActionMenuOpen}
        onClose={closeActionMenu}
      />
    </div>
  )
}
