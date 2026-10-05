(function () {
  var KID_KEY = 'imm-l3-kid';
  var WEEK_KEY = 'term2-mom';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var editAs = params.get('editAs'); // 'jeran' | 'nishitha' | 'blessy' when staff is writing one

  var STAFF_AUTHORS = ['Jeran', 'Nishitha', 'Blessy'];

  var MOM_FIELDS = [
    { id: 'brief', label: 'This term, in brief', hint: 'A couple of lines on how the term went.' },
    { id: 'next', label: 'What to expect next term', hint: "What's coming, what'll be different or continue." },
    { id: 'focus', label: 'Focus for next term', hint: 'One or two things to watch for or work on.' }
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function showStaffPicker() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>'));
    var card = el('div', 'eot2-picker');
    var kidOptions = window.EOT2_KIDS.map(function (k) { return '<option value="' + k.slug + '">' + k.name + '</option>'; }).join('');
    card.innerHTML =
      '<h1>Minutes of Meeting</h1>' +
      '<p>Writing as <strong>' + editAs + '</strong>. Choose which kid\'s conference this is.</p>' +
      '<div class="eot2-field"><label for="kid-select">Kid</label><select id="kid-select">' + kidOptions + '</select></div>' +
      '<button class="eot2-btn" id="kid-go">Open</button>';
    app.appendChild(card);
    document.getElementById('kid-go').addEventListener('click', function () {
      var kid = window.EOT2_findKid(document.getElementById('kid-select').value);
      window.EOT2_setLastStaffKid(kid.slug);
      renderEditForm(kid);
    });
  }

  function renderEditForm(kid) {
    app.innerHTML = '';
    var crumb = el('div', 'eot2-crumb', '<a href="../../staff/index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a> &middot; <a href="index.html?editAs=' + editAs + '&pick=1">switch kid</a>');
    app.appendChild(crumb);

    var header = el('div', 'eot2-form-header');
    header.innerHTML =
      '<div><h1>MOM &mdash; ' + kid.name + '</h1><div class="eot2-sub">Written by ' + editAs + '</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>';
    app.appendChild(header);

    var form = el('div');
    app.appendChild(form);
    var state = {};
    var textareas = {};

    function setStatus(mode) {
      var e2 = document.getElementById('save-status');
      e2.className = 'eot2-status eot2-status-' + mode;
      e2.textContent = mode === 'saved' ? 'Saved' : mode === 'saving' ? 'Saving…' : 'Not synced';
    }
    var saveTimer = null;
    function scheduleSave() {
      state.author = editAs;
      window.eot2SaveLocal(WEEK_KEY, kid.slug, state);
      setStatus('saving');
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        window.eot2Save(kid.group, kid.slug, WEEK_KEY, state).then(function (res) { setStatus(res.ok ? 'saved' : 'offline'); });
      }, 1200);
    }

    MOM_FIELDS.forEach(function (f) {
      var field = el('div', 'eot2-mom-field');
      field.appendChild(el('label', null, f.label));
      field.appendChild(el('p', 'eot2-mom-hint', f.hint));
      var ta = el('textarea', 'eot2-textarea');
      ta.addEventListener('input', function () { state[f.id] = ta.value; scheduleSave(); });
      textareas[f.id] = ta;
      field.appendChild(ta);
      form.appendChild(field);
    });

    var footer = el('div', 'eot2-footer-actions');
    var saveBtn = el('button', 'eot2-btn eot2-btn-secondary', 'Save now');
    saveBtn.addEventListener('click', function () {
      setStatus('saving');
      state.author = editAs;
      window.eot2SaveLocal(WEEK_KEY, kid.slug, state);
      window.eot2Save(kid.group, kid.slug, WEEK_KEY, state).then(function (res) { setStatus(res.ok ? 'saved' : 'offline'); });
    });
    footer.appendChild(saveBtn);
    app.appendChild(footer);

    window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
      var local = window.eot2LoadLocal(WEEK_KEY, kid.slug);
      var loaded = (data && data.state) || local;
      if (loaded) {
        state = loaded;
        MOM_FIELDS.forEach(function (f) { if (state[f.id]) textareas[f.id].value = state[f.id]; });
      }
      setStatus(data ? 'saved' : (local ? 'offline' : 'saved'));
    });
  }

  function showKidGate() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>'));
    var card = el('div', 'eot2-picker');
    card.innerHTML =
      '<h1>Minutes of Meeting</h1>' +
      '<p>Enter your name to see what came out of your end-of-term conference.</p>' +
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
      renderReadOnly(kid);
    });
  }

  function renderReadOnly(kid) {
    app.innerHTML = '';
    var crumb = el('div', 'eot2-crumb', '<a href="../../index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>');
    app.appendChild(crumb);

    var head = el('div', 'eot2-head');
    head.innerHTML = '<h1>Minutes of Meeting</h1><p>What came out of ' + kid.name + "'s end-of-term conference.</p>";
    app.appendChild(head);

    var body = el('div', null, '<p class="eot2-msg">Loading&hellip;</p>');
    app.appendChild(body);

    window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
      var state = data && data.state;
      body.innerHTML = '';
      if (!state) {
        body.appendChild(el('p', 'eot2-msg', "Not written up yet — check back after your conference."));
        return;
      }
      MOM_FIELDS.forEach(function (f) {
        var field = el('div', 'eot2-mom-field');
        field.appendChild(el('label', null, f.label));
        field.appendChild(el('p', null, state[f.id] ? escapeHtml(state[f.id]).replace(/\n/g, '<br>') : '<span class="eot2-mom-hint">Not filled in yet.</span>'));
        body.appendChild(field);
      });
    });
  }

  if (editAs) {
    if (STAFF_AUTHORS.map(function (s) { return s.toLowerCase(); }).indexOf(editAs.toLowerCase()) === -1) {
      app.innerHTML = '<p class="eot2-msg">Unknown author "' + editAs.replace(/[<>&]/g, '') + '".</p>';
      return;
    }
    var deepLinkSlug = params.get('kid');
    var forcePicker = params.get('pick') === '1';
    var pickedKid = forcePicker ? null : ((deepLinkSlug ? window.EOT2_findKid(deepLinkSlug) : null) || window.EOT2_getLastStaffKid());
    if (pickedKid) {
      window.EOT2_setLastStaffKid(pickedKid.slug);
      renderEditForm(pickedKid);
    } else {
      showStaffPicker();
    }
  } else {
    var savedName = null;
    try { savedName = localStorage.getItem(KID_KEY); } catch (e) {}
    var kid = savedName ? window.EOT2_findKidByName(savedName) : null;
    if (kid) { renderReadOnly(kid); } else { showKidGate(); }
  }
})();
