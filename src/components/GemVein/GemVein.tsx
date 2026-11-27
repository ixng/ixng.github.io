import styles from './GemVein.module.css'

interface GemVeinProps {
  gem: 'ruby' | 'sapphire'
  /** One of four fixed spots on the deep cavern walls. */
  position: 'a' | 'b' | 'c' | 'd'
}

/** A stepped cluster of gem ore set into the wall. Decorative. */
export default function GemVein({ gem, position }: GemVeinProps) {
  return <div className={`${styles.vein} ${styles[gem]} ${styles[position]}`} aria-hidden="true" />
}
