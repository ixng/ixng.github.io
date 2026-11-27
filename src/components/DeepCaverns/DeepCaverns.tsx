import type { LinkItem } from '../../data/content.ts'
import CopyEmail from '../CopyEmail/CopyEmail.tsx'
import GemVein from '../GemVein/GemVein.tsx'
import Layer from '../Layer/Layer.tsx'
import LinkRow from '../LinkButton/LinkRow.tsx'
import PanelFrame from '../PanelFrame/PanelFrame.tsx'
import Pool from '../Pool/Pool.tsx'
import styles from './DeepCaverns.module.css'

interface DeepCavernsProps {
  contact: {
    eyebrow: string
    title: string
    lead: string
    email: {
      label: string
      address: string
      copy: string
      copied: string
      copiedStatus: string
    }
    links: LinkItem[]
  }
}

/** Layer 4: contact details, with gem veins in the walls and a pool at the bottom. */
export default function DeepCaverns({ contact }: DeepCavernsProps) {
  const decor = (
    <>
      <GemVein gem="ruby" position="a" />
      <GemVein gem="sapphire" position="b" />
      <GemVein gem="sapphire" position="c" />
      <GemVein gem="ruby" position="d" />
      <Pool />
    </>
  )

  return (
    <Layer
      id="deep"
      variant="deep"
      eyebrow={contact.eyebrow}
      title={contact.title}
      titleId="contact-title"
      decor={decor}
    >
      <PanelFrame className={styles.contact}>
        <p className={styles.lead}>{contact.lead}</p>
        <CopyEmail {...contact.email} />
        <LinkRow links={contact.links} className={styles.links} />
      </PanelFrame>
    </Layer>
  )
}
