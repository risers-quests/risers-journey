(function () {
  var app = document.getElementById('app');
  // Whoever is signed in on the staff side writes the MOM (falls back to
  // Jeran, as before, if nobody is).
  var staffLabel = 'Jeran';
  try {
    var signedIn = localStorage.getItem('rj-staff-name');
    var match = window.EOT2_STAFF_RATERS.filter(function (r) { return r.id === signedIn; })[0];
    if (match && match.id !== 'consolidated') staffLabel = match.label;
  } catch (e) {}

  var SA_RATERS = [
    { id: 'self', label: 'Self' },
    { id: 'jeran', label: 'Jeran' },
    { id: 'nishitha', label: 'Nishitha' },
    { id: 'blessy', label: 'Blessy' },
    { id: 'consolidated', label: 'Consolidated' }
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function hasAnyAnswer(state) {
    if (!state) return false;
    return Object.keys(state).some(function (k) {
      var v = state[k];
      if (v && typeof v === 'object') return Object.keys(v).length > 0;
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
  }

  function badge(done, href, label) {
    var a = document.createElement('a');
    a.href = href;
    a.className = 'eot2-roster-badge ' + (done ? 'eot2-roster-done' : 'eot2-roster-empty');
    a.textContent = label;
    return a;
  }

  app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/index.html">&larr; Home</a>'));

  var head = el('div', 'eot2-head');
  head.innerHTML = '<h1>Term 2 Conference — Staff View</h1><p>Completion across every kid and every form. Click a badge to open that record.</p>' +
    '<p class="eot2-head-action"><a class="eot2-btn" href="../consolidate/index.html">Consolidate self-assessments &rarr;</a> ' +
    '<a class="eot2-btn eot2-btn-secondary" href="../my-say/index.html?view=staff">My Week, My Say: every Riser &rarr;</a></p>';
  app.appendChild(head);

  var tableWrap = el('div', null, '<p class="eot2-msg">Loading…</p>');
  app.appendChild(tableWrap);

  var table = document.createElement('table');
  table.className = 'eot2-roster-table';
  var theadHtml = '<thead><tr><th>Kid</th><th colspan="5">Self-Assessment</th><th>Term Reflection</th><th>My Say</th><th>MOM</th></tr>' +
    '<tr><th></th>' + SA_RATERS.map(function (r) { return '<th>' + r.label + '</th>'; }).join('') + '<th></th><th></th><th></th></tr></thead>';
  var tbody = document.createElement('tbody');
  table.innerHTML = theadHtml;
  table.appendChild(tbody);

  window.EOT2_KIDS.forEach(function (kid) {
    var tr = document.createElement('tr');
    var nameTd = document.createElement('td');
    nameTd.className = 'eot2-roster-name';
    nameTd.textContent = kid.name;
    tr.appendChild(nameTd);

    var fetches = [];

    SA_RATERS.forEach(function (rater) {
      var td = document.createElement('td');
      tr.appendChild(td);
      var weekKey = 'term2-self-assessment-' + rater.id;
      var href = rater.id === 'consolidated' ? '../consolidate/index.html?kid=' + kid.slug
        : rater.id === 'self' ? '../self-assessment/index.html?rater=self&view=staff&kid=' + kid.slug
        : '../self-assessment/index.html?rater=' + rater.id + '&kid=' + kid.slug;
      fetches.push(window.eot2Fetch(kid.group, kid.slug, weekKey).then(function (data) {
        td.appendChild(badge(hasAnyAnswer(data && data.state), href, hasAnyAnswer(data && data.state) ? '✓' : '—'));
      }));
    });

    var reflTd = document.createElement('td');
    tr.appendChild(reflTd);
    fetches.push(window.eot2Fetch(kid.group, kid.slug, 'term2-term-reflection').then(function (data) {
      var done = hasAnyAnswer(data && data.state);
      reflTd.appendChild(badge(done, '../term-reflection/index.html?view=staff&kid=' + kid.slug, done ? 'Done' : 'Not started'));
    }));

    var sayTd = document.createElement('td');
    tr.appendChild(sayTd);
    fetches.push(window.eot2Fetch(kid.group, kid.slug, 'term2-my-say').then(function (data) {
      var st = data && data.state;
      var done = !!(st && st._submitted);
      sayTd.appendChild(badge(done, '../my-say/index.html?view=staff&kid=' + kid.slug, done ? 'Submitted' : st ? 'Started' : 'Not started'));
    }));

    var momTd = document.createElement('td');
    tr.appendChild(momTd);
    fetches.push(Promise.all([
      window.eot2Fetch(kid.group, kid.slug, 'term2-mom'),
      window.eot2Fetch(kid.group, kid.slug, 'term2-mom-family')
    ]).then(function (r) {
      // Part 2 submitted = the plan is agreed; Part 1 submitted = the
      // family's reflection is in; Started = drafts or older notes only.
      var mom = (r[0] && r[0].state) || {}, fam = (r[1] && r[1].state) || {};
      var planned = !!mom.p2_sub, part1 = !!fam.p1_sub;
      var label = planned ? 'Part 2 submitted' : part1 ? 'Part 1 submitted' : (hasAnyAnswer(mom) || hasAnyAnswer(fam)) ? 'Started' : 'Not started';
      momTd.appendChild(badge(planned, '../mom/index.html?editAs=' + encodeURIComponent(staffLabel) + '&kid=' + kid.slug, label));
    }));

    tbody.appendChild(tr);
    Promise.all(fetches).catch(function () {});
  });

  tableWrap.innerHTML = '';
  tableWrap.appendChild(table);

  // Each Riser's own link: their name plus two words nobody could guess
  // (a folder at the site root), so it opens only their Home, already
  // signed in.
  var RISER_LINKS = { eva: 'eva-misty-bramble', gabby: 'gabby-cobalt-comet', elyon: 'elyon-golden-acorn', chris: 'chris-cobalt-quartz', yokesh: 'yokesh-echo-ember', zach: 'zach-silver-meadow', owen: 'owen-silver-lantern', pranavi: 'pranavi-cosmic-quartz', shalom: 'shalom-maple-acorn', michael: 'michael-pebble-quartz', karis: 'karis-jade-ember', benjamin: 'benjamin-sunny-pepper' };
  var home = new URL('../../', location.href).href;
  var links = el('section', 'eot2-links');
  links.appendChild(el('h2', null, 'Risers’ own links'));
  links.appendChild(el('p', null, 'Each link opens that Riser’s Home, already signed in. Send it to the family.'));
  window.EOT2_KIDS.forEach(function (kid) {
    if (!RISER_LINKS[kid.slug]) return;
    var url = home + RISER_LINKS[kid.slug];
    var row = el('div', 'eot2-link-row', '<strong>' + kid.name + '</strong><a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>');
    var btn = el('button', 'eot2-btn eot2-btn-secondary', 'Copy');
    btn.type = 'button';
    btn.addEventListener('click', function () {
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('Copy this link:', url); });
      else prompt('Copy this link:', url);
    });
    row.appendChild(btn);
    links.appendChild(row);
  });
  app.appendChild(links);
})();
