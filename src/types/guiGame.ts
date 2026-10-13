export type GuiGameType =
  | 'tug_of_war'
  | 'rocket_launch'
  | 'tower_builder'
  | 'maze_escape'
  | 'treasure_hunt'
  | 'number_ninja'
  | 'basketball'
  | 'arithmetic_racing'
  | 'balloon_pop'
  | 'bridge_builder'
  | 'robot_factory'
  | 'pizza_workshop'
  | 'geometry_builder'
  | 'number_line_adventure'
  | 'math_memory'
  | 'code_breaker'
  | 'factory_conveyor'
  | 'target_number'
  | 'logic_grid'
  | 'ultimate_arena';

export type StageDifficultyCategory = 'easy' | 'intermediate' | 'advanced';

export interface GuiGameStageConfig {
  stageNumber: number; // 1 to 30
  displayName: string;
  difficultyCategory: StageDifficultyCategory;
  learningObjective: string;
  numberRange: [number, number];
  operations: string[];
  constraints: Record<string, any>;
  passThreshold: number; // e.g. 80%
  timeLimitSeconds?: number;
  visualTheme?: string;
  scoringMultiplier: number;
}

export interface GuiGameDefinition {
  id: string; // e.g. 'gui_l1_tug_of_war'
  gameType: GuiGameType;
  level: number; // 1 to 5
  title: string;
  shortObjective: string;
  instructions: string;
  icon: string;
  color: string;
  nepCompetencyCode: string;
  stages: GuiGameStageConfig[]; // Exactly 30 stages
}

export type PlayMode = 'quick_challenge' | 'stage_journey';

export interface SessionConfig {
  mode: PlayMode;
  questionCount: number; // Default 10; presets 10, 15, 20, 25, 30, 35, 40, 45, 50 or custom
  selectedStageNumber?: number; // 1 to 30 for stage_journey
  isTwoPlayerMode?: boolean; // 2-Player Local Duel mode
  player1Name?: string;
  player2Name?: string;
}

export interface GuiQuestion {
  id: string;
  stageNumber: number;
  difficulty: StageDifficultyCategory;
  prompt: string;
  visualPayload: any; // Game-specific visual data (e.g., target, balloons, maze layout, etc.)
  options: (string | number)[];
  correctAnswer: string | number;
  hints: [string, string, string]; // Hint 1 Nudge, Hint 2 Strategy, Hint 3 Scaffold
  explanation: string;
  timeLimitSeconds?: number;
}

export interface GuiGameSessionStats {
  requestedQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  accuracyPercent: number;
  hintsUsed: number;
  totalScore: number;
  timeSpentSeconds: number;
  difficultyBreakdown: {
    easy: { total: number; correct: number };
    intermediate: { total: number; correct: number };
    advanced: { total: number; correct: number };
  };
  skillsPracticed: string[];
}
