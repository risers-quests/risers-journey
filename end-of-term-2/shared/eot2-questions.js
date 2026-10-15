/* Term 2 Conference — one survey question (Risers' Feedback, Parents'
   Feedback). Answers live in `a`: a[q.id], plus a[q.id + '_other'].

   Question types: scale (one of four, best first), single, multi (tick up
   to `max`; no max = tick all that are true), text, and grid (a row of
   statements, each answered from `cols`). `other: true` adds an "Other"
   choice with its own box. Styles: my-say/my-say.css (.ms-*). */
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
