import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DomainGlyph } from '@/components/schematics/DomainGlyph'
import { Chip } from '@/components/ui/Badges'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { DOMAINS, IDEAL_FOR, TOT_INTRO } from '@/data/techTransfer'
import { pad } from '@/lib/format'

export function TechTransferTeaser() {
  return (
    <section className="page-x py-28 sm:py-36" aria-labelledby="tot-title">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionLabel index="06" tone="ignition">
            Transfer of technology
          </SectionLabel>
          <SplitHeading
            id="tot-title"
            lines={['Indigenize,', '*faster.*']}
            className="display mt-6 text-[clamp(32px,4vw,58px)]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-ash">{TOT_INTRO}</p>
            <Link to="/tot-and-consultation" className="btn-line mt-8" data-cursor="Open">
              Consultation & ToT <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <ul className="grid gap-px self-start bg-bone/10 sm:grid-cols-2">
          {DOMAINS.map((domain, i) => (
            <li key={domain.id} className="bg-void">
              <Link
                to={`/tot-and-consultation#${domain.id}`}
                className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden p-6 transition-colors duration-500 hover:bg-hull sm:p-8"
                data-cursor="Explore"
              >
                <div className="flex items-start justify-between">
                  <DomainGlyph domain={domain.id} className="transition-colors duration-500 group-hover:text-bone" />
                  <span className="mono text-[10px] text-dim">{pad(i + 1)}</span>
                </div>
                <div>
                  <p className="mono text-[10px] text-ignition">{pad(domain.items.length)} frameworks</p>
                  <h3 className="display-soft mt-2 text-[24px] text-bone">{domain.title}</h3>
                  <p className="mt-3 line-clamp-2 text-[14px] text-ash">{domain.items.slice(0, 3).join(' · ')}</p>
                </div>
                <ArrowUpRight
                  className="absolute bottom-6 right-6 size-5 -translate-x-2 translate-y-2 text-ignition opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Reveal className="mt-16 flex flex-wrap items-center gap-2">
        <span className="mono mr-3 text-[10px] text-dim">Built for</span>
        {IDEAL_FOR.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </Reveal>
    </section>
  )
}
