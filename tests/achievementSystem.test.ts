import { describe, it, expect } from 'vitest';
import { evaluateQuizBadges, processBadgeAwards } from '../src/engine/badgeEvaluator';
import { QuizSessionResult, EarnedBadgeRecord } from '../src/types/achievement';

describe('Achievement Badge System Tests', () => {
  const baseResult: QuizSessionResult = {
    gameId: 'l3_g02',
    gameTitle: 'Times Table Speedway',
    level: 3,
    totalQuestions: 10,
    attemptedQuestions: 10,
    correctAnswers: 9,
    accuracyPercent: 90,
    hasIntermediate: true,
    hasAdvanced: true,
    completed: true,
    timestamp: '2026-10-09T22:00:00.000Z',
  };

  it('awards Calculation Champion when scoring at least 90% correct answers', () => {
    // 90% accuracy without advanced/intermediate
    const res: QuizSessionResult = {
      ...baseResult,
      correctAnswers: 9,
      accuracyPercent: 90,
      hasIntermediate: false,
      hasAdvanced: false,
    };

    const badges = evaluateQuizBadges(res);
    expect(badges.map((b) => b.id)).toContain('calculation_champion');
    expect(badges.map((b) => b.id)).not.toContain('master_mind');
    expect(badges.map((b) => b.id)).not.toContain('math_legend');
  });

  it('awards Master Mind when scoring at least 80% on a quiz containing Intermediate and Advanced questions', () => {
    const res: QuizSessionResult = {
      ...baseResult,
      correctAnswers: 8,
      accuracyPercent: 80,
      hasIntermediate: true,
      hasAdvanced: true,
    };

    const badges = evaluateQuizBadges(res);
    expect(badges.map((b) => b.id)).toContain('master_mind');
    expect(badges.map((b) => b.id)).not.toContain('calculation_champion'); // only 80%
    expect(badges.map((b) => b.id)).not.toContain('math_legend');
  });

  it('does NOT award Master Mind if Intermediate questions are missing', () => {
    const res: QuizSessionResult = {
      ...baseResult,
      accuracyPercent: 85,
      hasIntermediate: false,
      hasAdvanced: true,
    };

    const badges = evaluateQuizBadges(res);
    expect(badges.map((b) => b.id)).not.toContain('master_mind');
  });

  it('does NOT award Master Mind if Advanced questions are missing', () => {
    const res: QuizSessionResult = {
      ...baseResult,
      accuracyPercent: 85,
      hasIntermediate: true,
      hasAdvanced: false,
    };

    const badges = evaluateQuizBadges(res);
    expect(badges.map((b) => b.id)).not.toContain('master_mind');
  });

  it('awards Math Legend when scoring 100% on a completed quiz including Advanced questions', () => {
    const res: QuizSessionResult = {
      ...baseResult,
      correctAnswers: 10,
      accuracyPercent: 100,
      hasIntermediate: false,
      hasAdvanced: true,
    };

    const badges = evaluateQuizBadges(res);
    expect(badges.map((b) => b.id)).toContain('math_legend');
    // Also 100% >= 90%, so Calculation Champion is also unlocked independently!
    expect(badges.map((b) => b.id)).toContain('calculation_champion');
  });

  it('evaluates each badge independently and awards all 3 badges when all conditions are satisfied', () => {
    // 100% on a quiz with both Intermediate and Advanced questions
    const res: QuizSessionResult = {
      ...baseResult,
      correctAnswers: 10,
      accuracyPercent: 100,
      hasIntermediate: true,
      hasAdvanced: true,
    };

    const badges = evaluateQuizBadges(res);
    expect(badges.length).toBe(3);
    const ids = badges.map((b) => b.id);
    expect(ids).toContain('calculation_champion');
    expect(ids).toContain('master_mind');
    expect(ids).toContain('math_legend');
  });

  it('never awards badges solely for opening or attempting a quiz without completing', () => {
    // Incomplete quiz
    const incompleteRes: QuizSessionResult = {
      ...baseResult,
      completed: false,
      attemptedQuestions: 2,
    };
    expect(evaluateQuizBadges(incompleteRes)).toEqual([]);

    // 0 correct answers
    const zeroCorrect: QuizSessionResult = {
      ...baseResult,
      correctAnswers: 0,
      accuracyPercent: 0,
    };
    expect(evaluateQuizBadges(zeroCorrect)).toEqual([]);

    // Too few questions (< 3)
    const tooFew: QuizSessionResult = {
      ...baseResult,
      totalQuestions: 2,
      attemptedQuestions: 2,
    };
    expect(evaluateQuizBadges(tooFew)).toEqual([]);
  });

  it('prevents duplicate awards for the same achievement event and student profile', () => {
    const studentId = 'player_abc123';
    const res: QuizSessionResult = {
      ...baseResult,
      correctAnswers: 10,
      accuracyPercent: 100,
      hasIntermediate: true,
      hasAdvanced: true,
    };

    // First completion awards all 3
    const firstRun = processBadgeAwards(studentId, res, []);
    expect(firstRun.newlyEarned.length).toBe(3);

    // Second run with the same event awards 0 duplicates
    const secondRun = processBadgeAwards(studentId, res, firstRun.allBadges);
    expect(secondRun.newlyEarned.length).toBe(0);
    expect(secondRun.allBadges.length).toBe(3);
  });

  it('marks newly earned badges as device local (isSynced: false) before cloud sync', () => {
    const studentId = 'player_abc123';
    const res: QuizSessionResult = {
      ...baseResult,
      correctAnswers: 9,
      accuracyPercent: 90,
      hasIntermediate: false,
      hasAdvanced: false,
    };

    const { newlyEarned } = processBadgeAwards(studentId, res, []);
    expect(newlyEarned.length).toBe(1);
    expect(newlyEarned[0].isSynced).toBe(false);
  });
});
