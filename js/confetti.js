/* confetti.js — falling pixel hearts and squares on a full-bleed canvas.
   Self-contained: Confetti.mount(canvas) once, then Confetti.burst(n). */

const Confetti = (() => {
  const COLORS = ['#ff3d84', '#ff7cb0', '#ffffff', '#ffd166', '#ff9ec9'];
  /* A 7x6 heart as [startX, width] per row — same silhouette as the
     drifters in the background, so the two never look like different art. */
  const HEART_ROWS = [null, [0, 7], [1, 5], [2, 3], [3, 1]];

  let canvas = null, ctx = null, pieces = [], raf = null;
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    const u = p.size / 7;
    const half = p.size / 2;

    if (p.heart) {
      // top row is the two lobes, the rest are single bars
      ctx.fillRect(1 * u - half, -half, 2 * u, u);
      ctx.fillRect(4 * u - half, -half, 2 * u, u);
      HEART_ROWS.forEach((row, y) => {
        if (row) ctx.fillRect(row[0] * u - half, y * u - half, row[1] * u, u);
      });
    } else {
      ctx.fillRect(-half, -half, p.size, p.size);
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces = pieces.filter((p) => p.y < window.innerHeight + 40);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.012;
      p.rot += p.spin;
      draw(p);
    });
    raf = pieces.length ? requestAnimationFrame(tick) : null;
  }

  return {
    mount(el) {
      canvas = el;
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
    },

    burst(count) {
      if (quiet || !ctx) return;
      for (let i = 0; i < count; i++) {
        pieces.push({
          x: Math.random() * window.innerWidth,
          y: -20 - Math.random() * window.innerHeight * 0.5,
          vx: (Math.random() - 0.5) * 1.6,
          vy: 1.4 + Math.random() * 2.6,
          size: 4 + ((Math.random() * 4) | 0) * 2,
          spin: (Math.random() - 0.5) * 0.12,
          rot: Math.random() * Math.PI,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          heart: Math.random() > 0.45,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    },
  };
})();
