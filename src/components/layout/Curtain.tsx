import { useState } from 'react'

import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import { EASE_INOUT } from '@/lib/motion'

const LABELS: Record<string, string> = {
  '/': 'Home · Prime Toolings',
  '/products': 'Propulsion catalogue',
  '/services': 'Engineering services',
  '/tot-and-consultation': 'Transfer of technology',
  '/edtech': 'Academy',
  '/about': 'Company',
  '/contact': 'Open a channel',
}

/**
 * Route transition. Keyed on pathname so it mounts in the same commit as the new page:
 * it starts fully closed, then wipes open. Skipped on the very first load (Boot covers that).
 */
export function Curtain() {
  const { pathname } = useLocation()
  const [firstPath] = useState(pathname)
  const [hasNavigated, setNavigated] = useState(false)
  if (!hasNavigated && pathname !== firstPath) setNavigated(true)
  if (!hasNavigated) return null

  return (
    <motion.div
      key={pathname}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-curtain flex items-center justify-center bg-void"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.85, delay: 0.28, ease: EASE_INOUT }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
      >
        <span className="mono text-[11px] text-ash">
          <span className="text-ignition">→</span> {LABELS[pathname] ?? 'Loading'}
        </span>
        <motion.span
          className="h-px w-40 origin-left bg-ignition"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
