// ─────────────────────────────────────────────────────────────────────────────
//  BRAND CONFIG — identity, contact and real copy for Prime Toolings.
//  Source: primetoolings.in (all pages) and the brochure / poster images on it,
//  extracted 2026-09-22. Anything invented for the concept lives in src/data/simulated.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const LIVE_SITE = 'https://www.primetoolings.in'

export const BRAND = {
  name: 'Prime Toolings',
  division: 'Aeroignite Systems',
  tagline: 'AeroPropulsion & Defense Tech',
  mission: 'Advanced high speed projectiles development & manufacturing',
  city: 'Bengaluru',
  region: 'Karnataka, India',
  founded: 1995,
  facilities: 6,
  email: 'info@primetoolings.org',
  emailHref: 'mailto:info@primetoolings.org',
  phone: '+91 91102 54764',
  phoneHref: 'tel:+919110254764',
  // Bengaluru city centre, used only for the HUD readouts
  coordinates: '12.9716° N · 77.5946° E',
  pillars: ['Aero propulsion systems', 'Aero structures', 'Manufacturing solutions'],
  certifications: ['ISO 9001:2015', 'MSME registered', 'Make in India'],
  testRig: {
    capacity: '100 kN',
    compatible: ['Solid boosters', 'Hybrid rocket engines', 'Liquid rocket engines'],
  },
} as const

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://in.linkedin.com/company/prime-toolings' },
  { label: 'Instagram', href: 'https://www.instagram.com/primetoolings/' },
  { label: 'X', href: 'https://x.com/PrimeToolings' },
] as const

// Same slugs as the live site, so existing links and search rankings carry over.
export const NAV_LINKS = [
  { to: '/products', label: 'Propulsion', code: '01' },
  { to: '/services', label: 'Services', code: '02' },
  { to: '/tot-and-consultation', label: 'Tech transfer', code: '03' },
  { to: '/edtech', label: 'Academy', code: '04' },
  { to: '/about', label: 'About', code: '05' },
] as const

// "We have designed, manufactured & tested" poster on the live home page
export const FIRSTS = [
  { title: 'Liquid-fuel aerospike engine', field: 'Liquid propulsion' },
  { title: 'Rotating detonation engine', field: 'Detonation propulsion' },
  { title: 'Liquid-cooled torch igniter', field: 'Ignition systems' },
  { title: 'Liquid-cooled pre-detonator', field: 'Detonation propulsion' },
  { title: 'Private startup working on every propulsion system', field: 'Bootstrapped' },
] as const

// K-tech / Startup Karnataka press poster on the live home page
export const AEROSPIKE_NOTE =
  'Unlike bell-nozzle rocket engines, aerospikes hold their efficiency across a wide range of altitudes, which suits next-generation launch systems and missiles.'

export const PROPULSION_CLASSES = [
  'Solid',
  'Liquid',
  'Hybrid',
  'Chemical',
  'Air-breathing',
  'Boosters',
  'Rotating detonation',
  'Supersonic combustors',
  'Custom fuel injectors',
  'Turbopumps',
] as const

export const TEAM = [
  { name: 'Nagesh M Gangamkote', role: 'Founder' },
  { name: 'Meena Nagesh', role: 'Co-founder' },
  { name: 'Nikhil N Gangamkote', role: 'CEO' },
  { name: 'Shrishti Mishra', role: 'Chief Techno-Commercial Officer' },
  { name: 'Dr Arun Kumar', role: 'Chief Technical Advisor', credential: 'Ex Head, Propulsion Division, NAL' },
  { name: 'Ivan Maccoy', role: 'Chief Sales Officer', credential: 'Ex Elbit Systems' },
  { name: 'Dr T Shreenath', role: 'Chief Technical Advisor', credential: 'Ex DRDO GTRE' },
] as const

export const ABOUT = {
  intro:
    'Prime Toolings is a precision engineering and manufacturing company. We make high-quality components, tools and assemblies for aerospace, automotive, defense and industrial machinery.',
  depth:
    'Decades of experience, state-of-the-art technology and a dedicated team keep us at the forefront, with products that meet and exceed global standards.',
  vision:
    'To be a global leader in precision manufacturing, empowering industries with innovative, reliable and sustainable engineering solutions.',
  mission: [
    { title: 'Excellence', body: 'Deliver superior-quality products tailored to the unique needs of each client.' },
    { title: 'Innovation', body: 'Use cutting-edge technology and processes to drive efficiency and accuracy.' },
    { title: 'Sustainability', body: 'Commit to environmentally friendly manufacturing for a better future.' },
  ],
} as const

// What the facilities collage on the live site shows, unit by unit.
export const FACILITIES = [
  { unit: 'Units 1 & 2', title: 'CNC machining', body: 'Turning and milling centers for chambers, injectors and flight hardware.' },
  { unit: 'Unit 3', title: 'Design & engineering', body: 'CAD, CFD and FEA workstations where every engine starts.' },
  { unit: 'Unit 4', title: 'Assembly & integration', body: 'Open hall for test rigs, engine integration and UAV work.' },
  { unit: 'Units 5 & 6', title: 'Materials & stock', body: 'Bar stock, sheet coil and hardware held in-house to cut lead times.' },
] as const
