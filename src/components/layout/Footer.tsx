import type { ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Magnetic } from '@/components/ui/Magnetic'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { BRAND, NAV_LINKS, SOCIALS } from '@/config/brand'

const YEAR = new Date().getFullYear()

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mono text-[10px] text-dim">{title}</p>
      <ul className="mt-5 space-y-3 text-[15px]">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-bone/10 bg-hull">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="page-x relative pt-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SplitHeading
            lines={['Have something', 'that needs', 'to *fly?*']}
            className="display text-[10.6vw] sm:text-[9vw] lg:text-[7.4vw] xl:text-[104px]"
          />
          <div className="flex flex-col items-start gap-5 lg:items-end lg:pb-3">
            <Magnetic>
              <Link to="/contact" className="btn-ignite min-h-[60px] px-9 text-[16px]" data-cursor="Open channel">
                Start a project <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Magnetic>
            <a href={BRAND.emailHref} className="mono text-[11px] normal-case text-ash transition-colors hover:text-bone">
              {BRAND.email}
            </a>
          </div>
        </div>

        <div className="mt-24 grid gap-12 border-t border-bone/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Explore">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-ash transition-colors hover:text-bone">
                  {link.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="Contact">
            <li>
              <a href={BRAND.emailHref} className="text-ash transition-colors hover:text-bone">
                {BRAND.email}
              </a>
            </li>
            <li>
              <a href={BRAND.phoneHref} className="mono text-[12px] text-ash transition-colors hover:text-bone">
                {BRAND.phone}
              </a>
            </li>
            <li className="text-ash">
              {BRAND.city}, {BRAND.region}
            </li>
          </Column>
          <Column title="Follow">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-ash transition-colors hover:text-bone"
                >
                  {social.label} <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </Column>
          <Column title="Credentials">
            {BRAND.certifications.map((item) => (
              <li key={item} className="text-ash">
                {item}
              </li>
            ))}
            <li className="text-ash">Est. {BRAND.founded}</li>
          </Column>
        </div>
      </div>

      <p
        aria-hidden
        className="display text-outline relative mt-20 select-none whitespace-nowrap text-center text-[8.8vw] leading-[0.8]"
      >
        Prime Toolings
      </p>

      <div className="page-x relative flex flex-col gap-3 border-t border-bone/10 py-6 text-[12px] text-dim sm:flex-row sm:justify-between">
        <p>© {YEAR} Prime Toolings. Design concept by Quietbuild Labs, not the official Prime Toolings website.</p>
        <p className="mono text-[10px]">{BRAND.coordinates}</p>
      </div>
    </footer>
  )
}
