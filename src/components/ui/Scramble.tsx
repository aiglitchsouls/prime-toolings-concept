import { useEffect, useRef } from 'react'

import { useInView, useReducedMotion } from 'framer-motion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#<>_'

interface ScrambleProps {
  text: string
  className?: string
  /** Re-run on hover of the closest `.group`. */
  replayOnHover?: boolean
  delay?: number
}

/** Decodes text from random glyphs, telemetry-style. */
export function Scramble({ text, className, replayOnHover, delay = 0 }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    // Mutate the text node React already owns, so reconciliation never loses track of it.
    const node = element?.firstChild
    if (!element || !(node instanceof Text) || !isInView || shouldReduceMotion) return
    let frame = 0

    const run = () => {
      cancelAnimationFrame(frame)
      const start = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / 650)
        const settled = Math.floor(progress * text.length)
        let output = text.slice(0, settled)
        for (let i = settled; i < text.length; i++) {
          output += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        node.nodeValue = output
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    const timer = window.setTimeout(run, delay * 1000)
    const host = replayOnHover ? element.closest('.group') : null
    host?.addEventListener('pointerenter', run)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      host?.removeEventListener('pointerenter', run)
      node.nodeValue = text
    }
  }, [isInView, shouldReduceMotion, text, replayOnHover, delay])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
