/* Term Reflection. Riser view: their own form (signed in via Home).
   Staff view (?view=staff&kid=<slug>, from the Term 2 Conference status
   table): that Riser's answers as a plain read-out — each question and
   what they answered, nothing to pick or change. ?view=staff alone lists
   every Riser. */
(function () {
  var KID_KEY = 'imm-l3-kid';
  var WEEK_KEY = 'term2-term-reflection';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var staffView = params.get('view') === 'staff';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function resolveAgeBand(kid) {
    // Internal detail only — never surfaced to the kid. A kid missing from
    // the roster's age mapping silently gets the 8-10 question set rather
    // than being asked to pick one themselves.
    renderForm(kid, (kid.ageBand === '11-13') ? '11-13' : '8-10');
  }

  function renderForm(kid, band) {
    app.innerHTML = '';
    var total = window.EOT2_REFLECTION_ITEM_COUNT(band);

    var crumb = el('div', 'eot2-crumb', '<a href="../../index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>');
    app.appendChild(crumb);

    var header = el('div', 'eot2-form-header');
    header.innerHTML =
      '<div><h1>Term Reflection &mdash; ' + kid.name + '</h1></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>';
    app.appendChild(header);

    var progressLine = el('p', 'eot2-progress-line', '');
    app.appendChild(progressLine);

    var form = el('div');
    app.appendChild(form);

    var state = {};
    var fieldRefs = {}; // qid -> { type: 'choice', inputs: [el,...] } | { type: 'matrix', rowInputs: { rowLabel: [el,...] } } | { type: 'text', textarea: el }

    function answeredCount() {
      return Object.keys(state).filter(function (k) { return state[k] && String(state[k]).trim(); }).length;
    }
    function updateProgress() { progressLine.textContent = answeredCount() + ' of ' + total + ' answered'; }
    function setStatus(mode) {
      var e2 = document.getElementById('save-status');
      e2.className = 'eot2-status eot2-status-' + mode;
      e2.textContent = mode === 'saved' ? 'Saved' : mode === 'saving' ? 'Saving…' : 'Not synced';
    }

    var saveTimer = null;
    function scheduleSave() {
      window.eot2SaveLocal(WEEK_KEY, kid.slug, state);
      updateProgress();
      setStatus('saving');
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        window.eot2Save(kid.group, kid.slug, WEEK_KEY, state).then(function (res) { setStatus(res.ok ? 'saved' : 'offline'); });
      }, 1200);
    }

    window.EOT2_REFLECTION[band].sections.forEach(function (section) {
      var sEl = el('div', 'eot2-section');
      sEl.appendChild(el('h2', 'eot2-section-title', section.heading));
      section.questions.forEach(function (q) {
        var card = el('div', 'eot2-question');
        card.appendChild(el('p', 'eot2-question-text', q.text));
        if (q.type === 'choice') {
          var choices = el('div', 'eot2-choices');
          var choiceInputs = [];
          q.options.forEach(function (opt) {
            var label = el('label');
            var input = document.createElement('input');
            input.type = 'radio'; input.name = q.id; input.value = opt;
            label.appendChild(input);
            label.appendChild(el('span', null, opt));
            input.addEventListener('change', function () { state[q.id] = opt; scheduleSave(); });
            choiceInputs.push(input);
            choices.appendChild(label);
          });
          fieldRefs[q.id] = { type: 'choice', inputs: choiceInputs };
          card.appendChild(choices);
        } else if (q.type === 'matrix') {
          var table = el('table', 'eot2-matrix');
          var thead = '<tr><th></th>' + q.scale.map(function (s) { return '<th>' + s + '</th>'; }).join('') + '</tr>';
          table.innerHTML = thead;
          var rowInputs = {};
          q.rows.forEach(function (row, ri) {
            var tr = document.createElement('tr');
            tr.appendChild(el('td', null, row));
            rowInputs[row] = [];
            q.scale.forEach(function (s) {
              var td = document.createElement('td');
              var input = document.createElement('input');
              input.type = 'radio'; input.name = q.id + '-' + ri; input.value = s;
              input.addEventListener('change', function () {
                state[q.id] = state[q.id] || {};
                state[q.id][row] = s;
                scheduleSave();
              });
              rowInputs[row].push(input);
              td.appendChild(input);
              tr.appendChild(td);
            });
            table.appendChild(tr);
          });
          fieldRefs[q.id] = { type: 'matrix', rowInputs: rowInputs };
          card.appendChild(table);
        } else if (q.type === 'text') {
          var ta = el('textarea', 'eot2-textarea');
          ta.addEventListener('input', function () { state[q.id] = ta.value; scheduleSave(); });
          fieldRefs[q.id] = { type: 'text', textarea: ta };
          card.appendChild(ta);
        }
        sEl.appendChild(card);
      });
      form.appendChild(sEl);
    });

    var footer = el('div', 'eot2-footer-actions');
    var saveBtn = el('button', 'eot2-btn eot2-btn-secondary', 'Save now');
    saveBtn.addEventListener('click', function () {
      setStatus('saving');
      window.eot2SaveLocal(WEEK_KEY, kid.slug, state);
      window.eot2Save(kid.group, kid.slug, WEEK_KEY, state).then(function (res) { setStatus(res.ok ? 'saved' : 'offline'); });
    });
    footer.appendChild(saveBtn);
    app.appendChild(footer);

    function applyState(loaded) {
      if (!loaded) return;
      state = loaded;
      Object.keys(state).forEach(function (id) {
        var ref = fieldRefs[id];
        var val = state[id];
        if (!ref || val === undefined || val === null) return;
        if (ref.type === 'choice') {
          var match = ref.inputs.filter(function (i) { return i.value === val; })[0];
          if (match) match.checked = true;
        } else if (ref.type === 'matrix') {
          Object.keys(val).forEach(function (row) {
            var rowSet = ref.rowInputs[row];
            if (!rowSet) return;
            var match = rowSet.filter(function (i) { return i.value === val[row]; })[0];
            if (match) match.checked = true;
          });
        } else if (ref.type === 'text') {
          ref.textarea.value = val;
        }
      });
      updateProgress();
    }

    // Once every question is answered (every row of a grid, every written
    // answer filled in), the reflection is final: arriving at it again
    // shows the answers with nothing left to change.
    function isComplete() {
      var all = true;
      window.EOT2_REFLECTION[band].sections.forEach(function (section) {
        section.questions.forEach(function (q) {
          var v = state[q.id];
          if (q.type === 'matrix') {
            if (!v || q.rows.some(function (row) { return !v[row]; })) all = false;
          } else if (!v || !String(v).trim()) {
            all = false;
          }
        });
      });
      return all;
    }
    function lockIfComplete() {
      if (!isComplete()) return;
      Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function (i) {
        if (i.tagName === 'TEXTAREA') i.readOnly = true; else i.disabled = true;
      });
      form.classList.add('eot2-locked');
      footer.remove();
    }

    updateProgress();
    window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
      var local = window.eot2LoadLocal(WEEK_KEY, kid.slug);
      applyState((data && data.state) || local);
      setStatus(data ? 'saved' : (local ? 'offline' : 'saved'));
      lockIfComplete();
    });
  }

  /* ---------- staff: read the Riser's answers ---------- */

  function escapeHtml(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Each question with just the Riser's answer — no options to pick from.
  function renderStaffAnswers(kid, band) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../staff/index.html">Term 2 Conference</a> &middot; <a href="index.html?view=staff">All Risers</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>Term Reflection &mdash; ' + kid.name + '</h1><p class="ans-lede">&nbsp;</p>'));
    var body = el('div', 'ans-body', '<p class="ans-none">Loading…</p>');
    app.appendChild(body);

    window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
      var st = (data && data.state) || {};
      var total = window.EOT2_REFLECTION_ITEM_COUNT(band);
      var answered = Object.keys(st).filter(function (k) {
        var v = st[k];
        return v && (typeof v === 'object' ? Object.keys(v).length : String(v).trim());
      }).length;
      app.querySelector('.ans-lede').textContent = data
        ? kid.name + ' answered ' + answered + ' of ' + total + ' questions.'
        : kid.name + ' hasn’t started their reflection yet.';
      body.innerHTML = '';
      if (!data) return;

      window.EOT2_REFLECTION[band].sections.forEach(function (section) {
        var sEl = el('section', 'ans-section');
        sEl.appendChild(el('h2', 'eot2-section-title', section.heading));
        var card = el('div', 'ans-card');
        section.questions.forEach(function (q) {
          var v = st[q.id];
          var answer;
          if (q.type === 'matrix') {
            var rows = q.rows.filter(function (r) { return v && v[r]; });
            answer = rows.length
              ? '<dl class="ans-matrix">' + rows.map(function (r) { return '<dt>' + escapeHtml(r) + '</dt><dd>' + escapeHtml(v[r]) + '</dd>'; }).join('') + '</dl>'
              : '<span class="ans-none">Not answered</span>';
          } else if (v && String(v).trim()) {
            answer = '<span class="ans-value' + (q.type === 'text' ? ' is-text' : '') + '">' + escapeHtml(v).replace(/\n/g, '<br>') + '</span>';
          } else {
            answer = '<span class="ans-none">Not answered</span>';
          }
          card.appendChild(el('div', 'ans-row', '<p class="ans-q">' + escapeHtml(q.text) + '</p><div class="ans-a">' + answer + '</div>'));
        });
        sEl.appendChild(card);
        body.appendChild(sEl);
      });
    });
  }

  function showStaffRoster() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../staff/index.html">Term 2 Conference</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>Term Reflections</h1><p>Each Riser’s own reflection on the term.</p>'));
    var list = el('div', 'ans-list');
    window.EOT2_KIDS.forEach(function (k) {
      var a = el('a', 'ans-list-row', '<strong>' + k.name + '</strong><span>&nbsp;</span><em aria-hidden="true">&rarr;</em>');
      a.href = 'index.html?view=staff&kid=' + k.slug;
      list.appendChild(a);
      window.eot2Fetch(k.group, k.slug, WEEK_KEY).then(function (d) {
        a.querySelector('span').textContent = d ? 'Answered' : 'Not started';
      });
    });
    app.appendChild(list);
  }

  if (staffView) {
    var picked = params.get('kid') ? window.EOT2_findKid(params.get('kid')) : null;
    if (picked) renderStaffAnswers(picked, picked.ageBand === '11-13' ? '11-13' : '8-10');
    else showStaffRoster();
    return;
  }
  var kid = window.EOT2_signedInKid();
  if (kid) { resolveAgeBand(kid); } else { window.EOT2_leaveWithoutKid('index.html?view=staff', '../../index.html'); }
})();
