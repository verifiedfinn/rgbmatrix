<script>
(function () {
  var DESKTOP = window.matchMedia('(min-width: 768px)').matches;
  if (!DESKTOP) return; // mobile untouched — the strip embed handles it

  var f;
  var currentHero = 0;

  function heroBottom() {
    var first = document.querySelector('#SITE_PAGES section');
    if (!first) return 0;
    var r = first.getBoundingClientRect();
    return Math.round(r.bottom + window.scrollY); // page-Y where the hero ends
  }

  function injectRain(hero) {
    currentHero = hero;
    f = document.createElement('iframe');
    f.src = 'https://verifiedfinn.github.io/rgbmatrix/?edges=1&hero=' + hero;
    f.title = 'matrix rain background';
    f.style.cssText = 'position:absolute;top:0;left:0;width:100%;border:0;z-index:0;pointer-events:none;height:100vh;';
    document.body.prepend(f);
    sizeRain();
    if (window.ResizeObserver) {
      var site = document.getElementById('SITE_CONTAINER');
      new ResizeObserver(sizeRain).observe(site || document.body);
    }
    window.addEventListener('resize', function () {
      sizeRain();
      var h = heroBottom();
      if (h && Math.abs(h - currentHero) > 60) {
        currentHero = h;
        f.src = 'https://verifiedfinn.github.io/rgbmatrix/?edges=1&hero=' + h;
      }
    });
  }

  function sizeRain() {
    // measure the CONTENT (SITE_CONTAINER), never the body —
    // the iframe lives in body, so measuring body creates a
    // feedback loop that grows past the footer forever
    var site = document.getElementById('SITE_CONTAINER');
    var h = site ? Math.round(site.getBoundingClientRect().height)
                 : window.innerHeight; // fallback before Wix renders
    if (f && h > 100 && Math.abs(parseInt(f.style.height) - h) > 4) {
      f.style.height = h + 'px';
    }
  }

  function injectStyles() {
    if (document.getElementById('rain-styles')) return;
    var s = document.createElement('style');
    s.id = 'rain-styles';
    s.textContent =
      'html{background:#000 !important;overflow-x:hidden !important;}' +
      'body,#SITE_CONTAINER,#main_MF,#BACKGROUND_GROUP,#BACKGROUND_GROUP *,[id^="pageBackground"]{background:transparent !important;}' +
      'section iframe[src*="rgbmatrix"]{display:none !important;}' +
      /* container outline plates — swap the 0 for .88 if you want dark fills */
      '#SITE_PAGES [data-testid="container-bg"]{' +
        'background:rgba(0,0,0,0) !important;' +
        'border:1px solid rgba(255,255,255,.14);' +
        'border-radius:8px;' +
      '}';
    document.head.appendChild(s);
  }

  function clearBlacks() {
    var sections = [].slice.call(document.querySelectorAll('#SITE_PAGES section'));
    if (!sections.length) return false;
    sections.forEach(function (sec) {
      sec.querySelectorAll('[data-testid="colorUnderlay"]').forEach(function (u) {
        var c = getComputedStyle(u).backgroundColor.match(/[\d.]+/g) || [];
        if ((c.length > 3 ? +c[3] : 1) === 1 && +c[0] < 30 && +c[1] < 30 && +c[2] < 30) {
          u.style.setProperty('background-color', 'transparent', 'important');
        }
      });
    });
    document.querySelectorAll('[id^="bgLayers_pageBackground"] [data-testid="colorUnderlay"]').forEach(function (u) {
      u.style.setProperty('background-color', 'transparent', 'important');
    });
    return true;
  }

  function start() {
    injectStyles();
    var tries = 0;
    (function tick() {
      var ok = clearBlacks();
      if (!f) {
        var h = heroBottom();
        if (h > 100) injectRain(h);
      }
      sizeRain();
      if (ok && f && tries > 8) {
        console.log('[rain] hero stops at', currentHero + 'px, iframe height:',
          f.style.height + ', panels:',
          document.querySelectorAll('#SITE_PAGES [data-testid="container-bg"]').length);
        return;
      }
      if (++tries > 60) return;
      setTimeout(tick, 250);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
</script>
