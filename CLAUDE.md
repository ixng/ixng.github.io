# ixng.github.io: Terraria-themed portfolio

Ian's personal portfolio. A single page, deployed to GitHub Pages at https://ixng.github.io. It is styled like a vertical cross-section of a Terraria world: visitors scroll from the surface down into the deep caverns. It is for summer 2027 software engineering internship applications, so recruiters must be able to read it at a glance. The theme is strong but never gets in the way of the content.

Ian is using this project to learn React. Code should follow normal, idiomatic React patterns, not clever ones.

## Workflow

The work happens in two phases, done by separate agents. Do not start Phase 2 until Ian has approved the mock.

### Phase 1: Design agent

- Produce a static HTML/CSS mock in `mock/` (`mock/index.html`, `mock/styles.css`). Use no JavaScript beyond what is needed to demo hover/tap states.
- Show the desktop and mobile layouts at equal fidelity. Use real media queries so Ian can resize the browser to check both.
- Use the reference sprites in `reference-sprites/` (see Assets).
- Use placeholder copy throughout (see Content).
- At the top of `mock/styles.css`, define design tokens as CSS custom properties: palette per layer, spacing scale, sprite scale, font stacks, breakpoints. The build agent will reuse them.
- When done, write `mock/NOTES.md`. List each component the build agent should create, the states each one has (closed/open, hover/focus), and any decisions the mock makes that this file does not cover.

### Phase 2: Build agent

- Port the approved mock into the React app described under Tech stack. Match the mock visually. If something in the mock can't be built cleanly, ask Ian before changing it.
- Build the whole implementation. Then write a short `README.md` covering: how to run and deploy, the component tree, where content lives, and a brief note on each React pattern used (props, state, effects, refs, and so on), tied to the file that uses it. Keep the explanations short.

## Assets

- `reference-sprites/` holds real Terraria sheets from Ian's PC, owned by Re-Logic. The raw sheets stay local (`reference-sprites/` is in `.gitignore`). The cropped sprites made from them live in `public/sprites/`, which **is committed and deployed** (Ian's decision, 2026-11-26: he found Re-Logic allows reuse of its art outside games). Ian may still replace them with his own art.
- Every sprite path goes through one map, `src/assets/sprites.ts`, so swapping in Ian's original art means changing files, not components.
- Every element that uses a sprite has a CSS fallback (solid colour or simple gradient), so the page stays readable and on-theme with no images loaded (or while they are still loading).
- Sprites are drawn on a 16×16 px grid. Scale only by whole numbers (2× or 3×) and use `image-rendering: pixelated`. Never smooth or blur sprites.
- Animated sprites are horizontal strips of equal-width frames, animated with CSS `steps()`.
- Fonts: an open-licence pixel font for headings (e.g. Pixelify Sans or Silkscreen, self-hosted or Google Fonts) and a clean sans-serif for body text. Do not use Terraria's own font.

Sprites the design needs: grass, dirt, stone, cavern stone and deep cavern stone tiles, plus the transition edges between layers. Also: gem ore tiles; water frames; trees, clouds and sun; rope or ladder and a torch; chest closed/open frames; cavern ledges; a 9-slice panel frame; icons for GitHub, LinkedIn, email and CV.

## Page structure

Four layers, top to bottom. Each layer is as tall as its content (no forced full-screen heights). Layers meet at jagged tile edges, like a cut-away of the world (dirt into stone, stone into cavern, cavern into deep cavern), not straight lines. The page never goes below the caverns: no underworld, lava or hell imagery anywhere.

### 1. Surface (intro)

- Ian's name (pixel font), a one-line tagline ("I like learning new things."), and link buttons: **GitHub, CV download, Email**. No LinkedIn here.
- Under the buttons, an overview panel with Ian's introduction, then a "Working on" panel about his next project, then an "Outside of Coding" panel with his hobbies and the Valorant rank ("top 0.5%" in gold). All his own text, added 2026-11-26 and 27.
- No character sprite and no scroll prompt.
- Grass and dirt ground, with trees and clouds.
- Always daytime: blue sky gradient, sun and clouds. There is no day/night cycle or time-based change.
- Parallax: clouds and trees move at different rates on scroll.

### 2. Underground (experience)

- A mineshaft timeline: a vertical rope or ladder with panels hanging off it, lit by **static** torches (no flicker animation).
- Entries, newest first:
  1. Python Course Leader, Warwick Code Society, from Sep 2026
  2. Backend Software Engineer Intern, Winpact (remote, UK), Nov 2024 to Jan 2025
- Each panel: role title, organisation, dates, 2 or 3 bullets.

### 3. Caverns (projects)

- Five project chests, one per row, stacked top to bottom. In each row the chest sits on a cavern ledge on the left side of the screen, with its text to the right.
- Desktop (1280px and up): chest | closed content | open content, side by side. Medium widths (768 to 1279px): the open content sits under the closed content, to the right of the chest. Mobile: chest and closed content side by side, open content below the row at full width.
- Order: **valstats, Metrolink journey planner, maze-solving robot controller, Precedent, λGPT**.
- A closed chest shows: project name, one-line summary, tech tags.
- An open chest reveals: 2 or 3 bullets, a GitHub repo link (only if the code can be public: the maze-solving robot is coursework, so it has none and is labelled "Coursework"), and a live demo link (only if the project has one).
- Opening: hover on desktop, tap to toggle on touch devices. It must also open on keyboard focus and with Enter/Space, so it works without a mouse. The lid plays a short open animation.
- An open chest must not cover a neighbouring chest's closed content. From 768px up, the open content's space is always reserved, so opening a chest never moves the other rows. On mobile it expands in place and pushes the next row down.

### 4. Deep caverns (contact)

- A second, deeper cavern layer. It must look clearly different from layer 3: darker stone, gem veins in the walls, and a still underground pool with an animated water surface.
- Email (shown as text with a copy button), LinkedIn, GitHub, CV download.
- The Valorant rank now lives in the Surface "Outside of Coding" panel, not in the contact panel (Ian's decision, 2026-11-27).

### Not included

No skills or tech stack section (tech appears only as chest tags). No contact form. No blog.

## Navigation

- Desktop: a fixed depth meter on the side, styled like the game's depth meter. It shows which layer is in view and jumps to a layer on click.
- Progress marker: a small gold box on the depth meter's track shows how far through the current layer you are. It moves from the current layer's node towards the next one as you scroll, reaching the next node exactly when that layer becomes current. It sits behind the nodes, so it is only visible between them. It follows the scroll position directly (no animation), using the same `requestAnimationFrame` scroll handler as the parallax.
- Mobile: no navigation. Hide the depth meter below the mobile breakpoint.

## Motion

- Animations: surface parallax, a slow cloud drift across the sky, swaying grass and flowers on the surface, deep cavern water surface, chest lid opening. Nothing else moves except normal hover states.
- Clouds drift left to right in a loop (far clouds slower than near ones). The drift animates the CSS `translate` property, so it doesn't fight the parallax handler, which sets `transform`.
- Grass sway: the flowers and tall grass along the top of the ground lean gently from side to side (a `skewX` from their base, so the pixels stay crisp). The grass blocks themselves don't move.
- Respect `prefers-reduced-motion`: turn off parallax, cloud drift, grass sway and water animation, and show chests open and closed without the lid animation.
- The scroll handler for parallax uses `requestAnimationFrame` and a passive listener.

## Content

- Use placeholder copy for the tagline, experience bullets and project text, at realistic lengths: a tagline around 10 words, bullets around 15 to 20 words, one-liners under 12 words. The layout must hold when the real copy replaces the placeholders.
- Real values that are known now: name Ian Gitau, GitHub `ixng` (https://github.com/ixng), LinkedIn `ian-gitau-703799284` (https://www.linkedin.com/in/ian-gitau-703799284). Email `ian.gitau@warwick.ac.uk`. CV at `public/cv.pdf`, which is the source for the experience and project copy.
- In Phase 2, all content lives in one typed file, `src/data/content.ts`. Components contain no hard-coded copy.

### Copy style (for when real copy is written)

Ian wants the text to sound like him, not like a corporate template:
- Use direct declarative sentences.
- No em dashes, no filler groups of three, no "not just X but Y".
- Never use these words: crucial, delve, enhance, foster, garner, highlight (verb), interplay, intricate, key (as filler), landscape (metaphor), meticulous, pivotal, showcase, tapestry, testament, underscore (verb), valuable, vibrant, groundbreaking, renowned, diverse array, commitment to.
- Only use numbers that are real and defensible in an interview.

## Tech stack

- React + Vite + TypeScript, set up as a plain SPA. No SSR and no pre-rendering.
- Styling: CSS Modules, one `.module.css` per component. Global tokens and resets go in `src/styles/global.css`, carried over from the mock's custom properties.
- Add no runtime dependencies beyond `react` and `react-dom` without asking Ian.
- Set `<title>`, the meta description and Open Graph tags (title, description, image) by hand in `index.html`. Pre-rendering is off, so link previews depend on them.
- Use semantic HTML: one `<section>` per layer with a heading, alt text on meaningful images, `alt=""` on decorative ones, and visible focus styles. Text contrast must meet WCAG AA against every layer background.

Suggested layout (the design agent's `NOTES.md` may refine the component list):

```
src/
  main.tsx
  App.tsx
  data/content.ts          # all copy and links, typed
  assets/sprites.ts        # single sprite path map
  styles/global.css
  components/
    DepthMeter/
    Layer/                 # shared wrapper + tile edge
    Surface/  Sky/
    Underground/  TimelineEntry/
    Caverns/  Chest/
    DeepCaverns/
    PanelFrame/            # 9-slice frame
    LinkButton/
```

## Deployment

- Repo: `ixng/ixng.github.io` (a user site, served from the root, so the Vite `base` stays `/`).
- Deploy with a GitHub Actions workflow at `.github/workflows/deploy.yml`, using the official Pages actions (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`). Build with `npm ci && npm run build` and upload `dist/`.
- Ian sets Settings → Pages → Source to "GitHub Actions" himself.
- Before pushing, check that no file from `reference-sprites/` is tracked. `public/sprites/` is meant to be tracked.

## Working with Ian

- When explaining code, say briefly what it does. Don't over-explain.
- When reviewing code Ian wrote, tell him what is wrong without handing him the fix.
- Ask before changing any decision recorded in this file.
