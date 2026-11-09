/* Passion Finder: the questionnaire each Riser fills in to find what they love,
   so we can give them time to do more of it. Runs on the 10th Grade
   questionnaire's page (../grade10/grade10.js): same question kinds
   ('text' | 'one' | 'many'), hint, why, optional. {name} is the Riser.
   `text` sets the save keys and wording for Risers instead of parents.
   Staff OK it and choose which Risers see it before anyone does. */
window.G10 = {
  title: 'Passion Finder',
  previewName: 'you',
  intro: 'This is all about you: what you love doing, what you are curious about, and what you would like to get really good at. There are no right or wrong answers, and nothing here is marked. Your answers help us find what you really love, so we can make time for you to do more of it. It saves as you type.',
  text: {
    key: 'term3-passion', approval: 'passion-approval', defaultKids: [],
    sub: 'All about what {name} loves',
    send: 'Send to my facilitator',
    thanks: 'Thank you! You sent this on {date}. Your facilitator will read it and talk with you about what you love and how to make time for it.',
    staffIntro: 'Each Riser fills this in to tell us what they love, what they are curious about and what they would spend time on if they could, so we can find their passion and give them time for it. Risers only see it once it’s OK’d here; they find it on their Term 3 page.',
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
    { title: 'How you like to do it', qs: [
      { id: 'style', text: 'Which of these do you enjoy most? Choose all that fit.', kind: 'many',
        options: ['Making things with my hands', 'Making things on a screen', 'Performing', 'Finding things out', 'Practising until I get really good', 'Solving puzzles and problems', 'Being outdoors', 'Teaching or explaining to others'] },
      { id: 'with', text: 'Who would you like to do it with?', kind: 'one',
        options: ['On my own', 'With a friend', 'With a few others who love it too', 'It doesn’t matter to me'] }
    ] },
    { title: 'Time to do what you love', qs: [
      { id: 'hours', text: 'If you had a few hours every week to spend on anything you love, what would you do?', kind: 'text', hint: 'Say as much as you like. More than one thing is fine.' },
      { id: 'wish', text: 'What is one thing you wish you were really good at?', kind: 'text', hint: 'For example: drawing comics, coding, baking bread, a sport, an instrument, another language, editing videos.' },
      { id: 'learnfrom', text: 'Is there someone (anyone: someone you know, or someone famous) who does this, that you would love to learn from?', kind: 'text', optional: true },
      { id: 'help', text: 'What would help you do more of it?', kind: 'many',
        options: ['Time in my week for it', 'Materials or tools', 'Someone who knows how', 'Videos, books or courses', 'A friend who loves it too', 'A quiet space', 'Nothing, I just need the time'] },
      { id: 'stuck', text: 'Is anything stopping you from doing it now? Anything else we should know?', kind: 'text', optional: true }
    ] }
  ]
};
