/* Term 2 Conference — one survey question (Risers' Feedback, Parents'
   Feedback). Answers live in `a`: a[q.id], plus a[q.id + '_other'].

   Question types: scale (one of four, best first), single, multi (tick up
   to `max`; no max = tick all that are true), text, and grid (a row of
   statements, each answered from `cols`). `other: true` adds an "Other"
   choice with its own box. Styles: my-say/my-say.css (.ms-*, .qs-*).

   EOT2_questionEl(q, a, locked, onChange): the question, to answer.
   EOT2_answerSummaryEl(q, answers, total): every submitted answer to it —
     a bar per choice (hover for names), a row per grid statement, and
     every written answer. answers: [{ name, a }] with a = that person's
     answers for the section; total = how many submitted. */
window.EOT2_questionEl = function (q, a, locked, onChange) {
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
  var wrap = el('div', 'ms-qwrap');
  wrap.appendChild(el('p', 'ms-q', esc(q.text) + (q.max ? ' <em>(tick up to ' + q.max + ')</em>' : q.note ? ' <em>(' + esc(q.note) + ')</em>' : '')));
  if (q.type === 'text') {
    var ta = el('textarea', 'ms-text');
    ta.rows = 2;
    ta.value = a[q.id] || '';
    ta.disabled = locked;
    ta.addEventListener('input', function () { a[q.id] = ta.value; onChange(); });
    wrap.appendChild(ta);
  } else if (q.type === 'grid') {
    var g = a[q.id] = a[q.id] || {};
    var t = el('div', 'ms-grid', '<div class="ms-grid-row ms-grid-head"><span></span>' + q.cols.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>');
    q.rows.forEach(function (row, ri) {
      var r = el('div', 'ms-grid-row', '<span>' + esc(row) + '</span>');
      q.cols.forEach(function (c) {
        var b = el('button', 'ms-dot' + (g[ri] === c ? ' is-on' : ''), '<span aria-hidden="true"></span>');
        b.type = 'button';
        b.setAttribute('aria-label', row + ': ' + c);
        b.disabled = locked;
        b.addEventListener('click', function () {
          g[ri] = g[ri] === c ? '' : c;
          Array.prototype.forEach.call(r.querySelectorAll('.ms-dot'), function (x, i) { x.classList.toggle('is-on', g[ri] === q.cols[i]); });
          onChange();
        });
        r.appendChild(b);
      });
      t.appendChild(r);
    });
    wrap.appendChild(t);
  } else {
    // scale and single: pick one; multi: pick up to max.
    var multi = q.type === 'multi';
    var opts = q.options.concat(q.other ? ['Other'] : []);
    var list = el('div', 'ms-opts' + (q.type === 'scale' ? ' ms-scale' : ''));
    var other = null;
    var chosen = function () { return multi ? (a[q.id] || []) : (a[q.id] ? [a[q.id]] : []); };
    opts.forEach(function (o, i) {
      var b = el('button', 'ms-opt', (q.type === 'scale' ? '<b>' + (opts.length - i) + '</b>' : '') + esc(o));
      b.type = 'button';
      b.disabled = locked;
      b.addEventListener('click', function () {
        var cur = chosen().slice(), at = cur.indexOf(o);
        if (multi) {
          if (at !== -1) cur.splice(at, 1);
          else if (!q.max || cur.length < q.max) cur.push(o);
          else { cur.shift(); cur.push(o); }
          a[q.id] = cur;
        } else {
          a[q.id] = at !== -1 ? '' : o;
        }
        sync(); onChange();
      });
      list.appendChild(b);
    });
    wrap.appendChild(list);
    if (q.other) {
      other = el('input', 'ms-other');
      other.type = 'text';
      other.placeholder = 'Other: write it here';
      other.value = a[q.id + '_other'] || '';
      other.disabled = locked;
      other.addEventListener('input', function () { a[q.id + '_other'] = other.value; onChange(); });
      wrap.appendChild(other);
    }
    var sync = function () {
      var c = chosen();
      Array.prototype.forEach.call(list.children, function (b, i) { b.classList.toggle('is-on', c.indexOf(opts[i]) !== -1); });
      if (other) other.hidden = c.indexOf('Other') === -1;
    };
    sync();
  }
  return wrap;
};

window.EOT2_answerSummaryEl = function (q, answers, total) {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function filled(v) { return v && String(v).trim(); }
  function bar(label, who) {
    var pct = total ? Math.round(who.length / total * 100) : 0;
    var r = document.createElement('div');
    r.className = 'qs-bar';
    r.innerHTML = '<span>' + esc(label) + '</span><i><b style="width:' + pct + '%"></b></i><em>' + who.length + '</em>';
    r.title = who.join(', ');
    return r;
  }
  function texts(list) {
    var ul = document.createElement('ul');
    ul.className = 'qs-texts';
    ul.innerHTML = list.map(function (x) { return '<li><strong>' + esc(x.name) + ':</strong> ' + esc(x.text) + '</li>'; }).join('');
    return ul;
  }
  var box = document.createElement('div');
  box.className = 'qs-q';
  box.innerHTML = '<p>' + esc(q.text) + '</p>';
  if (q.type === 'text') {
    var said = answers.filter(function (x) { return filled(x.a[q.id]); }).map(function (x) { return { name: x.name, text: x.a[q.id] }; });
    if (said.length) box.appendChild(texts(said));
    else box.insertAdjacentHTML('beforeend', '<p class="qs-none">No answers.</p>');
  } else if (q.type === 'grid') {
    q.rows.forEach(function (row, ri) {
      var r = document.createElement('div');
      r.className = 'qs-grid';
      r.innerHTML = '<span>' + esc(row) + '</span>' + q.cols.map(function (c) {
        var who = answers.filter(function (x) { return (x.a[q.id] || {})[ri] === c; }).map(function (x) { return x.name; });
        return '<em title="' + esc(who.join(', ')) + '"' + (who.length ? '' : ' class="is-zero"') + '>' + esc(c) + ' ' + who.length + '</em>';
      }).join('');
      box.appendChild(r);
    });
  } else {
    q.options.concat(q.other ? ['Other'] : []).forEach(function (o) {
      var who = answers.filter(function (x) {
        var v = x.a[q.id];
        return Array.isArray(v) ? v.indexOf(o) !== -1 : v === o;
      }).map(function (x) { return x.name; });
      box.appendChild(bar(o, who));
    });
    var others = answers.filter(function (x) { return filled(x.a[q.id + '_other']); }).map(function (x) { return { name: x.name, text: x.a[q.id + '_other'] }; });
    if (others.length) box.appendChild(texts(others));
  }
  return box;
};
