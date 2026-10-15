/* Term 2 Conference — Parents' Feedback: how the conference went for each
   family. Same question types as Risers' Feedback (shared/eot2-questions.js). */
window.PF_SECTIONS = [
  { id: 'before', title: 'Before the conference', color: '#2e7d82', qs: [
    { id: 'dash', type: 'single', text: 'How useful was the dashboard in getting ready?', options: ['Very useful', 'Useful', 'A little useful', 'Not useful', 'We didn’t get to look at it'] },
    { id: 'looked', type: 'multi', text: 'Which parts did you look at?', note: 'Tick all that are true', options: ['Term 1 Conference notes', 'Self-Assessment', 'Term Reflection', 'Term 2 Quests'] },
    { id: 'expect', type: 'single', text: 'Did you know what to expect before you came?', options: ['Yes', 'Mostly', 'Not really'] }
  ] },
  { id: 'part1', title: 'Part 1: Reflection', color: '#c8644a', qs: [
    { id: 'open', type: 'scale', text: 'How comfortable did you feel sharing openly?', options: ['Very comfortable', 'Comfortable', 'A little unsure', 'Not comfortable'] },
    { id: 'heard', type: 'scale', text: 'Did you feel your child’s voice was heard?', options: ['Fully', 'Mostly', 'A little', 'Not really'] },
    { id: 'time', type: 'single', text: 'Twenty minutes felt:', options: ['Too short', 'Just right', 'Too long'] }
  ] },
  { id: 'part2', title: 'Part 2: Planning Together', color: '#5a5ea8', qs: [
    { id: 'clear', type: 'scale', text: 'How clear is the plan for Term 3?', options: ['Very clear', 'Clear', 'A little unclear', 'Not clear'] },
    { id: 'home', type: 'single', text: 'Do you know what you’ll do at home to support it?', options: ['Yes', 'Somewhat', 'Not yet'] },
    { id: 'time', type: 'single', text: 'Twenty minutes felt:', options: ['Too short', 'Just right', 'Too long'] }
  ] },
  { id: 'stem', title: 'STEM meeting', color: '#4a8a4a', qs: [
    { id: 'help', type: 'single', text: 'If you had a STEM meeting, how helpful was it?', options: ['Very helpful', 'Helpful', 'A little helpful', 'Not helpful', 'We didn’t have one'] }
  ] },
  { id: 'overall', title: 'Overall', color: '#3b4b59', qs: [
    { id: 'worth', type: 'scale', text: 'Overall, how worthwhile was the conference?', options: ['Very worthwhile', 'Worthwhile', 'Somewhat', 'Not worthwhile'] },
    { id: 'timing', type: 'single', text: 'Did the timing and schedule work for you?', options: ['Yes', 'Mostly', 'No'] },
    { id: 'again', type: 'single', text: 'Would you like the same format next term?', options: ['Yes, keep it', 'Yes, with small changes', 'No, change it'] },
    { id: 'home', type: 'text', text: 'What does your child say about LifeHub at home?' },
    { id: 'else', type: 'text', text: 'Anything else you’d like us to know?' }
  ] }
];
