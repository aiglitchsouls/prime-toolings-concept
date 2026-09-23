import { useRef, useState } from 'react'

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { Wordmark } from '@/components/ui/Wordmark'
import { NAV_LINKS } from '@/config/brand'
import { EASE_OUT } from '@/lib/motion'
import { menuStore, useMenuOpen } from '@/lib/store'
import { cn } from '@/lib/utils'

function useNavState() {
  const { scrollY } = useScroll()
  const [isSolid, setSolid] = useState(false)
  const [isHidden, setHidden] = useState(false)
  const last = useRef(0)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - last.current
    last.current = y
    setSolid(y > 24)
    if (y <= 480) setHidden(false)
    else if (delta > 4) setHidden(true)
    else if (delta < -4) setHidden(false)
  })
  return { isSolid, isHidden }
}

/** The company's headline milestone, the way category leaders run news above the nav. */
function AnnouncementBar() {
  return (
    <Link
      to="/products?system=aerospike-engines"
      className="group flex h-[var(--bar-h)] items-center justify-center gap-3 bg-ignition px-5 text-[13px] font-semibold text-void"
    >
      <span className="truncate">India’s first liquid-fuel aerospike engine, tested in Bengaluru</span>
      <span className="grid size-6 shrink-0 place-items-center rounded-full border border-void/40 transition-colors group-hover:bg-void group-hover:text-ignition">
        <ArrowRight className="size-3" aria-hidden />
      </span>
    </Link>
  )
}

function MenuButton({ isOpen }: { isOpen: boolean }) {
  return (
    <button
      type="button"
      className="flex h-full w-[72px] cursor-pointer flex-col items-center justify-center gap-[7px] border-l border-bone/10 lg:hidden"
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={() => menuStore.set(!isOpen)}
    >
      <span className={cn('h-px w-6 bg-bone transition-transform duration-300', isOpen && 'translate-y-[4px] rotate-45')} />
      <span className={cn('h-px w-6 bg-bone transition-transform duration-300', isOpen && '-translate-y-[4px] -rotate-45')} />
    </button>
  )
}

export function Nav() {
  const { isSolid, isHidden } = useNavState()
  const isMenuOpen = useMenuOpen()

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-nav"
      animate={{ y: isHidden && !isMenuOpen ? '-100%' : '0%' }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <AnnouncementBar />
      <div
        className={cn(
          'border-b border-bone/10 transition-colors duration-500',
          isSolid || isMenuOpen ? 'bg-void/90 backdrop-blur-xl' : 'bg-gradient-to-b from-void/70 to-transparent',
        )}
      >
        <nav className="mx-auto flex h-[72px] max-w-page items-stretch" aria-label="Primary">
          <Link to="/" className="flex items-center border-r border-bone/10 px-5 sm:px-8 lg:px-10" aria-label="Prime Toolings, home">
            <Wordmark />
          </Link>

          <ul className="hidden flex-1 items-stretch lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to} className="flex">
                <NavLink
                  to={link.to}
                  className="relative flex items-center px-6 text-[14px] font-medium text-ash transition-colors hover:text-bone aria-[current=page]:text-bone"
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive ? (
                        <motion.span layoutId="nav-active" className="absolute inset-x-6 bottom-0 h-[2px] bg-ignition" />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-stretch">
            <Link
              to="/contact"
              className="hidden items-center gap-3 border-l border-bone/10 px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:bg-ignition hover:text-void sm:flex"
            >
              Contact <ArrowRight className="size-4" aria-hidden />
            </Link>
            <MenuButton isOpen={isMenuOpen} />
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
