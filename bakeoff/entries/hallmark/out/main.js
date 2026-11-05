// tengmesk.com: the city tracker (hover, focus, tap) and the retracting banner.
(function () {
  document.documentElement.classList.add('js');

  // City tracker: hover and focus work in CSS alone; a tap or click toggles it for touch.
  var tracker = document.querySelector('[data-tracker]');
  if (tracker) {
    var btn = tracker.querySelector('button');
    var set = function (open) {
      tracker.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { set(!tracker.classList.contains('is-open')); });
    document.addEventListener('click', function (e) { if (!tracker.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  // The banner above the bar tucks away on the way down and returns on the way up.
  var header = document.querySelector('.site-head');
  if (header) {
    var last = window.scrollY, ticking = false;
    var onScroll = function () {
      var y = window.scrollY;
      var tuck = y > 160 && y > last;
      header.classList.toggle('is-tucked', tuck);
      if (tuck && tracker) { tracker.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
      last = y;
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }
})();
