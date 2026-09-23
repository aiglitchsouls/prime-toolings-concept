import type { DomainId } from '@/data/techTransfer'
import { cn } from '@/lib/utils'

// Small animated line glyphs for the four tech-transfer domains.

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1 } as const

function Aero() {
  return (
    <>
      <ellipse cx="40" cy="40" rx="30" ry="11" {...STROKE} opacity="0.5" transform="rotate(-24 40 40)" />
      <circle cx="40" cy="40" r="6" {...STROKE} />
      <g className="origin-center animate-[spin_6s_linear_infinite]" style={{ transformOrigin: '40px 40px' }}>
        <circle cx="68" cy="40" r="2.5" fill="#ff4d1a" transform="rotate(-24 40 40)" />
      </g>
    </>
  )
}

function Radar() {
  return (
    <>
      {[10, 20, 30].map((r) => (
        <circle key={r} cx="40" cy="40" r={r} {...STROKE} opacity="0.4" />
      ))}
      <g className="animate-[spin_3.2s_linear_infinite]" style={{ transformOrigin: '40px 40px' }}>
        <path d="M40 40 L40 10 A30 30 0 0 1 61 19 Z" fill="rgba(255,77,26,0.35)" />
        <line x1="40" y1="40" x2="40" y2="10" stroke="#ff4d1a" />
      </g>
    </>
  )
}

function Pulse() {
  return (
    <>
      <line x1="6" y1="40" x2="74" y2="40" {...STROKE} opacity="0.3" />
      <path d="M6 40h14l5-14 7 30 6-22 5 6h31" {...STROKE} stroke="#ff4d1a" className="flow" style={{ animationPlayState: 'running' }} />
    </>
  )
}

function Sonar() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="40"
          cy="40"
          r="30"
          {...STROKE}
          className="animate-[ripple_2.7s_ease-out_infinite]"
          style={{ transformOrigin: '40px 40px', animationDelay: `${i * 0.9}s` }}
        />
      ))}
      <circle cx="40" cy="40" r="3" fill="#ff4d1a" />
    </>
  )
}

const GLYPHS: Record<DomainId, () => React.JSX.Element> = { aerospace: Aero, ew: Radar, energy: Pulse, marine: Sonar }

export function DomainGlyph({ domain, className }: { domain: DomainId; className?: string }) {
  const Glyph = GLYPHS[domain]
  return (
    <svg viewBox="0 0 80 80" className={cn('size-16 text-bone/70', className)} aria-hidden>
      <Glyph />
    </svg>
  )
}
