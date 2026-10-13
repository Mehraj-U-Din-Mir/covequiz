import { describe, it, expect } from 'vitest';
import { ALL_GAMES, getGamesByLevel } from '../src/data/gamesRegistry';
import { LEVEL_SUMMARIES, CURRICULUM_COMPETENCIES } from '../src/data/curriculumData';

describe('Curriculum and Game Coverage Verification', () => {
  it('must contain exactly 160 published games overall', () => {
    expect(ALL_GAMES.length).toBe(160);
  });

  it('must contain exactly 20 published games for every level from 1 to 8', () => {
    for (let lvl = 1; lvl <= 8; lvl++) {
      const levelGames = getGamesByLevel(lvl);
      expect(levelGames.length).toBe(20);
    }
  });

  it('each game must have valid NEP competency, title, and learning objective', () => {
    const seenIds = new Set<string>();

    for (const game of ALL_GAMES) {
      expect(game.id).toBeTruthy();
      expect(seenIds.has(game.id)).toBe(false);
      seenIds.add(game.id);

      expect(game.title).toBeTruthy();
      expect(game.level).toBeGreaterThanOrEqual(1);
      expect(game.level).toBeLessThanOrEqual(8);
      expect(game.domain).toBeTruthy();
      expect(game.learningObjective.length).toBeGreaterThan(10);
      expect(game.rules.length).toBeGreaterThan(10);
      expect(game.nepCompetencyCode).toMatch(/^NEP-L[1-8]-/);
      expect(game.nepCompetencyDescription.length).toBeGreaterThan(5);
    }
  });

  it('verifies all 8 levels are represented in curriculum summaries', () => {
    expect(LEVEL_SUMMARIES.length).toBe(8);
    for (let i = 0; i < 8; i++) {
      expect(LEVEL_SUMMARIES[i].level).toBe(i + 1);
      expect(LEVEL_SUMMARIES[i].totalGames).toBe(20);
    }
  });
});
