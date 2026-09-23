import { useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

import { EngineCanvas } from '@/components/three/EngineCanvas'
import { Photo } from '@/components/ui/Photo'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { BRAND } from '@/config/brand'
import { EASE_OUT } from '@/lib/motion'
import type { EngineScene } from '@/three/EngineScene'

import { IgnitionButton } from './IgnitionButton'
import { Telemetry } from './Telemetry'
import { useAutoFire } from './useAutoFire'
import { useIgnition } from './useIgnition'

const heroFraming = (width: number) => {
  if (width >= 1024) return { x: 0.24, y: -0.04, distance: 12.6 }
  if (width >= 640) return { x: 0.2, y: 0.14, distance: 15 }
  // Phones: lift the engine into the open space under the nav, clear of the copy.
  return { x: 0.08, y: 0.27, distance: 21 }
}

const ANNOUNCE: Record<string, string> = {
  ignition: 'Igniter lit.',
  mainstage: 'Mainstage. Engine at full thrust.',
  shutdown: 'Engine shut down.',
  safe: '',
}

function Fallback() {
  return (
    <Photo
      photo="nightFire"
      alt="Prime Toolings engine firing at night"
      width={1600}
      height={1000}
      isEager
      className="absolute inset-0 opacity-70"
    />
  )
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease: EASE_OUT },
})

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<EngineScene | null>(null)
  const [isReady, setReady] = useState(false)
  const isInView = useInView(sectionRef, { amount: 0.4 })
  const { phase, burn, press, release, startedAt } = useIgnition(sceneRef)
  const { isManual, manualPress, manualRelease, setVisible } = useAutoFire({ isEnabled: isReady, press, release })
  const isLit = phase !== 'safe'

  const onReady = (scene: EngineScene | null) => {
    sceneRef.current = scene
    setReady(Boolean(scene))
  }

  // Materialise from wireframe as soon as the scene exists.
  useEffect(() => {
    if (isReady) sceneRef.current?.setTargets({ dissolve: 0, wire: 0, hud: 0 })
  }, [isReady])

  useEffect(() => setVisible(isInView), [isInView, setVisible])

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[700px] overflow-hidden bg-void" aria-labelledby="hero-title">
      <EngineCanvas
        onReady={onReady}
        framing={heroFraming}
        initial={{ dissolve: 1, wire: 1 }}
        isInteractive
        fallback={<Fallback />}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-void via-void/60 to-transparent lg:w-3/5" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent" />

      <div className="page-x pointer-events-none relative z-content flex h-full flex-col justify-end pb-12 pt-[var(--nav-h)] sm:pb-16 lg:pb-20">
        <motion.p className="eyebrow mb-7 text-ash" {...rise(0.2)}>
          Aeropropulsion &amp; defense · {BRAND.city}
        </motion.p>
        <SplitHeading
          as="h1"
          id="hero-title"
          lines={['Every kind', 'of *thrust.*']}
          isPlaying
          delay={0.3}
          className="display text-[clamp(48px,7.4vw,124px)]"
        />
        <motion.p className="mt-8 max-w-[30rem] text-[17px] leading-relaxed text-ash sm:text-lg" {...rise(0.6)}>
          Solid, liquid, hybrid, detonation and air-breathing propulsion, designed, machined and static-fired in-house.
          Precision manufacturing since {BRAND.founded}.
        </motion.p>
        <motion.div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6" {...rise(0.8)}>
          <Link to="/products" className="btn-ignite pointer-events-auto">
            Explore propulsion
          </Link>
          <IgnitionButton
            phase={phase}
            isReady={isReady}
            isManual={isManual}
            onPress={manualPress}
            onRelease={manualRelease}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {isLit ? (
          <motion.div
            className="absolute right-5 top-[calc(var(--nav-h)+1rem)] z-content sm:right-8 lg:bottom-20 lg:right-14 lg:top-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.6, delay: 1.2 } }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <Telemetry sceneRef={sceneRef} startedAt={startedAt} phase={phase} burn={burn} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="sr-only" aria-live="polite">
        {ANNOUNCE[phase]}
      </p>
    </section>
  )
}
