import { useEffect } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

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
          className="fixed inset-0 z-menu flex flex-col bg-void pt-[var(--nav-h)] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <nav className="page-x flex-1 overflow-y-auto" aria-label="Mobile">
            <ul className="divide-y divide-bone/10 border-b border-bone/10">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.04, ease: EASE_OUT }}
                >
                  <Link to={link.to} className="flex items-center justify-between py-5">
                    <span className="display text-[34px]">{link.label}</span>
                    <ArrowRight className="size-5 text-ash" aria-hidden />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="page-x space-y-1 border-t border-bone/10 py-6 text-[15px]">
            <a href={BRAND.emailHref} className="block text-bone">
              {BRAND.email}
            </a>
            <a href={BRAND.phoneHref} className="block text-ash">
              {BRAND.phone}
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
