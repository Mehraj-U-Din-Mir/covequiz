import React, { useState } from 'react';
import { GuiGameDefinition, GuiGameStageConfig, StageDifficultyCategory } from '../../types/guiGame';
import { soundManager } from '../../audio/soundEffects';
import { X, Star, CheckCircle, ChevronRight, Compass } from 'lucide-react';

interface StageSelectorModalProps {
  game: GuiGameDefinition;
  isOpen: boolean;
  onClose: () => void;
  onSelectStage: (stage: GuiGameStageConfig) => void;
}

export const StageSelectorModal: React.FC<StageSelectorModalProps> = ({
  game,
  isOpen,
  onClose,
  onSelectStage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<StageDifficultyCategory>('easy');

  if (!isOpen) return null;

  const filteredStages = game.stages.filter((s) => s.difficultyCategory === selectedCategory);

  const handlePickStage = (stg: GuiGameStageConfig) => {
    soundManager.playCorrect();
    onSelectStage(stg);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '780px', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #10b981 100%)',
            width: '100%',
          }}
        />

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Compass size={22} color="#38bdf8" />
            <div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span className="badge badge-blue">Level {game.level}</span>
                <span className="badge badge-purple">{game.title}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>Stage Journey (30 Stages)</h3>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Category Tabs: Easy (1-10), Intermediate (11-20), Advanced (21-30) */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              className={`btn ${selectedCategory === 'easy' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory('easy');
              }}
              style={{ flex: 1 }}
            >
              Easy (Stages 1–10)
            </button>
            <button
              className={`btn ${selectedCategory === 'intermediate' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory('intermediate');
              }}
              style={{ flex: 1 }}
            >
              Intermediate (Stages 11–20)
            </button>
            <button
              className={`btn ${selectedCategory === 'advanced' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory('advanced');
              }}
              style={{ flex: 1 }}
            >
              Advanced (Stages 21–30)
            </button>
          </div>

          {/* 10 Stage Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.3rem' }}>
            {filteredStages.map((stg) => (
              <div
                key={stg.stageNumber}
                onClick={() => handlePickStage(stg)}
                className="glass-panel"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.15s ease',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    #{stg.stageNumber}
                  </span>
                  <span className={`badge ${selectedCategory === 'easy' ? 'badge-green' : selectedCategory === 'intermediate' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.65rem' }}>
                    {stg.difficultyCategory}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  {stg.displayName}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  Range: [{stg.numberRange[0]} – {stg.numberRange[1]}]
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#10b981' }}>
                  <span>Pass: {stg.passThreshold}%</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
