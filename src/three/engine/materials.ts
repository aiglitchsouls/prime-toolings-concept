import * as THREE from 'three'

import { NOISE_GLSL, RAMP_GLSL } from '../glsl'

// Uniforms shared by every engine material, so one write animates the whole assembly.
export interface SharedUniforms {
  uTime: THREE.IUniform<number>
  uDissolve: THREE.IUniform<number>
  uThermal: THREE.IUniform<number>
  uGlow: THREE.IUniform<number>
  uEngineInv: THREE.IUniform<THREE.Matrix4>
}

export function createSharedUniforms(): SharedUniforms {
  return {
    uTime: { value: 0 },
    uDissolve: { value: 0 },
    uThermal: { value: 0 },
    uGlow: { value: 0 },
    uEngineInv: { value: new THREE.Matrix4() },
  }
}

const VERTEX_PARS = /* glsl */ `
uniform mat4 uEngineInv;
varying vec3 vEng;
`

// Engine-space position: stays put while the whole assembly spins or tilts.
const VERTEX_MAIN = /* glsl */ `
vec4 ptWorld = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
  ptWorld = instanceMatrix * ptWorld;
#endif
ptWorld = modelMatrix * ptWorld;
vEng = (uEngineInv * ptWorld).xyz;
`

const FRAGMENT_PARS = /* glsl */ `
uniform float uTime;
uniform float uDissolve;
uniform float uThermal;
uniform float uGlow;
uniform float uHeatTint;
uniform float uGlowMask;
varying vec3 vEng;
${NOISE_GLSL}
${RAMP_GLSL}

float ptHeatField() {
  float up = exp(-max(vEng.y, 0.0) * 1.15);
  float down = exp(-max(-vEng.y, 0.0) * 0.5);
  float h = mix(down, up, step(0.0, vEng.y));
  h += 0.07 * sin(vEng.y * 15.0 - uTime * 5.0) + 0.05 * ptNoise(vEng * 3.0 + vec3(0.0, uTime * 0.6, 0.0));
  return clamp(h, 0.0, 1.0);
}

// Temper colours left on steel by real firings: blue and purple near the throat, straw further down.
vec3 ptTemper(vec3 base) {
  float t = clamp(-vEng.y / 1.7, 0.0, 1.0);
  vec3 c = mix(ptLin(vec3(0.20, 0.30, 0.66)), ptLin(vec3(0.45, 0.28, 0.58)), smoothstep(0.0, 0.22, t));
  c = mix(c, ptLin(vec3(0.70, 0.45, 0.22)), smoothstep(0.2, 0.48, t));
  c = mix(c, ptLin(vec3(0.88, 0.74, 0.46)), smoothstep(0.45, 0.78, t));
  return mix(c, base, smoothstep(0.74, 1.0, t));
}
`

const DISSOLVE_MAIN = /* glsl */ `
float ptN = ptNoise(vEng * 2.4) * 0.5 + 0.5;
float ptCut = uDissolve * 1.1 - 0.05;
if (ptN < ptCut) discard;
float ptEdge = (1.0 - smoothstep(ptCut, ptCut + 0.06, ptN)) * step(0.002, uDissolve);
`

const COLOR_MAIN = /* glsl */ `
diffuseColor.rgb = mix(diffuseColor.rgb, ptTemper(diffuseColor.rgb), uHeatTint * 0.6);
vec3 ptHeat = ptRamp(ptHeatField());
diffuseColor.rgb = mix(diffuseColor.rgb, ptHeat, uThermal);
`

const ROUGHNESS_MAIN = `roughnessFactor = mix(roughnessFactor, 0.6, uThermal);`
const METALNESS_MAIN = `metalnessFactor = mix(metalnessFactor, 0.0, uThermal);`

const EMISSIVE_MAIN = /* glsl */ `
totalEmissiveRadiance += vec3(1.0, 0.32, 0.08) * ptEdge * 2.4;
totalEmissiveRadiance += ptHeat * uThermal * 0.7;
float ptZone = smoothstep(-2.0, -0.1, vEng.y) * (1.0 - smoothstep(0.05, 0.45, vEng.y));
totalEmissiveRadiance += vec3(1.0, 0.28, 0.06) * uGlow * uGlowMask * ptZone * 1.6;
`

interface PatchOptions {
  heatTint?: number
  glowMask?: number
}

function patch(material: THREE.MeshPhysicalMaterial, shared: SharedUniforms, options: PatchOptions) {
  const own = {
    uHeatTint: { value: options.heatTint ?? 0 },
    uGlowMask: { value: options.glowMask ?? 0 },
  }

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared, own)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_PARS}`)
      .replace('#include <project_vertex>', `#include <project_vertex>\n${VERTEX_MAIN}`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_PARS}`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n${DISSOLVE_MAIN}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${COLOR_MAIN}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n${ROUGHNESS_MAIN}`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\n${METALNESS_MAIN}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${EMISSIVE_MAIN}`)
  }
  material.customProgramCacheKey = () => 'pt-engine-v1'
  return material
}

export interface EngineMaterials {
  steel: THREE.MeshPhysicalMaterial
  steelDark: THREE.MeshPhysicalMaterial
  spike: THREE.MeshPhysicalMaterial
  anodized: THREE.MeshPhysicalMaterial
  brass: THREE.MeshPhysicalMaterial
  orange: THREE.MeshPhysicalMaterial
  all: THREE.Material[]
}

export function createEngineMaterials(shared: SharedUniforms): EngineMaterials {
  const make = (params: THREE.MeshPhysicalMaterialParameters, options: PatchOptions = {}) =>
    patch(new THREE.MeshPhysicalMaterial(params), shared, options)

  const steel = make({ color: '#c3c7cc', metalness: 1, roughness: 0.36 })
  const steelDark = make({ color: '#8a8f96', metalness: 1, roughness: 0.46 })
  const spike = make({ color: '#d2d5d9', metalness: 1, roughness: 0.26, clearcoat: 0.2 }, { heatTint: 1, glowMask: 1 })
  const anodized = make({ color: '#25282d', metalness: 0.75, roughness: 0.42 })
  const brass = make({ color: '#bf9550', metalness: 1, roughness: 0.34 })
  const orange = make({ color: '#ff4d1a', metalness: 0.35, roughness: 0.38, clearcoat: 0.6 })

  return { steel, steelDark, spike, anodized, brass, orange, all: [steel, steelDark, spike, anodized, brass, orange] }
}

export function createWireMaterial() {
  return new THREE.LineBasicMaterial({ color: '#1a1d22', transparent: true, opacity: 0, depthWrite: false })
}
