/* Staff — review one Riser's quest report before it's shared.
   ?kid=<slug>&week=<week key>

   Shows the exact report card the Riser and their family will see
   (dashboard/report-card.js), with the three notes — Strength, Growth,
   Next step — editable above it. Notes start as an auto-draft from the
   quest data; edits save automatically. Nothing reaches the Riser until
   "Share" is switched on (saved in the "<week>-report" record). */
(function () {
  var QD = window.QUEST_DATA;
  var QR = window.QUEST_REPORT;
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function staffName() {
    try { return localStorage.getItem('rj-staff-name') || ''; } catch (e) { return ''; }
  }

  function render(kid, w) {
    var parts = String(w.label).split(' · ');
    var title = parts.length > 1 ? parts.slice(1).join(' · ') : w.label;
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="index.html?kid=' + kid.slug + '">&larr; ' + kid.name + '</a>'));
    app.appendChild(el('header', 'hd-page-head',
      '<p class="hd-eyebrow">' + (parts.length > 1 ? parts[0] + ' &middot; ' : '') + 'Quest report &middot; ' + kid.name + '</p>' +
      '<h1>' + title + '</h1>'));
    var body = el('div', 'rv-body', '<p class="rc-muted">Loading…</p>');
    app.appendChild(body);

    Promise.all([
      QD.fetchWeekState(w.group, kid.slug, w.key),
      QD.fetchRating(w.group, kid.slug, w.key),
      QR.fetchReport(w.group, kid.slug, w.key)
    ]).then(function (r) {
      body.innerHTML = '';
      if (!r[0].ok || !r[2].ok) {
        body.appendChild(el('p', 'rep-load-warning', 'Couldn’t load this quest just now. Refresh to try again.'));
        return;
      }
      var summary = QD.summarizeWeek(w, r[0].state);
      var started = summary.status !== 'not-started';
      var model = QR.build(w, r[0].state, r[1]);
      var draft = QR.draftNotes(model);
      var report = Object.assign({ shared: false }, r[2].report || {});
      ['strength', 'growth', 'next'].forEach(function (k) { if (typeof report[k] !== 'string') report[k] = draft[k]; });

      if (summary.status === 'in-progress') {
        body.appendChild(el('p', 'hd-card rv-note', kid.name + ' didn’t finish this quest (' + summary.pct + '% done). The report covers the parts done, and tells ' + kid.name + ' it isn’t finished.'));
      } else if (!started) {
        body.appendChild(el('p', 'hd-card rv-note', kid.name + ' hasn’t started this quest, so there’s nothing to report yet.'));
      }

      var panel = el('div', 'hd-card rv-panel');
      panel.innerHTML =
        '<div class="rv-fields">' +
          field('strength', 'Strength') + field('growth', 'Growth') + field('next', 'Next step') +
        '</div>' +
        '<div class="rv-bar">' +
          '<button type="button" class="eot2-btn eot2-btn-secondary rv-redraft">Redraft from quest data</button>' +
          '<span class="rv-status"></span>' +
          '<label class="cs-switch rv-share"><input type="checkbox" class="rv-share-input"><span class="cs-switch-ui" aria-hidden="true"></span>' +
            '<span class="cs-share-text"><strong>Share with ' + kid.name + ' and family</strong><span></span></span></label>' +
        '</div>';
      body.appendChild(panel);
      body.appendChild(el('h2', 'rv-preview-title', 'What ' + kid.name + ' and their family will see'));
      var preview = el('div', 'rv-preview');
      body.appendChild(preview);

      function field(key, label) {
        return '<label class="rv-field"><span>' + label + '</span><textarea rows="3" data-k="' + key + '"></textarea></label>';
      }
      var boxes = panel.querySelectorAll('textarea');
      Array.prototype.forEach.call(boxes, function (t) { t.value = report[t.getAttribute('data-k')]; });
      var shareInput = panel.querySelector('.rv-share-input');
      shareInput.checked = !!report.shared;

      function paint() {
        preview.innerHTML = QR.render(model, report, { questHref: '../../' + w.path.replace(/^\.\.\//, '') + '?fac=1' });
        shareInput.disabled = !started && !report.shared;
        panel.querySelector('.cs-share-text span').textContent = report.shared
          ? 'Visible on ' + kid.name + '’s Quests page.'
          : started ? 'Not visible to ' + kid.name + ' yet.' : 'Available once the quest is started.';
      }

      var timer = null;
      var status = panel.querySelector('.rv-status');
      function save(now) {
        status.textContent = 'Saving…';
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          report.by = staffName();
          report.at = new Date().toISOString();
          QR.saveReport(w.group, kid.slug, w.key, report).then(function (res) {
            status.textContent = res.ok ? 'Saved' : 'Not saved — check connection';
          });
        }, now ? 0 : 800);
      }

      Array.prototype.forEach.call(boxes, function (t) {
        t.addEventListener('input', function () { report[t.getAttribute('data-k')] = t.value.trim(); paint(); save(); });
      });
      panel.querySelector('.rv-redraft').addEventListener('click', function () {
        Array.prototype.forEach.call(boxes, function (t) { t.value = draft[t.getAttribute('data-k')]; report[t.getAttribute('data-k')] = t.value; });
        paint(); save();
      });
      shareInput.addEventListener('change', function () {
        report.shared = shareInput.checked;
        paint(); save(true);
      });
      paint();
    });
  }

  function init() {
    var kid = window.EOT2_findKid(params.get('kid'));
    var weeks = kid && window.DASHBOARD_ROSTER[kid.slug] ? window.DASHBOARD_ROSTER[kid.slug].weeks : [];
    var w = weeks.filter(function (x) { return x.key === params.get('week'); })[0];
    if (!kid || !w) { location.replace('index.html' + (kid ? '?kid=' + kid.slug : '')); return; }
    render(kid, w);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
