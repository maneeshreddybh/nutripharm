// Render a product's listing images (2000x2000) and its website gallery (1200px WebP via render.py).
// Usage: node render.js <product id> [scale]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const id = process.argv[2], scale = +(process.argv[3] || 2);
const products = fs.readFileSync(path.join(__dirname, 'products.js'), 'utf8');
const folder = products.match(new RegExp(`['"]?${id.replace(/[-]/g, '\\-')}['"]?\\s*:\\s*\\{\\s*folder:\\s*'([^']+)'`))[1];
const out = path.join(__dirname, '..', folder, 'final');
const NAMES = { s1: '01-hero-main-white', s1b: '01b-hero', s2: '02-benefits', s3: '03-features', s4: '04-formula', s5: '05-how-it-works', s6: '06-spray-vs-tablets', s7: '07-how-to-use', s8: '08-flavours' };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1100, height: 1100 }, deviceScaleFactor: scale });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('requestfailed', r => errors.push('failed: ' + r.url()));
  await p.goto('file://' + path.join(__dirname, 'template.html') + '?p=' + id);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  await p.waitForTimeout(300);
  for (const [sid, name] of Object.entries(NAMES)) {
    await (await p.$('#' + sid)).screenshot({ path: path.join(out, name + '.png') });
  }
  await b.close();
  if (errors.length) { console.error(errors); process.exit(1); }
  console.log('rendered', id, '->', out);
})();
