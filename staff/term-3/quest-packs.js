/* Term 3 Quests — Quest Packs: what a team must make, when it's done, the
   boundaries and the rules for its quest. A pack is written for a quest
   once a team has chosen it; until then the team sees that it's on its
   way. Very simple words: the challenge is the build, not the reading.

   T3_PACKS[<project id>] = {
     mission: one line,
     make:    [[icon, 'big words', 'small words'], …]   up to 6 tiles,
     done:    ['short line', …]                         up to 6,
     notDone: 'one example of not done',
     bounds:  [[icon, 'short line'], …]                 for this quest,
     rules:   [[icon, 'short line'], …]                 for this quest,
     formats: [{ title, note, cols: […], rows: [[…], …] }]  optional
   }
   The rules for every quest are in T3_EVERY_RULES. */
window.T3_EVERY_RULES = [
  ['🤝', 'Be kind to everyone'],
  ['👨‍👩‍👧', 'Fine for families to see'],
  ['🧹', 'Clean up every time']
];

window.T3_PACKS = {
  'sol-minigolf': {
    mission: 'Build a 6-hole mini golf course that anyone at LifeHub can play.',
    make: [
      ['⛳', '6 holes', 'Every hole different'],
      ['🗺️', '1 course map', 'Where each hole goes, before you build'],
      ['📝', '1 score sheet', 'Count your hits on each hole'],
      ['🪧', '6 signs', 'Hole number and a fun name'],
      ['🏌️', 'Golf day', '20 players or more'],
      ['🎤', 'Short talk', 'How the ball bounces off walls']
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
    bounds: [
      ['🪧', 'Kind, fun hole names. Nothing rude or mean.'],
      ['🎨', 'Happy decorations. Nothing scary or gory.'],
      ['🔨', 'No sharp bits, nails or broken glass'],
      ['🙅', 'Never hit balls at people or windows'],
      ['⛳', 'It stays mini golf. No other game.'],
      ['📍', 'It fits in our space in the hall']
    ],
    rules: [
      ['🏌️', 'Tap the ball gently'],
      ['🙋', 'Everyone builds a hole'],
      ['🧪', 'Test before golf day']
    ]
  }
};
