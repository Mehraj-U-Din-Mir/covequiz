import { StageDifficultyCategory } from '../types/guiGame';

export interface DifficultyDistribution {
  easyCount: number;
  intermediateCount: number;
  advancedCount: number;
  sequence: StageDifficultyCategory[];
}

/**
 * Calculates a deterministic difficulty distribution across requested question count.
 * Complies with the Master Prompt specification:
 * - 5 questions: 2 Easy, 2 Intermediate, 1 Advanced
 * - 10 questions: 3 Easy, 4 Intermediate, 3 Advanced
 * - 15 questions: 5 Easy, 6 Intermediate, 4 Advanced
 * General formula: ~30% Easy, ~40% Intermediate, ~30% Advanced
 */
export function calculateDifficultyDistribution(count: number): DifficultyDistribution {
  const safeCount = Math.max(3, Math.min(100, Math.round(count) || 10));

  let easyCount: number;
  let intermediateCount: number;
  let advancedCount: number;

  if (safeCount === 5) {
    easyCount = 2;
    intermediateCount = 2;
    advancedCount = 1;
  } else if (safeCount === 10) {
    easyCount = 3;
    intermediateCount = 4;
    advancedCount = 3;
  } else if (safeCount === 15) {
    easyCount = 5;
    intermediateCount = 6;
    advancedCount = 4;
  } else {
    easyCount = Math.round(safeCount * 0.3);
    intermediateCount = Math.round(safeCount * 0.4);
    advancedCount = safeCount - easyCount - intermediateCount;

    // Safety checks ensuring all categories have at least 1 when safeCount >= 3
    if (advancedCount < 1) {
      if (intermediateCount > 1) {
        intermediateCount -= 1;
        advancedCount += 1;
      } else if (easyCount > 1) {
        easyCount -= 1;
        advancedCount += 1;
      }
    }
  }

  // Construct sequential progression array (Easy -> Intermediate -> Advanced)
  const sequence: StageDifficultyCategory[] = [
    ...Array(easyCount).fill('easy'),
    ...Array(intermediateCount).fill('intermediate'),
    ...Array(advancedCount).fill('advanced'),
  ];

  return {
    easyCount,
    intermediateCount,
    advancedCount,
    sequence,
  };
}

export function getDifficultyForQuestionIndex(
  questionIndexZeroBased: number,
  totalCount: number
): StageDifficultyCategory {
  const distribution = calculateDifficultyDistribution(totalCount);
  return distribution.sequence[questionIndexZeroBased] || 'intermediate';
}
