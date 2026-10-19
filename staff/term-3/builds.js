/* Term 3 Quests, staff: every project in the pool with its level, which
   groups can see it (quest-data.js LEVELS) and which groups chose it (from
   each group's board record). Groups choose on their own Term 3 Quest page;
   a facilitator can also choose for a group from that group's board. */
(function () {
  var Q = window.T3Q, POOL = window.T3_POOL || [];
  var app = document.getElementById('app');
  var ui = { cat: 'all', level: 0 };
  var picks = {};

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
      var b = p && POOL.filter(function (x) { return x.id === p.project; })[0];
      var due = b && p.started ? Q.deadline(p.started, Q.weeksFor(b)) : null;
      var a = el('a', 'bl-group', '<strong>' + g.name + '</strong><span>' + g.kids.join(', ') + '</span>' +
        '<em>' + (b ? esc(b.title) + (due ? ' · expected by ' + Q.nice(due.date) : '') : 'No project chosen yet') + '</em>' +
        '<small>Sees level ' + Q.LEVELS[g.id].join(' and ') + ' projects</small>');
      a.href = 'board.html?group=' + g.id + '&tab=project';
      chosen.appendChild(a);
    });
    body.appendChild(chosen);
    body.appendChild(chips([['all', 'Everything'], ['sol', Q.CATS.sol.name], ['sci', Q.CATS.sci.name]], 'cat'));
    body.appendChild(chips([[0, 'All levels'], [1, 'Level 1'], [2, 'Level 2'], [3, 'Level 3']], 'level'));
    ['sol', 'sci'].forEach(function (cat) {
      if (ui.cat !== 'all' && ui.cat !== cat) return;
      var list = POOL.filter(function (b) { return b.cat === cat && (!ui.level || b.level === ui.level); })
        .sort(function (x, y) { return x.level - y.level || x.title.localeCompare(y.title); });
      body.appendChild(el('h2', 'pq-cat pq-cat-' + cat, esc(Q.CATS[cat].name) + ' <span>(' + list.length + ')</span>'));
      var grid = el('div', 'pq-grid');
      list.forEach(function (b) {
        var sees = Q.GROUPS.filter(function (g) { return Q.LEVELS[g.id].indexOf(b.level) !== -1; }).map(function (g) { return g.name; });
        var by = Q.GROUPS.filter(function (g) { return picks[g.id] && picks[g.id].project === b.id; }).map(function (g) { return g.name; });
        grid.appendChild(el('article', 'pq-card pq-' + cat,
          '<span class="pq-level">Level ' + b.level + '</span><h3>' + esc(b.title) + '</h3>' +
          '<p class="pq-what">' + esc(b.what) + '</p>' +
          '<p><b>' + Q.CATS[cat].hookLbl + ':</b> ' + esc(b.hook) + '</p>' +
          '<p><b>You’ll make:</b> ' + esc(b.make) + '</p>' +
          '<p class="pq-learn"><b>Learning:</b> ' + esc(b.learn) + '<br><b>Learning outcome:</b> ' + esc(b.lo) + '</p>' +
          '<p class="pq-time">About ' + Q.weeksFor(b) + ' weeks · shown to ' + (sees.length ? sees.join(', ') : 'no group') + '</p>' +
          '<details class="pq-peek"><summary>Week-by-week plan</summary><ol>' + b.plan.map(function (w) {
            return '<li><b>' + esc(w.t) + '</b><ul>' + Q.ROLES[b.cat].map(function (r, j) {
              return '<li>' + r.icon + ' ' + esc(r.name) + ': Mon ' + esc(w.j[j][0]) + ' · Tue ' + esc(w.j[j][1]) + ' · Wed ' + esc(w.j[j][2]) + '</li>';
            }).join('') + '</ul></li>';
          }).join('') + '</ol></details>' +
          (by.length ? '<p class="bl-by">Chosen by ' + by.join(', ') + '</p>' : '')));
      });
      body.appendChild(grid);
    });
  }

  app.innerHTML = '';
  app.appendChild(el('div', 'dash-crumb', '<a href="index.html">&larr; Term 3</a>'));
  app.appendChild(el('header', 'hd-page-head pb-head', '<div><p class="hd-eyebrow">Term 3</p><h1>Term 3 Quests</h1>' +
    '<p>Each group chooses its own project on its Term 3 Quest page, from the levels set for it. They don’t see the levels, and more than one group can choose the same project.</p></div>' +
    '<a class="bl-boards" href="board.html">Project boards &rarr;</a>'));
  app.appendChild(el('div', 'bl-body', '<p>Loading…</p>'));
  Promise.all(Q.GROUPS.map(function (g) {
    return window.eot2Fetch('term-3', g.id, 'board').then(function (d) {
      var s = d && d.state;
      picks[g.id] = m(s, 'project') ? { project: m(s, 'project'), started: m(s, 'started') } : null;
    });
  })).then(draw, draw);
})();
