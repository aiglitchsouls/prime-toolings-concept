import { useEffect, useRef, useState } from 'react'

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { Scramble } from '@/components/ui/Scramble'
import { SoundToggle } from '@/components/ui/SoundToggle'
import { Wordmark } from '@/components/ui/Wordmark'
import { NAV_LINKS } from '@/config/brand'
import { menuStore, useMenuOpen } from '@/lib/store'
import { cn } from '@/lib/utils'

const IST = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })

function IstClock() {
  const [time, setTime] = useState(() => IST.format(new Date()))
  useEffect(() => {
    const id = window.setInterval(() => setTime(IST.format(new Date())), 15_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="mono hidden text-[10px] text-ash xl:inline">
      BLR <span className="text-bone">{time}</span> IST
    </span>
  )
}

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

export function Nav() {
  const { isSolid, isHidden } = useNavState()
  const isMenuOpen = useMenuOpen()
  const { pathname } = useLocation()

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-nav transition-[background-color,border-color,backdrop-filter] duration-500',
        isSolid ? 'border-b border-bone/[0.08] bg-void/70 backdrop-blur-xl' : 'border-b border-transparent',
      )}
      animate={{ y: isHidden && !isMenuOpen ? '-100%' : '0%' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="page-x flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Primary">
        <Link to="/" className="relative z-[1] -m-2 p-2" aria-label="Prime Toolings, home" data-cursor="Home">
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className="group relative flex min-h-[44px] items-center gap-2 px-3 text-[14px] text-ash transition-colors hover:text-bone aria-[current=page]:text-bone"
              >
                <span className="mono text-[9px] text-dim group-hover:text-ignition">{link.code}</span>
                <Scramble text={link.label} replayOnHover />
                {pathname.startsWith(link.to) ? (
                  <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-px h-px bg-ignition" />
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-4">
          <IstClock />
          <SoundToggle className="hidden sm:inline-flex" />
          <Link to="/contact" className="btn-ignite hidden min-h-[44px] px-5 text-[14px] sm:inline-flex" data-cursor="Open channel">
            Contact
          </Link>
          <button
            type="button"
            className="relative z-[1] flex size-11 cursor-pointer flex-col items-center justify-center gap-[7px] lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => menuStore.set(!isMenuOpen)}
          >
            <span
              className={cn('h-px w-6 bg-bone transition-transform duration-300', isMenuOpen && 'translate-y-[4px] rotate-45')}
            />
            <span
              className={cn('h-px w-6 bg-bone transition-transform duration-300', isMenuOpen && '-translate-y-[4px] -rotate-45')}
            />
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
