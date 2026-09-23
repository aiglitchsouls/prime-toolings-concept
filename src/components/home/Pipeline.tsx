import { useRef, useState } from 'react'

import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'

import { EngineCanvas } from '@/components/three/EngineCanvas'
import { Photo } from '@/components/ui/Photo'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SERVICES } from '@/data/services'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { EngineScene } from '@/three/EngineScene'
import { pipelineTargets, stageOf } from '@/three/targets'

import { PipelineCallouts } from './PipelineCallouts'

const pipelineFraming = (width: number) => {
  if (width >= 1024) return { x: 0.2, y: -0.02, distance: 14, explodeZoom: 0.08 }
  // Below lg the heading and stage copy stack at the bottom, so the engine takes the upper half.
  if (width >= 768) return { x: 0.12, y: 0.2, distance: 24, explodeZoom: 0.3 }
  return { x: 0, y: 0.2, distance: 23, explodeZoom: 0.3 }
}

function StageSegment({ index, label, progress, isActive }: { index: number; label: string; progress: MotionValue<number>; isActive: boolean }) {
  const fill = useTransform(progress, [index / 4, (index + 1) / 4], [0, 1], { clamp: true })
  return (
    <li className="flex-1">
      <div className="h-px w-full bg-bone/15">
        <motion.div className="h-px origin-left bg-ignition" style={{ scaleX: fill }} />
      </div>
      <p className={cn('eyebrow mt-3 text-[11px] transition-colors', isActive ? 'text-bone' : 'text-dim')}>
        <span className="text-ignition">0{index + 1}</span> <span className="hidden sm:inline">{label}</span>
      </p>
    </li>
  )
}

function StageCopy({ stage }: { stage: number }) {
  const service = SERVICES[stage]
  return (
    <div aria-live="polite" className="min-h-[230px] max-w-md lg:min-h-[250px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <p className="eyebrow text-ignition">
            {service.code} / 04 · {service.stage}
          </p>
          <h3 className="display-soft mt-4 text-[clamp(28px,3vw,42px)] text-bone">{service.title}</h3>
          <p className="mt-4 text-ash">{service.lead}</p>
          <ul className="mt-5 space-y-2 text-[15px] text-bone/85">
            {service.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-[0.7em] h-px w-3 shrink-0 bg-ignition" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Scroll-scrubbed lifecycle of one engine: CAD → CFD → exploded assembly → static fire. */
export function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<EngineScene | null>(null)
  const [stage, setStage] = useState(0)
  const isInView = useInView(sectionRef)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    sceneRef.current?.setTargets(pipelineTargets(progress))
    setStage(stageOf(progress))
  })

  const onReady = (scene: EngineScene | null) => {
    sceneRef.current = scene
    scene?.snap(pipelineTargets(scrollYProgress.get()))
  }

  return (
    <section ref={sectionRef} className="relative h-[440vh]" aria-labelledby="pipeline-title">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-void">
        <EngineCanvas
          onReady={onReady}
          framing={pipelineFraming}
          initial={pipelineTargets(0)}
          response={2.4}
          fallback={
            <Photo
              photo="standTeam"
              alt="Engineers integrating an engine on the test stand"
              width={1600}
              height={1000}
              className="absolute inset-0 opacity-60"
            />
          }
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-void/90 via-void/30 to-transparent lg:w-3/5" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void via-void/60 to-transparent lg:h-1/3" />
        <PipelineCallouts sceneRef={sceneRef} isActive={isInView} />

        <div className="page-x pointer-events-none relative z-content flex h-full flex-col justify-end gap-6 pb-8 pt-[calc(var(--nav-h)+1.5rem)] sm:pb-10 lg:justify-between lg:gap-0">
          <header>
            <SectionLabel>
              In-house, end to end
            </SectionLabel>
            <h2 id="pipeline-title" className="display mt-5 text-[clamp(28px,4.4vw,68px)] lg:mt-6">
              One roof.
              <br />
              Sketch to <span className="italic text-ignition">static fire.</span>
            </h2>
          </header>
          <div className="space-y-8">
            <StageCopy stage={stage} />
            <ol className="flex gap-3 sm:gap-6" aria-label="Pipeline stages">
              {SERVICES.map((service, i) => (
                <StageSegment key={service.id} index={i} label={service.stage} progress={scrollYProgress} isActive={i === stage} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
