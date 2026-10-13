import { CurriculumCompetency, CurriculumSummary } from '../types/curriculum';

export const LEVEL_SUMMARIES: CurriculumSummary[] = [
  {
    level: 1,
    stage: 'Foundational (Prep/L1)',
    focusSummary: 'Concrete number sense, counting forward/backward to 20, 10-frames, visual comparisons, 2D shapes, and repeating patterns.',
    keyMilestones: [
      'Subitizes quantities up to 5 and counts up to 20 with 1-to-1 correspondence',
      'Composes and decomposes numbers up to 10 (number bonds)',
      'Understands addition as combining and subtraction as taking away',
      'Identifies circles, squares, rectangles, triangles, and recognizes repeating AB/AAB patterns'
    ],
    totalGames: 20
  },
  {
    level: 2,
    stage: 'Preparatory (L2-L3)',
    focusSummary: 'Place value up to 100, two-digit addition & subtraction with regrouping, skip counting, arrays, equal sharing, basic time and Indian currency.',
    keyMilestones: [
      'Decomposes 2-digit numbers into tens and ones (expanded form)',
      'Performs fluent mental addition and subtraction within 20 and two-digit operations with regrouping',
      'Understands multiplication as repeated addition and division as equal grouping',
      'Reads analog clock hours/half-hours and calculates basic coin/note values'
    ],
    totalGames: 20
  },
  {
    level: 3,
    stage: 'Preparatory (L2-L3)',
    focusSummary: '3-digit operations, multiplication fluency (tables 2-10), division with remainders, unit fractions, perimeter, elapsed time, and bar graphs.',
    keyMilestones: [
      'Solves 3-digit addition and subtraction with regrouping',
      'Applies multiplication facts (1-10) and strategies (distributive breakdown)',
      'Compares unit and simple fractions with like denominators',
      'Calculates perimeter of polygons and reads scaled bar charts'
    ],
    totalGames: 20
  },
  {
    level: 4,
    stage: 'Middle Stage (L4-L6)',
    focusSummary: 'Multi-digit operations, factors & multiples, equivalent fractions, decimals (tenths/hundredths), protractor angles, area vs perimeter, and unit conversions.',
    keyMilestones: [
      'Fluency with 4-digit arithmetic and divisibility rules for 2, 3, 5, 10',
      'Calculates factors, multiples, and builds equivalent fraction walls',
      'Measures and classifies acute, right, obtuse, and straight angles',
      'Solves multi-step word problems involving time intervals and currency budgets'
    ],
    totalGames: 20
  },
  {
    level: 5,
    stage: 'Middle Stage (L4-L6)',
    focusSummary: 'Large numbers (millions), prime factorization, operations on unlike fractions, decimals, percentage foundations, ratios, coordinate grid (Quadrant I), and volume.',
    keyMilestones: [
      'Identifies prime and composite numbers using the Sieve of Eratosthenes',
      'Adds and subtracts fractions with unlike denominators using LCM',
      'Calculates percentages as parts per hundred and solves simple ratio mixtures',
      'Plots points in Quadrant I and calculates rectangular prism volume'
    ],
    totalGames: 20
  },
  {
    level: 6,
    stage: 'Middle Stage (L4-L6)',
    focusSummary: 'Directed integers (positive & negative), rational numbers, algebraic terms & one-step equations, exponents, parallel lines & transversals, and probability basics.',
    keyMilestones: [
      'Understands and computes operations on signed integers (+/-)',
      'Translates verbal scenarios into algebraic expressions and solves x + a = b, ax = b',
      'Applies exponent laws for positive integer powers and prime factor trees',
      'Investigates angle sums in triangles and calculates basic probability (favorable/total)'
    ],
    totalGames: 20
  },
  {
    level: 7,
    stage: 'Secondary Foundations (L7-L8)',
    focusSummary: 'Rational number arithmetic, percentage change, profit/loss, simple interest, linear equations in one variable, exponents, square roots, circle area/perimeter, and statistics.',
    keyMilestones: [
      'Operates fluently with rational numbers in fraction and decimal representations',
      'Calculates percentage increase/decrease, profit/loss %, and simple interest (I = P*R*T/100)',
      'Solves two-step linear equations: ax + b = c and a(x + b) = c',
      'Calculates area & circumference of circles using Pi and finds Mean, Median, Mode'
    ],
    totalGames: 20
  },
  {
    level: 8,
    stage: 'Secondary Foundations (L7-L8)',
    focusSummary: 'Negative exponents, square & cube roots, algebraic identities, factorization, linear equations with fractions, direct/inverse proportion, mensuration, and linear graphs.',
    keyMilestones: [
      'Applies laws of exponents with negative powers and scientific notation',
      'Computes square roots (Pythagorean triples) and cube roots of integers',
      'Expands and factors expressions using identities: (a+b)², (a-b)², a²-b²',
      'Solves direct and inverse proportion problems and models real-world linear graphs'
    ],
    totalGames: 20
  }
];

export const CURRICULUM_COMPETENCIES: CurriculumCompetency[] = [
  // Sample core representative competencies mapped across levels
  {
    code: 'NEP-L1-NUM-01',
    level: 1,
    domain: 'Number Sense',
    stage: 'Foundational (Prep/L1)',
    standardReference: 'NCF-SE C-1.1 / NEP 2020 §4.2',
    learningOutcome: 'Develop subitizing and 1-to-1 counting up to 20 using concrete visual models.',
    observableBehavior: 'Counts collections of objects accurately and identifies cardinal quantity instantly.',
    cognitiveDemand: 'Remembering & Understanding',
    calculationSkills: ['1-to-1 counting', 'Subitizing to 5', 'Forward/backward sequences'],
    reasoningSkills: ['Conservation of number', 'Cardinality principle'],
    classroomApplication: 'Interactive 10-frame counters and safari animal counting races.',
    remedialStrategy: 'Touch-and-count physical tactile counters with voice feedback.',
    extensionActivity: 'Group counters into pairs and identify odd vs even items.',
    associatedGameIds: ['l1_g01', 'l1_g02', 'l1_g03']
  },
  {
    code: 'NEP-L2-ARI-01',
    level: 2,
    domain: 'Arithmetic',
    stage: 'Preparatory (L2-L3)',
    standardReference: 'NCF-SE C-2.3 / NEP 2020 §4.4',
    learningOutcome: 'Master 2-digit place value and regrouping in addition and subtraction.',
    observableBehavior: 'Decomposes 2-digit numbers into tens and ones and performs regrouping seamlessly.',
    cognitiveDemand: 'Applying & Calculating',
    calculationSkills: ['Tens and ones breakdown', 'Column regrouping', 'Mental make-10'],
    reasoningSkills: ['Place-value invariance', 'Decomposition strategy'],
    classroomApplication: 'Interactive Base-10 block puzzles and treasure chest adders.',
    remedialStrategy: 'Visual regrouping animations showing 10 units transforming into 1 ten rod.',
    extensionActivity: 'Apply regrouping to 3-digit expanded notation.',
    associatedGameIds: ['l2_g01', 'l2_g02', 'l2_g03', 'l2_g04']
  },
  {
    code: 'NEP-L3-ARI-02',
    level: 3,
    domain: 'Arithmetic',
    stage: 'Preparatory (L2-L3)',
    standardReference: 'NCF-SE C-3.2 / NEP 2020 §4.5',
    learningOutcome: 'Multiplication fluency and understanding division as sharing with remainders.',
    observableBehavior: 'Recalls multiplication facts up to 10x10 and identifies quotients with remainders.',
    cognitiveDemand: 'Applying & Calculating',
    calculationSkills: ['Times tables 2-10', 'Equal grouping', 'Remainder calculation'],
    reasoningSkills: ['Inverse relationship between multiplication and division'],
    classroomApplication: 'Speedway multiplication race and remainder dock parcel sorting.',
    remedialStrategy: 'Array visualization and skip-counting number lines.',
    extensionActivity: 'Multi-step story problems involving leftover items and packaging.',
    associatedGameIds: ['l3_g02', 'l3_g03', 'l3_g04']
  },
  {
    code: 'NEP-L4-FRA-01',
    level: 4,
    domain: 'Fractions & Decimals',
    stage: 'Middle Stage (L4-L6)',
    standardReference: 'NCF-SE C-4.1 / NEP 2020 §4.6',
    learningOutcome: 'Equivalent fractions and fractional representations of parts of a set.',
    observableBehavior: 'Identifies equivalent fractions using visual fraction bars and number lines.',
    cognitiveDemand: 'Analyzing & Reasoning',
    calculationSkills: ['Simplifying fractions', 'Finding common multiples', 'Fraction addition with like denominators'],
    reasoningSkills: ['Proportional scaling of numerator and denominator'],
    classroomApplication: 'Fraction wall architect game and balance scale.',
    remedialStrategy: 'Interactive fraction bar overlays with dynamic color fills.',
    extensionActivity: 'Ordering fractions with unlike denominators on a tightrope number line.',
    associatedGameIds: ['l4_g04', 'l4_g05', 'l4_g06']
  },
  {
    code: 'NEP-L5-NUM-02',
    level: 5,
    domain: 'Number Sense',
    stage: 'Middle Stage (L4-L6)',
    standardReference: 'NCF-SE C-5.2 / NEP 2020 §4.6',
    learningOutcome: 'Distinguish prime and composite numbers and factorize composite numbers into primes.',
    observableBehavior: 'Determines primality and builds factor trees for numbers up to 100.',
    cognitiveDemand: 'Analyzing & Reasoning',
    calculationSkills: ['Divisibility checks', 'Factor trees', 'Prime factorization'],
    reasoningSkills: ['Fundamental Theorem of Arithmetic foundations'],
    classroomApplication: 'Sieve of Eratosthenes matrix and prime fortress defense.',
    remedialStrategy: 'Interactive rectangular array tester (only 1 row possible for primes).',
    extensionActivity: 'Prime factor trees to compute LCM and HCF/GCD.',
    associatedGameIds: ['l5_g02', 'l5_g03', 'l5_g17']
  },
  {
    code: 'NEP-L6-ALG-01',
    level: 6,
    domain: 'Algebra',
    stage: 'Middle Stage (L4-L6)',
    standardReference: 'NCF-SE C-6.4 / NEP 2020 §4.7',
    learningOutcome: 'Formulate algebraic expressions and solve one-step linear equations using balance intuition.',
    observableBehavior: 'Isolates the unknown variable by applying inverse operations on both sides.',
    cognitiveDemand: 'Applying & Calculating',
    calculationSkills: ['Inverse operations (+/- and *//)', 'Combining like terms', 'Substitution check'],
    reasoningSkills: ['Preservation of equality across an equals sign'],
    classroomApplication: 'Two-pan equation balance scale and algebra tile drag & drop.',
    remedialStrategy: 'Physical scale analogy with weights and mystery gift boxes.',
    extensionActivity: 'Formulate word problems into two-step linear equations.',
    associatedGameIds: ['l6_g07', 'l6_g08', 'l6_g09']
  },
  {
    code: 'NEP-L7-FIN-01',
    level: 7,
    domain: 'Financial & Everyday',
    stage: 'Secondary Foundations (L7-L8)',
    standardReference: 'NCF-SE C-7.5 / NEP 2020 §4.8',
    learningOutcome: 'Compute percentage changes, profit and loss percentages, and simple interest.',
    observableBehavior: 'Calculates cost price, selling price, gain/loss %, and simple interest accurately.',
    cognitiveDemand: 'Evaluating & Optimizing',
    calculationSkills: ['Percentage calculation', 'Ratio scaling', 'Formula substitution I = (P*R*T)/100'],
    reasoningSkills: ['Proportional reasoning in commerce and financial decision making'],
    classroomApplication: 'Boutique shopkeeper simulation and bank vault interest ledger.',
    remedialStrategy: 'Unit rate bar models before introducing standard algebraic formulas.',
    extensionActivity: 'Analyze compound growth vs simple interest over multiple years.',
    associatedGameIds: ['l7_g03', 'l7_g05', 'l7_g06']
  },
  {
    code: 'NEP-L8-ALG-02',
    level: 8,
    domain: 'Algebra',
    stage: 'Secondary Foundations (L7-L8)',
    standardReference: 'NCF-SE C-8.2 / NEP 2020 §4.8',
    learningOutcome: 'Apply algebraic identities (a+b)², (a-b)², a²-b² for expansion and factorisation.',
    observableBehavior: 'Expands binomials and factors quadratic expressions using identities.',
    cognitiveDemand: 'Analyzing & Reasoning',
    calculationSkills: ['Polynomial expansion', 'Pattern recognition in quadratics', 'Common factor grouping'],
    reasoningSkills: ['Geometric area proof of algebraic identities'],
    classroomApplication: 'Algebraic identity card pairing and factorisation sieve.',
    remedialStrategy: 'Area model visualization using squares of side a and b and rectangles of ab.',
    extensionActivity: 'Apply identities to mental arithmetic of large numbers (e.g., 98² = (100-2)²).',
    associatedGameIds: ['l8_g05', 'l8_g06', 'l8_g07']
  }
];
