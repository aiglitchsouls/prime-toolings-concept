// ─────────────────────────────────────────────────────────────────────────────
//  PLACEHOLDER: illustrative figures for the hero static-fire simulation.
//  They are NOT Prime Toolings test data and are labelled "simulated" on screen.
//  Replace with a real DAQ trace from their aerospike test before going live.
// ─────────────────────────────────────────────────────────────────────────────

export const SIM_ENGINE = {
  label: 'Aerospike · liquid', // real: their aerospike line
  propellants: 'Kerosene / GOx', // real: combination from their liquid rocket spec
  maxThrustKn: 5, // real: top of the 500 N – 5 kN aerospike range
  chamberBar: 22, // PLACEHOLDER
  mixtureRatio: 2.3, // PLACEHOLDER
  ispSeconds: 241, // PLACEHOLDER
  maxBurnSeconds: 12, // auto-cutoff for the demo
} as const
