// Every sprite file the site uses, in one place. To swap in your own art,
// replace the files in public/sprites/ (or change the file names here).
// Components never mention sprite paths: each entry becomes a CSS custom
// property, --spr-<name>, that the component CSS reads.
//
// The sprites are only switched on when public/sprites/ exists at build time
// (see vite.config.ts). Add ?sprites=off to the URL to preview the CSS
// fallbacks.

export const sprites = {
  // Surface
  'sky-sun': 'sun.png', // 114x114
  'cloud-1': 'clouds-1.png', // 272x125
  'cloud-2': 'clouds-2.png', // 314x133
  'cloud-3': 'clouds-3.png', // 270x142
  'cloud-4': 'clouds-4.png', // 300x130
  'hills-back': 'hills-back.png', // 1024x435
  'hills-mid': 'hills-mid.png', // 1024x435
  'hills-front': 'hills-front.png', // 1024x600
  tree: 'tree.png', // 80x160
  plants: 'plants.png', // 377x34
  grass: 'tile-grass.png', // 48x16, 3 variants
  dirt: 'tile-dirt.png', // 48x48

  // Tiles
  stone: 'tile-stone.png', // 48x48
  'stone-top': 'tile-stone-top.png', // 48x16
  ledge: 'tile-ledge.png', // 48x16
  'ledge-cap-l': 'tile-ledge-cap-l.png', // 16x16
  'ledge-cap-r': 'tile-ledge-cap-r.png', // 16x16
  ruby: 'tile-ruby.png', // 16x16
  sapphire: 'tile-sapphire.png', // 16x16

  // Walls and layer edges
  'wall-stone': 'wall-stone.png', // 160x96
  'wall-cavern': 'wall-cavern.png', // 160x96
  'wall-deep': 'wall-deep.png', // 160x96
  'edge-dirt-stone': 'edge-dirt-stone.png', // 160x16
  'edge-stone-cavern': 'edge-stone-cavern.png', // 160x16
  'edge-cavern-deep': 'edge-cavern-deep.png', // 160x16

  // Underground
  rope: 'rope.png', // 16x16
  'rope-h': 'rope-h.png', // 16x16
  'rope-top': 'rope-top.png', // 10x32
  torch: 'torch.png', // 14x16, static

  // Caverns and deep caverns
  chest: 'chest.png', // 32x28, closed frame only
  'cursor-key': 'cursor-key.png', // 28x48: key icon at 2x
  'cursor-key-2x': 'cursor-key@2x.png', // 56x96: the same, for retina screens
  water: 'water-surface.png', // 1088x16: 17 frames of 64x16

  // Icons: 16x16, pre-coloured cream and gold (the -hover files)
  'icon-github': 'icon-github.png',
  'icon-github-hover': 'icon-github-hover.png',
  'icon-linkedin': 'icon-linkedin.png',
  'icon-linkedin-hover': 'icon-linkedin-hover.png',
  'icon-email': 'icon-email.png',
  'icon-email-hover': 'icon-email-hover.png',
  'icon-cv': 'icon-cv.png',
  'icon-cv-hover': 'icon-cv-hover.png',
} as const

const folder = `${import.meta.env.BASE_URL}sprites/`

/** Turns the sprite layer on: one --spr-* property per sprite, plus data-sprites="on". */
export function applySprites(root: HTMLElement) {
  const forcedOff = new URLSearchParams(window.location.search).get('sprites') === 'off'
  if (!__HAS_SPRITES__ || forcedOff) return

  for (const [name, file] of Object.entries(sprites)) {
    root.style.setProperty(`--spr-${name}`, `url("${folder}${file}")`)
  }
  root.dataset.sprites = 'on'
}
