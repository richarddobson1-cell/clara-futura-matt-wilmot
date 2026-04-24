/* Accordion: max-height animated open/close with chevron-free "+" rotate */
(function () {
  var heads = document.querySelectorAll('.acc-hd');
  if (!heads.length) return;

  function setOpen(head, open) {
    var body = document.getElementById(head.getAttribute('aria-controls'));
    if (!body) return;
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      // measure inner content
      var inner = body.querySelector('.acc-inner');
      var h = inner ? inner.getBoundingClientRect().height + 16 : body.scrollHeight;
      body.style.maxHeight = h + 'px';
      // after transition, unlock so dynamic content (images, fonts) doesn't clip
      setTimeout(function () {
        if (head.getAttribute('aria-expanded') === 'true') {
          body.style.maxHeight = 'none';
        }
      }, 500);
    } else {
      // lock current height, then transition to 0
      var current = body.scrollHeight;
      body.style.maxHeight = current + 'px';
      // force reflow
      void body.offsetHeight;
      body.style.maxHeight = '0px';
    }
  }

  heads.forEach(function (head) {
    head.addEventListener('click', function () {
      var expanded = head.getAttribute('aria-expanded') === 'true';
      setOpen(head, !expanded);
    });
    head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        head.click();
      }
    });
  });

  // Re-measure on resize when open
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      document.querySelectorAll('.acc-hd[aria-expanded="true"]').forEach(function (head) {
        var body = document.getElementById(head.getAttribute('aria-controls'));
        if (body) body.style.maxHeight = 'none';
      });
    }, 150);
  });
})();
