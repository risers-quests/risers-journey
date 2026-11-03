/* Thinking about 10th Grade: the questionnaire for older Risers.
   Each question: id, text, kind ('text' | 'one' | 'many'), options,
   hint, and why (a short box for "why?" after a choice). Optional ones
   have optional: true. Staff OK it before Risers see it
   (grade10.js, approval record). */
window.G10 = {
  title: 'Thinking about 10th Grade',
  intro: 'There are no right or wrong answers. This is to understand what you think about the 10th grade exams, what you would like to do, and how we can help. Take your time; it saves as you go.',
  sections: [
    { title: 'Where I am now', qs: [
      { id: 'feel', text: 'How do you feel about taking the 10th grade exams?', kind: 'one',
        options: ['Excited', 'Ready', 'Unsure', 'Worried', 'I haven’t thought about it yet'], why: 'Why do you feel this way?' },
      { id: 'know', text: 'What do you already know about the 10th grade exams?', kind: 'text', hint: 'For example: the boards, the subjects, how the exams work.' },
      { id: 'heard', text: 'Who have you talked to about it, and what did they say?', kind: 'text', hint: 'Family, friends, older students, facilitators…', optional: true }
    ] },
    { title: 'My plans', qs: [
      { id: 'board', text: 'Which board or route are you thinking of?', kind: 'one',
        options: ['NIOS', 'IGCSE (Cambridge)', 'CBSE (private candidate)', 'ICSE', 'Not sure yet', 'Something else'], why: 'Why this one?' },
      { id: 'when', text: 'When would you like to take the exams?', kind: 'one', options: ['2027', '2028', 'Later', 'Not sure yet'] },
      { id: 'subjects', text: 'Which subjects would you choose, and why?', kind: 'text' },
      { id: 'after', text: 'What would you like to do after 10th grade?', kind: 'text', hint: 'Further studies, a field you love, a job, something else…' }
    ] },
    { title: 'How I would do it', qs: [
      { id: 'prepare', text: 'How would you like to prepare? Choose all that fit.', kind: 'many',
        options: ['Studying on my own', 'Sessions with a facilitator', 'Online classes', 'A tutor', 'Studying with friends', 'Past papers and practice tests'] },
      { id: 'hours', text: 'How much time could you give it each week?', kind: 'one', options: ['Less than 5 hours', '5–10 hours', '10–15 hours', 'More than 15 hours', 'Not sure yet'] },
      { id: 'plan', text: 'How would you plan it? Describe how your week or month would look.', kind: 'text' },
      { id: 'lifehub', text: 'What would you need from LifeHub and the facilitators?', kind: 'text' },
      { id: 'family', text: 'What would you need from your family?', kind: 'text' }
    ] },
    { title: 'Worries and ideas', qs: [
      { id: 'worry', text: 'What worries you about it, if anything?', kind: 'text', optional: true },
      { id: 'idea', text: 'Do you have your own ideas about how we could do this at LifeHub?', kind: 'text', optional: true },
      { id: 'more', text: 'Anything else you’d like us to know?', kind: 'text', optional: true }
    ] }
  ]
};
