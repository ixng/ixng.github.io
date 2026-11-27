import type { LinkItem } from '../../data/content.ts'
import LinkButton from './LinkButton.tsx'
import styles from './LinkRow.module.css'

interface LinkRowProps {
  links: LinkItem[]
  className?: string
}

/** A wrapping row of link buttons. */
export default function LinkRow({ links, className = '' }: LinkRowProps) {
  return (
    <ul className={`${styles.row} ${className}`}>
      {links.map((link) => (
        <li key={link.label}>
          <LinkButton link={link} />
        </li>
      ))}
    </ul>
  )
}
