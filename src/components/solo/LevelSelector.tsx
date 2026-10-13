import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { soundManager } from '../../audio/soundEffects';
import { LEVEL_SUMMARIES } from '../../data/curriculumData';
import { Sparkles, Compass } from 'lucide-react';

export const LevelSelector: React.FC = () => {
  const { profile, setLevel } = usePlayer();

  const handleSelectLevel = (lvl: number) => {
    soundManager.playClick();
    setLevel(lvl);
  };

  const getLevelStars = (lvl: number) => {
    let stars = 0;
    for (let i = 1; i <= 20; i++) {
      const gId = `l${lvl}_g${i < 10 ? '0' + i : i}`;
      stars += profile.levelProgress[gId]?.stars || 0;
    }
    return stars;
  };

  const currentSummary = LEVEL_SUMMARIES.find((s) => s.level === profile.selectedLevel);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Level Pills Bar */}
      <div className="level-selector-strip">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => {
          const isActive = profile.selectedLevel === lvl;
          const stars = getLevelStars(lvl);

          return (
            <div
              key={lvl}
              className={`level-pill ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectLevel(lvl)}
              title={`Level ${lvl} Quests (20 Games)`}
            >
              <div className="level-pill-num">L{lvl}</div>
              <div className="level-pill-label">Level {lvl}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem', fontSize: '0.7rem' }}>
                <Sparkles size={11} color={isActive ? '#ffffff' : '#f59e0b'} />
                <span>{stars}/60★</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Level Banner Card */}
      {currentSummary && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.8) 0%, rgba(18, 24, 41, 0.95) 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span className="badge badge-blue">
                <Compass size={12} /> {currentSummary.stage}
              </span>
              <span className="badge badge-purple">20 Playable Games</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>
              Level {currentSummary.level} Curriculum Stage
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '800px' }}>
              {currentSummary.focusSummary}
            </p>
          </div>

          <div style={{ textAlign: 'right', minWidth: '140px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Stage Mastery
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              {getLevelStars(currentSummary.level)} / 60 ★
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
