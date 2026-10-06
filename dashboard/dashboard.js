/* Quests — the kid-facing quest page. Two views:

   - overview: one list of the Riser's quests, completed first, then the
     ones in progress (badge + progress bar + Continue), with a short
     "across your quests" line once any feedback has been shared;
   - ?quest=<week key>: that quest's report card (dashboard/report-card.js)
     — but only after staff have reviewed it and switched on Share.

   Never shows anything staff-private, so this page, and its link, is safe
   to share with families. */
(function () {
  var QD = window.QUEST_DATA;
  var QR = window.QUEST_REPORT;
  var KID_KEY = 'imm-l3-kid';
  var TERM_START = 'Aug 31';
  var TERM_END = 'Sep 30';

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
  function completedText(n) {
    return n + (n === 1 ? ' quest' : ' quests');
  }

  function splitLabel(label) {
    var parts = String(label).split(' · ');
    return { num: parts.length > 1 ? parts[0] : '', title: parts.length > 1 ? parts.slice(1).join(' · ') : label };
  }

  // Loads every quest week once; each result is { weekCfg, loadError } or
  // { weekCfg, state, summary, rating, report } (state null = not started
  // yet; report only when staff have shared it).
  function loadQuests(kidKey, roster) {
    return Promise.all(roster.weeks.map(function (weekCfg) {
      return Promise.all([
        QD.fetchWeekState(weekCfg.group, kidKey, weekCfg.key),
        QD.fetchRating(weekCfg.group, kidKey, weekCfg.key)
      ]).then(function (r) {
        if (!r[0].ok) return { weekCfg: weekCfg, loadError: true };
        var q = { weekCfg: weekCfg, state: r[0].state, summary: QD.summarizeWeek(weekCfg, r[0].state), rating: r[1], report: null };
        if (q.summary.status !== 'completed') return q;
        return QR.fetchReport(weekCfg.group, kidKey, weekCfg.key).then(function (rep) {
          q.report = rep.report && rep.report.shared ? rep.report : null;
          return q;
        });
      });
    }));
  }

  function loadWarning() {
    return el('p', 'rep-load-warning',
      '⚠️ Some of your quest data couldn’t load just now — your work is safe, this is just a loading hiccup. Try refreshing the page.');
  }

  // ---- Overview: how many self-paced quests were completed, plus the ones
  // still under way (so a Riser can see where they are and jump back in). ----
  function questRow(q, done) {
    var lbl = splitLabel(q.weekCfg.label);
    var row = el('a', 'qd-row' + (done ? '' : ' is-progress'));
    row.href = done ? '?quest=' + encodeURIComponent(q.weekCfg.key) : q.weekCfg.path;
    row.innerHTML =
      '<span class="qd-row-num">' + escapeHtml(lbl.num.replace(/^Quest\s*/, '')) + '</span>' +
      '<span class="qd-row-text"><strong>' + escapeHtml(lbl.title) + '</strong>' +
        (done ? '<span>' + (q.report ? 'See your feedback' : 'Feedback coming soon') + '</span>'
              : '<span class="qd-row-bar"><span class="qd-row-track"><span style="width:' + q.summary.pct + '%"></span></span>' + q.summary.pct + '% done · Continue</span>') +
      '</span>' +
      (done ? '<span class="hd-chip hd-chip-done qd-row-chip">Completed</span>' : '<span class="hd-chip hd-chip-progress qd-row-chip">In progress</span>') +
      '<span class="qd-row-go" aria-hidden="true">&rarr;</span>';
    return row;
  }

  function renderOverview(app, roster, results) {
    var anyLoadError = results.some(function (r) { return r.loadError; });
    var ok = results.filter(function (r) { return !r.loadError; });
    var done = ok.filter(function (r) { return r.summary.status === 'completed'; });
    var going = ok.filter(function (r) { return r.summary.status === 'in-progress'; });

    app.querySelector('.qd-lede').innerHTML = done.length
      ? 'You completed <strong>' + completedText(done.length) + '</strong> in your self-paced quests.' + (going.length ? ' ' + going.length + ' in progress.' : '')
      : going.length ? 'Your quests in progress are below — pick up where you left off.'
      : 'Your quests will show up here once you start one.';
    if (anyLoadError) app.appendChild(loadWarning());

    // One list: completed first, then the ones still under way — each
    // marked with a badge rather than split under headings.
    if (done.length || going.length) {
      var list = el('div', 'hd-card qd-list');
      done.forEach(function (q) { list.appendChild(questRow(q, true)); });
      going.forEach(function (q) { list.appendChild(questRow(q, false)); });
      app.appendChild(list);
    }
    if (!done.length) return;

    var shared = done.filter(function (q) { return q.report; });
    var roll = shared.length ? QR.rollup(shared.map(function (q) { return QR.build(q.weekCfg, q.state, q.rating); })) : null;
    if (roll) {
      app.insertBefore(el('div', 'qd-rollup',
        '<span class="qd-rollup-label">Across your quests</span>' +
        '<span>Strongest: <strong>' + roll.strongest + '</strong></span>' +
        (roll.growing ? '<span>Growing: <strong>' + roll.growing + '</strong></span>' : '')), app.querySelector('.qd-list'));
    }
  }

  // ---- One quest: its own performance, and a way back in. ----
  function renderQuest(app, roster, q) {
    var lbl = splitLabel(q.weekCfg.label);
    var head = app.querySelector('.hd-page-head');
    head.querySelector('.hd-eyebrow').innerHTML = escapeHtml(lbl.num) + (q.summary && q.summary.status === 'completed' ? ' &middot; Completed' : '');
    head.querySelector('h1').textContent = lbl.title;
    head.querySelector('.qd-lede').innerHTML = '<a class="qd-open" href="' + q.weekCfg.path + '">Open quest &rarr;</a>';

    if (q.loadError) { app.appendChild(loadWarning()); return; }
    var s = q.summary;
    if (s.status !== 'completed') {
      app.appendChild(el('p', 'qd-muted qd-pending', s.status === 'in-progress'
        ? 'In progress — ' + s.pct + '% done so far. Your feedback will show here once it’s completed.'
        : 'Not started yet.'));
      return;
    }
    if (!q.report) {
      app.appendChild(el('div', 'hd-card qd-waiting',
        '<strong>Your facilitators are reviewing this quest.</strong><span>Your feedback will appear here soon.</span>'));
      return;
    }
    var model = QR.build(q.weekCfg, q.state, q.rating);
    var wrap = el('div', 'qd-report');
    wrap.innerHTML = QR.render(model, q.report, { questHref: q.weekCfg.path });
    app.appendChild(wrap);
  }

  function renderDashboard(kidKey, roster) {
    var app = document.getElementById('app');
    var questKey = new URLSearchParams(location.search).get('quest');
    var weekCfg = questKey ? roster.weeks.filter(function (w) { return w.key === questKey; })[0] : null;
    app.innerHTML = '';

    if (weekCfg) app.appendChild(el('div', 'dash-crumb', '<a href="index.html">&larr; All quests</a>'));
    app.appendChild(el('header', 'hd-page-head',
      '<p class="hd-eyebrow">Term 2 &middot; Self-paced &middot; ' + TERM_START + ' – ' + TERM_END + '</p>' +
      '<h1>Quests</h1><p class="qd-lede">Loading your quests…</p>'));

    loadQuests(kidKey, roster).then(function (results) {
      if (weekCfg) {
        renderQuest(app, roster, results.filter(function (r) { return r.weekCfg === weekCfg; })[0]);
      } else {
        renderOverview(app, roster, results);
      }
    });
  }

  // No login of its own anymore — Home is the one sign-in for the whole
  // site. Arriving here already signed in (the normal path, via Home's
  // Quests card) goes straight to the dashboard; arriving any other way
  // (a stale bookmark, a direct link, after logging out) bounces to Home,
  // which signs you in and sends you right back.
  function init() {
    var roster = window.DASHBOARD_ROSTER || {};
    var kid = null;
    try { kid = (localStorage.getItem(KID_KEY) || '').toLowerCase(); } catch (e) {}
    if (kid && roster[kid]) {
      renderDashboard(kid, roster[kid]);
    } else {
      // No Riser signed in: a facilitator goes to the staff Quests page,
      // anyone else to Home to sign in.
      var staff = null;
      try { staff = localStorage.getItem('rj-staff-name'); } catch (e) {}
      location.replace(staff ? '../staff/quests/index.html' : '../index.html');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
