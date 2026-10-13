import { QuestionData } from '../types/game';
import {
  randomInt,
  randomChoice,
  shuffleArray,
  gcd,
  lcm,
  isPrime,
  getFactors,
  Fraction,
  roundToDecimals
} from './mathUtils';
import { generateBodmasChallenge } from './bodmasEngine';

export function generateQuestionForGame(gameId: string, difficulty: 1 | 2 | 3 = 1): QuestionData {
  const parts = gameId.split('_');
  const levelNum = parseInt(parts[0].replace('l', ''), 10);
  const gameIndex = parseInt(parts[1].replace('g', ''), 10);

  // Dispatch to specific generator
  switch (levelNum) {
    case 1:
      return generateLevel1Question(gameIndex, difficulty);
    case 2:
      return generateLevel2Question(gameIndex, difficulty);
    case 3:
      return generateLevel3Question(gameIndex, difficulty);
    case 4:
      return generateLevel4Question(gameIndex, difficulty);
    case 5:
      return generateLevel5Question(gameIndex, difficulty);
    case 6:
      return generateLevel6Question(gameIndex, difficulty);
    case 7:
      return generateLevel7Question(gameIndex, difficulty);
    case 8:
      return generateLevel8Question(gameIndex, difficulty);
    default:
      return generateFallbackQuestion(levelNum, difficulty);
  }
}

// -------------------------------------------------------------
// LEVEL 1 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel1Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l1_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 1) {
    // Savanna Safari Count
    const count = difficulty === 1 ? randomInt(2, 5) : difficulty === 2 ? randomInt(6, 10) : randomInt(11, 15);
    const animals = ['lions 🦁', 'zebras 🦓', 'elephants 🐘', 'giraffes 🦒', 'monkeys 🐒'];
    const chosen = randomChoice(animals);
    const opts = shuffleArray([count, count + 1, Math.max(1, count - 1), count + 2]);

    return {
      id,
      prompt: `How many ${chosen} are gathered at the watering hole?`,
      visualData: { type: 'item_collection', count, item: chosen.split(' ')[1] || '🦁' },
      correctAnswer: count,
      options: opts,
      difficulty,
      hints: [
        'Count each animal one by one with your finger.',
        'Group them into pairs or a row of 5 if possible.',
        `The count starts with 1 and finishes on ${count}.`
      ],
      workedSolution: {
        steps: [`Point to each animal in order: 1, 2, ... ${count}.`, `The final number spoken (${count}) gives the total.`],
        verificationTip: 'Recount in reverse or cross off each animal to verify none were missed.'
      },
      explanation: `There are exactly ${count} ${chosen}.`,
      reflectionPrompt: 'Did you count one by one, or did you recognize groups of 2 or 5?'
    };
  }

  if (gameIndex === 4) {
    // Rainbow Bond Bridges (Creative Bonds to 20, 50, and 100)
    const target = difficulty === 1 ? 20 : difficulty === 2 ? 50 : 100;
    const a = difficulty === 1 ? randomInt(11, 19) : difficulty === 2 ? randomChoice([15, 25, 35, 45, 20, 30]) : randomInt(24, 88);
    const correct = target - a;
    const opts = shuffleArray([correct, correct + 10, Math.max(2, correct - 10), correct + 5]);

    return {
      id,
      prompt: `Build a bridge of ${target}! What number pairs with ${a} to make ${target}?`,
      visualData: { type: 'rainbow_bond', given: a, target },
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        `Think: how many more do you need to reach ${target}?`,
        `Count up from ${a} to the next friendly benchmark.`,
        `${target} - ${a} = ${correct}.`
      ],
      workedSolution: {
        steps: [`We want ${a} + ? = ${target}.`, `Subtract: ${target} - ${a} = ${correct}.`],
        alternativeMethod: `Count up from ${a} to ${target}: ${a} + ${correct} reaches ${target}.`,
        verificationTip: `Add them together: ${a} + ${correct} = ${target}.`
      },
      explanation: `${a} and ${correct} are number bond partners that make ${target}!`,
      reflectionPrompt: `What other pairs add up to ${target}?`
    };
  }

  if (gameIndex === 7) {
    // Heavy & Light Balance (Comparing 2-digit quantities)
    const left = randomInt(22, 85);
    const diff = randomChoice([-12, -8, -5, 0, 5, 8, 12]);
    const right = Math.max(10, left + diff);
    const correct = left > right ? '>' : left < right ? '<' : '=';

    return {
      id,
      prompt: `Compare the two pans on the balance scale: ${left} [ ? ] ${right}`,
      visualData: { type: 'balance_scale', left, right },
      correctAnswer: correct,
      options: ['>', '<', '='],
      difficulty,
      hints: [
        'Which side has a higher total value?',
        'The open mouth of > points toward the bigger number.',
        `${left} is ${left > right ? 'greater than' : left < right ? 'less than' : 'equal to'} ${right}.`
      ],
      workedSolution: {
        steps: [`Examine ${left} and ${right}.`, `${left} ${correct} ${right}.`],
        verificationTip: 'Check the tens and ones digits on each pan to verify which is greater.'
      },
      explanation: `${left} is ${left > right ? 'greater than' : left < right ? 'less than' : 'equal to'} ${right}.`
    };
  }

  if (gameIndex === 17) {
    // Rabbit Hop Number Line (2-digit navigation)
    const start = randomInt(18, 65);
    const hop = randomInt(10, 25);
    const isForward = difficulty !== 3 ? true : Math.random() > 0.4;
    const target = isForward ? start + hop : Math.max(5, start - hop);
    const opts = shuffleArray([target, target + 10, Math.max(2, target - 10), target + 5]);

    return {
      id,
      prompt: `The rabbit is at ${start} and hops ${isForward ? 'FORWARD' : 'BACKWARD'} by ${hop}. Where does it land?`,
      visualData: { type: 'number_line', start, hop, direction: isForward ? 'forward' : 'backward', range: [0, 100] },
      correctAnswer: target,
      options: opts,
      difficulty,
      hints: [
        isForward ? 'Hopping forward means adding numbers!' : 'Hopping backward means subtracting!',
        `Start at ${start} and ${isForward ? 'add' : 'subtract'} ${hop}.`,
        `${start} ${isForward ? '+' : '-'} ${hop} = ${target}.`
      ],
      workedSolution: {
        steps: [
          `Starting position = ${start}.`,
          `Hop ${hop} units ${isForward ? 'forward' : 'backward'}.`,
          `${start} ${isForward ? '+' : '-'} ${hop} = ${target}.`
        ],
        verificationTip: 'Verify by hopping in reverse from target back to start.'
      },
      explanation: `Hopping ${hop} units ${isForward ? 'forward' : 'backward'} from ${start} lands on ${target}.`
    };
  }

  // 3-Number operations for Level 1 arithmetic & fluency
  const bodmas = generateBodmasChallenge(1, difficulty);
  return {
    id,
    prompt: `Solve the multi-number challenge: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 2 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel2Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l2_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 1) {
    // Hundreds-Tens-Ones Blocks
    const tens = randomInt(1, 8);
    const ones = randomInt(1, 9);
    const total = tens * 10 + ones;
    const opts = shuffleArray([total, total + 10, total - 1, total + 2]);

    return {
      id,
      prompt: `Identify the number shown by ${tens} tens rods and ${ones} ones units:`,
      visualData: { type: 'base_10_blocks', tens, ones },
      correctAnswer: total,
      options: opts,
      difficulty,
      hints: [
        'Each ten rod equals 10. Count by tens first!',
        `${tens} tens = ${tens * 10}. Now add ${ones} ones.`,
        `${tens * 10} + ${ones} = ${total}.`
      ],
      workedSolution: {
        steps: [`${tens} tens = ${tens * 10}.`, `${ones} ones = ${ones}.`, `${tens * 10} + ${ones} = ${total}.`],
        verificationTip: 'Decompose the number back into tens and ones.'
      },
      explanation: `${tens} tens rods and ${ones} ones units equal ${total}.`
    };
  }

  if (gameIndex === 3) {
    // Treasure Chest Adder (2-digit addition)
    const a = difficulty === 1 ? randomInt(12, 35) : randomInt(25, 58);
    const b = difficulty === 1 ? randomInt(11, 24) : randomInt(18, 39);
    const correct = a + b;
    const opts = shuffleArray([correct, correct + 10, correct - 2, correct + 1]);

    return {
      id,
      prompt: `Unlock the chest: calculate ${a} + ${b}`,
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        'Add the ones column first, then the tens column.',
        `Ones: ${(a % 10)} + ${(b % 10)} = ${(a % 10) + (b % 10)}. Tens: ${Math.floor(a / 10)} + ${Math.floor(b / 10)}.`,
        `Combine them: ${correct}.`
      ],
      workedSolution: {
        steps: [
          `Add ones: ${(a % 10)} + ${(b % 10)} = ${(a % 10) + (b % 10)}.`,
          `Add tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${(Math.floor(a / 10) + Math.floor(b / 10)) * 10}.`,
          `Total = ${correct}.`
        ],
        verificationTip: `Subtract to check: ${correct} - ${b} = ${a}.`
      },
      explanation: `${a} + ${b} = ${correct}.`
    };
  }

  if (gameIndex === 11) {
    // Pizza Slice Baker (Fractions of a whole)
    const den = randomChoice([2, 3, 4, 6]);
    const num = randomInt(1, den - 1);
    const correct = `${num}/${den}`;
    const opts = shuffleArray([correct, `${num + 1}/${den}`, `${num}/${den + 1}`, `${num}/${den + 2}`]);

    return {
      id,
      prompt: `A pizza is cut into ${den} equal slices. ${num} slices have mushrooms. What fraction has mushrooms?`,
      visualData: { type: 'fraction_circle', numerator: num, denominator: den },
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        'The bottom number (denominator) is the TOTAL number of slices.',
        'The top number (numerator) is the number of mushroom slices.',
        `The fraction is ${num} out of ${den}, written as ${num}/${den}.`
      ],
      workedSolution: {
        steps: [
          `Total equal slices = ${den} (denominator).`,
          `Shaded slices = ${num} (numerator).`,
          `Fraction = ${num}/${den}.`
        ],
        verificationTip: `Count remaining slices: ${den - num}/${den} without mushrooms. Together they make 1 whole.`
      },
      explanation: `${num} out of ${den} slices is written as ${num}/${den}.`
    };
  }

  if (gameIndex === 12) {
    // Rupee Coin Cashier
    const price = randomInt(15, 65);
    const paid = price <= 30 ? 50 : 100;
    const change = paid - price;
    const opts = shuffleArray([change, change + 5, change - 5, change + 10]);

    return {
      id,
      prompt: `An item costs ₹${price}. You pay with a ₹${paid} note. How much change should you get back?`,
      visualData: { type: 'money', price, paid },
      correctAnswer: change,
      options: opts,
      difficulty,
      hints: [
        `Change = Money Paid (₹${paid}) minus Cost (₹${price}).`,
        `Count up from ₹${price} to ₹${paid}.`,
        `₹${paid} - ₹${price} = ₹${change}.`
      ],
      workedSolution: {
        steps: [`Paid = ₹${paid}.`, `Cost = ₹${price}.`, `Change = ₹${paid} - ₹${price} = ₹${change}.`],
        verificationTip: `Check: ₹${price} + ₹${change} = ₹${paid}.`
      },
      explanation: `You receive ₹${change} in change.`
    };
  }

  // Level 2 default: 3-number and 4-number operations & grouping
  const bodmas = generateBodmasChallenge(2, difficulty);
  return {
    id,
    prompt: `Solve the multi-number calculation: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 3 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel3Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l3_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 2) {
    // Times Table Speedway
    const a = randomInt(3, 9);
    const b = randomInt(3, 9);
    const correct = a * b;
    const opts = shuffleArray([correct, correct + a, correct - b, (a + 1) * b]);

    return {
      id,
      prompt: `Speedway Sprint: What is ${a} × ${b}?`,
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        `Break it down: (${a} × 5) + (${a} × ${b - 5}) if b > 5.`,
        `Recall your times tables for ${a}.`,
        `${a} × ${b} = ${correct}.`
      ],
      workedSolution: {
        steps: [`${a} times ${b} equals ${correct}.`],
        verificationTip: `Division check: ${correct} ÷ ${a} = ${b}.`
      },
      explanation: `${a} × ${b} = ${correct}.`
    };
  }

  if (gameIndex === 3) {
    // Group & Remainder Dock
    const divisor = randomInt(3, 7);
    const quotient = randomInt(3, 8);
    const remainder = randomInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    const correct = `Q: ${quotient}, R: ${remainder}`;
    const opts = shuffleArray([
      correct,
      `Q: ${quotient + 1}, R: ${remainder}`,
      `Q: ${quotient}, R: ${remainder + 1}`,
      `Q: ${quotient - 1}, R: ${remainder}`
    ]);

    return {
      id,
      prompt: `Divide ${dividend} crates into boats of ${divisor} crates each. What is the quotient and remainder?`,
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        `What is the largest multiple of ${divisor} less than ${dividend}?`,
        `${divisor} × ${quotient} = ${divisor * quotient}. Now subtract from ${dividend}.`,
        `Quotient is ${quotient}, and remainder is ${remainder}.`
      ],
      workedSolution: {
        steps: [
          `${divisor} × ${quotient} = ${divisor * quotient}.`,
          `${dividend} - ${divisor * quotient} = ${remainder}.`,
          `Quotient = ${quotient}, Remainder = ${remainder}.`
        ],
        verificationTip: `Check: (${divisor} × ${quotient}) + ${remainder} = ${dividend}.`
      },
      explanation: `${dividend} ÷ ${divisor} = ${quotient} with remainder ${remainder}.`
    };
  }

  if (gameIndex === 11) {
    // Polygon Perimeter Patrol
    const l = randomInt(4, 12);
    const w = randomInt(2, 8);
    const p = 2 * (l + w);
    const opts = shuffleArray([p, l * w, p + 4, p - 2]);

    return {
      id,
      prompt: `Patrol the boundary: A rectangular garden has length ${l} m and width ${w} m. What is its perimeter?`,
      visualData: { type: 'rectangle', length: l, width: w },
      correctAnswer: p,
      options: opts,
      difficulty,
      hints: [
        'Perimeter is the distance ALL the way around the outside boundary.',
        'Formula: Perimeter = 2 × (length + width).',
        `2 × (${l} + ${w}) = 2 × ${l + w} = ${p} m.`
      ],
      workedSolution: {
        steps: [`Perimeter = side + side + side + side.`, `2 × (${l} + ${w}) = 2 × ${l + w} = ${p} m.`],
        alternativeMethod: `Add individual sides: ${l} + ${w} + ${l} + ${w} = ${p} m.`,
        verificationTip: 'Perimeter is linear meters (m), not square meters (m²).'
      },
      explanation: `The perimeter of the ${l} m by ${w} m rectangle is ${p} m.`
    };
  }

  // Level 3 default: 3-number and 4-number BODMAS operations
  const bodmas = generateBodmasChallenge(3, difficulty);
  return {
    id,
    prompt: `BODMAS Challenge: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 4 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel4Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l4_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 2) {
    // Factor Tree Forester
    const num = randomChoice([12, 18, 20, 24, 30, 36, 40, 48]);
    const factors = getFactors(num);
    const correct = factors.length;
    const opts = shuffleArray([correct, correct + 1, Math.max(2, correct - 2), correct + 3]);

    return {
      id,
      prompt: `How many total distinct factors does the number ${num} have? (Include 1 and ${num})`,
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        `List factor pairs of ${num}: e.g. 1 × ${num}...`,
        `All factors of ${num}: ${factors.join(', ')}.`,
        `Count how many numbers are in that list: ${correct}.`
      ],
      workedSolution: {
        steps: [`Find all numbers that divide ${num} evenly.`, `Factors of ${num} are: ${factors.join(', ')}.`, `Total = ${correct}.`],
        verificationTip: 'Every factor pair multiplies back to give the original number.'
      },
      explanation: `${num} has ${correct} factors: ${factors.join(', ')}.`
    };
  }

  if (gameIndex === 7) {
    // Protractor Angle Shooter
    const angle = randomChoice([35, 45, 60, 90, 110, 135, 150]);
    const category = angle < 90 ? 'Acute' : angle === 90 ? 'Right' : 'Obtuse';
    const opts = ['Acute', 'Right', 'Obtuse', 'Straight'];

    return {
      id,
      prompt: `Classify an angle measuring ${angle}°:`,
      visualData: { type: 'angle', degrees: angle },
      correctAnswer: category,
      options: opts,
      difficulty,
      hints: [
        'Acute is less than 90°. Right is exactly 90°. Obtuse is between 90° and 180°.',
        `Compare ${angle}° to the benchmark 90°.`,
        `${angle}° is ${angle < 90 ? 'less than' : angle === 90 ? 'equal to' : 'greater than'} 90°.`
      ],
      workedSolution: {
        steps: [`Angle measure = ${angle}°.`, `${angle}° is ${category.toLowerCase()}.`],
        verificationTip: 'A right angle looks like a square corner.'
      },
      explanation: `An angle of ${angle}° is classified as ${category}.`
    };
  }

  // Level 4 default: 4-number multi-step operations and BODMAS with brackets
  const bodmas = generateBodmasChallenge(4, difficulty);
  return {
    id,
    prompt: `Calculate using BODMAS: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 5 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel5Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l5_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 2 || gameIndex === 3) {
    // Sieve of Eratosthenes / Prime Fortress
    const testNum = randomInt(11, 49);
    const correct = isPrime(testNum) ? 'Prime' : 'Composite';
    const opts = ['Prime', 'Composite'];

    return {
      id,
      prompt: `Is the number ${testNum} Prime or Composite?`,
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        'A prime number has only two factors: 1 and itself.',
        `Check if ${testNum} is divisible by 2, 3, 5, or 7.`,
        `${testNum} ${isPrime(testNum) ? 'has no other factors' : `is divisible by ${getFactors(testNum)[1]}`}.`
      ],
      workedSolution: {
        steps: [
          `Test divisibility of ${testNum}.`,
          isPrime(testNum)
            ? `${testNum} is divisible only by 1 and ${testNum}. It is Prime.`
            : `Factors of ${testNum} include ${getFactors(testNum).join(', ')}. It is Composite.`
        ],
        verificationTip: 'Primes greater than 2 are never even numbers.'
      },
      explanation: `${testNum} is a ${correct} number.`
    };
  }

  if (gameIndex === 4) {
    // Unlike Denominators Bridge
    const d1 = randomChoice([2, 3, 4, 5]);
    const d2 = randomChoice([3, 4, 5, 6]);
    const f1 = new Fraction(1, d1);
    const f2 = new Fraction(1, d2);
    const sum = f1.add(f2);
    const correct = sum.toString();
    const opts = shuffleArray([
      correct,
      `2/${d1 + d2}`,
      new Fraction(2, lcm(d1, d2)).toString(),
      new Fraction(sum.numerator + 1, sum.denominator).toString()
    ]);

    return {
      id,
      prompt: `Add the fractions with unlike denominators: 1/${d1} + 1/${d2}`,
      correctAnswer: correct,
      options: opts,
      difficulty,
      hints: [
        `Find the common denominator (LCM of ${d1} and ${d2}).`,
        `LCM(${d1}, ${d2}) = ${lcm(d1, d2)}. Convert both fractions: ${lcm(d1, d2) / d1}/${lcm(d1, d2)} + ${lcm(d1, d2) / d2}/${lcm(d1, d2)}.`,
        `Add the numerators: ${correct}.`
      ],
      workedSolution: {
        steps: [
          `Common denominator = LCM(${d1}, ${d2}) = ${lcm(d1, d2)}.`,
          `1/${d1} = ${lcm(d1, d2) / d1}/${lcm(d1, d2)}.`,
          `1/${d2} = ${lcm(d1, d2) / d2}/${lcm(d1, d2)}.`,
          `Sum = ${correct}.`
        ],
        verificationTip: 'Never add denominators directly! 1/2 + 1/2 is 1, not 2/4.'
      },
      explanation: `1/${d1} + 1/${d2} = ${correct}.`
    };
  }

  // Level 5 default: Advanced BODMAS with powers, nested brackets, and multi-step calculations
  const bodmas = generateBodmasChallenge(5, difficulty);
  return {
    id,
    prompt: `Evaluate using BODMAS: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 6 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel6Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l6_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 2) {
    // Positive & Negative Clash (Integer addition/subtraction)
    const a = randomInt(-12, 12);
    const b = randomInt(-12, 12);
    const isSub = Math.random() > 0.5;
    const ans = isSub ? a - b : a + b;
    const opts = shuffleArray([ans, ans + 2, -ans, ans - 3]);

    return {
      id,
      prompt: `Evaluate: ${a} ${isSub ? '-' : '+'} (${b})`,
      correctAnswer: ans,
      options: opts,
      difficulty,
      hints: [
        isSub ? 'Remember: subtracting a negative is equivalent to adding a positive!' : 'Think of money: debt vs cash balance.',
        `Combine: ${a} ${isSub ? (b < 0 ? `+ ${Math.abs(b)}` : `- ${b}`) : (b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`)}.`,
        `Result = ${ans}.`
      ],
      workedSolution: {
        steps: [`${a} ${isSub ? '-' : '+'} (${b}) = ${ans}.`],
        verificationTip: 'Use a vertical number line: above zero is +, below zero is -.'
      },
      explanation: `${a} ${isSub ? '-' : '+'} (${b}) = ${ans}.`
    };
  }

  if (gameIndex === 9) {
    // Equation Balance Scales (One-step equations)
    const coeff = randomInt(2, 6);
    const xVal = randomInt(3, 9);
    const rhs = coeff * xVal;
    const opts = shuffleArray([xVal, xVal + 1, xVal - 1, xVal + 3]);

    return {
      id,
      prompt: `Solve for x: ${coeff}x = ${rhs}`,
      correctAnswer: xVal,
      options: opts,
      difficulty,
      hints: [
        'To isolate x, perform the inverse operation of multiplication.',
        `Divide both sides by ${coeff}.`,
        `x = ${rhs} ÷ ${coeff} = ${xVal}.`
      ],
      workedSolution: {
        steps: [`${coeff}x = ${rhs}`, `Divide both sides by ${coeff}: x = ${rhs} / ${coeff}`, `x = ${xVal}`],
        verificationTip: `Substitute back: ${coeff} × ${xVal} = ${rhs}. Correct!`
      },
      explanation: `x = ${xVal}.`
    };
  }

  // Level 6 default: Integer arithmetic, powers, and BODMAS operations
  const bodmas = generateBodmasChallenge(6, difficulty);
  return {
    id,
    prompt: `Evaluate using BODMAS: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 7 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel7Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l7_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 6) {
    // Bank Vault Interest Ledger (Simple Interest I = PRT/100)
    const p = randomChoice([1000, 2000, 5000, 10000]);
    const r = randomChoice([5, 6, 8, 10]);
    const t = randomChoice([2, 3, 4]);
    const interest = (p * r * t) / 100;
    const opts = shuffleArray([interest, interest + 100, interest - 50, interest + 200]);

    return {
      id,
      prompt: `Calculate Simple Interest: Principal = ₹${p}, Rate = ${r}% per annum, Time = ${t} years.`,
      correctAnswer: interest,
      options: opts,
      difficulty,
      hints: [
        'Use the Simple Interest formula: I = (P × R × T) / 100.',
        `Substitute: (${p} × ${r} × ${t}) / 100.`,
        `Interest = ₹${interest}.`
      ],
      workedSolution: {
        steps: [
          `I = (P × R × T) / 100.`,
          `I = (${p} × ${r} × ${t}) / 100 = ${p * r * t} / 100 = ₹${interest}.`
        ],
        verificationTip: `Total amount returned would be P + I = ₹${p + interest}.`
      },
      explanation: `Simple Interest = ₹${interest}.`
    };
  }

  if (gameIndex === 8) {
    // Two-Step Equation Balancer (ax + b = c)
    const a = randomInt(2, 5);
    const x = randomInt(2, 8);
    const b = randomInt(3, 12);
    const c = a * x + b;
    const opts = shuffleArray([x, x + 2, x - 1, x + 3]);

    return {
      id,
      prompt: `Solve the two-step linear equation: ${a}x + ${b} = ${c}`,
      correctAnswer: x,
      options: opts,
      difficulty,
      hints: [
        `Step 1: Subtract ${b} from both sides to isolate the variable term.`,
        `${a}x = ${c} - ${b} -> ${a}x = ${c - b}.`,
        `Step 2: Divide both sides by ${a} -> x = ${(c - b) / a}.`
      ],
      workedSolution: {
        steps: [
          `${a}x + ${b} = ${c}`,
          `Subtract ${b} from both sides: ${a}x = ${c - b}`,
          `Divide by ${a}: x = ${x}`
        ],
        verificationTip: `Check: ${a}(${x}) + ${b} = ${a * x} + ${b} = ${c}. Correct!`
      },
      explanation: `x = ${x}.`
    };
  }

  // Level 7 default: Rational numbers, powers, and algebraic BODMAS
  const bodmas = generateBodmasChallenge(7, difficulty);
  return {
    id,
    prompt: `Evaluate using BODMAS: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 8 QUESTION GENERATORS
// -------------------------------------------------------------
function generateLevel8Question(gameIndex: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `l8_g${gameIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (gameIndex === 3) {
    // Pythagorean Theorem Navigator
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17]
    ];
    const trip = randomChoice(triples);
    const a = trip[0];
    const b = trip[1];
    const c = trip[2];
    const opts = shuffleArray([c, c + 2, a + b, c + 1]);

    return {
      id,
      prompt: `In a right-angled triangle, the legs are a = ${a} and b = ${b}. Find the hypotenuse c.`,
      visualData: { type: 'right_triangle', a, b, c: '?' },
      correctAnswer: c,
      options: opts,
      difficulty,
      hints: [
        'Apply the Pythagorean Theorem: a² + b² = c².',
        `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}.`,
        `Take the square root: c = √(${c * c}) = ${c}.`
      ],
      workedSolution: {
        steps: [
          `c² = a² + b²`,
          `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}`,
          `c = √${c * c} = ${c}`
        ],
        verificationTip: 'The hypotenuse c is always the longest side in a right triangle.'
      },
      explanation: `Hypotenuse c = ${c}.`
    };
  }

  if (gameIndex === 5) {
    // Algebraic Identities Expansion: (a+b)² or a² - b²
    const isDiff = Math.random() > 0.5;
    if (isDiff) {
      const a = 'x';
      const b = randomChoice([3, 4, 5, 6]);
      const correct = `(x - ${b})(x + ${b})`;
      const opts = shuffleArray([correct, `(x - ${b})²`, `(x + ${b})²`, `x² - ${b}`]);

      return {
        id,
        prompt: `Factor using difference of squares identity: x² - ${b * b}`,
        correctAnswer: correct,
        options: opts,
        difficulty,
        hints: [
          'Identity: a² - b² = (a - b)(a + b).',
          `Here, a = x and b = √(${b * b}) = ${b}.`,
          `x² - ${b * b} = (x - ${b})(x + ${b}).`
        ],
        workedSolution: {
          steps: [`a² - b² = (a - b)(a + b)`, `x² - ${b}² = (x - ${b})(x + ${b})`],
          verificationTip: `FOIL check: (x - ${b})(x + ${b}) = x² + ${b}x - ${b}x - ${b * b} = x² - ${b * b}.`
        },
        explanation: `x² - ${b * b} = (x - ${b})(x + ${b}).`
      };
    } else {
      const k = randomChoice([2, 3, 4, 5]);
      const correct = `x² + ${2 * k}x + ${k * k}`;
      const opts = shuffleArray([correct, `x² + ${k * k}`, `x² + ${k}x + ${k * k}`, `x² + ${2 * k}x + ${2 * k}`]);

      return {
        id,
        prompt: `Expand using the identity (a + b)²: (x + ${k})²`,
        correctAnswer: correct,
        options: opts,
        difficulty,
        hints: [
          'Identity: (a + b)² = a² + 2ab + b².',
          `Don't forget the middle term 2ab = 2 × x × ${k} = ${2 * k}x!`,
          `(x + ${k})² = x² + ${2 * k}x + ${k * k}.`
        ],
        workedSolution: {
          steps: [
            `(a + b)² = a² + 2ab + b²`,
            `(x + ${k})² = x² + 2(x)(${k}) + ${k}² = x² + ${2 * k}x + ${k * k}`
          ],
          verificationTip: 'A common mistake is forgetting the 2ab middle term.'
        },
        explanation: `(x + ${k})² = ${correct}.`
      };
    }
  }

  // Level 8 default: Linear equation with variables on both sides
  const m1 = randomInt(4, 7);
  const m2 = randomInt(2, 3);
  const xAns = randomInt(2, 6);
  const c1 = randomInt(1, 10);
  const c2 = (m1 - m2) * xAns + c1;
  const opts = shuffleArray([xAns, xAns + 1, xAns - 1, xAns + 2]);

  return {
    id,
    prompt: `Solve for x: ${m1}x - ${c1} = ${m2}x + ${c2 - c1}`,
    correctAnswer: xAns,
    options: opts,
    difficulty,
    hints: [
      `Subtract ${m2}x from both sides to group variables together.`,
      `(${m1} - ${m2})x - ${c1} = ${c2 - c1} -> ${m1 - m2}x = ${c2}.`,
      `Divide by ${m1 - m2}: x = ${xAns}.`
    ],
    workedSolution: {
      steps: [
        `${m1}x - ${c1} = ${m2}x + ${c2 - c1}`,
        `Subtract ${m2}x: ${m1 - m2}x - ${c1} = ${c2 - c1}`,
        `Add ${c1}: ${m1 - m2}x = ${c2}`,
        `x = ${xAns}`
      ],
      verificationTip: `Substitute x = ${xAns} into both sides to verify equality.`
    },
    explanation: `x = ${xAns}.`
  };
}

function generateFallbackQuestion(level: number, difficulty: 1 | 2 | 3): QuestionData {
  const id = `fallback_${level}_${Date.now()}`;
  const bodmas = generateBodmasChallenge(level, difficulty);

  return {
    id,
    prompt: `Level ${level} Challenge: ${bodmas.expression}`,
    correctAnswer: bodmas.answer,
    options: bodmas.distractors,
    difficulty,
    hints: bodmas.hints,
    workedSolution: {
      steps: bodmas.steps,
      verificationTip: bodmas.ruleEmphasized,
    },
    explanation: bodmas.explanation,
  };
}
