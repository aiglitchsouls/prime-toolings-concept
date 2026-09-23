import { useEffect, useRef, type RefObject } from 'react'

import type { PartId } from '@/three/engine/buildEngine'
import type { EngineScene } from '@/three/EngineScene'

const PART_LABELS: Record<PartId, string> = {
  head: 'Injector head',
  manifold: 'Propellant manifold',
  chamber: 'Combustion chamber',
  flange: 'Thrust flange · 16 bolts',
  cowl: 'Throat cowl',
  spike: 'Aerospike plug',
}

const ORDER = Object.keys(PART_LABELS) as PartId[]
const LABEL_ROOM = 300
// Leader length past the outermost anchor, so every label clears the flange ring.
const LEADER = 88
const COPY_ZONE = 360
const COPY_ZONE_NARROW = 470

/**
 * DOM callouts pinned to projected 3D anchors. Visible while the scene shows the
 * CAD wireframe or the exploded assembly; positions update every frame without React.
 */
export function PipelineCallouts({ sceneRef, isActive }: { sceneRef: RefObject<EngineScene | null>; isActive: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (!isActive) return
    let frame = 0
    const loop = () => {
      frame = requestAnimationFrame(loop)
      const scene = sceneRef.current
      const layer = layerRef.current
      if (!scene || !layer) return
      const { wire, explode, dissolve } = scene.current
      const visibility = Math.min(1, Math.max(wire * (1 - dissolve * 0.2), explode) * 1.2)
      layer.style.opacity = visibility.toFixed(3)
      if (visibility < 0.01) return
      const width = layer.clientWidth
      const height = layer.clientHeight
      const anchors = scene.projectAnchors().map((anchor) => ({
        ...anchor,
        // Hang labels off the part's left edge when they would run off the right side of the screen.
        side: anchor.x + LABEL_ROOM > width ? ('left' as const) : ('right' as const),
      }))
      // Labels line up in one column per side, like callouts on a drawing sheet.
      const columnRight = Math.max(...anchors.filter((anchor) => anchor.side === 'right').map((anchor) => anchor.x))
      const columnLeft = Math.min(...anchors.filter((anchor) => anchor.side === 'left').map((anchor) => anchor.xLeft))
      anchors.forEach((anchor) => {
        const item = itemRefs.current[ORDER.indexOf(anchor.id)]
        if (!item) return
        const { side } = anchor
        const x = side === 'left' ? anchor.xLeft : anchor.x
        const reach = LEADER + (side === 'left' ? anchor.xLeft - columnLeft : columnRight - anchor.x)
        item.style.transform = `translate3d(${x.toFixed(1)}px, ${anchor.y.toFixed(1)}px, 0)`
        item.style.setProperty('--reach', `${reach.toFixed(1)}px`)
        if (item.dataset.side !== side) item.dataset.side = side
        // Labels that would sit over the stage copy are dropped: on narrow screens the copy spans the
        // whole bottom band, on wide screens only the lower-left corner.
        const isNarrow = width < 1024
        const inCopyZone = anchor.y > height - (isNarrow ? COPY_ZONE_NARROW : COPY_ZONE)
        item.style.opacity = inCopyZone && (isNarrow || side === 'left') ? '0' : '1'
      })
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [isActive, sceneRef])

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 hidden opacity-0 md:block" aria-hidden>
      {ORDER.map((id, i) => (
        <div
          key={id}
          ref={(node) => {
            itemRefs.current[i] = node
          }}
          data-side="right"
          className="group/callout absolute left-0 top-0 will-change-transform"
        >
          <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full border border-ignition bg-void" />
          <span className="absolute left-1 top-0 h-px w-[var(--reach,64px)] bg-bone/40 group-data-[side=left]/callout:left-auto group-data-[side=left]/callout:right-1" />
          <span
            className="mono absolute left-[calc(var(--reach,64px)+8px)] top-[-7px] whitespace-nowrap text-[10px] text-bone
              group-data-[side=left]/callout:left-auto group-data-[side=left]/callout:right-[calc(var(--reach,64px)+8px)]"
          >
            <span className="text-ignition">{String(i + 1).padStart(2, '0')}</span> {PART_LABELS[id]}
          </span>
        </div>
      ))}
    </div>
  )
}
