/* Risers Journey — Staff home. The one sign-in for the staff side (name
   only, from the fixed list of three), then every kid as a short block
   of category cards — Quests, End of Term 2, SEL, Core Skills — the same
   shape as the kid/parent Home page, so detail lives one click in rather
   than all piled on the front page. Nothing on this page itself needs
   live data, so it loads instantly; the Quests card is the one place
   that does any fetching, and only once you're actually looking at that
   kid's quests. */
(function () {
  var STAFF_KEY = 'rj-staff-name';
  var app = document.getElementById('app');
  var STAFF_NAMES = window.EOT2_STAFF_RATERS.filter(function (r) { return r.id !== 'consolidated'; });

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function groupLabel(group) {
    var m = String(group).match(/(\d+)$/);
    return 'Group ' + (m ? parseInt(m[1], 10) : group);
  }

  function showGate() {
    app.innerHTML = '';
    var gate = el('div', 'name-gate');
    var options = STAFF_NAMES.map(function (r) { return '<option value="' + r.id + '">' + r.label + '</option>'; }).join('');
    gate.innerHTML =
      '<h1>Risers Journey &mdash; Staff</h1>' +
      '<p>Who are you?</p>' +
      '<select id="staff-select">' + options + '</select>' +
      '<button type="button" class="btn btn-primary" id="staff-go-btn">Go &rarr;</button>';
    app.appendChild(gate);
    document.getElementById('staff-go-btn').addEventListener('click', function () {
      var id = document.getElementById('staff-select').value;
      try { localStorage.setItem(STAFF_KEY, id); } catch (e) {}
      renderHome(STAFF_NAMES.filter(function (r) { return r.id === id; })[0]);
    });
  }

  function renderHome(staffInfo) {
    app.innerHTML = '';

    var header = el('div', 'dash-header');
    header.innerHTML =
      '<a href="#" id="logout-link" class="switch-kid-link">Log out</a>' +
      '<h1>Hi, ' + staffInfo.label + '! \u{1F44B}</h1>' +
      '<p class="dash-sub">Every kid, with their Quests, End of Term 2, SEL, and Core Skills.</p>';
    app.appendChild(header);
    document.getElementById('logout-link').addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(STAFF_KEY); } catch (err) {}
      init();
    });

    app.appendChild(el('p', 'staff-home-link', '<a href="../end-of-term-2/staff/index.html">Open the full End of Term 2 status table &rarr;</a>'));

    window.EOT2_KIDS.forEach(function (kid) {
      var block = el('div', 'staff-kid-block');
      block.appendChild(el('h2', 'staff-kid-name', kid.name + ' <span class="staff-kid-group-tag">' + groupLabel(kid.group) + '</span>'));

      var grid = el('div', 'home-grid staff-kid-cardset');

      var questsCard = el('a', 'home-card');
      questsCard.href = 'quests/index.html?kid=' + kid.slug;
      questsCard.innerHTML = '<h3>Quests</h3><p>Week-by-week status and a direct link into each one.</p>';
      grid.appendChild(questsCard);

      var eotCard = el('div', 'home-card');
      eotCard.innerHTML =
        '<h3>End of Term 2</h3>' +
        '<div class="staff-kid-actions">' +
        '<a class="eot2-btn eot2-btn-secondary" href="../end-of-term-2/self-assessment/index.html?rater=' + staffInfo.id + '&kid=' + kid.slug + '">Rate self-assessment</a>' +
        '<a class="eot2-btn eot2-btn-secondary" href="../end-of-term-2/mom/index.html?editAs=' + staffInfo.label + '&kid=' + kid.slug + '">Write MOM</a>' +
        '</div>';
      grid.appendChild(eotCard);

      var selCard = el('div', 'home-card home-card-soon');
      selCard.innerHTML = '<span class="home-badge">Coming soon</span><h3>SEL</h3><p>Social &amp; emotional growth notes, on the way.</p>';
      grid.appendChild(selCard);

      var coreCard = el('div', 'home-card home-card-soon');
      coreCard.innerHTML = '<span class="home-badge">Coming soon</span><h3>Core Skills</h3><p>Subject-by-subject progress, on the way.</p>';
      grid.appendChild(coreCard);

      block.appendChild(grid);
      app.appendChild(block);
    });
  }

  function init() {
    var id = null;
    try { id = localStorage.getItem(STAFF_KEY); } catch (e) {}
    var info = id ? STAFF_NAMES.filter(function (r) { return r.id === id; })[0] : null;
    if (info) { renderHome(info); } else { showGate(); }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
