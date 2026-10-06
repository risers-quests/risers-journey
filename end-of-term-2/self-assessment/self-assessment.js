(function () {
  var KID_KEY = 'imm-l3-kid';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var rater = (params.get('rater') || 'self').toLowerCase();
  // Staff reading a Riser's own self-assessment (?rater=self&view=staff&kid=)
  // — view-only, with staff navigation.
  var staffViewingSelf = rater === 'self' && params.get('view') === 'staff';
  var isStaff = rater !== 'self';
  var staffRaterInfo = window.EOT2_STAFF_RATERS.filter(function (r) { return r.id === rater; })[0];

  if (isStaff && !staffRaterInfo) {
    app.innerHTML = '<p class="eot2-msg">Unknown rater "' + rater.replace(/[<>&]/g, '') + '". Check the link you used.</p>';
    return;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function showStaffPicker() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/index.html">Home</a> &middot; <a href="../staff/index.html">Term 2 Conference</a>'));
    var card = el('div', 'eot2-picker');
    var options = window.EOT2_KIDS.map(function (k) { return '<option value="' + k.slug + '">' + k.name + '</option>'; }).join('');
    card.innerHTML =
      '<h1>Self-Assessment</h1>' +
      '<p>Rating as <strong>' + staffRaterInfo.label + '</strong>. Choose which kid you\'re rating.</p>' +
      '<div class="eot2-field"><label for="kid-select">Kid</label><select id="kid-select">' + options + '</select></div>' +
      '<button class="eot2-btn" id="kid-go">Open form</button>';
    app.appendChild(card);
    document.getElementById('kid-go').addEventListener('click', function () {
      var kid = window.EOT2_findKid(document.getElementById('kid-select').value);
      window.EOT2_setLastStaffKid(kid.slug);
      renderForm(kid);
    });
  }

  function renderForm(kid) {
    var weekKey = 'term2-self-assessment-' + rater;
    app.innerHTML = '';

    var crumb = el('div', 'eot2-crumb', '<a href="' + (isStaff ? '../../staff/index.html' : '../../index.html') + '">Home</a> &middot; <a href="' + (isStaff ? '../staff/index.html' : '../index.html') + '">Term 2 Conference</a>' + (isStaff ? ' &middot; <a href="index.html?rater=' + rater + '&pick=1">switch kid</a>' : ''));
    app.appendChild(crumb);

    var header = el('div', 'eot2-form-header');
    header.innerHTML =
      '<div><h1>Self-Assessment &mdash; ' + kid.name + '</h1>' +
      '<div class="eot2-sub">Rated by ' + (isStaff ? staffRaterInfo.label : kid.name + ' (self)') + '</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>';
    app.appendChild(header);

    var progressLine = el('p', 'eot2-progress-line', '');
    app.appendChild(progressLine);

    var legend = el('div', 'eot2-scale-legend');
    legend.innerHTML = window.EOT2_RUBRIC_SCALE.map(function (opt) {
      return '<div class="eot2-scale-legend-item"><strong>' + opt.code + '</strong> &mdash; ' + opt.label + '<span>' + opt.desc + '</span></div>';
    }).join('');
    app.appendChild(legend);

    var form = el('div');
    app.appendChild(form);

    var state = {};

    // Only rubric items count — the consolidated record also carries a
    // _shared flag (set on the Consolidate page).
    function answeredCount() {
      return Object.keys(state).filter(function (k) { return k.charAt(0) !== '_' && state[k]; }).length;
    }
    function updateProgress() {
      progressLine.textContent = answeredCount() + ' of ' + window.EOT2_RUBRIC_ITEM_COUNT + ' answered';
    }
    function setStatus(mode) {
      var el2 = document.getElementById('save-status');
      el2.className = 'eot2-status eot2-status-' + mode;
      el2.textContent = mode === 'saved' ? 'Saved' : mode === 'saving' ? 'Saving…' : 'Not synced';
    }

    var saveTimer = null;
    function scheduleSave() {
      window.eot2SaveLocal(weekKey, kid.slug, state);
      updateProgress();
      setStatus('saving');
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        window.eot2Save(kid.group, kid.slug, weekKey, state).then(function (res) {
          setStatus(res.ok ? 'saved' : 'offline');
        });
      }, 1200);
    }

    window.EOT2_RUBRIC.forEach(function (section) {
      var sEl = el('div', 'eot2-section');
      sEl.appendChild(el('h2', 'eot2-section-title', section.title));
      section.subsections.forEach(function (sub) {
        if (sub.title) sEl.appendChild(el('h3', 'eot2-sub-title', sub.title));
        sub.items.forEach(function (item) {
          var row = el('div', 'eot2-item');
          row.appendChild(el('p', 'eot2-item-text', isStaff ? item.text : item.kidText));
          var scale = el('div', 'eot2-scale');
          window.EOT2_RUBRIC_SCALE.forEach(function (opt) {
            var label = el('label');
            label.title = opt.label + ' — ' + opt.desc;
            label.innerHTML = '<input type="radio" name="' + item.id + '" value="' + opt.code + '" /><span>' + opt.code + '</span>';
            var input = label.querySelector('input');
            input.addEventListener('change', function () {
              state[item.id] = opt.code;
              scheduleSave();
            });
            scale.appendChild(label);
          });
          row.appendChild(scale);
          sEl.appendChild(row);
        });
      });
      form.appendChild(sEl);
    });

    var footer = el('div', 'eot2-footer-actions');
    var saveBtn = el('button', 'eot2-btn eot2-btn-secondary', 'Save now');
    saveBtn.addEventListener('click', function () {
      setStatus('saving');
      window.eot2SaveLocal(weekKey, kid.slug, state);
      window.eot2Save(kid.group, kid.slug, weekKey, state).then(function (res) { setStatus(res.ok ? 'saved' : 'offline'); });
    });
    footer.appendChild(saveBtn);
    app.appendChild(footer);

    function applyState(loaded) {
      if (!loaded) return;
      state = loaded;
      Object.keys(state).forEach(function (id) {
        var input = form.querySelector('input[name="' + id + '"][value="' + state[id] + '"]');
        if (input) input.checked = true;
      });
      updateProgress();
    }

    updateProgress();
    window.eot2Fetch(kid.group, kid.slug, weekKey).then(function (data) {
      var local = window.eot2LoadLocal(weekKey, kid.slug);
      var remoteState = data && data.state;
      applyState(remoteState || local);
      setStatus(data ? 'saved' : (local ? 'offline' : 'saved'));
    });
  }

  // Staff reading a Riser's own self-assessment: each statement with the
  // rating they gave themselves — nothing to pick or change.
  function renderSelfRatings(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../staff/index.html">Term 2 Conference</a>'));
    app.appendChild(el('div', 'eot2-head', '<h1>Self-Assessment &mdash; ' + kid.name + '</h1><p class="ans-lede">&nbsp;</p>'));
    var body = el('div', 'ans-body', '<p class="ans-none">Loading…</p>');
    app.appendChild(body);
    window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-self').then(function (data) {
      var st = (data && data.state) || {};
      var rated = Object.keys(st).filter(function (k) { return k.charAt(0) !== '_' && st[k]; }).length;
      app.querySelector('.ans-lede').textContent = data
        ? kid.name + '’s own ratings — ' + rated + ' of ' + window.EOT2_RUBRIC_ITEM_COUNT + ' rated.'
        : kid.name + ' hasn’t started their self-assessment yet.';
      body.innerHTML = '';
      if (!data) return;
      var labels = {};
      window.EOT2_RUBRIC_SCALE.forEach(function (o) { labels[o.code] = o.label; });
      window.EOT2_RUBRIC.forEach(function (section) {
        var sEl = el('section', 'ans-section');
        sEl.appendChild(el('h2', 'eot2-section-title', section.title));
        section.subsections.forEach(function (sub) {
          if (sub.title) sEl.appendChild(el('h3', 'eot2-sub-title', sub.title));
          var card = el('div', 'ans-card');
          sub.items.forEach(function (item) {
            var v = st[item.id];
            card.appendChild(el('div', 'ans-row ans-row-inline',
              '<p class="ans-q">' + item.text + '</p>' +
              '<div class="ans-a">' + (v ? '<span class="ans-rating" title="' + labels[v] + '"><strong>' + v + '</strong>' + labels[v] + '</span>' : '<span class="ans-none">Not rated</span>') + '</div>'));
          });
          sEl.appendChild(card);
        });
        body.appendChild(sEl);
      });
    });
  }

  if (staffViewingSelf) {
    var viewKid = params.get('kid') ? window.EOT2_findKid(params.get('kid')) : null;
    if (viewKid) renderSelfRatings(viewKid);
    else app.innerHTML = '<p class="eot2-msg">Open a Riser’s self-assessment from the Term 2 Conference status table.</p>';
  } else if (isStaff) {
    var deepLinkSlug = params.get('kid');
    var forcePicker = params.get('pick') === '1';
    var pickedKid = forcePicker ? null : ((deepLinkSlug ? window.EOT2_findKid(deepLinkSlug) : null) || window.EOT2_getLastStaffKid());
    if (pickedKid) {
      window.EOT2_setLastStaffKid(pickedKid.slug);
      renderForm(pickedKid);
    } else {
      showStaffPicker();
    }
  } else {
    var kid = window.EOT2_signedInKid();
    if (kid) { renderForm(kid); } else { window.EOT2_leaveWithoutKid('../staff/index.html', '../../index.html'); }
  }
})();
