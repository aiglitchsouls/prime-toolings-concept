import { useCallback, useEffect, useRef, useState } from 'react'

import { useReducedMotion } from 'framer-motion'

const FIRST_FIRE_MS = 3200
const CYCLE_MS = 10_000
const BURN_MS = 3600
const MANUAL_QUIET_MS = 8000

interface AutoFireOptions {
  isEnabled: boolean
  press: () => void
  release: () => void
}

/**
 * Loops a short test-fire, the way category leaders run test-stand footage in their hero.
 * Stands down while a visitor is firing by hand, while the hero is off-screen, or for reduced motion.
 * Returns wrapped handlers for the manual control.
 */
export function useAutoFire({ isEnabled, press, release }: AutoFireOptions) {
  const shouldReduceMotion = useReducedMotion()
  const isManualRef = useRef(false)
  const [isManual, setManual] = useState(false)
  const lastManualRef = useRef(0)
  const isVisibleRef = useRef(true)

  const setVisible = useCallback((isVisible: boolean) => {
    isVisibleRef.current = isVisible
  }, [])

  const manualPress = useCallback(() => {
    isManualRef.current = true
    setManual(true)
    press()
  }, [press])

  const manualRelease = useCallback(() => {
    if (isManualRef.current) lastManualRef.current = performance.now()
    isManualRef.current = false
    setManual(false)
    release()
  }, [release])

  useEffect(() => {
    if (!isEnabled || shouldReduceMotion) return
    const timers: number[] = []
    const canFire = () =>
      !isManualRef.current &&
      isVisibleRef.current &&
      !document.hidden &&
      performance.now() - lastManualRef.current > MANUAL_QUIET_MS

    const cycle = () => {
      if (canFire()) {
        press()
        timers.push(window.setTimeout(() => !isManualRef.current && release(), BURN_MS))
      }
      timers.push(window.setTimeout(cycle, CYCLE_MS))
    }
    timers.push(window.setTimeout(cycle, FIRST_FIRE_MS))
    return () => timers.forEach((id) => clearTimeout(id))
  }, [isEnabled, shouldReduceMotion, press, release])

  return { isManual, manualPress, manualRelease, setVisible }
}
