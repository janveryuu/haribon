import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EagleMarkProps {
  compact?: boolean
  className?: string
  markClassName?: string
  textClassName?: string
  statusDot?: boolean
  asLink?: boolean
  href?: string
}

export function EagleMark({
  compact = false,
  className,
  markClassName,
  textClassName,
  statusDot = false,
  asLink = false,
  href = '/',
}: EagleMarkProps) {
  const content = (
    <div
      className={cn('flex items-center gap-2.5 select-none', className)}
      aria-label="Haribon"
    >
      <span
        className={cn(
          'relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(37,71,224,.22)] transition-transform duration-200 hover:scale-105',
          markClassName
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          className="size-5.5 fill-current"
        >
          <path d="M2 8.7c4.2.5 7.3 2.2 9.4 5.1L16 7l4.6 6.8C22.7 10.9 25.8 9.2 30 8.7c-1.3 5.2-4.5 8.7-9.5 10.4L16 27l-4.5-7.9C6.5 17.4 3.3 13.9 2 8.7Zm10.2 7.5 3.8 6.6 3.8-6.6-3.8-5.5-3.8 5.5Z" />
        </svg>
        {statusDot && (
          <span
            className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-ember ring-2 ring-primary/20"
            aria-hidden="true"
          />
        )}
      </span>
      {!compact && (
        <span
          className={cn(
            'font-display text-xl font-extrabold tracking-tight text-foreground',
            textClassName
          )}
        >
          Haribon
        </span>
      )}
    </div>
  )

  if (asLink) {
    return (
      <Link
        href={href}
        className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    )
  }

  return content
}
