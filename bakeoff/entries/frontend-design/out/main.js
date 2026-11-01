// tengmesk.com homepage: city tracker, newsletter stub, load sequence flag.
(function () {
  'use strict';

  // ---- City tracker: hover (CSS), focus (CSS), tap/click (here), Escape closes ----
  var tracker = document.querySelector('[data-tracker]');
  if (tracker) {
    var btn = tracker.querySelector('.where-now');
    var setOpen = function (open) {
      tracker.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () {
      setOpen(!tracker.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tracker.classList.contains('is-open')) { setOpen(false); btn.focus(); }
    });
    document.addEventListener('pointerdown', function (e) {
      if (!tracker.contains(e.target)) setOpen(false);
    });
    // Touch devices get no hover; make sure tapping anywhere else closes it (handled above),
    // and that a tap on the button toggles rather than flickering through hover state.
    tracker.addEventListener('focusout', function (e) {
      if (!tracker.contains(e.relatedTarget)) setOpen(false);
    });
  }

  // ---- Newsletter: UI only, no backend yet (see NOTES.md) ----
  var form = document.querySelector('[data-newsletter]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type=email]');
      var msg = form.querySelector('.newsletter-msg');
      if (!input.value || !input.checkValidity()) {
        msg.textContent = 'Enter an email address like you@company.com.';
        input.focus();
        return;
      }
      msg.textContent = 'The list is not wired up yet. Email tmmeskhi@gmail.com and Tengo will add you by hand.';
    });
  }

  // ---- One load sequence (CSS-driven); mark the page ready once fonts are in ----
  var ready = function () { document.documentElement.classList.add('is-ready'); };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ready, ready);
    setTimeout(ready, 1200); // never wait on a slow font
  } else {
    ready();
  }
})();
