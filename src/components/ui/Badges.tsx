import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Marks anything invented for the concept (simulated telemetry, illustrative profiles). */
export function ConceptBadge({ children = 'Concept', className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'eyebrow inline-flex items-center gap-2 border border-bone/15 px-2.5 py-1 text-[10px] text-ash',
        className,
      )}
    >
      <span className="size-1 rounded-full bg-ash" aria-hidden />
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
    <span className={cn('inline-flex items-center border border-bone/15 px-3 py-1.5 text-[13px] text-ash', className)}>
      {children}
    </span>
  )
}
