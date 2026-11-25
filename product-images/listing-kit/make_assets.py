"""Cut each product's pack into listing-image assets and render flavour bottles.

Writes product-images/<folder>/assets/:
  pack-hero.png       bottle + box (from the website pack)
  bottle-original.png bottle only
  box.png             box only
  bottle-<flavour>.png  the same bottle with a solid flavour colour
Run from the repo root:  python3 product-images/listing-kit/make_assets.py zma vo2-maxx multivitamin
(needs oral-spray-packs/build from build_packs.py + render_packs.js)
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PACKS = os.path.join(ROOT, 'oral-spray-packs')
sys.path.insert(0, PACKS)
import build_packs as B  # noqa: E402

FOLDER = {'zma': 'zma-oral-spray', 'vo2-maxx': 'vo2-maxx-oral-spray', 'multivitamin': 'multivitamin-oral-spray',
          'vitamin-c': 'vitamin-c-oral-spray', 'iron': 'iron-oral-spray', 'biotin': 'biotin-oral-spray',
          'sleep': 'sleep-oral-spray', 'vitamin-b12': 'vitamin-b12-oral-spray'}
# hue / saturation / value multipliers relative to the orange base photo
FLAVOURS = [('strawberry', 350, .92, .92), ('mint', 160, .85, .80), ('orange', 24, 1.0, .98), ('mango', 46, 1.0, 1.0)]
SPLIT_X = 476 * B.S        # bottle | box boundary on the 2x canvas

def crop(im):
    return im.crop(im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())

def cut(raw, dest):
    full = Image.open(raw).convert('RGBA')
    crop(full).save(os.path.join(dest, 'pack-hero.png'))
    crop(full.crop((0, 0, SPLIT_X, full.height))).save(os.path.join(dest, 'bottle-original.png'))
    crop(full.crop((SPLIT_X, 0, full.width, full.height))).save(os.path.join(dest, 'box.png'))

def main(ids):
    src = Image.open(os.path.join(PACKS, 'source-cutout.png'))
    big = src.resize((src.width * B.S, src.height * B.S), Image.LANCZOS)
    base = np.array(big.convert('RGB').filter(ImageFilter.UnsharpMask(1.6, 60, 2)))
    alpha = np.array(big.getchannel('A'))
    fdir = os.path.join(PACKS, 'build-flavours'); os.makedirs(fdir, exist_ok=True)
    manifest = []
    for pid in ids:
        sku = next(s for s in B.SKUS if s['id'] == pid)
        dest = os.path.join(ROOT, FOLDER[pid], 'assets'); os.makedirs(dest, exist_ok=True)
        cut(os.path.join(PACKS, 'build', f'{pid}-raw.png'), dest)
        a, geo = B.erase(base, sku)
        for name, hue, sm, vm in FLAVOURS:
            v = dict(sku, id=f'{pid}--{name}', hue=hue, smul=sm, vmul=vm, grad=None)
            rec = B.recolour_px(a.astype(float) / 255, hue, sm, vm)
            img = np.dstack([(rec * 255).clip(0, 255).astype(np.uint8), alpha])
            Image.fromarray(img, 'RGBA').save(os.path.join(fdir, f"{v['id']}-template.png"))
            manifest.append(dict(v, geo=geo, w=img.shape[1], h=img.shape[0],
                                 icon_colour=B.colour_of((226, 152, 52), v), icon_grad=None))
    json.dump(manifest, open(os.path.join(fdir, 'manifest.json'), 'w'))
    subprocess.run(['node', os.path.join(PACKS, 'render_packs.js')], check=True, env=dict(os.environ, PACK_BUILD=fdir))
    for m in manifest:
        pid, name = m['id'].split('--')
        full = Image.open(os.path.join(fdir, f"{m['id']}-raw.png")).convert('RGBA')
        crop(full.crop((0, 0, SPLIT_X, full.height))).save(os.path.join(ROOT, FOLDER[pid], 'assets', f'bottle-{name}.png'))
    print('assets ready for', ', '.join(ids))

if __name__ == '__main__':
    main(sys.argv[1:] or list(FOLDER))
