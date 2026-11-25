"""Two-colour gradient recolouring for the oral-spray pack.

Each brand-colour element (label circle, icon disc, icons, box band, box edge)
gets its own diagonal blend from colour A (top-left) to colour B (bottom-right).
"""
import numpy as np, cv2
from build_packs import to_hsv, to_rgb

def lerp_hue(a, b, t):
    d = ((b - a + 180) % 360) - 180          # shortest way round the colour wheel
    return (a + d * t) % 360

def gradient_recolour(rgba01, A, B):
    """A, B = (hue, sat_mul, val_mul). Returns recoloured RGBA float array."""
    rgb = rgba01[..., :3]
    h, s, v = to_hsv(rgb)
    strong = ((h > 15) & (h < 52) & (s > 0.36) & (v > 0.45)).astype(np.uint8)
    near = cv2.dilate(strong, np.ones((21, 21), np.uint8))
    mask = (h > 5) & (h < 60) & (s > 0.07) & (near > 0)
    # one gradient per element: connected parts of the brand colour
    n, lab, st, _ = cv2.connectedComponentsWithStats(near)
    yy, xx = np.mgrid[0:rgb.shape[0], 0:rgb.shape[1]].astype(float)
    x0, y0 = st[lab, 0], st[lab, 1]
    w, hh = np.maximum(st[lab, 2], 1), np.maximum(st[lab, 3], 1)
    t = np.clip(((xx - x0) / w + (yy - y0) / hh) / 2, 0, 1)
    t = t * t * (3 - 2 * t)                     # smoothstep for a softer blend
    nh = lerp_hue(A[0], B[0], t)
    sm = A[1] + (B[1] - A[1]) * t
    vm = A[2] + (B[2] - A[2]) * t
    ns = np.clip(s * sm, 0, 1)
    nv = v * (1 - (1 - vm) * np.clip(s / 0.8, 0, 1))
    out = rgba01.copy()
    out[..., :3] = np.where(mask[..., None], to_rgb(nh, ns, nv), rgb)
    return out

def swatch(A, B, w=120, h=26):
    t = np.linspace(0, 1, w)[None, :].repeat(h, 0)
    base_h, base_s, base_v = np.full_like(t, 36.0), np.full_like(t, .83), np.full_like(t, .94)
    nh = lerp_hue(A[0], B[0], t)
    sm = A[1] + (B[1] - A[1]) * t; vm = A[2] + (B[2] - A[2]) * t
    rgb = to_rgb(nh, np.clip(base_s * sm, 0, 1), base_v * (1 - (1 - vm) * np.clip(base_s / .8, 0, 1)))
    return (rgb * 255).clip(0, 255).astype(np.uint8)

GRADIENTS = [
  ('Magenta → Coral',     (318, .90, .80), (8, .85, .97)),
  ('Purple → Pink',       (276, .85, .70), (330, .80, .92)),
  ('Sunset Orange → Pink',(30, 1.0, 1.0),  (338, .85, .88)),
  ('Red → Orange',        (354, .95, .82), (26, 1.0, 1.0)),
  ('Yellow → Orange',     (50, 1.0, 1.0),  (20, 1.0, .95)),
  ('Lime → Green',        (80, .95, .85),  (140, .85, .62)),
  ('Green → Teal',        (128, .85, .72), (182, .95, .72)),
  ('Teal → Blue',         (176, .95, .70), (218, .90, .78)),
  ('Navy → Sky Blue',     (228, .90, .52), (195, .95, .85)),
  ('Blue → Purple',       (222, .90, .75), (282, .85, .72)),
  ('Indigo → Teal',       (250, .80, .60), (180, .95, .75)),
  ('Plum → Rose',         (292, .80, .50), (330, .75, .90)),
]
