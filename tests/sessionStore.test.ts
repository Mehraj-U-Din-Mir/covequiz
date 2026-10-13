import { describe, it, expect } from 'vitest';
import { sessionStore } from '../server/sessionStore';

describe('Authoritative Session and Team Management', () => {
  it('creates a new session with valid join code and default teams', () => {
    const session = sessionStore.createSession({
      teacherId: 'teacher_test_01',
      title: 'Classroom Math Battle',
      level: 4,
      gameId: 'l4_g01',
      mode: 'competitive',
      durationMinutes: 15,
    });

    expect(session.code).toMatch(/^CQ-\d{4}$/);
    expect(session.status).toBe('lobby');
    expect(session.teams.length).toBe(2);
    expect(session.teams[0].name).toBe('Red Falcons');
    expect(session.teams[1].name).toBe('Blue Titans');
  });

  it('allows students to join without credentials and balances teams', () => {
    const session = sessionStore.createSession({
      teacherId: 'teacher_test_02',
      title: 'Team Challenge',
      level: 2,
      gameId: 'l2_g01',
      mode: 'cooperative',
      durationMinutes: 10,
    });

    const p1 = sessionStore.joinParticipant(session.code, {
      id: 'p1',
      nickname: 'EulerAce',
      avatar: 'astronaut',
      socketId: 'sock_1',
    });
    expect(p1).not.toBeNull();
    expect(p1?.teamId).toBe('team_red');

    const p2 = sessionStore.joinParticipant(session.code, {
      id: 'p2',
      nickname: 'RamanujanPro',
      avatar: 'cheetah',
      socketId: 'sock_2',
    });
    expect(p2).not.toBeNull();
    expect(p2?.teamId).toBe('team_blue');
  });

  it('records scores accurately and updates metrics', () => {
    const session = sessionStore.createSession({
      teacherId: 'teacher_test_03',
      title: 'Scoring Test',
      level: 5,
      gameId: 'l5_g01',
      mode: 'competitive',
      durationMinutes: 10,
    });

    sessionStore.joinParticipant(session.code, {
      id: 'player_score_1',
      nickname: 'TopScorer',
      avatar: 'wizard',
      socketId: 'sock_3',
    });

    const updated = sessionStore.recordScore(session.code, 'player_score_1', 100, true, 'Arithmetic');
    expect(updated).not.toBeNull();
    expect(updated?.metrics.totalAttempts).toBe(1);
    expect(updated?.metrics.totalCorrect).toBe(1);
    expect(updated?.teams[0].totalScore).toBe(100);
  });

  it('handles status transitions cleanly', () => {
    const session = sessionStore.createSession({
      teacherId: 'teacher_test_04',
      title: 'Status Test',
      level: 6,
      gameId: 'l6_g01',
      mode: 'individual',
      durationMinutes: 10,
    });

    const active = sessionStore.updateStatus(session.code, 'active');
    expect(active?.status).toBe('active');

    const completed = sessionStore.updateStatus(session.code, 'completed');
    expect(completed?.status).toBe('completed');
  });
});
