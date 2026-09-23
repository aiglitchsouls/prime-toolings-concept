import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { EASE_OUT } from '@/lib/motion'

import { SectionLabel } from './SectionLabel'
import { SplitHeading } from './SplitHeading'

interface PageHeroProps {
  index: string
  label: string
  lines: string[]
  intro: ReactNode
  aside?: ReactNode
}

/** Shared opening block for the inner pages. */
export function PageHero({ index, label, lines, intro, aside }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-20 pt-[calc(var(--nav-h)+5.5rem)] sm:pb-28 sm:pt-[calc(var(--nav-h)+7rem)]">
      <div
        className="blueprint pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-ignition/[0.07] blur-[120px]" aria-hidden />
      <div className="page-x relative grid items-end gap-12 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <div>
          <SectionLabel index={index} tone="ignition">
            {label}
          </SectionLabel>
          <SplitHeading as="h1" lines={lines} delay={0.1} className="display mt-7 text-[clamp(32px,5.8vw,96px)]" />
          <motion.div
            className="mt-8 max-w-2xl text-lg text-ash"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: EASE_OUT }}
          >
            {intro}
          </motion.div>
        </div>
        {aside ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE_OUT }}
          >
            {aside}
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}

/** Key/value stack used in page hero asides. */
export function MetaList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="ticks grid gap-px bg-bone/10 p-px">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-6 bg-void px-5 py-4">
          <dt className="mono text-[10px] text-ash">{item.label}</dt>
          <dd className="display-soft text-right text-[22px] text-bone">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
