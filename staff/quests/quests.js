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

  /* ---- Undo a completion ----
     For a quest marked complete by mistake (e.g. "Complete My Quest"
     clicked on the Riser's behalf). Staff tick the build steps the Riser
     really finished — step names read from the quest page itself — and it
     saves the quest as not complete with only those steps ticked. Answers,
     time and everything else in the record stay as they are. The Riser's
     page (and any device that has it open) picks this up on its next load,
     because this save is newer than anything they hold. */
  function questPageUrl(w) { return '../../' + w.path.replace(/^\.\.\//, ''); }

  function buildStepNames(w) {
    return fetch(questPageUrl(w))
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return Array.prototype.map.call(doc.querySelectorAll('.build-check-item'), function (item) {
          return (item.textContent || '').replace(/\s+/g, ' ').trim();
        });
      })
      .catch(function () { return []; });
  }

  // done=false: the quest isn't complete, so this only fixes the build
  // steps (same stamped reset, so other devices' old ticks don't return).
  function addUndo(row, kid, w, done) {
    var btn = el('button', 'sq-undo', done ? 'Undo completion' : 'Fix build steps');
    btn.type = 'button';
    row.querySelector('.sq-week-links').appendChild(btn);
    btn.addEventListener('click', function () {
      if (row.nextSibling && row.nextSibling.classList && row.nextSibling.classList.contains('sq-undo-panel')) return;
      var panel = el('div', 'sq-undo-panel', '<p class="sq-undo-msg">Loading…</p>');
      row.parentNode.insertBefore(panel, row.nextSibling);
      Promise.all([QD.fetchWeekState(w.group, kid.slug, w.key), buildStepNames(w)]).then(function (r) {
        if (!r[0].ok || !r[0].state) { panel.innerHTML = '<p class="sq-undo-msg">Couldn’t load this quest — try again.</p>'; return; }
        var state = Object.assign({}, r[0].state);
        if (r[0].staffComplete) delete state.completed; // merged in from the staff record
        var build = state.build || {};
        var names = r[1];
        var total = Math.max(names.length, w.buildTotal || 0);
        var steps = '';
        for (var i = 0; i < total; i++) {
          steps += '<label class="sq-undo-step"><input type="checkbox" data-i="' + i + '"' + (build[i] ? ' checked' : '') + '> ' +
            (names[i] ? names[i].replace(/[<>&]/g, '') : 'Step ' + (i + 1)) + '</label>';
        }
        panel.innerHTML =
          '<p class="sq-undo-title">' + (done ? '<strong>Undo ' + kid.name + '’s completion?</strong> The quest goes back to not complete. ' : '<strong>Fix ' + kid.name + '’s build steps.</strong> ') +
            (total ? 'Leave ticked only the build steps ' + kid.name + ' really finished:' : '') + '</p>' +
          (total ? '<div class="sq-undo-steps">' + steps + '</div>' : '') +
          '<div class="sq-undo-actions"><button type="button" class="eot2-btn sq-undo-go">' + (done ? 'Undo completion' : 'Save build steps') + '</button>' +
          '<button type="button" class="eot2-btn eot2-btn-secondary sq-undo-cancel">Cancel</button>' +
          '<span class="sq-undo-msg"></span></div>';
        panel.querySelector('.sq-undo-cancel').addEventListener('click', function () { panel.remove(); });
        panel.querySelector('.sq-undo-go').addEventListener('click', function () {
          var go = this;
          go.disabled = true;
          var nextBuild = {};
          Array.prototype.forEach.call(panel.querySelectorAll('.sq-undo-step input'), function (cb) {
            nextBuild[cb.getAttribute('data-i')] = cb.checked;
          });
          // resetAt tells every device's merge that this undo is newer than
          // their copy, so their older ticks/completion don't come back.
          var next = Object.assign({}, state, { completed: false, build: total ? nextBuild : state.build, resetAt: new Date().toISOString() });
          fetch(WORKER_URL + '/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Site-Key': SITE_KEY },
            body: JSON.stringify({ group: w.group, kid: kid.slug, week: w.key, state: next })
          })
            .then(function (res) { return res.json(); })
            .then(function (out) {
              if (!out || !out.ok) throw new Error('save failed');
              // Also clear a staff "Mark complete" (Teacher's View), if any.
              if (!r[0].staffComplete) return;
              return fetch(WORKER_URL + '/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Site-Key': SITE_KEY },
                body: JSON.stringify({ group: w.group, kid: kid.slug, week: w.key + '-staff', state: { completed: false, at: new Date().toISOString() } })
              }).then(function (res2) { return res2.json(); }).then(function (o2) { if (!o2 || !o2.ok) throw new Error('save failed'); });
            })
            .then(function () {
              panel.remove();
              btn.remove();
              var summary = QD.summarizeWeek(w, next);
              row.querySelector('.sq-week-status').innerHTML = chip(summary.status, false);
            })
            .catch(function () {
              go.disabled = false;
              panel.querySelector('.sq-undo-actions .sq-undo-msg').textContent = 'Couldn’t save — check your connection and try again.';
            });
        });
      });
    });
  }

  // Completed and in-progress quests get a Report link: review the family-facing report
  // card and share it (report.html). Shows whether it's been shared yet.
  function addReportLink(row, kid, w) {
    var a = el('a', 'staff-quest-link sq-report-link', 'Report');
    a.href = 'report.html?kid=' + kid.slug + '&week=' + encodeURIComponent(w.key);
    row.querySelector('.sq-week-links').insertBefore(a, row.querySelector('.sq-week-links').firstChild);
    window.QUEST_REPORT.fetchReport(w.group, kid.slug, w.key).then(function (res) {
      var shared = !!(res.report && res.report.shared);
      a.textContent = shared ? 'Report · Shared' : 'Report · To review';
      a.classList.toggle('is-shared', shared);
    });
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
        if (status === 'completed' || status === 'in-progress') addReportLink(row, kid, w);
        if (status === 'completed') addUndo(row, kid, w, true);
        else if (status === 'in-progress' && w.buildTotal) addUndo(row, kid, w, false);
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
