"""Build Vivid Nutripharm oral-spray pack images (bottle + box) for every SKU.

Starts from the real D3+K2 product photo (background removed, "100% Efficient"
removed, Max Absorption centred), erases SKU-specific artwork, recolours the
orange brand colour per SKU, then lets overlay.html draw the new name, icon and
labels in the same style.  Run from the repo root:
    python3 product-images/oral-spray-packs/build_packs.py <cutout.png>
"""
import json, sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
S = 2  # work at 2x the photo resolution

# ---- SKU definitions -------------------------------------------------------
# hue = target hue for the orange brand colour, smul/vmul = saturation/value
SKUS = [
  dict(id='multivitamin', l1='Liposomal', l2='Multivitamin', icon='sparkle', lipo=True,
       band='6Puffs/Day | Assorted Flavours', hue=282, smul=.85, vmul=.72, grad=((318,.90,.80),(8,.85,.97)), colour='Magenta → Coral'),
  dict(id='vitamin-c', l1='Oral Spray', l2='Vitamin C', icon='citrus', lipo=False,
       band='Metered Spray | Assorted Flavours', hue=82, smul=.95, vmul=.80, grad=((50,1.0,1.0),(20,1.0,.95)), colour='Yellow → Orange'),
  dict(id='iron', l1='Oral Spray', l2='Iron', icon='blood', lipo=False,
       band='Metered Spray | Assorted Flavours', hue=358, smul=.90, vmul=.82, grad=((354,.95,.82),(26,1.0,1.0)), colour='Red → Orange'),
  dict(id='zma', l1='Oral Spray', l2='ZMA', icon='moon', lipo=False,
       band='6Puffs/Day | Assorted Flavours', hue=226, smul=.90, vmul=.62, grad=((228,.90,.52),(195,.95,.85)), colour='Navy → Sky Blue'),
  dict(id='erectile-dysfunction', l1='Erectile', l2='Dysfunction', icon='heart', lipo=False,
       band='Metered Spray | Assorted Flavours', hue=338, smul=.85, vmul=.52, grad=((292,.80,.50),(330,.75,.90)), colour='Plum → Rose'),
  dict(id='testoboost', l1='Oral Spray', l2='Testoboost', icon='male', lipo=False,
       band='Metered Spray | Assorted Flavours', hue=22, smul=.95, vmul=.58, grad=((250,.80,.60),(180,.95,.75)), colour='Indigo → Teal'),
  dict(id='vo2-maxx', l1='Oral Spray', l2='VO2 Maxx', icon='bolt', lipo=False,
       band='Metered Spray | Assorted Flavours', hue=196, smul=.95, vmul=.80, grad=((176,.95,.70),(218,.90,.78)), colour='Teal → Blue'),
  dict(id='smokers-cough', l1="Smoker's", l2='Cough', icon='lungs', lipo=False,
       band='Metered Spray | Assorted Flavours', hue=142, smul=.85, vmul=.62, grad=((128,.85,.72),(182,.95,.72)), colour='Green → Teal'),
  dict(id='biotin', l1='Oral Spray', l2='Biotin', icon='hair', lipo=False,
       band='Metered Spray | Assorted Flavours', hue=322, smul=.75, vmul=.88, grad=((276,.85,.70),(330,.80,.92)), colour='Purple → Pink'),
]

# ---- geometry in photo pixels (1000x665 source) ----------------------------
G = dict(
  bottle=dict(name=(326, 432, 433, 480), circ_search=(300, 470, 380, 560), disc=(382, 513, 22),
              lipo=(318, 377, 526, 582), lipo_icon=(347, 543, 13), lipo_l1=563, lipo_l2=574, lipo_fs=9.6),
  box=dict(name=(520, 692, 235, 312), circ_search=(490, 720, 150, 400), disc=(606, 359, 33),
           lipo=(519, 599, 390, 461), lipo_icon=(557, 411, 17), lipo_l1=437, lipo_l2=451, lipo_fs=12.6,
           band=(504, 713, 556, 578), band_cy=567, band_fs=13.2),
)

def inpaint(a, mask, r=9, smooth=True):
    a = cv2.inpaint(a, mask, r, cv2.INPAINT_TELEA)
    if smooth:
        blur = cv2.GaussianBlur(a, (0, 0), 5)
        m = (cv2.GaussianBlur(mask, (0, 0), 2) / 255.0)[..., None]
        a = (a * (1 - m) + blur * m).astype(np.uint8)
    return a

def circle_fit(a, box):
    x0, x1, y0, y1 = [v * S for v in box]
    reg = a[y0:y1, x0:x1].astype(int)
    org = (reg[..., 0] > 200) & (reg[..., 1] > 120) & (reg[..., 1] < 205) & (reg[..., 2] < 120)
    n, lab, st, cen = cv2.connectedComponentsWithStats(org.astype(np.uint8))
    k = 1 + np.argmax(st[1:, 4]); bx, by, bw, bh, _ = st[k]
    r = bw / 2
    return x0 + bx + r, y0 + by + r, r

def rect_mask(shape, x0, x1, y0, y1, circ=None):
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]]
    m = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)
    if circ:
        cx, cy, r = circ; m &= (xx - cx) ** 2 + (yy - cy) ** 2 < r ** 2
    return m.astype(np.uint8) * 255

def erase(base, sku):
    a = base.copy(); geo = {}
    for part, g in G.items():
        cx, cy, r = circle_fit(a, g['circ_search'])
        x0, x1, y0, y1 = [v * S for v in g['name']]
        a = inpaint(a, rect_mask(a.shape, x0 - 4, x1 + 4, y0 - 4, y1 + 4, (cx, cy, r - 5)), 15)
        dx, dy, dr = [v * S for v in g['disc']]
        a = inpaint(a, rect_mask(a.shape, 0, a.shape[1], 0, a.shape[0], (dx, dy, dr * 0.80)), 9)
        if not sku['lipo']:
            x0, x1, y0, y1 = [v * S for v in g['lipo']]
            m = rect_mask(a.shape, x0, x1, y0, y1)
            m[rect_mask(a.shape, 0, a.shape[1], 0, a.shape[0], (dx, dy, dr * 1.12)) > 0] = 0
            a = inpaint(a, m, 9)
        if 'band' in g:
            x0, x1, y0, y1 = [v * S for v in g['band']]
            a = inpaint(a, rect_mask(a.shape, x0, x1, y0, y1), 9)
        geo[part] = dict(cx=cx, cy=cy, r=r, name=[v * S for v in g['name']], disc=[dx, dy, dr],
                         lipo_icon=[v * S for v in g['lipo_icon']], lipo_l1=g['lipo_l1'] * S,
                         lipo_l2=g['lipo_l2'] * S, lipo_fs=g['lipo_fs'] * S)
        if 'band' in g:
            geo[part].update(band_cy=g['band_cy'] * S, band_fs=g['band_fs'] * S)
    return a, geo

# ---- recolour ---------------------------------------------------------------
def to_hsv(rgb):
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn + 1e-6; s = d / (mx + 1e-6)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, s, mx

def to_rgb(h, s, v):
    c = v * s; x = c * (1 - abs((h / 60) % 2 - 1)); m = v - c; i = (h // 60).astype(int) % 6
    z = np.zeros_like(h)
    R = np.choose(i, [c, x, z, z, x, c]); G_ = np.choose(i, [x, c, c, x, z, z]); B = np.choose(i, [z, z, x, c, c, x])
    return np.stack([R + m, G_ + m, B + m], -1)

def recolour_px(rgb01, hue, smul, vmul):
    h, s, v = to_hsv(rgb01)
    mask = (h > 5) & (h < 60) & (s > 0.07)
    if mask.ndim == 2 and mask.shape[0] > 4:
        # only recolour brand-colour areas and their soft edges, not warm shading on the bottle
        strong = ((h > 15) & (h < 52) & (s > 0.36) & (v > 0.45)).astype(np.uint8)
        near = cv2.dilate(strong, np.ones((21, 21), np.uint8)) > 0
        mask &= near
    nh = (h - 36 + hue) % 360; ns = np.clip(s * smul, 0, 1)
    nv = v * (1 - (1 - vmul) * np.clip(s / 0.8, 0, 1))
    return np.where(mask[..., None], to_rgb(nh, ns, nv), rgb01)

def colour_of(rgb, sku):
    px = np.array([[rgb]], float) / 255
    out = recolour_px(px, sku['hue'], sku['smul'], sku['vmul'])[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(c * 255)) for c in out)

def main(cutout):
    src = Image.open(cutout)
    big = src.resize((src.width * S, src.height * S), Image.LANCZOS)
    rgb = big.convert('RGB').filter(ImageFilter.UnsharpMask(1.6, 60, 2))
    alpha = np.array(big.getchannel('A'))
    base = np.array(rgb)
    out_dir = os.path.join(HERE, 'build'); os.makedirs(out_dir, exist_ok=True)
    manifest = []
    for sku in SKUS:
        a, geo = erase(base, sku)
        if sku.get('grad'):
            from gradients import gradient_recolour
            rgba = np.dstack([a, alpha]).astype(float) / 255
            img = (gradient_recolour(rgba, *sku['grad']) * 255).clip(0, 255).astype(np.uint8)
        else:
            rec = recolour_px(a.astype(float) / 255, sku['hue'], sku['smul'], sku['vmul'])
            img = np.dstack([(rec * 255).clip(0, 255).astype(np.uint8), alpha])
        Image.fromarray(img, 'RGBA').save(os.path.join(out_dir, f"{sku['id']}-template.png"))
        manifest.append(dict(sku, geo=geo, w=img.shape[1], h=img.shape[0],
                             icon_colour=colour_of((226, 152, 52), sku),
                             swatch=colour_of((240, 160, 40), sku),
                             icon_grad=[colour_of((226, 152, 52), dict(hue=g[0], smul=g[1], vmul=g[2])) for g in sku['grad']] if sku.get('grad') else None,
                             swatch_grad=[colour_of((240, 160, 40), dict(hue=g[0], smul=g[1], vmul=g[2])) for g in sku['grad']] if sku.get('grad') else None))
    with open(os.path.join(out_dir, 'manifest.json'), 'w') as f:
        json.dump(manifest, f, indent=1)
    print('templates:', len(manifest))

if __name__ == '__main__':
    main(sys.argv[1])
