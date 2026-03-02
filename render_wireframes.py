#!/usr/bin/env python3
"""
Renders ASCII wireframes from 10-frontend-wireframes.md into PNG images.
"""

import re
import os
from PIL import Image, ImageDraw, ImageFont

# ── Config ────────────────────────────────────────────────────────────────────
MD_FILE   = "/home/babayemi-mercy/projects/Kube/docs/10-frontend-wireframes.md"
OUT_DIR   = "/home/babayemi-mercy/projects/Kube/out/wireframes"
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
FONT_SIZE = 14
PAD_X, PAD_Y = 24, 20         # inner padding (px)
BG_COLOR   = (255, 255, 255)  # white background
FG_COLOR   = (30, 30, 30)     # near-black text
TITLE_BG   = (45, 55, 72)     # dark-slate banner
TITLE_FG   = (255, 255, 255)  # white title text
TITLE_FONT_SIZE = 15
# ─────────────────────────────────────────────────────────────────────────────


def parse_wireframes(path: str) -> list[dict]:
    """Return list of {title, lines} dicts, one per screen."""
    with open(path, encoding="utf-8") as f:
        text = f.read()

    # Match every ### heading followed (anywhere after) by a fenced code block
    pattern = re.compile(
        r"###\s+(Screen\s+\d+[^#\n]*)\n"   # ### Screen N — Title
        r"(?:.*?\n)*?"                       # optional prose lines
        r"```\n(.*?)```",                    # fenced block
        re.DOTALL,
    )

    screens = []
    for m in pattern.finditer(text):
        title = m.group(1).strip()
        body  = m.group(2).rstrip()
        lines = body.split("\n")
        screens.append({"title": title, "lines": lines})

    return screens


def render(screen: dict, font: ImageFont.FreeTypeFont,
           title_font: ImageFont.FreeTypeFont) -> Image.Image:
    lines = screen["lines"]
    title = screen["title"]

    # Measure glyph metrics
    dummy = Image.new("RGB", (1, 1))
    dc    = ImageDraw.Draw(dummy)
    bbox  = dc.textbbox((0, 0), "W", font=font)
    ch_w  = bbox[2] - bbox[0]        # character width
    ch_h  = bbox[3] - bbox[1] + 2    # character height + leading

    max_cols = max((len(l) for l in lines), default=0)
    body_w   = max_cols * ch_w + PAD_X * 2
    body_h   = len(lines) * ch_h  + PAD_Y * 2

    title_banner_h = TITLE_FONT_SIZE + PAD_Y
    img_w = max(body_w, 400)
    img_h = body_h + title_banner_h

    img = Image.new("RGB", (img_w, img_h), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Title banner
    draw.rectangle([0, 0, img_w, title_banner_h], fill=TITLE_BG)
    draw.text((PAD_X, PAD_Y // 2), title, font=title_font, fill=TITLE_FG)

    # Body text
    y = title_banner_h + PAD_Y
    for line in lines:
        draw.text((PAD_X, y), line, font=font, fill=FG_COLOR)
        y += ch_h

    return img


def slug(title: str) -> str:
    """Convert 'Screen 1 — Homepage' → 'screen-01-homepage'."""
    m = re.match(r"Screen\s+(\d+)", title)
    num = int(m.group(1)) if m else 0
    rest = re.sub(r"Screen\s+\d+\s*[—–-]*\s*", "", title)
    rest = re.sub(r"[^a-zA-Z0-9]+", "-", rest).strip("-").lower()
    return f"screen-{num:02d}-{rest}"


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    font       = ImageFont.truetype(FONT_PATH, FONT_SIZE)
    title_font = ImageFont.truetype(FONT_PATH, TITLE_FONT_SIZE)

    screens = parse_wireframes(MD_FILE)
    print(f"Found {len(screens)} wireframe screens.\n")

    for screen in screens:
        img  = render(screen, font, title_font)
        name = slug(screen["title"]) + ".png"
        path = os.path.join(OUT_DIR, name)
        img.save(path)
        print(f"  ✓  {name}  ({img.width}×{img.height}px)")

    print(f"\nAll images saved to: {OUT_DIR}")


if __name__ == "__main__":
    main()
