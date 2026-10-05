(function () {
  var app = document.getElementById('app');

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

  app.appendChild(el('div', 'eot2-crumb', '<a href="../../staff/index.html">Home</a> &middot; <a href="../index.html">Term 2 Conference</a>'));

  var head = el('div', 'eot2-head');
  head.innerHTML = '<h1>Term 2 Conference — Staff View</h1><p>Completion across every kid and every form. Click a badge to open that record.</p>' +
    '<p class="eot2-head-action"><a class="eot2-btn" href="../consolidate/index.html">Consolidate self-assessments &rarr;</a></p>';
  app.appendChild(head);

  var tableWrap = el('div', null, '<p class="eot2-msg">Loading…</p>');
  app.appendChild(tableWrap);

  var table = document.createElement('table');
  table.className = 'eot2-roster-table';
  var theadHtml = '<thead><tr><th>Kid</th><th colspan="5">Self-Assessment</th><th>Term Reflection</th><th>MOM</th></tr>' +
    '<tr><th></th>' + SA_RATERS.map(function (r) { return '<th>' + r.label + '</th>'; }).join('') + '<th></th><th></th></tr></thead>';
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
      var href = rater.id === 'consolidated'
        ? '../consolidate/index.html?kid=' + kid.slug
        : '../self-assessment/index.html?rater=' + rater.id + '&kid=' + kid.slug;
      fetches.push(window.eot2Fetch(kid.group, kid.slug, weekKey).then(function (data) {
        td.appendChild(badge(hasAnyAnswer(data && data.state), href, hasAnyAnswer(data && data.state) ? '✓' : '—'));
      }));
    });

    var reflTd = document.createElement('td');
    tr.appendChild(reflTd);
    fetches.push(window.eot2Fetch(kid.group, kid.slug, 'term2-term-reflection').then(function (data) {
      var done = hasAnyAnswer(data && data.state);
      reflTd.appendChild(badge(done, '../term-reflection/index.html', done ? 'Done' : 'Not started'));
    }));

    var momTd = document.createElement('td');
    tr.appendChild(momTd);
    fetches.push(window.eot2Fetch(kid.group, kid.slug, 'term2-mom').then(function (data) {
      var done = hasAnyAnswer(data && data.state);
      momTd.appendChild(badge(done, '../mom/index.html?editAs=Jeran&kid=' + kid.slug, done ? 'Written' : 'Not written'));
    }));

    tbody.appendChild(tr);
    Promise.all(fetches).catch(function () {});
  });

  tableWrap.innerHTML = '';
  tableWrap.appendChild(table);
})();
