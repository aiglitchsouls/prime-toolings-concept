import { useEffect, useRef } from 'react'

import { animate, useInView, useReducedMotion } from 'framer-motion'

import { EASE_OUT } from '@/lib/motion'

interface CounterProps {
  to: number
  from?: number
  decimals?: number
  duration?: number
  className?: string
}

/** Counts up once when scrolled into view; renders the final value for reduced motion. */
export function Counter({ to, from = 0, decimals = 0, duration = 1.6, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current?.firstChild
    if (!isInView || shouldReduceMotion || !(node instanceof Text)) return
    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (value) => {
        node.nodeValue = value.toFixed(decimals)
      },
    })
    return () => controls.stop()
  }, [isInView, shouldReduceMotion, from, to, decimals, duration])

  return (
    <span ref={ref} className={className}>
      {to.toFixed(decimals)}
    </span>
  )
}
