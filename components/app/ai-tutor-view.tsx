'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { BookmarkPlus, Brain, Check, CheckCircle2, FileQuestion, Send, User } from 'lucide-react'
import { ContextualFocusPill } from '@/components/focus/focus-tools-widget'
import { getSubjectTokens } from '@/lib/subject-colors'
import { sounds } from '@/lib/sound-effects'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  subject?: string
  quizQuestion?: { q: string; options: string[]; correct: number }
  suggestedFollowups?: string[]
}

const starterModes = [
  { label: 'Explain it', prompt: 'Explain the Krebs cycle with a simple analogy', detail: 'Build a clear mental model' },
  { label: 'Quiz me', prompt: 'Quiz me on the Krebs cycle', detail: 'Practice retrieval immediately' },
  { label: 'Work it out', prompt: 'How do I decide between integration by parts vs substitution?', detail: 'Walk through a problem' },
]

export function AiTutorView() {
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', sender: 'ai', text: 'Bring me a concept you are working on. I’ll explain it clearly, then give you a short recall check so it sticks.' }])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('Explain it')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, number>>({})
  const [savedCards, setSavedCards] = useState<Record<string, boolean>>({})
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const send = (requested?: string) => {
    const text = (requested ?? input).trim()
    if (!text || isTyping) return
    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: 'user', text }])
    setInput('')
    setIsTyping(true)
    window.setTimeout(() => {
      const lower = text.toLowerCase()
      const biology = lower.includes('krebs') || lower.includes('cycle') || lower.includes('respiration')
      const history = lower.includes('katipunan') || lower.includes('history')
      const math = lower.includes('integral') || lower.includes('math') || lower.includes('calculus')
      const reply: Message = biology ? {
        id: `ai-${Date.now()}`, sender: 'ai', subject: 'Biology', text: 'Think of the Krebs cycle as a recycling plant: Acetyl-CoA enters, high-energy electrons are loaded onto NADH and FADH₂, carbon dioxide leaves as waste, and oxaloacetate is regenerated so the cycle can run again.', quizQuestion: { q: 'Which 4-carbon molecule combines with Acetyl-CoA to begin the cycle?', options: ['Oxaloacetate', 'Pyruvate', 'Citrate', 'Succinate'], correct: 0 }, suggestedFollowups: ['Test me on the outputs', 'Where does this happen?', 'Turn this into three cards'],
      } : history ? {
        id: `ai-${Date.now()}`, sender: 'ai', subject: 'History', text: 'The Kartilya served as a moral guide for Katipunan members. It emphasized equality, responsibility, and defending people who were being oppressed.', quizQuestion: { q: 'Who authored the Kartilya?', options: ['Emilio Jacinto', 'Andres Bonifacio', 'Apolinario Mabini', 'Antonio Luna'], correct: 0 }, suggestedFollowups: ['Give me the key principles', 'Quiz me on the movement', 'Make a comparison table'],
      } : math ? {
        id: `ai-${Date.now()}`, sender: 'ai', subject: 'Mathematics', text: 'Use substitution when a function and its derivative appear together. Use integration by parts when two different function families are multiplied and one becomes simpler after differentiating.', quizQuestion: { q: 'Which mnemonic helps prioritize the choice of u in integration by parts?', options: ['LIATE', 'PEMDAS', 'FOIL', 'SOHCAHTOA'], correct: 0 }, suggestedFollowups: ['Work through ∫ x · eˣ dx', 'Show a substitution example', 'Give me a harder problem'],
      } : {
        id: `ai-${Date.now()}`, sender: 'ai', subject: 'Fetch note', text: `Let’s make “${text}” easier to retrieve. First name the core idea, then connect it to an example, and finally answer a short question without looking at your notes.`, quizQuestion: { q: 'What makes a review prompt useful?', options: ['It asks you to retrieve an idea', 'It copies the whole page', 'It hides the question', 'It only tests recognition'], correct: 0 }, suggestedFollowups: ['Make it simpler', 'Give me a real example', 'Test me again'],
      }
      setMessages((current) => [...current, reply])
      setIsTyping(false)
    }, 750)
  }

  const isEmpty = messages.length === 1

  return (
    <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[1320px] flex-col px-4 pb-[calc(6.25rem+env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pt-7 lg:px-10 lg:pb-8">
      <header className="flex shrink-0 flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Fetch tutor</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-4xl">Explain, practice, recall.</h1><p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">Ask for a clear explanation, a quiz, or help with the next step in a problem.</p></div><ContextualFocusPill /></header>

      <div className="mt-5 grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="flex min-h-[520px] min-w-0 flex-col rounded-[22px] border border-border bg-background/55 p-3 sm:p-5"><div className="flex items-center gap-2 border-b border-border/70 px-1 pb-3"><span className="flex size-9 items-center justify-center rounded-[12px] bg-primary/10 text-primary"><Brain className="size-4" /></span><div><p className="text-sm font-extrabold text-foreground">Study conversation</p><p className="text-xs text-muted-foreground">Connected to your active-recall workflow</p></div></div><div className="min-h-0 flex-1 overflow-y-auto px-1 py-5">{isEmpty ? <div className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="flex size-20 items-center justify-center rounded-[22px] bg-secondary"><Image src="/mascot/main-mascot.png" alt="Fetch mascot ready to help" width={76} height={76} className="size-16 object-contain" /></div><h2 className="mt-5 text-xl font-extrabold tracking-[-0.035em] text-foreground">Start with the idea in front of you.</h2><p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">Choose a mode, ask a question, and Fetch will move you toward retrieval instead of giving you another wall of notes.</p><div className="mt-6 grid w-full max-w-[620px] gap-2 sm:grid-cols-3">{starterModes.map((starter) => <button type="button" key={starter.label} onClick={() => { setMode(starter.label); send(starter.prompt) }} className={cn('rounded-[15px] border p-3 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', mode === starter.label ? 'border-primary bg-primary/8' : 'border-border bg-card hover:border-primary/35')}><span className="text-sm font-extrabold text-foreground">{starter.label}</span><span className="mt-1 block text-xs leading-snug text-muted-foreground">{starter.detail}</span></button>)}</div></div> : <div className="space-y-5">{messages.map((message, index) => <TutorMessage key={message.id} message={message} latest={index === messages.length - 1} selectedAnswer={selectedAnswer[message.id]} saved={savedCards[message.id]} onAnswer={(answer) => { setSelectedAnswer((current) => ({ ...current, [message.id]: answer })); sounds.playRating(answer === message.quizQuestion?.correct ? 'easy' : 'again') }} onSave={() => { sounds.playQuestComplete(); setSavedCards((current) => ({ ...current, [message.id]: true })) }} onFollowup={send} />)}</div>}{isTyping && <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="flex size-8 items-center justify-center rounded-[10px] bg-secondary text-primary"><Brain className="size-4" /></span><span className="rounded-[12px] border border-border bg-card px-3 py-2">Preparing a recall check…</span></div>}<div ref={endRef} /></div><form onSubmit={(event) => { event.preventDefault(); send() }} className="flex shrink-0 items-center gap-2 border-t border-border/70 pt-3"><label htmlFor="tutor-question" className="sr-only">Ask Fetch Tutor</label><input id="tutor-question" value={input} onChange={(event) => setInput(event.target.value)} disabled={isTyping} placeholder="Ask a question or request a recall test…" className="h-12 min-w-0 flex-1 rounded-[13px] border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary" /><button type="submit" disabled={!input.trim() || isTyping} className="flex size-12 shrink-0 items-center justify-center rounded-[13px] bg-primary text-primary-foreground transition-[transform,opacity] hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Send question"><Send className="size-4" /></button></form></section>

        <aside className="hidden h-fit rounded-[22px] border border-border bg-card p-5 lg:block"><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">Tutor mode</p><h2 className="mt-2 text-xl font-extrabold tracking-[-0.035em] text-foreground">How should Fetch help?</h2><div className="mt-5 space-y-2">{starterModes.map((starter) => <button type="button" key={starter.label} onClick={() => setMode(starter.label)} className={cn('flex w-full items-start gap-3 rounded-[14px] border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', mode === starter.label ? 'border-primary bg-primary/8' : 'border-border hover:border-primary/35')}><span className="mt-0.5 flex size-7 items-center justify-center rounded-[9px] bg-secondary text-primary"><FileQuestion className="size-4" /></span><span><span className="block text-sm font-extrabold text-foreground">{starter.label}</span><span className="mt-1 block text-xs leading-snug text-muted-foreground">{starter.detail}</span></span></button>)}</div><div className="mt-6 border-t border-border/70 pt-5"><p className="text-xs font-extrabold text-foreground">Good tutor prompts</p><ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground"><li>“Explain this as if I’m seeing it for the first time.”</li><li>“Give me one question, then wait.”</li><li>“Show me where my reasoning changed.”</li></ul></div></aside>
      </div>
    </motion.main>
  )
}

function TutorMessage({ message, latest, selectedAnswer, saved, onAnswer, onSave, onFollowup }: { message: Message; latest: boolean; selectedAnswer?: number; saved?: boolean; onAnswer: (answer: number) => void; onSave: () => void; onFollowup: (value: string) => void }) {
  const user = message.sender === 'user'
  const tokens = message.subject ? getSubjectTokens(message.subject) : null
  return <div className={cn('flex gap-3', user && 'flex-row-reverse')}><span className={cn('flex size-8 shrink-0 items-center justify-center rounded-[10px] overflow-hidden', user ? 'bg-secondary text-primary' : 'bg-primary/10')} aria-hidden="true">{user ? <User className="size-4" /> : <Image src="/mascot/fetch-logo.png" alt="" width={32} height={32} className="size-8 object-cover" />}</span><div className={cn('min-w-0 max-w-[88%] space-y-3', user && 'items-end')}><div className={cn('rounded-[16px] p-4 text-sm leading-relaxed', user ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-foreground')}>{tokens && <span className={cn('mb-2 inline-flex rounded-[7px] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em]', tokens.badge)}>{message.subject}</span>}<p>{message.text}</p>{!user && <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-3"><span className="text-[11px] font-semibold text-muted-foreground">Useful concept</span><button type="button" onClick={onSave} className={cn('inline-flex min-h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-xs font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', saved ? 'bg-success/12 text-success' : 'bg-secondary text-primary')}>{saved ? <><Check className="size-3.5" /> Saved</> : <><BookmarkPlus className="size-3.5" /> Save card</>}</button></div>}</div>{message.quizQuestion && <div className="rounded-[16px] border border-primary/20 bg-primary/[0.045] p-4"><p className="text-sm font-extrabold leading-relaxed text-foreground">{message.quizQuestion.q}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{message.quizQuestion.options.map((option, index) => { const answered = selectedAnswer !== undefined; const correct = index === message.quizQuestion?.correct; return <button key={option} type="button" onClick={() => !answered && onAnswer(index)} className={cn('flex min-h-11 items-center justify-between rounded-[11px] border px-3 text-left text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', !answered ? 'border-border bg-card text-foreground hover:border-primary/45' : correct ? 'border-success bg-success/10 text-success' : selectedAnswer === index ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border bg-card text-muted-foreground opacity-60')}>{option}{answered && correct && <CheckCircle2 className="size-4" />}</button> })}</div></div>}{!user && latest && message.suggestedFollowups && <div className="flex flex-wrap gap-2">{message.suggestedFollowups.map((followup) => <button type="button" key={followup} onClick={() => onFollowup(followup)} className="min-h-9 rounded-[10px] border border-border bg-card px-2.5 text-xs font-bold text-muted-foreground hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{followup}</button>)}</div>}</div></div>
}
