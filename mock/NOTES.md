# Phase 1 mock: notes for Ian and the build agent

The mock is `mock/index.html` + `mock/styles.css`. Read this file with `CLAUDE.md`: it only records what the mock adds or decides beyond that file.

## Viewing the mock

The sprites are Re-Logic art, so they are never committed. Generate them from `reference-sprites/` first, then serve the folder (opening the file directly works too, but a server matches the real site):

```bash
python3 mock/tools/extract_sprites.py
```

```bash
python3 -m http.server 4173 --directory mock
```

Then open http://127.0.0.1:4173 and resize the window to check mobile (below 768px), tablet (768 to 1279px) and wide desktop (1280px and up).

- `mock/tools/extract_sprites.py` crops the reference sheets into `mock/sprites/` (gitignored). In Phase 2, run it with `--out public/sprites` (also gitignored). It needs Pillow.
- The yellow box in the bottom-left corner is **mock only**. It turns every sprite off so you can review the CSS fallbacks, which is what the deployed site shows until your own art exists.
- The mock's JavaScript does three things: the depth meter tracks the layer in view and your progress through it as you scroll, a chest toggles on click/tap, and the copy button shows "Copied". Hover and keyboard opening of chests are pure CSS.

## Sprite issues found

1. **No open chest frame.** `gold chest.png` is a single 32x28 closed frame, and no open-chest sprite exists anywhere in `reference-sprites/`. The mock fakes the open state instead:
   - The chest is split into two elements that share the one sprite: the **lid** (top 12px) and the **base** (bottom 16px).
   - Opening lifts the lid 6 sprite pixels in 3 `steps()` over 200ms. That reveals a `.chest__inside` element behind it: a dark interior with a gold glint along the bottom.
   - A gold pixel outline (stacked `drop-shadow`s) marks the open or hovered chest, like the game's highlight.
   - **When you draw your own chest**, make a horizontal strip of two or more equal-width frames (closed, ..., open). The build agent can then switch to a normal `steps()` frame animation and delete the lid/base/inside split. Until then, keep the split: it works with the fallback CSS chest too.
2. **No 9-slice panel frame.** Nothing in `reference-sprites/` is a panel frame (`Tiles_54.png` is glass tiles). `PanelFrame` is pure CSS: dark outer line, light inner line and one-pixel notched corners. When you draw a frame, add it as `border-image` in `PanelFrame` and keep the CSS version as the fallback.
3. **Icons.** The GitHub and LinkedIn PNGs are opaque, despite their file names. The email and CV JPGs have a fake checkerboard baked in. The script knocks out the light pixels, downsamples each icon to a 16x16 glyph, and saves it twice: cream (`--ui-text`) and gold (`--ui-gold`, the `-hover` file). The icons are plain background images, and hovering a button swaps in the gold one so it matches the text. **Don't use CSS `mask` for sprite files:** Chrome and Firefox refuse mask images on pages opened straight from disk (`file://`), which made the icons vanish. The jagged-edge mask is fine because it is an inline SVG, not a file. They are rough at 16px, so they are good candidates for redrawing. With no sprites, icons are hidden and the button text carries the meaning.
4. **Cavern to deep cavern edge.** `cavern1 to cavern 2 transition layer.png` is fully opaque, so on its own it makes a straight band, not a jagged edge. The mock uses it as a stalactite fringe and lays the darkened deep-cavern wall over it in pixel-stepped teeth (an inline SVG mask). The other two transition strips have transparent tops and are used as-is.
5. **Torch.** `torch.png` is the held-item icon (diagonal), not the wall-mounted torch tile. It reads fine as a static torch on the wall, but a wall-torch sprite would look more natural.
6. **Unused sprites**, on purpose: hellstone, ash and the other underworld art (the page never goes below the caverns), the ore blocks (copper, gold, platinum, cobalt, mythril, adamantite), `sky.png`, `sky background.png`, `water drop.png` and `Waterfall for edge of cliff.png`. The sky is a CSS gradient because the brief says it is always daytime, and `sky.png` has a night band at the top.
7. **Extra sprites used** beyond the CLAUDE.md list: `surface back/middle/front.png` as three parallax hill layers behind the trees, and `flowers and plants for grass.png` along the grass, and `key icon.png` as the cursor over chests (see below).

## Design tokens

All tokens are CSS custom properties at the top of `styles.css` (section 1). Copy them into `src/styles/global.css` as they are.

| Group | Tokens |
|---|---|
| Sprite scale | `--s` (3 desktop, 2 mobile), `--s-tree` (2 / 1), `--s-icon` (2), plus `--px` (one sprite pixel) and `--tile` (one 16px tile) |
| Spacing | `--sp-1` to `--sp-10` (4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) |
| Fonts | `--font-pixel` (Pixelify Sans), `--font-body` (system UI stack), `--fs-xs` to `--fs-3xl` |
| Breakpoints | `--bp-mobile: 768px`, `--bp-wide: 1280px` (reference values; media queries repeat the literals because `var()` doesn't work in `@media`) |
| Layout | `--content-max`, `--gutter`, `--meter-w`, `--layer-pad` |
| Palette | `--ui-*` (panels, buttons, tags, gold focus/hover), `--surface-*`, `--ug-*`, `--cav-*`, `--deep-*`, `--wall-text*` |
| Motion | `--dur-lid`, `--lid-lift`, `--dur-water`, `--dur-cloud-far`, `--dur-cloud-near`, `--dur-grass-sway`, `--grass-sway-angle`, `--parallax-*` rates |
| Shapes | `--edge-teeth` (inline SVG mask for jagged edges) |

`--px`, `--tile` and `--lid-lift` are computed on `:root`. Change `--s` only on `:root` (as the mobile media query does), never on a single component, or those derived values won't follow.

**Breakpoints in use:** below 768px is the mobile layout (chest and label side by side, open content below the row). From 768 to 1279px, each chest row has the open content under the label, and the timeline is one-sided. From 1280px up, the open content gets its own column to the right of the label, and the timeline alternates sides.

## Sprites vs. fallbacks

Fallback first. Sections 3 to 10 of `styles.css` paint the whole page with plain CSS. Section 11 is an enhancement layer that swaps in sprites, and it is the only place sprite URLs are used. The sprite custom properties (`--spr-*`, section 2) mirror what `src/assets/sprites.ts` should contain.

Phase 2 suggestion: put `data-sprites="on"` on `<html>` when the sprite map is populated, and turn section 11's `:where(body:not(:has(#mock-fallbacks:checked)))` wrapper into `:where([data-sprites="on"])`. Components then never branch on sprites. Ask Ian if you'd rather decide per component.

## Components

Refines the layout suggested in `CLAUDE.md`. Names match the mock's CSS classes (BEM-style `block__element--modifier`).

| Component | Mock class | Props / content | States |
|---|---|---|---|
| `App` | `main` | Renders the four layers and `DepthMeter` | none |
| `DepthMeter` | `.depth-meter` | Layers: id, name, sub-label ("Intro" etc.), node colour, readout text | **active layer** (`aria-current="location"`, gold ring on the node, brighter label, readout text changes); link **hover** (gold text); **focus-visible**; hidden below 768px; **progress marker** (a gold box on the track, `--marker-y` on `.depth-meter__list`; drawn behind the nodes, so it shows only between them) |
| `Layer` | `.layer`, `.layer__inner`, `.layer__header` | id, eyebrow, title, wall variant, edge variant | none |
| `LayerEdge` | `.layer__edge--*` | Variant: `dirt-stone`, `stone-cavern`, `cavern-deep` | sprite / fallback |
| `Surface` | `.layer--surface`, `.surface__*` | Name, tagline, links | none |
| `Sky` | `.sky`, `.sun`, `.cloud--1..4` | none | Clouds **drift** in a loop (CSS `translate`), and parallax per cloud (`data-parallax`, on `transform`). Under reduced motion each cloud rests at its `--cloud-x` |
| `Scenery` | `.scenery`, `.hills--back/mid/front`, `.tree--a/b/c` | none | Parallax on hills; trees stay planted. `.tree--c` only at 1280px and up |
| `Ground` | `.ground__grass`, `.ground__dirt` | none | Grass and flowers along the top **sway** (sprite mode only); still under reduced motion |
| `Underground` | `.layer--underground`, `.mineshaft` | Experience entries | Rope centred at 1280px and up, on the left below that |
| `TimelineEntry` | `.timeline-entry--left/right`, `.timeline-entry__*` | Role, org, dates (`<time>`), bullets, side | Side alternates at 1280px and up only |
| `Torch` | `.torch` | none | Static, with a static light glow (no flicker) |
| `Caverns` | `.layer--caverns`, `.chests` | Projects | none |
| `Chest` | `.chest`, `.chest__*` | Name, summary, tags, bullets, repo URL, optional demo URL | **closed**; **open**; **hover** (desktop with a mouse: opens); **focus-visible** inside (opens); **pinned** by click, tap, Enter or Space (`.is-open`, `aria-expanded="true"`). Open = pinned OR hovered OR keyboard focus inside. Lid animates unless reduced motion is on; **key cursor** on hover over the chest sprite only (sprite mode only) |
| `Ledge` | `.ledge` | none | sprite / fallback |
| `DeepCaverns` | `.layer--deep` | Contact details | none |
| `GemVein` | `.gem-vein--ruby/sapphire`, `--a..d` | Gem type, position | Two hidden on mobile |
| `Pool` | `.pool`, `.pool__rim`, `.pool__water`, `.pool__stone` | none | Water surface animates; still under reduced motion |
| `OutsideCode` (or part of the contact panel) | `.contact__extra`, `.contact__extra-label` | Label ("Outside code"), text | none |
| `CopyEmail` | `.contact__email`, `.copy-button` | Address | **idle** "Copy"; **copied** for 2s (gold, "Copied", announced through a `role="status"` region); hover; focus-visible |
| `PanelFrame` | `.panel` | `edge` colour override (gold on chest loot and open labels) | none |
| `LinkButton` | `.link-button` | href, label, icon, `download` | **hover** (lighter fill, gold text); **focus-visible** (gold outline, not clipped because the frame lives on `::before`) |
| `Icon` | `.icon--github/linkedin/email/cv` | name | cream; **gold on button hover** (swaps to the `-hover` image); hidden when there are no sprites |
| `Tags` | `.tags`, `.tag` | List of strings | none |

### How the chest states work in CSS

The three triggers (`.is-open`, `:has(:focus-visible)` and `:hover` inside `@media (hover: hover) and (min-width: 768px)`) don't style anything directly. Each one sets the same bundle of custom properties (`--lid-y`, `--chest-glow`, `--label-edge`, `--loot-visibility`, `--loot-display`, `--hint`), and the child elements read them. In React, compute `const open = pinned || hovered || focusVisible`, put one `is-open` class on the chest, and keep `aria-expanded` equal to `open`. In the mock, `aria-expanded` only tracks the pinned state.

Hover is limited to hover-capable devices because touch browsers keep `:hover` stuck after a tap. Without that limit, a second tap couldn't close the chest.

## Decisions the mock makes that CLAUDE.md doesn't cover

- **No layout shift when a chest opens (768px and up).** The open content ("loot") panel always takes up its space and is only toggled with `visibility`, so opening a chest never moves the page or covers another chest. Closed rows therefore have some empty cave below or beside the label. On mobile the loot expands in flow (`display`) and pushes the next chest down; hover isn't used there, so nothing jumps under the cursor.
- **Chests are rows, one per project (your request on 2026-11-26).** CLAUDE.md's Caverns section now describes this layout. Each row is a CSS grid on `.chest`: the chest sprite on its ledge in a fixed left column (`--chest-col`, three tiles wide), the label panel (name, summary, tags) to its right, and the loot panel either under the label (768 to 1279px) or in a third column to the right of the label (1280px and up). On phones the chest and label stay side by side and the loot spans the full width below. Empty grid rows absorb extra height so the chest and ledge stay together at the top of the row.
- **Key cursor on chests (your request).** Hovering the chest sprite itself shows `key icon.png` as the mouse cursor. The ledge, the label panel and its title button keep the normal pointer. The key stays upright as drawn (ring at the top, tip pointing down); its tip is the click point (hotspot 14, 47), so the key sits just above where you click. The script exports it at 2x (`cursor-key.png`, 28x48) and 4x (`cursor-key@2x.png`) for retina screens via `image-set()`, with a plain `url()` line first for browsers without it. It lives in the sprite layer, so with no sprites the cursor is the normal pointer. Touch devices have no cursor, so nothing changes there.
- **Timeline is one-sided below 1280px** (rope on the left, all panels on the right). It alternates sides only on wide screens.
- **Depth meter keeps a column clear:** at 768px and up, content keeps `--meter-w` clear on the right so the fixed meter never covers text. On wide screens the normal centring gutter is already enough.
- **Depth meter readout** shows game-style depths ("150' Underground", "420' Caverns", "780' Deep caverns"). These are decorative and `aria-hidden`; drop them if you'd rather not have made-up numbers on the page.
- **Depth meter tracks scrolling.** A layer becomes current once its top passes 40% of the way down the viewport, so the meter switches when the new layer fills most of the screen, not the moment its edge appears. At the very bottom of the page the last layer always wins, in case Deep caverns is too short to reach the 40% line. The current link gets `aria-current="location"` and the readout takes that link's `data-readout` text. Clicking a link smooth-scrolls there, and the meter steps through the layers it passes. The mock uses a passive scroll listener with `requestAnimationFrame`. In Phase 2, keep the current layer in state, and either share the parallax scroll handler or use an `IntersectionObserver` with a thin band at 40% (`rootMargin: "-40% 0px -59% 0px"`) plus the same bottom-of-page check.
- **Depth meter progress marker.** A small gold box (`.depth-meter__list::after`) travels down the track from the current layer's node towards the next one, so you can see how far through the layer you are. Progress through layer *i* runs from 0 at the scroll position where layer *i* becomes current to 1 where layer *i+1* does, so the box reaches each node at the exact moment that node lights up. Those start positions are clamped to the maximum scroll, so the box reaches the last node at the bottom of the page even when the last layer is short. The box is drawn behind the nodes and is smaller than them, so it disappears as it slides under a node and reappears as it leaves: it is only visible between nodes. At the top of the page, at each layer change and in the last layer (where it rests on the final node), it is hidden. The script writes `--marker-y` (pixels from the top of the list, rounded) and CSS positions the box with `translateY`. It follows the scroll directly with no transition, so reduced motion needs nothing extra. Phase 2: derive `{ index, progress }` from the same scroll handler, and pass `progress` to `DepthMeter` as a prop.
- **Hint line under "Projects":** "Hover, tap or tab to a chest to open it." Recruiters may not guess that the chests open.
- **Fonts:** Pixelify Sans for headings, buttons, tags and labels, with ligatures turned off (its "fi" ligature reads as "A"). Body text uses the system UI stack, with no web font to load.
- **Text colour on the sky is dark navy**, not white, for contrast. Text on cave walls is limited to headings and the hint line, with a pixel drop shadow. All body text sits on panels.
- **Gold (`--ui-gold`) is the single interaction colour:** hover text, focus ring, open-chest outline and the loot panel edge. It copies Terraria's yellow hover text.
- **The rope runs from the first entry down to the bottom of the layer**, so it reads as heading deeper.
- **Parallax rates** are in the tokens and on each element as `data-parallax`, as fractions of scroll (`translateY(scrollY * rate)`): far cloud 0.5, near cloud 0.3 to 0.45, back hills 0.35, mid hills 0.22, front hills 0.1, trees 0. The mock itself is static; Phase 2 adds the rAF + passive scroll handler and skips it under `prefers-reduced-motion`.
- **Drifting clouds (your request on 2026-11-26; CLAUDE.md's Motion section now includes it).** Clouds cross the sky from left to right and loop: far clouds take 180s per crossing, near clouds 120s. Negative animation delays spread them across the sky on load. The drift animates the CSS `translate` property, so the Phase 2 parallax handler can set `transform: translateY(...)` on the same element without the two fighting. Under `prefers-reduced-motion` the drift stops and each cloud sits at its `--cloud-x` position.
- **Swaying grass (your request on 2026-11-26; CLAUDE.md's Motion section now includes it).** The flowers and tall grass strip along the top of the grass (`plants.png`, on `.ground__grass::before`) leans 4 degrees each way and back on a 2.4s loop (`--grass-sway-angle`, `--dur-grass-sway`). It's a `skewX` from the strip's base, so the roots stay planted and the pixels stay crisp. The strip overhangs both screen edges by a tile so the slant never leaves a gap. The grass blocks themselves don't move. The strip only exists with sprites on, so fallback mode has no sway. Under `prefers-reduced-motion` the grass stands still.
- **Pool basin.** The pool is a basin cut into the stone floor. Each row going down is one tile narrower on each side, like dug-out Terraria terrain. Three layers, back to front:
  - `.pool__rim`: a dark fill.
  - `.pool__water`: clipped to the basin shape shrunk by 2 sprite pixels, so a dark tile-edge outline shows between water and rock.
  - `.pool__stone`: has the basin clipped out of it.

  The water line sits 4 sprite pixels below the bank, so the stone lips show above it. Bank width is `--bank` (12% on desktop, one tile on mobile).
- **Water:** 17 frames, each the water tile repeated 4 times (64px), in a gap-free horizontal strip. The surface is a row of 64px segments all running the same `steps(17)` animation at about 10fps. The fallback slides highlight dashes instead.
- **Deep caverns are darker** because the cavern2 wall sprite is drawn through `filter: brightness(0.55) saturate(0.8)` (`--deep-wall-filter`), with a faint blue glow above the pool.
- **Contrast checked** (WCAG AA): every text pair passes, including wall text measured against the lightest 2% of each wall sprite's pixels. The lowest is the eyebrow text on the stone wall, at 5.8:1.
- **`<head>`** already has a title, description and Open Graph tags, with placeholder text and image path, for the build agent to carry over.

## Placeholder content

Everything is placeholder except the name, GitHub and LinkedIn URLs, role titles, organisations, dates and the Valorant line.
- Bullets are written as instructions ("Describe ...") so none can be mistaken for real claims.
- Tagline, contact line, project one-liners and **tech tags** are realistic-length guesses. The tags in particular are made up; replace them.
- Repo links all point to `https://github.com/ixng` until the real repo URLs exist. Demo links (`#`) are on valstats and Precedent only, to show both cases.
- **Valorant line (real, your request):** the Contact panel ends with "Outside code: Top 0.5% of Valorant players." under a thin divider. It's yours, not a placeholder. Adding the exact rank and when (e.g. the rank name and act) would make it checkable. In Phase 2 it belongs in `src/data/content.ts` with the other contact details.
- Email is `ian@example.com`; CV is `cv.pdf` (Phase 2: `public/cv.pdf`).

## Open questions for Ian

1. Do you want to draw an open-chest frame, or keep the lifted-lid approach for good?
2. Keep the decorative depth numbers in the meter's readout, or show only the layer name?
3. Are the flowers along the grass too busy? They are easy to drop.
