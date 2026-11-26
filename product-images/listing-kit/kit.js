/* Builds the 9 listing slides for one product from window.PRODUCTS.
   URL: template.html?p=<product id>[&theme=plain|radiant|science|fruit]
   Without &theme each slide uses the product's default background mix. */
(function () {
  const q = new URLSearchParams(location.search);
  const P = window.PRODUCTS[q.get('p')];
  if (!P) { document.body.textContent = 'Unknown product'; return; }
  const forced = q.get('theme');
  const MIX = { s1: 'plain', s1b: 'radiant', s2: 'radiant', s3: 'science', s4: 'radiant', s5: 'science', s6: 'science', s7: 'radiant', s8: 'fruit' };
  const A = P.colours.a, B = P.colours.b;
  const ASSET = '../' + P.folder + '/assets/';

  /* ---------- colour helpers ---------- */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const hex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  const mix = (h1, h2, t) => { const a = rgb(h1), b = rgb(h2); return hex(a.map((v, i) => v + (b[i] - v) * t)); };
  const rgba = (h, o) => `rgba(${rgb(h).join(',')},${o})`;
  const C = {
    a: A, b: B, accent: mix(A, '#000000', 0.12), tint: mix(B, '#ffffff', 0.94), tint2: mix(B, '#ffffff', 0.84),
    line: mix(A, '#ffffff', 0.84), light: mix(B, '#ffffff', 0.45), pale: mix(B, '#ffffff', 0.7), deep: mix(A, '#000000', 0.3)
  };
  const rs = document.documentElement.style;
  rs.setProperty('--a', C.a); rs.setProperty('--b', C.b); rs.setProperty('--accent', C.accent);
  rs.setProperty('--tint', C.tint); rs.setProperty('--tint2', C.tint2); rs.setProperty('--line', C.line);
  rs.setProperty('--shadow', rgba(A, 0.28)); rs.setProperty('--shadow-soft', rgba(A, 0.08));
  document.title = P.name + ' – listing images';

  /* ---------- icons (48x48 stroke) ---------- */
  const I = {
    muscle: '<rect x="6" y="16" width="6" height="16" rx="2"/><rect x="12" y="12" width="6" height="24" rx="2"/><rect x="30" y="12" width="6" height="24" rx="2"/><rect x="36" y="16" width="6" height="16" rx="2"/><path d="M18 24h12M2 24h4M42 24h4"/>',
    bolt: '<path d="M26 4L10 26h12l-2 18 16-22H24z"/>',
    male: '<circle cx="20" cy="28" r="12"/><path d="M29 19L42 6M32 6h10v10"/>',
    atoms: '<circle cx="16" cy="16" r="9"/><circle cx="33" cy="17" r="7"/><circle cx="24" cy="34" r="8"/><path d="M23 18l4 0M19 24l2 3M30 23l-3 4"/>',
    mouth: '<path d="M6 22c5-7 13-10 18-6 5-4 13-1 18 6-5 9-13 14-18 14S11 31 6 22z"/><path d="M6 22h36"/><path d="M20 22v6c0 4 8 4 8 0v-6"/>',
    shield: '<path d="M24 4l16 6v12c0 11-7 18-16 22C15 40 8 33 8 22V10z"/><path d="M17 24l5 5 9-10"/>',
    sliders: '<path d="M8 12h20M36 12h4M8 24h6M22 24h18M8 36h22M38 36h2"/><circle cx="32" cy="12" r="4"/><circle cx="18" cy="24" r="4"/><circle cx="34" cy="36" r="4"/>',
    fruit: '<circle cx="18" cy="28" r="12"/><circle cx="32" cy="26" r="10"/><path d="M24 14c0-5 3-8 8-9-1 5-4 8-8 9z"/>',
    spray: '<rect x="14" y="20" width="16" height="24" rx="4"/><rect x="17" y="10" width="10" height="10" rx="2"/><path d="M27 13h4M35 8l4-2M36 13h5M35 18l4 2"/>',
    clock: '<circle cx="24" cy="24" r="18"/><path d="M24 13v11l7 5"/>',
    nowater: '<path d="M12 8h24l-3 34H15z"/><path d="M13 20h22"/><path d="M6 42L42 6"/>',
    moon: '<path d="M38 29A15 15 0 1 1 19 10a12 12 0 0 0 19 19z"/><path d="M34 7l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>',
    lungs: '<path d="M24 6v16"/><path d="M24 21c-1.6 2.4-3.6 3.6-6 3.6M24 21c1.6 2.4 3.6 3.6 6 3.6"/><path d="M19 15C13 15 9 23 9 33c0 3.6 2 5.8 5.4 5.8 3.6 0 5.6-2.4 5.6-6V22"/><path d="M29 15c6 0 10 8 10 18 0 3.6-2 5.8-5.4 5.8-3.6 0-5.6-2.4-5.6-6V22"/>',
    run: '<circle cx="29" cy="8" r="4"/><path d="M20 44l5-12-6-6 4-10 7 6 7 2"/><path d="M23 16l-8 2-3 7"/><path d="M25 32l8 4 2 8"/>',
    drop: '<path d="M24 5C18 14 11 21 11 29a13 13 0 0 0 26 0c0-8-7-15-13-24z"/><path d="M18 30a6 6 0 0 0 6 6"/>',
    layers: '<path d="M24 6L6 15l18 9 18-9z"/><path d="M6 24l18 9 18-9"/><path d="M6 33l18 9 18-9"/>',
    lipo: '<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="11"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<circle cx="${(24 + 14.5 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(24 + 14.5 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="1.6" fill="#fff"/>`).join(''),
    mushroom: '<path d="M6 22C6 12 14 6 24 6s18 6 18 16z"/><path d="M18 22v14a6 6 0 0 0 12 0V22"/><circle cx="16" cy="14" r="2"/><circle cx="30" cy="12" r="2.5"/>',
    flower: '<circle cx="24" cy="18" r="4"/><path d="M24 14c-2-6 2-10 0-10s2 4 0 10M28 18c6-2 10 2 10 0s-4 2-10 0M20 18c-6-2-10 2-10 0s4 2 10 0M24 22c-2 6 2 10 0 10"/><path d="M24 22v22M24 36c-4-4-10-4-12-2M24 34c4-4 10-4 12-2"/>',
    leaf: '<path d="M10 38C8 20 20 8 40 8c0 20-12 32-30 30z"/><path d="M10 38L30 18"/>',
    sparkle: '<path d="M22 6l3.6 10.4L36 20l-10.4 3.6L22 34l-3.6-10.4L8 20l10.4-3.6z"/><path d="M37 30l1.2 3.8L42 35l-3.8 1.2L37 40l-1.2-3.8L32 35l3.8-1.2z"/>',
    hair: '<path d="M16 42c5-7-1.6-15 2.8-25C20.4 13 22 10 24 7"/><path d="M24 42c5-7-1.6-15 2.8-25C28.4 13 30 10 32 7"/><path d="M32 42c5-7-1.6-15 2.8-25"/>',
    nail: '<path d="M16 44V20a8 8 0 0 1 16 0v24"/><path d="M19 22a5 5 0 0 1 10 0v6H19z"/>',
    brain: '<path d="M24 11a6 6 0 0 0-10.8 2.6A6 6 0 0 0 9.2 24a6 6 0 0 0 4 10.2A6 6 0 0 0 24 37.2z"/><path d="M24 11a6 6 0 0 1 10.8 2.6A6 6 0 0 1 38.8 24a6 6 0 0 1-4 10.2A6 6 0 0 1 24 37.2z"/><path d="M24 11v26M17 20c2 .4 3.4 1.6 4 3.6M31 20c-2 .4-3.4 1.6-4 3.6"/>',
    blood: '<path d="M24 5C18 14 11 21 11 29a13 13 0 0 0 26 0c0-8-7-15-13-24z"/><path d="M19 29h10M24 24v10"/>',
    cells: '<ellipse cx="17" cy="18" rx="10" ry="7"/><ellipse cx="17" cy="18" rx="4" ry="2.5"/><ellipse cx="31" cy="32" rx="10" ry="7"/><ellipse cx="31" cy="32" rx="4" ry="2.5"/>',
    stomach: '<path d="M18 4v8c0 4 3 6 7 6h3a10 10 0 0 1 10 10c0 9-8 16-17 16-6 0-11-4-11-9 0-4 3-7 7-7h2"/>',
    route: '<circle cx="10" cy="38" r="4"/><circle cx="38" cy="10" r="4"/><path d="M14 38h14a6 6 0 0 0 0-12H20a6 6 0 0 1 0-12h14"/>',
    target: '<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="4"/>',
    heart: '<path d="M24 40S9 31 9 19.6A8.4 8.4 0 0 1 24 14.4a8.4 8.4 0 0 1 15 5.2C39 31 24 40 24 40z"/>',
    bed: '<path d="M4 38V12M4 30h40v8M44 30v-6a6 6 0 0 0-6-6H20v12"/><circle cx="12" cy="23" r="4"/>',
    star: '<path d="M24 5l5.6 11.6L42 18.4l-9 8.8 2.2 12.6L24 34l-11.2 5.8L15 27.2l-9-8.8 12.4-1.8z"/>',
    relax: '<path d="M8 30c4-4 8-4 12 0s8 4 12 0 6-4 8-2"/><path d="M8 38c4-4 8-4 12 0s8 4 12 0 6-4 8-2"/><path d="M18 18c0-6 6-10 12-10-1 7-5 11-12 10z"/>'
  };
  const icon = (k, cls = 'icon', style = '') => `<div class="${cls}" style="${style}"><svg viewBox="0 0 48 48">${I[k]}</svg></div>`;
  const bottle = (f = 'original') => `<img class="bottle" src="${ASSET}bottle-${f}.png" alt="">`;
  const esc = s => s.replace(/&(?!amp;|nbsp;|lt;|gt;)/g, '&amp;');

  /* ---------- slides ---------- */
  const S = {};
  S.s1 = () => `<div class="shadow" style="left:180px;top:850px;width:640px;height:60px"></div>
    <img src="${ASSET}pack-hero.png" alt="" style="position:absolute;left:205px;top:105px;width:590px">`;
  S.s1b = S.s1;

  S.s2 = () => `<div class="blob" style="right:-180px;top:180px;width:720px;height:720px;background:radial-gradient(circle,#fff 0,#fff 45%,rgba(255,255,255,0) 70%)"></div>
    <div style="position:absolute;left:60px;top:70px;width:560px">
      <div class="eyebrow">${P.s2.eyebrow}</div>
      <h1 class="h" style="margin-top:18px">${P.s2.headline}</h1>
      <div style="margin-top:${P.s2.items.length > 3 ? 44 : P.s2.headline.split('<br>').length > 2 ? 64 : 110}px;display:flex;flex-direction:column;gap:${P.s2.items.length > 3 ? 24 : 38}px">
        ${P.s2.items.map(([ic, t, s]) => `<div style="display:flex;gap:24px;align-items:center">${icon(ic, 'icon', P.s2.items.length > 3 ? 'width:74px;height:74px' : '')}<div><div style="font-size:${P.s2.items.length > 3 ? 26 : 28}px;font-weight:700">${esc(t)}</div><div class="sub" style="${P.s2.items.length > 3 ? 'font-size:20px' : ''}">${esc(s)}</div></div></div>`).join('')}
      </div>
    </div>
    <div class="shadow" style="left:590px;top:900px;width:340px;height:50px"></div>
    <div style="position:absolute;left:620px;top:160px;width:280px">${bottle()}</div>
    <div class="brandmark">VIVID<span>NUTRIPHARM</span></div>`;

  S.s3 = () => `<div class="band" style="height:260px;background:var(--tint)"></div>
    <div style="position:absolute;left:0;right:0;top:52px;text-align:center">
      <div class="eyebrow">${P.s3.eyebrow}</div>
      <h1 class="h" style="margin-top:14px;font-size:58px">${P.s3.headline}</h1>
    </div>
    <div style="position:absolute;left:60px;right:60px;top:215px;display:grid;grid-template-columns:1fr 1fr;gap:30px">
      <div class="card" style="grid-column:1/3;display:flex;gap:26px;align-items:center;padding:30px 32px">${icon(P.s3.wide[0], 'icon', 'width:68px;height:68px')}<div><div class="ct">${esc(P.s3.wide[1])}</div>${P.s3.wide[2] ? `<div class="cs">${esc(P.s3.wide[2])}</div>` : ''}</div></div>
      ${P.s3.cards.map(([ic, t, s]) => `<div class="card" style="padding:34px 32px">${icon(ic, 'icon', 'width:68px;height:68px;margin-bottom:14px')}<div class="ct">${esc(t)}</div><div class="cs">${esc(s)}</div></div>`).join('')}
    </div>`;

  S.s4 = () => {
    const n = P.s4.tiles.length, size = n > 3 ? 92 : n > 2 ? (P.s4.sub ? 100 : 108) : n > 1 ? 124 : 150, top = (n > 3 ? 310 : n > 1 ? 340 : 430) + (P.s4.sub ? 44 : 0);
    const tile = ([sym, label, dose]) => {
      const inner = sym[0] === '@' ? `<svg viewBox="0 0 48 48" style="width:${size * .5}px;height:${size * .5}px;stroke:#fff;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round">${I[sym.slice(1)]}</svg>`
        : `<span style="font:800 ${sym.length > 3 ? size * .24 : sym.length > 2 ? size * .3 : size * .42}px 'Inter Display',Inter">${sym}</span>`;
      return `<div style="display:flex;align-items:center;gap:26px;color:#fff">
        <div style="width:${size}px;height:${size}px;border-radius:${size * .23}px;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.55);display:grid;place-items:center;flex:none">${inner}</div>
        <div><b style="font-size:${n > 3 ? 32 : n > 1 ? 36 : 42}px;font-weight:700">${label}</b>${dose ? `<div style="font-size:24px;font-weight:600;color:rgba(255,255,255,.85);margin-top:6px">${dose}</div>` : ''}</div></div>`;
    };
    return `<div style="position:absolute;left:60px;top:70px;width:560px;color:#fff">
        <div class="eyebrow" style="color:rgba(255,255,255,.85)">The formula</div>
        <h1 class="h" style="color:#fff;margin-top:16px">${P.s4.headline}</h1>
        ${P.s4.sub ? `<div style="margin-top:16px;font-size:22px;line-height:1.35;font-weight:600;color:rgba(255,255,255,.88);max-width:520px">${P.s4.sub}</div>` : ''}
      </div>
      <div style="position:absolute;left:60px;top:${top}px;display:flex;flex-direction:column;gap:${n > 3 ? 8 : 18}px">
        ${P.s4.tiles.map(tile).join(`<div style="font-size:${n > 3 ? 32 : 40}px;font-weight:300;color:#fff;margin-left:${size / 2 - 10}px;line-height:1">+</div>`)}
      </div>
      <div class="shadow" style="left:560px;top:880px;width:400px;height:60px;background:radial-gradient(closest-side,rgba(0,0,0,.4),rgba(0,0,0,0))"></div>
      <div style="position:absolute;left:610px;top:150px;width:290px">${bottle()}</div>
      <div style="position:absolute;left:60px;bottom:58px;background:#fff;color:${C.accent};border-radius:999px;padding:16px 30px;font-weight:800;font-size:24px">${P.s4.badge}</div>`;
  };

  S.s5 = () => {
    const pts = P.s5.points;
    const head = `<div style="position:absolute;left:0;right:0;top:52px;text-align:center"><div class="eyebrow">${P.s5.eyebrow}</div>
      <h1 class="h" style="font-size:54px;margin-top:12px">${P.s5.headline}</h1></div>`;
    if (pts.length === 4) {
      return head + `<div style="position:absolute;left:50px;right:50px;top:205px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
        ${pts.map(([ic, t, s]) => `<div class="card" style="padding:32px 30px;min-height:355px">${icon(ic, 'icon', 'width:68px;height:68px;margin-bottom:18px')}<div class="ct" style="font-size:28px">${esc(t)}</div><div class="cs" style="font-size:21px;margin-top:12px">${esc(s)}</div></div>`).join('')}</div>`;
    }
    return head + `<div class="shadow" style="left:60px;top:905px;width:300px;height:50px"></div>
      <div style="position:absolute;left:85px;top:225px;width:250px">${bottle()}</div>
      <div style="position:absolute;left:400px;right:50px;top:200px;display:flex;flex-direction:column;gap:22px">
        ${pts.map(([ic, t, s]) => `<div class="card" style="display:flex;gap:22px;padding:28px 28px;align-items:flex-start">${icon(ic, 'icon', 'width:64px;height:64px')}<div><div class="ct">${esc(t)}</div><div class="cs">${esc(s)}</div></div></div>`).join('')}
      </div>`;
  };

  S.s6 = () => {
    const longest = Math.max(...P.s6.pros.concat(P.s6.cons).map(t => t.length));
    const fs = longest > 38 ? 19 : 21, top = longest > 38 ? 660 : 700;
    const li = (arr, ok) => arr.map(t => `<li style="font-size:${fs}px;line-height:1.28;padding-left:42px;position:relative;${ok ? '' : 'color:#5d6278'}"><span style="position:absolute;left:0;top:-1px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:17px;font-weight:800;${ok ? `background:#fff;color:${C.accent}` : 'background:#e1e3ea;color:#8a8fa3'}">${ok ? '✓' : '✕'}</span>${esc(t)}</li>`).join('');
    const tablets = `<svg viewBox="0 0 260 340" style="width:100%"><g fill="#fff" stroke="#c7cbd8" stroke-width="2"><rect x="20" y="20" width="220" height="300" rx="22" fill="#e9ebf1"/>
      ${[0, 1, 2, 3].map(r => [0, 1].map(c => `<ellipse cx="${80 + c * 100}" cy="${70 + r * 68}" rx="40" ry="24"/><line x1="${48 + c * 100}" y1="${70 + r * 68}" x2="${112 + c * 100}" y2="${70 + r * 68}" stroke="#dde0e8"/>`).join('')).join('')}</g></svg>`;
    return `<div style="position:absolute;left:0;right:0;top:56px;text-align:center"><div class="eyebrow">Spray vs tablets</div>
        <h1 class="h" style="font-size:56px;margin-top:12px">Why choose an <em>oral spray?</em></h1></div>
      <div style="position:absolute;left:50px;top:230px;width:440px;height:700px;border-radius:34px;background:linear-gradient(170deg,${C.b},${C.a});box-shadow:0 24px 50px ${rgba(A, .3)}"></div>
      <div style="position:absolute;left:510px;top:230px;width:440px;height:700px;border-radius:34px;background:#f3f4f8;border:1.5px solid #e3e5ee"></div>
      <div style="position:absolute;left:198px;top:${top - 442}px;width:145px">${bottle()}</div>
      <div style="position:absolute;left:600px;top:290px;width:260px">${tablets}</div>
      <div style="position:absolute;left:80px;top:${top}px;width:390px;color:#fff">
        <div style="font-size:30px;font-weight:800;margin-bottom:18px">${P.s6.title || P.short + ' Oral Spray'}</div><ul style="list-style:none;display:flex;flex-direction:column;gap:14px">${li(P.s6.pros, true)}</ul></div>
      <div style="position:absolute;left:540px;top:${top}px;width:390px">
        <div style="font-size:30px;font-weight:800;margin-bottom:18px;color:#454b63">Tablets</div><ul style="list-style:none;display:flex;flex-direction:column;gap:14px">${li(P.s6.cons, false)}</ul></div>`;
  };

  S.s7 = () => {
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const mist = `<svg viewBox="0 0 200 160" style="width:100%">${Array.from({ length: 60 }, () => { const a = (-38 + rnd() * 58) * Math.PI / 180, d = 20 + rnd() * 150; return `<circle cx="${10 + Math.cos(a) * d}" cy="${110 + Math.sin(a) * d}" r="${1.5 + rnd() * 3.5}" fill="${C.b}" opacity="${(0.6 - d / 400).toFixed(2)}"/>`; }).join('')}</svg>`;
    const steps = P.steps || [['spray', '6 puffs / day', 'Spray directly into the mouth'], ['clock', 'Any time of day', 'Take at any time of the day'], ['nowater', 'No food or water', 'No food or water required']];
    return `<div style="position:absolute;left:0;right:0;top:60px;text-align:center"><div class="eyebrow">How to use</div>
        <h1 class="h" style="font-size:60px;margin-top:12px">Just <em>spray</em> &amp; go</h1></div>
      <div style="position:absolute;left:390px;top:200px;width:220px">${bottle()}</div>
      <div style="position:absolute;left:489px;top:128px;width:200px">${mist}</div>
      <div style="position:absolute;left:50px;right:50px;top:690px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px">
        ${steps.map(([ic, b, s]) => `<div style="background:#fff;border-radius:28px;padding:28px 20px 26px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;box-shadow:0 14px 34px ${rgba(A, .08)}">${icon(ic, 'icon', 'margin-bottom:8px')}<b style="font-size:26px">${b}</b><span style="font-size:18px;color:var(--muted)">${s}</span></div>`).join('')}
      </div>`;
  };

  const FL = [['Strawberry', 'strawberry', '#f0647d', '#c42a4a', '#fde8ec'], ['Mint', 'mint', '#3cc79a', '#138a65', '#e3f7f0'], ['Orange', 'orange', '#ffa53d', '#e46a0c', '#fff0de'], ['Mango', 'mango', '#ffd04a', '#e59a00', '#fff6d6']];
  S.s8 = () => `<div style="position:absolute;left:0;right:0;top:60px;text-align:center"><div class="eyebrow">${P.s8.eyebrow || 'Choose your flavour'}</div>
      <h1 class="h" style="font-size:56px;margin-top:12px">${P.s8.headline}</h1></div>
    <div style="position:absolute;left:40px;right:40px;top:240px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
      ${FL.map(([n, f, c1, c2, bg]) => `<div class="flv" data-flavour="${n}" style="background:${bg};border-radius:30px;height:690px;position:relative;overflow:hidden;isolation:isolate">
        <div class="blob" style="left:5px;top:150px;width:210px;height:210px;background:${c1};opacity:.18"></div>
        <div class="shadow" style="left:20px;top:560px;width:180px;height:34px"></div>
        <div style="position:absolute;left:18px;top:40px;width:190px">${bottle()}</div>
        <div style="position:absolute;left:0;right:0;bottom:30px;text-align:center"><div style="display:inline-block;background:${c2};color:#fff;font-weight:800;font-size:24px;padding:12px 26px;border-radius:999px">${n}</div></div>
      </div>`).join('')}
    </div>`;

  const BG = {
    s1: '#fff', s1b: '#fff', s2: `linear-gradient(160deg,${C.tint} 0%,${C.tint2} 100%)`, s3: '#fff',
    s4: `radial-gradient(circle at 70% 55%,${mix(B, '#ffffff', .15)} 0,${mix(A, B, .45)} 55%,${C.deep} 100%)`,
    s5: `linear-gradient(180deg,#fff 0,${C.tint} 100%)`, s6: '#fff', s7: `linear-gradient(160deg,${C.tint} 0%,${C.tint2} 100%)`, s8: '#fff'
  };
  const root = document.getElementById('root');
  ['s1', 's1b', 's2', 's3', 's4', 's5', 's6', 's7', 's8'].forEach(id => {
    const sec = document.createElement('section');
    sec.className = 'slide'; sec.id = id; sec.style.background = BG[id];
    sec.innerHTML = S[id]();
    root.appendChild(sec);
  });

  /* ---------- background themes ---------- */
  let n = 0; const uid = p => p + (n++);
  let seed = 11; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const glow = (cx, cy, r, col, op) => { const id = uid('g'); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`; };
  const rays = (cx, cy, r, col, op, count = 28) => { const id = uid('m'); let p = ''; for (let i = 0; i < count; i++) { const a = i / count * Math.PI * 2, w = Math.PI / count * 0.55; p += `M${cx} ${cy} L${cx + Math.cos(a - w) * r} ${cy + Math.sin(a - w) * r} L${cx + Math.cos(a + w) * r} ${cy + Math.sin(a + w) * r}Z`; }
    return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".25" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="${id}k"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/></mask></defs><path d="${p}" fill="${col}" opacity="${op}" mask="url(#${id}k)"/>`; };
  const bokeh = (x0, y0, x1, y1, k, col, maxop) => { let s = ''; for (let i = 0; i < k; i++) { const r = 6 + R() * 26; s += `<circle cx="${x0 + R() * (x1 - x0)}" cy="${y0 + R() * (y1 - y0)}" r="${r}" fill="${col}" opacity="${(0.08 + R() * maxop).toFixed(2)}"/>`; } return s; };
  const orb = (cx, cy, r) => glow(cx, cy, r * 3.2, C.light, .5) + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.light}" opacity=".45"/><circle cx="${cx}" cy="${cy}" r="${r * .7}" fill="${C.pale}" opacity=".55"/>`;
  const hexPattern = (col, op, size = 34, area = [0, 0, 1000, 1000]) => { const id = uid('h'), w = size * Math.sqrt(3), h = size * 3;
    return `<defs><pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><path d="M${w / 2} 0 L${w} ${size / 2} L${w} ${size * 1.5} L${w / 2} ${size * 2} L0 ${size * 1.5} L0 ${size / 2}Z M${w / 2} ${size * 2} L${w / 2} ${h}" fill="none" stroke="${col}" stroke-width="1.4"/></pattern></defs><rect x="${area[0]}" y="${area[1]}" width="${area[2]}" height="${area[3]}" fill="url(#${id})" opacity="${op}"/>`; };
  const bubble = (cx, cy, r, col, op) => { let s = `<g opacity="${op}"><circle cx="${cx}" cy="${cy}" r="${r * .78}" fill="${col}" fill-opacity=".10"/>`; const k = Math.max(14, Math.round(r * 0.9));
    for (const [rr, rad] of [[r, r * .11], [r * .82, r * .08]]) for (let i = 0; i < k; i++) { const a = i / k * Math.PI * 2; s += `<circle cx="${cx + Math.cos(a) * rr}" cy="${cy + Math.sin(a) * rr}" r="${rad}" fill="${col}"/>`; }
    return s + `<circle cx="${cx}" cy="${cy}" r="${r * .3}" fill="${col}" opacity=".35"/></g>`; };
  let pi = 0;
  const dots = (x0, y0, x1, y1, k, col, op) => { let s = ''; for (let i = 0; i < k; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), r = 13 + R() * 10, t = P.particles[(pi++) % P.particles.length];
    s += `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="2"/><text x="${x}" y="${y + r * .36}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="${r * (t.length > 1 ? .8 : 1.05)}" fill="${col}">${t}</text></g>`; } return s; };
  const leaf = (x, y, s, rot, c = '#5cb85c') => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C 20 -30, 70 -34, 100 0 C 70 34, 20 30, 0 0Z" fill="${c}"/><path d="M4 0 L92 0" stroke="#fff" stroke-opacity=".45" stroke-width="2.5"/></g>`;
  const orangeSlice = (cx, cy, r, rot) => { let seg = ''; for (let i = 0; i < 10; i++) { const a0 = i / 10 * Math.PI * 2 + .05, a1 = (i + 1) / 10 * Math.PI * 2 - .05, ri = r * .12, ro = r * .8;
    seg += `<path d="M${Math.cos(a0) * ri} ${Math.sin(a0) * ri} L${Math.cos(a0) * ro} ${Math.sin(a0) * ro} A${ro} ${ro} 0 0 1 ${Math.cos(a1) * ro} ${Math.sin(a1) * ro} L${Math.cos(a1) * ri} ${Math.sin(a1) * ri}Z" fill="#f7a12a" opacity=".85"/>`; }
    return `<g transform="translate(${cx} ${cy}) rotate(${rot})"><circle r="${r}" fill="#f7a12a"/><circle r="${r * .9}" fill="#fff4dc"/>${seg}</g>`; };
  const strawberry = (x, y, s, rot) => { let sd = ''; for (let i = 0; i < 22; i++) { const a = R(), b = R(); sd += `<ellipse cx="${(a - .5) * 70 * (1 - b * .6)}" cy="${-28 + b * 80}" rx="2.2" ry="3.4" fill="#ffe38a"/>`; }
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 62 C -40 40 -55 -10 -40 -30 C -25 -48 25 -48 40 -30 C 55 -10 40 40 0 62Z" fill="#e8344e"/>${sd}<path d="M0 -36 L-26 -48 L-10 -40 L-18 -58 L0 -44 L18 -58 L10 -40 L26 -48Z" fill="#3aa35a"/></g>`; };
  const mango = (x, y, s, rot) => { const id = uid('mg'); return `<defs><radialGradient id="${id}" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#ffd84a"/><stop offset=".6" stop-color="#ffb020"/><stop offset="1" stop-color="#f07b12"/></radialGradient></defs><g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-10 -55 C 40 -62 70 -10 55 30 C 42 62 -10 70 -40 45 C -66 22 -58 -40 -10 -55Z" fill="url(#${id})"/>${leaf(4, -74, .55, -30, '#3f9b4f')}</g>`; };
  const mint = (x, y, s, rot) => { let l = ''; [[0, 0, -35], [0, 0, 35], [0, -40, -40], [0, -40, 40], [0, -78, -45], [0, -78, 45], [0, -108, -90]].forEach(([dx, dy, r], i) => { l += leaf(dx, dy, .62, r - 90, i % 2 ? '#2fb37b' : '#25a06c'); });
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 40 L0 -110" stroke="#1f8a5b" stroke-width="5"/>${l}</g>`; };

  const THEME = {
    radiant: {
      s1b: rays(500, 470, 640, C.light, .22) + glow(500, 470, 560, C.pale, .5) + bokeh(40, 60, 960, 940, 16, C.light, .14),
      s2: rays(760, 380, 620, C.light, .22) + orb(760, 330, 70) + bokeh(560, 80, 980, 960, 14, '#ffffff', .35),
      s4: rays(755, 500, 760, '#ffffff', .16) + glow(755, 500, 420, '#ffffff', .35) + bokeh(560, 60, 990, 960, 16, '#ffffff', .22),
      s7: rays(500, 400, 700, C.light, .22) + orb(500, 380, 95) + bokeh(30, 160, 970, 680, 18, '#ffffff', .4)
    },
    science: {
      s3: hexPattern(A, .09, 30, [0, 0, 1000, 260]) + bubble(70, 70, 46, A, .3) + bubble(940, 170, 40, A, .3) + dots(820, 20, 1000, 120, 3, A, .3),
      s5: hexPattern(A, .08, 30, [0, 0, 1000, 210]) + dots(5, 25, 55, 200, 3, A, .35) + dots(945, 25, 995, 200, 3, A, .35),
      s6: hexPattern(A, .08, 30, [0, 0, 1000, 230]) + bubble(80, 90, 44, A, .32) + bubble(925, 95, 48, A, .32) + bubble(500, 968, 24, A, .28)
    },
    fruit: {
      s8: leaf(10, 60, .9, -10) + leaf(15, 170, .75, 25, '#66bb6a') + leaf(990, 60, .9, 190) + leaf(985, 170, .75, 155, '#66bb6a'),
      card: { Strawberry: strawberry(170, 560, 1.1, 20) + strawberry(50, 470, .75, -25), Mint: mint(175, 600, 1.05, 18) + mint(40, 520, .7, -20),
              Orange: orangeSlice(180, 540, 72, 10) + orangeSlice(40, 470, 48, 40), Mango: mango(175, 545, 1.05, 15) + mango(45, 480, .7, -30) }
    }
  };
  const layer = (el, svg, w = 1000, h = 1000) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.setAttribute('class', 'deco'); s.setAttribute('preserveAspectRatio', 'none'); s.innerHTML = svg; el.insertBefore(s, el.firstChild); };
  const MOTIF = window.MOTIFS ? window.MOTIFS(q.get('p'), C) : null;
  ['s1', 's1b', 's2', 's3', 's4', 's5', 's6', 's7', 's8'].forEach(id => {
    const t = forced || MIX[id];
    // benefit-themed background for the product (default), generic theme otherwise
    const art = (!forced && MOTIF && MOTIF[id]) || (THEME[t] && THEME[t][id]);
    if (art) layer(document.getElementById(id), art);
    if (id === 's8' && t === 'fruit') document.querySelectorAll('#s8 .flv').forEach(c => layer(c, THEME.fruit.card[c.dataset.flavour], 218, 690));
  });
})();
