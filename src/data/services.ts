// From primetoolings.in/services, tightened for the concept.

export interface Service {
  id: string
  code: string
  title: string
  lead: string
  points: string[]
  stage: string
}

export const SERVICES: Service[] = [
  {
    id: 'cad-dfm',
    code: '01',
    title: 'CAD & DFM',
    lead: 'Precise engineering design, with design for manufacturing built in from the first sketch.',
    points: ['2D drawings and 3D models that take a concept to reality', 'Animations and DMU kinematics', 'Design for manufacturing'],
    stage: 'Wireframe',
  },
  {
    id: 'cfd',
    code: '02',
    title: 'CFD & combustion dynamics',
    lead: 'We visualize how a design behaves aerodynamically, inside and out.',
    points: ['High-speed airflow', 'Combustion dynamics', 'Internal and external flow fields'],
    stage: 'Simulation',
  },
  {
    id: 'manufacturing',
    code: '03',
    title: 'Manufacturing',
    lead: 'Ready-to-fire parts and components, customized and made to precision.',
    points: ['Custom flight hardware and components', 'Precision machining in-house', 'Parts designed to be easy and economical to replace'],
    stage: 'Assembly',
  },
  {
    id: 'static-fire',
    code: '04',
    title: 'Engine static fire testing',
    lead: 'Want to test your engines? Our precise DAQ systems and rigid test rigs have you covered.',
    points: ['Precise data acquisition (DAQ)', 'Rigid test rigs rated to 100 kN', 'Solid, hybrid and liquid engines'],
    stage: 'Static fire',
  },
]
