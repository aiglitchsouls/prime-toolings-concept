import { useNavigate } from 'react-router-dom'

import { AcademyTeaser } from '@/components/home/AcademyTeaser'
import { Crew } from '@/components/home/Crew'
import { Firsts } from '@/components/home/Firsts'
import { Hero } from '@/components/home/Hero'
import { Pipeline } from '@/components/home/Pipeline'
import { Projectiles } from '@/components/home/Projectiles'
import { TechTransferTeaser } from '@/components/home/TechTransferTeaser'
import { TestArchive } from '@/components/home/TestArchive'
import { Ticker } from '@/components/home/Ticker'
import { ThrustDial } from '@/components/products/ThrustDial'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'

function CatalogueTeaser() {
  const navigate = useNavigate()
  return (
    <section className="page-x pb-28 sm:pb-36" aria-labelledby="dial-title">
      <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel index="02" tone="ignition">
            Catalogue
          </SectionLabel>
          <SplitHeading
            id="dial-title"
            lines={['Dial in the thrust.', '*See what fires.*']}
            className="display mt-6 text-[clamp(32px,4.8vw,72px)]"
          />
        </div>
        <p className="max-w-sm text-ash">
          Seven engine and booster lines from 500 N to 50 kN, on one log scale. Drag the dial, then open any system for
          its spec sheet.
        </p>
      </div>
      <ThrustDial onSelect={(product) => navigate(`/products?system=${product.id}`)} />
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Firsts />
      <CatalogueTeaser />
      <Pipeline />
      <TestArchive />
      <Projectiles />
      <TechTransferTeaser />
      <AcademyTeaser />
      <Crew />
    </>
  )
}
