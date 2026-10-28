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
   Staff, ?view=staff: every Riser and how many blocks changed, and the
   hours each week in each kind of time (Core Skills, STEM, …);
   ?view=staff&kid=<slug>: that Riser's schedule, to change.
   Add &week=1 for week 1 (26–30 October): it starts from the week 1 plan
   (week1-data.js) instead of the school timetable, is saved under
   term3-schedule-w1, and is changed the same way. */
(function () {
  var KEY = 'term3-schedule';
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  var DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
  var START = 8 * 60 + 45, END = 15 * 60, STEP = 15, PX = 1.7;
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  // Week 1 has its own plan and its own saved copy (staff only).
  var W1 = params.get('week') === '1';
  if (W1) KEY = 'term3-schedule-w1';
  var FROM = W1 ? 'the week 1 plan' : 'the school timetable';

  // Colours, and which one a block gets by its name.
  var COLOURS = [
    { id: 'gold', name: 'Gold', re: /negotiable|why quests|choose our quest/i },
    { id: 'blue', name: 'Blue', re: /core skills|progress board/i },
    { id: 'green', name: 'Green', re: /stem/i },
    { id: 'plum', name: 'Plum', re: /\bsel\b/i },
    { id: 'purple', name: 'Purple', re: /drama|music/i },
    { id: 'teal', name: 'Teal', re: /global|tamil/i },
    { id: 'brown', name: 'Brown', re: /carpentry/i },
    { id: 'leaf', name: 'Leaf', re: /garden/i },
    { id: 'orange', name: 'Orange', re: /recess|daring|catch-up|skill builder|games?\b|team building|classroom agreement|art \//i },
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
    var t = ((W1 ? window.T3_WEEK1 : window.T3_TIMETABLE) || {})[slug];
    var days = {};
    DAYS.forEach(function (d) {
      days[d] = ((t && t[d]) || []).map(function (x) { return { s: x[0], e: x[1], t: x[2], c: '' }; });
    });
    return days;
  }
  // A saved week 1 made before Thursday and Friday had a plan holds the
  // school timetable for those days: show the plan's placeholders instead.
  function upgrade(days, slug) {
    if (!W1 || !days) return days;
    var t = (window.T3_TIMETABLE || {})[slug] || {}, plan = school(slug);
    ['Thu', 'Fri'].forEach(function (d) {
      var a = (t[d] || []).map(function (x) { return x[0] + '|' + x[1] + '|' + x[2]; }).join(',');
      var b = (days[d] || []).map(function (x) { return x.s + '|' + x.e + '|' + x.t; }).join(',');
      if (a === b) days[d] = plan[d];
    });
    return days;
  }

  // How many blocks differ from the school timetable (or the week 1 plan).
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
      '<div><p class="hd-eyebrow">Term 3' + (W1 ? ' · Week 1, 26–30 October' : '') + '</p><h1>' + (who === 'staff' ? esc(kid.name) + '’s ' + (W1 ? 'week 1' : 'schedule') : 'My schedule') + '</h1>' +
      (EDIT ? '<p>Tap a block to change it. Drag a block to move it' +
        ' (on a phone or tablet, press and hold it first). Drag the bottom edge to make it longer or shorter. ' + (W1 ? 'Only staff see week 1.' : esc(kid.name) + ' sees the changes on their page.') + '</p></div>'
        : '<p>Your week at LifeHub. If something needs to change, ask a facilitator.</p></div>') +
      '<span class="sc-status">Loading…</span>'));
    if (EDIT) app.appendChild(weekSwitch('index.html?view=staff&kid=' + kid.slug));
    var tools = el('div', 'sc-tools',
      '<button type="button" class="sc-btn sc-add">+ Add a block</button>' +
      '<button type="button" class="sc-btn sc-undo" disabled>Undo</button>' +
      '<button type="button" class="sc-btn sc-ghost sc-reset">Start again from ' + FROM + '</button>' +
      '<button type="button" class="sc-btn sc-ghost sc-print">Print</button>');
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
      if (!confirm('Put back ' + FROM + '? Your changes will go.')) return;
      remember();
      days = school(kid.slug);
      changed();
    });
    tools.querySelector('.sc-print').addEventListener('click', function () { printCards([{ name: kid.name, days: days }]); });
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
            '<span class="sc-blk-t">' + esc(b.t || 'Untitled') + (EDIT && isChanged(b, d, base) ? ' <i class="sc-mark" title="Changed from ' + FROM + '">✎</i>' : '') + '</span>' +
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
        upgrade(days, kid.slug);
      }
      if (EDIT) status('Saved', 'is-ok'); else { var st = app.querySelector('.sc-status'); if (st) st.remove(); }
      paint();
    });
  }

  /* ---------- printing: a small desk card for each Riser ---------- */

  // Three to an A4 sheet (strips to cut apart) or one to an A5: the Riser's
  // name, the week, Monday to Friday, with a time at every 15 minutes down
  // the side so every start and end lines up.
  var SIZES = [
    { id: 'a4x3', name: '3 Risers on each A4 sheet', note: 'cut into strips of 21 × 9.9 cm', w: 210, h: 297, cw: 210, ch: 99, per: 3, small: true },
    { id: 'a5', name: '1 Riser on each A5 sheet', note: '21 × 14.8 cm, landscape', w: 210, h: 148, cw: 210, ch: 148, per: 1 }
  ];
  function printCards(cards) {
    var box = el('div', 'sc-modal');
    box.innerHTML = '<form class="sc-modal-card" role="dialog" aria-label="Print">' +
      '<h2>Print ' + (cards.length > 1 ? cards.length + ' schedules' : esc(cards[0].name) + '’s schedule') + '</h2>' +
      '<div class="sc-field"><span>Size</span>' + SIZES.map(function (z, i) {
        return '<label class="sc-size"><input type="radio" name="sz" value="' + z.id + '"' + (i ? '' : ' checked') + '> <b>' + z.name + '</b> <small>' + z.note + '</small></label>';
      }).join('') + '</div>' +
      '<p class="sc-note">In the print box, choose the same paper size (A4 or A5), and turn on background graphics for the colours.</p>' +
      '<div class="sc-modal-btns"><span></span><button type="button" class="sc-btn sc-ghost sc-cancel">Cancel</button><button type="submit" class="sc-btn sc-save">Print</button></div></form>';
    function close() { box.remove(); }
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    box.querySelector('.sc-cancel').addEventListener('click', close);
    box.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var z = SIZES.filter(function (x) { return x.id === box.querySelector('input[name=sz]:checked').value; })[0];
      close();
      printOut(cards, z);
    });
    document.body.appendChild(box);
  }
  function printOut(cards, z) {
    var old = document.querySelector('.sc-printout');
    if (old) old.remove();
    var small = !!z.small, pad = small ? 3 : 5, head = small ? 6.5 : 9, dayH = small ? 4 : 5, axis = small ? 8 : 10;
    var H = z.ch - 2 * pad - head - dayH, k = H / (END - START);
    var out = el('div', 'sc-printout' + (small ? ' is-small' : '')), sheet = null;
    cards.forEach(function (c, ci) {
      // A new sheet every z.per cards; the cards stack down it.
      if (ci % z.per === 0) {
        sheet = el('div', 'sc-sheet');
        sheet.style.width = z.w + 'mm'; sheet.style.height = z.h + 'mm';
        out.appendChild(sheet);
      }
      var page = el('div', 'sc-pp' + (z.per > 1 ? ' is-strip' : ''));
      page.style.width = z.cw + 'mm'; page.style.height = z.ch + 'mm'; page.style.padding = pad + 'mm';
      var html = '<div class="sc-pp-head" style="height:' + head + 'mm"><b>' + esc(c.name) + '</b><span>' + (W1 ? 'Week 1 · 26–30 October' : 'My week · Term 3') + '</span></div>' +
        '<div class="sc-pp-grid" style="grid-template-columns:' + axis + 'mm repeat(5, 1fr)">';
      // Time axis: a label at every 15 minutes.
      html += '<div><div style="height:' + dayH + 'mm"></div><div class="sc-pp-body" style="height:' + H + 'mm">';
      for (var m = START; m <= END; m += STEP) html += '<span class="sc-pp-t' + (m % 60 ? '' : ' is-hour') + '" style="top:' + ((m - START) * k) + 'mm">' + hm(m) + '</span>';
      html += '</div></div>';
      DAYS.forEach(function (d) {
        var list = (c.days[d] || []).slice().sort(function (a, b) { return a.s - b.s; });
        // Things at the same time sit side by side.
        var ends = [], lane = list.map(function (b) { var l = 0; while (ends[l] !== undefined && ends[l] > b.s) l++; ends[l] = b.e; return l; });
        html += '<div><div class="sc-pp-day" style="height:' + dayH + 'mm">' + DAY_NAMES[d] + '</div><div class="sc-pp-body sc-pp-col" style="height:' + H + 'mm;background-size:100% ' + (STEP * k) + 'mm">';
        list.forEach(function (b, i) {
          var of = 1;
          list.forEach(function (x, j) { if (x.s < b.e && x.e > b.s) of = Math.max(of, lane[j] + 1); });
          html += '<div class="sc-pp-b sc-c-' + colourOf(b) + (b.e - b.s <= 15 ? ' is-short' : '') + '" style="top:' + ((b.s - START) * k) + 'mm;height:' + ((b.e - b.s) * k) + 'mm;left:' + (lane[i] / of * 100) + '%;width:' + (100 / of) + '%">' +
            '<b>' + esc(b.t) + '</b><i>' + span(b) + '</i></div>';
        });
        html += '</div></div>';
      });
      page.innerHTML = html + '</div>';
      sheet.appendChild(page);
    });
    document.body.appendChild(out);
    var st = document.getElementById('sc-page-size') || document.head.appendChild(el('style'));
    st.id = 'sc-page-size';
    st.textContent = '@page { size: ' + z.w + 'mm ' + z.h + 'mm; margin: 0; }';
    setTimeout(function () { window.print(); }, 50);
  }

  // Usual week or week 1, for staff.
  function weekSwitch(href) {
    return el('div', 'sc-weeks',
      '<a class="sc-week' + (W1 ? '' : ' is-on') + '" href="' + href + '">Usual week</a>' +
      '<a class="sc-week' + (W1 ? ' is-on' : '') + '" href="' + href + '&week=1">Week 1 · 26–30 Oct</a>');
  }

  /* ---------- staff: week 1 at a glance ---------- */

  // Monday to Friday of week 1 for everyone, built from each Riser's
  // week 1 schedule (all[i]), so changes made either way show in both.
  // The same activity at overlapping or touching times is one block,
  // labelled with who is in it, in the same colours as the Riser's
  // schedule; music and Tamil are a bar for each time, with names. Tap a
  // block or bar to change its name, times or who is in it, or delete it;
  // Add a block; Undo; Start everyone again.
  // A change is saved into each Riser's week 1 schedule it touches; new
  // or moved times fit around that Riser's music and Tamil.
  function glance(box, kids, all, saved) {
    var GDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], OUT = /music|tamil/i, n = kids.length;
    var past = [], clusters = [];

    function who(set) {
      if (set.length === n) return '';
      var G = window.T3_WEEK1_GROUPS || {}, label = Object.keys(G).filter(function (g) {
        return G[g].length === set.length && G[g].every(function (s) { return set.indexOf(s) !== -1; });
      })[0];
      if (label) return label;
      var name = function (k) { return k.name; };
      if (set.length >= n - 3) return 'All except ' + kids.filter(function (k) { return set.indexOf(k.slug) === -1; }).map(name).join(', ');
      return kids.filter(function (k) { return set.indexOf(k.slug) !== -1; }).map(name).join(', ');
    }

    // Blocks for one day: the same activity at overlapping or touching
    // times is one block; src keeps each Riser's own pieces of it.
    function group(d) {
      var blocks = [], bars = [];
      kids.forEach(function (k, i) {
        (all[i][d] || []).forEach(function (b) {
          if (OUT.test(b.t)) {
            var same = bars.filter(function (x) { return x.t === b.t && x.s === b.s && x.e === b.e; })[0];
            if (same) { same.names.push(k.name); same.kids.push(k.slug); same.src.push({ i: i, b: b }); }
            else bars.push({ d: d, s: b.s, e: b.e, t: b.t, names: [k.name], kids: [k.slug], src: [{ i: i, b: b }] });
            return;
          }
          blocks.push({ d: d, s: b.s, e: b.e, t: b.t, kids: [k.slug], src: [{ i: i, b: b }] });
        });
      });
      for (var again = true; again;) {
        again = false;
        for (var x = 0; x < blocks.length && !again; x++) for (var y = x + 1; y < blocks.length && !again; y++) {
          var A = blocks[x], B = blocks[y];
          if (A.t !== B.t || B.s > A.e || B.e < A.s) continue;
          A.s = Math.min(A.s, B.s); A.e = Math.max(A.e, B.e);
          B.kids.forEach(function (k) { if (A.kids.indexOf(k) === -1) A.kids.push(k); });
          A.src = A.src.concat(B.src);
          blocks.splice(y, 1); again = true;
        }
      }
      return { blocks: blocks, bars: bars };
    }

    function draw() {
      clusters = [];
      var cols = (END - START) / STEP;
      var html = '<div class="sc-gl-head"><h2>Week 1 at a glance</h2><span class="sc-gl-status"></span></div>' +
        '<div class="sc-tools"><button type="button" class="sc-btn sc-gl-add">+ Add a block</button>' +
        '<button type="button" class="sc-btn sc-gl-undo"' + (past.length ? '' : ' disabled') + '>Undo</button>' +
        '<button type="button" class="sc-btn sc-ghost sc-gl-reset">Start everyone again from the week 1 plan</button></div>' +
        '<p class="sc-note">Tap any block, or a music or Tamil bar, to change it, change who is in it, or delete it.</p>' +
        '<div class="sc-gl-scroll"><div class="sc-gl" style="grid-template-columns:110px repeat(' + cols + ',minmax(0,1fr))">';
      for (var m = START; m < END; m += STEP) html += '<div class="sc-gl-t" style="grid-column:' + ((m - START) / STEP + 2) + '">' + hm(m) + '</div>';
      var row = 2;
      GDAYS.forEach(function (d) {
        var g = group(d), blocks = g.blocks, bars = g.bars;
        blocks.sort(function (a, b) { return a.s - b.s || b.kids.length - a.kids.length; });
        var ends = [];
        blocks.forEach(function (b) { var l = 0; while (ends[l] !== undefined && ends[l] > b.s) l++; ends[l] = b.e; b.lane = l; });
        bars.sort(function (a, b) { return a.s - b.s; });
        var bends = [];
        bars.forEach(function (b) { var l = 0; while (bends[l] !== undefined && bends[l] > b.s) l++; bends[l] = b.e; b.lane = l; });
        var lanes = Math.max(ends.length, 1), blanes = bends.length;
        html += '<div class="sc-gl-day" style="grid-row:' + row + '/span ' + (lanes + blanes) + '">' + DAY_NAMES[d] + '</div>';
        blocks.forEach(function (b) {
          var ci = clusters.push(b) - 1;
          var span = b.lane === 0 && blocks.every(function (x) { return x.lane === 0 || x.e <= b.s || x.s >= b.e; }) ? lanes : 1;
          var c1 = (b.s - START) / STEP + 2, c2 = (b.e - START) / STEP + 2, w = who(b.kids);
          html += '<button type="button" data-ci="' + ci + '" class="sc-gl-b sc-c-' + colourOf(b.src[0].b) + (c2 - c1 <= 1 ? ' is-narrow' : '') + '" style="grid-row:' + (row + b.lane) + '/span ' + span + ';grid-column:' + c1 + '/' + c2 + '"' +
            ' aria-label="' + esc(b.t + ', ' + DAY_NAMES[d] + ' ' + hm(b.s) + '–' + hm(b.e) + (w ? ', ' + w : '') + '. Tap to change.') + '">' +
            '<u>' + hm(b.s) + '–' + hm(b.e) + '</u><b>' + esc(b.t) + '</b>' + (w && c2 - c1 > 1 ? '<i>' + esc(w) + '</i>' : '') + '</button>';
        });
        bars.forEach(function (b) {
          var ci = clusters.push(b) - 1;
          html += '<button type="button" data-ci="' + ci + '" class="sc-gl-bar sc-c-' + colourOf(b.src[0].b) + '" style="grid-row:' + (row + lanes + b.lane) + ';grid-column:' + ((b.s - START) / STEP + 2) + '/' + ((b.e - START) / STEP + 2) + '"' +
            ' aria-label="' + esc(b.names.join(', ') + ' – ' + b.t + ', ' + DAY_NAMES[d] + ' ' + hm(b.s) + '–' + hm(b.e) + '. Tap to change.') + '">' +
            esc(b.names.join(', ')) + ' – ' + esc(b.t) + ' · ' + hm(b.s) + '–' + hm(b.e) + '</button>';
        });
        row += lanes + blanes;
      });
      box.innerHTML = html + '</div></div><p class="sc-note">Thursday and Friday are placeholders (To be planned) until they are planned. Open a Riser below to change just their week 1.</p>';
      Array.prototype.forEach.call(box.querySelectorAll('.sc-gl-b, .sc-gl-bar'), function (bt) {
        bt.addEventListener('click', function () { var c = clusters[+bt.dataset.ci]; sheet(c, c.d); });
      });
      box.querySelector('.sc-gl-add').addEventListener('click', function () { sheet(null, 'Mon'); });
      box.querySelector('.sc-gl-undo').addEventListener('click', function () {
        if (!past.length) return;
        var prev = past.pop();
        prev.forEach(function (days, i) { all[i] = days; });
        save(kids.map(function (k, i) { return i; }));
      });
      box.querySelector('.sc-gl-reset').addEventListener('click', function () {
        if (!confirm('Put back the week 1 plan for every Riser? All week 1 changes will go.')) return;
        remember();
        kids.forEach(function (k, i) { all[i] = school(k.slug); });
        save(kids.map(function (k, i) { return i; }));
      });
    }

    function status(t, cls) { var s = box.querySelector('.sc-gl-status'); if (s) { s.textContent = t; s.className = 'sc-gl-status sc-status ' + (cls || ''); } }
    function remember() { past.push(clone(all)); if (past.length > 30) past.shift(); }
    function save(idx) {
      draw();
      status('Saving…');
      Promise.all(idx.map(function (i) {
        return window.eot2Save(kids[i].group, kids[i].slug, KEY, { days: all[i], u: Date.now(), by: 'staff' });
      })).then(function (rs) {
        var ok = rs.every(function (r) { return r.ok; });
        status(ok ? 'Saved' : 'Not saved — check the connection', ok ? 'is-ok' : 'is-bad');
        saved(all);
      });
    }

    // Put [s, e] into one Riser's day, around their music and Tamil.
    function fill(list, s, e, t) {
      var at = s;
      list.filter(function (b) { return OUT.test(b.t) && b.s < e && b.e > s; }).sort(function (a, b) { return a.s - b.s; }).forEach(function (g) {
        if (g.s > at) list.push({ s: at, e: g.s, t: t, c: '' });
        at = Math.max(at, g.e);
      });
      if (at < e) list.push({ s: at, e: e, t: t, c: '' });
    }

    // Change a block for everyone in it (c), or add one (c is null).
    function sheet(c, d) {
      var f = c ? { t: c.t, s: c.s, e: c.e, d: d, kids: c.kids.slice() } : { t: '', s: 9 * 60, e: 9 * 60 + 30, d: d, kids: [] };
      var opts = function (from, to, v) {
        var h = '';
        for (var m = from; m <= to; m += STEP) h += '<option value="' + m + '"' + (m === v ? ' selected' : '') + '>' + hm(m) + '</option>';
        return h;
      };
      var modal = el('div', 'sc-modal');
      modal.innerHTML = '<form class="sc-modal-card" role="dialog" aria-label="' + (c ? 'Change this block' : 'Add a block') + '">' +
        '<h2>' + (c ? 'Change this block' : 'Add a block') + '</h2>' +
        '<label class="sc-field"><span>What is it?</span><input type="text" class="sc-e-t" maxlength="60" value="' + esc(f.t) + '" placeholder="Like “Reading time”"></label>' +
        '<div class="sc-row">' +
          '<label class="sc-field"><span>Day</span><select class="sc-e-d"' + (c ? ' disabled' : '') + '>' + GDAYS.map(function (x) { return '<option value="' + x + '"' + (x === d ? ' selected' : '') + '>' + DAY_NAMES[x] + '</option>'; }).join('') + '</select></label>' +
          '<label class="sc-field"><span>Starts</span><select class="sc-e-s">' + opts(START, END - STEP, f.s) + '</select></label>' +
          '<label class="sc-field"><span>Ends</span><select class="sc-e-e">' + opts(START + STEP, END, f.e) + '</select></label>' +
        '</div>' +
        '<div class="sc-field"><span>Who</span><div class="sc-who">' +
          '<button type="button" class="sc-who-all">Everyone</button><button type="button" class="sc-who-none">No one</button>' +
          kids.map(function (k) { return '<label><input type="checkbox" value="' + k.slug + '"' + (f.kids.indexOf(k.slug) !== -1 ? ' checked' : '') + '> ' + esc(k.name) + '</label>'; }).join('') +
        '</div></div>' +
        '<p class="sc-err" hidden></p>' +
        '<div class="sc-modal-btns">' + (c ? '<button type="button" class="sc-btn sc-ghost sc-del">Delete for everyone</button>' : '') +
          '<span></span><button type="button" class="sc-btn sc-ghost sc-cancel">Cancel</button><button type="submit" class="sc-btn sc-save">Save</button></div>' +
        '</form>';
      function close() { modal.remove(); }
      function ticks(v) { Array.prototype.forEach.call(modal.querySelectorAll('.sc-who input'), function (x) { x.checked = v; }); }
      modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
      modal.querySelector('.sc-cancel').addEventListener('click', close);
      modal.querySelector('.sc-who-all').addEventListener('click', function () { ticks(true); });
      modal.querySelector('.sc-who-none').addEventListener('click', function () { ticks(false); });
      if (c) modal.querySelector('.sc-del').addEventListener('click', function () {
        if (!confirm('Delete “' + c.t + '” ' + DAY_NAMES[d] + ' ' + hm(c.s) + '–' + hm(c.e) + ' for everyone in it?')) return;
        close(); apply(c, d, null);
      });
      modal.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var t = modal.querySelector('.sc-e-t').value.trim(), s = +modal.querySelector('.sc-e-s').value, en = +modal.querySelector('.sc-e-e').value;
        var picked = Array.prototype.filter.call(modal.querySelectorAll('.sc-who input'), function (x) { return x.checked; }).map(function (x) { return x.value; });
        var err = modal.querySelector('.sc-err');
        if (!t) { err.textContent = 'Give it a name.'; err.hidden = false; return; }
        if (en <= s) { err.textContent = 'It has to end after it starts.'; err.hidden = false; return; }
        if (!picked.length) { err.textContent = 'Tick who it is for.'; err.hidden = false; return; }
        close(); apply(c, c ? d : modal.querySelector('.sc-e-d').value, { t: t, s: s, e: en, kids: picked });
      });
      document.body.appendChild(modal);
      modal.querySelector('.sc-e-t').focus();
    }

    // Apply a change to each Riser it touches. Same times: rename each
    // Riser's own pieces. New times: one block per Riser, around their
    // music and Tamil. Not ticked any more: their pieces go.
    function apply(c, d, f) {
      remember();
      var touched = [];
      kids.forEach(function (k, i) {
        var mine = c ? c.src.filter(function (x) { return x.i === i; }).map(function (x) { return x.b; }) : [];
        var want = !!f && f.kids.indexOf(k.slug) !== -1;
        if (!mine.length && !want) return;
        var list = all[i][d] = all[i][d] || [];
        if (want && mine.length && f.s === c.s && f.e === c.e) mine.forEach(function (b) { b.t = f.t; });
        else {
          mine.forEach(function (b) { list.splice(list.indexOf(b), 1); });
          if (want) fill(list, f.s, f.e, f.t);
        }
        list.sort(function (x, y) { return x.s - y.s; });
        touched.push(i);
      });
      save(touched);
    }

    draw();
  }

  /* ---------- staff: hours each week ---------- */

  // How each Riser's week (as it is now, with any changes) splits into
  // kinds of time, in hours. Learning time comes first; lunch, snack and
  // early dismissal are listed apart.
  var KINDS = [
    { id: 'core', c: 'blue', name: 'Core Skills', note: 'with Progress Board, Skill Builder and Conference', re: /core skills|progress board|skill builder|conference/i },
    { id: 'neg', c: 'gold', name: 'Negotiable Time', re: /negotiable/i },
    { id: 'stem', c: 'green', name: 'STEM', re: /stem/i },
    { id: 'garden', c: 'leaf', name: 'Gardening and Homescience', re: /garden|homescience/i },
    { id: 'carp', c: 'brown', name: 'Carpentry', re: /carpentry/i },
    { id: 'sel', c: 'plum', name: 'SEL', note: 'with Daring Discussion and Monday Catch-Up', re: /\bsel\b|daring|catch-up/i },
    { id: 'global', c: 'teal', name: 'Global Exploration', re: /global/i },
    { id: 'arts', c: 'purple', name: 'Drama and Music', re: /drama|music/i },
    { id: 'tamil', c: 'teal', name: 'Tamil', re: /tamil/i },
    { id: 'recess', c: 'orange', name: 'Riser Recess', re: /recess/i },
    { id: 'wrap', c: 'red', name: 'Friday: Progress Board and email home', re: /set up progress board|email/i },
    { id: 'other', c: 'grey', name: 'Other', re: /^/ },
    { id: 'breaks', c: 'grey', name: 'Lunch and snack', apart: true, re: /lunch|snack/i },
    { id: 'early', c: 'red', name: 'Early dismissal', apart: true, re: /dismissal/i }
  ];
  function kindOf(t) {
    // The Friday wrap-up says "Progress Board" too, so it's checked first.
    if (/set up progress board|email/i.test(t)) return 'wrap';
    var order = ['breaks', 'early', 'core', 'neg', 'stem', 'garden', 'carp', 'sel', 'global', 'arts', 'tamil', 'recess'];
    for (var i = 0; i < order.length; i++) {
      var k = KINDS.filter(function (x) { return x.id === order[i]; })[0];
      if (k.re.test(t)) return k.id;
    }
    return 'other';
  }
  function hoursOf(days) {
    var out = {};
    KINDS.forEach(function (k) { out[k.id] = 0; });
    DAYS.forEach(function (d) { (days[d] || []).forEach(function (b) { out[kindOf(b.t)] += b.e - b.s; }); });
    return out;
  }
  // 435 minutes is "7¼ h".
  function hrs(min) {
    if (!min) return '–';
    var h = Math.floor(min / 60), q = Math.round((min % 60) / 15);
    return (h || !q ? h : '') + ['', '¼', '½', '¾'][q] + ' h';
  }
  function hoursEl(kids, all) {
    var per = all.map(hoursOf);
    var used = KINDS.filter(function (k) { return per.some(function (p) { return p[k.id]; }); });
    var avg = {};
    used.forEach(function (k) { avg[k.id] = per.reduce(function (n, p) { return n + p[k.id]; }, 0) / per.length; });
    var learn = used.filter(function (k) { return !k.apart; }), apart = used.filter(function (k) { return k.apart; });
    var week = used.reduce(function (n, k) { return n + avg[k.id]; }, 0);
    var learnTotal = learn.reduce(function (n, k) { return n + avg[k.id]; }, 0);
    var box = el('section', 'sc-hours');
    var top = Math.max.apply(null, learn.map(function (k) { return avg[k.id]; }));
    box.innerHTML = '<h2>⏱️ Hours each week</h2>' +
      '<p class="sc-note">A school week is ' + hrs(week) + ' (8:45 to 3:00, Monday to Friday). Of that, ' + hrs(learnTotal) + ' is learning time; the rest is lunch, snack and early dismissal. Worked out from each Riser’s schedule as it is now.</p>' +
      '<h3>An average Riser’s week</h3><div class="sc-hbars">' + learn.map(function (k) {
        return '<div class="sc-hbar"><span class="sc-hname">' + esc(k.name) + (k.note ? '<small>' + esc(k.note) + '</small>' : '') + '</span>' +
          '<span class="sc-htrack"><span class="sc-hfill sc-c-' + k.c + '" style="width:' + Math.max(2, Math.round(avg[k.id] / top * 100)) + '%"></span></span>' +
          '<span class="sc-hval">' + hrs(Math.round(avg[k.id] / 15) * 15) + ' <small>' + Math.round(avg[k.id] / learnTotal * 100) + '%</small></span></div>';
      }).join('') + '</div>' +
      (apart.length ? '<p class="sc-note">Not counted above: ' + apart.map(function (k) { return esc(k.name.toLowerCase()) + ' ' + hrs(Math.round(avg[k.id] / 15) * 15); }).join(', ') + '.</p>' : '') +
      '<h3>Each Riser</h3><div class="sc-htable-wrap"><table class="sc-htable"><thead><tr><th></th>' +
      kids.map(function (k) { return '<th>' + esc(k.name) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      learn.map(function (k) {
        return '<tr><td>' + esc(k.name) + '</td>' + per.map(function (p) {
          var d = p[k.id] - avg[k.id];
          return '<td class="' + (d >= 45 ? 'is-more' : d <= -45 ? 'is-less' : '') + '">' + hrs(p[k.id]) + '</td>';
        }).join('') + '</tr>';
      }).join('') +
      '<tr class="sc-htotal"><td>Learning time</td>' + per.map(function (p) {
        return '<td>' + hrs(learn.reduce(function (n, k) { return n + p[k.id]; }, 0)) + '</td>';
      }).join('') + '</tr></tbody></table></div>' +
      '<p class="sc-note"><span class="sc-key is-more"></span> ¾ hour or more above the average &nbsp; <span class="sc-key is-less"></span> ¾ hour or more below it</p>';
    return box;
  }

  /* ---------- staff: every Riser ---------- */

  function staffAll() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/term-3/index.html">&larr; Term 3</a>'));
    app.appendChild(el('header', 'hd-page-head', '<div><p class="hd-eyebrow">Term 3</p><h1>Schedules</h1>' +
      (W1 ? '<p>Week 1 (26–30 October), starting from the week 1 plan: Monday to Wednesday are the launch days; Thursday and Friday are placeholders for now. Only staff see and change it.</p></div>'
        : '<p>Each Riser’s week, starting from the school timetable. Only staff can change a schedule; Risers see theirs on their Term 3 page.</p></div>')));
    app.appendChild(weekSwitch('index.html?view=staff'));
    var current = null;
    var printAll = el('button', 'sc-btn sc-ghost sc-print-all', 'Print everyone’s ' + (W1 ? 'week 1' : 'schedule'));
    printAll.type = 'button';
    printAll.disabled = true;
    printAll.addEventListener('click', function () {
      printCards(kids.map(function (k, i) { return { name: k.name, days: current[i] }; }));
    });
    app.appendChild(el('div', 'sc-tools')).appendChild(printAll);
    var glanceBox = el('div', 'sc-glance');
    if (W1) app.appendChild(glanceBox);
    var list = el('div', 'sc-kids', '<p class="sc-note">Loading…</p>');
    app.appendChild(list);
    var kids = window.EOT2_KIDS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    // Each Riser: how many blocks differ from the plan, and a link.
    function paintList(states) {
      list.innerHTML = '';
      kids.forEach(function (k, i) {
        var st = states[i];
        var n = st && st.days ? changes(st.days, k.slug) : 0;
        var a = el('a', 'sc-kid', '<strong>' + esc(k.name) + '</strong><span>' +
          (n ? n + ' change' + (n > 1 ? 's' : '') + ' from ' + FROM + (st.by ? ' · last by ' + esc(st.by === 'staff' ? 'staff' : st.by) : '') : 'Same as ' + FROM) + '</span>');
        a.href = 'index.html?view=staff&kid=' + k.slug + (W1 ? '&week=1' : '');
        if (n) a.classList.add('is-changed');
        list.appendChild(a);
      });
    }
    Promise.all(kids.map(function (k) { return window.eot2Fetch(k.group, k.slug, KEY); })).then(function (rs) {
      var states = rs.map(function (r, i) { var st = r && r.state; if (st && st.days) upgrade(st.days, kids[i].slug); return st; });
      current = states.map(function (st, i) { return st && st.days ? st.days : school(kids[i].slug); });
      printAll.disabled = false;
      if (W1) glance(glanceBox, kids, current, function (all) {
        current = all;
        paintList(all.map(function (days) { return { days: days, by: 'staff' }; }));
      });
      paintList(states);
      if (!W1) app.appendChild(hoursEl(kids, states.map(function (st, i) { return st && st.days ? st.days : school(kids[i].slug); })));
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
