/* Benefit-themed backgrounds, one per product.
   window.MOTIFS(productId, C) returns { slideId: svgMarkup } for the slides it decorates.
   Only decoration: every element sits in areas the slide content leaves free
   (corners, header sides, behind the bottle), so no text or product is covered. */
window.MOTIFS = function (pid, C) {
  let seed = 23; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let n = 0; const uid = p => 'm' + p + (n++);
  const g = (x, y, rot, s, inner, op = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}">${inner}</g>`;

  /* ---------- elements, drawn at roughly 100 units across ---------- */
  const E = {
    dumbbell: (c, f) => `<g fill="${f}" stroke="${c}" stroke-width="4" stroke-linejoin="round"><rect x="-50" y="-18" width="12" height="36" rx="3"/><rect x="-38" y="-28" width="13" height="56" rx="3"/><rect x="25" y="-28" width="13" height="56" rx="3"/><rect x="38" y="-18" width="12" height="36" rx="3"/></g><path d="M-25 0H25" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
    kettlebell: (c, f) => `<g fill="${f}" stroke="${c}" stroke-width="4" stroke-linejoin="round"><path d="M-17 -18v-12a17 17 0 0 1 34 0v12h-8v-11a9 9 0 0 0-18 0v11z"/><path d="M-30 -16h60c4 0 6 3 6 7 0 30-18 50-36 50s-36-20-36-50c0-4 2-7 6-7z"/></g>`,
    moon: (c, f) => `<path d="M16 -44A46 46 0 1 0 44 26 37 37 0 0 1 16 -44z" fill="${f}" stroke="${c}" stroke-width="3"/>`,
    sparkle: (c) => `<path d="M0 -50C6 -12 12 -6 50 0 12 6 6 12 0 50-6 12-12 6-50 0-12-6-6-12 0-50z" fill="${c}"/>`,
    star: (c) => `<path d="M0 -48l13 30 33 3-25 21 8 32L0 21l-29 17 8-32-25-21 33-3z" fill="${c}"/>`,
    cloud: (c, f) => `<path d="M-52 22a20 20 0 0 1 6-40 30 30 0 0 1 56-8 24 24 0 0 1 42 20 20 20 0 0 1-6 28z" fill="${f}" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`,
    zzz: (c) => `<text x="-40" y="10" font-family="Inter" font-weight="800" font-size="44" fill="${c}">Z</text><text x="2" y="-14" font-family="Inter" font-weight="800" font-size="32" fill="${c}">z</text><text x="30" y="-34" font-family="Inter" font-weight="800" font-size="22" fill="${c}">z</text>`,
    o2: (c, f) => { const id = uid('o'); return `<defs><radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="${f}" stop-opacity=".55"/></radialGradient></defs><circle r="46" fill="url(#${id})" stroke="${c}" stroke-width="3"/><text y="12" text-anchor="middle" font-family="Inter" font-weight="800" font-size="34" fill="${c}">O₂</text>`; },
    pulse: (c) => `<path d="M-60 0H-28L-18 -26-6 30 6 -40 16 18 24 0H60" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
    bolt: (c, f) => `<path d="M8 -50L-30 8h26l-8 42 40-60H2z" fill="${f}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    neuron: (c) => `<g stroke="${c}" stroke-width="3" fill="none"><path d="M0 0L-38 -24M0 0L36 -30M0 0L-30 34M0 0L40 26M-38 -24L-50 -46M36 -30L52 -20M40 26L48 48"/></g><circle r="14" fill="${c}"/>${[[-38, -24], [36, -30], [-30, 34], [40, 26], [-50, -46], [52, -20], [48, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`).join('')}`,
    rbc: (c) => { const id = uid('r'); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".55"/><stop offset=".45" stop-color="${c}" stop-opacity=".75"/><stop offset=".8" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".9"/></radialGradient></defs><g transform="scale(1 .62)"><circle r="50" fill="url(#${id})"/><circle r="24" fill="#fff" opacity=".22"/></g>`; },
    hair: (c) => `<g fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round">${[-24, -12, 0, 12, 24].map((d, i) => `<path d="M${d - 10} -55C${d + 30} -25 ${d - 30} 5 ${d + 6} 55" opacity="${.55 + i * .1}"/>`).join('')}</g>`,
    flower: (c, f) => `<g fill="${f}" stroke="${c}" stroke-width="2.5">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-24" rx="15" ry="24" transform="rotate(${a})"/>`).join('')}</g><circle r="11" fill="${c}"/>`,
    leaf: (c) => `<path d="M-50 0C-28 -30 22 -34 50 0 22 34-28 30-50 0z" fill="${c}"/><path d="M-46 0H42" stroke="#fff" stroke-opacity=".5" stroke-width="2.5"/>`,
    citrus: (c, inner = '#fff4dc') => { let s = ''; for (let i = 0; i < 10; i++) { const a0 = i / 10 * Math.PI * 2 + .05, a1 = (i + 1) / 10 * Math.PI * 2 - .05, ri = 6, ro = 40; s += `<path d="M${Math.cos(a0) * ri} ${Math.sin(a0) * ri}L${Math.cos(a0) * ro} ${Math.sin(a0) * ro}A${ro} ${ro} 0 0 1 ${Math.cos(a1) * ro} ${Math.sin(a1) * ro}L${Math.cos(a1) * ri} ${Math.sin(a1) * ri}z" fill="${c}" opacity=".85"/>`; } return `<circle r="50" fill="${c}"/><circle r="45" fill="${inner}"/>${s}`; },
    drop: (c) => `<path d="M0 -50C-14 -20-30 0-30 18a30 30 0 0 0 60 0c0-18-16-38-30-68z" fill="${c}"/><ellipse cx="-10" cy="16" rx="7" ry="11" fill="#fff" opacity=".6"/>`,
    apple: () => `<path d="M0 -26C-14 -40-48 -34-48 0c0 30 22 52 36 50 6 0 8-4 12-4s6 4 12 4c14 2 36-20 36-50 0-34-34-40-48-26z" fill="#e8443a"/><path d="M0 -26C0 -38 4 -46 10 -52" stroke="#6b4a1e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -40C16 -58 36 -56 40 -48 28 -38 16 -38 6 -40z" fill="#4caf50"/><ellipse cx="-24" cy="-8" rx="8" ry="14" fill="#fff" opacity=".3"/>`,
    carrot: () => `<path d="M-8 -36L34 46C14 40-26 2-30 -18z" fill="#f28a1e"/><path d="M-6 -4l12 4M2 14l12 4M-14 -20l10 4" stroke="#d26a0a" stroke-width="3" stroke-linecap="round"/><path d="M-20 -26C-34 -40-40 -54-36 -60-22 -52-16 -42-20 -26zM-20 -26C-20 -46-12 -60-4 -62 2 -50-4 -38-20 -26zM-20 -26C-38 -30-50 -24-54 -18-42 -10-30 -14-20 -26z" fill="#3fa34d"/>`,
    broccoli: () => `<path d="M-8 10h16l6 40h-28z" fill="#8bc34a"/><g fill="#3e8e41">${[[-26, -6, 20], [0, -20, 24], [26, -6, 20], [-12, 10, 18], [14, 10, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><g fill="#5cb85c">${[[-30, -12, 7], [-2, -30, 8], [22, -14, 7], [6, -6, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`,
    berries: () => `<g>${[[-20, 8], [16, 10], [-2, -18], [24, -20], [-26, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="#4b5fc1"/><circle cx="${x - 6}" cy="${y - 6}" r="5" fill="#fff" opacity=".35"/><path d="M${x - 4} ${y - 16}l4 4 4-4" stroke="#2c3a80" stroke-width="2" fill="none"/>`).join('')}</g>`,
    capsule: (c) => `<g transform="rotate(-35)"><rect x="-46" y="-18" width="92" height="36" rx="18" fill="${c}"/><path d="M0 -18h28a18 18 0 0 1 0 36H0z" fill="#fff" opacity=".55"/></g>`,
    lungs: (c, f) => `<g fill="${f}" stroke="${c}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M-8 -20C-24 -26-44 -6-44 26c0 12 8 20 20 18 12-2 16-10 16-24z"/><path d="M8 -20C24 -26 44 -6 44 26c0 12-8 20-20 18-12-2-16-10-16-24z"/></g><path d="M0 -50V-8M0 -14L-8 -4M0 -14L8 -4" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    swirl: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"><path d="M-50 -14H18a14 14 0 1 0-14-14"/><path d="M-50 4H34a12 12 0 1 1-12 12"/><path d="M-40 22H2"/></g>`,
    bulb: (c, f) => `<path d="M0 -48a30 30 0 0 0-18 54c4 4 6 8 6 14h24c0-6 2-10 6-14A30 30 0 0 0 0 -48z" fill="${f}" stroke="${c}" stroke-width="4"/><path d="M-12 30h24M-9 40h18" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M-8 2l8-10 8 10" fill="none" stroke="${c}" stroke-width="3"/>`,
    heart: (c, f) => `<path d="M0 40S-46 12-46 -14a24 24 0 0 1 46-10 24 24 0 0 1 46 10C46 12 0 40 0 40z" fill="${f}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    male: (c) => `<g fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"><circle cx="-10" cy="10" r="26"/><path d="M10 -10L40 -40M20 -40H40V-20"/></g>`,
    flame: (c, f) => `<path d="M0 -50C10 -24 34 -14 34 14A34 34 0 0 1-34 14C-34 -6-18 -16-14 -34-6 -22 4 -26 0 -50z" fill="${f}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><path d="M0 4c6 10 14 14 14 24a14 14 0 0 1-28 0c0-8 8-12 14-24z" fill="${c}" opacity=".5"/>`,
    bubble: (c) => { const id = uid('b'); return `<defs><radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="${c}" stop-opacity=".35"/></radialGradient></defs><circle r="46" fill="url(#${id})" stroke="${c}" stroke-width="2.5"/><ellipse cx="-16" cy="-18" rx="10" ry="6" fill="#fff" opacity=".8" transform="rotate(-35 -16 -18)"/>`; },
    target: (c) => `<g fill="none" stroke="${c}" stroke-width="4"><circle r="44"/><circle r="28"/></g><circle r="10" fill="${c}"/>`,
    hexgem: (c, f, t) => `<path d="M0 -48L42 -24V24L0 48-42 24V-24z" fill="${f}" stroke="${c}" stroke-width="4"/><text y="12" text-anchor="middle" font-family="Inter" font-weight="800" font-size="32" fill="${c}">${t}</text>`
  };

  /* ---------- full-slide washes (very low contrast) ---------- */
  const W = {
    streaks: (c, op, k = 22) => { let s = ''; for (let i = 0; i < k; i++) { const x = R() * 1100 - 50, y = R() * 1000, l = 80 + R() * 220; s += `<path d="M${x} ${y}l${l} ${-l * .36}" stroke="${c}" stroke-width="${2 + R() * 5}" stroke-linecap="round" opacity="${(op * (.4 + R() * .6)).toFixed(3)}"/>`; } return s; },
    stars: (c, op, k = 70) => { let s = ''; for (let i = 0; i < k; i++) s += `<circle cx="${R() * 1000}" cy="${R() * 1000}" r="${1 + R() * 2.6}" fill="${c}" opacity="${(op * (.3 + R() * .7)).toFixed(3)}"/>`; return s; },
    vessels: (c, op) => [[-80, 260], [-60, 520], [-40, 780]].map(([x, y], i) => `<path d="M${x} ${y}C200 ${y - 140} 420 ${y + 160} 640 ${y - 20}S920 ${y - 150} 1100 ${y + 40}" fill="none" stroke="${c}" stroke-width="${46 - i * 10}" stroke-linecap="round" opacity="${op}"/>`).join(''),
    waves: (c, op) => Array.from({ length: 9 }, (_, i) => { const y = 80 + i * 110; return `<path d="M-40 ${y}C180 ${y - 60} 320 ${y + 70} 540 ${y}S880 ${y - 70} 1040 ${y + 10}" fill="none" stroke="${c}" stroke-width="2" opacity="${op}"/>`; }).join(''),
    network: (c, op, k = 26) => { const pts = Array.from({ length: k }, () => [R() * 1000, R() * 1000]); let s = '';
      pts.forEach((p, i) => { pts.map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])]).filter(([j]) => j > i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j, d]) => { if (d < 260) s += `<line x1="${p[0]}" y1="${p[1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${c}" stroke-width="1.6" opacity="${op}"/>`; }); s += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${c}" opacity="${op * 1.6}"/>`; }); return s; },
    hexes: (c, op) => { const id = uid('h'), sz = 40, w = sz * Math.sqrt(3), h = sz * 3; return `<defs><pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><path d="M${w / 2} 0L${w} ${sz / 2}V${sz * 1.5}L${w / 2} ${sz * 2}L0 ${sz * 1.5}V${sz / 2}z M${w / 2} ${sz * 2}V${h}" fill="none" stroke="${c}" stroke-width="1.5"/></pattern></defs><rect width="1000" height="1000" fill="url(#${id})" opacity="${op}"/>`; },
    juice: (c, op) => { let s = ''; for (let i = 0; i < 34; i++) { const r = 3 + R() * 9; s += `<circle cx="${R() * 1000}" cy="${R() * 1000}" r="${r}" fill="${c}" opacity="${(op * (.4 + R() * .6)).toFixed(3)}"/>`; } return s; },
    confetti: (cols, op) => { let s = ''; for (let i = 0; i < 40; i++) { const x = R() * 1000, y = R() * 1000; s += `<rect x="${x}" y="${y}" width="${6 + R() * 8}" height="${3 + R() * 4}" rx="2" fill="${cols[i % cols.length]}" transform="rotate(${R() * 180} ${x} ${y})" opacity="${op}"/>`; } return s; }
  };

  /* ---------- free spots on each slide: [x, y, size] ---------- */
  const SPOTS = {
    s1b: [[95, 150, 120], [905, 130, 100], [100, 870, 150], [905, 860, 150], [130, 520, 70], [880, 500, 70], [500, 960, 50]],
    s2: [[935, 120, 90], [615, 905, 75], [965, 560, 70], [760, 70, 55], [975, 900, 60]],
    s3: [[70, 80, 80], [940, 170, 70], [905, 55, 45], [125, 200, 40]],
    s4: [[905, 120, 100], [600, 920, 80], [975, 640, 60], [800, 60, 45]],
    s5: [[48, 70, 60], [955, 70, 60], [90, 175, 34], [915, 175, 34]],
    s6: [[85, 95, 70], [920, 100, 74], [500, 968, 32], [190, 190, 30], [810, 190, 30]],
    s7: [[180, 420, 150], [830, 440, 140], [110, 250, 70], [905, 640, 80], [250, 640, 60], [700, 250, 50]]
  };

  /* ---------- per product: elements cycled over the spots + wash ---------- */
  const tint = C.pale, deep = C.a, bright = C.b;
  const PLAN = {
    zma: { items: ['dumbbell', 'moon', 'hexZn', 'star', 'dumbbell', 'hexMg', 'moon'], wash: (d) => W.hexes(d ? '#fff' : deep, .05) + W.stars(d ? '#fff' : deep, .35, 30) },
    'vo2-maxx': { items: ['o2', 'pulse', 'o2', 'o2', 'pulse', 'o2', 'o2'], wash: (d) => W.streaks(d ? '#fff' : bright, .18) },
    multivitamin: { items: ['citrusO', 'apple', 'broccoli', 'carrot', 'berries', 'leaf', 'capsule'], wash: () => W.confetti([deep, bright, '#ffc94d', '#4caf50'], .14) },
    'vitamin-c': { items: ['citrusO', 'citrusL', 'drop', 'leaf', 'citrusY', 'sparkle', 'citrusO'], wash: (d) => W.juice(d ? '#fff' : '#f7b733', .22) },
    iron: { items: ['rbcs', 'rbc', 'rbcs', 'leaf', 'rbc', 'rbcs', 'rbc'], wash: (d) => W.vessels(d ? '#fff' : deep, .05) },
    biotin: { items: ['hair', 'sparkle', 'flower', 'hair', 'sparkle', 'flower', 'sparkle'], wash: (d) => W.waves(d ? '#fff' : deep, .12) },
    sleep: { items: ['moon', 'cloud', 'star', 'zzz', 'cloud', 'star', 'sparkle'], wash: (d) => W.stars(d ? '#fff' : deep, .6, 90) },
    'smokers-cough': { items: ['leaf', 'lungs', 'swirl', 'leaf', 'lungs', 'swirl', 'leaf'], wash: (d) => W.waves(d ? '#fff' : bright, .14) },
    'mind-focus': { items: ['bulb', 'neuron', 'target', 'sparkle', 'bulb', 'neuron', 'sparkle'], wash: (d) => W.network(d ? '#fff' : deep, .1) },
    'erectile-dysfunction': { items: ['heart', 'pulse', 'heart', 'sparkle', 'heart', 'pulse', 'sparkle'], wash: (d) => W.vessels(d ? '#fff' : deep, .05) },
    testoboost: { items: ['male', 'flame', 'bolt', 'dumbbell', 'flame', 'male', 'bolt'], wash: (d) => W.hexes(d ? '#fff' : deep, .05) },
    'dry-mouth': { items: ['bubble', 'drop', 'leaf', 'bubble', 'drop', 'bubble', 'leaf'], wash: (d) => W.juice(d ? '#fff' : bright, .2) + W.waves(d ? '#fff' : bright, .1) },
    'vitamin-b12': { items: ['bolt', 'neuron', 'sparkle', 'bolt', 'neuron', 'sparkle', 'bolt'], wash: (d) => W.network(d ? '#fff' : deep, .1) }
  };
  const P = PLAN[pid]; if (!P) return null;

  const draw = (kind, d) => {
    const line = d ? '#ffffff' : deep, fill = d ? 'rgba(255,255,255,.16)' : tint, solid = d ? '#ffffff' : bright;
    switch (kind) {
      case 'hexZn': return E.hexgem(line, fill, 'Zn');
      case 'hexMg': return E.hexgem(line, fill, 'Mg');
      case 'citrusO': return E.citrus('#f7a12a');
      case 'citrusL': return E.citrus('#8cc63f', '#f4fbe4');
      case 'citrusY': return E.citrus('#f5cf2b', '#fffbe0');
      case 'leaf': return E.leaf(d ? 'rgba(255,255,255,.7)' : '#4caf50');
      case 'drop': return E.drop(d ? 'rgba(255,255,255,.75)' : (pid === 'dry-mouth' ? '#6fd0e0' : '#ffb63d'));
      case 'bubble': return E.bubble(d ? '#ffffff' : bright);
      case 'swirl': case 'male': case 'target': return E[kind](d ? '#ffffff' : deep);
      case 'rbc': return E.rbc(d ? '#ffd7d2' : '#d8323f');
      case 'rbcs': return g(-22, -10, 0, .7, E.rbc(d ? '#ffd7d2' : '#d8323f')) + g(26, 18, 30, .55, E.rbc(d ? '#ffd7d2' : '#c42a3a')) + g(-6, 34, -20, .45, E.rbc(d ? '#ffd7d2' : '#e0505a'));
      case 'sparkle': case 'star': return E[kind](solid);
      case 'zzz': case 'pulse': case 'neuron': case 'hair': return E[kind](d ? '#ffffff' : (kind === 'hair' ? bright : deep));
      case 'capsule': return E.capsule(bright);
      case 'apple': case 'carrot': case 'broccoli': case 'berries': return E[kind]();
      default: return E[kind](line, fill);
    }
  };
  const out = {};
  Object.entries(SPOTS).forEach(([sid, spots]) => {
    const dark = sid === 's4';
    let svg = P.wash(dark);
    spots.forEach(([x, y, size], i) => {
      const kind = P.items[(i + sid.length) % P.items.length];
      const op = dark ? .5 : (['rbc', 'rbcs', 'apple', 'carrot', 'broccoli', 'berries', 'citrusO', 'citrusL', 'citrusY', 'leaf', 'drop', 'capsule'].includes(kind) ? .9 : .7);
      svg += g(x, y, Math.round((R() - .5) * 50), size / 100, draw(kind, dark), op);
    });
    out[sid] = svg;
  });
  return out;
};
