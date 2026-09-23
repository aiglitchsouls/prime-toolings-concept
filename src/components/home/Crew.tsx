import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { TEAM } from '@/config/brand'
import { pad } from '@/lib/format'
import { EASE_OUT, VIEWPORT_ONCE } from '@/lib/motion'
import { cn } from '@/lib/utils'

const initials = (name: string) =>
  name
    .replace(/^Dr\s+/, '')
    .split(' ')
    .filter((part) => part.length > 1)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

type Member = (typeof TEAM)[number]

function CrewCard({ member, index }: { member: Member; index: number }) {
  const credential = 'credential' in member ? member.credential : null
  return (
    <li className={cn('group relative bg-void', credential && 'bg-hull')}>
      <motion.div
        className="h-full p-6 sm:p-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.8, delay: (index % 4) * 0.07, ease: EASE_OUT }}
      >
        <div className="flex items-start justify-between">
          <span className="ticks display grid size-16 place-items-center text-[22px] text-bone/90 transition-colors duration-500 group-hover:text-ignition">
            {initials(member.name)}
          </span>
          <span className="mono text-[9px] text-dim">CREW {pad(index + 1)}</span>
        </div>
        <p className="mt-10 text-[18px] font-medium text-bone">{member.name}</p>
        <p className="mt-1 text-[14px] text-ash">{member.role}</p>
        {credential ? <p className="mono mt-4 text-[10px] text-ignition">{credential}</p> : null}
      </motion.div>
    </li>
  )
}

export function Crew({ index = '08' }: { index?: string }) {
  return (
    <section className="page-x py-28 sm:py-36" aria-labelledby="crew-title">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel index={index} tone="ignition">
            Leadership
          </SectionLabel>
          <SplitHeading
            id="crew-title"
            lines={['Founders who build.', '*Veterans who advise.*']}
            className="display mt-6 text-[clamp(34px,4.4vw,66px)]"
          />
        </div>
        <p className="max-w-sm text-ash">
          Technical advisors from NAL’s propulsion division, which one of them headed, and DRDO’s Gas Turbine Research
          Establishment. Sales leadership comes from Elbit Systems.
        </p>
      </div>
      <ul className="mt-16 grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((member, i) => (
          <CrewCard key={member.name} member={member} index={i} />
        ))}
        <li className="bg-void">
          <Link
            to="/edtech"
            className="group flex h-full min-h-[220px] flex-col justify-between p-6 transition-colors duration-500 hover:bg-ignition sm:p-7"
            data-cursor="Join"
          >
            <span className="mono text-[9px] text-dim group-hover:text-void">Open slot</span>
            <span className="display-soft text-[22px] text-bone group-hover:text-void">
              Internships through the Academy <ArrowUpRight className="inline size-5" aria-hidden />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  )
}
