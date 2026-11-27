import styles from './LayerEdge.module.css'

export type EdgeVariant = 'dirt-stone' | 'stone-cavern' | 'cavern-deep'

interface LayerEdgeProps {
  variant: EdgeVariant
}

const variantClass = {
  'dirt-stone': styles.dirtStone,
  'stone-cavern': styles.stoneCavern,
  'cavern-deep': styles.cavernDeep,
}

/** The jagged tile edge on top of a layer, overlapping the layer above. */
export default function LayerEdge({ variant }: LayerEdgeProps) {
  return <div className={`${styles.edge} ${variantClass[variant]}`} aria-hidden="true" />
}
