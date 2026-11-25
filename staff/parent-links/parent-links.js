/* Staff: the one link for all Risers' parents (no sign-in), and which
   questionnaires each child's parents get from it. Which ones a child gets
   is set on each questionnaire's own staff page: OK it, pick the families. */
(function () {
  var app = document.getElementById('app');
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

  app.appendChild(el('header', 'hd-welcome', '<h1>Parents’ form</h1><p>One link for every Riser’s parents. They pick their child and answer that child’s questions. No sign-in.</p>'));
  var wrap = el('div', 'sg');
  app.appendChild(wrap);
  var linkSec = el('section', 'sg-sec', '<h2>The link</h2><p>Loading…</p>');
  var whoSec = el('section', 'sg-sec', '<h2>Who gets what</h2><p>To change this, open the questionnaire’s staff page, OK it and pick the families: ' +
    '<a href="/term-3/next-year/index.html?view=staff">Next year at LifeHub</a> · <a href="/term-3/grade10/index.html?view=staff">10th Boards</a>. ' +
    'Answers show there, for staff only.</p><ul class="sg-list"></ul>');
  wrap.appendChild(linkSec);
  wrap.appendChild(whoSec);

  fetch('/api/auth/parent-form', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (r) {
    if (!r.ok) { linkSec.querySelector('p').textContent = r.error || 'Couldn’t load.'; return; }
    var msg = 'Dear parents, please fill in this short form about your child’s plans for next year: ' + r.link;
    linkSec.innerHTML = '<h2>The link</h2><p class="sg-code" style="font-size:1.2rem;letter-spacing:0">' + esc(r.link) + '</p>' +
      '<p><button class="sg-btn" type="button" id="pl-copy">Copy link</button> ' +
      '<a class="sg-btn is-quiet" style="text-decoration:none;display:inline-block" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(msg) + '">Send on WhatsApp</a> ' +
      '<span class="sg-msg" id="pl-msg"></span></p>' +
      '<p>Anyone with the link can send answers for any child, so share it only with parents. It never shows saved answers. If a form is sent twice for a child, the earlier answers are kept.</p>';
    document.getElementById('pl-copy').onclick = function () {
      var done = function () { document.getElementById('pl-msg').textContent = 'Copied.'; };
      if (navigator.clipboard) navigator.clipboard.writeText(r.link).then(done, function () { prompt('Copy this link:', r.link); });
      else prompt('Copy this link:', r.link);
    };
    whoSec.querySelector('.sg-list').innerHTML = r.kids.map(function (k) {
      return '<li class="sg-row"><span class="sg-name">' + esc(k.name) + '</span>' +
        (k.forms.length ? k.forms.map(function (f) { return '<span class="sg-tag">' + esc(f) + '</span>'; }).join(' ') : '<span class="sg-tag is-none">Nothing yet</span>') + '</li>';
    }).join('');
  });
})();
