import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Photo } from '@/components/ui/Photo'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { PhotoKey } from '@/data/media'
import { EASE_OUT, VIEWPORT_ONCE } from '@/lib/motion'

interface Capability {
  to: string
  title: string
  body: string
  photo: PhotoKey
  alt: string
}

const CAPABILITIES: Capability[] = [
  {
    to: '/products',
    title: 'Propulsion systems',
    body: 'Ten product lines from 500 N to 50 kN: boosters, liquid, hybrid, detonation and air-breathing.',
    photo: 'blueQuad',
    alt: 'Twin-nozzle boosters firing on the test stand',
  },
  {
    to: '/services',
    title: 'Engineering & test',
    body: 'CAD, CFD, precision machining and static fire testing on rigs rated to 100 kN.',
    photo: 'horizontalFire',
    alt: 'Horizontal static fire at the Prime Toolings test stand',
  },
  {
    to: '/tot-and-consultation',
    title: 'Technology transfer',
    body: 'Blueprints, system architectures and transfer packages across four defense domains.',
    photo: 'liquidAssembly',
    alt: 'Liquid rocket assembly on the bench',
  },
  {
    to: '/edtech',
    title: 'Academy',
    body: 'Courses and internships in CAD, CFD and hands-on engine testing.',
    photo: 'standTeam',
    alt: 'Engineers integrating an engine on the test stand',
  },
]

function CapabilityTile({ item, index }: { item: Capability; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 1, delay: index * 0.08, ease: EASE_OUT }}
    >
      <Link to={item.to} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-hull">
          <Photo
            photo={item.photo}
            alt={item.alt}
            width={720}
            height={900}
            className="absolute inset-0"
            imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-ignition transition-transform duration-700 ease-out group-hover:scale-x-100" />
        </div>
        <h3 className="display-soft mt-6 text-[24px] text-bone">{item.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ash">{item.body}</p>
        <span className="eyebrow mt-6 inline-flex items-center gap-3 text-bone">
          Learn more
          <span className="grid size-9 place-items-center rounded-full border border-bone/25 transition-colors duration-300 group-hover:border-ignition group-hover:bg-ignition group-hover:text-void">
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </span>
      </Link>
    </motion.li>
  )
}

export function Capabilities() {
  return (
    <section className="page-x py-28 sm:py-36" aria-labelledby="capabilities-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel>Capabilities</SectionLabel>
          <h2 id="capabilities-title" className="display mt-6 text-[clamp(34px,4.2vw,64px)]">
            Mission-built, <span className="italic text-ignition">in-house.</span>
          </h2>
        </div>
        <p className="max-w-md text-ash">
          One company from drawing to test stand, so programs move without handing hardware between suppliers.
        </p>
      </div>
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map((item, i) => (
          <CapabilityTile key={item.to} item={item} index={i} />
        ))}
      </ul>
    </section>
  )
}
