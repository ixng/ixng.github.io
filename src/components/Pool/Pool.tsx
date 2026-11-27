import styles from './Pool.module.css'

// The water surface is a row of 64px segments, all running the same animation.
const SEGMENTS = 12

/** A still pool in a stepped basin cut into the cavern floor. Decorative. */
export default function Pool() {
  return (
    <div className={styles.pool} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.rim} />
      <div className={styles.water}>
        <div className={styles.surface}>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className={styles.body} />
      </div>
      <div className={styles.stone} />
    </div>
  )
}
