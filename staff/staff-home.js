/* Risers Journey — Staff home. The one sign-in for the staff side (name
   only, from the fixed list of three), then every kid in one elegant
   grid: group, End of Term 2 status at a glance, and one-click shortcuts
   into this staff member's own Self-Assessment and MOM entries — no
   re-picking the kid, no re-typing who you are. */
(function () {
  var STAFF_KEY = 'rj-staff-name';
  var app = document.getElementById('app');
  var STAFF_NAMES = window.EOT2_STAFF_RATERS.filter(function (r) { return r.id !== 'consolidated'; });

  var RECORDS = [
    { label: 'Self', short: 'S', week: 'term2-self-assessment-self' },
    { label: 'Jeran', short: 'J', week: 'term2-self-assessment-jeran' },
    { label: 'Nishitha', short: 'N', week: 'term2-self-assessment-nishitha' },
    { label: 'Blessy', short: 'B', week: 'term2-self-assessment-blessy' },
    { label: 'Final', short: 'F', week: 'term2-self-assessment-consolidated' },
    { label: 'Reflection', short: 'R', week: 'term2-term-reflection' },
    { label: 'MOM', short: 'M', week: 'term2-mom' }
  ];

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

  function hasAnyAnswer(state) {
    if (!state) return false;
    return Object.keys(state).some(function (k) {
      var v = state[k];
      if (v && typeof v === 'object') return Object.keys(v).length > 0;
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
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
      '<p class="dash-sub">Every kid, and where their End of Term 2 stands.</p>';
    app.appendChild(header);
    document.getElementById('logout-link').addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(STAFF_KEY); } catch (err) {}
      init();
    });

    app.appendChild(el('p', 'staff-home-link', '<a href="../end-of-term-2/staff/index.html">Open the full status table &rarr;</a>'));

    var grid = el('div', 'staff-kid-grid');
    app.appendChild(grid);

    window.EOT2_KIDS.forEach(function (kid) {
      var card = el('div', 'staff-kid-card');
      card.innerHTML =
        '<h3>' + kid.name + '</h3>' +
        '<p class="staff-kid-group">' + groupLabel(kid.group) + '</p>' +
        '<div class="staff-kid-badges" id="badges-' + kid.slug + '"><span class="eot2-roster-badge eot2-roster-empty">&hellip;</span></div>' +
        '<div class="staff-kid-actions">' +
        '<a class="eot2-btn eot2-btn-secondary" href="../end-of-term-2/self-assessment/index.html?rater=' + staffInfo.id + '&kid=' + kid.slug + '">Rate self-assessment</a>' +
        '<a class="eot2-btn eot2-btn-secondary" href="../end-of-term-2/mom/index.html?editAs=' + staffInfo.label + '&kid=' + kid.slug + '">Write MOM</a>' +
        '</div>';
      grid.appendChild(card);

      var badgeWrap = card.querySelector('.staff-kid-badges');
      Promise.all(RECORDS.map(function (rec) {
        return window.eot2Fetch(kid.group, kid.slug, rec.week).then(function (data) {
          return { rec: rec, done: hasAnyAnswer(data && data.state) };
        });
      })).then(function (results) {
        badgeWrap.innerHTML = results.map(function (r) {
          return '<span class="eot2-roster-badge ' + (r.done ? 'eot2-roster-done' : 'eot2-roster-empty') + '" title="' + r.rec.label + (r.done ? ': done' : ': not yet') + '">' + r.rec.short + '</span>';
        }).join('');
      });
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
