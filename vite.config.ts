import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // three.js + post-processing ship as one lazy chunk (~155 kB gzip); that size is expected.
    chunkSizeWarningLimit: 700,
  },
})
