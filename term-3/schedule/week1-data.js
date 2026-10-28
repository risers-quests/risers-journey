/* Term 3 — the week 1 plan (26–30 October), Monday to Friday, for each
   Riser. Music and Tamil are where they always are. Thursday and Friday
   are placeholders for now: To be planned, around Snack, Lunch, music
   and Tamil. Times are minutes after midnight: [start, end, what].
   The staff Schedules page starts each Riser's week 1 from this; staff can
   then change it, the same way as the usual week. */
(function () {
  function t(h, m) { return (h < 8 ? h + 12 : h) * 60 + m; }
  // Quest teams: Teams 2 & 3 have Why quests? first on Wednesday.
  var TEAMS_23 = ['michael', 'chris', 'elyon', 'shalom', 'owen', 'gabby'];
  // Tuesday 10:30–11:45 and 1:00–2:30 (from the whiteboard).
  var STEM_AM = ['zach', 'chris', 'yokesh', 'pranavi', 'owen'];
  var STEM_PM = ['karis', 'shalom', 'benjamin', 'michael'];
  var FUN_AM = ['gabby', 'elyon', 'eva'];
  // Tuesday afternoon Tamil, from the school timetable.
  var TAMIL = { zach: [t(1, 0), t(1, 30)], chris: [t(1, 0), t(1, 30)], yokesh: [t(1, 0), t(1, 30)],
    gabby: [t(1, 30), t(2, 0)], owen: [t(1, 30), t(2, 0)], elyon: [t(1, 30), t(2, 0)], eva: [t(1, 30), t(2, 0)],
    pranavi: [t(2, 0), t(2, 30)] };

  // Fill [from, to] with what, leaving out the given gaps (music, Tamil).
  function around(from, to, what, gaps) {
    var out = [], at = from;
    gaps.filter(Boolean).sort(function (a, b) { return a[0] - b[0]; }).forEach(function (g) {
      if (g[0] > at) out.push([at, Math.min(g[0], to), what]);
      out.push([g[0], g[1], g[2]]);
      at = Math.max(at, g[1]);
    });
    if (at < to) out.push([at, to, what]);
    return out;
  }

  function mon(k) {
    return [[t(8, 45), t(9, 15), 'Catch-up'], [t(9, 15), t(9, 45), 'Team Building Game'], [t(9, 45), t(10, 15), 'Classroom Agreement'],
      [t(10, 15), t(10, 30), 'Snack'], [t(10, 30), t(11, 45), 'Term Plan + Core Skills'], [t(11, 45), t(12, 15), 'SEL'],
      [t(12, 15), t(1, 0), 'Lunch'],
      k === 'shalom' ? [t(1, 0), t(2, 0), 'Music'] : [t(1, 0), t(2, 0), 'Group Games'],
      [t(2, 0), t(3, 0), 'Drama']];
  }

  function tue(k) {
    var d = [[t(8, 45), t(9, 0), 'Daring Discussion'], [t(9, 0), t(9, 15), 'Team Building Game']];
    if (k === 'owen') d.push([t(9, 15), t(10, 15), 'Music']);
    else d.push([t(9, 15), t(9, 45), 'Core Skills'], [t(9, 45), t(10, 15), 'Team Building Games']);
    d.push([t(10, 15), t(10, 30), 'Snack']);
    d.push([t(10, 30), t(11, 45), STEM_AM.indexOf(k) !== -1 ? 'STEM' : FUN_AM.indexOf(k) !== -1 ? 'Art / Touch typing / Reading / Games' : 'Core Skills']);
    d.push([t(11, 45), t(12, 15), 'SEL'], [t(12, 15), t(1, 0), 'Lunch']);
    if (STEM_PM.indexOf(k) !== -1) d.push([t(1, 0), t(2, 30), 'STEM']);
    else d = d.concat(around(t(1, 0), t(2, 30), 'Core Skills', [
      TAMIL[k] && [TAMIL[k][0], TAMIL[k][1], 'Tamil'],
      k === 'chris' && [t(1, 30), t(2, 30), 'Music']]));
    d.push([t(2, 30), t(3, 0), 'Riser Recess']);
    return d;
  }

  function wed(k) {
    var d = [[t(8, 45), t(9, 0), 'Daring Discussion'], [t(9, 0), t(9, 45), 'Core Skills']];
    if (k === 'zach') d.push([t(9, 45), t(10, 0), 'Group Games'], [t(10, 0), t(11, 0), 'Music'], [t(11, 0), t(11, 15), 'Core Skills']);
    else {
      d.push([t(9, 45), t(10, 15), 'Group Games'], [t(10, 15), t(10, 30), 'Snack']);
      if (TEAMS_23.indexOf(k) === -1) d.push([t(10, 30), t(11, 15), 'Core Skills']);
    }
    if (TEAMS_23.indexOf(k) !== -1) d.push([t(10, 30), t(11, 0), 'Why quests?'], [t(11, 0), t(11, 30), 'Choose our quest'], [t(11, 30), t(12, 15), 'Core Skills']);
    else d.push([t(11, 15), t(11, 45), 'Why quests?'], [t(11, 45), t(12, 15), 'Choose our quest']);
    d.push([t(12, 15), t(1, 0), 'Lunch'], [t(1, 0), t(2, 30), 'Global Exploration'], [t(2, 30), t(3, 0), 'Early Dismissal']);
    return d;
  }

  // Named groups, for labels on the at-a-glance view.
  window.T3_WEEK1_GROUPS = {
    'Teams 2 & 3': TEAMS_23,
    'Teams 1 & 4': ['benjamin', 'yokesh', 'eva', 'karis', 'pranavi', 'zach']
  };

  var school = window.T3_TIMETABLE || {};

  // Thursday and Friday, until they are planned: the school day's Snack
  // and Lunch, and the Riser's music and Tamil from the school timetable.
  window.T3_WEEK1_TBP = 'To be planned';
  function later(k, day) {
    var gaps = ((school[k] || {})[day] || []).filter(function (b) { return /music|tamil/i.test(b[2]); });
    var cut = function (from, to) {
      return around(from, to, window.T3_WEEK1_TBP, gaps.filter(function (g) { return g[0] < to && g[1] > from; }));
    };
    return cut(t(8, 45), t(10, 15)).concat([[t(10, 15), t(10, 30), 'Snack']], cut(t(10, 30), t(12, 15)),
      [[t(12, 15), t(1, 0), 'Lunch']], cut(t(1, 0), t(3, 0)));
  }

  window.T3_WEEK1 = {};
  Object.keys(school).forEach(function (k) {
    window.T3_WEEK1[k] = { Mon: mon(k), Tue: tue(k), Wed: wed(k), Thu: later(k, 'Thu'), Fri: later(k, 'Fri') };
  });
})();
