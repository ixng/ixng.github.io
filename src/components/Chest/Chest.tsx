import { useState, type FocusEvent } from 'react'
import type { Project } from '../../data/content.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery.ts'
import Bullets from '../Bullets/Bullets.tsx'
import Ledge from '../Ledge/Ledge.tsx'
import PanelFrame from '../PanelFrame/PanelFrame.tsx'
import Tags from '../Tags/Tags.tsx'
import styles from './Chest.module.css'

interface ChestProps {
  project: Project
  tagsLabel: string
  repoLabel: string
  demoLabel: string
}

/**
 * A project chest. It is open while any of these is true:
 * - pinned: toggled by clicking/tapping the chest, ledge or label, or Enter/Space on the title button;
 * - hovered: the mouse is over the row (only on hover-capable screens 768px and up,
 *   because touch browsers keep :hover stuck after a tap);
 * - focusVisible: keyboard focus is somewhere inside the chest.
 */
export default function Chest({ project, tagsLabel, repoLabel, demoLabel }: ChestProps) {
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focusVisible, setFocusVisible] = useState(false)
  const canHover = useMediaQuery('(hover: hover) and (min-width: 768px)')

  const open = pinned || (hovered && canHover) || focusVisible
  const lootId = `loot-${project.slug}`
  const hasLinks = Boolean(project.repoUrl || project.demoUrl)

  function togglePinned() {
    setPinned((value) => !value)
  }

  // Focus events bubble in React, so these fire for the button and the links inside.
  function handleFocus(event: FocusEvent) {
    setFocusVisible(event.target.matches(':focus-visible'))
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusVisible(false)
  }

  return (
    <article
      className={`${styles.chest} ${open ? styles.open : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* No open-chest sprite exists, so the lid lifts as its own element. */}
      <div className={styles.sprite} onClick={togglePinned} aria-hidden="true">
        <span className={styles.inside} />
        <span className={styles.base} />
        <span className={styles.lid} />
      </div>
      <Ledge className={styles.ledge} onClick={togglePinned} />

      {/* Clicks on the title button bubble up to the label, so it toggles once. */}
      <PanelFrame className={styles.label} onClick={togglePinned}>
        <h3 className={styles.title}>
          <button className={styles.toggle} type="button" aria-expanded={open} aria-controls={lootId}>
            {project.name}
            <span className={styles.hint} aria-hidden="true" />
          </button>
        </h3>
        {project.badge && <p className={styles.badge}>{project.badge}</p>}
        <p className={styles.summary}>{project.summary}</p>
        <Tags tags={project.tags} label={tagsLabel} className={styles.tags} />
      </PanelFrame>

      <PanelFrame className={styles.loot} id={lootId}>
        <Bullets items={project.bullets} />
        {hasLinks && (
          <p className={styles.links}>
            {project.repoUrl && (
              <a className={styles.link} href={project.repoUrl}>
                {repoLabel}
              </a>
            )}
            {project.demoUrl && (
              <a className={styles.link} href={project.demoUrl}>
                {demoLabel}
              </a>
            )}
          </p>
        )}
      </PanelFrame>
    </article>
  )
}
