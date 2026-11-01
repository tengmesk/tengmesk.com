(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- entrance system: release transforms after each animation; never leave a blank page ---- */
  const appearEls = $$('.appear');
  appearEls.forEach((el) => el.addEventListener('animationend', (e) => { if (e.target === el) el.classList.add('is-in'); }));
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const running = appearEls.some((el) => (el.getAnimations ? el.getAnimations() : []).some((a) => a.playState === 'running' || a.playState === 'finished'));
    if (!running) appearEls.forEach((el) => el.classList.add('is-in'));
  }));
  setTimeout(() => appearEls.forEach((el) => el.classList.add('is-in')), 2600);

  /* ---- nav scrolled state ---- */
  const nav = $('#nav');
  let ticking = false;
  const onScroll = () => { ticking = false; nav.classList.toggle('is-scrolled', scrollY > 60); };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  (function mobileMenu(burger) {
    if (!burger) return;
    const menu = document.getElementById(burger.getAttribute('aria-controls'));
    const desktop = matchMedia('(min-width: 1000px)');
    const isOpen = () => document.body.classList.contains('menu-open');
    const set = (open) => {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.inert = !open;
      if (open) menu.querySelector('a')?.focus({ preventScroll: true });
    };
    menu.inert = true;
    burger.addEventListener('click', () => set(!isOpen()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a') || e.target === menu) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { set(false); burger.focus(); } });
    desktop.addEventListener('change', (e) => { if (e.matches) set(false); });
  })($('.burger'));

  /* ---- whereabouts tracker: hover, focus, keyboard and touch ---- */
  (function tracker(root) {
    if (!root) return;
    const btn = $('.wb__btn', root);
    let pinned = false;
    const set = (open) => { root.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
    if (fine.matches) {
      root.addEventListener('pointerenter', () => set(true));
      root.addEventListener('pointerleave', () => { if (!pinned) set(false); });
    }
    btn.addEventListener('click', () => { pinned = !root.classList.contains('is-open'); set(pinned); });
    root.addEventListener('focusin', () => set(true));
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget) && !pinned) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('is-open')) { pinned = false; set(false); btn.focus(); } });
    document.addEventListener('pointerdown', (e) => { if (!root.contains(e.target) && root.classList.contains('is-open')) { pinned = false; set(false); } });
  })($('#whereabouts'));

  /* ---- viewport reveals ---- */
  $$('[data-stagger]').forEach((group) => {
    const step = +group.dataset.stagger, base = +(group.dataset.staggerBase || 0);
    $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--d', `${base + i * step}ms`));
  });
  const revealIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach((el) => revealIO.observe(el));

  /* ---- count-up stats (final values live in the HTML) ---- */
  function countUp(el, { duration = 1600, delay = 0 } = {}) {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
    const nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const fmt = (v) => (el.dataset.prefix || '') + nf.format(v) + (el.dataset.suffix || '');
    if (reduce.matches) { el.textContent = fmt(to); return; }
    el.textContent = fmt(0);
    setTimeout(() => {
      const t0 = performance.now();
      requestAnimationFrame(function f(now) {
        const t = Math.min(1, (now - t0) / duration);
        el.textContent = fmt(to * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(f);
      });
    }, delay);
  }
  const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    $$('[data-count]', e.target).forEach((el, i) => countUp(el, { duration: 1500 + i * 80, delay: 350 + i * 90 }));
  }), { threshold: 0.25 });
  $$('[data-count-group]').forEach((el) => countIO.observe(el));

  /* ---- logo marquee: constant px/s, seamless double group ---- */
  $$('.marquee').forEach((m) => {
    const track = $('.marquee__track', m);
    const group = $('.marquee__group', m);
    const build = () => {
      $$('.marquee__group[data-clone]', track).forEach((g) => g.remove());
      const clone = group.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); clone.dataset.clone = '1';
      track.append(clone);
      track.style.setProperty('--dur', `${(group.scrollWidth / +(m.dataset.speed || 50)).toFixed(2)}s`);
    };
    const imgs = $$('img', group);
    Promise.all(imgs.map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))).then(build);
    if (document.fonts) document.fonts.ready.then(build);
  });

  /* ---- pointer parallax on the hero portrait / ghost word (desktop, fine pointer) ---- */
  (function parallax() {
    if (reduce.matches || !fine.matches) return;
    const portrait = $('.hero__portrait'), ghost = $('.hero__ghost'), hero = $('.hero');
    if (!portrait || !ghost) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.1; y += (ty - y) * 0.1;
      portrait.style.setProperty('--px', `${(x * 8).toFixed(2)}px`); portrait.style.setProperty('--py', `${(y * 6).toFixed(2)}px`);
      ghost.style.setProperty('--px', `${(x * -14).toFixed(2)}px`); ghost.style.setProperty('--py', `${(y * -6).toFixed(2)}px`);
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    hero.addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
  })();

  /* ---- single-element parallax on About photos ---- */
  (function photoParallax() {
    const items = $$('[data-parallax]');
    if (!items.length || reduce.matches || innerWidth < 900) return;
    let t = false;
    const update = () => {
      t = false;
      items.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const delta = r.top + r.height / 2 - innerHeight / 2;
        const y = Math.max(-40, Math.min(40, -delta * parseFloat(el.dataset.parallax)));
        el.style.transform = `translate3d(0,${y.toFixed(1)}px,0) scale(1.08)`;
      });
    };
    addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  })();

  /* ---- newsletter: UI only, no backend yet (honest message) ---- */
  (function newsletter(form) {
    if (!form) return;
    const msg = $('.newsletter__msg', form), input = $('input', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.value || !input.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      msg.textContent = 'The list is not live yet. Email tmmeskhi@gmail.com with "newsletter" and you will be on the first send.';
    });
  })($('#newsletter'));
})();
