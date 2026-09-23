import { useRef } from 'react'

import { useScroll, useTransform } from 'framer-motion'

import { ConceptBadge } from '@/components/ui/Badges'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { PROJECTILES, type Projectile } from '@/data/products'

import { TrajectoryChart } from './TrajectoryChart'

const [LIQUID_ROCKET, ...OTHERS] = PROJECTILES

function Readout({ label, unit, readoutRef, initial }: { label: string; unit: string; readoutRef: React.RefObject<HTMLSpanElement | null>; initial: string }) {
  return (
    <div className="border-l border-bone/15 pl-4">
      <p className="eyebrow text-[10px] text-dim">{label}</p>
      <p className="display-soft tnum mt-2 text-[clamp(26px,2.6vw,38px)] text-bone">
        <span ref={readoutRef}>{initial}</span>
        <span className="mono ml-1 text-[10px] normal-case text-ash">{unit}</span>
      </p>
    </div>
  )
}

export function ProjectileCard({ projectile, index }: { projectile: Projectile; index: number }) {
  return (
    <Reveal delay={index * 0.1} className="flex h-full flex-col border border-bone/10 bg-hull p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow text-ignition">{projectile.short}</p>
        <span className="eyebrow border border-bone/15 px-2.5 py-1 text-[10px] text-ash">In development</span>
      </div>
      <h3 className="display-soft mt-5 text-[clamp(26px,2.4vw,34px)] text-bone">{projectile.name}</h3>
      <p className="mt-2 text-ash">{projectile.summary}</p>
      <dl className="mt-8 grid grid-cols-2 gap-px bg-bone/10 [&>*:last-child:nth-child(odd)]:col-span-2">
        {projectile.specs.map((spec) => (
          <div key={spec.label} className="bg-hull p-3">
            <dt className="eyebrow text-[10px] text-dim">{spec.label}</dt>
            <dd className="mt-1 text-[15px] text-bone">{spec.value}</dd>
          </div>
        ))}
      </dl>
      {projectile.engagement ? (
        <p className="mt-6 text-[14px] leading-relaxed text-ash">
          <span className="text-dim">Engagement set · </span>
          {projectile.engagement.join(' · ')}
        </p>
      ) : null}
    </Reveal>
  )
}

/** High-speed projectiles: a scroll-drawn flight profile for the liquid rocket, then the other programs. */
export function Projectiles() {
  const sectionRef = useRef<HTMLElement>(null)
  const rangeRef = useRef<HTMLSpanElement>(null)
  const altitudeRef = useRef<HTMLSpanElement>(null)
  const machRef = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const flight = useTransform(scrollYProgress, [0.06, 0.94], [0, 1], { clamp: true })

  return (
    <>
      <section ref={sectionRef} className="relative h-[260vh]" aria-labelledby="projectiles-title">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="blueprint pointer-events-none absolute inset-0" aria-hidden />
          <div className="page-x relative grid w-full items-center gap-10 pt-[var(--nav-h)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
            <div>
              <SectionLabel>
                High-speed projectiles · in development
              </SectionLabel>
              <SplitHeading
                id="projectiles-title"
                lines={['Faster', 'than *sound.*']}
                className="display mt-6 text-[clamp(32px,4.8vw,72px)]"
              />
              <p className="mt-5 max-w-sm text-ash">
                {LIQUID_ROCKET.name}: 400 km range, 380 km apogee, Mach 2.23 on 3 kN of kerosene–GOx thrust.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <Readout label="Downrange" unit="km" readoutRef={rangeRef} initial="000" />
                <Readout label="Altitude" unit="km" readoutRef={altitudeRef} initial="000" />
                <Readout label="Speed" unit="M" readoutRef={machRef} initial="0.00" />
              </div>
              <ConceptBadge className="mt-8">Illustrative profile</ConceptBadge>
            </div>
            <TrajectoryChart flight={flight} readouts={{ range: rangeRef, altitude: altitudeRef, mach: machRef }} />
          </div>
        </div>
      </section>

      <section className="page-x grid gap-6 pb-10 md:grid-cols-2" aria-label="Other high-speed projectile programs">
        {OTHERS.map((projectile, i) => (
          <ProjectileCard key={projectile.id} projectile={projectile} index={i} />
        ))}
      </section>
    </>
  )
}
