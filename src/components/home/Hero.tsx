import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EngineCanvas } from '@/components/three/EngineCanvas'
import { ConceptBadge } from '@/components/ui/Badges'
import { Photo } from '@/components/ui/Photo'
import { SplitHeading } from '@/components/ui/SplitHeading'
import { Units } from '@/components/ui/Units'
import { BRAND } from '@/config/brand'
import { SIM_ENGINE } from '@/data/simulated'
import { EASE_OUT } from '@/lib/motion'
import { useBooted } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { EngineScene } from '@/three/EngineScene'

import { IgnitionButton } from './IgnitionButton'
import { Telemetry } from './Telemetry'
import { useIgnition } from './useIgnition'

const heroFraming = (width: number) => {
  if (width >= 1024) return { x: 0.25, y: -0.03, distance: 13.6 }
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

function fadeIn(isPlaying: boolean, delay: number) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: isPlaying ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1, delay, ease: EASE_OUT },
  }
}

export function Hero() {
  const sceneRef = useRef<EngineScene | null>(null)
  const [isReady, setReady] = useState(false)
  const isBooted = useBooted()
  const { phase, burn, press, release, startedAt } = useIgnition(sceneRef)

  const onReady = (scene: EngineScene | null) => {
    sceneRef.current = scene
    setReady(Boolean(scene))
  }

  // Materialise from wireframe once the boot screen clears.
  useEffect(() => {
    if (isBooted && isReady) sceneRef.current?.setTargets({ dissolve: 0, wire: 0 })
  }, [isBooted, isReady])

  return (
    <section className="relative h-[100svh] min-h-[680px] overflow-hidden bg-void" aria-labelledby="hero-title">
      <EngineCanvas
        onReady={onReady}
        framing={heroFraming}
        initial={{ dissolve: 1, wire: 1 }}
        isInteractive
        fallback={<Fallback />}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_30%,rgba(5,6,8,0.75)_85%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-void via-void/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-void/80 to-transparent lg:w-1/2" />

      <div className="page-x pointer-events-none relative z-content flex h-full flex-col justify-end pb-10 pt-[calc(var(--nav-h)+2rem)] sm:pb-14 lg:justify-center lg:pb-0">
        <motion.p className="mono mb-6 text-[10px] text-ash sm:text-[11px]" {...fadeIn(isBooted, 0.1)}>
          <span className="text-ignition">●</span> {BRAND.tagline} · {BRAND.city} · Est. {BRAND.founded}
        </motion.p>
        <SplitHeading
          as="h1"
          id="hero-title"
          lines={['Every kind', 'of *thrust.*']}
          isPlaying={isBooted}
          delay={0.15}
          className="display text-[clamp(40px,7.6vw,124px)] lg:max-w-[11ch]"
        />
        <motion.p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-ash sm:text-lg" {...fadeIn(isBooted, 0.45)}>
          Solid, liquid, hybrid, air-breathing and rotating-detonation propulsion. Designed, machined and static-fired
          in-house across {BRAND.facilities} facilities in {BRAND.city}.
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...fadeIn(isBooted, 0.6)}>
          <IgnitionButton phase={phase} isReady={isReady} onPress={press} onRelease={release} />
          <Link to="/products" className="btn-line pointer-events-auto min-h-[60px]" data-cursor="Catalogue">
            Explore the catalogue <ArrowRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
        <motion.p id="ignite-help" className="mono mt-4 text-[10px] text-dim" {...fadeIn(isBooted, 0.7)}>
          Static fire simulation · hold the button or Space · drag the engine to rotate
        </motion.p>
      </div>

      <motion.div
        className="absolute right-5 top-[calc(var(--nav-h)+1.25rem)] z-content hidden bg-void/50 p-3 text-right backdrop-blur-md sm:block lg:right-12"
        {...fadeIn(isBooted, 0.8)}
      >
        <ConceptBadge>Simulated static fire</ConceptBadge>
        <p className="mono mt-3 text-[10px] text-ash">{SIM_ENGINE.label}</p>
        <p className="mono text-[10px] text-dim">
          <Units text={`${SIM_ENGINE.propellants} · 500 N – ${SIM_ENGINE.maxThrustKn} kN`} />
        </p>
      </motion.div>

      <motion.div
        className="absolute left-5 top-[calc(var(--nav-h)+1rem)] z-content sm:left-8 lg:bottom-10 lg:left-auto lg:right-12 lg:top-auto"
        {...fadeIn(isBooted, 0.9)}
      >
        {/* Phones only show the readout while the engine is lit; at rest it would cover the intro copy. */}
        <div
          className={cn(
            'transition-opacity duration-500',
            phase === 'safe' && 'max-sm:pointer-events-none max-sm:opacity-0',
          )}
        >
          <Telemetry sceneRef={sceneRef} startedAt={startedAt} phase={phase} burn={burn} />
        </div>
      </motion.div>

      <div className="absolute bottom-5 left-1/2 z-content hidden -translate-x-1/2 lg:block">
        <span className="mono flex flex-col items-center gap-2 text-[9px] text-dim">
          Scroll
          <ArrowDown className="size-3 animate-bounce" aria-hidden />
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        {ANNOUNCE[phase]}
      </p>
    </section>
  )
}
