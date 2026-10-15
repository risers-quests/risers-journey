/* Term 2 Conference — Parents' Feedback (questions in pf-data.js).

   - Parents, at /parents-feedback (window.PF_PARENT): type their child's
     first name, answer, Submit. One response per family, saved under the
     child (week key term2-parent-feedback). Not linked from any dashboard.
   - Staff, this page: how many families have answered, a count for every
     choice, every written answer, and each family's status.
     ?kid=<slug>: one family's answers, read only. ?preview=1: the form as
     parents see it; nothing is saved. */
(function () {
  var KEY = 'term2-parent-feedback';
  var SECTIONS = window.PF_SECTIONS;
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

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

  // state[sec.id] = { <qid>: answer }
  function sectionsInto(body, state, locked, onChange) {
    SECTIONS.forEach(function (sec, i) {
      var a = state[sec.id] = state[sec.id] || {};
      var box = el('section', 'ms-sec');
      box.style.setProperty('--sec', sec.color);
      box.appendChild(el('h2', 'ms-sec-title', '<span>' + (i + 1) + '</span>' + esc(sec.title)));
      sec.qs.forEach(function (q) { box.appendChild(window.EOT2_questionEl(q, a, locked, onChange)); });
      body.appendChild(box);
    });
  }

  var INTRO = 'Thank you for coming to the Term 2 Conference. Please tell us how it went for you, so we can make the next one better. It takes about 3 minutes.';

  /* ---------- parents (/parents-feedback) ---------- */

  var PARENT = !!window.PF_PARENT;
  var SA_KEY = 'rj-pf-kid';

  function signOut() {
    try { sessionStorage.removeItem(SA_KEY); } catch (e) {}
    renderGate();
  }

  function renderGate() {
    app.innerHTML = '';
    var card = el('div', 'eot2-picker',
      '<h1>Parents’ Feedback</h1><p>Type your child’s first name to start.</p>' +
      '<div class="eot2-field"><label for="pf-name">Your child’s name</label><input id="pf-name" autocomplete="off" autocapitalize="words"></div>' +
      '<p class="eot2-msg" id="pf-msg"></p>');
    var go = el('button', 'eot2-btn', 'Start');
    go.type = 'button';
    card.appendChild(go);
    app.appendChild(card);
    var input = card.querySelector('#pf-name');
    function start() {
      var k = window.EOT2_findKidByName(input.value);
      if (!k) { card.querySelector('#pf-msg').textContent = 'We couldn’t find that name. Try again.'; return; }
      try { sessionStorage.setItem(SA_KEY, k.slug); } catch (e) {}
      renderParent(k);
      window.scrollTo(0, 0);
    }
    go.addEventListener('click', start);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
    input.focus();
  }

  function renderParent(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', esc(kid.name) + '’s family &middot; <a href="#" id="pf-switch">Not ' + esc(kid.name) + '’s family?</a>'));
    document.getElementById('pf-switch').addEventListener('click', function (e) { e.preventDefault(); signOut(); });
    app.appendChild(el('div', 'eot2-form-header',
      '<div><h1>Parents’ Feedback</h1><div class="eot2-sub">' + INTRO + '</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>'));
    var status = document.getElementById('save-status');
    function setStatus(mode, text) { status.className = 'eot2-status eot2-status-' + mode; status.textContent = text; }
    var body = el('div', 'ms-body');
    app.appendChild(body);

    window.eot2Fetch(kid.group, kid.slug, KEY).then(function (d) {
      var state = (d && d.state) || window.eot2LoadLocal(KEY, kid.slug) || {};
      setStatus('saved', state._submitted ? 'Submitted' : 'Saved');
      if (state._submitted) {
        body.appendChild(el('p', 'ms-done', 'Thank you! Your feedback has been sent.'));
        var done = el('button', 'eot2-btn eot2-btn-secondary', 'Done');
        done.type = 'button';
        done.addEventListener('click', signOut);
        body.appendChild(done);
        return;
      }
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
      sectionsInto(body, state, false, function () { save(); });
      var foot = el('div', 'ms-foot');
      var btn = el('button', 'eot2-btn ms-submit', 'Submit');
      btn.type = 'button';
      var msg = el('span', 'ms-msg');
      btn.addEventListener('click', function () {
        state._submitted = new Date().toISOString();
        btn.disabled = true;
        msg.textContent = 'Sending…';
        save(true).then(function (ok) {
          if (!ok) { delete state._submitted; btn.disabled = false; msg.textContent = 'Not sent — check the connection and try again.'; return; }
          renderParent(kid);
          window.scrollTo(0, 0);
        });
      });
      foot.appendChild(btn);
      foot.appendChild(msg);
      body.appendChild(foot);
    });
  }

  /* ---------- staff ---------- */

  function crumb(back) {
    app.appendChild(el('div', 'eot2-crumb', back
      ? '<a href="index.html">&larr; Parents’ Feedback</a>'
      : '<a href="../staff/index.html">&larr; Term 2 Conference</a>'));
  }

  function renderPreview() {
    app.innerHTML = '';
    crumb(true);
    app.appendChild(el('div', 'eot2-form-header', '<div><h1>Parents’ Feedback</h1><div class="eot2-sub">' + INTRO + '</div></div>' +
      '<div class="eot2-status eot2-status-offline">Preview &middot; not saved</div>'));
    var body = el('div', 'ms-body');
    app.appendChild(body);
    sectionsInto(body, {}, false, function () {});
  }

  function renderFamily(kid) {
    app.innerHTML = '';
    crumb(true);
    app.appendChild(el('div', 'eot2-head', '<h1>Parents’ Feedback &mdash; ' + esc(kid.name) + '’s family</h1><p class="ms-lede">Loading…</p>'));
    var body = el('div', 'ms-body');
    app.appendChild(body);
    window.eot2Fetch(kid.group, kid.slug, KEY).then(function (d) {
      var state = (d && d.state) || {};
      app.querySelector('.ms-lede').textContent = state._submitted
        ? 'Submitted ' + new Date(state._submitted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '.'
        : d ? 'Started but not submitted yet.' : 'Not started yet.';
      if (d) sectionsInto(body, state, true, function () {});
    });
  }

  function renderSummary() {
    app.innerHTML = '';
    crumb(false);
    app.appendChild(el('div', 'eot2-head', '<h1>Parents’ Feedback</h1><p>How the Term 2 Conference went for each family, from their submitted answers.</p>'));
    var link = new URL('../../parents-feedback/', location.href).href;
    var bar = el('div', 'pf-link', '<code>' + esc(link) + '</code>');
    var copy = el('button', 'eot2-btn eot2-btn-secondary', 'Copy link for parents');
    copy.type = 'button';
    copy.addEventListener('click', function () {
      (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { copy.textContent = 'Copied'; }, function () { copy.textContent = 'Select and copy the link'; });
    });
    var prev = el('a', 'eot2-btn eot2-btn-secondary', 'Preview the form');
    prev.href = 'index.html?preview=1';
    bar.appendChild(copy);
    bar.appendChild(prev);
    app.appendChild(bar);
    var body = el('div', 'ms-body', '<p class="ms-lede">Loading…</p>');
    app.appendChild(body);

    Promise.all(window.EOT2_KIDS.map(function (k) {
      return window.eot2Fetch(k.group, k.slug, KEY).then(function (d) { return { kid: k, state: d && d.state }; });
    })).then(function (rows) {
      var sent = rows.filter(function (r) { return r.state && r.state._submitted; });
      body.innerHTML = '<p class="ms-lede">' + sent.length + ' of ' + rows.length + ' families have submitted.</p>';
      SECTIONS.forEach(function (sec) {
        var box = el('section', 'pf-sum', '<h2>' + esc(sec.title) + '</h2>');
        box.style.setProperty('--sec', sec.color);
        sec.qs.forEach(function (q) {
          var qd = el('div', 'pf-q', '<p>' + esc(q.text) + '</p>');
          var ans = sent.map(function (r) { return { kid: r.kid, v: (r.state[sec.id] || {})[q.id] }; });
          if (q.type === 'text') {
            var said = ans.filter(function (x) { return filled(x.v); });
            qd.appendChild(said.length
              ? el('ul', 'pf-texts', said.map(function (x) { return '<li><strong>' + esc(x.kid.name) + '’s family:</strong>' + esc(x.v) + '</li>'; }).join(''))
              : el('p', 'pf-none', 'No answers yet.'));
          } else {
            q.options.forEach(function (o) {
              var who = ans.filter(function (x) { return Array.isArray(x.v) ? x.v.indexOf(o) !== -1 : x.v === o; });
              var pct = sent.length ? Math.round(who.length / sent.length * 100) : 0;
              var row = el('div', 'pf-bar', '<span>' + esc(o) + '</span><i><b style="width:' + pct + '%"></b></i><em>' + who.length + '</em>');
              row.title = who.map(function (x) { return x.kid.name; }).join(', ');
              qd.appendChild(row);
            });
          }
          box.appendChild(qd);
        });
        body.appendChild(box);
      });
      var list = el('div', 'ms-kids', '<h2>Each family</h2>');
      rows.forEach(function (r) {
        var a = el('a', 'ms-kid', '<strong>' + r.kid.name + '’s family</strong><span>' + (r.state && r.state._submitted ? 'Submitted' : r.state ? 'Started' : 'Not started') + '</span><em aria-hidden="true">&rarr;</em>');
        a.href = 'index.html?kid=' + r.kid.slug;
        if (r.state && r.state._submitted) a.classList.add('is-done');
        list.appendChild(a);
      });
      body.appendChild(list);
    });
  }

  if (PARENT) {
    var saved = null;
    try { saved = sessionStorage.getItem(SA_KEY); } catch (e) {}
    var sk = saved && window.EOT2_findKid(saved);
    if (sk) renderParent(sk); else renderGate();
    return;
  }

  var staff = null;
  try { staff = localStorage.getItem('rj-staff-name'); } catch (e) {}
  if (!staff) { location.replace('../../index.html'); return; }
  if (params.get('preview')) renderPreview();
  else if (params.get('kid') && window.EOT2_findKid(params.get('kid'))) renderFamily(window.EOT2_findKid(params.get('kid')));
  else renderSummary();
})();
