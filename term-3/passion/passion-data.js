/* Passion Finder: finds what each Riser really loves, so we can give them
   time to do more of it. Runs on the 10th Boards form's page
   (../grade10/grade10.js): question kinds 'text' | 'one' | 'many', hint,
   why, optional (not labelled). {name} is the Riser, {pick} the ONE thing
   they chose.

   How it gets past quick, surface answers:
   1. They tick what they choose to do when nobody tells them, then make
      quick either/or choices.
   2. They pick the ONE thing they'd keep (only from what they ticked).
   3. For that one thing they're asked for proof, not preferences: when
      they last did it and what exactly, the best thing they've made, names
      they know in it, whether they'd still do it if nobody saw, what
      they've skipped for it.
   There's no "not sure" answer: everyone picks one.
   Staff OK it and choose which Risers see it before anyone does. */
(function () {
  var OTHER = 'Something else';
  var DOING = ['Drawing or painting', 'Building or making things', 'Playing games', 'Making games', 'Coding or tinkering with tech', 'Reading', 'Writing stories or poems', 'Music: playing, singing or making it', 'Sport or moving about', 'Cooking or baking', 'Being out in nature', 'Taking photos or making videos', 'Taking things apart to see how they work', 'Looking after animals or plants', 'Helping or teaching other people', 'Selling things or running a small business', OTHER];
  var chosen = function (a) { return !!a.top; };

  window.G10 = {
    title: 'Passion Finder',
    previewName: 'you',
    intro: 'This is all about you: what you really love doing. There are no right or wrong answers and nothing here is marked. Be honest, not impressive: the more real your answers, the better we can make time for you to do more of what you love. It saves as you type.',
    pick: { from: 'top', otherOption: OTHER, otherFrom: 'free_other', none: 'your one thing' },
    text: {
      key: 'term3-passion', approval: 'passion-approval', defaultKids: [],
      sub: 'All about what {name} loves',
      send: 'Send to my facilitator',
      hideOptional: true,
      thanks: 'Thank you! You sent this on {date}. Your facilitator will read it and talk with you about what you love and how to make time for it.',
      staffIntro: 'Each Riser ticks what they choose to do when nobody tells them, makes quick either/or choices, then picks the ONE thing they’d keep. For that one thing they are asked for proof rather than preferences (when they last did it, the best thing they made, names they know, whether they’d do it if nobody saw). Answers that are vague or don’t hold together are your starting point for the chat. Risers only see it once it’s OK’d here; they find it on their Term 3 page.',
      previewNote: 'This is what Risers see. The questions in “Your one” follow whatever they pick.',
      who: 'which Risers it’s for', one: 'Riser', many: 'Risers'
    },
    sections: [
      { title: 'What you choose to do', qs: [
        { id: 'free', text: 'When nobody tells you what to do, what do you actually choose to do? Choose all that are true.', kind: 'many', rerender: true,
          hint: 'Only the things you really do, not things you’d like to do one day.', options: DOING },
        { id: 'free_other', text: 'What is the something else?', kind: 'text', when: function (a) { return (a.free || []).indexOf(OTHER) !== -1; }, whenLabel: 'Shown only if they tick “Something else”' },
        { id: 'flow', text: 'What is something you do where you lose track of time?', kind: 'text', hint: 'The thing where you look up and an hour has gone by.' },
        { id: 'askme', text: 'What do friends or family ask you to help with, or say you’re good at?', kind: 'text', optional: true }
      ] },
      { title: 'Quick choices', qs: [
        { id: 'c_make', text: 'On a free afternoon, would you rather…', kind: 'one', options: ['Make something with my hands', 'Make something on a screen'] },
        { id: 'c_people', text: 'Would you rather…', kind: 'one', options: ['Do it with other people', 'Do it on my own'] },
        { id: 'c_new', text: 'Would you rather…', kind: 'one', options: ['Learn something completely new', 'Get really good at something I already do'] },
        { id: 'c_place', text: 'Would you rather be…', kind: 'one', options: ['Indoors', 'Outdoors'] },
        { id: 'c_think', text: 'Would you rather…', kind: 'one', options: ['Create something', 'Figure something out'] }
      ] },
      { title: 'Your ONE', qs: [
        { id: 'top', text: 'Of everything you ticked, if you could keep only ONE, which would it be?', kind: 'one', rerender: true,
          optionsFrom: 'free', emptyHint: 'Tick what you choose to do at the top first; it will show up here.' }
      ] },
      { title: 'Your one: {pick}', when: chosen, whenLabel: 'Shown once they pick their ONE (the questions are about that one thing)', qs: [
        { id: 'last', text: 'When did you last do it, and what exactly did you do?', kind: 'text', hint: 'As exactly as you can: which day, what you did, for how long.' },
        { id: 'since', text: 'How long have you been doing it?', kind: 'one', options: ['I’ve just started', 'A few months', 'About a year', 'More than a year', 'Since I was little'] },
        { id: 'best', text: 'What is the best thing you have done or made in it so far?', kind: 'text', hint: 'Bring it, or a photo of it, to your chat with your facilitator.' },
        { id: 'names', text: 'Name a person, channel, book, game, tool or team you love in it.', kind: 'text', hint: 'As many as you like.' },
        { id: 'unseen', text: 'Would you still do it if nobody ever saw it or said “well done”?', kind: 'one', options: ['Yes, I’d still do it', 'No, I like people seeing it'] },
        { id: 'skipped', text: 'Have you ever chosen it over something else you could have done?', kind: 'one', options: ['Yes', 'No'], why: 'What did you choose it over?' },
        { id: 'next', text: 'What do you wish you could do in it that you can’t do yet?', kind: 'text' },
        { id: 'help', text: 'What would help you do more of it?', kind: 'many',
          options: ['Time in my week for it', 'Materials or tools', 'Someone who knows how', 'Videos, books or courses', 'A friend who loves it too', 'A quiet space'] }
      ] }
    ]
  };
})();
