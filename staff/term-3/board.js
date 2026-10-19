/* Term 3 Quests — a team's quest, in four parts:

   - Quest Pack: what we'll make and learn, who does what (three roles,
     named by what the person does, with what each looks after in this
     project), and the materials list the team brainstorms.
   - Board: Backlog → This week → Doing → Done. Each Riser adds and moves
     only their own jobs (tagged with their name) and sees everyone's. A
     job can be flagged "I'm stuck".
   - Stand-up, on quest days. The Quest Master runs it on Monday and
     Wednesday; on Tuesday each Riser fills in their own card. A Riser
     fills in only their own card; the Quest Master can fill in anyone's.
   - Check-in, once a week on Wednesday. Only the Quest Master and
     facilitators fill it in; a facilitator adds a note and marks it seen.

   A team chooses its quest one week and starts it the next. Each week the
   team picks a Quest Master in the top line (the turn goes round); once
   picked, only a facilitator can change it that week. The week is always
   today's school week.

   One shared record per team, saved through the progress Worker under
   group "term-3", kid = the group id, week "board": meta (project,
   started, role_<Kid>, master<week>), cards, standups, checkins, blockers
   and materials. Every item carries the time it last changed (u); saving
   fetches the latest copy and keeps the newer version of each, so two
   Risers working at once don't wipe each other's changes. Deleted items
   are kept as { deleted: true }. The page refreshes from other devices
   every 15 seconds. A team chooses only from the levels set for it in
   quest-data.js and never sees the levels. */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  var Q = window.T3Q;
  var GROUPS = Q.GROUPS;
  var POOL = window.T3_POOL || [];
  var CARDS = window.T3_CARDS || {}, PACKS = window.T3_PACKS || {};
  function project(id) { return POOL.filter(function (b) { return b.id === id; })[0] || null; }
  var WEEKS = Q.WEEKS.map(function (w, i) { return i + 1; });
  var MAPS = ['meta', 'cards', 'standups', 'checkins', 'blockers', 'materials'];

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

  function blank() { return { meta: {}, cards: {}, standups: {}, checkins: {}, blockers: {}, materials: {} }; }
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
      .then(function () { setStatus(dirty ? 'Saving…' : 'Saved', dirty ? '' : 'is-ok'); draw(); });
  }
  // Projects staff have approved; Risers only see these.
  var approvals = {};
  function approved(b) { var a = approvals[b.id]; return a && a.v === 'yes'; }

  var TABS = [['pack', 'Quest Pack'], ['board', 'Board'], ['standup', 'Stand-up'], ['checkin', 'Check-in']];

  function draw() {
    var main = app.querySelector('.pb-main');
    if (!main) return;
    var y = window.scrollY;
    main.innerHTML = '';
    if (!meta('project') || changing) { main.appendChild(chooserView(project(meta('project')))); return; }
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
    main.appendChild(tab === 'pack' ? packView() : tab === 'standup' ? standupView() : tab === 'checkin' ? checkinView() : boardView());
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
      '<span>Quest Master: ' + (KID && master() ? '<b>' + esc(master()) + '</b>' :
        '<select class="pb-master" aria-label="Quest Master this week"><option value="">Choose…</option>' +
        group.kids.map(function (k) { return '<option' + (master() === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>' +
        (master() ? '' : ' <small>Not had a turn yet: ' + notYet().map(esc).join(', ') + '</small>')) + '</span>' +
      (due ? '<span>Ready by <b>' + Q.nice(due.date) + '</b></span>' : ''));
    var sel = line.querySelector('.pb-master');
    if (sel) sel.addEventListener('change', function () {
      // Once a Riser picks, it stays for the week; a facilitator can change it.
      if (KID && !confirm(this.value + ' is Quest Master this week?')) { this.value = ''; return; }
      setMeta('master' + w, this.value); draw();
    });
    return line;
  }

  /* ---------- choosing the quest ---------- */

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
    if (!shown) wrap.appendChild(el('p', 'pb-empty', KID ? 'Your quests are on their way. Check back soon.' : 'No projects approved for this team yet. Approve them on the Term 3 Quests page.'));
    return wrap;
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
      '<div class="qp-ic">' + (c ? c.icon : '⭐') + '</div><div><h2>' + esc(b.title) + '</h2><p>' + esc(p ? p.mission : (c ? c.tag : b.what)) + '</p>' +
      '<div class="qp-chips"><span>⏱ ' + Q.weeksFor(b) + ' weeks</span>' + (due ? '<span>🎯 Ready by ' + Q.nice(due.date) + '</span>' : '') + '<span>📚 ' + esc(c ? c.learn : b.learn) + '</span></div></div>'));

    if (!p) {
      wrap.appendChild(el('section', 'qp-sec qp-wait', '<div class="qp-h"><span class="qp-n qp-good">📦</span><h3>Your Quest Pack is on its way</h3></div>' +
        '<p>A facilitator is getting it ready for you: what you must make, when it’s done, the boundaries and the rules. Start your Materials list while you wait.</p>'));
    } else {
      var mk = sec('📦', 'green', 'What we must make', p.make.length + ' things');
      mk.insertAdjacentHTML('beforeend', '<div class="qp-make">' + p.make.map(function (m) {
        return '<div class="qp-tile"><span class="e">' + m[0] + '</span><b>' + esc(m[1]) + '</b><span>' + esc(m[2]) + '</span></div>';
      }).join('') + '</div>');
      wrap.appendChild(mk);
      // The team ticks each line when it's true; the bar shows how close they are.
      var ticked = p.done.filter(function (d, i) { return meta('done_' + i); }).length;
      var dn = sec('🏁', 'good', 'It’s done when…', ticked + ' of ' + p.done.length + ' ticked');
      dn.insertAdjacentHTML('beforeend', '<div class="qp-bar"><span style="width:' + Math.round(ticked / p.done.length * 100) + '%"></span></div>' +
        (ticked === p.done.length ? '<p class="qp-all">🎉 Everything is ticked! Show a facilitator at your check-in.</p>' : '') +
        '<div class="qp-done">' + p.done.map(function (d, i) {
          var t = meta('done_' + i);
          return '<button type="button" class="qp-ck' + (t ? ' is-on' : '') + '" data-i="' + i + '"><i>' + (t ? '✓' : '') + '</i><span>' + esc(d) + (t && t.by ? '<small>' + esc(t.by) + '</small>' : '') + '</span></button>';
        }).join('') + '</div>' +
        (p.notDone ? '<div class="qp-not">✗ <span><b>Not done:</b> ' + esc(p.notDone) + '</span></div>' : ''));
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
      var bd = sec('🛑', 'bad', 'Boundaries', 'never cross these');
      bd.insertAdjacentHTML('beforeend', '<p class="qp-note">For our ' + esc(b.title.toLowerCase()) + ':</p>' + tiles(p.bounds, 'qp-nv') +
        '<div class="qp-ask">🙋 Not sure if something is OK? Ask a facilitator <b>before</b> you do it.</div>');
      wrap.appendChild(bd);
    }
    var ru = sec('📏', 'blue', 'Quest rules');
    ru.insertAdjacentHTML('beforeend', (p && p.rules ? tiles(p.rules, 'qp-rule qp-rule-q') + '<div class="qp-sub">Every quest</div>' : '') + tiles(window.T3_EVERY_RULES || [], 'qp-rule'));
    wrap.appendChild(ru);

    // Who does what: pick your own role.
    var roles = Q.ROLES[b.cat];
    var sec2 = el('div', 'pq-sec-in', '<p class="pq-sub">Pick one role each. Everyone still helps with everything.</p>');
    var grid = el('div', 'pq-roles');
    roles.forEach(function (r, i) {
      var who = group.kids.filter(function (k) { return meta('role_' + k) === i; });
      var card = el('div', 'pq-role', '<h4>' + r.icon + ' ' + esc(r.name) + '</h4><ul>' + (b.resp[i] || []).map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
        '<p class="pq-holder' + (who.length ? '' : ' is-none') + '">' + (who.length ? who.map(esc).join(' and ') : 'No one yet') + '</p>');
      if (KID) {
        var me = meta('role_' + ME) === i;
        var bt = el('button', 'pq-seg' + (me ? ' is-on' : ''), me ? '✓ This is me' : 'I’ll do this');
        bt.type = 'button';
        bt.addEventListener('click', function () { setMeta('role_' + ME, me ? null : i); draw(); });
        card.appendChild(bt);
      } else {
        var pick = el('select', 'pq-role-pick');
        pick.innerHTML = '<option value="">Add someone…</option>' + group.kids.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
        pick.addEventListener('change', function () { if (this.value) { setMeta('role_' + this.value, i); draw(); } });
        card.appendChild(pick);
      }
      grid.appendChild(card);
    });
    sec2.appendChild(grid);
    wrap.appendChild(fold('roles', '👥 Who does what', sec2));
    wrap.appendChild(fold('mats', '🧰 Materials', materialsEl()));

    var change = el('button', 'pq-link', 'Change our quest');
    change.type = 'button';
    change.addEventListener('click', function () { changing = true; draw(); window.scrollTo(0, 0); });
    wrap.appendChild(change);
    return wrap;
  }

  // The team's own materials list: what, who brings it, got it.
  function materialsEl() {
    var sec = el('div', 'pq-sec-in', '<p class="pq-sub">What do we need to build it? Add everything you can think of.</p>');
    var list = Object.keys(state.materials).map(function (id) { return Object.assign({ id: id }, state.materials[id]); })
      .filter(function (m) { return !m.deleted && m.item; }).sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
    list.forEach(function (m) {
      var row = el('div', 'pq-mat' + (m.got ? ' is-got' : ''),
        '<input type="checkbox"' + (m.got ? ' checked' : '') + ' aria-label="We have it">' +
        '<span class="pq-mat-item">' + esc(m.item) + '</span>' +
        '<span class="pq-mat-who">' + (m.who ? esc(m.who) + ' brings it' : '') + '</span>' +
        (!KID || m.by === ME ? '<button type="button" class="pq-mat-del" aria-label="Remove">✕</button>' : ''));
      row.querySelector('input').addEventListener('change', function () {
        state.materials[m.id] = Object.assign({}, state.materials[m.id], { got: this.checked, u: now() }); changed(); draw();
      });
      var del = row.querySelector('.pq-mat-del');
      if (del) del.addEventListener('click', function () {
        state.materials[m.id] = Object.assign({}, state.materials[m.id], { deleted: true, u: now() }); changed(); draw();
      });
      sec.appendChild(row);
    });
    var f = el('form', 'pb-add pq-mat-add',
      '<input type="text" class="pq-mat-in" placeholder="e.g. 4 wooden planks" aria-label="Material">' +
      '<select aria-label="Who brings it"><option value="">Who brings it?</option>' + group.kids.map(function (k) { return '<option' + (k === ME ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>' +
      '<button type="submit" class="pb-add-btn">Add</button>');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = f.querySelector('.pq-mat-in').value.trim();
      if (!t) return;
      state.materials[uid()] = { item: t, who: f.querySelector('select').value, got: false, by: KID ? ME : 'facilitator', at: now(), u: now() };
      changed(); draw();
      var again = app.querySelector('.pq-mat-in');
      if (again) again.focus();
    });
    sec.appendChild(f);
    return sec;
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
    var how = dow === 2 ? 'Today you work on your own. Fill in your own card when you start.'
      : dow === 1 || dow === 3 ? (who ? esc(who) : 'The Quest Master') + ' runs the stand-up at the start of the session.'
      : 'Stand-ups are on quest days: Monday, Tuesday and Wednesday.';
    wrap.appendChild(el('div', 'pb-intro', '<h2>Stand-up · ' + niceDate(day) + '</h2><p>' + how + '</p>'));
    var grid = el('div', 'pb-su-grid');
    group.kids.forEach(function (k, i) {
      var id = day + '_' + k.toLowerCase();
      var rec = state.standups[id] || {};
      var edit = !KID || k === ME || isMaster();
      var card = el('div', 'pb-su-card' + (edit ? '' : ' is-locked'));
      card.innerHTML = '<h3><span class="pb-av pb-av-' + i + '">' + esc(initial(k)) + '</span>' + esc(k) + '</h3>' +
        STANDUP_QS.map(function (q) {
          return '<label class="pb-field"><span>' + q.label + '</span><textarea rows="2" data-q="' + q.id + '"' + (edit ? '' : ' readonly') + '>' + esc(rec[q.id] || '') + '</textarea></label>';
        }).join('');
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

  /* ---------- Check-in ---------- */

  var CHECKIN_QS = [
    { id: 'keep', label: '👍 Keep doing', hint: 'What worked well this week?' },
    { id: 'change', label: '🔧 Change', hint: 'What will we do differently?' },
    { id: 'shout', label: '⭐ Shout-outs', hint: 'Who helped, and how?' },
    { id: 'next', label: '🎯 Next week’s goal', hint: 'One clear goal.' },
    { id: 'note', label: 'Facilitator note', hint: 'What you noticed, and any help promised.', staff: true }
  ];

  function checkinView() {
    var w = sprint(), id = 'w' + w;
    var rec = state.checkins[id] || {};
    var edit = !KID || isMaster();
    var wrap = el('div', 'pb-checkin');
    wrap.appendChild(el('div', 'pb-intro', '<h2>Week ' + w + ' check-in</h2><p>On Wednesday, at the end of the session. ' +
      esc(master() || 'The Quest Master') + ' runs it and fills it in. A facilitator joins and listens.</p>'));
    var done = inCol('done'), stuck = openBlockers();
    wrap.appendChild(el('div', 'pb-review',
      '<div><h3>What we finished</h3>' + (done.length ? '<ul>' + done.map(function (c) { return '<li>' + esc(c.title) + ' <small>' + esc(owner(c)) + '</small></li>'; }).join('') + '</ul>' : '<p class="pb-empty">Nothing in Done yet.</p>') + '</div>' +
      '<div><h3>Still stuck</h3>' + (stuck.length ? '<ul>' + stuck.map(function (x) { return '<li>' + esc(x.what) + '</li>'; }).join('') + '</ul>' : '<p class="pb-empty">Nothing.</p>') + '</div>'));
    var form = el('div', 'pb-retro');
    CHECKIN_QS.forEach(function (q) {
      var can = q.staff ? !KID : edit;
      if (q.staff && KID && !rec.note) return;
      var f = el('label', 'pb-field' + (q.staff ? ' pb-note' : ''), '<span>' + q.label + '</span><em>' + (can ? q.hint : '') + '</em><textarea rows="2"' + (can ? '' : ' readonly') + '>' + esc(rec[q.id] || '') + '</textarea>');
      if (can) f.querySelector('textarea').addEventListener('input', function () {
        var r = Object.assign({}, state.checkins[id] || {});
        r[q.id] = this.value; r.u = now();
        state.checkins[id] = r;
        changed();
      });
      form.appendChild(f);
    });
    var sign = el('label', 'pb-sign', '<input type="checkbox"' + (rec.signed ? ' checked' : '') + (KID ? ' disabled' : '') + '> Facilitator was at this check-in');
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
    var ci = s.checkins['w' + w] || {};
    return {
      build: projectTitle(m('project'), ''), due: m('project') && m('started') ? deadline(m('project'), m('started')) : null,
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
        '<span>Team</span><span>This week</span><span>Jobs</span><span>Stuck</span><span>Stand-up today</span><span>Check-in</span>'));
      GROUPS.forEach(function (g, i) {
        var a = glance(boards[i], g);
        var pct = a.total ? Math.round(a.got / a.total * 100) : 0;
        var row = el('a', 'pb-ov-row');
        row.href = '?group=' + g.id;
        row.innerHTML =
          '<span class="pb-ov-group"><strong>' + g.name + '</strong><em>' + esc(a.build || 'No quest chosen yet') + '</em>' + (a.due ? '<small>Ready by ' + Q.nice(a.due.date) + '</small>' : '') + '<small>' + g.kids.join(', ') + '</small></span>' +
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
