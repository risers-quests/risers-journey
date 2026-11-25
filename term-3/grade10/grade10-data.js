/* 10th Boards: the form parents fill in before we discuss the 10th boards
   with them in person. It only finds out where they are now, so nothing
   here asks them to decide (no fixed years or plan lengths). Staying at
   LifeHub or not is asked in Next year at LifeHub, not here.
   {name} is the child's name.
   Each question: id, text, kind ('text' | 'one' | 'many'), options, hint,
   why (a box for "why?" after a choice), optional. A section or question
   with when: 'exam' shows only if they're leaning towards the 10th boards.
   Not taking them (an answer in G.NO) needs no questions of its own.
   Staff OK it before families see it. */
window.G10 = {
  title: '10th Boards: Before We Meet',
  intro: 'This form helps us understand where you are now on the 10th boards for {name}: which way you are leaning and, if you are thinking about the 10th boards, what you have already looked into and how you would like it to work. Nothing here is a decision. We will go through it with you in detail in person, and will be in touch soon to schedule a time. There are no right or wrong answers. It saves as you type.',
  // The answers that mean "not the 10th boards". The rest are wordings of
  // earlier versions, so answers given before still show the right
  // questions. (Staying at LifeHub or not is asked in Next year at LifeHub.)
  NO: ['We’re leaning towards not taking the 10th boards', 'We’re leaning towards carrying on as we are at LifeHub', 'We’d like to carry on as we are at LifeHub', 'We’re leaning towards a different path', 'No, we’re not aiming for 10th grade'],
  conds: { exam: 'Shown only if they are leaning towards the 10th boards' },
  text: {
    sub: 'For {name}’s parents, to fill in before our meeting',
    hideOptional: true,
    thanks: 'Thank you! You submitted this on {date}. We will go through it with you in person, and will be in touch soon to schedule a time.',
    staffIntro: 'Parents fill this in before we discuss the 10th boards with them in person: which way they are leaning (staying at LifeHub or not is asked separately, in Next year at LifeHub), where they are now and, for the 10th boards, what they have already researched, the materials and ways of working they would like, and the support they need. Families only see it once it’s OK’d here; they fill it in from the one parents’ link (Staff → Parents’ form), and only staff see the answers.'
  },
  sections: [
    { title: 'Where you are now', qs: [
      { id: 'route', text: 'Right now, are you thinking of {name} taking the 10th boards?', kind: 'one',
        options: ['We’re leaning towards the 10th boards', 'We’re leaning towards not taking the 10th boards'],
        why: 'What makes you lean this way?' },
      { id: 'feel', text: 'How do you feel about it?', kind: 'one',
        options: ['Confident', 'Excited', 'Unsure', 'Worried'], why: 'Tell us a little more.' },
      { id: 'child', text: 'What does {name} think about it, from what you have seen or heard?', kind: 'text' }
    ] },
    { title: 'If you’re leaning towards the 10th boards', when: 'exam', qs: [
      { id: 'research', text: 'What have you already found out about the 10th boards?', kind: 'text',
        hint: 'For example: the boards, the subjects, how the exams work, what other families, schools or teachers have told you.' },
      { id: 'board', text: 'Is there a board or route you are drawn to?', kind: 'one',
        options: ['NIOS', 'IGCSE (Cambridge)', 'CBSE (private candidate)', 'ICSE', 'Something else'], why: 'Why this one?' },
      { id: 'subjects', text: 'Which subjects do you have in mind, and why?', kind: 'text', optional: true },
      { id: 'materials', text: 'Have you found study materials or resources you would like {name} to follow?', kind: 'many',
        options: ['The board’s own textbooks', 'Guide books or question banks', 'Past papers', 'Online courses or videos', 'Learning apps', 'Coaching centre material', 'Not yet'] },
      { id: 'materials_more', text: 'Tell us which ones (names, links, publishers) and what you like about them.', kind: 'text', optional: true },
      { id: 'prepare', text: 'How would you like {name} to prepare? Choose all that fit.', kind: 'many',
        options: ['Studying on their own', 'Online classes', 'A tutor', 'Studying with friends', 'Practice tests'] },
      { id: 'how', text: 'Is there a particular way you would like it to work, at LifeHub and at home?', kind: 'text',
        hint: 'For example: a daily routine, a tutor for some subjects, keeping projects and quests alongside it, regular practice tests.' }
    ] },
    { title: 'About {name}', qs: [
      { id: 'strengths', text: 'Which subjects or areas does {name} enjoy or find easier, and which do they find hard?', kind: 'text' },
      { id: 'learns', text: 'Is there anything about how {name} learns that we should keep in mind?', kind: 'text',
        hint: 'For example: needing more time, finding exams stressful, a learning difficulty, how they like to study.', optional: true },
      { id: 'after', text: 'What do you hope {name} will go on to do later?', kind: 'text', hint: 'Further studies, a field they love, work, something else…' }
    ] },
    { title: 'Support for the 10th boards', when: 'exam', qs: [
      { id: 'lifehub', text: 'What would you need from LifeHub and the facilitators for the 10th boards?', kind: 'text' },
      { id: 'family', text: 'What support can you give {name} at home while preparing?', kind: 'text' }
    ] },
    { title: 'Before we meet', qs: [
      { id: 'worry', text: 'Do you have any worries or concerns?', kind: 'text', optional: true },
      { id: 'ask', text: 'What questions would you like us to answer at the meeting?', kind: 'text', optional: true },
      { id: 'who', text: 'Who will come to the meeting? Would you like {name} to be there too?', kind: 'text', optional: true },
      { id: 'more', text: 'Anything else you would like us to know?', kind: 'text', optional: true }
    ] }
  ]
};
