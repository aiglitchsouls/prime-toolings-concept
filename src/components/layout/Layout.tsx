import { Suspense } from 'react'

import { MotionConfig } from 'framer-motion'
import { Outlet } from 'react-router-dom'

import { Boot } from './Boot'
import { Curtain } from './Curtain'
import { Footer } from './Footer'
import { HudCursor } from './HudCursor'
import { MobileMenu } from './MobileMenu'
import { Nav } from './Nav'
import { Rangefinder } from './Rangefinder'
import { ScrollManager, SmoothScroll } from './ScrollManager'

function PageFallback() {
  return <div className="min-h-[100svh]" aria-busy="true" />
}

export function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollManager />
      <div className="relative min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-boot focus:bg-bone
            focus:px-4 focus:py-2 focus:text-void"
        >
          Skip to content
        </a>
        <Nav />
        <MobileMenu />
        <main id="main" className="relative">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <Rangefinder />
      <Curtain />
      <Boot />
      <HudCursor />
      <div className="grain" aria-hidden />
    </MotionConfig>
  )
}
