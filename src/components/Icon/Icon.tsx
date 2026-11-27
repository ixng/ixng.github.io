import type { IconName } from '../../data/content.ts'
import styles from './Icon.module.css'

interface IconProps {
  name: IconName
}

/** A 16px pixel icon. Decorative: the button text next to it carries the meaning. */
export default function Icon({ name }: IconProps) {
  return <span className={`${styles.icon} ${styles[name]}`} aria-hidden="true" />
}
