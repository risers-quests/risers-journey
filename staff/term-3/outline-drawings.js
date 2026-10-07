/* Term 3 Quests — the dimensioned drawings for each build outline, as SVG.
   Numbered balloons match the parts list in outlines.js. Dimensions are in
   millimetres; drawings are close to scale unless a break line or the
   caption says otherwise. */
(function () {
  var INK = '#1f3a5a', SOFT = '#7d93a8', AIR = '#2f8fd0';

  function defs(id) {
    return '<defs><marker id="' + id + '-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0 1 L10 5 L0 9 z" fill="' + INK + '"/></marker>' +
      '<marker id="' + id + '-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
      '<path d="M0 1 L10 5 L0 9 z" fill="' + AIR + '"/></marker></defs>';
  }
  function svg(id, w, h, body) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" style="--ink:' + INK + ';--soft:' + SOFT + '">' + defs(id) + body + '</svg>';
  }
  // Dimension line with arrows both ends and a centred label.
  function dim(id, x1, y1, x2, y2, label, vertical) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    var text = vertical
      ? '<text x="' + (mx - 7) + '" y="' + my + '" transform="rotate(-90 ' + (mx - 7) + ' ' + my + ')" text-anchor="middle" class="d-t">' + label + '</text>'
      : '<text x="' + mx + '" y="' + (my - 5) + '" text-anchor="middle" class="d-t">' + label + '</text>';
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="d-l" marker-start="url(#' + id + '-a)" marker-end="url(#' + id + '-a)"/>' + text;
  }
  // Numbered balloon pointing at (tx, ty).
  function ball(n, x, y, tx, ty) {
    return '<line x1="' + x + '" y1="' + y + '" x2="' + tx + '" y2="' + ty + '" class="c-l"/><circle cx="' + tx + '" cy="' + ty + '" r="2" fill="' + INK + '"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="10" class="c-c"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" class="c-t">' + n + '</text>';
  }
  function flow(id, d) { return '<path d="' + d + '" class="f-l" marker-end="url(#' + id + '-f)"/>'; }
  function ground(y, x1, x2) {
    var s = '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" class="o"/>';
    for (var x = x1 + 14; x < x2; x += 14) s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x - 8) + '" y2="' + (y + 8) + '" class="o-thin"/>';
    return s;
  }
  function label(x, y, t, anchor) { return '<text x="' + x + '" y="' + y + '" class="lbl" text-anchor="' + (anchor || 'middle') + '">' + t + '</text>'; }
  function line(x1, y1, x2, y2, cls) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || 'o') + '"/>'; }
  function rect(x, y, w, h, cls, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (rx ? ' rx="' + rx + '"' : '') + ' class="' + (cls || 'o') + '"/>'; }
  function circ(cx, cy, r, cls) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="' + (cls || 'o') + '"/>'; }
  function path(d, cls) { return '<path d="' + d + '" class="' + (cls || 'o') + '"/>'; }
  // Lashing mark: a small cross-hatched band where two poles are tied.
  function lash(x, y) { return path('M' + (x - 6) + ' ' + (y - 6) + ' L' + (x + 6) + ' ' + (y + 6) + ' M' + (x + 6) + ' ' + (y - 6) + ' L' + (x - 6) + ' ' + (y + 6), 'rope'); }

  var D = {};

  /* ---------- Chain-reaction machine: front elevation ---------- */
  D.chain = [(function () {
    var id = 'ch', s = '';
    s += ground(300, 10, 590);
    s += rect(20, 20, 280, 280, 'o-thin fill-board');
    // Ramps zig-zag down the backboard
    s += path('M40 62 L250 92', 'o ramp') + path('M270 122 L60 152', 'o ramp') + path('M40 182 L250 212', 'o ramp');
    s += line(250, 86, 250, 96, 'o-thin') + line(60, 146, 60, 156, 'o-thin');
    s += circ(52, 54, 7, 'o fill-ball') + line(62, 46, 62, 62, 'o');
    s += flow(id, 'M256 96 Q268 104 266 116') + flow(id, 'M56 156 Q44 166 46 176') + flow(id, 'M256 216 Q270 250 286 290');
    // Dominoes on the table
    for (var i = 0; i < 9; i++) s += rect(306 + i * 14, 274, 5, 26, 'o-thin fill-dark');
    // Car on a short ramp
    s += path('M440 286 L540 300', 'o-thin');
    s += rect(446, 270, 30, 14, 'o-thin', 3) + circ(452, 288, 4, 'o-thin') + circ(470, 290, 4, 'o-thin');
    // Pulley post, string and flag
    s += line(420, 300, 420, 70, 'o') + circ(420, 64, 9, 'o');
    s += path('M476 276 L428 66', 'rope') + path('M411 64 L404 64 L404 196', 'rope');
    s += rect(380, 196, 24, 16, 'o-thin fill-flag');
    s += line(404, 196, 404, 222, 'o-thin');
    s += path('M372 100 Q380 86 388 100 Z', 'o fill-ball') + line(380, 78, 380, 86, 'o-thin');
    s += flow(id, 'M392 214 L392 168');
    s += dim(id, 20, 330, 580, 330, '≈ 2400 (two tables)');
    s += dim(id, 20, 300, 20, 20, '1200', true).replace(/x="13"/g, 'x="13"');
    s += ball(1, 160, 270, 160, 250) + ball(2, 160, 36, 150, 77) + ball(3, 90, 36, 58, 50) + ball(4, 340, 250, 330, 276);
    s += ball(5, 520, 250, 470, 274) + ball(6, 460, 40, 426, 58) + ball(7, 470, 120, 452, 170) + ball(8, 350, 200, 380, 204) + ball(9, 350, 120, 374, 98) + ball(10, 100, 100, 62, 56);
    return { title: 'Front elevation — example of the first steps', svg: svg(id, 600, 345, s), note: 'A sample start: a marble runs down three ramps, drops to the table and knocks over the dominoes; the last domino pushes the car, whose string runs over the pulley and lifts the flag into the bell. Your machine is your own design and needs at least 10 steps.' };
  })()];

  /* ---------- Hydraulic arm: side elevation ---------- */
  D.hydraulic = [(function () {
    var id = 'hy', s = '';
    s += ground(310, 10, 550);
    s += rect(60, 272, 140, 38, 'o fill-board') + path('M80 272 Q130 258 180 272', 'o-thin');
    s += rect(122, 214, 16, 52, 'o fill-wood');
    // Boom and arm (two layers of card), bucket
    s += path('M130 222 L300 112 L308 124 L138 234 Z', 'o fill-wood');
    s += path('M304 118 L404 222 L392 230 L294 128 Z', 'o fill-wood');
    s += path('M398 226 L430 236 Q436 262 410 266 Q392 262 396 242 Z', 'o fill-board');
    s += circ(130, 226, 4) + circ(302, 118, 4) + circ(400, 226, 4);
    // Syringes (barrel + plunger)
    function syr(x1, y1, x2, y2) {
      var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx) * 180 / Math.PI;
      return '<g transform="translate(' + x1 + ' ' + y1 + ') rotate(' + a.toFixed(1) + ')">' + rect(0, -6, L * 0.6, 12, 'o-thin fill-syr', 2) + line(L * 0.6, 0, L, 0, 'o') + line(L, -5, L, 5, 'o') + '</g>';
    }
    s += syr(176, 266, 228, 168);
    s += syr(250, 144, 340, 140);
    s += syr(318, 160, 396, 214);
    // Tubes back to the control panel
    s += path('M178 270 Q220 300 448 288', 'tube') + path('M252 148 Q240 220 462 286', 'tube') + path('M320 166 Q330 250 476 284', 'tube');
    s += rect(440, 240, 100, 60, 'o-thin fill-board');
    for (var i = 0; i < 4; i++) s += rect(450 + i * 22, 214, 12, 46, 'o-thin fill-syr', 2) + line(456 + i * 22, 214, 456 + i * 22, 202, 'o');
    s += dim(id, 130, 330, 430, 330, '≈ 400 reach');
    s += line(130, 236, 130, 336, 'ext') + line(430, 262, 430, 336, 'ext');
    s += dim(id, 30, 310, 30, 112, '≈ 350', true);
    s += line(30, 112, 300, 112, 'ext');
    s += ball(1, 90, 250, 100, 280) + ball(2, 90, 200, 130, 266) + ball(3, 200, 120, 220, 168) + ball(4, 370, 140, 352, 172) + ball(5, 450, 196, 424, 250);
    s += ball(6, 240, 220, 212, 196) + ball(7, 300, 250, 300, 283) + ball(8, 520, 196, 500, 222) + ball(9, 270, 70, 300, 116);
    return { title: 'Side elevation', svg: svg(id, 560, 345, s), note: 'Each movement is a pair of syringes joined by a tube of coloured water: push the one on the control panel and its partner on the arm pushes out. The base also turns on a fourth pair (not shown).' };
  })()];

  /* ---------- Wind turbine: front and side ---------- */
  D.turbine = [(function () {
    var id = 'wt', s = '', cx = 140, cy = 90;
    s += ground(390, 10, 270);
    for (var i = 0; i < 3; i++) {
      var a = (-90 + i * 120) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca;
      var r0 = 12, r1 = 75, w0 = 9, w1 = 5;
      s += path('M' + (cx + ca * r0 + px * w0).toFixed(1) + ' ' + (cy + sa * r0 + py * w0).toFixed(1) +
        ' L' + (cx + ca * r1 + px * w1).toFixed(1) + ' ' + (cy + sa * r1 + py * w1).toFixed(1) +
        ' L' + (cx + ca * r1 - px * 2).toFixed(1) + ' ' + (cy + sa * r1 - py * 2).toFixed(1) +
        ' L' + (cx + ca * r0 - px * 3).toFixed(1) + ' ' + (cy + sa * r0 - py * 3).toFixed(1) + ' Z', 'o fill-board');
    }
    s += circ(cx, cy, 12, 'o fill-wood');
    s += rect(cx - 5, cy + 14, 10, 248, 'o-thin fill-pipe');
    s += path('M' + (cx - 34) + ' 340 L' + (cx + 34) + ' 340 L' + (cx + 26) + ' 390 L' + (cx - 26) + ' 390 Z', 'o fill-board');
    s += path('M' + (cx - 30) + ' 350 L' + (cx + 30) + ' 350', 'o-thin');
    s += dim(id, cx - 75, 186, cx + 75, 186, 'Ø ≈ 500');
    s += line(cx - 75, 96, cx - 75, 192, 'ext') + line(cx + 75, 96, cx + 75, 192, 'ext');
    s += dim(id, 236, 390, 236, cy, '≈ 1000', true);
    s += line(cx + 14, cy, 242, cy, 'ext');
    s += ball(1, 40, 40, 112, 60) + ball(2, 230, 40, 150, 84) + ball(4, 60, 230, cx - 5, 230) + ball(5, 60, 330, cx - 30, 360);
    return { title: 'Front view', svg: svg(id, 280, 400, s), note: 'Rotor about 500 mm across on a 1 m pipe tower standing in a bucket of sand.' };
  })(), (function () {
    var id = 'ws', s = '';
    s += ground(390, 10, 510);
    s += rect(96, 76, 40, 24, 'o fill-syr', 3) + line(136, 88, 160, 88, 'o') + rect(156, 80, 10, 16, 'o fill-wood');
    s += path('M161 30 L167 146', 'o') + path('M155 30 L161 146', 'o-thin');
    s += rect(111, 100, 10, 240, 'o-thin fill-pipe');
    s += path('M86 340 L146 340 L138 390 L94 390 Z', 'o fill-board');
    s += path('M116 100 Q60 160 70 300 L70 330', 'wire') + path('M120 100 Q66 166 78 300 L78 330', 'wire');
    s += rect(40, 330, 50, 34, 'o-thin fill-dark', 4) + label(65, 352, 'V', 'middle').replace('class="lbl"', 'class="lbl lbl-w"');
    s += circ(84, 316, 5, 'o fill-led');
    // Fan
    s += rect(430, 70, 14, 110, 'o fill-dark', 4) + line(437, 180, 437, 390, 'o') + line(410, 390, 464, 390, 'o');
    s += flow(id, 'M420 90 L196 90') + flow(id, 'M420 120 L196 120') + flow(id, 'M420 60 L196 60');
    s += dim(id, 167, 230, 430, 230, '1500 (keep it the same every test)');
    s += line(167, 150, 167, 236, 'ext') + line(430, 180, 430, 236, 'ext');
    // Pitch detail
    s += rect(250, 280, 230, 96, 'o-thin fill-paper', 4) + label(365, 296, 'Blade seen end-on: pitch angle');
    s += line(360, 310, 360, 370, 'cl') + '<g transform="translate(360 340) rotate(25)">' + rect(-4, -26, 8, 52, 'o fill-board', 2) + '</g>';
    s += path('M360 314 A26 26 0 0 1 371 316.5', 'd-l') + label(392, 322, '10°–45°', 'start');
    s += flow(id, 'M460 340 L384 340');
    s += ball(2, 200, 40, 162, 50) + ball(3, 116, 40, 116, 76) + ball(6, 30, 290, 84, 316) + ball(7, 30, 380, 44, 352) + ball(8, 480, 140, 444, 140);
    return { title: 'Side view, with the test fan', svg: svg(id, 520, 400, s), note: 'The motor runs backwards as a generator: the rotor turns its shaft and it makes a small voltage, read on the multimeter and used to light the LED.' };
  })()];

  /* ---------- Pipe instrument: front elevation ---------- */
  D.pipes = [(function () {
    var id = 'pp', s = '';
    var notes = [['C', 645], ['D', 573], ['E', 509], ['F', 480], ['G', 427], ['A', 379], ['B', 336], ['C', 317]];
    s += ground(420, 10, 650);
    s += rect(36, 40, 10, 380, 'o fill-pipe') + rect(574, 40, 10, 380, 'o fill-pipe') + rect(36, 34, 548, 10, 'o fill-pipe');
    s += rect(36, 92, 548, 8, 'o-thin fill-pipe');
    s += line(16, 420, 66, 420, 'o') + line(554, 420, 604, 420, 'o');
    notes.forEach(function (n, i) {
      var x = 70 + i * 62, h = n[1] * 0.45;
      s += rect(x, 70, 30, h, 'o fill-pvc', 3) + line(x - 2, 96, x + 32, 96, 'rope');
      s += '<text x="' + (x + 15) + '" y="' + (70 + h + 14) + '" text-anchor="middle" class="d-t">' + n[0] + (i === 7 ? '4' : '3') + '</text>';
      s += '<text x="' + (x + 15) + '" y="' + (70 + h + 26) + '" text-anchor="middle" class="lbl">' + n[1] + '</text>';
    });
    s += dim(id, 58, 70, 58, 70 + 645 * 0.45, '645', true);
    s += '<g transform="translate(622 170) rotate(-20)">' + rect(-6, 0, 12, 70, 'o-thin fill-wood', 3) + rect(-18, -40, 36, 44, 'o fill-dark', 8) + '</g>';
    s += ball(1, 120, 60, 110, 140) + ball(2, 22, 20, 41, 40) + ball(3, 330, 60, 300, 96) + ball(4, 640, 90, 622, 132) + ball(5, 610, 260, 530, 224);
    return { title: 'Front elevation', svg: svg(id, 660, 440, s), note: 'Eight 40 mm PVC pipes, one octave from C3 to C4, hung from the frame with the open tops level. Numbers under each pipe are the starting length in mm: cut each 20 mm longer, then trim to tune.' };
  })()];

  /* ---------- Water rocket: on the launch pad ---------- */
  D.rocket = [(function () {
    var id = 'wr', s = '';
    s += ground(320, 10, 590);
    s += rect(60, 310, 240, 10, 'o fill-wood');
    // Rocket along +x, rotated 45° up to the right
    var r = '';
    r += rect(-14, -11, 16, 22, 'o fill-dark', 3);
    r += path('M2 -9 L26 -9 L44 -30 L250 -30 Q262 -30 262 -18 L262 18 Q262 30 250 30 L44 30 L26 9 L2 9 Z', 'o fill-bottle');
    r += path('M44 -30 L44 30 L120 30 L120 -30 Z', 'water');
    r += path('M262 -26 Q330 -16 344 0 Q330 16 262 26', 'o fill-board');
    r += path('M322 -10 Q340 -4 344 0 Q340 4 322 10 Z', 'o fill-dark');
    r += path('M50 -30 L30 -66 L96 -66 L110 -30', 'o fill-flag') + path('M50 30 L30 66 L96 66 L110 30', 'o fill-flag');
    r += dim(id, -14, -80, 344, -80, '≈ 450') + line(-14, -84, -14, -14, 'ext') + line(344, -84, 344, -4, 'ext');
    s += '<g transform="translate(150 286) rotate(-45)">' + r + '</g>';
    // Pad supports
    s += line(200, 310, 196, 260, 'o') + line(250, 310, 238, 218, 'o');
    // Pump and hose to the side
    s += path('M146 296 Q120 330 50 302', 'tube');
    s += rect(30, 236, 14, 66, 'o fill-pipe', 2) + line(37, 236, 37, 220, 'o') + line(22, 220, 52, 220, 'o') + rect(14, 300, 46, 8, 'o fill-dark');
    s += circ(52, 262, 9, 'o-thin fill-paper');
    s += label(180, 340, 'The pad holds the rocket at 45°', 'start');
    // Valve detail
    s += rect(420, 200, 160, 110, 'o-thin fill-paper', 4) + label(500, 216, 'Detail: cork with tyre valve');
    s += path('M478 236 L522 236 L516 280 L484 280 Z', 'o fill-dark') + rect(495, 226, 10, 74, 'o fill-pipe') + rect(492, 296, 16, 8, 'o fill-pipe');
    s += label(540, 260, 'valve from an', 'start') + label(540, 272, 'old bike tube', 'start');
    s += ball(1, 330, 230, 300, 172) + ball(2, 440, 130, 352, 84) + ball(3, 470, 70, 386, 50) + ball(4, 110, 160, 164, 200);
    s += ball(5, 110, 220, 146, 286) + ball(6, 280, 290, 260, 312) + ball(7, 80, 210, 44, 236) + ball(8, 240, 290, 214, 240);
    return { title: 'Side elevation on the launch pad', svg: svg(id, 600, 345, s), note: 'Rocket shown at 45°. The blue band is the water, about a third of the bottle. The cork holds until the pressure pushes it out, then the water rushes out backwards and the rocket goes forwards.' };
  })()];

  /* ---------- Rainwater harvester: side elevation ---------- */
  D.rainwater = [(function () {
    var id = 'rs', s = '';
    s += ground(400, 10, 550);
    s += rect(156, 10, 10, 390, 'o-thin fill-wall') + '<text x="150" y="380" class="lbl" transform="rotate(-90 150 380)" text-anchor="middle">wall</text>';
    // Existing downpipe from the roof, with break
    s += path('M184 10 L184 50 M196 10 L196 50', 'o') + label(214, 24, 'existing downpipe from the roof', 'start');
    s += path('M178 50 L188 46 L192 54 L202 50', 'o-thin') + path('M178 60 L188 56 L192 64 L202 60', 'o-thin');
    s += path('M184 60 L184 86 M196 60 L196 86', 'o') + rect(180, 86, 20, 12, 'o-thin');
    s += line(166, 30, 184, 30, 'o-thin') + line(166, 72, 184, 72, 'o-thin');
    // Tee: straight down into the first flush, branch to the drum
    s += path('M184 98 L184 116 M196 98 L196 98 L360 112', 'o') + path('M196 110 L348 122', 'o') + path('M348 122 L348 132 M360 112 L360 132', 'o');
    s += path('M184 116 L180 124 L180 340 L200 340 L200 124 L196 116', 'o');
    s += rect(177, 340, 26, 8, 'o-thin', 2) + circ(190, 168, 8, 'o fill-ball') + rect(181, 180, 18, 160, 'water');
    s += path('M190 348 L190 360', 'w-l') + rect(166, 200, 38, 5, 'o-thin') + rect(166, 300, 38, 5, 'o-thin');
    // Drum and stand
    s += rect(302, 130, 116, 180, 'o', 6) + rect(304, 210, 112, 98, 'water') + line(300, 138, 420, 138, 'o-thin') + line(338, 130, 370, 130, 'mesh');
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) s += rect(296 + c * 32 + (r % 2 ? 16 : 0) - (r % 2 && c === 3 ? 16 : 0), 310 + r * 30, (r % 2 && c === 3) ? 16 : 32, 30, 'o-thin fill-block');
    s += rect(292, 310, 136, 90, 'o') ;
    s += path('M418 296 L432 296 L432 306', 'o') + rect(424, 288, 10, 6, 'o-thin') + path('M432 308 L432 330', 'w-l');
    s += path('M418 146 L520 146 L520 392 M418 154 L512 154 L512 392', 'o-thin') + label(516, 414, 'to the old drain or recharge pit');
    s += dim(id, 270, 400, 270, 310, '450', true) + dim(id, 270, 310, 270, 130, '≈ 900', true);
    s += dim(id, 232, 340, 232, 124, 'L (see calc.)', true) + dim(id, 452, 400, 452, 300, '≈ 500', true);
    s += dim(id, 120, 400, 120, 92, '≈ 1600 (cut here)', true);
    s += ball(1, 136, 40, 184, 40) + ball(2, 136, 92, 180, 92) + ball(3, 230, 82, 196, 104) + ball(4, 290, 90, 280, 110);
    s += ball(5, 136, 128, 181, 124) + ball(6, 136, 168, 182, 168) + ball(7, 136, 240, 181, 250) + ball(8, 136, 340, 178, 344);
    s += ball(9, 360, 90, 354, 128) + ball(10, 456, 96, 414, 176) + ball(11, 480, 268, 430, 294) + ball(12, 540, 120, 516, 170) + ball(13, 340, 420, 340, 390);
    return { title: 'Side elevation', svg: svg(id, 560, 430, s), note: 'No roof work: an adult cuts an existing downpipe at about 1600 mm and the system fits on below. The first rain fills the chamber and lifts the ball, which seals it; after that, clean water runs across to the drum.' };
  })()];

  /* ---------- Bamboo reading den: front and side ---------- */
  D.den = [(function () {
    var id = 'df', s = '';
    s += ground(270, 10, 310);
    s += path('M70 270 L170 38', 'pole') + path('M250 270 L150 38', 'pole');
    s += circ(160, 62, 7, 'o fill-wood') + lash(160, 66);
    s += path('M92 224 L228 224', 'pole') + lash(92, 224) + lash(228, 224);
    s += path('M66 266 L156 60 M254 266 L164 60', 'net');
    s += dim(id, 70, 292, 250, 292, '1600');
    s += dim(id, 286, 270, 286, 62, '≈ 1850', true) + line(170, 62, 292, 62, 'ext');
    s += ball(1, 40, 150, 106, 186) + ball(2, 210, 30, 166, 58) + ball(3, 160, 250, 160, 224) + ball(6, 110, 50, 156, 64) + ball(7, 50, 210, 92, 224) + ball(8, 250, 140, 214, 150);
    return { title: 'Front elevation (one A-frame)', svg: svg(id, 320, 310, s), note: 'Two legs crossed and tied at the top with a shear lashing; a low crossbar tied with square lashings holds the legs at 1600 mm apart.' };
  })(), (function () {
    var id = 'ds', s = '';
    s += ground(270, 10, 410);
    s += path('M40 62 L370 62', 'pole') + path('M80 62 L80 270 M330 62 L330 270', 'pole');
    s += path('M80 262 L330 262', 'pole') + path('M80 256 L330 70', 'pole');
    s += lash(80, 62) + lash(330, 62) + lash(80, 262) + lash(330, 262) + lash(80, 256) + lash(330, 70);
    s += path('M40 62 L14 270 M370 62 L396 270', 'rope') + path('M10 262 L18 274 M392 262 L400 274', 'o');
    s += dim(id, 80, 292, 330, 292, '2100');
    s += dim(id, 40, 30, 370, 30, '2600 ridge pole');
    s += ball(2, 250, 96, 250, 62) + ball(4, 200, 240, 200, 262) + ball(5, 230, 130, 218, 152) + ball(7, 110, 230, 80, 262) + ball(9, 40, 180, 26, 170);
    return { title: 'Side elevation', svg: svg(id, 420, 310, s), note: 'Two A-frames 2100 mm apart, joined by the ridge pole, the side poles along the ground and one diagonal brace that stops it leaning. Guy ropes to pegs at each end.' };
  })()];

  /* ---------- Solar dryer: side section ---------- */
  D.dryer = [(function () {
    var id = 'sd', s = '';
    s += ground(310, 10, 590);
    // Collector rising at 20° to the cabinet
    s += path('M40 268 L300 173 L300 200 L40 295 Z', 'o fill-wood');
    s += path('M44 272 L296 180', 'glaze') + path('M46 286 L298 194', 'absorb');
    s += line(46, 295, 46, 310, 'o') + line(150, 257, 150, 310, 'o');
    s += line(40, 268, 40, 295, 'mesh');
    // Cabinet on legs
    s += rect(300, 38, 140, 162, 'o fill-paper');
    s += line(300, 200, 300, 310, 'o') + line(440, 200, 440, 310, 'o');
    s += line(306, 150, 434, 150, 'tray') + line(306, 100, 434, 100, 'tray');
    s += rect(330, 30, 80, 8, 'o-thin') + path('M320 18 L420 18 L410 30 L330 30 Z', 'o fill-wood') + line(336, 38, 404, 38, 'mesh');
    s += circ(424, 124, 5, 'o fill-led') + line(424, 118, 424, 90, 'o-thin');
    // Air path
    s += flow(id, 'M10 286 L52 280') + flow(id, 'M70 266 L280 190') + flow(id, 'M310 190 Q340 170 360 160') + flow(id, 'M370 140 L370 110') + flow(id, 'M370 90 L370 50') + flow(id, 'M410 24 L450 6');
    s += label(14, 336, 'cool air in', 'start') + label(470, 14, 'warm, damp air out', 'start');
    s += dim(id, 30, 250, 290, 155, '1000');
    s += dim(id, 300, 220, 440, 220, '500');
    s += dim(id, 470, 200, 470, 38, '600', true) + dim(id, 470, 310, 470, 200, '450', true);
    s += path('M120 310 A80 80 0 0 0 116 280', 'd-l') + label(126, 300, '20°', 'start');
    s += ball(1, 90, 214, 110, 262) + ball(2, 240, 130, 230, 204) + ball(3, 180, 300, 190, 233) + ball(4, 24, 240, 40, 280) + ball(5, 290, 120, 300, 120);
    s += ball(7, 520, 150, 434, 150) + ball(9, 300, 18, 336, 38) + ball(10, 230, 290, 150, 290) + ball(12, 520, 110, 424, 124);
    return { title: 'Side section', svg: svg(id, 600, 345, s), note: 'Air comes in at the low end, is heated under the clear cover by the black absorber, rises into the cabinet, passes up through the trays and leaves through the vent. Face the collector south.' };
  })()];

  /* ---------- Vertical garden: front elevation ---------- */
  D.vgarden = [(function () {
    var id = 'vg', s = '';
    s += ground(372, 10, 510);
    s += rect(132, 52, 8, 320, 'o fill-pipe') + rect(380, 52, 8, 320, 'o fill-pipe') + rect(132, 48, 256, 8, 'o fill-pipe');
    s += line(100, 372, 172, 372, 'o') + line(348, 372, 420, 372, 'o');
    [130, 215, 300].forEach(function (y) { s += rect(140, y - 26, 240, 5, 'o-thin fill-pipe'); });
    s += path('M232 6 L288 6 L284 46 L236 46 Z', 'o fill-board') + label(260, 30, '10 L');
    [170, 260, 350].forEach(function (x) {
      s += path('M260 46 Q' + x + ' 60 ' + x + ' 104', 'tube');
      [130, 215, 300].forEach(function (y, row) {
        s += path('M' + (x - 34) + ' ' + y + ' Q' + (x - 34) + ' ' + (y - 14) + ' ' + (x - 20) + ' ' + (y - 14) + ' L' + (x + 26) + ' ' + (y - 14) + ' L' + (x + 34) + ' ' + (y - 8) + ' L' + (x + 34) + ' ' + (y + 8) + ' L' + (x + 26) + ' ' + (y + 14) + ' L' + (x - 20) + ' ' + (y + 14) + ' Q' + (x - 34) + ' ' + (y + 14) + ' ' + (x - 34) + ' ' + y + ' Z', 'o fill-bottle');
        s += path('M' + (x - 22) + ' ' + (y - 14) + ' Q' + (x - 10) + ' ' + (y - 34) + ' ' + (x) + ' ' + (y - 16) + ' Q' + (x + 8) + ' ' + (y - 30) + ' ' + (x + 16) + ' ' + (y - 14), 'leaf');
        s += line(x - 24, y - 21, x - 24, y - 14, 'o-thin') + line(x + 22, y - 21, x + 22, y - 14, 'o-thin');
        s += path('M' + (x + 12) + ' ' + (y + 15) + ' L' + (x + 12) + ' ' + (y + (row < 2 ? 66 : 30)), 'w-l');
      });
    });
    s += rect(150, 346, 220, 18, 'o fill-board');
    s += dim(id, 132, 392, 388, 392, '1200');
    s += dim(id, 450, 372, 450, 48, '1500', true) + line(388, 48, 456, 48, 'ext');
    s += dim(id, 100, 130, 100, 215, '400', true);
    s += ball(1, 80, 70, 134, 80) + ball(2, 470, 150, 384, 130) + ball(3, 470, 210, 372, 197) + ball(4, 320, 20, 286, 26) + ball(5, 470, 80, 352, 80) + ball(6, 470, 340, 370, 356);
    return { title: 'Front elevation', svg: svg(id, 520, 405, s), note: 'Nine bottle planters in three columns. The drip line waters the top bottle of each column; each bottle drains through small holes in its underside into the open top of the one below, and the tray catches the rest to pour back in.' };
  })()];

  window.T3_DRAW = D;
})();
