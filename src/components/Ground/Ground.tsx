import styles from './Ground.module.css'

/** One row of grass (with swaying plants) over two rows of dirt. Decorative. */
export default function Ground() {
  return (
    <div className={styles.ground} aria-hidden="true">
      <div className={styles.grass} />
      <div className={styles.dirt} />
    </div>
  )
}
