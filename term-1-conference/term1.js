/* Term 1 Conference — each Riser's feedback from their Term 1 student-led
   conference: where staff have seen growth, what to focus on next term,
   and a note from their parents.

   The text itself is NOT in this repo (it's public, and this is personal
   feedback about named children). It lives in the progress Worker under
   the synthetic week key "term1-conference", the same way MOMs do. It was
   imported once from the private staff-data repo's term1-conference/
   page, and staff can edit it here afterwards.

   Kid view: the signed-in Riser's own notes.
   Staff view (?view=staff): every Riser, then one Riser's notes
   (&kid=<slug>), editable. */
(function () {
  var KID_KEY = 'imm-l3-kid';
  var STAFF_KEY = 'rj-staff-name';
  var WEEK_KEY = 'term1-conference';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var isStaff = params.get('view') === 'staff';

  var FIELDS = [
    { id: 'growth', kidLabel: 'Where we’ve seen growth', staffLabel: 'Area we have seen growth', tone: 'green' },
    { id: 'focus', kidLabel: 'What to focus on next term', staffLabel: 'Area to focus for next term', tone: 'slate' },
    { id: 'parents', kidLabel: 'From your parents', staffLabel: 'From parents', tone: 'rose' }
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hasNotes(state) {
    return !!state && FIELDS.some(function (f) { return state[f.id] && String(state[f.id]).trim(); });
  }
  function head(eyebrow, title, lede) {
    return el('header', 'hd-page-head',
      '<p class="hd-eyebrow">' + eyebrow + '</p><h1>' + title + '</h1>' + (lede ? '<p>' + lede + '</p>' : ''));
  }

  function notesHtml(state, labelKey) {
    return FIELDS.filter(function (f) { return state[f.id] && String(state[f.id]).trim(); }).map(function (f) {
      return '<section class="hd-card t1-note t1-tone-' + f.tone + '">' +
        '<h2>' + f[labelKey] + '</h2><p>' + escapeHtml(state[f.id]) + '</p></section>';
    }).join('');
  }

  /* ---------- kid ---------- */

  function renderKid(kid) {
    app.innerHTML = '';
    app.appendChild(head('Term 1 &middot; Student-led conference', 'Term 1 Conference', 'What we talked about at your Term 1 conference.'));
    var body = el('div', 't1-notes', '<p class="t1-muted">Loading…</p>');
    app.appendChild(body);
    window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
      var state = data && data.state;
      body.innerHTML = hasNotes(state)
        ? notesHtml(state, 'kidLabel')
        : '<p class="t1-muted">Your Term 1 conference notes aren’t here yet.</p>';
    });
  }

  /* ---------- staff ---------- */

  function renderRoster() {
    app.innerHTML = '';
    app.appendChild(head('Term 1 &middot; Student-led conference', 'Term 1 Conference', 'Each Riser’s feedback from their Term 1 conference.'));
    var list = el('div', 'hd-card sq-list');
    window.EOT2_KIDS.forEach(function (kid) {
      var row = el('a', 'sq-row');
      row.href = 'index.html?view=staff&kid=' + kid.slug;
      row.innerHTML =
        '<span class="lh-avatar sq-avatar">' + kid.name.charAt(0) + '</span>' +
        '<span class="sq-name">' + kid.name + '</span>' +
        '<span class="sq-meta">&nbsp;</span>' +
        '<span class="sq-go" aria-hidden="true">&rarr;</span>';
      list.appendChild(row);
      window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
        var meta = row.querySelector('.sq-meta');
        var added = hasNotes(data && data.state);
        meta.textContent = added ? 'Notes added' : 'Not added yet';
        meta.classList.toggle('is-done', added);
      });
    });
    app.appendChild(list);
  }

  function renderStaffKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'dash-crumb', '<a href="index.html?view=staff">&larr; All Risers</a>'));
    app.appendChild(head('Term 1 Conference', kid.name));
    var body = el('div', 't1-notes', '<p class="t1-muted">Loading…</p>');
    app.appendChild(body);

    var state = {};
    function showNotes() {
      body.innerHTML = (hasNotes(state) ? notesHtml(state, 'staffLabel') : '<p class="t1-muted">No notes yet for ' + kid.name + '.</p>') +
        '<div class="t1-actions"><button type="button" class="eot2-btn eot2-btn-secondary" id="t1-edit">' + (hasNotes(state) ? 'Edit notes' : 'Add notes') + '</button></div>';
      document.getElementById('t1-edit').addEventListener('click', showForm);
    }
    function showForm() {
      body.innerHTML = FIELDS.map(function (f) {
        return '<div class="eot2-mom-field"><label for="t1-' + f.id + '">' + f.staffLabel + '</label>' +
          '<textarea class="eot2-textarea" id="t1-' + f.id + '">' + escapeHtml(state[f.id] || '') + '</textarea></div>';
      }).join('') +
        '<div class="t1-actions"><button type="button" class="eot2-btn t1-save" id="t1-save">Save</button>' +
        '<button type="button" class="eot2-btn eot2-btn-secondary" id="t1-cancel">Cancel</button>' +
        '<span class="t1-msg" id="t1-msg"></span></div>';
      document.getElementById('t1-cancel').addEventListener('click', showNotes);
      document.getElementById('t1-save').addEventListener('click', function () {
        var next = {};
        FIELDS.forEach(function (f) { next[f.id] = document.getElementById('t1-' + f.id).value.trim(); });
        var editor = null;
        try { editor = localStorage.getItem(STAFF_KEY); } catch (e) {}
        if (editor) next.editedBy = editor;
        var btn = document.getElementById('t1-save');
        btn.disabled = true;
        document.getElementById('t1-msg').textContent = 'Saving…';
        window.eot2Save(kid.group, kid.slug, WEEK_KEY, next).then(function (res) {
          if (res.ok) { state = next; showNotes(); return; }
          btn.disabled = false;
          document.getElementById('t1-msg').textContent = 'Couldn’t save — check your connection and try again.';
        });
      });
    }

    window.eot2Fetch(kid.group, kid.slug, WEEK_KEY).then(function (data) {
      state = (data && data.state) || {};
      showNotes();
    });
  }

  function init() {
    if (isStaff) {
      var kid = params.get('kid') ? window.EOT2_findKid(params.get('kid')) : null;
      if (kid) renderStaffKid(kid); else renderRoster();
      return;
    }
    var slug = null;
    try { slug = (localStorage.getItem(KID_KEY) || '').toLowerCase(); } catch (e) {}
    var kidEntry = slug ? window.EOT2_findKid(slug) : null;
    if (kidEntry) renderKid(kidEntry);
    else location.href = '../index.html'; // Home is the one sign-in.
  }

  document.addEventListener('DOMContentLoaded', init);
})();
