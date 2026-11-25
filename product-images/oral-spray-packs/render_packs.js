// Draws each SKU's name, icon and labels onto its recoloured template.
// Usage: node render_packs.js   (after build_packs.py)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = __dirname, BUILD = process.env.PACK_BUILD || path.join(DIR, 'build');
const M = JSON.parse(fs.readFileSync(path.join(BUILD, 'manifest.json'), 'utf8'));

const ICONS = {
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z"/>',
  citrus: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6.6"/>' + [0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180;return `<path d="M12 12L${(12+6.6*Math.cos(r)).toFixed(2)} ${(12+6.6*Math.sin(r)).toFixed(2)}"/>`}).join(''),
  blood: '<path d="M12 3c-3.6 5-6 8.2-6 11a6 6 0 0 0 12 0c0-2.8-2.4-6-6-11z"/><path d="M9.2 14.5a2.8 2.8 0 0 0 2.8 2.8"/>',
  moon: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/><path d="M17 3.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z"/>',
  heart: '<path d="M12 20s-7.5-4.5-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.5 12 20 12 20z"/><path d="M7 12h2.6l1.4-2.2 2 4.2 1.4-2H17"/>',
  male: '<circle cx="10" cy="14" r="5.6"/><path d="M14 10l6-6M15.2 4H20v4.8"/>',
  bolt: '<path d="M13 2.5L5.5 13H11l-1 8.5L17.5 11H12z"/>',
  lungs: '<path d="M12 3v8"/><path d="M12 10.5c-.8 1.2-1.8 1.8-3 1.8M12 10.5c.8 1.2 1.8 1.8 3 1.8"/><path d="M9.5 7.5C6.5 7.5 4.5 11.5 4.5 16.5c0 1.8 1 2.9 2.7 2.9 1.8 0 2.8-1.2 2.8-3V11"/><path d="M14.5 7.5c3 0 5 4 5 9 0 1.8-1 2.9-2.7 2.9-1.8 0-2.8-1.2-2.8-3V11"/>',
  hair: '<path d="M8 21c2.6-3.6-.8-7.4 1.4-12.5C10.2 6.6 11 5 12 3.5"/><path d="M12 21c2.6-3.6-.8-7.4 1.4-12.5C14.2 6.6 15 5 16 3.5"/><path d="M16 21c2.6-3.6-.8-7.4 1.4-12.5"/>',
  nowater: '<path d="M7 4h10l-1.4 16H8.4z"/><path d="M7.6 9h8.8"/><path d="M4 21L20 3"/>'
};
const CREAM = '#fff7de', INK = '#38383d';

let gid = 0;
function svgIcon(name, cx, cy, size, colour, sw) {
  let defs = '';
  if (Array.isArray(colour)) {   // two-colour gradient stroke
    const id = 'ig' + (gid++);
    defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${colour[0]}"/><stop offset="1" stop-color="${colour[1]}"/></linearGradient></defs>`;
    colour = `url(#${id})`;
  }
  return `<svg viewBox="0 0 24 24" style="position:absolute;left:${cx - size/2}px;top:${cy - size/2}px;width:${size}px;height:${size}px;overflow:visible" fill="none" stroke="${colour}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${defs}${ICONS[name]}</svg>`;
}
function text(t, cx, cy, size, weight, colour, extra = '') {
  return `<div class="t" data-fit="${extra}" style="left:${cx}px;top:${cy}px;font-size:${size}px;font-weight:${weight};color:${colour}">${t}</div>`;
}

function page(s) {
  let o = '';
  for (const part of ['bottle', 'box']) {
    const g = s.geo[part];
    const [x0, x1, y0, y1] = g.name, h = y1 - y0;
    o += text(s.l1, g.cx, y0 + h * 0.28, h * 0.40, 500, CREAM);
    o += text(s.l2, g.cx, y0 + h * 0.78, h * 0.50, 700, CREAM, String(g.r * 2 * 0.84));
    const [dx, dy, dr] = g.disc, isz = dr * 1.27;
    o += svgIcon(s.icon, dx, dy, isz, CREAM, (part === 'box' ? 4 : 2.8) * 24 / isz);
    if (!s.lipo) {
      const [ix, iy, ir] = g.lipo_icon;
      o += svgIcon('nowater', ix, iy, ir * 2, s.icon_grad || s.icon_colour, 1.4);
      o += text('No Water', ix, g.lipo_l1, g.lipo_fs, 500, INK);
      o += text('Needed', ix, g.lipo_l2, g.lipo_fs, 500, INK);
    }
    if (g.band_cy) o += text(s.band, 1216, g.band_cy, g.band_fs, 600, CREAM, '404');
  }
  return `<!doctype html><html><head><style>
    html,body{margin:0;background:transparent}
    #c{position:relative;width:${s.w}px;height:${s.h}px;background:url('file://${BUILD}/${s.id}-template.png') no-repeat;background-size:100% 100%}
    #o{position:absolute;inset:0;filter:blur(.55px)}
    .t{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font-family:Inter,sans-serif;line-height:1;letter-spacing:-.005em}
  </style></head><body><div id="c"><div id="o">${o}</div></div>
  <script>
    document.querySelectorAll('.t[data-fit]').forEach(e=>{const max=parseFloat(e.dataset.fit);if(!max)return;let fs=parseFloat(e.style.fontSize);while(e.getBoundingClientRect().width>max&&fs>6){fs-=.5;e.style.fontSize=fs+'px'}});
  </script></body></html>`;
}

(async () => {
  const b = await chromium.launch();
  for (const s of M) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h } });
    const html = path.join(BUILD, s.id + '.html');
    fs.writeFileSync(html, page(s));
    await p.goto('file://' + html); await p.waitForTimeout(150);
    await (await p.$('#c')).screenshot({ path: path.join(BUILD, s.id + '-raw.png'), omitBackground: true });
    await p.close();
  }
  await b.close();
})();
