"""Export final packs: transparent PNGs, 2000x2000 white-background PNGs and an overview sheet.
Run after build_packs.py and render_packs.js, from this folder."""
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT = '/usr/share/fonts/opentype/inter/Inter-{}.otf'
NAMES = {'multivitamin': 'Multivitamin (Liposomal)', 'vitamin-c': 'Vitamin C', 'iron': 'Iron', 'zma': 'ZMA',
         'erectile-dysfunction': 'Erectile Dysfunction', 'testoboost': 'Testoboost', 'vo2-maxx': 'VO2 Maxx',
         'smokers-cough': "Smoker's Cough", 'biotin': 'Biotin',
         'sleep': 'Sleep Spray', 'mind-focus': 'Mind Focus Spray', 'dry-mouth': 'Dry Mouth Management', 'vitamin-b12': 'Vitamin B12'}

def crop(im):
    return im.crop(im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())

def hexrgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def main():
    M = json.load(open('build/manifest.json'))
    items = [dict(id='vitamin-d3-k2', name='Vitamin D3+K2 (Liposomal)', colour='Orange (original)',
                  sw=['#ef9a1d', '#ef9a1d'], img='../vitamin-d3-k2-oral-spray/assets/pack-hero.png')]
    for s in M:
        items.append(dict(id=s['id'], name=NAMES[s['id']], colour=s['colour'],
                          sw=s.get('swatch_grad') or [s['swatch'], s['swatch']], img=f"build/{s['id']}-raw.png"))
    tiles = []
    for it in items:
        im = crop(Image.open(it['img']).convert('RGBA'))
        im.save(f"transparent/{it['id']}.png")
        N = 2000; sq = Image.new('RGBA', (N, N), (255, 255, 255, 255))
        sc = min(N * 0.78 / im.width, N * 0.80 / im.height)
        t = im.resize((int(im.width * sc), int(im.height * sc)), Image.LANCZOS)
        x = (N - t.width) // 2; y = (N - t.height) // 2 - 20
        sh = Image.new('RGBA', (N, N), (0, 0, 0, 0))
        ImageDraw.Draw(sh).ellipse((x + 40, y + t.height - 40, x + t.width - 40, y + t.height + 50), fill=(60, 40, 20, 90))
        sq.alpha_composite(sh.filter(ImageFilter.GaussianBlur(30))); sq.alpha_composite(t, (x, y))
        sq.convert('RGB').save(f"white/{it['id']}.png")
        tiles.append((it, im))
    fB = ImageFont.truetype(FONT.format('Bold'), 40); fS = ImageFont.truetype(FONT.format('Bold'), 32)
    fM = ImageFont.truetype(FONT.format('Medium'), 30)
    W, H, cols = 620, 820, 5  # 13 packs -> 3 rows
    S = Image.new('RGB', (W * cols, H * ((len(tiles) + cols - 1) // cols)), 'white'); d = ImageDraw.Draw(S)
    for i, (it, im) in enumerate(tiles):
        x, y = (i % cols) * W, (i // cols) * H
        t = im.copy(); t.thumbnail((560, 660), Image.LANCZOS)
        S.paste(t, (x + (W - t.width) // 2, y + 20), t)
        a, b = hexrgb(it['sw'][0]), hexrgb(it['sw'][1])
        for k in range(44):  # gradient swatch dot
            f = k / 43; c = tuple(int(a[j] + (b[j] - a[j]) * f) for j in range(3))
            d.line((x + 28 + k, y + 704, x + 28 + k, y + 746), fill=c)
        mask = Image.new('L', (44, 44), 0); ImageDraw.Draw(mask).ellipse((0, 0, 43, 43), fill=255)
        dot = S.crop((x + 28, y + 703, x + 72, y + 747)); bg = Image.new('RGB', (44, 44), 'white')
        S.paste(Image.composite(dot, bg, mask), (x + 28, y + 703))
        d.text((x + 85, y + 712), it['name'], font=fB if len(it['name']) < 20 else fS, fill=(27, 34, 64), anchor='lm')
        d.text((x + 85, y + 755), it['colour'], font=fM, fill=(100, 106, 130), anchor='lm')
    S.save('all-packs-overview.png')

if __name__ == '__main__':
    main()
