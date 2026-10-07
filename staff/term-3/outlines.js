/* Term 3 Quests — build outlines. One official outline per build: what it
   is for, the finished model's specification, a dimensioned drawing, the
   parts list, the order of work, and the test that proves it works.

   Boundaries for every build (groups mix ages 8–13):
   - Materials come from an ordinary hardware, stationery, electrical or
     medical shop (or a timber shop that cuts to size). Nothing rare.
   - Tools are ones 8–13 year olds can use with supervision. The few steps
     that need an adult are marked [adult] and kept to a minimum.
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
      tools: ['Scissors', 'Low-temperature hot glue gun', 'Awl or compass point for pivot holes (adult helps under-10s)', 'Junior hacksaw or strong scissors for skewers', 'Ruler and pencil', 'Kitchen scale (for the test)'],
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
        ['Tower', '25 mm PVC pipe about 1000 mm, standing in a bucket of sand'],
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
        [4, 'Tower', 1, '25 mm PVC pipe, about 1 m', 'Hardware shop'],
        [5, 'Base', 1, 'Bucket filled with sand', ''],
        [6, 'LED and wires', 1, 'Red LED, 1 m of thin wire, crocodile clips', ''],
        [7, 'Multimeter', 1, 'Basic digital multimeter', 'Electronics shop'],
        [8, 'Fan', 1, 'Pedestal or table fan with a guard', 'The wind source'],
        ['', 'Fixings', '', 'Low-temperature hot glue, tape, cable ties, protractor', '']
      ],
      tools: ['Scissors', 'Low-temperature hot glue gun', 'Protractor and ruler', 'Junior hacksaw for the PVC pipe (11+, pipe held in a clamp)', 'Multimeter'],
      safety: [
        'The fan keeps its guard on.',
        'Stand beside the rotor, never in front of it, while it spins.',
        'Round or tape the blade tips.',
        'Turn the fan off before touching the rotor.'
      ],
      stages: [
        { name: 'Test the generator', steps: ['Connect the motor to the multimeter.', 'Spin the shaft with your fingers and watch the voltage.'], done: 'You can make a voltage by hand.' },
        { name: 'Tower and nacelle', steps: ['Stand the pipe in the sand bucket.', 'Fix the motor in a small box on top, shaft pointing at the fan.'], done: 'Tower stands straight and steady.' },
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

    pipes: {
      docNo: 'T3-SCI-04', rev: 'B', cat: 'sci', title: 'Tuned pipe instrument',
      tagline: 'Eight PVC pipes, cut to play a real scale with a flip-flop paddle.',
      hook: 'Sound is vibration; the length of a pipe decides its note, and half the length plays one octave higher.',
      purposeLabel: 'The big idea',
      purpose: 'Sound is vibration. When you slap the open top of a pipe, the air inside vibrates, and the length of that air column decides the note: longer pipes play lower, shorter pipes higher. Halve the length and the note goes up exactly one octave. Because the rule works with numbers, you can calculate each pipe’s length before cutting — then tune it like a real instrument maker.',
      outcome: 'A free-standing instrument of eight tuned PVC pipes playing one octave of the C major scale, from C3 to C4, played by slapping the open tops with a foam paddle. Every pipe is in tune, checked with a tuner app, and the group plays a song at the showcase.',
      spec: [
        ['Pipes', '40 mm PVC pipe, 8 lengths from 645 mm down to 317 mm'],
        ['Length rule', 'Length (mm) ≈ 85 750 ÷ frequency (Hz) − 11. Cut 20 mm long, then trim to tune.'],
        ['Notes and lengths', 'C3 645 · D3 573 · E3 509 · F3 480 · G3 427 · A3 379 · B3 336 · C4 317'],
        ['Frame', 'About 1300 × 750 mm, 25 mm PVC pipe and push-fit joints, or a wooden frame'],
        ['Success test', 'Every pipe within 10 cents of its note on a tuner app; plays a recognisable tune']
      ],
      drawings: D.pipes,
      parts: [
        [1, 'Sound pipes', 2, '40 mm PVC pipe, 3 m lengths, cut to the table above', 'Hardware shop'],
        [2, 'Frame', 1, '25 mm PVC pipe about 6 m, with elbows and tees (push-fit), or wooden battens', ''],
        [3, 'Straps', 8, 'Velcro straps or cable ties with foam padding', 'Pipes must hang free'],
        [4, 'Paddles', 2, 'Old flip-flops (rubber chappals) screwed to a wooden spoon or stick', ''],
        [5, 'Note labels', 8, 'Coloured tape and stickers', 'One colour per note'],
        ['', 'Finishing', '', 'Sandpaper and a file for the cut ends', '']
      ],
      tools: ['Junior hacksaw and a mitre box or clamp (11+; younger Risers measure and mark)', 'File and sandpaper', 'Measuring tape and marker', 'Phone with a free tuner app', 'Screwdriver'],
      safety: [
        'Pipes are always clamped before sawing, never held in a hand.',
        'Sand the cut ends smooth.',
        'Slap the pipes, never blow into them after someone else.'
      ],
      stages: [
        { name: 'Calculate', steps: ['Work out each pipe’s length from the rule.', 'Add 20 mm to each for tuning.'], done: 'A cutting list for all 8 pipes.' },
        { name: 'Cut and smooth', steps: ['Measure, mark and cut each pipe.', 'File and sand the ends.'], done: 'Eight pipes, labelled.' },
        { name: 'Tune', steps: ['Slap each pipe next to the tuner app.', 'Trim 2–3 mm at a time until it’s in tune.'], done: 'All 8 pipes within 10 cents.' },
        { name: 'Frame', steps: ['Build the frame.', 'Hang the pipes with the tops level and the bottoms clear of the floor.'], done: 'Stands firm; pipes ring freely.' },
        { name: 'Play', steps: ['Learn a tune together.', 'Practise for the showcase.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove the length rule works, and get every pipe in tune.',
        method: ['Slap the pipe the same way each time, next to the tuner app.', 'Record the frequency (Hz) and how many cents sharp or flat.', 'Trim, test again, and record each trim.', 'At the end, plot length against frequency.'],
        cols: ['Pipe', 'Length (mm)', 'Target (Hz)', 'Measured (Hz)', 'Cents off', 'What we changed']
      },
      improve: ['Pipe width (32 mm vs 50 mm)', 'Capping the bottom end', 'Paddle material', 'How pipes are held', 'Adding a second octave'],
      roles: [
        ['Investigator', 'Explains vibration, pitch and octaves, and checks the length rule.'],
        ['Engineer', 'Leads cutting, trimming and the frame.'],
        ['Data keeper', 'Records lengths and frequencies and draws the length–frequency graph.']
      ],
      ages: [
        ['Everyone', 'Measures, tunes with the app, and plays.'],
        ['Younger (8–10)', 'Measuring and marking, sanding, colour labels, testing each pipe.'],
        ['Older (11–13)', 'Sawing, the length calculation, tuning in cents, the graph.']
      ],
      stretch: 'Add the sharps and flats so you can play any tune.',
      label: { title: 'Pipe music', text: 'Each pipe is cut to play one note. Longer pipes vibrate more slowly and sound lower; halve the length and the note goes up one octave.', tryit: 'Pick up a paddle and play the scale from left to right.' }
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
        ['Launch', 'Rubber cork with a tyre valve, bike foot pump with a pressure gauge'],
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
        [5, 'Cork and valve', 1, 'Rubber cork to fit the bottle neck, with a tyre valve from an old bike tube pushed through', 'Cycle shop'],
        [6, 'Launch pad', 1, 'Plank about 600 × 150 mm with two supports holding the rocket at 45°', ''],
        [7, 'Pump', 1, 'Bike foot pump with a pressure gauge', ''],
        [8, 'Water', '', 'Start at 650 ml (a third of the bottle)', 'Measured each time'],
        ['', 'Also', '', 'Strong tape, measuring tape (30 m), marker flags, safety glasses', '']
      ],
      tools: ['Scissors', 'Strong tape and low-temperature hot glue', 'Protractor', 'Hand drill to make the hole in the cork [adult]', '30 m measuring tape'],
      safety: [
        'Launch only in an open field with 50 m clear in front and nobody within 5 m of the pad.',
        'Everyone wears safety glasses.',
        'An adult does the pumping and stops at 60 psi.',
        'Nobody stands over or in front of the rocket. If it doesn’t launch, the adult lets the air out from the side.',
        'Retire any bottle that is dented or has done 10 launches.'
      ],
      stages: [
        { name: 'Launcher', steps: ['Fit the tyre valve through the cork.', 'Build the pad at 45°.'], done: 'Pad holds an empty bottle firmly at 45°.' },
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

    rainwater: {
      docNo: 'T3-SOL-01', rev: 'B', cat: 'sol', title: 'Rainwater harvester for the garden',
      tagline: 'Catch the monsoon from a LifeHub downpipe and water the garden with it.',
      hook: 'The garden is watered from the tap while rain off the roof drains away unused.',
      purposeLabel: 'The problem',
      purpose: 'The LifeHub garden is watered from the tap, while the rain that falls on our roof goes down the drain. Chennai gets most of its year’s rain in the northeast monsoon, from October to December. Every 1 mm of rain on 1 m² of roof is 1 litre of water. Catching it means free water for the garden all season.',
      outcome: 'A working system fitted to an existing downpipe — no roof work: a first-flush diverter that throws away the dirty first rain, and a 200 L drum on a raised stand with a tap and an overflow, so anyone can fill a watering can. The group measures the litres collected after real rain and compares them with its prediction.',
      spec: [
        ['Water source', 'An existing roof downpipe, cut by an adult at about 1600 mm (with LifeHub’s permission)'],
        ['Catchment', 'The roof area that drains to that downpipe — measure it from the ground, or from a plan'],
        ['Pipes', '75 mm PVC with ring-fit joints, so no glue is needed'],
        ['First-flush chamber', '75 mm pipe; length L = roof area (m²) × 1 litre ÷ 3.8 litres per metre'],
        ['Storage', '200 L drum on a 450 mm stand, tap about 500 mm above the ground'],
        ['Prediction', 'Litres = roof area (m²) × rain (mm) × 0.8'],
        ['Success test', 'After real rain: clean water in the drum, dirty water in the first flush, no leaks, and litres within 20% of the prediction']
      ],
      drawings: D.rainwater,
      parts: [
        [1, 'Existing downpipe', '', 'Cut by an adult at about 1600 mm', 'Ask permission first'],
        [2, 'Coupler', 1, '75 mm ring-fit coupler', 'Joins the old pipe to the new'],
        [3, 'Tee', 1, '75 mm tee', ''],
        [4, 'Branch to drum', 1, '75 mm PVC pipe, about 1 m, sloping down to the drum', 'At least 10 mm fall'],
        [5, 'Reducer', 1, '75 × 50 mm reducer at the top of the chamber', 'The ball seals against it'],
        [6, 'Floating ball', 1, 'Hollow plastic ball about 65 mm', 'Must float and fit the pipe'],
        [7, 'First-flush chamber', 1, '75 mm PVC pipe, length L, with 2 wall clamps', ''],
        [8, 'Chamber cap', 1, '75 mm end cap with a 3 mm drip hole, removable', 'Drains slowly between rains'],
        [9, 'Inlet screen', 1, 'Mosquito mesh over the drum inlet', 'Every opening is meshed'],
        [10, 'Drum', 1, '200 L plastic drum with lid, clean, never used for chemicals', 'Marked every 10 L'],
        [11, 'Tap', 1, '15 mm tap with tank connector and rubber washers', ''],
        [12, 'Overflow', 1, '40 mm pipe with tank connector, back into the old drain', 'So nothing floods'],
        [13, 'Stand', 1, '12 concrete blocks (400 × 200 × 200 mm) and a paving slab', 'Level and solid'],
        ['', 'Also', '', 'A straight-sided jar and ruler for a home-made rain gauge', '']
      ],
      tools: ['Hacksaw to cut the downpipe [adult]', 'Drill with hole saw for 3 holes in the drum [adult]', 'Spirit level', 'Measuring tape and marker', 'Spanner', 'Buckets and a 10 L jug (to mark the drum)'],
      safety: [
        'Nobody goes on the roof or up a ladder.',
        'Every opening has mosquito mesh and the lid stays on. No open standing water.',
        'Drum water is for plants only. Never drink it.',
        'A full drum weighs over 200 kg. Build the stand level and solid, and never move the drum when it’s full.'
      ],
      stages: [
        { name: 'Survey', steps: ['Find the downpipes: where does each one’s water go now?', 'Measure the roof area that drains to the one you choose.', 'Ask the garden team how much water they use in a week.'], done: 'We know our roof area and the garden’s needs.' },
        { name: 'Calculate and design', steps: ['Work out L and a prediction for 50 mm of rain.', 'Draw your own version of the elevation with your measurements.', 'Facilitator approves the plan.'], done: 'Signed-off drawing and materials list.' },
        { name: 'Stand and drum', steps: ['Level the ground and build the stand.', 'Fit the tap and overflow after the adult drills the holes.', 'Mark the drum every 10 L by pouring in a measured jug.'], done: 'Drum holds water with no leaks.' },
        { name: 'Pipework', steps: ['Adult cuts the downpipe.', 'Fit the coupler, tee, chamber (with the ball inside) and the branch to the drum.'], done: 'Every joint is pushed fully home and clamped.' },
        { name: 'Rain gauge', steps: ['Make a rain gauge from a straight-sided jar and a ruler.', 'Set it in the open, away from roofs and trees.'], done: 'Reads rainfall in mm.' },
        { name: 'Hose test, then rain', steps: ['Pour buckets into the downpipe from a window or run a hose: does the chamber fill first, then the drum?', 'Fix any leaks, then wait for real rain.'], done: 'Ready for the success test.' }
      ],
      test: {
        goal: 'Prove it catches clean water, and get the real litres close to the prediction.',
        method: ['After each rain, read your rain gauge.', 'Predict: roof area × rain (mm) × 0.8.', 'Read the litres from the drum marks.', 'Compare a jar of first-flush water with a jar from the drum.', 'Check every joint for drips, then open the chamber cap to empty it.'],
        cols: ['Date', 'Rain (mm)', 'Predicted (L)', 'Collected (L)', 'First flush dirty, drum clean?', 'Leaks / what we changed']
      },
      improve: ['First-flush length', 'Mesh size', 'Branch slope', 'Overflow route', 'A second drum'],
      roles: [
        ['Researcher', 'Surveys the downpipes and the garden’s water use, runs the rain gauge, and checks the tap is easy for everyone.'],
        ['Designer', 'Measures, does the calculations, draws the plan and keeps the materials list.'],
        ['Builder', 'Leads the stand, drum fittings and pipework; fixes leaks after each test.']
      ],
      ages: [
        ['Everyone', 'Helps build the stand, mark the drum and check for leaks.'],
        ['Younger (8–10)', 'The rain gauge and daily readings, marking the drum, the garden survey.'],
        ['Older (11–13)', 'Roof-area and first-flush calculations, pipe fitting, the prediction check.']
      ],
      stretch: 'Add a second drum linked at the bottom to double the storage.',
      label: { title: 'Every drop counts', text: 'Each millimetre of rain on one square metre of roof is one litre of water. The first flush throws away the dirty first rain, and the drum stores the clean water for the garden.', tryit: 'Fill a watering can from the tap and read the drum marks.' }
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
        [1, 'Legs', 4, 'Bamboo poles about 2200 mm, 40–50 mm thick', 'Bamboo or pandal supplier'],
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
      tools: ['Junior hacksaw for bamboo (11+, pole held by a partner or clamp)', 'Sandpaper', 'Measuring tape and chalk', 'Scissors for rope', 'Mallet for pegs'],
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
        { name: 'Cut and prepare', steps: ['Measure and cut the poles.', 'Sand and tape all the ends.'], done: 'All poles ready and labelled.' },
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
        ['Older (11–13)', 'Measuring and cutting, the shear lashings, the load and sway tests.']
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
        ['Material', '9 mm plywood panels, cut to size by the timber shop from the cutting list'],
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
      tools: ['Screwdriver (or a cordless screwdriver with an adult)', 'Hand drill for pilot holes', 'Staple gun', 'Junior hacksaw for battens (11+)', 'Paintbrush', 'Measuring tape and try square', 'Kitchen scale (for the test)'],
      safety: [
        'The timber shop does all the panel cutting.',
        'Paint outdoors with lead-free paint, and let it dry fully before food goes in.',
        'Wash hands and trays before handling food.',
        'A facilitator decides whether dried food is safe to eat, and it is labelled with the date.',
        'The collector cover gets hot; open the cabinet from the back.'
      ],
      stages: [
        { name: 'Survey', steps: ['Ask the kitchen and garden what goes to waste and what they would like dried.', 'Find a sunny spot facing south.'], done: 'We know what to dry and where.' },
        { name: 'Order panels', steps: ['Check the cutting list and take it to the timber shop.'], done: 'All panels cut and labelled.' },
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
      tagline: 'Nine planters on a frame, watered by gravity from one bucket.',
      hook: 'There is little ground space for growing, and plants get watered unevenly or forgotten.',
      purposeLabel: 'The problem',
      purpose: 'LifeHub has little open ground for growing food, and pots get forgotten or watered unevenly. Growing upwards saves space, and a drip system fed by gravity from one bucket waters every plant the same amount without anyone remembering each pot. Water that drains from one planter waters the next one down, so very little is wasted.',
      outcome: 'A free-standing frame 1.2 m wide and 1.5 m tall holding nine bottle planters in three columns, watered by drip lines from a 10 L bucket at the top. Each planter drains into the one below, and a tray catches the rest. It grows fast herbs and greens that are ready to pick within the month.',
      spec: [
        ['Frame', '1200 × 1500 mm, 25 mm PVC pipe with tees and elbows, on two wide feet'],
        ['Planters', '9 two-litre bottles on their sides, a 200 × 70 mm window cut on top, drain holes underneath'],
        ['Rows', '3 rows, 400 mm apart'],
        ['Watering', '10 L bucket with a tap, drip line to the top planter of each column; gravity only'],
        ['Plants', 'Fast growers: methi, coriander, spinach (keerai), mint, basil'],
        ['Success test', 'One bucket fill keeps all nine planters moist for at least 2 days; at least 8 of 9 planters have healthy plants after 3 weeks; the frame doesn’t tip when pushed at the top']
      ],
      drawings: D.vgarden,
      parts: [
        [1, 'Frame', 1, '25 mm PVC pipe, about 12 m in total, with 8 tees, 2 elbows and 4 end caps', 'Cutting list in the stages'],
        [2, 'Bottle planters', 9, '2-litre bottles with a window cut on top and three 3 mm drain holes underneath', 'Collect them early'],
        [3, 'Hanging wire', 1, 'GI binding wire or strong cable ties', 'Two per bottle'],
        [4, 'Reservoir', 1, '10 L bucket with lid and a small tap or drip connector in the bottom', ''],
        [5, 'Drip line', 1, 'Balcony drip kit: 4 mm tube, 3 drippers, a control valve', 'Garden or hardware shop'],
        [6, 'Drip tray', 1, 'Long plastic planter tray, about 1000 × 200 mm', 'Catches the run-off'],
        ['', 'Growing', '', 'About 25 L potting mix (coco peat and compost), seeds or seedlings', '']
      ],
      tools: ['Scissors', 'Craft knife for the windows (11+, with a facilitator)', 'Hand drill for drain and bucket holes [adult for the bucket]', 'Junior hacksaw for PVC (11+, pipe in a clamp)', 'Measuring tape and marker', 'Screwdriver'],
      safety: [
        'Craft knives only for Risers 11 and over, cutting away from the body, with a facilitator.',
        'Cut bottle edges can be sharp: cover them with tape.',
        'The frame must not tip: test it with a push before hanging the planters, and add weight to the feet if needed.',
        'Wash hands after handling soil and compost.'
      ],
      stages: [
        { name: 'Survey', steps: ['Ask the kitchen which herbs and greens they would use.', 'Find a spot with 4–6 hours of sun.'], done: 'Plants and spot chosen.' },
        { name: 'Frame', steps: ['Cut the pipe: 2 uprights 1450, 4 rails 1150, 4 feet 300 mm.', 'Dry-fit the frame, then fix each joint with a small screw.'], done: 'Frame stands square and passes the push test.' },
        { name: 'Planters', steps: ['Cut the windows and drill the drain holes.', 'Hang the bottles so each drains into the window of the one below.'], done: 'Nine planters hung and lined up.' },
        { name: 'Drip system', steps: ['Fit the connector to the bucket.', 'Run the drip line to the top planter of each column.', 'Test with plain water and adjust the drippers.'], done: 'Water reaches every planter and the tray.' },
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
        ['Designer', 'Draws the plan and the cutting list, and plans the drip system.'],
        ['Builder', 'Leads the frame, planters and drip fitting.']
      ],
      ages: [
        ['Everyone', 'Plants, waters and checks moisture.'],
        ['Younger (8–10)', 'Filling and sowing, labels, the daily moisture check, counting drips.'],
        ['Older (11–13)', 'Cutting pipe and windows, the drip system, the growth graph.']
      ],
      stretch: 'Connect it to the rainwater drum, or add a fourth row.',
      label: { title: 'Grow up', text: 'One bucket at the top waters nine planters. Gravity carries the water down, and each planter passes what it doesn’t need to the one below.', tryit: 'Count the drips, then pick a leaf of mint.' }
    }
  };
})();
