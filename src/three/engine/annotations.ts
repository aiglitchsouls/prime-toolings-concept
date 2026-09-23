import * as THREE from 'three'

import { spikeRadius, SPIKE_TIP_Y, THROAT_Y } from './profiles'

// Engineering overlay: centre axis, rotating HUD ring, blueprint floor and CFD streamlines.

// Drawing ink: the overlay sits on a white page.
const INK = new THREE.Color('#1a1d22')

function axisLine() {
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 3.8, 0), new THREE.Vector3(0, -4.6, 0)])
  const material = new THREE.LineDashedMaterial({
    color: INK,
    dashSize: 0.09,
    gapSize: 0.07,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  })
  const line = new THREE.Line(geometry, material)
  line.computeLineDistances()
  return line
}

function hudRing(radius: number, y: number) {
  const positions: number[] = []
  const segments = 180
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2
    const a1 = ((i + 1) / segments) * Math.PI * 2
    positions.push(Math.sin(a0) * radius, 0, Math.cos(a0) * radius, Math.sin(a1) * radius, 0, Math.cos(a1) * radius)
  }
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const inner = radius - (i % 6 === 0 ? 0.12 : 0.05)
    positions.push(Math.sin(a) * inner, 0, Math.cos(a) * inner, Math.sin(a) * radius, 0, Math.cos(a) * radius)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const material = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.18, depthWrite: false })
  const ring = new THREE.LineSegments(geometry, material)
  ring.position.y = y
  return ring
}

const GRID_VERTEX = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const GRID_FRAGMENT = /* glsl */ `
uniform float uOpacity;
varying vec3 vWorld;
void main() {
  vec2 coord = vWorld.xz * 2.0;
  vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float line = 1.0 - min(min(g.x, g.y), 1.0);
  float fade = 1.0 - smoothstep(1.2, 6.5, length(vWorld.xz));
  gl_FragColor = vec4(vec3(0.1, 0.11, 0.13), line * fade * 0.16 * uOpacity);
}
`

function blueprintFloor() {
  const material = new THREE.ShaderMaterial({
    vertexShader: GRID_VERTEX,
    fragmentShader: GRID_FRAGMENT,
    uniforms: { uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
  })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), material)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = SPIKE_TIP_Y - 0.45
  return floor
}

const FLOW_VERTEX = /* glsl */ `
attribute float aProgress;
varying float vProgress;
void main() {
  vProgress = aProgress;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FLOW_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
varying float vProgress;
void main() {
  float phase = fract(vProgress * 8.0 - uTime * 0.85);
  float dash = smoothstep(0.0, 0.12, phase) * (1.0 - smoothstep(0.3, 0.55, phase));
  vec3 cold = vec3(0.05, 0.33, 0.72);
  vec3 hot = vec3(0.95, 0.24, 0.05);
  vec3 color = mix(cold, hot, smoothstep(0.15, 0.75, vProgress));
  gl_FragColor = vec4(color, (0.18 + dash * 0.82) * uOpacity);
}
`

function internalPath(angle: number) {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= 48; i++) {
    const t = i / 48
    const y = THROAT_Y - t * 5.2
    const onSpike = y > SPIKE_TIP_Y
    const radius = onSpike ? spikeRadius(y) + 0.05 : 0.09 + 0.05 * (y - SPIKE_TIP_Y) * -0.3
    points.push(new THREE.Vector3(Math.sin(angle) * radius, y, Math.cos(angle) * radius))
  }
  return points
}

function externalPath(angle: number, radius: number) {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= 48; i++) {
    const t = i / 48
    const y = 3.4 - t * 8.0
    const bulge = 0.35 * Math.exp(-Math.pow((y - 0.8) / 0.9, 2))
    const entrain = -0.55 * THREE.MathUtils.smoothstep(-y, 0.5, 4)
    const r = radius + bulge + entrain
    points.push(new THREE.Vector3(Math.sin(angle) * r, y, Math.cos(angle) * r))
  }
  return points
}

function streamlines(time: THREE.IUniform<number>) {
  const positions: number[] = []
  const progress: number[] = []
  const add = (points: THREE.Vector3[]) => {
    for (let i = 0; i < points.length - 1; i++) {
      positions.push(...points[i].toArray(), ...points[i + 1].toArray())
      progress.push(i / (points.length - 1), (i + 1) / (points.length - 1))
    }
  }
  for (let i = 0; i < 12; i++) add(internalPath((i / 12) * Math.PI * 2))
  for (let i = 0; i < 10; i++) add(externalPath((i / 10) * Math.PI * 2 + 0.3, 1.25 + (i % 3) * 0.28))
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aProgress', new THREE.Float32BufferAttribute(progress, 1))
  const material = new THREE.ShaderMaterial({
    vertexShader: FLOW_VERTEX,
    fragmentShader: FLOW_FRAGMENT,
    uniforms: { uTime: time, uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
  })
  return new THREE.LineSegments(geometry, material)
}

export interface Annotations {
  group: THREE.Group
  ring: THREE.LineSegments
  tipRing: THREE.LineSegments
  axis: THREE.Line
  floor: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  flow: THREE.LineSegments<THREE.BufferGeometry, THREE.ShaderMaterial>
  dispose: () => void
}

export function buildAnnotations(time: THREE.IUniform<number>): Annotations {
  const group = new THREE.Group()
  const axis = axisLine()
  const ring = hudRing(1.4, 0.23)
  const tipRing = hudRing(0.42, SPIKE_TIP_Y)
  const floor = blueprintFloor()
  const flow = streamlines(time)
  group.add(axis, ring, tipRing, floor, flow)
  const dispose = () => {
    group.traverse((object) => {
      if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) object.geometry.dispose()
      if ('material' in object && object.material instanceof THREE.Material) object.material.dispose()
    })
  }
  return { group, ring, tipRing, axis, floor, flow, dispose }
}
