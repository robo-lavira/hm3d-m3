// HM3D-M3 project page: reveal-on-scroll, hero video toggle, nav menu, BibTeX copy.
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll. The inline <head> script adds .js (which gates the hidden
  // start state) and removes it again if this file never sets __m3Reveal.
  window.__m3Reveal = true;
  var items = [].slice.call(document.querySelectorAll('.rv'));
  function show(el) { el.classList.add('in'); }
  if (!('IntersectionObserver' in window) || reduced) {
    items.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      // Elements that enter together are staggered in document order, 90 ms apart.
      var batch = entries.filter(function (e) { return e.isIntersecting; })
        .map(function (e) { return e.target; })
        .sort(function (a, b) {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
      batch.forEach(function (el, i) {
        el.style.setProperty('--d', Math.min(i, 5) * 90 + 'ms');
        show(el);
        io.unobserve(el);
        el.addEventListener('transitionend', function done(ev) {
          if (ev.propertyName !== 'transform') return;
          el.style.removeProperty('--d');
          el.removeEventListener('transitionend', done);
        });
      });
    }, { threshold: 0.15, rootMargin: '0px 0px 5% 0px' });
    items.forEach(function (el) { io.observe(el); });
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
