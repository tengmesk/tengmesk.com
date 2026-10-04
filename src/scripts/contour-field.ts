/**
 * Contour canvas island (SITE-PLAN §6). 30 fps cap, DPR ≤ 1.5, pauses when
 * the hero is off-screen or the tab is hidden, pointer hill on fine pointers
 * only, and gives up (keeping the static SVG) if the first frames are slow.
 */
import {
  AMBER,
  INK,
  LEVELS,
  WIDTH,
  coverScale,
  eachSegment,
  isMajor,
  levelValue,
  sampleField,
  type Field,
} from '../lib/contours-core';

const FRAME_MS = 1000 / 30;
const BUDGET_MS = 12;

export function mount(hero: HTMLElement, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0, H = 0, sc = 1, cs = 9;
  let field: Field | undefined;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mouse = { x: -1e4, y: -1e4, s: 0, in: false };
  const t0 = performance.now();
  let last = 0, visible = true, raf = 0, frames = 0, cost = 0, dead = false;

  function resize(): void {
    const r = hero.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    sc = coverScale(W, H);
    cs = W < 600 ? 11 : 9;
    field = undefined;
  }

  function draw(t: number): void {
    const c = ctx!;
    field = sampleField(W, H, cs, t, mouse.x, mouse.y, mouse.s, sc, field?.f);
    c.clearRect(0, 0, W, H);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    for (let k = 1; k <= LEVELS; k++) {
      c.strokeStyle = isMajor(k) ? AMBER : INK(k);
      c.lineWidth = WIDTH(k);
      c.beginPath();
      eachSegment(field, levelValue(k), (x1, y1, x2, y2) => {
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
      });
      c.stroke();
    }
  }

  function frame(now: number): void {
    raf = 0;
    if (dead || !visible) return;
    if (now - last >= FRAME_MS) {
      last = now;
      mouse.s += ((mouse.in ? 1 : 0) - mouse.s) * 0.2;
      const a = performance.now();
      draw((now - t0) / 1000);
      if (frames < 3) {
        cost += performance.now() - a;
        if (++frames === 3) {
          hero.dataset.contourMs = (cost / 3).toFixed(1);
          if (cost / 3 > BUDGET_MS) {
            // Too slow for this device: keep the static SVG.
            dead = true;
            hero.classList.remove('is-live');
            return;
          }
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  function run(): void {
    if (!raf && visible && !dead) raf = requestAnimationFrame(frame);
  }

  resize();
  draw(0); // first frame equals the static SVG: no flash on swap
  hero.classList.add('is-live');

  new ResizeObserver(() => {
    resize();
    draw((performance.now() - t0) / 1000);
  }).observe(hero);

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting) && !document.hidden;
    run();
  }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden && hero.getBoundingClientRect().bottom > 0;
    run();
  });

  if (fine) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.in = true;
    });
    hero.addEventListener('pointerleave', () => {
      mouse.in = false;
    });
  }
  run();
}
