/* Term 3 Assessments — automatic marking.

   The paper's data holds no answers, only a fingerprint of each accepted
   answer (paper.auto[item] = [hash, …]), so the key can't be read from the
   site's code. A Riser's answer is turned into the same canonical form and
   fingerprint and compared.

   Canonical forms:
   - numbers: the value as a fraction in lowest terms ("-1/18", "30").
     2 1/3, 7/3 and 2.333… are not mixed up: decimals stay exact, and a
     typed fraction must already be in its simplest form (6/9 is marked
     wrong where 2/3 is the answer). Units and "x =" are ignored; the last
     number written is the answer.
   - multiple choice: the letter.
   - rules (paper.rules[item]): { symbol: true } (the answer is < or >),
     { fraction: true } (must be written as a fraction, not a decimal),
     { between: [lo, hi], count: n } (n different numbers strictly between).

   Also used by tools/ to make the fingerprints, so it runs in Node too. */
(function (root) {
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function make(p, q) {
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q);
    return { p: p / g, q: q / g };
  }
  function clean(s) {
    return String(s || '').toLowerCase()
      .replace(/[−–—]/g, '-')
      .replace(/(\d),(\d{3})(?!\d)/g, '$1$2')
      .trim();
  }
  var NUM = /(-?)\s*(\d+(?:\.\d+)?)(?:\s+(\d+)\s*\/\s*(\d+)|\s*\/\s*(-?)\s*(\d+))?/g;

  // One number from a written token. Returns { p, q, simplest } or null.
  function fromMatch(m) {
    var neg = m[1] === '-', whole = m[2];
    var v;
    if (m[3] !== undefined) { // mixed number
      var n = +m[3], d = +m[4];
      if (!d || whole.indexOf('.') !== -1) return null;
      v = make(+whole * d + n, d);
      v.simplest = gcd(n, d) === 1;
      v.frac = true;
    } else if (m[6] !== undefined) { // fraction
      if (whole.indexOf('.') !== -1 || !+m[6]) return null;
      var num = +whole, den = +m[6] * (m[5] === '-' ? -1 : 1);
      v = make(num, den);
      v.simplest = gcd(num, den) === 1 && den > 0;
      v.frac = true;
    } else if (whole.indexOf('.') !== -1) { // decimal, kept exact
      var parts = whole.split('.'), scale = Math.pow(10, parts[1].length);
      v = make(+parts[0] * scale + +parts[1], scale);
      v.simplest = true;
    } else {
      v = make(+whole, 1);
      v.simplest = true;
    }
    if (neg) v.p = -v.p;
    return v;
  }
  function numbers(s) {
    var out = [], m;
    NUM.lastIndex = 0;
    while ((m = NUM.exec(s))) { var v = fromMatch(m); if (v) out.push(v); }
    return out;
  }
  function str(v) { return v.q === 1 ? String(v.p) : v.p + '/' + v.q; }

  // The canonical form of an answer, or '' if there's nothing to mark.
  function canonical(answer, kind) {
    var s = clean(answer);
    if (!s) return '';
    if (kind === 'mcq') return s.replace(/[^a-h]/g, '').slice(0, 1);
    if (kind === 'symbol') {
      var lt = s.indexOf('<') !== -1, gt = s.indexOf('>') !== -1;
      return lt === gt ? '' : lt ? '<' : '>';
    }
    if (s.indexOf('=') !== -1) s = s.slice(s.lastIndexOf('=') + 1);
    var ns = numbers(s);
    if (!ns.length) return '';
    var v = ns[ns.length - 1];
    if (kind === 'fraction' && !v.frac && v.q !== 1) return 'not-a-fraction:' + str(v);
    return v.simplest ? str(v) : 'not-simplest:' + str(v);
  }

  function inside(answer, rule) {
    var lo = rule.between[0], hi = rule.between[1];
    var seen = {};
    numbers(clean(answer)).forEach(function (v) {
      var x = v.p / v.q;
      if (x > lo && x < hi) seen[str(v)] = true;
    });
    return Object.keys(seen).length >= rule.count;
  }

  root.T3_markTools = { canonical: canonical, inside: inside, numbers: numbers };

  // Browser: mark every item of a paper. Resolves to { <item>: 'r'|'w' }.
  root.T3_autoMark = function (paper, answers, itemsOf) {
    var auto = paper.auto || {}, rules = paper.rules || {};
    var jobs = [];
    paper.sections.forEach(function (s) {
      s.qs.forEach(function (q) {
        itemsOf(q).forEach(function (id) {
          var a = answers[id];
          var rule = rules[id];
          if (rule && rule.between) { jobs.push(Promise.resolve([id, inside(a, rule)])); return; }
          var kind = q.options ? 'mcq' : rule && rule.symbol ? 'symbol' : rule && rule.fraction ? 'fraction' : 'num';
          var c = canonical(a, kind);
          if (!c) { jobs.push(Promise.resolve([id, false])); return; }
          jobs.push(root.T3_hash(paper.id, id, c).then(function (h) { return [id, (auto[id] || []).indexOf(h) !== -1]; }));
        });
      });
    });
    return Promise.all(jobs).then(function (rs) {
      var marks = {};
      rs.forEach(function (r) { marks[r[0]] = r[1] ? 'r' : 'w'; });
      return marks;
    });
  };

  // Fingerprint: the first 16 hex characters of SHA-256.
  root.T3_hash = function (paperId, item, value) {
    var text = 'lifehub-t3|' + paperId + '|' + item + '|' + value;
    if (root.crypto && root.crypto.subtle && root.TextEncoder) {
      return root.crypto.subtle.digest('SHA-256', new root.TextEncoder().encode(text)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('').slice(0, 16);
      });
    }
    return Promise.reject(new Error('No SHA-256 here'));
  };
})(typeof window !== 'undefined' ? window : globalThis);
