import type { PhotoKey } from './media'

// Catalogue from primetoolings.in/products. Ranges are the live site's figures, converted to newtons.
// Summaries explain what each system class is; they add no new performance claims.

export type Family = 'boosters' | 'liquid' | 'hybrid' | 'detonation' | 'airbreathing' | 'components'

export type SchematicKind = 'solid' | 'dual' | 'liquid' | 'aerospike' | 'hybrid' | 'rde' | 'pulse' | 'ramjet' | 'injector'

export interface Range {
  min: number
  max: number
}

export interface Product {
  id: string
  name: string
  family: Family
  schematic: SchematicKind
  thrust?: Range
  frequency?: Range
  summary: string
  photo?: PhotoKey
}

export const FAMILIES: { id: Family | 'all'; label: string }[] = [
  { id: 'all', label: 'All systems' },
  { id: 'boosters', label: 'Boosters' },
  { id: 'liquid', label: 'Liquid' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'detonation', label: 'Detonation' },
  { id: 'airbreathing', label: 'Air-breathing' },
  { id: 'components', label: 'Components' },
]

export const PRODUCTS: Product[] = [
  {
    id: 'solid-rato-boosters',
    name: 'Solid RATO boosters',
    family: 'boosters',
    schematic: 'solid',
    thrust: { min: 10_000, max: 50_000 },
    summary: 'Rocket-assisted take-off boosters for launches that need a hard, short push off the rail.',
    photo: 'verticalFire',
  },
  {
    id: 'liquid-propulsion',
    name: 'Liquid propulsion systems',
    family: 'liquid',
    schematic: 'liquid',
    thrust: { min: 5_000, max: 15_000 },
    summary: 'Liquid rocket engines with their feed systems, from injector plate to nozzle exit.',
    photo: 'whitePlume',
  },
  {
    id: 'rotating-detonation-engine',
    name: 'Rotating detonation engine',
    family: 'detonation',
    schematic: 'rde',
    thrust: { min: 1_000, max: 5_000 },
    summary: 'Combustion runs as a detonation wave circling an annular chamber: the pressure-gain cycle behind next-generation engines.',
  },
  {
    id: 'aerospike-engines',
    name: 'Engines with aerospike nozzle',
    family: 'liquid',
    schematic: 'aerospike',
    thrust: { min: 500, max: 5_000 },
    summary: 'Plug-nozzle engines that keep their efficiency across altitudes. India’s first liquid-fuel aerospike came off this line.',
    photo: 'aerospikeHardware',
  },
  {
    id: 'dual-heavy-boosters',
    name: 'Dual heavy boosters',
    family: 'boosters',
    schematic: 'dual',
    thrust: { min: 3_000, max: 20_000 },
    summary: 'Twin-nozzle boosters for heavier payloads at launch.',
    photo: 'dualBooster',
  },
  {
    id: 'pre-detonator',
    name: 'Pre-detonator',
    family: 'detonation',
    schematic: 'pulse',
    frequency: { min: 5, max: 45 },
    summary: 'Liquid-cooled pre-detonator that initiates detonation at a set pulse rate. Another Indian first.',
  },
  {
    id: 'hybrid-engines',
    name: 'Hybrid engines',
    family: 'hybrid',
    schematic: 'hybrid',
    thrust: { min: 8_000, max: 50_000 },
    summary: 'A liquid or gaseous oxidizer burning over a solid fuel grain: the handling of a solid with the control of a liquid.',
    photo: 'hybridTube',
  },
  {
    id: 'rato-booster',
    name: 'RATO booster',
    family: 'boosters',
    schematic: 'solid',
    thrust: { min: 500, max: 15_000 },
    summary: 'Compact rocket-assisted take-off units, including RATO boosters for UAV launches.',
    photo: 'uavRato',
  },
  {
    id: 'supersonic-combustors',
    name: 'Supersonic combustors',
    family: 'airbreathing',
    schematic: 'ramjet',
    summary: 'Combustors for liquid-fuel ramjet engines, built to hold a stable flame in high-speed airflow.',
    photo: 'combustorParts',
  },
  {
    id: 'custom-fuel-injector',
    name: 'All-in-1 custom fuel injector',
    family: 'components',
    schematic: 'injector',
    summary: 'Injectors designed and machined around your propellant combination and chamber.',
    photo: 'injectorParts',
  },
]

export interface Projectile {
  id: string
  name: string
  short: string
  summary: string
  specs: { label: string; value: string }[]
  engagement?: string[]
}

// "High Speed Projectiles: coming soon" section of the live products page
export const PROJECTILES: Projectile[] = [
  {
    id: 'liquid-rocket',
    name: 'Liquid rocket',
    short: 'Liquid rocket',
    summary: 'Kerosene–GOx liquid propulsion system.',
    specs: [
      { label: 'Range', value: '400 km' },
      { label: 'Apogee', value: '380 km' },
      { label: 'Speed', value: 'Mach 2.23' },
      { label: 'Thrust', value: '3 kN' },
      { label: 'Propellant', value: 'Kerosene–GOx' },
    ],
  },
  {
    id: 'manpads',
    name: 'Man-portable air defense system',
    short: 'MANPADS',
    summary: 'High-speed guided and unguided projectile.',
    specs: [
      { label: 'Seeker', value: 'Infrared' },
      { label: 'Range', value: '2–3 km' },
      { label: 'Altitude', value: '2–4 km' },
      { label: 'Speed', value: 'Mach 0.7' },
      { label: 'Thrust', value: '800 N–4 kN' },
      { label: 'Propellant', value: 'Solid' },
    ],
    engagement: ['Drones & UAVs', 'Armored vehicles', 'Small boats', 'Helicopters & aircraft', 'Artillery positions'],
  },
  {
    id: 'ramjet-shell',
    name: 'Ramjet artillery shell',
    short: 'Ramjet shell',
    summary: 'High-speed projectile with air-breathing ramjet sustain.',
    specs: [
      { label: 'Class', value: 'Artillery' },
      { label: 'Propulsion', value: 'Ramjet' },
    ],
  },
]
