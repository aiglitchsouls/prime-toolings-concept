import { rumble } from '@/lib/rumble'
import { soundStore, useSound } from '@/lib/store'
import { cn } from '@/lib/utils'

/** Engine audio is opt-in; the choice persists in localStorage. */
export function SoundToggle({ className }: { className?: string }) {
  const isOn = useSound()

  const toggle = () => {
    if (isOn) rumble.silence()
    soundStore.set(!isOn)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isOn}
      data-cursor={isOn ? 'Mute' : 'Sound'}
      className={cn(
        'mono inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 px-2 text-[10px] text-ash transition-colors hover:text-bone',
        className,
      )}
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0.5, 1, 0.7, 0.9].map((height, i) => (
          <span
            key={i}
            className={cn('w-[2px] origin-bottom bg-current', isOn ? 'animate-[eq_0.9s_ease-in-out_infinite]' : '')}
            style={{ height: `${isOn ? height * 100 : 25}%`, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
      <span>Sound {isOn ? 'on' : 'off'}</span>
    </button>
  )
}
