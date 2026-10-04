/* Shared helpers for all three Level 3 Quest pages:
   - materials-pool -> printable slip, and the print trigger
   - small random-event helpers for the Day 2 decision workshops
   - a per-kid access gate (name check -> unlock this page's content)
   - a text highlighter + side notes drawer
   No progress-locking, no scoring — evaluation here is the decision log
   itself, not a graded mechanic. The kid-gate is a soft, distraction-reducing
   check (localStorage-based), not real access control. */
(function () {
  var KID_KEY = 'imm-l3-kid';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ---- Shared facilitator PIN modal: a masked (type=password) field
     asks for the PIN, replacing window.prompt() — whose plain text box
     shows every digit as it's typed, in full view of the kid sitting
     right next to it. One singleton modal, built once and reused for
     every facilitator-pass button on this page. */
  var FACILITATOR_PIN = '1234';
  var FacilitatorPin = (function () {
    var backdrop = null, input = null, msg = null, activeCallback = null;

    function build() {
      if (backdrop) return;
      backdrop = el('div', 'pass-modal-backdrop', null);
      var modal = el('div', 'pass-modal', null);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);
      modal.innerHTML =
        '<h4>🔒 Facilitator PIN</h4>' +
        '<p class="pass-modal-hint">Enter the facilitator PIN to grant this pass.</p>' +
        '<input type="password" inputmode="numeric" autocomplete="off" class="pass-pin-input" placeholder="••••">' +
        '<div class="pass-modal-msg"></div>' +
        '<div class="pass-modal-actions">' +
        '<button type="button" class="btn btn-ghost pass-cancel-btn">Cancel</button>' +
        '<button type="button" class="btn btn-primary pass-pin-continue-btn">Continue</button>' +
        '</div>';
      input = modal.querySelector('.pass-pin-input');
      msg = modal.querySelector('.pass-modal-msg');

      function submit() {
        if ((input.value || '').trim() === FACILITATOR_PIN) {
          close(true);
        } else {
          msg.textContent = '❌ Wrong PIN — ask a facilitator to try again.';
          input.value = '';
          input.focus();
        }
      }
      modal.querySelector('.pass-pin-continue-btn').addEventListener('click', submit);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
      modal.querySelector('.pass-cancel-btn').addEventListener('click', function () { close(false); });
      backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(false); });
    }

    function close(ok) {
      backdrop.classList.remove('show');
      input.value = '';
      msg.textContent = '';
      var cb = activeCallback;
      activeCallback = null;
      if (cb) cb(ok);
    }

    return {
      ask: function (callback) {
        build();
        activeCallback = callback;
        msg.textContent = '';
        input.value = '';
        backdrop.classList.add('show');
        setTimeout(function () { input.focus(); }, 30);
      }
    };
  })();

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function loadJSON(key, fallback) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---- Materials pool: clicking a pool card toggles its checkbox and live-updates
     both the on-screen "what I'm bringing" preview and the isolated printable slip.
     Picks persist per kid/page, so returning to Day 2 later shows the same kit
     instead of resetting to the HTML defaults. ---- */
  function initMaterialsPool(pageKey) {
    var items = document.querySelectorAll('.pool-item');
    if (!items.length) return;
    var previewList = document.getElementById('slip-list-preview');
    var printList = document.getElementById('slip-list-print');
    var slipEmpty = document.getElementById('slip-empty');
    var storageKey = 'imm-l3-w2-materials::' + pageKey;
    var saved = loadJSON(storageKey, null);

    if (saved) {
      items.forEach(function (item, i) {
        var cb = item.querySelector('input[type=checkbox]');
        if (saved[i] !== undefined) cb.checked = !!saved[i];
      });
    }

    function refresh() {
      var picked = [];
      var state = [];
      items.forEach(function (item) {
        var cb = item.querySelector('input[type=checkbox]');
        item.classList.toggle('picked', cb.checked);
        state.push(cb.checked);
        if (cb.checked) picked.push(item.querySelector('.pool-name').textContent.trim());
      });
      saveJSON(storageKey, state);
      var html = picked.map(function (p) { return '<li>' + p + '</li>'; }).join('');
      if (previewList) previewList.innerHTML = html;
      if (printList) printList.innerHTML = html;
      if (slipEmpty) slipEmpty.style.display = picked.length ? 'none' : 'block';
    }

    // Each .pool-item is a <label> wrapping its checkbox, so a click anywhere
    // in the label already toggles the checkbox natively — listening for
    // 'change' (not 'click') avoids double-toggling that click would cause.
    items.forEach(function (item) {
      var cb = item.querySelector('input[type=checkbox]');
      cb.addEventListener('change', refresh);
    });
    refresh();
  }

  function initPrintSlip() {
    var btn = document.getElementById('print-slip-btn');
    if (btn) btn.addEventListener('click', function () { window.print(); });
  }

  /* ---- Build checklist: the Day 2 numbered steps. Checking one turns it
     green/struck-through and persists per kid/page. ---- */
  function initBuildChecklist(pageKey) {
    var items = document.querySelectorAll('.build-check-item');
    if (!items.length) return;
    var storageKey = 'imm-l3-w2-build::' + pageKey;
    var state = loadJSON(storageKey, {});

    items.forEach(function (item, i) {
      var cb = item.querySelector('input[type=checkbox]');
      if (!cb) return;
      if (state[i]) { cb.checked = true; item.classList.add('checked'); }
      cb.addEventListener('change', function () {
        item.classList.toggle('checked', cb.checked);
        state[i] = cb.checked;
        saveJSON(storageKey, state);
      });
    });
  }

  /* ---- Generic field autosave: every other free-text input/textarea in
     <main> (the material-justification table, the Results table) — anything
     NOT already handled by a dedicated system (reflections, notes, gate).
     Fields are keyed by DOM order, which is stable since this is a static
     page, so a reload restores exactly what was typed without needing ids
     on every table cell. ---- */
  function initFieldAutosave(pageKey) {
    var storageKey = 'imm-l3-w2-fields::' + pageKey;
    var skipIds = /^(refl-\d+|notes-textarea|hub-name-input)$/;
    var fields = Array.prototype.filter.call(
      document.querySelectorAll('main input[type=text], main input:not([type]), main textarea'),
      function (f) { return !(f.id && skipIds.test(f.id)); }
    );
    if (!fields.length) return;

    var saved = loadJSON(storageKey, {});
    fields.forEach(function (f, i) {
      f.dataset.fieldIdx = i;
      if (saved[i] !== undefined) f.value = saved[i];
    });

    fields.forEach(function (f) {
      f.addEventListener('input', function () {
        var data = loadJSON(storageKey, {});
        data[f.dataset.fieldIdx] = f.value;
        saveJSON(storageKey, data);
      });
    });
  }

  /* ---- Presentation prep autofill: the "materials used + why" field in the
     Day 3 prep form pulls from the Day 2 plan table (.justify-table), whose
     columns are always [part, represents, material, why] in that order.
     Only fills when the field is still empty, so it never clobbers a kid's
     own edit on a later visit; the button lets them re-pull deliberately. ---- */
  function initPresentationAutofill(pageKey) {
    var target = document.querySelector('.prep-build-materials');
    if (!target) return;

    function buildSummary() {
      var rows = document.querySelectorAll('.justify-table tbody tr');
      var lines = [];
      rows.forEach(function (tr) {
        var partEl = tr.children[0] && tr.children[0].querySelector('input');
        var matEl = tr.children[2] && tr.children[2].querySelector('input');
        var whyEl = tr.children[3] && tr.children[3].querySelector('textarea');
        var part = partEl && partEl.value.trim();
        var mat = matEl && matEl.value.trim();
        var why = whyEl && whyEl.value.trim();
        if (!part && !mat && !why) return;
        lines.push((part || '(unnamed part)') + ': ' + (mat || '(no material yet)') + (why ? ' — ' + why : ''));
      });
      return lines.join('\n');
    }

    function pull() {
      target.value = buildSummary();
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }

    var btn = document.querySelector('.prep-autofill-btn');
    if (btn) btn.addEventListener('click', pull);

    // Auto-pull once, the first time the prep form actually scrolls into
    // view — not at page load, since a kid reaches Day 3 later in the same
    // session after Day 2 is filled in, and pulling at load would only ever
    // see an empty plan table. Still respects a field the kid already typed.
    var form = document.querySelector('.prep-form');
    if (form && window.IntersectionObserver) {
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !seen) {
            seen = true;
            if (!target.value.trim()) pull();
            io.disconnect();
          }
        });
      }, { threshold: 0.2 });
      io.observe(form);
    } else if (!target.value.trim()) {
      pull();
    }
  }

  /* ---- Progress summary: a 3-segment bar (Day 1 / Day 2 / Day 3) shown right
     under the header, so coming back later shows real progress instead of a
     page that looks blank. Reads straight from each subsystem's own saved
     state rather than tracking anything separately, so it can never drift
     out of sync with what's actually been filled in. ---- */
  function initProgressBar(pageKey) {
    var fill1 = document.getElementById('progress-day1-fill');
    var fill2 = document.getElementById('progress-day2-fill');
    var fill3 = document.getElementById('progress-day3-fill');
    var label1 = document.getElementById('progress-day1-label');
    var label2 = document.getElementById('progress-day2-label');
    if (!fill1) return;

    var dayBadge = document.getElementById('quest-day-badge');

    function reflectFilled(id) {
      var s = loadJSON('imm-l3-w2-reflect::' + pageKey + '::' + id, null);
      return !!(s && s.text && s.text.trim());
    }

    function recompute() {
      // Owen and Pranavi's Day 1 carries a much deeper question set (4-5 per
      // reading section, plus the lever-class pair folded into the "put
      // together" section) than the base 4-question format, and the exact
      // extra ids differ slightly per kid (e.g. refl-15 vs refl-19) — so
      // detect whichever of these actually exist on the page rather than
      // assuming one fixed list.
      var day1Candidates = ['refl-1', 'refl-2', 'refl-3', 'refl-4', 'refl-6', 'refl-7', 'refl-8', 'refl-9', 'refl-10', 'refl-11', 'refl-12', 'refl-13', 'refl-14', 'refl-15', 'refl-16', 'refl-17', 'refl-18', 'refl-19'];
      var day1Ids = day1Candidates.filter(function (id) { return document.getElementById(id); });
      if (!day1Ids.length) day1Ids = ['refl-1', 'refl-2', 'refl-3', 'refl-4'];
      var day1Total = day1Ids.length;
      var day1Done = day1Ids.filter(reflectFilled).length;
      var buildState = loadJSON('imm-l3-w2-build::' + pageKey, {});
      var buildDone = Object.keys(buildState).filter(function (k) { return buildState[k]; }).length;
      // The self-review check (refl-5) doesn't exist on every kid's page
      // (removed -- an opinion, not a checkable answer), so detect whether
      // it's actually present on THIS page rather than assuming a fixed
      // denominator, same as day1Candidates above.
      var hasSelfReview = !!document.getElementById('refl-5');
      var day2Total = hasSelfReview ? 6 : 5;
      var day2Done = buildDone + (hasSelfReview && reflectFilled('refl-5') ? 1 : 0);

      fill1.style.width = Math.round((day1Done / day1Total) * 100) + '%';
      fill2.style.width = Math.round((day2Done / day2Total) * 100) + '%';
      if (fill3) fill3.style.width = (day2Done >= day2Total ? 100 : 0) + '%';
      if (label1) label1.textContent = day1Done + '/' + day1Total;
      if (label2) label2.textContent = day2Done + '/' + day2Total;

      // "Quest Day X" indicator (per the staff portal's Child's View spec) —
      // purely derived from the same completion data above.
      if (dayBadge) {
        if (day1Done < day1Total) dayBadge.textContent = '\ud83d\udccd Day 1 of 3';
        else if (day2Done < day2Total) dayBadge.textContent = '\ud83d\udccd Day 2 of 3';
        else dayBadge.textContent = '\ud83d\udccd Day 3 of 3';
      }
    }

    recompute();
    document.addEventListener('input', recompute);
    document.addEventListener('change', recompute);
    // Reflection state and the build checklist only actually save on a button
    // click (not on every keystroke/change), so the bar also needs to recompute
    // on click — otherwise it visibly lags a full step behind what's saved
    // until the kid happens to type or toggle something else afterward.
    document.addEventListener('click', recompute);
  }

  /* ---- Section lock ----
     Each numbered reading section (an <h3> carrying a .sec-num badge) stays
     collapsed behind a lock banner until every reflection question inside
     the PREVIOUS numbered section has actually been validated (state.success
     — a real pass, or a facilitator-approved pass; both set the same flag).
     The first numbered section is always open. This is purely derived from
     each question's own saved state on every recompute, same as the
     progress bar, so there's no separate "unlocked" flag that could ever
     drift out of sync with what's actually been answered. Facilitator View
     bypasses this entirely — a facilitator previewing the page needs to see
     everything in one pass, not be gated by a kid's own progress. */
  function initSectionLock(pageKey) {
    if (window.QUEST_FACILITATOR_MODE) return;

    var headings = Array.prototype.filter.call(document.querySelectorAll('h3'), function (h) {
      return h.querySelector('.sec-num');
    });
    if (headings.length < 2) return;

    // Locked content isn't removed or collapsed — it's wrapped, blurred in
    // place, and a lock card sits on top (sticky, so it stays in view no
    // matter how far the kid scrolls into a long locked section), so a
    // section that's coming up next reads as "there's real content here,
    // finish the one above to reveal it" rather than just vanishing.
    var sections = headings.map(function (h) {
      var nodes = [];
      var reflIds = [];
      var node = h.nextElementSibling;
      while (node && !(node.tagName === 'H3' && node.querySelector('.sec-num'))) {
        var next = node.nextElementSibling;
        nodes.push(node);
        if (node.querySelectorAll) {
          Array.prototype.forEach.call(node.querySelectorAll('textarea[id^="refl-"]'), function (ta) { reflIds.push(ta.id); });
        }
        node = next;
      }

      var wrap = el('div', 'sec-body-wrap');
      var inner = el('div', 'sec-body-inner');
      if (nodes.length) {
        h.parentNode.insertBefore(wrap, nodes[0]);
        nodes.forEach(function (n) { inner.appendChild(n); });
      } else {
        h.insertAdjacentElement('afterend', wrap);
      }
      var overlay = el('div', 'sec-lock-overlay', '<div class="sec-lock-card"><span class="lock-icon">🔒</span><span class="lock-text">Finish the check in the section above to unlock this one</span></div>');
      wrap.appendChild(overlay);
      wrap.appendChild(inner);

      return { heading: h, wrap: wrap, reflIds: reflIds };
    });

    function reflSuccess(id) {
      var s = loadJSON('imm-l3-w2-reflect::' + pageKey + '::' + id, null);
      return !!(s && s.success);
    }

    function setLocked(sec, locked) {
      sec.heading.classList.toggle('sec-locked-heading', locked);
      sec.wrap.classList.toggle('sec-locked-body', locked);
    }

    function recompute() {
      var open = true;
      sections.forEach(function (sec, idx) {
        if (idx > 0) {
          var prev = sections[idx - 1];
          var prevDone = !prev.reflIds.length || prev.reflIds.every(reflSuccess);
          open = open && prevDone;
        }
        setLocked(sec, !open);
      });
    }

    recompute();
    document.addEventListener('click', recompute);
    document.addEventListener('input', recompute);
  }

  /* ---- Day lock ----
     Each day-block beyond the first stays collapsed to just its own intro
     (day-kicker + heading + day-sub line) behind a lock banner until every
     reflection question AND build-checklist item inside the PREVIOUS
     day-block is validated/checked — so a kid can't skip past the rest of
     the quest before finishing the day before it. Works alongside
     initSectionLock, which handles the finer-grained gating WITHIN Day 1's
     numbered reading sections; this handles the coarser day-to-day gating.
     Build-checklist items are matched by their GLOBAL index (the same
     index initBuildChecklist itself persists under, since that function
     indexes every .build-check-item on the page as one flat list — not
     scoped per day-block), so this stays correct even though only one day
     usually has any build items at all. Facilitator View bypasses this
     entirely, same as section lock, so a facilitator can preview the whole
     quest in one pass. */
  function initDayLock(pageKey) {
    if (window.QUEST_FACILITATOR_MODE) return;

    var blocks = Array.prototype.slice.call(document.querySelectorAll('.day-block'));
    if (blocks.length < 2) return;

    var allBuildItems = document.querySelectorAll('.build-check-item');

    // Same blur-and-lock-card treatment as initSectionLock, just scoped to
    // a whole day instead of one reading section — everything after the
    // day's own intro (kicker/heading/day-sub, which stay visible so a kid
    // can see what's coming) gets wrapped, blurred, and covered by a
    // sticky lock card until the day before it is actually done.
    var days = blocks.map(function (block) {
      var introEls = [];
      var bodyEls = [];
      var pastIntro = false;
      Array.prototype.forEach.call(block.children, function (child) {
        if (!pastIntro) {
          introEls.push(child);
          if (child.classList && child.classList.contains('day-sub')) pastIntro = true;
        } else {
          bodyEls.push(child);
        }
      });

      var reflIds = Array.prototype.map.call(block.querySelectorAll('textarea[id^="refl-"]'), function (ta) { return ta.id; });
      var buildIndices = [];
      Array.prototype.forEach.call(allBuildItems, function (item, i) {
        if (block.contains(item)) buildIndices.push(i);
      });

      var wrap = el('div', 'day-body-wrap');
      var inner = el('div', 'day-body-inner');
      if (bodyEls.length) {
        block.insertBefore(wrap, bodyEls[0]);
        bodyEls.forEach(function (n) { inner.appendChild(n); });
      } else {
        block.appendChild(wrap);
      }
      var overlay = el('div', 'day-lock-overlay', '<div class="day-lock-card"><span class="lock-icon">🔒</span><span class="lock-text">Finish the day above to unlock this one</span></div>');
      wrap.appendChild(overlay);
      wrap.appendChild(inner);

      return { block: block, wrap: wrap, reflIds: reflIds, buildIndices: buildIndices };
    });

    function reflSuccess(id) {
      var s = loadJSON('imm-l3-w2-reflect::' + pageKey + '::' + id, null);
      return !!(s && s.success);
    }

    function dayDone(day) {
      var reflOk = !day.reflIds.length || day.reflIds.every(reflSuccess);
      var buildOk = true;
      if (day.buildIndices.length) {
        var state = loadJSON('imm-l3-w2-build::' + pageKey, {});
        buildOk = day.buildIndices.every(function (i) { return !!state[i]; });
      }
      return reflOk && buildOk;
    }

    function setLocked(day, locked) {
      day.block.classList.toggle('day-locked-block', locked);
      day.wrap.classList.toggle('day-locked-body', locked);
    }

    function recompute() {
      var open = true;
      days.forEach(function (day, idx) {
        if (idx > 0) open = open && dayDone(days[idx - 1]);
        setLocked(day, !open);
      });
    }

    recompute();
    document.addEventListener('click', recompute);
    document.addEventListener('input', recompute);
    document.addEventListener('change', recompute);
  }

  /* ---- Per-kid access gate ----
     Each kid page calls initKidGate('Shalom'). If this browser's checked-in
     name (localStorage) matches, the page unlocks immediately (a blocking
     inline <script>/<style> in <head> already hid <main> before first paint,
     so there's no flash of someone else's content). If it doesn't match, a
     blocking screen stays up with a name box scoped to THIS page's kid only. */
  // The kid's own gate screen already IS their identity — this exact page
  // is Shalom's page, reached via Shalom's own link, so there's nothing to
  // type or validate. One tap confirms it; a "not you?" link on the page
  // sends anyone else back to the hub to find their own link instead.
  function initKidGate(expectedName) {
    var current = null;
    try { current = localStorage.getItem(KID_KEY); } catch (e) {}

    function unlock() {
      document.documentElement.classList.remove('gate-locked');
      var block = document.getElementById('quest-gate-block');
      if (block) block.classList.remove('show');
    }

    function showBlocked() {
      var block = document.getElementById('quest-gate-block');
      if (!block) return;
      block.classList.add('show');
      var confirmBtn = document.getElementById('gate-confirm-btn');
      if (confirmBtn && !confirmBtn.dataset.wired) {
        confirmBtn.dataset.wired = '1';
        confirmBtn.addEventListener('click', function () {
          try { localStorage.setItem(KID_KEY, expectedName); } catch (err) {}
          unlock();
        });
      }
    }

    if (current && current.toLowerCase() === expectedName.toLowerCase()) {
      unlock();
    } else {
      showBlocked();
    }
  }

  /* ---- Highlighter ----
     Select any text inside <main> (p/li), a small "Highlight" button appears
     near the selection. Highlights are stored as {block, start, end} plain-
     text offsets within their containing block (auto-tagged data-hl-block),
     so they survive reload and reapply regardless of nested <strong>/<em>. */
  function getTextOffset(root, node, offset) {
    // A selection boundary isn't always a text node + char offset — dragging to
    // exactly the start/end of a block (very common: selecting "the whole
    // sentence") often resolves to the parent element + a child index instead.
    // Building a Range from the true start of root to the boundary and reading
    // its string length handles both cases correctly, using the same text
    // serialization the browser itself uses for range.toString().
    try {
      var r = document.createRange();
      r.setStart(root, 0);
      r.setEnd(node, offset);
      return r.toString().length;
    } catch (e) {
      return root.textContent.length;
    }
  }

  function wrapRange(root, start, end, markClass, hlId, bg) {
    if (end <= start || !root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var pos = 0, node, targets = [];
    while ((node = walker.nextNode())) {
      var len = node.textContent.length;
      var nodeStart = pos, nodeEnd = pos + len;
      if (nodeEnd > start && nodeStart < end) {
        targets.push({ node: node, sliceStart: Math.max(0, start - nodeStart), sliceEnd: Math.min(len, end - nodeStart) });
      }
      pos = nodeEnd;
      if (pos >= end) break;
    }
    targets.forEach(function (t) {
      var text = t.node.textContent;
      var before = text.slice(0, t.sliceStart);
      var mid = text.slice(t.sliceStart, t.sliceEnd);
      var after = text.slice(t.sliceEnd);
      if (!mid) return;
      var mark = el('mark', markClass, null);
      mark.dataset.hlId = hlId;
      if (bg) mark.style.backgroundColor = bg;
      mark.textContent = mid;
      var frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      frag.appendChild(mark);
      if (after) frag.appendChild(document.createTextNode(after));
      t.node.parentNode.replaceChild(frag, t.node);
    });
  }

  // Fixed highlighter palette — a real highlighter pen has a handful of colors,
  // not an unlimited picker. `name` is what gets persisted; `bg` is the actual
  // CSS color, applied as an inline style so it survives independent of theme.
  var HL_COLORS = [
    { name: 'yellow', bg: '#fde68a' },
    { name: 'green', bg: '#bbf7d0' },
    { name: 'blue', bg: '#bfdbfe' },
    { name: 'pink', bg: '#fbcfe8' },
    { name: 'orange', bg: '#fed7aa' }
  ];
  function hlColorBg(name) {
    var match = HL_COLORS.filter(function (c) { return c.name === name; })[0];
    return match ? match.bg : HL_COLORS[0].bg;
  }

  function initHighlighter(pageKey) {
    // Anything a kid might reasonably try to select: paragraphs and list items
    // cover almost all reading prose, plus the specific caption/label elements
    // used by the diagram and animation components (those are <div>s, not <p>).
    var blocks = document.querySelectorAll(
      'main p, main li, main .t-body, main .diagram-sub, main .diagram-title, main .ps-caption, main .ps-sub, main .diagram-legend-item'
    );
    blocks.forEach(function (b, i) { if (!b.dataset.hlBlock) b.dataset.hlBlock = 'hl-' + i; });

    var storageKey = 'imm-l3-w2-hl::' + pageKey;
    var highlights = loadJSON(storageKey, []);

    function persist() { saveJSON(storageKey, highlights); }

    // Each highlight is one or more {block, start, end} spans sharing one id —
    // a real selection often crosses a paragraph/heading boundary (e.g. from
    // the end of one paragraph into the start of the next), so a highlight
    // has to be able to span more than one tagged block.
    function applyAll() {
      highlights.forEach(function (h) {
        (h.spans || []).forEach(function (s) {
          var root = document.querySelector('[data-hl-block="' + s.block + '"]');
          if (root) wrapRange(root, s.start, s.end, 'user-hl', h.id, hlColorBg(h.color));
        });
      });
    }

    // Find every tagged block the current selection touches, and the local
    // text-offset span within each one. Blocks the selection only partially
    // covers (the first/last one) still resolve correctly since block.contains()
    // tells us whether that block actually holds the range's start/end point.
    function findSpans(range) {
      var spans = [];
      blocks.forEach(function (block) {
        if (!range.intersectsNode(block)) return;
        var start = block.contains(range.startContainer) ? getTextOffset(block, range.startContainer, range.startOffset) : 0;
        var end = block.contains(range.endContainer) ? getTextOffset(block, range.endContainer, range.endOffset) : block.textContent.length;
        if (end > start) spans.push({ block: block.dataset.hlBlock, start: start, end: end });
      });
      return spans;
    }

    function renderCollectedList() {
      var listEl = document.getElementById('hl-collected-list');
      var emptyEl = document.getElementById('hl-collected-empty');
      if (!listEl) return;
      listEl.innerHTML = '';
      if (!highlights.length) { if (emptyEl) emptyEl.style.display = 'block'; return; }
      if (emptyEl) emptyEl.style.display = 'none';
      highlights.forEach(function (h) {
        var li = el('li');
        var dot = el('span', 'hlc-dot', null);
        dot.style.background = hlColorBg(h.color);
        var span = el('span', 'hlc-text', null);
        span.textContent = h.text;
        var btn = el('button', 'hlc-remove', '&times;');
        btn.type = 'button';
        btn.title = 'Remove highlight';
        btn.addEventListener('click', function () { removeHighlight(h.id); });
        li.appendChild(dot);
        li.appendChild(span);
        li.appendChild(btn);
        listEl.appendChild(li);
      });
    }

    function removeHighlight(id) {
      document.querySelectorAll('mark.user-hl[data-hl-id="' + id + '"]').forEach(function (m) {
        var textNode = document.createTextNode(m.textContent);
        var parent = m.parentNode;
        parent.replaceChild(textNode, m);
        if (parent.normalize) parent.normalize();
      });
      highlights = highlights.filter(function (h) { return h.id !== id; });
      persist();
      renderCollectedList();
    }

    // One popup, two modes: picking a color for a fresh selection ("new" mode),
    // or picking a new color / removing for a highlight the kid just tapped
    // ("edit" mode, .hl-popup-editing shows the extra Remove button).
    var popup = el('div', 'hl-popup', null);
    HL_COLORS.forEach(function (c) {
      var swatch = el('button', 'hl-swatch', null);
      swatch.type = 'button';
      swatch.dataset.color = c.name;
      swatch.style.background = c.bg;
      swatch.title = 'Highlight in ' + c.name;
      popup.appendChild(swatch);
    });
    var removeBtn = el('button', 'hl-remove-btn', '✕ Remove');
    removeBtn.type = 'button';
    removeBtn.title = 'Remove this highlight';
    popup.appendChild(removeBtn);
    popup.style.display = 'none';
    document.body.appendChild(popup);

    var pending = null;   // {spans, text} — a fresh, not-yet-colored selection
    var editingId = null; // hlId of an existing highlight the kid just tapped

    function positionPopupAt(rect) {
      popup.style.left = (rect.left + rect.width / 2 + window.scrollX) + 'px';
      popup.style.top = (rect.top + window.scrollY) + 'px';
      popup.style.display = 'flex';
    }

    function hidePopup() {
      popup.style.display = 'none';
      popup.classList.remove('hl-popup-editing');
      pending = null;
      editingId = null;
    }

    function openEditPopup(mark) {
      pending = null;
      editingId = mark.dataset.hlId;
      popup.classList.add('hl-popup-editing');
      positionPopupAt(mark.getBoundingClientRect());
    }

    // The one thing that actually decides "does the selection right now deserve
    // a highlight popup". Called from pointerup for instant response (works for
    // mouse, touch, and pen alike — Pointer Events unify all three), and from a
    // debounced selectionchange listener as a fallback that catches everything
    // else (native mobile selection-handle drags, which don't reliably fire
    // pointerup at the right moment, and keyboard selection).
    function trySelection() {
      if (editingId) return; // an edit popup is open — a stray selection shouldn't steal it
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) { hidePopup(); return; }
      var range = sel.getRangeAt(0);
      var text = range.toString().trim();
      if (!text) { hidePopup(); return; }
      var spans = findSpans(range);
      if (!spans.length) { hidePopup(); return; }
      var rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) { hidePopup(); return; }
      pending = { spans: spans, text: text };
      popup.classList.remove('hl-popup-editing');
      positionPopupAt(rect);
    }

    function applyPending(color) {
      if (!pending) return;
      var id = 'h' + Date.now() + Math.random().toString(36).slice(2, 6);
      pending.spans.forEach(function (s) {
        var root = document.querySelector('[data-hl-block="' + s.block + '"]');
        wrapRange(root, s.start, s.end, 'user-hl', id, hlColorBg(color));
      });
      highlights.push({ id: id, spans: pending.spans, text: pending.text, color: color });
      persist();
      renderCollectedList();
      window.getSelection().removeAllRanges();
    }

    function recolorHighlight(id, color) {
      document.querySelectorAll('mark.user-hl[data-hl-id="' + id + '"]').forEach(function (m) {
        m.style.backgroundColor = hlColorBg(color);
      });
      highlights.forEach(function (h) { if (h.id === id) h.color = color; });
      persist();
    }

    // Pointer Events fire for mouse, touch, and pen/stylus alike, so this one
    // pair of listeners is all three input types at once — no separate
    // mouse/touch branches to keep in sync.
    document.addEventListener('pointerup', function (e) {
      if (popup.contains(e.target)) return;
      var mark = e.target.closest && e.target.closest('mark.user-hl');
      if (mark) { openEditPopup(mark); return; }
      setTimeout(trySelection, 0);
    });

    document.addEventListener('pointerdown', function (e) {
      if (!popup.contains(e.target)) hidePopup();
    });

    var selChangeTimer = null;
    document.addEventListener('selectionchange', function () {
      clearTimeout(selChangeTimer);
      selChangeTimer = setTimeout(trySelection, 220);
    });

    popup.addEventListener('click', function (e) {
      var swatch = e.target.closest && e.target.closest('.hl-swatch');
      if (swatch) {
        var color = swatch.dataset.color;
        if (editingId) recolorHighlight(editingId, color);
        else applyPending(color);
        hidePopup();
        return;
      }
      if (e.target.closest && e.target.closest('.hl-remove-btn') && editingId) {
        removeHighlight(editingId);
        hidePopup();
      }
    });

    applyAll();
    renderCollectedList();
  }

  /* ---- Reflection checks ----
     Each open-ended callout question gets a "Check my thinking" button.
     The check is a plain keyword search, not real grading: cfg.groups is a
     list of concept-groups, each an array of interchangeable words/phrases,
     and the answer needs at least one hit from EVERY group to count as
     having the key idea. No visible score, no "wrong" — just "not quite
     yet" and a nudge to revise. Only after 3 checks without the key idea
     does a pointer back to the reading appear (cfg.reread: {anchor, label}),
     sending them to re-read the exact section that has the answer, rather
     than handing over the answer itself. State (attempts/success/text)
     persists per kid/page so a reload doesn't reset progress or re-hide an
     earned pointer. */
  // A bare numeric keyword (e.g. "200") must not count a DIFFERENT number
  // that merely contains those digits as a match — "1200" is not "200".
  // Text keywords keep plain substring matching (relied on elsewhere for
  // catching word-form variants like "wrong"/"wrongly"); only pure
  // number tokens get boundary-aware matching.
  var NUMERIC_KEYWORD = /^\d+(\.\d+)?$/;
  function checkKeywordGroups(text, groups) {
    var lower = text.toLowerCase();
    return groups.every(function (group) {
      return group.some(function (kw) {
        var kwLower = kw.toLowerCase();
        if (NUMERIC_KEYWORD.test(kwLower)) {
          var escaped = kwLower.replace(/\./g, '\\.');
          var re = new RegExp('(?:^|[^0-9.])' + escaped + '(?:[^0-9.]|$)');
          return re.test(lower);
        }
        return lower.indexOf(kwLower) !== -1;
      });
    });
  }

  /* ---- Writing check ----
     Runs only once the content (keyword) check has already passed — there's
     no point polishing grammar on an answer that doesn't have the idea yet.
     Three layers, cheapest/most-certain first:
       1. Mechanics (capital first letter, ends with punctuation) — instant,
          no dependency.
       2. Domain-term spelling — instant, no dependency. Fuzzy-matches each
          word in the answer against this question's own known terms; a
          near-miss doesn't just get "corrected" for them, it points back to
          the exact section that has it spelled correctly, same as a content
          miss does.
       3. General grammar/spelling (anything not covered by #1/#2) — the one
          layer that needs a real language model, so it calls LanguageTool's
          free public API (https://api.languagetool.org). If that call ever
          fails (offline, rate-limited, CORS hiccup) this fails OPEN — the
          answer is accepted rather than a kid getting stuck behind an
          infrastructure problem that has nothing to do with their writing. */
  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    var d = [];
    for (var i = 0; i <= m; i++) d.push([i]);
    for (var j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        d[i][j] = a[i - 1] === b[j - 1]
          ? d[i - 1][j - 1]
          : 1 + Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]);
      }
    }
    return d[m][n];
  }

  function checkMechanics(text) {
    var firstLetter = text.match(/[a-zA-Z]/);
    if (firstLetter && firstLetter[0] !== firstLetter[0].toUpperCase()) {
      return 'Start your answer with a capital letter — right now it starts with "' + firstLetter[0] + '".';
    }
    var lastChar = text.trim().slice(-1);
    if (lastChar && '.!?'.indexOf(lastChar) === -1) {
      return 'End your answer with a period, question mark, or exclamation point.';
    }
    return null;
  }

  function domainTerms(groups) {
    var terms = [];
    groups.forEach(function (group) {
      group.forEach(function (t) {
        if (t.indexOf(' ') === -1 && t.length >= 4) terms.push(t.toLowerCase());
      });
    });
    return terms;
  }

  function checkDomainSpelling(text, groups) {
    var terms = domainTerms(groups);
    if (!terms.length) return null;
    var words = text.toLowerCase().match(/[a-z]+/g) || [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w.length < 4 || terms.indexOf(w) !== -1) continue;
      // A legitimate suffixed form (antibiotic -> antibiotics, cell -> cells,
      // detect -> detecting) isn't a spelling mistake — skip anything that's
      // just the correct term plus a short, common ending, in either
      // direction (kid's word longer, or kid's word is the term's own root).
      var isSuffixedForm = terms.some(function (term) {
        var longer = w.length >= term.length ? w : term;
        var shorter = w.length >= term.length ? term : w;
        return longer.indexOf(shorter) === 0 && (longer.length - shorter.length) <= 3;
      });
      if (isSuffixedForm) continue;
      for (var t = 0; t < terms.length; t++) {
        var term = terms[t];
        var maxDist = term.length >= 7 ? 2 : 1;
        if (Math.abs(w.length - term.length) <= maxDist && levenshtein(w, term) <= maxDist) {
          return w;
        }
      }
    }
    return null;
  }

  // issueType values worth surfacing to a kid: real correctness problems,
  // not LanguageTool's style/phrasing preferences (which would just be noise).
  var LT_ISSUE_TYPES = { misspelling: 1, grammar: 1, typographical: 1 };

  // Whenever LanguageTool's own fix for a word is JUST that word made plural
  // or singular, don't rely on its raw message being clear about that — it
  // can be terse or jargon-y. Detect the pattern ourselves and say so
  // explicitly, so "spelling mistake" never stands in for a number issue.
  function describeNumberChange(from, to) {
    var f = from.toLowerCase(), t = to.toLowerCase();
    if (t === f + 's' || t === f + 'es') return 'plural';
    if (f === t + 's' || f === t + 'es') return 'singular';
    // antibody -> antibodies (y -> ies)
    if (f.slice(-1) === 'y' && t === f.slice(0, -1) + 'ies') return 'plural';
    if (t.slice(-1) === 'y' && f === t.slice(0, -1) + 'ies') return 'singular';
    // life -> lives, leaf -> leaves (f/fe -> ves)
    if (f.slice(-1) === 'f' && t === f.slice(0, -1) + 'ves') return 'plural';
    if (t.slice(-1) === 'f' && f === t.slice(0, -1) + 'ves') return 'singular';
    if (f.slice(-2) === 'fe' && t === f.slice(0, -2) + 'ves') return 'plural';
    if (t.slice(-2) === 'fe' && f === t.slice(0, -2) + 'ves') return 'singular';
    return null;
  }

  // Don't trust LanguageTool's own wording to already be kid-clear — its
  // .message is written for a general adult audience and can lean on terms
  // like "determiner" or "agreement" that won't mean anything to a kid. For
  // the handful of categories LanguageTool reliably sorts things into, build
  // our own plain-English template instead; only fall back to its raw text
  // for open-ended GRAMMAR issues, where no single template fits every case.
  function friendlyGrammarMessage(categoryId, flaggedRaw, ltMessage) {
    switch (categoryId) {
      case 'TYPOS':
        return 'You wrote "' + flaggedRaw + '" — that doesn\'t look like a real word.';
      case 'CASING':
        return 'Check the capital letters around "' + flaggedRaw + '".';
      case 'PUNCTUATION':
        return 'Check the punctuation around "' + flaggedRaw + '".';
      case 'CONFUSED_WORDS':
        return 'You wrote "' + flaggedRaw + '" — that might be the wrong word here.';
      case 'REDUNDANCY':
        return 'You wrote "' + flaggedRaw + '" twice in a row — check for a repeated word.';
      default:
        return 'You wrote "' + flaggedRaw + '" — ' + (ltMessage || 'this needs a second look.');
    }
  }

  function checkGrammarRemote(text, groups, callback) {
    var terms = domainTerms(groups);
    var body = 'text=' + encodeURIComponent(text) + '&language=en-US';
    fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (r) { return r.json(); }).then(function (data) {
      var matches = (data && data.matches) || [];
      for (var i = 0; i < matches.length; i++) {
        var m = matches[i];
        var issueType = m.rule && m.rule.issueType;
        if (!LT_ISSUE_TYPES[issueType]) continue;
        var flaggedRaw = text.slice(m.offset, m.offset + m.length);
        var flagged = flaggedRaw.toLowerCase();
        if (terms.indexOf(flagged) !== -1) continue; // a correct quest term LanguageTool doesn't recognize
        var replacement = (m.replacements && m.replacements.length) ? m.replacements[0].value : null;
        var numberChange = replacement ? describeNumberChange(flaggedRaw, replacement) : null;
        var msg;
        if (numberChange) {
          msg = 'You wrote "' + flaggedRaw + '" — check whether this should be ' + numberChange + '.';
        } else {
          var categoryId = m.rule && m.rule.category && m.rule.category.id;
          msg = friendlyGrammarMessage(categoryId, flaggedRaw, m.message);
        }
        callback({ ok: false, message: msg });
        return;
      }
      callback({ ok: true });
    }).catch(function () {
      callback({ ok: true }); // fail open — never block a kid over an API hiccup
    });
  }

  /* ---- Meaning check (Week 2 only): asks Claude whether a reflection
     answer captures the required idea(s) even if it didn't match any
     keyword. Only ever called AFTER the local keyword check has already
     failed — a real network+LLM round trip on every keystroke would be
     both slow and expensive, so this exists purely as a fallback for a
     kid who answered correctly but phrased it differently than the
     keyword list expects. Fails closed: if the Worker isn't configured
     (no ANTHROPIC_API_KEY yet) or the call errors out, this just reports
     pass:false and the kid sees the same "not quite" retry state as
     before this feature existed — nothing about the site's current
     behavior changes until the key is actually set. */
  function getPromptText(textarea) {
    var p = textarea.parentElement && textarea.parentElement.querySelector('p');
    return p ? p.textContent.trim() : '';
  }
  function checkMeaningRemote(prompt, groups, answer, callback) {
    var base = window.QUEST_SYNC_URL;
    if (!base || !prompt || !answer) { callback({ pass: false }); return; }
    var headers = { 'Content-Type': 'application/json' };
    if (window.QUEST_SYNC_KEY) headers['X-Site-Key'] = window.QUEST_SYNC_KEY;
    fetch(base.replace(/\/$/, '') + '/evaluate', {
      method: 'POST', headers: headers,
      body: JSON.stringify({ prompt: prompt, keywordGroups: groups, answer: answer })
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) {
        callback(res && typeof res.pass === 'boolean' ? { pass: res.pass, feedback: res.feedback } : { pass: false });
      })
      .catch(function () { callback({ pass: false }); });
  }

  function initReflectionChecks(pageKey, configs) {
    // A kid clicking the pass button is not the same as a facilitator
    // granting one — without a check here, "ask facilitator for a pass"
    // is really just a fourth free attempt a kid can click through alone.
    // The PIN has to be entered by whoever is actually standing there.
    configs.forEach(function (cfg) {
      var textarea = document.getElementById(cfg.id);
      if (!textarea) return;

      var storageKey = 'imm-l3-w2-reflect::' + pageKey + '::' + cfg.id;
      var state = loadJSON(storageKey, { attempts: 0, success: false, text: '', langOk: false, langAttempts: 0, langFlagged: false, contentFlagged: false });
      if (state.langOk === undefined) { state.langOk = false; state.langAttempts = 0; state.langFlagged = false; }
      if (state.contentFlagged === undefined) { state.contentFlagged = false; }
      if (state.meaningPassed === undefined) { state.meaningPassed = false; }
      if (state.text) textarea.value = state.text;

      var controls = el('div', 'reflect-controls');
      var btn = el('button', 'btn btn-primary reflect-check-btn', 'Check my thinking');
      btn.type = 'button';
      var feedback = el('div', 'reflect-feedback');
      controls.appendChild(btn);
      controls.appendChild(feedback);

      // No copy/paste in an answer box — it has to be their own typing.
      ['copy', 'cut', 'paste'].forEach(function (evt) {
        textarea.addEventListener(evt, function (e) {
          e.preventDefault();
          feedback.className = 'reflect-feedback retry';
          feedback.textContent = '🚫 Please type your own answer — copy/paste is turned off here.';
        });
      });

      // Facilitator-approved pass: after 3 genuine tries, a kid who still
      // can't land the keywords isn't stuck forever — a facilitator sitting
      // with them can wave it through together. Hidden until attempts >= 3,
      // same bar as the reread hint, so it's a real fallback, not a shortcut
      // from the first try.
      var passBtn = el('button', 'btn btn-ghost reflect-pass-btn', '🙋 Facilitator-approved pass');
      passBtn.type = 'button';
      passBtn.style.display = 'none';
      textarea.insertAdjacentElement('afterend', passBtn);

      var hint = el('div', 'reflect-hint');

      textarea.insertAdjacentElement('afterend', hint);
      textarea.insertAdjacentElement('afterend', controls);

      // Autosave as they type. Without this, a typed answer only ever
      // reached localStorage inside the "Check my thinking" click handler
      // below, so a kid who typed an answer and then navigated away,
      // closed the tab, or just got interrupted before clicking Check lost
      // everything they'd written, on this exact device, no reload or
      // sync needed to trigger it. This never touches success/attempts,
      // only the raw text, so it can't fake a passed check.
      textarea.addEventListener('input', function () {
        state.text = textarea.value;
        persist();
      });

      function persist() { saveJSON(storageKey, state); }

      function setContentHint() {
        hint.innerHTML = '📖 Take another look: <a href="#' + cfg.reread.anchor + '">' + cfg.reread.label + ' →</a>';
      }
      function setSpellingHint(word) {
        hint.innerHTML = '📖 Double-check the spelling of "' + word + '" here: <a href="#' + cfg.reread.anchor + '">' + cfg.reread.label + ' →</a>';
      }

      function render() {
        passBtn.style.display = (!state.success && state.attempts >= 3) ? 'inline-block' : 'none';
        if (state.success && state.langOk) {
          feedback.className = 'reflect-feedback hit';
          feedback.textContent = state.contentFlagged
            ? "📋 Facilitator-approved pass — logged as a genuine attempt. Go over this one together."
            : state.langFlagged
            ? "✅ Got the key idea — logged for a quick writing check-in with your facilitator."
            : state.meaningPassed
            ? "✅ Nice — that's the right idea, just said in your own words."
            : "✅ Nice — you've got the key idea, clearly written.";
          hint.style.display = 'none';
        } else if (!state.success && state.attempts >= 3) {
          setContentHint();
          feedback.className = 'reflect-feedback retry';
          feedback.textContent = "🤔 Still missing something — here's where to look below, or ask your facilitator for a pass.";
          hint.style.display = 'block';
        } else if (!state.success && state.attempts > 0) {
          feedback.className = 'reflect-feedback retry';
          feedback.textContent = '🤔 Not quite the full picture yet — revise and check again.';
          hint.style.display = 'none';
        } else if (state.success && !state.langOk) {
          // Content passed in an earlier session but the writing check never
          // finished (e.g. they left mid-check, or this is older saved data
          // from before the writing check existed).
          feedback.className = 'reflect-feedback retry';
          feedback.textContent = '👉 Click "Check my thinking" once more to review your writing.';
          hint.style.display = 'none';
        }
      }
      render();

      // Runs after content already passed. Mechanics and spelling are local
      // and instant; grammar is the one async step, shown with its own
      // "checking" state so a network beat never looks like nothing happened.
      function runLanguageCheck() {
        // Capitalization/punctuation are instant, no-brainer fixes — they
        // don't cost a try, unlimited retries, no escalation.
        var mech = checkMechanics(state.text);
        if (mech) {
          hint.style.display = 'none';
          feedback.className = 'reflect-feedback retry';
          feedback.textContent = '✍️ ' + mech;
          return;
        }

        var spellWord = checkDomainSpelling(state.text, cfg.groups);
        if (spellWord) {
          failLanguageAttempt(function () {
            setSpellingHint(spellWord);
            feedback.className = 'reflect-feedback retry';
            feedback.textContent = '✍️ Almost — one word looks misspelled. See below.';
            hint.style.display = 'block';
          });
          return;
        }

        hint.style.display = 'none';
        feedback.className = 'reflect-feedback checking';
        feedback.textContent = '⏳ Checking your writing…';
        checkGrammarRemote(state.text, cfg.groups, function (result) {
          if (result.ok) {
            state.langOk = true;
            persist();
            render();
            return;
          }
          failLanguageAttempt(function () {
            feedback.className = 'reflect-feedback retry';
            feedback.textContent = '✍️ ' + result.message;
          });
        });
      }

      // Only spelling and grammar misses count toward the 3-try budget —
      // these are the ones that take real thought/lookup to fix, unlike a
      // missing capital letter. showMessage() renders the specific miss;
      // called only when the budget isn't already exhausted.
      function failLanguageAttempt(showMessage) {
        state.langAttempts++;
        persist();
        if (state.langAttempts >= 3) { acceptWithFlag(); return; }
        showMessage();
      }

      function acceptWithFlag() {
        state.langOk = true;
        state.langFlagged = true;
        persist();
        render();
      }

      btn.addEventListener('click', function () {
        var text = textarea.value.trim();
        if (!text) {
          feedback.className = 'reflect-feedback retry';
          feedback.textContent = '👉 Write your thinking first, then check it.';
          return;
        }
        state.text = text;

        if (!state.success) {
          state.attempts++;
          state.success = checkKeywordGroups(text, cfg.groups);
          persist();
          if (!state.success) {
            feedback.className = 'reflect-feedback checking';
            feedback.textContent = '🤔 Checking your answer’s meaning…';
            hint.style.display = 'none';
            checkMeaningRemote(getPromptText(textarea), cfg.groups, text, function (result) {
              if (result.pass) {
                state.success = true;
                state.meaningPassed = true;
                persist();
                state.langOk = false;
                runLanguageCheck();
                return;
              }
              render();
            });
            return;
          }
        }

        // Content is right (just now, or from a previous try) — check writing.
        state.langOk = false;
        runLanguageCheck();
      });

      passBtn.addEventListener('click', function () {
        var text = textarea.value.trim();
        if (!text) {
          feedback.className = 'reflect-feedback retry';
          feedback.textContent = '👉 Write your honest attempt first, then ask for a pass.';
          return;
        }
        FacilitatorPin.ask(function (ok) {
          if (!ok) {
            feedback.className = 'reflect-feedback retry';
            feedback.textContent = '🔒 A facilitator has to enter the PIN themselves to grant a pass.';
            return;
          }
          state.text = text;
          state.success = true;
          state.langOk = true;
          state.contentFlagged = true;
          persist();
          render();
        });
      });
    });
  }

  /* ---- Side notes drawer: a free-text scratchpad, auto-saved per kid/page,
     plus the highlighter's collected-words list rendered at its top. ---- */
  function initNotesDrawer(pageKey) {
    var toggleBtn = document.getElementById('notes-toggle-btn');
    var drawer = document.getElementById('notes-drawer');
    var backdrop = document.getElementById('notes-backdrop');
    var closeBtn = document.getElementById('notes-drawer-close');
    var textarea = document.getElementById('notes-textarea');
    var savedMsg = document.getElementById('notes-saved-msg');
    if (!drawer || !textarea) return;

    var storageKey = 'imm-l3-w2-notes::' + pageKey;
    textarea.value = localStorage.getItem(storageKey) || '';

    function open() { drawer.classList.add('open'); if (backdrop) backdrop.classList.add('show'); }
    function close() { drawer.classList.remove('open'); if (backdrop) backdrop.classList.remove('show'); }

    if (toggleBtn) toggleBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    textarea.addEventListener('input', function () {
      try { localStorage.setItem(storageKey, textarea.value); } catch (e) {}
      if (savedMsg) {
        savedMsg.textContent = '✓ Saved';
        clearTimeout(textarea._saveTimer);
        textarea._saveTimer = setTimeout(function () { savedMsg.textContent = ''; }, 1200);
      }
    });
  }

  /* ---- Side glossary drawer: a static reference list, kept out of the
     reading flow (so it doesn't crowd the page) but reachable from
     anywhere via the header button. Mirrors the notes drawer's open/close
     pattern with its own independent backdrop. ---- */
  function initGlossaryDrawer() {
    var toggleBtn = document.getElementById('glossary-toggle-btn');
    var drawer = document.getElementById('glossary-drawer');
    var backdrop = document.getElementById('glossary-backdrop');
    var closeBtn = document.getElementById('glossary-drawer-close');
    if (!drawer) return;

    function open() { drawer.classList.add('open'); if (backdrop) backdrop.classList.add('show'); }
    function close() { drawer.classList.remove('open'); if (backdrop) backdrop.classList.remove('show'); }

    if (toggleBtn) toggleBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
  }

  /* ---- Day 1 game: a term-matching game wrapping up the whole reading.
     Framed as play, not evaluation — the "score" is moves taken, there's no
     pass/fail, and a wrong guess just shakes and resets the pick. Progress
     (which pairs are already matched, and the move count) persists per
     kid/page/game so coming back later shows where they left off. ---- */
  function initMatchGame(containerId, pairs, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    var storageKey = 'imm-l3-w2-game::' + (opts.pageKey || '') + '::' + containerId;
    var saved = loadJSON(storageKey, null);
    var best = (saved && saved.best) || null;
    var matched = (saved && saved.matched) || {};
    var moves = (saved && saved.moves) || 0;
    var selectedTerm = null;
    var finished = false;
    var termEls = {}, defEls = {};

    function persist() { saveJSON(storageKey, { matched: matched, moves: moves, best: best }); }

    function bestLabel() {
      return best ? ('🏆 Best ' + best.moves + ' move' + (best.moves === 1 ? '' : 's')) : 'Be first to set the best score!';
    }
    function starRating(m) {
      var par = pairs.length;
      if (m <= par) return 3;
      if (m <= Math.ceil(par * 1.6)) return 2;
      return 1;
    }
    function starString(n) {
      var s = '';
      for (var i = 0; i < 3; i++) s += (i < n) ? '★' : '☆';
      return s;
    }

    var wrap = el('div', 'match-game');
    var status = el('div', 'match-game-status');
    var meta = el('div', 'match-game-meta');
    var bestEl = el('span', 'match-best', bestLabel());
    meta.appendChild(bestEl);
    var cols = el('div', 'match-cols');
    var termsCol = el('div', 'match-col');
    var defsCol = el('div', 'match-col');
    var resultWrap = el('div', 'match-result');
    cols.appendChild(termsCol);
    cols.appendChild(defsCol);
    wrap.appendChild(status);
    wrap.appendChild(meta);
    wrap.appendChild(cols);
    wrap.appendChild(resultWrap);
    container.appendChild(wrap);

    function updateStatus() {
      var count = Object.keys(matched).filter(function (k) { return matched[k]; }).length;
      status.textContent = 'Matched ' + count + ' of ' + pairs.length + ' · ' + moves + ' move' + (moves === 1 ? '' : 's');
      if (count === pairs.length && !finished) finishGame(true);
    }

    function spawnConfetti(host) {
      var bits = ['🎉', '✨', '🎊', '⭐'];
      for (var i = 0; i < 12; i++) {
        var bit = el('span', 'match-confetti', bits[i % bits.length]);
        bit.style.left = (Math.random() * 96) + '%';
        bit.style.animationDelay = (Math.random() * 0.3) + 's';
        host.appendChild(bit);
        (function (b) {
          setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 1500);
        })(bit);
      }
    }

    function finishGame(justNow) {
      finished = true;
      var isRecord = !!justNow && (!best || moves < best.moves);
      if (isRecord) best = { moves: moves };
      persist();
      status.textContent = '🎉 Solved!';
      status.classList.add('done');
      wrap.classList.add('match-finished');
      bestEl.textContent = bestLabel();
      resultWrap.innerHTML = '';
      resultWrap.appendChild(el('div', 'match-stars', starString(starRating(moves))));
      resultWrap.appendChild(el('div', 'match-summary', moves + ' move' + (moves === 1 ? '' : 's')));
      if (isRecord) resultWrap.appendChild(el('div', 'match-record-badge', '🏆 New record!'));
      var again = el('button', 'match-again-btn', '🔄 Play again');
      again.type = 'button';
      again.addEventListener('click', resetGame);
      resultWrap.appendChild(again);
      if (justNow) spawnConfetti(wrap);
    }

    function render() {
      termsCol.innerHTML = ''; defsCol.innerHTML = ''; termEls = {}; defEls = {};

      shuffle(pairs.map(function (_, i) { return i; })).forEach(function (i) {
        var t = el('div', 'match-item', pairs[i][0]);
        if (matched[i]) t.classList.add('matched');
        t.addEventListener('click', function () {
          if (matched[i] || finished) return;
          Object.keys(termEls).forEach(function (k) { termEls[k].classList.remove('selected'); });
          t.classList.add('selected');
          selectedTerm = i;
        });
        termsCol.appendChild(t);
        termEls[i] = t;
      });

      shuffle(pairs.map(function (_, i) { return i; })).forEach(function (i) {
        var d = el('div', 'match-item', pairs[i][1]);
        if (matched[i]) d.classList.add('matched');
        d.addEventListener('click', function () {
          if (matched[i] || selectedTerm === null || finished) return;
          moves++;
          var chosen = selectedTerm;
          if (chosen === i) {
            matched[i] = true;
            termEls[i].classList.remove('selected');
            termEls[i].classList.add('matched');
            d.classList.add('matched');
            selectedTerm = null;
            persist();
            updateStatus();
          } else {
            d.classList.add('shake');
            termEls[chosen].classList.add('shake');
            setTimeout(function () {
              d.classList.remove('shake');
              if (termEls[chosen]) termEls[chosen].classList.remove('shake', 'selected');
            }, 350);
            selectedTerm = null;
            persist();
            updateStatus();
          }
        });
        defsCol.appendChild(d);
        defEls[i] = d;
      });
    }

    function resetGame() {
      matched = {}; moves = 0; selectedTerm = null; finished = false;
      status.classList.remove('done');
      wrap.classList.remove('match-finished');
      resultWrap.innerHTML = '';
      persist();
      render();
      updateStatus();
    }

    render();
    var alreadyDone = Object.keys(matched).filter(function (k) { return matched[k]; }).length === pairs.length;
    if (alreadyDone) {
      finishGame(false);
    } else {
      updateStatus();
    }
  }


  /* ---- Complete My Quest ----
     Once every reflection question on the page has actually been validated
     (state.success) and every build-checklist item (if this page has one)
     is checked, a one-time full-quest celebration takes over: a confetti
     burst plus a completion card. It won't retrigger every visit — a
     persisted flag keeps the popup itself one-time — but a small persistent
     badge stays at the top of the page on every later visit so "done" is
     always visible, not just a one-off animation. */
  function initCompleteQuest(pageKey) {
    var reflIds = Array.prototype.map.call(document.querySelectorAll('textarea[id^="refl-"]'), function (ta) { return ta.id; });
    if (!reflIds.length) return;
    var buildItems = document.querySelectorAll('.build-check-item');
    var doneKey = 'imm-l3-w2-quest-completed::' + pageKey;

    // Placed at the end of whichever day-block happens to be last on this
    // page — never a hardcoded day number, since that differs per group
    // (Day 3 for most, Day 5 for Benjamin).
    var dayBlocks = document.querySelectorAll('.day-block');
    var lastDay = dayBlocks.length ? dayBlocks[dayBlocks.length - 1] : document.querySelector('main');
    if (!lastDay) return;

    var section = el('div', 'quest-complete-section');
    section.id = 'quest-complete-section';
    lastDay.appendChild(section);

    function reflSuccess(id) {
      var s = loadJSON('imm-l3-w2-reflect::' + pageKey + '::' + id, null);
      return !!(s && s.success);
    }

    function buildDoneCount() {
      var state = loadJSON('imm-l3-w2-build::' + pageKey, {});
      return Array.prototype.filter.call(buildItems, function (_, i) { return !!state[i]; }).length;
    }

    function remaining() {
      var reflLeft = reflIds.filter(function (id) { return !reflSuccess(id); }).length;
      var buildLeft = buildItems.length - buildDoneCount();
      return reflLeft + buildLeft;
    }

    function isDone() {
      try { return localStorage.getItem(doneKey) === '1'; } catch (e) { return false; }
    }

    function burstConfetti(host) {
      var bits = ['🎉', '✨', '🎊', '⭐', '🏆'];
      for (var i = 0; i < 40; i++) {
        var bit = el('span', 'qc-confetti', bits[i % bits.length]);
        bit.style.left = (Math.random() * 100) + '%';
        bit.style.animationDelay = (Math.random() * 0.6) + 's';
        bit.style.animationDuration = (2 + Math.random() * 1.2) + 's';
        host.appendChild(bit);
        (function (b) { setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 3200); })(bit);
      }
    }

    function showCelebration() {
      if (document.getElementById('quest-complete-overlay')) return;
      var overlay = el('div', 'quest-complete-overlay');
      overlay.id = 'quest-complete-overlay';
      var card = el('div', 'quest-complete-card');
      card.innerHTML = '<div class="qc-emoji">🎉</div><h2>Quest Complete!</h2><p>Every check is validated — nice work.</p>';
      var closeBtn = el('button', 'qc-close-btn', 'Keep exploring');
      closeBtn.type = 'button';
      closeBtn.addEventListener('click', function () { overlay.classList.remove('show'); });
      card.appendChild(closeBtn);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      requestAnimationFrame(function () { overlay.classList.add('show'); });
      burstConfetti(overlay);
    }

    // The button itself is the one deliberate "I'm done" action — reaching
    // 0 remaining checks only unlocks it, it doesn't auto-fire the
    // celebration or mark the quest done on its own. That explicit click is
    // also what the staff portal's Status column treats as authoritative
    // "Completed" (see collectSyncState below), same as a real classroom
    // submission — not just a silent threshold crossing.
    function render() {
      if (isDone()) {
        section.innerHTML = '<div class="qc-done">✅ <strong>Quest Complete!</strong> Great work — every check passed.</div>';
        return;
      }
      var left = remaining();
      if (left === 0) {
        section.innerHTML = '<div class="qc-ready"><p>Every check is validated. Ready to close it out?</p>' +
          '<button type="button" class="qc-finish-btn" id="qc-finish-btn">🎉 Complete My Quest</button></div>';
      } else {
        section.innerHTML = '<div class="qc-pending"><p>' + left + ' check' + (left === 1 ? '' : 's') + ' still need' + (left === 1 ? 's' : '') + ' to pass before you can complete your quest.</p>' +
          '<button type="button" class="qc-finish-btn" id="qc-finish-btn" disabled>🏁 Complete My Quest</button></div>';
      }
    }

    section.addEventListener('click', function (e) {
      if (!e.target || e.target.id !== 'qc-finish-btn') return;
      try { localStorage.setItem(doneKey, '1'); } catch (err) {}
      render();
      showCelebration();
    });

    render();
    document.addEventListener('click', render);
    document.addEventListener('input', render);
    document.addEventListener('change', render);
  }

  /* ---- Cross-device progress sync ----
     Every subsystem above already reads/writes its own localStorage key,
     scoped by pageKey. This walks those same keys, bundles them into one
     blob, and syncs it through the staff portal's progress Worker — so the
     same kid on a different device picks up where they left off, and so
     the staff portal's Feedback pages can show real usage instead of
     nothing at all. If window.QUEST_SYNC_URL isn't set, every function
     here is a silent no-op — the page still works entirely off
     localStorage, same as before this existed. */

  function collectSyncState(pageKey) {
    var state = {
      build: loadJSON('imm-l3-w2-build::' + pageKey, {}),
      materials: loadJSON('imm-l3-w2-materials::' + pageKey, null),
      fields: loadJSON('imm-l3-w2-fields::' + pageKey, {}),
      hl: loadJSON('imm-l3-w2-hl::' + pageKey, []),
      notes: localStorage.getItem('imm-l3-w2-notes::' + pageKey) || '',
      reflect: {},
      dayTime: loadJSON('imm-l3-w2-time::' + pageKey, {}),
      completed: localStorage.getItem('imm-l3-w2-quest-completed::' + pageKey) === '1'
    };
    document.querySelectorAll('textarea[id^="refl-"]').forEach(function (ta) {
      state.reflect[ta.id] = loadJSON('imm-l3-w2-reflect::' + pageKey + '::' + ta.id, null);
    });
    return state;
  }

  function applySyncState(pageKey, state) {
    if (!state) return;
    if (state.build) saveJSON('imm-l3-w2-build::' + pageKey, state.build);
    if (state.materials) saveJSON('imm-l3-w2-materials::' + pageKey, state.materials);
    if (state.fields) saveJSON('imm-l3-w2-fields::' + pageKey, state.fields);
    if (state.hl) saveJSON('imm-l3-w2-hl::' + pageKey, state.hl);
    if (typeof state.notes === 'string') { try { localStorage.setItem('imm-l3-w2-notes::' + pageKey, state.notes); } catch (e) {} }
    if (state.reflect) {
      Object.keys(state.reflect).forEach(function (id) {
        if (state.reflect[id]) saveJSON('imm-l3-w2-reflect::' + pageKey + '::' + id, state.reflect[id]);
      });
    }
    if (state.dayTime) saveJSON('imm-l3-w2-time::' + pageKey, state.dayTime);
    if (typeof state.completed === 'boolean') {
      try { localStorage.setItem('imm-l3-w2-quest-completed::' + pageKey, state.completed ? '1' : '0'); } catch (e) {}
    }
  }

  /* Time-on-task per day, via IntersectionObserver — no click-tracking
     guesswork. A day counts as "active" while its section is at least 40%
     in view AND the tab itself is visible; a 5s tick adds to that day's
     running total. Ticks stop the moment neither condition holds, so a
     backgrounded tab or a scrolled-away section never inflates the number. */
  /* Time-on-task per day, via IntersectionObserver — no click-tracking
     guesswork. A day counts as "active" while a thin band near the
     vertical center of the viewport overlaps its section (day sections
     routinely run many times taller than the viewport, so a ratio
     threshold against the section's OWN height would almost never fire —
     a kid scrolled deep into a long Day 1 reading could sit at 0% forever;
     this rootMargin trick sidesteps that entirely). A 1s tick adds to that
     day's running total while the tab is visible. This is the ONE real,
     persisted record of time spent — it also drives the kid-visible clock
     in the header (#session-timer), so what a kid sees is never a
     decorative fake number: it's the exact figure saved to localStorage,
     synced cross-device, and shown in the staff portal's Feedback report.
     Because it reads its starting value from localStorage, it picks up
     exactly where it left off on reload or on a different device — it
     never resets to zero. */
  function initDayTimer(pageKey) {
    var dayBlocks = document.querySelectorAll('.day-block[id]');
    if (!dayBlocks.length || typeof IntersectionObserver === 'undefined') return;
    var storageKey = 'imm-l3-w2-time::' + pageKey;
    var time = loadJSON(storageKey, {});
    var active = null;
    var timerEl = document.getElementById('session-timer');

    function persist() { saveJSON(storageKey, time); }

    function totalMs() {
      return Object.keys(time).reduce(function (sum, k) { return sum + (time[k] || 0); }, 0);
    }

    function fmt(ms) {
      var totalSec = Math.floor(ms / 1000);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = totalSec % 60;
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      return h > 0 ? (h + ':' + pad(m) + ':' + pad(s)) : (m + ':' + pad(s));
    }

    function render() {
      if (!timerEl) return;
      var dayLabel = active ? 'Day ' + active.replace('day', '') + ': ' + fmt(time[active] || 0) : fmt(0);
      timerEl.textContent = '⏱ ' + dayLabel + ' · Total ' + fmt(totalMs());
    }

    function tick() {
      if (!active || document.hidden || window.QUEST_FACILITATOR_MODE) { render(); return; }
      time[active] = (time[active] || 0) + 1000;
      persist();
      render();
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) active = entry.target.id;
      });
      render();
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    dayBlocks.forEach(function (b) { observer.observe(b); });

    render();
    setInterval(tick, 1000);
    window.addEventListener('beforeunload', persist);
  }

  function initProgressSync(pageKey, group, week) {
    var workerUrl = window.QUEST_SYNC_URL;
    if (!workerUrl) return Promise.resolve();
    var siteKey = window.QUEST_SYNC_KEY;
    var syncedAtKey = 'imm-l3-w2-synced-at::' + pageKey;
    var base = workerUrl.replace(/\/$/, '');

    function headers() {
      var h = { 'Content-Type': 'application/json' };
      if (siteKey) h['X-Site-Key'] = siteKey;
      return h;
    }

    function pull() {
      var url = base + '/sync?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(pageKey) + '&week=' + encodeURIComponent(week);
      return fetch(url, { headers: headers() })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (res) {
          if (!res || !res.found) return;
          var localSyncedAt = localStorage.getItem(syncedAtKey);
          if (!localSyncedAt || new Date(res.data.updatedAt) > new Date(localSyncedAt)) {
            applySyncState(pageKey, res.data.state);
            try { localStorage.setItem(syncedAtKey, res.data.updatedAt); } catch (e) {}
          }
        })
        .catch(function () {});
    }

    // A push is "pending" the moment something real changes, and that
    // pending flag is PERSISTED (not just an in-memory variable) and only
    // cleared once the server actually confirms it — a failed attempt
    // (network error, rate limit, Worker outage) leaves it set instead of
    // silently dropping it. Kids don't return to the same device, so
    // "wait for the next edit to retry" isn't good enough on its own: a
    // pending push also retries on the very next load of this exact page
    // (even one with no new typing at all) and periodically for as long
    // as this tab stays open, so a device that's only ever opened once
    // more — even just to look — still gets its progress flushed.
    var pendingKey = 'imm-l3-w2-sync-pending::' + pageKey;
    function isPending() { return localStorage.getItem(pendingKey) === '1'; }
    function markPending() { try { localStorage.setItem(pendingKey, '1'); } catch (e) {} }
    function clearPending() { try { localStorage.removeItem(pendingKey); } catch (e) {} }

    var inFlight = false;
    function pushNow() {
      if (window.QUEST_FACILITATOR_MODE || !isPending() || inFlight) return;
      inFlight = true;
      var body = { group: group, kid: pageKey, week: week, state: collectSyncState(pageKey) };
      fetch(base + '/sync', { method: 'POST', headers: headers(), body: JSON.stringify(body) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (res) {
          if (res && res.updatedAt) {
            clearPending();
            try { localStorage.setItem(syncedAtKey, res.updatedAt); } catch (e) {}
          }
          // no res (network error, rate limit, non-2xx) leaves isPending()
          // true — retried on the next trigger, next load, or the next
          // periodic sweep below.
        })
        .catch(function () {})
        .then(function () { inFlight = false; });
    }

    var pushTimer = null;
    function schedulePush() {
      markPending();
      clearTimeout(pushTimer);
      pushTimer = setTimeout(pushNow, 2500);
    }

    // 'input'/'change' already cover every real state edit (textareas,
    // checkboxes). Clicks only need to trigger a push for the specific
    // interactions that change tracked state but aren't input/change
    // events — the reflection-check button, a highlighter color pick or
    // removal, a match-game tile. Anything else (the gate-confirm button,
    // nav links, print/notes buttons, the pause button) must NOT push —
    // merely opening a kid's page and confirming the gate should never by
    // itself create a synced record, since that also happens when a
    // facilitator is just checking on them.
    var CLICK_TRIGGERS = '.reflect-check-btn, .hl-swatch, .hl-remove-btn, .match-item, #qc-finish-btn';
    document.addEventListener('input', schedulePush);
    document.addEventListener('change', schedulePush);
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest(CLICK_TRIGGERS)) schedulePush();
    });
    window.addEventListener('beforeunload', pushNow);

    // Keep retrying a pending push for as long as this tab stays open —
    // covers a Worker outage that recovers mid-visit.
    setInterval(function () { if (isPending()) pushNow(); }, 20000);

    return pull().then(function () {
      // Catch up on anything left pending from an EARLIER visit to this
      // exact device — e.g. a push that failed during a Worker outage and
      // never got a second chance because the tab was closed right after.
      if (isPending()) pushNow();
    });
  }


  /* ---- Facilitator View ----
     window.QUEST_FACILITATOR_MODE is set synchronously by the page's own
     inline <head> script (reading ?fac=1 from the URL), BEFORE this file
     or any of its init calls ever run — so there is no window between
     page-load and "the facilitator remembers to flip a switch" where
     tracking could slip through. Toggling always goes through a full
     reload into the correct clean state in both directions, never an
     in-place flip: entering re-navigates to this exact page + ?fac=1,
     exiting re-navigates to it with that param stripped. The initial pull
     (reading, not writing) still happens normally in this mode, since
     that's harmless regardless of who's viewing — only the day-timer's
     accumulation and every sync push are suppressed. A persistent banner
     (not just the corner button) makes the mode unmistakable at any
     scroll position, since the URL itself is now what carries the state —
     unlike the old per-click toggle, leaving a tab sitting on a ?fac=1
     link is now visible at a glance, not just invisible in memory. */
  function initFacilitatorCheck() {
    var btn = document.getElementById('facilitator-check-btn');
    var banner = document.getElementById('facilitator-banner');
    var active = !!window.QUEST_FACILITATOR_MODE;

    document.documentElement.classList.toggle('facilitator-mode', active);
    if (banner) banner.style.display = active ? 'block' : 'none';
    if (!btn) return;
    btn.classList.toggle('active', active);
    btn.textContent = active ? '🧑‍🏫 Exit Facilitator View' : '🧑‍🏫 Facilitator View';

    btn.addEventListener('click', function () {
      var url = new URL(window.location.href);
      if (active) url.searchParams.delete('fac');
      else url.searchParams.set('fac', '1');
      window.location.href = url.toString();
    });
  }

  window.QuestUI = {
    el: el, shuffle: shuffle, pickRandom: pickRandom,
    initMaterialsPool: initMaterialsPool, initPrintSlip: initPrintSlip,
    initKidGate: initKidGate, initHighlighter: initHighlighter, initNotesDrawer: initNotesDrawer,
    initReflectionChecks: initReflectionChecks, initBuildChecklist: initBuildChecklist,
    initGlossaryDrawer: initGlossaryDrawer,
    initFieldAutosave: initFieldAutosave, initProgressBar: initProgressBar,
    initMatchGame: initMatchGame, initProgressSync: initProgressSync, initDayTimer: initDayTimer,
    initSectionLock: initSectionLock, initCompleteQuest: initCompleteQuest, initDayLock: initDayLock,
    initFacilitatorCheck: initFacilitatorCheck,
    initPresentationAutofill: initPresentationAutofill,
    KID_KEY: KID_KEY
  };

  document.addEventListener('DOMContentLoaded', function () {
    initPrintSlip();
  });
})();
