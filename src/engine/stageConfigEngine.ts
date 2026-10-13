import { GuiGameStageConfig, StageDifficultyCategory, GuiGameType } from '../types/guiGame';

export function generate30StagesForGame(
  gameType: GuiGameType,
  level: number
): GuiGameStageConfig[] {
  const stages: GuiGameStageConfig[] = [];

  for (let s = 1; s <= 30; s++) {
    const difficultyCategory: StageDifficultyCategory =
      s <= 10 ? 'easy' : s <= 20 ? 'intermediate' : 'advanced';

    const stageMultiplier =
      difficultyCategory === 'easy' ? 1.0 : difficultyCategory === 'intermediate' ? 1.5 : 2.0;

    // Number ranges tailored specifically for Levels 1–5
    const numberRange = calculateStageNumberRange(level, s, difficultyCategory);
    const operations = calculateStageOperations(level, s, difficultyCategory);
    const displayName = getStageDisplayName(gameType, s, difficultyCategory);
    const learningObjective = getStageLearningObjective(gameType, level, s, difficultyCategory);

    stages.push({
      stageNumber: s,
      displayName,
      difficultyCategory,
      learningObjective,
      numberRange,
      operations,
      constraints: {
        distractorCount: difficultyCategory === 'easy' ? 3 : 4,
        allowNegative: level >= 6, // Negative numbers not in Levels 1-5
        multiStep: s >= 18,
        visualAids: s <= 10,
      },
      passThreshold: 80,
      timeLimitSeconds: s > 15 ? 45 : undefined,
      scoringMultiplier: stageMultiplier,
    });
  }

  return stages;
}

function calculateStageNumberRange(
  level: number,
  stage: number,
  diff: StageDifficultyCategory
): [number, number] {
  switch (level) {
    case 1:
      // Level 1: Counting, 1-to-1, up to 10 and 20
      if (diff === 'easy') return [1, 5 + Math.floor(stage / 2)];
      if (diff === 'intermediate') return [2, 10 + Math.floor((stage - 10) / 2)];
      return [5, 20];

    case 2:
      // Level 2: Place value, 2-digit numbers up to 100
      if (diff === 'easy') return [1, 25 + stage * 2];
      if (diff === 'intermediate') return [10, 50 + (stage - 10) * 3];
      return [20, 100];

    case 3:
      // Level 3: 3-digit operations, multiplication 2-10, division remainders
      if (diff === 'easy') return [5, 100 + stage * 10];
      if (diff === 'intermediate') return [20, 300 + (stage - 10) * 20];
      return [100, 1000];

    case 4:
      // Level 4: 4-digit operations, factors, fractions, decimals
      if (diff === 'easy') return [10, 500 + stage * 50];
      if (diff === 'intermediate') return [50, 2000 + (stage - 10) * 100];
      return [200, 9999];

    case 5:
      // Level 5: Large numbers, primes, unlike fractions, percentages, ratios
      if (diff === 'easy') return [20, 1000 + stage * 200];
      if (diff === 'intermediate') return [100, 10000 + (stage - 10) * 1000];
      return [500, 100000];

    default:
      return [1, 50];
  }
}

function calculateStageOperations(
  level: number,
  stage: number,
  diff: StageDifficultyCategory
): string[] {
  if (level === 1) {
    if (stage <= 5) return ['count'];
    if (stage <= 15) return ['+'];
    return ['+', '-'];
  }

  if (level === 2) {
    if (stage <= 8) return ['+'];
    if (stage <= 16) return ['+', '-'];
    if (stage <= 24) return ['+', '-', '*'];
    return ['+', '-', '*', 'sharing'];
  }

  if (level === 3) {
    if (stage <= 6) return ['*'];
    if (stage <= 14) return ['*', '/'];
    if (stage <= 22) return ['+', '-', '*', '/'];
    return ['*', '/', 'remainder'];
  }

  if (level === 4) {
    if (stage <= 8) return ['multi_digit', '*'];
    if (stage <= 16) return ['factors', 'fractions'];
    return ['multi_digit', 'decimals', 'angles'];
  }

  // Level 5
  if (stage <= 8) return ['primes', 'factors'];
  if (stage <= 16) return ['unlike_fractions', 'decimals'];
  return ['percentages', 'ratios', 'volume'];
}

function getStageDisplayName(
  gameType: GuiGameType,
  stage: number,
  diff: StageDifficultyCategory
): string {
  const prefix = diff === 'easy' ? 'Foundation' : diff === 'intermediate' ? 'Mastery' : 'Grand Challenge';
  return `Stage ${stage}: ${prefix} Tier`;
}

function getStageLearningObjective(
  gameType: GuiGameType,
  level: number,
  stage: number,
  diff: StageDifficultyCategory
): string {
  return `Stage ${stage} develops Level ${level} mathematical fluency and reasoning under ${diff} constraints.`;
}
