import 'react'

declare global {
  /** True when public/sprites/ existed at build time (set in vite.config.ts). */
  const __HAS_SPRITES__: boolean
}

// Lets inline styles set CSS custom properties, e.g. style={{ '--marker-y': '20px' }}.
declare module 'react' {
  interface CSSProperties {
    [property: `--${string}`]: string | number
  }
}
