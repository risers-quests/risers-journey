/* Risers Journey home. A Riser signs in by opening their own link (their
   name plus two words, a folder at the site root), which remembers them on
   this device; there's no name to type, so nobody can open someone else's
   work. Then a calm launchpad: a greeting and one tile per category. */
(function () {
  var KID_KEY = 'imm-l3-kid';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // No typing a name: each Riser signs in by opening their own link, so
  // nobody can open someone else's work.
  function showGate() {
    var app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(el('div', 'name-gate',
      '<h1>Risers Journey</h1>' +
      '<p>Open your own Risers Journey link to see your quests and your term.</p>' +
      '<p class="gate-msg">Don’t have it? Ask your facilitator.</p>'));
  }

  function renderHome(kidEntry, kidKey) {
    var app = document.getElementById('app');
    var h = new Date().getHours();
    var hello = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    app.innerHTML = '';
    app.appendChild(el('header', 'hd-welcome',
      '<p class="hd-eyebrow">' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</p>' +
      '<h1>' + hello + ', ' + escapeHtml(kidEntry.displayName) + '</h1>' +
      '<p>Where would you like to go today?</p>'));
    app.appendChild(el('div', 'hd-tiles', window.LH_tiles([
      { title: 'Term 3 Check-in', desc: 'Each week, tick off what your family agreed at the Term 2 Conference.', href: 'term-3/check-in/index.html', icon: 'check', tone: 'amber' }
    ].concat((window.LH_T3_GROUPS || {})[kidKey] ? [
      { title: 'Term 3 Quest', desc: 'Your group’s build: plan it, track it, and check in every week.', href: 'term-3/index.html', icon: 'skills', tone: 'amber' }
    ] : [], [
      { title: 'Term 1 Conference', desc: 'What we talked about at your Term 1 conference.', href: 'term-1-conference/index.html', icon: 'conf', tone: 'violet' },
      { title: 'Term 2 Conference', desc: 'Your self-assessment, reflection and conference notes.', href: 'end-of-term-2/index.html', icon: 'term', tone: 'slate' },
      { title: 'Term 2 Quests', desc: 'Your self-paced quests and how each one went.', href: 'dashboard/index.html', icon: 'quests', tone: 'green' }
    ]))));
  }

  function init() {
    var roster = window.DASHBOARD_ROSTER || {};
    var kid = null;
    try { kid = (localStorage.getItem(KID_KEY) || '').toLowerCase(); } catch (e) {}
    if (kid && roster[kid]) {
      renderHome(roster[kid], kid);
    } else {
      showGate();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
