import { useEffect, useRef, useState, type ReactNode } from 'react'

import { prefersReducedMotion, renderQuality } from '@/lib/device'
import { cn } from '@/lib/utils'
import type { EngineScene, Framing } from '@/three/EngineScene'
import type { EngineTargets } from '@/three/targets'

interface EngineCanvasProps {
  /** Receives the scene once it exists, and null on teardown. */
  onReady?: (scene: EngineScene | null) => void
  /** Responsive framing, recomputed on every resize from the canvas width. */
  framing: (width: number) => Partial<Framing>
  /** Starting state, applied without easing. */
  initial?: Partial<EngineTargets>
  isInteractive?: boolean
  response?: number
  fallback: ReactNode
  className?: string
}

function bindPointer(wrap: HTMLElement, scene: EngineScene) {
  let lastX = 0
  let pointerId = -1
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') {
      const rect = wrap.getBoundingClientRect()
      scene.setPointer(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1)
    }
    if (event.pointerId !== pointerId) return
    scene.drag(event.clientX - lastX)
    lastX = event.clientX
  }
  const onDown = (event: PointerEvent) => {
    if (event.target !== wrap && !(event.target instanceof HTMLCanvasElement)) return
    pointerId = event.pointerId
    lastX = event.clientX
    scene.beginDrag()
    wrap.dataset.dragging = 'true'
  }
  const onUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return
    pointerId = -1
    scene.endDrag()
    wrap.dataset.dragging = 'false'
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  wrap.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
  return () => {
    window.removeEventListener('pointermove', onMove)
    wrap.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
  }
}

function watchVisibility(wrap: HTMLElement, scene: EngineScene) {
  let isOnScreen = false
  const sync = () => scene.setActive(isOnScreen && !document.hidden)
  const observer = new IntersectionObserver(
    ([entry]) => {
      isOnScreen = entry.isIntersecting
      sync()
    },
    { rootMargin: '120px 0px' },
  )
  observer.observe(wrap)
  document.addEventListener('visibilitychange', sync)
  return () => {
    observer.disconnect()
    document.removeEventListener('visibilitychange', sync)
  }
}

/** Dev only: `window.__engines` lets the console drive scenes while tuning. */
function exposeForDebug(scene: EngineScene, cleanups: Array<() => void>) {
  const registry = ((window as unknown as { __engines?: EngineScene[] }).__engines ??= [])
  registry.push(scene)
  cleanups.push(() => registry.splice(registry.indexOf(scene), 1))
}

/** Lazy-loads three.js, owns the WebGL lifecycle and pauses rendering off-screen. */
export function EngineCanvas(props: EngineCanvasProps) {
  const { fallback, className, isInteractive } = props
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const propsRef = useRef(props)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    propsRef.current = props
  })

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    let scene: EngineScene | null = null
    let isCancelled = false
    const cleanups: Array<() => void> = []

    import('@/three/EngineScene')
      .then(({ EngineScene }) => {
        if (isCancelled) return
        const { initial, response } = propsRef.current
        scene = new EngineScene(canvas, { quality: renderQuality(), reducedMotion: prefersReducedMotion(), response })
        const live = scene
        if (initial) live.snap(initial)
        const resize = () => {
          const rect = wrap.getBoundingClientRect()
          live.setFraming(propsRef.current.framing(rect.width))
          live.setSize(rect.width, rect.height)
        }
        resize()
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(wrap)
        cleanups.push(() => resizeObserver.disconnect(), watchVisibility(wrap, live))
        if (propsRef.current.isInteractive) cleanups.push(bindPointer(wrap, live))
        setStatus('ready')
        propsRef.current.onReady?.(live)
        if (import.meta.env.DEV) exposeForDebug(live, cleanups)
      })
      .catch(() => {
        if (!isCancelled) setStatus('failed')
      })

    return () => {
      isCancelled = true
      cleanups.forEach((cleanup) => cleanup())
      propsRef.current.onReady?.(null)
      scene?.dispose()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={cn('absolute inset-0', isInteractive && 'touch-pan-y data-[dragging=true]:cursor-grabbing', className)}
    >
      <canvas
        ref={canvasRef}
        className={cn('block h-full w-full transition-opacity duration-1000', status === 'ready' ? 'opacity-100' : 'opacity-0')}
        aria-hidden
      />
      {status === 'failed' ? fallback : null}
    </div>
  )
}
