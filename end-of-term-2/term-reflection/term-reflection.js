/* Term Reflection. Riser view: their own form (signed in via Home).
   Staff view (?view=staff&kid=<slug>, from the Term 2 Conference status
   table): that Riser's answers, view-only — it's the Riser's own
   reflection, so staff can read it but not change it. */
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

  function showKidGate() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>'));
    var card = el('div', 'eot2-picker');
    card.innerHTML =
      '<h1>Term Reflection</h1>' +
      '<p>Enter your name to start your end-of-term reflection.</p>' +
      '<div class="eot2-field"><label for="kid-name">Your name</label><input id="kid-name" type="text" autocomplete="off" /></div>' +
      '<p class="eot2-msg" id="kid-msg"></p>' +
      '<button class="eot2-btn" id="kid-go">Continue</button>';
    app.appendChild(card);
    document.getElementById('kid-go').addEventListener('click', function () {
      var name = document.getElementById('kid-name').value.trim();
      var kid = window.EOT2_findKidByName(name);
      var msg = document.getElementById('kid-msg');
      if (!name) { msg.textContent = 'Type your name to continue.'; return; }
      if (!kid) { msg.textContent = "Couldn't find that name — check with your facilitator."; return; }
      try { localStorage.setItem(KID_KEY, kid.name); } catch (e) {}
      resolveAgeBand(kid);
    });
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

    var crumb = el('div', 'eot2-crumb', staffView
      ? '<a href="../../staff/index.html">Home</a> &middot; <a href="../staff/index.html">Term 2 Conference</a>'
      : '<a href="../../index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>');
    app.appendChild(crumb);

    var header = el('div', 'eot2-form-header');
    header.innerHTML =
      '<div><h1>Term Reflection &mdash; ' + kid.name + '</h1>' +
        (staffView ? '<div class="eot2-sub">' + kid.name + '’s own answers — view only</div>' : '') + '</div>' +
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

    if (staffView) {
      Array.prototype.forEach.call(form.querySelectorAll('input, textarea'), function (i) { i.disabled = true; });
      form.classList.add('eot2-readonly');
    } else {
      var footer = el('div', 'eot2-footer-actions');
      var saveBtn = el('button', 'eot2-btn eot2-btn-secondary', 'Save now');
      saveBtn.addEventListener('click', function () {
        setStatus('saving');
        window.eot2SaveLocal(WEEK_KEY, kid.slug, state);
        window.eot2Save(kid.group, kid.slug, WEEK_KEY, state).then(function (res) { setStatus(res.ok ? 'saved' : 'offline'); });
      });
      footer.appendChild(saveBtn);
      app.appendChild(footer);
    }

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

    updateProgress();
    window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
      if (staffView) {
        // Only what the Riser actually saved — never this device's local copy.
        applyState(data && data.state);
        var st = document.getElementById('save-status');
        st.className = 'eot2-status eot2-status-offline';
        st.textContent = data ? 'View only' : 'Not started yet';
        return;
      }
      var local = window.eot2LoadLocal(WEEK_KEY, kid.slug);
      applyState((data && data.state) || local);
      setStatus(data ? 'saved' : (local ? 'offline' : 'saved'));
    });
  }

  function showStaffPicker() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/index.html">Home</a> &middot; <a href="../staff/index.html">Term 2 Conference</a>'));
    var card = el('div', 'eot2-picker');
    var options = window.EOT2_KIDS.map(function (k) { return '<option value="' + k.slug + '">' + k.name + '</option>'; }).join('');
    card.innerHTML =
      '<h1>Term Reflection</h1>' +
      '<p>Choose whose reflection to read.</p>' +
      '<div class="eot2-field"><label for="kid-select">Riser</label><select id="kid-select">' + options + '</select></div>' +
      '<button class="eot2-btn" id="kid-go">Open</button>';
    app.appendChild(card);
    document.getElementById('kid-go').addEventListener('click', function () {
      location.href = 'index.html?view=staff&kid=' + document.getElementById('kid-select').value;
    });
  }

  if (staffView) {
    var picked = params.get('kid') ? window.EOT2_findKid(params.get('kid')) : null;
    if (picked) resolveAgeBand(picked); else showStaffPicker();
    return;
  }
  var savedName = null;
  try { savedName = localStorage.getItem(KID_KEY); } catch (e) {}
  var kid = savedName ? (window.EOT2_findKid(String(savedName).toLowerCase()) || window.EOT2_findKidByName(savedName)) : null;
  if (kid) { resolveAgeBand(kid); } else { showKidGate(); }
})();
