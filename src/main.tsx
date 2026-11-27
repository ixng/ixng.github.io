import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { applySprites } from './assets/sprites.ts'
import App from './App.tsx'

// Before the first render, so the page never flashes the fallbacks.
applySprites(document.documentElement)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
