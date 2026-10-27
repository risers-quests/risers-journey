/* Term 3 Quests — Quest Packs: what a quest is for and what "done" means.
   The team plans how to do it on the Our Plan tab. Very simple words: the
   challenge is the build, not the reading. Teams choose their own
   materials, within the budget. Skills and learning are Core Skills put
   to use: Maths, Science and Language.

   T3_PACKS[<project id>] = {
     goal:    one line: what it's for, and who it helps,
     who:     who it's for: the people to ask and test with,
     make:    [[icon, 'big words', 'small words'], …]   up to 6 tiles,
     done:    ['short line', …]                         up to 6,
     notDone: 'one example of not done',
     skills:  [['Maths' | 'Science' | 'Language', 'what we learn to do'], …],
     uses:    [['Maths' | 'Science' | 'Language', 'what we already know and use'], …],
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
    skills: [['Maths', 'Draw a course plan to scale'], ['Science', 'Test how angle and force change where a ball goes'], ['Language', 'Write instructions a new player can follow']],
    uses: [['Maths', 'Measuring in cm and m, angles, adding up scores'], ['Science', 'Forces: push, friction and bounce'], ['Language', 'Short, clear signs and tips']],
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
      ['🪑', '3 stools', 'Strong enough to sit on'],
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
    skills: [['Maths', 'Draw the nook to scale and plan the space'], ['Science', 'Test what makes a seat strong and steady'], ['Language', 'Ask survey questions and report what people said']],
    uses: [['Maths', 'Measuring, area (length × width), adding up costs'], ['Science', 'Forces and weight, strong shapes'], ['Language', 'Writing clear rules and a sign']],
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
    skills: [['Maths', 'Measure a person and turn it into a pattern'], ['Science', 'Test which materials stretch, bend or tear'], ['Language', 'Write and perform a show script']],
    uses: [['Maths', 'Measuring in cm, adding lengths, symmetry'], ['Science', 'Properties of materials; reduce, reuse, recycle'], ['Language', 'Describing words, speaking to an audience']],
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
    skills: [['Maths', 'Turn real distances into a scale map'], ['Science', 'Use a compass to find north'], ['Language', 'Write clues that are tricky but fair']],
    uses: [['Maths', 'Measuring, scale, angles and turns, coordinates'], ['Science', 'Magnets and the Earth’s magnetic field'], ['Language', 'Direction and position words']],
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
    goal: 'Build a go-kart that steers and brakes, and race it safely on sports day.',
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
    skills: [['Maths', 'Time runs and find the average'], ['Science', 'Test how slope, weight and friction change speed'], ['Language', 'Write a safety checklist and race rules']],
    uses: [['Maths', 'Measuring, timing, averages'], ['Science', 'Gravity, friction and forces'], ['Language', 'Instructions and rules']],
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
    skills: [['Maths', 'Measure the slope and record times for different loads'], ['Science', 'Test how slope, friction and pulleys change speed'], ['Language', 'Write safety rules and delivery cards']],
    uses: [['Maths', 'Measuring, timing, weight in grams'], ['Science', 'Gravity, friction, simple machines (pulleys)'], ['Language', 'Instructions and short notes']],
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
    skills: [['Maths', 'Measure lengths and amounts to make each note'], ['Science', 'Test how length, tightness and water change a note'], ['Language', 'Explain how your instruments work, to an audience']],
    uses: [['Maths', 'Measuring in cm and ml, patterns'], ['Science', 'Sound, vibration and pitch'], ['Language', 'Explaining clearly, speaking to an audience']],
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
    skills: [['Maths', 'Measure flights and draw a bar chart'], ['Science', 'Run a fair test, changing one thing at a time'], ['Language', 'Write predictions and fair rules']],
    uses: [['Maths', 'Measuring in metres, timing, best of 3'], ['Science', 'Lift, drag and gravity'], ['Language', 'Predicting and explaining']],
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
    skills: [['Maths', 'Measure amounts and chart your results'], ['Science', 'Run a fair test, changing one thing at a time'], ['Language', 'Write a recipe someone else can follow']],
    uses: [['Maths', 'Measuring in ml and cm, tables and bar charts'], ['Science', 'Mixing and how materials change'], ['Language', 'Instructions in steps']],
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
    skills: [['Maths', 'Sort fingerprints and make a tally chart'], ['Science', 'Test which ink shows best with heat'], ['Language', 'Write clues that lead to one answer']],
    uses: [['Maths', 'Tally charts and timing'], ['Science', 'Heat and how materials change'], ['Language', 'Reasoning words: because, so, if']],
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
    skills: [['Maths', 'Time falls and compare results'], ['Science', 'Design, test and improve something to slow a fall'], ['Language', 'Write predictions and explain results']],
    uses: [['Maths', 'Measuring heights, timing, comparing'], ['Science', 'Gravity and air resistance'], ['Language', 'Predicting and explaining']],
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
    skills: [['Maths', 'Use symmetry and measure a frame'], ['Science', 'Test how shape and tail change how it flies'], ['Language', 'Write judging rules and explain your best kite']],
    uses: [['Maths', 'Measuring, symmetry, angles'], ['Science', 'Lift, drag and wind (forces)'], ['Language', 'Rules and explaining']],
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
    skills: [['Maths', 'Plan spacing and measure the circuit'], ['Science', 'Build a circuit, and find and fix a fault'], ['Language', 'Write a message and a how-it-works note']],
    uses: [['Maths', 'Measuring and spacing'], ['Science', 'Electricity: a full loop, + and – sides'], ['Language', 'Writing a greeting, explaining']],
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
    goal: 'Build a robot hand that can grab and lift a cup.',
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
    skills: [['Maths', 'Measure real hands and scale them up'], ['Science', 'Make joints that bend like a real hand'], ['Language', 'Label a plan and explain how it works']],
    uses: [['Maths', 'Measuring, scaling, scoring out of 10'], ['Science', 'Muscles, tendons and joints'], ['Language', 'Labelling and explaining']],
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
    goal: 'Build a dome big enough to sit inside, that stands on its own.',
    who: 'Risers who visit the fort. Show them round.',
    make: [
      ['📐', 'The pieces', 'Measured and cut to size'],
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
    skills: [['Maths', 'Work out how many pieces you need and how long each is'], ['Science', 'Test why some shapes are stronger than others'], ['Language', 'Write a guide for visitors']],
    uses: [['Maths', '2D and 3D shapes, measuring, counting'], ['Science', 'Forces and strong structures'], ['Language', 'Explaining and guiding']],
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
      ['♨️', 'A steam boiler', 'Heats water to make steam'],
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
    skills: [['Maths', 'Time races and find the average'], ['Science', 'Test how heat and boat shape change speed'], ['Language', 'Write race rules and explain how it works']],
    uses: [['Maths', 'Timing, averages'], ['Science', 'Heat, steam, floating and sinking'], ['Language', 'Rules and explaining']],
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
    skills: [['Maths', 'Measure the track and work out speed'], ['Science', 'Test how gears and weight change speed'], ['Language', 'Write race rules and explain how it works']],
    uses: [['Maths', 'Measuring, timing, speed = distance ÷ time'], ['Science', 'Energy, circuits and friction'], ['Language', 'Rules and explaining']],
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
    skills: [['Maths', 'Count spins and chart results'], ['Science', 'Test which blades turn wind into the most light'], ['Language', 'Explain energy changes to visitors']],
    uses: [['Maths', 'Counting, tables and charts'], ['Science', 'Energy changes and circuits'], ['Language', 'Explaining clearly']],
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
