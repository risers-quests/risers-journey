/* Term 3 Assessments (papers in assessments-data.js).

   - Riser, no ?id: their papers and where each one is up to.
   - Riser, ?id=<paper>: answer, saving as they go; Submit sends it.
     Once staff return it marked: the marked paper (a tick or a circle on
     each question number, and on each part letter), My Results (right
     out of total for each section) and What I've Learnt, which they fill
     in and submit.
   - Staff, ?view=staff: every Riser's papers and status.
     ?view=staff&kid=<slug>&id=<paper>: mark it, with the answer key from
     the private staff site, and return it.

   Records (week keys): term3-asmt-<paper> is the Riser's
   { answers, _submitted, review, _reviewed }; term3-asmt-<paper>-marks is
   staff's { marks: { <item>: 'r'|'w' }, _returned, by }. Items are the
   question number, or number + part letter ('1a'). */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var PAPERS = window.T3_ASSESSMENTS || [];
  var ASSIGNED = window.T3_ASSIGNED || {};

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
  // {num/den} as a stacked fraction.
  function math(s) {
    return esc(s).replace(/\{([^{}\/]+)\/([^{}]+)\}/g, '<span class="as-fr"><span>$1</span><span>$2</span></span>');
  }
  function filled(v) { return v && String(v).trim(); }
  function day(iso) { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function paperById(id) { return PAPERS.filter(function (p) { return p.id === id; })[0] || null; }
  function keyOf(id) { return 'term3-asmt-' + id; }
  function marksKeyOf(id) { return 'term3-asmt-' + id + '-marks'; }
  var LETTERS = 'abcdefgh';

  function items(q) { return q.parts ? q.parts.map(function (p) { return q.n + p.l; }) : [String(q.n)]; }
  function allItems(paper) {
    var out = [];
    paper.sections.forEach(function (s) { s.qs.forEach(function (q) { out = out.concat(items(q)); }); });
    return out;
  }
  // Each question, and each lettered part of one, counts once: the score
  // is the number of ticks.
  function scores(paper, marks) {
    return paper.sections.map(function (s) {
      var its = [];
      s.qs.forEach(function (q) { its = its.concat(items(q)); });
      return {
        title: s.objective || s.title,
        right: its.filter(function (i) { return marks[i] === 'r'; }).length,
        of: its.length,
        marked: its.every(function (i) { return marks[i]; })
      };
    });
  }

  function status(ans, mk) {
    if (ans && ans._reviewed) return { id: 'done', label: 'Revision plan done' };
    if (mk && mk._returned) return { id: 'returned', label: 'Marked' };
    if (ans && ans._submitted) return { id: 'submitted', label: 'Submitted' };
    if (ans && ans.answers && Object.keys(ans.answers).some(function (k) { return filled(ans.answers[k]); })) return { id: 'started', label: 'Started' };
    return { id: 'new', label: 'Not started' };
  }

  /* ---------- the paper ---------- */

  // mode: 'answer' (Riser writing), 'read' (submitted, waiting),
  // 'marked' (Riser sees marks), 'mark' (staff marking).
  function paperEl(paper, ans, marks, mode, hooks) {
    var answers = ans.answers = ans.answers || {};
    var box = el('div', 'as-paper');
    paper.sections.forEach(function (s, si) {
      var sec = el('section', 'as-sec');
      sec.appendChild(el('h2', 'as-sec-title', 'Section ' + (si + 1) + ': ' + esc(s.title)));
      s.qs.forEach(function (q) {
        var qd = el('div', 'as-q');
        var whole = !q.parts;
        if (whole) qd.dataset.item = String(q.n);
        // A question with lettered parts is marked on its letters only.
        qd.appendChild(el('div', 'as-qhead', numHtml(q.n + '.', whole ? marks[String(q.n)] : '', mode) +
          '<p class="as-qtext">' + math(q.text) + '</p>'));
        if (q.parts) {
          q.parts.forEach(function (p) {
            var id = q.n + p.l;
            var row = el('div', 'as-part', '<div class="as-plabel">' + numHtml('(' + p.l + ')', marks[id], mode, true) + '<span>' + math(p.text) + '</span></div>');
            row.dataset.item = id;
            row.appendChild(answerEl(id, null, mode));
            if (mode === 'mark') row.appendChild(markEl(id));
            qd.appendChild(row);
          });
        } else {
          qd.appendChild(answerEl(String(q.n), q, mode));
          if (mode === 'mark') qd.appendChild(markEl(String(q.n)));
        }
        sec.appendChild(qd);
      });
      box.appendChild(sec);
    });
    return box;

    function answerEl(id, q, mode) {
      var wrap = el('div', 'as-ans');
      if (q && q.options) {
        var opts = el('div', 'as-opts');
        q.options.forEach(function (o, i) {
          var l = LETTERS[i];
          var b = el('button', 'as-opt' + (answers[id] === l ? ' is-on' : ''), '<b>(' + l + ')</b> ' + math(o));
          b.type = 'button';
          b.disabled = mode !== 'answer';
          b.addEventListener('click', function () {
            answers[id] = answers[id] === l ? '' : l;
            Array.prototype.forEach.call(opts.children, function (x, j) { x.classList.toggle('is-on', answers[id] === LETTERS[j]); });
            var holder = opts.closest('[data-item]');
            if (holder && answers[id]) holder.classList.remove('as-missing');
            hooks.change();
          });
          opts.appendChild(b);
        });
        wrap.appendChild(opts);
        if (mode !== 'answer' && !answers[id]) wrap.appendChild(el('p', 'as-blank', 'No answer'));
      } else if (mode === 'answer') {
        if (q && q.work) wrap.appendChild(inputBox(id + 'w', 3, 'Working (optional)'));
        wrap.appendChild(inputBox(id, 1, 'Answer'));
      } else {
        if (q && q.work && filled(answers[id + 'w'])) wrap.appendChild(el('p', 'as-written as-working', '<span>Working</span>' + esc(answers[id + 'w']).replace(/\n/g, '<br>')));
        wrap.appendChild(el('p', 'as-written' + (filled(answers[id]) ? '' : ' as-blank'), filled(answers[id]) ? esc(answers[id]).replace(/\n/g, '<br>') : 'No answer'));
      }
      if (mode === 'mark' && hooks.key && hooks.key[id]) wrap.appendChild(el('p', 'as-key', '<b>Key:</b> ' + esc(hooks.key[id])));
      return wrap;
    }

    function inputBox(id, rows, label) {
      var ta = el('textarea', 'as-input');
      ta.rows = rows;
      ta.placeholder = label;
      ta.setAttribute('aria-label', label);
      ta.value = answers[id] || '';
      ta.addEventListener('input', function () {
        answers[id] = ta.value;
        var holder = ta.closest('[data-item]');
        if (holder && filled(ta.value)) holder.classList.remove('as-missing');
        hooks.change();
      });
      return ta;
    }

    function markEl(id) {
      var m = el('div', 'as-markbtns');
      [['r', '✓ Right'], ['w', '◯ Wrong']].forEach(function (o) {
        var b = el('button', 'as-mbtn as-mbtn-' + o[0] + (marks[id] === o[0] ? ' is-on' : ''), o[1]);
        b.type = 'button';
        b.addEventListener('click', function () {
          if (marks[id] === o[0]) delete marks[id]; else marks[id] = o[0];
          hooks.change(id);
        });
        m.appendChild(b);
      });
      return m;
    }
  }
  // The number or letter, ticked or circled once marked.
  function numHtml(label, mark, mode, part) {
    var show = (mode === 'marked' || mode === 'mark') && mark;
    return '<span class="as-num' + (part ? ' as-num-part' : '') + (show ? ' as-' + mark : '') + '">' + label +
      (show && mark === 'r' ? '<i class="as-tick" aria-label="right">✓</i>' : '') +
      (show && mark === 'w' ? '<i class="as-ring" aria-label="wrong"></i>' : '') + '</span>';
  }

  function headerHtml(paper, kid, when) {
    return '<div class="as-head"><p class="as-band">' + esc(paper.grade) + ' &nbsp;•&nbsp; ' + esc(paper.subject) + ' &nbsp;•&nbsp; ' + esc(paper.title) + '</p>' +
      '<p class="as-cover">Covering: ' + esc(paper.covering) + '</p>' +
      '<div class="as-namedate"><span><b>Name:</b> ' + esc(kid.name) + '</span><span><b>Date:</b> ' + esc(when) + '</span></div></div>';
  }

  function resultsHtml(paper, marks) {
    var sc = scores(paper, marks);
    var total = sc.reduce(function (n, s) { return n + s.right; }, 0), of = sc.reduce(function (n, s) { return n + s.of; }, 0);
    return '<section class="as-results" id="results"><h2>My Results</h2><p class="as-sub">Scores by objective: ticks out of the total. Each lettered part counts as one.</p>' +
      '<table class="as-table"><thead><tr><th>#</th><th>Section / Objective</th><th>Score</th><th>Out of</th></tr></thead><tbody>' +
      sc.map(function (s, i) {
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(s.title) + '</td><td class="as-score' + (s.right === s.of ? ' is-full' : '') + '">' + (s.marked ? s.right : '–') + '</td><td>' + s.of + '</td></tr>';
      }).join('') +
      '</tbody><tfoot><tr><td></td><td>Total</td><td class="as-score">' + total + '</td><td>' + of + '</td></tr></tfoot></table></section>';
  }

  function reviewEl(paper, ans, readOnly, onChange) {
    var rv = ans.review = ans.review || {};
    var box = el('section', 'as-review', '<h2>What I’ve Learnt</h2><p class="as-sub">For each section, tick Learnt or Needs revision, and write how you plan to revise.</p>');
    paper.sections.forEach(function (s, i) {
      var r = rv[i] = rv[i] || {};
      var row = el('div', 'as-rrow', '<p class="as-rtitle">' + esc(s.objective || s.title) + '</p>');
      var tg = el('div', 'as-rtoggle');
      [['learnt', 'Learnt'], ['revise', 'Needs revision']].forEach(function (o) {
        var b = el('button', 'as-rbtn as-rbtn-' + o[0] + (r.v === o[0] ? ' is-on' : ''), (r.v === o[0] ? '☑ ' : '☐ ') + o[1]);
        b.type = 'button';
        b.disabled = readOnly;
        b.addEventListener('click', function () {
          r.v = r.v === o[0] ? '' : o[0];
          Array.prototype.forEach.call(tg.children, function (x, j) {
            var on = r.v === ['learnt', 'revise'][j];
            x.classList.toggle('is-on', on);
            x.textContent = (on ? '☑ ' : '☐ ') + ['Learnt', 'Needs revision'][j];
          });
          onChange();
        });
        tg.appendChild(b);
      });
      row.appendChild(tg);
      if (readOnly) {
        row.appendChild(el('p', 'as-written' + (filled(r.plan) ? '' : ' as-blank'), filled(r.plan) ? esc(r.plan) : 'No plan written'));
      } else {
        var ta = el('textarea', 'as-input');
        ta.rows = 2;
        ta.placeholder = 'How I plan to revise';
        ta.value = r.plan || '';
        ta.addEventListener('input', function () { r.plan = ta.value; onChange(); });
        row.appendChild(ta);
      }
      box.appendChild(row);
    });
    return box;
  }

  function saver(kid, key, state, setStatus) {
    var timer = null;
    return function (now) {
      setStatus('saving', 'Saving…');
      if (timer) clearTimeout(timer);
      return new Promise(function (resolve) {
        timer = setTimeout(function () {
          window.eot2Save(kid.group, kid.slug, key, state).then(function (r) {
            setStatus(r.ok ? 'saved' : 'offline', r.ok ? 'Saved' : 'Not synced');
            resolve(r.ok);
          });
        }, now ? 0 : 800);
      });
    };
  }
  function statusBox() {
    var s = el('div', 'eot2-status eot2-status-offline', 'Loading…');
    return { el: s, set: function (mode, t) { s.className = 'eot2-status eot2-status-' + mode; s.textContent = t; } };
  }

  /* ---------- Riser ---------- */

  function renderKidList(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../index.html">&larr; Term 3</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>Assessments</h1><p>Your assessments for Term 3.</p>'));
    var list = el('div', 'as-list', '<p class="as-sub">Loading…</p>');
    app.appendChild(list);
    var mine = (ASSIGNED[kid.slug] || []).map(paperById).filter(Boolean);
    Promise.all(mine.map(function (p) {
      return Promise.all([window.eot2Fetch(kid.group, kid.slug, keyOf(p.id)), window.eot2Fetch(kid.group, kid.slug, marksKeyOf(p.id))])
        .then(function (r) { return { paper: p, st: status(r[0] && r[0].state, r[1] && r[1].state) }; });
    })).then(function (rows) {
      list.innerHTML = '';
      rows.forEach(function (r) {
        var a = el('a', 'as-card as-st-' + r.st.id, '<span class="as-card-sub">' + esc(r.paper.subject) + '</span><strong>' + esc(r.paper.title) + '</strong>' +
          '<span class="as-card-cover">' + esc(r.paper.covering) + '</span><em>' + (r.st.id === 'returned' ? 'Marked — fill in What I’ve Learnt' : r.st.label) + '</em>');
        a.href = 'index.html?id=' + r.paper.id;
        list.appendChild(a);
      });
    });
  }

  function renderKidPaper(kid, paper) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="index.html">&larr; Assessments</a>'));
    var top = el('div', 'as-topbar');
    var st = statusBox();
    top.appendChild(st.el);
    app.appendChild(top);
    var body = el('div', 'as-body', '<p class="as-sub">Loading…</p>');
    app.appendChild(body);

    Promise.all([window.eot2Fetch(kid.group, kid.slug, keyOf(paper.id)), window.eot2Fetch(kid.group, kid.slug, marksKeyOf(paper.id))]).then(function (r) {
      var ans = (r[0] && r[0].state) || {};
      var mk = (r[1] && r[1].state) || {};
      var marks = mk._returned ? (mk.marks || {}) : {};
      var save = saver(kid, keyOf(paper.id), ans, st.set);
      st.set('saved', ans._submitted ? 'Submitted' : 'Saved');
      body.innerHTML = '';
      body.insertAdjacentHTML('beforeend', headerHtml(paper, kid, ans._submitted ? day(ans._submitted) : day(new Date().toISOString())));

      if (mk._returned) {
        var sc = scores(paper, marks);
        var total = sc.reduce(function (n, s) { return n + s.right; }, 0), of = sc.reduce(function (n, s) { return n + s.of; }, 0);
        body.appendChild(el('div', 'as-banner', '<strong>Your paper is marked: ' + total + ' out of ' + of + '.</strong> ' +
          '<span><i class="as-tick">✓</i> right &nbsp; <span class="as-num as-w as-legend">7<i class="as-ring"></i></span> needs another look</span>' +
          (ans._reviewed ? '' : '<a href="#review">Fill in What I’ve Learnt ↓</a>')));
        body.appendChild(paperEl(paper, ans, marks, 'marked'));
        body.insertAdjacentHTML('beforeend', resultsHtml(paper, marks));
        var rv = reviewEl(paper, ans, !!ans._reviewed, function () { save(); });
        rv.id = 'review';
        body.appendChild(rv);
        if (ans._reviewed) {
          body.appendChild(el('p', 'as-done', 'Sent ' + day(ans._reviewed) + '. Well done!'));
        } else {
          body.appendChild(submitBar('Send my revision plan', function () {
            ans._reviewed = new Date().toISOString();
            return save(true);
          }, function () { renderKidPaper(kid, paper); }));
        }
        return;
      }
      if (ans._submitted) {
        // Submitted but not marked yet (say the connection dropped): mark it now.
        body.appendChild(el('p', 'as-note', 'Marking your paper…'));
        markAndSave(kid, paper, ans).then(function () { renderKidPaper(kid, paper); });
        return;
      }
      body.appendChild(el('p', 'as-note', esc(paper.note) + ' Type fractions like 2/3 (always in simplest form), and mixed numbers like 4 1/6.'));
      body.appendChild(paperEl(paper, ans, {}, 'answer', { change: function () { save(); } }));
      body.appendChild(submitPanel(kid, paper, ans, save));
    });
  }

  function blanksOf(paper, ans) {
    return allItems(paper).filter(function (i) { return !filled((ans.answers || {})[i]); });
  }
  function label(id) { var m = /^(\d+)([a-z]?)$/.exec(id); return m[1] + (m[2] ? '(' + m[2] + ')' : ''); }
  function jumpTo(id) {
    var t = document.querySelector('[data-item="' + id + '"]');
    if (!t) return;
    t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var f = t.querySelector('textarea, button');
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 400);
  }

  // Marks the paper from the key, then saves the marks for staff and the
  // Riser. Resolves true once both are saved.
  function markAndSave(kid, paper, ans) {
    return window.T3_autoMark(paper, ans.answers || {}, items).then(function (marks) {
      var now = new Date().toISOString();
      return window.eot2Save(kid.group, kid.slug, marksKeyOf(paper.id), { marks: marks, auto: true, _returned: now, by: 'auto' })
        .then(function (r) { return r.ok; });
    }, function () { return false; });
  }

  // Submit: every answer box must be filled. If some aren't, list them,
  // highlight them and offer a way to each; a facilitator's PIN lets the
  // Riser submit anyway (blank answers are marked wrong).
  function submitPanel(kid, paper, ans, save) {
    var bar = el('div', 'as-submitbar');
    var alertBox = el('div', 'as-alert');
    alertBox.hidden = true;
    var b = el('button', 'eot2-btn', 'Submit');
    b.type = 'button';
    var msg = el('span', 'as-msg');
    bar.appendChild(alertBox);
    bar.appendChild(b);
    bar.appendChild(msg);

    function send(pass) {
      ans._submitted = new Date().toISOString();
      if (pass) ans._pass = { at: ans._submitted, blank: blanksOf(paper, ans) };
      b.disabled = true;
      msg.className = 'as-msg';
      msg.textContent = 'Sending and marking…';
      save(true).then(function (ok) {
        if (!ok) return false;
        return markAndSave(kid, paper, ans);
      }).then(function (ok) {
        if (ok) { renderKidPaper(kid, paper); window.scrollTo(0, 0); return; }
        delete ans._submitted; delete ans._pass;
        save(true);
        b.disabled = false;
        msg.textContent = 'Not sent — check the connection and try again.';
      });
    }

    b.addEventListener('click', function () {
      var blank = blanksOf(paper, ans);
      Array.prototype.forEach.call(document.querySelectorAll('.as-missing'), function (x) { x.classList.remove('as-missing'); });
      if (!blank.length) {
        alertBox.hidden = true;
        if (confirm('Submit your assessment? You can’t change it after this.')) send(false);
        return;
      }
      blank.forEach(function (id) { var t = document.querySelector('[data-item="' + id + '"]'); if (t) t.classList.add('as-missing'); });
      alertBox.hidden = false;
      alertBox.innerHTML = '<p><strong>' + (blank.length === 1 ? '1 question isn’t answered yet.' : blank.length + ' questions aren’t answered yet.') + '</strong> Please answer ' + (blank.length === 1 ? 'it' : 'every one') + ' before you submit.</p>';
      var list = el('div', 'as-alert-list');
      blank.forEach(function (id) {
        var go = el('button', 'as-jump', 'Q' + label(id));
        go.type = 'button';
        go.addEventListener('click', function () { jumpTo(id); });
        list.appendChild(go);
      });
      alertBox.appendChild(list);
      var first = el('button', 'eot2-btn as-first', 'Take me to the first one');
      first.type = 'button';
      first.addEventListener('click', function () { jumpTo(blank[0]); });
      alertBox.appendChild(first);

      var passBtn = el('button', 'as-passlink', 'I can’t answer some of these — ask my facilitator');
      passBtn.type = 'button';
      var pass = el('div', 'as-pass');
      pass.hidden = true;
      pass.innerHTML = '<p>Your facilitator can let you submit with these left blank. They will count as not right.</p>' +
        '<label>Facilitator PIN <input type="password" inputmode="numeric" autocomplete="off" maxlength="8"></label>';
      var ok = el('button', 'eot2-btn', 'Submit with facilitator pass');
      ok.type = 'button';
      var pmsg = el('span', 'as-msg');
      pass.appendChild(ok);
      pass.appendChild(pmsg);
      var pin = pass.querySelector('input');
      function tryPin() {
        sha16('lifehub-t3|pin|' + pin.value.trim()).then(function (h) {
          if (h !== window.T3_PASS) { pmsg.textContent = 'That PIN isn’t right.'; pin.select(); return; }
          pmsg.textContent = '';
          send(true);
        });
      }
      ok.addEventListener('click', tryPin);
      pin.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryPin(); });
      passBtn.addEventListener('click', function () { pass.hidden = false; passBtn.hidden = true; pin.focus(); });
      alertBox.appendChild(passBtn);
      alertBox.appendChild(pass);
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return bar;
  }

  function sha16(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, 16);
    });
  }

  function submitBar(label, go, done, undo) {
    var bar = el('div', 'as-submitbar');
    var b = el('button', 'eot2-btn', label);
    b.type = 'button';
    var msg = el('span', 'as-msg');
    b.addEventListener('click', function () {
      var p = go();
      if (!p) return;
      b.disabled = true;
      msg.textContent = 'Sending…';
      p.then(function (ok) {
        if (ok) return done();
        if (undo) undo();
        b.disabled = false;
        msg.textContent = 'Not sent — check the connection and try again.';
      });
    });
    bar.appendChild(b);
    bar.appendChild(msg);
    return bar;
  }

  /* ---------- staff ---------- */

  function renderStaffList() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/term-3/index.html">&larr; Term 3</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>Term 3 Assessments</h1><p>Papers are marked automatically from the answer key when a Riser submits. Open one to check the marks or change any of them.</p>'));
    var list = el('div', 'as-list', '<p class="as-sub">Loading…</p>');
    app.appendChild(list);
    var jobs = [];
    window.EOT2_KIDS.forEach(function (k) {
      (ASSIGNED[k.slug] || []).forEach(function (id) { var p = paperById(id); if (p) jobs.push({ kid: k, paper: p }); });
    });
    Promise.all(jobs.map(function (j) {
      return Promise.all([window.eot2Fetch(j.kid.group, j.kid.slug, keyOf(j.paper.id)), window.eot2Fetch(j.kid.group, j.kid.slug, marksKeyOf(j.paper.id))])
        .then(function (r) { j.st = status(r[0] && r[0].state, r[1] && r[1].state); return j; });
    })).then(function (rows) {
      list.innerHTML = rows.length ? '' : '<p class="as-sub">No assessments set yet.</p>';
      rows.forEach(function (j) {
        var a = el('a', 'as-card as-st-' + j.st.id, '<span class="as-card-sub">' + esc(j.kid.name) + '</span><strong>' + esc(j.paper.subject) + ' — ' + esc(j.paper.title) + '</strong>' +
          '<em>' + (j.st.id === 'submitted' ? 'Submitted — ready to mark' : j.st.label) + '</em>');
        a.href = 'index.html?view=staff&kid=' + j.kid.slug + '&id=' + j.paper.id;
        list.appendChild(a);
      });
    });
  }

  // Clears the Riser's answers, marks and revision plan so they can take
  // the paper again from a blank page.
  function resetEl(kid, paper) {
    var box = el('div', 'as-reset');
    var b = el('button', 'as-resetbtn', 'Start again for ' + esc(kid.name));
    b.type = 'button';
    var msg = el('span', 'as-msg');
    b.addEventListener('click', function () {
      if (!confirm('Clear ' + kid.name + '’s answers, marks and revision plan for this paper, so they start again from a blank paper? This can’t be undone.')) return;
      b.disabled = true;
      msg.textContent = 'Clearing…';
      Promise.all([
        window.eot2Save(kid.group, kid.slug, keyOf(paper.id), {}),
        window.eot2Save(kid.group, kid.slug, marksKeyOf(paper.id), {})
      ]).then(function (r) {
        if (r[0].ok && r[1].ok) { renderStaffMark(kid, paper); return; }
        b.disabled = false;
        msg.textContent = 'Not cleared — check the connection and try again.';
      });
    });
    box.appendChild(b);
    box.appendChild(msg);
    return box;
  }

  function loadKey(paper) {
    return new Promise(function (resolve) {
      var base = window.LH_STAFF_SITE;
      if (!base) return resolve(null);
      var s = document.createElement('script');
      s.src = base.replace(/\/?$/, '/') + 'answer-keys/term-3/' + paper.id + '.js';
      s.onload = function () { resolve((window.T3_KEYS || {})[paper.id] || null); };
      s.onerror = function () { resolve(null); };
      document.head.appendChild(s);
    });
  }

  function renderStaffMark(kid, paper) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="index.html?view=staff">&larr; Term 3 Assessments</a>'));
    var top = el('div', 'as-topbar');
    top.appendChild(el('h1', 'as-h1', esc(kid.name) + ' &mdash; ' + esc(paper.subject)));
    var st = statusBox();
    top.appendChild(st.el);
    app.appendChild(top);
    var body = el('div', 'as-body', '<p class="as-sub">Loading…</p>');
    app.appendChild(body);
    var staff = null;
    try { staff = localStorage.getItem('rj-staff-name'); } catch (e) {}

    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, keyOf(paper.id)),
      window.eot2Fetch(kid.group, kid.slug, marksKeyOf(paper.id)),
      loadKey(paper)
    ]).then(function (r) {
      var ans = (r[0] && r[0].state) || {};
      var mk = (r[1] && r[1].state) || {};
      mk.marks = mk.marks || {};
      var key = r[2];
      st.set('saved', mk._returned ? 'Returned' : 'Saved');
      body.innerHTML = '';
      var started = ans._submitted || (ans.answers && Object.keys(ans.answers).length) || mk._returned;
      if (started) body.appendChild(resetEl(kid, paper));
      if (!ans._submitted) {
        body.appendChild(el('p', 'as-wait', kid.name + ' hasn’t submitted this yet. It can be marked once it’s submitted.'));
        return;
      }
      body.insertAdjacentHTML('beforeend', headerHtml(paper, kid, day(ans._submitted)));
      if (mk.auto) body.appendChild(el('p', 'as-note', 'Marked automatically from the answer key' + (mk.by && mk.by !== 'auto' ? ', then checked by ' + esc(mk.by.charAt(0).toUpperCase() + mk.by.slice(1)) : '') + '. Change any mark below, then send the updated marks.'));
      if (ans._pass) body.appendChild(el('p', 'as-note as-note-pass', 'Submitted with a facilitator pass. Left blank: ' + ans._pass.blank.map(label).map(function (x) { return 'Q' + x; }).join(', ') + '.'));
      var save = saver(kid, marksKeyOf(paper.id), mk, function (m, t) { st.set(m, m === 'saved' && mk._returned ? 'Returned · saved' : t); });
      var tally = el('div', 'as-tally');
      body.appendChild(tally);
      if (!key) body.appendChild(el('p', 'as-note', 'The answer key couldn’t be loaded from the staff site, so mark from the paper key.'));
      var paperBox = el('div');
      body.appendChild(paperBox);
      var results = el('div');
      body.appendChild(results);
      var bar = el('div', 'as-submitbar');
      body.appendChild(bar);

      function draw() {
        paperBox.innerHTML = '';
        paperBox.appendChild(paperEl(paper, ans, mk.marks, 'mark', { key: key, change: function () { save(); drawKeep(); } }));
      }
      // Redraw without losing the scroll position.
      function drawKeep() { var y = window.scrollY; draw(); refresh(); window.scrollTo(0, y); }
      function refresh(note) {
        var all = allItems(paper), done = all.filter(function (i) { return mk.marks[i]; }).length;
        var sc = scores(paper, mk.marks);
        tally.innerHTML = '<b>Marked ' + done + ' of ' + all.length + '</b> &middot; ' +
          sc.reduce(function (n, s) { return n + s.right; }, 0) + ' of ' + sc.reduce(function (n, s) { return n + s.of; }, 0) + ' right so far' +
          (mk._returned ? ' &middot; returned ' + day(mk._returned) : '');
        results.innerHTML = resultsHtml(paper, mk.marks);
        bar.innerHTML = '';
        var b = el('button', 'eot2-btn', mk._returned ? 'Send the updated marks' : 'Return to ' + esc(kid.name));
        b.type = 'button';
        var msg = el('span', 'as-msg');
        b.addEventListener('click', function () {
          var left = all.length - done;
          if (left && !confirm(left + ' answer' + (left > 1 ? 's are' : ' is') + ' not marked yet. Return it anyway?')) return;
          mk._returned = new Date().toISOString();
          mk.by = staff;
          b.disabled = true;
          save(true).then(function (ok) {
            if (!ok) { b.disabled = false; msg.textContent = 'Not sent — check the connection and try again.'; return; }
            refresh('Sent to ' + kid.name + '.');
          });
        });
        if (note) { msg.textContent = note; msg.classList.add('is-ok'); }
        bar.appendChild(b);
        bar.appendChild(msg);
        // What I've Learnt is the Riser's to fill in; staff only read it.
        bar.appendChild(el('div', 'as-wait', ans._reviewed
          ? 'What I’ve Learnt, filled in by ' + esc(kid.name) + ' on ' + day(ans._reviewed) + ' (read only):'
          : esc(kid.name) + ' hasn’t filled in What I’ve Learnt yet. It shows here, read only, once they send it.'));
        if (ans._reviewed) bar.appendChild(reviewEl(paper, ans, true));
      }
      draw();
      refresh();
    });
  }

  /* ---------- start ---------- */

  var paper = params.get('id') && paperById(params.get('id'));
  if (params.get('view') === 'staff') {
    var staffName = null;
    try { staffName = localStorage.getItem('rj-staff-name'); } catch (e) {}
    if (!staffName) { location.replace('../../index.html'); return; }
    var k = params.get('kid') && window.EOT2_findKid(params.get('kid'));
    if (k && paper) renderStaffMark(k, paper); else renderStaffList();
    return;
  }
  var kid = window.EOT2_signedInKid();
  if (!kid) { window.EOT2_leaveWithoutKid('index.html?view=staff', '../../index.html'); return; }
  var mine = ASSIGNED[kid.slug] || [];
  if (!mine.length) { location.replace('../index.html'); return; }
  if (paper && mine.indexOf(paper.id) !== -1) renderKidPaper(kid, paper); else renderKidList(kid);
})();
