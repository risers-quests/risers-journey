/* Term 3 Quests — the build pool: 50 projects the groups choose from, in
   two kinds, "Science in action" (sci) and "Make it for LifeHub" (sol).
   Each one has a name, what it is, the idea or reason behind it (hook),
   what the group ends up with (make), the science concept or skill they
   learn (learn), the learning outcome (lo: what they can show or explain at
   the end) and a level (1 easier, 2 medium, 3 harder). Risers never see the
   level: each group only sees the levels set for it in quest-data.js.

   plan: one entry per week ({ t: the week's title, j: the jobs }), so a
   level 1 project has 4 weeks, level 2 has 5 and level 3 has 6 (see
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
      { t: 'Slime science', j: [
        ['Read how glue turns into slime', 'Make a “how slime works” sheet with drawings', 'Teach the sheet to the group'],
        ['Set up the slime station', 'Make the basic recipe and write exact amounts', 'Make it again to check the recipe works'],
        ['Plan a stretch test and a bounce test', 'Make the results table', 'Test the first batches and fill in the table'] ] },
      { t: 'Four new recipes', j: [
        ['Choose four recipe changes to try', 'Write a prediction for each change', 'Check the tests are fair with the group'],
        ['Mix the first two recipe changes', 'Mix the other two changes', 'Make a second batch of each and label them'],
        ['Test the first two recipes', 'Test the other two recipes', 'Spot the biggest difference and tell the group'] ] },
      { t: 'The best slime', j: [
        ['Find the winning recipe from the results', 'Explain why it works on the science sheet', 'Present the winner to the group'],
        ['Make the winning recipe again', 'Try two new twists: colour and scent', 'Write the final recipe card'],
        ['Draw the stretch bar chart', 'Draw the bounce bar chart', 'Make the “slime of the week” certificate'] ] },
      { t: 'Slime stall', j: [
        ['Make the slime science poster', 'Practise the stall talk', 'Lead the talk at the stall'],
        ['Make 10 pots of slime', 'Make 10 more pots and label them all', 'Set up and run the stall'],
        ['Make the voting sheet', 'Make the results board', 'Run the vote and announce the favourite'] ] }
    ] },
  { id: 'sci-icecream', cat: 'sci', level: 1, title: 'Ice cream in a bag',
    what: 'You put milk, sugar and flavour in a small bag, and that bag inside a big bag of ice and salt. Shake it hard for ten minutes, and you have real ice cream.',
    hook: 'Salt makes ice colder than ice on its own. That is how ice cream can freeze in your hands.',
    make: 'Ice cream for the whole class, and a chart of how much colder the ice gets with salt.',
    learn: 'Freezing and melting points',
    lo: 'We can explain why salt makes ice colder, and show it with thermometer readings.',
    plan: [
      { t: 'Cold science', j: [
        ['Find out why salt makes ice colder', 'Make a poster that explains it', 'Teach the poster to the group'],
        ['Make the first bag of ice cream', 'Write each step on a recipe card', 'Make a second bag to check the steps'],
        ['Measure plain ice every minute for 10 minutes', 'Measure salty ice the same way', 'Draw both on a line graph'] ] },
      { t: 'The salt test', j: [
        ['Plan a fair test of four salt amounts', 'Write a prediction for each', 'Check the test is fair with the group'],
        ['Make bags with the first two salt amounts', 'Get the next two bags ready', 'Make bags with the last two amounts'],
        ['Time how long the first bags take to freeze', 'Make the results table', 'Time the last bags and graph all four'] ] },
      { t: 'A better shaker', j: [
        ['Find ways to keep hands warm while shaking', 'Test gloves, towels and tins', 'Report which works best'],
        ['Design a shaker tin', 'Build the shaker tin', 'Test it and improve the lid'],
        ['Time the bag three times', 'Time the tin three times', 'Chart bag against tin'] ] },
      { t: 'Ice cream day', j: [
        ['Write the talk on why salt freezes ice cream', 'Practise the talk', 'Lead the talk on ice cream day'],
        ['Plan the flavours and toppings', 'Get all the ingredients ready', 'Make ice cream for the whole class'],
        ['Make a flavour survey', 'Make the results chart', 'Run the survey and show the favourite'] ] }
    ] },
  { id: 'sci-balloon', cat: 'sci', level: 1, title: 'Balloon car race',
    what: 'You build a car from a bottle, straws and bottle-cap wheels. A balloon blows air out of the back, and the car zooms forward. Then you race.',
    hook: 'When air rushes out one way, the car shoots the other way.',
    make: 'A balloon-powered racing car, a race track, and a results board for the big race day.',
    learn: 'Action and reaction (Newton’s third law)',
    lo: 'We can explain why the air pushes the car forward, and show which changes make our car go further.',
    plan: [
      { t: 'First cars', j: [
        ['Find out why rushing air pushes a car', 'Draw a diagram of the forces', 'Teach the diagram to the group'],
        ['Build the first car from a bottle, straws and caps', 'Build the second car', 'Make sure the wheels spin freely'],
        ['Mark a 5-metre test track', 'Make the results table', 'Measure each car three times'] ] },
      { t: 'Three changes', j: [
        ['Choose three changes to test', 'Write a prediction for each', 'Plan how to keep the tests fair'],
        ['Build a car with bigger wheels', 'Build a car with a bigger balloon', 'Build a car with a longer straw'],
        ['Test the wheels car three times', 'Test the balloon car three times', 'Test the straw car and work out averages'] ] },
      { t: 'The best car', j: [
        ['Find which change helped most', 'Write up why it helped', 'Present it to the group'],
        ['Build the best car', 'Make it lighter and straighter', 'Test until it beats the old record'],
        ['Chart all the results', 'Choose the race car', 'Plan the race heats'] ] },
      { t: 'Race day', j: [
        ['Write the race rules', 'Write the science talk for the crowd', 'Explain the science before the races'],
        ['Build the race track', 'Make the start line and finish banner', 'Get every car race-ready'],
        ['Make the results board', 'Practise timing a race', 'Run the heats and the final'] ] }
    ] },
  { id: 'sci-planes', cat: 'sci', level: 1, title: 'Paper plane championship',
    what: 'You fold and test lots of paper planes, changing the wings, the nose and the weight. Then you hold a championship for the longest flight and the longest time in the air.',
    hook: 'Air pushes up on the wings and pushes back on the plane. Small changes make a big difference.',
    make: 'Your best planes, a test log of every flight, and a paper plane championship with a winners’ board.',
    learn: 'Lift, drag and fair testing',
    lo: 'We can explain lift and drag, and show from our flight log which wing shape flies furthest.',
    plan: [
      { t: 'Plane science', j: [
        ['Find out about lift, drag and gravity', 'Draw a labelled plane diagram', 'Teach the diagram to the group'],
        ['Fold the first plane design', 'Fold two more designs', 'Test that each one flies'],
        ['Set up the flight line with tape every metre', 'Make the flight log', 'Measure everyone’s first flights'] ] },
      { t: 'Wing tests', j: [
        ['Choose what to change about the wings', 'Write predictions', 'Check the test is fair'],
        ['Fold a big-wing version', 'Fold a small-wing version', 'Fold a curved-wing version'],
        ['Fly the first two versions three times', 'Fly the third version three times', 'Record distance and time for each'] ] },
      { t: 'Nose and weight tests', j: [
        ['Explain the wing results to the group', 'Plan the nose and weight tests', 'Write predictions'],
        ['Fold planes with paper-clip weights', 'Fold planes with folded noses', 'Test each one'],
        ['Record every flight', 'Chart every design’s best flight', 'Find the champion design'] ] },
      { t: 'Championship', j: [
        ['Write the championship rules', 'Write the opening talk on lift and drag', 'Lead the opening talk'],
        ['Fold planes for every player', 'Set up the flying course', 'Help players launch'],
        ['Make the winners’ board', 'Train two helpers to measure', 'Run the championship and post the results'] ] }
    ] },
  { id: 'sci-spy', cat: 'sci', level: 1, title: 'Spy science kit',
    what: 'You become science spies. You write secret messages in lemon juice that only show up with heat. You also dust for fingerprints and solve a pretend mystery at LifeHub.',
    hook: 'Some liquids change colour when heated or mixed. Everyone’s fingerprints are different.',
    make: 'A spy kit with invisible ink, a fingerprint set, and a mystery for the class to solve.',
    learn: 'Chemical changes and fingerprint patterns',
    lo: 'We can explain why lemon-juice writing shows up when heated, and sort fingerprints into loops, whorls and arches.',
    plan: [
      { t: 'Invisible ink', j: [
        ['Find out why lemon juice shows up when heated', 'Write it up as a spy file', 'Teach the spy file to the group'],
        ['Make four invisible inks', 'Write a secret message with each ink', 'Reveal the inks safely with a facilitator'],
        ['Plan how to judge which ink is best', 'Make the results table', 'Chart which ink showed up best'] ] },
      { t: 'Fingerprints', j: [
        ['Learn the three fingerprint patterns', 'Make a pattern guide with drawings', 'Teach the guide to the group'],
        ['Make an ink pad', 'Make dusting powder and a brush kit', 'Test lifting prints with tape'],
        ['Take everyone’s prints', 'Sort them into loops, whorls and arches', 'Make a chart of the patterns'] ] },
      { t: 'The mystery', j: [
        ['Write the mystery story', 'Write the chain of six clues', 'Read the story to the group'],
        ['Make the clue cards with invisible ink', 'Make the clue cards with fingerprints', 'Build the crime scene props'],
        ['Plan the test run', 'Make a timing and notes sheet', 'Test the mystery on a friend and note what confused them'] ] },
      { t: 'Spy day', j: [
        ['Fix the clues that confused the tester', 'Practise explaining each clue', 'Lead the mystery and explain the science'],
        ['Pack a spy kit for each team', 'Get the crime scene ready', 'Set up and run the crime scene'],
        ['Make the solved board', 'Plan how to time each team', 'Record which teams solved it and how fast'] ] }
    ] },
  { id: 'sci-junkband', cat: 'sci', level: 1, title: 'Junkyard band',
    what: 'You make real instruments from things at home: a rubber-band guitar, straw flutes and a water-bottle xylophone. You tune them, practise a song and play a concert.',
    hook: 'Every sound is a shake. Long, short, tight or loose changes the note.',
    make: 'A set of home-made instruments that play real notes, and a band concert for families.',
    learn: 'Sound, vibration and pitch',
    lo: 'We can show that shorter, tighter or smaller things make higher notes, and explain that sound is a vibration.',
    plan: [
      { t: 'How sound works', j: [
        ['Find out how a vibration makes sound', 'Show it with a ruler on a table', 'Teach it with rice on a drum'],
        ['Plan the box guitar', 'Build the box guitar with four strings', 'Test that every string plays'],
        ['Plan how to order notes from low to high', 'Test which band gives the highest note', 'Record the order'] ] },
      { t: 'More instruments', j: [
        ['Find out why longer and tighter changes the note', 'Make a short explanation card', 'Explain it with the guitar'],
        ['Build a straw flute', 'Build a water-bottle xylophone', 'Test both instruments'],
        ['Get a tuner app ready with a facilitator', 'Tune each instrument', 'Mark the notes on each one'] ] },
      { t: 'Our song', j: [
        ['Choose a song everyone knows', 'Work out its notes', 'Teach the tune to the group'],
        ['Make the instruments louder', 'Build a drum', 'Make the instruments easier to play'],
        ['Write the song as a number chart', 'Make a chart for each instrument', 'Lead the first practice'] ] },
      { t: 'Concert', j: [
        ['Write the talk on how each instrument works', 'Practise the talk', 'Give the talk at the concert'],
        ['Get every instrument stage-ready', 'Set up the stage', 'Fix instruments during the rehearsal'],
        ['Plan the concert order', 'Lead the rehearsal', 'Count the band in at the concert'] ] }
    ] },
  { id: 'sci-aircannon', cat: 'sci', level: 1, title: 'Air cannon battle',
    what: 'You make a box with a round hole. Tap the back, and a ring of air shoots out. It can knock over cups from far away. Then you hold a target battle.',
    hook: 'Air is real stuff. It takes up space and can push things.',
    make: 'Two air cannons, a cup-tower target game, and a scoreboard.',
    learn: 'Air pressure and vortex rings',
    lo: 'We can show that air can push things, and explain how a ring of air travels and knocks over cups.',
    plan: [
      { t: 'First cannon', j: [
        ['Find out how a ring of air travels', 'Draw how the ring moves', 'Teach the drawing to the group'],
        ['Plan the cannon', 'Build the first air cannon from a box', 'Test it and fix air leaks'],
        ['Set up cup targets at 1, 2 and 3 metres', 'Make the hits table', 'Record hits for ten shots'] ] },
      { t: 'Hole size test', j: [
        ['Choose three hole sizes', 'Write predictions', 'Check the test is fair'],
        ['Build a cannon with a small hole', 'Build cannons with medium and big holes', 'Check all three boxes are the same'],
        ['Test the small hole ten times', 'Test the other two ten times each', 'Work out the averages'] ] },
      { t: 'Best cannon', j: [
        ['Find why the best hole works best', 'Write it up', 'Present it to the group'],
        ['Build two copies of the best cannon', 'Decorate them', 'Test both'],
        ['Chart all the results', 'Plan fair battle distances', 'Mark the battle field'] ] },
      { t: 'Battle day', j: [
        ['Write the battle rules', 'Make the science poster', 'Explain the poster before the battle'],
        ['Build the cup towers', 'Make spare cups and towers', 'Set up the battle field'],
        ['Make the scoreboard', 'Train a helper to keep score', 'Keep score and announce the winners'] ] }
    ] },
  { id: 'sci-rocket', cat: 'sci', level: 2, title: 'Water rocket launch',
    what: 'A big soft-drink bottle with some water inside. You pump in air until it blasts off high into the sky. You change the fins, nose and water to fly higher.',
    hook: 'When the water pushes down, the rocket goes up.',
    make: 'Your own water rockets, a launch pad, and a launch day with heights measured for every flight.',
    learn: 'Action and reaction (Newton’s third law)',
    lo: 'We can explain why pushing water down sends the rocket up, and show from our measurements which amount of water flies highest.',
    plan: [
      { t: 'Rocket science', j: [
        ['Find out why pushing water down sends a rocket up', 'Show it with a balloon on a string', 'Teach it to the group'],
        ['Plan the launch pad with a facilitator', 'Build the launch pad', 'Test it with an empty bottle and fix leaks'],
        ['Find out how to measure height with an angle', 'Make an angle-finder', 'Practise measuring a tree'] ] },
      { t: 'First rockets', j: [
        ['Plan a test of three water amounts', 'Write predictions', 'Check the test is fair'],
        ['Build the first rocket with fins and a nose cone', 'Build the second rocket', 'Check both stand straight on the pad'],
        ['Make the launch log', 'Launch each rocket three times', 'Measure and record every height'] ] },
      { t: 'Fins and noses', j: [
        ['Find out how fins keep a rocket straight', 'Plan the fin test', 'Write predictions'],
        ['Build a rocket with three fins', 'Build a rocket with four fins', 'Build a rocket with a long nose'],
        ['Launch the three-fin rocket', 'Launch the four-fin and long-nose rockets', 'Chart height for every rocket'] ] },
      { t: 'Parachute', j: [
        ['Find out how a parachute slows a fall', 'Plan the parachute test', 'Explain the best design so far'],
        ['Make a parachute', 'Fit it to the best rocket', 'Test until it opens every time'],
        ['Time the first parachute falls', 'Time three more falls', 'Add everything to the launch log'] ] },
      { t: 'Launch day', j: [
        ['Write the launch-day talk', 'Write the safety briefing', 'Lead the talk and the briefing'],
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
      { t: 'Drop tests', j: [
        ['Find out how height turns into speed', 'Make an explanation drawing', 'Explain it with two marbles'],
        ['Build a test track', 'Make three drop heights', 'Test each drop'],
        ['Plan how to time the marble', 'Time each drop three times', 'Find the fastest drop'] ] },
      { t: 'Plan the coaster', j: [
        ['Plan the drops, hills and loop', 'Draw the full plan with heights', 'Check the plan with the group'],
        ['Build the first drop', 'Build the first hill', 'Test the first drop and hill'],
        ['Measure the board', 'Measure each part as it is built', 'Mark the heights on the plan'] ] },
      { t: 'The loop', j: [
        ['Find out why the first drop must be higher than the loop', 'Test it with a short track', 'Explain it to the group'],
        ['Build the loop', 'Change it until marbles get round', 'Join it to the hill'],
        ['Run 10 marbles through the loop', 'Record where the others fall off', 'Chart the results'] ] },
      { t: 'Fix and finish', j: [
        ['Study every place the marble falls off', 'Work out why for each', 'Tell the group the fixes'],
        ['Fix the weak parts', 'Build the station and the finish line', 'Join the whole coaster'],
        ['Time 10 full runs', 'Count the clean finishes', 'Make the timing board'] ] },
      { t: 'Show day', j: [
        ['Write the coaster tour talk', 'Practise it', 'Lead the tour and the science talk'],
        ['Add signs', 'Add decorations', 'Get the coaster ready and reset it between runs'],
        ['Make the visitor score card', 'Train a helper to time', 'Run the timing board on show day'] ] }
    ] },
  { id: 'sci-claw', cat: 'sci', level: 2, title: 'Arcade claw machine',
    what: 'Like the claw game at a fair, but it runs on water. Two syringes joined by a tube work the arm and the claw, so you can grab prizes.',
    hook: 'Water can not be squashed, so a push at one end comes out at the other end.',
    make: 'A claw machine in a box that picks up small prizes, for everyone to play.',
    learn: 'Hydraulics',
    lo: 'We can explain why a push on one syringe moves the other, and show that a small syringe moves further while a big one pushes harder.',
    plan: [
      { t: 'Water power', j: [
        ['Find out how water passes a push along a tube', 'Show it with two syringes', 'Teach it to the group'],
        ['Join syringes with a tube', 'Build an arm that moves up and down', 'Test it and fix leaks'],
        ['Plan the syringe size test', 'Test small and big syringes', 'Record how far each one moves'] ] },
      { t: 'The arm', j: [
        ['Plan how the arm goes up, down and turns', 'Draw a labelled plan', 'Check the plan with the group'],
        ['Build the base', 'Build the arm from card and sticks', 'Fit two syringe controls'],
        ['Plan how to measure the arm’s moves', 'Measure the moves for each push', 'Record them in a table'] ] },
      { t: 'The claw', j: [
        ['Plan two claw shapes', 'Draw them with sizes', 'Explain the plan to the group'],
        ['Build the first claw', 'Build the second claw', 'Fit the better one and fix leaks'],
        ['Make the prize test', 'Test the first claw 10 times', 'Test the second claw and chart both'] ] },
      { t: 'The box', j: [
        ['Write the how-it-works sign', 'Draw a diagram for it', 'Read it to the group for feedback'],
        ['Build the game box', 'Fit the arm inside', 'Add the prize chute'],
        ['Test the whole game 10 times', 'Test it 10 more times', 'Set a fair time limit'] ] },
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
        ['Find out how gravity and air push on falling things', 'Show it with paper and a coin', 'Teach it to the group'],
        ['Plan a first lander', 'Build it from card and padding', 'Test it with a ball'],
        ['Plan the drop heights', 'Make the results table', 'Test the first lander'] ] },
      { t: 'Three ideas', j: [
        ['Plan three parachute and padding ideas', 'Write a prediction for each', 'Explain them to the group'],
        ['Build lander 1', 'Build lander 2', 'Build lander 3'],
        ['Drop lander 1 three times', 'Drop lander 2 three times', 'Drop lander 3 and record egg or no egg'] ] },
      { t: 'Higher drops', j: [
        ['Find which idea worked best', 'Write why it worked', 'Present it to the group'],
        ['Improve the best lander', 'Build a spare', 'Test both from higher up'],
        ['Time falls without a parachute', 'Time falls with a parachute', 'Chart the results'] ] },
      { t: 'The final lander', j: [
        ['Plan the big-drop day', 'Write the safety rules with a facilitator', 'Share the plan with the group'],
        ['Build the final lander', 'Have a facilitator check it', 'Fix anything they spot'],
        ['Plan the highest safe drop', 'Test from the highest safe spot', 'Record the results'] ] },
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
        ['Find out how a lever throws', 'Show it with a ruler and a rubber', 'Teach it to the group'],
        ['Plan the test catapult', 'Build it from sticks and string', 'Test it'],
        ['Plan how to measure throws fairly', 'Make the results table', 'Measure the first throws'] ] },
      { t: 'The frame', j: [
        ['Choose what to test: arm, weight or sling', 'Write predictions', 'Check the plan is fair'],
        ['Build the frame', 'Build the throwing arm', 'Join them and test'],
        ['Test a short arm three times', 'Test a medium arm three times', 'Test a long arm and record all'] ] },
      { t: 'Weight and sling', j: [
        ['Explain why a longer arm throws further', 'Plan the weight test', 'Write predictions'],
        ['Build the weight box', 'Build the sling', 'Test them'],
        ['Test a light weight', 'Test medium and heavy weights', 'Chart all the results'] ] },
      { t: 'Aim and castles', j: [
        ['Plan the castles', 'Plan the target distances', 'Share the plan with the group'],
        ['Make the catapult aim straight', 'Build castle 1', 'Build castle 2'],
        ['Mark the targets', 'Run practice rounds', 'Record practice scores'] ] },
      { t: 'Castle battle', j: [
        ['Write the battle rules', 'Practise explaining them', 'Lead the talk before the battle'],
        ['Set up the castles and catapults', 'Make spare balls', 'Fix damage between rounds'],
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
        ['Find out how a circuit works', 'Draw a circuit diagram', 'Teach it to the group'],
        ['Plan the first circuit', 'Build it with a battery and a buzzer', 'Test it'],
        ['Collect 10 materials', 'Test which make the buzzer sound', 'Record the results'] ] },
      { t: 'Easy course', j: [
        ['Plan the three courses on paper', 'Check the plans with the group', 'Plan the handle loop'],
        ['Bend the easy course', 'Fix it to the base', 'Wire it to the buzzer'],
        ['Make the timing sheet', 'Time five players', 'Record the times'] ] },
      { t: 'Medium and hard', j: [
        ['Explain why the buzzer sounds when the loop touches', 'Write it as a sign', 'Read it to the group'],
        ['Bend the medium course', 'Bend the hard course', 'Fix both to the base'],
        ['Time players on the medium course', 'Time players on the hard course', 'Set fair rules'] ] },
      { t: 'Make it better', j: [
        ['Plan start lights', 'Plan a better handle', 'Share the plan'],
        ['Add the start lights', 'Make a comfy handle', 'Fix loose wires'],
        ['Make the high-score board', 'Test it with players', 'Fix anything confusing'] ] },
      { t: 'Competition', j: [
        ['Write the talk on how the game works', 'Practise it', 'Lead the talk'],
        ['Decorate the game', 'Set it up', 'Keep it working during the competition'],
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
        ['Find out how an LED circuit works', 'Draw it', 'Teach it to the group'],
        ['Build a paper circuit with copper tape', 'Build two more', 'Test all three'],
        ['Plan the LED test', 'Test which way round LEDs light', 'Record the rule'] ] },
      { t: 'Card designs', j: [
        ['Plan three card designs with switches', 'Draw them', 'Choose the best with the group'],
        ['Make two light-up cards', 'Make three more', 'Check they all light'],
        ['Make a check list for each card', 'Check every card', 'List the fixes needed'] ] },
      { t: 'All the cards', j: [
        ['Write a how-to guide for making a card', 'Add drawings', 'Teach the guide to a friend'],
        ['Make cards for the first half of families', 'Make the rest', 'Fix the broken ones'],
        ['Test every card', 'Record which work', 'Re-test the fixed ones'] ] },
      { t: 'The big poster', j: [
        ['Plan the poster with five lights', 'Draw the circuit', 'Check it with the group'],
        ['Build the poster circuit', 'Add the switch', 'Test it'],
        ['Plan the battery test', 'Test how long the battery lasts', 'Record and chart it'] ] },
      { t: 'Light show', j: [
        ['Write the how-it-works labels', 'Practise the talk', 'Lead the talk'],
        ['Hang the poster', 'Wrap the cards', 'Set up the light show'],
        ['Make the circuit diagram for visitors', 'Practise explaining it', 'Explain it to visitors'] ] }
    ] },
  { id: 'sci-quake', cat: 'sci', level: 2, title: 'Earthquake challenge',
    what: 'A board that you shake to make a pretend earthquake. You build towers on it and test which ones stay up. Then you make your tower stronger and try again.',
    hook: 'Some buildings fall in a shake. Some stay up. The shape makes the difference.',
    make: 'A shaking board and a city of towers that survive the biggest shake.',
    learn: 'Centre of gravity and bracing',
    lo: 'We can show that a low, wide tower with cross braces stays up longer, and explain why.',
    plan: [
      { t: 'Earthquake science', j: [
        ['Find out why buildings fall in earthquakes', 'Show it with a jelly test', 'Teach it to the group'],
        ['Plan the shake board', 'Build it', 'Make the shake the same every time'],
        ['Plan a fair shake test', 'Make the results table', 'Test the shake board'] ] },
      { t: 'Three towers', j: [
        ['Choose three tower shapes', 'Write predictions', 'Explain the plan to the group'],
        ['Build tower 1', 'Build tower 2', 'Build tower 3'],
        ['Shake tower 1 three times', 'Shake towers 2 and 3 three times', 'Record how long each lasts'] ] },
      { t: 'Stronger towers', j: [
        ['Explain why wide bases and braces help', 'Plan the changes', 'Share the plan'],
        ['Add braces to tower 1', 'Add braces to towers 2 and 3', 'Check they are the same height'],
        ['Shake each tower again', 'Record the results', 'Chart before and after'] ] },
      { t: 'The city', j: [
        ['Plan the city layout', 'Plan the buildings', 'Share the plan'],
        ['Build the first city buildings', 'Build the rest', 'Join the city on the board'],
        ['Test every building', 'Record the weak ones', 'Help fix the weak ones'] ] },
      { t: 'Challenge day', j: [
        ['Write the challenge talk', 'Practise it', 'Lead the talk'],
        ['Set up the city', 'Make spare parts', 'Rebuild between shakes'],
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
        ['Find out about lift and drag', 'Draw the forces on a kite', 'Teach it to the group'],
        ['Cut the frame for a diamond kite', 'Build the diamond kite', 'Fit the string and tail'],
        ['Plan how to test height, steadiness and time', 'Make the flight log', 'Test the first flights'] ] },
      { t: 'Test flights', j: [
        ['Watch the first flights closely', 'Write what made each kite dive or spin', 'Share it with the group'],
        ['Plan a box kite', 'Build the box kite', 'Fix the diamond kite'],
        ['Fly the diamond kite three times', 'Fly the box kite three times', 'Fill in the flight log'] ] },
      { t: 'Tails and strings', j: [
        ['Plan fair tests of tails and string points', 'Write predictions', 'Check the plan is fair'],
        ['Make three tails', 'Make two string points', 'Fit them for testing'],
        ['Test the tails', 'Test the string points', 'Chart which was steadiest'] ] },
      { t: 'Festival kites', j: [
        ['Plan the festival', 'Plan the prizes and safety rules', 'Share the plan'],
        ['Make two kites for visitors', 'Make three more', 'Test them all'],
        ['Make the judging sheet', 'Train two judges', 'Practise judging a flight'] ] },
      { t: 'Kite festival', j: [
        ['Write the festival talk', 'Practise it', 'Lead the talk'],
        ['Get all the kites ready', 'Fix kites on the day', 'Help visitors launch'],
        ['Set up the judging table', 'Judge the prizes', 'Record the winners'] ] }
    ] },
  { id: 'sci-hand', cat: 'sci', level: 2, title: 'Robot hand',
    what: 'A big cardboard hand. Strings run along each finger. Pull a string, and that finger bends. Pull them all, and the hand grabs things.',
    hook: 'Your fingers bend because strings inside your arm pull on them.',
    make: 'A robot hand that can pick up a cup and wave hello.',
    learn: 'Tendons and joints',
    lo: 'We can explain how tendons pull our fingers, and name the parts of the hand our model copies.',
    plan: [
      { t: 'Hand science', j: [
        ['Find out how tendons move fingers', 'Draw the inside of a hand', 'Teach it to the group'],
        ['Draw round a hand on card', 'Cut out the fingers', 'Mark the joints'],
        ['Plan how to measure joints', 'Measure five real hands', 'Choose the sizes to use'] ] },
      { t: 'Fingers', j: [
        ['Plan how each string runs', 'Draw a labelled plan', 'Check it with the group'],
        ['Build two fingers with straws and strings', 'Build the other two', 'Test each one'],
        ['Plan the bend test', 'Test how far each finger curls', 'Record the results'] ] },
      { t: 'The thumb', j: [
        ['Explain which part of our hand each piece copies', 'Make labels', 'Label the model'],
        ['Build the thumb', 'Build the wrist', 'Join the hand together'],
        ['Choose five objects to grip', 'Test the grips', 'Record which work'] ] },
      { t: 'Stronger grip', j: [
        ['Plan how to make the grip stronger', 'Write predictions', 'Share the plan'],
        ['Add rubber pads', 'Fit stronger strings', 'Fix weak joints'],
        ['Count pick-ups out of 10 before', 'Count pick-ups out of 10 after', 'Chart before and after'] ] },
      { t: 'Robot show', j: [
        ['Write the robot hand talk', 'Practise it', 'Lead the talk'],
        ['Make the hand wave hello', 'Practise the wave', 'Keep it working at the show'],
        ['Plan the pick-up challenge', 'Make the score sheet', 'Run the challenge for visitors'] ] }
    ] },
  { id: 'sci-scribble', cat: 'sci', level: 2, title: 'Scribble bots',
    what: 'Small robots made from a cup, a tiny motor, a battery and felt pens for legs. The motor makes them shake, and they draw wild patterns as they move.',
    hook: 'A wobbly motor makes the whole robot shake and move.',
    make: 'A team of scribble bots and a giant robot artwork on the wall.',
    learn: 'Motors, vibration and balance',
    lo: 'We can build a circuit with a motor, and show how moving the weight changes the way the bot moves.',
    plan: [
      { t: 'Motor science', j: [
        ['Find out how a wobbly motor makes things move', 'Show it with a coin on a buzzing phone', 'Teach it to the group'],
        ['Plan the first bot', 'Build it from a cup, a motor and pens', 'Test it'],
        ['Plan how to record movement', 'Record how the bot moves', 'Keep and label the first drawing'] ] },
      { t: 'Three bots', j: [
        ['Plan three changes: weight, pen angle, cup size', 'Write predictions', 'Share the plan'],
        ['Build a bot with a weight', 'Build a bot with angled pens', 'Build a bot with a bigger cup'],
        ['Test the weight bot', 'Test the other two', 'Compare the three drawings'] ] },
      { t: 'Control', j: [
        ['Explain why moving the weight changes the path', 'Write it up', 'Present it'],
        ['Add a switch', 'Add a way to steer', 'Test the steering'],
        ['Test each bot three times', 'Record each path', 'Choose the best bots'] ] },
      { t: 'Artwork plan', j: [
        ['Plan the giant artwork', 'Plan the colours', 'Share the plan'],
        ['Build two more bots', 'Fit them with the right pens', 'Test them'],
        ['Mark the paper', 'Time how long each bot runs', 'Plan where each bot starts'] ] },
      { t: 'Gallery', j: [
        ['Write the talk on how scribble bots work', 'Practise it', 'Lead the talk'],
        ['Run the bots to make the artwork', 'Keep the bots working', 'Hang the artwork'],
        ['Make the gallery labels', 'Set up the gallery', 'Show visitors round'] ] }
    ] },
  { id: 'sci-breakfast', cat: 'sci', level: 3, title: 'Breakfast machine',
    what: 'A long chain of tricks. A marble rolls and hits a block, the block falls and pushes a car, and so on. At the end, the machine pours cereal into a bowl.',
    hook: 'One small push can pass from thing to thing, all the way down the line.',
    make: 'A machine with 10 or more steps that pours a bowl of cereal by itself, filmed for families to watch.',
    learn: 'Chain reactions and simple machines',
    lo: 'We can point to each simple machine in our chain (ramp, lever, pulley, wheel) and explain how it passes the push to the next step.',
    plan: [
      { t: 'Simple machines', j: [
        ['Find out about ramps, levers, pulleys and wheels', 'Find one of each at LifeHub', 'Teach them to the group'],
        ['Plan steps 1 to 3', 'Build steps 1 to 3', 'Test them'],
        ['Plan all 10 steps on a big sketch', 'Write what each step pushes', 'Check the plan with the group'] ] },
      { t: 'Steps 4 to 6', j: [
        ['Check each step passes the push to the next', 'Fix the plan', 'Explain the changes'],
        ['Build step 4', 'Build steps 5 and 6', 'Join them to steps 1 to 3'],
        ['Make the test table', 'Test steps 1 to 6 five times', 'Record which fail'] ] },
      { t: 'Steps 7 to 10', j: [
        ['Study the failing steps', 'Work out why each fails', 'Tell the group the fixes'],
        ['Build steps 7 and 8', 'Build steps 9 and 10', 'Test the new steps'],
        ['Test the new steps five times', 'Record the results', 'Chart which steps fail most'] ] },
      { t: 'Joining up', j: [
        ['Plan how to join all the steps', 'List where it could go wrong', 'Share the list'],
        ['Join all 10 steps', 'Fix the weak ones', 'Run it start to finish'],
        ['Run the full machine five times', 'Count clean runs', 'Record what went wrong'] ] },
      { t: 'Cereal!', j: [
        ['Write a label for every simple machine', 'Make the labels', 'Fix them to the machine'],
        ['Build the cereal pour', 'Make it reliable', 'Test it with real cereal'],
        ['Run 10 full runs', 'Record each one', 'Pick the best run'] ] },
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
        ['Find out how trapped air lifts a hovercraft', 'Show it with a puck on a table', 'Teach it to the group'],
        ['Plan a mini hovercraft', 'Build it from a CD and a balloon', 'Test it'],
        ['Choose three floors to test', 'Test how far the mini one glides on each', 'Record the results'] ] },
      { t: 'Plan the big one', j: [
        ['Plan the skirt and air hole with a facilitator', 'Draw the plan', 'Share it with the group'],
        ['Mark the board with a facilitator', 'Cut the board with a facilitator', 'Smooth the edges'],
        ['Measure the board', 'Work out where the air holes go', 'Mark them'] ] },
      { t: 'The skirt', j: [
        ['Explain why the skirt traps air', 'Show it with the mini model', 'Teach it to the group'],
        ['Cut the plastic skirt', 'Fix it to the board', 'Seal it with tape'],
        ['Plan the leak test', 'Test the skirt with a fan', 'Mark the leaks'] ] },
      { t: 'First lift', j: [
        ['Plan the first safe test', 'Write the safety checks', 'Run the safety checks'],
        ['Fit the leaf blower with a facilitator', 'Test it', 'Fix the leaks'],
        ['Get a spring scale ready', 'Measure the push without air', 'Measure the push with air'] ] },
      { t: 'Ready to ride', j: [
        ['Write the safety rules', 'Write the rider checklist', 'Teach them to the group'],
        ['Add the seat', 'Add the handles', 'Make it steady'],
        ['Plan the glide test', 'Test each rider', 'Record the glide distances'] ] },
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
        ['Find out how angles change where a ball bounces', 'Test it against a wall', 'Teach it to the group'],
        ['Plan the table', 'Build the table frame', 'Build the slope'],
        ['Get a protractor ready', 'Measure bounce angles', 'Record them'] ] },
      { t: 'Shooter', j: [
        ['Plan the ball shooter', 'Plan how strong it should be', 'Share the plan'],
        ['Build the shooter tube', 'Fit the spring', 'Test it'],
        ['Test three spring strengths', 'Measure how far the ball goes', 'Record the results'] ] },
      { t: 'Flippers', j: [
        ['Explain how springs store and give back energy', 'Make a sign about it', 'Teach it'],
        ['Build the left flipper', 'Build the right flipper', 'Fit and test both'],
        ['Plan the flipper test', 'Test how often they hit the ball back', 'Record the results'] ] },
      { t: 'Bumpers', j: [
        ['Plan where the bumpers go', 'Plan their scores', 'Share the plan'],
        ['Build the bumpers', 'Build the side walls', 'Fit them all'],
        ['Play test games', 'Record the scores', 'List what to fix'] ] },
      { t: 'Score board', j: [
        ['Write the scoring rules', 'Make them into a sign', 'Read them to the group'],
        ['Build the score board', 'Decorate the table', 'Fix the problems found'],
        ['Run test games', 'Record the scores', 'Check the fixes worked'] ] },
      { t: 'Pinball day', j: [
        ['Write the pinball talk', 'Practise it', 'Lead the talk'],
        ['Get the table ready', 'Keep it working', 'Fix it between games'],
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
        ['Find out how a solar panel makes electricity', 'Test it in sun and shade', 'Teach it to the group'],
        ['Wire the panel to the motor', 'Test it', 'Fix loose wires'],
        ['Plan fair races', 'Mark a test track', 'Make the timing sheet'] ] },
      { t: 'Body and wheels', j: [
        ['Plan a light body and wheels', 'Draw the plan', 'Share it'],
        ['Build the car body', 'Fit the wheels', 'Fit the panel and motor'],
        ['Time the car three times', 'Record the times', 'Spot what slows it down'] ] },
      { t: 'Gears', j: [
        ['Find out how gears change speed', 'Explain it with a bicycle', 'Teach it'],
        ['Fit gear setup 1', 'Fit gear setup 2', 'Test both'],
        ['Time gear setup 1', 'Time gear setup 2', 'Chart both'] ] },
      { t: 'Lighter and faster', j: [
        ['Explain which changes made it faster', 'Plan more changes', 'Share them'],
        ['Make the car lighter', 'Make the wheels straighter', 'Test it'],
        ['Time it again', 'Chart every change', 'Pick the race setup'] ] },
      { t: 'Race track', j: [
        ['Write the race rules', 'Make them into a sign', 'Read them to the group'],
        ['Build the race track', 'Build the start line', 'Test the track'],
        ['Run test races', 'Record the times', 'Plan race-day timing'] ] },
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
        ['Find out how spinning a motor makes electricity', 'Test it by hand', 'Teach it to the group'],
        ['Plan the test stand', 'Build it with a motor and an LED', 'Test it'],
        ['Plan the blade tests', 'Make the results table', 'Get a light app ready'] ] },
      { t: 'Blade designs', j: [
        ['Choose three blade designs', 'Write predictions', 'Share them'],
        ['Make blade set 1', 'Make blade sets 2 and 3', 'Fix them to the hub'],
        ['Test blade set 1', 'Test blade sets 2 and 3', 'Record the brightness'] ] },
      { t: 'More tests', j: [
        ['Explain why the best blades work best', 'Plan two new versions', 'Share them'],
        ['Make new version 1', 'Make new version 2', 'Test them'],
        ['Test all five sets again', 'Chart them', 'Pick the best'] ] },
      { t: 'The tower', j: [
        ['Plan the tower height', 'Plan the base', 'Share the plan'],
        ['Build the base', 'Build the tower', 'Fix the motor on top'],
        ['Test at a near fan distance', 'Test at a far fan distance', 'Record both'] ] },
      { t: 'Final turbine', j: [
        ['Write the how-it-works sign', 'Draw a diagram for it', 'Read it to the group'],
        ['Fit the best blades', 'Make the turbine steady', 'Test it'],
        ['Make the results chart for visitors', 'Check it with the group', 'Print or draw the final chart'] ] },
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
        ['Find out why triangles are strong', 'Test straw squares and triangles', 'Teach it to the group'],
        ['Roll the first 15 newspaper sticks', 'Roll 15 more', 'Tape them tight'],
        ['Find out how many sticks we need', 'Work out the two lengths', 'Make a cutting list'] ] },
      { t: 'Model dome', j: [
        ['Plan the dome from a model', 'Count the joints', 'Share the plan'],
        ['Build a small straw dome', 'Fix the weak joints', 'Show it to the group'],
        ['Cut sticks to the first length', 'Cut sticks to the second length', 'Label and count them'] ] },
      { t: 'Bottom ring', j: [
        ['Explain where the weight goes in the dome', 'Draw it', 'Teach it'],
        ['Build the first half of the bottom ring', 'Build the second half', 'Join them'],
        ['Check every stick’s length', 'Fix the wrong ones', 'Check the ring is level'] ] },
      { t: 'Up to the top', j: [
        ['Plan the door', 'Mark where to leave a gap', 'Share the plan'],
        ['Build the second layer', 'Build up to the top', 'Join the top'],
        ['Plan the weight test', 'Test how much the top holds', 'Record it'] ] },
      { t: 'Door and ceiling', j: [
        ['Plan the star ceiling', 'Draw the star pattern', 'Share it'],
        ['Add the door', 'Add the star ceiling', 'Fix weak joints'],
        ['Measure the finished dome', 'Make the visitor guide', 'Check the guide with the group'] ] },
      { t: 'Open the fort', j: [
        ['Write the dome fort talk', 'Practise it', 'Lead the talk'],
        ['Finish the fort', 'Decorate it', 'Keep it safe on the day'],
        ['Plan the visitor tours', 'Show visitors round', 'Record their questions'] ] }
    ] },
  { id: 'sci-steamboat', cat: 'sci', level: 3, title: 'Pop-pop steam boat',
    what: 'A little boat with a tiny boiler made from a tin and two straws. A tea-light heats the water, and the boat chugs across a tub going “pop pop pop”. (A facilitator lights the candle.)',
    hook: 'Heat turns water into steam, and steam pushes water out to move the boat.',
    make: 'Two working steam boats and a boat race across a tub of water.',
    learn: 'Heat, steam and action and reaction',
    lo: 'We can explain how heat makes steam that pushes the boat, and show which design goes fastest.',
    plan: [
      { t: 'Steam science', j: [
        ['Find out how heat makes steam that pushes', 'Watch a kettle demo with a facilitator', 'Teach it to the group'],
        ['Plan the boiler with a facilitator', 'Build the first boiler from a tin', 'Check it with a facilitator'],
        ['Plan a fair race across the tub', 'Make the timing sheet', 'Mark the start and finish'] ] },
      { t: 'Hulls', j: [
        ['Plan two boat shapes', 'Draw them', 'Share them'],
        ['Build hull 1', 'Build hull 2', 'Waterproof both'],
        ['Test how well each hull floats', 'Record the results', 'Choose the better hull'] ] },
      { t: 'First runs', j: [
        ['Explain what makes the boat move', 'Write it up', 'Present it'],
        ['Fit the boilers', 'Test with a facilitator', 'Fix leaks'],
        ['Time boat 1 three times', 'Time boat 2 three times', 'Record all the times'] ] },
      { t: 'Faster boats', j: [
        ['Choose what to change', 'Write predictions', 'Share them'],
        ['Build a bigger boiler', 'Try a longer straw', 'Test both'],
        ['Time each change', 'Chart the results', 'Pick the race setup'] ] },
      { t: 'Race ready', j: [
        ['Write the race rules', 'Make them into a sign', 'Read them to the group'],
        ['Fix leaks', 'Make the boats steadier', 'Test both boats'],
        ['Run practice races', 'Record the times', 'Plan race-day timing'] ] },
      { t: 'Boat race', j: [
        ['Write the steam boat talk', 'Practise it', 'Lead the talk'],
        ['Get two boats race-ready', 'Fix them between races', 'Keep spares ready'],
        ['Make the race board', 'Run the boat race', 'Record the times'] ] }
    ] },

  /* ---------- Make it for LifeHub ---------- */
  { id: 'sol-snackshop', cat: 'sol', level: 1, title: 'LifeHub snack shop',
    what: 'You plan, make and sell a healthy snack at recess, like fruit cups or popcorn. You work out what to make, what it costs, the price, and how much you earn.',
    hook: 'A real shop teaches you how money works, and everyone gets a tasty snack.',
    make: 'A snack stall with a menu, price list and money box, run on at least three days.',
    learn: 'Money: cost, price and profit',
    lo: 'We can work out the cost, price and profit of our snack, and show it in a simple sales chart.',
    plan: [
      { t: 'What will sell?', j: [
        ['Plan a snack survey', 'Survey 15 Risers', 'Chart the top five snacks'],
        ['Design a first menu', 'Design a first price list', 'Get feedback from two facilitators'],
        ['Plan two test snacks', 'Make the first test batch', 'Make the second and run a taste test'] ] },
      { t: 'Costs and prices', j: [
        ['Find real shop prices for ingredients', 'Work out the cost of each snack', 'Set the prices with the group'],
        ['Design the stall sign', 'Design the price tags', 'Make a money box with a coin tray'],
        ['Make the snacks for day 1', 'Set up the stall', 'Run day 1 of the stall'] ] },
      { t: 'Open the shop', j: [
        ['Make a buyer feedback sheet', 'Ask buyers what to change', 'Write up the changes'],
        ['Change the menu or prices', 'Update the signs', 'Make a “new today” sign'],
        ['Make snacks and run day 2', 'Restock the stall', 'Run day 3'] ] },
      { t: 'Profit', j: [
        ['Add up the money from each day', 'Work out the total profit', 'Make a sales chart'],
        ['Plan the thank-you poster', 'Make it', 'Write a “next time” plan'],
        ['Clean and pack away', 'Count the leftover stock', 'Write the shopping list for next time'] ] }
    ] },
  { id: 'sol-pizzaday', cat: 'sol', level: 1, title: 'LifeHub pizza day',
    what: 'You learn how bread rises, test dough recipes, make your own sauce and toppings, and then run a pizza day where everyone makes their own pizza.',
    hook: 'Everyone loves pizza, and making it from scratch is real food science.',
    make: 'A tested pizza recipe card, and a pizza day for the whole class.',
    learn: 'Yeast and how dough rises',
    lo: 'We can explain how yeast makes dough rise, and show from our tests which place made it rise best.',
    plan: [
      { t: 'Yeast science', j: [
        ['Find out how yeast makes dough rise', 'Show it with yeast, sugar and a balloon', 'Teach it to the group'],
        ['Plan the pizza menu', 'Plan the toppings', 'Run a class vote'],
        ['Make a test dough', 'Measure the rise after an hour', 'Record the results'] ] },
      { t: 'Dough tests', j: [
        ['Plan the warm and cool dough test', 'Run the test', 'Chart the rise'],
        ['Design the pizza day plan', 'Design the sign-up sheet', 'Share them with the class'],
        ['Make tomato sauce 1', 'Make tomato sauce 2', 'Run a sauce taste test'] ] },
      { t: 'Test pizza', j: [
        ['Make the taster sheet', 'Ask testers which dough and sauce they like', 'Chart the results'],
        ['Plan the recipe card', 'Draw step-by-step pictures', 'Finish the recipe card'],
        ['Make a test pizza with the best recipe', 'Time every step', 'Write the pizza day timings'] ] },
      { t: 'Pizza day', j: [
        ['Write the yeast science talk', 'Practise it', 'Explain it on pizza day'],
        ['Make the station labels', 'Set up the pizza stations', 'Run the topping table'],
        ['Make the dough for pizza day', 'Get the sauce and toppings ready', 'Help everyone make their pizza'] ] }
    ] },
  { id: 'sol-solarcook', cat: 'sol', level: 1, title: 'Solar cooker café',
    what: 'Boxes lined with foil that bounce sunlight onto a black pot. The pot gets hot enough to melt chocolate and make s’mores, using only the sun.',
    hook: 'We can cook a treat for everyone with free energy from the sun.',
    make: 'Two solar cookers, a temperature log, and a sunny-day café for the class.',
    learn: 'Reflection and absorbing heat',
    lo: 'We can explain why shiny sides and a black pot make it hotter, and show it with our temperature log.',
    plan: [
      { t: 'Sun power', j: [
        ['Find out why shiny and black things get hot', 'Test black and white cups in the sun', 'Teach it to the group'],
        ['Plan the solar cooker', 'Draw it with measurements', 'Check it with the group'],
        ['Build the first cooker from a box and foil', 'Test it', 'Fix what does not work'] ] },
      { t: 'A better cooker', j: [
        ['Plan a temperature test every 10 minutes', 'Make the temperature log', 'Run the first test'],
        ['Design a better reflector', 'Draw the new shape', 'Share it'],
        ['Build the second cooker', 'Test it', 'Compare it with the first'] ] },
      { t: 'Testing', j: [
        ['Test both cookers on a sunny day', 'Record the temperatures', 'Chart them'],
        ['Plan the café menu', 'Set the prices', 'Make the menu'],
        ['Fix the cooker that gets less hot', 'Test it again', 'Get both cookers café-ready'] ] },
      { t: 'Sunny café', j: [
        ['Write the solar energy talk', 'Practise it', 'Lead the talk at the café'],
        ['Make the café signs', 'Set up the tables', 'Run the order table'],
        ['Get the cookers in the sun', 'Cook the treats', 'Serve them'] ] }
    ] },
  { id: 'sol-postoffice', cat: 'sol', level: 1, title: 'LifeHub post office',
    what: 'You build a mailbox for every Riser, design stamps and postcards, and run a real post office that delivers letters around LifeHub every day.',
    hook: 'Getting a letter from a friend makes anyone’s day.',
    make: 'A mailbox for every Riser, stamps and postcards, and a post office that runs for a whole week.',
    learn: 'Letter writing and sorting systems',
    lo: 'We can write a clear letter, and explain how our sorting and delivery system gets each letter to the right box.',
    plan: [
      { t: 'Plan the post', j: [
        ['Ask Risers what they would like to send', 'Write the post office rules', 'Share the rules'],
        ['Design a mailbox for every Riser', 'Design the sorting box', 'Share the designs'],
        ['Build the first three mailboxes', 'Build three more', 'Label them'] ] },
      { t: 'Stamps and rules', j: [
        ['Plan the delivery rounds', 'Plan who does what each day', 'Make the rota'],
        ['Design the stamps', 'Design postcards and a postmark', 'Make the first batch'],
        ['Build three more mailboxes', 'Build the last three', 'Build the sorting box'] ] },
      { t: 'Post week', j: [
        ['Check letters reach the right box', 'Fix mix-ups', 'Write up what went wrong'],
        ['Make more stamps and postcards', 'Run the stamp counter', 'Restock the counter'],
        ['Sort and deliver Monday’s post', 'Deliver Tuesday’s post', 'Deliver Wednesday’s post'] ] },
      { t: 'Thank you', j: [
        ['Count the letters sent each day', 'Make a chart', 'Present the chart'],
        ['Make thank-you cards', 'Write them for every Riser', 'Deliver them'],
        ['Plan the hand-over', 'Teach two Risers to run it', 'Hand over the post office'] ] }
    ] },
  { id: 'sol-puppets', cat: 'sol', level: 1, title: 'Puppet show for little ones',
    what: 'You build a puppet theatre, make puppets with moving parts, write a story and put on a show for the youngest children at LifeHub.',
    hook: 'Little ones love a puppet show, and you get to be the storytellers.',
    make: 'A puppet theatre with a curtain, a set of puppets, and a show for the younger children.',
    learn: 'Storytelling and stagecraft',
    lo: 'We can write a story with a beginning, middle and end, and make puppets with parts that move.',
    plan: [
      { t: 'Story time', j: [
        ['Ask the little ones about stories they love', 'Choose a story with them', 'Share the choice'],
        ['Sketch the theatre', 'Sketch the puppets', 'Add sizes to the sketches'],
        ['Plan the theatre frame', 'Build it', 'Make it stand steady'] ] },
      { t: 'Script and puppets', j: [
        ['Write the first half of the script', 'Write the second half', 'Give everyone a part'],
        ['Make the first puppets', 'Make the rest', 'Add moving arms or mouths'],
        ['Make the curtain', 'Add the lights', 'Test the curtain and lights'] ] },
      { t: 'Rehearse', j: [
        ['Run the first rehearsal', 'Time the show', 'Give notes'],
        ['Make the scenery', 'Make the props', 'Fix props that break'],
        ['Fix things that broke', 'Add sound effects', 'Run the second rehearsal'] ] },
      { t: 'Showtime', j: [
        ['Write the welcome', 'Practise it', 'Welcome the audience and lead the show'],
        ['Make the posters', 'Make the tickets', 'Set up the seats'],
        ['Plan the backstage jobs', 'Run the backstage: lights and curtain', 'Run the props'] ] }
    ] },
  { id: 'sol-boardgames', cat: 'sol', level: 1, title: 'Board game café',
    what: 'You invent your own board games: the board, the pieces, the cards and the rules. Then you open a game café where friends play and give you ideas to make them better.',
    hook: 'The best games are the ones you make yourself.',
    make: 'Three new board games and a game café corner with all the pieces and rule cards.',
    learn: 'Rule writing and chance',
    lo: 'We can write clear rules a new player can follow, and use what we know about dice to make our game fairer.',
    plan: [
      { t: 'Game ideas', j: [
        ['Plan questions about what makes games fun', 'Ask 10 Risers', 'Chart the answers'],
        ['Sketch game idea 1', 'Sketch games 2 and 3', 'Share them with the group'],
        ['Make a paper version of one game', 'Play it with the group', 'Note what to change'] ] },
      { t: 'Rules and boards', j: [
        ['Write the rules for game 1', 'Write the rules for games 2 and 3', 'Read them to the group'],
        ['Design board 1', 'Design boards 2 and 3', 'Design the cards'],
        ['Make the pieces for game 1', 'Make the pieces for games 2 and 3', 'Make the dice'] ] },
      { t: 'Test games', j: [
        ['Plan the test games', 'Run test games with friends', 'Write up the notes'],
        ['Change the confusing rules', 'Redesign any confusing cards', 'Share the changes'],
        ['Fix worn pieces', 'Make a box for each game', 'Pack the games'] ] },
      { t: 'Game café', j: [
        ['Write the opening talk', 'Practise teaching each game', 'Lead the opening'],
        ['Make the rule cards', 'Make the box labels', 'Make the café sign'],
        ['Plan the café corner', 'Set it up', 'Run the café'] ] }
    ] },
  { id: 'sol-newsshow', cat: 'sol', level: 1, title: 'LifeHub news show',
    what: 'You make a short video news show about what is happening at LifeHub, with news, interviews and a weather report. You plan it, film it and edit it.',
    hook: 'Families love to see what happens at LifeHub, and you get to be the reporters.',
    make: 'A 5-minute news show, shared with families at the end of the project.',
    learn: 'Script writing and video editing',
    lo: 'We can write a short script, film it clearly, and edit clips together in the right order.',
    plan: [
      { t: 'News hunt', j: [
        ['Find four news stories at LifeHub', 'Plan who to interview', 'Book the interviews'],
        ['Plan the running order', 'Design the titles', 'Share the plan'],
        ['Practise steady filming', 'Practise clear sound', 'Film a test clip'] ] },
      { t: 'Interviews', j: [
        ['Interview people for stories 1 and 2', 'Interview for stories 3 and 4', 'Pick the best answers'],
        ['Write the script for stories 1 and 2', 'Write the script for stories 3 and 4', 'Write the weather report'],
        ['Film the opening', 'Film the stories', 'Film the weather report'] ] },
      { t: 'Edit', j: [
        ['Watch the rough cut', 'List everything to fix', 'Share the list'],
        ['Add the titles', 'Add music and pictures', 'Check the timing'],
        ['Re-film the shots that did not work', 'Edit them in', 'Export the final show'] ] },
      { t: 'Screening', j: [
        ['Write the introduction', 'Practise it', 'Introduce the show and answer questions'],
        ['Make the poster', 'Make the invitations', 'Set up the screening room'],
        ['Test the screen and sound', 'Run the sound on the day', 'Play the show'] ] }
    ] },
  { id: 'sol-chillcorner', cat: 'sol', level: 2, title: 'Chill-out corner',
    what: 'You measure how loud different places at LifeHub are with a sound meter on a tablet. Then you build soft panels and cushions to make a calm, quiet corner, and measure again.',
    hook: 'Noise makes it hard to focus. A calm corner helps everyone.',
    make: 'A chill-out corner with sound panels and cushions, and before-and-after sound readings.',
    learn: 'Sound absorption',
    lo: 'We can explain why soft, bumpy surfaces soak up sound, and show the drop in our sound readings.',
    plan: [
      { t: 'Noise map', j: [
        ['Plan where to measure sound', 'Measure five places at three times of day', 'Record the readings'],
        ['Plan the noise map', 'Draw it from the readings', 'Share it with the group'],
        ['Plan the first sound panel', 'Make it from fabric and egg trays', 'Test it with the sound meter'] ] },
      { t: 'What feels calm', j: [
        ['Plan questions about feeling calm', 'Ask 15 Risers', 'Chart the answers'],
        ['Design the corner layout', 'Design the panel pattern', 'Share both'],
        ['Make panel 2', 'Make panel 3', 'Make panels 4 and 5'] ] },
      { t: 'Cushions', j: [
        ['Plan the fabric sound test', 'Test four fabrics', 'Record which soak up most sound'],
        ['Design the floor cushions', 'Choose the fabrics', 'Cut the cushion pieces'],
        ['Sew or tie the cushions', 'Make panel 6', 'Make panel 7'] ] },
      { t: 'Put it up', j: [
        ['Plan where every panel goes', 'Check the plan with a facilitator', 'Mark the wall'],
        ['Make the sign', 'Make the before-and-after chart', 'Put them up'],
        ['Hang the first panels', 'Hang the rest', 'Set up the cushions'] ] },
      { t: 'Open the corner', j: [
        ['Measure the sound again', 'Compare with week 1', 'Present the drop in noise'],
        ['Write the chill-out corner rules', 'Make them into a sign', 'Read them to the class'],
        ['Finish the corner', 'Fix anything loose', 'Run the opening'] ] }
    ] },
  { id: 'sol-gamefair', cat: 'sol', level: 2, title: 'Game fair',
    what: 'Fun games made from cardboard: throw balls into hoops, roll balls through mazes, and win tickets and small prizes. You run it at a LifeHub event.',
    hook: 'LifeHub events need fun things to do that can also raise money.',
    make: 'At least five working games, a ticket system and a price list, run at a LifeHub event.',
    learn: 'Chance, cost, price and profit',
    lo: 'We can work out the cost, price and profit of our fair, and explain whether each game is fair.',
    plan: [
      { t: 'Game ideas', j: [
        ['Ask Risers which fair games they love', 'Chart them', 'Share the top five'],
        ['Design five game ideas', 'Add sizes and materials', 'Share them'],
        ['Plan game 1', 'Build it', 'Test it'] ] },
      { t: 'Costs', j: [
        ['List the materials for every game', 'Find their costs', 'Work out the cost of each game'],
        ['Design the tickets', 'Design the prize list', 'Share them'],
        ['Build game 2', 'Build game 3', 'Test both'] ] },
      { t: 'More games', j: [
        ['Plan the fairness test', 'Test games 1 to 3', 'Record the wins'],
        ['Fix games that are too easy', 'Fix games that are too hard', 'Re-test them'],
        ['Build game 4', 'Build game 5', 'Test both'] ] },
      { t: 'Ticket booth', j: [
        ['Plan the ticket prices from the costs', 'Check them with the group', 'Make the price board'],
        ['Make the fair signs', 'Make a map of the games', 'Put them up'],
        ['Plan the ticket booth', 'Build it', 'Set it up'] ] },
      { t: 'Fair day', j: [
        ['Run the ticket booth', 'Count the money', 'Work out the profit'],
        ['Decorate the games', 'Run the prize table', 'Keep the prize list up to date'],
        ['Set up the fair', 'Run the games', 'Fix games that break'] ] }
    ] },
  { id: 'sol-escaperoom', cat: 'sol', level: 2, title: 'LifeHub escape room',
    what: 'You turn a room into an escape room. You make puzzles, secret codes and locked boxes. Teams have 30 minutes to solve them all and escape.',
    hook: 'Puzzles are the most fun when friends work them out together.',
    make: 'An escape room with at least 6 puzzles, played by other Risers and families.',
    learn: 'Codes and logic puzzles',
    lo: 'We can make and break a secret code, and explain how each puzzle leads to the next one.',
    plan: [
      { t: 'How escape rooms work', j: [
        ['Find out how escape rooms work', 'Solve two sample puzzles', 'Teach the group what makes a good puzzle'],
        ['Plan the story', 'Plan the chain of six puzzles', 'Share the plan'],
        ['Make puzzle 1', 'Make puzzle 2', 'Test both'] ] },
      { t: 'Codes', j: [
        ['Learn two secret codes', 'Make code puzzle 3', 'Make code puzzle 4'],
        ['Design the clue cards', 'Design the props', 'Make them'],
        ['Plan the locked boxes', 'Build box 1', 'Build box 2'] ] },
      { t: 'More puzzles', j: [
        ['Plan puzzles 5 and 6', 'Write their clues', 'Share them'],
        ['Design the room layout', 'Draw where each puzzle goes', 'Share it'],
        ['Make puzzle 5', 'Make puzzle 6', 'Test both'] ] },
      { t: 'Test run', j: [
        ['Plan the test run', 'Test the room with one team', 'Time them and take notes'],
        ['Fix the puzzles that were too hard', 'Fix the clue cards', 'Re-test the fixed puzzles'],
        ['Fix the props that broke', 'Make spares', 'Reset the room'] ] },
      { t: 'Escape day', j: [
        ['Write the team briefing', 'Brief each team', 'Lead the start'],
        ['Set up the room', 'Make the hint cards', 'Give hints when teams ask'],
        ['Reset the room between teams', 'Record the times', 'Make the leader board'] ] }
    ] },
  { id: 'sol-minigolf', cat: 'sol', level: 2, title: 'Mini golf course',
    what: 'A mini golf course with ramps, tunnels, bridges and bumpers, made from wood, card and pipes. Every hole has a par score.',
    hook: 'Everyone loves mini golf, and you get to design every tricky hole.',
    make: 'A 6-hole mini golf course and a scorecard, played at a LifeHub event.',
    learn: 'Angles and measuring',
    lo: 'We can measure and build each hole to size, and show how angles change where the ball goes.',
    plan: [
      { t: 'Angles', j: [
        ['Find out how angles change where a ball goes', 'Test it against a wall', 'Teach it to the group'],
        ['Design holes 1 to 3', 'Design holes 4 to 6', 'Add measurements'],
        ['Plan hole 1', 'Build hole 1', 'Test it'] ] },
      { t: 'Holes 2 and 3', j: [
        ['Plan how to set par', 'Test hole 1 and set its par', 'Share the method'],
        ['Design the ramps', 'Design the tunnels', 'Check the sizes'],
        ['Build hole 2', 'Build hole 3', 'Test both'] ] },
      { t: 'Holes 4 and 5', j: [
        ['Test holes 2 and 3', 'Set their par', 'Record the results'],
        ['Fix holes that are too easy', 'Fix holes that are too hard', 'Re-test them'],
        ['Build hole 4', 'Build hole 5', 'Test both'] ] },
      { t: 'Hole 6', j: [
        ['Plan the event and the rules', 'Write the rules', 'Share them'],
        ['Make the scorecards', 'Make the hole signs', 'Put up the signs'],
        ['Build hole 6', 'Test it', 'Fix any hole that is broken'] ] },
      { t: 'Golf day', j: [
        ['Lead the opening game', 'Explain the rules', 'Help players'],
        ['Set up the course', 'Hand out scorecards', 'Run the score board'],
        ['Keep the holes working', 'Fix things between games', 'Pack the course away'] ] }
    ] },
  { id: 'sol-recessbox', cat: 'sol', level: 2, title: 'Recess games box',
    what: 'You invent five new games for Riser Recess, make all the gear for them, and write the rules. Then you teach the games to everyone.',
    hook: 'We play the same few games at Recess every day.',
    make: 'A games box with gear and rule cards for five new games, and a games day to launch it.',
    learn: 'Rule writing, measuring and timing',
    lo: 'We can write clear rules, measure out a playing area, and time and score a game fairly.',
    plan: [
      { t: 'What we want', j: [
        ['Plan a Recess survey', 'Ask Risers what they want', 'Chart the answers'],
        ['Invent games 1 and 2', 'Invent games 3 to 5', 'Share them'],
        ['Plan the gear for game 1', 'Make it', 'Test it'] ] },
      { t: 'Rules', j: [
        ['Write the rules for games 1 to 3', 'Write the rules for games 4 and 5', 'Read them to the group'],
        ['Design the rule cards', 'Draw the pictures', 'Make the cards'],
        ['Make the gear for game 2', 'Make the gear for game 3', 'Test it'] ] },
      { t: 'More gear', j: [
        ['Test games 1 to 3 at Recess', 'Take notes', 'Share what to change'],
        ['Change the rules that did not work', 'Remake those rule cards', 'Share the changes'],
        ['Make the gear for game 4', 'Make the gear for game 5', 'Test it'] ] },
      { t: 'Fix and box', j: [
        ['Test games 4 and 5 at Recess', 'Take notes', 'Share what to change'],
        ['Design the games box', 'Design its label', 'Make the label'],
        ['Fix the gear that broke', 'Build the games box', 'Pack the box'] ] },
      { t: 'Games day', j: [
        ['Plan the games day', 'Teach game 1 to 3', 'Teach games 4 and 5'],
        ['Make the sign-up sheet', 'Run the sign-up', 'Run the schedule'],
        ['Set up the games', 'Run the games', 'Pack the box away'] ] }
    ] },
  { id: 'sol-buzzerphone', cat: 'sol', level: 2, title: 'Room-to-room buzzer phone',
    what: 'A long wire, a battery, a switch and a buzzer join two rooms. Press the switch in one room and the buzzer sounds in the other. You send messages in Morse code.',
    hook: 'We walk between rooms all day just to pass short messages.',
    make: 'A working buzzer line between two rooms, and a Morse code card for every Riser.',
    learn: 'Electric circuits and codes',
    lo: 'We can build a closed circuit with a switch, and send and read a short message in Morse code.',
    plan: [
      { t: 'Circuits', j: [
        ['Find out how a circuit with a switch works', 'Draw it', 'Teach it to the group'],
        ['Plan where the wire will run', 'Measure it', 'Draw the wire plan'],
        ['Plan the test circuit', 'Build it on the table', 'Test it'] ] },
      { t: 'Morse code', j: [
        ['Learn Morse letters A to M', 'Learn N to Z', 'Teach five letters to the group'],
        ['Design the Morse code cards', 'Draw them', 'Make the first cards'],
        ['Get the long wire ready', 'Run it between rooms', 'Fix it in place'] ] },
      { t: 'First messages', j: [
        ['Plan test messages', 'Send them', 'Count mistakes'],
        ['Make the switch easier to press', 'Test it', 'Fix it'],
        ['Find weak joins', 'Fix them', 'Test the line'] ] },
      { t: 'Both ways', j: [
        ['Plan a way to reply', 'Share the plan', 'Test the plan on paper'],
        ['Design the message rules', 'Make them into a sign', 'Put it up'],
        ['Add a second switch', 'Add a second buzzer', 'Test both ways'] ] },
      { t: 'Open the line', j: [
        ['Teach the group how to send a message', 'Teach other Risers', 'Run the first real messages'],
        ['Make the rest of the Morse cards', 'Hand them out', 'Put up the guide'],
        ['Check the line', 'Fix problems', 'Keep it working'] ] }
    ] },
  { id: 'sol-readingnook', cat: 'sol', level: 2, title: 'Reading nook makeover',
    what: 'You design and build a reading nook: cardboard stools, a bench, floor cushions and a book display, all strong enough to really use.',
    hook: 'A cosy nook makes everyone want to read.',
    make: 'A reading nook with four cardboard stools, a bench and a book display.',
    learn: 'Strength of shapes',
    lo: 'We can show that folded cardboard and short, wide columns hold more weight, and test our seats safely.',
    plan: [
      { t: 'Cosy ideas', j: [
        ['Plan questions about a cosy nook', 'Ask Risers', 'Chart the answers'],
        ['Design the nook layout', 'Draw it', 'Share it'],
        ['Plan the test stool', 'Make it', 'Check it is steady'] ] },
      { t: 'Strength', j: [
        ['Plan a safe weight test', 'Test the stool', 'Record the results'],
        ['Design the bench', 'Design the book display', 'Share the designs'],
        ['Build stool 2', 'Build stool 3', 'Test both'] ] },
      { t: 'Bench', j: [
        ['Test every seat safely', 'Record the results', 'Report any weak seats'],
        ['Design the cushions', 'Design the sign', 'Share them'],
        ['Build stool 4', 'Build the bench', 'Test it'] ] },
      { t: 'Display', j: [
        ['Ask the class which books to display', 'Choose the books', 'Make a book list'],
        ['Make the cushions', 'Make the sign', 'Put up the sign'],
        ['Plan the book display', 'Build it', 'Fix it in place'] ] },
      { t: 'Open the nook', j: [
        ['Write the reading nook rules', 'Make them into a card', 'Read them to the class'],
        ['Plan the layout on the day', 'Set up the nook', 'Add the cushions'],
        ['Fill the shelf', 'Fix anything loose', 'Run the opening'] ] }
    ] },
  { id: 'sol-mosquito', cat: 'sol', level: 2, title: 'Mosquito detectives',
    what: 'Mosquitoes lay eggs in still water. You search all of LifeHub for places where water sits, fix each one, and set little traps to check if mosquitoes are still around.',
    hook: 'In the rainy season, mosquito bites make people sick.',
    make: 'A map of every wet spot, a fix for each one, traps to check it worked, and a poster for families.',
    learn: 'Mosquito life cycle and mapping',
    lo: 'We can draw the mosquito life cycle, explain why still water matters, and map every wet spot we found.',
    plan: [
      { t: 'Life cycle', j: [
        ['Find out the mosquito life cycle', 'Draw it as a poster', 'Teach it to the group'],
        ['Plan the LifeHub map', 'Draw the map', 'Check it with the group'],
        ['Plan the search', 'Search the first half of LifeHub', 'Record every wet spot'] ] },
      { t: 'Search', j: [
        ['Search the second half of LifeHub', 'Record every wet spot', 'Share the list'],
        ['Mark every wet spot on the map', 'Colour them by type', 'Put up the map'],
        ['Plan the easy fixes', 'Tip, cover or drain the easy spots', 'Record what was fixed'] ] },
      { t: 'Traps', j: [
        ['Find out how egg traps work', 'Make the traps', 'Set them'],
        ['Plan fixes for the hard spots', 'Draw them', 'Share them'],
        ['Fix the first hard spots with a facilitator', 'Fix the rest', 'Record what was fixed'] ] },
      { t: 'Check', j: [
        ['Check the traps', 'Record what we found', 'Chart it'],
        ['Design the poster for families', 'Draw it', 'Check it with the group'],
        ['Check every spot again', 'Fix any spots holding water', 'Update the map'] ] },
      { t: 'Share', j: [
        ['Plan the talk', 'Practise it', 'Present the map and fixes'],
        ['Print or copy the posters', 'Put them up', 'Send them home'],
        ['Write a monthly check list', 'Teach the garden team', 'Hand over the list'] ] }
    ] },
  { id: 'sol-steppingstones', cat: 'sol', level: 2, title: 'Handprint stepping stones',
    what: 'You mix cement and pour it into old trays. You press in your handprints, tiles and pebbles. Then you lay the stones as a path across the garden.',
    hook: 'One part of the garden turns to mud every time it rains, and the path will carry our handprints for years.',
    make: 'A path of at least 10 decorated stepping stones.',
    learn: 'Mixing and setting cement',
    lo: 'We can mix cement, sand and water in the right amounts, and explain that cement sets by a chemical change.',
    plan: [
      { t: 'Cement science', j: [
        ['Find out how cement sets', 'Test three small mixes', 'Record which is strongest'],
        ['Design the stone patterns', 'Draw them', 'Share them'],
        ['Get the moulds ready', 'Mix and pour stones 1 and 2', 'Pour stone 3'] ] },
      { t: 'More stones', j: [
        ['Measure the path', 'Plan the spacing', 'Mark it with pegs'],
        ['Design more patterns', 'Collect tiles and pebbles', 'Plan each stone'],
        ['Pour stone 4', 'Pour stone 5', 'Pour stone 6'] ] },
      { t: 'Decorate', j: [
        ['Check the first stones are hard', 'Test them safely', 'Record the results'],
        ['Decorate stones 4 to 6', 'Add handprints', 'Add tiles and pebbles'],
        ['Pour stone 7', 'Pour stones 8 and 9', 'Pour stone 10'] ] },
      { t: 'Dig the path', j: [
        ['Plan the path line with string', 'Check it with a facilitator', 'Mark it'],
        ['Design the path sign', 'Make it', 'Paint it'],
        ['Dig the path', 'Level it', 'Add sand'] ] },
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
      { t: 'Maps', j: [
        ['Learn compass points and scale', 'Test them with a compass app', 'Teach them to the group'],
        ['Plan which part to map first', 'Plan the map size', 'Share the plan'],
        ['Get the tape ready', 'Measure the first area', 'Record the measurements'] ] },
      { t: 'Measure', j: [
        ['Measure the second area', 'Measure the third area', 'Record the measurements'],
        ['Draw the first area to scale', 'Draw the other areas', 'Check the scale'],
        ['Check the measurements on the map', 'Fix wrong ones', 'Re-measure where needed'] ] },
      { t: 'Finish the map', j: [
        ['Plan the clue trail', 'Choose the hiding spots', 'Share the plan'],
        ['Add the compass rose', 'Add the key', 'Colour the map'],
        ['Make copies of the map', 'Laminate or cover them', 'Check every copy'] ] },
      { t: 'Clues', j: [
        ['Write clues 1 to 3', 'Write clues 4 to 6', 'Read them to the group'],
        ['Make the clue cards', 'Decorate them', 'Number them'],
        ['Hide the clues', 'Mark them on the master map', 'Test the hunt with one friend'] ] },
      { t: 'Treasure hunt', j: [
        ['Write the start talk', 'Practise it', 'Lead the start'],
        ['Make the treasure', 'Set it up', 'Run the finish'],
        ['Hand out the maps', 'Run the hunt', 'Collect the clues after'] ] }
    ] },
  { id: 'sol-fashion', cat: 'sol', level: 2, title: 'Trash-to-treasure fashion show',
    what: 'You design and make outfits, bags and hats from things people throw away, like old T-shirts, newspaper, bottle caps and packets. Then you put on a fashion show.',
    hook: 'So much stuff gets thrown away that could become something cool.',
    make: 'At least three recycled outfits, a design sketchbook, and a fashion show for families.',
    learn: 'Measuring, stitching and recycling',
    lo: 'We can measure a person and cut to size, sew a simple stitch, and explain how much waste our outfits saved.',
    plan: [
      { t: 'Collect and sketch', j: [
        ['Plan what to collect', 'Sort and wash what we collected', 'Count it by type'],
        ['Look at outfit ideas together', 'Sketch three outfit designs', 'Choose the designs as a team'],
        ['Practise a running stitch', 'Practise measuring a model', 'Make a test patch from a T-shirt'] ] },
      { t: 'Outfit 1', j: [
        ['Measure model 1', 'Write the measurements on the design', 'Check the pieces fit'],
        ['Mark the pattern for outfit 1', 'Cut the pieces', 'Plan the bag or hat to match'],
        ['Stitch outfit 1', 'Glue on the bottle caps and trims', 'Try it on the model'] ] },
      { t: 'Outfit 2', j: [
        ['Weigh the waste used in outfit 1', 'Measure model 2', 'Make the waste-saved chart'],
        ['Mark and cut outfit 2', 'Make the matching bag or hat', 'Fix anything that does not fit'],
        ['Stitch outfit 2', 'Add the trims', 'Try it on the model'] ] },
      { t: 'Outfit 3', j: [
        ['Measure model 3', 'Weigh the waste in outfit 2', 'Add it to the chart'],
        ['Mark and cut outfit 3', 'Make the last bag or hat', 'Fix fit problems'],
        ['Stitch outfit 3', 'Add the trims', 'Try all three outfits on'] ] },
      { t: 'Fashion show', j: [
        ['Write the show script', 'Write what each outfit saved', 'Read the script out loud'],
        ['Make the posters', 'Plan the runway and music', 'Set up the runway'],
        ['Last fixes to the outfits', 'Practise the walk', 'Run the fashion show'] ] }
    ] },
  { id: 'sol-hideout', cat: 'sol', level: 3, title: 'Bamboo hideout',
    what: 'A hideout made of bamboo poles tied together with rope, with a shade cloth on top. It is a cool, shady place to read, rest and hang out.',
    hook: 'Every Riser wants a secret hideout outside.',
    make: 'A bamboo hideout big enough for four children to sit inside.',
    learn: 'Lashing knots and bracing',
    lo: 'We can tie a square lashing and a clove hitch without help, and explain how a diagonal pole stops a frame leaning.',
    plan: [
      { t: 'Knots', j: [
        ['Learn the square lashing', 'Practise it until it holds', 'Teach it to the group'],
        ['Learn the clove hitch', 'Sketch the hideout from three sides', 'Share the sketch'],
        ['Practise lashing two poles', 'Test if the joint wobbles', 'Fix and re-tie it'] ] },
      { t: 'Design', j: [
        ['Measure the space outside', 'Mark where the corners go', 'Check it with a facilitator'],
        ['Draw the plan with measurements', 'List the poles we need', 'Share the list'],
        ['Sort the bamboo by length', 'Mark the poles to cut', 'Saw them with a facilitator'] ] },
      { t: 'First side', j: [
        ['Plan the order of building', 'Check the knots on side 1', 'Push-test side 1'],
        ['Design the bracing poles', 'Mark where they go', 'Share the plan'],
        ['Lash the first side', 'Lash the cross pole', 'Stand it up with the group'] ] },
      { t: 'Bracing', j: [
        ['Push-test without braces', 'Push-test with braces', 'Record the difference'],
        ['Cut the diagonal braces', 'Lash the braces on side 1', 'Check the knots'],
        ['Lash side 2', 'Lash side 3', 'Join the sides'] ] },
      { t: 'Roof', j: [
        ['Measure the roof', 'Plan how the shade cloth ties on', 'Push-test the whole frame'],
        ['Cut the shade cloth', 'Make the tie points', 'Fit the cloth'],
        ['Lash the roof poles', 'Lash the last side', 'Tighten every knot'] ] },
      { t: 'Open it', j: [
        ['Write the hideout rules', 'Make the knot guide for others', 'Present how the braces work'],
        ['Make the sign', 'Plan the floor mats', 'Lay the floor'],
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
        ['Find out how slope changes speed', 'Plan the slope test', 'Record the times'],
        ['Find out how friction slows things', 'Design the short test line', 'Share the design'],
        ['Build a short test line', 'Run a toy along it', 'Change the slope and test again'] ] },
      { t: 'Test line', j: [
        ['Time runs at three slopes', 'Make a chart of the times', 'Choose the best slope'],
        ['Plan where the long line will go', 'Measure the distance', 'Check it with a facilitator'],
        ['Test two pulleys on the short line', 'Test with different weights', 'Record which runs best'] ] },
      { t: 'Basket', j: [
        ['Plan the basket test', 'Test the basket with light loads', 'Test with heavy loads'],
        ['Design the basket', 'Design the soft stopper', 'Share both designs'],
        ['Build the basket', 'Build the stopper', 'Fit them on the test line'] ] },
      { t: 'Long line', j: [
        ['Plan the safety checks', 'Check the anchor points', 'Write the checklist'],
        ['Mark the anchor points', 'Make the end platform', 'Share the plan'],
        ['Put up the long line with a facilitator', 'Tighten it', 'Do a first empty run'] ] },
      { t: 'Test runs', j: [
        ['Time runs with different loads', 'Chart the times', 'Find the best load'],
        ['Fix the basket so it stays level', 'Fix the stopper', 'Re-test'],
        ['Test the brake rope', 'Fix any rubbing parts', 'Run ten safe test runs'] ] },
      { t: 'Deliveries', j: [
        ['Write the safety rules', 'Read them to the group', 'Present how slope and friction work'],
        ['Make the sign', 'Make delivery cards', 'Put them up'],
        ['Do the last safety check', 'Run the first deliveries', 'Fix anything that went wrong'] ] }
    ] },
  { id: 'sol-booklift', cat: 'sol', level: 3, title: 'Book lift',
    what: 'A hand-wound lift with a box that goes up and down. A heavy weight on the other side of a pulley makes it easy to lift.',
    hook: 'Carrying heavy boxes of books up and down is hard work.',
    make: 'A lift that carries a box of books up to a high shelf, with a brake so it stays put.',
    learn: 'Pulleys and counterweights',
    lo: 'We can explain how a counterweight makes lifting easier, and measure the force needed with and without it.',
    plan: [
      { t: 'Pulleys', j: [
        ['Find out how a pulley works', 'Plan the pulley test', 'Record the force'],
        ['Find out what a counterweight does', 'Sketch the lift', 'Share the sketch'],
        ['Build a pulley with a cotton reel', 'Lift a small weight', 'Add a counterweight and test again'] ] },
      { t: 'Model lift', j: [
        ['Measure the force with and without a counterweight', 'Make a chart', 'Share what we found'],
        ['Plan where the real lift goes', 'Measure the height', 'Check it with a facilitator'],
        ['Build the model lift', 'Test it with books', 'Fix what goes wrong'] ] },
      { t: 'Frame', j: [
        ['Plan the frame measurements', 'List the wood we need', 'Check the list'],
        ['Design the box and brake', 'Mark the wood', 'Share the plan'],
        ['Cut the frame wood', 'Join the frame', 'Check it stands straight'] ] },
      { t: 'Box and rope', j: [
        ['Plan the load test', 'Test the frame with weight', 'Record what happened'],
        ['Build the box', 'Make the counterweight bag', 'Fit the rope'],
        ['Fit the pulley', 'Thread the rope', 'Run the empty box up and down'] ] },
      { t: 'Brake', j: [
        ['Measure the force with books', 'Measure it with the counterweight', 'Chart both'],
        ['Design the brake', 'Build it', 'Test it'],
        ['Fix the brake', 'Fix rubbing parts', 'Test with a full box of books'] ] },
      { t: 'Hand it over', j: [
        ['Write how to use it safely', 'Present how a counterweight helps', 'Teach a class how to use it'],
        ['Make the sign', 'Make the use chart', 'Put them up'],
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
        ['Find out how a lens makes a picture bigger', 'Test lenses at different distances', 'Record the distances'],
        ['Find out why the picture is upside down', 'Draw how light goes through a lens', 'Share the drawing'],
        ['Plan the first box projector', 'Build it', 'Test it in a dark room'] ] },
      { t: 'Focus', j: [
        ['Test focus distances with a phone', 'Make a focus chart', 'Choose the best distance'],
        ['Plan the movie night', 'List what we need', 'Share the plan'],
        ['Fix the projector so it holds the phone still', 'Add a slide to change focus', 'Test again'] ] },
      { t: 'Screen', j: [
        ['Measure where the screen will go', 'Work out the screen size', 'Check it with a facilitator'],
        ['Design the screen frame', 'Mark the wood or poles', 'Share the design'],
        ['Build the screen frame', 'Fit the white sheet', 'Stand it up'] ] },
      { t: 'Brightness', j: [
        ['Test the picture in different light', 'Record which is brightest', 'Present what we found'],
        ['Choose the movie with the group', 'Plan the seating', 'Mark where seats go'],
        ['Line the box with foil', 'Black out light leaks', 'Test brightness again'] ] },
      { t: 'Tickets', j: [
        ['Plan the guest list', 'Count the seats', 'Write the invite'],
        ['Make the tickets', 'Make the posters', 'Put the posters up'],
        ['Make a second projector as a spare', 'Test both', 'Fix any problems'] ] },
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
      { t: 'Books', j: [
        ['Plan the book survey', 'Survey 15 Risers', 'Chart which books they like'],
        ['Look at little libraries in photos', 'Sketch the cupboard', 'Share the sketch'],
        ['Practise measuring wood', 'Practise sawing with a facilitator', 'Practise sanding'] ] },
      { t: 'Design', j: [
        ['Measure the spot near the gate', 'Measure the books', 'Work out the shelf size'],
        ['Draw the plan with measurements', 'List the wood we need', 'Share the list'],
        ['Mark the wood', 'Cut the back and sides', 'Sand them'] ] },
      { t: 'Box', j: [
        ['Plan the borrow-and-return system', 'Make the book cards', 'Test the system with the group'],
        ['Design the sloped roof', 'Mark the roof pieces', 'Share the plan'],
        ['Join the box', 'Fit the shelf', 'Check it is square'] ] },
      { t: 'Roof', j: [
        ['Plan the rain test', 'Test wood samples with water', 'Record which stay dry'],
        ['Cut the roof pieces', 'Fit the roof', 'Seal the edges'],
        ['Make the door', 'Fit the hinge', 'Fit the catch'] ] },
      { t: 'Rain test', j: [
        ['Test it with a watering can', 'Record any leaks', 'Present how the roof keeps rain out'],
        ['Fix the leaks', 'Paint the cupboard', 'Paint the second coat'],
        ['Fix the door', 'Make the stand', 'Fix it to the stand'] ] },
      { t: 'Open it', j: [
        ['Write the library rules', 'Collect the first books', 'Sort them'],
        ['Make the sign', 'Make the book cards', 'Put them in'],
        ['Set it up by the gate', 'Fill it with books', 'Open the little library'] ] }
    ] },
  { id: 'sol-gokart', cat: 'sol', level: 3, title: 'Sports day go-kart',
    what: 'A wooden go-kart that rolls down a gentle slope, with real steering, a seat and a brake. You build it, test it and race it on sports day.',
    hook: 'Racing something you built yourself is the best feeling.',
    make: 'A go-kart that steers and stops safely, and a timed race on sports day.',
    learn: 'Gravity, friction and steering',
    lo: 'We can explain how gravity and friction change the kart’s speed, and show our timed runs and what we changed.',
    plan: [
      { t: 'Speed', j: [
        ['Find out how gravity changes speed', 'Roll a toy car down three slopes', 'Record the times'],
        ['Find out how friction slows things', 'Sketch the go-kart', 'Share the sketch'],
        ['Look at how a kart steers', 'Build a small model', 'Test it'] ] },
      { t: 'Design', j: [
        ['Measure the rider', 'Work out the kart size', 'Check it with a facilitator'],
        ['Draw the plan with measurements', 'List the wood and wheels', 'Share the list'],
        ['Mark the base wood', 'Cut it with a facilitator', 'Sand it'] ] },
      { t: 'Base', j: [
        ['Plan the safety checks', 'Check the base is strong', 'Write the checklist'],
        ['Design the steering', 'Mark where it goes', 'Share the plan'],
        ['Join the base frame', 'Fit the back axle', 'Fit the back wheels'] ] },
      { t: 'Steering', j: [
        ['Plan the steering test', 'Test turning left and right', 'Record what happened'],
        ['Design the seat and bumpers', 'Build the seat', 'Fit the bumpers'],
        ['Fit the front axle', 'Fit the steering rope', 'Test steering on flat ground'] ] },
      { t: 'Test runs', j: [
        ['Time runs on a gentle slope', 'Chart the times', 'Find what slows it'],
        ['Fix the steering', 'Design the brake', 'Build the brake'],
        ['Fit the brake', 'Test stopping', 'Fix the brake'] ] },
      { t: 'Race day', j: [
        ['Write the race rules', 'Write the safety check', 'Present our timed runs'],
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
        ['Find out why packed plastic gets hard', 'Plan the brick test', 'Test which bricks are hardest'],
        ['Sketch the bench', 'Measure the garden spot', 'Share the sketch'],
        ['Pack the first bottle bricks', 'Pack two more', 'Check them with the squeeze test'] ] },
      { t: 'Count', j: [
        ['Work out how many bricks we need', 'Make a brick chart', 'Put it up'],
        ['Draw the bench plan with measurements', 'Mark the spot', 'Share the plan'],
        ['Pack bricks', 'Pack bricks', 'Squeeze-test them'] ] },
      { t: 'Base', j: [
        ['Plan the wrapper collection', 'Collect wrappers from two rooms', 'Sort them'],
        ['Dig the base', 'Lay the first stones', 'Level them'],
        ['Pack bricks', 'Lay the first row', 'Pack more bricks'] ] },
      { t: 'Cob', j: [
        ['Find out what clay, sand and straw do', 'Plan the cob test', 'Test three mixes'],
        ['Choose the best mix', 'Mix the first cob', 'Share how it went'],
        ['Lay the second row', 'Cover it with cob', 'Pack more bricks'] ] },
      { t: 'Build up', j: [
        ['Count bricks laid', 'Update the chart', 'Present the cob test'],
        ['Mix cob', 'Cover the second row', 'Shape the seat'],
        ['Lay the last row', 'Cover it with cob', 'Pack the gaps'] ] },
      { t: 'Finish', j: [
        ['Write the bench’s story', 'Count the wrappers we saved', 'Present the story'],
        ['Make the sign', 'Smooth the bench', 'Put up the sign'],
        ['Fix any cracks', 'Make the backrest smooth', 'Open the bench'] ] }
    ] }
];
