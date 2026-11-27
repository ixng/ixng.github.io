import styles from './Tags.module.css'

interface TagsProps {
  tags: string[]
  /** Accessible name for the list, e.g. "Tech used". */
  label: string
  className?: string
}

export default function Tags({ tags, label, className = '' }: TagsProps) {
  return (
    <ul className={`${styles.tags} ${className}`} aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  )
}
