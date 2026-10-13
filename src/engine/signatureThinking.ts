// The 6-Stage Signature Thinking Engine Framework
// 1. Understand -> 2. Represent -> 3. Strategise -> 4. Solve -> 5. Verify -> 6. Generalise

export interface ThinkingStage {
  id: 'understand' | 'represent' | 'strategise' | 'solve' | 'verify' | 'generalise';
  title: string;
  questionPrompt: string;
  icon: string;
  badgeColor: string;
}

export const SIGNATURE_THINKING_STAGES: ThinkingStage[] = [
  {
    id: 'understand',
    title: '1. Understand',
    questionPrompt: 'What information is given, and what exact value or relationship are we looking for?',
    icon: '🔍',
    badgeColor: '#3b82f6',
  },
  {
    id: 'represent',
    title: '2. Represent',
    questionPrompt: 'How can we represent this visually (number line, grid, bar model, diagram, or algebraic symbols)?',
    icon: '📊',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'strategise',
    title: '3. Strategise',
    questionPrompt: 'Which method is most efficient here? (e.g. decomposition, inverse operation, estimation, cancellation)',
    icon: '💡',
    badgeColor: '#ec4899',
  },
  {
    id: 'solve',
    title: '4. Solve',
    questionPrompt: 'Execute the calculation step-by-step with mathematical precision.',
    icon: '⚡',
    badgeColor: '#10b981',
  },
  {
    id: 'verify',
    title: '5. Verify',
    questionPrompt: 'Does this answer make realistic sense? Substitute it back or use quick estimation to check.',
    icon: '🛡️',
    badgeColor: '#f59e0b',
  },
  {
    id: 'generalise',
    title: '6. Generalise',
    questionPrompt: 'What underlying rule, shortcut, or mathematical property connects this to future problems?',
    icon: '🌟',
    badgeColor: '#06b6d4',
  },
];

export function getThinkingPromptsForQuestion(
  level: number,
  topic: string,
  givenData: string,
  target: string
): Record<string, string> {
  return {
    understand: `Given: ${givenData}. Target: Find ${target}.`,
    represent: level <= 2
      ? 'Picture physical counters or a 10-frame array on your visual canvas.'
      : level <= 4
      ? 'Picture a bar model or jump steps on the number line.'
      : 'Formulate a mathematical equation or geometric model.',
    strategise: level <= 2
      ? 'Use friendly numbers (make 10, count on, or double).'
      : level <= 5
      ? 'Look for multiples, common denominators, or distributive breakdown.'
      : 'Isolate variables, simplify terms, or apply the appropriate theorem.',
    solve: 'Perform each mathematical step carefully, tracking signs and units.',
    verify: 'Perform an inverse calculation check to confirm the target matches.',
    generalise: `Every time you encounter this ${topic} pattern, remember the core mathematical invariant.`
  };
}
