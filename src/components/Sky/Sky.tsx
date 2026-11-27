import styles from './Sky.module.css'

/** Sun and drifting clouds behind the intro. Decorative. */
export default function Sky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      <div className={styles.sun} />
      <div className={`${styles.cloud} ${styles.cloud1}`} />
      <div className={`${styles.cloud} ${styles.cloud2}`} />
      <div className={`${styles.cloud} ${styles.cloud3}`} />
      <div className={`${styles.cloud} ${styles.cloud4}`} />
    </div>
  )
}
