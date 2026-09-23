import * as THREE from 'three'

import type { EngineMaterials } from './materials'

// Feed lines, torch igniter, pressure transducers and the flight tag.

type Point = [number, number, number]

const UP = new THREE.Vector3(0, 1, 0)

function tube(points: Point[], radius: number, material: THREE.Material, segments: number) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 12, false), material)
  return { mesh, curve }
}

function nutOnCurve(curve: THREE.Curve<THREE.Vector3>, t: number, radius: number, material: THREE.Material) {
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, radius * 1.2, 6), material)
  nut.position.copy(curve.getPointAt(t))
  nut.quaternion.setFromUnitVectors(UP, curve.getTangentAt(t))
  return nut
}

function feedLines(m: EngineMaterials, segments: number) {
  const oxidizer = new THREE.Group()
  const ox = tube(
    [[0, 2.28, 0], [0, 2.55, 0], [-0.14, 2.8, -0.08], [-0.55, 3.05, -0.3], [-0.95, 3.45, -0.5], [-1.12, 4.4, -0.6]],
    0.05,
    m.steel,
    segments,
  )
  oxidizer.add(ox.mesh, nutOnCurve(ox.curve, 0.012, 0.09, m.brass))

  const fuel = new THREE.Group()
  const fu = tube(
    [[0.76, 1.47, 0], [0.98, 1.5, 0.05], [1.18, 1.72, 0.12], [1.28, 2.2, 0.18], [1.3, 3.0, 0.22], [1.32, 4.4, 0.25]],
    0.045,
    m.steel,
    segments,
  )
  const purge = tube(
    [[-0.76, 1.47, 0], [-1.0, 1.55, 0.1], [-1.12, 1.9, 0.2], [-1.1, 2.45, 0.3]],
    0.03,
    m.steelDark,
    Math.round(segments / 2),
  )
  const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 20), m.steelDark)
  inlet.rotation.z = Math.PI / 2
  inlet.position.set(0.74, 1.47, 0)
  fuel.add(
    fu.mesh,
    purge.mesh,
    inlet,
    nutOnCurve(fu.curve, 0.02, 0.08, m.brass),
    nutOnCurve(purge.curve, 0.999, 0.055, m.orange),
  )
  return { oxidizer, fuel, fuelCurve: fu.curve }
}

function igniter(m: EngineMaterials) {
  const group = new THREE.Group()
  const angle = 0.62
  const base = new THREE.Vector3(Math.sin(angle) * 0.44, 1.88, Math.cos(angle) * 0.44)
  const dir = base.clone().sub(new THREE.Vector3(0, 1.45, 0)).normalize()
  group.position.copy(base)
  group.quaternion.setFromUnitVectors(UP, dir)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.075, 0.34, 28), m.steel)
  body.position.y = 0.14
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.09, 28), m.orange)
  cap.position.y = 0.33
  const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.036, 0.13, 16), m.anodized)
  plug.position.y = 0.43
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 12, 12),
    new THREE.MeshBasicMaterial({ color: '#1d74c0', toneMapped: false }),
  )
  led.position.set(0.084, 0.33, 0)
  group.add(body, cap, plug, led)
  return { group, led }
}

function transducer(m: EngineMaterials, angle: number, y: number, lead: Point) {
  const group = new THREE.Group()
  const outward = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle))
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.2, 18), m.steel)
  body.position.copy(outward.clone().multiplyScalar(0.74)).setY(y)
  body.quaternion.setFromUnitVectors(UP, outward)
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.06, 18), m.anodized)
  cap.position.copy(outward.clone().multiplyScalar(0.86)).setY(y)
  cap.quaternion.copy(body.quaternion)
  const start = outward.clone().multiplyScalar(0.89).setY(y)
  const cable = tube(
    [[start.x, start.y, start.z], [start.x * 1.25, y + 0.25, start.z * 1.25], lead],
    0.011,
    m.anodized,
    40,
  )
  group.add(body, cap, cable.mesh)
  return group
}

function flightTag(curve: THREE.Curve<THREE.Vector3>) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#d4231a'
    ctx.fillRect(0, 0, 64, 256)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 15px Archivo, sans-serif'
    ctx.translate(40, 246)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('REMOVE BEFORE FLIGHT', 0, 0)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const geometry = new THREE.PlaneGeometry(0.085, 0.34, 1, 6)
  geometry.translate(0, -0.2, 0)
  const tag = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, roughness: 0.9 }),
  )
  tag.position.copy(curve.getPointAt(0.34))
  return tag
}

export function buildPlumbing(m: EngineMaterials, segments: number) {
  const lines = feedLines(m, segments)
  const ign = igniter(m)
  const sensors = new THREE.Group()
  sensors.add(
    transducer(m, 3.5, 0.98, [-0.2, 4.4, -1.3]),
    transducer(m, 2.55, 0.6, [0.5, 4.4, -1.2]),
  )
  const tag = flightTag(lines.fuelCurve)
  lines.fuel.add(tag)
  return { oxidizer: lines.oxidizer, fuel: lines.fuel, igniter: ign.group, led: ign.led, sensors, tag }
}
