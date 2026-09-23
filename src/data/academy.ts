// From primetoolings.in/edtech.

export const ACADEMY_INTRO =
  'Top-notch products take real skill in design, CFD and FEA to visualize and validate how a design performs. We train students, employees and institute faculty to industrial standards. That bridges the gap between academia and industry, and it saves projects time and money.'

export interface Program {
  id: string
  code: string
  title: string
  lead: string
  modules: string[]
  outcome: string
}

export const PROGRAMS: Program[] = [
  {
    id: 'cad-dfm',
    code: 'A1',
    title: 'CAD & DFM',
    lead: 'Computer-aided design and design for manufacturing: the skill every engineering student needs. Work with industrial design and modeling to turn concepts into real parts.',
    modules: ['Part modeling', 'Surface modeling', 'Assembly', '2D drafting', 'GD&T'],
    outcome: 'Precision, simplified.',
  },
  {
    id: 'cfd-fea',
    code: 'A2',
    title: 'CFD & FEA',
    lead: 'Computational fluid dynamics and finite element analysis. Test designs against the forces acting on them and prove they are ready for industry.',
    modules: ['Aeroelasticity', 'Aeroacoustics', 'Thermo-acoustics', 'Vibration dynamics', 'Combustion dynamics'],
    outcome: 'A full multi-physics toolkit.',
  },
  {
    id: 'manufacturing-testing',
    code: 'A3',
    title: 'Manufacturing & practical testing',
    lead: 'This is not a regular practical course. Our students touch and feel expensive setups.',
    modules: ['Manufacture', 'Assemble components', 'Fire rocket and missile engines by hand', 'Validate results with DAQ systems'],
    outcome: 'Break hardware on purpose to find the limits of an industrial process.',
  },
]
