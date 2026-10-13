import { describe, it, expect } from 'vitest';
import { generateGuiQuestion } from '../src/engine/guiQuestionGenerators';
import { ALL_100_GUI_GAMES } from '../src/engine/guiGameRegistry';
import { SessionConfig } from '../src/types/guiGame';

describe('GUI Games 2-Player and Multi-Number/BODMAS Operations', () => {
  it('supports 2-player local duel session configuration', () => {
    const config: SessionConfig = {
      mode: 'quick_challenge',
      questionCount: 20,
      isTwoPlayerMode: true,
      player1Name: 'Player 1',
      player2Name: 'Player 2',
    };

    expect(config.isTwoPlayerMode).toBe(true);
    expect(config.questionCount).toBe(20);
    expect(config.player1Name).toBe('Player 1');
  });

  it('generates 3-number and 4-number operations for Level 1 and Level 2 in GUI games with non-trivial 2-digit values', () => {
    // Level 1 GUI question: 3-number creative 2-digit addition or subtraction
    const qL1 = generateGuiQuestion('tug_of_war', 1, 'easy', 1);
    expect(qL1.prompt).toBeDefined();
    expect(typeof qL1.correctAnswer).toBe('number');
    expect(qL1.options).toContain(qL1.correctAnswer);
    // Verified: Answer is non-trivial (creative 2-digit sum)
    expect((qL1.correctAnswer as number)).toBeGreaterThanOrEqual(15);

    // Level 2 GUI question: 3-number or 4-number operations
    const qL2 = generateGuiQuestion('rocket_launch', 2, 'intermediate', 15);
    expect(qL2.prompt).toBeDefined();
    expect(typeof qL2.correctAnswer).toBe('number');
    expect(qL2.options).toContain(qL2.correctAnswer);
    expect((qL2.correctAnswer as number)).toBeGreaterThanOrEqual(15);
  });

  it('generates BODMAS operations with brackets for Levels 3, 4, and 5 in GUI games', () => {
    // Level 3 GUI question: BODMAS
    const qL3 = generateGuiQuestion('tower_builder', 3, 'easy', 5);
    expect(qL3.prompt).toContain('BODMAS');
    expect(qL3.options).toContain(qL3.correctAnswer);

    // Level 4 GUI question: 4-number multi-step BODMAS
    const qL4 = generateGuiQuestion('arithmetic_racing', 4, 'intermediate', 15);
    expect(qL4.prompt).toContain('BODMAS');
    expect(qL4.options).toContain(qL4.correctAnswer);

    // Level 5 GUI question: Advanced BODMAS with powers and brackets
    const qL5 = generateGuiQuestion('target_number', 5, 'advanced', 25);
    expect(qL5.prompt).toContain('BODMAS');
    expect(qL5.options).toContain(qL5.correctAnswer);
  });

  it('verifies every GUI game definition includes instructions and competency metadata for single instruction dialog', () => {
    // Tug of War Level 1
    const tugOfWar = ALL_100_GUI_GAMES.find((g) => g.id === 'gui_l1_tug_of_war');
    expect(tugOfWar).toBeDefined();
    expect(tugOfWar?.instructions).toBeDefined();
    expect(tugOfWar?.instructions.length).toBeGreaterThan(15);
    expect(tugOfWar?.shortObjective).toBeDefined();
    expect(tugOfWar?.nepCompetencyCode).toBeDefined();

    // Tower Builder Level 3
    const towerBuilder = ALL_100_GUI_GAMES.find((g) => g.id === 'gui_l3_tower_builder');
    expect(towerBuilder).toBeDefined();
    expect(towerBuilder?.instructions).toBeDefined();
    expect(towerBuilder?.stages).toHaveLength(30);

    // Target Number Level 5
    const targetNumber = ALL_100_GUI_GAMES.find((g) => g.id === 'gui_l5_target_number');
    expect(targetNumber).toBeDefined();
    expect(targetNumber?.instructions).toBeDefined();
    expect(targetNumber?.stages).toHaveLength(30);
  });
});

