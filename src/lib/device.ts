interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Phones, tablets and low-memory devices get the lighter render path. */
export function renderQuality(): 'high' | 'low' {
  const isCoarse = window.matchMedia('(pointer: coarse)').matches
  const isNarrow = window.innerWidth < 768
  const memory = (navigator as NavigatorWithMemory).deviceMemory
  return isCoarse || isNarrow || (memory !== undefined && memory < 4) ? 'low' : 'high'
}
