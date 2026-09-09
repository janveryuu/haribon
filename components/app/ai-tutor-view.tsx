'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Brain,
  Send,
  Sparkles,
  Bot,
  User,
  Plus,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  quizQuestion?: {
    q: string
    options: string[]
    correct: number
  }
}

export function AiTutorView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Kumusta Alex! I’m your Haribon AI Study Tutor. Ask me any challenging concept from your lectures, and I’ll break it down intuitively before testing your recall.',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const quickStarters = [
    'Explain the Krebs cycle with a simple analogy',
    'Why is the Katipunan Kartilya historically significant?',
    'How do I decide between integration by parts vs substitution?',
  ]

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let aiReply: Message

      if (text.toLowerCase().includes('krebs') || text.toLowerCase().includes('cycle')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Think of the Krebs Cycle (Citric Acid Cycle) as a biological recycling plant and energy factory: Acetyl-CoA enters like raw materials, gets stripped of high-energy electrons (loading NADH and FADH₂ battery trucks), produces 2 CO₂ waste, and regenerates Oxaloacetate so the cycle can run again.',
          quizQuestion: {
            q: 'Active Recall Check: What 4-carbon molecule must combine with Acetyl-CoA to begin the cycle again?',
            options: ['Oxaloacetate', 'Pyruvate', 'Citrate', 'Succinate'],
            correct: 0,
          },
        }
      } else if (text.toLowerCase().includes('katipunan') || text.toLowerCase().includes('history')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'The Kartilya was written by Emilio Jacinto not just as rules, but as an enlightened moral compass for members of the Katipunan. It emphasized equality ("All people are equal, for their origins are equal"), defending the oppressed, and keeping one’s word sacred.',
          quizQuestion: {
            q: 'Who was the young revolutionary known as the "Brain of the Katipunan" who authored the Kartilya?',
            options: ['Emilio Jacinto', 'Andres Bonifacio', 'Apolinario Mabini', 'Antonio Luna'],
            correct: 0,
          },
        }
      } else {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Great question on ${text}! The key is to deconstruct the core definition first, relate it to an everyday visual model, and then immediately test yourself with active retrieval.`,
          quizQuestion: {
            q: 'Active Recall: Can you summarize the core rule in one sentence?',
            options: ['Input transforms state with energy conservation', 'Linear relation holds under boundary constraints', 'Memory retention increases with spaced repetition'],
            correct: 2,
          },
        }
      }

      setMessages((prev) => [...prev, aiReply])
      setIsTyping(false)
      setSelectedAnswer(null)
    }, 1000)
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="mx-auto flex h-[calc(100vh-64px)] max-w-4xl flex-col px-4 pb-28 pt-4 sm:pb-8 md:px-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Brain className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">
              Haribon AI Tutor
            </h1>
            <p className="text-xs text-muted-foreground">
              Socratic learning & active recall generator · 18 uses left
            </p>
          </div>
        </div>

        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary flex items-center gap-1">
          <Sparkles className="size-3 text-ember" /> Active
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex gap-3 max-w-[85%]',
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            )}
          >
            <div
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold',
                m.sender === 'ai'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-primary'
              )}
            >
              {m.sender === 'ai' ? <Bot className="size-4" /> : <User className="size-4" />}
            </div>

            <div className="space-y-3">
              <div
                className={cn(
                  'rounded-2xl p-4 text-sm leading-relaxed',
                  m.sender === 'ai'
                    ? 'border border-border bg-card text-foreground shadow-xs'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                {m.text}
              </div>

              {/* Socratic Quiz Question if present */}
              {m.quizQuestion && (
                <div className="rounded-2xl border border-primary/30 bg-secondary/50 p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
                    <Zap className="size-3.5 text-ember fill-ember" />
                    <span>{m.quizQuestion.q}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {m.quizQuestion.options.map((opt, idx) => {
                      const isSelected = selectedAnswer === idx
                      const isCorrect = idx === m.quizQuestion?.correct
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedAnswer(idx)}
                          className={cn(
                            'rounded-xl border p-2.5 text-left text-xs font-semibold transition-all',
                            selectedAnswer === null
                              ? 'border-border bg-card hover:border-primary/40 hover:bg-card/80 text-foreground'
                              : isCorrect
                              ? 'border-success bg-success/15 text-success font-bold'
                              : isSelected
                              ? 'border-destructive bg-destructive/10 text-destructive'
                              : 'opacity-50 border-border bg-card'
                          )}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="size-1.5 rounded-full bg-primary animate-pulse delay-150" />
              <span className="size-1.5 rounded-full bg-primary animate-pulse delay-300" />
              <span className="ml-2">Formulating active recall check...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Starters */}
      {messages.length <= 2 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {quickStarters.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors text-left"
            >
              💡 {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm"
      >
        <input
          type="text"
          placeholder="Ask a question or request a recall test..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <Button size="icon" type="submit" disabled={!input.trim()}>
          <Send className="size-4" />
        </Button>
      </form>
    </motion.main>
  )
}
