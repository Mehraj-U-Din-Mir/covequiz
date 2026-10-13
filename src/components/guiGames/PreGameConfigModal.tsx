import React, { useState } from 'react';
import { GuiGameDefinition, SessionConfig, PlayMode } from '../../types/guiGame';
import { calculateDifficultyDistribution } from '../../engine/questionCountDistributor';
import { soundManager } from '../../audio/soundEffects';
import { X, Play, Zap, Compass, Users, User, Award, BookOpen, Sparkles, Target } from 'lucide-react';

interface PreGameConfigModalProps {
  game: GuiGameDefinition;
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (config: SessionConfig) => void;
  onOpenStageSelect: () => void;
}

export const PreGameConfigModal: React.FC<PreGameConfigModalProps> = ({
  game,
  isOpen,
  onClose,
  onStartSession,
  onOpenStageSelect,
}) => {
  const [isTwoPlayer, setIsTwoPlayer] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [customInput, setCustomInput] = useState<string>('10');

  if (!isOpen) return null;

  const distribution = calculateDifficultyDistribution(questionCount);

  const handleSelectPreset = (count: number) => {
    soundManager.playClick();
    setQuestionCount(count);
    setCustomInput(String(count));
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 3 && num <= 100) {
      setQuestionCount(num);
    }
  };

  const handleStart = () => {
    soundManager.playCorrect();
    onStartSession({
      mode: 'quick_challenge',
      questionCount,
      isTwoPlayerMode: isTwoPlayer,
      player1Name: 'Player 1',
      player2Name: 'Player 2',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content single-instruction-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          width: '100%',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Accent Line */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #ec4899 100%)',
            width: '100%',
          }}
        />

        {/* Header */}
        <div className="modal-header" style={{ padding: '1rem 1.25rem 0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.2)',
              }}
            >
              {game.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">Level {game.level}</span>
                <span className="badge badge-purple">30 Stages Available</span>
                <span className="badge badge-cyan">{game.nepCompetencyCode}</span>
              </div>
              <h3
                style={{
                  fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
                  fontWeight: 800,
                  marginTop: '0.2rem',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  lineHeight: 1.25,
                }}
              >
                {game.title}
              </h3>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close dialog" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body - Single Instruction Box */}
        <div className="modal-body" style={{ padding: '1.25rem', overflowX: 'hidden' }}>
          {/* Consolidated Instruction & Game Objective Card */}
          <div
            style={{
              padding: '1rem 1.15rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(145deg, rgba(30, 41, 67, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              marginBottom: '1rem',
            }}
          >
            {/* Header: Instruction Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
              <Sparkles size={14} color="#38bdf8" />
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Game Instructions & Rules
              </span>
            </div>

            {/* Instruction Text */}
            <p
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.5,
                color: '#f1f5f9',
                fontWeight: 500,
                marginBottom: '0.75rem',
              }}
            >
              {game.instructions}
            </p>

            {/* Objective & Skill Focus */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
              }}
            >
              <Target size={15} color="#06b6d4" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: '#e0f2fe' }}>
                <strong>Mathematical Objective:</strong> {game.shortObjective}
              </div>
            </div>

            {/* Eligible Badges Notification */}
            <div
              style={{
                marginTop: '0.65rem',
                paddingTop: '0.6rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                flexWrap: 'wrap',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
              }}
            >
              <Award size={13} color="#f59e0b" />
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>Eligible for Badges:</span>
              <span style={{ color: '#cbd5e1' }}>Calculation Champion (≥90%), Master Mind (≥80%), Math Legend (100%)</span>
            </div>
          </div>

          {/* Player Mode Selector: Solo vs 2-Player Local Duel */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Choose Player Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${!isTwoPlayer ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  soundManager.playClick();
                  setIsTwoPlayer(false);
                }}
                style={{
                  padding: '0.65rem 0.85rem',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  gap: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <User size={16} />
                <span style={{ fontWeight: 700 }}>Solo Quest</span>
              </button>

              <button
                type="button"
                className={`btn ${isTwoPlayer ? 'btn-accent' : 'btn-secondary'}`}
                onClick={() => {
                  soundManager.playClick();
                  setIsTwoPlayer(true);
                }}
                style={{
                  padding: '0.65rem 0.85rem',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  gap: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Users size={16} />
                <span style={{ fontWeight: 700 }}>2-Player Local Duel</span>
              </button>
            </div>
            {isTwoPlayer && (
              <div
                style={{
                  fontSize: '0.76rem',
                  color: '#fb7185',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '0.45rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>⚡ Duel Mode: Player 1 (Blue) & Player 2 (Ruby) will alternate questions on this screen!</span>
              </div>
            )}
          </div>

          {/* Question Count Selector & Presets */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Session Questions
              </label>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: '#38bdf8',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(56, 189, 248, 0.12)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                {questionCount} Questions
              </span>
            </div>

            {/* Presets - Wrapped Cleanly with No Overflow */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`btn btn-sm ${questionCount === preset ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    minWidth: '40px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Custom count (3–100):</span>
              <input
                type="number"
                min={3}
                max={100}
                value={customInput}
                onChange={(e) => handleCustomChange(e.target.value)}
                style={{
                  width: '75px',
                  padding: '0.3rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Difficulty Distribution Breakdown Display - Guaranteed No Horizontal Scroll */}
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed var(--border-subtle)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Difficulty Scaling (30% Easy • 40% Inter • 30% Adv)
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                Easy: {distribution.easyCount} Qs
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                Inter: {distribution.intermediateCount} Qs
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                Adv: {distribution.advancedCount} Qs
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                soundManager.playClick();
                onOpenStageSelect();
              }}
              style={{ gap: '0.4rem', fontSize: '0.82rem' }}
              title="Explore all 30 stages individually"
            >
              <Compass size={15} color="#38bdf8" />
              <span>Browse 30 Stages</span>
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStart}
                style={{
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 18px rgba(99, 102, 241, 0.5)',
                }}
              >
                <Play size={16} fill="white" /> Launch Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

