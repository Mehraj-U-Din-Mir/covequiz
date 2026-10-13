import { BadgeDefinition, BadgeId, QuizSessionResult, EarnedBadgeRecord } from '../types/achievement';
import { CORE_BADGES, formatBadgeDate } from '../data/achievementBadges';

/**
 * Deterministically evaluate a completed quiz session result against all 3 badge rules.
 * Each badge is evaluated independently.
 * Never awards badges solely for opening or attempting a quiz.
 */
export function evaluateQuizBadges(result: QuizSessionResult): BadgeDefinition[] {
  // Anti-abuse & completion verification:
  // Must be marked as completed, all questions attempted, minimum 3 questions, and at least 1 correct answer.
  if (
    !result.completed ||
    result.totalQuestions < 3 ||
    result.attemptedQuestions < result.totalQuestions ||
    result.correctAnswers <= 0
  ) {
    return [];
  }

  const earned: BadgeDefinition[] = [];

  // Badge 1: Calculation Champion
  // Unlock condition: Score at least 90% correct answers in a completed quiz.
  if (result.accuracyPercent >= 90) {
    earned.push(CORE_BADGES.calculation_champion);
  }

  // Badge 2: Master Mind
  // Unlock condition: Score at least 80% on a quiz containing Intermediate and Advanced questions.
  if (result.accuracyPercent >= 80 && result.hasIntermediate && result.hasAdvanced) {
    earned.push(CORE_BADGES.master_mind);
  }

  // Badge 3: Math Legend
  // Unlock condition: Score 100% on a completed quiz that includes Advanced questions.
  if (result.accuracyPercent === 100 && result.hasAdvanced) {
    earned.push(CORE_BADGES.math_legend);
  }

  return earned;
}

/**
 * Generate a deterministic event hash to prevent duplicate awards for the same achievement event.
 */
export function generateEventHash(
  studentId: string,
  gameId: string,
  timestamp: string,
  score: number,
  badgeId: BadgeId
): string {
  const raw = `${studentId}_${gameId}_${timestamp}_${score}_${badgeId}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `evt_${Math.abs(hash).toString(36)}`;
}

/**
 * Filter newly unlocked badges by checking existing student profile history.
 * Prevents duplicate awards for the same event and verifies if badge was already unlocked.
 */
export function processBadgeAwards(
  studentId: string,
  result: QuizSessionResult,
  existingBadges: EarnedBadgeRecord[]
): {
  newlyEarned: EarnedBadgeRecord[];
  allBadges: EarnedBadgeRecord[];
} {
  const eligible = evaluateQuizBadges(result);
  if (eligible.length === 0) {
    return { newlyEarned: [], allBadges: existingBadges };
  }

  const now = new Date();
  const timestamp = result.timestamp || now.toISOString();
  const displayDate = formatBadgeDate(timestamp);

  const existingBadgeIds = new Set(existingBadges.map((b) => b.badgeId));
  const existingEventHashes = new Set(existingBadges.map((b) => b.eventHash));

  const newlyEarned: EarnedBadgeRecord[] = [];

  for (const badge of eligible) {
    const evtHash = generateEventHash(
      studentId,
      result.gameId,
      timestamp,
      result.correctAnswers,
      badge.id
    );

    // Prevent duplicate awards for the same achievement event
    if (existingEventHashes.has(evtHash)) {
      continue;
    }

    // Award badge if not already unlocked by this student
    if (!existingBadgeIds.has(badge.id)) {
      const record: EarnedBadgeRecord = {
        badgeId: badge.id,
        badgeName: badge.name,
        dateEarned: timestamp,
        displayDate,
        gameId: result.gameId,
        gameTitle: result.gameTitle,
        accuracyPercent: result.accuracyPercent,
        eventHash: evtHash,
        isSynced: false, // Stored locally on device initially; marked true when synced to server
      };

      newlyEarned.push(record);
    }
  }

  return {
    newlyEarned,
    allBadges: [...existingBadges, ...newlyEarned],
  };
}
