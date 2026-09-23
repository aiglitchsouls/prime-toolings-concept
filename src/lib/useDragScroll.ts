import { useEffect, type RefObject } from 'react'

/**
 * Mouse drag-to-scroll for a native horizontal scroller. Touch, trackpad and keyboard
 * keep their native behaviour; clicks that end a drag are swallowed.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let startX = 0
    let startLeft = 0
    let isDown = false
    let hasMoved = false

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      isDown = true
      hasMoved = false
      startX = event.clientX
      startLeft = element.scrollLeft
    }
    const onMove = (event: PointerEvent) => {
      if (!isDown) return
      const dx = event.clientX - startX
      if (!hasMoved && Math.abs(dx) > 4) {
        hasMoved = true
        element.setPointerCapture(event.pointerId)
        element.dataset.dragging = 'true'
      }
      if (hasMoved) element.scrollLeft = startLeft - dx
    }
    const onUp = () => {
      isDown = false
      element.dataset.dragging = 'false'
    }
    const onClick = (event: MouseEvent) => {
      if (!hasMoved) return
      event.preventDefault()
      event.stopPropagation()
      hasMoved = false
    }

    element.addEventListener('pointerdown', onDown)
    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerup', onUp)
    element.addEventListener('pointercancel', onUp)
    element.addEventListener('click', onClick, true)
    return () => {
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerup', onUp)
      element.removeEventListener('pointercancel', onUp)
      element.removeEventListener('click', onClick, true)
    }
  }, [ref])
}
