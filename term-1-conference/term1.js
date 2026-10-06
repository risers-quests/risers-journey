/* Term 1 Conference — each Riser's feedback from their Term 1 student-led
   conference: where staff have seen growth, what to focus on next term,
   and a note from their parents.

   The text itself is NOT in this repo (it's public, and this is personal
   feedback about named children). It lives in the progress Worker under
   the synthetic week key "term1-conference", the same way MOMs do. It was
   imported once from the private staff-data repo's term1-conference/
   page, and staff can edit it here afterwards.

   Each Riser can also have their conference slideshow attached. Staff
   upload it once; after that the upload option is gone and everyone only
   gets Download. The Worker's /file endpoint enforces the same rule (a
   second upload for the same Riser is refused), so it holds even outside
   this page. Files are always named <Name>_Term1SlideShow.<ext>, and can
   be viewed in the browser (PDF, PowerPoint, ODP) as well as downloaded.

   Kid view: the signed-in Riser's own notes, and their slideshow if one
   has been uploaded.
   Staff view (?view=staff): every Riser, then one Riser's notes
   (&kid=<slug>), editable, plus the slideshow upload/download. */
(function () {
  var KID_KEY = 'imm-l3-kid';
  var STAFF_KEY = 'rj-staff-name';
  var WEEK_KEY = 'term1-conference';
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var isStaff = params.get('view') === 'staff';

  var SLOT = 'term1-slideshow';
  var ACCEPT = '.pdf,.ppt,.pptx,.key,.odp';
  var MAX_BYTES = 25 * 1024 * 1024;

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

  /* ---------- slideshow (Worker /file) ---------- */

  function fileUrl(kid, extra) {
    return window.EOT2_WORKER_URL.replace(/\/$/, '') + '/file?group=' + encodeURIComponent(kid.group) +
      '&kid=' + encodeURIComponent(kid.slug) + '&slot=' + SLOT + (extra || '');
  }
  // Every slideshow is named the same way, whatever the uploaded file was
  // called: <Name>_Term1SlideShow.<ext>. Applied at upload, and again
  // whenever it's shown or downloaded (so a file stored under any other
  // name still reads the standard way).
  function extOf(name) {
    var m = String(name || '').match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : '';
  }
  function standardName(kid, fileName) {
    return kid.name.replace(/[^A-Za-z0-9]+/g, '') + '_Term1SlideShow.' + extOf(fileName);
  }
  // View opens a plain link in a new tab: PDFs straight from the Worker
  // (?inline=1, so the browser shows rather than downloads it); PowerPoint
  // and ODP through Microsoft's free online viewer, which fetches that same
  // link (key in the query, file name at the end of the path). Keynote has
  // no online viewer, so it's download only.
  var OFFICE_VIEWER = 'https://view.officeapps.live.com/op/view.aspx?src=';
  function canView(fileName) {
    return ['pdf', 'ppt', 'pptx', 'odp'].indexOf(extOf(fileName)) !== -1;
  }
  function publicFileUrl(kid, fileName) {
    return window.EOT2_WORKER_URL.replace(/\/$/, '') + '/file/' + encodeURIComponent(standardName(kid, fileName)) +
      '?group=' + encodeURIComponent(kid.group) + '&kid=' + encodeURIComponent(kid.slug) + '&slot=' + SLOT +
      '&key=' + encodeURIComponent(window.EOT2_SITE_KEY);
  }

  // Resolves to { ready, file }: ready:false means the Worker doesn't have
  // the /file endpoint yet (or couldn't be reached); file is null when
  // nothing has been uploaded.
  function fetchSlideshow(kid) {
    return fetch(fileUrl(kid, '&meta=1'), { headers: { 'X-Site-Key': window.EOT2_SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return d ? { ready: true, file: d.found ? d.file : null } : { ready: false, file: null }; })
      .catch(function () { return { ready: false, file: null }; });
  }
  function fmtSize(bytes) {
    return bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }
  function fileIcon() {
    return '<span class="t1-file-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m10 8.5 4 2-4 2z"/></svg></span>';
  }

  // Download goes through fetch (the Worker wants the X-Site-Key header,
  // which a plain link can't send), then hands the browser a local copy.
  function download(kid, file, btn) {
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = 'Downloading…';
    fetch(fileUrl(kid), { headers: { 'X-Site-Key': window.EOT2_SITE_KEY } })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.blob(); })
      .then(function (blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = standardName(kid, file.name);
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        btn.textContent = label;
      })
      .catch(function () { btn.textContent = 'Couldn’t download — try again'; })
      .then(function () { btn.disabled = false; });
  }

  function view(kid, file) {
    var link = publicFileUrl(kid, file.name);
    window.open(extOf(file.name) === 'pdf' ? link + '&inline=1' : OFFICE_VIEWER + encodeURIComponent(link), '_blank', 'noopener');
  }

  function fileCard(kid, file) {
    var card = el('section', 'hd-card t1-file',
      fileIcon() +
      '<span class="t1-file-text"><strong>' + escapeHtml(standardName(kid, file.name)) + '</strong>' +
        '<span>' + fmtSize(file.size) + ' &middot; uploaded ' + new Date(file.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '</span></span>' +
      '<span class="t1-file-actions">' +
        (canView(file.name) ? '<button type="button" class="eot2-btn eot2-btn-secondary t1-view">View</button>' : '') +
        '<button type="button" class="eot2-btn t1-download">Download</button>' +
      '</span>');
    card.querySelector('.t1-download').addEventListener('click', function () { download(kid, file, this); });
    var viewBtn = card.querySelector('.t1-view');
    if (viewBtn) {
      // View relies on the Worker serving the file from a plain link (no
      // header). Check that once when the card appears, so a Worker that
      // hasn't been updated yet gives a clear message here rather than an
      // error page from the online viewer. (The check runs ahead of the tap
      // so View can still open its tab immediately, which iPad Safari needs
      // to not block it as a pop-up.)
      var viewReady = null;
      fetch(publicFileUrl(kid, file.name) + '&meta=1')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { viewReady = !!(d && d.found); })
        .catch(function () { viewReady = false; });
      viewBtn.addEventListener('click', function () {
        var msg = card.querySelector('.t1-view-msg');
        if (viewReady === false) {
          if (!msg) card.appendChild(msg = el('p', 't1-msg t1-view-msg'));
          msg.textContent = 'View isn’t available yet — the progress service needs its latest update. Download still works.';
          return;
        }
        view(kid, file);
      });
    }
    return card;
  }

  // Staff only: the upload box, shown only while nothing has been uploaded.
  function uploadCard(kid, onDone) {
    var card = el('section', 'hd-card t1-upload',
      '<label class="t1-drop">' +
        '<input type="file" accept="' + ACCEPT + '">' +
        fileIcon() +
        '<span class="t1-file-text"><strong>Upload ' + escapeHtml(kid.name) + '’s slideshow</strong>' +
        '<span>PDF, PowerPoint, Keynote or ODP, up to 25 MB. It can only be uploaded once.</span></span>' +
        '<span class="eot2-btn eot2-btn-secondary t1-pick">Choose file</span>' +
      '</label>' +
      '<p class="t1-msg" aria-live="polite"></p>');
    var input = card.querySelector('input');
    var msg = card.querySelector('.t1-msg');
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      if (!/\.(pdf|pptx?|key|odp)$/i.test(f.name)) { msg.textContent = 'That file type isn’t supported — use PDF, PowerPoint, Keynote or ODP.'; return; }
      if (f.size > MAX_BYTES) { msg.textContent = 'That file is over 25 MB. Export a smaller copy (a PDF usually is) and try again.'; return; }
      if (!confirm('Upload this as ' + kid.name + '’s slideshow (' + standardName(kid, f.name) + ')? Once uploaded it can’t be replaced from here.')) { input.value = ''; return; }
      card.classList.add('is-busy');
      msg.textContent = 'Uploading…';
      fetch(fileUrl(kid, '&name=' + encodeURIComponent(standardName(kid, f.name))), {
        method: 'POST', headers: { 'X-Site-Key': window.EOT2_SITE_KEY }, body: f
      })
        .then(function (r) { return r.json().then(function (d) { return { status: r.status, d: d }; }); })
        .then(function (res) {
          if (res.d && res.d.ok) { onDone(res.d.file); return; }
          if (res.status === 409) { fetchSlideshow(kid).then(function (x) { if (x.file) onDone(x.file); }); return; }
          throw new Error((res.d && res.d.error) || 'upload failed');
        })
        .catch(function () {
          card.classList.remove('is-busy');
          input.value = '';
          msg.textContent = 'Couldn’t upload — check your connection and try again.';
        });
    });
    return card;
  }

  // Slideshow section for a Riser: Download if uploaded; for staff, the
  // upload box if not; for the Riser, nothing until there's something.
  function slideshowSection(kid, asStaff) {
    var wrap = el('div', 't1-slides');
    fetchSlideshow(kid).then(function (res) {
      if (res.file) {
        wrap.appendChild(el('h2', 't1-section-title', 'Conference slideshow'));
        wrap.appendChild(fileCard(kid, res.file));
      } else if (asStaff) {
        wrap.appendChild(el('h2', 't1-section-title', 'Conference slideshow'));
        if (!res.ready) {
          wrap.appendChild(el('p', 't1-muted', 'Slideshow uploads switch on once the progress service is updated.'));
          return;
        }
        var up = uploadCard(kid, function (file) {
          up.replaceWith(fileCard(kid, file));
        });
        wrap.appendChild(up);
      }
    });
    return wrap;
  }

  /* ---------- kid ---------- */

  function renderKid(kid) {
    app.innerHTML = '';
    app.appendChild(head('Term 1 &middot; Student-led conference', 'Term 1 Conference', 'What we talked about at your Term 1 conference.'));
    var body = el('div', 't1-notes', '<p class="t1-muted">Loading…</p>');
    app.appendChild(body);
    app.appendChild(slideshowSection(kid, false));
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
    // Shown only while some Risers have no notes: the feedback is imported
    // once from the private staff site (it isn't stored in this repo).
    var importBanner = el('div', 'hd-card t1-import-banner',
      '<span class="t1-file-text"><strong>Term 1 notes not imported yet</strong>' +
      '<span>Some Risers have no notes. Import them once from the staff site.</span></span>' +
      '<a class="eot2-btn t1-import-link" href="' + (window.LH_STAFF_SITE || '') + 'term1-conference/index.html" target="_blank" rel="noopener">Open import page</a>');
    importBanner.hidden = true;
    app.appendChild(importBanner);
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
      Promise.all([window.eot2Fetch(kid.group, kid.slug, WEEK_KEY), fetchSlideshow(kid)]).then(function (r) {
        var meta = row.querySelector('.sq-meta');
        var added = hasNotes(r[0] && r[0].state);
        var parts = [added ? 'Notes added' : 'No notes yet'];
        if (r[1].file) parts.push('slideshow uploaded');
        meta.textContent = parts.join(' · ');
        meta.classList.toggle('is-done', added);
        if (!added) importBanner.hidden = false;
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
    app.appendChild(slideshowSection(kid, true));

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
        if (!hasNotes(next)) {
          document.getElementById('t1-msg').textContent = 'Add at least one note before saving.';
          return;
        }
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
    else window.EOT2_leaveWithoutKid('index.html?view=staff', '../index.html');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
