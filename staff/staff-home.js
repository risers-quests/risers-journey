/* Risers Journey — Staff overview. The one sign-in for the staff side (name
   only, from the fixed list of three), then a cockpit for the whole
   roster:

   - four at-a-glance stats across every Riser,
   - one table row per Riser: a dot per quest week (live status, same rule
     as the staff Quests page), their own self-assessment, the signed-in
     facilitator's rating, Term Reflection and MOM status, and quick
     actions — filterable by group and searchable by name.

   Quest detail (per-week Feedback, answer keys) stays one click in, on
   the Quests page and the private staff reference site. */
(function () {
  var STAFF_KEY = 'rj-staff-name';
  var app = document.getElementById('app');
  var QD = window.QUEST_DATA;
  var ROSTER = window.DASHBOARD_ROSTER || {};
  var STAFF_NAMES = window.EOT2_STAFF_RATERS.filter(function (r) { return r.id !== 'consolidated'; });

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function groupNum(group) {
    var m = String(group).match(/(\d+)$/);
    return m ? parseInt(m[1], 10) : group;
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
      // Reload so the app shell (navigation, profile) picks up the sign-in.
      location.reload();
    });
  }

  function hasAnyAnswer(state) {
    if (!state) return false;
    return Object.keys(state).some(function (k) {
      var v = state[k];
      if (v && typeof v === 'object') return Object.keys(v).length > 0;
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
  }

  function stat(tone, value, label, sub) {
    return '<div class="hd-stat hd-tone-' + tone + ' st-stat">' +
      '<div><div class="hd-stat-value">' + value + '</div><div class="hd-stat-label">' + label + '</div>' +
      (sub ? '<div class="hd-stat-sub">' + sub + '</div>' : '') + '</div></div>';
  }

  var DOT_TEXT = { 'completed': 'Completed', 'in-progress': 'In progress', 'not-started': 'Not started', 'unknown': 'Couldn’t load' };

  function renderHome(staffInfo) {
    app.innerHTML = '';
    var hour = new Date().getHours();
    var hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    var groups = [];
    window.EOT2_KIDS.forEach(function (k) { if (groups.indexOf(k.group) === -1) groups.push(k.group); });
    groups.sort();

    var hero = el('section', 'hd-hero st-hero');
    hero.innerHTML =
      '<div class="hd-hero-text">' +
        '<p class="hd-eyebrow">' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' &middot; Staff workspace</p>' +
        '<h1>' + hello + ', ' + staffInfo.label + '</h1>' +
        '<p class="hd-hero-sub">' + window.EOT2_KIDS.length + ' Risers across ' + groups.length + ' groups. Live quest progress and End of Term 2 status, all in one place.</p>' +
      '</div>';
    app.appendChild(hero);

    var stats = el('section', 'hd-stats', '<div class="hd-stat hd-skel"></div><div class="hd-stat hd-skel"></div><div class="hd-stat hd-skel"></div><div class="hd-stat hd-skel"></div>');
    app.appendChild(stats);

    var ref = window.STAFF_REF;
    var refBar = el('div', 'staff-ref-row st-refbar',
      '<span class="staff-ref-label">Reference</span>' +
      groups.map(function (g) { return ref.answerKey(g, 'Group ' + groupNum(g) + ' key', 'staff-ref-pill'); }).join('') +
      ref.guide('Facilitator Guide', 'staff-ref-pill') +
      ref.teachersView('Teacher’s View', 'staff-ref-pill'));

    var card = el('section', 'hd-card st-roster');
    card.innerHTML =
      '<div class="hd-card-head st-roster-head"><h2>Risers</h2>' +
        '<div class="st-tools">' +
          '<div class="st-filter" role="group" aria-label="Filter by group">' +
            '<button type="button" class="is-on" data-group="">All</button>' +
            groups.map(function (g) { return '<button type="button" data-group="' + g + '">G' + groupNum(g) + '</button>'; }).join('') +
          '</div>' +
          '<input type="search" class="st-search" placeholder="Search a name" aria-label="Search a name">' +
        '</div>' +
      '</div>' +
      '<div class="st-table-wrap"><table class="st-table">' +
        '<thead><tr><th>Riser</th><th>Quests</th><th>Self-assessment</th><th>Your rating</th><th>Reflection</th><th>MOM</th><th></th></tr></thead>' +
        '<tbody></tbody></table></div>' +
      '<p class="hd-legend st-legend"><span class="st-dot st-dot-completed"></span> completed <span class="st-dot st-dot-in-progress"></span> in progress <span class="st-dot st-dot-not-started"></span> not started</p>';
    app.appendChild(card);
    app.insertBefore(refBar, card);

    var tbody = card.querySelector('tbody');
    var totals = { weeks: 0, done: 0, active: {}, mine: 0, mom: 0, loadError: false };
    var pending = [];

    window.EOT2_KIDS.forEach(function (kid) {
      var weeks = (ROSTER[kid.slug] && ROSTER[kid.slug].weeks) || [];
      totals.weeks += weeks.length;
      var tr = document.createElement('tr');
      tr.setAttribute('data-group', kid.group);
      tr.setAttribute('data-name', kid.name.toLowerCase());
      tr.innerHTML =
        '<td><a class="st-kid" href="quests/index.html?kid=' + kid.slug + '"><span class="lh-avatar st-avatar">' + kid.name.charAt(0) + '</span>' +
          '<span><strong>' + kid.name + '</strong><small>Group ' + groupNum(kid.group) + '</small></span></a></td>' +
        '<td><span class="st-dots">' + weeks.map(function (w) { return '<span class="st-dot st-dot-loading" title="' + w.label + '"></span>'; }).join('') + '</span>' +
          '<span class="st-count"></span></td>' +
        '<td class="st-c-self"><span class="hd-chip hd-chip-new">&hellip;</span></td>' +
        '<td class="st-c-mine"><span class="hd-chip hd-chip-new">&hellip;</span></td>' +
        '<td class="st-c-refl"><span class="hd-chip hd-chip-new">&hellip;</span></td>' +
        '<td class="st-c-mom"><span class="hd-chip hd-chip-new">&hellip;</span></td>' +
        '<td class="st-actions">' +
          '<a href="../end-of-term-2/self-assessment/index.html?rater=' + staffInfo.id + '&kid=' + kid.slug + '">Rate</a>' +
          '<a href="../end-of-term-2/mom/index.html?editAs=' + staffInfo.label + '&kid=' + kid.slug + '">MOM</a>' +
          '<a href="quests/index.html?kid=' + kid.slug + '">Quests &rarr;</a>' +
        '</td>';
      tbody.appendChild(tr);

      var dots = tr.querySelectorAll('.st-dot');
      var doneHere = 0;
      weeks.forEach(function (w, i) {
        pending.push(QD.fetchWeekState(w.group, kid.slug, w.key).then(function (res) {
          var status = res.ok ? QD.summarizeWeek(w, res.state).status : 'unknown';
          if (!res.ok) totals.loadError = true;
          if (status === 'completed') { totals.done++; doneHere++; }
          if (status === 'in-progress') totals.active[kid.slug] = true;
          dots[i].className = 'st-dot st-dot-' + status;
          dots[i].title = w.label + ' — ' + DOT_TEXT[status];
          tr.querySelector('.st-count').textContent = doneHere + '/' + weeks.length;
        }));
      });

      function cell(sel, weekKey, yes, no, onYes) {
        pending.push(window.eot2Fetch(kid.group, kid.slug, weekKey).then(function (data) {
          var done = hasAnyAnswer(data && data.state);
          if (done && onYes) onYes();
          tr.querySelector(sel).innerHTML = done ? '<span class="hd-chip hd-chip-done">' + yes + '</span>' : '<span class="hd-chip hd-chip-new">' + no + '</span>';
        }));
      }
      cell('.st-c-self', 'term2-self-assessment-self', 'Done', 'Not yet');
      cell('.st-c-mine', 'term2-self-assessment-' + staffInfo.id, 'Rated', 'Not yet', function () { totals.mine++; });
      cell('.st-c-refl', 'term2-term-reflection', 'Done', 'Not yet');
      cell('.st-c-mom', 'term2-mom', 'Written', 'Not yet', function () { totals.mom++; });
    });

    Promise.all(pending).then(function () {
      var n = window.EOT2_KIDS.length;
      stats.innerHTML =
        stat('green', totals.done + '<small>/' + totals.weeks + '</small>', 'Quests completed', 'across every Riser') +
        stat('amber', Object.keys(totals.active).length + '<small>/' + n + '</small>', 'Risers mid-quest', 'with a quest in progress') +
        stat('slate', totals.mine + '<small>/' + n + '</small>', 'Rated by you', 'End of Term 2 self-assessment') +
        stat('violet', totals.mom + '<small>/' + n + '</small>', 'MOMs written', 'parent conference notes');
      if (totals.loadError) {
        app.insertBefore(el('p', 'rep-load-warning', '⚠️ Some quest data couldn’t load just now — a grey dot means “couldn’t load”, not “not started”. Try refreshing.'), stats);
      }
    });

    // Group filter + name search.
    var activeGroup = '';
    var search = card.querySelector('.st-search');
    function applyFilter() {
      var q = search.value.trim().toLowerCase();
      Array.prototype.forEach.call(tbody.rows, function (row) {
        var show = (!activeGroup || row.getAttribute('data-group') === activeGroup) &&
          (!q || row.getAttribute('data-name').indexOf(q) !== -1);
        row.style.display = show ? '' : 'none';
      });
    }
    Array.prototype.forEach.call(card.querySelectorAll('.st-filter button'), function (b) {
      b.addEventListener('click', function () {
        activeGroup = b.getAttribute('data-group');
        Array.prototype.forEach.call(card.querySelectorAll('.st-filter button'), function (x) { x.classList.toggle('is-on', x === b); });
        applyFilter();
      });
    });
    search.addEventListener('input', applyFilter);
  }

  function init() {
    var id = null;
    try { id = localStorage.getItem(STAFF_KEY); } catch (e) {}
    var info = id ? STAFF_NAMES.filter(function (r) { return r.id === id; })[0] : null;
    if (info) { renderHome(info); } else { showGate(); }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
