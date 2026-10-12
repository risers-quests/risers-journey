/* Term 2 Conference — staff copy of a Riser's self-assessment next to the
   staff's consolidated assessment (?view=staff&kid=<slug>, linked from
   Consolidate): statement, the Riser's rating, the staff rating, then a
   summary of similarities and differences (shared/eot2-compare.js).
   Shows once every statement has a final rating. Risers see the same
   thing on their own Self-Assessment page once it's shared, so a Riser
   arriving here is sent there. */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var SCALE = window.EOT2_RUBRIC_SCALE;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function legend() {
    return el('div', 'eot2-scale-legend', SCALE.map(function (o) {
      return '<div class="eot2-scale-legend-item"><strong>' + o.code + '</strong> &mdash; ' + o.label + '<span>' + o.desc + '</span></div>';
    }).join(''));
  }
  function load(kid) {
    return Promise.all([
      window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-consolidated'),
      window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-self')
    ]).then(function (r) {
      return {
        staff: (r[0] && r[0].state) || {},
        self: (r[1] && r[1].state) || window.eot2LoadLocal('term2-self-assessment-self', kid.slug) || {}
      };
    });
  }

  function renderStaff(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="../consolidate/index.html?kid=' + kid.slug + '">&larr; Consolidate &middot; ' + kid.name + '</a>'));
    app.appendChild(el('header', 'hd-page-head',
      '<p class="hd-eyebrow">Term 2 Conference &middot; Self-assessment</p>' +
      '<h1>' + kid.name + ': self and staff</h1>' +
      '<p>' + kid.name + '’s own ratings next to the final staff ratings.</p>'));
    var body = el('div', 'rs-body', '<p class="rs-muted">Loading…</p>');
    app.appendChild(body);
    load(kid).then(function (d) {
      if (!window.EOT2_compareData(d.self, d.staff).complete) {
        body.innerHTML = '<p class="rs-muted">This appears once every statement has a final rating on the <a href="../consolidate/index.html?kid=' + kid.slug + '">Consolidate</a> page.</p>';
        return;
      }
      body.innerHTML = '';
      body.appendChild(el('p', 'rs-shared ' + (d.staff._shared ? 'is-on' : ''),
        d.staff._shared ? 'Shared with ' + kid.name + '.' : 'Not shared with ' + kid.name + ' yet.'));
      body.appendChild(legend());
      body.appendChild(el('div', null, window.EOT2_compareHtml(d.self, d.staff, { kidView: false, name: kid.name })));
    });
  }

  if (params.get('view') === 'staff') {
    var staffKid = window.EOT2_findKid(params.get('kid'));
    if (staffKid) renderStaff(staffKid); else location.replace('../consolidate/index.html');
    return;
  }
  // Risers see this on their own Self-Assessment page.
  if (window.EOT2_signedInKid()) location.replace('../self-assessment/index.html');
  else window.EOT2_leaveWithoutKid('../consolidate/index.html', '../../index.html');
})();
