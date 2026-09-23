import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// Renderer, studio environment and post chain (HDR render → bloom → neutral tone map).
// The canvas is transparent: tone mapping would turn a white clear colour grey, so the page's own
// white shows through wherever nothing is drawn.

export function createRenderer(canvas: HTMLCanvasElement, isHigh: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isHigh ? 1.75 : 1.25))
  renderer.setClearColor('#ffffff', 0)
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1
  return renderer
}

/** Neutral studio reflections for the machined metal. Returns the target so it can be disposed. */
export function applyStudioEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const target = pmrem.fromScene(room, 0.04)
  room.dispose()
  pmrem.dispose()
  scene.environment = target.texture
  scene.environmentIntensity = 0.7
  return target
}

export function addStudioLights(scene: THREE.Scene) {
  const key = new THREE.DirectionalLight('#ffffff', 1.8)
  key.position.set(4, 6, 5)
  const rim = new THREE.DirectionalLight('#8fd3ff', 1.1)
  rim.position.set(-5, 2.5, -4)
  const under = new THREE.DirectionalLight('#ff9a5a', 0.35)
  under.position.set(2, -4, 3)
  scene.add(key, rim, under)
}

export function createComposer(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, isHigh: boolean) {
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: isHigh ? 4 : 0 })
  const composer = new EffectComposer(renderer, target)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.12, 0.42, 1.2)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())
  return { composer, bloom }
}
