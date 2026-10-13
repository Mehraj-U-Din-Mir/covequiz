import { describe, it, expect } from 'vitest';
import { calculateDifficultyDistribution } from '../src/engine/questionCountDistributor';

describe('Question Count Distribution Presets (10, 15, 20, 25, 30, 35, 40, 45, 50)', () => {
  const presets = [10, 15, 20, 25, 30, 35, 40, 45, 50];

  it('guarantees that every preset has exactly the requested total questions', () => {
    presets.forEach((count) => {
      const dist = calculateDifficultyDistribution(count);
      const total = dist.easyCount + dist.intermediateCount + dist.advancedCount;
      expect(total).toBe(count);
      expect(dist.easyCount).toBeGreaterThan(0);
      expect(dist.intermediateCount).toBeGreaterThan(0);
      expect(dist.advancedCount).toBeGreaterThan(0);
    });
  });

  it('follows the mandatory 30% Easy, 40% Intermediate, 30% Advanced distribution', () => {
    // 10 questions: 3 Easy, 4 Intermediate, 3 Advanced
    const dist10 = calculateDifficultyDistribution(10);
    expect(dist10.easyCount).toBe(3);
    expect(dist10.intermediateCount).toBe(4);
    expect(dist10.advancedCount).toBe(3);

    // 15 questions: 5 Easy, 6 Intermediate, 4 Advanced
    const dist15 = calculateDifficultyDistribution(15);
    expect(dist15.easyCount).toBe(5);
    expect(dist15.intermediateCount).toBe(6);
    expect(dist15.advancedCount).toBe(4);

    // 20 questions: 6 Easy, 8 Intermediate, 6 Advanced
    const dist20 = calculateDifficultyDistribution(20);
    expect(dist20.easyCount).toBe(6);
    expect(dist20.intermediateCount).toBe(8);
    expect(dist20.advancedCount).toBe(6);

    // 50 questions: 15 Easy, 20 Intermediate, 15 Advanced
    const dist50 = calculateDifficultyDistribution(50);
    expect(dist50.easyCount).toBe(15);
    expect(dist50.intermediateCount).toBe(20);
    expect(dist50.advancedCount).toBe(15);
  });
});
