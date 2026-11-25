/* Risers Journey sign-in page.
   1. A device nobody has set up: a facilitator sets it up once, with a
      code emailed to highergrade@lifehub.in or a device code made on the
      staff Sign-in page.
   2. A set-up device: tap your name, type your PIN (Risers 4 digits,
      facilitators 6). */
(function () {
  var app = document.getElementById('si-app');
  var params = new URLSearchParams(location.search);
  var state = null;

  // Whoever was here before is gone: forget their name on this device.
  try { localStorage.removeItem('imm-l3-kid'); localStorage.removeItem('rj-staff-name'); } catch (e) {}

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function api(path, body) {
    var opts = { credentials: 'same-origin', headers: {} };
    if (body !== undefined) {
      opts.method = 'POST';
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return fetch('/api/auth/' + path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; });
    }, function () { return { status: 0, error: 'No connection. Check the internet and try again.' }; });
  }

  // Where to go once signed in: the page they asked for, if it's on this site.
  function destination(role) {
    var next = params.get('next') || '';
    if (/^\/(?!\/)/.test(next) && next.indexOf('/signin') !== 0) {
      if (role === 'staff' || !/^\/staff(\/|$)/.test(next)) return next;
    }
    return role === 'staff' ? '/staff/' : '/';
  }

  function show(html, narrow) {
    app.className = 'si-card' + (narrow ? ' is-narrow' : '');
    app.innerHTML = html;
  }

  function load() {
    api('state').then(function (s) {
      state = s;
      if (s.status === 503 || s.configured === false) {
        show('<h1>Sign-in isn’t switched on yet</h1><p class="si-sub">Please try again later.</p>', true);
      } else if (!s.status || s.status >= 500) {
        show('<h1>Can’t reach Risers Journey</h1><p class="si-sub">' + esc(s.error || 'Check the internet and try again.') + '</p>' +
          '<button class="si-btn" type="button" id="si-retry">Try again</button>', true);
        document.getElementById('si-retry').onclick = load;
      } else if (s.user) {
        location.replace(destination(s.user.role));
      } else if (!s.device) {
        setupDevice();
      } else {
        pickName('kid');
      }
    });
  }

  /* ---------- 1. setting up a device ---------- */

  function setupDevice() {
    show(
      '<h1>Set up this device</h1>' +
      '<p class="si-sub">A facilitator does this once on each device. After that, Risers sign in with their name and PIN.</p>' +
      (state.mail ? '<button class="si-btn" type="button" id="si-email">Email a code to highergrade@lifehub.in</button>' +
        '<div class="si-divider">or</div>' : '') +
      '<label for="si-dcode" class="si-note" style="display:block;margin:0 0 8px">Type a device code (from a facilitator’s <b>Sign-in &amp; PINs</b> page) or the set-up code:</label>' +
      '<input id="si-dcode" class="si-field" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="16" placeholder="Device or set-up code">' +
      '<button class="si-btn' + (state.mail ? ' is-quiet' : '') + '" type="button" id="si-dgo">Set up with this code</button>' +
      '<p class="si-err" id="si-err"></p>', true);
    var err = document.getElementById('si-err');
    var input = document.getElementById('si-dcode'), go = document.getElementById('si-dgo');
    function useCode() {
      go.disabled = true; err.textContent = '';
      api('device/code', { code: input.value }).then(function (r) {
        go.disabled = false;
        if (r.ok) return deviceReady();
        err.textContent = r.error || 'That didn’t work. Try again.';
      });
    }
    go.onclick = useCode;
    input.onkeydown = function (e) { if (e.key === 'Enter') useCode(); };
    var email = document.getElementById('si-email');
    if (email) email.onclick = function () {
      email.disabled = true; err.textContent = '';
      api('device/email', {}).then(function (r) {
        email.disabled = false;
        if (r.ok) return enterEmailCode(r.to);
        err.textContent = r.error || 'The email couldn’t be sent.';
      });
    };
  }

  function enterEmailCode(to) {
    show(
      '<h1>Check the email</h1>' +
      '<p class="si-sub">We sent a 6-digit code to <b>' + esc(to) + '</b>. Type it here within 10 minutes.</p>' +
      '<input id="si-ecode" class="si-field" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456">' +
      '<button class="si-btn" type="button" id="si-ego">Set up this device</button>' +
      '<p class="si-err" id="si-err"></p>' +
      '<div class="si-links"><button class="si-link" type="button" id="si-back">Back</button></div>', true);
    var input = document.getElementById('si-ecode'), go = document.getElementById('si-ego'), err = document.getElementById('si-err');
    input.focus();
    function check() {
      go.disabled = true; err.textContent = '';
      api('device/verify', { code: input.value }).then(function (r) {
        go.disabled = false;
        if (r.ok) return deviceReady();
        err.textContent = r.error || 'That code isn’t right.';
      });
    }
    go.onclick = check;
    input.onkeydown = function (e) { if (e.key === 'Enter') check(); };
    document.getElementById('si-back').onclick = setupDevice;
  }

  function deviceReady() {
    api('state').then(function (s) {
      state = s;
      pickName('kid', 'This device is set up. Risers can sign in now.');
    });
  }

  /* ---------- 2. who's using it ---------- */

  function pickName(role, okMessage) {
    var list = role === 'staff' ? state.staff : state.kids;
    var idle = params.get('idle') === '1' && !okMessage;
    show(
      (okMessage ? '<p class="si-ok">' + esc(okMessage) + '</p>' : '') +
      (idle ? '<p class="si-ok">You were signed out after ' + (state.idleMinutes || 15) + ' quiet minutes.</p>' : '') +
      '<h1>' + (role === 'staff' ? 'Facilitators' : 'Who’s using Risers Journey?') + '</h1>' +
      '<p class="si-sub">Tap your name.</p>' +
      '<div class="si-names">' + list.map(function (p) {
        return '<button type="button" class="si-name' + (role === 'staff' ? ' is-staff' : '') + '" data-id="' + esc(p.id) + '">' +
          '<span class="si-av">' + esc(p.name.charAt(0)) + '</span>' + esc(p.name) + '</button>';
      }).join('') + '</div>' +
      '<div class="si-links">' +
        (role === 'staff'
          ? '<button class="si-link" type="button" id="si-switch">I’m a Riser</button>'
          : '<button class="si-link" type="button" id="si-switch">I’m a facilitator</button>') +
      '</div>');
    Array.prototype.forEach.call(app.querySelectorAll('.si-name'), function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-id');
        enterPin(role, list.filter(function (p) { return p.id === id; })[0]);
      };
    });
    document.getElementById('si-switch').onclick = function () {
      params.delete('idle');
      pickName(role === 'staff' ? 'kid' : 'staff');
    };
  }

  function enterPin(role, person) {
    var length = role === 'staff' ? 6 : 4;
    var pin = '', busy = false;
    show(
      '<div class="si-who"><span class="si-av">' + esc(person.name.charAt(0)) + '</span><h1>Hi, ' + esc(person.name) + '</h1></div>' +
      '<p class="si-sub" style="margin-bottom:4px">Type your ' + length + '-digit PIN.</p>' +
      '<div class="si-dots" aria-hidden="true">' + new Array(length + 1).join('<span class="si-dot"></span>') + '</div>' +
      '<input class="si-hidden-input" id="si-pin" type="password" inputmode="numeric" autocomplete="off" aria-label="PIN" maxlength="' + length + '">' +
      '<div class="si-pad">' +
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button type="button" class="si-key" data-k="' + n + '">' + n + '</button>'; }).join('') +
        '<button type="button" class="si-key is-quiet" data-k="back" aria-label="Delete">Delete</button>' +
        '<button type="button" class="si-key" data-k="0">0</button>' +
        '<button type="button" class="si-key is-quiet" data-k="cancel">Not me</button>' +
      '</div>' +
      '<p class="si-err" id="si-err"></p>', true);
    var dots = app.querySelectorAll('.si-dot'), err = document.getElementById('si-err'), input = document.getElementById('si-pin');
    function draw() {
      Array.prototype.forEach.call(dots, function (d, i) { d.classList.toggle('is-on', i < pin.length); });
    }
    function submit() {
      busy = true;
      Array.prototype.forEach.call(app.querySelectorAll('.si-key'), function (k) { k.disabled = true; });
      api('signin', { role: role, id: person.id, pin: pin }).then(function (r) {
        if (r.ok) {
          try {
            if (role === 'kid') { localStorage.setItem('imm-l3-kid', person.id); }
            else { localStorage.setItem('rj-staff-name', person.id); }
          } catch (e) {}
          location.replace(destination(role));
          return;
        }
        if (r.nopin && role === 'staff') return firstPin(person);
        busy = false;
        pin = ''; draw();
        Array.prototype.forEach.call(app.querySelectorAll('.si-key'), function (k) { k.disabled = false; });
        err.textContent = r.error || 'That didn’t work. Try again.';
      });
    }
    function press(k) {
      if (busy) return;
      if (k === 'cancel') return pickName(role);
      err.textContent = '';
      if (k === 'back') pin = pin.slice(0, -1);
      else if (/^\d$/.test(k) && pin.length < length) pin += k;
      draw();
      if (pin.length === length) submit();
    }
    Array.prototype.forEach.call(app.querySelectorAll('.si-key'), function (b) {
      b.onclick = function () { press(b.getAttribute('data-k')); };
    });
    // A keyboard works too.
    document.onkeydown = function (e) {
      if (!document.getElementById('si-pin')) { document.onkeydown = null; return; }
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('back');
      else if (e.key === 'Escape') press('cancel');
    };
    input.blur();
  }

  /* A facilitator's very first sign-in: make their own PIN, with the
     set-up code as proof. */
  function firstPin(person) {
    document.onkeydown = null;
    show(
      '<div class="si-who"><span class="si-av">' + esc(person.name.charAt(0)) + '</span><h1>Make your PIN, ' + esc(person.name) + '</h1></div>' +
      '<p class="si-sub">You don’t have a PIN yet. Type the set-up code, then choose a 6-digit PIN you’ll remember.</p>' +
      '<input id="si-scode" class="si-field" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="14" placeholder="Set-up code">' +
      '<input id="si-p1" class="si-field" style="margin-top:10px" type="password" inputmode="numeric" autocomplete="new-password" maxlength="6" placeholder="New PIN">' +
      '<input id="si-p2" class="si-field" style="margin-top:10px" type="password" inputmode="numeric" autocomplete="new-password" maxlength="6" placeholder="PIN again">' +
      '<button class="si-btn" type="button" id="si-fgo">Save my PIN and sign in</button>' +
      '<p class="si-err" id="si-err"></p>' +
      '<div class="si-links"><button class="si-link" type="button" id="si-back">Back</button></div>', true);
    var err = document.getElementById('si-err'), go = document.getElementById('si-fgo');
    document.getElementById('si-back').onclick = function () { pickName('staff'); };
    go.onclick = function () {
      var p1 = document.getElementById('si-p1').value, p2 = document.getElementById('si-p2').value;
      err.textContent = '';
      if (!/^\d{6}$/.test(p1)) { err.textContent = 'Your PIN is 6 digits.'; return; }
      if (p1 !== p2) { err.textContent = 'The two PINs don’t match.'; return; }
      if (/^(\d)\1+$/.test(p1) || '01234567890'.indexOf(p1) !== -1 || '09876543210'.indexOf(p1) !== -1) { err.textContent = 'Too easy to guess. Pick another.'; return; }
      go.disabled = true;
      api('first-pin', { id: person.id, setupCode: document.getElementById('si-scode').value, pin: p1 }).then(function (r) {
        go.disabled = false;
        if (r.ok) {
          try { localStorage.setItem('rj-staff-name', person.id); } catch (e) {}
          location.replace('/staff/sign-in/');
          return;
        }
        err.textContent = r.error || 'Not saved.';
      });
    };
  }

  load();
})();
