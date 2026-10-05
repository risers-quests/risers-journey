/* Risers Journey home — the one name-gate login for the whole portal
   (same KID_KEY dashboard/dashboard.js uses, so signing in here also signs
   in on My Quests and End of Term 2), then a calm launchpad: a greeting
   and one tile per category. Each category's details — progress,
   metrics, forms — live only on that category's own page. */
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

  function showGate(roster) {
    var app = document.getElementById('app');
    app.innerHTML = '';
    var gate = el('div', 'name-gate');
    gate.innerHTML =
      '<h1>Risers Journey</h1>' +
      '<p>Type your name to see your quests and your term.</p>' +
      '<input type="text" id="gate-name-input" placeholder="Your name" autocomplete="off">' +
      '<button type="button" class="btn btn-primary" id="gate-go-btn">Go &rarr;</button>' +
      '<div class="gate-msg" id="gate-msg"></div>';
    app.appendChild(gate);

    var input = document.getElementById('gate-name-input');
    var msg = document.getElementById('gate-msg');
    function tryEnter() {
      var name = (input.value || '').trim().toLowerCase();
      if (!name) return;
      if (!roster[name]) {
        msg.textContent = 'Hmm, that name isn’t set up yet — check with your facilitator.';
        return;
      }
      try { localStorage.setItem(KID_KEY, name); } catch (e) {}
      // Reload so the app shell (navigation, profile) picks up the sign-in.
      location.reload();
    }
    document.getElementById('gate-go-btn').addEventListener('click', tryEnter);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryEnter(); });
    input.focus();
  }

  function renderHome(kidEntry) {
    var app = document.getElementById('app');
    var h = new Date().getHours();
    var hello = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    app.innerHTML = '';
    app.appendChild(el('header', 'hd-welcome',
      '<p class="hd-eyebrow">' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</p>' +
      '<h1>' + hello + ', ' + escapeHtml(kidEntry.displayName) + '</h1>' +
      '<p>Where would you like to go today?</p>'));
    app.appendChild(el('div', 'hd-tiles', window.LH_tiles([
      { title: 'Quests', desc: 'Your self-paced quests and how each one went.', href: 'dashboard/index.html', icon: 'quests', tone: 'green' },
      { title: 'End of Term 2', desc: 'Your self-assessment, reflection and conference notes.', href: 'end-of-term-2/index.html', icon: 'term', tone: 'slate' },
      { title: 'Core Skills', desc: 'Subject-by-subject progress.', icon: 'skills', tone: 'amber', soon: true },
      { title: 'SEL', desc: 'Social & emotional growth.', icon: 'sel', tone: 'rose', soon: true }
    ])));
  }

  function init() {
    var roster = window.DASHBOARD_ROSTER || {};
    var kid = null;
    try { kid = (localStorage.getItem(KID_KEY) || '').toLowerCase(); } catch (e) {}
    if (kid && roster[kid]) {
      renderHome(roster[kid]);
    } else {
      showGate(roster);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
