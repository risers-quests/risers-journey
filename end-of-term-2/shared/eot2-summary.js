/* Term 2 Conference — summaries of a Riser's own answers, shown at the end
   of their finished Self-Assessment and Term Reflection, and on the staff
   read-outs of both. Worked out from the answers alone (no staff input):

   - Self-Assessment: how the ratings spread across the scale, the areas
     rated highest and lowest (by average rating), and the statements at
     either end of the scale.
   - Term Reflection: answer options run from the strongest habit to the
     weakest, so each answer sorts into "Going well" (the strong end) or
     "To work on" (the weak end), with the same habit merged across the
     three workbooks; then what they try when stuck, and what helps and
     gets in the way, in their own words. Questions with no better or
     worse answer (where they work best, how long corrections take) are
     left out of the sorting. */
(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function list(items) {
    return '<ul class="eot2-sum-list">' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
  }
  function block(title, inner) {
    return '<div class="eot2-sum-block"><h3>' + title + '</h3>' + inner + '</div>';
  }
  function wrap(inner) {
    return '<section class="eot2-summary"><h2>Summary</h2>' + inner + '</section>';
  }

  /* ---------- Self-Assessment ---------- */

  // useKidText: the Riser's own "I…" wording (their page) or the staff wording.
  window.EOT2_summarySelf = function (state, useKidText) {
    state = state || {};
    var SCALE = window.EOT2_RUBRIC_SCALE;
    var codes = SCALE.map(function (o) { return o.code; }); // NE < E < D < CD
    var counts = {}; codes.forEach(function (c) { counts[c] = 0; });
    var areas = [], high = [], low = [];
    window.EOT2_RUBRIC.forEach(function (section) {
      section.subsections.forEach(function (sub) {
        var sum = 0, n = 0;
        sub.items.forEach(function (item) {
          var v = state[item.id];
          var i = codes.indexOf(v);
          if (i === -1) return;
          counts[v]++; sum += i; n++;
          var text = useKidText ? (item.kidText || item.text) : item.text;
          if (v === 'CD') high.push(text);
          if (v === 'NE' || v === 'E') low.push({ text: text, i: i });
        });
        if (n) areas.push({ name: sub.title || section.title, avg: sum / n });
      });
    });
    if (!areas.length) return '';
    var byAvg = areas.slice().sort(function (a, b) { return b.avg - a.avg; });
    var top = byAvg.filter(function (a) { return a.avg >= byAvg[0].avg - 0.01; }).slice(0, 2);
    var bottom = byAvg.slice().reverse().filter(function (a) { return a.avg <= byAvg[byAvg.length - 1].avg + 0.01; }).slice(0, 2);
    var spread = byAvg[0].avg - byAvg[byAvg.length - 1].avg >= 0.5;
    var label = function (avg) { return SCALE[Math.round(avg)].label; };
    low.sort(function (a, b) { return a.i - b.i; });

    var html = '<div class="eot2-sum-spread">' + codes.slice().reverse().map(function (c) {
      return '<span class="eot2-sum-chip"><strong>' + counts[c] + '</strong>' + esc(SCALE[codes.indexOf(c)].label) + '</span>';
    }).join('') + '</div>';
    html += '<div class="eot2-sum-grid">' +
      block('Strongest', list(top.map(function (a) { return '<strong>' + esc(a.name) + '</strong> — mostly ' + esc(label(a.avg)); }))) +
      (spread ? block('Still growing', list(bottom.map(function (a) { return '<strong>' + esc(a.name) + '</strong> — mostly ' + esc(label(a.avg)); }))) : '') +
      '</div>';
    if (high.length) html += block('Does this every time', list(high.slice(0, 4).map(esc)));
    if (low.length) html += block('Still building', list(low.slice(0, 4).map(function (l) { return esc(l.text); })));
    return wrap(html);
  };

  /* ---------- Term Reflection ---------- */

  var HABITS = {
    check1: 'Checking answers', check2: 'Counting right and wrong', fix1: 'Fixing mistakes',
    fix2: 'Doing corrections', where2: 'Working at home',
    'assess-count': 'Asking for assessments', 'assess-when': 'When I ask for assessments',
    'assess-quiz': 'Checking myself with small quizzes', 'assess-after': 'After an assessment',
    'board-use': 'Planning with my board', 'board-move': 'Updating my board', 'board-finish': 'Finishing my weekly goals',
    'conn-included': 'Feeling included', 'conn-workwell': 'Working with others', 'conn-disagree': 'Sorting out disagreements',
    'conn-staffhelp': 'Asking staff for help', 'conn-stafflisten': 'Feeling listened to', 'conn-staffknow': 'Staff knowing how I’m doing'
  };
  // Options listed weakest first instead of strongest first.
  var REVERSED = { 'assess-count': true };
  // An answer that's fine but not the strongest — never sorted as "to work on".
  var NEUTRAL = { 'Ask someone for help': true, 'No, but I’d like to try': true, "No, but I'd like to try": true };

  function habitKey(id) {
    if (HABITS[id]) return id;
    var suffix = id.split('-').slice(1).join('-');
    return HABITS[suffix] ? suffix : null;
  }

  window.EOT2_summaryReflection = function (band, state) {
    state = state || {};
    var data = window.EOT2_REFLECTION[band];
    var good = [], work = [], stuck = {}, helps = [], hinders = [];
    function add(listRef, label, answer, where) {
      var key = label + '|' + answer;
      var found = listRef.filter(function (x) { return x.key === key; })[0];
      if (found) { if (where && found.where.indexOf(where) === -1) found.where.push(where); return; }
      listRef.push({ key: key, label: label, answer: answer, where: where ? [where] : [] });
    }
    data.sections.forEach(function (section) {
      var workbook = (section.heading.match(/^My (.+) Workbook$/) || [])[1] || '';
      section.questions.forEach(function (q) {
        var v = state[q.id];
        if (!v) return;
        if (q.type === 'matrix') {
          Object.keys(v).forEach(function (row) {
            if (v[row] === q.scale[0] || v[row] === q.scale[1]) stuck[row] = true;
          });
          return;
        }
        if (q.type === 'text') {
          if (!String(v).trim()) return;
          (/^helps/.test(q.id) ? helps : hinders).push('<span class="eot2-sum-q">' + esc(q.text.replace(/[:…]\s*$/, '')) + '</span> ' + esc(String(v).trim()));
          return;
        }
        var key = habitKey(q.id);
        if (!key || !q.options) return;
        var i = q.options.indexOf(v);
        if (i === -1 || NEUTRAL[v]) return;
        var pos = q.options.length > 1 ? i / (q.options.length - 1) : 0;
        if (REVERSED[key]) pos = 1 - pos;
        if (pos <= 0.25) add(good, HABITS[key], v, workbook);
        else if (pos >= 0.67) add(work, HABITS[key], v, workbook);
      });
    });
    function line(x) {
      var answer = /^I\b/.test(x.answer) ? x.answer : x.answer.charAt(0).toLowerCase() + x.answer.slice(1);
      return '<strong>' + esc(x.label) + '</strong> — ' + esc(answer) +
        (x.where.length ? ' <span class="eot2-sum-where">(' + esc(x.where.join(', ')) + ')</span>' : '');
    }
    var stuckList = Object.keys(stuck);
    if (!good.length && !work.length && !stuckList.length && !helps.length && !hinders.length) return '';
    var html = '<div class="eot2-sum-grid">' +
      block('Going well', good.length ? list(good.map(line)) : '<p class="eot2-sum-none">Nothing at the strong end yet.</p>') +
      block('To work on', work.length ? list(work.map(line)) : '<p class="eot2-sum-none">Nothing at the weak end.</p>') +
      '</div>';
    if (stuckList.length) html += block('When stuck, tries', '<p>' + esc(stuckList.join(' · ')) + '</p>');
    if (helps.length || hinders.length) {
      html += '<div class="eot2-sum-grid">' +
        (helps.length ? block('What helps', list(helps)) : '') +
        (hinders.length ? block('What gets in the way', list(hinders)) : '') +
        '</div>';
    }
    return wrap(html);
  };
})();
