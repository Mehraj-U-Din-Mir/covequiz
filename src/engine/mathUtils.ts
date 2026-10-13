// Mathematical Utilities for Exact Arithmetic, Fractions, Primes, and Calculations

export class Fraction {
  numerator: number;
  denominator: number;

  constructor(num: number, den: number = 1) {
    if (den === 0) throw new Error('Denominator cannot be zero');
    if (den < 0) {
      num = -num;
      den = -den;
    }
    const common = gcd(Math.abs(num), Math.abs(den));
    this.numerator = num / common;
    this.denominator = den / common;
  }

  add(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  subtract(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  multiply(other: Fraction): Fraction {
    return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  divide(other: Fraction): Fraction {
    if (other.numerator === 0) throw new Error('Division by zero');
    return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator);
  }

  toString(): string {
    if (this.denominator === 1) return `${this.numerator}`;
    return `${this.numerator}/${this.denominator}`;
  }

  toMixedString(): string {
    if (this.denominator === 1) return `${this.numerator}`;
    const whole = Math.floor(Math.abs(this.numerator) / this.denominator);
    const rem = Math.abs(this.numerator) % this.denominator;
    const sign = this.numerator < 0 ? '-' : '';
    if (whole === 0) return `${sign}${rem}/${this.denominator}`;
    if (rem === 0) return `${sign}${whole}`;
    return `${sign}${whole} ${rem}/${this.denominator}`;
  }

  toNumber(): number {
    return this.numerator / this.denominator;
  }
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function getFactors(n: number): number[] {
  const factors: number[] = [];
  n = Math.abs(n);
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i * i !== n) factors.push(n / i);
    }
  }
  return factors.sort((a, b) => a - b);
}

export function getPrimeFactors(n: number): number[] {
  const primes: number[] = [];
  let d = 2;
  while (n > 1) {
    while (n % d === 0) {
      primes.push(d);
      n /= d;
    }
    d++;
    if (d * d > n) {
      if (n > 1) primes.push(n);
      break;
    }
  }
  return primes;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function formatNumberWithCommas(n: number): string {
  return n.toLocaleString('en-IN');
}

export function roundToDecimals(n: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}
