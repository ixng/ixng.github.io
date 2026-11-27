import { existsSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// When public/sprites/ exists, the app switches the sprite layer on (see
// src/assets/sprites.ts). Without it, every element uses its CSS fallback.
// Restart the dev server after adding or deleting the folder.
const hasSprites = existsSync(new URL('./public/sprites/chest.png', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __HAS_SPRITES__: JSON.stringify(hasSprites),
  },
})
