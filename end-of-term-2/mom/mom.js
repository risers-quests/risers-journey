/* Term 2 Conference — Minutes of Meeting, following the conference plan
   (Thursday 15 October, two 20-minute parts):

   Part 1 · Reflection & Problem-Solving — parents and child together write
     what's working, what's not, questions they have, and ideas they'd like
     to try in Term 3. Filled in on the Riser's own page (with their
     parents), or typed in by staff.
   Part 2 · Planning Together — parents, child and staff share reflections
     and agree on at least one concrete idea for Term 3, with what the
     parent (gardener), child (plant) and teacher (steward) will each do and
     how they'll know it's working. Written by staff; the Riser sees it.

   The family and staff can be typing at the same time, so the two parts
   are kept in separate records per Riser and never collide: Part 1 under
   week key term2-mom-family, Part 2 under term2-mom. Each save also
   fetches the latest copy of its record and writes back only the fields
   this page changed, for two staff in Part 2 at once. Records written in
   the earlier MOM format (brief / next / focus, in term2-mom) still show,
   under "Earlier notes".

   Staff: ?editAs=<Name>&kid=<slug> (from the Term 2 Conference status
   table). Riser: their own page, signed in from Home. */
(function () {
  var WEEK_KEY = 'term2-mom';          // Part 2 (and older-format notes)
  var FAMILY_KEY = 'term2-mom-family'; // Part 1
  var CONFERENCE_DATE = 'Thursday 15 October';
  var MAX_IDEAS = 3;
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var editAs = params.get('editAs');
  var STAFF_AUTHORS = ['Jeran', 'Nishitha', 'Blessy'];

  var PART1 = [
    { id: 'p1_working', label: 'What’s working', hint: 'What’s going well this term — at home, at LifeHub, in learning.' },
    { id: 'p1_notWorking', label: 'What’s not working', hint: 'What feels hard, or isn’t going the way we hoped.' },
    { id: 'p1_questions', label: 'Questions we have', hint: 'Anything we’re wondering about or want to ask.' },
    { id: 'p1_ideas', label: 'Ideas we’d like to try in Term 3', hint: 'Changes or new things we could try.' }
  ];
  var IDEA_FIELDS = [
    { id: 'idea', label: 'The idea', hint: 'One concrete thing to try in Term 3.' },
    { id: 'parent', label: 'Parent (the gardener) will…', hint: 'The care, boundaries or environment at home.' },
    { id: 'child', label: 'Child (the plant) will…', hint: 'What the child will do.' },
    { id: 'staff', label: 'Teacher (the steward) will…', hint: 'How staff will observe, nurture and support.' },
    { id: 'check', label: 'How we’ll know it’s working', hint: 'What we’ll look for, and when we’ll check in.' }
  ];
  var OLD_FIELDS = [
    { id: 'brief', label: 'This term, in brief' },
    { id: 'next', label: 'What to expect next term' },
    { id: 'focus', label: 'Focus for next term' }
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
  function text(v) { return escapeHtml(v).replace(/\n/g, '<br>'); }
  function filled(v) { return v && String(v).trim(); }
  function ideasOf(state) {
    return ((state && state.p2_ideas) || []).filter(function (i) {
      return i && IDEA_FIELDS.some(function (f) { return filled(i[f.id]); });
    });
  }

  /* ---------- merge-safe saving ---------- */

  // Saves only `changes` on top of the latest stored record, so the family
  // (Part 1) and staff (Part 2) never overwrite each other's typing.
  function makeSaver(kid, weekKey, setStatus, onMerged) {
    var pending = {};
    var timer = null;
    function flush() {
      var changes = pending;
      pending = {};
      setStatus('saving');
      return window.eot2Fetch(kid.group, kid.slug, weekKey).then(function (data) {
        var merged = Object.assign({}, (data && data.state) || {}, changes);
        window.eot2SaveLocal(weekKey, kid.slug, merged);
        return window.eot2Save(kid.group, kid.slug, weekKey, merged).then(function (res) {
          setStatus(res.ok ? 'saved' : 'offline');
          if (!res.ok) Object.keys(changes).forEach(function (k) { if (!(k in pending)) pending[k] = changes[k]; });
          if (onMerged) onMerged(merged, Object.keys(pending).length > 0);
        });
      });
    }
    return {
      set: function (key, value) {
        pending[key] = value;
        setStatus('saving');
        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, 1000);
      },
      busy: function () { return Object.keys(pending).length > 0; }
    };
  }

  function statusSetter(node) {
    return function (mode) {
      node.className = 'eot2-status eot2-status-' + mode;
      node.textContent = mode === 'saved' ? 'Saved' : mode === 'saving' ? 'Saving…' : 'Not synced';
    };
  }

  function textField(f, value, onInput, rows) {
    var wrap = el('div', 'mom-field');
    wrap.appendChild(el('label', null, f.label));
    if (f.hint) wrap.appendChild(el('p', 'mom-hint', f.hint));
    var ta = el('textarea', 'eot2-textarea');
    ta.rows = rows || 3;
    ta.value = value || '';
    ta.addEventListener('input', function () { onInput(ta.value); });
    wrap.appendChild(ta);
    return { wrap: wrap, ta: ta };
  }

  function partHead(num, title, who, note) {
    return el('div', 'mom-part-head',
      '<span class="mom-part-num">Part ' + num + '</span>' +
      '<div><h2>' + title + '</h2><p>' + who + ' &middot; 20 minutes' + (note ? ' &middot; ' + note : '') + '</p></div>');
  }

  function oldNotesSection(state) {
    var old = OLD_FIELDS.filter(function (f) { return filled(state[f.id]); });
    if (!old.length) return null;
    var sec = el('section', 'mom-part mom-old');
    sec.appendChild(el('h2', 'mom-old-title', 'Earlier notes'));
    old.forEach(function (f) {
      sec.appendChild(el('div', 'mom-read', '<h3>' + f.label + '</h3><p>' + text(state[f.id]) + '</p>'));
    });
    return sec;
  }

  function ideaReadHtml(idea, n) {
    return '<div class="mom-idea-read">' +
      '<p class="mom-idea-title"><span>Idea ' + n + '</span>' + (filled(idea.idea) ? text(idea.idea) : '—') + '</p>' +
      IDEA_FIELDS.slice(1).filter(function (f) { return filled(idea[f.id]); }).map(function (f) {
        return '<div class="mom-role"><strong>' + f.label.replace('…', '') + '</strong><p>' + text(idea[f.id]) + '</p></div>';
      }).join('') +
    '</div>';
  }

  /* ---------- staff ---------- */

  function showStaffPicker() {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/index.html">Home</a> &middot; <a href="../staff/index.html">Term 2 Conference</a>'));
    var list = el('div', 'ans-list');
    window.EOT2_KIDS.forEach(function (k) {
      var a = el('a', 'ans-list-row', '<strong>' + k.name + '</strong><span>&nbsp;</span><em aria-hidden="true">&rarr;</em>');
      a.href = 'index.html?editAs=' + encodeURIComponent(editAs) + '&kid=' + k.slug;
      list.appendChild(a);
    });
    app.appendChild(el('div', 'eot2-head', '<h1>Minutes of Meeting</h1><p>Choose a Riser’s conference.</p>'));
    app.appendChild(list);
  }

  function renderStaff(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/index.html">Home</a> &middot; <a href="../staff/index.html">Term 2 Conference</a> &middot; <a href="index.html?editAs=' + encodeURIComponent(editAs) + '&pick=1">switch Riser</a>'));
    var header = el('div', 'eot2-form-header');
    header.innerHTML =
      '<div><p class="mom-eyebrow">Term 2 Conference &middot; ' + CONFERENCE_DATE + '</p><h1>Minutes of Meeting &mdash; ' + kid.name + '</h1>' +
      '<div class="eot2-sub">Part 2 written by ' + escapeHtml(editAs) + '</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>';
    app.appendChild(header);
    var body = el('div', 'mom-body');
    app.appendChild(body);

    var p1Areas = {};
    var setStatus = statusSetter(document.getElementById('save-status'));
    function refreshPart1(st) {
      // Pick up the family's latest Part 1 typing, without touching a box
      // staff are typing in right now.
      PART1.forEach(function (f) {
        var ta = p1Areas[f.id];
        if (ta && document.activeElement !== ta && !familySaver.busy()) ta.value = st[f.id] || '';
      });
    }
    var familySaver = makeSaver(kid, FAMILY_KEY, setStatus, refreshPart1);
    var saver = makeSaver(kid, WEEK_KEY, setStatus);

    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, WEEK_KEY),
      window.eot2Fetch(kid.group, kid.slug, FAMILY_KEY)
    ]).then(function (r) {
      var state = (r[0] && r[0].state) || {};
      var family = (r[1] && r[1].state) || {};
      setStatus('saved');

      // Part 1 — family's reflection (staff can type it in too)
      var p1 = el('section', 'mom-part');
      p1.appendChild(partHead(1, 'Reflection &amp; Problem-Solving', 'Parents and ' + kid.name, kid.name + ' and their parents can fill this in on ' + kid.name + '’s page'));
      PART1.forEach(function (f) {
        var t = textField(f, family[f.id], function (v) { familySaver.set(f.id, v); });
        p1Areas[f.id] = t.ta;
        p1.appendChild(t.wrap);
      });
      body.appendChild(p1);

      // Part 2 — planning together
      var p2 = el('section', 'mom-part');
      p2.appendChild(partHead(2, 'Planning Together', 'Parents, ' + kid.name + ' and staff', 'agree on at least one idea for Term 3'));
      p2.appendChild(textField({ id: 'p2_reflections', label: 'What we shared', hint: 'Key points from everyone’s reflections.' }, state.p2_reflections, function (v) {
        saver.set('p2_reflections', v); saver.set('p2_author', editAs);
      }, 4).wrap);

      var ideas = (state.p2_ideas && state.p2_ideas.length ? state.p2_ideas : [{}]).map(function (i) { return Object.assign({}, i); });
      var ideasWrap = el('div', 'mom-ideas');
      p2.appendChild(ideasWrap);
      var addBtn = el('button', 'eot2-btn eot2-btn-secondary mom-add', '+ Add another idea');
      addBtn.type = 'button';
      p2.appendChild(addBtn);

      function saveIdeas() { saver.set('p2_ideas', ideas.map(function (i) { return Object.assign({}, i); })); saver.set('p2_author', editAs); }
      function drawIdeas() {
        ideasWrap.innerHTML = '';
        ideas.forEach(function (idea, n) {
          var card = el('div', 'mom-idea');
          card.appendChild(el('div', 'mom-idea-head', '<strong>Idea ' + (n + 1) + ' for Term 3</strong>' +
            (n > 0 ? '<button type="button" class="mom-remove">Remove</button>' : '')));
          IDEA_FIELDS.forEach(function (f) {
            card.appendChild(textField(f, idea[f.id], function (v) { idea[f.id] = v; saveIdeas(); }, f.id === 'idea' ? 2 : 2).wrap);
          });
          var rm = card.querySelector('.mom-remove');
          if (rm) rm.addEventListener('click', function () {
            if (!confirm('Remove Idea ' + (n + 1) + '?')) return;
            ideas.splice(n, 1); drawIdeas(); saveIdeas();
          });
          ideasWrap.appendChild(card);
        });
        addBtn.hidden = ideas.length >= MAX_IDEAS;
      }
      addBtn.addEventListener('click', function () { ideas.push({}); drawIdeas(); });
      drawIdeas();

      p2.appendChild(textField({ id: 'p2_notes', label: 'Anything else', hint: 'Optional.' }, state.p2_notes, function (v) {
        saver.set('p2_notes', v); saver.set('p2_author', editAs);
      }, 2).wrap);
      body.appendChild(p2);

      var old = oldNotesSection(state);
      if (old) body.appendChild(old);

      // While staff have this open, keep Part 1 in step with the family.
      setInterval(function () {
        if (familySaver.busy() || document.hidden) return;
        window.eot2Fetch(kid.group, kid.slug, FAMILY_KEY).then(function (d) { refreshPart1((d && d.state) || {}); });
      }, 10000);
    });
  }

  /* ---------- Riser (with their parents) ---------- */

  function renderKid(kid) {
    app.innerHTML = '';
    app.appendChild(el('div', 'eot2-crumb', '<a href="../../index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>'));
    var header = el('div', 'eot2-form-header');
    header.innerHTML =
      '<div><p class="mom-eyebrow">Term 2 Conference &middot; ' + CONFERENCE_DATE + '</p><h1>Minutes of Meeting</h1>' +
      '<div class="eot2-sub">Your conference has two parts: first you and your parents reflect together, then we all plan Term 3 together.</div></div>' +
      '<div class="eot2-status eot2-status-offline" id="save-status">Loading&hellip;</div>';
    app.appendChild(header);
    var body = el('div', 'mom-body');
    app.appendChild(body);
    var setStatus = statusSetter(document.getElementById('save-status'));
    var familySaver = makeSaver(kid, FAMILY_KEY, setStatus);

    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, WEEK_KEY),
      window.eot2Fetch(kid.group, kid.slug, FAMILY_KEY)
    ]).then(function (r) {
      var state = (r[0] && r[0].state) || {};
      var family = (r[1] && r[1].state) || window.eot2LoadLocal(FAMILY_KEY, kid.slug) || {};
      setStatus('saved');

      var p1 = el('section', 'mom-part');
      p1.appendChild(partHead(1, 'Reflection &amp; Problem-Solving', 'You and your parents', 'fill this in together'));
      PART1.forEach(function (f) {
        p1.appendChild(textField(f, family[f.id], function (v) { familySaver.set(f.id, v); }).wrap);
      });
      body.appendChild(p1);

      var p2 = el('section', 'mom-part');
      p2.appendChild(partHead(2, 'Planning Together', 'You, your parents and your facilitators'));
      var ideas = ideasOf(state);
      if (!filled(state.p2_reflections) && !ideas.length && !filled(state.p2_notes)) {
        p2.appendChild(el('p', 'mom-wait', 'We’ll plan this together in Part 2 of your conference. What we agree will show here.'));
      } else {
        if (filled(state.p2_reflections)) p2.appendChild(el('div', 'mom-read', '<h3>What we shared</h3><p>' + text(state.p2_reflections) + '</p>'));
        if (ideas.length) {
          p2.appendChild(el('h3', 'mom-read-h', 'What we’ll try in Term 3'));
          ideas.forEach(function (idea, n) { p2.appendChild(el('div', null, ideaReadHtml(idea, n + 1))); });
        }
        if (filled(state.p2_notes)) p2.appendChild(el('div', 'mom-read', '<h3>Anything else</h3><p>' + text(state.p2_notes) + '</p>'));
      }
      body.appendChild(p2);

      var old = oldNotesSection(state);
      if (old) body.appendChild(old);
    });
  }

  /* ---------- who's here ---------- */

  if (editAs) {
    var author = STAFF_AUTHORS.filter(function (s) { return s.toLowerCase() === editAs.toLowerCase(); })[0];
    if (!author) {
      app.innerHTML = '<p class="eot2-msg">Unknown author "' + editAs.replace(/[<>&]/g, '') + '".</p>';
      return;
    }
    editAs = author;
    var deepLinkSlug = params.get('kid');
    var forcePicker = params.get('pick') === '1';
    var pickedKid = forcePicker ? null : ((deepLinkSlug ? window.EOT2_findKid(deepLinkSlug) : null) || window.EOT2_getLastStaffKid());
    if (pickedKid) {
      window.EOT2_setLastStaffKid(pickedKid.slug);
      renderStaff(pickedKid);
    } else {
      showStaffPicker();
    }
  } else {
    var kid = window.EOT2_signedInKid();
    if (kid) { renderKid(kid); } else { window.EOT2_leaveWithoutKid('../staff/index.html', '../../index.html'); }
  }
})();
