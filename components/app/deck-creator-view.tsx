'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  FileText,
  ImageIcon,
  Type,
  Sparkles,
  UploadCloud,
  Check,
  ArrowRight,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Flashcard, initialDecks } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface DeckCreatorViewProps {
  onStartStudy?: (deckId: string) => void
}

export function DeckCreatorView({ onStartStudy }: DeckCreatorViewProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'pdf' | 'photo' | 'paste' | 'topic'>('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [deckTitle, setDeckTitle] = useState('Neurological Pathways & Synapses')
  const [subject, setSubject] = useState('Biology')
  const [cards, setCards] = useState<Flashcard[]>([
    {
      id: 'nc1',
      deckId: 'new',
      subject: 'Biology',
      question: 'What is the role of myelin sheath in action potential propagation?',
      answer: 'It acts as an electrical insulator, allowing saltatory conduction between Nodes of Ranvier to dramatically increase signal velocity.',
      hint: 'Think about speed and insulation.',
    },
    {
      id: 'nc2',
      deckId: 'new',
      subject: 'Biology',
      question: 'What neurotransmitter is primarily released at neuromuscular junctions?',
      answer: 'Acetylcholine (ACh).',
      hint: 'Commonly abbreviated as ACh.',
    },
  ])

  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSimulateGeneration = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCards((prev) => [
        ...prev,
        {
          id: `gen-${Date.now()}`,
          deckId: 'new',
          subject,
          question: 'What ion influx triggers neurotransmitter vesicle exocytosis at the axon terminal?',
          answer: 'Calcium ions (Ca²⁺) entering through voltage-gated calcium channels.',
          hint: 'Divalent cation.',
        },
      ])
    }, 1200)
  }

  const handleAddManualCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    setCards((prev) => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        deckId: 'new',
        subject,
        question: newQuestion,
        answer: newAnswer,
      },
    ])
    setNewQuestion('')
    setNewAnswer('')
  }

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSaveDeck = () => {
    setSavedSuccess(true)
    setTimeout(() => {
      router.push('/decks')
    }, 1500)
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-[1100px] px-4 pb-28 pt-6 md:px-8 md:pt-8 lg:px-10"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          AI Deck Builder
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Raw notes in. Ready to study out.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a material source. Haribon extracts key concepts into active recall pairs with spaced repetition intervals.
        </p>
      </div>

      {/* Creation Mode Tabs */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { id: 'pdf' as const, label: 'PDF or Slides', icon: FileText },
          { id: 'photo' as const, label: 'Photo of Notes', icon: ImageIcon },
          { id: 'paste' as const, label: 'Paste Text', icon: Type },
          { id: 'topic' as const, label: 'Topic & AI Prompt', icon: Sparkles },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={cn(
              'flex min-h-28 flex-col justify-between rounded-[22px] border p-4 text-left transition-all',
              mode === item.id
                ? 'border-primary bg-primary/5 shadow-sm text-primary font-bold'
                : 'border-border bg-card text-foreground hover:border-primary/40'
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="font-display text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Source Input Container */}
      <div className="mt-6 rounded-[28px] border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Deck Title
            </label>
            <input
              type="text"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Subject Category
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Dynamic Source Upload Area */}
        <div className="mt-6 rounded-2xl border-2 border-dashed border-border bg-background/50 p-8 text-center">
          <UploadCloud className="mx-auto size-10 text-primary mb-3" />
          <p className="font-display text-base font-bold text-foreground">
            {mode === 'pdf'
              ? 'Drag and drop lecture slides or PDF syllabus'
              : mode === 'photo'
              ? 'Upload photos of handwritten notebook pages'
              : mode === 'paste'
              ? 'Paste raw lecture transcript or notes here'
              : 'Enter a topic to generate a comprehensive deck'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports PDF, PNG, JPG, Markdown, and TXT files up to 25MB
          </p>

          <div className="mt-5 flex justify-center">
            <Button
              onClick={handleSimulateGeneration}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="size-4 animate-spin" /> Extracting Concepts...
                </>
              ) : (
                <>
                  <Zap className="size-4" /> Generate Active Recall Cards
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Generated Cards Preview & Editing */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Review & Customize Cards ({cards.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              You can edit questions, answers, and hints before saving.
            </p>
          </div>

          <Button
            onClick={handleSaveDeck}
            disabled={cards.length === 0 || savedSuccess}
            className="gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="size-4 text-success" /> Saved to Library!
              </>
            ) : (
              <>
                Save Deck & Start <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        {/* Cards List */}
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-primary">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground">
                    {card.question}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {card.answer}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteCard(card.id)}
                className="text-muted-foreground hover:text-destructive p-2 rounded-lg transition-colors ml-auto"
                aria-label="Delete card"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Add Custom Card */}
        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Add Custom Card
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Question / Active recall prompt..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none"
            />
            <input
              type="text"
              placeholder="Answer / Key explanation..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddManualCard}
              disabled={!newQuestion.trim() || !newAnswer.trim()}
              className="gap-1.5"
            >
              <Plus className="size-3.5" /> Add Card
            </Button>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
