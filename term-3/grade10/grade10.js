/* 10th Boards: Before We Meet — parents fill it in, on their
   child's Term 3 page, before the meeting about 10th grade (questions in
   grade10-data.js, {name} = the child).

   - Staff, ?view=staff: OK it and choose which families see it (approval
     record: group term-3, kid staff, week grade10-approval, as
     { approved, kids: [slug…], by, at }), preview it, and read each
     family's answers. Until it's OK'd no family sees it.
   - The family (signed in as their child): only once it's OK'd and the
     child is chosen; answers save as they type, then Send. Saved under week key
     term3-grade10 as { answers: { <id>: text | choice | [choices],
     <id>_why: text }, _sent }. */
(function () {
  var G = window.G10;
  // Wording and save keys can come from the data file, so the same page
  // also runs other questionnaires (e.g. the Passion Finder); these
  // defaults are the 10th Grade ones.
  var T = Object.assign({
    key: 'term3-grade10', approval: 'grade10-approval', defaultKids: ['benjamin'],
    sub: 'For {name}’s parents, before the meeting',
    send: 'Send before the meeting',
    thanks: 'Thank you! You sent this on {date}. We will go through it with you at the meeting.',
    staffIntro: 'Parents fill this in before the meeting about their child’s 10th grade exams: how they feel, their plans, and how they would like to do it. Families only see it once it’s OK’d here; they find it on their child’s Term 3 page.',
    previewNote: 'This is what parents see (with their child’s name).',
    who: 'whose parents it’s for', one: 'family', many: 'families'
  }, G.text || {});
  var KEY = T.key, APPROVAL = T.approval;
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
  function filled(v) { return Array.isArray(v) ? v.length > 0 : v && String(v).trim(); }
  function day(iso) { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function fetchApproval() {
    return window.eot2Fetch('term-3', 'staff', APPROVAL).then(function (r) { return (r && r.state) || { approved: false, kids: T.defaultKids.slice() }; });
  }
  // Questions shown for these answers: a 'when' section or question only
  // once the big question points its way (in preview, every one). `when`
  // can also be a function of the answers (e.g. the Passion Finder's).
  function shows(item, a, all) {
    if (!item.when || all) return true;
    if (typeof item.when === 'function') return !!item.when(a);
    if (!a.route) return false;
    return ([].concat(G.NO).indexOf(a.route) !== -1) === (item.when === 'noexam');
  }
  function allQs(a) {
    var out = [];
    G.sections.forEach(function (s) { if (shows(s, a)) out = out.concat(s.qs.filter(function (q) { return shows(q, a); })); });
    return out;
  }

  // The questions; mode 'answer' (typing), 'read' (answers shown) or
  // 'preview' (staff trying it, nothing saved).
  var NAME = 'your child';
  // {pick}: the one thing they chose (G.pick says which answer holds it;
  // its "Something else" option takes the words they typed for it).
  var PICK = '';
  function pickOf(a) {
    var P = G.pick;
    if (!P) return '';
    var v = a[P.from] || '';
    if (v && v === P.otherOption) v = (a[P.otherFrom] || '').trim() || v;
    return v || P.none || '';
  }
  function nm(t) { return String(t || '').replace(/\{name\}/g, NAME).replace(/\{pick\}/g, PICK); }
  // A question's choices: fixed, or (optionsFrom) the ones they ticked in
  // another question, plus any extra choices.
  function optsOf(q, a) {
    if (!q.optionsFrom) return q.options;
    return (a[q.optionsFrom] || []).filter(function (o) { return !q.optionsFilter || q.optionsFilter(o, a); }).concat(q.extra || []);
  }
  function formEl(ans, mode, onChange) {
    var a = ans.answers = ans.answers || {};
    var box = el('div');
    var n = 0, conds = [];
    function paint() {
    box.innerHTML = ''; n = 0; conds = [];
    PICK = pickOf(a);
    G.sections.forEach(function (s) {
      if (mode === 'read' && !shows(s, a)) return;
      var sec = el('section', 'g10-sec', '<h2>' + (s.when ? '' : (++n) + '. ') + esc(nm(s.title)) + '</h2>');
      if (s.when) { conds.push({ el: sec, item: s }); if (mode === 'preview') sec.insertAdjacentHTML('afterbegin', '<p class="g10-cond">' + esc(s.whenLabel || (G.conds || {})[s.when] || ('Shown only if they answer the big question ' + (s.when === 'noexam' ? '“No”' : '“Yes” or “Not decided”'))) + '</p>'); }
      s.qs.forEach(function (q) {
        if (mode === 'read' && !shows(q, a)) return;
        var row = el('div', 'g10-q', (q.when && q.whenLabel && mode === 'preview' ? '<p class="g10-cond">' + esc(q.whenLabel) + '</p>' : '') + '<p>' + esc(nm(q.text)) + (q.optional && !T.hideOptional ? ' <small>(optional)</small>' : '') + '</p>' + (q.hint && mode !== 'read' && !(q.optionsFrom && q.emptyHint && !optsOf(q, a).length) ? '<p class="g10-hint">' + esc(nm(q.hint)) + '</p>' : ''));
        row.dataset.q = q.id;
        if (q.when) conds.push({ el: row, item: q });
        if (mode === 'read') {
          var v = a[q.id];
          row.appendChild(el('p', 'g10-ans' + (filled(v) ? '' : ' is-blank'), filled(v) ? esc(Array.isArray(v) ? v.join(', ') : v) : 'No answer'));
          if (q.check && filled(v) && q.check(v)) row.appendChild(el('p', 'g10-warn', esc(T.flagNote || 'Flagged.')));
          if (q.why && filled(a[q.id + '_why'])) row.appendChild(el('p', 'g10-ans', '<b>Why:</b> ' + esc(a[q.id + '_why'])));
        } else if (q.kind === 'text') {
          var ta = el('textarea');
          ta.value = a[q.id] || '';
          ta.setAttribute('aria-label', nm(q.text));
          ta.addEventListener('input', function () { a[q.id] = ta.value; row.classList.remove('is-missing'); warn(); onChange(); });
          row.appendChild(ta);
          // q.check(answer): a message when the answer isn't the kind we
          // want (e.g. watching rather than doing); it must be changed.
          var wn = el('p', 'g10-warn');
          var warn = function () { var m = q.check ? q.check(a[q.id] || '') : ''; wn.textContent = m || ''; wn.hidden = !m; };
          row.appendChild(wn);
          warn();
        } else {
          var opts = el('div', 'g10-opts'), qo = optsOf(q, a);
          if (q.optionsFrom && !optsOf(q, a).length && q.emptyHint) row.appendChild(el('p', 'g10-hint', esc(q.emptyHint)));
          qo.forEach(function (o) {
            var on = q.kind === 'many' ? (a[q.id] || []).indexOf(o) !== -1 : a[q.id] === o;
            var b = el('button', 'g10-opt' + (on ? ' is-on' : ''), esc(o));
            b.type = 'button';
            b.setAttribute('aria-pressed', on);
            b.addEventListener('click', function () {
              if (q.kind === 'many') {
                var list = (a[q.id] || []).slice(), i = list.indexOf(o);
                if (i === -1) list.push(o); else list.splice(i, 1);
                a[q.id] = list;
              } else a[q.id] = a[q.id] === o ? '' : o;
              if (q.rerender) {
                // Answers whose choices came from this one: drop a choice
                // that's no longer there, then draw the form again.
                G.sections.forEach(function (s2) { s2.qs.forEach(function (q2) {
                  if (q2.optionsFrom && a[q2.id] && optsOf(q2, a).indexOf(a[q2.id]) === -1) a[q2.id] = '';
                }); });
                paint(); onChange(); return;
              }
              Array.prototype.forEach.call(opts.children, function (x, j) {
                var y = qo[j], is = q.kind === 'many' ? a[q.id].indexOf(y) !== -1 : a[q.id] === y;
                x.classList.toggle('is-on', is); x.setAttribute('aria-pressed', is);
              });
              row.classList.remove('is-missing');
              if (q.id === 'route') refresh();
              onChange();
            });
            opts.appendChild(b);
          });
          row.appendChild(opts);
          if (q.why) {
            var w = el('textarea', 'g10-why');
            w.placeholder = q.why;
            w.setAttribute('aria-label', q.why);
            w.value = a[q.id + '_why'] || '';
            w.addEventListener('input', function () { a[q.id + '_why'] = w.value; onChange(); });
            row.appendChild(w);
          }
        }
        sec.appendChild(row);
      });
      box.appendChild(sec);
    });
    refresh();
    }
    // Show the sections for the answer to the big question.
    function refresh() { conds.forEach(function (c) { c.el.hidden = !shows(c.item, a, mode === 'preview'); }); }
    paint();
    return box;
  }

  /* ---------- the family ---------- */

  function renderKid(kid) {
    NAME = kid.name;
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../index.html">&larr; Term 3</a>'));
    var head = el('div', 'eot2-form-header', '<div><h1>' + esc(G.title) + '</h1><div class="eot2-sub">' + esc(nm(T.sub)) + '</div></div>');
    var status = el('div', 'eot2-status eot2-status-offline', 'Loading…');
    head.appendChild(status);
    app.appendChild(head);
    var body = el('div', 'g10-body');
    app.appendChild(body);
    function setStatus(mode, t) { status.className = 'eot2-status eot2-status-' + mode; status.textContent = t; }
    Promise.all([fetchApproval(), window.eot2Fetch(kid.group, kid.slug, KEY)]).then(function (r) {
      var ap = r[0];
      if (!ap.approved || (ap.kids || []).indexOf(kid.slug) === -1) { location.replace('../index.html'); return; }
      var ans = (r[1] && r[1].state) || {};
      setStatus('saved', ans._sent ? 'Sent' : 'Saved');
      if (ans._sent) {
        body.appendChild(el('p', 'g10-intro', esc(nm(T.thanks).replace('{date}', day(ans._sent)))));
        body.appendChild(formEl(ans, 'read'));
        return;
      }
      var timer = null;
      function save(now) {
        setStatus('saving', 'Saving…');
        if (timer) clearTimeout(timer);
        return new Promise(function (resolve) {
          timer = setTimeout(function () {
            window.eot2Save(kid.group, kid.slug, KEY, ans).then(function (res) {
              setStatus(res.ok ? 'saved' : 'offline', res.ok ? 'Saved' : 'Not saved — check the connection');
              resolve(res.ok);
            });
          }, now ? 0 : 700);
        });
      }
      body.appendChild(el('p', 'g10-intro', esc(nm(G.intro))));
      body.appendChild(formEl(ans, 'answer', function () { save(); }));
      var bar = el('div', 'g10-bar');
      var send = el('button', 'eot2-btn', esc(T.send));
      send.type = 'button';
      var msg = el('span', 'g10-msg');
      send.addEventListener('click', function () {
        var miss = allQs(ans.answers).filter(function (q) { var v = ans.answers[q.id]; return (!q.optional && !filled(v)) || (q.check && filled(v) && q.check(v)); });
        Array.prototype.forEach.call(document.querySelectorAll('.g10-q'), function (x) { x.classList.toggle('is-missing', miss.some(function (q) { return q.id === x.dataset.q; })); });
        if (miss.length) {
          msg.textContent = 'Please answer or change ' + (miss.length === 1 ? 'the question' : 'the ' + miss.length + ' questions') + ' outlined in red first.';
          document.querySelector('.g10-q.is-missing').scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        if (!confirm('Send your answers? You can’t change them after this.')) return;
        ans._sent = new Date().toISOString();
        send.disabled = true;
        save(true).then(function (ok) {
          if (ok) { renderKid(kid); window.scrollTo(0, 0); return; }
          delete ans._sent; send.disabled = false;
          msg.textContent = 'Not sent — check the connection and try again.';
        });
      });
      bar.appendChild(send);
      bar.appendChild(msg);
      body.appendChild(bar);
    });
  }

  /* ---------- staff ---------- */

  function renderStaff() {
    var STAFF = '';
    try { STAFF = localStorage.getItem('rj-staff-name') || ''; } catch (e) {}
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/term-3/index.html">&larr; Term 3</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>' + esc(G.title) + '</h1><p>' + esc(T.staffIntro) + '</p>'));
    var body = el('div', 'g10-body', '<p class="g10-intro">Loading…</p>');
    app.appendChild(body);
    var kids = window.EOT2_KIDS.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    Promise.all([fetchApproval()].concat(kids.map(function (k) { return window.eot2Fetch(k.group, k.slug, KEY); }))).then(function (r) {
      var ap = r[0], answers = r.slice(1).map(function (x) { return (x && x.state) || {}; });
      ap.kids = ap.kids || T.defaultKids.slice();
      body.innerHTML = '';
      // Approval and who sees it.
      var card = el('section', 'g10-staff');
      function paintCard() {
        card.innerHTML = '<h2>' + (ap.approved ? 'OK’d' + (ap.by ? ' by ' + esc(ap.by) : '') + (ap.at ? ' on ' + day(ap.at) : '') + ': these ' + T.many + ' can see it' : 'Not OK’d yet: no ' + T.one + ' can see it') + '</h2>' +
          '<p>Choose ' + esc(T.who) + ', then OK it. They’ll find it on ' + (T.one === 'family' ? 'their child’s' : 'their') + ' Term 3 page.</p>';
        var list = el('div', 'g10-kids');
        kids.forEach(function (k) {
          var lb = el('label', '', '<input type="checkbox"' + (ap.kids.indexOf(k.slug) !== -1 ? ' checked' : '') + '> ' + esc(k.name));
          lb.querySelector('input').addEventListener('change', function () {
            var i = ap.kids.indexOf(k.slug);
            if (this.checked && i === -1) ap.kids.push(k.slug); else if (!this.checked && i !== -1) ap.kids.splice(i, 1);
            store(ap.approved ? 'Saved.' : '');
          });
          list.appendChild(lb);
        });
        card.appendChild(list);
        var bar = el('div', 'g10-bar');
        var b = el('button', ap.approved ? 'eot2-btn eot2-btn-secondary' : 'eot2-btn', ap.approved ? 'Hide it again' : 'OK it and show it to these ' + T.many);
        b.type = 'button';
        var msg = el('span', 'g10-msg');
        b.addEventListener('click', function () {
          if (!ap.approved && !ap.kids.length) { msg.textContent = 'Choose at least one ' + T.one + ' first.'; return; }
          ap.approved = !ap.approved;
          ap.by = STAFF; ap.at = new Date().toISOString();
          store(ap.approved ? 'Shown to ' + ap.kids.length + ' ' + (ap.kids.length > 1 ? T.many : T.one) + '.' : 'Hidden.');
        });
        bar.appendChild(b); bar.appendChild(msg);
        card.appendChild(bar);
        function store(note) {
          msg.className = 'g10-msg'; msg.textContent = 'Saving…';
          window.eot2Save('term-3', 'staff', APPROVAL, ap).then(function (res) {
            if (!res.ok) { msg.textContent = 'Not saved — check the connection and try again.'; return; }
            paintCard();
            var m = card.querySelector('.g10-msg'); if (note) { m.textContent = note; m.className = 'g10-msg is-ok'; }
            paintTabs();
          });
        }
      }
      body.appendChild(card);
      paintCard();
      // Preview, and each chosen family's answers.
      var tabs = el('div', 'g10-tabs'), view = el('div');
      body.appendChild(tabs);
      body.appendChild(view);
      var shown = 'preview';
      function paintTabs() {
        tabs.innerHTML = '';
        var list = [['preview', 'Preview']].concat(kids.filter(function (k, i) { return ap.kids.indexOf(k.slug) !== -1 || filled(answers[i].answers && Object.keys(answers[i].answers)); }).map(function (k) { return [k.slug, k.name]; }));
        list.forEach(function (t) {
          var b = el('button', 'g10-tab' + (t[0] === shown ? ' is-on' : ''), esc(t[1]));
          b.type = 'button';
          b.addEventListener('click', function () { shown = t[0]; paintTabs(); });
          tabs.appendChild(b);
        });
        view.innerHTML = '';
        if (shown === 'preview') {
          NAME = G.previewName || 'your child';
          view.appendChild(el('p', 'g10-intro', esc(T.previewNote) + ' Try it out here; nothing is saved. <br>' + esc(nm(G.intro))));
          view.appendChild(formEl({}, 'preview', function () {}));
          return;
        }
        var i = kids.map(function (k) { return k.slug; }).indexOf(shown), a = answers[i];
        NAME = kids[i].name;
        view.appendChild(el('p', '', a._sent ? '<span class="g10-pill is-ok">Sent ' + day(a._sent) + '</span>' : a.answers && Object.keys(a.answers).length ? '<span class="g10-pill">Started, not sent yet</span>' : '<span class="g10-pill">Not started</span>'));
        view.appendChild(formEl(a, 'read'));
      }
      paintTabs();
    });
  }

  if (params.get('view') === 'staff') {
    var staff = null;
    try { staff = localStorage.getItem('rj-staff-name'); } catch (e) {}
    if (!staff) { location.replace('../../index.html'); return; }
    renderStaff();
    return;
  }
  var kid = window.EOT2_signedInKid();
  if (kid) renderKid(kid); else window.EOT2_leaveWithoutKid('index.html?view=staff', '../../index.html');
})();
