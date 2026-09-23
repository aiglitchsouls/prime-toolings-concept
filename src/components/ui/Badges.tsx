import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Marks anything invented for the concept (simulated telemetry, sample flows). */
export function ConceptBadge({ children = 'Concept', className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'mono inline-flex items-center gap-2 border border-lox/30 bg-lox/[0.06] px-2 py-1 text-[10px] text-lox',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-lox" aria-hidden />
      {children}
    </span>
  )
}

export function StatusDot({ tone = 'nominal' }: { tone?: 'nominal' | 'ignition' | 'lox' }) {
  const color = { nominal: 'bg-nominal', ignition: 'bg-ignition', lox: 'bg-lox' }[tone]
  return <span className={cn('pulse-dot inline-block size-1.5 rounded-full', color)} aria-hidden />
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('mono inline-flex items-center border border-bone/15 px-3 py-1.5 text-[10px] text-ash', className)}>
      {children}
    </span>
  )
}
