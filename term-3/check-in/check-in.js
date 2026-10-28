/* Term 3 Check-in — each week, the family and staff tick whether they
   did what they agreed at the Term 2 Conference (the "Parent will…",
   "Child will…" and "Teacher will…" parts of the MOM's Part 2 idea, as
   submitted).

   - Riser's page (their parents use it with them): the agreement, then
     one row per school week. A week opens on its first day; in an open
     week the parents and the child each mark their own part "Done" or
     "Not this week", with a comment that must be written before the tick
     is saved: what was done, or why not. Saved under week key
     term3-agreements as
     { weeks: { <first day>: { parent: { v: 'yes'|'no', note, at }, child: … } } }.
   - Staff's own part is ticked by staff on ?view=staff&kid=<slug> and
     kept in its own record, term3-agreements-staff, as { weeks: { <first
     day>: { v, note, at, by } } }, so a family's save and a staff save never
     overwrite each other. Families see staff's ticks, read only.
   - Staff, ?view=staff: every Riser by week. ?view=staff&kid=<slug>:
     one Riser's agreement and weeks, with Edit wording; the family's
     ticks are read only there.

   The agreement is shown tidied (capitals, spacing, a lone "i", full
   stops), or as
   staff reworded it here (state.text[i] = { idea, parent, child, staff }). The
   conference notes themselves are never changed. */
(function () {
  var KEY = 'term3-agreements';
  var STAFF_KEY = 'term3-agreements-staff';
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
  // Before term starts, a Riser trying it out (assets/brand.js LH_TRIAL)
  // can tick any week.
  var TRIAL = false;
  function isOpen(w) { return TRIAL && today() < day(WEEKS[0].start) || today() >= day(w.start); }
  function isNow(w) { var t = today(); return t >= day(w.start) && t <= day(w.end); }

  // Light clean-up for display: spacing, capitals, a lone "i", the child's name, a full stop.
  function tidy(s, name) {
    var nameRe = name ? new RegExp('\\b' + name + '\\b', 'gi') : null;
    return String(s || '').split('\n').map(function (line) {
      line = line.replace(/\s+/g, ' ').trim()
        .replace(/\s+([,.;:!?])/g, '$1')
        .replace(/([,.;:!?])(?=[A-Za-z])/g, '$1 ')
        .replace(/\bi\b/g, 'I')
        .replace(nameRe || /$^/, name || '')
        .replace(/([.!?]\s+)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
      line = line.replace(/^((?:[•\-*]|\d+[.)])\s*)?([a-z])/, function (m, a, b) { return (a || '') + b.toUpperCase(); });
      // Full stop at the end of a sentence (not on a list item).
      return /^(?:[•\-*]|\d+[.)])/.test(line) || !/[A-Za-z0-9)]$/.test(line) ? line : line + '.';
    }).filter(function (l, i, all) { return l || (i && all[i - 1]); }).join('\n').trim();
  }

  // The family's agreements from the submitted MOM Part 2, as shown here.
  function agreements(mom, state, name) {
    var sub = mom && mom.p2_sub;
    var edits = (state && state.text) || [];
    return ((sub && sub.p2_ideas) || []).filter(function (i) { return filled(i.parent) || filled(i.child) || filled(i.staff); }).map(function (i, n) {
      var e = edits[n] || {};
      return {
        idea: filled(e.idea) ? e.idea : tidy(i.idea, name),
        parent: filled(e.parent) ? e.parent : tidy(i.parent, name),
        child: filled(e.child) ? e.child : tidy(i.child, name),
        staff: filled(e.staff) ? e.staff : tidy(i.staff, name),
        edited: !!(e.idea || e.parent || e.child || e.staff)
      };
    });
  }
  function agreementHtml(list, kid) {
    return list.map(function (i) {
      return '<div class="ci-agree">' +
        (filled(i.idea) ? '<p class="ci-idea"><span>Our idea</span>' + text(i.idea) + '</p>' : '') +
        (filled(i.parent) ? '<p class="ci-part"><span>What we, as parents, agreed to do</span>' + text(i.parent) + '</p>' : '') +
        (filled(i.child) ? '<p class="ci-child"><span>What ' + esc(kid.name) + ' agreed to do</span>' + text(i.child) + '</p>' : '') +
        (filled(i.staff) ? '<p class="ci-staff"><span>What staff agreed to do</span>' + text(i.staff) + '</p>' : '') + '</div>';
    }).join('');
  }

  /* ---------- the family ---------- */

  function renderKid(kid) {
    TRIAL = (window.LH_TRIAL || []).indexOf(kid.slug) !== -1;
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../index.html">&larr; Term 3</a>'));
    app.appendChild(el('div', 'eot2-form-header',
      '<div><h1>Term 3 Check-in</h1><div class="eot2-sub">Each week, parents, child and staff each tick whether they did their part of what you agreed at the Term 2 Conference.</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>'));
    var status = document.getElementById('save-status');
    function setStatus(mode, t) { status.className = 'eot2-status eot2-status-' + mode; status.textContent = t; }
    var body = el('div', 'ci-body');
    app.appendChild(body);

    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, MOM_KEY),
      window.eot2Fetch(kid.group, kid.slug, KEY),
      window.eot2Fetch(kid.group, kid.slug, STAFF_KEY)
    ]).then(function (r) {
      var state = (r[1] && r[1].state) || {};
      state.weeks = state.weeks || {};
      var staffWeeks = ((r[2] && r[2].state) || {}).weeks || {};
      var list = agreements(r[0] && r[0].state, state, kid.name);
      setStatus('saved', 'Saved');
      if (!list.length) {
        body.appendChild(el('p', 'ci-wait', 'Your agreement from the Term 2 Conference will show here once your conference notes are ready.'));
        return;
      }
      body.insertAdjacentHTML('beforeend', agreementHtml(list, kid));

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
      body.appendChild(weeksEl(state, staffWeeks, ['parent', 'child'], save, whoFor(list, kid)));
    });
  }

  // Who ticks: the parents' part, the child's part and staff's part, each
  // on its own.
  function whoFor(list, kid) {
    var who = [];
    if (!list.length || list.some(function (x) { return filled(x.parent); })) who.push({ id: 'parent', label: 'Parents' });
    if (!list.length || list.some(function (x) { return filled(x.child); })) who.push({ id: 'child', label: kid.name });
    if (list.some(function (x) { return filled(x.staff); })) who.push({ id: 'staff', label: 'Staff' });
    return who;
  }
  // One week's tick for one side. Older records held a single tick ({ v })
  // for the parents. Staff's ticks are their own record (staffWeeks).
  function mark(state, start, id, staffWeeks) {
    if (id === 'staff') return ((staffWeeks || {})[start] || {}).v;
    var rec = state.weeks[start] || {};
    return rec[id] ? rec[id].v : id === 'parent' ? rec.v : undefined;
  }
  // The comment that goes with a tick: what was done, or why not.
  function noteOf(state, start, id, staffWeeks) {
    if (id === 'staff') return ((staffWeeks || {})[start] || {}).note || '';
    var rec = state.weeks[start] || {};
    return (rec[id] && rec[id].note) || '';
  }
  var NOTE_LABEL = { yes: 'What was done?', no: 'Comments' };
  var NOTE_HINT = { yes: 'Write what was done this week.', no: 'Why not, and what happens next?' };

  // The weeks, one row each. editable: the sides ticked here (the rest
  // show their tick, read only).
  function weeksEl(state, staffWeeks, editable, onChange, who) {
    var box = el('div', 'ci-weeks');
    WEEKS.forEach(function (w) {
      var row = el('div', 'ci-week' + (isNow(w) ? ' is-now' : '') + (isOpen(w) ? '' : ' is-later'));
      row.appendChild(el('div', 'ci-when', '<strong>Week ' + w.n + '</strong><span>' + range(w) + (isNow(w) ? ' &middot; this week' : '') + '</span>'));
      var sides = el('div', 'ci-sides');
      if (!isOpen(w)) {
        sides.appendChild(el('span', 'ci-later', 'Opens ' + fmt(w.start)));
      } else {
        who.forEach(function (p) {
          var line = el('div', 'ci-side', '<span class="ci-who">' + esc(p.label) + '</span>');
          var ctl = el('div', 'ci-ctl');
          var v = mark(state, w.start, p.id, staffWeeks);
          var noteBox = el('div', 'ci-note');
          if (editable.indexOf(p.id) === -1) {
            ctl.appendChild(el('span', 'ci-mark ci-mark-' + (v || 'none'), v === 'yes' ? '✓ Done' : v === 'no' ? 'Not this week' : 'Not ticked'));
            var said = noteOf(state, w.start, p.id, staffWeeks);
            if (v && said) noteBox.innerHTML = '<span>' + NOTE_LABEL[v] + '</span><p>' + text(said) + '</p>';
          } else {
            // A tick is saved only with its comment. draft: the choice being
            // made (not saved yet); undefined while nothing is being changed.
            var draft;
            var put = function (val, note) {
              if (p.id === 'staff') {
                if (val) staffWeeks[w.start] = { v: val, note: note, at: new Date().toISOString(), by: staffName() };
                else delete staffWeeks[w.start];
                onChange(w.start);
                return;
              }
              var rec = state.weeks[w.start] || {};
              if (rec.v && !rec.parent) { rec.parent = { v: rec.v, at: rec.at }; delete rec.v; delete rec.at; }
              if (val) rec[p.id] = { v: val, note: note, at: new Date().toISOString() }; else delete rec[p.id];
              if (Object.keys(rec).length) state.weeks[w.start] = rec; else delete state.weeks[w.start];
              onChange();
            };
            [['yes', '✓ Done'], ['no', 'Not this week']].forEach(function (o) {
              var b = el('button', 'ci-btn ci-btn-' + o[0], o[1]);
              b.type = 'button';
              b.dataset.v = o[0];
              b.addEventListener('click', function () {
                var saved = mark(state, w.start, p.id, staffWeeks), cur = draft || saved;
                // Tapping the chosen one again takes the tick away.
                if (cur === o[0]) {
                  draft = undefined;
                  if (saved === o[0]) put(null);
                } else draft = o[0];
                paint();
                var ta = noteBox.querySelector('textarea');
                if (ta && draft) ta.focus();
              });
              ctl.appendChild(b);
            });
            var paint = function () {
              var saved = mark(state, w.start, p.id, staffWeeks), savedNote = noteOf(state, w.start, p.id, staffWeeks);
              var cur = draft || saved;
              Array.prototype.forEach.call(ctl.children, function (x) {
                x.classList.toggle('is-on', x.dataset.v === cur);
                x.setAttribute('aria-pressed', x.dataset.v === cur);
              });
              noteBox.innerHTML = '';
              if (!cur) return;
              var pending = !!draft && draft !== saved;
              noteBox.innerHTML = '<label><span>' + NOTE_LABEL[cur] + ' <em>required</em></span>' +
                '<textarea rows="2" placeholder="' + NOTE_HINT[cur] + '">' + esc(pending ? '' : savedNote) + '</textarea></label>' +
                '<div class="ci-note-bar"><button type="button" class="ci-note-save">Save</button><small></small></div>';
              var ta = noteBox.querySelector('textarea'), bt = noteBox.querySelector('.ci-note-save'), msg = noteBox.querySelector('small');
              var check = function () {
                var t = ta.value.trim(), same = !pending && t === savedNote.trim();
                bt.disabled = !t || same;
                msg.textContent = !t ? (pending ? 'Write a comment to save this tick.' : 'A comment is needed: this tick has none yet.') : same ? 'Saved' : '';
                msg.className = !t ? 'is-need' : '';
              };
              ta.addEventListener('input', check);
              bt.addEventListener('click', function () {
                var t = ta.value.trim();
                if (!t) return;
                put(cur, t);
                draft = undefined;
                paint();
              });
              check();
            };
            paint();
          }
          line.appendChild(ctl);
          line.appendChild(noteBox);
          sides.appendChild(line);
        });
      }
      row.appendChild(sides);
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
      window.eot2Fetch(kid.group, kid.slug, KEY),
      window.eot2Fetch(kid.group, kid.slug, STAFF_KEY)
    ]).then(function (r) {
      var mom = r[0] && r[0].state;
      var state = (r[1] && r[1].state) || {};
      state.weeks = state.weeks || {};
      var staffWeeks = ((r[2] && r[2].state) || {}).weeks || {};
      var status = el('p', 'ci-saved');
      // Staff's tick for one week, onto the newest copy of their record.
      function saveStaff(start) {
        status.textContent = 'Saving…';
        window.eot2Fetch(kid.group, kid.slug, STAFF_KEY).then(function (d) {
          var latest = ((d && d.state) || {}).weeks || {};
          if (staffWeeks[start]) latest[start] = staffWeeks[start]; else delete latest[start];
          staffWeeks = latest;
          return window.eot2Save(kid.group, kid.slug, STAFF_KEY, { weeks: latest });
        }).then(function (res) {
          status.textContent = res && res.ok ? 'Saved' : 'Not saved — check the connection and try again.';
        });
      }
      function draw() {
        var list = agreements(mom, state, kid.name);
        body.innerHTML = '';
        if (!list.length) {
          body.appendChild(el('p', 'ci-wait', 'No agreement yet. It comes from the submitted Minutes of Meeting, Part 2.'));
        } else {
          body.insertAdjacentHTML('beforeend', agreementHtml(list, kid));
          var bar = el('div', 'ci-editbar', list.some(function (x) { return x.edited; }) ? '<span>Reworded for this page. The conference notes are unchanged.</span>' : '');
          var edit = el('button', 'eot2-btn eot2-btn-secondary', 'Edit wording');
          edit.type = 'button';
          edit.addEventListener('click', function () { editor(list); });
          bar.appendChild(edit);
          body.appendChild(bar);
        }
        var who = whoFor(list, kid);
        if (who.some(function (x) { return x.id === 'staff'; })) body.appendChild(el('p', 'ci-hint', 'Tick staff’s part each week. The family ticks theirs on their own page.'));
        body.appendChild(weeksEl(state, staffWeeks, ['staff'], saveStaff, who));
        body.appendChild(status);
      }
      function editor(list) {
        body.innerHTML = '<p class="ci-wait">Polish the wording families see here. The conference notes stay as they are.</p>';
        var fields = list.map(function (x) {
          var box = el('div', 'ci-agree ci-edit');
          var idea = el('textarea', 'eot2-textarea'); idea.rows = 3; idea.value = x.idea || '';
          var parent = el('textarea', 'eot2-textarea'); parent.rows = 3; parent.value = x.parent || '';
          var child = el('textarea', 'eot2-textarea'); child.rows = 3; child.value = x.child || '';
          var staff = el('textarea', 'eot2-textarea'); staff.rows = 3; staff.value = x.staff || '';
          box.appendChild(el('span', '', 'Our idea')); box.appendChild(idea);
          box.appendChild(el('span', '', 'What we, as parents, agreed to do')); box.appendChild(parent);
          box.appendChild(el('span', '', 'What ' + esc(kid.name) + ' agreed to do')); box.appendChild(child);
          box.appendChild(el('span', '', 'What staff agreed to do')); box.appendChild(staff);
          body.appendChild(box);
          return { idea: idea, parent: parent, child: child, staff: staff };
        });
        var acts = el('div', 'ci-editbar');
        var save = el('button', 'eot2-btn', 'Save');
        var reset = el('button', 'eot2-btn eot2-btn-secondary', 'Use the conference wording');
        var cancel = el('button', 'eot2-btn eot2-btn-secondary', 'Cancel');
        var msg = el('span', 'ci-msg');
        [save, reset, cancel].forEach(function (b) { b.type = 'button'; acts.appendChild(b); });
        acts.appendChild(msg);
        body.appendChild(acts);
        function store(text) {
          msg.textContent = 'Saving…';
          // Start from the latest copy so a family's ticks aren't lost.
          window.eot2Fetch(kid.group, kid.slug, KEY).then(function (d) {
            var latest = (d && d.state) || {};
            latest.weeks = latest.weeks || {};
            if (text) latest.text = text; else delete latest.text;
            return window.eot2Save(kid.group, kid.slug, KEY, latest).then(function (res) {
              if (!res.ok) { msg.textContent = 'Not saved — check the connection and try again.'; return; }
              state = latest;
              draw();
            });
          });
        }
        save.addEventListener('click', function () {
          store(fields.map(function (f) { return { idea: f.idea.value.trim(), parent: f.parent.value.trim(), child: f.child.value.trim(), staff: f.staff.value.trim() }; }));
        });
        reset.addEventListener('click', function () { store(null); });
        cancel.addEventListener('click', draw);
      }
      draw();
    });
  }

  function renderStaffAll() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/term-3/index.html">&larr; Term 3</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>Term 3 Check-ins</h1><p>Each week, parents, their child and staff each tick whether they did their part of the Term 2 Conference agreement. 26 Oct – 21 Jan, with the December holidays off.</p>'));
    var wrap = el('div', 'ci-table-wrap', '<p class="ci-wait">Loading…</p>');
    app.appendChild(wrap);
    Promise.all(window.EOT2_KIDS.map(function (k) {
      return Promise.all([window.eot2Fetch(k.group, k.slug, MOM_KEY), window.eot2Fetch(k.group, k.slug, KEY), window.eot2Fetch(k.group, k.slug, STAFF_KEY)])
        .then(function (r) { return { kid: k, agreed: agreements(r[0] && r[0].state, r[1] && r[1].state, k.name).length > 0, weeks: ((r[1] && r[1].state) || {}).weeks || {}, staffWeeks: ((r[2] && r[2].state) || {}).weeks || {} }; });
    })).then(function (rows) {
      var head = '<tr><th>Riser</th><th>Agreement</th>' + WEEKS.map(function (w) {
        return '<th class="' + (isNow(w) ? 'is-now' : '') + '" title="' + range(w) + '">W' + w.n + '<small>' + fmt(w.start) + '</small></th>';
      }).join('') + '</tr>';
      var bodyRows = rows.map(function (r) {
        return '<tr><td><a href="index.html?view=staff&kid=' + r.kid.slug + '">' + r.kid.name + '</a></td>' +
          '<td>' + (r.agreed ? '<span class="ci-mark ci-mark-yes">Ready</span>' : '<span class="ci-mark ci-mark-none">Not yet</span>') + '</td>' +
          WEEKS.map(function (w) {
            if (!isOpen(w)) return '<td class="ci-cell' + (isNow(w) ? ' is-now' : '') + '"></td>';
            var st = { weeks: r.weeks };
            return '<td class="ci-cell' + (isNow(w) ? ' is-now' : '') + '">' + [['parent', 'P'], ['child', 'C'], ['staff', 'S']].map(function (p) {
              var v = mark(st, w.start, p[0], r.staffWeeks), n = v ? noteOf(st, w.start, p[0], r.staffWeeks) : '';
              return '<span class="ci-pc ci-cell-' + (v || 'none') + '"' + (n ? ' title="' + esc(n) + '"' : '') + '><small>' + p[1] + '</small>' + (v === 'yes' ? '✓' : v === 'no' ? '✗' : '–') + (n ? '<i class="ci-has-note">•</i>' : '') + '</span>';
            }).join('') + '</td>';
          }).join('') + '</tr>';
      }).join('');
      wrap.innerHTML = '<table class="ci-table"><thead>' + head + '</thead><tbody>' + bodyRows + '</tbody></table>' +
        '<p class="ci-key"><b>P</b> Parents <b>C</b> Child <b>S</b> Staff &nbsp;&middot;&nbsp; <span class="ci-cell-yes">✓</span> Done <span class="ci-cell-no">✗</span> Not this week <span class="ci-cell-none">–</span> Not ticked &nbsp;&middot;&nbsp; <span>•</span> has a comment: point at it to read it, or open the Riser</p>';
    });
  }

  function staffName() { try { return localStorage.getItem('rj-staff-name') || ''; } catch (e) { return ''; } }

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
