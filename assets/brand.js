/* LifeHub app shell — the sidebar (desktop) / top bar + bottom tabs
   (phone), signed-in profile chip, and footer shared by every page. The
   page's own #app is moved into the shell's main column untouched, so
   page scripts don't need to know the shell exists.

   Paths are worked out from this script's own URL, so the same tag works
   at any folder depth. data-area="staff" on the script tag (or a staff
   rater/editAs link into a shared Term 2 Conference form, or ?view=staff)
   switches to the
   staff navigation. While nobody is signed in, the shell stays out of the
   way: no navigation, just the logo above the sign-in card. */
(function () {
  var script = document.currentScript;
  var assets = script.src.replace(/[^/]*$/, '');
  var root = assets.replace(/assets\/$/, '');
  var params = new URLSearchParams(location.search);
  var rater = params.get('rater');
  var isStaff = script.getAttribute('data-area') === 'staff' || params.get('view') === 'staff' ||
    !!params.get('editAs') || (!!rater && rater !== 'self');

  var KID_KEY = 'imm-l3-kid';
  var STAFF_KEY = 'rj-staff-name';

  // The private staff reference site (risers-term2-digital-quests-staff-data).
  // staff/staff-links.js reads this too, so it's set in this one place.
  window.LH_STAFF_SITE = 'https://risers-term2-digital-quests-staff-d.vercel.app/';

  var icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = assets + 'lifehub-mark.png';
  document.head.appendChild(icon);

  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    quests: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2.5Z"/><path d="M8 7h7M8 11h5"/>',
    conf: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h8A2.5 2.5 0 0 1 17 5.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3v-3.2A2.5 2.5 0 0 1 4 10.5v-5Z"/><path d="M20 9.5v5a2.5 2.5 0 0 1-1 2V20l-3-2.5h-4.5"/>',
    term: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path d="m9 15 2 2 4-4"/>',
    skills: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
    sel: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    paper: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h6M9 16h4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    check: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="m8 12.5 2.8 2.8L16.5 9"/>',
    link: '<path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  };
  function svg(name, cls) {
    return '<svg class="' + (cls || 'lh-ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  // Pages reuse the same icon set (Home's category tiles).
  window.LH_ICON = function (name, cls) { return svg(name, cls); };

  // Category tiles for the Home pages: [{ title, desc, href, icon, tone, soon }].
  window.LH_tiles = function (tiles) {
    return tiles.map(function (t) {
      var inner =
        '<span class="hd-tile-ico hd-tone-' + t.tone + '">' + svg(t.icon) + '</span>' +
        '<span class="hd-tile-text">' + (t.soon ? '<em class="hd-tile-soon">Coming soon</em>' : '') +
          '<strong>' + t.title + '</strong><span>' + t.desc + '</span></span>' +
        (t.soon ? '' : '<span class="hd-tile-go" aria-hidden="true">&rarr;</span>');
      return t.soon
        ? '<div class="hd-tile is-soon">' + inner + '</div>'
        : '<a class="hd-tile" href="' + t.href + '">' + inner + '</a>';
    }).join('');
  };

  // Risers trying Term 3 out before it starts: they can tick any check-in
  // week early. Staff clear their try-out data on Term 3 → Try-out data.
  window.LH_TRIAL = ['benjamin'];

  // Each term's pages, listed under it in the side panel (subs).
  var SUBS = isStaff ? {
    'Term 3': [
      ['Quest boards', 'staff/term-3/board.html'], ['Own Quest Ideas', 'staff/term-3/quests.html#own-ideas'],
      ['Weekly Check-ins', 'term-3/check-in/index.html?view=staff'], ['Schedules', 'term-3/schedule/index.html?view=staff'],
      ['Assessment Tracking', 'staff/term-3/tracking.html'], ['Observations', 'staff/term-3/observations.html'],
      ['Assessments', 'term-3/assessments/index.html?view=staff'], ['10th Grade questionnaire', 'term-3/grade10/index.html?view=staff'],
      ['Try-out data', 'staff/term-3/try-out.html']],
    'Term 2': [['Term 2 Conference', 'end-of-term-2/staff/index.html'], ['Term 2 Quests', 'staff/quests/index.html']],
    'Term 1': [['Term 1 Conference', 'term-1-conference/index.html?view=staff']]
  } : {
    'Term 3': [['Term 3 Quest', 'term-3/quest/index.html'], ['Our Own Quest', 'term-3/quest/index.html?own=1'],
      ['Weekly Check-in', 'term-3/check-in/index.html'], ['My Schedule', 'term-3/schedule/index.html'], ['Assessments', 'term-3/assessments/index.html']],
    'Term 2': [['Term 2 Conference', 'end-of-term-2/index.html'], ['Term 2 Quests', 'dashboard/index.html']],
    'Term 1': [['Term 1 Conference', 'term-1-conference/index.html']]
  };

  var NAV = isStaff ? [
    // Only the staff Home itself (not end-of-term-2/staff/ and the like).
    { label: 'Home', href: root + 'staff/index.html', icon: 'home', match: new RegExp('^' + new URL(root, location.href).pathname + 'staff/(index\\.html)?$') },
    { label: 'Term 3', href: root + 'staff/term-3/index.html', icon: 'skills', short: 'Term 3', match: /\/term-3\// },
    { label: 'Term 2', href: root + 'staff/term-2/index.html', icon: 'term', short: 'Term 2', match: /\/(staff\/term-2|end-of-term-2|staff\/quests)\// },
    { label: 'Term 1', href: root + 'staff/term-1/index.html', icon: 'conf', short: 'Term 1', match: /\/(staff\/term-1|term-1-conference)\// },
    { label: 'Risers’ links', href: root + 'staff/links/index.html', icon: 'link', short: 'Links', match: /\/staff\/links\// }
  ] : [
    { label: 'Home', href: root + 'index.html', icon: 'home', match: /\/(index\.html)?$/, exact: true },
    { label: 'Term 3', href: root + 'term-3/index.html', icon: 'skills', short: 'Term 3', match: /\/term-3\// },
    { label: 'Term 2', href: root + 'term-2/index.html', icon: 'term', short: 'Term 2', match: /\/(term-2|end-of-term-2|dashboard)\// },
    { label: 'Term 1', href: root + 'term-1/index.html', icon: 'conf', short: 'Term 1', match: /\/(term-1|term-1-conference)\// }
  ];


  function isActive(item) {
    if (!item.match) return false;
    var path = location.pathname;
    if (item.exact) {
      // Home is the site root only, not every folder's index.html.
      var rootPath = new URL(root, location.href).pathname;
      return path === rootPath || path === rootPath + 'index.html';
    }
    return item.match.test(path);
  }

  function signedInName() {
    var v = null;
    try { v = localStorage.getItem(isStaff ? STAFF_KEY : KID_KEY); } catch (e) {}
    if (!v) return null;
    return v.charAt(0).toUpperCase() + v.slice(1);
  }

  function navHtml(compact) {
    return NAV.map(function (item) {
      if (item.section) return compact ? '' : '<div class="lh-nav-section">' + item.section + '</div>';
      if (compact && item.soon) return '';
      var cls = 'lh-nav-item' + (isActive(item) ? ' is-active' : '') + (item.soon ? ' is-soon' : '');
      var inner = svg(item.icon) + '<span>' + (compact && item.short ? item.short : item.label) + '</span>' +
        (item.soon ? '<em>Soon</em>' : '');
      if (item.soon) return '<span class="' + cls + '">' + inner + '</span>';
      var subs = !compact && SUBS[item.label];
      var link = '<a class="' + cls + '" href="' + item.href + '"' +
        (isActive(item) ? ' aria-current="page"' : '') + '>' + inner + '</a>';
      if (!subs) return link;
      // A term with its pages: open when you're in that term; ▸ opens the others.
      var open = isActive(item);
      return '<div class="lh-nav-group' + (open ? ' is-open' : '') + '"><div class="lh-nav-row">' + link +
        '<button type="button" class="lh-nav-toggle" aria-label="Show ' + item.label + ' pages" aria-expanded="' + open + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button></div>' +
        '<div class="lh-nav-subs">' + subs.map(function (x) {
          var on = isHere(root + x[1]);
          return '<a class="lh-nav-sub' + (on ? ' is-active' : '') + '" href="' + root + x[1] + '"' + (on ? ' aria-current="page"' : '') + '>' + x[0] + '</a>';
        }).join('') + '</div></div>';
    }).join('');
  }
  // The page a sub link goes to: same path, and its view if it names one.
  function isHere(href) {
    var u = new URL(href, location.href), here = location.pathname.replace(/\/index\.html$/, '/'), there = u.pathname.replace(/\/index\.html$/, '/');
    if (here !== there) return false;
    var want = u.searchParams, have = new URLSearchParams(location.search);
    var ok = true;
    want.forEach(function (v, k) { if (have.get(k) !== v) ok = false; });
    if (!u.searchParams.has('own') && have.has('own')) ok = false;
    return ok && (!u.hash || u.hash === location.hash);
  }

  function logout(e) {
    e.preventDefault();
    try { localStorage.removeItem(isStaff ? STAFF_KEY : KID_KEY); } catch (err) {}
    location.href = root + (isStaff ? 'staff/index.html' : 'index.html');
  }

  function build() {
    var app = document.getElementById('app');
    var name = signedInName();
    var homeHref = root + (isStaff ? 'staff/index.html' : 'index.html');
    var logo = '<a class="lh-logo" href="' + homeHref + '"><img src="' + assets + 'lifehub-logo.png" alt="LifeHub — A Homeschooling Cooperative"></a>';
    var footer =
      '<footer class="lh-footer"><span><strong>LifeHub</strong> &middot; A Homeschooling Cooperative</span>' +
      '<span>Connect<i>&bull;</i>Create<i>&bull;</i>Cultivate</span></footer>';

    document.body.classList.add('lh-has-shell', name ? 'lh-signed-in' : 'lh-signed-out');
    if (isStaff) document.body.classList.add('lh-staff');

    var shell = document.createElement('div');
    shell.className = 'lh-shell';

    if (name) {
      var initial = name.charAt(0);
      shell.innerHTML =
        '<aside class="lh-side">' +
          logo +
          '<div class="lh-side-title">Risers Journey<span>' + (isStaff ? 'Staff workspace' : 'Student portal') + '</span></div>' +
          '<nav class="lh-nav" aria-label="Main">' + navHtml(false) + '</nav>' +
          '<div class="lh-profile">' +
            '<span class="lh-avatar">' + initial + '</span>' +
            '<span class="lh-profile-name">' + name + '<small>' + (isStaff ? 'Facilitator' : 'Riser') + '</small></span>' +
            '<a href="#" class="lh-logout" title="Log out" aria-label="Log out">' + svg('logout') + '</a>' +
          '</div>' +
        '</aside>' +
        '<div class="lh-main">' +
          '<header class="lh-topbar">' + logo +
            '<span class="lh-topbar-title">Risers Journey</span>' +
            '<span class="lh-avatar lh-avatar-sm">' + initial + '</span>' +
            '<a href="#" class="lh-logout" aria-label="Log out">' + svg('logout') + '</a>' +
          '</header>' +
        '</div>' +
        '<nav class="lh-tabbar" aria-label="Main">' + navHtml(true) + '</nav>';
    } else {
      shell.innerHTML = '<div class="lh-main"><header class="lh-gatebar">' + logo + '</header></div>';
    }

    document.body.insertBefore(shell, document.body.firstChild);
    var main = shell.querySelector('.lh-main');
    if (app) main.appendChild(app);
    main.insertAdjacentHTML('beforeend', footer);

    Array.prototype.forEach.call(shell.querySelectorAll('.lh-logout'), function (a) { a.addEventListener('click', logout); });
    Array.prototype.forEach.call(shell.querySelectorAll('.lh-nav-toggle'), function (b) {
      b.addEventListener('click', function () {
        var g = b.closest('.lh-nav-group'), open = g.classList.toggle('is-open');
        b.setAttribute('aria-expanded', open);
      });
    });
    // Pages' own in-page "Log out" links re-render a sign-in card without
    // a reload; send them through the same full logout so the shell resets.
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('#logout-link');
      if (t) { e.stopImmediatePropagation(); logout(e); }
    }, true);
  }

  if (document.body && document.getElementById('app')) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
