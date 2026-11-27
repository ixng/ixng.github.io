import styles from './Scenery.module.css'

/** Hills (with parallax) and trees standing on the ground. Decorative. */
export default function Scenery() {
  return (
    <div className={styles.scenery} aria-hidden="true">
      <div className={`${styles.hills} ${styles.back}`} />
      <div className={`${styles.hills} ${styles.mid}`} />
      <div className={`${styles.hills} ${styles.front}`} />
      <div className={`${styles.tree} ${styles.treeA}`} />
      <div className={`${styles.tree} ${styles.treeB}`} />
      <div className={`${styles.tree} ${styles.treeC}`} />
    </div>
  )
}
