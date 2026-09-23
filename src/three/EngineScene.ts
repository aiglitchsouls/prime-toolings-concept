import * as THREE from 'three'
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import type { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import { buildAnnotations, type Annotations } from './engine/annotations'
import { buildEngine, type EngineModel, type PartId } from './engine/buildEngine'
import { createSharedUniforms } from './engine/materials'
import { buildPlume, type Plume } from './engine/plume'
import { PART_ANCHORS } from './engine/profiles'
import { applyFrame } from './frame'
import { addStudioLights, applyStudioEnvironment, createComposer, createRenderer } from './renderPipeline'
import { IDLE_TARGETS, stepTargets, type EngineTargets } from './targets'

export interface EngineSceneOptions {
  quality: 'high' | 'low'
  reducedMotion: boolean
  /** Multiplier on easing speed: scroll-driven scenes want snappier response. */
  response?: number
}

export interface Framing {
  /** Shift of the subject as a fraction of canvas size (+x = right, +y = up). */
  x: number
  y: number
  distance: number
  /** Extra camera pull-back at full explode, as a fraction of distance (tall exploded views on narrow screens). */
  explodeZoom?: number
}

export interface AnchorPoint {
  id: PartId
  /** Right-hand silhouette point of the part, in canvas pixels. */
  x: number
  y: number
  /** Mirror point on the part's left edge, for labels that flip sides. */
  xLeft: number
}

const BASE_TILT = 0.16
const LOOK_AT = new THREE.Vector3(0, -0.35, 0)

export class EngineScene {
  readonly current: EngineTargets = { ...IDLE_TARGETS }
  readonly target: EngineTargets = { ...IDLE_TARGETS }

  private renderer: THREE.WebGLRenderer
  private composer: EffectComposer
  private bloom: UnrealBloomPass
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
  private root = new THREE.Group()
  private shared = createSharedUniforms()
  private model: EngineModel
  private plume: Plume
  private notes: Annotations
  private plumeLight = new THREE.PointLight('#ff7a3d', 0, 10, 1.4)
  private envTarget: THREE.WebGLRenderTarget
  private options: Required<EngineSceneOptions>

  private framing: Framing = { x: 0, y: 0, distance: 12.5 }
  private size = { w: 1, h: 1 }
  private pointer = new THREE.Vector2()
  private pointerEased = new THREE.Vector2()
  private spinAngle = 0
  private spinVelocity = 0
  private isDragging = false
  private heat = 0
  private peak = 0
  private elapsed = 0
  private last = 0
  private raf = 0
  private isActive = false
  private scratch = new THREE.Vector3()

  constructor(canvas: HTMLCanvasElement, options: EngineSceneOptions) {
    this.options = { ...options, response: options.response ?? 1 }
    const isHigh = options.quality === 'high'

    this.renderer = createRenderer(canvas, isHigh)
    this.envTarget = applyStudioEnvironment(this.renderer, this.scene)
    addStudioLights(this.scene)

    this.model = buildEngine(this.shared, options.quality)
    this.plume = buildPlume(this.shared.uTime, isHigh ? 700 : 260, this.renderer.getPixelRatio())
    this.notes = buildAnnotations(this.shared.uTime)
    this.plumeLight.position.set(0, -1.6, 0.35)
    this.root.rotation.x = BASE_TILT
    this.root.add(this.model.spin, this.plume.group, this.notes.group, this.plumeLight)
    this.scene.add(this.root)

    const post = createComposer(this.renderer, this.scene, this.camera, isHigh)
    this.composer = post.composer
    this.bloom = post.bloom
  }

  setTargets(partial: Partial<EngineTargets>) {
    Object.assign(this.target, partial)
  }

  /** Jump straight to a state with no easing. */
  snap(partial: Partial<EngineTargets>) {
    Object.assign(this.target, partial)
    Object.assign(this.current, partial)
  }

  getThrottle() {
    return this.current.throttle
  }

  /** Highest eased throttle since the last reset, for the burn log. */
  takePeak() {
    const peak = this.peak
    this.peak = 0
    return peak
  }

  setFraming(partial: Partial<Framing>) {
    Object.assign(this.framing, partial)
    this.applyCamera(0)
  }

  setPointer(nx: number, ny: number) {
    this.pointer.set(nx, ny)
  }

  beginDrag() {
    this.isDragging = true
  }

  drag(dxPixels: number) {
    this.spinVelocity = THREE.MathUtils.clamp(this.spinVelocity + dxPixels * 0.012, -6, 6)
  }

  endDrag() {
    this.isDragging = false
  }

  setSize(w: number, h: number) {
    this.size = { w: Math.max(1, w), h: Math.max(1, h) }
    this.renderer.setSize(this.size.w, this.size.h, false)
    this.composer.setSize(this.size.w, this.size.h)
    this.applyCamera(0)
    if (!this.isActive) this.render(0)
  }

  setActive(isActive: boolean) {
    if (isActive === this.isActive) return
    this.isActive = isActive
    cancelAnimationFrame(this.raf)
    if (isActive) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.tick)
    }
  }

  /** Screen positions (canvas pixels) of each part's label anchor, for DOM callouts. */
  projectAnchors(): AnchorPoint[] {
    const explode = this.current.explode
    return this.model.parts.map((part) => {
      const anchor = PART_ANCHORS[part.id]
      const y = anchor.y + part.travel * explode
      const right = this.toScreen(anchor.r, y)
      const left = this.toScreen(-anchor.r, y)
      return { id: part.id, x: right.x, y: right.y, xLeft: left.x }
    })
  }

  private toScreen(x: number, y: number) {
    this.scratch.set(x, y, 0).applyMatrix4(this.root.matrixWorld).project(this.camera)
    return { x: (this.scratch.x * 0.5 + 0.5) * this.size.w, y: (-this.scratch.y * 0.5 + 0.5) * this.size.h }
  }

  private tick = () => {
    if (!this.isActive) return
    this.raf = requestAnimationFrame(this.tick)
    const now = performance.now()
    const dt = Math.min((now - this.last) / 1000, 1 / 20)
    this.last = now
    this.render(dt)
  }

  private render(dt: number) {
    this.elapsed += dt
    stepTargets(this.current, this.target, dt, this.options.response)
    this.peak = Math.max(this.peak, this.current.throttle)
    this.updateMotion(dt)
    applyFrame({
      c: this.current,
      t: this.elapsed,
      heat: this.heat,
      isCalm: this.options.reducedMotion,
      model: this.model,
      plume: this.plume,
      notes: this.notes,
      shared: this.shared,
      bloom: this.bloom,
      light: this.plumeLight,
    })
    this.applyCamera(dt)
    this.scene.updateMatrixWorld()
    this.shared.uEngineInv.value.copy(this.model.spin.matrixWorld).invert()
    this.composer.render(dt)
  }

  private updateMotion(dt: number) {
    const c = this.current
    const heatRate = c.throttle > this.heat ? 0.32 : 0.2
    this.heat += (c.throttle - this.heat) * (1 - Math.exp(-heatRate * dt))
    if (!this.isDragging) this.spinVelocity *= Math.exp(-dt * 1.6)
    const autoSpin = this.options.reducedMotion ? 0.04 : 0.16
    this.spinAngle += (c.spin * autoSpin + this.spinVelocity) * dt
    this.model.spin.rotation.y = this.spinAngle
    this.pointerEased.lerp(this.pointer, 1 - Math.exp(-dt * 3))
    this.root.rotation.set(BASE_TILT + this.pointerEased.y * 0.08, this.pointerEased.x * 0.28, -this.pointerEased.x * 0.04)
  }

  private applyCamera(dt: number) {
    const { w, h } = this.size
    const shake = this.options.reducedMotion || dt === 0 ? 0 : this.current.throttle * 0.022
    this.camera.aspect = w / h
    const distance = this.framing.distance * (1 + this.current.explode * (this.framing.explodeZoom ?? 0))
    this.camera.position.set((Math.random() - 0.5) * shake, 1.0 + (Math.random() - 0.5) * shake, distance)
    this.camera.lookAt(LOOK_AT)
    this.camera.setViewOffset(w, h, -this.framing.x * w, this.framing.y * h, w, h)
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    this.setActive(false)
    this.model.dispose()
    this.plume.dispose()
    this.notes.dispose()
    this.envTarget.dispose()
    this.bloom.dispose()
    this.composer.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}
