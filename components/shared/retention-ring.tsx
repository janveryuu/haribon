'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface RetentionRingProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  color?: string
  className?: string
  animate?: boolean
}

export function RetentionRing({
  value,
  size = 92,
  strokeWidth = 7,
  label = 'retention',
  color = 'text-primary',
  className,
  animate = true,
}: RetentionRingProps) {
  const r = 40
  const c = 2 * Math.PI * r
  const clampedValue = Math.min(100, Math.max(0, value))
  const offset = c * (1 - clampedValue / 100)

  return (
    <div
      className={cn('relative shrink-0 flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${clampedValue}% ${label}`}
    >
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 96 96"
        aria-hidden="true"
      >
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/70 dark:text-muted/50"
        />
        {animate ? (
          <motion.circle
            cx="48"
            cy="48"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn('transition-colors', color)}
            initial={{ strokeDasharray: c, strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <circle
            cx="48"
            cy="48"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className={cn('transition-colors', color)}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={cn(
            'font-display font-extrabold tracking-tight text-foreground',
            size <= 72 ? 'text-sm' : size <= 96 ? 'text-lg' : 'text-3xl'
          )}
        >
          {clampedValue}%
        </span>
        {label && size > 72 && (
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
