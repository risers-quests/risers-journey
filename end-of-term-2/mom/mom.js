/* Term 2 Conference — Minutes of Meeting, following the conference plan
   (Thursday 15 October, two 20-minute parts):

   Part 1 · Reflection & Problem-Solving — written by the Riser and their
     parents on the Riser's page: what's working, what's not, questions
     they have, and an idea they'd like to try in Term 3.
   Part 2 · Planning Together — written by staff: what was shared, and at
     least one concrete idea for Term 3 with what the parent (gardener),
     child (plant) and teacher (steward) will each do and how they'll know
     it's working.

   Each part has Submit: the boxes close and the answers show as fixed
   text, with Edit beside Submit to open them again. Typing is saved as a
   draft as it happens; only what was last submitted is shown to the other
   side (Part 1 to staff, Part 2 to the Riser), stored as p1_sub / p2_sub.

   Part 1 lives in week key term2-mom-family and Part 2 in term2-mom, so the
   family and staff never write to the same record. Each save fetches the
   latest copy and writes back only the fields this page changed, for two
   staff in Part 2 at once. Records in the earlier MOM format (brief /
   next / focus, in term2-mom) still show, under "Earlier notes".

   Staff Part 2 has a pick list beside "What we shared": the similarities
   and differences between the Riser's self-assessment and the final staff
   one (once consolidation is done), and the family's Part 1 answers. Tap
   one to move it into the box; tap again to take it out.

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
    { id: 'p1_ideas', label: 'Idea we’d like to try in Term 3', hint: 'A change or new thing we could try.' }
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
  function when(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' +
      d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
  }

  /* ---------- merge-safe saving ---------- */

  // Saves only the changed fields on top of the latest stored record, so
  // two people never overwrite each other's typing. now() saves at once.
  function makeSaver(kid, weekKey, setStatus) {
    var pending = {};
    var timer = null;
    function flush() {
      var changes = pending;
      pending = {};
      if (timer) { clearTimeout(timer); timer = null; }
      setStatus('saving');
      return window.eot2Fetch(kid.group, kid.slug, weekKey).then(function (data) {
        var merged = Object.assign({}, (data && data.state) || {}, changes);
        window.eot2SaveLocal(weekKey, kid.slug, merged);
        return window.eot2Save(kid.group, kid.slug, weekKey, merged).then(function (res) {
          setStatus(res.ok ? 'saved' : 'offline');
          if (!res.ok) Object.keys(changes).forEach(function (k) { if (!(k in pending)) pending[k] = changes[k]; });
          return res.ok;
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
      now: function (changes) { Object.assign(pending, changes || {}); return flush(); },
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

  // Submit / Edit row. While editing: Submit. Once submitted: Submitted
  // (with the time) and Edit beside it.
  function actionBar(submitted, at, onSubmit, onEdit) {
    var bar = el('div', 'mom-actions');
    var submit = el('button', 'eot2-btn mom-submit', submitted ? '✓ Submitted' : 'Submit');
    submit.type = 'button';
    submit.disabled = submitted;
    bar.appendChild(submit);
    if (submitted) {
      var edit = el('button', 'eot2-btn eot2-btn-secondary mom-edit', 'Edit');
      edit.type = 'button';
      edit.addEventListener('click', onEdit);
      bar.appendChild(edit);
      if (at) bar.appendChild(el('span', 'mom-when', when(at)));
    } else {
      submit.addEventListener('click', function () { onSubmit(submit); });
    }
    var msg = el('span', 'mom-msg');
    bar.appendChild(msg);
    return { bar: bar, submit: submit, msg: msg };
  }

  function part1ReadHtml(sub) {
    return PART1.filter(function (f) { return filled(sub[f.id]); }).map(function (f) {
      return '<div class="mom-read"><h3>' + f.label + '</h3><p>' + text(sub[f.id]) + '</p></div>';
    }).join('') || '<p class="mom-wait">Nothing written.</p>';
  }

  function ideaReadHtml(idea, n) {
    return '<div class="mom-idea-read">' +
      '<p class="mom-idea-title"><span>Idea ' + n + '</span>' + (filled(idea.idea) ? text(idea.idea) : '—') + '</p>' +
      IDEA_FIELDS.slice(1).filter(function (f) { return filled(idea[f.id]); }).map(function (f) {
        return '<div class="mom-role"><strong>' + f.label.replace('…', '') + '</strong><p>' + text(idea[f.id]) + '</p></div>';
      }).join('') +
    '</div>';
  }

  function part2ReadHtml(sub) {
    var html = '';
    if (filled(sub.p2_reflections)) html += '<div class="mom-read"><h3>What we shared</h3><p>' + text(sub.p2_reflections) + '</p></div>';
    var ideas = ideasOf(sub);
    if (ideas.length) {
      html += '<h3 class="mom-read-h">What we’ll try in Term 3</h3>';
      ideas.forEach(function (idea, n) { html += ideaReadHtml(idea, n + 1); });
    }
    if (filled(sub.p2_notes)) html += '<div class="mom-read"><h3>Anything else</h3><p>' + text(sub.p2_notes) + '</p></div>';
    return html || '<p class="mom-wait">Nothing written.</p>';
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

  /* ---------- Part 2 pick list ---------- */

  // Lines staff can move into "What we shared": the self vs staff
  // comparison (once consolidation is done) and the family's Part 1.
  // How each rating reads as an observation.
  var SEEN = { NE: 'as not seen yet', E: 'as just starting', D: 'as happening some of the time', CD: 'as happening every time' };
  function stmt(r) { return r.item.text.replace(/[.\s]+$/, ''); }
  function listNames(n) { return n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : n[0]; }

  function pickItems(kid, compare, part1) {
    var groups = [];
    if (compare) {
      var d = window.EOT2_compareData(compare.self, compare.staff);
      if (d.complete && d.compared) {
        var lines = [];
        if (d.agreeAreas.length) lines.push(kid.name + ' and staff see ' + listNames(d.agreeAreas.slice(0, 3).map(function (a) { return a.name; })) + ' in much the same way.');
        d.strengths.slice(0, 4).forEach(function (r) { lines.push(stmt(r) + ': ' + kid.name + ' and staff both see this ' + SEEN[r.self] + '.'); });
        d.growing.slice(0, 4).forEach(function (r) {
          lines.push(stmt(r) + ': ' + kid.name + ' and staff both see this ' + (r.self === r.staff ? SEEN[r.self] : 'as still early on') + '.');
        });
        groups.push({ title: 'Similarities', lines: lines });
        var diff = [];
        d.selfHigher.slice(0, 4).forEach(function (r) { diff.push(stmt(r) + ': ' + kid.name + ' sees this ' + SEEN[r.self] + ', while staff see it ' + SEEN[r.staff] + '.'); });
        d.staffHigher.slice(0, 4).forEach(function (r) { diff.push(stmt(r) + ': staff see this ' + SEEN[r.staff] + ', while ' + kid.name + ' sees it ' + SEEN[r.self] + '.'); });
        groups.push({ title: 'Differences', lines: diff });
      }
    }
    if (part1) {
      groups.push({ title: 'From Part 1', lines: PART1.filter(function (f) { return filled(part1[f.id]); }).map(function (f) {
        return f.label + ': ' + String(part1[f.id]).trim().replace(/\s*\n+\s*/g, ' ');
      }) });
    }
    return groups.filter(function (g) { return g.lines.length; });
  }

  function pickList(kid, ta, onChange) {
    var box = el('div', 'mom-pick');
    var data = { compare: null, part1: null };
    function has(line) {
      return ta.value.split('\n').some(function (l) { return l.replace(/^•\s*/, '').trim() === line; });
    }
    function toggle(line) {
      if (has(line)) {
        ta.value = ta.value.split('\n').filter(function (l) { return l.replace(/^•\s*/, '').trim() !== line; }).join('\n').replace(/^\n+|\n+$/g, '');
      } else {
        ta.value = (ta.value.replace(/\s+$/, '') ? ta.value.replace(/\s+$/, '') + '\n' : '') + '• ' + line;
      }
      onChange(ta.value);
      draw();
    }
    function draw() {
      var groups = pickItems(kid, data.compare, data.part1);
      box.innerHTML = '<p class="mom-pick-title">Pick one or two to add</p>';
      if (!groups.length) {
        box.appendChild(el('p', 'mom-pick-empty', 'The self and staff comparison shows here once consolidation is done, and the family’s answers once Part 1 is submitted.'));
        return;
      }
      groups.forEach(function (g) {
        box.appendChild(el('p', 'mom-pick-h', g.title));
        g.lines.forEach(function (line) {
          var on = has(line);
          var b = el('button', 'mom-pick-item' + (on ? ' is-on' : ''), '<span>' + escapeHtml(line) + '</span><em>' + (on ? '✓ Added' : '+ Add') + '</em>');
          b.type = 'button';
          b.addEventListener('click', function () { toggle(line); });
          box.appendChild(b);
        });
      });
    }
    ta.addEventListener('input', draw);
    draw();
    return {
      el: box,
      setCompare: function (c) { data.compare = c; draw(); },
      setPart1: function (p) { data.part1 = p; draw(); }
    };
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
    var body = el('div', 'mom-body mom-body-wide');
    app.appendChild(body);
    var setStatus = statusSetter(document.getElementById('save-status'));
    var saver = makeSaver(kid, WEEK_KEY, setStatus);

    Promise.all([
      window.eot2Fetch(kid.group, kid.slug, WEEK_KEY),
      window.eot2Fetch(kid.group, kid.slug, FAMILY_KEY),
      window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-self'),
      window.eot2Fetch(kid.group, kid.slug, 'term2-self-assessment-consolidated')
    ]).then(function (r) {
      var state = (r[0] && r[0].state) || {};
      var family = (r[1] && r[1].state) || {};
      var compare = { self: (r[2] && r[2].state) || {}, staff: (r[3] && r[3].state) || {} };
      setStatus('saved');

      // Part 1 — the family's, read only, as last submitted.
      var p1 = el('section', 'mom-part');
      p1.appendChild(partHead(1, 'Reflection &amp; Problem-Solving', 'Parents and ' + kid.name, 'written on ' + kid.name + '’s page'));
      var p1Body = el('div');
      p1.appendChild(p1Body);
      body.appendChild(p1);
      var picker = null;
      var lastP1 = null;
      function drawPart1(fam) {
        var sub = fam.p1_sub || null;
        var key = JSON.stringify(sub);
        if (key === lastP1) return;
        lastP1 = key;
        p1Body.innerHTML = sub
          ? part1ReadHtml(sub) + '<p class="mom-when mom-when-block">Submitted ' + when(sub.at) + '</p>'
          : '<p class="mom-wait">Waiting for ' + kid.name + ' and their parents to submit Part 1.</p>';
        if (picker) picker.setPart1(sub);
      }
      drawPart1(family);

      // Part 2 — planning together.
      var p2 = el('section', 'mom-part');
      p2.appendChild(partHead(2, 'Planning Together', 'Parents, ' + kid.name + ' and staff', 'agree on at least one idea for Term 3'));
      var p2Body = el('div');
      p2.appendChild(p2Body);
      body.appendChild(p2);

      var draft = {
        p2_reflections: state.p2_reflections != null ? state.p2_reflections : (state.p2_sub && state.p2_sub.p2_reflections) || '',
        p2_notes: state.p2_notes != null ? state.p2_notes : (state.p2_sub && state.p2_sub.p2_notes) || '',
        p2_ideas: ((state.p2_ideas && state.p2_ideas.length ? state.p2_ideas : (state.p2_sub && state.p2_sub.p2_ideas)) || [{}]).map(function (i) { return Object.assign({}, i); })
      };
      if (!draft.p2_ideas.length) draft.p2_ideas = [{}];
      var editing = !state.p2_sub;

      function set(key, value) { draft[key] = value; saver.set(key, value); saver.set('p2_author', editAs); }
      function saveIdeas() { set('p2_ideas', draft.p2_ideas.map(function (i) { return Object.assign({}, i); })); }

      function drawPart2() {
        p2Body.innerHTML = '';
        picker = null;
        if (!editing) {
          p2Body.appendChild(el('div', null, part2ReadHtml(state.p2_sub)));
          p2Body.appendChild(actionBar(true, state.p2_sub.at, null, function () { editing = true; drawPart2(); }).bar);
          return;
        }
        // What we shared, with the pick list on its left.
        var shared = textField({ id: 'p2_reflections', label: 'What we shared', hint: 'Key points from everyone’s reflections.' }, draft.p2_reflections, function (v) { set('p2_reflections', v); }, 8);
        picker = pickList(kid, shared.ta, function (v) { set('p2_reflections', v); });
        picker.setCompare(compare);
        picker.setPart1(family.p1_sub || null);
        var grid = el('div', 'mom-shared-grid');
        grid.appendChild(picker.el);
        grid.appendChild(shared.wrap);
        p2Body.appendChild(grid);

        var ideasWrap = el('div', 'mom-ideas');
        p2Body.appendChild(ideasWrap);
        var addBtn = el('button', 'eot2-btn eot2-btn-secondary mom-add', '+ Add another idea');
        addBtn.type = 'button';
        p2Body.appendChild(addBtn);
        function drawIdeas() {
          ideasWrap.innerHTML = '';
          draft.p2_ideas.forEach(function (idea, n) {
            var card = el('div', 'mom-idea');
            card.appendChild(el('div', 'mom-idea-head', '<strong>Idea ' + (n + 1) + ' for Term 3</strong>' +
              (n > 0 ? '<button type="button" class="mom-remove">Remove</button>' : '')));
            IDEA_FIELDS.forEach(function (f) {
              card.appendChild(textField(f, idea[f.id], function (v) { idea[f.id] = v; saveIdeas(); }, 2).wrap);
            });
            var rm = card.querySelector('.mom-remove');
            if (rm) rm.addEventListener('click', function () {
              if (!confirm('Remove Idea ' + (n + 1) + '?')) return;
              draft.p2_ideas.splice(n, 1); drawIdeas(); saveIdeas();
            });
            ideasWrap.appendChild(card);
          });
          addBtn.hidden = draft.p2_ideas.length >= MAX_IDEAS;
        }
        addBtn.addEventListener('click', function () { draft.p2_ideas.push({}); drawIdeas(); });
        drawIdeas();

        p2Body.appendChild(textField({ id: 'p2_notes', label: 'Anything else', hint: 'Optional.' }, draft.p2_notes, function (v) { set('p2_notes', v); }, 2).wrap);

        var a = actionBar(false, null, function (btn) {
          var snap = {
            p2_reflections: draft.p2_reflections,
            p2_ideas: draft.p2_ideas.map(function (i) { return Object.assign({}, i); }),
            p2_notes: draft.p2_notes
          };
          if (!filled(snap.p2_reflections) && !ideasOf(snap).length && !filled(snap.p2_notes)) {
            a.msg.textContent = 'Write something before submitting.';
            return;
          }
          snap.by = editAs;
          snap.at = new Date().toISOString();
          btn.disabled = true;
          a.msg.textContent = 'Submitting…';
          saver.now(Object.assign({}, snap, { p2_author: editAs, p2_sub: snap })).then(function (ok) {
            if (!ok) { btn.disabled = false; a.msg.textContent = 'Not submitted — check the connection and try again.'; return; }
            state.p2_sub = snap;
            editing = false;
            drawPart2();
          });
        });
        p2Body.appendChild(a.bar);
      }
      drawPart2();

      var old = oldNotesSection(state);
      if (old) body.appendChild(old);

      // While staff have this open, pick up the family's Part 1 submission.
      setInterval(function () {
        if (document.hidden) return;
        window.eot2Fetch(kid.group, kid.slug, FAMILY_KEY).then(function (d) {
          family = (d && d.state) || family;
          drawPart1(family);
        });
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

      // Part 1 — written here, submitted to staff.
      var p1 = el('section', 'mom-part');
      p1.appendChild(partHead(1, 'Reflection &amp; Problem-Solving', 'You and your parents', 'fill this in together'));
      var p1Body = el('div');
      p1.appendChild(p1Body);
      body.appendChild(p1);
      var draft = {};
      PART1.forEach(function (f) {
        draft[f.id] = family[f.id] != null ? family[f.id] : (family.p1_sub && family.p1_sub[f.id]) || '';
      });
      var editing = !family.p1_sub;

      function drawPart1() {
        p1Body.innerHTML = '';
        if (!editing) {
          p1Body.appendChild(el('div', null, part1ReadHtml(family.p1_sub)));
          p1Body.appendChild(actionBar(true, family.p1_sub.at, null, function () { editing = true; drawPart1(); }).bar);
          return;
        }
        PART1.forEach(function (f) {
          p1Body.appendChild(textField(f, draft[f.id], function (v) { draft[f.id] = v; familySaver.set(f.id, v); }).wrap);
        });
        var a = actionBar(false, null, function (btn) {
          if (!PART1.some(function (f) { return filled(draft[f.id]); })) {
            a.msg.textContent = 'Write something before submitting.';
            return;
          }
          var snap = Object.assign({}, draft, { at: new Date().toISOString() });
          btn.disabled = true;
          a.msg.textContent = 'Submitting…';
          familySaver.now(Object.assign({}, draft, { p1_sub: snap })).then(function (ok) {
            if (!ok) { btn.disabled = false; a.msg.textContent = 'Not submitted — check the connection and try again.'; return; }
            family.p1_sub = snap;
            editing = false;
            drawPart1();
          });
        });
        p1Body.appendChild(a.bar);
      }
      drawPart1();

      // Part 2 — written by staff, shown once they submit it.
      var p2 = el('section', 'mom-part');
      p2.appendChild(partHead(2, 'Planning Together', 'You, your parents and your facilitators'));
      p2.appendChild(state.p2_sub
        ? el('div', null, part2ReadHtml(state.p2_sub))
        : el('p', 'mom-wait', 'We’ll plan this together in Part 2 of your conference. What we agree will show here.'));
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
