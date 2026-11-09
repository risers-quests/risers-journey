/* Passion Finder: the questionnaire each Riser fills in to find a passion
   project to take on and grow into a skill. Runs on the 10th Grade
   questionnaire's page (../grade10/grade10.js): same question kinds
   ('text' | 'one' | 'many'), hint, why, optional. {name} is the Riser.
   `text` sets the save keys and wording for Risers instead of parents.
   Staff OK it and choose which Risers see it before anyone does. */
window.G10 = {
  title: 'Passion Finder',
  previewName: 'you',
  intro: 'This is all about you: what you love doing, what you are curious about, and what you would like to get really good at. There are no right or wrong answers, and nothing here is marked. Your answers help us find a passion project you can take on and grow into a real skill. It saves as you type.',
  text: {
    key: 'term3-passion', approval: 'passion-approval', defaultKids: [],
    sub: '{name}’s passion project, step 1',
    send: 'Send to my facilitator',
    thanks: 'Thank you! You sent this on {date}. Your facilitator will read it and talk with you about your passion project.',
    staffIntro: 'Each Riser fills this in to find a passion project: what they love, what they are curious about, how they like to work and what they would like to get good at. Risers only see it once it’s OK’d here; they find it on their Term 3 page.',
    previewNote: 'This is what Risers see.',
    who: 'which Risers it’s for', one: 'Riser', many: 'Risers'
  },
  sections: [
    { title: 'What you love doing', qs: [
      { id: 'free', text: 'When you have free time, what do you choose to do? Choose all that fit.', kind: 'many',
        options: ['Drawing or painting', 'Building or making things', 'Playing or making games', 'Coding or tinkering with tech', 'Reading', 'Writing stories or poems', 'Music: playing, singing or making it', 'Sport or moving about', 'Cooking or baking', 'Being out in nature', 'Taking photos or making videos', 'Taking things apart to see how they work', 'Looking after animals or plants', 'Helping or teaching other people', 'Selling things or running a small business', 'Something else'] },
      { id: 'flow', text: 'What is something you do where you lose track of time?', kind: 'text', hint: 'The thing where you look up and an hour has gone by.' },
      { id: 'proud', text: 'Tell us about something you made or did that you felt really proud of.', kind: 'text', hint: 'At LifeHub, at home, anywhere.' },
      { id: 'askme', text: 'What do friends or family come to you for help with?', kind: 'text', optional: true }
    ] },
    { title: 'What you’re curious about', qs: [
      { id: 'topics', text: 'Which of these would you love to learn more about? Choose your favourites.', kind: 'many',
        options: ['Animals and nature', 'Space and the planets', 'The human body and health', 'Inventions and engineering', 'Robots and AI', 'Computers, apps and websites', 'Art and design', 'Fashion and clothes', 'Music', 'Film, animation and YouTube', 'Stories, books and writing', 'History and how people lived', 'Countries, languages and cultures', 'Money, business and selling', 'Food and cooking', 'Sport and fitness', 'The environment and climate', 'Helping people and communities'] },
      { id: 'question', text: 'What is a question you would really like to find the answer to?', kind: 'text', hint: 'Big or small, e.g. “How do they make games?” or “Why do cats purr?”' },
      { id: 'rabbit', text: 'What do you watch, read or look up when nobody tells you to?', kind: 'text', hint: 'Videos, channels, books, websites, people you follow.', optional: true }
    ] },
    { title: 'How you like to work', qs: [
      { id: 'style', text: 'Which ways of working do you enjoy most? Choose all that fit.', kind: 'many',
        options: ['Making things with my hands', 'Making things on a screen', 'Performing or presenting', 'Finding things out and researching', 'Planning and organising', 'Solving puzzles and problems', 'Talking to people and finding out what they think', 'Teaching or explaining to others'] },
      { id: 'team', text: 'Would you rather work on a project…', kind: 'one',
        options: ['On my own', 'With one friend', 'In a small team', 'It doesn’t matter to me'], why: 'Why?' },
      { id: 'length', text: 'What kind of project sounds best?', kind: 'one',
        options: ['Something I can finish in a few weeks', 'A bigger project over a whole term', 'Something I keep growing for a year or more', 'Not sure'] }
    ] },
    { title: 'What you’d like to get good at', qs: [
      { id: 'wish', text: 'What is one skill you wish you had right now?', kind: 'text', hint: 'For example: drawing comics, coding a game, baking bread, speaking another language, editing videos.' },
      { id: 'make', text: 'If you had three months, the things you need and someone to help you, what would you make or do?', kind: 'text' },
      { id: 'show', text: 'At the end, who would you love to show it to, and how?', kind: 'text', hint: 'An exhibition, a video, selling it, teaching a class, a website, a performance…', optional: true }
    ] },
    { title: 'Your project ideas', qs: [
      { id: 'ideas', text: 'Write down one to three passion project ideas.', kind: 'text', hint: 'They can be wild! We’ll help you shape one into a project.' },
      { id: 'excited', text: 'How excited are you to start a passion project?', kind: 'one',
        options: ['Can’t wait!', 'Quite excited', 'A bit unsure', 'Not sure what to pick yet'] },
      { id: 'help', text: 'What would you need to get going?', kind: 'many',
        options: ['Ideas to choose from', 'Materials or tools', 'Time in my week for it', 'Someone who knows the skill', 'Videos or courses to learn from', 'A friend to do it with', 'Help planning the steps'] },
      { id: 'stuck', text: 'What might get in the way, and is there anything else we should know?', kind: 'text', optional: true }
    ] }
  ]
};
