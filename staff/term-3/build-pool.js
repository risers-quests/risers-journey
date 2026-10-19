/* Term 3 Quests — the build pool: 50 projects the groups choose from, in
   two kinds, "Science in action" (sci) and "Make it for LifeHub" (sol).
   Each one has a name, what it is, the idea or reason behind it (hook),
   what the group ends up with (make), the science concept or skill they
   learn (learn), the learning outcome (lo: what they can show or explain at
   the end) and a level (1 easier, 2 medium, 3 harder). Risers never see the
   level: each group only sees the levels set for it in quest-data.js.

   plan: one entry per week ({ t: the week's title, j: the jobs }), so a
   level 1 project has 2 weeks, level 2 has 3 and level 3 has 4 (see
   quest-data.js WEEKS_BY_LEVEL). j has one row per role (roles in
   quest-data.js ROLES), and each row is that role's job for Monday
   (together), Tuesday (on their own) and Wednesday (together). Every role
   has a hands-on job every session, about the same size, so the work is
   shared fairly whatever their age, and no week is spent waiting.
   Written in very simple English so every Riser can read it. */
window.T3_POOL = [
  /* ---------- Science in action ---------- */
  { id: 'sci-slime', cat: 'sci', level: 1, title: 'Slime lab',
    what: 'You mix glue, water and a few other things to make slime. Then you change the recipe, one thing at a time, to make the stretchiest, bounciest or gooiest slime ever.',
    hook: 'Slime is a liquid and a solid at the same time. A tiny change to the recipe changes everything.',
    make: 'Your own slime recipes, a stretch-and-bounce test chart, and a slime stall where friends try them.',
    learn: 'Polymers and fair testing',
    lo: 'We can explain how glue turns into slime, and show from a fair test which recipe stretches the most.',
    plan: [
      { t: 'Slime science and recipes', j: [
        ['Find out how glue turns into slime', 'Make a “how slime works” sheet', 'Choose four recipe changes and predict each'],
        ['Set up the slime station and make the basic recipe', 'Mix the first two recipe changes', 'Mix the other two changes'],
        ['Plan the stretch and bounce tests', 'Make the results table', 'Test every batch and fill in the table'] ] },
      { t: 'Best slime and slime stall', j: [
        ['Find the winning recipe and explain why it works', 'Make the slime science poster', 'Lead the talk at the stall'],
        ['Make the winning recipe and write the recipe card', 'Make 20 pots of slime and label them', 'Set up and run the stall'],
        ['Draw the stretch and bounce bar charts', 'Make the voting sheet', 'Run the vote and announce the favourite'] ] }
    ] },
  { id: 'sci-icecream', cat: 'sci', level: 1, title: 'Ice cream in a bag',
    what: 'You put milk, sugar and flavour in a small bag, and that bag inside a big bag of ice and salt. Shake it hard for ten minutes, and you have real ice cream.',
    hook: 'Salt makes ice colder than ice on its own. That is how ice cream can freeze in your hands.',
    make: 'Ice cream for the whole class, and a chart of how much colder the ice gets with salt.',
    learn: 'Freezing and melting points',
    lo: 'We can explain why salt makes ice colder, and show it with thermometer readings.',
    plan: [
      { t: 'Cold science', j: [
        ['Find out why salt makes ice colder', 'Plan a fair test of four salt amounts', 'Write a prediction for each'],
        ['Make the first bag of ice cream', 'Write each step on a recipe card', 'Make bags with all four salt amounts'],
        ['Measure plain and salty ice every minute', 'Draw both on a line graph', 'Time how long each salt amount takes'] ] },
      { t: 'Ice cream day', j: [
        ['Write the talk on why salt freezes ice cream', 'Practise the talk', 'Lead the talk on ice cream day'],
        ['Design and build a shaker tin', 'Test the tin and improve the lid', 'Make ice cream for the whole class'],
        ['Chart all four salt results', 'Make a flavour survey', 'Run the survey and show the favourite'] ] }
    ] },
  { id: 'sci-balloon', cat: 'sci', level: 1, title: 'Balloon car race',
    what: 'You build a car from a bottle, straws and bottle-cap wheels. A balloon blows air out of the back, and the car zooms forward. Then you race.',
    hook: 'When air rushes out one way, the car shoots the other way.',
    make: 'A balloon-powered racing car, a race track, and a results board for the big race day.',
    learn: 'Action and reaction (Newton’s third law)',
    lo: 'We can explain why the air pushes the car forward, and show which changes make our car go further.',
    plan: [
      { t: 'Build and test', j: [
        ['Find out why rushing air pushes a car', 'Choose three changes and predict each', 'Check the tests are fair'],
        ['Build the first car from a bottle, straws and caps', 'Build cars with bigger wheels and a bigger balloon', 'Build a car with a longer straw'],
        ['Mark a 5-metre track and make the results table', 'Measure the first car three times', 'Test the three changes and work out averages'] ] },
      { t: 'Best car and race day', j: [
        ['Find which change helped most and why', 'Write the race rules and science talk', 'Explain the science before the races'],
        ['Build the best car, lighter and straighter', 'Build the race track and finish banner', 'Get every car race-ready'],
        ['Chart all the results', 'Make the results board and plan the heats', 'Run the heats and the final'] ] }
    ] },
  { id: 'sci-planes', cat: 'sci', level: 1, title: 'Paper plane championship',
    what: 'You fold and test lots of paper planes, changing the wings, the nose and the weight. Then you hold a championship for the longest flight and the longest time in the air.',
    hook: 'Air pushes up on the wings and pushes back on the plane. Small changes make a big difference.',
    make: 'Your best planes, a test log of every flight, and a paper plane championship with a winners’ board.',
    learn: 'Lift, drag and fair testing',
    lo: 'We can explain lift and drag, and show from our flight log which wing shape flies furthest.',
    plan: [
      { t: 'Plane science and tests', j: [
        ['Find out about lift, drag and gravity', 'Choose the wing and nose changes to test', 'Write predictions'],
        ['Fold three plane designs', 'Fold big, small and curved wings', 'Fold planes with paper-clip noses'],
        ['Set up the flight line and flight log', 'Fly every design three times', 'Record distance and time for each'] ] },
      { t: 'Championship', j: [
        ['Find the champion design and explain why', 'Write the championship rules', 'Lead the opening talk on lift and drag'],
        ['Fold the best design for every player', 'Set up the flying course', 'Help players launch'],
        ['Chart every design’s best flight', 'Make the winners’ board', 'Run the championship and post the results'] ] }
    ] },
  { id: 'sci-spy', cat: 'sci', level: 1, title: 'Spy science kit',
    what: 'You become science spies. You write secret messages in lemon juice that only show up with heat. You also dust for fingerprints and solve a pretend mystery at LifeHub.',
    hook: 'Some liquids change colour when heated or mixed. Everyone’s fingerprints are different.',
    make: 'A spy kit with invisible ink, a fingerprint set, and a mystery for the class to solve.',
    learn: 'Chemical changes and fingerprint patterns',
    lo: 'We can explain why lemon-juice writing shows up when heated, and sort fingerprints into loops, whorls and arches.',
    plan: [
      { t: 'Ink and prints', j: [
        ['Find out why lemon juice shows up when heated', 'Learn the three fingerprint patterns', 'Make a spy file of both'],
        ['Make four invisible inks', 'Make an ink pad and dusting powder', 'Test lifting prints with tape'],
        ['Make the ink results table', 'Take everyone’s prints', 'Sort and chart loops, whorls and arches'] ] },
      { t: 'The mystery', j: [
        ['Write the mystery story and six clues', 'Test the mystery on a friend', 'Lead the mystery and explain the science'],
        ['Make the clue cards with ink and prints', 'Build the crime scene props', 'Set up and run the crime scene'],
        ['Make the timing sheet', 'Note what confused the tester and fix it', 'Record which teams solved it and how fast'] ] }
    ] },
  { id: 'sci-junkband', cat: 'sci', level: 1, title: 'Junkyard band',
    what: 'You make real instruments from things at home: a rubber-band guitar, straw flutes and a water-bottle xylophone. You tune them, practise a song and play a concert.',
    hook: 'Every sound is a shake. Long, short, tight or loose changes the note.',
    make: 'A set of home-made instruments that play real notes, and a band concert for families.',
    learn: 'Sound, vibration and pitch',
    lo: 'We can show that shorter, tighter or smaller things make higher notes, and explain that sound is a vibration.',
    plan: [
      { t: 'How sound works', j: [
        ['Find out how a vibration makes sound', 'Find out why longer and tighter changes the note', 'Explain it with a ruler and rice on a drum'],
        ['Build the box guitar', 'Build a straw flute', 'Build a water-bottle xylophone'],
        ['Test which band gives the highest note', 'Tune each instrument with a tuner app', 'Mark the notes on each one'] ] },
      { t: 'Song and concert', j: [
        ['Choose a song and work out its notes', 'Write the talk on each instrument', 'Give the talk at the concert'],
        ['Build a drum and make instruments louder', 'Get every instrument stage-ready', 'Set up the stage'],
        ['Write the song as a number chart', 'Lead the rehearsal', 'Count the band in at the concert'] ] }
    ] },
  { id: 'sci-aircannon', cat: 'sci', level: 1, title: 'Air cannon battle',
    what: 'You make a box with a round hole. Tap the back, and a ring of air shoots out. It can knock over cups from far away. Then you hold a target battle.',
    hook: 'Air is real stuff. It takes up space and can push things.',
    make: 'Two air cannons, a cup-tower target game, and a scoreboard.',
    learn: 'Air pressure and vortex rings',
    lo: 'We can show that air can push things, and explain how a ring of air travels and knocks over cups.',
    plan: [
      { t: 'Cannon and hole tests', j: [
        ['Find out how a ring of air travels', 'Choose three hole sizes and predict', 'Check the test is fair'],
        ['Build the first air cannon from a box', 'Build cannons with small, medium and big holes', 'Fix air leaks'],
        ['Set up cup targets and the hits table', 'Test each hole ten times', 'Work out the averages'] ] },
      { t: 'Battle day', j: [
        ['Explain why the best hole works best', 'Write the battle rules and poster', 'Explain the poster before the battle'],
        ['Build two copies of the best cannon', 'Build the cup towers', 'Set up the battle field'],
        ['Chart all the results', 'Make the scoreboard', 'Keep score and announce the winners'] ] }
    ] },
  { id: 'sci-rocket', cat: 'sci', level: 2, title: 'Water rocket launch',
    what: 'A big soft-drink bottle with some water inside. You pump in air until it blasts off high into the sky. You change the fins, nose and water to fly higher.',
    hook: 'When the water pushes down, the rocket goes up.',
    make: 'Your own water rockets, a launch pad, and a launch day with heights measured for every flight.',
    learn: 'Action and reaction (Newton’s third law)',
    lo: 'We can explain why pushing water down sends the rocket up, and show from our measurements which amount of water flies highest.',
    plan: [
      { t: 'Rocket science', j: [
        ['Find out why pushing water down sends a rocket up', 'Plan a test of three water amounts', 'Write predictions'],
        ['Build the launch pad with a facilitator', 'Build the first rocket with fins and a nose', 'Build the second rocket'],
        ['Make an angle-finder to measure height', 'Make the launch log', 'Launch each rocket and record heights'] ] },
      { t: 'Fins and parachutes', j: [
        ['Find out how fins and parachutes work', 'Plan the fin test', 'Explain the best design so far'],
        ['Build three-fin and four-fin rockets', 'Make a parachute', 'Fit it to the best rocket'],
        ['Launch the fin rockets', 'Time the parachute falls', 'Chart height for every rocket'] ] },
      { t: 'Launch day', j: [
        ['Write the launch talk and safety briefing', 'Practise them', 'Lead the talk and the briefing'],
        ['Get every rocket ready', 'Make spare rockets', 'Set up the launch area'],
        ['Make the launch board', 'Train a helper to measure', 'Measure and post every height'] ] }
    ] },
  { id: 'sci-coaster', cat: 'sci', level: 2, title: 'Marble roller coaster',
    what: 'A roller coaster for marbles made from paper tubes and card on a wall or a big board, with drops, hills, loops and a finish line.',
    hook: 'A marble high up has stored energy. As it drops, that turns into speed for the loops.',
    make: 'A working marble roller coaster with at least one loop, and a timing chart for each run.',
    learn: 'Stored energy and motion',
    lo: 'We can explain how height turns into speed, and show why the first drop must be higher than the loop.',
    plan: [
      { t: 'Drops and plan', j: [
        ['Find out how height turns into speed', 'Plan the drops, hills and loop', 'Draw the full plan with heights'],
        ['Build a test track with three drop heights', 'Build the first drop', 'Build the first hill'],
        ['Time each drop three times', 'Find the fastest drop', 'Measure and mark heights on the plan'] ] },
      { t: 'The loop', j: [
        ['Find out why the drop must be higher than the loop', 'Study where marbles fall off', 'Tell the group the fixes'],
        ['Build the loop', 'Change it until marbles get round', 'Join the whole coaster'],
        ['Run 10 marbles through the loop', 'Record where they fall off', 'Chart the results'] ] },
      { t: 'Show day', j: [
        ['Write the coaster tour talk', 'Practise it', 'Lead the tour and the science talk'],
        ['Fix weak parts and build the finish', 'Add signs and decorations', 'Reset the coaster between runs'],
        ['Time 10 full runs', 'Make the timing board', 'Run the timing board on show day'] ] }
    ] },
  { id: 'sci-claw', cat: 'sci', level: 2, title: 'Arcade claw machine',
    what: 'Like the claw game at a fair, but it runs on water. Two syringes joined by a tube work the arm and the claw, so you can grab prizes.',
    hook: 'Water can not be squashed, so a push at one end comes out at the other end.',
    make: 'A claw machine in a box that picks up small prizes, for everyone to play.',
    learn: 'Hydraulics',
    lo: 'We can explain why a push on one syringe moves the other, and show that a small syringe moves further while a big one pushes harder.',
    plan: [
      { t: 'Water power', j: [
        ['Find out how water passes a push along a tube', 'Plan how the arm moves', 'Draw a labelled plan'],
        ['Join syringes with a tube and test', 'Build the base', 'Build the arm with two syringe controls'],
        ['Test small and big syringes', 'Measure the arm’s moves', 'Record them in a table'] ] },
      { t: 'The claw and box', j: [
        ['Plan two claw shapes', 'Write the how-it-works sign', 'Read it to the group for feedback'],
        ['Build both claws and fit the better one', 'Build the game box', 'Fit the arm and prize chute'],
        ['Test each claw 10 times', 'Chart both claws', 'Test the whole game and set a time limit'] ] },
      { t: 'Arcade day', j: [
        ['Write the talk on hydraulics', 'Practise the talk', 'Lead the talk at the arcade'],
        ['Fill the box with prizes', 'Decorate the box', 'Keep the game working on the day'],
        ['Make the high-score board', 'Make the player list', 'Run the game and count the players'] ] }
    ] },
  { id: 'sci-egg', cat: 'sci', level: 2, title: 'Egg-stronaut lander',
    what: 'You build a space pod for a raw egg “astronaut” and drop it from higher and higher places. The egg must land without cracking.',
    hook: 'If you slow a fall down and soften the landing, the egg survives.',
    make: 'A lander with a parachute and soft padding that keeps an egg safe from a big drop.',
    learn: 'Gravity and air resistance',
    lo: 'We can explain how gravity and air push on a falling pod, and show how a parachute and padding make the landing softer.',
    plan: [
      { t: 'Falling science', j: [
        ['Find out how gravity and air push on falling things', 'Plan three lander ideas', 'Write a prediction for each'],
        ['Build lander 1', 'Build lander 2', 'Build lander 3'],
        ['Plan drop heights and the results table', 'Drop each lander three times', 'Record egg or no egg'] ] },
      { t: 'The best lander', j: [
        ['Find which idea worked best and why', 'Plan the big drop with a facilitator', 'Write the safety rules'],
        ['Improve the best lander', 'Build a spare', 'Test both from higher up'],
        ['Time falls with and without a parachute', 'Chart the results', 'Test from the highest safe spot'] ] },
      { t: 'Big drop', j: [
        ['Write the big-drop talk', 'Practise it', 'Lead the talk on the day'],
        ['Get the final lander ready', 'Get the spare ready', 'Repack the lander between drops'],
        ['Make the results board', 'Plan the filming', 'Record every drop and film the best'] ] }
    ] },
  { id: 'sci-catapult', cat: 'sci', level: 2, title: 'Castle catapult battle',
    what: 'You build a castle catapult where a heavy weight drops and flings a ball. Then two teams fire soft balls at cardboard castles.',
    hook: 'A falling weight can throw a ball much further than your arm.',
    make: 'A table-top catapult, cardboard castles, and a castle battle with distances measured.',
    learn: 'Levers and stored energy',
    lo: 'We can point to the pivot, the load and the effort on our catapult, and show that a longer arm throws further.',
    plan: [
      { t: 'Lever science', j: [
        ['Find out how a lever throws', 'Choose what to test: arm, weight or sling', 'Write predictions'],
        ['Build the frame', 'Build the throwing arm', 'Join them and test'],
        ['Plan fair throws and the results table', 'Test short, medium and long arms', 'Record all the throws'] ] },
      { t: 'Weight, sling and castles', j: [
        ['Explain why a longer arm throws further', 'Plan the castles and targets', 'Share the plan'],
        ['Build the weight box and sling', 'Build castle 1', 'Build castle 2'],
        ['Test light, medium and heavy weights', 'Chart all the results', 'Mark targets and run practice rounds'] ] },
      { t: 'Castle battle', j: [
        ['Write the battle rules', 'Practise explaining them', 'Lead the talk before the battle'],
        ['Make the catapult aim straight', 'Set up castles and make spare balls', 'Fix damage between rounds'],
        ['Make the scoreboard', 'Train a helper', 'Keep score and announce the winners'] ] }
    ] },
  { id: 'sci-buzzer', cat: 'sci', level: 2, title: 'Steady-hand buzzer game',
    what: 'A twisty wire course and a loop on a handle. Move the loop along without touching the wire. If you touch it, a buzzer goes off.',
    hook: 'When metal touches metal, the circuit closes and electricity flows.',
    make: 'A steady-hand game with easy, medium and hard courses, and a high-score board.',
    learn: 'Electric circuits',
    lo: 'We can build a closed circuit with a buzzer, and explain why touching the wire makes it buzz.',
    plan: [
      { t: 'Circuits', j: [
        ['Find out how a circuit works', 'Draw a circuit diagram', 'Plan the three courses on paper'],
        ['Build a circuit with a battery and a buzzer', 'Bend the easy course', 'Wire it to the buzzer'],
        ['Test 10 materials to see which conduct', 'Make the timing sheet', 'Time five players on the easy course'] ] },
      { t: 'Medium and hard', j: [
        ['Explain why the buzzer sounds when the loop touches', 'Write it as a sign', 'Plan start lights and a better handle'],
        ['Bend the medium course', 'Bend the hard course', 'Add start lights and a comfy handle'],
        ['Time players on medium and hard', 'Set fair rules', 'Make the high-score board'] ] },
      { t: 'Competition', j: [
        ['Write the talk on how the game works', 'Practise it', 'Lead the talk'],
        ['Fix loose wires and decorate', 'Set up the game', 'Keep it working during the competition'],
        ['Make the player list', 'Run the competition', 'Record every score'] ] }
    ] },
  { id: 'sci-lightcards', cat: 'sci', level: 2, title: 'Light-up cards and posters',
    what: 'Greeting cards and posters with little lights that switch on. You make the circuits with copper tape, a coin battery and LEDs on paper.',
    hook: 'Electricity flows round a loop. Break the loop, and the light goes out.',
    make: 'Light-up cards for families, and a glowing poster for the classroom.',
    learn: 'Electric circuits and switches',
    lo: 'We can build a paper circuit with a switch, and explain why the LED lights only when the loop is closed.',
    plan: [
      { t: 'First circuits', j: [
        ['Find out how an LED circuit works', 'Plan three card designs with switches', 'Choose the best with the group'],
        ['Build a paper circuit with copper tape', 'Build two more', 'Make two light-up cards'],
        ['Test which way round LEDs light', 'Write the rule', 'Make a check list for each card'] ] },
      { t: 'All the cards', j: [
        ['Write a how-to guide for making a card', 'Plan the poster with five lights', 'Draw the poster circuit'],
        ['Make cards for half the families', 'Make the rest', 'Build the poster circuit'],
        ['Check every card', 'Fix the broken ones', 'Test how long the poster battery lasts'] ] },
      { t: 'Light show', j: [
        ['Write the how-it-works labels', 'Practise the talk', 'Lead the talk'],
        ['Add the poster switch and hang it', 'Wrap the cards', 'Set up the light show'],
        ['Make the circuit diagram for visitors', 'Chart the battery test', 'Explain it to visitors'] ] }
    ] },
  { id: 'sci-quake', cat: 'sci', level: 2, title: 'Earthquake challenge',
    what: 'A board that you shake to make a pretend earthquake. You build towers on it and test which ones stay up. Then you make your tower stronger and try again.',
    hook: 'Some buildings fall in a shake. Some stay up. The shape makes the difference.',
    make: 'A shaking board and a city of towers that survive the biggest shake.',
    learn: 'Centre of gravity and bracing',
    lo: 'We can show that a low, wide tower with cross braces stays up longer, and explain why.',
    plan: [
      { t: 'Earthquake science', j: [
        ['Find out why buildings fall in earthquakes', 'Choose three tower shapes', 'Write predictions'],
        ['Build the shake board', 'Build tower 1', 'Build towers 2 and 3'],
        ['Plan a fair shake and the results table', 'Shake each tower three times', 'Record how long each lasts'] ] },
      { t: 'Stronger towers and city', j: [
        ['Explain why wide bases and braces help', 'Plan the city layout', 'Share the plan'],
        ['Add braces to all three towers', 'Build the city buildings', 'Join the city on the board'],
        ['Shake each tower again', 'Chart before and after', 'Test every city building'] ] },
      { t: 'Challenge day', j: [
        ['Write the challenge talk', 'Practise it', 'Lead the talk'],
        ['Fix weak buildings', 'Make spare parts', 'Rebuild between shakes'],
        ['Make the survivors board', 'Run the final shake', 'Record the survivors'] ] }
    ] },
  { id: 'sci-kites', cat: 'sci', level: 2, title: 'Kite festival',
    what: 'You make kites with paper, sticks and string, and try different shapes and tails. Then you hold a kite festival.',
    hook: 'The wind pushes the kite up. The string holds it in place.',
    make: 'Three tested kites, and a kite festival with prizes for highest and steadiest.',
    learn: 'Lift and drag',
    lo: 'We can explain lift and drag, and show how changing the tail or string point makes a kite fly steadier.',
    plan: [
      { t: 'Kite science', j: [
        ['Find out about lift and drag', 'Plan fair tests of tails and string points', 'Write predictions'],
        ['Build the diamond kite', 'Build the box kite', 'Make three tails'],
        ['Plan how to test height and steadiness', 'Make the flight log', 'Fly both kites three times'] ] },
      { t: 'Tails and strings', j: [
        ['Write what made each kite dive or spin', 'Plan the festival and prizes', 'Write the safety rules'],
        ['Fit tails and string points for testing', 'Make two kites for visitors', 'Make three more'],
        ['Test the tails and string points', 'Chart which was steadiest', 'Make the judging sheet'] ] },
      { t: 'Kite festival', j: [
        ['Write the festival talk', 'Practise it', 'Lead the talk'],
        ['Get all the kites ready', 'Fix kites on the day', 'Help visitors launch'],
        ['Train two judges', 'Judge the prizes', 'Record the winners'] ] }
    ] },
  { id: 'sci-hand', cat: 'sci', level: 2, title: 'Robot hand',
    what: 'A big cardboard hand. Strings run along each finger. Pull a string, and that finger bends. Pull them all, and the hand grabs things.',
    hook: 'Your fingers bend because strings inside your arm pull on them.',
    make: 'A robot hand that can pick up a cup and wave hello.',
    learn: 'Tendons and joints',
    lo: 'We can explain how tendons pull our fingers, and name the parts of the hand our model copies.',
    plan: [
      { t: 'Hand science', j: [
        ['Find out how tendons move fingers', 'Plan how each string runs', 'Draw a labelled plan'],
        ['Draw round a hand and cut the fingers', 'Build two fingers with straws and strings', 'Build the other two'],
        ['Measure five real hands', 'Choose the sizes to use', 'Test how far each finger curls'] ] },
      { t: 'Thumb and grip', j: [
        ['Label which part of our hand each piece copies', 'Plan a stronger grip', 'Write predictions'],
        ['Build the thumb and wrist', 'Join the hand together', 'Add rubber pads and stronger strings'],
        ['Choose five objects and test grips', 'Count pick-ups out of 10', 'Count again after the changes'] ] },
      { t: 'Robot show', j: [
        ['Write the robot hand talk', 'Practise it', 'Lead the talk'],
        ['Make the hand wave hello', 'Fix weak joints', 'Keep it working at the show'],
        ['Chart before and after', 'Make the challenge score sheet', 'Run the pick-up challenge'] ] }
    ] },
  { id: 'sci-scribble', cat: 'sci', level: 2, title: 'Scribble bots',
    what: 'Small robots made from a cup, a tiny motor, a battery and felt pens for legs. The motor makes them shake, and they draw wild patterns as they move.',
    hook: 'A wobbly motor makes the whole robot shake and move.',
    make: 'A team of scribble bots and a giant robot artwork on the wall.',
    learn: 'Motors, vibration and balance',
    lo: 'We can build a circuit with a motor, and show how moving the weight changes the way the bot moves.',
    plan: [
      { t: 'Motor science', j: [
        ['Find out how a wobbly motor makes things move', 'Plan three changes: weight, pen angle, cup size', 'Write predictions'],
        ['Build the first bot', 'Build a bot with a weight', 'Build bots with angled pens and a bigger cup'],
        ['Plan how to record movement', 'Test each bot', 'Compare the drawings'] ] },
      { t: 'Control and artwork plan', j: [
        ['Explain why moving the weight changes the path', 'Plan the giant artwork', 'Plan the colours'],
        ['Add a switch', 'Add a way to steer', 'Build two more bots'],
        ['Test each bot three times', 'Mark the paper', 'Plan where each bot starts'] ] },
      { t: 'Gallery', j: [
        ['Write the talk on how scribble bots work', 'Practise it', 'Lead the talk'],
        ['Run the bots to make the artwork', 'Keep the bots working', 'Hang the artwork'],
        ['Make the gallery labels', 'Set up the gallery', 'Show visitors round'] ] }
    ] },
  { id: 'sci-breakfast', cat: 'sci', level: 3, title: 'Breakfast machine',
    what: 'A long chain of tricks. A marble rolls and hits a block, the block falls and pushes a car, and so on. At the end, the machine pours cereal into a bowl.',
    hook: 'One small push can pass from thing to thing, all the way down the line.',
    make: 'A machine with 8 steps that pours a bowl of cereal by itself, filmed for families to watch.',
    learn: 'Chain reactions and simple machines',
    lo: 'We can point to each simple machine in our chain (ramp, lever, pulley, wheel) and explain how it passes the push to the next step.',
    plan: [
      { t: 'Simple machines', j: [
        ['Find out about ramps, levers, pulleys and wheels', 'Plan all 8 steps on a big sketch', 'Write what each step pushes'],
        ['Plan steps 1 to 3', 'Build steps 1 to 3', 'Test them'],
        ['Make the test table', 'Test steps 1 to 3 five times', 'Record which fail'] ] },
      { t: 'Steps 4 to 8', j: [
        ['Study the failing steps and work out why', 'Check each step passes the push on', 'Tell the group the fixes'],
        ['Build steps 4 and 5', 'Build steps 6 to 8', 'Join them to steps 1 to 3'],
        ['Test the new steps five times', 'Chart which steps fail most', 'Record what went wrong'] ] },
      { t: 'Cereal!', j: [
        ['Write a label for every simple machine', 'Make the labels', 'Fix them to the machine'],
        ['Build the cereal pour', 'Fix the weak steps', 'Run it start to finish'],
        ['Run the full machine five times', 'Count clean runs', 'Pick the best run'] ] },
      { t: 'Show day', j: [
        ['Write the talk naming every machine', 'Practise it', 'Lead the talk'],
        ['Get the machine ready', 'Reset it between runs', 'Fix anything that breaks'],
        ['Plan the filming', 'Film the best run', 'Record every run on the day'] ] }
    ] },
  { id: 'sci-hovercraft', cat: 'sci', level: 3, title: 'Ride-on hovercraft',
    what: 'A round wooden board with a plastic skirt underneath and a leaf blower on top. Air fills the skirt and lifts the board, so a person can float across the floor.',
    hook: 'A cushion of air under the board takes away almost all the rubbing on the floor.',
    make: 'A hovercraft that one of you can sit on and glide across the hall.',
    learn: 'Air pressure and friction',
    lo: 'We can explain how trapped air lifts the hovercraft, and show how much easier it is to push with the air on.',
    plan: [
      { t: 'Air cushions', j: [
        ['Find out how trapped air lifts a hovercraft', 'Plan the skirt and air hole with a facilitator', 'Draw the plan'],
        ['Build a mini hovercraft from a CD and a balloon', 'Mark the board with a facilitator', 'Cut the board with a facilitator'],
        ['Test the mini one on three floors', 'Record the results', 'Work out where the air hole goes'] ] },
      { t: 'The skirt', j: [
        ['Explain why the skirt traps air', 'Plan the first safe test', 'Write the safety checks'],
        ['Cut the plastic skirt', 'Fix it to the board', 'Seal it with tape'],
        ['Plan the leak test', 'Test the skirt with a fan', 'Mark the leaks'] ] },
      { t: 'First lift', j: [
        ['Run the safety checks', 'Write the rider checklist', 'Teach it to the group'],
        ['Fit the leaf blower with a facilitator', 'Fix the leaks', 'Add the seat and handles'],
        ['Measure the push without air', 'Measure the push with air', 'Test each rider and record glides'] ] },
      { t: 'Ride day', j: [
        ['Write the safety talk', 'Practise the demo', 'Lead the talk and the demo'],
        ['Get the hovercraft ready', 'Run it safely', 'Fix problems on the day'],
        ['Make the ride list', 'Run the ride list', 'Record every glide'] ] }
    ] },
  { id: 'sci-pinball', cat: 'sci', level: 3, title: 'Cardboard pinball',
    what: 'A table game. You shoot a ball up a slope. It bounces off bumpers and rolls back down, and you hit it back up with two flippers.',
    hook: 'Slopes, bumps and springs change where a ball goes and how fast.',
    make: 'A pinball table with a ball shooter, flippers, bumpers and a score board.',
    learn: 'Angles of reflection and spring energy',
    lo: 'We can show that a ball bounces off at the same angle it hits, and explain how a spring stores and gives back energy.',
    plan: [
      { t: 'Bounce science', j: [
        ['Find out how angles change where a ball bounces', 'Plan the ball shooter', 'Share the plan'],
        ['Plan the table', 'Build the table frame', 'Build the slope'],
        ['Measure bounce angles with a protractor', 'Record them', 'Plan the shooter test'] ] },
      { t: 'Shooter and flippers', j: [
        ['Find out how springs store and give back energy', 'Make a sign about it', 'Teach it'],
        ['Build the shooter and fit the spring', 'Build the left flipper', 'Build the right flipper'],
        ['Test three spring strengths', 'Test how often the flippers hit the ball back', 'Record the results'] ] },
      { t: 'Bumpers and score board', j: [
        ['Plan where the bumpers go and their scores', 'Write the scoring rules', 'Make them into a sign'],
        ['Build the bumpers', 'Build the side walls', 'Build the score board'],
        ['Play test games', 'Record the scores', 'List what to fix'] ] },
      { t: 'Pinball day', j: [
        ['Write the pinball talk', 'Practise it', 'Lead the talk'],
        ['Fix the problems found and decorate', 'Get the table ready', 'Fix it between games'],
        ['Make the player list', 'Run the competition', 'Record the high scores'] ] }
    ] },
  { id: 'sci-solarcar', cat: 'sci', level: 3, title: 'Solar race car',
    what: 'A small car with a solar panel and a motor. You design the body and wheels so it races as fast as possible in the sun.',
    hook: 'A solar panel turns sunlight into electricity, and a motor turns electricity into movement.',
    make: 'A solar car, a race track in the sun, and a race against the clock.',
    learn: 'Energy conversion and electric circuits',
    lo: 'We can explain how sunlight becomes movement, and show which changes made our car faster.',
    plan: [
      { t: 'Solar science', j: [
        ['Find out how a solar panel makes electricity', 'Test it in sun and shade', 'Plan a light body and wheels'],
        ['Wire the panel to the motor', 'Build the car body', 'Fit the wheels, panel and motor'],
        ['Plan fair races and mark a test track', 'Make the timing sheet', 'Time the car three times'] ] },
      { t: 'Gears', j: [
        ['Find out how gears change speed', 'Explain it with a bicycle', 'Spot what slows the car down'],
        ['Fit gear setup 1', 'Fit gear setup 2', 'Test both'],
        ['Time gear setup 1', 'Time gear setup 2', 'Chart both'] ] },
      { t: 'Lighter and faster', j: [
        ['Explain which changes made it faster', 'Write the race rules', 'Make them into a sign'],
        ['Make the car lighter', 'Make the wheels straighter', 'Build the race track'],
        ['Time it again', 'Chart every change', 'Run test races'] ] },
      { t: 'Race day', j: [
        ['Write the race-day talk', 'Practise it', 'Lead the talk'],
        ['Get the car ready', 'Fix it between runs', 'Keep spare parts ready'],
        ['Make the race board', 'Run the race against the clock', 'Post the times'] ] }
    ] },
  { id: 'sci-turbine', cat: 'sci', level: 3, title: 'Wind power',
    what: 'A small windmill with blades you design. When the wind spins the blades, they turn a tiny motor that makes electricity and lights up an LED.',
    hook: 'Spinning a motor makes electricity.',
    make: 'A wind turbine that lights an LED in front of a fan, and a chart of which blades work best.',
    learn: 'Energy conversion and electric circuits',
    lo: 'We can build a closed circuit, explain how wind becomes light, and show how blade shape changes the power.',
    plan: [
      { t: 'Electricity from motion', j: [
        ['Find out how spinning a motor makes electricity', 'Choose three blade designs', 'Write predictions'],
        ['Build the test stand with a motor and an LED', 'Make blade set 1', 'Make blade sets 2 and 3'],
        ['Plan the blade tests', 'Get a light app ready', 'Test all three sets'] ] },
      { t: 'Better blades', j: [
        ['Explain why the best blades work best', 'Plan two new versions', 'Plan the tower and base'],
        ['Make new version 1', 'Make new version 2', 'Test them'],
        ['Test all five sets again', 'Chart them', 'Pick the best'] ] },
      { t: 'The tower', j: [
        ['Write the how-it-works sign', 'Draw a diagram for it', 'Read it to the group'],
        ['Build the base and tower', 'Fix the motor and best blades on top', 'Make it steady'],
        ['Test at a near fan distance', 'Test at a far fan distance', 'Make the results chart'] ] },
      { t: 'Wind power show', j: [
        ['Write the wind power talk', 'Practise it', 'Lead the talk'],
        ['Set up the turbine and fan', 'Keep it running', 'Fix it if it stops'],
        ['Set up the results chart', 'Show visitors the chart', 'Answer their questions'] ] }
    ] },
  { id: 'sci-fort', cat: 'sci', level: 3, title: 'Giant dome fort',
    what: 'A dome big enough to sit inside, made from rolled-up newspaper sticks taped into triangles. It is strong, even though it is made of paper.',
    hook: 'Triangles share the weight, so the whole dome stays strong.',
    make: 'A paper dome fort the group can sit in, with a door and a star ceiling.',
    learn: 'Triangles and load sharing',
    lo: 'We can explain how triangles share weight, and measure and cut many sticks to the same length.',
    plan: [
      { t: 'Triangle science', j: [
        ['Find out why triangles are strong', 'Plan the dome from a straw model', 'Count the joints'],
        ['Roll 30 newspaper sticks', 'Build a small straw dome', 'Roll 30 more sticks'],
        ['Work out how many sticks and the two lengths', 'Cut sticks to the first length', 'Cut sticks to the second length'] ] },
      { t: 'Bottom ring', j: [
        ['Explain where the weight goes in the dome', 'Plan the door gap', 'Share the plan'],
        ['Build the first half of the bottom ring', 'Build the second half', 'Join them'],
        ['Check every stick’s length', 'Fix the wrong ones', 'Check the ring is level'] ] },
      { t: 'Up to the top', j: [
        ['Plan the star ceiling', 'Draw the star pattern', 'Plan the weight test'],
        ['Build the second layer', 'Build up to the top', 'Add the door'],
        ['Test how much the top holds', 'Record it', 'Make the visitor guide'] ] },
      { t: 'Open the fort', j: [
        ['Write the dome fort talk', 'Practise it', 'Lead the talk'],
        ['Add the star ceiling', 'Fix weak joints and decorate', 'Keep it safe on the day'],
        ['Measure the finished dome', 'Plan the visitor tours', 'Show visitors round'] ] }
    ] },
  { id: 'sci-steamboat', cat: 'sci', level: 3, title: 'Pop-pop steam boat',
    what: 'A little boat with a tiny boiler made from a tin and two straws. A tea-light heats the water, and the boat chugs across a tub going “pop pop pop”. (A facilitator lights the candle.)',
    hook: 'Heat turns water into steam, and steam pushes water out to move the boat.',
    make: 'Two working steam boats and a boat race across a tub of water.',
    learn: 'Heat, steam and action and reaction',
    lo: 'We can explain how heat makes steam that pushes the boat, and show which design goes fastest.',
    plan: [
      { t: 'Steam science', j: [
        ['Find out how heat makes steam that pushes', 'Plan two boat shapes', 'Draw them'],
        ['Plan the boiler with a facilitator', 'Build the first boiler from a tin', 'Build hull 1'],
        ['Plan a fair race across the tub', 'Make the timing sheet', 'Mark the start and finish'] ] },
      { t: 'First runs', j: [
        ['Explain what makes the boat move', 'Write it up', 'Present it'],
        ['Build hull 2 and the second boiler', 'Waterproof both hulls', 'Fit boilers and test with a facilitator'],
        ['Test how well each hull floats', 'Time each boat three times', 'Record all the times'] ] },
      { t: 'Faster boats', j: [
        ['Choose what to change and predict', 'Write the race rules', 'Make them into a sign'],
        ['Build a bigger boiler', 'Try a longer straw', 'Fix leaks and make the boats steadier'],
        ['Time each change', 'Chart the results', 'Pick the race setup'] ] },
      { t: 'Boat race', j: [
        ['Write the steam boat talk', 'Practise it', 'Lead the talk'],
        ['Get two boats race-ready', 'Fix them between races', 'Keep spares ready'],
        ['Make the race board', 'Run the boat race', 'Record the times'] ] }
    ] },

  /* ---------- Make it for LifeHub ---------- */
  { id: 'sol-snackshop', cat: 'sol', level: 1, title: 'LifeHub snack shop',
    what: 'You plan, make and sell a healthy snack at recess, like fruit cups or popcorn. You work out what to make, what it costs, the price, and how much you earn.',
    hook: 'A real shop teaches you how money works, and everyone gets a tasty snack.',
    make: 'A snack stall with a menu, price list and money box, run on three days.',
    learn: 'Money: cost, price and profit',
    lo: 'We can work out the cost, price and profit of our snack, and show it in a simple sales chart.',
    plan: [
      { t: 'Plan the shop', j: [
        ['Plan a snack survey and ask 15 Risers', 'Find real shop prices for ingredients', 'Work out the cost and price of each snack'],
        ['Design the menu and price list', 'Design the stall sign and price tags', 'Make a money box with a coin tray'],
        ['Make two test snacks', 'Run a taste test', 'Make the snacks for day 1'] ] },
      { t: 'Open the shop', j: [
        ['Make a buyer feedback sheet', 'Add up each day’s money', 'Work out the profit and make a chart'],
        ['Change the menu or prices from feedback', 'Make a “new today” sign', 'Make the thank-you poster'],
        ['Set up and run day 1', 'Make snacks and run day 2', 'Run day 3 and pack away'] ] }
    ] },
  { id: 'sol-pizzaday', cat: 'sol', level: 1, title: 'LifeHub pizza day',
    what: 'You learn how bread rises, test dough recipes, make your own sauce and toppings, and then run a pizza day where everyone makes their own pizza.',
    hook: 'Everyone loves pizza, and making it from scratch is real food science.',
    make: 'A tested pizza recipe card, and a pizza day for the whole class.',
    learn: 'Yeast and how dough rises',
    lo: 'We can explain how yeast makes dough rise, and show from our tests which place made it rise best.',
    plan: [
      { t: 'Dough and sauce', j: [
        ['Find out how yeast makes dough rise', 'Plan the warm and cool dough test', 'Chart the rise'],
        ['Plan the menu and toppings', 'Run a class vote', 'Draw the step-by-step recipe card'],
        ['Make a test dough and measure the rise', 'Make two tomato sauces', 'Run a sauce taste test'] ] },
      { t: 'Pizza day', j: [
        ['Write the yeast science talk', 'Write the pizza day timings', 'Explain the science on pizza day'],
        ['Make the station labels and sign-up sheet', 'Set up the pizza stations', 'Run the topping table'],
        ['Make a test pizza with the best recipe', 'Make the dough and sauce for pizza day', 'Help everyone make their pizza'] ] }
    ] },
  { id: 'sol-solarcook', cat: 'sol', level: 1, title: 'Solar cooker café',
    what: 'Boxes lined with foil that bounce sunlight onto a black pot. The pot gets hot enough to melt chocolate and make s’mores, using only the sun.',
    hook: 'We can cook a treat for everyone with free energy from the sun.',
    make: 'Two solar cookers, a temperature log, and a sunny-day café for the class.',
    learn: 'Reflection and absorbing heat',
    lo: 'We can explain why shiny sides and a black pot make it hotter, and show it with our temperature log.',
    plan: [
      { t: 'Build and test', j: [
        ['Find out why shiny and black things get hot', 'Plan a temperature test every 10 minutes', 'Make the temperature log'],
        ['Design the solar cooker with measurements', 'Design a better reflector', 'Plan the café menu and prices'],
        ['Build the first cooker from a box and foil', 'Build the second cooker', 'Test both and compare'] ] },
      { t: 'Sunny café', j: [
        ['Chart the temperatures', 'Write the solar energy talk', 'Lead the talk at the café'],
        ['Make the menu and café signs', 'Set up the tables', 'Run the order table'],
        ['Fix the cooler cooker and test again', 'Get the cookers in the sun', 'Cook and serve the treats'] ] }
    ] },
  { id: 'sol-postoffice', cat: 'sol', level: 1, title: 'LifeHub post office',
    what: 'You build a mailbox for every Riser, design stamps and postcards, and run a real post office that delivers letters around LifeHub every day.',
    hook: 'Getting a letter from a friend makes anyone’s day.',
    make: 'A mailbox for every Riser, stamps and postcards, and a post office that runs for a week.',
    learn: 'Letter writing and sorting systems',
    lo: 'We can write a clear letter, and explain how our sorting and delivery system gets each letter to the right box.',
    plan: [
      { t: 'Build the post office', j: [
        ['Write the post office rules', 'Plan the delivery rounds', 'Make the rota'],
        ['Design a mailbox for every Riser', 'Design stamps, postcards and a postmark', 'Make the first batch'],
        ['Build six mailboxes', 'Build six more and label them', 'Build the sorting box'] ] },
      { t: 'Post week', j: [
        ['Check letters reach the right box', 'Count the letters sent each day', 'Make a chart and present it'],
        ['Run the stamp counter', 'Make more stamps and postcards', 'Make thank-you cards for every Riser'],
        ['Sort and deliver Monday’s post', 'Deliver Tuesday’s post', 'Deliver Wednesday’s post and hand over'] ] }
    ] },
  { id: 'sol-puppets', cat: 'sol', level: 1, title: 'Puppet show for little ones',
    what: 'You build a puppet theatre, make puppets with moving parts, write a story and put on a show for the youngest children at LifeHub.',
    hook: 'Little ones love a puppet show, and you get to be the storytellers.',
    make: 'A puppet theatre with a curtain, a set of puppets, and a show for the younger children.',
    learn: 'Storytelling and stagecraft',
    lo: 'We can write a story with a beginning, middle and end, and make puppets with parts that move.',
    plan: [
      { t: 'Story and puppets', j: [
        ['Choose a story with the little ones', 'Write the script', 'Give everyone a part'],
        ['Sketch the theatre and puppets', 'Make the first puppets', 'Make the rest with moving mouths'],
        ['Build the theatre frame', 'Make the curtain', 'Make the scenery'] ] },
      { t: 'Rehearse and show', j: [
        ['Run the first rehearsal and give notes', 'Write the welcome', 'Welcome the audience and lead the show'],
        ['Make the props', 'Make the posters and tickets', 'Set up the seats'],
        ['Add lights and sound effects', 'Run the second rehearsal', 'Run backstage: lights and curtain'] ] }
    ] },
  { id: 'sol-boardgames', cat: 'sol', level: 1, title: 'Board game café',
    what: 'You invent your own board games: the board, the pieces, the cards and the rules. Then you open a game café where friends play and give you ideas to make them better.',
    hook: 'The best games are the ones you make yourself.',
    make: 'Three new board games and a game café corner with all the pieces and rule cards.',
    learn: 'Rule writing and chance',
    lo: 'We can write clear rules a new player can follow, and use what we know about dice to make our game fairer.',
    plan: [
      { t: 'Make the games', j: [
        ['Ask 10 Risers what makes games fun', 'Write the rules for game 1', 'Write the rules for games 2 and 3'],
        ['Sketch three game ideas', 'Design board 1', 'Design boards 2 and 3 and the cards'],
        ['Make a paper version of one game', 'Make the pieces for game 1', 'Make the pieces for games 2 and 3'] ] },
      { t: 'Game café', j: [
        ['Run test games with friends', 'Practise teaching each game', 'Lead the café opening'],
        ['Change confusing rules and cards', 'Make the rule cards and box labels', 'Make the café sign'],
        ['Make a box for each game', 'Set up the café corner', 'Run the café'] ] }
    ] },
  { id: 'sol-newsshow', cat: 'sol', level: 1, title: 'LifeHub news show',
    what: 'You make a short video news show about what is happening at LifeHub, with news, interviews and a weather report. You plan it, film it and edit it.',
    hook: 'Families love to see what happens at LifeHub, and you get to be the reporters.',
    make: 'A 3-minute news show, shared with families at the end of the project.',
    learn: 'Script writing and video editing',
    lo: 'We can write a short script, film it clearly, and edit clips together in the right order.',
    plan: [
      { t: 'Find and film', j: [
        ['Find three news stories at LifeHub', 'Interview people for stories 1 and 2', 'Interview for story 3'],
        ['Plan the running order and titles', 'Write the script for stories 1 and 2', 'Write story 3 and the weather report'],
        ['Practise steady filming and clear sound', 'Film the opening', 'Film the stories and weather'] ] },
      { t: 'Edit and screen', j: [
        ['Watch the rough cut and list fixes', 'Write the introduction', 'Introduce the show and answer questions'],
        ['Add titles, music and pictures', 'Make the poster and invitations', 'Set up the screening room'],
        ['Re-film shots that did not work', 'Edit and export the final show', 'Run the screen and sound'] ] }
    ] },
  { id: 'sol-chillcorner', cat: 'sol', level: 2, title: 'Chill-out corner',
    what: 'You measure how loud different places at LifeHub are with a sound meter on a tablet. Then you build soft panels and cushions to make a calm, quiet corner, and measure again.',
    hook: 'Noise makes it hard to focus. A calm corner helps everyone.',
    make: 'A chill-out corner with sound panels and cushions, and before-and-after sound readings.',
    learn: 'Sound absorption',
    lo: 'We can explain why soft, bumpy surfaces soak up sound, and show the drop in our sound readings.',
    plan: [
      { t: 'Noise map', j: [
        ['Plan where to measure sound', 'Measure five places at three times of day', 'Draw the noise map'],
        ['Ask 15 Risers what feels calm', 'Design the corner layout', 'Design the panel pattern'],
        ['Test four fabrics for soaking up sound', 'Make panel 1 from fabric and egg trays', 'Make panels 2 and 3'] ] },
      { t: 'Panels and cushions', j: [
        ['Plan where every panel goes', 'Check the plan with a facilitator', 'Mark the wall'],
        ['Design the floor cushions', 'Cut the cushion pieces', 'Make the sign and rules'],
        ['Make panels 4 and 5', 'Sew or tie the cushions', 'Hang the first panels'] ] },
      { t: 'Open the corner', j: [
        ['Measure the sound again', 'Compare with week 1', 'Present the drop in noise'],
        ['Make the before-and-after chart', 'Put up the sign and chart', 'Read the rules to the class'],
        ['Hang the rest of the panels', 'Set up the cushions', 'Fix anything loose and open it'] ] }
    ] },
  { id: 'sol-gamefair', cat: 'sol', level: 2, title: 'Game fair',
    what: 'Fun games made from cardboard: throw balls into hoops, roll balls through mazes, and win tickets and small prizes. You run it at a LifeHub event.',
    hook: 'LifeHub events need fun things to do that can also raise money.',
    make: 'Four working games, a ticket booth and a price list, run at a LifeHub event.',
    learn: 'Chance, cost, price and profit',
    lo: 'We can work out the cost, price and profit of our fair, and explain whether each game is fair.',
    plan: [
      { t: 'Game ideas and costs', j: [
        ['Ask Risers which fair games they love', 'List materials and costs for each game', 'Work out the cost of each game'],
        ['Design four game ideas with sizes', 'Design the tickets and prize list', 'Share them'],
        ['Build game 1', 'Build game 2', 'Test both'] ] },
      { t: 'Build and test', j: [
        ['Plan the fairness test', 'Test games 1 to 3 and record wins', 'Set ticket prices from the costs'],
        ['Fix games that are too easy or too hard', 'Make the price board', 'Make the signs and game map'],
        ['Build game 3', 'Build game 4', 'Build the ticket booth'] ] },
      { t: 'Fair day', j: [
        ['Lead the opening', 'Explain the rules', 'Count the tickets and money'],
        ['Set up the fair', 'Run the ticket booth', 'Make the money chart'],
        ['Run the games', 'Fix games on the day', 'Pack everything away'] ] }
    ] },
  { id: 'sol-escaperoom', cat: 'sol', level: 2, title: 'LifeHub escape room',
    what: 'You turn a room into an escape room. You make puzzles, secret codes and locked boxes. Teams have 30 minutes to solve them all and escape.',
    hook: 'Puzzles are the most fun when friends work them out together.',
    make: 'An escape room with four puzzles and two locked boxes, played by other Risers and families.',
    learn: 'Codes and logic puzzles',
    lo: 'We can make and break a secret code, and explain how each puzzle leads to the next one.',
    plan: [
      { t: 'Story and first puzzles', j: [
        ['Find out how escape rooms work', 'Learn two secret codes', 'Plan the chain of four puzzles'],
        ['Plan the story', 'Design the clue cards and props', 'Design the room layout'],
        ['Make puzzle 1', 'Make puzzle 2', 'Build locked box 1'] ] },
      { t: 'Puzzles', j: [
        ['Make code puzzle 3', 'Write the hint cards', 'Plan the test run'],
        ['Make the props', 'Draw where each puzzle goes', 'Make puzzle 4'],
        ['Build locked box 2', 'Test all four puzzles', 'Set up the room'] ] },
      { t: 'Escape day', j: [
        ['Test the room with one team and take notes', 'Write the team briefing', 'Brief each team and lead the start'],
        ['Fix puzzles that were too hard', 'Fix the clue cards', 'Give hints when teams ask'],
        ['Fix props and make spares', 'Reset the room between teams', 'Record the times on a leader board'] ] }
    ] },
  { id: 'sol-minigolf', cat: 'sol', level: 2, title: 'Mini golf course',
    what: 'A mini golf course with ramps, tunnels, bridges and bumpers, made from wood, card and pipes. Every hole has a par score.',
    hook: 'Everyone loves mini golf, and you get to design every tricky hole.',
    make: 'A 6-hole mini golf course and a scorecard, played at a LifeHub event.',
    learn: 'Angles and measuring',
    lo: 'We can measure and build each hole to size, and show how angles change where the ball goes.',
    plan: [
      { t: 'Angles and design', j: [
        ['Find out how angles change where a ball goes', 'Test it against a wall', 'Plan how to set par'],
        ['Design six holes with measurements', 'Design the ramps and tunnels', 'Check the sizes'],
        ['Build hole 1', 'Build hole 2', 'Test both'] ] },
      { t: 'Build the course', j: [
        ['Test holes 1 to 3 and set par', 'Plan the event and the rules', 'Write the rules'],
        ['Fix holes that are too easy or too hard', 'Make the scorecards', 'Make the hole signs'],
        ['Build hole 3', 'Build holes 4 and 5', 'Build hole 6'] ] },
      { t: 'Golf day', j: [
        ['Test holes 4 to 6 and set par', 'Explain the rules', 'Help players'],
        ['Put up the signs and set up the course', 'Hand out scorecards', 'Run the score board'],
        ['Fix any broken hole', 'Fix things between games', 'Pack the course away'] ] }
    ] },
  { id: 'sol-recessbox', cat: 'sol', level: 2, title: 'Recess games box',
    what: 'You invent five new games for Riser Recess, make all the gear for them, and write the rules. Then you teach the games to everyone.',
    hook: 'We play the same few games at Recess every day.',
    make: 'A games box with gear and rule cards for five new games, and a games day to launch it.',
    learn: 'Rule writing, measuring and timing',
    lo: 'We can write clear rules, measure out a playing area, and time and score a game fairly.',
    plan: [
      { t: 'Invent the games', j: [
        ['Plan a Recess survey and ask Risers', 'Write the rules for games 1 to 3', 'Write the rules for games 4 and 5'],
        ['Invent five games', 'Design the rule cards with pictures', 'Make the cards'],
        ['Make the gear for game 1', 'Make the gear for games 2 and 3', 'Test it'] ] },
      { t: 'Test at Recess', j: [
        ['Test games 1 to 3 at Recess', 'Test games 4 and 5', 'Share what to change'],
        ['Change rules that did not work', 'Remake those rule cards', 'Design the games box and label'],
        ['Make the gear for game 4', 'Make the gear for game 5', 'Build the games box'] ] },
      { t: 'Games day', j: [
        ['Plan the games day', 'Teach games 1 to 3', 'Teach games 4 and 5'],
        ['Make the sign-up sheet', 'Run the sign-up', 'Run the schedule'],
        ['Fix broken gear and pack the box', 'Set up the games', 'Run the games and pack away'] ] }
    ] },
  { id: 'sol-buzzerphone', cat: 'sol', level: 2, title: 'Room-to-room buzzer phone',
    what: 'A long wire, a battery, a switch and a buzzer join two rooms. Press the switch in one room and the buzzer sounds in the other. You send messages in Morse code.',
    hook: 'We walk between rooms all day just to pass short messages.',
    make: 'A working buzzer line between two rooms, and a Morse code card for every Riser.',
    learn: 'Electric circuits and codes',
    lo: 'We can build a closed circuit with a switch, and send and read a short message in Morse code.',
    plan: [
      { t: 'Circuits and Morse', j: [
        ['Find out how a circuit with a switch works', 'Learn Morse letters A to M', 'Learn N to Z'],
        ['Plan and measure where the wire will run', 'Design the Morse code cards', 'Make the first cards'],
        ['Build the test circuit on the table', 'Get the long wire ready', 'Run it between rooms'] ] },
      { t: 'First messages', j: [
        ['Plan test messages', 'Send them and count mistakes', 'Plan a way to reply'],
        ['Make the switch easier to press', 'Design the message rules sign', 'Make the rest of the Morse cards'],
        ['Fix the wire in place', 'Find and fix weak joins', 'Add a second switch and buzzer'] ] },
      { t: 'Open the line', j: [
        ['Teach the group how to send a message', 'Teach other Risers', 'Run the first real messages'],
        ['Put up the rules and guide', 'Hand out the Morse cards', 'Make a message log'],
        ['Test both ways', 'Fix problems', 'Keep the line working'] ] }
    ] },
  { id: 'sol-readingnook', cat: 'sol', level: 2, title: 'Reading nook makeover',
    what: 'You design and build a reading nook: cardboard stools, a bench, floor cushions and a book display, all strong enough to really use.',
    hook: 'A cosy nook makes everyone want to read.',
    make: 'A reading nook with four cardboard stools, a bench and a book display.',
    learn: 'Strength of shapes',
    lo: 'We can show that folded cardboard and short, wide columns hold more weight, and test our seats safely.',
    plan: [
      { t: 'Cosy ideas', j: [
        ['Ask Risers about a cosy nook', 'Plan a safe weight test', 'Test the first stool and record it'],
        ['Design the nook layout', 'Design the bench and book display', 'Share the designs'],
        ['Make the test stool', 'Build stool 2', 'Build stool 3'] ] },
      { t: 'Bench and display', j: [
        ['Test every seat safely', 'Ask the class which books to display', 'Make a book list'],
        ['Design the cushions and sign', 'Make the cushions', 'Make the sign'],
        ['Build stool 4', 'Build the bench', 'Build the book display'] ] },
      { t: 'Open the nook', j: [
        ['Write the reading nook rules', 'Make them into a card', 'Read them to the class'],
        ['Plan the layout on the day', 'Set up the nook', 'Add the cushions and sign'],
        ['Fix the display in place', 'Fill the shelf', 'Fix anything loose and open it'] ] }
    ] },
  { id: 'sol-mosquito', cat: 'sol', level: 2, title: 'Mosquito detectives',
    what: 'Mosquitoes lay eggs in still water. You search all of LifeHub for places where water sits, fix each one, and set little traps to check if mosquitoes are still around.',
    hook: 'In the rainy season, mosquito bites make people sick.',
    make: 'A map of every wet spot, a fix for each one, traps to check it worked, and a poster for families.',
    learn: 'Mosquito life cycle and mapping',
    lo: 'We can draw the mosquito life cycle, explain why still water matters, and map every wet spot we found.',
    plan: [
      { t: 'Life cycle and search', j: [
        ['Find out the mosquito life cycle', 'Search the first half of LifeHub', 'Search the second half'],
        ['Plan and draw the LifeHub map', 'Mark every wet spot on the map', 'Colour them by type'],
        ['Find out how egg traps work', 'Make the traps', 'Set them near wet spots'] ] },
      { t: 'Fix the spots', j: [
        ['Record every wet spot in a list', 'Plan fixes for the hard spots', 'Check the traps and record'],
        ['Design the poster for families', 'Draw it', 'Check it with the group'],
        ['Tip, cover or drain the easy spots', 'Fix the hard spots with a facilitator', 'Record what was fixed'] ] },
      { t: 'Check and share', j: [
        ['Check the traps again and chart it', 'Plan the talk', 'Present the map and fixes'],
        ['Copy the posters', 'Put them up and send them home', 'Write a monthly check list'],
        ['Check every spot again', 'Update the map', 'Teach the garden team the check list'] ] }
    ] },
  { id: 'sol-steppingstones', cat: 'sol', level: 2, title: 'Handprint stepping stones',
    what: 'You mix cement and pour it into old trays. You press in your handprints, tiles and pebbles. Then you lay the stones as a path across the garden.',
    hook: 'One part of the garden turns to mud every time it rains, and the path will carry our handprints for years.',
    make: 'A path of six decorated stepping stones.',
    learn: 'Mixing and setting cement',
    lo: 'We can mix cement, sand and water in the right amounts, and explain that cement sets by a chemical change.',
    plan: [
      { t: 'Cement science', j: [
        ['Find out how cement sets', 'Test three small mixes', 'Record which is strongest'],
        ['Design the stone patterns', 'Collect tiles and pebbles', 'Plan each stone'],
        ['Get the moulds ready', 'Mix and pour stones 1 and 2', 'Pour stones 3 and 4'] ] },
      { t: 'Decorate and dig', j: [
        ['Measure the path and plan the spacing', 'Mark it with string and pegs', 'Check the first stones are hard'],
        ['Decorate stones with handprints', 'Add tiles and pebbles', 'Design and paint the path sign'],
        ['Pour stones 5 and 6', 'Dig the path', 'Level it and add sand'] ] },
      { t: 'Lay the stones', j: [
        ['Write the path’s story', 'Read it to the group', 'Add it to the sign'],
        ['Put up the sign', 'Tidy the path edges', 'Take before-and-after photos'],
        ['Lay the first stones', 'Lay the rest', 'Check every stone is steady'] ] }
    ] },
  { id: 'sol-treasuremap', cat: 'sol', level: 2, title: 'Treasure hunt map',
    what: 'You make an accurate map of LifeHub, drawn to scale, with a compass rose. Then you hide clues and run a treasure hunt using your map.',
    hook: 'A good map can lead anyone to the treasure.',
    make: 'A big scale map of LifeHub, and a treasure hunt with clues for another group.',
    learn: 'Scale drawing and compass directions',
    lo: 'We can measure and draw a place to scale, and give directions using north, south, east and west.',
    plan: [
      { t: 'Maps and measuring', j: [
        ['Learn compass points and scale', 'Measure the first area', 'Measure the other areas'],
        ['Plan the map size', 'Draw the first area to scale', 'Draw the other areas'],
        ['Get the tape ready and practise', 'Record the measurements', 'Check the measurements on the map'] ] },
      { t: 'Finish the map and clues', j: [
        ['Plan the clue trail and hiding spots', 'Write clues 1 to 3', 'Write clues 4 to 6'],
        ['Add the compass rose and key', 'Colour the map', 'Make the clue cards'],
        ['Make copies of the map', 'Cover them', 'Hide the clues and mark them'] ] },
      { t: 'Treasure hunt', j: [
        ['Test the hunt with one friend', 'Write the start talk', 'Lead the start'],
        ['Fix any confusing clues', 'Make the treasure', 'Run the finish'],
        ['Re-hide moved clues', 'Hand out the maps and run the hunt', 'Collect the clues after'] ] }
    ] },
  { id: 'sol-fashion', cat: 'sol', level: 2, title: 'Trash-to-treasure fashion show',
    what: 'You design and make outfits, bags and hats from things people throw away, like old T-shirts, newspaper, bottle caps and packets. Then you put on a fashion show.',
    hook: 'So much stuff gets thrown away that could become something cool.',
    make: 'Three recycled outfits, a design sketchbook, and a fashion show for families.',
    learn: 'Measuring, stitching and recycling',
    lo: 'We can measure a person and cut to size, sew a simple stitch, and explain how much waste our outfits saved.',
    plan: [
      { t: 'Collect and sketch', j: [
        ['Plan what to collect', 'Sort and wash what we collected', 'Measure the three models'],
        ['Sketch three outfit designs', 'Choose the designs as a team', 'Mark and cut outfit 1'],
        ['Practise a running stitch', 'Make a test patch', 'Stitch outfit 1'] ] },
      { t: 'Outfits 2 and 3', j: [
        ['Weigh the waste used in each outfit', 'Make the waste-saved chart', 'Write the show script'],
        ['Mark and cut outfit 2', 'Mark and cut outfit 3', 'Make bags or hats to match'],
        ['Stitch outfit 2', 'Stitch outfit 3', 'Add trims and try them on'] ] },
      { t: 'Fashion show', j: [
        ['Write what each outfit saved', 'Practise the script', 'Host the fashion show'],
        ['Make the posters', 'Plan the runway and music', 'Set up the runway'],
        ['Last fixes to the outfits', 'Practise the walk', 'Help the models on the day'] ] }
    ] },
  { id: 'sol-hideout', cat: 'sol', level: 3, title: 'Bamboo hideout',
    what: 'A hideout made of bamboo poles tied together with rope, with a shade cloth on top. It is a cool, shady place to read, rest and hang out.',
    hook: 'Every Riser wants a secret hideout outside.',
    make: 'A bamboo hideout big enough for four children to sit inside.',
    learn: 'Lashing knots and bracing',
    lo: 'We can tie a square lashing and a clove hitch without help, and explain how a diagonal pole stops a frame leaning.',
    plan: [
      { t: 'Knots and design', j: [
        ['Learn the square lashing', 'Learn the clove hitch', 'Measure the space and mark the corners'],
        ['Sketch the hideout from three sides', 'Draw the plan with measurements', 'List the poles we need'],
        ['Practise lashing two poles', 'Sort the bamboo by length', 'Saw the poles with a facilitator'] ] },
      { t: 'First sides', j: [
        ['Push-test without braces', 'Push-test with braces', 'Record the difference'],
        ['Design the bracing poles', 'Cut the diagonal braces', 'Lash the braces on side 1'],
        ['Lash the first side', 'Lash side 2', 'Stand them up with the group'] ] },
      { t: 'Roof', j: [
        ['Measure the roof', 'Plan how the shade cloth ties on', 'Push-test the whole frame'],
        ['Cut the shade cloth', 'Make the tie points', 'Fit the cloth'],
        ['Lash sides 3 and 4', 'Lash the roof poles', 'Tighten every knot'] ] },
      { t: 'Open it', j: [
        ['Write the hideout rules', 'Make the knot guide for others', 'Present how the braces work'],
        ['Make the sign', 'Lay the floor mats', 'Put up the sign'],
        ['Do the last safety check', 'Fix anything loose', 'Open the hideout'] ] }
    ] },
  { id: 'sol-zipline', cat: 'sol', level: 3, title: 'Zip-line delivery',
    what: 'A rope tied tight between two places. A pulley with a basket zooms along it, delivering notes and snacks from one end to the other.',
    hook: 'A zip line makes delivering things fun and fast.',
    make: 'A zip line that carries a basket safely from one end to the other and stops gently.',
    learn: 'Pulleys, slopes and friction',
    lo: 'We can explain how slope, pulleys and friction change the basket’s speed, and show it by testing.',
    plan: [
      { t: 'Speed and slope', j: [
        ['Find out how slope and friction change speed', 'Plan the slope test', 'Choose the best slope'],
        ['Design the short test line', 'Plan where the long line will go', 'Check it with a facilitator'],
        ['Build the short test line', 'Time runs at three slopes', 'Test two pulleys'] ] },
      { t: 'Basket', j: [
        ['Plan the basket test', 'Test with light and heavy loads', 'Write the safety checklist'],
        ['Design the basket and soft stopper', 'Build the basket', 'Build the stopper'],
        ['Fit them on the test line', 'Check the anchor points', 'Make the end platform'] ] },
      { t: 'Long line', j: [
        ['Time runs with different loads', 'Chart the times', 'Find the best load'],
        ['Fix the basket so it stays level', 'Fix the stopper', 'Make the sign and delivery cards'],
        ['Put up the long line with a facilitator', 'Tighten it', 'Run ten safe test runs'] ] },
      { t: 'Deliveries', j: [
        ['Write the safety rules', 'Present how slope and friction work', 'Read the rules to the group'],
        ['Put up the sign', 'Hand out delivery cards', 'Fix anything that went wrong'],
        ['Do the last safety check', 'Run the first deliveries', 'Keep the line working'] ] }
    ] },
  { id: 'sol-booklift', cat: 'sol', level: 3, title: 'Book lift',
    what: 'A hand-wound lift with a box that goes up and down. A heavy weight on the other side of a pulley makes it easy to lift.',
    hook: 'Carrying heavy boxes of books up and down is hard work.',
    make: 'A lift that carries a box of books up to a high shelf, with a brake so it stays put.',
    learn: 'Pulleys and counterweights',
    lo: 'We can explain how a counterweight makes lifting easier, and measure the force needed with and without it.',
    plan: [
      { t: 'Pulleys', j: [
        ['Find out how pulleys and counterweights work', 'Plan the force test', 'Measure force with and without a counterweight'],
        ['Sketch the lift', 'Plan where it goes and measure the height', 'Check it with a facilitator'],
        ['Build a model lift with a cotton reel', 'Test it with books', 'Fix what goes wrong'] ] },
      { t: 'Frame', j: [
        ['Chart the model results', 'List the wood we need', 'Plan the load test'],
        ['Design the box and brake', 'Mark the wood', 'Build the box'],
        ['Cut the frame wood', 'Join the frame', 'Check it stands straight'] ] },
      { t: 'Box and rope', j: [
        ['Test the frame with weight', 'Measure the force with books', 'Chart it with and without the counterweight'],
        ['Make the counterweight bag', 'Build the brake', 'Test the brake'],
        ['Fit the pulley and rope', 'Run the empty box up and down', 'Test with a full box of books'] ] },
      { t: 'Hand it over', j: [
        ['Write how to use it safely', 'Present how a counterweight helps', 'Teach a class how to use it'],
        ['Make the sign and use chart', 'Put them up', 'Fix the brake if needed'],
        ['Do the last safety check', 'Fix anything loose', 'Hand the lift over'] ] }
    ] },
  { id: 'sol-movienight', cat: 'sol', level: 3, title: 'Outdoor movie night',
    what: 'You build a big outdoor movie screen and a phone projector from a box and a magnifying lens. Then you host a movie night with seating and snacks.',
    hook: 'Everyone loves a movie night under the stars.',
    make: 'A big screen, a working box projector, and a movie night for Risers and families.',
    learn: 'Lenses and light',
    lo: 'We can explain how a lens makes a picture bigger and why it shows upside down, and set the focus distance.',
    plan: [
      { t: 'Lenses', j: [
        ['Find out how a lens makes a picture bigger', 'Test focus distances and record them', 'Make a focus chart'],
        ['Plan the movie night', 'Measure where the screen goes', 'Design the screen frame'],
        ['Build the first box projector', 'Add a slide to change focus', 'Test it in a dark room'] ] },
      { t: 'Screen', j: [
        ['Find out why the picture is upside down', 'Draw how light goes through a lens', 'Test the picture in different light'],
        ['Mark the screen wood or poles', 'Build the screen frame', 'Fit the white sheet'],
        ['Line the box with foil', 'Black out light leaks', 'Test brightness again'] ] },
      { t: 'Tickets', j: [
        ['Choose the movie with the group', 'Plan the guest list and seats', 'Write the invite'],
        ['Make the tickets', 'Make the posters', 'Put the posters up'],
        ['Make a spare projector', 'Test both', 'Fix any problems'] ] },
      { t: 'Movie night', j: [
        ['Write the lens talk', 'Practise it', 'Give the lens talk on the night'],
        ['Plan the snacks', 'Set up the seating', 'Run the ticket desk'],
        ['Set up the screen', 'Set up the projector', 'Run the movie'] ] }
    ] },
  { id: 'sol-library', cat: 'sol', level: 3, title: 'Little library',
    what: 'A small wooden book cupboard with a door, near the front gate. Anyone can put a book in or take a book out.',
    hook: 'Good books sit at home and no one reads them.',
    make: 'A rain-proof book cupboard, and a simple way to borrow and give back books.',
    learn: 'Waterproofing and woodwork',
    lo: 'We can measure and cut wood to size, fit a hinge, and explain how our roof keeps rain out.',
    plan: [
      { t: 'Books and design', j: [
        ['Survey 15 Risers about books', 'Measure the spot and the books', 'Work out the shelf size'],
        ['Sketch the cupboard', 'Draw the plan with measurements', 'List the wood we need'],
        ['Practise measuring and sawing', 'Mark the wood', 'Cut the back and sides'] ] },
      { t: 'Box and roof', j: [
        ['Plan the borrow-and-return system', 'Make the book cards', 'Test wood samples with water'],
        ['Design the sloped roof', 'Cut the roof pieces', 'Fit the roof and seal the edges'],
        ['Join the box', 'Fit the shelf', 'Check it is square'] ] },
      { t: 'Door and rain test', j: [
        ['Test it with a watering can', 'Record any leaks', 'Present how the roof keeps rain out'],
        ['Fix the leaks', 'Paint the cupboard', 'Paint the second coat'],
        ['Make the door', 'Fit the hinge and catch', 'Make the stand'] ] },
      { t: 'Open it', j: [
        ['Write the library rules', 'Collect the first books', 'Sort them'],
        ['Make the sign', 'Put the book cards in', 'Put up the sign'],
        ['Fix it to the stand by the gate', 'Fill it with books', 'Open the little library'] ] }
    ] },
  { id: 'sol-gokart', cat: 'sol', level: 3, title: 'Sports day go-kart',
    what: 'A wooden go-kart that rolls down a gentle slope, with real steering, a seat and a brake. You build it, test it and race it on sports day.',
    hook: 'Racing something you built yourself is the best feeling.',
    make: 'A go-kart that steers and stops safely, and a timed race on sports day.',
    learn: 'Gravity, friction and steering',
    lo: 'We can explain how gravity and friction change the kart’s speed, and show our timed runs and what we changed.',
    plan: [
      { t: 'Speed and design', j: [
        ['Find out how gravity and friction change speed', 'Roll a toy car down three slopes', 'Measure the rider and work out the kart size'],
        ['Draw the plan with measurements', 'List the wood and wheels', 'Check it with a facilitator'],
        ['Build a small model', 'Mark and cut the base wood with a facilitator', 'Sand it'] ] },
      { t: 'Base and steering', j: [
        ['Write the safety checklist', 'Check the base is strong', 'Plan the steering test'],
        ['Design the steering', 'Design the seat and bumpers', 'Build the seat'],
        ['Join the base frame', 'Fit the axles and wheels', 'Fit the steering rope'] ] },
      { t: 'Test runs', j: [
        ['Test turning on flat ground', 'Time runs on a gentle slope', 'Chart the times'],
        ['Fix the steering', 'Design and build the brake', 'Fit the bumpers'],
        ['Fit the brake', 'Test stopping', 'Fix the brake'] ] },
      { t: 'Race day', j: [
        ['Write the race rules', 'Present our timed runs', 'Run the safety check'],
        ['Make the race signs', 'Mark the track', 'Set up the finish line'],
        ['Do the last safety check', 'Fix anything loose', 'Run the go-kart race'] ] }
    ] },
  { id: 'sol-ecobench', cat: 'sol', level: 3, title: 'Bottle-brick bench',
    what: 'You push clean plastic wrappers into bottles until they are hard like bricks. Then you stack the bottle bricks and cover them with mud to make a bench.',
    hook: 'Wrappers and plastic bags pile up and have nowhere to go.',
    make: 'A strong bench in the garden made from bottle bricks and mud.',
    learn: 'Recycling plastic and building with cob',
    lo: 'We can pack a hard bottle brick, and mix cob and explain what the clay, sand and straw each do.',
    plan: [
      { t: 'Bottle bricks', j: [
        ['Find out why packed plastic gets hard', 'Work out how many bricks we need', 'Plan the wrapper collection'],
        ['Sketch the bench and measure the spot', 'Draw the plan with measurements', 'Mark the spot'],
        ['Pack the first bottle bricks', 'Pack more bricks', 'Squeeze-test them'] ] },
      { t: 'Base', j: [
        ['Collect wrappers from every room', 'Sort them', 'Update the brick chart'],
        ['Dig the base', 'Lay the first stones', 'Level them'],
        ['Pack bricks', 'Lay the first row', 'Pack more bricks'] ] },
      { t: 'Cob', j: [
        ['Find out what clay, sand and straw do', 'Test three cob mixes', 'Choose the best mix'],
        ['Mix the cob', 'Cover the first row', 'Shape the seat'],
        ['Lay the second row', 'Lay the last row', 'Pack the gaps'] ] },
      { t: 'Finish', j: [
        ['Write the bench’s story', 'Count the wrappers we saved', 'Present the story'],
        ['Mix and cover the top', 'Make the sign', 'Put up the sign'],
        ['Smooth the bench', 'Fix any cracks', 'Open the bench'] ] }
    ] }
];
