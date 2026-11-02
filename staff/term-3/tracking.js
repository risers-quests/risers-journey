/* Assessment Tracking, staff only: each Riser's workbooks, assessments,
   times tables and spelling, changed and added to here.

   One record per Riser, week key term3-tracking:
     { workbooks: [{ subject, grade, link }],
       assessments: [{ subject, section, requested, scheduled, score, feedback, comments }],
       tables: [{ date, covered, correct, total, mins, remarks }],
       spelling: [{ week, date, score }], u, by }
   Dates are kept as typed (2026-11-04 shows as 4 Nov 2026). Saving fetches
   the newest copy first only to keep staff from losing a newer save made
   elsewhere; the whole record is then written.

   Import spreadsheet reads the Assessment Tracking workbook in the browser
   (SheetJS) into these records, so the marks never sit in the site's code. */
(function () {
  var KEY = 'term3-tracking';
  var XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var STAFF = '';
  try { STAFF = localStorage.getItem('rj-staff-name') || ''; } catch (e) {}
  if (!STAFF) { location.replace('../../index.html'); return; }

  var KIDS = window.EOT2_KIDS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
  var LISTS = {
    assessments: { title: 'Assessments', cols: [
      ['subject', 'Subject', 110], ['section', 'Section', 170], ['requested', 'Requested', 110], ['scheduled', 'Scheduled', 110],
      ['score', 'Score', 70], ['%', '%'], ['feedback', 'Feedback / areas for revision', 260], ['comments', 'Comments', 180]] },
    tables: { title: 'Times tables', cols: [
      ['date', 'Date', 110], ['covered', 'Tables covered', 170], ['correct', 'Correct', 70], ['total', 'Total', 70], ['%', 'Score %'],
      ['mins', 'Time (mins)', 70], ['avg', 'Avg / question (sec)'], ['remarks', 'Remarks / feedback', 260]] },
    spelling: { title: 'Spelling', cols: [['week', 'Week', 90], ['date', 'Date', 110], ['score', 'Score', 80], ['%', '%']] },
    workbooks: { title: 'Subject workbooks', cols: [['subject', 'Subject', 150], ['grade', 'Grade', 70], ['link', 'Table of contents link', 380]] }
  };
  var ORDER = ['assessments', 'tables', 'spelling', 'workbooks'];

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
  function blank() { return { workbooks: [], assessments: [], tables: [], spelling: [] }; }
  // "38/40" → 95, or "" when it isn't a score.
  function pct(a, b) {
    if (b === undefined) { var m = /^\s*([\d.]+)\s*\/\s*([\d.]+)\s*$/.exec(a || ''); if (!m) return ''; a = m[1]; b = m[2]; }
    a = parseFloat(a); b = parseFloat(b);
    return isFinite(a) && isFinite(b) && b > 0 ? Math.round(a / b * 100) : '';
  }

  var kid = window.EOT2_findKid(params.get('kid')) || KIDS[0];
  var rec = blank(), timer = null;

  app.innerHTML = '';
  app.appendChild(el('div', 'dash-crumb', '<a href="index.html">&larr; Term 3</a>'));
  app.appendChild(el('header', 'hd-page-head', '<div><p class="hd-eyebrow">Term 3 · Staff only</p><h1>Assessment Tracking</h1>' +
    '<p>Each Riser’s assessments, times tables, spelling and workbooks. Type in any box to change it; it saves as you go.</p></div>'));
  var top = el('div', 'tk-top');
  var status = el('span', 'tk-msg');
  var imp = el('button', 'tk-btn', 'Import spreadsheet');
  imp.type = 'button';
  var file = el('input');
  file.type = 'file';
  file.accept = '.xlsx';
  file.hidden = true;
  top.appendChild(imp); top.appendChild(file); top.appendChild(status);
  app.appendChild(top);
  var picker = el('div', 'tk-kids');
  app.appendChild(picker);
  var body = el('div');
  app.appendChild(body);

  function setStatus(t, cls) { status.textContent = t; status.className = 'tk-msg' + (cls ? ' ' + cls : ''); }

  function drawPicker() {
    picker.innerHTML = '';
    KIDS.forEach(function (k) {
      var b = el('button', 'tk-kid' + (k.slug === kid.slug ? ' is-on' : ''), esc(k.name));
      b.type = 'button';
      b.addEventListener('click', function () { if (k.slug === kid.slug) return; kid = k; history.replaceState(null, '', '?kid=' + k.slug); open(); });
      picker.appendChild(b);
    });
  }

  function open() {
    drawPicker();
    body.innerHTML = '<p class="tk-empty">Loading…</p>';
    window.eot2Fetch(kid.group, kid.slug, KEY).then(function (r) {
      rec = Object.assign(blank(), (r && r.state) || {});
      setStatus(r && r.state && r.state.u ? 'Saved' : '', 'is-ok');
      draw();
    });
  }

  function save() {
    setStatus('Saving…');
    if (timer) clearTimeout(timer);
    var who = kid, mine = rec;
    timer = setTimeout(function () {
      mine.u = Date.now(); mine.by = STAFF;
      window.eot2Save(who.group, who.slug, KEY, mine).then(function (r) {
        setStatus(r.ok ? 'Saved' : 'Not saved — check the connection', r.ok ? 'is-ok' : 'is-bad');
      });
    }, 700);
  }

  function draw() {
    body.innerHTML = '';
    ORDER.forEach(function (name) {
      var L = LISTS[name], rows = rec[name] = rec[name] || [];
      var sec = el('section', 'tk-sec', '<h2>' + L.title + '</h2>');
      var wrap = el('div', 'tk-wrap'), t = el('table', 'tk-table');
      t.innerHTML = '<thead><tr>' + L.cols.map(function (c) { return '<th>' + c[1] + '</th>'; }).join('') + '<th></th></tr></thead>';
      var tb = el('tbody');
      rows.forEach(function (row, i) {
        var tr = el('tr');
        L.cols.forEach(function (c) {
          var td = el('td');
          if (c[0] === '%' || c[0] === 'avg') {
            var calc = el('span', 'tk-calc');
            var paint = function () {
              var v = c[0] === 'avg' ? (parseFloat(row.mins) > 0 && parseFloat(row.total) > 0 ? Math.round(row.mins * 60 / row.total * 10) / 10 : '')
                : name === 'tables' ? pct(row.correct, row.total) : pct(row.score);
              calc.textContent = v === '' ? '' : c[0] === 'avg' ? v : v + '%';
              calc.className = 'tk-calc' + (c[0] === '%' && v !== '' ? (v >= 80 ? ' is-hi' : v < 50 ? ' is-lo' : '') : '');
            };
            paint();
            row._paint = (row._paint || []).concat(paint);
            td.appendChild(calc);
          } else {
            // A box that grows to fit what's in it.
            var inp = el('textarea', 'tk-in');
            inp.rows = 1;
            inp.style.minWidth = (c[2] || 90) + 'px';
            inp.value = row[c[0]] || '';
            inp.setAttribute('aria-label', c[1]);
            var fit = function () { inp.style.height = 'auto'; inp.style.height = inp.scrollHeight + 2 + 'px'; };
            setTimeout(fit, 0);
            inp.addEventListener('input', function () {
              fit();
              row[c[0]] = inp.value;
              (row._paint || []).forEach(function (f) { f(); });
              save();
            });
            td.appendChild(inp);
            if (c[0] === 'link' && /^https?:\/\//.test(row.link || '')) {
              var a = el('a', 'tk-open', 'Open ↗');
              a.href = row.link; a.target = '_blank'; a.rel = 'noopener';
              td.appendChild(a);
            }
          }
          tr.appendChild(td);
        });
        var del = el('button', 'tk-del', '✕');
        del.type = 'button';
        del.setAttribute('aria-label', 'Delete this row');
        del.addEventListener('click', function () {
          if (!confirm('Delete this row?')) return;
          rows.splice(i, 1); save(); draw();
        });
        var td = el('td'); td.appendChild(del); tr.appendChild(td);
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      wrap.appendChild(t);
      if (rows.length) sec.appendChild(wrap); else sec.appendChild(el('p', 'tk-empty', 'Nothing yet.'));
      var add = el('button', 'tk-add', '+ Add a row');
      add.type = 'button';
      add.addEventListener('click', function () {
        var r = {};
        if (name === 'assessments' || name === 'tables' || name === 'spelling') r[name === 'assessments' ? 'scheduled' : 'date'] = new Date().toISOString().slice(0, 10);
        rows.push(r); save(); draw();
        var ins = body.querySelectorAll('section')[ORDER.indexOf(name)].querySelectorAll('tbody tr:last-child .tk-in');
        if (ins[0]) ins[0].focus();
      });
      sec.appendChild(add);
      body.appendChild(sec);
    });
  }
  // Keep the paint helpers out of what is saved.
  var stringify = JSON.stringify;
  window.eot2Save = (function (orig) {
    return function (g, k, w, state) { return orig(g, k, w, JSON.parse(stringify(state, function (key, v) { return key === '_paint' ? undefined : v; }))); };
  })(window.eot2Save);

  /* ---------- import from the spreadsheet ---------- */

  imp.addEventListener('click', function () { file.click(); });
  file.addEventListener('change', function () {
    var f = file.files[0];
    file.value = '';
    if (!f) return;
    setStatus('Reading the spreadsheet…');
    loadXlsx().then(function (XLSX) {
      return f.arrayBuffer().then(function (buf) { return readBook(XLSX.read(buf, { type: 'array', cellDates: true })); });
    }).then(function (data) {
      var slugs = Object.keys(data);
      if (!slugs.length) { setStatus('Couldn’t find any Risers in that file.', 'is-bad'); return; }
      return Promise.all(slugs.map(function (s) { var k = window.EOT2_findKid(s); return window.eot2Fetch(k.group, k.slug, KEY); })).then(function (rs) {
        var have = slugs.filter(function (s, i) { return rs[i] && rs[i].state && rs[i].state.u; });
        var msg = 'Import tracking for ' + slugs.length + ' Risers from this spreadsheet?' +
          (have.length ? '\n\nThis replaces what’s already saved here for: ' + have.map(function (s) { return window.EOT2_findKid(s).name; }).join(', ') + '.' : '');
        if (!confirm(msg)) { setStatus(''); return; }
        setStatus('Saving…');
        return Promise.all(slugs.map(function (s) {
          var k = window.EOT2_findKid(s);
          return window.eot2Save(k.group, k.slug, KEY, Object.assign(blank(), data[s], { u: Date.now(), by: STAFF }));
        })).then(function (res) {
          var bad = res.filter(function (r) { return !r.ok; }).length;
          setStatus(bad ? bad + ' not saved — check the connection and import again.' : 'Imported ' + slugs.length + ' Risers.', bad ? 'is-bad' : 'is-ok');
          open();
        });
      });
    }).catch(function () { setStatus('Couldn’t read that file. Is it the Assessment Tracking spreadsheet (.xlsx)?', 'is-bad'); });
  });

  function loadXlsx() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = XLSX_URL;
      s.onload = function () { resolve(window.XLSX); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // The workbook: a sheet per Riser (workbooks, then Assessments), a Times
  // Tables sheet (a block per Riser) and a Spelling sheet (a pair of
  // columns per Riser).
  function readBook(wb) {
    var X = window.XLSX, out = {};
    function slugOf(name) {
      var n = String(name || '').trim().toLowerCase();
      var k = KIDS.filter(function (x) { return x.name.toLowerCase() === n || (n.indexOf(x.name.toLowerCase()) === 0 && n.length > x.name.length); })[0];
      return k ? k.slug : '';
    }
    function d(v) {
      if (v instanceof Date) return v.getFullYear() + '-' + ('0' + (v.getMonth() + 1)).slice(-2) + '-' + ('0' + v.getDate()).slice(-2);
      if (v == null) return '';
      var s = String(v).trim();
      return /^-+$/.test(s) ? '' : s;
    }
    // Excel turned some scores like 7/8 into dates (7 August): put them back.
    function score(v) { return v instanceof Date ? v.getDate() + '/' + (v.getMonth() + 1) : d(v); }
    function num(v) { return typeof v === 'number' ? String(Math.round(v * 100) / 100) : d(v); }
    function rows(ws) { return X.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null, blankrows: false }); }
    function recOf(slug) { return (out[slug] = out[slug] || blank()); }

    wb.SheetNames.forEach(function (sn) {
      var ws = wb.Sheets[sn], slug = slugOf(sn);
      if (/times\s*tables/i.test(sn)) {
        var cur = '';
        rows(ws).forEach(function (r) {
          if (!r.some(function (v) { return v != null; })) return;
          if (r[0] && r[1] == null && !(r[0] instanceof Date)) { cur = slugOf(r[0]); return; }
          if (r[0] === 'Date' || !cur || (r[0] == null && r[1] == null && r[2] == null)) return;
          recOf(cur).tables.push({ date: d(r[0]), covered: d(r[1]), correct: num(r[2]), total: num(r[3]), mins: num(r[5]), remarks: d(r[7]) });
        });
        return;
      }
      if (/spelling/i.test(sn)) {
        var rs = rows(ws), head = rs[0] || [], cols = [];
        head.forEach(function (h, c) { var s = slugOf(String(h || '').split('(')[0]); if (s) cols.push({ c: c, slug: s }); });
        rs.slice(2).forEach(function (r) {
          if (!r[0]) return;
          cols.forEach(function (x) {
            var dt = d(r[x.c]), sc = d(r[x.c + 1]);
            if (dt || sc) recOf(x.slug).spelling.push({ week: d(r[0]), date: dt, score: sc });
          });
        });
        return;
      }
      if (!slug) return;
      var R = recOf(slug), mode = '';
      rows(ws).forEach(function (r) {
        if (!r.some(function (v) { return v != null; })) return;
        if (r[1] === 'Subject Workbooks') { mode = 'wb'; return; }
        if (r[0] === 'Assessments') return;
        if (r[0] === 'Subject' && r[1] === 'Section') { mode = 'as'; return; }
        if (mode === 'wb' && r[1]) R.workbooks.push({ subject: d(r[1]), grade: num(r[2]), link: d(r[3]) });
        else if (mode === 'as' && r[0]) R.assessments.push({ subject: d(r[0]), section: d(r[1]), requested: d(r[2]), scheduled: d(r[3]), score: score(r[4]), feedback: d(r[5]), comments: d(r[6]) });
      });
    });
    return out;
  }

  open();
})();
