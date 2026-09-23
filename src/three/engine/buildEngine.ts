import * as THREE from 'three'

import { createEngineMaterials, createWireMaterial, type EngineMaterials, type SharedUniforms } from './materials'
import { buildPlumbing } from './plumbing'
import { chamberProfile, COWL, DOME, FLANGE, PART_ANCHORS, PORT, spikeProfile } from './profiles'
import { latheWire, torusWire } from './wire'

export type PartId = keyof typeof PART_ANCHORS

export interface EnginePart {
  id: PartId
  group: THREE.Group
  /** Vertical travel at full exploded view, in engine units. */
  travel: number
}

export interface EngineModel {
  spin: THREE.Group
  parts: EnginePart[]
  wireMaterial: THREE.LineBasicMaterial
  materials: EngineMaterials
  led: THREE.Mesh
  tag: THREE.Mesh
  dispose: () => void
}

const EXPLODE_TRAVEL: Record<PartId, number> = {
  head: 1.3,
  manifold: 0.82,
  chamber: 0.4,
  flange: 0.06,
  cowl: -0.34,
  spike: -0.92,
}

interface LatheSpec {
  profile: THREE.Vector2[]
  material: THREE.Material
  meridians: number
  ringEvery?: number
}

function lathe(spec: LatheSpec, segments: number, wireMaterial: THREE.LineBasicMaterial) {
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(spec.profile, segments), spec.material)
  const wire = new THREE.LineSegments(latheWire(spec.profile, spec.meridians, spec.ringEvery ?? 1), wireMaterial)
  mesh.add(wire)
  return mesh
}

function bolts(material: THREE.Material, count: number) {
  const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.034, 0.034, 0.05, 6), material, count)
  const matrix = new THREE.Matrix4()
  const quaternion = new THREE.Quaternion()
  const scale = new THREE.Vector3(1, 1, 1)
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), a * 3.1)
    matrix.compose(new THREE.Vector3(Math.sin(a) * 0.705, 0.325, Math.cos(a) * 0.705), quaternion, scale)
    mesh.setMatrixAt(i, matrix)
  }
  return mesh
}

function manifold(m: EngineMaterials, wireMaterial: THREE.LineBasicMaterial, detail: number) {
  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.705, 0.07, 20, detail), m.anodized)
  torus.rotation.x = Math.PI / 2
  torus.position.y = 1.47
  const wire = new THREE.LineSegments(torusWire(0.705, 0.07), wireMaterial)
  wire.position.y = 1.47
  return [torus, wire]
}

export function buildEngine(shared: SharedUniforms, quality: 'high' | 'low'): EngineModel {
  const segments = quality === 'high' ? 128 : 64
  const materials = createEngineMaterials(shared)
  const wireMaterial = createWireMaterial()
  const spin = new THREE.Group()

  const group = (id: PartId, ...children: THREE.Object3D[]) => {
    const g = new THREE.Group()
    g.name = id
    g.add(...children)
    spin.add(g)
    return { id, group: g, travel: EXPLODE_TRAVEL[id] }
  }

  const plumbing = buildPlumbing(materials, quality === 'high' ? 96 : 48)
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.622, 0.012, 8, segments), materials.orange)
  band.rotation.x = Math.PI / 2
  band.position.y = 0.34

  const parts: EnginePart[] = [
    group(
      'head',
      lathe({ profile: DOME, material: materials.steel, meridians: 16 }, segments, wireMaterial),
      lathe({ profile: PORT, material: materials.steelDark, meridians: 8 }, 48, wireMaterial),
      new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.07, 6).translate(0, 2.05, 0), materials.steelDark),
      plumbing.oxidizer,
      plumbing.igniter,
    ),
    group('manifold', ...manifold(materials, wireMaterial, segments), plumbing.fuel),
    group(
      'chamber',
      lathe({ profile: chamberProfile(), material: materials.steel, meridians: 20 }, segments, wireMaterial),
      band,
      plumbing.sensors,
    ),
    group(
      'flange',
      lathe({ profile: FLANGE, material: materials.steelDark, meridians: 24 }, segments, wireMaterial),
      bolts(materials.steelDark, 16),
    ),
    group('cowl', lathe({ profile: COWL, material: materials.spike, meridians: 20 }, segments, wireMaterial)),
    group(
      'spike',
      lathe({ profile: spikeProfile(), material: materials.spike, meridians: 16, ringEvery: 4 }, segments, wireMaterial),
    ),
  ]

  const dispose = () => {
    spin.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) object.geometry.dispose()
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
        object.material.map?.dispose()
      }
    })
    materials.all.forEach((material) => material.dispose())
    wireMaterial.dispose()
    ;(plumbing.led.material as THREE.Material).dispose()
    ;(plumbing.tag.material as THREE.Material).dispose()
  }

  return { spin, parts, wireMaterial, materials, led: plumbing.led, tag: plumbing.tag, dispose }
}
