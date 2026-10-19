/* Term 3 Quests — a group's project board, run the scrum way but in words
   8–13 year olds use:

   - Board: Ideas list (the backlog) → To do this week → Doing → Done.
     Each card is one job: who's on it, how big it is (small / medium /
     big = 1 / 2 / 3 points), and a red flag when someone is stuck.
   - Weeks are sprints. Each week has a goal, and the bar shows how much of
     this week's work is done.
   - Stand-up: at the start of each session, every Riser answers three
     questions (what I did, what I'll do, am I stuck). The group leader
     types it in.
   - Check-in: at the end of the week, with a facilitator — what we
     finished, keep doing, change, shout-outs, and next week's goal.

   One shared board per group, saved through the progress Worker under
   group "term-3", kid = the group id, week "board". Every card, stand-up
   and check-in carries the time it last changed (u); saving fetches the
   latest copy and keeps the newer version of each, so two Risers working
   at once don't wipe each other's changes. Deleted cards are kept as
   { deleted: true } so the deletion wins too. The board refreshes from
   other devices every 15 seconds.

   "Sample" is a group with an example build filled in, to show how it
   works. */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  var GROUPS = [
    { id: 'sample', name: 'Sample', kids: ['Asha', 'Ravi', 'Meera'] },
    { id: 'g1', name: 'Group 1', kids: ['Benjamin', 'Yokesh', 'Eva'] },
    { id: 'g2', name: 'Group 2', kids: ['Michael', 'Chris', 'Elyon'] },
    { id: 'g3', name: 'Group 3', kids: ['Shalom', 'Owen', 'Gabby'] },
    { id: 'g4', name: 'Group 4', kids: ['Karis', 'Pranavi', 'Zach'] }
  ];
  var COLS = [
    { id: 'backlog', name: 'Ideas list', hint: 'Every job the build needs. Add as many as you can think of.' },
    { id: 'todo', name: 'To do this week', hint: 'Jobs we picked for this week.' },
    { id: 'doing', name: 'Doing', hint: 'One job each at a time.' },
    { id: 'done', name: 'Done', hint: 'Finished this week.' }
  ];
  var SIZES = [{ v: 1, name: 'Small' }, { v: 2, name: 'Medium' }, { v: 3, name: 'Big' }];
  var WEEKS = [1, 2, 3, 4];
  var MAPS = ['meta', 'cards', 'standups', 'checkins'];

  // A Riser (term-3/quest/index.html sets PB_KID_MODE) sees only their own
  // group's board, from the group list in assets/brand.js; staff pick any.
  var KID = !!window.PB_KID_MODE;
  var group;
  if (KID) {
    var me = null;
    try { me = (localStorage.getItem('imm-l3-kid') || '').toLowerCase(); } catch (e) {}
    var gid = (window.LH_T3_GROUPS || {})[me];
    group = GROUPS.filter(function (g) { return g.id === gid; })[0];
    if (!group) { location.replace('../index.html'); return; }
    var ME = group.kids.filter(function (k) { return k.toLowerCase() === me; })[0] || '';
  } else {
    group = GROUPS.filter(function (g) { return g.id === params.get('group'); })[0] || GROUPS[0];
    // Staff land on the overview of every group unless a group is chosen.
    var OVERVIEW = !params.get('group');
  }
  var tab = params.get('tab') || 'board';
  var state = blank();
  var loaded = false, saving = false, dirty = false, saveTimer = null;

  function blank() { return { meta: {}, cards: {}, standups: {}, checkins: {} }; }
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
  function sprint() { return meta('sprint', 1); }
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
      if (!remote && group.id === 'sample') { state = sampleBoard(); changed(); }
      else state = merge(remote || blank(), state);
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
      '<div><p class="hd-eyebrow">Term 3 Quest' + (KID ? ' &middot; ' + group.kids.join(', ') : 's') + '</p><h1>' + (KID ? 'Our project board' : 'Project board') + '</h1>' +
      '<p>Plan the build, work on it in weekly sprints, and check in every week.</p></div>' +
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
    main.appendChild(topBar());
    var tabs = el('div', 'pb-tabs');
    [['board', 'Board'], ['standup', 'Stand-up'], ['checkin', 'Weekly check-in']].forEach(function (t) {
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
    main.appendChild(tab === 'standup' ? standupView() : tab === 'checkin' ? checkinView() : boardView());
    window.scrollTo(0, y);
  }

  // Build name, leader, this week, the week's goal and how much is done.
  function topBar() {
    var bar = el('div', 'pb-top');
    var w = sprint();
    var todo = inCol('todo').concat(inCol('doing'));
    var done = inCol('done');
    var pts = function (l) { return l.reduce(function (s, c) { return s + (c.size || 1); }, 0); };
    var total = pts(todo) + pts(done), got = pts(done);
    bar.innerHTML =
      '<div class="pb-top-row">' +
        '<label class="pb-field pb-build"><span>Our build</span><input type="text" value="' + esc(meta('build', '')) + '" placeholder="What are we building?"></label>' +
        '<label class="pb-field"><span>Group leader</span><select class="pb-leader"><option value="">Choose…</option>' +
          group.kids.map(function (k) { return '<option' + (meta('leader') === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select></label>' +
        '<div class="pb-field"><span>Week</span><div class="pb-weeks">' + WEEKS.map(function (n) {
          return '<button type="button" class="pb-week' + (n === w ? ' is-on' : '') + '" data-w="' + n + '">' + n + '</button>';
        }).join('') + '</div></div>' +
      '</div>' +
      '<label class="pb-field pb-goal"><span>Week ' + w + ' goal</span><input type="text" value="' + esc(meta('goal' + w, '')) + '" placeholder="By the end of this week we will…"></label>' +
      '<div class="pb-progress"><div class="pb-track"><span style="width:' + (total ? Math.round(got / total * 100) : 0) + '%"></span></div>' +
        '<span>' + (total ? got + ' of ' + total + ' points done this week' : 'Pick jobs for this week to get started') + '</span></div>';
    bar.querySelector('.pb-build input').addEventListener('change', function () { setMeta('build', this.value.trim()); });
    bar.querySelector('.pb-goal input').addEventListener('change', function () { setMeta('goal' + w, this.value.trim()); });
    bar.querySelector('.pb-leader').addEventListener('change', function () { setMeta('leader', this.value); });
    Array.prototype.forEach.call(bar.querySelectorAll('.pb-week'), function (b) {
      b.addEventListener('click', function () { setMeta('sprint', +b.dataset.w); draw(); });
    });
    return bar;
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
    var wrap = el('div', 'pb-board');
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
    return wrap;
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
    { id: 'stuck', label: 'Anything I’m stuck on?' }
  ];

  function standupView() {
    var wrap = el('div', 'pb-standup');
    var day = today();
    wrap.appendChild(el('div', 'pb-intro', '<h2>Stand-up · ' + niceDate(day) + '</h2>' +
      '<p>Stand in a circle at the start of the session. Each person answers three quick questions. ' +
      (meta('leader') ? esc(meta('leader')) + ', as group leader, types the answers in.' : 'The group leader types the answers in.') + '</p>'));
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
    wrap.appendChild(el('div', 'pb-intro', '<h2>Week ' + w + ' check-in</h2><p>Sit down with a facilitator at the end of the week. Show what you finished, then talk about how the week went.</p>'));
    var done = inCol('done');
    var stuck = cards().filter(function (c) { return c.stuck && c.col !== 'done'; });
    wrap.appendChild(el('div', 'pb-review',
      '<div><h3>What we finished</h3>' + (done.length ? '<ul>' + done.map(function (c) { return '<li>' + esc(c.title) + ' <span class="pb-avs">' + who(c) + '</span></li>'; }).join('') + '</ul>' : '<p class="pb-empty">Nothing in Done yet this week.</p>') + '</div>' +
      '<div><h3>Still stuck</h3>' + (stuck.length ? '<ul>' + stuck.map(function (c) { return '<li>🚩 ' + esc(c.title) + (c.stuckNote ? ' — ' + esc(c.stuckNote) : '') + '</li>'; }).join('') + '</ul>' : '<p class="pb-empty">No one is stuck.</p>') + '</div>'));
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
    form.appendChild(sign);
    wrap.appendChild(form);
    return wrap;
  }

  /* ---------- staff overview: every group at a glance ---------- */

  // One group's board, boiled down to what a facilitator scans for.
  function glance(s, g) {
    s = s || blank();
    var m = function (k, f) { var x = s.meta[k]; return x && x.v !== undefined ? x.v : f; };
    var w = m('sprint', 1);
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
      build: m('build', ''), leader: m('leader', ''), week: w, goal: m('goal' + w, ''),
      got: pts(done), total: pts(done) + pts(open), cards: all.length,
      doing: Object.keys(doing), stuck: all.filter(function (c) { return c.stuck && c.col !== 'done'; }),
      stood: stood, signed: !!ci.signed
    };
  }

  function overview(main) {
    var groups = GROUPS.filter(function (g) { return g.id !== 'sample'; });
    function paint(boards) {
      setStatus('Updated', 'is-ok');
      main.innerHTML = '<p class="pb-ov-lede">Every group’s board at a glance. Tap a group to open its board.</p>';
      var list = el('div', 'pb-ov');
      list.appendChild(el('div', 'pb-ov-row pb-ov-headrow',
        '<span>Group</span><span>This week</span><span>Progress</span><span>Doing now</span><span>Stuck</span><span>Stand-up today</span><span>Check-in</span>'));
      groups.forEach(function (g, i) {
        var a = glance(boards[i], g);
        var pct = a.total ? Math.round(a.got / a.total * 100) : 0;
        var row = el('a', 'pb-ov-row');
        row.href = '?group=' + g.id;
        row.innerHTML =
          '<span class="pb-ov-group"><strong>' + g.name + '</strong><em>' + esc(a.build || 'No build named yet') + '</em><small>' + g.kids.join(', ') + (a.leader ? ' · Leader: ' + esc(a.leader) : '') + '</small></span>' +
          '<span class="pb-ov-week"><small>Week</small><strong>' + a.week + '</strong>' + (a.goal ? '<em>' + esc(a.goal) + '</em>' : '<em class="pb-ov-none">No goal set</em>') + '</span>' +
          '<span class="pb-ov-prog">' + (a.total ? '<span class="pb-track"><span style="width:' + pct + '%"></span></span><em>' + a.got + ' of ' + a.total + ' points</em>' : '<em class="pb-ov-none">' + (a.cards ? 'Nothing picked for this week' : 'Board not started') + '</em>') + '</span>' +
          '<span class="pb-ov-doing">' + (a.doing.length ? a.doing.map(function (k) { return '<span class="pb-av pb-av-' + g.kids.indexOf(k) + '" title="' + esc(k) + '">' + esc(initial(k)) + '</span>'; }).join('') : '<em class="pb-ov-none">No one</em>') + '</span>' +
          '<span class="pb-ov-stuck">' + (a.stuck.length ? '<strong class="pb-ov-flag" title="' + esc(a.stuck.map(function (c) { return c.title; }).join(', ')) + '">🚩 ' + a.stuck.length + '</strong>' : '<em class="pb-ov-none">—</em>') + '</span>' +
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

  /* ---------- the Sample group ---------- */

  function sampleBoard() {
    var t = now(), s = blank(), n = 0;
    function m(k, v) { s.meta[k] = { v: v, u: t }; }
    var adders = ['Asha', 'Ravi', 'Meera'];
    function card(title, col, size, who, extra) {
      s.cards['s' + (++n)] = Object.assign({ title: title, col: col, size: size, who: who, order: n, u: t, by: adders[n % 3] }, extra || {});
    }
    m('build', 'Breakfast machine');
    m('leader', 'Asha');
    m('sprint', 2);
    m('goal1', 'Plan every step and gather all the materials.');
    m('goal2', 'Build the first five steps and test each one.');
    card('Sketch all 10 steps on paper', 'done', 2, ['Asha', 'Meera'], { doneWeek: 1 });
    card('Make the materials list', 'done', 1, ['Ravi'], { doneWeek: 1 });
    card('Build the marble ramp (step 1)', 'done', 2, ['Ravi'], { doneWeek: 2 });
    card('Line up the dominoes (step 2)', 'done', 1, ['Meera'], { doneWeek: 2 });
    card('Make the lever that tips the cup (step 3)', 'doing', 3, ['Asha'], { stuck: true, stuckNote: 'The cup keeps falling off. Ask a facilitator about glue.' });
    card('Fix the pulley for the bucket (step 4)', 'doing', 2, ['Ravi']);
    card('Test steps 1 to 3 five times', 'todo', 2, ['Meera']);
    card('Build the car ramp (step 5)', 'todo', 2, []);
    card('Steps 6 to 10', 'backlog', 3, []);
    card('Make labels for every step', 'backlog', 1, []);
    card('Practise the showcase', 'backlog', 2, []);
    var d = new Date(); d.setDate(d.getDate() - 1);
    var y = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    s.standups[y + '_asha'] = { date: y, kid: 'Asha', did: 'Started the lever.', will: 'Get the cup to stay on.', stuck: 'The cup falls off.', u: t };
    s.standups[y + '_ravi'] = { date: y, kid: 'Ravi', did: 'Finished the marble ramp.', will: 'Work on the pulley.', stuck: '', u: t };
    s.standups[y + '_meera'] = { date: y, kid: 'Meera', did: 'Lined up the dominoes.', will: 'Test steps 1 to 3.', stuck: '', u: t };
    s.checkins.w1 = { keep: 'Everyone had a job and knew what to do.', change: 'Check the materials before the session starts.', shout: 'Ravi found all the marbles!', next: 'Build the first five steps and test each one.', note: 'Good planning. Promised: glue gun on Tuesday.', signed: true, u: t };
    return s;
  }

  render();
})();
