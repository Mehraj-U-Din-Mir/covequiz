export interface AvatarOption {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'cheetah', emoji: '🐆', name: 'Speed Cheetah', color: '#f59e0b' },
  { id: 'owl', emoji: '🦉', name: 'Wise Owl', color: '#6366f1' },
  { id: 'fox', emoji: '🦊', name: 'Clever Fox', color: '#ef4444' },
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Cosmic Explorer', color: '#06b6d4' },
  { id: 'robot', emoji: '🤖', name: 'Calculo Bot', color: '#10b981' },
  { id: 'wizard', emoji: '🧙‍♂️', name: 'Math Sorcerer', color: '#8b5cf6' },
  { id: 'tiger', emoji: '🐯', name: 'Brave Tiger', color: '#f97316' },
  { id: 'falcon', emoji: '🦅', name: 'Sky Falcon', color: '#3b82f6' },
  { id: 'dolphin', emoji: '🐬', name: 'Smart Dolphin', color: '#14b8a6' },
  { id: 'panda', emoji: '🐼', name: 'Zen Panda', color: '#64748b' },
  { id: 'dragon', emoji: '🐉', name: 'Flame Dragon', color: '#ec4899' },
  { id: 'spark', emoji: '⚡', name: 'Spark Titan', color: '#eab308' },
];

const CODENAME_PREFIXES = [
  'Cosmic', 'Aryabhata', 'Euler', 'Pythagoras', 'Ramanujan',
  'Hypatia', 'Gauss', 'Fibonacci', 'Turing', 'Newton',
  'Matrix', 'Vector', 'Prime', 'Quantum', 'Axiom',
  'Cipher', 'Fractal', 'Infinity', 'Stellar', 'Apex'
];

const CODENAME_SUFFIXES = [
  'Ace', 'Falcon', 'Cheetah', 'Wizard', 'Titan',
  'Spark', 'Navigator', 'Master', 'Champion', 'Pioneer',
  'Architect', 'Hunter', 'Fox', 'Dragon', 'Voyager',
  'Coder', 'Solver', 'Seeker', 'Ninja', 'Rider'
];

export function generateRandomCodename(): string {
  const prefix = CODENAME_PREFIXES[Math.floor(Math.random() * CODENAME_PREFIXES.length)];
  const suffix = CODENAME_SUFFIXES[Math.floor(Math.random() * CODENAME_SUFFIXES.length)];
  const num = Math.floor(Math.random() * 90 + 10);
  return `${prefix}${suffix}_${num}`;
}
