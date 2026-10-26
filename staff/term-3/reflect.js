/* Term 3 Quests — the weekly Team Reflection: Part B of the Wednesday
   check-in (board.js mounts it on the Check-in tab, under Part A).

   Each Riser fills in their own:
   1. Last week's feedback: what their teammates asked them to try (from
      last week's slips), how they tried it, and how it went.
   2. My self-evaluation: ten statements, each Not yet / Starting /
      Getting there / Every time.
   3. A feedback slip for each teammate: the same ten, a shout-out, and
      one thing to try next week. "Send my slips" hands them over; a
      teammate sees a slip only once it's sent.
   4. What my team said: the slips sent to them this week.
   5. My one thing to try next week: picked from what the team asked, or
      their own, and put on the Board in This week as a 🤝 job.
   Once sent, slips leave the sender's screen (a parent at home never sees
   what a child wrote about someone else). When the facilitator closes the
   check-in, anyone who hasn't sent is marked absent and the sheet locks.
   A Riser's sheet is seen only by them and staff. Staff see the whole
   team: self and teammates' ratings side by side, and every slip.

   One record per Riser per week, through the progress Worker: group
   "term-3", kid = the Riser's name in lower case, week "reflect-w<N>":
   { self: { <1-10>: 1-4 }, how, went, slips: { <Teammate>: { <1-10>,
   shout, next } }, sent, tryNext, tryAdded, u }. Only the Riser writes
   their own record. */
(function () {
  var SCALE = ['Not yet', 'Starting', 'Getting there', 'Every time'];
  var PARTS = [
    { title: 'Sharing the work and solving problems together', items: [1, 2, 3] },
    { title: 'Talking and listening', items: [4, 5, 6, 7] },
    { title: 'Caring for my team and staying steady', items: [8, 9, 10] }
  ];
  var SELF = {
    1: 'I did my fair share of the team’s work.',
    2: 'When we disagreed, I listened, shared my view, and helped us find a compromise.',
    3: 'I told my team how I was feeling and what I needed.',
    4: 'I joined in team conversations without being asked.',
    5: 'I listened to teammates without interrupting.',
    6: 'When I disagreed, I gave reasons and stayed respectful.',
    7: 'I was open to a teammate’s idea, even when it was different from mine.',
    8: 'I noticed when a teammate needed help, and I offered help.',
    9: 'When I was upset, I kept my face and body calm so my team felt safe and included.',
    10: 'When I felt upset or frustrated, I used a strategy to calm down.'
  };
  var PEER = {
    1: 'did their fair share of the team’s work',
    2: 'listened, shared their view, and helped us compromise when we disagreed',
    3: 'told us how they were feeling and what they needed',
    4: 'joined in team conversations without being asked',
    5: 'listened to teammates without interrupting',
    6: 'gave reasons and stayed respectful when they disagreed',
    7: 'was open to a teammate’s idea, even when it was different from theirs',
    8: 'noticed when a teammate needed help, and offered help',
    9: 'kept their face and body calm when upset so the team felt safe and included',
    10: 'used a strategy to calm down when upset or frustrated'
  };
  var SHORT = {
    1: 'Fair share of the work', 2: 'Disagreeing: listen and compromise', 3: 'Says how they feel and what they need',
    4: 'Joins in without being asked', 5: 'Listens without interrupting', 6: 'Disagrees with reasons, respectfully',
    7: 'Open to other ideas', 8: 'Notices and offers help', 9: 'Calm face and body when upset', 10: 'Uses a calm-down strategy'
  };
  var ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var cache = {}; // 'g1-3' -> { <Name>: record }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function weekKey(w) { return 'reflect-w' + w; }
  function fetchTeam(group, w) {
    return Promise.all(group.kids.map(function (k) {
      return window.eot2Fetch('term-3', k.toLowerCase(), weekKey(w)).then(function (d) { return (d && d.state) || {}; });
    })).then(function (rs) {
      var out = {};
      group.kids.forEach(function (k, i) { out[k] = rs[i]; });
      return out;
    });
  }
  // The slips sent to `name` that week: [{ from, slip }].
  function slipsFor(team, name) {
    return Object.keys(team || {}).filter(function (k) {
      return k !== name && team[k].sent && team[k].slips && team[k].slips[name];
    }).map(function (k) { return { from: k, slip: team[k].slips[name] }; });
  }
  function dots(v) {
    var n = Math.round(v);
    return '<span class="rf-dots" title="' + (n ? SCALE[n - 1] : 'Not filled in') + '">' + (n ? '●●●●'.slice(0, n) + '○○○○'.slice(n) : '–') + '</span>';
  }

  // Four buttons, one per level. readOnly shows the choice only.
  function scaleEl(value, readOnly, onPick) {
    var row = el('div', 'rf-scale' + (readOnly ? ' is-ro' : ''));
    SCALE.forEach(function (s, i) {
      var b = el('button', 'rf-lvl rf-lvl-' + (i + 1) + (value === i + 1 ? ' is-on' : ''), esc(s));
      b.type = 'button';
      b.disabled = readOnly;
      b.addEventListener('click', function () {
        var v = value === i + 1 ? 0 : i + 1;
        value = v;
        Array.prototype.forEach.call(row.children, function (x, j) { x.classList.toggle('is-on', v === j + 1); });
        onPick(v);
      });
      row.appendChild(b);
    });
    return row;
  }
  function statements(texts, values, readOnly, onPick, prefix) {
    var box = el('div', 'rf-parts');
    PARTS.forEach(function (p) {
      var part = el('div', 'rf-part', '<h4>' + esc(p.title) + '</h4>');
      p.items.forEach(function (n) {
        var row = el('div', 'rf-row' + (values[n] ? '' : ' is-open'), '<p><b>' + n + '.</b> ' + (prefix ? '<span class="rf-who">' + esc(prefix) + '</span> ' : '') + esc(texts[n]) + '</p>');
        row.appendChild(scaleEl(values[n] || 0, readOnly, function (v) {
          row.classList.toggle('is-open', !v);
          onPick(n, v);
        }));
        part.appendChild(row);
      });
      box.appendChild(part);
    });
    return box;
  }
  function textEl(label, value, readOnly, onInput, rows) {
    var f = el('label', 'rf-text', '<span>' + esc(label) + '</span>');
    if (readOnly) { f.appendChild(el('p', 'rf-said' + (value ? '' : ' is-blank'), value ? esc(value) : 'Not filled in')); return f; }
    var t = el('textarea');
    t.rows = rows || 2;
    t.value = value || '';
    t.addEventListener('input', function () { onInput(t.value); });
    f.appendChild(t);
    return f;
  }

  /* ---------- a Riser's own reflection ---------- */

  // opts: closed (the facilitator has closed this week's check-in) and
  // addTry(text), which puts "my one thing to try" on the Board.
  function kidView(box, group, me, w, team, last, opts) {
    var key = group.id + '-' + w;
    var mine = team[me] = team[me] || {};
    mine.self = mine.self || {};
    mine.slips = mine.slips || {};
    var mates = group.kids.filter(function (k) { return k !== me; });
    var closed = !!opts.closed, absent = closed && !mine.sent;
    var status = el('span', 'rf-status');
    var timer = null;
    function changed() {
      mine.u = Date.now();
      status.textContent = 'Saving…';
      status.className = 'rf-status';
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        window.eot2Save('term-3', me.toLowerCase(), weekKey(w), mine).then(function (r) {
          status.textContent = r.ok ? 'Saved' : 'Not saved — check the connection';
          status.className = 'rf-status ' + (r.ok ? 'is-ok' : 'is-bad');
        });
      }, 700);
    }
    function again() { box.innerHTML = ''; kidView(box, group, me, w, team, last, opts); }
    cache[key] = team;

    var head = el('div', 'rf-head', '<h3>Part B · Me <small>(15 minutes)</small></h3><p>On your own computer. Your sheet is just for you and your facilitator. Your slips go to each teammate when you press <b>Send</b>.</p>');
    head.appendChild(status);
    box.appendChild(head);
    if (absent) box.appendChild(el('p', 'rf-absent', 'This check-in is closed, and your slips weren’t sent, so you’re marked absent this week.'));

    // 1. Last week's feedback.
    var asked = slipsFor(last, me).filter(function (x) { return x.slip.next; });
    var chose = last[me] && last[me].tryNext;
    var s1 = el('section', 'rf-sec', '<h3><span class="rf-n">1</span> Last week’s feedback</h3>');
    if (!asked.length && !chose) {
      s1.appendChild(el('p', 'rf-empty', w === 1 ? 'Skip this in Week 1.' : 'Nothing from last week.'));
    } else {
      s1.appendChild(el('div', 'rf-asked',
        (asked.length ? '<span>What my teammates asked me to try</span><ul>' + asked.map(function (x) {
          return '<li>' + esc(x.slip.next) + ' <small>' + esc(x.from) + '</small></li>';
        }).join('') + '</ul>' : '') +
        (chose ? '<p class="rf-chose">🤝 I chose to try: <b>' + esc(chose) + '</b></p>' : '')));
      s1.appendChild(textEl('How did I try to do it this week?', mine.how, closed, function (v) { mine.how = v; changed(); }));
      var went = el('div', 'rf-text', '<span>How did it go?</span>');
      went.appendChild(scaleEl(mine.went || 0, closed, function (v) { mine.went = v; changed(); }));
      s1.appendChild(went);
    }
    box.appendChild(s1);

    // 2. Self-evaluation.
    var s2 = el('section', 'rf-sec', '<h3><span class="rf-n">2</span> My self-evaluation</h3><p class="rf-hint">Pick one for each.</p>');
    s2.appendChild(statements(SELF, mine.self, closed, function (n, v) { mine.self[n] = v; changed(); }));
    box.appendChild(s2);

    // 3. Slips. Once sent they leave this screen: they're for the teammate,
    // not for anyone looking over the sender's shoulder at home.
    var s3 = el('section', 'rf-sec', '<h3><span class="rf-n">3</span> Slips for my teammates</h3>');
    if (mine.sent) {
      s3.appendChild(el('p', 'rf-sent', '✓ Sent. Your slips are with ' + esc(mates.join(' and ')) + '.'));
    } else if (absent) {
      s3.appendChild(el('p', 'rf-empty', 'Not sent this week.'));
    } else {
      s3.appendChild(el('p', 'rf-hint', 'One for each teammate. Be honest and kind.'));
      mates.forEach(function (t) {
        var s = mine.slips[t] = mine.slips[t] || {};
        var slip = el('div', 'rf-slip', '<h4>To ' + esc(t) + '</h4><p class="rf-hint">This week, ' + esc(t) + ' …</p>');
        slip.appendChild(statements(PEER, s, false, function (n, v) { s[n] = v; changed(); }));
        slip.appendChild(textEl('⭐ Shout-out: one thing you did this week that helped our team', s.shout, false, function (v) { s.shout = v; changed(); }));
        slip.appendChild(textEl('🎯 Next week it would help our team if you could try…', s.next, false, function (v) { s.next = v; changed(); }));
        s3.appendChild(slip);
      });
      if (mates.length) {
        var bar = el('div', 'rf-send');
        var b = el('button', 'pq-btn', 'Send my slips');
        b.type = 'button';
        var msg = el('span', 'rf-msg');
        b.addEventListener('click', function () {
          var missing = [];
          mates.forEach(function (t) {
            var s = mine.slips[t], left = [];
            var gaps = ALL.filter(function (n) { return !s[n]; }).length;
            if (gaps) left.push(gaps === 1 ? '1 answer' : gaps + ' answers');
            if (!String(s.shout || '').trim()) left.push('a shout-out');
            if (!String(s.next || '').trim()) left.push('something to try');
            if (left.length) missing.push(t + ' (' + left.join(', ') + ')');
          });
          if (missing.length) { msg.textContent = 'Almost there! Still to fill in: ' + missing.join('; ') + '.'; return; }
          if (!confirm('Send your slips? Your teammates will read them, and you can’t change them after this.')) return;
          mine.sent = new Date().toISOString();
          changed();
          again();
        });
        bar.appendChild(b);
        bar.appendChild(msg);
        s3.appendChild(bar);
      }
    }
    box.appendChild(s3);

    // 4. What my team said.
    var got = slipsFor(team, me);
    var s4 = el('section', 'rf-sec', '<h3><span class="rf-n">4</span> What my team said</h3>');
    if (!got.length) s4.appendChild(el('p', 'rf-empty', 'Your teammates’ slips show here once they send them.'));
    got.forEach(function (x) {
      var c = el('div', 'rf-got', '<h4>From ' + esc(x.from) + '</h4>' +
        (x.slip.shout ? '<p class="rf-shout">⭐ ' + esc(x.slip.shout) + '</p>' : '') +
        (x.slip.next ? '<p class="rf-try">🎯 Next week, try: ' + esc(x.slip.next) + '</p>' : ''));
      var det = el('details', 'rf-more', '<summary>How ' + esc(x.from) + ' rated this week</summary>');
      det.appendChild(statements(PEER, x.slip, true, function () {}, 'You'));
      c.appendChild(det);
      s4.appendChild(c);
    });
    box.appendChild(s4);

    // 5. My one thing to try next week: picked from what the team asked,
    // or my own, and put on the Board in This week.
    var s5 = el('section', 'rf-sec', '<h3><span class="rf-n">5</span> My one thing to try next week</h3>');
    if (mine.tryNext) {
      s5.appendChild(el('p', 'rf-sent', '🤝 ' + esc(mine.tryNext) + (mine.tryAdded ? ' <small>✓ On the Board in This week</small>' : '')));
    } else if (closed) {
      s5.appendChild(el('p', 'rf-empty', 'Not chosen this week.'));
    } else {
      var asks = got.map(function (x) { return x.slip.next; }).filter(Boolean);
      var pick = el('div', 'rf-pick');
      var choice = '';
      var own = el('input', 'rf-own');
      own.placeholder = 'Or write your own';
      asks.forEach(function (a) {
        var o = el('button', 'rf-opt', esc(a));
        o.type = 'button';
        o.addEventListener('click', function () {
          choice = a; own.value = '';
          Array.prototype.forEach.call(pick.querySelectorAll('.rf-opt'), function (x) { x.classList.toggle('is-on', x === o); });
        });
        pick.appendChild(o);
      });
      own.addEventListener('input', function () {
        choice = own.value.trim();
        Array.prototype.forEach.call(pick.querySelectorAll('.rf-opt'), function (x) { x.classList.remove('is-on'); });
      });
      s5.appendChild(el('p', 'rf-hint', asks.length ? 'Pick one thing your team asked, or write your own.' : 'Write one thing you’ll try. Your teammates’ ideas show here once they send their slips.'));
      pick.appendChild(own);
      s5.appendChild(pick);
      var add = el('button', 'pq-btn', 'Add to This week');
      add.type = 'button';
      var amsg = el('span', 'rf-msg');
      add.addEventListener('click', function () {
        if (!choice) { amsg.textContent = 'Pick or write one thing first.'; return; }
        mine.tryNext = choice;
        mine.tryAdded = !!(opts.addTry && opts.addTry(choice));
        changed();
        again();
      });
      var abar = el('div', 'rf-send');
      abar.appendChild(add); abar.appendChild(amsg);
      s5.appendChild(abar);
    }
    box.appendChild(s5);
  }

  /* ---------- staff: the whole team ---------- */

  function staffView(box, group, w, team, last, opts) {
    box.appendChild(el('div', 'rf-head', '<h3>Part B · Team reflection, week ' + w + '</h3><p>Each Riser’s own rating beside the average of what their teammates gave them. ● Not yet · ●● Starting · ●●● Getting there · ●●●● Every time.</p>'));
    var kids = group.kids;
    box.appendChild(el('div', 'rf-staff-status', kids.map(function (k) {
      var r = team[k] || {};
      if (opts.closed && !r.sent) return '<span class="is-absent"><b>' + esc(k) + '</b> absent</span>';
      var selfDone = ALL.filter(function (n) { return r.self && r.self[n]; }).length;
      return '<span><b>' + esc(k) + '</b> ' + (selfDone === 10 ? 'sheet ✓' : selfDone ? 'sheet ' + selfDone + '/10' : 'sheet not started') + ' · ' + (r.sent ? 'slips sent ✓' : 'slips not sent') + '</span>';
    }).join('')));
    var avg = function (k, n) {
      var vs = slipsFor(team, k).map(function (x) { return +x.slip[n] || 0; }).filter(Boolean);
      return vs.length ? vs.reduce(function (a, b) { return a + b; }, 0) / vs.length : 0;
    };
    var table = '<div class="rf-tablewrap"><table class="rf-table"><thead><tr><th></th>' + kids.map(function (k) { return '<th>' + esc(k) + '<small>Self · Team</small></th>'; }).join('') + '</tr></thead><tbody>';
    PARTS.forEach(function (p) {
      table += '<tr class="rf-tpart"><td colspan="' + (kids.length + 1) + '">' + esc(p.title) + '</td></tr>';
      p.items.forEach(function (n) {
        table += '<tr><td>' + n + '. ' + esc(SHORT[n]) + '</td>' + kids.map(function (k) {
          var s = (team[k] && team[k].self && team[k].self[n]) || 0, t = avg(k, n);
          var gap = s && t && s - t >= 1.5;
          return '<td class="' + (gap ? 'rf-gap' : '') + '">' + dots(s) + ' · ' + dots(t) + '</td>';
        }).join('') + '</tr>';
      });
    });
    table += '</tbody></table></div><p class="rf-hint">Pink: the Riser rated themself well above what their team saw. Worth a quiet chat.</p>';
    box.insertAdjacentHTML('beforeend', table);

    kids.forEach(function (k) {
      var r = team[k] || {};
      var asked = slipsFor(last, k).filter(function (x) { return x.slip.next; });
      var chose = last[k] && last[k].tryNext;
      var got = slipsFor(team, k);
      var c = el('div', 'rf-got rf-kid', '<h4>' + esc(k) + '</h4>' +
        (asked.length || chose ? (asked.length ? '<p><b>Asked last week to try:</b> ' + asked.map(function (x) { return esc(x.slip.next) + ' <small>(' + esc(x.from) + ')</small>'; }).join('; ') + '</p>' : '') +
          (chose ? '<p><b>Chose to try:</b> ' + esc(chose) + '</p>' : '') +
          '<p><b>How they tried:</b> ' + (r.how ? esc(r.how) : '<i>not filled in</i>') + (r.went ? ' · <b>It went:</b> ' + SCALE[r.went - 1] : '') + '</p>' : '') +
        (got.length ? got.map(function (x) {
          return '<p class="rf-shout">⭐ ' + esc(x.slip.shout || '') + ' <small>' + esc(x.from) + '</small></p>' + (x.slip.next ? '<p class="rf-try">🎯 Try: ' + esc(x.slip.next) + ' <small>' + esc(x.from) + '</small></p>' : '');
        }).join('') : '<p class="rf-empty">No slips sent to ' + esc(k) + ' yet.</p>') +
        (r.tryNext ? '<p class="rf-chose">🤝 Next week ' + esc(k) + ' will try: <b>' + esc(r.tryNext) + '</b></p>' : ''));
      box.appendChild(c);
    });
  }

  // Mounts Part B for week w. me: the signed-in Riser's name, or '' for
  // staff. opts: { closed, addTry }.
  window.T3_reflect = function (box, group, me, w, opts) {
    opts = opts || {};
    box.classList.add('rf');
    var key = group.id + '-' + w;
    function paint(team, last) {
      box.innerHTML = '';
      if (me) kidView(box, group, me, w, team, last, opts); else staffView(box, group, w, team, last, opts);
    }
    // Drawn at once from memory when the board redraws, so nothing typed
    // is lost; then teammates' latest are fetched. A Riser's own record is
    // always the copy in memory.
    var had = cache[key] && cache[key + '-last'];
    if (had) paint(cache[key], cache[key + '-last']);
    else box.innerHTML = '<p class="rf-empty">Loading the team reflection…</p>';
    Promise.all([fetchTeam(group, w), w > 1 ? fetchTeam(group, w - 1) : Promise.resolve({})]).then(function (r) {
      var team = r[0];
      if (me && cache[key] && cache[key][me]) team[me] = cache[key][me];
      var same = had && JSON.stringify(team) === JSON.stringify(cache[key]) && JSON.stringify(r[1]) === JSON.stringify(cache[key + '-last']);
      cache[key] = team;
      cache[key + '-last'] = r[1];
      if (same || !box.isConnected) return;
      var a = document.activeElement;
      if (had && box.contains(a) && /TEXTAREA|INPUT/.test(a.tagName)) return;
      var y = window.scrollY;
      paint(team, r[1]);
      window.scrollTo(0, y);
    });
  };

  // For the check-in's team goal: the statement the team scored lowest on
  // in week w's slips (resolves to its number, or 0 with no slips).
  // For a Riser's dashboard: what their team said to them in week w.
  window.T3_reflectInfo = {
    SHORT: SHORT,
    lowest: function (group, w) {
      if (w < 1) return Promise.resolve(0);
      return fetchTeam(group, w).then(function (team) {
        var best = 0, low = 5;
        ALL.forEach(function (n) {
          var vs = [];
          group.kids.forEach(function (k) { slipsFor(team, k).forEach(function (x) { if (+x.slip[n]) vs.push(+x.slip[n]); }); });
          if (!vs.length) return;
          var a = vs.reduce(function (x, y) { return x + y; }, 0) / vs.length;
          if (a < low) { low = a; best = n; }
        });
        return best;
      });
    },
    summary: function (group, me, w) {
      return fetchTeam(group, w).then(function (team) {
        return { got: slipsFor(team, me).map(function (x) { return { from: x.from, shout: x.slip.shout, next: x.slip.next }; }), tryNext: (team[me] || {}).tryNext || '' };
      });
    }
  };
})();
