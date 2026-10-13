import React, { useState } from 'react';
import { ClassroomSession, SessionMode, Team } from '../../types/multiplayer';
import { ALL_GAMES } from '../../data/gamesRegistry';
import { soundManager } from '../../audio/soundEffects';
import {
  GraduationCap,
  Play,
  Pause,
  StopCircle,
  Tv,
  Users,
  Download,
  BarChart3,
  Award,
  PlusCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface TeacherDashboardProps {
  onLaunchProjector: (session: ClassroomSession) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLaunchProjector }) => {
  const [activeSession, setActiveSession] = useState<ClassroomSession | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [selectedGameId, setSelectedGameId] = useState<string>('l3_g02');
  const [selectedMode, setSelectedMode] = useState<SessionMode>('competitive');
  const [durationMinutes, setDurationMinutes] = useState<number>(10);

  const levelGames = ALL_GAMES.filter((g) => g.level === selectedLevel);

  const handleCreateSession = () => {
    soundManager.playCorrect();
    const code = `CQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSession: ClassroomSession = {
      code,
      teacherId: 'teacher_demo_01',
      title: `Level ${selectedLevel} Classroom Arena`,
      level: selectedLevel,
      gameId: selectedGameId,
      mode: selectedMode,
      durationMinutes,
      status: 'lobby',
      currentRound: 1,
      maxRounds: 5,
      timeRemainingSeconds: durationMinutes * 60,
      settings: {
        allowHints: true,
        showLiveLeaderboard: true,
        teamSize: 4,
        revealSolutionsImmediately: true,
      },
      teams: [
        {
          id: 'team_red',
          name: 'Red Falcons',
          color: '#ef4444',
          totalScore: 0,
          solvedObjectives: 0,
          streak: 0,
          members: [
            { id: 'm1', nickname: 'CosmicEuler', avatar: 'astronaut', score: 0, accuracy: 100, questionsAnswered: 0, ready: true, isOnline: true },
            { id: 'm2', nickname: 'PythagorasPro', avatar: 'cheetah', score: 0, accuracy: 100, questionsAnswered: 0, ready: true, isOnline: true }
          ]
        },
        {
          id: 'team_blue',
          name: 'Blue Titans',
          color: '#3b82f6',
          totalScore: 0,
          solvedObjectives: 0,
          streak: 0,
          members: [
            { id: 'm3', nickname: 'RamanujanAce', avatar: 'wizard', score: 0, accuracy: 100, questionsAnswered: 0, ready: true, isOnline: true },
            { id: 'm4', nickname: 'HypatiaHero', avatar: 'fox', score: 0, accuracy: 100, questionsAnswered: 0, ready: true, isOnline: true }
          ]
        }
      ],
      participants: [],
      metrics: {
        totalAttempts: 24,
        totalCorrect: 20,
        skillAccuracy: {
          'Mental Arithmetic': { attempts: 14, correct: 12 },
          'Place Value': { attempts: 10, correct: 8 }
        },
        missedQuestions: [
          { prompt: 'Evaluate 7 × 8', count: 3, commonError: '54 instead of 56' }
        ]
      }
    };

    setActiveSession(newSession);
  };

  const handleStartSession = () => {
    if (!activeSession) return;
    soundManager.playClick();
    setActiveSession({ ...activeSession, status: 'active' });
  };

  const handlePauseSession = () => {
    if (!activeSession) return;
    soundManager.playClick();
    setActiveSession({ ...activeSession, status: activeSession.status === 'paused' ? 'active' : 'paused' });
  };

  const handleEndSession = () => {
    if (!activeSession) return;
    soundManager.playVictory();
    setActiveSession({ ...activeSession, status: 'completed' });
  };

  const handleExportReport = () => {
    soundManager.playClick();
    if (!activeSession) return;

    const reportData = {
      sessionCode: activeSession.code,
      title: activeSession.title,
      level: activeSession.level,
      mode: activeSession.mode,
      date: new Date().toLocaleDateString(),
      metrics: activeSession.metrics,
      teamStandings: activeSession.teams.map((t) => ({ team: t.name, score: t.totalScore }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CoveQuiz_Session_${activeSession.code}_Report.json`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <span className="badge badge-purple">
            <GraduationCap size={13} /> Classroom Intelligence
          </span>
          <span className="badge badge-green">Teacher Administration</span>
        </div>
        <h2 style={{ fontSize: '1.8rem' }}>Teacher Orchestration Desk</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Launch live mathematics sessions, project leaderboards onto classroom screens, track formative skill mastery, and generate non-identifying classroom reports.
        </p>
      </div>

      {/* Main Grid: Create or Active Session */}
      {!activeSession ? (
        <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '650px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Launch New Classroom Session</h3>

          {/* Level select */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              TARGET LEVEL
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                const lvl = Number(e.target.value);
                setSelectedLevel(lvl);
                const firstGame = ALL_GAMES.find((g) => g.level === lvl);
                if (firstGame) setSelectedGameId(firstGame.id);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'white',
                outline: 'none',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                <option key={lvl} value={lvl} style={{ background: '#121829' }}>
                  Level {lvl} (20 Games)
                </option>
              ))}
            </select>
          </div>

          {/* Game select */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              CHOOSE MATHEMATICS QUEST
            </label>
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'white',
                outline: 'none',
              }}
            >
              {levelGames.map((g) => (
                <option key={g.id} value={g.id} style={{ background: '#121829' }}>
                  {g.title} ({g.domain})
                </option>
              ))}
            </select>
          </div>

          {/* Mode select */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              MULTIPLAYER STRUCTURE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {(['individual', 'cooperative', 'competitive'] as SessionMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`btn ${selectedMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedMode(mode)}
                  style={{ textTransform: 'capitalize', padding: '0.6rem 0.4rem', fontSize: '0.85rem' }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleCreateSession}>
            <PlusCircle size={18} /> Generate Classroom Session Code
          </button>
        </div>
      ) : (
        /* Active Session Monitor */
        <div>
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.8) 0%, rgba(18, 24, 41, 0.95) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className={`badge ${activeSession.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                  STATUS: {activeSession.status.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.4rem', marginTop: '0.3rem' }}>{activeSession.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Mode: <strong style={{ textTransform: 'capitalize' }}>{activeSession.mode}</strong> • Level {activeSession.level}
                </p>
              </div>

              {/* Huge Join Code Box */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px dashed #38bdf8',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.8rem 1.6rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>STUDENT JOIN CODE</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#38bdf8', letterSpacing: '0.08em' }}>
                  {activeSession.code}
                </div>
              </div>
            </div>

            {/* Session Control Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              {activeSession.status === 'lobby' && (
                <button className="btn btn-primary" onClick={handleStartSession}>
                  <Play size={16} fill="white" /> Start Live Match
                </button>
              )}
              {activeSession.status === 'active' && (
                <button className="btn btn-secondary" onClick={handlePauseSession}>
                  <Pause size={16} /> Pause Match
                </button>
              )}
              {activeSession.status === 'paused' && (
                <button className="btn btn-primary" onClick={handlePauseSession}>
                  <Play size={16} fill="white" /> Resume Match
                </button>
              )}
              {activeSession.status !== 'completed' && (
                <button className="btn btn-accent" onClick={handleEndSession}>
                  <StopCircle size={16} /> Conclude Session
                </button>
              )}

              <button className="btn btn-secondary" onClick={() => onLaunchProjector(activeSession)}>
                <Tv size={16} color="#38bdf8" /> Open Projector Screen
              </button>

              <button className="btn btn-secondary" onClick={handleExportReport}>
                <Download size={16} /> Export Class Report
              </button>

              <button className="btn btn-secondary" onClick={() => setActiveSession(null)}>
                Close Room
              </button>
            </div>
          </div>

          {/* Real-time Team and Performance Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* Teams */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Users size={18} color="#38bdf8" />
                <h4 style={{ fontSize: '1.1rem' }}>Active Teams & Participants</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {activeSession.teams.map((tm) => (
                  <div
                    key={tm.id}
                    style={{
                      padding: '0.9rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderLeft: `4px solid ${tm.color}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: tm.color }}>{tm.name}</strong>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{tm.totalScore} pts</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {tm.members.map((m) => (
                        <span key={m.id} className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                          {m.nickname}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formative Learning Analytics */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <BarChart3 size={18} color="#10b981" />
                <h4 style={{ fontSize: '1.1rem' }}>Skill Accuracy & Error Diagnostic</h4>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  OVERALL CLASS ACCURACY
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                  {Math.round((activeSession.metrics.totalCorrect / activeSession.metrics.totalAttempts) * 100)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {activeSession.metrics.totalCorrect} of {activeSession.metrics.totalAttempts} problem attempts answered correctly
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.4rem' }}>
                  FREQUENT MISCONCEPTIONS DETECTED
                </div>
                {activeSession.metrics.missedQuestions.map((q, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    • <strong>{q.prompt}</strong>: Common bug: <em>{q.commonError}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
