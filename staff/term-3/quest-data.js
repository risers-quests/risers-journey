/* Term 3 Quests — the shared facts: groups, which project levels each group
   sees, when each Riser works on their quest, the school weeks, and how
   long a project should take.

   Quest time is Negotiable Time on Monday, Tuesday and Wednesday (from the
   Risers' timetables): Monday and Wednesday are group work, Tuesday is each
   Riser's own work. */
(function () {
  window.T3Q = {
    GROUPS: [
      { id: 'g1', name: 'Group 1', kids: ['Benjamin', 'Yokesh', 'Eva'] },
      { id: 'g2', name: 'Group 2', kids: ['Michael', 'Chris', 'Elyon'] },
      { id: 'g3', name: 'Group 3', kids: ['Shalom', 'Owen', 'Gabby'] },
      { id: 'g4', name: 'Group 4', kids: ['Karis', 'Pranavi', 'Zach'] }
    ],
    // The project levels each group chooses from (Groups 1 and 2 harder).
    LEVELS: { g1: [2, 3], g2: [2, 3], g3: [1, 2], g4: [1, 2] },
    // Expected length of a project, in school weeks, by level.
    WEEKS_BY_LEVEL: { 1: 4, 2: 6, 3: 8 },
    // Quest times. Monday and Wednesday: the whole group together.
    // Tuesday: each Riser on their own.
    TIMES: {
      g1: { mon: '10:30–11:45', wed: '11:00–12:15', tue: { Benjamin: '10:30–11:45', Yokesh: '1:30–2:30', Eva: '10:30–11:45' } },
      g2: { mon: '9:00–10:15', wed: '9:15–10:30', tue: { Michael: '9:00–10:15', Chris: '9:15–10:15', Elyon: '10:30–11:45' } },
      g3: { mon: '9:00–10:15', wed: '9:15–10:30', tue: { Shalom: '9:00–10:15', Owen: '1:00–1:30 and 2:00–2:30', Gabby: '10:30–11:45' } },
      g4: { mon: '10:30–11:45', wed: '11:00–12:15', tue: { Karis: '10:30–11:45', Pranavi: '1:00–2:00', Zach: '1:30–2:30' } }
    },
    CATS: {
      sol: { name: 'Make it for LifeHub', hookLbl: 'Why it matters', note: 'Design and build something real that LifeHub will use every day.' },
      sci: { name: 'Science in action', hookLbl: 'Big idea', note: 'Build something that shows how science works. Test it, and show what you found out.' }
    },
    ROLES: {
      sol: [
        { name: 'Researcher', icon: '🔎', duties: ['Talks to the people who will use it (Risers, facilitators)', 'Writes down what it must do, in one clear sentence', 'Checks it really works for the people using it', 'Leads the showcase talk'] },
        { name: 'Designer', icon: '✏️', duties: ['Sketches the plan with measurements', 'Makes the materials list', 'Designs labels, signs and instructions', 'Keeps the design log up to date'] },
        { name: 'Builder', icon: '🔨', duties: ['Leads the build and keeps tool safety', 'Measures, cuts, joins and assembles', 'Fixes what breaks during testing', 'Returns tools and leftover materials'] }
      ],
      sci: [
        { name: 'Investigator', icon: '🔬', duties: ['Researches the science idea', 'Explains it in the group’s own words', 'Writes the prediction before testing', 'Leads the showcase explanation'] },
        { name: 'Engineer', icon: '⚙️', duties: ['Leads the build and keeps tool safety', 'Follows the design and adjusts the model between tests', 'Keeps the model working for the showcase', 'Returns tools and leftover materials'] },
        { name: 'Data keeper', icon: '📊', duties: ['Plans the fair test: what changes, what stays the same', 'Measures and records every test', 'Turns results into a chart or table', 'Spots the pattern in the results'] }
      ]
    },
    // School weeks of Term 3 (first and last school day), December
    // holidays (19 Dec – 4 Jan) left out.
    WEEKS: [
      ['2026-10-26', '2026-10-30'], ['2026-11-02', '2026-11-06'], ['2026-11-09', '2026-11-13'],
      ['2026-11-16', '2026-11-20'], ['2026-11-23', '2026-11-27'], ['2026-11-30', '2026-12-04'],
      ['2026-12-07', '2026-12-11'], ['2026-12-14', '2026-12-18'],
      ['2027-01-05', '2027-01-08'], ['2027-01-11', '2027-01-15'], ['2027-01-18', '2027-01-21']
    ]
  };

  var Q = window.T3Q;
  function day(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  Q.day = day;
  Q.iso = iso;
  Q.nice = function (d) { return (typeof d === 'string' ? day(d) : d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
  Q.groupOf = function (kid) {
    var k = String(kid || '').toLowerCase();
    return Q.GROUPS.filter(function (g) { return g.kids.some(function (n) { return n.toLowerCase() === k; }); })[0] || null;
  };
  Q.weeksFor = function (b) { return b.weeks || Q.WEEKS_BY_LEVEL[b.level] || 6; };
  // The school week (1–11) a date falls in; before term, week 1; in the
  // holidays, the next week; after term, the last week.
  Q.weekOf = function (d) {
    d = d || new Date();
    var t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    for (var i = 0; i < Q.WEEKS.length; i++) if (t <= day(Q.WEEKS[i][1])) return i + 1;
    return Q.WEEKS.length;
  };
  // The school week a project starts in (Thursday or Friday: the next one).
  Q.startWeek = function (startIso) {
    var s = day(startIso), w = Q.weekOf(s);
    if (s.getDay() === 4 || s.getDay() === 5) w += 1;
    return Math.min(w, Q.WEEKS.length);
  };
  // The four stages of a project's plan, as school-week ranges: the weeks
  // shared out as evenly as possible, with any extra going to the middle.
  Q.stageWeeks = function (b, startIso) {
    var total = Q.weeksFor(b), base = Math.floor(total / 4), extra = total - base * 4;
    var sizes = [base, base, base, base];
    [1, 2, 0, 3].slice(0, extra).forEach(function (i) { sizes[i] += 1; });
    var w = Q.startWeek(startIso), out = [];
    sizes.forEach(function (n) {
      var from = Math.min(w, Q.WEEKS.length), to = Math.min(w + Math.max(n, 1) - 1, Q.WEEKS.length);
      out.push({ from: from, to: to });
      w += Math.max(n, 1);
    });
    return out;
  };
  Q.weekLabel = function (r) {
    var a = Q.WEEKS[r.from - 1], b = Q.WEEKS[r.to - 1];
    var dm = function (x) { return day(x).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
    return (r.from === r.to ? 'Week ' + r.from : 'Weeks ' + r.from + '–' + r.to) + ' · ' + dm(a[0]) + ' – ' + dm(b[1]);
  };
  // The Wednesday (last group session) of the n-th school week from the
  // week a project starts. A project chosen on Thursday or Friday starts
  // the next week.
  Q.deadline = function (startIso, weeks) {
    var s = day(startIso), w = Q.weekOf(s);
    if (s.getDay() === 4 || s.getDay() === 5) w += 1;
    var last = Math.min(w + weeks - 1, Q.WEEKS.length);
    var wk = Q.WEEKS[last - 1];
    var wed = day(wk[0]);
    while (wed.getDay() !== 3) wed.setDate(wed.getDate() + 1);
    return { date: iso(wed), week: last, short: w + weeks - 1 > Q.WEEKS.length };
  };
})();
