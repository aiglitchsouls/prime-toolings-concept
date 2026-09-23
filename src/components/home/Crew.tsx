import { motion } from 'framer-motion'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { TEAM } from '@/config/brand'
import { EASE_OUT, VIEWPORT_ONCE } from '@/lib/motion'

type Member = (typeof TEAM)[number]

function MemberRow({ member, index }: { member: Member; index: number }) {
  const credential = 'credential' in member ? member.credential : null
  return (
    <motion.li
      className="flex flex-col gap-1 border-t border-bone/10 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.8, delay: (index % 4) * 0.06, ease: EASE_OUT }}
    >
      <p className="display-soft text-[22px] text-bone">{member.name}</p>
      <p className="text-[15px] text-ash sm:text-right">
        {member.role}
        {credential ? <span className="block text-[13px] text-dim">{credential}</span> : null}
      </p>
    </motion.li>
  )
}

/** Leadership as a formal roster: advisors first, since their records carry the weight. */
export function Crew() {
  const advisors = TEAM.filter((member) => 'credential' in member)
  const founders = TEAM.filter((member) => !('credential' in member))

  return (
    <section className="page-x py-28 sm:py-36" aria-labelledby="crew-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <SectionLabel>Leadership</SectionLabel>
          <h2 id="crew-title" className="display mt-6 text-[clamp(34px,4.2vw,64px)]">
            Led by builders. <span className="italic text-ignition">Advised by veterans.</span>
          </h2>
          <p className="mt-6 max-w-md text-ash">
            Technical advisors from NAL’s propulsion division, which one of them headed, and DRDO’s Gas Turbine
            Research Establishment. Sales leadership comes from Elbit Systems.
          </p>
        </div>
        <div className="space-y-12">
          <div>
            <p className="eyebrow text-dim">Advisory &amp; commercial</p>
            <ul className="mt-4 border-b border-bone/10">
              {advisors.map((member, i) => (
                <MemberRow key={member.name} member={member} index={i} />
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-dim">Founders &amp; management</p>
            <ul className="mt-4 border-b border-bone/10">
              {founders.map((member, i) => (
                <MemberRow key={member.name} member={member} index={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
