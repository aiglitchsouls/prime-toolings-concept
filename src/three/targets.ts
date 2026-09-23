// Animated scene state. React writes targets; the render loop eases `current` toward them.

export interface EngineTargets {
  throttle: number
  dissolve: number
  thermal: number
  explode: number
  wire: number
  flow: number
  grid: number
  hud: number
  spin: number
}

export type EngineKey = keyof EngineTargets

export const IDLE_TARGETS: EngineTargets = {
  throttle: 0,
  dissolve: 0,
  thermal: 0,
  explode: 0,
  wire: 0,
  flow: 0,
  grid: 0,
  hud: 1,
  spin: 1,
}

// Per-second response rates for exponential easing.
const RATES: EngineTargets = {
  throttle: 3.2,
  dissolve: 1.35,
  thermal: 3,
  explode: 3.2,
  wire: 2.2,
  flow: 3,
  grid: 3,
  hud: 2.5,
  spin: 2,
}

const KEYS = Object.keys(RATES) as EngineKey[]

export function stepTargets(current: EngineTargets, target: EngineTargets, dt: number, response: number) {
  for (const key of KEYS) {
    const falling = key === 'throttle' && target.throttle < current.throttle
    const rate = RATES[key] * response * (falling ? 1.9 : 1)
    current[key] += (target[key] - current[key]) * (1 - Math.exp(-rate * dt))
  }
}

const smooth = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

/** Rise between a0→a1, fall between b0→b1. */
const band = (a0: number, a1: number, b0: number, b1: number, x: number) => smooth(a0, a1, x) * (1 - smooth(b0, b1, x))

/**
 * Pipeline choreography across four scroll stages:
 * CAD wireframe → CFD false colour → exploded assembly → static fire.
 */
export function pipelineTargets(p: number): EngineTargets {
  return {
    dissolve: 1 - smooth(0.2, 0.36, p),
    wire: 1 - smooth(0.3, 0.42, p) + 0.35 * band(0.52, 0.58, 0.7, 0.76, p),
    grid: 1 - smooth(0.34, 0.46, p),
    thermal: band(0.27, 0.35, 0.5, 0.56, p),
    flow: band(0.3, 0.38, 0.5, 0.55, p),
    explode: band(0.54, 0.63, 0.68, 0.76, p),
    throttle: smooth(0.8, 0.88, p),
    hud: 0.6,
    spin: 0.6,
  }
}

export function stageOf(p: number) {
  return Math.min(3, Math.floor(p * 4))
}
