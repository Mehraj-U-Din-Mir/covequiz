import React from 'react';
import { ClassroomSession } from '../../types/multiplayer';
import { soundManager } from '../../audio/soundEffects';
import { Tv, X, Users, Trophy, Flame, Sparkles } from 'lucide-react';

interface ProjectorModeProps {
  session: ClassroomSession;
  onClose: () => void;
}

export const ProjectorMode: React.FC<ProjectorModeProps> = ({ session, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#090d16',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 3rem',
        overflow: 'hidden',
      }}
    >
      {/* Top Projector Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900 }}>
            CQ
          </div>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              COVEQUIZ LIVE ARENA
            </h1>
            <div style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 600 }}>
              {session.title} • Round {session.currentRound} of {session.maxRounds}
            </div>
          </div>
        </div>

        {/* Huge Join Code for Classroom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '3px dashed #38bdf8',
              borderRadius: 'var(--radius-lg)',
              padding: '0.8rem 2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
              JOIN AT COVEQUIZ WITH CODE:
            </div>
            <div style={{ fontSize: '3.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#38bdf8', letterSpacing: '0.08em' }}>
              {session.code}
            </div>
          </div>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            title="Exit Projector Screen"
          >
            <X size={24} /> Exit Projector
          </button>
        </div>
      </div>

      {/* Main Screen: Big Team Battle Standings */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 0' }}>
        <h2 style={{ fontSize: '1.6rem', textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          LIVE CLASSROOM TEAM STANDINGS
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {session.teams.map((tm, idx) => (
            <div
              key={tm.id}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: `3px solid ${tm.color}`,
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: `0 0 40px ${tm.color}33`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Trophy size={32} color={tm.color} />
                  <h3 style={{ fontSize: '2.2rem', color: tm.color, fontWeight: 900 }}>{tm.name}</h3>
                </div>
                <div className="badge badge-amber" style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem' }}>
                  Rank #{idx + 1}
                </div>
              </div>

              {/* Big Score Display */}
              <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {tm.totalScore}
                </div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.5rem' }}>
                  TOTAL TEAM POINTS
                </div>
              </div>

              {/* Teammates List */}
              <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.2rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 700 }}>
                  TEAMMATES ACTIVE:
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {tm.members.map((m) => (
                    <span
                      key={m.id}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.07)',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                      }}
                    >
                      {m.nickname}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer ticker */}
      <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: 'var(--text-muted)' }}>
        <div>⚡ autorun: Authority Server Scored • Instant Peer Verification</div>
        <div>MathQuest Classroom for CoveIQ Kashmir • Levels 1–8</div>
      </div>
    </div>
  );
};
