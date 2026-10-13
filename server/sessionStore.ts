// Authoritative Classroom Session Store

export interface ActiveSession {
  code: string;
  teacherId: string;
  title: string;
  level: number;
  gameId: string;
  mode: 'individual' | 'cooperative' | 'competitive';
  durationMinutes: number;
  status: 'lobby' | 'active' | 'paused' | 'completed';
  createdAt: number;
  currentRound: number;
  maxRounds: number;
  teams: {
    id: string;
    name: string;
    color: string;
    totalScore: number;
    members: {
      id: string;
      nickname: string;
      avatar: string;
      score: number;
      ready: boolean;
      socketId: string;
    }[];
  }[];
  metrics: {
    totalAttempts: number;
    totalCorrect: number;
    skillAccuracy: Record<string, { attempts: number; correct: number }>;
  };
}

class SessionStore {
  private sessions: Map<string, ActiveSession> = new Map();

  public createSession(data: {
    teacherId: string;
    title: string;
    level: number;
    gameId: string;
    mode: 'individual' | 'cooperative' | 'competitive';
    durationMinutes: number;
  }): ActiveSession {
    // Generate clean 6-digit room code
    let code = `CQ-${Math.floor(1000 + Math.random() * 9000)}`;
    while (this.sessions.has(code)) {
      code = `CQ-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const session: ActiveSession = {
      code,
      teacherId: data.teacherId,
      title: data.title,
      level: data.level,
      gameId: data.gameId,
      mode: data.mode,
      durationMinutes: data.durationMinutes,
      status: 'lobby',
      createdAt: Date.now(),
      currentRound: 1,
      maxRounds: 5,
      teams: [
        { id: 'team_red', name: 'Red Falcons', color: '#ef4444', totalScore: 0, members: [] },
        { id: 'team_blue', name: 'Blue Titans', color: '#3b82f6', totalScore: 0, members: [] },
      ],
      metrics: {
        totalAttempts: 0,
        totalCorrect: 0,
        skillAccuracy: {},
      },
    };

    this.sessions.set(code, session);
    return session;
  }

  public getSession(code: string): ActiveSession | undefined {
    return this.sessions.get(code.toUpperCase());
  }

  public joinParticipant(
    code: string,
    player: { id: string; nickname: string; avatar: string; socketId: string }
  ): { session: ActiveSession; teamId: string } | null {
    const session = this.getSession(code);
    if (!session) return null;

    // Check if player already in session
    for (const team of session.teams) {
      const idx = team.members.findIndex((m) => m.id === player.id);
      if (idx !== -1) {
        team.members[idx].socketId = player.socketId;
        return { session, teamId: team.id };
      }
    }

    // Assign to team with fewer members
    const team = session.teams[0].members.length <= session.teams[1].members.length
      ? session.teams[0]
      : session.teams[1];

    team.members.push({
      id: player.id,
      nickname: player.nickname,
      avatar: player.avatar,
      score: 0,
      ready: true,
      socketId: player.socketId,
    });

    return { session, teamId: team.id };
  }

  public recordScore(
    code: string,
    playerId: string,
    points: number,
    isCorrect: boolean,
    skillName: string = 'General'
  ): ActiveSession | null {
    const session = this.getSession(code);
    if (!session) return null;

    session.metrics.totalAttempts += 1;
    if (isCorrect) session.metrics.totalCorrect += 1;

    if (!session.metrics.skillAccuracy[skillName]) {
      session.metrics.skillAccuracy[skillName] = { attempts: 0, correct: 0 };
    }
    session.metrics.skillAccuracy[skillName].attempts += 1;
    if (isCorrect) session.metrics.skillAccuracy[skillName].correct += 1;

    for (const team of session.teams) {
      const member = team.members.find((m) => m.id === playerId);
      if (member) {
        member.score += points;
        team.totalScore += points;
        break;
      }
    }

    return session;
  }

  public updateStatus(code: string, status: 'lobby' | 'active' | 'paused' | 'completed'): ActiveSession | null {
    const session = this.getSession(code);
    if (!session) return null;
    session.status = status;
    return session;
  }
}

export const sessionStore = new SessionStore();
