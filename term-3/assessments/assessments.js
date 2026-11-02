/* Term 3 Assessments (papers in assessments-data.js, and papers staff
   upload as a PDF: upload.js, kept as in assessments-store.js).

   - Riser, no ?id: their papers and where each one is up to.
   - Riser, ?id=<paper>: answer, saving as they go; Submit sends it, and
     it's marked automatically from the key for staff to check. Once
     staff return it: the marked paper (a tick or a circle on
     each question number, and on each part letter), My Results (right
     out of total for each section) and What I've Learnt, which they fill
     in and submit. After that, Print questions to rework prints only the
     ones marked wrong, with room to work each again (also on the staff
     page for that paper).
   - Staff, ?view=staff: every Riser's papers and status.
     ?view=staff&kid=<slug>&id=<paper>: check the marks, with the answer
     key (from the private staff site, or locked in an uploaded paper),
     and return it. ?view=upload: set a new paper from a PDF.

   Records (week keys): term3-asmt-<paper> is the Riser's
   { answers, _submitted, review, _reviewed }; term3-asmt-<paper>-marks is
   { marks: { <item>: 'r'|'w' }, auto, _returned, by }: the automatic
   marks (by 'auto'), then staff's. Items are the
   question number, or number + part letter ('1a'). */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var PAPERS = window.T3_ASSESSMENTS || [];
  var ASSIGNED = window.T3_ASSIGNED || {};
  var UPLOADED = {}; // the uploaded papers' list, loaded at the start

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
  // A paper's details for lists: its own, or its entry in the uploaded list.
  function infoById(id) {
    var it = UPLOADED[id];
    if (it && (it.deleted || it.off)) return null;
    return paperById(id) || (it ? Object.assign({ id: id }, it) : null);
  }
  function getPaper(id) { return paperById(id) ? Promise.resolve(paperById(id)) : infoById(id) ? window.T3_store.fetchPaper(id).then(splitLetters) : Promise.resolve(null); }
  function allIds() {
    var ids = PAPERS.map(function (p) { return p.id; });
    Object.keys(UPLOADED).forEach(function (id) { if (ids.indexOf(id) === -1) ids.push(id); });
    return ids.filter(infoById);
  }
  function kidsOf(id) { return window.T3_store.kidsOf(UPLOADED, id); }
  function papersFor(slug) {
    return allIds().filter(function (id) { return kidsOf(id).indexOf(slug) !== -1; }).map(infoById);
  }
  function keyOf(id) { return 'term3-asmt-' + id; }
  function marksKeyOf(id) { return 'term3-asmt-' + id + '-marks'; }
  var LETTERS = 'abcdefgh';

  // What is marked: each part, each letter of a question split by
  // splitLetters, or the question.
  function items(q) {
    return expand(q.parts ? q.parts.map(function (p) { return q.n + p.l; })
      : q.markLetters ? q.markLetters.map(function (l) { return q.n + l; }) : [String(q.n)]);
  }
  // Staff can mark any item in several marks (a table's rows, a part's two
  // blanks): SPLIT[item] = n, kept in the marks record as split. Its marks
  // are item_1 … item_n.
  var SPLIT = {};
  function expand(ids) {
    var out = [];
    ids.forEach(function (id) {
      var n = SPLIT[id] || 1;
      if (n < 2) out.push(id); else for (var k = 1; k <= n; k++) out.push(id + '_' + k);
    });
    return out;
  }
  // An item's overall mark: its own, or, when split, right only if every
  // mark is right.
  function markOf(marks, id) {
    var n = SPLIT[id] || 1;
    if (n < 2) return marks[id];
    var all = [];
    for (var k = 1; k <= n; k++) all.push(marks[id + '_' + k]);
    return all.some(function (x) { return x === 'w'; }) ? 'w' : all.every(function (x) { return x === 'r'; }) ? 'r' : '';
  }
  // What is answered: a split question keeps one answer.
  function answerItems(q) { return q.parts ? q.parts.map(function (p) { return q.n + p.l; }) : [String(q.n)]; }
  // An uploaded question read as choices that is really lettered parts
  // (blanks, or written parts) or several sets of choices is marked a
  // letter at a time: q.markLetters, and q.markLabels for the sets.
  function splitLetters(paper) {
    if (!paper || !paper.uploaded || !paper.html) return paper;
    paper.sections.forEach(function (s) {
      s.qs.forEach(function (q) {
        var h = String(paper.html[q.n] || '');
        if (!h) return;
        var ap = assertParts(h);
        if (ap.length) { q.assertLetters = ap; q.markLetters = ap; return; }
        if (!q.options) return;
        if (writtenParts(h)) { q.markLetters = q.options.map(function (o, i) { return LETTERS[i]; }); return; }
        var g = choiceGroups(h);
        if (g.length >= 2) { q.markLetters = g.map(function (x, i) { return LETTERS[i]; }); q.markLabels = g.map(function (x) { return x.label; }); }
      });
    });
    return paper;
  }
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
    if (ans && ans._submitted) return { id: 'submitted', label: 'Submitted', auto: !!(mk && mk.auto) };
    if (ans && ans.answers && Object.keys(ans.answers).some(function (k) { return filled(ans.answers[k]); })) return { id: 'started', label: 'Started' };
    return { id: 'new', label: 'Not started' };
  }

  /* ---------- the paper ---------- */

  // mode: 'answer' (Riser writing), 'read' (submitted, waiting),
  // 'marked' (Riser sees marks), 'mark' (staff marking).
  function paperEl(paper, ans, marks, mode, hooks) {
    var answers = ans.answers = ans.answers || {};
    var box = el('div', 'as-paper');
    // An uploaded paper: each page's picture, then the answer boxes for
    // the questions on it.
    var pages = paper.uploaded ? (paper.pages || []).slice() : [];
    function pagesTo(n, sec) {
      while (pages.length && pages[0] <= n) {
        var holder = el('div', 'as-page');
        holder.appendChild(pageImg(paper, pages.shift()));
        (sec || box).appendChild(holder);
      }
    }
    paper.sections.forEach(function (s, si) {
      var sec = el('section', 'as-sec');
      if (paper.uploaded && s.qs[0]) pagesTo(s.qs[0].page - 1);
      sec.appendChild(el('h2', 'as-sec-title', 'Section ' + (si + 1) + ': ' + esc(s.title)));
      s.qs.forEach(function (q) {
        if (paper.uploaded) pagesTo(q.page, sec);
        var qd = el('div', 'as-q');
        var whole = !q.parts && !q.markLetters;
        if (!q.parts) qd.dataset.item = String(q.n);
        // A question with lettered parts is marked on its letters only.
        qd.appendChild(el('div', 'as-qhead', numHtml(q.n + '.', whole ? markOf(marks, String(q.n)) : '', mode) +
          (q.text ? '<p class="as-qtext">' + math(q.text) + '</p>'
            : paper.html && paper.html[q.n] ? '<div class="as-qtext as-qhtml">' + paper.html[q.n] + '</div>'
            : '<p class="as-qtext"><span class="as-qref">Question ' + q.n + '</span></p>')));
        if (q.parts) {
          q.parts.forEach(function (p) {
            var id = q.n + p.l;
            var row = el('div', 'as-part', '<div class="as-plabel">' + numHtml('(' + p.l + ')', markOf(marks, id), mode, true) + '<span>' + math(p.text || '') + '</span></div>');
            row.dataset.item = id;
            row.appendChild(answerEl(id, null, mode));
            if (mode === 'mark') row.appendChild(markBox(id));
            qd.appendChild(row);
          });
        } else {
          qd.appendChild(answerEl(String(q.n), q, mode));
          if (mode === 'mark' && !q.markLetters) qd.appendChild(markBox(String(q.n)));
        }
        sec.appendChild(qd);
      });
      box.appendChild(sec);
    });
    pagesTo(Infinity);
    return box;

    function answerEl(id, q, mode) {
      var wrap = el('div', 'as-ans');
      var qh = q && paper.uploaded && paper.html ? String(paper.html[q.n] || '') : '';
      // An uploaded paper reads lettered blanks ("(a) … ____") as choices:
      // give each letter its own box. Saved as "(a) …" lines in one answer,
      // which staff mark by hand.
      // Assertion–Reason with parts: a number box for each part.
      if (q && q.assertLetters) {
        var codes = codesOf(answers[id], q.assertLetters);
        q.assertLetters.forEach(function (l) {
          var row = el('div', 'as-pmark');
          row.dataset.item = q.n + l;
          if (mode === 'answer') {
            row.innerHTML = '<b>Part (' + l + ')</b>';
            var inp = el('input', 'as-input as-numans');
            inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 1; inp.autocomplete = 'off';
            inp.placeholder = 'Type the number (1, 2, 3, 4)';
            inp.value = codes[l] || '';
            inp.addEventListener('input', function () {
              codes[l] = inp.value.trim();
              answers[id] = q.assertLetters.map(function (x) { return codes[x] ? '(' + x + ') ' + codes[x] : ''; }).filter(Boolean).join('\n');
              hooks.change();
            });
            row.appendChild(inp);
          } else {
            row.innerHTML = numHtml('Part (' + l + ')', markOf(marks, q.n + l), mode, true) + '<p class="as-written' + (codes[l] ? '' : ' as-blank') + '">' + (codes[l] ? esc(codes[l]) : 'No answer') + '</p>';
            if (mode === 'mark') row.appendChild(markBox(q.n + l));
          }
          wrap.appendChild(row);
        });
        if (mode === 'mark') wrap.appendChild(keyLine(q));
        return wrap;
      }
      if (q && q.options && writtenParts(qh)) {
        var got = {};
        String(answers[id] || '').split('\n').forEach(function (line) { var m = /^\(([a-h])\)\s*(.*)$/.exec(line.trim()); if (m) got[m[1]] = m[2]; });
        if (mode === 'answer') {
          var boxes = el('div', 'as-blanks');
          var write = function () {
            answers[id] = q.options.map(function (o, i) { var v = boxes.querySelectorAll('input')[i].value.trim(); return v ? '(' + LETTERS[i] + ') ' + v : ''; }).filter(Boolean).join('\n');
            var holder = boxes.closest('[data-item]');
            if (holder && filled(answers[id])) holder.classList.remove('as-missing');
            hooks.change();
          };
          q.options.forEach(function (o, i) {
            var row = el('label', 'as-blank-row', '<b>(' + LETTERS[i] + ')</b><input type="text" class="as-input" autocomplete="off">');
            var inp = row.querySelector('input');
            inp.value = got[LETTERS[i]] || '';
            inp.setAttribute('aria-label', 'Blank (' + LETTERS[i] + ')');
            inp.addEventListener('input', write);
            boxes.appendChild(row);
          });
          wrap.appendChild(boxes);
        } else {
          q.options.forEach(function (o, i) {
            var l = LETTERS[i], row = el('div', 'as-pmark');
            row.dataset.item = q.n + l;
            row.innerHTML = numHtml('(' + l + ')', markOf(marks, q.n + l), mode, true) + '<p class="as-written' + (filled(got[l]) ? '' : ' as-blank') + '">' + (filled(got[l]) ? esc(got[l]) : 'No answer') + '</p>';
            if (mode === 'mark') row.appendChild(markBox(q.n + l));
            wrap.appendChild(row);
          });
          if (mode === 'mark') wrap.appendChild(keyLine(q));
        }
        return wrap;
      }
      // Two or more sets of choices in one question (each from (a) again):
      // a row of buttons for each set. Saved as "(i) b" lines, for staff.
      var groups = q && q.options ? choiceGroups(qh) : [];
      if (groups.length >= 2) {
        var picked = {};
        String(answers[id] || '').split('\n').forEach(function (line) { var m = /^\((\w+)\)\s*([a-h])$/.exec(line.trim()); if (m) picked[m[1]] = m[2]; });
        groups.forEach(function (g, gi) {
          var row = el('div', 'as-mset', '<span class="as-mset-l">' + (mode === 'answer' ? 'Part (' + esc(g.label) + ')' : numHtml('Part (' + esc(g.label) + ')', markOf(marks, q.n + LETTERS[gi]), mode, true)) + '</span>');
          row.dataset.item = q.n + LETTERS[gi];
          var opts2 = el('div', 'as-opts');
          for (var i = 0; i < g.n; i++) (function (l) {
            var bt = el('button', 'as-opt' + (picked[g.label] === l ? ' is-on' : ''), '<b>(' + l + ')</b>');
            bt.type = 'button';
            bt.disabled = mode !== 'answer';
            bt.addEventListener('click', function () {
              picked[g.label] = picked[g.label] === l ? '' : l;
              Array.prototype.forEach.call(opts2.children, function (x, j) { x.classList.toggle('is-on', picked[g.label] === LETTERS[j]); });
              answers[id] = groups.map(function (x) { return picked[x.label] ? '(' + x.label + ') ' + picked[x.label] : ''; }).filter(Boolean).join('\n');
              var holder = opts2.closest('[data-item]');
              if (holder && answers[id]) holder.classList.remove('as-missing');
              hooks.change();
            });
            opts2.appendChild(bt);
          })(LETTERS[i]);
          row.appendChild(opts2);
          if (mode === 'mark') row.appendChild(markBox(q.n + LETTERS[gi]));
          wrap.appendChild(row);
        });
        if (mode !== 'answer' && !answers[id]) wrap.appendChild(el('p', 'as-blank', 'No answer'));
        if (mode === 'mark') wrap.appendChild(keyLine(q));
        return wrap;
      }
      // Numbered options, "(1) … (4)" (like Assertion and Reason): a small
      // box to type the number.
      var nums = q && !q.options && !q.parts && qh ? (qh.match(/\((\d)\)/g) || []).map(function (x) { return x.charAt(1); }) : [];
      nums = nums.filter(function (x, i) { return nums.indexOf(x) === i; });
      if (nums.length >= 2 && nums[0] === '1' && mode === 'answer') {
        var nin = el('input', 'as-input as-numans');
        nin.type = 'text';
        nin.inputMode = 'numeric';
        nin.autocomplete = 'off';
        nin.maxLength = 2;
        nin.placeholder = 'Type the number (' + nums.join(', ') + ')';
        nin.setAttribute('aria-label', 'Type the number');
        nin.value = answers[id] || '';
        nin.addEventListener('input', function () {
          answers[id] = nin.value.trim();
          var holder = nin.closest('[data-item]');
          if (holder && answers[id]) holder.classList.remove('as-missing');
          hooks.change();
        });
        wrap.appendChild(nin);
        return wrap;
      }
      if (q && q.options) {
        var opts = el('div', 'as-opts');
        q.options.forEach(function (o, i) {
          var l = LETTERS[i];
          var b = el('button', 'as-opt' + (answers[id] === l ? ' is-on' : ''), '<b>(' + l + ')</b> ' + math(o || ''));
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
        var typed = filled(answers[id]) && !/^[a-h]$/.test(answers[id]);
        if (typed && mode !== 'answer') wrap.appendChild(el('p', 'as-written', esc(answers[id]).replace(/\n/g, '<br>')));
        if (mode !== 'answer' && !answers[id]) wrap.appendChild(el('p', 'as-blank', 'No answer'));
      } else if (mode === 'answer') {
        if (q && q.work) wrap.appendChild(inputBox(id + 'w', 3, 'Working (optional)'));
        wrap.appendChild(inputBox(id, 1, 'Answer'));
      } else {
        if (q && q.work && filled(answers[id + 'w'])) wrap.appendChild(el('p', 'as-written as-working', '<span>Working</span>' + esc(answers[id + 'w']).replace(/\n/g, '<br>')));
        wrap.appendChild(el('p', 'as-written' + (filled(answers[id]) ? '' : ' as-blank'), filled(answers[id]) ? esc(answers[id]).replace(/\n/g, '<br>') : 'No answer'));
      }
      if (mode === 'mark' && paper.kinds && paper.kinds[id] === 'staff') wrap.appendChild(el('p', 'as-key as-key-staff', 'Not marked automatically: mark this one yourself.'));
      if (mode === 'mark' && hooks.key && hooks.key[id]) wrap.appendChild(el('p', 'as-key', '<b>Key:</b> ' + esc(hooks.key[id])));
      return wrap;
    }

    // A split question's key: the question's own key line (or its letters'),
    // or, while the key is locked, a reminder.
    function keyLine(q) {
      var k = hooks.key || null;
      var t = k && (k[String(q.n)] || items(q).map(function (i) { return k[i] ? '(' + i.slice(String(q.n).length) + ') ' + k[i] : ''; }).filter(Boolean).join('  '));
      return el('p', 'as-key', t ? '<b>Key:</b> ' + esc(t) : k ? '<b>Key:</b> not in the answer key — mark this one yourself.' : '<b>Key:</b> enter the facilitator PIN above to see it.');
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

    // Right / Wrong for an item, or one row of them for each of its marks,
    // and how many marks it is worth.
    function markBox(id) {
      var n = SPLIT[id] || 1, box = el('div', 'as-mbox');
      if (n < 2) box.appendChild(markEl(id));
      else for (var k = 1; k <= n; k++) {
        var r = el('div', 'as-msplit', '<span>Mark ' + k + '</span>');
        r.appendChild(markEl(id + '_' + k));
        box.appendChild(r);
      }
      if (hooks.setSplit) {
        var sel = el('select', 'as-splitsel');
        sel.setAttribute('aria-label', 'How many marks');
        for (var m = 1; m <= 8; m++) sel.innerHTML += '<option value="' + m + '"' + (m === n ? ' selected' : '') + '>' + m + (m > 1 ? ' marks' : ' mark') + '</option>';
        sel.addEventListener('change', function () { hooks.setSplit(id, +sel.value); });
        box.appendChild(sel);
      }
      return box;
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
  // Assertion–Reason in lettered parts: "(a) Assertion … (b) Assertion …"
  // with codes (1) … (4). Returns the part letters, or [].
  function assertParts(qh) {
    if (!qh) return [];
    var text = qh.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
    if (!/\(1\)/.test(text) || !/\(2\)/.test(text)) return [];
    var out = [], re = /\(([a-h])\)\s*Assertion/gi, m;
    while ((m = re.exec(text))) if (out.indexOf(m[1].toLowerCase()) === -1) out.push(m[1].toLowerCase());
    return out.length >= 2 ? out : [];
  }
  // Each part's code from the saved answer: "(a) 2" lines, or else the
  // numbers 1–4 in the order written ("2 3", "2, 3").
  function codesOf(a, letters) {
    var got = {}, t = String(a || '');
    t.split('\n').forEach(function (line) { var m = /^\(([a-h])\)\s*([1-4])\b/.exec(line.trim()); if (m) got[m[1]] = m[2]; });
    if (!Object.keys(got).length) {
      var ds = t.match(/(^|[^\d(])([1-4])(?![\d)])/g) || [];
      ds.map(function (x) { return x.replace(/\D/g, ''); }).forEach(function (d, i) { if (letters[i]) got[letters[i]] = d; });
    }
    return got;
  }

  // Is an uploaded question that was read as multiple choice really
  // lettered parts to write? Yes if it has blanks (____), or if each
  // lettered item starts its own line and it doesn't ask to circle,
  // choose or tick one.
  function writtenParts(qh) {
    if (!qh) return false;
    var text = qh.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|tr)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
    if (/\b(circle|choose|tick|select|correct (option|answer)|which (one|of))\b/i.test(text)) return false;
    if (/_{3,}/.test(qh)) return true;
    var lines = text.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    var lettered = lines.filter(function (l) { return /^\([a-h]\)/i.test(l); });
    return lettered.length >= 2 && lettered.every(function (l) { return (l.match(/\([a-h]\)/gi) || []).length === 1; });
  }

  // Sets of choices in one question, read from the order of the letters
  // (so the paper's layout doesn't matter): a run (a) (b) (c) … is a set
  // of choices; a letter followed straight away by "(a)" names the next
  // set ("(a) By volume … (a) 1:8 (b) 2:1 …" is Part (a)); otherwise a
  // set is named by an (i), (ii) … before it, or 1, 2 ….
  function choiceGroups(qh) {
    if (!qh || writtenParts(qh)) return [];
    var text = qh.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
    var marks = [], re = /\(([a-h])\)/gi, m;
    while ((m = re.exec(text))) marks.push({ l: m[1].toLowerCase(), at: m.index });
    var sets = [], i = 0, name = '', from = 0;
    while (i < marks.length) {
      if (marks[i].l === 'a' || (i + 1 < marks.length && marks[i + 1].l === 'a')) {
        // A name for the next set: a letter right before an "(a)".
        if (i + 1 < marks.length && marks[i + 1].l === 'a' && (marks[i].l !== 'a' || (i + 2 < marks.length && marks[i + 2].l === 'b'))) {
          name = marks[i].l; from = marks[i].at; i++; continue;
        }
        var n = 1, j = i + 1;
        while (j < marks.length && marks[j].l === LETTERS[n]) { n++; j++; }
        if (!name) { var rom = text.slice(from, marks[i].at).match(/\((i{1,3}|iv|vi{0,3}|ix|x)\)/gi); if (rom) name = rom[rom.length - 1].replace(/[()]/g, '').toLowerCase(); }
        sets.push({ label: name, n: Math.max(n, 2) });
        name = ''; from = j < marks.length ? marks[j - 1].at : text.length; i = j;
      } else i++;
    }
    sets.forEach(function (x, k) { if (!x.label) x.label = String(k + 1); });
    return sets.length >= 2 ? sets : [];
  }

  // The number or letter, ticked or circled once marked.
  function numHtml(label, mark, mode, part) {
    var show = (mode === 'marked' || mode === 'mark') && mark;
    return '<span class="as-num' + (part ? ' as-num-part' : '') + (show ? ' as-' + mark : '') + '">' + label +
      (show && mark === 'r' ? '<i class="as-tick" aria-label="right">✓</i>' : '') +
      (show && mark === 'w' ? '<i class="as-ring" aria-label="wrong"></i>' : '') + '</span>';
  }

  // One picture per page, reused when the paper is drawn again, so a
  // redraw doesn't jump while pictures load.
  var imgs = {};
  function pageImg(paper, n) {
    var k = paper.id + '-' + n;
    if (imgs[k]) return imgs[k];
    var img = imgs[k] = el('img', 'as-pageimg');
    img.alt = 'Page ' + n;
    window.T3_store.fetchPage(paper.id, n).then(function (src) {
      if (src) img.src = src; else img.replaceWith(el('p', 'as-wait', 'Page ' + n + ' didn’t load. Check the connection, then open the paper again.'));
    });
    return img;
  }

  function headerHtml(paper, kid, when) {
    return '<div class="as-head"><p class="as-band">' + [paper.grade, paper.subject, paper.title].filter(Boolean).map(esc).join(' &nbsp;•&nbsp; ') + '</p>' +
      (paper.covering ? '<p class="as-cover">Covering: ' + esc(paper.covering) + '</p>' : '') +
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

  /* ---------- printing the questions to rework ---------- */

  // The items marked wrong, by question: [{ q, wrong: [item…] }].
  function wrongByQuestion(paper, marks) {
    var out = [];
    paper.sections.forEach(function (s) {
      s.qs.forEach(function (q) {
        var wrong = items(q).filter(function (i) { return marks[i] === 'w'; });
        if (wrong.length) out.push({ q: q, wrong: wrong });
      });
    });
    return out;
  }

  function reworkButton(paper, kid, ans, marks) {
    var wrong = wrongByQuestion(paper, marks);
    var box = el('div', 'as-rework');
    if (!wrong.length) { box.innerHTML = '<p class="as-sub">Every question is right, so there’s nothing to rework.</p>'; return box; }
    var n = wrong.reduce(function (t, w) { return t + w.wrong.length; }, 0);
    var b = el('button', 'eot2-btn', 'Print questions to rework (' + n + ')');
    b.type = 'button';
    var first = el('label', 'as-rework-opt', '<input type="checkbox"> Show the first answer under each one');
    var msg = el('span', 'as-msg');
    b.addEventListener('click', function () {
      b.disabled = true;
      msg.textContent = 'Getting it ready…';
      reworkPrint(paper, kid, ans, wrong, first.querySelector('input').checked).then(function () { b.disabled = false; msg.textContent = ''; });
    });
    box.appendChild(b);
    box.appendChild(first);
    box.appendChild(msg);
    return box;
  }

  // A4 pages: the paper's name, the Riser's name and the date, then each
  // question marked wrong (only the wrong parts of a question with parts),
  // with lines to work it again. A PDF paper has its questions only as
  // page pictures: the pages with wrong questions print instead, with the
  // ones to redo named above each, then the lines.
  function reworkPrint(paper, kid, ans, wrong, showFirst) {
    var answers = ans.answers || {};
    var asText = !paper.uploaded || paper.html;
    var lines = function (k) { var h = '<div class="as-pr-lines">'; for (var i = 0; i < k; i++) h += '<i></i>'; return h + '</div>'; };
    var firstOf = function (id, q) {
      if (!showFirst) return '';
      var a = answers[id];
      if (q && q.options && a) a = '(' + a + ') ' + (q.options[LETTERS.indexOf(a)] || '');
      return '<p class="as-pr-first"><b>First answer:</b> ' + (filled(a) ? math(a) : '<span>none</span>') + '</p>';
    };
    var all = [];
    wrong.forEach(function (w) { all = all.concat(w.wrong); });
    var html = '<div class="as-pr-head"><div><b>' + esc([paper.subject, paper.title].filter(Boolean).join(' — ')) + '</b><span>Questions to rework</span></div>' +
      '<div class="as-pr-name"><span><b>Name:</b> ' + esc(kid.name) + '</span><span><b>Date:</b> ____________</span></div></div>' +
      '<p class="as-pr-list"><b>To redo:</b> ' + all.map(function (i) { return 'Q' + label(i); }).join(', ') + '</p>';
    var jobs = [];
    if (asText) {
      wrong.forEach(function (w) {
        var q = w.q;
        html += '<div class="as-pr-q"><div class="as-pr-qhead"><b>' + q.n + '.</b>' +
          (q.text ? '<div>' + math(q.text) + '</div>' : paper.html && paper.html[q.n] ? '<div class="as-qhtml">' + paper.html[q.n] + '</div>' : '<div>Question ' + q.n + '</div>') + '</div>';
        if (q.parts) {
          q.parts.filter(function (p) { return w.wrong.indexOf(q.n + p.l) !== -1; }).forEach(function (p) {
            html += '<div class="as-pr-part"><p><b>(' + p.l + ')</b> ' + math(p.text || '') + '</p>' + firstOf(q.n + p.l) + lines(3) + '</div>';
          });
        } else {
          if (q.options) html += '<p class="as-pr-opts">' + q.options.map(function (o, i) { return '<span><b>(' + LETTERS[i] + ')</b> ' + math(o || '') + '</span>'; }).join('') + '</p>';
          html += firstOf(String(q.n), q) + lines(q.options ? 2 : q.work ? 6 : 4);
        }
        html += '</div>';
      });
    } else {
      // Pages with a wrong question on them, in order, each once.
      var byPage = {};
      wrong.forEach(function (w) { (byPage[w.q.page] = byPage[w.q.page] || []).push(w); });
      Object.keys(byPage).map(Number).sort(function (a, b) { return a - b; }).forEach(function (pg) {
        var ws = byPage[pg], ids = [];
        ws.forEach(function (w) { ids = ids.concat(w.wrong); });
        html += '<div class="as-pr-page"><p class="as-pr-list"><b>On this page, redo:</b> ' + ids.map(function (i) { return 'Q' + label(i); }).join(', ') + '</p>' +
          '<img class="as-pr-img" data-page="' + pg + '" alt="Page ' + pg + '"></div>';
        jobs.push(window.T3_store.fetchPage(paper.id, pg).then(function (src) { return { pg: pg, src: src }; }));
      });
      html += '<div class="as-pr-work"><h3>My rework</h3>' + all.map(function (i) {
        return '<div class="as-pr-q"><div class="as-pr-qhead"><b>Q' + label(i) + '</b></div>' + firstOf(i) + lines(4) + '</div>';
      }).join('') + '</div>';
    }
    return Promise.all(jobs).then(function (pics) {
      var old = document.querySelector('.as-printout');
      if (old) old.remove();
      var out = el('div', 'as-printout', html);
      pics.forEach(function (p) {
        var img = out.querySelector('img[data-page="' + p.pg + '"]');
        if (img && p.src) img.src = p.src; else if (img) img.replaceWith(el('p', 'as-wait', 'Page ' + p.pg + ' didn’t load.'));
      });
      document.body.appendChild(out);
      // Wait for the pictures before printing.
      var imgsIn = Array.prototype.slice.call(out.querySelectorAll('img'));
      return Promise.all(imgsIn.map(function (im) {
        return im.complete ? null : new Promise(function (r) { im.onload = im.onerror = r; });
      })).then(function () { setTimeout(function () { window.print(); }, 50); });
    });
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
    var mine = papersFor(kid.slug);
    Promise.all(mine.map(function (p) {
      return Promise.all([window.eot2Fetch(kid.group, kid.slug, keyOf(p.id)), window.eot2Fetch(kid.group, kid.slug, marksKeyOf(p.id))])
        .then(function (r) { return { paper: p, st: status(r[0] && r[0].state, r[1] && r[1].state) }; });
    })).then(function (rows) {
      list.innerHTML = rows.length ? '' : '<p class="as-wait">No assessments yet. They’ll appear here when your facilitator sets them.</p>';
      rows.forEach(function (r) {
        var a = el('a', 'as-card as-st-' + r.st.id, '<span class="as-card-sub">' + esc(r.paper.subject) + '</span><strong>' + esc(r.paper.title) + '</strong>' +
          (r.paper.covering ? '<span class="as-card-cover">' + esc(r.paper.covering) + '</span>' : '') +
          '<em>' + (r.st.id === 'returned' ? 'Marked — fill in What I’ve Learnt' : r.st.id === 'submitted' ? 'Sent — your facilitator is checking it' : r.st.label) + '</em>');
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
      SPLIT = mk._returned ? (mk.split || {}) : {};
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
          body.appendChild(reworkButton(paper, kid, ans, marks));
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
        if (!mk.auto) markAndSave(kid, paper, ans);
        body.appendChild(el('div', 'as-banner', '<strong>Your paper has gone to your facilitator.</strong> <span>They will check it and send it back to you with your marks.</span>'));
        body.appendChild(paperEl(paper, ans, {}, 'read'));
        return;
      }
      if (ans._reopened) body.appendChild(el('div', 'as-banner', '<strong>Your facilitator sent this back to you.</strong> <span>Check your answers, change any you need to, then submit again.</span>'));
      body.appendChild(el('p', 'as-note', esc(paper.note) + (paper.uploaded ? '' : ' Type fractions like 2/3 (always in simplest form), and mixed numbers like 4 1/6.')));
      body.appendChild(paperEl(paper, ans, {}, 'answer', { change: function () { save(); } }));
      body.appendChild(submitPanel(kid, paper, ans, save));
    });
  }

  function blanksOf(paper, ans) {
    var out = [];
    paper.sections.forEach(function (s) { s.qs.forEach(function (q) { out = out.concat(answerItems(q)); }); });
    return out.filter(function (i) { return !filled((ans.answers || {})[i]); });
  }
  function label(id) { var m = /^(\d+)([a-z]?)(?:_(\d+))?$/.exec(id); return m ? m[1] + (m[2] ? '(' + m[2] + ')' : '') + (m[3] ? ' mark ' + m[3] : '') : id; }
  function jumpTo(id) {
    var t = document.querySelector('[data-item="' + id + '"]');
    if (!t) return;
    t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var f = t.querySelector('textarea, button');
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 400);
  }

  // Marks the paper from the key and saves the marks for staff to check;
  // the Riser sees them once staff return it. Resolves true once saved.
  function markAndSave(kid, paper, ans) {
    return window.T3_autoMark(paper, ans.answers || {}, items).then(function (marks) {
      // A typed answer to a choice question can't be marked from the key:
      // leave it for staff.
      paper.sections.forEach(function (s) {
        s.qs.forEach(function (q) {
          var a = (ans.answers || {})[String(q.n)];
          if (q.options && filled(a) && !/^[a-h]$/.test(String(a).trim())) delete marks[String(q.n)];
          if (q.markLetters) items(q).forEach(function (i) { delete marks[i]; });
        });
      });
      return window.eot2Save(kid.group, kid.slug, marksKeyOf(paper.id), { marks: marks, auto: true, _marked: new Date().toISOString(), by: 'auto' })
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
      msg.textContent = 'Sending…';
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
    app.appendChild(el('div', 'eot2-head', '<h1>Term 3 Assessments</h1><p>When a Riser submits, the paper is marked automatically from the answer key and comes to you. Check the marks, then return it to them.</p>'));
    var add = el('a', 'eot2-btn as-new', '+ New assessment');
    add.href = 'index.html?view=upload';
    app.appendChild(add);
    var list = el('div', 'as-list', '<p class="as-sub">Loading…</p>');
    app.appendChild(list);
    var all = allIds();
    if (all.length) {
      var mg = el('div', 'as-manage', '<h2>Papers</h2><p class="as-sub">Change who has a paper, or delete it.</p>');
      all.sort(function (a, b) { return ((UPLOADED[b] || {}).at || '').localeCompare((UPLOADED[a] || {}).at || ''); }).forEach(function (id) {
        var it = infoById(id);
        var names = kidsOf(id).map(function (s) { var k = window.EOT2_findKid(s); return k ? k.name : s; });
        var a = el('a', 'as-mrow', '<b>' + esc(it.subject ? it.subject + ' — ' : '') + esc(it.title) + '</b><span>' + (UPLOADED[id] && UPLOADED[id].at ? 'Uploaded ' + day(UPLOADED[id].at) + ' · ' : '') + (names.length ? esc(names.join(', ')) : 'No one') + '</span><em>Change</em>');
        a.href = 'index.html?view=upload&id=' + encodeURIComponent(id);
        mg.appendChild(a);
      });
      app.appendChild(mg);
    }
    var jobs = [];
    window.EOT2_KIDS.forEach(function (k) {
      papersFor(k.slug).forEach(function (p) { jobs.push({ kid: k, paper: p }); });
    });

    Promise.all(jobs.map(function (j) {
      return Promise.all([window.eot2Fetch(j.kid.group, j.kid.slug, keyOf(j.paper.id)), window.eot2Fetch(j.kid.group, j.kid.slug, marksKeyOf(j.paper.id))])
        .then(function (r) { j.st = status(r[0] && r[0].state, r[1] && r[1].state); return j; });
    })).then(function (rows) {
      list.innerHTML = rows.length ? '' : '<p class="as-sub">No assessments set yet.</p>';
      rows.forEach(function (j) {
        var card = el('div', 'as-cardwrap');
        var a = el('a', 'as-card as-st-' + j.st.id, '<span class="as-card-sub">' + esc(j.kid.name) + '</span><strong>' + esc(j.paper.subject) + ' — ' + esc(j.paper.title) + '</strong>' +
          (UPLOADED[j.paper.id] && UPLOADED[j.paper.id].at ? '<span class="as-card-cover">Uploaded ' + day(UPLOADED[j.paper.id].at) + '</span>' : '') +
          '<em>' + (j.st.id === 'submitted' ? (j.st.auto ? 'Marked automatically — check and return' : 'Submitted — ready to mark') : j.st.id === 'returned' ? 'Returned — waiting for the revision plan' : j.st.label) + '</em>');
        a.href = 'index.html?view=staff&kid=' + j.kid.slug + '&id=' + j.paper.id;
        card.appendChild(a);
        // Take back: the Riser no longer sees it; what they wrote is kept.
        var tb = el('button', 'as-takeback', 'Take back');
        tb.type = 'button';
        tb.addEventListener('click', function () {
          if (!confirm('Take this paper back from ' + j.kid.name + '? They won’t see it any more. Anything they wrote is kept, and comes back if you send it to them again.')) return;
          tb.disabled = true;
          window.T3_store.saveIndexItem(j.paper.id, { kids: kidsOf(j.paper.id).filter(function (s) { return s !== j.kid.slug; }) }).then(function (ok) {
            if (!ok) { tb.disabled = false; alert('Not saved — check the connection and try again.'); return; }
            return window.T3_store.fetchIndex().then(function (items) { UPLOADED = items; renderStaffList(); });
          });
        });
        card.appendChild(tb);
        list.appendChild(card);
      });
    });
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
      paper.uploaded ? null : loadKey(paper)
    ]).then(function (r) {
      var ans = (r[0] && r[0].state) || {};
      var mk = (r[1] && r[1].state) || {};
      mk.marks = mk.marks || {};
      var key = r[2];
      st.set('saved', mk._returned ? 'Returned' : 'Saved');
      // An uploaded paper's key is locked with the facilitator PIN.
      var keyBox = null;
      if (paper.enc) {
        keyBox = el('div', 'as-pass as-keybox', '<label>Answer key: facilitator PIN <input type="password" inputmode="numeric" autocomplete="off" maxlength="8"></label>');
        var kb = el('button', 'eot2-btn', 'Show the key');
        kb.type = 'button';
        var kmsg = el('span', 'as-msg');
        keyBox.appendChild(kb); keyBox.appendChild(kmsg);
        var kin = keyBox.querySelector('input');
        var tryKey = function (pin, quiet) {
          return window.T3_store.unlock(paper.enc, pin).then(function (k) {
            if (!k) { if (!quiet) { kmsg.textContent = 'That PIN isn’t right.'; kin.select(); } return; }
            try { sessionStorage.setItem('rj-t3-pin', pin); } catch (e) {}
            key = k;
            keyBox.remove();
            if (ans._submitted) drawKeep();
          });
        };
        kb.addEventListener('click', function () { tryKey(kin.value.trim()); });
        kin.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryKey(kin.value.trim()); });
        var remembered = null;
        try { remembered = sessionStorage.getItem('rj-t3-pin'); } catch (e) {}
        if (remembered) tryKey(remembered, true);
      }
      body.innerHTML = '';
      if (!ans._submitted) {
        body.appendChild(el('p', 'as-wait', ans._reopened ? 'Sent back to ' + kid.name + ' on ' + day(ans._reopened) + '. It comes back here, marked again, when they submit.' : kid.name + ' hasn’t submitted this yet. It can be marked once it’s submitted.'));
        return;
      }
      body.insertAdjacentHTML('beforeend', headerHtml(paper, kid, day(ans._submitted)));
      if (mk.auto) body.appendChild(el('p', 'as-note', 'Marked automatically from the answer key' + (mk.by && mk.by !== 'auto' ? ', then checked by ' + esc(mk.by.charAt(0).toUpperCase() + mk.by.slice(1)) : '') + '. ' +
        (mk._returned ? 'Change any mark below, then send the updated marks.' : 'Check the marks, mark any it left for you, then return it to ' + esc(kid.name) + '.')));
      else if (!mk._returned) {
        // Submitted, but the automatic marks never arrived: make them now.
        body.appendChild(el('p', 'as-note', 'Marking it from the answer key…'));
        markAndSave(kid, paper, ans).then(function (ok) { if (ok) renderStaffMark(kid, paper); });
        return;
      }
      // Send it back: the Riser can change their answers and submit again.
      // Their answers stay; marks so far are cleared.
      var reopen = el('div', 'as-reopen', '<span>Need ' + esc(kid.name) + ' to change something first?</span>');
      var rb = el('button', 'eot2-btn eot2-btn-secondary', 'Send back to ' + esc(kid.name));
      rb.type = 'button';
      var rmsg = el('span', 'as-msg');
      rb.addEventListener('click', function () {
        if (!confirm('Send this back to ' + kid.name + '? They can change their answers and submit again. Everything they wrote is kept; any marks so far are cleared.')) return;
        rb.disabled = true;
        rmsg.textContent = 'Sending…';
        window.eot2Fetch(kid.group, kid.slug, keyOf(paper.id)).then(function (d) {
          var latest = (d && d.state) || ans;
          delete latest._submitted; delete latest._pass; delete latest._reviewed;
          latest._reopened = new Date().toISOString();
          return window.eot2Save(kid.group, kid.slug, keyOf(paper.id), latest);
        }).then(function (r) {
          if (!r || !r.ok) throw new Error('save');
          return window.eot2Save(kid.group, kid.slug, marksKeyOf(paper.id), {});
        }).then(function (r) {
          if (!r || !r.ok) throw new Error('save');
          renderStaffMark(kid, paper);
        }).catch(function () { rb.disabled = false; rmsg.textContent = 'Not sent — check the connection and try again.'; });
      });
      reopen.appendChild(rb);
      reopen.appendChild(rmsg);
      body.appendChild(reopen);
      if (ans._pass) body.appendChild(el('p', 'as-note as-note-pass', 'Submitted with a facilitator pass. Left blank: ' + ans._pass.blank.map(label).map(function (x) { return 'Q' + x; }).join(', ') + '.'));
      var save = saver(kid, marksKeyOf(paper.id), mk, function (m, t) { st.set(m, m === 'saved' && mk._returned ? 'Returned · saved' : t); });
      var tally = el('div', 'as-tally');
      body.appendChild(tally);
      if (keyBox) body.appendChild(keyBox);
      else if (!key) body.appendChild(el('p', 'as-note', 'The answer key couldn’t be loaded from the staff site, so mark from the paper key.'));
      var paperBox = el('div');
      body.appendChild(paperBox);
      var results = el('div');
      body.appendChild(results);
      var bar = el('div', 'as-submitbar');
      body.appendChild(bar);

      function draw() {
        paperBox.innerHTML = '';
        SPLIT = mk.split = mk.split || {};
        paperBox.appendChild(paperEl(paper, ans, mk.marks, 'mark', { key: key, change: function () { save(); drawKeep(); },
          setSplit: function (id, n) { if (n > 1) mk.split[id] = n; else delete mk.split[id]; save(); drawKeep(); } }));
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
        if (ans._reviewed) {
          bar.appendChild(reviewEl(paper, ans, true));
          if (mk._returned) bar.appendChild(reworkButton(paper, kid, ans, mk.marks));
        }
      }
      draw();
      refresh();
    });
  }

  /* ---------- start ---------- */

  var id = params.get('id');
  var view = params.get('view');
  if (view === 'staff' || view === 'upload') {
    var staffName = null;
    try { staffName = localStorage.getItem('rj-staff-name'); } catch (e) {}
    if (!staffName) { location.replace('../../index.html'); return; }
    if (view === 'upload') { window.T3_renderUpload(app, id); return; }
  } else {
    var kid = window.EOT2_signedInKid();
    if (!kid) { window.EOT2_leaveWithoutKid('index.html?view=staff', '../../index.html'); return; }
  }
  app.innerHTML = '<p class="as-sub">Loading…</p>';
  window.T3_store.fetchIndex().then(function (items) {
    UPLOADED = items;
    if (view === 'staff') {
      var k = params.get('kid') && window.EOT2_findKid(params.get('kid'));
      if (!k || !id || !infoById(id)) { renderStaffList(); return; }
      getPaper(id).then(function (p) { if (p) renderStaffMark(k, p); else renderStaffList(); });
      return;
    }
    var mine = papersFor(kid.slug).map(function (p) { return p.id; });
    if (!id || mine.indexOf(id) === -1) { renderKidList(kid); return; }
    getPaper(id).then(function (p) { if (p) renderKidPaper(kid, p); else renderKidList(kid); });
  });
})();
