/* Clara Futura — hero particles (lightweight, hero-only).
   Amber + silver ambient dots with slow drift. No connection lines.
   Capped DPR, small canvas (hero-only), ~45 particles. Pauses when offscreen. */
(function () {
  var canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var MAX_DPR = 1.5;
  var PARTICLE_COUNT = window.innerWidth < 768 ? 28 : 45;
  var particles = [];
  var w = 0, h = 0, dpr = 1;
  var rafId = null;
  var visible = true;
  var hero = canvas.parentElement;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    var rect = hero.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function color() {
    var r = Math.random();
    if (r < 0.45) return 'rgba(242,181,77,';   // amber
    if (r < 0.78) return 'rgba(245,200,112,';  // amber bright
    return 'rgba(200,210,220,';                 // silver
  }

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.12 - 0.04,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.014,
      col: color(),
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
  }

  function tick() {
    if (!visible) { rafId = null; return; }
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx + Math.sin(p.phase) * 0.15;
      p.y += p.vy;
      p.phase += p.pulseSpeed;
      if (p.x < -15) p.x = w + 15;
      if (p.x > w + 15) p.x = -15;
      if (p.y < -15) p.y = h + 15;
      if (p.y > h + 15) p.y = -15;
      var pulse = 0.5 + 0.5 * Math.sin(p.phase * 2.5);
      var rad = p.r * (0.85 + pulse * 0.35);
      // soft halo for larger dots
      if (p.r > 1.4) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad + 3, 0, Math.PI * 2);
        ctx.fillStyle = p.col + (0.10 + pulse * 0.10) + ')';
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = p.col + (0.55 + pulse * 0.35) + ')';
      ctx.fill();
    }
    rafId = requestAnimationFrame(tick);
  }

  // Pause when hero scrolls off-screen — saves CPU on long pages
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      visible = e.isIntersecting;
      if (visible && !rafId) rafId = requestAnimationFrame(tick);
    });
  }, { threshold: 0.02 });
  io.observe(hero);

  // Pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
    else if (visible && !rafId) rafId = requestAnimationFrame(tick);
  });

  window.addEventListener('resize', function () { resize(); }, { passive: true });
  init();
  rafId = requestAnimationFrame(tick);
})();
