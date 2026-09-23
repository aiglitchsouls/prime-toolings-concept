// From primetoolings.in/tot-and-consultation.

export const TOT_INTRO =
  'Prime Toolings develops defense technology concepts, engineering blueprints, system architectures and technology transfer frameworks. Organizations use them to evaluate, develop, customize and indigenize advanced capabilities quickly.'

export const DELIVERABLES = [
  { title: 'Engineering blueprints', body: 'Complete technical documentation and design frameworks for technology development.' },
  { title: 'System architecture', body: 'Subsystem allocation, interface definitions, integration strategies and performance mapping.' },
  { title: 'Electronics & control', body: 'Electronic architecture planning, schematic packages and control system frameworks.' },
  { title: 'Transfer packages', body: 'Structured documentation that lets you understand, customize and develop a technology in-house.' },
  { title: 'R&D roadmaps', body: 'Technology maturity assessment and phased development strategies.' },
  { title: 'Capability upgrades', body: 'Upgrade pathways and performance improvement recommendations.' },
] as const

export const IDEAL_FOR = [
  'Defense startups',
  'Research institutions',
  'Private defense manufacturers',
  'Government organizations',
  'Academic innovation centers',
  'Technology investors',
  'Strategic development programs',
] as const

export const WHY_US = [
  'An engineering-driven approach to faster indigenization',
  'Technology-agnostic solutions',
  'Indigenization-oriented frameworks',
  'Structured technical documentation',
  'Scalable development methodologies',
  'Custom enhancement planning',
  'Rapid concept-to-implementation support',
  'Certification and licensing, with legal support',
] as const

export type DomainId = 'aerospace' | 'ew' | 'energy' | 'marine'

export interface Domain {
  id: DomainId
  title: string
  short: string
  items: string[]
}

export const DOMAINS: Domain[] = [
  {
    id: 'aerospace',
    title: 'Aerospace & defense',
    short: 'Aero',
    items: [
      'Alloys, composites and intermetallic alloys',
      'Propulsion systems',
      'Custom airframes and aero-structural components',
      'Fuel tech and plumbing solutions',
      'System integration and product development',
    ],
  },
  {
    id: 'ew',
    title: 'Electronic warfare & systems',
    short: 'EW',
    items: [
      'Military and civil radars, multi-role surveillance radar architecture',
      'DAQ systems',
      'ECM framework and ESM architecture',
      'Secure tactical communication networks',
      'System integration and product development',
      'Autonomous navigation electronics suite',
      'Distributed battlefield sensor networks',
      'Custom ground control stations and networks',
      'Mission computers and embedded processing',
      'Power electronics and energy management',
    ],
  },
  {
    id: 'energy',
    title: 'Energy technologies',
    short: 'Energy',
    items: [
      'Hydrogen energy storage framework',
      'Microgrid control system architecture',
      'High-density battery pack design',
      'Hybrid renewable energy integration',
      'Thermal energy recovery systems',
      'Portable military power generation',
      'Smart energy monitoring platform',
      'Fuel cell power systems',
      'Grid-independent energy infrastructure',
      'Predictive energy optimization platform',
    ],
  },
  {
    id: 'marine',
    title: 'Marine technologies',
    short: 'Marine',
    items: [
      'Autonomous surface vessel framework',
      'Underwater surveillance architecture',
      'Electric marine propulsion package',
      'Unmanned underwater vehicle development',
      'Sonar integration and signal processing',
      'Smart port monitoring system',
      'Marine structural health monitoring',
      'Hybrid marine energy generation',
      'Autonomous navigation and collision avoidance',
      'Underwater communication networks',
    ],
  },
]
