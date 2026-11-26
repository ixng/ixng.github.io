"""Crop the reference Terraria sheets into the small sprites the mock uses.

The output is derived from Re-Logic art, so it is gitignored. Run from the repo root:

    python3 mock/tools/extract_sprites.py                       # -> mock/sprites/
    python3 mock/tools/extract_sprites.py --out public/sprites  # Phase 2

Needs Pillow (pip install pillow).
"""
import argparse
import shutil
from pathlib import Path

from PIL import Image

CELL = 18   # Terraria tile sheets: 16x16 tiles on an 18px stride (2px gutter)
TILE = 16


def tile(sheet, col, row):
    x, y = col * CELL, row * CELL
    return sheet.crop((x, y, x + TILE, y + TILE))


def strip(sheet, cells):
    """Tiles side by side, e.g. three top-edge variants."""
    out = Image.new("RGBA", (TILE * len(cells), TILE))
    for i, (c, r) in enumerate(cells):
        out.paste(tile(sheet, c, r), (i * TILE, 0))
    return out


def block(sheet, cells):
    """3x3 latin square of interior variants so repeats are less obvious."""
    a, b, c = (tile(sheet, *cell) for cell in cells)
    rows = [(a, b, c), (c, a, b), (b, c, a)]
    out = Image.new("RGBA", (TILE * 3, TILE * 3))
    for y, row in enumerate(rows):
        for x, t in enumerate(row):
            out.paste(t, (x * TILE, y * TILE))
    return out


def icon(src, size=16, crop=None):
    """Downsample a high-res icon to a hard-edged 16x16 white pixel icon.

    The source files are opaque (white or fake-checkerboard backgrounds), so any
    light pixel counts as background and everything darker becomes the glyph.
    """
    im = Image.open(src).convert("RGBA")
    if crop:
        im = im.crop(crop)
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, _ = px[x, y]
            px[x, y] = (255, 255, 255, 255) if r + g + b < 600 else (0, 0, 0, 0)
    bbox = im.getbbox()
    im = im.crop(bbox)
    side = max(im.size)
    sq = Image.new("RGBA", (side, side))
    sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    small = sq.resize((size, size), Image.BOX)
    px = small.load()
    for y in range(size):
        for x in range(size):
            r, g, b, a = px[x, y]
            px[x, y] = (255, 255, 255, 255) if a > 110 else (0, 0, 0, 0)
    return small


def tint(glyph, rgb):
    """Recolour a white 16x16 glyph, keeping its alpha."""
    out = Image.new("RGBA", glyph.size, rgb + (0,))
    out.putalpha(glyph.getchannel("A"))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="reference-sprites")
    ap.add_argument("--out", default="mock/sprites")
    args = ap.parse_args()
    src, out = Path(args.src), Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    def load(name):
        return Image.open(src / name).convert("RGBA")

    def save(im, name):
        im.save(out / name)
        print("wrote", out / name, im.size)

    def copy(name, dest):
        shutil.copyfile(src / name, out / dest)
        print("copied", out / dest)

    interior = [(1, 1), (2, 1), (3, 1)]
    top_edge = [(1, 0), (2, 0), (3, 0)]

    grass = load("surface grass dirt blocks.png")
    dirt = load("PC _ Computer - Terraria - Tiles - Dirt.png")
    stone = load("stone and dirt bloks.png")

    save(strip(grass, top_edge), "tile-grass.png")
    save(block(dirt, interior), "tile-dirt.png")
    save(block(stone, interior), "tile-stone.png")

    save(strip(stone, top_edge), "tile-stone-top.png")

    # Cavern ledge: one tile tall run (top + bottom edges) with rounded end caps
    save(strip(stone, [(6, 4), (7, 4), (8, 4)]), "tile-ledge.png")
    save(tile(stone, 9, 0), "tile-ledge-cap-l.png")
    save(tile(stone, 12, 0), "tile-ledge-cap-r.png")

    save(tile(load("ruby gem blocks.png"), 1, 1), "tile-ruby.png")
    save(tile(load("sapphire gem blocks.png"), 1, 1), "tile-sapphire.png")

    # Background walls and the jagged transition strips between layers
    copy("dirt surface background.png", "wall-dirt.png")
    copy("underground_background.png", "wall-stone.png")
    copy("cavern_background1.png", "wall-cavern.png")
    copy("cavern2 background.png", "wall-deep.png")
    copy("dirt surface to underground transition.png", "edge-dirt-stone.png")
    copy("underground_to_cavern_transition.png", "edge-stone-cavern.png")
    copy("cavern1 to cavern 2 transition layer.png", "edge-cavern-deep.png")

    # Water: 17 frames on an 18px stride -> a gap-free horizontal strip.
    # Each frame is the tile repeated 4x so one element covers 64px of surface.
    water = load("water blocks.png")
    frames = water.width // CELL
    reps = 4
    w = Image.new("RGBA", (TILE * reps * frames, TILE))
    for f in range(frames):
        t = water.crop((f * CELL, 0, f * CELL + TILE, TILE))
        for r in range(reps):
            w.paste(t, ((f * reps + r) * TILE, 0))
    save(w, "water-surface.png")

    copy("gold chest.png", "chest.png")  # closed frame only; no open frame exists

    # Key cursor for hovering chests, upright as drawn (tip pointing down; the
    # tip is the click point). 2x (28x48) for normal screens, 4x for retina.
    key = load("key icon.png")
    save(key.resize((key.width * 2, key.height * 2), Image.NEAREST), "cursor-key.png")
    save(key.resize((key.width * 4, key.height * 4), Image.NEAREST), "cursor-key@2x.png")
    copy("torch.png", "torch.png")
    copy("top of rope.png", "rope-top.png")
    rope = load("rope blocks.png")
    save(tile(rope, 5, 1), "rope.png")    # vertical segment
    save(tile(rope, 2, 0), "rope-h.png")  # horizontal segment

    # Tree: top + 4 trunk segments + roots (trunk sheet is 20px tiles on 22px stride)
    tops = load("Tree_Tops_0.png")
    trunk = load("tree trunk blocks.png")

    def tt(c, r):
        return trunk.crop((c * 22, r * 22, c * 22 + 20, r * 22 + 20))

    segs = 4
    tree = Image.new("RGBA", (80, 80 + 20 * segs))
    for i in range(segs):
        tree.paste(tt(0, i % 3), (30, 80 + i * 20 - 2))
    base_y = 80 + 20 * (segs - 1) - 2
    tree.alpha_composite(tt(2, 6), (14, base_y))  # left root
    tree.alpha_composite(tt(1, 6), (46, base_y))  # right root
    tree.alpha_composite(tops.crop((0, 0, 80, 82)).crop((0, 0, 80, 80)), (0, 0))
    save(tree, "tree.png")

    for i in range(1, 5):
        copy(f"level {i} clouds.png", f"clouds-{i}.png")
    copy("Sun.png", "sun.png")
    copy("surface back.png", "hills-back.png")
    copy("surface middle.png", "hills-mid.png")
    copy("surface front .png", "hills-front.png")
    copy("flowers and plants  for grass.png", "plants.png")

    # The GitHub file has the wordmark under the mark; keep only the mark (top 560px)
    # Icons are pre-coloured (not CSS masks: browsers block mask images on pages
    # opened from disk). Two colours each, matching the tokens --ui-text and --ui-gold.
    icons = {
        "github": icon(src / "github-logo-transparent-png-11659780101agvzsukgqz.png", crop=(0, 0, 840, 560)),
        "linkedin": icon(src / "Linkedin-logo-on-transparent-Background-PNG-.png"),
        "email": icon(src / "pngtree-email-icon-design-png-image_2413695.jpg"),
        "cv": icon(src / "cv-icon-png-image_927259.jpg"),
    }
    for name, glyph in icons.items():
        save(tint(glyph, (0xF5, 0xF0, 0xE4)), f"icon-{name}.png")        # --ui-text
        save(tint(glyph, (0xFF, 0xD8, 0x4A)), f"icon-{name}-hover.png")  # --ui-gold


if __name__ == "__main__":
    main()
