import type { ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { ArrowLink } from '@/components/ui/ArrowLink'
import { Wordmark } from '@/components/ui/Wordmark'
import { BRAND, NAV_LINKS, SOCIALS } from '@/config/brand'

const YEAR = new Date().getFullYear()

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-dim">{title}</p>
      <ul className="mt-5 space-y-3 text-[15px]">{children}</ul>
    </div>
  )
}

function ContactBand() {
  return (
    <div className="page-x flex flex-col gap-10 py-24 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="eyebrow text-ash">Work with us</p>
        <p className="display mt-6 max-w-[16ch] text-[clamp(40px,5.4vw,84px)]">
          Have something that needs to <span className="italic text-ignition">fly?</span>
        </p>
      </div>
      <div className="flex flex-col items-start gap-6 lg:items-end">
        <Link to="/contact" className="btn-ignite">
          Start a conversation
        </Link>
        <ArrowLink to="/services">Book a test campaign</ArrowLink>
      </div>
    </div>
  )
}

export function Footer() {
  // The contact page is the conversation; repeating the prompt under its form reads as filler.
  const isContactPage = useLocation().pathname === '/contact'
  return (
    <footer className="mt-32 border-t border-bone/10 bg-hull">
      {isContactPage ? null : <ContactBand />}
      <div className="page-x grid gap-12 border-bone/10 py-16 [&:not(:first-child)]:border-t sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <div className="space-y-6">
          <Wordmark />
          <p className="max-w-xs text-[15px] text-ash">
            {BRAND.tagline}. Precision manufacturing in {BRAND.city} since {BRAND.founded}.
          </p>
        </div>
        <Column title="Company">
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
            <a href={BRAND.phoneHref} className="text-ash transition-colors hover:text-bone">
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
        </Column>
      </div>
      <div className="page-x flex flex-col gap-3 border-t border-bone/10 py-6 text-[13px] text-dim sm:flex-row sm:justify-between">
        <p>© {YEAR} Prime Toolings. All rights reserved.</p>
        <p>Design concept by Quietbuild Labs. Not the official Prime Toolings website.</p>
      </div>
    </footer>
  )
}
