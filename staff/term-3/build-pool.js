/* Term 3 Quests — the build pool: 50 projects the groups choose from, in
   two kinds, "Science in action" (sci) and "Make it for LifeHub" (sol).
   Each one has a name, what it is, the idea or reason behind it (hook),
   what the group ends up with (make), the science concept or skill they
   learn (learn), the learning outcome (lo: what they can show or explain at
   the end) and a level (1 easier, 2 medium, 3 harder). Risers never see the
   level: each group only sees the levels set for it in quest-data.js.

   resp: for each role (roles in quest-data.js ROLES), the kind of things
   that person looks after in this project. The team decides its own jobs.
   Written in very simple English so every Riser can read it. */
window.T3_POOL = [
  /* ---------- Science in action ---------- */
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
  { id: 'sol-snackshop', cat: 'sol', level: 1, title: 'LifeHub snack shop',
    what: 'You run a real snack business for two weeks. Find out what Risers want, test recipes, design your brand and packaging, sell on four days, and work out your profit.',
    hook: 'A real shop teaches you how money works, and everyone gets a tasty snack.',
    make: 'A snack brand with a name and packaging, a tested recipe card, a shop open on four days, a sales log and a money report.',
    learn: 'Money: cost, price and profit',
    lo: 'We can work out the cost, price and profit of our snack, change one thing after the first day, and show our sales in a chart.',
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
    learn: 'Letter writing and sorting systems',
    lo: 'We can write a clear letter, and explain how our sorting and delivery system gets each letter to the right box.',
    resp: [
      ['Write the post office rules', 'Plan the delivery rounds', 'Check letters reach the right box', 'Count the letters sent each day'],
      ['Design a mailbox for every Riser', 'Design stamps, postcards and a postmark', 'Make more stamps and postcards', 'Make thank-you cards for every Riser'],
      ['Build six mailboxes', 'Build the sorting box', 'Deliver Tuesday’s post', 'Deliver Wednesday’s post and hand over']
    ] },
  { id: 'sol-puppets', cat: 'sol', level: 1, title: 'Puppet show for little ones',
    what: 'You build a puppet theatre, make puppets with moving parts, write a story and put on a show for the youngest children at LifeHub.',
    hook: 'Little ones love a puppet show, and you get to be the storytellers.',
    make: 'A puppet theatre with a curtain, a set of puppets, and a show for the younger children.',
    learn: 'Storytelling and stagecraft',
    lo: 'We can write a story with a beginning, middle and end, and make puppets with parts that move.',
    resp: [
      ['Choose a story with the little ones', 'Write the script', 'Write the welcome', 'Welcome the audience and lead the show'],
      ['Sketch the theatre and puppets', 'Make the first puppets', 'Make the props', 'Make the posters and tickets'],
      ['Build the theatre frame', 'Make the curtain', 'Add lights and sound effects', 'Run backstage: lights and curtain']
    ] },
  { id: 'sol-boardgames', cat: 'sol', level: 1, title: 'Board game café',
    what: 'You invent your own board games: the board, the pieces, the cards and the rules. Then you open a game café where friends play and give you ideas to make them better.',
    hook: 'The best games are the ones you make yourself.',
    make: 'Three new board games and a game café corner with all the pieces and rule cards.',
    learn: 'Rule writing and chance',
    lo: 'We can write clear rules a new player can follow, and use what we know about dice to make our game fairer.',
    resp: [
      ['Ask 10 Risers what makes games fun', 'Write the rules for game 1', 'Run test games with friends', 'Lead the café opening'],
      ['Sketch three game ideas', 'Design boards 2 and 3 and the cards', 'Make the rule cards and box labels', 'Make the café sign'],
      ['Make a paper version of one game', 'Make the pieces for game 1', 'Make the pieces for games 2 and 3', 'Make a box for each game']
    ] },
  { id: 'sol-newsshow', cat: 'sol', level: 1, title: 'LifeHub news show',
    what: 'You are LifeHub\'s news team. You find real stories, interview people, write a proper script, film it and edit it into a news show for families.',
    hook: 'Families love to see what happens at LifeHub, and you get to be the reporters.',
    make: 'A LifeHub news show of 10 minutes or more, with at least 4 stories, an interview and a weather report.',
    learn: 'Reporting, script writing and video editing',
    lo: 'We can write a script in a two-column news script format, film each part clearly, and edit the clips together in the right order.',
    resp: [
      ['Find three news stories at LifeHub', 'Interview for story 3', 'Write the introduction', 'Introduce the show and answer questions'],
      ['Plan the running order and titles', 'Write the script for stories 1 and 2', 'Add titles, music and pictures', 'Make the poster and invitations'],
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
  { id: 'sol-escaperoom', cat: 'sol', level: 2, title: 'LifeHub escape room',
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
    what: 'A mini golf course with ramps, tunnels, bridges and bumpers, made from wood, card and pipes. Every hole has a par score.',
    hook: 'Everyone loves mini golf, and you get to design every tricky hole.',
    make: 'A 6-hole mini golf course and a scorecard, played at a LifeHub event.',
    learn: 'Angles and measuring',
    lo: 'We can measure and build each hole to size, and show how angles change where the ball goes.',
    resp: [
      ['Find out how angles change where a ball goes', 'Test holes 1 to 3 and set par', 'Test holes 4 to 6 and set par', 'Help players'],
      ['Design six holes with measurements', 'Make the scorecards', 'Put up the signs and set up the course', 'Hand out scorecards'],
      ['Build hole 1', 'Build hole 2', 'Build holes 4 and 5', 'Build hole 6']
    ] },
  { id: 'sol-recessbox', cat: 'sol', level: 2, title: 'Recess games box',
    what: 'You invent five new games for Riser Recess, make all the gear for them, and write the rules. Then you teach the games to everyone.',
    hook: 'We play the same few games at Recess every day.',
    make: 'A games box with gear and rule cards for five new games, and a games day to launch it.',
    learn: 'Rule writing, measuring and timing',
    lo: 'We can write clear rules, measure out a playing area, and time and score a game fairly.',
    resp: [
      ['Plan a Recess survey and ask Risers', 'Write the rules for games 4 and 5', 'Test games 4 and 5', 'Plan the games day'],
      ['Invent five games', 'Make the cards', 'Design the games box and label', 'Make the sign-up sheet'],
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
  { id: 'sol-readingnook', cat: 'sol', level: 2, title: 'Reading nook makeover',
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
  { id: 'sol-gokart', cat: 'sol', level: 3, title: 'Sports day go-kart',
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
  'sol-boardgames': { icon: '🎲', tag: 'Invent board games people really want to play.', make: '3 new board games and a game café', learn: 'Rules and chance', feel: '🎲 Games' },
  'sol-newsshow': { icon: '📺', tag: 'Be the reporters of LifeHub.', make: 'A news show for families', learn: 'Reporting and filming', feel: '🎬 Film' },
  'sol-snackshop': { icon: '🍿', tag: 'Run a real snack business.', make: 'A snack brand, a shop and a money report', learn: 'Cost and profit', feel: '💼 Business' },
  'sol-steppingstones': { icon: '🪨', tag: 'Leave your handprint in the garden.', make: '6 decorated stepping stones', learn: 'Mixing cement', feel: '🌳 Outdoors' },
  'sol-escaperoom': { icon: '🔐', tag: 'Build puzzles nobody can escape.', make: 'An escape room with 4 puzzles', learn: 'Codes and logic', feel: '🧩 Puzzles' },
  'sol-buzzerphone': { icon: '📞', tag: 'Send secret messages between rooms.', make: 'A buzzer line and Morse code cards', learn: 'Circuits and codes', feel: '⚡ Wiring' },
  'sol-hideout': { icon: '🎋', tag: 'Build a secret hideout from bamboo.', make: 'A bamboo hideout for four', learn: 'Knots and bracing', feel: '🌳 Outdoors' },
  'sol-booklift': { icon: '📦', tag: 'A lift that carries books up high.', make: 'A book lift with a brake', learn: 'Pulleys', feel: '🔨 Building' },
  'sol-postoffice': { icon: '✉️', tag: 'Run LifeHub\'s own post office.', make: 'Mailboxes, stamps and a post week', learn: 'Letters and sorting', feel: '📬 Service' },
  'sol-recessbox': { icon: '⚽', tag: 'Invent 5 new games for recess.', make: 'A games box with rules and gear', learn: 'Clear rules', feel: '🏃 Active' },
  'sol-library': { icon: '📖', tag: 'A little library anyone can use.', make: 'A rain-proof book cupboard', learn: 'Woodwork', feel: '🔨 Building' }
};
