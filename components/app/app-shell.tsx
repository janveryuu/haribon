'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/app/sidebar'
import { Topbar } from '@/components/app/topbar'
import { BottomNav } from '@/components/app/bottom-nav'
import { SearchPalette } from '@/components/shared/search-palette'
import { StudySheet } from '@/components/shared/study-sheet'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeStudyDeck, setActiveStudyDeck] = useState<string | null>(null)

  const handleStartStudy = (deckId?: string) => {
    setActiveStudyDeck(deckId || 'bio-respiration')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
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
      <BottomNav />

      {/* Global Command/Search Palette */}
      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDeck={(deckId) => {
          setActiveStudyDeck(deckId)
        }}
      />

      {/* Global Flashcard Review Sheet Modal */}
      <StudySheet
        open={activeStudyDeck !== null}
        deckId={activeStudyDeck || undefined}
        onClose={() => setActiveStudyDeck(null)}
      />
    </div>
  )
}
