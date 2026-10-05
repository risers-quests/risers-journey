/* Term 2 Conference — Consolidate (staff). Turns Jeran's, Nishitha's and
   Blessy's self-assessment ratings for a Riser into one final rating per
   rubric item, then shares that result with the Riser.

   - Every item shows the three staff ratings side by side (plus the
     Riser's own, for reference) and a suggested final rating: the rating
     most of the staff chose, or the middle one when they all differ (the
     lower of the two when only two staff have rated and they differ).
   - Staff accept a suggestion or pick another rating with one tap;
     "Accept all suggestions" fills every undecided item at once, and a
     filter narrows the list to the items where the staff who rated it
     gave different ratings.
   - Saves into the same record the old "Consolidated (final)" rater form
     used (week key term2-self-assessment-consolidated), so the Term 2
     Conference status table keeps tracking it.
   - Nothing reaches the Riser until "Share with <name>" is switched on
     (stored as _shared in that record); the Riser's Term 2 Conference page
     shows the result only then.

   No ?kid=: every Riser, with how far their consolidation has got. */
(function () {
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var CONSOLIDATED_KEY = 'term2-self-assessment-consolidated';
  var STAFF = window.EOT2_STAFF_RATERS.filter(function (r) { return r.id !== 'consolidated'; });
  var SCALE = window.EOT2_RUBRIC_SCALE.map(function (o) { return o.code; }); // NE < E < D < CD
  var ITEMS = [];
  window.EOT2_RUBRIC.forEach(function (section) {
    section.subsections.forEach(function (sub) {
      sub.items.forEach(function (item) { ITEMS.push(item); });
    });
  });

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function head(eyebrow, title, lede) {
    return el('header', 'hd-page-head',
      '<p class="hd-eyebrow">' + eyebrow + '</p><h1>' + title + '</h1>' + (lede ? '<p>' + lede + '</p>' : ''));
  }

  function decidedCount(state) {
    return ITEMS.filter(function (item) { return state && state[item.id]; }).length;
  }

  // Suggested final rating from the staff ratings for one item, or null.
  function suggest(ratings) {
    var given = ratings.filter(Boolean);
    if (!given.length) return null;
    var counts = {};
    given.forEach(function (r) { counts[r] = (counts[r] || 0) + 1; });
    var top = Object.keys(counts).filter(function (r) { return counts[r] * 2 > given.length; })[0];
    if (top) return top;
    var sorted = given.slice().sort(function (a, b) { return SCALE.indexOf(a) - SCALE.indexOf(b); });
    return sorted[Math.floor((sorted.length - 1) / 2)];
  }
  // Whether the staff who have rated this item gave different ratings.
  function differs(ratings) {
    var given = ratings.filter(Boolean);
    return given.some(function (r) { return r !== given[0]; });
  }
  function flagHtml(ratings) {
    var given = ratings.filter(Boolean).length;
    if (!given) return '';
    if (differs(ratings)) return '<span class="hd-chip hd-chip-progress cs-flag">Differ</span>';
    if (given < STAFF.length) return '<span class="hd-chip hd-chip-new cs-flag">' + given + ' of ' + STAFF.length + ' rated</span>';
    return '<span class="hd-chip hd-chip-done cs-flag">Agreed</span>';
  }

  // Everything one Riser's consolidation needs: self, each staff rater, and
  // the consolidated record so far.
  function loadAll(kid) {
    var keys = ['self'].concat(STAFF.map(function (s) { return s.id; }));
    return Promise.all(keys.map(function (id) {
      return window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-' + id);
    }).concat([window.eot2Fetch(kid.group, kid.slug, CONSOLIDATED_KEY)])).then(function (r) {
      var out = { self: (r[0] && r[0].state) || {}, staff: {}, consolidated: (r[r.length - 1] && r[r.length - 1].state) || {} };
      STAFF.forEach(function (s, i) { out.staff[s.id] = (r[i + 1] && r[i + 1].state) || {}; });
      return out;
    });
  }

  /* ---------- every Riser ---------- */

  function renderRoster() {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="../staff/index.html">&larr; Term 2 Conference</a>'));
    app.appendChild(head('Term 2 Conference &middot; Self-assessment', 'Consolidate',
      'Bring the three staff ratings together into one final rating for each Riser, then share it with them.'));
    var list = el('div', 'hd-card sq-list');
    window.EOT2_KIDS.forEach(function (kid) {
      var row = el('a', 'sq-row');
      row.href = 'index.html?kid=' + kid.slug;
      row.innerHTML =
        '<span class="lh-avatar sq-avatar">' + kid.name.charAt(0) + '</span>' +
        '<span class="sq-name">' + kid.name + '</span>' +
        '<span class="sq-meta">&nbsp;</span>' +
        '<span class="sq-go" aria-hidden="true">&rarr;</span>';
      list.appendChild(row);
      loadAll(kid).then(function (d) {
        var rated = STAFF.filter(function (s) { return Object.keys(d.staff[s.id]).length; }).length;
        var decided = decidedCount(d.consolidated);
        var meta = row.querySelector('.sq-meta');
        if (d.consolidated._shared) { meta.textContent = 'Shared with ' + kid.name; meta.classList.add('is-done'); }
        else if (decided) meta.textContent = decided + ' of ' + ITEMS.length + ' decided';
        else meta.textContent = rated + ' of ' + STAFF.length + ' staff have rated';
      });
    });
    app.appendChild(list);
  }

  /* ---------- one Riser ---------- */

  function renderKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="index.html">&larr; All Risers</a>'));
    app.appendChild(head('Consolidate &middot; Self-assessment', kid.name));
    var body = el('div', 'cs-body', '<p class="cs-muted">Loading ratings…</p>');
    app.appendChild(body);

    loadAll(kid).then(function (d) {
      var state = d.consolidated;
      var onlyDisagreements = false;
      body.innerHTML = '';

      // ---- toolbar: progress, bulk accept, filter, share ----
      var bar = el('div', 'hd-card cs-bar');
      bar.innerHTML =
        '<div class="cs-progress"><strong class="cs-count"></strong><span class="cs-status"></span>' +
          '<span class="cs-track"><span class="cs-fill"></span></span></div>' +
        '<div class="cs-actions">' +
          '<button type="button" class="eot2-btn eot2-btn-secondary cs-accept-all">Accept all suggestions</button>' +
          '<label class="cs-toggle"><input type="checkbox" class="cs-filter"> Only where staff disagree</label>' +
        '</div>' +
        '<div class="cs-share">' +
          '<label class="cs-switch"><input type="checkbox" class="cs-share-input"><span class="cs-switch-ui" aria-hidden="true"></span>' +
          '<span class="cs-share-text"><strong>Share with ' + kid.name + '</strong><span></span></span></label>' +
        '</div>';
      body.appendChild(bar);
      var shareInput = bar.querySelector('.cs-share-input');
      shareInput.checked = !!state._shared;

      var saveTimer = null;
      function save() {
        window.eot2SaveLocal(CONSOLIDATED_KEY, kid.slug, state);
        bar.querySelector('.cs-status').textContent = 'Saving…';
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
          window.eot2Save(kid.group, kid.slug, CONSOLIDATED_KEY, state).then(function (res) {
            bar.querySelector('.cs-status').textContent = res.ok ? 'Saved' : 'Not saved — check connection';
          });
        }, 800);
      }
      function refreshBar() {
        var n = decidedCount(state);
        bar.querySelector('.cs-count').textContent = n + ' of ' + ITEMS.length + ' decided';
        bar.querySelector('.cs-fill').style.width = Math.round((n / ITEMS.length) * 100) + '%';
        var complete = n === ITEMS.length;
        shareInput.disabled = !complete && !state._shared;
        bar.querySelector('.cs-share-text span').textContent = state._shared
          ? kid.name + ' can see this on their Term 2 Conference page.'
          : complete ? 'Not visible to ' + kid.name + ' yet.' : 'Decide every item first.';
      }

      // ---- the items ----
      var list = el('div', 'cs-list');
      body.appendChild(list);
      var rows = [];
      window.EOT2_RUBRIC.forEach(function (section) {
        var sEl = el('section', 'cs-section');
        sEl.appendChild(el('h2', 'eot2-section-title', section.title));
        section.subsections.forEach(function (sub) {
          if (sub.title) sEl.appendChild(el('h3', 'eot2-sub-title', sub.title));
          sub.items.forEach(function (item) {
            var ratings = STAFF.map(function (s) { return d.staff[s.id][item.id] || null; });
            var suggestion = suggest(ratings);
            var row = el('div', 'hd-card cs-item');
            row.innerHTML =
              '<p class="cs-text">' + item.text + '</p>' +
              '<div class="cs-ratings">' +
                STAFF.map(function (s, i) {
                  return '<span class="cs-rating' + (ratings[i] ? '' : ' is-missing') + '"><small>' + s.label + '</small>' + (ratings[i] || '—') + '</span>';
                }).join('') +
                '<span class="cs-rating is-self"><small>' + kid.name + '</small>' + (d.self[item.id] || '—') + '</span>' +
                flagHtml(ratings) +
              '</div>' +
              '<div class="cs-final"><span class="cs-final-label">Final</span><div class="cs-pick"></div>' +
                (suggestion ? '<span class="cs-suggest">Suggested: <strong>' + suggestion + '</strong></span>' : '<span class="cs-suggest">No staff ratings yet</span>') +
              '</div>';
            var pick = row.querySelector('.cs-pick');
            SCALE.forEach(function (code) {
              var b = el('button', 'cs-opt' + (code === suggestion ? ' is-suggested' : ''), code);
              b.type = 'button';
              b.title = window.EOT2_RUBRIC_SCALE[SCALE.indexOf(code)].label;
              b.addEventListener('click', function () {
                state[item.id] = code;
                paint();
                refreshBar();
                save();
              });
              pick.appendChild(b);
            });
            function paint() {
              Array.prototype.forEach.call(pick.children, function (b) { b.classList.toggle('is-on', b.textContent === state[item.id]); });
              row.classList.toggle('is-decided', !!state[item.id]);
            }
            paint();
            rows.push({ el: row, item: item, suggestion: suggestion, differs: differs(ratings), paint: paint });
            sEl.appendChild(row);
          });
        });
        list.appendChild(sEl);
      });

      function applyFilter() {
        rows.forEach(function (r) { r.el.hidden = onlyDisagreements && !r.differs; });
        Array.prototype.forEach.call(list.querySelectorAll('.cs-section'), function (sEl) {
          sEl.hidden = !Array.prototype.some.call(sEl.querySelectorAll('.cs-item'), function (r) { return !r.hidden; });
        });
      }

      bar.querySelector('.cs-accept-all').addEventListener('click', function () {
        var n = 0;
        rows.forEach(function (r) {
          if (!state[r.item.id] && r.suggestion) { state[r.item.id] = r.suggestion; r.paint(); n++; }
        });
        refreshBar();
        if (n) save();
      });
      bar.querySelector('.cs-filter').addEventListener('change', function () {
        onlyDisagreements = this.checked;
        applyFilter();
      });
      shareInput.addEventListener('change', function () {
        state._shared = shareInput.checked;
        refreshBar();
        save();
      });

      refreshBar();
      bar.querySelector('.cs-status').textContent = '';
    });
  }

  var kid = params.get('kid') ? window.EOT2_findKid(params.get('kid')) : null;
  if (kid) renderKid(kid); else renderRoster();
})();
