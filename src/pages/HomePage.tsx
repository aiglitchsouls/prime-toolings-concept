import { useNavigate } from 'react-router-dom'

import { Capabilities } from '@/components/home/Capabilities'
import { Crew } from '@/components/home/Crew'
import { Firsts } from '@/components/home/Firsts'
import { Hero } from '@/components/home/Hero'
import { Pipeline } from '@/components/home/Pipeline'
import { Positioning } from '@/components/home/Positioning'
import { Projectiles } from '@/components/home/Projectiles'
import { ThrustDial } from '@/components/products/ThrustDial'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'

function CatalogueTeaser() {
  const navigate = useNavigate()
  return (
    <section className="page-x py-28 sm:py-36" aria-labelledby="dial-title">
      <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel>Propulsion catalogue</SectionLabel>
          <SplitHeading
            id="dial-title"
            lines={['Dial in the thrust.', '*See what fires.*']}
            className="display mt-6 text-[clamp(34px,4.2vw,64px)]"
          />
        </div>
        <div className="max-w-sm space-y-6">
          <p className="text-ash">
            Seven engine and booster lines from 500 N to 50 kN on one log scale. Drag the dial, then open any system
            for its spec sheet.
          </p>
          <ArrowLink to="/products">Full catalogue</ArrowLink>
        </div>
      </div>
      <ThrustDial onSelect={(product) => navigate(`/products?system=${product.id}`)} />
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Positioning />
      <Pipeline />
      <Firsts />
      <CatalogueTeaser />
      <Projectiles />
      <Crew />
    </>
  )
}
