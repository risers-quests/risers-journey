/* Next year at LifeHub: parents' honest thoughts on how LifeHub is working
   for their child (what works, what doesn't, what would suit the child
   better) and which way they are leaning for the next academic year
   (2027–28). It is to understand them, not to persuade or satisfy them:
   every family answers the same questions whichever way they lean. No
   "not sure": they pick the way they lean, and say why.
   Runs on the same engine as 10th Boards (../grade10/grade10.js); {name}
   is the child's name. Parents fill it in from the one parents' link
   (/parents/), no sign-in. Answers save under week key term3-next-year and
   are for staff only (?view=staff here). Families only get it once staff
   OK it there. */
(function () {
  var STAY = 'We’re leaning towards {name} continuing at LifeHub';
  var LEAVE = 'We’re leaning towards {name} leaving LifeHub';
  // A choice is saved exactly as written above ({name} and all).
  function is(v) { return function (a) { return a.route === v; }; }

  window.G10 = {
    title: 'Next year at LifeHub',
    previewName: 'your child',
    intro: 'We would like to hear your honest thoughts about {name}’s time at LifeHub: what is working, what is not, and what would suit {name} best next academic year (2027–28), wherever that is. There are no right or wrong answers, and nothing here is final. Only LifeHub staff see your answers.',
    text: {
      key: 'term3-next-year', approval: 'next-year-approval',
      defaultKids: (window.EOT2_KIDS || []).map(function (k) { return k.slug; }),
      sub: 'For {name}’s parents: your thoughts, and next year',
      hideOptional: true,
      thanks: 'Thank you! You sent this on {date}. We will read it carefully.',
      staffIntro: 'Every Riser’s parents give their honest thoughts: what is working for their child at LifeHub, what is not, what would suit their child better, and which way they are leaning for next academic year (2027–28), with why. Every family answers the same questions whichever way they lean. They fill it in from the one parents’ link (Staff → Parents’ form), no sign-in. Only staff see the answers. Families only get it once it’s OK’d here.',
      previewNote: 'This is what parents see (with their child’s name).',
      who: 'which families it’s for', one: 'family', many: 'families'
    },
    sections: [
      { title: 'How LifeHub is working for {name}', qs: [
        { id: 'working', text: 'What is working well for {name} at LifeHub?', kind: 'text' },
        { id: 'not_working', text: 'What is not working, or not working as well as you hoped?', kind: 'text' },
        { id: 'better_suit', text: 'What would better suit {name}’s learning and growth?', kind: 'text',
          hint: 'It could be something at LifeHub, at home, or somewhere else entirely.' }
      ] },
      { title: 'Next academic year', qs: [
        { id: 'route', text: 'Which way are you leaning for {name} next academic year (2027–28)?', kind: 'one',
          options: [STAY, LEAVE], why: 'What makes you lean this way?' },
        { id: 'where', text: 'Where are you thinking {name} will go?', kind: 'one', when: is(LEAVE), whenLabel: 'Shown only if they lean towards leaving',
          options: ['A school', 'Another homeschool group', 'Homeschooling on our own', 'Something else'], why: 'Tell us a little more, if you like.' }
      ] },
      { title: 'Anything else', qs: [
        { id: 'meet', text: 'Would you like a meeting with us about this?', kind: 'one',
          options: ['Yes, please', 'No, not needed'] },
        { id: 'else', text: 'Anything else you would like us to know?', kind: 'text', optional: true }
      ] }
    ]
  };
})();
