/* Term 3 Quests — build outlines. One official outline per build: what it
   is for, the finished model's specification, a dimensioned drawing, the
   parts list, the order of work, and the test that proves it works.

   Boundaries for every build (groups mix ages 8–13):
   - Materials come from an ordinary hardware, stationery, electrical or
     medical shop (or a timber shop that cuts to size). Nothing rare.
   - Every step is one 8–13 year olds can do themselves, with adults
     supervising. Nothing needs sawing pipes, drilling tanks, plumbing,
     ladders or power tools; anything cut from wood is cut by the shop.
   - Electricity only from small batteries or a motor run as a generator.

   Rendered by outline.js; drawings live in outline-drawings.js. */
(function () {
  var D = window.T3_DRAW || {};

  window.T3_OUTLINES = {

    /* ================= Science in action ================= */

    chain: {
      docNo: 'T3-SCI-01', rev: 'B', cat: 'sci', title: 'Chain-reaction machine',
      tagline: 'Ten or more steps, one marble to start it, and a real job at the end.',
      hook: 'Energy changes form and passes from one thing to the next: falling, rolling, toppling, lifting.',
      purposeLabel: 'The big idea',
      purpose: 'Energy is never made or destroyed; it changes form and passes along. A marble held up high has stored energy; as it rolls down a ramp it becomes movement; it knocks a domino, which knocks the next; a falling weight pulls a string that lifts something else. Every hand-off loses a little energy as sound and heat, which is why each step has to be set up to give the next one enough of a push.',
      outcome: 'A table-length machine of at least 10 steps, using at least 5 different kinds of simple machine (ramp, dominoes, lever, pulley, pendulum, wheel and axle), started by releasing one marble and finishing with a real job: ringing a bell and raising a flag. It runs from start to finish without any help, most of the time.',
      spec: [
        ['Size', 'Along two tables, about 2400 mm long, with a 1200 mm high backboard'],
        ['Steps', 'At least 10, of at least 5 different kinds'],
        ['Start and finish', 'Starts with one marble released from a gate; ends by ringing a bell and raising a flag'],
        ['Run time', 'At least 30 seconds from start to finish'],
        ['Reset', 'Back to the start position in under 5 minutes'],
        ['Success test', 'Runs start to finish with no hands 8 times out of 10']
      ],
      drawings: D.chain,
      parts: [
        [1, 'Backboard', 1, 'Pegboard or thick corrugated cardboard, about 1200 × 1200 mm', 'Propped or clamped upright'],
        [2, 'Ramps', 6, 'Cardboard tubes cut in half, foam pipe insulation split lengthwise, or card rails', 'Taped or hot-glued on'],
        [3, 'Marbles and start gate', 10, 'Glass marbles about 16–25 mm; a lolly stick on a pin as the gate', 'Same size throughout'],
        [4, 'Dominoes', 100, 'Domino set or wooden blocks', 'Or stacks of books'],
        [5, 'Toy car and short ramp', 1, 'Any free-rolling toy car', 'Pulls the string'],
        [6, 'Pulley', 2, 'Empty thread spools on a pencil or nail axle', 'Must spin freely'],
        [7, 'String', 1, 'Strong thin string or fishing line, 5 m', ''],
        [8, 'Flag', 1, 'Card flag on a straw', 'The finishing job'],
        [9, 'Bell', 1, 'Small bell, hung from a stick', 'The finishing sound'],
        [10, 'Extras', '', 'Paper cups, rulers, pencils, binder clips, books and boxes for height', 'For levers, cups and supports'],
        ['', 'Fixings', '', 'Masking tape, low-temperature hot glue sticks, Blu-Tack', '']
      ],
      tools: ['Scissors', 'Low-temperature hot glue gun', 'Craft knife on a cutting mat (11+ only)', 'Ruler and pencil', 'Phone to film runs in slow motion'],
      safety: [
        'Use a low-temperature glue gun and keep it on its stand.',
        'Marbles stay on the table and away from younger children.',
        'Craft knives only for Risers 11 and over, always on a cutting mat.',
        'Nothing heavier than 200 g hangs above the table.'
      ],
      stages: [
        { name: 'Design the story', steps: ['Decide the job at the end.', 'List at least 10 steps and the energy change in each.', 'Sketch the layout on paper.'], done: 'A sketch with every step numbered.' },
        { name: 'Build each step alone', steps: ['Build one step at a time.', 'Test each one 5 times on its own.'], done: 'Every step works 5 times out of 5 by itself.' },
        { name: 'Join the steps in pairs', steps: ['Join step 1 to step 2, then 2 to 3, and so on.', 'Hand-offs are where machines fail: line them up carefully.'], done: 'Every pair hands off reliably.' },
        { name: 'Full runs', steps: ['Run the whole machine.', 'Film it, find the step that fails most, and fix only that.'], done: 'It has run start to finish at least once.' },
        { name: 'Reliability', steps: ['Run it 10 times in a row and count the full runs.', 'Fix the weakest step and run 10 again.'], done: '8 out of 10 full runs.' },
        { name: 'Finish', steps: ['Label every step with its energy change.', 'Practise the reset.'], done: 'Ready for the showcase.' }
      ],
      test: {
        goal: 'Make the whole machine run without help, and prove it with numbers.',
        method: ['Reset the machine.', 'Release the marble and do not touch anything.', 'Record whether it reached the end, and if not, which step stopped it.', 'Do 10 runs in a set.', 'Change one thing, then do another set of 10.'],
        cols: ['Set', 'What we changed', 'Full runs out of 10', 'Step that failed most', 'Run time (s)', 'What we noticed']
      },
      improve: ['Ramp angle', 'Gap between dominoes', 'Where a lever’s pivot sits', 'String length', 'Lining up each hand-off'],
      roles: [
        ['Investigator', 'Draws the energy chain and explains the energy change at every step.'],
        ['Engineer', 'Leads building and lining up the hand-offs; makes one change at a time.'],
        ['Data keeper', 'Runs the sets of 10, records which step fails, and works out the success rate.']
      ],
      ages: [
        ['Everyone', 'Builds and tests single steps; takes turns running the machine.'],
        ['Younger (8–10)', 'Dominoes, ramps, the flag and bell, step labels, counting runs.'],
        ['Older (11–13)', 'Levers and pulleys, lining up hand-offs, the energy chain explanation, success rate as a percentage.']
      ],
      stretch: 'Add a step that uses water or air, or make it run both ways.',
      label: { title: 'Pass it on', text: 'One marble starts it all. At every step, energy changes form — stored, rolling, toppling, lifting — and passes to the next step, until the last one rings the bell.', tryit: 'Release the marble and count the energy changes.' }
    },

    hydraulic: {
      docNo: 'T3-SCI-02', rev: 'B', cat: 'sci', title: 'Hydraulic excavator arm',
      tagline: 'A digger with four water-powered movements, controlled by syringes.',
      hook: 'Liquids can’t be squashed, so a push on one syringe travels down a tube and pushes another.',
      purposeLabel: 'The big idea',
      purpose: 'Liquids can’t be squashed. Push on water in one syringe and the push travels through the tube to a second syringe, which moves. This is how real diggers and car brakes work. Change the syringe sizes and you trade force for distance: a small syringe pushing a big one gives a stronger push that moves a shorter way.',
      outcome: 'A model excavator with four hydraulic movements — the base turns, the boom lifts, the arm reaches, the bucket scoops — each worked by a pair of syringes filled with coloured water. It picks up a 100 g object and drops it into a cup 300 mm away using only the syringes.',
      spec: [
        ['Size', 'Base about 250 × 250 mm; reach about 400 mm; height about 350 mm'],
        ['Movements', '4: turn, lift, reach, scoop'],
        ['Hydraulics', 'Pairs of 10 ml syringes joined by about 500 mm of clear tube, filled with coloured water'],
        ['Structure', 'Thick corrugated cardboard and lolly sticks; wooden skewers as pivot pins'],
        ['Success test', 'Picks up a 100 g object and drops it in a cup 300 mm away, 4 times out of 5, without hands touching the arm']
      ],
      drawings: D.hydraulic,
      parts: [
        [1, 'Base box', 1, 'Corrugated cardboard box about 250 × 250 × 60 mm, weighted inside', 'Must not tip'],
        [2, 'Turntable', 1, 'Old CD or jar lid on a bolt through the base', 'Turns the whole arm'],
        [3, 'Boom', 2, 'Double-layer corrugated cardboard, about 250 × 30 mm', 'Two sides, joined with spacers'],
        [4, 'Arm', 2, 'Double-layer corrugated cardboard, about 200 × 25 mm', ''],
        [5, 'Bucket', 1, 'Small paper cup or a card scoop', ''],
        [6, 'Syringes on the arm', 4, '10 ml syringes, no needles', 'Medical shop'],
        [7, 'Tubes', 1, 'Clear 3–4 mm tube that fits the syringe tips, about 2.5 m', 'Aquarium airline or IV tube'],
        [8, 'Control syringes', 4, '10 ml syringes, plus one 5 ml and one 20 ml for the force test', 'On the control panel'],
        [9, 'Pivot pins', 10, 'Wooden skewers, cut to length, with bead or tape stops', ''],
        ['', 'Fixings', '', 'Lolly sticks, cable ties, binder clips, low-temperature hot glue, food colouring', '']
      ],
      tools: ['Scissors', 'Low-temperature hot glue gun', 'Awl or compass point for pivot holes (adult helps under-10s)', 'Strong scissors for trimming skewers', 'Ruler and pencil', 'Kitchen scale (for the test)'],
      safety: [
        'Syringes without needles only.',
        'Make holes by pushing the awl into a block of eraser or cork, never towards a hand.',
        'Low-temperature glue gun only; keep it on its stand.',
        'Wipe up water spills straight away.'
      ],
      stages: [
        { name: 'Make one pair work', steps: ['Fill a pair of syringes and the tube with coloured water, with no air bubbles.', 'Push one and watch the other move.'], done: 'A smooth, bubble-free pair.' },
        { name: 'Base and turntable', steps: ['Build and weight the base.', 'Fit the turntable so the arm can turn.'], done: 'Turns smoothly and doesn’t tip.' },
        { name: 'Boom and arm', steps: ['Cut and join the boom and arm.', 'Fit the pivot pins so each joint swings freely.'], done: 'Every joint moves by hand without sticking.' },
        { name: 'Fit the hydraulics', steps: ['Fix a syringe across each joint.', 'Run the tubes back to the control panel and label each one.'], done: 'All four movements work from the panel.' },
        { name: 'Challenge trials', steps: ['Run the pick-and-place test.', 'Strengthen whatever bends or slips.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove the arm can do a real job, and find out how syringe size changes the force.',
        method: ['Put the 100 g object in the same spot every time.', 'Pick it up and drop it in the cup 300 mm away using only the control panel.', 'Time each try. Do 5 tries.', 'Force test: lift weights with a 10 ml driver, then a 5 ml and a 20 ml. Record the heaviest lift and how far the arm moved each time.'],
        cols: ['Version', 'What we changed', 'Successful moves out of 5', 'Time per move (s)', 'Heaviest lift (g)', 'What we noticed']
      },
      improve: ['Where each syringe is fixed', 'Syringe sizes (5, 10, 20 ml)', 'Stiffness of the boom', 'Bucket shape', 'Base weight'],
      roles: [
        ['Investigator', 'Explains why liquids pass a push along, and predicts what changing syringe size will do.'],
        ['Engineer', 'Leads the joints, syringe fixings and tube routing.'],
        ['Data keeper', 'Runs the challenge and force tests and records every try.']
      ],
      ages: [
        ['Everyone', 'Fills syringes, operates the arm, tries the challenge.'],
        ['Younger (8–10)', 'Colouring and filling, the bucket, labelling tubes, timing tries.'],
        ['Older (11–13)', 'Pivot joints, syringe positions, the force test and explaining force against distance.']
      ],
      stretch: 'Add a fifth movement, like a gripper that closes.',
      label: { title: 'Water power', text: 'Water can’t be squashed, so when you push one syringe the push travels down the tube and moves the arm. Real diggers do this with oil.', tryit: 'Use the control panel to move the ball into the cup.' }
    },

    turbine: {
      docNo: 'T3-SCI-03', rev: 'B', cat: 'sci', title: 'Wind turbine that makes electricity',
      tagline: 'Blades you design turn a generator and light an LED.',
      hook: 'Moving air has energy; blades turn it into spinning, and a generator turns spinning into electricity.',
      purposeLabel: 'The big idea',
      purpose: 'Moving air has energy. Blades set at an angle turn that push into spinning. A small motor, turned by something else instead of by a battery, works backwards as a generator: spinning its shaft makes electricity. The shape, number and angle of the blades decide how much energy you catch — and that is something you can measure.',
      outcome: 'A wind turbine on a 1 m tower with a rotor about 500 mm across, driving a small motor as a generator. In front of a fan it lights an LED and shows its voltage on a multimeter. The group finds, by fair testing, the blade design that makes the most voltage.',
      spec: [
        ['Tower', 'A broom handle or 1 m wooden pole, standing in a bucket of sand'],
        ['Rotor', 'About 500 mm across; blades cut from plastic file covers or thin card on skewers, in a cork or bottle-cap hub'],
        ['Generator', 'Small 3–6 V DC hobby motor, used backwards'],
        ['Wind', 'A pedestal fan at 1500 mm, same speed setting every test'],
        ['Success test', 'Lights a red LED and makes at least 2 V with the fan on its highest setting']
      ],
      drawings: D.turbine,
      parts: [
        [1, 'Blades', 6, 'Plastic file covers or thin card, cut from a template; skewers as spars', 'Make spares to test'],
        [2, 'Hub', 2, 'Cork or bottle cap, pushed onto the motor shaft', 'Holes at even spacing'],
        [3, 'Generator', 1, '3–6 V DC hobby motor, in a small box on top of the tower', 'Electronics shop'],
        [4, 'Tower', 1, 'Broom handle or wooden pole, about 1 m', 'Cable-tied in the bucket'],
        [5, 'Base', 1, 'Bucket filled with sand', ''],
        [6, 'LED and wires', 1, 'Red LED, 1 m of thin wire, crocodile clips', ''],
        [7, 'Multimeter', 1, 'Basic digital multimeter', 'Electronics shop'],
        [8, 'Fan', 1, 'Pedestal or table fan with a guard', 'The wind source'],
        ['', 'Fixings', '', 'Low-temperature hot glue, tape, cable ties, protractor', '']
      ],
      tools: ['Scissors', 'Low-temperature hot glue gun', 'Protractor and ruler', 'Cable ties', 'Multimeter'],
      safety: [
        'The fan keeps its guard on.',
        'Stand beside the rotor, never in front of it, while it spins.',
        'Round or tape the blade tips.',
        'Turn the fan off before touching the rotor.'
      ],
      stages: [
        { name: 'Test the generator', steps: ['Connect the motor to the multimeter.', 'Spin the shaft with your fingers and watch the voltage.'], done: 'You can make a voltage by hand.' },
        { name: 'Tower and nacelle', steps: ['Stand the pole in the sand bucket.', 'Fix the motor in a small box on top, shaft pointing at the fan.'], done: 'Tower stands straight and steady.' },
        { name: 'First rotor', steps: ['Cut 3 blades from the template.', 'Set them in the hub at 20°.'], done: 'Rotor spins in front of the fan.' },
        { name: 'Fair tests', steps: ['Change one thing at a time: number of blades, angle, length or shape.', 'Record the voltage for each.'], done: 'At least 3 rounds of testing.' },
        { name: 'Best design', steps: ['Build the best rotor carefully.', 'Light the LED.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Find the blade design that makes the most voltage.',
        method: ['Fan at 1500 mm, same speed setting every time.', 'Let the rotor spin for 10 seconds, then read the voltage.', 'Read it three times and take the middle one.', 'Change only one thing between tests.'],
        cols: ['Version', 'Blades (number and shape)', 'Angle (°)', 'Voltage (V)', 'LED lit?', 'What we noticed']
      },
      improve: ['Number of blades (2, 3, 4, 6)', 'Blade angle (10°–45°)', 'Blade length', 'Blade shape', 'Blade material'],
      roles: [
        ['Investigator', 'Explains how a generator works and predicts which blade design will win.'],
        ['Engineer', 'Builds the tower, nacelle and each new rotor.'],
        ['Data keeper', 'Plans the fair test, reads the multimeter, and draws the voltage graph.']
      ],
      ages: [
        ['Everyone', 'Cuts blades, runs tests, reads the multimeter.'],
        ['Younger (8–10)', 'Cutting blades from the template, decorating, recording readings with help.'],
        ['Older (11–13)', 'Setting angles with a protractor, planning the fair test, graphing voltage against angle.']
      ],
      stretch: 'Gear it up with a bigger wheel and a belt to make more voltage.',
      label: { title: 'Catch the wind', text: 'The blades turn the push of the wind into spinning. The motor, turned backwards, becomes a generator and makes electricity. We tested blade designs to find the one that catches the most energy.', tryit: 'Switch on the fan and watch the voltage climb.' }
    },

    bridge: {
      docNo: 'T3-SCI-04', rev: 'A', cat: 'sci', title: 'Lolly-stick truss bridge',
      tagline: 'A bridge of craft sticks and glue that holds a bucket of water many times its own weight.',
      hook: 'Triangles can’t change shape, so a frame of triangles turns a heavy load into pushes and pulls along each stick.',
      purposeLabel: 'The big idea',
      purpose: 'A square frame of sticks folds flat when you press it; a triangle can’t change shape without a stick breaking. That is why real bridges, cranes and towers are built from triangles, called a truss. When a load presses down, some sticks are squeezed (compression) and some are stretched (tension). A good design shares the load so no single stick or joint takes too much — and the best bridge is not the heaviest one, but the one that holds the most for its own weight.',
      outcome: 'A truss bridge made only of craft sticks and white glue, spanning a 500 mm gap between two tables, weighing no more than 250 g, that holds a bucket loaded with at least 10 kg hung from its middle. The group tests early versions until they break, learns where they fail, and builds a final bridge that beats them.',
      spec: [
        ['Length', '600 mm, resting 50 mm on each table'],
        ['Clear span', '500 mm'],
        ['Width and height', 'About 90 mm wide and 120 mm high'],
        ['Materials', 'Jumbo craft sticks (about 150 × 18 mm) and white PVA glue only, no more than 200 sticks'],
        ['Weight', 'No more than 250 g'],
        ['Success test', 'Holds at least 10 kg hung from the middle for 1 minute; strength ratio (load ÷ bridge weight) of 40 or more']
      ],
      drawings: D.bridge,
      parts: [
        [1, 'Top chords', 2, 'Craft sticks glued end to end in two overlapping layers', 'Squeezed under load'],
        [2, 'Bottom chords', 2, 'Craft sticks glued end to end in two overlapping layers', 'Stretched under load'],
        [3, 'Diagonals', 24, 'Single craft sticks, trimmed to fit the drawing', 'Make the triangles'],
        [4, 'Deck', 30, 'Craft sticks laid across the two bottom chords', ''],
        [5, 'Load hook', 1, 'String loop or a wire S-hook round the middle of the deck', ''],
        [6, 'Load bucket', 1, '10–15 L bucket, filled with water a litre at a time', 'Kept just above the floor'],
        [7, 'Cross-braces', 8, 'Craft sticks in an X between the two trusses', 'Stop it twisting'],
        [8, 'Top ties', 6, 'Craft sticks across the two top chords', ''],
        ['', 'Also', '', 'White PVA glue, clothes pegs as clamps, baking paper, a kitchen scale, a 1 L jug', '']
      ],
      tools: ['Strong scissors or garden snips for trimming sticks (older Risers)', 'Sandpaper', 'Ruler, pencil and set square', 'Clothes pegs (as clamps)', 'Kitchen scale and a 1 L jug'],
      safety: [
        'Wear safety glasses when testing to breaking point: sticks can snap and fly.',
        'Keep the bucket hanging only a few centimetres above a cushion or mat, and keep feet clear.',
        'Snips only for Risers 11 and over; younger Risers glue and clamp.',
        'Wipe up glue and water spills straight away.'
      ],
      stages: [
        { name: 'Why triangles?', steps: ['Make a square and a triangle from sticks and paper fasteners.', 'Press on each and compare.'], done: 'Everyone can explain why the triangle holds its shape.' },
        { name: 'Draw it full size', steps: ['Draw one truss full size on paper: chords, diagonals and every joint.', 'Lay baking paper over it so the glue won’t stick.'], done: 'A full-size drawing to build on.' },
        { name: 'Build two trusses', steps: ['Glue the sticks straight onto the drawing, clamping each joint with pegs.', 'Let them dry overnight; build the second on the same drawing.'], done: 'Two matching trusses.' },
        { name: 'Join them', steps: ['Stand the trusses up 90 mm apart.', 'Glue on the deck, top ties and cross-braces; dry overnight.'], done: 'Bridge stands square and doesn’t twist.' },
        { name: 'Test to breaking', steps: ['Weigh the bridge, then load it a litre at a time until it fails.', 'Film it and find which stick or joint went first.'], done: 'We know where version 1 failed.' },
        { name: 'Build it better', steps: ['Strengthen only where it failed.', 'Build the final bridge and test it to 10 kg.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Make the strongest bridge for its weight, and know why it breaks where it does.',
        method: ['Weigh the bridge on the kitchen scale.', 'Hang the bucket from the middle and add water one litre at a time (1 L = 1 kg), waiting 10 seconds each time.', 'Record the last load it held and where it broke.', 'Work out the strength ratio: load held ÷ bridge weight.'],
        cols: ['Version', 'Bridge weight (g)', 'Load held (kg)', 'Strength ratio', 'Where it broke', 'What we changed']
      },
      improve: ['Truss pattern (Warren, Pratt, Howe)', 'Doubling the chords', 'Joint overlap and glue', 'Cross-bracing', 'Fewer sticks for the same strength'],
      roles: [
        ['Investigator', 'Explains compression and tension and predicts where each version will break.'],
        ['Engineer', 'Leads the full-size drawing, gluing and joining; plans each improvement.'],
        ['Data keeper', 'Weighs bridges, runs the load test, works out the strength ratio and charts the versions.']
      ],
      ages: [
        ['Everyone', 'Glues and clamps, loads the bucket, spots where it broke.'],
        ['Younger (8–10)', 'Gluing on the drawing, clamping with pegs, the deck, pouring water a litre at a time.'],
        ['Older (11–13)', 'The full-size drawing, trimming sticks, the strength ratio and the explanation.']
      ],
      stretch: 'Make a bridge that is lighter but still holds 10 kg.',
      label: { title: 'Triangles are strong', text: 'This bridge is only craft sticks and glue. Every space is a triangle, which can’t change shape, so the load is shared out as pushes and pulls along the sticks.', tryit: 'Guess how many litres it can hold, then check our test record.' }
    },

    rocket: {
      docNo: 'T3-SCI-05', rev: 'B', cat: 'sci', title: 'Water rocket and launch pad',
      tagline: 'A bottle rocket that flies straight and far, tested launch by launch.',
      hook: 'Pumped-up air pushes water out backwards, and the water pushes the rocket forwards.',
      purposeLabel: 'The big idea',
      purpose: 'Every push has an equal push back. Pump air into a bottle partly filled with water and the pressure builds. When the cork lets go, the air shoves the water out of the back fast — and the water shoves the rocket forwards. Too little water and there is little to throw; too much and the rocket is too heavy. Somewhere in between is the best amount, and fins and a weighted nose decide whether it flies straight.',
      outcome: 'A 2-litre bottle rocket with fins and a weighted nose cone, and a launch pad that holds it at 45°. It flies straight and lands at least 30 m away. By changing one thing at a time, the group finds the water amount that flies furthest.',
      spec: [
        ['Body', '2-litre fizzy-drink bottle (made to take pressure). Never a water bottle.'],
        ['Length', 'About 450 mm with nose cone'],
        ['Launch', 'Rubber cork with the pump’s ball-inflating needle pushed through it, and a bike foot pump with a pressure gauge'],
        ['Pressure', 'No more than 60 psi (4 bar)'],
        ['Launch angle', '45°, fixed by the pad'],
        ['Success test', 'Flies straight and lands at least 30 m away; three launches with the same settings land within 5 m of each other']
      ],
      drawings: D.rocket,
      parts: [
        [1, 'Rocket body', 3, '2-litre fizzy-drink bottles (one to fly, one spare, one for the nose)', 'Check for dents'],
        [2, 'Nose cone', 1, 'Top of a second bottle or a card cone', ''],
        [3, 'Nose weight', 1, 'About 50 g of modelling clay in the tip', 'Keeps it flying straight'],
        [4, 'Fins', 3, 'Corrugated plastic sheet or laminated card, cut from a template', 'Evenly spaced'],
        [5, 'Cork and needle', 1, 'Rubber cork to fit the bottle neck, with a ball-inflating needle pushed through it', 'Sports or cycle shop'],
        [6, 'Launch pad', 1, 'Plank about 600 × 150 mm with two supports holding the rocket at 45°', ''],
        [7, 'Pump', 1, 'Bike foot pump with a pressure gauge', ''],
        [8, 'Water', '', 'Start at 650 ml (a third of the bottle)', 'Measured each time'],
        ['', 'Also', '', 'Strong tape, measuring tape (30 m), marker flags, safety glasses', '']
      ],
      tools: ['Scissors', 'Strong tape and low-temperature hot glue', 'Protractor', '30 m measuring tape', 'Safety glasses for everyone'],
      safety: [
        'Launch only in an open field with 50 m clear in front and nobody within 5 m of the pad.',
        'Everyone wears safety glasses.',
        'Risers pump from the side with an adult watching the gauge; stop at 60 psi.',
        'Nobody stands over or in front of the rocket. If it doesn’t launch, pull the needle out from the side to let the air out.',
        'Retire any bottle that is dented or has done 10 launches.'
      ],
      stages: [
        { name: 'Launcher', steps: ['Twist the inflating needle carefully through the cork.', 'Build the pad at 45°.'], done: 'Pad holds an empty bottle firmly at 45°.' },
        { name: 'First rocket', steps: ['Fix the fins, nose cone and clay.', 'Swing test: tie a string at the balance point and swing — it should fly nose-first.'], done: 'Passes the swing test.' },
        { name: 'First launches', steps: ['650 ml of water, launch at about 40 psi.', 'Measure where it lands.'], done: 'Three launches recorded.' },
        { name: 'Fair tests', steps: ['Change one thing at a time — water amount first.', 'Three launches for each setting.'], done: 'Best water amount found.' },
        { name: 'Best rocket', steps: ['Build a clean final rocket with the best settings.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Find the setting that flies furthest, and prove it isn’t luck.',
        method: ['Same pad angle and same pump pressure every time.', 'Measure the water each time.', 'Measure from the pad to where it first lands.', 'Three launches per setting; take the middle distance.'],
        cols: ['Launch', 'Water (ml)', 'Pressure (psi)', 'Distance (m)', 'Flew straight?', 'What we noticed']
      },
      improve: ['Water amount (250–1000 ml)', 'Fin shape and size', 'Nose weight', 'Launch angle', 'Pressure (up to 60 psi)'],
      roles: [
        ['Investigator', 'Explains action and reaction and why there is a best amount of water.'],
        ['Engineer', 'Builds the rocket and pad and makes each change.'],
        ['Data keeper', 'Measures water and distance, keeps the launch log, and draws the water–distance graph.']
      ],
      ages: [
        ['Everyone', 'Builds fins, marks landing spots, helps measure.'],
        ['Younger (8–10)', 'Fins and nose decoration, measuring water, marking where it lands.'],
        ['Older (11–13)', 'The swing test, planning the fair test, the graph and explanation.']
      ],
      stretch: 'Add a paper parachute that opens at the top of the flight.',
      label: { title: 'Push back', text: 'Air pumped into the bottle pushes the water out backwards — and the water pushes the rocket forwards. We tested water amounts to find the one that flies furthest.', tryit: 'Watch the launch video and spot the water jet.' }
    },

    /* ================= Solve a LifeHub problem ================= */

    weather: {
      docNo: 'T3-SOL-01', rev: 'A', cat: 'sol', title: 'LifeHub weather station',
      tagline: 'Home-made instruments and a daily weather board the garden and facilitators use.',
      hook: 'Decisions about watering the garden and going outdoors are made by guessing the weather.',
      purposeLabel: 'The problem',
      purpose: 'Every day someone at LifeHub decides whether the garden needs watering, whether to work outside, and what to do if it rains — mostly by guessing. In the northeast monsoon, October to December, the weather changes quickly. A weather station that measures rain, temperature and wind every day, and a board that turns the readings into simple advice, lets people decide with real information.',
      outcome: 'A working weather station in the LifeHub garden — a rain gauge, a wind vane, a cup anemometer and a thermometer in a shaded box — all made by the group, plus a weather board by the garden where the group posts each day’s readings and a “Water the garden today?” answer. It runs every LifeHub day for at least three weeks.',
      spec: [
        ['Rain gauge', 'Straight-sided clear bottle with a funnel, scale in mm, on a short stand in the open'],
        ['Wind vane', 'Card arrow on a straw that turns freely on a pin, with N, E, S, W set using a compass'],
        ['Anemometer', 'Four paper cups on crossed sticks that spin on a pin; speed counted as turns in 30 seconds'],
        ['Thermometer screen', 'White slatted or holed box in the shade at about 1.2 m, holding a digital min/max thermometer'],
        ['Mounting', 'A wooden pole or broom handle cable-tied to an existing fence post, about 1.8 m high'],
        ['Success test', 'Readings posted every LifeHub day for 3 weeks; two identical rain gauges agree within 2 mm; the garden team uses the board to decide on watering']
      ],
      drawings: D.weather,
      parts: [
        [1, 'Anemometer', 1, '4 small paper cups, 2 wooden sticks crossed, a pin and a bead through a pencil eraser', 'Mark one cup to count turns'],
        [2, 'Wind vane', 1, 'Card arrow and tail on a straw, a pin through it into a pencil eraser', 'Turns freely'],
        [3, 'Pole', 1, 'Wooden pole or broom handle about 2 m', ''],
        [4, 'Thermometer screen', 1, 'White plastic tub or card box, holes or slats cut for air, painted white', 'Shade and air, no sun'],
        [5, 'Thermometer', 1, 'Digital min/max thermometer', 'Shows the day’s highest and lowest'],
        [6, 'Rain gauges', 2, '2 L clear bottles with straight sides, top cut and turned upside down as a funnel, ruler scale taped on', 'Two, to check each other'],
        [7, 'Weather board', 1, 'Whiteboard or laminated chart with markers', 'By the garden'],
        [8, 'Cable ties', 20, 'Strong cable ties', 'Fix the pole and screen'],
        ['', 'Also', '', 'Phone compass, stopwatch, notebook for the log, low-temperature hot glue, white paint', '']
      ],
      tools: ['Scissors', 'Low-temperature hot glue gun', 'Ruler and marker', 'Phone compass and stopwatch', 'Paintbrush'],
      safety: [
        'Use pins carefully; push them into erasers, never towards fingers.',
        'Mount everything from the ground: no climbing on fences or ladders.',
        'Empty the rain gauges after each reading so mosquitoes can’t breed.',
        'Bring the instruments in if a storm is forecast.'
      ],
      stages: [
        { name: 'Survey', steps: ['Ask the garden team and facilitators which weather decisions they make each day.', 'Choose a spot: open for the rain gauge, a fence post for the pole.'], done: 'We know what the board must answer.' },
        { name: 'Make the instruments', steps: ['Build the rain gauges, wind vane, anemometer and screen.', 'Test each one indoors: does the vane turn, do the cups spin with a fan?'], done: 'Every instrument works on the bench.' },
        { name: 'Mount them', steps: ['Cable-tie the pole to the fence post with the anemometer and vane on top.', 'Set N on the vane card using the compass.', 'Fix the screen in the shade and stand the rain gauges in the open.'], done: 'Station up and level.' },
        { name: 'Design the board', steps: ['Decide what goes on the board and the rule for “Water the garden today?”', 'Agree the rule with the garden team.'], done: 'Board and rule agreed.' },
        { name: 'Run it daily', steps: ['Take readings at the same time every day, log them, post the board and empty the gauges.', 'Compare with the official forecast once a week.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove the station gives reliable readings every day, and that people use it.',
        method: ['Read everything at the same time every day.', 'Read both rain gauges; they should agree within 2 mm.', 'Count anemometer turns in 30 seconds, three times, and take the middle one.', 'Note what the garden team decided after reading the board.'],
        cols: ['Date', 'Rain (mm)', 'Min / max (°C)', 'Wind (direction, turns)', 'Board advice', 'Used by the garden team?']
      },
      improve: ['Where the rain gauge stands', 'How freely the vane and cups turn', 'Screen shade and airflow', 'The watering rule', 'How clear the board is'],
      roles: [
        ['Researcher', 'Finds out what decisions people make, compares readings with the official forecast, and checks the board is used.'],
        ['Designer', 'Designs the instruments and the board, and the watering rule with the garden team.'],
        ['Builder', 'Leads making and mounting the instruments and fixes them when they stick or break.']
      ],
      ages: [
        ['Everyone', 'Makes an instrument, takes turns at the daily reading.'],
        ['Younger (8–10)', 'The rain gauges and wind vane, reading the scales, writing up the board.'],
        ['Older (11–13)', 'The anemometer and screen, the watering rule, comparing with the forecast and charting the three weeks.']
      ],
      stretch: 'Turn the anemometer turns into km/h by testing it on a moving bicycle at a known speed.',
      label: { title: 'Our weather, every day', text: 'We built every instrument here ourselves. Each morning we read the rain, temperature and wind, and our board tells the garden team whether to water today.', tryit: 'Count the cup turns in 30 seconds and find today’s wind on our chart.' }
    },

    den: {
      docNo: 'T3-SOL-02', rev: 'A', cat: 'sol', title: 'Bamboo reading den',
      tagline: 'A shady outdoor den, lashed together from bamboo and rope with no power tools.',
      hook: 'There is no quiet, shady outdoor spot where Risers can read or think.',
      purposeLabel: 'The problem',
      purpose: 'LifeHub has no quiet, shady place outside where a few Risers can sit and read, think or talk. Shade cloth on its own blows away; a proper shelter needs a frame that stands up to wind and people leaning on it. People have built strong frames from bamboo and rope for thousands of years — the strength comes from triangles and from tying the joints properly.',
      outcome: 'A free-standing A-frame den about 2.1 m long, 1.6 m wide and 1.85 m high, seating three or four Risers on a floor mat under a shade-net roof. It is built only from bamboo poles and rope, with every joint lashed, and passes a load test before anyone uses it.',
      spec: [
        ['Size', 'About 2100 mm long × 1600 mm wide × 1850 mm high'],
        ['Frame', 'Two A-frames joined by a ridge pole, side poles along the ground and a diagonal brace'],
        ['Joints', 'Shear lashings at the tops of the A-frames, square and diagonal lashings everywhere else'],
        ['Roof', 'Green shade net (50%), tied to the frame'],
        ['Seats', 'Three or four Risers on a floor mat'],
        ['Success test', 'Holds a 30 kg sandbag hung from the ridge for 10 minutes; moves less than 50 mm when pushed firmly at the top; shade is cooler than full sun']
      ],
      drawings: D.den,
      parts: [
        [1, 'Legs', 4, 'Bamboo poles 2200 mm, 40–50 mm thick', 'The supplier cuts all poles to length'],
        [2, 'Ridge pole', 1, 'Bamboo about 2600 mm', ''],
        [3, 'A-frame crossbars', 2, 'Bamboo about 1800 mm', 'Tied 400 mm above the ground'],
        [4, 'Side poles', 2, 'Bamboo about 2600 mm, along the ground', ''],
        [5, 'Diagonal brace', 1, 'Bamboo about 2800 mm', 'Stops it leaning'],
        [6, 'Shear lashings', 2, '6 mm rope, about 3 m each', 'At the A-frame tops'],
        [7, 'Square and diagonal lashings', 10, '6 mm rope, about 3 m each', ''],
        [8, 'Shade net', 1, 'Green shade net 50%, about 3 × 4 m', 'Tied every 300 mm'],
        [9, 'Guy ropes and pegs', 2, '6 mm rope, 3 m each, and wooden or steel pegs', 'One at each end'],
        ['', 'Also', '', 'Floor mat, cloth tape to cover pole ends, sandpaper', '']
      ],
      tools: ['Sandpaper', 'Measuring tape and chalk', 'Scissors for rope', 'Mallet for pegs'],
      safety: [
        'Sand every pole end and cover it with tape: bamboo splinters are sharp.',
        'No climbing on the frame, ever.',
        'Load test with sandbags before anyone sits inside.',
        'Check every lashing at the start of each week, and after strong wind.',
        'Take the shade net off if a storm is forecast.'
      ],
      stages: [
        { name: 'Survey and site', steps: ['Ask Risers and facilitators where a den would be used most.', 'Choose a flat spot and check shade and wind at different times.'], done: 'Site chosen and agreed.' },
        { name: 'Learn the knots', steps: ['Practise the clove hitch, square lashing and shear lashing on short sticks.', 'Everyone ties each lashing at least once.'], done: 'Every member can tie a firm square lashing.' },
        { name: 'Prepare the poles', steps: ['Check each pole against the parts list (the supplier cuts them to length).', 'Sand and tape all the ends.'], done: 'All poles ready and labelled.' },
        { name: 'A-frames', steps: ['Lash the two legs with a shear lashing.', 'Spread them to 1600 mm and lash on the crossbar.'], done: 'Two identical A-frames.' },
        { name: 'Raise and brace', steps: ['Stand the A-frames up and lash on the ridge pole.', 'Lash on the side poles and the diagonal brace; add guy ropes.'], done: 'Frame stands alone and doesn’t wobble.' },
        { name: 'Roof and finish', steps: ['Tie on the shade net.', 'Lay the floor mat; do the load test.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove the den is strong and steady before people use it, and that it really makes good shade.',
        method: ['Hang a 30 kg sandbag from the middle of the ridge for 10 minutes; check every lashing after.', 'Push firmly at the top of one end; measure how far it moves against a stick in the ground.', 'At midday, read a thermometer in the shade inside and in full sun.', 'After a week, count how many times it was used.'],
        cols: ['Version', 'What we changed', 'Load test passed?', 'Sway (mm)', 'Shade vs sun (°C)', 'What we noticed']
      },
      improve: ['Tightness of each lashing', 'Where the brace goes', 'Guy rope angle', 'How the net is tied', 'Seating and comfort'],
      roles: [
        ['Researcher', 'Asks people what they need from a den, chooses the site with the group, and counts how often it is used.'],
        ['Designer', 'Draws the plan, the cutting list and the rope list; designs the roof.'],
        ['Builder', 'Leads cutting, lashing and raising the frame; runs the load test.']
      ],
      ages: [
        ['Everyone', 'Learns the lashings and helps raise the frame.'],
        ['Younger (8–10)', 'Sanding and taping pole ends, simple lashings, sewing or decorating the cloth, the use survey.'],
        ['Older (11–13)', 'Measuring and marking, the shear lashings, the load and sway tests.']
      ],
      stretch: 'Add a low bamboo bench inside, or a rolled-up side wall for rain.',
      label: { title: 'Tied together', text: 'No nails, no screws: just bamboo and rope. Triangles make the frame strong, and every joint is lashed the way builders have done it for thousands of years.', tryit: 'Find the shear lashing, the square lashing and the diagonal brace.' }
    },

    dryer: {
      docNo: 'T3-SOL-03', rev: 'A', cat: 'sol', title: 'Solar food dryer',
      tagline: 'Dry fruit and leaves from the garden with sunshine, cleanly and faster.',
      hook: 'Fruit and leaves go to waste, and drying them in the open is slow, dusty and full of flies.',
      purposeLabel: 'The problem',
      purpose: 'Extra fruit and leaves from the garden and the kitchen go to waste, and drying them on a plate in the open is slow and attracts dust, birds and flies. A solar dryer heats air with sunlight and moves it through the food without a fan: warm air rises, pulls in cool air behind it, and carries the moisture away, all behind a mesh.',
      outcome: 'A solar dryer with a sloping black collector under a clear cover, feeding warm air up into a cabinet with two mesh trays and a vent at the top. On a sunny day the cabinet is at least 15 °C hotter than the outside air, and it dries sliced fruit faster than an open-air plate.',
      spec: [
        ['Collector', '1000 × 500 mm, black absorber under a clear UV-stabilised cover, sloping at about 20°, facing south'],
        ['Cabinet', '500 × 500 × 600 mm on 450 mm legs, door at the back, two mesh trays'],
        ['Airflow', 'In at the low end of the collector, out through a vent in the top; all openings meshed'],
        ['Material', '9 mm plywood panels and battens, all cut to size by the timber shop from the cutting list'],
        ['Success test', 'Cabinet at least 15 °C hotter than outside at midday on a sunny day; fruit slices reach a steady weight sooner than the open-air plate']
      ],
      drawings: D.dryer,
      parts: [
        [1, 'Collector box', 1, '9 mm plywood: base 1000 × 500, two sides 1000 × 100, end 500 × 100', 'Cut by the timber shop'],
        [2, 'Clear cover', 1, 'UV-stabilised clear polythene (greenhouse film), 200 micron, about 1200 × 700 mm', 'Stapled tight'],
        [3, 'Absorber', 1, 'Thin metal sheet 1000 × 500, or the base itself, painted matt black', 'Lead-free paint'],
        [4, 'Air inlet', 1, 'Gap 480 × 60 mm at the low end, covered with mosquito mesh', ''],
        [5, 'Cabinet', 1, '9 mm plywood: 2 sides and back 600 × 500, top 520 × 520, bottom 500 × 482 with a 482 × 100 opening for the warm air', ''],
        [6, 'Door', 1, '9 mm plywood 600 × 500, 2 hinges and a hook', 'At the back'],
        [7, 'Trays', 2, 'Frames of 20 × 20 mm battens, 460 × 460 mm, with food-safe nylon or steel mesh', ''],
        [8, 'Tray runners', 4, '20 × 20 mm battens, 480 mm', ''],
        [9, 'Top vent', 1, 'Slot 400 × 40 mm with mesh and a small rain cap', ''],
        [10, 'Legs', 6, '40 × 40 mm battens: 4 for the cabinet (450 mm), 2 for the collector', ''],
        [11, 'Fixings', '', '25 mm screws, wood glue, staples, hinges', ''],
        [12, 'Thermometers', 2, 'Digital probe thermometers', 'One inside, one outside']
      ],
      tools: ['Screwdrivers', 'Bradawl to start screw holes', 'Hand stapler or staple gun', 'Paintbrush', 'Measuring tape and try square', 'Kitchen scale (for the test)'],
      safety: [
        'The timber shop cuts all the panels and battens to the cutting list; nothing is sawn at LifeHub.',
        'Paint outdoors with lead-free paint, and let it dry fully before food goes in.',
        'Wash hands and trays before handling food.',
        'A facilitator decides whether dried food is safe to eat, and it is labelled with the date.',
        'The collector cover gets hot; open the cabinet from the back.'
      ],
      stages: [
        { name: 'Survey', steps: ['Ask the kitchen and garden what goes to waste and what they would like dried.', 'Find a sunny spot facing south.'], done: 'We know what to dry and where.' },
        { name: 'Order panels', steps: ['Check the cutting list and take it to the timber shop.'], done: 'All panels and battens cut and labelled.' },
        { name: 'Build the cabinet', steps: ['Screw and glue the cabinet together.', 'Fit the runners, trays and door.'], done: 'Cabinet is square and the trays slide.' },
        { name: 'Build the collector', steps: ['Build the box, paint it black inside.', 'Staple on the clear cover and mesh the inlet.'], done: 'Collector sealed except at the two ends.' },
        { name: 'Join and test', steps: ['Join the collector to the cabinet at about 20°.', 'Measure the temperatures on a sunny day.'], done: 'Warm air comes out of the top vent.' },
        { name: 'Dry food', steps: ['Slice fruit 5 mm thick; weigh a sample.', 'Dry it and a matching plate outside; weigh both every day.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove the dryer is hotter and dries faster than the open air.',
        method: ['At midday, read the thermometers inside the cabinet and outside in the shade.', 'Weigh 100 g of fruit slices in the dryer and 100 g on a plate outside.', 'Weigh both at the same time each day until the weight stops changing.', 'Note the weather each day.'],
        cols: ['Day', 'Weather', 'Inside (°C)', 'Outside (°C)', 'Dryer sample (g)', 'Open-air sample (g)']
      },
      improve: ['Collector angle', 'Size of the inlet and vent', 'A second clear layer', 'Slice thickness', 'Tray spacing'],
      roles: [
        ['Researcher', 'Asks the kitchen and garden what they need, tracks the weather, and checks the food is handled safely.'],
        ['Designer', 'Checks the cutting list and plans, works out the slope, designs the trays.'],
        ['Builder', 'Leads the cabinet and collector build and every change.']
      ],
      ages: [
        ['Everyone', 'Paints, slices and weighs fruit, reads thermometers.'],
        ['Younger (8–10)', 'Painting, stapling mesh, weighing samples, the weather log.'],
        ['Older (11–13)', 'Screwing the cabinet, the angle, the drying graph and comparison.']
      ],
      stretch: 'Add a black chimney on the vent to pull the air through faster.',
      label: { title: 'Sun power, no fan', text: 'Sunlight heats the black collector. Warm air rises through the trays and out of the top, pulling fresh air in behind it and carrying the water out of the food.', tryit: 'Put your hand by the top vent and feel the warm air.' }
    },

    vgarden: {
      docNo: 'T3-SOL-04', rev: 'A', cat: 'sol', title: 'Vertical garden with drip feed',
      tagline: 'Nine bottle planters on a grille, watered by gravity from one bucket.',
      hook: 'There is little ground space for growing, and plants get watered unevenly or forgotten.',
      purposeLabel: 'The problem',
      purpose: 'LifeHub has little open ground for growing food, and pots get forgotten or watered unevenly. Growing upwards saves space, and a drip system fed by gravity from one bucket waters every plant the same amount without anyone remembering each pot. Water that drains from one planter waters the next one down, so very little is wasted.',
      outcome: 'Nine bottle planters tied in three columns to an existing grille or fence, over an area 1.2 m wide and 1.5 m tall, watered by drip lines from a 10 L bucket at the top. Each planter drains into the one below, and a tray catches the rest. It grows fast herbs and greens that are ready to pick within the month.',
      spec: [
        ['Support', 'An existing window grille, fence or railing, about 1200 × 1500 mm; nothing to build'],
        ['Planters', '9 two-litre bottles on their sides, a 200 × 70 mm window cut on top, drain holes underneath'],
        ['Rows', '3 rows, 400 mm apart'],
        ['Watering', '10 L water container with a built-in tap, hung at the top; drip line to the top planter of each column; gravity only'],
        ['Plants', 'Fast growers: methi, coriander, spinach (keerai), mint, basil'],
        ['Success test', 'One bucket fill keeps all nine planters moist for at least 2 days; at least 8 of 9 planters have healthy plants after 3 weeks; every planter stays firmly tied in wind']
      ],
      drawings: D.vgarden,
      parts: [
        [1, 'Grille or fence', '', 'An existing one, strong enough for nine planters and a full container', 'Nothing to buy'],
        [2, 'Bottle planters', 9, '2-litre bottles with a window cut on top and three 3 mm drain holes underneath', 'Collect them early'],
        [3, 'Hanging wire', 1, 'GI binding wire or strong cable ties', 'Two per bottle'],
        [4, 'Reservoir', 1, '10 L plastic water container with a tap (the kind sold for drinking water), and an S-hook', 'No drilling needed'],
        [5, 'Drip line', 1, 'Balcony drip kit: 4 mm tube, a tap connector, 3 drippers and a control valve', 'Garden or hardware shop'],
        [6, 'Drip tray', 1, 'Long plastic planter tray, about 1000 × 200 mm', 'Catches the run-off'],
        ['', 'Growing', '', 'About 25 L potting mix (coco peat and compost), seeds or seedlings', '']
      ],
      tools: ['Scissors', 'Compass point or bradawl to start the cuts and make drain holes', 'Measuring tape and marker', 'Pliers for the wire'],
      safety: [
        'Start each cut with a compass point pushed into the bottle on a table, never towards a hand; then use scissors.',
        'Cut bottle edges can be sharp: cover them with tape.',
        'Check the grille is firm before hanging anything, and tie every planter at both ends.',
        'Wash hands after handling soil and compost.'
      ],
      stages: [
        { name: 'Survey', steps: ['Ask the kitchen which herbs and greens they would use.', 'Find a spot with 4–6 hours of sun.'], done: 'Plants and spot chosen.' },
        { name: 'Lay it out', steps: ['Check the grille is firm and gets 4–6 hours of sun.', 'Mark the three columns and three rows (400 mm apart) with chalk or tape.'], done: 'Layout marked and agreed.' },
        { name: 'Planters', steps: ['Cut the windows and poke the drain holes.', 'Hang the bottles so each drains into the window of the one below.'], done: 'Nine planters hung and lined up.' },
        { name: 'Drip system', steps: ['Hang the container and fit the drip connector to its tap.', 'Run the drip line to the top planter of each column.', 'Test with plain water and adjust the drippers.'], done: 'Water reaches every planter and the tray.' },
        { name: 'Plant', steps: ['Fill with potting mix and sow or plant.', 'Label each planter.'], done: 'Every planter is sown and labelled.' },
        { name: 'Grow and adjust', steps: ['Check moisture every day.', 'Adjust the drip rate and record growth.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove one bucket waters every plant evenly, and that the plants thrive.',
        method: ['Fill the bucket and note the time.', 'Count drips per minute at each dripper.', 'Check soil moisture in every planter with a finger (dry, damp, wet) each day.', 'Note how long one fill lasts.', 'Each week, measure the tallest plant in each planter.'],
        cols: ['Date', 'Drips per minute', 'Planters dry / damp / wet', 'Hours one fill lasted', 'Tallest plant (mm)', 'What we changed']
      },
      improve: ['Drip rate', 'Number and size of drain holes', 'Potting mix', 'Which plant goes where (top dries fastest)', 'Shade for the top row'],
      roles: [
        ['Researcher', 'Asks the kitchen what to grow, looks after the plants, and checks who uses the harvest.'],
        ['Designer', 'Draws the layout and plans the drip system.'],
        ['Builder', 'Leads cutting and hanging the planters and fitting the drip line.']
      ],
      ages: [
        ['Everyone', 'Plants, waters and checks moisture.'],
        ['Younger (8–10)', 'Filling and sowing, labels, the daily moisture check, counting drips.'],
        ['Older (11–13)', 'Cutting windows, the drip system, the growth graph.']
      ],
      stretch: 'Connect it to the rainwater drum, or add a fourth row.',
      label: { title: 'Grow up', text: 'One bucket at the top waters nine planters. Gravity carries the water down, and each planter passes what it doesn’t need to the one below.', tryit: 'Count the drips, then pick a leaf of mint.' }
    }
  };
})();
