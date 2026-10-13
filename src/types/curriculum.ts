import { MathDomain, DevelopmentalStage, CognitiveLevel } from './game';

export interface CurriculumCompetency {
  code: string;
  level: number;
  domain: MathDomain;
  stage: DevelopmentalStage;
  standardReference: string; // e.g., 'NCF-SE C-1.2 / NEP 2020 §4.5'
  learningOutcome: string;
  observableBehavior: string;
  cognitiveDemand: CognitiveLevel;
  calculationSkills: string[];
  reasoningSkills: string[];
  classroomApplication: string;
  remedialStrategy: string;
  extensionActivity: string;
  associatedGameIds: string[];
}

export interface CurriculumSummary {
  level: number;
  stage: DevelopmentalStage;
  focusSummary: string;
  keyMilestones: string[];
  totalGames: number;
}
