/* Hard rock music button — click-to-play, pulsating amber ring
 * Floats bottom-right, mirrors the site's pulsating-gold-cta aesthetic.
 * Uses hard-rock-track.mp3 shipped alongside this file. */
(function () {
  if (typeof window === 'undefined') return;

  function init() {
    if (document.querySelector('.cf-music')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cf-music';
    btn.setAttribute('aria-label', 'Play hard rock soundtrack');
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = [
      '<span class="cf-music__ring" aria-hidden="true"></span>',
      '<span class="cf-music__ring cf-music__ring--2" aria-hidden="true"></span>',
      '<span class="cf-music__ico" aria-hidden="true">',
      '  <svg class="cf-music__play" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"></polygon></svg>',
      '  <svg class="cf-music__pause" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="9" y1="5" x2="9" y2="19"></line><line x1="15" y1="5" x2="15" y2="19"></line></svg>',
      '</span>',
      '<span class="cf-music__lbl">Play</span>'
    ].join('');

    var audio = new Audio();
    audio.src = 'hard-rock-track.mp3';
    audio.preload = 'none';
    audio.loop = false;
    audio.volume = 0.65;

    function setPlaying(playing) {
      btn.classList.toggle('is-playing', playing);
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      btn.setAttribute('aria-label', playing ? 'Pause hard rock soundtrack' : 'Play hard rock soundtrack');
      var lbl = btn.querySelector('.cf-music__lbl');
      if (lbl) lbl.textContent = playing ? 'Pause' : 'Play';
    }

    btn.addEventListener('click', function () {
      if (audio.paused) {
        var p = audio.play();
        if (p && p.then) p.then(function(){ setPlaying(true); }).catch(function(){ setPlaying(false); });
        else setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    });

    audio.addEventListener('ended', function () { setPlaying(false); });
    audio.addEventListener('pause', function () { setPlaying(false); });
    audio.addEventListener('play', function () { setPlaying(true); });

    // Pause on tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !audio.paused) audio.pause();
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
