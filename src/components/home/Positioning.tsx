import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { BRAND } from '@/config/brand'
import { PRODUCTS } from '@/data/products'

const NUMBERS = [
  { value: BRAND.facilities, suffix: '+', label: 'Facilities in Bengaluru' },
  { value: 100, suffix: ' kN', label: 'Static test rig capacity' },
  { value: PRODUCTS.length, suffix: '', label: 'Propulsion product lines' },
  { value: BRAND.founded, suffix: '', label: 'Established', from: 1960 },
]

/** The single positioning statement, then the numbers that back it. */
export function Positioning() {
  return (
    <section className="border-y border-bone/10 bg-hull" aria-labelledby="positioning-title">
      <div className="page-x grid gap-12 py-28 sm:py-36 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionLabel>Prime Toolings</SectionLabel>
          <h2 id="positioning-title" className="display mt-6 text-[clamp(34px,4.2vw,64px)]">
            Built in-house. <span className="italic text-ignition">Proven on the stand.</span>
          </h2>
        </div>
        <Reveal className="lg:pt-12">
          <p className="text-[clamp(19px,1.6vw,24px)] leading-[1.5] text-bone/90">
            Prime Toolings designs, machines and static-fires propulsion under one roof in {BRAND.city}, from
            injectors and chambers to complete boosters, liquid engines and hybrids. Six facilities and three decades of
            precision manufacturing now build India’s firsts: a liquid-fuel aerospike, a rotating detonation engine,
            and liquid-cooled igniters and pre-detonators.
          </p>
        </Reveal>
      </div>
      <dl className="page-x grid grid-cols-2 border-t border-bone/10 lg:grid-cols-4">
        {NUMBERS.map((item) => (
          <div key={item.label} className="border-bone/10 py-10 pr-6 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
            <dt className="eyebrow text-dim">{item.label}</dt>
            <dd className="display mt-4 whitespace-nowrap text-[clamp(40px,4.4vw,68px)] text-bone">
              <Counter to={item.value} from={item.from} />
              <span className="normal-case text-ignition">{item.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
