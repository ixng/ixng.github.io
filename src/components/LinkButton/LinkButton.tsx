import type { LinkItem } from '../../data/content.ts'
import Icon from '../Icon/Icon.tsx'
import styles from './LinkButton.module.css'

interface LinkButtonProps {
  link: LinkItem
}

export default function LinkButton({ link }: LinkButtonProps) {
  return (
    <a className={styles.button} href={link.href} download={link.download}>
      <Icon name={link.icon} />
      {link.label}
    </a>
  )
}
