/* Staff — Quests. Two views on one page:

   - no ?kid=: every Riser, grouped by group, with how many self-paced
     quests they've completed;
   - ?kid=<slug>: that Riser's quests, one row per week with its live
     status, Feedback, and a direct link in.

   Status uses the same rule as the old staff-data Teacher's View
   (dashboard/quest-data.js): Completed is authoritative from the kid's
   own "Complete My Quest" click; In progress is any real sign of
   activity; Incomplete is staff's own manual override via /status, shown
   unless the kid has since actually finished. */
(function () {
  var WORKER_URL = 'https://risers-term2-digital-quests-progress.highergrade.workers.dev';
  var SITE_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';
  var QD = window.QUEST_DATA;
  var ROSTER = window.DASHBOARD_ROSTER || {};
  var app = document.getElementById('app');
  var slug = new URLSearchParams(location.search).get('kid');

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

  function completedText(n) {
    return n === 0 ? 'No quests completed yet' : n + (n === 1 ? ' quest' : ' quests') + ' completed';
  }

  function fetchIncomplete(group, kid, week) {
    var url = WORKER_URL + '/status?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(week);
    return fetch(url, { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) { return !!(res && res.incomplete); })
      .catch(function () { return false; });
  }

  function chip(status, marked) {
    if (status === 'completed') return '<span class="hd-chip hd-chip-done">Completed</span>';
    if (status === 'unknown') return '<span class="hd-chip hd-chip-new">Couldn’t load</span>';
    if (marked) return '<span class="hd-chip hd-chip-todo">Incomplete</span>';
    if (status === 'in-progress') return '<span class="hd-chip hd-chip-progress">In progress</span>';
    return '<span class="hd-chip hd-chip-new">Not started</span>';
  }

  function renderRoster() {
    app.innerHTML = '';
    app.appendChild(el('header', 'hd-page-head',
      '<p class="hd-eyebrow">Term 2 &middot; Self-paced quests</p><h1>Quests</h1>' +
      '<p>Choose a Riser to see their quests and feedback.</p>'));

    var groups = [];
    window.EOT2_KIDS.forEach(function (k) { if (groups.indexOf(k.group) === -1) groups.push(k.group); });
    groups.sort();

    groups.forEach(function (g) {
      var section = el('section', 'sq-group');
      section.appendChild(el('h2', 'sq-group-title', groupLabel(g)));
      var list = el('div', 'hd-card sq-list');
      window.EOT2_KIDS.filter(function (k) { return k.group === g; }).forEach(function (kid) {
        var weeks = (ROSTER[kid.slug] && ROSTER[kid.slug].weeks) || [];
        var row = el('a', 'sq-row');
        row.href = 'index.html?kid=' + kid.slug;
        row.innerHTML =
          '<span class="lh-avatar sq-avatar">' + kid.name.charAt(0) + '</span>' +
          '<span class="sq-name">' + kid.name + '</span>' +
          '<span class="sq-meta">&nbsp;</span>' +
          '<span class="sq-go" aria-hidden="true">&rarr;</span>';
        list.appendChild(row);
        Promise.all(weeks.map(function (w) {
          return QD.fetchWeekState(w.group, kid.slug, w.key).then(function (res) {
            return res.ok ? QD.summarizeWeek(w, res.state).status : 'unknown';
          });
        })).then(function (statuses) {
          var failed = statuses.indexOf('unknown') !== -1;
          var done = statuses.filter(function (s) { return s === 'completed'; }).length;
          row.querySelector('.sq-meta').textContent = failed ? 'Couldn’t load — refresh' : completedText(done);
          row.querySelector('.sq-meta').classList.toggle('is-done', !failed && done > 0);
        });
      });
      section.appendChild(list);
      app.appendChild(section);
    });

    var ref = window.STAFF_REF;
    app.appendChild(el('div', 'staff-ref-row sq-ref',
      '<span class="staff-ref-label">Reference</span>' +
      ref.guide('Facilitator Guide', 'staff-ref-pill') +
      ref.teachersView('Teacher’s View', 'staff-ref-pill') +
      groups.map(function (g) { return ref.answerKey(g, groupLabel(g) + ' key', 'staff-ref-pill'); }).join('')));
  }

  function renderKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="index.html">&larr; All Risers</a>'));
    app.appendChild(el('header', 'hd-page-head',
      '<p class="hd-eyebrow">' + groupLabel(kid.group) + ' &middot; Self-paced quests</p>' +
      '<h1>' + kid.name + '</h1><p class="sq-summary">&nbsp;</p>'));

    var weeks = (ROSTER[kid.slug] && ROSTER[kid.slug].weeks) || [];
    if (!weeks.length) {
      app.appendChild(el('p', 'rep-empty', 'No quests on record yet for ' + kid.name + '.'));
      return;
    }

    var list = el('div', 'hd-card sq-list');
    app.appendChild(list);

    var ref = window.STAFF_REF;
    app.appendChild(el('div', 'staff-ref-row sq-ref',
      '<span class="staff-ref-label">Reference</span>' +
      ref.answerKey(kid.group, groupLabel(kid.group) + ' answer key', 'staff-ref-pill') +
      ref.teachersView('Mark a week Incomplete', 'staff-ref-pill')));

    var statuses = weeks.map(function (w) {
      var row = el('div', 'sq-week');
      var parts = String(w.label).split(' · ');
      row.innerHTML =
        '<span class="sq-week-main"><small>' + (parts.length > 1 ? parts[0] : '') + '</small><strong>' + (parts.length > 1 ? parts.slice(1).join(' · ') : w.label) + '</strong></span>' +
        '<span class="sq-week-status"><span class="hd-chip hd-chip-new">&hellip;</span></span>' +
        '<span class="sq-week-links">' +
          ref.feedback(w.group, kid.slug, w.key, 'Feedback', 'staff-quest-link') +
          '<a class="staff-quest-link" href="../../' + w.path.replace(/^\.\.\//, '') + '?fac=1" target="_blank" rel="noopener">Open &rarr;</a>' +
        '</span>';
      list.appendChild(row);
      return Promise.all([QD.fetchWeekState(w.group, kid.slug, w.key), fetchIncomplete(w.group, kid.slug, w.key)]).then(function (r) {
        var status = r[0].ok ? QD.summarizeWeek(w, r[0].state).status : 'unknown';
        row.querySelector('.sq-week-status').innerHTML = chip(status, r[1]);
        return status;
      });
    });

    Promise.all(statuses).then(function (s) {
      var done = s.filter(function (x) { return x === 'completed'; }).length;
      app.querySelector('.sq-summary').textContent = completedText(done) + '.';
    });
  }

  function init() {
    var kid = slug ? window.EOT2_findKid(slug) : null;
    if (kid) { renderKid(kid); } else { renderRoster(); }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
