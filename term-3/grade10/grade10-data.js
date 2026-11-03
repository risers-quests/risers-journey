/* 10th Grade: the questionnaire parents fill in before the meeting about
   their child's path: taking the 10th grade exams at the usual age,
   later, or not aiming for 10th grade at all. {name} is the child's name.
   Each question: id, text, kind ('text' | 'one' | 'many'), options, hint,
   why (a box for "why?" after a choice), optional. A section or question
   with when: 'exam' shows only if they are thinking of the 10th grade
   route (or haven't decided); when: 'noexam' only if they are not
   (G10.NO is that answer). Staff OK it before families see it. */
window.G10 = {
  title: '10th Grade: Parents’ Questionnaire',
  intro: 'Please fill this in before our meeting about {name}’s path ahead: whether to take the 10th grade exams at the usual age, later, or not to aim for 10th grade at all. There are no right or wrong answers; it helps us understand what you think, so the meeting can start from there. It saves as you type.',
  NO: 'No, we’re not aiming for 10th grade',
  sections: [
    { title: 'The big question', qs: [
      { id: 'route', text: 'Would you like {name} to take the 10th grade exams?', kind: 'one',
        options: ['Yes, at the usual age, when students in school take it', 'Yes, but later than usual', 'No, we’re not aiming for 10th grade', 'We haven’t decided yet'],
        why: 'What makes you lean this way?' },
      { id: 'feel', text: 'How do you feel about this choice?', kind: 'one',
        options: ['Confident', 'Excited', 'Unsure', 'Worried'], why: 'Tell us a little more.' },
      { id: 'child', text: 'What does {name} think about it, from what you have seen or heard?', kind: 'text' },
      { id: 'know', text: 'What do you already know about the 10th grade exams, the boards, and other paths?', kind: 'text', hint: 'For example: the boards, the subjects, how the exams work, what other families have done.' }
    ] },
    { title: 'If {name} takes the 10th grade route', when: 'exam', qs: [
      { id: 'board', text: 'Which board or route are you considering?', kind: 'one',
        options: ['NIOS', 'IGCSE (Cambridge)', 'CBSE (private candidate)', 'ICSE', 'Not sure yet', 'Something else'], why: 'Why this one?' },
      { id: 'when', text: 'When would you like {name} to take the exams?', kind: 'one', options: ['2027', '2028', '2029', 'Later', 'Not sure yet'] },
      { id: 'subjects', text: 'Which subjects do you have in mind, and why?', kind: 'text' },
      { id: 'prepare', text: 'How would you like {name} to prepare? Choose all that fit.', kind: 'many',
        options: ['Studying on their own', 'Sessions with a facilitator at LifeHub', 'Online classes', 'A tutor', 'Studying with friends', 'Past papers and practice tests'] },
      { id: 'hours', text: 'How much time could {name} give it each week?', kind: 'one', options: ['Less than 5 hours', '5–10 hours', '10–15 hours', 'More than 15 hours', 'Not sure yet'] }
    ] },
    { title: 'If {name} doesn’t take the 10th grade route', when: 'noexam', qs: [
      { id: 'instead', text: 'What path do you have in mind for {name} instead?', kind: 'text' },
      { id: 'goals', text: 'What would you like {name} to be able to do, or to have done, in the next few years?', kind: 'text' },
      { id: 'recognise', text: 'How would you like {name}’s learning to be shown or recognised?', kind: 'text', hint: 'For example: a portfolio, certificates, projects, work experience.', optional: true }
    ] },
    { title: 'Looking ahead', qs: [
      { id: 'after', text: 'What do you hope {name} will go on to after this stage?', kind: 'text', hint: 'Further studies, a field they love, work, something else…' },
      { id: 'plan', text: 'How do you picture {name}’s learning over the next couple of years, at LifeHub and at home?', kind: 'text' },
      { id: 'lifehub', text: 'What would you need from LifeHub and the facilitators?', kind: 'text' },
      { id: 'family', text: 'What support can you give {name} at home?', kind: 'text' }
    ] },
    { title: 'Questions, worries and ideas', qs: [
      { id: 'worry', text: 'Do you have any worries or concerns?', kind: 'text', optional: true },
      { id: 'ask', text: 'What questions would you like us to answer at the meeting?', kind: 'text', optional: true },
      { id: 'more', text: 'Anything else you’d like us to know?', kind: 'text', optional: true }
    ] }
  ]
};
