import { StrictMode } from 'react'

import { MotionGlobalConfig } from 'framer-motion'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import './index.css'

// Every visit starts at the hero; the intro sequence depends on it.
window.history.scrollRestoration = 'manual'

// Dev only: `?still` jumps every framer-motion animation to its end state (for screenshot QA).
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('still')) {
  MotionGlobalConfig.instantAnimations = true
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
