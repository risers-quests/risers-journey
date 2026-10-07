/* Term 3 Quests — build outlines. One official outline per build: what it
   is for, the finished model's specification, a dimensioned drawing, the
   parts list, the order of work, and the test that proves it works.
   Rendered by outline.js. Drawings are SVG, dimensions in millimetres. */
(function () {
  var INK = '#1f3a5a', SOFT = '#7d93a8', AIR = '#2f8fd0', WATER = '#2f8fd0';

  // Drawing helpers --------------------------------------------------------
  function defs(id) {
    return '<defs><marker id="' + id + '-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0 1 L10 5 L0 9 z" fill="' + INK + '"/></marker>' +
      '<marker id="' + id + '-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
      '<path d="M0 1 L10 5 L0 9 z" fill="' + AIR + '"/></marker></defs>';
  }
  // Dimension line with arrows both ends and a centred label.
  function dim(id, x1, y1, x2, y2, label, vertical) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    var text = vertical
      ? '<text x="' + (mx - 7) + '" y="' + my + '" transform="rotate(-90 ' + (mx - 7) + ' ' + my + ')" text-anchor="middle" class="d-t">' + label + '</text>'
      : '<text x="' + mx + '" y="' + (my - 5) + '" text-anchor="middle" class="d-t">' + label + '</text>';
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="d-l" marker-start="url(#' + id + '-a)" marker-end="url(#' + id + '-a)"/>' + text;
  }
  // Numbered balloon pointing at (tx, ty); numbers match the parts list.
  function ball(n, x, y, tx, ty) {
    return '<line x1="' + x + '" y1="' + y + '" x2="' + tx + '" y2="' + ty + '" class="c-l"/><circle cx="' + tx + '" cy="' + ty + '" r="2" fill="' + INK + '"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="10" class="c-c"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" class="c-t">' + n + '</text>';
  }
  function svg(id, w, h, body) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" style="--ink:' + INK + ';--soft:' + SOFT + '">' + defs(id) + body + '</svg>';
  }
  function flow(d, id) { return '<path d="' + d + '" class="f-l" marker-end="url(#' + id + '-f)"/>'; }

  // Hovercraft drawings ----------------------------------------------------
  // Top view: 1 px = 4.3 mm. Deck Ø1200 → r 140.
  var hTop = (function () {
    var id = 'ht', cx = 170, cy = 170, s = '';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="140" class="o"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="143" class="o-thin"/>'; // edge guard
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="29" class="h"/>'; // centre disc (hidden, under)
    for (var i = 0; i < 6; i++) {
      var a = Math.PI / 6 + i * Math.PI / 3;
      s += '<circle cx="' + (cx + 47 * Math.cos(a)).toFixed(1) + '" cy="' + (cy + 47 * Math.sin(a)).toFixed(1) + '" r="6" class="h"/>';
    }
    s += '<circle cx="' + cx + '" cy="' + (cy - 70) + '" r="8" class="o"/>'; // blower hole
    s += '<rect x="' + (cx - 46) + '" y="' + (cy + 10) + '" width="92" height="80" rx="8" class="o-thin"/>'; // seat
    s += '<line x1="' + cx + '" y1="' + (cy - 150) + '" x2="' + cx + '" y2="' + (cy + 150) + '" class="cl"/>';
    s += '<line x1="' + (cx - 150) + '" y1="' + cy + '" x2="' + (cx + 150) + '" y2="' + cy + '" class="cl"/>';
    s += dim(id, cx - 140, 330, cx + 140, 330, 'Ø 1200');
    s += '<line x1="' + (cx - 140) + '" y1="' + (cy + 4) + '" x2="' + (cx - 140) + '" y2="336" class="ext"/><line x1="' + (cx + 140) + '" y1="' + (cy + 4) + '" x2="' + (cx + 140) + '" y2="336" class="ext"/>';
    s += dim(id, cx + 14, cy, cx + 14, cy - 70, '300', true);
    s += ball(1, 40, 40, cx - 99, cy - 99);
    s += ball(7, 300, 48, cx + 6, cy - 76);
    s += ball(3, 300, 120, cx + 24, cy - 16);
    s += ball(2, 316, 196, cx + 41, cy + 24);
    s += ball(8, 40, 300, cx - 40, cy + 70);
    s += ball(9, 300, 300, cx + 100, cy + 101);
    return svg(id, 340, 345, s);
  })();

  // Section view: 1 px = 2.7 mm horizontally.
  var hSide = (function () {
    var id = 'hs', s = '';
    s += '<line x1="10" y1="168" x2="510" y2="168" class="o"/>';
    for (var x = 14; x < 510; x += 14) s += '<line x1="' + x + '" y1="168" x2="' + (x - 8) + '" y2="176" class="o-thin"/>';
    s += '<rect x="40" y="96" width="440" height="6" class="o fill-wood"/>'; // deck
    // Skirt: wraps the deck edge, balloons down to the floor, pinned at the centre disc.
    s += '<path d="M58 95 L38 95 Q28 98 30 118 Q34 160 86 165 Q150 168 206 150 Q214 138 214 108 L306 108 Q306 138 314 150 Q370 168 434 165 Q486 160 490 118 Q492 98 482 95 L462 95" class="skirt"/>';
    s += '<rect x="214" y="102" width="92" height="7" class="o fill-wood"/>'; // centre disc
    s += '<rect x="256" y="88" width="8" height="24" class="o-thin"/>'; // bolt
    // Blower and seat
    s += '<rect x="132" y="30" width="34" height="66" rx="5" class="o-thin"/><text x="149" y="24" text-anchor="middle" class="lbl">blower</text>';
    s += '<path d="M220 96 L220 64 L300 64 L300 96 M226 64 L226 40 L296 40 L296 64" class="o-thin"/>';
    // Air path
    s += flow('M149 70 L149 128', id);
    s += flow('M149 132 Q120 150 92 152', id);
    s += flow('M168 140 Q196 140 208 130', id);
    s += flow('M226 126 L240 150', id);
    s += flow('M294 126 L280 150', id);
    s += flow('M250 158 Q140 172 30 172', id);
    s += dim(id, 40, 196, 480, 196, '1200');
    s += '<line x1="40" y1="102" x2="40" y2="202" class="ext"/><line x1="480" y1="102" x2="480" y2="202" class="ext"/>';
    s += dim(id, 500, 168, 500, 102, '≈ 70', true);
    s += ball(1, 70, 60, 90, 99);
    s += ball(2, 400, 60, 440, 140);
    s += ball(3, 340, 130, 300, 106);
    s += ball(4, 260, 20, 260, 90);
    s += ball(7, 110, 30, 132, 50);
    s += ball(8, 340, 40, 296, 52);
    return svg(id, 520, 210, s);
  })();

  // Rainwater drawings -----------------------------------------------------
  // Side elevation: 1 px = 5 mm, downpipe shortened with a break.
  var rSide = (function () {
    var id = 'rs', s = '';
    s += '<line x1="10" y1="400" x2="550" y2="400" class="o"/>';
    for (var x = 14; x < 550; x += 14) s += '<line x1="' + x + '" y1="400" x2="' + (x - 8) + '" y2="408" class="o-thin"/>';
    // Roof edge and wall
    s += '<path d="M20 14 L188 46" class="o"/><path d="M20 22 L176 52" class="o-thin"/>';
    s += '<rect x="156" y="52" width="10" height="348" class="o-thin fill-wall"/><text x="150" y="380" class="lbl" transform="rotate(-90 150 380)" text-anchor="middle">wall</text>';
    // Gutter in section at the eave
    s += '<path d="M168 42 L168 60 Q168 68 178 68 L200 68 Q210 68 210 60 L210 42" class="o"/>';
    s += '<path d="M171 58 Q189 64 207 58" class="w-l"/>';
    s += '<line x1="168" y1="50" x2="210" y2="50" class="mesh"/>';
    // Downpipe with break
    s += '<path d="M184 68 L184 76 M196 68 L196 76" class="o"/>';
    s += '<path d="M178 76 L188 72 L192 80 L202 76" class="o-thin"/><path d="M178 86 L188 82 L192 90 L202 86" class="o-thin"/>';
    s += '<path d="M184 86 L184 100 M196 86 L196 100" class="o"/>';
    // Tee: straight down into the first-flush chamber, branch across to the drum
    s += '<path d="M184 100 L184 116 M196 100 L196 98 L360 112" class="o"/>';
    s += '<path d="M196 110 L348 122" class="o"/>';
    s += '<path d="M348 122 L348 132 M360 112 L360 132" class="o"/>';
    // Reducer, chamber, ball, cap
    s += '<path d="M184 116 L180 124 L180 340 L200 340 L200 124 L196 116" class="o"/>';
    s += '<rect x="177" y="340" width="26" height="8" rx="2" class="o-thin"/>';
    s += '<circle cx="190" cy="168" r="8" class="o fill-ball"/>';
    s += '<rect x="181" y="180" width="18" height="160" class="water"/>';
    s += '<path d="M190 348 L190 360" class="w-l" stroke-dasharray="2 3"/>';
    s += '<rect x="166" y="200" width="38" height="5" class="o-thin"/><rect x="166" y="300" width="38" height="5" class="o-thin"/>';
    // Drum on its stand
    s += '<rect x="302" y="130" width="116" height="180" rx="6" class="o"/>';
    s += '<rect x="304" y="210" width="112" height="98" class="water"/>';
    s += '<line x1="300" y1="138" x2="420" y2="138" class="o-thin"/>';
    s += '<line x1="338" y1="130" x2="370" y2="130" class="mesh"/>';
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) s += '<rect x="' + (296 + c * 32 + (r % 2 ? 16 : 0) - (r % 2 && c === 3 ? 16 : 0)) + '" y="' + (310 + r * 30) + '" width="' + (r % 2 && (c === 3) ? 16 : 32) + '" height="30" class="o-thin fill-block"/>';
    s += '<rect x="292" y="310" width="136" height="90" class="o" fill="none"/>';
    // Tap and watering can
    s += '<path d="M418 296 L432 296 L432 306" class="o"/><rect x="424" y="288" width="10" height="6" class="o-thin"/>';
    s += '<path d="M432 308 L432 330" class="w-l" stroke-dasharray="3 3"/>';
    // Overflow to the garden
    s += '<path d="M418 146 L520 146 L520 392 M418 154 L512 154 L512 392" class="o-thin"/>';
    s += '<text x="516" y="414" text-anchor="middle" class="lbl">to garden bed</text>';
    // Dimensions
    s += dim(id, 270, 400, 270, 310, '450', true);
    s += dim(id, 270, 310, 270, 130, '≈ 900', true);
    s += dim(id, 232, 340, 232, 124, 'L (see calc.)', true);
    s += dim(id, 452, 400, 452, 300, '≈ 500', true);
    s += ball(1, 230, 22, 200, 50);
    s += ball(2, 136, 60, 168, 56);
    s += ball(3, 136, 92, 184, 94);
    s += ball(6, 136, 168, 182, 168);
    s += ball(5, 136, 128, 181, 124);
    s += ball(7, 136, 240, 181, 250);
    s += ball(8, 136, 340, 178, 344);
    s += ball(4, 260, 98, 280, 110);
    s += ball(9, 360, 90, 354, 128);
    s += ball(10, 456, 96, 414, 176);
    s += ball(11, 480, 268, 430, 294);
    s += ball(12, 540, 120, 516, 170);
    s += ball(13, 340, 420, 340, 390);
    return svg(id, 560, 430, s);
  })();

  window.T3_OUTLINES = {
    hovercraft: {
      docNo: 'T3-SCI-01', rev: 'A', cat: 'sci', title: 'Ride-on hovercraft',
      tagline: 'A plywood craft that floats a Riser on a cushion of air.',
      purposeLabel: 'The big idea',
      purpose: 'Friction is what makes things hard to slide. If you push air under a sealed skirt fast enough, the air pressure lifts the whole craft a few millimetres off the floor, and almost all the friction disappears. The lift you get is the air pressure multiplied by the area it pushes on, which is why a wide, flat craft can carry a person on air from an ordinary leaf blower.',
      outcome: 'A round hovercraft 1.2 m across, powered by an electric leaf blower, that carries a seated Riser and glides across a smooth floor with one gentle push. The group can show, with measurements, how much less force it takes to move it with the air on than with the air off.',
      spec: [
        ['Overall size', 'Ø 1200 mm deck, 12 mm plywood'],
        ['Height when inflated', 'About 60–80 mm from floor to underside of deck'],
        ['Load', 'One seated Riser up to 40 kg, plus seat'],
        ['Air supply', 'Corded electric leaf blower through a Ø 65 mm hole (size the hole to your blower’s nozzle)'],
        ['Air pressure needed', 'About 450 Pa: total weight (N) ÷ deck area (1.13 m²). Work this out for your own craft.'],
        ['Success test', 'Hovers for 30 s with a rider, skirt not dragging; pulling force with air on is less than one tenth of the force with air off'],
        ['Where it runs', 'Smooth indoor floor or court, clear space of 5 m all round']
      ],
      drawings: [
        { title: 'Top view', svg: hTop, note: 'Dashed lines are hidden underneath the deck: the centre disc and the six air holes in the skirt.' },
        { title: 'Section through the centre', svg: hSide, note: 'Blue arrows show the air: down through the deck, into the skirt, out through the holes, and escaping under the edge as a thin cushion.' }
      ],
      parts: [
        [1, 'Deck', 1, '12 mm plywood, 1220 × 1220 mm sheet, cut to Ø 1200', 'Sand all edges smooth'],
        [2, 'Skirt', 1, 'Heavy polythene or tarpaulin, 1500 × 1500 mm, 200 micron or thicker', 'No holes or tears'],
        [3, 'Centre disc', 1, 'Plywood offcut or plastic tub lid, Ø 250 mm', 'Holds the skirt up at the centre'],
        [4, 'Centre bolt', 1, 'M8 × 50 mm bolt, nut and two large washers', 'Through disc, skirt and deck'],
        [5, 'Duct tape', 2, 'Rolls, 48 mm wide', 'Seals staples and edges'],
        [6, 'Staples', 1, 'Box of 10 mm staples for a heavy-duty staple gun', 'Every 50 mm round the edge'],
        [7, 'Leaf blower', 1, 'Corded electric, with extension lead through an RCD', 'Borrow if possible'],
        [8, 'Seat', 1, 'Low plastic stool or a firm cushion, strapped or bolted down', 'Rider sits, never stands'],
        [9, 'Edge guard', 1, 'Foam pipe insulation or split garden hose, about 4 m', 'Covers the plywood edge']
      ],
      tools: ['Jigsaw (facilitator only)', 'Drill and Ø 65 mm hole saw', 'String, pencil and a nail (to draw the circle)', 'Heavy-duty staple gun', 'Scissors and utility knife', 'Spanner', 'Measuring tape', 'Sandpaper', 'Luggage scale (for the test)'],
      safety: [
        'A facilitator does all jigsaw cutting and handles the blower’s plug and lead.',
        'Run it only on a smooth, clean floor with 5 m of clear space all round.',
        'The rider sits and holds the edge. No standing, no spinning at speed.',
        'The blower operator keeps the lead clear of the skirt and of people’s feet.',
        'Wear ear protection if the blower is loud.'
      ],
      stages: [
        { name: 'Mark and cut the deck', steps: ['Draw a 600 mm radius circle with string and a pencil pinned at the centre.', 'Facilitator cuts it out; Riser sands every edge smooth.', 'Mark the centre and the blower hole 300 mm from it.'], done: 'Deck is round, smooth and marked.' },
        { name: 'Fit the blower', steps: ['Drill the blower hole.', 'Check the nozzle fits snugly; wrap with tape if it’s loose.'], done: 'Blower fits with no air leaking round it.' },
        { name: 'Fit the skirt', steps: ['Lay the plastic flat and put the deck on top.', 'Pull the plastic up over the edge, keep it slack, and staple every 50 mm.', 'Tape over every staple to seal it.'], done: 'Skirt is sealed all the way round and loose enough to balloon.' },
        { name: 'Fix the centre disc', steps: ['Put the disc under the plastic at the centre.', 'Bolt it through the plastic and the deck.'], done: 'Disc is tight and the plastic is pinned at the centre.' },
        { name: 'Cut the air holes', steps: ['Start with four Ø 50 mm holes in the plastic, 200 mm from the centre.', 'Turn on the blower with no one aboard and watch the skirt.'], done: 'Skirt inflates into a ring and the empty craft lifts.' },
        { name: 'Load it up', steps: ['Test with sandbags first, then a rider.', 'Fit the seat where the craft sits level.', 'Fit the edge guard.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove the air cushion removes friction, and make it better each version.',
        method: [
          'Tie a rope to the edge and hook a luggage scale onto it.',
          'Air off: with the rider aboard, pull slowly until it just starts to slide. Record the reading.',
          'Air on: same rider, same floor. Pull again and record the reading.',
          'Time how long it hovers without the skirt touching the floor (up to 30 s).',
          'Do each reading three times and take the middle one.'
        ],
        cols: ['Version', 'What we changed', 'Pull, air off (kg)', 'Pull, air on (kg)', 'Hover time (s)', 'What we noticed']
      },
      improve: ['Number and size of air holes in the skirt', 'How slack the skirt is', 'Size of the centre disc', 'Where the rider sits (balance)', 'Where the blower hole is'],
      roles: [
        ['Investigator', 'Explains friction and air pressure; works out the pressure needed (weight ÷ area) and predicts the pull with air on.'],
        ['Engineer', 'Leads marking, skirt fitting and every change between versions; keeps the craft safe to ride.'],
        ['Data keeper', 'Runs the pull test the same way every time, fills in the record, and draws the before-and-after chart.']
      ],
      label: { title: 'Ride on air', text: 'A leaf blower pushes air under a sealed plastic skirt. The air pressure spreads over the whole deck and lifts it, so the craft floats on a thin cushion of air and almost all the friction disappears.', tryit: 'Pull it with the air off, then with the air on. Feel the difference.' }
    },

    rainwater: {
      docNo: 'T3-SOL-01', rev: 'A', cat: 'sol', title: 'Rainwater harvester for the garden',
      tagline: 'Catch the monsoon off a LifeHub roof and water the garden with it.',
      purposeLabel: 'The problem',
      purpose: 'The LifeHub garden is watered from the tap, while the rain that falls on our roofs runs off and is lost. Chennai gets most of its year’s rain in the northeast monsoon, October to December. Every 1 mm of rain on 1 m² of roof is 1 litre of water. Catching it means free water for the garden all season.',
      outcome: 'A working rain-catching system on one LifeHub roof edge: a gutter with a leaf screen, a first-flush diverter that throws away the dirty first rain, and a 200 L drum on a raised stand with a tap and an overflow, so anyone can fill a watering can. The group shows how many litres it collected after real rain, and compares it with their prediction.',
      spec: [
        ['Catchment', 'One roof section, about 4 m² (measure yours: length × depth of the roof that drains to the gutter)'],
        ['Gutter', '2–3 m PVC gutter, sloping 10 mm per metre towards the downpipe'],
        ['Downpipe', '75 mm PVC'],
        ['First-flush chamber', '75 mm PVC, length L = roof area (m²) × 1 litre ÷ 3.8 litres per metre. For 4 m², L ≈ 1.05 m.'],
        ['Storage', '200 L drum on a 450 mm stand, tap about 500 mm above the ground'],
        ['Prediction', 'Litres = roof area (m²) × rain (mm) × 0.8. For 4 m² and 50 mm of rain, about 160 L.'],
        ['Success test', 'After real rain: clean water in the drum, dirty water held in the first flush, no leaks, and litres collected within 20% of the prediction']
      ],
      drawings: [
        { title: 'Side elevation', svg: rSide, note: 'The downpipe is shown shortened (break lines); cut it to suit your roof. The first rain fills the chamber and lifts the ball, which seals it; after that, water runs across to the drum.' }
      ],
      parts: [
        [1, 'Gutter', 1, 'PVC rain gutter 100–125 mm wide, 2–3 m (or 110 mm PVC pipe cut in half lengthwise), with end caps and outlet', 'With 4–5 brackets'],
        [2, 'Leaf screen', 1, 'Stainless or nylon mesh over the gutter, 1 mm', 'Keeps leaves out'],
        [3, 'Downpipe', 1, '75 mm PVC pipe, about 3 m, with 2 elbows and clamps', 'Length to suit'],
        [4, 'Branch to drum', 1, '75 mm PVC pipe about 1 m, sloping down to the drum', 'At least 10 mm fall'],
        [5, 'Tee and reducer', 1, '75 mm tee; 75 × 50 mm reducer at the top of the chamber', 'The ball seals against the reducer'],
        [6, 'Floating ball', 1, 'Hollow plastic ball about 65 mm', 'Must float and fit the pipe'],
        [7, 'First-flush chamber', 1, '75 mm PVC pipe, length L from the calculation', 'Clamped to the wall'],
        [8, 'Chamber cap', 1, '75 mm end cap with a 3 mm drip hole, removable', 'Drains slowly between rains'],
        [9, 'Drum inlet screen', 1, 'Mosquito mesh, about 300 × 300 mm', 'Every opening must be meshed'],
        [10, 'Storage drum', 1, '200 L HDPE drum with lid, clean, never used for chemicals', 'Mark it every 10 L'],
        [11, 'Tap', 1, '15 mm tap with tank connector, back nut and rubber washers', '50 mm above the drum bottom'],
        [12, 'Overflow', 1, '40 mm PVC pipe with tank connector, led to a garden bed', 'Near the top of the drum'],
        [13, 'Stand', 1, '12 concrete blocks (400 × 200 × 200 mm) and a paving slab', 'Level and solid'],
        ['', 'Fixings', '', 'PVC solvent cement, PTFE tape, silicone sealant, cable ties, wall plugs and screws', '']
      ],
      tools: ['Hacksaw and file', 'Drill with hole saws for the tap, inlet and overflow', 'Measuring tape and marker', 'Spirit level', 'String line (for the gutter slope)', 'Ladder (facilitator only)', 'Gloves', 'Buckets and a 10 L jug (to mark the drum)'],
      safety: [
        'Only a facilitator goes up the ladder or onto the roof; Risers hold the ladder and pass things up.',
        'Every opening is covered with mosquito mesh and the lid stays on. No open standing water.',
        'Drum water is for plants only. Never drink it.',
        'Use solvent cement outdoors, with gloves.',
        'A full drum weighs over 200 kg. Build the stand level and solid, and never move the drum when it’s full.'
      ],
      stages: [
        { name: 'Survey', steps: ['Choose the roof edge: where does its water go now?', 'Measure the roof area that drains to it.', 'Ask the people who look after the garden how much water they use in a week.'], done: 'We know our roof area and how much water the garden needs.' },
        { name: 'Calculate and design', steps: ['Work out the first-flush length L and the prediction for a 50 mm rain.', 'Draw your own version of the elevation with your measurements.', 'Facilitator approves the plan.'], done: 'Signed-off drawing and materials list.' },
        { name: 'Stand and drum', steps: ['Level the ground and build the stand.', 'Fit the tap and overflow to the drum; seal with washers and sealant.', 'Mark the drum every 10 L by pouring in a measured jug.'], done: 'Drum holds 200 L with no leaks.' },
        { name: 'Gutter', steps: ['Fix brackets along a string line falling 10 mm per metre.', 'Fit the gutter, end caps, outlet and leaf screen.'], done: 'Water poured at the far end all runs to the outlet.' },
        { name: 'Downpipe and first flush', steps: ['Fit the downpipe, tee and reducer.', 'Fit the chamber with the ball inside and the drip cap.', 'Run the branch to the drum with a mesh-covered inlet.'], done: 'Pipework is clamped and every joint is cemented or sealed.' },
        { name: 'Hose test, then rain', steps: ['Run a hose onto the roof: does the chamber fill first, then the drum?', 'Fix any leaks.', 'Wait for real rain and record.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove it catches clean water, and get the real litres close to the prediction.',
        method: [
          'After each rain, read the rainfall (your own rain gauge or the Chennai weather report).',
          'Predict: roof area × rain (mm) × 0.8.',
          'Read the litres from the marks on the drum.',
          'Take a jar of water from the first-flush chamber and a jar from the drum. Compare them.',
          'Check every joint for drips. Then empty the first flush by opening its cap.'
        ],
        cols: ['Date', 'Rain (mm)', 'Predicted (L)', 'Collected (L)', 'First flush dirty, drum clean?', 'Leaks / what we changed']
      },
      improve: ['Gutter slope', 'Leaf screen mesh size', 'First-flush length', 'Seal on the drum inlet', 'Where the overflow goes'],
      roles: [
        ['Researcher', 'Surveys the roof and the garden’s water use, finds the rainfall data, and checks the people who use the tap find it easy.'],
        ['Designer', 'Measures, does the calculations, draws the group’s plan and keeps the materials list.'],
        ['Builder', 'Leads the stand, drum fittings and pipework; fixes leaks after each test.']
      ],
      label: { title: 'Every drop counts', text: 'Each millimetre of rain on one square metre of roof is one litre of water. Our gutter catches it, the first flush throws away the dirty first rain, and the drum stores the clean water for the garden.', tryit: 'Fill a watering can from the tap, and check the drum marks to see how much rain we caught.' }
    }
  };
})();
