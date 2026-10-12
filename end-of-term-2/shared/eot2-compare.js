/* Term 2 Conference — a Riser's own self-assessment next to the staff's
   consolidated one: one row per rubric statement with both ratings side by
   side, and a summary of where they agree and where they differ.

   Used by the Riser's "Your facilitators' assessment" page (their wording,
   "you"), the staff copy of that page, and the MOM's Part 2 pick list.

   EOT2_compareData(self, staff)       -> rows, counts, areas and highlights
   EOT2_compareHtml(self, staff, opts) -> summary + side-by-side table
     opts: { kidView: true|false, name: 'Benjamin' } */
(function () {
  var SCALE = window.EOT2_RUBRIC_SCALE;
  var CODES = SCALE.map(function (o) { return o.code; }); // NE < E < D < CD
  var TOP = CODES.length - 1;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function labelOf(code) { var i = CODES.indexOf(code); return i === -1 ? '' : SCALE[i].label; }

  window.EOT2_compareData = function (self, staff) {
    self = self || {}; staff = staff || {};
    var rows = [], areas = [];
    window.EOT2_RUBRIC.forEach(function (section) {
      section.subsections.forEach(function (sub) {
        var area = { name: sub.title || section.title, n: 0, same: 0 };
        sub.items.forEach(function (item) {
          var s = CODES.indexOf(self[item.id]), f = CODES.indexOf(staff[item.id]);
          var row = { item: item, section: section.title, sub: sub.title, area: area.name, self: self[item.id] || null, staff: staff[item.id] || null, s: s, f: f };
          if (s !== -1 && f !== -1) {
            area.n++;
            row.same = s === f;
            if (row.same) area.same++;
            row.gap = s - f; // > 0: Riser rated higher; < 0: staff rated higher
          }
          rows.push(row);
        });
        areas.push(area);
      });
    });
    var both = rows.filter(function (r) { return r.s !== -1 && r.f !== -1; });
    var byGap = function (a, b) { return Math.abs(b.gap) - Math.abs(a.gap); };
    return {
      rows: rows,
      complete: rows.every(function (r) { return r.staff; }),
      compared: both.length,
      same: both.filter(function (r) { return r.same; }),
      selfHigher: both.filter(function (r) { return r.gap > 0; }).sort(byGap),
      staffHigher: both.filter(function (r) { return r.gap < 0; }).sort(byGap),
      strengths: both.filter(function (r) { return r.s === TOP && r.f === TOP; }),
      growing: both.filter(function (r) { return r.s <= 1 && r.f <= 1; }),
      agreeAreas: areas.filter(function (a) { return a.n && a.same / a.n >= 0.5; })
        .sort(function (a, b) { return b.same / b.n - a.same / a.n; })
    };
  };

  function list(rows, kidView, show) {
    return '<ul class="cmp-list">' + rows.slice(0, 4).map(function (r) {
      return '<li>' + esc(kidView ? r.item.kidText : r.item.text) +
        (show ? ' <span class="cmp-codes">' + show(r) + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  function block(title, inner) { return '<div class="cmp-block"><h3>' + title + '</h3>' + inner + '</div>'; }
  function names(areas) {
    var n = areas.slice(0, 3).map(function (a) { return a.name; });
    return n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : n[0];
  }

  window.EOT2_compareHtml = function (self, staff, opts) {
    opts = opts || {};
    var kidView = !!opts.kidView, name = opts.name || 'The Riser';
    var d = window.EOT2_compareData(self, staff);
    var who = kidView
      ? { me: 'You', them: 'Facilitators', agree: 'You and your facilitators', meHigher: 'You rated yourself higher', themHigher: 'Your facilitators rated you higher' }
      : { me: name, them: 'Staff', agree: name + ' and staff', meHigher: name + ' rated higher', themHigher: 'Staff rated higher' };
    var codes = function (r) { return who.me + ': ' + r.self + ' &middot; ' + who.them + ': ' + r.staff; };

    // ---- summary ----
    var sim = '', diff = '';
    if (d.agreeAreas.length) sim += '<p class="cmp-line">' + who.agree + ' agree most on <strong>' + esc(names(d.agreeAreas)) + '</strong>.</p>';
    if (d.strengths.length) sim += block(kidView ? 'You both see these as strengths' : 'Both see as strengths', list(d.strengths, kidView));
    if (d.growing.length) sim += block(kidView ? 'You both see room to grow' : 'Both see room to grow', list(d.growing, kidView));
    if (!sim) sim = '<p class="cmp-none">' + (kidView ? 'You and your facilitators gave different ratings on most statements.' : 'Few ratings match.') + '</p>';
    if (d.selfHigher.length) diff += block(who.meHigher, list(d.selfHigher, kidView, codes));
    if (d.staffHigher.length) diff += block(who.themHigher, list(d.staffHigher, kidView, codes));
    if (!diff) diff = '<p class="cmp-none">' + (kidView ? 'You and your facilitators gave the same rating on every statement.' : 'Every rating matches.') + '</p>';

    var html = '<section class="cmp-summary"><h2>' + (kidView ? 'How your ratings compare' : 'How the ratings compare') + '</h2>' +
      '<div class="cmp-counts">' +
        '<span><strong>' + d.same.length + '</strong> same rating</span>' +
        '<span><strong>' + d.selfHigher.length + '</strong> ' + (kidView ? 'you rated higher' : name + ' rated higher') + '</span>' +
        '<span><strong>' + d.staffHigher.length + '</strong> ' + (kidView ? 'your facilitators rated higher' : 'staff rated higher') + '</span>' +
      '</div>' +
      '<div class="cmp-grid"><div class="cmp-col cmp-sim"><h3 class="cmp-col-h">Similarities</h3>' + sim + '</div>' +
      '<div class="cmp-col cmp-diff"><h3 class="cmp-col-h">Differences</h3>' + diff + '</div></div></section>';

    // ---- side-by-side table ----
    var lastSection = null, lastSub = null;
    html += '<div class="cmp-table" role="table">';
    d.rows.forEach(function (r) {
      if (r.section !== lastSection) {
        html += '<h2 class="eot2-section-title cmp-section">' + esc(r.section) + '</h2>' +
          '<div class="cmp-head" role="row"><span>Statement</span><span>' + who.me + '</span><span>' + who.them + '</span></div>';
        lastSection = r.section; lastSub = null;
      }
      if (r.sub && r.sub !== lastSub) { html += '<h3 class="eot2-sub-title cmp-sub">' + esc(r.sub) + '</h3>'; lastSub = r.sub; }
      var mark = r.same === true ? 'is-same' : r.gap > 0 ? 'is-self-higher' : r.gap < 0 ? 'is-staff-higher' : '';
      html += '<div class="cmp-row ' + mark + '" role="row">' +
        '<p>' + esc(kidView ? r.item.kidText : r.item.text) + '</p>' +
        '<span class="cmp-cell is-self" title="' + esc(labelOf(r.self)) + '"><small>' + who.me + '</small>' + (r.self || '—') + '</span>' +
        '<span class="cmp-cell is-staff" title="' + esc(labelOf(r.staff)) + '"><small>' + who.them + '</small>' + (r.staff || '—') + '</span>' +
      '</div>';
    });
    html += '</div>';
    return html;
  };
})();
