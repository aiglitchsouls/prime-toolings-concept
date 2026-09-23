import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

import { SIM_ENGINE } from '@/data/simulated'
import type { EngineScene } from '@/three/EngineScene'

export type Phase = 'safe' | 'ignition' | 'mainstage' | 'shutdown'

export interface BurnLog {
  seconds: number
  peakKn: number
}

const IGNITION_MS = 420
const SHUTDOWN_MS = 1500

/**
 * Hold-to-fire state machine for the hero static fire:
 * safe → ignition (torch, low throttle) → mainstage → shutdown → safe.
 */
export function useIgnition(sceneRef: RefObject<EngineScene | null>) {
  const [phase, setPhase] = useState<Phase>('safe')
  const [burn, setBurn] = useState<BurnLog | null>(null)
  const phaseRef = useRef<Phase>('safe')
  const startedAt = useRef(0)
  const timers = useRef<number[]>([])

  const go = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id))
    timers.current = []
  }

  const release = useCallback(() => {
    const scene = sceneRef.current
    if (!scene || (phaseRef.current !== 'ignition' && phaseRef.current !== 'mainstage')) return
    clearTimers()
    scene.setTargets({ throttle: 0 })
    setBurn({ seconds: (performance.now() - startedAt.current) / 1000, peakKn: scene.takePeak() * SIM_ENGINE.maxThrustKn })
    go('shutdown')
    timers.current.push(window.setTimeout(() => go('safe'), SHUTDOWN_MS))
  }, [go, sceneRef])

  const press = useCallback(() => {
    const scene = sceneRef.current
    if (!scene || phaseRef.current === 'ignition' || phaseRef.current === 'mainstage') return
    clearTimers()
    scene.takePeak()
    startedAt.current = performance.now()
    scene.setTargets({ throttle: 0.16 })
    go('ignition')
    timers.current.push(
      window.setTimeout(() => {
        scene.setTargets({ throttle: 1 })
        go('mainstage')
        if (navigator.userActivation?.isActive) navigator.vibrate?.(35)
      }, IGNITION_MS),
      window.setTimeout(release, SIM_ENGINE.maxBurnSeconds * 1000),
    )
  }, [go, release, sceneRef])

  useEffect(() => () => clearTimers(), [])

  return { phase, burn, press, release, startedAt }
}
