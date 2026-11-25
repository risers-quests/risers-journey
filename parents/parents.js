/* The parents' form: one open link for every Riser's parents, no sign-in.
   1. Pick your child.
   2. Their questionnaires, one after another: "Next year at LifeHub" for
      every family, and "10th Boards: Before We Meet" for the families staff
      chose for it. Which ones a child gets comes from each questionnaire's
      staff page (?view=staff there: OK it and pick the families).
   Runs the same questionnaire engine as the Term 3 pages
   (/term-3/grade10/grade10.js); it saves through /api/auth/parent, which
   only takes submitted forms and never shows saved answers. */
(function () {
  var box = document.getElementById('pf');
  var params = new URLSearchParams(location.search);
  var kidId = (params.get('kid') || '').toLowerCase();
  var formId = params.get('form') || '';
  var FILES = { 'next-year': '/term-3/next-year/next-year-data.js', grade10: '/term-3/grade10/grade10-data.js' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function get(q) {
    return fetch('/api/auth/parent' + q, { credentials: 'same-origin' }).then(function (r) { return r.json(); }, function () { return { error: 'No connection. Check the internet and try again.' }; });
  }
  function go(q) { location.href = '/parents/' + q; }
  function oops(msg) { box.innerHTML = '<div class="pf-card"><h1>Something went wrong</h1><p>' + esc(msg || 'Please try again.') + '</p></div>'; }

  // 1. Which child?
  if (!kidId) {
    get('').then(function (r) {
      if (!r.kids) return oops(r.error);
      box.innerHTML = '<div class="pf-card"><h1>For Risers’ parents</h1><p>Which child are you filling this in for?</p>' +
        '<div class="si-names">' + r.kids.map(function (k) {
          return '<a class="si-name" href="?kid=' + encodeURIComponent(k.slug) + '"><span class="si-av">' + esc(k.name.charAt(0)) + '</span>' + esc(k.name) + '</a>';
        }).join('') + '</div></div>';
    });
    return;
  }

  // 2. Their forms, one after another.
  get('?kid=' + encodeURIComponent(kidId)).then(function (r) {
    if (!r.kid) return oops(r.error);
    var kid = r.kid, forms = r.forms || [];
    var again = '<p style="margin-top:18px"><a href="/parents/">Not ' + esc(kid.name) + '? Choose again</a></p>';
    if (!forms.length) {
      box.innerHTML = '<div class="pf-card"><h1>Nothing to fill in right now</h1><p>There are no forms for ' + esc(kid.name) + '’s parents at the moment. Thank you for checking!</p>' + again + '</div>';
      return;
    }
    var i = forms.map(function (f) { return f.id; }).indexOf(formId);
    if (i === -1) { location.replace('?kid=' + encodeURIComponent(kid.slug) + '&form=' + forms[0].id); return; }
    var next = forms[i + 1];
    var prev = forms[i - 1];
    var justSent = params.get('sent') === '1' && i > 0;
    var editing = params.get('edit') === '1';
    // What this tab sent, kept only for this tab (gone when it's closed),
    // so a parent can go back to an earlier form and change their answers.
    var keyOf = function (week) { return 'rj-parent::' + kid.slug + '::' + week; };
    var keptHere = function (week) { try { return JSON.parse(sessionStorage.getItem(keyOf(week)) || 'null'); } catch (e) { return null; } };
    var prevWeek = prev && { 'next-year': 'term3-next-year', grade10: 'term3-grade10' }[prev.id];
    var back = prev && keptHere(prevWeek)
      ? ' <a href="?kid=' + encodeURIComponent(kid.slug) + '&form=' + prev.id + '&edit=1">← Back to form ' + i + ' to change your answers</a>' : '';
    box.innerHTML = (justSent ? '<p class="si-ok" style="margin:0 0 10px">✓ Form ' + i + ' sent. ' + (next ? 'Next' : 'Last one') + ': form ' + (i + 1) + ' of ' + forms.length + '.' + back + '</p>' : '') +
      (forms.length > 1 && !justSent ? '<p class="pf-msg" style="margin:0 0 6px">Form ' + (i + 1) + ' of ' + forms.length + ' for ' + esc(kid.name) + '’s parents' + (back ? '.' + back : '') + '</p>' : '');

    // What the engine expects from a Term 3 page, pointed at this child.
    window.EOT2_KIDS = [kid];
    window.EOT2_signedInKid = function () { return kid; };
    window.EOT2_leaveWithoutKid = function () { go(''); };
    // Saved answers are never fetched back; only what this page itself
    // just submitted (so the engine can show "Submitted!").
    var sentHere = {};
    window.eot2Fetch = function (group, k, week) {
      if (sentHere[week]) return Promise.resolve({ state: sentHere[week] });
      // Coming back to change answers: what this tab sent, ready to edit.
      var kept = editing && keptHere(week);
      if (kept) return Promise.resolve({ state: { answers: kept.answers || {} } });
      return get('/record?kid=' + encodeURIComponent(kid.slug) + '&week=' + encodeURIComponent(week))
        .then(function (d) { return d && d.found && d.data ? d.data : null; });
    };
    window.eot2Save = function (group, k, week, state) {
      return fetch('/api/auth/parent/record', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kid: kid.slug, week: week, state: state })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d && d.ok && state._sent) {
          sentHere[week] = JSON.parse(JSON.stringify(state));
          try { sessionStorage.setItem(keyOf(week), JSON.stringify({ answers: state.answers || {} })); } catch (e) {}
        }
        return { ok: !!(d && d.ok), updatedAt: d && d.updatedAt };
      }, function () { return { ok: false }; });
    };

    // Remove the engine's "back" link; after Submit, go on to the next form.
    new MutationObserver(function () {
      // No "back" link here: once a child is chosen, the parent goes straight through.
      var crumb = document.querySelector('#app .eot2-crumb');
      if (crumb) crumb.remove();
      var done = document.querySelector('#app .g10-done');
      if (done && !done.dataset.pf) {
        done.dataset.pf = '1';
        Array.prototype.forEach.call(done.querySelectorAll('button'), function (b) { b.hidden = true; });
        // More to come: straight on to the next form (no "thank you" that looks like the end).
        if (next) { done.hidden = true; location.replace('?kid=' + encodeURIComponent(kid.slug) + '&form=' + next.id + '&sent=1'); return; }
        done.insertAdjacentHTML('beforeend', '<p><strong>That’s everything. You can close this page.</strong></p>');
      }
    }).observe(document.getElementById('app'), { childList: true, subtree: true });

    load(FILES[forms[i].id], function () {
      // Here nothing is kept until Submit, so say that instead.
      var G = window.G10;
      if (G && G.intro) G.intro = G.intro.replace(/\s*It saves as you type\.?/, '') + (next ? ' This is form ' + (i + 1) + ' of ' + forms.length + '; the next one follows straight after.' : ' Press Submit at the end to send it.');
      // Before the last form, the button says where it goes.
      if (G && next) { G.text = G.text || {}; G.text.send = 'Send and go to form ' + (i + 2) + ' of ' + forms.length + ' →'; }
      load('/term-3/grade10/grade10.js');
    });
  });

  function load(src, then) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = then || null;
    s.onerror = function () { oops('The form couldn’t load. Please try again.'); };
    document.body.appendChild(s);
  }
})();
