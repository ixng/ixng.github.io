import Caverns from './components/Caverns/Caverns.tsx'
import DeepCaverns from './components/DeepCaverns/DeepCaverns.tsx'
import DepthMeter from './components/DepthMeter/DepthMeter.tsx'
import Surface from './components/Surface/Surface.tsx'
import Underground from './components/Underground/Underground.tsx'
import { contact, depthMeter, experience, intro, projects, site } from './data/content.ts'
import { useScrollTracking } from './hooks/useScrollTracking.ts'

// Outside the component so the array is created once and the hook's effect
// doesn't re-run on every render.
const layerIds = depthMeter.layers.map((layer) => layer.id)

export default function App() {
  const { index, progress } = useScrollTracking(layerIds)

  return (
    <>
      <a className="skip-link" href="#main">
        {site.skipLink}
      </a>
      <DepthMeter label={depthMeter.label} layers={depthMeter.layers} activeIndex={index} progress={progress} />
      <main id="main">
        <Surface intro={intro} />
        <Underground experience={experience} />
        <Caverns projects={projects} />
        <DeepCaverns contact={contact} />
      </main>
    </>
  )
}
