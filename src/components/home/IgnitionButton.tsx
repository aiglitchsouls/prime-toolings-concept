import type { KeyboardEvent } from 'react'

import { Flame } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { Phase } from './useIgnition'

interface IgnitionButtonProps {
  phase: Phase
  isReady: boolean
  onPress: () => void
  onRelease: () => void
}

const LABELS: Record<Phase, string> = {
  safe: 'Hold to ignite',
  ignition: 'Igniting…',
  mainstage: 'Firing · release to cut',
  shutdown: 'Shutdown',
}

const isFireKey = (event: KeyboardEvent) => event.key === ' ' || event.key === 'Enter'

/** Momentary control: pointer or Space/Enter held down keeps the engine lit. */
export function IgnitionButton({ phase, isReady, onPress, onRelease }: IgnitionButtonProps) {
  const isFiring = phase === 'ignition' || phase === 'mainstage'

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
      data-cursor={isFiring ? 'Release' : 'Hold'}
      className={cn(
        'btn-ignite pointer-events-auto min-h-[60px] min-w-[236px] touch-none px-7 text-[15px] [-webkit-touch-callout:none] disabled:cursor-wait disabled:opacity-60',
        isFiring && 'bg-bone text-void hover:bg-bone',
      )}
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
          'absolute inset-y-0 left-0 bg-ignition/25 transition-[width] ease-linear',
          isFiring ? 'w-full duration-[12000ms]' : 'w-0 duration-300',
        )}
        aria-hidden
      />
      <Flame className={cn('relative size-4', isFiring && 'animate-pulse')} aria-hidden />
      <span className="relative">{isReady ? LABELS[phase] : 'Loading engine…'}</span>
    </button>
  )
}
