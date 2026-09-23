import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { ACADEMY_INTRO, PROGRAMS } from '@/data/academy'

export function AcademyTeaser() {
  return (
    <section className="relative overflow-hidden border-y border-bone/10 bg-hull py-28 sm:py-36" aria-labelledby="academy-title">
      <div className="page-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionLabel index="07" tone="ignition">
            Academy · courses & internships
          </SectionLabel>
          <SplitHeading
            id="academy-title"
            lines={['Fire an engine', 'with *your own*', '*hands.*']}
            className="display mt-6 text-[clamp(32px,5vw,76px)]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-lg text-ash">{ACADEMY_INTRO}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/edtech" className="btn-ignite" data-cursor="Programs">
                See the programs <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link to="/contact?topic=academy" className="btn-line" data-cursor="Register">
                Register interest
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative">
          <Photo
            photo="standTeam"
            alt="Engineers working on an engine test stand"
            width={900}
            height={1000}
            className="aspect-[9/10] w-full"
          />
          <p className="mono absolute left-4 top-4 bg-void/70 px-2 py-1 text-[9px] text-bone backdrop-blur">
            Hands-on · test stand integration
          </p>
        </Reveal>
      </div>

      <ol className="page-x mt-20 grid gap-px bg-bone/10 md:grid-cols-3">
        {PROGRAMS.map((program, i) => (
          <li key={program.id} className="bg-hull">
            <Reveal delay={i * 0.08} className="flex h-full flex-col p-6 sm:p-8">
              <p className="mono text-[10px] text-ignition">{program.code}</p>
              <h3 className="display-soft mt-3 text-[20px] text-bone lg:text-[24px]">{program.title}</h3>
              <p className="mt-3 flex-1 text-[15px] text-ash">{program.modules.join(' · ')}</p>
              <p className="mono mt-6 text-[10px] text-bone/80">{program.outcome}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
