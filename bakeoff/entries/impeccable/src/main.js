/* tengmesk.com homepage. Progressive enhancement only: the page works without this file. */
(function () {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- You-are-here fingerpost: hover and focus are CSS; tap/click toggles a sticky open state ---- */
  const post = document.querySelector('[data-tracker]');
  if (post) {
    const btn = post.querySelector('.post__now');
    const setOpen = (open) => {
      post.dataset.open = open ? 'true' : 'false';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    setOpen(false);
    btn.addEventListener('click', () => setOpen(post.dataset.open !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && post.dataset.open === 'true') { setOpen(false); btn.focus(); } });
    document.addEventListener('pointerdown', (e) => { if (post.dataset.open === 'true' && !post.contains(e.target)) setOpen(false); });
  }

  /* ---- The route draws on once as it enters the viewport ---- */
  const route = document.querySelector('[data-route]');
  if (route) {
    if (reduced.matches || !('IntersectionObserver' in window)) {
      route.style.setProperty('--drawn', '1');
    } else {
      const io = new IntersectionObserver((entries) => {
        for (const en of entries) if (en.isIntersecting) { route.style.setProperty('--drawn', '1'); io.disconnect(); }
      }, { rootMargin: '0px 0px -25% 0px' });
      io.observe(route);
    }
  }

  /* ---- Prints and boards settle in (one orchestrated entrance, skipped under reduced motion) ---- */
  const revealables = document.querySelectorAll('.section .print, .finger, .blaze, .register li');
  revealables.forEach((el) => el.setAttribute('data-reveal', ''));
  if (reduced.matches || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io2 = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io2.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealables.forEach((el) => io2.observe(el));
  }

  /* ---- Newsletter form: UI only, no backend yet. Say so honestly. ---- */
  const form = document.querySelector('[data-newsletter]');
  if (form) {
    const msg = form.querySelector('.notes-form__msg');
    const input = form.querySelector('input[type="email"]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (input.value || '').trim();
      if (!v || !input.checkValidity()) {
        msg.textContent = 'That address does not look right. Try again?';
        input.focus();
        return;
      }
      const subject = encodeURIComponent('Notes sign-up');
      const body = encodeURIComponent('Please add ' + v + ' to the notes list.');
      msg.innerHTML = 'The list is not wired up yet. <a href="mailto:tmmeskhi@gmail.com?subject=' + subject + '&body=' + body + '">Send a one-line email</a> and you are on it.';
    });
  }
})();
