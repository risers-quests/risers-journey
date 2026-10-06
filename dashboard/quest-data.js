/* Shared quest data + scoring rules for the kid-facing pages (Home and My
   Quests), so the two can never disagree about what "done", "genuinely
   understood", or "how high the thinking reached" mean. Same rules as the
   staff Feedback page and the staff Quests status badges. */
(function () {
  var WORKER_URL = 'https://risers-term2-digital-quests-progress.highergrade.workers.dev';
  var SITE_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';
  var BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate'];

  function workerUrl(endpoint, group, kid, week) {
    return WORKER_URL + endpoint + '?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(week);
  }

  // Returns { ok, state, updatedAt }. ok:false means the fetch itself failed
  // or the Worker rejected it — a real problem, NOT the same as ok:true /
  // state:null (Worker reached fine, kid just hasn't started this quest
  // yet). Conflating the two would silently hide real, already-done work
  // behind "not started", so callers surface ok:false as a visible warning.
  // A staff "Mark complete" (Teacher's View) is its own small record, week
  // key "<week>-staff", that no quest page writes to — so a Riser's open
  // tab saving its whole state can't wipe it. A week counts as completed
  // if either the Riser's record or that staff record says so.
  function fetchStaffComplete(group, kid, week) {
    return fetch(workerUrl('/sync', group, kid, week + '-staff'), { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) { return !!(res && res.found && res.data.state && res.data.state.completed); })
      .catch(function () { return false; });
  }

  function fetchWeekState(group, kid, week) {
    var main = fetch(workerUrl('/sync', group, kid, week), { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); })
      .then(function (res) {
        var found = res && res.found;
        return { ok: true, state: found ? res.data.state : null, updatedAt: found ? res.data.updatedAt : null };
      })
      .catch(function () { return { ok: false, state: null, updatedAt: null }; });
    return Promise.all([main, fetchStaffComplete(group, kid, week)]).then(function (r) {
      var out = r[0];
      out.staffComplete = r[1];
      if (out.ok && r[1]) out.state = Object.assign({}, out.state || {}, { completed: true });
      return out;
    });
  }

  function fetchRating(group, kid, week) {
    return fetch(workerUrl('/rating', group, kid, week), { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) { return (res && res.found) ? res.data : null; })
      .catch(function () { return null; });
  }

  // A question counts as genuinely understood if it passed on the kid's own
  // merit, or a facilitator granted a pass specifically because the
  // reasoning was right (not just "close enough, move on").
  function isGenuinePass(r) {
    if (!r) return false;
    if (r.success && !r.contentFlagged) return true;
    if (r.contentFlagged && r.passReasons && r.passReasons.length) {
      var reasons = r.passReasons;
      var logicRight = reasons.indexOf('Logic right') !== -1 || reasons.indexOf('Full pass — everything right') !== -1;
      var logicShaky = reasons.indexOf('Partially right') !== -1 || reasons.indexOf('Logic wrong') !== -1;
      return logicRight && !logicShaky;
    }
    return false;
  }

  // Highest Bloom's level with solid (>=60%) genuine mastery among the
  // quest's tagged questions, climbing the ordered list.
  function bloomCeiling(bloomMap, reflect) {
    var counts = {};
    BLOOM_LEVELS.forEach(function (l) { counts[l] = { total: 0, hit: 0 }; });
    Object.keys(bloomMap).forEach(function (id) {
      var level = bloomMap[id];
      if (!counts[level]) return;
      counts[level].total++;
      if (isGenuinePass(reflect[id])) counts[level].hit++;
    });
    var ceiling = null;
    BLOOM_LEVELS.forEach(function (l) {
      if (counts[l].total && (counts[l].hit / counts[l].total) >= 0.6) ceiling = l;
    });
    return { counts: counts, ceiling: ceiling };
  }

  function totalTimeMs(state) {
    var dayTime = (state && state.dayTime) || {};
    return Object.keys(dayTime).reduce(function (sum, k) { return sum + (dayTime[k] || 0); }, 0);
  }

  function fmtTime(ms) {
    if (!ms) return '0m';
    var mins = Math.round(ms / 60000);
    if (mins < 1) return '<1m';
    if (mins < 60) return mins + 'm';
    return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
  }

  // One quest week at a glance. Status follows the staff badge rule:
  // Completed only from the kid's own "Complete My Quest" click; In
  // progress on any real activity; otherwise Not started.
  function summarizeWeek(weekCfg, state) {
    var reflect = (state && state.reflect) || {};
    var build = (state && state.build) || {};
    var ids = Object.keys(weekCfg.topics || {});
    var questions = ids.map(function (id) {
      var r = reflect[id];
      var status = (r && r.success) ? 'done' : (r && (r.attempts > 0 || (r.text && r.text.trim()))) ? 'tried' : 'todo';
      return { id: id, topic: weekCfg.topics[id], status: status };
    });
    var passed = questions.filter(function (q) { return q.status === 'done'; }).length;
    var tried = questions.filter(function (q) { return q.status !== 'todo'; }).length;
    var buildTotal = weekCfg.buildTotal || 0;
    var buildDone = Math.min(buildTotal, Object.keys(build).filter(function (k) { return build[k]; }).length);
    var timeMs = totalTimeMs(state);
    var completed = !!(state && state.completed);
    var active = tried > 0 || buildDone > 0 || timeMs > 0;
    var steps = ids.length + buildTotal;
    var pct = completed ? 100 : steps ? Math.round(((passed + buildDone) / steps) * 100) : 0;
    return {
      status: completed ? 'completed' : active ? 'in-progress' : 'not-started',
      questions: questions,
      passed: passed,
      questionTotal: ids.length,
      buildDone: buildDone,
      buildTotal: buildTotal,
      pct: pct,
      timeMs: timeMs,
      bloom: weekCfg.bloom ? bloomCeiling(weekCfg.bloom, reflect) : null
    };
  }

  window.QUEST_DATA = {
    BLOOM_LEVELS: BLOOM_LEVELS,
    fetchWeekState: fetchWeekState,
    fetchRating: fetchRating,
    isGenuinePass: isGenuinePass,
    bloomCeiling: bloomCeiling,
    totalTimeMs: totalTimeMs,
    fmtTime: fmtTime,
    summarizeWeek: summarizeWeek
  };
})();
