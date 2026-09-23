import * as THREE from 'three'

// Revolved profiles for the annular aerospike, in engine units (1 unit ≈ 10 cm).
// Walk each profile so the outside of the part sits to the right of the direction of travel:
// LatheGeometry derives normals and winding from that order.

type Profile = THREE.Vector2[]

const v = (x: number, y: number) => new THREE.Vector2(x, y)

export const SPIKE_TIP_Y = -2.3
export const THROAT_Y = 0.02
const SPIKE_BASE_R = 0.43
const SPIKE_TIP_R = 0.035

/** Radius of the plug contour at height y: concave, like a truncated aerospike. */
export function spikeRadius(y: number) {
  const s = THREE.MathUtils.clamp((y - SPIKE_TIP_Y) / (THROAT_Y - SPIKE_TIP_Y), 0, 1)
  return SPIKE_TIP_R + (SPIKE_BASE_R - SPIKE_TIP_R) * Math.pow(s, 1.3)
}

export function spikeProfile(steps = 32): Profile {
  const points: Profile = [v(0, SPIKE_TIP_Y), v(SPIKE_TIP_R, SPIKE_TIP_Y)]
  for (let i = 1; i <= steps; i++) {
    const y = SPIKE_TIP_Y + ((THROAT_Y - SPIKE_TIP_Y) * i) / steps
    points.push(v(spikeRadius(y), y))
  }
  points.push(v(SPIKE_BASE_R, 0.34))
  return points
}

// Throat cowl: inner wall down to the lip, then back up the outside.
export const COWL: Profile = [
  v(0.505, 0.17),
  v(0.505, 0.045),
  v(0.52, 0.014),
  v(0.56, 0.008),
  v(0.6, 0.03),
  v(0.622, 0.1),
  v(0.622, 0.17),
]

export const FLANGE: Profile = [
  v(0.5, 0.16),
  v(0.77, 0.16),
  v(0.79, 0.18),
  v(0.79, 0.28),
  v(0.77, 0.3),
  v(0.6, 0.3),
]

/** Chamber barrel with machined cooling ribs. */
export function chamberProfile(ribs = 6): Profile {
  const points: Profile = [v(0.6, 0.3), v(0.62, 0.32)]
  const start = 0.4
  const pitch = 0.95 / ribs
  for (let i = 0; i < ribs; i++) {
    const y = start + i * pitch
    points.push(v(0.62, y), v(0.648, y + 0.018), v(0.648, y + 0.07), v(0.62, y + 0.088))
  }
  points.push(v(0.62, 1.38), v(0.64, 1.4))
  return points
}

export const DOME: Profile = [
  v(0.64, 1.4),
  v(0.665, 1.42),
  v(0.665, 1.52),
  v(0.63, 1.63),
  v(0.56, 1.76),
  v(0.45, 1.87),
  v(0.31, 1.95),
  v(0.16, 1.995),
  v(0.0, 2.01),
]

export const PORT: Profile = [v(0.16, 1.99), v(0.16, 2.06), v(0.12, 2.08), v(0.12, 2.3), v(0.0, 2.3)]

export const PART_ANCHORS = {
  head: { r: 0.5, y: 1.84 },
  manifold: { r: 0.78, y: 1.47 },
  chamber: { r: 0.66, y: 0.92 },
  flange: { r: 0.8, y: 0.23 },
  cowl: { r: 0.63, y: 0.06 },
  spike: { r: 0.22, y: -1.0 },
} as const
