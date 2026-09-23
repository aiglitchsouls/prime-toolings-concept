import * as THREE from 'three'

import { NOISE_GLSL } from '../glsl'
import { SPIKE_TIP_Y, THROAT_Y } from './profiles'

// Exhaust: two additive lathe shells (outer envelope + hot sheet hugging the spike),
// shock diamonds past the truncated tip, sparks and a throat flare.

const PLUME_LENGTH = 6.2

const PLUME_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalV;
varying vec3 vViewV;
varying vec3 vLocal;
void main() {
  vUv = uv;
  vLocal = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormalV = normalize(normalMatrix * normal);
  vViewV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

const PLUME_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uThrottle;
uniform float uCore;
varying vec2 vUv;
varying vec3 vNormalV;
varying vec3 vViewV;
varying vec3 vLocal;
${NOISE_GLSL}
void main() {
  float u = vUv.y;
  float facing = abs(dot(normalize(vNormalV), normalize(vViewV)));
  float body = pow(facing, mix(1.4, 2.6, uCore));
  float n1 = ptNoise(vec3(vLocal.x * 2.4, vLocal.y * 1.3 + uTime * 9.0, vLocal.z * 2.4)) * 0.5 + 0.5;
  float n2 = ptNoise(vec3(vLocal.x * 7.0, vLocal.y * 3.6 + uTime * 17.0, vLocal.z * 7.0)) * 0.5 + 0.5;
  float tipU = 0.38;
  float free = smoothstep(tipU - 0.04, tipU + 0.06, u);
  float diamonds = pow(0.5 + 0.5 * cos((u - tipU) * 58.0), 7.0) * free * (1.0 - smoothstep(0.56, 0.86, u));
  float reach = mix(1.0, 0.55, uCore);
  float fade = (1.0 - smoothstep(0.35 * reach, reach, u)) * smoothstep(0.0, 0.025, u);
  float intensity = (body * 0.85 + diamonds * 1.2) * (0.45 + 0.75 * n1) * (0.75 + 0.5 * n2) * fade;
  vec3 hot = vec3(1.0, 0.96, 0.9);
  vec3 mid = vec3(1.0, 0.5, 0.16);
  vec3 cool = vec3(0.75, 0.13, 0.04);
  float edge = 1.0 - facing;
  vec3 color = mix(hot, mid, smoothstep(0.02, 0.42, u + edge * 0.45 - uCore * 0.12));
  color = mix(color, cool, smoothstep(0.45, 1.0, u + edge * 0.25));
  color = mix(vec3(0.55, 0.78, 1.0), color, smoothstep(0.0, 0.05, u));
  float gain = mix(0.6, 1.5, uCore);
  gl_FragColor = vec4(color * gain, intensity * uThrottle);
}
`

function plumeProfile(core: boolean) {
  const points: THREE.Vector2[] = []
  const steps = 72
  for (let i = 0; i <= steps; i++) {
    const u = i / steps
    const y = THROAT_Y - u * PLUME_LENGTH
    const hug = THREE.MathUtils.lerp(0.5, 0.17, THREE.MathUtils.smoothstep(u, 0, 0.38))
    const bloom = 0.32 * THREE.MathUtils.smoothstep(u, 0.4, 1)
    const ripple = 0.025 * Math.sin(u * 58) * THREE.MathUtils.smoothstep(u, 0.38, 0.5)
    const radius = (hug + bloom + ripple) * (core ? 0.72 : 1)
    points.push(new THREE.Vector2(Math.max(radius, 0.02), y))
  }
  // LatheGeometry expects the profile to walk upward, so reverse and flip uv later in the shader.
  return points.reverse()
}

function plumeShell(core: boolean, time: THREE.IUniform<number>, throttle: THREE.IUniform<number>) {
  const geometry = new THREE.LatheGeometry(plumeProfile(core), 64)
  // After the reverse, uv.y runs tail → throat; flip so 0 sits at the throat.
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i))
  const material = new THREE.ShaderMaterial({
    vertexShader: PLUME_VERTEX,
    fragmentShader: PLUME_FRAGMENT,
    uniforms: { uTime: time, uThrottle: throttle, uCore: { value: core ? 1 : 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
  return new THREE.Mesh(geometry, material)
}

const SPARK_VERTEX = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime;
uniform float uThrottle;
uniform float uPixel;
varying float vLife;
void main() {
  float t = fract(uTime * (0.55 + aSeed.x * 0.9) + aSeed.y);
  float angle = aSeed.z * 6.2831853;
  float len = (${(-SPIKE_TIP_Y).toFixed(2)} + 1.2 + aSeed.w * 4.0) * (0.35 + 0.65 * uThrottle);
  float y = ${THROAT_Y.toFixed(3)} - t * len;
  float spread = mix(0.47, 0.14 + aSeed.w * 0.55 * t, smoothstep(0.0, 0.45, t));
  vec3 p = vec3(sin(angle) * spread, y, cos(angle) * spread);
  vLife = (1.0 - t) * uThrottle;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.5 + aSeed.x * 3.0) * uPixel * (7.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const SPARK_FRAGMENT = /* glsl */ `
varying float vLife;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vLife;
  gl_FragColor = vec4(vec3(1.0, 0.62, 0.28) * 2.2, a);
}
`

function sparks(count: number, time: THREE.IUniform<number>, throttle: THREE.IUniform<number>, pixel: number) {
  const geometry = new THREE.BufferGeometry()
  const seeds = new Float32Array(count * 4)
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  const material = new THREE.ShaderMaterial({
    vertexShader: SPARK_VERTEX,
    fragmentShader: SPARK_FRAGMENT,
    uniforms: { uTime: time, uThrottle: throttle, uPixel: { value: pixel } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return points
}

function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,250,240,1)')
    gradient.addColorStop(0.18, 'rgba(255,190,120,0.85)')
    gradient.addColorStop(0.45, 'rgba(255,90,30,0.28)')
    gradient.addColorStop(1, 'rgba(255,60,20,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export interface Plume {
  group: THREE.Group
  /** Only the gas shells stretch with throttle; sprites would squash under a non-uniform scale. */
  shells: THREE.Group
  throttle: THREE.IUniform<number>
  flare: THREE.Sprite
  tipFlare: THREE.Sprite
  dispose: () => void
}

export function buildPlume(time: THREE.IUniform<number>, sparkCount: number, pixel: number): Plume {
  const throttle = { value: 0 }
  const group = new THREE.Group()
  const shells = new THREE.Group()
  const outer = plumeShell(false, time, throttle)
  const core = plumeShell(true, time, throttle)
  core.renderOrder = 2
  shells.add(outer, core)
  const sparkPoints = sparks(sparkCount, time, throttle, pixel)
  const texture = glowTexture()
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0,
  })
  const flare = new THREE.Sprite(spriteMaterial)
  flare.position.set(0, THROAT_Y - 0.22, 0)
  const tipFlare = new THREE.Sprite(spriteMaterial.clone())
  tipFlare.position.set(0, SPIKE_TIP_Y - 0.25, 0)
  group.add(shells, sparkPoints, flare, tipFlare)

  const dispose = () => {
    ;[outer, core].forEach((mesh) => {
      mesh.geometry.dispose()
      mesh.material.dispose()
    })
    sparkPoints.geometry.dispose()
    sparkPoints.material.dispose()
    texture.dispose()
    spriteMaterial.dispose()
    tipFlare.material.dispose()
  }

  return { group, shells, throttle, flare, tipFlare, dispose }
}
