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

  /* ---------- Lolly-stick truss bridge: side elevation and end section ---------- */
  D.bridge = [(function () {
    var id = 'br', s = '';
    // Tables either side of the gap
    s += rect(10, 180, 100, 10, 'o fill-wood') + line(30, 190, 30, 300, 'o') + line(96, 190, 96, 300, 'o');
    s += rect(490, 180, 100, 10, 'o fill-wood') + line(504, 190, 504, 300, 'o') + line(570, 190, 570, 300, 'o');
    s += ground(300, 0, 600);
    // Warren truss: bottom chord on the tables, top chord between, diagonals making triangles
    var bot = [], top = [], i;
    for (i = 0; i <= 6; i++) bot.push(72 + i * 76);
    for (i = 0; i < 6; i++) top.push(110 + i * 76);
    s += rect(72, 174, 456, 6, 'o fill-board') + rect(110, 86, 380, 6, 'o fill-board');
    for (i = 0; i < 6; i++) s += line(bot[i], 174, top[i], 92, 'stick') + line(top[i], 92, bot[i + 1], 174, 'stick');
    // Load: a bucket hung from the middle of the bottom chord
    s += path('M300 180 L300 236', 'rope') + path('M276 236 L324 236 L318 286 L282 286 Z', 'o fill-syr') + rect(281, 252, 38, 33, 'water');
    s += dim(id, 72, 60, 528, 60, '600') + line(72, 64, 72, 172, 'ext') + line(528, 64, 528, 172, 'ext');
    s += dim(id, 110, 318, 490, 318, '500 clear span') + line(110, 192, 110, 324, 'ext') + line(490, 192, 490, 324, 'ext');
    s += dim(id, 560, 180, 560, 86, '≈ 120', true) + line(494, 86, 566, 86, 'ext');
    s += ball(1, 200, 36, 200, 89) + ball(2, 420, 214, 420, 177) + ball(3, 140, 150, 160, 128) + ball(5, 360, 214, 302, 190) + ball(6, 360, 270, 324, 262);
    return { title: 'Side elevation, under test', svg: svg(id, 600, 335, s), note: 'Two of these trusses stand side by side. Every space is a triangle, so the shape can’t squash. The bucket hangs from the middle and is filled a litre at a time.' };
  })(), (function () {
    var id = 'be', s = '';
    s += rect(40, 40, 10, 120, 'o fill-board') + rect(150, 40, 10, 120, 'o fill-board');
    s += rect(30, 160, 140, 8, 'o fill-board') + rect(30, 32, 140, 8, 'o fill-board');
    s += line(50, 46, 150, 154, 'stick') + line(150, 46, 50, 154, 'stick');
    s += dim(id, 45, 196, 155, 196, '≈ 90') + line(45, 170, 45, 200, 'ext') + line(155, 170, 155, 200, 'ext');
    s += ball(4, 210, 164, 170, 164) + ball(7, 210, 100, 130, 100) + ball(8, 210, 36, 170, 36);
    return { title: 'End section', svg: svg(id, 240, 215, s), note: 'The two trusses are joined by deck sticks across the bottom and braces across the top and in an X, so the bridge can’t twist sideways.' };
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
    s += rect(420, 200, 170, 110, 'o-thin fill-paper', 4) + label(505, 216, 'Detail: cork with inflating needle');
    s += path('M448 236 L492 236 L486 280 L454 280 Z', 'o fill-dark') + rect(468, 224, 4, 72, 'o fill-pipe') + rect(462, 290, 16, 14, 'o fill-pipe', 2);
    s += label(500, 254, 'ball needle from', 'start') + label(500, 266, 'the pump, pushed', 'start') + label(500, 278, 'through the cork', 'start');
    s += ball(1, 330, 230, 300, 172) + ball(2, 440, 130, 352, 84) + ball(3, 470, 70, 386, 50) + ball(4, 110, 160, 164, 200);
    s += ball(5, 110, 220, 146, 286) + ball(6, 280, 290, 260, 312) + ball(7, 80, 210, 44, 236) + ball(8, 240, 290, 214, 240);
    return { title: 'Side elevation on the launch pad', svg: svg(id, 600, 345, s), note: 'Rocket shown at 45°. The blue band is the water, about a third of the bottle. The cork holds until the pressure pushes it out, then the water rushes out backwards and the rocket goes forwards.' };
  })()];

  /* ---------- Weather station: elevation ---------- */
  D.weather = [(function () {
    var id = 'we', s = '';
    s += ground(350, 0, 600);
    // Existing fence or railing
    s += rect(30, 170, 230, 6, 'o-thin fill-pipe') + rect(30, 260, 230, 6, 'o-thin fill-pipe');
    [40, 140].forEach(function (x) { s += rect(x, 160, 8, 190, 'o-thin fill-pipe'); });
    s += label(94, 300, 'existing fence');
    // Pole cable-tied to a fence post
    s += rect(240, 52, 8, 298, 'o fill-wood');
    [180, 220, 268].forEach(function (y) { s += rect(236, y, 16, 4, 'o-thin fill-dark'); });
    // Cup anemometer
    s += line(204, 56, 284, 56, 'o') + line(244, 50, 244, 62, 'o');
    s += path('M196 48 Q190 56 196 64 L206 64 L206 48 Z', 'o fill-paper') + path('M292 48 Q298 56 292 64 L282 64 L282 48 Z', 'o fill-paper');
    s += '<ellipse cx="244" cy="56" rx="7" ry="4" class="o-thin fill-paper"/>';
    // Wind vane
    s += line(244, 96, 244, 112, 'o') + line(214, 104, 280, 104, 'o') + path('M280 98 L292 104 L280 110 Z', 'o fill-dark') + path('M206 94 L222 104 L206 114 Z', 'o fill-flag');
    s += label(300, 108, 'N, E, S, W card fixed below it', 'start');
    // Thermometer screen: white slatted box in the shade
    s += rect(150, 186, 64, 54, 'o fill-paper', 2);
    for (var y = 194; y < 236; y += 8) s += line(154, y, 210, y + 4, 'o-thin');
    s += line(214, 212, 240, 212, 'o-thin');
    // Rain gauge in the open
    s += rect(430, 306, 10, 44, 'o fill-wood') + rect(418, 302, 34, 6, 'o fill-wood');
    s += path('M420 250 L450 250 L450 300 L420 300 Z', 'o fill-bottle') + path('M414 238 L456 238 L444 252 L426 252 Z', 'o fill-bottle');
    s += rect(421, 284, 28, 15, 'water');
    for (var t = 258; t < 300; t += 8) s += line(450, t, 456, t, 'o-thin');
    // Weather board
    s += rect(500, 160, 90, 110, 'o fill-paper', 3) + line(545, 270, 545, 350, 'o');
    ['Rain', 'Temp', 'Wind', 'Water?'].forEach(function (w, i) { s += label(506, 184 + i * 22, w, 'start') + line(540, 186 + i * 22, 582, 186 + i * 22, 'o-thin'); });
    s += dim(id, 320, 350, 320, 56, '≈ 1800', true) + line(290, 56, 326, 56, 'ext');
    s += dim(id, 112, 350, 112, 213, '≈ 1200', true) + line(112, 213, 150, 213, 'ext');
    s += dim(id, 248, 372, 420, 372, 'at least 2 m into the open') + line(420, 310, 420, 378, 'ext');
    s += ball(1, 170, 30, 198, 54) + ball(2, 180, 90, 210, 104) + ball(3, 280, 160, 248, 160) + ball(4, 90, 140, 150, 200);
    s += ball(5, 90, 236, 170, 230) + ball(6, 390, 220, 420, 260) + ball(7, 560, 140, 545, 160) + ball(8, 284, 236, 252, 222);
    return { title: 'Elevation', svg: svg(id, 600, 385, s), note: 'The wind instruments sit on a pole cable-tied to a fence post, high and clear. The thermometer hangs in a white slatted box in the shade. The rain gauge stands in the open, well away from roofs and trees.' };
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
    // Existing grille or fence: nothing to build
    s += rect(132, 48, 256, 324, 'o-thin');
    for (var gx = 152; gx < 388; gx += 20) s += line(gx, 48, gx, 372, 'grille');
    [104, 190, 276].forEach(function (gy) { s += line(132, gy, 388, gy, 'grille'); });
    s += path('M232 6 L288 6 L284 46 L236 46 Z', 'o fill-board') + label(260, 30, '10 L') + rect(255, 46, 10, 6, 'o fill-dark');
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
    s += ball(1, 80, 70, 152, 80) + ball(2, 470, 150, 384, 130) + ball(3, 470, 210, 372, 197) + ball(4, 320, 20, 286, 26) + ball(5, 470, 80, 352, 80) + ball(6, 470, 340, 370, 356);
    return { title: 'Front elevation', svg: svg(id, 520, 405, s), note: 'Nine bottle planters tied to an existing grille or fence in three columns. The drip line from the tap waters the top bottle of each column; each bottle drains through small holes in its underside into the open top of the one below, and the tray catches the rest to pour back in.' };
  })()];

  window.T3_DRAW = D;
})();
