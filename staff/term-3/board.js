/* Term 3 Quests — a team's quest, in five parts:

   - Quest Pack: what we'll make and learn, when it's done, boundaries
     and rules.
   - Our Plan: five steps the team fills in: Quest Masters for each
     week, the parts, the jobs in each part, a shopping list within the
     budget, and a goal for each week. A facilitator OKs it, and its jobs
     go onto the Board.
   - Board: Backlog → This week → Doing → Done. Each Riser adds and moves
     only their own jobs (tagged with their name) and sees everyone's. A
     job can be flagged "I'm stuck".
   - Stand-up, on quest days. On Monday and Wednesday the Quest Master
     runs it and types every card (no one else can); on Tuesday each Riser
     types only their own card. On other days the cards are locked.
     "What will I do today?" can be added to the Board, in Doing.
   - Look Back (the check-in), once a week on Wednesday, 30 minutes. Part 1, together:
     the Quest Master fills it in (our week, keep doing, change, the team
     goal, planning next week from the Backlog, the work goal); a
     facilitator adds a note and ticks they were there, which closes it.
     Part 2, on their own: each Riser's Team Reflection (reflect.js).

   A team chooses its quest one week and starts it the next. The team
   picks a Quest Master for each week in Our Plan (the turn goes round);
   the top line shows this week's, and a facilitator can change it there. The week is always
   today's school week.

   One shared record per team, saved through the progress Worker under
   group "term-3", kid = the group id, week "board": meta (project,
   started, master<week>, planOk, pgoal_<n>, noShop), cards, standups,
   checkins, blockers, materials (no longer shown), plan and shop. Every item carries the time it last changed (u); saving
   fetches the latest copy and keeps the newer version of each, so two
   Risers working at once don't wipe each other's changes. Deleted items
   are kept as { deleted: true }. The page refreshes from other devices
   every 15 seconds. A team chooses only from the levels set for it in
   quest-data.js and never sees the levels, or makes up its own quest
   (name, what it is, what we learn, what we make, how long), which a
   facilitator OKs before the team can choose it. */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  var Q = window.T3Q;
  var GROUPS = Q.GROUPS;
  var POOL = window.T3_POOL || [];
  var CARDS = window.T3_CARDS || {}, PACKS = window.T3_PACKS || {};
  // A pool project, or the team's own quest ('own', from a board record).
  function project(id, s) { return id === 'own' ? ownQuest(s || state) : POOL.filter(function (b) { return b.id === id; })[0] || null; }
  // The team's own quest idea, shaped like a pool project (no level, no
  // role ideas): meta.own = { title, what, learn, make, weeks, cat, by,
  // st: 'waiting' | 'yes' | 'change', note, okBy }.
  function ownQuest(s) {
    var o = s.meta.own && s.meta.own.v;
    if (!o || !o.title) return null;
    return { id: 'own', own: true, cat: o.cat || 'sol', title: o.title, what: o.what, make: o.make, learn: o.learn, lo: o.learn, weeks: +o.weeks || 3, resp: [], st: o.st, note: o.note, by: o.by, okBy: o.okBy };
  }
  var WEEKS = Q.WEEKS.map(function (w, i) { return i + 1; });
  var MAPS = ['meta', 'cards', 'standups', 'checkins', 'blockers', 'materials', 'plan', 'shop'];

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

  function blank() { return { meta: {}, cards: {}, standups: {}, checkins: {}, blockers: {}, materials: {}, plan: {}, shop: {} }; }
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
  function sprint() { return Q.weekOf(); }
  // This week's Quest Master (older boards saved it as director<week>).
  function master(w) { w = w || sprint(); return meta('master' + w, '') || meta('director' + w, ''); }
  function isMaster() { return KID && master() === ME; }
  // A Riser's own job, or anyone's for staff.
  function owner(c) { return (c.who && c.who[0]) || (c.by !== 'facilitator' ? c.by : '') || ''; }
  function mine(c) { return !KID || owner(c) === ME; }
  // Who hasn't been Quest Master yet this term (everyone, once all have).
  function notYet() {
    var had = {};
    WEEKS.forEach(function (n) { var d = master(n); if (d) had[d] = 1; });
    var left = group.kids.filter(function (k) { return !had[k]; });
    return left.length ? left : group.kids.slice();
  }
  function cards() {
    return Object.keys(state.cards).map(function (id) { return Object.assign({ id: id }, state.cards[id]); })
      .filter(function (c) { return !c.deleted; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  // Jobs in a column; Done shows only this week's.
  function inCol(col) {
    return cards().filter(function (c) {
      var at = c.col || 'backlog';
      return col === 'done' ? at === 'done' && c.doneWeek === sprint() : at === col;
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
      '<div><p class="hd-eyebrow">Term 3 Quest' + (KID ? ' &middot; ' + group.name + ': ' + group.kids.join(', ') : 's') + '</p><h1>' + (KID ? 'Our quest' : 'Quest boards') + '</h1></div>' +
      '<span class="pb-status">Loading…</span>'));
    if (!KID) {
      var picker = el('div', 'pb-groups');
      var all = el('a', 'pb-group pb-group-all' + (OVERVIEW ? ' is-on' : ''), '<strong>All teams</strong><span>Overview</span>');
      all.href = '?';
      picker.appendChild(all);
      GROUPS.forEach(function (g) {
        var a = el('a', 'pb-group' + (!OVERVIEW && g.id === group.id ? ' is-on' : ''), '<strong>' + g.name + '</strong><span>' + g.kids.join(', ') + '</span>');
        a.href = '?group=' + g.id + '&tab=' + tab;
        picker.appendChild(a);
      });
      app.appendChild(picker);
    }
    var main = el('div', 'pb-main');
    app.appendChild(main);
    if (!KID && OVERVIEW) { overview(main); return; }
    Promise.all([load(), Q.fetchApprovals().then(function (a) { approvals = a; })])
      .then(function () {
        setStatus(dirty ? 'Saving…' : 'Saved', dirty ? '' : 'is-ok');
        // From the Our Own Quest tile: straight to our own quest (the form, if there's no idea yet).
        if (KID && params.get('own')) { changing = true; ownOpen = !project('own'); }
        draw();
        var qo = KID && params.get('own') && app.querySelector('.qo');
        if (qo) qo.scrollIntoView();
      });
  }
  // Projects staff have approved; Risers only see these.
  var approvals = {};
  function approved(b) { var a = approvals[b.id]; return a && a.v === 'yes'; }

  var TABS = [['pack', 'Quest Pack'], ['plan', 'Our Plan'], ['board', 'Board'], ['standup', 'Stand-up'], ['checkin', 'Look Back']];

  function draw() {
    var main = app.querySelector('.pb-main');
    if (!main) return;
    var y = window.scrollY;
    main.innerHTML = '';
    if (!project(meta('project')) || changing) { main.appendChild(chooserView(project(meta('project')))); return; }
    // A new own-quest idea from a team already on a quest: staff see it here.
    var idea = project('own');
    if (!KID && idea && idea.st === 'waiting' && meta('project') !== 'own') main.appendChild(ownEl(project(meta('project'))));
    main.appendChild(topLine());
    if (TABS.map(function (t) { return t[0]; }).indexOf(tab) === -1) tab = 'board';
    var tabs = el('div', 'pb-tabs');
    var nb = openBlockers().length;
    TABS.forEach(function (t) {
      var b = el('button', 'pb-tab' + (tab === t[0] ? ' is-on' : ''), t[1] + (t[0] === 'board' && nb ? ' <span class="pb-tab-flag">🚩 ' + nb + '</span>' : ''));
      b.type = 'button';
      b.addEventListener('click', function () {
        tab = t[0];
        history.replaceState(null, '', KID ? '?tab=' + tab : '?group=' + group.id + '&tab=' + tab);
        draw();
      });
      tabs.appendChild(b);
    });
    main.appendChild(tabs);
    main.appendChild(tab === 'pack' ? packView() : tab === 'plan' ? planView() : tab === 'standup' ? standupView() : tab === 'checkin' ? checkinView() : boardView());
    window.scrollTo(0, y);
  }

  // The team's week in its quest: 0 while getting ready (the week the
  // quest was chosen), then 1, 2, … up to the quest's length.
  function questWeek() {
    var b = project(meta('project'));
    if (!b || !meta('started')) return null;
    return { n: sprint() - Q.startWeek(meta('started')) + 1, of: Q.weeksFor(b) };
  }
  // One line: the quest week, the Quest Master, when the quest is due.
  function topLine() {
    var w = sprint(), due = deadline(), qw = questWeek();
    var line = el('div', 'pb-line',
      '<span><b>' + (!qw ? 'Week ' + w : qw.n < 1 ? 'Getting ready: your quest starts next week' : 'Quest week ' + qw.n + ' of ' + qw.of + (qw.n > qw.of ? ' (extra time)' : '')) + '</b></span>' +
      '<span>Quest Master: ' + (KID ? (master() ? '<b>' + esc(master()) + '</b>' : '<em class="pb-mute">chosen in Our Plan</em>') :
        '<select class="pb-master" aria-label="Quest Master this week"><option value="">Choose…</option>' +
        group.kids.map(function (k) { return '<option' + (master() === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>' +
        (master() ? '' : ' <small>Not had a turn yet: ' + notYet().map(esc).join(', ') + '</small>')) + '</span>' +
      (due ? '<span>Ready by <b>' + Q.nice(due.date) + '</b></span>' : ''));
    var sel = line.querySelector('.pb-master');
    if (sel) sel.addEventListener('change', function () {
      // Staff only: the team picks Quest Masters in Our Plan.
      setMeta('master' + w, this.value); draw();
    });
    return line;
  }

  /* ---------- choosing the quest ---------- */

  function deadline(id, started) {
    var b = project(id === undefined ? meta('project') : id);
    started = started === undefined ? meta('started') : started;
    return b && started ? Q.deadline(started, Q.weeksFor(b)) : null;
  }
  var changing = false;

  // The full description, folded under "More" on a quest card.
  function detailHtml(b) {
    return '<p>' + esc(b.what) + '</p><p><b>You’ll make:</b> ' + esc(b.make) + '</p><p><b>You’ll learn:</b> ' + esc(b.lo) + '</p>';
  }

  function chooserView(current) {
    var wrap = el('div', 'pq');
    var levels = Q.LEVELS[group.id] || [1, 2, 3];
    wrap.appendChild(el('p', 'pq-intro', current
      ? 'Choose a different quest, or keep <b>' + esc(current.title) + '</b>.'
      : 'Pick your quest. Talk about it together first, then choose one as a team.'));
    if (current) {
      var keep = el('button', 'pq-btn pq-btn-ghost', 'Keep ' + esc(current.title));
      keep.type = 'button';
      keep.addEventListener('click', function () { changing = false; draw(); });
      wrap.appendChild(keep);
    }
    var shown = 0;
    ['sol', 'sci'].forEach(function (cat) {
      var list = POOL.filter(function (b) { return b.cat === cat && levels.indexOf(b.level) !== -1 && approved(b); })
        .sort(function (x, y) { return x.title.localeCompare(y.title); });
      if (!list.length) return;
      shown += list.length;
      wrap.appendChild(el('h2', 'pq-cat pq-cat-' + cat, esc(Q.CATS[cat].name)));
      var grid = el('div', 'qc-grid');
      list.forEach(function (b) {
        var c = CARDS[b.id];
        var card = el('article', 'qc qc-' + cat,
          '<div class="qc-art"><span class="qc-kind">' + esc(Q.CATS[cat].name) + '</span>' + (KID ? '' : '<span class="qc-level">Level ' + b.level + '</span>') + (c ? c.icon : '') + '</div>' +
          '<div class="qc-body"><h3>' + esc(b.title) + '</h3>' +
          '<p class="qc-tag">' + esc(c ? c.tag : b.what) + '</p>' +
          (c ? '<p class="qc-make">🎁 ' + esc(c.make) + '</p>' : '') +
          '<div class="qc-chips"><span>⏱ ' + Q.weeksFor(b) + ' weeks</span>' + (c ? '<span>🧠 ' + esc(c.learn) + '</span><span>' + esc(c.feel) + '</span>' : '') + '</div>' +
          '<details class="qc-more"><summary>More</summary>' + detailHtml(b) + '</details></div>');
        var go = el('button', 'pq-btn', current && current.id === b.id ? 'Our quest now' : 'Choose this quest');
        go.type = 'button';
        go.disabled = !!(current && current.id === b.id);
        go.addEventListener('click', function () {
          if (!confirm('Choose “' + b.title + '” for your team?')) return;
          setMeta('project', b.id);
          setMeta('started', today());
          changing = false;
          tab = 'pack';
          draw();
          window.scrollTo(0, 0);
        });
        card.querySelector('.qc-body').appendChild(go);
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
    });
    if (!shown) wrap.appendChild(el('p', 'pb-empty', KID ? 'Our quests are on their way. Check back soon, or make up your own below.' : 'No projects approved for this team yet. Approve them on the Term 3 Quests page.'));
    wrap.appendChild(ownEl(current));
    return wrap;
  }

  /* ---------- our own quest ---------- */

  // What a team must say about its own quest; every box must be filled in.
  var OWN_QS = [
    { id: 'title', label: 'Quest name', hint: 'A short, fun name.', ph: 'e.g. Bird feeder café', one: true },
    { id: 'what', label: 'What is it?', hint: 'Explain your quest so anyone can understand it.', ph: 'e.g. We build bird feeders and see which birds come to LifeHub.' },
    { id: 'learn', label: 'What will we learn?', hint: 'The science or the skill.', ph: 'e.g. Which foods different birds eat, and how to count fairly.' },
    { id: 'make', label: 'What will we make?', hint: 'The real things you will have at the end.', ph: 'e.g. 3 bird feeders, a bird-count chart and a poster.' }
  ];
  var ownOpen = false, draft = null, ownMissing = false;

  function ownEl(current) {
    var o = project('own'), ours = !!(current && current.id === 'own');
    var box = el('section', 'qo');
    box.appendChild(el('h2', 'pq-cat qo-h', '💡 Our own quest'));
    if (ownOpen) { box.appendChild(ownForm(o)); return box; }
    if (!o) {
      box.appendChild(el('p', 'pq-catnote', 'Got a better idea? Make up your own quest. A facilitator will look at it and say OK.'));
      var start = el('button', 'pq-btn', '✏️ Make up our own quest');
      start.type = 'button';
      start.addEventListener('click', function () { ownOpen = true; draft = null; ownMissing = false; draw(); });
      box.appendChild(start);
      return box;
    }
    var due = Q.deadline(ours ? meta('started') : today(), o.weeks);
    var card = el('article', 'qc qc-' + o.cat + ' qo-card',
      '<div class="qc-art"><span class="qc-kind">' + esc(Q.CATS[o.cat].name) + '</span>💡</div>' +
      '<div class="qc-body"><h3>' + esc(o.title) + '</h3>' +
      '<p class="qc-tag">' + esc(o.what) + '</p>' +
      '<p class="qc-make">🎁 ' + esc(o.make) + '</p>' +
      '<div class="qc-chips"><span>⏱ ' + o.weeks + ' weeks</span><span>🎯 Ready by ' + Q.nice(due.date) + (ours ? '' : ' if we start next week') + '</span><span>🧠 ' + esc(o.learn) + '</span></div>' +
      '<p class="qo-st qo-st-' + (o.st || 'waiting') + '">' +
        (o.st === 'yes' ? '✓ A facilitator said OK' + (o.okBy ? ' (' + esc(o.okBy) + ')' : '') + '.'
          : o.st === 'change' ? '✎ A facilitator asked for a change' + (o.note ? ': <b>' + esc(o.note) + '</b>' : '.')
          : '⏳ Waiting for a facilitator to say OK.') + '</p></div>');
    var body = card.querySelector('.qc-body');
    if (o.st === 'yes') {
      var go = el('button', 'pq-btn', ours ? 'Our quest now' : 'Choose this quest');
      go.type = 'button';
      go.disabled = ours;
      go.addEventListener('click', function () {
        if (!confirm('Choose “' + o.title + '” for your team?')) return;
        setMeta('project', 'own');
        setMeta('started', today());
        changing = false;
        tab = 'pack';
        draw();
        window.scrollTo(0, 0);
      });
      body.appendChild(go);
    }
    // Staff say OK, or ask for a change with a note.
    if (!KID && !ours) {
      var rv = el('div', 'bl-approve',
        '<div class="bl-approve-btns"><button type="button" class="bl-ap bl-ap-yes' + (o.st === 'yes' ? ' is-on' : '') + '" data-v="yes">✓ OK</button>' +
        '<button type="button" class="bl-ap bl-ap-tweak' + (o.st === 'change' ? ' is-on' : '') + '" data-v="change">✎ Ask for a change</button></div>' +
        (o.st === 'change' ? '<textarea rows="2" placeholder="What should they change?">' + esc(o.note || '') + '</textarea>' : ''));
      Array.prototype.forEach.call(rv.querySelectorAll('.bl-ap'), function (bt) {
        bt.addEventListener('click', function () { putOwn({ st: o.st === bt.dataset.v ? 'waiting' : bt.dataset.v, okBy: staffName() }); draw(); });
      });
      var ta = rv.querySelector('textarea');
      if (ta) ta.addEventListener('change', function () { putOwn({ note: ta.value.trim() }); });
      body.appendChild(rv);
    }
    if (!ours) {
      var acts = el('div', 'qo-acts');
      var ed = el('button', 'pq-link', 'Change our idea');
      ed.type = 'button';
      ed.addEventListener('click', function () { ownOpen = true; draft = null; ownMissing = false; draw(); });
      var rm = el('button', 'pq-link', 'Remove it');
      rm.type = 'button';
      rm.addEventListener('click', function () {
        if (!confirm('Remove “' + o.title + '”?')) return;
        setMeta('own', null); draw();
      });
      acts.appendChild(ed); acts.appendChild(rm);
      body.appendChild(acts);
    }
    box.appendChild(card);
    return box;
  }
  function staffName() { try { return localStorage.getItem('rj-staff-name') || 'Facilitator'; } catch (e) { return 'Facilitator'; } }
  function putOwn(fields) { setMeta('own', Object.assign({}, meta('own') || {}, fields)); }

  // The form for our own quest. Changing it sends it back for an OK.
  function ownForm(o) {
    if (!draft) draft = o ? { title: o.title, what: o.what, learn: o.learn, make: o.make, weeks: o.weeks, cat: o.cat } : { title: '', what: '', learn: '', make: '', weeks: 0, cat: 'sol' };
    var f = el('form', 'qo-form');
    f.innerHTML = '<p class="pq-sub">Fill in every box. A facilitator will look at it and say OK, then you can choose it.</p>' +
      OWN_QS.map(function (q) {
        var bad = ownMissing && !String(draft[q.id] || '').trim();
        return '<label class="pb-field' + (bad ? ' is-missing' : '') + '"><span>' + q.label + ' *</span><em>' + q.hint + '</em>' +
          (q.one ? '<input type="text" maxlength="60" data-k="' + q.id + '" placeholder="' + esc(q.ph) + '" value="' + esc(draft[q.id]) + '">'
            : '<textarea rows="3" data-k="' + q.id + '" placeholder="' + esc(q.ph) + '">' + esc(draft[q.id]) + '</textarea>') + '</label>';
      }).join('') +
      '<label class="pb-field' + (ownMissing && !draft.weeks ? ' is-missing' : '') + '"><span>How long? *</span><em>If you start next week, this is when it must be ready.</em>' +
        '<select data-k="weeks"><option value="">Choose…</option>' + [2, 3, 4].map(function (n) {
          return '<option value="' + n + '"' + (+draft.weeks === n ? ' selected' : '') + '>' + n + ' weeks · ready by ' + Q.nice(Q.deadline(today(), n).date) + '</option>';
        }).join('') + '</select></label>' +
      '<div class="pb-field"><span>What kind?</span><div class="pb-pick">' + ['sol', 'sci'].map(function (k) {
        return '<button type="button" class="pq-seg' + (draft.cat === k ? ' is-on' : '') + '" data-cat="' + k + '">' + esc(Q.CATS[k].name) + '</button>';
      }).join('') + '</div></div>' +
      (ownMissing ? '<p class="qo-miss">Fill in every box marked * first.</p>' : '') +
      '<div class="qo-acts"><button type="submit" class="pq-btn">Send to a facilitator</button><button type="button" class="pq-btn pq-btn-ghost qo-cancel">Cancel</button></div>';
    Array.prototype.forEach.call(f.querySelectorAll('[data-k]'), function (x) {
      x.addEventListener(x.tagName === 'SELECT' ? 'change' : 'input', function () {
        draft[x.dataset.k] = x.value;
        if (x.value.trim()) x.parentNode.classList.remove('is-missing');
      });
    });
    Array.prototype.forEach.call(f.querySelectorAll('[data-cat]'), function (bt) {
      bt.addEventListener('click', function () { draft.cat = bt.dataset.cat; draw(); });
    });
    f.querySelector('.qo-cancel').addEventListener('click', function () { ownOpen = false; draft = null; ownMissing = false; draw(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = {};
      OWN_QS.forEach(function (q) { d[q.id] = String(draft[q.id] || '').trim(); });
      d.weeks = +draft.weeks;
      if (OWN_QS.some(function (q) { return !d[q.id]; }) || !d.weeks) { ownMissing = true; draw(); return; }
      d.cat = draft.cat;
      d.by = KID ? ME : staffName();
      d.st = 'waiting'; d.note = ''; d.okBy = '';
      setMeta('own', d);
      ownOpen = false; draft = null; ownMissing = false;
      draw();
    });
    return f;
  }

  /* ---------- Quest Pack ---------- */

  var folds = {};
  function fold(key, title, inner) {
    var d = el('details', 'qp-fold');
    d.open = !!folds[key];
    d.appendChild(el('summary', '', title));
    d.appendChild(inner);
    d.addEventListener('toggle', function () { folds[key] = d.open; });
    return d;
  }
  function sec(icon, tone, title, note) {
    return el('section', 'qp-sec' + (tone === 'bad' ? ' qp-bnd' : ''), '<div class="qp-h"><span class="qp-n qp-' + tone + '">' + icon + '</span><h3>' + title + '</h3>' + (note ? '<small>' + note + '</small>' : '') + '</div>');
  }
  function tiles(list, cls) {
    return '<div class="qp-tiles">' + list.map(function (r) { return '<div class="' + cls + '"><span class="e">' + r[0] + '</span>' + esc(r[1]) + '</div>'; }).join('') + '</div>';
  }

  function packView() {
    var b = project(meta('project')), c = CARDS[b.id], p = PACKS[b.id], due = deadline();
    var wrap = el('div', 'qp');
    wrap.appendChild(el('div', 'qp-hero',
      '<div class="qp-ic">' + (c ? c.icon : b.own ? '💡' : '⭐') + '</div><div><h2>' + esc(b.title) + '</h2><p>' + esc(p ? p.goal : (c ? c.tag : b.what)) + '</p>' +
      '<div class="qp-chips"><span>⏱ ' + Q.weeksFor(b) + ' weeks</span>' + (due ? '<span>🎯 Ready by ' + Q.nice(due.date) + '</span>' : '') + '<span>📚 ' + esc(c ? c.learn : b.learn) + '</span></div></div>'));

    if (b.own) {
      // Our own quest: the team's own words stand in for a Quest Pack.
      var oq = sec('💡', 'green', 'Our own quest', 'we made this up');
      oq.insertAdjacentHTML('beforeend', '<div class="qp-make"><div class="qp-tile"><span class="e">🎁</span><b>What we make</b><span>' + esc(b.make) + '</span></div>' +
        '<div class="qp-tile"><span class="e">🧠</span><b>What we learn</b><span>' + esc(b.learn) + '</span></div></div>');
      wrap.appendChild(oq);
    } else if (!p) {
      wrap.appendChild(el('section', 'qp-sec qp-wait', '<div class="qp-h"><span class="qp-n qp-good">📦</span><h3>Your Quest Pack is on its way</h3></div>' +
        '<p>A facilitator is getting it ready for you: what you must make, when it’s done, the boundaries and the rules. Start <b>Our Plan</b> while you wait.</p>'));
    } else {
      var wh = sec('👥', 'blue', 'Who it’s for');
      wh.insertAdjacentHTML('beforeend', '<p class="qp-text">' + esc(p.who) + '</p>');
      wrap.appendChild(wh);
      var mk = sec('📦', 'green', 'What we must make', p.make.length + ' things');
      mk.insertAdjacentHTML('beforeend', '<div class="qp-make">' + p.make.map(function (m) {
        return '<div class="qp-tile"><span class="e">' + m[0] + '</span><b>' + esc(m[1]) + '</b><span>' + esc(m[2]) + '</span></div>';
      }).join('') + '</div>');
      wrap.appendChild(mk);
      // The team ticks each line when it's true; the bar shows how close they are.
      var ticked = p.done.filter(function (d, i) { return meta('done_' + i); }).length;
      var dn = sec('🏁', 'good', 'Done looks like…', ticked + ' of ' + p.done.length + ' ticked');
      dn.insertAdjacentHTML('beforeend', '<div class="qp-bar"><span style="width:' + Math.round(ticked / p.done.length * 100) + '%"></span></div>' +
        (ticked === p.done.length ? '<p class="qp-all">🎉 Everything is ticked! Show a facilitator at your Look Back.</p>' : '') +
        '<div class="qp-done">' + p.done.map(function (d, i) {
          var t = meta('done_' + i);
          return '<button type="button" class="qp-ck' + (t ? ' is-on' : '') + '" data-i="' + i + '"><i>' + (t ? '✓' : '') + '</i><span>' + esc(d) + (t && t.by ? '<small>' + esc(t.by) + '</small>' : '') + '</span></button>';
        }).join('') + '</div>' +
        (p.notDone ? '<div class="qp-not">✗ <span><b>Not done:</b> ' + esc(p.notDone) + '</span></div>' : ''));
      // At the end, a facilitator checks it really is done.
      var chk = meta('doneOk');
      if (chk) dn.insertAdjacentHTML('beforeend', '<p class="qp-checked">✓ Checked by ' + esc(chk.by) + ': it’s done!</p>');
      else if (!KID && ticked === p.done.length) {
        var cb = el('button', 'pq-btn', '✓ I’ve checked it: it’s done');
        cb.type = 'button';
        cb.addEventListener('click', function () { setMeta('doneOk', { by: niceName(staffName()), at: new Date().toISOString() }); draw(); });
        dn.appendChild(cb);
      } else dn.insertAdjacentHTML('beforeend', '<p class="qp-note">When every box is ticked, a facilitator checks it with you.</p>');
      Array.prototype.forEach.call(dn.querySelectorAll('.qp-ck'), function (bt) {
        bt.addEventListener('click', function () {
          var k = 'done_' + bt.dataset.i;
          setMeta(k, meta(k) ? null : { by: KID ? ME : 'Facilitator' });
          draw();
        });
      });
      wrap.appendChild(dn);
      // Examples of what a finished thing looks like.
      (p.looks || []).forEach(function (lk) {
        var ls = sec('👀', 'green', 'Make it look like this: ' + esc(lk.title));
        ls.insertAdjacentHTML('beforeend', '<div class="qp-look"><div class="qp-sample">' + lk.sample + '</div><div><div class="qp-sub">Must have</div><ul class="qp-must">' +
          lk.must.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div></div>');
        wrap.appendChild(ls);
      });
      (p.formats || []).forEach(function (fm) {
        var fs = sec('📄', 'blue', esc(fm.title), 'use this format');
        fs.insertAdjacentHTML('beforeend', (fm.note ? '<p class="qp-note">' + esc(fm.note) + '</p>' : '') +
          '<div class="qp-table-wrap"><table class="qp-table"><thead><tr>' + fm.cols.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          fm.rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>');
        wrap.appendChild(fs);
      });
      // Core Skills put to use: Maths, Science and Language.
      var subj = function (list) { return '<div class="qp-uses">' + list.map(function (u) { return '<div><b>' + esc(u[0]) + '</b><span>' + esc(u[1]) + '</span></div>'; }).join('') + '</div>'; };
      var sk = sec('🧠', 'green', 'Skills we’ll build', 'new things we learn to do');
      sk.insertAdjacentHTML('beforeend', subj(p.skills));
      wrap.appendChild(sk);
      var us = sec('📚', 'blue', 'Learning we’ll use', 'from Core Skills');
      us.insertAdjacentHTML('beforeend', subj(p.uses));
      wrap.appendChild(us);
      var bu = sec('💰', 'good', 'Budget');
      bu.insertAdjacentHTML('beforeend', '<p class="qp-text">Spend up to <b>' + rupees(window.T3_BUDGET || 1000) + '</b> on materials. Plan what you need on <b>Our Plan</b>.</p>');
      wrap.appendChild(bu);
      var sh = sec('🎤', 'green', 'Showcase', '15–20 minutes');
      sh.insertAdjacentHTML('beforeend', '<p class="qp-note">Show and talk about:</p><ul class="qp-list">' + (window.T3_EVERY_SHOW || []).concat(p.show || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>');
      wrap.appendChild(sh);
      var bd = sec('🛑', 'bad', 'Boundaries', 'never cross these');
      bd.insertAdjacentHTML('beforeend', '<p class="qp-note">For our ' + esc(b.title.toLowerCase()) + ':</p>' + tiles(p.bounds, 'qp-nv') +
        '<div class="qp-ask">🙋 Not sure if something is OK? Ask a facilitator <b>before</b> you do it.</div>');
      wrap.appendChild(bd);
    }
    var ru = sec('📏', 'blue', 'Quest rules');
    ru.insertAdjacentHTML('beforeend', (p && p.rules ? tiles(p.rules, 'qp-rule qp-rule-q') + '<div class="qp-sub">Every quest</div>' : '') + tiles(window.T3_EVERY_RULES || [], 'qp-rule'));
    wrap.appendChild(ru);

    var change = el('button', 'pq-link', 'Change our quest');
    change.type = 'button';
    change.addEventListener('click', function () { changing = true; draw(); window.scrollTo(0, 0); });
    wrap.appendChild(change);
    return wrap;
  }

  /* ---------- Our Plan ---------- */

  /* The team makes its own plan, in five steps, each with a question and
     a grey example and a ✅ once it's done:
       1. Quest Masters: who leads each quest week (everyone gets a turn).
       2. Parts: the parts the team breaks the quest into, who leads each,
          and the week it will be ready.
       3. Jobs: the small jobs in each part, and who does each.
       4. Shopping list: what to buy, how many, the cost and which part
          it's for, against the budget (T3_BUDGET).
       5. Timeline: what will be finished by the end of each week.
     Nothing is filled in for them. Names are tap buttons. Once every step
     is done the team sends it to a facilitator, who OKs it or asks for
     changes; on OK, every job goes onto the Board, in Backlog.
     Kept in plan: { <id>: { title, lead, ready (quest week), jobs: [{ id,
     t, who, card }], order } }, shop: { <id>: { what, qty, cost, part,
     order } }, and in meta: master<school week>, pgoal_<n>, noShop and
     planOk { st: 'waiting' | 'yes' | 'change', note, by, at }. Sending
     locks the plan for Risers; "Change our plan" opens it again (and it
     needs OKing again). */
  function questWeeks() {
    var b = project(meta('project'));
    if (!b || !meta('started')) return [];
    var first = Q.startWeek(meta('started')), out = [];
    for (var i = 0; i < Q.weeksFor(b); i++) {
      var w = Q.WEEKS[first - 1 + i];
      if (w) out.push({ n: i + 1, school: first + i, from: w[0], to: w[1] });
    }
    return out;
  }
  function shortDate(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  function listOf(map) {
    return Object.keys(state[map]).map(function (id) { return Object.assign({ id: id }, state[map][id]); })
      .filter(function (x) { return !x.deleted; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function parts() { return listOf('plan'); }
  function shop() { return listOf('shop'); }
  function putIn(map, id, fields) {
    state[map][id] = Object.assign({}, state[map][id] || {}, fields, { u: now() });
    changed();
  }
  function putPart(id, fields) { putIn('plan', id, fields); }
  function niceName(n) { return n ? n.charAt(0).toUpperCase() + n.slice(1) : n; }
  function rupees(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function shopTotal() { return shop().reduce(function (n, x) { return n + (+x.cost || 0); }, 0); }
  function filled(v) { return String(v == null ? '' : v).trim() !== ''; }

  function planView() {
    var ok = meta('planOk') || {};
    var edit = !KID || !(ok.st === 'waiting' || ok.st === 'yes');
    var weeks = questWeeks(), due = deadline(), budget = window.T3_BUDGET || 1000;
    var wrap = el('div', 'pl');
    wrap.appendChild(el('div', 'pb-intro', '<h2>Our plan</h2><p>Make your plan together, in 5 steps. When every step has a ✅, send it to a facilitator.</p>'));
    if (ok.st === 'waiting') wrap.appendChild(el('p', 'pl-status is-wait', '⏳ Sent to a facilitator' + (ok.by ? ' by ' + esc(ok.by) : '') + '. Waiting for an OK.'));
    if (ok.st === 'yes') wrap.appendChild(el('p', 'pl-status is-ok', '✓ OK’d by ' + esc(ok.by || 'a facilitator') + '. Your jobs are on the Board.' + (ok.note ? ' <span>“' + esc(ok.note) + '”</span>' : '')));
    if (ok.st === 'change') wrap.appendChild(el('p', 'pl-status is-change', '✏️ A facilitator asked for changes' + (ok.note ? ': <b>' + esc(ok.note) + '</b>' : '.') + ' Change the plan, then send it again.'));
    var progress = el('p', 'pl-progress');
    wrap.appendChild(progress);

    var list = parts(), items = shop();
    var checks = [
      weeks.length && weeks.every(function (w) { return master(w.school); }),
      list.length && list.every(function (x) { return filled(x.title) && x.lead && x.ready; }),
      list.length && list.every(function (x) { return (x.jobs || []).length && x.jobs.every(function (j) { return filled(j.t) && j.who; }); }),
      (meta('noShop') || (items.length && items.every(function (x) { return filled(x.what) && filled(x.qty) && filled(x.cost); }))) && shopTotal() <= budget,
      weeks.length && weeks.every(function (w) { return filled(meta('pgoal_' + w.n, '')); })
    ];
    var doneCount = checks.filter(Boolean).length;
    progress.innerHTML = '<b>' + doneCount + ' of 5 steps done</b>' + '<span class="pl-dots">' + checks.map(function (c) { return '<i class="' + (c ? 'is-on' : '') + '"></i>'; }).join('') + '</span>';

    function step(n, title, question) {
      var s = el('section', 'pl-step' + (checks[n - 1] ? ' is-done' : ''), '<h3><span class="pl-sn">' + (checks[n - 1] ? '✅' : n) + '</span>' + title + '</h3><p class="pl-q">' + question + '</p>');
      wrap.appendChild(s);
      return s;
    }
    // Name buttons: tap one (tap again to clear).
    function names(sel, pick, small) {
      var row = el('div', 'pl-names' + (small ? ' is-small' : ''));
      group.kids.forEach(function (k) {
        var b = el('button', 'pl-name' + (sel === k ? ' is-on' : ''), esc(k));
        b.type = 'button';
        b.disabled = !edit;
        b.addEventListener('click', function () { pick(sel === k ? '' : k); draw(); });
        row.appendChild(b);
      });
      return row;
    }
    function weekBtns(sel, pick) {
      var row = el('div', 'pl-names is-small');
      weeks.forEach(function (w) {
        var b = el('button', 'pl-name' + (+sel === w.n ? ' is-on' : ''), 'Week ' + w.n);
        b.type = 'button';
        b.disabled = !edit;
        b.addEventListener('click', function () { pick(+sel === w.n ? '' : w.n); draw(); });
        row.appendChild(b);
      });
      return row;
    }
    function text(value, ph, onInput, cls) {
      if (!edit) return el('span', 'pl-val' + (cls ? ' ' + cls : ''), filled(value) ? esc(value) : '–');
      var i = el('input', 'pl-in' + (cls ? ' ' + cls : ''));
      i.value = value == null ? '' : value;
      i.placeholder = ph;
      i.addEventListener('input', function () { onInput(i.value); });
      return i;
    }
    function addBtn(label, fn) {
      var b = el('button', 'pq-link pl-add', label);
      b.type = 'button';
      b.addEventListener('click', fn);
      return b;
    }
    function del(fn) {
      var b = el('button', 'pl-x', '✕');
      b.type = 'button';
      b.setAttribute('aria-label', 'Remove');
      b.addEventListener('click', fn);
      return b;
    }
    function focusLast(sel) { var all = app.querySelectorAll(sel); if (all.length) all[all.length - 1].focus(); }

    // 1. Quest Masters.
    var s1 = step(1, '👑 Quest Masters', 'Who will be Quest Master each week? Everyone gets a turn.');
    weeks.forEach(function (w) {
      var row = el('div', 'pl-line', '<span class="pl-lab">Week ' + w.n + ' <small>' + shortDate(w.from) + '–' + shortDate(w.to) + '</small></span>');
      row.appendChild(names(master(w.school), function (k) { setMeta('master' + w.school, k); }));
      s1.appendChild(row);
    });
    var turns = group.kids.filter(function (k) { return !weeks.some(function (w) { return master(w.school) === k; }); });
    if (edit && turns.length && turns.length < group.kids.length && weeks.length >= group.kids.length) s1.appendChild(el('p', 'pl-hint', 'Not had a turn yet: ' + turns.map(esc).join(', ')));

    // 2. Parts.
    var s2 = step(2, '🧩 Parts', 'Look at “What we must make” in your Quest Pack. Break it into parts. Who leads each part, and which week will it be ready?');
    list.forEach(function (x, i) {
      var card = el('div', 'pl-part');
      var head = el('div', 'pl-line pl-phead', '<span class="pl-num">' + (i + 1) + '</span>');
      head.appendChild(text(x.title, 'e.g. Test stool', function (v) { putPart(x.id, { title: v }); }, 'pl-ptitle'));
      if (edit) head.appendChild(del(function () { if (confirm('Remove “' + (x.title || 'this part') + '” and its jobs?')) { putPart(x.id, { deleted: true }); draw(); } }));
      card.appendChild(head);
      var r1 = el('div', 'pl-line', '<span class="pl-lab">Leads it</span>');
      r1.appendChild(names(x.lead, function (k) { putPart(x.id, { lead: k }); }, true));
      var r2 = el('div', 'pl-line', '<span class="pl-lab">Ready in</span>');
      r2.appendChild(weekBtns(x.ready, function (n) { putPart(x.id, { ready: n }); }));
      card.appendChild(r1); card.appendChild(r2);
      s2.appendChild(card);
    });
    if (edit) s2.appendChild(addBtn('+ Add a part', function () { putPart(uid(), { title: '', jobs: [], order: now() }); draw(); focusLast('.pl-ptitle'); }));

    // 3. Jobs.
    var s3 = step(3, '🔨 Jobs', 'What small jobs does each part need? Who does each one?');
    if (!list.length) s3.appendChild(el('p', 'pb-empty', 'Add your parts in step 2 first.'));
    list.forEach(function (x) {
      var card = el('div', 'pl-part', '<h4>' + esc(x.title || 'Part') + '</h4>');
      (x.jobs || []).forEach(function (j, ji) {
        var row = el('div', 'pl-job');
        var upd = function (f) { var js = (state.plan[x.id].jobs || []).slice(); js[ji] = Object.assign({}, js[ji], f); putPart(x.id, { jobs: js }); };
        row.appendChild(text(j.t, 'e.g. Cut the cardboard', function (v) { upd({ t: v }); }, 'pl-jt'));
        row.appendChild(names(j.who, function (k) { upd({ who: k }); }, true));
        if (edit) row.appendChild(del(function () { var js = (state.plan[x.id].jobs || []).slice(); js.splice(ji, 1); putPart(x.id, { jobs: js }); draw(); }));
        card.appendChild(row);
      });
      if (edit) card.appendChild(addBtn('+ Add a job', function () {
        putPart(x.id, { jobs: (state.plan[x.id].jobs || []).concat([{ id: uid(), t: '', who: '' }]) });
        draw(); focusLast('.pl-part .pl-jt');
      }));
      s3.appendChild(card);
    });

    // 4. Shopping list.
    var s4 = step(4, '🛒 Shopping list', 'What do you need to buy? How many? What will it cost? Your budget is ' + rupees(budget) + '.');
    if (!meta('noShop')) {
      var tbl = el('div', 'pl-shop');
      tbl.appendChild(el('div', 'pl-srow pl-shead', '<span>What</span><span>How many</span><span>Cost ₹</span><span>For which part</span><span></span>'));
      items.forEach(function (x) {
        var row = el('div', 'pl-srow');
        row.appendChild(text(x.what, 'e.g. Glue sticks', function (v) { putIn('shop', x.id, { what: v }); }, 'pl-sw'));
        row.appendChild(text(x.qty, 'e.g. 4', function (v) { putIn('shop', x.id, { qty: v }); }));
        var cost = text(x.cost, 'e.g. 120', function (v) { putIn('shop', x.id, { cost: v === '' ? '' : Math.max(0, +v || 0) }); paintTotal(); });
        if (edit) { cost.type = 'number'; cost.min = '0'; cost.inputMode = 'numeric'; }
        row.appendChild(cost);
        if (edit) {
          var ps = el('select', 'pl-in');
          ps.innerHTML = '<option value="">Choose…</option>' + list.map(function (p) { return '<option value="' + p.id + '"' + (x.part === p.id ? ' selected' : '') + '>' + esc(p.title || 'Part') + '</option>'; }).join('') + '<option value="all"' + (x.part === 'all' ? ' selected' : '') + '>Everything</option>';
          ps.addEventListener('change', function () { putIn('shop', x.id, { part: ps.value }); });
          row.appendChild(ps);
          row.appendChild(del(function () { putIn('shop', x.id, { deleted: true }); draw(); }));
        } else {
          var pp = list.filter(function (p) { return p.id === x.part; })[0];
          row.appendChild(el('span', 'pl-val', x.part === 'all' ? 'Everything' : pp ? esc(pp.title) : '–'));
          row.appendChild(el('span'));
        }
        tbl.appendChild(row);
      });
      s4.appendChild(tbl);
      if (edit) s4.appendChild(addBtn('+ Add something to buy', function () { putIn('shop', uid(), { what: '', qty: '', cost: '', order: now() }); draw(); focusLast('.pl-sw'); }));
    }
    var total = el('p', 'pl-total');
    function paintTotal() {
      var spent = shopTotal();
      total.className = 'pl-total' + (spent > budget ? ' is-over' : '');
      total.innerHTML = '🧾 Total: <b>' + rupees(spent) + '</b> of ' + rupees(budget) + (spent > budget ? ' · ⚠️ ' + rupees(spent - budget) + ' over. Find cheaper things, or buy less.' : ' · ' + rupees(budget - spent) + ' left');
    }
    paintTotal();
    if (!meta('noShop')) s4.appendChild(total);
    if (edit || meta('noShop')) {
      var none = el('label', 'pl-none', '<input type="checkbox"' + (meta('noShop') ? ' checked' : '') + (edit ? '' : ' disabled') + '> We don’t need to buy anything');
      none.querySelector('input').addEventListener('change', function () { setMeta('noShop', this.checked); draw(); });
      s4.appendChild(none);
    }

    // 5. Timeline.
    var s5 = step(5, '📅 Our timeline', 'What will you have finished by the end of each week?' + (due ? ' Everything must be ready by <b>' + Q.nice(due.date) + '</b>.' : ''));
    weeks.forEach(function (w, i) {
      var row = el('div', 'pl-week', '<div class="pl-wk"><b>Week ' + w.n + '</b><small>' + shortDate(w.from) + '–' + shortDate(w.to) + '</small>' + (i === weeks.length - 1 && due ? '<em>🎉 Ready by ' + esc(Q.nice(due.date)) + '</em>' : '') + '</div>');
      var right = el('div');
      right.appendChild(text(meta('pgoal_' + w.n, ''), 'e.g. All 3 stools built and tested', function (v) { setMeta('pgoal_' + w.n, v); }, 'pl-goal'));
      var these = list.filter(function (x) { return +x.ready === w.n; });
      if (these.length) right.appendChild(el('p', 'pl-due', 'Your parts for this week: ' + these.map(function (x) { return '<b>' + esc(x.title || 'part') + '</b>'; }).join(', ')));
      row.appendChild(right);
      s5.appendChild(row);
    });

    // Send, change, or (staff) OK.
    var bar = el('div', 'pl-send');
    var msg = el('span', 'rf-msg');
    if (KID && edit) {
      var send = el('button', 'pq-btn', 'Send our plan to a facilitator');
      send.type = 'button';
      send.disabled = doneCount < 5;
      bar.appendChild(el('p', 'pq-sub', doneCount < 5 ? 'Finish all 5 steps to send it.' : 'All 5 steps done!'));
      send.addEventListener('click', function () {
        if (!confirm('Send your plan to a facilitator? You can’t change it while they look at it.')) return;
        setMeta('planOk', { st: 'waiting', by: ME, at: new Date().toISOString() });
        draw();
      });
      bar.appendChild(send);
    } else if (KID) {
      var ch = el('button', 'pq-link', 'Change our plan');
      ch.type = 'button';
      ch.addEventListener('click', function () {
        if (!confirm('Change the plan? A facilitator will need to OK it again.')) return;
        setMeta('planOk', { st: '', was: ok.st });
        draw();
      });
      bar.appendChild(ch);
    } else {
      var note = el('textarea', 'pl-note');
      note.rows = 2;
      note.placeholder = 'A note for the team (what to change, or well done)';
      note.value = ok.st === 'change' ? ok.note || '' : '';
      var yes = el('button', 'pq-btn', '✓ OK the plan');
      yes.type = 'button';
      yes.addEventListener('click', function () {
        if (!parts().length) { msg.textContent = 'There’s no plan to OK yet.'; return; }
        // Every job not yet on the Board goes into Backlog.
        var n = 0;
        parts().forEach(function (x) {
          var js = (x.jobs || []).map(function (j) {
            if (j.card || !filled(j.t)) return j;
            var cid = uid();
            putCard(cid, { title: (x.title ? x.title + ': ' : '') + j.t.trim(), col: 'backlog', who: [j.who || ''], order: now() + n++, by: 'facilitator', part: x.id });
            return Object.assign({}, j, { card: cid });
          });
          putPart(x.id, { jobs: js });
        });
        setMeta('planOk', { st: 'yes', by: niceName(staffName()), note: note.value.trim(), at: new Date().toISOString() });
        draw();
      });
      var no = el('button', 'pq-btn pq-btn-ghost', 'Ask for changes');
      no.type = 'button';
      no.addEventListener('click', function () {
        if (!note.value.trim()) { msg.textContent = 'Write what to change in the note.'; note.focus(); return; }
        setMeta('planOk', { st: 'change', by: niceName(staffName()), note: note.value.trim(), at: new Date().toISOString() });
        draw();
      });
      bar.appendChild(el('p', 'pq-sub', (ok.st === 'waiting' ? 'The team has sent this plan. OK it, or ask for changes.' : ok.st === 'yes' ? 'OK’d. If the team adds jobs and you OK it again, the new jobs go onto the Board too.' : 'The team hasn’t sent this plan yet.') + ' ' + doneCount + ' of 5 steps done.'));
      bar.appendChild(note);
      bar.appendChild(yes);
      bar.appendChild(no);
    }
    bar.appendChild(msg);
    wrap.appendChild(bar);
    return wrap;
  }

  /* ---------- Board ---------- */

  var COLS = [
    { id: 'backlog', name: 'Backlog', hint: 'Every job our quest needs.' },
    { id: 'todo', name: 'This week', hint: 'Jobs for this week.' },
    { id: 'doing', name: 'Doing', hint: 'What I’m on now.' },
    { id: 'done', name: 'Done', hint: 'Finished this week.' }
  ];

  // "No", "nothing", "none" and the like aren't something in the way.
  function saysNo(t) { return /^\s*(no+|nope|none|nothing|nah|not really|no one|nil|-+|n\/a)\s*[.!]*\s*$/i.test(t || ''); }
  // Everything someone is stuck on: stuck jobs and stand-up answers.
  function openBlockers() {
    var list = Object.keys(state.blockers).map(function (id) { return Object.assign({ id: id }, state.blockers[id]); })
      .filter(function (x) { return !x.deleted && !x.solved && x.what; });
    cards().filter(function (c) { return c.stuck && c.col !== 'done'; }).forEach(function (c) {
      list.push({ id: 'card_' + c.id, card: c.id, what: c.title + (c.stuckNote ? ': ' + c.stuckNote : ''), who: [owner(c)], at: c.u });
    });
    return list.sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
  }
  function putBlocker(id, fields) {
    state.blockers[id] = Object.assign({}, state.blockers[id] || {}, fields, { u: now() });
    changed();
  }
  function canSort(x) { return !KID || isMaster() || (x.who || []).indexOf(ME) !== -1; }

  function stuckEl() {
    var list = openBlockers();
    var wrap = el('section', 'pb-blockers has-open', '<h2>🚩 Stuck</h2>');
    list.forEach(function (x) {
      var row = el('div', 'pb-bl', '<div class="pb-bl-main"><strong>' + esc(x.what) + '</strong><small>' + (x.who || []).filter(Boolean).map(esc).join(', ') + '</small></div>' +
        (canSort(x) ? '<button type="button" class="pq-seg">✓ Sorted</button>' : ''));
      var bt = row.querySelector('button');
      if (bt) bt.addEventListener('click', function () {
        if (x.card) putCard(x.card, { stuck: false, stuckNote: '' });
        else putBlocker(x.id, { solved: true, solvedAt: now() });
        draw();
      });
      wrap.appendChild(row);
    });
    return wrap;
  }

  function boardView() {
    var outer = el('div');
    var goal = (state.checkins['w' + (sprint() - 1)] || {}).next;
    if (goal) outer.appendChild(el('p', 'pb-goal-line', '<b>Our goal this week:</b> ' + esc(goal)));
    if (openBlockers().length) outer.appendChild(stuckEl());
    var wrap = el('div', 'pb-board');
    COLS.forEach(function (col, ci) {
      var list = inCol(col.id);
      var c = el('section', 'pb-col pb-col-' + col.id, '<div class="pb-col-head"><h2>' + col.name + ' <em>' + list.length + '</em></h2><p>' + col.hint + '</p></div>');
      if (col.id === 'backlog') { c.appendChild(addForm()); c.appendChild(ideasEl()); }
      list.forEach(function (card) {
        var own = mine(card), name = owner(card);
        var k = el('article', 'pb-card' + (card.stuck ? ' is-stuck' : '') + (own ? '' : ' is-theirs'));
        k.innerHTML =
          '<button type="button" class="pb-card-main"' + (own ? '' : ' disabled') + '>' +
          '<span class="pb-card-title">' + (card.stuck ? '🚩 ' : '') + esc(card.title) + '</span>' +
          (name ? '<span class="pb-card-who"><span class="pb-av pb-av-' + kidIndex(name) + '">' + esc(initial(name)) + '</span>' + esc(name) + '</span>' : '') +
          '</button>' +
          (own ? '<div class="pb-moves">' +
            (ci > 0 ? '<button type="button" class="pb-move" data-d="-1" aria-label="Move back">&larr;</button>' : '<span></span>') +
            (col.id !== 'done' ? '<button type="button" class="pb-sos' + (card.stuck ? ' is-on' : '') + '">' + (card.stuck ? '✓ Sorted?' : '🆘 Stuck') + '</button>' : '') +
            (ci < COLS.length - 1 ? '<button type="button" class="pb-move" data-d="1" aria-label="Move on">&rarr;</button>' : '') +
          '</div>' : '');
        if (own) {
          k.querySelector('.pb-card-main').addEventListener('click', function () { editCard(card); });
          Array.prototype.forEach.call(k.querySelectorAll('.pb-move'), function (b) {
            b.addEventListener('click', function () { moveCard(card, ci + (+b.dataset.d)); });
          });
          var sos = k.querySelector('.pb-sos');
          if (sos) sos.addEventListener('click', function () {
            if (card.stuck) { putCard(card.id, { stuck: false, stuckNote: '' }); draw(); return; }
            var why = prompt('What’s in the way?', '');
            if (why === null) return;
            putCard(card.id, { stuck: true, stuckNote: why.trim() });
            draw();
          });
        }
        c.appendChild(k);
      });
      wrap.appendChild(c);
    });
    outer.appendChild(wrap);
    return outer;
  }

  function moveCard(card, i) {
    var to = COLS[i].id, f = { col: to, order: now() };
    if (to === 'done') { f.doneWeek = sprint(); f.stuck = false; }
    putCard(card.id, f);
    draw();
  }

  // "Need ideas?": a few starter jobs for my role (or every role), one tap to add.
  var ideasOpen = false;
  function ideasEl() {
    var b = project(meta('project')), box = el('div', 'pb-ideas');
    if (!b || !b.resp) return box;
    var r = KID ? meta('role_' + ME) : null;
    var pool = (r !== null && r !== undefined && b.resp[r]) ? b.resp[r] : [].concat(b.resp[0] || [], b.resp[1] || [], b.resp[2] || []);
    var have = cards().map(function (c) { return c.title; });
    var list = pool.filter(function (t) { return have.indexOf(t) === -1; }).slice(0, 3);
    if (!list.length) return box;
    var t = el('button', 'pb-ideas-btn', ideasOpen ? 'Hide ideas' : '💡 Need ideas?');
    t.type = 'button';
    t.addEventListener('click', function () { ideasOpen = !ideasOpen; draw(); });
    box.appendChild(t);
    if (ideasOpen) list.forEach(function (idea) {
      var row = el('button', 'pb-idea', '<span>' + esc(idea) + '</span><b>+ Add</b>');
      row.type = 'button';
      row.addEventListener('click', function () {
        putCard(uid(), { title: idea, col: 'backlog', who: [KID ? ME : ''], order: now(), by: KID ? ME : 'facilitator' });
        draw();
      });
      box.appendChild(row);
    });
    return box;
  }

  function addForm() {
    var f = el('form', 'pb-add',
      '<input type="text" placeholder="Add a job" aria-label="New job">' +
      (KID ? '' : '<select aria-label="Whose job"><option value="">Whose job?</option>' + group.kids.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('') + '</select>') +
      '<button type="submit" class="pb-add-btn">Add</button>');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = f.querySelector('input').value.trim();
      var whose = KID ? ME : f.querySelector('select').value;
      if (!t || !whose) return;
      putCard(uid(), { title: t, col: 'backlog', who: [whose], order: now(), by: KID ? ME : 'facilitator' });
      draw();
      var again = app.querySelector('.pb-add input');
      if (again) again.focus();
    });
    return f;
  }

  function editCard(card) {
    var c = Object.assign({}, card);
    var box = el('div', 'pb-modal');
    function paint() {
      box.innerHTML = '<div class="pb-modal-card" role="dialog" aria-label="Change job">' +
        '<label class="pb-field"><span>Job</span><input type="text" class="pb-e-title" value="' + esc(c.title) + '"></label>' +
        '<div class="pb-field"><div class="pb-pick"><button type="button" class="pb-chip pb-chip-stuck' + (c.stuck ? ' is-on' : '') + '" data-stuck="1">🚩 I’m stuck on this</button></div>' +
          (c.stuck ? '<input type="text" class="pb-e-note" placeholder="What’s in the way?" value="' + esc(c.stuckNote || '') + '">' : '') + '</div>' +
        '<div class="pb-modal-actions"><button type="button" class="pb-del">Delete</button><span></span>' +
          '<button type="button" class="eot2-btn eot2-btn-secondary pb-cancel">Cancel</button><button type="button" class="pb-save">Save</button></div>' +
        '</div>';
      var title = box.querySelector('.pb-e-title');
      title.addEventListener('input', function () { c.title = title.value; });
      var note = box.querySelector('.pb-e-note');
      if (note) note.addEventListener('input', function () { c.stuckNote = note.value; });
      box.querySelector('[data-stuck]').addEventListener('click', function () { c.stuck = !c.stuck; paint(); });
      box.querySelector('.pb-cancel').addEventListener('click', close);
      box.querySelector('.pb-del').addEventListener('click', function () {
        if (!confirm('Delete “' + card.title + '”?')) return;
        putCard(card.id, { deleted: true });
        close(); draw();
      });
      box.querySelector('.pb-save').addEventListener('click', function () {
        if (!c.title.trim()) return;
        putCard(card.id, { title: c.title.trim(), stuck: !!c.stuck, stuckNote: c.stuck ? (c.stuckNote || '') : '' });
        close(); draw();
      });
    }
    function close() { box.remove(); }
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    paint();
    document.body.appendChild(box);
  }

  /* ---------- Stand-up ---------- */

  var STANDUP_QS = [
    { id: 'did', label: 'What did I do last time?' },
    { id: 'will', label: 'What will I do today?' },
    { id: 'stuck', label: 'Is anything in my way?' }
  ];

  function standupView() {
    var wrap = el('div', 'pb-standup');
    var day = today(), dow = new Date().getDay();
    var who = master();
    var together = dow === 1 || dow === 3;
    var how = dow === 2 ? 'Today you work on your own. Fill in your own card when you start.'
      : together ? (who ? esc(who) : 'The Quest Master') + ' runs the stand-up at the start of the session and types everyone’s card.'
      : 'Stand-ups are on quest days: Monday, Tuesday and Wednesday.';
    wrap.appendChild(el('div', 'pb-intro', '<h2>Stand-up · ' + niceDate(day) + '</h2><p>' + how + '</p>'));
    var grid = el('div', 'pb-su-grid');
    group.kids.forEach(function (k, i) {
      var id = day + '_' + k.toLowerCase();
      var rec = state.standups[id] || {};
      // Monday and Wednesday: only the Quest Master types, on every card.
      // Tuesday: each Riser types only their own. Staff can always type.
      var edit = !KID || (together ? isMaster() : dow === 2 && k === ME);
      var card = el('div', 'pb-su-card' + (edit ? '' : ' is-locked'));
      card.innerHTML = '<h3><span class="pb-av pb-av-' + i + '">' + esc(initial(k)) + '</span>' + esc(k) + '</h3>' +
        STANDUP_QS.map(function (q) {
          return '<label class="pb-field"><span>' + q.label + '</span><textarea rows="2" data-q="' + q.id + '"' + (edit ? '' : ' readonly') + '>' + esc(rec[q.id] || '') + '</textarea></label>';
        }).join('');
      // "What will I do today?" can go straight onto the Board, in Doing.
      if (edit) {
        var will = card.querySelector('textarea[data-q="will"]');
        var addJob = el('button', 'pq-link pb-addjob', '+ Add as a job');
        addJob.type = 'button';
        addJob.addEventListener('click', function () {
          var mineNow = cards().filter(function (c) { return owner(c) === k && c.col !== 'done'; }).map(function (c) { return c.title.toLowerCase(); });
          var lines = will.value.split(/\n+/).map(function (x) { return x.replace(/^[-•*\d.)\s]+/, '').trim(); }).filter(Boolean);
          var added = 0;
          lines.forEach(function (t) {
            if (mineNow.indexOf(t.toLowerCase()) !== -1) return;
            putCard(uid(), { title: t, col: 'doing', who: [k], order: now(), by: KID ? ME : 'facilitator' });
            added++;
          });
          addJob.textContent = !lines.length ? 'Write what you’ll do first' : added ? '✓ Added to Doing' : '✓ Already on the Board';
        });
        will.addEventListener('input', function () { addJob.textContent = '+ Add as a job'; });
        will.parentNode.after(addJob);
      }
      if (edit) Array.prototype.forEach.call(card.querySelectorAll('textarea'), function (ta) {
        ta.addEventListener('input', function () {
          var r = Object.assign({}, state.standups[id] || { date: day, kid: k });
          r[ta.dataset.q] = ta.value;
          r.u = now();
          state.standups[id] = r;
          changed();
        });
        // A real answer to "Is anything in my way?" shows on the board as stuck.
        if (ta.dataset.q === 'stuck') ta.addEventListener('change', function () {
          var bid = 'su_' + id, t = ta.value.trim(), had = state.blockers[bid];
          if (t && !saysNo(t)) {
            if (!had || had.what !== t) putBlocker(bid, { what: t, who: [k], at: (had && had.at) || now(), solved: had ? had.solved : false });
          } else if (had && !had.solved) putBlocker(bid, { deleted: true });
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
            return '<p><em>' + q.label + '</em> ' + esc(r[q.id]) + '</p>';
          }).join('') + '</div>';
        }).join('')));
      });
      wrap.appendChild(hist);
    }
    return wrap;
  }

  /* ---------- Look Back (the check-in) ---------- */

  var TRACK = [['on', 'On track'], ['bit', 'A bit behind'], ['behind', 'Behind']];
  var FINISHED = [['yes', 'Yes'], ['partly', 'Partly'], ['no', 'No']];

  /* The Wednesday Look Back, 30 minutes, kept short and simple.
     Part 1 · Our quest work (15 min): the team talks; the Quest Master
     types. Did we finish what we said we would (and what we finished),
     are we on track, what went well, what we'll do better, and what we'll
     have finished by next Wednesday. Then everyone moves their jobs for
     next week into This week on the Board. A facilitator adds a note and
     ticks that they were there, which closes the Look Back.
     The Quest Master presses Submit once everything is answered; until
     then teammates see only that it's being filled in, and after it the
     form is read-only for everyone (staff can reopen it).
     Part 2 · Our teamwork (15 min): each Riser's reflection (reflect.js),
     which they submit themselves. */
  // The Wednesday of the week that starts on Monday mon (YYYY-MM-DD).
  function wedOf(mon) { var p = mon.split('-'); return new Date(+p[0], +p[1] - 1, +p[2] + 2); }
  function checkinView() {
    var w = sprint(), id = 'w' + w;
    var rec = state.checkins[id] || {};
    // The facilitator's note and tick are their own item, so the Quest
    // Master typing at the same moment can't undo them.
    var fac = state.checkins[id + '_staff'] || { note: rec.note, signed: rec.signed };
    // Part 1 is filled in by the Quest Master (or staff) and goes to the
    // team when they press Submit; then it's read-only (staff can reopen).
    var submitted = !!rec.submitted;
    var edit = (!KID || isMaster()) && !submitted;
    var closed = !!fac.signed;
    var lastGoal = (state.checkins['w' + (w - 1)] || {}).next;
    function put(fields) {
      var r = Object.assign({}, state.checkins[id] || {}, fields);
      r.u = now();
      state.checkins[id] = r;
      rec = r;
      changed();
    }
    function field(key, label, hint) {
      var f = el('label', 'pb-field', (label ? '<span>' + label + '</span>' : '') + '<em>' + (edit ? hint : '') + '</em><textarea rows="2"' + (edit ? '' : ' readonly') + '>' + esc(rec[key] || '') + '</textarea>');
      if (edit) f.querySelector('textarea').addEventListener('input', function () { var o = {}; o[key] = this.value; put(o); });
      return f;
    }
    function segs(key, opts) {
      var row = el('div', 'pb-segs');
      opts.forEach(function (o) {
        var b = el('button', 'pq-seg' + (rec[key] === o[0] ? ' is-on' : ''), esc(o[1]));
        b.type = 'button';
        b.disabled = !edit;
        b.addEventListener('click', function () {
          var o2 = {}; o2[key] = rec[key] === o[0] ? '' : o[0];
          put(o2);
          Array.prototype.forEach.call(row.children, function (x, i) { x.classList.toggle('is-on', rec[key] === opts[i][0]); });
        });
        row.appendChild(b);
      });
      return row;
    }
    function block(title, cls) {
      var b = el('section', 'pb-ci-block' + (cls ? ' ' + cls : ''), '<h3>' + title + '</h3>');
      wrap.appendChild(b);
      return b;
    }

    var wrap = el('div', 'pb-checkin');
    // Check-ins start in quest week 1: the week a team chooses its quest
    // is for getting ready. (Records stay keyed by the school week.)
    var qw = questWeek();
    // A Riser trying Term 3 out (assets/brand.js LH_TRIAL), and staff
    // looking at their team, can open it early to see how it works.
    var trial = qw && qw.n < 1 && (window.LH_TRIAL || []).some(function (t) {
      return KID ? ME.toLowerCase() === t : group.kids.some(function (k) { return k.toLowerCase() === t; });
    });
    if (qw && qw.n < 1 && !trial) {
      var first = Q.WEEKS[Q.startWeek(meta('started')) - 1];
      wrap.appendChild(el('div', 'pb-intro', '<h2>Look Back</h2><p>Your first Look Back is on Wednesday of quest week 1' +
        (first ? ' (' + Q.nice(wedOf(first[0])) + ')' : '') + '. This week, get ready: read the Quest Pack and fill in Our Plan.</p>'));
      return wrap;
    }
    var label = trial ? 'Quest week 1' : qw ? 'Quest week ' + qw.n : 'Week ' + w;
    if (trial) wrap.appendChild(el('p', 'pb-ci-trial', '👀 Try-out: opened early so you can see how it works. The real first Look Back is on Wednesday of quest week 1.' + (KID ? '' : ' Clear it afterwards on the Try-out page.')));
    wrap.appendChild(el('div', 'pb-intro', '<h2>' + label + ': Look Back</h2><p>Wednesday, 30 minutes. <b>Part 1</b>: together, ' +
      esc(master() || 'the Quest Master') + ' types (15 min). <b>Part 2</b>: on your own computer (15 min).</p>'));
    wrap.appendChild(el('div', 'pb-part-head', '<h3>Part 1 · Our quest work <small>(15 minutes)</small></h3><p>Talk together. ' + esc(master() || 'The Quest Master') + ' fills it in.</p>'));

    if (KID && !isMaster() && !submitted) {
      wrap.appendChild(el('p', 'pb-ci-wait', '✍️ ' + esc(master() || 'The Quest Master') + ' is filling in Part 1 with your team. It shows here once it’s submitted.'));
    } else {
      partA();
    }
    function partA() {
      if (submitted) wrap.appendChild(el('p', 'pb-ci-sent', '✓ Part 1 submitted' + (rec.submittedBy ? ' by ' + esc(rec.submittedBy) : '') + '.'));
      // Did we finish?
      var b1 = block('✅ Did we finish?');
      var done = inCol('done'), stuck = openBlockers();
      var firstWeek = trial || (qw && qw.n === 1);
      if (lastGoal && !firstWeek) {
        b1.appendChild(el('p', 'pb-ci-q', 'Last week we said we’d finish: <b>' + esc(lastGoal) + '</b>'));
        b1.appendChild(segs('finished', FINISHED));
      }
      b1.appendChild(el('div', 'pb-ci-done', '<h4>What we finished this week</h4>' + (done.length ? '<ul>' + done.map(function (c) { return '<li>' + esc(c.title) + ' <small>' + esc(owner(c)) + '</small></li>'; }).join('') + '</ul>' : '<p class="pb-empty">Nothing in Done yet.</p>') +
        (stuck.length ? '<h4>Still stuck</h4><ul>' + stuck.map(function (x) { return '<li>' + esc(x.what) + '</li>'; }).join('') + '</ul>' : '')));

      var due = deadline();
      var b2 = block('⏱️ Are we on track' + (due ? ' for ' + esc(Q.nice(due.date)) : '') + '?');
      b2.appendChild(segs('track', TRACK));

      block('👍 What went well?').appendChild(field('keep', '', 'e.g. We split the jobs on Monday.'));
      block('🔧 What will we do better?').appendChild(field('change', '', 'e.g. Start straight away, without waiting for each other.'));
      block('🎯 By next Wednesday, we will have finished…').appendChild(field('next', '', 'e.g. All six holes built.'));

      // Submit: everything answered, then it goes to the team.
      if (edit) {
        var bar = el('div', 'pb-ci-submit');
        var sub = el('button', 'pq-btn', 'Submit Part 1');
        sub.type = 'button';
        var smsg = el('span', 'rf-msg');
        sub.addEventListener('click', function () {
          var left = [];
          if (lastGoal && !firstWeek && !rec.finished) left.push('Did we finish?');
          if (!rec.track) left.push('Are we on track?');
          if (!String(rec.keep || '').trim()) left.push('What went well?');
          if (!String(rec.change || '').trim()) left.push('What will we do better?');
          if (!String(rec.next || '').trim()) left.push('By next Wednesday…');
          if (left.length) { smsg.textContent = 'Still to answer: ' + left.join(', '); return; }
          if (!confirm('Submit Part 1? Your team will see it, and it can’t be changed after this.')) return;
          put({ submitted: new Date().toISOString(), submittedBy: KID ? ME : staffName() });
          draw();
        });
        bar.appendChild(sub); bar.appendChild(smsg);
        wrap.appendChild(bar);
      } else if (submitted && !KID) {
        var reopen = el('button', 'pq-link', 'Reopen Part 1 so it can be changed');
        reopen.type = 'button';
        reopen.addEventListener('click', function () { put({ submitted: '', submittedBy: '' }); draw(); });
        wrap.appendChild(reopen);
      }

      var move = el('div', 'pb-ci-move', '<p><b>Now everyone:</b> move your jobs for next week into <b>This week</b> on the Board.</p>');
      var go = el('button', 'pq-btn pq-btn-ghost', 'Open the Board');
      go.type = 'button';
      go.addEventListener('click', function () {
        tab = 'board';
        history.replaceState(null, '', KID ? '?tab=board' : '?group=' + group.id + '&tab=board');
        draw();
        window.scrollTo(0, 0);
      });
      move.appendChild(go);
      wrap.appendChild(move);
    }

    // Facilitator: a note, and the tick that closes the Look Back.
    function putFac(fields) {
      fac = Object.assign({}, fac, fields, { u: now() });
      state.checkins[id + '_staff'] = fac;
      changed();
    }
    if (!KID || fac.note) {
      var b7 = block('Facilitator', 'pb-ci-staff');
      var note = el('label', 'pb-field pb-note', '<span>Facilitator note</span><em>' + (KID ? '' : 'What you noticed, and any help promised.') + '</em><textarea rows="2"' + (KID ? ' readonly' : '') + '>' + esc(fac.note || '') + '</textarea>');
      if (!KID) note.querySelector('textarea').addEventListener('input', function () { putFac({ note: this.value }); });
      b7.appendChild(note);
      if (!KID) {
        var sign = el('label', 'pb-sign', '<input type="checkbox"' + (closed ? ' checked' : '') + '> Facilitator was at this Look Back. <small>Ticking it closes the Look Back: anyone who hasn’t submitted Part 2 is marked absent.</small>');
        sign.querySelector('input').addEventListener('change', function () {
          if (this.checked && !confirm('Close this week’s Look Back? Anyone who hasn’t submitted Part 2 will be marked absent.')) { this.checked = false; return; }
          putFac({ signed: this.checked, closedAt: this.checked ? new Date().toISOString() : '' });
          draw();
        });
        b7.appendChild(sign);
      }
    }
    if (KID && closed) wrap.appendChild(el('p', 'pb-ci-closed', '✓ This Look Back is closed.'));

    // Part 2.
    var rf = el('div');
    wrap.appendChild(rf);
    if (window.T3_reflect) window.T3_reflect(rf, group, KID ? ME : '', w, {
      closed: closed,
      label: label,
      first: trial || (!!qw && qw.n === 1),
      addTry: function (t) {
        putCard(uid(), { title: '🤝 ' + t, col: 'todo', who: [ME], order: now(), by: ME, kind: 'try' });
        return true;
      }
    });
    return wrap;
  }

  /* ---------- staff overview: every team at a glance ---------- */

  function glance(s, g) {
    s = s || blank();
    var m = function (k, f) { var x = s.meta[k]; return x && x.v !== undefined ? x.v : f; };
    var w = Q.weekOf();
    var all = Object.keys(s.cards).map(function (id) { return s.cards[id]; }).filter(function (c) { return c && !c.deleted; });
    var open = all.filter(function (c) { return c.col === 'todo' || c.col === 'doing'; });
    var done = all.filter(function (c) { return c.col === 'done' && c.doneWeek === w; });
    var day = today();
    var stood = g.kids.filter(function (k) {
      var r = s.standups[day + '_' + k.toLowerCase()];
      return r && (r.did || r.will || r.stuck);
    });
    var ci = s.checkins['w' + w + '_staff'] || s.checkins['w' + w] || {};
    var b = project(m('project'), s);
    return {
      build: b ? b.title : '', due: b && m('started') ? Q.deadline(m('started'), Q.weeksFor(b)) : null,
      idea: s.meta.own && s.meta.own.v && s.meta.own.v.st === 'waiting' ? s.meta.own.v.title : '',
      plan: !!(s.meta.planOk && s.meta.planOk.v && s.meta.planOk.v.st === 'waiting'),
      master: m('master' + w, '') || m('director' + w, ''), week: w, goal: (s.checkins['w' + (w - 1)] || {}).next || '',
      got: done.length, total: done.length + open.length,
      stuck: all.filter(function (c) { return c.stuck && c.col !== 'done'; }).map(function (c) { return c.title; })
        .concat(Object.keys(s.blockers || {}).map(function (id) { return s.blockers[id]; }).filter(function (x) { return x && x.what && !x.solved && !x.deleted; }).map(function (x) { return x.what; })),
      stood: stood, signed: !!ci.signed
    };
  }

  function overview(main) {
    function paint(boards) {
      setStatus('Updated', 'is-ok');
      main.innerHTML = '';
      var list = el('div', 'pb-ov');
      list.appendChild(el('div', 'pb-ov-row pb-ov-headrow',
        '<span>Team</span><span>This week</span><span>Jobs</span><span>Stuck</span><span>Stand-up today</span><span>Look Back</span>'));
      GROUPS.forEach(function (g, i) {
        var a = glance(boards[i], g);
        var pct = a.total ? Math.round(a.got / a.total * 100) : 0;
        var row = el('a', 'pb-ov-row');
        row.href = '?group=' + g.id;
        row.innerHTML =
          '<span class="pb-ov-group"><strong>' + g.name + '</strong><em>' + esc(a.build || 'No quest chosen yet') + '</em>' + (a.idea ? '<small class="qo-flag">💡 Own quest idea to OK: ' + esc(a.idea) + '</small>' : '') + (a.plan ? '<small class="qo-flag">📝 Plan to OK</small>' : '') + (a.due ? '<small>Ready by ' + Q.nice(a.due.date) + '</small>' : '') + '<small>' + g.kids.join(', ') + '</small></span>' +
          '<span class="pb-ov-week"><small>Week ' + a.week + '</small><strong>' + (a.master ? 'Quest Master: ' + esc(a.master) : '<em class="pb-ov-none">No Quest Master yet</em>') + '</strong>' + (a.goal ? '<em>' + esc(a.goal) + '</em>' : '') + '</span>' +
          '<span class="pb-ov-prog">' + (a.total ? '<span class="pb-track"><span style="width:' + pct + '%"></span></span><em>' + a.got + ' of ' + a.total + ' done this week</em>' : '<em class="pb-ov-none">No jobs this week</em>') + '</span>' +
          '<span class="pb-ov-stuck">' + (a.stuck.length ? '<strong class="pb-ov-flag" title="' + esc(a.stuck.join(', ')) + '">🚩 ' + a.stuck.length + '</strong>' : '<em class="pb-ov-none">—</em>') + '</span>' +
          '<span class="pb-ov-stand">' + (a.stood.length === g.kids.length ? '<em class="is-ok">Everyone</em>'
            : a.stood.length ? '<em>Missing: ' + g.kids.filter(function (k) { return a.stood.indexOf(k) === -1; }).map(esc).join(', ') + '</em>'
            : '<em class="pb-ov-none">Not done yet</em>') + '</span>' +
          '<span class="pb-ov-check">' + (a.signed ? '<strong class="is-ok">✓ Week ' + a.week + '</strong>' : '<em class="pb-ov-none">Not yet</em>') + '</span>';
        list.appendChild(row);
      });
      main.appendChild(list);
    }
    function fetchAll() {
      return Promise.all(GROUPS.map(function (g) {
        return window.eot2Fetch('term-3', g.id, 'board').then(function (d) { return d && d.state; });
      })).then(paint);
    }
    fetchAll();
    setInterval(function () { if (!document.hidden) fetchAll(); }, 30000);
  }

  render();
})();
