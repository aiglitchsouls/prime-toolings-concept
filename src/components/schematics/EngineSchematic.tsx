import type { SchematicKind } from '@/data/products'
import { cn } from '@/lib/utils'

import { InjectorFace, Pulse, Ramjet, Rde } from './SchematicsExtra'

// Cross-section line drawings for each propulsion class. Flow lines run on hover (.group) or when
// the parent carries `flow-live`.

const LINE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1 } as const
const HOT = { fill: 'none', stroke: '#ff4d1a', strokeWidth: 1.4 } as const

function Exhaust({ x, ys }: { x: number; ys: number[] }) {
  return (
    <g>
      {ys.map((y) => (
        <line key={y} x1={x} y1={y} x2={x + 26} y2={y} {...HOT} className="flow" />
      ))}
    </g>
  )
}

function Motor({ y, h }: { y: number; h: number }) {
  const mid = y + h / 2
  const q = h / 4
  return (
    <g>
      <rect x="30" y={y} width="130" height={h} rx="3" {...LINE} />
      <path
        d={`M40 ${mid} L58 ${mid - q} L76 ${mid} L94 ${mid - q} L112 ${mid} L130 ${mid - q} L148 ${mid} L130 ${mid + q} L112 ${mid} L94 ${mid + q} L76 ${mid} L58 ${mid + q} Z`}
        {...LINE}
        opacity="0.55"
      />
      <rect x="22" y={mid - 6} width="8" height="12" fill="#ff4d1a" />
      <path d={`M160 ${y + 8} L172 ${mid - 5} L200 ${y - 6} M160 ${y + h - 8} L172 ${mid + 5} L200 ${y + h + 6}`} {...LINE} />
    </g>
  )
}

function Solid() {
  return (
    <>
      <Motor y={46} h={48} />
      <Exhaust x={204} ys={[56, 70, 84]} />
    </>
  )
}

function Dual() {
  return (
    <>
      <Motor y={24} h={32} />
      <Motor y={84} h={32} />
      <Exhaust x={204} ys={[34, 46, 94, 106]} />
    </>
  )
}

function Liquid() {
  return (
    <>
      <rect x="14" y="18" width="46" height="42" rx="21" {...LINE} />
      <rect x="14" y="80" width="46" height="42" rx="21" {...LINE} />
      <text x="37" y="43" textAnchor="middle" fontSize="10" fill="currentColor" className="mono">F</text>
      <text x="37" y="105" textAnchor="middle" fontSize="10" fill="currentColor" className="mono">OX</text>
      <path d="M60 39 H88 V62 H110 M60 101 H88 V78 H110" {...HOT} className="flow" />
      <line x1="110" y1="50" x2="110" y2="90" stroke="#ff4d1a" strokeWidth="3" />
      <rect x="110" y="50" width="40" height="40" {...LINE} />
      <path d="M150 56 Q162 64 168 64 Q194 58 212 34 M150 84 Q162 76 168 76 Q194 82 212 106" {...LINE} />
      <Exhaust x={210} ys={[56, 70, 84]} />
    </>
  )
}

function Aerospike() {
  return (
    <>
      <rect x="30" y="30" width="44" height="18" {...LINE} />
      <rect x="30" y="92" width="44" height="18" {...LINE} />
      <path d="M74 48 Q150 62 214 68 L214 72 Q150 78 74 92 Z" {...LINE} fill="rgba(236,232,225,0.04)" />
      <path d="M74 42 Q150 58 232 66 M74 98 Q150 82 232 74" {...HOT} className="flow" />
      <line x1="20" y1="70" x2="236" y2="70" stroke="currentColor" strokeDasharray="2 5" opacity="0.35" />
    </>
  )
}

function Hybrid() {
  return (
    <>
      <rect x="10" y="46" width="52" height="48" rx="24" {...LINE} />
      <text x="36" y="74" textAnchor="middle" fontSize="10" fill="currentColor" className="mono">OX</text>
      <path d="M62 70 H84" {...HOT} className="flow" />
      <path d="M70 64 L78 76 M70 76 L78 64" {...LINE} />
      <rect x="84" y="42" width="92" height="56" {...LINE} />
      <rect x="84" y="62" width="92" height="16" {...LINE} opacity="0.6" />
      {[96, 112, 128, 144, 160].map((x) => (
        <path key={x} d={`M${x} 44 l8 16 M${x} 80 l8 16`} {...LINE} opacity="0.35" />
      ))}
      <path d="M176 50 L188 62 L212 42 M176 90 L188 78 L212 98" {...LINE} />
      <Exhaust x={210} ys={[58, 70, 82]} />
    </>
  )
}

const DRAWINGS: Record<SchematicKind, () => React.JSX.Element> = {
  solid: Solid,
  dual: Dual,
  liquid: Liquid,
  aerospike: Aerospike,
  hybrid: Hybrid,
  rde: Rde,
  pulse: Pulse,
  ramjet: Ramjet,
  injector: InjectorFace,
}

export function EngineSchematic({ kind, className }: { kind: SchematicKind; className?: string }) {
  const Drawing = DRAWINGS[kind]
  return (
    <svg viewBox="0 0 240 140" className={cn('h-auto w-full text-bone/55', className)} aria-hidden>
      <Drawing />
    </svg>
  )
}
