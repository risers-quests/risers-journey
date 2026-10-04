/* Form 2: Term Reflection — from the age-banded "My Term Reflection"
   questionnaires. Wording kept exactly as the source PDFs. Each age band
   defines its own workbook question block (they differ: the 11-13 band
   has finer scales and a couple of extra questions) and that block is
   repeated once per subject workbook. */

function workbookQuestions(prefix, label, q) {
  var out = [];
  function push(id, text, type, extra) {
    out.push(Object.assign({ id: prefix + '-' + id, text: text, type: type }, extra || {}));
  }
  push('check1', q.check1Text, 'choice', { options: q.check1Options });
  push('check2', q.check2Text, 'choice', { options: q.check2Options });
  push('fix1', q.fix1Text, 'choice', { options: q.fix1Options });
  push('fix2', q.fix2Text, 'choice', { options: q.fix2Options });
  if (q.fix3Text) push('fix3', q.fix3Text, 'choice', { options: q.fix3Options });
  push('where1', q.where1Text, 'choice', { options: q.where1Options });
  push('where2', q.where2Text, 'choice', { options: q.where2Options });
  push('stuck', q.stuckText, 'matrix', { rows: q.stuckRows, scale: q.stuckScale });
  return { heading: 'My ' + label + ' Workbook', questions: out };
}

var SCALE_AMN = ['Always', 'Mostly', 'Sometimes', 'Not yet'];
var SCALE_YMSN = ['Yes, always', 'Most of the time', 'Sometimes', 'Not yet'];
var STUCK_ROWS = ['Read it again', 'Watch a video', "Look at my teacher's examples", 'Ask a friend', 'Ask a teacher', 'Ask my parents'];
var STUCK_ROWS_1113 = ['Re-read the workbook page or example', 'Watch a video', 'Look at examples from teachers', 'Ask a friend', 'Ask a teacher', 'Ask my parents'];

var Q_810 = {
  check1Text: 'When do I check my answers?', check1Options: ['After each page', 'After a section', 'When reminded', "I don't"],
  check2Text: 'Do I count how many I got right?', check2Options: ['Yes, always', 'Sometimes', 'No'],
  fix1Text: 'When I get something wrong, I…', fix1Options: ['Work it out again', 'Look at the answer to understand it', 'Copy the answer', 'Skip it'],
  fix2Text: 'How often do I fix my mistakes?', fix2Options: ['The same day', 'Within a week', 'When reminded', 'Hardly ever'],
  where1Text: 'Where do I do my best work?', where1Options: ['At LifeHub', 'At home', 'Both the same'],
  where2Text: 'How often do I work on this at home?', where2Options: ['Most days', 'Sometimes', 'Rarely'],
  stuckText: "When I'm stuck, what do I try?", stuckRows: STUCK_ROWS, stuckScale: ['Often', 'Sometimes', 'Never']
};

var Q_1113 = {
  check1Text: 'When do I check my work with the answer key at the back of the book?',
  check1Options: ['After every question', 'After every page', 'After a whole section', 'Only when a teacher reminds me', "I don't use the answer key"],
  check2Text: 'Do I count how many I got right and wrong?',
  check2Options: ["Yes, and I write it down", "Yes, but I don't write it down", 'Sometimes', 'No'],
  fix1Text: 'When I get something wrong, what do I usually do?',
  fix1Options: ['Re-work it from the start until I get it right', 'Look at the answer and try to understand it', 'Copy the correct answer', 'Leave it and move on', 'Ask someone for help'],
  fix2Text: 'How often do I do my corrections?',
  fix2Options: ['Right away, the same day', 'Within a few days', 'Once a week', 'Only when reminded', "I usually don't"],
  fix3Text: 'How long do my corrections usually take for one section?',
  fix3Options: ['Less than 5 minutes', '5–15 minutes', '15–30 minutes', 'More than 30 minutes', "I don't do corrections"],
  where1Text: 'Where do I do my best work in this workbook?', where1Options: ['At LifeHub', 'At home', 'Both are the same'],
  where2Text: 'How often do I work on this workbook at home?', where2Options: ['Most days', '2–3 times a week', 'Once a week', 'Rarely', 'Never'],
  stuckText: "When I'm stuck, what do I try?", stuckRows: STUCK_ROWS_1113, stuckScale: ['Always', 'Often', 'Sometimes', 'Never']
};

window.EOT2_REFLECTION = {
  '8-10': {
    sections: [
      workbookQuestions('math', 'Math', Q_810),
      workbookQuestions('la', 'Language Arts', Q_810),
      workbookQuestions('writing', 'Writing', Q_810),
      {
        heading: 'Assessments', questions: [
          { id: 'assess-count', text: 'How many assessments did I ask for this term?', type: 'choice', options: ['None', '1–2', '3 or more'] },
          { id: 'assess-when', text: 'When do I ask for an assessment?', type: 'choice', options: ['After each chapter', 'When reminded', 'At the end of term'] },
          { id: 'assess-after', text: 'After an assessment, I…', type: 'choice', options: ['Learn what I missed again', 'Look at what I missed', 'Move on'] }
        ]
      },
      {
        heading: 'My Progress Board', questions: [
          { id: 'board-use', text: 'Do I use my board to plan what to do next?', type: 'choice', options: ['Yes', 'Sometimes', 'No'] },
          { id: 'board-move', text: 'How often do I move things on my board?', type: 'choice', options: ['Every day', 'Every week', 'Rarely'] },
          { id: 'board-finish', text: 'Do I finish my goals by the end of the week?', type: 'choice', options: ['Most weeks', 'Some weeks', 'Rarely'] }
        ]
      },
      {
        heading: 'Connection', questions: [
          { id: 'conn-included', text: 'I feel included in the group.', type: 'choice', options: SCALE_AMN },
          { id: 'conn-workwell', text: 'I work well with others.', type: 'choice', options: SCALE_AMN },
          { id: 'conn-disagree', text: 'When we disagree, we can sort it out.', type: 'choice', options: SCALE_AMN },
          { id: 'conn-staffhelp', text: 'I feel comfortable asking staff for help.', type: 'choice', options: SCALE_AMN },
          { id: 'conn-stafflisten', text: 'Staff listen to me.', type: 'choice', options: SCALE_AMN }
        ]
      },
      {
        heading: 'What Helps Me and What Gets in My Way', questions: [
          { id: 'helps-tool', text: 'Something that helps me learn is…', type: 'text' },
          { id: 'helps-why', text: 'because…', type: 'text' },
          { id: 'helps-focus', text: 'I focus best when…', type: 'text' },
          { id: 'hinders-distract', text: 'Something that distracts me is…', type: 'text' },
          { id: 'hinders-hard', text: 'Something that makes learning hard is…', type: 'text' }
        ]
      }
    ]
  },
  '11-13': {
    sections: [
      workbookQuestions('math', 'Math', Q_1113),
      workbookQuestions('la', 'Language Arts', Q_1113),
      workbookQuestions('writing', 'Writing', Q_1113),
      {
        heading: 'Assessments', questions: [
          { id: 'assess-count', text: 'How many assessments did I request this term?', type: 'choice', options: ['None', '1–2', '3–4', '5 or more'] },
          { id: 'assess-when', text: 'When do I usually request an assessment?', type: 'choice', options: ['After each chapter', 'After a few chapters', 'When a teacher reminds me', 'Near the end of term'] },
          { id: 'assess-quiz', text: 'Do I use smaller quizzes to check myself after short sections?', type: 'choice', options: ['Yes, regularly', 'Sometimes', "No, but I'd like to try", 'No'] },
          { id: 'assess-after', text: 'After an assessment, what do I do with what I missed?', type: 'choice', options: ['I go back and re-learn it', "I look at it, but don't re-learn it", 'I move on to the next chapter', "I'm not sure what I missed"] }
        ]
      },
      {
        heading: 'My Progress Board', questions: [
          { id: 'board-use', text: 'Do I use my board to plan what to do next?', type: 'choice', options: ['Yes, every time', 'Sometimes', 'No, I just update it'] },
          { id: 'board-move', text: 'How often do I move things on my board?', type: 'choice', options: ['Every day', 'A few times a week', 'Once a week', 'Rarely'] },
          { id: 'board-finish', text: "Do I finish my board's goals before the end of the week?", type: 'choice', options: ['Most weeks', 'Some weeks', 'Rarely'] }
        ]
      },
      {
        heading: 'Connection', questions: [
          { id: 'conn-included', text: 'I feel included in the group.', type: 'choice', options: SCALE_YMSN },
          { id: 'conn-workwell', text: 'I work well with others on shared tasks.', type: 'choice', options: SCALE_YMSN },
          { id: 'conn-disagree', text: "When there's a disagreement, we can usually sort it out.", type: 'choice', options: SCALE_YMSN },
          { id: 'conn-staffhelp', text: 'I feel comfortable asking staff for help.', type: 'choice', options: SCALE_YMSN },
          { id: 'conn-stafflisten', text: 'I feel listened to by staff.', type: 'choice', options: SCALE_YMSN },
          { id: 'conn-staffknow', text: "Staff know how I'm really doing.", type: 'choice', options: ['Yes', 'Mostly', 'Not really'] }
        ]
      },
      {
        heading: 'What Helps Me and What Gets in My Way', questions: [
          { id: 'helps-tool', text: 'A tool or resource that helps me:', type: 'text' },
          { id: 'helps-how', text: 'How?', type: 'text' },
          { id: 'helps-routine', text: 'A routine or place that helps me focus:', type: 'text' },
          { id: 'helps-why', text: 'Why?', type: 'text' },
          { id: 'hinders-habit', text: 'A habit or choice that makes things harder:', type: 'text' },
          { id: 'hinders-distract', text: 'Something that distracts me:', type: 'text' },
          { id: 'hinders-when', text: 'When?', type: 'text' },
          { id: 'hinders-situation', text: 'A situation that makes it hard for me:', type: 'text' },
          { id: 'hinders-happens', text: 'What happens?', type: 'text' }
        ]
      }
    ]
  }
};

window.EOT2_REFLECTION_ITEM_COUNT = function (band) {
  return window.EOT2_REFLECTION[band].sections.reduce(function (n, s) { return n + s.questions.length; }, 0);
};
