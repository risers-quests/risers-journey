/* Risers Journey home — the one name-gate login for the whole portal,
   same KID_KEY/localStorage dashboard/dashboard.js already uses, so
   signing in here also signs in on Quests and End of Term 2. */
(function () {
  var KID_KEY = 'imm-l3-kid';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
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
      renderHome(name, roster[name]);
    }
    document.getElementById('gate-go-btn').addEventListener('click', tryEnter);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryEnter(); });
    input.focus();
  }

  function renderHome(name, kidEntry) {
    var app = document.getElementById('app');
    app.innerHTML = '';

    var head = el('div', 'home-head');
    head.innerHTML =
      '<a href="#" id="logout-link" class="switch-kid-link">Log out</a>' +
      '<h1>Hi ' + kidEntry.displayName + ',</h1><p>Here’s where things stand right now.</p>';
    app.appendChild(head);
    document.getElementById('logout-link').addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(KID_KEY); } catch (err) {}
      init();
    });

    var grid = el('div', 'home-grid');

    var questsCard = el('a', 'home-card');
    questsCard.href = 'dashboard/index.html';
    questsCard.innerHTML = '<h3>Quests</h3><p>Your week-by-week quests, with what you’ve finished so far.</p>';
    grid.appendChild(questsCard);

    var eotCard = el('a', 'home-card');
    eotCard.href = 'end-of-term-2/index.html';
    eotCard.innerHTML = '<h3>End of Term 2</h3><p>Your self-assessment, your reflection, and your conference notes.</p>';
    grid.appendChild(eotCard);

    var coreSkillsCard = el('div', 'home-card home-card-soon');
    coreSkillsCard.innerHTML = '<span class="home-badge">Coming soon</span><h3>Core Skills</h3><p>Subject-by-subject progress, on the way.</p>';
    grid.appendChild(coreSkillsCard);

    var selCard = el('div', 'home-card home-card-soon');
    selCard.innerHTML = '<span class="home-badge">Coming soon</span><h3>SEL</h3><p>Social &amp; emotional growth notes, on the way.</p>';
    grid.appendChild(selCard);

    app.appendChild(grid);
  }

  function init() {
    var roster = window.DASHBOARD_ROSTER || {};
    var kid = null;
    try { kid = (localStorage.getItem(KID_KEY) || '').toLowerCase(); } catch (e) {}
    if (kid && roster[kid]) {
      renderHome(kid, roster[kid]);
    } else {
      showGate(roster);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
