import type { ReactNode } from 'react'
import LayerEdge from './LayerEdge.tsx'
import styles from './Layer.module.css'

type LayerVariant = 'underground' | 'caverns' | 'deep'

interface LayerProps {
  id: string
  variant: LayerVariant
  eyebrow: string
  title: string
  /** id for the <h2>, used by aria-labelledby on the section. */
  titleId: string
  hint?: string
  /** Decorative extras outside the content column (gem veins, the pool). */
  decor?: ReactNode
  children: ReactNode
}

// Each layer has a jagged edge where it meets the layer above.
const edges = {
  underground: 'dirt-stone',
  caverns: 'stone-cavern',
  deep: 'cavern-deep',
} as const

/** Shared wrapper for the three underground layers: wall, jagged edge, header. */
export default function Layer({ id, variant, eyebrow, title, titleId, hint, decor, children }: LayerProps) {
  return (
    <section id={id} className={`${styles.layer} ${styles[variant]}`} aria-labelledby={titleId}>
      <LayerEdge variant={edges[variant]} />
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {hint && <p className={styles.hint}>{hint}</p>}
        </header>
        {children}
      </div>
      {decor}
    </section>
  )
}
