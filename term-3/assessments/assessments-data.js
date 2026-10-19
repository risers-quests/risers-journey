/* Term 3 Assessments — the papers and who has them.

   Each question: n, text, and one of
     parts:   [{ l: 'a', text }]  each part answered and marked on its own
     options: ['…', …]            multiple choice, lettered (a), (b), …
     (neither)                     one written answer
   work: true gives a bigger box for working. Fractions are written
   {num/den}, so 2{1/3} is two and a third. The answer keys are not here:
   they live on the private staff site (answer-keys/term-3/). */
window.T3_ASSESSMENTS = [
  {
    id: 'math-t1', subject: 'Mathematics', grade: 'Grade 7', title: 'Term 1 Assessment',
    covering: 'Integers • Fractions • Decimals • Rational Numbers • Word Problems',
    note: 'Answer every question neatly. Show your working where needed.',
    sections: [
      { title: 'Addition & Subtraction of Integers', qs: [
        { n: 1, text: 'Find the value of each of the following.', parts: [{ l: 'a', text: '(-23) + 16' }, { l: 'b', text: '(-8) − (-19)' }, { l: 'c', text: '31 − 45' }] },
        { n: 2, text: 'Evaluate each of the following.', parts: [{ l: 'a', text: '(-6) + 9 + (-4)' }, { l: 'b', text: '14 + (-20) + (-7)' }] },
        { n: 3, text: 'Fill in the blank to make the statement true:  (-15) + ______ = (-9)' },
        { n: 4, text: '(-34) − (-12) − 20 is equal to', options: ['-42', '42', '-2', '2'] },
        { n: 5, text: 'Evaluate: (-52) + 27 − (-18)' }
      ] },
      { title: 'Multiplication & Division of Integers', qs: [
        { n: 6, text: 'Find the product: (-2) × (-3) × (-1) × (-5)' },
        { n: 7, text: 'Using suitable rearrangement, find the product: 25 × (-17) × (-4)' },
        { n: 8, text: 'Fill in the blank:  (-144) ÷ ______ = 12' },
        { n: 9, text: '(-372) ÷ (-4) is equal to', options: ['-93', '93', '-88', '88'] },
        { n: 10, text: 'Find the value: 96 ÷ (-6) ÷ (-2)' }
      ] },
      { title: 'Addition & Subtraction of Fractions', qs: [
        { n: 11, text: 'Find the value of {2/9} + {4/9}.' },
        { n: 12, text: 'Find the value of {3/4} − {5/12}.' },
        { n: 13, text: 'Evaluate: 2{1/3} + 1{5/6}' },
        { n: 14, text: 'The sum of {3/8} and {1/4} is', options: ['{1/2}', '{5/8}', '{3/8}', '{1/8}'] },
        { n: 15, text: 'Evaluate: 4{1/5} − 2{3/10}' }
      ] },
      { title: 'Multiplication & Division of Fractions', qs: [
        { n: 16, text: 'Find the value: 8 × {3/5}' },
        { n: 17, text: 'Multiply and reduce to simplest form: {2/7} × {14/9}' },
        { n: 18, text: 'Find the value: {5/9} ÷ 6' },
        { n: 19, text: 'Which of the following is the reciprocal of 3{1/4}?', options: ['{4/13}', '{13/4}', '{3/4}', '{4/3}'] },
        { n: 20, text: 'Find the value: 2{1/4} ÷ {3/8}' }
      ] },
      { title: 'Multiplication of Decimals', qs: [
        { n: 21, text: 'Multiply: 4.6 × 8' },
        { n: 22, text: 'Multiply: 3.2 × 5.4' },
        { n: 23, text: 'Find the value: 6.85 × 100' },
        { n: 24, text: '2.5 × 1000 is equal to', options: ['25', '250', '2500', '25000'] },
        { n: 25, text: 'Multiply: 7.25 × 0.6' }
      ] },
      { title: 'Division of Decimals', qs: [
        { n: 26, text: 'Divide: 18.24 ÷ 4' },
        { n: 27, text: 'Divide: 27.36 ÷ 3.6' },
        { n: 28, text: 'Fill in the blank: 748 cm = ______ m' },
        { n: 29, text: '9.15 ÷ 0.03 is equal to', options: ['30.5', '305', '3.05', '3050'] },
        { n: 30, text: 'Divide: 84.6 ÷ 100' }
      ] },
      { title: 'Rational Numbers', objective: 'Rational Numbers (number line, equivalents, comparing)', qs: [
        { n: 31, text: 'Write the standard form of {-18/-24}' },
        { n: 32, text: 'Fill in the box with > or <:   {-3/4}   □   {-5/8}' },
        { n: 33, text: 'Write 4 rational numbers between {-1/1} and 0. (Hint: think of {-1/1} as -1)' },
        { n: 34, text: 'Which pair of rational numbers below is equivalent?', options: ['{3/8}, {9/16}', '{5/9}, {20/36}', '{2/7}, {5/14}', '{4/11}, {9/22}'] },
        { n: 35, text: 'Which of the following rational numbers is negative?', options: ['{-6/-11}', '{7/9}', '{-5/8}', '0'] }
      ] },
      { title: 'Operations with Rational Numbers', qs: [
        { n: 36, text: 'Find the sum: {-5/9} + {2/3} + {-1/6}' },
        { n: 37, text: 'Subtract {-3/10} from {7/15}.' },
        { n: 38, text: 'Multiply: {-4/7} × {21/-16}' },
        { n: 39, text: '{-8/9} ÷ {4/27} is equal to', options: ['-6', '6', '-2', '2'] },
        { n: 40, text: 'Simplify: {2/5} + {-3/10} × {5/9}' }
      ] },
      { title: 'Word Problems', objective: 'Word Problems (Integers, Fractions, Decimals & Rational Numbers)', qs: [
        { n: 41, work: true, text: 'The temperature at 6 a.m. was -3°C. By noon it rose by 11°C, and by 9 p.m. it had fallen by 6°C from its noon value. What was the temperature at 9 p.m.?' },
        { n: 42, work: true, text: 'Rekha had {7/8} m of ribbon. She used {3/8} m to wrap a gift. How much ribbon does she have left?' },
        { n: 43, work: true, text: 'Petrol costs ₹102.50 per litre. What is the cost of 8.4 litres of petrol?' },
        { n: 44, work: true, text: 'A recipe needs {2/3} cup of sugar for one batch. If Aisha wants to make 5 batches, how many cups of sugar does she need in total?' },
        { n: 45, work: true, text: 'A lift descends a total distance represented by the rational number {-45/6} m, moving an equal distance in each of 3 stages. What rational number represents the distance moved in each stage?' }
      ] }
    ]
  }
];

// Which Risers have which papers.
window.T3_ASSIGNED = { benjamin: ['math-t1'] };
