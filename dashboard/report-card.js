/* Quest report card — the one feedback format Risers and their families
   see for a finished quest, and the staff page that reviews it uses the
   very same renderer, so what staff approve is exactly what goes out.

   Four categories, all on one four-step scale (Beginning, Developing,
   Secure, Excelling) — words, not percentages:
     Thinking      one plain-language level ("Knows and explains the key
                   ideas" … "Reasons and weighs ideas"), suggested from how
                   many core ideas landed (isGenuinePass) and how far up
                   Bloom's Taxonomy the answers reached — then confirmed or
                   changed by staff, so it's a facilitator's judgment backed
                   by the data, not a keyword count. Plus topics nailed /
                   worth revisiting, linked back into the quest.
     Presentation  the Day 3 presentation rubric, per criterion
     Build         build steps finished, plus pictures / video
     Work habits   persistence, highlights + notes, time on task

   Plus three short notes — Strength, Growth, Next step — auto-drafted from
   the categories and edited by staff, and one quote: the Riser's own best
   answer (staff pick it), so families see the thinking, not just a label.
   Each category shows as one line; its details open on tap.

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
  // The Thinking card's four levels, in plain words (staff confirm one).
  // TOO_EARLY: too few answers to say.
  var THINK = [
    { label: 'Building the key facts', ing: 'getting the key facts secure', you: 'are building the key facts' },
    { label: 'Knows and explains the key ideas', ing: 'explaining the key ideas in your own words', you: 'know the key ideas and can explain them in your own words' },
    { label: 'Uses ideas in new situations', ing: 'using the ideas in new situations', you: 'used the ideas in new situations, not just repeated them' },
    { label: 'Reasons and weighs ideas', ing: 'reasoning with the ideas and weighing what holds up', you: 'reasoned with the ideas and weighed what holds up' }
  ];
  var TOO_EARLY = -4;
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
    thinking: 'How well the ideas landed and how far the thinking went — from knowing the facts to reasoning with them. Confirmed by facilitators from the written answers.',
    build: 'How much of the hands-on build was finished.',
    presentation: 'How the learning was shared on presentation day, rated by facilitators.',
    habits: 'How the work was approached: sticking with it, note-taking and time on task.'
  };
  // Strength / growth tie-break order.
  var ORDER = ['thinking', 'presentation', 'build', 'habits'];

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

    // Thinking: the suggested level climbs with Bloom's (depth) but never
    // more than one step above how many core ideas actually landed
    // (understanding), so a lucky high-level answer can't outrank misses
    // on the basics. Fewer than 3 answers: too early to tell. Staff confirm
    // or change it (report.thinking).
    if (cats.understanding) {
      var u = cats.understanding.band, suggested;
      if (u < 0) suggested = u;
      else if (ids.length < 3) suggested = TOO_EARLY;
      else suggested = Math.min(cats.depth && cats.depth.band >= 0 ? cats.depth.band : u, u + 1);
      var chosen = report && typeof report.thinking === 'number' ? report.thinking : suggested;
      if (u < 0) chosen = u; // nothing answered stays Undone / Not recorded
      cats.thinking = {
        title: 'Thinking', band: chosen === TOO_EARLY ? -1 : chosen, level: chosen, suggested: suggested,
        confirmed: !!(report && typeof report.thinking === 'number'),
        line: chosen >= 0 ? THINK[chosen].label : chosen === TOO_EARLY ? 'Too early to tell — only a few answers so far.' : cats.understanding.line,
        detail: cats.understanding.line,
        missLabel: cats.understanding.missLabel,
        nailed: cats.understanding.nailed, revisit: cats.understanding.revisit, undone: cats.understanding.undone,
        undoneQs: cats.understanding.undoneQs,
        ceilingIdx: cats.depth ? cats.depth.ceilingIdx : -1
      };
    }

    var buildTotal = weekCfg.buildTotal || 0;
    if (buildTotal) {
      var b = state.build || {};
      var done = Math.min(buildTotal, Object.keys(b).filter(function (k) { return b[k] && +k < buildTotal; }).length);
      // Go with what was actually built: staff can set the steps finished,
      // and a build picture or video counts as a finished build even when
      // the steps weren't ticked on the quest page.
      if (report && typeof report.buildDone === 'number') done = Math.max(0, Math.min(buildTotal, report.buildDone));
      else if (report && report.hasBuildMedia) done = buildTotal;
      cats.build = {
        title: 'Build', band: done ? band(done / buildTotal, [0.3, 0.6, 1]) : UNDONE,
        line: !done ? 'The build was left undone.' : done === buildTotal ? 'Every build step finished.' : done + ' of ' + buildTotal + ' build steps finished.',
        photo: weekCfg.buildPhoto || '',
        // What the Riser actually built, in a few words (staff can reword it).
        name: (report && report.buildName) || weekCfg.buildName || ''
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

  // Written work (Understanding / Depth of thinking, the better of the two)
  // vs. the live presentation rating. Two bands or more apart, the Growth
  // and Next step notes name both sides (strong in one, growing in the
  // other), so the report reads as one picture rather than two results
  // that contradict each other. dir: 1 = written ahead, -1 = presentation
  // ahead.
  function presentationGap(model) {
    var c = model.cats;
    var written = c.thinking ? c.thinking.band : -1;
    var present = c.presentation ? c.presentation.band : -1;
    if (written < 0 || present < 0) return { dir: 0 };
    var d = written - present;
    return { dir: d >= 2 ? 1 : d <= -2 ? -1 : 0, written: written, present: present };
  }
  var GAP_NOTES = {
    '1': {
      growth: 'Your written answers show you understand the ideas well. The next step is explaining them just as clearly out loud, backed by evidence from your work.',
      next: 'Before your next presentation, practise it once out loud for a family member, and use one real piece of evidence from your build or answers.'
    },
    '-1': {
      growth: 'You explain your ideas well out loud. Your written answers haven’t caught up yet; give each one the same care you give your presentation.',
      next: 'In your next quest, read your written answer back before you check it, and ask: would this make sense if I said it out loud?'
    }
  };

  // buildNotes: the staff-chosen reasons a build isn't finished (keys).
  // opts.noGap: draft as if there were no written/presentation gap.
  function draftNotes(model, buildNotes, opts) {
    var keys = rated(model);
    var c = model.cats;
    if (!keys.length && !ORDER.some(function (k) { return c[k] && c[k].band === UNDONE; })) return { strength: '', growth: '', next: '' };
    var strength = '', growth = '', next = '';
    if (keys.length) {
    var top = keys.slice().sort(function (a, b) { return c[b].band - c[a].band || ORDER.indexOf(a) - ORDER.indexOf(b); })[0];
    var low = keys.slice().sort(function (a, b) { return c[a].band - c[b].band || ORDER.indexOf(a) - ORDER.indexOf(b); })[0];
    if (low === top && keys.length > 1) low = keys.filter(function (k) { return k !== top; })[0];

    var nailedName = c.thinking && c.thinking.nailed.length ? c.thinking.nailed[0].name.replace(/^\d+\.\s*/, '') : '';
    // A strength has to be one: nothing rated below Secure is praised as
    // the best part — effort is named instead.
    if (c[top].band < 2) top = 'habits';
    strength = {
      thinking: c.thinking && c.thinking.band >= 1
        ? 'You ' + THINK[c.thinking.band].you + (nailedName ? ', especially on “' + nailedName + '”.' : '.')
        : 'You built a steady foundation, step by step.',
      build: 'You saw your build through and made the ideas real.',
      presentation: c.presentation.criteria ? 'Your presentation stood out for its ' + topCriterion(c.presentation.criteria, true).toLowerCase() + '.' : '',
      habits: c.habits.recovered ? 'You stuck with it: when something didn’t land the first time, you came back and got there.'
        : c.habits.readClosely ? 'You read with care, picking out the key ideas and making notes as you went.'
        : 'You worked through the quest steadily, step by step.'
    }[top];

    var revisit = c.thinking && c.thinking.revisit[0];
    var revisitName = revisit ? revisit.name.replace(/^\d+\.\s*/, '') : '';
    var nextThink = c.thinking ? THINK[Math.min(THINK.length - 1, c.thinking.band + 1)] : null;
    var all = c[low].band === 3;
    growth = all
      ? 'Everything here is strong. The stretch now is depth: explaining why something works, not just what happens.'
      : {
          thinking: revisitName ? 'A few ideas haven’t fully landed yet, especially “' + revisitName + '”.' : 'The next step up in your thinking is ' + (nextThink ? nextThink.ing : 'reasoning with the ideas') + '.',
          build: 'The build is the part to finish: it’s where the ideas become something real.',
          presentation: c.presentation.criteria ? 'In presentations, the area to grow is ' + topCriterion(c.presentation.criteria, false).toLowerCase() + '.' : '',
          habits: 'Slowing down will help: reread the tricky part before answering, and jot your own notes as you go.'
        }[low];
    next = all
      ? 'After your next quest, explain one idea out loud to someone at home, and say why it works.'
      : {
          thinking: revisitName ? 'Go back to “' + revisitName + '” in the quest and explain it out loud to someone at home.' : 'When you learn something new, ask “where else would this work?” and try it on one new example.',
          build: 'Pick up the build where you left off and finish the remaining steps.',
          presentation: 'Before your next presentation, practise it once out loud for a family member.',
          habits: 'In your next quest, highlight two key ideas in each section and write one line about each in your own words.'
        }[low];
    }
    if (model.unfinished) {
      var later = c.thinking && c.thinking.undone[0];
      next = 'Pick the quest back up and finish it' + (later ? ', starting with “' + later.name.replace(/^\d+\.\s*/, '') + '”.' : '.');
    }
    var gap = opts && opts.noGap ? 0 : presentationGap(model).dir;
    if (gap) { growth = GAP_NOTES[gap].growth; next = GAP_NOTES[gap].next; }
    // Undone work comes before anything about how well the rest went.
    var UNDONE_NOTES = {
      thinking: { growth: 'Questions were left undone. Every question is part of the learning, so each one needs an honest answer.', next: 'Go back to the questions you left and answer each one in your own words.' },
      build: { growth: 'The build was left undone, and the build is where the ideas become something real.', next: 'Gather your materials and work through the build steps, one at a time.' },
      presentation: { growth: 'The presentation was left undone. Sharing what you learned is part of finishing a quest.', next: 'For your next quest, plan your presentation early and practise it once out loud.' }
    };
    var undoneKey = ['thinking', 'build', 'presentation'].filter(function (k) { return c[k] && c[k].band === UNDONE; })[0];
    if (!undoneKey && c.thinking && c.thinking.undoneQs && !model.unfinished) undoneKey = 'thinking';
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

  function topicsHtml(cat, opts) {
    var out = '';
    if (cat.nailed.length) out += '<p class="rc-sub">Nailed</p><ul class="rc-topics">' + cat.nailed.map(function (t) { return '<li class="ok">' + esc(t.name) + '</li>'; }).join('') + '</ul>';
    if (cat.revisit.length) out += '<p class="rc-sub">Worth revisiting</p><ul class="rc-topics">' + cat.revisit.map(function (t) {
      return '<li class="again">' + (opts.questHref && t.anchor ? '<a href="' + esc(opts.questHref + '#' + t.anchor) + '">' + esc(t.name) + '</a>' : esc(t.name)) + '</li>';
    }).join('') + '</ul>';
    if (cat.undone.length) out += '<p class="rc-sub">' + cat.missLabel + '</p><ul class="rc-topics">' + cat.undone.map(function (t) { return '<li class="later">' + esc(t.name) + '</li>'; }).join('') + '</ul>';
    return out;
  }

  // Each category: one line (title, band, a one-line summary) that opens to
  // its details on tap. Build pictures and video stay visible.
  // opts.questHref: link to the quest page (topic links append #anchor).
  // opts.photos / opts.video: the build pictures (data URLs) and video URL.
  // opts.staff: also show the staff-only evidence (counts, Bloom's ladder).
  // opts.open: start with every card's details open (staff preview).
  function catHtml(key, cat, opts) {
    var summary = '', body = '', media = '';
    if (key === 'thinking') {
      summary = cat.line;
      body = '<ol class="rc-ladder rc-ladder-4">' + THINK.map(function (t, i) {
        return '<li class="' + (cat.band >= 0 && i <= cat.band ? 'on' : '') + '">' + esc(t.label) + '</li>';
      }).join('') + '</ol>' + topicsHtml(cat, opts);
      if (opts.staff) {
        body += '<p class="rc-staff-only">Staff only: ' + esc(cat.detail) +
          (cat.ceilingIdx >= 0 ? ' Bloom’s reached: ' + QD.BLOOM_LEVELS[cat.ceilingIdx] + '.' : '') +
          ' Suggested level: ' + (cat.suggested >= 0 ? THINK[cat.suggested].label : cat.suggested === TOO_EARLY ? 'too early to tell' : '—') +
          (cat.confirmed ? '' : ' (not yet confirmed)') + '</p>';
      }
    } else if (key === 'build') {
      var reasons = (opts.buildNotes || []).map(buildNote).filter(Boolean);
      summary = (cat.name ? cat.name + ' — ' : '') + cat.line.charAt(0).toLowerCase() + cat.line.slice(1);
      body = (reasons.length && cat.band < 3 ? '<ul class="rc-list rc-reasons">' + reasons.map(function (r) { return '<li>' + esc(r.line) + '</li>'; }).join('') + '</ul>' : '');
      media = photosHtml((opts.photos && opts.photos.length) ? opts.photos : cat.photo ? [cat.photo] : []) +
        (opts.video ? '<video class="rc-video" src="' + esc(opts.video) + '" controls preload="metadata" playsinline></video>' : '');
    } else if (key === 'presentation') {
      if (cat.criteria) {
        // Only a part rated Secure or better is called a strength; the
        // weakest parts are what to grow.
        var minBand = Math.min.apply(null, cat.criteria.map(function (c) { return c.band; }));
        var strong = cat.criteria.filter(function (c) { return c.band >= 2; });
        var weakest = cat.criteria.filter(function (c) { return c.band === minBand && c.band < 2; }).slice(0, 2);
        var names = function (list) { return list.map(function (c) { return c.name.toLowerCase(); }).join(' and '); };
        summary = !weakest.length ? 'Strong across every part'
          : strong.length ? 'Strongest: ' + topCriterion(strong, true).toLowerCase() + ' · To grow: ' + names(weakest)
          : 'To grow: ' + names(weakest);
        body = '<ul class="rc-crit">' + cat.criteria.map(function (c) { return '<li><span>' + esc(c.name) + '</span>' + meter(c.band) + '<em>' + BANDS[c.band] + '</em></li>'; }).join('') + '</ul>';
      } else {
        summary = cat.line;
      }
    } else if (key === 'habits') {
      summary = cat.lines[0];
      body = cat.lines.length > 1 ? '<ul class="rc-list">' + cat.lines.slice(1).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '';
    }
    body = '<p class="rc-about">' + ABOUT[key] + '</p>' + body;
    return '<article class="rc-cat rc-cat-' + key + '">' +
      '<details' + (opts.open ? ' open' : '') + '><summary>' +
        '<span class="rc-cat-head"><h3>' + cat.title + '</h3>' + (cat.level === TOO_EARLY ? '<span class="rc-pill rc-none">Too early</span>' : pill(cat.band)) + '</span>' +
        '<span class="rc-cat-line">' + esc(summary) + '</span>' +
        '<span class="rc-more" aria-hidden="true"></span>' +
      '</summary><div class="rc-cat-body">' + body + '</div></details>' +
      media +
      '</article>';
  }

  // notes: the saved report — { strength, growth, next, quote, … }.
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
    if (n.quote && n.quote.text) {
      html += '<figure class="rc-quote"><figcaption>In your own words' + (n.quote.topic ? ' · ' + esc(n.quote.topic.replace(/^\d+\.\s*/, '')) : '') + '</figcaption>' +
        '<blockquote>' + esc(n.quote.text) + '</blockquote></figure>';
    }
    html += '<div class="rc-grid">' + ORDER.filter(function (k) { return model.cats[k]; }).map(function (k) { return catHtml(k, model.cats[k], opts); }).join('') + '</div>';
    html += '<p class="rc-scale">' + BANDS.map(function (b, i) { return '<span class="rc-pill rc-b' + i + '">' + b + '</span>'; }).join(' ') +
      '<span class="rc-scale-sep">·</span><span class="rc-pill rc-undone">Undone</span> means it wasn’t done, so it isn’t scored. Tap a line for details.</p>';
    return html + '</section>';
  }

  /* ---------- the evidence quote ---------- */

  // Answers worth quoting: the Riser's own words on a question they got
  // right (isGenuinePass), best first — highest Bloom's level, then the
  // fuller answer. Calculation missions and one-word answers are left out.
  function quoteCandidates(weekCfg, state) {
    var reflect = (state && state.reflect) || {};
    var bloom = weekCfg.bloom || {};
    var topics = weekCfg.topics || {};
    var out = [];
    Object.keys(reflect).forEach(function (id) {
      var r = reflect[id];
      if (id === 'refl-mission' || !r || !r.text || !QD.isGenuinePass(r)) return;
      var text = String(r.text).replace(/\s+/g, ' ').trim();
      if (text.split(' ').length < 5) return;
      var topic = topics[id] || (id === 'refl-b1' ? 'Build reflection' : /^refl-d\d/.test(id) ? 'Debrief' : '');
      out.push({ id: id, text: text.length > 420 ? text.slice(0, 417).replace(/\s+\S*$/, '') + '…' : text, topic: topic, level: QD.BLOOM_LEVELS.indexOf(bloom[id]) });
    });
    return out.sort(function (a, b) { return b.level - a.level || b.text.length - a.text.length; });
  }

  // Across several quest models: the strongest and growing categories,
  // and the highest Thinking level reached.
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
    var label = function (k) { return { thinking: 'Thinking', presentation: 'Presentation', build: 'Build', habits: 'Work habits' }[k] || k; };
    // The highest Thinking level reached, and on which quest.
    var top = null;
    models.forEach(function (m) {
      var t = m.cats.thinking;
      if (t && t.band >= 0 && (!top || t.band > top.band)) top = { band: t.band, quest: m.weekCfg.label };
    });
    return {
      strongest: avg(best) >= 2 ? label(best) : '', growing: grow === best && avg(best) >= 2 ? '' : label(grow),
      thinking: top ? { label: THINK[top.band].label, quest: String(top.quest).split(' · ').slice(-1)[0] } : null
    };
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
    THINK: THINK,
    TOO_EARLY: TOO_EARLY,
    quoteCandidates: quoteCandidates,
    build: build,
    draftNotes: draftNotes,
    presentationGap: presentationGap,
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
