/* Term 3 Quests — a group's project board, run the scrum way but in words
   8–13 year olds use:

   - Board: Ideas list (the backlog) → To do this week → Doing → Done.
     Each card is one job: who's on it, how big it is (small / medium /
     big = 1 / 2 / 3 points), and a red flag when someone is stuck.
   - Weeks are sprints. Each week has a goal, and the bar shows how much of
     this week's work is done.
   - No fixed leader: each week the team chooses a team director, who
     starts things off and looks after the team that week. The turn goes
     round so everyone has a go.
   - Stand-up: every day, at the start of the session, every Riser answers
     three questions (what I did, what I'll do, is anything in my way). The
     team director runs it and types it in.
   - Blockers: anything in the team's way. Anyone can flag one; a stand-up
     answer about being stuck flags one by itself, and so does a job marked
     stuck. They stay on the board until someone marks them solved.
   - Check-in: once a week, at the end of the week, with a facilitator —
     what we finished, blockers, keep doing, change, shout-outs, and next
     week's goal.

   One shared board per group, saved through the progress Worker under
   group "term-3", kid = the group id, week "board". Every card, stand-up
   and check-in carries the time it last changed (u); saving fetches the
   latest copy and keeps the newer version of each, so two Risers working
   at once don't wipe each other's changes. Deleted cards are kept as
   { deleted: true } so the deletion wins too. The board refreshes from
   other devices every 15 seconds.

   The group's project lives in the same record: meta.project (an id from
   build-pool.js), meta.started (the day it was chosen) and meta.role_<Kid>
   (each Riser's role), meta.director<week> (that week's team director),
   and the blockers map. A group chooses only from the levels set for it in
   quest-data.js and never sees the levels; more than one group can choose
   the same project. Weeks are the school weeks of Term 3. */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  var Q = window.T3Q;
  var GROUPS = Q.GROUPS;
  var POOL = window.T3_POOL || [];
  function project(id) { return POOL.filter(function (b) { return b.id === id; })[0] || null; }
  var COLS = [
    { id: 'backlog', name: 'Ideas list', hint: 'Every job the build needs. Add as many as you can think of.' },
    { id: 'todo', name: 'To do this week', hint: 'Jobs we picked for this week.' },
    { id: 'doing', name: 'Doing', hint: 'One job each at a time.' },
    { id: 'done', name: 'Done', hint: 'Finished this week.' }
  ];
  var SIZES = [{ v: 1, name: 'Small' }, { v: 2, name: 'Medium' }, { v: 3, name: 'Big' }];
  var WEEKS = Q.WEEKS.map(function (w, i) { return i + 1; });
  var MAPS = ['meta', 'cards', 'standups', 'checkins', 'blockers'];

  // A Riser (term-3/quest/index.html sets PB_KID_MODE) sees only their own
  // group; staff pick any.
  var KID = !!window.PB_KID_MODE;
  var group;
  if (KID) {
    var me = null;
    try { me = (localStorage.getItem('imm-l3-kid') || '').toLowerCase(); } catch (e) {}
    group = Q.groupOf(me);
    if (!group) { location.replace('../index.html'); return; }
    var ME = group.kids.filter(function (k) { return k.toLowerCase() === me; })[0] || '';
  } else {
    group = GROUPS.filter(function (g) { return g.id === params.get('group'); })[0] || GROUPS[0];
    // Staff land on the overview of every group unless a group is chosen.
    var OVERVIEW = !params.get('group');
  }
  var tab = params.get('tab') || '';
  var state = blank();
  var loaded = false, saving = false, dirty = false, saveTimer = null;

  function blank() { return { meta: {}, cards: {}, standups: {}, checkins: {}, blockers: {} }; }
  function now() { return Date.now(); }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function niceDate(key) {
    var p = key.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
  }
  function initial(name) { return name.charAt(0); }
  function kidIndex(name) { return group.kids.indexOf(name); }

  /* ---------- data ---------- */

  function meta(key, fallback) { var m = state.meta[key]; return m && m.v !== undefined ? m.v : fallback; }
  function setMeta(key, v) { state.meta[key] = { v: v, u: now() }; changed(); }
  function sprint() { return meta('sprint', Q.weekOf()); }
  function director(w) { return meta('director' + (w || sprint()), ''); }
  // Who hasn't been team director yet this term (everyone, once all have).
  function notYet() {
    var had = {};
    WEEKS.forEach(function (n) { var d = meta('director' + n, ''); if (d) had[d] = 1; });
    var left = group.kids.filter(function (k) { return !had[k]; });
    return left.length ? left : group.kids.slice();
  }
  function cards() {
    return Object.keys(state.cards).map(function (id) { return Object.assign({ id: id }, state.cards[id]); })
      .filter(function (c) { return !c.deleted; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function inCol(col) {
    return cards().filter(function (c) {
      if (c.col !== col) return false;
      return col !== 'done' || c.doneWeek === sprint();
    });
  }
  function putCard(id, fields) {
    state.cards[id] = Object.assign({}, state.cards[id] || {}, fields, { u: now() });
    changed();
  }

  // Keep the newer copy of every item from both sides.
  function merge(a, b) {
    var out = blank();
    MAPS.forEach(function (m) {
      var x = (a && a[m]) || {}, y = (b && b[m]) || {};
      Object.keys(x).concat(Object.keys(y)).forEach(function (k) {
        var p = x[k], q = y[k];
        out[m][k] = !p ? q : !q ? p : ((q.u || 0) > (p.u || 0) ? q : p);
      });
    });
    // A cleared board (staff Try-out page) drops everything older than the
    // clear, so a device that still had the old board can't bring it back.
    var reset = out.meta._reset ? out.meta._reset.v : 0;
    if (reset) MAPS.forEach(function (m) {
      Object.keys(out[m]).forEach(function (k) { if (k !== '_reset' && (out[m][k].u || 0) < reset) delete out[m][k]; });
    });
    return out;
  }

  function setStatus(text, cls) {
    var s = document.querySelector('.pb-status');
    if (s) { s.textContent = text; s.className = 'pb-status ' + (cls || ''); }
  }
  function changed() {
    dirty = true;
    setStatus('Saving…');
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 700);
  }
  function save() {
    if (saving) { saveTimer = setTimeout(save, 400); return; }
    saving = true;
    var mine = state;
    window.eot2Fetch('term-3', group.id, 'board').then(function (d) {
      var merged = merge(d && d.state, mine);
      return window.eot2Save('term-3', group.id, 'board', merged).then(function (res) {
        saving = false;
        if (!res.ok) { setStatus('Not saved — check the connection', 'is-bad'); return; }
        state = merge(merged, state);   // keep anything typed while saving
        dirty = false;
        setStatus('Saved', 'is-ok');
      });
    }).catch(function () { saving = false; setStatus('Not saved — check the connection', 'is-bad'); });
  }
  function load() {
    return window.eot2Fetch('term-3', group.id, 'board').then(function (d) {
      var remote = d && d.state;
      state = merge(remote || blank(), state);
      loaded = true;
    });
  }
  // Pick up other devices' changes, unless someone here is mid-typing.
  setInterval(function () {
    if (!loaded || dirty || saving || document.hidden || (!KID && OVERVIEW)) return;
    var a = document.activeElement;
    if (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return;
    window.eot2Fetch('term-3', group.id, 'board').then(function (d) {
      if (!d || !d.state || dirty) return;
      var before = JSON.stringify(state);
      state = merge(d.state, state);
      if (JSON.stringify(state) !== before) draw();
    });
  }, 15000);

  /* ---------- page ---------- */

  function render() {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', KID ? '<a href="../index.html">&larr; Term 3</a>' : '<a href="quests.html">&larr; Term 3 Quests</a>'));
    app.appendChild(el('header', 'hd-page-head pb-head',
      '<div><p class="hd-eyebrow">Term 3 Quest' + (KID ? ' &middot; ' + group.name + ': ' + group.kids.join(', ') : 's') + '</p><h1>' + (KID ? 'Our quest' : 'Project boards') + '</h1>' +
      '<p>Choose a project, plan it, build it in weekly sprints, and check in every week.</p></div>' +
      '<span class="pb-status">Loading…</span>'));
    var picker = el('div', 'pb-groups');
    var all = el('a', 'pb-group pb-group-all' + (!KID && OVERVIEW ? ' is-on' : ''), '<strong>All groups</strong><span>Overview</span>');
    all.href = '?';
    picker.appendChild(all);
    GROUPS.forEach(function (g) {
      var a = el('a', 'pb-group' + (!OVERVIEW && g.id === group.id ? ' is-on' : ''), '<strong>' + g.name + '</strong><span>' + g.kids.join(', ') + '</span>');
      a.href = '?group=' + g.id + '&tab=' + tab;
      picker.appendChild(a);
    });
    if (!KID) app.appendChild(picker);
    var main = el('div', 'pb-main');
    app.appendChild(main);
    if (!KID && OVERVIEW) { overview(main); return; }
    load().then(function () { setStatus(dirty ? 'Saving…' : 'Saved', dirty ? '' : 'is-ok'); draw(); });
  }

  function draw() {
    var main = app.querySelector('.pb-main');
    if (!main) return;
    var y = window.scrollY;
    main.innerHTML = '';
    if (!tab) tab = meta('project') ? 'board' : 'project';
    if (meta('project')) main.appendChild(topBar());
    var tabs = el('div', 'pb-tabs');
    var nb = openBlockers().length;
    [['project', meta('project') ? 'Our project' : 'Choose our project'], ['board', 'Board' + (nb ? ' <span class="pb-tab-flag">🚧 ' + nb + '</span>' : '')], ['standup', 'Daily stand-up'], ['checkin', 'Weekly check-in']].forEach(function (t) {
      var b = el('button', 'pb-tab' + (tab === t[0] ? ' is-on' : ''), t[1]);
      b.type = 'button';
      b.addEventListener('click', function () {
        tab = t[0];
        history.replaceState(null, '', KID ? '?tab=' + tab : '?group=' + group.id + '&tab=' + tab);
        draw();
      });
      tabs.appendChild(b);
    });
    main.appendChild(tabs);
    main.appendChild(tab === 'project' ? projectView() : tab === 'standup' ? standupView() : tab === 'checkin' ? checkinView() : boardView());
    window.scrollTo(0, y);
  }

  // Project, this week's team director, the week, its goal and how much is done.
  function topBar() {
    var bar = el('div', 'pb-top');
    var w = sprint();
    var todo = inCol('todo').concat(inCol('doing'));
    var done = inCol('done');
    var pts = function (l) { return l.reduce(function (s, c) { return s + (c.size || 1); }, 0); };
    var total = pts(todo) + pts(done), got = pts(done);
    bar.innerHTML =
      '<div class="pb-top-row">' +
        '<div class="pb-field pb-build"><span>Our project</span><strong>' + esc(projectTitle()) + '</strong>' + (deadline() ? '<em>Expected by ' + Q.nice(deadline().date) + '</em>' : '') + '</div>' +
        '<label class="pb-field"><span>Team director, week ' + w + '</span><select class="pb-director"><option value="">Choose…</option>' +
          group.kids.map(function (k) { return '<option' + (director(w) === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>' +
          (director(w) ? '' : '<em>Not had a turn yet: ' + notYet().map(esc).join(', ') + '</em>') + '</label>' +
        '<div class="pb-field"><span>Week</span><div class="pb-weeks">' + WEEKS.map(function (n) {
          return '<button type="button" class="pb-week' + (n === w ? ' is-on' : '') + (n === Q.weekOf() ? ' is-now' : '') + '" data-w="' + n + '" title="' + Q.nice(Q.WEEKS[n - 1][0]) + ' – ' + Q.nice(Q.WEEKS[n - 1][1]) + '">' + n + '</button>';
        }).join('') + '</div></div>' +
      '</div>' +
      '<p class="pb-dir-note">' + (director(w) ? '<b>' + esc(director(w)) + '</b> is team director this week: ' : 'Choose a team director for this week. The team director ') +
        'starts the daily stand-up, keeps the board up to date, makes sure blockers get flagged and solved, and leads the weekly check-in.</p>' +
      '<label class="pb-field pb-goal"><span>Week ' + w + ' goal</span><input type="text" value="' + esc(meta('goal' + w, '')) + '" placeholder="By the end of this week we will…"></label>' +
      '<div class="pb-progress"><div class="pb-track"><span style="width:' + (total ? Math.round(got / total * 100) : 0) + '%"></span></div>' +
        '<span>' + (total ? got + ' of ' + total + ' points done this week' : 'Pick jobs for this week to get started') + '</span></div>';
    bar.querySelector('.pb-goal input').addEventListener('change', function () { setMeta('goal' + w, this.value.trim()); });
    bar.querySelector('.pb-director').addEventListener('change', function () { setMeta('director' + w, this.value); draw(); });
    Array.prototype.forEach.call(bar.querySelectorAll('.pb-week'), function (b) {
      b.addEventListener('click', function () { setMeta('sprint', +b.dataset.w); draw(); });
    });
    return bar;
  }

  /* ---------- the project ---------- */

  function projectTitle(id, fallback) {
    var b = project(id === undefined ? meta('project') : id);
    return b ? b.title : fallback || '';
  }
  function deadline(id, started) {
    var b = project(id === undefined ? meta('project') : id);
    started = started === undefined ? meta('started') : started;
    return b && started ? Q.deadline(started, Q.weeksFor(b)) : null;
  }
  var changing = false;

  function projectView() {
    var b = project(meta('project'));
    return b && !changing ? chosenView(b) : chooserView(b);
  }

  function detailHtml(b) {
    var c = Q.CATS[b.cat];
    return '<p class="pq-what">' + esc(b.what) + '</p>' +
      '<p><b>' + c.hookLbl + ':</b> ' + esc(b.hook) + '</p>' +
      '<p><b>You’ll make:</b> ' + esc(b.make) + '</p>' +
      '<p class="pq-learn"><b>Learning:</b> ' + esc(b.learn) + '<br><b>Learning outcome:</b> ' + esc(b.lo) + '</p>';
  }

  // The week-by-week plan and every role's jobs, folded away on a project card.
  function planPeek(b) {
    var roles = Q.ROLES[b.cat];
    return '<details class="pq-peek"><summary>See the plan: ' + b.plan.length + ' weeks, a job for each of you every day</summary><ol>' +
      b.plan.map(function (w) {
        return '<li><b>' + esc(w.t) + '</b><ul>' + roles.map(function (r, j) {
          return '<li>' + r.icon + ' ' + esc(r.name) + ': ' + w.j[j].map(esc).join(' · ') + '</li>';
        }).join('') + '</ul></li>';
      }).join('') + '</ol></details>';
  }

  function chooserView(current) {
    var wrap = el('div', 'pq');
    var levels = Q.LEVELS[group.id] || [1, 2, 3];
    wrap.appendChild(el('p', 'pq-intro', current
      ? 'Choose a different project, or keep <b>' + esc(current.title) + '</b>.'
      : 'Choose one project for your group. Talk about it together first. Other groups might choose the same one, and that’s fine.'));
    if (current) {
      var keep = el('button', 'pq-btn pq-btn-ghost', 'Keep ' + esc(current.title));
      keep.type = 'button';
      keep.addEventListener('click', function () { changing = false; draw(); });
      wrap.appendChild(keep);
    }
    ['sol', 'sci'].forEach(function (cat) {
      var c = Q.CATS[cat];
      var list = POOL.filter(function (b) { return b.cat === cat && levels.indexOf(b.level) !== -1; })
        .sort(function (x, y) { return x.title.localeCompare(y.title); });
      wrap.appendChild(el('h2', 'pq-cat pq-cat-' + cat, esc(c.name)));
      wrap.appendChild(el('p', 'pq-catnote', esc(c.note)));
      var grid = el('div', 'pq-grid');
      list.forEach(function (b) {
        var due = Q.deadline(today(), Q.weeksFor(b));
        var card = el('article', 'pq-card pq-' + cat + (current && current.id === b.id ? ' is-current' : ''),
          (KID ? '' : '<span class="pq-level">Level ' + b.level + '</span>') +
          '<h3>' + esc(b.title) + '</h3>' + detailHtml(b) +
          '<p class="pq-time">About ' + Q.weeksFor(b) + ' weeks · ready by ' + Q.nice(due.date) + (due.short ? ' (when the term ends)' : '') + '</p>' +
          planPeek(b));
        var go = el('button', 'pq-btn', current && current.id === b.id ? 'Our project now' : 'Choose this project');
        go.type = 'button';
        go.disabled = !!(current && current.id === b.id);
        go.addEventListener('click', function () {
          if (!confirm('Choose “' + b.title + '” for ' + group.name + '? Everyone in your group will see it.')) return;
          setMeta('project', b.id);
          setMeta('started', today());
          changing = false;
          tab = 'project';
          draw();
          window.scrollTo(0, 0);
        });
        card.appendChild(go);
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
    });
    return wrap;
  }

  function chosenView(b) {
    var wrap = el('div', 'pq');
    var c = Q.CATS[b.cat], due = deadline();
    var head = el('article', 'pq-card pq-chosen pq-' + b.cat,
      '<p class="pq-kind">' + esc(c.name) + (KID ? '' : ' · Level ' + b.level) + '</p><h2>' + esc(b.title) + '</h2>' + detailHtml(b) +
      '<div class="pq-dates"><span><small>Started</small>' + Q.nice(meta('started')) + '</span>' +
      '<span><small>Expected deadline</small><b>' + Q.nice(due.date) + '</b></span>' +
      '<span><small>Time</small>About ' + Q.weeksFor(b) + ' weeks' + (due.short ? ', to the end of term' : '') + '</span></div>');
    wrap.appendChild(head);

    // When we work on it.
    var t = Q.TIMES[group.id];
    wrap.appendChild(el('section', 'pq-sec', '<h3>When we work on it</h3>' +
      '<p class="pq-sub">In Negotiable Time, Monday to Wednesday.</p>' +
      '<div class="pq-times">' +
        '<div><b>Monday</b><span>' + t.mon + '</span><em>Together as a group</em></div>' +
        '<div><b>Tuesday</b>' + group.kids.map(function (k) { return '<span>' + esc(k) + ': ' + t.tue[k] + '</span>'; }).join('') + '<em>On your own</em></div>' +
        '<div><b>Wednesday</b><span>' + t.wed + '</span><em>Together as a group</em></div>' +
      '</div>'));

    // Roles.
    var roles = Q.ROLES[b.cat];
    var sec = el('section', 'pq-sec', '<h3>Roles</h3><p class="pq-sub">Each person picks one role. Everyone still helps with everything.</p>');
    var rgrid = el('div', 'pq-roles');
    roles.forEach(function (r, i) {
      var who = group.kids.filter(function (k) { return meta('role_' + k) === i; });
      rgrid.appendChild(el('div', 'pq-role', '<h4>' + r.icon + ' ' + esc(r.name) + '</h4><ul>' + r.duties.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
        '<p class="pq-holder' + (who.length ? '' : ' is-none') + '">' + (who.length ? who.map(esc).join(' and ') : 'Not picked yet') + '</p>'));
    });
    sec.appendChild(rgrid);
    group.kids.forEach(function (k) {
      var row = el('div', 'pq-pick', '<span>' + esc(k) + '</span>');
      roles.forEach(function (r, i) {
        var bt = el('button', 'pq-seg' + (meta('role_' + k) === i ? ' is-on' : ''), esc(r.name));
        bt.type = 'button';
        bt.disabled = KID && k !== ME;
        bt.addEventListener('click', function () { setMeta('role_' + k, meta('role_' + k) === i ? null : i); draw(); });
        row.appendChild(bt);
      });
      sec.appendChild(row);
    });
    wrap.appendChild(sec);

    wrap.appendChild(planEl(b));

    var change = el('button', 'pq-btn pq-btn-ghost', 'Change our project');
    change.type = 'button';
    change.addEventListener('click', function () { changing = true; draw(); });
    wrap.appendChild(change);
    return wrap;
  }

  // The project week by week: the school week it falls in, and each role's
  // job for Monday (together), Tuesday (on their own) and Wednesday
  // (together). Everyone has a job every session, so the work is fair.
  var DAYS = ['Monday', 'Tuesday', 'Wednesday'];
  function planEl(b) {
    var roles = Q.ROLES[b.cat], weeks = Q.planWeeks(b, meta('started')), nowWk = Q.weekOf();
    var sec = el('section', 'pq-sec', '<h3>Our plan, week by week</h3>' +
      '<p class="pq-sub">Every role has a job every day, about the same size, so everyone is busy and the work is shared fairly. ' +
      'Monday and Wednesday you work together; Tuesday, you do your own job.</p>');
    b.plan.forEach(function (wk, i) {
      var sw = weeks[i], here = sw === nowWk, past = sw < nowWk;
      var box = el('details', 'pq-stage' + (here ? ' is-now' : '') + (past ? ' is-past' : ''));
      if (here || (i === 0 && nowWk < sw)) box.open = true;
      box.innerHTML = '<summary class="pq-stage-head"><b>Week ' + (i + 1) + ': ' + esc(wk.t) + '</b><span>' + Q.weekLabel(sw) + (here ? ' · this week' : '') + '</span></summary>' +
        '<div class="pq-week">' + roles.map(function (role, j) {
          var who = group.kids.filter(function (k) { return meta('role_' + k) === j; });
          return '<div class="pq-week-row"><span class="pq-stage-role">' + role.icon + ' ' + esc(role.name) + (who.length ? ' · ' + who.map(esc).join(', ') : '') + '</span>' +
            wk.j[j].map(function (job, d) { return '<span class="pq-day"><small>' + DAYS[d] + (d === 1 ? ' · on my own' : '') + '</small>' + esc(job) + '</span>'; }).join('') + '</div>';
        }).join('') + '</div>';
      var key = 'staged_' + b.id + '_w' + i;
      var add = el('button', 'pq-seg', meta(key) ? '✓ On our board' : 'Put this week’s jobs on our board');
      add.type = 'button';
      add.disabled = !!meta(key);
      add.addEventListener('click', function () {
        roles.forEach(function (role, j) {
          var who = group.kids.filter(function (k) { return meta('role_' + k) === j; });
          wk.j[j].forEach(function (job, d) {
            putCard(uid(), { title: DAYS[d].slice(0, 3) + ': ' + job, col: 'todo', size: 1, who: who, order: now() + d * 10 + j, by: KID ? ME : 'facilitator' });
          });
        });
        setMeta(key, true);
        if (sw > sprint()) setMeta('sprint', sw);
        tab = 'board';
        draw();
      });
      box.querySelector('.pq-week').appendChild(add);
      sec.appendChild(box);
    });
    return sec;
  }

  /* ---------- blockers ---------- */

  var BLOCK_TYPES = [
    { id: 'things', name: 'We need things' },
    { id: 'how', name: 'We don’t know how' },
    { id: 'team', name: 'Team trouble' },
    { id: 'time', name: 'Not enough time' },
    { id: 'idea', name: 'We need an idea' },
    { id: 'other', name: 'Something else' }
  ];
  function typeName(id) { return (BLOCK_TYPES.filter(function (t) { return t.id === id; })[0] || BLOCK_TYPES[5]).name; }
  // "No", "nothing", "none" and the like aren't blockers.
  function saysNo(t) { return /^\s*(no+|nope|none|nothing|nah|not really|no one|nil|-+|n\/a)\s*[.!]*\s*$/i.test(t || ''); }

  // Every open blocker: flagged ones and stuck jobs, oldest first.
  function openBlockers() {
    var list = Object.keys(state.blockers).map(function (id) { return Object.assign({ id: id }, state.blockers[id]); })
      .filter(function (x) { return !x.deleted && !x.solved && x.what; });
    cards().filter(function (c) { return c.stuck && c.col !== 'done'; }).forEach(function (c) {
      list.push({ id: 'card_' + c.id, card: c.id, what: c.title + (c.stuckNote ? ': ' + c.stuckNote : ''), type: 'other', who: c.who || [], at: c.u, from: 'card' });
    });
    return list.sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
  }
  function putBlocker(id, fields) {
    state.blockers[id] = Object.assign({}, state.blockers[id] || {}, fields, { u: now() });
    changed();
  }
  function solve(x, how) {
    if (x.card) putCard(x.card, { stuck: false, stuckNote: '' });
    else putBlocker(x.id, { solved: true, how: how || '', solvedBy: KID ? ME : 'facilitator', solvedAt: now() });
    draw();
  }

  function blockersEl() {
    var list = openBlockers();
    var wrap = el('section', 'pb-blockers' + (list.length ? ' has-open' : ''),
      '<div class="pb-bl-head"><h2>🚧 Blockers <em>' + list.length + '</em></h2><p>Anything in the way of our work. Flag it as soon as it happens, so we can get help and keep going.</p></div>');
    list.forEach(function (x) {
      var row = el('div', 'pb-bl');
      row.innerHTML = '<div class="pb-bl-main"><span class="pb-bl-type">' + (x.from === 'card' ? '🚩 Stuck job' : esc(typeName(x.type))) + '</span>' +
        '<strong>' + esc(x.what) + '</strong>' +
        '<small>' + ((x.who || []).length ? x.who.map(esc).join(', ') + ' · ' : '') + (x.at ? niceDate(Q.iso(new Date(x.at))) : '') +
        (x.from === 'standup' ? ' · from the stand-up' : '') + (x.help ? ' · Help from: ' + esc(x.help) : '') + '</small></div>' +
        '<div class="pb-bl-solve"><input type="text" placeholder="How did we solve it?" aria-label="How did we solve it?"><button type="button" class="pq-seg">✓ Solved</button></div>';
      row.querySelector('button').addEventListener('click', function () { solve(x, row.querySelector('input').value.trim()); });
      wrap.appendChild(row);
    });
    if (!list.length) wrap.appendChild(el('p', 'pb-empty', 'Nothing in our way right now.'));

    var f = el('form', 'pb-bl-form');
    f.innerHTML = '<input type="text" class="pb-bl-what" placeholder="What’s in our way?" aria-label="What’s in our way?">' +
      '<select class="pb-bl-kind" aria-label="What kind of blocker">' + BLOCK_TYPES.map(function (t) { return '<option value="' + t.id + '">' + t.name + '</option>'; }).join('') + '</select>' +
      '<input type="text" class="pb-bl-help" placeholder="Who could help? (optional)" aria-label="Who could help?">' +
      '<button type="submit" class="pb-add-btn">Flag it</button>';
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var what = f.querySelector('.pb-bl-what').value.trim();
      if (!what) { f.querySelector('.pb-bl-what').focus(); return; }
      putBlocker(uid(), { what: what, type: f.querySelector('.pb-bl-kind').value, help: f.querySelector('.pb-bl-help').value.trim(),
        who: KID ? [ME] : [], by: KID ? ME : 'facilitator', at: now(), week: sprint(), from: 'form' });
      draw();
    });
    wrap.appendChild(f);

    var solved = Object.keys(state.blockers).map(function (id) { return state.blockers[id]; })
      .filter(function (x) { return x && x.solved && !x.deleted && x.what; })
      .sort(function (a, b) { return (b.solvedAt || 0) - (a.solvedAt || 0); });
    if (solved.length) wrap.appendChild(el('details', 'pb-bl-done', '<summary>Solved (' + solved.length + ')</summary><ul>' + solved.map(function (x) {
      return '<li><b>' + esc(x.what) + '</b>' + (x.how ? ' — ' + esc(x.how) : '') + '</li>';
    }).join('') + '</ul>'));
    return wrap;
  }

  // Points of finished jobs for each Riser, this week and overall, so the
  // group can see the work is shared fairly.
  function fairShare() {
    var all = cards();
    var rows = group.kids.map(function (k) {
      var mine = all.filter(function (c) { return c.col === 'done' && (c.who || []).indexOf(k) !== -1; });
      var pts = function (l) { return l.reduce(function (n, c) { return n + (c.size || 1); }, 0); };
      return { k: k, week: pts(mine.filter(function (c) { return c.doneWeek === sprint(); })), all: pts(mine) };
    });
    var max = Math.max.apply(null, rows.map(function (r) { return r.all; }).concat([1]));
    var low = rows.filter(function (r) { return r.all < max / 2; }).map(function (r) { return r.k; });
    return el('div', 'pb-fair', '<span class="pb-fair-title">Fair share <em>points of finished jobs</em></span>' +
      rows.map(function (r) {
        return '<span class="pb-fair-row"><span class="pb-av pb-av-' + kidIndex(r.k) + '">' + esc(initial(r.k)) + '</span>' + esc(r.k) +
          '<i><b style="width:' + Math.round(r.all / max * 100) + '%"></b></i><em>' + r.week + ' this week · ' + r.all + ' in all</em></span>';
      }).join('') +
      (max >= 4 && low.length ? '<span class="pb-fair-note">' + low.map(esc).join(' and ') + ': take on the next jobs, so the work stays fair.</span>' : ''));
  }

  /* ---------- board ---------- */

  function who(c) {
    return (c.who || []).map(function (k) {
      return '<span class="pb-av pb-av-' + kidIndex(k) + '" title="' + esc(k) + '">' + esc(initial(k)) + '</span>';
    }).join('');
  }
  function sizeDots(c) {
    var n = c.size || 1;
    return '<span class="pb-size" title="' + SIZES[n - 1].name + '">' + '●'.repeat(n) + '<i>' + '●'.repeat(3 - n) + '</i></span>';
  }

  function boardView() {
    var outer = el('div');
    outer.appendChild(blockersEl());
    outer.appendChild(fairShare());
    var wrap = el('div', 'pb-board');
    outer.appendChild(wrap);
    var doingCount = {};
    inCol('doing').forEach(function (c) { (c.who || []).forEach(function (k) { doingCount[k] = (doingCount[k] || 0) + 1; }); });
    var busy = Object.keys(doingCount).filter(function (k) { return doingCount[k] > 1; });

    COLS.forEach(function (col, ci) {
      var list = inCol(col.id);
      var c = el('section', 'pb-col pb-col-' + col.id);
      c.appendChild(el('div', 'pb-col-head', '<h2>' + col.name + ' <em>' + list.length + '</em></h2><p>' + col.hint + '</p>'));
      if (col.id === 'doing' && busy.length) {
        c.appendChild(el('p', 'pb-warn', busy.join(' and ') + (busy.length > 1 ? ' have' : ' has') + ' more than one job going. Finish one first.'));
      }
      if (col.id === 'backlog') c.appendChild(addForm());
      list.forEach(function (card) {
        var k = el('article', 'pb-card' + (card.stuck ? ' is-stuck' : ''));
        k.innerHTML =
          '<button type="button" class="pb-card-main">' +
          (card.by ? '<span class="pb-by">' + (card.by === 'facilitator' ? 'Facilitator' : esc(card.by)) + '</span>' : '') +
          '<span class="pb-card-title">' + (card.stuck ? '🚩 ' : '') + esc(card.title) + '</span>' +
          '<span class="pb-card-meta">' + sizeDots(card) + '<span class="pb-avs">' + who(card) + '</span></span>' +
          (card.stuck && card.stuckNote ? '<span class="pb-stuck-note">Stuck: ' + esc(card.stuckNote) + '</span>' : '') +
          '</button>' +
          '<div class="pb-moves">' +
            (ci > 0 ? '<button type="button" class="pb-move" data-d="-1" aria-label="Move back">&larr;</button>' : '<span></span>') +
            (ci < COLS.length - 1 ? '<button type="button" class="pb-move" data-d="1" aria-label="Move on">' + (ci === 0 ? 'This week' : ci === 1 ? 'Start' : 'Done') + ' &rarr;</button>' : '') +
          '</div>';
        k.querySelector('.pb-card-main').addEventListener('click', function () { editCard(card); });
        Array.prototype.forEach.call(k.querySelectorAll('.pb-move'), function (b) {
          b.addEventListener('click', function () { moveCard(card, +b.dataset.d); });
        });
        c.appendChild(k);
      });
      if (!list.length && col.id !== 'backlog') c.appendChild(el('p', 'pb-empty', col.id === 'todo' ? 'Move jobs here from the Ideas list.' : col.id === 'doing' ? 'Nothing being worked on.' : 'Nothing finished yet this week.'));
      wrap.appendChild(c);
    });
    return outer;
  }

  function moveCard(card, d) {
    var i = COLS.map(function (c) { return c.id; }).indexOf(card.col) + d;
    var to = COLS[i].id;
    var f = { col: to, order: now() };
    if (to === 'done') f.doneWeek = sprint();
    if (to === 'done') f.stuck = false;
    putCard(card.id, f);
    draw();
  }

  function addForm() {
    var f = el('form', 'pb-add');
    f.innerHTML = '<input type="text" placeholder="Add a job, like “Cut the ramps”" aria-label="New job">' +
      '<button type="submit" class="pb-add-btn">Add</button>';
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = f.querySelector('input').value.trim();
      if (!t) return;
      // Tag the job with whoever added it.
      putCard(uid(), { title: t, col: 'backlog', size: 1, who: [], order: now(), by: KID ? ME : 'facilitator' });
      draw();
      var again = app.querySelector('.pb-add input');
      if (again) again.focus();
    });
    return f;
  }

  function editCard(card) {
    var c = Object.assign({}, card, { who: (card.who || []).slice() });
    var box = el('div', 'pb-modal');
    function paint() {
      box.innerHTML = '<div class="pb-modal-card" role="dialog" aria-label="Edit job">' +
        '<label class="pb-field"><span>Job</span><input type="text" class="pb-e-title" value="' + esc(c.title) + '"></label>' +
        (c.by ? '<p class="pb-by">' + (c.by === 'facilitator' ? 'Facilitator' : esc(c.by)) + '</p>' : '') +
        '<div class="pb-field"><span>Who’s doing it</span><div class="pb-pick">' + group.kids.map(function (k, i) {
          return '<button type="button" class="pb-chip' + (c.who.indexOf(k) !== -1 ? ' is-on' : '') + '" data-k="' + esc(k) + '"><span class="pb-av pb-av-' + i + '">' + esc(initial(k)) + '</span>' + esc(k) + '</button>';
        }).join('') + '</div></div>' +
        '<div class="pb-field"><span>How big is it?</span><div class="pb-pick">' + SIZES.map(function (s) {
          return '<button type="button" class="pb-chip' + ((c.size || 1) === s.v ? ' is-on' : '') + '" data-s="' + s.v + '">' + s.name + '</button>';
        }).join('') + '</div></div>' +
        '<div class="pb-field"><span>Stuck?</span><div class="pb-pick"><button type="button" class="pb-chip pb-chip-stuck' + (c.stuck ? ' is-on' : '') + '" data-stuck="1">🚩 We’re stuck on this</button></div>' +
          (c.stuck ? '<input type="text" class="pb-e-note" placeholder="What’s in the way? Who can help?" value="' + esc(c.stuckNote || '') + '">' : '') + '</div>' +
        '<div class="pb-modal-actions"><button type="button" class="pb-del">Delete job</button><span></span>' +
          '<button type="button" class="eot2-btn eot2-btn-secondary pb-cancel">Cancel</button><button type="button" class="pb-save">Save</button></div>' +
        '</div>';
      var title = box.querySelector('.pb-e-title');
      title.addEventListener('input', function () { c.title = title.value; });
      var note = box.querySelector('.pb-e-note');
      if (note) note.addEventListener('input', function () { c.stuckNote = note.value; });
      Array.prototype.forEach.call(box.querySelectorAll('[data-k]'), function (b) {
        b.addEventListener('click', function () {
          var k = b.dataset.k, i = c.who.indexOf(k);
          if (i === -1) c.who.push(k); else c.who.splice(i, 1);
          paint();
        });
      });
      Array.prototype.forEach.call(box.querySelectorAll('[data-s]'), function (b) {
        b.addEventListener('click', function () { c.size = +b.dataset.s; paint(); });
      });
      box.querySelector('[data-stuck]').addEventListener('click', function () { c.stuck = !c.stuck; paint(); });
      box.querySelector('.pb-cancel').addEventListener('click', close);
      box.querySelector('.pb-del').addEventListener('click', function () {
        if (!confirm('Delete “' + card.title + '”?')) return;
        putCard(card.id, { deleted: true });
        close(); draw();
      });
      box.querySelector('.pb-save').addEventListener('click', function () {
        if (!c.title.trim()) return;
        putCard(card.id, { title: c.title.trim(), who: c.who, size: c.size || 1, stuck: !!c.stuck, stuckNote: c.stuck ? (c.stuckNote || '') : '' });
        close(); draw();
      });
    }
    function close() { box.remove(); }
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    paint();
    document.body.appendChild(box);
    box.querySelector('.pb-e-title').focus();
  }

  /* ---------- stand-up ---------- */

  var STANDUP_QS = [
    { id: 'did', label: 'What I did last time' },
    { id: 'will', label: 'What I’ll do today' },
    { id: 'stuck', label: 'Is anything in my way?' }
  ];

  function standupView() {
    var wrap = el('div', 'pb-standup');
    var day = today();
    var dir = director(Q.weekOf(new Date(day + 'T12:00:00')));
    wrap.appendChild(el('div', 'pb-intro', '<h2>Daily stand-up · ' + niceDate(day) + '</h2>' +
      '<p>Every day, stand in a circle at the start of the session. Each person answers three quick questions. ' +
      (dir ? esc(dir) + ', as team director this week, runs it and types the answers in.' : 'This week’s team director runs it and types the answers in.') +
      ' If something is in your way, say it: it goes on the board as a blocker.</p>'));
    var open = openBlockers();
    if (open.length) wrap.appendChild(el('div', 'pb-su-open', '<b>🚧 Still in our way:</b> ' + open.map(function (x) { return esc(x.what); }).join(' · ')));
    var grid = el('div', 'pb-su-grid');
    group.kids.forEach(function (k, i) {
      var id = day + '_' + k.toLowerCase();
      var rec = state.standups[id] || {};
      var card = el('div', 'pb-su-card');
      card.innerHTML = '<h3><span class="pb-av pb-av-' + i + '">' + esc(initial(k)) + '</span>' + esc(k) + '</h3>' +
        STANDUP_QS.map(function (q) {
          return '<label class="pb-field"><span>' + q.label + '</span><textarea rows="2" data-q="' + q.id + '">' + esc(rec[q.id] || '') + '</textarea></label>';
        }).join('');
      Array.prototype.forEach.call(card.querySelectorAll('textarea'), function (ta) {
        ta.addEventListener('input', function () {
          var r = Object.assign({}, state.standups[id] || { date: day, kid: k });
          r[ta.dataset.q] = ta.value;
          r.u = now();
          state.standups[id] = r;
          changed();
        });
        // A real answer to "Is anything in my way?" flags a blocker.
        if (ta.dataset.q === 'stuck') ta.addEventListener('change', function () {
          var bid = 'su_' + id, t = ta.value.trim(), had = state.blockers[bid];
          if (t && !saysNo(t)) {
            if (!had || had.what !== t) putBlocker(bid, { what: t, type: (had && had.type) || 'other', who: [k], by: k, at: (had && had.at) || now(), week: sprint(), from: 'standup', solved: had ? had.solved : false });
          } else if (had && !had.solved) putBlocker(bid, { deleted: true });
          var nb = openBlockers().length, bt = app.querySelectorAll('.pb-tab')[1];
          if (bt) bt.innerHTML = 'Board' + (nb ? ' <span class="pb-tab-flag">🚧 ' + nb + '</span>' : '');
        });
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);

    var past = Object.keys(state.standups).filter(function (id) { return id.indexOf(day) !== 0; })
      .map(function (id) { return state.standups[id]; })
      .filter(function (r) { return r && (r.did || r.will || r.stuck); });
    if (past.length) {
      var days = {};
      past.forEach(function (r) { (days[r.date] = days[r.date] || []).push(r); });
      var hist = el('div', 'pb-history', '<h2>Earlier stand-ups</h2>');
      Object.keys(days).sort().reverse().forEach(function (d) {
        hist.appendChild(el('details', 'pb-day', '<summary>' + niceDate(d) + '</summary>' + days[d].map(function (r) {
          return '<div class="pb-day-row"><strong>' + esc(r.kid) + '</strong>' + STANDUP_QS.filter(function (q) { return r[q.id]; }).map(function (q) {
            return '<p><em>' + q.label + ':</em> ' + esc(r[q.id]) + '</p>';
          }).join('') + '</div>';
        }).join('')));
      });
      wrap.appendChild(hist);
    }
    return wrap;
  }

  /* ---------- weekly check-in ---------- */

  var CHECKIN_QS = [
    { id: 'keep', label: '👍 Keep doing', hint: 'What worked well as a team this week?' },
    { id: 'change', label: '🔧 Change', hint: 'What will we do differently next week?' },
    { id: 'shout', label: '⭐ Shout-outs', hint: 'Who helped, and how?' },
    { id: 'next', label: '🎯 Next week’s goal', hint: 'One clear goal for next week.' },
    { id: 'note', label: 'Facilitator note', hint: 'What you noticed, and any help promised.' }
  ];

  function checkinView() {
    var w = sprint();
    var id = 'w' + w;
    var rec = state.checkins[id] || {};
    var wrap = el('div', 'pb-checkin');
    wrap.appendChild(el('div', 'pb-intro', '<h2>Week ' + w + ' check-in</h2><p>Once a week, at the end of the week, sit down with a facilitator. ' +
      (director(w) ? esc(director(w)) + ', as team director, leads it. ' : 'This week’s team director leads it. ') +
      'Show what you finished, look at any blockers, then talk about how the week went. Choose next week’s team director at the end.</p>'));
    var done = inCol('done');
    var stuck = openBlockers();
    wrap.appendChild(el('div', 'pb-review',
      '<div><h3>What we finished</h3>' + (done.length ? '<ul>' + done.map(function (c) { return '<li>' + esc(c.title) + ' <span class="pb-avs">' + who(c) + '</span></li>'; }).join('') + '</ul>' : '<p class="pb-empty">Nothing in Done yet this week.</p>') + '</div>' +
      '<div><h3>🚧 Blockers still open</h3>' + (stuck.length ? '<ul>' + stuck.map(function (x) { return '<li>' + esc(x.what) + ((x.who || []).length ? ' — ' + x.who.map(esc).join(', ') : '') + '</li>'; }).join('') + '</ul>' : '<p class="pb-empty">Nothing in our way.</p>') + '</div>'));
    var form = el('div', 'pb-retro');
    CHECKIN_QS.forEach(function (q) {
      var ro = KID && q.id === 'note';
      if (ro && !rec.note) return;
      var f = el('label', 'pb-field' + (q.id === 'note' ? ' pb-note' : ''), '<span>' + q.label + '</span><em>' + (ro ? 'From your facilitator.' : q.hint) + '</em><textarea rows="2"' + (ro ? ' readonly' : '') + '>' + esc(rec[q.id] || '') + '</textarea>');
      if (!ro) f.querySelector('textarea').addEventListener('input', function () {
        var r = Object.assign({}, state.checkins[id] || {});
        r[q.id] = this.value; r.u = now();
        state.checkins[id] = r;
        changed();
      });
      form.appendChild(f);
    });
    var sign = el('label', 'pb-sign', '<input type="checkbox"' + (rec.signed ? ' checked' : '') + (KID ? ' disabled' : '') + '> Facilitator checked in with this group');
    sign.querySelector('input').addEventListener('change', function () {
      var r = Object.assign({}, state.checkins[id] || {});
      r.signed = this.checked; r.u = now();
      state.checkins[id] = r;
      changed();
    });
    if (w < WEEKS.length) {
      var nd = el('label', 'pb-field', '<span>Team director for week ' + (w + 1) + '</span><em>Not had a turn yet: ' + notYet().map(esc).join(', ') + '</em>' +
        '<select><option value="">Choose…</option>' + group.kids.map(function (k) { return '<option' + (director(w + 1) === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>');
      nd.querySelector('select').addEventListener('change', function () { setMeta('director' + (w + 1), this.value); });
      form.appendChild(nd);
    }
    form.appendChild(sign);
    wrap.appendChild(form);
    return wrap;
  }

  /* ---------- staff overview: every group at a glance ---------- */

  // One group's board, boiled down to what a facilitator scans for.
  function glance(s, g) {
    s = s || blank();
    var m = function (k, f) { var x = s.meta[k]; return x && x.v !== undefined ? x.v : f; };
    var w = m('sprint', Q.weekOf());
    var all = Object.keys(s.cards).map(function (id) { return s.cards[id]; }).filter(function (c) { return c && !c.deleted; });
    var pts = function (l) { return l.reduce(function (n, c) { return n + (c.size || 1); }, 0); };
    var open = all.filter(function (c) { return c.col === 'todo' || c.col === 'doing'; });
    var done = all.filter(function (c) { return c.col === 'done' && c.doneWeek === w; });
    var doing = {};
    all.filter(function (c) { return c.col === 'doing'; }).forEach(function (c) { (c.who || []).forEach(function (k) { doing[k] = 1; }); });
    var day = today();
    var stood = g.kids.filter(function (k) {
      var r = s.standups[day + '_' + k.toLowerCase()];
      return r && (r.did || r.will || r.stuck);
    });
    var ci = s.checkins['w' + w] || {};
    return {
      build: projectTitle(m('project'), m('build', '')), due: m('project') && m('started') ? deadline(m('project'), m('started')) : null,
      director: m('director' + w, ''), week: w, goal: m('goal' + w, ''),
      got: pts(done), total: pts(done) + pts(open), cards: all.length,
      doing: Object.keys(doing),
      stuck: all.filter(function (c) { return c.stuck && c.col !== 'done'; }).map(function (c) { return c.title; })
        .concat(Object.keys(s.blockers || {}).map(function (id) { return s.blockers[id]; }).filter(function (x) { return x && x.what && !x.solved && !x.deleted; }).map(function (x) { return x.what; })),
      stood: stood, signed: !!ci.signed
    };
  }

  function overview(main) {
    var groups = GROUPS;
    function paint(boards) {
      setStatus('Updated', 'is-ok');
      main.innerHTML = '<p class="pb-ov-lede">Every group’s board at a glance. Tap a group to open its board.</p>';
      var list = el('div', 'pb-ov');
      list.appendChild(el('div', 'pb-ov-row pb-ov-headrow',
        '<span>Group</span><span>This week</span><span>Progress</span><span>Doing now</span><span>Blockers</span><span>Stand-up today</span><span>Check-in</span>'));
      groups.forEach(function (g, i) {
        var a = glance(boards[i], g);
        var pct = a.total ? Math.round(a.got / a.total * 100) : 0;
        var row = el('a', 'pb-ov-row');
        row.href = '?group=' + g.id;
        row.innerHTML =
          '<span class="pb-ov-group"><strong>' + g.name + '</strong><em>' + esc(a.build || 'No project chosen yet') + '</em>' + (a.due ? '<small>Expected by ' + Q.nice(a.due.date) + '</small>' : '') + '<small>' + g.kids.join(', ') + (a.director ? ' · Director: ' + esc(a.director) : '') + '</small></span>' +
          '<span class="pb-ov-week"><small>Week</small><strong>' + a.week + '</strong>' + (a.goal ? '<em>' + esc(a.goal) + '</em>' : '<em class="pb-ov-none">No goal set</em>') + '</span>' +
          '<span class="pb-ov-prog">' + (a.total ? '<span class="pb-track"><span style="width:' + pct + '%"></span></span><em>' + a.got + ' of ' + a.total + ' points</em>' : '<em class="pb-ov-none">' + (a.cards ? 'Nothing picked for this week' : 'Board not started') + '</em>') + '</span>' +
          '<span class="pb-ov-doing">' + (a.doing.length ? a.doing.map(function (k) { return '<span class="pb-av pb-av-' + g.kids.indexOf(k) + '" title="' + esc(k) + '">' + esc(initial(k)) + '</span>'; }).join('') : '<em class="pb-ov-none">No one</em>') + '</span>' +
          '<span class="pb-ov-stuck">' + (a.stuck.length ? '<strong class="pb-ov-flag" title="' + esc(a.stuck.join(', ')) + '">🚧 ' + a.stuck.length + '</strong>' : '<em class="pb-ov-none">—</em>') + '</span>' +
          // Who was at today's stand-up: solid initials for those who were,
          // faded for those who weren't, and who's missing in words.
          '<span class="pb-ov-stand">' + (a.stood.length ? '<span class="pb-ov-avs">' + g.kids.map(function (k, j) {
            var here = a.stood.indexOf(k) !== -1;
            return '<span class="pb-av pb-av-' + j + (here ? '' : ' is-away') + '" title="' + esc(k) + (here ? ' was there' : ' wasn’t there') + '">' + esc(initial(k)) + '</span>';
          }).join('') + '</span>' + (a.stood.length === g.kids.length ? '<em class="is-ok">Everyone</em>'
            : '<em>Missing: ' + g.kids.filter(function (k) { return a.stood.indexOf(k) === -1; }).map(esc).join(', ') + '</em>')
            : '<em class="pb-ov-none">Not done yet</em>') + '</span>' +
          '<span class="pb-ov-check">' + (a.signed ? '<strong class="is-ok">✓ Week ' + a.week + '</strong>' : '<em class="pb-ov-none">Not yet</em>') + '</span>';
        list.appendChild(row);
      });
      main.appendChild(list);
    }
    function fetchAll() {
      return Promise.all(groups.map(function (g) {
        return window.eot2Fetch('term-3', g.id, 'board').then(function (d) { return d && d.state; });
      })).then(paint);
    }
    fetchAll();
    setInterval(function () { if (!document.hidden) fetchAll(); }, 30000);
  }

  render();
})();
