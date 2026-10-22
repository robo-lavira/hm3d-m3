// HM3D-M3 project page: reveal-on-scroll, hero video toggle, nav menu, BibTeX copy.
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll. Content stays visible without JS (the .js class gates the fade).
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Hero video: pause/play button; respect reduced motion.
  var video = document.getElementById('real-world-mashup');
  var toggle = document.querySelector('.play-toggle');
  if (video && toggle) {
    function sync() {
      var paused = video.paused;
      toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    }
    toggle.addEventListener('click', function () {
      if (video.paused) { video.play(); } else { video.pause(); }
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    if (reduced) { video.removeAttribute('autoplay'); video.pause(); }
    sync();
  }

  // Explore menu: close on link click, outside click, or Escape.
  var menu = document.querySelector('.explore');
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('.menu a')) menu.removeAttribute('open');
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target)) menu.removeAttribute('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') menu.removeAttribute('open');
    });
    var links = menu.querySelectorAll('.menu a');
    if ('IntersectionObserver' in window) {
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove('is-active'); });
          if (byId[e.target.id]) byId[e.target.id].classList.add('is-active');
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      Object.keys(byId).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) spy.observe(el);
      });
    }
  }

  // Copy BibTeX.
  var btn = document.querySelector('.copy-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      var text = document.getElementById('bibtex-text').textContent;
      function done() {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
  }
})();
