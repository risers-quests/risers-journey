/* 10th Boards: the pre-meeting form parents fill in before we meet. The
   meeting is where we ask them whether their child takes the 10th boards
   route or not; this form only finds out where they are now, so nothing
   here asks them to decide (no fixed years or plan lengths).
   {name} is the child's name.
   Each question: id, text, kind ('text' | 'one' | 'many'), options, hint,
   why (a box for "why?" after a choice), optional. A section or question
   with when: 'exam' shows only if they're leaning towards the 10th boards
   (or aren't sure); when: 'noexam' only if they're leaning towards another
   path (an answer in G.NO). Staff OK it before families see it. */
window.G10 = {
  title: '10th Boards: Before We Meet',
  intro: 'At our meeting we will talk with you about whether {name} takes the 10th boards route or a different path. Nothing here is a decision. This form just helps us understand where you are now, what you have already looked into and what you would like, so the meeting can start from there. There are no right or wrong answers. It saves as you type.',
  // The answers that mean "another path". The second is the wording of an
  // earlier version, so answers given before still show the right questions.
  NO: ['We’re leaning towards a different path', 'No, we’re not aiming for 10th grade'],
  conds: { exam: 'Shown only if they answer “Leaning towards the 10th boards” or “Not sure yet”', noexam: 'Shown only if they answer “Leaning towards a different path”' },
  text: {
    sub: 'For {name}’s parents, to fill in before our meeting',
    send: 'Send before the meeting',
    staffIntro: 'Parents fill this in before the meeting where we ask them whether their child takes the 10th boards route or not: where they are now, what they have already researched, the materials and ways of working they would like, and their questions. Families only see it once it’s OK’d here; they find it on their child’s Term 3 page.'
  },
  sections: [
    { title: 'Where you are now', qs: [
      { id: 'route', text: 'Right now, which way are you leaning for {name}?', kind: 'one',
        options: ['We’re leaning towards the 10th boards', 'We’re leaning towards a different path', 'We’re not sure yet'],
        why: 'What makes you lean this way?' },
      { id: 'feel', text: 'How do you feel about it?', kind: 'one',
        options: ['Confident', 'Excited', 'Unsure', 'Worried'], why: 'Tell us a little more.' },
      { id: 'child', text: 'What does {name} think about it, from what you have seen or heard?', kind: 'text' },
      { id: 'know', text: 'What do you already know about the 10th boards and the other paths?', kind: 'text', hint: 'For example: the boards, the subjects, how the exams work, what other families have done.' }
    ] },
    { title: 'If you’re leaning towards the 10th boards', when: 'exam', qs: [
      { id: 'research', text: 'What have you already looked into or thought about for the 10th boards?', kind: 'text',
        hint: 'Anything you have read, watched, or heard from other families, schools or teachers.' },
      { id: 'board', text: 'Is there a board or route you are drawn to?', kind: 'one',
        options: ['NIOS', 'IGCSE (Cambridge)', 'CBSE (private candidate)', 'ICSE', 'Not sure yet', 'Something else'], why: 'Why this one?' },
      { id: 'subjects', text: 'Which subjects do you have in mind, and why?', kind: 'text', optional: true },
      { id: 'materials', text: 'Have you found study materials or resources you would like {name} to follow?', kind: 'many',
        options: ['The board’s own textbooks', 'Guide books or question banks', 'Past papers', 'Online courses or videos', 'Learning apps', 'Coaching centre material', 'Not yet'] },
      { id: 'materials_more', text: 'Tell us which ones (names, links, publishers) and what you like about them.', kind: 'text', optional: true },
      { id: 'prepare', text: 'How would you like {name} to prepare? Choose all that fit.', kind: 'many',
        options: ['Studying on their own', 'Sessions with a facilitator at LifeHub', 'Online classes', 'A tutor', 'Studying with friends', 'Practice tests'] },
      { id: 'how', text: 'Is there a particular way you would like it to work, at LifeHub and at home?', kind: 'text',
        hint: 'For example: a daily routine, a tutor for some subjects, keeping projects and quests alongside it, regular practice tests.' }
    ] },
    { title: 'If you’re leaning towards a different path', when: 'noexam', qs: [
      { id: 'instead', text: 'What path do you have in mind for {name} instead?', kind: 'text' },
      { id: 'research_other', text: 'What have you already looked into about it?', kind: 'text', hint: 'Anything you have read, watched, or heard from other families or people on that path.' },
      { id: 'recognise', text: 'How would you like {name}’s learning to be shown or recognised?', kind: 'text', hint: 'For example: a portfolio, certificates, projects, work experience.', optional: true }
    ] },
    { title: 'About {name}', qs: [
      { id: 'strengths', text: 'Which subjects or areas does {name} enjoy or find easier, and which do they find hard?', kind: 'text' },
      { id: 'learns', text: 'Is there anything about how {name} learns that we should keep in mind?', kind: 'text',
        hint: 'For example: needing more time, finding exams stressful, a learning difficulty, how they like to study.', optional: true },
      { id: 'week', text: 'What else fills {name}’s week outside LifeHub?', kind: 'text', hint: 'Sport, music, art, classes, family commitments…', optional: true },
      { id: 'school', text: 'Might {name} join a school, or study somewhere else, later on?', kind: 'one',
        options: ['Yes', 'Maybe', 'No', 'Not sure'], why: 'Where are you thinking of?' },
      { id: 'after', text: 'What do you hope {name} will go on to do later?', kind: 'text', hint: 'Further studies, a field they love, work, something else…' }
    ] },
    { title: 'Support', qs: [
      { id: 'lifehub', text: 'What would you need from LifeHub and the facilitators?', kind: 'text' },
      { id: 'family', text: 'What support can you give {name} at home?', kind: 'text' },
      { id: 'costs', text: 'Are there costs you would like to talk through?', kind: 'text', hint: 'For example: exam fees, books, tutors or classes.', optional: true }
    ] },
    { title: 'Before we meet', qs: [
      { id: 'worry', text: 'Do you have any worries or concerns?', kind: 'text', optional: true },
      { id: 'ask', text: 'What questions would you like us to answer at the meeting?', kind: 'text', optional: true },
      { id: 'who', text: 'Who will come to the meeting? Would you like {name} to be there too?', kind: 'text', optional: true },
      { id: 'more', text: 'Anything else you would like us to know?', kind: 'text', optional: true }
    ] }
  ]
};
