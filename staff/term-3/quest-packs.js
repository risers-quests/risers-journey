/* Term 3 Quests — Quest Packs: what a quest is for and what "done" means.
   The team plans how to do it on the Our Plan tab. Very simple words: the
   challenge is the build, not the reading.

   T3_PACKS[<project id>] = {
     goal:    one line: what it's for, and who it helps,
     who:     who it's for: the people to ask and test with,
     make:    [[icon, 'big words', 'small words'], …]   up to 6 tiles,
     done:    ['short line', …]                         up to 6,
     notDone: 'one example of not done',
     skills:  ['new skill', …]                          2 or 3,
     uses:    [['Subject', 'what we use from it'], …]   learning we apply,
     show:    ['what to show or talk about', …]         at the showcase,
     bounds:  [[icon, 'short line'], …]                 for this quest,
     rules:   [[icon, 'short line'], …]                 for this quest,
     formats: [{ title, note, cols: […], rows: [[…], …] }]  optional,
     looks:   [{ title, sample: '<html of a finished example>', must: ['…'] }]  optional
   }
   The team ticks the "done" lines as they become true, and a facilitator
   checks it at the end. Every quest has the same budget (T3_BUDGET, in
   rupees), the rules in T3_EVERY_RULES and the showcase points in
   T3_EVERY_SHOW. */
window.T3_BUDGET = 1000;

window.T3_EVERY_RULES = [
  ['🛠️', 'Ask before using tools, and use them safely'],
  ['🤝', 'Decide together: listen to every idea, and vote if you can’t agree'],
  ['📋', 'Keep the Board up to date: move your jobs every day'],
  ['🧹', 'Clean up and put things back every time']
];

window.T3_EVERY_SHOW = [
  'What we made, and who it helps',
  'Something that didn’t work, and what we changed',
  'The skills we built',
  'Let everyone try it'
];

window.T3_PACKS = {

  /* ---------- Make it for LifeHub ---------- */

  'sol-minigolf': {
    goal: 'Build a 6-hole mini golf course that anyone at LifeHub can play.',
    who: 'Every Riser and facilitator. Ask 5 of them what makes a hole fun, and let them test it.',
    make: [
      ['⛳', '6 holes', 'Every hole different'],
      ['🗺️', '1 course map', 'Where each hole goes, before you build'],
      ['📝', '1 score sheet', 'Count your hits on each hole'],
      ['🪧', '6 signs', 'Hole number and a fun name'],
      ['🏌️', 'Golf day', '20 players or more']
    ],
    done: [
      'The ball can get in on every hole',
      'Each hole has a ramp, tunnel, bridge or bumper',
      '5 friends have tried every hole',
      'A new player knows what to do from the sign',
      'Easy to set up and put away',
      'Still works after 30 games'
    ],
    notDone: 'flat card with a cup at the end.',
    skills: ['Measure and cut card and wood', 'Design a layout on squared paper', 'Test an idea and make it better'],
    uses: [['Maths', 'Angles, measuring, adding up scores'], ['Science', 'Forces: how a ball rolls and bounces'], ['English', 'Clear signs and instructions']],
    show: ['How the ball bounces off walls (angles)', 'Your hardest hole, and its best score'],
    bounds: [
      ['🪧', 'Kind, fun hole names. Nothing rude or mean.'],
      ['🎨', 'Happy decorations. Nothing scary or gory.'],
      ['🔨', 'No sharp bits, nails or broken glass'],
      ['🙅', 'Never hit balls at people or windows'],
      ['📍', 'It fits in our space in the hall']
    ],
    looks: [
      { title: 'a hole sign',
        sample: '<div class="lk-sign"><span class="lk-num">3</span><b>The Volcano</b><small>Get it over the hill!</small><em>Best score: 2 hits</em></div>',
        must: ['Big hole number', 'A fun name', 'A tip for players', 'Easy to read from 3 steps away'] },
      { title: 'the score sheet',
        sample: '<table class="lk-score"><tr><th>Name</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th></tr><tr><td>Asha</td><td>2</td><td>4</td><td>3</td><td>2</td><td>5</td><td>3</td><td>19</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>',
        must: ['A box for every hole', 'A total at the end', 'Room for 6 players', 'Lowest total wins'] }
    ],
    rules: [
      ['🏌️', 'Tap the ball gently'],
      ['🧪', 'Test before golf day']
    ]
  },

  'sol-readingnook': {
    goal: 'Make a cosy reading corner that every Riser wants to read in.',
    who: 'Risers and facilitators. Ask at least 5 of them what makes a reading spot cosy.',
    make: [
      ['🪑', '3 stools', 'Cardboard, strong enough to sit on'],
      ['🛋️', '1 bench', 'Seats two'],
      ['📚', 'A book display', 'Covers facing out'],
      ['🧸', 'Floor cushions', 'At least 3'],
      ['🪧', 'A sign and rules', 'Name of the nook and 3 rules']
    ],
    done: [
      'Every seat holds a grown-up safely',
      'The books are easy to see and reach',
      '5 Risers have read there and said it’s cosy',
      'The sign and rules are up',
      'Still strong after a week of use'
    ],
    notDone: 'a box to sit on that squashes.',
    skills: ['Build strong shapes from card', 'Plan a space to scale', 'Ask people what they need (a survey)'],
    uses: [['Maths', 'Measuring, area of the floor, scale drawing'], ['Science', 'Strong shapes: triangles, tubes, folds'], ['English', 'Writing clear rules and a sign']],
    show: ['Why your stools don’t squash', 'What Risers told you, and how you used it'],
    bounds: [
      ['🪑', 'Test every seat before anyone sits on it'],
      ['📖', 'Books and pictures fine for every age'],
      ['🚪', 'Keep doors and paths clear'],
      ['🔥', 'No candles or fairy lights on mains power']
    ],
    rules: [
      ['🧪', 'Build a test stool first'],
      ['📏', 'Measure twice, cut once']
    ]
  },

  'sol-fashion': {
    goal: 'Turn rubbish into 3 outfits and put on a fashion show for LifeHub.',
    who: 'The audience: Risers, facilitators and families. Ask your models what feels comfy.',
    make: [
      ['👗', '3 outfits', 'From things people throw away'],
      ['👜', 'Bags or hats', 'To match each outfit'],
      ['✏️', 'Design sketches', 'One for each outfit'],
      ['🎤', 'Show script', 'What the host says'],
      ['🎶', 'The fashion show', 'Runway and music']
    ],
    done: [
      'Each outfit is made from waste',
      'Each model can walk the runway without it falling apart',
      'The outfits match the sketches',
      'The host says what each outfit is made from',
      'The show runs from start to end'
    ],
    notDone: 'a T-shirt with paper stuck on.',
    skills: ['Measure a person and cut to size', 'Sew and join materials', 'Plan and run a show'],
    uses: [['Maths', 'Measuring in cm, adding up lengths'], ['Science', 'Materials: which bend, stretch or tear'], ['English', 'Writing and reading a script aloud']],
    show: ['What each outfit is made from', 'How much waste you saved'],
    bounds: [
      ['🧼', 'Only clean waste: no food packets with food in them'],
      ['🪡', 'Needles and scissors only with a facilitator nearby'],
      ['👕', 'Outfits go over clothes. Nothing too short or tight.'],
      ['😊', 'Kind words about every model']
    ],
    rules: [
      ['📏', 'Measure your model first'],
      ['🧪', 'Make a test patch before the real thing']
    ]
  },

  'sol-treasuremap': {
    goal: 'Make a true map of LifeHub, to scale, and run a treasure hunt with it.',
    who: 'Risers who play the hunt. Test the map on 3 people who didn’t make it.',
    make: [
      ['🗺️', 'A big map', 'To scale, with a compass rose'],
      ['📄', 'Map copies', 'One for each team'],
      ['🧩', '6 clues', 'Hidden around LifeHub'],
      ['💎', 'The treasure', 'Something fun to find'],
      ['🏃', 'The hunt', 'Teams use the map']
    ],
    done: [
      'Every room and path is on the map',
      'The map is to scale and has a key',
      'North on the map is really north',
      'A new player can find every clue with the map',
      'Teams finish the hunt in about 30 minutes'
    ],
    notDone: 'a drawing that isn’t measured.',
    skills: ['Measure a big space', 'Draw to scale', 'Use a compass and give directions'],
    uses: [['Maths', 'Measuring, scale, angles and turns'], ['Geography', 'Compass points, keys and symbols'], ['English', 'Writing clear clues']],
    show: ['How you made the map to scale', 'The hardest clue'],
    bounds: [
      ['🚫', 'No clues in offices, kitchens or out of bounds places'],
      ['🏃', 'Walk, don’t run, indoors'],
      ['🔒', 'Don’t move or open other people’s things'],
      ['🧩', 'Clues are kind and fun']
    ],
    rules: [
      ['📏', 'Measure before you draw'],
      ['🧭', 'Check north with a compass']
    ]
  },

  'sol-gokart': {
    goal: 'Build a wooden go-kart that steers and brakes, and race it safely on sports day.',
    who: 'The drivers and sports day crowd. Let 5 people test-drive it on a gentle slope.',
    make: [
      ['🛠️', 'A small model', 'To test the idea first'],
      ['🏎️', 'The go-kart', 'Seat, steering and a brake'],
      ['📐', 'A plan with measurements', 'Before you build'],
      ['✅', 'A safety checklist', 'Checked before every run'],
      ['🏁', 'Race day', 'On a gentle slope']
    ],
    done: [
      'It steers left and right',
      'The brake stops it every time',
      'The safety checklist is ticked before each run',
      '5 people have driven it safely',
      'It finishes the race on sports day'
    ],
    notDone: 'a box on wheels with no brake.',
    skills: ['Use saws and drills safely', 'Join wood strongly', 'Follow and write a safety check'],
    uses: [['Science', 'Gravity, friction and slopes'], ['Maths', 'Measuring, timing runs, finding the average'], ['English', 'Writing a clear safety checklist']],
    show: ['How the steering and brake work', 'Your fastest safe time'],
    bounds: [
      ['⛑️', 'Helmet on every time you drive'],
      ['🐢', 'Gentle slope only, with a facilitator there'],
      ['🛑', 'No run without a working brake'],
      ['🚗', 'Never near roads or cars']
    ],
    rules: [
      ['🪚', 'Saws and drills only with a facilitator'],
      ['✅', 'Safety check before every run']
    ]
  },

  'sol-zipline': {
    goal: 'Build a safe zip line that delivers notes and snacks across LifeHub.',
    who: 'Risers and facilitators who send deliveries. Ask them what they would send.',
    make: [
      ['🪢', 'A test line', 'Short and low'],
      ['🧺', 'A basket', 'With a soft stopper'],
      ['🛤️', 'The zip line', 'Between two safe points'],
      ['✉️', 'Delivery cards', 'Who it’s from and to'],
      ['📦', 'Delivery day', 'Ten safe deliveries']
    ],
    done: [
      'The basket gets to the end every time',
      'Nothing falls out on the way',
      'The stopper stops it gently',
      '10 safe test runs in a row',
      'A facilitator has checked both ends are tied safely'
    ],
    notDone: 'a string with a cup that gets stuck.',
    skills: ['Tie strong knots', 'Test with different loads', 'Make something safe for others'],
    uses: [['Science', 'Slopes, friction and pulleys'], ['Maths', 'Measuring, timing runs, weighing loads'], ['English', 'Writing safety rules']],
    show: ['How the slope changes the speed', 'Your heaviest safe load'],
    bounds: [
      ['🙅', 'Only things go on the line. Never people or pets.'],
      ['🧃', 'Light loads only: no glass, nothing heavy'],
      ['🪢', 'A facilitator checks the ends before every use'],
      ['🚪', 'Not across doors or paths']
    ],
    rules: [
      ['🧪', 'Test low and short first'],
      ['👀', 'Shout “Delivery!” before you send']
    ]
  },

  /* ---------- Science in action ---------- */

  'sci-junkband': {
    goal: 'Turn junk into real instruments and play a concert.',
    who: 'The concert audience: Risers and facilitators. Play a song they know.',
    make: [
      ['🎸', 'A box guitar', 'Rubber bands on a box'],
      ['🎶', 'A straw flute', 'Different notes'],
      ['🥤', 'A bottle xylophone', 'Water in bottles'],
      ['🥁', 'A drum', 'Loud and clear'],
      ['🎤', 'The concert', 'One song, all together']
    ],
    done: [
      'Every instrument makes a sound',
      'Each one can play high and low notes',
      'You can say why each note changes',
      'The band plays one song all the way through'
    ],
    notDone: 'a box with one band that only thuds.',
    skills: ['Tune an instrument', 'Change one thing at a time to test', 'Play together as a band'],
    uses: [['Science', 'Sound and vibration: longer, tighter, more water'], ['Maths', 'Measuring lengths and amounts of water'], ['Music', 'Rhythm and keeping time']],
    show: ['Why a tighter band makes a higher note', 'Play your song'],
    bounds: [
      ['🔊', 'Not too loud: look after everyone’s ears'],
      ['✂️', 'No sharp edges on cans or bottles'],
      ['🧼', 'Clean junk only']
    ],
    rules: [
      ['🎵', 'Tune before you play'],
      ['🤫', 'Practise in the quiet corner']
    ]
  },

  'sci-planes': {
    goal: 'Find the best paper plane design and hold a championship.',
    who: 'Everyone who enters the championship. Let them fold your best design.',
    make: [
      ['✈️', '3 plane designs', 'Different wings and noses'],
      ['📊', 'A results chart', 'Every flight measured'],
      ['📜', 'Championship rules', 'Fair for everyone'],
      ['🏆', 'The championship', 'Longest flight and longest time']
    ],
    done: [
      'Every design flown 3 times and measured',
      'The chart shows which design is best',
      'You can say why it flies best',
      'The championship has a winner for distance and time'
    ],
    notDone: 'one plane thrown once.',
    skills: ['Run a fair test', 'Measure and record results', 'Draw a bar chart'],
    uses: [['Science', 'Lift, drag and gravity'], ['Maths', 'Measuring in metres, timing, finding the best of 3'], ['English', 'Writing fair rules']],
    show: ['Your chart, and what it shows', 'Why the winning plane flies best'],
    bounds: [
      ['🙅', 'Never throw at faces'],
      ['📄', 'Scrap paper only'],
      ['🏃', 'Throw from the line, one at a time']
    ],
    rules: [
      ['📏', 'Measure every flight'],
      ['⚖️', 'Same throw for every plane']
    ]
  },

  'sci-slime': {
    goal: 'Find the stretchiest, bounciest slime by changing one thing at a time.',
    who: 'Visitors to your slime stall. Let them test and vote.',
    make: [
      ['🧪', '4 recipe changes', 'One change each time'],
      ['📊', 'A results table and chart', 'Stretch and bounce'],
      ['📝', 'A recipe card', 'For the best slime'],
      ['🟢', 'A slime stall', 'Visitors test and vote']
    ],
    done: [
      'Each recipe changes only one thing',
      'Stretch and bounce are measured, not guessed',
      'The chart shows the winner',
      'Visitors can make the winner from your card'
    ],
    notDone: 'a bowl of slime with no tests.',
    skills: ['Run a fair test', 'Measure carefully', 'Write a recipe someone else can follow'],
    uses: [['Science', 'Mixing and how things change'], ['Maths', 'Measuring in ml and cm, bar charts'], ['English', 'Writing clear steps']],
    show: ['Which change made the biggest difference', 'Your winning recipe'],
    bounds: [
      ['🧤', 'Gloves on, and wash hands after'],
      ['👅', 'Never taste it'],
      ['🧴', 'Only the safe things a facilitator gives you'],
      ['🧽', 'Keep it off clothes, books and carpets']
    ],
    rules: [
      ['🧪', 'Change one thing at a time'],
      ['📏', 'Measure every amount']
    ]
  },

  'sci-spy': {
    goal: 'Make a spy kit and use real science to solve a mystery at LifeHub.',
    who: 'The Risers who solve your mystery. Test it on a friend first.',
    make: [
      ['🍋', '4 invisible inks', 'Which one shows best?'],
      ['🖐️', 'A fingerprint kit', 'Ink pad and dusting powder'],
      ['🔍', 'Clue cards', 'With secret ink and prints'],
      ['🕵️', 'The mystery', 'Players solve it']
    ],
    done: [
      'Every ink is tested and the best one is chosen',
      'You can sort prints into loops, whorls and arches',
      'The clues lead to only one answer',
      'A team solves the mystery in 20 minutes'
    ],
    notDone: 'a clue that anyone can read without heat.',
    skills: ['Test and compare', 'Look closely and sort what you see', 'Make a puzzle that is fair'],
    uses: [['Science', 'How heat changes ink, fingerprint patterns'], ['Maths', 'Tally charts and timing'], ['English', 'Writing clues']],
    show: ['Why lemon juice shows up with heat', 'Your fingerprint chart'],
    bounds: [
      ['🔥', 'A facilitator does all the heating'],
      ['😊', 'The mystery is fun: no scary crimes, no real people blamed'],
      ['🔒', 'Fingerprints stay in class and are thrown away after']
    ],
    rules: [
      ['🧪', 'Test every ink the same way'],
      ['🤐', 'Keep the answer secret']
    ]
  },

  'sci-egg': {
    goal: 'Build a lander that keeps a raw egg safe in a big drop.',
    who: 'The crowd at the big drop. Let them guess if the egg survives.',
    make: [
      ['🥚', '3 landers', 'Each one better'],
      ['🪂', 'A parachute', 'Slows the fall'],
      ['📊', 'A results table', 'Height, time, cracked or safe'],
      ['🎥', 'The big drop', 'From the highest safe spot']
    ],
    done: [
      'Each lander tested from at least 2 heights',
      'Falls timed with and without the parachute',
      'The egg survives the big drop',
      'You can say why your lander worked'
    ],
    notDone: 'an egg wrapped in tissue, dropped once.',
    skills: ['Design, test and improve', 'Time and record results', 'Plan a safe test'],
    uses: [['Science', 'Gravity and air resistance'], ['Maths', 'Measuring heights, timing, comparing'], ['English', 'Writing predictions and results']],
    show: ['Why the parachute helps', 'Your best and worst lander'],
    bounds: [
      ['🧗', 'Drops only from a safe spot a facilitator chooses'],
      ['🙅', 'Never drop on or near people'],
      ['🥚', 'Clean up every cracked egg straight away']
    ],
    rules: [
      ['🔮', 'Predict before every drop'],
      ['📝', 'Record every drop']
    ]
  },

  'sci-kites': {
    goal: 'Build kites that really fly and hold a kite festival.',
    who: 'Festival visitors. Help them fly a kite you made.',
    make: [
      ['🪁', 'A diamond kite', 'Your first test'],
      ['🎏', '3 tails', 'Which works best?'],
      ['🪁', '2 more kites', 'For visitors'],
      ['🏅', 'Judging sheet', 'Highest and steadiest'],
      ['🌳', 'The festival', 'Everyone flies']
    ],
    done: [
      'Every kite flies for 1 minute',
      'The tails are tested and the best is chosen',
      'You can say why a tail helps',
      'Visitors fly kites at the festival'
    ],
    notDone: 'a kite that spins and falls.',
    skills: ['Build a light, strong frame', 'Test one change at a time', 'Run an outdoor event'],
    uses: [['Science', 'Lift, drag and wind'], ['Maths', 'Measuring, symmetry, timing'], ['English', 'Writing judging rules']],
    show: ['Why your best kite flies steadily', 'What the tails changed'],
    bounds: [
      ['⚡', 'Never near power lines or trees'],
      ['🌧️', 'Not in storms or strong wind'],
      ['🧵', 'Wind the string up after: no tangles to trip on']
    ],
    rules: [
      ['🧪', 'Test one change at a time'],
      ['👀', 'Look around before you launch']
    ]
  },

  'sci-lightcards': {
    goal: 'Make greeting cards and a poster that light up with paper circuits.',
    who: 'The people you give the cards to. Make one card for someone at LifeHub.',
    make: [
      ['💌', '2 light-up cards', 'Each with an LED'],
      ['🖼️', 'A glowing poster', 'With 5 lights'],
      ['✏️', 'A circuit drawing', 'Before you build'],
      ['✅', 'A check list', 'For every card']
    ],
    done: [
      'Every light comes on when you press',
      'The circuit drawing matches the card',
      'You can say how the circuit works',
      'The poster still glows after a day'
    ],
    notDone: 'a card with an LED that only works sometimes.',
    skills: ['Build a simple circuit', 'Draw a circuit plan', 'Find and fix a fault'],
    uses: [['Science', 'Circuits: a full loop, + and – sides'], ['Maths', 'Measuring and spacing'], ['Art', 'Design and colour']],
    show: ['How your circuit makes a loop', 'A fault you found and fixed'],
    bounds: [
      ['🔋', 'Only small coin batteries. Never mains power.'],
      ['👶', 'Keep coin batteries away from little children and mouths'],
      ['🗑️', 'Old batteries go to a facilitator']
    ],
    rules: [
      ['✏️', 'Draw the circuit first'],
      ['🔍', 'Test before you glue']
    ]
  },

  'sci-hand': {
    goal: 'Build a cardboard robot hand that can grab and lift a cup.',
    who: 'Visitors who try the challenge. Let them use it.',
    make: [
      ['✋', 'The robot hand', 'Five fingers that bend'],
      ['🧵', 'String tendons', 'One for each finger'],
      ['📐', 'A labelled plan', 'Before you build'],
      ['🏆', 'The pick-up challenge', 'Score out of 10']
    ],
    done: [
      'Every finger bends when you pull its string',
      'The hand picks up a plastic cup',
      'You can say how it is like a real hand',
      'Visitors score at least 5 out of 10'
    ],
    notDone: 'a hand shape whose fingers don’t move.',
    skills: ['Cut and fold card neatly', 'Make moving joints', 'Test and improve a grip'],
    uses: [['Science', 'Tendons, joints and muscles'], ['Maths', 'Measuring real hands, scoring out of 10'], ['English', 'Labelling a plan']],
    show: ['How the strings work like tendons', 'Your challenge scores'],
    bounds: [
      ['✂️', 'Craft knives only with a facilitator'],
      ['🥤', 'Only light, unbreakable things to pick up']
    ],
    rules: [
      ['✋', 'Measure a real hand first'],
      ['🧪', 'Test each finger as you go']
    ]
  },

  'sci-fort': {
    goal: 'Build a dome from rolled newspaper, big enough to sit inside.',
    who: 'Risers who visit the fort. Show them round.',
    make: [
      ['📰', '30+ newspaper sticks', 'Two lengths'],
      ['⛺', 'The dome fort', 'With a door'],
      ['⭐', 'A star ceiling', 'Inside the dome'],
      ['🏋️', 'A weight test', 'How strong is it?']
    ],
    done: [
      'The dome stands on its own',
      '3 Risers can sit inside',
      'It passes the weight test',
      'You can say why triangles make it strong'
    ],
    notDone: 'a dome that falls when you touch it.',
    skills: ['Build with triangles', 'Count and measure parts', 'Work as a team on a big build'],
    uses: [['Maths', 'Shapes, measuring, counting joints'], ['Science', 'Why triangles are strong'], ['English', 'Writing a guide for visitors']],
    show: ['Why triangles make it strong', 'Your weight test'],
    bounds: [
      ['🧗', 'Never climb on the dome'],
      ['🔥', 'No lights with flames inside'],
      ['🚪', 'Keep the door clear']
    ],
    rules: [
      ['📏', 'Check every stick’s length'],
      ['🔺', 'Triangles everywhere']
    ]
  },

  'sci-steamboat': {
    goal: 'Build a tiny steam boat that chugs across a tub, and race it.',
    who: 'The race crowd. Let them pick a winner.',
    make: [
      ['🚤', '2 boats', 'Different hull shapes'],
      ['♨️', 'A steam boiler', 'Tin and two straws'],
      ['📊', 'A results chart', 'Time across the tub'],
      ['🏁', 'The race', 'Fair for every boat']
    ],
    done: [
      'Both boats move by steam',
      'Each boat is timed 3 times',
      'The chart shows the fastest hull',
      'You can say how steam pushes the boat'
    ],
    notDone: 'a boat that only floats.',
    skills: ['Build a small working machine', 'Run a fair race', 'Work safely with heat'],
    uses: [['Science', 'Heat, steam and floating'], ['Maths', 'Timing, finding the average'], ['English', 'Writing race rules']],
    show: ['How the boiler pushes the boat', 'Which hull won, and why'],
    bounds: [
      ['🔥', 'Only a facilitator lights or moves the tea-light'],
      ['💧', 'Boats only in the water tub, on a tray'],
      ['🧯', 'Water ready nearby every time']
    ],
    rules: [
      ['🧪', 'Change one thing at a time'],
      ['⏱️', 'Time every run']
    ]
  },

  'sci-solarcar': {
    goal: 'Build a solar car and race it in the sun.',
    who: 'The race crowd. Let visitors race your car.',
    make: [
      ['☀️', 'A solar car', 'Panel, motor and wheels'],
      ['⚙️', '2 gear setups', 'Which is faster?'],
      ['🛣️', 'A test track', 'Marked and measured'],
      ['📊', 'A times board', 'Every race'],
      ['🏁', 'Race day', 'In the sun']
    ],
    done: [
      'The car runs on sunlight only',
      'Both gear setups are timed',
      'The car runs straight down the track',
      'You can say how the panel makes it move'
    ],
    notDone: 'a car that only moves when you push it.',
    skills: ['Wire a simple circuit', 'Test and compare gears', 'Make it lighter and faster'],
    uses: [['Science', 'Solar power, circuits and friction'], ['Maths', 'Measuring, timing, speed'], ['English', 'Writing race rules']],
    show: ['How sunlight makes the car move', 'Your fastest time, and which gears'],
    bounds: [
      ['😎', 'Never look at the sun'],
      ['🔌', 'Solar power only: no mains plugs'],
      ['🛣️', 'Race only on the marked track']
    ],
    rules: [
      ['⏱️', 'Time every run'],
      ['🔧', 'Keep spare parts ready']
    ]
  },

  'sci-turbine': {
    goal: 'Build a wind turbine that lights up an LED.',
    who: 'Visitors who try to light it. Answer their questions.',
    make: [
      ['🌬️', 'A test stand', 'Motor and LED'],
      ['🌀', '3 blade sets', 'Different shapes'],
      ['🗼', 'The turbine', 'Tower, base and best blades'],
      ['📊', 'A results chart', 'Which blades work best']
    ],
    done: [
      'The LED lights when the wind blows',
      'All 3 blade sets are tested the same way',
      'The chart shows the best blades',
      'You can say how wind becomes light'
    ],
    notDone: 'blades that spin but no light.',
    skills: ['Build and test a design', 'Make a fair test', 'Explain energy changes'],
    uses: [['Science', 'Energy, motors and circuits'], ['Maths', 'Counting spins, charts'], ['English', 'Explaining clearly to visitors']],
    show: ['How the wind becomes light', 'Your best blade shape'],
    bounds: [
      ['🌀', 'Hands away from spinning blades'],
      ['🔌', 'Fans only with a facilitator: no other mains use'],
      ['✂️', 'No sharp blade edges']
    ],
    rules: [
      ['🧪', 'Same fan, same distance for every test'],
      ['📝', 'Record every test']
    ]
  }
};
