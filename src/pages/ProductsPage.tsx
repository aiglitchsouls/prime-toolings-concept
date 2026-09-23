import { useCallback, useMemo, useState } from 'react'

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

import { ProjectileCard } from '@/components/home/Projectiles'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductDrawer } from '@/components/products/ProductDrawer'
import { ThrustDial } from '@/components/products/ThrustDial'
import { MetaList, PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { FAMILIES, PRODUCTS, PROJECTILES, type Family, type Product } from '@/data/products'
import { cn } from '@/lib/utils'

function FamilyFilter({ active, onChange }: { active: Family | 'all'; onChange: (family: Family | 'all') => void }) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by family">
      {FAMILIES.map((family) => {
        const isActive = family.id === active
        return (
          <button
            key={family.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(family.id)}
            className={cn( 'eyebrow relative min-h-[44px] shrink-0 cursor-pointer border px-4 text-[11px] transition-colors duration-300',
              isActive ? 'border-ignition text-void' : 'border-bone/15 text-ash hover:border-bone/40 hover:text-bone',
            )}
          >
            {isActive ? <motion.span layoutId="family-pill" className="absolute inset-0 bg-ignition" transition={{ duration: 0.4 }} /> : null}
            <span className="relative">{family.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const [family, setFamily] = useState<Family | 'all'>('all')
  const selected = useMemo(() => PRODUCTS.find((p) => p.id === params.get('system')) ?? null, [params])
  const visible = family === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.family === family)

  const open = useCallback((product: Product) => setParams({ system: product.id }, { replace: true, preventScrollReset: true }), [setParams])
  const close = useCallback(() => setParams({}, { replace: true, preventScrollReset: true }), [setParams])

  return (
    <>
      <PageHero
        label="Propulsion catalogue · Aeroignite Systems"
        lines={['Thrust,', 'by the', '*kilonewton.*']}
        intro="High-speed, high-power thrusters that drive rockets and missiles. Ten product lines spanning boosters, liquid, hybrid, detonation and air-breathing propulsion, each one customized to the mission."
        aside={
          <MetaList
            items={[
              { label: 'Product lines', value: String(PRODUCTS.length) },
              { label: 'Thrust span', value: '0.5 – 50 kN' },
              { label: 'Pulse rate', value: '5 – 45 Hz' },
            ]}
          />
        }
      />

      <section className="page-x" aria-label="Thrust selector">
        <ThrustDial onSelect={open} />
      </section>

      <section className="page-x pt-28" aria-labelledby="systems-title">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel>
              All systems
            </SectionLabel>
            <SplitHeading id="systems-title" lines={['Every system,', '*one sheet each.*']} className="display mt-6 text-[clamp(34px,4.4vw,64px)]" />
          </div>
          <FamilyFilter active={family} onChange={setFamily} />
        </div>
        <LayoutGroup>
          <motion.ul layout className="grid border-l border-t border-bone/10 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} index={PRODUCTS.indexOf(product)} onOpen={open} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </section>

      <section className="page-x pt-32" aria-labelledby="hsp-title">
        <SectionLabel>
          In development
        </SectionLabel>
        <SplitHeading id="hsp-title" lines={['High-speed', '*projectiles.*']} className="display mb-12 mt-6 text-[clamp(34px,4.4vw,64px)]" />
        <div className="grid gap-6 lg:grid-cols-3">
          {PROJECTILES.map((projectile, i) => (
            <ProjectileCard key={projectile.id} projectile={projectile} index={i} />
          ))}
        </div>
      </section>

      <ProductDrawer product={selected} onClose={close} />
    </>
  )
}
