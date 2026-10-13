import { GuiGameDefinition, GuiGameType } from '../types/guiGame';
import { generate30StagesForGame } from './stageConfigEngine';

export const GUI_GAME_METADATA: Record<
  GuiGameType,
  { baseTitle: string; icon: string; color: string; objective: string; instructions: string }
> = {
  tug_of_war: {
    baseTitle: 'Mathematics Tug of War',
    icon: '🪢',
    color: '#ef4444',
    objective: 'Pull the victory rope across the arena line by solving mathematical challenges.',
    instructions: 'Each correct answer pulls the rope towards your team. Incorrect answers create drag. First team to pull the marker across the line wins the match!',
  },
  rocket_launch: {
    baseTitle: 'Number Rocket Launch',
    icon: '🚀',
    color: '#06b6d4',
    objective: 'Fuel and launch the space rocket by computing propulsion coordinates.',
    instructions: 'Solve mathematical challenges to fill fuel tanks, engage thrusters, and steer the rocket out of the atmosphere.',
  },
  tower_builder: {
    baseTitle: 'Math Tower Builder',
    icon: '🏗️',
    color: '#f59e0b',
    objective: 'Stack architectural blocks to construct the tallest structurally sound tower.',
    instructions: 'Calculate block dimensions and matching formulas. Correct placements build higher stories; errors trigger balance alerts.',
  },
  maze_escape: {
    baseTitle: 'Mathematics Maze Escape',
    icon: '🧭',
    color: '#10b981',
    objective: 'Navigate through dungeon labyrinth corridors by choosing valid mathematical pathways.',
    instructions: 'Evaluate path markers and unlock reinforced gate locks by solving the mathematical gate codes.',
  },
  treasure_hunt: {
    baseTitle: 'Math Treasure Hunt',
    icon: '🗺️',
    color: '#8b5cf6',
    objective: 'Explore uncharted island waypoints, unlock pirate chests, and collect clues.',
    instructions: 'Follow navigation clues step-by-step. Each opened chest provides a key coordinate for the ultimate treasure vault.',
  },
  number_ninja: {
    baseTitle: 'Number Ninja',
    icon: '⚔️',
    color: '#ec4899',
    objective: 'Slice falling mathematical expressions and targets before they drop past the line.',
    instructions: 'Click or strike the numbers that satisfy the stated condition (e.g. multiples, even sums, target values).',
  },
  basketball: {
    baseTitle: 'Math Basketball Challenge',
    icon: '🏀',
    color: '#f97316',
    objective: 'Aim and sink basketballs into the correct target hoops.',
    instructions: 'Calculate the shot answer and select the corresponding hoop trajectory to score swishes and 3-pointers.',
  },
  arithmetic_racing: {
    baseTitle: 'Arithmetic Racing',
    icon: '🏎️',
    color: '#3b82f6',
    objective: 'Pilot a high-speed racing machine across circuit checkpoints.',
    instructions: 'Answer checkpoint math gates to boost turbo velocity, overtake opponents, and cross the checkered finish line.',
  },
  balloon_pop: {
    baseTitle: 'Balloon Pop Mathematics',
    icon: '🎈',
    color: '#a855f7',
    objective: 'Pop balloons displaying values that satisfy the target mathematical property.',
    instructions: 'Identify which floating balloons meet the challenge rule and pop them in rapid succession.',
  },
  bridge_builder: {
    baseTitle: 'Number Bridge Builder',
    icon: '🌉',
    color: '#14b8a6',
    objective: 'Construct structural bridge arches across canyons by calculating truss dimensions.',
    instructions: 'Place missing girder values to complete the suspension bridge and let the transport train safely cross.',
  },
  robot_factory: {
    baseTitle: 'Math Robot Factory',
    icon: '🤖',
    color: '#6366f1',
    objective: 'Program an automated factory robot using sequential mathematical commands.',
    instructions: 'Formulate movement and collection instructions by computing grid coordinates and directional offsets.',
  },
  pizza_workshop: {
    baseTitle: 'Fraction Pizza Workshop',
    icon: '🍕',
    color: '#f43f5e',
    objective: 'Bake and assemble pizzas with exact fraction slices and proportional toppings.',
    instructions: 'Match customer orders using visual fraction pieces, equivalent fractions, and slice partitions.',
  },
  geometry_builder: {
    baseTitle: 'Shape & Geometry Builder',
    icon: '📐',
    color: '#0284c7',
    objective: 'Assemble, rotate, and snap geometric shapes to complete composite silhouettes.',
    instructions: 'Identify sides, vertices, angles, perimeter, and symmetry to build requested geometric models.',
  },
  number_line_adventure: {
    baseTitle: 'Number Line Adventure',
    icon: '🐰',
    color: '#84cc16',
    objective: 'Hop along linear paths to collect stars and reach exact target coordinates.',
    instructions: 'Calculate step sizes, skip hops, and forward/backward intervals along the continuous number line.',
  },
  math_memory: {
    baseTitle: 'Math Memory Match',
    icon: '🃏',
    color: '#d946ef',
    objective: 'Flip and pair memory cards displaying equivalent expressions and values.',
    instructions: 'Turn over two cards at a time to find twin representations (e.g. 7×6 and 42, or 1/2 and 50%).',
  },
  code_breaker: {
    baseTitle: 'Code Breaker Mathematics',
    icon: '🔐',
    color: '#eab308',
    objective: 'Crack vault combinations by solving arithmetic and deduction cipher wheels.',
    instructions: 'Uncover digit clues one by one by solving modular arithmetic, place-value pins, and pattern codes.',
  },
  factory_conveyor: {
    baseTitle: 'Math Factory Conveyor',
    icon: '📦',
    color: '#059669',
    objective: 'Sort conveyor belt packages into correct bins based on mathematical criteria.',
    instructions: 'Inspect incoming items and route them to Bin A, Bin B, or Bin C using divisibility, parity, and value rules.',
  },
  target_number: {
    baseTitle: 'Target Number Challenge',
    icon: '🎯',
    color: '#4f46e5',
    objective: 'Combine given numbers with basic operations to hit an exact target total.',
    instructions: 'Select from available numbers and arithmetic symbols (+, -, ×, ÷) to formulate an equation matching the bullseye.',
  },
  logic_grid: {
    baseTitle: 'Logic Grid Detective',
    icon: '🕵️‍♂️',
    color: '#64748b',
    objective: 'Deduce hidden facts and eliminate contradictions in a mathematical detective grid.',
    instructions: 'Read evidence clues, cross out false combinations, and find the unique true assignment for each subject.',
  },
  ultimate_arena: {
    baseTitle: 'Ultimate Mathematics Arena',
    icon: '🏆',
    color: '#e11d48',
    objective: 'Conquer a multi-phase championship battle combining arithmetic, speed, and strategy.',
    instructions: 'Advance through phase trials, deflect boss attacks with accurate calculations, and solve the capstone puzzle.',
  },
};

export const GUI_GAME_TYPES: GuiGameType[] = [
  'tug_of_war',
  'rocket_launch',
  'tower_builder',
  'maze_escape',
  'treasure_hunt',
  'number_ninja',
  'basketball',
  'arithmetic_racing',
  'balloon_pop',
  'bridge_builder',
  'robot_factory',
  'pizza_workshop',
  'geometry_builder',
  'number_line_adventure',
  'math_memory',
  'code_breaker',
  'factory_conveyor',
  'target_number',
  'logic_grid',
  'ultimate_arena',
];

export function buildAll100GuiGames(): GuiGameDefinition[] {
  const allGames: GuiGameDefinition[] = [];

  for (let lvl = 1; lvl <= 5; lvl++) {
    for (const gType of GUI_GAME_TYPES) {
      const meta = GUI_GAME_METADATA[gType];
      const stages = generate30StagesForGame(gType, lvl);

      allGames.push({
        id: `gui_l${lvl}_${gType}`,
        gameType: gType,
        level: lvl,
        title: `L${lvl}: ${meta.baseTitle}`,
        shortObjective: meta.objective,
        instructions: meta.instructions,
        icon: meta.icon,
        color: meta.color,
        nepCompetencyCode: `NEP-L${lvl}-GUI-${gType.toUpperCase()}`,
        stages, // Exactly 30 stages
      });
    }
  }

  return allGames;
}

export const ALL_100_GUI_GAMES: GuiGameDefinition[] = buildAll100GuiGames();

export function getGuiGamesByLevel(level: number): GuiGameDefinition[] {
  return ALL_100_GUI_GAMES.filter((g) => g.level === level);
}

export function getGuiGameById(id: string): GuiGameDefinition | undefined {
  return ALL_100_GUI_GAMES.find((g) => g.id === id);
}
