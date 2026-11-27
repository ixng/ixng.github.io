import type { Project } from '../../data/content.ts'
import Chest from '../Chest/Chest.tsx'
import Layer from '../Layer/Layer.tsx'
import styles from './Caverns.module.css'

interface CavernsProps {
  projects: {
    eyebrow: string
    title: string
    hint: string
    tagsLabel: string
    repoLabel: string
    demoLabel: string
    items: Project[]
  }
}

/** Layer 3: one project chest per row. */
export default function Caverns({ projects }: CavernsProps) {
  return (
    <Layer
      id="caverns"
      variant="caverns"
      eyebrow={projects.eyebrow}
      title={projects.title}
      titleId="projects-title"
      hint={projects.hint}
    >
      <ul className={styles.chests}>
        {projects.items.map((project) => (
          <li key={project.slug}>
            <Chest
              project={project}
              tagsLabel={projects.tagsLabel}
              repoLabel={projects.repoLabel}
              demoLabel={projects.demoLabel}
            />
          </li>
        ))}
      </ul>
    </Layer>
  )
}
