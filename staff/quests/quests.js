/* Staff — one kid's Quests, in detail. Same live status read as the old
   staff-data Teacher's View: Completed is authoritative from the kid's
   own "Complete My Quest" click; In progress is any real sign of
   activity; Incomplete is staff's own manual override via /status,
   shown unless the kid has since actually finished. */
(function () {
  var WORKER_URL = 'https://risers-term2-digital-quests-progress.highergrade.workers.dev';
  var SITE_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var slug = params.get('kid');

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

  function showKidPicker() {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="../index.html">&larr; Home</a>'));
    var card = el('div', 'eot2-picker');
    var options = window.EOT2_KIDS.map(function (k) { return '<option value="' + k.slug + '">' + k.name + '</option>'; }).join('');
    card.innerHTML =
      '<h1>Quests</h1>' +
      '<p>Choose a kid.</p>' +
      '<div class="eot2-field"><select id="kid-select">' + options + '</select></div>' +
      '<button class="eot2-btn" id="kid-go">Open</button>';
    app.appendChild(card);
    document.getElementById('kid-go').addEventListener('click', function () {
      location.href = 'index.html?kid=' + document.getElementById('kid-select').value;
    });
  }

  function render(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="../index.html">&larr; Home</a>'));

    var header = el('div', 'dash-header');
    header.innerHTML = '<h1>' + kid.name + '’s Quests</h1><p class="dash-sub">' + groupLabel(kid.group) + '</p>';
    app.appendChild(header);

    var weeks = (window.DASHBOARD_ROSTER[kid.slug] && window.DASHBOARD_ROSTER[kid.slug].weeks) || [];
    if (!weeks.length) {
      app.appendChild(el('p', 'rep-empty', 'No quests on record yet for ' + kid.name + '.'));
      return;
    }

    var list = el('div', 'staff-quest-list');
    app.appendChild(list);

    weeks.forEach(function (w) {
      var row = el('div', 'staff-quest-row');
      row.id = 'qrow-' + w.key;
      row.innerHTML =
        '<span class="staff-quest-week">' + w.label + '</span>' +
        '<span class="quest-badge status-loading">&hellip;</span>' +
        '<a class="staff-quest-link" href="' + w.path + '?fac=1" target="_blank" rel="noopener">Open →</a>';
      list.appendChild(row);

      var base = WORKER_URL.replace(/\/$/, '');
      var syncUrl = base + '/sync?group=' + encodeURIComponent(w.group) + '&kid=' + encodeURIComponent(kid.slug) + '&week=' + encodeURIComponent(w.key);
      var statusUrl = base + '/status?group=' + encodeURIComponent(w.group) + '&kid=' + encodeURIComponent(kid.slug) + '&week=' + encodeURIComponent(w.key);
      Promise.all([fetchJSON(syncUrl), fetchJSON(statusUrl)]).then(function (results) {
        var syncRes = results[0], statusRes = results[1];
        var state = (syncRes && syncRes.found) ? countKidCompletion(syncRes.data.state) : 'not-started';
        var marked = !!(statusRes && statusRes.incomplete);
        row.querySelector('.quest-badge').outerHTML = questBadgeHtml(state, marked);
      });
    });
  }

  function init() {
    var kid = slug ? window.EOT2_findKid(slug) : null;
    if (kid) { render(kid); } else { showKidPicker(); }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
