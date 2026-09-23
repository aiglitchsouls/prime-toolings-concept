import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { MetaList, PageHero } from '@/components/ui/PageHero'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { ACADEMY_INTRO, PROGRAMS, type Program } from '@/data/academy'
import { pad } from '@/lib/format'

const AUDIENCES = ['Students', 'Working engineers', 'Institute faculty']

function ProgramBlock({ program, index }: { program: Program; index: number }) {
  return (
    <article id={program.id} className="grid gap-10 border-t border-bone/10 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <Reveal>
        <p className="display text-[clamp(64px,8vw,120px)] leading-none text-bone/10">{program.code}</p>
        <h3 className="display mt-2 text-[clamp(26px,2.9vw,42px)]">{program.title}</h3>
        <p className="mono mt-4 text-[11px] text-ignition">{program.outcome}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-lg text-ash">{program.lead}</p>
        <ol className="mt-8 grid gap-px bg-bone/10 sm:grid-cols-2">
          {program.modules.map((module, i) => (
            <li key={module} className="flex items-baseline gap-4 bg-void p-4 text-bone/90">
              <span className="mono text-[10px] text-dim">{pad(i + 1)}</span>
              {module}
            </li>
          ))}
        </ol>
        <Link to={`/contact?topic=academy&program=${program.id}`} className="btn-line mt-8" data-cursor="Register">
          Register for {program.code} <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </Reveal>
      <span className="sr-only">Program {index + 1} of {PROGRAMS.length}</span>
    </article>
  )
}

export function AcademyPage() {
  return (
    <>
      <PageHero
        index="04"
        label="Academy · courses & internships"
        lines={['Industry-ready', 'starts on the', '*test stand.*']}
        intro={ACADEMY_INTRO}
        aside={
          <MetaList
            items={[
              { label: 'Programs', value: String(PROGRAMS.length) },
              { label: 'Modules', value: String(PROGRAMS.reduce((n, p) => n + p.modules.length, 0)) },
              { label: 'Open to', value: 'All levels' },
            ]}
          />
        }
      />

      <section className="page-x" aria-labelledby="programs-title">
        <SectionLabel index="04.1" tone="ignition">
          Skill development programs
        </SectionLabel>
        <SplitHeading id="programs-title" lines={['Three programs.', '*One standard.*']} className="display mb-6 mt-6 text-[clamp(34px,4.4vw,64px)]" />
        {PROGRAMS.map((program, i) => (
          <ProgramBlock key={program.id} program={program} index={i} />
        ))}
      </section>

      <section className="relative mt-16 overflow-hidden border-y border-bone/10 bg-hull" aria-labelledby="touch-title">
        <div className="page-x grid items-center gap-12 py-24 lg:grid-cols-2">
          <div>
            <SectionLabel index="04.2" tone="ignition">
              Hands on
            </SectionLabel>
            <SplitHeading
              id="touch-title"
              lines={['Touch and feel', '*expensive setups.*']}
              className="display mt-6 text-[clamp(32px,4vw,60px)]"
            />
            <p className="mt-6 max-w-md text-ash">
              Students manufacture parts, assemble components, fire rocket and missile engines with their own hands and
              validate the results on DAQ systems. Some hardware gets destroyed on purpose, because that is how you learn
              where an industrial process breaks.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {AUDIENCES.map((audience) => (
                <span key={audience} className="mono border border-bone/15 px-3 py-1.5 text-[10px] text-ash">
                  {audience}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-bone/10">
            <Photo photo="standTeam" alt="Engineers at a test stand" width={600} height={760} className="aspect-[3/4]" />
            <Photo photo="sparkFireTwo" alt="Engine firing on the test rail" width={600} height={760} className="aspect-[3/4]" />
          </div>
        </div>
      </section>
    </>
  )
}
