import type { Range } from '@/data/products'

function trim(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export function formatForce(newtons: number) {
  if (newtons >= 1000) return `${trim(newtons / 1000)} kN`
  return `${Math.round(newtons)} N`
}

export function formatForceRange(range: Range) {
  return `${formatForce(range.min)} – ${formatForce(range.max)}`
}

export function formatHzRange(range: Range) {
  return `${range.min} – ${range.max} Hz`
}

// Log scale for the thrust dial: the catalogue spans two decades (500 N → 50 kN).
export const DIAL_MIN = 300
export const DIAL_MAX = 60_000
const LOG_MIN = Math.log10(DIAL_MIN)
const LOG_SPAN = Math.log10(DIAL_MAX) - LOG_MIN

export const toDial = (newtons: number) => (Math.log10(newtons) - LOG_MIN) / LOG_SPAN
export const fromDial = (t: number) => Math.pow(10, LOG_MIN + t * LOG_SPAN)

/** Nice round values for the dial readout: 3 significant figures below 10 kN, 2 above. */
export function roundThrust(newtons: number) {
  const step = newtons >= 10_000 ? 1000 : newtons >= 1000 ? 100 : 10
  return Math.round(newtons / step) * step
}

export const pad = (value: number, length = 2) => String(value).padStart(length, '0')
