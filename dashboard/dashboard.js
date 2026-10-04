/* My Quests — the kid-facing home page, one name-gate login (localStorage,
   same as before), same URL as always. Renders the End-of-Term Report
   style: only quests actually finished (state.completed === true), each
   with completion status, time taken, a Bloom's Taxonomy ceiling, a
   presentation rating, a build picture, and a link — plus three
   auto-drafted closing notes. Replaces the old per-week Strengths /
   Growth Areas / Learning Gaps template entirely; this is the only
   template the page shows now.

   Reads the same synced data the staff Feedback page uses, but never
   anything staff-private (no staff notes, no PINs) — this page, and its
   link, is safe to share with families.

   The three closing paragraphs are auto-drafted from the same
   underlying signals the staff Feedback page computes (Bloom's ceiling,
   genuine-pass rate), deliberately worded around the underlying skill
   rather than reading-quest mechanics ("questions," "-level thinking"
   as a label), so the same drafting logic keeps making sense once
   Term 3's fully different, hands-on build-and-make quests replace
   these — without revealing anything about what Term 3 actually is. */
(function () {
  var WORKER_URL = 'https://risers-term2-digital-quests-progress.highergrade.workers.dev';
  var SITE_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';
  var KID_KEY = 'imm-l3-kid';
  var BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate'];
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
  function fmtTime(ms) {
    if (!ms) return '0m';
    var mins = Math.round(ms / 60000);
    if (mins < 1) return '<1m';
    if (mins < 60) return mins + 'm';
    return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
  }

  // Same rule the staff Feedback page uses: a question counts as genuinely
  // understood if it passed on the kid's own merit, or a facilitator
  // granted a pass specifically because the reasoning was right (not just
  // "close enough, move on").
  function isGenuinePass(r) {
    if (!r) return false;
    if (r.success && !r.contentFlagged) return true;
    if (r.contentFlagged && r.passReasons && r.passReasons.length) {
      var reasons = r.passReasons;
      var logicRight = reasons.indexOf('Logic right') !== -1 || reasons.indexOf('Full pass — everything right') !== -1;
      var logicShaky = reasons.indexOf('Partially right') !== -1 || reasons.indexOf('Logic wrong') !== -1;
      return logicRight && !logicShaky;
    }
    return false;
  }

  // Returns { ok, state }. ok:false means the fetch itself failed or the
  // Worker rejected it — a real problem, NOT the same as ok:true/state:
  // null (Worker reached fine, kid just hasn't started/finished this
  // quest yet). Conflating those two silently hides real, already-done
  // work behind "not completed yet" — exactly the failure mode a kid's
  // sync can hit (see the Facilitator View / offline-push cases), so it
  // has to surface as a visible warning, not vanish quietly.
  function fetchWeekState(group, kid, week) {
    var url = WORKER_URL + '/sync?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(week);
    return fetch(url, { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); })
      .then(function (res) { return { ok: true, state: (res && res.found) ? res.data.state : null }; })
      .catch(function () { return { ok: false, state: null }; });
  }

  function fetchRating(group, kid, week) {
    var url = WORKER_URL + '/rating?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(week);
    return fetch(url, { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) { return (res && res.found) ? res.data : null; })
      .catch(function () { return null; });
  }

  function scoreBand(total, max) {
    var pct = total / max;
    if (pct >= 0.9) return 'Outstanding';
    if (pct >= 0.7) return 'Solid';
    if (pct >= 0.5) return 'Developing';
    return 'Needs support';
  }

  // Highest Bloom's level the kid has shown solid (>=60%) genuine mastery
  // of, among tagged questions for this quest — same threshold and same
  // "keep overwriting as you climb the ordered list" approach the staff
  // Feedback page uses, so a parent and a facilitator never see two
  // different answers to "how high did they reach" for the same kid.
  function bloomCeiling(bloomMap, reflect) {
    var counts = {};
    BLOOM_LEVELS.forEach(function (l) { counts[l] = { total: 0, hit: 0 }; });
    Object.keys(bloomMap).forEach(function (id) {
      var level = bloomMap[id];
      if (!counts[level]) return;
      counts[level].total++;
      if (isGenuinePass(reflect[id])) counts[level].hit++;
    });
    var ceiling = null;
    BLOOM_LEVELS.forEach(function (l) {
      if (counts[l].total && (counts[l].hit / counts[l].total) >= 0.6) ceiling = l;
    });
    return { counts: counts, ceiling: ceiling };
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

  function renderQuestColumn(q, displayName) {
    var col = el('div', 'rep-quest-col');
    col.appendChild(el('h3', null, q.weekCfg.label));

    var rows = [
      { label: 'Completion Status', html: '<span class="rep-badge rep-badge-done">✅ Completed</span>' },
      { label: 'Time Taken', html: fmtTime(q.timeMs) },
      { label: 'Bloom’s Taxonomy', html: bloomPyramidHtml(q.bloomInfo) },
      {
        label: 'Presentation',
        html: q.rating
          ? '<span class="rep-badge rep-badge-done">' + escapeHtml(scoreBand(
              Object.keys(q.rating.scores || {}).reduce(function (sum, k) { return sum + q.rating.scores[k]; }, 0),
              Object.keys(q.rating.scores || {}).length * 4 || 20
            )) + '</span>'
          : '<span class="rep-no-data">Not yet rated</span>'
      },
      {
        label: 'Build Picture',
        html: q.weekCfg.buildPhoto
          ? '<img class="rep-build-photo" src="' + escapeHtml(q.weekCfg.buildPhoto) + '" alt="' + escapeHtml(displayName + '’s build for ' + q.weekCfg.label) + '" loading="lazy">'
          : '<span class="rep-no-data">No picture yet</span>'
      },
      { label: 'Links', html: '<a class="rep-open-link" href="' + q.weekCfg.path + '">Open Quest →</a>' }
    ];

    rows.forEach(function (r) {
      var row = el('div', 'rep-row');
      row.appendChild(el('div', 'rep-row-label', r.label));
      row.appendChild(el('div', 'rep-row-value', r.html));
      col.appendChild(row);
    });

    return col;
  }

  function renderDashboard(kidKey, roster) {
    var app = document.getElementById('app');
    app.innerHTML = '';

    app.appendChild(el('div', 'dash-crumb', '<a href="../index.html">&larr; Home</a>'));

    var header = el('div', 'dash-header');
    header.innerHTML =
      '<a href="#" id="logout-link" class="switch-kid-link">Log out</a>' +
      '<h1>Hi, ' + escapeHtml(roster.displayName) + '! 👋</h1>' +
      '<p class="dash-sub">Here is your Term 2 Quests.</p>' +
      '<p class="rep-note">These quests are self-paced — there’s no single deadline for each one, you worked through them at your own speed between <strong>' + TERM_START + '</strong> and <strong>' + TERM_END + '</strong>.</p>';
    app.appendChild(header);

    document.getElementById('logout-link').addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(KID_KEY); } catch (err) {}
      init();
    });

    var loadingMsg = el('p', 'rep-loading', 'Loading your quests…');
    app.appendChild(loadingMsg);

    var loaders = roster.weeks.map(function (weekCfg) {
      return Promise.all([
        fetchWeekState(weekCfg.group, kidKey, weekCfg.key),
        fetchRating(weekCfg.group, kidKey, weekCfg.key)
      ]).then(function (results) {
        var syncResult = results[0];
        var rating = results[1];
        var state = syncResult.state;
        if (!syncResult.ok) return { loadError: true };
        if (!state || !state.completed) return null; // not actually finished — leave out entirely
        var reflect = state.reflect || {};
        var timeMs = Object.keys(state.dayTime || {}).reduce(function (sum, k) { return sum + (state.dayTime[k] || 0); }, 0);
        var bloomInfo = weekCfg.bloom ? bloomCeiling(weekCfg.bloom, reflect) : null;
        return { weekCfg: weekCfg, timeMs: timeMs, bloomInfo: bloomInfo, rating: rating };
      });
    });

    Promise.all(loaders).then(function (results) {
      loadingMsg.remove();
      var anyLoadError = results.some(function (r) { return r && r.loadError; });
      var quests = results.filter(function (r) { return r && !r.loadError; });

      if (anyLoadError) {
        app.appendChild(el('p', 'rep-load-warning',
          '⚠️ Some of your quest data couldn’t load just now — your work is safe, this is just a loading hiccup. Try refreshing the page.'));
      }

      if (!quests.length) {
        app.appendChild(el('p', 'rep-empty', 'No quests fully completed yet — check back once you finish your first one.'));
        return;
      }

      // Explained once, here, rather than repeated inside every quest
      // card — "Bloom's Taxonomy" and its five level names are real
      // educational vocabulary (a parent may already know it from a
      // school report card), so it stays on the label rather than being
      // hidden, but it isn't assumed knowledge either.
      var hasAnyBloom = quests.some(function (q) { return q.bloomInfo; });
      if (hasAnyBloom) {
        app.appendChild(el('div', 'rep-bloom-explainer',
          '🧠 <strong>About the pyramid below:</strong> it’s a quick snapshot of how deep the thinking went in each quest — ' +
          'from remembering facts, up through explaining and using ideas, to connecting and judging them (that’s what “Bloom’s Taxonomy” means). ' +
          'The filled-in bars show how high you reached.'));
      }

      var table = el('div', 'rep-table');
      quests.forEach(function (q) { table.appendChild(renderQuestColumn(q, roster.displayName)); });
      app.appendChild(table);

      var notes = draftClosingNotes(quests);
      var notesWrap = el('div', 'rep-notes');
      notesWrap.innerHTML =
        '<div class="rep-note-block"><h4>💪 What you did well</h4><p>' + notes.didWell + '</p></div>' +
        '<div class="rep-note-block"><h4>🌱 What you can do better</h4><p>' + notes.canImprove + '</p></div>' +
        '<div class="rep-note-block"><h4>🧭 What you can learn</h4><p>' + notes.canLearn + '</p></div>';
      app.appendChild(notesWrap);

      app.appendChild(el('p', 'rep-footer-note', 'Note: Term 3 Quests will be different.'));
    });
  }

  function showGate(roster) {
    var app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="../index.html">&larr; Home</a>'));
    var gate = el('div', 'name-gate');
    gate.innerHTML =
      '<h1>My Quests</h1>' +
      '<p>Type your name to see your quests.</p>' +
      '<input type="text" id="gate-name-input" placeholder="Your name" autocomplete="off">' +
      '<button type="button" class="btn btn-primary" id="gate-go-btn">Go →</button>' +
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
      renderDashboard(name, roster[name]);
    }
    document.getElementById('gate-go-btn').addEventListener('click', tryEnter);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryEnter(); });
    input.focus();
  }

  function init() {
    var roster = window.DASHBOARD_ROSTER || {};
    var kid = null;
    try { kid = (localStorage.getItem(KID_KEY) || '').toLowerCase(); } catch (e) {}
    if (kid && roster[kid]) {
      renderDashboard(kid, roster[kid]);
    } else {
      showGate(roster);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
