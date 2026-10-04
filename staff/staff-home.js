/* Risers Journey — Staff home. The one sign-in for the staff side (name
   only, from the fixed list of three), then every kid in one elegant
   grid: their Quests — status and a direct link, same at-a-glance style
   as the old Teacher's View — plus one-click shortcuts into this staff
   member's own End of Term 2 entries for that kid. No re-picking the
   kid, no re-typing who you are. */
(function () {
  var STAFF_KEY = 'rj-staff-name';
  var WORKER_URL = 'https://risers-term2-digital-quests-progress.highergrade.workers.dev';
  var SITE_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';
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

  function fetchJSON(path) {
    return fetch(path, { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  /* Same read as Teacher's View: completed is authoritative from the
     kid's own "Complete My Quest" click; in-progress is any real sign of
     activity (a reflect attempt, a checked build item, time logged);
     Incomplete is staff's own manual override via /status, shown instead
     of in-progress/not-started unless the kid has since actually finished. */
  function countKidCompletion(state) {
    if (state && state.completed) return 'completed';
    var reflectState = (state && state.reflect) || {};
    var anyReflectActivity = Object.keys(reflectState).some(function (id) {
      var s = reflectState[id];
      return !!(s && (s.attempts > 0 || (s.text && s.text.trim())));
    });
    var buildState = (state && state.build) || {};
    var buildDoneCount = Object.keys(buildState).filter(function (k) { return buildState[k]; }).length;
    var dayTimeState = (state && state.dayTime) || {};
    var anyTimeSpent = Object.keys(dayTimeState).some(function (k) { return (dayTimeState[k] || 0) > 0; });
    if (anyReflectActivity || buildDoneCount > 0 || anyTimeSpent) return 'in-progress';
    return 'not-started';
  }

  function questBadgeHtml(state, marked) {
    if (state === 'completed') return '<span class="quest-badge status-done">✅ Completed</span>';
    if (marked) return '<span class="quest-badge status-incomplete">\u{1F6A9} Incomplete</span>';
    if (state === 'in-progress') return '<span class="quest-badge status-progress">\u{1F7E1} In progress</span>';
    return '<span class="quest-badge status-new">⚪ Not started</span>';
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
    var roster = window.DASHBOARD_ROSTER || {};

    var header = el('div', 'dash-header');
    header.innerHTML =
      '<a href="#" id="logout-link" class="switch-kid-link">Log out</a>' +
      '<h1>Hi, ' + staffInfo.label + '! \u{1F44B}</h1>' +
      '<p class="dash-sub">Every kid — their Quests, and their End of Term 2.</p>';
    app.appendChild(header);
    document.getElementById('logout-link').addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(STAFF_KEY); } catch (err) {}
      init();
    });

    app.appendChild(el('p', 'staff-home-link', '<a href="../end-of-term-2/staff/index.html">Open the full End of Term 2 status table &rarr;</a>'));

    var grid = el('div', 'staff-kid-grid');
    app.appendChild(grid);

    window.EOT2_KIDS.forEach(function (kid) {
      var weeks = (roster[kid.slug] && roster[kid.slug].weeks) || [];

      var card = el('div', 'staff-kid-card');
      var questRows = weeks.map(function (w) {
        return '<div class="staff-quest-row" id="qrow-' + kid.slug + '-' + w.key + '">' +
          '<span class="staff-quest-week">' + w.label.replace(/^Quest \d+ . /, '') + '</span>' +
          '<span class="quest-badge status-loading">&hellip;</span>' +
          '<a class="staff-quest-link" href="' + w.path + '?fac=1" target="_blank" rel="noopener">Open →</a>' +
          '</div>';
      }).join('') || '<p class="eot2-mom-hint">No quests on record yet.</p>';

      card.innerHTML =
        '<h3>' + kid.name + '</h3>' +
        '<p class="staff-kid-group">' + groupLabel(kid.group) + '</p>' +
        '<div class="staff-kid-section-title">Quests</div>' +
        '<div class="staff-quest-list">' + questRows + '</div>' +
        '<div class="staff-kid-section-title">End of Term 2</div>' +
        '<div class="staff-kid-actions">' +
        '<a class="eot2-btn eot2-btn-secondary" href="../end-of-term-2/self-assessment/index.html?rater=' + staffInfo.id + '&kid=' + kid.slug + '">Rate self-assessment</a>' +
        '<a class="eot2-btn eot2-btn-secondary" href="../end-of-term-2/mom/index.html?editAs=' + staffInfo.label + '&kid=' + kid.slug + '">Write MOM</a>' +
        '</div>';
      grid.appendChild(card);

      weeks.forEach(function (w) {
        var base = WORKER_URL.replace(/\/$/, '');
        var syncUrl = base + '/sync?group=' + encodeURIComponent(w.group) + '&kid=' + encodeURIComponent(kid.slug) + '&week=' + encodeURIComponent(w.key);
        var statusUrl = base + '/status?group=' + encodeURIComponent(w.group) + '&kid=' + encodeURIComponent(kid.slug) + '&week=' + encodeURIComponent(w.key);
        Promise.all([fetchJSON(syncUrl), fetchJSON(statusUrl)]).then(function (results) {
          var syncRes = results[0], statusRes = results[1];
          var state = (syncRes && syncRes.found) ? countKidCompletion(syncRes.data.state) : 'not-started';
          var marked = !!(statusRes && statusRes.incomplete);
          var row = document.getElementById('qrow-' + kid.slug + '-' + w.key);
          if (row) row.querySelector('.quest-badge').outerHTML = questBadgeHtml(state, marked);
        });
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
