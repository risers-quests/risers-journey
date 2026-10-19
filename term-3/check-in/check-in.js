/* Term 3 Check-in — each week, the family ticks whether they did what
   they agreed at the Term 2 Conference (the "Parent will…" part of the
   MOM's Part 2 idea, as submitted).

   - Riser's page (their parents use it with them): the agreement, then
     one row per school week. A week opens on its Monday; open weeks can
     be marked "Done" or "Not this week". Saved under week key
     term3-agreements as { weeks: { <monday>: { v: 'yes'|'no', at } } }.
   - Staff, ?view=staff: every Riser by week. ?view=staff&kid=<slug>:
     one Riser's agreement and weeks, read only. */
(function () {
  var KEY = 'term3-agreements';
  var MOM_KEY = 'term2-mom';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  // School weeks of Term 3: 26 October to 21 January, with the December
  // holidays (19 December to 4 January) off.
  var WEEKS = [
    ['2026-10-26', '2026-10-30'], ['2026-11-02', '2026-11-06'], ['2026-11-09', '2026-11-13'],
    ['2026-11-16', '2026-11-20'], ['2026-11-23', '2026-11-27'], ['2026-11-30', '2026-12-04'],
    ['2026-12-07', '2026-12-11'], ['2026-12-14', '2026-12-18'],
    ['2027-01-05', '2027-01-08'], ['2027-01-11', '2027-01-15'], ['2027-01-18', '2027-01-21']
  ].map(function (w, i) { return { n: i + 1, start: w[0], end: w[1] }; });
  var HOLIDAY_AFTER = 8; // the holidays come after week 8

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
  function text(s) { return esc(s).replace(/\n/g, '<br>'); }
  function filled(v) { return v && String(v).trim(); }
  function day(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(iso) { return day(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  function range(w) { return fmt(w.start) + ' – ' + fmt(w.end); }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function isOpen(w) { return today() >= day(w.start); }
  function isNow(w) { var t = today(); return t >= day(w.start) && t <= day(w.end); }

  // The family's agreements from the submitted MOM Part 2.
  function agreements(mom) {
    var sub = mom && mom.p2_sub;
    return ((sub && sub.p2_ideas) || []).filter(function (i) { return filled(i.parent); });
  }
  function agreementHtml(list) {
    return list.map(function (i) {
      return '<div class="ci-agree">' +
        (filled(i.idea) ? '<p class="ci-idea"><span>Our idea</span>' + text(i.idea) + '</p>' : '') +
        '<p class="ci-part"><span>What we, as parents, agreed to do</span>' + text(i.parent) + '</p></div>';
    }).join('');
  }

  /* ---------- the family ---------- */

  function renderKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-form-header',
      '<div><h1>Term 3 Check-in</h1><div class="eot2-sub">Each week, tick whether you did what you agreed at the Term 2 Conference.</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>'));
    var status = document.getElementById('save-status');
    function setStatus(mode, t) { status.className = 'eot2-status eot2-status-' + mode; status.textContent = t; }
    var body = el('div', 'ci-body');
    app.appendChild(body);

    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, MOM_KEY),
      window.eot2Fetch(kid.group, kid.slug, KEY)
    ]).then(function (r) {
      var list = agreements(r[0] && r[0].state);
      var state = (r[1] && r[1].state) || {};
      state.weeks = state.weeks || {};
      setStatus('saved', 'Saved');
      if (!list.length) {
        body.appendChild(el('p', 'ci-wait', 'Your agreement from the Term 2 Conference will show here once your conference notes are ready.'));
        return;
      }
      body.insertAdjacentHTML('beforeend', agreementHtml(list));

      var timer = null;
      function save() {
        setStatus('saving', 'Saving…');
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          window.eot2Save(kid.group, kid.slug, KEY, state).then(function (res) {
            setStatus(res.ok ? 'saved' : 'offline', res.ok ? 'Saved' : 'Not synced');
          });
        }, 400);
      }
      body.appendChild(weeksEl(state, false, save));
    });
  }

  function weeksEl(state, readOnly, onChange) {
    var box = el('div', 'ci-weeks');
    WEEKS.forEach(function (w) {
      var rec = state.weeks[w.start] || {};
      var row = el('div', 'ci-week' + (isNow(w) ? ' is-now' : '') + (isOpen(w) ? '' : ' is-later'));
      row.appendChild(el('div', 'ci-when', '<strong>Week ' + w.n + '</strong><span>' + range(w) + (isNow(w) ? ' &middot; this week' : '') + '</span>'));
      var ctl = el('div', 'ci-ctl');
      if (!isOpen(w)) {
        ctl.appendChild(el('span', 'ci-later', 'Opens ' + fmt(w.start)));
      } else if (readOnly) {
        ctl.appendChild(el('span', 'ci-mark ci-mark-' + (rec.v || 'none'), rec.v === 'yes' ? '✓ Done' : rec.v === 'no' ? 'Not this week' : 'Not ticked'));
      } else {
        [['yes', '✓ Done'], ['no', 'Not this week']].forEach(function (o) {
          var b = el('button', 'ci-btn ci-btn-' + o[0], o[1]);
          b.type = 'button';
          b.dataset.v = o[0];
          b.addEventListener('click', function () {
            if ((state.weeks[w.start] || {}).v === o[0]) delete state.weeks[w.start];
            else state.weeks[w.start] = { v: o[0], at: new Date().toISOString() };
            paint();
            onChange();
          });
          ctl.appendChild(b);
        });
        var paint = function () {
          var v = (state.weeks[w.start] || {}).v;
          Array.prototype.forEach.call(ctl.children, function (x) {
            x.classList.toggle('is-on', x.dataset.v === v);
            x.setAttribute('aria-pressed', x.dataset.v === v);
          });
        };
        paint();
      }
      row.appendChild(ctl);
      box.appendChild(row);
      if (w.n === HOLIDAY_AFTER) box.appendChild(el('div', 'ci-holiday', 'December holidays &middot; 19 Dec – 4 Jan'));
    });
    return box;
  }

  /* ---------- staff ---------- */

  function renderStaffKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="index.html?view=staff">&larr; Term 3 Check-ins</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>Term 3 Check-in &mdash; ' + esc(kid.name) + '</h1>'));
    var body = el('div', 'ci-body', '<p class="ci-wait">Loading…</p>');
    app.appendChild(body);
    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, MOM_KEY),
      window.eot2Fetch(kid.group, kid.slug, KEY)
    ]).then(function (r) {
      var list = agreements(r[0] && r[0].state);
      var state = (r[1] && r[1].state) || {};
      state.weeks = state.weeks || {};
      body.innerHTML = list.length ? agreementHtml(list)
        : '<p class="ci-wait">No parent agreement yet. It comes from the submitted Minutes of Meeting, Part 2.</p>';
      body.appendChild(weeksEl(state, true));
    });
  }

  function renderStaffAll() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-head', '<h1>Term 3 Check-ins</h1><p>Each week, families tick whether they did what they agreed at the Term 2 Conference. 26 Oct – 21 Jan, with the December holidays off.</p>'));
    var wrap = el('div', 'ci-table-wrap', '<p class="ci-wait">Loading…</p>');
    app.appendChild(wrap);
    Promise.all(window.EOT2_KIDS.map(function (k) {
      return Promise.all([window.eot2Fetch(k.group, k.slug, MOM_KEY), window.eot2Fetch(k.group, k.slug, KEY)])
        .then(function (r) { return { kid: k, agreed: agreements(r[0] && r[0].state).length > 0, weeks: ((r[1] && r[1].state) || {}).weeks || {} }; });
    })).then(function (rows) {
      var head = '<tr><th>Riser</th><th>Agreement</th>' + WEEKS.map(function (w) {
        return '<th class="' + (isNow(w) ? 'is-now' : '') + '" title="' + range(w) + '">W' + w.n + '<small>' + fmt(w.start) + '</small></th>';
      }).join('') + '</tr>';
      var bodyRows = rows.map(function (r) {
        return '<tr><td><a href="index.html?view=staff&kid=' + r.kid.slug + '">' + r.kid.name + '</a></td>' +
          '<td>' + (r.agreed ? '<span class="ci-mark ci-mark-yes">Ready</span>' : '<span class="ci-mark ci-mark-none">Not yet</span>') + '</td>' +
          WEEKS.map(function (w) {
            var v = (r.weeks[w.start] || {}).v;
            var cls = !isOpen(w) ? 'later' : v || 'none';
            return '<td class="ci-cell ci-cell-' + cls + (isNow(w) ? ' is-now' : '') + '">' + (v === 'yes' ? '✓' : v === 'no' ? '✗' : isOpen(w) ? '–' : '') + '</td>';
          }).join('') + '</tr>';
      }).join('');
      wrap.innerHTML = '<table class="ci-table"><thead>' + head + '</thead><tbody>' + bodyRows + '</tbody></table>' +
        '<p class="ci-key"><span class="ci-cell-yes">✓</span> Done <span class="ci-cell-no">✗</span> Not this week <span class="ci-cell-none">–</span> Not ticked</p>';
    });
  }

  if (params.get('view') === 'staff') {
    var staff = null;
    try { staff = localStorage.getItem('rj-staff-name'); } catch (e) {}
    if (!staff) { location.replace('../../index.html'); return; }
    var k = params.get('kid') && window.EOT2_findKid(params.get('kid'));
    if (k) renderStaffKid(k); else renderStaffAll();
    return;
  }
  var kid = window.EOT2_signedInKid();
  if (kid) renderKid(kid); else window.EOT2_leaveWithoutKid('index.html?view=staff', '../../index.html');
})();
