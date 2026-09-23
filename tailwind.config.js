/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Hex values (not CSS vars) so opacity modifiers like text-bone/60 work.
      // Light theme: void = page white, hull/panel = warm off-white surfaces, bone = ink.
      // Keep in sync with :root in src/index.css.
      colors: {
        void: '#ffffff',
        hull: '#f5f4f0',
        panel: '#edebe6',
        steel: '#e0ddd6',
        bone: '#0e1013',
        ash: '#4d525a',
        dim: '#7a7f87',
        ignition: '#f2461a',
        flare: '#ff5a26',
        ember: '#c2361a',
        lox: '#1d74c0',
        nominal: '#14935b',
      },
      fontFamily: {
        display: ["'Switzer'", 'system-ui', 'sans-serif'],
        body: ["'Switzer'", 'system-ui', 'sans-serif'],
        mono: ["'IBM Plex Mono'", 'ui-monospace', 'monospace'],
      },
      zIndex: {
        canvas: '0',
        content: '10',
        nav: '40',
        menu: '50',
      },
      maxWidth: {
        page: '1440px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        inout: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
