/* Term 3 Assessments — reading an uploaded paper.

   One PDF: the questions, then the answer key starting on a new page with
   a heading such as "Answer Key". Questions are numbered 1. 2. 3. …; a
   question's parts and choices are lettered (a) (b) …; "Section 1: …"
   lines start a section.

   T3_parse(pages) takes the text of each page, as lines, and returns the
   paper's details, sections and questions, the page the key starts on,
   and for each item (a question, or one lettered part of it) the key's
   line and a first guess at how to mark it. Staff check the guesses
   before the paper is sent. Runs in Node too, for testing. */
(function (root) {
  var QNUM = /^(\d{1,3})\s*[.)]\s*(.*)$/;
  var SECTION = /^section\s+(\d+)\s*[:.\-–—]?\s*(.*)$/i;
  var KEYHEAD = /^(answer\s*key|answers|answer\s*sheet|marking\s*(scheme|key|guide)|memo(randum)?|solutions)\b\s*[:.]?\s*(section.*)?$/i;
  var NUMTOK = /-?\s*\d+(?:\.\d+)?(?:\s+\d+\s*\/\s*\d+|\s*\/\s*-?\s*\d+)?/g;

  function norm(s) { return String(s || '').replace(/[−–—]/g, '-').replace(/\s+/g, ' ').trim(); }
  function open(t) { return (t.match(/\(/g) || []).length > (t.match(/\)/g) || []).length; }
  function letters(t) { var out = [], m, re = /\(([a-h])\)/gi; while ((m = re.exec(t))) out.push(m[1].toLowerCase()); return out; }
  // Notes in brackets, like "(divide by 100)", aren't the answer. Brackets
  // round a number, like (-19), and letters, like (b), stay.
  function dropNotes(t) {
    var prev;
    do { prev = t; t = t.replace(/\((?![a-h]\))[^()]*[a-z][^()]*\)/gi, ' '); } while (t !== prev);
    return norm(t);
  }

  // A first guess at one item's kind and accepted answer from its key text.
  function guess(text, choices) {
    var t = dropNotes(text);
    var bw = /any\s+(\d+)\b.*?between\s+(-?\d+(?:[.\/]\d+)?)\s+and\s+(-?\d+(?:[.\/]\d+)?)/i.exec(t);
    if (bw) return { kind: 'between', answer: bw[1] + ' numbers between ' + bw[2] + ' and ' + bw[3] };
    var ls = letters(t);
    if (choices >= 2) return { kind: 'mcq', answer: ls[0] || '' };
    if (ls.length) return { kind: 'mcq', answer: ls[0] };
    var sym = t.replace(/->|=>/g, '').match(/[<>]/g);
    if (sym) return { kind: 'symbol', answer: sym[sym.length - 1] };
    var seg = t.indexOf('=') !== -1 ? t.slice(t.lastIndexOf('=') + 1) : t;
    var nums = seg.match(NUMTOK);
    if (nums) return { kind: 'num', answer: nums[nums.length - 1].replace(/\s+/g, ' ').replace(/^- /, '-').trim() };
    var w = t.replace(/[.\s]+$/, '');
    if (w && w.length <= 40 && !/\d/.test(w)) return { kind: 'text', answer: w };
    return { kind: 'staff', answer: '' };
  }

  // Details from the first page: "Grade 7 • Mathematics • Term 1 Assessment"
  // and "Covering: …".
  function details(lines) {
    var d = { grade: '', subject: '', title: '', covering: '' };
    lines.forEach(function (l) {
      var c = /^covering\s*:\s*(.+)$/i.exec(l);
      if (c && !d.covering) d.covering = c[1];
      var parts = l.split(/\s*[•|·]\s*/).filter(Boolean);
      if (parts.length >= 2 && !d.title && !c) {
        parts.forEach(function (p) {
          if (/^(grade|year|class|std|standard)\b/i.test(p) && !d.grade) d.grade = p;
          else if (!d.subject) d.subject = p;
          else if (!d.title) d.title = p;
        });
      }
    });
    if (!d.title) {
      var t = lines.filter(function (l) { return !QNUM.test(l) && !/^(name|date)\b/i.test(l) && l.length > 3; })[0];
      d.title = t || 'Assessment';
    }
    return d;
  }

  function parse(pages) {
    pages = pages.map(function (p, i) { return { n: p.n || i + 1, lines: (p.lines || []).map(norm).filter(Boolean) }; });
    // The key starts at the first heading like "Answer Key".
    var keyPage = -1, keyLine = -1;
    pages.some(function (p, pi) {
      return p.lines.some(function (l, li) {
        if (KEYHEAD.test(l)) { keyPage = pi; keyLine = li; return true; }
      });
    });

    // Questions: numbers in order, so a stray "3." in the text is skipped.
    var qs = [], sections = [], cur = null, next = 1;
    pages.forEach(function (p, pi) {
      if (keyPage !== -1 && pi > keyPage) return;
      p.lines.forEach(function (l, li) {
        if (pi === keyPage && li >= keyLine) return;
        var s = SECTION.exec(l);
        if (s) { sections.push({ title: s[2] || 'Section ' + s[1], start: next }); return; }
        // A long section title can run onto the next line: "(… Rational" "Numbers)".
        var last = sections[sections.length - 1];
        if (last && last.start === next && open(last.title) && !QNUM.test(l)) { last.title += ' ' + l; return; }
        var m = QNUM.exec(l);
        if (m && +m[1] === next) {
          cur = { n: next, page: p.n, text: [m[2]], section: Math.max(0, sections.length - 1) };
          qs.push(cur);
          next++;
          return;
        }
        if (cur) cur.text.push(l);
      });
    });
    qs.forEach(function (q) {
      // Choices: (a) (b) … with no answer line of its own.
      var ls = letters(q.text.join(' ')), answerLine = q.text.some(function (l) { return /^answer\s*:/i.test(l); });
      var n = 0;
      while (ls.indexOf('abcdefgh'[n]) !== -1) n++;
      q.choices = n >= 2 && !answerLine ? n : 0;
      q.lettered = n >= 2 && answerLine ? n : 0;
    });

    // The key: numbered lines from the heading on.
    var key = {}, k = null, knext = 1;
    if (keyPage !== -1) {
      pages.slice(keyPage).forEach(function (p, i) {
        p.lines.forEach(function (l, li) {
          if (i === 0 && li <= keyLine) return;
          if (SECTION.test(l)) { k = null; return; }
          var m = QNUM.exec(l);
          if (m && (+m[1] === knext || (!k && +m[1] >= knext))) { k = +m[1]; key[k] = m[2]; knext = k + 1; return; }
          if (k) key[k] += ' ' + l;
        });
      });
    }

    // Questions found only in the key still need an answer box.
    Object.keys(key).forEach(function (n) {
      n = +n;
      if (!qs.some(function (q) { return q.n === n; })) qs.push({ n: n, page: pages[0] ? pages[0].n : 1, text: [], section: Math.max(0, sections.length - 1), choices: 0, lettered: 0 });
    });
    qs.sort(function (a, b) { return a.n - b.n; });

    // Items: a key line starting "(a) … (b) …" has lettered parts.
    var items = [];
    qs.forEach(function (q) {
      var kt = norm(key[q.n] || '');
      q.parts = null;
      if (/^\(a\)/i.test(kt) && /\(b\)/i.test(kt) && !q.choices) {
        var bits = kt.split(/\(([a-h])\)/i);
        q.parts = [];
        for (var i = 1; i < bits.length; i += 2) {
          var l = bits[i].toLowerCase(), txt = norm(bits[i + 1]);
          q.parts.push({ l: l });
          items.push(Object.assign({ id: q.n + l, keyText: txt }, guess(txt, 0)));
        }
      } else if (q.lettered && !kt) {
        q.parts = [];
        for (var j = 0; j < q.lettered; j++) {
          q.parts.push({ l: 'abcdefgh'[j] });
          items.push({ id: q.n + 'abcdefgh'[j], keyText: '', kind: 'staff', answer: '' });
        }
      } else {
        items.push(Object.assign({ id: String(q.n), keyText: kt }, kt ? guess(kt, q.choices) : { kind: q.choices ? 'mcq' : 'staff', answer: '' }));
      }
    });

    return {
      details: details(pages[0] ? pages[0].lines : []),
      keyPage: keyPage === -1 ? null : pages[keyPage].n,
      keyStartsMidPage: keyPage !== -1 && pages[keyPage].lines.slice(0, keyLine).some(function (l) { return QNUM.test(l) || SECTION.test(l); }),
      sections: sections.map(function (s) { return s.title; }),
      questions: qs.map(function (q) { return { n: q.n, page: q.page, section: q.section, choices: q.choices, parts: q.parts }; }),
      items: items
    };
  }

  root.T3_parse = parse;
  root.T3_guess = guess;
})(typeof window !== 'undefined' ? window : globalThis);
