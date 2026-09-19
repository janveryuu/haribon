import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface FetchMarkProps {
  compact?: boolean
  className?: string
  markClassName?: string
  textClassName?: string
  statusDot?: boolean
  asLink?: boolean
  href?: string
  size?: number
}

export function FetchMark({
  compact = false,
  className,
  markClassName,
  textClassName,
  statusDot = false,
  asLink = false,
  href = '/',
  size = 36,
}: FetchMarkProps) {
  const content = (
    <div
      className={cn('flex items-center gap-2.5 select-none', className)}
      aria-label="Fetch"
    >
      <span
        className={cn(
          'relative flex size-9 shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105',
          markClassName
        )}
      >
        <Image
          src="/brand/fetch-main-logo.png"
          alt="Fetch Logo"
          width={size}
          height={size}
          className="size-full object-contain rounded-xl shadow-[0_3px_10px_rgba(43,99,255,0.22)] ring-1 ring-black/5 dark:ring-white/10"
          priority
        />
        {statusDot && (
          <span
            className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-ember ring-2 ring-primary/20 z-10"
            aria-hidden="true"
          />
        )}
      </span>
      {!compact && (
        <span
          className={cn(
            'font-display text-2xl font-extrabold tracking-tight text-foreground',
            textClassName
          )}
        >
          Fetch
        </span>
      )}
    </div>
  )

  if (asLink) {
    return (
      <Link
        href={href}
        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 transition-all duration-150 ease-out active:scale-95 active:duration-75 hover:opacity-90 inline-block"
      >
        {content}
      </Link>
    )
  }

  return content
}

