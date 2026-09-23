import { useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { bootStore } from '@/lib/store'

const CHECKS = [
  ['GOX feed', 'Nominal'],
  ['Kerosene feed', 'Nominal'],
  ['Torch igniter', 'Armed'],
  ['DAQ link', 'Live'],
] as const

const DURATION_MS = 1900
const SESSION_KEY = 'pt-booted'

function shouldSkip() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/** Pre-flight check sequence on the first visit of a session. Click or any key skips it. */
export function Boot() {
  const [isActive, setActive] = useState(() => !shouldSkip())
  const percentRef = useRef<HTMLSpanElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) {
      bootStore.set(true)
      return
    }
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      if (percentRef.current) percentRef.current.textContent = String(Math.round(progress * 100)).padStart(3, '0')
      setStep(Math.min(CHECKS.length, Math.floor(progress * (CHECKS.length + 1))))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setActive(false)
    }
    frame = requestAnimationFrame(tick)
    const skip = () => setActive(false)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) return
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // storage blocked: boot plays again next visit
    }
  }, [isActive])

  return (
    <AnimatePresence>
      {isActive ? (
        <motion.div
          className="blueprint fixed inset-0 z-boot flex flex-col justify-between bg-void p-6 sm:p-10"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading Prime Toolings"
        >
          <div className="mono flex justify-between text-[10px] text-ash">
            <span>Prime Toolings · Aeroignite Systems</span>
            <span className="hidden sm:inline">Pre-flight checks</span>
          </div>
          <ul className="mono w-full max-w-md space-y-2 text-[11px]">
            {CHECKS.map(([name, state], i) => (
              <li key={name} className="flex items-center gap-3">
                <span className="text-ash">{name}</span>
                <span className="h-px flex-1 border-t border-dashed border-bone/15" />
                <span className={i < step ? 'text-nominal' : 'text-dim'}>{i < step ? state : '···'}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between">
            <span className="mono text-[10px] text-dim">Click to skip</span>
            <span className="display text-[18vw] leading-none text-bone sm:text-[12vw]">
              <span ref={percentRef}>000</span>
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
