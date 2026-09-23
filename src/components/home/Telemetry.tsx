import { useEffect, useRef, type RefObject } from 'react'

import { useInView } from 'framer-motion'

import { ConceptBadge, StatusDot } from '@/components/ui/Badges'
import { SIM_ENGINE } from '@/data/simulated'
import { setText } from '@/lib/dom'
import { rumble } from '@/lib/rumble'
import { soundStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { EngineScene } from '@/three/EngineScene'

import type { BurnLog, Phase } from './useIgnition'

interface TelemetryProps {
  sceneRef: RefObject<EngineScene | null>
  startedAt: RefObject<number>
  phase: Phase
  burn: BurnLog | null
  className?: string
}

const PHASE_LABEL: Record<Phase, string> = {
  safe: 'Safe · armed',
  ignition: 'Torch ignition',
  mainstage: 'Mainstage',
  shutdown: 'Shutdown',
}

const HISTORY = 160

function drawTrace(canvas: HTMLCanvasElement, history: number[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)
  ctx.strokeStyle = 'rgba(236,232,225,0.08)'
  ctx.lineWidth = 1
  for (let i = 1; i < 4; i++) {
    const y = Math.round((height / 4) * i) + 0.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  ctx.strokeStyle = '#ff4d1a'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  history.forEach((value, i) => {
    const x = (i / (HISTORY - 1)) * width
    const y = height - 2 - (value / SIM_ENGINE.maxThrustKn) * (height - 6)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
}

/** DAQ-style readout. Updates the DOM directly each frame, so React never re-renders at 60 fps. */
export function Telemetry({ sceneRef, startedAt, phase, burn, className }: TelemetryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const thrustRef = useRef<HTMLSpanElement>(null)
  const pressureRef = useRef<HTMLSpanElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const traceRef = useRef<HTMLCanvasElement>(null)
  const isFiring = phase === 'ignition' || phase === 'mainstage'
  const isFiringRef = useRef(isFiring)
  const isInView = useInView(rootRef)

  useEffect(() => {
    isFiringRef.current = isFiring
  }, [isFiring])

  useEffect(() => {
    if (!isInView) return
    const history = new Array<number>(HISTORY).fill(0)
    let frame = 0
    const loop = () => {
      frame = requestAnimationFrame(loop)
      const throttle = sceneRef.current?.getThrottle() ?? 0
      const jitter = throttle > 0.05 ? 1 + (Math.random() - 0.5) * 0.025 : 1
      const thrust = SIM_ENGINE.maxThrustKn * Math.pow(throttle, 1.05) * jitter
      history.push(thrust)
      history.shift()
      setText(thrustRef.current, thrust.toFixed(2))
      setText(pressureRef.current, (SIM_ENGINE.chamberBar * throttle * jitter).toFixed(1))
      if (barRef.current) barRef.current.style.transform = `scaleX(${throttle.toFixed(3)})`
      if (isFiringRef.current) {
        const seconds = (performance.now() - (startedAt.current ?? 0)) / 1000
        setText(clockRef.current, `T+${seconds.toFixed(2).padStart(5, '0')}`)
      }
      if (traceRef.current) drawTrace(traceRef.current, history)
      if (soundStore.get()) rumble.level(throttle)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      rumble.silence()
    }
  }, [isInView, sceneRef, startedAt])

  return (
    <div ref={rootRef} className={cn('ticks w-[214px] bg-void/55 p-3 backdrop-blur-md sm:w-[300px] sm:p-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="mono flex items-center gap-2 text-[10px] text-bone">
          <StatusDot tone={isFiring ? 'ignition' : 'nominal'} />
          {PHASE_LABEL[phase]}
        </span>
        <ConceptBadge className="hidden sm:inline-flex">Simulated</ConceptBadge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:mt-4">
        <div>
          <dt className="mono text-[9px] text-ash">Thrust</dt>
          <dd className="display-soft tnum text-[20px] text-bone sm:text-[26px]">
            <span ref={thrustRef}>0.00</span>
            <span className="mono ml-1 text-[10px] normal-case text-ash">kN</span>
          </dd>
        </div>
        <div>
          <dt className="mono text-[9px] text-ash">Chamber</dt>
          <dd className="display-soft tnum text-[20px] text-bone sm:text-[26px]">
            <span ref={pressureRef}>0.0</span>
            <span className="mono ml-1 text-[10px] normal-case text-ash">bar</span>
          </dd>
        </div>
      </dl>

      <div className="mt-3 h-px w-full bg-bone/10">
        <span ref={barRef} className="block h-px origin-left scale-x-0 bg-ignition" />
      </div>
      <canvas ref={traceRef} width={268} height={54} className="mt-3 hidden h-[54px] w-full sm:block" aria-hidden />

      <div className="mono mt-3 hidden justify-between text-[9px] text-ash sm:flex">
        <span ref={clockRef}>{isFiring ? 'T+00.00' : 'T– hold'}</span>
        <span>O/F {SIM_ENGINE.mixtureRatio} · Isp {SIM_ENGINE.ispSeconds}s</span>
      </div>
      {burn && !isFiring ? (
        <p className="mono mt-3 hidden border-t border-bone/10 pt-3 text-[9px] text-nominal sm:block">
          Burn log · {burn.seconds.toFixed(2)}
          <span className="normal-case">s</span> · peak {burn.peakKn.toFixed(2)} <span className="normal-case">kN</span> · nominal
        </p>
      ) : null}
    </div>
  )
}
