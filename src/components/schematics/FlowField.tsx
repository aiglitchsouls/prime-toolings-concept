// Animated streamlines bending around a body: stands in for a CFD result on the services page.

const LINES = Array.from({ length: 13 }, (_, i) => 30 + i * 20)

function streamline(y: number) {
  const offset = y - 150
  const push = Math.sign(offset || 1) * Math.max(0, 70 - Math.abs(offset)) * 0.9
  return `M0 ${y} C120 ${y} 150 ${y + push} 240 ${y + push} S360 ${y} 480 ${y}`
}

export function FlowField({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 300" className={className} aria-hidden>
      <defs>
        <linearGradient id="flow-heat" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#1d74c0" />
          <stop offset="0.55" stopColor="#0e1013" />
          <stop offset="1" stopColor="#f2461a" />
        </linearGradient>
      </defs>
      {LINES.map((y, i) => (
        <path
          key={y}
          d={streamline(y)}
          fill="none"
          stroke="url(#flow-heat)"
          strokeWidth="1.2"
          className="flow"
          style={{ animationPlayState: 'running', animationDuration: `${1.1 + (i % 4) * 0.25}s` }}
        />
      ))}
      <ellipse cx="240" cy="150" rx="70" ry="44" fill="#ffffff" stroke="#0e1013" strokeOpacity="0.5" />
      <path d="M190 150 H290" stroke="#0e1013" strokeOpacity="0.25" strokeDasharray="3 5" />
    </svg>
  )
}
