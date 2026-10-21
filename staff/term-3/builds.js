/* Term 3 Quests, staff: every project in the pool with its level, which
   groups can see it (quest-data.js LEVELS), which groups chose it (from
   each group's board record), and whether staff approved it. Risers only
   see approved projects; one marked "Tweak", "Maybe" or "Not approved"
   carries a note (the tweak suggested, what you're unsure about, or what
   to change) and stays hidden until it's changed and approved. A team's
   own quest idea is OK'd on that team's board. */
(function () {
  var Q = window.T3Q, POOL = window.T3_POOL || [];
  var app = document.getElementById('app');
  var ui = { cat: 'all', level: 0, status: 'all' };
  var picks = {}, approvals = {};
  var STAFF = '';
  try { STAFF = localStorage.getItem('rj-staff-name') || ''; } catch (e) {}
  function status(id) { var a = approvals[id]; return a && ['yes', 'tweak', 'maybe', 'no'].indexOf(a.v) !== -1 ? a.v : 'none'; }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function m(s, k) { var x = s && s.meta && s.meta[k]; return x ? x.v : undefined; }

  function chips(list, key) {
    var row = el('div', 'bl-chips');
    list.forEach(function (o) {
      var b = el('button', 'bl-chip' + (ui[key] === o[0] ? ' is-on' : ''), o[1]);
      b.type = 'button';
      b.addEventListener('click', function () { ui[key] = o[0]; draw(); });
      row.appendChild(b);
    });
    return row;
  }

  function draw() {
    var body = app.querySelector('.bl-body');
    body.innerHTML = '';
    // Each group's project, if chosen.
    var chosen = el('div', 'bl-groups');
    Q.GROUPS.forEach(function (g) {
      var p = picks[g.id];
      // A team's own quest has its own name and length (meta.own).
      var b = p && (p.project === 'own' ? p.own && { title: p.own.title, weeks: +p.own.weeks } : POOL.filter(function (x) { return x.id === p.project; })[0]);
      var due = b && p.started ? Q.deadline(p.started, Q.weeksFor(b)) : null;
      var a = el('a', 'bl-group', '<strong>' + g.name + '</strong><span>' + g.kids.join(', ') + '</span>' +
        '<em>' + (b ? esc(b.title) + (due ? ' · expected by ' + Q.nice(due.date) : '') : 'No project chosen yet') + '</em>' +
        (p && p.own && p.own.st === 'waiting' ? '<small class="qo-flag">💡 Own quest idea to OK: ' + esc(p.own.title) + '</small>' : '') +
        '<small>Sees level ' + Q.LEVELS[g.id].join(' and ') + ' projects</small>');
      a.href = 'board.html?group=' + g.id + '&tab=project';
      chosen.appendChild(a);
    });
    body.appendChild(chosen);
    body.appendChild(chips([['all', 'Everything'], ['sol', Q.CATS.sol.name], ['sci', Q.CATS.sci.name]], 'cat'));
    body.appendChild(chips([[0, 'All levels'], [1, 'Level 1'], [2, 'Level 2'], [3, 'Level 3']], 'level'));
    var count = function (v) { return POOL.filter(function (b) { return status(b.id) === v; }).length; };
    body.appendChild(chips([['all', 'Any'], ['none', 'To check (' + count('none') + ')'], ['yes', 'Approved (' + count('yes') + ')'], ['tweak', 'Tweak (' + count('tweak') + ')'], ['maybe', 'Maybe (' + count('maybe') + ')'], ['no', 'Not approved (' + count('no') + ')']], 'status'));
    ['sol', 'sci'].forEach(function (cat) {
      if (ui.cat !== 'all' && ui.cat !== cat) return;
      var list = POOL.filter(function (b) { return b.cat === cat && (!ui.level || b.level === ui.level) && (ui.status === 'all' || status(b.id) === ui.status); })
        .sort(function (x, y) { return x.level - y.level || x.title.localeCompare(y.title); });
      body.appendChild(el('h2', 'pq-cat pq-cat-' + cat, esc(Q.CATS[cat].name) + ' <span>(' + list.length + ')</span>'));
      var grid = el('div', 'pq-grid');
      list.forEach(function (b) {
        var sees = Q.GROUPS.filter(function (g) { return Q.LEVELS[g.id].indexOf(b.level) !== -1; }).map(function (g) { return g.name; });
        var by = Q.GROUPS.filter(function (g) { return picks[g.id] && picks[g.id].project === b.id; }).map(function (g) { return g.name; });
        var card = el('article', 'pq-card pq-' + cat + ' bl-st-' + status(b.id),
          '<span class="pq-level">Level ' + b.level + '</span><h3>' + esc(b.title) + '</h3>' +
          '<p class="pq-what">' + esc(b.what) + '</p>' +
          '<p><b>' + Q.CATS[cat].hookLbl + ':</b> ' + esc(b.hook) + '</p>' +
          '<p><b>You’ll make:</b> ' + esc(b.make) + '</p>' +
          '<p class="pq-learn"><b>Learning:</b> ' + esc(b.learn) + '<br><b>Learning outcome:</b> ' + esc(b.lo) + '</p>' +
          '<p class="pq-time">About ' + Q.weeksFor(b) + ' weeks · shown to ' + (sees.length ? sees.join(', ') : 'no group') + '</p>' +
          '<details class="pq-peek"><summary>Who does what</summary><ul>' + Q.ROLES[b.cat].map(function (r, j) {
            return '<li>' + r.icon + ' <b>' + esc(r.name) + ':</b> ' + b.resp[j].map(esc).join(' · ') + '</li>';
          }).join('') + '</ul></details>' +
          (by.length ? '<p class="bl-by">Chosen by ' + by.join(', ') + '</p>' : ''));
        card.appendChild(approvalEl(b));
        grid.appendChild(card);
      });
      body.appendChild(grid);
    });
  }

  // Approve or not; a note on what to change when it's not.
  function approvalEl(b) {
    var a = approvals[b.id] || {}, st = status(b.id);
    var box = el('div', 'bl-approve',
      '<div class="bl-approve-btns">' +
        '<button type="button" class="bl-ap bl-ap-yes' + (st === 'yes' ? ' is-on' : '') + '" data-v="yes">✓ Approved</button>' +
        '<button type="button" class="bl-ap bl-ap-tweak' + (st === 'tweak' ? ' is-on' : '') + '" data-v="tweak">✎ Tweak</button>' +
        '<button type="button" class="bl-ap bl-ap-maybe' + (st === 'maybe' ? ' is-on' : '') + '" data-v="maybe">? Maybe</button>' +
        '<button type="button" class="bl-ap bl-ap-no' + (st === 'no' ? ' is-on' : '') + '" data-v="no">✗ Not approved</button>' +
      '</div>' +
      (st === 'no' || st === 'maybe' || st === 'tweak' ? '<textarea rows="2" placeholder="' + (st === 'no' ? 'What needs to change?' : st === 'tweak' ? 'What tweak do you suggest?' : 'What are you unsure about?') + '">' + esc(a.note || '') + '</textarea>' : '') +
      (a.by ? '<small>' + (st === 'yes' ? 'Approved' : st === 'no' ? 'Not approved' : st === 'maybe' ? 'Maybe' : st === 'tweak' ? 'Tweak suggested' : 'Changed') + ' by ' + esc(a.by) + '</small>' : '') +
      (st === 'yes' ? '' : '<small class="bl-hidden">Risers can’t see this yet.</small>'));
    function save(fields) {
      box.classList.add('is-saving');
      Q.saveApproval(b.id, Object.assign({ by: STAFF }, fields)).then(function (items) {
        if (!items) { alert('Not saved — check the connection.'); box.classList.remove('is-saving'); return; }
        approvals = items; draw();
      });
    }
    Array.prototype.forEach.call(box.querySelectorAll('.bl-ap'), function (bt) {
      bt.addEventListener('click', function () { save({ v: st === bt.dataset.v ? '' : bt.dataset.v }); });
    });
    var ta = box.querySelector('textarea');
    // Grow the note box to fit what's written.
    function fit() { if (ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px'; } }
    if (ta) { ta.addEventListener('input', fit); setTimeout(fit, 0); }
    if (ta) ta.addEventListener('change', function () { save({ note: ta.value.trim() }); });
    return box;
  }

  app.innerHTML = '';
  app.appendChild(el('div', 'dash-crumb', '<a href="index.html">&larr; Term 3</a>'));
  app.appendChild(el('header', 'hd-page-head pb-head', '<div><p class="hd-eyebrow">Term 3</p><h1>Term 3 Quests</h1>' +
    '<p>Approve each project before Risers can choose it. Each group sees only approved projects at its own levels, and more than one group can choose the same project.</p></div>' +
    '<a class="bl-boards" href="board.html">Project boards &rarr;</a>'));
  app.appendChild(el('div', 'bl-body', '<p>Loading…</p>'));
  Promise.all(Q.GROUPS.map(function (g) {
    return window.eot2Fetch('term-3', g.id, 'board').then(function (d) {
      var s = d && d.state;
      picks[g.id] = m(s, 'project') || m(s, 'own') ? { project: m(s, 'project'), started: m(s, 'started'), own: m(s, 'own') } : null;
    });
  }).concat(Q.fetchApprovals().then(function (a) { approvals = a; }))).then(draw, draw);
})();
