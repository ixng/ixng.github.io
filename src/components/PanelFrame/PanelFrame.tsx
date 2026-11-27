import type { ReactNode } from 'react'
import styles from './PanelFrame.module.css'

interface PanelFrameProps {
  /** Which element to render. Defaults to a <div>. */
  as?: 'div' | 'article'
  className?: string
  id?: string
  onClick?: () => void
  children: ReactNode
}

/** The pixel panel frame used for every block of text. Pure CSS for now. */
export default function PanelFrame({ as: Tag = 'div', className = '', children, ...rest }: PanelFrameProps) {
  return (
    <Tag className={`${styles.panel} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
