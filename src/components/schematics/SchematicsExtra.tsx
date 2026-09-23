// Rotating detonation, pulse detonation, ramjet and injector drawings (240 × 140 viewBox).

const LINE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1 } as const
const HOT = { fill: 'none', stroke: '#f2461a', strokeWidth: 1.4 } as const

export function Rde() {
  const ticks = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2)
  return (
    <>
      <circle cx="120" cy="70" r="50" {...LINE} />
      <circle cx="120" cy="70" r="34" {...LINE} />
      {ticks.map((a) => (
        <line
          key={a}
          x1={120 + Math.cos(a) * 50}
          y1={70 + Math.sin(a) * 50}
          x2={120 + Math.cos(a) * 55}
          y2={70 + Math.sin(a) * 55}
          {...LINE}
          opacity="0.5"
        />
      ))}
      <g className="animate-[spin_1.6s_linear_infinite] group-hover:animate-[spin_0.6s_linear_infinite]" style={{ transformOrigin: '120px 70px' }}>
        <path d="M120 28 A42 42 0 0 1 150 40" stroke="#f2461a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="150" cy="40" r="3" fill="#fff5ea" />
      </g>
      <text x="120" y="74" textAnchor="middle" fontSize="8" fill="currentColor" className="mono">
        ANNULUS
      </text>
    </>
  )
}

export function Pulse() {
  return (
    <>
      <rect x="20" y="56" width="160" height="28" {...LINE} />
      <rect x="12" y="62" width="8" height="16" fill="#f2461a" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d="M32 60 Q40 70 32 80"
          {...HOT}
          strokeWidth="2"
          className="animate-[pulse-travel_1.4s_linear_infinite]"
          style={{ animationDelay: `${i * 0.46}s` }}
        />
      ))}
      <path d="M180 56 L206 40 M180 84 L206 100" {...LINE} />
      <text x="100" y="108" textAnchor="middle" fontSize="8" fill="currentColor" className="mono">
        5 – 45 HZ
      </text>
    </>
  )
}

export function Ramjet() {
  return (
    <>
      <path d="M8 70 L64 58 L64 82 Z" {...LINE} fill="rgba(14,16,19,0.07)" />
      <path d="M44 38 H150 L170 46 L222 32 M44 102 H150 L170 94 L222 108" {...LINE} />
      {[104, 118].map((x) => (
        <path key={x} d={`M${x} 60 l8 10 l-8 10`} {...LINE} opacity="0.7" />
      ))}
      {[48, 62, 78, 92].map((y) => (
        <line key={y} x1="0" y1={y} x2="120" y2={y} {...LINE} stroke="#1d74c0" opacity="0.6" className="flow" />
      ))}
      <path d="M126 58 H236 M126 70 H236 M126 82 H236" {...HOT} className="flow" />
    </>
  )
}

export function InjectorFace() {
  const rings = [
    { r: 14, n: 6 },
    { r: 28, n: 12 },
    { r: 41, n: 18 },
  ]
  return (
    <>
      <circle cx="74" cy="70" r="52" {...LINE} />
      <circle cx="74" cy="70" r="3" fill="#f2461a" />
      {rings.map(({ r, n }) =>
        Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2
          return <circle key={`${r}-${i}`} cx={74 + Math.cos(a) * r} cy={70 + Math.sin(a) * r} r="2" {...LINE} />
        }),
      )}
      <rect x="150" y="26" width="64" height="44" {...LINE} />
      <path d="M162 26 V70 M182 26 V70 M202 26 V70" {...LINE} opacity="0.5" />
      {[162, 182, 202].map((x) => (
        <path key={x} d={`M${x} 72 L${x - 8} 112 M${x} 72 L${x + 8} 112`} {...HOT} className="flow" />
      ))}
    </>
  )
}
