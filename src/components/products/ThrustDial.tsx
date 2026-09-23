import { useEffect, useMemo, useRef, useState } from 'react'

import { animate, useInView, useReducedMotion } from 'framer-motion'

import { Units } from '@/components/ui/Units'
import { PRODUCTS, type Product } from '@/data/products'
import { formatForce, formatForceRange, fromDial, roundThrust, toDial } from '@/lib/format'
import { EASE_INOUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

const TICKS = [500, 1000, 2000, 5000, 10_000, 20_000, 50_000]
const RATED = PRODUCTS.filter((product) => product.thrust)
const START = toDial(4000)

interface ThrustDialProps {
  onSelect: (product: Product) => void
  className?: string
}

function DialRow({ product, value, onSelect }: { product: Product; value: number; onSelect: () => void }) {
  const range = product.thrust!
  const isMatch = value >= range.min && value <= range.max
  const left = toDial(range.min) * 100
  const width = (toDial(range.max) - toDial(range.min)) * 100

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
       
        className="group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)] items-center gap-2 py-3 text-left sm:grid-cols-[210px_minmax(0,1fr)_110px] sm:gap-6"
      >
        <span className={cn('text-[15px] transition-colors duration-300', isMatch ? 'text-bone' : 'text-dim')}>
          {product.name}
        </span>
        <span className="relative block h-[10px]">
          <span className="absolute inset-y-[4px] left-0 right-0 bg-bone/[0.06]" />
          <span
            className={cn(
              'absolute inset-y-0 transition-[background-color,box-shadow] duration-300',
              isMatch ? 'bg-ignition shadow-[0_0_18px_rgba(242,70,26,0.55)]' : 'bg-bone/20 group-hover:bg-bone/40',
            )}
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        </span>
        <span className={cn('mono text-[10px] sm:text-right', isMatch ? 'text-ignition' : 'text-dim')}>
          <Units text={formatForceRange(range)} />
        </span>
      </button>
    </li>
  )
}

/** Log-scale thrust selector: every catalogue range drawn on one axis, matches light up. */
export function ThrustDial({ onSelect, className }: ThrustDialProps) {
  const [dial, setDial] = useState(START)
  const [hasTouched, setTouched] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rootRef, { once: true, margin: '0px 0px -25% 0px' })
  const shouldReduceMotion = useReducedMotion()
  const value = roundThrust(fromDial(dial))
  const matches = useMemo(() => RATED.filter((p) => value >= p.thrust!.min && value <= p.thrust!.max), [value])

  // A one-off sweep so the chart demonstrates itself before anyone touches it.
  useEffect(() => {
    if (!isInView || shouldReduceMotion || hasTouched) return
    const controls = animate(toDial(500), START, { duration: 2.4, ease: EASE_INOUT, onUpdate: setDial })
    return () => controls.stop()
  }, [isInView, shouldReduceMotion, hasTouched])

  return (
    <div ref={rootRef} className={cn('border border-bone/10 bg-hull p-6 sm:p-10', className)}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-dim">Required thrust</p>
          <p className="display tnum mt-2 text-[clamp(44px,6vw,88px)] text-bone">
            <Units text={formatForce(value)} />
          </p>
        </div>
        <p className="eyebrow pb-3 text-ash">
          <span className="text-ignition">{String(matches.length).padStart(2, '0')}</span> systems match
        </p>
      </div>

      <div className="relative mt-8">
        <div className="grid gap-2 sm:grid-cols-[210px_minmax(0,1fr)_110px] sm:gap-6">
          <p className="eyebrow hidden self-center text-[10px] text-dim sm:block">Log scale · drag</p>
          <DialTrack
            dial={dial}
            label={formatForce(value)}
            onChange={(next) => {
              setTouched(true)
              setDial(next)
            }}
          />
        </div>

        <div className="relative mt-10">
          <span
            className="pointer-events-none absolute -top-4 bottom-0 hidden w-px bg-ignition/50 sm:block"
            style={{ left: `calc(210px + 1.5rem + (100% - 210px - 110px - 3rem) * ${dial})` }}
            aria-hidden
          />
          <ul className="divide-y divide-bone/[0.06]">
            {RATED.map((product) => (
              <DialRow key={product.id} product={product} value={value} onSelect={() => onSelect(product)} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function DialTrack({ dial, label, onChange }: { dial: number; label: string; onChange: (next: number) => void }) {
  return (
    <div className="relative h-12">
      <div className="absolute inset-x-0 top-1/2 h-px bg-bone/20" />
      {TICKS.map((tick) => (
        <span key={tick} className="absolute top-0 h-full" style={{ left: `${toDial(tick) * 100}%` }}>
          <span className="absolute top-[14px] h-5 w-px bg-bone/30" />
          <span className="mono absolute top-[40px] -translate-x-1/2 whitespace-nowrap text-[9px] text-dim">
            <Units text={formatForce(tick)} />
          </span>
        </span>
      ))}
      <span className="pointer-events-none absolute top-0 h-full" style={{ left: `${dial * 100}%` }}>
        <span className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-ignition bg-void shadow-[0_0_24px_rgba(242,70,26,0.6)]" />
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={dial}
        aria-label="Required thrust"
        aria-valuetext={label}
       
        onChange={(event) => onChange(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}
