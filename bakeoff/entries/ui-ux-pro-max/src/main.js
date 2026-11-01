/* tengmesk.com homepage — progressive enhancement only.
   Everything on the page reads and works without this file. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- City tracker: mouse, keyboard and touch ---------- */
  document.querySelectorAll('[data-tracker]').forEach((root) => {
    const btn = root.querySelector('.tracker__btn');
    const pop = root.querySelector('.tracker__pop');
    if (!btn || !pop) return;
    let hoverTimer = null;
    const set = (open) => {
      root.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    const isOpen = () => root.classList.contains('is-open');

    // tap / click / Enter / Space toggle.
    // On touch, the tap focuses the button first (focusin opens it) and then fires click;
    // remember the state before the pointer went down so the tap toggles from the real prior state.
    let stateBeforePointer = null;
    btn.addEventListener('pointerdown', () => { stateBeforePointer = isOpen(); });
    btn.addEventListener('click', () => {
      const prior = stateBeforePointer === null ? isOpen() : stateBeforePointer;
      stateBeforePointer = null;
      set(!prior);
    });
    // keyboard focus reveals; leaving the component hides
    root.addEventListener('focusin', () => set(true));
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) set(false); });
    root.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { set(false); btn.focus(); } });
    // hover (pointer devices only) with a small leave delay so the popover is reachable
    if (canHover.matches) {
      root.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); set(true); });
      root.addEventListener('mouseleave', () => { hoverTimer = setTimeout(() => { if (!root.contains(document.activeElement)) set(false); }, 180); });
    }
    // outside tap closes
    document.addEventListener('pointerdown', (e) => { if (isOpen() && !root.contains(e.target)) set(false); });
  });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    const setMenu = (open) => {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); } });
    window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Header state + scroll progress ---------- */
  const header = document.querySelector('[data-header]');
  const bar = document.querySelector('[data-progress]');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      if (header) header.classList.toggle('is-scrolled', y > 24);
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal (final state immediately under reduced motion) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const showAll = () => reveals.forEach((el) => el.classList.add('is-in'));
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
    reduceMotion.addEventListener('change', (e) => { if (e.matches) showAll(); });
  }

  /* ---------- Logo marquee: pause control, static under reduced motion ---------- */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    const list = marquee.querySelector('[data-marquee-list]');
    const pause = marquee.querySelector('[data-marquee-pause]');
    const label = marquee.querySelector('[data-marquee-label]');
    const enable = () => {
      if (marquee.classList.contains('is-animated')) return;
      const clone = list.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach((img) => { img.alt = ''; });
      list.parentNode.appendChild(clone);
      marquee.classList.add('is-animated');
    };
    if (!reduceMotion.matches) enable();
    reduceMotion.addEventListener('change', (e) => { if (e.matches) marquee.classList.add('is-paused'); });
    if (pause) {
      pause.addEventListener('click', () => {
        const paused = marquee.classList.toggle('is-paused');
        pause.setAttribute('aria-pressed', paused ? 'true' : 'false');
        if (label) label.textContent = paused ? 'Play' : 'Pause';
      });
    }
  }

  /* ---------- Newsletter (no backend yet): hand off to the mail client ---------- */
  const form = document.querySelector('[data-newsletter]');
  if (form) {
    const status = form.querySelector('[data-newsletter-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.checkValidity()) { input && input.reportValidity(); return; }
      const email = input.value.trim();
      const href = `mailto:tmmeskhi@gmail.com?subject=${encodeURIComponent('Newsletter: keep me posted')}&body=${encodeURIComponent(`Please add ${email} to the newsletter list.`)}`;
      window.location.href = href;
      if (status) status.textContent = 'Opening your email app. If nothing happens, email tmmeskhi@gmail.com with “Newsletter” in the subject.';
    });
  }

  /* ---------- Smooth in-page scrolling that respects reduced motion ---------- */
  if (!reduceMotion.matches) document.documentElement.style.scrollBehavior = 'smooth';
})();
