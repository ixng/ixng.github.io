import type { Experience } from '../../data/content.ts'
import Layer from '../Layer/Layer.tsx'
import TimelineEntry from '../TimelineEntry/TimelineEntry.tsx'
import styles from './Underground.module.css'

interface UndergroundProps {
  experience: {
    eyebrow: string
    title: string
    dateSeparator: string
    present: string
    entries: Experience[]
  }
}

/** Layer 2: experience as panels hanging off a mineshaft rope. */
export default function Underground({ experience }: UndergroundProps) {
  return (
    <Layer
      id="underground"
      variant="underground"
      eyebrow={experience.eyebrow}
      title={experience.title}
      titleId="experience-title"
    >
      <ol className={styles.mineshaft}>
        {experience.entries.map((entry, i) => (
          <TimelineEntry
            key={entry.role}
            entry={entry}
            side={i % 2 === 0 ? 'right' : 'left'}
            dateSeparator={experience.dateSeparator}
            present={experience.present}
          />
        ))}
      </ol>
    </Layer>
  )
}
