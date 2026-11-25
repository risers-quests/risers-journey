/* Next year at LifeHub: parents tell us their plans for the next academic
   year (2027–28): staying, not sure, or leaving. Runs on the same engine as
   10th Boards (../grade10/grade10.js); {name} is the child's name.
   Parents fill it in from their family link (/parents/), with no sign-in,
   or on their child's Term 3 page. Answers save under week key
   term3-next-year; staff read them all on ?view=staff. Families only see
   it once staff OK it there. */
(function () {
  var YES = 'Yes, {name} will continue at LifeHub';
  var UNSURE = 'We’re not sure yet';
  var NO = 'No, {name} won’t continue at LifeHub';
  // A choice is saved exactly as written above ({name} and all).
  function is(v) { return function (a) { return a.route === v; }; }

  window.G10 = {
    title: 'Next year at LifeHub',
    previewName: 'your child',
    intro: 'We are planning the next academic year (2027–28) and would love to know your plans for {name}. It takes about 3 minutes. Nothing here is final: if your plans change, just tell us. It saves as you type.',
    text: {
      key: 'term3-next-year', approval: 'next-year-approval',
      defaultKids: (window.EOT2_KIDS || []).map(function (k) { return k.slug; }),
      sub: 'For {name}’s parents: your plans for next year',
      hideOptional: true,
      thanks: 'Thank you! You sent this on {date}. If anything changes, you can open the same link and update it.',
      staffIntro: 'Every Riser’s parents tell us whether their child is staying at LifeHub next academic year (2027–28), not sure, or leaving, and why. Each family has its own link with no sign-in (Staff → Parents’ links), and it also shows on their child’s Term 3 page. Families only see it once it’s OK’d here.',
      previewNote: 'This is what parents see (with their child’s name).',
      who: 'which families it’s for', one: 'family', many: 'families'
    },
    sections: [
      { title: 'Next academic year', qs: [
        { id: 'route', text: 'Will {name} continue at LifeHub next academic year (2027–28)?', kind: 'one',
          options: [YES, UNSURE, NO] }
      ] },
      { title: 'Staying with us', when: is(YES), whenLabel: 'Shown only if they say yes', qs: [
        { id: 'going_well', text: 'What is going well for {name} at LifeHub?', kind: 'text' },
        { id: 'change', text: 'Is there anything you would like us to change or add for {name} next year?', kind: 'text', optional: true }
      ] },
      { title: 'Not sure yet', when: is(UNSURE), whenLabel: 'Shown only if they are not sure', qs: [
        { id: 'deciding', text: 'What are you weighing up?', kind: 'text',
          hint: 'For example: another school, the 10th boards, cost, distance, what {name} wants.' },
        { id: 'help', text: 'What would help you decide?', kind: 'text', optional: true },
        { id: 'when', text: 'When do you expect to decide?', kind: 'one',
          options: ['By the end of December', 'By the end of February', 'By the end of April', 'We don’t know yet'] }
      ] },
      { title: 'Moving on', when: is(NO), whenLabel: 'Shown only if they say no', qs: [
        { id: 'where', text: 'Where will {name} go next?', kind: 'one',
          options: ['A school', 'Another homeschool group', 'Homeschooling on our own', 'Something else'], why: 'Tell us a little more, if you like.' },
        { id: 'reason', text: 'What led to this decision?', kind: 'text', optional: true,
          hint: 'It helps us get better for other families. Say as much or as little as you like.' }
      ] },
      { title: 'Anything else', qs: [
        { id: 'meet', text: 'Would you like a meeting with us about next year?', kind: 'one',
          options: ['Yes, please', 'No, not needed'] },
        { id: 'else', text: 'Anything else you would like us to know?', kind: 'text', optional: true }
      ] }
    ]
  };
})();
