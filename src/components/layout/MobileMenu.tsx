import { useEffect } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

import { SoundToggle } from '@/components/ui/SoundToggle'
import { BRAND, NAV_LINKS } from '@/config/brand'
import { EASE_OUT } from '@/lib/motion'
import { menuStore, useMenuOpen } from '@/lib/store'

const LINKS = [...NAV_LINKS, { to: '/contact', label: 'Contact', code: '06' }]

export function MobileMenu() {
  const isOpen = useMenuOpen()
  const { pathname } = useLocation()

  useEffect(() => {
    menuStore.set(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && menuStore.set(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          id="mobile-menu"
          className="blueprint fixed inset-0 z-menu flex flex-col bg-void pt-[var(--nav-h)] lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav className="page-x flex flex-1 flex-col justify-center" aria-label="Mobile">
            <ul className="space-y-1">
              {LINKS.map((link, i) => (
                <li key={link.to} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: EASE_OUT }}
                  >
                    <Link to={link.to} className="flex items-baseline gap-4 py-2">
                      <span className="mono text-[10px] text-ignition">{link.code}</span>
                      <span className="display text-[40px] sm:text-6xl">{link.label}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          <div className="page-x flex items-end justify-between gap-6 border-t border-bone/10 py-6">
            <div className="space-y-1 text-sm">
              <a href={BRAND.emailHref} className="block text-bone">
                {BRAND.email}
              </a>
              <a href={BRAND.phoneHref} className="mono block text-[11px] text-ash">
                {BRAND.phone}
              </a>
            </div>
            <SoundToggle />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
