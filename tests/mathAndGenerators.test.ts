import { describe, it, expect } from 'vitest';
import { Fraction, gcd, lcm, isPrime, getFactors } from '../src/engine/mathUtils';
import { generateQuestionForGame } from '../src/engine/questionGenerators';

describe('Mathematical Utilities and Exact Arithmetic', () => {
  it('correctly simplifies and adds fractions with exact rational arithmetic', () => {
    const f1 = new Fraction(1, 4);
    const f2 = new Fraction(1, 4);
    const sum = f1.add(f2);
    expect(sum.numerator).toBe(1);
    expect(sum.denominator).toBe(2);
    expect(sum.toString()).toBe('1/2');

    const f3 = new Fraction(2, 3);
    const f4 = new Fraction(3, 4);
    const sum2 = f3.add(f4);
    expect(sum2.toString()).toBe('17/12');
  });

  it('correctly handles fraction subtraction, multiplication, and division', () => {
    const f1 = new Fraction(3, 4);
    const f2 = new Fraction(1, 2);
    expect(f1.subtract(f2).toString()).toBe('1/4');
    expect(f1.multiply(f2).toString()).toBe('3/8');
    expect(f1.divide(f2).toString()).toBe('3/2');
  });

  it('computes GCD and LCM accurately', () => {
    expect(gcd(12, 18)).toBe(6);
    expect(gcd(17, 31)).toBe(1);
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(5, 7)).toBe(35);
  });

  it('identifies prime and composite numbers correctly', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(13)).toBe(true);
    expect(isPrime(27)).toBe(false);
    expect(isPrime(97)).toBe(true);
  });

  it('extracts all factors of composite numbers', () => {
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(getFactors(7)).toEqual([1, 7]);
  });
});

describe('Question Generators across all Levels', () => {
  it('generates valid questions with 3 hints and worked solution for sample games across all 8 levels', () => {
    const sampleGames = [
      'l1_g01', 'l1_g04', 'l1_g07', 'l1_g17',
      'l2_g01', 'l2_g03', 'l2_g11', 'l2_g12',
      'l3_g02', 'l3_g03', 'l3_g11',
      'l4_g02', 'l4_g07',
      'l5_g02', 'l5_g04',
      'l6_g02', 'l6_g09',
      'l7_g06', 'l7_g08',
      'l8_g03', 'l8_g05', 'l8_g07'
    ];

    for (const gId of sampleGames) {
      const q = generateQuestionForGame(gId, 1);
      expect(q.prompt).toBeTruthy();
      expect(q.correctAnswer).toBeDefined();
      expect(q.hints.length).toBe(3);
      expect(q.hints[0].length).toBeGreaterThan(5);
      expect(q.hints[1].length).toBeGreaterThan(5);
      expect(q.hints[2].length).toBeGreaterThan(5);
      expect(q.workedSolution.steps.length).toBeGreaterThanOrEqual(1);
      expect(q.explanation.length).toBeGreaterThan(5);
    }
  });
});
