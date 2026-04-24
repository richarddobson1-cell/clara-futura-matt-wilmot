/* Career timeline — progressive scroll-fill + mobile tap-to-expand
 * - Fills the amber line from top of timeline down to the viewport's trigger line
 * - Lights up each dot as the progress line reaches it
 * - Tapping a .tl-desc toggles is-open (for touch devices where :hover doesn't work)
 * - Respects prefers-reduced-motion: sets full progress (no animation) when section is in view
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var timelines = document.querySelectorAll('.tl');
    if (!timelines.length) return;

    timelines.forEach(setupTimeline);

    // Mobile tap-to-expand on description
    document.addEventListener('click', function (e) {
      var desc = e.target.closest('.tl-desc');
      if (!desc) return;
      // Don't interfere with text selection
      var sel = window.getSelection && window.getSelection().toString();
      if (sel && sel.length > 0) return;
      desc.classList.toggle('is-open');
    }, { passive: true });
  }

  function setupTimeline(tl) {
    var items = tl.querySelectorAll('.tl-item');
    var ticking = false;

    function update() {
      ticking = false;
      var rect = tl.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      // Trigger line at ~58% down the viewport (feels natural while reading)
      var triggerY = vh * 0.58;
      // Distance from top of .tl to the trigger line, clamped 0..height
      var raw = triggerY - rect.top;
      var max = rect.height;
      var progress = Math.max(0, Math.min(max, raw));

      if (reduced) {
        // When reduced-motion is on, snap: fully lit if section is in view, else 0
        var inView = rect.bottom > 0 && rect.top < vh;
        progress = inView ? max : 0;
      }

      tl.style.setProperty('--tl-progress', progress + 'px');

      // Light up dots whose center has been passed by the progress line
      items.forEach(function (item) {
        // Each dot is positioned at top:22px within the item
        var itemTop = item.offsetTop + 22;
        if (progress >= itemTop) {
          if (!item.classList.contains('is-lit')) item.classList.add('is-lit');
        } else {
          if (item.classList.contains('is-lit')) item.classList.remove('is-lit');
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Also update when the enclosing accordion opens (height changes)
    var acc = tl.closest('.acc');
    if (acc) {
      var btn = acc.querySelector('.acc-hd');
      if (btn) btn.addEventListener('click', function () {
        // wait for accordion expand animation, then update
        setTimeout(update, 60);
        setTimeout(update, 360);
        setTimeout(update, 720);
      });
    }

    // Initial paint
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
