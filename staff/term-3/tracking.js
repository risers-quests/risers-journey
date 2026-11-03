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

   custom: { <section id>: [rows] } for sections staff add (see DEFS);
   added columns are kept in the rows under their own ids.

   observations: [{ date, area, observation, needed, offered, happened, auto }]
   — auto is the id of the assessment entry it was made from (syncObs).

   Import spreadsheet reads the Assessment Tracking workbook, or the Core
   Skills Observations workbook, in the browser (SheetJS) into these
   records, so the marks never sit in the site's code. */
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
    observations: { title: 'Observations', cols: [['subject', 'Subject', 110], ['date', 'Date', 110], ['area', 'Area', 170], ['observation', 'Observation', 320],
      ['needed', 'Support needed', 220], ['offered', 'Support offered', 220], ['happened', 'What happened?', 200]] },
    workbooks: { title: 'Subject workbooks', cols: [['subject', 'Subject', 150], ['grade', 'Grade', 70], ['link', 'Table of contents link', 380]] }
  };
  // observations.html shows only the observations; tracking.html the rest.
  var OBS = window.TK_VIEW === 'obs';
  var BASE = OBS ? ['observations'] : ['assessments', 'tables', 'spelling', 'workbooks'];
  // Sections only some Risers have.
  var ONLY = { spelling: ['elyon', 'gabby', 'eva'] };

  // Staff's own sections and columns, the same for every Riser (group
  // term-3, kid staff, week tracking-sections):
  //   { sections: [{ id, title, page: 'tracking' | 'obs', cols: [{ id, label, type }] }],
  //     extra: { <built-in section>: [{ id, label, type }] } }  type: 'text' | 'date'
  // A custom section's rows are kept in the Riser's record under custom[id].
  var DEFS_KEY = 'tracking-sections', DEFS = { sections: [], extra: {} };
  function order() {
    return BASE.filter(function (n) { return !ONLY[n] || ONLY[n].indexOf(kid.slug) !== -1; })
      .concat(DEFS.sections.filter(function (d) { return d.page === (OBS ? 'obs' : 'tracking'); }).map(function (d) { return d.id; }));
  }
  function defOf(name) { return DEFS.sections.filter(function (d) { return d.id === name; })[0] || null; }
  function listOf(name) {
    var d = defOf(name), extra = (DEFS.extra[name] || []).map(function (c) { return [c.id, c.label, 160, c.type, true]; });
    if (d) return { title: d.title, custom: true, cols: d.cols.map(function (c) { return [c.id, c.label, 160, c.type, true]; }) };
    return { title: LISTS[name].title, cols: LISTS[name].cols.concat(extra) };
  }
  function rowsOf(name) {
    if (!defOf(name)) return (rec[name] = rec[name] || []);
    rec.custom = rec.custom || {};
    return (rec.custom[name] = rec.custom[name] || []);
  }
  function saveDefs(change, done) {
    setStatus('Saving…');
    window.eot2Fetch('term-3', 'staff', DEFS_KEY).then(function (r) {
      var latest = (r && r.state) || { sections: [], extra: {} };
      latest.sections = latest.sections || []; latest.extra = latest.extra || {};
      change(latest);
      return window.eot2Save('term-3', 'staff', DEFS_KEY, latest).then(function (res) {
        setStatus(res.ok ? 'Saved' : 'Not saved — check the connection', res.ok ? 'is-ok' : 'is-bad');
        if (res.ok) { DEFS = latest; draw(); if (done) done(); }
      });
    });
  }
  // An observation filled in from an assessment entry: these come from it.
  var AUTO_COLS = ['subject', 'date', 'area', 'observation'];
  // Observations are grouped by subject: the Subject typed, or else worked
  // out from the subject or area.
  var SUBJ = [['Math', /math|times?\s*tables?|division|fraction|multipl|factor|decimal|integer|algebra|geometr|number|lcm|hcf/i],
    ['Language Arts', /spell|language|\bla\b|writing|grammar|reading|english|vocab/i],
    ['Science', /science|chem|physic|biolog/i], ['Tamil', /tamil/i]];
  function subjOf(o) {
    var t = String(o.subject || '').trim();
    var hit = SUBJ.filter(function (x) { return x[1].test(t || o.area || ''); })[0];
    return t && !hit ? t.charAt(0).toUpperCase() + t.slice(1) : hit ? hit[0] : 'Other';
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
  function blank() { return { workbooks: [], assessments: [], observations: [], tables: [], spelling: [] }; }
  function uid() { return Math.random().toString(36).slice(2, 10); }

  // Dates: kept as 2026-09-08; older ones were typed freely ("8 Sept",
  // "17/9.26"). Shown as day/month/year.
  var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  function isoOfText(t) {
    t = String(t || '').trim();
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(t);
    if (m) return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
    m = /^(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?$/.exec(t);
    if (m) { var y = m[3] ? (m[3].length === 2 ? '20' + m[3] : m[3]) : '2026'; return y + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2); }
    m = /^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\.?(?:\s+(\d{4}))?$/i.exec(t) || null;
    var mo = m ? MONTHS.indexOf(m[2].slice(0, 3).toLowerCase()) : -1;
    if (m && mo !== -1) return (m[3] || '2026') + '-' + ('0' + (mo + 1)).slice(-2) + '-' + ('0' + m[1]).slice(-2);
    m = /^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?$/i.exec(t);
    mo = m ? MONTHS.indexOf(m[1].slice(0, 3).toLowerCase()) : -1;
    if (m && mo !== -1) return '2026-' + ('0' + (mo + 1)).slice(-2) + '-' + ('0' + m[2]).slice(-2);
    return '';
  }
  function dmy(t) { var i = isoOfText(t); return i ? i.slice(8, 10) + '/' + i.slice(5, 7) + '/' + i.slice(0, 4) : String(t || ''); }

  // Every assessment entry with a score or feedback has an observation
  // (obs.auto = the entry's id) kept in step with it: date, area and what
  // happened. Every entry, imported ones too, except one whose observation
  // staff deleted (obsOff). Returns true if rows were added or gone.
  // Times-table tests written as assessments ("Times Table" subject) belong
  // in Times tables: move them, keeping date, tables, score and remarks.
  function moveTables(r) {
    var moved = false;
    r.tables = r.tables || [];
    for (var i = (r.assessments || []).length - 1; i >= 0; i--) {
      var a = r.assessments[i];
      if (!/^\s*times?\s*tables?\s*$/i.test(a.subject || '')) continue;
      var m = /^\s*([\d.]+)\s*\/\s*([\d.]+)\s*$/.exec(a.score || '');
      r.tables.push({ date: a.scheduled || a.requested || '', covered: a.section || '', correct: m ? m[1] : '', total: m ? m[2] : '',
        mins: '', remarks: [a.feedback, a.comments].filter(function (x) { return String(x || '').trim(); }).join(' ') + (!m && String(a.score || '').trim() ? ' (score: ' + a.score.trim() + ')' : '') });
      r.assessments.splice(i, 1);
      moved = true;
    }
    if (moved) r.tables.sort(function (x, y) { return (isoOfText(x.date) || x.date || '').localeCompare(isoOfText(y.date) || y.date || ''); });
    return moved;
  }

  function syncObs(r) {
    var obs = r.observations = r.observations || [], moved = false, live = {};
    (r.assessments || []).forEach(function (a) {
      if (!a.id) a.id = uid();
      if (a.obsOff || !(String(a.score || '').trim() || String(a.feedback || '').trim())) return;
      live[a.id] = 1;
      var o = obs.filter(function (x) { return x.auto === a.id; })[0];
      if (!o) { o = { auto: a.id }; obs.push(o); moved = true; }
      var p = pct(a.score);
      o.subject = subjOf({ subject: a.subject, area: a.section });
      o.date = a.scheduled || a.requested || '';
      o.area = [a.subject, a.section].filter(function (x) { return String(x || '').trim(); }).join(' — ') + ' (assessment)';
      o.observation = 'Assessment' + (String(a.score || '').trim() ? ': scored ' + a.score.trim() + (p !== '' ? ' (' + p + '%)' : '') + '.' : '.') +
        (String(a.feedback || '').trim() ? ' Areas for revision: ' + a.feedback.trim() + '.' : '') +
        (String(a.comments || '').trim() ? ' ' + a.comments.trim() : '');
    });
    // Times tables too.
    (r.tables || []).forEach(function (t) {
      if (!t.id) t.id = uid();
      var got = String(t.correct || '').trim() && String(t.total || '').trim();
      if (t.obsOff || !(got || String(t.remarks || '').trim())) return;
      live[t.id] = 1;
      var o = obs.filter(function (x) { return x.auto === t.id; })[0];
      if (!o) { o = { auto: t.id }; obs.push(o); moved = true; }
      var p = pct(t.correct, t.total);
      o.subject = 'Math';
      o.date = t.date || '';
      o.area = 'Times tables' + (String(t.covered || '').trim() ? ' — ' + t.covered.trim() : '');
      o.observation = 'Times tables' + (got ? ': ' + t.correct + '/' + t.total + ' correct' + (p !== '' ? ' (' + p + '%)' : '') + (parseFloat(t.mins) > 0 ? ' in ' + t.mins + ' min' : '') + '.' : '.') +
        (String(t.remarks || '').trim() ? ' ' + t.remarks.trim() : '');
    });
    for (var i = obs.length - 1; i >= 0; i--) if (obs[i].auto && !live[obs[i].auto]) { obs.splice(i, 1); moved = true; }
    return moved;
  }
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
  app.appendChild(el('header', 'hd-page-head pb-head', OBS
    ? '<div><p class="hd-eyebrow">Term 3 · Staff only</p><h1>Core Skills Observations</h1>' +
      '<p>Each Riser’s observations, the support needed and offered, and what happened. Assessment entries in Assessment Tracking add theirs here by themselves.</p></div>' +
      '<a class="tk-btn tk-link" href="tracking.html?kid=' + kid.slug + '">Assessment Tracking &rarr;</a>'
    : '<div><p class="hd-eyebrow">Term 3 · Staff only</p><h1>Assessment Tracking</h1>' +
      '<p>Each Riser’s assessments, times tables, spelling and workbooks. Type in any box to change it; it saves as you go.</p></div>' +
      '<a class="tk-btn tk-link" href="observations.html?kid=' + kid.slug + '">Observations &rarr;</a>'));
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
      b.addEventListener('click', function () { if (k.slug === kid.slug) return; kid = k; history.replaceState(null, '', '?kid=' + k.slug); var ln = app.querySelector('.tk-link'); if (ln) ln.href = ln.href.replace(/kid=\w+/, 'kid=' + k.slug); open(); });
      picker.appendChild(b);
    });
  }

  function open() {
    drawPicker();
    if (!open.defs) {
      open.defs = true;
      body.innerHTML = '<p class="tk-empty">Loading…</p>';
      window.eot2Fetch('term-3', 'staff', DEFS_KEY).then(function (r) {
        var s = (r && r.state) || {};
        DEFS = { sections: s.sections || [], extra: s.extra || {} };
        open();
      });
      return;
    }
    body.innerHTML = '<p class="tk-empty">Loading…</p>';
    window.eot2Fetch(kid.group, kid.slug, KEY).then(function (r) {
      rec = Object.assign(blank(), (r && r.state) || {});
      var before = JSON.stringify(rec);
      moveTables(rec);
      syncObs(rec);
      setStatus(r && r.state && r.state.u ? 'Saved' : '', 'is-ok');
      draw();
      if (JSON.stringify(rec) !== before && r && r.state) save();
    });
  }

  function save() {
    if (syncObs(rec)) drawSection('observations'); else paintAuto();
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
    order().forEach(function (name) { body.appendChild(section(name)); });
    // + Add a section, for every Riser.
    var f = el('form', 'tk-newsec', '<input type="text" maxlength="60" placeholder="New section, e.g. Reading log" aria-label="New section name"><button type="submit" class="tk-btn">+ Add a section</button>');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = f.querySelector('input').value.trim();
      if (!t) { f.querySelector('input').focus(); return; }
      var id = 'c-' + uid();
      saveDefs(function (d) { d.sections.push({ id: id, title: t, page: OBS ? 'obs' : 'tracking', cols: [{ id: 'date', label: 'Date', type: 'date' }, { id: 'c1', label: 'Notes', type: 'text' }] }); });
    });
    body.appendChild(f);
    body.appendChild(el('p', 'tk-note', 'Sections and columns you add show for every Riser; the rows are each Riser’s own.'));
  }
  function drawSection(name) {
    var old = body.querySelector('section[data-list="' + name + '"]');
    if (old) old.replaceWith(section(name));
  }
  // Auto observations show their text read only: bring it up to date.
  function paintAuto() {
    Array.prototype.forEach.call(body.querySelectorAll('[data-auto]'), function (x) {
      var o = (rec.observations || []).filter(function (r) { return r.auto === x.dataset.auto; })[0];
      if (o) x.textContent = x.dataset.col === 'date' ? dmy(o.date) : o[x.dataset.col] || '';
    });
  }
  function section(name) {
    {
      var L = listOf(name), rows = rowsOf(name);
      var sec = el('section', 'tk-sec', '<h2>' + esc(L.title) + (L.custom ? ' <button type="button" class="tk-mini tk-rename">Rename</button><button type="button" class="tk-mini tk-remove">Remove section</button>' : '') + '</h2>' + (name === 'observations' ? '<p class="tk-note">Grouped by subject. Assessment and times-table entries with a result add their observation here by themselves, and keep it up to date. Fill in the support and what happened.</p>' : ''));
      sec.dataset.list = name;
      // A table with its column heads (and ✕ on added columns).
      function makeTable() {
      var t = el('table', 'tk-table');
      t.innerHTML = '<thead><tr>' + L.cols.map(function (c) { return '<th>' + esc(c[1]) + (c[4] ? ' <button type="button" class="tk-colx" data-col="' + c[0] + '" aria-label="Remove the ' + esc(c[1]) + ' column">✕</button>' : '') + '</th>'; }).join('') + '<th></th></tr></thead>';
      // Remove a column staff added (for every Riser).
      Array.prototype.forEach.call(t.querySelectorAll('.tk-colx'), function (b) {
        b.addEventListener('click', function () {
          var col = L.cols.filter(function (c) { return c[0] === b.dataset.col; })[0];
          if (!confirm('Remove the “' + col[1] + '” column from ' + L.title + ' for every Riser?')) return;
          saveDefs(function (d) {
            var list = L.custom ? (d.sections.filter(function (x) { return x.id === name; })[0] || {}).cols : d.extra[name];
            if (!list) return;
            for (var k = list.length - 1; k >= 0; k--) if (list[k].id === b.dataset.col) list.splice(k, 1);
          });
        });
      });
      return t;
      }
      if (L.custom) {
        sec.querySelector('.tk-rename').addEventListener('click', function () {
          var t2 = prompt('New name for this section:', L.title);
          if (!t2 || !t2.trim()) return;
          saveDefs(function (d) { d.sections.forEach(function (x) { if (x.id === name) x.title = t2.trim(); }); });
        });
        sec.querySelector('.tk-remove').addEventListener('click', function () {
          if (!confirm('Remove the “' + L.title + '” section for every Riser? What’s been written in it is kept, but won’t show.')) return;
          saveDefs(function (d) { d.sections = d.sections.filter(function (x) { return x.id !== name; }); });
        });
      }
      function rowEl(row, i) {
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
          } else if (row.auto && AUTO_COLS.indexOf(c[0]) !== -1) {
            var ro = el('div', 'tk-ro');
            ro.dataset.auto = row.auto; ro.dataset.col = c[0];
            ro.style.minWidth = (c[2] || 90) + 'px';
            ro.textContent = c[0] === 'date' ? dmy(row.date) : row[c[0]] || '';
            td.appendChild(ro);
            if (c[0] === 'date') td.appendChild(el('span', 'tk-tag', 'From the tracker'));
          } else if (c[3] === 'date' || (!c[4] && (c[0] === 'date' || c[0] === 'requested' || c[0] === 'scheduled'))) {
            // Day/month/year, picked from a calendar.
            var pick = el('label', 'tk-date');
            var shown = el('span', '', row[c[0]] ? esc(dmy(row[c[0]])) : 'Pick a date');
            if (!row[c[0]]) shown.className = 'tk-date-none';
            var cal = el('input');
            cal.type = 'date';
            cal.value = isoOfText(row[c[0]]);
            cal.setAttribute('aria-label', c[1]);
            cal.addEventListener('change', function () {
              if (!cal.value) return;
              row[c[0]] = cal.value;
              (row._paint || []).forEach(function (f) { f(); });
              shown.textContent = dmy(cal.value);
              shown.className = '';
              save();
            });
            pick.appendChild(shown);
            pick.appendChild(cal);
            td.appendChild(pick);
          } else {
            // A box that grows to fit what's in it.
            var inp = el('textarea', 'tk-in');
            inp.rows = 1;
            inp.style.minWidth = (c[2] || 90) + 'px';
            inp.value = row[c[0]] || '';
            inp.setAttribute('aria-label', c[1]);
            if (name === 'observations' && c[0] === 'subject') inp.placeholder = subjOf(row);
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
          // Deleting an automatic observation: don't add it back.
          if (row.auto) (rec.assessments || []).concat(rec.tables || []).forEach(function (a) { if (a.id === row.auto) a.obsOff = true; });
          rows.splice(i, 1); save(); draw();
        });
        var td = el('td'); td.appendChild(del); tr.appendChild(td);
        return tr;
      }
      function tableOf(list) {
        var wrap = el('div', 'tk-wrap'), t = makeTable(), tb = el('tbody');
        list.forEach(function (i) { tb.appendChild(rowEl(rows[i], i)); });
        t.appendChild(tb);
        wrap.appendChild(t);
        return wrap;
      }
      var all = rows.map(function (r, i) { return i; });
      if (!rows.length) sec.appendChild(el('p', 'tk-empty', 'Nothing yet.'));
      else if (name !== 'observations') sec.appendChild(tableOf(all));
      else {
        // Observations: a table for each subject, oldest first.
        var groups = {};
        all.forEach(function (i) { var g = subjOf(rows[i]); (groups[g] = groups[g] || []).push(i); });
        var names = SUBJ.map(function (x) { return x[0]; }).filter(function (g) { return groups[g]; })
          .concat(Object.keys(groups).filter(function (g) { return g !== 'Other' && !SUBJ.some(function (x) { return x[0] === g; }); }).sort())
          .concat(groups.Other ? ['Other'] : []);
        names.forEach(function (g) {
          var list = groups[g].sort(function (x, y) { return (isoOfText(rows[x].date) || '9').localeCompare(isoOfText(rows[y].date) || '9'); });
          sec.appendChild(el('h3', 'tk-subj', esc(g) + ' <small>' + list.length + '</small>'));
          sec.appendChild(tableOf(list));
          var ga = el('button', 'tk-add', g === 'Other' ? '+ Add an observation' : '+ Add a ' + esc(g) + ' observation');
          ga.type = 'button';
          ga.addEventListener('click', function () {
            rows.push({ subject: g === 'Other' ? '' : g, date: new Date().toISOString().slice(0, 10) }); save(); draw();
          });
          sec.appendChild(ga);
        });
      }
      var add = el('button', 'tk-add', '+ Add a row');
      add.type = 'button';
      add.addEventListener('click', function () {
        var r = {};
        if (!L.custom && name !== 'workbooks') r[name === 'assessments' ? 'scheduled' : 'date'] = new Date().toISOString().slice(0, 10);
        if (L.custom && L.cols.some(function (c) { return c[3] === 'date'; })) r[L.cols.filter(function (c) { return c[3] === 'date'; })[0][0]] = new Date().toISOString().slice(0, 10);
        if (name === 'assessments') r.id = uid();
        rows.push(r); save(); draw();
        var ins = body.querySelector('section[data-list="' + name + '"]').querySelectorAll('tbody tr:last-child .tk-in');
        if (ins[0]) ins[0].focus();
      });
      if (name !== 'observations' || !rows.length) sec.appendChild(add);
      // + Add a column, for every Riser.
      var cf = el('form', 'tk-newcol', '<input type="text" maxlength="40" placeholder="New column" aria-label="New column name"><select aria-label="Column type"><option value="text">Text</option><option value="date">Date</option></select><button type="submit" class="tk-add">+ Add a column</button>');
      cf.addEventListener('submit', function (e) {
        e.preventDefault();
        var lab = cf.querySelector('input').value.trim(), type = cf.querySelector('select').value;
        if (!lab) { cf.querySelector('input').focus(); return; }
        var id = 'x-' + uid();
        saveDefs(function (d) {
          if (L.custom) d.sections.forEach(function (x) { if (x.id === name) x.cols.push({ id: id, label: lab, type: type }); });
          else (d.extra[name] = d.extra[name] || []).push({ id: id, label: lab, type: type });
        });
      });
      sec.appendChild(cf);
      return sec;
    }
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
      return f.arrayBuffer().then(function (buf) {
        var wb = XLSX.read(buf, { type: 'array', cellDates: true });
        var o = readObs(wb);
        return Object.keys(o).length ? { obs: true, data: o } : { obs: false, data: readBook(wb) };
      });
    }).then(function (got) {
      var data = got.data, slugs = Object.keys(data);
      if (!slugs.length) { setStatus('Couldn’t find any Risers in that file.', 'is-bad'); return; }
      if (got.obs) return importObs(data, slugs);
      return Promise.all(slugs.map(function (s) { var k = window.EOT2_findKid(s); return window.eot2Fetch(k.group, k.slug, KEY); })).then(function (rs) {
        var have = slugs.filter(function (s, i) { return rs[i] && rs[i].state && rs[i].state.u; });
        var msg = 'Import tracking for ' + slugs.length + ' Risers from this spreadsheet?' +
          (have.length ? '\n\nThis replaces what’s already saved here for: ' + have.map(function (s) { return window.EOT2_findKid(s).name; }).join(', ') + '.' : '');
        if (!confirm(msg)) { setStatus(''); return; }
        setStatus('Saving…');
        return Promise.all(slugs.map(function (s) {
          var k = window.EOT2_findKid(s);
          // Observations already here are kept; the assessments' own are made
          // when the Riser is next opened.
          data[s].assessments.forEach(function (a) { a.id = uid(); });
          moveTables(data[s]);
          var old = rs[slugs.indexOf(s)] && rs[slugs.indexOf(s)].state;
          return window.eot2Save(k.group, k.slug, KEY, Object.assign(blank(), data[s], { observations: (old && old.observations) || [], u: Date.now(), by: STAFF }));
        })).then(function (res) {
          var bad = res.filter(function (r) { return !r.ok; }).length;
          setStatus(bad ? bad + ' not saved — check the connection and import again.' : 'Imported ' + slugs.length + ' Risers.', bad ? 'is-bad' : 'is-ok');
          open();
        });
      });
    }).catch(function () { setStatus('Couldn’t read that file. Is it the Assessment Tracking spreadsheet (.xlsx)?', 'is-bad'); });
  });

  // Observations from the spreadsheet replace the ones typed for those
  // Risers; the ones made from assessment entries stay.
  function importObs(data, slugs) {
    var n = 0;
    slugs.forEach(function (s) { n += data[s].length; });
    if (!confirm('Import ' + n + ' observations for ' + slugs.length + ' Risers?\n\nThis replaces the observations already typed here for them. The ones made from assessment entries stay.')) { setStatus(''); return; }
    setStatus('Saving…');
    return Promise.all(slugs.map(function (s) {
      var k = window.EOT2_findKid(s);
      return window.eot2Fetch(k.group, k.slug, KEY).then(function (r) {
        var cur = Object.assign(blank(), (r && r.state) || {});
        cur.observations = data[s].concat(cur.observations.filter(function (o) { return o.auto; }));
        syncObs(cur);
        cur.u = Date.now(); cur.by = STAFF;
        return window.eot2Save(k.group, k.slug, KEY, cur);
      });
    })).then(function (res) {
      var bad = res.filter(function (r) { return !r.ok; }).length;
      setStatus(bad ? bad + ' not saved — check the connection and import again.' : 'Imported ' + n + ' observations for ' + slugs.length + ' Risers.', bad ? 'is-bad' : 'is-ok');
      open();
    });
  }

  // The observations workbook: side-by-side blocks headed by a Riser's
  // name (Date, Area, Observation, Support Needed, Support Offered), or
  // sheets with a Child column. Returns { slug: [observation…] }.
  function readObs(wb) {
    var X = window.XLSX, out = {};
    function d(v) {
      if (v instanceof Date) return v.getFullYear() + '-' + ('0' + (v.getMonth() + 1)).slice(-2) + '-' + ('0' + v.getDate()).slice(-2);
      return v == null ? '' : String(v).trim();
    }
    function slugOf(name) {
      var n = String(name || '').trim().toLowerCase();
      var k = KIDS.filter(function (x) { return x.name.toLowerCase() === n || (n.indexOf(x.name.toLowerCase()) === 0 && n.length > x.name.length); })[0];
      return k ? k.slug : '';
    }
    var key = function (h) {
      h = String(h || '').toLowerCase();
      return /^date/.test(h) ? 'date' : /^area/.test(h) ? 'area' : /observation/.test(h) ? 'observation' : /needed/.test(h) ? 'needed' : /offered/.test(h) ? 'offered' : /happen/.test(h) ? 'happened' : /^child/.test(h) ? 'child' : '';
    };
    wb.SheetNames.forEach(function (sn) {
      var rows = X.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: true, defval: null, blankrows: false });
      var hi = -1;
      rows.some(function (r, i) { if (r.some(function (v) { return key(v) === 'observation'; })) { hi = i; return true; } return false; });
      if (hi === -1) return;
      var head = rows[hi], cols = head.map(key);
      if (cols.indexOf('child') !== -1) {
        rows.slice(hi + 1).forEach(function (r) {
          var s = slugOf(r[cols.indexOf('child')]); if (!s) return;
          var o = {};
          cols.forEach(function (c, j) { if (c && c !== 'child') o[c] = d(r[j]); });
          if (o.observation || o.date) (out[s] = out[s] || []).push(o);
        });
        return;
      }
      // Blocks: each Date column starts one; the name is above it.
      cols.forEach(function (c, j) {
        if (c !== 'date') return;
        var s = '';
        for (var up = hi - 1; up >= 0 && !s; up--) s = slugOf(rows[up][j]);
        if (!s) return;
        rows.slice(hi + 1).forEach(function (r) {
          var o = {};
          for (var x = j; x < cols.length && (x === j || cols[x] !== 'date'); x++) if (cols[x]) o[cols[x]] = d(r[x]);
          if (o.observation || o.area) (out[s] = out[s] || []).push(o);
        });
      });
    });
    return out;
  }

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
