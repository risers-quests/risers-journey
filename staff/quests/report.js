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
      var report = Object.assign({ shared: false, buildNotes: [] }, r[2].report || {});
      var model = QR.build(w, r[0].state, r[1], report);
      var rated = !!(r[1] && r[1].scores && Object.keys(r[1].scores).length);
      var draft = QR.draftNotes(model, report.buildNotes);
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
        (model.cats.build && model.cats.build.band < 3
          ? '<fieldset class="rv-reasons"><legend>Why the build isn’t finished <small>Shown on the Build card, and updates the Growth and Next step drafts</small></legend>' +
              QR.BUILD_NOTES.map(function (n) {
                return '<label><input type="checkbox" value="' + n.key + '"' + (report.buildNotes.indexOf(n.key) !== -1 ? ' checked' : '') + '> ' + n.label + '</label>';
              }).join('') + '</fieldset>'
          : '') +
        (!rated || report.presentationUndone
          ? '<label class="rv-check"><input type="checkbox" class="rv-no-present"' + (report.presentationUndone ? ' checked' : '') + '> ' + kid.name + ' didn’t present <small>Shows Presentation as Undone</small></label>'
          : '') +
        '<div class="rv-lost">' +
          '<label class="rv-check"><input type="checkbox" class="rv-lost-input"' + (report.dataLost ? ' checked' : '') + '> Some of ' + kid.name + '’s saved progress was lost <small>Tells the family; missing work shows as Not recorded, not Undone, and time on task is hidden</small></label>' +
          (w.buildTotal
            ? '<label class="rv-lost-build"' + (report.dataLost ? '' : ' hidden') + '>Build steps actually finished <select class="rv-build-done"><option value="">As recorded</option>' +
                Array.apply(null, Array(w.buildTotal + 1)).map(function (_, i) {
                  return '<option value="' + i + '"' + (report.buildDone === i ? ' selected' : '') + '>' + i + ' of ' + w.buildTotal + '</option>';
                }).join('') + '</select></label>'
            : '') +
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
        return '<label class="rv-field"><span>' + label + '</span><textarea rows="4" data-k="' + key + '"></textarea></label>';
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
      Array.prototype.forEach.call(panel.querySelectorAll('.rv-reasons input'), function (cb) {
        cb.addEventListener('change', function () {
          report.buildNotes = Array.prototype.filter.call(panel.querySelectorAll('.rv-reasons input'), function (x) { return x.checked; })
            .map(function (x) { return x.value; });
          draft = QR.draftNotes(model, report.buildNotes);
          Array.prototype.forEach.call(boxes, function (t) {
            var k = t.getAttribute('data-k');
            if (k === 'growth' || k === 'next') { t.value = draft[k]; report[k] = draft[k]; }
          });
          paint(); save();
        });
      });
      var noPresent = panel.querySelector('.rv-no-present');
      if (noPresent) noPresent.addEventListener('change', function () {
        report.presentationUndone = noPresent.checked;
        model = QR.build(w, r[0].state, r[1], report);
        draft = QR.draftNotes(model, report.buildNotes);
        Array.prototype.forEach.call(boxes, function (t) {
          var k = t.getAttribute('data-k');
          if (k === 'growth' || k === 'next') { t.value = draft[k]; report[k] = draft[k]; }
        });
        paint(); save();
      });
      var lostInput = panel.querySelector('.rv-lost-input');
      var buildDoneSel = panel.querySelector('.rv-build-done');
      function lostChanged() {
        report.dataLost = lostInput.checked;
        if (buildDoneSel) {
          buildDoneSel.parentNode.hidden = !report.dataLost;
          if (buildDoneSel.value === '' || !report.dataLost) delete report.buildDone; else report.buildDone = parseInt(buildDoneSel.value, 10);
        }
        model = QR.build(w, r[0].state, r[1], report);
        draft = QR.draftNotes(model, report.buildNotes);
        Array.prototype.forEach.call(boxes, function (t) {
          var k = t.getAttribute('data-k');
          if (k === 'growth' || k === 'next') { t.value = draft[k]; report[k] = draft[k]; }
        });
        paint(); save();
      }
      lostInput.addEventListener('change', lostChanged);
      if (buildDoneSel) buildDoneSel.addEventListener('change', lostChanged);
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
