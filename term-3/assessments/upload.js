/* Term 3 Assessments — set a new paper from one PDF or Word file (staff
   only).

   ?view=upload: choose who it's for, then the file (questions, then the
   answer key on a new page headed "Answer Key"). The browser reads it: a
   PDF's pages become pictures (pdf.js); a Word file's questions are kept
   as text, one piece per question (docx.js). The key is matched to the
   question numbers (assessments-parse.js). Staff check each answer and
   how it's marked, and send it. Nothing from the key on is ever saved.
   ?view=upload&id=<paper>: change who has an uploaded paper, or hide it. */
(function () {
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  var KINDS = [
    ['num', 'Number'], ['mcq', 'Choice letter'], ['symbol', '< or >'], ['text', 'Words'],
    ['between', 'Any numbers between'], ['staff', 'I’ll mark it']
  ];
  var WIDTH = 1100, MAXLEN = 190000;

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
  function sha16(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, 16);
    });
  }
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = PDFJS + 'pdf.min.js';
      s.onload = function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // The page's text as lines, top to bottom.
  function pageLines(page) {
    return page.getTextContent().then(function (tc) {
      var bits = tc.items.filter(function (i) { return i.str && i.str.trim(); }).map(function (i) {
        return { s: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0 };
      });
      bits.sort(function (a, b) { return b.y - a.y || a.x - b.x; });
      var lines = [];
      bits.forEach(function (b) {
        var l = lines[lines.length - 1];
        if (!l || Math.abs(l.y - b.y) > 3) { lines.push({ y: b.y, bits: [b] }); return; }
        l.bits.push(b);
      });
      return lines.map(function (l) {
        l.bits.sort(function (a, b) { return a.x - b.x; });
        var out = '', end = null;
        l.bits.forEach(function (b) {
          if (end !== null && b.x - end > 1.5) out += ' ';
          out += b.s;
          end = b.x + b.w;
        });
        return out.replace(/\s+/g, ' ').trim();
      });
    });
  }
  // The page as a JPEG small enough for one record.
  function pageImage(page) {
    var tries = [[WIDTH, 0.82], [WIDTH, 0.68], [900, 0.68], [800, 0.55]];
    function go(i) {
      var t = tries[i];
      var vp = page.getViewport({ scale: t[0] / page.getViewport({ scale: 1 }).width });
      var c = document.createElement('canvas');
      c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
        var url = c.toDataURL('image/jpeg', t[1]);
        return url.length <= MAXLEN || i === tries.length - 1 ? url : go(i + 1);
      });
    }
    return go(0);
  }
  function readPdf(file, progress) {
    return Promise.all([loadPdfJs(), file.arrayBuffer()]).then(function (r) {
      return r[0].getDocument({ data: new Uint8Array(r[1]) }).promise;
    }).then(function (doc) {
      var pages = [];
      function one(n) {
        if (n > doc.numPages) return Promise.resolve(pages);
        progress('Reading page ' + n + ' of ' + doc.numPages + '…');
        return doc.getPage(n).then(function (page) {
          return Promise.all([pageLines(page), pageImage(page)]).then(function (r) {
            pages.push({ n: n, lines: r[0], img: r[1] });
            return one(n + 1);
          });
        });
      }
      return one(1);
    });
  }

  // Accepted answers: "4 1/6 or 25/6".
  function accepted(s) { return String(s || '').split(/\s+or\s+|;|\|/i).map(function (x) { return x.trim(); }).filter(Boolean); }
  function betweenRule(s) {
    var m = /(\d+)\D+?(-?[\d.]+(?:\s*\/\s*\d+)?)\s*and\s*(-?[\d.]+(?:\s*\/\s*\d+)?)/i.exec(String(s || '').replace(/[−–]/g, '-'));
    if (!m) return null;
    var v = function (t) { var n = window.T3_markTools.numbers(t)[0]; return n ? n.p / n.q : NaN; };
    var lo = v(m[2]), hi = v(m[3]);
    if (isNaN(lo) || isNaN(hi) || lo >= hi) return null;
    return { between: [lo, hi], count: +m[1] };
  }
  // What the row will do, or a problem to fix.
  function check(it) {
    var c = window.T3_markTools.canonical;
    if (it.kind === 'staff') return { ok: true, t: 'You mark this one' };
    if (it.kind === 'between') return betweenRule(it.answer) ? { ok: true, t: 'Marked automatically' } : { ok: false, t: 'Write it like: 4 numbers between -1 and 0' };
    var as = accepted(it.answer);
    if (!as.length) return { ok: false, t: 'Add the answer, or choose “I’ll mark it”' };
    for (var i = 0; i < as.length; i++) {
      var v = c(as[i], it.kind);
      if (!v) return { ok: false, t: it.kind === 'num' ? 'No number found in “' + as[i] + '”' : it.kind === 'mcq' ? 'Write the letter, like b' : it.kind === 'symbol' ? 'Write < or >' : 'Add the words' };
      if (/^not-simplest/.test(v)) return { ok: false, t: '“' + as[i] + '” isn’t in its simplest form' };
    }
    return { ok: true, t: 'Marked automatically' };
  }

  function renderNew(app) {
    var staff = null;
    try { staff = localStorage.getItem('rj-staff-name'); } catch (e) {}
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="index.html?view=staff">&larr; Term 3 Assessments</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>New assessment</h1><p>Upload one file, PDF or Word: the questions first, then the answer key. Start the answer key on a new page with the heading <b>Answer Key</b>, and number its answers the same way as the questions (1. 2. 3. and (a) (b) for parts).</p>'));
    var body = el('div', 'as-body');
    app.appendChild(body);

    var who = el('section', 'as-results', '<h2>1. Who is it for?</h2>');
    var kids = kidPicker(who, []);
    body.appendChild(who);

    var pick = el('section', 'as-results up-pick', '<h2>2. The paper</h2>');
    var file = el('input');
    file.type = 'file';
    file.accept = 'application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx';
    file.id = 'up-file';
    var lab = el('label', 'eot2-btn up-choose', 'Choose the file');
    lab.htmlFor = 'up-file';
    var msg = el('p', 'as-sub', 'A PDF or a Word file (.docx).');
    pick.appendChild(file); pick.appendChild(lab); pick.appendChild(msg);
    body.appendChild(pick);
    var out = el('div');
    body.appendChild(out);

    file.addEventListener('change', function () {
      var f = file.files[0];
      if (!f) return;
      out.innerHTML = '';
      msg.textContent = 'Opening ' + f.name + '…';
      var progress = function (t) { msg.textContent = t; };
      if (/\.docx$/i.test(f.name)) {
        window.T3_readDocx(f, progress).then(function (w) {
          msg.textContent = f.name + ' · ' + Object.keys(w.blocks).length + ' questions';
          review(out, [{ n: 1, lines: w.lines }], staff, kids, w);
        }, function () {
          msg.textContent = 'That file couldn’t be read. Check it’s a Word file (.docx; an old .doc won’t work) and try again.';
        });
        return;
      }
      readPdf(f, progress).then(function (pages) {
        msg.textContent = f.name + ' · ' + pages.length + ' page' + (pages.length > 1 ? 's' : '');
        review(out, pages, staff, kids, null);
      }, function () {
        msg.textContent = 'That file couldn’t be read. Check it’s a PDF or a Word file and try again.';
      });
    });
  }

  function review(out, pages, staff, kids, word) {
    var parsed = window.T3_parse(pages);
    var d = parsed.details;
    out.innerHTML = '';
    if (word) word.notes.forEach(function (n) { out.appendChild(el('p', 'as-note as-note-pass', esc(n))); });
    if (!parsed.keyPage) {
      out.appendChild(el('p', 'as-note as-note-pass', 'No answer key found. Add a page at the end with the heading <b>Answer Key</b>, then upload it again. You can still send it and mark every answer yourself.'));
    } else if (!word && parsed.keyStartsMidPage) {
      out.appendChild(el('p', 'as-note as-note-pass', 'The answer key starts on page ' + parsed.keyPage + ', which also has questions on it. Start the key on a new page and upload it again, so Risers can’t see any of it.'));
    }

    // Details.
    var det = el('section', 'as-results', '<h2>3. Details</h2>');
    var fields = {};
    [['subject', 'Subject'], ['title', 'Title'], ['grade', 'Grade'], ['covering', 'Covering']].forEach(function (f) {
      var row = el('label', 'up-field', '<span>' + f[1] + '</span>');
      var inp = el('input', 'as-input');
      inp.value = d[f[0]] || '';
      row.appendChild(inp);
      fields[f[0]] = inp;
      det.appendChild(row);
    });
    var secInputs = parsed.sections.map(function (t, i) {
      var row = el('label', 'up-field', '<span>Section ' + (i + 1) + '</span>');
      var inp = el('input', 'as-input');
      inp.value = t;
      row.appendChild(inp);
      det.appendChild(row);
      return inp;
    });
    if (secInputs.length) det.appendChild(el('p', 'as-sub', 'Sections are scored on their own, and each one is a line in the Riser’s revision plan.'));
    out.appendChild(det);

    // A Word paper: each question as Risers will see it.
    if (word) {
      var pv = el('section', 'as-results', '<h2>4. What Risers see</h2><p class="as-sub">Each question as Risers will see it, with answer boxes under it. The answer key is left out. If something looks wrong, fix it in Word, or save it as a PDF and upload that.</p>');
      var box = el('div', 'up-preview');
      parsed.questions.forEach(function (q) {
        box.appendChild(el('div', 'up-pq', '<b>' + q.n + '.</b><div class="as-qhtml">' + (word.blocks[q.n] || '<i>Not found</i>') + '</div>'));
      });
      pv.appendChild(box);
      out.appendChild(pv);
    }

    // Pages Risers see: everything before the key.
    var pg = el('section', 'as-results', '<h2>4. Pages Risers see</h2><p class="as-sub">The answer key pages are left out. Tap a page to change it.</p>');
    var grid = el('div', 'up-pages');
    var show = {};
    pages.forEach(function (p) {
      show[p.n] = !parsed.keyPage || p.n < parsed.keyPage;
      var b = el('button', 'up-page', '<img alt="Page ' + p.n + '"><span></span>');
      b.type = 'button';
      b.querySelector('img').src = p.img;
      function paint() {
        b.classList.toggle('is-off', !show[p.n]);
        b.querySelector('span').textContent = 'Page ' + p.n + (show[p.n] ? ' · Risers see it' : (parsed.keyPage && p.n >= parsed.keyPage ? ' · Answer key' : ' · Hidden'));
      }
      b.addEventListener('click', function () { show[p.n] = !show[p.n]; paint(); });
      paint();
      grid.appendChild(b);
    });
    pg.appendChild(grid);
    if (!word) out.appendChild(pg);

    // The answers.
    var items = parsed.items.map(function (it) { return Object.assign({}, it); });
    var an = el('section', 'as-results', '<h2>5. Answers and marking</h2><p class="as-sub">Check each answer read from the key. Numbers are marked by value, so 2.5, 5/2 and 2 1/2 are the same; fractions must be in simplest form. To accept more than one answer, write “or” between them.</p>');
    if (!items.length) an.appendChild(el('p', 'as-wait', 'No numbered questions found.'));
    var table = el('div', 'up-rows');
    items.forEach(function (it) {
      var row = el('div', 'up-row');
      var lbl = /^(\d+)([a-z]?)$/.exec(it.id);
      row.appendChild(el('div', 'up-q', 'Q' + lbl[1] + (lbl[2] ? '(' + lbl[2] + ')' : '')));
      var mid = el('div', 'up-mid');
      mid.appendChild(el('p', 'up-key', it.keyText ? esc(it.keyText) : '<i>Not in the key</i>'));
      var ctl = el('div', 'up-ctl');
      var sel = el('select', 'up-kind');
      KINDS.forEach(function (k) { var o = el('option', '', k[1]); o.value = k[0]; sel.appendChild(o); });
      sel.value = it.kind;
      var inp = el('input', 'as-input up-ans');
      inp.value = it.answer;
      inp.placeholder = 'Answer';
      var st = el('span', 'up-st');
      function paint() {
        inp.hidden = it.kind === 'staff';
        var c = check(it);
        st.textContent = (c.ok ? '✓ ' : '⚠ ') + c.t;
        st.className = 'up-st' + (c.ok ? '' : ' is-bad');
        row.classList.toggle('is-bad', !c.ok);
      }
      sel.addEventListener('change', function () { it.kind = sel.value; paint(); });
      inp.addEventListener('input', function () { it.answer = inp.value; paint(); });
      paint();
      ctl.appendChild(sel); ctl.appendChild(inp);
      mid.appendChild(ctl);
      mid.appendChild(st);
      row.appendChild(mid);
      table.appendChild(row);
    });
    an.appendChild(table);
    out.appendChild(an);

    // Send.
    var send = el('section', 'as-results', '<h2>6. Send</h2><p class="as-sub">The facilitator PIN locks the answer key, so only staff can read it when marking.</p>');
    var pinRow = el('label', 'up-field', '<span>Facilitator PIN</span>');
    var pin = el('input', 'as-input up-pin');
    pin.type = 'password'; pin.inputMode = 'numeric'; pin.autocomplete = 'off'; pin.maxLength = 8;
    pinRow.appendChild(pin);
    send.appendChild(pinRow);
    var bar = el('div', 'as-submitbar');
    var b = el('button', 'eot2-btn', 'Send to Risers');
    b.type = 'button';
    var smsg = el('span', 'as-msg');
    bar.appendChild(b); bar.appendChild(smsg);
    send.appendChild(bar);
    out.appendChild(send);

    b.addEventListener('click', function () {
      smsg.className = 'as-msg';
      var bad = items.filter(function (it) { return !check(it).ok; });
      var chosen = kids();
      var shown = word ? [] : pages.filter(function (p) { return show[p.n]; }).map(function (p) { return p.n; });
      if (!fields.title.value.trim()) { smsg.textContent = 'Add a title.'; return; }
      if (!items.length) { smsg.textContent = 'No questions found in this file.'; return; }
      if (bad.length) { smsg.textContent = bad.length + ' answer' + (bad.length > 1 ? 's need' : ' needs') + ' fixing (marked ⚠).'; bad[0] && table.querySelector('.up-row.is-bad').scrollIntoView({ block: 'center' }); return; }
      if (!word && !shown.length) { smsg.textContent = 'Choose at least one page for Risers to see.'; return; }
      if (!chosen.length) { smsg.textContent = 'Choose who it’s for (at the top).'; document.querySelector('.up-kids').scrollIntoView({ block: 'center' }); return; }
      sha16('lifehub-t3|pin|' + pin.value.trim()).then(function (h) {
        if (h !== window.T3_PASS) { smsg.textContent = 'That PIN isn’t right.'; return; }
        b.disabled = true;
        smsg.textContent = 'Saving…';
        parsed.sections = secInputs.map(function (inp, i) { return inp.value.trim() || 'Section ' + (i + 1); });
        build(parsed, items, fields, shown, pin.value.trim(), word).then(function (paper) {
          return saveAll(paper, pages, shown, chosen, staff, function (t) { smsg.textContent = t; }, word);
        }).then(function (ok) {
          if (!ok) { b.disabled = false; smsg.textContent = 'Not sent — check the connection and try again.'; return; }
          location.href = 'index.html?view=staff';
        });
      });
    });
  }

  // Tap Risers to choose them, or a quick pick for a whole age group.
  function kidPicker(box, on) {
    var picked = {};
    on.forEach(function (s) { picked[s] = true; });
    var quick = el('div', 'up-quick');
    var grid = el('div', 'up-kids');
    var count = el('p', 'as-sub up-count');
    var btns = [];
    function paint() {
      btns.forEach(function (x) { x.b.classList.toggle('is-on', !!picked[x.k.slug]); });
      var n = window.EOT2_KIDS.filter(function (k) { return picked[k.slug]; }).length;
      count.textContent = n ? n + ' chosen' : 'No one chosen yet. Tap a name.';
    }
    [['Everyone', function () { return true; }], ['Ages 8–10', function (k) { return k.ageBand === '8-10'; }],
      ['Ages 11–13', function (k) { return k.ageBand === '11-13'; }], ['Clear', null]].forEach(function (q) {
      var b = el('button', 'up-qbtn', q[0]);
      b.type = 'button';
      b.addEventListener('click', function () {
        window.EOT2_KIDS.forEach(function (k) { picked[k.slug] = !!(q[1] && q[1](k)); });
        paint();
      });
      quick.appendChild(b);
    });
    window.EOT2_KIDS.forEach(function (k) {
      var b = el('button', 'up-kid', esc(k.name));
      b.type = 'button';
      b.addEventListener('click', function () { picked[k.slug] = !picked[k.slug]; paint(); });
      btns.push({ b: b, k: k });
      grid.appendChild(b);
    });
    box.appendChild(quick);
    box.appendChild(grid);
    box.appendChild(count);
    paint();
    return function () { return window.EOT2_KIDS.map(function (k) { return k.slug; }).filter(function (s) { return picked[s]; }); };
  }

  // The paper record: structure, fingerprints and the locked key.
  function build(parsed, items, fields, shown, pin, word) {
    var id = 'u-' + Date.now().toString(36);
    var byId = {};
    items.forEach(function (it) { byId[it.id] = it; });
    var titles = parsed.sections.length ? parsed.sections : [fields.title.value.trim()];
    var sections = titles.map(function (t) { return { title: t, qs: [] }; });
    parsed.questions.forEach(function (q) {
      var s = sections[Math.min(q.section, sections.length - 1)];
      var out = { n: q.n, page: q.page };
      if (q.parts) out.parts = q.parts.map(function (p) { return { l: p.l, text: '' }; });
      else {
        var it = byId[String(q.n)];
        if (it && it.kind === 'mcq') {
          var want = Math.max(q.choices || 4, 'abcdefgh'.indexOf(window.T3_markTools.canonical(it.answer, 'mcq')) + 1);
          out.options = new Array(want).join(',').split(',');
        }
      }
      out.text = '';
      s.qs.push(out);
    });
    sections = sections.filter(function (s) { return s.qs.length; });
    var kinds = {}, rules = {}, key = {}, jobs = [];
    var auto = {};
    items.forEach(function (it) {
      kinds[it.id] = it.kind === 'between' ? 'num' : it.kind;
      key[it.id] = (it.keyText || '') + (it.kind === 'staff' ? '' : '  → accepted: ' + it.answer);
      if (it.kind === 'between') { rules[it.id] = betweenRule(it.answer); return; }
      if (it.kind === 'staff') return;
      auto[it.id] = [];
      accepted(it.answer).forEach(function (a) {
        jobs.push(window.T3_hash(id, it.id, window.T3_markTools.canonical(a, it.kind)).then(function (h) { auto[it.id].push(h); }));
      });
    });
    return Promise.all(jobs).then(function () { return window.T3_store.lock(key, pin); }).then(function (enc) {
      var hasNum = items.some(function (it) { return it.kind === 'num'; });
      return {
        id: id, uploaded: true,
        subject: fields.subject.value.trim(), title: fields.title.value.trim(),
        grade: fields.grade.value.trim(), covering: fields.covering.value.trim(),
        note: (word ? 'Read each question, then write your answer in the box under it.' : 'Read each page, then write your answers in the boxes under it.') + (hasNum ? ' Type fractions like 2/3 (always in simplest form), and mixed numbers like 4 1/6.' : ''),
        format: word ? 'docx' : 'pdf', pages: shown, sections: sections, kinds: kinds, rules: rules, auto: auto, enc: enc
      };
    });
  }

  // Pages first, then the paper, then the list: a paper only appears
  // once everything it needs is saved.
  function saveAll(paper, pages, shown, kids, staff, progress, word) {
    var S = window.T3_store;
    // A PDF: one record per page picture. Word: the questions, packed a
    // few to a record.
    var todo = word ? chunks(word.blocks) : pages.filter(function (p) { return shown.indexOf(p.n) !== -1; });
    if (word) paper.htmlChunks = todo.length;
    function one(i) {
      if (i >= todo.length) return Promise.resolve(true);
      progress('Saving ' + (word ? 'part ' : 'page ') + (i + 1) + ' of ' + todo.length + '…');
      var job = word ? S.saveHtml(paper.id, i, todo[i]) : S.savePage(paper.id, todo[i].n, todo[i].img);
      return job.then(function (ok) { return ok && one(i + 1); });
    }
    return one(0).then(function (ok) {
      if (!ok) return false;
      progress('Saving the paper…');
      return S.savePaper(paper);
    }).then(function (ok) {
      if (!ok) return false;
      return S.saveIndexItem(paper.id, {
        title: paper.title, subject: paper.subject, grade: paper.grade, covering: paper.covering,
        kids: kids, pages: shown.length, by: staff, at: new Date().toISOString()
      });
    });
  }

  function chunks(blocks) {
    var out = [], cur = {}, size = 0;
    Object.keys(blocks).forEach(function (n) {
      var len = blocks[n].length + 20;
      if (size && size + len > 150000) { out.push(cur); cur = {}; size = 0; }
      cur[n] = blocks[n];
      size += len;
    });
    if (size) out.push(cur);
    return out;
  }

  // An uploaded paper: who has it, or hide it.
  function renderEdit(app, id) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="index.html?view=staff">&larr; Term 3 Assessments</a>'));
    var body = el('div', 'as-body', '<p class="as-sub">Loading…</p>');
    app.appendChild(body);
    window.T3_store.fetchIndex().then(function (items) {
      var it = items[id];
      body.innerHTML = '';
      if (!it) { body.appendChild(el('p', 'as-wait', 'This paper wasn’t found.')); return; }
      body.appendChild(el('div', 'eot2-head', '<h1>' + esc(it.subject ? it.subject + ' — ' : '') + esc(it.title) + '</h1><p>Uploaded' + (it.by ? ' by ' + esc(it.by.charAt(0).toUpperCase() + it.by.slice(1)) : '') + (it.at ? ' on ' + new Date(it.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : '') + '.</p>'));
      var who = el('section', 'as-results', '<h2>Who is it for?</h2><p class="as-sub">Taking a Riser off hides the paper from them; anything they wrote is kept.</p>');
      var kids = kidPicker(who, it.kids || []);
      body.appendChild(who);
      var bar = el('div', 'as-submitbar');
      var b = el('button', 'eot2-btn', 'Save');
      b.type = 'button';
      var hide = el('button', 'as-passlink', it.off ? 'Show this paper again' : 'Hide this paper from everyone');
      hide.type = 'button';
      var msg = el('span', 'as-msg');
      bar.appendChild(b); bar.appendChild(msg); bar.appendChild(hide);
      body.appendChild(bar);
      function save(fields) {
        b.disabled = true;
        window.T3_store.saveIndexItem(id, fields).then(function (ok) {
          b.disabled = false;
          if (!ok) { msg.className = 'as-msg'; msg.textContent = 'Not saved — check the connection and try again.'; return; }
          location.href = 'index.html?view=staff';
        });
      }
      b.addEventListener('click', function () { save({ kids: kids() }); });
      hide.addEventListener('click', function () {
        if (!it.off && !confirm('Hide this paper? No Riser will see it.')) return;
        save({ off: !it.off });
      });
    });
  }

  window.T3_renderUpload = function (app, id) { if (id) renderEdit(app, id); else renderNew(app); };
})();
