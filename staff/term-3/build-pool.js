/* Term 3 Quests — the build pool: 72 projects (61 offered) the groups choose from, in
   two kinds, "Science in action" (sci) and "Make it for LifeHub" (sol).
   Each one has a name, what it is, the idea or reason behind it (hook),
   what the group ends up with (make), the science concept or skill they
   learn (learn), the learning outcome (lo: what they can show or explain at
   the end) and a level (1 easier, 2 medium, 3 harder). Risers never see the
   level: each group only sees the levels set for it in quest-data.js.

   resp: for each role (roles in quest-data.js ROLES), the kind of things
   that person looks after in this project. The team decides its own jobs.
   Written in very simple English so every Riser can read it.

   added: the date a project joined the pool. Newer projects come first on
   the quest picker (and on the staff page), then the older ones.
   retired: no longer offered (no space for an escape room; a go-kart is
   too much for 8–10 year olds; timers, clay pot fridge, microgreens and
   maths kits, field trip, bee garden, play space and cookbook not
   wanted; reading nook removed). Kept so teams that did it still see it
   in their finished quests. */
window.T3_POOL = [
  /* ---------- Science in action ---------- */
  { id: 'sci-lightmaze', cat: 'sci', level: 2, title: 'Light maze', added: '2026-11-23',
    what: 'You shine a torch beam into a maze and use mirrors to bounce it round five corners until it hits a target. You measure the angles to find out how mirrors work, then build a periscope to see over walls.',
    hook: 'Light bounces off a mirror at the same angle it hits it. Get the angle right, and light goes where you want.',
    make: 'A light maze with five mirror turns and a target, a periscope for each of you, and an angle chart.',
    learn: 'Light and reflection',
    lo: 'We can explain that light bounces off a mirror at the same angle it hits, and show it with our angle measurements and our maze.',
    resp: [
      ['Find out how light travels and bounces', 'Predict where the beam will go', 'Find the rule in our angle chart', 'Explain the maze to visitors'],
      ['Make the slit torch and test one mirror', 'Build the maze base with five turns', 'Fit and tune the mirrors', 'Build the periscopes'],
      ['Plan the angle test and table', 'Measure angles in and out with a protractor', 'Chart the angles', 'Run the maze challenge for visitors']
    ] },
  { id: 'sci-fizz', cat: 'sci', level: 1, title: 'Fizzy bath bomb lab', added: '2026-11-23',
    what: 'You mix baking soda and citric acid into balls that fizz when they hit water. Then you change the recipe, one thing at a time, to find the bath bomb that fizzes the longest.',
    hook: 'When an acid meets baking soda in water, they make a gas. The gas is the fizz.',
    make: 'Your own bath bomb recipes, a fizz-time chart, and a gift box of the best bath bombs.',
    learn: 'Acids, bases and gases',
    lo: 'We can explain where the fizz comes from, and show from a fair test which recipe fizzes the longest.',
    resp: [
      ['Find out why baking soda and acid fizz', 'Choose four recipe changes and predict each', 'Find out why the winner fizzes longest', 'Make the fizz science poster'],
      ['Make the first bath bomb', 'Make the four recipe changes', 'Make the winning recipe for the gift box', 'Write the recipe card'],
      ['Plan the fizz test and the results table', 'Time every bath bomb in water', 'Chart all the fizz times', 'Make the label for each bath bomb']
    ] },
  { id: 'sci-crystals', cat: 'sci', level: 1, title: 'Crystal garden', added: '2026-11-23',
    what: 'You dissolve salt, sugar and alum in hot water and hang a string in each jar. Day by day, real crystals grow. You measure them, look at them up close and make a crystal garden.',
    hook: 'Water can only hold so much salt. When it cools and dries, the extra comes back as crystals.',
    make: 'Jars of growing crystals, a crystal growth chart, and a crystal garden on show with labels.',
    learn: 'Dissolving and crystals',
    lo: 'We can explain how crystals grow from a mix, and show from our measurements which mix grows the biggest crystals.',
    resp: [
      ['Find out what dissolving means', 'Find out how crystals grow', 'Choose three mixes and predict each', 'Lead the crystal garden talk'],
      ['Make the salt, sugar and alum jars with a facilitator', 'Hang strings and pipe-cleaner shapes', 'Start a second batch to make them bigger', 'Set up the crystal garden'],
      ['Make the daily growth table', 'Measure and photograph the crystals every day', 'Draw the growth chart', 'Write the labels for the garden']
    ] },
  { id: 'sci-bridge', cat: 'sci', level: 2, title: 'Bridge breakers', added: '2026-11-23',
    what: 'You build bridges from paper, straws and sticks that cross a 50 cm gap. Then you load them with weights until they break. The strongest, lightest bridge wins.',
    hook: 'The shape of a bridge matters more than how much stuff you use. Triangles do not bend.',
    make: 'Three test bridges, one champion bridge, a load chart, and a bridge-breaking show.',
    learn: 'Forces and strong shapes',
    lo: 'We can explain why triangles and arches make a bridge strong, and show from our load tests which shape holds the most.',
    resp: [
      ['Find out about beam, arch and truss bridges', 'Predict which shape will hold most', 'Find out why the winner was strongest', 'Explain the science at the bridge-breaking show'],
      ['Build a beam bridge', 'Build an arch bridge and a truss bridge', 'Build the champion bridge, lighter and stronger', 'Set up the test stand'],
      ['Plan the load test and the results table', 'Weigh each bridge and add weights until it breaks', 'Chart weight held for each bridge', 'Make the score board for the show']
    ] },
  { id: 'sci-filter', cat: 'sci', level: 2, title: 'Muddy water challenge', added: '2026-11-23',
    what: 'You make muddy water, then build filters from bottles, sand, gravel, charcoal and cloth to make it clear. You test which filter cleans it best. (You never drink it.)',
    hook: 'Many people get their water from rivers and wells. Layers of sand and stones can trap the dirt.',
    make: 'Three bottle filters, a clearness chart, and a “before and after” water show.',
    learn: 'Filtering and clean water',
    lo: 'We can explain what each layer of a filter traps, and show from our tests which order of layers cleans water best.',
    resp: [
      ['Find out how sand and stones clean water', 'Find out why filtered water is still not safe to drink', 'Choose three filter designs and predict', 'Lead the water show'],
      ['Build the first bottle filter', 'Build two more with the layers in a different order', 'Build the best filter again, bigger', 'Set up the before-and-after jars'],
      ['Make a clearness scale from 1 to 5', 'Test each filter three times', 'Chart how clear and how fast each one is', 'Make the results board']
    ] },
  { id: 'sci-magnet', cat: 'sci', level: 3, title: 'Electromagnet crane', added: '2026-11-23',
    what: 'You wind wire round an iron nail and join it to a battery. It becomes a magnet you can switch on and off. Then you build a crane that picks up metal and drops it where you want.',
    hook: 'Electricity flowing round a coil makes a magnet. Switch it off, and the magnet is gone.',
    make: 'A working crane with an electromagnet, a turns-and-clips chart, and a scrap-yard game.',
    learn: 'Electricity and magnetism',
    lo: 'We can explain how a coil of wire becomes a magnet, and show from our tests how more turns make it stronger.',
    resp: [
      ['Find out how electricity makes a magnet', 'Predict how turns and batteries change the pull', 'Write the scrap-yard game rules', 'Explain the science before the game'],
      ['Make the first electromagnet with a facilitator', 'Make magnets with 20, 40 and 60 turns', 'Build the crane arm and the switch', 'Fit the best magnet and test the crane'],
      ['Plan the paper-clip test and results table', 'Count clips picked up for each magnet', 'Chart turns against clips', 'Keep score in the scrap-yard game']
    ] },
  { id: 'sci-weather', cat: 'sci', level: 3, title: 'LifeHub weather station', added: '2026-11-23',
    what: 'You build your own weather tools: a rain gauge, a wind vane, a spinning wind-speed cup and a thermometer box. You set them up outside, record the weather every day, and give a weather report.',
    hook: 'Weather people do not guess. They measure every day and look for patterns.',
    make: 'A weather station in the garden, a weather log for every school day, and a weather report for LifeHub.',
    learn: 'Weather and measuring over time',
    lo: 'We can explain what each weather tool measures, and show patterns in our weather log.',
    resp: [
      ['Find out what each weather tool measures', 'Find the best place for the station', 'Look for patterns in the log', 'Give the weather report'],
      ['Build the rain gauge and the wind vane', 'Build the wind-speed cups', 'Build the thermometer box', 'Set up the station and fix what breaks'],
      ['Make the weather log', 'Read every tool at the same time each day', 'Draw the temperature and rain charts', 'Make the weather report board']
    ] },
  { id: 'sci-slime', cat: 'sci', level: 1, title: 'Slime lab',
    what: 'You mix glue, water and a few other things to make slime. Then you change the recipe, one thing at a time, to make the stretchiest, bounciest or gooiest slime ever.',
    hook: 'Slime is a liquid and a solid at the same time. A tiny change to the recipe changes everything.',
    make: 'Your own slime recipes, a stretch-and-bounce test chart, and a slime stall where friends try them.',
    learn: 'Polymers and fair testing',
    lo: 'We can explain how glue turns into slime, and show from a fair test which recipe stretches the most.',
    resp: [
      ['Find out how glue turns into slime', 'Make a “how slime works” sheet', 'Choose four recipe changes and predict each', 'Make the slime science poster'],
      ['Mix the first two recipe changes', 'Mix the other two changes', 'Make the winning recipe and write the recipe card'],
      ['Plan the stretch and bounce tests', 'Make the results table', 'Draw the stretch and bounce bar charts', 'Make the voting sheet']
    ] },
  { id: 'sci-icecream', cat: 'sci', level: 1, title: 'Ice cream in a bag',
    what: 'You put milk, sugar and flavour in a small bag, and that bag inside a big bag of ice and salt. Shake it hard for ten minutes, and you have real ice cream.',
    hook: 'Salt makes ice colder than ice on its own. That is how ice cream can freeze in your hands.',
    make: 'Ice cream for the whole class, and a chart of how much colder the ice gets with salt.',
    learn: 'Freezing and melting points',
    lo: 'We can explain why salt makes ice colder, and show it with thermometer readings.',
    resp: [
      ['Find out why salt makes ice colder', 'Plan a fair test of four salt amounts', 'Write a prediction for each'],
      ['Make the first bag of ice cream', 'Make bags with all four salt amounts', 'Test the tin and improve the lid', 'Make ice cream for the whole class'],
      ['Measure plain and salty ice every minute', 'Time how long each salt amount takes', 'Chart all four salt results', 'Make a flavour survey']
    ] },
  { id: 'sci-balloon', cat: 'sci', level: 1, title: 'Balloon car race',
    what: 'You build a car from a bottle, straws and bottle-cap wheels. A balloon blows air out of the back, and the car zooms forward. Then you race.',
    hook: 'When air rushes out one way, the car shoots the other way.',
    make: 'A balloon-powered racing car, a race track, and a results board for the big race day.',
    learn: 'Action and reaction (Newton’s third law)',
    lo: 'We can explain why the air pushes the car forward, and show which changes make our car go further.',
    resp: [
      ['Find out why rushing air pushes a car', 'Choose three changes and predict each', 'Find which change helped most and why', 'Explain the science before the races'],
      ['Build the first car from a bottle, straws and caps', 'Build cars with bigger wheels and a bigger balloon', 'Build the best car, lighter and straighter', 'Build the race track and finish banner'],
      ['Mark a 5-metre track and make the results table', 'Measure the first car three times', 'Chart all the results', 'Make the results board and plan the heats']
    ] },
  { id: 'sci-planes', cat: 'sci', level: 1, title: 'Paper plane championship',
    what: 'You fold and test lots of paper planes, changing the wings, the nose and the weight. Then you hold a championship for the longest flight and the longest time in the air.',
    hook: 'Air pushes up on the wings and pushes back on the plane. Small changes make a big difference.',
    make: 'Your best planes, a test log of every flight, and a paper plane championship with a winners’ board.',
    learn: 'Lift, drag and fair testing',
    lo: 'We can explain lift and drag, and show from our flight log which wing shape flies furthest.',
    resp: [
      ['Find out about lift, drag and gravity', 'Write predictions', 'Write the championship rules', 'Lead the opening talk on lift and drag'],
      ['Fold three plane designs', 'Fold big, small and curved wings', 'Fold the best design for every player', 'Help players launch'],
      ['Fly every design three times', 'Chart every design’s best flight', 'Make the winners’ board']
    ] },
  { id: 'sci-spy', cat: 'sci', level: 1, title: 'Spy science kit',
    // Deadline extended: teams on this quest have until Wed 18 Nov 2026.
    extendTo: '2026-11-18',
    what: 'You become science spies. You write secret messages in lemon juice that only show up with heat. You also dust for fingerprints and solve a pretend mystery at LifeHub.',
    hook: 'Some liquids change colour when heated or mixed. Everyone’s fingerprints are different.',
    make: 'A spy kit with invisible ink, a fingerprint set, and a mystery for the class to solve.',
    learn: 'Chemical changes and fingerprint patterns',
    lo: 'We can explain why lemon-juice writing shows up when heated, and sort fingerprints into loops, whorls and arches.',
    resp: [
      ['Find out why lemon juice shows up when heated', 'Learn the three fingerprint patterns', 'Test the mystery on a friend', 'Lead the mystery and explain the science'],
      ['Make four invisible inks', 'Make an ink pad and dusting powder', 'Make the clue cards with ink and prints', 'Build the crime scene props'],
      ['Make the ink results table', 'Take everyone’s prints', 'Sort and chart loops, whorls and arches', 'Make the timing sheet']
    ] },
  { id: 'sci-junkband', cat: 'sci', level: 1, title: 'Junkyard band',
    what: 'You make real instruments from things at home: a rubber-band guitar, straw flutes and a water-bottle xylophone. You tune them, practise a song and play a concert.',
    hook: 'Every sound is a shake. Long, short, tight or loose changes the note.',
    make: 'A set of home-made instruments that play real notes, and a band concert for families.',
    learn: 'Sound, vibration and pitch',
    lo: 'We can show that shorter, tighter or smaller things make higher notes, and explain that sound is a vibration.',
    resp: [
      ['Find out how a vibration makes sound', 'Find out why longer and tighter changes the note', 'Choose a song and work out its notes', 'Give the talk at the concert'],
      ['Build the box guitar', 'Build a straw flute', 'Build a water-bottle xylophone', 'Build a drum and make instruments louder'],
      ['Test which band gives the highest note', 'Mark the notes on each one', 'Lead the rehearsal', 'Count the band in at the concert']
    ] },
  { id: 'sci-aircannon', cat: 'sci', level: 1, title: 'Air cannon battle',
    what: 'You make a box with a round hole. Tap the back, and a ring of air shoots out. It can knock over cups from far away. Then you hold a target battle.',
    hook: 'Air is real stuff. It takes up space and can push things.',
    make: 'Two air cannons, a cup-tower target game, and a scoreboard.',
    learn: 'Air pressure and vortex rings',
    lo: 'We can show that air can push things, and explain how a ring of air travels and knocks over cups.',
    resp: [
      ['Find out how a ring of air travels', 'Choose three hole sizes and predict', 'Write the battle rules and poster', 'Explain the poster before the battle'],
      ['Build the first air cannon from a box', 'Build cannons with small, medium and big holes', 'Build two copies of the best cannon', 'Build the cup towers'],
      ['Test each hole ten times', 'Work out the averages', 'Make the scoreboard', 'Keep score and announce the winners']
    ] },
  { id: 'sci-rocket', cat: 'sci', level: 2, title: 'Water rocket launch',
    what: 'A big soft-drink bottle with some water inside. You pump in air until it blasts off high into the sky. You change the fins, nose and water to fly higher.',
    hook: 'When the water pushes down, the rocket goes up.',
    make: 'Your own water rockets, a launch pad, and a launch day with heights measured for every flight.',
    learn: 'Action and reaction (Newton’s third law)',
    lo: 'We can explain why pushing water down sends the rocket up, and show from our measurements which amount of water flies highest.',
    resp: [
      ['Find out why pushing water down sends a rocket up', 'Write predictions', 'Plan the fin test', 'Explain the best design so far'],
      ['Build the launch pad with a facilitator', 'Build the first rocket with fins and a nose', 'Build three-fin and four-fin rockets', 'Make a parachute'],
      ['Make an angle-finder to measure height', 'Launch the fin rockets', 'Make the launch board', 'Measure and post every height']
    ] },
  { id: 'sci-coaster', cat: 'sci', level: 2, title: 'Marble roller coaster',
    what: 'A roller coaster for marbles made from paper tubes and card on a wall or a big board, with drops, hills, loops and a finish line.',
    hook: 'A marble high up has stored energy. As it drops, that turns into speed for the loops.',
    make: 'A working marble roller coaster with at least one loop, and a timing chart for each run.',
    learn: 'Stored energy and motion',
    lo: 'We can explain how height turns into speed, and show why the first drop must be higher than the loop.',
    resp: [
      ['Find out how height turns into speed', 'Draw the full plan with heights', 'Study where marbles fall off', 'Lead the tour and the science talk'],
      ['Build a test track with three drop heights', 'Build the first hill', 'Join the whole coaster', 'Add signs and decorations'],
      ['Time each drop three times', 'Measure and mark heights on the plan', 'Chart the results', 'Make the timing board']
    ] },
  { id: 'sci-claw', cat: 'sci', level: 2, title: 'Arcade claw machine',
    what: 'Like the claw game at a fair, but it runs on water. Two syringes joined by a tube work the arm and the claw, so you can grab prizes.',
    hook: 'Water can not be squashed, so a push at one end comes out at the other end.',
    make: 'A claw machine in a box that picks up small prizes, for everyone to play.',
    learn: 'Hydraulics',
    lo: 'We can explain why a push on one syringe moves the other, and show that a small syringe moves further while a big one pushes harder.',
    resp: [
      ['Find out how water passes a push along a tube', 'Plan how the arm moves', 'Draw a labelled plan', 'Plan two claw shapes'],
      ['Join syringes with a tube and test', 'Build the arm with two syringe controls', 'Fill the box with prizes', 'Keep the game working on the day'],
      ['Test small and big syringes', 'Test each claw 10 times', 'Make the high-score board', 'Make the player list']
    ] },
  { id: 'sci-egg', cat: 'sci', level: 2, title: 'Egg-stronaut lander',
    what: 'You build a space pod for a raw egg “astronaut” and drop it from higher and higher places. The egg must land without cracking.',
    hook: 'If you slow a fall down and soften the landing, the egg survives.',
    make: 'A lander with a parachute and soft padding that keeps an egg safe from a big drop.',
    learn: 'Gravity and air resistance',
    lo: 'We can explain how gravity and air push on a falling pod, and show how a parachute and padding make the landing softer.',
    resp: [
      ['Find out how gravity and air push on falling things', 'Write a prediction for each', 'Plan the big drop with a facilitator', 'Write the safety rules'],
      ['Build lander 1', 'Build lander 3', 'Build a spare', 'Repack the lander between drops'],
      ['Plan drop heights and the results table', 'Time falls with and without a parachute', 'Test from the highest safe spot', 'Plan the filming']
    ] },
  { id: 'sci-catapult', cat: 'sci', level: 2, title: 'Castle catapult battle',
    what: 'You build a castle catapult where a heavy weight drops and flings a ball. Then two teams fire soft balls at cardboard castles.',
    hook: 'A falling weight can throw a ball much further than your arm.',
    make: 'A table-top catapult, cardboard castles, and a castle battle with distances measured.',
    learn: 'Levers and stored energy',
    lo: 'We can point to the pivot, the load and the effort on our catapult, and show that a longer arm throws further.',
    resp: [
      ['Find out how a lever throws', 'Write predictions', 'Plan the castles and targets', 'Write the battle rules'],
      ['Build the frame', 'Build the weight box and sling', 'Build castle 2', 'Make the catapult aim straight'],
      ['Plan fair throws and the results table', 'Test light, medium and heavy weights', 'Make the scoreboard', 'Keep score and announce the winners']
    ] },
  { id: 'sci-buzzer', cat: 'sci', level: 2, title: 'Steady-hand buzzer game',
    what: 'A twisty wire course and a loop on a handle. Move the loop along without touching the wire. If you touch it, a buzzer goes off.',
    hook: 'When metal touches metal, the circuit closes and electricity flows.',
    make: 'A steady-hand game with easy, medium and hard courses, and a high-score board.',
    learn: 'Electric circuits',
    lo: 'We can build a closed circuit with a buzzer, and explain why touching the wire makes it buzz.',
    resp: [
      ['Find out how a circuit works', 'Draw a circuit diagram', 'Explain why the buzzer sounds when the loop touches', 'Plan start lights and a better handle'],
      ['Build a circuit with a battery and a buzzer', 'Bend the easy course', 'Bend the hard course', 'Add start lights and a comfy handle'],
      ['Test 10 materials to see which conduct', 'Time five players on the easy course', 'Set fair rules', 'Make the player list']
    ] },
  { id: 'sci-lightcards', cat: 'sci', level: 2, title: 'Light-up cards and posters',
    what: 'Greeting cards and posters with little lights that switch on. You make the circuits with copper tape, a coin battery and LEDs on paper.',
    hook: 'Electricity flows round a loop. Break the loop, and the light goes out.',
    make: 'Light-up cards for families, and a glowing poster for the classroom.',
    learn: 'Electric circuits and switches',
    lo: 'We can build a paper circuit with a switch, and explain why the LED lights only when the loop is closed.',
    resp: [
      ['Find out how an LED circuit works', 'Choose the best with the group', 'Plan the poster with five lights', 'Draw the poster circuit'],
      ['Build a paper circuit with copper tape', 'Make two light-up cards', 'Build the poster circuit', 'Wrap the cards'],
      ['Test which way round LEDs light', 'Make a check list for each card', 'Test how long the poster battery lasts', 'Chart the battery test']
    ] },
  { id: 'sci-quake', cat: 'sci', level: 2, title: 'Earthquake challenge',
    what: 'A board that you shake to make a pretend earthquake. You build towers on it and test which ones stay up. Then you make your tower stronger and try again.',
    hook: 'Some buildings fall in a shake. Some stay up. The shape makes the difference.',
    make: 'A shaking board and a city of towers that survive the biggest shake.',
    learn: 'Centre of gravity and bracing',
    lo: 'We can show that a low, wide tower with cross braces stays up longer, and explain why.',
    resp: [
      ['Find out why buildings fall in earthquakes', 'Choose three tower shapes', 'Explain why wide bases and braces help', 'Plan the city layout'],
      ['Build the shake board', 'Build towers 2 and 3', 'Build the city buildings', 'Rebuild between shakes'],
      ['Plan a fair shake and the results table', 'Shake each tower three times', 'Test every city building', 'Make the survivors board']
    ] },
  { id: 'sci-kites', cat: 'sci', level: 2, title: 'Kite festival',
    what: 'You make kites with paper, sticks and string, and try different shapes and tails. Then you hold a kite festival.',
    hook: 'The wind pushes the kite up. The string holds it in place.',
    make: 'Three tested kites, and a kite festival with prizes for highest and steadiest.',
    learn: 'Lift and drag',
    lo: 'We can explain lift and drag, and show how changing the tail or string point makes a kite fly steadier.',
    resp: [
      ['Find out about lift and drag', 'Write predictions', 'Plan the festival and prizes', 'Write the safety rules'],
      ['Build the diamond kite', 'Make three tails', 'Make two kites for visitors', 'Help visitors launch'],
      ['Plan how to test height and steadiness', 'Test the tails and string points', 'Make the judging sheet', 'Judge the prizes']
    ] },
  { id: 'sci-hand', cat: 'sci', level: 2, title: 'Robot hand',
    what: 'A big cardboard hand. Strings run along each finger. Pull a string, and that finger bends. Pull them all, and the hand grabs things.',
    hook: 'Your fingers bend because strings inside your arm pull on them.',
    make: 'A robot hand that can pick up a cup and wave hello.',
    learn: 'Tendons and joints',
    lo: 'We can explain how tendons pull our fingers, and name the parts of the hand our model copies.',
    resp: [
      ['Find out how tendons move fingers', 'Draw a labelled plan', 'Plan a stronger grip', 'Write predictions'],
      ['Draw round a hand and cut the fingers', 'Build the other two', 'Join the hand together', 'Make the hand wave hello'],
      ['Measure five real hands', 'Test how far each finger curls', 'Count pick-ups out of 10', 'Make the challenge score sheet']
    ] },
  { id: 'sci-scribble', cat: 'sci', level: 2, title: 'Scribble bots',
    what: 'Small robots made from a cup, a tiny motor, a battery and felt pens for legs. The motor makes them shake, and they draw wild patterns as they move.',
    hook: 'A wobbly motor makes the whole robot shake and move.',
    make: 'A team of scribble bots and a giant robot artwork on the wall.',
    learn: 'Motors, vibration and balance',
    lo: 'We can build a circuit with a motor, and show how moving the weight changes the way the bot moves.',
    resp: [
      ['Find out how a wobbly motor makes things move', 'Write predictions', 'Plan the giant artwork', 'Plan the colours'],
      ['Build the first bot', 'Build bots with angled pens and a bigger cup', 'Build two more bots', 'Hang the artwork'],
      ['Plan how to record movement', 'Compare the drawings', 'Plan where each bot starts', 'Show visitors round']
    ] },
  { id: 'sci-breakfast', cat: 'sci', level: 3, title: 'Breakfast machine',
    what: 'A long chain of tricks. A marble rolls and hits a block, the block falls and pushes a car, and so on. At the end, the machine pours cereal into a bowl.',
    hook: 'One small push can pass from thing to thing, all the way down the line.',
    make: 'A machine with 8 steps that pours a bowl of cereal by itself, filmed for families to watch.',
    learn: 'Chain reactions and simple machines',
    lo: 'We can point to each simple machine in our chain (ramp, lever, pulley, wheel) and explain how it passes the push to the next step.',
    resp: [
      ['Find out about ramps, levers, pulleys and wheels', 'Write what each step pushes', 'Check each step passes the push on', 'Make the labels'],
      ['Plan steps 1 to 3', 'Build steps 1 to 3', 'Build steps 6 to 8', 'Build the cereal pour'],
      ['Make the test table', 'Test the new steps five times', 'Pick the best run', 'Film the best run']
    ] },
  { id: 'sci-hovercraft', cat: 'sci', level: 3, title: 'Ride-on hovercraft',
    what: 'A round wooden board with a plastic skirt underneath and a leaf blower on top. Air fills the skirt and lifts the board, so a person can float across the floor.',
    hook: 'A cushion of air under the board takes away almost all the rubbing on the floor.',
    make: 'A hovercraft that one of you can sit on and glide across the hall.',
    learn: 'Air pressure and friction',
    lo: 'We can explain how trapped air lifts the hovercraft, and show how much easier it is to push with the air on.',
    resp: [
      ['Find out how trapped air lifts a hovercraft', 'Draw the plan', 'Plan the first safe test', 'Write the rider checklist'],
      ['Build a mini hovercraft from a CD and a balloon', 'Cut the board with a facilitator', 'Fit the leaf blower with a facilitator', 'Add the seat and handles'],
      ['Test the mini one on three floors', 'Test the skirt with a fan', 'Measure the push with air', 'Make the ride list']
    ] },
  { id: 'sci-pinball', cat: 'sci', level: 3, title: 'Cardboard pinball',
    what: 'A table game. You shoot a ball up a slope. It bounces off bumpers and rolls back down, and you hit it back up with two flippers.',
    hook: 'Slopes, bumps and springs change where a ball goes and how fast.',
    make: 'A pinball table with a ball shooter, flippers, bumpers and a score board.',
    learn: 'Angles of reflection and spring energy',
    lo: 'We can show that a ball bounces off at the same angle it hits, and explain how a spring stores and gives back energy.',
    resp: [
      ['Find out how angles change where a ball bounces', 'Plan the ball shooter', 'Plan where the bumpers go and their scores', 'Write the scoring rules'],
      ['Plan the table', 'Build the shooter and fit the spring', 'Build the bumpers', 'Build the score board'],
      ['Measure bounce angles with a protractor', 'Test three spring strengths', 'Play test games', 'Make the player list']
    ] },
  { id: 'sci-solarcar', cat: 'sci', level: 3, title: 'Solar race car',
    what: 'A small car with a solar panel and a motor. You design the body and wheels so it races as fast as possible in the sun.',
    hook: 'A solar panel turns sunlight into electricity, and a motor turns electricity into movement.',
    make: 'A solar car, a race track in the sun, and a race against the clock.',
    learn: 'Energy conversion and electric circuits',
    lo: 'We can explain how sunlight becomes movement, and show which changes made our car faster.',
    resp: [
      ['Find out how a solar panel makes electricity', 'Plan a light body and wheels', 'Spot what slows the car down', 'Write the race rules'],
      ['Wire the panel to the motor', 'Fit gear setup 1', 'Make the wheels straighter', 'Keep spare parts ready'],
      ['Plan fair races and mark a test track', 'Time gear setup 1', 'Run test races', 'Post the times']
    ] },
  { id: 'sci-turbine', cat: 'sci', level: 3, title: 'Wind power',
    what: 'A small windmill with blades you design. When the wind spins the blades, they turn a tiny motor that makes electricity and lights up an LED.',
    hook: 'Spinning a motor makes electricity.',
    make: 'A wind turbine that lights an LED in front of a fan, and a chart of which blades work best.',
    learn: 'Energy conversion and electric circuits',
    lo: 'We can build a closed circuit, explain how wind becomes light, and show how blade shape changes the power.',
    resp: [
      ['Find out how spinning a motor makes electricity', 'Write predictions', 'Plan two new versions', 'Plan the tower and base'],
      ['Build the test stand with a motor and an LED', 'Make blade sets 2 and 3', 'Make new version 2', 'Build the base and tower'],
      ['Plan the blade tests', 'Pick the best', 'Make the results chart', 'Answer their questions']
    ] },
  { id: 'sci-fort', cat: 'sci', level: 3, title: 'Giant dome fort',
    what: 'A dome big enough to sit inside, made from rolled-up newspaper sticks taped into triangles. It is strong, even though it is made of paper.',
    hook: 'Triangles share the weight, so the whole dome stays strong.',
    make: 'A paper dome fort the group can sit in, with a door and a star ceiling.',
    learn: 'Triangles and load sharing',
    lo: 'We can explain how triangles share weight, and measure and cut many sticks to the same length.',
    resp: [
      ['Find out why triangles are strong', 'Count the joints', 'Plan the star ceiling', 'Plan the weight test'],
      ['Roll 30 newspaper sticks', 'Build the first half of the bottom ring', 'Build up to the top', 'Add the star ceiling'],
      ['Work out how many sticks and the two lengths', 'Check every stick’s length', 'Measure the finished dome', 'Show visitors round']
    ] },
  { id: 'sci-steamboat', cat: 'sci', level: 3, title: 'Pop-pop steam boat',
    what: 'A little boat with a tiny boiler made from a tin and two straws. A tea-light heats the water, and the boat chugs across a tub going “pop pop pop”. (A facilitator lights the candle.)',
    hook: 'Heat turns water into steam, and steam pushes water out to move the boat.',
    make: 'Two working steam boats and a boat race across a tub of water.',
    learn: 'Heat, steam and action and reaction',
    lo: 'We can explain how heat makes steam that pushes the boat, and show which design goes fastest.',
    resp: [
      ['Find out how heat makes steam that pushes', 'Plan two boat shapes', 'Choose what to change and predict', 'Write the race rules'],
      ['Plan the boiler with a facilitator', 'Build hull 1', 'Build a bigger boiler', 'Keep spares ready'],
      ['Plan a fair race across the tub', 'Test how well each hull floats', 'Chart the results', 'Make the race board']
    ] },

  /* ---------- Make it for LifeHub ---------- */
  { id: 'sol-foosball', cat: 'sol', level: 2, title: 'Tabletop football table', added: '2026-11-23',
    what: 'You build a tabletop football (foosball) game for LifeHub from wood and strong card. Rods go through the sides with players on them. Turn a rod and the players kick the ball. Both teams must get exactly the same pitch, so it is fair. Then you run a recess tournament.',
    hook: 'Turn a rod and a player kicks. That is a lever, and getting the kick just right is the hard part.',
    make: 'A working tabletop football table with 4 rods a side, goals and a score counter, the rules, and a recess tournament.',
    learn: 'Science: levers and forces. Maths: measuring and symmetry',
    lo: 'We can explain how turning a rod makes a player kick (a lever), test how player length changes the kick, and show with measurements that both halves of the pitch are the same.',
    resp: [
      ['Find out how a turning rod makes a lever that kicks', 'Test short and long player legs: which kicks the ball furthest?', 'Write the rules and the tournament plan', 'Run the tournament and keep the scores'],
      ['Draw the table with exact sizes, both halves the same', 'Plan where each rod and player goes', 'Check with a ruler that both halves match (symmetry)', 'Make the score counter and the team colours'],
      ['Build a card model with one rod', 'Build the box and the goals with a facilitator', 'Fit the rods and players', 'Fix what breaks after 20 test games']
    ] },
  { id: 'sol-musicwall', cat: 'sol', level: 1, title: 'Outdoor music wall', added: '2026-11-23',
    what: 'You turn a fence or wall into a giant instrument. Pipes cut to different lengths, pots, pans and bottles, all tuned to real notes, with beaters on strings. Everyone can play it at break. You find the pattern between length and note, and write easy songs to play.',
    hook: 'Longer pipes make lower notes. Find the pattern, and you can tune a whole wall.',
    make: 'A music wall with at least 8 tuned notes, beaters, a song card with 3 easy songs, and a first concert.',
    learn: 'Science: sound and pitch. Maths: measuring and patterns',
    lo: 'We can explain that sound is a vibration and that longer pipes make lower notes, measure and cut pipes to tune them, and show the pattern in a chart.',
    resp: [
      ['Find out how a vibration makes a sound', 'Test pipes of different lengths and listen for high and low', 'Find the pattern: length against note, in a chart', 'Teach everyone how to play'],
      ['Plan the wall: which notes go where', 'Measure each pipe length before cutting', 'Write 3 easy songs as colour or number cards', 'Make the sign for the wall'],
      ['Cut and test the first pipes with a facilitator', 'Tune each pipe by trimming it', 'Hang pipes, pots and beaters on the wall', 'Fix and retune after a week of playing']
    ] },
  { id: 'sol-sciencekits', cat: 'sol', level: 2, title: 'Take-home science kits', added: '2026-11-23',
    what: 'Co-op families teach at home, and science is the hardest to set up. You design four science kits that families borrow, one each on magnets, floating and sinking, dissolving, and light and shadows: everything needed for one experiment in a box, with a card so clear that a family can do it with no help. A real family tests every kit, and you fix what went wrong.',
    hook: 'Anyone can do an experiment with a teacher there. A kit that works with nobody to help is real design.',
    make: 'Four science kits in boxes, an instruction card for each, a borrowing sheet, and test reports from real families.',
    learn: 'Science: magnets, floating and sinking, dissolving, light and shadows',
    lo: 'We can explain the science in all four kits and answer “why?” questions about it, write instructions a family can follow alone, and show what we changed after each family tested it.',
    resp: [
      ['Ask 5 families which of the four topics they find hard at home', 'Learn the science of each topic and test it yourselves', 'Watch a family use a kit and note every problem', 'Find out what families learned from each kit'],
      ['Choose one experiment for each topic', 'Write and draw the instruction card for each', 'Make the borrowing sheet and the restock list', 'Fix the cards after each family test'],
      ['Collect and pack everything for each kit', 'Make the boxes strong and labelled', 'Restock kits when they come back', 'Make the final four kits ready to lend']
    ] },
  { id: 'sol-playspace', cat: 'sol', level: 2, title: 'Design our play space', retired: true, added: '2026-11-23',
    what: 'What would make LifeHub’s outdoor space more fun? You ask everyone, measure the space, and build a model of your design to scale. Then you pitch it to the parents and facilitators. Everyone votes for one part, like a mud kitchen, a water wall or a ball-run wall, and you build it.',
    hook: 'Real designers ask the people who will use the space, make a model, and win a yes before they build.',
    make: 'A survey, a measured scale model of the play space, a pitch to parents, and the winning part built for real.',
    learn: 'Maths: measuring, area, perimeter and scale',
    lo: 'We can measure a space, work out its area and perimeter, build a model to scale, explain our design with what people told us, and build the part everyone chose.',
    resp: [
      ['Ask 15 Risers and parents what would make the space more fun', 'Find out what makes play safe', 'Count the votes after the pitch', 'Watch Risers play with the new part and ask what they think'],
      ['Measure the space and draw the plan', 'Work out the area and perimeter of the space and of each part', 'Make the scale: 1 cm for every 50 cm', 'Make the slides for the pitch', 'Draw the plan for the winning part'],
      ['Build the scale model', 'Give the pitch to parents and facilitators', 'Collect the materials', 'Build the winning part with a facilitator']
    ] },
  { id: 'sol-cookbook', cat: 'sol', level: 1, title: 'LifeHub family cookbook', retired: true, added: '2026-11-23',
    what: 'Every co-op family has a favourite dish. You collect the recipes, test some no-cook ones, work out how much is needed for 2 people or for 20, take photos, and make a real cookbook for every family.',
    hook: 'A recipe only works if the amounts are right. Making it for 20 people means getting the maths right.',
    make: 'A printed cookbook with a recipe from every family, photos, amounts for different sizes, and a cookbook tasting day.',
    learn: 'Maths: doubling, halving, fractions and measuring units',
    lo: 'We can double and halve amounts, including fractions like ½ and ¼ cup, and change between g and kg or ml and l, write steps someone else can follow, and show our cookbook to the families.',
    resp: [
      ['Ask every family for a favourite recipe and its story', 'Find out the measuring words: cups, spoons, grams', 'Test two no-cook recipes', 'Ask families what they think of the cookbook'],
      ['Plan the cookbook pages', 'Write each recipe in clear steps', 'Work out amounts for half and double', 'Design the cover and the contents page'],
      ['Photograph the dishes', 'Make the pages', 'Print and bind the cookbooks', 'Set up the tasting day']
    ] },
  { id: 'sol-pollinators', cat: 'sol', level: 1, title: 'Bee and butterfly garden', retired: true, added: '2026-11-23',
    what: 'Bees and butterflies are disappearing. You count the insects in the LifeHub garden, plant the flowers they need, build a bee hotel, and count again to see if more come.',
    hook: 'One in three bites of our food needs a bee or a butterfly. Gardens can help them.',
    make: 'A flower patch for bees and butterflies, a bee hotel, a before-and-after insect count, and a garden guide.',
    learn: 'Science: pollination and habitats. Maths: averages and area',
    lo: 'We can explain how bees and butterflies help plants make seeds and fruit, work out the average count per day before and after, and show from our counts whether our garden brought more of them.',
    resp: [
      ['Count bees and butterflies in the garden for 10 minutes a day', 'Find out which flowers they need', 'Count again after planting', 'Find out if more came, and why'],
      ['Plan the flower patch: area in m² and how many plants fit', 'Plan the bee hotel with sizes', 'Make the count chart', 'Make the garden guide with pictures'],
      ['Dig and plant the patch', 'Build the bee hotel from wood and bamboo', 'Water and weed every day', 'Put up the guide']
    ] },
  { id: 'sol-mathkits', cat: 'sol', level: 2, title: 'Maths kit makers', retired: true, added: '2026-11-23',
    what: 'Younger Risers learn maths best with things they can hold. You find out what the facilitators teach next, then make a class set of maths tools: fraction strips, place-value blocks, geoboards and clocks with hands that turn. Every piece must be exact, because a wrong piece teaches wrong maths.',
    hook: 'A fraction strip that is 2 mm too long teaches the wrong answer. Making tools for others means getting it exactly right.',
    make: 'A class set of maths tools in labelled boxes, a how-to card for each, and a maths lesson you help teach with them.',
    learn: 'Fractions, place value and measuring exactly',
    lo: 'We can measure and cut to the millimetre, explain the maths each tool teaches, and show younger Risers how to use it.',
    resp: [
      ['Ask facilitators what they teach next and which tools help', 'Find out how each tool teaches its maths', 'Check every piece against the plan', 'Try the tools with 3 younger Risers and note what goes wrong'],
      ['Choose four tools and plan how many of each', 'Draw each piece with exact sizes', 'Make the how-to card for each tool', 'Plan the lesson you help teach'],
      ['Make one test piece of each tool', 'Make the full class set', 'Fix any piece that is not exact', 'Box and label the sets']
    ] },
  { id: 'sol-fieldtrip', cat: 'sol', level: 2, title: 'Plan our field trip', retired: true, added: '2026-11-23',
    what: 'You plan a real field trip for the co-op, from start to finish. Ask everyone where to go, work out the cost for each family, make the timetable, the safety plan and the packing list. Then present it to the parents. If they say yes, you run the trip on the day.',
    hook: 'Trips happen because someone plans them. This time, it is you.',
    make: 'A trip plan with a cost sheet, timetable, safety plan and packing list, a talk to parents, and the trip itself.',
    learn: 'Maths: money and time (cost per family, how long things take)',
    lo: 'We can add up a trip’s cost and share it per family, work out how long each part takes to make a timetable, plan for safety, and explain our plan to parents.',
    resp: [
      ['Ask every Riser and parent where to go and why', 'Find out the cost, opening times and rules of the top 3 places', 'Find out what could go wrong and how to stop it', 'Ask everyone after the trip what went well'],
      ['Make the cost sheet: travel, tickets and food per family', 'Make the timetable from leaving to getting back', 'Make the packing list and the permission slip', 'Make the slides for the parents’ talk'],
      ['Count the votes and choose the place', 'Write the safety plan with a facilitator', 'Give the talk to parents and answer questions', 'Lead the groups and do head counts on the day']
    ] },
  { id: 'sol-timers', cat: 'sol', level: 2, title: 'Timers for every room', retired: true, added: '2026-11-23',
    what: 'LifeHub rooms need to time things: two minutes of tooth brushing, five minutes of clean-up, a turn on the swing. You build sand timers and water clocks from bottles, and tune them until each one is right to within 5 seconds. Then every room gets a set.',
    hook: 'People timed things with sand and water for thousands of years. Getting one exactly right is harder than it looks.',
    make: 'A set of 1, 2 and 5 minute timers for every room, a tuning chart, and a timer guide.',
    learn: 'Measuring time, flow and fair testing',
    lo: 'We can explain how hole size and amount change the time, and show from our tuning chart that every timer is right to within 5 seconds.',
    resp: [
      ['Ask each room what they need to time', 'Find out how hole size and amount change the flow', 'Check every finished timer with a stopwatch', 'Teach each room how to use their set'],
      ['Plan the set: which times, how many', 'Make the tuning chart', 'Draw how the timers are built', 'Make the timer guide and labels'],
      ['Build a test timer and time it', 'Change the hole or amount until it is right', 'Build a full set', 'Build the sets for every room']
    ] },
  { id: 'sol-cart', cat: 'sol', level: 3, title: 'LifeHub cargo cart', added: '2026-11-23',
    what: 'Books, plants, sports gear and water bottles get carried around LifeHub by hand. You design and build a pull cart with four wheels, front wheels that steer, and a brake. It must carry 20 kg across LifeHub without tipping. Nobody rides it.',
    hook: 'Wheels make heavy things easy to move. Getting them to steer, hold a load and stop is the hard part.',
    make: 'A pull cart that carries 20 kg, steers round corners and stops with a brake, and a delivery week round LifeHub.',
    learn: 'Wheels and axles, friction and strong frames',
    lo: 'We can explain how wheels and axles cut friction, show our cart carries 20 kg round a test course, and show what we changed after each test.',
    resp: [
      ['Ask each room what they carry and how heavy it is', 'Find out how wheels and axles cut friction', 'Time the test course with 5, 10 and 20 kg', 'Run the delivery week and count the trips'],
      ['Draw the plan with measurements', 'Plan the steering and the brake', 'Mark the test course with a corner and a slope', 'Make the delivery booking sheet'],
      ['Build a small model with steering', 'Build the frame and fit the axles with a facilitator', 'Fit the steering, the handle and the brake', 'Fix what breaks in the load test']
    ] },
  { id: 'sol-claypot', cat: 'sol', level: 1, title: 'Clay pot fridge', retired: true, added: '2026-11-23',
    what: 'A fridge with no electricity. You put one clay pot inside a bigger one, fill the gap with wet sand, and the water drying off keeps the inside cool. You build three designs, find the coolest, and the kitchen uses the winner to keep fruit and vegetables fresh.',
    hook: 'Millions of homes have no fridge. When water dries off, it takes heat with it.',
    make: 'Three test fridges, a temperature chart, a freshness test, and the best fridge working in the LifeHub kitchen.',
    learn: 'Evaporation and cooling',
    lo: 'We can explain why drying water cools the pot, and show from our readings and our freshness test which design keeps food coolest and freshest.',
    resp: [
      ['Find out how drying water takes heat away', 'Ask the kitchen what spoils fastest', 'Choose what to change in each design, and predict', 'Explain why the winner is coolest'],
      ['Draw three designs with sizes', 'Plan the temperature and freshness tests', 'Make the results table', 'Make the how-to-use card for the kitchen'],
      ['Build fridge 1 with wet sand', 'Build fridges 2 and 3 with one change each', 'Wet them every day and fix cracks', 'Build the best one again for the kitchen']
    ] },
  { id: 'sol-handwash', cat: 'sol', level: 3, title: 'Foot-pedal handwash station', added: '2026-11-23',
    what: 'Taps get touched by dirty hands all day. You design and build a handwash station where you press a pedal with your foot for water and soap, so your hands never touch anything. Then you prove it uses less water than the tap.',
    hook: 'Most germs pass from hand to tap to hand. A pedal stops that, and can save water too.',
    make: 'A working foot-pedal handwash station with water and soap, a water-use test, and a test of 50 handwashes.',
    learn: 'Levers and pulleys',
    lo: 'We can explain how our pedal turns a push of the foot into water flowing, and show from our test that it uses less water per wash than the tap.',
    resp: [
      ['Find out how levers and pulleys pass a push along', 'Measure how much water one tap handwash uses', 'Watch 10 people use the station and note problems', 'Work out water saved per wash and per week'],
      ['Sketch three pedal ideas', 'Draw the plan with sizes and the cutting list', 'Plan the 50-wash test', 'Make the how-to-use sign'],
      ['Build a small model of the pedal', 'Build the frame and water pedal with a facilitator', 'Add the soap pedal', 'Fix what breaks in the 50-wash test']
    ] },
  { id: 'sol-vending', cat: 'sol', level: 3, title: 'LifeHub vending machine', added: '2026-11-23',
    what: 'You build a real vending machine from wood and card. Put in the right coin, and one snack drops out. Put in the wrong coin, and you get it back. Then you stock it and run it for a week.',
    hook: 'Vending machines check the coin and drop one item, with no person there. Every part has to work every time.',
    make: 'A coin-operated vending machine that sells one snack per coin, rejects wrong coins, and keeps a record of money and stock.',
    learn: 'Mechanisms, and money: cost, price and profit',
    lo: 'We can explain how our machine checks a coin and drops one snack, show that it works 20 times out of 20, and show our money and stock record.',
    resp: [
      ['Find out how a coin checker and a drop work', 'Measure our coins and choose the one the machine takes', 'Work out the cost, price and profit of the snacks', 'Count the money and stock every day'],
      ['Sketch the coin path and the drop', 'Draw the plan with sizes', 'Plan the 20-coin test', 'Design the front, the price sign and instructions'],
      ['Build a card model of the coin path', 'Build the drop that lets out one snack', 'Build the wooden case with a facilitator', 'Fix it until it works 20 out of 20']
    ] },
  { id: 'sol-watering', cat: 'sol', level: 3, title: 'Self-watering garden', added: '2026-11-23',
    what: 'Who waters the LifeHub plants over the December holiday? Nobody. You design and build a drip system with a raised tank, pipes and drippers that gives every plant the right water by itself, and test it over a weekend before the holiday.',
    hook: 'Plants die in two days without water. A good system keeps them alive with nobody there.',
    make: 'A tank-and-drip system that waters the garden by itself, a drip-rate test, and plants still alive after the weekend test.',
    learn: 'Water flow, gravity and fair testing',
    lo: 'We can explain how height and hole size change the drip rate, and show our plants stayed healthy over the weekend with nobody watering them.',
    resp: [
      ['Find out how much water each plant needs a day', 'Find out how height and hole size change the drip', 'Check every plant’s soil after the weekend', 'Work out if the tank lasts the holiday'],
      ['Map the garden and measure the pipe lengths', 'Plan the drip-rate test', 'Draw the full system with tank height', 'Make the shopping list within the budget'],
      ['Build a test dripper and time it', 'Raise the tank on a strong stand with a facilitator', 'Lay the pipes and fit a dripper at every plant', 'Fix leaks and blocks']
    ] },
  { id: 'sol-microgreens', cat: 'sol', level: 1, title: 'Microgreens farm', retired: true, added: '2026-11-23',
    what: 'Microgreens are baby plants you can eat in about ten days. You grow trays of them, like mustard, fenugreek (methi) and green gram, and give the harvest to the LifeHub kitchen.',
    hook: 'Fresh, healthy food can grow on a windowsill, and fast.',
    make: 'Trays of microgreens, a growth chart, and a harvest for the LifeHub kitchen.',
    learn: 'What plants need to grow',
    lo: 'We can grow microgreens, and show from our chart how light and water change how fast they grow.',
    resp: [
      ['Find out what seeds need to sprout', 'Ask the kitchen which greens they would use', 'Find out which seeds grew best and why', 'Write a microgreens recipe card'],
      ['Plan the trays and where they go', 'Plan the light test: sun and shade', 'Make the growth chart', 'Make labels for each tray'],
      ['Make trays from old boxes and bottles', 'Soak and sow the seeds', 'Water every day', 'Harvest and wash the greens']
    ] },
  { id: 'sol-snackshop', cat: 'sol', level: 1, title: 'LifeHub snack shop',
    what: 'You run a real no-cook snack business, like fruit cups or trail mix. Find out what Risers want, work out costs and prices, design your brand, take orders, then make and sell on one sale day.',
    hook: 'A real shop teaches you how money works, and everyone gets a tasty snack.',
    make: 'A snack brand with a name and packaging, an order form, a no-cook recipe card, one sale day and a money report.',
    learn: 'Money: cost, price and profit',
    lo: 'We can work out the cost, price and profit of our snack, take orders before we make it, and show our sales in a money report.',
    resp: [
      ['Plan a snack survey and ask 15 Risers', 'Work out the cost and price of each snack', 'Add up each day’s money', 'Work out the profit and make a chart'],
      ['Design the menu and price list', 'Make a money box with a coin tray', 'Make a “new today” sign', 'Make the thank-you poster'],
      ['Make two test snacks', 'Run a taste test', 'Make snacks and run day 2', 'Run day 3 and pack away']
    ] },
  { id: 'sol-pizzaday', cat: 'sol', level: 1, title: 'LifeHub pizza day',
    what: 'You learn how bread rises, test dough recipes, make your own sauce and toppings, and then run a pizza day where everyone makes their own pizza.',
    hook: 'Everyone loves pizza, and making it from scratch is real food science.',
    make: 'A tested pizza recipe card, and a pizza day for the whole class.',
    learn: 'Yeast and how dough rises',
    lo: 'We can explain how yeast makes dough rise, and show from our tests which place made it rise best.',
    resp: [
      ['Find out how yeast makes dough rise', 'Plan the warm and cool dough test', 'Write the pizza day timings', 'Explain the science on pizza day'],
      ['Plan the menu and toppings', 'Run a class vote', 'Draw the step-by-step recipe card', 'Make the station labels and sign-up sheet'],
      ['Make a test dough and measure the rise', 'Run a sauce taste test', 'Make the dough and sauce for pizza day', 'Help everyone make their pizza']
    ] },
  { id: 'sol-solarcook', cat: 'sol', level: 1, title: 'Solar cooker café',
    what: 'Boxes lined with foil that bounce sunlight onto a black pot. The pot gets hot enough to melt chocolate and make s’mores, using only the sun.',
    hook: 'We can cook a treat for everyone with free energy from the sun.',
    make: 'Two solar cookers, a temperature log, and a sunny-day café for the class.',
    learn: 'Reflection and absorbing heat',
    lo: 'We can explain why shiny sides and a black pot make it hotter, and show it with our temperature log.',
    resp: [
      ['Find out why shiny and black things get hot', 'Plan a temperature test every 10 minutes', 'Make the temperature log', 'Chart the temperatures'],
      ['Design the solar cooker with measurements', 'Design a better reflector', 'Plan the café menu and prices', 'Make the menu and café signs'],
      ['Build the first cooker from a box and foil', 'Build the second cooker', 'Cook and serve the treats']
    ] },
  { id: 'sol-postoffice', cat: 'sol', level: 1, title: 'LifeHub post office',
    what: 'You build a mailbox for every Riser, design stamps and postcards, and run a real post office that delivers letters around LifeHub every day.',
    hook: 'Getting a letter from a friend makes anyone’s day.',
    make: 'A mailbox for every Riser, stamps and postcards, and a post office that runs for a week.',
    learn: 'Maths: weighing, price bands and data',
    lo: 'We can weigh letters and parcels and price them by weight band, chart how many letters each day, and explain how our sorting gets each letter to the right box.',
    resp: [
      ['Write the post office rules', 'Plan the delivery rounds', 'Check letters reach the right box', 'Count the letters sent each day and make a chart'],
      ['Set the price bands by weight: up to 20 g, 50 g, 100 g', 'Design a mailbox for every Riser', 'Design stamps, postcards and a postmark', 'Make more stamps and postcards', 'Make thank-you cards for every Riser'],
      ['Build six mailboxes', 'Build the sorting box and set up the scales', 'Deliver Tuesday’s post', 'Deliver Wednesday’s post and hand over']
    ] },
  { id: 'sol-puppets', cat: 'sol', level: 1, title: 'Puppet show for little ones',
    what: 'You build a puppet theatre, make puppets with moving parts, write a story and put on a show for the youngest children at LifeHub.',
    hook: 'Little ones love a puppet show, and you get to be the storytellers.',
    make: 'A puppet theatre with a curtain, a set of puppets, and a show for the younger children.',
    learn: 'Science: levers and light and shadows',
    lo: 'We can make puppet parts move with levers and explain how, show how moving a puppet nearer the light makes its shadow bigger, and tell a story with a beginning, middle and end.',
    resp: [
      ['Choose a story with the little ones', 'Find out how levers move a puppet’s arms and mouth', 'Write the script, with one shadow-puppet scene', 'Write the welcome', 'Welcome the audience and lead the show'],
      ['Sketch the theatre and puppets', 'Make the first puppets with lever parts', 'Test shadow size at 3 distances from the lamp and chart it', 'Make the props', 'Make the posters and tickets'],
      ['Build the theatre frame', 'Make the curtain', 'Add lights and sound effects', 'Run backstage: lights and curtain']
    ] },
  { id: 'sol-boardgames', cat: 'sol', level: 1, title: 'Board game café',
    what: 'You invent your own board games: the board, the pieces, the cards and the rules. Then you open a game café where friends play and give you ideas to make them better.',
    hook: 'The best games are the ones you make yourself.',
    make: 'Three new board games and a game café corner with all the pieces and rule cards.',
    learn: 'Maths: chance and probability',
    lo: 'We can roll dice 100 times, tally and chart the results, explain which totals come up most, use it to make our game fairer, and write clear rules.',
    resp: [
      ['Ask 10 Risers what makes games fun', 'Roll two dice 100 times, tally the totals and chart them', 'Write the rules for game 1', 'Run test games with friends', 'Lead the café opening'],
      ['Sketch three game ideas', 'Design boards 2 and 3 and the cards', 'Make the rule cards and box labels', 'Make the café sign'],
      ['Make a paper version of one game', 'Make the pieces for game 1', 'Make the pieces for games 2 and 3', 'Make a box for each game']
    ] },
  { id: 'sol-newsshow', cat: 'sol', level: 1, title: 'LifeHub news show',
    what: 'You are LifeHub\'s news team. You find real stories, interview people, write a proper script, film it and edit it into a news show for families.',
    hook: 'Families love to see what happens at LifeHub, and you get to be the reporters.',
    make: 'A LifeHub news show of 10 minutes or more, with at least 4 stories, an interview and a weather report.',
    learn: 'Maths: surveys, charts and timing',
    lo: 'We can run a survey and show the results as a chart in the news, time every part so the show fits 10 minutes, and write and film a clear news script.',
    resp: [
      ['Find three news stories at LifeHub', 'Run a LifeHub survey for the “numbers story”', 'Interview for story 3', 'Write the introduction', 'Introduce the show and answer questions'],
      ['Plan the running order, timing every part in seconds', 'Make the survey chart for the show', 'Write the script for stories 1 and 2', 'Add titles, music and pictures', 'Make the poster and invitations'],
      ['Film the opening', 'Film the stories and weather', 'Re-film shots that did not work', 'Edit and export the final show']
    ] },
  { id: 'sol-chillcorner', cat: 'sol', level: 2, title: 'Chill-out corner',
    what: 'You measure how loud different places at LifeHub are with a sound meter on a tablet. Then you build soft panels and cushions to make a calm, quiet corner, and measure again.',
    hook: 'Noise makes it hard to focus. A calm corner helps everyone.',
    make: 'A chill-out corner with sound panels and cushions, and before-and-after sound readings.',
    learn: 'Sound absorption',
    lo: 'We can explain why soft, bumpy surfaces soak up sound, and show the drop in our sound readings.',
    resp: [
      ['Plan where to measure sound', 'Draw the noise map', 'Mark the wall', 'Compare with week 1'],
      ['Ask 15 Risers what feels calm', 'Design the panel pattern', 'Make the sign and rules', 'Put up the sign and chart'],
      ['Test four fabrics for soaking up sound', 'Make panels 2 and 3', 'Sew or tie the cushions', 'Hang the first panels']
    ] },
  { id: 'sol-gamefair', cat: 'sol', level: 2, title: 'Game fair',
    what: 'Fun games made from cardboard: throw balls into hoops, roll balls through mazes, and win tickets and small prizes. You run it at a LifeHub event.',
    hook: 'LifeHub events need fun things to do that can also raise money.',
    make: 'Four working games, a ticket booth and a price list, run at a LifeHub event.',
    learn: 'Chance, cost, price and profit',
    lo: 'We can work out the cost, price and profit of our fair, and explain whether each game is fair.',
    resp: [
      ['Ask Risers which fair games they love', 'Plan the fairness test', 'Lead the opening', 'Count the tickets and money'],
      ['Design four game ideas with sizes', 'Design the tickets and prize list', 'Make the signs and game map', 'Make the money chart'],
      ['Build game 1', 'Build game 2', 'Build game 4', 'Build the ticket booth']
    ] },
  { id: 'sol-escaperoom', cat: 'sol', level: 2, title: 'LifeHub escape room', retired: true,
    what: 'You turn a room into an escape room. You make puzzles, secret codes and locked boxes. Teams have 30 minutes to solve them all and escape.',
    hook: 'Puzzles are the most fun when friends work them out together.',
    make: 'An escape room with four puzzles and two locked boxes, played by other Risers and families.',
    learn: 'Codes and logic puzzles',
    lo: 'We can make and break a secret code, and explain how each puzzle leads to the next one.',
    resp: [
      ['Find out how escape rooms work', 'Make code puzzle 3', 'Test the room with one team and take notes', 'Brief each team and lead the start'],
      ['Plan the story', 'Design the room layout', 'Draw where each puzzle goes', 'Give hints when teams ask'],
      ['Make puzzle 1', 'Make puzzle 2', 'Build locked box 2', 'Test all four puzzles']
    ] },
  { id: 'sol-minigolf', cat: 'sol', level: 2, title: 'Mini golf course',
    what: 'A mini golf course with ramps, tunnels, bridges and bumpers, made from wood, card and pipes. Each hole has a best score to beat.',
    hook: 'Everyone loves mini golf, and you get to design every tricky hole.',
    make: 'A 6-hole mini golf course and a scorecard, played at a LifeHub event.',
    learn: 'Angles and measuring',
    lo: 'We can measure and build each hole to size, and show how angles change where the ball goes.',
    resp: [
      ['Find out how angles change where a ball goes', 'Test holes 1 to 3 with friends', 'Test holes 4 to 6 with friends', 'Help players'],
      ['Design six holes with measurements', 'Make the scorecards', 'Put up the signs and set up the course', 'Hand out scorecards'],
      ['Build hole 1', 'Build hole 2', 'Build holes 4 and 5', 'Build hole 6']
    ] },
  { id: 'sol-recessbox', cat: 'sol', level: 2, title: 'Recess games box',
    what: 'You invent five new games for Riser Recess, make all the gear for them, and write the rules. Then you teach the games to everyone.',
    hook: 'We play the same few games at Recess every day.',
    make: 'A games box with gear and rule cards for five new games, and a games day to launch it.',
    learn: 'Maths: area, perimeter, timing and averages',
    lo: 'We can measure and mark a court with its area and perimeter, time and score games, find the average score, and write clear rules.',
    resp: [
      ['Plan a Recess survey and ask Risers', 'Write the rules for games 4 and 5', 'Test games 4 and 5, timing and scoring each', 'Work out the average score for each game', 'Plan the games day'],
      ['Invent five games', 'Measure and mark each court: area and perimeter', 'Make the cards', 'Design the games box and label', 'Make the sign-up sheet'],
      ['Make the gear for game 1', 'Make the gear for games 2 and 3', 'Make the gear for game 5', 'Build the games box']
    ] },
  { id: 'sol-buzzerphone', cat: 'sol', level: 2, title: 'Room-to-room buzzer phone',
    what: 'Two rooms, one long wire. In room A there is a button. In room B there is a buzzer. Press the button and the buzzer goes off. Short and long buzzes spell words in Morse code.',
    hook: 'We walk between rooms all day just to pass short messages.',
    make: 'A buzzer line between two rooms that works every time, a Morse code card for every Riser, and 10 messages sent and read correctly.',
    learn: 'Electric circuits and codes',
    lo: 'We can build a closed circuit with a switch, and send and read a short message in Morse code.',
    resp: [
      ['Find out how a circuit with a switch works', 'Learn Morse letters A to M', 'Plan test messages', 'Plan a way to reply'],
      ['Plan and measure where the wire will run', 'Make the first cards', 'Put up the rules and guide', 'Make a message log'],
      ['Build the test circuit on the table', 'Find and fix weak joins', 'Add a second switch and buzzer', 'Keep the line working']
    ] },
  { id: 'sol-readingnook', cat: 'sol', level: 2, title: 'Reading nook makeover', retired: true,
    what: 'You design and build a reading nook: cardboard stools, a bench, floor cushions and a book display, all strong enough to really use.',
    hook: 'A cosy nook makes everyone want to read.',
    make: 'A reading nook with four cardboard stools, a bench and a book display.',
    learn: 'Strength of shapes',
    lo: 'We can show that folded cardboard and short, wide columns hold more weight, and test our seats safely.',
    resp: [
      ['Ask Risers about a cosy nook', 'Test every seat safely', 'Make a book list', 'Write the reading nook rules'],
      ['Design the nook layout', 'Design the cushions and sign', 'Make the sign', 'Add the cushions and sign'],
      ['Make the test stool', 'Build stool 3', 'Build the bench', 'Fill the shelf']
    ] },
  { id: 'sol-mosquito', cat: 'sol', level: 2, title: 'Mosquito detectives',
    what: 'Mosquitoes lay eggs in still water. You search all of LifeHub for places where water sits, fix each one, and set little traps to check if mosquitoes are still around.',
    hook: 'In the rainy season, mosquito bites make people sick.',
    make: 'A map of every wet spot, a fix for each one, traps to check it worked, and a poster for families.',
    learn: 'Mosquito life cycle and mapping',
    lo: 'We can draw the mosquito life cycle, explain why still water matters, and map every wet spot we found.',
    resp: [
      ['Find out the mosquito life cycle', 'Search the first half of LifeHub', 'Plan fixes for the hard spots', 'Plan the talk'],
      ['Plan and draw the LifeHub map', 'Mark every wet spot on the map', 'Copy the posters', 'Write a monthly check list'],
      ['Find out how egg traps work', 'Make the traps', 'Tip, cover or drain the easy spots', 'Update the map']
    ] },
  { id: 'sol-steppingstones', cat: 'sol', level: 2, title: 'Handprint stepping stones',
    what: 'You mix cement and pour it into old trays. You press in your handprints, tiles and pebbles. Then you lay the stones as a path across the garden.',
    hook: 'One part of the garden turns to mud every time it rains, and the path will carry our handprints for years.',
    make: 'A path of six decorated stepping stones.',
    learn: 'Mixing and setting cement',
    lo: 'We can mix cement, sand and water in the right amounts, and explain that cement sets by a chemical change.',
    resp: [
      ['Find out how cement sets', 'Test three small mixes', 'Measure the path and plan the spacing', 'Write the path’s story'],
      ['Design the stone patterns', 'Decorate stones with handprints', 'Put up the sign', 'Take before-and-after photos'],
      ['Mix and pour stones 1 and 2', 'Pour stones 5 and 6', 'Lay the first stones', 'Check every stone is steady']
    ] },
  { id: 'sol-treasuremap', cat: 'sol', level: 2, title: 'Treasure hunt map',
    what: 'You make an accurate map of LifeHub, drawn to scale, with a compass rose. Then you hide clues and run a treasure hunt using your map.',
    hook: 'A good map can lead anyone to the treasure.',
    make: 'A big scale map of LifeHub, and a treasure hunt with clues for another group.',
    learn: 'Scale drawing and compass directions',
    lo: 'We can measure and draw a place to scale, and give directions using north, south, east and west.',
    resp: [
      ['Learn compass points and scale', 'Measure the other areas', 'Write clues 4 to 6', 'Lead the start'],
      ['Plan the map size', 'Draw the other areas', 'Colour the map', 'Make the treasure'],
      ['Make copies of the map', 'Re-hide moved clues', 'Hand out the maps and run the hunt', 'Collect the clues after']
    ] },
  { id: 'sol-fashion', cat: 'sol', level: 2, title: 'Trash-to-treasure fashion show',
    what: 'You design and make outfits, bags and hats from things people throw away, like old T-shirts, newspaper, bottle caps and packets. Then you put on a fashion show.',
    hook: 'So much stuff gets thrown away that could become something cool.',
    make: 'Three recycled outfits, a design sketchbook, and a fashion show for families.',
    learn: 'Measuring, stitching and recycling',
    lo: 'We can measure a person and cut to size, sew a simple stitch, and explain how much waste our outfits saved.',
    resp: [
      ['Plan what to collect', 'Measure the three models', 'Write the show script', 'Host the fashion show'],
      ['Sketch three outfit designs', 'Mark and cut outfit 1', 'Make bags or hats to match', 'Plan the runway and music'],
      ['Make a test patch', 'Stitch outfit 2', 'Last fixes to the outfits', 'Help the models on the day']
    ] },
  { id: 'sol-hideout', cat: 'sol', level: 3, title: 'Bamboo hideout',
    what: 'A small hideout made of bamboo poles tied with rope, covered with old cloth or sheets. It costs very little: no nails, no bought fittings, just rope, bamboo and things we reuse.',
    hook: 'Every Riser wants a secret hideout outside.',
    make: 'A small bamboo hideout for four children, tied with rope and covered with reused cloth.',
    learn: 'Lashing knots and bracing',
    lo: 'We can tie a square lashing and a clove hitch without help, and explain how a diagonal pole stops a frame leaning.',
    resp: [
      ['Learn the square lashing', 'Push-test without braces', 'Plan how the shade cloth ties on', 'Make the knot guide for others'],
      ['Sketch the hideout from three sides', 'Cut the diagonal braces', 'Fit the cloth', 'Put up the sign'],
      ['Sort the bamboo by length', 'Lash side 2', 'Tighten every knot', 'Open the hideout']
    ] },
  { id: 'sol-zipline', cat: 'sol', level: 3, title: 'Zip-line delivery',
    what: 'A rope tied tight between two places. A pulley with a basket zooms along it, delivering notes and snacks from one end to the other.',
    hook: 'A zip line makes delivering things fun and fast.',
    make: 'A zip line that carries a basket safely from one end to the other and stops gently.',
    learn: 'Pulleys, slopes and friction',
    lo: 'We can explain how slope, pulleys and friction change the basket’s speed, and show it by testing.',
    resp: [
      ['Find out how slope and friction change speed', 'Plan the basket test', 'Time runs with different loads', 'Write the safety rules'],
      ['Design the short test line', 'Design the basket and soft stopper', 'Make the sign and delivery cards', 'Hand out delivery cards'],
      ['Build the short test line', 'Test two pulleys', 'Run ten safe test runs', 'Keep the line working']
    ] },
  { id: 'sol-booklift', cat: 'sol', level: 3, title: 'Book lift',
    what: 'A box on a rope goes up and down to a high shelf. A bag of weights on the other end of the rope helps pull the box up, so it feels light.',
    hook: 'Carrying heavy books up high is hard work.',
    make: 'A lift that carries a box of books up to a high shelf, and a brake so it stays put.',
    learn: 'Pulleys and balancing weights',
    lo: 'We can show that the balancing bag makes the box feel lighter, and measure how hard we pull with and without it.',
    resp: [
      ['Find out how pulleys and counterweights work', 'Measure force with and without a counterweight', 'Plan the load test', 'Measure the force with books'],
      ['Sketch the lift', 'Mark the wood', 'Build the brake', 'Make the sign and use chart'],
      ['Build a model lift with a cotton reel', 'Join the frame', 'Test with a full box of books', 'Hand the lift over']
    ] },
  { id: 'sol-movienight', cat: 'sol', level: 3, title: 'Outdoor movie night',
    what: 'You build a big outdoor movie screen and a phone projector from a box and a magnifying lens. Then you host a movie night with seating and snacks.',
    hook: 'Everyone loves a movie night under the stars.',
    make: 'A big screen, a working box projector, and a movie night for Risers and families.',
    learn: 'Lenses and light',
    lo: 'We can explain how a lens makes a picture bigger and why it shows upside down, and set the focus distance.',
    resp: [
      ['Find out how a lens makes a picture bigger', 'Draw how light goes through a lens', 'Plan the guest list and seats', 'Give the lens talk on the night'],
      ['Plan the movie night', 'Mark the screen wood or poles', 'Make the tickets', 'Plan the snacks'],
      ['Build the first box projector', 'Add a slide to change focus', 'Black out light leaks', 'Make a spare projector']
    ] },
  { id: 'sol-library', cat: 'sol', level: 3, title: 'Little library',
    what: 'A small wooden book cupboard with a door, near the front gate. Anyone can put a book in or take a book out.',
    hook: 'Good books sit at home and no one reads them.',
    make: 'A rain-proof book cupboard, and a simple way to borrow and give back books.',
    learn: 'Waterproofing and woodwork',
    lo: 'We can measure and cut wood to size, fit a hinge, and explain how our roof keeps rain out.',
    resp: [
      ['Survey 15 Risers about books', 'Work out the shelf size', 'Test wood samples with water', 'Collect the first books'],
      ['Sketch the cupboard', 'Design the sloped roof', 'Paint the cupboard', 'Put up the sign'],
      ['Mark the wood', 'Join the box', 'Fit the hinge and catch', 'Open the little library']
    ] },
  { id: 'sol-gokart', cat: 'sol', level: 3, title: 'Sports day go-kart', retired: true,
    what: 'A wooden go-kart that rolls down a gentle slope, with real steering, a seat and a brake. You build it, test it and race it on sports day.',
    hook: 'Racing something you built yourself is the best feeling.',
    make: 'A go-kart that steers and stops safely, and a timed race on sports day.',
    learn: 'Gravity, friction and steering',
    lo: 'We can explain how gravity and friction change the kart’s speed, and show our timed runs and what we changed.',
    resp: [
      ['Find out how gravity and friction change speed', 'Write the safety checklist', 'Time runs on a gentle slope', 'Write the race rules'],
      ['Draw the plan with measurements', 'Design the seat and bumpers', 'Fit the bumpers', 'Mark the track'],
      ['Build a small model', 'Join the base frame', 'Fit the brake', 'Do the last safety check']
    ] },
  { id: 'sol-ecobench', cat: 'sol', level: 3, title: 'Bottle-brick bench',
    what: 'You push clean plastic wrappers into bottles until they are hard like bricks. Then you stack the bottle bricks and cover them with mud to make a bench.',
    hook: 'Wrappers and plastic bags pile up and have nowhere to go.',
    make: 'A strong bench in the garden made from bottle bricks and mud.',
    learn: 'Recycling plastic and building with cob',
    lo: 'We can pack a hard bottle brick, and mix cob and explain what the clay, sand and straw each do.',
    resp: [
      ['Find out why packed plastic gets hard', 'Collect wrappers from every room', 'Test three cob mixes', 'Count the wrappers we saved'],
      ['Sketch the bench and measure the spot', 'Dig the base', 'Shape the seat', 'Put up the sign'],
      ['Lay the first row', 'Lay the second row', 'Smooth the bench', 'Open the bench']
    ] }
];

/* The quest cards Risers choose from: icon, one exciting line, what you'll
   make (short), what you'll learn (short) and a feel tag. A project without
   a card here shows its plain name and description. */
window.T3_CARDS = {
  'sol-foosball': { icon: '⚽', tag: 'Build a football table. Win the tournament.', make: 'A tabletop football table and a tournament', learn: 'Levers and symmetry', feel: '🔨 Building' },
  'sol-musicwall': { icon: '🎶', tag: 'Turn a wall into an instrument.', make: 'A tuned music wall and a concert', learn: 'Sound, pitch and patterns', feel: '🎵 Music' },
  'sol-sciencekits': { icon: '🧰', tag: 'Science kits families can do with no help.', make: '4 take-home kits, tested by families', learn: 'Magnets, floating, dissolving, light', feel: '🧪 Testing' },
  'sol-playspace': { icon: '🛝', tag: 'Design it, pitch it, build it.', make: 'A scale model, a pitch and one part built', learn: 'Area, perimeter and scale', feel: '🏗️ Building' },
  'sol-cookbook': { icon: '🍲', tag: 'Every family’s favourite dish in one book.', make: 'A printed family cookbook', learn: 'Fractions and measuring', feel: '🍽️ Food' },
  'sol-pollinators': { icon: '🐝', tag: 'Bring the bees back, and prove it.', make: 'A flower patch and a bee hotel', learn: 'Pollination and averages', feel: '🌳 Outdoors' },
  'sol-mathkits': { icon: '📐', tag: 'Make the maths tools younger Risers learn with.', make: 'A class set of maths tools', learn: 'Fractions and exact measuring', feel: '✂️ Making' },
  'sol-fieldtrip': { icon: '🚌', tag: 'Plan a real trip. Win the parents’ yes.', make: 'A trip plan and the trip', learn: 'Money and time maths', feel: '🗺️ Planning' },
  'sol-timers': { icon: '⏳', tag: 'Timers that are right to the second.', make: 'Sand and water timers for every room', learn: 'Time and flow', feel: '🧪 Testing' },
  'sci-lightmaze': { icon: '🔦', tag: 'Bounce light round five corners.', make: 'A light maze and periscopes', learn: 'Light and mirrors', feel: '🧩 Puzzles' },
  'sol-cart': { icon: '🛒', tag: 'Move 20 kg round LifeHub. Nobody rides.', make: 'A cargo cart that steers and brakes', learn: 'Wheels, axles and friction', feel: '🔨 Woodwork' },
  'sol-claypot': { icon: '🏺', tag: 'A fridge with no electricity.', make: 'A clay pot fridge for the kitchen', learn: 'Evaporation', feel: '🧪 Testing' },
  'sol-handwash': { icon: '🧼', tag: 'Wash your hands without touching a thing.', make: 'A foot-pedal handwash station', learn: 'Levers and pulleys', feel: '🔨 Building' },
  'sol-vending': { icon: '🪙', tag: 'Coin in. Snack out.', make: 'A real vending machine', learn: 'Mechanisms and money', feel: '🔨 Woodwork' },
  'sol-watering': { icon: '💦', tag: 'Keep the garden alive with nobody there.', make: 'A drip system for the garden', learn: 'Water flow and gravity', feel: '🌳 Outdoors' },
  'sci-fizz': { icon: '🛁', tag: 'Make bath bombs that fizz and fizz.', make: 'Bath bombs and a gift box', learn: 'Acids and gases', feel: '🧪 Messy' },
  'sci-crystals': { icon: '💎', tag: 'Grow real crystals in a jar.', make: 'A crystal garden', learn: 'Dissolving', feel: '🔬 Watching' },
  'sci-bridge': { icon: '🌉', tag: 'Build it strong. Then break it.', make: 'Bridges and a breaking show', learn: 'Strong shapes', feel: '📊 Testing' },
  'sci-filter': { icon: '💧', tag: 'Turn muddy water clear.', make: 'Bottle filters and a water show', learn: 'Filtering', feel: '🧪 Messy' },
  'sci-magnet': { icon: '🧲', tag: 'A magnet you switch on and off.', make: 'A crane that lifts metal', learn: 'Electricity and magnets', feel: '⚡ Wiring' },
  'sci-weather': { icon: '🌦️', tag: 'Measure the weather like a scientist.', make: 'A weather station and a report', learn: 'Weather', feel: '🌳 Outdoors' },
  'sol-microgreens': { icon: '🌱', tag: 'Grow food in ten days.', make: 'Microgreens for the kitchen', learn: 'What plants need', feel: '🌱 Growing' },
  'sci-junkband': { icon: '🎸', tag: 'Turn junk into a real band.', make: 'Instruments and a concert', learn: 'Sound', feel: '🎵 Music' },
  'sci-planes': { icon: '✈️', tag: 'Fold, fly, test… and win the cup.', make: 'Your best planes and a championship', learn: 'Lift and drag', feel: '📊 Testing' },
  'sci-slime': { icon: '🟢', tag: 'Make the stretchiest slime ever.', make: 'Slime recipes and a slime stall', learn: 'Mixing and fair tests', feel: '🧪 Messy' },
  'sci-spy': { icon: '🕵️', tag: 'Secret ink, fingerprints and a mystery.', make: 'A spy kit and a mystery to solve', learn: 'Ink and fingerprints', feel: '🔎 Mystery' },
  'sci-egg': { icon: '🥚', tag: 'Keep the egg safe from a big drop.', make: 'A lander with a parachute', learn: 'Gravity and air', feel: '📊 Testing' },
  'sci-kites': { icon: '🪁', tag: 'Build kites that really fly.', make: 'Three kites and a kite festival', learn: 'Lift and wind', feel: '🌳 Outdoors' },
  'sci-lightcards': { icon: '💡', tag: 'Cards and posters that light up.', make: 'Light-up cards and a glowing poster', learn: 'Circuits', feel: '🎨 Art' },
  'sci-hand': { icon: '🤖', tag: 'A cardboard hand that really grabs.', make: 'A hand that picks up a cup', learn: 'Tendons and joints', feel: '✂️ Making' },
  'sci-fort': { icon: '⛺', tag: 'A paper dome you can sit inside.', make: 'A dome fort with a door', learn: 'Triangles', feel: '🏗️ Building' },
  'sci-steamboat': { icon: '🚤', tag: 'A tiny boat powered by steam.', make: 'Two steam boats and a race', learn: 'Heat and steam', feel: '🏁 Race' },
  'sci-solarcar': { icon: '☀️', tag: 'A car that runs on sunshine.', make: 'A solar car and a race', learn: 'Solar power and gears', feel: '🏁 Race' },
  'sci-turbine': { icon: '🌬️', tag: 'Catch the wind and turn it into light.', make: 'A turbine that lights an LED', learn: 'Energy and circuits', feel: '📊 Testing' },
  'sol-minigolf': { icon: '⛳', tag: 'Design 6 tricky holes everyone wants to play.', make: 'A 6-hole course and a golf day', learn: 'Angles', feel: '🎉 Event' },
  'sol-readingnook': { icon: '📚', tag: 'Make the cosiest reading corner.', make: 'Stools, a bench and a book display', learn: 'Strong shapes', feel: '🔨 Building' },
  'sol-fashion': { icon: '👗', tag: 'Turn rubbish into runway outfits.', make: '3 outfits and a fashion show', learn: 'Measuring and sewing', feel: '🎭 Show' },
  'sol-treasuremap': { icon: '🗺️', tag: 'Map LifeHub. Hide the treasure.', make: 'A big map and a treasure hunt', learn: 'Maps and directions', feel: '🌳 Outdoors' },
  'sol-gokart': { icon: '🏎️', tag: 'Build a real kart. Race it on sports day.', make: 'A go-kart that steers and brakes', learn: 'Gravity and friction', feel: '🔨 Woodwork' },
  'sol-zipline': { icon: '🪢', tag: 'Send snacks flying across LifeHub.', make: 'A zip line with a basket', learn: 'Slopes and pulleys', feel: '🌳 Outdoors' },
  'sol-boardgames': { icon: '🎲', tag: 'Invent board games people really want to play.', make: '3 new board games and a game café', learn: 'Chance and probability', feel: '🎲 Games' },
  'sol-newsshow': { icon: '📺', tag: 'Be the reporters of LifeHub.', make: 'A news show for families', learn: 'Surveys, charts and timing', feel: '🎬 Film' },
  'sol-snackshop': { icon: '🍓', tag: 'Run a real no-cook snack business.', make: 'A snack brand, orders and a sale day', learn: 'Cost and profit', feel: '💼 Business' },
  'sol-steppingstones': { icon: '🪨', tag: 'Leave your handprint in the garden.', make: '6 decorated stepping stones', learn: 'Mixing cement', feel: '🌳 Outdoors' },
  'sol-escaperoom': { icon: '🔐', tag: 'Build puzzles nobody can escape.', make: 'An escape room with 4 puzzles', learn: 'Codes and logic', feel: '🧩 Puzzles' },
  'sol-buzzerphone': { icon: '📞', tag: 'Send secret messages between rooms.', make: 'A buzzer line and Morse code cards', learn: 'Circuits and codes', feel: '⚡ Wiring' },
  'sol-hideout': { icon: '🎋', tag: 'Build a secret hideout from bamboo.', make: 'A bamboo hideout for four', learn: 'Knots and bracing', feel: '🌳 Outdoors' },
  'sol-booklift': { icon: '📦', tag: 'A lift that carries books up high.', make: 'A book lift with a brake', learn: 'Pulleys', feel: '🔨 Building' },
  'sol-postoffice': { icon: '✉️', tag: 'Run LifeHub\'s own post office.', make: 'Mailboxes, stamps and a post week', learn: 'Weighing and price bands', feel: '📬 Service' },
  'sol-recessbox': { icon: '⚽', tag: 'Invent 5 new games for recess.', make: 'A games box with rules and gear', learn: 'Area, perimeter, averages', feel: '🏃 Active' },
  'sol-library': { icon: '📖', tag: 'A little library anyone can use.', make: 'A rain-proof book cupboard', learn: 'Woodwork', feel: '🔨 Building' }
};
