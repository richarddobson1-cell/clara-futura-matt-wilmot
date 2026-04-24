/* Count-up animation for numeric stats when they enter viewport.
   Only applies when a node has data-countup + data-value. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes = document.querySelectorAll('[data-countup]');
  if (!nodes.length) return;
  if (reduce || !('IntersectionObserver' in window)) return;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function animate(node) {
    var target = parseFloat(node.getAttribute('data-value'));
    if (isNaN(target)) return;
    var prefix = node.getAttribute('data-prefix') || '';
    var suffix = node.getAttribute('data-suffix') || '';
    var decimals = parseInt(node.getAttribute('data-decimals') || '0', 10);
    var dur = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var v = target * ease(p);
      node.textContent = prefix + v.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else node.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  // Count up only once the track accordion is open AND stat in view
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  // Because items sit inside a collapsed accordion, observe after expand
  document.addEventListener('click', function (e) {
    var hd = e.target.closest && e.target.closest('.acc-hd');
    if (!hd) return;
    // after open transition settles, attach observer to any countup nodes in that body
    setTimeout(function () {
      if (hd.getAttribute('aria-expanded') !== 'true') return;
      var body = document.getElementById(hd.getAttribute('aria-controls'));
      if (!body) return;
      body.querySelectorAll('[data-countup]').forEach(function (n) {
        if (!n.dataset.counted) {
          n.dataset.counted = '1';
          io.observe(n);
        }
      });
    }, 500);
  });
})();
