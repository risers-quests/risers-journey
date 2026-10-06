/* Quest report card — the one feedback format Risers and their families
   see for a finished quest, and the staff page that reviews it uses the
   very same renderer, so what staff approve is exactly what goes out.

   Five categories, all on one four-step scale (Beginning, Developing,
   Secure, Excelling) — words, not percentages:
     Understanding      did the core ideas land (isGenuinePass, same rule
                        as the staff Feedback page), plus topics nailed /
                        worth revisiting, linked back into the quest
     Depth of thinking  Bloom's ceiling, in plain words
     Build              build steps finished, plus the build photo
     Presentation       the Day 3 presentation rubric, per criterion
     Work habits        persistence, highlights + notes, time on task

   Plus three short notes — Strength, Growth, Next step — auto-drafted from
   the categories, edited by staff, and saved with the report.

   Nothing here is shown to a Riser until staff switch on Share: the report
   record lives at week key "<week>-report" ({ shared, strength, growth,
   next, by, at }). Staff-only signals (writing flags, who passed what,
   keyword checks, per-question attempt counts) never appear. */
(function () {
  var QD = window.QUEST_DATA;
  var WORKER_URL = 'https://risers-term2-digital-quests-progress.highergrade.workers.dev';
  var SITE_KEY = 'RsmI8VwuJZ-IIieNmVss5JyChP2nf7y8mVYU5ReJLYM';
  var BANDS = ['Beginning', 'Developing', 'Secure', 'Excelling'];
  // Work that wasn't done isn't "Beginning" — it's Undone, and it is never
  // scored. Beginning is for work that was done but is still early.
  var UNDONE = -2;
  // Staff marked the quest's saved progress as partly lost (report.dataLost):
  // missing work is "Not recorded" — neutral, unscored, and never Undone.
  var NOT_RECORDED = -3;
  var BLOOM_PLAIN = {
    Remember: 'Recalls the key facts',
    Understand: 'Explains ideas in their own words',
    Apply: 'Uses ideas on something new',
    Analyze: 'Breaks ideas down and connects the parts',
    Evaluate: 'Weighs ideas and judges what holds up'
  };
  var BLOOM_YOU = {
    Remember: 'got the key facts right', Understand: 'explained ideas in your own words',
    Apply: 'used ideas on something new', Analyze: 'broke ideas down and connected the parts',
    Evaluate: 'weighed ideas and judged what holds up'
  };
  var BLOOM_ING = {
    Remember: 'getting the key facts right', Understand: 'explaining ideas in your own words',
    Apply: 'using ideas on something new', Analyze: 'breaking ideas down and connecting the parts',
    Evaluate: 'weighing ideas and judging what holds up'
  };
  var RUBRIC = [
    { key: 'content', name: 'Content accuracy' },
    { key: 'evidence', name: 'Evidence & reasoning' },
    { key: 'clarity', name: 'Clarity & organisation' },
    { key: 'delivery', name: 'Confidence & delivery' },
    { key: 'questions', name: 'Handling questions' }
  ];
  // Why a build isn't finished — chosen by staff on the review page
  // (report.buildNotes), worded for the Riser and family. Shown on the
  // Build card, and the first one chosen shapes the Growth / Next step draft.
  var BUILD_NOTES = [
    { key: 'materials', label: 'Didn’t bring build materials, more than once',
      line: 'Build materials weren’t ready on several build days, which held the build back.',
      growth: 'The build needs more intentional preparation: on several build days your materials weren’t ready, and that held the build back.',
      next: 'The evening before each build day, check the materials list and pack everything you’ll need.' },
    { key: 'time', label: 'Ran short of time',
      line: 'Time ran short before the build could be finished.',
      growth: 'Pacing is the next step: time ran short before the build could be finished.',
      next: 'Plan your build time at the start of the quest, and check halfway through that you’re on track.' },
    { key: 'absent', label: 'Missed build sessions',
      line: 'Missed build sessions left some steps unfinished.',
      growth: 'Missed build sessions left the build unfinished, and the hands-on part is where the ideas become real.',
      next: 'If you miss a build session, plan with your facilitator how to catch up that same week.' },
    { key: 'focus', label: 'Needed reminders to stay on task',
      line: 'Build time needed regular reminders to stay on task.',
      growth: 'Build time calls for more focus: it took regular reminders to stay on task.',
      next: 'At the start of each build session, set one clear goal and check it off before you finish.' }
  ];
  function buildNote(key) { return BUILD_NOTES.filter(function (n) { return n.key === key; })[0]; }

  var ABOUT = {
    understanding: 'Whether the core ideas really landed within a few tries (no more than 3 misses), judged on the thinking rather than spelling or wording.',
    depth: 'How far the thinking went, from recalling facts up to judging ideas (Bloom’s Taxonomy).',
    build: 'How much of the hands-on build was finished.',
    presentation: 'How the learning was shared on presentation day, rated by facilitators.',
    habits: 'How the work was approached: sticking with it, note-taking and time on task.'
  };
  // Strength / growth tie-break order.
  var ORDER = ['understanding', 'depth', 'presentation', 'build', 'habits'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function band(x, cuts) { // cuts: thresholds for Developing, Secure, Excelling
    return x >= cuts[2] ? 3 : x >= cuts[1] ? 2 : x >= cuts[0] ? 1 : 0;
  }

  /* ---------- scoring ---------- */

  // report (optional): the saved review record, for staff-recorded facts
  // such as presentationUndone.
  function build(weekCfg, state, rating, report) {
    state = state || {};
    var reflect = state.reflect || {};
    var allIds = Object.keys(weekCfg.topics || {});
    // Only answered questions are scored; anything left unanswered is listed
    // as Undone, never counted as "not understood".
    var unfinished = !state.completed;
    function answered(id) {
      var r = reflect[id];
      return !!(r && (r.attempts > 0 || r.success || (r.text && String(r.text).trim())));
    }
    var ids = allIds.filter(answered);
    var lost = !!(report && report.dataLost);
    var missing = allIds.length - ids.length;
    var undoneQs = lost ? 0 : missing;
    var missWord = lost ? 'not recorded' : 'left undone';
    var cats = {};
    // Only a question or two to go on: say so, so a band isn't over-read.
    var early = ids.length && ids.length < 3 ? ' An early read from a small sample.' : '';

    if (allIds.length) {
      var genuine = ids.filter(function (id) { return QD.isGenuinePass(reflect[id]); }).length;
      var topics = [];
      allIds.forEach(function (id) {
        var t = weekCfg.topics[id];
        var entry = topics.filter(function (x) { return x.name === t; })[0];
        if (!entry) { entry = { name: t, anchor: (weekCfg.anchors || {})[t] || '', ok: true, reached: false }; topics.push(entry); }
        if (ids.indexOf(id) === -1) return;
        entry.reached = true;
        if (!QD.isGenuinePass(reflect[id])) entry.ok = false;
      });
      var reached = topics.filter(function (t) { return t.reached; });
      cats.understanding = {
        title: 'Understanding',
        band: ids.length ? band(genuine / ids.length, [0.4, 0.65, 0.85]) : lost ? NOT_RECORDED : UNDONE,
        line: !ids.length ? (lost ? 'No answers were recorded.' : 'No questions were answered.')
          : 'Got the idea right on ' + genuine + ' of ' + ids.length + (ids.length === 1 ? ' question' : ' questions') + (lost ? ' recorded.' : ' answered.') +
            (missing ? ' ' + missing + (missing === 1 ? ' question' : ' questions') + ' ' + missWord + '.' : '') + early,
        missLabel: lost ? 'Not recorded' : 'Undone',
        undoneQs: undoneQs,
        nailed: reached.filter(function (t) { return t.ok; }),
        revisit: reached.filter(function (t) { return !t.ok; }),
        undone: topics.filter(function (t) { return !t.reached; })
      };
    }

    var bloomMap = null;
    if (weekCfg.bloom) {
      bloomMap = {};
      // Every tagged question the Riser answered — including ones outside
      // the reading (mission, build reflection, debrief).
      Object.keys(weekCfg.bloom).forEach(function (id) { if (answered(id)) bloomMap[id] = weekCfg.bloom[id]; });
      if (!Object.keys(bloomMap).length) {
        cats.depth = { title: 'Depth of thinking', band: lost ? NOT_RECORDED : UNDONE, ceiling: null, ceilingIdx: -1, line: lost ? 'No answers were recorded.' : 'No questions were answered.' };
      }
    }
    if (bloomMap && Object.keys(bloomMap).length) {
      var ceiling = QD.bloomCeiling(bloomMap, reflect).ceiling;
      var ci = ceiling ? QD.BLOOM_LEVELS.indexOf(ceiling) : -1;
      cats.depth = {
        title: 'Depth of thinking', band: ci < 0 ? 0 : ci <= 1 ? 1 : ci === 2 ? 2 : 3,
        ceiling: ceiling, ceilingIdx: ci,
        line: (ceiling ? BLOOM_PLAIN[ceiling] + '.' : 'Building toward the first step.') + early
      };
    }

    var buildTotal = weekCfg.buildTotal || 0;
    if (buildTotal) {
      var b = state.build || {};
      var done = Math.min(buildTotal, Object.keys(b).filter(function (k) { return b[k] && +k < buildTotal; }).length);
      // With lost progress, staff can set the steps actually finished.
      if (lost && typeof report.buildDone === 'number') done = Math.max(0, Math.min(buildTotal, report.buildDone));
      cats.build = {
        title: 'Build', band: done ? band(done / buildTotal, [0.3, 0.6, 1]) : UNDONE,
        line: !done ? 'The build was left undone.' : done === buildTotal ? 'Every build step finished.' : done + ' of ' + buildTotal + ' build steps finished.',
        photo: weekCfg.buildPhoto || ''
      };
    }

    var scores = rating && rating.scores;
    if (report && report.presentationUndone) {
      cats.presentation = { title: 'Presentation', band: UNDONE, line: 'The presentation was left undone.' };
    } else if (scores && Object.keys(scores).length) {
      var crit = RUBRIC.filter(function (c) { return scores[c.key]; }).map(function (c) {
        return { name: c.name, band: Math.max(0, Math.min(3, scores[c.key] - 1)) };
      });
      var avg = crit.reduce(function (s, c) { return s + c.band; }, 0) / crit.length;
      cats.presentation = { title: 'Presentation', band: Math.round(avg), criteria: crit };
    } else {
      cats.presentation = { title: 'Presentation', band: -1, line: 'Not rated yet.' };
    }

    var retried = ids.filter(function (id) { return reflect[id] && reflect[id].attempts > 1; });
    var recovered = retried.filter(function (id) { return reflect[id].success; }).length;
    var hl = (state.hl || []).length;
    var notes = !!(state.notes && String(state.notes).trim());
    var persist = retried.length ? recovered / retried.length : 1;
    var engage = Math.min(1, (hl / 12) * 0.7 + (notes ? 0.3 : 0));
    var timeMs = QD.totalTimeMs(state);
    var habitLines = [];
    if (recovered) habitLines.push('Kept going after a first miss, and got there, on ' + recovered + (recovered === 1 ? ' question.' : ' questions.'));
    if (hl) habitLines.push('Highlighted key ideas while reading.');
    if (notes) habitLines.push('Took their own notes.');
    if (timeMs && !lost) habitLines.push('About ' + QD.fmtTime(timeMs) + ' on the quest.');
    var anyWork = lost || ids.length || timeMs || hl || notes || Object.keys(state.build || {}).some(function (k) { return state.build[k]; });
    cats.habits = {
      title: 'Work habits', band: lost ? NOT_RECORDED : anyWork ? band((persist + engage) / 2, [0.35, 0.6, 0.85]) : UNDONE,
      lines: lost ? (habitLines.length ? habitLines : ['Not fully recorded for this quest.'])
        : habitLines.length ? habitLines : [anyWork ? 'Worked through the quest step by step.' : 'No work was recorded on this quest.'],
      recovered: recovered, readClosely: hl > 0 || notes
    };

    return { weekCfg: weekCfg, cats: cats, unfinished: unfinished && !lost, lost: lost };
  }

  /* ---------- auto-drafted notes ---------- */

  function rated(model) {
    return ORDER.filter(function (k) { return model.cats[k] && model.cats[k].band >= 0; });
  }

  // buildNotes: the staff-chosen reasons a build isn't finished (keys).
  function draftNotes(model, buildNotes) {
    var keys = rated(model);
    var c = model.cats;
    if (!keys.length && !ORDER.some(function (k) { return c[k] && c[k].band === UNDONE; })) return { strength: '', growth: '', next: '' };
    var strength = '', growth = '', next = '';
    if (keys.length) {
    var top = keys.slice().sort(function (a, b) { return c[b].band - c[a].band || ORDER.indexOf(a) - ORDER.indexOf(b); })[0];
    var low = keys.slice().sort(function (a, b) { return c[a].band - c[b].band || ORDER.indexOf(a) - ORDER.indexOf(b); })[0];
    if (low === top && keys.length > 1) low = keys.filter(function (k) { return k !== top; })[0];

    strength = {
      understanding: 'The core ideas really landed' + (c.understanding && c.understanding.nailed.length ? ', especially “' + c.understanding.nailed[0].name.replace(/^\d+\.\s*/, '') + '”.' : '.'),
      depth: c.depth && c.depth.ceiling ? 'Your thinking reached a strong level: you ' + BLOOM_YOU[c.depth.ceiling] + '.' : 'You built a steady foundation, step by step.',
      build: 'You saw your build through and made the ideas real.',
      presentation: c.presentation.criteria ? 'Your presentation stood out for its ' + topCriterion(c.presentation.criteria, true).toLowerCase() + '.' : '',
      habits: c.habits.recovered ? 'You stuck with it: when something didn’t land the first time, you came back and got there.'
        : c.habits.readClosely ? 'You read with care, picking out the key ideas and making notes as you went.'
        : 'You worked through the quest steadily, step by step.'
    }[top];

    var revisit = c.understanding && c.understanding.revisit[0];
    var revisitName = revisit ? revisit.name.replace(/^\d+\.\s*/, '') : '';
    var nextBloom = c.depth ? QD.BLOOM_LEVELS[Math.min(QD.BLOOM_LEVELS.length - 1, c.depth.ceilingIdx + 1)] : '';
    var all = c[low].band === 3;
    growth = all
      ? 'Everything here is strong. The stretch now is depth: explaining why something works, not just what happens.'
      : {
          understanding: 'A few ideas haven’t fully landed yet' + (revisitName ? ', especially “' + revisitName + '”.' : '.'),
          depth: 'The next step up in your thinking is ' + BLOOM_ING[nextBloom] + '.',
          build: 'The build is the part to finish: it’s where the ideas become something real.',
          presentation: c.presentation.criteria ? 'In presentations, the area to grow is ' + topCriterion(c.presentation.criteria, false).toLowerCase() + '.' : '',
          habits: 'Slowing down will help: reread the tricky part before answering, and jot your own notes as you go.'
        }[low];
    next = all
      ? 'After your next quest, explain one idea out loud to someone at home, and say why it works.'
      : {
          understanding: revisitName ? 'Go back to “' + revisitName + '” in the quest and explain it out loud to someone at home.' : 'Pick the idea you found trickiest and explain it out loud to someone at home.',
          depth: 'When you learn something new, ask “where else would this work?” and try it on one new example.',
          build: 'Pick up the build where you left off and finish the remaining steps.',
          presentation: 'Before your next presentation, practise it once out loud for a family member.',
          habits: 'In your next quest, highlight two key ideas in each section and write one line about each in your own words.'
        }[low];
    }
    if (model.unfinished) {
      var later = c.understanding && c.understanding.undone[0];
      next = 'Pick the quest back up and finish it' + (later ? ', starting with “' + later.name.replace(/^\d+\.\s*/, '') + '”.' : '.');
    }
    // Undone work comes before anything about how well the rest went.
    var UNDONE_NOTES = {
      understanding: { growth: 'Questions were left undone. Every question is part of the learning, so each one needs an honest answer.', next: 'Go back to the questions you left and answer each one in your own words.' },
      build: { growth: 'The build was left undone, and the build is where the ideas become something real.', next: 'Gather your materials and work through the build steps, one at a time.' },
      presentation: { growth: 'The presentation was left undone. Sharing what you learned is part of finishing a quest.', next: 'For your next quest, plan your presentation early and practise it once out loud.' }
    };
    var undoneKey = ['understanding', 'build', 'presentation'].filter(function (k) { return c[k] && c[k].band === UNDONE; })[0];
    if (!undoneKey && c.understanding && c.understanding.undoneQs && !model.unfinished) undoneKey = 'understanding';
    if (undoneKey) { growth = UNDONE_NOTES[undoneKey].growth; next = UNDONE_NOTES[undoneKey].next; }
    var bn = c.build && buildNotes && buildNotes.length && buildNote(buildNotes[0]);
    if (bn) { growth = bn.growth; next = bn.next; }
    return { strength: strength, growth: growth, next: next };
  }

  function topCriterion(crit, best) {
    return crit.slice().sort(function (a, b) { return best ? b.band - a.band : a.band - b.band; })[0].name;
  }

  /* ---------- rendering ---------- */

  function meter(b) {
    var s = '<span class="rc-meter rc-b' + b + '" aria-hidden="true">';
    for (var i = 0; i < 4; i++) s += '<span' + (i <= b ? ' class="on"' : '') + '></span>';
    return s + '</span>';
  }
  function pill(b) {
    if (b === UNDONE) return '<span class="rc-pill rc-undone">Undone</span>';
    if (b === NOT_RECORDED) return '<span class="rc-pill rc-none">Not recorded</span>';
    return b < 0 ? '<span class="rc-pill rc-none">Not rated</span>' : '<span class="rc-pill rc-b' + b + '">' + BANDS[b] + '</span>';
  }

  function photosHtml(list) {
    if (!list.length) return '';
    return '<div class="rc-photos rc-photos-' + Math.min(list.length, 3) + '">' + list.map(function (src, i) {
      return '<img class="rc-photo" src="' + esc(src) + '" alt="Build picture ' + (i + 1) + '" loading="lazy">';
    }).join('') + '</div>';
  }

  // opts.questHref: link to the quest page (topic links append #anchor).
  // opts.photos: the build pictures (data URLs), shown on the Build card.
  // opts.video: the build video's URL, shown under them.
  function catHtml(key, cat, opts) {
    var body = '';
    if (key === 'understanding') {
      body = '<p class="rc-line">' + esc(cat.line) + '</p>';
      if (cat.nailed.length) body += '<p class="rc-sub">Nailed</p><ul class="rc-topics">' + cat.nailed.map(function (t) { return '<li class="ok">' + esc(t.name) + '</li>'; }).join('') + '</ul>';
      if (cat.revisit.length) body += '<p class="rc-sub">Worth revisiting</p><ul class="rc-topics">' + cat.revisit.map(function (t) {
        return '<li class="again">' + (opts.questHref && t.anchor ? '<a href="' + esc(opts.questHref + '#' + t.anchor) + '">' + esc(t.name) + '</a>' : esc(t.name)) + '</li>';
      }).join('') + '</ul>';
      if (cat.undone.length) body += '<p class="rc-sub">' + cat.missLabel + '</p><ul class="rc-topics">' + cat.undone.map(function (t) { return '<li class="later">' + esc(t.name) + '</li>'; }).join('') + '</ul>';
    } else if (key === 'depth' && cat.band < 0) {
      body = '<p class="rc-line">' + esc(cat.line) + '</p>';
    } else if (key === 'depth') {
      body = '<ol class="rc-ladder">' + QD.BLOOM_LEVELS.map(function (l, i) {
        return '<li class="' + (i <= cat.ceilingIdx ? 'on' : '') + '" title="' + esc(BLOOM_PLAIN[l]) + '">' + l + '</li>';
      }).join('') + '</ol><p class="rc-line">' + esc(cat.line) + '</p>';
    } else if (key === 'build') {
      var reasons = (opts.buildNotes || []).map(buildNote).filter(Boolean);
      body = '<p class="rc-line">' + esc(cat.line) + '</p>' +
        (reasons.length && cat.band < 3 ? '<ul class="rc-list rc-reasons">' + reasons.map(function (r) { return '<li>' + esc(r.line) + '</li>'; }).join('') + '</ul>' : '') +
        photosHtml((opts.photos && opts.photos.length) ? opts.photos : cat.photo ? [cat.photo] : []) +
        (opts.video ? '<video class="rc-video" src="' + esc(opts.video) + '" controls preload="metadata" playsinline></video>' : '');
    } else if (key === 'presentation') {
      body = cat.criteria
        ? '<ul class="rc-crit">' + cat.criteria.map(function (c) { return '<li><span>' + esc(c.name) + '</span>' + meter(c.band) + '<em>' + BANDS[c.band] + '</em></li>'; }).join('') + '</ul>'
        : '<p class="rc-line rc-muted">' + esc(cat.line) + '</p>';
    } else if (key === 'habits') {
      body = '<ul class="rc-list">' + cat.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>';
    }
    return '<article class="rc-cat rc-cat-' + key + '">' +
      '<header><h3>' + cat.title + '</h3>' + pill(cat.band) + '</header>' +
      (cat.band >= 0 ? meter(cat.band) : '') +
      '<p class="rc-about">' + ABOUT[key] + '</p>' + body +
      '</article>';
  }

  // notes: { strength, growth, next } (already reviewed text).
  function render(model, notes, opts) {
    var n = notes || {};
    opts = Object.assign({ buildNotes: n.buildNotes || [] }, opts || {});
    var html = '<section class="rc">';
    if (n.dataLost) {
      html += '<p class="rc-lost">Part of this quest’s saved progress was lost to a technical issue on our side. Where the record is incomplete, this report draws on facilitator observation.</p>';
    }
    if (n.strength || n.growth || n.next) {
      html += '<div class="rc-notes">' +
        (n.strength ? '<div class="rc-note rc-note-strength"><h3>Strength</h3><p>' + esc(n.strength) + '</p></div>' : '') +
        (n.growth ? '<div class="rc-note rc-note-growth"><h3>Growth</h3><p>' + esc(n.growth) + '</p></div>' : '') +
        (n.next ? '<div class="rc-note rc-note-next"><h3>Next step</h3><p>' + esc(n.next) + '</p></div>' : '') +
        '</div>';
    }
    html += '<div class="rc-grid">' + ORDER.filter(function (k) { return model.cats[k]; }).map(function (k) { return catHtml(k, model.cats[k], opts); }).join('') + '</div>';
    html += '<p class="rc-scale">Scale: ' + BANDS.map(function (b, i) { return '<span class="rc-pill rc-b' + i + '">' + b + '</span>'; }).join(' ') +
      '<span class="rc-scale-sep">·</span><span class="rc-pill rc-undone">Undone</span> means it wasn’t done, so it isn’t scored.</p>';
    return html + '</section>';
  }

  // The strongest and growing categories across several quest models.
  function rollup(models) {
    var sum = {}, cnt = {};
    models.forEach(function (m) {
      rated(m).forEach(function (k) { sum[k] = (sum[k] || 0) + m.cats[k].band; cnt[k] = (cnt[k] || 0) + 1; });
    });
    var keys = Object.keys(sum);
    if (!keys.length) return null;
    function avg(k) { return sum[k] / cnt[k]; }
    var best = keys.slice().sort(function (a, b) { return avg(b) - avg(a) || ORDER.indexOf(a) - ORDER.indexOf(b); })[0];
    var grow = keys.slice().sort(function (a, b) { return avg(a) - avg(b) || ORDER.indexOf(a) - ORDER.indexOf(b); })[0];
    var label = function (k) { return models[0].cats[k] ? models[0].cats[k].title : k; };
    return { strongest: label(best), growing: grow === best ? '' : label(grow) };
  }

  /* ---------- the report record ---------- */

  function reportUrl(group, kid, week) {
    return WORKER_URL + '/sync?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(week + '-report');
  }
  function fetchReport(group, kid, week) {
    return fetch(reportUrl(group, kid, week), { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http')); })
      .then(function (res) { return { ok: true, report: (res && res.found && res.data.state) || null }; })
      .catch(function () { return { ok: false, report: null }; });
  }
  function saveReport(group, kid, week, report) {
    return fetch(WORKER_URL + '/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Site-Key': SITE_KEY },
      body: JSON.stringify({ group: group, kid: kid, week: week + '-report', state: report })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (out) { return { ok: !!(out && out.ok) }; })
      .catch(function () { return { ok: false }; });
  }

  /* ---------- build pictures ----------
     Up to six per Riser per quest, one record each, at week keys
     "<week>-buildphoto", then "<week>-buildphoto-2" … "-6"
     ({ img: <JPEG data URL>, at, by }; img '' once removed). Kept out of
     the report record so reports stay light. Staff shrink each picture in
     the browser before saving (see staff/quests/report.js), since a saved
     record is capped at about 200 KB. No pictures: no picture area. */
  var PHOTO_SLOTS = ['', '-2', '-3', '-4', '-5', '-6'];
  function photoWeek(week, slot) { return week + '-buildphoto' + PHOTO_SLOTS[slot]; }
  // Resolves { ok, slots: [img or '', ...] } — one entry per slot.
  function fetchBuildPhotos(group, kid, week) {
    return Promise.all(PHOTO_SLOTS.map(function (_, i) {
      var url = WORKER_URL + '/sync?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) + '&week=' + encodeURIComponent(photoWeek(week, i));
      return fetch(url, { headers: { 'X-Site-Key': SITE_KEY } })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http')); })
        .then(function (res) { return (res && res.found && res.data.state && res.data.state.img) || ''; });
    })).then(function (slots) { return { ok: true, slots: slots }; }, function () { return { ok: false, slots: ['', '', ''] }; });
  }
  function saveBuildPhoto(group, kid, week, slot, img, by) {
    return fetch(WORKER_URL + '/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Site-Key': SITE_KEY },
      body: JSON.stringify({ group: group, kid: kid, week: photoWeek(week, slot), state: { img: img || '', at: new Date().toISOString(), by: by || '' } })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (out) { return { ok: !!(out && out.ok) }; })
      .catch(function () { return { ok: false }; });
  }

  /* ---------- the build video ----------
     One per Riser per quest, in the progress service's file store (slot
     "build-video-<week>", up to 25 MB; staff may remove it and upload
     another). fetchBuildVideo resolves { ok, supported, url } — supported
     is false until the service has the build-video update. */
  function videoUrl(group, kid, week, extra) {
    return WORKER_URL + '/file?group=' + encodeURIComponent(group) + '&kid=' + encodeURIComponent(kid) +
      '&slot=build-video-' + encodeURIComponent(week) + (extra || '');
  }
  function fetchBuildVideo(group, kid, week) {
    return fetch(videoUrl(group, kid, week, '&meta=1'), { headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) {
        if (r.status === 400) return { ok: true, supported: false, url: '' };
        if (!r.ok) throw new Error('http');
        return r.json().then(function (res) {
          return { ok: true, supported: true, url: res && res.found ? videoUrl(group, kid, week, '&key=' + SITE_KEY + '&inline=1&v=' + encodeURIComponent(res.file.uploadedAt)) : '' };
        });
      })
      .catch(function () { return { ok: false, supported: true, url: '' }; });
  }
  // onProgress(fraction) while it uploads. Resolves { ok, error }.
  function uploadBuildVideo(group, kid, week, file, onProgress) {
    return new Promise(function (resolve) {
      var ext = (file.name.match(/\.([a-z0-9]+)$/i) || [])[1] || 'mp4';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', videoUrl(group, kid, week, '&name=' + encodeURIComponent(kid + '_' + week + '_build.' + ext.toLowerCase())));
      xhr.setRequestHeader('X-Site-Key', SITE_KEY);
      xhr.upload.onprogress = function (e) { if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total); };
      xhr.onload = function () {
        var res = {}; try { res = JSON.parse(xhr.responseText); } catch (e) {}
        resolve(xhr.status === 200 && res.ok ? { ok: true } : { ok: false, error: res.error || ('http ' + xhr.status) });
      };
      xhr.onerror = function () { resolve({ ok: false, error: 'network' }); };
      xhr.send(file);
    });
  }
  function deleteBuildVideo(group, kid, week) {
    return fetch(videoUrl(group, kid, week), { method: 'DELETE', headers: { 'X-Site-Key': SITE_KEY } })
      .then(function (r) { return { ok: r.ok }; })
      .catch(function () { return { ok: false }; });
  }

  // Click a build picture to see it full size; click again (or Esc) to close.
  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.rc-photo');
    var open = document.querySelector('.rc-lightbox');
    if (open) { open.remove(); return; }
    if (!img) return;
    var box = document.createElement('div');
    box.className = 'rc-lightbox';
    box.innerHTML = '<img alt="">';
    box.querySelector('img').src = img.src;
    document.body.appendChild(box);
  });
  document.addEventListener('keydown', function (e) {
    var open = document.querySelector('.rc-lightbox');
    if (open && e.key === 'Escape') open.remove();
  });

  window.QUEST_REPORT = {
    BANDS: BANDS,
    UNDONE: UNDONE,
    BUILD_NOTES: BUILD_NOTES,
    build: build,
    draftNotes: draftNotes,
    render: render,
    rollup: rollup,
    fetchReport: fetchReport,
    saveReport: saveReport,
    PHOTO_SLOTS: PHOTO_SLOTS.length,
    fetchBuildPhotos: fetchBuildPhotos,
    saveBuildPhoto: saveBuildPhoto,
    fetchBuildVideo: fetchBuildVideo,
    uploadBuildVideo: uploadBuildVideo,
    deleteBuildVideo: deleteBuildVideo
  };
})();
