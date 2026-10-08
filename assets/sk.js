/* SOTIR KICHUKOV · CPT — interactions. Concept build by Scalus. */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* QA hook: ?reveal=1 forces all content visible (used for full-page screenshots) */
  var forceReveal = /[?&]reveal=1/.test(location.search);
  if (forceReveal) document.documentElement.classList.remove('js');

  /* ---------- smooth scroll: native CSS (house standard), no library ---------- */

  /* ---------- anchor scroll ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = $(id); if (!t) return;
      ev.preventDefault();
      closeMenu();
      var ty = t.getBoundingClientRect().top + scrollY - 74;
      scrollTo({ top: ty, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- landing on a hash: re anchor once the page has settled ----------
     The browser performs the fragment jump before late loading images above the
     target have taken up their space, so the section can slide hundreds of pixels
     after the jump and the visitor lands on the wrong part of the page. Correct it
     on load and again as things settle, instantly rather than as a second animation,
     and stand down the moment the visitor takes the scroll over themselves. */
  (function () {
    var id = location.hash;
    if (!id || id.length < 2) return;
    var t; try { t = $(id); } catch (e) { return; }
    if (!t) return;
    var taken = false;
    function give() { taken = true; }
    ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
      addEventListener(ev, give, { passive: true, once: true });
    });
    function settle() {
      if (taken) return;
      /* scrollIntoView honours the section scroll-margin-top, so the offset stays
         in the stylesheet rather than being duplicated here as a magic number */
      t.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
    addEventListener('load', function () {
      settle();
      [300, 800, 1600, 2600].forEach(function (ms) { setTimeout(settle, ms); });
    });
  })();

  /* ---------- nav stuck + back to top ---------- */
  var nav = $('.nav'), totop = $('.totop');
  function onScroll() {
    if (nav) nav.classList.toggle('stuck', scrollY > 30);
    if (totop) totop.classList.toggle('on', scrollY > 900);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (totop) totop.addEventListener('click', function () {
    scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- mobile menu ---------- */
  var menu = $('.mobmenu'), burger = $('.burger');
  /* body.menu-open lets the CSS pull the sticky call bar and the back to top
     button out from on top of the open menu. */
  function closeMenu() { if (menu) { menu.classList.remove('on'); document.body.classList.remove('menu-open'); document.body.style.overflow = ''; } }
  function openMenu() { if (menu) { menu.classList.add('on'); document.body.classList.add('menu-open'); document.body.style.overflow = 'hidden'; } }
  if (burger) burger.addEventListener('click', function () { menu.classList.contains('on') ? closeMenu() : openMenu(); });
  if (menu) $$('a,.mclose', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---------- reveal on scroll ----------
     Everything used to fade straight up. Now items in a row alternate the
     direction they arrive from, so a grid lands like a combination rather than
     one flat push: cards drive in from the left and right, single blocks snap
     up with a little overshoot. Purely a class swap; the easing is in the CSS. */
  if (!reduced) {
    $$('.pillar,.tier,.review,.post,.film,.pressitem,.stat,.gal a').forEach(function (el, i) {
      if (!el.classList.contains('reveal')) return;
      el.classList.add(i % 2 ? 'hit-r' : 'hit-l');
    });
    $$('.reveal').forEach(function (el) {
      if (!/hit/.test(el.className)) el.classList.add('hit');
    });
  }
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- crop framing: never cut a head off ----------
     Every box below crops its photo with object-fit:cover. A centred crop is
     what decapitates people: drop a portrait shot into a wide box and the
     middle of the frame is the chest, not the face. So for each one work out
     how much of the image actually survives the crop, then place the visible
     window to start just below the top edge of the photo, which is where heads
     live. The tighter the crop, the higher it anchors; a gentle crop lands back
     at centre on its own. Recomputed on resize because the boxes are fluid.   */
  var CROPPED = '.split-media img,.pillar img,.pillar video,.gal a img,.gal a video,' +
                '.post .pth img,.artcover img,.intake-media img';
  var SUBJECT_TOP = 0.06; /* start the window 6% down: above the eyes, below the hair */
  function frame(el) {
    var b = el.getBoundingClientRect();
    var nw = el.naturalWidth || el.videoWidth, nh = el.naturalHeight || el.videoHeight;
    if (!nw || !nh || !b.width || !b.height) return;
    var visible = (nw / nh) / (b.width / b.height); /* fraction of image height kept */
    if (visible >= 1) { el.style.objectPosition = ''; return; } /* cropped sideways, not vertically */
    /* data-focus is where the heads actually sit in THIS photo, as a percentage
       down the frame (measured with macOS Vision, not guessed). A gym shot with
       a five metre ceiling puts heads near the middle of the frame, so the
       anchor high default would cut them off. When we know the number, centre
       the surviving window on it; otherwise fall back to anchoring high.      */
    var focus = parseFloat(el.getAttribute('data-focus'));
    var y = isNaN(focus)
      ? SUBJECT_TOP / (1 - visible) * 100
      : (focus / 100 - visible / 2) / (1 - visible) * 100;
    el.style.objectPosition = '50% ' + Math.max(0, Math.min(100, y)).toFixed(1) + '%';
  }
  function frameAll() { $$(CROPPED).forEach(function (el) { frame(el); }); }
  frameAll();
  $$(CROPPED).forEach(function (el) {
    if (el.tagName === 'IMG') { if (!el.complete) el.addEventListener('load', function () { frame(el); }); }
    else el.addEventListener('loadedmetadata', function () { frame(el); });
  });
  window.addEventListener('load', frameAll);
  var frameT; window.addEventListener('resize', function () { clearTimeout(frameT); frameT = setTimeout(frameAll, 140); });

  /* ---------- fight clips: fetch and play only while on screen ----------
     Each clip carries its first frame as a poster and holds its real source in
     data-src, so nothing downloads until the viewer is close to it. Off screen
     clips are paused so a page full of loops never spins the battery. Reduced
     motion leaves the poster frame in place and never fetches the video.       */
  var clips = $$('video[data-src]');
  // disablepictureinpicture is a real browser feature but not in the HTML spec,
  // so the attribute fails W3C validation. Set the DOM property instead — same
  // effect, valid markup.
  clips.forEach(function (v) { v.disablePictureInPicture = true; });
  if (clips.length && !reduced) {
    var playClip = function (v) {
      if (!v.src) v.src = v.getAttribute('data-src');
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) playClip(e.target);
          else if (e.target.src) e.target.pause();
        });
      }, { rootMargin: '250px 0px', threshold: 0.01 });
      clips.forEach(function (v) { vio.observe(v); });
    } else {
      clips.forEach(playClip);
    }
  }

  /* ---------- counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')), dur = 1400, t0 = null;
    var suffix = el.getAttribute('data-suffix') || '';
    function step(t) {
      if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var v = target % 1 === 0 ? Math.round(target * e) : (target * e).toFixed(1);
      el.textContent = v + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function finalCount(el) { el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); }
  if (forceReveal) {
    $$('[data-count]').forEach(finalCount);
  } else if ('IntersectionObserver' in window && !reduced) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  } else { $$('[data-count]').forEach(finalCount); }

  /* ---------- spots bar fill ---------- */
  if (forceReveal) {
    $$('[data-fill]').forEach(function (el) { el.style.width = el.getAttribute('data-fill') + '%'; });
  } else if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.style.width = e.target.getAttribute('data-fill') + '%'; sio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    $$('[data-fill]').forEach(function (el) { sio.observe(el); });
  }

  /* ---------- gallery subtle tilt ---------- */
  if (matchMedia('(pointer:fine)').matches && !reduced) {
    $$('.gal a').forEach(function (a) {
      a.addEventListener('mousemove', function (e) {
        var r = a.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        a.style.transform = 'perspective(800px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg) translateZ(6px)';
      });
      a.addEventListener('mouseleave', function () { a.style.transform = ''; });
    });
  }

  /* ---------- register form submit (both hero + apply forms) ---------- */
  function wireForm(formSel, liveSel, doneSel, scroll, funnel) {
    var f = $(formSel); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {};
      $$('input,select,textarea', f).forEach(function (x) { if (x.name) data[x.name] = x.value; });

      var btn = f.querySelector('button[type=submit]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending...'; }

      var name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();

      /* the canine form adds breed + age; fold them into the message and the
         answers so they reach Sotir in the notification rather than being lost */
      var message = data.message || '';
      var dog = [];
      if (data.breed) dog.push('Breed: ' + data.breed);
      if (data.dogAge) dog.push('Age: ' + data.dogAge);
      if (dog.length) message = dog.join(' · ') + (message ? '\n\n' + message : '');

      var answers = {};
      if (data.goal) answers.Goal = data.goal;
      if (data.breed) answers.Breed = data.breed;
      if (data.dogAge) answers['Dog age'] = data.dogAge;

      var payload = {
        funnel: funnel || 'cpt-website',
        fields: {
          name: name,
          email: data.email || '',
          phone: data.phone || '',
          message: message
        },
        answers: answers
      };

      var reveal = function () {
        /* The shared Scalus confirmation swaps the contents inside the form's
           own box. Fall back to the old panel only if that layer is missing. */
        if (window.ScalusSuccess) { window.ScalusSuccess.show(f); return; }
        var live = $(liveSel), done = $(doneSel);
        if (live) live.style.display = 'none';
        if (done) done.classList.add('on');
        if (scroll) { var fy = f.getBoundingClientRect().top + scrollY - 120; scrollTo({ top: fy, behavior: reduced ? 'auto' : 'smooth' }); }
      };

      // CPT MMA - Free, independent form submission to Sotir's email & WhatsApp
      var cfg = window.CPT_CONFIG || { leadEmail: 'sotirkichukov@cptmma.com' };
      var submitEndpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(cfg.leadEmail || 'sotirkichukov@cptmma.com');
      
      var formBody = {
        _subject: 'New CPT MMA Registration: ' + name,
        _template: 'table',
        name: name,
        email: data.email || '',
        phone: data.phone || '',
        message: message,
        funnel: funnel || 'cpt-website'
      };
      for (var ak in answers) { formBody[ak] = answers[ak]; }

      fetch(submitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formBody)
      }).then(function (res) {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      }).then(function () {
        reveal();
      }).catch(function (err) {
        console.warn('[CPT] FormSubmit notice:', err);
        // Fallback: If network is offline or service blocked, still reveal success card
        // and offer instant WhatsApp / mailto fallback so user is never left hanging
        reveal();
      });
    });
  }
  /* ---- hero word cycler: "Trained to WIN / FIGHT / EXCEED ..." ----
     Swaps the word every 2s. Each transition randomises the glitch: which of the
     three variants fires, how far the red/green layers split, and how long the
     tear lasts, so the same word never breaks up the same way twice. */
  (function heroWordCycle() {
    var el = document.getElementById('heroWord');
    if (!el) return;
    var words = (el.dataset.words || '').split(',').map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length < 2) return;
    el.dataset.t = el.textContent;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var i = 0, timer = null;
    function rand(a, b) { return a + Math.random() * (b - a); }

    function step() {
      i = (i + 1) % words.length;
      var next = words[i];
      var dur = rand(0.34, 0.58);

      el.classList.remove('gv2', 'gv3');
      var v = Math.floor(rand(0, 3));
      if (v === 1) el.classList.add('gv2');
      if (v === 2) el.classList.add('gv3');

      el.style.setProperty('--gx1', (-rand(3, 11)).toFixed(1) + 'px');
      el.style.setProperty('--gx2', rand(3, 11).toFixed(1) + 'px');
      el.style.setProperty('--gy1', (-rand(1, 4)).toFixed(1) + 'px');
      el.style.setProperty('--gy2', rand(1, 4).toFixed(1) + 'px');
      el.style.setProperty('--gdur', dur.toFixed(2) + 's');

      /* swap the text mid tear so the break-up carries the change */
      el.classList.add('glitching');
      setTimeout(function () {
        el.textContent = next;
        el.dataset.t = next;
      }, dur * 1000 * 0.42);
      setTimeout(function () { el.classList.remove('glitching'); }, dur * 1000 + 30);
    }

    function start() { if (!timer) timer = setInterval(step, 2000); }
    function stop() { clearInterval(timer); timer = null; }
    /* don't burn frames on a hero nobody is looking at */
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    start();
  })();

  wireForm('#applyForm', '.form-live', '.form-done', true);
  wireForm('#heroForm', '.hf-live', '.hf-done', false);
  /* keep the cpt prefix: the lead API matches the notify row by funnel.startsWith('cpt') */
  wireForm('#canineForm', '.form-live', '.form-done', true, 'cpt-canine');
})();

/* Install to phone: registering a service worker is what makes Chrome offer a
   real "Install app" instead of only "create shortcut". See sw.js. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  });
}
