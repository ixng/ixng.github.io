import styles from './Ledge.module.css'

interface LedgeProps {
  className?: string
  onClick?: () => void
}

/** The stone ledge a chest sits on. Decorative (clicking it toggles the chest). */
export default function Ledge({ className = '', onClick }: LedgeProps) {
  return <div className={`${styles.ledge} ${className}`} onClick={onClick} aria-hidden="true" />
}
