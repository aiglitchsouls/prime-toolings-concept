import type { ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Pipeline } from '@/components/home/Pipeline'
import { EngineSchematic } from '@/components/schematics/EngineSchematic'
import { FlowField } from '@/components/schematics/FlowField'
import { Chip } from '@/components/ui/Badges'
import { MetaList, PageHero } from '@/components/ui/PageHero'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { BRAND } from '@/config/brand'
import { SERVICES, type Service } from '@/data/services'
import { cn } from '@/lib/utils'

const VISUALS: Record<string, ReactNode> = {
  'cad-dfm': (
    <div className="ticks blueprint relative aspect-[4/3] w-full bg-hull p-8">
      <EngineSchematic kind="aerospike" className="text-bone/70" />
      <p className="eyebrow absolute bottom-4 left-4 text-[10px] text-dim">Concept drawing · aerospike plug contour</p>
    </div>
  ),
  cfd: (
    <div className="ticks relative aspect-[4/3] w-full bg-hull p-6">
      <FlowField className="h-full w-full" />
      <p className="eyebrow absolute bottom-4 left-4 text-[10px] text-dim">Illustrative flow field</p>
    </div>
  ),
  manufacturing: (
    <div className="grid aspect-[4/3] w-full grid-cols-2 gap-px bg-bone/10">
      <Photo photo="injectorParts" alt="Machined injector components" width={480} height={720} className="h-full" />
      <Photo photo="combustorParts" alt="Machined combustor components" width={480} height={720} className="h-full" />
    </div>
  ),
  'static-fire': (
    <Photo photo="horizontalFire" alt="Horizontal static fire on a Prime Toolings test stand" width={960} height={720} className="aspect-[4/3] w-full" />
  ),
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const isFlipped = index % 2 === 1
  return (
    <article id={service.id} className="grid items-center gap-10 border-t border-bone/10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
      <Reveal className={cn(isFlipped && 'lg:order-2')}>
        <p className="eyebrow text-[11px] text-ignition">
          {service.code} · {service.stage}
        </p>
        <h3 className="display mt-4 text-[clamp(28px,3.2vw,48px)]">{service.title}</h3>
        <p className="mt-5 max-w-lg text-lg text-ash">{service.lead}</p>
        <ul className="mt-8 space-y-3">
          {service.points.map((point) => (
            <li key={point} className="flex gap-4 border-b border-bone/[0.06] pb-3 text-bone/90">
              <span className="mt-[0.8em] h-px w-3 shrink-0 bg-ignition" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className={cn(isFlipped && 'lg:order-1')}>
        {VISUALS[service.id]}
      </Reveal>
    </article>
  )
}

function TestRig() {
  return (
    <section className="page-x pt-10" aria-labelledby="rig-title">
      <div className="ticks relative grid overflow-hidden bg-hull lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative z-[1] p-8 sm:p-12">
          <SectionLabel>
            Test campaigns
          </SectionLabel>
          <p id="rig-title" className="display mt-8 text-[clamp(56px,6.2vw,96px)] normal-case leading-[0.8] text-bone">
            {BRAND.testRig.capacity.replace(' ', ' ')}
          </p>
          <p className="eyebrow mt-4 text-ash">Static test rig · designed, manufactured, tested in-house</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {BRAND.testRig.compatible.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
          <Link to="/contact?topic=testing" className="btn-ignite mt-10">
            Book a test campaign <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <Photo photo="redStand" alt="Prime Toolings static test stand" width={960} height={760} className="min-h-[320px] lg:h-full" />
      </div>
    </section>
  )
}

export function ServicesPage() {
  return (
    <>
      <PageHero
        label="Engineering services"
        lines={['From CAD', 'to the *test stand.*']}
        intro="The same design, simulation, machining and static fire capability behind our own engines, available for yours."
        aside={
          <MetaList
            items={[
              { label: 'Test rig', value: BRAND.testRig.capacity },
              { label: 'Facilities', value: `${BRAND.facilities}+` },
              { label: 'Quality', value: 'ISO 9001:2015' },
            ]}
          />
        }
      />
      <Pipeline />
      <section className="page-x pt-28" aria-labelledby="services-detail-title">
        <SectionLabel>
          In detail
        </SectionLabel>
        <SplitHeading
          id="services-detail-title"
          lines={['Four services.', '*One roof.*']}
          className="display mt-6 text-[clamp(34px,4.4vw,64px)]"
        />
        <div className="mt-12">
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </div>
      </section>
      <TestRig />
    </>
  )
}
