/* Term 3 Quests — renders one build outline (outline.html?b=<id>) as a
   printable document, or the list of outlines when no build is given. */
(function () {
  var app = document.getElementById('app');
  var ALL = window.T3_OUTLINES || {};
  var CAT = { sci: 'Science in action', sol: 'Solve a LifeHub problem' };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var id = new URLSearchParams(location.search).get('b');
  var o = ALL[id];

  if (!o) {
    app.innerHTML = '<div class="ol-index"><a class="ol-back" href="index.html">‹ Term 3 Quests</a>' +
      '<h1>Build outlines</h1><p>The official plan for each build: what it is for, the finished model, a dimensioned drawing, parts, order of work, and the test that proves it works.</p>' +
      '<div class="ol-cards">' + Object.keys(ALL).map(function (k) {
        var x = ALL[k];
        return '<a class="ol-card ol-' + x.cat + '" href="outline.html?b=' + k + '"><span>' + esc(x.docNo) + ' · ' + esc(CAT[x.cat]) + '</span><strong>' + esc(x.title) + '</strong><em>' + esc(x.tagline) + '</em></a>';
      }).join('') + '</div></div>';
    return;
  }

  document.title = o.title + ' — Build Outline';
  var n = 0;
  function sec(title, inner) { n++; return '<section class="ol-sec"><h2><span>' + n + '</span>' + title + '</h2>' + inner + '</section>'; }
  function table(head, rows, cls) {
    return '<table class="ol-table ' + (cls || '') + '"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  }
  function ul(items, cls) { return '<ul class="' + (cls || 'ol-list') + '">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }

  var html = '';
  html += '<div class="ol-tools"><a class="ol-back" href="outline.html">‹ All outlines</a><button type="button" class="btn btn-primary" id="ol-print">Print or save as PDF</button></div>';
  html += '<article class="ol-doc ol-' + o.cat + '">';
  html += '<header class="ol-head">' +
    '<div class="ol-brand"><img src="../../assets/lifehub-logo.png" alt="LifeHub"><span>Risers · Term 3 Quests</span></div>' +
    '<div class="ol-kind">Build Outline</div>' +
    '<h1>' + esc(o.title) + '</h1><p class="ol-tag">' + esc(o.tagline) + '</p>' +
    '<dl class="ol-block">' +
      '<div><dt>Document</dt><dd>' + esc(o.docNo) + '</dd></div>' +
      '<div><dt>Revision</dt><dd>' + esc(o.rev) + '</dd></div>' +
      '<div><dt>Category</dt><dd>' + esc(CAT[o.cat]) + '</dd></div>' +
      '<div><dt>Group</dt><dd class="ol-blank"></dd></div>' +
      '<div><dt>Units</dt><dd>Millimetres</dd></div>' +
      '<div><dt>Prepared by</dt><dd>LifeHub facilitators</dd></div>' +
    '</dl></header>';

  html += sec(esc(o.purposeLabel), '<p>' + esc(o.purpose) + '</p>');
  html += sec('Outcome model', '<p class="ol-outcome">' + esc(o.outcome) + '</p>' +
    '<table class="ol-table ol-spec"><tbody>' + o.spec.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table>');
  html += sec('General arrangement', o.drawings.map(function (d, i) {
    return '<figure class="ol-fig"><div class="ol-draw">' + d.svg + '</div><figcaption><strong>Drawing ' + (i + 1) + ': ' + esc(d.title) + '.</strong> ' + esc(d.note) + ' Numbers match the parts list.</figcaption></figure>';
  }).join(''));
  html += sec('Parts list', table(['No.', 'Part', 'Qty', 'Size and material', 'Notes'], o.parts, 'ol-parts'));
  html += sec('Tools and safety', '<div class="ol-two"><div><h3>Tools</h3>' + ul(o.tools) + '</div><div class="ol-safety"><h3>Safety rules</h3>' + ul(o.safety) + '</div></div>');
  html += sec('Order of work', '<p class="ol-note">This is the order to build in, not a calendar. Groups loop back from testing to building as many times as they need.</p><ol class="ol-stages">' +
    o.stages.map(function (s, i) {
      return '<li><div class="ol-stage-n">' + String.fromCharCode(65 + i) + '</div><div><h3>' + esc(s.name) + '</h3>' + ul(s.steps) + '<p class="ol-done"><strong>Done when:</strong> ' + esc(s.done) + '</p></div></li>';
    }).join('') + '</ol>');
  html += sec('Test plan', '<p><strong>Goal:</strong> ' + esc(o.test.goal) + '</p><ol class="ol-method">' + o.test.method.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ol>' +
    '<h3>Test record</h3><table class="ol-table ol-record"><thead><tr>' + o.test.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    [1, 2, 3, 4].map(function () { return '<tr>' + o.test.cols.map(function () { return '<td></td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>');
  html += sec('What to try changing', '<p>Change one thing at a time, then test again the same way.</p>' + ul(o.improve, 'ol-chips'));
  html += sec('Who leads what', table(['Role', 'Leads on this build'], o.roles, 'ol-roles'));
  html += sec('Showcase label', '<div class="ol-label"><h3>' + esc(o.label.title) + '</h3><p>' + esc(o.label.text) + '</p><p class="ol-try"><strong>Try it:</strong> ' + esc(o.label.tryit) + '</p></div>');
  html += '<footer class="ol-sign"><div><span>Plan approved by (facilitator)</span></div><div><span>Date</span></div><div><span>Group members</span></div></footer>';
  html += '<p class="ol-foot">' + esc(o.docNo) + ' Rev ' + esc(o.rev) + ' · ' + esc(o.title) + ' · LifeHub Risers, Term 3</p>';
  html += '</article>';
  app.innerHTML = html;
  document.getElementById('ol-print').addEventListener('click', function () { window.print(); });
})();
