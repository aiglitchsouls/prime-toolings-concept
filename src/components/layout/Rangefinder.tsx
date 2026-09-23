import { useRef } from 'react'

import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'

// Scroll progress as downrange distance, scaled to the liquid rocket's 400 km range.
const RANGE_KM = 400

export function Rangefinder() {
  const { scrollYProgress } = useScroll()
  const readoutRef = useRef<HTMLSpanElement>(null)
  const markerY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const node = readoutRef.current
    if (node) node.textContent = (progress * RANGE_KM).toFixed(1).padStart(5, '0')
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-nav hidden -translate-y-1/2 flex-col items-end gap-3 min-[1560px]:flex"
    >
      <span className="mono text-[9px] text-dim">Downrange</span>
      <div className="relative h-[34vh] w-3">
        <div
          className="absolute inset-y-0 right-0 w-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, rgba(236,232,225,0.28) 0 1px, transparent 1px 12px)',
            maskImage: 'linear-gradient(to left, #000 35%, transparent 36%)',
          }}
        />
        <div className="absolute inset-y-0 right-0 w-px bg-bone/15" />
        <motion.div className="absolute inset-x-0 top-0 h-full" style={{ y: markerY }}>
          <div className="absolute -right-[3px] -top-[3px] size-[7px] rotate-45 border border-ignition bg-void" />
        </motion.div>
      </div>
      <span className="mono text-[10px] text-bone">
        <span ref={readoutRef}>000.0</span>
        <span className="text-dim"> km</span>
      </span>
    </div>
  )
}
