/* scene.js — procedural pixel background: clouds, skyline, shrubs, drifting bits.
   Everything is generated once on load so no two visits look identical. */

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

/* A cloud is a stack of horizontal bars with stepped widths — reads as
   "pixel cloud" rather than a blurred blob. */
function cloudSvg(w, h, fill, shade) {
  const rows = 5;
  const rowH = h / rows;
  const widths = [0.42, 0.68, 0.9, 1, 0.86];
  let out = '';
  widths.forEach((frac, i) => {
    const bw = w * frac;
    out += `<rect x="${(w - bw) / 2}" y="${i * rowH}" width="${bw}" height="${rowH + 0.5}" fill="${i > 3 ? shade : fill}"/>`;
  });
  out += `<rect x="${w * 0.06}" y="${rowH * 2}" width="${w * 0.2}" height="${rowH * 2}" fill="${fill}"/>`;
  out += `<rect x="${w * 0.74}" y="${rowH * 2}" width="${w * 0.2}" height="${rowH * 2}" fill="${fill}"/>`;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${out}</svg>`;
}

function buildClouds(layer, count, opts) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'cloud';
    const w = rand(opts.minW, opts.maxW);
    el.style.width = w + 'px';
    el.style.top = rand(opts.top[0], opts.top[1]) + '%';
    el.style.left = rand(-10, 100) + '%';
    el.style.opacity = opts.opacity;
    el.style.setProperty('--drift', rand(opts.speed[0], opts.speed[1]) + 's');
    el.style.animationDelay = -rand(0, 90) + 's';
    el.innerHTML = cloudSvg(40, 22, opts.fill, opts.shade);
    layer.appendChild(el);
  }
}

/* Skyline: blocky towers with lit windows, drawn as one SVG so it scales
   with the viewport without reflowing a hundred divs. */
function buildSkyline(el, { fill, window: winColor, seed }) {
  const W = 320, H = 90;
  let out = '';
  let x = -6;
  let i = seed;
  while (x < W) {
    const bw = 14 + ((i * 37) % 5) * 6;
    const bh = 26 + ((i * 53) % 7) * 8;
    const y = H - bh;
    out += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${fill}"/>`;
    if (bw > 22) out += `<rect x="${x + bw / 2 - 3}" y="${y - 8}" width="6" height="8" fill="${fill}"/>`;
    for (let wy = y + 6; wy < H - 8; wy += 10) {
      for (let wx = x + 4; wx < x + bw - 6; wx += 9) {
        if ((wx * wy + i) % 3 === 0) out += `<rect x="${wx}" y="${wy}" width="4" height="5" fill="${winColor}"/>`;
      }
    }
    x += bw + 3 + ((i * 17) % 3) * 2;
    i++;
  }
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${out}</svg>`;
}

/* Foreground shrub line with the occasional flower poking out. */
function buildShrubs(el) {
  const W = 320, H = 26;
  let out = `<rect x="0" y="14" width="${W}" height="${H - 14}" fill="var(--shrub-dark)"/>`;
  for (let x = -4; x < W; x += 7) {
    const bh = 6 + ((x * 13) % 4) * 3;
    out += `<rect x="${x}" y="${H - bh - 4}" width="7" height="${bh + 4}" fill="var(--shrub)"/>`;
    if ((x * 7) % 5 === 0) {
      const fy = H - bh - 10;
      out += `<rect x="${x + 2}" y="${fy}" width="3" height="3" fill="var(--bloom)"/>`;
      out += `<rect x="${x + 2}" y="${fy + 3}" width="1" height="4" fill="var(--shrub-dark)"/>`;
    }
  }
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${out}</svg>`;
}

/* Small drifting glyphs: hearts, 4-point sparkles, butterflies. */
const GLYPHS = {
  heart: '<svg viewBox="0 0 7 6" shape-rendering="crispEdges"><path d="M1 0h2v1H1zM4 0h2v1H4zM0 1h7v2H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z" fill="currentColor"/></svg>',
  spark: '<svg viewBox="0 0 7 7" shape-rendering="crispEdges"><path d="M3 0h1v2H3zM3 5h1v2H3zM0 3h2v1H0zM5 3h2v1H5zM2 2h3v3H2z" fill="currentColor"/></svg>',
  fly:   '<svg viewBox="0 0 7 6" shape-rendering="crispEdges"><path d="M0 0h2v2H0zM5 0h2v2H5zM1 2h5v1H1zM0 3h2v2H0zM5 3h2v2H5zM3 1h1v4H3z" fill="currentColor"/></svg>',
};

function buildDrifters(layer, count) {
  const kinds = ['heart', 'spark', 'spark', 'fly'];
  for (let i = 0; i < count; i++) {
    const kind = pick(kinds);
    const el = document.createElement('span');
    el.className = 'drifter drifter--' + kind;
    el.style.left = rand(0, 100) + '%';
    el.style.setProperty('--size', rand(10, 26) + 'px');
    el.style.setProperty('--rise', rand(16, 34) + 's');
    el.style.setProperty('--sway', rand(-40, 40) + 'px');
    el.style.animationDelay = -rand(0, 34) + 's';
    el.style.opacity = rand(0.45, 0.95);
    el.innerHTML = GLYPHS[kind];
    layer.appendChild(el);
  }
}

function buildScene() {
  buildClouds(document.getElementById('clouds-far'), 7, {
    minW: 90, maxW: 190, top: [6, 34], opacity: 0.5,
    speed: [110, 190], fill: '#ffd7ec', shade: '#ffbcdf',
  });
  buildClouds(document.getElementById('clouds-near'), 6, {
    minW: 150, maxW: 300, top: [30, 58], opacity: 0.95,
    speed: [70, 120], fill: '#ffeaf6', shade: '#ffc4e2',
  });
  buildSkyline(document.getElementById('skyline-far'), { fill: '#ff9ecd', window: '#ffd9ec', seed: 3 });
  buildSkyline(document.getElementById('skyline-near'), { fill: '#ff7ab8', window: '#ffc0e0', seed: 11 });
  buildShrubs(document.getElementById('shrubs'));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    buildDrifters(document.getElementById('drifters'), 26);
  }
}
