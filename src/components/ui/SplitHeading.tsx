import { createElement, Fragment } from 'react'

import { motion } from 'framer-motion'

import { EASE_OUT, VIEWPORT_ONCE } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SplitHeadingProps {
  /** One entry per line. Wrap words in *asterisks* to paint them ignition orange. */
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  delay?: number
  /** Animate immediately instead of on scroll-into-view (hero use). */
  isPlaying?: boolean
  id?: string
}

function renderLine(line: string) {
  return line
    .split('*')
    .map((segment, i) =>
      i % 2 === 1 ? (
        <span key={i} className="italic text-ignition">
          {segment}
        </span>
      ) : (
        <Fragment key={i}>{segment}</Fragment>
      ),
    )
}

/** Masked line-by-line rise. Screen readers get the plain sentence. */
export function SplitHeading({ lines, as = 'h2', className, delay = 0, isPlaying, id }: SplitHeadingProps) {
  const label = lines.join(' ').replaceAll('*', '')
  const trigger =
    isPlaying === undefined ? { whileInView: 'show', viewport: VIEWPORT_ONCE } : { animate: isPlaying ? 'show' : 'hide' }

  return createElement(
    as,
    { className: cn(className), id },
    <span className="sr-only">{label}</span>,
    <motion.span key="visual" className="block" initial="hide" {...trigger} aria-hidden>
      {lines.map((line, i) => (
        <span key={line} className="-mx-[0.08em] block overflow-hidden px-[0.08em] pb-[0.06em]">
          <motion.span
            className="block"
            variants={{
              hide: { y: '105%', rotate: 2 },
              show: { y: '0%', rotate: 0, transition: { duration: 1.05, delay: delay + i * 0.09, ease: EASE_OUT } },
            }}
          >
            {renderLine(line)}
          </motion.span>
        </span>
      ))}
    </motion.span>,
  )
}
