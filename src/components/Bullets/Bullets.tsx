import styles from './Bullets.module.css'

interface BulletsProps {
  items: string[]
  className?: string
}

/** A list with square gold bullets. */
export default function Bullets({ items, className = '' }: BulletsProps) {
  return (
    <ul className={`${styles.bullets} ${className}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
