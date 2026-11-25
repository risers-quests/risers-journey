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
    box.innerHTML = forms.length > 1
      ? '<p class="pf-msg" style="margin:0 0 6px">Form ' + (i + 1) + ' of ' + forms.length + ' for ' + esc(kid.name) + '’s parents</p>'
      : '';

    // What the engine expects from a Term 3 page, pointed at this child.
    window.EOT2_KIDS = [kid];
    window.EOT2_signedInKid = function () { return kid; };
    window.EOT2_leaveWithoutKid = function () { go(''); };
    // Saved answers are never fetched back; only what this page itself
    // just submitted (so the engine can show "Submitted!").
    var sentHere = {};
    window.eot2Fetch = function (group, k, week) {
      if (sentHere[week]) return Promise.resolve({ state: sentHere[week] });
      return get('/record?kid=' + encodeURIComponent(kid.slug) + '&week=' + encodeURIComponent(week))
        .then(function (d) { return d && d.found && d.data ? d.data : null; });
    };
    window.eot2Save = function (group, k, week, state) {
      return fetch('/api/auth/parent/record', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kid: kid.slug, week: week, state: state })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d && d.ok && state._sent) sentHere[week] = JSON.parse(JSON.stringify(state));
        return { ok: !!(d && d.ok), updatedAt: d && d.updatedAt };
      }, function () { return { ok: false }; });
    };

    // Point the engine's "back" link here; after Submit, offer the next form.
    new MutationObserver(function () {
      var crumb = document.querySelector('#app .eot2-crumb a');
      if (crumb && crumb.getAttribute('href') !== '/parents/') { crumb.setAttribute('href', '/parents/'); crumb.textContent = '← Choose another child'; }
      var done = document.querySelector('#app .g10-done');
      if (done && !done.dataset.pf) {
        done.dataset.pf = '1';
        Array.prototype.forEach.call(done.querySelectorAll('button'), function (b) { b.hidden = true; });
        done.insertAdjacentHTML('beforeend', next
          ? '<p><a class="eot2-btn" href="?kid=' + encodeURIComponent(kid.slug) + '&form=' + next.id + '">Next: ' + esc(next.title) + ' →</a></p>'
          : '<p><strong>That’s everything. You can close this page.</strong></p>');
      }
    }).observe(document.getElementById('app'), { childList: true, subtree: true });

    load(FILES[forms[i].id], function () {
      // Here nothing is kept until Submit, so say that instead.
      var G = window.G10;
      if (G && G.intro) G.intro = G.intro.replace(/\s*It saves as you type\.?/, '') + ' Press Submit at the end to send it.';
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
