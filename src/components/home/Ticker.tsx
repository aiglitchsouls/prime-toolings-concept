import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

import { PROPULSION_CLASSES } from '@/config/brand'

/** Propulsion classes on a marquee that leans into your scroll speed. */
export function Ticker() {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const skewX = useSpring(useTransform(velocity, [-2500, 0, 2500], [7, 0, -7]), { stiffness: 260, damping: 38 })
  const items = [...PROPULSION_CLASSES, ...PROPULSION_CLASSES]

  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-hull py-6" aria-label="Propulsion classes we build">
      <ul className="sr-only">
        {PROPULSION_CLASSES.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <motion.div style={{ skewX }} aria-hidden>
        <div className="marquee-track flex w-max items-center">
          {items.map((item, i) => (
            <span key={`${item}-${i}`} className="display-soft flex items-center text-[clamp(24px,3.4vw,46px)] text-bone">
              <span className="px-8">{item}</span>
              <span className="size-2 rotate-45 bg-ignition" />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
