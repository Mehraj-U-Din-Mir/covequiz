import { describe, it, expect } from 'vitest';
import { ALL_100_GUI_GAMES, getGuiGamesByLevel, GUI_GAME_TYPES } from '../src/engine/guiGameRegistry';
import { calculateDifficultyDistribution } from '../src/engine/questionCountDistributor';
import { generateGuiQuestion } from '../src/engine/guiQuestionGenerators';

describe('GUI Game Engine - 100 Games and 30-Stage Progression', () => {
  it('must contain exactly 100 distinct GUI game definitions', () => {
    expect(ALL_100_GUI_GAMES.length).toBe(100);

    const uniqueIds = new Set(ALL_100_GUI_GAMES.map((g) => g.id));
    expect(uniqueIds.size).toBe(100);
  });

  it('must contain exactly 20 distinct GUI games for each Level from 1 to 5', () => {
    for (let lvl = 1; lvl <= 5; lvl++) {
      const levelGames = getGuiGamesByLevel(lvl);
      expect(levelGames.length).toBe(20);

      // Verify all 20 unique game mechanics exist in each level
      const typesInLevel = new Set(levelGames.map((g) => g.gameType));
      expect(typesInLevel.size).toBe(20);
      for (const gType of GUI_GAME_TYPES) {
        expect(typesInLevel.has(gType)).toBe(true);
      }
    }
  });

  it('every game must have exactly 30 valid stages with correct difficulty classification', () => {
    for (const game of ALL_100_GUI_GAMES) {
      expect(game.stages.length).toBe(30);

      game.stages.forEach((stage, idx) => {
        expect(stage.stageNumber).toBe(idx + 1);

        // Stages 1–10: Easy
        if (stage.stageNumber <= 10) {
          expect(stage.difficultyCategory).toBe('easy');
        }
        // Stages 11–20: Intermediate
        else if (stage.stageNumber <= 20) {
          expect(stage.difficultyCategory).toBe('intermediate');
        }
        // Stages 21–30: Advanced
        else {
          expect(stage.difficultyCategory).toBe('advanced');
        }

        expect(stage.numberRange[0]).toBeLessThanOrEqual(stage.numberRange[1]);
        expect(stage.learningObjective.length).toBeGreaterThan(10);
      });
    }
  });
});

describe('Custom Question Count Distribution Specification', () => {
  it('a 10-question session must contain exactly 3 Easy, 4 Intermediate, and 3 Advanced questions', () => {
    const dist10 = calculateDifficultyDistribution(10);
    expect(dist10.easyCount).toBe(3);
    expect(dist10.intermediateCount).toBe(4);
    expect(dist10.advancedCount).toBe(3);
    expect(dist10.sequence.length).toBe(10);
    expect(dist10.sequence.slice(0, 3)).toEqual(['easy', 'easy', 'easy']);
    expect(dist10.sequence.slice(3, 7)).toEqual(['intermediate', 'intermediate', 'intermediate', 'intermediate']);
    expect(dist10.sequence.slice(7, 10)).toEqual(['advanced', 'advanced', 'advanced']);
  });

  it('a 5-question session must contain exactly 2 Easy, 2 Intermediate, and 1 Advanced question', () => {
    const dist5 = calculateDifficultyDistribution(5);
    expect(dist5.easyCount).toBe(2);
    expect(dist5.intermediateCount).toBe(2);
    expect(dist5.advancedCount).toBe(1);
    expect(dist5.sequence.length).toBe(5);
    expect(dist5.sequence).toEqual(['easy', 'easy', 'intermediate', 'intermediate', 'advanced']);
  });

  it('a 15-question session must contain exactly 5 Easy, 6 Intermediate, and 4 Advanced questions', () => {
    const dist15 = calculateDifficultyDistribution(15);
    expect(dist15.easyCount).toBe(5);
    expect(dist15.intermediateCount).toBe(6);
    expect(dist15.advancedCount).toBe(4);
    expect(dist15.sequence.length).toBe(15);
  });

  it('respects arbitrary custom question counts and sums up to the requested count', () => {
    for (const count of [3, 7, 12, 20, 25, 30]) {
      const dist = calculateDifficultyDistribution(count);
      expect(dist.easyCount + dist.intermediateCount + dist.advancedCount).toBe(count);
      expect(dist.sequence.length).toBe(count);
    }
  });
});

describe('GUI Question Generators and Answer Validation', () => {
  it('generates valid mathematical questions with 3-tier hints for all 20 game types across Levels 1–5', () => {
    for (let lvl = 1; lvl <= 5; lvl++) {
      for (const gType of GUI_GAME_TYPES) {
        const qEasy = generateGuiQuestion(gType, lvl, 'easy', 2);
        expect(qEasy.prompt).toBeTruthy();
        expect(qEasy.options.length).toBeGreaterThanOrEqual(2);
        expect(qEasy.options).toContain(qEasy.correctAnswer);
        expect(qEasy.hints.length).toBe(3);
        expect(qEasy.hints[0].length).toBeGreaterThan(5);
        expect(qEasy.explanation.length).toBeGreaterThan(5);

        const qAdv = generateGuiQuestion(gType, lvl, 'advanced', 25);
        expect(qAdv.prompt).toBeTruthy();
        expect(qAdv.options).toContain(qAdv.correctAnswer);
      }
    }
  });
});
