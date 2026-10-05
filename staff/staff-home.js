/* Risers Journey — Staff home. The one sign-in for the staff side (name
   only, from the fixed list of three), then the same calm launchpad as the
   kid Home: a greeting and one tile per category. Each category's
   details — the Risers' quest progress, End of Term 2 status — live only
   on that category's own page. */
(function () {
  var STAFF_KEY = 'rj-staff-name';
  var app = document.getElementById('app');
  var STAFF_NAMES = window.EOT2_STAFF_RATERS.filter(function (r) { return r.id !== 'consolidated'; });

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function showGate() {
    app.innerHTML = '';
    var gate = el('div', 'name-gate');
    var options = STAFF_NAMES.map(function (r) { return '<option value="' + r.id + '">' + r.label + '</option>'; }).join('');
    gate.innerHTML =
      '<h1>Risers Journey &mdash; Staff</h1>' +
      '<p>Who are you?</p>' +
      '<select id="staff-select">' + options + '</select>' +
      '<button type="button" class="btn btn-primary" id="staff-go-btn">Go &rarr;</button>';
    app.appendChild(gate);
    document.getElementById('staff-go-btn').addEventListener('click', function () {
      var id = document.getElementById('staff-select').value;
      try { localStorage.setItem(STAFF_KEY, id); } catch (e) {}
      // Reload so the app shell (navigation, profile) picks up the sign-in.
      location.reload();
    });
  }

  function renderHome(staffInfo) {
    var h = new Date().getHours();
    var hello = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    app.innerHTML = '';
    app.appendChild(el('header', 'hd-welcome',
      '<p class="hd-eyebrow">' + new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</p>' +
      '<h1>' + hello + ', ' + staffInfo.label + '</h1>' +
      '<p>Where would you like to go today?</p>'));
    app.appendChild(el('div', 'hd-tiles', window.LH_tiles([
      { title: 'Quests', desc: 'Every Riser’s self-paced quests, with feedback.', href: 'quests/index.html', icon: 'quests', tone: 'green' },
      { title: 'End of Term 2', desc: 'Self-assessments, reflections and MOMs.', href: '../end-of-term-2/staff/index.html', icon: 'term', tone: 'slate' },
      { title: 'Core Skills', desc: 'Subject-by-subject progress.', icon: 'skills', tone: 'amber', soon: true },
      { title: 'SEL', desc: 'Social & emotional growth.', icon: 'sel', tone: 'rose', soon: true }
    ])));
  }

  function init() {
    var id = null;
    try { id = localStorage.getItem(STAFF_KEY); } catch (e) {}
    var info = id ? STAFF_NAMES.filter(function (r) { return r.id === id; })[0] : null;
    if (info) { renderHome(info); } else { showGate(); }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
