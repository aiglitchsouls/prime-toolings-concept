import { ArrowUpRight, Cpu, FileText, Map as MapIcon, Network, PackageOpen, TrendingUp, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DomainTabs } from '@/components/products/DomainTabs'
import { Chip } from '@/components/ui/Badges'
import { MetaList, PageHero } from '@/components/ui/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { DELIVERABLES, DOMAINS, IDEAL_FOR, TOT_INTRO, WHY_US } from '@/data/techTransfer'
import { pad } from '@/lib/format'

const ICONS: LucideIcon[] = [FileText, Network, Cpu, PackageOpen, MapIcon, TrendingUp]
const FRAMEWORKS = DOMAINS.reduce((sum, domain) => sum + domain.items.length, 0)

function Deliverables() {
  return (
    <section className="page-x" aria-labelledby="deliver-title">
      <SectionLabel>
        What we deliver
      </SectionLabel>
      <SplitHeading
        id="deliver-title"
        lines={['Blueprints you can', '*build from.*']}
        className="display mt-6 text-[clamp(34px,4.4vw,64px)]"
      />
      <ul className="mt-12 grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-3">
        {DELIVERABLES.map((item, i) => {
          const Icon = ICONS[i]
          return (
            <li key={item.title} className="bg-void">
              <Reveal delay={(i % 3) * 0.07} className="group flex h-full flex-col p-7 transition-colors duration-500 hover:bg-hull">
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-bone/60 transition-colors group-hover:text-ignition" strokeWidth={1.25} aria-hidden />
                  <span className="eyebrow text-[11px] text-dim">{pad(i + 1)}</span>
                </div>
                <h3 className="display-soft mt-10 text-[22px] text-bone">{item.title}</h3>
                <p className="mt-3 text-[15px] text-ash">{item.body}</p>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="page-x grid gap-14 pt-28 lg:grid-cols-2 lg:gap-20" aria-labelledby="why-title">
      <div>
        <SectionLabel>
          Why Prime Toolings
        </SectionLabel>
        <SplitHeading id="why-title" lines={['Built by people who', '*fire what they draw.*']} className="display mt-6 text-[clamp(30px,3.6vw,52px)]" />
        <div className="mt-10 flex flex-wrap gap-2">
          <span className="eyebrow mr-2 self-center text-[11px] text-dim">Ideal for</span>
          {IDEAL_FOR.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
        <Link to="/contact?topic=tot" className="btn-ignite mt-12">
          Discuss a transfer program <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
      <ol className="border-b border-bone/10">
        {WHY_US.map((item, i) => (
          <li key={item} className="flex gap-5 border-t border-bone/10 py-4 text-bone/90">
            <span className="eyebrow pt-1 text-[11px] text-ignition">{pad(i + 1)}</span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function TechTransferPage() {
  return (
    <>
      <PageHero
        label="Transfer of tech & consultation"
        lines={['Engineering', 'intelligence,', '*transferred.*']}
        intro={TOT_INTRO}
        aside={
          <MetaList
            items={[
              { label: 'Domains', value: String(DOMAINS.length) },
              { label: 'Frameworks', value: String(FRAMEWORKS) },
              { label: 'Deliverables', value: String(DELIVERABLES.length) },
            ]}
          />
        }
      />
      <Deliverables />
      <section className="page-x pt-28" aria-labelledby="domains-title">
        <SectionLabel>
          Domains
        </SectionLabel>
        <SplitHeading id="domains-title" lines={['Four domains.', `*${FRAMEWORKS} frameworks.*`]} className="display mb-12 mt-6 text-[clamp(34px,4.4vw,64px)]" />
        <DomainTabs />
      </section>
      <WhyUs />
    </>
  )
}
