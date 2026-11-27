# ixng.github.io

Ian Gitau's portfolio: a single page styled as a cross-section of a Terraria world, from the surface down to the deep caverns. Built with React, Vite and TypeScript. `CLAUDE.md` is the project brief and `mock/` is the approved design.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
npm run preview    # serve dist/ locally
npm run lint       # oxlint
```

### Sprites

The cropped Terraria sprites in `public/sprites/` are committed and deployed. The raw reference sheets they come from (`reference-sprites/`) stay local and gitignored. To regenerate the crops:

```bash
python3 mock/tools/extract_sprites.py --out public/sprites
```

`vite.config.ts` checks whether `public/sprites/` exists at build time, and if it does, `src/assets/sprites.ts` turns the sprite layer on. Without the folder, every element uses its plain CSS fallback. Add `?sprites=off` to the URL to preview the fallbacks. Restart the dev server after adding or removing the folder.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages. One-off setup: Settings → Pages → Source → "GitHub Actions".

Before pushing, check that none of the raw reference sheets are tracked:

```bash
git ls-files reference-sprites
```

It should print nothing.

## Where things live

- **All copy and links:** `src/data/content.ts`. Components contain no text of their own.
- **Sprite file names:** `src/assets/sprites.ts`. To use your own art, replace the files (or change the names there).
- **Design tokens** (colours, spacing, sprite scale, motion timings): the top of `src/styles/global.css`.
- **Component styles:** one `.module.css` next to each component.
- **CV:** `public/cv.pdf`. Visitors download it as "Ian Gitau CV.pdf" (the name is set in `content.ts`).
- **Link-preview image:** `public/og-image.png` (1200×630, a capture of the surface). Its size and alt text are in `index.html`.

## Component tree

```
App                        src/App.tsx
├── DepthMeter             fixed side nav, hidden on mobile
└── main
    ├── Surface            name, tagline, links
    │   ├── Sky            sun, drifting clouds
    │   ├── LinkRow → LinkButton → Icon
    │   ├── PanelFrame ×3  overview, "Working on", "Outside of Coding"
    │   ├── Scenery        parallax hills, trees
    │   └── Ground         grass (swaying plants) and dirt
    ├── Underground        → Layer (+ LayerEdge)
    │   └── TimelineEntry  → Torch, PanelFrame, Bullets
    ├── Caverns            → Layer
    │   └── Chest          → Ledge, PanelFrame, Tags, Bullets
    └── DeepCaverns        → Layer
        ├── PanelFrame     contact panel: CopyEmail, LinkRow
        ├── GemVein ×4
        └── Pool
```

Hooks: `src/hooks/useScrollTracking.ts` and `src/hooks/useMediaQuery.ts`.

## React patterns used

- **Components and props.** Each piece of the page is a function that takes props and returns JSX. Data flows one way: `App.tsx` imports `content.ts` and passes each layer its slice (`<Caverns projects={projects} />`), and layers pass smaller pieces down (`Caverns.tsx` → `Chest`).
- **`children` and slot props.** `Layer.tsx` renders the shared wall, edge and header, and puts whatever you nest inside it in the content column. Its `decor` prop takes extra JSX for outside the column (the gem veins and pool in `DeepCaverns.tsx`).
- **Typed props.** Every component declares an `interface ...Props`. The data types (`Project`, `Experience`, ...) live in `content.ts`, and `satisfies` checks the data against them.
- **Lists and keys.** `.map()` renders repeated items, with a stable `key` from the data (`project.slug` in `Caverns.tsx`, `entry.role` in `Underground.tsx`).
- **Conditional rendering.** `{hint && <p>...}` in `Layer.tsx`, the optional demo link in `Chest.tsx`, and the "present" end date in `TimelineEntry.tsx`.
- **State.** `useState` holds values that change the output. `Chest.tsx` keeps three booleans (pinned, hovered, keyboard focus) and derives `open` from them instead of storing it. `CopyEmail.tsx` keeps `isCopied`.
- **Event handlers.** `onClick`, `onMouseEnter/Leave`, `onFocus/onBlur` in `Chest.tsx`. Focus events bubble in React, so the chest hears focus on any link inside it.
- **Effects with cleanup.** `useEffect` connects a component to something outside React and undoes it on unmount: the 2-second reset timer in `CopyEmail.tsx`, the media-query listener in `useMediaQuery.ts`, the scroll listener in `useScrollTracking.ts`, and the `ResizeObserver` in `DepthMeter.tsx`.
- **Refs.** `useRef` gives `DepthMeter.tsx` the real `<ol>` element so it can measure where each node sits.
- **Custom hooks.** `useScrollTracking` (one passive scroll listener, throttled with `requestAnimationFrame`, drives both the parallax and the depth meter) and `useMediaQuery` (true while a CSS media query matches) package reusable effect logic.
- **Lifting state up.** The scroll position is tracked once in `App.tsx` and passed to `DepthMeter` as `activeIndex` and `progress` props.
- **CSS Modules.** `import styles from './Chest.module.css'` gives class names scoped to that component (`styles.lid`). `composes` reuses another module's class (`CopyEmail` reuses the `LinkButton` look). Rules for sprite mode use `:global([data-sprites="on"])` because that attribute sits on `<html>`, outside the component.
- **CSS custom properties from React.** `DepthMeter.tsx` sets `--marker-y` through `style`, and CSS positions the gold marker. `src/globals.d.ts` teaches TypeScript that `style` may contain `--*` properties.
- **StrictMode.** `main.tsx` wraps the app in `<StrictMode>`, which runs effects twice in development to catch missing cleanups.
