import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { EASE_OUT } from '@/lib/motion'

import { SectionLabel } from './SectionLabel'
import { SplitHeading } from './SplitHeading'

interface PageHeroProps {
  label: string
  lines: string[]
  intro: ReactNode
  aside?: ReactNode
}

/** Shared opening block for the inner pages: statement left, context right. */
export function PageHero({ label, lines, intro, aside }: PageHeroProps) {
  return (
    <section className="mb-20 border-b border-bone/10 pb-20 pt-[calc(var(--nav-h)+5rem)] sm:mb-28 sm:pb-24 sm:pt-[calc(var(--nav-h)+7rem)]">
      <div className="page-x grid items-end gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <SplitHeading as="h1" lines={lines} isPlaying delay={0.1} className="display mt-8 text-[clamp(40px,6vw,100px)]" />
        </div>
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: EASE_OUT }}
        >
          <div className="max-w-xl text-lg leading-relaxed text-ash">{intro}</div>
          {aside}
        </motion.div>
      </div>
    </section>
  )
}

/** Key/value rows used in page hero asides. */
export function MetaList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="divide-y divide-bone/10 border-y border-bone/10">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-6 py-4">
          <dt className="eyebrow text-dim">{item.label}</dt>
          <dd className="display-soft text-right text-[22px] text-bone">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
