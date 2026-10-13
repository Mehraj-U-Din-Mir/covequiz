export type SessionMode = 'individual' | 'cooperative' | 'competitive';

export interface TeamMember {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  accuracy: number;
  questionsAnswered: number;
  ready: boolean;
  isOnline: boolean;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: TeamMember[];
  totalScore: number;
  solvedObjectives: number;
  streak: number;
}

export interface ClassroomSession {
  code: string; // 6-digit alphanumeric join code
  teacherId: string;
  title: string;
  level: number;
  gameId: string;
  mode: SessionMode;
  durationMinutes: number;
  status: 'lobby' | 'active' | 'paused' | 'completed';
  teams: Team[];
  participants: TeamMember[];
  startedAt?: string;
  timeRemainingSeconds: number;
  currentRound: number;
  maxRounds: number;
  settings: {
    allowHints: boolean;
    showLiveLeaderboard: boolean;
    teamSize: number;
    revealSolutionsImmediately: boolean;
  };
  metrics: {
    totalAttempts: number;
    totalCorrect: number;
    skillAccuracy: Record<string, { attempts: number; correct: number }>;
    missedQuestions: Array<{ prompt: string; count: number; commonError?: string }>;
  };
}

export interface SocketClientEvents {
  'join-room': (payload: { code: string; nickname: string; avatar: string; teamId?: string }) => void;
  'submit-answer': (payload: { code: string; questionId: string; answer: string | number; isCorrect: boolean; timeMs: number }) => void;
  'teacher-action': (payload: { code: string; action: 'start' | 'pause' | 'resume' | 'end' | 'next-round' }) => void;
  'toggle-ready': (payload: { code: string; ready: boolean }) => void;
}

export interface SocketServerEvents {
  'session-update': (session: ClassroomSession) => void;
  'score-popup': (data: { teamId?: string; nickname: string; points: number; isCorrect: boolean }) => void;
  'round-started': (data: { round: number; timeRemaining: number }) => void;
  'session-ended': (data: { session: ClassroomSession; leaderboard: any[] }) => void;
  'error-message': (msg: string) => void;
}
