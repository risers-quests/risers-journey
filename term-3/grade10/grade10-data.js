/* 10th Grade: the questionnaire parents fill in before the meeting about
   their child's 10th grade exams. {name} is the child's name. Each
   question: id, text, kind ('text' | 'one' | 'many'), options, hint, and
   why (a box for "why?" after a choice); optional: true for ones they
   can skip. Staff OK it before families see it (grade10.js). */
window.G10 = {
  title: '10th Grade: Parents’ Questionnaire',
  intro: 'Please fill this in before our meeting about {name}’s 10th grade exams. There are no right or wrong answers: it helps us understand what you think, what you have in mind and how you would like to do it, so the meeting can start from there. It saves as you type.',
  sections: [
    { title: 'Where we are now', qs: [
      { id: 'feel', text: 'How do you feel about {name} taking the 10th grade exams?', kind: 'one',
        options: ['Excited', 'Ready', 'Unsure', 'Worried', 'We haven’t thought about it yet'], why: 'Why do you feel this way?' },
      { id: 'child', text: 'How does {name} feel about it, from what you have seen or heard?', kind: 'text' },
      { id: 'know', text: 'What do you already know about the 10th grade exams and the boards?', kind: 'text', hint: 'For example: the boards, the subjects, how the exams work, what other families have done.' }
    ] },
    { title: 'Our plans', qs: [
      { id: 'board', text: 'Which board or route are you considering?', kind: 'one',
        options: ['NIOS', 'IGCSE (Cambridge)', 'CBSE (private candidate)', 'ICSE', 'Not sure yet', 'Something else'], why: 'Why this one?' },
      { id: 'when', text: 'When would you like {name} to take the exams?', kind: 'one', options: ['2027', '2028', 'Later', 'Not sure yet'] },
      { id: 'subjects', text: 'Which subjects do you have in mind, and why?', kind: 'text' },
      { id: 'after', text: 'What do you hope {name} will go on to after 10th grade?', kind: 'text', hint: 'Further studies, a field they love, work, something else…' }
    ] },
    { title: 'How we would like to do it', qs: [
      { id: 'prepare', text: 'How would you like {name} to prepare? Choose all that fit.', kind: 'many',
        options: ['Studying on their own', 'Sessions with a facilitator at LifeHub', 'Online classes', 'A tutor', 'Studying with friends', 'Past papers and practice tests'] },
      { id: 'hours', text: 'How much time could {name} give it each week?', kind: 'one', options: ['Less than 5 hours', '5–10 hours', '10–15 hours', 'More than 15 hours', 'Not sure yet'] },
      { id: 'plan', text: 'How do you picture it working, at LifeHub and at home?', kind: 'text' },
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
