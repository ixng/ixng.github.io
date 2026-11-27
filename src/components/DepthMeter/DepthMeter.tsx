import { useEffect, useRef, useState } from 'react'
import type { DepthLayer } from '../../data/content.ts'
import styles from './DepthMeter.module.css'

interface DepthMeterProps {
  label: string
  layers: DepthLayer[]
  /** Index of the layer in view (from useScrollTracking). */
  activeIndex: number
  /** 0 to 1: how far through the current layer the visitor has scrolled. */
  progress: number
}

/** Fixed side navigation styled like the game's depth meter. Hidden on mobile. */
export default function DepthMeter({ label, layers, activeIndex, progress }: DepthMeterProps) {
  const listRef = useRef<HTMLOListElement>(null)
  // Vertical centre of each node, in px from the top of the list.
  const [centres, setCentres] = useState<number[]>([])

  // Measure the nodes when the list first gets a size and whenever it changes
  // (web font loading, window resize, switching up from the mobile layout).
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const observer = new ResizeObserver(() => {
      const links = list.querySelectorAll('a')
      setCentres(Array.from(links, (link) => link.offsetTop + link.offsetHeight / 2))
    })
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  // The gold marker slides from this layer's node towards the next one. It sits
  // behind the nodes, so at progress 0 (and in the last layer) it is hidden.
  const from = centres[activeIndex] ?? 0
  const to = centres[activeIndex + 1] ?? from
  const markerY = Math.round(from + (to - from) * progress)

  return (
    <nav className={styles.meter} aria-label={label}>
      <p className={styles.readout} aria-hidden="true">
        {layers[activeIndex].readout}
      </p>
      <ol ref={listRef} className={styles.list} style={{ '--marker-y': `${markerY}px` }}>
        {layers.map((layer, i) => (
          <li key={layer.id}>
            <a
              className={styles.link}
              href={`#${layer.id}`}
              data-layer={layer.id}
              aria-current={i === activeIndex ? 'location' : undefined}
            >
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.label}>
                {layer.name} <small>{layer.sub}</small>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
