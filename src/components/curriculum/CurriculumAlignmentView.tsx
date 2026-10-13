import React, { useState } from 'react';
import { CURRICULUM_COMPETENCIES, LEVEL_SUMMARIES } from '../../data/curriculumData';
import { ALL_GAMES } from '../../data/gamesRegistry';
import { soundManager } from '../../audio/soundEffects';
import { BookOpen, Search, Filter, CheckCircle, Lightbulb, Compass, Award } from 'lucide-react';

export const CurriculumAlignmentView: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const levelSummary = LEVEL_SUMMARIES.find((s) => s.level === selectedLevel);
  const levelGames = ALL_GAMES.filter((g) => g.level === selectedLevel);

  const filteredGames = levelGames.filter((g) => {
    return (
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.learningObjective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.nepCompetencyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-blue">
            <BookOpen size={13} /> Official Framework Alignment
          </span>
          <span className="badge badge-purple">160 Mapped Games</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
          NEP 2020 & NCF-SE 2023 Mathematics Curriculum Map
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '850px' }}>
          Rigorous competency mapping aligned with the National Education Policy (NEP 2020) and National Curriculum Framework for School Education (NCF-SE 2023). Every game develops foundational number sense, mathematical reasoning, and conceptual clarity.
        </p>
      </div>

      {/* Level selector tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
          <button
            key={lvl}
            className={`btn ${selectedLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              soundManager.playClick();
              setSelectedLevel(lvl);
            }}
            style={{ minWidth: '110px', flexDirection: 'column', padding: '0.5rem 0.8rem' }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Level {lvl}</span>
            <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>20 Games</span>
          </button>
        ))}
      </div>

      {/* Stage Summary Banner */}
      {levelSummary && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.7) 0%, rgba(18, 24, 41, 0.9) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <Compass size={16} color="#38bdf8" />
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{levelSummary.stage}</span>
          </div>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.8rem', color: 'white' }}>
            {levelSummary.focusSummary}
          </p>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            KEY DEVELOPMENTAL MILESTONES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.6rem' }}>
            {levelSummary.keyMilestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Filter by competency, skill, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem 0.6rem 2.3rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'white',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Competency Games Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {filteredGames.map((g, idx) => (
          <div
            key={g.id}
            className="glass-panel"
            style={{
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  #{idx + 1}
                </span>
                <h3 style={{ fontSize: '1.1rem' }}>{g.title}</h3>
                <span className="badge badge-blue">{g.domain}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-purple">{g.cognitiveLevel}</span>
                <span className="badge badge-green">{g.nepCompetencyCode}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <strong>Learning Objective:</strong> {g.learningObjective}
            </p>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span><strong>NEP Competency:</strong> {g.nepCompetencyDescription}</span>
              <span><strong>Pedagogical Stage:</strong> {g.stage}</span>
              <span><strong>Interactive Mechanic:</strong> <code>{g.mechanic}</code></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
