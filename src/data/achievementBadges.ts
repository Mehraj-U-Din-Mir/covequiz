import { BadgeDefinition, BadgeId } from '../types/achievement';

export const CORE_BADGES: Record<BadgeId, BadgeDefinition> = {
  calculation_champion: {
    id: 'calculation_champion',
    orderNumber: 1,
    name: 'Calculation Champion',
    category: 'Accuracy',
    unlockCondition: 'Score at least 90% correct answers in a completed quiz.',
    description: 'Awarded for excellent calculation accuracy and mathematical fluency.',
    color: '#f59e0b',
    secondaryColor: '#dc2626',
    tagColor: '#10b981',
    iconType: 'medal',
  },
  master_mind: {
    id: 'master_mind',
    orderNumber: 2,
    name: 'Master Mind',
    category: 'Problem-solving',
    unlockCondition: 'Score at least 80% on a quiz containing Intermediate and Advanced questions.',
    description: 'Awarded for demonstrating strong logical reasoning and problem-solving skills.',
    color: '#0284c7',
    secondaryColor: '#38bdf8',
    tagColor: '#3b82f6',
    iconType: 'brain',
  },
  math_legend: {
    id: 'math_legend',
    orderNumber: 3,
    name: 'Math Legend',
    category: 'Excellence',
    unlockCondition: 'Score 100% on a completed quiz that includes Advanced questions.',
    description: 'Awarded for flawless performance on a challenging mathematical quiz.',
    color: '#9333ea',
    secondaryColor: '#eab308',
    tagColor: '#a855f7',
    iconType: 'winged_star',
  },
};

export const CORE_BADGE_LIST: BadgeDefinition[] = [
  CORE_BADGES.calculation_champion,
  CORE_BADGES.master_mind,
  CORE_BADGES.math_legend,
];

export function formatBadgeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
