'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Camera,
  Check,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  LoaderCircle,
  Plus,
  RefreshCcw,
  Trash2,
  UploadCloud,
  Wand2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Flashcard } from '@/lib/mock-data'
import { sounds } from '@/lib/sound-effects'
import { cn } from '@/lib/utils'

interface DeckCreatorViewProps {
  onStartStudy?: (deckId: string) => void
}

type SourceMode = 'pdf' | 'photo' | 'paste' | 'topic'
type CreatorStep = 1 | 2 | 3

const sources: { id: SourceMode; label: string; detail: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'pdf', label: 'PDF or slides', detail: 'Upload lecture material', icon: FileText },
  { id: 'photo', label: 'Scan notes', detail: 'Use a photo from class', icon: Camera },
  { id: 'paste', label: 'Paste text', detail: 'Bring in a clean excerpt', icon: BookOpenCheck },
  { id: 'topic', label: 'Start with a topic', detail: 'Build a focused outline', icon: Lightbulb },
]

export function DeckCreatorView({ onStartStudy }: DeckCreatorViewProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<CreatorStep>(1)
  const [mode, setMode] = useState<SourceMode>('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [sourceName, setSourceName] = useState('No source selected yet')
  const [deckTitle, setDeckTitle] = useState('Neurological Pathways & Synapses')
  const [subject, setSubject] = useState('Biology')
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [cards, setCards] = useState<Flashcard[]>([
    {
      id: 'nc1', deckId: 'new', subject: 'Biology',
      question: 'What is the role of myelin sheath in action potential propagation?',
      answer: 'It acts as an electrical insulator, allowing saltatory conduction between Nodes of Ranvier to increase signal velocity.',
      hint: 'Think about speed and insulation.',
    },
    {
      id: 'nc2', deckId: 'new', subject: 'Biology',
      question: 'What neurotransmitter is primarily released at neuromuscular junctions?',
      answer: 'Acetylcholine (ACh).',
      hint: 'Commonly abbreviated as ACh.',
    },
  ])

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSourceName(file.name)
    setStep(2)
    event.target.value = ''
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    sounds.playFlip()
    window.setTimeout(() => {
      setIsGenerating(false)
      sounds.playQuestComplete()
      setCards((current) => [
        ...current,
        { id: `gen-${Date.now()}`, deckId: 'new', subject, question: 'What ion influx triggers neurotransmitter vesicle exocytosis at the axon terminal?', answer: 'Calcium ions (Ca²⁺) entering through voltage-gated calcium channels.', hint: 'Think about the signal at the axon terminal.', stability: 4.8, difficulty: 6.2 },
      ])
      setStep(3)
    }, 900)
  }

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    sounds.playFlip()
    setCards((current) => [...current, { id: `manual-${Date.now()}`, deckId: 'new', subject, question: newQuestion.trim(), answer: newAnswer.trim(), stability: 3.5, difficulty: 5 }])
    setNewQuestion('')
    setNewAnswer('')
  }

  const deleteCard = (id: string) => {
    sounds.playRating('again')
    setCards((current) => current.filter((card) => card.id !== id))
  }

  const invertCards = () => {
    sounds.playFlip()
    setCards((current) => current.map((card) => ({ ...card, question: card.answer, answer: card.question })))
  }

  const saveDeck = () => {
    sounds.playFanfare()
    setSavedSuccess(true)
    window.setTimeout(() => {
      onStartStudy?.('bio-respiration')
      if (!onStartStudy) router.push('/decks')
    }, 750)
  }

  return (
    <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-[1240px] px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-14">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Create study material</p>
          <h1 className="mt-2 max-w-[18ch] text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-5xl">Turn notes into a focused review.</h1>
          <p className="mt-3 max-w-[54ch] text-base leading-relaxed text-muted-foreground">Bring in a source, tune the questions, then start with a clean due queue.</p>
        </div>
        <div className="flex items-start gap-3"><div className="hidden size-14 items-center justify-center rounded-[16px] bg-secondary sm:flex"><Image src="/mascot/coach-study.webp" alt="Fetch studying" width={64} height={64} className="size-12 object-contain" /></div><button type="button" onClick={() => router.back()} className="hidden min-h-11 items-center gap-2 rounded-[13px] border border-border bg-card px-3 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"><ArrowLeft className="size-4" /> Back</button></div>
      </div>

      <nav className="mt-7 grid max-w-[740px] grid-cols-3 gap-2" aria-label="Deck creation progress">
        {[['Source', 1], ['Tune', 2], ['Review', 3]].map(([label, value]) => {
          const current = Number(value) as CreatorStep
          return <button type="button" key={label as string} onClick={() => setStep(current)} className={cn('flex min-h-12 items-center gap-2 rounded-[13px] border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', step === current ? 'border-primary bg-primary/10 text-primary' : step > current ? 'border-success/30 bg-success/8 text-success' : 'border-border bg-card text-muted-foreground')}><span className="flex size-7 items-center justify-center rounded-full bg-background text-xs font-extrabold tabular-nums">{step > current ? <Check className="size-4" /> : current}</span><span className="text-xs font-extrabold sm:text-sm">{label as string}</span></button>
        })}
      </nav>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(380px,.96fr)]">
        <section className="space-y-5">
          <div className="fetch-surface rounded-[22px] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">Step {step} of 3</p><h2 className="mt-2 font-display text-xl font-extrabold text-foreground">{step === 1 ? 'Choose the material' : step === 2 ? 'Give the deck a shape' : 'Review the recall draft'}</h2><p className="mt-1 text-sm text-muted-foreground">{step === 1 ? 'Fetch will use this as the source for your questions.' : step === 2 ? 'A clear title and subject help you find the right review later.' : 'Edit anything before it joins your study queue.'}</p></div><span className="text-xs font-extrabold tabular-nums text-muted-foreground">{cards.length} cards</span></div>

            {step < 3 && <>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{sources.map((source) => { const Icon = source.icon; return <button key={source.id} type="button" onClick={() => setMode(source.id)} className={cn('min-h-[112px] rounded-[16px] border p-3 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', mode === source.id ? 'border-primary bg-primary/8 text-primary' : 'border-border bg-background text-foreground hover:border-primary/40')}><Icon className="size-5" aria-hidden="true" /><span className="mt-5 block text-sm font-extrabold leading-tight">{source.label}</span><span className="mt-1 block text-[11px] leading-snug text-muted-foreground">{source.detail}</span></button> })}</div>

              {mode === 'pdf' || mode === 'photo' ? <>
                <input ref={fileRef} type="file" accept={mode === 'pdf' ? '.pdf,.ppt,.pptx' : 'image/*'} className="sr-only" onChange={handleFile} />
                <button type="button" onClick={() => fileRef.current?.click()} className="mt-5 flex min-h-[178px] w-full flex-col items-center justify-center rounded-[18px] border border-dashed border-primary/40 bg-primary/[0.035] p-6 text-center transition-colors hover:border-primary hover:bg-primary/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><span className="flex size-12 items-center justify-center rounded-[15px] bg-primary/10 text-primary"><UploadCloud className="size-6" /></span><span className="mt-4 text-sm font-extrabold text-foreground">Drop your {mode === 'pdf' ? 'PDF or slides' : 'notes photo'} here</span><span className="mt-1 max-w-[35ch] text-xs leading-relaxed text-muted-foreground">or choose a file from your device. Your source stays attached to this draft.</span><span className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-[12px] bg-primary px-4 text-xs font-extrabold text-primary-foreground"><UploadCloud className="size-4" /> Choose file</span></button>
              </> : <div className="mt-5 rounded-[18px] border border-border bg-background p-4"><label htmlFor="source-text" className="text-xs font-extrabold text-foreground">{mode === 'paste' ? 'Paste your notes' : 'Describe the topic'}</label><textarea id="source-text" rows={6} placeholder={mode === 'paste' ? 'Paste a clean excerpt from your lecture notes…' : 'Example: neural pathways for a first-year biology review…'} className="mt-3 w-full resize-y rounded-[13px] border border-input bg-card p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" /><p className="mt-2 text-xs text-muted-foreground">Keep the material specific enough for useful retrieval prompts.</p></div>}

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[13px] bg-secondary/60 px-3.5 py-3 text-xs"><span className="min-w-0 truncate text-muted-foreground">Source: <strong className="font-bold text-foreground">{sourceName}</strong></span>{sourceName !== 'No source selected yet' && <Check className="size-4 shrink-0 text-success" />}</div>
            </>}

            {step === 2 && <div className="mt-6 grid gap-4 sm:grid-cols-2"><label htmlFor="deck-title" className="text-xs font-extrabold text-foreground">Deck title<input id="deck-title" value={deckTitle} onChange={(event) => setDeckTitle(event.target.value)} className="mt-2 h-12 w-full rounded-[13px] border border-input bg-background px-3 text-sm font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label><label htmlFor="subject" className="text-xs font-extrabold text-foreground">Subject<select id="subject" value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 h-12 w-full rounded-[13px] border border-input bg-background px-3 text-sm font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"><option>Biology</option><option>History</option><option>Mathematics</option><option>Chemistry</option><option>English</option></select></label></div>}

            {step === 3 && <div className="mt-6 flex items-center justify-between gap-3 rounded-[16px] border border-primary/20 bg-primary/[0.045] p-4"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 items-center justify-center rounded-[13px] bg-primary/10 text-primary"><Wand2 className="size-5" /></span><div className="min-w-0"><p className="text-sm font-extrabold text-foreground">Draft ready to edit</p><p className="mt-1 truncate text-xs text-muted-foreground">{sourceName} · {subject}</p></div></div><button type="button" onClick={invertCards} className="flex min-h-10 shrink-0 items-center gap-2 rounded-[11px] border border-border bg-card px-3 text-xs font-extrabold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><RefreshCcw className="size-3.5" /> Swap Q&A</button></div>}

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/70 pt-5">{step > 1 ? <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1) as CreatorStep)} className="inline-flex min-h-11 items-center gap-2 rounded-[12px] px-3 text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft className="size-4" /> Back</button> : <span />}{step === 1 ? <button type="button" onClick={() => setStep(2)} className="inline-flex min-h-11 items-center gap-2 rounded-[12px] bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-[0_8px_18px_rgba(47,102,246,.2)] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Continue <ArrowRight className="size-4" /></button> : step === 2 ? <button type="button" onClick={handleGenerate} disabled={isGenerating} className="inline-flex min-h-11 items-center gap-2 rounded-[12px] bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-[0_8px_18px_rgba(47,102,246,.2)] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{isGenerating ? <><LoaderCircle className="size-4 animate-spin" /> Building cards</> : <><Wand2 className="size-4" /> Draft recall cards</>}</button> : <button type="button" onClick={saveDeck} disabled={savedSuccess || cards.length === 0} className="inline-flex min-h-11 items-center gap-2 rounded-[12px] bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-[0_8px_18px_rgba(47,102,246,.2)] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{savedSuccess ? <><Check className="size-4" /> Saved</> : <>Save and study <ArrowRight className="size-4" /></>}</button>}</div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[22px] border border-border bg-secondary/55 p-5 sm:p-6"><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">A useful draft</p><h2 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-foreground">Questions should make you retrieve, not reread.</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Fetch keeps the source nearby, then gives you a clean place to improve each prompt before studying.</p><div className="mt-5 flex items-center gap-3 border-t border-primary/15 pt-4"><ImageIcon className="size-5 text-primary" /><span className="text-xs font-bold text-muted-foreground">{sourceName === 'No source selected yet' ? 'Choose a source to begin' : 'Source attached to this draft'}</span></div></div>
          <div className="fetch-surface rounded-[22px] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">Review queue</p><h2 className="mt-1 text-xl font-extrabold text-foreground">{cards.length} cards</h2></div><span className="rounded-[10px] bg-accent px-2.5 py-1.5 text-xs font-extrabold text-accent-foreground">{subject}</span></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Each card can be edited before it becomes part of your due queue.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-success transition-[width] duration-300" style={{ width: `${Math.min(100, cards.length * 18)}%` }} /></div></div>
        </aside>
      </div>

      {step === 3 && <section className="mt-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary">Draft review</p><h2 className="mt-1 text-2xl font-extrabold tracking-[-0.035em] text-foreground">Make the questions sound like you.</h2><p className="mt-1 max-w-[54ch] text-sm text-muted-foreground">Read the prompt first, then check whether the answer is specific enough to explain the idea.</p></div><button type="button" onClick={() => setStep(2)} className="inline-flex min-h-10 items-center gap-2 self-start rounded-[12px] border border-border bg-card px-3 text-xs font-extrabold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft className="size-4" /> Edit details</button></div><div className="mt-5 grid gap-3"><AnimatePresence initial={false}>{cards.map((card, index) => <motion.article key={card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="fetch-surface rounded-[18px] p-4 sm:p-5"><div className="flex items-start gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-secondary text-xs font-extrabold text-primary">{index + 1}</span><div className="min-w-0 flex-1"><p className="text-sm font-extrabold leading-relaxed text-foreground">{card.question}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.answer}</p>{card.hint && <p className="mt-3 text-xs font-semibold text-primary">Hint: {card.hint}</p>}</div><button type="button" onClick={() => deleteCard(card.id)} className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Delete card ${index + 1}`}><Trash2 className="size-4" /></button></div></motion.article>)}</AnimatePresence></div><div className="mt-5 rounded-[20px] border border-primary/25 bg-primary/[0.04] p-5 sm:p-6"><div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-[12px] bg-primary/10 text-primary"><Plus className="size-5" /></span><div><h3 className="text-base font-extrabold text-foreground">Add a custom card</h3><p className="mt-1 text-sm text-muted-foreground">Add the one question you know your teacher will ask.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label htmlFor="custom-question" className="text-xs font-extrabold text-foreground">Prompt<textarea id="custom-question" value={newQuestion} onChange={(event) => setNewQuestion(event.target.value)} rows={4} placeholder="What should you be able to recall?" className="mt-2 w-full resize-y rounded-[13px] border border-input bg-card p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label><label htmlFor="custom-answer" className="text-xs font-extrabold text-foreground">Answer<textarea id="custom-answer" value={newAnswer} onChange={(event) => setNewAnswer(event.target.value)} rows={4} placeholder="Write the explanation in your own words…" className="mt-2 w-full resize-y rounded-[13px] border border-input bg-card p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label></div><div className="mt-4 flex justify-end"><Button type="button" onClick={addCard} disabled={!newQuestion.trim() || !newAnswer.trim()} className="gap-2"><Plus className="size-4" /> Add card</Button></div></div></section>}
    </motion.main>
  )
}
