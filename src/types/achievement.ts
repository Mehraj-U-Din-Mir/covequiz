// Achievement Badge System Types

export type BadgeId = 'calculation_champion' | 'master_mind' | 'math_legend';

export type BadgeCategory = 'Accuracy' | 'Problem-solving' | 'Excellence';

export interface BadgeDefinition {
  id: BadgeId;
  orderNumber: number;
  name: string;
  category: BadgeCategory;
  unlockCondition: string;
  description: string;
  color: string;
  secondaryColor: string;
  tagColor: string;
  iconType: 'medal' | 'brain' | 'winged_star';
}

export interface QuizSessionResult {
  sessionId?: string;
  gameId: string;
  gameTitle: string;
  level: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  accuracyPercent: number; // 0 to 100
  hasIntermediate: boolean;
  hasAdvanced: boolean;
  completed: boolean;
  timestamp?: string;
}

export interface EarnedBadgeRecord {
  badgeId: BadgeId;
  badgeName: string;
  dateEarned: string; // e.g. "2026-10-09T22:15:00.000Z"
  displayDate: string; // e.g. "October 9, 2026"
  gameId: string;
  gameTitle: string;
  accuracyPercent: number;
  eventHash: string; // Unique hash of event to prevent duplicate awards
  isSynced: boolean; // Distinguish local device progress from cross-device progress
}
