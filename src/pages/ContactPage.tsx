import { ArrowUpRight } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { ContactForm, TOPICS } from '@/components/products/ContactForm'
import { DomainGlyph } from '@/components/schematics/DomainGlyph'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { BRAND, SOCIALS } from '@/config/brand'
import { PROGRAMS } from '@/data/academy'
import { PRODUCTS } from '@/data/products'

/** Pre-fills the form from links elsewhere on the site (?topic=, ?system=, ?program=). */
function usePrefill() {
  const [params] = useSearchParams()
  const product = PRODUCTS.find((p) => p.id === params.get('system'))
  const program = PROGRAMS.find((p) => p.id === params.get('program'))
  const requested = params.get('topic') ?? ''
  const topic = TOPICS.some((t) => t.id === requested) ? requested : 'propulsion'
  if (product) return { topic, context: product.name, message: `We'd like the datasheet for your ${product.name.toLowerCase()}.` }
  if (program) return { topic, context: program.title, message: `I'd like to register for the ${program.title} program.` }
  return { topic, context: undefined, message: '' }
}

export function ContactPage() {
  const prefill = usePrefill()

  return (
    <section className="relative overflow-hidden pb-10 pt-[calc(var(--nav-h)+5rem)]" aria-labelledby="contact-title">
      <div className="blueprint pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" aria-hidden />
      <div className="page-x relative grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionLabel index="06" tone="ignition">
            Contact
          </SectionLabel>
          <SplitHeading
            as="h1"
            id="contact-title"
            lines={['Open a', '*channel.*']}
            isPlaying
            className="display mt-7 text-[clamp(40px,5.1vw,76px)]"
          />
          <p className="mt-6 max-w-md text-lg text-ash">
            Custom aerospace solutions, test campaigns, technology transfer or training. Tell us what needs to fly.
          </p>

          <dl className="mt-12 space-y-6">
            <div>
              <dt className="mono text-[10px] text-dim">Email</dt>
              <dd>
                <a href={BRAND.emailHref} className="display-soft text-[clamp(20px,2vw,28px)] text-bone transition-colors hover:text-ignition">
                  {BRAND.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="mono text-[10px] text-dim">Phone</dt>
              <dd>
                <a href={BRAND.phoneHref} className="display-soft text-[clamp(20px,2vw,28px)] text-bone transition-colors hover:text-ignition">
                  {BRAND.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="mono text-[10px] text-dim">Base</dt>
              <dd className="text-bone">
                {BRAND.city}, {BRAND.region}
              </dd>
            </div>
          </dl>

          <ul className="mt-10 flex flex-wrap gap-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mono inline-flex min-h-[44px] items-center gap-2 border border-bone/15 px-4 text-[10px] text-ash transition-colors hover:border-bone/50 hover:text-bone"
                >
                  {social.label} <ArrowUpRight className="size-3" aria-hidden />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 hidden items-center gap-4 lg:flex">
            <DomainGlyph domain="ew" className="size-14" />
            <p className="mono text-[10px] text-dim">
              Listening on {BRAND.coordinates}
            </p>
          </div>
        </div>

        <ContactForm key={`${prefill.topic}-${prefill.context ?? ''}`} topic={prefill.topic} message={prefill.message} context={prefill.context} />
      </div>
    </section>
  )
}
