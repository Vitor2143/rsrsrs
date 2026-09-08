/* sprites.js — turns a sprite-data grid into SVG.
   '.' is always transparent. Rows are padded so ragged art still renders. */

/* Render a char grid as an SVG string. One <rect> per run of identical
   pixels on a row — keeps the DOM small enough to animate cheaply. */
function renderSprite(map, { palette = PALETTE, cell = 1 } = {}) {
  const w = Math.max(...map.map((r) => r.length));
  const h = map.length;
  let rects = '';

  for (let y = 0; y < h; y++) {
    const row = map[y].padEnd(w, '.');
    let x = 0;
    while (x < w) {
      const ch = row[x];
      if (ch === '.') { x++; continue; }
      let run = 1;
      while (x + run < w && row[x + run] === ch) run++;
      const color = palette[ch];
      if (color) {
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${run * cell}" height="${cell}" fill="${color}"/>`;
      }
      x += run;
    }
  }

  return `<svg class="sprite" viewBox="0 0 ${w * cell} ${h * cell}" `
       + `preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" `
       + `shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}
