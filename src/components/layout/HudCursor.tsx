import { useEffect, useRef } from 'react'

import { pad } from '@/lib/format'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

/** Targeting-reticle cursor with live screen coordinates. Fine pointers only. */
export function HudCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const coordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches
    const isCalm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    if (!isFine || isCalm || !root || !ring || !dot) return

    document.documentElement.classList.add('hud-cursor')
    let x = -200
    let y = -200
    let rx = x
    let ry = y
    let frame = 0

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x = event.clientX
      y = event.clientY
      root.dataset.visible = 'true'
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null
      root.dataset.active = target ? 'true' : 'false'
      if (labelRef.current) labelRef.current.textContent = target?.getAttribute('data-cursor') ?? ''
    }
    const onDown = () => (root.dataset.pressed = 'true')
    const onUp = () => (root.dataset.pressed = 'false')
    const onLeave = () => (root.dataset.visible = 'false')

    const loop = () => {
      rx += (x - rx) * 0.22
      ry += (y - ry) * 0.22
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      if (coordRef.current) coordRef.current.textContent = `${pad(Math.round(x), 4)}·${pad(Math.round(y), 4)}`
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('hud-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-visible="false"
      className="group/cursor pointer-events-none fixed inset-0 z-cursor opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100"
    >
      <div ref={ringRef} className="absolute left-0 top-0">
        <div
          className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone/50 transition-[width,height,border-color,transform] duration-300 ease-out
            group-data-[active=true]/cursor:size-14 group-data-[active=true]/cursor:rotate-45 group-data-[active=true]/cursor:border-ignition
            group-data-[pressed=true]/cursor:scale-75"
        >
          <span className="absolute -top-[5px] left-1/2 h-[7px] w-px -translate-x-1/2 bg-bone/70" />
          <span className="absolute -bottom-[5px] left-1/2 h-[7px] w-px -translate-x-1/2 bg-bone/70" />
          <span className="absolute -left-[5px] top-1/2 h-px w-[7px] -translate-y-1/2 bg-bone/70" />
          <span className="absolute -right-[5px] top-1/2 h-px w-[7px] -translate-y-1/2 bg-bone/70" />
        </div>
        <span className="mono absolute left-6 top-5 whitespace-nowrap text-[9px] text-dim">
          <span ref={labelRef} className="mr-2 text-ignition" />
          <span ref={coordRef} />
        </span>
      </div>
      <div ref={dotRef} className="absolute left-0 top-0">
        <span className="absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ignition" />
      </div>
    </div>
  )
}
