/* Staff: Sign-in & PINs. Set or reset each Riser's and facilitator's
   6-digit PIN, and see what the data store recently refused (a page that
   stops saving after the sign-in went live shows up here). */
(function () {
  var app = document.getElementById('app');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

  function api(path, body) {
    var opts = { credentials: 'same-origin', headers: {} };
    if (body !== undefined) { opts.method = 'POST'; opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    return fetch('/api/auth/' + path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; });
    }, function () { return { status: 0, error: 'No connection.' }; });
  }

  app.appendChild(el('header', 'hd-welcome', '<h1>Sign-in &amp; PINs</h1><p>Everyone signs in by tapping their name and typing their 6-digit PIN.</p>'));
  var wrap = el('div', 'sg');
  app.appendChild(wrap);

  if (!window.RJ_SESSION || window.RJ_SESSION.role !== 'staff') {
    wrap.appendChild(el('section', 'sg-sec', '<h2>Sign in first</h2><p>This page works once you’re signed in with your facilitator PIN. <a href="/signin/?next=/staff/sign-in/">Sign in</a></p>'));
    return;
  }

  var kidsSec = el('section', 'sg-sec', '<h2>Risers’ PINs</h2><p>Give each Riser a 6-digit PIN they’ll remember. Setting a new one replaces the old one and unlocks them if they were locked out after wrong tries. Don’t reuse the same PIN for everyone.</p><ul class="sg-list"><li class="sg-row">Loading…</li></ul>');
  var staffSec = el('section', 'sg-sec', '<h2>Facilitators’ PINs</h2><p>Change your own here; if a colleague forgot theirs, set them a new one.</p><ul class="sg-list"><li class="sg-row">Loading…</li></ul>');
  var logSec = el('section', 'sg-sec', '<h2>Recently refused</h2><p>Saves the data store turned down because a Riser’s page asked for something that isn’t theirs. If a Riser says their work won’t save, look here and tell whoever looks after the site.</p><div id="sg-log">Loading…</div>');
  [kidsSec, staffSec, logSec].forEach(function (s) { wrap.appendChild(s); });

  function rows(sec, role, people, set, locked) {
    var len = 6;
    var ul = sec.querySelector('.sg-list');
    ul.innerHTML = people.map(function (p) {
      var key = role + ':' + p.id;
      var tag = locked.indexOf(key) !== -1 ? '<span class="sg-tag is-locked">Locked for now</span>'
        : set.indexOf(key) !== -1 ? '<span class="sg-tag">PIN set</span>' : '<span class="sg-tag is-none">No PIN yet</span>';
      var me = role === 'staff' && p.id === window.RJ_SESSION.id ? ' (you)' : '';
      return '<li class="sg-row" data-id="' + esc(p.id) + '"><span class="sg-name">' + esc(p.name) + me + '</span>' + tag +
        '<form><input type="password" inputmode="numeric" autocomplete="new-password" maxlength="' + len + '" placeholder="' + new Array(len + 1).join('•') + '" aria-label="New PIN for ' + esc(p.name) + '">' +
        '<button class="sg-btn" type="submit">' + (set.indexOf(key) !== -1 ? 'Reset' : 'Set') + '</button></form><span class="sg-msg"></span></li>';
    }).join('');
    Array.prototype.forEach.call(ul.querySelectorAll('.sg-row'), function (li) {
      var form = li.querySelector('form'), input = form.querySelector('input'), msg = li.querySelector('.sg-msg');
      form.onsubmit = function (e) {
        e.preventDefault();
        msg.className = 'sg-msg'; msg.textContent = '';
        if (!new RegExp('^\\d{' + len + '}$').test(input.value)) { msg.className = 'sg-msg is-err'; msg.textContent = len + ' digits, please.'; return; }
        if (/^(\d)\1+$/.test(input.value) || '0123456789'.indexOf(input.value) !== -1) { msg.className = 'sg-msg is-err'; msg.textContent = 'Too easy to guess. Pick another.'; return; }
        api('pin', { role: role, id: li.getAttribute('data-id'), pin: input.value }).then(function (r) {
          if (r.ok) { input.value = ''; msg.textContent = 'Saved.'; var t = li.querySelector('.sg-tag'); t.className = 'sg-tag'; t.textContent = 'PIN set'; form.querySelector('button').textContent = 'Reset'; }
          else { msg.className = 'sg-msg is-err'; msg.textContent = r.error || 'Not saved.'; }
        });
      };
    });
  }

  api('pins').then(function (r) {
    if (!r.ok) {
      kidsSec.querySelector('.sg-list').innerHTML = '<li class="sg-row sg-err">' + esc(r.error || 'Couldn’t load.') + '</li>';
      staffSec.querySelector('.sg-list').innerHTML = '';
      return;
    }
    rows(kidsSec, 'kid', r.kids, r.set, r.locked);
    rows(staffSec, 'staff', r.staff, r.set, r.locked);
  });

  api('blocked').then(function (r) {
    var box = document.getElementById('sg-log');
    var items = (r && r.items) || [];
    if (!r.ok) { box.innerHTML = '<p class="sg-err">' + esc(r.error || 'Couldn’t load.') + '</p>'; return; }
    if (!items.length) { box.innerHTML = '<p class="sg-log">Nothing refused. Good.</p>'; return; }
    box.innerHTML = '<table class="sg-log"><tbody>' + items.slice(0, 20).map(function (x) {
      return '<tr><td>' + esc(new Date(x.at).toLocaleString([], { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })) + '</td>' +
        '<td><b>' + esc(x.who) + '</b></td><td>' + esc(x.method) + ' ' + esc(x.path) + '</td><td>' + esc([x.group, x.kid, x.week].filter(Boolean).join(' · ')) + '</td></tr>';
    }).join('') + '</tbody></table>';
  });
})();
