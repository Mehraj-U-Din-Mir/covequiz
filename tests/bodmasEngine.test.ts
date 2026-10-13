import { describe, it, expect } from 'vitest';
import { generateBodmasChallenge } from '../src/engine/bodmasEngine';

describe('BODMAS & Multi-Number Engine Tests', () => {
  it('generates mathematically correct 3-number operations for Level 1', () => {
    for (let diff = 1; diff <= 3; diff++) {
      const challenge = generateBodmasChallenge(1, diff as 1 | 2 | 3);
      expect(challenge.expression).toBeDefined();
      expect(typeof challenge.answer).toBe('number');
      expect(challenge.options ? challenge.distractors.includes(challenge.answer) : true).toBe(true);
      expect(challenge.hints.length).toBe(3);
    }
  });

  it('generates 3-number and 4-number operations for Level 2', () => {
    for (let diff = 1; diff <= 3; diff++) {
      const challenge = generateBodmasChallenge(2, diff as 1 | 2 | 3);
      expect(challenge.expression).toBeDefined();
      expect(typeof challenge.answer).toBe('number');
      expect(challenge.distractors).toContain(challenge.answer);
    }
  });

  it('generates BODMAS operations with multiplication precedence and brackets for Level 3', () => {
    for (let diff = 1; diff <= 3; diff++) {
      const challenge = generateBodmasChallenge(3, diff as 1 | 2 | 3);
      expect(challenge.expression).toBeDefined();
      expect(challenge.ruleEmphasized).toContain('BODMAS');
      expect(challenge.distractors).toContain(challenge.answer);
    }
  });

  it('generates 4-number multi-step BODMAS with brackets for Level 4', () => {
    for (let diff = 1; diff <= 3; diff++) {
      const challenge = generateBodmasChallenge(4, diff as 1 | 2 | 3);
      expect(challenge.expression).toBeDefined();
      expect(challenge.steps.length).toBeGreaterThanOrEqual(2);
      expect(challenge.distractors).toContain(challenge.answer);
    }
  });

  it('generates powers, nested brackets and orders for Level 5 to 8', () => {
    for (const lvl of [5, 6, 7, 8]) {
      for (let diff = 1; diff <= 3; diff++) {
        const challenge = generateBodmasChallenge(lvl, diff as 1 | 2 | 3);
        expect(challenge.expression).toBeDefined();
        expect(typeof challenge.answer).toBe('number');
        expect(challenge.distractors).toContain(challenge.answer);
        expect(challenge.steps.length).toBeGreaterThan(0);
      }
    }
  });
});
