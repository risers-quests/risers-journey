/* Quests — the kid-facing quest page. Two views:

   - overview: how many self-paced quests the kid completed, a row per
     completed quest, and three auto-drafted closing notes;
   - ?quest=<week key>: that one quest's own performance — time taken,
     questions answered, presentation rating, a Bloom's Taxonomy ceiling,
     and the build picture if there is one.

   Only quests actually finished (state.completed === true) are shown.
   Reads the same synced data the staff Feedback page uses, but never
   anything staff-private — this page, and its link, is safe to share
   with families.

   The three closing paragraphs are auto-drafted from the same
   underlying signals the staff Feedback page computes (Bloom's ceiling,
   genuine-pass rate), deliberately worded around the underlying skill
   rather than reading-quest mechanics ("questions," "-level thinking"
   as a label), so the same drafting logic keeps making sense once
   Term 3's fully different, hands-on build-and-make quests replace
   these — without revealing anything about what Term 3 actually is. */
(function () {
  var QD = window.QUEST_DATA;
  var KID_KEY = 'imm-l3-kid';
  var BLOOM_LEVELS = QD.BLOOM_LEVELS;
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
  function scoreBand(total, max) {
    var pct = total / max;
    if (pct >= 0.9) return 'Outstanding';
    if (pct >= 0.7) return 'Solid';
    if (pct >= 0.5) return 'Developing';
    return 'Needs support';
  }

  function bloomPyramidHtml(bloomInfo) {
    if (!bloomInfo) return '<p class="rep-no-data">Not tracked for this quest yet.</p>';
    var ceilingIdx = bloomInfo.ceiling ? BLOOM_LEVELS.indexOf(bloomInfo.ceiling) : -1;
    // BLOOM_LEVELS is already low-to-high (Remember...Evaluate). Fed in
    // that same order, .bloom-pyramid's column-reverse CSS puts the FIRST
    // item (Remember) at main-start, which for column-reverse is the
    // bottom — so this needs no .reverse() here; adding one, like an
    // earlier version of this did, cancels out the CSS reversal and flips
    // the whole pyramid (Evaluate at the base, Remember at the tip).
    var rows = BLOOM_LEVELS.map(function (level, idx) {
      var reached = idx <= ceilingIdx;
      var widthPct = 100 - idx * 15; // widest at the base (Remember), narrowest at the tip (Evaluate)
      return '<div class="bloom-tier ' + (reached ? 'reached' : 'not-reached') + '" style="width:' + widthPct + '%;">' +
        (reached ? '✓ ' : '') + level + '</div>';
    }).join('');
    return '<div class="bloom-pyramid">' + rows + '</div>' +
      (bloomInfo.ceiling
        ? '<p class="bloom-ceiling-label">Reached <strong>' + bloomInfo.ceiling + '</strong>-level thinking</p>'
        : '<p class="bloom-ceiling-label rep-no-data">Still building toward its first level here.</p>');
  }

  // Deliberately written to describe the underlying skill, not the
  // reading-quest mechanics behind it (no "questions," no naming Bloom's
  // Taxonomy in the prose) — Term 3 is a completely different, hands-on
  // build-and-make format, and this same drafting logic needs to keep
  // making sense once the quests it's describing look nothing like Term
  // 2's. The Bloom's ceiling itself still drives which sentence gets
  // picked; only the wording is kept generic.
  function draftClosingNotes(quests) {
    var highestCeilingIdx = -1;
    var anyGrowth = false;
    quests.forEach(function (q) {
      if (!q.bloomInfo) return;
      BLOOM_LEVELS.forEach(function (l) {
        var c = q.bloomInfo.counts[l];
        if (c.total && c.hit < c.total) anyGrowth = true;
      });
      if (q.bloomInfo.ceiling) {
        var idx = BLOOM_LEVELS.indexOf(q.bloomInfo.ceiling);
        if (idx > highestCeilingIdx) highestCeilingIdx = idx;
      }
    });

    var didWell, canImprove, canLearn;
    if (highestCeilingIdx >= 0) {
      var topLevel = BLOOM_LEVELS[highestCeilingIdx];
      var howLabel = topLevel === 'Remember' ? 'getting the basic facts right, consistently'
        : topLevel === 'Understand' ? 'explaining things clearly in your own words, not just repeating them'
        : topLevel === 'Apply' ? 'taking what you’ve learned and using it on something new, not just remembering it'
        : topLevel === 'Analyze' ? 'breaking things down and figuring out how the different parts connect'
        : 'weighing different ideas and judging which explanation actually holds up';
      didWell = 'You’ve been ' + howLabel + ' this term — real thinking, not just going through the motions.';
    } else {
      didWell = 'You’re building a real foundation this term, working through each quest step by step.';
    }

    // Always a concrete, actionable suggestion — never "nothing to work
    // on." Even a clean run has a real next step (going deeper/faster,
    // explaining it to someone else); the difference is which one fits
    // what actually happened, not whether there's anything to say.
    canImprove = anyGrowth
      ? 'A few parts took more than one attempt before they really clicked. Next time, try slowing down on the part that feels trickiest and double-checking your first idea before locking it in — that’s usually where the extra tries come from.'
      : 'Everything landed on the first real try, which is genuinely great — the next challenge is depth, not correctness: try explaining your answers out loud to someone else, or pushing a little further into the details before moving on, since that’s what separates “got it right” from “really owns it.”';

    canLearn = 'The next stretch is getting comfortable explaining <strong>why</strong> something works, not just what happened or what you did — that kind of thinking is exactly what future quests will keep building on.';

    return { didWell: didWell, canImprove: canImprove, canLearn: canLearn };
  }

  function presentationHtml(rating) {
    if (!rating) return '<span class="qd-muted">Not yet rated</span>';
    var scores = rating.scores || {};
    var keys = Object.keys(scores);
    var total = keys.reduce(function (sum, k) { return sum + scores[k]; }, 0);
    return escapeHtml(scoreBand(total, keys.length * 4 || 20));
  }

  function completedText(n) {
    return n + (n === 1 ? ' quest' : ' quests');
  }

  function splitLabel(label) {
    var parts = String(label).split(' · ');
    return { num: parts.length > 1 ? parts[0] : '', title: parts.length > 1 ? parts.slice(1).join(' · ') : label };
  }

  // Loads every quest week once; each result is { weekCfg, loadError } or
  // { weekCfg, state, summary, rating } (state null = not started yet).
  function loadQuests(kidKey, roster) {
    return Promise.all(roster.weeks.map(function (weekCfg) {
      return Promise.all([
        QD.fetchWeekState(weekCfg.group, kidKey, weekCfg.key),
        QD.fetchRating(weekCfg.group, kidKey, weekCfg.key)
      ]).then(function (r) {
        if (!r[0].ok) return { weekCfg: weekCfg, loadError: true };
        return { weekCfg: weekCfg, state: r[0].state, summary: QD.summarizeWeek(weekCfg, r[0].state), rating: r[1] };
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
        (done ? '<span>See how it went</span>'
              : '<span class="qd-row-bar"><span class="qd-row-track"><span style="width:' + q.summary.pct + '%"></span></span>' + q.summary.pct + '% · Continue</span>') +
      '</span>' +
      '<span class="qd-row-go" aria-hidden="true">&rarr;</span>';
    return row;
  }

  function renderOverview(app, roster, results) {
    var anyLoadError = results.some(function (r) { return r.loadError; });
    var ok = results.filter(function (r) { return !r.loadError; });
    var done = ok.filter(function (r) { return r.summary.status === 'completed'; });
    var going = ok.filter(function (r) { return r.summary.status === 'in-progress'; });

    app.querySelector('.qd-lede').innerHTML = done.length
      ? 'You completed <strong>' + completedText(done.length) + '</strong> in your self-paced quests.'
      : going.length ? 'Your quests in progress are below — pick up where you left off.'
      : 'Your quests will show up here once you start one.';
    if (anyLoadError) app.appendChild(loadWarning());

    if (going.length) {
      app.appendChild(el('h2', 'qd-section-title', 'In progress'));
      var gList = el('div', 'hd-card qd-list');
      going.forEach(function (q) { gList.appendChild(questRow(q, false)); });
      app.appendChild(gList);
    }
    if (!done.length) return;

    if (going.length) app.appendChild(el('h2', 'qd-section-title', 'Completed'));
    var list = el('div', 'hd-card qd-list');
    done.forEach(function (q) { list.appendChild(questRow(q, true)); });
    app.appendChild(list);

    var notes = draftClosingNotes(done.map(function (q) { return { bloomInfo: q.summary.bloom }; }));
    app.appendChild(el('h2', 'qd-section-title', 'Looking back'));
    app.appendChild(el('div', 'qd-notes',
      '<div><h3>What you did well</h3><p>' + notes.didWell + '</p></div>' +
      '<div><h3>What you can do better</h3><p>' + notes.canImprove + '</p></div>' +
      '<div><h3>What you can learn</h3><p>' + notes.canLearn + '</p></div>'));
    app.appendChild(el('p', 'qd-footnote', 'Term 3 quests will be different.'));
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
        ? 'In progress — ' + s.pct + '% done so far. How it went will show here once it’s completed.'
        : 'Not started yet.'));
      return;
    }

    var grid = el('div', 'qd-metrics');
    grid.innerHTML =
      '<div class="hd-card qd-metric"><span class="qd-label">Time taken</span><span class="qd-value">' + QD.fmtTime(s.timeMs) + '</span></div>' +
      '<div class="hd-card qd-metric"><span class="qd-label">Questions answered</span><span class="qd-value">' + s.passed + ' of ' + s.questionTotal + '</span>' +
        '<div class="hd-squares">' + s.questions.map(function (x) { return '<span class="hd-sq hd-sq-' + x.status + '"></span>'; }).join('') + '</div></div>' +
      '<div class="hd-card qd-metric"><span class="qd-label">Presentation</span><span class="qd-value">' + presentationHtml(q.rating) + '</span></div>' +
      '<div class="hd-card qd-metric qd-metric-wide"><span class="qd-label">Depth of thinking</span>' + bloomPyramidHtml(s.bloom) +
        (s.bloom ? '<p class="qd-hint">From remembering facts, up through explaining and using ideas, to connecting and judging them — Bloom’s Taxonomy. The filled bars show how high you reached.</p>' : '') +
      '</div>' +
      (q.weekCfg.buildPhoto
        ? '<div class="hd-card qd-metric qd-metric-wide"><span class="qd-label">Your build</span><img class="rep-build-photo" src="' + escapeHtml(q.weekCfg.buildPhoto) + '" alt="' + escapeHtml(roster.displayName + '’s build for ' + q.weekCfg.label) + '" loading="lazy"></div>'
        : '');
    app.appendChild(grid);
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
