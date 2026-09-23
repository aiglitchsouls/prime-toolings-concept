/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Hex values (not CSS vars) so opacity modifiers like text-bone/60 work.
      // Keep in sync with :root in src/index.css.
      colors: {
        void: '#050608',
        hull: '#0a0c0f',
        panel: '#101318',
        steel: '#1b1f25',
        bone: '#ece8e1',
        ash: '#9a9ea5',
        dim: '#62666d',
        ignition: '#ff4d1a',
        flare: '#ff7a3d',
        ember: '#b8321a',
        lox: '#8fd3ff',
        nominal: '#5be49b',
      },
      fontFamily: {
        display: ["'Archivo'", 'system-ui', 'sans-serif'],
        body: ["'Archivo'", 'system-ui', 'sans-serif'],
        mono: ["'Martian Mono'", 'ui-monospace', 'monospace'],
      },
      zIndex: {
        canvas: '0',
        content: '10',
        nav: '40',
        menu: '50',
        curtain: '60',
        cursor: '70',
        boot: '80',
      },
      maxWidth: {
        page: '1360px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        inout: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
