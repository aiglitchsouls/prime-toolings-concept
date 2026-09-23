import type { KeyboardEvent } from 'react'

import { Flame } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { Phase } from './useIgnition'

interface IgnitionButtonProps {
  phase: Phase
  isReady: boolean
  /** False while the hero's automatic test-fire loop is running the engine. */
  isManual: boolean
  onPress: () => void
  onRelease: () => void
}

const LABELS: Record<Phase, string> = {
  safe: 'Hold to test-fire',
  ignition: 'Igniting',
  mainstage: 'Firing · release to cut',
  shutdown: 'Shutdown',
}

const isFireKey = (event: KeyboardEvent) => event.key === ' ' || event.key === 'Enter'

/** Momentary control: pointer or Space/Enter held down keeps the engine lit. */
export function IgnitionButton({ phase, isReady, isManual, onPress, onRelease }: IgnitionButtonProps) {
  const isFiring = phase === 'ignition' || phase === 'mainstage'
  const label = isFiring && !isManual ? 'Static fire · live' : LABELS[phase]

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!isFireKey(event)) return
    event.preventDefault()
    if (!event.repeat) onPress()
  }
  const onKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!isFireKey(event)) return
    event.preventDefault()
    onRelease()
  }

  return (
    <button
      type="button"
      disabled={!isReady}
      aria-pressed={isFiring}
      aria-describedby="ignite-help"
      className="group pointer-events-auto inline-flex cursor-pointer touch-none select-none items-center gap-4 text-left [-webkit-touch-callout:none] disabled:cursor-wait disabled:opacity-50"
      onPointerDown={(event) => {
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // synthetic or already-released pointers can't be captured; the hold still works
        }
        onPress()
      }}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onLostPointerCapture={onRelease}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={onRelease}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span
        className={cn(
          'grid size-14 shrink-0 place-items-center rounded-full border transition-colors duration-300',
          isFiring ? 'border-ignition bg-ignition text-void' : 'border-bone/30 text-bone group-hover:border-ignition',
        )}
      >
        <Flame className={cn('size-5', isFiring && 'animate-pulse')} aria-hidden />
      </span>
      <span>
        <span className="eyebrow block text-bone">{isReady ? label : 'Loading engine'}</span>
        <span id="ignite-help" className="mt-1 block text-[13px] text-ash">
          Real-time simulation · hold Space · drag to rotate
        </span>
      </span>
    </button>
  )
}
