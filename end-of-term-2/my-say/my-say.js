/* Term 2 Conference — "My Week, My Say" (questions in my-say-data.js).

   - Riser: fills it in on their own page. Answers save as they go (week
     key term2-my-say); Submit sends it, after which it shows their answers
     with nothing left to change.
   - Staff, ?view=staff&kid=<slug>: one Riser's answers, read only.
   - Staff, ?view=staff: every Riser's status, and for each part of the
     week how many voted Keep / Tweak / Rethink, from submitted answers. */
(function () {
  var KEY = 'term2-my-say';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var VOTES = window.MYSAY_VOTES;
  var PARTS = window.MYSAY_PARTS;
  var ALL = PARTS.concat(window.MYSAY_STAFF, [window.MYSAY_FINAL]);

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
  function filled(v) { return v && String(v).trim(); }

  /* ---------- one part of the week ---------- */

  // state[sec.id] = { vote, <qid>: answer, <qid>_other: text }
  function sectionEl(sec, n, state, locked, onChange) {
    var a = state[sec.id] = state[sec.id] || {};
    var box = el('section', 'ms-sec' + (sec.staff ? ' ms-sec-staff' : ''));
    box.style.setProperty('--sec', sec.color);
    box.appendChild(el('h2', 'ms-sec-title', (n ? '<span>' + n + '</span>' : '') + esc(sec.title)));

    if (!sec.staff && sec.id !== 'final') {
      var votes = el('div', 'ms-votes');
      VOTES.forEach(function (v) {
        var b = el('button', 'ms-vote ms-vote-' + v.id + (a.vote === v.id ? ' is-on' : ''), '<strong>' + v.label + '</strong><em>' + v.hint + '</em>');
        b.type = 'button';
        b.disabled = locked;
        b.addEventListener('click', function () { a.vote = a.vote === v.id ? '' : v.id; onChange(); paint(); });
        votes.appendChild(b);
      });
      box.appendChild(el('p', 'ms-q', 'How is it working for me?'));
      box.appendChild(votes);
      var paint = function () {
        Array.prototype.forEach.call(votes.children, function (b, i) { b.classList.toggle('is-on', a.vote === VOTES[i].id); });
      };
    }

    sec.qs.forEach(function (q) {
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
      box.appendChild(wrap);
    });
    return box;
  }

  function sectionsInto(body, state, locked, onChange) {
    PARTS.forEach(function (s, i) { body.appendChild(sectionEl(s, i + 1, state, locked, onChange)); });
    body.appendChild(el('div', 'ms-divider', '<h2>My connections with staff</h2><p>Honest answers help us support you better. Only your facilitators read these.</p>'));
    window.MYSAY_STAFF.forEach(function (s) { body.appendChild(sectionEl(s, 0, state, locked, onChange)); });
    body.appendChild(sectionEl(window.MYSAY_FINAL, 0, state, locked, onChange));
  }

  function voteKey() {
    return '<div class="ms-key">' + VOTES.map(function (v) { return '<span class="ms-key-' + v.id + '"><strong>' + v.label + '</strong> ' + v.hint + '</span>'; }).join('') + '</div>';
  }

  /* ---------- Riser ---------- */

  function renderKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>'));
    var head = el('div', 'eot2-form-header',
      '<div><h1>My Week, My Say</h1><div class="eot2-sub">Tell us how each part of your week feels for you. There are no wrong answers. Honest answers help most, even “this isn’t working for me.”</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>');
    app.appendChild(head);
    var status = document.getElementById('save-status');
    function setStatus(mode, text) { status.className = 'eot2-status eot2-status-' + mode; status.textContent = text; }
    var body = el('div', 'ms-body');
    app.appendChild(body);

    window.eot2Fetch(kid.group, kid.slug, KEY).then(function (d) {
      var state = (d && d.state) || window.eot2LoadLocal(KEY, kid.slug) || {};
      var locked = !!state._submitted;
      setStatus('saved', locked ? 'Submitted' : 'Saved');
      var timer = null;
      function save(now) {
        window.eot2SaveLocal(KEY, kid.slug, state);
        setStatus('saving', 'Saving…');
        if (timer) clearTimeout(timer);
        return new Promise(function (resolve) {
          timer = setTimeout(function () {
            window.eot2Save(kid.group, kid.slug, KEY, state).then(function (r) {
              setStatus(r.ok ? 'saved' : 'offline', r.ok ? (state._submitted ? 'Submitted' : 'Saved') : 'Not synced');
              resolve(r.ok);
            });
          }, now ? 0 : 900);
        });
      }
      if (locked) body.appendChild(el('p', 'ms-done', 'Thank you! You’ve sent your answers. Here’s what you said.'));
      body.insertAdjacentHTML('beforeend', voteKey());
      sectionsInto(body, state, locked, function () { save(); });
      if (locked) return;

      var foot = el('div', 'ms-foot', '<p class="ms-thanks">Thank you! Your answers help us plan Term 3.</p>');
      var btn = el('button', 'eot2-btn ms-submit', 'Submit');
      btn.type = 'button';
      var msg = el('span', 'ms-msg');
      btn.addEventListener('click', function () {
        var missing = PARTS.filter(function (p) { return !(state[p.id] && state[p.id].vote); }).length;
        if (missing && !confirm('You haven’t voted on ' + missing + ' part' + (missing > 1 ? 's' : '') + ' of your week yet. Send your answers anyway?')) return;
        state._submitted = new Date().toISOString();
        btn.disabled = true;
        msg.textContent = 'Sending…';
        save(true).then(function (ok) {
          if (!ok) { delete state._submitted; btn.disabled = false; msg.textContent = 'Not sent — check the connection and try again.'; return; }
          renderKid(kid);
          window.scrollTo(0, 0);
        });
      });
      foot.appendChild(btn);
      foot.appendChild(msg);
      body.appendChild(foot);
    });
  }

  /* ---------- staff ---------- */

  function renderStaffKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="index.html?view=staff">&larr; My Week, My Say · every Riser</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>My Week, My Say &mdash; ' + kid.name + '</h1><p class="ms-lede">Loading…</p>'));
    var body = el('div', 'ms-body');
    app.appendChild(body);
    window.eot2Fetch(kid.group, kid.slug, KEY).then(function (d) {
      var state = (d && d.state) || {};
      app.querySelector('.ms-lede').textContent = state._submitted ? 'Submitted ' + new Date(state._submitted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '.'
        : d ? kid.name + ' has started but not submitted yet.' : kid.name + ' hasn’t started yet.';
      if (!d) return;
      body.insertAdjacentHTML('beforeend', voteKey());
      sectionsInto(body, state, true, function () {});
    });
  }

  function renderStaffAll() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../staff/index.html">&larr; Term 2 Conference</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>My Week, My Say</h1><p>How each part of the week feels to the Risers, from their submitted answers.</p>'));
    var body = el('div', 'ms-body ms-staff', '<p class="ms-lede">Loading…</p>');
    app.appendChild(body);
    Promise.all(window.EOT2_KIDS.map(function (k) {
      return window.eot2Fetch(k.group, k.slug, KEY).then(function (d) { return { kid: k, state: d && d.state }; });
    })).then(function (rows) {
      var sent = rows.filter(function (r) { return r.state && r.state._submitted; });
      body.innerHTML = '<p class="ms-lede">' + sent.length + ' of ' + rows.length + ' Risers have submitted.</p>';
      var tally = el('div', 'ms-tally', '<div class="ms-tally-row ms-tally-head"><span>Part of the week</span>' +
        VOTES.map(function (v) { return '<span class="ms-key-' + v.id + '">' + v.label + '</span>'; }).join('') + '</div>');
      PARTS.forEach(function (p) {
        var c = {};
        sent.forEach(function (r) { var v = r.state[p.id] && r.state[p.id].vote; if (v) c[v] = (c[v] || 0) + 1; });
        tally.appendChild(el('div', 'ms-tally-row', '<span>' + esc(p.title) + '</span>' + VOTES.map(function (v) {
          var names = sent.filter(function (r) { return r.state[p.id] && r.state[p.id].vote === v.id; }).map(function (r) { return r.kid.name; });
          return '<span class="ms-count ms-key-' + v.id + (c[v.id] ? '' : ' is-zero') + '" title="' + esc(names.join(', ')) + '">' + (c[v.id] || 0) + '</span>';
        }).join('')));
      });
      body.appendChild(tally);
      var list = el('div', 'ms-kids', '<h2>Each Riser</h2>');
      rows.forEach(function (r) {
        var a = el('a', 'ms-kid', '<strong>' + r.kid.name + '</strong><span>' + (r.state && r.state._submitted ? 'Submitted' : r.state ? 'Started' : 'Not started') + '</span><em aria-hidden="true">&rarr;</em>');
        a.href = 'index.html?view=staff&kid=' + r.kid.slug;
        if (r.state && r.state._submitted) a.classList.add('is-done');
        list.appendChild(a);
      });
      body.appendChild(list);
    });
  }

  if (params.get('view') === 'staff') {
    var k = params.get('kid') ? window.EOT2_findKid(params.get('kid')) : null;
    if (k) renderStaffKid(k); else renderStaffAll();
    return;
  }
  var kid = window.EOT2_signedInKid();
  if (kid) renderKid(kid); else window.EOT2_leaveWithoutKid('index.html?view=staff', '../../index.html');
})();
