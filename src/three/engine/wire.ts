import * as THREE from 'three'

// CAD-style isoparm wireframes: rings at profile corners plus meridian lines,
// which read as a drawing rather than the triangle soup of WireframeGeometry.

const TAU = Math.PI * 2

function ring(out: number[], radius: number, y: number, segments: number) {
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * TAU
    const a1 = ((i + 1) / segments) * TAU
    out.push(Math.sin(a0) * radius, y, Math.cos(a0) * radius, Math.sin(a1) * radius, y, Math.cos(a1) * radius)
  }
}

export function latheWire(points: THREE.Vector2[], meridians = 16, ringEvery = 1, segments = 72) {
  const positions: number[] = []
  points.forEach((p, index) => {
    const isEnd = index === 0 || index === points.length - 1
    if (p.x > 0.01 && (isEnd || index % ringEvery === 0)) ring(positions, p.x, p.y, segments)
  })
  for (let m = 0; m < meridians; m++) {
    const a = (m / meridians) * TAU
    const s = Math.sin(a)
    const c = Math.cos(a)
    for (let j = 0; j < points.length - 1; j++) {
      const p0 = points[j]
      const p1 = points[j + 1]
      positions.push(s * p0.x, p0.y, c * p0.x, s * p1.x, p1.y, c * p1.x)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

/** Wire for a torus lying in the XZ plane: tube cross-sections plus two rims. */
export function torusWire(radius: number, tube: number, sections = 32) {
  const positions: number[] = []
  for (let i = 0; i < sections; i++) {
    const a = (i / sections) * TAU
    const cx = Math.sin(a)
    const cz = Math.cos(a)
    for (let k = 0; k < 16; k++) {
      const b0 = (k / 16) * TAU
      const b1 = ((k + 1) / 16) * TAU
      const r0 = radius + Math.cos(b0) * tube
      const r1 = radius + Math.cos(b1) * tube
      positions.push(cx * r0, Math.sin(b0) * tube, cz * r0, cx * r1, Math.sin(b1) * tube, cz * r1)
    }
  }
  ring(positions, radius + tube, 0, 96)
  ring(positions, radius - tube, 0, 96)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

export function edgeWire(geometry: THREE.BufferGeometry, threshold = 24) {
  return new THREE.EdgesGeometry(geometry, threshold)
}
