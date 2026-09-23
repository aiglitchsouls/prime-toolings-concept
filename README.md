# Prime Toolings — website concept

An unsolicited design concept for [Prime Toolings](https://www.primetoolings.in), a Bengaluru aerospace
propulsion and defense manufacturer. Built by [Quietbuild Labs](https://quietbuildlabs.com).

**This is not the official Prime Toolings website** and is not affiliated with or endorsed by the company.
It is a pitch piece, marked `noindex`, showing how their engineering could be presented.

Live: **https://prime-toolings-concept.vercel.app**

## What's in it

- **A 3D aerospike engine you can fire.** The hero runs a procedural three.js model of an annular aerospike:
  chamber, injector head, manifold, bolted flange, plug nozzle, feed lines and torch igniter. It materialises
  out of a CAD wireframe on load, and holding the ignite button runs a simulated static fire with a shader
  plume, shock diamonds, sparks, heat-soak glow on the metal, a DAQ-style telemetry trace and a burn log.
  Engine audio is synthesised with the Web Audio API (no audio files) and is off by default.
- **One engine through the whole process.** A scroll-scrubbed section takes the same model from CAD wireframe
  with part callouts, to a false-colour CFD view with streamlines, to an exploded assembly, to a static fire.
- **A thrust dial.** The product catalogue drawn on a log axis from 500 N to 50 kN: drag the dial and matching
  systems light up; any system opens a spec sheet.
- **A scroll-drawn flight profile** for their liquid rocket, with live range, altitude and Mach readouts.

Routes mirror the live site's slugs (`/products`, `/services`, `/tot-and-consultation`, `/edtech`, `/about`,
`/contact`) so existing links would keep working.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 3 · three.js (raw, no react-three-fiber) · Framer Motion · Lenis

## Run it

```bash
npm install
npm run dev
```

## Honest notes

- **Telemetry figures are invented.** Chamber pressure, mixture ratio and Isp in the hero simulation are
  plausible placeholders, labelled "simulated" on screen, and live in `src/data/simulated.ts`. They are not
  Prime Toolings test data.
- **Photographs belong to Prime Toolings** and are hotlinked from their current site's CDN rather than copied
  into this repository. They would be self-hosted before any real launch.
- **The logo is a typographic stand-in** until the real vector artwork is available.
- **The contact form doesn't submit anywhere**; it shows a success state and says so.
- Product copy comes from Prime Toolings' own published material. Everything real lives in `src/config/brand.ts`
  and `src/data/`.

Code © Quietbuild Labs. Prime Toolings' brand, copy and photography remain theirs.
