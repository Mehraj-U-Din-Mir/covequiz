export type MathDomain =
  | 'Number Sense'
  | 'Arithmetic'
  | 'Fractions & Decimals'
  | 'Geometry & Spatial'
  | 'Measurement'
  | 'Algebra'
  | 'Data & Probability'
  | 'Financial & Everyday'
  | 'Logic & Patterns';

export type CognitiveLevel =
  | 'Remembering & Understanding'
  | 'Applying & Calculating'
  | 'Analyzing & Reasoning'
  | 'Evaluating & Optimizing'
  | 'Creating & Modelling';

export type DevelopmentalStage =
  | 'Foundational (Prep/L1)'
  | 'Preparatory (L2-L3)'
  | 'Middle Stage (L4-L6)'
  | 'Secondary Foundations (L7-L8)';

export type GameMechanic =
  | 'number_line'
  | 'balance_scale'
  | 'fraction_visualizer'
  | 'grid_puzzle'
  | 'rapid_blitz'
  | 'drag_drop_sort'
  | 'money_cashier'
  | 'clock_face'
  | 'geometry_shapes'
  | 'factor_tree'
  | 'coordinate_plane'
  | 'pattern_matrix'
  | 'algebra_tiles'
  | 'escape_lock'
  | 'equation_balancer'
  | 'card_match'
  | 'interactive_slider'
  | 'standard_challenge';

export interface QuestionData {
  id: string;
  prompt: string;
  visualData?: any;
  options?: (string | number)[];
  correctAnswer: string | number;
  acceptedAnswers?: (string | number)[];
  difficulty: 1 | 2 | 3; // 1: Conceptual / Foundation, 2: Core Fluency, 3: Stretch / Multi-step
  hints: [string, string, string]; // Hint 1: Nudge, Hint 2: Strategy, Hint 3: Scaffold
  workedSolution: {
    steps: string[];
    alternativeMethod?: string;
    verificationTip: string;
  };
  explanation: string;
  reflectionPrompt?: string;
}

export interface GameDefinition {
  id: string;
  title: string;
  level: number; // 1 to 8
  domain: MathDomain;
  stage: DevelopmentalStage;
  cognitiveLevel: CognitiveLevel;
  mechanic: GameMechanic;
  learningObjective: string;
  rules: string;
  tutorialTip: string;
  nepCompetencyCode: string;
  nepCompetencyDescription: string;
  tags: string[];
  prerequisites: string[];
  roundsPerSession: number;
}

import { EarnedBadgeRecord } from './achievement';

export interface PlayerProfile {
  id: string;
  nickname: string;
  avatar: string;
  selectedLevel: number;
  totalScore: number;
  starsEarned: number;
  gamesCompleted: number;
  streakCount: number;
  unlockedAchievements: string[];
  earnedBadges?: EarnedBadgeRecord[];
  levelProgress: Record<string, { highScore: number; stars: number; completedAt: string }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  reqCount: number;
}
