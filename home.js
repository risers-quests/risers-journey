/* Risers Journey home — the one name-gate login for the whole portal
   (same KID_KEY dashboard/dashboard.js uses, so signing in here also signs
   in on My Quests and End of Term 2), then the kid's dashboard:

   - a greeting with overall term progress,
   - four at-a-glance stats,
   - "pick up where you left off" — the one next quest to work on,
   - every quest with its progress and a square per question (filled when
     that answer passed, half-filled when tried),
   - a to-do list for the End of Term 2 forms,
   - the learning areas still on the way.

   All numbers come from the same synced data and the same rules as My
   Quests and the staff pages (dashboard/quest-data.js), and nothing
   staff-private is read — this page is safe to share with families. */
(function () {
  var KID_KEY = 'imm-l3-kid';
  var QD = window.QUEST_DATA;

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

  function showGate(roster) {
    var app = document.getElementById('app');
    app.innerHTML = '';
    var gate = el('div', 'name-gate');
    gate.innerHTML =
      '<h1>Risers Journey</h1>' +
      '<p>Type your name to see your quests and your term.</p>' +
      '<input type="text" id="gate-name-input" placeholder="Your name" autocomplete="off">' +
      '<button type="button" class="btn btn-primary" id="gate-go-btn">Go &rarr;</button>' +
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
      // Reload so the app shell (navigation, profile) picks up the sign-in.
      location.reload();
    }
    document.getElementById('gate-go-btn').addEventListener('click', tryEnter);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryEnter(); });
    input.focus();
  }

  /* ---------- small view helpers ---------- */

  function greeting() {
    var h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }
  function todayLabel() {
    return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function questHref(weekCfg) {
    // roster paths are written relative to dashboard/; Home sits one level up.
    return weekCfg.path.replace(/^\.\.\//, '');
  }
  function splitLabel(label) {
    var parts = String(label).split(' · ');
    return { num: parts.length > 1 ? parts[0] : '', title: parts.length > 1 ? parts.slice(1).join(' · ') : label };
  }

  var STATUS = {
    'completed': { cls: 'hd-chip-done', text: 'Completed' },
    'in-progress': { cls: 'hd-chip-progress', text: 'In progress' },
    'not-started': { cls: 'hd-chip-new', text: 'Not started' },
    'unknown': { cls: 'hd-chip-new', text: 'Couldn’t load' }
  };
  function chip(status) {
    var s = STATUS[status];
    return '<span class="hd-chip ' + s.cls + '">' + s.text + '</span>';
  }

  function ring(pct, size, label) {
    var r = 42, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return '<div class="hd-ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true">' +
        '<circle cx="50" cy="50" r="' + r + '" class="hd-ring-track"/>' +
        '<circle cx="50" cy="50" r="' + r + '" class="hd-ring-fill" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg>' +
      '<div class="hd-ring-label"><strong>' + pct + '%</strong>' + (label ? '<span>' + label + '</span>' : '') + '</div>' +
    '</div>';
  }

  function squares(summary) {
    return '<div class="hd-squares" aria-label="' + summary.passed + ' of ' + summary.questionTotal + ' questions answered">' +
      summary.questions.map(function (q) {
        return '<span class="hd-sq hd-sq-' + q.status + '" title="' + escapeHtml(q.topic) + ' — ' +
          (q.status === 'done' ? 'answered' : q.status === 'tried' ? 'tried, not yet passed' : 'not yet') + '"></span>';
      }).join('') +
    '</div>';
  }

  var STAT_ICONS = {
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    brain: '<path d="M12 4v16M8 6a3 3 0 0 0-3 5 3 3 0 0 0 1 5 3 3 0 0 0 6 2M16 6a3 3 0 0 1 3 5 3 3 0 0 1-1 5 3 3 0 0 1-6 2M8 6a3 3 0 0 1 4-2 3 3 0 0 1 4 2"/>'
  };
  function stat(icon, tone, value, label, sub) {
    return '<div class="hd-stat hd-tone-' + tone + '">' +
      '<span class="hd-stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + STAT_ICONS[icon] + '</svg></span>' +
      '<div><div class="hd-stat-value">' + value + '</div><div class="hd-stat-label">' + label + '</div>' +
      (sub ? '<div class="hd-stat-sub">' + sub + '</div>' : '') + '</div>' +
    '</div>';
  }

  /* ---------- End of Term 2 to-do ---------- */

  function countAnswered(state) {
    if (!state) return 0;
    return Object.keys(state).filter(function (k) {
      var v = state[k];
      if (v && typeof v === 'object') return Object.keys(v).length > 0;
      return v !== undefined && v !== null && String(v).trim() !== '';
    }).length;
  }

  function loadEot2(kid) {
    function get(weekKey) {
      return window.eot2Fetch(kid.group, kid.slug, weekKey).then(function (data) {
        var remote = data && data.state;
        return remote || window.eot2LoadLocal(weekKey, kid.slug);
      });
    }
    return Promise.all([
      get('term2-self-assessment-self'),
      get('term2-term-reflection'),
      get('term2-mom')
    ]).then(function (r) {
      var saTotal = window.EOT2_RUBRIC_ITEM_COUNT;
      var trTotal = window.EOT2_REFLECTION_ITEM_COUNT(kid.ageBand);
      return [
        { title: 'Self-Assessment', desc: 'Rate yourself on planning, time, problem solving and more.',
          href: 'end-of-term-2/self-assessment/index.html', done: Math.min(countAnswered(r[0]), saTotal), total: saTotal },
        { title: 'Term Reflection', desc: 'How your workbooks, assessments and progress board went.',
          href: 'end-of-term-2/term-reflection/index.html', done: Math.min(countAnswered(r[1]), trTotal), total: trTotal },
        { title: 'Conference notes', desc: 'What came out of your parent conference.',
          href: 'end-of-term-2/mom/index.html', readOnly: true, ready: countAnswered(r[2]) > 0 }
      ];
    });
  }

  function todoHtml(items) {
    return items.map(function (t) {
      var status, pct;
      if (t.readOnly) {
        status = t.ready ? '<span class="hd-chip hd-chip-done">Ready to read</span>' : '<span class="hd-chip hd-chip-new">After your conference</span>';
        pct = null;
      } else {
        pct = t.total ? Math.round((t.done / t.total) * 100) : 0;
        status = t.done >= t.total ? '<span class="hd-chip hd-chip-done">Done</span>'
          : t.done > 0 ? '<span class="hd-chip hd-chip-progress">' + t.done + ' of ' + t.total + '</span>'
          : '<span class="hd-chip hd-chip-todo">To do</span>';
      }
      var done = t.readOnly ? t.ready : t.done >= t.total;
      return '<a class="hd-todo' + (done ? ' is-done' : '') + '" href="' + t.href + '">' +
        '<span class="hd-todo-check" aria-hidden="true"></span>' +
        '<span class="hd-todo-body"><span class="hd-todo-top"><strong>' + t.title + '</strong>' + status + '</span>' +
        '<span class="hd-todo-desc">' + t.desc + '</span>' +
        (pct !== null && pct > 0 && pct < 100 ? '<span class="hd-bar hd-bar-thin"><span style="width:' + pct + '%"></span></span>' : '') +
        '</span></a>';
    }).join('');
  }

  /* ---------- the dashboard ---------- */

  function renderHome(slug, kidEntry) {
    var app = document.getElementById('app');
    var kid = window.EOT2_findKid(slug) || { slug: slug, name: kidEntry.displayName, group: (kidEntry.weeks[0] || {}).group, ageBand: '8-10' };
    var groupNum = String(kid.group || '').replace(/^\D+0*/, '') || '0';
    app.innerHTML = '';

    var hero = el('section', 'hd-hero');
    hero.innerHTML =
      '<div class="hd-hero-text">' +
        '<p class="hd-eyebrow">' + todayLabel() + ' &middot; Term 2 &middot; Group ' + groupNum + '</p>' +
        '<h1>' + greeting() + ', ' + escapeHtml(kidEntry.displayName) + '</h1>' +
        '<p class="hd-hero-sub" id="hd-hero-sub">Loading your term…</p>' +
      '</div>' +
      '<div class="hd-hero-ring" id="hd-hero-ring">' + ring(0, 128, 'of Term 2') + '</div>';
    app.appendChild(hero);

    var stats = el('section', 'hd-stats', '<div class="hd-stat hd-skel"></div><div class="hd-stat hd-skel"></div><div class="hd-stat hd-skel"></div><div class="hd-stat hd-skel"></div>');
    app.appendChild(stats);

    var grid = el('div', 'hd-grid');
    var main = el('div', 'hd-col-main');
    var side = el('aside', 'hd-col-side');
    grid.appendChild(main);
    grid.appendChild(side);
    app.appendChild(grid);

    var continueCard = el('section', 'hd-card hd-continue', '<div class="hd-skel hd-skel-block"></div>');
    var questsCard = el('section', 'hd-card');
    questsCard.innerHTML =
      '<div class="hd-card-head"><h2>My quests</h2><a href="dashboard/index.html">Quest report &rarr;</a></div>' +
      '<div class="hd-quest-list" id="hd-quest-list"><div class="hd-skel hd-skel-row"></div><div class="hd-skel hd-skel-row"></div><div class="hd-skel hd-skel-row"></div></div>';
    main.appendChild(continueCard);
    main.appendChild(questsCard);

    var todoCard = el('section', 'hd-card');
    todoCard.innerHTML =
      '<div class="hd-card-head"><h2>End of Term 2</h2><a href="end-of-term-2/index.html">Open &rarr;</a></div>' +
      '<div class="hd-todo-list" id="hd-todo-list"><div class="hd-skel hd-skel-row"></div><div class="hd-skel hd-skel-row"></div></div>';
    side.appendChild(todoCard);

    var soonCard = el('section', 'hd-card hd-card-quiet');
    soonCard.innerHTML =
      '<div class="hd-card-head"><h2>Coming soon</h2></div>' +
      '<div class="hd-soon"><span class="hd-soon-ico hd-tone-slate">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/></svg></span>' +
        '<div><strong>Core Skills</strong><span>Subject-by-subject progress.</span></div></div>' +
      '<div class="hd-soon"><span class="hd-soon-ico hd-tone-rose">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></span>' +
        '<div><strong>SEL</strong><span>Social &amp; emotional growth notes.</span></div></div>';
    side.appendChild(soonCard);

    // ---- quests ----
    Promise.all(kidEntry.weeks.map(function (w) {
      return QD.fetchWeekState(w.group, slug, w.key).then(function (res) {
        return { weekCfg: w, ok: res.ok, updatedAt: res.updatedAt, summary: QD.summarizeWeek(w, res.state) };
      });
    })).then(function (quests) {
      var loaded = quests.filter(function (q) { return q.ok; });
      var anyError = loaded.length < quests.length;
      var completed = loaded.filter(function (q) { return q.summary.status === 'completed'; }).length;
      var termPct = quests.length ? Math.round(loaded.reduce(function (n, q) { return n + q.summary.pct; }, 0) / quests.length) : 0;
      var passed = loaded.reduce(function (n, q) { return n + q.summary.passed; }, 0);
      var qTotal = quests.reduce(function (n, q) { return n + q.summary.questionTotal; }, 0);
      var timeMs = loaded.reduce(function (n, q) { return n + q.summary.timeMs; }, 0);
      var topBloom = -1;
      loaded.forEach(function (q) {
        if (q.summary.bloom && q.summary.bloom.ceiling) topBloom = Math.max(topBloom, QD.BLOOM_LEVELS.indexOf(q.summary.bloom.ceiling));
      });

      document.getElementById('hd-hero-ring').innerHTML = ring(termPct, 128, 'of Term 2');
      var left = quests.length - completed;
      document.getElementById('hd-hero-sub').innerHTML = completed === quests.length && quests.length
        ? 'Every quest this term is complete — brilliant work. Your End of Term 2 forms are next.'
        : 'You’ve completed <strong>' + completed + ' of ' + quests.length + '</strong> quests. ' +
          (left === 1 ? 'Just one to go!' : left + ' to go — keep it up.');

      stats.innerHTML =
        stat('flag', 'green', completed + '<small>/' + quests.length + '</small>', 'Quests completed') +
        stat('check', 'slate', passed + '<small>/' + qTotal + '</small>', 'Questions answered') +
        stat('clock', 'amber', QD.fmtTime(timeMs), 'Time on quests') +
        stat('brain', 'violet', topBloom >= 0 ? QD.BLOOM_LEVELS[topBloom] : '—', 'Deepest thinking', topBloom >= 0 ? 'Bloom’s level reached' : 'Builds as you finish quests');

      if (anyError) {
        app.insertBefore(el('p', 'rep-load-warning',
          '⚠️ Some of your quest data couldn’t load just now — your work is safe, this is just a loading hiccup. Try refreshing the page.'), stats);
      }

      // Next quest: the furthest-along one still in progress, else the first not started.
      var next = loaded.filter(function (q) { return q.summary.status === 'in-progress'; })
        .sort(function (a, b) { return b.summary.pct - a.summary.pct; })[0] ||
        loaded.filter(function (q) { return q.summary.status === 'not-started'; })[0];
      if (next) {
        var lbl = splitLabel(next.weekCfg.label);
        continueCard.innerHTML =
          '<div class="hd-continue-body">' +
            '<p class="hd-eyebrow">' + (next.summary.status === 'in-progress' ? 'Pick up where you left off' : 'Up next') + '</p>' +
            '<h2>' + escapeHtml(lbl.title) + '</h2>' +
            '<p class="hd-continue-meta">' + escapeHtml(lbl.num) + ' &middot; ' + next.summary.passed + ' of ' + next.summary.questionTotal + ' questions' +
              (next.summary.buildTotal ? ' &middot; build ' + next.summary.buildDone + '/' + next.summary.buildTotal : '') + '</p>' +
            '<div class="hd-bar"><span style="width:' + next.summary.pct + '%"></span></div>' +
            '<a class="hd-btn" href="' + questHref(next.weekCfg) + '">' + (next.summary.status === 'in-progress' ? 'Continue quest' : 'Start quest') + ' &rarr;</a>' +
          '</div>' +
          '<div class="hd-continue-ring">' + ring(next.summary.pct, 112, 'done') + '</div>';
      } else {
        continueCard.classList.add('hd-continue-done');
        continueCard.innerHTML =
          '<div class="hd-continue-body">' +
            '<p class="hd-eyebrow">All caught up</p>' +
            '<h2>' + (loaded.length ? 'Every quest is complete' : 'Your quests will show here') + '</h2>' +
            '<p class="hd-continue-meta">' + (loaded.length ? 'See how deep your thinking went in each one.' : 'Try refreshing in a moment.') + '</p>' +
            (loaded.length ? '<a class="hd-btn" href="dashboard/index.html">See your quest report &rarr;</a>' : '') +
          '</div>' +
          '<div class="hd-continue-ring">' + ring(100, 112, 'done') + '</div>';
      }

      document.getElementById('hd-quest-list').innerHTML = quests.map(function (q) {
        var lbl = splitLabel(q.weekCfg.label);
        var s = q.summary;
        var status = q.ok ? s.status : 'unknown';
        return '<a class="hd-quest" href="' + questHref(q.weekCfg) + '">' +
          '<span class="hd-quest-num">' + escapeHtml(lbl.num.replace(/^Quest\s*/, '')) + '</span>' +
          '<span class="hd-quest-main">' +
            '<span class="hd-quest-top"><strong>' + escapeHtml(lbl.title) + '</strong>' + chip(status) + '</span>' +
            '<span class="hd-quest-meta">' +
              squares(s) +
              '<span class="hd-quest-facts">' + s.passed + '/' + s.questionTotal + ' answered' +
                (s.timeMs ? ' &middot; ' + QD.fmtTime(s.timeMs) : '') + '</span>' +
            '</span>' +
            '<span class="hd-bar hd-bar-thin"><span style="width:' + s.pct + '%"></span></span>' +
          '</span>' +
          '<span class="hd-quest-go" aria-hidden="true">&rarr;</span>' +
        '</a>';
      }).join('') +
      '<p class="hd-legend"><span class="hd-sq hd-sq-done"></span> answered <span class="hd-sq hd-sq-tried"></span> tried <span class="hd-sq hd-sq-todo"></span> not yet</p>';
    });

    // ---- End of Term 2 ----
    loadEot2(kid).then(function (items) {
      document.getElementById('hd-todo-list').innerHTML = todoHtml(items);
    });
  }

  function init() {
    var roster = window.DASHBOARD_ROSTER || {};
    var kid = null;
    try { kid = (localStorage.getItem(KID_KEY) || '').toLowerCase(); } catch (e) {}
    if (kid && roster[kid]) {
      renderHome(kid, roster[kid]);
    } else {
      showGate(roster);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
