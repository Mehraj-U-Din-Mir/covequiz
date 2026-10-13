import { GuiQuestion, GuiGameType, StageDifficultyCategory } from '../types/guiGame';
import { randomInt, randomChoice, shuffleArray, isPrime, getFactors, Fraction, lcm } from './mathUtils';
import { generateBodmasChallenge } from './bodmasEngine';

export function generateGuiQuestion(
  gameType: GuiGameType,
  level: number,
  difficulty: StageDifficultyCategory,
  stageNumber: number = 1
): GuiQuestion {
  const id = `q_${gameType}_l${level}_s${stageNumber}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Generate math challenge tailored to Level (1–5) and Difficulty (easy, intermediate, advanced)
  const mathData = generateLevelMathData(level, difficulty, stageNumber);

  // Generate game-specific visual payload
  const visualPayload = buildVisualPayloadForGame(gameType, mathData, difficulty, stageNumber);

  return {
    id,
    stageNumber,
    difficulty,
    prompt: mathData.prompt,
    visualPayload,
    options: mathData.options,
    correctAnswer: mathData.correctAnswer,
    hints: mathData.hints,
    explanation: mathData.explanation,
    timeLimitSeconds: difficulty === 'advanced' ? 30 : difficulty === 'intermediate' ? 45 : undefined,
  };
}

interface MathProblemData {
  prompt: string;
  correctAnswer: string | number;
  options: (string | number)[];
  hints: [string, string, string];
  explanation: string;
  extra?: any;
}

function generateLevelMathData(
  level: number,
  diff: StageDifficultyCategory,
  stage: number
): MathProblemData {
  switch (level) {
    case 1:
      return generateLevel1Data(diff, stage);
    case 2:
      return generateLevel2Data(diff, stage);
    case 3:
      return generateLevel3Data(diff, stage);
    case 4:
      return generateLevel4Data(diff, stage);
    case 5:
      return generateLevel5Data(diff, stage);
    default:
      return generateLevel1Data(diff, stage);
  }
}

// -------------------------------------------------------------
// LEVEL 1: 3-Number Operations, Counting, and Bonds to 10/20
// -------------------------------------------------------------
// LEVEL 1: Creative 3-Number 2-Digit Operations & Friendly Tens
// -------------------------------------------------------------
function generateLevel1Data(diff: StageDifficultyCategory, stage: number): MathProblemData {
  if (diff === 'easy') {
    // 3-number creative 2-digit addition with friendly tens
    const pair1 = randomChoice([14, 16, 18, 22, 24, 25, 26, 32, 35, 42]);
    const pair2 = pair1 % 10 === 5 ? 25 : (pair1 % 10 === 2 ? 28 : (pair1 % 10 === 8 ? 22 : (pair1 % 10 === 4 ? 26 : (pair1 % 10 === 6 ? 24 : 15))));
    const c = randomInt(15, 38);
    const sum = pair1 + pair2 + c;
    return {
      prompt: `Calculate: ${pair1} + ${pair2} + ${c}`,
      correctAnswer: sum,
      options: shuffleArray([sum, sum + 10, Math.max(10, sum - 10), sum + 2]),
      hints: [
        `Spot the friendly ten pair first: ${pair1} + ${pair2} = ${pair1 + pair2}.`,
        `Then add the third number: ${pair1 + pair2} + ${c} = ${sum}.`,
        `${pair1} + ${pair2} + ${c} = ${sum}.`
      ],
      explanation: `${pair1} + ${pair2} + ${c} = (${pair1} + ${pair2}) + ${c} = ${pair1 + pair2} + ${c} = ${sum}.`,
      extra: { visualCount: sum }
    };
  }

  if (diff === 'intermediate') {
    // 3-number mixed 2-digit addition & subtraction with friendly numbers
    const a = randomChoice([35, 45, 55, 65, 75, 80]);
    const b = randomChoice([25, 35, 28, 32, 22, 30]);
    const c = randomInt(15, Math.min(38, a + b - 15));
    const ans = a + b - c;
    return {
      prompt: `Compute: ${a} + ${b} - ${c}`,
      correctAnswer: ans,
      options: shuffleArray([ans, ans + 10, Math.max(5, ans - 5), ans + 8]),
      hints: [
        `Step 1: Add the first two numbers: ${a} + ${b} = ${a + b}.`,
        `Step 2: Take away ${c} from ${a + b}.`,
        `${a} + ${b} - ${c} = ${ans}.`
      ],
      explanation: `${a} + ${b} - ${c} = ${a + b} - ${c} = ${ans}.`,
      extra: { bondTarget: 50, given: a }
    };
  }

  // Advanced: 3-number consecutive subtraction with friendly benchmarks
  const total = randomChoice([75, 85, 95, 100, 110, 120]);
  const s1 = randomChoice([25, 35, 40, 45, 30]);
  const s2 = randomChoice([15, 20, 25, 18, 22]);
  const ans = total - s1 - s2;
  return {
    prompt: `Solve: ${total} - ${s1} - ${s2}`,
    correctAnswer: ans,
    options: shuffleArray([ans, ans + 10, Math.max(5, ans - 10), ans + 5]),
    hints: [
      `Take away ${s1} first: ${total} - ${s1} = ${total - s1}.`,
      `Now take away ${s2}: ${total - s1} - ${s2} = ${ans}.`,
      `${total} - ${s1} - ${s2} = ${ans}.`
    ],
    explanation: `${total} - ${s1} - ${s2} = ${total - s1} - ${s2} = ${ans}.`
  };
}

// -------------------------------------------------------------
// LEVEL 2: 3-Number & 4-Number Operations, Grouping, and Arrays
// -------------------------------------------------------------
function generateLevel2Data(diff: StageDifficultyCategory, stage: number): MathProblemData {
  if (diff === 'easy') {
    // 3-number 2-digit addition with friendly tens
    const a = randomInt(18, 42);
    const b = randomInt(15, 38);
    const c = randomInt(12, 30);
    const sum = a + b + c;
    return {
      prompt: `Calculate: ${a} + ${b} + ${c}`,
      correctAnswer: sum,
      options: shuffleArray([sum, sum + 10, Math.max(5, sum - 10), sum + 2]),
      hints: [
        `Group friendly numbers: ${a} + ${b} = ${a + b}.`,
        `Now add the third number: ${a + b} + ${c} = ${sum}.`,
        `The sum equals ${sum}.`
      ],
      explanation: `${a} + ${b} + ${c} = ${a + b} + ${c} = ${sum}.`
    };
  }

  if (diff === 'intermediate') {
    // 4-number addition & subtraction chain
    const a = randomInt(30, 65);
    const b = randomInt(20, 45);
    const c = randomInt(15, 30);
    const d = randomInt(12, 35);
    const ans = a + b - c + d;
    return {
      prompt: `Evaluate: ${a} + ${b} - ${c} + ${d}`,
      correctAnswer: ans,
      options: shuffleArray([ans, ans + 10, ans - 5, ans + 4]),
      hints: [
        `Evaluate from left to right: ${a} + ${b} = ${a + b}.`,
        `Then: ${a + b} - ${c} = ${a + b - c}.`,
        `Finally add ${d}: ${a + b - c} + ${d} = ${ans}.`
      ],
      explanation: `${a} + ${b} - ${c} + ${d} = ${ans}.`
    };
  }

  // Advanced: Multiplication + 2-digit Addition (pre-BODMAS)
  const a = randomChoice([6, 7, 8, 9, 12]);
  const b = randomChoice([4, 6, 7, 8, 9, 11]);
  const c = randomInt(18, 55);
  const ans = a * b + c;
  return {
    prompt: `Compute: ${a} × ${b} + ${c}`,
    correctAnswer: ans,
    options: shuffleArray([ans, a * (b + c), ans + 10, ans - 5]),
    hints: [
      `Multiply first before adding: ${a} × ${b} = ${a * b}.`,
      `Then add ${c}: ${a * b} + ${c} = ${ans}.`,
      `Total = ${ans}.`
    ],
    explanation: `${a} × ${b} + ${c} = ${a * b} + ${c} = ${ans}. Multiplication takes priority over addition.`
  };
}

// -------------------------------------------------------------
// LEVEL 3: BODMAS Foundations: Multiplications, Divisions, and Brackets
// -------------------------------------------------------------
function generateLevel3Data(diff: StageDifficultyCategory, stage: number): MathProblemData {
  const challenge = generateBodmasChallenge(3, diff === 'easy' ? 1 : diff === 'intermediate' ? 2 : 3);
  return {
    prompt: `Solve (BODMAS): ${challenge.expression}`,
    correctAnswer: challenge.answer,
    options: challenge.distractors,
    hints: challenge.hints,
    explanation: challenge.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 4: 4-Number Operations, Compound Brackets, and Multi-Step BODMAS
// -------------------------------------------------------------
function generateLevel4Data(diff: StageDifficultyCategory, stage: number): MathProblemData {
  const challenge = generateBodmasChallenge(4, diff === 'easy' ? 1 : diff === 'intermediate' ? 2 : 3);
  return {
    prompt: `Calculate (BODMAS): ${challenge.expression}`,
    correctAnswer: challenge.answer,
    options: challenge.distractors,
    hints: challenge.hints,
    explanation: challenge.explanation,
  };
}

// -------------------------------------------------------------
// LEVEL 5: Advanced BODMAS: Powers, Nested Brackets, and Complex Chains
// -------------------------------------------------------------
function generateLevel5Data(diff: StageDifficultyCategory, stage: number): MathProblemData {
  const challenge = generateBodmasChallenge(5, diff === 'easy' ? 1 : diff === 'intermediate' ? 2 : 3);
  return {
    prompt: `Evaluate (BODMAS): ${challenge.expression}`,
    correctAnswer: challenge.answer,
    options: challenge.distractors,
    hints: challenge.hints,
    explanation: challenge.explanation,
  };
}

// -------------------------------------------------------------
// Visual Payload Generator per Game Type
// -------------------------------------------------------------
function buildVisualPayloadForGame(
  gameType: GuiGameType,
  mathData: MathProblemData,
  diff: StageDifficultyCategory,
  stage: number
): any {
  switch (gameType) {
    case 'tug_of_war':
      return {
        ropePosition: 50, // center 50%
        playerTeam: 'Red Falcons',
        aiTeam: 'Blue Titans',
        pullDistance: diff === 'easy' ? 12 : 8,
      };

    case 'rocket_launch':
      return {
        fuelLevel: Math.min(100, (stage % 5) * 20),
        altitudeKm: stage * 10,
        thrustPercentage: diff === 'easy' ? 60 : 85,
        targetPlanet: 'Mars Orbit',
      };

    case 'tower_builder':
      return {
        storiesBuilt: Math.min(15, stage),
        blockMaterial: diff === 'easy' ? 'Wood' : diff === 'intermediate' ? 'Stone' : 'Steel',
        balanceStability: 95,
      };

    case 'maze_escape':
      return {
        mazeDimension: diff === 'easy' ? '4x4' : '6x6',
        playerPosition: [0, 0],
        exitPosition: [3, 3],
        keysCollected: 1,
      };

    case 'treasure_hunt':
      return {
        mapRegion: 'Skeleton Bay',
        chestsRemaining: 3,
        compassHeading: 'North-East',
      };

    case 'number_ninja':
      return {
        fallingTargets: [mathData.correctAnswer, ...mathData.options.slice(0, 2)],
        sliceSpeed: diff === 'easy' ? 'Normal' : 'Fast',
      };

    case 'basketball':
      return {
        courtDistanceMeters: diff === 'easy' ? 4 : 7,
        hoopsCount: 3,
        swishBonus: 50,
      };

    case 'arithmetic_racing':
      return {
        currentLap: 1,
        totalLaps: 3,
        speedKmh: 120,
        trackPositionPercent: 35,
      };

    case 'balloon_pop':
      return {
        balloons: mathData.options.map((val, idx) => ({
          id: `b_${idx}`,
          value: val,
          color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][idx % 4],
        })),
      };

    case 'bridge_builder':
      return {
        bridgeSegments: 5,
        completedSegments: 2,
        chasmWidthMeters: 40,
      };

    case 'robot_factory':
      return {
        gridX: 2,
        gridY: 3,
        commandSequence: ['FORWARD', 'TURN_RIGHT', 'CALCULATE'],
      };

    case 'pizza_workshop':
      return {
        slicesTotal: 8,
        shadedSlices: 3,
        topping: 'Pepperoni & Olives',
      };

    case 'geometry_builder':
      return {
        targetShape: diff === 'easy' ? 'Triangle' : 'Trapezoid',
        piecesAvailable: 4,
      };

    case 'number_line_adventure':
      return {
        lineMin: 0,
        lineMax: 20,
        currentCoord: 6,
        targetCoord: mathData.correctAnswer,
      };

    case 'math_memory':
      return {
        cardPairs: 4,
        flipsAllowed: 12,
      };

    case 'code_breaker':
      return {
        cipherPins: 3,
        pinsUnlocked: 1,
        vaultSecurityLevel: diff,
      };

    case 'factory_conveyor':
      return {
        conveyorSpeed: diff === 'easy' ? 1 : 2,
        bins: ['Bin A', 'Bin B', 'Bin C'],
      };

    case 'target_number':
      return {
        targetTotal: mathData.correctAnswer,
        availableTiles: [2, 3, 5, 10],
      };

    case 'logic_grid':
      return {
        cluesCount: 3,
        gridSize: '3x3',
      };

    case 'ultimate_arena':
      return {
        bossHp: 500,
        playerShield: 100,
        arenaPhase: 1,
      };

    default:
      return {};
  }
}
