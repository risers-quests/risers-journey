/* Term 3 — My Schedule: a Riser's week, Monday to Friday, as blocks.
   Risers can only look at it; staff change it.

   - Starts from the school timetable (timetable-data.js).
   Staff can:
   - Tap a block to change its name, colour, day or times, or delete it.
   - Drag a block to move it (on a phone or tablet, press and hold first),
     and drag its bottom edge to make it longer or shorter. Times snap to
     15 minutes.
   - Add a block, Undo, and Start again from the school timetable.
   - Blocks that sit at the same time are shown side by side, with a note.

   Saved under week key term3-schedule as
   { days: { Mon: [{ s, e, t, c }], … }, u, by }  (s, e: minutes after
   midnight; t: what it is; c: colour, empty for the usual colour).
   Staff, ?view=staff: every Riser and how many blocks changed;
   ?view=staff&kid=<slug>: that Riser's schedule, to change. */
(function () {
  var KEY = 'term3-schedule';
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  var DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
  var START = 8 * 60 + 45, END = 15 * 60, STEP = 15, PX = 1.7;
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  // Colours, and which one a block gets by its name.
  var COLOURS = [
    { id: 'gold', name: 'Gold', re: /negotiable/i },
    { id: 'blue', name: 'Blue', re: /core skills|progress board/i },
    { id: 'green', name: 'Green', re: /stem/i },
    { id: 'plum', name: 'Plum', re: /\bsel\b/i },
    { id: 'purple', name: 'Purple', re: /drama|music/i },
    { id: 'teal', name: 'Teal', re: /global|tamil/i },
    { id: 'brown', name: 'Brown', re: /carpentry/i },
    { id: 'leaf', name: 'Leaf', re: /garden/i },
    { id: 'orange', name: 'Orange', re: /recess|daring|catch-up|skill builder/i },
    { id: 'red', name: 'Red', re: /set up|dismissal/i },
    { id: 'grey', name: 'Grey', re: /lunch|snack/i }
  ];
  function colourOf(b) {
    if (b.c) return b.c;
    var m = COLOURS.filter(function (c) { return c.re.test(b.t || ''); })[0];
    return m ? m.id : 'grey';
  }

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
  function hm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (h > 12 ? h - 12 : h) + ':' + (m < 10 ? '0' : '') + m;
  }
  function span(b) { return hm(b.s) + '–' + hm(b.e); }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function school(slug) {
    var t = (window.T3_TIMETABLE || {})[slug];
    var days = {};
    DAYS.forEach(function (d) {
      days[d] = ((t && t[d]) || []).map(function (x) { return { s: x[0], e: x[1], t: x[2], c: '' }; });
    });
    return days;
  }
  // How many blocks differ from the school timetable.
  function changes(days, slug) {
    var base = school(slug), n = 0;
    DAYS.forEach(function (d) {
      var a = base[d].map(function (b) { return b.s + '|' + b.e + '|' + b.t; });
      var b = (days[d] || []).map(function (x) { return x.s + '|' + x.e + '|' + x.t; });
      b.forEach(function (k) { if (a.indexOf(k) === -1) n++; });
      a.forEach(function (k) { if (b.indexOf(k) === -1) n++; });
    });
    return n;
  }
  function isChanged(b, d, base) {
    return !base[d].some(function (x) { return x.s === b.s && x.e === b.e && x.t === b.t; });
  }

  /* ---------- the editor ---------- */

  function editor(kid, who, crumb) {
    var days = school(kid.slug), base = school(kid.slug);
    var history = [], saveTimer = null;
    var narrow = function () { return window.innerWidth < 760; };
    var EDIT = who === 'staff';
    var dayNow = DAYS[Math.min(Math.max(new Date().getDay() - 1, 0), 4)];
    var shown = dayNow;

    app.innerHTML = '';
    if (crumb) app.appendChild(el('div', 'eot2-crumb', crumb));
    app.appendChild(el('header', 'hd-page-head sc-head',
      '<div><p class="hd-eyebrow">Term 3</p><h1>' + (who === 'staff' ? esc(kid.name) + '’s schedule' : 'My schedule') + '</h1>' +
      (EDIT ? '<p>Tap a block to change it. Drag a block to move it' +
        ' (on a phone or tablet, press and hold it first). Drag the bottom edge to make it longer or shorter. ' + esc(kid.name) + ' sees the changes on their page.</p></div>'
        : '<p>Your week at LifeHub. If something needs to change, ask a facilitator.</p></div>') +
      '<span class="sc-status">Loading…</span>'));
    var tools = el('div', 'sc-tools',
      '<button type="button" class="sc-btn sc-add">+ Add a block</button>' +
      '<button type="button" class="sc-btn sc-undo" disabled>Undo</button>' +
      '<button type="button" class="sc-btn sc-ghost sc-reset">Start again from the school timetable</button>');
    if (EDIT) app.appendChild(tools);
    var tabs = el('div', 'sc-tabs');
    app.appendChild(tabs);
    var note = el('p', 'sc-note');
    app.appendChild(note);
    var grid = el('div', 'sc-grid');
    app.appendChild(grid);

    function status(t, cls) { var s = app.querySelector('.sc-status'); if (s) { s.textContent = t; s.className = 'sc-status ' + (cls || ''); } }
    function remember() { history.push(clone(days)); if (history.length > 40) history.shift(); tools.querySelector('.sc-undo').disabled = false; }
    function changed() {
      paint();
      status('Saving…');
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        window.eot2Save(kid.group, kid.slug, KEY, { days: days, u: Date.now(), by: who === 'staff' ? 'staff' : kid.name }).then(function (r) {
          status(r.ok ? 'Saved' : 'Not saved — check the connection', r.ok ? 'is-ok' : 'is-bad');
        });
      }, 600);
    }

    tools.querySelector('.sc-add').addEventListener('click', function () {
      var d = narrow() ? shown : dayNow;
      sheet({ s: 9 * 60, e: 9 * 60 + 30, t: '', c: '' }, d, true);
    });
    tools.querySelector('.sc-undo').addEventListener('click', function () {
      if (!history.length) return;
      days = history.pop();
      tools.querySelector('.sc-undo').disabled = !history.length;
      changed();
    });
    tools.querySelector('.sc-reset').addEventListener('click', function () {
      if (!confirm('Put back the school timetable? Your changes will go.')) return;
      remember();
      days = school(kid.slug);
      changed();
    });
    window.addEventListener('resize', function () { paint(); });

    // Blocks at the same time sit side by side: each gets a lane.
    function lanes(list) {
      var sorted = list.map(function (b, i) { return { b: b, i: i }; }).sort(function (x, y) { return x.b.s - y.b.s || x.b.e - y.b.e; });
      var out = {}, group = [], groupEnd = -1, clash = false;
      function close() {
        var ends = [];
        group.forEach(function (g) {
          var lane = 0;
          while (ends[lane] !== undefined && ends[lane] > g.b.s) lane++;
          ends[lane] = g.b.e;
          out[g.i] = { lane: lane };
        });
        group.forEach(function (g) { out[g.i].of = ends.length; });
        if (ends.length > 1) clash = true;
        group = [];
      }
      sorted.forEach(function (g) {
        if (group.length && g.b.s >= groupEnd) close();
        group.push(g);
        groupEnd = Math.max(groupEnd, g.b.e);
      });
      if (group.length) close();
      return { pos: out, clash: clash };
    }

    function paint() {
      var one = narrow();
      tabs.innerHTML = '';
      tabs.style.display = one ? '' : 'none';
      DAYS.forEach(function (d) {
        var t = el('button', 'sc-tab' + (d === shown ? ' is-on' : ''), DAY_NAMES[d].slice(0, 3));
        t.type = 'button';
        t.addEventListener('click', function () { shown = d; paint(); });
        tabs.appendChild(t);
      });
      grid.innerHTML = '';
      grid.className = 'sc-grid' + (one ? ' is-one' : '');
      var axis = el('div', 'sc-axis');
      axis.appendChild(el('div', 'sc-dayhead', ''));
      var axisBody = el('div', 'sc-col-body');
      axisBody.style.height = (END - START) * PX + 'px';
      for (var m = START; m <= END; m += STEP) {
        if (m % 30 && m !== START) continue;
        var lab = el('span', 'sc-tick', hm(m));
        lab.style.top = (m - START) * PX + 'px';
        axisBody.appendChild(lab);
      }
      axis.appendChild(axisBody);
      grid.appendChild(axis);
      var clashes = [];
      (one ? [shown] : DAYS).forEach(function (d) {
        var col = el('div', 'sc-col' + (d === dayNow ? ' is-today' : ''));
        col.dataset.day = d;
        col.appendChild(el('div', 'sc-dayhead', DAY_NAMES[d]));
        var body = el('div', 'sc-col-body');
        body.style.height = (END - START) * PX + 'px';
        var L = lanes(days[d]);
        if (L.clash) clashes.push(DAY_NAMES[d]);
        days[d].forEach(function (b, i) {
          var p = L.pos[i];
          var blk = el('div', 'sc-blk sc-c-' + colourOf(b) + (b.e - b.s <= 15 ? ' is-short' : '') + (p.of > 1 ? ' is-clash' : ''),
            '<span class="sc-blk-t">' + esc(b.t || 'Untitled') + (EDIT && isChanged(b, d, base) ? ' <i class="sc-mark" title="Changed from the school timetable">✎</i>' : '') + '</span>' +
            '<span class="sc-blk-time">' + span(b) + '</span><span class="sc-grip" aria-hidden="true"></span>');
          blk.style.top = (b.s - START) * PX + 'px';
          blk.style.height = Math.max((b.e - b.s) * PX - 2, 12) + 'px';
          blk.style.left = 'calc(' + (p.lane / p.of * 100) + '% + 2px)';
          blk.style.width = 'calc(' + (100 / p.of) + '% - 4px)';
          if (EDIT) {
          blk.tabIndex = 0;
          blk.setAttribute('role', 'button');
          blk.setAttribute('aria-label', (b.t || 'Untitled') + ', ' + DAY_NAMES[d] + ' ' + span(b) + '. Tap to change.');
          blk.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sheet(b, d, false); } });
          drag(blk, b, d);
          } else blk.classList.add('is-fixed');
          body.appendChild(blk);
        });
        col.appendChild(body);
        grid.appendChild(col);
      });
      note.textContent = clashes.length ? 'Two things at the same time on ' + clashes.join(' and ') + '. Move or shorten one of them.' : '';
      note.className = 'sc-note' + (clashes.length ? ' is-warn' : '');
    }

    // Drag to move (whole block) or to resize (bottom edge).
    function drag(blk, b, d) {
      var grip = blk.querySelector('.sc-grip');
      var st = null;
      function begin(e, mode) {
        st = { mode: mode, x: e.clientX, y: e.clientY, s: b.s, e: b.e, d: d, armed: e.pointerType !== 'touch' || mode === 'size', moved: false, id: e.pointerId };
        if (!st.armed) st.timer = setTimeout(function () { if (st) { st.armed = true; blk.classList.add('is-lifted'); if (navigator.vibrate) navigator.vibrate(15); } }, 300);
        else if (mode === 'size') blk.classList.add('is-lifted');
        try { blk.setPointerCapture(e.pointerId); } catch (x) {}
      }
      grip.addEventListener('pointerdown', function (e) { e.stopPropagation(); begin(e, 'size'); });
      blk.addEventListener('pointerdown', function (e) { if (e.button === 0 || e.pointerType !== 'mouse') begin(e, 'move'); });
      // Once a block is picked up on a touch screen, stop the page scrolling.
      blk.addEventListener('touchmove', function (e) { if (st && st.armed) e.preventDefault(); }, { passive: false });
      blk.addEventListener('pointermove', function (e) {
        if (!st) return;
        var dx = e.clientX - st.x, dy = e.clientY - st.y;
        if (!st.armed) { if (Math.abs(dx) > 8 || Math.abs(dy) > 8) { clearTimeout(st.timer); st = null; } return; }
        if (!st.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        st.moved = true;
        blk.classList.add('is-lifted');
        var dm = Math.round(dy / PX / STEP) * STEP;
        if (st.mode === 'size') {
          st.ne = Math.min(Math.max(st.e + dm, st.s + STEP), END);
          blk.style.height = ((st.ne - st.s) * PX - 2) + 'px';
          blk.querySelector('.sc-blk-time').textContent = hm(st.s) + '–' + hm(st.ne);
          return;
        }
        var len = st.e - st.s;
        st.ns = Math.min(Math.max(st.s + dm, START), END - len);
        st.nd = st.d;
        var shift = 0;
        if (!narrow()) {
          var home = grid.querySelector('.sc-col[data-day="' + st.d + '"]').getBoundingClientRect();
          Array.prototype.forEach.call(grid.querySelectorAll('.sc-col'), function (c) {
            var r = c.getBoundingClientRect();
            if (e.clientX >= r.left && e.clientX < r.right) { st.nd = c.dataset.day; shift = r.left - home.left; }
          });
        }
        blk.style.transform = 'translateX(' + shift + 'px)';
        blk.style.top = (st.ns - START) * PX + 'px';
        blk.style.left = '2px'; blk.style.width = 'calc(100% - 4px)';
        blk.querySelector('.sc-blk-time').textContent = hm(st.ns) + '–' + hm(st.ns + len);
      });
      function finish(e, cancelled) {
        if (!st) return;
        clearTimeout(st.timer);
        var s0 = st; st = null;
        blk.classList.remove('is-lifted');
        if (cancelled) { paint(); return; }
        if (!s0.moved) { if (e.type === 'pointerup') sheet(b, d, false); return; }
        remember();
        if (s0.mode === 'size') b.e = s0.ne;
        else {
          var len = b.e - b.s;
          b.s = s0.ns; b.e = s0.ns + len;
          if (s0.nd !== d) { days[d].splice(days[d].indexOf(b), 1); days[s0.nd].push(b); }
        }
        days[s0.nd || d].sort(function (x, y) { return x.s - y.s; });
        changed();
      }
      blk.addEventListener('pointerup', function (e) { finish(e, false); });
      blk.addEventListener('pointercancel', function (e) { finish(e, true); });
    }

    // Change one block: name, colour, day, times; or delete it.
    function sheet(b, d, isNew) {
      var c = { s: b.s, e: b.e, t: b.t, c: b.c, d: d };
      var opts = function (from, to, v) {
        var h = '';
        for (var m = from; m <= to; m += STEP) h += '<option value="' + m + '"' + (m === v ? ' selected' : '') + '>' + hm(m) + '</option>';
        return h;
      };
      var box = el('div', 'sc-modal');
      box.innerHTML = '<form class="sc-modal-card" role="dialog" aria-label="' + (isNew ? 'Add a block' : 'Change this block') + '">' +
        '<h2>' + (isNew ? 'Add a block' : 'Change this block') + '</h2>' +
        '<label class="sc-field"><span>What is it?</span><input type="text" class="sc-e-t" maxlength="60" value="' + esc(c.t) + '" placeholder="Like “Reading time”"></label>' +
        '<div class="sc-row">' +
          '<label class="sc-field"><span>Day</span><select class="sc-e-d">' + DAYS.map(function (x) { return '<option value="' + x + '"' + (x === d ? ' selected' : '') + '>' + DAY_NAMES[x] + '</option>'; }).join('') + '</select></label>' +
          '<label class="sc-field"><span>Starts</span><select class="sc-e-s">' + opts(START, END - STEP, c.s) + '</select></label>' +
          '<label class="sc-field"><span>Ends</span><select class="sc-e-e">' + opts(START + STEP, END, c.e) + '</select></label>' +
        '</div>' +
        '<div class="sc-field"><span>Colour</span><div class="sc-swatches">' +
          '<button type="button" class="sc-sw sc-sw-auto' + (!c.c ? ' is-on' : '') + '" data-c="">Usual</button>' +
          COLOURS.map(function (x) { return '<button type="button" class="sc-sw sc-c-' + x.id + (c.c === x.id ? ' is-on' : '') + '" data-c="' + x.id + '" aria-label="' + x.name + '" title="' + x.name + '"></button>'; }).join('') +
        '</div></div>' +
        '<p class="sc-err" hidden></p>' +
        '<div class="sc-modal-btns">' + (isNew ? '' : '<button type="button" class="sc-btn sc-ghost sc-del">Delete</button>') +
          '<span></span><button type="button" class="sc-btn sc-ghost sc-cancel">Cancel</button><button type="submit" class="sc-btn sc-save">Save</button></div>' +
        '</form>';
      function close() { box.remove(); }
      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      box.querySelector('.sc-cancel').addEventListener('click', close);
      Array.prototype.forEach.call(box.querySelectorAll('.sc-sw'), function (sw) {
        sw.addEventListener('click', function () {
          c.c = sw.dataset.c;
          Array.prototype.forEach.call(box.querySelectorAll('.sc-sw'), function (x) { x.classList.toggle('is-on', x === sw); });
        });
      });
      if (!isNew) box.querySelector('.sc-del').addEventListener('click', function () {
        remember();
        days[d].splice(days[d].indexOf(b), 1);
        close();
        changed();
      });
      box.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var t = box.querySelector('.sc-e-t').value.trim();
        var s = +box.querySelector('.sc-e-s').value, en = +box.querySelector('.sc-e-e').value, nd = box.querySelector('.sc-e-d').value;
        var err = box.querySelector('.sc-err');
        if (!t) { err.textContent = 'Give it a name.'; err.hidden = false; box.querySelector('.sc-e-t').focus(); return; }
        if (en <= s) { err.textContent = 'It has to end after it starts.'; err.hidden = false; return; }
        remember();
        if (isNew) { b = { s: s, e: en, t: t, c: c.c }; days[nd].push(b); }
        else {
          b.s = s; b.e = en; b.t = t; b.c = c.c;
          if (nd !== d) { days[d].splice(days[d].indexOf(b), 1); days[nd].push(b); }
        }
        days[nd].sort(function (x, y) { return x.s - y.s; });
        if (narrow()) shown = nd;
        close();
        changed();
      });
      document.body.appendChild(box);
      box.querySelector('.sc-e-t').focus();
    }

    paint();
    window.eot2Fetch(kid.group, kid.slug, KEY).then(function (r) {
      if (r && r.state && r.state.days) {
        days = {};
        DAYS.forEach(function (d) { days[d] = (r.state.days[d] || []).filter(function (b) { return b && b.e > b.s; }); });
      }
      if (EDIT) status('Saved', 'is-ok'); else { var st = app.querySelector('.sc-status'); if (st) st.remove(); }
      paint();
    });
  }

  /* ---------- staff: every Riser ---------- */

  function staffAll() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/term-3/index.html">&larr; Term 3</a>'));
    app.appendChild(el('header', 'hd-page-head', '<div><p class="hd-eyebrow">Term 3</p><h1>Schedules</h1>' +
      '<p>Each Riser’s week, starting from the school timetable. Only staff can change a schedule; Risers see theirs on their Term 3 page.</p></div>'));
    var list = el('div', 'sc-kids', '<p class="sc-note">Loading…</p>');
    app.appendChild(list);
    var kids = window.EOT2_KIDS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    Promise.all(kids.map(function (k) { return window.eot2Fetch(k.group, k.slug, KEY); })).then(function (rs) {
      list.innerHTML = '';
      kids.forEach(function (k, i) {
        var st = rs[i] && rs[i].state;
        var n = st && st.days ? changes(st.days, k.slug) : 0;
        var a = el('a', 'sc-kid', '<strong>' + esc(k.name) + '</strong><span>' +
          (n ? n + ' change' + (n > 1 ? 's' : '') + ' from the school timetable' + (st.by ? ' · last by ' + esc(st.by === 'staff' ? 'staff' : st.by) : '') : 'Same as the school timetable') + '</span>');
        a.href = 'index.html?view=staff&kid=' + k.slug;
        if (n) a.classList.add('is-changed');
        list.appendChild(a);
      });
    });
  }

  if (params.get('view') === 'staff') {
    var staff = null;
    try { staff = localStorage.getItem('rj-staff-name'); } catch (e) {}
    if (!staff) { location.replace('../../index.html'); return; }
    var k = params.get('kid') && window.EOT2_findKid(params.get('kid'));
    if (k) editor(k, 'staff', '<a href="index.html?view=staff">&larr; Schedules</a>'); else staffAll();
    return;
  }
  var kid = window.EOT2_signedInKid();
  if (kid) editor(kid, 'kid', '<a href="../index.html">&larr; Term 3</a>');
  else window.EOT2_leaveWithoutKid('index.html?view=staff', '../../index.html');
})();
