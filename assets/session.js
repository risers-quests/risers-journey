/* Risers Journey sign-in, on every page (the first script in <head>).

   While someone is signed in (the rj_who cookie, set by the server):
   - the page's own "who am I" (localStorage, which the pages were built
     on) is set to the person actually signed in, so a shared device never
     shows the last person's work
   - activity keeps the sign-in alive: a ping every couple of minutes
     while they're using the page
   - 15 minutes with no activity signs them out (a warning shows a minute
     before), so the next child can't land in their work
   - window.RJ_SESSION.signOut() is the one way to log out

   With nobody signed in through the server (the sign-in switched off),
   this does nothing and the pages work as they always did. */
(function () {
  var KID_KEY = 'imm-l3-kid', STAFF_KEY = 'rj-staff-name';

  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    if (!m) return '';
    try { return decodeURIComponent(m[1]); } catch (e) { return ''; }
  }

  function clearIds() {
    try { localStorage.removeItem(KID_KEY); localStorage.removeItem(STAFF_KEY); } catch (e) {}
  }

  function signInPage(next) {
    return '/signin/' + (next ? '?next=' + encodeURIComponent(next) : '');
  }

  var signingOut = false;
  function signOut(why) {
    if (signingOut) return;
    signingOut = true;
    clearIds();
    var done = function () { location.replace('/signin/' + (why === 'idle' ? '?idle=1' : '')); };
    try {
      fetch('/api/auth/signout', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: '{}' })
        .then(done, done);
    } catch (e) { done(); }
    setTimeout(done, 1500);
  }

  /* The pass the pages send to the data store (header X-Site-Key). It's
     the signed rj_store cookie; the old shared key is only a fallback
     while the sign-in is switched off, and is removed once it's live.
     window.QUEST_SYNC_KEY and window.EOT2_SITE_KEY (read by the quest and
     Term pages) give the same, fresh each time. */
  var LEGACY_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';
  window.RJ_STORE_KEY = function () { return readCookie('rj_store') || LEGACY_KEY; };
  ['QUEST_SYNC_KEY', 'EOT2_SITE_KEY'].forEach(function (name) {
    try { Object.defineProperty(window, name, { get: window.RJ_STORE_KEY, set: function () {}, configurable: true }); } catch (e) {}
  });

  var who = readCookie('rj_who');
  var m = /^(kid|staff):([a-z]+)$/.exec(who);
  if (!m) {
    window.RJ_SESSION = null;
    return;
  }
  var role = m[1], id = m[2];

  try {
    if (role === 'kid') {
      localStorage.setItem(KID_KEY, id);
      localStorage.removeItem(STAFF_KEY);
    } else {
      localStorage.setItem(STAFF_KEY, id);
    }
  } catch (e) {}

  window.RJ_SESSION = { role: role, id: id, signOut: function () { signOut('button'); } };

  // Staff-only buttons on shared pages (a quest's "Facilitator View"):
  // hidden for Risers. The server also strips ?fac=1 for them.
  document.documentElement.classList.add(role === 'kid' ? 'rj-kid' : 'rj-staff');
  if (role === 'kid') {
    var hide = document.createElement('style');
    hide.textContent = 'html.rj-kid #facilitator-check-btn, html.rj-kid #facilitator-banner, html.rj-kid .fac-review { display: none !important; }';
    document.head.appendChild(hide);
  }

  // ---- staying signed in while active; signing out when not ----
  var IDLE = 15 * 60e3, WARN = 60e3, PING_EVERY = 2 * 60e3;
  var lastActive = Date.now(), lastPing = Date.now(), banner = null;

  function active() {
    lastActive = Date.now();
    if (banner) { banner.remove(); banner = null; }
  }
  ['pointerdown', 'keydown', 'touchstart', 'wheel', 'input'].forEach(function (ev) {
    window.addEventListener(ev, active, { passive: true, capture: true });
  });
  var lastMove = 0;
  window.addEventListener('mousemove', function () {
    var now = Date.now();
    if (now - lastMove > 5000) { lastMove = now; active(); }
  }, { passive: true });
  window.addEventListener('scroll', active, { passive: true, capture: true });

  function ping() {
    lastPing = Date.now();
    fetch('/api/auth/ping', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(function (r) {
        if (r.status === 401) { clearIds(); location.replace(signInPage(location.pathname + location.search)); }
      }, function () { /* offline: try again next time */ });
  }

  function warn() {
    if (banner || !document.body) return;
    banner = document.createElement('div');
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;' +
      'background:#1e2a33;color:#fff;font:600 15px/1.4 Inter,-apple-system,sans-serif;padding:14px 20px;' +
      'border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,.25);max-width:calc(100vw - 32px);text-align:center';
    banner.textContent = 'Still there? You’ll be signed out in a minute. Tap anywhere to stay.';
    document.body.appendChild(banner);
  }

  setInterval(function () {
    var now = Date.now();
    if (now - lastActive >= IDLE) return signOut('idle');
    if (now - lastActive >= IDLE - WARN) warn();
    if (lastActive > lastPing && now - lastPing >= PING_EVERY) ping();
  }, 5000);

  // Coming back to a tab that sat in the background past the limit.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && Date.now() - lastActive >= IDLE) signOut('idle');
  });
})();
