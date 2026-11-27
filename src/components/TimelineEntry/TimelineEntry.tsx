import type { Experience } from '../../data/content.ts'
import Bullets from '../Bullets/Bullets.tsx'
import PanelFrame from '../PanelFrame/PanelFrame.tsx'
import Torch from '../Torch/Torch.tsx'
import styles from './TimelineEntry.module.css'

interface TimelineEntryProps {
  entry: Experience
  /** Which side of the rope the panel hangs on (only used at 1280px and up). */
  side: 'left' | 'right'
  dateSeparator: string
  present: string
}

/** One role: a panel tied to the rope, with a torch on the wall. */
export default function TimelineEntry({ entry, side, dateSeparator, present }: TimelineEntryProps) {
  return (
    <li className={`${styles.entry} ${styles[side]}`}>
      <Torch className={styles.torch} />
      <span className={styles.hook} aria-hidden="true" />
      <PanelFrame as="article" className={styles.panel}>
        <h3 className={styles.role}>{entry.role}</h3>
        <p className={styles.org}>{entry.org}</p>
        <p className={styles.dates}>
          <time dateTime={entry.start.datetime}>{entry.start.label}</time> {dateSeparator}{' '}
          {entry.end ? <time dateTime={entry.end.datetime}>{entry.end.label}</time> : present}
        </p>
        <Bullets items={entry.bullets} className={styles.bullets} />
      </PanelFrame>
    </li>
  )
}
