// BODMAS / PEMDAS and Multi-Number Mathematical Expression Engine
// Generates rigorous 3-number, 4-number, and multi-step operations across Levels 1–8

import { randomInt, randomChoice, shuffleArray } from './mathUtils';

export interface BodmasChallenge {
  expression: string;
  answer: number;
  steps: string[];
  distractors: number[];
  hints: [string, string, string];
  explanation: string;
  ruleEmphasized: string;
}

/**
 * Generate a 3-Number or 4-Number arithmetic challenge with BODMAS rules
 * tailored specifically to the curriculum level (Levels 1 to 8).
 */
export function generateBodmasChallenge(level: number, difficulty: 1 | 2 | 3 = 1): BodmasChallenge {
  switch (level) {
    case 1:
      return generateLevel1MultiNumber(difficulty);
    case 2:
      return generateLevel2MultiNumber(difficulty);
    case 3:
      return generateLevel3Bodmas(difficulty);
    case 4:
      return generateLevel4Bodmas(difficulty);
    case 5:
      return generateLevel5Bodmas(difficulty);
    case 6:
      return generateLevel6Bodmas(difficulty);
    case 7:
      return generateLevel7Bodmas(difficulty);
    case 8:
      return generateLevel8Bodmas(difficulty);
    default:
      return generateLevel4Bodmas(difficulty);
  }
}

// ----------------------------------------------------------------------
// LEVEL 1: Creative 3-Number 2-Digit Operations, Friendly Tens, & Regrouping
// e.g. 14 + 16 + 25 = 55, 35 + 25 - 18 = 42, 60 - 25 - 15 = 20
// ----------------------------------------------------------------------
function generateLevel1MultiNumber(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // 3 numbers with friendly pairs that make tens (creative 2-digit addition)
    const baseTen = randomChoice([10, 20, 30]);
    const pair1 = randomChoice([12, 14, 15, 16, 18, 22, 25]);
    const pair2 = pair1 % 10 === 5 ? 15 : (pair1 % 10 === 2 ? 18 : (pair1 % 10 === 8 ? 12 : (pair1 % 10 === 4 ? 16 : 14)));
    const c = randomInt(11, 28);
    const ans = pair1 + pair2 + c;
    const expr = `${pair1} + ${pair2} + ${c}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Spot the friendly ten pair first: ${pair1} + ${pair2} = ${pair1 + pair2}.`,
        `Now add the third number: ${pair1 + pair2} + ${c} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 10, ans - 10, ans + 2]),
      hints: [
        `Look for the two numbers that add up to a friendly multiple of ten (${pair1} + ${pair2} = ${pair1 + pair2}).`,
        `Now add ${c} to ${pair1 + pair2}.`,
        `The total sum is ${ans}.`,
      ],
      explanation: `${pair1} + ${pair2} + ${c} = (${pair1} + ${pair2}) + ${c} = ${pair1 + pair2} + ${c} = ${ans}.`,
      ruleEmphasized: 'Creative mental math: combine friendly pairs that make neat tens first!',
    };
  }

  if (difficulty === 2) {
    // 3 numbers mixed 2-digit addition and subtraction (e.g. 35 + 25 - 18)
    const a = randomChoice([25, 35, 45, 50, 42, 38]);
    const b = randomChoice([15, 25, 20, 18, 22]);
    const c = randomInt(12, Math.min(28, a + b - 10));
    const ans = a + b - c;
    const expr = `${a} + ${b} - ${c}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `First add: ${a} + ${b} = ${a + b}.`,
        `Then subtract: ${a + b} - ${c} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 10, ans - 5, ans + 8]),
      hints: [
        `First calculate the sum: ${a} + ${b} = ${a + b}.`,
        `Now subtract ${c} from ${a + b}.`,
        `The result is ${ans}.`,
      ],
      explanation: `${a} + ${b} - ${c} = ${a + b} - ${c} = ${ans}.`,
      ruleEmphasized: 'Two-digit chain math: solve from left to right with friendly regrouping.',
    };
  }

  // Difficulty 3: 3 numbers with consecutive subtraction & friendly benchmarks (e.g. 70 - 25 - 15)
  const total = randomChoice([60, 70, 80, 90, 75, 85]);
  const sub1 = randomChoice([20, 25, 30, 35, 28]);
  const sub2 = randomChoice([15, 20, 12, 18, 25]);
  const ans = total - sub1 - sub2;
  const expr = `${total} - ${sub1} - ${sub2}`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1: Take away ${sub1} from ${total}: ${total} - ${sub1} = ${total - sub1}.`,
      `Step 2: Now take away ${sub2} from ${total - sub1}: ${total - sub1} - ${sub2} = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [ans + 10, ans - 10, ans + 5]),
    hints: [
      `Subtract ${sub1} from ${total} first: ${total} - ${sub1} = ${total - sub1}.`,
      `Then subtract ${sub2} from ${total - sub1}.`,
      `${total} - ${sub1} - ${sub2} = ${ans}.`,
    ],
    explanation: `${total} - ${sub1} - ${sub2} = ${total - sub1} - ${sub2} = ${ans}. Or combine subtractions: ${total} - (${sub1} + ${sub2}) = ${ans}.`,
    ruleEmphasized: 'Creative subtraction: take away parts successively or combine subtrahends!',
  };
}

// ----------------------------------------------------------------------
// LEVEL 2: 3-Number & 4-Number 2-digit sums, grouping, multiplication intro
// e.g. 15 + 25 + 18 = 58, 40 - 15 - 8 = 17, 3 × 4 + 10 = 22, 12 + 8 + 20 - 15 = 25
// ----------------------------------------------------------------------
function generateLevel2MultiNumber(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // 3 numbers friendly 2-digit addition
    const a = randomInt(10, 30);
    const b = randomInt(10, 25);
    const c = randomInt(5, 20);
    const ans = a + b + c;
    const expr = `${a} + ${b} + ${c}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Combine ${a} + ${b} = ${a + b}.`,
        `Add the remaining ${c}: ${a + b} + ${c} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 10, ans - 10, ans + 2]),
      hints: [
        `Look for friendly combinations (like tens).`,
        `${a} + ${b} = ${a + b}. Now add ${c}.`,
        `The sum equals ${ans}.`,
      ],
      explanation: `${a} + ${b} + ${c} = ${ans}.`,
      ruleEmphasized: 'Associative property: group numbers into friendly tens.',
    };
  }

  if (difficulty === 2) {
    // 4 numbers addition & subtraction chain
    const a = randomInt(20, 45);
    const b = randomInt(10, 25);
    const c = randomInt(5, 15);
    const d = randomInt(5, 20);
    const ans = a + b - c + d;
    const expr = `${a} + ${b} - ${c} + ${d}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1: ${a} + ${b} = ${a + b}.`,
        `Step 2: ${a + b} - ${c} = ${a + b - c}.`,
        `Step 3: ${a + b - c} + ${d} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 10, ans - 5, ans + 8]),
      hints: [
        'Move step-by-step from left to right.',
        `First part: ${a} + ${b} - ${c} = ${a + b - c}.`,
        `Finally add ${d} to reach ${ans}.`,
      ],
      explanation: `${a} + ${b} - ${c} + ${d} = ${ans}.`,
      ruleEmphasized: 'Chain arithmetic evaluates smoothly from left to right.',
    };
  }

  // Difficulty 3: Introduction of Multiplication + Addition (pre-BODMAS)
  const a = randomInt(3, 8);
  const b = randomInt(2, 6);
  const c = randomInt(10, 30);
  const ans = a * b + c;
  const expr = `${a} × ${b} + ${c}`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1 (Multiply first): ${a} × ${b} = ${a * b}.`,
      `Step 2 (Add): ${a * b} + ${c} = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [a * (b + c), ans + 5, ans - 10]),
    hints: [
      `Multiply ${a} × ${b} before adding ${c}!`,
      `${a} × ${b} = ${a * b}.`,
      `Now add ${c}: ${a * b} + ${c} = ${ans}.`,
    ],
    explanation: `${a} × ${b} + ${c} = ${a * b} + ${c} = ${ans}. Multiplication happens before addition.`,
    ruleEmphasized: 'Multiplication has higher priority than addition!',
  };
}

// ----------------------------------------------------------------------
// LEVEL 3: BODMAS Foundations: Multiplications, Divisions, and Brackets
// e.g. 15 + 4 × 3 = 27, (18 + 6) ÷ 4 = 6, 30 - 4 × 5 + 10 = 20
// ----------------------------------------------------------------------
function generateLevel3Bodmas(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // Classic BODMAS trap: a + b × c
    const a = randomInt(5, 20);
    const b = randomInt(3, 8);
    const c = randomInt(2, 6);
    const ans = a + b * c;
    const naiveAns = (a + b) * c; // common student misconception (left-to-right)
    const expr = `${a} + ${b} × ${c}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `BODMAS Rule: Multiplication comes BEFORE Addition!`,
        `Step 1: Calculate ${b} × ${c} = ${b * c}.`,
        `Step 2: Add ${a} + ${b * c} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [naiveAns, ans + b, ans - c]),
      hints: [
        'Remember BODMAS: Do Multiplication before Addition!',
        `Multiply ${b} × ${c} first to get ${b * c}.`,
        `Then add ${a}: ${a} + ${b * c} = ${ans}.`,
      ],
      explanation: `According to BODMAS, ${b} × ${c} = ${b * c} is done first. Then ${a} + ${b * c} = ${ans}. (Do NOT do (${a} + ${b}) × ${c} = ${naiveAns}!).`,
      ruleEmphasized: 'BODMAS (M before A): Multiplication takes precedence over Addition.',
    };
  }

  if (difficulty === 2) {
    // Brackets with Division: (a + b) ÷ c
    const c = randomInt(3, 7);
    const quotient = randomInt(4, 9);
    const total = c * quotient;
    const a = randomInt(2, total - 2);
    const b = total - a;
    const ans = quotient;
    const expr = `(${a} + ${b}) ÷ ${c}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `BODMAS Rule: Brackets (B) must ALWAYS be solved first!`,
        `Step 1: Inside brackets: ${a} + ${b} = ${total}.`,
        `Step 2: Divide: ${total} ÷ ${c} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 2, quotient + 1, Math.max(1, quotient - 2)]),
      hints: [
        'Solve inside the brackets ( ) first!',
        `${a} + ${b} = ${total}.`,
        `Now divide ${total} by ${c} to get ${ans}.`,
      ],
      explanation: `First evaluate inside brackets: (${a} + ${b}) = ${total}. Then ${total} ÷ ${c} = ${ans}.`,
      ruleEmphasized: 'Brackets (B) always take the highest priority in BODMAS.',
    };
  }

  // Difficulty 3: 4-number mixed BODMAS: a - b × c + d
  const b = randomInt(2, 5);
  const c = randomInt(2, 6);
  const prod = b * c;
  const a = randomInt(prod + 5, prod + 25);
  const d = randomInt(4, 15);
  const ans = a - prod + d;
  const expr = `${a} - ${b} × ${c} + ${d}`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1 (Multiplication first): ${b} × ${c} = ${prod}.`,
      `Expression becomes: ${a} - ${prod} + ${d}.`,
      `Step 2 (Left to right): ${a} - ${prod} = ${a - prod}.`,
      `Step 3: ${a - prod} + ${d} = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [(a - b) * c + d, ans + prod, ans - 5]),
    hints: [
      `Spot the multiplication (${b} × ${c}) and compute it first.`,
      `Now calculate from left to right: ${a} - ${prod} + ${d}.`,
      `The final answer is ${ans}.`,
    ],
    explanation: `Multiply first: ${b} × ${c} = ${prod}. Then evaluate ${a} - ${prod} + ${d} = ${ans}.`,
    ruleEmphasized: 'BODMAS Rule: Perform multiplication first, then addition and subtraction from left to right.',
  };
}

// ----------------------------------------------------------------------
// LEVEL 4: Multi-digit 4-number operations, Brackets, and Mixed Operators
// e.g. (45 - 15) ÷ 5 + 4 × 6 = 30, 80 - 6 × 8 + 14 = 46, (12 + 8) × (15 - 10) = 100
// ----------------------------------------------------------------------
function generateLevel4Bodmas(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // Double multiplication with addition: a × b + c × d
    const a = randomInt(4, 9);
    const b = randomInt(3, 8);
    const c = randomInt(3, 7);
    const d = randomInt(2, 6);
    const ans = a * b + c * d;
    const expr = `${a} × ${b} + ${c} × ${d}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1: Compute both multiplications: ${a} × ${b} = ${a * b} and ${c} × ${d} = ${c * d}.`,
        `Step 2: Add the two products: ${a * b} + ${c * d} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [(a * b + c) * d, ans + 10, ans - 12]),
      hints: [
        'Calculate both multiplications first before adding!',
        `${a} × ${b} = ${a * b} and ${c} × ${d} = ${c * d}.`,
        `${a * b} + ${c * d} = ${ans}.`,
      ],
      explanation: `${a} × ${b} + ${c} × ${d} = ${a * b} + ${c * d} = ${ans}.`,
      ruleEmphasized: 'Both multiplications must be evaluated before performing addition.',
    };
  }

  if (difficulty === 2) {
    // Brackets combined with division and multiplication: (a + b) ÷ c + d × e
    const c = randomInt(3, 6);
    const q = randomInt(3, 8);
    const total = c * q;
    const a = randomInt(4, total - 4);
    const b = total - a;
    const d = randomInt(3, 6);
    const e = randomInt(2, 5);
    const ans = q + d * e;
    const expr = `(${a} + ${b}) ÷ ${c} + ${d} × ${e}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Brackets): (${a} + ${b}) = ${total}.`,
        `Step 2 (Division): ${total} ÷ ${c} = ${q}.`,
        `Step 3 (Multiplication): ${d} × ${e} = ${d * e}.`,
        `Step 4 (Addition): ${q} + ${d * e} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [(q + d) * e, ans + 10, ans - q]),
      hints: [
        'Step 1: Solve inside the bracket.',
        `Step 2: Do the division (${total} ÷ ${c}) and multiplication (${d} × ${e}).`,
        `Step 3: Add the two results: ${q} + ${d * e} = ${ans}.`,
      ],
      explanation: `(${a} + ${b}) ÷ ${c} + ${d} × ${e} = ${total} ÷ ${c} + ${d * e} = ${q} + ${d * e} = ${ans}.`,
      ruleEmphasized: 'Full BODMAS sequence: Brackets → Division & Multiplication → Addition.',
    };
  }

  // Difficulty 3: Double brackets multiplied: (a + b) × (c - d)
  const a = randomInt(8, 25);
  const b = randomInt(6, 20);
  const sum = a + b;
  const d = randomInt(2, 8);
  const diff = randomInt(3, 7);
  const c = d + diff;
  const ans = sum * diff;
  const expr = `(${a} + ${b}) × (${c} - ${d})`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1: First bracket: ${a} + ${b} = ${sum}.`,
      `Step 2: Second bracket: ${c} - ${d} = ${diff}.`,
      `Step 3: Multiply the bracket results: ${sum} × ${diff} = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [sum * c - d, ans + sum, ans - diff * 10]),
    hints: [
      'Evaluate each bracket separately first.',
      `Bracket 1 = ${sum}. Bracket 2 = ${diff}.`,
      `Now multiply: ${sum} × ${diff} = ${ans}.`,
    ],
    explanation: `(${a} + ${b}) × (${c} - ${d}) = ${sum} × ${diff} = ${ans}.`,
    ruleEmphasized: 'Evaluate every bracket completely before multiplying them together.',
  };
}

// ----------------------------------------------------------------------
// LEVEL 5: Advanced 4-Number BODMAS: Nested brackets, powers, fractions
// e.g. [50 - (6 × 5)] + (24 ÷ 3) = 28, 2³ + 15 × 2 - 10 = 28, 100 - [4 × (15 - 5)] = 60
// ----------------------------------------------------------------------
function generateLevel5Bodmas(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // Powers / Orders intro: a² + b × c - d
    const base = randomInt(3, 6);
    const powerVal = base * base;
    const b = randomInt(3, 7);
    const c = randomInt(2, 5);
    const prod = b * c;
    const d = randomInt(4, 15);
    const ans = powerVal + prod - d;
    const expr = `${base}² + ${b} × ${c} - ${d}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `BODMAS Orders (O): Evaluate the square first: ${base}² = ${powerVal}.`,
        `Step 2 (Multiplication): ${b} × ${c} = ${prod}.`,
        `Step 3: ${powerVal} + ${prod} - ${d} = ${powerVal + prod} - ${d} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [base * 2 + prod - d, ans + 10, ans - prod]),
      hints: [
        `Remember 'O' in BODMAS stands for Orders / Powers! ${base}² = ${powerVal}.`,
        `Now multiply ${b} × ${c} = ${prod}.`,
        `${powerVal} + ${prod} - ${d} = ${ans}.`,
      ],
      explanation: `${base}² + ${b} × ${c} - ${d} = ${powerVal} + ${prod} - ${d} = ${ans}.`,
      ruleEmphasized: 'Orders (powers/exponents) come immediately after brackets in BODMAS.',
    };
  }

  if (difficulty === 2) {
    // Nested Brackets: a - [b + (c × d)]
    const c = randomInt(3, 6);
    const d = randomInt(2, 5);
    const prod = c * d;
    const b = randomInt(5, 20);
    const innerTotal = b + prod;
    const a = randomInt(innerTotal + 10, innerTotal + 40);
    const ans = a - innerTotal;
    const expr = `${a} - [${b} + (${c} × ${d})]`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Innermost bracket): ${c} × ${d} = ${prod}.`,
        `Step 2 (Outer bracket): ${b} + ${prod} = ${innerTotal}.`,
        `Step 3 (Final subtraction): ${a} - ${innerTotal} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [a - b + prod, ans + 10, a - (b + c) * d]),
      hints: [
        'Always evaluate the innermost parentheses ( ) first!',
        `(${c} × ${d}) = ${prod}. Then [${b} + ${prod}] = ${innerTotal}.`,
        `${a} - ${innerTotal} = ${ans}.`,
      ],
      explanation: `${a} - [${b} + (${c} × ${d})] = ${a} - [${b} + ${prod}] = ${a} - ${innerTotal} = ${ans}.`,
      ruleEmphasized: 'Nested brackets evaluate from the inside out: ( ) first, then [ ].',
    };
  }

  // Difficulty 3: 4-term BODMAS with division and multiplication: (a ÷ b) × c + d² - e
  const b = randomInt(3, 7);
  const q = randomInt(3, 8);
  const a = b * q;
  const c = randomInt(3, 6);
  const base = randomInt(3, 5);
  const pwr = base * base;
  const e = randomInt(5, 15);
  const ans = q * c + pwr - e;
  const expr = `(${a} ÷ ${b}) × ${c} + ${base}² - ${e}`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1 (Bracket division): (${a} ÷ ${b}) = ${q}.`,
      `Step 2 (Order/Power): ${base}² = ${pwr}.`,
      `Step 3 (Multiplication): ${q} × ${c} = ${q * c}.`,
      `Step 4 (Addition & Subtraction): ${q * c} + ${pwr} - ${e} = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [ans + 10, ans - 5, (q * c + base) * 2 - e]),
    hints: [
      `Divide (${a} ÷ ${b}) = ${q} and evaluate ${base}² = ${pwr}.`,
      `Multiply ${q} × ${c} = ${q * c}.`,
      `${q * c} + ${pwr} - ${e} = ${ans}.`,
    ],
    explanation: `(${a} ÷ ${b}) × ${c} + ${base}² - ${e} = ${q} × ${c} + ${pwr} - ${e} = ${q * c} + ${pwr} - ${e} = ${ans}.`,
    ruleEmphasized: 'Carefully follow B -> O -> D/M -> A/S.',
  };
}

// ----------------------------------------------------------------------
// LEVEL 6: Integers with BODMAS, Negative Numbers, Powers, Square Roots
// e.g. (-12) + 5 × (-4) - (-10) = -22, [36 - (2³ + 4)] ÷ 6 = 4
// ----------------------------------------------------------------------
function generateLevel6Bodmas(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // Negative integer multiplication with addition: a + b × (-c)
    const a = randomInt(10, 30);
    const b = randomInt(3, 7);
    const c = randomInt(2, 6);
    const prod = b * (-c);
    const ans = a + prod;
    const expr = `${a} + ${b} × (-${c})`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Multiply positive by negative): ${b} × (-${c}) = ${prod}.`,
        `Step 2 (Add): ${a} + (${prod}) = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [a + b * c, (a + b) * (-c), ans - 5]),
      hints: [
        'Positive × Negative gives a NEGATIVE number!',
        `${b} × (-${c}) = ${prod}.`,
        `${a} + (${prod}) = ${ans}.`,
      ],
      explanation: `${a} + ${b} × (-${c}) = ${a} + (${prod}) = ${ans}.`,
      ruleEmphasized: 'BODMAS rules apply identically to negative integers.',
    };
  }

  if (difficulty === 2) {
    // Cubes & Square Roots in BODMAS: [a - (b³ + c)] ÷ d
    const b = randomInt(2, 3);
    const cube = b * b * b; // 8 or 27
    const c = randomInt(2, 6);
    const inner = cube + c;
    const d = randomInt(2, 5);
    const ans = randomInt(2, 7);
    const a = inner + d * ans;
    const expr = `[${a} - (${b}³ + ${c})] ÷ ${d}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Power inside bracket): ${b}³ = ${cube}.`,
        `Step 2 (Inner bracket): ${cube} + ${c} = ${inner}.`,
        `Step 3 (Outer bracket): ${a} - ${inner} = ${a - inner}.`,
        `Step 4 (Division): ${a - inner} ÷ ${d} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 2, Math.max(1, ans - 1), ans + 4]),
      hints: [
        `First find ${b}³ = ${b} × ${b} × ${b} = ${cube}.`,
        `Inside bracket = ${cube} + ${c} = ${inner}. Outer bracket = ${a} - ${inner} = ${a - inner}.`,
        `Finally divide by ${d}: ${a - inner} ÷ ${d} = ${ans}.`,
      ],
      explanation: `[${a} - (${b}³ + ${c})] ÷ ${d} = [${a} - ${inner}] ÷ ${d} = ${a - inner} ÷ ${d} = ${ans}.`,
      ruleEmphasized: 'Evaluate powers inside nested brackets first.',
    };
  }

  // Difficulty 3: 4 numbers with multiple negative signs: (-a) - (-b) × c + (-d)
  const a = randomInt(5, 15);
  const b = randomInt(2, 5);
  const c = randomInt(3, 6);
  const prod = (-b) * c; // negative
  const d = randomInt(2, 8);
  const ans = (-a) - prod + (-d);
  const expr = `(-${a}) - (-${b}) × ${c} + (-${d})`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1 (Multiply): (-${b}) × ${c} = ${prod}.`,
      `Step 2: (-${a}) - (${prod}) = (-${a}) + ${-prod} = ${-a - prod}.`,
      `Step 3: ${-a - prod} + (-${d}) = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [ans + 10, ans - 10, (-a - b) * c - d]),
    hints: [
      `Compute the product: (-${b}) × ${c} = ${prod}.`,
      `Subtracting a negative is the same as adding: -(-${Math.abs(prod)}) = +${Math.abs(prod)}.`,
      `Evaluate step-by-step to get ${ans}.`,
    ],
    explanation: `(-${a}) - (-${b}) × ${c} + (-${d}) = (-${a}) - (${prod}) - ${d} = ${ans}.`,
    ruleEmphasized: 'Subtracting a negative integer is equivalent to adding.',
  };
}

// ----------------------------------------------------------------------
// LEVEL 7: Rational Numbers, Algebraic Expressions, Linear Evaluation
// e.g. 2(3x - 4) + 5x when x=3, 5² - (18 ÷ 3) × 2, (3/4 + 1/2) × 12 - 7
// ----------------------------------------------------------------------
function generateLevel7Bodmas(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // Algebraic expression evaluation: a(bx + c) - dx when x=k
    const a = randomInt(2, 4);
    const b = randomInt(2, 4);
    const c = randomInt(1, 5);
    const d = randomInt(2, 5);
    const x = randomInt(2, 4);
    const inside = b * x + c;
    const ans = a * inside - d * x;
    const expr = `Evaluate: ${a}(${b}x + ${c}) - ${d}x   [when x = ${x}]`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Substitute x = ${x}): ${a}(${b}(${x}) + ${c}) - ${d}(${x}).`,
        `Step 2 (Bracket): ${b} × ${x} + ${c} = ${b * x} + ${c} = ${inside}.`,
        `Step 3 (Multiply): ${a} × ${inside} = ${a * inside} and ${d} × ${x} = ${d * x}.`,
        `Step 4: ${a * inside} - ${d * x} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 5, ans - 10, a * (b * x + c - d * x)]),
      hints: [
        `Replace every 'x' with ${x}.`,
        `Calculate the bracket: ${b}(${x}) + ${c} = ${inside}.`,
        `${a}(${inside}) - ${d}(${x}) = ${ans}.`,
      ],
      explanation: `For x = ${x}: ${a}(${inside}) - ${d * x} = ${a * inside} - ${d * x} = ${ans}.`,
      ruleEmphasized: 'Substitution preserves BODMAS precedence for algebraic expressions.',
    };
  }

  if (difficulty === 2) {
    // Exponent and brackets: a³ - (b² + c) × d
    const a = randomInt(3, 5);
    const cube = a * a * a;
    const b = randomInt(2, 4);
    const sq = b * b;
    const c = randomInt(2, 6);
    const d = randomInt(2, 4);
    const bracket = sq + c;
    const prod = bracket * d;
    const ans = cube - prod;
    const expr = `${a}³ - (${b}² + ${c}) × ${d}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Powers): ${a}³ = ${cube} and ${b}² = ${sq}.`,
        `Step 2 (Bracket): ${sq} + ${c} = ${bracket}.`,
        `Step 3 (Multiply): ${bracket} × ${d} = ${prod}.`,
        `Step 4 (Subtract): ${cube} - ${prod} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 10, (cube - bracket) * d, ans - 15]),
      hints: [
        `Evaluate powers: ${a}³ = ${cube}, ${b}² = ${sq}.`,
        `Inside bracket = ${bracket}. Multiply by ${d} = ${prod}.`,
        `${cube} - ${prod} = ${ans}.`,
      ],
      explanation: `${a}³ - (${b}² + ${c}) × ${d} = ${cube} - ${bracket} × ${d} = ${cube} - ${prod} = ${ans}.`,
      ruleEmphasized: 'Powers evaluated inside and outside brackets follow strict hierarchy.',
    };
  }

  // Difficulty 3: Fraction distribution with BODMAS: (1/a + 1/b) × M - c
  const a = 2;
  const b = 4; // 1/2 + 1/4 = 3/4
  const multiplier = randomChoice([8, 12, 16, 20]);
  const fractionSumVal = (1 / a + 1 / b) * multiplier; // (3/4)*M is an integer
  const c = randomInt(2, 6);
  const ans = fractionSumVal - c;
  const expr = `(1/${a} + 1/${b}) × ${multiplier} - ${c}`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1 (Bracket fractions): 1/${a} + 1/${b} = 2/${b} + 1/${b} = 3/${b}.`,
      `Step 2 (Multiply): (3/${b}) × ${multiplier} = ${fractionSumVal}.`,
      `Step 3 (Subtract): ${fractionSumVal} - ${c} = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [ans + 2, ans - 3, ans + 4]),
    hints: [
      `Find common denominator inside bracket: 1/${a} + 1/${b} = 3/4.`,
      `Multiply: 3/4 of ${multiplier} is ${fractionSumVal}.`,
      `${fractionSumVal} - ${c} = ${ans}.`,
    ],
    explanation: `(1/${a} + 1/${b}) × ${multiplier} - ${c} = (3/4) × ${multiplier} - ${c} = ${fractionSumVal} - ${c} = ${ans}.`,
    ruleEmphasized: 'Fraction addition inside brackets must use a common denominator before multiplying.',
  };
}

// ----------------------------------------------------------------------
// LEVEL 8: Master Pinnacle BODMAS: Square roots, Laws of Indices, Complex Chains
// e.g. √(144) + 4² × 2 - (30 ÷ 3) = 34, (2⁴ - 6) × 3 + √(81) = 39
// ----------------------------------------------------------------------
function generateLevel8Bodmas(difficulty: 1 | 2 | 3): BodmasChallenge {
  if (difficulty === 1) {
    // Square roots and exponents: √(a²) + b² × c - (d ÷ e)
    const roots = [
      { sq: 36, root: 6 },
      { sq: 49, root: 7 },
      { sq: 64, root: 8 },
      { sq: 81, root: 9 },
      { sq: 100, root: 10 },
      { sq: 121, root: 11 },
      { sq: 144, root: 12 },
    ];
    const chosenRoot = randomChoice(roots);
    const b = randomInt(2, 4);
    const bSq = b * b;
    const c = randomInt(2, 5);
    const e = randomInt(2, 5);
    const divRes = randomInt(2, 6);
    const d = e * divRes;
    const ans = chosenRoot.root + bSq * c - divRes;
    const expr = `√(${chosenRoot.sq}) + ${b}² × ${c} - (${d} ÷ ${e})`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Root & Power): √(${chosenRoot.sq}) = ${chosenRoot.root} and ${b}² = ${bSq}.`,
        `Step 2 (Bracket): (${d} ÷ ${e}) = ${divRes}.`,
        `Step 3 (Multiplication): ${bSq} × ${c} = ${bSq * c}.`,
        `Step 4: ${chosenRoot.root} + ${bSq * c} - ${divRes} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 10, ans - chosenRoot.root, ans + 4]),
      hints: [
        `Calculate √(${chosenRoot.sq}) = ${chosenRoot.root} and ${b}² = ${bSq}.`,
        `Multiply ${bSq} × ${c} = ${bSq * c} and divide (${d} ÷ ${e}) = ${divRes}.`,
        `${chosenRoot.root} + ${bSq * c} - ${divRes} = ${ans}.`,
      ],
      explanation: `√(${chosenRoot.sq}) + ${b}² × ${c} - (${d} ÷ ${e}) = ${chosenRoot.root} + ${bSq * c} - ${divRes} = ${ans}.`,
      ruleEmphasized: 'Radicals/Roots and Exponents share the Orders (O) tier in BODMAS.',
    };
  }

  if (difficulty === 2) {
    // Laws of indices with BODMAS: (2^a × 2^b) ÷ 2^c + d × e
    const a = randomInt(2, 3);
    const b = randomInt(2, 3);
    const c = randomInt(1, a + b - 1);
    const expResult = Math.pow(2, a + b - c);
    const d = randomInt(3, 7);
    const e = randomInt(2, 5);
    const ans = expResult + d * e;
    const expr = `(2^${a} × 2^${b}) ÷ 2^${c} + ${d} × ${e}`;
    return {
      expression: expr,
      answer: ans,
      steps: [
        `Step 1 (Laws of indices inside bracket): 2^${a} × 2^${b} = 2^(${a}+${b}) = 2^${a + b} = ${Math.pow(2, a + b)}.`,
        `Step 2 (Index division): 2^${a + b} ÷ 2^${c} = 2^(${a + b}-${c}) = 2^${a + b - c} = ${expResult}.`,
        `Step 3 (Multiplication): ${d} × ${e} = ${d * e}.`,
        `Step 4: ${expResult} + ${d * e} = ${ans}.`,
      ],
      distractors: generateIntegerDistractors(ans, [ans + 8, (expResult + d) * e, ans - 12]),
      hints: [
        `Use product rule of powers: 2^${a} × 2^${b} = 2^(${a}+${b}) = 2^${a + b}.`,
        `Divide by 2^${c}: 2^(${a + b}-${c}) = 2^${a + b - c} = ${expResult}.`,
        `Add ${d} × ${e} (${d * e}) to get ${ans}.`,
      ],
      explanation: `(2^${a} × 2^${b}) ÷ 2^${c} + ${d} × ${e} = 2^${a + b - c} + ${d * e} = ${expResult} + ${d * e} = ${ans}.`,
      ruleEmphasized: 'Index laws simplify power operations prior to combining terms.',
    };
  }

  // Difficulty 3: Master multi-bracket compound expression: [a² - (b × c + d)] × e + √(f)
  const a = randomInt(7, 10);
  const aSq = a * a;
  const b = randomInt(3, 5);
  const c = randomInt(4, 6);
  const d = randomInt(2, 6);
  const inner = b * c + d;
  const diff = aSq - inner;
  const e = randomInt(2, 4);
  const rootObj = randomChoice([
    { val: 16, root: 4 },
    { val: 25, root: 5 },
    { val: 36, root: 6 },
    { val: 49, root: 7 },
  ]);
  const ans = diff * e + rootObj.root;
  const expr = `[${a}² - (${b} × ${c} + ${d})] × ${e} + √(${rootObj.val})`;
  return {
    expression: expr,
    answer: ans,
    steps: [
      `Step 1: ${a}² = ${aSq}.`,
      `Step 2 (Inner bracket): ${b} × ${c} + ${d} = ${b * c} + ${d} = ${inner}.`,
      `Step 3 (Square brackets): [${aSq} - ${inner}] = ${diff}.`,
      `Step 4 (Multiply): ${diff} × ${e} = ${diff * e}.`,
      `Step 5: √(${rootObj.val}) = ${rootObj.root}. Add: ${diff * e} + ${rootObj.root} = ${ans}.`,
    ],
    distractors: generateIntegerDistractors(ans, [ans + 12, ans - rootObj.root, diff * (e + rootObj.root)]),
    hints: [
      `Start with innermost bracket (${b} × ${c} + ${d}) = ${inner}.`,
      `Calculate ${a}² - ${inner} = ${diff}.`,
      `Multiply by ${e} and add √(${rootObj.val}) = ${rootObj.root} to get ${ans}.`,
    ],
    explanation: `[${a}² - (${b} × ${c} + ${d})] × ${e} + √(${rootObj.val}) = [${aSq} - ${inner}] × ${e} + ${rootObj.root} = ${diff} × ${e} + ${rootObj.root} = ${ans}.`,
    ruleEmphasized: 'Innermost parentheses → outer square brackets → multiplication → radical addition.',
  };
}

/**
 * Helper to generate 3 unique believable distractor answers alongside the correct answer.
 */
function generateIntegerDistractors(correct: number, suggested: number[]): number[] {
  const set = new Set<number>();
  set.add(correct);

  for (const s of suggested) {
    if (s !== correct && Number.isFinite(s)) {
      set.add(s);
    }
  }

  const offsets = [1, -1, 2, -2, 5, -5, 10, -10];
  let offIdx = 0;
  while (set.size < 4 && offIdx < offsets.length) {
    const candidate = correct + offsets[offIdx];
    set.add(candidate);
    offIdx++;
  }

  const all = Array.from(set);
  return shuffleArray(all);
}
