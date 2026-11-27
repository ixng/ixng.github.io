import { useEffect, useState } from 'react'

export interface ScrollPosition {
  /** Index of the layer currently in view. */
  index: number
  /** How far through that layer you are, from 0 to 1. */
  progress: number
}

/** A layer becomes current once its top passes this far down the viewport. */
const ACTIVE_LINE = 0.4

/**
 * One scroll handler for the whole page (passive listener + requestAnimationFrame):
 * - writes the scroll position to --scroll-y on <html> for the surface parallax
 *   (kept at 0 when the visitor prefers reduced motion);
 * - returns which layer is current and how far through it you are, for the depth meter.
 *
 * Each layer "starts" at the scroll position where its top crosses the 40% line
 * (the first layer starts at 0). Starts are clamped to the maximum scroll, so a
 * short last layer still becomes current at the very bottom of the page.
 */
export function useScrollTracking(layerIds: string[]): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({ index: 0, progress: 0 })

  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function update() {
      frame = 0
      const scrollY = window.scrollY

      root.style.setProperty('--scroll-y', reducedMotion.matches ? '0px' : `${scrollY}px`)

      const line = window.innerHeight * ACTIVE_LINE
      const maxScroll = root.scrollHeight - window.innerHeight
      const y = Math.min(Math.max(scrollY, 0), maxScroll)

      const starts = layerIds.map((id, i) => {
        const layer = document.getElementById(id)
        if (i === 0 || !layer) return 0
        const top = layer.getBoundingClientRect().top + scrollY
        return Math.min(Math.max(top - line, 0), maxScroll)
      })

      let index = 0
      starts.forEach((start, i) => {
        if (y >= start) index = i
      })

      const next = starts[index + 1] ?? starts[index]
      const span = next - starts[index]
      const progress = span > 0 ? (y - starts[index]) / span : 0 // last layer: 0

      // Returning the previous object skips a re-render when nothing changed.
      setPosition((prev) =>
        prev.index === index && prev.progress === progress ? prev : { index, progress },
      )
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    reducedMotion.addEventListener('change', onScroll)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      reducedMotion.removeEventListener('change', onScroll)
      cancelAnimationFrame(frame)
      root.style.removeProperty('--scroll-y')
    }
  }, [layerIds])

  return position
}
