import { cn } from '@/lib/utils'

interface SectionLabelProps {
  index?: string
  children: string
  className?: string
  tone?: 'bone' | 'ignition' | 'lox'
}

const TONES = {
  bone: 'text-ash',
  ignition: 'text-ignition',
  lox: 'text-lox',
} as const

/** `[02] ── CATALOGUE` style section marker. */
export function SectionLabel({ index, children, className, tone = 'bone' }: SectionLabelProps) {
  return (
    <p className={cn('mono flex items-center gap-3', TONES[tone], className)}>
      <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden>
        <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1" />
        <circle cx="6" cy="6" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      {index ? <span className="text-bone">[{index}]</span> : null}
      <span className="h-px w-8 bg-current opacity-50" aria-hidden />
      <span>{children}</span>
    </p>
  )
}
