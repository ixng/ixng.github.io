import type { LinkItem } from '../../data/content.ts'
import Ground from '../Ground/Ground.tsx'
import LinkRow from '../LinkButton/LinkRow.tsx'
import PanelFrame from '../PanelFrame/PanelFrame.tsx'
import Scenery from '../Scenery/Scenery.tsx'
import Sky from '../Sky/Sky.tsx'
import styles from './Surface.module.css'

interface SurfaceProps {
  intro: {
    name: string
    tagline: string
    overview: { title: string; paragraphs: string[] }
    workingOn: { title: string; text: string }
    outsideCoding: { title: string; before: string; highlight: string; after: string }
    links: LinkItem[]
  }
}

/** Layer 1: name, tagline, links and three text panels (overview, working on, outside of coding). */
export default function Surface({ intro }: SurfaceProps) {
  return (
    <section id="surface" className={styles.surface} aria-labelledby="surface-title">
      <Sky />
      <div className={styles.intro}>
        <h1 id="surface-title" className={styles.name}>
          {intro.name}
        </h1>
        <p className={styles.tagline}>{intro.tagline}</p>
        <LinkRow links={intro.links} className={styles.links} />
        <PanelFrame className={styles.overview}>
          <h2 className={styles.panelTitle}>{intro.overview.title}</h2>
          {intro.overview.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </PanelFrame>
        <PanelFrame className={styles.workingOn}>
          <h2 className={styles.panelTitle}>{intro.workingOn.title}</h2>
          <p>{intro.workingOn.text}</p>
        </PanelFrame>
        <PanelFrame className={styles.outsideCoding}>
          <h2 className={styles.panelTitle}>{intro.outsideCoding.title}</h2>
          <p>
            {intro.outsideCoding.before}
            <strong className={styles.highlight}>{intro.outsideCoding.highlight}</strong>
            {intro.outsideCoding.after}
          </p>
        </PanelFrame>
      </div>
      <Scenery />
      <Ground />
    </section>
  )
}
