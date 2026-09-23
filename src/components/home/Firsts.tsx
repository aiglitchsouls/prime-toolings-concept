import { motion } from 'framer-motion'

import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { AEROSPIKE_NOTE, FIRSTS } from '@/config/brand'
import { EASE_OUT, VIEWPORT_ONCE } from '@/lib/motion'

function FirstRow({ title, field, index }: { title: string; field: string; index: number }) {
  return (
    <motion.li
      className="group grid gap-2 border-t border-bone/10 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.9, delay: index * 0.07, ease: EASE_OUT }}
    >
      <div>
        <p className="eyebrow text-dim">India’s first</p>
        <h3 className="display-soft mt-2 text-[clamp(22px,2.2vw,32px)] text-bone">{title}</h3>
      </div>
      <p className="text-[14px] text-ash">{field}</p>
    </motion.li>
  )
}

export function Firsts() {
  return (
    <section className="page-x py-28 sm:py-36" aria-labelledby="firsts-title">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <SectionLabel>On record</SectionLabel>
          <SplitHeading
            id="firsts-title"
            lines={['Designed, built', 'and fired', '*here first.*']}
            className="display mt-6 text-[clamp(34px,4.2vw,64px)]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-ash">
              Every item on this list was designed, manufactured and tested by Prime Toolings as a bootstrapped
              company. {AEROSPIKE_NOTE}
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10">
            <Photo
              photo="aerospikeHardware"
              alt="Prime Toolings aerospike nozzle assembly on its mount"
              width={720}
              height={495}
              className="aspect-[16/11] w-full max-w-md"
            />
            <p className="mt-3 text-[13px] text-dim">Aerospike nozzle assembly</p>
          </Reveal>
        </div>

        <ol className="border-b border-bone/10 lg:self-start">
          {FIRSTS.map((item, i) => (
            <FirstRow key={item.title} title={item.title} field={item.field} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}
