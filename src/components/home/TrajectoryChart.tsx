import { useRef, type RefObject } from 'react'

import { motion, useMotionValueEvent, type MotionValue } from 'framer-motion'

import { setText } from '@/lib/dom'

// Illustrative lofted profile scaled to the liquid rocket's published figures.
const RANGE_KM = 400
const APOGEE_KM = 380
const X0 = 70
const X1 = 950
const GROUND = 540
const APEX = 70
const ARC = `M ${X0} ${GROUND} Q ${(X0 + X1) / 2} ${2 * APEX - GROUND} ${X1} ${GROUND}`

const ALT_TICKS = [0, 100, 200, 300, 380]
const RANGE_TICKS = [0, 100, 200, 300, 400]
const altY = (km: number) => GROUND - (km / APOGEE_KM) * (GROUND - APEX)
const rangeX = (km: number) => X0 + (km / RANGE_KM) * (X1 - X0)

function machAt(t: number) {
  const boost = Math.min(1, t / 0.12)
  const coast = 1 - 0.28 * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.12) / 0.76)))
  return 2.23 * boost * coast
}

interface TrajectoryChartProps {
  flight: MotionValue<number>
  readouts: {
    range: RefObject<HTMLSpanElement | null>
    altitude: RefObject<HTMLSpanElement | null>
    mach: RefObject<HTMLSpanElement | null>
  }
}

export function TrajectoryChart({ flight, readouts }: TrajectoryChartProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const markerRef = useRef<SVGGElement>(null)

  useMotionValueEvent(flight, 'change', (t) => {
    const path = pathRef.current
    if (!path) return
    const point = path.getPointAtLength(t * path.getTotalLength())
    markerRef.current?.setAttribute('transform', `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`)
    setText(readouts.range.current, (t * RANGE_KM).toFixed(0).padStart(3, '0'))
    setText(readouts.altitude.current, (APOGEE_KM * 4 * t * (1 - t)).toFixed(0).padStart(3, '0'))
    setText(readouts.mach.current, machAt(t).toFixed(2))
  })

  return (
    <svg viewBox="0 0 1000 600" className="h-auto w-full overflow-visible" role="img" aria-label="Illustrative flight profile: 400 kilometer range, 380 kilometer apogee">
      <g className="mono normal-case" fontSize="11" fill="#62666d">
        {ALT_TICKS.map((km) => (
          <g key={`a${km}`}>
            <line x1={X0} x2={X1} y1={altY(km)} y2={altY(km)} stroke="rgba(236,232,225,0.07)" strokeDasharray="3 7" />
            <text x={X0 - 14} y={altY(km) + 4} textAnchor="end">
              {km}
            </text>
          </g>
        ))}
        {RANGE_TICKS.map((km) => (
          <g key={`r${km}`}>
            <line x1={rangeX(km)} x2={rangeX(km)} y1={GROUND} y2={GROUND + 8} stroke="rgba(236,232,225,0.3)" />
            <text x={rangeX(km)} y={GROUND + 28} textAnchor="middle">
              {km} km
            </text>
          </g>
        ))}
        <text x={X0 - 14} y={APEX - 26} textAnchor="end">
          ALT (km)
        </text>
      </g>
      <line x1={X0} x2={X1} y1={GROUND} y2={GROUND} stroke="rgba(236,232,225,0.35)" />
      <line x1={X0} x2={X0} y1={APEX - 10} y2={GROUND} stroke="rgba(236,232,225,0.2)" />
      <path d={ARC} fill="none" stroke="rgba(236,232,225,0.14)" strokeDasharray="2 8" />
      <motion.path
        ref={pathRef}
        d={ARC}
        fill="none"
        stroke="#ff4d1a"
        strokeWidth="2"
        style={{ pathLength: flight }}
      />
      <line x1={rangeX(200)} x2={rangeX(200)} y1={APEX} y2={GROUND} stroke="rgba(143,211,255,0.25)" strokeDasharray="2 6" />
      <text x={rangeX(200) + 10} y={APEX - 12} fill="#8fd3ff" fontSize="11" className="mono">
        APOGEE 380 <tspan className="normal-case">km</tspan>
      </text>
      <g ref={markerRef} transform={`translate(${X0} ${GROUND})`}>
        <circle r="18" fill="rgba(255,77,26,0.18)" />
        <circle r="5" fill="#ff4d1a" />
        <path d="M-12 0h-8M12 0h8M0-12v-8M0 12v8" stroke="#ece8e1" strokeWidth="1" />
      </g>
    </svg>
  )
}
