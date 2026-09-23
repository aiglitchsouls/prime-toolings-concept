import { useEffect } from 'react'

import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'

import { lenisRef, menuStore } from '@/lib/store'

const NAV_OFFSET = -88

export function SmoothScroll() {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: NAV_OFFSET } })
    lenisRef.set(lenis)
    if (import.meta.env.DEV) (window as unknown as { __lenis?: Lenis }).__lenis = lenis
    const unsubscribe = menuStore.subscribe(() => (menuStore.get() ? lenis.stop() : lenis.start()))
    return () => {
      unsubscribe()
      lenis.destroy()
      lenisRef.set(null)
    }
  }, [shouldReduceMotion])

  return null
}

function scrollToTarget(target: HTMLElement | number) {
  const lenis = lenisRef.get()
  if (lenis) {
    lenis.scrollTo(target, { immediate: true, force: true, offset: typeof target === 'number' ? 0 : NAV_OFFSET })
    return
  }
  if (typeof target === 'number') window.scrollTo(0, target)
  else target.scrollIntoView()
}

/** Resets scroll on navigation, or lands on #hash once the (lazy) page has rendered. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      scrollToTarget(0)
      return
    }
    let frame = 0
    let tries = 0
    const seek = () => {
      const element = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (element) scrollToTarget(element)
      else if (tries++ < 40) frame = requestAnimationFrame(seek)
    }
    seek()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
