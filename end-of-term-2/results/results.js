/* Term 2 Conference — "Your facilitators' assessment" (kid view). Shows the
   consolidated staff self-assessment rating for each rubric statement next
   to the Riser's own rating — but only once staff have switched on "Share
   with <name>" on the Consolidate page (the _shared flag in the
   term2-self-assessment-consolidated record). Before that, a short "after
   your conference" note. */
(function () {
  var KID_KEY = 'imm-l3-kid';
  var app = document.getElementById('app');
  var SCALE = window.EOT2_RUBRIC_SCALE;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function label(code) {
    var o = SCALE.filter(function (s) { return s.code === code; })[0];
    return o ? o.label : '';
  }
  function pill(who, code, cls) {
    return '<span class="rs-pill ' + cls + (code ? '' : ' is-empty') + '" title="' + (code ? label(code) : 'Not rated') + '">' +
      '<small>' + who + '</small>' + (code || '—') + '</span>';
  }

  function render(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="../index.html">&larr; Term 2 Conference</a>'));
    app.appendChild(el('header', 'hd-page-head',
      '<p class="hd-eyebrow">Term 2 Conference &middot; Self-assessment</p>' +
      '<h1>Your facilitators’ assessment</h1>' +
      '<p>How your facilitators see you, next to how you rated yourself.</p>'));
    var body = el('div', 'rs-body', '<p class="rs-muted">Loading…</p>');
    app.appendChild(body);

    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-consolidated'),
      window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-self')
    ]).then(function (r) {
      var staff = (r[0] && r[0].state) || {};
      var self = (r[1] && r[1].state) || window.eot2LoadLocal('term2-self-assessment-self', kid.slug) || {};
      if (!staff._shared) {
        body.innerHTML = '<p class="rs-muted">Your facilitators’ assessment will appear here after your conference.</p>';
        return;
      }
      body.innerHTML = '';
      body.appendChild(el('div', 'eot2-scale-legend', SCALE.map(function (o) {
        return '<div class="eot2-scale-legend-item"><strong>' + o.code + '</strong> &mdash; ' + o.label + '<span>' + o.desc + '</span></div>';
      }).join('')));
      window.EOT2_RUBRIC.forEach(function (section) {
        var sEl = el('section', 'rs-section');
        sEl.appendChild(el('h2', 'eot2-section-title', section.title));
        section.subsections.forEach(function (sub) {
          if (sub.title) sEl.appendChild(el('h3', 'eot2-sub-title', sub.title));
          var card = el('div', 'hd-card rs-card');
          sub.items.forEach(function (item) {
            card.appendChild(el('div', 'rs-row',
              '<p>' + item.kidText + '</p>' +
              '<span class="rs-pills">' + pill('You', self[item.id], 'is-self') + pill('Facilitators', staff[item.id], 'is-staff') + '</span>'));
          });
          sEl.appendChild(card);
        });
        body.appendChild(sEl);
      });
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(KID_KEY); } catch (e) {}
  var kid = saved ? (window.EOT2_findKid(String(saved).toLowerCase()) || window.EOT2_findKidByName(saved)) : null;
  if (kid) render(kid); else location.href = '../../index.html'; // Home is the one sign-in.
})();
