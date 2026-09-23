import { motion } from 'framer-motion'

import { Counter } from '@/components/ui/Counter'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { Scramble } from '@/components/ui/Scramble'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { AEROSPIKE_NOTE, BRAND, FIRSTS } from '@/config/brand'
import { PRODUCTS } from '@/data/products'
import { EASE_OUT, VIEWPORT_ONCE } from '@/lib/motion'

const STATS = [
  { value: BRAND.facilities, suffix: '+', label: 'Facilities in Bengaluru' },
  { value: 100, suffix: ' kN', label: 'Static test rig capacity' },
  { value: PRODUCTS.length, suffix: '', label: 'Propulsion product lines' },
  { value: BRAND.founded, suffix: '', label: 'Established', from: 1960 },
]

function FirstRow({ title, field, index }: { title: string; field: string; index: number }) {
  return (
    <motion.li
      className="group relative border-t border-bone/10 py-6 sm:py-7"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.9, delay: index * 0.08, ease: EASE_OUT }}
    >
      <span className="absolute -top-px left-0 h-px w-0 bg-ignition transition-[width] duration-700 ease-out group-hover:w-full" />
      <div className="flex items-start gap-5 sm:gap-8">
        <span className="mono pt-2 text-[10px] text-ignition">
          <Scramble text={`0${index + 1}`} replayOnHover />
        </span>
        <div className="flex-1">
          <p className="mono text-[10px] text-dim">India’s first</p>
          <h3 className="display-soft mt-1 text-[clamp(22px,2.6vw,36px)] text-bone transition-transform duration-500 ease-out group-hover:translate-x-2">
            {title}
          </h3>
        </div>
        <span className="mono hidden shrink-0 pt-2 text-[10px] text-ash sm:block">{field}</span>
      </div>
    </motion.li>
  )
}

export function Firsts() {
  return (
    <section className="page-x relative py-28 sm:py-36" aria-labelledby="firsts-title">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel index="01" tone="ignition">
            On record
          </SectionLabel>
          <SplitHeading
            id="firsts-title"
            lines={['Designed, built', 'and fired', '*here first.*']}
            className="display mt-6 text-[clamp(34px,4.4vw,68px)]"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-ash">
              Every item on this list was designed, manufactured and tested by Prime Toolings as a bootstrapped
              company. {AEROSPIKE_NOTE}
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10">
            <Photo
              photo="aerospikeHardware"
              alt="Prime Toolings aerospike nozzle assembly on its mount"
              width={640}
              height={440}
              isToned={false}
              className="aspect-[16/11] w-full max-w-md"
              imgClassName="grayscale-[0.35] contrast-[1.05]"
            />
            <p className="mono mt-3 text-[10px] text-dim">Fig. 01 · Aerospike nozzle assembly · studio plate</p>
          </Reveal>
        </div>

        <ol className="border-b border-bone/10">
          {FIRSTS.map((item, i) => (
            <FirstRow key={item.title} title={item.title} field={item.field} index={i} />
          ))}
        </ol>
      </div>

      <dl className="mt-24 grid grid-cols-2 gap-px overflow-hidden border border-bone/10 bg-bone/10 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-void p-6 sm:p-8">
            <dt className="mono text-[10px] text-ash">{stat.label}</dt>
            <dd className="display mt-4 whitespace-nowrap text-[clamp(36px,4.4vw,64px)] text-bone">
              <Counter to={stat.value} from={stat.from} />
              <span className="normal-case text-ignition">{stat.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
