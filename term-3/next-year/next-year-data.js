/* Next year at LifeHub: parents tell us which way they are leaning for
   the next academic year (2027–28): continuing at LifeHub or leaving. No
   "not sure": they pick the way they lean, and say why. Runs on the same
   engine as 10th Boards (../grade10/grade10.js); {name} is the child's name.
   Parents fill it in from the one parents' link (/parents/), no sign-in.
   Answers save under week key term3-next-year and are for staff only
   (?view=staff here); Risers can't see them. Families only get it once
   staff OK it there. */
(function () {
  var STAY = 'We’re leaning towards {name} continuing at LifeHub';
  var LEAVE = 'We’re leaning towards {name} leaving LifeHub';
  // A choice is saved exactly as written above ({name} and all).
  function is(v) { return function (a) { return a.route === v; }; }

  window.G10 = {
    title: 'Next year at LifeHub',
    previewName: 'your child',
    intro: 'We are planning the next academic year (2027–28) and would love to know which way you are leaning for {name}. It takes about 3 minutes. Nothing here is final: if your plans change, just tell us. Only LifeHub staff see your answers.',
    text: {
      key: 'term3-next-year', approval: 'next-year-approval',
      defaultKids: (window.EOT2_KIDS || []).map(function (k) { return k.slug; }),
      sub: 'For {name}’s parents: your plans for next year',
      hideOptional: true,
      thanks: 'Thank you! You sent this on {date}. If anything changes, just tell us.',
      staffIntro: 'Every Riser’s parents tell us which way they are leaning for next academic year (2027–28): continuing at LifeHub or leaving, and why. They fill it in from the one parents’ link (Staff → Parents’ form), no sign-in. Only staff see the answers. Families only get it once it’s OK’d here.',
      previewNote: 'This is what parents see (with their child’s name).',
      who: 'which families it’s for', one: 'family', many: 'families'
    },
    sections: [
      { title: 'Next academic year', qs: [
        { id: 'route', text: 'Which way are you leaning for {name} next academic year (2027–28)?', kind: 'one',
          options: [STAY, LEAVE], why: 'What makes you lean this way?' }
      ] },
      { title: 'Continuing with us', when: is(STAY), whenLabel: 'Shown only if they lean towards continuing', qs: [
        { id: 'going_well', text: 'What is going well for {name} at LifeHub?', kind: 'text' },
        { id: 'change', text: 'Is there anything you would like us to change or add for {name} next year?', kind: 'text', optional: true }
      ] },
      { title: 'Moving on', when: is(LEAVE), whenLabel: 'Shown only if they lean towards leaving', qs: [
        { id: 'where', text: 'Where are you thinking {name} will go?', kind: 'one',
          options: ['A school', 'Another homeschool group', 'Homeschooling on our own', 'Something else'], why: 'Tell us a little more, if you like.' },
        { id: 'stay_if', text: 'Is there anything that would make you stay?', kind: 'text', optional: true }
      ] },
      { title: 'Anything else', qs: [
        { id: 'meet', text: 'Would you like a meeting with us about next year?', kind: 'one',
          options: ['Yes, please', 'No, not needed'] },
        { id: 'else', text: 'Anything else you would like us to know?', kind: 'text', optional: true }
      ] }
    ]
  };
})();
