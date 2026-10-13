/* Term 2 Conference — "My Week, My Say": how each part of a Riser's week
   feels to them. Questions from the End of Term 2 feedback survey.

   Question types: vote (keep / tweak / rethink), scale (one of four, best
   first), multi (tick up to `max`; no max = tick all that are true),
   single, text, and grid (a row of statements, each Yes / Maybe / Not
   yet). `other: true` adds an "Other" choice with its own box. */
(function () {
  var MOOD = ['Safe', 'Listened to', 'Respected', 'Encouraged', 'A bit nervous', 'Not sure yet'];
  var GO_TO = ['Something exciting happened and I want to share it', 'Something difficult happened',
    'I have a question during Core Skills or Quest time', 'I’m having a problem with a friend',
    'I made a mistake or didn’t finish my work', 'I’m feeling upset or low and don’t know why'];
  var TOGETHER = ['Play a card or board game', 'Take a walk', 'Eat lunch together', 'Play outside / badminton',
    'Chat about my day', 'Work on a project together', 'We haven’t done something together yet'];

  function staff(name) {
    return {
      id: 'staff-' + name.toLowerCase(), title: name, color: '#6b5b95', staff: true,
      qs: [
        { id: 'feel', type: 'multi', text: 'When I’m with ' + name + ', I feel…', note: 'Tick all that are true', options: MOOD, other: true },
        { id: 'goto', type: 'grid', text: 'I would go to ' + name + ' when…', rows: GO_TO, cols: ['Yes', 'Maybe', 'Not yet'] },
        { id: 'fav', type: 'multi', max: 2, text: 'My favourite thing to do with ' + name + ' is…', options: TOGETHER, other: true },
        { id: 'helps', type: 'text', text: name + ' helps me most when they:' },
        { id: 'comfy', type: 'text', text: 'I’d feel even more comfortable with ' + name + ' if they:' }
      ]
    };
  }

  var PARTS = [
    { id: 'discussions', title: 'Daring Discussions', color: '#2e7d82', qs: [
      { id: 'feel', type: 'scale', text: 'How do you feel when it’s time for Daring Discussions?', options: ['I look forward to it', 'I enjoy it most times', 'It’s okay', 'I’d rather skip it'] },
      { id: 'better', type: 'multi', max: 2, text: 'What would make discussions better?', options: ['Voting on topics', 'Time to prepare notes before', 'Smaller groups', 'Having a role (questioner, summarizer, challenger)', 'A way to share without speaking out loud'], other: true },
      { id: 'question', type: 'text', text: 'A big question I’d love to argue about in Term 3:' }
    ] },
    { id: 'sel', title: 'SEL Time', color: '#c8644a', qs: [
      { id: 'use', type: 'scale', text: 'Do you use what you learn in SEL outside of SEL time?', options: ['Often', 'Sometimes', 'Rarely', 'Not yet'] },
      { id: 'works', type: 'multi', max: 2, text: 'Which kinds of SEL activities work best for you?', options: ['Scenario cards & role-play', 'Games', 'Drawing or journaling', 'Talking in a circle', 'Stories or videos'], other: true },
      { id: 'wish', type: 'text', text: 'A feeling or situation I wish we talked about more:' }
    ] },
    { id: 'recess', title: 'Riser Recess', color: '#5a5ea8', qs: [
      { id: 'blocks', type: 'multi', max: 2, text: 'What gets in the way of a good Recess?', options: ['Not enough time', 'Same games every time', 'Arguments about rules', 'Not sure what to do', 'Feeling left out', 'Nothing, it’s great'], other: true },
      { id: 'plan', type: 'text', text: 'If I got to plan Recess for one day, I would:' }
    ] },
    { id: 'quests', title: 'Quests', color: '#c48a1e', qs: [
      { id: 'level', type: 'single', text: 'My Quest level this term felt:', options: ['Too easy', 'Just right', 'Too hard'] },
      { id: 'stuck', type: 'multi', max: 2, text: 'Where did you get stuck most?', options: ['Choosing a topic', 'Finding information', 'Knowing what to do next', 'Staying motivated', 'Finishing & presenting'], other: true },
      { id: 'next', type: 'text', text: 'A Quest I’d love to take on in Term 3:' }
    ] },
    { id: 'stem', title: 'STEM', color: '#4a8a4a', qs: [
      { id: 'better', type: 'multi', max: 2, text: 'What would make STEM better for you?', options: ['More hands-on building', 'More time per project', 'Choosing my own challenge', 'Working solo sometimes', 'More demos before we start'], other: true },
      { id: 'wish', type: 'text', text: 'Something I wish we had built or explored:' }
    ] },
    { id: 'carpentry', title: 'Carpentry', color: '#8e4a7e', qs: [
      { id: 'tools', type: 'scale', text: 'How confident do you feel with the tools?', options: ['I can use them safely on my own', 'I need a little help', 'I need a lot of help', 'I feel nervous using them'] },
      { id: 'help', type: 'multi', max: 2, text: 'What would help?', options: ['More tool practice', 'Smaller projects I can finish', 'Bigger, longer projects', 'Clearer safety demos', 'More time'], other: true },
      { id: 'make', type: 'text', text: 'Something I want to make in Term 3:' }
    ] },
    { id: 'workcycle', title: 'Core Skills Work Cycle', color: '#3a78b5', qs: [
      { id: 'focus', type: 'scale', text: 'How focused are you during the work cycle, most days?', options: ['Deeply focused', 'Focused once I settle in', 'Focus comes and goes', 'It’s hard to focus'] },
      { id: 'pulls', type: 'multi', max: 2, text: 'What pulls your focus away?', options: ['Noise', 'Not knowing what to do next', 'Waiting for help', 'Work feels too hard', 'Work feels too easy', 'Friends nearby'], other: true },
      { id: 'helps', type: 'text', text: 'What helps you focus best?' }
    ] },
    { id: 'assessments', title: 'Assessment Requests', color: '#b5503a', qs: [
      { id: 'feel', type: 'scale', text: 'How do you feel about requesting assessments?', options: ['I request when I’m ready, no reminders needed', 'I request, but need reminders', 'I put it off', 'I try to avoid it'] },
      { id: 'hard', type: 'multi', max: 2, text: 'What makes it hard?', options: ['Knowing when I’m ready', 'Writing the email', 'Worrying about the result', 'Forgetting', 'Nothing, it’s easy'], other: true },
      { id: 'ready', type: 'text', text: 'How do you know when you’re ready to be assessed?' }
    ] },
    { id: 'ixl', title: 'IXL Practice', color: '#6b7d2e', qs: [
      { id: 'feels', type: 'scale', text: 'IXL feels:', options: ['Helpful for learning', 'Good practice', 'Like busywork', 'Frustrating'] },
      { id: 'stuck', type: 'multi', max: 2, text: 'When you get stuck on IXL, what do you usually do? Be honest!', options: ['Read the explanation', 'Ask for help', 'Skip it', 'Keep guessing until it moves on'], other: true },
      { id: 'time', type: 'single', text: 'The amount of IXL time is:', options: ['Too much', 'Just right', 'Too little'] }
    ] },
    { id: 'typing', title: 'Touch Typing', color: '#7a55a8', qs: [
      { id: 'now', type: 'scale', text: 'How do you feel about your typing right now?', options: ['I can type without looking at the keys', 'I’m getting faster, but still peek sometimes', 'I type slowly and look at the keys a lot', 'I find typing really hard'] },
      { id: 'blocks', type: 'multi', max: 2, text: 'What gets in the way of practising?', options: ['It feels boring', 'It’s hard to go slow and accurate', 'Not enough practice time', 'I don’t see myself getting better', 'Nothing, I like it'], other: true },
      { id: 'better', type: 'multi', max: 2, text: 'What would make typing practice better?', options: ['Typing games', 'Races or challenges with friends', 'Tracking my speed on a chart', 'Typing real things (like my weekly email)', 'Shorter, more often sessions'], other: true },
      { id: 'goal', type: 'text', text: 'My typing goal for Term 3:' }
    ] },
    { id: 'global', title: 'Global Explorations', color: '#2e8a72', qs: [
      { id: 'enjoy', type: 'multi', max: 3, text: 'What did you enjoy most?', options: ['Learning about Vikings', 'Learning about chocolate', 'Learning about desert cities', 'Gameshow', 'Crossword', 'Creative activity', 'Highlighting answers'], other: true },
      { id: 'place', type: 'text', text: 'A place in the world I’d love to explore next:' },
      { id: 'change', type: 'text', text: 'One change that would make Global Explorations better:' }
    ] },
    { id: 'drama', title: 'Drama', color: '#c0613a', qs: [
      { id: 'fav', type: 'text', text: 'What is your favourite part of Drama class?' },
      { id: 'change', type: 'text', text: 'If you could make one change to Drama, what would it be?' }
    ] }
  ];

  window.MYSAY_VOTES = [
    { id: 'keep', label: 'Keep', hint: 'It works for me' },
    { id: 'tweak', label: 'Tweak', hint: 'One small change' },
    { id: 'rethink', label: 'Rethink', hint: 'Needs a big change' }
  ];
  window.MYSAY_PARTS = PARTS;
  window.MYSAY_STAFF = ['Jeran', 'Nishitha', 'Blessy'].map(staff);
  window.MYSAY_FINAL = {
    id: 'final', title: 'Looking back', color: '#3b4b59',
    qs: [
      { id: 'keep', type: 'multi', max: 2, text: 'The 2 parts of my week I’d keep exactly as they are:', options: PARTS.map(function (p) { return p.title; }) },
      { id: 'change', type: 'single', text: 'The 1 part that most needs a change:', options: PARTS.map(function (p) { return p.title; }) },
      { id: 'day', type: 'text', text: 'If I ran LifeHub for a day, one thing I’d do differently:' },
      { id: 'else', type: 'text', text: 'Anything else you’d like us to know?' }
    ]
  };
})();
