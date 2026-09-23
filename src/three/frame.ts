import * as THREE from 'three'
import type { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import type { Annotations } from './engine/annotations'
import type { EngineModel } from './engine/buildEngine'
import type { SharedUniforms } from './engine/materials'
import type { Plume } from './engine/plume'
import type { EngineTargets } from './targets'

// Maps the eased scene state onto uniforms and objects, once per frame.

export interface FrameInput {
  c: EngineTargets
  t: number
  heat: number
  isCalm: boolean
  model: EngineModel
  plume: Plume
  notes: Annotations
  shared: SharedUniforms
  bloom: UnrealBloomPass
  light: THREE.PointLight
}

const LED_ARMED = new THREE.Color('#8fd3ff')
const LED_FIRING = new THREE.Color('#ff4d1a')

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

function flickerAt(t: number, isCalm: boolean) {
  if (isCalm) return 1
  return 0.86 + 0.14 * Math.sin(t * 61) * Math.sin(t * 23 + 1.3)
}

function applyPlume({ c, plume, bloom, light }: FrameInput, flicker: number) {
  const throttle = c.throttle
  plume.group.visible = throttle > 0.002
  plume.throttle.value = throttle * flicker
  plume.shells.scale.set(1, 0.45 + 0.55 * Math.pow(throttle, 0.7), 1)
  plume.flare.material.opacity = Math.min(1, throttle * 1.1) * 0.55 * flicker
  plume.flare.scale.setScalar(0.55 + throttle * 0.55)
  plume.tipFlare.material.opacity = throttle * 0.3 * flicker
  plume.tipFlare.scale.setScalar(0.5 + throttle * 0.6)
  light.intensity = throttle * 14 * flicker
  bloom.strength = 0.28 + throttle * 0.5
}

function applyNotes({ c, t, notes, isCalm }: FrameInput) {
  notes.flow.material.uniforms.uOpacity.value = c.flow
  notes.flow.visible = c.flow > 0.01
  notes.floor.material.uniforms.uOpacity.value = c.grid
  notes.floor.visible = c.grid > 0.01
  const hud = c.hud * (1 - c.explode * 0.6)
  ;(notes.ring.material as THREE.LineBasicMaterial).opacity = 0.2 * hud
  ;(notes.tipRing.material as THREE.LineBasicMaterial).opacity = 0.16 * hud
  ;(notes.axis.material as THREE.LineDashedMaterial).opacity = 0.22 * hud
  if (isCalm) return
  notes.ring.rotation.y = -t * 0.08
  notes.tipRing.rotation.y = t * 0.2
}

function applyModel({ c, t, model, isCalm }: FrameInput) {
  model.wireMaterial.opacity = clamp01(c.wire) * 0.5
  model.wireMaterial.visible = c.wire > 0.01
  const explode = easeInOut(clamp01(c.explode))
  for (const part of model.parts) part.group.position.y = part.travel * explode
  ;(model.led.material as THREE.MeshBasicMaterial).color.copy(c.throttle > 0.04 ? LED_FIRING : LED_ARMED)
  model.led.visible = c.dissolve < 0.5
  model.tag.visible = c.dissolve < 0.4
  const sway = isCalm ? 0 : 1
  model.tag.rotation.z = sway * (Math.sin(t * 1.3) * 0.05 + c.throttle * Math.sin(t * 19) * 0.22)
  model.tag.rotation.x = sway * c.throttle * 0.35 * Math.sin(t * 13)
}

export function applyFrame(input: FrameInput) {
  const { c, t, shared } = input
  shared.uTime.value = t
  shared.uDissolve.value = c.dissolve
  shared.uThermal.value = c.thermal
  shared.uGlow.value = input.heat
  applyPlume(input, flickerAt(t, input.isCalm))
  applyNotes(input)
  applyModel(input)
}
