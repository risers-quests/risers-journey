/* Term 3, staff: clear a Riser's try-out data, so Term 3 can be tried out
   before it starts and then begin from blank. Clears, for the Riser chosen:
   their group's quest (project, roles, board, stand-ups and check-ins,
   which their whole group shares), their weekly check-in ticks, and their
   assessment answers, marks and revision plans. Conference notes and
   everything from Terms 1 and 2 are left alone. */
(function () {
  var Q = window.T3Q;
  var app = document.getElementById('app');
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  app.innerHTML = '';
  app.appendChild(el('div', 'dash-crumb', '<a href="index.html">&larr; Term 3</a>'));
  app.appendChild(el('header', 'hd-page-head', '<div><p class="hd-eyebrow">Term 3</p><h1>Try-out data</h1>' +
    '<p>After trying Term 3 out on a Riser’s dashboard, clear it here so they start the term from blank.</p></div>'));
  var box = el('div', 'to-box');
  var trial = (window.LH_TRIAL || [])[0] || 'benjamin';
  box.innerHTML = '<label class="to-field"><span>Riser</span><select>' + window.EOT2_KIDS.map(function (k) {
    return '<option value="' + k.slug + '"' + (k.slug === trial ? ' selected' : '') + '>' + k.name + '</option>';
  }).join('') + '</select></label>' +
    '<label class="to-check"><input type="checkbox" value="quest" checked> <span class="to-quest"></span></label>' +
    '<label class="to-check"><input type="checkbox" value="checkin" checked> Their weekly check-in ticks</label>' +
    '<label class="to-check"><input type="checkbox" value="asmt" checked> Their assessment answers, marks and revision plans</label>' +
    '<p class="to-note">Conference notes and everything from Terms 1 and 2 stay as they are.</p>';
  var go = el('button', 'to-btn', 'Clear');
  go.type = 'button';
  var msg = el('p', 'to-msg');
  box.appendChild(go);
  box.appendChild(msg);
  app.appendChild(box);
  var sel = box.querySelector('select');
  function questLabel() {
    var k = window.EOT2_findKid(sel.value), g = Q.groupOf(k.name);
    var others = g.kids.filter(function (n) { return n !== k.name; });
    box.querySelector('.to-quest').textContent = g.name + '’s Term 3 Quest: project, roles, board, stand-ups and check-ins. ' +
      'This is shared, so it clears for ' + others.join(' and ') + ' too.';
    go.textContent = 'Clear ' + k.name + '’s try-out data';
  }
  sel.addEventListener('change', questLabel);
  questLabel();

  go.addEventListener('click', function () {
    var k = window.EOT2_findKid(sel.value), g = Q.groupOf(k.name);
    var what = Array.prototype.filter.call(box.querySelectorAll('input:checked'), function () { return true; }).map(function (i) { return i.value; });
    if (!what.length) { msg.textContent = 'Tick at least one thing to clear.'; return; }
    if (!confirm('Clear ' + k.name + '’s Term 3 try-out data? This can’t be undone.')) return;
    go.disabled = true;
    msg.textContent = 'Clearing…';
    var jobs = [];
    var now = Date.now();
    if (what.indexOf('quest') !== -1) {
      jobs.push(window.eot2Save('term-3', g.id, 'board', { meta: { _reset: { v: now, u: now } }, cards: {}, standups: {}, checkins: {} }));
    }
    if (what.indexOf('checkin') !== -1) jobs.push(window.eot2Save(k.group, k.slug, 'term3-agreements', {}));
    if (what.indexOf('asmt') !== -1) {
      (window.T3_ASSESSMENTS || []).forEach(function (p) {
        jobs.push(window.eot2Save(k.group, k.slug, 'term3-asmt-' + p.id, {}));
        jobs.push(window.eot2Save(k.group, k.slug, 'term3-asmt-' + p.id + '-marks', {}));
      });
    }
    Promise.all(jobs).then(function (r) {
      go.disabled = false;
      var ok = r.every(function (x) { return x && x.ok; });
      msg.className = 'to-msg ' + (ok ? 'is-ok' : 'is-bad');
      msg.textContent = ok ? 'Cleared. Anyone with these pages open should reload them.' : 'Some of it wasn’t cleared — check the connection and try again.';
    });
  });
})();
